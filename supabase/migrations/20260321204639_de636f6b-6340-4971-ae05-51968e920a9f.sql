-- Fix: Don't auto-assign restaurant_admin to ALL users
-- Only assign it when the user doesn't have a signup_role of 'partner'
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_signup_role text;
BEGIN
  -- Check if user signed up as partner — don't assign restaurant_admin
  v_signup_role := NEW.raw_user_meta_data->>'signup_role';
  
  IF v_signup_role = 'partner' THEN
    -- Partners get their role from assign-partner-role edge function
    RETURN NEW;
  END IF;

  -- For customers and general users, assign restaurant_admin by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'restaurant_admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$function$;