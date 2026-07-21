/**
 * Unified sector → variants registry for the premium mockup showcase.
 *
 * Each variant now exposes a full COHERENT SCREEN SEQUENCE
 * (Home → Menu → Dettaglio → Prenotazione) built from the AI-generated
 * companion PNGs that share the hero's palette/typography.
 *
 * ADDITIVE: does not remove or alter the legacy registries.
 */

// Hero PNGs (screen 1 — Home)
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
import beautyNailLavenderV2 from "@/assets/mockups/catalog/beauty-nail-lavender-v2--1-home.png";
import beautyHairNoir from "@/assets/mockups/catalog/beauty-hair-noir--1-home.png";
import beautyBarberIndustrial from "@/assets/mockups/catalog/beauty-barber-industrial--1-home.png";
import beautyMedspaClinical from "@/assets/mockups/catalog/beauty-medspa-clinical--1-home.png";
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

// Companion PNGs — auto-loaded by Vite glob. Filenames follow
//   <hero-stem>--2-menu.png / --3-detail.png / --4-booking.png
const companionFiles = import.meta.glob(
  "@/assets/mockups/catalog/companions/*.png",
  { eager: true, import: "default" },
) as Record<string, string>;

const portfolioLowengeldFiles = import.meta.glob(
  "@/assets/mockups/portfolio-lowengeld/**/*.png",
  { eager: true, import: "default" },
) as Record<string, string>;

const companionByStem = new Map<string, { menu?: string; detail?: string; booking?: string }>();
for (const [path, url] of Object.entries(companionFiles)) {
  const file = path.split("/").pop() ?? "";
  const m = file.match(/^(.+?)--(\d+)-(menu|detail|booking)\.png$/);
  if (!m) continue;
  const [, stem, , kind] = m;
  const bucket = companionByStem.get(stem) ?? {};
  (bucket as Record<string, string>)[kind] = url;
  companionByStem.set(stem, bucket);
}

const portfolioImage = (slug: string, file: string): string => {
  const suffix = `/portfolio-lowengeld/${slug}/${file}`;
  for (const [key, url] of Object.entries(portfolioLowengeldFiles)) {
    if (key.endsWith(suffix)) return url;
  }
  // Non-fatal: log and return a transparent placeholder so the whole page still renders.
  if (typeof console !== "undefined") {
    console.warn(`[sector-mockups] Missing portfolio mockup: ${suffix}`);
  }
  return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'/>";
};


export type MockupScreen = {
  /** Short label shown under the phone (e.g. "Home", "Menu") */
  label: string;
  /** Longer caption for the info panel */
  caption: string;
  /** Full-size PNG rendered inside the iPhone frame */
  image: string;
};

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
  /** Primary hero screen (used for cards) */
  screen: string;
  /** Coherent ordered sequence of screens: Home → Menu → Dettaglio → Prenotazione */
  screens: MockupScreen[];
  /** Asset source quality/origin used to keep old catalog screens out of the main homepage. */
  source: "studio" | "reference" | "catalog";
  /**
   * Quality tier.
   * - "primary"  = curated 4-screen sequence from portfolio-lowengeld/<slug>/
   *                (folder-based, well-crafted texts/icons/photos)
   * - "extended" = AI companion-based catalog variant, shown as
   *                secondary / "extended collection" below the primary set.
   */
  tier: "primary" | "extended";
};


export type SectorMockupGroup = {
  id: string;
  label: string;
  /** 1-line sector summary */
  tagline: string;
  variants: SectorMockupVariant[];
};

/**
 * Sector-specific labels for the 4-screen sequence.
 * Screen 1 is always the hero (Home).
 */
const SECTOR_SCREEN_LABELS: Record<
  string,
  [string, string, string, string]
> = {
  food: ["Vetrina", "Menu", "Piatto signature", "Prenota tavolo"],
  beauty: ["Salone", "Listino trattamenti", "Scheda cliente VIP", "Agenda stylist"],
  ncc: ["Fleet showcase", "Flotta & tariffe", "Itinerario su mappa", "Preventivo & checkout"],
  hospitality: ["Resort", "Camere & suite", "Esperienza curata", "Booking multi-notte"],
  fitness: ["Club", "Palinsesto corsi", "Coach & campi", "Prenota lezione"],
  healthcare: ["Clinica", "Prestazioni & ticket", "Specialista", "Prenota visita"],
  veterinary: ["Pet resort", "Servizi pet", "Profilo animale", "Prenota soggiorno"],
  childcare: ["Nido", "Programma giornata", "Attività & foto", "Iscrizione online"],
  construction: ["Progetto", "Unità disponibili", "Tour 3D & capitolato", "Prenota visita"],
  plumber: ["Pronto intervento", "Servizi & tariffe", "Scheda intervento", "Chiama ora"],
  retail: ["Vetrina", "Catalogo", "Scheda prodotto", "Checkout"],
};

