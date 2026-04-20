-- Tabella audit per i comandi vocali dell'orchestratore
CREATE TABLE IF NOT EXISTS public.voice_command_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  transcript text NOT NULL,
  intent jsonb NOT NULL DEFAULT '{}'::jsonb,
  actions_planned jsonb NOT NULL DEFAULT '[]'::jsonb,
  actions_executed jsonb NOT NULL DEFAULT '[]'::jsonb,
  reply_text text,
  status text NOT NULL DEFAULT 'pending',
  confirmation_required boolean NOT NULL DEFAULT false,
  confirmed boolean NOT NULL DEFAULT false,
  duration_ms integer,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.voice_command_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admin sees all voice logs"
ON public.voice_command_log FOR SELECT
USING (public.is_super_admin());

CREATE POLICY "Owner sees own voice logs"
ON public.voice_command_log FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated insert own voice logs"
ON public.voice_command_log FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner update own voice logs"
ON public.voice_command_log FOR UPDATE
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_voice_command_log_user_created
  ON public.voice_command_log(user_id, created_at DESC);