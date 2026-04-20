
ALTER TABLE public.seller_custom_previews
  ADD COLUMN IF NOT EXISTS lead_id uuid,
  ADD COLUMN IF NOT EXISTS lead_intelligence_id uuid,
  ADD COLUMN IF NOT EXISTS lead_name text,
  ADD COLUMN IF NOT EXISTS lead_city text,
  ADD COLUMN IF NOT EXISTS lead_phone text,
  ADD COLUMN IF NOT EXISTS lead_website text,
  ADD COLUMN IF NOT EXISTS lead_address text,
  ADD COLUMN IF NOT EXISTS lead_email text,
  ADD COLUMN IF NOT EXISTS lead_rating numeric,
  ADD COLUMN IF NOT EXISTS lead_reviews_count integer,
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS hero_image_url text,
  ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS ai_generated_content jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS scraped_data jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS generation_status text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS generation_error text,
  ADD COLUMN IF NOT EXISTS generated_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_viewed_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS public_slug text,
  ADD COLUMN IF NOT EXISTS whatsapp_message text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_custom_previews_public_slug
  ON public.seller_custom_previews(public_slug)
  WHERE public_slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_custom_previews_lead_id
  ON public.seller_custom_previews(lead_id)
  WHERE lead_id IS NOT NULL;

-- Public read by slug (chi ha il link può vedere)
DROP POLICY IF EXISTS "public read by slug" ON public.seller_custom_previews;
CREATE POLICY "public read by slug" ON public.seller_custom_previews
  FOR SELECT TO anon, authenticated
  USING (public_slug IS NOT NULL AND is_published = true);

-- RPC per incrementare visite (no RLS issue)
CREATE OR REPLACE FUNCTION public.increment_custom_preview_view(p_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.seller_custom_previews
  SET view_count = COALESCE(view_count,0) + 1,
      last_viewed_at = now()
  WHERE public_slug = p_slug;
END;
$$;
GRANT EXECUTE ON FUNCTION public.increment_custom_preview_view(text) TO anon, authenticated;

-- Costo aggiornato (la generazione AI ricca costa di più)
UPDATE public.seller_action_costs
SET credit_cost = 15,
    cost_eur_estimate = 0.30,
    label = 'Preview Custom AI (testi + immagine hero + HTML pro)'
WHERE action = 'custom_preview_generation';

INSERT INTO public.seller_action_costs (action, credit_cost, cost_eur_estimate, label, is_active)
SELECT 'custom_preview_generation', 15, 0.30, 'Preview Custom AI (testi + immagine hero + HTML pro)', true
WHERE NOT EXISTS (SELECT 1 FROM public.seller_action_costs WHERE action = 'custom_preview_generation');
