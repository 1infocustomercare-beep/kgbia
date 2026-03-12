
-- Business assets storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-assets', 'business-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to business-assets
CREATE POLICY "Auth users upload business assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'business-assets');

-- Anyone can read business assets (public bucket)
CREATE POLICY "Public read business assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-assets');

-- Owners can delete their assets
CREATE POLICY "Auth users delete own business assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'business-assets' AND (auth.uid())::text = (storage.foldername(name))[1]);
