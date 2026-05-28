
-- 1) Track which partner brought each business client
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS acquired_by_partner_id uuid;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS acquired_by_sub_partner_id uuid;
ALTER TABLE public.companies   ADD COLUMN IF NOT EXISTS acquired_by_partner_id uuid;
ALTER TABLE public.companies   ADD COLUMN IF NOT EXISTS acquired_by_sub_partner_id uuid;

CREATE INDEX IF NOT EXISTS idx_restaurants_acquired_partner ON public.restaurants(acquired_by_partner_id);
CREATE INDEX IF NOT EXISTS idx_companies_acquired_partner   ON public.companies(acquired_by_partner_id);

-- 2) Sub-partner invitations (a team_leader invites a partner under them)
CREATE TABLE IF NOT EXISTS public.sub_partner_invites (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_leader_id  uuid NOT NULL,
  email           text NOT NULL,
  token           text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  commission_pct  numeric NOT NULL DEFAULT 50,
  status          text NOT NULL DEFAULT 'pending', -- pending | accepted | revoked | expired
  accepted_by     uuid,
  accepted_at     timestamptz,
  expires_at      timestamptz NOT NULL DEFAULT (now() + interval '14 days'),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.sub_partner_invites TO authenticated;
GRANT ALL ON public.sub_partner_invites TO service_role;

ALTER TABLE public.sub_partner_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_leader manages own invites"
ON public.sub_partner_invites
FOR ALL TO authenticated
USING (team_leader_id = auth.uid() OR public.is_super_admin())
WITH CHECK (team_leader_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "invitee can read by token via rpc"
ON public.sub_partner_invites
FOR SELECT TO anon
USING (false); -- only RPC can read

CREATE TRIGGER trg_sub_partner_invites_touch
BEFORE UPDATE ON public.sub_partner_invites
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 3) RPC: create invite (team_leader only)
CREATE OR REPLACE FUNCTION public.create_sub_partner_invite(
  p_email text,
  p_commission_pct numeric DEFAULT 50
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user uuid := auth.uid();
  v_id uuid; v_token text;
BEGIN
  IF v_user IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'unauthorized'); END IF;

  IF NOT (public.has_role(v_user, 'team_leader') OR public.is_super_admin()) THEN
    RETURN jsonb_build_object('success', false, 'error', 'only_team_leader');
  END IF;

  IF p_email IS NULL OR p_email !~ '^[^@]+@[^@]+\.[^@]+$' THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_email');
  END IF;

  IF p_commission_pct < 0 OR p_commission_pct > 100 THEN
    p_commission_pct := 50;
  END IF;

  INSERT INTO public.sub_partner_invites (team_leader_id, email, commission_pct)
  VALUES (v_user, lower(trim(p_email)), p_commission_pct)
  RETURNING id, token INTO v_id, v_token;

  RETURN jsonb_build_object('success', true, 'id', v_id, 'token', v_token);
END $$;

-- 4) RPC: accept invite (authenticated invitee)
CREATE OR REPLACE FUNCTION public.accept_sub_partner_invite(p_token text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user uuid := auth.uid();
  v_inv RECORD;
BEGIN
  IF v_user IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'unauthorized'); END IF;

  SELECT * INTO v_inv FROM public.sub_partner_invites
   WHERE token = p_token AND status = 'pending' AND expires_at > now()
   FOR UPDATE;

  IF v_inv.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_or_expired');
  END IF;

  -- Assign partner role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user, 'partner')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Link under team_leader
  INSERT INTO public.partner_teams (team_leader_id, partner_id)
  VALUES (v_inv.team_leader_id, v_user)
  ON CONFLICT DO NOTHING;

  UPDATE public.sub_partner_invites
     SET status = 'accepted', accepted_by = v_user, accepted_at = now()
   WHERE id = v_inv.id;

  RETURN jsonb_build_object('success', true, 'team_leader_id', v_inv.team_leader_id, 'commission_pct', v_inv.commission_pct);
END $$;

