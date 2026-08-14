DROP POLICY IF EXISTS "Public read public ncc reviews" ON public.ncc_reviews;

CREATE OR REPLACE FUNCTION public.get_public_ncc_reviews(p_company_id uuid, p_limit integer DEFAULT 10)
RETURNS TABLE(id uuid, rating integer, comment text, admin_reply text, created_at timestamptz, display_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.id,
         r.rating,
         r.comment,
         r.admin_reply,
         r.created_at,
         CASE
           WHEN r.customer_name IS NULL OR btrim(r.customer_name) = '' THEN 'Cliente'
           ELSE split_part(btrim(r.customer_name), ' ', 1)
                || CASE
                     WHEN split_part(btrim(r.customer_name), ' ', 2) <> ''
                       THEN ' ' || upper(left(split_part(btrim(r.customer_name), ' ', 2), 1)) || '.'
                     ELSE ''
                   END
         END AS display_name
  FROM public.ncc_reviews r
  WHERE r.company_id = p_company_id
    AND r.is_public = true
  ORDER BY r.created_at DESC
  LIMIT LEAST(GREATEST(COALESCE(p_limit, 10), 1), 50);
$$;

GRANT EXECUTE ON FUNCTION public.get_public_ncc_reviews(uuid, integer) TO anon, authenticated;

DROP POLICY IF EXISTS "Members read restaurant tables" ON public.restaurant_tables;

CREATE POLICY "Members read restaurant tables"
ON public.restaurant_tables
FOR SELECT
TO authenticated
USING (
  public.is_restaurant_owner(restaurant_id)
  OR public.is_restaurant_member(restaurant_id)
  OR public.is_super_admin()
);

DROP POLICY IF EXISTS "Public can view suite by slug" ON public.seller_mockup_suites;

CREATE OR REPLACE FUNCTION public.get_public_mockup_suite(p_slug text)
RETURNS TABLE(
  id uuid,
  business_name text,
  business_sector text,
  business_city text,
  template_variant text,
  primary_color text,
  screens jsonb,
  view_count integer
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_slug IS NULL OR length(p_slug) < 12 THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT s.id, s.business_name, s.business_sector, s.business_city,
         s.template_variant, s.primary_color, s.screens, s.view_count
  FROM public.seller_mockup_suites s
  WHERE s.share_slug = p_slug
    AND s.status = 'complete';
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_mockup_suite(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.increment_mockup_suite_view(p_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_slug IS NULL OR length(p_slug) < 12 THEN
    RETURN;
  END IF;
  UPDATE public.seller_mockup_suites
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE share_slug = p_slug AND status = 'complete';
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_mockup_suite_view(text) TO anon, authenticated;