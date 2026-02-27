
-- Function to create a demo restaurant for a partner/team_leader
CREATE OR REPLACE FUNCTION public.create_partner_demo_restaurant()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_restaurant_id uuid;
  v_slug text;
  v_user_email text;
  v_user_name text;
BEGIN
  -- Only trigger for partner or team_leader roles
  IF NEW.role NOT IN ('partner', 'team_leader') THEN
    RETURN NEW;
  END IF;

  -- Check if partner already has a demo restaurant
  IF EXISTS (
    SELECT 1 FROM public.restaurants
    WHERE owner_id = NEW.user_id AND slug LIKE 'demo-partner-%'
  ) THEN
    RETURN NEW;
  END IF;

  -- Get user info
  SELECT email INTO v_user_email FROM auth.users WHERE id = NEW.user_id;
  SELECT full_name INTO v_user_name FROM public.profiles WHERE user_id = NEW.user_id;

  -- Generate unique slug
  v_slug := 'demo-partner-' || substr(NEW.user_id::text, 1, 8);
  v_restaurant_id := gen_random_uuid();

  -- Create the demo restaurant
  INSERT INTO public.restaurants (id, name, slug, owner_id, tagline, primary_color, phone, address, city, email, is_active, policy_accepted, policy_accepted_at, setup_paid)
  VALUES (
    v_restaurant_id,
    'Empire Demo — ' || COALESCE(v_user_name, split_part(v_user_email, '@', 1)),
    v_slug,
    NEW.user_id,
    'Ristorante Demo per Presentazioni',
    '#C8963E',
    '+39 06 1234 5678',
    'Via della Demo 1',
    'Roma',
    v_user_email,
    true,
    true,
    now(),
    true
  );

  -- Seed menu items (6 categories with multiple items)
  INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_active, is_popular, sort_order, image_url) VALUES
    (v_restaurant_id, 'Bruschetta Classica', 'Pomodorini freschi, basilico e olio EVO su pane toscano', 8, 'Antipasti', true, true, 1, null),
    (v_restaurant_id, 'Tagliere Misto', 'Selezione di salumi e formaggi stagionati', 16, 'Antipasti', true, false, 2, null),
    (v_restaurant_id, 'Carpaccio di Manzo', 'Con rucola, parmigiano e limone', 14, 'Antipasti', true, false, 3, null),
    (v_restaurant_id, 'Spaghetti Carbonara', 'Guanciale croccante, pecorino romano, tuorlo d''uovo', 14, 'Primi', true, true, 4, null),
    (v_restaurant_id, 'Risotto ai Funghi Porcini', 'Riso Carnaroli mantecato con porcini freschi', 16, 'Primi', true, false, 5, null),
    (v_restaurant_id, 'Paccheri all''Amatriciana', 'Sugo di pomodoro San Marzano, guanciale, pecorino', 13, 'Primi', true, false, 6, null),
    (v_restaurant_id, 'Pizza Margherita', 'Mozzarella di bufala, pomodoro, basilico fresco', 12, 'Pizze', true, true, 7, null),
    (v_restaurant_id, 'Pizza Diavola', 'Salamino piccante, mozzarella, peperoncino', 14, 'Pizze', true, false, 8, null),
    (v_restaurant_id, 'Pizza Quattro Formaggi', 'Mozzarella, gorgonzola, fontina, parmigiano', 15, 'Pizze', true, false, 9, null),
    (v_restaurant_id, 'Tagliata di Manzo', 'Controfiletto alla griglia con rucola e grana', 22, 'Secondi', true, false, 10, null),
    (v_restaurant_id, 'Branzino al Forno', 'Con patate, olive taggiasche e capperi', 20, 'Secondi', true, false, 11, null),
    (v_restaurant_id, 'Tiramisù', 'Mascarpone, savoiardi, caffè espresso, cacao', 7, 'Dolci', true, true, 12, null),
    (v_restaurant_id, 'Panna Cotta', 'Con coulis di frutti di bosco', 6, 'Dolci', true, false, 13, null),
    (v_restaurant_id, 'Espresso', 'Caffè 100% arabica', 2, 'Bevande', true, false, 14, null),
    (v_restaurant_id, 'Prosecco Valdobbiadene', 'Calice di bollicine venete', 6, 'Bevande', true, false, 15, null),
    (v_restaurant_id, 'Acqua Minerale', 'Naturale o frizzante 75cl', 3, 'Bevande', true, false, 16, null);

  -- Seed tables (8 tables)
  INSERT INTO public.restaurant_tables (restaurant_id, table_number, seats, status, label, pos_x, pos_y) VALUES
    (v_restaurant_id, 1, 2, 'free', 'Tavolo 1', 10, 10),
    (v_restaurant_id, 2, 4, 'free', 'Tavolo 2', 30, 10),
    (v_restaurant_id, 3, 4, 'occupied', 'Tavolo 3', 50, 10),
    (v_restaurant_id, 4, 6, 'free', 'Tavolo 4', 70, 10),
    (v_restaurant_id, 5, 2, 'occupied', 'Tavolo 5', 10, 50),
    (v_restaurant_id, 6, 4, 'free', 'Tavolo 6', 30, 50),
    (v_restaurant_id, 7, 8, 'free', 'Tavolo 7', 50, 50),
    (v_restaurant_id, 8, 4, 'free', 'Tavolo 8', 70, 50);

  -- Seed sample orders
  INSERT INTO public.orders (restaurant_id, customer_name, customer_phone, order_type, table_number, status, total, items, notes) VALUES
    (v_restaurant_id, 'Marco Rossi', '+39 333 1234567', 'table', 3, 'preparing', 36, '[{"name":"Carbonara","qty":2,"price":14},{"name":"Bruschetta","qty":1,"price":8}]'::jsonb, 'Senza pepe'),
    (v_restaurant_id, 'Laura Bianchi', '+39 334 9876543', 'delivery', null, 'pending', 38, '[{"name":"Pizza Margherita","qty":2,"price":12},{"name":"Tiramisù","qty":2,"price":7}]'::jsonb, null),
    (v_restaurant_id, 'Giovanni Paoli', '+39 335 5551234', 'takeaway', null, 'ready', 38, '[{"name":"Risotto ai Funghi","qty":1,"price":16},{"name":"Tagliata","qty":1,"price":22}]'::jsonb, 'Extra limone');

  -- Seed kitchen access PIN
  INSERT INTO public.kitchen_access_pins (restaurant_id, pin_code, label, is_active) VALUES
    (v_restaurant_id, '1234', 'Cucina Demo', true);

  -- Seed sample reviews
  INSERT INTO public.reviews (restaurant_id, rating, customer_name, comment, is_public) VALUES
    (v_restaurant_id, 5, 'Marco R.', 'Ottima esperienza! Carbonara perfetta.', true),
    (v_restaurant_id, 5, 'Sara T.', 'Servizio impeccabile, tornerò sicuramente.', true),
    (v_restaurant_id, 4, 'Paolo V.', 'Buona pizza, ambiente accogliente.', true),
    (v_restaurant_id, 2, 'Anna L.', 'Attesa troppo lunga.', false);

  -- Seed sample reservations
  INSERT INTO public.reservations (restaurant_id, customer_name, customer_phone, reservation_date, reservation_time, guests, status) VALUES
    (v_restaurant_id, 'Marco Rossi', '+39 333 1234567', CURRENT_DATE, '20:30', 4, 'pending'),
    (v_restaurant_id, 'Laura Bianchi', '+39 334 9876543', CURRENT_DATE + 1, '21:00', 2, 'pending'),
    (v_restaurant_id, 'Giovanni Paoli', '+39 335 5551234', CURRENT_DATE + 2, '20:00', 6, 'confirmed');

  RETURN NEW;
END;
$$;

-- Create trigger on user_roles
CREATE TRIGGER on_partner_role_create_demo
  AFTER INSERT ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_partner_demo_restaurant();
