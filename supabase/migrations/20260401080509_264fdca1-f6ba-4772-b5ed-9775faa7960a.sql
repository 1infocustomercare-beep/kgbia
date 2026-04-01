
-- Estendi la tabella leads esistente
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS ai_score integer DEFAULT 50,
  ADD COLUMN IF NOT EXISTS city text DEFAULT '',
  ADD COLUMN IF NOT EXISTS sector text DEFAULT '',
  ADD COLUMN IF NOT EXISTS channels_available text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS contact_stage text DEFAULT 'da_contattare',
  ADD COLUMN IF NOT EXISTS lead_platform text DEFAULT 'manuale',
  ADD COLUMN IF NOT EXISTS pain_points text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS ai_summary text DEFAULT '',
  ADD COLUMN IF NOT EXISTS ai_search_query text DEFAULT '';

-- Trigger per validare ai_score
CREATE OR REPLACE FUNCTION public.validate_lead_ai_score()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.ai_score IS NOT NULL THEN
    IF NEW.ai_score < 0 THEN NEW.ai_score := 0; END IF;
    IF NEW.ai_score > 100 THEN NEW.ai_score := 100; END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_lead_ai_score ON public.leads;
CREATE TRIGGER trg_validate_lead_ai_score
  BEFORE INSERT OR UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.validate_lead_ai_score();

-- Campagne outreach
CREATE TABLE IF NOT EXISTS public.lead_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  channel text NOT NULL DEFAULT 'email',
  status text NOT NULL DEFAULT 'draft',
  target_sector text DEFAULT '',
  target_city text DEFAULT '',
  min_score integer DEFAULT 60,
  target_leads_count integer DEFAULT 0,
  sent_count integer DEFAULT 0,
  opened_count integer DEFAULT 0,
  reply_count integer DEFAULT 0,
  template_text text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.lead_campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lead_campaigns_company_policy" ON public.lead_campaigns;
CREATE POLICY "lead_campaigns_company_policy" ON public.lead_campaigns FOR ALL USING (company_id = public.get_user_company(auth.uid()));

-- Validation trigger for lead_campaigns
CREATE OR REPLACE FUNCTION public.validate_lead_campaign_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.channel NOT IN ('email','whatsapp','instagram','multi') THEN
    NEW.channel := 'email';
  END IF;
  IF NEW.status NOT IN ('draft','active','paused','completed') THEN
    NEW.status := 'draft';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_lead_campaign ON public.lead_campaigns;
CREATE TRIGGER trg_validate_lead_campaign
  BEFORE INSERT OR UPDATE ON public.lead_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.validate_lead_campaign_fields();

-- Automazioni outreach
CREATE TABLE IF NOT EXISTS public.lead_automations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  channel text NOT NULL DEFAULT 'email',
  target_sector text DEFAULT '',
  target_stage text DEFAULT 'da_contattare',
  min_score integer DEFAULT 60,
  max_per_run integer DEFAULT 50,
  frequency text NOT NULL DEFAULT 'daily',
  day_of_week text DEFAULT '',
  time_slot text DEFAULT 'morning',
  exact_time text DEFAULT '09:00',
  skip_if_replied boolean DEFAULT true,
  ai_time_optimize boolean DEFAULT false,
  is_active boolean DEFAULT true,
  last_run_at timestamptz,
  total_sent integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.lead_automations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lead_automations_company_policy" ON public.lead_automations;
CREATE POLICY "lead_automations_company_policy" ON public.lead_automations FOR ALL USING (company_id = public.get_user_company(auth.uid()));

-- Validation trigger for lead_automations
CREATE OR REPLACE FUNCTION public.validate_lead_automation_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.channel NOT IN ('email','whatsapp','instagram') THEN
    NEW.channel := 'email';
  END IF;
  IF NEW.frequency NOT IN ('daily','weekly','monthly') THEN
    NEW.frequency := 'daily';
  END IF;
  IF NEW.time_slot NOT IN ('morning','afternoon','evening') THEN
    NEW.time_slot := 'morning';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_lead_automation ON public.lead_automations;
CREATE TRIGGER trg_validate_lead_automation
  BEFORE INSERT OR UPDATE ON public.lead_automations
  FOR EACH ROW EXECUTE FUNCTION public.validate_lead_automation_fields();
