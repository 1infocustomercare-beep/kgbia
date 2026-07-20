
-- Platform settings key/value
CREATE TABLE public.platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.platform_settings TO authenticated, anon;
GRANT ALL ON public.platform_settings TO service_role;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.platform_settings FOR SELECT USING (true);
CREATE POLICY "settings admin write" ON public.platform_settings FOR ALL
  USING (has_role(auth.uid(),'super_admin') OR has_role(auth.uid(),'restaurant_admin'))
  WITH CHECK (has_role(auth.uid(),'super_admin') OR has_role(auth.uid(),'restaurant_admin'));
INSERT INTO public.platform_settings(key,value) VALUES ('default_commission_pct','15'::jsonb);

-- Sellers
CREATE TABLE public.sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  commission_pct NUMERIC NOT NULL DEFAULT 15,
  active BOOLEAN NOT NULL DEFAULT true,
  iban TEXT,
  fiscal_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.sellers TO authenticated;
GRANT SELECT ON public.sellers TO anon;
GRANT ALL ON public.sellers TO service_role;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sellers public read active" ON public.sellers FOR SELECT USING (active = true);
CREATE POLICY "seller manages own" ON public.sellers FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "admin manages sellers" ON public.sellers FOR ALL
  USING (has_role(auth.uid(),'super_admin')) WITH CHECK (has_role(auth.uid(),'super_admin'));

-- Base orders
CREATE TABLE public.base_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  business_name TEXT NOT NULL,
  sector TEXT,
  variant_id TEXT NOT NULL,
  brand_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  amount NUMERIC NOT NULL DEFAULT 1997,
  currency TEXT NOT NULL DEFAULT 'EUR',
  stripe_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  company_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.base_orders TO authenticated;
GRANT INSERT ON public.base_orders TO anon;
GRANT ALL ON public.base_orders TO service_role;
ALTER TABLE public.base_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "base_orders owner read" ON public.base_orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "base_orders owner insert" ON public.base_orders FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "base_orders seller read" ON public.base_orders FOR SELECT
  USING (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));
CREATE POLICY "base_orders admin all" ON public.base_orders FOR ALL
  USING (has_role(auth.uid(),'super_admin')) WITH CHECK (has_role(auth.uid(),'super_admin'));

-- Custom project briefs
CREATE TABLE public.custom_project_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE SET NULL,
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  sector TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  files_urls JSONB DEFAULT '[]'::jsonb,
  budget_range TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  assigned_amount NUMERIC,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.custom_project_briefs TO authenticated;
GRANT INSERT ON public.custom_project_briefs TO anon;
GRANT ALL ON public.custom_project_briefs TO service_role;
ALTER TABLE public.custom_project_briefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "briefs public insert" ON public.custom_project_briefs FOR INSERT WITH CHECK (true);
CREATE POLICY "briefs owner read" ON public.custom_project_briefs FOR SELECT USING (submitted_by = auth.uid());
CREATE POLICY "briefs seller read" ON public.custom_project_briefs FOR SELECT
  USING (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));
CREATE POLICY "briefs admin all" ON public.custom_project_briefs FOR ALL
  USING (has_role(auth.uid(),'super_admin')) WITH CHECK (has_role(auth.uid(),'super_admin'));

-- Seller commissions
CREATE TABLE public.seller_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL,
  source_id UUID NOT NULL,
  gross_amount NUMERIC NOT NULL,
  pct NUMERIC NOT NULL,
  commission_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.seller_commissions TO authenticated;
GRANT ALL ON public.seller_commissions TO service_role;
ALTER TABLE public.seller_commissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "commissions seller read" ON public.seller_commissions FOR SELECT
  USING (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));
CREATE POLICY "commissions admin all" ON public.seller_commissions FOR ALL
  USING (has_role(auth.uid(),'super_admin')) WITH CHECK (has_role(auth.uid(),'super_admin'));

-- Trigger: auto-generate commission when base_order becomes paid
CREATE OR REPLACE FUNCTION public.generate_base_order_commission()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_pct NUMERIC;
BEGIN
  IF NEW.seller_id IS NOT NULL AND NEW.status = 'paid' AND (OLD.status IS DISTINCT FROM 'paid') THEN
    SELECT commission_pct INTO v_pct FROM public.sellers WHERE id = NEW.seller_id;
    IF v_pct IS NULL THEN v_pct := 15; END IF;
    INSERT INTO public.seller_commissions(seller_id, source_type, source_id, gross_amount, pct, commission_amount)
    VALUES (NEW.seller_id, 'base_order', NEW.id, NEW.amount, v_pct, ROUND(NEW.amount * v_pct / 100, 2));
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_base_order_commission
AFTER UPDATE ON public.base_orders FOR EACH ROW EXECUTE FUNCTION public.generate_base_order_commission();

-- Trigger: updated_at
CREATE OR REPLACE FUNCTION public.tg_touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER trg_sellers_touch BEFORE UPDATE ON public.sellers FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER trg_base_orders_touch BEFORE UPDATE ON public.base_orders FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER trg_briefs_touch BEFORE UPDATE ON public.custom_project_briefs FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
