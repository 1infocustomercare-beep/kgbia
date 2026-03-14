-- Create a food company for imperioroma@test.com
INSERT INTO public.companies (name, slug, industry, owner_id, primary_color, tagline, email)
VALUES (
  'Impero Roma',
  'impero-roma-owner',
  'food',
  'b8a2ce63-b536-4e44-9f85-3ccacc9ed86a',
  '#C8963E',
  'La cucina romana autentica',
  'imperioroma@test.com'
);

-- Create membership for imperioroma@test.com
INSERT INTO public.company_memberships (user_id, company_id, role)
SELECT 
  'b8a2ce63-b536-4e44-9f85-3ccacc9ed86a',
  id,
  'admin'
FROM public.companies WHERE slug = 'impero-roma-owner';