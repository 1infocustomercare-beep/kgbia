import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/* ═══ PORTFOLIO REFERENCES ═══ */
const PORTFOLIO_CATALOG = `
PORTFOLIO EMPIRE AI — PROGETTI REALI CONSEGNATI:

🍽️ FOOD: "COTE Miami" (Korean BBQ Michelin), "Paperfish Sushi" (Omakase), "Flame Kebab", "La Vang Vietnamese", "Batey Cevicheria"
💅 BEAUTY: "Neo Nails Brickell" (Nail Art Premium), "Tatush Hair & Fragrance"
🚗 NCC: "Amalfi Luxury Transfer", "Miami Boats Rental", "Asinara Charter"
🏋️ FITNESS: "City Padel Milano"
🏥 HEALTHCARE: "FAR Medical"
🐾 VETERINARY: "Aloha Pet Resort"
🔧 TRADES: "Nick's Plumbing & AC"
🏖️ BEACH: "Miami Watersports"

REGOLA: Cita SEMPRE il progetto più pertinente come caso studio concreto, spiegando brevemente i risultati ottenuti.`;

/* ═══ SECTOR PAIN POINTS ═══ */
const SECTOR_PAIN_POINTS: Record<string, string> = {
  ristorazione: "No-show 20%, commissioni delivery 25-35%, zero fidelizzazione digitale. → App proprietaria zero commissioni, menu AI con upselling intelligente, Review Shield™, CRM loyalty automatico.",
  food: "No-show 20%, commissioni delivery 25-35%, zero fidelizzazione digitale. → App proprietaria zero commissioni, menu AI con upselling intelligente, Review Shield™, CRM loyalty automatico.",
  beauty: "Appuntamenti mancati ~€150/giorno, agenda frammentata, nessuna scheda cliente digitale. → Booking 24/7, scheda cliente con storico trattamenti, pacchetti/gift card, portfolio AI per social.",
  hotel: "Commissioni OTA 15-25%, check-in rallentato, zero upselling post-prenotazione. → Booking diretto, check-in digitale, concierge AI, gestione reputazione automatica.",
  hospitality: "Commissioni OTA 15-25%, check-in rallentato. → Booking diretto, check-in digitale, concierge AI personalizzato.",
  ncc: "Prenotazioni telefoniche = errori, nessun tracking in tempo reale. → Booking online istantaneo, tracking GPS live, gestione flotta centralizzata, fatturazione automatica.",
  fitness: "Abbandono 40% dopo i primi 3 mesi, classi semi-vuote. → App prenotazione classi, notifiche motivazionali AI, gestione abbonamenti, community engagement.",
  retail: "Competizione e-commerce vs locale, inventario manuale, zero programma fedeltà. → Catalogo digitale, loyalty program, notifiche push personalizzate, click & collect.",
  healthcare: "Slot persi per mancata presentazione, documentazione cartacea, compliance GDPR. → Prenotazioni con reminder automatici, cartella digitale sicura, telemedicina integrata.",
  beach: "Prenotazioni telefoniche = caos stagionale, servizi extra non tracciati. → Mappa spiaggia interattiva, booking online, loyalty pass stagionale.",
  plumber: "Preventivi a voce = contestazioni, nessun tracking interventi. → Preventivi digitali con firma, tracking interventi live, CRM follow-up automatico.",
  electrician: "Preventivi verbali, zero tracciabilità. → Preventivi digitali con firma, tracking, CRM follow-up.",
  veterinary: "Appuntamenti persi, cartelle animali cartacee. → Booking online, schede animali digitali, reminder vaccini automatici.",
  tattoo: "Portfolio solo Instagram, zero sistema di booking. → Portfolio professionale, booking integrato, consent form digitale.",
  photography: "Portfolio disperso su più piattaforme, preventivi manuali. → Portfolio unificato, booking sessioni, gallery consegna digitale.",
  events: "Gestione eventi frammentata tra email e carta. → Dashboard eventi centralizzata, CRM clienti, preventivi automatici.",
  construction: "Preventivi contestati, cantieri non documentati. → Preventivi digitali con firma, documentazione cantieri, fatturazione progressiva.",
  gardening: "Interventi stagionali non coordinati. → Calendario interventi, CRM clienti, preventivi e fatturazione automatici.",
  legal: "Appuntamenti mancati, documenti dispersi. → Booking online, archiviazione digitale sicura, portale clienti riservato.",
  accounting: "Scadenze fiscali dimenticate, documenti non organizzati. → Dashboard scadenze, portale clienti, notifiche automatiche proattive.",
};

