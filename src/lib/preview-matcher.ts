/**
 * Preview Matcher (client-side) — v3
 *
 * Sceglie il mockup iPhone più adatto al lead in base a TUTTI i segnali
 * disponibili (nome, settore filtro, sotto-settore, categorie OSM/Google,
 * cucina, sito, indirizzo, orari).
 *
 * Garanzie:
 *  - Ogni settore con brand reali nel portfolio riceve preview di QUEL brand.
 *  - I sotto-settori (sushi, pizza, braceria, padel, yacht, …) hanno priorità
 *    e selezionano il brand/style più coerente — anche se il filtro principale
 *    è generico (es. "food").
 *  - Nessun lead cade più sul "primo brand del primo settore" (Foodcourt Miami).
 *  - Se il brand preferito non è disponibile, ripiega sul SECONDO brand reale
 *    dello stesso settore prima di passare al flat array.
 */

import { SECTOR_PORTFOLIO, SECTOR_MOCKUP_IMAGES, type SectorPortfolio, type MockupBrand } from "@/data/sector-mockup-images";
import { type IndustryId } from "@/config/industry-config";

export type SubSectorKey =
  | "pizzeria" | "sushi" | "braceria" | "pesce" | "bakery" | "vietnamese"
  | "kosher" | "gelateria" | "coffee" | "wine_bar" | "pub" | "vegan"
  | "burger" | "trattoria" | "osteria" | "ristorante" | "kebab"
  | "nails" | "hair" | "barber" | "spa"
  | "yacht" | "boats" | "ncc" | "limo"
  | "padel" | "watersports" | "gym" | "yoga"
  | "dentist" | "physio" | "clinic" | "pharmacy" | "optics"
  | "hotel" | "bnb" | "agriturismo"
  | "beach"
  | "shop" | "jewelry" | "boutique"
  | "construction" | "architect" | "real_estate"
  | "plumber" | "electrician" | "garage"
  | "veterinary" | "petshop"
  | "tattoo" | "photography"
  | "education" | "events" | "logistics"
  | "legal" | "accounting"
  | "cleaning" | "gardening"
  | "childcare"
  | "default";

export interface PreviewMatch {
  sectorId: IndustryId;
  subSector: SubSectorKey;
  brandName: string;
  styleName: string;
  screens: string[];
  templateVariant: string;
  demoSlug: string;
}

type PreviewTarget = {
  sectorId: IndustryId;
  brandKeywords: string[];   // parole chiave per cercare il brand nel portfolio (case-insensitive)
  styleKeywords: string[];   // parole chiave per cercare lo style
  templateVariant: string;
  demoSlug: string;
};

/* ─── Sector normalization ─── */

const KNOWN_SECTORS = new Set<IndustryId>([
  "food", "ncc", "beauty", "healthcare", "retail", "fitness", "hospitality", "beach",
  "plumber", "electrician", "agriturismo", "cleaning", "legal", "accounting", "garage",
  "photography", "construction", "gardening", "veterinary", "tattoo", "childcare",
  "education", "events", "logistics", "custom",
]);

const SECTOR_PARENT: Partial<Record<string, IndustryId>> = {
  bakery: "food", gelateria: "food", wine_bar: "food", catering: "food",
  barber: "beauty", spa: "beauty",
  dentist: "healthcare", physiotherapy: "healthcare", psychology: "healthcare",
  pharmacy: "healthcare", optics: "healthcare",
  martial_arts: "fitness", dance: "fitness",
  pet_shop: "veterinary", jewelry: "retail",
  car_wash: "garage", tech_repair: "retail", printing: "retail",
  driving_school: "education", music: "education",
  florist: "gardening", laundry: "cleaning",
  locksmith: "plumber", tailor: "retail",
  travel: "hospitality", coworking: "hospitality",
  real_estate: "construction", architect: "construction",
  insurance: "accounting", funeral: "events",
  moving: "logistics", pest_control: "cleaning",
};

