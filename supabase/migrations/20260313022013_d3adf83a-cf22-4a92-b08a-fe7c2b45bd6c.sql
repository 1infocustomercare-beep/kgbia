
-- Media Vault table for dynamic media management
CREATE TABLE public.media_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'image' CHECK (type IN ('video', 'image')),
  url TEXT NOT NULL,
  section TEXT DEFAULT '',
  description TEXT DEFAULT '',
  dimensions TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_bundled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.media_vault ENABLE ROW LEVEL SECURITY;

-- Public read access (landing page needs to read these)
CREATE POLICY "Anyone can read media_vault" ON public.media_vault
  FOR SELECT TO anon, authenticated USING (true);

-- Only authenticated users can insert/update/delete
CREATE POLICY "Authenticated users can insert media" ON public.media_vault
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update media" ON public.media_vault
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete media" ON public.media_vault
  FOR DELETE TO authenticated USING (true);

-- Storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('media-vault', 'media-vault', true, 104857600)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can read media-vault files" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'media-vault');

CREATE POLICY "Authenticated can upload media-vault" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media-vault');

CREATE POLICY "Authenticated can delete media-vault" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media-vault');

-- Seed existing bundled assets
INSERT INTO public.media_vault (name, type, url, section, description, dimensions, sort_order, is_bundled) VALUES
  ('Hero Empire', 'video', '/bundled/video-hero-empire.mp4', 'Landing — Hero', 'Video principale: dashboard IA, tecnologia business, ecosistema digitale', '1920×1080', 1, true),
  ('Multi-Settore', 'video', '/bundled/video-industries.mp4', 'Landing — Settori', 'Montaggio settori: ristorante, NCC, beauty, fitness, retail', '1920×1080', 2, true),
  ('Platform Features', 'video', '/bundled/video-features.mp4', 'Landing — Funzionalità', 'App mobile, QR code, analytics, pagamenti contactless', '1920×1080', 3, true),
  ('Partner Pitch', 'video', '/bundled/video-partner-pitch.mp4', 'Landing — Partner', 'Presentazione commerciale per venditori e partner', '1920×1080', 4, true),
  ('Hero Landing', 'image', '/bundled/hero-landing.jpg', 'Landing — Background', 'Immagine di sfondo hero principale', '1920×1080', 5, true),
  ('Mockup Cliente', 'image', '/bundled/mockup-cliente.jpg', 'Landing — App Showcase', 'Screenshot app vista cliente', '390×844', 6, true),
  ('Mockup Admin', 'image', '/bundled/mockup-admin.jpg', 'Landing — App Showcase', 'Screenshot pannello gestionale', '390×844', 7, true),
  ('Mockup Cucina', 'image', '/bundled/mockup-cucina.jpg', 'Landing — App Showcase', 'Screenshot vista operativa cucina', '390×844', 8, true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.media_vault;
