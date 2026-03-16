
-- ══════════════════════════════════════════════════════════════
-- WhatsApp Orchestrator — Tables, RLS, Indexes
-- ══════════════════════════════════════════════════════════════

-- 1. whatsapp_config
CREATE TABLE public.whatsapp_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  phone_number_id text,
  whatsapp_business_account_id text,
  access_token text,
  webhook_verify_token text DEFAULT gen_random_uuid()::text,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.whatsapp_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "whatsapp_config_select" ON public.whatsapp_config FOR SELECT TO authenticated USING (tenant_id = auth.uid() OR public.is_super_admin());
CREATE POLICY "whatsapp_config_insert" ON public.whatsapp_config FOR INSERT TO authenticated WITH CHECK (tenant_id = auth.uid());
CREATE POLICY "whatsapp_config_update" ON public.whatsapp_config FOR UPDATE TO authenticated USING (tenant_id = auth.uid()) WITH CHECK (tenant_id = auth.uid());
CREATE POLICY "whatsapp_config_delete" ON public.whatsapp_config FOR DELETE TO authenticated USING (tenant_id = auth.uid());

-- 2. whatsapp_conversations
CREATE TABLE public.whatsapp_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  contact_phone text NOT NULL,
  contact_name text,
  sector text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  last_message_at timestamptz,
  context jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.validate_whatsapp_conversation_status()
RETURNS trigger LANGUAGE plpgsql SET search_path = 'public' AS $$
BEGIN
  IF NEW.status NOT IN ('active', 'archived', 'blocked') THEN
    NEW.status := 'active';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_wa_conv_status
  BEFORE INSERT OR UPDATE ON public.whatsapp_conversations
  FOR EACH ROW EXECUTE FUNCTION public.validate_whatsapp_conversation_status();

ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wa_conversations_select" ON public.whatsapp_conversations FOR SELECT TO authenticated USING (tenant_id = auth.uid() OR public.is_super_admin());
CREATE POLICY "wa_conversations_insert" ON public.whatsapp_conversations FOR INSERT TO authenticated WITH CHECK (tenant_id = auth.uid());
CREATE POLICY "wa_conversations_update" ON public.whatsapp_conversations FOR UPDATE TO authenticated USING (tenant_id = auth.uid()) WITH CHECK (tenant_id = auth.uid());
CREATE POLICY "wa_conversations_delete" ON public.whatsapp_conversations FOR DELETE TO authenticated USING (tenant_id = auth.uid());

-- 3. whatsapp_messages
CREATE TABLE public.whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL,
  direction text NOT NULL,
  message_type text NOT NULL DEFAULT 'text',
  content text NOT NULL,
  whatsapp_message_id text,
  status text NOT NULL DEFAULT 'sent',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.validate_whatsapp_message_fields()
RETURNS trigger LANGUAGE plpgsql SET search_path = 'public' AS $$
BEGIN
  IF NEW.direction NOT IN ('inbound', 'outbound') THEN
    RAISE EXCEPTION 'Invalid direction: %', NEW.direction;
  END IF;
  IF NEW.message_type NOT IN ('text', 'image', 'template', 'interactive', 'document') THEN
    NEW.message_type := 'text';
  END IF;
  IF NEW.status NOT IN ('sent', 'delivered', 'read', 'failed') THEN
    NEW.status := 'sent';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_wa_msg_fields
  BEFORE INSERT OR UPDATE ON public.whatsapp_messages
  FOR EACH ROW EXECUTE FUNCTION public.validate_whatsapp_message_fields();

ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wa_messages_select" ON public.whatsapp_messages FOR SELECT TO authenticated USING (tenant_id = auth.uid() OR public.is_super_admin());
CREATE POLICY "wa_messages_insert" ON public.whatsapp_messages FOR INSERT TO authenticated WITH CHECK (tenant_id = auth.uid());
CREATE POLICY "wa_messages_update" ON public.whatsapp_messages FOR UPDATE TO authenticated USING (tenant_id = auth.uid()) WITH CHECK (tenant_id = auth.uid());
CREATE POLICY "wa_messages_delete" ON public.whatsapp_messages FOR DELETE TO authenticated USING (tenant_id = auth.uid());

-- 4. whatsapp_notifications
CREATE TABLE public.whatsapp_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  notification_type text NOT NULL,
  recipient_phone text NOT NULL,
  template_name text,
  template_params jsonb DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending',
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.validate_whatsapp_notification_fields()
RETURNS trigger LANGUAGE plpgsql SET search_path = 'public' AS $$
BEGIN
  IF NEW.notification_type NOT IN ('welcome', 'booking', 'alert', 'promo', 'system') THEN
    RAISE EXCEPTION 'Invalid notification_type: %', NEW.notification_type;
  END IF;
  IF NEW.status NOT IN ('pending', 'sent', 'delivered', 'failed') THEN
    NEW.status := 'pending';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_wa_notif_fields
  BEFORE INSERT OR UPDATE ON public.whatsapp_notifications
  FOR EACH ROW EXECUTE FUNCTION public.validate_whatsapp_notification_fields();

ALTER TABLE public.whatsapp_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wa_notifications_select" ON public.whatsapp_notifications FOR SELECT TO authenticated USING (tenant_id = auth.uid() OR public.is_super_admin());
CREATE POLICY "wa_notifications_insert" ON public.whatsapp_notifications FOR INSERT TO authenticated WITH CHECK (tenant_id = auth.uid());
CREATE POLICY "wa_notifications_update" ON public.whatsapp_notifications FOR UPDATE TO authenticated USING (tenant_id = auth.uid()) WITH CHECK (tenant_id = auth.uid());
CREATE POLICY "wa_notifications_delete" ON public.whatsapp_notifications FOR DELETE TO authenticated USING (tenant_id = auth.uid());

-- 5. sector_system_prompts
CREATE TABLE public.sector_system_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sector text NOT NULL UNIQUE,
  system_prompt text NOT NULL,
  allowed_actions jsonb DEFAULT '[]',
  blocked_actions jsonb DEFAULT '[]',
  welcome_template text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sector_system_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sector_prompts_select" ON public.sector_system_prompts FOR SELECT TO authenticated USING (true);
CREATE POLICY "sector_prompts_insert" ON public.sector_system_prompts FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "sector_prompts_update" ON public.sector_system_prompts FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "sector_prompts_delete" ON public.sector_system_prompts FOR DELETE TO authenticated USING (public.is_super_admin());

-- Indexes
CREATE INDEX idx_wa_config_tenant ON public.whatsapp_config(tenant_id);
CREATE INDEX idx_wa_conv_tenant ON public.whatsapp_conversations(tenant_id);
CREATE INDEX idx_wa_conv_phone ON public.whatsapp_conversations(contact_phone);
CREATE INDEX idx_wa_msg_conv ON public.whatsapp_messages(conversation_id);
CREATE INDEX idx_wa_msg_tenant ON public.whatsapp_messages(tenant_id);
CREATE INDEX idx_wa_notif_tenant ON public.whatsapp_notifications(tenant_id);
CREATE INDEX idx_wa_notif_status ON public.whatsapp_notifications(status);
