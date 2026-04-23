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

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    name: "Punta Ala Camp & Resort",
    sector: "Hospitality",
    desc: "Webapp prenotazioni, check-in digitale, concierge AI multilingua.",
    url: `${STORAGE_BASE}/bb71f11c-45ec-4f2d-85e9-52dca038c6e0/0-home-v432680.png`,
  },
  {
    name: "Studio Fisioterapia",
    sector: "Wellness",
    desc: "Agenda intelligente, reminder automatici e cartella clinica digitale.",
    url: `${STORAGE_BASE}/5d483042-6410-420c-abde-604783b77c3a/0-home-v27473.png`,
  },
  {
    name: "La Clinica del Ciclo",
    sector: "Studi Medici",
    desc: "Prenotazioni visite, telemedicina e referti consultabili in app.",
    url: `${STORAGE_BASE}/d0432585-bb6c-406c-b452-079a41477725/0-home-v789899.png`,
  },
  {
    name: "Bagno Nett",
    sector: "Beach Club",
    desc: "Mappa ombrelloni live, abbonamenti stagionali e pagamenti contactless.",
    url: `${STORAGE_BASE}/9c4a733d-9d95-47d8-9e77-24654c4dc5f9/0-home.png`,
  },
  {
    name: "Casa Negra",
    sector: "Ristorazione",
    desc: "Menu digitale, ordini al tavolo e gestione recensioni AI.",
    url: `${STORAGE_BASE}/c003bf6b-9e8c-4ab5-a418-74a202796814/0-home.png`,
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
    desc: "Schede esercizi personalizzate e follow-up post-trattamento automatizzato.",
    url: `${STORAGE_BASE}/ab3abbcf-5959-4802-83c7-ae4b1e4ae34b/0-home.png`,
  },
  {
    name: "Orinoco Gym",
    sector: "Fitness",
    desc: "Abbonamenti, classi prenotabili e check-in con QR code.",
    url: `${STORAGE_BASE}/6dcd8190-c64b-49b8-91fc-78ee0ef69929/0-home.png`,
  },
  {
    name: "Punta Ala — Booking",
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

/** 4 phones per hero stack. */
export const HERO_PHONES = [
  PORTFOLIO_ITEMS[4], // Casa Negra (center prominent)
  PORTFOLIO_ITEMS[0], // Punta Ala
  PORTFOLIO_ITEMS[7], // Orinoco
  PORTFOLIO_ITEMS[2], // Clinica Ciclo
];

/** Sector list for sticky section — paired with a hero phone screenshot. */
export const SECTOR_SHOWCASE = [
  {
    chip: "Hospitality",
    title: "Hotel & Resort",
    desc: "Prenotazioni dirette, check-in digitale e concierge AI multilingua attivo 24/7.",
    biz: "Punta Ala Camp & Resort",
    item: PORTFOLIO_ITEMS[0],
  },
  {
    chip: "Ristorazione",
    title: "Ristoranti & Pizzerie",
    desc: "Menu digitale, ordini al tavolo, prenotazioni WhatsApp e voice agent multilingua.",
    biz: "Casa Negra · Alex Ristorante",
    item: PORTFOLIO_ITEMS[4],
  },
  {
    chip: "Wellness",
    title: "Spa, Fisio & Studi Medici",
    desc: "Agenda live, reminder automatici, telemedicina e cartella clinica digitale.",
    biz: "Studio Fisioterapia · Clinica del Ciclo",
    item: PORTFOLIO_ITEMS[1],
  },
  {
    chip: "Fitness",
    title: "Palestre & Sport",
    desc: "Abbonamenti, classi prenotabili, check-in QR e contenuti video on-demand.",
    biz: "Orinoco Gym",
    item: PORTFOLIO_ITEMS[7],
  },
  {
    chip: "Beach Club",
    title: "Stabilimenti & Lidi",
    desc: "Mappa ombrelloni live, abbonamenti stagionali e pagamenti contactless.",
    biz: "Bagno Nett",
    item: PORTFOLIO_ITEMS[3],
  },
];
