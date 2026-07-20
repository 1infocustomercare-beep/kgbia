/**
 * Unified sector → variants registry for the premium mockup showcase.
 *
 * Each sector groups every real AI-generated PNG we have as a "variant"
 * with human-readable metadata (style name, palette, focus features).
 * Consumed by MockupCatalog (/portfolio), PrestigePortfolio (home) and
 * the MockupLightbox fullscreen viewer.
 *
 * ADDITIVE: does not remove or alter the legacy registries. Existing
 * screens keep working; new UI reads from here.
 */

// Existing PNG assets — reused, not duplicated.
import foodOnyxObsidian from "@/assets/mockups/catalog/food-onyx-obsidian.png";
import foodOnyxIvory from "@/assets/mockups/catalog/food-onyx-ivory.png";
import foodSakuraSakura from "@/assets/mockups/catalog/food-sakura-sakura.png";
import foodSakuraLuxuryDark from "@/assets/mockups/catalog/food-sakura-luxury-dark.png";
import foodIndocinaNeonSpice from "@/assets/mockups/catalog/food-indocina-neon-spice.png";
import foodPacificoCosta from "@/assets/mockups/catalog/food-pacifico-costa.png";
import foodLevanteDeli from "@/assets/mockups/catalog/food-levante-deli.png";
import foodBraceKebab from "@/assets/mockups/catalog/food-brace-kebab.png";
import beautyAuroraLavender from "@/assets/mockups/catalog/beauty-aurora-lavender.png";
import beautyAuroraBlushRosegold from "@/assets/mockups/catalog/beauty-aurora-blush-rosegold.png";
import beautyVellutoEditorial from "@/assets/mockups/catalog/beauty-velluto-editorial.png";
import nccMarinaRiviera from "@/assets/mockups/catalog/ncc-marina-riviera.png";
import nccMarinaAmalfiStyleB from "@/assets/mockups/catalog/ncc-marina-amalfi-style-b.png";
import fitnessPadelSage from "@/assets/mockups/catalog/fitness-padel-sage.png";
import fitnessOndaAqua from "@/assets/mockups/catalog/fitness-onda-aqua.png";
import hospitalityCalaVentoAzure from "@/assets/mockups/catalog/hospitality-cala-vento-azure.png";
import hospitalityCalaVentoSunset from "@/assets/mockups/catalog/hospitality-cala-vento-sunset.png";
import healthcareLumenGlass from "@/assets/mockups/catalog/healthcare-lumen-glass.png";
import veterinaryTropicoResort from "@/assets/mockups/catalog/veterinary-tropico-resort.png";
import childcareArcobalenoBauhaus from "@/assets/mockups/catalog/childcare-arcobaleno-bauhaus.png";
import childcareStellePlayful from "@/assets/mockups/catalog/childcare-stelle-playful.png";
import constructionDomusOceanAzure from "@/assets/mockups/catalog/construction-domus-ocean-azure.png";
import constructionDomusLivingCoral from "@/assets/mockups/catalog/construction-domus-living-coral.png";
import constructionDomusIceBlue from "@/assets/mockups/catalog/construction-domus-ice-blue.png";
import constructionDomusRoseGold from "@/assets/mockups/catalog/construction-domus-rose-gold.png";
import plumberIdroProntoStyleA from "@/assets/mockups/catalog/plumber-idro-pronto-style-a.png";
import plumberIdroProntoStyleB from "@/assets/mockups/catalog/plumber-idro-pronto-style-b.png";

export type SectorMockupVariant = {
  id: string;
  brand: string;
  style: string;
  /** Short palette label shown as a chip */
  palette: string;
  /** 1-line description of what this style shows */
  description: string;
  /** UI features highlighted for this variant */
  features: string[];
  /** iPhone screen image (webapp mockup) */
  screen: string;
};

export type SectorMockupGroup = {
  id: string;
  label: string;
  /** 1-line sector summary */
  tagline: string;
  variants: SectorMockupVariant[];
};

const V = (
  id: string,
  brand: string,
  style: string,
  palette: string,
  description: string,
  features: string[],
  screen: string,
): SectorMockupVariant => ({ id, brand, style, palette, description, features, screen });

