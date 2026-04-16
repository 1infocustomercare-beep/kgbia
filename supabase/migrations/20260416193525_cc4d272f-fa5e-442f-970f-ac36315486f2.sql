-- Add CRM fields for seller pipeline management
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS last_contacted_at timestamptz,
  ADD COLUMN IF NOT EXISTS next_followup_at timestamptz,
  ADD COLUMN IF NOT EXISTS interactions jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS outcome text DEFAULT 'in_progress',
  ADD COLUMN IF NOT EXISTS owner_id uuid,
  ADD COLUMN IF NOT EXISTS channel_used text,
  ADD COLUMN IF NOT EXISTS estimated_value numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS instagram text,
  ADD COLUMN IF NOT EXISTS google_rating numeric,
  ADD COLUMN IF NOT EXISTS google_reviews integer,
  ADD COLUMN IF NOT EXISTS full_address text,
  ADD COLUMN IF NOT EXISTS lead_source_data jsonb DEFAULT '{}'::jsonb;

-- Make company_id nullable so personal seller leads (no company) work
ALTER TABLE public.leads ALTER COLUMN company_id DROP NOT NULL;

-- Backfill owner_id from existing company memberships when missing
UPDATE public.leads l
SET owner_id = cm.user_id
FROM public.company_memberships cm
WHERE l.owner_id IS NULL AND l.company_id = cm.company_id;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_owner_id ON public.leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_next_followup ON public.leads(next_followup_at) WHERE next_followup_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_owner_status ON public.leads(owner_id, status);

-- Validation trigger for outcome
CREATE OR REPLACE FUNCTION public.validate_lead_outcome()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.outcome NOT IN ('in_progress', 'won', 'lost', 'paused') THEN
    NEW.outcome := 'in_progress';
  END IF;
  IF NEW.status NOT IN ('new', 'contacted', 'replied', 'demo_booked', 'negotiating', 'won', 'lost') THEN
    NEW.status := 'new';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_lead_outcome_trigger ON public.leads;
CREATE TRIGGER validate_lead_outcome_trigger
  BEFORE INSERT OR UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.validate_lead_outcome();

-- Auto-set owner_id on insert if not provided
CREATE OR REPLACE FUNCTION public.set_lead_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.owner_id IS NULL THEN
    NEW.owner_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_lead_owner_trigger ON public.leads;
CREATE TRIGGER set_lead_owner_trigger
  BEFORE INSERT ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_lead_owner();

-- RLS: sellers can manage their own personal leads (owner_id = auth.uid())
DROP POLICY IF EXISTS "Sellers manage their own leads" ON public.leads;
CREATE POLICY "Sellers manage their own leads"
ON public.leads
FOR ALL
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid() OR owner_id IS NULL);
