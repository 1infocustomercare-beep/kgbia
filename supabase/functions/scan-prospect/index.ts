import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/* ═══ PORTFOLIO REFERENCES ═══ */
const PORTFOLIO_CATALOG = `
PORTFOLIO EMPIRE AI — PROGETTI REALI:

🍽️ FOOD: "COTE Miami" (Korean BBQ Michelin), "Paperfish Sushi" (Omakase), "Flame Kebab" (Grill), "La Vang Vietnamese", "Batey Cevicheria"
💅 BEAUTY: "Neo Nails Brickell" (Nail Art), "Tatush Hair & Fragrance" (Salone)
🚗 NCC: "Amalfi Luxury Transfer" (Chauffeur), "Miami Boats Rental" (Yacht), "Asinara Charter"
🏋️ FITNESS: "City Padel Milano" (Padel/Sport)
🏥 HEALTHCARE: "FAR Medical" (Clinica)
🐾 VETERINARY: "Aloha Pet Resort"
🔧 TRADES: "Nick's Plumbing & AC"
🏖️ BEACH: "Miami Watersports"

REGOLA: Cita SEMPRE il progetto più simile al prospect come prova concreta.`;

/* ═══ SECTOR PAIN POINTS ═══ */
const SECTOR_PAIN_POINTS: Record<string, string> = {
  ristorazione: "No-show 20%, commissioni Deliveroo 25-35%, menu cartaceo senza upselling, recensioni negative, zero fidelizzazione. → App zero commissioni, menu AI, Review Shield™, CRM loyalty.",
  food: "No-show 20%, commissioni Deliveroo 25-35%, menu cartaceo senza upselling, recensioni negative, zero fidelizzazione. → App zero commissioni, menu AI, Review Shield™, CRM loyalty.",
  beauty: "Appuntamenti mancati €150/giorno, agenda caotica, zero scheda cliente digitale, difficoltà pacchetti. → Booking 24/7, scheda cliente, pacchetti/gift card, portfolio AI social.",
  hotel: "Commissioni Booking 15-25%, check-in lento, zero upselling digitale. → Booking diretto, check-in digitale, concierge AI, gestione reputazione.",
  hospitality: "Commissioni Booking 15-25%, check-in lento, zero upselling digitale. → Booking diretto, check-in digitale, concierge AI.",
  ncc: "Prenotazioni telefoniche = errori, zero tracking live, fatturazione manuale. → Booking online, tracking live, gestione flotta, fatturazione automatica.",
  fitness: "Abbandono 40% dopo 3 mesi, classi vuote, abbonamenti su carta. → App prenotazione, notifiche AI, gestione abbonamenti, community.",
  retail: "E-commerce big vs locale, inventario manuale, zero fidelizzazione. → Catalogo digitale, loyalty, notifiche push, click & collect.",
  healthcare: "Appuntamenti mancati €80/slot, cartelle cartacee, GDPR. → Prenotazioni con reminder, cartella digitale, telemedicina.",
  beach: "Prenotazioni telefono = caos, servizi extra non tracciati. → Mappa spiaggia, booking online, loyalty stagionale.",
  plumber: "Preventivi a voce, zero tracking interventi. → Preventivi digitali, tracking, CRM follow-up automatico.",
  electrician: "Preventivi a voce, zero tracking interventi. → Preventivi digitali, tracking, CRM follow-up automatico.",
  veterinary: "Appuntamenti mancati, cartelle cartacee. → Booking online, schede animali digitali, reminder vaccini.",
  tattoo: "Portfolio solo su Instagram, zero booking online. → Portfolio professionale, booking, consent form digitale.",
  photography: "Portfolio disperso, preventivi manuali. → Portfolio professionale, booking sessioni, consegna digitale.",
  events: "Gestione eventi su email/carta. → Dashboard eventi, CRM, preventivi automatici, coordinamento team.",
  construction: "Preventivi contestati, cantieri non tracciati. → Preventivi digitali con firma, tracking cantieri, fatturazione.",
  gardening: "Interventi stagionali non coordinati. → Calendario interventi, CRM clienti, preventivi automatici.",
  legal: "Appuntamenti mancati, documenti cartacei. → Booking, archiviazione digitale, portale clienti.",
  accounting: "Scadenze fiscali dimenticate, documenti dispersi. → Dashboard scadenze, portale clienti, notifiche automatiche.",
};

