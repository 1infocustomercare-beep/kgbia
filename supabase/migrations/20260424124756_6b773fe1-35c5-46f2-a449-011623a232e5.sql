-- Aggiungi regole di priorità lead e concorrenza conversazioni alla config Autopilot
ALTER TABLE public.autopilot_config
  ADD COLUMN IF NOT EXISTS priority_rules jsonb NOT NULL DEFAULT jsonb_build_object(
    'pain_score_weight', 40,
    'roi_potential_weight', 35,
    'sector_match_weight', 15,
    'recency_weight', 10,
    'min_pain_score', 50,
    'min_roi_eur_month', 0,
    'preferred_sectors', '[]'::jsonb,
    'excluded_sectors', '[]'::jsonb
  ),
  ADD COLUMN IF NOT EXISTS max_concurrent_conversations integer NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS max_new_conversations_per_run integer NOT NULL DEFAULT 3;

-- Validazione soft sui range
CREATE OR REPLACE FUNCTION public.validate_autopilot_priority()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.max_concurrent_conversations < 1 THEN NEW.max_concurrent_conversations := 1; END IF;
  IF NEW.max_concurrent_conversations > 100 THEN NEW.max_concurrent_conversations := 100; END IF;
  IF NEW.max_new_conversations_per_run < 1 THEN NEW.max_new_conversations_per_run := 1; END IF;
  IF NEW.max_new_conversations_per_run > 50 THEN NEW.max_new_conversations_per_run := 50; END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_autopilot_priority ON public.autopilot_config;
CREATE TRIGGER trg_validate_autopilot_priority
  BEFORE INSERT OR UPDATE ON public.autopilot_config
  FOR EACH ROW EXECUTE FUNCTION public.validate_autopilot_priority();