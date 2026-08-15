-- 1) ai_agent_configs: remove blanket authenticated read
DROP POLICY IF EXISTS "Authenticated reads agent configs" ON public.ai_agent_configs;

CREATE OR REPLACE FUNCTION public.get_public_ai_agent_configs()
RETURNS TABLE (
  agent_name text,
  display_name text,
  description text,
  icon text,
  color text,
  is_enabled boolean,
  allowed_industries text[]
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.agent_name, c.display_name, c.description, c.icon, c.color,
         c.is_enabled, c.allowed_industries
  FROM public.ai_agent_configs c
  WHERE auth.uid() IS NOT NULL;
$$;

REVOKE ALL ON FUNCTION public.get_public_ai_agent_configs() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_public_ai_agent_configs() TO authenticated, service_role;

-- 2) seller_action_costs: only super admin reads full internal cost data
DROP POLICY IF EXISTS "anyone authenticated can read costs" ON public.seller_action_costs;

CREATE POLICY "super_admin reads action costs"
ON public.seller_action_costs
FOR SELECT
TO authenticated
USING (public.is_super_admin());

CREATE OR REPLACE FUNCTION public.get_seller_action_prices()
RETURNS TABLE (
  action text,
  label text,
  credit_cost integer,
  description text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.action, s.label, s.credit_cost::integer, s.description
  FROM public.seller_action_costs s
  WHERE s.is_active = true
    AND auth.uid() IS NOT NULL;
$$;

REVOKE ALL ON FUNCTION public.get_seller_action_prices() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_seller_action_prices() TO authenticated, service_role;

-- 3) platform_settings: super admin only
DROP POLICY IF EXISTS "settings authenticated read" ON public.platform_settings;

CREATE POLICY "settings super_admin read"
ON public.platform_settings
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role));