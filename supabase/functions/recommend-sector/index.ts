import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALL_SECTORS = [
  { id: "food", label: "Ristorazione", keywords: "ristorante pizzeria bar caffè trattoria osteria pub bistrot sushi bakery pasticceria gelateria paninoteca tavola calda" },
  { id: "ncc", label: "NCC & Transfer", keywords: "noleggio conducente transfer taxi limousine auto con autista trasporto privato shuttle aeroporto charter barca yacht nautica" },
  { id: "beauty", label: "Beauty & Wellness", keywords: "parrucchiere salone barbiere estetista spa centro estetico nail manicure pedicure massaggi solarium" },
  { id: "healthcare", label: "Healthcare", keywords: "medico dottore clinica studio dentista odontoiatra fisioterapia osteopata psicologo veterinario farmacia laboratorio" },
  { id: "retail", label: "Retail & E-commerce", keywords: "negozio shop boutique abbigliamento scarpe gioielleria profumeria cartoleria ferramenta" },
  { id: "fitness", label: "Fitness & Sport", keywords: "palestra gym crossfit yoga pilates piscina centro sportivo personal trainer padel tennis calcetto" },
  { id: "hospitality", label: "Hotel & Hospitality", keywords: "hotel albergo b&b bed breakfast resort pensione casa vacanze affittacamere" },
  { id: "beach", label: "Stabilimento Balneare", keywords: "lido stabilimento balneare spiaggia beach club chalet mare ombrellone watersport kayak surf" },
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

// Portfolio catalog: maps each sector to specific preview projects to recommend
const PORTFOLIO_CATALOG: Record<string, { projects: { name: string; description: string; why: string }[]; demo_path: string }> = {
  food: {
    projects: [
      { name: "COTE Miami", description: "Ristorante fine dining Korean BBQ — UI dark premium con menu interattivo e ordinazione al tavolo", why: "Perfetto per ristoranti di fascia medio-alta che vogliono un'esperienza digitale premium" },
      { name: "Paperfish Sushi", description: "Omakase giapponese — design sakura con selezioni dello chef e pairing sake", why: "Ideale per ristoranti etnici/sushi con menù curato e atmosfera ricercata" },
      { name: "Flame Kebab", description: "Grill moderno street food — UI fire-themed con combo builder e tracking delivery", why: "Ottimo per fast food, pizzerie, kebab e attività con delivery e asporto" },
      { name: "La Vang Vietnamese", description: "Cucina vietnamita luxury — estetica noir-saigon con pho bar e cocktail pairing", why: "Per ristoranti fusion o cucina internazionale con posizionamento premium" },
      { name: "Batey Cevicheria", description: "Ceviche bar latino — design costiero con pescato del giorno e cocktail tropicali", why: "Per locali con focus pesce, ceviche, poke o cucina di mare" },
    ],
    demo_path: "/demo/food",
  },
  beauty: {
    projects: [
      { name: "Neo Nails Brickell", description: "Studio nail art luxury — UI frosted glass con booking appuntamenti e programma fedeltà", why: "Perfetto per centri estetici, nail bar e saloni con servizi di bellezza specifici" },
      { name: "Tatush Hair & Fragrance", description: "Salone premium con shop prodotti, profili stilisti e personalizzazione fragranze", why: "Ideale per parrucchieri e hair salon con vendita prodotti integrata" },
    ],
    demo_path: "/demo/beauty",
  },
  ncc: {
    projects: [
      { name: "Amalfi Luxury Transfer", description: "Servizio NCC premium Costiera Amalfitana — tracking flotta in tempo reale e booking VIP", why: "Perfetto per NCC, transfer aeroportuali e servizi con conducente" },
      { name: "Miami Boats Rental", description: "Noleggio yacht e barche luxury — booking capitano e gestione marina", why: "Ideale per charter nautici, noleggio barche e servizi nautici" },
      { name: "Asinara Charter", description: "Charter luxury Sardegna — pacchetti tour, escursioni snorkeling e booking gruppi", why: "Per escursioni turistiche, charter e attività nautiche stagionali" },
    ],
    demo_path: "/demo/ncc",
  },
  fitness: {
    projects: [
      { name: "City Padel Milano", description: "Club padel premium — prenotazione campi, profili maestri e gestione abbonamenti", why: "Perfetto per centri padel, tennis, palestre e club sportivi con prenotazione" },
    ],
    demo_path: "/demo/fitness",
  },
  healthcare: {
    projects: [
      { name: "FAR Medical Center", description: "Centro medico — prenotazioni visite, telemedicina e catalogo servizi sanitari", why: "Ideale per studi medici, cliniche, dentisti e centri diagnostici" },
    ],
    demo_path: "/demo/healthcare",
  },
  veterinary: {
    projects: [
      { name: "Aloha Pet Resort", description: "Clinica veterinaria e pet resort — profili animali, videocamere live e booking", why: "Per veterinari, pet shop, toelettatura e pensioni per animali" },
    ],
    demo_path: "/demo/veterinary",
  },
  childcare: {
    projects: [
      { name: "Little Diamond Nursery", description: "Asilo nido colorato — aggiornamenti giornalieri, condivisione foto e portale genitori", why: "Perfetto per asili nido e scuole dell'infanzia con comunicazione genitori" },
      { name: "Ashley's Playhouse", description: "Ludoteca moderna — prenotazioni attività, feste compleanno e corsi di arricchimento", why: "Per ludoteche, centri gioco e attività per bambini" },
    ],
    demo_path: "/demo/childcare",
  },
  beach: {
    projects: [
      { name: "Miami Watersports", description: "Centro watersport — mappa spiaggia interattiva, prenotazioni ombrelloni e attività acquatiche", why: "Per lidi balneari, beach club, centri surf/kayak e stabilimenti" },
    ],
    demo_path: "/demo/beach",
  },
  plumber: {
    projects: [
      { name: "Nick's Plumbing & AC", description: "Idraulico professionista — richieste intervento, preventivi istantanei e tracking", why: "Per idraulici, termoidraulici e tecnici HVAC" },
    ],
    demo_path: "/demo/plumber",
  },
  hospitality: {
    projects: [
      { name: "MMI Resident Hub", description: "Hotel e resort — prenotazioni camere, concierge digitale e guest experience", why: "Per hotel, B&B, resort e case vacanze" },
    ],
    demo_path: "/demo/hospitality",
  },
  retail: {
    projects: [
      { name: "Premium Store", description: "E-commerce con catalogo prodotti, carrello intelligente e gestione ordini", why: "Per negozi, boutique e attività retail con vendita online" },
    ],
    demo_path: "/demo/retail",
  },
  electrician: {
    projects: [
      { name: "Elite Electrical", description: "Elettricista — gestione interventi, preventivi automatici e domotica", why: "Per elettricisti e installatori impianti" },
    ],
    demo_path: "/demo/electrician",
  },
  tattoo: {
    projects: [
      { name: "Ink Masters Studio", description: "Studio tattoo — portfolio artisti, booking sessioni e gallery personalizzata", why: "Per tatuatori e studi di body art" },
    ],
    demo_path: "/demo/tattoo",
  },
  garage: {
    projects: [
      { name: "Speed Auto Service", description: "Officina meccanica — prenotazioni tagliandi, tracking riparazioni e preventivi", why: "Per officine, carrozzerie e autolavaggi" },
    ],
    demo_path: "/demo/garage",
  },
  photography: {
    projects: [
      { name: "Vision Photography", description: "Fotografo — portfolio, booking sessioni e gallerie private clienti", why: "Per fotografi, videografi e studi creativi" },
    ],
    demo_path: "/demo/photography",
  },
  construction: {
    projects: [
      { name: "Premium Costruzioni", description: "Impresa edile — gestione cantieri, timeline progetti e preventivi", why: "Per imprese edili, geometri e architetti" },
    ],
    demo_path: "/demo/construction",
  },
  gardening: {
    projects: [
      { name: "Verde & Giardini", description: "Giardiniere — portfolio progetti, preventivi e manutenzione programmata", why: "Per giardinieri e paesaggisti" },
    ],
    demo_path: "/demo/gardening",
  },
  agriturismo: {
    projects: [
      { name: "Tuscan Country Estate", description: "Agriturismo — prenotazioni camere, attività ed esperienze enogastronomiche", why: "Per agriturismi, cantine e fattorie" },
    ],
    demo_path: "/demo/agriturismo",
  },
  events: {
    projects: [
      { name: "Elite Events", description: "Agenzia eventi — ticketing, seating e gestione fornitori", why: "Per wedding planner, catering e organizzazione eventi" },
    ],
    demo_path: "/demo/events",
  },
  education: {
    projects: [
      { name: "Academy Pro", description: "Centro formazione — corsi, iscrizioni online e e-learning", why: "Per scuole, accademie e centri di formazione" },
    ],
    demo_path: "/demo/education",
  },
  logistics: {
    projects: [
      { name: "FastTrack Logistics", description: "Logistica — tracking spedizioni, gestione magazzino e rotte", why: "Per corrieri e aziende di spedizioni" },
    ],
    demo_path: "/demo/logistics",
  },
  cleaning: {
    projects: [
      { name: "Premium Clean", description: "Impresa pulizie — booking istantaneo, pricing trasparente e gestione team", why: "Per imprese di pulizia e sanificazione" },
    ],
    demo_path: "/demo/cleaning",
  },
  legal: {
    projects: [
      { name: "Studio Legale Associato", description: "Studio legale — gestione casi, consultazioni online e document management", why: "Per avvocati e studi legali" },
    ],
    demo_path: "/demo/legal",
  },
  accounting: {
    projects: [
      { name: "Studio Commercialista Pro", description: "Commercialista — fatturazione, dichiarazioni e consulenza fiscale", why: "Per commercialisti e consulenti fiscali" },
    ],
    demo_path: "/demo/accounting",
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query, source } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const sectorList = ALL_SECTORS.map(s => `- ${s.id}: ${s.label} (${s.keywords})`).join("\n");

    // Build portfolio context for the AI
    const portfolioContext = Object.entries(PORTFOLIO_CATALOG).map(([sectorId, cat]) => {
      const projectsList = cat.projects.map(p => `  • "${p.name}" — ${p.description}`).join("\n");
      return `[${sectorId}]\n${projectsList}`;
    }).join("\n\n");

    const systemPrompt = `Sei un Senior Business Development Consultant italiano con 15 anni di esperienza. Analizzi prospect con precisione chirurgica.

Il tuo compito:
1. **Identifica il settore esatto** tra quelli disponibili
2. **Analizza il prospect in profondità** — osserva il nome dell'attività, i servizi offerti, il posizionamento, la location, il target clienti
3. **Identifica i pain points reali** — problemi specifici che quell'attività affronta quotidianamente (non generici!)
4. **Raccomanda le preview da inviare** — scegli 1-3 progetti dal portfolio che MEGLIO rappresentano ciò che il prospect potrebbe avere. Spiega PERCHÉ quel progetto è adatto a loro con un collegamento specifico.
5. **Suggerisci il canale di contatto** con motivazione concreta

SETTORI DISPONIBILI:
${sectorList}

PORTFOLIO PREVIEW DISPONIBILI (scegli da qui):
${portfolioContext}

REGOLE:
- Sii SPECIFICO: se il prospect è una pizzeria, non dire "ristorazione generica" ma cita "Flame Kebab" per il delivery o "COTE Miami" se è un locale elegante
- Collega SEMPRE i pain points all'attività specifica del prospect
- Nella recommended_previews, metti il progetto PIÙ SIMILE al prospect come primo
- L'opening_line deve citare qualcosa di SPECIFICO del prospect (nome, servizio, location)
- Confidence deve essere realistica: 95%+ solo se sei sicuro al 100%

RISPONDI SOLO in JSON:
{
  "sector_id": "food",
  "sector_label": "Ristorazione",
  "confidence": 92,
  "analysis": "Analisi dettagliata e specifica del prospect (3-4 frasi precise, non generiche)...",
  "pain_points": ["Pain point specifico 1", "Pain point specifico 2", "Pain point specifico 3", "Pain point specifico 4"],
  "recommended_previews": [
    {
      "project_name": "Nome del progetto dal portfolio",
      "why_this": "Spiegazione specifica del perché questo progetto è perfetto per il prospect",
      "similarity_score": 90
    }
  ],
  "demo_path": "/demo/food",
  "suggested_channel": "whatsapp",
  "channel_reason": "Motivazione concreta del perché questo canale è il migliore per questo prospect specifico",
  "opening_line": "Messaggio di apertura ultra-personalizzato che cita il nome dell'attività e un dettaglio specifico..."
}`;

    const userPrompt = `Analizza questo prospect con precisione:

Fonte: ${source || "text"}
Input: ${query}

Identifica il settore, i pain points REALI e le preview più adatte da inviargli per convincerlo.`;

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
    
    content = content.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    
    let result;
    try {
      result = JSON.parse(content);
    } catch {
      result = { sector_id: "custom", sector_label: "Settore Custom", confidence: 30, analysis: content, pain_points: [], recommended_previews: [], demo_path: "/demo", suggested_channel: "email", channel_reason: "", opening_line: "" };
    }

    // Ensure recommended_previews exists
    if (!result.recommended_previews) {
      const catalog = PORTFOLIO_CATALOG[result.sector_id];
      if (catalog) {
        result.recommended_previews = catalog.projects.slice(0, 2).map(p => ({
          project_name: p.name,
          why_this: p.why,
          similarity_score: 75,
        }));
        result.demo_path = catalog.demo_path;
      } else {
        result.recommended_previews = [];
      }
    }

    if (!result.demo_path) {
      const catalog = PORTFOLIO_CATALOG[result.sector_id];
      result.demo_path = catalog?.demo_path || "/demo";
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
