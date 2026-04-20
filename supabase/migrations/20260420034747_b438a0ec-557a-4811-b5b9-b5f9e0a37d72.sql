-- Lead Intelligence Reports — analisi completa e personalizzata di OGNI lead
CREATE TABLE IF NOT EXISTS public.lead_intelligence_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  cache_key text NOT NULL,
  lead_name text NOT NULL,
  lead_city text,
  lead_sector text,
  lead_website text,
  lead_phone text,

  -- Scoring
  vendibility_score integer NOT NULL DEFAULT 50, -- 0-100
  category text NOT NULL DEFAULT 'tiepido', -- hot | warm | tiepido | freddo
  category_reason text,

  -- Analisi sito
  has_website boolean DEFAULT false,
  website_quality_score integer, -- 0-100
  website_issues jsonb DEFAULT '[]'::jsonb, -- ["design obsoleto", "non responsive", ...]
  missing_features jsonb DEFAULT '[]'::jsonb, -- ["prenotazione online", "menu QR", ...]

  -- Analisi social
  has_instagram boolean DEFAULT false,
  has_facebook boolean DEFAULT false,
  social_engagement_score integer, -- 0-100
  social_issues jsonb DEFAULT '[]'::jsonb,

  -- Analisi recensioni
  google_rating numeric(3,2),
  google_reviews_count integer,
  reputation_score integer, -- 0-100
  reputation_issues jsonb DEFAULT '[]'::jsonb,

  -- Output venditore
  weak_points jsonb DEFAULT '[]'::jsonb, -- punti deboli totali aggregati
  improvement_proposal text, -- cosa Empire può migliorare per loro
  recommended_package text, -- digital_start | growth_ai | empire_domination
  sales_pitch text, -- script pronto all'uso
  approach_strategy text, -- come approcciarli (cold call, email, whatsapp, in persona)

  -- Mockup PRIMA/DOPO (on-demand)
  mockup_before_url text,
  mockup_after_url text,
  mockup_generated_at timestamptz,

  -- Meta
  raw_analysis jsonb DEFAULT '{}'::jsonb,
  ai_model_used text DEFAULT 'google/gemini-2.5-flash',
  credits_spent integer DEFAULT 0,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS lead_intelligence_reports_owner_cache_key_unique
  ON public.lead_intelligence_reports(owner_id, cache_key);

CREATE INDEX IF NOT EXISTS lead_intelligence_reports_owner_score_idx
  ON public.lead_intelligence_reports(owner_id, vendibility_score DESC);

CREATE INDEX IF NOT EXISTS lead_intelligence_reports_owner_category_idx
  ON public.lead_intelligence_reports(owner_id, category);

ALTER TABLE public.lead_intelligence_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_can_view_own_intelligence" ON public.lead_intelligence_reports
  FOR SELECT USING (auth.uid() = owner_id OR public.is_super_admin());

CREATE POLICY "owner_can_insert_own_intelligence" ON public.lead_intelligence_reports
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "owner_can_update_own_intelligence" ON public.lead_intelligence_reports
  FOR UPDATE USING (auth.uid() = owner_id OR public.is_super_admin());

CREATE POLICY "owner_can_delete_own_intelligence" ON public.lead_intelligence_reports
  FOR DELETE USING (auth.uid() = owner_id OR public.is_super_admin());

CREATE TRIGGER trg_lead_intelligence_reports_updated_at
  BEFORE UPDATE ON public.lead_intelligence_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Nuovi costi crediti per Intelligence Engine
INSERT INTO public.seller_action_costs (action, credit_cost, cost_eur_estimate, label, is_active)
VALUES
  ('lead_intelligence_analysis', 3, 0.18, 'Analisi Intelligence Lead', true),
  ('lead_mockup_before_after', 10, 0.60, 'Mockup PRIMA/DOPO con AI', true)
ON CONFLICT (action) DO UPDATE
  SET credit_cost = EXCLUDED.credit_cost,
      cost_eur_estimate = EXCLUDED.cost_eur_estimate,
      label = EXCLUDED.label,
      is_active = true;