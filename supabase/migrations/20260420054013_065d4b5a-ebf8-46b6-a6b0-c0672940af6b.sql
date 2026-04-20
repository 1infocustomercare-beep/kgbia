ALTER TABLE public.sales_agent_approvals
  ADD COLUMN IF NOT EXISTS template_id text,
  ADD COLUMN IF NOT EXISTS body_html text,
  ADD COLUMN IF NOT EXISTS deliverability_score integer,
  ADD COLUMN IF NOT EXISTS deliverability_warnings jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS template_metadata jsonb DEFAULT '{}'::jsonb;

ALTER TABLE public.sales_agent_actions
  ADD COLUMN IF NOT EXISTS template_id text,
  ADD COLUMN IF NOT EXISTS deliverability_score integer;

CREATE INDEX IF NOT EXISTS idx_sales_agent_approvals_template
  ON public.sales_agent_approvals(template_id);