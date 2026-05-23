-- ============================================================
-- Empire Tenant-Isolated Login — Server-side hardening
-- ============================================================

-- 1) Audit log of tenant login events (success / unauthorized / wipe / etc.)
CREATE TABLE IF NOT EXISTS public.tenant_login_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  restaurant_id uuid REFERENCES public.restaurants(id) ON DELETE SET NULL,
  slug text NOT NULL,
  email text,
  outcome text NOT NULL CHECK (outcome IN (
    'success','invalid_credentials','unauthorized_tenant',
    'tenant_blocked','tenant_missing','session_wipe',
    'membership_revoked','fingerprint_mismatch','unlock_requested'
  )),
  ip_address text,
  user_agent text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tenant_login_audit_slug_created
  ON public.tenant_login_audit (slug, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tenant_login_audit_user_created
  ON public.tenant_login_audit (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tenant_login_audit_outcome_created
  ON public.tenant_login_audit (outcome, created_at DESC);

ALTER TABLE public.tenant_login_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admins can read tenant_login_audit" ON public.tenant_login_audit;
CREATE POLICY "Super admins can read tenant_login_audit"
  ON public.tenant_login_audit FOR SELECT
  USING (public.is_super_admin());

DROP POLICY IF EXISTS "Users can read their own tenant_login_audit" ON public.tenant_login_audit;
CREATE POLICY "Users can read their own tenant_login_audit"
  ON public.tenant_login_audit FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Restaurant owners can read their tenant audit" ON public.tenant_login_audit;
CREATE POLICY "Restaurant owners can read their tenant audit"
  ON public.tenant_login_audit FOR SELECT
  USING (
    restaurant_id IS NOT NULL
    AND public.is_restaurant_owner(restaurant_id)
  );

-- No direct INSERT / UPDATE / DELETE from clients — only via SECURITY DEFINER RPCs

-- 2) Fast slug lookup for tenant resolution
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON public.restaurants (slug);

-- 3) RPC: log a tenant login event (called from client TenantLogin / TenantGuard)
CREATE OR REPLACE FUNCTION public.log_tenant_login_event(
  p_slug text,
  p_outcome text,
  p_email text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_id uuid;
  v_restaurant_id uuid;
  v_user_id uuid := auth.uid();
BEGIN
  IF p_slug IS NULL OR p_outcome IS NULL THEN
    RAISE EXCEPTION 'slug and outcome are required';
  END IF;

  IF p_outcome NOT IN (
    'success','invalid_credentials','unauthorized_tenant',
    'tenant_blocked','tenant_missing','session_wipe',
    'membership_revoked','fingerprint_mismatch','unlock_requested'
  ) THEN
    RAISE EXCEPTION 'invalid outcome: %', p_outcome;
  END IF;

  SELECT id INTO v_restaurant_id
  FROM public.restaurants
  WHERE slug = p_slug
  LIMIT 1;

  INSERT INTO public.tenant_login_audit (
    user_id, restaurant_id, slug, email, outcome, metadata
  ) VALUES (
    v_user_id, v_restaurant_id, p_slug,
    NULLIF(lower(trim(p_email)), ''),
    p_outcome,
    COALESCE(p_metadata, '{}'::jsonb)
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- 4) RPC: server-side authoritative tenant access verification
--    Returns a jsonb verdict + restaurant info. Cannot be bypassed
--    from client because role checks run with SECURITY DEFINER.
CREATE OR REPLACE FUNCTION public.verify_tenant_access(p_slug text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_restaurant record;
  v_is_owner boolean := false;
  v_is_member boolean := false;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'unauthenticated');
  END IF;

  SELECT id, name, slug, owner_id, is_blocked, blocked_reason
    INTO v_restaurant
  FROM public.restaurants
  WHERE slug = p_slug
  LIMIT 1;

  IF v_restaurant.id IS NULL THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'tenant_missing');
  END IF;

  IF v_restaurant.is_blocked THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'tenant_blocked',
      'blocked_reason', v_restaurant.blocked_reason,
      'restaurant_id', v_restaurant.id
    );
  END IF;

  v_is_owner := (v_restaurant.owner_id = v_user_id);

  IF NOT v_is_owner THEN
    SELECT EXISTS (
      SELECT 1 FROM public.restaurant_memberships
      WHERE restaurant_id = v_restaurant.id
        AND user_id = v_user_id
    ) INTO v_is_member;
  END IF;

  IF NOT (v_is_owner OR v_is_member OR public.is_super_admin()) THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'unauthorized_tenant',
      'restaurant_id', v_restaurant.id
    );
  END IF;

  RETURN jsonb_build_object(
    'allowed', true,
    'restaurant_id', v_restaurant.id,
    'name', v_restaurant.name,
    'slug', v_restaurant.slug,
    'role', CASE
      WHEN public.is_super_admin() THEN 'super_admin'
      WHEN v_is_owner THEN 'owner'
      ELSE 'member'
    END
  );
END;
$$;

-- 5) Helper to list user's accessible tenants (for "switch tenant" UI)
CREATE OR REPLACE FUNCTION public.list_my_tenants()
RETURNS TABLE(
  restaurant_id uuid,
  slug text,
  name text,
  role text,
  is_blocked boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT r.id, r.slug, r.name,
    CASE WHEN r.owner_id = auth.uid() THEN 'owner' ELSE 'member' END,
    COALESCE(r.is_blocked, false)
  FROM public.restaurants r
  WHERE r.owner_id = auth.uid()
     OR EXISTS (
       SELECT 1 FROM public.restaurant_memberships m
       WHERE m.restaurant_id = r.id AND m.user_id = auth.uid()
     )
  ORDER BY r.name;
$$;

GRANT EXECUTE ON FUNCTION public.log_tenant_login_event(text,text,text,jsonb) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.verify_tenant_access(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_my_tenants() TO authenticated;