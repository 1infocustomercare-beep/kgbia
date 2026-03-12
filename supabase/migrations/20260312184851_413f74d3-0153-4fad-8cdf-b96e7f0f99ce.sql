
-- Staff shifts table (services already exists)
CREATE TABLE IF NOT EXISTS public.staff_shifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  user_id UUID,
  staff_name TEXT NOT NULL,
  shift_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  notes TEXT
);

ALTER TABLE public.staff_shifts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "company_isolation" ON public.staff_shifts FOR ALL USING (
    (company_id IN (SELECT company_id FROM public.company_memberships WHERE user_id = auth.uid())) OR is_super_admin()
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Shootings table for photographers
CREATE TABLE IF NOT EXISTS public.shootings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  shooting_type TEXT,
  shoot_date TIMESTAMPTZ,
  location TEXT,
  duration_hours NUMERIC(4,1),
  price NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'booked',
  gallery_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.shootings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "company_isolation" ON public.shootings FOR ALL USING (
    (company_id IN (SELECT company_id FROM public.company_memberships WHERE user_id = auth.uid())) OR is_super_admin()
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
