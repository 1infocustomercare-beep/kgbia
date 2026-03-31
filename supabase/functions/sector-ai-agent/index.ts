import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SECTOR_CONTEXT: Record<string, { name: string; emoji: string; services: string; painPoints: string; solutions: string }> = {
  food: {
    name: "Food & Ristorazione",
    emoji: "🍽️",
    services: "Menu digitale QR, ordini dal tavolo, gestione cucina in tempo reale, prenotazioni online, CRM clienti, loyalty wallet, fatturazione elettronica, analytics vendite, inventario smart, HACCP digitale, WhatsApp marketing, agenti AI (sommelier, upselling, inventario), display cucina, gestione staff e turni, sistema recensioni, notifiche push per promozioni",
    painPoints: "Ordini confusi su carta, clienti persi senza follow-up, zero dati sulle vendite, gestione manuale delle prenotazioni, nessuna fidelizzazione, food cost non tracciato, no-show senza reminder, personale non coordinato",
    solutions: "Con Empire trasformi il tuo ristorante in un business data-driven: ogni ordine tracciato, ogni cliente profilato, ogni piatto analizzato per marginalità. Il menu QR elimina errori e velocizza il servizio del 40%.",
  },
  ncc: {
    name: "NCC & Trasporto",
    emoji: "🚗",
    services: "Gestione flotta veicoli, prenotazioni online, pricing dinamico per tratta, gestione autisti con rating, sito web premium, WhatsApp integrato, CRM passeggeri, fatturazione, analytics corse, GPS tracking, cross-selling servizi, gestione scadenze documenti",
    painPoints: "Prenotazioni via telefono inefficienti, nessun listino online, difficoltà a gestire più autisti, zero visibilità online, flotta non monitorata",
    solutions: "Empire digitalizza ogni aspetto del tuo NCC: booking automatico 24/7, tariffe trasparenti per ogni tratta, assegnazione autisti intelligente e sito web che converte visitatori in clienti.",
  },
  beauty: {
    name: "Beauty & Wellness",
    emoji: "💇",
    services: "Agenda intelligente con slot automatici, schede clienti con storico trattamenti, reminder SMS/WhatsApp, analytics salone, pagamenti e fidelity card digitale, app clienti per prenotazioni, gestione multi-operatore, catalogo servizi online",
    painPoints: "Appuntamenti mancati senza reminder, nessuno storico trattamenti, clienti che non tornano, gestione agenda cartacea, zero marketing",
    solutions: "Con Empire il tuo salone funziona in automatico: reminder che riducono i no-show del 70%, schede clienti che ricordano ogni dettaglio, e un programma fedeltà che fa tornare i clienti.",
  },
  healthcare: {
    name: "Healthcare & Studi Medici",
    emoji: "🏥",
    services: "Agenda medica digitale, cartelle pazienti elettroniche, reminder visite automatici, GDPR compliant, report analytics, fatturazione elettronica, telemedicina, gestione multi-specialista",
    painPoints: "Cartelle cartacee, appuntamenti dimenticati, gestione privacy complessa, fatturazione manuale, nessun follow-up pazienti",
    solutions: "Empire porta il tuo studio nel digitale in modo sicuro e conforme: cartelle elettroniche protette, agenda che si gestisce da sola, e fatturazione automatica.",
  },
  retail: {
    name: "Retail & Negozi",
    emoji: "🛍️",
    services: "Catalogo prodotti con foto e varianti, e-commerce integrato, QR vetrina, CRM clienti, analytics vendite, marketing automation, programma fedeltà, gestione magazzino, ordini online",
    painPoints: "Nessuna presenza online, inventario non tracciato, clienti anonimi, zero dati sulle vendite, marketing inesistente",
    solutions: "Empire trasforma il tuo negozio in un brand digitale: e-commerce che vende 24/7, QR in vetrina che cattura passanti, e analytics che ti dicono esattamente cosa funziona.",
  },
  fitness: {
    name: "Fitness & Sport",
    emoji: "💪",
    services: "Prenotazione corsi online, gestione iscritti e abbonamenti, pagamenti ricorrenti, dashboard palestra, app membri, notifiche smart, tracking allenamenti, gestione personal trainer",
    painPoints: "Iscrizioni gestite a mano, nessun sistema di booking corsi, abbonamenti scaduti non tracciati, zero engagement con i membri",
    solutions: "Empire fa crescere la tua palestra: booking corsi che riempie le classi, abbonamenti con rinnovo automatico, e un'app che tiene i membri motivati e fedeli.",
  },
  hospitality: {
    name: "Hospitality & Hotel",
    emoji: "🏨",
    services: "Booking engine diretto (zero commissioni OTA), gestione camere, check-in digitale, revenue management con ADR e RevPAR, sito multilingue SEO, gestione recensioni automatica, upselling servizi",
    painPoints: "Dipendenza da Booking/Airbnb con commissioni alte, check-in lento, nessun dato sugli ospiti, sito web datato",
    solutions: "Empire elimina la dipendenza dalle OTA: booking diretto che ti fa risparmiare fino al 20% di commissioni, check-in digitale che impressiona gli ospiti.",
  },
  beach: {
    name: "Stabilimento Balneare",
    emoji: "🌊",
    services: "Mappa spiaggia interattiva, prenotazione ombrelloni online, abbonamenti stagionali, gestione ospiti, analytics, cross-selling servizi (bar, ristorante, eventi)",
    painPoints: "Prenotazioni telefoniche caotiche, nessuna mappa digitale, abbonamenti gestiti su carta, zero upselling",
    solutions: "Empire digitalizza la tua spiaggia: mappa live con disponibilità in tempo reale, booking online che elimina code e telefonate.",
  },
  plumber: { name: "Idraulico & Impiantista", emoji: "🔧", services: "Gestione interventi, CRM clienti, preventivi digitali, magazzino materiali, fatturazione, calendario lavori, reportistica, foto prima/dopo", painPoints: "Interventi non tracciati, preventivi a voce, magazzino non monitorato, nessun CRM", solutions: "Empire organizza la tua attività: ogni intervento documentato, preventivi professionali, magazzino aggiornato e fatturazione automatica." },
  electrician: { name: "Elettricista", emoji: "⚡", services: "Gestione lavori e certificazioni, materiali, CRM clienti, preventivi, fatturazione, calendario, reportistica tecnica", painPoints: "Certificazioni perse, lavori non documentati, zero presenza online", solutions: "Empire tiene tutto in ordine: certificazioni digitali, lavori documentati con foto, e un sito professionale." },
  agriturismo: { name: "Agriturismo", emoji: "🌾", services: "Gestione camere e prenotazioni, ristorante integrato, attività rurali, shop prodotti, analytics, sito web", painPoints: "Gestione frammentata, nessun e-commerce, prenotazioni solo telefoniche", solutions: "Empire unifica tutto: camere, ristorante, attività e shop in un'unica piattaforma." },
  cleaning: { name: "Impresa di Pulizie", emoji: "🏠", services: "Gestione servizi e turni, operatori, abbonamenti, CRM clienti, fatturazione, calendario", painPoints: "Turni su WhatsApp, nessun tracciamento servizi, fatturazione manuale", solutions: "Empire professionalizza la tua impresa: turni organizzati, servizi tracciati, abbonamenti automatici." },
  legal: { name: "Studio Legale", emoji: "⚖️", services: "Gestione pratiche, scadenzario, CRM clienti, parcelle, calendario, timetracking, reportistica", painPoints: "Scadenze dimenticate, fascicoli cartacei, ore non tracciate", solutions: "Empire organizza il tuo studio: scadenzario infallibile, fascicoli digitali, timetracking preciso." },
  accounting: { name: "Commercialista", emoji: "📊", services: "Gestione scadenze fiscali, pratiche, CRM clienti, dichiarazioni, calendario, fatturazione", painPoints: "Scadenze fiscali a rischio, clienti su Excel, comunicazioni frammentate", solutions: "Empire automatizza il tuo studio: alert scadenze, portale clienti, dashboard completa." },
  garage: { name: "Autofficina", emoji: "🔩", services: "Gestione riparazioni, veicoli clienti, ricambi, preventivi, fatturazione, storico lavorazioni, reminder tagliandi", painPoints: "Lavorazioni non tracciate, ricambi non monitorati, clienti che dimenticano i tagliandi", solutions: "Empire modernizza la tua officina: ogni lavorazione documentata, reminder tagliandi automatici." },
  photography: { name: "Fotografo & Studio", emoji: "📸", services: "Portfolio online, booking sessioni, gallerie clienti private, CRM, preventivi, fatturazione, consegna digitale", painPoints: "Portfolio non aggiornato, prenotazioni via messaggio, consegna foto caotica", solutions: "Empire eleva il tuo studio: portfolio premium, booking automatico, gallerie private." },
  construction: { name: "Edilizia & Costruzioni", emoji: "🏗️", services: "Timeline progetti, gestione cantieri, team, documentazione, preventivi, fatturazione, reportistica", painPoints: "Progetti senza timeline, documentazione dispersa, costi non controllati", solutions: "Empire controlla i tuoi cantieri: timeline visuale, documentazione centralizzata, budget sotto controllo." },
  gardening: { name: "Giardiniere & Landscaping", emoji: "🌿", services: "Gestione progetti verde, calendario manutenzioni, CRM clienti, preventivi, foto before/after, fatturazione", painPoints: "Manutenzioni dimenticate, nessuno storico lavori, preventivi a voce", solutions: "Empire fa crescere la tua attività: calendario con alert, portfolio before/after, preventivi professionali." },
  veterinary: { name: "Veterinario & Pet Care", emoji: "🐾", services: "Agenda visite, cartelle animali, reminder vaccinazioni, CRM proprietari, farmacia interna, fatturazione, telemedicina", painPoints: "Cartelle cartacee, vaccinazioni dimenticate, nessun follow-up", solutions: "Empire si prende cura della tua clinica: cartelle digitali, reminder vaccinazioni, gestione farmacia." },
  tattoo: { name: "Tattoo & Piercing Studio", emoji: "🎨", services: "Portfolio artisti, booking sessioni, gallery flash, consensi digitali, CRM clienti, aftercare automatico", painPoints: "Portfolio solo su Instagram, prenotazioni caotiche, consensi cartacei", solutions: "Empire professionalizza il tuo studio: portfolio premium, booking gestito, consensi digitali." },
  childcare: { name: "Asilo & Childcare", emoji: "👶", services: "Gestione iscrizioni, presenze, comunicazione genitori, menu mensa, attività, fatturazione", painPoints: "Comunicazione frammentata, presenze su carta, nessun portale genitori", solutions: "Empire semplifica la gestione: app genitori, presenze digitali, menu mensa condiviso." },
  education: { name: "Formazione & Corsi", emoji: "🎓", services: "Catalogo corsi, iscrizioni online, gestione aule, CRM studenti, pagamenti, certificati, analytics", painPoints: "Iscrizioni manuali, nessuna piattaforma corsi, pagamenti non tracciati", solutions: "Empire scala la tua formazione: catalogo con iscrizione online, pagamenti automatici, analytics." },
  events: { name: "Eventi & Catering", emoji: "🎉", services: "Gestione eventi, preventivi, timeline, fornitori, CRM clienti, portfolio, fatturazione", painPoints: "Eventi su Excel, fornitori non coordinati, preventivi lenti", solutions: "Empire orchestra i tuoi eventi: timeline dettagliata, coordinamento fornitori, preventivi in 2 minuti." },
  logistics: { name: "Logistica & Spedizioni", emoji: "📦", services: "Tracking spedizioni, gestione magazzino, fleet management, CRM clienti, fatturazione, route optimization", painPoints: "Spedizioni non tracciate, magazzino caotico, nessuna ottimizzazione percorsi", solutions: "Empire ottimizza la tua logistica: tracking real-time, magazzino preciso, route optimization." },
  custom: {
    name: "Business Personalizzato",
    emoji: "⚡",
    services: "Piattaforma completamente personalizzabile per qualsiasi settore: CRM, prenotazioni, analytics, pagamenti, sito web, agenti AI, automazioni, e-commerce, gestione team, fatturazione, marketing",
    painPoints: "Gestione manuale inefficiente, nessuna digitalizzazione, zero dati, clienti persi",
    solutions: "Empire si adatta a qualsiasi business: costruiamo insieme la soluzione perfetta per le tue esigenze specifiche, con moduli personalizzati e AI dedicata.",
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, sector, companyName } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const ctx = SECTOR_CONTEXT[sector] || SECTOR_CONTEXT["custom"];

    const systemPrompt = `Sei ARIANNA, l'Assistente Commerciale AI Premium di Empire AI Group — un'agenzia italiana leader nella digitalizzazione di business tramite AI e tecnologie avanzate.

SETTORE DEL CLIENTE: ${ctx.emoji} ${ctx.name}
${companyName ? `ATTIVITÀ DEL CLIENTE: ${companyName}` : ""}

═══ SERVIZI PER QUESTO SETTORE ═══
${ctx.services}

═══ PROBLEMI TIPICI CHE RISOLVIAMO ═══
${ctx.painPoints}

═══ LE NOSTRE SOLUZIONI ═══
${ctx.solutions}

═══ IL TUO RUOLO ═══
Sei un consulente commerciale ESPERTO e PERSUASIVO. Il tuo obiettivo è CONVERTIRE ogni visitatore in un cliente.

STRATEGIA DI CONVERSIONE:
1. ASCOLTA attentamente il problema o la domanda del cliente
2. ANALIZZA la sua situazione specifica
3. PROPONI soluzioni CONCRETE e PERSONALIZZATE dal nostro catalogo
4. SORPRENDI con idee innovative che non aveva considerato
5. CONVERTI con una call-to-action chiara

═══ REGOLA CRITICA: FUNZIONALITÀ NON ELENCATE ═══
Se il cliente chiede qualcosa che NON è nella lista dei nostri servizi:
- MAI dire "non possiamo" o "non offriamo questo"
- INVECE rispondi: "Questa è un'esigenza molto specifica e interessante! Noi di Empire sviluppiamo soluzioni 100% su misura. Possiamo creare esattamente quello che ti serve — [proponi come lo costruiresti, con dettagli tecnici credibili]"
- Spiega HOW: descri la soluzione concreta che svilupperemmo, con moduli, automazioni e AI
- Aggiungi: "È proprio questo il nostro vantaggio: non siamo un software generico, siamo un team di sviluppatori che costruisce la TUA soluzione"
- Concludi invitando a una consulenza gratuita per approfondire

═══ CAPACITÀ TECNICHE CHE PUOI PROMETTERE ═══
(Queste sono tutte realizzabili, usale per trovare soluzioni creative):
- Sviluppo web/app custom (React, React Native, PWA)
- Integrazioni API con qualsiasi servizio esterno
- Agenti AI specializzati per qualsiasi workflow
- Chatbot WhatsApp / Telegram / SMS
- Automazioni business logic personalizzate
- Dashboard e analytics custom
- E-commerce e payment gateway
- Sistemi di prenotazione avanzati
- CRM con AI scoring e predictive analytics
- Marketing automation multicanale
- Gestione documenti e workflow approvals
- IoT integration (sensori, dispositivi)
- Report e fatturazione personalizzati
- Multi-sede, multi-lingua, multi-valuta

═══ STILE COMUNICATIVO ═══
- Italiano professionale ma caldo e umano
- Usa emoji con parsimonia per enfatizzare (non abusare)
- Risposte concise (max 150 parole) ma DENSE di valore
- Ogni risposta deve contenere almeno 1 soluzione concreta
- Concludi SEMPRE con una call-to-action: "Vuoi vedere come funzionerebbe per te? Prenota una consulenza gratuita!" oppure "Posso mostrarti esattamente come risolveremmo questo problema"

═══ SETTORI COPERTI (25+) ═══
Food, NCC, Beauty, Healthcare, Retail, Fitness, Hospitality, Beach, Edilizia, Idraulici, Elettricisti, Agriturismi, Pulizie, Avvocati, Commercialisti, Autofficine, Fotografi, Giardinieri, Veterinari, Tattoo, Asili, Formazione, Eventi, Logistica e qualsiasi settore Custom`;

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Troppi messaggi, riprova tra qualche secondo." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crediti AI esauriti." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Errore AI gateway" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("sector-ai-agent error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
