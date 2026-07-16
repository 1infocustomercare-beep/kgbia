DROP POLICY IF EXISTS "anyone reads leaderboard" ON public.sales_leaderboard;
CREATE POLICY "own leaderboard row or admin" ON public.sales_leaderboard
FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'::app_role));

DROP POLICY IF EXISTS "Anyone reads restaurant tables" ON public.restaurant_tables;
CREATE POLICY "Members read restaurant tables" ON public.restaurant_tables
FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = restaurant_tables.restaurant_id AND r.owner_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.restaurant_memberships m WHERE m.restaurant_id = restaurant_tables.restaurant_id AND m.user_id = auth.uid())
  OR public.has_role(auth.uid(), 'super_admin'::app_role)
);

DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE tablename='customer_blacklist' AND schemaname='public' AND cmd='SELECT' AND 'anon' = ANY(roles)
  LOOP
    EXECUTE format('DROP POLICY %I ON public.customer_blacklist', p.policyname);
  END LOOP;
END $$;

DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE tablename='media_vault' AND schemaname='public' AND cmd IN ('INSERT','UPDATE','DELETE')
  LOOP
    EXECUTE format('DROP POLICY %I ON public.media_vault', p.policyname);
  END LOOP;
END $$;
CREATE POLICY "Super admin writes media_vault" ON public.media_vault
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role));

DROP POLICY IF EXISTS "Authenticated can upload media-vault" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete media-vault" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update media-vault" ON storage.objects;
CREATE POLICY "Super admin uploads media-vault" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'media-vault' AND public.has_role(auth.uid(), 'super_admin'::app_role));
CREATE POLICY "Super admin updates media-vault" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'media-vault' AND public.has_role(auth.uid(), 'super_admin'::app_role));
CREATE POLICY "Super admin deletes media-vault" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'media-vault' AND public.has_role(auth.uid(), 'super_admin'::app_role));