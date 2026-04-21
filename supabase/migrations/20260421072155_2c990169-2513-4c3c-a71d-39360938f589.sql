ALTER TABLE public.arianna_autopilot_state
ADD COLUMN IF NOT EXISTS auto_send_messages boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.arianna_autopilot_state.auto_send_messages IS
'Se true: l''autopilot invia automaticamente messaggi (WhatsApp/email) ai lead caldi trovati. Se false (default): salva solo in pipeline per approvazione manuale.';