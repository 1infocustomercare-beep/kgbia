-- Service-role variant of consume_seller_credits: accepts explicit user_id.
-- Used by background jobs (arianna-autopilot, cron) that don't have auth.uid().
CREATE OR REPLACE FUNCTION public.consume_seller_credits_for(
  p_user_id uuid,
  p_action text,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
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
  IF p_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'missing_user_id');
  END IF;

  SELECT credit_cost, cost_eur_estimate, label
    INTO v_cost, v_eur, v_label
  FROM public.seller_action_costs
  WHERE action = p_action AND is_active = true;

  IF v_cost IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unknown_action', 'action', p_action);
  END IF;

  -- Owner bypass (illimitato)
  IF p_user_id = ANY(v_owner_ids) THEN
    INSERT INTO public.demo_credit_usage (user_id, action, credits_used, cost_eur_estimate, action_label, metadata)
    VALUES (p_user_id, p_action, 0, 0, v_label, COALESCE(p_metadata, '{}'::jsonb) || jsonb_build_object('owner_bypass', true));
    RETURN jsonb_build_object('success', true, 'credits_used', 0, 'cost_eur', 0, 'remaining_balance', 999999, 'action_label', v_label, 'owner_bypass', true);
  END IF;

  SELECT balance, monthly_cap, alert_threshold_pct, auto_block_on_cap
    INTO v_balance, v_cap, v_threshold_pct, v_auto_block
  FROM public.partner_demo_credits
  WHERE user_id = p_user_id FOR UPDATE;

  IF v_balance IS NULL THEN
    INSERT INTO public.partner_demo_credits (user_id, balance) VALUES (p_user_id, 0);
    v_balance := 0;
  END IF;

  IF v_balance < v_cost THEN
    RETURN jsonb_build_object('success', false, 'error', 'insufficient_credits', 'required', v_cost, 'balance', v_balance);
  END IF;

  IF v_cap IS NOT NULL AND v_cap > 0 THEN
    v_used_month := public.get_user_monthly_credits_used(p_user_id);
    IF v_used_month + v_cost > v_cap THEN
      INSERT INTO public.seller_credit_alerts (user_id, alert_type, credits_used_month, monthly_cap, message)
      VALUES (p_user_id, 'cap_exceeded', v_used_month, v_cap,
        'Tetto mensile ' || v_cap || ' crediti raggiunto (usati: ' || v_used_month || ')');
      IF COALESCE(v_auto_block, false) THEN
        RETURN jsonb_build_object('success', false, 'error', 'monthly_cap_reached', 'cap', v_cap, 'used', v_used_month);
      END IF;
    END IF;
  END IF;

  UPDATE public.partner_demo_credits SET balance = balance - v_cost, updated_at = now() WHERE user_id = p_user_id;
  INSERT INTO public.demo_credit_usage (user_id, action, credits_used, cost_eur_estimate, action_label, metadata)
  VALUES (p_user_id, p_action, v_cost, v_eur, v_label, COALESCE(p_metadata, '{}'::jsonb));

  IF v_cap IS NOT NULL AND v_cap > 0 AND v_threshold_pct IS NOT NULL THEN
    v_used_month := COALESCE(v_used_month, public.get_user_monthly_credits_used(p_user_id)) + v_cost;
    IF v_used_month * 100 / v_cap >= v_threshold_pct
       AND NOT EXISTS (
         SELECT 1 FROM public.seller_credit_alerts
         WHERE user_id = p_user_id
           AND alert_type = 'threshold_reached'
           AND created_at >= date_trunc('month', now())
       )
    THEN
      INSERT INTO public.seller_credit_alerts (user_id, alert_type, threshold_pct, credits_used_month, monthly_cap, message)
      VALUES (p_user_id, 'threshold_reached', v_threshold_pct, v_used_month, v_cap,
        'Raggiunto ' || v_threshold_pct || '% del tetto mensile (' || v_used_month || '/' || v_cap || ')');
    END IF;
  END IF;

  RETURN jsonb_build_object('success', true, 'credits_used', v_cost, 'cost_eur', v_eur, 'remaining_balance', v_balance - v_cost, 'action_label', v_label);
END;
$$;

-- Only service_role can call this (background jobs)
REVOKE ALL ON FUNCTION public.consume_seller_credits_for(uuid, text, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_seller_credits_for(uuid, text, jsonb) TO service_role;