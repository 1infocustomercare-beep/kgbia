
-- Products / Services / Catalog (multi-sector)
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  price numeric DEFAULT 0,
  duration_minutes integer,
  category text DEFAULT '',
  sku text DEFAULT '',
  stock integer,
  image_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_company_policy" ON public.products FOR ALL USING (
  company_id IN (SELECT company_id FROM public.company_memberships WHERE user_id = auth.uid())
);

-- Classes (fitness)
CREATE TABLE IF NOT EXISTS public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  instructor text DEFAULT '',
  day_of_week text DEFAULT '',
  time text DEFAULT '',
  duration_minutes integer DEFAULT 60,
  capacity integer DEFAULT 20,
  enrolled integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "classes_company_policy" ON public.classes FOR ALL USING (
  company_id IN (SELECT company_id FROM public.company_memberships WHERE user_id = auth.uid())
);

-- Rooms (hospitality)
CREATE TABLE IF NOT EXISTS public.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  room_number text NOT NULL,
  room_type text DEFAULT 'standard',
  price_per_night numeric DEFAULT 0,
  floor integer DEFAULT 1,
  status text DEFAULT 'available',
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rooms_company_policy" ON public.rooms FOR ALL USING (
  company_id IN (SELECT company_id FROM public.company_memberships WHERE user_id = auth.uid())
);
