
-- Fix chat_messages INSERT policy to allow anonymous customers (no auth required)
DROP POLICY IF EXISTS "Authenticated users send messages" ON public.chat_messages;

CREATE POLICY "Anyone can send messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (true);
