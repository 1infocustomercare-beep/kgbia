
-- ============================================================
-- FIX 1: orders — Remove public SELECT/UPDATE, add authenticated policies
-- ============================================================

-- Drop existing insecure policies
DROP POLICY IF EXISTS "Restaurant and kitchen see orders" ON public.orders;
DROP POLICY IF EXISTS "Restaurant manages orders" ON public.orders;

-- Authenticated restaurant members can SELECT orders
CREATE POLICY "Authenticated members see orders"
ON public.orders FOR SELECT TO authenticated
USING (
  public.is_restaurant_member(restaurant_id)
  OR public.is_restaurant_owner(restaurant_id)
  OR public.is_super_admin()
);

-- Authenticated restaurant members can UPDATE orders
CREATE POLICY "Authenticated members update orders"
ON public.orders FOR UPDATE TO authenticated
USING (
  public.is_restaurant_member(restaurant_id)
  OR public.is_restaurant_owner(restaurant_id)
  OR public.is_super_admin()
)
WITH CHECK (
  public.is_restaurant_member(restaurant_id)
  OR public.is_restaurant_owner(restaurant_id)
  OR public.is_super_admin()
);

-- Keep public INSERT for customers placing orders (ensure existing policy or create)
DROP POLICY IF EXISTS "Customers can create orders" ON public.orders;
CREATE POLICY "Customers can create orders"
ON public.orders FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- ============================================================
-- FIX 2: kitchen_access_pins — Remove public SELECT, create verify function
-- ============================================================

DROP POLICY IF EXISTS "Anyone can verify active pins" ON public.kitchen_access_pins;

-- Only restaurant owners/members can manage PINs
CREATE POLICY "Restaurant members manage pins"
ON public.kitchen_access_pins FOR ALL TO authenticated
USING (
  public.is_restaurant_member(restaurant_id)
  OR public.is_restaurant_owner(restaurant_id)
  OR public.is_super_admin()
)
WITH CHECK (
  public.is_restaurant_member(restaurant_id)
  OR public.is_restaurant_owner(restaurant_id)
  OR public.is_super_admin()
);

-- Security definer function to verify PIN without exposing pin_code values
CREATE OR REPLACE FUNCTION public.verify_kitchen_pin(p_pin text)
RETURNS TABLE(pin_id uuid, restaurant_id uuid, label text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, restaurant_id, label
  FROM public.kitchen_access_pins
  WHERE pin_code = p_pin
    AND is_active = true
  LIMIT 1;
$$;

-- ============================================================
-- FIX 3: wallet_passes — Remove public SELECT
-- ============================================================

DROP POLICY IF EXISTS "Public read own wallet passes" ON public.wallet_passes;

-- Only restaurant owners/members can view wallet passes
CREATE POLICY "Restaurant members read wallet passes"
ON public.wallet_passes FOR SELECT TO authenticated
USING (
  public.is_restaurant_member(restaurant_id)
  OR public.is_restaurant_owner(restaurant_id)
  OR public.is_super_admin()
);

-- Keep INSERT for edge functions (service role bypasses RLS)
DROP POLICY IF EXISTS "Service can create wallet passes" ON public.wallet_passes;
CREATE POLICY "Authenticated insert wallet passes"
ON public.wallet_passes FOR INSERT TO authenticated
WITH CHECK (
  public.is_restaurant_member(restaurant_id)
  OR public.is_restaurant_owner(restaurant_id)
  OR public.is_super_admin()
);
