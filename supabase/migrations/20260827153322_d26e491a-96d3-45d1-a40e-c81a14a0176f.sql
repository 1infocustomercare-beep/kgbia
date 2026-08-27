-- 1. Column-level hardening: companies / restaurants sensitive columns
REVOKE SELECT ON public.companies FROM anon, authenticated;
GRANT SELECT (
  id, name, slug, industry, owner_id, logo_url, primary_color, secondary_color,
  tagline, address, city, phone, email, subscription_plan, modules_enabled,
  is_active, is_blocked, blocked_reason, created_at, updated_at, font_family,
  modules_config, opening_hours, social_links, theme_config, setup_paid,
  selected_plan, selected_installments, setup_paid_at
) ON public.companies TO anon, authenticated;
GRANT ALL ON public.companies TO service_role;

REVOKE SELECT ON public.restaurants FROM anon, authenticated;
GRANT SELECT (
  id, owner_id, name, slug, logo_url, primary_color, tagline, address, phone,
  city, is_active, setup_paid, created_at, updated_at, email, opening_hours,
  languages, min_order_amount, blocked_keywords, policy_accepted,
  policy_accepted_at, delivery_enabled, takeaway_enabled, table_orders_enabled,
  is_blocked, blocked_reason, stripe_onboarding_complete, business_type,
  theme_config, selected_plan, selected_installments, setup_paid_at, menu_pdf_url
) ON public.restaurants TO anon, authenticated;
GRANT ALL ON public.restaurants TO service_role;

-- 2. products: consolidate the two overlapping ALL policies into one canonical policy
DROP POLICY IF EXISTS "Company members manage products" ON public.products;
DROP POLICY IF EXISTS "products_company_policy" ON public.products;
CREATE POLICY "products_company_members_manage"
ON public.products FOR ALL
TO authenticated
USING (public.is_super_admin() OR public.is_company_member(company_id, auth.uid()))
WITH CHECK (public.is_super_admin() OR public.is_company_member(company_id, auth.uid()));

-- 3. route_prices / seasonal_prices: remove duplicate public read policies
DROP POLICY IF EXISTS "Route prices public read" ON public.route_prices;
DROP POLICY IF EXISTS "Seasonal prices public read" ON public.seasonal_prices;

-- 4. ncc_bookings: stricter validation on public inserts
DROP POLICY IF EXISTS "Public can create bookings for active companies" ON public.ncc_bookings;
CREATE POLICY "Public can create bookings for active companies"
ON public.ncc_bookings FOR INSERT
TO anon, authenticated
WITH CHECK (
  company_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.companies c
    WHERE c.id = ncc_bookings.company_id
      AND c.is_active = true
      AND COALESCE(c.is_blocked, false) = false
  )
  -- identità cliente obbligatoria + almeno un contatto valido
  AND customer_name IS NOT NULL
  AND length(btrim(customer_name)) BETWEEN 2 AND 120
  AND (
    (customer_phone IS NOT NULL AND length(btrim(customer_phone)) BETWEEN 6 AND 32)
    OR (customer_email IS NOT NULL AND customer_email ~* '^[^@\s]+@[^@\s]+\.[a-z]{2,}$' AND length(customer_email) <= 200)
  )
  AND (customer_email IS NULL OR (customer_email ~* '^[^@\s]+@[^@\s]+\.[a-z]{2,}$' AND length(customer_email) <= 200))
  AND (client_email IS NULL OR (client_email ~* '^[^@\s]+@[^@\s]+\.[a-z]{2,}$' AND length(client_email) <= 200))
  AND (pickup_address IS NULL OR length(pickup_address) <= 300)
  AND (dropoff_address IS NULL OR length(dropoff_address) <= 300)
  AND (custom_origin IS NULL OR length(custom_origin) <= 300)
  AND (custom_destination IS NULL OR length(custom_destination) <= 300)
  AND (flight_code IS NULL OR length(flight_code) <= 20)
  AND (notes IS NULL OR length(notes) <= 1000)
  AND COALESCE(passengers, 1) BETWEEN 1 AND 60
  AND COALESCE(luggage, 0) BETWEEN 0 AND 60
  -- data di ritiro plausibile (no spam nel passato remoto / futuro assurdo)
  AND (pickup_datetime IS NULL OR (pickup_datetime > now() - interval '1 day' AND pickup_datetime < now() + interval '2 years'))
  -- stato iniziale e campi interni non manipolabili dal pubblico
  AND COALESCE(status, 'pending') = 'pending'
  AND driver_id IS NULL
  AND admin_notes IS NULL
  AND driver_notes IS NULL
  AND COALESCE(total_price, 0) >= 0 AND COALESCE(total_price, 0) <= 100000
  AND COALESCE(deposit, 0) >= 0 AND COALESCE(deposit, 0) <= 100000
);

-- 5. Cost-abuse quota store for paid public endpoints (voice/AI)
CREATE TABLE IF NOT EXISTS public.edge_cost_quota (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope text NOT NULL,
  caller_key text NOT NULL,
  window_start timestamptz NOT NULL DEFAULT date_trunc('hour', now()),
  units integer NOT NULL DEFAULT 0,
  calls integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (scope, caller_key, window_start)
);

GRANT ALL ON public.edge_cost_quota TO service_role;
ALTER TABLE public.edge_cost_quota ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admins read edge cost quota" ON public.edge_cost_quota;
CREATE POLICY "Super admins read edge cost quota"
ON public.edge_cost_quota FOR SELECT
TO authenticated
USING (public.is_super_admin());

-- Atomic quota consumption; returns true when the caller is still within budget.
CREATE OR REPLACE FUNCTION public.consume_edge_quota(
  _scope text,
  _caller_key text,
  _units integer,
  _max_units integer,
  _max_calls integer
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window timestamptz := date_trunc('hour', now());
  v_units integer;
  v_calls integer;
BEGIN
  INSERT INTO public.edge_cost_quota (scope, caller_key, window_start, units, calls)
  VALUES (_scope, _caller_key, v_window, GREATEST(_units, 0), 1)
  ON CONFLICT (scope, caller_key, window_start)
  DO UPDATE SET
    units = public.edge_cost_quota.units + GREATEST(_units, 0),
    calls = public.edge_cost_quota.calls + 1,
    updated_at = now()
  RETURNING units, calls INTO v_units, v_calls;

  RETURN v_units <= _max_units AND v_calls <= _max_calls;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_edge_quota(text, text, integer, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_edge_quota(text, text, integer, integer, integer) TO service_role;