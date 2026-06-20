
-- 1) command_audit_log: restrict SELECT to owners + super_admin (no sender_phone leak to all members)
DROP POLICY IF EXISTS "Owner sees own command logs" ON public.command_audit_log;
CREATE POLICY "Owner sees own command logs"
  ON public.command_audit_log FOR SELECT
  TO authenticated
  USING (
    is_super_admin()
    OR tenant_id IN (SELECT id FROM public.companies WHERE owner_id = auth.uid())
    OR tenant_id IN (SELECT id FROM public.restaurants WHERE owner_id = auth.uid())
  );

-- 2) companies: hide email/phone/address from anon
REVOKE SELECT (email, phone, address) ON public.companies FROM anon;

-- 3) restaurants: hide email/phone from anon
REVOKE SELECT (email, phone) ON public.restaurants FROM anon;

-- 4) demo_sites / demo_factory_runs / seller_demo_vault: hide admin_password (+ magic_link) from client
REVOKE SELECT (admin_password) ON public.demo_sites FROM anon, authenticated;
REVOKE SELECT (admin_password) ON public.demo_factory_runs FROM anon, authenticated;
REVOKE SELECT (admin_password, magic_link) ON public.seller_demo_vault FROM anon, authenticated;

-- 5) fisco_configs: hide encrypted API key columns from client
REVOKE SELECT (api_key_encrypted, api_key_secondary_encrypted) ON public.fisco_configs FROM anon, authenticated;

-- 6) infrastructure_costs: super admins only
DROP POLICY IF EXISTS "authenticated read infrastructure_costs" ON public.infrastructure_costs;
CREATE POLICY "super_admin read infrastructure_costs"
  ON public.infrastructure_costs FOR SELECT
  TO authenticated
  USING (is_super_admin());

-- 7) lead_enrichment_cache: service role only (used by edge functions). Drop client SELECT.
DROP POLICY IF EXISTS "authenticated can read cache" ON public.lead_enrichment_cache;

-- 8) push_subscriptions: hide cryptographic secrets + customer phone from client
REVOKE SELECT (endpoint, p256dh, auth_key, customer_phone) ON public.push_subscriptions FROM anon, authenticated;

-- 9) sales_leaderboard: hide revenue figures from other users (keep gamification public)
REVOKE SELECT (revenue_month_eur, revenue_total_eur) ON public.sales_leaderboard FROM anon, authenticated;
-- still allow owner to see their own revenue via service role/edge function or owner-only policy
GRANT SELECT (revenue_month_eur, revenue_total_eur) ON public.sales_leaderboard TO service_role;

-- 10) seller_mockup_suites: hide owner_id and lead_id from anonymous public-by-slug viewers
REVOKE SELECT (owner_id, lead_id) ON public.seller_mockup_suites FROM anon;

-- 11) tenant_login_audit: only super_admins see raw email/IP/user_agent. Drop owner SELECT policy.
DROP POLICY IF EXISTS "Restaurant owners can read their tenant audit" ON public.tenant_login_audit;

-- 12) whatsapp_config: hide tokens from client
REVOKE SELECT (access_token, webhook_verify_token) ON public.whatsapp_config FROM anon, authenticated;
