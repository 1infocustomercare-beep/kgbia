
-- ═══ FIX 1: restaurant-logos storage — enforce ownership on UPDATE & DELETE ═══
DROP POLICY IF EXISTS "Authenticated users can update logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete logos" ON storage.objects;

CREATE POLICY "Users can update own restaurant logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'restaurant-logos'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own restaurant logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'restaurant-logos'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ═══ FIX 2: business-assets storage — enforce ownership on INSERT ═══
DROP POLICY IF EXISTS "Authenticated users can upload business assets" ON storage.objects;

CREATE POLICY "Users can upload own business assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'business-assets'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ═══ FIX 3: media-vault storage — enforce ownership on DELETE ═══
DROP POLICY IF EXISTS "Authenticated users can delete media vault files" ON storage.objects;

CREATE POLICY "Users can delete own media vault files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media-vault'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ═══ FIX 4: company_settings — restrict SELECT to company members ═══
DROP POLICY IF EXISTS "Anyone can view company settings" ON public.company_settings;
DROP POLICY IF EXISTS "Public can view company settings" ON public.company_settings;

CREATE POLICY "Company members can view settings"
ON public.company_settings FOR SELECT
USING (
  public.is_company_member(company_id)
  OR public.is_super_admin()
);

-- ═══ FIX 5: command_audit_log — fix SELECT policy to use company lookup ═══
DROP POLICY IF EXISTS "Owner sees own command logs" ON public.command_audit_log;

CREATE POLICY "Owner sees own command logs"
ON public.command_audit_log FOR SELECT
USING (
  tenant_id::text = public.get_user_company(auth.uid())::text
  OR public.is_super_admin()
);
