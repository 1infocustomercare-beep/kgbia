
-- Create restaurant_subscriptions table
CREATE TABLE public.restaurant_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'essential',
  status TEXT NOT NULL DEFAULT 'trialing',
  trial_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  trial_end TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '90 days'),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(restaurant_id)
);

-- Enable RLS
ALTER TABLE public.restaurant_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Restaurant owners read own subscription"
ON public.restaurant_subscriptions FOR SELECT
USING (is_restaurant_owner(restaurant_id) OR is_super_admin());

CREATE POLICY "Super admins manage subscriptions"
ON public.restaurant_subscriptions FOR ALL
USING (is_super_admin());

CREATE POLICY "System inserts subscriptions"
ON public.restaurant_subscriptions FOR INSERT
WITH CHECK (is_restaurant_owner(restaurant_id) OR is_super_admin());

CREATE POLICY "Owners update own subscription"
ON public.restaurant_subscriptions FOR UPDATE
USING (is_restaurant_owner(restaurant_id));

-- Trigger for updated_at
CREATE TRIGGER update_restaurant_subscriptions_updated_at
BEFORE UPDATE ON public.restaurant_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create trial subscription when restaurant is created
CREATE OR REPLACE FUNCTION public.handle_new_restaurant_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.restaurant_subscriptions (restaurant_id, plan, status, trial_start, trial_end)
  VALUES (NEW.id, 'essential', 'trialing', now(), now() + interval '90 days')
  ON CONFLICT (restaurant_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_restaurant_create_subscription
AFTER INSERT ON public.restaurants
FOR EACH ROW EXECUTE FUNCTION public.handle_new_restaurant_subscription();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.restaurant_subscriptions;
