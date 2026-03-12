
-- ═══ NCC Tables ═══

-- Fleet vehicles
CREATE TABLE IF NOT EXISTS public.fleet_vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'sedan',
  brand text,
  model text,
  year integer,
  license_plate text,
  capacity integer NOT NULL DEFAULT 4,
  price_per_km numeric DEFAULT 0,
  base_price numeric DEFAULT 0,
  image_url text,
  features text[] DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.fleet_vehicles ENABLE ROW LEVEL SECURITY;

-- NCC Routes
CREATE TABLE IF NOT EXISTS public.ncc_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  origin text NOT NULL,
  destination text NOT NULL,
  distance_km numeric,
  duration_min integer,
  base_price numeric NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ncc_routes ENABLE ROW LEVEL SECURITY;

-- NCC Bookings
CREATE TABLE IF NOT EXISTS public.ncc_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES public.fleet_vehicles(id) ON DELETE SET NULL,
  route_id uuid REFERENCES public.ncc_routes(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_phone text,
  customer_email text,
  pickup_address text NOT NULL,
  dropoff_address text NOT NULL,
  pickup_datetime timestamptz NOT NULL,
  passengers integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'pending',
  total_price numeric DEFAULT 0,
  notes text,
  driver_id uuid REFERENCES public.staff(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ncc_bookings ENABLE ROW LEVEL SECURITY;

-- NCC Destinations
CREATE TABLE IF NOT EXISTS public.ncc_destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ncc_destinations ENABLE ROW LEVEL SECURITY;

-- NCC Reviews (separate from restaurant reviews)
CREATE TABLE IF NOT EXISTS public.ncc_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES public.ncc_bookings(id) ON DELETE SET NULL,
  customer_name text,
  rating integer NOT NULL,
  comment text,
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ncc_reviews ENABLE ROW LEVEL SECURITY;

-- ═══ Products / Inventory ═══
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  sku text,
  category text DEFAULT 'Generale',
  price numeric NOT NULL DEFAULT 0,
  cost numeric DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  min_stock integer DEFAULT 5,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- ═══ Shifts & Payroll ═══
CREATE TABLE IF NOT EXISTS public.shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  shift_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  break_minutes integer DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.clock_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  clock_in timestamptz NOT NULL DEFAULT now(),
  clock_out timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.clock_entries ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.payroll (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  period text NOT NULL,
  hours_worked numeric DEFAULT 0,
  overtime_hours numeric DEFAULT 0,
  gross_pay numeric DEFAULT 0,
  deductions numeric DEFAULT 0,
  net_pay numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;

-- ═══ Social Posts ═══
CREATE TABLE IF NOT EXISTS public.social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  platform text NOT NULL DEFAULT 'instagram',
  content text NOT NULL,
  image_url text,
  scheduled_at timestamptz,
  published_at timestamptz,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

-- ═══ Feature Requests ═══
CREATE TABLE IF NOT EXISTS public.feature_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending',
  votes integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.feature_requests ENABLE ROW LEVEL SECURITY;

-- ═══ Marketplace Modules ═══
CREATE TABLE IF NOT EXISTS public.marketplace_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  category text DEFAULT 'addon',
  icon text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.marketplace_modules ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.company_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES public.marketplace_modules(id) ON DELETE CASCADE,
  activated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(company_id, module_id)
);
ALTER TABLE public.company_modules ENABLE ROW LEVEL SECURITY;

-- ═══ RLS Policies (company-scoped) ═══

-- Fleet vehicles
CREATE POLICY "Company members manage fleet" ON public.fleet_vehicles
  FOR ALL USING (company_id = get_user_company(auth.uid()) OR is_super_admin());
CREATE POLICY "Public read active vehicles" ON public.fleet_vehicles
  FOR SELECT USING (is_active = true);

-- NCC Routes
CREATE POLICY "Company members manage routes" ON public.ncc_routes
  FOR ALL USING (company_id = get_user_company(auth.uid()) OR is_super_admin());
CREATE POLICY "Public read active routes" ON public.ncc_routes
  FOR SELECT USING (is_active = true);

-- NCC Bookings
CREATE POLICY "Company members manage bookings" ON public.ncc_bookings
  FOR ALL USING (company_id = get_user_company(auth.uid()) OR is_super_admin());
CREATE POLICY "Anyone create booking" ON public.ncc_bookings
  FOR INSERT WITH CHECK (true);

-- NCC Destinations
CREATE POLICY "Company members manage destinations" ON public.ncc_destinations
  FOR ALL USING (company_id = get_user_company(auth.uid()) OR is_super_admin());
CREATE POLICY "Public read destinations" ON public.ncc_destinations
  FOR SELECT USING (true);

-- NCC Reviews
CREATE POLICY "Company members manage ncc reviews" ON public.ncc_reviews
  FOR ALL USING (company_id = get_user_company(auth.uid()) OR is_super_admin());
CREATE POLICY "Public read public ncc reviews" ON public.ncc_reviews
  FOR SELECT USING (is_public = true);

-- Products
CREATE POLICY "Company members manage products" ON public.products
  FOR ALL USING (company_id = get_user_company(auth.uid()) OR is_super_admin());

-- Shifts
CREATE POLICY "Company members manage shifts" ON public.shifts
  FOR ALL USING (company_id = get_user_company(auth.uid()) OR is_super_admin());

-- Clock entries
CREATE POLICY "Company members manage clock" ON public.clock_entries
  FOR ALL USING (company_id = get_user_company(auth.uid()) OR is_super_admin());

-- Payroll
CREATE POLICY "Company members manage payroll" ON public.payroll
  FOR ALL USING (company_id = get_user_company(auth.uid()) OR is_super_admin());

-- Social posts
CREATE POLICY "Company members manage social" ON public.social_posts
  FOR ALL USING (company_id = get_user_company(auth.uid()) OR is_super_admin());

-- Feature requests
CREATE POLICY "Company members manage requests" ON public.feature_requests
  FOR ALL USING (company_id = get_user_company(auth.uid()) OR is_super_admin());

-- Marketplace modules (public read)
CREATE POLICY "Anyone read marketplace" ON public.marketplace_modules
  FOR SELECT USING (is_active = true);
CREATE POLICY "Super admins manage marketplace" ON public.marketplace_modules
  FOR ALL USING (is_super_admin());

-- Company modules
CREATE POLICY "Company members read own modules" ON public.company_modules
  FOR SELECT USING (company_id = get_user_company(auth.uid()) OR is_super_admin());
CREATE POLICY "Super admins manage company modules" ON public.company_modules
  FOR ALL USING (is_super_admin());
