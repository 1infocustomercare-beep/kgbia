-- Allow company members to read their company
CREATE POLICY "Members read own company"
  ON public.companies
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM public.company_memberships WHERE user_id = auth.uid()
    )
    OR owner_id = auth.uid()
    OR is_super_admin()
  );

-- Drop the old restrictive policy  
DROP POLICY IF EXISTS "Owners read own company" ON public.companies;