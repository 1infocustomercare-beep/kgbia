// Daily AI Brief — riassunto giornaliero per il venditore (3 azioni prioritarie).
// Chiamato dal frontend la prima volta al giorno; risposta cached client-side.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { user_id } = await req.json();
    if (!user_id) {
      return new Response(JSON.stringify({ error: "user_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Raccogli stato del seller
    const [{ count: hotLeads }, { count: noContact }, { count: pipelineActive }, { data: lastSale }] = await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("owner_id", user_id).gte("ai_score", 75),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("owner_id", user_id).is("last_contacted_at", null),
      supabase.from("lead_outreach_sequences").select("id", { count: "exact", head: true }).eq("owner_id", user_id).eq("status", "active"),
      supabase.from("partner_sales").select("created_at").eq("partner_id", user_id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    ]);

    const stats = {
      hot_leads: hotLeads ?? 0,
      lead_mai_contattati: noContact ?? 0,
      sequenze_attive: pipelineActive ?? 0,
      ultima_vendita_giorni_fa: lastSale?.data?.created_at
        ? Math.floor((Date.now() - new Date(lastSale.data.created_at).getTime()) / 86400000)
        : null,
    };

    // Senza AI key, fallback statico ma utile
    if (!LOVABLE_API_KEY) {
      const actions = [];
      if (stats.lead_mai_contattati > 0) actions.push({ priority: "alta", action: `Contatta i ${stats.lead_mai_contattati} lead mai toccati`, why: "Più aspetti, meno convertono" });
      if (stats.hot_leads > 0) actions.push({ priority: "alta", action: `Lavora i ${stats.hot_leads} lead caldi (score ≥75)`, why: "Convertono 4× rispetto agli altri" });
      if (stats.sequenze_attive < 3) actions.push({ priority: "media", action: "Avvia almeno 3 nuove sequenze oggi", why: "Pipeline = vendite tra 7 giorni" });
      return new Response(JSON.stringify({ stats, actions, ai_powered: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // AI: piano della giornata personalizzato
    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "Sei un coach vendite. Dato lo stato del venditore, restituisci ESATTAMENTE 3 azioni prioritarie per oggi. Stile: motivazionale, concreto, italiano. Output JSON tramite tool.",
          },
          { role: "user", content: `Stato attuale: ${JSON.stringify(stats)}. Dammi le 3 azioni prioritarie per oggi.` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "daily_plan",
            description: "Piano giornaliero del venditore",
            parameters: {
              type: "object",
              properties: {
                actions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      priority: { type: "string", enum: ["alta", "media", "bassa"] },
                      action: { type: "string", description: "azione concreta in 1 frase" },
                      why: { type: "string", description: "motivo in mezza frase" },
                      estimated_minutes: { type: "number" },
                    },
                    required: ["priority", "action", "why", "estimated_minutes"],
                  },
                },
                pep_talk: { type: "string", description: "1 frase motivazionale di apertura" },
              },
              required: ["actions", "pep_talk"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "daily_plan" } },
      }),
    });

    if (!aiResp.ok) {
      console.error("AI brief error", aiResp.status, await aiResp.text());
      return new Response(JSON.stringify({ stats, actions: [], ai_powered: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const plan = toolCall ? JSON.parse(toolCall.function.arguments) : { actions: [], pep_talk: "" };

    return new Response(JSON.stringify({ stats, ...plan, ai_powered: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("seller-daily-brief error", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
