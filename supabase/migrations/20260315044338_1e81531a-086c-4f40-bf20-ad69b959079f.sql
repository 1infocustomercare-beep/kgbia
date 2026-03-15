
-- Add AI intelligence fields to agents table
DO $$ BEGIN
  CREATE TYPE public.privacy_level AS ENUM ('strict', 'standard', 'minimal');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.agents
  ADD COLUMN IF NOT EXISTS ai_model text NOT NULL DEFAULT 'gpt-4o',
  ADD COLUMN IF NOT EXISTS learning_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS privacy_level text NOT NULL DEFAULT 'strict',
  ADD COLUMN IF NOT EXISTS autonomy_level integer NOT NULL DEFAULT 7;

-- Add validation trigger for autonomy_level (1-10)
CREATE OR REPLACE FUNCTION public.validate_autonomy_level()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $fn$
BEGIN
  IF NEW.autonomy_level < 1 THEN NEW.autonomy_level := 1; END IF;
  IF NEW.autonomy_level > 10 THEN NEW.autonomy_level := 10; END IF;
  IF NEW.privacy_level NOT IN ('strict', 'standard', 'minimal') THEN NEW.privacy_level := 'strict'; END IF;
  RETURN NEW;
END;
$fn$;

DROP TRIGGER IF EXISTS trg_validate_autonomy ON public.agents;
CREATE TRIGGER trg_validate_autonomy
  BEFORE INSERT OR UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.validate_autonomy_level();