function normalizeSector(rawSector?: string | null, haystack = ""): IndustryId {
  const sector = (rawSector || "").toLowerCase().trim();
  if (KNOWN_SECTORS.has(sector as IndustryId)) return sector as IndustryId;
  if (SECTOR_PARENT[sector]) return SECTOR_PARENT[sector] as IndustryId;

  // ⭐ PRIORITÀ ALTA: agriturismo va catturato PRIMA di hospitality
  if (/\b(agriturism|ittituris|masseria|fattoria didattica|country house|farm stay|cantina sociale|tenuta|podere|casale|borgo antico|relais di campagna|wine resort)\b/.test(haystack)) return "agriturismo";
  // Inferenza dal testo
  if (/\b(stabiliment|balneare|beach club|beach|lido|spiaggia|ombrellone|lettino)\b/.test(haystack)) return "beach";
  if (/\b(hotel|resort|suite|room|camere|bed and breakfast|b&b|guest house|ospitalità|albergo)\b/.test(haystack)) return "hospitality";
  if (/\b(dentista|clinica|medico|studio medico|fisioterapia|psicologo|farmacia|ambulatorio|visita medica)\b/.test(haystack)) return "healthcare";
  if (/\b(palestra|gym|fitness|crossfit|yoga|pilates|padel|tennis|piscina)\b/.test(haystack)) return "fitness";
  if (/\b(parrucch|estet|nail|barber|spa|wellness|hair|beauty|makeup|trucco)\b/.test(haystack)) return "beauty";
  if (/\b(ncc|noleggio|transfer|chauffeur|limousine|yacht|boat|barca|charter)\b/.test(haystack)) return "ncc";
  if (/\b(shop|store|boutique|negozio|e-commerce|vetrina|prodotti|abbigliamento|gioiell)\b/.test(haystack)) return "retail";
  if (/\b(idraulic|caldaia|tubo|scarico|termoidraul|plumb)\b/.test(haystack)) return "plumber";
  if (/\b(elettric|impianto elettrico|cablaggio|fotovoltaico)\b/.test(haystack)) return "electrician";
  if (/\b(veterinar|pet shop|toelettatura|animali domestici)\b/.test(haystack)) return "veterinary";
  if (/\b(asilo|nursery|childcare|infanzia|nido)\b/.test(haystack)) return "childcare";
  if (/\b(logistica|spedizion|corriere|trasporto merci|warehouse)\b/.test(haystack)) return "logistics";
  if (/\b(formazione|corso|academy|scuola|lezioni)\b/.test(haystack)) return "education";
  if (/\b(eventi|wedding|matrimonio|planner|location eventi)\b/.test(haystack)) return "events";
  if (/\b(officina|carrozzeria|meccanico|tagliando|revisione|gomme)\b/.test(haystack)) return "garage";
  if (/\b(architett|interior design|edil|ristruttur|costruzion|cantiere|impresa edile|geometra)\b/.test(haystack)) return "construction";
  if (/\b(foto|photography|fotograf|video maker|wedding photo)\b/.test(haystack)) return "photography";
  if (/\b(giardin|garden|verde|vivaio|paesagg|fioraio|florist)\b/.test(haystack)) return "gardening";
  if (/\b(tattoo|piercing|ink|tatuaggio)\b/.test(haystack)) return "tattoo";
  if (/\b(avvocat|legal|notai|studio legale)\b/.test(haystack)) return "legal";
  if (/\b(commercialist|caf|contabil|fiscal|tributar)\b/.test(haystack)) return "accounting";
  if (/\b(clean|pulizi|sanificaz|disinfestaz|impresa di pulizie)\b/.test(haystack)) return "cleaning";
  if (/\b(ristoran|pizz|trattori|osteria|pub|bistrot|sushi|hamburger|gastr|enoteca|kebab|poke|ramen|cucina|chef|menu|piatto)\b/.test(haystack)) return "food";

  return "food";
}

/* ─── Sub-sector detection con haystack ricco ─── */

