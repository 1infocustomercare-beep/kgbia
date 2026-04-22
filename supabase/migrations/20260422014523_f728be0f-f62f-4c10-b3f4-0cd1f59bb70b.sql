-- ═══════════════════════════════════════════════════════════════
-- FASE 1.2: Setup payment tracking (setup_paid bloccante)
-- ═══════════════════════════════════════════════════════════════

-- 1) companies: add setup_paid + plan tracking
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS setup_paid BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS selected_plan TEXT,
  ADD COLUMN IF NOT EXISTS selected_installments INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS setup_paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS stripe_setup_session_id TEXT;

-- 2) restaurants: add same plan tracking (setup_paid already exists)
ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS selected_plan TEXT,
  ADD COLUMN IF NOT EXISTS selected_installments INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS setup_paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS stripe_setup_session_id TEXT;

-- 3) Indexes for fast lookup by user
CREATE INDEX IF NOT EXISTS idx_companies_owner_setup_paid
  ON public.companies(owner_id, setup_paid);

CREATE INDEX IF NOT EXISTS idx_restaurants_owner_setup_paid
  ON public.restaurants(owner_id, setup_paid);

-- 4) Helper function: is_setup_paid for the current user
--    Returns TRUE if:
--      - user is super_admin (bypass), OR
--      - user is partner/team_leader (bypass — they don't pay setup), OR
--      - user owns at least one company OR restaurant with setup_paid=true
CREATE OR REPLACE FUNCTION public.is_setup_paid(_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Super admin bypass
  IF public.has_role(_user_id, 'super_admin') THEN
    RETURN true;
  END IF;

  -- Partner / team leader bypass (they don't buy setup)
  IF public.has_role(_user_id, 'partner') OR public.has_role(_user_id, 'team_leader') THEN
    RETURN true;
  END IF;

  -- Check if user owns at least one paid company
  IF EXISTS (
    SELECT 1 FROM public.companies
    WHERE owner_id = _user_id AND setup_paid = true
  ) THEN
    RETURN true;
  END IF;

  -- Check if user owns at least one paid restaurant
  IF EXISTS (
    SELECT 1 FROM public.restaurants
    WHERE owner_id = _user_id AND setup_paid = true
  ) THEN
    RETURN true;
  END IF;

  -- Check via memberships (in case user is admin of a paid company they don't own)
  IF EXISTS (
    SELECT 1
    FROM public.company_memberships cm
    JOIN public.companies c ON c.id = cm.company_id
    WHERE cm.user_id = _user_id AND c.setup_paid = true
  ) THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

-- 5) Audit log for setup payments (for tracing)
CREATE TABLE IF NOT EXISTS public.setup_payment_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('company', 'restaurant')),
  entity_id UUID NOT NULL,
  plan TEXT,
  installments INTEGER DEFAULT 1,
  amount_cents INTEGER,
  currency TEXT DEFAULT 'eur',
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.setup_payment_log ENABLE ROW LEVEL SECURITY;

-- Only owner can see their own setup payment history
CREATE POLICY "Users view own setup payments"
  ON public.setup_payment_log
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_super_admin());

-- Only edge functions (service role) can insert/update — no client-side writes
-- (no INSERT/UPDATE policies = denied for authenticated users)

CREATE INDEX IF NOT EXISTS idx_setup_payment_log_user ON public.setup_payment_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_setup_payment_log_session ON public.setup_payment_log(stripe_session_id);