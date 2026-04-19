-- 1. Trigger: i nuovi super_admin NON ricevono più crediti illimitati automatici (ricevono 50 come i partner)
CREATE OR REPLACE FUNCTION public.grant_partner_demo_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.role IN ('partner', 'team_leader', 'super_admin') THEN
    INSERT INTO public.partner_demo_credits (user_id, balance)
    VALUES (NEW.user_id, 50)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$function$;

-- 2. Bypass consumo crediti SOLO per Kevin Bernardini (owner platform)
CREATE OR REPLACE FUNCTION public.consume_seller_credits(p_action text, p_metadata jsonb DEFAULT '{}'::jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_cost integer;
  v_eur numeric;
  v_label text;
  v_balance integer;
  v_owner_id constant uuid := '1da0ee45-094a-4728-996e-6143d55a7f9d';
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

  -- 🔓 Owner platform: bypass illimitato senza scalare
  IF v_user_id = v_owner_id THEN
    INSERT INTO public.demo_credit_usage (user_id, action, credits_used, cost_eur_estimate, action_label, metadata)
    VALUES (v_user_id, p_action, 0, 0, v_label, COALESCE(p_metadata, '{}'::jsonb) || jsonb_build_object('owner_bypass', true));
    RETURN jsonb_build_object('success', true, 'credits_used', 0, 'cost_eur', 0, 'remaining_balance', 999999, 'action_label', v_label, 'owner_bypass', true);
  END IF;

  SELECT balance INTO v_balance FROM public.partner_demo_credits WHERE user_id = v_user_id FOR UPDATE;
  IF v_balance IS NULL THEN
    INSERT INTO public.partner_demo_credits (user_id, balance) VALUES (v_user_id, 0);
    v_balance := 0;
  END IF;
  IF v_balance < v_cost THEN
    RETURN jsonb_build_object('success', false, 'error', 'insufficient_credits', 'required', v_cost, 'balance', v_balance);
  END IF;

  UPDATE public.partner_demo_credits SET balance = balance - v_cost, updated_at = now() WHERE user_id = v_user_id;
  INSERT INTO public.demo_credit_usage (user_id, action, credits_used, cost_eur_estimate, action_label, metadata)
  VALUES (v_user_id, p_action, v_cost, v_eur, v_label, COALESCE(p_metadata, '{}'::jsonb));

  RETURN jsonb_build_object('success', true, 'credits_used', v_cost, 'cost_eur', v_eur, 'remaining_balance', v_balance - v_cost, 'action_label', v_label);
END;
$function$;