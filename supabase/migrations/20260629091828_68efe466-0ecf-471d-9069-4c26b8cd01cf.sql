
-- 1) Storage: remove broad business-assets INSERT policy; keep folder-scoped policy.
DROP POLICY IF EXISTS "Auth users upload business assets" ON storage.objects;

-- 2) companies: hide internal Stripe/partner identifiers from anon and authenticated.
REVOKE SELECT (stripe_setup_session_id, acquired_by_partner_id, acquired_by_sub_partner_id)
  ON public.companies FROM anon, authenticated;

-- 3) company_settings: remove blanket public read; expose only safe fields via RPC.
DROP POLICY IF EXISTS "Anyone can read company settings" ON public.company_settings;

CREATE OR REPLACE FUNCTION public.get_public_company_settings(p_company_id uuid)
RETURNS TABLE (
  whatsapp text,
  instagram_url text,
  facebook_url text,
  hours text,
  confirmation_message text,
  email_template text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT cs.whatsapp, cs.instagram_url, cs.facebook_url, cs.hours,
         cs.confirmation_message, cs.email_template
  FROM public.company_settings cs
  WHERE cs.company_id = p_company_id
  LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.get_public_company_settings(uuid) TO anon, authenticated;

-- 4) demo admin_password: stop exposing plaintext to client roles; only service_role keeps access.
REVOKE SELECT (admin_password) ON public.demo_sites FROM anon, authenticated;
REVOKE SELECT (admin_password) ON public.demo_factory_runs FROM anon, authenticated;
REVOKE SELECT (admin_password) ON public.seller_demo_vault FROM anon, authenticated;

-- 5) restaurants: hide Stripe identifiers, partner attribution, and moderation internals.
REVOKE SELECT (
  stripe_account_id,
  stripe_connect_account_id,
  stripe_setup_session_id,
  acquired_by_partner_id,
  acquired_by_sub_partner_id
) ON public.restaurants FROM anon, authenticated;

-- 6) sales_leaderboard: revenue/deal columns no longer readable cross-user.
REVOKE SELECT (revenue_month_eur, revenue_total_eur, deals_closed_month, deals_closed_total)
  ON public.sales_leaderboard FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_my_leaderboard_row()
RETURNS SETOF public.sales_leaderboard
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.sales_leaderboard
  WHERE user_id = auth.uid() OR public.is_super_admin();
$$;
GRANT EXECUTE ON FUNCTION public.get_my_leaderboard_row() TO authenticated;
