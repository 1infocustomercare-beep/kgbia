/**
 * sectorFeatures.ts — Universal + sector-specific features and AI agents
 * Used by DemoSitePage and DemoAdminPage to render complete feature showcases
 */

export interface FeatureItem {
  icon: string;
  title: string;
  desc: string;
  category: "crm" | "booking" | "marketing" | "finance" | "analytics" | "operations" | "ai" | "sector";
}

export interface WorkflowStep {
  icon: string;
  label: string;
  detail: string;
}

export interface AIAgent {
  name: string;
  emoji: string;
  desc: string;
  capabilities: string[];
  isUniversal: boolean;
  hoursPerWeek?: number;
  accuracy?: number;
  category?: string;
  workflow?: WorkflowStep[];
  example?: string;
  result?: string;
}

// ═══════════════════════════════════════════
// UNIVERSAL FEATURES (all 25 sectors)
// ═══════════════════════════════════════════
export const UNIVERSAL_FEATURES: FeatureItem[] = [
  { icon: "Users", title: "CRM Intelligente AI", desc: "Profili completi con storico, preferenze e azioni proattive dell'AI per ogni cliente", category: "crm" },
  { icon: "Filter", title: "Segmentazione Automatica", desc: "Segmenta clienti per comportamento, spesa media, frequenza e valore lifetime", category: "crm" },
  { icon: "Calendar", title: "Booking Online 24/7", desc: "Prenotazioni anche di notte, sync Google Calendar e zero doppie prenotazioni", category: "booking" },
  { icon: "CalendarClock", title: "Agenda Multi-Operatore", desc: "Disponibilità team in tempo reale, gestione sovrapposizioni e pause", category: "booking" },
  { icon: "MessageCircle", title: "Reminder WhatsApp/SMS", desc: "Riduzione no-show del 70% con conferme e promemoria automatici", category: "booking" },
  { icon: "Phone", title: "WhatsApp Business", desc: "Risposte dalla dashboard, messaggi automatici e catalogo integrato", category: "marketing" },
  { icon: "Mail", title: "Email Marketing AI", desc: "Newsletter, promozioni personalizzate, A/B testing e testi scritti dall'AI", category: "marketing" },
  { icon: "Smartphone", title: "SMS Marketing", desc: "Tasso apertura 98%, orari ottimizzati dall'AI per massimo engagement", category: "marketing" },
  { icon: "Bot", title: "Chatbot AI Arianna", desc: "Live chat multilingua 12 lingue, 24/7, prende prenotazioni in autonomia", category: "ai" },
  { icon: "FileText", title: "Fatturazione Elettronica", desc: "XML SDI automatico, conservazione digitale e invio al Sistema di Interscambio", category: "finance" },
  { icon: "CreditCard", title: "Pagamenti Online", desc: "Stripe, PayPal, bonifico con riconciliazione automatica degli incassi", category: "finance" },
  { icon: "FileSignature", title: "Preventivi Digitali", desc: "Firma digitale, conversione automatica in ordine o fattura confermata", category: "finance" },
  { icon: "BarChart3", title: "Dashboard Analytics", desc: "Fatturato, clienti, trend, grafici interattivi aggiornati in tempo reale", category: "analytics" },
  { icon: "Send", title: "Report Settimanali", desc: "Report automatico via email ogni lunedì con KPI e suggerimenti AI", category: "analytics" },
  { icon: "TrendingUp", title: "Previsioni AI", desc: "Trend futuri, stagionalità, picchi di domanda previsti con machine learning", category: "analytics" },
  { icon: "Globe", title: "Landing Page Builder", desc: "Template ottimizzati per il tuo settore con A/B testing integrato", category: "marketing" },
  { icon: "MapPin", title: "Google My Business", desc: "Gestione recensioni, SEO locale e posizionamento su Google Maps", category: "marketing" },
  { icon: "Instagram", title: "Social Media AI", desc: "Post Instagram, Facebook e TikTok in autopilota con AI generativa", category: "marketing" },
  { icon: "UserCog", title: "Gestione Dipendenti", desc: "Turni, ferie, presenze, performance tracking e buste paga digitali", category: "operations" },
  { icon: "Award", title: "Programma Fedeltà", desc: "Wallet digitale, punti, premi, cashback e offerte personalizzate", category: "operations" },
  { icon: "QrCode", title: "QR Code & Tracking", desc: "Link tracciabili, QR per menu, prenotazioni e promozioni misurabili", category: "operations" },
];

