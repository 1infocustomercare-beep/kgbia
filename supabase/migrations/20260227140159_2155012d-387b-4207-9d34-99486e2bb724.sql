
-- Create storage bucket for partner assets
INSERT INTO storage.buckets (id, name, public) VALUES ('partner-assets', 'partner-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access
CREATE POLICY "Anyone can read partner assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'partner-assets');

-- Only super admins can upload
CREATE POLICY "Super admins upload partner assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'partner-assets' AND public.is_super_admin());
