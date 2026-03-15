-- Site asset slots: maps a slot key to a custom URL (override bundled assets)
CREATE TABLE public.site_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_key TEXT UNIQUE NOT NULL, -- e.g. 'landing.hero_video', 'landing.sector_food', 'agent.header_concierge'
  label TEXT NOT NULL,
  section TEXT NOT NULL DEFAULT 'landing', -- landing, agents, sectors, ncc, general
  asset_type TEXT NOT NULL DEFAULT 'image', -- image, video
  url TEXT, -- custom URL (storage or external). NULL = use bundled default
  default_file TEXT, -- reference to bundled file in /src/assets/
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_assets ENABLE ROW LEVEL SECURITY;

-- Only super admins can manage site assets
CREATE POLICY "Super admins can manage site_assets"
  ON public.site_assets FOR ALL
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Anyone can read (landing page is public)
CREATE POLICY "Public can read site_assets"
  ON public.site_assets FOR SELECT
  TO anon, authenticated
  USING (true);

-- Seed all slots with defaults
INSERT INTO public.site_assets (slot_key, label, section, asset_type, default_file) VALUES
  -- Landing Hero
  ('landing.hero_video', 'Video Hero Principale', 'landing', 'video', 'video-hero-empire.mp4'),
  ('landing.hero_image', 'Immagine Hero Fallback', 'landing', 'image', 'hero-landing.jpg'),
  ('landing.hero_tech', 'Hero Tech Command', 'landing', 'image', 'hero-tech-command.jpg'),
  ('landing.hero_ai', 'Hero AI Platform', 'landing', 'image', 'hero-ai-platform.jpg'),
  ('landing.hero_partner', 'Hero Partner Luxury', 'landing', 'image', 'hero-partner-luxury.jpg'),
  -- Mockups
  ('landing.mockup_cliente', 'Mockup Cliente', 'landing', 'image', 'mockup-cliente.jpg'),
  ('landing.mockup_admin', 'Mockup Admin', 'landing', 'image', 'mockup-admin.jpg'),
  ('landing.mockup_cucina', 'Mockup Cucina', 'landing', 'image', 'mockup-cucina.jpg'),
  -- Sector images
  ('landing.sector_food', 'Settore Food', 'sectors', 'image', 'cartoon-sector-food.png'),
  ('landing.sector_ncc', 'Settore NCC', 'sectors', 'image', 'cartoon-sector-ncc.png'),
  ('landing.sector_beauty', 'Settore Beauty', 'sectors', 'image', 'cartoon-sector-beauty.png'),
  ('landing.sector_healthcare', 'Settore Healthcare', 'sectors', 'image', 'cartoon-sector-healthcare.png'),
  ('landing.sector_retail', 'Settore Retail', 'sectors', 'image', 'cartoon-sector-retail.png'),
  ('landing.sector_fitness', 'Settore Fitness', 'sectors', 'image', 'cartoon-sector-fitness.png'),
  ('landing.sector_hotel', 'Settore Hotel', 'sectors', 'image', 'cartoon-sector-hotel.png'),
  -- NCC
  ('landing.ncc_hero_bg', 'NCC Hero Background', 'ncc', 'image', 'ncc-hero-bg-amalfi.jpg'),
  ('landing.ncc_premium_coast', 'NCC Premium Coast', 'ncc', 'image', 'ncc-premium-coast.jpg'),
  ('landing.ncc_premium_interior', 'NCC Premium Interior', 'ncc', 'image', 'ncc-premium-interior.jpg'),
  ('landing.ncc_fleet', 'NCC Fleet Showcase', 'ncc', 'image', 'ncc-fleet-showcase.jpg'),
  -- Agent headers
  ('agent.header_concierge', 'Agente Concierge', 'agents', 'image', 'agent-concierge-ai.png'),
  ('agent.header_analytics', 'Agente Analytics', 'agents', 'image', 'agent-analytics-brain.png'),
  ('agent.header_sales', 'Agente Sales', 'agents', 'image', 'agent-sales-closer.png'),
  ('agent.header_compliance', 'Agente Compliance', 'agents', 'image', 'agent-compliance-guardian.png'),
  ('agent.header_voice', 'Agente Voice Atlas', 'agents', 'image', 'agent-atlas-voice.png'),
  ('agent.header_social', 'Agente Social Manager', 'agents', 'image', 'agent-social-manager.png'),
  ('agent.header_inventory', 'Agente Inventario', 'agents', 'image', 'agent-inventory.png'),
  ('agent.header_document', 'Agente Document AI', 'agents', 'image', 'agent-document-ai.png'),
  ('agent.header_menu_ocr', 'Agente Menu OCR', 'agents', 'image', 'agent-menu-ocr.png'),
  ('agent.header_photo_gen', 'Agente Photo Gen', 'agents', 'image', 'agent-photo-gen.png'),
  ('agent.header_translator', 'Agente Translator', 'agents', 'image', 'agent-translator.png'),
  ('agent.header_tts', 'Agente TTS', 'agents', 'image', 'agent-tts.png'),
  ('agent.header_notifier', 'Agente Smart Notifier', 'agents', 'image', 'agent-smart-notifier.png'),
  ('agent.header_empire', 'Agente Empire Assistant', 'agents', 'image', 'agent-empire-assistant.png'),
  ('agent.header_ops_food', 'Agente Ops Food', 'agents', 'image', 'agent-ops-food.png'),
  ('agent.header_ops_beauty', 'Agente Ops Beauty', 'agents', 'image', 'agent-ops-beauty.png'),
  ('agent.header_ops_healthcare', 'Agente Ops Healthcare', 'agents', 'image', 'agent-ops-healthcare.png'),
  ('agent.header_ops_ncc', 'Agente Ops NCC', 'agents', 'image', 'agent-ops-ncc.png'),
  ('agent.header_ops_construction', 'Agente Ops Construction', 'agents', 'image', 'agent-ops-construction.png'),
  -- Hub mascot
  ('agent.hub_hero', 'Hub Hero Mascotte', 'agents', 'image', 'agent-hub-hero-animated.png'),
  ('agent.hub_mascot_3d', 'Hub Mascotte 3D', 'agents', 'image', 'agent-hub-mascot-3d.png');
