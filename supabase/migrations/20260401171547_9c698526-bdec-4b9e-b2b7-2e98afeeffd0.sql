
CREATE TABLE public.partner_outreach (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL,
  prospect_name TEXT NOT NULL,
  prospect_contact TEXT,
  channel TEXT NOT NULL DEFAULT 'instagram',
  sector_id TEXT,
  message_sent TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  notes TEXT,
  next_followup_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_outreach ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view own outreach"
  ON public.partner_outreach FOR SELECT
  TO authenticated
  USING (partner_id = auth.uid());

CREATE POLICY "Partners can insert own outreach"
  ON public.partner_outreach FOR INSERT
  TO authenticated
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Partners can update own outreach"
  ON public.partner_outreach FOR UPDATE
  TO authenticated
  USING (partner_id = auth.uid());

CREATE POLICY "Partners can delete own outreach"
  ON public.partner_outreach FOR DELETE
  TO authenticated
  USING (partner_id = auth.uid());

CREATE TRIGGER update_partner_outreach_updated_at
  BEFORE UPDATE ON public.partner_outreach
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_partner_outreach_partner ON public.partner_outreach(partner_id);
CREATE INDEX idx_partner_outreach_status ON public.partner_outreach(status);
