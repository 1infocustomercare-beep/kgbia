ALTER TABLE public.seller_custom_previews
  ADD COLUMN IF NOT EXISTS mockup_screens jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS mockup_engine text,
  ADD COLUMN IF NOT EXISTS mockup_generated_at timestamp with time zone;