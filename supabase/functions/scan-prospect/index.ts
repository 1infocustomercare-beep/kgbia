import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { instagram, website, sector } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const targetInfo: string[] = [];
    if (instagram) targetInfo.push(`Instagram handle: @${instagram.replace("@", "")}`);
    if (website) targetInfo.push(`Website: ${website}`);

    const systemPrompt = `Sei un esperto di vendita B2B per Empire AI Group, un'agenzia che vende app e piattaforme digitali personalizzate per attività locali.

Il tuo compito è analizzare il profilo/sito di un prospect e generare un messaggio di vendita ULTRA personalizzato.

REGOLE:
- Cita dettagli SPECIFICI del loro business (nome, tipo di servizi, stile, location)
- Identifica i loro PAIN POINTS specifici basandoti sul settore
- Proponi la soluzione Empire come naturale evoluzione del loro business
- Il tono deve essere professionale ma amichevole, come un consulente esperto
- NON usare frasi generiche, tutto deve sembrare scritto apposta per loro
- Includi emoji appropriate ma non esagerare
- Il messaggio deve essere lungo 4-6 paragrafi
- Includi il placeholder {{DEMO_LINK}} dove va il link demo
- Includi il placeholder {{CONTACT_INFO}} dove va il contatto
- NON inventare dati che non puoi sapere, usa deduzioni logiche`;

    const userPrompt = `Analizza questo prospect nel settore "${sector || "generico"}" e genera un messaggio DM Instagram ultra-personalizzato per convertirlo:

${targetInfo.join("\n")}

Genera il messaggio di vendita personalizzato. Ricorda: deve sembrare che hai studiato a fondo la loro attività.`;

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
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Troppi messaggi, riprova tra poco." }), {
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
    const message = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("scan-prospect error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
