
-- ═══════════════════════════════════════════════════════════════
-- EMPIRE AUTOPILOT OS — Schema Fase 1
-- ═══════════════════════════════════════════════════════════════

-- ── 1. PAIN SCANS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pain_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  lead_id UUID,
  source_url TEXT NOT NULL,
  domain TEXT NOT NULL,
  domain_hash TEXT NOT NULL,
  sector TEXT,
  pain_score INTEGER NOT NULL DEFAULT 0,
  pain_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  technical_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  competitive_signals JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_summary TEXT,
  ai_model TEXT NOT NULL DEFAULT 'google/gemini-2.5-pro',
  cost_cents INTEGER DEFAULT 0,
  duration_ms INTEGER,
  status TEXT NOT NULL DEFAULT 'completed',
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days')
);

CREATE INDEX idx_pain_scans_owner ON public.pain_scans(owner_id, created_at DESC);
CREATE INDEX idx_pain_scans_domain_hash ON public.pain_scans(domain_hash, expires_at);
CREATE INDEX idx_pain_scans_lead ON public.pain_scans(lead_id) WHERE lead_id IS NOT NULL;

-- ── 2. ROI CALCULATIONS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.roi_calculations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  lead_id UUID,
  pain_scan_id UUID REFERENCES public.pain_scans(id) ON DELETE SET NULL,
  monthly_loss_eur NUMERIC(10,2) NOT NULL DEFAULT 0,
  yearly_loss_eur NUMERIC(10,2) NOT NULL DEFAULT 0,
  empire_monthly_value_eur NUMERIC(10,2) NOT NULL DEFAULT 0,
  roi_percentage NUMERIC(8,2) NOT NULL DEFAULT 0,
  payback_months NUMERIC(5,2),
  scenario TEXT NOT NULL DEFAULT 'realistic',
  category_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  assumptions JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_narrative TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_roi_owner ON public.roi_calculations(owner_id, created_at DESC);
CREATE INDEX idx_roi_lead ON public.roi_calculations(lead_id) WHERE lead_id IS NOT NULL;

-- ── 3. AUTOPILOT CONVERSATIONS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.autopilot_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  lead_id UUID,
  pain_scan_id UUID REFERENCES public.pain_scans(id) ON DELETE SET NULL,
  roi_calculation_id UUID REFERENCES public.roi_calculations(id) ON DELETE SET NULL,
  channel TEXT NOT NULL DEFAULT 'chat',
  status TEXT NOT NULL DEFAULT 'active',
  funnel_stage TEXT NOT NULL DEFAULT 'discovery',
  sentiment TEXT DEFAULT 'neutral',
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  next_action TEXT,
  next_action_at TIMESTAMPTZ,
  last_ai_message_at TIMESTAMPTZ,
  last_lead_message_at TIMESTAMPTZ,
  shared_context JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_confidence NUMERIC(3,2) DEFAULT 0.5,
  closed_at TIMESTAMPTZ,
  closed_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_autopilot_conv_owner ON public.autopilot_conversations(owner_id, status, updated_at DESC);
CREATE INDEX idx_autopilot_conv_lead ON public.autopilot_conversations(lead_id) WHERE lead_id IS NOT NULL;
CREATE INDEX idx_autopilot_conv_next ON public.autopilot_conversations(next_action_at) WHERE next_action_at IS NOT NULL;

