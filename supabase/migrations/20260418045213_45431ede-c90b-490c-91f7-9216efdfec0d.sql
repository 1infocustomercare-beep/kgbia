CREATE OR REPLACE FUNCTION public.grant_partner_demo_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.role IN ('partner', 'team_leader') THEN
    INSERT INTO public.partner_demo_credits (user_id, balance)
    VALUES (NEW.user_id, 50)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  IF NEW.role = 'super_admin' THEN
    INSERT INTO public.partner_demo_credits (user_id, balance)
    VALUES (NEW.user_id, 9999)
    ON CONFLICT (user_id) DO UPDATE SET balance = 9999, updated_at = now();
  END IF;
  RETURN NEW;
END;
$function$;