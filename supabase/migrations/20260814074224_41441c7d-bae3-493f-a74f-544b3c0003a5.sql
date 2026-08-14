CREATE TABLE public.website_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  business TEXT NOT NULL,
  contact TEXT NOT NULL,
  sector TEXT,
  project_type TEXT,
  message TEXT,
  source TEXT NOT NULL DEFAULT 'homepage',
  privacy_consent BOOLEAN NOT NULL DEFAULT false,
  consent_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.website_inquiries TO anon;
GRANT INSERT ON public.website_inquiries TO authenticated;
GRANT SELECT, UPDATE ON public.website_inquiries TO authenticated;
GRANT ALL ON public.website_inquiries TO service_role;

ALTER TABLE public.website_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an inquiry with consent"
ON public.website_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (privacy_consent = true AND length(name) <= 120 AND length(business) <= 160 AND length(contact) <= 160);

CREATE POLICY "Super admins can read inquiries"
ON public.website_inquiries
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'::public.app_role));

CREATE POLICY "Super admins can update inquiries"
ON public.website_inquiries
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'::public.app_role));

CREATE INDEX website_inquiries_created_at_idx ON public.website_inquiries (created_at DESC);