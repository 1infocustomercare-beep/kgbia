
-- ============================================================
-- EMPIRE BRAIN — Sistema agenti meta separato dai 98 settoriali
-- Solo super_admin può accedere. Categoria/runtime isolato.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.empire_brain_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  category_code text NOT NULL,
  category_label text NOT NULL,
  description text,
  system_prompt text NOT NULL,
  tools text,
  model_preference text DEFAULT 'sonnet',
  is_orchestrator boolean DEFAULT false,
  is_active boolean DEFAULT true,
  ai_model text DEFAULT 'google/gemini-2.5-flash',
  total_runs integer DEFAULT 0,
  total_success integer DEFAULT 0,
  avg_duration_ms integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_eb_agents_category ON public.empire_brain_agents(category_code);
CREATE INDEX IF NOT EXISTS idx_eb_agents_active ON public.empire_brain_agents(is_active);

ALTER TABLE public.empire_brain_agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all_eb_agents"
  ON public.empire_brain_agents FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- ============================================================
CREATE TABLE IF NOT EXISTS public.empire_brain_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_title text NOT NULL,
  task_input text NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- pending|planning|running|completed|failed|cancelled
  trigger_source text NOT NULL DEFAULT 'manual', -- manual|schedule|api
  schedule_id uuid,
  orchestrator_plan jsonb DEFAULT '{}'::jsonb,
  shared_context jsonb DEFAULT '{}'::jsonb,
  final_output text,
  agents_used text[] DEFAULT '{}',
  total_steps integer DEFAULT 0,
  completed_steps integer DEFAULT 0,
  duration_ms integer,
  error_message text,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_eb_runs_status ON public.empire_brain_runs(status);
CREATE INDEX IF NOT EXISTS idx_eb_runs_created ON public.empire_brain_runs(created_at DESC);

ALTER TABLE public.empire_brain_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all_eb_runs"
  ON public.empire_brain_runs FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- ============================================================
CREATE TABLE IF NOT EXISTS public.empire_brain_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES public.empire_brain_runs(id) ON DELETE CASCADE,
  step_index integer NOT NULL,
  agent_slug text NOT NULL,
  agent_name text NOT NULL,
  role text NOT NULL DEFAULT 'agent', -- orchestrator|agent|system
  input_payload jsonb,
  output_text text,
  output_data jsonb,
  status text NOT NULL DEFAULT 'pending', -- pending|running|done|error
  duration_ms integer,
  error_message text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_eb_msgs_run ON public.empire_brain_messages(run_id, step_index);

ALTER TABLE public.empire_brain_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all_eb_messages"
  ON public.empire_brain_messages FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- ============================================================
CREATE TABLE IF NOT EXISTS public.empire_brain_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  task_input text NOT NULL,
  cron_expression text NOT NULL,
  is_active boolean DEFAULT true,
  preferred_agents text[] DEFAULT '{}',
  last_run_at timestamptz,
  last_run_status text,
  next_run_at timestamptz,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.empire_brain_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all_eb_schedules"
  ON public.empire_brain_schedules FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- updated_at triggers
CREATE TRIGGER trg_eb_agents_updated BEFORE UPDATE ON public.empire_brain_agents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_eb_schedules_updated BEFORE UPDATE ON public.empire_brain_schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.empire_brain_runs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.empire_brain_messages;