export function detectSubSector(input: {
  name?: string | null;
  sector?: string | null;
  sectorLabel?: string | null;
  cuisine?: string | null;
  extra?: string | null;
  website?: string | null;
  openingHours?: string | null;
  types?: string[] | null;
}): { sub: SubSectorKey; isLuxury: boolean; sectorId: IndustryId } {
  const haystack = [
    input.name, input.sector, input.sectorLabel, input.cuisine,
    input.website, input.openingHours, input.extra,
    ...(input.types || []),
  ].filter(Boolean).join(" ").toLowerCase();

  const name = (input.name || "").toLowerCase();
  const sectorId = normalizeSector(input.sector, haystack);
  const isLuxury = /\b(gourmet|luxury|prive|exclusive|noir|black|gold|royal|prestige|premium|fine dining|stellato|michelin|signature)\b/.test(`${name} ${haystack}`);

  /* ── FOOD sub-sectors ── */
  // ⭐ Forziamo l'analisi food anche se sectorId è ambiguo ma il nome contiene segnali asiatici/specifici
  const hasAsianNameSignal = /\b(ninja|tokyo|osaka|kyoto|saigon|hanoi|seoul|bangkok|shanghai|beijing|pechino|wok|teppan|hibachi|chopstick|dragon|samurai|geisha|panda|tiger|lotus|bamboo)\b/.test(name);
  if (sectorId === "food" || hasAsianNameSignal || /\b(menu|piatto|chef|ristoran|trattoria|osteria|pizzeria|cucina)\b/.test(haystack)) {
    if (/\b(pizz(a|eria|aiolo)|napolet|forno a legna|margherita|marinara|trapizz|focacc)\b/.test(haystack)) return { sub: "pizzeria", isLuxury, sectorId: "food" };
    // ⭐ SUSHI: estesa con "ninja, tokyo, asian, fusion asiatic, wok, korean, thai, china, hibachi…"
    if (/\b(sushi|sashimi|ramen|nigiri|maki|temaki|giappones|japanese|izakaya|wagyu|omakase|hosomaki|uramaki|sake bar|ninja|tokyo|osaka|kyoto|teppan|hibachi|wok|asian fusion|asiatic|korean|coreano|thai|thailand|cinese|chinese|panda|dragon|samurai|geisha|lotus|bamboo|chopstick|tiger)\b/.test(haystack)) return { sub: "sushi", isLuxury, sectorId: "food" };
    if (/\b(braceri|steak|grill|fiorentin|bistecc|carne alla brace|smokehouse|barbecue|bbq|churrasc|asado|tagliata)\b/.test(haystack)) return { sub: "braceria", isLuxury, sectorId: "food" };
    if (/\b(kebab|doner|shawarma|kabap)\b/.test(haystack)) return { sub: "kebab", isLuxury, sectorId: "food" };
    // ⭐ PESCE: estesa con "ittico, ittiturismo, marinaro, frutti di mare, ostricheria, cozze, vongole, scoglio"
    if (/\b(pesce|fish|frutti di mare|crostacei|seafood|raw bar|ostriche|ostricheri|cevich|tartare di pesce|sea food|pescheria|ittic|ittituris|marinaro|alla marinara|cozze|vongole|allo scoglio|catalana|gambero|gamberetti|aragosta|astice|cantieri del mare)\b/.test(haystack)) return { sub: "pesce", isLuxury, sectorId: "food" };
    if (/\b(panett|fornai|panificio|bakery|pasticceria|cornett|brioche|lievit|forno|bread|croissant|dolci)\b/.test(haystack) || (input.sector || "").toLowerCase() === "bakery") return { sub: "bakery", isLuxury, sectorId: "food" };
    if (/\b(vietnam|pho|banh|saigon|hanoi|spring roll)\b/.test(haystack)) return { sub: "vietnamese", isLuxury, sectorId: "food" };
    if (/\b(kosher|jewish|kasher)\b/.test(haystack)) return { sub: "kosher", isLuxury, sectorId: "food" };
    if (/\b(gelater|gelato|ice cream|sorbet|sorbett|yogurt)\b/.test(haystack) || (input.sector || "").toLowerCase() === "gelateria") return { sub: "gelateria", isLuxury, sectorId: "food" };
    if (/\b(caffetter|coffee shop|caffè|espresso|specialty coffee|brunch|cappuccino|barista)\b/.test(haystack)) return { sub: "coffee", isLuxury, sectorId: "food" };
    if (/\b(wine bar|enotec|cantina|wine|vino|sommelier|degustazion|vineria)\b/.test(haystack) || (input.sector || "").toLowerCase() === "wine_bar") return { sub: "wine_bar", isLuxury, sectorId: "food" };
    if (/\b(pub|birrer|brewery|craft beer|birra artigian|tap room|gastropub|irish)\b/.test(haystack)) return { sub: "pub", isLuxury, sectorId: "food" };
    if (/\b(vegan|vegano|vegetarian|plant based|healthy|raw food|biologic|bio food|poke)\b/.test(haystack)) return { sub: "vegan", isLuxury, sectorId: "food" };
    if (/\b(burger|hamburger|smash|american diner|cheeseburg|fast food)\b/.test(haystack)) return { sub: "burger", isLuxury, sectorId: "food" };
    if (/\bosteria\b/.test(haystack)) return { sub: "osteria", isLuxury, sectorId: "food" };
    if (/\b(trattoria|cucina tipica|cucina casalinga|cucina tradizion|locanda)\b/.test(haystack)) return { sub: "trattoria", isLuxury, sectorId: "food" };
    return { sub: "ristorante", isLuxury, sectorId: "food" };
  }

  /* ── BEAUTY sub-sectors ── */
  if (sectorId === "beauty") {
    if (/\b(nail|unghie|manicure|pedicure|gel|semipermanent|onicotec)\b/.test(haystack)) return { sub: "nails", isLuxury, sectorId: "beauty" };
    if (/\b(barber|barbier|barbershop|rasatura)\b/.test(haystack) || (input.sector || "").toLowerCase() === "barber") return { sub: "barber", isLuxury, sectorId: "beauty" };
    if (/\b(spa|wellness|massagg|terme|hammam|sauna|benessere)\b/.test(haystack)) return { sub: "spa", isLuxury, sectorId: "beauty" };
    if (/\b(hair|capell|parrucch|tagli|colore|coiffure|salon|acconc)\b/.test(haystack)) return { sub: "hair", isLuxury, sectorId: "beauty" };
    return { sub: "hair", isLuxury, sectorId: "beauty" };
  }

  /* ── NCC sub-sectors ── */
  if (sectorId === "ncc") {
    if (/\b(yacht|charter|barca a vela|sail|crocier|cruise|asinara|sardin|gulet)\b/.test(haystack)) return { sub: "yacht", isLuxury, sectorId: "ncc" };
    if (/\b(boat|gommone|motoscaf|speedboat|jet ski|miami|noleggio barche|rental boat)\b/.test(haystack)) return { sub: "boats", isLuxury, sectorId: "ncc" };
    if (/\b(limousin|limo|stretch)\b/.test(haystack)) return { sub: "limo", isLuxury, sectorId: "ncc" };
    return { sub: "ncc", isLuxury, sectorId: "ncc" };
  }

  /* ── FITNESS sub-sectors ── */
  if (sectorId === "fitness") {
    if (/\b(padel|tennis|squash|racchet)\b/.test(haystack)) return { sub: "padel", isLuxury, sectorId: "fitness" };
    if (/\b(jet ski|surf|kite|sup|watersport|wakeboard|windsurf)\b/.test(haystack)) return { sub: "watersports", isLuxury, sectorId: "fitness" };
    if (/\b(yoga|pilates|meditazion|hot yoga)\b/.test(haystack)) return { sub: "yoga", isLuxury, sectorId: "fitness" };
    return { sub: "gym", isLuxury, sectorId: "fitness" };
  }

  /* ── HEALTHCARE sub-sectors ── */
  if (sectorId === "healthcare") {
    if (/\b(dent|odontoiatr|implantolog|ortodonz)\b/.test(haystack)) return { sub: "dentist", isLuxury, sectorId: "healthcare" };
    if (/\b(fisio|osteopat|chiropratic|riabilit)\b/.test(haystack)) return { sub: "physio", isLuxury, sectorId: "healthcare" };
    if (/\b(farmac|parafarmac)\b/.test(haystack)) return { sub: "pharmacy", isLuxury, sectorId: "healthcare" };
    if (/\b(ottic|occhial|lenti|optometr)\b/.test(haystack)) return { sub: "optics", isLuxury, sectorId: "healthcare" };
    return { sub: "clinic", isLuxury, sectorId: "healthcare" };
  }

  /* ── HOSPITALITY ── */
  if (sectorId === "hospitality") {
    if (/\b(b&b|bed and breakfast|b ?\& ?b|bnb|guest house)\b/.test(haystack)) return { sub: "bnb", isLuxury, sectorId: "hospitality" };
    return { sub: "hotel", isLuxury, sectorId: "hospitality" };
  }

  /* ── BEACH ── */
  if (sectorId === "beach") return { sub: "beach", isLuxury, sectorId: "beach" };

  /* ── RETAIL ── */
  if (sectorId === "retail") {
    if (/\b(gioiell|orefic|orologeri|argenter)\b/.test(haystack)) return { sub: "jewelry", isLuxury, sectorId: "retail" };
    if (/\b(boutique|atelier|alta moda|abbigliament)\b/.test(haystack)) return { sub: "boutique", isLuxury, sectorId: "retail" };
    return { sub: "shop", isLuxury, sectorId: "retail" };
  }

  /* ── CONSTRUCTION ── */
  if (sectorId === "construction") {
    if (/\b(architett|interior design|design interni|progettaz)\b/.test(haystack)) return { sub: "architect", isLuxury, sectorId: "construction" };
    if (/\b(immobiliar|real estate|agenzia immob)\b/.test(haystack)) return { sub: "real_estate", isLuxury, sectorId: "construction" };
    return { sub: "construction", isLuxury, sectorId: "construction" };
  }

  /* ── Catch-all per il settore rilevato ── */
  const map: Partial<Record<IndustryId, SubSectorKey>> = {
    plumber: "plumber", electrician: "electrician", garage: "garage",
    veterinary: "veterinary", tattoo: "tattoo", photography: "photography",
    education: "education", events: "events", logistics: "logistics",
    legal: "legal", accounting: "accounting", cleaning: "cleaning",
    gardening: "gardening", childcare: "childcare", agriturismo: "agriturismo",
  };
  const sub = map[sectorId] || "default";
  return { sub, isLuxury, sectorId };
}