/* ═══ CHANNEL-SPECIFIC RULES — il cuore della personalizzazione ═══ */
const channelRules: Record<string, string> = {
  instagram: `FORMATO: DM Instagram
REGOLE CRITICHE:
- MAX 400 caratteri — Instagram tronca i messaggi lunghi nei DM
- 3-4 righe MASSIMO, senza formattazione speciale (no grassetto, no corsivo — Instagram non li supporta)
- APRI con un'osservazione SPECIFICA su un loro post/foto/reel recente — dimostra che hai guardato il profilo
- STILE conversazionale, come se fossi un follower che ha scoperto qualcosa di utile per loro
- Usa 1-2 emoji MAX, posizionati strategicamente
- Chiudi con link demo + domanda breve che invita alla risposta
- VIETATO: "Ho visto il tuo profilo", "Ciao ti scrivo perché", "Complimenti per il profilo" — sono spam
- TONO: Giovane ma professionale, da insider del settore
- Il messaggio deve sembrare una conversazione naturale, NON un pitch di vendita
ESEMPIO STRUTTURA:
[osservazione specifica su un loro contenuto] → [riferimento a progetto simile nostro] → [1 beneficio concreto] → [link] → [domanda]`,

  whatsapp: `FORMATO: Messaggio WhatsApp Business
REGOLE CRITICHE:
- MAX 800 caratteri — i messaggi troppo lunghi vengono ignorati
- USA formattazione WhatsApp nativa: *grassetto* per dati importanti, _corsivo_ per enfasi
- STRUTTURA in blocchi visivi separati da una riga vuota per leggibilità
- Apri con saluto cordiale + nome dell'attività — dimostra che non è un messaggio di massa
- INCLUDI un dato numerico credibile del settore (es: "il 73% dei ristoranti che usano...")
- Cita il progetto portfolio più simile con link demo
- Chiudi con CTA chiaro e semplice (es: "posso mandarvi un video di 60 secondi?")
- 2-3 emoji strategici (✅ per benefici, 👉 per link, 📊 per dati)
- TONO: Consulente di fiducia, professionale ma accessibile
- VIETATO: messaggi generici tipo "siamo un'agenzia che...", elenchi puntati infiniti
ESEMPIO STRUTTURA:
Saluto + nome attività
→ Osservazione specifica + pain point
→ "Abbiamo già realizzato *[PROGETTO]* — guardate: [link]"
→ Dato numerico + beneficio concreto
→ CTA con domanda`,

  email: `FORMATO: Email Professionale B2B
REGOLE CRITICHE:
- Prima riga = OGGETTO email (formato "Oggetto: [max 60 char, specifico e non clickbait]")
- 4-5 paragrafi brevi e strutturati con logica AIDA (Attenzione → Interesse → Desiderio → Azione)
- PARAGRAFO PORTFOLIO obbligatorio: "Per darvi un'idea concreta, abbiamo realizzato [PROGETTO X] per [tipo attività] — potete vedere la demo qui: [link]"
- Includi 2-3 dati numerici credibili del settore
- Usa elenchi puntati (max 3-4 punti) per i benefici chiave
- FIRMA professionale:
  ---
  Nome Cognome
  Empire AI Group — Digital Transformation Partner
  📩 info@empireaigroup.com
- TONO: C-level, autorevole, consulenziale — come McKinsey che scrive a un imprenditore
- L'email deve far pensare "questa non è la solita agenzia web"
- VIETATO: "Gentilissimo", "Mi permetto di contattarla", formule burocratiche italiane
ESEMPIO STRUTTURA:
Oggetto: [specifico e intrigante]
[Osservazione specifica sull'attività]
[Pain point con dato numerico]
[Soluzione Empire + riferimento portfolio]
[CTA meeting/call]
[Firma]`,

  pitch: `FORMATO: Script Chiamata Telefonica / Visita
REGOLE CRITICHE:
- Struttura temporizzata: APERTURA (30s) → AGGANCIO (30s) → DEMO DA TELEFONO (60s) → GESTIONE OBIEZIONI → CHIUSURA (30s)
- MOSTRA dal telefono un progetto simile: "Guardate cosa abbiamo fatto per [PROGETTO], un'attività come la vostra..."
- Include indicazioni fisiche: [mostra telefono], [pausa], [sorridi], [aspetta risposta]
- Linguaggio PARLATO naturale — non deve sembrare letto
- Prepara 3 risposte per obiezioni comuni: "costa troppo", "ci penso", "ho già un sito"
- TONO: Sicuro, entusiasta ma non aggressivo`,

  link: `FORMATO: Messaggio breve per condivisione link (SMS, messaggio veloce)
REGOLE CRITICHE:
- MAX 200 caratteri TOTALI
- Una frase d'impatto + link + emoji
- TONO: Diretto, curioso, urgente ma non spam`,
};

