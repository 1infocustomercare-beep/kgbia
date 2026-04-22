ALTER TABLE public.seller_mockup_suites
ADD COLUMN IF NOT EXISTS is_favorite boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_seller_mockup_suites_owner_favorite
ON public.seller_mockup_suites (owner_id, is_favorite)
WHERE is_favorite = true;