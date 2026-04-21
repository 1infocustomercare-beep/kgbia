ALTER TABLE public.arianna_autopilot_state
  ADD COLUMN IF NOT EXISTS auto_tune_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS last_tuned_at timestamptz,
  ADD COLUMN IF NOT EXISTS tuning_history jsonb NOT NULL DEFAULT '[]'::jsonb;