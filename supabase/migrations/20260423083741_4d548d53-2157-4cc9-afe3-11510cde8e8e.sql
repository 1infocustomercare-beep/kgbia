
ALTER TABLE public.lead_intelligence_reports
  ADD COLUMN IF NOT EXISTS brand_logo_url text,
  ADD COLUMN IF NOT EXISTS brand_photos jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS brand_videos jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS brand_colors jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS brand_fonts jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS extracted_business_data jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS social_handles jsonb DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.lead_intelligence_reports.brand_logo_url IS 'URL logo del lead estratto da scrape sito (per splash mockup)';
COMMENT ON COLUMN public.lead_intelligence_reports.brand_photos IS 'Array URL foto reali del lead (hero, ambiente, prodotti)';
COMMENT ON COLUMN public.lead_intelligence_reports.brand_videos IS 'Array URL video reali del lead (YouTube, Vimeo, MP4)';
COMMENT ON COLUMN public.lead_intelligence_reports.brand_colors IS 'Palette colori brand: { primary, secondary, accent, background, text }';
COMMENT ON COLUMN public.lead_intelligence_reports.extracted_business_data IS 'Dati strutturati estratti: orari, indirizzo completo, menu/listino, descrizione, slogan';
COMMENT ON COLUMN public.lead_intelligence_reports.social_handles IS 'Handle social trovati: { instagram, facebook, tiktok, youtube, linkedin }';