const CAPTIONS: Record<string, [string, string, string, string]> = {
  food: [
    "Homepage brand con hero piatto, USP chef e CTA prenota istantanea.",
    "Menu digitale completo: categorie, allergeni, foto piatti, filtri dieta.",
    "Scheda piatto signature con ingredienti, storia chef e upsell wine pairing.",
    "Prenotazione tavolo con turni serali, ospiti, note allergie e conferma auto.",
  ],
  beauty: [
    "Salone hero con brand story, pacchetti VIP e cabina virtuale in evidenza.",
    "Listino trattamenti per cabina, durata, prezzo, add-on premium.",
    "Scheda cliente VIP: storico servizi, foto before/after, preferenze prodotto.",
    "Agenda stylist per cabina con slot live, rebooking automatico e reminder.",
  ],
  ncc: [
    "Homepage fleet con hero costiero, brand luxury e preventivo one-tap.",
    "Flotta completa: auto/yacht/van con capienza, servizi bordo e tariffe orarie.",
    "Itinerario su mappa con tappe curate, orari, foto luoghi e servizi extra.",
    "Preventivo → checkout: acconto, concierge chat e conferma autista dedicato.",
  ],
  hospitality: [
    "Homepage resort con hero location, stagione attiva e best-price live.",
    "Camere e suite con foto pro, amenities, disponibilità calendar e prezzi dinamici.",
    "Esperienza curata: spa journey, tour privati, chef in villa, upsell romantic.",
    "Booking multi-notte con extra, upgrade suite e checkout con cauzione.",
  ],
  fitness: [
    "Homepage club con hero atleta, prossimi eventi e trial senza impegno.",
    "Palinsesto corsi settimanale con coach, livello, posti disponibili live.",
    "Scheda coach & campo: bio, specialità, rating e prime disponibilità.",
    "Prenotazione campo/lezione con ricorrenze, waitlist e reminder push.",
  ],
  healthcare: [
    "Homepage clinica con specialità, medici in evidenza e prenota rapido.",
    "Prestazioni per branca con tempi d'attesa, ticket e convenzioni.",
    "Scheda specialista: bio, ambulatorio, prime date, pareri pazienti.",
    "Prenota visita → pagamento online, promemoria SMS e cartella digitale.",
  ],
  veterinary: [
    "Homepage pet resort con hero animali, servizi e clinica veterinaria interna.",
    "Servizi pet: pensione, tolettatura, addestramento, day-care con foto.",
    "Profilo pet completo: vaccini, terapie, foto giornata e note staff.",
    "Prenota soggiorno o visita con calendario dedicato e retiro concordato.",
  ],
  childcare: [
    "Homepage nido con hero bambini, valori educativi e open-day prenotabile.",
    "Programma giornata: routine, laboratori, pasti e riposo per fascia.",
    "Attività del giorno con foto, note educatori e chat privata famiglia.",
    "Iscrizione online: documenti, calendario, retta ricorrente e ricevuta.",
  ],
  construction: [
    "Homepage sviluppatore con hero rendering, brand progetto e stato lavori.",
    "Elenco unità con planimetria, metratura, prezzo, stato (libera/opzionata).",
    "Dettaglio unità: tour 3D, capitolato, finiture, agenti dedicati e chat.",
    "Prenota visita in cantiere con calendario agente e follow-up automatico.",
  ],
  plumber: [
    "Homepage pronto intervento 24/7 con numero one-tap e zone servite.",
    "Servizi: idraulica, caldaie, climatizzazione, gas con tariffe trasparenti.",
    "Scheda intervento: foto pre/post, materiali usati, firma cliente in app.",
    "Chiamata rapida con geolocalizzazione, ETA squadra live e pagamento.",
  ],
  retail: [
    "Vetrina brand con hero collezione, storytelling e drop del momento.",
    "Catalogo prodotti con filtri smart, categorie curate e wishlist.",
    "Scheda prodotto premium: gallery, misure, materiali, cross-sell.",
    "Checkout snello con indirizzi salvati, pagamenti e ritiro in boutique.",
  ],
};

const buildScreens = (
  sectorId: string,
  heroImage: string,
  heroStem: string,
): MockupScreen[] => {
  const labels = SECTOR_SCREEN_LABELS[sectorId] ?? ["Home", "Menu", "Dettaglio", "Prenotazione"];
  const captions = CAPTIONS[sectorId] ?? labels;
  const comp = companionByStem.get(heroStem) ?? {};
  const seq: (string | undefined)[] = [heroImage, comp.menu, comp.detail, comp.booking];
  return seq
    .map((img, i) => (img ? { label: labels[i], caption: captions[i], image: img } : null))
    .filter((s): s is MockupScreen => s !== null);
};

const buildManualScreens = (
  sectorId: string,
  entries: Array<{ file: string; label?: string; caption?: string }>,
  slug: string,
): MockupScreen[] => {
  const labels = SECTOR_SCREEN_LABELS[sectorId] ?? ["Home", "Menu", "Dettaglio", "Prenotazione"];
  const captions = CAPTIONS[sectorId] ?? labels;
  return entries.map((entry, index) => ({
    label: entry.label ?? labels[index] ?? `Screen ${index + 1}`,
    caption: entry.caption ?? captions[index] ?? labels[index] ?? `Screen ${index + 1}`,
    image: portfolioImage(slug, entry.file),
  }));
};

const V = (
  sectorId: string,
  id: string,
  brand: string,
  style: string,
  palette: string,
  description: string,
  features: string[],
  screen: string,
  heroStem: string,
): SectorMockupVariant => ({
  id,
  brand,
  style,
  palette,
  description,
  features,
  screen,
  screens: buildScreens(sectorId, screen, heroStem),
  source: "catalog",
  tier: "extended",
});


const VManual = (
  sectorId: string,
  id: string,
  brand: string,
  style: string,
  palette: string,
  description: string,
  features: string[],
  slug: string,
  entries: Array<{ file: string; label?: string; caption?: string }>,
): SectorMockupVariant => ({
  id,
  brand,
  style,
  palette,
  description,
  features,
  screen: portfolioImage(slug, entries[0].file),
  screens: buildManualScreens(sectorId, entries, slug),
  source: "studio",
  tier: "primary",
});


