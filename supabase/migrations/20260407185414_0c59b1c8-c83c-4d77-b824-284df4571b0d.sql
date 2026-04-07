
-- Drop the restrictive super-admin-only upload policy
DROP POLICY IF EXISTS "Super admins upload partner assets" ON storage.objects;

-- Partners can upload their own files (path starts with their user id)
CREATE POLICY "Users upload own partner assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'partner-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Partners can update their own files
CREATE POLICY "Users update own partner assets"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'partner-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Partners can delete their own files
CREATE POLICY "Users delete own partner assets"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'partner-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
