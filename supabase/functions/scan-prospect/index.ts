import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const channelRules: Record<string, string> = {
  dm: `FORMATO: DM Instagram/Social
- MAX 500 caratteri (Instagram tronca i messaggi lunghi)
- 3-4 righe massimo, diretto e incisivo
- Apri con un complimento SPECIFICO sul loro profilo
- Chiudi con il link demo e una domanda aperta
- Tono: informale ma professionale, come un collega del settore
- Usa 2-3 emoji massimo
- NO oggetto, NO firma formale`,

  whatsapp: `FORMATO: Messaggio WhatsApp
- MAX 800 caratteri
- Usa formattazione WhatsApp: *grassetto*, _corsivo_
- Struttura: saluto → complimento → proposta → link → CTA
- Tono: cordiale, diretto, come un consulente che ti scrive
- 3-4 emoji massimo
- Includi il link demo cliccabile
- Chiudi con "Posso chiamarti 2 minuti per mostrarti?"`,

  email: `FORMATO: Email Professionale Premium
- Struttura completa con Oggetto (in prima riga, formato "Oggetto: ...")
- 4-5 paragrafi ben strutturati
- Sezione dedicata al link demo del settore e al link catalogo completo
- Includi pricing sintetico (da €79/mese, 90gg gratis)
- Firma professionale con Empire AI Group
- Tono: autorevole, consulenziale, premium
- Emoji solo nei bullet points`,

  pitch: `FORMATO: Script Porta a Porta / Chiamata
- Struttura: APERTURA (10 sec) → PROBLEMA (15 sec) → SOLUZIONE (20 sec) → DEMO (mostra link) → CHIUSURA
- Linguaggio parlato, naturale, persuasivo
- Includi obiezioni comuni e risposte pronte
- Indica dove mostrare il telefono con la demo
- Tono: sicuro, entusiasta ma non aggressivo`,

  link: `FORMATO: Messaggio breve per condivisione link
- MAX 300 caratteri
- Una frase d'impatto + link demo + CTA
- Perfetto per bio link, stories, post caption
- Diretto e memorabile`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { instagram, website, sector, channel, demoLink, allDemosLink, contactInfo } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const targetInfo: string[] = [];
    if (instagram) targetInfo.push(`Instagram handle: @${instagram.replace("@", "")}`);
    if (website) targetInfo.push(`Website: ${website}`);

    const ch = channel || "dm";
    const formatRules = channelRules[ch] || channelRules.dm;

    const systemPrompt = `Sei un esperto di vendita B2B per Empire AI Group, un'agenzia che vende app e piattaforme digitali personalizzate per attività locali.

Il tuo compito è analizzare il profilo/sito di un prospect e generare un messaggio di vendita ULTRA personalizzato, OTTIMIZZATO per il canale di comunicazione specificato.

${formatRules}

REGOLE GENERALI:
- Cita dettagli SPECIFICI del loro business (nome, tipo di servizi, stile, location)
- Identifica i loro PAIN POINTS specifici basandoti sul settore
- Proponi la soluzione Empire come naturale evoluzione del loro business
- NON usare frasi generiche, tutto deve sembrare scritto apposta per loro
- NON inventare dati che non puoi sapere, usa deduzioni logiche

LINK DA INSERIRE NEL MESSAGGIO:
- Link demo settore: ${demoLink || "{{DEMO_LINK}}"}
- Catalogo completo: ${allDemosLink || "{{ALL_DEMOS_LINK}}"}
- Contatto: ${contactInfo || "{{CONTACT_INFO}}"}

Inserisci i link nel punto più naturale del messaggio, NON come placeholder.`;

    const userPrompt = `Analizza questo prospect nel settore "${sector || "generico"}" e genera un messaggio di vendita ultra-personalizzato per il canale "${ch}":

${targetInfo.join("\n")}

Genera il messaggio ottimizzato. Ricorda: deve sembrare scritto apposta per loro e deve rispettare PERFETTAMENTE il formato del canale.`;

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
