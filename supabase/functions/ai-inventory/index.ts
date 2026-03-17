import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ─── AI Usage Tracking Helper ───
async function trackAIUsage(agentName: string, modelUsed: string, startTime: number, status: string, restaurantId?: string) {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) return;
    const sb = createClient(supabaseUrl, serviceRoleKey);
    await sb.from("ai_usage_logs").insert({
      agent_name: agentName,
      model_used: modelUsed,
      duration_ms: Date.now() - startTime,
      status,
      restaurant_id: restaurantId || null,
    });
  } catch (e) {
    console.error("Failed to track AI usage:", e);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const startTime = Date.now();
  const modelUsed = "google/gemini-3-flash-preview";

  try {
    const { restaurantId, orders, menuItems } = await req.json();

    if (!restaurantId) {
      return new Response(JSON.stringify({ error: "restaurantId richiesto" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Auth verification: ensure the caller owns this restaurant ──
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const token = authHeader.replace("Bearer ", "");
      const { data: claimsData } = await userClient.auth.getClaims(token);
      if (claimsData?.claims) {
        const userId = claimsData.claims.sub as string;
        const sb = createClient(supabaseUrl, serviceKey);
        const { data: ownership } = await sb.from("restaurants").select("id")
          .eq("id", restaurantId).eq("owner_id", userId).maybeSingle();
        if (!ownership) {
          const { data: membership } = await sb.from("restaurant_memberships").select("id")
            .eq("restaurant_id", restaurantId).eq("user_id", userId).maybeSingle();
          if (!membership) {
            console.warn(`SECURITY: User ${userId} tried to access inventory for restaurant ${restaurantId}`);
            return new Response(JSON.stringify({ error: "Non autorizzato" }), {
              status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `Sei un esperto di gestione ristoranti italiani. Analizza questi dati degli ordini e del menu per fornire:

1. ALERT SCORTE: Basandoti sugli ordini recenti, prevedi quali ingredienti chiave potrebbero esaurirsi nei prossimi 2-3 giorni. Per ogni ingrediente, indica la quantità stimata necessaria.

2. PIATTO DEL GIORNO: Suggerisci un "Piatto del Giorno" basato su ingredienti che probabilmente sono in eccesso o prossimi alla scadenza (basandoti sui piatti meno ordinati).

Ordini recenti (ultimi 7 giorni):
${JSON.stringify(orders.slice(0, 50), null, 2)}

Menu attivo:
${JSON.stringify(menuItems.map((m: any) => ({ name: m.name, category: m.category, price: m.price })), null, 2)}

Rispondi SOLO in JSON con questo formato:
{
  "alerts": [{"ingredient": "nome", "estimatedDaysLeft": 2, "suggestedOrder": "5kg", "urgency": "high|medium|low"}],
  "dailySpecial": {"name": "nome piatto", "reason": "motivazione", "suggestedPrice": 12.50},
  "insights": "breve analisi testuale"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelUsed,
        messages: [
          { role: "system", content: "Sei un consulente esperto di gestione ristoranti e inventory management. Rispondi sempre in JSON valido." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      await trackAIUsage("ai-inventory", modelUsed, startTime, "error", restaurantId);
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Troppi richieste AI. Riprova tra poco." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Crediti AI esauriti." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    
    let result = { alerts: [], dailySpecial: null, insights: "" };
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) { result = JSON.parse(jsonMatch[0]); }
    } catch { console.error("Failed to parse inventory result:", content); }

    await trackAIUsage("ai-inventory", modelUsed, startTime, "success", restaurantId);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    await trackAIUsage("ai-inventory", modelUsed, startTime, "error");
    console.error("ai-inventory error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