// ═══════════════════════════════════════════
// 7 UNIVERSAL AI AGENTS
// ═══════════════════════════════════════════
export const UNIVERSAL_AGENTS: AIAgent[] = [
  { name: "Arianna — AI Concierge", emoji: "🎧", desc: "Receptionist 24/7 in 12 lingue: prende prenotazioni, qualifica lead e risponde a ogni domanda", capabilities: ["Booking automatico", "Lead qualification", "12 lingue", "Risposta istantanea"], isUniversal: true, hoursPerWeek: 168, accuracy: 97, category: "Concierge",
    workflow: [{ icon: "📩", label: "Messaggio in arrivo", detail: "Il cliente scrive via chat, WhatsApp o telefono" }, { icon: "🧠", label: "Analisi AI", detail: "Arianna identifica lingua, intento e urgenza" }, { icon: "📅", label: "Azione", detail: "Prenota, risponde o qualifica il lead in autonomia" }, { icon: "✅", label: "Conferma", detail: "Invia conferma al cliente e notifica al team" }],
    example: "Cliente scrive 'Vorrei prenotare per domani sera' → Arianna verifica disponibilità, propone 20:30, conferma e invia reminder",
    result: "Risparmio: 168h/settimana · Conversion rate: +42%" },
  { name: "Analytics Agent", emoji: "📊", desc: "Business Intelligence con KPI real-time, report automatici e previsioni vendite predittive", capabilities: ["KPI real-time", "Report automatici", "Forecast vendite", "Trend analysis"], isUniversal: true, hoursPerWeek: 15, accuracy: 94, category: "Analytics",
    workflow: [{ icon: "📥", label: "Raccolta dati", detail: "Aggrega dati da vendite, CRM, prenotazioni" }, { icon: "📈", label: "Analisi trend", detail: "Identifica pattern, anomalie e stagionalità" }, { icon: "🔮", label: "Previsioni", detail: "Genera forecast con machine learning" }, { icon: "📧", label: "Report", detail: "Invia report settimanale con suggerimenti" }],
    example: "Lunedì mattina ricevi: 'Fatturato +18% vs settimana scorsa. Il martedì sera è il tuo slot più redditizio (+€340). Suggerimento: promo lunedì per bilanciare.'",
    result: "Risparmio: 15h/settimana · Decisioni data-driven: +94%" },
  { name: "Marketing Agent", emoji: "📣", desc: "Content & Campaigns: post social, newsletter, ads con ROI +240% medio", capabilities: ["Post social AI", "Newsletter", "Ads management", "ROI +240%"], isUniversal: true, hoursPerWeek: 20, accuracy: 91, category: "Marketing",
    workflow: [{ icon: "🎯", label: "Strategia", detail: "Analizza target, trend e competitor" }, { icon: "✍️", label: "Creazione", detail: "Genera testi, immagini e hashtag ottimizzati" }, { icon: "📱", label: "Pubblicazione", detail: "Pubblica su Instagram, Facebook, TikTok" }, { icon: "📊", label: "Ottimizzazione", detail: "Misura risultati e migliora in automatico" }],
    example: "Crea post Instagram con foto del piatto del giorno → Hashtag ottimizzati → Pubblica alle 12:30 (orario migliore) → +340 impression",
    result: "Risparmio: 20h/settimana · ROI medio: +240%" },
  { name: "Sales Agent", emoji: "💼", desc: "Lead scoring, follow-up automatici e sequenze personalizzate per chiudere più vendite", capabilities: ["Lead scoring", "Follow-up auto", "Sequenze email", "Pipeline CRM"], isUniversal: true, hoursPerWeek: 12, accuracy: 89, category: "Vendite",
    workflow: [{ icon: "🎣", label: "Lead capture", detail: "Cattura lead da sito, social e referral" }, { icon: "⭐", label: "Scoring", detail: "Assegna punteggio in base a interesse e budget" }, { icon: "📧", label: "Follow-up", detail: "Sequenza email/WhatsApp personalizzata" }, { icon: "🤝", label: "Chiusura", detail: "Notifica al team quando il lead è pronto" }],
    example: "Nuovo lead da Google → Score 85/100 (alto interesse) → Email personalizzata dopo 2h → Follow-up WhatsApp dopo 24h → Conversione",
    result: "Risparmio: 12h/settimana · Conversion rate: +35%" },
  { name: "Operations Agent", emoji: "⚙️", desc: "Workflow automation: scheduling, assegnazioni e notifiche — risparmia 15h/settimana", capabilities: ["Scheduling AI", "Assegnazioni auto", "Notifiche smart", "15h risparmiate"], isUniversal: true, hoursPerWeek: 15, accuracy: 96, category: "Operazioni",
    workflow: [{ icon: "📋", label: "Task detection", detail: "Identifica attività ricorrenti e bottleneck" }, { icon: "🤖", label: "Automazione", detail: "Crea workflow automatici senza codice" }, { icon: "👥", label: "Assegnazione", detail: "Distribuisce task al team in base a carico" }, { icon: "🔔", label: "Notifiche", detail: "Alert smart solo quando serve" }],
    example: "Nuova prenotazione → Assegna operatore libero → Prepara materiali → Invia conferma al cliente → Reminder 24h prima",
    result: "Risparmio: 15h/settimana · Errori operativi: -72%" },
  { name: "Compliance Agent", emoji: "🛡️", desc: "Normative GDPR, scadenze documenti e compliance automatica per ogni settore", capabilities: ["GDPR audit", "Scadenze auto", "Documenti conformi", "Alert normativi"], isUniversal: true, hoursPerWeek: 8, accuracy: 99, category: "Compliance",
    workflow: [{ icon: "🔍", label: "Scan", detail: "Analizza dati e processi per conformità" }, { icon: "⚠️", label: "Alert", detail: "Identifica scadenze e non-conformità" }, { icon: "📄", label: "Documenti", detail: "Genera documenti GDPR e consensi" }, { icon: "✅", label: "Certificazione", detail: "Report compliance aggiornato" }],
    example: "Scadenza certificato tra 30gg → Alert al responsabile → Prepara documentazione → Reminder settimanali fino al rinnovo",
    result: "Risparmio: 8h/settimana · Compliance: 100%" },
  { name: "Customer Success", emoji: "❤️", desc: "Prevede abbandoni, gestisce NPS e campagne win-back — retention +35%", capabilities: ["Churn prediction", "NPS tracking", "Win-back auto", "Retention +35%"], isUniversal: true, hoursPerWeek: 10, accuracy: 92, category: "Retention",
    workflow: [{ icon: "📉", label: "Monitoring", detail: "Analizza comportamento e frequenza clienti" }, { icon: "🚨", label: "Churn alert", detail: "Identifica clienti a rischio abbandono" }, { icon: "🎁", label: "Win-back", detail: "Invia offerta personalizzata automatica" }, { icon: "📊", label: "NPS", detail: "Misura soddisfazione e migliora servizio" }],
    example: "Cliente non torna da 45gg → Churn risk 78% → Invia sconto 15% personalizzato → Cliente ritorna entro 7gg",
    result: "Risparmio: 10h/settimana · Retention: +35%" },
];

