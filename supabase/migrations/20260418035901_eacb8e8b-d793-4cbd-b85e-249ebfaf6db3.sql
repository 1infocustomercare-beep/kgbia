-- 1. Catalogo costi per azione
CREATE TABLE IF NOT EXISTS public.seller_action_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text UNIQUE NOT NULL,
  label text NOT NULL,
  credit_cost integer NOT NULL DEFAULT 1,
  cost_eur_estimate numeric(10,4) DEFAULT 0,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.seller_action_costs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone authenticated can read costs" ON public.seller_action_costs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "super_admin can manage costs" ON public.seller_action_costs
  FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- Seed costi reali (basati su prezzo Gemini + Firecrawl + Google Maps)
INSERT INTO public.seller_action_costs (action, label, credit_cost, cost_eur_estimate, description) VALUES
  ('lead_search',              'Ricerca Lead',           1, 0.05, 'Ricerca su Google Maps + OpenStreetMap'),
  ('scan_prospect',            'Scansione Prospect',     2, 0.12, 'Analisi Instagram + sito con AI'),
  ('enrich_lead_social',       'Arricchimento Social',   2, 0.10, 'Estrazione dati social + email'),
  ('deep_lead_analysis',       'Analisi Approfondita',   3, 0.20, 'Audit completo SEO + presenza online'),
  ('generate_demo_from_lead',  'Demo Factory',           5, 0.45, 'Generazione sito demo + admin + script call')
ON CONFLICT (action) DO UPDATE SET
  credit_cost = EXCLUDED.credit_cost,
  cost_eur_estimate = EXCLUDED.cost_eur_estimate,
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  updated_at = now();

-- 2. Aggiungo metadata e costo stimato a demo_credit_usage
ALTER TABLE public.demo_credit_usage 
  ADD COLUMN IF NOT EXISTS cost_eur_estimate numeric(10,4) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS action_label text;

CREATE INDEX IF NOT EXISTS idx_demo_credit_usage_user_date 
  ON public.demo_credit_usage(user_id, created_at DESC);

-- 3. Acquisti pacchetti crediti (Stripe)
CREATE TABLE IF NOT EXISTS public.partner_credit_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  package_label text NOT NULL,
  credits_purchased integer NOT NULL,
  amount_eur numeric(10,2) NOT NULL,
  stripe_session_id text,
  stripe_payment_intent text,
  status text NOT NULL DEFAULT 'pending',
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.partner_credit_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users see own purchases" ON public.partner_credit_purchases
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "users insert own purchases" ON public.partner_credit_purchases
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "super_admin manages purchases" ON public.partner_credit_purchases
  FOR UPDATE TO authenticated USING (public.is_super_admin());

-- 4. RPC atomica per consumare crediti con verifica saldo
CREATE OR REPLACE FUNCTION public.consume_seller_credits(
  p_action text,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_cost integer;
  v_eur numeric;
  v_label text;
  v_balance integer;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthorized');
  END IF;

  SELECT credit_cost, cost_eur_estimate, label
    INTO v_cost, v_eur, v_label
  FROM public.seller_action_costs
  WHERE action = p_action AND is_active = true;

  IF v_cost IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unknown_action', 'action', p_action);
  END IF;

  -- Lock row per evitare race condition
  SELECT balance INTO v_balance
  FROM public.partner_demo_credits
  WHERE user_id = v_user_id
  FOR UPDATE;

  IF v_balance IS NULL THEN
    INSERT INTO public.partner_demo_credits (user_id, balance) VALUES (v_user_id, 0);
    v_balance := 0;
  END IF;

  IF v_balance < v_cost THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'insufficient_credits',
      'required', v_cost,
      'balance', v_balance
    );
  END IF;

  UPDATE public.partner_demo_credits
  SET balance = balance - v_cost, updated_at = now()
  WHERE user_id = v_user_id;

  INSERT INTO public.demo_credit_usage (user_id, action, credits_used, cost_eur_estimate, action_label, metadata)
  VALUES (v_user_id, p_action, v_cost, v_eur, v_label, COALESCE(p_metadata, '{}'::jsonb));

  RETURN jsonb_build_object(
    'success', true,
    'credits_used', v_cost,
    'cost_eur', v_eur,
    'remaining_balance', v_balance - v_cost,
    'action_label', v_label
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.consume_seller_credits(text, jsonb) TO authenticated;

-- 5. Helper saldo
CREATE OR REPLACE FUNCTION public.get_seller_credit_balance(p_user_id uuid DEFAULT auth.uid())
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(balance, 0) FROM public.partner_demo_credits WHERE user_id = p_user_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_seller_credit_balance(uuid) TO authenticated;