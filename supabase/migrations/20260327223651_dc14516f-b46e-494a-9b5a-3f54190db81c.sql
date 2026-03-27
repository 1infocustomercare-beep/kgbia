
CREATE OR REPLACE FUNCTION public.handle_new_restaurant()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Core structural setup (no demo data)
  INSERT INTO public.ai_tokens (restaurant_id, balance) VALUES (NEW.id, 5);
  INSERT INTO public.fisco_configs (restaurant_id) VALUES (NEW.id);
  INSERT INTO public.restaurant_memberships (restaurant_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'restaurant_admin');

  -- Kitchen access PIN
  INSERT INTO public.kitchen_access_pins (restaurant_id, pin_code, label, is_active) VALUES
    (NEW.id, '1234', 'Cucina Principale', true);

  RETURN NEW;
END;
$function$;
