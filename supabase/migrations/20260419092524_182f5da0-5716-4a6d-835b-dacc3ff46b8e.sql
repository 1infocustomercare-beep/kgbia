-- ============================================
-- SALES AGENT "ARIANNA" - AUTONOMOUS SELLER
-- ============================================

-- 1) Configurazione per utente
CREATE TABLE public.sales_agent_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT false,
  autonomy_mode text NOT NULL DEFAULT 'semi_auto', -- semi_auto | full_auto | guardrail
  channels_enabled jsonb NOT NULL DEFAULT '{"email":true,"whatsapp":false,"linkedin":false,"instagram":false,"voice":false}'::jsonb,
  daily_limits jsonb NOT NULL DEFAULT '{"new_leads":20,"messages":50,"calls":10,"follow_ups":30}'::jsonb,
  operating_hours jsonb NOT NULL DEFAULT '{"start":"09:00","end":"19:00","timezone":"Europe/Rome","days":[1,2,3,4,5]}'::jsonb,
  target_sectors text[] DEFAULT ARRAY[]::text[],
  target_cities text[] DEFAULT ARRAY[]::text[],
  voice_tone text NOT NULL DEFAULT 'professional_friendly',
  signature text,
  email_from text,
  whatsapp_from text,
  total_jobs_run integer NOT NULL DEFAULT 0,
  total_messages_sent integer NOT NULL DEFAULT 0,
  total_meetings_booked integer NOT NULL DEFAULT 0,
  total_conversions integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2) Job autonomi
CREATE TABLE public.sales_agent_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  job_type text NOT NULL, -- hunt | enrich | qualify | outreach | follow_up | book_call | close
  status text NOT NULL DEFAULT 'queued', -- queued | running | waiting_approval | completed | failed | cancelled
  priority integer NOT NULL DEFAULT 5,
  trigger_source text NOT NULL DEFAULT 'cron', -- cron | manual | event
  input_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  output_payload jsonb,
  lead_id uuid,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  duration_ms integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_sales_agent_jobs_owner_status ON public.sales_agent_jobs(owner_id, status, priority DESC, created_at);

-- 3) Azioni tracciate (timeline cinematica)
CREATE TABLE public.sales_agent_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  job_id uuid REFERENCES public.sales_agent_jobs(id) ON DELETE CASCADE,
  lead_id uuid,
  action_type text NOT NULL, -- search | scrape | enrich | score | draft | send_email | send_whatsapp | send_linkedin | call | book | learn
  channel text, -- email | whatsapp | linkedin | instagram | voice | system
  status text NOT NULL DEFAULT 'pending', -- pending | running | success | failed | needs_approval
  title text NOT NULL,
  description text,
  payload jsonb DEFAULT '{}'::jsonb,
  result jsonb,
  duration_ms integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_sales_agent_actions_owner_created ON public.sales_agent_actions(owner_id, created_at DESC);
CREATE INDEX idx_sales_agent_actions_lead ON public.sales_agent_actions(lead_id);

-- 4) Coda approvazioni
CREATE TABLE public.sales_agent_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  action_id uuid REFERENCES public.sales_agent_actions(id) ON DELETE CASCADE,
  lead_id uuid,
  channel text NOT NULL,
  draft_subject text,
  draft_body text NOT NULL,
  reasoning text,
  recipient text,
  status text NOT NULL DEFAULT 'pending', -- pending | approved | edited | rejected | expired
  edited_body text,
  approved_at timestamptz,
  approved_by uuid,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_sales_agent_approvals_owner_status ON public.sales_agent_approvals(owner_id, status, created_at DESC);

-- 5) Memoria agente
CREATE TABLE public.sales_agent_knowledge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  lead_id uuid,
  knowledge_type text NOT NULL, -- lead_profile | objection_handled | closing_pattern | sector_insight | personal_note
  title text NOT NULL,
  content jsonb NOT NULL,
  confidence numeric DEFAULT 0.5,
  used_count integer NOT NULL DEFAULT 0,
  last_used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_sales_agent_knowledge_owner_lead ON public.sales_agent_knowledge(owner_id, lead_id);
CREATE INDEX idx_sales_agent_knowledge_type ON public.sales_agent_knowledge(owner_id, knowledge_type);

-- 6) Conversazioni cross-canale
CREATE TABLE public.sales_agent_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  lead_id uuid NOT NULL,
  channel text NOT NULL,
  direction text NOT NULL, -- outbound | inbound
  subject text,
  body text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  sent_by_agent boolean NOT NULL DEFAULT true,
  delivered_at timestamptz,
  read_at timestamptz,
  replied_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_sales_agent_conv_owner_lead ON public.sales_agent_conversations(owner_id, lead_id, created_at DESC);

-- ============================================
-- RLS
-- ============================================
ALTER TABLE public.sales_agent_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_agent_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_agent_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_agent_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_agent_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_agent_conversations ENABLE ROW LEVEL SECURITY;

-- Config
CREATE POLICY "owner manages own sales agent config" ON public.sales_agent_config
  FOR ALL USING (user_id = auth.uid() OR public.is_super_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_super_admin());

-- Jobs
CREATE POLICY "owner reads own jobs" ON public.sales_agent_jobs
  FOR SELECT USING (owner_id = auth.uid() OR public.is_super_admin());
CREATE POLICY "owner inserts own jobs" ON public.sales_agent_jobs
  FOR INSERT WITH CHECK (owner_id = auth.uid() OR public.is_super_admin());
CREATE POLICY "owner updates own jobs" ON public.sales_agent_jobs
  FOR UPDATE USING (owner_id = auth.uid() OR public.is_super_admin());

-- Actions
CREATE POLICY "owner reads own actions" ON public.sales_agent_actions
  FOR SELECT USING (owner_id = auth.uid() OR public.is_super_admin());
CREATE POLICY "owner inserts own actions" ON public.sales_agent_actions
  FOR INSERT WITH CHECK (owner_id = auth.uid() OR public.is_super_admin());
CREATE POLICY "owner updates own actions" ON public.sales_agent_actions
  FOR UPDATE USING (owner_id = auth.uid() OR public.is_super_admin());

-- Approvals
CREATE POLICY "owner manages own approvals" ON public.sales_agent_approvals
  FOR ALL USING (owner_id = auth.uid() OR public.is_super_admin())
  WITH CHECK (owner_id = auth.uid() OR public.is_super_admin());

-- Knowledge
CREATE POLICY "owner manages own knowledge" ON public.sales_agent_knowledge
  FOR ALL USING (owner_id = auth.uid() OR public.is_super_admin())
  WITH CHECK (owner_id = auth.uid() OR public.is_super_admin());

-- Conversations
CREATE POLICY "owner manages own conversations" ON public.sales_agent_conversations
  FOR ALL USING (owner_id = auth.uid() OR public.is_super_admin())
  WITH CHECK (owner_id = auth.uid() OR public.is_super_admin());

-- Triggers updated_at
CREATE TRIGGER trg_sales_agent_config_updated
  BEFORE UPDATE ON public.sales_agent_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales_agent_jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales_agent_actions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales_agent_approvals;