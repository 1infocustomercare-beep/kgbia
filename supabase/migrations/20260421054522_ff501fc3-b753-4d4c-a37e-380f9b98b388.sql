
-- Suite di 4 mockup iPhone per lead/preview custom
CREATE TABLE IF NOT EXISTS public.seller_mockup_suites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  lead_id uuid,
  preview_id uuid,
  business_name text NOT NULL,
  business_sector text,
  business_city text,
  template_variant text DEFAULT 'modern_dark',
  engine text NOT NULL DEFAULT 'react' CHECK (engine IN ('react','nano_banana','nano_banana_pro')),
  screens jsonb NOT NULL DEFAULT '[]'::jsonb,
  primary_color text DEFAULT '#C8963E',
  share_slug text UNIQUE,
  view_count integer DEFAULT 0,
  credits_spent integer DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','generating','complete','error')),
  error_message text,
  generated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mockup_suites_owner ON public.seller_mockup_suites(owner_id);
CREATE INDEX IF NOT EXISTS idx_mockup_suites_lead ON public.seller_mockup_suites(lead_id);
CREATE INDEX IF NOT EXISTS idx_mockup_suites_slug ON public.seller_mockup_suites(share_slug);

ALTER TABLE public.seller_mockup_suites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their suites"
  ON public.seller_mockup_suites FOR SELECT
  USING (owner_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "Owners can create suites"
  ON public.seller_mockup_suites FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update their suites"
  ON public.seller_mockup_suites FOR UPDATE
  USING (owner_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "Owners can delete their suites"
  ON public.seller_mockup_suites FOR DELETE
  USING (owner_id = auth.uid() OR public.is_super_admin());

-- Public read by share_slug (per condivisione cliente)
CREATE POLICY "Public can view suite by slug"
  ON public.seller_mockup_suites FOR SELECT
  USING (share_slug IS NOT NULL AND status = 'complete');

CREATE TRIGGER trg_mockup_suites_updated
  BEFORE UPDATE ON public.seller_mockup_suites
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Aggiungi costi azione per i 3 motori
INSERT INTO public.seller_action_costs (action, credit_cost, cost_eur_estimate, label, is_active) VALUES
  ('mockup_suite_react', 0, 0, 'Mockup Suite (React render gratis)', true),
  ('mockup_suite_nano_banana', 20, 0.20, 'Mockup Suite (AI Nano Banana 2)', true),
  ('mockup_suite_nano_banana_pro', 40, 0.80, 'Mockup Suite (AI Nano Banana Pro)', true)
ON CONFLICT (action) DO UPDATE SET
  credit_cost = EXCLUDED.credit_cost,
  cost_eur_estimate = EXCLUDED.cost_eur_estimate,
  label = EXCLUDED.label,
  is_active = true;