/* ═══ CHANNEL RULES — Anti-Spam, Persuasivi, Professionali ═══ */
const channelRules: Record<string, string> = {
  instagram: `FORMATO: DM Instagram — Conversazione naturale, NON pitch di vendita
REGOLE CRITICHE:
- MAX 350 caratteri — messaggi concisi che invogliano a rispondere
- 3-4 righe MASSIMO, senza formattazione (Instagram non supporta grassetto/corsivo)
- APRI con un complimento GENUINO e SPECIFICO su qualcosa di loro (un piatto, un progetto, un post recente)
- Il tono deve essere come un professionista del settore che ha notato qualcosa di interessante — NON un venditore
- MOSTRA il valore senza "vendere": condividi il link demo come qualcosa che hai fatto per un'attività simile
- Usa 1 emoji MAX, naturale nel contesto
- Chiudi con una domanda APERTA che invita al dialogo (NON "ti interessa?")
- ❌ VIETATO: "Ho visto il tuo profilo", "Ti contatto perché", "Sei interessato a", "Offriamo", "I nostri servizi"
- ❌ VIETATO: Linguaggio da telemarketing, elenchi di features, percentuali di sconto
- ✅ OBIETTIVO: Il destinatario deve pensare "Che figata, voglio saperne di più" — NON "Ecco l'ennesimo spam"
STRUTTURA:
[complimento specifico genuino] → [collegamento naturale al caso studio] → [link demo come curiosità] → [domanda aperta]`,

  whatsapp: `FORMATO: Messaggio WhatsApp — Professionale ma personale, come un consulente di fiducia
REGOLE CRITICHE:
- MAX 600 caratteri — abbastanza per dare valore, non abbastanza per annoiare
- USA formattazione WhatsApp: *grassetto* SOLO per il nome dell'attività e 1 dato chiave
- STRUTTURA in 2-3 blocchi visivi separati da riga vuota
- Apri con saluto + nome attività — dimostra che NON è un messaggio di massa
- CONDIVIDI un insight utile sul loro settore — un dato, un trend, un'opportunità — PRIMA di parlare di te
- Presenta il caso studio come "abbiamo aiutato un'attività simile" con link demo
- CTA: domanda gentile che offre valore ("Posso condividervi un breve video di come funziona?")
- 1-2 emoji strategici (NO emoji a raffica)
- TONO: Consulente che porta valore, NON venditore che chiede attenzione
- ❌ VIETATO: "Siamo un'agenzia", elenchi di servizi, messaggi generici, tono urgente/pressante
- ❌ VIETATO: "Offerta limitata", "Solo per oggi", "Non perdere", pressione all'acquisto
- ✅ OBIETTIVO: Il titolare deve pensare "Questa persona capisce il mio business e mi sta portando valore"
STRUTTURA:
Saluto + *nome attività* + osservazione specifica
→ Insight di settore / dato interessante
→ "Abbiamo realizzato *[PROGETTO]* — guardate: [link]"
→ Domanda che offre valore`,

  email: `FORMATO: Email Professionale B2B — Consulenziale, Autorevole, Visivamente Impattante
REGOLE CRITICHE:
- Prima riga = "Oggetto: [max 50 char — specifico, intrigante, NO clickbait, NO tutto maiuscolo]"
- L'oggetto deve far pensare "Interessante, apro" — NON "Spam, elimino"
- 3-4 paragrafi brevi con logica: Valore → Prova → Proposta
- APRI con un'osservazione specifica sull'attività che dimostri ricerca genuina
- PARAGRAFO VALORE: condividi un insight utile sul settore PRIMA di parlare di Empire
- PARAGRAFO PORTFOLIO: "Per darvi un'idea concreta, abbiamo realizzato [PROGETTO] per [tipo attività simile] — potete esplorare la demo: [link]"
- Includi 1-2 dati di settore CREDIBILI e VERIFICABILI (niente statistiche inventate)
- CTA: proponi qualcosa di basso impegno ("Una call di 10 minuti per mostrarvi il progetto?")
- FIRMA professionale:
  ---
  Empire AI Group — Digital Transformation Partner
  📩 info@empireaigroup.com
  🌐 empireaigroup.com
- TONO: C-level consulenziale — come un partner strategico, NON un venditore
- L'email deve comunicare: "Siamo professionisti che hanno già ottenuto risultati nel vostro settore"
- ❌ VIETATO: "Gentilissimo/a", "Mi permetto di", "La disturbo", formule burocratiche
- ❌ VIETATO: Elenchi infiniti di features, toni aggressivi, urgenza artificiale, promesse esagerate
- ❌ VIETATO: "Sconto", "Offerta", "Gratis", "Solo per lei" — nessuna tattica da telemarketing
- ✅ OBIETTIVO: L'imprenditore deve pensare "Questi sono seri, hanno già fatto cose concrete, vale la pena parlarne"
STRUTTURA:
Oggetto: [specifico e professionale]
[Osservazione specifica sull'attività — mostra che hai fatto ricerca]
[Insight di settore con dato credibile]
[Caso studio Empire + link demo]
[CTA di basso impegno]
[Firma]`,

  pitch: `FORMATO: Script Chiamata/Visita — Naturale e Consulenziale
REGOLE CRITICHE:
- APERTURA (20s): Presentati brevemente, poi fai una domanda sul LORO business
- AGGANCIO (30s): Condividi un insight utile — "Sa che nel vostro settore il X% dei clienti..."
- DEMO (60s): Mostra dal telefono un progetto simile: "Guardi cosa abbiamo realizzato per [PROGETTO]"
- GESTIONE OBIEZIONI: Risposte empatiche per "costa troppo", "ci penso", "ho già un sito"
- CHIUSURA (20s): Proponi un follow-up di valore, NON una vendita
- Linguaggio PARLATO naturale — MAI robotico
- TONO: Entusiasta ma rispettoso, curioso del loro business`,

  link: `FORMATO: Messaggio breve per condivisione link
REGOLE CRITICHE:
- MAX 160 caratteri TOTALI
- Una frase che incuriosisce + link
- TONO: Diretto, professionale, NO spam`,
};

