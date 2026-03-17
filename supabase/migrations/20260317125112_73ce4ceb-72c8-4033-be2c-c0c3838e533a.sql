
-- Command Audit Log: tracks every AI-executed command per tenant
CREATE TABLE public.command_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  tenant_type TEXT NOT NULL DEFAULT 'restaurant', -- 'restaurant' or 'company'
  resource_id UUID NOT NULL, -- restaurant_id or company_id
  source TEXT NOT NULL DEFAULT 'whatsapp', -- 'whatsapp' | 'chat'
  sender_phone TEXT,
  raw_command TEXT NOT NULL,
  parsed_intent JSONB NOT NULL DEFAULT '{}',
  actions_executed JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'executed' | 'failed' | 'rejected'
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.command_audit_log ENABLE ROW LEVEL SECURITY;

-- Owner can see their own command logs
CREATE POLICY "Owner sees own command logs" ON public.command_audit_log
  FOR SELECT TO authenticated
  USING (tenant_id = auth.uid());

-- Super admin sees all
CREATE POLICY "Super admin sees all command logs" ON public.command_audit_log
  FOR SELECT TO authenticated
  USING (public.is_super_admin());

-- Service role inserts (edge functions)
CREATE POLICY "Service inserts command logs" ON public.command_audit_log
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Index for fast tenant lookups
CREATE INDEX idx_command_audit_tenant ON public.command_audit_log(tenant_id, created_at DESC);
CREATE INDEX idx_command_audit_resource ON public.command_audit_log(resource_id, created_at DESC);
