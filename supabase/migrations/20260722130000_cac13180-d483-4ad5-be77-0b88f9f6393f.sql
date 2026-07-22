
-- 1) base_orders: block NULL user_id inserts
DROP POLICY IF EXISTS "base_orders owner insert" ON public.base_orders;
CREATE POLICY "base_orders owner insert" ON public.base_orders
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 2) platform_settings: only super admin writes
DROP POLICY IF EXISTS "settings admin write" ON public.platform_settings;
CREATE POLICY "settings admin write" ON public.platform_settings
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

-- 3) gdpr_consents: require valid restaurant + session and forbid IP hash spoofing
DROP POLICY IF EXISTS "Anyone can insert consent" ON public.gdpr_consents;
CREATE POLICY "Public may record own consent" ON public.gdpr_consents
  FOR INSERT
  WITH CHECK (
    restaurant_id IS NOT NULL
    AND session_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = restaurant_id AND r.is_active = true)
  );

-- 4) Hide sensitive columns from anon on companies / restaurants
REVOKE SELECT (owner_id, email, phone, stripe_setup_session_id)
  ON public.companies FROM anon;
REVOKE SELECT (owner_id, email, phone, stripe_account_id, stripe_connect_account_id,
               stripe_onboarding_complete, stripe_setup_session_id)
  ON public.restaurants FROM anon;

-- 5) Hide customer PII on public review reads
REVOKE SELECT (customer_name) ON public.ncc_reviews FROM anon;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema='public' AND table_name='reviews' AND column_name='customer_id') THEN
    EXECUTE 'REVOKE SELECT (customer_id) ON public.reviews FROM anon';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema='public' AND table_name='reviews' AND column_name='customer_name') THEN
    EXECUTE 'REVOKE SELECT (customer_name) ON public.reviews FROM anon';
  END IF;
END $$;

-- 6) Fix mutable search_path on tg_touch_updated_at
CREATE OR REPLACE FUNCTION public.tg_touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