/* ═══ COUNTRY → LANGUAGE MAPPING ═══ */
const COUNTRY_LANGUAGES: Record<string, { lang: string; greeting: string }> = {
  IT: { lang: "Italiano", greeting: "Buongiorno" },
  US: { lang: "English", greeting: "Hi" },
  GB: { lang: "English", greeting: "Hi" },
  UK: { lang: "English", greeting: "Hi" },
  FR: { lang: "Français", greeting: "Bonjour" },
  DE: { lang: "Deutsch", greeting: "Hallo" },
  ES: { lang: "Español", greeting: "Hola" },
  PT: { lang: "Português", greeting: "Olá" },
  CH: { lang: "Deutsch", greeting: "Hallo" },
  AE: { lang: "English", greeting: "Hello" },
  AU: { lang: "English", greeting: "G'day" },
  BR: { lang: "Português Brasileiro", greeting: "Olá" },
  JP: { lang: "日本語", greeting: "こんにちは" },
  NL: { lang: "Nederlands", greeting: "Hallo" },
  BE: { lang: "Français", greeting: "Bonjour" },
  AT: { lang: "Deutsch", greeting: "Hallo" },
  MX: { lang: "Español", greeting: "Hola" },
  AR: { lang: "Español", greeting: "Hola" },
  CO: { lang: "Español", greeting: "Hola" },
  CL: { lang: "Español", greeting: "Hola" },
  CA: { lang: "English", greeting: "Hi" },
  IN: { lang: "English", greeting: "Hello" },
  CN: { lang: "中文", greeting: "您好" },
  KR: { lang: "한국어", greeting: "안녕하세요" },
  RU: { lang: "Русский", greeting: "Здравствуйте" },
  PL: { lang: "Polski", greeting: "Dzień dobry" },
  SE: { lang: "Svenska", greeting: "Hej" },
  NO: { lang: "Norsk", greeting: "Hei" },
  DK: { lang: "Dansk", greeting: "Hej" },
  FI: { lang: "Suomi", greeting: "Hei" },
  GR: { lang: "Ελληνικά", greeting: "Γεια σας" },
  TR: { lang: "Türkçe", greeting: "Merhaba" },
  SA: { lang: "العربية", greeting: "مرحبا" },
  IL: { lang: "עברית", greeting: "שלום" },
  TH: { lang: "ภาษาไทย", greeting: "สวัสดี" },
};

