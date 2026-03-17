
-- Table for agent activation requests (tenant → super admin)
CREATE TABLE public.agent_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  tenant_name TEXT,
  tenant_type TEXT DEFAULT 'restaurant',
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE NOT NULL,
  requested_by UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

ALTER TABLE public.agent_requests ENABLE ROW LEVEL SECURITY;

-- Tenant can see own requests
CREATE POLICY "Users can view own agent requests"
ON public.agent_requests FOR SELECT
TO authenticated
USING (requested_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));

-- Tenant can create requests
CREATE POLICY "Users can create agent requests"
ON public.agent_requests FOR INSERT
TO authenticated
WITH CHECK (requested_by = auth.uid());

-- Super admin can update requests
CREATE POLICY "Super admin can update agent requests"
ON public.agent_requests FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_requests;
