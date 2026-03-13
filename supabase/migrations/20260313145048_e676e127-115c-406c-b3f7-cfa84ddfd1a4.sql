
-- Allow public read of company_settings for public site (WhatsApp, social links etc.)
CREATE POLICY "Public read company settings"
ON public.company_settings
FOR SELECT
TO public
USING (true);