/* ─── Sub-sector → preview target ─── */

const SUB_TO_TARGET: Partial<Record<SubSectorKey, PreviewTarget>> = {
  /* FOOD: solo brand REALMENTE presenti nel portfolio */
  pizzeria:    { sectorId: "food", brandKeywords: ["cote miami"],          styleKeywords: ["ivory", "marble"],                  templateVariant: "strapizzami",      demoSlug: "strapizzami-roma" },
  sushi:       { sectorId: "food", brandKeywords: ["paperfish"],           styleKeywords: ["sakura", "luxury dark", "miami"],   templateVariant: "paperfish-sakura", demoSlug: "paperfish-sushi" },
  braceria:    { sectorId: "food", brandKeywords: ["cote miami"],          styleKeywords: ["obsidian", "joseon", "hanok"],      templateVariant: "cote-obsidian",    demoSlug: "impero-roma" },
  pesce:       { sectorId: "food", brandKeywords: ["batey", "paperfish"],  styleKeywords: ["costa pacifico", "casa nostra", "miami ocean"], templateVariant: "batey-pacifico", demoSlug: "batey-pacifico" },
  bakery:      { sectorId: "food", brandKeywords: ["cote miami"],          styleKeywords: ["ivory", "marble"],                  templateVariant: "cote-ivory",       demoSlug: "impero-roma" },
  vietnamese:  { sectorId: "food", brandKeywords: ["la vang"],             styleKeywords: ["noir saigon", "obsidian gold"],     templateVariant: "lavang-noir",      demoSlug: "impero-roma" },
  kosher:      { sectorId: "food", brandKeywords: ["midtown kosher"],      styleKeywords: ["style a", "style b"],               templateVariant: "midtown-kosher",   demoSlug: "impero-roma" },
  kebab:       { sectorId: "food", brandKeywords: ["flame kebab"],         styleKeywords: ["default"],                          templateVariant: "default",          demoSlug: "impero-roma" },
  gelateria:   { sectorId: "food", brandKeywords: ["cote miami"],          styleKeywords: ["marble", "ivory"],                  templateVariant: "cote-ivory",       demoSlug: "impero-roma" },
  coffee:      { sectorId: "food", brandKeywords: ["cote miami"],          styleKeywords: ["ivory", "marble"],                  templateVariant: "cote-ivory",       demoSlug: "impero-roma" },
  wine_bar:    { sectorId: "food", brandKeywords: ["paperfish"],           styleKeywords: ["luxury dark"],                      templateVariant: "paperfish-dark",   demoSlug: "impero-roma" },
  pub:         { sectorId: "food", brandKeywords: ["cote miami"],          styleKeywords: ["obsidian"],                         templateVariant: "cote-obsidian",    demoSlug: "impero-roma" },
  vegan:       { sectorId: "food", brandKeywords: ["cote miami"],          styleKeywords: ["marble"],                           templateVariant: "cote-ivory",       demoSlug: "impero-roma" },
  burger:      { sectorId: "food", brandKeywords: ["cote miami"],          styleKeywords: ["obsidian"],                         templateVariant: "cote-obsidian",    demoSlug: "impero-roma" },
  trattoria:   { sectorId: "food", brandKeywords: ["cote miami"],          styleKeywords: ["ivory"],                            templateVariant: "cote-ivory",       demoSlug: "impero-roma" },
  osteria:     { sectorId: "food", brandKeywords: ["cote miami"],          styleKeywords: ["ivory", "marble"],                  templateVariant: "cote-ivory",       demoSlug: "impero-roma" },
  ristorante:  { sectorId: "food", brandKeywords: ["cote miami"],          styleKeywords: ["ivory", "marble", "obsidian"],      templateVariant: "cote-ivory",       demoSlug: "impero-roma" },

  /* BEAUTY */
  nails:       { sectorId: "beauty", brandKeywords: ["neo nails"],         styleKeywords: ["lavender luxe", "blush rosegold"],  templateVariant: "neo-nails-lavender", demoSlug: "glow-beauty-milano" },
  hair:        { sectorId: "beauty", brandKeywords: ["tatush"],            styleKeywords: ["mobile", "desktop"],                templateVariant: "tatush-hair",        demoSlug: "glow-beauty-milano" },
  barber:      { sectorId: "beauty", brandKeywords: ["tatush"],            styleKeywords: ["mobile"],                           templateVariant: "tatush-hair",        demoSlug: "glow-beauty-milano" },
  spa:         { sectorId: "beauty", brandKeywords: ["neo nails"],         styleKeywords: ["lavender luxe"],                    templateVariant: "neo-nails-lavender", demoSlug: "glow-beauty-milano" },

  /* NCC */
  yacht:       { sectorId: "ncc", brandKeywords: ["asinara"],              styleKeywords: ["sardinia azure", "emerald cove", "golden sunset"], templateVariant: "asinara-azure", demoSlug: "amalfi-luxury-transfer" },
  boats:       { sectorId: "ncc", brandKeywords: ["miami boats"],          styleKeywords: ["style a", "style c"],               templateVariant: "miami-boats",        demoSlug: "amalfi-luxury-transfer" },
  ncc:         { sectorId: "ncc", brandKeywords: ["asinara", "miami boats"], styleKeywords: ["sardinia azure", "style a"],     templateVariant: "asinara-azure",      demoSlug: "amalfi-luxury-transfer" },
  limo:        { sectorId: "ncc", brandKeywords: ["miami boats"],          styleKeywords: ["style a"],                          templateVariant: "miami-boats",        demoSlug: "amalfi-luxury-transfer" },

  /* FITNESS */
  padel:       { sectorId: "fitness", brandKeywords: ["city padel"],       styleKeywords: ["sage luxe", "fresh azzurro"],       templateVariant: "city-padel-sage",    demoSlug: "fitness-club-roma" },
  watersports: { sectorId: "fitness", brandKeywords: ["miami watersports"], styleKeywords: ["style a", "style g"],              templateVariant: "miami-watersports",  demoSlug: "fitness-club-roma" },
  gym:         { sectorId: "fitness", brandKeywords: ["city padel"],       styleKeywords: ["urban concrete", "lime minimal"],   templateVariant: "city-padel-sage",    demoSlug: "fitness-club-roma" },
  yoga:        { sectorId: "fitness", brandKeywords: ["city padel"],       styleKeywords: ["sage luxe", "citylife green"],      templateVariant: "city-padel-sage",    demoSlug: "fitness-club-roma" },

  /* HEALTHCARE */
  dentist:     { sectorId: "healthcare", brandKeywords: ["far medical"],   styleKeywords: ["ethereal glass", "ice crystal"],    templateVariant: "default", demoSlug: "" },
  physio:      { sectorId: "healthcare", brandKeywords: ["far medical"],   styleKeywords: ["azure gradient", "soft blue"],      templateVariant: "default", demoSlug: "" },
  pharmacy:    { sectorId: "healthcare", brandKeywords: ["far medical"],   styleKeywords: ["soft blue", "ice crystal"],         templateVariant: "default", demoSlug: "" },
  optics:      { sectorId: "healthcare", brandKeywords: ["far medical"],   styleKeywords: ["ethereal glass"],                   templateVariant: "default", demoSlug: "" },
  clinic:      { sectorId: "healthcare", brandKeywords: ["far medical"],   styleKeywords: ["ethereal glass", "azure gradient"], templateVariant: "default", demoSlug: "" },

  /* HOSPITALITY (riusa Asinara/Miami Boats che sono nel portfolio "hospitality") */
  hotel:       { sectorId: "hospitality", brandKeywords: ["asinara"],      styleKeywords: ["sardinia azure"],                   templateVariant: "asinara-azure", demoSlug: "" },
  bnb:         { sectorId: "hospitality", brandKeywords: ["asinara"],      styleKeywords: ["sardinia azure"],                   templateVariant: "asinara-azure", demoSlug: "" },

  /* CONSTRUCTION */
  construction:{ sectorId: "construction", brandKeywords: ["mmi resident"], styleKeywords: ["ocean azure", "ice blue"],         templateVariant: "default", demoSlug: "" },
  architect:   { sectorId: "construction", brandKeywords: ["mmi resident"], styleKeywords: ["rose gold", "living coral"],       templateVariant: "default", demoSlug: "" },
  real_estate: { sectorId: "construction", brandKeywords: ["mmi resident"], styleKeywords: ["ocean azure"],                     templateVariant: "default", demoSlug: "" },

  /* PLUMBER / ARTIGIANI */
  plumber:     { sectorId: "plumber", brandKeywords: ["nick"],             styleKeywords: ["style a", "style b"],               templateVariant: "default", demoSlug: "" },
  electrician: { sectorId: "plumber", brandKeywords: ["nick"],             styleKeywords: ["style b", "style a"],               templateVariant: "default", demoSlug: "" },
  garage:      { sectorId: "plumber", brandKeywords: ["nick"],             styleKeywords: ["style a"],                          templateVariant: "default", demoSlug: "" },

  /* RETAIL */
  shop:        { sectorId: "retail", brandKeywords: ["tatush"],            styleKeywords: ["mobile"],                           templateVariant: "tatush-hair", demoSlug: "" },
  boutique:    { sectorId: "retail", brandKeywords: ["tatush"],            styleKeywords: ["mobile", "desktop"],                templateVariant: "tatush-hair", demoSlug: "" },
  jewelry:     { sectorId: "retail", brandKeywords: ["tatush"],            styleKeywords: ["mobile"],                           templateVariant: "tatush-hair", demoSlug: "" },

  /* VETERINARY */
  veterinary:  { sectorId: "veterinary", brandKeywords: ["aloha pet"],     styleKeywords: ["style a", "style e", "style f"],    templateVariant: "default", demoSlug: "" },
  petshop:     { sectorId: "veterinary", brandKeywords: ["aloha pet"],     styleKeywords: ["style g"],                          templateVariant: "default", demoSlug: "" },

  /* CHILDCARE */
  childcare:   { sectorId: "childcare", brandKeywords: ["little diamond", "ashley"], styleKeywords: ["playful colorful", "nature explorer", "style a"], templateVariant: "default", demoSlug: "" },

  /* BEACH */
  beach:       { sectorId: "beach", brandKeywords: ["miami watersports"],  styleKeywords: ["style a"],                          templateVariant: "miami-watersports", demoSlug: "" },

  /* AGRITURISMO → riusa Asinara (paesaggio sardo) */
  agriturismo: { sectorId: "hospitality", brandKeywords: ["asinara"],      styleKeywords: ["emerald cove", "golden sunset"],    templateVariant: "asinara-azure", demoSlug: "" },
};

