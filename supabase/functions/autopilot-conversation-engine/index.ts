// ═══════════════════════════════════════════════════════════════
// EMPIRE AUTOPILOT — Conversation Engine multi-canale
// Chat + Email + WhatsApp link, Gemini 2.5 Pro objection handling
// ═══════════════════════════════════════════════════════════════
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

type Action =
  | "start_conversation"
  | "send_user_message"
  | "generate_followup"
  | "close_conversation";

async function callGeminiPro(messages: any[], tools?: any) {
  const body: any = {
    model: "google/gemini-2.5-pro",
    messages,
  };
  if (tools) {
    body.tools = tools;
    body.tool_choice = "auto";
  }
  const resp = await fetch(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Gemini ${resp.status}: ${txt.slice(0, 300)}`);
  }
  return await resp.json();
}

function buildSystemPrompt(opts: {
  sector: string | null;
  painSummary?: string;
  monthlyLoss?: number;
  contactName?: string;
  funnelStage: string;
}) {
  return `Sei Arianna, AI Sales Agent di Empire AI Group, specializzata nella vendita consulenziale per PMI italiane.

CONTESTO LEAD:
- Settore: ${opts.sector ?? "non specificato"}
- Nome contatto: ${opts.contactName ?? "non noto"}
- Fase funnel: ${opts.funnelStage}
${opts.painSummary ? `- Pain identificati: ${opts.painSummary}` : ""}
${opts.monthlyLoss ? `- Perdita stimata: €${opts.monthlyLoss}/mese` : ""}

REGOLE FERREE:
1. Sei consulenziale, MAI aggressiva. Mai "compri o no".
2. Focus su risultati concreti (prenotazioni, fatturato, tempo risparmiato).
3. Linguaggio italiano professionale, frasi brevi, numeri precisi.
4. Mai promesse irrealistiche. Sempre payback realistici.
5. In WhatsApp/Email tieni messaggi sotto 350 caratteri.
6. In chat puoi essere più estesa ma mai oltre 600 caratteri.
7. Se il lead obietta sul prezzo: ricorda il payback in mesi e il valore mensile perso.
8. Se il lead chiede "non ho tempo": proponi demo da 15 minuti, già pronta.
9. Se il lead è freddo: chiedi UN dato concreto (es: "quanti coperti la sera?").
10. Quando senti BUY signals chiari, proponi: 1) demo personalizzata, 2) call con esperto.

