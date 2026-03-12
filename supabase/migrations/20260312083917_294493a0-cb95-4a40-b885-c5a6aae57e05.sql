
-- Business subscriptions table for multi-tenant subscription management
CREATE TABLE IF NOT EXISTS public.business_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'starter',
  status text NOT NULL DEFAULT 'trialing',
  trial_start timestamp with time zone NOT NULL DEFAULT now(),
  trial_end timestamp with time zone NOT NULL DEFAULT (now() + interval '90 days'),
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  stripe_customer_id text,
  stripe_subscription_id text,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(company_id)
);

-- Enable RLS
ALTER TABLE public.business_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Company owners read own subscription" ON public.business_subscriptions
  FOR SELECT USING (
    company_id = get_user_company(auth.uid()) OR is_super_admin()
  );

CREATE POLICY "Super admins manage subscriptions" ON public.business_subscriptions
  FOR ALL USING (is_super_admin());

-- Auto-create subscription on company insert
CREATE OR REPLACE FUNCTION public.handle_new_company_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.business_subscriptions (company_id, plan, status, trial_start, trial_end)
  VALUES (NEW.id, NEW.subscription_plan, 'trialing', now(), now() + interval '90 days')
  ON CONFLICT (company_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_company_created_subscription
  AFTER INSERT ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_company_subscription();