const RECOMMENDED_PROJECT_SUBSECTOR: Record<string, SubSectorKey> = {
  "cote miami": "braceria",
  "paperfish sushi": "sushi",
  "flame kebab": "kebab",
  "la vang vietnamese": "vietnamese",
  "batey cevicheria": "pesce",
  "neo nails brickell": "nails",
  "tatush hair & fragrance": "hair",
  "amalfi luxury transfer": "ncc",
  "miami boats rental": "boats",
  "asinara charter": "yacht",
  "city padel milano": "padel",
  "far medical center": "clinic",
  "aloha pet resort": "veterinary",
  "little diamond nursery": "childcare",
  "ashley's playhouse": "childcare",
  "miami watersports": "beach",
  "nick's plumbing & ac": "plumber",
  "premium store": "shop",
  "elite electrical": "electrician",
  "ink masters studio": "tattoo",
  "speed auto service": "garage",
  "vision photography": "photography",
  "premium costruzioni": "construction",
  "verde & giardini": "gardening",
  "tuscan country estate": "agriturismo",
  "elite events": "events",
  "academy pro": "education",
  "fasttrack logistics": "logistics",
  "premium clean": "cleaning",
  "studio legale associato": "legal",
  "studio commercialista pro": "accounting",
};

/* ─── Brand & style lookup tolleranti ─── */