-- ── 4. AUTOPILOT MESSAGES ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.autopilot_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.autopilot_conversations(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  sender TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'chat',
  content TEXT NOT NULL,
  ai_metadata JSONB DEFAULT '{}'::jsonb,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_autopilot_msg_conv ON public.autopilot_messages(conversation_id, created_at);
CREATE INDEX idx_autopilot_msg_owner ON public.autopilot_messages(owner_id, created_at DESC);

-- ── 5. SALES COACH INSIGHTS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sales_coach_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  insight_type TEXT NOT NULL DEFAULT 'micro_action',
  priority TEXT NOT NULL DEFAULT 'medium',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_label TEXT,
  action_url TEXT,
  supporting_data JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_dismissed BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_coach_user ON public.sales_coach_insights(user_id, is_read, created_at DESC);

-- ── 6. SALES LEADERBOARD ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sales_leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  total_xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  badges JSONB NOT NULL DEFAULT '[]'::jsonb,
  deals_closed_month INTEGER NOT NULL DEFAULT 0,
  revenue_month_eur NUMERIC(12,2) NOT NULL DEFAULT 0,
  deals_closed_total INTEGER NOT NULL DEFAULT 0,
  revenue_total_eur NUMERIC(12,2) NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  global_rank INTEGER,
  sector_rank INTEGER,
  sector TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_leaderboard_xp ON public.sales_leaderboard(total_xp DESC);
CREATE INDEX idx_leaderboard_revenue ON public.sales_leaderboard(revenue_month_eur DESC);

-- ── 7. AUTOPILOT CONFIG ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.autopilot_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL UNIQUE,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  autonomy_level TEXT NOT NULL DEFAULT 'full',
  daily_scan_cap INTEGER NOT NULL DEFAULT 100,
  daily_scans_used INTEGER NOT NULL DEFAULT 0,
  scans_reset_at TIMESTAMPTZ NOT NULL DEFAULT (date_trunc('day', now()) + interval '1 day'),
  enabled_channels JSONB NOT NULL DEFAULT '["chat","email","whatsapp_link"]'::jsonb,
  target_sectors JSONB NOT NULL DEFAULT '[]'::jsonb,
  operating_hours JSONB NOT NULL DEFAULT '{"start":"09:00","end":"20:00","timezone":"Europe/Rome"}'::jsonb,
  ai_model TEXT NOT NULL DEFAULT 'google/gemini-2.5-pro',
  custom_instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.pain_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roi_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.autopilot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.autopilot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_coach_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.autopilot_config ENABLE ROW LEVEL SECURITY;

-- Helper: super admin check (re-uses existing pattern)
CREATE OR REPLACE FUNCTION public.is_autopilot_super_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = _user_id
      AND email IN ('kevin97bernardini@gmail.com', 'kevin97berardini@gmail.com')
  );
$$;

-- Pain scans policies
CREATE POLICY "owners read own pain_scans" ON public.pain_scans
  FOR SELECT USING (auth.uid() = owner_id OR public.is_autopilot_super_admin(auth.uid()));
CREATE POLICY "owners insert pain_scans" ON public.pain_scans
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "owners update own pain_scans" ON public.pain_scans
  FOR UPDATE USING (auth.uid() = owner_id OR public.is_autopilot_super_admin(auth.uid()));
CREATE POLICY "owners delete own pain_scans" ON public.pain_scans
  FOR DELETE USING (auth.uid() = owner_id OR public.is_autopilot_super_admin(auth.uid()));

-- ROI policies
CREATE POLICY "owners read own roi" ON public.roi_calculations
  FOR SELECT USING (auth.uid() = owner_id OR public.is_autopilot_super_admin(auth.uid()));
CREATE POLICY "owners insert roi" ON public.roi_calculations
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "owners update own roi" ON public.roi_calculations
  FOR UPDATE USING (auth.uid() = owner_id OR public.is_autopilot_super_admin(auth.uid()));
CREATE POLICY "owners delete own roi" ON public.roi_calculations
  FOR DELETE USING (auth.uid() = owner_id OR public.is_autopilot_super_admin(auth.uid()));

-- Conversations policies
CREATE POLICY "owners read own conversations" ON public.autopilot_conversations
  FOR SELECT USING (auth.uid() = owner_id OR public.is_autopilot_super_admin(auth.uid()));
CREATE POLICY "owners insert conversations" ON public.autopilot_conversations
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "owners update own conversations" ON public.autopilot_conversations
  FOR UPDATE USING (auth.uid() = owner_id OR public.is_autopilot_super_admin(auth.uid()));
CREATE POLICY "owners delete own conversations" ON public.autopilot_conversations
  FOR DELETE USING (auth.uid() = owner_id OR public.is_autopilot_super_admin(auth.uid()));

-- Messages policies
CREATE POLICY "owners read own messages" ON public.autopilot_messages
  FOR SELECT USING (auth.uid() = owner_id OR public.is_autopilot_super_admin(auth.uid()));
CREATE POLICY "owners insert messages" ON public.autopilot_messages
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "owners update own messages" ON public.autopilot_messages
  FOR UPDATE USING (auth.uid() = owner_id OR public.is_autopilot_super_admin(auth.uid()));

-- Coach insights policies
CREATE POLICY "users read own insights" ON public.sales_coach_insights
  FOR SELECT USING (auth.uid() = user_id OR public.is_autopilot_super_admin(auth.uid()));
CREATE POLICY "users insert own insights" ON public.sales_coach_insights
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_autopilot_super_admin(auth.uid()));
CREATE POLICY "users update own insights" ON public.sales_coach_insights
  FOR UPDATE USING (auth.uid() = user_id OR public.is_autopilot_super_admin(auth.uid()));
