import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

/**
 * Empire Voice Orchestrator
 * Interpreta un comando vocale e ritorna un piano di azioni strutturato.
 * Il client esegue le azioni dopo conferma vocale dell'utente.
 */

const SYSTEM_PROMPT = `Sei l'Empire Voice Orchestrator, l'assistente vocale onnipotente di Kevin (owner della piattaforma Empire AI).

Ricevi un comando vocale in italiano e devi tradurlo in un PIANO DI AZIONI strutturato in JSON che il client eseguirà dopo conferma vocale dell'utente.

## TIPI DI AZIONI DISPONIBILI

1. **navigate** — Vai a una pagina dell'app
   { "type": "navigate", "path": "/superadmin", "description": "Apri Super Admin" }
   Path validi: /, /superadmin, /partner, /leads, /admin, /admin/agents, /admin/whatsapp, /admin/media, /app/*, /demo, /onboarding, /superadmin/voice-orchestrator, /superadmin/credits, /superadmin/connections, /superadmin/demo-accounts, /superadmin/feature-requests, /superadmin/brand-assets

2. **db_command** — Esegue mutazione DB tramite ai-command-agent (CRUD su menu, prezzi, ordini, lead, prenotazioni, staff, flotta, clienti, interventi)
   { "type": "db_command", "command": "aggiungi piatto Pizza Diavola a 12 euro", "description": "Crea piatto Pizza Diavola" }

3. **trigger_agent** — Lancia un altro agente/edge function
   { "type": "trigger_agent", "agent": "sales-agent-orchestrator" | "generate-demo-from-lead" | "whatsapp-send" | "lead-search" | "scan-prospect", "payload": {...}, "description": "..." }

4. **query** — Legge dati e li riassume a voce
   { "type": "query", "table": "leads" | "orders" | "restaurants" | "companies" | "voice_command_log" | "ai_usage_logs" | "demo_credit_usage", "filters": {...}, "summary_question": "Quanti lead nuovi oggi?", "description": "..." }

5. **report** — Risposta puramente conversazionale (es. "ciao", "che ore sono", "cosa puoi fare")
   { "type": "report", "description": "Risposta conversazionale" }

## REGOLE CRITICHE

- Rispondi SEMPRE con JSON valido tramite la tool function "plan_voice_actions". Mai testo libero.
- Estrai TUTTI i parametri necessari dal comando (numeri, nomi, prezzi, telefoni).
- Se il comando è ambiguo, chiedi chiarimento via reply_text + nessuna azione.
- Marca confirmation_required=true SEMPRE (l'utente ha richiesto conferma per TUTTE le azioni).
- destructive=true se: elimina, cancella, rimuovi, blocca, manda WhatsApp di massa, addebita pagamento.
- reply_text deve essere parlato naturale italiano (max 2 frasi), come se parlassi a Kevin di persona.
- confirmation_question: domanda secca SI/NO, max 1 frase ("Confermi che voglio aggiungere Pizza Diavola a 12 euro?").
- Se più azioni vanno eseguite in sequenza, mettile tutte nell'array actions IN ORDINE.
- Per query sui dati, usa la tabella corretta dello schema Supabase (leads, restaurants, companies, orders, demo_factory_runs, partner_demo_credits, voice_command_log).

## ESEMPI

Input: "vai alla pagina lead scout"
→ actions: [{"type":"navigate","path":"/leads","description":"Apri Lead Scout"}]
   reply_text: "Apro Lead Scout, confermi?"
   confirmation_question: "Confermo apertura Lead Scout?"

Input: "aggiungi al menu del ristorante demo una pizza margherita a 10 euro"
→ actions: [{"type":"db_command","command":"aggiungi piatto Pizza Margherita a 10 euro categoria Pizze","description":"Aggiungi Pizza Margherita 10€"}]
   reply_text: "Sto per aggiungere Pizza Margherita a 10 euro al menu, confermi?"
   confirmation_question: "Confermi: Pizza Margherita a 10 euro?"

Input: "lancia Arianna sul lead numero uno"
→ actions: [{"type":"trigger_agent","agent":"sales-agent-orchestrator","payload":{"job_type":"hunt_and_outreach","trigger_source":"voice"},"description":"Lancia Arianna Sales Agent"}]

Input: "quanti lead nuovi oggi?"
→ actions: [{"type":"query","table":"leads","filters":{"created_today":true,"status":"new"},"summary_question":"Quanti lead nuovi oggi","description":"Conta lead nuovi oggi"}]

Input: "elimina il ristorante demo numero 5"
→ destructive: true
   actions: [{"type":"db_command","command":"elimina ristorante demo 5","description":"Elimina ristorante demo 5"}]
   confirmation_question: "ATTENZIONE: confermi eliminazione ristorante demo 5?"

Input: "ciao Arianna"
→ actions: [{"type":"report","description":"saluto"}]
   reply_text: "Ciao Kevin! Sono pronta. Dimmi pure cosa vuoi fare."
   confirmation_required: false`;

