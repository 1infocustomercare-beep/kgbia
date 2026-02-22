-- Add position columns for dynamic table map
ALTER TABLE public.restaurant_tables 
ADD COLUMN pos_x numeric DEFAULT 0,
ADD COLUMN pos_y numeric DEFAULT 0;

-- Add a customer_activity tracking table for "Lost Customers" system
CREATE TABLE public.customer_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  customer_phone text NOT NULL,
  customer_name text,
  last_order_at timestamp with time zone NOT NULL DEFAULT now(),
  total_orders integer NOT NULL DEFAULT 1,
  total_spent numeric NOT NULL DEFAULT 0,
  discount_sent boolean NOT NULL DEFAULT false,
  discount_sent_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(restaurant_id, customer_phone)
);

ALTER TABLE public.customer_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Restaurant owners read own customer activity"
ON public.customer_activity FOR SELECT
USING (is_restaurant_owner(restaurant_id) OR is_super_admin());

CREATE POLICY "Restaurant owners manage own customer activity"
ON public.customer_activity FOR ALL
USING (is_restaurant_owner(restaurant_id) OR is_super_admin());

CREATE POLICY "System inserts customer activity"
ON public.customer_activity FOR INSERT
WITH CHECK (true);

CREATE POLICY "System updates customer activity"
ON public.customer_activity FOR UPDATE
USING (true);

-- Trigger to update customer_activity on new order
CREATE OR REPLACE FUNCTION public.track_customer_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.customer_phone IS NOT NULL AND NEW.customer_phone != '' THEN
    INSERT INTO public.customer_activity (restaurant_id, customer_phone, customer_name, last_order_at, total_orders, total_spent)
    VALUES (NEW.restaurant_id, NEW.customer_phone, NEW.customer_name, NEW.created_at, 1, NEW.total)
    ON CONFLICT (restaurant_id, customer_phone)
    DO UPDATE SET
      last_order_at = GREATEST(customer_activity.last_order_at, NEW.created_at),
      total_orders = customer_activity.total_orders + 1,
      total_spent = customer_activity.total_spent + NEW.total,
      customer_name = COALESCE(NEW.customer_name, customer_activity.customer_name),
      discount_sent = false,
      updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_order_track_customer
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.track_customer_activity();

-- Updated_at trigger for customer_activity
CREATE TRIGGER update_customer_activity_updated_at
BEFORE UPDATE ON public.customer_activity
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
