
-- Nuovi costi azioni "Ricerca Estrema PRO" — markup nascosto sui costi reali API
INSERT INTO public.seller_action_costs (action, label, credit_cost, cost_eur_estimate, is_active, description)
VALUES
  ('lead_enrichment_pro', 'Arricchimento PRO (Yelp/TripAdvisor/Social)', 4, 0.12, true, 'Scrape dati da Yelp + TripAdvisor + Pagine Gialle + check Instagram/Facebook via Firecrawl'),
  ('piva_lookup', 'Lookup P.IVA / Registro Imprese', 2, 0.06, true, 'Verifica partita IVA su database pubblici italiani'),
  ('custom_preview_generation', 'Generazione Preview Custom', 8, 0.40, true, 'Crea template preview professionale per nuovo settore tramite AI')
ON CONFLICT (action) DO UPDATE SET
  label = EXCLUDED.label,
  credit_cost = EXCLUDED.credit_cost,
  cost_eur_estimate = EXCLUDED.cost_eur_estimate,
  description = EXCLUDED.description,
  is_active = true;

-- Cache arricchimenti per evitare riscansione (24h TTL)
CREATE TABLE IF NOT EXISTS public.lead_enrichment_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key text UNIQUE NOT NULL, -- es. "name|city" normalizzato
  lead_name text NOT NULL,
  city text,
  has_website boolean,
  has_instagram boolean,
  has_facebook boolean,
  instagram_url text,
  facebook_url text,
  yelp_rating numeric,
  yelp_reviews integer,
  tripadvisor_rating numeric,
  tripadvisor_reviews integer,
  paginegialle_listing boolean,
  piva text,
  registro_imprese_status text,
  raw_data jsonb DEFAULT '{}'::jsonb,
  hot_score integer DEFAULT 0, -- 0-100 calcolato server-side
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '24 hours')
);

CREATE INDEX IF NOT EXISTS idx_enrichment_cache_key ON public.lead_enrichment_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_enrichment_cache_expires ON public.lead_enrichment_cache(expires_at);

ALTER TABLE public.lead_enrichment_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated can read cache" ON public.lead_enrichment_cache
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "service role manages cache" ON public.lead_enrichment_cache
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Template preview custom create dai venditori
CREATE TABLE IF NOT EXISTS public.seller_custom_previews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  sector_slug text NOT NULL, -- es. "tatuatore", "fioraio"
  sector_label text NOT NULL,
  template_style text NOT NULL DEFAULT 'modern_dark', -- modern_dark, luxury_gold, casual_warm, minimal_zen
  primary_color text DEFAULT '#C8963E',
  hero_title text,
  hero_subtitle text,
  features jsonb DEFAULT '[]'::jsonb,
  preview_html text, -- HTML statico generato
  preview_url text, -- URL sandbox /demo/custom/<id>
  is_published boolean DEFAULT false,
  reuse_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_custom_previews_owner ON public.seller_custom_previews(owner_id);
CREATE INDEX IF NOT EXISTS idx_custom_previews_sector ON public.seller_custom_previews(sector_slug);

ALTER TABLE public.seller_custom_previews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owners read own custom previews" ON public.seller_custom_previews
  FOR SELECT TO authenticated USING (owner_id = auth.uid() OR is_published = true OR public.is_super_admin());

CREATE POLICY "owners insert own custom previews" ON public.seller_custom_previews
  FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());

CREATE POLICY "owners update own custom previews" ON public.seller_custom_previews
  FOR UPDATE TO authenticated USING (owner_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "owners delete own custom previews" ON public.seller_custom_previews
  FOR DELETE TO authenticated USING (owner_id = auth.uid() OR public.is_super_admin());

CREATE TRIGGER trg_custom_previews_updated
  BEFORE UPDATE ON public.seller_custom_previews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
