
-- Create remaining tables and policies using DO blocks

-- Seasonal prices table
CREATE TABLE IF NOT EXISTS public.seasonal_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid NOT NULL REFERENCES public.ncc_routes(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES public.fleet_vehicles(id) ON DELETE SET NULL,
  month integer NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(route_id, vehicle_id, month)
);
ALTER TABLE public.seasonal_prices ENABLE ROW LEVEL SECURITY;

-- SEO settings table
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE UNIQUE,
  meta_title text DEFAULT '',
  meta_description text DEFAULT '',
  og_image_url text DEFAULT '',
  keywords text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  full_name text DEFAULT '',
  avatar_url text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Extra prices unique constraint
DO $$ BEGIN
  ALTER TABLE public.extra_prices ADD CONSTRAINT extra_prices_company_key_unique UNIQUE (company_id, key);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- All policies via DO blocks to avoid duplicates
DO $$ BEGIN
  CREATE POLICY "Company members manage seasonal prices" ON public.seasonal_prices FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.ncc_routes r WHERE r.id = seasonal_prices.route_id AND (r.company_id = get_user_company(auth.uid()) OR is_super_admin())));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Company members manage seo" ON public.seo_settings FOR ALL TO authenticated USING (company_id = get_user_company(auth.uid()) OR is_super_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public read seo" ON public.seo_settings FOR SELECT TO public USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (user_id = auth.uid() OR is_super_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users manage own profile" ON public.profiles FOR ALL TO authenticated USING (user_id = auth.uid() OR is_super_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DO $$ BEGIN
  CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
