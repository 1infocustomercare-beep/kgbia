import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function buildSystemPrompt(restaurantName: string, menuItems: any[]) {
  const menuText = menuItems
    .map((item: any) => `- ${item.name} (€${item.price.toFixed(2)}) — ${item.category}${item.description ? ': ' + item.description : ''}`)
    .join("\n");

  return `Sei l'assistente AI del ristorante "${restaurantName}". Il tuo compito è aiutare i clienti a ordinare dal menu.

## REGOLE FONDAMENTALI
1. Rispondi SEMPRE in italiano, in modo cortese, professionale e conciso (max 2-3 frasi)
2. Conosci SOLO i piatti nel menu sotto. Non inventare MAI piatti che non esistono
3. Quando il cliente chiede di ordinare, conferma ESATTAMENTE cosa vuole con nome e prezzo
4. Se un piatto non è nel menu, dillo gentilmente e suggerisci alternative simili
5. Quando il cliente conferma l'ordine, rispondi con un JSON speciale nel formato sotto

## MENU COMPLETO
${menuText}

## COME PRENDERE UN ORDINE
1. Saluta il cliente e chiedi cosa desidera
2. Quando sceglie un piatto, conferma nome, prezzo e chiedi la quantità
3. Chiedi se vuole aggiungere altro
4. Quando il cliente dice "basta" o "è tutto", conferma il riepilogo con il totale
5. Dopo la conferma finale, genera il JSON dell'ordine

## FORMATO ORDINE CONFERMATO
Quando il cliente conferma definitivamente l'ordine, ALLA FINE del tuo messaggio aggiungi ESATTAMENTE questo blocco (su una riga separata):
\`\`\`order
[{"name":"Nome Piatto","qty":1,"price":12.00},{"name":"Altro Piatto","qty":2,"price":8.00}]
\`\`\`

IMPORTANTE: Genera il blocco order SOLO quando il cliente ha confermato tutto. Mai prima.

## STILE
- Sii caloroso e accogliente, come un cameriere esperto
- Suggerisci abbinamenti (es. "Con la carbonara consiglio un bel calice di Chianti!")
- Se il cliente chiede consigli, suggerisci i piatti più popolari
- Non parlare di prezzi a meno che non te lo chiedano
- Usa emoji con moderazione 🍝`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, restaurantName, menuItems } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!menuItems || !Array.isArray(menuItems) || menuItems.length === 0) {
      return new Response(JSON.stringify({ error: "Menu non disponibile" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = buildSystemPrompt(restaurantName || "Ristorante", menuItems);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Troppi messaggi, riprova tra poco." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crediti AI esauriti." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("restaurant-voice-agent error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
