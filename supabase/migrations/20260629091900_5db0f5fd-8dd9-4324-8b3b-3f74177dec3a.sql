
-- Restore authenticated SELECT on columns owners/admins legitimately read.
GRANT SELECT (stripe_setup_session_id, acquired_by_partner_id, acquired_by_sub_partner_id)
  ON public.companies TO authenticated;

GRANT SELECT (
  stripe_account_id,
  stripe_connect_account_id,
  stripe_setup_session_id,
  acquired_by_partner_id,
  acquired_by_sub_partner_id
) ON public.restaurants TO authenticated;

-- demo admin_password stays revoked from both anon and authenticated (only service_role reads it).
-- sales_leaderboard revenue columns stay revoked from anon and authenticated; owners read own row via RPC.
