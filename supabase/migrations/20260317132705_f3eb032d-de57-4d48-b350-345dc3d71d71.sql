-- Fix: customer_blacklist should not be publicly readable (exposes phone numbers)
DROP POLICY IF EXISTS "Public check blacklist" ON public.customer_blacklist;

-- Only restaurant owners/members + super admins can read blacklist
CREATE POLICY "Owners and members read blacklist"
ON public.customer_blacklist
FOR SELECT
USING (
  is_restaurant_owner(restaurant_id)
  OR is_restaurant_member(restaurant_id)
  OR is_super_admin()
);