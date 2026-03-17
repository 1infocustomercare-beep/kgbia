/**
 * Centralized Feature Guide Registry
 * -----------------------------------
 * All help tooltips & page-level guides are defined here.
 * When a new page or feature is added, add its guide entry here
 * and it will automatically appear for all accounts.
 *
 * Keys follow the pattern: "route:section" or "component:feature"
 */

export interface GuideEntry {
  title: string;
  description: string;
  steps?: string[];
}

/* ─── PAGE-LEVEL GUIDES (floating ? per route) ─── */
export const pageGuides: Record<string, GuideEntry> = {
  "/dashboard": {
    title: "La tua Dashboard",
    description: "Panoramica completa della tua attività. Qui trovi ordini, incassi, prenotazioni e accesso rapido a tutte le funzioni.",
    steps: [
      "Controlla gli ordini attivi e le prenotazioni di oggi",
      "Monitora i gettoni IA disponibili per Menu, Foto e Traduzioni",
      "Accedi a Studio, Cucina e Menù dai tab in basso",
    ],
  },
  "/app": {
    title: "Il tuo Centro Operativo",
    description: "Gestisci ogni aspetto della tua attività: ordini, menu, clienti, staff e molto altro. Tutto è accessibile dalla barra laterale.",
    steps: [
      "Naviga tra i moduli dal menu laterale",
      "Usa la barra di ricerca per trovare qualsiasi funzione",
      "Attiva nuovi moduli dal Marketplace IA",
    ],
  },
  "/app/menu": {
    title: "Gestione Menu",
    description: "Crea, modifica e organizza il tuo menu digitale. Aggiungi foto IA, traduzioni automatiche e prezzi.",
    steps: [
      "Clicca + per aggiungere un nuovo piatto",
      "Trascina per riordinare le categorie",
      "Usa il generatore IA per creare foto professionali",
    ],
  },
  "/app/orders": {
    title: "Gestione Ordini",
    description: "Visualizza e gestisci tutti gli ordini in tempo reale: delivery, asporto e tavolo.",
    steps: [
      "I nuovi ordini appaiono automaticamente",
      "Cambia lo stato con un tap (In preparazione → Pronto → Consegnato)",
      "Filtra per tipo di ordine o stato",
    ],
  },
  "/app/reservations": {
    title: "Prenotazioni",
    description: "Gestisci le prenotazioni dei clienti con calendario, conferme automatiche e promemoria.",
    steps: [
      "Visualizza le prenotazioni per giorno",
      "Conferma o rifiuta con un tap",
      "I clienti ricevono notifica automatica",
    ],
  },
  "/app/reviews": {
    title: "Recensioni & Review Shield",
    description: "Il sistema Review Shield mostra automaticamente le recensioni migliori e ti aiuta a gestire quelle negative in privato.",
    steps: [
      "Le recensioni ≥4 stelle sono pubbliche automaticamente",
      "Quelle sotto le 4 stelle restano private per aiutarti a migliorare",
      "Rispondi ai clienti direttamente dall'app",
    ],
  },
  "/app/tables": {
    title: "Mappa Tavoli",
    description: "Gestisci la disposizione e lo stato dei tavoli in tempo reale. Assegna clienti e monitora l'occupazione.",
    steps: [
      "Tocca un tavolo per cambiare stato (libero/occupato)",
      "Trascina per riposizionare sulla mappa",
      "Collega un ordine al tavolo per il servizio",
    ],
  },
  "/app/kitchen": {
    title: "Vista Cucina",
    description: "Display dedicato alla cucina per gestire gli ordini in preparazione. Condividi il PIN con il tuo staff.",
    steps: [
      "Gli ordini appaiono in ordine cronologico",
      "Segna come completato quando il piatto è pronto",
      "Il cameriere riceve notifica automatica",
    ],
  },
  "/app/finance": {
    title: "Finanza & Report",
    description: "Monitora incassi, costi e margini. Genera report fiscali e fatture elettroniche.",
    steps: [
      "Consulta il fatturato giornaliero e mensile",
      "Scarica report in PDF per il commercialista",
      "Configura la fatturazione elettronica",
    ],
  },
  "/app/staff": {
    title: "Gestione Staff",
    description: "Gestisci il tuo team: turni, presenze e ruoli. Ogni membro ha accesso personalizzato.",
    steps: [
      "Aggiungi membri del team con ruoli specifici",
      "Monitora presenze con il sistema di timbratura",
      "Gestisci i turni settimanali",
    ],
  },
  "/app/settings": {
    title: "Impostazioni",
    description: "Personalizza la tua attività: informazioni, orari, colori, logo e integrazioni esterne.",
    steps: [
      "Modifica le informazioni base del locale",
      "Configura orari di apertura e chiusura",
      "Collega WhatsApp, Google e altri servizi",
    ],
  },
  "/app/whatsapp": {
    title: "WhatsApp Business",
    description: "Gestisci le comunicazioni WhatsApp con i clienti. Invia promozioni, conferme ordini e notifiche.",
    steps: [
      "Configura il numero WhatsApp Business",
      "Crea template per messaggi automatici",
      "Monitora le conversazioni attive",
    ],
  },
  "/app/inventory": {
    title: "Inventario",
    description: "Gestisci le scorte del magazzino. Ricevi avvisi per prodotti in esaurimento e genera ordini fornitori.",
    steps: [
      "Aggiungi prodotti con quantità e soglia minima",
      "Ricevi alert quando un prodotto scende sotto la soglia",
      "Genera automaticamente la lista della spesa",
    ],
  },
  "/app/loyalty": {
    title: "Programma Fedeltà",
    description: "Crea un programma punti per fidelizzare i clienti. Premia gli acquisti frequenti con sconti e omaggi.",
    steps: [
      "Configura le regole di accumulo punti",
      "Imposta i premi riscattabili",
      "Monitora i clienti più fedeli",
    ],
  },
  "/app/social": {
    title: "Social & Marketing",
    description: "Gestisci la presenza social della tua attività. Pianifica post, analizza le performance e automatizza il marketing.",
    steps: [
      "Collega i tuoi profili social",
      "Programma post con il calendario editoriale",
      "Monitora engagement e crescita follower",
    ],
  },
  "/app/automations": {
    title: "Automazioni",
    description: "Configura azioni automatiche per risparmiare tempo: notifiche, email, messaggi e workflow personalizzati.",
    steps: [
      "Attiva le automazioni predefinite con un toggle",
      "Personalizza i template dei messaggi",
      "Monitora quante automazioni sono state eseguite",
    ],
  },
  "/app/clients": {
    title: "CRM Clienti",
    description: "Database completo dei tuoi clienti con storico ordini, preferenze e segmentazione per campagne marketing.",
    steps: [
      "Consulta la scheda cliente con tutti i dettagli",
      "Filtra per frequenza, spesa o ultima visita",
      "Invia offerte personalizzate ai segmenti",
    ],
  },
  "/app/web-hub": {
    title: "Web Hub & Sito Pubblico",
    description: "Gestisci il tuo sito web pubblico con menu, orari, prenotazioni e pagina di contatto. Tutto aggiornato in automatico.",
    steps: [
      "Personalizza il sito con logo e colori",
      "Il menu si aggiorna automaticamente",
      "Condividi il link o il QR Code con i clienti",
    ],
  },
  "/app/ai-marketplace": {
    title: "Marketplace Agenti IA",
    description: "Scopri e attiva agenti IA specializzati per la tua attività: foto, traduzioni, analisi, content e molto altro.",
    steps: [
      "Sfoglia il catalogo per categoria o settore",
      "Attiva un agente con un tap",
      "Monitora l'uso e le performance nella dashboard",
    ],
  },
  /* ─── NCC-specific ─── */
  "/app/ncc-bookings": {
    title: "Prenotazioni NCC",
    description: "Gestisci i transfer e le prenotazioni del servizio noleggio con conducente.",
    steps: [
      "Crea una nuova prenotazione con destinazione e orario",
      "Assegna autista e veicolo",
      "Il cliente riceve conferma automatica via WhatsApp",
    ],
  },
  "/app/fleet": {
    title: "Gestione Flotta",
    description: "Monitora i veicoli della tua flotta: disponibilità, manutenzioni, scadenze assicurative.",
    steps: [
      "Aggiungi veicoli con dettagli e foto",
      "Ricevi alert per scadenze imminenti",
      "Assegna veicoli alle prenotazioni",
    ],
  },
  "/app/drivers": {
    title: "Gestione Autisti",
    description: "Database autisti con licenze, CQC, lingue parlate e disponibilità in tempo reale.",
    steps: [
      "Aggiungi autisti con documenti e competenze",
      "Monitora le scadenze delle patenti",
      "Assegna autisti in base alla disponibilità",
    ],
  },
  /* ─── Partner ─── */
  "/partner": {
    title: "Dashboard Partner",
    description: "Il tuo centro operativo per vendite, guadagni e gestione del team. Monitora le performance e accedi agli strumenti di vendita.",
    steps: [
      "Controlla vendite e commissioni in tempo reale",
      "Usa la demo sandbox per presentazioni ai clienti",
      "Accedi al toolkit di vendita e ai materiali marketing",
    ],
  },
  /* ─── Beauty / Healthcare / Fitness etc ─── */
  "/app/appointments": {
    title: "Agenda Appuntamenti",
    description: "Gestisci appuntamenti, trattamenti e servizi. I clienti possono prenotare online 24/7.",
    steps: [
      "Visualizza l'agenda giornaliera e settimanale",
      "Aggiungi servizi con durata e prezzo",
      "Conferma o sposta appuntamenti con un tap",
    ],
  },
  "/app/interventions": {
    title: "Gestione Interventi",
    description: "Pianifica e monitora interventi tecnici: stato, priorità, costi e documentazione fotografica.",
    steps: [
      "Crea un nuovo intervento con indirizzo e urgenza",
      "Assegna al tecnico disponibile",
      "Documenta con foto prima/dopo",
    ],
  },
  "/app/haccp": {
    title: "Registro HACCP",
    description: "Registra controlli igienico-sanitari obbligatori: temperature, pulizie e non conformità.",
    steps: [
      "Registra un nuovo controllo con tipo e risultato",
      "Compila le temperature dei frigoriferi",
      "Scarica il registro per le ispezioni",
    ],
  },
};

