
-- Table to track installment payments per restaurant
CREATE TABLE public.restaurant_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL DEFAULT 'full' CHECK (plan_type IN ('full', '3_rate', '6_rate')),
  total_amount NUMERIC NOT NULL DEFAULT 2997,
  amount_paid NUMERIC NOT NULL DEFAULT 0,
  installment_amount NUMERIC NOT NULL DEFAULT 2997,
  installments_total INTEGER NOT NULL DEFAULT 1,
  installments_paid INTEGER NOT NULL DEFAULT 0,
  next_due_date DATE,
  is_overdue BOOLEAN NOT NULL DEFAULT false,
  blocked_at TIMESTAMPTZ,
  grace_period_days INTEGER NOT NULL DEFAULT 7,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(restaurant_id)
);

-- Add kill-switch column to restaurants
ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS blocked_reason TEXT;

ALTER TABLE public.restaurant_payments ENABLE ROW LEVEL SECURITY;

-- Super admins manage all payments
CREATE POLICY "Super admins manage payments"
  ON public.restaurant_payments FOR ALL
  USING (is_super_admin());

-- Restaurant owners can view their own payment status
CREATE POLICY "Owners read own payments"
  ON public.restaurant_payments FOR SELECT
  USING (is_restaurant_owner(restaurant_id));

-- Trigger to auto-update updated_at
CREATE TRIGGER update_restaurant_payments_updated_at
  BEFORE UPDATE ON public.restaurant_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function: check overdue payments and block restaurants
CREATE OR REPLACE FUNCTION public.check_overdue_payments()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Mark payments as overdue if past due date + grace period
  UPDATE public.restaurant_payments
  SET is_overdue = true, updated_at = now()
  WHERE next_due_date IS NOT NULL
    AND next_due_date + (grace_period_days || ' days')::interval < now()
    AND installments_paid < installments_total
    AND is_overdue = false;

  -- Block restaurants with overdue payments
  UPDATE public.restaurants r
  SET is_blocked = true,
      blocked_reason = 'Rata scaduta non pagata. Contatta il supporto Empire.',
      is_active = false,
      updated_at = now()
  FROM public.restaurant_payments rp
  WHERE rp.restaurant_id = r.id
    AND rp.is_overdue = true
    AND r.is_blocked = false;

  -- Unblock restaurants that have caught up on payments
  UPDATE public.restaurants r
  SET is_blocked = false,
      blocked_reason = null,
      is_active = true,
      updated_at = now()
  FROM public.restaurant_payments rp
  WHERE rp.restaurant_id = r.id
    AND rp.is_overdue = false
    AND r.is_blocked = true
    AND r.blocked_reason = 'Rata scaduta non pagata. Contatta il supporto Empire.';
END;
$$;
