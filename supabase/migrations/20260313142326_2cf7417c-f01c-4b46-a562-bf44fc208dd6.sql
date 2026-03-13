-- Fix infinite recursion between companies and company_memberships RLS policies

-- 1) Helper functions (SECURITY DEFINER) to avoid policy self/cross recursion
CREATE OR REPLACE FUNCTION public.is_company_member(_company_id uuid, _user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.company_memberships cm
    WHERE cm.company_id = _company_id
      AND cm.user_id = _user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_company_owner(_company_id uuid, _user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.companies c
    WHERE c.id = _company_id
      AND c.owner_id = _user_id
  );
$$;

-- 2) Replace recursive policies on companies
DROP POLICY IF EXISTS "Members read own company" ON public.companies;
CREATE POLICY "Members read own company"
ON public.companies
FOR SELECT
TO authenticated
USING (
  public.is_super_admin()
  OR owner_id = auth.uid()
  OR public.is_company_member(id, auth.uid())
);

DROP POLICY IF EXISTS "Members update own company" ON public.companies;
CREATE POLICY "Members update own company"
ON public.companies
FOR UPDATE
TO authenticated
USING (
  public.is_super_admin()
  OR owner_id = auth.uid()
  OR public.is_company_member(id, auth.uid())
)
WITH CHECK (
  public.is_super_admin()
  OR owner_id = auth.uid()
  OR public.is_company_member(id, auth.uid())
);

-- 3) Replace recursive policies on company_memberships
DROP POLICY IF EXISTS "Members read own membership" ON public.company_memberships;
CREATE POLICY "Members read own membership"
ON public.company_memberships
FOR SELECT
TO authenticated
USING (
  public.is_super_admin()
  OR user_id = auth.uid()
  OR public.is_company_owner(company_id, auth.uid())
);

DROP POLICY IF EXISTS "Auth insert membership" ON public.company_memberships;
CREATE POLICY "Auth insert membership"
ON public.company_memberships
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_super_admin()
  OR public.is_company_owner(company_id, auth.uid())
);

DROP POLICY IF EXISTS "Company owners manage memberships" ON public.company_memberships;
CREATE POLICY "Company owners manage memberships"
ON public.company_memberships
FOR UPDATE
TO authenticated
USING (
  public.is_super_admin()
  OR public.is_company_owner(company_id, auth.uid())
)
WITH CHECK (
  public.is_super_admin()
  OR public.is_company_owner(company_id, auth.uid())
);

DROP POLICY IF EXISTS "Company owners delete memberships" ON public.company_memberships;
CREATE POLICY "Company owners delete memberships"
ON public.company_memberships
FOR DELETE
TO authenticated
USING (
  public.is_super_admin()
  OR public.is_company_owner(company_id, auth.uid())
);