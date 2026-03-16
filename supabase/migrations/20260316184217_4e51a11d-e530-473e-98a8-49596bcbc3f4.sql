
-- 1. whatsapp_templates table
CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  template_name text,
  language text DEFAULT 'it',
  category text DEFAULT 'system',
  body_text text NOT NULL,
  header_text text,
  footer_text text,
  buttons jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'pending',
  meta_template_id text,
  created_at timestamptz DEFAULT now()
);

-- Validation trigger for category
CREATE OR REPLACE FUNCTION public.validate_whatsapp_template_fields()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF NEW.category NOT IN ('welcome','booking','alert','promo','system','menu_update') THEN
    NEW.category := 'system';
  END IF;
  IF NEW.status NOT IN ('pending','approved','rejected') THEN
    NEW.status := 'pending';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_whatsapp_template
  BEFORE INSERT OR UPDATE ON public.whatsapp_templates
  FOR EACH ROW EXECUTE FUNCTION public.validate_whatsapp_template_fields();

ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own templates" ON public.whatsapp_templates
  FOR ALL TO authenticated
  USING (tenant_id = auth.uid() OR public.is_super_admin())
  WITH CHECK (tenant_id = auth.uid() OR public.is_super_admin());

-- 2. ai_agent_prompts table
CREATE TABLE IF NOT EXISTS public.ai_agent_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  industry_type text NOT NULL,
  agent_name text NOT NULL,
  prompt_text text NOT NULL,
  capabilities jsonb DEFAULT '[]'::jsonb,
  blocked_capabilities jsonb DEFAULT '[]'::jsonb,
  autonomy_level integer DEFAULT 8,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.ai_agent_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own prompts" ON public.ai_agent_prompts
  FOR ALL TO authenticated
  USING (tenant_id = auth.uid() OR public.is_super_admin())
  WITH CHECK (tenant_id = auth.uid() OR public.is_super_admin());