function detectLanguage(country?: string, leadCity?: string): { lang: string; greeting: string } {
  if (country && COUNTRY_LANGUAGES[country.toUpperCase()]) {
    return COUNTRY_LANGUAGES[country.toUpperCase()];
  }
  // Try to detect from city name patterns
  if (leadCity) {
    const cityLower = leadCity.toLowerCase();
    if (/paris|lyon|marseille|toulouse|nice|bordeaux|lille|strasbourg/i.test(cityLower)) return COUNTRY_LANGUAGES.FR;
    if (/london|manchester|birmingham|liverpool|edinburgh|leeds|bristol/i.test(cityLower)) return COUNTRY_LANGUAGES.GB;
    if (/new york|los angeles|chicago|houston|miami|dallas|san francisco|boston/i.test(cityLower)) return COUNTRY_LANGUAGES.US;
    if (/berlin|münchen|hamburg|frankfurt|köln|düsseldorf|stuttgart/i.test(cityLower)) return COUNTRY_LANGUAGES.DE;
    if (/madrid|barcelona|valencia|sevilla|málaga|bilbao|granada/i.test(cityLower)) return COUNTRY_LANGUAGES.ES;
    if (/lisboa|porto|faro|coimbra|braga/i.test(cityLower)) return COUNTRY_LANGUAGES.PT;
    if (/tokyo|osaka|kyoto|yokohama|nagoya|sapporo/i.test(cityLower)) return COUNTRY_LANGUAGES.JP;
    if (/são paulo|rio|brasília|salvador|fortaleza|curitiba/i.test(cityLower)) return COUNTRY_LANGUAGES.BR;
    if (/dubai|abu dhabi|sharjah/i.test(cityLower)) return COUNTRY_LANGUAGES.AE;
    if (/sydney|melbourne|brisbane|perth|adelaide/i.test(cityLower)) return COUNTRY_LANGUAGES.AU;
    if (/zürich|bern|genève|basel|lausanne/i.test(cityLower)) return COUNTRY_LANGUAGES.CH;
    if (/amsterdam|rotterdam|den haag|utrecht/i.test(cityLower)) return COUNTRY_LANGUAGES.NL;
  }
  // Default to Italian
  return COUNTRY_LANGUAGES.IT;
}