const PLAN_TOOL = {
  type: "function",
  function: {
    name: "plan_voice_actions",
    description: "Restituisce il piano di azioni interpretato dal comando vocale.",
    parameters: {
      type: "object",
      properties: {
        intent_summary: {
          type: "string",
          description: "Riassunto in 1 frase di cosa l'utente vuole fare.",
        },
        actions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["navigate", "db_command", "trigger_agent", "query", "report"],
              },
              path: { type: "string" },
              command: { type: "string" },
              agent: { type: "string" },
              payload: { type: "object", additionalProperties: true },
              table: { type: "string" },
              filters: { type: "object", additionalProperties: true },
              summary_question: { type: "string" },
              description: { type: "string" },
            },
            required: ["type", "description"],
            additionalProperties: true,
          },
        },
        reply_text: {
          type: "string",
          description: "Risposta vocale parlata in italiano (max 2 frasi).",
        },
        confirmation_required: {
          type: "boolean",
          description: "True se serve conferma vocale prima di eseguire (default true).",
        },
        confirmation_question: {
          type: "string",
          description: "Domanda SI/NO secca per la conferma vocale.",
        },
        destructive: {
          type: "boolean",
          description: "True se l'azione è distruttiva (delete, mass send, payment).",
        },
        needs_clarification: {
          type: "boolean",
          description: "True se il comando è ambiguo e serve riformulazione.",
        },
      },
      required: ["intent_summary", "actions", "reply_text", "confirmation_required"],
      additionalProperties: false,
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startedAt = Date.now();

  try {
    // Auth guard
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");

    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authErr } = await authClient.auth.getUser();
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const transcript: string = (body.transcript || "").toString().trim();
    const context: string = (body.context || "").toString();

    if (!transcript) {
      return new Response(JSON.stringify({ error: "transcript required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!lovableKey) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResp = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Comando vocale: "${transcript}"\n\nContesto attuale:\n${context || "(nessuno)"}`,
          },
        ],
        tools: [PLAN_TOOL],
        tool_choice: { type: "function", function: { name: "plan_voice_actions" } },
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit, riprova tra poco." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "Crediti AI esauriti." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, errText);
      throw new Error("AI gateway error");
    }

    const aiJson = await aiResp.json();
    const toolCall = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error("AI did not return a structured plan");
    }

    let plan: any;
    try {
      plan = JSON.parse(toolCall.function.arguments);
    } catch {
      throw new Error("AI returned invalid JSON plan");
    }

    // Safety defaults
    plan.confirmation_required = plan.confirmation_required ?? true;
    plan.actions = Array.isArray(plan.actions) ? plan.actions : [];
    plan.reply_text = plan.reply_text || "Ho capito, procedo.";

    // Log via service role (bypass RLS for owner-side audit)
    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: logRow } = await adminClient
      .from("voice_command_log")
      .insert({
        user_id: user.id,
        transcript,
        intent: { summary: plan.intent_summary, destructive: !!plan.destructive },
        actions_planned: plan.actions,
        actions_executed: [],
        reply_text: plan.reply_text,
        status: "planned",
        confirmation_required: !!plan.confirmation_required,
        duration_ms: Date.now() - startedAt,
      })
      .select("id")
      .single();

    return new Response(
      JSON.stringify({
        success: true,
        log_id: logRow?.id ?? null,
        plan,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("voice-orchestrator error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
