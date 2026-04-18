
CREATE TABLE IF NOT EXISTS public.demo_factory_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID,
  owner_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  agents_status JSONB NOT NULL DEFAULT '{
    "scout": "pending",
    "analyst": "pending",
    "curator": "pending",
    "copywriter": "pending",
    "builder": "pending",
    "closer": "pending"
  }'::jsonb,
  template_variant TEXT,
  sub_sector TEXT,
  preview_url TEXT,
  admin_url TEXT,
  admin_email TEXT,
  admin_password TEXT,
  whatsapp_message TEXT,
  whatsapp_link TEXT,
  call_script JSONB,
  objections JSONB,
  brand_kit JSONB,
  scraped_data JSONB,
  error_message TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_demo_factory_runs_owner ON public.demo_factory_runs(owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demo_factory_runs_lead ON public.demo_factory_runs(lead_id);
CREATE INDEX IF NOT EXISTS idx_demo_factory_runs_status ON public.demo_factory_runs(status);

ALTER TABLE public.demo_factory_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own factory runs"
ON public.demo_factory_runs FOR SELECT
USING (auth.uid() = owner_id OR public.is_super_admin());

CREATE POLICY "Users can create their own factory runs"
ON public.demo_factory_runs FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own factory runs"
ON public.demo_factory_runs FOR UPDATE
USING (auth.uid() = owner_id OR public.is_super_admin());

CREATE POLICY "Service role can manage all factory runs"
ON public.demo_factory_runs FOR ALL
USING (auth.role() = 'service_role');

CREATE TRIGGER update_demo_factory_runs_updated_at
BEFORE UPDATE ON public.demo_factory_runs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
