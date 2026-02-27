
-- Table to store Partner Stripe Connect account IDs
CREATE TABLE IF NOT EXISTS public.partner_stripe_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  stripe_account_id TEXT NOT NULL,
  email TEXT,
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  charges_enabled BOOLEAN NOT NULL DEFAULT false,
  payouts_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partner_stripe_accounts ENABLE ROW LEVEL SECURITY;

-- Partners can read their own account
CREATE POLICY "Partners read own stripe account"
  ON public.partner_stripe_accounts FOR SELECT
  USING (auth.uid() = user_id);

-- Super admins manage all
CREATE POLICY "Super admins manage partner stripe accounts"
  ON public.partner_stripe_accounts FOR ALL
  USING (is_super_admin());

-- System (service role) can insert/update via edge functions
-- The edge functions use SUPABASE_SERVICE_ROLE_KEY which bypasses RLS

-- RPC function to get partner stripe account (used by webhook)
CREATE OR REPLACE FUNCTION public.get_partner_stripe_account(partner_user_id UUID)
RETURNS TABLE(stripe_account_id TEXT, onboarding_complete BOOLEAN)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT stripe_account_id, onboarding_complete
  FROM public.partner_stripe_accounts
  WHERE user_id = partner_user_id
  LIMIT 1;
$$;

-- Trigger for updated_at
CREATE TRIGGER update_partner_stripe_accounts_updated_at
  BEFORE UPDATE ON public.partner_stripe_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