// ═══════════════════════════════════════════
// SECTOR-SPECIFIC FEATURES
// ═══════════════════════════════════════════
export const SECTOR_SPECIFIC_FEATURES: Record<string, FeatureItem[]> = {
  food: [
    { icon: "QrCode", title: "Menu Digitale QR", desc: "Clienti scansionano e ordinano dal tavolo con foto HD e traduzioni", category: "sector" },
    { icon: "ChefHat", title: "Kitchen Display System", desc: "Ordini in tempo reale con priorità, tempi e stato preparazione", category: "sector" },
    { icon: "LayoutGrid", title: "Gestione Tavoli Mappa", desc: "Mappa interattiva tavoli con stati, assegnazioni e coperti", category: "sector" },
    { icon: "Truck", title: "Ordini Delivery", desc: "Gestione delivery, takeaway e ordini WhatsApp in un'unica interfaccia", category: "sector" },
    { icon: "Package", title: "Magazzino Ingredienti", desc: "Inventario con alert scorte, food cost e ordini fornitori automatici", category: "sector" },
    { icon: "Calculator", title: "Food Cost Calculator", desc: "Calcolo costo piatto, margini e suggerimenti pricing ottimale", category: "sector" },
  ],
  ncc: [
    { icon: "Car", title: "Booking Transfer", desc: "Prenotazioni con calcolo automatico prezzo per tratta e veicolo", category: "sector" },
    { icon: "Truck", title: "Gestione Flotta", desc: "Veicoli, scadenze, manutenzione, assicurazioni e revisioni", category: "sector" },
    { icon: "UserCheck", title: "Assegnazione Autisti AI", desc: "L'AI assegna automaticamente l'autista migliore per ogni corsa", category: "sector" },
    { icon: "Navigation", title: "GPS Tracking", desc: "Posizione veicoli in tempo reale e tracking condiviso col cliente", category: "sector" },
    { icon: "TrendingUp", title: "Tariffario Dinamico", desc: "Pricing che si adatta a stagione, domanda e tipo di servizio", category: "sector" },
  ],
  beauty: [
    { icon: "Camera", title: "Portfolio Before/After", desc: "Gallery professionale dei trattamenti per social e sito web", category: "sector" },
    { icon: "ClipboardList", title: "Schede Cliente", desc: "Storico completo trattamenti, allergie, prodotti usati e preferenze", category: "sector" },
    { icon: "Users", title: "Multi-Operatore", desc: "Gestione completa staff con slot individuali e specializzazioni", category: "sector" },
    { icon: "ShoppingBag", title: "Prodotti Retail", desc: "Vendita prodotti in salone con inventario e suggerimenti AI", category: "sector" },
  ],
  healthcare: [
    { icon: "FileText", title: "Cartelle Cliniche", desc: "Storico visite, referti, prescrizioni e allergie in formato digitale", category: "sector" },
    { icon: "Video", title: "Telemedicina", desc: "Videoconsulti integrati con cartella clinica collegata", category: "sector" },
    { icon: "Pill", title: "Prescrizioni Digitali", desc: "Prescrizioni elettroniche con invio diretto in farmacia", category: "sector" },
    { icon: "Shield", title: "Sala Attesa Digitale", desc: "Gestione code virtuali con notifica al paziente via SMS", category: "sector" },
  ],
  retail: [
    { icon: "ShoppingCart", title: "E-commerce", desc: "Negozio online integrato con catalogo, varianti e spedizioni", category: "sector" },
    { icon: "Barcode", title: "Inventario Barcode", desc: "Scansione codici a barre, giacenze in tempo reale e alert scorte", category: "sector" },
    { icon: "Monitor", title: "POS Digitale", desc: "Punto cassa digitale con scontrini e chiusura fiscale", category: "sector" },
    { icon: "Image", title: "Catalogo Premium", desc: "Catalogo prodotti con foto professionali e filtri avanzati", category: "sector" },
  ],
  fitness: [
    { icon: "Ticket", title: "Abbonamenti", desc: "Gestione piani, rinnovi automatici e scadenze con notifiche", category: "sector" },
    { icon: "Calendar", title: "Prenotazione Corsi", desc: "Iscrizione online a lezioni e personal training", category: "sector" },
    { icon: "QrCode", title: "Check-in QR", desc: "Accesso alla palestra con scansione QR dal telefono", category: "sector" },
    { icon: "ClipboardList", title: "Schede Allenamento", desc: "Programmi personalizzati con tracking progressi", category: "sector" },
  ],
  hospitality: [
    { icon: "Building", title: "Gestione Camere", desc: "Disponibilità, tariffe, pulizie e manutenzione camere", category: "sector" },
    { icon: "Globe", title: "Booking Diretto", desc: "Prenotazioni dirette zero commissioni OTA con booking engine", category: "sector" },
    { icon: "Smartphone", title: "Check-in Digitale", desc: "Check-in online con documento e preferenze ospite", category: "sector" },
    { icon: "Sparkles", title: "Concierge Digitale", desc: "Info su servizi, ristoranti ed escursioni per gli ospiti", category: "sector" },
  ],
  beach: [
    { icon: "LayoutGrid", title: "Mappa Ombrelloni", desc: "Mappa interattiva con prenotazione ombrelloni e lettini", category: "sector" },
    { icon: "Calendar", title: "Prenotazioni Online", desc: "Prenotazione posto spiaggia con pagamento anticipato", category: "sector" },
    { icon: "Ticket", title: "Abbonamenti Stagionali", desc: "Gestione abbonamenti, pass e ingressi giornalieri", category: "sector" },
    { icon: "Coffee", title: "Ordini Bar dal Lettino", desc: "I clienti ordinano dal lettino con consegna diretta", category: "sector" },
  ],
  plumber: [
    { icon: "Wrench", title: "Gestione Interventi", desc: "Ticket lavori con stato, foto, preventivi e fatturazione", category: "sector" },
    { icon: "FileSignature", title: "Preventivi dal Cantiere", desc: "Crea preventivi professionali direttamente dal telefono", category: "sector" },
    { icon: "Navigation", title: "GPS Dispatch", desc: "Assegna interventi al tecnico più vicino con AI routing", category: "sector" },
    { icon: "Package", title: "Magazzino Ricambi", desc: "Inventario pezzi di ricambio con alert scorte automatici", category: "sector" },
  ],
  electrician: [
    { icon: "Wrench", title: "Gestione Lavori", desc: "Gestione completa interventi elettrici con tracking stato", category: "sector" },
    { icon: "Shield", title: "Certificazioni DICO/DIRI", desc: "Generazione automatica certificati di conformità", category: "sector" },
    { icon: "Package", title: "Materiali & Forniture", desc: "Inventario materiali con ordini automatici ai fornitori", category: "sector" },
    { icon: "Globe", title: "Portale Clienti", desc: "Area clienti con storico lavori, documenti e fatture", category: "sector" },
  ],
  agriturismo: [
    { icon: "Building", title: "Camere & Alloggi", desc: "Gestione camere, appartamenti e disponibilità stagionale", category: "sector" },
    { icon: "UtensilsCrossed", title: "Ristorante km0", desc: "Menu con prodotti dell'azienda, ordini e prenotazioni", category: "sector" },
    { icon: "Sparkles", title: "Attività Esperienze", desc: "Tour, degustazioni, corsi e attività all'aperto prenotabili", category: "sector" },
    { icon: "ShoppingBag", title: "Shop Prodotti", desc: "E-commerce prodotti locali con spedizione in tutta Italia", category: "sector" },
  ],
  cleaning: [
    { icon: "FileText", title: "Contratti", desc: "Gestione contratti di pulizia con rinnovi e SLA", category: "sector" },
    { icon: "Calendar", title: "Scheduling Operatori", desc: "Pianificazione turni e assegnazione zone automatica", category: "sector" },
    { icon: "ClipboardList", title: "Checklist Qualità", desc: "Checklist digitali con foto e firma del responsabile", category: "sector" },
    { icon: "Ticket", title: "Abbonamenti", desc: "Piani di pulizia ricorrenti con fatturazione automatica", category: "sector" },
  ],
  legal: [
    { icon: "FileText", title: "Gestione Pratiche", desc: "Fascicoli digitali con documenti, scadenze e stato avanzamento", category: "sector" },
    { icon: "Clock", title: "Scadenzario", desc: "Alert automatici per udienze, termini e scadenze processuali", category: "sector" },
    { icon: "Calculator", title: "Parcelle Timesheet", desc: "Tracking ore, calcolo parcella e fatturazione automatica", category: "sector" },
    { icon: "Archive", title: "Archivio Documenti", desc: "Archivio digitale con ricerca full-text e versioning", category: "sector" },
  ],
  accounting: [
    { icon: "Clock", title: "Scadenze Fiscali", desc: "Calendario scadenze con notifiche automatiche a te e ai clienti", category: "sector" },
    { icon: "Globe", title: "Portale Clienti", desc: "Area riservata per upload documenti e consultazione stato", category: "sector" },
    { icon: "FileText", title: "Dichiarazioni", desc: "Gestione dichiarazioni con stato avanzamento e firma digitale", category: "sector" },
    { icon: "BarChart3", title: "Bilanci", desc: "Analisi bilancio, indici e report personalizzati per cliente", category: "sector" },
  ],
  garage: [
    { icon: "Wrench", title: "Gestione Riparazioni", desc: "Accettazione digitale, stato lavori e notifica al cliente", category: "sector" },
    { icon: "Smartphone", title: "Accettazione Digitale", desc: "Check-in veicolo con foto e firma del cliente", category: "sector" },
    { icon: "Package", title: "Magazzino Ricambi", desc: "Inventario pezzi con compatibilità veicoli e ordini OEM", category: "sector" },
    { icon: "Car", title: "Storico Veicoli", desc: "Scheda tecnica per ogni veicolo con storico interventi completo", category: "sector" },
  ],
  photography: [
    { icon: "Camera", title: "Gestione Shooting", desc: "Pianificazione sessioni con brief, location e mood board", category: "sector" },
    { icon: "Image", title: "Portfolio Online", desc: "Gallery professionale con lightbox e protezione watermark", category: "sector" },
    { icon: "Download", title: "Consegna Gallerie", desc: "Link privati per download foto con selezione del cliente", category: "sector" },
    { icon: "FileSignature", title: "Contratti & Liberatorie", desc: "Firma digitale contratti e liberatorie modelle/location", category: "sector" },
  ],
  construction: [
    { icon: "HardHat", title: "Gestione Cantieri", desc: "Dashboard cantieri con SAL, materiali e squadre assegnate", category: "sector" },
    { icon: "Calculator", title: "Computo Metrico", desc: "Computo metrico estimativo con voci di prezzo aggiornate", category: "sector" },
    { icon: "Package", title: "Materiali", desc: "Ordini materiali, bolle di consegna e giacenze cantiere", category: "sector" },
    { icon: "Users", title: "Subappaltatori", desc: "Gestione squadre, subappalti e documentazione sicurezza", category: "sector" },
  ],
  gardening: [
    { icon: "Wrench", title: "Manutenzioni", desc: "Calendario manutenzioni periodiche con storico interventi", category: "sector" },
    { icon: "Ticket", title: "Abbonamenti", desc: "Piani manutenzione stagionale con fatturazione automatica", category: "sector" },
    { icon: "Camera", title: "Before/After Portfolio", desc: "Gallery progetti con confronto prima/dopo per il marketing", category: "sector" },
    { icon: "Calendar", title: "Scheduling Stagionale", desc: "Pianificazione lavori in base a clima e stagione", category: "sector" },
  ],
  veterinary: [
    { icon: "ClipboardList", title: "Cartelle Animali", desc: "Storico visite, vaccinazioni, allergie e terapie per ogni animale", category: "sector" },
    { icon: "Bell", title: "Promemoria Vaccini", desc: "Alert automatici ai proprietari per richiami e check-up", category: "sector" },
    { icon: "Pill", title: "Farmacia", desc: "Gestione farmaci veterinari con prescrizioni e giacenze", category: "sector" },
    { icon: "AlertTriangle", title: "Emergenze", desc: "Gestione urgenze con triage e slot di emergenza dedicati", category: "sector" },
  ],
  tattoo: [
    { icon: "Calendar", title: "Appuntamenti", desc: "Booking con durata stimata, deposito e conferma automatica", category: "sector" },
    { icon: "Image", title: "Portfolio Artisti", desc: "Gallery per artista con stili, categorie e flash disponibili", category: "sector" },
    { icon: "FileSignature", title: "Consensi Digitali", desc: "Firma digitale consensi e liberatorie pre-sessione", category: "sector" },
    { icon: "Heart", title: "Cura Post Tattoo", desc: "Istruzioni aftercare inviate automaticamente via WhatsApp", category: "sector" },
  ],
  childcare: [
    { icon: "Baby", title: "Gestione Bambini", desc: "Schede personali con allergie, contatti e note mediche", category: "sector" },
    { icon: "CheckCircle", title: "Presenze", desc: "Check-in/out con notifica ai genitori in tempo reale", category: "sector" },
    { icon: "BookOpen", title: "Attività Educative", desc: "Pianificazione attività didattiche e ludiche settimanali", category: "sector" },
    { icon: "MessageCircle", title: "Diario Genitori", desc: "Aggiornamenti foto e attività inviati ai genitori ogni giorno", category: "sector" },
  ],
  education: [
    { icon: "BookOpen", title: "Catalogo Corsi", desc: "Corsi con programma, docente, durata e iscrizione online", category: "sector" },
    { icon: "Monitor", title: "LMS", desc: "Piattaforma e-learning con video, quiz e materiali scaricabili", category: "sector" },
    { icon: "Ticket", title: "Iscrizioni", desc: "Iscrizione online con pagamento, fattura e conferma automatica", category: "sector" },
    { icon: "Award", title: "Certificati Automatici", desc: "Generazione attestati al completamento del corso", category: "sector" },
  ],
  events: [
    { icon: "Calendar", title: "Gestione Completa", desc: "Pianificazione eventi con timeline, task e deadline", category: "sector" },
    { icon: "Calculator", title: "Budget", desc: "Gestione budget per voce con tracking spese reali vs preventivo", category: "sector" },
    { icon: "Users", title: "Fornitori", desc: "Database fornitori con preventivi, contratti e rating", category: "sector" },
    { icon: "ClipboardList", title: "Lista Ospiti RSVP", desc: "Inviti digitali con RSVP, tavoli assegnati e menu scelte", category: "sector" },
  ],
  logistics: [
    { icon: "Truck", title: "Spedizioni", desc: "Gestione spedizioni con tracking, bolle e documenti di trasporto", category: "sector" },
    { icon: "Navigation", title: "Tracking GPS", desc: "Posizione mezzi in tempo reale con ETA aggiornato", category: "sector" },
    { icon: "Car", title: "Flotta", desc: "Gestione veicoli commerciali con scadenze e manutenzione", category: "sector" },
    { icon: "Route", title: "Rotte Ottimizzate", desc: "AI ottimizza percorsi per ridurre km, tempo e carburante", category: "sector" },
  ],
  custom: [
    { icon: "Settings", title: "Configuratore Moduli", desc: "Scegli i moduli che ti servono e personalizza ogni dettaglio", category: "sector" },
    { icon: "Workflow", title: "Workflow Builder", desc: "Crea automazioni custom con trigger, condizioni e azioni", category: "sector" },
    { icon: "Code", title: "API Custom", desc: "Integra i tuoi sistemi esistenti con API RESTful documentate", category: "sector" },
    { icon: "Bot", title: "AI Configurator", desc: "Configura il comportamento degli agenti AI per il tuo caso d'uso", category: "sector" },
  ],
};

