-- Create a demo restaurant for cliente-food@empire-test.com
INSERT INTO public.restaurants (id, name, slug, owner_id, tagline, primary_color, phone, address, city, email, is_active, policy_accepted, policy_accepted_at, setup_paid)
VALUES (
  gen_random_uuid(),
  'Trattoria Demo Empire',
  'trattoria-demo-empire',
  '7fc2c53c-a0fe-4698-868a-3e3a157bcea7',
  'La cucina italiana autentica',
  '#C8963E',
  '+39 06 1234 5678',
  'Via Roma 10',
  'Roma',
  'cliente-food@empire-test.com',
  true,
  true,
  now(),
  true
);