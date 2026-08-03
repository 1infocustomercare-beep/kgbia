-- restaurants: replace authenticated table-wide SELECT with column-level SELECT excluding payment identifiers
REVOKE SELECT ON public.restaurants FROM authenticated;
GRANT SELECT (
  id, owner_id, name, slug, logo_url, primary_color, tagline, address, phone, city,
  is_active, setup_paid, created_at, updated_at, email, opening_hours, languages,
  min_order_amount, blocked_keywords, policy_accepted, policy_accepted_at,
  delivery_enabled, takeaway_enabled, table_orders_enabled, is_blocked, blocked_reason,
  stripe_onboarding_complete, business_type, theme_config, selected_plan,
  selected_installments, setup_paid_at, menu_pdf_url,
  acquired_by_partner_id, acquired_by_sub_partner_id
) ON public.restaurants TO authenticated;

-- reviews: anonymous visitors get column-level SELECT without customer_id
REVOKE SELECT ON public.reviews FROM anon;
GRANT SELECT (id, restaurant_id, customer_name, rating, comment, is_public, created_at)
  ON public.reviews TO anon;