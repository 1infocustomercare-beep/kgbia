// ══════════════════════════════════════════════════════════════
// Empire WhatsApp Send — Send messages & notifications
// ══════════════════════════════════════════════════════════════
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Authenticate user via getClaims
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Non autenticato" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Non autenticato" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const user = { id: claimsData.claims.sub as string };

    const body = await req.json();
    const { action } = body;

    // ── Action: send_message ──
    if (action === "send_message") {
      const { conversation_id, content, message_type = "text" } = body;

      if (!conversation_id || !content) {
        return new Response(JSON.stringify({ error: "conversation_id e content richiesti" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify conversation belongs to user
      const { data: conv } = await supabase
        .from("whatsapp_conversations")
        .select("contact_phone, tenant_id")
        .eq("id", conversation_id)
        .eq("tenant_id", user.id)
        .maybeSingle();

      if (!conv) {
        return new Response(JSON.stringify({ error: "Conversazione non trovata" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get WhatsApp config
      const { data: config } = await supabase
        .from("whatsapp_config")
        .select("phone_number_id, access_token")
        .eq("tenant_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (!config?.phone_number_id || !config?.access_token) {
        return new Response(JSON.stringify({ error: "WhatsApp non configurato" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Send via Meta API
      const metaResp = await fetch(
        `https://graph.facebook.com/v19.0/${config.phone_number_id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.access_token}`,
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: conv.contact_phone,
            type: "text",
            text: { body: content },
          }),
        },
      );

      const metaResult = await metaResp.json();
      const waMessageId = metaResult.messages?.[0]?.id || null;

      // Store outbound message
      const { data: savedMsg } = await supabase
        .from("whatsapp_messages")
        .insert({
          conversation_id,
          tenant_id: user.id,
          direction: "outbound",
          message_type,
          content,
          whatsapp_message_id: waMessageId,
          status: metaResp.ok ? "sent" : "failed",
          metadata: metaResp.ok ? {} : { error: metaResult },
        })
        .select()
        .single();

      // Update conversation last_message_at
      await supabase
        .from("whatsapp_conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversation_id);

      return new Response(JSON.stringify({ success: true, message: savedMsg }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Action: send_notification ──
    if (action === "send_notification") {
      const { recipient_phone, notification_type, template_name, template_params = {} } = body;

      if (!recipient_phone || !notification_type) {
        return new Response(JSON.stringify({ error: "recipient_phone e notification_type richiesti" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Store notification
      const { data: notif } = await supabase
        .from("whatsapp_notifications")
        .insert({
          tenant_id: user.id,
          notification_type,
          recipient_phone,
          template_name: template_name || null,
          template_params,
          status: "pending",
        })
        .select()
        .single();

      // If template-based, send via Meta API
      if (template_name) {
        const { data: config } = await supabase
          .from("whatsapp_config")
          .select("phone_number_id, access_token")
          .eq("tenant_id", user.id)
          .eq("is_active", true)
          .maybeSingle();

        if (config?.phone_number_id && config?.access_token) {
          const metaResp = await fetch(
            `https://graph.facebook.com/v19.0/${config.phone_number_id}/messages`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${config.access_token}`,
              },
              body: JSON.stringify({
                messaging_product: "whatsapp",
                to: recipient_phone,
                type: "template",
                template: {
                  name: template_name,
                  language: { code: "it" },
                  components: template_params.components || [],
                },
              }),
            },
          );

          const status = metaResp.ok ? "sent" : "failed";
          await supabase
            .from("whatsapp_notifications")
            .update({ status, sent_at: metaResp.ok ? new Date().toISOString() : null })
            .eq("id", notif!.id);
        }
      }

      return new Response(JSON.stringify({ success: true, notification: notif }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Azione non valida" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("WhatsApp send error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
