/**
 * Unified sector → variants registry for the premium mockup showcase.
 *
 * This registry intentionally uses LIVE FLAT UI specs instead of PNG companion
 * screenshots: every screen is rendered as a webapp surface inside ONE iPhone
 * frame, so there is never an iPhone mockup inside another iPhone mockup.
 */

export type MockupScreenKind = "home" | "catalog" | "detail" | "booking";

export type MockupTheme = {
  bg: string;
  surface: string;
  surface2: string;
  text: string;
  muted: string;
  accent: string;
  accent2: string;
  line: string;
};

export type MockupLayout =
  | "editorial"
  | "dashboard"
  | "commerce"
  | "agenda"
  | "map"
  | "clinical"
  | "playful"
  | "technical"
  | "luxury";

export type MockupScreen = {
  label: string;
  caption: string;
  kind: MockupScreenKind;
};

export type SectorMockupVariant = {
  id: string;
  sectorId: string;
  brand: string;
  style: string;
  palette: string;
  description: string;
  features: string[];
  theme: MockupTheme;
  layout: MockupLayout;
  screens: MockupScreen[];
};

export type SectorMockupGroup = {
  id: string;
  label: string;
  tagline: string;
  variants: SectorMockupVariant[];
};

const T = {
  obsidian: { bg: "#090806", surface: "#15100b", surface2: "#26190e", text: "#fff7e6", muted: "#c6a982", accent: "#d8a63f", accent2: "#8b4b20", line: "#3b2a18" },
  ivory: { bg: "#fbf5ea", surface: "#fffaf1", surface2: "#eadcc6", text: "#25180e", muted: "#8f7356", accent: "#b9853f", accent2: "#2f6b56", line: "#dfcdb5" },
  sakura: { bg: "#fff7f4", surface: "#fffefd", surface2: "#f5dedc", text: "#34201f", muted: "#9a6f68", accent: "#c65a65", accent2: "#7a2036", line: "#ebcbc8" },
  neon: { bg: "#090610", surface: "#171020", surface2: "#24112a", text: "#fff4df", muted: "#bda8bf", accent: "#d8ff2f", accent2: "#ff3d8b", line: "#3d2550" },
  lavender: { bg: "#fbf7ff", surface: "#ffffff", surface2: "#eadfff", text: "#2c2140", muted: "#806e9b", accent: "#9c73df", accent2: "#d6a44d", line: "#dfd1f6" },
  noir: { bg: "#080707", surface: "#151212", surface2: "#2a1d1d", text: "#fff8ef", muted: "#b29789", accent: "#c89f64", accent2: "#7f1f2d", line: "#3a2b27" },
  graphite: { bg: "#0b0d0f", surface: "#15191c", surface2: "#23282c", text: "#f4ede2", muted: "#9b9892", accent: "#c0743f", accent2: "#d6b271", line: "#33383c" },
  clinical: { bg: "#f5fbfb", surface: "#ffffff", surface2: "#e4f2f1", text: "#173836", muted: "#63817d", accent: "#138a83", accent2: "#76c7bd", line: "#cde3e0" },
  marina: { bg: "#061827", surface: "#0d263b", surface2: "#103653", text: "#f4fbff", muted: "#96bdd5", accent: "#41c4df", accent2: "#d7b35c", line: "#21455f" },
  amalfi: { bg: "#fff8ea", surface: "#ffffff", surface2: "#efe0bc", text: "#2a2518", muted: "#827354", accent: "#d5aa38", accent2: "#1d6d94", line: "#e0d0a8" },
  azure: { bg: "#eafcff", surface: "#ffffff", surface2: "#c9eef4", text: "#0b3540", muted: "#4f7f89", accent: "#13a7bd", accent2: "#ff725c", line: "#bde6ed" },
  sunset: { bg: "#170d12", surface: "#25151c", surface2: "#3b2027", text: "#fff2e4", muted: "#d2a694", accent: "#ff8b5d", accent2: "#f2c36b", line: "#4f3034" },
  sage: { bg: "#0b1410", surface: "#14211a", surface2: "#20352b", text: "#f5fff7", muted: "#a4bea8", accent: "#a7d94f", accent2: "#3f8f62", line: "#2d4638" },
  aqua: { bg: "#061929", surface: "#0d2b43", surface2: "#123d5f", text: "#f2fbff", muted: "#9dc3d8", accent: "#39d6e6", accent2: "#9ff06e", line: "#25506d" },
  bauhaus: { bg: "#fff8df", surface: "#ffffff", surface2: "#ffe9a5", text: "#1d2430", muted: "#68707f", accent: "#ffcf34", accent2: "#e6423a", line: "#eadca8" },
  tropico: { bg: "#f2fff0", surface: "#ffffff", surface2: "#d7f3d4", text: "#17331d", muted: "#66836b", accent: "#27a55c", accent2: "#ff7e5f", line: "#c6e7c3" },
  ice: { bg: "#edf8ff", surface: "#ffffff", surface2: "#d7ecfb", text: "#123247", muted: "#668097", accent: "#2d8fd3", accent2: "#72d1ff", line: "#c6deef" },
  coral: { bg: "#fff3ec", surface: "#ffffff", surface2: "#ffd7c8", text: "#422018", muted: "#9b6d5d", accent: "#e97858", accent2: "#b8864b", line: "#efc7b8" },
  rescue: { bg: "#071428", surface: "#0d2241", surface2: "#12315e", text: "#f2f8ff", muted: "#91afd0", accent: "#ff6b31", accent2: "#36a6ff", line: "#254672" },
};

