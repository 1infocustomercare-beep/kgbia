-- Fix cliente-fitness membership: currently linked to tuscanyviaggi (ncc), should be Iron Gym (fitness)
UPDATE public.company_memberships 
SET company_id = '8f52d83b-cb01-4502-b1c5-f449feb917e7'
WHERE user_id = 'acd58d9b-5676-4d7b-ae55-fab49a3b6470' 
AND company_id = 'd1ccc98c-b919-47a7-9ffb-c47a5e592683';

-- Also allow members to update their own company
DROP POLICY IF EXISTS "Owners update own company" ON public.companies;
CREATE POLICY "Members update own company"
  ON public.companies
  FOR UPDATE
  TO authenticated
  USING (
    id IN (SELECT company_id FROM public.company_memberships WHERE user_id = auth.uid())
    OR owner_id = auth.uid()
    OR is_super_admin()
  )
  WITH CHECK (
    id IN (SELECT company_id FROM public.company_memberships WHERE user_id = auth.uid())
    OR owner_id = auth.uid()
    OR is_super_admin()
  );