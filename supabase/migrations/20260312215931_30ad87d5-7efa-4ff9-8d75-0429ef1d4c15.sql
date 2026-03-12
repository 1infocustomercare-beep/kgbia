
-- Tables already exist, just need to handle the policy conflict
-- Drop and recreate policies safely
DO $$ BEGIN
  DROP POLICY IF EXISTS "Company members manage route prices" ON public.route_prices;
  DROP POLICY IF EXISTS "Public read route prices" ON public.route_prices;
  DROP POLICY IF EXISTS "Company members manage seasonal prices" ON public.seasonal_prices;
  DROP POLICY IF EXISTS "Public read seasonal prices" ON public.seasonal_prices;
  DROP POLICY IF EXISTS "Company members manage seo" ON public.seo_settings;
END $$;

CREATE POLICY "Company members manage route prices" ON public.route_prices FOR ALL TO public
  USING (EXISTS (SELECT 1 FROM ncc_routes r WHERE r.id = route_prices.route_id AND (r.company_id = get_user_company(auth.uid()) OR is_super_admin())));
CREATE POLICY "Public read route prices" ON public.route_prices FOR SELECT TO public USING (true);
CREATE POLICY "Company members manage seasonal prices" ON public.seasonal_prices FOR ALL TO public
  USING (EXISTS (SELECT 1 FROM ncc_routes r WHERE r.id = seasonal_prices.route_id AND (r.company_id = get_user_company(auth.uid()) OR is_super_admin())));
CREATE POLICY "Public read seasonal prices" ON public.seasonal_prices FOR SELECT TO public USING (true);
CREATE POLICY "Company members manage seo" ON public.seo_settings FOR ALL TO public
  USING (company_id = get_user_company(auth.uid()) OR is_super_admin());