const SCREEN_TEXT: Record<string, { labels: [string, string, string, string]; captions: [string, string, string, string] }> = {
  food: {
    labels: ["Vetrina", "Menu", "Piatto", "Tavolo"],
    captions: ["Hero con piatto signature, turni live e CTA prenota.", "Menu con categorie, allergeni, foto e filtri dieta.", "Scheda piatto con ingredienti, pairing e upsell.", "Prenotazione tavolo con orario, ospiti e note allergie."],
  },
  beauty: {
    labels: ["Salone", "Trattamenti", "Cliente VIP", "Agenda"],
    captions: ["Home brand con servizi, portfolio lavori e CTA booking.", "Listino per cabina, durata, prezzo e add-on.", "Storico cliente, preferenze, foto e rebooking.", "Agenda operatori con slot live e reminder."],
  },
  ncc: {
    labels: ["Fleet", "Flotta", "Itinerario", "Preventivo"],
    captions: ["Hero luxury con flotta, area servita e preventivo rapido.", "Veicoli e charter con capienza, servizi e tariffe.", "Mappa percorso, tappe, tempi e concierge.", "Riepilogo corsa, acconto e conferma autista."],
  },
  hospitality: {
    labels: ["Resort", "Suite", "Esperienze", "Booking"],
    captions: ["Homepage struttura con stagione, rating e offerta diretta.", "Camere con disponibilità, amenities e pricing dinamico.", "Upsell spa, cena privata, tour e concierge.", "Booking multi-notte con extra e conferma."],
  },
  fitness: {
    labels: ["Club", "Corsi", "Coach", "Prenota"],
    captions: ["Home sportiva con prossime lezioni e posti disponibili.", "Palinsesto corsi con livello, coach e capienza.", "Scheda coach/campo con rating, bio e prime disponibilità.", "Prenotazione lezione, campo o abbonamento."],
  },
  healthcare: {
    labels: ["Clinica", "Prestazioni", "Medico", "Visita"],
    captions: ["Home medica con specialità, medici e booking rapido.", "Prestazioni per branca, tempi d'attesa e convenzioni.", "Scheda specialista con bio, agenda e recensioni.", "Prenota visita, pagamento e promemoria."],
  },
  veterinary: {
    labels: ["Pet resort", "Servizi", "Profilo pet", "Soggiorno"],
    captions: ["Home pet con pensione, clinica e servizi in evidenza.", "Tosatura, day-care, check-up e pacchetti.", "Vaccini, terapie, foto giornata e note staff.", "Prenota soggiorno o visita con calendario dedicato."],
  },
  childcare: {
    labels: ["Nido", "Giornata", "Attività", "Iscrizione"],
    captions: ["Home educativa con open-day e valori pedagogici.", "Routine giornaliera, pasti, riposo e laboratori.", "Foto, note educatori e chat privata famiglia.", "Iscrizione con documenti, retta e ricevuta."],
  },
  construction: {
    labels: ["Progetto", "Unità", "Tour", "Visita"],
    captions: ["Home progetto con stato lavori e valore immobiliare.", "Unità con planimetria, metratura, prezzo e stato.", "Tour, capitolato, finiture e chat consulente.", "Prenota visita in cantiere o call con agente."],
  },
  plumber: {
    labels: ["SOS", "Servizi", "Intervento", "Chiamata"],
    captions: ["Home pronto intervento con zone, ETA e numero one-tap.", "Servizi tecnici con tariffe e urgenze.", "Scheda lavoro con foto, materiali e firma cliente.", "Geolocalizzazione, squadra live e pagamento."],
  },
};

