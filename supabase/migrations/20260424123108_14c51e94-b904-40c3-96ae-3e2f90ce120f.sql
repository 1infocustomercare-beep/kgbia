-- Aggiunge campi di scheduling alla tabella autopilot_config
ALTER TABLE public.autopilot_config
  ADD COLUMN IF NOT EXISTS next_run_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_run_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_run_status text,
  ADD COLUMN IF NOT EXISTS last_run_summary jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS paused_channels jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS run_interval_minutes integer NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS total_runs integer NOT NULL DEFAULT 0;

-- Validazione: intervallo tra 5 e 720 minuti
CREATE OR REPLACE FUNCTION public.validate_autopilot_schedule()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.run_interval_minutes < 5 THEN NEW.run_interval_minutes := 5; END IF;
  IF NEW.run_interval_minutes > 720 THEN NEW.run_interval_minutes := 720; END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_autopilot_schedule ON public.autopilot_config;
CREATE TRIGGER trg_validate_autopilot_schedule
  BEFORE INSERT OR UPDATE ON public.autopilot_config
  FOR EACH ROW EXECUTE FUNCTION public.validate_autopilot_schedule();

-- Tabella log esecuzioni scheduler (audit + UI history)
CREATE TABLE IF NOT EXISTS public.autopilot_scheduler_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  triggered_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text NOT NULL DEFAULT 'running', -- running | completed | skipped | failed
  skip_reason text,
  scans_executed integer NOT NULL DEFAULT 0,
  conversations_advanced integer NOT NULL DEFAULT 0,
  channels_used jsonb NOT NULL DEFAULT '[]'::jsonb,
  duration_ms integer,
  error_message text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_autopilot_scheduler_runs_owner_time
  ON public.autopilot_scheduler_runs (owner_id, triggered_at DESC);

ALTER TABLE public.autopilot_scheduler_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owner reads own scheduler runs" ON public.autopilot_scheduler_runs;
CREATE POLICY "Owner reads own scheduler runs"
ON public.autopilot_scheduler_runs FOR SELECT
USING (auth.uid() = owner_id OR public.is_super_admin());

DROP POLICY IF EXISTS "Service role manages scheduler runs" ON public.autopilot_scheduler_runs;
CREATE POLICY "Service role manages scheduler runs"
ON public.autopilot_scheduler_runs FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');