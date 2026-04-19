-- 1. Trigger crediti: super_admin NON riceve più crediti automatici (solo partner/team_leader)
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
  RETURN NEW;
END;
$function$;

-- 2. Hard guard: nessuno può diventare super_admin tranne l'owner ufficiale
CREATE OR REPLACE FUNCTION public.prevent_unauthorized_super_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_owner_id constant uuid := '1da0ee45-094a-4728-996e-6143d55a7f9d';
BEGIN
  IF NEW.role = 'super_admin' AND NEW.user_id <> v_owner_id THEN
    RAISE EXCEPTION 'Solo l''owner ufficiale della piattaforma può avere il ruolo super_admin.';
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_prevent_unauthorized_super_admin ON public.user_roles;
CREATE TRIGGER trg_prevent_unauthorized_super_admin
BEFORE INSERT OR UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_unauthorized_super_admin();