function brandMatches(brand: MockupBrand, keywords: string[]): boolean {
  const bn = brand.name.toLowerCase();
  return keywords.some((kw) => {
    const k = kw.toLowerCase().trim();
    if (!k) return false;
    if (bn === k || bn.includes(k) || k.includes(bn)) return true;
    // match della prima parola (es. "tatush" matcha "Tatush Hair Fragrance")
    const first = k.split(" ")[0];
    return first.length >= 4 && bn.startsWith(first);
  });
}

function findBrandInPortfolio(portfolio: SectorPortfolio | undefined, brandKeywords: string[]): MockupBrand | undefined {
  if (!portfolio) return undefined;
  for (const kw of brandKeywords) {
    const found = portfolio.brands.find((b) => brandMatches(b, [kw]));
    if (found) return found;
  }
  return undefined;
}

function pickStyle(brand: MockupBrand, styleKeywords: string[]) {
  for (const kw of styleKeywords) {
    const k = kw.toLowerCase();
    const style = brand.styles.find((s) => s.name.toLowerCase().includes(k));
    if (style?.screens?.length) return style;
  }
  return brand.styles.find((s) => s.screens?.length);
}

function getFlatSectorScreens(sectorId: IndustryId): string[] {
  const flat = SECTOR_MOCKUP_IMAGES[sectorId as keyof typeof SECTOR_MOCKUP_IMAGES];
  if (flat?.length) return flat.slice(0, 4);
  const parent = SECTOR_PARENT[sectorId];
  if (parent) {
    const parentFlat = SECTOR_MOCKUP_IMAGES[parent as keyof typeof SECTOR_MOCKUP_IMAGES];
    if (parentFlat?.length) return parentFlat.slice(0, 4);
  }
  return [];
}

