// Seller Coach Chat — risposta AI contestuale per il drawer "Coach Empire" del seller.
// L'AI riceve il chapter corrente come contesto e risponde in modo super pratico (italiano).
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, context } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `Sei "Coach Empire", l'assistente AI dei venditori della piattaforma Empire AI.
Sei super-pratico, parli italiano, vai dritto al punto, dai consigli operativi azionabili in 1 minuto.
Mai disclaimer legali. Mai "non posso aiutarti": se non sai una cosa, suggerisci come scoprirla nell'app.
Lo stile è quello di un mentore di vendita esperto: empatico ma diretto, con numeri concreti.

CONTESTO PAGINA CORRENTE: ${context?.title || "Dashboard"}
COSA FA LA PAGINA: ${context?.whatItDoes || "—"}
BEST PRACTICE NOTE: ${(context?.bestPractices || []).join(" | ")}
ERRORI DA EVITARE: ${(context?.pitfalls || []).join(" | ")}
AUTOMAZIONI DISPONIBILI: ${(context?.automations || []).map((a: any) => `${a.label}: ${a.description}`).join(" | ")}

REGOLE RISPOSTA:
- Massimo 4 frasi a meno che il venditore chieda dettagli
- Usa bullet • per liste corte
- Cita numeri/percentuali concreti quando puoi
- Suggerisci sempre il "prossimo passo" alla fine`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Limite richieste raggiunto, riprova tra poco." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "Crediti AI esauriti. Aggiungi fondi in Settings." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      const txt = await response.text();
      console.error("AI gateway error", response.status, txt);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (err) {
    console.error("seller-coach-chat error", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
