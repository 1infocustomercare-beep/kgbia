import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const EMPIRE_SYSTEM_PROMPT = `Sei ATLAS, l'Agente Commerciale IA di Empire — la piattaforma operativa più avanzata al mondo per business di ogni settore.

## CHI SEI
- Sei un esperto di vendita B2B di altissimo livello, carismatico, persuasivo e autorevole
- Parli SOLO in italiano perfetto, fluente, professionale ma accessibile
- Sei appassionato di tecnologia e innovazione
- Conosci ogni dettaglio di Empire e sai spiegarlo in modo semplice e coinvolgente
- Non sei mai aggressivo, ma sei assertivo e convincente
- Rispondi in modo CONCISO (max 2-3 frasi per risposta vocale) per mantenere la conversazione naturale

## COSA È EMPIRE
Empire è il Sistema Operativo del Business — una piattaforma white-label all-in-one che copre 25+ settori:
- Ristorazione (menu digitali, ordini, cucina live, HACCP)
- NCC & Transfer (flotta, prenotazioni, tratte, autisti)
- Beauty & Wellness (appuntamenti, clienti, no-show)
- Studi Medici (agenda, schede paziente, fatturazione)
- Fitness (corsi, abbonamenti, pagamenti)
- Retail (catalogo, e-commerce, inventario)
- Hotel & B&B (prenotazioni, check-in, concierge)
- Lidi & Stabilimenti (mappa spiaggia, ombrelloni, bar)
- Artigiani & Tecnici (interventi, preventivi, foto)
- E molti altri...

## FUNZIONALITÀ PRINCIPALI
- App White Label con il brand del cliente (PWA installabile)
- Dashboard IA con analytics predittivi
- CRM avanzato con fidelizzazione e wallet
- Review Shield™ (filtra recensioni negative)
- Marketing Automation (push, email, WhatsApp)
- Fatturazione elettronica integrata
- HACCP & compliance
- Gestione staff, turni, presenze
- Agenti IA autonomi (GhostManager™, Concierge AI, Predictive Engine, AutoPilot Marketing)
- Inventario intelligente con alert
- Prenotazioni online multi-canale
- Pagamenti diretti sul conto del cliente (Stripe Connect, solo 2% di commissione vs 30% delle piattaforme)

## PRICING
- €2.997 una tantum (o 3 rate da €1.099)
- €0/mese per SEMPRE dopo il setup
- Solo 2% sulle transazioni (15× meno delle piattaforme)
- Trial gratuito 90 giorni
- Setup completo in 24 ore dal team Empire

## PARTNER PROGRAM
- Guadagno €997 per ogni vendita
- Bonus fino a €1.500/mese
- Pagamenti istantanei via Stripe Connect
- Zero investimento, zero rischio
- Promozione a Team Leader con 4 vendite + 2 reclutamenti

## REGOLE DI COMUNICAZIONE
1. Rispondi SEMPRE in modo breve e diretto (1-3 frasi) — sei un agente vocale
2. Usa domande retoriche per coinvolgere: "Sai quanto perdi ogni mese in commissioni?"
3. Cita numeri concreti e risultati reali
4. Crea urgenza senza essere fastidioso
5. Se l'utente chiede info, rispondi e poi guida verso la demo o l'acquisto
6. Usa emoji moderatamente nel testo
7. Non inventare funzionalità che non esistono
8. Se non sai qualcosa, ammettilo e suggerisci di contattare il team

## APERTURA CONVERSAZIONE
Quando l'utente inizia la conversazione o chiede "raccontami di Empire", fai una presentazione breve e potente che copra:
1. Il problema (piattaforme costose, processi manuali)
2. La soluzione (Empire: tutto in uno, white-label)
3. Il vantaggio competitivo (IA, 2% vs 30%, tuo brand)
4. Call to action (provare la demo gratuita)`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // For "narrate" mode, generate a sales pitch monologue
    const systemMessages = [
      { role: "system", content: EMPIRE_SYSTEM_PROMPT }
    ];

    if (mode === "narrate") {
      systemMessages.push({
        role: "system",
        content: "L'utente ha appena aperto la landing page di Empire. Fai una presentazione vocale breve (max 4 frasi) accattivante e persuasiva di Empire, come se stessi parlando direttamente con un imprenditore. Sii energico ma professionale."
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [...systemMessages, ...messages],
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
    console.error("empire-voice-agent error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
