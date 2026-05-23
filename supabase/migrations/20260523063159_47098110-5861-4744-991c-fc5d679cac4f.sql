-- Storage bucket pubblico
INSERT INTO storage.buckets (id, name, public)
VALUES ('homepage-media', 'homepage-media', true)
ON CONFLICT (id) DO NOTHING;

-- Tabella catalogo media
CREATE TABLE IF NOT EXISTS public.homepage_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL DEFAULT 'other',
  title text,
  description text,
  tags text[] DEFAULT '{}',
  storage_path text NOT NULL,
  public_url text NOT NULL,
  mime_type text,
  width int,
  height int,
  size_bytes bigint,
  focal_x numeric DEFAULT 0.5,
  focal_y numeric DEFAULT 0.5,
  is_video boolean DEFAULT false,
  poster_url text,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_homepage_media_category ON public.homepage_media(category);
CREATE INDEX IF NOT EXISTS idx_homepage_media_created ON public.homepage_media(created_at DESC);

ALTER TABLE public.homepage_media ENABLE ROW LEVEL SECURITY;

-- Lettura pubblica
CREATE POLICY "homepage_media public read"
ON public.homepage_media FOR SELECT
USING (true);

-- Scrittura solo super admin
CREATE POLICY "homepage_media super admin insert"
ON public.homepage_media FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "homepage_media super admin update"
ON public.homepage_media FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "homepage_media super admin delete"
ON public.homepage_media FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- Trigger updated_at
CREATE TRIGGER homepage_media_updated_at
BEFORE UPDATE ON public.homepage_media
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies: lettura pubblica, scrittura super admin
CREATE POLICY "homepage-media public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'homepage-media');

CREATE POLICY "homepage-media super admin write"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'homepage-media' AND public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "homepage-media super admin update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'homepage-media' AND public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "homepage-media super admin delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'homepage-media' AND public.has_role(auth.uid(), 'super_admin'));