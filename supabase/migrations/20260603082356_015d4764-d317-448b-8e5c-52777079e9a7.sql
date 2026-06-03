ALTER TABLE public.leads
  DROP COLUMN IF EXISTS demo_admin_password,
  DROP COLUMN IF EXISTS demo_admin_email;