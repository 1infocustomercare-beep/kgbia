
-- Allow anyone (including anon) to read active companies for public sites
CREATE POLICY "Anyone can read active companies"
ON public.companies
FOR SELECT
TO public
USING (is_active = true);
