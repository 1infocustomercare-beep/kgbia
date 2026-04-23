/**
 * Portfolio mockup gallery — 12 progetti reali dalle suite mockup del progetto Empire.
 * URLs puntano al bucket pubblico `media-vault` di questo Supabase project.
 */
export type PortfolioItem = {
  name: string;
  sector: string;
  url: string;
};

const STORAGE_BASE =
  "https://gypnxirzmhpapmhjguaj.supabase.co/storage/v1/object/public/media-vault/mockup-suites/d81cfdd7-3da8-463a-be3a-6e05474ba1ac";

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    name: "Punta Ala Camp & Resort",
    sector: "Hospitality",
    url: `${STORAGE_BASE}/bb71f11c-45ec-4f2d-85e9-52dca038c6e0/0-home-v432680.png`,
  },
  {
    name: "Studio Fisioterapia",
    sector: "Wellness",
    url: `${STORAGE_BASE}/5d483042-6410-420c-abde-604783b77c3a/0-home-v27473.png`,
  },
  {
    name: "La Clinica del Ciclo",
    sector: "Studi Medici",
    url: `${STORAGE_BASE}/d0432585-bb6c-406c-b452-079a41477725/0-home-v789899.png`,
  },
  {
    name: "Bagno Nett",
    sector: "Beach Club",
    url: `${STORAGE_BASE}/9c4a733d-9d95-47d8-9e77-24654c4dc5f9/0-home.png`,
  },
  {
    name: "Casa Negra",
    sector: "Ristorazione",
    url: `${STORAGE_BASE}/c003bf6b-9e8c-4ab5-a418-74a202796814/0-home.png`,
  },
  {
    name: "Alex Ristorante",
    sector: "Ristorazione",
    url: `${STORAGE_BASE}/f1ece2be-8e9c-41be-8fc3-003b4528349f/0-home.png`,
  },
  {
    name: "Studio Riabilitazione",
    sector: "Wellness",
    url: `${STORAGE_BASE}/ab3abbcf-5959-4802-83c7-ae4b1e4ae34b/0-home.png`,
  },
  {
    name: "Orinoco Gym",
    sector: "Fitness",
    url: `${STORAGE_BASE}/6dcd8190-c64b-49b8-91fc-78ee0ef69929/0-home.png`,
  },
  // Variant pages — usate come progetti differenti per arrivare a 12
  {
    name: "Punta Ala — Booking",
    sector: "Hospitality",
    url: `${STORAGE_BASE}/bb71f11c-45ec-4f2d-85e9-52dca038c6e0/2-booking-v432680.png`,
  },
  {
    name: "Casa Negra — Catalogo",
    sector: "Ristorazione",
    url: `${STORAGE_BASE}/c003bf6b-9e8c-4ab5-a418-74a202796814/1-catalog.png`,
  },
  {
    name: "Bagno Nett — Galleria",
    sector: "Beach Club",
    url: `${STORAGE_BASE}/9c4a733d-9d95-47d8-9e77-24654c4dc5f9/1-gallery.png`,
  },
  {
    name: "Alex — Prenotazioni",
    sector: "Ristorazione",
    url: `${STORAGE_BASE}/f1ece2be-8e9c-41be-8fc3-003b4528349f/2-booking.png` ,
  },
];

/** Pick 5 deterministically for the hero (4 corners + center). */
export const HERO_PHONES = [
  PORTFOLIO_ITEMS[0], // top-left
  PORTFOLIO_ITEMS[2], // top-right
  PORTFOLIO_ITEMS[4], // bottom-left
  PORTFOLIO_ITEMS[7], // bottom-right
];