CREATE POLICY "users delete own insights" ON public.sales_coach_insights
  FOR DELETE USING (auth.uid() = user_id OR public.is_autopilot_super_admin(auth.uid()));

-- Leaderboard policies (everyone can read, only own row writable)
CREATE POLICY "anyone reads leaderboard" ON public.sales_leaderboard
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "users upsert own leaderboard row" ON public.sales_leaderboard
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_autopilot_super_admin(auth.uid()));
CREATE POLICY "users update own leaderboard row" ON public.sales_leaderboard
  FOR UPDATE USING (auth.uid() = user_id OR public.is_autopilot_super_admin(auth.uid()));

-- Config policies
CREATE POLICY "owners read own config" ON public.autopilot_config
  FOR SELECT USING (auth.uid() = owner_id OR public.is_autopilot_super_admin(auth.uid()));
CREATE POLICY "owners upsert own config" ON public.autopilot_config
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "owners update own config" ON public.autopilot_config
  FOR UPDATE USING (auth.uid() = owner_id OR public.is_autopilot_super_admin(auth.uid()));

-- ═══════════════════════════════════════════════════════════════
-- TRIGGERS updated_at
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER trg_touch_pain_scans BEFORE UPDATE ON public.pain_scans
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_touch_roi BEFORE UPDATE ON public.roi_calculations
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_touch_conv BEFORE UPDATE ON public.autopilot_conversations
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_touch_leaderboard BEFORE UPDATE ON public.sales_leaderboard
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_touch_config BEFORE UPDATE ON public.autopilot_config
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ═══════════════════════════════════════════════════════════════
-- HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

-- Cache lookup: returns most recent valid scan for a domain
CREATE OR REPLACE FUNCTION public.get_pain_scan_cached(_domain_hash TEXT, _owner_id UUID)
RETURNS SETOF public.pain_scans
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT * FROM public.pain_scans
  WHERE domain_hash = _domain_hash
    AND expires_at > now()
    AND status = 'completed'
    AND (owner_id = _owner_id OR public.is_autopilot_super_admin(_owner_id))
  ORDER BY created_at DESC
  LIMIT 1;
$$;

-- Award XP and level up logic
CREATE OR REPLACE FUNCTION public.award_xp(_user_id UUID, _amount INTEGER, _reason TEXT DEFAULT NULL)
RETURNS public.sales_leaderboard
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _row public.sales_leaderboard;
  _new_level INTEGER;
BEGIN
  INSERT INTO public.sales_leaderboard (user_id, total_xp, last_activity_at)
  VALUES (_user_id, GREATEST(_amount, 0), now())
  ON CONFLICT (user_id) DO UPDATE
    SET total_xp = sales_leaderboard.total_xp + GREATEST(_amount, 0),
        last_activity_at = now()
  RETURNING * INTO _row;

  -- Level formula: level = floor(sqrt(xp/100)) + 1, capped at 50
  _new_level := LEAST(50, GREATEST(1, FLOOR(SQRT(_row.total_xp::NUMERIC / 100.0))::INTEGER + 1));

  IF _new_level <> _row.level THEN
    UPDATE public.sales_leaderboard SET level = _new_level WHERE user_id = _user_id
    RETURNING * INTO _row;
  END IF;

  RETURN _row;
END $$;

-- Daily cap check + auto reset
CREATE OR REPLACE FUNCTION public.check_autopilot_daily_cap(_owner_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _cfg public.autopilot_config;
BEGIN
  SELECT * INTO _cfg FROM public.autopilot_config WHERE owner_id = _owner_id;

  IF NOT FOUND THEN
    INSERT INTO public.autopilot_config (owner_id) VALUES (_owner_id) RETURNING * INTO _cfg;
  END IF;

  -- Reset daily counter if needed
  IF _cfg.scans_reset_at <= now() THEN
    UPDATE public.autopilot_config
       SET daily_scans_used = 0,
           scans_reset_at = date_trunc('day', now()) + interval '1 day'
     WHERE owner_id = _owner_id
    RETURNING * INTO _cfg;
  END IF;

  -- Super admin bypass
  IF public.is_autopilot_super_admin(_owner_id) THEN RETURN TRUE; END IF;

  RETURN _cfg.daily_scans_used < _cfg.daily_scan_cap;
END $$;

-- Increment scan counter
CREATE OR REPLACE FUNCTION public.increment_autopilot_scan(_owner_id UUID)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.autopilot_config
     SET daily_scans_used = daily_scans_used + 1,
         updated_at = now()
   WHERE owner_id = _owner_id;
END $$;
