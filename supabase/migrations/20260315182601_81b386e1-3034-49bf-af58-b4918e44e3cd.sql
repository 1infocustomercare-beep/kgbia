
-- 1. Orders: remove duplicate INSERT policy
DROP POLICY IF EXISTS "Customers can create orders" ON public.orders;

-- 2. GDPR consents: restrict UPDATE to own session_id
DROP POLICY IF EXISTS "Anyone can update own consent" ON public.gdpr_consents;
CREATE POLICY "Anyone can update own consent by session"
  ON public.gdpr_consents FOR UPDATE TO public
  USING (session_id = current_setting('request.headers', true)::json->>'x-session-id')
  WITH CHECK (session_id = current_setting('request.headers', true)::json->>'x-session-id');

-- 3. Media vault: restrict mutations to super_admin only
DROP POLICY IF EXISTS "Authenticated users can update media" ON public.media_vault;
DROP POLICY IF EXISTS "Authenticated users can delete media" ON public.media_vault;
DROP POLICY IF EXISTS "Authenticated users can insert media" ON public.media_vault;

CREATE POLICY "Super admins manage media"
  ON public.media_vault FOR ALL TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- 4. Push subscriptions: scope DELETE to own endpoint
DROP POLICY IF EXISTS "Anyone can delete own subscription" ON public.push_subscriptions;
CREATE POLICY "Users delete own push subscription"
  ON public.push_subscriptions FOR DELETE TO public
  USING (endpoint = current_setting('request.headers', true)::json->>'x-push-endpoint');

-- 5. Wallet passes: remove overly permissive public INSERT (authenticated policy exists)
DROP POLICY IF EXISTS "System creates wallet passes" ON public.wallet_passes;

-- 6. AI usage logs: restrict INSERT to super_admin
DROP POLICY IF EXISTS "Service role inserts logs" ON public.ai_usage_logs;
CREATE POLICY "Authenticated admins insert logs"
  ON public.ai_usage_logs FOR INSERT TO authenticated
  WITH CHECK (is_super_admin());

-- 7. Chat messages: scope INSERT to restaurant context
DROP POLICY IF EXISTS "Anyone can send messages" ON public.chat_messages;
CREATE POLICY "Authenticated users send messages"
  ON public.chat_messages FOR INSERT TO authenticated
  WITH CHECK (
    is_restaurant_member(restaurant_id)
    OR is_restaurant_owner(restaurant_id)
    OR is_super_admin()
  );
