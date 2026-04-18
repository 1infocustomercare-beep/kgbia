-- Persist demo factory output on each lead so seller always sees it
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS demo_run_id uuid REFERENCES public.demo_factory_runs(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS demo_preview_url text,
  ADD COLUMN IF NOT EXISTS demo_admin_url text,
  ADD COLUMN IF NOT EXISTS demo_template_variant text,
  ADD COLUMN IF NOT EXISTS demo_sub_sector text,
  ADD COLUMN IF NOT EXISTS demo_generated_at timestamptz,
  ADD COLUMN IF NOT EXISTS demo_whatsapp_message text,
  ADD COLUMN IF NOT EXISTS demo_admin_email text,
  ADD COLUMN IF NOT EXISTS demo_admin_password text,
  ADD COLUMN IF NOT EXISTS demo_auto_status text DEFAULT 'pending';

-- Index per query veloci sulla pipeline
CREATE INDEX IF NOT EXISTS idx_leads_demo_run ON public.leads(demo_run_id) WHERE demo_run_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_demo_status ON public.leads(owner_id, demo_auto_status);