function getAnyBrandFromSector(sectorId: IndustryId): { brand?: MockupBrand; portfolio?: SectorPortfolio } {
  const portfolio = SECTOR_PORTFOLIO.find((sp) => sp.sectorId === sectorId);
  if (portfolio?.brands?.length) {
    const brand = portfolio.brands.find((b) => b.styles?.some((s) => s.screens?.length));
    return { brand, portfolio };
  }
  const parent = SECTOR_PARENT[sectorId];
  if (parent) {
    const pPortfolio = SECTOR_PORTFOLIO.find((sp) => sp.sectorId === parent);
    const brand = pPortfolio?.brands?.find((b) => b.styles?.some((s) => s.screens?.length));
    return { brand, portfolio: pPortfolio };
  }
  return {};
}

function resolvePreviewFromTarget(sub: SubSectorKey, sectorId: IndustryId, target?: PreviewTarget): PreviewMatch | null {
  if (target) {
    const portfolio = SECTOR_PORTFOLIO.find((sp) => sp.sectorId === target.sectorId);
    const brand = findBrandInPortfolio(portfolio, target.brandKeywords);
    if (brand) {
      const style = pickStyle(brand, target.styleKeywords);
      const screens = (style?.screens || []).slice(0, 4);
      if (screens.length) {
        return {
          sectorId: target.sectorId,
          subSector: sub,
          brandName: brand.name,
          styleName: style?.name || target.styleKeywords[0] || "Default",
          screens,
          templateVariant: target.templateVariant,
          demoSlug: target.demoSlug,
        };
      }
    }
  }

  const { brand: anyBrand, portfolio: anyPortfolio } = getAnyBrandFromSector(sectorId);
  if (anyBrand && anyPortfolio) {
    const style = anyBrand.styles.find((s) => s.screens?.length);
    const screens = (style?.screens || []).slice(0, 4);
    if (screens.length) {
      return {
        sectorId: anyPortfolio.sectorId,
        subSector: sub,
        brandName: anyBrand.name,
        styleName: style?.name || "Default",
        screens,
        templateVariant: target?.templateVariant || "default",
        demoSlug: target?.demoSlug || "",
      };
    }
  }

  return null;
}

