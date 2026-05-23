-- Homepage CMS: singleton JSONB content editable solo da super_admin
CREATE TABLE IF NOT EXISTS public.homepage_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  published_content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

-- Lettura pubblica del contenuto pubblicato (serve alla homepage anonima)
CREATE POLICY "homepage_content_public_read"
ON public.homepage_content
FOR SELECT
USING (true);

-- Solo super_admin può scrivere
CREATE POLICY "homepage_content_super_admin_write"
ON public.homepage_content
FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- Trigger updated_at
CREATE TRIGGER trg_homepage_content_updated
BEFORE UPDATE ON public.homepage_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed singleton
INSERT INTO public.homepage_content (singleton, content, published_content)
VALUES (true, '{}'::jsonb, '{}'::jsonb)
ON CONFLICT (singleton) DO NOTHING;