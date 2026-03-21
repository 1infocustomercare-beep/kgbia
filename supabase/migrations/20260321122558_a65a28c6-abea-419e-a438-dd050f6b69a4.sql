
-- =============================================
-- SECURITY HARDENING MIGRATION
-- =============================================

-- 1. Fix command_audit_log: restrict INSERT to user's own tenant
DROP POLICY IF EXISTS "Service inserts command logs" ON public.command_audit_log;
CREATE POLICY "Authenticated inserts own command logs"
  ON public.command_audit_log FOR INSERT TO authenticated
  WITH CHECK (
    tenant_id IN (
      SELECT company_id FROM public.company_memberships WHERE user_id = auth.uid()
    )
    OR tenant_id IN (
      SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
    )
    OR public.is_super_admin()
  );

-- 2. AI alerts: add company member SELECT policy
CREATE POLICY "Company members can read own alerts"
  ON public.ai_alerts FOR SELECT TO authenticated
  USING (
    company_id IN (SELECT company_id FROM public.company_memberships WHERE user_id = auth.uid())
    OR public.is_super_admin()
  );

-- 3. Company settings: tighten to authenticated members + anon for public sites
DROP POLICY IF EXISTS "Public read company settings" ON public.company_settings;
CREATE POLICY "Anyone can read company settings"
  ON public.company_settings FOR SELECT
  USING (true);
