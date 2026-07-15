
-- Tighten INSERT on demo_site_analytics: require demo_site_id to reference an existing demo_sites row
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.demo_site_analytics;
CREATE POLICY "Anyone can insert analytics events for real demo sites"
  ON public.demo_site_analytics
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.demo_sites ds WHERE ds.id = demo_site_analytics.demo_site_id));

-- Restrict realtime.messages to topics scoped to the requesting user's uid
DROP POLICY IF EXISTS "Authenticated can use realtime channels" ON realtime.messages;
DROP POLICY IF EXISTS "Authenticated can publish realtime messages" ON realtime.messages;

CREATE POLICY "Users read own-topic realtime messages"
  ON realtime.messages
  FOR SELECT
  TO authenticated
  USING (
    realtime.topic() IS NOT NULL
    AND auth.uid() IS NOT NULL
    AND position(auth.uid()::text in realtime.topic()) > 0
  );

CREATE POLICY "Users publish own-topic realtime messages"
  ON realtime.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    realtime.topic() IS NOT NULL
    AND auth.uid() IS NOT NULL
    AND position(auth.uid()::text in realtime.topic()) > 0
  );
