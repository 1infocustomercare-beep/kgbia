
-- AI Usage Logs table
CREATE TABLE public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE SET NULL,
  agent_name TEXT NOT NULL,
  model_used TEXT,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  cost_usd DECIMAL(10,6) DEFAULT 0,
  duration_ms INTEGER,
  status TEXT DEFAULT 'success',
  is_test BOOLEAN DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI Agent Configs table
CREATE TABLE public.ai_agent_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT UNIQUE NOT NULL,
  display_name TEXT,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#C8963E',
  is_enabled BOOLEAN DEFAULT true,
  max_calls_per_hour INTEGER DEFAULT 100,
  max_monthly_budget_usd DECIMAL(10,2),
  allowed_industries TEXT[] DEFAULT '{}',
  system_prompt_override TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI Alerts table
CREATE TABLE public.ai_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL DEFAULT 'info',
  agent_name TEXT,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agent_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins manage ai_usage_logs" ON public.ai_usage_logs FOR ALL USING (public.is_super_admin());
CREATE POLICY "Service role inserts logs" ON public.ai_usage_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Super admins manage ai_agent_configs" ON public.ai_agent_configs FOR ALL USING (public.is_super_admin());
CREATE POLICY "Anyone reads agent configs" ON public.ai_agent_configs FOR SELECT USING (true);

CREATE POLICY "Super admins manage ai_alerts" ON public.ai_alerts FOR ALL USING (public.is_super_admin());

-- Seed agent configs
INSERT INTO public.ai_agent_configs (agent_name, display_name, description, icon, color, allowed_industries) VALUES
  ('empire-assistant', 'Empire Assistant', 'Chatbot IA contestuale per supporto tecnico, analisi dati aziendali e consigli di gestione. Accede a ordini, menu, prenotazioni in tempo reale.', 'Brain', '#C8963E', '{food,ncc,beauty,healthcare,retail,fitness,hospitality}'),
  ('ai-menu-ocr', 'Menu AI — OCR', 'Scansiona foto di menu cartacei ed estrae automaticamente piatti, descrizioni, prezzi e categorie con OCR multimodale.', 'ScanLine', '#F97316', '{food}'),
  ('ai-menu-image', 'Menu AI — Generatore Foto', 'Genera immagini food-porn iper-realistiche per ogni piatto del menu, con styling adattivo per categoria (pizza, pasta, dolci, ecc.).', 'Camera', '#EF4444', '{food}'),
  ('ai-translate', 'Traduttore Menu IA', 'Traduce automaticamente il menu in 10+ lingue con terminologia gastronomica naturale e appetitosa, non letterale.', 'Globe', '#3B82F6', '{food}'),
  ('ai-inventory', 'Inventario Predittivo IA', 'Analizza ordini recenti e menu per prevedere scorte in esaurimento e suggerire il Piatto del Giorno con ingredienti in eccesso.', 'Package', '#8B5CF6', '{food}');