/* ═══ SYSTEM PROMPT BUILDER ═══ */
function buildSystemPrompt(sector: string, formatRules: string, demoLink: string, allDemosLink: string, contactInfo: string): string {
  const painPoints = SECTOR_PAIN_POINTS[sector] || SECTOR_PAIN_POINTS[sector.toLowerCase()] || `Settore: ${sector}. Analizza i pain points specifici.`;

  return `Sei un Senior Business Development Consultant di Empire AI Group — agenzia leader in trasformazione digitale per attività locali. 15 anni di esperienza nel settore "${sector}".

${PORTFOLIO_CATALOG}

PAIN POINTS: ${painPoints}

${formatRules}

REGOLE INVIOLABILI:
- OGNI parola ha uno scopo. Zero filler, zero frasi generiche.
- CITA almeno 1 progetto reale del portfolio come prova di competenza.
- NON iniziare MAI con frasi generiche ("Ho visto il tuo profilo", "Ciao, ti scrivo perché").
- PERSONALIZZA chirurgicamente: usa il nome dell'attività, la città, dettagli specifici.
- Il tono si ADATTA: premium per luxury, energico per sport, caldo per family business, tecnico per B2B.
- Inserisci i link nel punto più NATURALE del discorso, mai forzati.
- Il messaggio deve far pensare: "Questo ha capito il mio business E ha già fatto qualcosa di simile."

LINK DISPONIBILI:
- Demo settore: ${demoLink || "{{DEMO_LINK}}"}
- Catalogo completo: ${allDemosLink || "{{ALL_DEMOS_LINK}}"}
- Contatto: ${contactInfo || "info@empireaigroup.com"}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { instagram, website, sector, channel, demoLink, allDemosLink, contactInfo, leadName, leadCity, leadPhone, portfolioRef } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Map channel
    const ch = channel || "whatsapp";
    const formatRules = channelRules[ch] || channelRules.whatsapp;
    const sectorKey = (sector || "generico").toLowerCase();

    const systemPrompt = buildSystemPrompt(sectorKey, formatRules, demoLink || "", allDemosLink || "", contactInfo || "");

    // Build rich prospect context
    const prospectDetails: string[] = [];
    if (leadName) prospectDetails.push(`Nome attività: "${leadName}"`);
    if (leadCity) prospectDetails.push(`Città: ${leadCity}`);
    if (leadPhone) prospectDetails.push(`Telefono: ${leadPhone}`);
    if (instagram) prospectDetails.push(`Instagram: @${instagram.replace("@", "")}`);
    if (website) prospectDetails.push(`Sito web: ${website}`);
    if (portfolioRef) prospectDetails.push(`Progetto portfolio più simile: "${portfolioRef}"`);

    const userPrompt = `PROSPECT DA CONVERTIRE:
${prospectDetails.join("\n")}
Settore: "${sector || "generico"}"
Canale di invio: "${ch}" — IL MESSAGGIO DEVE RISPETTARE PERFETTAMENTE il formato ${ch.toUpperCase()}

GENERA IL MESSAGGIO:
1. Analizza il nome "${leadName || "N/A"}" per dedurre tipo di attività, posizionamento, target
2. Usa la città "${leadCity || "N/A"}" per riferimenti locali e contestuali
3. Seleziona il progetto portfolio più pertinente ${portfolioRef ? `(suggerito: "${portfolioRef}")` : ""}
4. Identifica il pain point PIÙ urgente per QUESTA specifica attività
5. Scrivi un messaggio nel formato ESATTO di "${ch}" che:
   - Dimostri conoscenza specifica dell'attività
   - Citi un progetto reale del portfolio come prova tangibile
   - Includa il link demo nel punto più naturale
   - Chiuda con una CTA che stimoli risposta immediata
6. Il messaggio deve essere PRONTO DA COPIARE E INCOLLARE — nessuna nota o spiegazione extra`;

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
        temperature: 0.8,
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

    return new Response(JSON.stringify({ message, channel: ch }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("scan-prospect error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
