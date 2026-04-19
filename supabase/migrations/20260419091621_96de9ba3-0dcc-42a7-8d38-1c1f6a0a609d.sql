GRANT ALL ON public.empire_brain_agents TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.empire_brain_runs TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.empire_brain_messages TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.empire_brain_schedules TO postgres, anon, authenticated, service_role;
-- Bypass RLS per service_role (default Supabase) - già fatto, ma garantisco
ALTER TABLE public.empire_brain_agents FORCE ROW LEVEL SECURITY;
ALTER TABLE public.empire_brain_runs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.empire_brain_messages FORCE ROW LEVEL SECURITY;
ALTER TABLE public.empire_brain_schedules FORCE ROW LEVEL SECURITY;
-- Service role bypass policy per seed e edge functions
CREATE POLICY "service_role_full_eb_agents" ON public.empire_brain_agents
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_full_eb_runs" ON public.empire_brain_runs
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_full_eb_messages" ON public.empire_brain_messages
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_full_eb_schedules" ON public.empire_brain_schedules
  FOR ALL TO service_role USING (true) WITH CHECK (true);