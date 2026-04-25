
-- 1. Tabella di cache delle ricerche lead per dedup crediti
CREATE TABLE IF NOT EXISTS public.lead_search_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  fingerprint TEXT NOT NULL,
  action TEXT NOT NULL DEFAULT 'lead_search',
  result_count INTEGER NOT NULL DEFAULT 0,
  results JSONB NOT NULL DEFAULT '[]'::jsonb,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '15 minutes'),
  hit_count INTEGER NOT NULL DEFAULT 0,
  last_hit_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS lead_search_cache_user_fp_idx
  ON public.lead_search_cache (user_id, fingerprint);
CREATE INDEX IF NOT EXISTS lead_search_cache_expires_idx
  ON public.lead_search_cache (expires_at);

ALTER TABLE public.lead_search_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lead_search_cache_owner_select" ON public.lead_search_cache;
CREATE POLICY "lead_search_cache_owner_select" ON public.lead_search_cache
  FOR SELECT USING (auth.uid() = user_id OR public.is_super_admin());

DROP POLICY IF EXISTS "lead_search_cache_owner_insert" ON public.lead_search_cache;
CREATE POLICY "lead_search_cache_owner_insert" ON public.lead_search_cache
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "lead_search_cache_owner_update" ON public.lead_search_cache;
CREATE POLICY "lead_search_cache_owner_update" ON public.lead_search_cache
  FOR UPDATE USING (auth.uid() = user_id OR public.is_super_admin());

DROP POLICY IF EXISTS "lead_search_cache_owner_delete" ON public.lead_search_cache;
CREATE POLICY "lead_search_cache_owner_delete" ON public.lead_search_cache
  FOR DELETE USING (auth.uid() = user_id OR public.is_super_admin());

-- 2. RPC: consuma crediti solo se la fingerprint non è già in cache valida
CREATE OR REPLACE FUNCTION public.consume_seller_credits_dedup(
  p_user_id UUID,
  p_action TEXT,
  p_fingerprint TEXT,
  p_ttl_minutes INTEGER DEFAULT 15,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cache RECORD;
  v_consume JSONB;
BEGIN
  IF p_user_id IS NULL OR p_action IS NULL OR p_fingerprint IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'missing_params');
  END IF;

  -- Cache hit valido?
  SELECT id, result_count, results, expires_at, hit_count
    INTO v_cache
  FROM public.lead_search_cache
  WHERE user_id = p_user_id
    AND fingerprint = p_fingerprint
    AND action = p_action
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_cache.id IS NOT NULL THEN
    UPDATE public.lead_search_cache
       SET hit_count = hit_count + 1,
           last_hit_at = now()
     WHERE id = v_cache.id;

    RETURN jsonb_build_object(
      'success', true,
      'cached', true,
      'credits_used', 0,
      'cost_eur', 0,
      'cache_id', v_cache.id,
      'result_count', v_cache.result_count,
      'expires_at', v_cache.expires_at,
      'hit_count', v_cache.hit_count + 1
    );
  END IF;

  -- Nessuna cache: consumi normali (riusa funzione esistente)
  v_consume := public.consume_seller_credits_for(p_user_id, p_action, p_metadata || jsonb_build_object('fingerprint', p_fingerprint));
  IF NOT COALESCE((v_consume->>'success')::boolean, false) THEN
    RETURN v_consume;
  END IF;

  RETURN v_consume || jsonb_build_object('cached', false, 'fingerprint', p_fingerprint);
END;
$$;

-- 3. RPC: lettura cache (solo proprietario / super admin)
CREATE OR REPLACE FUNCTION public.lead_search_cache_get(
  p_user_id UUID,
  p_fingerprint TEXT,
  p_action TEXT DEFAULT 'lead_search'
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row RECORD;
BEGIN
  SELECT result_count, results, meta, expires_at, hit_count
    INTO v_row
  FROM public.lead_search_cache
  WHERE user_id = p_user_id
    AND fingerprint = p_fingerprint
    AND action = p_action
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_row IS NULL THEN
    RETURN jsonb_build_object('hit', false);
  END IF;

  RETURN jsonb_build_object(
    'hit', true,
    'result_count', v_row.result_count,
    'results', v_row.results,
    'meta', v_row.meta,
    'expires_at', v_row.expires_at,
    'hit_count', v_row.hit_count
  );
END;
$$;

-- 4. RPC: salva/aggiorna cache
CREATE OR REPLACE FUNCTION public.lead_search_cache_put(
  p_user_id UUID,
  p_fingerprint TEXT,
  p_action TEXT,
  p_results JSONB,
  p_meta JSONB DEFAULT '{}'::jsonb,
  p_ttl_minutes INTEGER DEFAULT 15
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_count INTEGER;
  v_ttl INTEGER := GREATEST(1, LEAST(COALESCE(p_ttl_minutes, 15), 240));
BEGIN
  v_count := COALESCE(jsonb_array_length(p_results), 0);

  INSERT INTO public.lead_search_cache (
    user_id, fingerprint, action, result_count, results, meta, expires_at
  ) VALUES (
    p_user_id, p_fingerprint, COALESCE(p_action, 'lead_search'),
    v_count, COALESCE(p_results, '[]'::jsonb), COALESCE(p_meta, '{}'::jsonb),
    now() + make_interval(mins => v_ttl)
  )
  ON CONFLICT (user_id, fingerprint) DO UPDATE
    SET result_count = EXCLUDED.result_count,
        results = EXCLUDED.results,
        meta = EXCLUDED.meta,
        expires_at = EXCLUDED.expires_at,
        action = EXCLUDED.action
  RETURNING id INTO v_id;

  -- Pulizia opportunistica: max 50 voci per utente
  DELETE FROM public.lead_search_cache
   WHERE user_id = p_user_id
     AND id NOT IN (
       SELECT id FROM public.lead_search_cache
        WHERE user_id = p_user_id
        ORDER BY created_at DESC
        LIMIT 50
     );

  RETURN v_id;
END;
$$;
