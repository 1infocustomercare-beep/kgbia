
-- Subscription plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0,
  base_features JSONB DEFAULT '[]',
  ai_tokens INTEGER DEFAULT 50,
  max_team_members INTEGER DEFAULT 2,
  custom_domain BOOLEAN DEFAULT false,
  priority_support BOOLEAN DEFAULT false,
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Subscription modules (add-ons)
CREATE TABLE IF NOT EXISTS public.subscription_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  price_monthly DECIMAL(10,2) DEFAULT 0,
  compatible_sectors TEXT[] DEFAULT '{}',
  is_base_feature BOOLEAN DEFAULT false,
  stripe_price_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tenant subscriptions
CREATE TABLE IF NOT EXISTS public.tenant_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.subscription_plans(id) NOT NULL,
  active_modules UUID[] DEFAULT '{}',
  billing_cycle TEXT DEFAULT 'monthly',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  renews_at TIMESTAMP WITH TIME ZONE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'trialing',
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '14 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI token usage tracking
CREATE TABLE IF NOT EXISTS public.ai_token_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  feature TEXT NOT NULL,
  tokens_used INTEGER NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_token_usage ENABLE ROW LEVEL SECURITY;

-- Public read for plans and modules
CREATE POLICY "Anyone can read plans" ON public.subscription_plans FOR SELECT USING (true);
CREATE POLICY "Anyone can read modules" ON public.subscription_modules FOR SELECT USING (true);

-- Tenant subscriptions: members can read their own
CREATE POLICY "Members read own subscription" ON public.tenant_subscriptions FOR SELECT TO authenticated
  USING (company_id IN (SELECT company_id FROM public.company_memberships WHERE user_id = auth.uid()));

CREATE POLICY "Members read own token usage" ON public.ai_token_usage FOR SELECT TO authenticated
  USING (company_id IN (SELECT company_id FROM public.company_memberships WHERE user_id = auth.uid()));

CREATE POLICY "Members insert token usage" ON public.ai_token_usage FOR INSERT TO authenticated
  WITH CHECK (company_id IN (SELECT company_id FROM public.company_memberships WHERE user_id = auth.uid()));

-- Seed subscription plans
INSERT INTO public.subscription_plans (name, display_name, price_monthly, price_yearly, ai_tokens, max_team_members, custom_domain, priority_support, base_features) VALUES
('starter', '🥉 Starter', 29, 24, 50, 2, false, false, '["Sito pubblico", "Dashboard base", "CRM clienti", "Prenotazioni", "1 utente staff"]'),
('professional', '🥈 Professional', 59, 49, 200, 10, true, true, '["Tutto Starter", "Automazioni", "Multi-staff", "Dominio custom", "Report avanzati", "Supporto prioritario"]'),
('empire_pro', '🥇 Empire Pro', 99, 79, 500, 999, true, true, '["Tutto Professional", "IA illimitata", "API access", "White-label", "Account manager dedicato", "Sviluppo custom"]')
ON CONFLICT DO NOTHING;

-- Seed modules
INSERT INTO public.subscription_modules (name, display_name, description, icon, price_monthly, compatible_sectors, is_base_feature) VALUES
('crm', 'CRM Clienti', 'Gestione clienti avanzata con storico e analytics', 'Users', 0, '{}', true),
('bookings', 'Prenotazioni', 'Sistema prenotazioni con calendario e conferme', 'Calendar', 0, '{}', true),
('reviews', 'Recensioni', 'Gestione recensioni con risposte automatiche IA', 'Star', 5, '{}', false),
('automations', 'Automazioni', 'Email e WhatsApp automatici per eventi', 'Zap', 9, '{}', false),
('ai_menu', 'IA Menu', 'Descrizioni e traduzioni menu con IA', 'Sparkles', 5, '{food,bakery,hospitality}', false),
('ai_seo', 'IA SEO', 'Generazione testi SEO automatica', 'Search', 5, '{}', false),
('haccp', 'HACCP', 'Registro HACCP digitale con alert scadenze', 'Shield', 9, '{food,bakery,hospitality}', false),
('inventory', 'Magazzino', 'Gestione inventario con alert scorte', 'Package', 9, '{food,bakery,retail}', false),
('payroll', 'Buste Paga', 'Gestione turni e calcolo buste paga', 'Wallet', 15, '{}', false),
('social', 'Social Media', 'Pianificazione e pubblicazione post social', 'Share2', 9, '{}', false)
ON CONFLICT DO NOTHING;

-- Enable realtime for tenant_subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE public.tenant_subscriptions;
