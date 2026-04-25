-- 1. sector_system_prompts: restrict SELECT to super admin only
DROP POLICY IF EXISTS sector_prompts_select ON public.sector_system_prompts;
CREATE POLICY sector_prompts_select ON public.sector_system_prompts
  FOR SELECT TO authenticated
  USING (public.is_super_admin());

-- 2. seller_credit_alerts: remove permissive INSERT, restrict to service role / super admin
DROP POLICY IF EXISTS "System inserts alerts" ON public.seller_credit_alerts;
CREATE POLICY "Service role or super admin inserts alerts"
  ON public.seller_credit_alerts
  FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin());
-- Note: SECURITY DEFINER functions (e.g. consume_seller_credits) bypass RLS,
-- so legitimate system inserts continue to work.

-- 3. arianna_learning_log: restrict insert/update to owner or super admin
DROP POLICY IF EXISTS "Service role inserts learning" ON public.arianna_learning_log;
DROP POLICY IF EXISTS "Service role updates learning" ON public.arianna_learning_log;

CREATE POLICY "Users insert own learning log"
  ON public.arianna_learning_log
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.is_super_admin());

CREATE POLICY "Users update own learning log"
  ON public.arianna_learning_log
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.is_super_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_super_admin());

-- 4. is_autopilot_super_admin: remove hardcoded emails, use role table
CREATE OR REPLACE FUNCTION public.is_autopilot_super_admin(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT public.has_role(_user_id, 'super_admin'::app_role);
$function$;

-- 5. realtime.messages: add channel authorization so only authenticated users can subscribe
-- (postgres_changes already respect per-table RLS; this scopes Broadcast/Presence too)
ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can use realtime channels" ON realtime.messages;
CREATE POLICY "Authenticated can use realtime channels"
  ON realtime.messages
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated can publish realtime messages" ON realtime.messages;
CREATE POLICY "Authenticated can publish realtime messages"
  ON realtime.messages
  FOR INSERT TO authenticated
  WITH CHECK (true);