// ═══════════════════════════════════════════
// SECTOR-SPECIFIC AI AGENTS
// ═══════════════════════════════════════════
export const SECTOR_SPECIFIC_AGENTS: Record<string, AIAgent[]> = {
  food: [
    { name: "Chef AI", emoji: "👨‍🍳", desc: "Ottimizza menu analizzando vendite, margini e trend stagionali", capabilities: ["Analisi menu", "Food cost", "Ottimizzazione margini"], isUniversal: false, accuracy: 93 },
    { name: "Food Cost Optimizer", emoji: "💰", desc: "Riduce sprechi e ottimizza acquisti ingredienti in base alla domanda", capabilities: ["Demand forecast", "Waste reduction", "Ordini fornitori"], isUniversal: false, accuracy: 91 },
    { name: "Review Manager AI", emoji: "⭐", desc: "Risponde automaticamente alle recensioni e gestisce la reputazione", capabilities: ["Risposte auto", "Sentiment analysis", "Alert negativi"], isUniversal: false, accuracy: 88 },
  ],
  ncc: [
    { name: "Route Optimizer AI", emoji: "🗺️", desc: "Ottimizza percorsi per ridurre tempi e costi carburante", capabilities: ["Route planning", "Traffic prediction", "Fuel savings"], isUniversal: false, accuracy: 94 },
    { name: "Fleet Maintenance AI", emoji: "🔧", desc: "Prevede guasti e pianifica manutenzione preventiva della flotta", capabilities: ["Predictive maintenance", "Alert scadenze", "Cost tracking"], isUniversal: false, accuracy: 96 },
  ],
  beauty: [
    { name: "Beauty Advisor AI", emoji: "💄", desc: "Suggerisce trattamenti in base a storico e trend stagionali", capabilities: ["Suggerimenti", "Cross-selling", "Trend beauty"], isUniversal: false, accuracy: 90 },
    { name: "Inventory AI", emoji: "📦", desc: "Gestione scorte prodotti con alert riordino automatico", capabilities: ["Stock management", "Auto-reorder", "Expiry tracking"], isUniversal: false, accuracy: 95 },
  ],
  healthcare: [
    { name: "Triage AI", emoji: "🩺", desc: "Pre-valutazione sintomi e prioritizzazione urgenze", capabilities: ["Symptom analysis", "Priorità urgenze", "Suggerimenti visite"], isUniversal: false, accuracy: 97 },
    { name: "Medical Compliance AI", emoji: "📋", desc: "Verifica conformità normativa e gestione consensi GDPR", capabilities: ["GDPR audit", "Consensi tracking", "Data retention"], isUniversal: false, accuracy: 99 },
    { name: "Patient Engagement AI", emoji: "❤️", desc: "Follow-up automatici, reminder screening e comunicazioni personalizzate", capabilities: ["Follow-up auto", "Screening reminder", "Engagement score"], isUniversal: false, accuracy: 92 },
  ],
  retail: [
    { name: "Visual Merchandising AI", emoji: "🎨", desc: "Suggerisce layout vetrina e posizionamento prodotti per massimizzare vendite", capabilities: ["Layout optimization", "Product placement", "Seasonal display"], isUniversal: false, accuracy: 87 },
    { name: "Demand Forecasting AI", emoji: "📈", desc: "Prevede domanda per ogni prodotto e suggerisce quantità ordine", capabilities: ["Demand prediction", "Stock optimization", "Seasonal trends"], isUniversal: false, accuracy: 93 },
    { name: "Pricing Optimizer AI", emoji: "💲", desc: "Ottimizza prezzi in base a concorrenza, domanda e margini target", capabilities: ["Dynamic pricing", "Competitor analysis", "Margin optimization"], isUniversal: false, accuracy: 90 },
  ],
  fitness: [
    { name: "Fitness Coach AI", emoji: "🏋️", desc: "Crea schede allenamento personalizzate e monitora progressi", capabilities: ["Workout planning", "Progress tracking", "Nutrition tips"], isUniversal: false, accuracy: 88 },
    { name: "Retention Gym AI", emoji: "🔄", desc: "Prevede abbandoni e attiva campagne di retention personalizzate", capabilities: ["Churn prediction", "Re-engagement", "Offerte personalizzate"], isUniversal: false, accuracy: 91 },
    { name: "Class Optimizer AI", emoji: "📅", desc: "Ottimizza orari e capienza corsi basandosi sui dati di partecipazione", capabilities: ["Demand analysis", "Schedule optimization", "Instructor matching"], isUniversal: false, accuracy: 93 },
  ],
  hospitality: [
    { name: "Revenue Management AI", emoji: "💰", desc: "Ottimizza tariffe camere in base a occupancy, stagione e competitor", capabilities: ["Dynamic pricing", "Occupancy forecast", "RevPAR optimization"], isUniversal: false, accuracy: 94 },
    { name: "Guest Experience AI", emoji: "🌟", desc: "Personalizza il soggiorno in base a preferenze e storico ospite", capabilities: ["Guest profiling", "Upsell suggestions", "Review management"], isUniversal: false, accuracy: 90 },
  ],
  beach: [
    { name: "Beach Optimizer AI", emoji: "🏖️", desc: "Ottimizza disposizione ombrelloni e pricing in base a meteo e domanda", capabilities: ["Weather-based pricing", "Layout optimization", "Demand forecast"], isUniversal: false, accuracy: 89 },
    { name: "F&B Beach AI", emoji: "🍹", desc: "Gestione ordini bar da ombrellone con suggerimenti basati su meteo", capabilities: ["Smart menu", "Delivery optimization", "Weather-based promos"], isUniversal: false, accuracy: 87 },
  ],
  plumber: [
    { name: "Emergency Dispatch AI", emoji: "🚨", desc: "Assegna urgenze al tecnico più vicino con routing ottimale", capabilities: ["GPS dispatch", "Priority triage", "SLA tracking"], isUniversal: false, accuracy: 95 },
    { name: "Preventive Maintenance AI", emoji: "🔧", desc: "Pianifica manutenzioni preventive basate su storico e stagione", capabilities: ["Maintenance calendar", "Client reminders", "Parts forecast"], isUniversal: false, accuracy: 92 },
  ],
  electrician: [
    { name: "Electrical Compliance AI", emoji: "⚡", desc: "Genera certificazioni DICO/DIRI e verifica conformità normativa", capabilities: ["Auto-certification", "Compliance check", "Document generation"], isUniversal: false, accuracy: 98 },
    { name: "Quote Calculator AI", emoji: "🧮", desc: "Calcola preventivi basati su tipo di lavoro, materiali e tempistiche", capabilities: ["Auto-quoting", "Material pricing", "Time estimation"], isUniversal: false, accuracy: 91 },
  ],
  agriturismo: [
    { name: "Agri-Tourism Experience AI", emoji: "🌾", desc: "Suggerisce esperienze e pacchetti in base a stagione e profilo ospite", capabilities: ["Package creation", "Seasonal suggestions", "Experience curation"], isUniversal: false, accuracy: 88 },
    { name: "Farm-to-Table AI", emoji: "🥗", desc: "Ottimizza menu ristorante in base a prodotti disponibili dall'azienda", capabilities: ["Menu planning", "Product availability", "Seasonal recipes"], isUniversal: false, accuracy: 90 },
  ],
  cleaning: [
    { name: "Cleaning Scheduler AI", emoji: "🧹", desc: "Pianifica turni ottimali e assegna zone in base a competenze e carico", capabilities: ["Shift planning", "Zone assignment", "Workload balancing"], isUniversal: false, accuracy: 93 },
    { name: "Quality Control AI", emoji: "✅", desc: "Analizza checklist e foto per verificare standard di qualità", capabilities: ["Photo analysis", "Quality scoring", "Issue detection"], isUniversal: false, accuracy: 91 },
  ],
  legal: [
    { name: "Legal Research AI", emoji: "📚", desc: "Ricerca giurisprudenza e normativa pertinente al caso", capabilities: ["Case research", "Precedent analysis", "Normative updates"], isUniversal: false, accuracy: 89 },
    { name: "Legal Deadline AI", emoji: "⏰", desc: "Monitora tutte le scadenze processuali e genera alert prioritizzati", capabilities: ["Deadline tracking", "Priority alerts", "Calendar sync"], isUniversal: false, accuracy: 99 },
    { name: "Client Intake AI", emoji: "📝", desc: "Qualifica nuovi clienti, raccoglie informazioni e prepara il fascicolo", capabilities: ["Client screening", "Document collection", "Case assessment"], isUniversal: false, accuracy: 87 },
  ],
  accounting: [
    { name: "Tax Calendar AI", emoji: "📅", desc: "Calendario fiscale personalizzato con scadenze per ogni cliente", capabilities: ["Tax deadlines", "Client notifications", "Regulatory updates"], isUniversal: false, accuracy: 98 },
    { name: "Document Classifier AI", emoji: "📄", desc: "Classifica automaticamente documenti ricevuti dai clienti", capabilities: ["Auto-classification", "OCR extraction", "Filing automation"], isUniversal: false, accuracy: 94 },
    { name: "Tax Advisory AI", emoji: "💡", desc: "Suggerisce ottimizzazioni fiscali basate sul profilo del cliente", capabilities: ["Tax optimization", "Deduction finder", "Compliance check"], isUniversal: false, accuracy: 91 },
  ],
  garage: [
    { name: "Diagnostic AI", emoji: "🔍", desc: "Analisi sintomi veicolo e suggerimento diagnosi probabile", capabilities: ["Symptom analysis", "Diagnosis suggestion", "Parts identification"], isUniversal: false, accuracy: 88 },
    { name: "Parts Procurement AI", emoji: "📦", desc: "Trova ricambi migliori al miglior prezzo da fornitori verificati", capabilities: ["Part search", "Price comparison", "Supplier rating"], isUniversal: false, accuracy: 92 },
    { name: "Service Reminder AI", emoji: "🔔", desc: "Invia promemoria tagliandi e revisioni basati su km e scadenze", capabilities: ["Km tracking", "Service intervals", "Auto-reminders"], isUniversal: false, accuracy: 96 },
  ],
  photography: [
    { name: "Creative Brief AI", emoji: "🎯", desc: "Genera brief creativi basati su tipo di shooting e stile richiesto", capabilities: ["Brief generation", "Mood board", "Style matching"], isUniversal: false, accuracy: 85 },
    { name: "Editing Workflow AI", emoji: "🖼️", desc: "Ottimizza il workflow di post-produzione e suggerisce editing", capabilities: ["Batch processing", "Style consistency", "Delivery tracking"], isUniversal: false, accuracy: 87 },
  ],
  construction: [
    { name: "Project Timeline AI", emoji: "📊", desc: "Genera Gantt automatici e monitora avanzamento cantiere", capabilities: ["Gantt auto", "Milestone tracking", "Delay prediction"], isUniversal: false, accuracy: 90 },
    { name: "Material Cost AI", emoji: "💰", desc: "Stima costi materiali e trova fornitori al miglior prezzo", capabilities: ["Cost estimation", "Supplier comparison", "Budget tracking"], isUniversal: false, accuracy: 92 },
    { name: "Safety Compliance AI", emoji: "⛑️", desc: "Verifica conformità sicurezza cantiere e genera documenti obbligatori", capabilities: ["Safety audit", "Document generation", "Training tracking"], isUniversal: false, accuracy: 97 },
  ],
  gardening: [
    { name: "Garden Planner AI", emoji: "🌿", desc: "Progetta giardini in base a clima, terreno e preferenze del cliente", capabilities: ["Garden design", "Plant selection", "Season planning"], isUniversal: false, accuracy: 86 },
    { name: "Seasonal Task AI", emoji: "🍂", desc: "Genera calendario manutenzioni in base a stagione e tipo di piante", capabilities: ["Task scheduling", "Plant care", "Weather alerts"], isUniversal: false, accuracy: 90 },
  ],
  veterinary: [
    { name: "Vet Triage AI", emoji: "🐾", desc: "Pre-valutazione sintomi animali e prioritizzazione emergenze", capabilities: ["Symptom check", "Emergency priority", "Species-specific"], isUniversal: false, accuracy: 93 },
    { name: "Pet Health Reminder AI", emoji: "💉", desc: "Promemoria vaccini, sverminazioni e check-up per ogni paziente", capabilities: ["Vaccine calendar", "Health alerts", "Owner notifications"], isUniversal: false, accuracy: 97 },
  ],
  tattoo: [
    { name: "Tattoo Booking AI", emoji: "🎨", desc: "Gestisce prenotazioni con stima durata, deposito e sessioni multiple", capabilities: ["Duration estimation", "Deposit management", "Multi-session"], isUniversal: false, accuracy: 89 },
    { name: "Aftercare AI", emoji: "💊", desc: "Istruzioni personalizzate post-tattoo inviate in automatico", capabilities: ["Custom aftercare", "Follow-up reminders", "Healing tracking"], isUniversal: false, accuracy: 94 },
  ],
  childcare: [
    { name: "Child Activity Planner AI", emoji: "🎨", desc: "Pianifica attività educative adatte all'età e interessi dei bambini", capabilities: ["Age-appropriate activities", "Learning goals", "Material prep"], isUniversal: false, accuracy: 88 },
    { name: "Parent Communication AI", emoji: "👪", desc: "Genera aggiornamenti quotidiani con foto e attività per i genitori", capabilities: ["Daily reports", "Photo sharing", "Milestone tracking"], isUniversal: false, accuracy: 92 },
  ],
  education: [
    { name: "Course Designer AI", emoji: "📚", desc: "Progetta programmi didattici e materiali in base agli obiettivi", capabilities: ["Curriculum design", "Material generation", "Assessment creation"], isUniversal: false, accuracy: 87 },
    { name: "Student Engagement AI", emoji: "🎓", desc: "Monitora engagement studenti e suggerisce interventi per il dropout", capabilities: ["Engagement tracking", "Dropout prediction", "Personalized nudges"], isUniversal: false, accuracy: 90 },
  ],
  events: [
    { name: "Event Planner AI", emoji: "🎉", desc: "Pianifica eventi con timeline, task e coordinamento fornitori", capabilities: ["Timeline automation", "Task assignment", "Vendor coordination"], isUniversal: false, accuracy: 91 },
    { name: "Budget Optimizer AI", emoji: "💳", desc: "Ottimizza budget evento trovando le migliori offerte per ogni voce", capabilities: ["Cost optimization", "Vendor negotiation", "Budget tracking"], isUniversal: false, accuracy: 89 },
    { name: "Guest Experience AI", emoji: "🌟", desc: "Personalizza esperienza ospiti con preferenze menu, seating e comunicazioni", capabilities: ["Guest profiling", "Seating optimization", "Menu preferences"], isUniversal: false, accuracy: 88 },
  ],
  logistics: [
    { name: "Route Planner AI", emoji: "🗺️", desc: "Ottimizza rotte di consegna per minimizzare km e tempi", capabilities: ["Multi-stop optimization", "Traffic prediction", "Delivery windows"], isUniversal: false, accuracy: 94 },
    { name: "Fleet Maintenance AI", emoji: "🔧", desc: "Manutenzione predittiva veicoli commerciali con alert proattivi", capabilities: ["Predictive maintenance", "Fuel optimization", "Cost tracking"], isUniversal: false, accuracy: 95 },
    { name: "Delivery Optimizer AI", emoji: "📦", desc: "Massimizza efficienza consegne con batching e slot intelligenti", capabilities: ["Batch optimization", "Slot management", "Priority routing"], isUniversal: false, accuracy: 92 },
  ],
  custom: [
    { name: "Universal AI Configurator", emoji: "🔧", desc: "Configura il comportamento degli agenti AI per qualsiasi caso d'uso", capabilities: ["Custom workflows", "Rule engine", "Integration builder"], isUniversal: false, accuracy: 90 },
    { name: "Custom Integration AI", emoji: "🔗", desc: "Connette i tuoi sistemi esistenti e automatizza i flussi di dati", capabilities: ["API connector", "Data sync", "Webhook management"], isUniversal: false, accuracy: 93 },
  ],
};

/**
 * Get all features for a sector (universal + sector-specific)
 */
export function getAllFeaturesForSector(sector: string): FeatureItem[] {
  return [...UNIVERSAL_FEATURES, ...(SECTOR_SPECIFIC_FEATURES[sector] || [])];
}

/**
 * Get all AI agents for a sector (universal + sector-specific)
 */
export function getAllAgentsForSector(sector: string): AIAgent[] {
  return [...UNIVERSAL_AGENTS, ...(SECTOR_SPECIFIC_AGENTS[sector] || [])];
}
