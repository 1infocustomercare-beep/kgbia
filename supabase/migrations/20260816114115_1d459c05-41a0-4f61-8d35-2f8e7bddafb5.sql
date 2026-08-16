
-- 1) orders: validate restaurant active + sane values
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Public can create orders for active restaurants"
ON public.orders FOR INSERT TO anon, authenticated
WITH CHECK (
  restaurant_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = orders.restaurant_id AND r.is_active = true AND coalesce(r.is_blocked, false) = false)
  AND coalesce(total, 0) >= 0
  AND coalesce(total, 0) <= 100000
  AND (customer_name IS NULL OR length(customer_name) <= 120)
  AND (customer_phone IS NULL OR length(customer_phone) <= 32)
);

-- 2) reservations: validate restaurant active
DROP POLICY IF EXISTS "Anyone can create reservations" ON public.reservations;
CREATE POLICY "Public can create reservations for active restaurants"
ON public.reservations FOR INSERT TO anon, authenticated
WITH CHECK (
  restaurant_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = reservations.restaurant_id AND r.is_active = true AND coalesce(r.is_blocked, false) = false)
  AND (customer_name IS NULL OR length(customer_name) <= 120)
  AND (customer_phone IS NULL OR length(customer_phone) <= 32)
);

-- 3) ncc_bookings: validate company active
DROP POLICY IF EXISTS "Anyone create booking" ON public.ncc_bookings;
CREATE POLICY "Public can create bookings for active companies"
ON public.ncc_bookings FOR INSERT TO anon, authenticated
WITH CHECK (
  company_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM public.companies c WHERE c.id = ncc_bookings.company_id AND c.is_active = true AND coalesce(c.is_blocked, false) = false)
  AND (customer_name IS NULL OR length(customer_name) <= 120)
  AND (customer_phone IS NULL OR length(customer_phone) <= 32)
  AND (customer_email IS NULL OR length(customer_email) <= 200)
  AND (pickup_address IS NULL OR length(pickup_address) <= 300)
  AND (dropoff_address IS NULL OR length(dropoff_address) <= 300)
  AND (notes IS NULL OR length(notes) <= 1000)
  AND coalesce(passengers, 1) BETWEEN 1 AND 60
  AND coalesce(total_price, 0) >= 0
  AND coalesce(total_price, 0) <= 100000
  AND admin_notes IS NULL
  AND driver_notes IS NULL
);

-- 4) gdpr_consents: constrain public inserts to plausible payloads
DROP POLICY IF EXISTS "Public may record own consent" ON public.gdpr_consents;
CREATE POLICY "Public may record own consent"
ON public.gdpr_consents FOR INSERT TO anon, authenticated
WITH CHECK (
  restaurant_id IS NOT NULL
  AND session_id IS NOT NULL
  AND length(session_id) BETWEEN 8 AND 128
  AND (ip_hash IS NULL OR length(ip_hash) <= 128)
  AND EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = gdpr_consents.restaurant_id AND r.is_active = true)
);

-- 5) restaurant_payments: partners no longer read full rows (no Stripe identifiers)
DROP POLICY IF EXISTS "Partners read own referred payments" ON public.restaurant_payments;

CREATE OR REPLACE FUNCTION public.get_partner_referred_payments()
RETURNS TABLE (
  id uuid,
  restaurant_id uuid,
  restaurant_name text,
  plan_type text,
  installments_total integer,
  installments_paid integer,
  partner_commission numeric,
  partner_paid boolean,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id,
         p.restaurant_id,
         r.name,
         p.plan_type::text,
         p.installments_total,
         p.installments_paid,
         p.partner_commission,
         p.partner_paid,
         p.created_at
  FROM public.restaurant_payments p
  LEFT JOIN public.restaurants r ON r.id = p.restaurant_id
  WHERE auth.uid() IS NOT NULL
    AND p.partner_id = auth.uid()
  ORDER BY p.created_at DESC
$$;

REVOKE ALL ON FUNCTION public.get_partner_referred_payments() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_partner_referred_payments() TO authenticated;

-- 6) sub_partner_invites: harden token validation in the acceptance RPC
CREATE OR REPLACE FUNCTION public.accept_sub_partner_invite(p_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user uuid := auth.uid();
  v_inv RECORD;
BEGIN
  IF v_user IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'unauthorized'); END IF;

  IF p_token IS NULL OR length(p_token) < 20 OR length(p_token) > 200 OR p_token !~ '^[A-Za-z0-9_-]+$' THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_or_expired');
  END IF;

  SELECT * INTO v_inv FROM public.sub_partner_invites
   WHERE token = p_token AND status = 'pending' AND expires_at > now()
   FOR UPDATE;

  IF v_inv.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_or_expired');
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user, 'partner')
  ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.partner_teams (team_leader_id, partner_id)
  VALUES (v_inv.team_leader_id, v_user)
  ON CONFLICT DO NOTHING;

  UPDATE public.sub_partner_invites
     SET status = 'accepted', accepted_by = v_user, accepted_at = now()
   WHERE id = v_inv.id;

  RETURN jsonb_build_object('success', true, 'team_leader_id', v_inv.team_leader_id, 'commission_pct', v_inv.commission_pct);
END $function$;
