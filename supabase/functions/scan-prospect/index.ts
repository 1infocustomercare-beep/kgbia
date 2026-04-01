import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SECTOR_PAIN_POINTS: Record<string, string> = {
  ristorazione: `PAIN POINTS SETTORE FOOD:
- No-show prenotazioni (fino al 20% dei tavoli vuoti)
- Dipendenza da Deliveroo/JustEat (commissioni 25-35%)
- Menu cartaceo = niente upselling, niente allergeni digitali
- Recensioni negative pubbliche che abbassano il rating Google
- Staff che perde tempo al telefono per ordini/prenotazioni
- Zero fidelizzazione: il cliente ordina una volta e scompare
- Nessun dato sui clienti: non sai chi torna, chi spende di più
PROPOSTA VALORE: App proprietaria zero commissioni, menu AI con foto professionali, Review Shield™, CRM con loyalty wallet, ordini WhatsApp automatici.`,

  beauty: `PAIN POINTS SETTORE BEAUTY/SPA:
- Appuntamenti mancati senza reminder automatici (perdita media €150/giorno)
- Agenda gestita su carta o WhatsApp personale = caos
- Nessuna scheda cliente digitale (preferenze, allergie, storico trattamenti)
- Difficoltà a vendere pacchetti e abbonamenti
- Social media gestiti male: foto belle ma zero conversioni
- Clienti che vanno dalla concorrenza per €5 in meno
PROPOSTA VALORE: Booking online 24/7 con conferma automatica, scheda cliente digitale, pacchetti e gift card, notifiche push per slot vuoti, portfolio AI per social.`,

  hotel: `PAIN POINTS SETTORE HOSPITALITY:
- Dipendenza da Booking/Expedia (commissioni 15-25%)
- Check-in lento e code alla reception
- Nessun upselling digitale (spa, ristorante, escursioni)
- Recensioni non gestite = rating in calo
- Housekeeping non coordinato con reception
PROPOSTA VALORE: Booking diretto zero commissioni, check-in digitale, concierge AI 24/7, upselling cross-service automatico, gestione reputazione.`,

  ncc: `PAIN POINTS SETTORE NCC/TRANSFER:
- Prenotazioni telefoniche = errori e doppie assegnazioni
- Nessun tracking in tempo reale per i clienti
- Fatturazione manuale e gestione flotta su Excel
- Autisti non coordinati, tempi morti tra le corse
- Prezzi non dinamici, si perde margine
PROPOSTA VALORE: Booking online con prezzi dinamici, tracking live, gestione flotta e autisti, fatturazione automatica, cross-selling escursioni.`,

  fitness: `PAIN POINTS SETTORE FITNESS/PALESTRA:
- Abbandono iscritti dopo 2-3 mesi (tasso medio 40%)
- Classi mezze vuote perché nessuno sa gli orari aggiornati
- Gestione abbonamenti su carta o Excel
- Zero comunicazione personalizzata con i membri
PROPOSTA VALORE: App con prenotazione classi, notifiche motivazionali AI, gestione abbonamenti digitale, trainer matching, community engagement.`,

  retail: `PAIN POINTS SETTORE RETAIL/NEGOZIO:
- E-commerce dei big che rubano clienti locali
- Inventario gestito a mano = errori e rotture di stock
- Nessuna fidelizzazione digitale
- Clienti che entrano, guardano e comprano online altrove
PROPOSTA VALORE: Catalogo digitale con ordini, loyalty program, notifiche push per offerte, gestione inventario AI, click & collect.`,

  healthcare: `PAIN POINTS SETTORE HEALTHCARE/CLINICA:
- Appuntamenti mancati senza reminder (costo medio €80/slot perso)
- Cartelle pazienti cartacee = inefficienza e rischio GDPR
- Sala d'attesa sovraffollata per mancanza di gestione slot
- Comunicazione post-visita inesistente
PROPOSTA VALORE: Prenotazioni online con reminder multicanale, cartella paziente digitale, telemedicina, comunicazione follow-up automatica.`,

  trades: `PAIN POINTS SETTORE ARTIGIANI/SERVIZI:
- Preventivi fatti a voce = contestazioni e margini erosi
- Nessun sistema per tracciare interventi e materiali
- Clienti che non richiamano perché non c'è follow-up
- Zero presenza digitale professionale
PROPOSTA VALORE: Preventivi digitali con firma, tracking interventi, CRM clienti con follow-up automatico, sito professionale con booking.`,
};

