-- Fix overly permissive policies on customer_activity
-- The trigger function is SECURITY DEFINER so it bypasses RLS
-- We only need owner/admin access for manual operations
DROP POLICY IF EXISTS "System inserts customer activity" ON public.customer_activity;
DROP POLICY IF EXISTS "System updates customer activity" ON public.customer_activity;
