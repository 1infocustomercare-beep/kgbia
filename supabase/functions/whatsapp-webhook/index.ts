// ══════════════════════════════════════════════════════════════
// Empire WhatsApp Webhook — Receives & processes Meta webhooks
// ══════════════════════════════════════════════════════════════
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  // ── GET: Webhook verification (Meta challenge) ──
  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode !== "subscribe" || !token || !challenge) {
      return new Response("Bad request", { status: 400 });
    }

    // Look up the verify token in whatsapp_config
    const { data: config } = await supabase
      .from("whatsapp_config")
      .select("id")
      .eq("webhook_verify_token", token)
      .eq("is_active", true)
      .maybeSingle();

    if (!config) {
      return new Response("Forbidden", { status: 403 });
    }

    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // ── POST: Incoming webhook events ──
  if (req.method === "POST") {
    try {
      const payload = await req.json();

      if (payload.object !== "whatsapp_business_account") {
        return new Response("Not a WhatsApp event", { status: 400, headers: corsHeaders });
      }

      for (const entry of payload.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field !== "messages") continue;
          const value = change.value;
          if (!value) continue;

          const phoneNumberId = value.metadata?.phone_number_id;
          if (!phoneNumberId) continue;

          // Resolve tenant from phone_number_id
          const { data: config } = await supabase
            .from("whatsapp_config")
            .select("tenant_id")
            .eq("phone_number_id", phoneNumberId)
            .eq("is_active", true)
            .maybeSingle();

          if (!config) {
            console.warn(`No config for phone_number_id: ${phoneNumberId}`);
            continue;
          }

          const tenantId = config.tenant_id;

          // ── Process status updates ──
          for (const status of value.statuses || []) {
            await supabase
              .from("whatsapp_messages")
              .update({ status: status.status })
              .eq("whatsapp_message_id", status.id)
              .eq("tenant_id", tenantId);
          }

          // ── Process incoming messages ──
          for (const msg of value.messages || []) {
            const contactInfo = value.contacts?.find((c: any) => c.wa_id === msg.from);
            const contactName = contactInfo?.profile?.name || null;
            const contactPhone = msg.from;

            // Upsert conversation
            let conversationId: string;
            const { data: existingConv } = await supabase
              .from("whatsapp_conversations")
              .select("id, sector")
              .eq("tenant_id", tenantId)
              .eq("contact_phone", contactPhone)
              .eq("status", "active")
              .maybeSingle();

            if (existingConv) {
              conversationId = existingConv.id;
              await supabase
                .from("whatsapp_conversations")
                .update({
                  last_message_at: new Date().toISOString(),
                  contact_name: contactName || undefined,
                })
                .eq("id", conversationId);
            } else {
              // Determine sector from tenant's company
              const { data: membership } = await supabase
                .from("company_memberships")
                .select("company_id")
                .eq("user_id", tenantId)
                .limit(1)
                .maybeSingle();

              let sector = "ristorazione";
              if (membership) {
                const { data: company } = await supabase
                  .from("companies")
                  .select("industry")
                  .eq("id", membership.company_id)
                  .maybeSingle();
                if (company?.industry) sector = company.industry;
              }

              const { data: newConv } = await supabase
                .from("whatsapp_conversations")
                .insert({
                  tenant_id: tenantId,
                  contact_phone: contactPhone,
                  contact_name: contactName,
                  sector,
                  status: "active",
                  last_message_at: new Date().toISOString(),
                })
                .select("id")
                .single();

              conversationId = newConv!.id;
            }

            // Determine message content
            let content = "";
            let messageType = "text";

            if (msg.type === "text" && msg.text?.body) {
              content = msg.text.body;
              messageType = "text";
            } else if (msg.type === "image") {
              content = msg.image?.caption || "[Immagine]";
              messageType = "image";
            } else if (msg.type === "document") {
              content = msg.document?.filename || "[Documento]";
              messageType = "document";
            } else if (msg.type === "interactive") {
              content =
                msg.interactive?.button_reply?.title ||
                msg.interactive?.list_reply?.title ||
                "[Interattivo]";
              messageType = "interactive";
            } else {
              content = `[${msg.type}]`;
            }

            // Store inbound message
            await supabase.from("whatsapp_messages").insert({
              conversation_id: conversationId,
              tenant_id: tenantId,
              direction: "inbound",
              message_type: messageType,
              content,
              whatsapp_message_id: msg.id,
              status: "delivered",
              metadata: { raw_type: msg.type, timestamp: msg.timestamp },
            });

            // ── Check for owner command or regular AI auto-reply ──
            if (msg.type === "text" && msg.text?.body) {
              try {
                const messageText = msg.text.body;
                const isCommand = detectCommandIntent(messageText);

                if (isCommand) {
                  // Route to Command Agent — owner is managing their business
                  const commandReply = await executeCommandAgent(supabaseUrl, tenantId, messageText, contactPhone);
                  if (commandReply) {
                    await sendWhatsAppMessage(supabase, tenantId, contactPhone, commandReply, conversationId);
                  }
                } else {
                  // Regular AI reply for customer conversations
                  const aiReply = await generateAIReply(supabase, tenantId, conversationId, messageText);
                  if (aiReply) {
                    await sendWhatsAppMessage(supabase, tenantId, contactPhone, aiReply, conversationId);
                  }
                }
              } catch (err) {
                console.error("AI auto-reply error:", err);
              }
            }
          }
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Webhook processing error:", err);
      return new Response(JSON.stringify({ error: "Internal error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  return new Response("Method not allowed", { status: 405 });
});
// ── Detect if message is a business command (vs customer chat) ──
function detectCommandIntent(text: string): boolean {
  const lowerText = text.toLowerCase().trim();
  
  // Command prefixes
  const commandPrefixes = [
    "empire", "hey empire", "ehi empire", "ciao empire",
    "aggiorna", "modifica", "cambia", "togli", "rimuovi",
    "aggiungi", "inserisci", "attiva", "disattiva",
    "aumenta", "diminuisci", "abbassa", "alza",
    "imposta", "setta", "metti",
    "conferma", "annulla", "cancella",
    "prezzo", "stato",
  ];
  
  return commandPrefixes.some(prefix => lowerText.startsWith(prefix));
}

// ── Execute command via Command Agent edge function ──
async function executeCommandAgent(
  supabaseUrl: string,
  tenantId: string,
  command: string,
  senderPhone: string,
): Promise<string | null> {
  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!serviceKey) return null;

    const resp = await fetch(`${supabaseUrl}/functions/v1/ai-command-agent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        tenant_id: tenantId,
        command,
        source: "whatsapp",
        sender_phone: senderPhone,
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      return data.message_it || "❌ Comando non autorizzato o non valido.";
    }

    return data.message_it || "✅ Comando eseguito con successo.";
  } catch (err) {
    console.error("Command agent call error:", err);
    return null;
  }
}


async function generateAIReply(
  supabase: any,
  tenantId: string,
  conversationId: string,
  userMessage: string,
): Promise<string | null> {
  // Get conversation context
  const { data: conv } = await supabase
    .from("whatsapp_conversations")
    .select("sector, context, contact_name")
    .eq("id", conversationId)
    .single();

  if (!conv) return null;

  // Get sector prompt
  const { data: sectorPrompt } = await supabase
    .from("sector_system_prompts")
    .select("system_prompt, allowed_actions, blocked_actions")
    .eq("sector", conv.sector)
    .eq("is_active", true)
    .maybeSingle();

  if (!sectorPrompt) return null;

  // Get recent conversation history (last 10 messages)
  const { data: recentMessages } = await supabase
    .from("whatsapp_messages")
    .select("direction, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(10);

  const history = (recentMessages || [])
    .reverse()
    .map((m: any) => ({
      role: m.direction === "inbound" ? "user" : "assistant",
      content: m.content,
    }));

  // Call Lovable AI
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    console.warn("LOVABLE_API_KEY not configured, skipping AI reply");
    return null;
  }

  const systemPrompt = `${sectorPrompt.system_prompt}\n\nAzioni consentite: ${JSON.stringify(sectorPrompt.allowed_actions)}\nAzioni bloccate: ${JSON.stringify(sectorPrompt.blocked_actions)}\n\nRispondi in modo conciso e professionale. Max 300 caratteri per messaggio WhatsApp.`;

  const resp = await fetch("https://api.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!resp.ok) {
    console.error("AI API error:", resp.status);
    return null;
  }

  const data = await resp.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
}

// ── Send WhatsApp Message via Meta API ──
async function sendWhatsAppMessage(
  supabase: any,
  tenantId: string,
  to: string,
  text: string,
  conversationId: string,
) {
  const { data: config } = await supabase
    .from("whatsapp_config")
    .select("phone_number_id, access_token")
    .eq("tenant_id", tenantId)
    .eq("is_active", true)
    .maybeSingle();

  if (!config?.phone_number_id || !config?.access_token) {
    console.warn("WhatsApp config incomplete for tenant:", tenantId);
    return;
  }

  const resp = await fetch(
    `https://graph.facebook.com/v19.0/${config.phone_number_id}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.access_token}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      }),
    },
  );

  const result = await resp.json();
  const waMessageId = result.messages?.[0]?.id || null;

  await supabase.from("whatsapp_messages").insert({
    conversation_id: conversationId,
    tenant_id: tenantId,
    direction: "outbound",
    message_type: "text",
    content: text,
    whatsapp_message_id: waMessageId,
    status: resp.ok ? "sent" : "failed",
    metadata: resp.ok ? {} : { error: result },
  });
}