const channelRules: Record<string, string> = {
  dm: `FORMATO: DM Instagram/Social
- MAX 500 caratteri (Instagram tronca i messaggi lunghi)
- 3-4 righe massimo, diretto e incisivo
- Apri con un'osservazione SPECIFICA e INTELLIGENTE sul loro profilo (non un complimento generico — dimostra che hai studiato il loro business)
- Cita un post recente, un dettaglio del locale, o un elemento unico che li distingue
- Chiudi con il link demo e una domanda che stimoli curiosità
- Tono: da insider del settore, come un collega che ha scoperto qualcosa di utile
- Usa 1-2 emoji massimo, mai di più
- NO oggetto, NO firma formale
- VIETATO: "Ho visto il tuo profilo e...", "Ciao, ti scrivo perché..."`,

  whatsapp: `FORMATO: Messaggio WhatsApp Professionale
- MAX 800 caratteri
- Usa formattazione WhatsApp: *grassetto* per i numeri chiave, _corsivo_ per enfasi
- Struttura: osservazione specifica → pain point del settore → soluzione concreta → link → CTA
- Tono: consulente di fiducia, non venditore — come un esperto che offre un consiglio gratuito
- 2-3 emoji massimo, strategici
- Includi UN dato numerico credibile (es. "il 73% dei ristoranti perde €X/mese in commissioni")
- Chiudi con: "Ti faccio vedere in 2 minuti come funziona?" o simile
- VIETATO: messaggi che sembrano spam, tono troppo entusiasta`,

  email: `FORMATO: Email Professionale Premium
- Oggetto in prima riga (formato "Oggetto: ...") — breve, specifico, MAI clickbait
- 4-5 paragrafi strutturati con logica AIDA (Attenzione → Interesse → Desiderio → Azione)
- Paragrafo 1: Osservazione specifica sulla loro attività (dimostra ricerca)
- Paragrafo 2: Pain point del settore con dato numerico
- Paragrafo 3: Soluzione Empire con benefici concreti e misurabili
- Paragrafo 4: Link demo + catalogo + offerta (da €79/mese, 90gg gratis)
- Paragrafo 5: CTA chiaro e professionale
- Firma: Nome Cognome | Empire AI Group — Digital Transformation Partner
- Tono: C-level, autorevole, consulenziale — come McKinsey scrive a un PMI
- Emoji solo nei bullet points se necessario
- VIETATO: tono da televendita, promesse irrealistiche`,

  pitch: `FORMATO: Script Porta a Porta / Chiamata Telefonica
- Struttura temporizzata:
  • APERTURA (10 sec): Presentazione + osservazione specifica sul locale
  • AGGANCIO (15 sec): Domanda provocatoria sul pain point principale del settore
  • SOLUZIONE (20 sec): Come Empire risolve quel problema specifico con numeri
  • DEMO LIVE (30 sec): "Guarda, ti faccio vedere sul telefono..." + mostra link demo
  • GESTIONE OBIEZIONI: 3 obiezioni comuni con risposte pronte
  • CHIUSURA (10 sec): Offerta 90gg gratis + prossimo step concreto
- Linguaggio parlato, naturale, sicuro — MAI recitato
- Includi indicazioni fisiche: [mostra telefono], [pausa], [sorridi]
- Tono: esperto del settore che offre un vantaggio competitivo`,

  link: `FORMATO: Messaggio breve per condivisione link
- MAX 280 caratteri (ottimizzato per social)
- Una frase d'impatto che crea urgenza o curiosità + link demo + CTA
- Perfetto per bio link, stories, post caption, QR code
- Diretto, memorabile, zero filler words`,
};

