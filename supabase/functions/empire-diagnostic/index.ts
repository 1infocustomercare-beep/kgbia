import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SECTORS_BLURB = `Empire è la piattaforma all-in-one che copre 25+ settori: ristorazione, NCC/transfer, beauty, healthcare, retail, fitness, hospitality, beach, agriturismo, idraulici, elettricisti, edilizia, giardinaggio, pulizie, garage, veterinari, tatuatori, asili, legale, contabilità, fotografia, eventi, logistica e altro.`;

const SYSTEM = `Sei l'AI di Empire — diagnostico commerciale di Empire, la piattaforma all-in-one multi-settore per imprenditori italiani.
${SECTORS_BLURB}

I 3 pacchetti Empire (sempre da consigliare uno):
- STARTER (€97/mese): sito vetrina, prenotazioni/ordini, CRM base, 1 agente AI.
- PRO (€297/mese): tutto Starter + automazioni WhatsApp, 5 agenti AI (Arianna venditrice, recensioni, social), analytics avanzata.
- EMPIRE (€697/mese): tutto Pro + agenti vocali, ROI dossier, autopilot multi-canale, manager dedicato, on-premise integrations.

Quando ricevi un problema dell'imprenditore, rispondi SEMPRE in JSON valido con questa struttura:
{
  "diagnosis": "1 frase chiara che riformula il problema in chiave business",
  "rootCauses": ["causa 1", "causa 2", "causa 3"],
  "solution": "2 frasi: cosa fa Empire concretamente per risolvere",
  "features": ["feature Empire 1", "feature Empire 2", "feature Empire 3", "feature Empire 4"],
  "recommendedPlan": "Starter|Pro|Empire",
  "estimatedMonthlyGain": "stima in € realistica, es. '+ €1.200 / mese'",
  "timeToValue": "tempo realistico, es. '14 giorni'",
  "nextStep": "1 CTA breve, es. 'Prenota demo 15 min'"
}
NON aggiungere testo fuori dal JSON. Italiano sempre.`;

interface Body {
  mode: "diagnostic" | "custom";
  sector?: string;
  problem?: string;
  businessName?: string;
  email?: string;
  phone?: string;
  monthlyRevenue?: number;
  freeText?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as Body;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY mancante");

    const userMsg =
      body.mode === "custom"
        ? `Settore: ${body.sector ?? "non specificato"}\nNome attività: ${body.businessName ?? "n/d"}\nFatturato mensile: ${body.monthlyRevenue ?? "n/d"}\nRichiesta su misura: ${body.freeText ?? ""}`
        : `Settore: ${body.sector ?? "non specificato"}\nProblema: ${body.problem ?? body.freeText ?? ""}`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userMsg },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (aiResp.status === 429) {
      return new Response(JSON.stringify({ error: "rate_limited" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiResp.ok) {
      const t = await aiResp.text();
      throw new Error(`AI gateway: ${aiResp.status} ${t}`);
    }

    const aiJson = await aiResp.json();
    const raw = aiJson?.choices?.[0]?.message?.content ?? "{}";
    let parsed: Record<string, unknown> = {};
    try { parsed = JSON.parse(raw); } catch { parsed = { diagnosis: raw }; }

    // If contact info provided → save as lead (service role)
    if (body.email || body.phone) {
      try {
        const supa = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
        );
        await supa.from("leads").insert({
          name: body.businessName || "Lead Homepage",
          email: body.email ?? null,
          phone: body.phone ?? null,
          sector: body.sector ?? "",
          source: body.mode === "custom" ? "homepage_questionnaire" : "homepage_diagnostic",
          notes: body.problem || body.freeText || "",
          ai_summary: typeof parsed.diagnosis === "string" ? parsed.diagnosis : "",
          pain_points: typeof parsed.rootCauses === "object" ? (parsed.rootCauses as string[]) : [],
          lead_source_data: { diagnostic: parsed, monthlyRevenue: body.monthlyRevenue ?? null },
          ai_score: 75,
        });
      } catch (e) {
        console.error("lead insert failed", e);
      }
    }

    return new Response(JSON.stringify({ ok: true, result: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("empire-diagnostic error", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
