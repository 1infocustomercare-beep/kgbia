ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS theme_config jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS theme_config jsonb DEFAULT '{}'::jsonb;