/* ─── INLINE FEATURE GUIDES (used via <InfoGuide guideKey="..." />) ─── */
export const featureGuides: Record<string, GuideEntry> = {
  /* Dashboard */
  "dashboard:tokens": {
    title: "Gettoni IA",
    description: "I gettoni IA alimentano le funzioni intelligenti: generazione menu, foto food porn, traduzioni e analisi. Quando si esauriscono, puoi acquistarne altri.",
    steps: [
      "Controlla il saldo nella dashboard",
      "Ogni funzione IA consuma un numero specifico di gettoni",
      "Acquista pacchetti dal pulsante dedicato",
    ],
  },
  "dashboard:orders": {
    title: "Ordini di Oggi",
    description: "Numero totale di ordini ricevuti oggi tra delivery, asporto e tavolo. Clicca per vedere i dettagli.",
  },
  "dashboard:revenue": {
    title: "Incasso Giornaliero",
    description: "Il fatturato totale della giornata calcolato dagli ordini completati.",
  },
  "dashboard:reservations": {
    title: "Prenotazioni",
    description: "Prenotazioni in arrivo per oggi. Le prenotazioni in attesa richiedono la tua conferma.",
  },
  "dashboard:reviews": {
    title: "Recensioni",
    description: "Media delle recensioni dei tuoi clienti. Il Review Shield protegge la tua reputazione online.",
  },
  /* Studio */
  "studio:plates": {
    title: "I Miei Piatti",
    description: "Carica le foto dei tuoi piatti vuoti. Li userai come base per generare foto food porn realistiche con il tuo vero piatto.",
    steps: [
      "Scatta una foto del piatto vuoto su sfondo pulito",
      "Caricala qui e assegna un nome",
      "Selezionalo quando generi una foto IA nel tab Foto",
    ],
  },
  "studio:photos": {
    title: "Generatore Foto IA",
    description: "Crea foto food porn professionali dei tuoi piatti usando l'intelligenza artificiale.",
    steps: [
      "Descrivi il piatto che vuoi fotografare",
      "Scegli uno stile (overhead, 45°, close-up)",
      "Opzionalmente seleziona uno dei tuoi piatti reali come base",
    ],
  },
  "studio:menu": {
    title: "Menu Creator IA",
    description: "Genera o aggiorna il tuo menu completo con l'aiuto dell'IA. Scrivi i piatti e l'IA crea categorie, descrizioni e traduzioni.",
  },
  /* Checkout */
  "checkout:order-type": {
    title: "Tipo di Ordine",
    description: "Scegli come vuoi ricevere il tuo ordine: a domicilio, da ritirare al locale, o servito direttamente al tavolo.",
  },
  "checkout:payment": {
    title: "Pagamento Sicuro",
    description: "Tutti i pagamenti sono processati in modo sicuro tramite Stripe. I tuoi dati non vengono mai memorizzati.",
  },
  "checkout:summary": {
    title: "Riepilogo Ordine",
    description: "Controlla gli articoli, le quantità e il totale prima di confermare. Il prezzo include IVA.",
  },
  /* Restaurant public */
  "restaurant:menu": {
    title: "Menù Digitale",
    description: "Sfoglia il menu completo. Puoi aggiungere piatti al carrello e ordinare direttamente dall'app.",
    steps: [
      "Scorri le categorie in alto",
      "Tocca un piatto per i dettagli e le opzioni",
      "Aggiungi al carrello e procedi all'ordine",
    ],
  },
  "restaurant:reviews": {
    title: "Recensioni Clienti",
    description: "Lascia una recensione sulla tua esperienza. Il sistema mostra le recensioni verificate dei clienti reali.",
  },
  "restaurant:cart": {
    title: "Il tuo Carrello",
    description: "Controlla gli articoli selezionati, modifica le quantità e procedi al checkout.",
  },
  /* Partner */
  "partner:earnings": {
    title: "I tuoi Guadagni",
    description: "Storico completo delle tue vendite, commissioni e payout. Collega il tuo account Stripe Connect per ricevere i pagamenti.",
    steps: [
      "Collega Stripe Connect dalla sezione Payout",
      "Monitora le vendite in tempo reale",
      "I pagamenti vengono inviati automaticamente ogni mese",
    ],
  },
  "partner:demo-credits": {
    title: "Demo Credits",
    description: "Crediti per sbloccare la sandbox demo per 24 ore. Ricevi 5 crediti alla registrazione. Ogni sblocco consuma 1 credito.",
  },
  "partner:recruitment": {
    title: "Reclutamento Partner",
    description: "Invita nuovi partner nel tuo team. Quando raggiungono obiettivi di vendita, guadagni bonus aggiuntivi.",
    steps: [
      "Condividi il tuo link di invito",
      "Il nuovo partner viene associato al tuo team",
      "Sblocca il ruolo Team Leader con 4 vendite + 2 reclutati",
    ],
  },
  "partner:sandbox": {
    title: "Demo Sandbox",
    description: "Un ristorante demo completo per le tue presentazioni ai clienti. Tutto funzionante con dati realistici.",
  },
  /* WhatsApp */
  "whatsapp:conversations": {
    title: "Conversazioni",
    description: "Tutte le chat WhatsApp con i tuoi clienti. I messaggi automatici vengono gestiti dall'IA.",
  },
  "whatsapp:templates": {
    title: "Template Messaggi",
    description: "Template pre-approvati per inviare messaggi broadcast ai clienti: promozioni, conferme e avvisi.",
  },
  /* Generic module */
  "subscription:plan": {
    title: "Il tuo Piano",
    description: "Dettagli del tuo abbonamento attuale, funzionalità incluse e opzioni di upgrade.",
    steps: [
      "Controlla le funzionalità del tuo piano",
      "Upgrada per sbloccare più funzionalità e gettoni IA",
      "Il trial gratuito dura 90 giorni",
    ],
  },
};
