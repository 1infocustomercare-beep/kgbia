/**
 * Portfolio mockup gallery — progetti reali dalle suite mockup del progetto Empire.
 * URLs puntano al bucket pubblico `media-vault` di questo Supabase project.
 */
export type PortfolioItem = {
  name: string;
  sector: string;
  desc?: string;
  url: string;
};

const STORAGE_BASE =
  "https://gypnxirzmhpapmhjguaj.supabase.co/storage/v1/object/public/media-vault/mockup-suites/d81cfdd7-3da8-463a-be3a-6e05474ba1ac";

/** 18 mockup reali — varietà settoriale per impatto wow */
export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    name: "Punta Ala Camp & Resort",
    sector: "Hospitality",
    desc: "Webapp prenotazioni, check-in digitale, concierge AI multilingua.",
    url: `${STORAGE_BASE}/bb71f11c-45ec-4f2d-85e9-52dca038c6e0/0-home-v432680.png`,
  },
  {
    name: "Casa Negra",
    sector: "Ristorazione",
    desc: "Menu digitale, ordini al tavolo e gestione recensioni AI.",
    url: `${STORAGE_BASE}/c003bf6b-9e8c-4ab5-a418-74a202796814/0-home.png`,
  },
  {
    name: "Studio Fisioterapia",
    sector: "Wellness",
    desc: "Agenda intelligente, reminder automatici e cartella clinica digitale.",
    url: `${STORAGE_BASE}/5d483042-6410-420c-abde-604783b77c3a/0-home-v27473.png`,
  },
  {
    name: "Bagno Nett",
    sector: "Beach Club",
    desc: "Mappa ombrelloni live, abbonamenti stagionali e pagamenti contactless.",
    url: `${STORAGE_BASE}/9c4a733d-9d95-47d8-9e77-24654c4dc5f9/0-home.png`,
  },
  {
    name: "Orinoco Gym",
    sector: "Fitness",
    desc: "Abbonamenti, classi prenotabili e check-in con QR code.",
    url: `${STORAGE_BASE}/6dcd8190-c64b-49b8-91fc-78ee0ef69929/0-home.png`,
  },
  {
    name: "La Clinica del Ciclo",
    sector: "Studi Medici",
    desc: "Prenotazioni visite, telemedicina e referti consultabili in app.",
    url: `${STORAGE_BASE}/d0432585-bb6c-406c-b452-079a41477725/0-home-v789899.png`,
  },
  {
    name: "Alex Ristorante",
    sector: "Ristorazione",
    desc: "Prenotazioni tavoli WhatsApp + voice agent in 4 lingue.",
    url: `${STORAGE_BASE}/f1ece2be-8e9c-41be-8fc3-003b4528349f/0-home.png`,
  },
  {
    name: "Studio Riabilitazione",
    sector: "Wellness",
    desc: "Schede esercizi personalizzate e follow-up automatizzato.",
    url: `${STORAGE_BASE}/ab3abbcf-5959-4802-83c7-ae4b1e4ae34b/0-home.png`,
  },
  {
    name: "Punta Ala — Booking Flow",
    sector: "Hospitality",
    desc: "Flusso di prenotazione semplificato in 3 step.",
    url: `${STORAGE_BASE}/bb71f11c-45ec-4f2d-85e9-52dca038c6e0/2-booking-v432680.png`,
  },
  {
    name: "Casa Negra — Catalogo",
    sector: "Ristorazione",
    desc: "Catalogo cocktail e signature dish con foto editoriali.",
    url: `${STORAGE_BASE}/c003bf6b-9e8c-4ab5-a418-74a202796814/1-catalog.png`,
  },
  {
    name: "Bagno Nett — Galleria",
    sector: "Beach Club",
    desc: "Galleria immersiva e tour 360° dello stabilimento.",
    url: `${STORAGE_BASE}/9c4a733d-9d95-47d8-9e77-24654c4dc5f9/1-gallery.png`,
  },
  {
    name: "Alex — Prenotazioni",
    sector: "Ristorazione",
    desc: "Calendario tavoli, eventi privati e gift card digitali.",
    url: `${STORAGE_BASE}/f1ece2be-8e9c-41be-8fc3-003b4528349f/2-booking.png`,
  },
];

