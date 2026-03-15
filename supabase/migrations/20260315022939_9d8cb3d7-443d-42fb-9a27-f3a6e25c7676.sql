
CREATE TABLE public.partner_demo_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sector text NOT NULL,
  client_name text NOT NULL,
  client_logo_url text,
  primary_color text DEFAULT '#C8963E',
  tagline text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.partner_demo_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own demo projects"
  ON public.partner_demo_projects
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
