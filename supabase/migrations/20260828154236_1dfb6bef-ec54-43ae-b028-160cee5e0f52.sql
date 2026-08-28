-- 1) Approval status columns (HOLD & APPROVE)
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS approval_status TEXT NOT NULL DEFAULT 'pending_approval',
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by UUID;

ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS approval_status TEXT NOT NULL DEFAULT 'pending_approval',
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by UUID;

-- 2) Do not break existing tenants: everyone created before now stays usable
UPDATE public.companies SET approval_status = 'approved', approved_at = COALESCE(approved_at, now())
WHERE approval_status <> 'approved';

UPDATE public.restaurants SET approval_status = 'approved', approved_at = COALESCE(approved_at, now())
WHERE approval_status <> 'approved';

-- 3) Activation now requires setup paid AND manual approval
CREATE OR REPLACE FUNCTION public.is_setup_paid(_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _user_id IS NULL THEN
    RETURN false;
  END IF;

  IF public.has_role(_user_id, 'super_admin') THEN
    RETURN true;
  END IF;

  IF public.has_role(_user_id, 'partner') OR public.has_role(_user_id, 'team_leader') THEN
    RETURN true;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.companies
    WHERE owner_id = _user_id AND setup_paid = true AND approval_status = 'approved'
  ) THEN
    RETURN true;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.restaurants
    WHERE owner_id = _user_id AND setup_paid = true AND approval_status = 'approved'
  ) THEN
    RETURN true;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.company_memberships cm
    JOIN public.companies c ON c.id = cm.company_id
    WHERE cm.user_id = _user_id AND c.setup_paid = true AND c.approval_status = 'approved'
  ) THEN
    RETURN true;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.restaurant_memberships rm
    JOIN public.restaurants r ON r.id = rm.restaurant_id
    WHERE rm.user_id = _user_id AND r.setup_paid = true AND r.approval_status = 'approved'
  ) THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

-- 4) Owner-facing read helper: approval state of my own tenants
CREATE OR REPLACE FUNCTION public.my_approval_status()
RETURNS TABLE(kind TEXT, tenant_id UUID, name TEXT, setup_paid BOOLEAN, approval_status TEXT)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'company'::text, c.id, c.name, c.setup_paid, c.approval_status
  FROM public.companies c WHERE c.owner_id = auth.uid()
  UNION ALL
  SELECT 'restaurant'::text, r.id, r.name, r.setup_paid, r.approval_status
  FROM public.restaurants r WHERE r.owner_id = auth.uid()
$$;

REVOKE ALL ON FUNCTION public.my_approval_status() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_approval_status() TO authenticated;