const systemPrompt_base = (sector: string, formatRules: string, demoLink: string, allDemosLink: string, contactInfo: string) => `Sei un Senior Business Development Consultant di Empire AI Group — la principale agenzia italiana di trasformazione digitale per attività locali.

HAI 15 ANNI DI ESPERIENZA nel settore "${sector}" e conosci ogni sfumatura del business: margini, stagionalità, problemi operativi quotidiani, psicologia del titolare.

IL TUO APPROCCIO:
1. ANALISI PROFONDA: Non limitarti al nome e al settore. Deduci dal profilo/sito: dimensione dell'attività, target di clientela, posizionamento (premium/medio/economico), zona geografica, punti di forza e debolezza visibili.
2. PERSONALIZZAZIONE CHIRURGICA: Ogni frase deve dimostrare che hai STUDIATO questa specifica attività. Cita elementi reali: lo stile delle foto, il tipo di clientela visibile, la location, i servizi offerti, il tono della comunicazione.
3. PAIN POINT MIRATO: Identifica il problema PIÙ URGENTE per QUESTA specifica attività (non generico del settore) e posiziona Empire come la soluzione naturale.
4. CREDIBILITÀ: Usa dati di settore realistici, casi studio plausibili, metriche concrete. Mai promesse vaghe — sempre numeri specifici.
5. TONO: Sei un consulente che CAPISCE il loro lavoro quotidiano. Parli la loro lingua. NON sei un venditore — sei qualcuno che ha la soluzione a un problema che loro sentono ogni giorno.

${SECTOR_PAIN_POINTS[sector] || `SETTORE: ${sector}\nAnalizza i pain points specifici di questo settore e proponi soluzioni Empire pertinenti.`}

${formatRules}

REGOLE INVIOLABILI:
- OGNI parola deve avere uno scopo. Zero filler, zero frasi fatte.
- NON iniziare MAI con "Ciao, ho visto il tuo profilo" o varianti — è spam.
- NON inventare dati che non puoi dedurre logicamente dal profilo/sito.
- USA deduzioni intelligenti: se vedi foto di piatti gourmet → posizionamento premium → pain point commissioni delivery che erodono il margine.
- Il messaggio deve far pensare: "Questo ha capito davvero il mio business."
- Inserisci i link nel punto più NATURALE del discorso, MAI come lista in fondo.
- Se non hai abbastanza info per personalizzare, concentrati sui pain points del settore con dati concreti.

LINK (inserisci naturalmente nel testo):
- Demo settore: ${demoLink || "{{DEMO_LINK}}"}
- Catalogo completo: ${allDemosLink || "{{ALL_DEMOS_LINK}}"}
- Contatto: ${contactInfo || "{{CONTACT_INFO}}"}`;

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
    const sectorKey = (sector || "generico").toLowerCase();

    const systemPrompt = systemPrompt_base(sectorKey, formatRules, demoLink || "", allDemosLink || "", contactInfo || "");

    const userPrompt = `PROSPECT DA ANALIZZARE:
Settore: "${sector || "generico"}"
Canale di contatto: "${ch}"
${targetInfo.join("\n")}

ISTRUZIONI:
1. Analizza ogni dettaglio disponibile del prospect (handle Instagram, URL sito)
2. Deduci: tipo di attività, posizionamento, target clientela, dimensione, punti di forza/debolezza
3. Identifica il pain point PIÙ urgente e rilevante per QUESTA specifica attività
4. Genera un messaggio che dimostri competenza profonda del settore e conoscenza specifica del loro business
5. Il messaggio deve rispettare PERFETTAMENTE il formato del canale "${ch}"
6. Ogni frase deve avere uno scopo strategico nel funnel di conversione`;

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