/* ─── Main matcher ─── */

export function matchPreviewForLead(input: {
  name?: string | null;
  sector?: string | null;
  sectorLabel?: string | null;
  cuisine?: string | null;
  extra?: string | null;
  website?: string | null;
  openingHours?: string | null;
  types?: string[] | null;
}): PreviewMatch {
  const { sub, isLuxury, sectorId } = detectSubSector(input);

  // 1) Target preferito dal sub-sector
  let target = SUB_TO_TARGET[sub];

  // Boost luxury: se sushi luxury → priorità Luxury Dark; se braceria luxury → Obsidian
  if (target && isLuxury) {
    if (sub === "sushi") target = { ...target, styleKeywords: ["luxury dark", ...target.styleKeywords] };
    if (sub === "wine_bar") target = { ...target, styleKeywords: ["luxury dark", ...target.styleKeywords] };
    if (sub === "ristorante" || sub === "trattoria" || sub === "osteria") {
      target = { ...target, styleKeywords: ["obsidian", "marble", ...target.styleKeywords] };
    }
  }

  const resolved = resolvePreviewFromTarget(sub, sectorId, target);
  if (resolved) return resolved;

  // 4) Ultimo fallback: flat array del settore
  const flat = getFlatSectorScreens(sectorId);
  return {
    sectorId, subSector: sub,
    brandName: target?.brandKeywords[0] ? toTitle(target.brandKeywords[0]) : "Empire Demo",
    styleName: "Sector Demo", screens: flat,
    templateVariant: target?.templateVariant || "default",
    demoSlug: target?.demoSlug || "",
  };
}

function toTitle(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getPreviewScreensForLead(input: Parameters<typeof matchPreviewForLead>[0]): string[] {
  return matchPreviewForLead(input).screens;
}

export function matchPreviewFromRecommendedProject(input: {
  projectName?: string | null;
  reason?: string | null;
  sector?: string | null;
  sectorLabel?: string | null;
}): PreviewMatch | null {
  const projectKey = (input.projectName || "").trim().toLowerCase();
  const mappedSub = projectKey ? RECOMMENDED_PROJECT_SUBSECTOR[projectKey] : undefined;
  if (mappedSub) {
    const { sectorId } = detectSubSector({
      name: input.projectName,
      sector: input.sector,
      sectorLabel: input.sectorLabel,
      extra: input.reason,
    });
    const target = SUB_TO_TARGET[mappedSub];
    return resolvePreviewFromTarget(mappedSub, target?.sectorId || sectorId, target) || matchPreviewForLead({
      name: input.projectName,
      sector: input.sector,
      sectorLabel: input.sectorLabel,
      extra: input.reason,
    });
  }

  if (!input.projectName && !input.reason) return null;

  return matchPreviewForLead({
    name: input.projectName,
    sector: input.sector,
    sectorLabel: input.sectorLabel,
    extra: input.reason,
  });
}

export function matchPreviewFromManualSelection(input: {
  sectorId?: string | null;
  brandName?: string | null;
  styleName?: string | null;
  imageUrl?: string | null;
}): PreviewMatch | null {
  const sectorId = normalizeSector(input.sectorId);
  const portfolio = SECTOR_PORTFOLIO.find((entry) => entry.sectorId === sectorId);
  const brand = portfolio?.brands.find((entry) => entry.name.toLowerCase() === (input.brandName || "").toLowerCase())
    || portfolio?.brands.find((entry) => brandMatches(entry, [input.brandName || ""]));
  const style = brand?.styles.find((entry) => entry.name.toLowerCase() === (input.styleName || "").toLowerCase())
    || brand?.styles.find((entry) => entry.name.toLowerCase().includes((input.styleName || "").toLowerCase()));

  if (brand && style?.screens?.length) {
    const inferred = matchPreviewForLead({
      name: `${brand.name} ${style.name}`,
      sector: sectorId,
      sectorLabel: sectorId,
    });
    return {
      sectorId,
      subSector: inferred.subSector,
      brandName: brand.name,
      styleName: style.name,
      screens: style.screens.slice(0, 4),
      templateVariant: inferred.templateVariant,
      demoSlug: inferred.demoSlug,
    };
  }

  if (input.brandName || input.styleName) {
    return matchPreviewForLead({
      name: `${input.brandName || ""} ${input.styleName || ""}`.trim(),
      sector: sectorId,
      sectorLabel: sectorId,
    });
  }

  return null;
}
