
-- Partner Teams: links partners to their team leader
CREATE TABLE public.partner_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_leader_id uuid NOT NULL,
  partner_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(partner_id)
);

ALTER TABLE public.partner_teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own team data"
  ON public.partner_teams FOR SELECT
  USING (auth.uid() = team_leader_id OR auth.uid() = partner_id);

CREATE POLICY "Super admins manage teams"
  ON public.partner_teams FOR ALL
  USING (public.is_super_admin());

CREATE POLICY "Team leaders can add members"
  ON public.partner_teams FOR INSERT
  WITH CHECK (auth.uid() = team_leader_id AND public.has_role(auth.uid(), 'team_leader'));

-- Partner Sales: tracks individual sales for bonus calculation
CREATE TABLE public.partner_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL,
  restaurant_payment_id uuid REFERENCES public.restaurant_payments(id),
  sale_amount numeric NOT NULL DEFAULT 1997,
  partner_commission numeric NOT NULL DEFAULT 997,
  team_leader_id uuid,
  team_leader_override numeric NOT NULL DEFAULT 0,
  bonus_amount numeric NOT NULL DEFAULT 0,
  bonus_type text,
  sale_month text NOT NULL DEFAULT to_char(now(), 'YYYY-MM'),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners read own sales"
  ON public.partner_sales FOR SELECT
  USING (auth.uid() = partner_id OR auth.uid() = team_leader_id);

CREATE POLICY "Super admins manage sales"
  ON public.partner_sales FOR ALL
  USING (public.is_super_admin());

-- Performance Bonuses table
CREATE TABLE public.performance_bonuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL,
  bonus_month text NOT NULL,
  sales_count integer NOT NULL DEFAULT 0,
  bonus_amount numeric NOT NULL DEFAULT 0,
  bonus_tier text NOT NULL DEFAULT 'none',
  paid boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(partner_id, bonus_month)
);

ALTER TABLE public.performance_bonuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners read own bonuses"
  ON public.performance_bonuses FOR SELECT
  USING (auth.uid() = partner_id);

CREATE POLICY "Super admins manage bonuses"
  ON public.performance_bonuses FOR ALL
  USING (public.is_super_admin());

-- Function: auto-promote partner to team_leader after 3 sales
CREATE OR REPLACE FUNCTION public.check_team_leader_promotion(p_partner_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_sales integer;
BEGIN
  SELECT COUNT(*) INTO total_sales
  FROM public.partner_sales
  WHERE partner_id = p_partner_id;
  
  IF total_sales >= 3 AND NOT public.has_role(p_partner_id, 'team_leader') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (p_partner_id, 'team_leader')
    ON CONFLICT (user_id, role) DO NOTHING;
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Function: calculate monthly performance bonuses
CREATE OR REPLACE FUNCTION public.calculate_monthly_bonus(p_partner_id uuid, p_month text)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  monthly_sales integer;
  bonus numeric := 0;
  tier text := 'none';
BEGIN
  SELECT COUNT(*) INTO monthly_sales
  FROM public.partner_sales
  WHERE partner_id = p_partner_id AND sale_month = p_month;
  
  IF monthly_sales >= 5 THEN
    bonus := 1500;
    tier := 'elite';
  ELSIF monthly_sales >= 3 THEN
    bonus := 500;
    tier := 'pro';
  END IF;
  
  IF bonus > 0 THEN
    INSERT INTO public.performance_bonuses (partner_id, bonus_month, sales_count, bonus_amount, bonus_tier)
    VALUES (p_partner_id, p_month, monthly_sales, bonus, tier)
    ON CONFLICT (partner_id, bonus_month) 
    DO UPDATE SET sales_count = monthly_sales, bonus_amount = bonus, bonus_tier = tier;
  END IF;
  
  RETURN bonus;
END;
$$;
