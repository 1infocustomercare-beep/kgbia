
-- 1. Traffic control columns on restaurants
ALTER TABLE public.restaurants 
  ADD COLUMN IF NOT EXISTS delivery_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS takeaway_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS table_orders_enabled boolean NOT NULL DEFAULT true;

-- 2. Translation columns on menu_items
ALTER TABLE public.menu_items 
  ADD COLUMN IF NOT EXISTS name_translations jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS description_translations jsonb DEFAULT '{}'::jsonb;

-- 3. Customer blacklist table
CREATE TABLE IF NOT EXISTS public.customer_blacklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  customer_phone text NOT NULL,
  customer_name text,
  reason text,
  blocked_by uuid,
  is_active boolean NOT NULL DEFAULT true,
  blocked_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(restaurant_id, customer_phone)
);

ALTER TABLE public.customer_blacklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage blacklist"
  ON public.customer_blacklist FOR ALL
  USING (is_restaurant_owner(restaurant_id) OR is_super_admin());

CREATE POLICY "Public check blacklist"
  ON public.customer_blacklist FOR SELECT
  USING (is_active = true);

-- 4. Reservations table
CREATE TABLE IF NOT EXISTS public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  guests integer NOT NULL DEFAULT 2,
  reservation_date date NOT NULL,
  reservation_time text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create reservations"
  ON public.reservations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Restaurant sees own reservations"
  ON public.reservations FOR SELECT
  USING (is_restaurant_owner(restaurant_id) OR is_super_admin() OR is_restaurant_member(restaurant_id));

CREATE POLICY "Restaurant manages reservations"
  ON public.reservations FOR UPDATE
  USING (is_restaurant_owner(restaurant_id) OR is_super_admin());

CREATE POLICY "Restaurant deletes reservations"
  ON public.reservations FOR DELETE
  USING (is_restaurant_owner(restaurant_id) OR is_super_admin());

-- Enable realtime for reservations
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_blacklist;
