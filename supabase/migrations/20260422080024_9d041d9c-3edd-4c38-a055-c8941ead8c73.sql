
-- Add generation_engine column to mockup suites + demo vault for engine separation
ALTER TABLE public.seller_mockup_suites 
  ADD COLUMN IF NOT EXISTS generation_engine text NOT NULL DEFAULT 'template';

ALTER TABLE public.seller_demo_vault 
  ADD COLUMN IF NOT EXISTS generation_engine text NOT NULL DEFAULT 'template';

-- Constraint: solo valori validi
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'seller_mockup_suites_engine_check') THEN
    ALTER TABLE public.seller_mockup_suites
      ADD CONSTRAINT seller_mockup_suites_engine_check
      CHECK (generation_engine IN ('ai','template','hybrid'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'seller_demo_vault_engine_check') THEN
    ALTER TABLE public.seller_demo_vault
      ADD CONSTRAINT seller_demo_vault_engine_check
      CHECK (generation_engine IN ('ai','template','hybrid'));
  END IF;
END$$;

-- Backfill euristico mockup suites:
--  - se screens contiene marker AI ('ai_generated', 'ai_prompt') → 'ai'
--  - se template_variant valorizzato → 'template'
--  - altrimenti → 'template' (default già)
UPDATE public.seller_mockup_suites
SET generation_engine = 'ai'
WHERE generation_engine = 'template'
  AND (
    screens::text ILIKE '%"ai_generated"%'
    OR screens::text ILIKE '%"ai_prompt"%'
    OR screens::text ILIKE '%"generated_by_ai"%'
  );

-- Backfill euristico demo vault:
--  - se brand_payload o full_result contiene marker AI scraping → 'ai'
--  - altrimenti template (default)
UPDATE public.seller_demo_vault
SET generation_engine = 'ai'
WHERE generation_engine = 'template'
  AND (
    full_result::text ILIKE '%"scraped_data"%'
    OR full_result::text ILIKE '%"ai_factory"%'
    OR brand_payload::text ILIKE '%"ai_generated"%'
  );

-- Index per filtri rapidi
CREATE INDEX IF NOT EXISTS idx_seller_mockup_suites_engine 
  ON public.seller_mockup_suites(owner_id, generation_engine);
CREATE INDEX IF NOT EXISTS idx_seller_demo_vault_engine 
  ON public.seller_demo_vault(owner_id, generation_engine);

COMMENT ON COLUMN public.seller_mockup_suites.generation_engine IS 'Engine usato per generare la suite: ai = generato da AI con scraping, template = preset manuale, hybrid = AI + correzioni manuali';
COMMENT ON COLUMN public.seller_demo_vault.generation_engine IS 'Engine usato per generare la demo: ai = AI Factory con scraping, template = variante preset selezionata, hybrid = misto';
