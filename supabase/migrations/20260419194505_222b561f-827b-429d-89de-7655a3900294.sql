-- 1) Tetto mensile + soglia allarme su partner_demo_credits
ALTER TABLE public.partner_demo_credits
  ADD COLUMN IF NOT EXISTS monthly_cap integer,
  ADD COLUMN IF NOT EXISTS alert_threshold_pct integer DEFAULT 80,
  ADD COLUMN IF NOT EXISTS auto_block_on_cap boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS notes text;

-- 2) Tabella alert crediti
CREATE TABLE IF NOT EXISTS public.seller_credit_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  alert_type text NOT NULL,
  threshold_pct integer,
  credits_used_month integer NOT NULL DEFAULT 0,
  monthly_cap integer,
  message text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_seller_credit_alerts_user_date
  ON public.seller_credit_alerts(user_id, created_at DESC);

ALTER TABLE public.seller_credit_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own alerts" ON public.seller_credit_alerts;
CREATE POLICY "Users read own alerts"
  ON public.seller_credit_alerts FOR SELECT
  USING (auth.uid() = user_id OR public.is_super_admin());

DROP POLICY IF EXISTS "Super admin manages alerts" ON public.seller_credit_alerts;
CREATE POLICY "Super admin manages alerts"
  ON public.seller_credit_alerts FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "System inserts alerts" ON public.seller_credit_alerts;
CREATE POLICY "System inserts alerts"
  ON public.seller_credit_alerts FOR INSERT
  WITH CHECK (true);

-- 3) Funzione: crediti consumati nel mese corrente
CREATE OR REPLACE FUNCTION public.get_user_monthly_credits_used(p_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(SUM(credits_used), 0)::integer
  FROM public.demo_credit_usage
  WHERE user_id = p_user_id
    AND credits_used > 0
    AND created_at >= date_trunc('month', now());
$$;

-- 4) Aggiorna consume_seller_credits con check cap mensile + alert
CREATE OR REPLACE FUNCTION public.consume_seller_credits(p_action text, p_metadata jsonb DEFAULT '{}'::jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_cost integer;
  v_eur numeric;
  v_label text;
  v_balance integer;
  v_cap integer;
  v_threshold_pct integer;
  v_auto_block boolean;
  v_used_month integer;
  v_owner_ids constant uuid[] := ARRAY[
    '1da0ee45-094a-4728-996e-6143d55a7f9d'::uuid,
    'd81cfdd7-3da8-463a-be3a-6e05474ba1ac'::uuid
  ];
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

  -- Bypass owner illimitato
  IF v_user_id = ANY(v_owner_ids) THEN
    INSERT INTO public.demo_credit_usage (user_id, action, credits_used, cost_eur_estimate, action_label, metadata)
    VALUES (v_user_id, p_action, 0, 0, v_label, COALESCE(p_metadata, '{}'::jsonb) || jsonb_build_object('owner_bypass', true));
    RETURN jsonb_build_object('success', true, 'credits_used', 0, 'cost_eur', 0, 'remaining_balance', 999999, 'action_label', v_label, 'owner_bypass', true);
  END IF;

  SELECT balance, monthly_cap, alert_threshold_pct, auto_block_on_cap
    INTO v_balance, v_cap, v_threshold_pct, v_auto_block
  FROM public.partner_demo_credits
  WHERE user_id = v_user_id FOR UPDATE;

  IF v_balance IS NULL THEN
    INSERT INTO public.partner_demo_credits (user_id, balance) VALUES (v_user_id, 0);
    v_balance := 0;
  END IF;

  IF v_balance < v_cost THEN
    RETURN jsonb_build_object('success', false, 'error', 'insufficient_credits', 'required', v_cost, 'balance', v_balance);
  END IF;

  -- Check tetto mensile
  IF v_cap IS NOT NULL AND v_cap > 0 THEN
    v_used_month := public.get_user_monthly_credits_used(v_user_id);
    IF v_used_month + v_cost > v_cap THEN
      INSERT INTO public.seller_credit_alerts (user_id, alert_type, credits_used_month, monthly_cap, message)
      VALUES (v_user_id, 'cap_exceeded', v_used_month, v_cap,
        'Tetto mensile ' || v_cap || ' crediti raggiunto (usati: ' || v_used_month || ')');
      IF COALESCE(v_auto_block, false) THEN
        RETURN jsonb_build_object('success', false, 'error', 'monthly_cap_reached', 'cap', v_cap, 'used', v_used_month);
      END IF;
    END IF;
  END IF;

  UPDATE public.partner_demo_credits SET balance = balance - v_cost, updated_at = now() WHERE user_id = v_user_id;
  INSERT INTO public.demo_credit_usage (user_id, action, credits_used, cost_eur_estimate, action_label, metadata)
  VALUES (v_user_id, p_action, v_cost, v_eur, v_label, COALESCE(p_metadata, '{}'::jsonb));

  -- Alert soglia (es. 80% del cap)
  IF v_cap IS NOT NULL AND v_cap > 0 AND v_threshold_pct IS NOT NULL THEN
    v_used_month := COALESCE(v_used_month, public.get_user_monthly_credits_used(v_user_id)) + v_cost;
    IF v_used_month * 100 / v_cap >= v_threshold_pct
       AND NOT EXISTS (
         SELECT 1 FROM public.seller_credit_alerts
         WHERE user_id = v_user_id
           AND alert_type = 'threshold_reached'
           AND created_at >= date_trunc('month', now())
       )
    THEN
      INSERT INTO public.seller_credit_alerts (user_id, alert_type, threshold_pct, credits_used_month, monthly_cap, message)
      VALUES (v_user_id, 'threshold_reached', v_threshold_pct, v_used_month, v_cap,
        'Raggiunto ' || v_threshold_pct || '% del tetto mensile (' || v_used_month || '/' || v_cap || ')');
    END IF;
  END IF;

  RETURN jsonb_build_object('success', true, 'credits_used', v_cost, 'cost_eur', v_eur, 'remaining_balance', v_balance - v_cost, 'action_label', v_label);
END;
$function$;

-- 5) Funzione super admin per impostare cap/soglie/notes su un utente
CREATE OR REPLACE FUNCTION public.super_admin_set_credit_limits(
  p_target_user_id uuid,
  p_monthly_cap integer DEFAULT NULL,
  p_alert_threshold_pct integer DEFAULT NULL,
  p_auto_block boolean DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthorized');
  END IF;
  IF NOT public.is_super_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'forbidden');
  END IF;

  INSERT INTO public.partner_demo_credits (user_id, balance)
  VALUES (p_target_user_id, 0)
  ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.partner_demo_credits
  SET
    monthly_cap = COALESCE(p_monthly_cap, monthly_cap),
    alert_threshold_pct = COALESCE(p_alert_threshold_pct, alert_threshold_pct),
    auto_block_on_cap = COALESCE(p_auto_block, auto_block_on_cap),
    notes = COALESCE(p_notes, notes),
    updated_at = now()
  WHERE user_id = p_target_user_id;

  RETURN jsonb_build_object('success', true);
END;
$$;