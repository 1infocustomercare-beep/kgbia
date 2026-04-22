-- ============================================================================
-- DEMO SITE GENERATOR FULL POWER
-- ============================================================================

-- 1) BLUEPRINTS settoriali (registry template)
CREATE TABLE IF NOT EXISTS public.demo_site_blueprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  sector text NOT NULL,
  sub_sectors text[] DEFAULT '{}',
  template_variants jsonb NOT NULL DEFAULT '[]',
  required_agents jsonb NOT NULL DEFAULT '[]',
  functional_modules jsonb NOT NULL DEFAULT '[]',
  seed_schema jsonb NOT NULL DEFAULT '{}',
  default_colors jsonb DEFAULT '{}',
  default_fonts jsonb DEFAULT '{}',
  preview_thumbnail_url text,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_demo_site_blueprints_sector ON public.demo_site_blueprints(sector) WHERE is_active = true;

ALTER TABLE public.demo_site_blueprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read active blueprints"
  ON public.demo_site_blueprints FOR SELECT TO authenticated
  USING (is_active = true OR public.is_super_admin());

CREATE POLICY "Super admin manages blueprints"
  ON public.demo_site_blueprints FOR ALL TO authenticated
  USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

CREATE TRIGGER trg_demo_site_blueprints_updated
  BEFORE UPDATE ON public.demo_site_blueprints
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) DEMO SITES generati
CREATE TABLE IF NOT EXISTS public.demo_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id uuid,
  blueprint_id uuid REFERENCES public.demo_site_blueprints(id) ON DELETE SET NULL,
  template_variant text,
  business_name text NOT NULL,
  sector text NOT NULL,
  sub_sector text,
  public_slug text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'queued',
  branding_snapshot jsonb NOT NULL DEFAULT '{}',
  scraped_data jsonb DEFAULT '{}',
  agents_activated jsonb DEFAULT '[]',
  modules_enabled jsonb DEFAULT '[]',
  preview_url text,
  admin_url text,
  admin_email text,
  admin_password text,
  whatsapp_message text,
  whatsapp_link text,
  view_count integer NOT NULL DEFAULT 0,
  cta_click_count integer NOT NULL DEFAULT 0,
  conversion_status text DEFAULT 'pending',
  converted_at timestamptz,
  ab_test_group text,
  reuse_source_id uuid REFERENCES public.demo_sites(id) ON DELETE SET NULL,
  reuse_count integer NOT NULL DEFAULT 0,
  generation_duration_ms integer,
  generation_error text,
  generated_at timestamptz,
  last_viewed_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_demo_sites_owner ON public.demo_sites(owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demo_sites_lead ON public.demo_sites(lead_id) WHERE lead_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_demo_sites_slug ON public.demo_sites(public_slug);
CREATE INDEX IF NOT EXISTS idx_demo_sites_status ON public.demo_sites(status);
CREATE INDEX IF NOT EXISTS idx_demo_sites_sector ON public.demo_sites(sector);

ALTER TABLE public.demo_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner reads own demo sites"
  ON public.demo_sites FOR SELECT TO authenticated
  USING (owner_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "Public reads ready demo sites by slug"
  ON public.demo_sites FOR SELECT TO anon, authenticated
  USING (status = 'ready' AND archived_at IS NULL);

CREATE POLICY "Owner inserts own demo sites"
  ON public.demo_sites FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owner updates own demo sites"
  ON public.demo_sites FOR UPDATE TO authenticated
  USING (owner_id = auth.uid() OR public.is_super_admin())
  WITH CHECK (owner_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "Owner deletes own demo sites"
  ON public.demo_sites FOR DELETE TO authenticated
  USING (owner_id = auth.uid() OR public.is_super_admin());

CREATE TRIGGER trg_demo_sites_updated
  BEFORE UPDATE ON public.demo_sites
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) ANALYTICS visite siti demo
CREATE TABLE IF NOT EXISTS public.demo_site_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  demo_site_id uuid NOT NULL REFERENCES public.demo_sites(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_metadata jsonb DEFAULT '{}',
  visitor_ip text,
  user_agent text,
  referrer text,
  session_duration_ms integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_demo_site_analytics_site ON public.demo_site_analytics(demo_site_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demo_site_analytics_event ON public.demo_site_analytics(event_type);

ALTER TABLE public.demo_site_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner reads own demo analytics"
  ON public.demo_site_analytics FOR SELECT TO authenticated
  USING (
    EXISTS(
      SELECT 1 FROM public.demo_sites ds
      WHERE ds.id = demo_site_id
        AND (ds.owner_id = auth.uid() OR public.is_super_admin())
    )
  );

CREATE POLICY "Anyone can insert analytics events"
  ON public.demo_site_analytics FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- 4) COSTO CREDITI per generazione full power
INSERT INTO public.seller_action_costs (action, credit_cost, cost_eur_estimate, label, is_active)
VALUES ('demo_site_generate_full_power', 25, 1.50, 'Demo Site Full Power (multi-agent + scrape + seed)', true)
ON CONFLICT (action) DO UPDATE
  SET credit_cost = 25,
      cost_eur_estimate = 1.50,
      label = 'Demo Site Full Power (multi-agent + scrape + seed)',
      is_active = true;

-- 5) SEED dei 8 BLUEPRINT settoriali
INSERT INTO public.demo_site_blueprints (slug, name, sector, sub_sectors, template_variants, required_agents, functional_modules, default_colors, display_order) VALUES
  ('food-restaurant', 'Food & Restaurant Empire', 'food',
    ARRAY['pizzeria','sushi','ristorante','trattoria','pesce','carne','pane','gelateria'],
    '[{"key":"strapizzami","name":"Strapizzami Cream","preview":"/templates/strapizzami.jpg"},{"key":"paperfish","name":"Paperfish Sakura","preview":"/templates/paperfish.jpg"},{"key":"batey","name":"Batey Pacifico","preview":"/templates/batey.jpg"},{"key":"cote-miami","name":"Cote Miami Luxury","preview":"/templates/cote.jpg"}]'::jsonb,
    '["mary_fiscal","arianna_sales","voice_agent_reservations","ai_reviews","ai_menu_optimizer","ai_upsell"]'::jsonb,
    '["menu_digitale","prenotazioni","ordini_online","kitchen_view","whatsapp_orders","loyalty_program","reviews_management","fiscal_compliance"]'::jsonb,
    '{"primary":"#C8963E","accent":"#1a1a1a","background":"#0a0a0a"}'::jsonb,
    1),
  ('beauty-wellness', 'Beauty & Wellness Empire', 'beauty',
    ARRAY['parrucchiere','estetica','nails','barber','spa','massaggi'],
    '[{"key":"luxury-rose","name":"Luxury Rose","preview":"/templates/luxury-rose.jpg"},{"key":"minimal-nude","name":"Minimal Nude","preview":"/templates/minimal-nude.jpg"}]'::jsonb,
    '["arianna_sales","voice_agent_booking","ai_upsell","ai_reviews","ai_loyalty"]'::jsonb,
    '["booking_online","calendario_staff","crm_clienti","servizi_pricing","whatsapp_reminders","gift_cards","loyalty_program"]'::jsonb,
    '{"primary":"#D4A5A5","accent":"#2a1a1a","background":"#FFF8F5"}'::jsonb,
    2),
  ('ncc-transport', 'NCC & Transport Empire', 'ncc',
    ARRAY['ncc','taxi','limousine','yacht','barca','transfer'],
    '[{"key":"luxury-black","name":"Luxury Black","preview":"/templates/ncc-black.jpg"},{"key":"yacht-azure","name":"Yacht Azure","preview":"/templates/yacht-azure.jpg"}]'::jsonb,
    '["arianna_sales","voice_agent_dispatch","ai_route_optimizer","ai_upsell","fleet_tracker"]'::jsonb,
    '["fleet_management","driver_tracking","booking_corse","quote_calculator","route_optimizer","whatsapp_dispatch","invoicing_b2b"]'::jsonb,
    '{"primary":"#D4AF37","accent":"#0a0a0a","background":"#0F0F0F"}'::jsonb,
    3),
  ('wellness-fitness', 'Wellness & Fitness Empire', 'wellness',
    ARRAY['palestra','yoga','pilates','crossfit','personal-trainer'],
    '[{"key":"energy-orange","name":"Energy Orange","preview":"/templates/energy.jpg"},{"key":"zen-sage","name":"Zen Sage","preview":"/templates/zen.jpg"}]'::jsonb,
    '["arianna_sales","voice_agent_booking","ai_class_optimizer","ai_loyalty","ai_reviews"]'::jsonb,
    '["class_schedule","membership_management","booking_classes","trainer_profiles","crm_clienti","whatsapp_reminders","payment_recurring"]'::jsonb,
    '{"primary":"#FF6B35","accent":"#1a1a1a","background":"#FAFAFA"}'::jsonb,
    4),
  ('retail-shop', 'Retail & E-Commerce Empire', 'retail',
    ARRAY['boutique','negozio','abbigliamento','accessori','gioielleria'],
    '[{"key":"luxury-gold","name":"Luxury Gold","preview":"/templates/retail-gold.jpg"},{"key":"clean-white","name":"Clean White","preview":"/templates/retail-white.jpg"}]'::jsonb,
    '["arianna_sales","ai_product_recommender","ai_upsell","ai_reviews","ai_inventory"]'::jsonb,
    '["catalogo_prodotti","ecommerce","inventory_management","customer_crm","whatsapp_orders","loyalty_program","invoicing"]'::jsonb,
    '{"primary":"#C8963E","accent":"#1a1a1a","background":"#FFFFFF"}'::jsonb,
    5),
  ('trades-services', 'Trades & Services Empire', 'trades',
    ARRAY['idraulico','elettricista','meccanico','muratore','giardiniere'],
    '[{"key":"professional-blue","name":"Professional Blue","preview":"/templates/trades-blue.jpg"},{"key":"industrial-orange","name":"Industrial Orange","preview":"/templates/trades-orange.jpg"}]'::jsonb,
    '["arianna_sales","voice_agent_quotes","ai_dispatcher","ai_invoicing","ai_reviews"]'::jsonb,
    '["quote_calculator","job_scheduling","staff_dispatch","invoicing_b2b","whatsapp_quotes","customer_crm","photo_gallery"]'::jsonb,
    '{"primary":"#1E40AF","accent":"#0a0a0a","background":"#F8FAFC"}'::jsonb,
    6),
  ('hospitality-hotel', 'Hospitality & Hotel Empire', 'hospitality',
    ARRAY['hotel','b&b','agriturismo','resort','villa'],
    '[{"key":"boutique-cream","name":"Boutique Cream","preview":"/templates/hotel-cream.jpg"},{"key":"resort-azure","name":"Resort Azure","preview":"/templates/hotel-azure.jpg"}]'::jsonb,
    '["mary_fiscal","arianna_sales","voice_agent_reception","ai_concierge","ai_reviews","ai_revenue_optimizer"]'::jsonb,
    '["booking_engine","calendar_rooms","check_in_out","concierge_service","whatsapp_guests","reviews_management","fiscal_compliance"]'::jsonb,
    '{"primary":"#5CC8D9","accent":"#08131F","background":"#E8D5A8"}'::jsonb,
    7),
  ('professional-services', 'Professional Services Empire', 'professional',
    ARRAY['avvocato','commercialista','consulente','architetto','notaio'],
    '[{"key":"corporate-navy","name":"Corporate Navy","preview":"/templates/pro-navy.jpg"},{"key":"elegant-bordeaux","name":"Elegant Bordeaux","preview":"/templates/pro-bordeaux.jpg"}]'::jsonb,
    '["arianna_sales","voice_agent_appointments","ai_document_assistant","ai_invoicing","ai_compliance"]'::jsonb,
    '["appointment_booking","client_portal","document_management","invoicing_b2b","whatsapp_clients","crm_clienti","secure_chat"]'::jsonb,
    '{"primary":"#1E3A8A","accent":"#0a0a0a","background":"#F8FAFC"}'::jsonb,
    8)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sub_sectors = EXCLUDED.sub_sectors,
  template_variants = EXCLUDED.template_variants,
  required_agents = EXCLUDED.required_agents,
  functional_modules = EXCLUDED.functional_modules,
  default_colors = EXCLUDED.default_colors,
  display_order = EXCLUDED.display_order,
  updated_at = now();