const screensFor = (sectorId: string): MockupScreen[] => {
  const entry = SCREEN_TEXT[sectorId] ?? SCREEN_TEXT.food;
  const kinds: MockupScreenKind[] = ["home", "catalog", "detail", "booking"];
  return entry.labels.map((label, i) => ({ label, caption: entry.captions[i], kind: kinds[i] }));
};

const V = (
  sectorId: string,
  id: string,
  brand: string,
  style: string,
  palette: string,
  description: string,
  features: string[],
  theme: MockupTheme,
  layout: MockupLayout,
): SectorMockupVariant => ({
  id,
  sectorId,
  brand,
  style,
  palette,
  description,
  features,
  theme,
  layout,
  screens: screensFor(sectorId),
});

export const SECTOR_MOCKUPS: SectorMockupGroup[] = [
  {
    id: "food",
    label: "Ristorazione",
    tagline: "Menu digitale, ordini live, prenotazioni, KDS cucina e pagamenti.",
    variants: [
      V("food", "food-onyx-obsidian", "Onyx Brace Steakhouse", "Obsidian Luxury", "Onice · Oro", "Steakhouse premium con carta vini, prenotazione tavoli e degustazione signature.", ["Menu tagli premium", "Wine pairing", "Turni tavolo", "KDS cucina"], T.obsidian, "luxury"),
      V("food", "food-ivory-bistrot", "Bistrot Avorio", "Ivory Editorial", "Avorio · Nero", "Bistrot editoriale con menu del giorno, prenotazioni e fidelity ospiti.", ["Menu del giorno", "Fidelity", "Prenotazioni", "Delivery brand"], T.ivory, "editorial"),
      V("food", "food-sakura-omakase", "Sakura Omakase", "Sakura Ritual", "Rosa · Rosso", "Sushi omakase con sake pairing, chef counter e booking a turni.", ["Omakase", "Sake pairing", "Chef counter", "Turni serali"], T.sakura, "commerce"),
      V("food", "food-indocina-noir", "Indocina Noir", "Neon Spice", "Neon · Giada", "Asian fusion notturno con cocktail pairing e ordini rapidi.", ["Cocktail pairing", "Allergeni", "Ordine rapido", "Dark menu"], T.neon, "dashboard"),
    ],
  },
  {
    id: "beauty",
    label: "Beauty & Salone",
    tagline: "Agenda, trattamenti, schede cliente, pacchetti VIP e rebooking.",
    variants: [
      V("beauty", "beauty-atelier-unghie", "Atelier Unghie", "Lavender Editorial", "Lavanda · Avorio", "Nail atelier con listino premium, gallery lavori e prenotazione raffinata.", ["Listino manicure", "Nail art", "Cabine", "Rebooking"], T.lavender, "editorial"),
      V("beauty", "beauty-hair-noir", "Velluto Hair Lab", "Noir Salon", "Nero · Champagne", "Hair salon fashion con lookbook colore, stylist agenda e retail curato.", ["Color service", "Lookbook", "Stylist agenda", "Retail"], T.noir, "luxury"),
      V("beauty", "beauty-barber-industrial", "Officina Barber Club", "Industrial Grooming", "Grafite · Rame", "Barber studio maschile con grooming menu, profili barber e slot express.", ["Taglio & barba", "Combo", "Barber profile", "Slot express"], T.graphite, "technical"),
      V("beauty", "beauty-medspa-clinical", "Lumen MedSpa", "Clinical Glass", "Ghiaccio · Teal", "MedSpa clinico con consulti estetici, before/after e booking senza impegno.", ["Consulti", "Before/after", "Trattamenti", "Booking clinico"], T.clinical, "clinical"),
    ],
  },
  {
    id: "ncc",
    label: "NCC · Charter · Yacht",
    tagline: "Flotta, preventivi rapidi, itinerari, booking e concierge.",
    variants: [
      V("ncc", "ncc-marina-riviera", "Marina Riviera", "Riviera Blue", "Blu · Bianco", "NCC costiero con flotta, itinerari mappati e preventivo istantaneo.", ["Flotta live", "Mappa", "Preventivo", "Concierge"], T.marina, "map"),
      V("ncc", "ncc-amalfi-private", "Marina Amalfi", "Amalfi Sunset", "Ambra · Bianco", "Charter luxury con tour privati, chef a bordo e sunset experience.", ["Tour privati", "Chef a bordo", "Sunset", "Checkout"], T.amalfi, "editorial"),
      V("ncc", "ncc-riviera-boats", "Riviera Boats", "Emerald Charter", "Smeraldo · Sabbia", "Yacht charter con calette, skipper incluso e transfer porto VIP.", ["Calette", "Skipper", "Day cruise", "Transfer"], T.azure, "commerce"),
    ],
  },
  {
    id: "hospitality",
    label: "Hotel & Hospitality",
    tagline: "Camere, esperienze, concierge, upsell escursioni e prenotazioni.",
    variants: [
      V("hospitality", "hosp-cala-azure", "Cala Vento Resort", "Sardinia Azure", "Azzurro · Sabbia", "Boutique resort con camere, esperienze curate e concierge chat.", ["Suite", "Esperienze", "Concierge", "Upsell tour"], T.azure, "editorial"),
      V("hospitality", "hosp-sunset-suite", "Cala Vento Suite", "Sunset Ritual", "Oro · Corallo", "Suite sunset con pacchetti romantic, spa in camera e cena privata.", ["Pacchetti", "Spa", "Cena privata", "Extra"], T.sunset, "luxury"),
      V("hospitality", "hosp-urban-boutique", "Levante Boutique", "Pearl Gold Retreat", "Perla · Oro", "Boutique urbano con suite curate, gastronomia interna e check-in smart.", ["Suite", "Check-in", "Gastro", "Guest hub"], T.ivory, "dashboard"),
    ],
  },
  {
    id: "fitness",
    label: "Fitness · Padel · Sport",
    tagline: "Corsi, prenotazioni campi, abbonamenti, coach e schede attività.",
    variants: [
      V("fitness", "fit-padel-brera", "Padel Club Torino", "Sage Club", "Salvia · Oro", "Padel club premium con campi, tornei, coach privati e ranking.", ["Campi", "Tornei", "Coach", "Ranking"], T.sage, "agenda"),
      V("fitness", "fit-onda-aqua", "Onda Sport Club", "Fresh Azzurro", "Azzurro · Bianco", "Palestra multisport con classi, abbonamenti e progressi coach.", ["Classi", "Abbonamenti", "Progressi", "Coach"], T.aqua, "dashboard"),
      V("fitness", "fit-greenclub", "GreenClub Golf", "Course Prestige", "Verde · Avorio", "Golf club con tee time, academy, leaderboard e shop soci.", ["Tee time", "Academy", "Leaderboard", "Shop soci"], T.sage, "technical"),
    ],
  },
  {
    id: "healthcare",
    label: "Studi medici & Cliniche",
    tagline: "Agenda visite, prestazioni, cartella paziente e pagamenti.",
    variants: [
      V("healthcare", "health-aurora", "Studio Medico Aurora", "Clinical Trust", "Ghiaccio · Blu", "Poliambulatorio con prestazioni, prenotazioni e cartella paziente.", ["Prestazioni", "Agenda", "Cartella", "Pagamenti"], T.clinical, "clinical"),
      V("healthcare", "health-lumen", "Lumen Clinic", "Soft Medical", "Teal · Bianco", "Clinica estetica pulita con specialisti, piani e follow-up paziente.", ["Specialisti", "Piani cura", "Follow-up", "Consensi"], T.ice, "dashboard"),
    ],
  },
  {
    id: "veterinary",
    label: "Veterinaria & Pet",
    tagline: "Servizi pet, prenotazioni, profili animali e pet resort.",
    variants: [
      V("veterinary", "vet-cuccia-coccole", "Cuccia & Coccole Pet Resort", "Tropico Care", "Verde · Corallo", "Pet resort completo con pensione, day-care e diario fotografico.", ["Pensione", "Day-care", "Profilo pet", "Foto"], T.tropico, "playful"),
      V("veterinary", "vet-clinica-zampa", "Clinica Zampa Blu", "Vet Clinical", "Blu · Menta", "Clinica veterinaria con visite, vaccini, terapie e richiami automatici.", ["Vaccini", "Visite", "Terapie", "Reminder"], T.clinical, "clinical"),
    ],
  },
  {
    id: "childcare",
    label: "Nido & Nursery",
    tagline: "Iscrizioni, attività, pasti, team e comunicazioni famiglie.",
    variants: [
      V("childcare", "child-piccoli-passi", "Piccoli Passi", "Warm Nursery", "Ocra · Corallo", "Nido famigliare con giornata live, foto attività e comunicazioni genitori.", ["Giornata", "Pasti", "Foto", "Chat"], T.bauhaus, "playful"),
      V("childcare", "child-piccolo-diamante", "Piccolo Diamante", "Soft Learning", "Crema · Azzurro", "Nursery premium con open-day, iscrizioni e diario educativo.", ["Open-day", "Iscrizioni", "Diario", "Team"], T.ice, "editorial"),
    ],
  },
  {
    id: "construction",
    label: "Edilizia & Real Estate",
    tagline: "Cantieri, unità, manutenzioni, community e dashboard operativa.",
    variants: [
      V("construction", "cons-domus-ocean", "Domus Living", "Ocean Azure", "Blu · Bianco", "Real estate luxury con unità, tour e prenotazione visita.", ["Unità", "Tour", "Capitolato", "Visita"], T.ice, "technical"),
      V("construction", "cons-residenza-aurea", "Residenza Aurea Hub", "Resident Hub", "Corallo · Sabbia", "Community residenti con ticket manutenzione, servizi e bacheca.", ["Ticket", "Servizi", "Bacheca", "Amenità"], T.coral, "dashboard"),
      V("construction", "cons-cantiere-pro", "Cantiere Pro", "Site Control", "Blu · Rame", "Dashboard cantiere con squadre, avanzamento, mezzi e report cliente.", ["Squadre", "Avanzamento", "Mezzi", "Report"], T.marina, "technical"),
    ],
  },
  {
    id: "plumber",
    label: "Artigiani & Servizi tecnici",
    tagline: "Interventi urgenti, preventivi rapidi, agenda squadre.",
    variants: [
      V("plumber", "plumber-express", "Idraulica Express", "Rescue Blue", "Blu · Arancio", "Pronto intervento 24/7 con ETA squadra, foto e preventivo rapido.", ["SOS", "ETA", "Foto lavoro", "Preventivo"], T.rescue, "technical"),
      V("plumber", "plumber-casa-pronta", "Casa Pronta Service", "Warm Craft", "Avorio · Rame", "Servizi casa con agenda squadre, materiali e firma cliente digitale.", ["Agenda", "Materiali", "Firma", "Fattura"], T.ivory, "dashboard"),
    ],
  },
];

export function getSectorGroup(id: string): SectorMockupGroup | undefined {
  return SECTOR_MOCKUPS.find((g) => g.id === id);
}

export function allMockupVariants(): (SectorMockupVariant & { sectorId: string; sectorLabel: string })[] {
  return SECTOR_MOCKUPS.flatMap((g) =>
    g.variants.map((v) => ({ ...v, sectorId: g.id, sectorLabel: g.label })),
  );
}