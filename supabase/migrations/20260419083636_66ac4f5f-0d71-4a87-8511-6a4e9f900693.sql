CREATE OR REPLACE FUNCTION public.super_admin_grant_credits(
  p_target_user_id uuid,
  p_amount integer,
  p_mode text DEFAULT 'add', -- 'add' | 'set'
  p_note text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_caller uuid := auth.uid();
  v_new_balance integer;
  v_old_balance integer;
BEGIN
  IF v_caller IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthorized');
  END IF;

  IF NOT public.is_super_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'forbidden_super_admin_only');
  END IF;

  IF p_target_user_id IS NULL OR p_amount IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'missing_params');
  END IF;

  IF p_mode NOT IN ('add','set') THEN
    p_mode := 'add';
  END IF;

  -- Ensure row exists
  INSERT INTO public.partner_demo_credits (user_id, balance)
  VALUES (p_target_user_id, 0)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT balance INTO v_old_balance
  FROM public.partner_demo_credits
  WHERE user_id = p_target_user_id
  FOR UPDATE;

  IF p_mode = 'set' THEN
    v_new_balance := GREATEST(p_amount, 0);
  ELSE
    v_new_balance := GREATEST(COALESCE(v_old_balance,0) + p_amount, 0);
  END IF;

  UPDATE public.partner_demo_credits
  SET balance = v_new_balance, updated_at = now()
  WHERE user_id = p_target_user_id;

  INSERT INTO public.demo_credit_usage (
    user_id, action, credits_used, cost_eur_estimate, action_label, metadata
  ) VALUES (
    p_target_user_id,
    'super_admin_grant',
    -1 * (v_new_balance - COALESCE(v_old_balance,0)), -- negativo = accredito
    0,
    'Regalo Super Admin',
    jsonb_build_object(
      'granted_by', v_caller,
      'mode', p_mode,
      'amount', p_amount,
      'old_balance', COALESCE(v_old_balance,0),
      'new_balance', v_new_balance,
      'note', p_note
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'old_balance', COALESCE(v_old_balance,0),
    'new_balance', v_new_balance,
    'delta', v_new_balance - COALESCE(v_old_balance,0)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.super_admin_grant_credits(uuid, integer, text, text) TO authenticated;