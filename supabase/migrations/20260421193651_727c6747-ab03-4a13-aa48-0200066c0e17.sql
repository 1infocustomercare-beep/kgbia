
CREATE TABLE IF NOT EXISTS public.tenant_login_unlock_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  slug text NOT NULL,
  email_lower text NOT NULL,
  token_hash text NOT NULL UNIQUE,
  ip_hash text,
  user_agent_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '15 minutes'),
  consumed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_tlut_slug_email
  ON public.tenant_login_unlock_tokens (slug, email_lower);

CREATE INDEX IF NOT EXISTS idx_tlut_expires
  ON public.tenant_login_unlock_tokens (expires_at);

ALTER TABLE public.tenant_login_unlock_tokens ENABLE ROW LEVEL SECURITY;

-- Deny-all from authenticated/anon clients; only service role bypasses RLS.
DROP POLICY IF EXISTS "tlut_no_client_access" ON public.tenant_login_unlock_tokens;
CREATE POLICY "tlut_no_client_access"
  ON public.tenant_login_unlock_tokens
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);