/** Fallback per HERO - 5 phones nel coverflow centrale */
export const HERO_PHONES = [
  PORTFOLIO_ITEMS[1], // Casa Negra (centro)
  PORTFOLIO_ITEMS[0], // Punta Ala
  PORTFOLIO_ITEMS[3], // Bagno Nett
  PORTFOLIO_ITEMS[4], // Orinoco
  PORTFOLIO_ITEMS[2], // Fisio
];

/** Sector showcase con problema/soluzione/automazioni — copy persuasivo */
export type SectorShowcase = {
  chip: string;
  title: string;
  problem: string;
  solution: string;
  automations: string[];
  biz: string;
  item: PortfolioItem;
  accent: string;
};

export const SECTOR_SHOWCASE: SectorShowcase[] = [
  {
    chip: "Ristorazione",
    title: "Ristoranti, Pizzerie & Sushi",
    problem:
      "Telefono che squilla a vuoto durante il servizio. Prenotazioni perse, ordini sbagliati, recensioni che non arrivano.",
    solution:
      "Voice Agent IT/EN/FR/ES che risponde in 0,8s, prende prenotazioni e ordini, sincronizza con il tuo gestionale e chiama i clienti per la recensione 24h dopo.",
    automations: [
      "Prenotazioni tavoli WhatsApp + AI 24/7",
      "Menu digitale + QR ordering al tavolo",
      "Voice agent multilingua per il delivery",
      "Recensioni automatizzate Google/TripAdvisor",
      "Alert real-time scorte basse e top seller",
    ],
    biz: "Casa Negra · Alex Ristorante",
    item: PORTFOLIO_ITEMS[1],
    accent: "#E48A4D",
  },
  {
    chip: "Hospitality",
    title: "Hotel, Resort & B&B",
    problem:
      "OTA che si prendono il 25% di commissione. Check-in lenti, concierge sopraffatto, upsell sprecati.",
    solution:
      "Booking diretto sul tuo brand, check-in 100% digitale, concierge AI che risponde in chat in 30+ lingue e fa upsell intelligente su escursioni, spa, ristorante.",
    automations: [
      "Booking engine diretto (-25% commissioni OTA)",
      "Check-in / check-out 100% digitale",
      "Concierge AI multilingua in chat",
      "Upsell automatico (spa, ristorante, transfer)",
      "Sondaggi post-soggiorno → review automatica",
    ],
    biz: "Punta Ala Camp & Resort",
    item: PORTFOLIO_ITEMS[0],
    accent: "#7EB7BE",
  },
  {
    chip: "Wellness & Beauty",
    title: "Spa, Fisio & Centri Estetici",
    problem:
      "Agende che si scontrano, no-show del 18%, clienti che non tornano. Ore al telefono per fissare appuntamenti.",
    solution:
      "Agenda live multi-operatore, reminder WhatsApp che azzerano i no-show, riprenotazioni automatiche e card fidelity gestita dall'AI.",
    automations: [
      "Agenda live multi-operatore + slot intelligenti",
      "Reminder WhatsApp 24h e 2h prima",
      "Riprenotazione automatica a fine ciclo",
      "Cartella clinica/estetica digitale GDPR",
      "Programma fedeltà con punti automatici",
    ],
    biz: "Studio Fisioterapia · Studio Riabilitazione",
    item: PORTFOLIO_ITEMS[2],
    accent: "#D89BB8",
  },
  {
    chip: "Studi Medici",
    title: "Cliniche, Dentisti & Poliambulatori",
    problem:
      "Segretaria sopraffatta, file di chiamate non risposte, pazienti che non si presentano alle visite.",
    solution:
      "Centralino AI che gestisce chiamate, prenota visite, invia preparazione esami e referti. Telemedicina integrata e cartella clinica digitale GDPR.",
    automations: [
      "Centralino AI per visite e referti",
      "Telemedicina integrata + ricette digitali",
      "Reminder farmaci e controlli periodici",
      "Triage AI che prioritizza le urgenze",
      "Cartella clinica digitale conforme GDPR",
    ],
    biz: "La Clinica del Ciclo",
    item: PORTFOLIO_ITEMS[5],
    accent: "#6EA8E0",
  },
  {
    chip: "Fitness & Sport",
    title: "Palestre, Pilates & Padel",
    problem:
      "Iscritti che mollano dopo 3 mesi. Classi a metà piene. Comunicazione caotica via gruppo WhatsApp.",
    solution:
      "App brandizzata con prenotazione classi, check-in QR, programmi personalizzati AI e gamification che tiene gli iscritti attivi e fidelizzati.",
    automations: [
      "Prenotazione classi + lista d'attesa intelligente",
      "Check-in QR + tracking presenze automatico",
      "Programmi personalizzati AI per ogni socio",
      "Gamification e sfide tra iscritti",
      "Recupero proattivo di chi non viene da 14gg",
    ],
    biz: "Orinoco Gym",
    item: PORTFOLIO_ITEMS[4],
    accent: "#5DE0C8",
  },
  {
    chip: "Beach Club",
    title: "Stabilimenti, Lidi & Beach Club",
    problem:
      "Code in cassa, ombrelloni venduti due volte, abbonamenti gestiti su Excel, incassi opachi.",
    solution:
      "Mappa ombrelloni live, prenotazione e pagamento app, abbonamenti stagionali digitali, ordini food&beverage al lettino con consegna.",
    automations: [
      "Mappa ombrelloni live + prenotazione app",
      "Abbonamenti stagionali digitali",
      "Ordini F&B al lettino con consegna",
      "Pagamenti contactless e dashboard incassi",
      "Meteo + previsioni affluenza AI",
    ],
    biz: "Bagno Nett",
    item: PORTFOLIO_ITEMS[3],
    accent: "#F2B138",
  },
];

