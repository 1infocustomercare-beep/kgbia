
-- Companies table (multi-industry tenant)
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  industry text NOT NULL DEFAULT 'food',
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  logo_url text,
  primary_color text DEFAULT '#C8963E',
  secondary_color text,
  tagline text DEFAULT 'Benvenuti',
  address text,
  city text,
  phone text,
  email text,
  subscription_plan text NOT NULL DEFAULT 'essential',
  modules_enabled text[] DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  is_blocked boolean NOT NULL DEFAULT false,
  blocked_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Company memberships
CREATE TABLE IF NOT EXISTS public.company_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(company_id, user_id)
);

ALTER TABLE public.company_memberships ENABLE ROW LEVEL SECURITY;

-- Leads CRM
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  status text NOT NULL DEFAULT 'new',
  source text,
  notes text,
  value numeric NOT NULL DEFAULT 0,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Staff table
CREATE TABLE IF NOT EXISTS public.staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'staff',
  email text,
  phone text,
  hourly_rate numeric DEFAULT 0,
  monthly_salary numeric DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- HACCP logs
CREATE TABLE IF NOT EXISTS public.haccp_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  operator_name text NOT NULL,
  check_type text NOT NULL,
  result text NOT NULL DEFAULT 'conforme',
  temperature numeric,
  notes text,
  checked_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.haccp_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: get user's company
CREATE OR REPLACE FUNCTION public.get_user_company(p_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.company_memberships
  WHERE user_id = p_user_id
  LIMIT 1;
$$;

-- RLS Policies for companies
CREATE POLICY "Owners read own company" ON public.companies
  FOR SELECT USING (owner_id = auth.uid() OR is_super_admin());

CREATE POLICY "Owners update own company" ON public.companies
  FOR UPDATE USING (owner_id = auth.uid() OR is_super_admin());

CREATE POLICY "Auth users create company" ON public.companies
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Super admins manage companies" ON public.companies
  FOR ALL USING (is_super_admin());

-- RLS Policies for company_memberships
CREATE POLICY "Members read own membership" ON public.company_memberships
  FOR SELECT USING (user_id = auth.uid() OR is_super_admin());

CREATE POLICY "Company owners manage memberships" ON public.company_memberships
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.companies WHERE id = company_id AND owner_id = auth.uid())
    OR is_super_admin()
  );

CREATE POLICY "Auth insert membership" ON public.company_memberships
  FOR INSERT WITH CHECK (user_id = auth.uid() OR is_super_admin());

-- RLS Policies for leads
CREATE POLICY "Company members read leads" ON public.leads
  FOR SELECT USING (
    company_id = get_user_company(auth.uid()) OR is_super_admin()
  );

CREATE POLICY "Company members manage leads" ON public.leads
  FOR ALL USING (
    company_id = get_user_company(auth.uid()) OR is_super_admin()
  );

-- RLS Policies for staff
CREATE POLICY "Company members read staff" ON public.staff
  FOR SELECT USING (
    company_id = get_user_company(auth.uid()) OR is_super_admin()
  );

CREATE POLICY "Company members manage staff" ON public.staff
  FOR ALL USING (
    company_id = get_user_company(auth.uid()) OR is_super_admin()
  );

-- RLS Policies for haccp_logs
CREATE POLICY "Company members read haccp" ON public.haccp_logs
  FOR SELECT USING (
    company_id = get_user_company(auth.uid()) OR is_super_admin()
  );

CREATE POLICY "Company members manage haccp" ON public.haccp_logs
  FOR ALL USING (
    company_id = get_user_company(auth.uid()) OR is_super_admin()
  );
