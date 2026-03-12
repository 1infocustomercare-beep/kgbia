
-- Add missing columns to companies
ALTER TABLE companies ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'Inter';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS modules_config JSONB DEFAULT '{}';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS opening_hours JSONB DEFAULT '{}';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';

-- Beach spots
CREATE TABLE IF NOT EXISTS beach_spots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  row_letter TEXT NOT NULL,
  spot_number INTEGER NOT NULL,
  spot_type TEXT DEFAULT 'umbrella',
  is_active BOOLEAN DEFAULT true,
  price_daily DECIMAL(10,2) DEFAULT 0,
  price_morning DECIMAL(10,2) DEFAULT 0,
  price_afternoon DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS beach_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  spot_id UUID REFERENCES beach_spots(id),
  client_name TEXT NOT NULL,
  client_phone TEXT,
  booking_date DATE NOT NULL,
  period TEXT DEFAULT 'full_day',
  status TEXT DEFAULT 'confirmed',
  total DECIMAL(10,2) DEFAULT 0,
  extras_json JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS beach_passes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  spot_id UUID REFERENCES beach_spots(id),
  start_date DATE,
  end_date DATE,
  pass_type TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Interventions
CREATE TABLE IF NOT EXISTS interventions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_id UUID,
  address TEXT,
  intervention_type TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ,
  technician_name TEXT,
  status TEXT DEFAULT 'requested',
  urgency TEXT DEFAULT 'normal',
  estimated_price DECIMAL(10,2),
  final_price DECIMAL(10,2),
  notes TEXT,
  photos_json JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- CRM clients
CREATE TABLE IF NOT EXISTS crm_clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  notes TEXT,
  notes_technical TEXT,
  total_spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_id UUID,
  service_id UUID,
  service_name TEXT,
  staff_name TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'confirmed',
  notes TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  duration_minutes INTEGER DEFAULT 60,
  price DECIMAL(10,2) DEFAULT 0,
  color TEXT DEFAULT '#6B7280',
  is_active BOOLEAN DEFAULT true
);

-- Staff shifts
CREATE TABLE IF NOT EXISTS staff_shifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  user_id UUID,
  staff_name TEXT NOT NULL,
  shift_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  notes TEXT
);

-- Automations
CREATE TABLE IF NOT EXISTS automations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  automation_type TEXT NOT NULL,
  template_subject TEXT,
  template_body TEXT,
  is_active BOOLEAN DEFAULT true,
  sent_count INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE beach_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE beach_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE beach_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "company_isolation" ON beach_spots FOR ALL USING (
  company_id IN (SELECT company_id FROM company_memberships WHERE user_id = auth.uid()) OR public.is_super_admin()
);
CREATE POLICY "company_isolation" ON beach_bookings FOR ALL USING (
  company_id IN (SELECT company_id FROM company_memberships WHERE user_id = auth.uid()) OR public.is_super_admin()
);
CREATE POLICY "company_isolation" ON beach_passes FOR ALL USING (
  company_id IN (SELECT company_id FROM company_memberships WHERE user_id = auth.uid()) OR public.is_super_admin()
);
CREATE POLICY "company_isolation" ON interventions FOR ALL USING (
  company_id IN (SELECT company_id FROM company_memberships WHERE user_id = auth.uid()) OR public.is_super_admin()
);
CREATE POLICY "company_isolation" ON crm_clients FOR ALL USING (
  company_id IN (SELECT company_id FROM company_memberships WHERE user_id = auth.uid()) OR public.is_super_admin()
);
CREATE POLICY "company_isolation" ON appointments FOR ALL USING (
  company_id IN (SELECT company_id FROM company_memberships WHERE user_id = auth.uid()) OR public.is_super_admin()
);
CREATE POLICY "company_isolation" ON services FOR ALL USING (
  company_id IN (SELECT company_id FROM company_memberships WHERE user_id = auth.uid()) OR public.is_super_admin()
);
CREATE POLICY "company_isolation" ON staff_shifts FOR ALL USING (
  company_id IN (SELECT company_id FROM company_memberships WHERE user_id = auth.uid()) OR public.is_super_admin()
);
CREATE POLICY "company_isolation" ON automations FOR ALL USING (
  company_id IN (SELECT company_id FROM company_memberships WHERE user_id = auth.uid()) OR public.is_super_admin()
);
