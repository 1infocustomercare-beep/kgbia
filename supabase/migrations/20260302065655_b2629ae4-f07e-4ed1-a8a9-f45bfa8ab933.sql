
-- 1. UPDATE Team Leader promotion: requires 4 personal sales + 2 sub-partners
CREATE OR REPLACE FUNCTION public.check_team_leader_promotion(p_partner_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  total_sales integer;
  total_recruits integer;
BEGIN
  SELECT COUNT(*) INTO total_sales
  FROM public.partner_sales
  WHERE partner_id = p_partner_id;
  
  SELECT COUNT(*) INTO total_recruits
  FROM public.partner_teams
  WHERE team_leader_id = p_partner_id;
  
  -- Requires 4 personal sales AND 2 recruited sub-partners
  IF total_sales >= 4 AND total_recruits >= 2 AND NOT public.has_role(p_partner_id, 'team_leader') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (p_partner_id, 'team_leader')
    ON CONFLICT (user_id, role) DO NOTHING;
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- 2. DEMO CREDITS TABLE
CREATE TABLE IF NOT EXISTS public.partner_demo_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  balance integer NOT NULL DEFAULT 5,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.partner_demo_credits ADD CONSTRAINT partner_demo_credits_user_unique UNIQUE (user_id);
ALTER TABLE public.partner_demo_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own credits" ON public.partner_demo_credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own credits" ON public.partner_demo_credits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Super admins manage credits" ON public.partner_demo_credits FOR ALL USING (is_super_admin());
CREATE POLICY "System inserts credits" ON public.partner_demo_credits FOR INSERT WITH CHECK (auth.uid() = user_id OR is_super_admin());

-- Demo credit usage log
CREATE TABLE IF NOT EXISTS public.demo_credit_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action text NOT NULL DEFAULT 'sandbox_unlock',
  credits_used integer NOT NULL DEFAULT 1,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.demo_credit_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own usage" ON public.demo_credit_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own usage" ON public.demo_credit_usage FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Super admins manage usage" ON public.demo_credit_usage FOR ALL USING (is_super_admin());

-- Auto-grant 5 credits when partner role is assigned
CREATE OR REPLACE FUNCTION public.grant_partner_demo_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.role IN ('partner', 'team_leader') THEN
    INSERT INTO public.partner_demo_credits (user_id, balance)
    VALUES (NEW.user_id, 5)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_partner_role_grant_credits ON public.user_roles;
CREATE TRIGGER on_partner_role_grant_credits
AFTER INSERT ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.grant_partner_demo_credits();

-- 3. B2B INVOICES TABLE
CREATE TABLE IF NOT EXISTS public.b2b_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  partner_id uuid,
  invoice_number text NOT NULL,
  invoice_type text NOT NULL DEFAULT 'setup_fee',
  recipient_name text,
  recipient_email text,
  partita_iva text,
  codice_univoco text,
  pec text,
  line_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric NOT NULL DEFAULT 0,
  vat_rate numeric NOT NULL DEFAULT 22,
  vat_amount numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  notes text,
  status text NOT NULL DEFAULT 'issued',
  issued_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.b2b_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners read own invoices" ON public.b2b_invoices FOR SELECT USING (is_restaurant_owner(restaurant_id) OR is_super_admin());
CREATE POLICY "Super admins manage b2b invoices" ON public.b2b_invoices FOR ALL USING (is_super_admin());

-- Partner commission summaries
CREATE TABLE IF NOT EXISTS public.partner_commission_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL,
  period text NOT NULL,
  total_sales integer NOT NULL DEFAULT 0,
  total_commission numeric NOT NULL DEFAULT 0,
  total_overrides numeric NOT NULL DEFAULT 0,
  total_bonuses numeric NOT NULL DEFAULT 0,
  net_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'generated',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.partner_commission_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners read own notes" ON public.partner_commission_notes FOR SELECT USING (auth.uid() = partner_id);
CREATE POLICY "Super admins manage notes" ON public.partner_commission_notes FOR ALL USING (is_super_admin());

-- Grant credits to existing partners
INSERT INTO public.partner_demo_credits (user_id, balance)
SELECT ur.user_id, 5 FROM public.user_roles ur
WHERE ur.role IN ('partner', 'team_leader')
ON CONFLICT (user_id) DO NOTHING;
