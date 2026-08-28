ALTER TABLE public.company_settings
  ADD COLUMN IF NOT EXISTS customer_type text NOT NULL DEFAULT 'b2b',
  ADD COLUMN IF NOT EXISTS fiscal_code text,
  ADD COLUMN IF NOT EXISTS sdi_code text,
  ADD COLUMN IF NOT EXISTS pec text;

ALTER TABLE public.company_settings
  DROP CONSTRAINT IF EXISTS company_settings_customer_type_check;
ALTER TABLE public.company_settings
  ADD CONSTRAINT company_settings_customer_type_check CHECK (customer_type IN ('b2b','b2c'));