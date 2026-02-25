
-- Expand fisco_configs for multi-provider support (all Italian providers)
ALTER TABLE public.fisco_configs 
  ADD COLUMN IF NOT EXISTS auto_send_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS disclaimer_accepted boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS disclaimer_accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS provider_secondary text,
  ADD COLUMN IF NOT EXISTS api_key_secondary_encrypted text;

-- Add Stripe Connect columns to restaurants
ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS stripe_connect_account_id text,
  ADD COLUMN IF NOT EXISTS stripe_onboarding_complete boolean NOT NULL DEFAULT false;

-- Add partner/commission tracking to restaurant_payments
ALTER TABLE public.restaurant_payments
  ADD COLUMN IF NOT EXISTS partner_id uuid,
  ADD COLUMN IF NOT EXISTS partner_commission numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS partner_paid boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text,
  ADD COLUMN IF NOT EXISTS stripe_transfer_group text;

-- Table for 2% platform fees tracking
CREATE TABLE IF NOT EXISTS public.platform_fees (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_total numeric NOT NULL DEFAULT 0,
  fee_percent numeric NOT NULL DEFAULT 2,
  fee_amount numeric NOT NULL DEFAULT 0,
  stripe_fee_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins manage platform fees"
  ON public.platform_fees FOR ALL
  USING (is_super_admin());

CREATE POLICY "Restaurant owners read own fees"
  ON public.platform_fees FOR SELECT
  USING (is_restaurant_owner(restaurant_id));

-- Monthly fee summaries for invoicing
CREATE TABLE IF NOT EXISTS public.monthly_fee_invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  month_year text NOT NULL, -- e.g. '2026-02'
  total_orders integer NOT NULL DEFAULT 0,
  total_revenue numeric NOT NULL DEFAULT 0,
  total_fees numeric NOT NULL DEFAULT 0,
  generated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(restaurant_id, month_year)
);

ALTER TABLE public.monthly_fee_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins manage invoices"
  ON public.monthly_fee_invoices FOR ALL
  USING (is_super_admin());

CREATE POLICY "Restaurant owners read own invoices"
  ON public.monthly_fee_invoices FOR SELECT
  USING (is_restaurant_owner(restaurant_id));

-- GDPR consent tracking
CREATE TABLE IF NOT EXISTS public.gdpr_consents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id uuid REFERENCES public.restaurants(id) ON DELETE SET NULL,
  session_id text NOT NULL,
  ip_hash text,
  consent_analytics boolean NOT NULL DEFAULT false,
  consent_marketing boolean NOT NULL DEFAULT false,
  consent_necessary boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gdpr_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert consent"
  ON public.gdpr_consents FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update own consent"
  ON public.gdpr_consents FOR UPDATE
  USING (true);

CREATE POLICY "Super admins read consents"
  ON public.gdpr_consents FOR SELECT
  USING (is_super_admin());
