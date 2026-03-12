
-- ══════════════════════════════════════════════════
-- NCC DRIVERS TABLE
-- ══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NOT NULL,
  email text,
  photo_url text,
  license_number text NOT NULL,
  license_expiry date NOT NULL,
  has_cqc boolean DEFAULT false,
  cqc_expiry date,
  languages text[] DEFAULT '{}',
  preferred_vehicle_id uuid REFERENCES public.fleet_vehicles(id),
  status text NOT NULL DEFAULT 'available',
  notes text,
  rating_avg numeric DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members manage drivers" ON public.drivers
  FOR ALL USING (company_id = get_user_company(auth.uid()) OR is_super_admin());

-- ══════════════════════════════════════════════════
-- ADD COLUMNS TO fleet_vehicles
-- ══════════════════════════════════════════════════
ALTER TABLE public.fleet_vehicles ADD COLUMN IF NOT EXISTS min_pax integer DEFAULT 1;
ALTER TABLE public.fleet_vehicles ADD COLUMN IF NOT EXISTS max_pax integer;
ALTER TABLE public.fleet_vehicles ADD COLUMN IF NOT EXISTS luggage_capacity integer DEFAULT 0;
ALTER TABLE public.fleet_vehicles ADD COLUMN IF NOT EXISTS is_popular boolean DEFAULT false;
ALTER TABLE public.fleet_vehicles ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.fleet_vehicles ADD COLUMN IF NOT EXISTS plate text;
ALTER TABLE public.fleet_vehicles ADD COLUMN IF NOT EXISTS revision_expiry date;
ALTER TABLE public.fleet_vehicles ADD COLUMN IF NOT EXISTS insurance_expiry date;
ALTER TABLE public.fleet_vehicles ADD COLUMN IF NOT EXISTS maintenance_notes text;

-- Update max_pax from capacity where null
UPDATE public.fleet_vehicles SET max_pax = capacity WHERE max_pax IS NULL;

-- ══════════════════════════════════════════════════
-- ADD transport_type TO ncc_routes
-- ══════════════════════════════════════════════════
ALTER TABLE public.ncc_routes ADD COLUMN IF NOT EXISTS transport_type text DEFAULT 'city';
ALTER TABLE public.ncc_routes ADD COLUMN IF NOT EXISTS notes text;

-- ══════════════════════════════════════════════════
-- ROUTE PRICES MATRIX
-- ══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.route_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid NOT NULL REFERENCES public.ncc_routes(id) ON DELETE CASCADE,
  vehicle_id uuid NOT NULL REFERENCES public.fleet_vehicles(id) ON DELETE CASCADE,
  base_price numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(route_id, vehicle_id)
);

ALTER TABLE public.route_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Route prices public read" ON public.route_prices
  FOR SELECT USING (true);

CREATE POLICY "Company members manage route prices" ON public.route_prices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.ncc_routes r
      WHERE r.id = route_prices.route_id
      AND (r.company_id = get_user_company(auth.uid()) OR is_super_admin())
    )
  );

-- ══════════════════════════════════════════════════
-- SEASONAL PRICES
-- ══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.seasonal_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid NOT NULL REFERENCES public.ncc_routes(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES public.fleet_vehicles(id) ON DELETE CASCADE,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  price numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(route_id, vehicle_id, month)
);

ALTER TABLE public.seasonal_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Seasonal prices public read" ON public.seasonal_prices
  FOR SELECT USING (true);

CREATE POLICY "Company members manage seasonal prices" ON public.seasonal_prices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.ncc_routes r
      WHERE r.id = seasonal_prices.route_id
      AND (r.company_id = get_user_company(auth.uid()) OR is_super_admin())
    )
  );

-- ══════════════════════════════════════════════════
-- BOAT PRICES
-- ══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.boat_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id uuid NOT NULL REFERENCES public.ncc_destinations(id) ON DELETE CASCADE,
  standard_price numeric DEFAULT 0,
  group_price numeric DEFAULT 0,
  children_price numeric DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(destination_id)
);

ALTER TABLE public.boat_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Boat prices public read" ON public.boat_prices
  FOR SELECT USING (true);

CREATE POLICY "Company members manage boat prices" ON public.boat_prices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.ncc_destinations d
      WHERE d.id = boat_prices.destination_id
      AND (d.company_id = get_user_company(auth.uid()) OR is_super_admin())
    )
  );

