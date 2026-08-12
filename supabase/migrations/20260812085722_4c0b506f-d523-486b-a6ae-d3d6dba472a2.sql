DROP POLICY IF EXISTS "Anyone reads agent configs" ON public.ai_agent_configs;
CREATE POLICY "Authenticated reads agent configs" ON public.ai_agent_configs FOR SELECT TO authenticated USING (true);
REVOKE SELECT ON public.ai_agent_configs FROM anon;

DROP POLICY IF EXISTS "settings public read" ON public.platform_settings;
CREATE POLICY "settings authenticated read" ON public.platform_settings FOR SELECT TO authenticated USING (true);
REVOKE SELECT ON public.platform_settings FROM anon;