export const SECTOR_MOCKUPS: SectorMockupGroup[] = [
  {
    id: "food",
    label: "Ristorazione",
    tagline: "Menu digitale, ordini live, prenotazioni, KDS cucina e pagamenti.",
    variants: [
      V("food-onyx-obsidian", "Onyx Brace Steakhouse", "Obsidian Luxury", "Onice · Oro",
        "Steakhouse premium con carta vini, prenotazione tavoli e degustazione signature.",
        ["Menu tagli premium", "Wine pairing", "Tavoli & turni", "Upsell degustazione"],
        foodOnyxObsidian),
      V("food-onyx-ivory", "Bistrot Avorio", "Ivory Editorial", "Avorio · Nero",
        "Bistrot editoriale con menu del giorno, prenotazioni e loyalty pulita.",
        ["Menu del giorno", "Prenotazioni", "Loyalty ospiti", "Delivery brand"],
        foodOnyxIvory),
      V("food-sakura-luxury-dark", "Sakura Omakase", "Sakura Luxury Dark", "Nero · Sakura",
        "Sushi omakase con menu degustazione, sake pairing e prenotazione a turni.",
        ["Omakase card", "Sake pairing", "Turni serali", "Chef's counter"],
        foodSakuraLuxuryDark),
      V("food-sakura-sakura", "Paperfish Sakura", "Sakura Light", "Rosa · Kraft",
        "Sushi contemporaneo con menu visuale, ordini rapidi e take-away.",
        ["Menu visuale", "Ordine rapido", "Take-away", "Fidelity roll"],
        foodSakuraSakura),
      V("food-indocina-neon", "Indocina Noir", "Neon Spice", "Neon · Giada",
        "Asian fusion notturno con cocktail pairing, booking serale e allergeni.",
        ["Cocktail pairing", "Booking serale", "Allergeni", "Dark mode UI"],
        foodIndocinaNeonSpice),
      V("food-pacifico-costa", "Pacifico Ceviche", "Costa Pacifico", "Blu · Corallo",
        "Seafood costiero: crudi, daily catch, tavoli vista mare, cocktail beach.",
        ["Daily catch", "Crudi & ceviche", "Tavoli vista mare", "Beach cocktail"],
        foodPacificoCosta),
      V("food-levante-deli", "Levante Deli", "Pearl Gold", "Perla · Oro",
        "Delicatessen mediterraneo con vetrina prodotti, box regalo e ordini pickup.",
        ["Vetrina prodotti", "Box regalo", "Pickup deli", "Ricette firmate"],
        foodLevanteDeli),
      V("food-brace-kebab", "Brace Kebab", "Urban Grill", "Rame · Fumo",
        "Grill urbano: combo, delivery, zone consegna e offerte pranzo veloci.",
        ["Combo grill", "Delivery zones", "Offerte pranzo", "Ordine 1-tap"],
        foodBraceKebab),
    ],
  },
  {
    id: "beauty",
    label: "Beauty & Salone",
    tagline: "Agenda, trattamenti, schede cliente, pacchetti VIP e rebooking.",
    variants: [
      V("beauty-aurora-lavender", "Atelier Unghie", "Lavender Luxe", "Lavanda · Oro",
        "Nail atelier soft luxury con menu trattamenti, cabine e schede cliente VIP.",
        ["Menu nail", "Cabine live", "Scheda VIP", "Rebooking auto"],
        beautyAuroraLavender),
      V("beauty-aurora-blush", "Aurora Nail", "Blush Rosegold", "Blush · Oro rosa",
        "Nail luxury con pacchetti sposa, add-on premium e loyalty punti.",
        ["Pacchetti sposa", "Add-on premium", "Loyalty punti", "Gallery lavori"],
        beautyAuroraBlushRosegold),
      V("beauty-velluto-editorial", "Velluto Hair Lab", "Editorial Hair", "Nero · Bordeaux",
        "Hair salon editoriale: colore, agenda stylist, retail prodotti, look book.",
        ["Servizi colore", "Agenda stylist", "Retail prodotti", "Look book"],
        beautyVellutoEditorial),
    ],
  },
  {
    id: "ncc",
    label: "NCC · Charter · Yacht",
    tagline: "Flotta, preventivi rapidi, itinerari, booking e concierge.",
    variants: [
      V("ncc-marina-riviera", "Marina Riviera", "Riviera Blue", "Blu · Bianco",
        "NCC costiero con flotta, itinerari mappati, preventivo istantaneo.",
        ["Flotta live", "Itinerari mappa", "Preventivo istante", "Concierge chat"],
        nccMarinaRiviera),
      V("ncc-marina-amalfi", "Marina Amalfi", "Amalfi Sunset", "Ambra · Bianco",
        "Charter luxury Amalfi: tour privati, chef a bordo, sunset experience.",
        ["Tour privati", "Chef a bordo", "Sunset packages", "Booking flessibile"],
        nccMarinaAmalfiStyleB),
      V("ncc-cala-azure", "Cala Vento Charter", "Emerald Cove", "Smeraldo · Sabbia",
        "Yacht charter Sardegna con calette, day cruise, transfer VIP porto.",
        ["Calette curate", "Day cruise", "Transfer VIP", "Skipper included"],
        hospitalityCalaVentoAzure),
      V("ncc-cala-sunset", "Cala Vento Golden", "Golden Sunset", "Oro · Corallo",
        "Yacht sunset experience: aperitivo a bordo, tramonti, pacchetti coppia.",
        ["Aperitivo bordo", "Tramonti curati", "Pacchetti coppia", "Foto pro"],
        hospitalityCalaVentoSunset),
    ],
  },
  {
    id: "hospitality",
    label: "Hotel & Hospitality",
    tagline: "Camere, esperienze, concierge, upsell escursioni e prenotazioni.",
    variants: [
      V("hosp-cala-azure", "Cala Vento Resort", "Sardinia Azure", "Azzurro · Sabbia",
        "Boutique resort: camere, esperienze curate, concierge chat, upsell tour.",
        ["Camere & suite", "Esperienze curate", "Concierge chat", "Upsell tour"],
        hospitalityCalaVentoAzure),
      V("hosp-cala-sunset", "Cala Vento Suite", "Sunset Suite", "Oro · Ambra",
        "Suite sunset: pacchetti romantic, spa in camera, cena privata a bordo mare.",
        ["Pacchetti romantic", "Spa in camera", "Cena privata", "Sunset ritual"],
        hospitalityCalaVentoSunset),
    ],
  },
  {
    id: "fitness",
    label: "Fitness · Padel · Sport",
    tagline: "Corsi, prenotazioni campi, abbonamenti, coach e schede attività.",
    variants: [
      V("fit-padel-sage", "Centro Padel Brera", "Sage Luxe", "Salvia · Oro",
        "Padel club premium: prenotazione campi, tornei, coach privati, ranking.",
        ["Prenotazione campi", "Tornei live", "Coach privati", "Ranking club"],
        fitnessPadelSage),
      V("fit-onda-aqua", "Onda Sport Club", "Fresh Azzurro", "Azzurro · Bianco",
        "Palestra multi-sport con classi, abbonamenti, schede coach e progressi.",
        ["Classi settimana", "Abbonamenti", "Schede coach", "Progressi live"],
        fitnessOndaAqua),
    ],
  },
  {
    id: "healthcare",
    label: "Studi medici & Cliniche",
    tagline: "Agenda visite, prestazioni, cartella paziente e pagamenti.",
    variants: [
      V("health-lumen", "Lumen Clinic", "Ethereal Glass", "Ghiaccio · Blu",
        "Poliambulatorio pulito: prestazioni, prenotazione visite, cartella paziente.",
        ["Prestazioni", "Prenota visita", "Cartella paziente", "Pagamenti online"],
        healthcareLumenGlass),
    ],
  },
  {
    id: "veterinary",
    label: "Veterinaria & Pet",
    tagline: "Servizi pet, prenotazioni, profili animali e pet resort.",
    variants: [
      V("vet-tropico", "Tropico Pet Resort", "Tropico Resort", "Verde · Corallo",
        "Pet resort completo: pensione, servizi cliniche, profili pet, foto giornaliere.",
        ["Pensione booking", "Servizi clinica", "Profilo pet", "Foto giornata"],
        veterinaryTropicoResort),
    ],
  },
  {
    id: "childcare",
    label: "Nido & Nursery",
    tagline: "Iscrizioni, attività, pasti, team e comunicazioni famiglie.",
    variants: [
      V("child-stelle", "Piccole Stelle Nursery", "Playful Colorful", "Corallo · Ocra",
        "Nursery giocosa: programmi settimanali, pasti, foto giornata, chat genitori.",
        ["Programma settimana", "Menu pasti", "Foto giornata", "Chat genitori"],
        childcareStellePlayful),
      V("child-arcobaleno", "Arcobaleno Playhouse", "Bauhaus Play", "Primari · Bianco",
        "Playhouse Bauhaus: attività, iscrizioni online, calendario, team educatori.",
        ["Attività settimana", "Iscrizioni online", "Calendario", "Team educatori"],
        childcareArcobalenoBauhaus),
    ],
  },
  {
    id: "construction",
    label: "Edilizia & Real Estate",
    tagline: "Cantieri, unità, manutenzioni, community e dashboard operativa.",
    variants: [
      V("cons-ocean", "Domus Living", "Ocean Azure", "Blu · Bianco",
        "Real estate luxury: unità, tour 3D, prenota visita, dashboard cantieri.",
        ["Unità disponibili", "Tour 3D", "Prenota visita", "Dashboard cantieri"],
        constructionDomusOceanAzure),
      V("cons-coral", "Domus Living Coral", "Living Coral", "Corallo · Sabbia",
        "Community residenti: manutenzioni, servizi condominio, prenota amenità.",
        ["Manutenzioni", "Servizi condominio", "Prenota amenità", "Bacheca residenti"],
        constructionDomusLivingCoral),
      V("cons-ice", "Domus Ice", "Ice Blue", "Ghiaccio · Bianco",
        "Facility manager: ticket, calendario interventi, mezzi e squadre live.",
        ["Ticket sistem", "Calendario interventi", "Mezzi & squadre", "Report cliente"],
        constructionDomusIceBlue),
      V("cons-rose", "Domus Rose Gold", "Rose Gold", "Rosa · Oro",
        "Sales office real estate: lead in ingresso, scheda unità, offerte, follow-up.",
        ["Lead ingresso", "Scheda unità", "Offerte", "Follow-up auto"],
        constructionDomusRoseGold),
    ],
  },
  {
    id: "plumber",
    label: "Artigiani & Servizi tecnici",
    tagline: "Interventi urgenti, preventivi rapidi, agenda squadre.",
    variants: [
      V("plumber-a", "Idro Pronto", "Rescue Blue", "Blu · Bianco",
        "Idraulica pronto intervento: chiamata rapida, preventivo, geolocalizzazione.",
        ["Chiamata rapida", "Preventivo", "Geolocalizzazione", "Storico interventi"],
        plumberIdroProntoStyleA),
      V("plumber-b", "Idro Pronto Pro", "Bold Orange", "Arancio · Nero",
        "Squadra tecnica: agenda interventi, foto pre/post, firma cliente, fatturazione.",
        ["Agenda squadra", "Foto pre/post", "Firma cliente", "Fatturazione"],
        plumberIdroProntoStyleB),
    ],
  },
];

/** Lookup a sector group by id. */
export function getSectorGroup(id: string): SectorMockupGroup | undefined {
  return SECTOR_MOCKUPS.find((g) => g.id === id);
}

/** Flat list of all variants across sectors — useful for portfolio grids. */
export function allMockupVariants(): (SectorMockupVariant & { sectorId: string; sectorLabel: string })[] {
  return SECTOR_MOCKUPS.flatMap((g) =>
    g.variants.map((v) => ({ ...v, sectorId: g.id, sectorLabel: g.label })),
  );
}