-- 5) RPC: super-admin network overview
CREATE OR REPLACE FUNCTION public.super_admin_network_overview()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE result jsonb;
BEGIN
  IF NOT public.is_super_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'forbidden');
  END IF;

  SELECT jsonb_build_object(
    'success', true,
    'team_leaders', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'user_id', ur.user_id,
        'email',   au.email,
        'full_name', p.full_name,
        'created_at', ur.created_at,
        'sub_partners_count', (SELECT count(*) FROM public.partner_teams pt WHERE pt.team_leader_id = ur.user_id),
        'sales_count', (SELECT count(*) FROM public.partner_sales ps WHERE ps.partner_id = ur.user_id OR ps.team_leader_id = ur.user_id)
      )), '[]'::jsonb)
      FROM public.user_roles ur
      LEFT JOIN auth.users au ON au.id = ur.user_id
      LEFT JOIN public.profiles p ON p.user_id = ur.user_id
      WHERE ur.role = 'team_leader'
    ),
    'partners', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'user_id', ur.user_id,
        'email', au.email,
        'full_name', p.full_name,
        'team_leader_id', (SELECT pt.team_leader_id FROM public.partner_teams pt WHERE pt.partner_id = ur.user_id LIMIT 1),
        'sales_count', (SELECT count(*) FROM public.partner_sales ps WHERE ps.partner_id = ur.user_id)
      )), '[]'::jsonb)
      FROM public.user_roles ur
      LEFT JOIN auth.users au ON au.id = ur.user_id
      LEFT JOIN public.profiles p ON p.user_id = ur.user_id
      WHERE ur.role = 'partner'
        AND NOT EXISTS (SELECT 1 FROM public.user_roles ur2 WHERE ur2.user_id = ur.user_id AND ur2.role = 'team_leader')
    ),
    'clients', (
      SELECT COALESCE(jsonb_agg(c), '[]'::jsonb) FROM (
        SELECT id, name, slug, 'food' AS sector, owner_id, acquired_by_partner_id, acquired_by_sub_partner_id, setup_paid, created_at
          FROM public.restaurants
        UNION ALL
        SELECT id, name, slug, COALESCE(sector,'other') AS sector, owner_id, acquired_by_partner_id, acquired_by_sub_partner_id, setup_paid, created_at
          FROM public.companies
      ) c
    ),
    'totals', jsonb_build_object(
      'team_leaders', (SELECT count(*) FROM public.user_roles WHERE role='team_leader'),
      'partners',     (SELECT count(*) FROM public.user_roles WHERE role='partner'),
      'restaurants',  (SELECT count(*) FROM public.restaurants),
      'companies',    (SELECT count(*) FROM public.companies),
      'paid_setups',  (SELECT count(*) FROM public.restaurants WHERE setup_paid)
                    + (SELECT count(*) FROM public.companies   WHERE setup_paid)
    )
  ) INTO result;
  RETURN result;
END $$;

-- 6) RPC: team-leader view of their sub-partners
CREATE OR REPLACE FUNCTION public.list_my_sub_partners()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_user uuid := auth.uid();
BEGIN
  IF v_user IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'unauthorized'); END IF;

  RETURN jsonb_build_object(
    'success', true,
    'sub_partners', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'user_id', pt.partner_id,
        'email', au.email,
        'full_name', p.full_name,
        'joined_at', pt.created_at,
        'sales_count', (SELECT count(*) FROM public.partner_sales ps WHERE ps.partner_id = pt.partner_id)
      )), '[]'::jsonb)
      FROM public.partner_teams pt
      LEFT JOIN auth.users au ON au.id = pt.partner_id
      LEFT JOIN public.profiles p ON p.user_id = pt.partner_id
      WHERE pt.team_leader_id = v_user
    ),
    'invites', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', id, 'email', email, 'status', status,
        'commission_pct', commission_pct, 'token', token,
        'created_at', created_at, 'expires_at', expires_at, 'accepted_at', accepted_at
      ) ORDER BY created_at DESC), '[]'::jsonb)
      FROM public.sub_partner_invites
      WHERE team_leader_id = v_user
    )
  );
END $$;

GRANT EXECUTE ON FUNCTION public.create_sub_partner_invite(text, numeric) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_sub_partner_invite(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.super_admin_network_overview() TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_my_sub_partners() TO authenticated;
