import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALL_SECTORS = [
  { id: "food", label: "Ristorazione", keywords: "ristorante pizzeria bar caffè trattoria osteria pub bistrot sushi bakery pasticceria gelateria paninoteca tavola calda" },
  { id: "ncc", label: "NCC & Transfer", keywords: "noleggio conducente transfer taxi limousine auto con autista trasporto privato shuttle aeroporto" },
  { id: "beauty", label: "Beauty & Wellness", keywords: "parrucchiere salone barbiere estetista spa centro estetico nail manicure pedicure massaggi solarium" },
  { id: "healthcare", label: "Healthcare", keywords: "medico dottore clinica studio dentista odontoiatra fisioterapia osteopata psicologo veterinario farmacia laboratorio" },
  { id: "retail", label: "Retail & E-commerce", keywords: "negozio shop boutique abbigliamento scarpe gioielleria profumeria cartoleria ferramenta" },
  { id: "fitness", label: "Fitness & Sport", keywords: "palestra gym crossfit yoga pilates piscina centro sportivo personal trainer" },
  { id: "hospitality", label: "Hotel & Hospitality", keywords: "hotel albergo b&b bed breakfast resort pensione casa vacanze affittacamere" },
  { id: "beach", label: "Stabilimento Balneare", keywords: "lido stabilimento balneare spiaggia beach club chalet mare ombrellone" },
  { id: "plumber", label: "Idraulico", keywords: "idraulico plumber tubazioni impianti idrici riscaldamento caldaia termoidraulica" },
  { id: "electrician", label: "Elettricista", keywords: "elettricista impianti elettrici domotica fotovoltaico pannelli solari" },
  { id: "agriturismo", label: "Agriturismo", keywords: "agriturismo fattoria azienda agricola cantina vino olio frantoio" },
  { id: "cleaning", label: "Pulizie", keywords: "pulizie impresa pulizia sanificazione disinfezione lavanderia" },
  { id: "legal", label: "Studio Legale", keywords: "avvocato studio legale notaio consulenza legale diritto" },
  { id: "accounting", label: "Commercialista", keywords: "commercialista contabilità consulente fiscale caf patronato" },
  { id: "garage", label: "Officina Auto", keywords: "officina meccanico carrozzeria autolavaggio gommista revisione tagliando" },
  { id: "photography", label: "Fotografia", keywords: "fotografo studio fotografico videografo wedding matrimonio eventi" },
  { id: "construction", label: "Edilizia", keywords: "impresa edile costruzioni ristrutturazioni muratore geometra architetto" },
  { id: "gardening", label: "Giardinaggio", keywords: "giardiniere vivaio garden center paesaggista manutenzione verde" },
  { id: "veterinary", label: "Veterinario", keywords: "veterinario clinica veterinaria animali pet shop toelettatura" },
  { id: "tattoo", label: "Tattoo Studio", keywords: "tatuatore tattoo piercing body art studio tatuaggi" },
  { id: "childcare", label: "Infanzia", keywords: "asilo nido scuola infanzia ludoteca baby sitter doposcuola" },
  { id: "education", label: "Formazione", keywords: "scuola corsi formazione accademia università tutor lezioni ripetizioni" },
  { id: "events", label: "Eventi", keywords: "eventi catering wedding planner organizzazione feste location sala ricevimenti" },
  { id: "logistics", label: "Logistica", keywords: "corriere spedizioni logistica magazzino trasporti consegne" },
  { id: "custom", label: "Settore Custom", keywords: "altro personalizzato custom generico" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query, source } = await req.json();
    // source can be: "instagram", "website", "google_maps", "text"
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const sectorList = ALL_SECTORS.map(s => `- ${s.id}: ${s.label} (${s.keywords})`).join("\n");

    const systemPrompt = `Sei un esperto di business intelligence italiano. Il tuo compito è analizzare un prospect (dal suo profilo Instagram, sito web, scheda Google Maps, o descrizione testuale) e determinare:

1. **Il settore più adatto** tra questi settori disponibili:
${sectorList}

2. **Una breve analisi** del prospect (2-3 frasi) con i pain points principali
3. **Il motivo** per cui quel settore è il più adatto
4. **Un consiglio** su quale canale di contatto usare (DM, WhatsApp, Email, Porta a porta)

RISPONDI SOLO in formato JSON valido con questa struttura esatta:
{
  "sector_id": "food",
  "sector_label": "Ristorazione",
  "confidence": 95,
  "analysis": "Breve analisi del prospect...",
  "reason": "Motivo della scelta...",
  "suggested_channel": "whatsapp",
  "channel_reason": "Motivo del canale...",
  "pain_points": ["Pain point 1", "Pain point 2", "Pain point 3"],
  "opening_line": "Una frase di apertura personalizzata per questo prospect..."
}

Se non riesci a determinare il settore, usa "custom" con confidence bassa.
NON aggiungere testo fuori dal JSON.`;

    const userPrompt = `Analizza questo prospect e suggerisci il settore migliore:

Fonte: ${source || "text"}
Input: ${query}

Determina il settore più pertinente dalla lista, con un'analisi intelligente.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Troppi messaggi, riprova tra poco." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "Crediti AI esauriti." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    
    // Clean markdown fences if present
    content = content.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    
    let result;
    try {
      result = JSON.parse(content);
    } catch {
      result = { sector_id: "custom", sector_label: "Settore Custom", confidence: 30, analysis: content, reason: "Analisi non strutturata", suggested_channel: "email", channel_reason: "", pain_points: [], opening_line: "" };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("recommend-sector error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
