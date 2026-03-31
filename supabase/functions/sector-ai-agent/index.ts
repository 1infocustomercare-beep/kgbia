import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SECTOR_CONTEXT: Record<string, { name: string; emoji: string; services: string; painPoints: string; solutions: string }> = {
  food: {
    name: "Food & Ristorazione",
    emoji: "🍽️",
    services: "Menu digitale QR, ordini dal tavolo, gestione cucina in tempo reale, prenotazioni online, CRM clienti, loyalty wallet, fatturazione elettronica, analytics vendite, inventario smart, HACCP digitale, WhatsApp marketing, agenti AI (sommelier, upselling, inventario)",
    painPoints: "Ordini confusi su carta, clienti persi senza follow-up, zero dati sulle vendite, gestione manuale delle prenotazioni, nessuna fidelizzazione, food cost non tracciato",
    solutions: "Con Empire trasformi il tuo ristorante in un business data-driven: ogni ordine tracciato, ogni cliente profilato, ogni piatto analizzato per marginalità. Il menu QR elimina errori e velocizza il servizio del 40%.",
  },
  ncc: {
    name: "NCC & Trasporto",
    emoji: "🚗",
    services: "Gestione flotta veicoli, prenotazioni online, pricing dinamico per tratta, gestione autisti con rating, sito web premium, WhatsApp integrato, CRM passeggeri, fatturazione, analytics corse, GPS tracking",
    painPoints: "Prenotazioni via telefono inefficienti, nessun listino online, difficoltà a gestire più autisti, zero visibilità online, flotta non monitorata",
    solutions: "Empire digitalizza ogni aspetto del tuo NCC: booking automatico 24/7, tariffe trasparenti per ogni tratta, assegnazione autisti intelligente e sito web che converte visitatori in clienti.",
  },
  beauty: {
    name: "Beauty & Wellness",
    emoji: "💇",
    services: "Agenda intelligente con slot automatici, schede clienti con storico trattamenti, reminder SMS/WhatsApp, analytics salone, pagamenti e fidelity card digitale, app clienti per prenotazioni",
    painPoints: "Appuntamenti mancati senza reminder, nessuno storico trattamenti, clienti che non tornano, gestione agenda cartacea, zero marketing",
    solutions: "Con Empire il tuo salone funziona in automatico: reminder che riducono i no-show del 70%, schede clienti che ricordano ogni dettaglio, e un programma fedeltà che fa tornare i clienti.",
  },
  healthcare: {
    name: "Healthcare & Studi Medici",
    emoji: "🏥",
    services: "Agenda medica digitale, cartelle pazienti elettroniche, reminder visite automatici, GDPR compliant, report analytics, fatturazione elettronica, telemedicina",
    painPoints: "Cartelle cartacee, appuntamenti dimenticati, gestione privacy complessa, fatturazione manuale, nessun follow-up pazienti",
    solutions: "Empire porta il tuo studio nel digitale in modo sicuro e conforme: cartelle elettroniche protette, agenda che si gestisce da sola, e fatturazione automatica che ti fa risparmiare ore.",
  },
  retail: {
    name: "Retail & Negozi",
    emoji: "🛍️",
    services: "Catalogo prodotti con foto e varianti, e-commerce integrato, QR vetrina, CRM clienti, analytics vendite, marketing automation, programma fedeltà, gestione magazzino",
    painPoints: "Nessuna presenza online, inventario non tracciato, clienti anonimi, zero dati sulle vendite, marketing inesistente",
    solutions: "Empire trasforma il tuo negozio in un brand digitale: e-commerce che vende 24/7, QR in vetrina che cattura passanti, e analytics che ti dicono esattamente cosa funziona.",
  },
  fitness: {
    name: "Fitness & Sport",
    emoji: "💪",
    services: "Prenotazione corsi online, gestione iscritti e abbonamenti, pagamenti ricorrenti, dashboard palestra, app membri, notifiche smart, tracking allenamenti",
    painPoints: "Iscrizioni gestite a mano, nessun sistema di booking corsi, abbonamenti scaduti non tracciati, zero engagement con i membri",
    solutions: "Empire fa crescere la tua palestra: booking corsi che riempie le classi, abbonamenti con rinnovo automatico, e un'app che tiene i membri motivati e fedeli.",
  },
  hospitality: {
    name: "Hospitality & Hotel",
    emoji: "🏨",
    services: "Booking engine diretto (zero commissioni OTA), gestione camere, check-in digitale, revenue management con ADR e RevPAR, sito multilingue SEO, gestione recensioni automatica",
    painPoints: "Dipendenza da Booking/Airbnb con commissioni alte, check-in lento, nessun dato sugli ospiti, sito web datato",
    solutions: "Empire elimina la dipendenza dalle OTA: booking diretto che ti fa risparmiare fino al 20% di commissioni, check-in digitale che impressiona gli ospiti, e revenue management per massimizzare ogni camera.",
  },
  beach: {
    name: "Stabilimento Balneare",
    emoji: "🌊",
    services: "Mappa spiaggia interattiva, prenotazione ombrelloni online, abbonamenti stagionali, gestione ospiti, analytics, cross-selling servizi (bar, ristorante, eventi)",
    painPoints: "Prenotazioni telefoniche caotiche, nessuna mappa digitale, abbonamenti gestiti su carta, zero upselling",
    solutions: "Empire digitalizza la tua spiaggia: mappa live con disponibilità in tempo reale, booking online che elimina code e telefonate, e cross-selling intelligente che aumenta lo scontrino medio.",
  },
  plumber: {
    name: "Idraulico & Impiantista",
    emoji: "🔧",
    services: "Gestione interventi con storico, CRM clienti, preventivi digitali, magazzino materiali, fatturazione, calendario lavori, reportistica",
    painPoints: "Interventi non tracciati, preventivi a voce, magazzino non monitorato, nessun CRM, fatture manuali",
    solutions: "Empire organizza la tua attività: ogni intervento documentato, preventivi professionali in un click, magazzino sempre aggiornato e fatturazione automatica.",
  },
  electrician: {
    name: "Elettricista",
    emoji: "⚡",
    services: "Gestione lavori e certificazioni, materiali elettrici, CRM clienti, preventivi, fatturazione, calendario, reportistica tecnica",
    painPoints: "Certificazioni perse, lavori non documentati, materiali non tracciati, zero presenza online",
    solutions: "Empire tiene tutto in ordine: certificazioni digitali sempre a portata di mano, lavori documentati con foto, e un sito professionale che genera nuovi clienti.",
  },
  agriturismo: {
    name: "Agriturismo",
    emoji: "🌾",
    services: "Gestione camere e prenotazioni, ristorante integrato, attività rurali, shop prodotti propri, analytics, sito web",
    painPoints: "Gestione frammentata tra camere e ristorante, nessun e-commerce per prodotti, prenotazioni solo telefoniche",
    solutions: "Empire unifica tutto il tuo agriturismo: camere, ristorante, attività e shop in un'unica piattaforma, con booking online e vendita prodotti 24/7.",
  },
  cleaning: {
    name: "Impresa di Pulizie",
    emoji: "🏠",
    services: "Gestione servizi e turni, operatori, abbonamenti periodici, CRM clienti, fatturazione, calendario, reportistica",
    painPoints: "Turni gestiti su WhatsApp, nessun tracciamento servizi, clienti non fidelizzati, fatturazione manuale",
    solutions: "Empire professionalizza la tua impresa: turni organizzati digitalmente, servizi tracciati con conferma al cliente, e abbonamenti ricorrenti automatici.",
  },
  legal: {
    name: "Studio Legale",
    emoji: "⚖️",
    services: "Gestione pratiche e fascicoli, scadenzario, CRM clienti, parcelle, calendario appuntamenti, timetracking, reportistica",
    painPoints: "Scadenze dimenticate, fascicoli cartacei, ore non tracciate, nessun sistema di gestione clienti",
    solutions: "Empire organizza il tuo studio: scadenzario che non dimentica nulla, fascicoli digitali accessibili ovunque, e timetracking preciso per parcelle trasparenti.",
  },
  accounting: {
    name: "Commercialista",
    emoji: "📊",
    services: "Gestione scadenze fiscali, pratiche, CRM clienti, dichiarazioni, calendario, fatturazione, reportistica",
    painPoints: "Scadenze fiscali a rischio, clienti gestiti su Excel, nessun portale clienti, comunicazioni frammentate",
    solutions: "Empire automatizza il tuo studio: scadenze fiscali con alert automatici, portale clienti per documenti, e dashboard che tiene tutto sotto controllo.",
  },
  garage: {
    name: "Autofficina",
    emoji: "🔩",
    services: "Gestione riparazioni, veicoli clienti, ricambi, preventivi, fatturazione, storico lavorazioni, reminder tagliandi",
    painPoints: "Lavorazioni non tracciate, ricambi non monitorati, clienti che dimenticano i tagliandi, fatture manuali",
    solutions: "Empire modernizza la tua officina: ogni lavorazione documentata, ricambi con giacenza in tempo reale, e reminder tagliandi che fidelizzano i clienti.",
  },
  photography: {
    name: "Fotografo & Studio",
    emoji: "📸",
    services: "Portfolio online, booking sessioni, gallerie clienti private, CRM, preventivi, fatturazione, consegna digitale",
    painPoints: "Portfolio non aggiornato, prenotazioni via messaggio, consegna foto caotica, nessun CRM",
    solutions: "Empire eleva il tuo studio: portfolio premium che attira clienti, booking automatico, gallerie private con download diretto e watermark.",
  },
  construction: {
    name: "Edilizia & Costruzioni",
    emoji: "🏗️",
    services: "Timeline progetti, gestione cantieri, team e subappaltatori, documentazione, preventivi, fatturazione, reportistica",
    painPoints: "Progetti senza timeline, documentazione dispersa, comunicazione caotica con i team, costi non controllati",
    solutions: "Empire controlla i tuoi cantieri: timeline visuale, documentazione centralizzata, comunicazione diretta con ogni team e budget sempre sotto controllo.",
  },
  gardening: {
    name: "Giardiniere & Landscaping",
    emoji: "🌿",
    services: "Gestione progetti verde, calendario manutenzioni, CRM clienti, preventivi, foto before/after, fatturazione",
    painPoints: "Manutenzioni dimenticate, nessuno storico lavori, preventivi a voce, zero marketing",
    solutions: "Empire fa crescere la tua attività: calendario manutenzioni con alert, portfolio before/after che impressiona, e preventivi professionali in un click.",
  },
  veterinary: {
    name: "Veterinario & Pet Care",
    emoji: "🐾",
    services: "Agenda visite, cartelle animali, reminder vaccinazioni, CRM proprietari, farmacia interna, fatturazione, telemedicina",
    painPoints: "Cartelle cartacee, vaccinazioni dimenticate, nessun follow-up, gestione farmaci manuale",
    solutions: "Empire si prende cura della tua clinica: cartelle digitali per ogni paziente, reminder vaccinazioni automatici, e gestione farmacia integrata.",
  },
  tattoo: {
    name: "Tattoo & Piercing Studio",
    emoji: "🎨",
    services: "Portfolio artisti, booking sessioni, gallery flash, consensi digitali, CRM clienti, aftercare automatico, pagamenti",
    painPoints: "Portfolio solo su Instagram, prenotazioni caotiche, consensi cartacei, nessun follow-up aftercare",
    solutions: "Empire professionalizza il tuo studio: portfolio premium con gallery dedicata, booking che gestisce sessioni e sedute multiple, consensi digitali e aftercare automatico.",
  },
  childcare: {
    name: "Asilo & Childcare",
    emoji: "👶",
    services: "Gestione iscrizioni, presenze, comunicazione genitori, menu mensa, attività, fatturazione, reportistica",
    painPoints: "Comunicazione con genitori frammentata, presenze su carta, nessun portale genitori, gestione mensa manuale",
    solutions: "Empire semplifica la gestione: app genitori con foto e aggiornamenti, presenze digitali, menu mensa condiviso e comunicazioni centralizzate.",
  },
  education: {
    name: "Formazione & Corsi",
    emoji: "🎓",
    services: "Catalogo corsi, iscrizioni online, gestione aule, CRM studenti, pagamenti, certificati, analytics",
    painPoints: "Iscrizioni manuali, nessuna piattaforma corsi, pagamenti non tracciati, zero analytics",
    solutions: "Empire scala la tua formazione: catalogo corsi con iscrizione online, pagamenti automatici, e analytics su completamento e soddisfazione.",
  },
  events: {
    name: "Eventi & Catering",
    emoji: "🎉",
    services: "Gestione eventi, preventivi, timeline, fornitori, CRM clienti, portfolio, fatturazione, coordinamento team",
    painPoints: "Eventi gestiti su fogli Excel, fornitori non coordinati, nessun portfolio online, preventivi lenti",
    solutions: "Empire orchestra i tuoi eventi: timeline dettagliata, coordinamento fornitori in tempo reale, portfolio che vende, e preventivi professionali in 2 minuti.",
  },
  logistics: {
    name: "Logistica & Spedizioni",
    emoji: "📦",
    services: "Tracking spedizioni, gestione magazzino, fleet management, CRM clienti, fatturazione, analytics, route optimization",
    painPoints: "Spedizioni non tracciate, magazzino caotico, nessuna ottimizzazione percorsi, clienti senza visibilità",
    solutions: "Empire ottimizza la tua logistica: tracking in tempo reale per te e i clienti, magazzino con giacenze precise, e ottimizzazione percorsi che taglia i costi.",
  },
  custom: {
    name: "Business Personalizzato",
    emoji: "⚡",
    services: "Piattaforma completamente personalizzabile per qualsiasi settore: CRM, prenotazioni, analytics, pagamenti, sito web, agenti AI",
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

    const systemPrompt = `Sei l'Assistente Commerciale AI di Empire AI Group, un'agenzia premium italiana di digitalizzazione per business.

SETTORE ATTUALE: ${ctx.emoji} ${ctx.name}
${companyName ? `NOME ATTIVITÀ DEL CLIENTE: ${companyName}` : ""}

SERVIZI CHE OFFRIAMO PER QUESTO SETTORE:
${ctx.services}

PROBLEMI TIPICI DEI CLIENTI IN QUESTO SETTORE:
${ctx.painPoints}

LE NOSTRE SOLUZIONI:
${ctx.solutions}

IL TUO OBIETTIVO: Sei un consulente esperto e persuasivo. Devi:
1. CAPIRE le esigenze specifiche del cliente facendo domande mirate
2. PROPORRE soluzioni concrete e personalizzate basate sui nostri servizi
3. SORPRENDERE il cliente con idee innovative che non aveva considerato
4. CONVERTIRE l'interesse in una richiesta di contatto o demo personalizzata

REGOLE:
- Rispondi SEMPRE in italiano
- Sii professionale ma caldo e umano
- Usa emoji con parsimonia per enfatizzare i punti chiave
- Quando il cliente esprime un bisogno, proponi SEMPRE una soluzione specifica dal nostro catalogo
- Se il cliente chiede qualcosa che non abbiamo, NON dire "non possiamo" — invece di' "possiamo sviluppare una soluzione personalizzata" e proponi un'alternativa
- Se il cliente è indeciso, racconta un caso di successo simile
- Concludi sempre con una call-to-action: invita a prenotare una consulenza gratuita o a vedere la demo completa
- Rispondi in modo conciso (max 150 parole) ma denso di valore
- TUTTI i 25+ settori che copriamo: Food, NCC, Beauty, Healthcare, Retail, Fitness, Hospitality, Beach, Edilizia, Idraulici, Elettricisti, Agriturismi, Pulizie, Avvocati, Commercialisti, Autofficine, Fotografi, Giardinieri, Veterinari, Tattoo, Asili, Formazione, Eventi, Logistica e Custom

FUNZIONALITÀ AVANZATE CHE POSSIAMO OFFRIRE:
- Agenti AI specializzati (sommelier, assistente prenotazioni, customer care)
- WhatsApp Business integrato con chatbot AI
- Dashboard analytics con KPI in tempo reale
- Sito web premium con SEO ottimizzato
- Sistema di fidelizzazione con wallet digitale
- Automazioni marketing (email, SMS, push)
- Fatturazione elettronica integrata
- Multi-sede e multi-operatore

Ogni soluzione è personalizzabile al 100% — design, funzionalità, workflow, tutto su misura per il cliente.`;

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