-- ══════════════════════════════════════════════════
-- EXTRA PRICES
-- ══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.extra_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  key text NOT NULL,
  label text NOT NULL DEFAULT '',
  value numeric NOT NULL DEFAULT 0,
  is_percentage boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(company_id, key)
);

ALTER TABLE public.extra_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members manage extra prices" ON public.extra_prices
  FOR ALL USING (company_id = get_user_company(auth.uid()) OR is_super_admin());

CREATE POLICY "Public read extra prices" ON public.extra_prices
  FOR SELECT USING (true);

-- ══════════════════════════════════════════════════
-- CROSS-SELLS
-- ══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.cross_sells (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  price numeric DEFAULT 0,
  is_free boolean DEFAULT false,
  shown_to text DEFAULT 'all',
  icon_emoji text DEFAULT '🎁',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cross_sells ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members manage cross sells" ON public.cross_sells
  FOR ALL USING (company_id = get_user_company(auth.uid()) OR is_super_admin());

CREATE POLICY "Public read active cross sells" ON public.cross_sells
  FOR SELECT USING (is_active = true);

-- ══════════════════════════════════════════════════
-- FAQ ITEMS
-- ══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members manage faq" ON public.faq_items
  FOR ALL USING (company_id = get_user_company(auth.uid()) OR is_super_admin());

CREATE POLICY "Public read active faq" ON public.faq_items
  FOR SELECT USING (is_active = true);

-- ══════════════════════════════════════════════════
-- SEO SETTINGS
-- ══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL UNIQUE REFERENCES public.companies(id) ON DELETE CASCADE,
  meta_title text,
  meta_description text,
  og_image_url text,
  keywords text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members manage seo" ON public.seo_settings
  FOR ALL USING (company_id = get_user_company(auth.uid()) OR is_super_admin());

-- ══════════════════════════════════════════════════
-- ADD more columns to ncc_bookings for enhanced booking form
-- ══════════════════════════════════════════════════
ALTER TABLE public.ncc_bookings ADD COLUMN IF NOT EXISTS client_email text;
ALTER TABLE public.ncc_bookings ADD COLUMN IF NOT EXISTS service_type text DEFAULT 'transfer';
ALTER TABLE public.ncc_bookings ADD COLUMN IF NOT EXISTS custom_origin text;
ALTER TABLE public.ncc_bookings ADD COLUMN IF NOT EXISTS custom_destination text;
ALTER TABLE public.ncc_bookings ADD COLUMN IF NOT EXISTS luggage integer DEFAULT 0;
ALTER TABLE public.ncc_bookings ADD COLUMN IF NOT EXISTS flight_code text;
ALTER TABLE public.ncc_bookings ADD COLUMN IF NOT EXISTS deposit numeric DEFAULT 0;
ALTER TABLE public.ncc_bookings ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'not_specified';
ALTER TABLE public.ncc_bookings ADD COLUMN IF NOT EXISTS admin_notes text;
ALTER TABLE public.ncc_bookings ADD COLUMN IF NOT EXISTS driver_notes text;
ALTER TABLE public.ncc_bookings ADD COLUMN IF NOT EXISTS created_by uuid;

-- ══════════════════════════════════════════════════
-- ADD admin_reply to ncc_reviews
-- ══════════════════════════════════════════════════
ALTER TABLE public.ncc_reviews ADD COLUMN IF NOT EXISTS admin_reply text;
ALTER TABLE public.ncc_reviews ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

-- ══════════════════════════════════════════════════
-- COMPANY SETTINGS (extended)
-- ══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.company_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL UNIQUE REFERENCES public.companies(id) ON DELETE CASCADE,
  vat text,
  whatsapp text,
  facebook_url text,
  instagram_url text,
  hours text,
  confirmation_message text,
  email_template text,
  bookings_enabled boolean DEFAULT true,
  require_deposit boolean DEFAULT false,
  deposit_percentage numeric DEFAULT 30,
  currency text DEFAULT 'EUR',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members manage settings" ON public.company_settings
  FOR ALL USING (company_id = get_user_company(auth.uid()) OR is_super_admin());

-- ══════════════════════════════════════════════════
-- CONTENT BLOCKS (CMS)
-- ══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  section text NOT NULL,
  field_key text NOT NULL,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(company_id, section, field_key)
);

ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members manage content" ON public.content_blocks
  FOR ALL USING (company_id = get_user_company(auth.uid()) OR is_super_admin());

CREATE POLICY "Public read content blocks" ON public.content_blocks
  FOR SELECT USING (true);