OUTPUT: solo il messaggio da inviare. Nessuna meta-spiegazione. Nessun "Certo, ecco:".`;
}

const REPLY_TOOL = [{
  type: "function",
  function: {
    name: "send_reply",
    description: "Send AI reply with metadata",
    parameters: {
      type: "object",
      properties: {
        message: { type: "string" },
        intent_detected: {
          type: "string",
          enum: [
            "greeting",
            "question",
            "objection_price",
            "objection_time",
            "objection_trust",
            "interest",
            "buy_signal",
            "closure_request",
            "off_topic",
            "cold",
          ],
        },
        sentiment: {
          type: "string",
          enum: ["positive", "neutral", "negative"],
        },
        next_funnel_stage: {
          type: "string",
          enum: [
            "discovery",
            "qualification",
            "presentation",
            "negotiation",
            "closing",
            "won",
            "lost",
          ],
        },
        confidence: { type: "number", minimum: 0, maximum: 1 },
        suggest_followup_at: {
          type: "string",
          description: "ISO datetime for follow-up if useful, else null",
        },
        escalate_to_human: { type: "boolean" },
      },
      required: [
        "message",
        "intent_detected",
        "sentiment",
        "next_funnel_stage",
        "confidence",
        "escalate_to_human",
      ],
    },
  },
}];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY mancante");
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const userClient = createClient(
      SUPABASE_URL,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const action: Action = body.action;

    // ── START CONVERSATION ────────────────────────────────────
    if (action === "start_conversation") {
      const {
        lead_id,
        pain_scan_id,
        roi_calculation_id,
        channel = "chat",
        contact_name,
        contact_phone,
        contact_email,
        sector,
      } = body;

      // ── Guard: blocca outreach su settori in pausa o esclusi ──
      if (sector) {
        const { data: paused } = await supabase.rpc(
          "is_autopilot_sector_paused",
          { _owner_id: user.id, _sector: sector },
        );
        if (paused === true) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "sector_paused",
              message: `Settore "${sector}" attualmente in pausa o escluso dall'autopilot`,
              sector,
            }),
            {
              status: 409,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
      }

      const { data: scan } = pain_scan_id
        ? await supabase.from("pain_scans").select("*").eq(
          "id",
          pain_scan_id,
        ).maybeSingle()
        : { data: null };

      const { data: roi } = roi_calculation_id
        ? await supabase.from("roi_calculations").select("*").eq(
          "id",
          roi_calculation_id,
        ).maybeSingle()
        : { data: null };

      const sys = buildSystemPrompt({
        sector,
        painSummary: scan?.ai_summary,
        monthlyLoss: roi?.monthly_loss_eur,
        contactName: contact_name,
        funnelStage: "discovery",
      });

      const opener = await callGeminiPro([
        { role: "system", content: sys },
        {
          role: "user",
          content:
            `Genera il PRIMO messaggio di apertura per ${channel}. Personale, mira a ottenere risposta. Cita 1 pain specifico se disponibile. Massimo 350 caratteri se WhatsApp/email, altrimenti 600.`,
        },
      ], REPLY_TOOL);

      const tc = opener.choices?.[0]?.message?.tool_calls?.[0];
      const args = JSON.parse(tc?.function?.arguments ?? "{}");

      const { data: conv } = await supabase
        .from("autopilot_conversations")
        .insert({
          owner_id: user.id,
          lead_id,
          pain_scan_id: scan?.id,
          roi_calculation_id: roi?.id,
          channel,
          status: "active",
          funnel_stage: args.next_funnel_stage ?? "discovery",
          sentiment: args.sentiment ?? "neutral",
          contact_name,
          contact_phone,
          contact_email,
          next_action: "wait_lead_reply",
          last_ai_message_at: new Date().toISOString(),
          shared_context: {
            sector,
            pain_summary: scan?.ai_summary,
            monthly_loss: roi?.monthly_loss_eur,
            opener_intent: args.intent_detected,
          },
          ai_confidence: args.confidence ?? 0.7,
        })
        .select()
        .single();

      await supabase.from("autopilot_messages").insert({
        conversation_id: conv.id,
        owner_id: user.id,
        sender: "ai",
        channel,
        content: args.message,
        ai_metadata: {
          intent: args.intent_detected,
          confidence: args.confidence,
          escalate: args.escalate_to_human,
        },
      });

      // WhatsApp link if requested
      let whatsapp_link = null;
      if (channel === "whatsapp_link" && contact_phone) {
        const phone = contact_phone.replace(/[^\d+]/g, "");
        whatsapp_link = `https://wa.me/${
          phone.replace("+", "")
        }?text=${encodeURIComponent(args.message)}`;
      }

      await supabase.rpc("award_xp", {
        _user_id: user.id,
        _amount: 15,
        _reason: "autopilot_conversation_started",
      });

      return new Response(
        JSON.stringify({ conversation: conv, message: args, whatsapp_link }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // ── SEND USER MESSAGE + AI REPLY ──────────────────────────
    if (action === "send_user_message") {
      const { conversation_id, lead_message } = body;
      if (!conversation_id || !lead_message) {
        return new Response(
          JSON.stringify({ error: "conversation_id + lead_message required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const { data: conv } = await supabase
        .from("autopilot_conversations")
        .select("*")
        .eq("id", conversation_id)
        .single();
      if (!conv) {
        return new Response(JSON.stringify({ error: "conv not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: history } = await supabase
        .from("autopilot_messages")
        .select("sender, content, created_at")
        .eq("conversation_id", conversation_id)
        .order("created_at");

      // Save lead message
      await supabase.from("autopilot_messages").insert({
        conversation_id,
        owner_id: user.id,
        sender: "lead",
        channel: conv.channel,
        content: lead_message,
      });

      const ctx = conv.shared_context as any;
      const sys = buildSystemPrompt({
        sector: ctx?.sector,
        painSummary: ctx?.pain_summary,
        monthlyLoss: ctx?.monthly_loss,
        contactName: conv.contact_name,
        funnelStage: conv.funnel_stage,
      });

      const messages = [
        { role: "system", content: sys },
        ...(history || []).map((m) => ({
          role: m.sender === "ai" ? "assistant" : "user",
          content: m.content,
        })),
        { role: "user", content: lead_message },
      ];

      const aiResp = await callGeminiPro(messages, REPLY_TOOL);
      const tc = aiResp.choices?.[0]?.message?.tool_calls?.[0];
      const args = JSON.parse(tc?.function?.arguments ?? "{}");

      // Update conversation
      await supabase.from("autopilot_conversations").update({
        funnel_stage: args.next_funnel_stage ?? conv.funnel_stage,
        sentiment: args.sentiment,
        last_lead_message_at: new Date().toISOString(),
        last_ai_message_at: new Date().toISOString(),
        ai_confidence: args.confidence,
        next_action: args.escalate_to_human
          ? "escalate_to_partner"
          : (args.suggest_followup_at ? "scheduled_followup" : "wait_lead_reply"),
        next_action_at: args.suggest_followup_at ?? null,
      }).eq("id", conversation_id);

      // Save AI reply
      await supabase.from("autopilot_messages").insert({
        conversation_id,
        owner_id: user.id,
        sender: "ai",
        channel: conv.channel,
        content: args.message,
        ai_metadata: {
          intent: args.intent_detected,
          sentiment: args.sentiment,
          confidence: args.confidence,
          escalate: args.escalate_to_human,
        },
      });

      // Coach insight if escalation
      if (args.escalate_to_human) {
        await supabase.from("sales_coach_insights").insert({
          user_id: user.id,
          insight_type: "warning",
          priority: "high",
          title: "Arianna chiede supporto umano",
          message:
            `La conversazione con ${
              conv.contact_name ?? "un lead"
            } richiede il tuo intervento. Intent: ${args.intent_detected}.`,
          action_label: "Apri conversazione",
          action_url: `/partner/autopilot?conv=${conversation_id}`,
          supporting_data: { conversation_id, intent: args.intent_detected },
        });
      }

      // XP per buy signal
      if (args.intent_detected === "buy_signal") {
        await supabase.rpc("award_xp", {
          _user_id: user.id,
          _amount: 30,
          _reason: "buy_signal_detected",
        });
      }

      return new Response(JSON.stringify({ reply: args }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── GENERATE FOLLOW-UP ────────────────────────────────────
    if (action === "generate_followup") {
      const { conversation_id } = body;
      const { data: conv } = await supabase
        .from("autopilot_conversations")
        .select("*")
        .eq("id", conversation_id)
        .single();
      if (!conv) {
        return new Response(JSON.stringify({ error: "conv not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: history } = await supabase
        .from("autopilot_messages")
        .select("sender, content, created_at")
        .eq("conversation_id", conversation_id)
        .order("created_at");

      const ctx = conv.shared_context as any;
      const sys = buildSystemPrompt({
        sector: ctx?.sector,
        painSummary: ctx?.pain_summary,
        monthlyLoss: ctx?.monthly_loss,
        contactName: conv.contact_name,
        funnelStage: conv.funnel_stage,
      });

      const aiResp = await callGeminiPro([
        { role: "system", content: sys },
        ...(history || []).map((m) => ({
          role: m.sender === "ai" ? "assistant" : "user",
          content: m.content,
        })),
        {
          role: "user",
          content:
            `Genera un FOLLOW-UP utile dopo silenzio del lead. Massimo 280 caratteri. Tono cortese, mai pressante. Aggiungi UN nuovo gancio (es: case study breve, urgency soft, domanda aperta).`,
        },
      ], REPLY_TOOL);

      const tc = aiResp.choices?.[0]?.message?.tool_calls?.[0];
      const args = JSON.parse(tc?.function?.arguments ?? "{}");

      await supabase.from("autopilot_messages").insert({
        conversation_id,
        owner_id: user.id,
        sender: "ai",
        channel: conv.channel,
        content: args.message,
        ai_metadata: { kind: "followup", intent: args.intent_detected },
      });

      await supabase.from("autopilot_conversations").update({
        last_ai_message_at: new Date().toISOString(),
        next_action: "wait_lead_reply",
        next_action_at: null,
      }).eq("id", conversation_id);

      return new Response(JSON.stringify({ reply: args }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── CLOSE ────────────────────────────────────────────────
    if (action === "close_conversation") {
      const { conversation_id, reason, won } = body;
      await supabase.from("autopilot_conversations").update({
        status: won ? "won" : "closed",
        closed_at: new Date().toISOString(),
        closed_reason: reason,
        funnel_stage: won ? "won" : "lost",
      }).eq("id", conversation_id);

      if (won) {
        await supabase.rpc("award_xp", {
          _user_id: user.id,
          _amount: 200,
          _reason: "deal_won",
        });
      }
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown";
    console.error("autopilot-conversation-engine error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