/** 4 agenti AI per sezione "How it works" */
export type AgentInfo = {
  num: string;
  name: string;
  role: string;
  desc: string;
  metric: string;
  accent: string;
};

export const AGENTS: AgentInfo[] = [
  {
    num: "01",
    name: "Voice Agent",
    role: "Risponde a tutte le chiamate",
    desc: "Risponde al telefono 24/7 in italiano, inglese, francese e spagnolo. Prende prenotazioni, gestisce ordini, chiude vendite. Distinguibile da un umano solo nel 6% dei casi.",
    metric: "0,8s tempo medio risposta",
    accent: "#E6C98A",
  },
  {
    num: "02",
    name: "Sales Agent",
    role: "Qualifica e converte ogni lead",
    desc: "Segue ogni lead da sito, social, WhatsApp, email. Qualifica budget e urgenza, fissa la call solo con chi ha intenzione reale di comprare. Chiude 3× più di un commerciale medio.",
    metric: "+48% fatturato extra",
    accent: "#7EB7BE",
  },
  {
    num: "03",
    name: "Booking Agent",
    role: "Gestisce prenotazioni e calendar",
    desc: "Sincronizza il tuo gestionale, gestisce disdette, overbooking e no-show. Invia reminder automatici WhatsApp e SMS. Integrato con TheFork, Booking, Stripe, Treatwell.",
    metric: "−82% no-show",
    accent: "#5DE0C8",
  },
  {
    num: "04",
    name: "Review Agent",
    role: "Costruisce la tua reputazione",
    desc: "Chiede la recensione al cliente giusto nel momento giusto. Google, TripAdvisor, Trustpilot. Porta il tuo rating medio da 4.1 a 4.8 in 90 giorni. Risponde anche alle review negative.",
    metric: "+0,7 rating Google",
    accent: "#C9A24B",
  },
];
