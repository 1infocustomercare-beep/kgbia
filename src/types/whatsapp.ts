// ══════════════════════════════════════════════════════════════
// Empire WhatsApp Orchestrator — TypeScript Types
// ══════════════════════════════════════════════════════════════

export interface WhatsAppConfig {
  id: string;
  tenant_id: string;
  phone_number_id: string | null;
  whatsapp_business_account_id: string | null;
  access_token: string | null;
  webhook_verify_token: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type WhatsAppConversationStatus = 'active' | 'archived' | 'blocked';

export interface WhatsAppConversation {
  id: string;
  tenant_id: string;
  contact_phone: string;
  contact_name: string | null;
  sector: string;
  status: WhatsAppConversationStatus;
  last_message_at: string | null;
  context: Record<string, unknown>;
  created_at: string;
}

export type WhatsAppMessageDirection = 'inbound' | 'outbound';
export type WhatsAppMessageType = 'text' | 'image' | 'template' | 'interactive' | 'document';
export type WhatsAppMessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

export interface WhatsAppMessage {
  id: string;
  conversation_id: string | null;
  tenant_id: string;
  direction: WhatsAppMessageDirection;
  message_type: WhatsAppMessageType;
  content: string;
  whatsapp_message_id: string | null;
  status: WhatsAppMessageStatus;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type WhatsAppNotificationType = 'welcome' | 'booking' | 'alert' | 'promo' | 'system';
export type WhatsAppNotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed';

export interface WhatsAppNotification {
  id: string;
  tenant_id: string;
  notification_type: WhatsAppNotificationType;
  recipient_phone: string;
  template_name: string | null;
  template_params: Record<string, unknown>;
  status: WhatsAppNotificationStatus;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface SectorSystemPrompt {
  id: string;
  sector: string;
  system_prompt: string;
  allowed_actions: string[];
  blocked_actions: string[];
  welcome_template: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Webhook Payload (from Meta WhatsApp Cloud API) ──

export interface WhatsAppWebhookContact {
  profile: { name: string };
  wa_id: string;
}

export interface WhatsAppWebhookMessage {
  from: string;
  id: string;
  timestamp: string;
  type: 'text' | 'image' | 'document' | 'interactive' | 'button' | 'reaction';
  text?: { body: string };
  image?: { id: string; mime_type: string; caption?: string };
  document?: { id: string; mime_type: string; filename?: string };
  interactive?: { type: string; button_reply?: { id: string; title: string }; list_reply?: { id: string; title: string } };
}

export interface WhatsAppWebhookStatus {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  recipient_id: string;
  errors?: Array<{ code: number; title: string }>;
}

export interface WhatsAppWebhookValue {
  messaging_product: 'whatsapp';
  metadata: { display_phone_number: string; phone_number_id: string };
  contacts?: WhatsAppWebhookContact[];
  messages?: WhatsAppWebhookMessage[];
  statuses?: WhatsAppWebhookStatus[];
}

export interface WhatsAppWebhookEntry {
  id: string;
  changes: Array<{ value: WhatsAppWebhookValue; field: string }>;
}

export interface WhatsAppWebhookPayload {
  object: 'whatsapp_business_account';
  entry: WhatsAppWebhookEntry[];
}

// ── Send Request ──

export interface WhatsAppSendRequest {
  to: string;
  type: 'text' | 'template' | 'interactive' | 'image' | 'document';
  text?: { body: string };
  template?: {
    name: string;
    language: { code: string };
    components?: Array<{
      type: string;
      parameters: Array<{ type: string; text?: string; image?: { link: string } }>;
    }>;
  };
  interactive?: {
    type: 'button' | 'list';
    header?: { type: string; text?: string };
    body: { text: string };
    footer?: { text: string };
    action: Record<string, unknown>;
  };
}