export const SECTOR_MOCKUPS: SectorMockupGroup[] = [
  {
    id: "food",
    label: "Ristorazione",
    tagline: "Menu digitale, ordini live, prenotazioni, KDS cucina e pagamenti.",
    variants: [
      VManual("food", "food-brace-reale", "Brace Reale", "Urban Grill Signature", "Corallo · Crema",
        "Kebab premium con scheda prodotto completa, extra smart e checkout delivery ad alta conversione.",
        ["Scheda prodotto", "Extra dinamici", "Valori nutrizionali", "Checkout delivery"],
        "brace-reale",
        [
          { file: "1-home.png", label: "Vetrina" },
          { file: "2-menu.png", label: "Menu" },
          { file: "3-detail.png", label: "Dettaglio kebab" },
          { file: "4-checkout.png", label: "Checkout" },
        ]),
      VManual("food", "food-ryo-sushi", "Ryō Sushi Bar", "Midnight Omakase", "Navy · Oro",
        "Sushi omakase ultra-premium con prenotazione al banco, pairing e deposito elegante.",
        ["Omakase experience", "Sake pairing", "Chef counter", "Deposito prenotazione"],
        "ryo-sushi",
        [
          { file: "1-home.png", label: "Vetrina" },
          { file: "2-menu.png", label: "Menu degustazione" },
          { file: "3-detail.png", label: "Piatto signature" },
          { file: "4-booking.png", label: "Prenota esperienza" },
        ]),
      VManual("food", "food-sakura-atelier", "Sakura Atelier", "Blush Editorial", "Blush · Avorio",
        "Omakase poetico editoriale con percorso degustazione, storytelling stagionale e booking raffinato.",
        ["Menu poetico", "Esperienza degustazione", "Iconografia floreale", "Booking elegante"],
        "sakura-atelier",
        [
          { file: "1-home.png", label: "Vetrina" },
          { file: "2-menu.png", label: "Percorso" },
          { file: "3-detail.png", label: "Esperienza Hanami" },
          { file: "4-booking.png", label: "Prenota tavolo" },
        ]),
      VManual("food", "food-onyx-brace", "Onyx Brace Milano", "Obsidian Steakhouse", "Onice · Champagne",
        "Steakhouse dark luxury con tagli A5, wine pairing e prenotazione tavolo immersiva.",
        ["Tagli A5", "Wine pairing", "Private dining", "Menu degustazione"],
        "onyx-brace",
        [
          { file: "1-home.png", label: "Vetrina" },
          { file: "2-menu.png", label: "Carta premium" },
          { file: "3-detail.png", label: "Taglio signature" },
          { file: "4-booking.png", label: "Prenota tavolo" },
        ]),
      VManual("food", "food-pacifico-ceviche-lowengeld", "Pacifico Ceviche", "Beach Club Tropical", "Turchese · Corallo",
        "Cevicheria costiera con ordine in spiaggia, spice selector e checkout geolocalizzato.",
        ["Beach delivery", "Spice selector", "Freshness proof", "Checkout spiaggia"],
        "pacifico-ceviche",
        [
          { file: "1-home.png", label: "Vetrina" },
          { file: "2-menu.png", label: "Beach menu" },
          { file: "3-detail.png", label: "Dettaglio crudo" },
          { file: "4-checkout.png", label: "Checkout spiaggia" },
        ]),
      VManual("food", "food-basilico-reale", "Basilico Reale", "Gourmet Verde", "Verde bosco · Terracotta",
        "Pizzeria gourmet con impasti selezionabili, wine pairing e prenotazione dine-in/takeaway.",
        ["Impasti multipli", "Extra premium", "Wine pairing", "Prenotazione ibrida"],
        "basilico-reale",
        [
          { file: "1-home.png", label: "Vetrina" },
          { file: "2-menu.png", label: "Menu pizze" },
          { file: "3-detail.png", label: "Pizza signature" },
          { file: "4-booking.png", label: "Prenota tavolo" },
        ]),
      VManual("food", "food-napoli-slice", "Napoli Slice", "Delivery Napoletano", "Terracotta · Crema",
        "Pizzeria delivery familiare con configurazione pizza chiara, coupon e checkout rapido.",
        ["Delivery UX", "Coupon applicato", "Configurazione pizza", "Pagamento veloce"],
        "napoli-slice",
        [
          { file: "1-home.png", label: "Vetrina" },
          { file: "2-menu.png", label: "Menu delivery" },
          { file: "3-detail.png", label: "Dettaglio pizza" },
          { file: "4-checkout.png", label: "Checkout" },
        ]),
      VManual("food", "food-verde-bistrot", "Verde Bistrot", "Organic Editorial", "Salvia · Avorio",
        "Bistrot plant-based con menu stagionale, ingredienti tracciati e prenotazione brunch curata.",
        ["Menu stagionale", "Filtri vegan", "Origine ingredienti", "Booking brunch"],
        "verde-bistrot",
        [
          { file: "1-home.png", label: "Vetrina" },
          { file: "2-menu.png", label: "Menu stagionale" },
          { file: "3-detail.png", label: "Piatto signature" },
          { file: "4-booking.png", label: "Prenota brunch" },
        ]),
      VManual("food", "food-ramen-kobo", "Ramen Kōbo", "Brutalist Tokyo", "Bordeaux · Nero",
        "Ramen bar brutalist con combinazioni brodo, timing di servizio e checkout takeaway essenziale.",
        ["Custom broth", "Extra ramen", "Counter service", "Takeaway checkout"],
        "ramen-kobo",
        [
          { file: "1-home.png", label: "Vetrina" },
          { file: "2-menu.png", label: "Menu ramen" },
          { file: "3-detail.png", label: "Bowl signature" },
          { file: "4-checkout.png", label: "Checkout takeaway" },
        ]),
      VManual("food", "food-bruna-caffe", "Bruna Caffè", "Vintage Coffee House", "Caramello · Espresso",
        "Coffee house premium con brunch, dessert, fidelity e scheda prodotto calda e materica.",
        ["Brunch menu", "Dessert counter", "Coffee detail", "Loyalty club"],
        "bruna-caffe",
        [
          { file: "1-home.png", label: "Vetrina" },
          { file: "2-menu.png", label: "Menu brunch" },
          { file: "3-detail.png", label: "Signature coffee" },
          { file: "4-loyalty.png", label: "Club fedeltà" },
        ]),
      VManual("food", "food-tacos-reales", "Tacos Reales", "Festive Street Food", "Arancio · Magenta",
        "Taqueria vibrante con combo menu, personalizzazione salse e tracking ordine in stile quick-service.",
        ["Combo tacos", "Salse custom", "Fast checkout", "Order tracking"],
        "tacos-reales",
        [
          { file: "1-home.png", label: "Vetrina" },
          { file: "2-menu.png", label: "Menu tacos" },
          { file: "3-detail.png", label: "Dettaglio combo" },
          { file: "4-tracking.png", label: "Tracking ordine" },
        ]),
      V("food", "food-onyx-ivory", "Bistrot Avorio", "Ivory Editorial", "Avorio · Nero",
        "Bistrot editoriale con menu del giorno, prenotazioni e loyalty pulita.",
        ["Menu del giorno", "Prenotazioni", "Loyalty ospiti", "Delivery brand"],
        foodOnyxIvory, "food-onyx-ivory"),
      V("food", "food-sakura-luxury-dark", "Sakura Omakase", "Sakura Luxury Dark", "Nero · Sakura",
        "Sushi omakase con menu degustazione, sake pairing e prenotazione a turni.",
        ["Omakase card", "Sake pairing", "Turni serali", "Chef's counter"],
        foodSakuraLuxuryDark, "food-sakura-luxury-dark"),
      V("food", "food-sakura-sakura", "Paperfish Sakura", "Sakura Light", "Rosa · Kraft",
        "Sushi contemporaneo con menu visuale, ordini rapidi e take-away.",
        ["Menu visuale", "Ordine rapido", "Take-away", "Fidelity roll"],
        foodSakuraSakura, "food-sakura-sakura"),
      V("food", "food-indocina-neon", "Indocina Noir", "Neon Spice", "Neon · Giada",
        "Asian fusion notturno con cocktail pairing, booking serale e allergeni.",
        ["Cocktail pairing", "Booking serale", "Allergeni", "Dark mode UI"],
        foodIndocinaNeonSpice, "food-indocina-neon-spice"),
      V("food", "food-levante-deli", "Levante Deli", "Pearl Gold", "Perla · Oro",
        "Delicatessen mediterraneo con vetrina prodotti, box regalo e ordini pickup.",
        ["Vetrina prodotti", "Box regalo", "Pickup deli", "Ricette firmate"],
        foodLevanteDeli, "food-levante-deli"),
      V("food", "food-brace-kebab", "Brace Kebab", "Urban Grill", "Rame · Fumo",
        "Grill urbano: combo, delivery, zone consegna e offerte pranzo veloci.",
        ["Combo grill", "Delivery zones", "Offerte pranzo", "Ordine 1-tap"],
        foodBraceKebab, "food-brace-kebab"),
    ],
  },
  {
    id: "beauty",
    label: "Beauty & Salone",
    tagline: "Agenda, trattamenti, schede cliente, pacchetti VIP e rebooking.",
    variants: [
      V("beauty", "beauty-nail-lavender-v2", "Atelier Unghie", "Lavender Editorial II", "Lavanda · Avorio",
        "Nail atelier editoriale con listino premium, manicure lounge e prenotazione raffinata.",
        ["Listino manicure", "Nail art gallery", "Cabine beauty", "Prenotazione smart"],
        beautyNailLavenderV2, "beauty-nail-lavender-v2"),
      V("beauty", "beauty-hair-noir", "Velluto Hair Lab", "Noir Salon", "Nero · Champagne",
        "Hair salon fashion con lookbook, color service, stylist agenda e retail curato.",
        ["Color service", "Lookbook capelli", "Stylist agenda", "Retail premium"],
        beautyHairNoir, "beauty-hair-noir"),
      V("beauty", "beauty-barber-industrial", "Officina Barber Club", "Industrial Grooming", "Grafite · Rame",
        "Barber studio maschile con grooming menu, barber profile, combo e booking rapido.",
        ["Taglio & barba", "Combo grooming", "Barber profile", "Slot express"],
        beautyBarberIndustrial, "beauty-barber-industrial"),
      V("beauty", "beauty-medspa-clinical", "Lumen MedSpa", "Clinical Glass", "Ghiaccio · Teal",
        "MedSpa clinico con consulti estetici, trattamenti medicali e prenotazione consulto senza impegno.",
        ["Consulti medici", "Botox & filler", "Before/after", "Booking clinico"],
        beautyMedspaClinical, "beauty-medspa-clinical"),
      V("beauty", "beauty-aurora-blush", "Aurora Nail", "Blush Rosegold", "Blush · Oro rosa",
        "Nail luxury con pacchetti sposa, add-on premium e loyalty punti.",
        ["Pacchetti sposa", "Add-on premium", "Loyalty punti", "Gallery lavori"],
        beautyAuroraBlushRosegold, "beauty-aurora-blush-rosegold"),
      VManual("beauty", "beauty-serena-spa", "Serena Spa", "Sage Wellness Luxury", "Salvia · Perla",
        "Spa premium con rituali corpo, cabine sensoriali, scheda trattamento e booking raffinato.",
        ["Rituali corpo", "Cabine sensoriali", "Scheda trattamento", "Booking spa"],
        "serena-spa",
        [
          { file: "1-home.png", label: "Salone" },
          { file: "2-menu.png", label: "Rituali benessere" },
          { file: "3-detail.png", label: "Dettaglio trattamento" },
          { file: "4-booking.png", label: "Prenota rituale" },
        ]),
    ],
  },
  {
    id: "ncc",
    label: "NCC · Charter · Yacht",
    tagline: "Flotta, preventivi rapidi, itinerari, booking e concierge.",
    variants: [
      V("ncc", "ncc-marina-riviera", "Marina Riviera", "Riviera Blue", "Blu · Bianco",
        "NCC costiero con flotta, itinerari mappati, preventivo istantaneo.",
        ["Flotta live", "Itinerari mappa", "Preventivo istante", "Concierge chat"],
        nccMarinaRiviera, "ncc-marina-riviera"),
      V("ncc", "ncc-marina-amalfi", "Marina Amalfi", "Amalfi Sunset", "Ambra · Bianco",
        "Charter luxury Amalfi: tour privati, chef a bordo, sunset experience.",
        ["Tour privati", "Chef a bordo", "Sunset packages", "Booking flessibile"],
        nccMarinaAmalfiStyleB, "ncc-marina-amalfi-style-b"),
      V("ncc", "ncc-cala-azure", "Cala Vento Charter", "Emerald Cove", "Smeraldo · Sabbia",
        "Yacht charter Sardegna con calette, day cruise, transfer VIP porto.",
        ["Calette curate", "Day cruise", "Transfer VIP", "Skipper included"],
        hospitalityCalaVentoAzure, "hospitality-cala-vento-azure"),
      VManual("ncc", "ncc-riviera-rental", "Riviera Rental", "Ivory Executive", "Avorio · Champagne",
        "Noleggio premium con vetrina luxury, flotta selezionata, dettaglio veicolo e checkout concierge.",
        ["Ricerca date", "Flotta executive", "Dettaglio auto", "Checkout concierge"],
        "riviera-rental",
        [
          { file: "1-home.png", label: "Fleet showcase" },
          { file: "2-fleet.png", label: "Flotta & tariffe" },
          { file: "3-detail.png", label: "Dettaglio veicolo" },
          { file: "4-booking.png", label: "Prenotazione" },
        ]),
      VManual("ncc", "ncc-aurora-drive", "Aurora Drive", "Emerald Chauffeur", "Smeraldo · Oro",
        "Servizio chauffeur high-end con hero cinematica, flotta business, itinerario live e conferma VIP.",
        ["Business class", "Tratte premium", "Itinerario live", "Conferma VIP"],
        "aurora-drive",
        [
          { file: "1-home.png", label: "Fleet showcase" },
          { file: "2-fleet.png", label: "Flotta & servizi" },
          { file: "3-itinerary.png", label: "Itinerario" },
          { file: "4-booking.png", label: "Conferma corsa" },
        ]),
      VManual("ncc", "ncc-riviera-boats", "Riviera Boats", "Mediterranean Charter", "Azzurro · Corallo",
        "Charter mediterraneo luminoso con fleet gallery, scheda yacht completa e secure booking.",
        ["Day charter", "Fleet gallery", "Scheda yacht", "Deposito sicuro"],
        "riviera-boats",
        [
          { file: "1-home.png", label: "Fleet showcase" },
          { file: "2-fleet.png", label: "Flotta & charter" },
          { file: "3-detail.png", label: "Dettaglio yacht" },
          { file: "4-booking.png", label: "Prenotazione" },
        ]),
    ],
  },
  {
    id: "hospitality",
    label: "Hotel & Hospitality",
    tagline: "Camere, esperienze, concierge, upsell escursioni e prenotazioni.",
    variants: [
      V("hospitality", "hosp-cala-azure", "Cala Vento Resort", "Sardinia Azure", "Azzurro · Sabbia",
        "Boutique resort: camere, esperienze curate, concierge chat, upsell tour.",
        ["Camere & suite", "Esperienze curate", "Concierge chat", "Upsell tour"],
        hospitalityCalaVentoAzure, "hospitality-cala-vento-azure"),
      V("hospitality", "hosp-levante", "Levante Boutique", "Pearl Gold Retreat", "Perla · Oro",
        "Boutique urbano: suite curate, gastronomia interna, esperienze private.",
        ["Suite curate", "Ristorante interno", "Esperienze private", "Concierge"],
        foodLevanteDeli, "food-levante-deli"),
      VManual("hospitality", "hosp-cala-corallo", "Cala Corallo Resort", "Mediterranean Coral", "Turchese · Corallo",
        "Boutique resort mediterraneo: camere vista mare, esperienze curate, concierge chat, upsell tour.",
        ["Camere & suite", "Esperienze curate", "Concierge chat", "Upsell esperienze"],
        "cala-corallo",
        [
          { file: "1-home.png", label: "Home resort" },
          { file: "2-rooms.png", label: "Camere & suite" },
          { file: "3-detail.png", label: "Dettaglio suite" },
          { file: "4-experiences.png", label: "Esperienze" },
        ]),
      VManual("hospitality", "hosp-palazzo-novecento", "Palazzo Novecento", "Art Deco Urban Stay", "Verde bosco · Champagne",
        "Boutique hotel urbano art déco: home iconica, camere editoriali, suite detail e concierge esperienziale.",
        ["Home hotel", "Suite & camere", "Suite detail", "Esperienze concierge"],
        "palazzo-novecento",
        [
          { file: "1-home.png", label: "Home hotel" },
          { file: "2-rooms.png", label: "Camere" },
          { file: "3-detail.png", label: "Suite detail" },
          { file: "4-experiences.png", label: "Esperienze" },
        ]),
    ],
  },
  {
    id: "fitness",
    label: "Fitness · Padel · Sport",
    tagline: "Corsi, prenotazioni campi, abbonamenti, coach e schede attività.",
    variants: [
      V("fitness", "fit-padel-sage", "Centro Padel Brera", "Sage Luxe", "Salvia · Oro",
        "Padel club premium: prenotazione campi, tornei, coach privati, ranking.",
        ["Prenotazione campi", "Tornei live", "Coach privati", "Ranking club"],
        fitnessPadelSage, "fitness-padel-sage"),
      V("fitness", "fit-onda-aqua", "Onda Sport Club", "Fresh Azzurro", "Azzurro · Bianco",
        "Palestra multi-sport con classi, abbonamenti, schede coach e progressi.",
        ["Classi settimana", "Abbonamenti", "Schede coach", "Progressi live"],
        fitnessOndaAqua, "fitness-onda-aqua"),
      VManual("fitness", "fit-prana-studio", "Prana Studio", "Terracotta Mindful", "Terracotta · Sabbia",
        "Yoga e pilates studio con lezioni curate, teacher profiles e membership elegante.",
        ["Schedule studio", "Teacher spotlight", "Workshop detail", "Membership"],
        "prana-studio",
        [
          { file: "1-home.png", label: "Club" },
          { file: "2-schedule.png", label: "Schedule classi" },
          { file: "3-detail.png", label: "Dettaglio workshop" },
          { file: "4-membership.png", label: "Membership" },
        ]),
      VManual("fitness", "fit-iron-box", "Iron Box Milano", "Industrial Brutalist", "Nero · Rosso · Bone",
        "Box crossfit brutalista: WOD del giorno, calendario corsi, coach profile e membership ad alto contrasto.",
        ["WOD hero", "Schedule classi", "Coach profile", "Membership"],
        "iron-box",
        [
          { file: "1-home.png", label: "Home WOD" },
          { file: "2-schedule.png", label: "Schedule" },
          { file: "3-coach.png", label: "Coach" },
          { file: "4-membership.png", label: "Membership" },
        ]),
    ],
  },
  {
    id: "healthcare",
    label: "Studi medici & Cliniche",
    tagline: "Agenda visite, prestazioni, cartella paziente e pagamenti.",
    variants: [
      V("healthcare", "health-lumen", "Lumen Clinic", "Ethereal Glass", "Ghiaccio · Blu",
        "Poliambulatorio pulito: prestazioni, prenotazione visite, cartella paziente.",
        ["Prestazioni", "Prenota visita", "Cartella paziente", "Pagamenti online"],
        healthcareLumenGlass, "healthcare-lumen-glass"),
      VManual("healthcare", "health-aurora", "Aurora Medical", "Ivory Editorial", "Avorio · Smeraldo · Oro",
        "Poliambulatorio editorial: specialisti, schede medico curate, calendario prenotazioni e pagamenti online.",
        ["Specialità", "Directory medici", "Scheda specialista", "Prenotazione visita"],
        "aurora-medical",
        [
          { file: "1-home.png", label: "Home clinica" },
          { file: "2-specialists.png", label: "Specialisti" },
          { file: "3-doctor.png", label: "Scheda medico" },
          { file: "4-booking.png", label: "Prenotazione" },
        ]),
      VManual("healthcare", "health-sorriso-studio", "Sorriso Studio", "Mint Editorial Dental", "Menta · Teal · Corallo",
        "Studio dentistico premium: hero emozionale, trattamenti chiari, profilo medico e conferma visita elegante.",
        ["Home studio", "Trattamenti", "Profilo medico", "Conferma visita"],
        "sorriso-studio",
        [
          { file: "1-home.png", label: "Home studio" },
          { file: "2-services.png", label: "Trattamenti" },
          { file: "3-doctor.png", label: "Medico" },
          { file: "4-booking.png", label: "Conferma" },
        ]),
    ],
  },
  {
    id: "veterinary",
    label: "Veterinaria & Pet",
    tagline: "Servizi pet, prenotazioni, profili animali e pet resort.",
    variants: [
      V("veterinary", "vet-tropico", "Tropico Pet Resort", "Tropico Resort", "Verde · Corallo",
        "Pet resort completo: pensione, servizi cliniche, profili pet, foto giornaliere.",
        ["Pensione booking", "Servizi clinica", "Profilo pet", "Foto giornata"],
        veterinaryTropicoResort, "veterinary-tropico-resort"),
      VManual("veterinary", "vet-casa-zampa", "Casa Zampa Pet Resort", "Warm Cream Care", "Crema · Terracotta · Salvia",
        "Pet resort warm: pensione premium, toelettatura, veterinario in loco, profilo pet e diario giornaliero.",
        ["Home pet resort", "Servizi & prezzi", "Profilo pet Milo", "Booking soggiorno"],
        "casa-zampa",
        [
          { file: "1-home.png", label: "Home resort" },
          { file: "2-services.png", label: "Servizi" },
          { file: "3-pet.png", label: "Profilo pet" },
          { file: "4-booking.png", label: "Prenota soggiorno" },
        ]),
    ],
  },
  {
    id: "childcare",
    label: "Nido & Nursery",
    tagline: "Iscrizioni, attività, pasti, team e comunicazioni famiglie.",
    variants: [
      V("childcare", "child-stelle", "Piccole Stelle Nursery", "Playful Colorful", "Corallo · Ocra",
        "Nursery giocosa: programmi settimanali, pasti, foto giornata, chat genitori.",
        ["Programma settimana", "Menu pasti", "Foto giornata", "Chat genitori"],
        childcareStellePlayful, "childcare-stelle-playful"),
      V("childcare", "child-arcobaleno", "Arcobaleno Playhouse", "Bauhaus Play", "Primari · Bianco",
        "Playhouse Bauhaus: attività, iscrizioni online, calendario, team educatori.",
        ["Attività settimana", "Iscrizioni online", "Calendario", "Team educatori"],
        childcareArcobalenoBauhaus, "childcare-arcobaleno-bauhaus"),
      VManual("childcare", "child-bimbo-sole", "Bimbo Sole Nido", "Scandi Pastel", "Butter · Cielo · Salvia",
        "Nido scandi con menu nutrizionista, programma settimanale, diario giornata bimbo e chat educatori.",
        ["Home nido", "Programma settimana", "Menu pasti", "Diario giornaliero"],
        "bimbo-sole",
        [
          { file: "1-home.png", label: "Home nido" },
          { file: "2-program.png", label: "Programma" },
          { file: "3-menu.png", label: "Menu pasti" },
          { file: "4-diary.png", label: "Diario bimbo" },
        ]),
    ],
  },
  {
    id: "construction",
    label: "Edilizia & Real Estate",
    tagline: "Cantieri, unità, manutenzioni, community e dashboard operativa.",
    variants: [
      V("construction", "cons-ocean", "Domus Living", "Ocean Azure", "Blu · Bianco",
        "Real estate luxury: unità, tour 3D, prenota visita, dashboard cantieri.",
        ["Unità disponibili", "Tour 3D", "Prenota visita", "Dashboard cantieri"],
        constructionDomusOceanAzure, "construction-domus-ocean-azure"),
      V("construction", "cons-coral", "Domus Living Coral", "Living Coral", "Corallo · Sabbia",
        "Community residenti: manutenzioni, servizi condominio, prenota amenità.",
        ["Manutenzioni", "Servizi condominio", "Prenota amenità", "Bacheca residenti"],
        constructionDomusLivingCoral, "construction-domus-living-coral"),
      VManual("construction", "cons-cantiere-primo", "Cantiere Primo", "Enterprise Works", "Ardesia · Sabbia · Safety Orange",
        "Piattaforma cantiere/real estate operativa: KPI cantieri, unità disponibili, dettaglio lotto e report avanzamento.",
        ["Control room", "Unità disponibili", "Dettaglio cantiere", "Report avanzamento"],
        "cantiere-primo",
        [
          { file: "1-home.png", label: "Dashboard" },
          { file: "2-units.png", label: "Unità" },
          { file: "3-detail.png", label: "Dettaglio lotto" },
          { file: "4-report.png", label: "Report" },
        ]),
    ],
  },
  {
    id: "plumber",
    label: "Artigiani & Servizi tecnici",
    tagline: "Interventi urgenti, preventivi rapidi, agenda squadre.",
    variants: [
      V("plumber", "plumber-a", "Idro Pronto", "Rescue Blue", "Blu · Bianco",
        "Idraulica pronto intervento: chiamata rapida, preventivo, geolocalizzazione.",
        ["Chiamata rapida", "Preventivo", "Geolocalizzazione", "Storico interventi"],
        plumberIdroProntoStyleA, "plumber-idro-pronto-style-a"),
      V("plumber", "plumber-b", "Idro Pronto Pro", "Bold Orange", "Arancio · Nero",
        "Squadra tecnica: agenda interventi, foto pre/post, firma cliente, fatturazione.",
        ["Agenda squadra", "Foto pre/post", "Firma cliente", "Fatturazione"],
        plumberIdroProntoStyleB, "plumber-idro-pronto-style-b"),
    ],
  },
  {
    id: "retail",
    label: "Retail & E-commerce",
    tagline: "Vetrine brand, catalogo, schede prodotto e checkout premium.",
    variants: [],
  },
];