/* ═══ SYSTEM PROMPT BUILDER ═══ */
function buildSystemPrompt(sector: string, formatRules: string, demoLink: string, allDemosLink: string, contactInfo: string, language: string): string {
  const painPoints = SECTOR_PAIN_POINTS[sector] || SECTOR_PAIN_POINTS[sector.toLowerCase()] || `Settore: ${sector}. Analizza i pain points specifici del settore.`;

  return `Sei un Senior Business Development Consultant di Empire AI Group — partner di trasformazione digitale per attività locali e PMI. Il tuo approccio è CONSULENZIALE: porti valore prima di chiedere qualcosa.

LINGUA OBBLIGATORIA: Scrivi il messaggio INTERAMENTE in ${language}. Ogni parola del messaggio finale DEVE essere in ${language} — saluti, corpo, firma, tutto. NON mescolare lingue. Se la lingua è diversa dall'italiano, adatta anche il tono, le espressioni idiomatiche e le convenzioni culturali del mercato locale.

${PORTFOLIO_CATALOG}

PAIN POINTS SETTORE: ${painPoints}

${formatRules}

FILOSOFIA ANTI-SPAM (REGOLE INVIOLABILI):
1. PORTA VALORE PRIMA DI TUTTO — ogni messaggio deve contenere un insight utile per il destinatario
2. PERSONALIZZA chirurgicamente — il destinatario deve capire che questo messaggio è SOLO per lui
3. DIMOSTRA COMPETENZA con fatti — cita il progetto portfolio più pertinente come prova tangibile
4. MAI VENDERE DIRETTAMENTE — invita alla scoperta, alla curiosità, al dialogo
5. ZERO PRESSIONE — niente urgenza artificiale, sconti, offerte limitate
6. TONO AUTENTICO — come parlerebbe un professionista rispettato del settore, NON un call center
7. RISPETTA L'INTELLIGENZA del destinatario — niente frasi fatte, niente superlative vuote
8. Il messaggio deve far nascere CURIOSITÀ e FIDUCIA — non ansia o diffidenza
9. Se il canale è EMAIL, l'email deve essere strutturata per essere BELLA DA LEGGERE — paragrafi corti, spazi, gerarchia visiva chiara
10. Inserisci i link nel punto più NATURALE del discorso — il link demo è una RISORSA utile, non una CTA aggressiva

LINK DISPONIBILI:
- Demo settore: ${demoLink || "{{DEMO_LINK}}"}
- Catalogo completo: ${allDemosLink || "{{ALL_DEMOS_LINK}}"}
- Contatto: ${contactInfo || "info@empireaigroup.com"}

IMPORTANTE: Il messaggio generato deve essere PRONTO DA COPIARE E INCOLLARE. Nessuna nota, nessuna spiegazione, nessun placeholder — solo il messaggio finale. TUTTO in ${language}.`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { instagram, website, sector, channel, demoLink, allDemosLink, contactInfo, leadName, leadCity, leadPhone, portfolioRef, country } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const ch = channel || "whatsapp";
    const formatRules = channelRules[ch] || channelRules.whatsapp;
    const sectorKey = (sector || "generico").toLowerCase();

    // Auto-detect language from country or city
    const { lang, greeting } = detectLanguage(country, leadCity);

    const systemPrompt = buildSystemPrompt(sectorKey, formatRules, demoLink || "", allDemosLink || "", contactInfo || "", lang);

    const prospectDetails: string[] = [];
    if (leadName) prospectDetails.push(`Nome attività: "${leadName}"`);
    if (leadCity) prospectDetails.push(`Città: ${leadCity}`);
    if (country) prospectDetails.push(`Paese: ${country}`);
    if (leadPhone) prospectDetails.push(`Telefono: ${leadPhone}`);
    if (instagram) prospectDetails.push(`Instagram: @${instagram.replace("@", "")}`);
    if (website) prospectDetails.push(`Sito web: ${website}`);
    if (portfolioRef) prospectDetails.push(`Progetto portfolio suggerito: "${portfolioRef}"`);

    const userPrompt = `PROSPECT:
${prospectDetails.join("\n")}
Settore: "${sector || "generico"}"
Canale: "${ch}"
LINGUA: ${lang} (OBBLIGATORIA — scrivi TUTTO in ${lang})

GENERA il messaggio nel formato ESATTO di "${ch}" e INTERAMENTE in ${lang}:
1. Analizza "${leadName || "N/A"}" — dedici tipo di attività, posizionamento, target clientela
2. Usa "${leadCity || "N/A"}" per contestualizzare naturalmente
3. Seleziona il caso studio portfolio più pertinente ${portfolioRef ? `(suggerito: "${portfolioRef}")` : ""}
4. Identifica il pain point PIÙ rilevante per QUESTA specifica attività
5. Scrivi un messaggio che:
   - Apra con qualcosa di SPECIFICO e genuino sull'attività
   - Porti un INSIGHT di valore prima di parlare di Empire
   - Citi il caso studio come prova concreta (non come pitch)
   - Includa il link demo come risorsa utile
   - Chiuda con una domanda/proposta di BASSO IMPEGNO
6. Il messaggio deve far pensare al destinatario: "Interessante, questi hanno già fatto qualcosa nel mio settore"
7. NON deve far pensare: "Ecco un altro che mi vuole vendere qualcosa"
8. RICORDA: Ogni singola parola DEVE essere in ${lang}. Usa saluti, espressioni e tono culturalmente appropriati per il mercato ${country || "locale"}.

MESSAGGIO FINALE (pronto da copiare):`;

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
        temperature: 0.75,
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
