-- 1) gdpr_consents: add scoped update/delete path (GDPR rectification/erasure)
CREATE POLICY "Restaurant owners and admins update consents"
ON public.gdpr_consents FOR UPDATE
TO authenticated
USING (public.is_super_admin() OR public.is_restaurant_owner(restaurant_id) OR public.is_restaurant_member(restaurant_id))
WITH CHECK (public.is_super_admin() OR public.is_restaurant_owner(restaurant_id) OR public.is_restaurant_member(restaurant_id));

CREATE POLICY "Restaurant owners and admins delete consents"
ON public.gdpr_consents FOR DELETE
TO authenticated
USING (public.is_super_admin() OR public.is_restaurant_owner(restaurant_id) OR public.is_restaurant_member(restaurant_id));

GRANT UPDATE, DELETE ON public.gdpr_consents TO authenticated;
GRANT ALL ON public.gdpr_consents TO service_role;

-- 2) restaurants: hide payment identifiers from client roles (column-level security)
REVOKE SELECT (stripe_account_id, stripe_connect_account_id, stripe_setup_session_id)
  ON public.restaurants FROM anon, authenticated;
REVOKE UPDATE (stripe_account_id, stripe_connect_account_id, stripe_setup_session_id)
  ON public.restaurants FROM anon, authenticated;
GRANT ALL ON public.restaurants TO service_role;

-- 3) reviews: hide customer linkage from anonymous visitors
REVOKE SELECT (customer_id) ON public.reviews FROM anon;
GRANT ALL ON public.reviews TO service_role;