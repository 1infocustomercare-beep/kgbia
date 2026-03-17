import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function trackUsage(agent: string, model: string, start: number, status: string, restaurantId?: string) {
  try {
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    await sb.from("ai_usage_logs").insert({ agent_name: agent, model_used: model, duration_ms: Date.now() - start, status, restaurant_id: restaurantId });
  } catch (e) { console.error("Track error:", e); }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const start = Date.now();
  try {
    const { action, cartItems, menuItems, restaurantId, customerPreferences } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY non configurato");

    const model = "google/gemini-3-flash-preview";

    // ─── SOMMELIER: Wine & beverage pairing ───
    if (action === "sommelier-pairing") {
      const cartDesc = (cartItems || []).map((i: any) => `${i.name} (${i.category})`).join(", ");
      const availableBeverages = (menuItems || [])
        .filter((m: any) => ["bevande", "vini", "vini rossi", "vini bianchi", "vino rosso", "vino bianco", "bollicine", "cocktail", "birre", "drinks"].some(c => m.category?.toLowerCase().includes(c)))
        .map((m: any) => `"${m.name}" (€${m.price}, cat: ${m.category}, id: "${m.id}")`).join("\n");

      const prompt = `Sei un sommelier professionista italiano con 20 anni di esperienza in ristoranti stellati Michelin. Il cliente ha nel carrello: ${cartDesc}.

Bevande disponibili nel menu:
${availableBeverages || "Nessuna bevanda specifica disponibile"}

REGOLE:
1. Suggerisci ESATTAMENTE 3 bevande dalla lista disponibile, ordinate per qualità dell'abbinamento
2. Per ogni bevanda spiega PERCHÉ si abbina perfettamente (ingredienti, cottura, equilibrio di sapori)
3. Il tono deve essere elegante ma accessibile, come un sommelier che parla al tavolo
4. Privilegia le bevande con prezzo più alto quando l'abbinamento è equivalente
5. Se ci sono piatti di pesce → vini bianchi/bollicine. Carne → rossi strutturati. Pizza → birra artigianale o rosé
6. Considera la stagionalità e la progressione del pasto

${customerPreferences ? `Preferenze del cliente: ${customerPreferences}` : ""}

Rispondi SOLO con JSON valido:
{
  "suggestions": [
    {
      "menu_item_id": "id esatto dal menu",
      "name": "nome bevanda",
      "price": numero,
      "pairing_reason": "spiegazione breve ed elegante dell'abbinamento (max 80 char)",
      "pairing_score": numero da 1 a 10,
      "sommelier_note": "nota del sommelier raffinata (max 60 char)"
    }
  ],
  "greeting": "frase di apertura del sommelier (max 80 char)"
}`;

      const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: "Sei il sommelier più raffinato d'Italia. Rispondi solo in JSON valido senza markdown." },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!resp.ok) {
        await trackUsage("sommelier-ai", model, start, "error", restaurantId);
        throw new Error(`AI error: ${resp.status}`);
      }

      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content || "{}";
      let result: any = {};
      try { const m = content.match(/\{[\s\S]*\}/); if (m) result = JSON.parse(m[0]); } catch {}

      await trackUsage("sommelier-ai", model, start, "success", restaurantId);
      return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ─── MAÎTRE: Full course guidance & upsell ───
    if (action === "maitre-suggest") {
      const cartDesc = (cartItems || []).map((i: any) => `${i.name} (€${i.price}, cat: ${i.category})`).join(", ");
      const cartCategories = [...new Set((cartItems || []).map((i: any) => i.category?.toLowerCase()))];
      const cartIds = new Set((cartItems || []).map((i: any) => i.id));
      
      const availableItems = (menuItems || [])
        .filter((m: any) => !cartIds.has(m.id) && m.is_active !== false)
        .map((m: any) => `"${m.name}" (€${m.price}, cat: ${m.category}, id: "${m.id}", popular: ${m.is_popular || false})`).join("\n");

      const prompt = `Sei un maître di sala con 25 anni di esperienza nei migliori ristoranti italiani. Il cliente ha ordinato: ${cartDesc}.

Categorie già nel carrello: ${cartCategories.join(", ")}

Menu completo disponibile:
${availableItems}

STRATEGIA DI UPSELL:
1. Analizza cosa MANCA nel percorso gastronomico (se ha un primo ma non un antipasto, suggeriscilo)
2. Se non ha dolce → suggerisci un dolce come "esperienza completa"
3. Se non ha contorno → suggerisci quello che esalta il piatto principale
4. Privilegia i piatti con prezzo più alto e quelli popolari
5. Massimo 4 suggerimenti, ordinati per impatto sullo scontrino
6. Il tono è quello di un maître premuroso che vuole far vivere un'esperienza indimenticabile

${customerPreferences ? `Note del cliente: ${customerPreferences}` : ""}

Rispondi SOLO con JSON valido:
{
  "suggestions": [
    {
      "menu_item_id": "id esatto",
      "name": "nome piatto",
      "price": numero,
      "category": "categoria",
      "reason": "motivazione elegante del maître (max 80 char)",
      "urgency": "high|medium|low",
      "course_position": "antipasto|primo|secondo|contorno|dolce|bevanda"
    }
  ],
  "maitre_greeting": "frase elegante del maître (max 80 char)",
  "experience_score": numero 1-10 che indica completezza del pasto attuale,
  "missing_courses": ["lista corsi mancanti"]
}`;

      const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: "Sei il maître più raffinato d'Italia. Guida il cliente verso un'esperienza gastronomica completa e memorabile. Rispondi solo in JSON valido." },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!resp.ok) {
        await trackUsage("maitre-ai", model, start, "error", restaurantId);
        throw new Error(`AI error: ${resp.status}`);
      }

      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content || "{}";
      let result: any = {};
      try { const m = content.match(/\{[\s\S]*\}/); if (m) result = JSON.parse(m[0]); } catch {}

      await trackUsage("maitre-ai", model, start, "success", restaurantId);
      return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ─── CROSS-SELL: Smart complementary products ───
    if (action === "cross-sell") {
      const cartDesc = (cartItems || []).map((i: any) => `${i.name} (€${i.price}, cat: ${i.category})`).join(", ");
      const cartIds = new Set((cartItems || []).map((i: any) => i.id));
      
      const availableItems = (menuItems || [])
        .filter((m: any) => !cartIds.has(m.id) && m.is_active !== false)
        .map((m: any) => `"${m.name}" (€${m.price}, cat: ${m.category}, id: "${m.id}")`).join("\n");

      const prompt = `Sei un esperto di vendita nel settore della ristorazione. Il carrello contiene: ${cartDesc}.

Prodotti disponibili:
${availableItems}

Suggerisci 3 prodotti complementari che massimizzino lo scontrino. Considera abbinamenti gastronomici reali, margini e appeal visivo.

Rispondi SOLO JSON:
{
  "suggestions": [
    { "menu_item_id": "id", "name": "nome", "price": numero, "reason": "motivo breve (max 60 char)" }
  ],
  "message": "frase accattivante per il cliente (max 60 char)"
}`;

      const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "Esperto di vendita ristorazione. Solo JSON valido." },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!resp.ok) {
        await trackUsage("cross-sell-genius", "google/gemini-2.5-flash", start, "error", restaurantId);
        throw new Error(`AI error: ${resp.status}`);
      }

      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content || "{}";
      let result: any = {};
      try { const m = content.match(/\{[\s\S]*\}/); if (m) result = JSON.parse(m[0]); } catch {}

      await trackUsage("cross-sell-genius", "google/gemini-2.5-flash", start, "success", restaurantId);
      return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Azione sconosciuta" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("ai-sommelier error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Errore sconosciuto" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
