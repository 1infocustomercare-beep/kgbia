-- companies
REVOKE SELECT ON public.companies FROM anon;
GRANT SELECT (
  id, name, slug, industry, logo_url, primary_color, secondary_color,
  tagline, address, city, subscription_plan, modules_enabled, is_active,
  font_family, modules_config, opening_hours, social_links, theme_config,
  created_at, updated_at
) ON public.companies TO anon;

-- company_settings
REVOKE SELECT ON public.company_settings FROM anon;
GRANT SELECT (
  id, company_id, facebook_url, instagram_url, confirmation_message,
  bookings_enabled, require_deposit, deposit_percentage, currency,
  created_at, updated_at
) ON public.company_settings TO anon;

-- restaurants
REVOKE SELECT ON public.restaurants FROM anon;
GRANT SELECT (
  id, name, slug, logo_url, primary_color, tagline, address, city,
  is_active, created_at, updated_at, opening_hours, languages,
  min_order_amount, blocked_keywords, delivery_enabled, takeaway_enabled,
  table_orders_enabled, business_type, theme_config, menu_pdf_url
) ON public.restaurants TO anon;

-- demo_sites
REVOKE SELECT ON public.demo_sites FROM anon;
GRANT SELECT (
  id, blueprint_id, template_variant, business_name, sector, sub_sector,
  public_slug, status, branding_snapshot, scraped_data, agents_activated,
  modules_enabled, preview_url, view_count, cta_click_count,
  ab_test_group, generated_at, last_viewed_at, archived_at,
  created_at, updated_at
) ON public.demo_sites TO anon;

-- seller_custom_previews
REVOKE SELECT ON public.seller_custom_previews FROM anon;
GRANT SELECT (
  id, sector_slug, sector_label, template_style, primary_color,
  hero_title, hero_subtitle, features, preview_html, preview_url,
  is_published, reuse_count, created_at, updated_at,
  lead_name, lead_city, lead_website, lead_rating, lead_reviews_count,
  logo_url, hero_image_url, gallery_images, ai_generated_content,
  generation_status, view_count, last_viewed_at, public_slug,
  portfolio_label, mockup_screens, mockup_engine, mockup_generated_at
) ON public.seller_custom_previews TO anon;