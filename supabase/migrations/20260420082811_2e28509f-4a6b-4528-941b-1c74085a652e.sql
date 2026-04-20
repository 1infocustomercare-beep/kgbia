ALTER TABLE public.sales_agent_config 
ADD COLUMN IF NOT EXISTS preferred_email_template_id text DEFAULT NULL;

COMMENT ON COLUMN public.sales_agent_config.preferred_email_template_id IS 'Override manuale del template Aurora email (NULL = AI auto-pick)';