
-- Feature request messages table for chat between tenant and superadmin
CREATE TABLE IF NOT EXISTS public.feature_request_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.feature_requests(id) ON DELETE CASCADE NOT NULL,
  sender_type TEXT NOT NULL DEFAULT 'client',
  sender_id UUID,
  message TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.feature_request_messages ENABLE ROW LEVEL SECURITY;

-- Policy: users can see messages for their company's feature requests
CREATE POLICY "Users see own request messages" ON public.feature_request_messages
  FOR SELECT TO authenticated
  USING (
    request_id IN (
      SELECT id FROM public.feature_requests 
      WHERE company_id = public.get_user_company(auth.uid())
    )
    OR public.is_super_admin()
  );

CREATE POLICY "Users insert own request messages" ON public.feature_request_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    request_id IN (
      SELECT id FROM public.feature_requests 
      WHERE company_id = public.get_user_company(auth.uid())
    )
    OR public.is_super_admin()
  );

-- SuperAdmin can update (mark as read)
CREATE POLICY "SuperAdmin update messages" ON public.feature_request_messages
  FOR UPDATE TO authenticated
  USING (public.is_super_admin());

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.feature_request_messages;

-- Add missing columns to feature_requests if not present
ALTER TABLE public.feature_requests ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal';
ALTER TABLE public.feature_requests ADD COLUMN IF NOT EXISTS estimated_price DECIMAL(10,2);
ALTER TABLE public.feature_requests ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE public.feature_requests ADD COLUMN IF NOT EXISTS reply_message TEXT;
ALTER TABLE public.feature_requests ADD COLUMN IF NOT EXISTS deployed_at TIMESTAMPTZ;
ALTER TABLE public.feature_requests ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.feature_requests ADD COLUMN IF NOT EXISTS sector TEXT;

-- Public site config table
CREATE TABLE IF NOT EXISTS public.public_site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL UNIQUE,
  headline TEXT,
  tagline TEXT,
  hero_image_url TEXT,
  hero_video_url TEXT,
  about_text TEXT,
  font_heading TEXT DEFAULT 'Playfair Display',
  font_body TEXT DEFAULT 'Inter',
  active_sections JSONB DEFAULT '["hero","services","about","reviews","contact"]',
  custom_css TEXT,
  google_business_url TEXT,
  whatsapp_number TEXT,
  booking_enabled BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.public_site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner manages site config" ON public.public_site_config
  FOR ALL TO authenticated
  USING (company_id = public.get_user_company(auth.uid()) OR public.is_super_admin());

CREATE POLICY "Public read site config" ON public.public_site_config
  FOR SELECT USING (true);

-- Notifications log
CREATE TABLE IF NOT EXISTS public.notifications_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  channel TEXT NOT NULL DEFAULT 'in_app',
  recipient TEXT NOT NULL,
  template TEXT,
  title TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'sent',
  sent_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notifications_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own notifications" ON public.notifications_log
  FOR ALL TO authenticated
  USING (company_id = public.get_user_company(auth.uid()) OR public.is_super_admin());

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications_log;

-- SuperAdmin policy on feature_requests
CREATE POLICY "SuperAdmin manages all requests" ON public.feature_requests
  FOR ALL TO authenticated
  USING (public.is_super_admin());

-- Users can insert their own feature requests  
CREATE POLICY "Users insert requests" ON public.feature_requests
  FOR INSERT TO authenticated
  WITH CHECK (company_id = public.get_user_company(auth.uid()));

-- Users can read own feature requests
CREATE POLICY "Users read own requests" ON public.feature_requests
  FOR SELECT TO authenticated
  USING (company_id = public.get_user_company(auth.uid()) OR public.is_super_admin());