// =============================================================
// AUTO-DISCOVERY
// Any folder dropped in src/assets/mockups/portfolio-lowengeld/<slug>/
// with numbered PNGs (1-*.png, 2-*.png, ...) is automatically
// registered as a new variant inside its sector — no manual edit
// required. Sector is inferred, in order, from:
//   1) optional meta.json inside the folder ({ "sector": "food", ... })
//   2) folder-name convention "<sector>__<slug>" (double underscore)
//   3) keyword heuristics on the slug (sushi→food, spa→beauty, ...)
//   4) explicit fallback ("food")
// The variant is appended AFTER manual variants so sector order and
// filters stay stable; screens reuse the sector's standard labels
// (Home → Menu → Dettaglio → Prenotazione) and are opened fullscreen
// through the same MockupLightbox as any manual mockup.
// =============================================================

const metaFiles = import.meta.glob(
  "@/assets/mockups/portfolio-lowengeld/**/meta.json",
  { eager: true, import: "default" },
) as Record<string, Partial<{
  sector: string;
  brand: string;
  style: string;
  palette: string;
  description: string;
  features: string[];
  order: number;
  labels: string[];
}>>;

const SECTOR_IDS = new Set(SECTOR_MOCKUPS.map((s) => s.id));

const SLUG_SECTOR_HINTS: Array<[RegExp, string]> = [
  [/(sushi|ramen|pizza|kebab|taco|ceviche|bistrot|caffe|coffee|brace|slice|food|deli|omakase|onigiri|maki|osteria|trattoria|pasta|burger|grill|napoli|strapizz|orygano|otomaki|flame)/i, "food"],
  [/(nail|hair|barber|medspa|spa|salone|beauty|atelier|serena|velluto|blush)/i, "beauty"],
  [/(rental|drive|boats|yacht|ncc|charter|marina|chauffeur|limo|transfer)/i, "ncc"],
  [/(resort|hotel|suite|palazzo|hospitality|boutique|villa)/i, "hospitality"],
  [/(fit|padel|iron|yoga|pilates|prana|crossfit|gym)/i, "fitness"],
  [/(medical|clinic|clinica|sorriso|dental|dentist|poliambulatorio)/i, "healthcare"],
  [/(vet|zampe|zampa|pet(?!al))/i, "veterinary"],
  [/(nido|nursery|bimb|kids|child|playhouse)/i, "childcare"],
  [/(cantiere|edil|construc|domus|real-estate|immobili)/i, "construction"],
  [/(volt|idro|plumber|electric|elettric|technician|artigian)/i, "plumber"],
  [/(retail|shop|store|boutique-shop|concept|sneaker|streetwear|jewel|gioiell|ottica|eyewear|wine|cantina|fashion|apparel|denim|leather|profum|cosm|homeware)/i, "retail"],
];

