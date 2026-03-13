-- Link demo accounts to their respective companies
-- cliente-ncc → Autonoleggio Telese (telese-viaggi)
INSERT INTO public.company_memberships (user_id, company_id, role)
VALUES 
  ('6d37a503-a372-464c-b101-1ed2d9fdfea5', '76e723cb-df46-49e8-a811-155ff5ce0dc5', 'admin'),
  -- cliente-beauty → Glow Beauty Studio
  ('b213e27c-f9ee-40d2-a44f-575d2f2130b0', '021aa7da-88ce-450a-be16-7093ebf3417f', 'admin'),
  -- cliente-beach → Lido Azzurro
  ('4d9aac09-b066-4dab-9852-7fbe2af0996c', 'cd2d2e91-c941-4f98-8267-b4c3f3c75f52', 'admin'),
  -- cliente-hotel → Villa Belvedere B&B
  ('d16e886c-ac91-41b6-90c6-fbc40f5ba4af', '9b8264a3-b885-47f6-a3f7-a04b4dbb3a8d', 'admin'),
  -- cliente-healthcare → Studio Medico Salus
  ('bae795e5-c6da-4a90-9a39-f086b9adaeca', '5188f1d1-a5d0-42ac-afb6-8a38ddf095e5', 'admin'),
  -- cliente-events → Dream Events
  ('006fcb0d-4381-48db-8ca9-c9c7112fa6c8', 'b2ea34db-8f9c-421c-b98d-05b046a73a8c', 'admin'),
  -- cliente-garage → Autofficina Rossi
  ('3e19344b-3471-4e96-b4cb-215abe385d35', '571bf904-a518-42f3-bb57-700cc0f2561d', 'admin'),
  -- cliente-legal → Studio Legale Martini
  ('e3aaad2e-d412-42f6-94a3-303f24490fa1', '47cf2604-f1e6-4ebd-bc40-41508e632d2f', 'admin')
ON CONFLICT (id) DO NOTHING;