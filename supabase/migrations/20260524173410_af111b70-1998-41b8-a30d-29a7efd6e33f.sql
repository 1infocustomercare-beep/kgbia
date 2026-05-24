
-- 1. get_user_company: deterministic ordering
CREATE OR REPLACE FUNCTION public.get_user_company(p_user_id uuid)
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT company_id FROM public.company_memberships
  WHERE user_id = p_user_id
  ORDER BY created_at ASC, company_id ASC
  LIMIT 1;
$function$;

-- 2. fisco_configs: scope staff access to tenant membership
DROP POLICY IF EXISTS "Staff and super admin manage fisco" ON public.fisco_configs;
CREATE POLICY "Staff and super admin manage fisco"
ON public.fisco_configs FOR ALL
USING (
  is_super_admin()
  OR is_restaurant_owner(restaurant_id)
  OR is_restaurant_member(restaurant_id)
)
WITH CHECK (
  is_super_admin()
  OR is_restaurant_owner(restaurant_id)
  OR is_restaurant_member(restaurant_id)
);

-- 3. Column-level grants: restrict what anon can read on sensitive tables.
-- Authenticated role retains full SELECT (governed by existing RLS policies).

-- restaurants: anon may only see display-safe columns
REVOKE SELECT ON public.restaurants FROM anon;
GRANT SELECT (
  id, name, slug, logo_url, primary_color, tagline, address, city,
  is_active, opening_hours, languages, min_order_amount,
  delivery_enabled, takeaway_enabled, table_orders_enabled,
  business_type, theme_config, menu_pdf_url, created_at, updated_at
) ON public.restaurants TO anon;

-- companies: anon may only see display-safe columns
REVOKE SELECT ON public.companies FROM anon;
GRANT SELECT (
  id, name, slug, industry, logo_url, primary_color, secondary_color,
  tagline, address, city, is_active, modules_enabled, font_family,
  modules_config, opening_hours, social_links, theme_config,
  created_at, updated_at
) ON public.companies TO anon;

-- company_settings: anon only sees non-sensitive public display fields
REVOKE SELECT ON public.company_settings FROM anon;
GRANT SELECT (
  id, company_id, facebook_url, instagram_url, hours,
  bookings_enabled, currency, created_at, updated_at
) ON public.company_settings TO anon;

-- demo_sites: anon can read public listing but not credentials
REVOKE SELECT ON public.demo_sites FROM anon;
GRANT SELECT (
  id, owner_id, lead_id, blueprint_id, template_variant,
  business_name, sector, sub_sector, public_slug, status,
  branding_snapshot, agents_activated, modules_enabled,
  preview_url, ab_test_group, view_count, generated_at,
  archived_at, created_at, updated_at
) ON public.demo_sites TO anon;

-- seller_custom_previews: anon (public-by-slug) cannot read lead contact data
REVOKE SELECT ON public.seller_custom_previews FROM anon;
GRANT SELECT (
  id, owner_id, sector_slug, sector_label, template_style,
  primary_color, hero_title, hero_subtitle, features,
  preview_html, preview_url, is_published, reuse_count,
  logo_url, hero_image_url, gallery_images, ai_generated_content,
  generation_status, generated_at, view_count, last_viewed_at,
  public_slug, mockup_screens, mockup_engine, mockup_generated_at,
  lead_name, lead_city, lead_website, lead_rating, lead_reviews_count,
  created_at, updated_at
) ON public.seller_custom_previews TO anon;
