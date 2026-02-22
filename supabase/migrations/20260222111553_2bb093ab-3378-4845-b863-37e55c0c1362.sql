
-- Fix overly permissive orders INSERT policy
DROP POLICY "Customers create orders" ON public.orders;
CREATE POLICY "Authenticated users create orders" ON public.orders 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
