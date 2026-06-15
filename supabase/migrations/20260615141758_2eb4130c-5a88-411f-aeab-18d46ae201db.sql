DROP POLICY IF EXISTS "owners read own custom previews" ON public.seller_custom_previews;
CREATE POLICY "owners read own custom previews"
ON public.seller_custom_previews
FOR SELECT
USING (owner_id = auth.uid() OR public.is_super_admin());