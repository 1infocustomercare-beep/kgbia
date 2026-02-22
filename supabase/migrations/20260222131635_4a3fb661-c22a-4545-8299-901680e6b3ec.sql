
-- Create table for restaurant tables management
CREATE TABLE public.restaurant_tables (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  table_number integer NOT NULL,
  label text DEFAULT '',
  status text NOT NULL DEFAULT 'free',
  seats integer DEFAULT 4,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(restaurant_id, table_number)
);

-- Enable RLS
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;

-- Public can read tables for a restaurant (needed for customer table info)
CREATE POLICY "Anyone reads restaurant tables"
ON public.restaurant_tables FOR SELECT
USING (true);

-- Owners manage their tables
CREATE POLICY "Owners manage tables"
ON public.restaurant_tables FOR ALL
USING (is_restaurant_owner(restaurant_id) OR is_super_admin());

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.restaurant_tables;

-- Trigger for updated_at
CREATE TRIGGER update_restaurant_tables_updated_at
BEFORE UPDATE ON public.restaurant_tables
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
