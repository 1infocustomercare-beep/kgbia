
-- 1) Sequenza outreach per lead (1 sequenza attiva per lead/owner)
CREATE TABLE IF NOT EXISTS public.lead_outreach_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active', -- active | paused | converted | exhausted | unsubscribed
  strategy text NOT NULL DEFAULT 'adaptive_ai', -- adaptive_ai | soft_3 | aggressive_5 | single
  channels_priority text[] NOT NULL DEFAULT ARRAY['email','whatsapp','instagram','facebook'],
  current_touch_number int NOT NULL DEFAULT 0,
  max_touches int NOT NULL DEFAULT 5,
  last_touch_at timestamptz,
  next_touch_at timestamptz,
  next_touch_channel text,
  ai_reasoning text,
  conversion_signal text, -- 'replied' | 'clicked' | 'opened' | null
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(owner_id, lead_id)
);

CREATE INDEX IF NOT EXISTS idx_outreach_seq_next ON public.lead_outreach_sequences(next_touch_at) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_outreach_seq_owner ON public.lead_outreach_sequences(owner_id);

ALTER TABLE public.lead_outreach_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner manages own sequences"
  ON public.lead_outreach_sequences FOR ALL
  USING (owner_id = auth.uid() OR public.is_super_admin())
  WITH CHECK (owner_id = auth.uid() OR public.is_super_admin());

CREATE TRIGGER trg_outreach_seq_updated
  BEFORE UPDATE ON public.lead_outreach_sequences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Storico singoli touch (1 riga per messaggio inviato)
CREATE TABLE IF NOT EXISTS public.lead_outreach_touches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id uuid REFERENCES public.lead_outreach_sequences(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL,
  lead_id uuid NOT NULL,
  touch_number int NOT NULL,
  channel text NOT NULL, -- email | whatsapp | instagram | facebook
  recipient text,
  subject text,
  body_text text,
  body_html text,
  preview_url text, -- mockup link allegato
  status text NOT NULL DEFAULT 'queued', -- queued | sent | delivered | opened | clicked | replied | failed | manual_link
  provider text, -- resend | twilio | manual_dm
  manual_dm_url text, -- link diretto a IG/FB DM da aprire
  ai_persuasion_score int,
  scheduled_for timestamptz,
  sent_at timestamptz,
  opened_at timestamptz,
  replied_at timestamptz,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_outreach_touch_seq ON public.lead_outreach_touches(sequence_id);
CREATE INDEX IF NOT EXISTS idx_outreach_touch_lead ON public.lead_outreach_touches(lead_id);
CREATE INDEX IF NOT EXISTS idx_outreach_touch_owner ON public.lead_outreach_touches(owner_id, created_at DESC);

ALTER TABLE public.lead_outreach_touches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner views own touches"
  ON public.lead_outreach_touches FOR SELECT
  USING (owner_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "service inserts touches"
  ON public.lead_outreach_touches FOR INSERT
  WITH CHECK (owner_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "owner updates own touches"
  ON public.lead_outreach_touches FOR UPDATE
  USING (owner_id = auth.uid() OR public.is_super_admin());

-- 3) Suppression list (anti-spam per lead/canale)
CREATE TABLE IF NOT EXISTS public.outreach_suppression (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  identifier text NOT NULL, -- email, telefono, @handle
  channel text NOT NULL, -- email | whatsapp | instagram | facebook | all
  reason text NOT NULL DEFAULT 'unsubscribe', -- unsubscribe | spam_report | bounce | manual
  source_touch_id uuid REFERENCES public.lead_outreach_touches(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(owner_id, identifier, channel)
);

CREATE INDEX IF NOT EXISTS idx_suppression_lookup ON public.outreach_suppression(owner_id, identifier, channel);

ALTER TABLE public.outreach_suppression ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner manages own suppression"
  ON public.outreach_suppression FOR ALL
  USING (owner_id = auth.uid() OR public.is_super_admin())
  WITH CHECK (owner_id = auth.uid() OR public.is_super_admin());

-- 4) Estendi sales_agent_config con preferenze multicanale
ALTER TABLE public.sales_agent_config
  ADD COLUMN IF NOT EXISTS outreach_strategy text NOT NULL DEFAULT 'adaptive_ai',
  ADD COLUMN IF NOT EXISTS max_touches_per_lead int NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS min_hours_between_touches int NOT NULL DEFAULT 48,
  ADD COLUMN IF NOT EXISTS auto_send_email boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS auto_send_whatsapp boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS auto_send_instagram boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS auto_send_facebook boolean NOT NULL DEFAULT false;

-- 5) Funzione: helper per controllare suppression
CREATE OR REPLACE FUNCTION public.is_outreach_suppressed(
  p_owner_id uuid, p_identifier text, p_channel text
) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.outreach_suppression
    WHERE owner_id = p_owner_id
      AND lower(identifier) = lower(p_identifier)
      AND (channel = p_channel OR channel = 'all')
  );
$$;
