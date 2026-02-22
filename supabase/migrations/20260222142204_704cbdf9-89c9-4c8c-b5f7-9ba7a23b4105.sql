
-- 1. Create storage bucket for restaurant logos
INSERT INTO storage.buckets (id, name, public) VALUES ('restaurant-logos', 'restaurant-logos', true);

-- Storage policies for restaurant logos
CREATE POLICY "Anyone can view logos" ON storage.objects FOR SELECT USING (bucket_id = 'restaurant-logos');
CREATE POLICY "Authenticated users can upload logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'restaurant-logos' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own logos" ON storage.objects FOR UPDATE USING (bucket_id = 'restaurant-logos' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete own logos" ON storage.objects FOR DELETE USING (bucket_id = 'restaurant-logos' AND auth.uid() IS NOT NULL);

-- 2. Add new columns to restaurants table
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS languages text[] DEFAULT '{it}'::text[];
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS min_order_amount numeric DEFAULT 0;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS blocked_keywords text[] DEFAULT '{}'::text[];
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS policy_accepted boolean DEFAULT false;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS policy_accepted_at timestamp with time zone;

-- 3. Add referrer/utm tracking to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS referrer text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS utm_source text;
