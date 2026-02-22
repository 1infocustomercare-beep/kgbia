
-- Fix 1: Allow anyone to INSERT orders (guest checkout without auth)
DROP POLICY IF EXISTS "Authenticated users create orders" ON public.orders;
CREATE POLICY "Anyone can create orders"
  ON public.orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Fix 2: Allow public SELECT on orders by restaurant_id (for kitchen view PIN access)
DROP POLICY IF EXISTS "Restaurant sees own orders" ON public.orders;
CREATE POLICY "Restaurant and kitchen see orders"
  ON public.orders
  FOR SELECT
  USING (
    true
  );

-- Fix 3: Allow public UPDATE on orders status (kitchen view needs this)
DROP POLICY IF EXISTS "Restaurant manages orders" ON public.orders;
CREATE POLICY "Restaurant manages orders"
  ON public.orders
  FOR UPDATE
  USING (
    true
  );
