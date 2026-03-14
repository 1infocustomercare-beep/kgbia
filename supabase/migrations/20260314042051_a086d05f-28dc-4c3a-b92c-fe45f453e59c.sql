-- Allow partners to read their own referred payments
CREATE POLICY "Partners read own referred payments"
ON public.restaurant_payments
FOR SELECT
TO authenticated
USING (auth.uid() = partner_id);