-- 1) Infrastructure costs catalog
CREATE TABLE IF NOT EXISTS public.infrastructure_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  category text NOT NULL DEFAULT 'other', -- ai_gateway, external_api, payments, storage, infra, other
  cost_model text NOT NULL DEFAULT 'variable', -- fixed_monthly | variable | per_call | per_unit
  unit text DEFAULT 'call', -- call, 1k_tokens, GB, transaction, month
  unit_cost_eur numeric(12,6) NOT NULL DEFAULT 0,
  monthly_estimate_eur numeric(12,2) DEFAULT 0,
  provider text,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.infrastructure_costs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin manage infrastructure_costs"
  ON public.infrastructure_costs
  FOR ALL TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "authenticated read infrastructure_costs"
  ON public.infrastructure_costs
  FOR SELECT TO authenticated
  USING (true);

-- 2) Audit log for cost changes
CREATE TABLE IF NOT EXISTS public.cost_catalog_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL, -- 'seller_action_costs' | 'infrastructure_costs'
  row_id uuid NOT NULL,
  action_code text,
  field_changed text NOT NULL,
  old_value text,
  new_value text,
  changed_by uuid REFERENCES auth.users(id),
  changed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cost_catalog_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin read cost_catalog_audit"
  ON public.cost_catalog_audit
  FOR SELECT TO authenticated
  USING (public.is_super_admin());

CREATE POLICY "super_admin insert cost_catalog_audit"
  ON public.cost_catalog_audit
  FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin());

-- 3) Trigger: audit on seller_action_costs updates
CREATE OR REPLACE FUNCTION public.audit_seller_action_costs()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.credit_cost IS DISTINCT FROM OLD.credit_cost THEN
    INSERT INTO public.cost_catalog_audit(table_name,row_id,action_code,field_changed,old_value,new_value,changed_by)
    VALUES('seller_action_costs',NEW.id,NEW.action,'credit_cost',OLD.credit_cost::text,NEW.credit_cost::text,auth.uid());
  END IF;
  IF NEW.cost_eur_estimate IS DISTINCT FROM OLD.cost_eur_estimate THEN
    INSERT INTO public.cost_catalog_audit(table_name,row_id,action_code,field_changed,old_value,new_value,changed_by)
    VALUES('seller_action_costs',NEW.id,NEW.action,'cost_eur_estimate',OLD.cost_eur_estimate::text,NEW.cost_eur_estimate::text,auth.uid());
  END IF;
  IF NEW.is_active IS DISTINCT FROM OLD.is_active THEN
    INSERT INTO public.cost_catalog_audit(table_name,row_id,action_code,field_changed,old_value,new_value,changed_by)
    VALUES('seller_action_costs',NEW.id,NEW.action,'is_active',OLD.is_active::text,NEW.is_active::text,auth.uid());
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_seller_action_costs ON public.seller_action_costs;
CREATE TRIGGER trg_audit_seller_action_costs
BEFORE UPDATE ON public.seller_action_costs
FOR EACH ROW EXECUTE FUNCTION public.audit_seller_action_costs();

-- 4) Trigger: audit on infrastructure_costs updates
CREATE OR REPLACE FUNCTION public.audit_infrastructure_costs()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.unit_cost_eur IS DISTINCT FROM OLD.unit_cost_eur THEN
    INSERT INTO public.cost_catalog_audit(table_name,row_id,action_code,field_changed,old_value,new_value,changed_by)
    VALUES('infrastructure_costs',NEW.id,NEW.code,'unit_cost_eur',OLD.unit_cost_eur::text,NEW.unit_cost_eur::text,auth.uid());
  END IF;
  IF NEW.monthly_estimate_eur IS DISTINCT FROM OLD.monthly_estimate_eur THEN
    INSERT INTO public.cost_catalog_audit(table_name,row_id,action_code,field_changed,old_value,new_value,changed_by)
    VALUES('infrastructure_costs',NEW.id,NEW.code,'monthly_estimate_eur',OLD.monthly_estimate_eur::text,NEW.monthly_estimate_eur::text,auth.uid());
  END IF;
  IF NEW.is_active IS DISTINCT FROM OLD.is_active THEN
    INSERT INTO public.cost_catalog_audit(table_name,row_id,action_code,field_changed,old_value,new_value,changed_by)
    VALUES('infrastructure_costs',NEW.id,NEW.code,'is_active',OLD.is_active::text,NEW.is_active::text,auth.uid());
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_infrastructure_costs ON public.infrastructure_costs;
CREATE TRIGGER trg_audit_infrastructure_costs
BEFORE UPDATE ON public.infrastructure_costs
FOR EACH ROW EXECUTE FUNCTION public.audit_infrastructure_costs();

-- 5) Seed baseline infra costs
INSERT INTO public.infrastructure_costs (code,label,category,cost_model,unit,unit_cost_eur,monthly_estimate_eur,provider,notes) VALUES
  ('lovable_ai_gemini_flash','Lovable AI · Gemini Flash','ai_gateway','per_unit','1k_tokens',0.0003,0,'Lovable Gateway','Token input+output'),
  ('lovable_ai_gemini_pro','Lovable AI · Gemini Pro','ai_gateway','per_unit','1k_tokens',0.0050,0,'Lovable Gateway','Modello Pro'),
  ('lovable_ai_gpt5','Lovable AI · GPT-5','ai_gateway','per_unit','1k_tokens',0.0150,0,'Lovable Gateway','Reasoning premium'),
  ('lovable_ai_nano_banana_pro','Lovable AI · Nano Banana Pro (immagini)','ai_gateway','per_call','image',0.040,0,'Lovable Gateway','Image gen 8K'),
  ('firecrawl_scrape','Firecrawl · scrape singolo','external_api','per_call','call',0.005,0,'Firecrawl','Per pagina'),
  ('firecrawl_crawl','Firecrawl · crawl sito','external_api','per_call','crawl',0.030,0,'Firecrawl','Crawl multi-pagina'),
  ('elevenlabs_tts','ElevenLabs · TTS Arianna','external_api','per_unit','1k_chars',0.150,0,'ElevenLabs','Voce Arianna'),
  ('stripe_fee','Stripe · commissione standard','payments','variable','transaction',0.015,0,'Stripe','1.5% medio EU+IT'),
  ('supabase_storage','Storage Supabase','storage','fixed_monthly','GB',0.021,0,'Supabase','Per GB/mese'),
  ('supabase_egress','Bandwidth egress','storage','per_unit','GB',0.090,0,'Supabase','Trasferimento dati'),
  ('supabase_db','Database Supabase Pro','infra','fixed_monthly','month',25.000,25,'Supabase','Piano base')
ON CONFLICT (code) DO NOTHING;