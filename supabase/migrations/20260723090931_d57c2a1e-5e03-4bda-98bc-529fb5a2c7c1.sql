
-- 1. sellers: remove public read of PII/financial data
DROP POLICY IF EXISTS "sellers public read active" ON public.sellers;

-- 2. restaurant-logos storage: remove overly-broad policies, add folder-scoped INSERT
DROP POLICY IF EXISTS "Authenticated users can upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own logos" ON storage.objects;

CREATE POLICY "Users can upload own restaurant logos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'restaurant-logos'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);