const FALLBACK_SECTOR = "food";

const titleize = (slug: string): string =>
  slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const collectFolderScreens = (
  folder: string,
): Array<{ file: string; num: number; kind: string }> => {
  const out: Array<{ file: string; num: number; kind: string }> = [];
  for (const path of Object.keys(portfolioLowengeldFiles)) {
    if (!path.includes(`/portfolio-lowengeld/${folder}/`)) continue;
    const fname = path.split("/").pop() ?? "";
    const m = fname.match(/^(\d+)[-_](.+)\.png$/i);
    if (!m) continue;
    out.push({ file: fname, num: parseInt(m[1], 10), kind: m[2].toLowerCase() });
  }
  return out.sort((a, b) => a.num - b.num);
};

const discoverFolders = (): string[] => {
  const set = new Set<string>();
  for (const path of Object.keys(portfolioLowengeldFiles)) {
    const m = path.match(/portfolio-lowengeld\/([^/]+)\//);
    if (m) set.add(m[1]);
  }
  return Array.from(set).sort();
};

const inferSector = (slug: string, metaSector?: string): string => {
  if (metaSector && SECTOR_IDS.has(metaSector)) return metaSector;
  const conv = slug.match(/^([a-z]+)__/);
  if (conv && SECTOR_IDS.has(conv[1])) return conv[1];
  for (const [re, sector] of SLUG_SECTOR_HINTS) {
    if (re.test(slug)) return sector;
  }
  return FALLBACK_SECTOR;
};

// Already-registered slugs — inferred from manual variants' screen paths
const registeredSlugs = new Set<string>();
for (const group of SECTOR_MOCKUPS) {
  for (const v of group.variants) {
    const m = v.screen.match(/portfolio-lowengeld\/([^/]+)\//);
    if (m) registeredSlugs.add(m[1]);
  }
}

const readMetaFor = (folder: string) => {
  for (const [path, meta] of Object.entries(metaFiles)) {
    if (path.includes(`/portfolio-lowengeld/${folder}/meta.json`)) return meta;
  }
  return undefined;
};

for (const folder of discoverFolders()) {
  if (registeredSlugs.has(folder)) continue;
  const files = collectFolderScreens(folder);
  if (files.length === 0) continue;

  const meta = readMetaFor(folder);
  const cleanSlug = folder.replace(/^[a-z]+__/, "");
  const sectorId = inferSector(folder, meta?.sector);
  const group = SECTOR_MOCKUPS.find((g) => g.id === sectorId);
  if (!group) continue;

  const labels = SECTOR_SCREEN_LABELS[sectorId] ?? ["Home", "Menu", "Dettaglio", "Prenotazione"];
  const captions = CAPTIONS[sectorId] ?? labels;

  const screens: MockupScreen[] = files.slice(0, 4).map((f, i) => ({
    label: meta?.labels?.[i] ?? labels[i] ?? titleize(f.kind),
    caption: captions[i] ?? labels[i] ?? titleize(f.kind),
    image: portfolioImage(folder, f.file),
  }));

  const brand = meta?.brand ?? titleize(cleanSlug);
  const style = meta?.style ?? "Auto-import Premium";
  const palette = meta?.palette ?? "Coerente al brand";
  const description =
    meta?.description ??
    `Mockup ${brand} importato automaticamente. Sequenza completa fullscreen in stile ${sectorId}.`;
  const features = meta?.features ?? screens.map((s) => s.label);

  const variant: SectorMockupVariant = {
    id: `${sectorId}-${cleanSlug}`,
    brand,
    style,
    palette,
    description,
    features,
    screen: screens[0].image,
    screens,
    source: "reference",
    tier: "extended",
  };


  if (typeof meta?.order === "number") {
    const idx = Math.max(0, Math.min(group.variants.length, meta.order));
    group.variants.splice(idx, 0, variant);
  } else {
    group.variants.push(variant);
  }
  registeredSlugs.add(folder);
}

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
