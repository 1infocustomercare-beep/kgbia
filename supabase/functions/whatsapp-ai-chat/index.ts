// ══════════════════════════════════════════════════════════════
// Empire WhatsApp AI Chat — Manual AI reply from dashboard
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

    // Auth via getClaims
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

    const { conversation_id, user_message } = await req.json();

    if (!conversation_id || !user_message) {
      return new Response(JSON.stringify({ error: "conversation_id e user_message richiesti" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify strict tenant ownership — CRITICAL: prevents cross-tenant data access
    const { data: conv } = await supabase
      .from("whatsapp_conversations")
      .select("sector, context, contact_name, contact_phone, tenant_id")
      .eq("id", conversation_id)
      .eq("tenant_id", user.id)
      .maybeSingle();

    if (!conv) {
      console.warn(`SECURITY: User ${user.id} attempted to access conversation ${conversation_id} — denied`);
      return new Response(JSON.stringify({ error: "Conversazione non trovata" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get sector prompt
    const { data: sectorPrompt } = await supabase
      .from("sector_system_prompts")
      .select("system_prompt, allowed_actions, blocked_actions")
      .eq("sector", conv.sector)
      .eq("is_active", true)
      .maybeSingle();

    // Get conversation history
    // CRITICAL: Filter by BOTH conversation_id AND tenant_id for absolute isolation
    const { data: history } = await supabase
      .from("whatsapp_messages")
      .select("direction, content")
      .eq("conversation_id", conversation_id)
      .eq("tenant_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    const messages = (history || []).reverse().map((m: any) => ({
      role: m.direction === "inbound" ? "user" : "assistant",
      content: m.content,
    }));

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI non configurata" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isolationRule = `\n\n⚠️ REGOLA ISOLAMENTO ASSOLUTO: Ogni risposta DEVE essere basata ESCLUSIVAMENTE sui dati di QUESTO tenant (${user.id}). NON menzionare, suggerire o fare riferimento a dati, prezzi, servizi, clienti o informazioni di qualsiasi altro account o settore. Se non hai informazioni sufficienti, chiedi al cliente — NON inventare.`;
    const systemContent = sectorPrompt
      ? `${sectorPrompt.system_prompt}\n\nCliente: ${conv.contact_name || conv.contact_phone}\nAzioni consentite: ${JSON.stringify(sectorPrompt.allowed_actions)}\nAzioni bloccate: ${JSON.stringify(sectorPrompt.blocked_actions)}${isolationRule}\n\nGenera una risposta suggerita. L'operatore potrà modificarla prima di inviarla.`
      : `Sei un assistente AI per WhatsApp Business. Genera una risposta professionale in italiano per il cliente ${conv.contact_name || conv.contact_phone}.${isolationRule}`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemContent },
          ...messages,
          { role: "user", content: user_message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("AI error:", aiResp.status, errText);
      return new Response(JSON.stringify({ error: "Errore AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResp.json();
    const suggestion = aiData.choices?.[0]?.message?.content?.trim() || "";

    return new Response(JSON.stringify({ suggestion }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("AI chat error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
