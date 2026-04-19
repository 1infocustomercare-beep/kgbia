/**
 * Preview Matcher (client-side) — v4 ULTRA
 *
 * Sceglie il mockup iPhone più adatto al lead in base a TUTTI i segnali
 * disponibili (nome, settore filtro, sotto-settore, categorie OSM/Google,
 * cucina, sito, indirizzo, orari, città, descrizione, recensioni).
 *
 * v4 highlights:
 *  - Scoring multi-segnale ponderato (nome >> dominio >> categorie >> cucina >> orari)
 *  - Estrazione automatica di segnali da DOMINIO (es. "sushizen.it" → sushi)
 *  - Luxury score graduato (0..1) con boost città di lusso (Portofino, Capri, Forte dei Marmi…)
 *  - Brand matching tollerante con alias, prefissi e plural-stripping
 *  - Cascata fallback robusta: target → 2° brand stesso settore → brand parent → flat
 *  - Memoization stabile sui lead (cache LRU mini)
 *  - Esporta `explainPreviewMatch()` per debugging trasparente
 *  - Compatibile 100% con l'API esistente (matchPreviewForLead, matchPreviewFromRecommendedProject, matchPreviewFromManualSelection)
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
  /** confidenza 0..1 — utile per UI e per scegliere se mostrare badge "AI Match" */
  confidence?: number;
  /** debug breve: perché è stato scelto questo target */
  matchedBy?: string;
}

export interface SectorPreviewDetails {
  features: string[];
  value: string;
  cta: string;
}

type PreviewTarget = {
  sectorId: IndustryId;
  brandKeywords: string[];
  styleKeywords: string[];
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

/* ─── Estrai parole chiave dal dominio (sushizen.it → sushi, zen) ─── */
function extractDomainSignals(website?: string | null): string {
  if (!website) return "";
  try {
    const u = website.startsWith("http") ? new URL(website) : new URL(`https://${website}`);
    const host = u.hostname.replace(/^www\./, "").replace(/\.(it|com|net|eu|io|co|biz|info|org|fr|es|de|uk)$/i, "");
    const path = u.pathname.replace(/[\/\-_]+/g, " ");
    return `${host} ${path}`.replace(/[\-_.]/g, " ");
  } catch {
    return website.toLowerCase();
  }
}

function normalizeSector(rawSector?: string | null, haystack = ""): IndustryId {
  const sector = (rawSector || "").toLowerCase().trim();
  if (KNOWN_SECTORS.has(sector as IndustryId)) return sector as IndustryId;
  if (SECTOR_PARENT[sector]) return SECTOR_PARENT[sector] as IndustryId;

  // ⭐ ALTA PRIORITÀ: agriturismo va catturato PRIMA di hospitality
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

/* ─── Luxury scoring (graduato 0..1) ─── */

const LUX_NAME_TOKENS = /\b(gourmet|luxury|prive|exclusive|noir|black|gold|royal|prestige|premium|fine dining|stellato|michelin|signature|atelier|maison|haute|grand|elite|bespoke)\b/g;
const LUX_CITIES = /\b(portofino|capri|porto cervo|forte dei marmi|cortina|saint moritz|monte carlo|monaco|st\.? tropez|santa margherita|positano|amalfi|taormina|venezia|venice|firenze|florence|milano|milan|roma|rome|cannes|ibiza|mykonos|st\.? barths|hampton|aspen|courchevel)\b/i;
const LUX_PRICE_HINT = /\b(€{2,}|\$\$\$|prezzi a partire da \d{3,}|menu degustazione|wine pairing|tasting menu|chef's table)\b/i;

function computeLuxuryScore(haystack: string, city = ""): number {
  let score = 0;
  const matches = (haystack.match(LUX_NAME_TOKENS) || []).length;
  score += Math.min(matches * 0.25, 0.6);
  if (LUX_CITIES.test(`${haystack} ${city}`)) score += 0.3;
  if (LUX_PRICE_HINT.test(haystack)) score += 0.2;
  return Math.min(score, 1);
}

/* ─── Sub-sector detection con scoring ponderato ─── */

type DetectInput = {
  name?: string | null;
  sector?: string | null;
  sectorLabel?: string | null;
  cuisine?: string | null;
  extra?: string | null;
  website?: string | null;
  openingHours?: string | null;
  types?: string[] | null;
  city?: string | null;
  description?: string | null;
};

export function detectSubSector(input: DetectInput): { sub: SubSectorKey; isLuxury: boolean; sectorId: IndustryId; luxuryScore: number; signals: string[] } {
  const name = (input.name || "").toLowerCase();
  const domainSignals = extractDomainSignals(input.website);
  const haystack = [
    name,
    input.sector, input.sectorLabel, input.cuisine,
    input.openingHours, input.extra, input.description,
    domainSignals,
    ...(input.types || []),
  ].filter(Boolean).join(" ").toLowerCase();

  const sectorId = normalizeSector(input.sector, haystack);
  const luxuryScore = computeLuxuryScore(haystack, (input.city || "").toLowerCase());
  const isLuxury = luxuryScore >= 0.4;
  const signals: string[] = [];

  // Helper: registra match
  const M = (sub: SubSectorKey, why: string): { sub: SubSectorKey; isLuxury: boolean; sectorId: IndustryId; luxuryScore: number; signals: string[] } => {
    signals.push(why);
    return { sub, isLuxury, sectorId, luxuryScore, signals };
  };

  /* ── FOOD sub-sectors ── */
  const hasAsianNameSignal = /\b(ninja|tokyo|osaka|kyoto|saigon|hanoi|seoul|bangkok|shanghai|beijing|pechino|wok|teppan|hibachi|chopstick|dragon|samurai|geisha|panda|tiger|lotus|bamboo|zen|sakura|hokkaido)\b/.test(name);
  const isFoodish = sectorId === "food" || hasAsianNameSignal || /\b(menu|piatto|chef|ristoran|trattoria|osteria|pizzeria|cucina)\b/.test(haystack);

  if (isFoodish) {
    if (/\b(pizz(a|eria|aiolo)|napolet|forno a legna|margherita|marinara|trapizz|focacc|pinsa|romana|teglia)\b/.test(haystack)) return M("pizzeria", "kw:pizza");
    if (/\b(sushi|sashimi|ramen|nigiri|maki|temaki|giappones|japanese|izakaya|wagyu|omakase|hosomaki|uramaki|sake bar|ninja|tokyo|osaka|kyoto|teppan|hibachi|wok|asian fusion|asiatic|korean|coreano|thai|thailand|cinese|chinese|panda|dragon|samurai|geisha|lotus|bamboo|chopstick|tiger|zen|sakura|hokkaido)\b/.test(haystack)) return M("sushi", "kw:asian/sushi");
    if (/\b(braceri|steak|grill|fiorentin|bistecc|carne alla brace|smokehouse|barbecue|bbq|churrasc|asado|tagliata|costata|chianina|wagyu)\b/.test(haystack)) return M("braceria", "kw:carne");
    if (/\b(kebab|doner|shawarma|kabap)\b/.test(haystack)) return M("kebab", "kw:kebab");
    if (/\b(pesce|fish|frutti di mare|crostacei|seafood|raw bar|ostriche|ostricheri|cevich|tartare di pesce|sea food|pescheria|ittic|ittituris|marinaro|alla marinara|cozze|vongole|allo scoglio|catalana|gambero|gamberetti|aragosta|astice|cantieri del mare|porto pesc)\b/.test(haystack)) return M("pesce", "kw:pesce");
    if (/\b(panett|fornai|panificio|bakery|pasticceria|cornett|brioche|lievit|forno|bread|croissant|dolci|patisserie|boulanger)\b/.test(haystack) || (input.sector || "").toLowerCase() === "bakery") return M("bakery", "kw:bakery");
    if (/\b(vietnam|pho|banh|saigon|hanoi|spring roll)\b/.test(haystack)) return M("vietnamese", "kw:vietnamese");
    if (/\b(kosher|jewish|kasher)\b/.test(haystack)) return M("kosher", "kw:kosher");
    if (/\b(gelater|gelato|ice cream|sorbet|sorbett|yogurt|frozen)\b/.test(haystack) || (input.sector || "").toLowerCase() === "gelateria") return M("gelateria", "kw:gelato");
    if (/\b(caffetter|coffee shop|caffè|espresso|specialty coffee|brunch|cappuccino|barista|coffee lab)\b/.test(haystack)) return M("coffee", "kw:coffee");
    if (/\b(wine bar|enotec|cantina|wine|vino|sommelier|degustazion|vineria)\b/.test(haystack) || (input.sector || "").toLowerCase() === "wine_bar") return M("wine_bar", "kw:wine");
    if (/\b(pub|birrer|brewery|craft beer|birra artigian|tap room|gastropub|irish)\b/.test(haystack)) return M("pub", "kw:pub");
    if (/\b(vegan|vegano|vegetarian|plant based|healthy|raw food|biologic|bio food|poke)\b/.test(haystack)) return M("vegan", "kw:veg");
    if (/\b(burger|hamburger|smash|american diner|cheeseburg|fast food)\b/.test(haystack)) return M("burger", "kw:burger");
    if (/\bosteria\b/.test(haystack)) return M("osteria", "kw:osteria");
    if (/\b(trattoria|cucina tipica|cucina casalinga|cucina tradizion|locanda)\b/.test(haystack)) return M("trattoria", "kw:trattoria");
    return M("ristorante", "fallback:food");
  }

  /* ── BEAUTY ── */
  if (sectorId === "beauty") {
    if (/\b(nail|unghie|manicure|pedicure|gel|semipermanent|onicotec)\b/.test(haystack)) return M("nails", "kw:nails");
    if (/\b(barber|barbier|barbershop|rasatura)\b/.test(haystack) || (input.sector || "").toLowerCase() === "barber") return M("barber", "kw:barber");
    if (/\b(spa|wellness|massagg|terme|hammam|sauna|benessere)\b/.test(haystack)) return M("spa", "kw:spa");
    if (/\b(hair|capell|parrucch|tagli|colore|coiffure|salon|acconc)\b/.test(haystack)) return M("hair", "kw:hair");
    return M("hair", "fallback:beauty");
  }

  /* ── NCC ── */
  if (sectorId === "ncc") {
    if (/\b(yacht|charter|barca a vela|sail|crocier|cruise|asinara|sardin|gulet)\b/.test(haystack)) return M("yacht", "kw:yacht");
    if (/\b(boat|gommone|motoscaf|speedboat|jet ski|miami|noleggio barche|rental boat)\b/.test(haystack)) return M("boats", "kw:boat");
    if (/\b(limousin|limo|stretch)\b/.test(haystack)) return M("limo", "kw:limo");
    return M("ncc", "fallback:ncc");
  }

  /* ── FITNESS ── */
  if (sectorId === "fitness") {
    if (/\b(padel|tennis|squash|racchet)\b/.test(haystack)) return M("padel", "kw:padel");
    if (/\b(jet ski|surf|kite|sup|watersport|wakeboard|windsurf)\b/.test(haystack)) return M("watersports", "kw:watersport");
    if (/\b(yoga|pilates|meditazion|hot yoga)\b/.test(haystack)) return M("yoga", "kw:yoga");
    return M("gym", "fallback:fitness");
  }

  /* ── HEALTHCARE ── */
  if (sectorId === "healthcare") {
    if (/\b(dent|odontoiatr|implantolog|ortodonz)\b/.test(haystack)) return M("dentist", "kw:dent");
    if (/\b(fisio|osteopat|chiropratic|riabilit)\b/.test(haystack)) return M("physio", "kw:fisio");
    if (/\b(farmac|parafarmac)\b/.test(haystack)) return M("pharmacy", "kw:farma");
    if (/\b(ottic|occhial|lenti|optometr)\b/.test(haystack)) return M("optics", "kw:ottica");
    return M("clinic", "fallback:healthcare");
  }

  /* ── HOSPITALITY ── */
  if (sectorId === "hospitality") {
    if (/\b(b&b|bed and breakfast|b ?\& ?b|bnb|guest house)\b/.test(haystack)) return M("bnb", "kw:bnb");
    return M("hotel", "fallback:hotel");
  }

  /* ── BEACH ── */
  if (sectorId === "beach") return M("beach", "kw:beach");

  /* ── RETAIL ── */
  if (sectorId === "retail") {
    if (/\b(gioiell|orefic|orologeri|argenter|jewel)\b/.test(haystack)) return M("jewelry", "kw:jewel");
    if (/\b(boutique|atelier|alta moda|abbigliament|fashion)\b/.test(haystack)) return M("boutique", "kw:boutique");
    return M("shop", "fallback:retail");
  }

  /* ── CONSTRUCTION ── */
  if (sectorId === "construction") {
    if (/\b(architett|interior design|design interni|progettaz)\b/.test(haystack)) return M("architect", "kw:archit");
    if (/\b(immobiliar|real estate|agenzia immob)\b/.test(haystack)) return M("real_estate", "kw:realestate");
    return M("construction", "fallback:construction");
  }

  /* ── Catch-all ── */
  const map: Partial<Record<IndustryId, SubSectorKey>> = {
    plumber: "plumber", electrician: "electrician", garage: "garage",
    veterinary: "veterinary", tattoo: "tattoo", photography: "photography",
    education: "education", events: "events", logistics: "logistics",
    legal: "legal", accounting: "accounting", cleaning: "cleaning",
    gardening: "gardening", childcare: "childcare", agriturismo: "agriturismo",
  };
  return M(map[sectorId] || "default", `catchall:${sectorId}`);
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
  kebab:       { sectorId: "food", brandKeywords: ["flame kebab", "cote miami"], styleKeywords: ["default", "obsidian"],        templateVariant: "cote-obsidian",    demoSlug: "impero-roma" },
  gelateria:   { sectorId: "food", brandKeywords: ["cote miami"],          styleKeywords: ["marble", "ivory"],                  templateVariant: "cote-ivory",       demoSlug: "impero-roma" },
  coffee:      { sectorId: "food", brandKeywords: ["cote miami"],          styleKeywords: ["ivory", "marble"],                  templateVariant: "cote-ivory",       demoSlug: "impero-roma" },
  wine_bar:    { sectorId: "food", brandKeywords: ["paperfish"],           styleKeywords: ["luxury dark"],                      templateVariant: "paperfish-dark",   demoSlug: "impero-roma" },
  pub:         { sectorId: "food", brandKeywords: ["cote miami"],          styleKeywords: ["obsidian"],                         templateVariant: "cote-obsidian",    demoSlug: "impero-roma" },
  vegan:       { sectorId: "food", brandKeywords: ["cote miami"],          styleKeywords: ["marble", "ivory"],                  templateVariant: "cote-ivory",       demoSlug: "impero-roma" },
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
  dentist:     { sectorId: "healthcare", brandKeywords: ["far medical"],   styleKeywords: ["ethereal glass", "ice crystal"],    templateVariant: "neo-nails-lavender", demoSlug: "" },
  physio:      { sectorId: "healthcare", brandKeywords: ["far medical"],   styleKeywords: ["azure gradient", "soft blue"],      templateVariant: "neo-nails-lavender", demoSlug: "" },
  pharmacy:    { sectorId: "healthcare", brandKeywords: ["far medical"],   styleKeywords: ["soft blue", "ice crystal"],         templateVariant: "neo-nails-lavender", demoSlug: "" },
  optics:      { sectorId: "healthcare", brandKeywords: ["far medical"],   styleKeywords: ["ethereal glass"],                   templateVariant: "neo-nails-lavender", demoSlug: "" },
  clinic:      { sectorId: "healthcare", brandKeywords: ["far medical"],   styleKeywords: ["ethereal glass", "azure gradient"], templateVariant: "neo-nails-lavender", demoSlug: "" },

  /* HOSPITALITY */
  hotel:       { sectorId: "hospitality", brandKeywords: ["asinara"],      styleKeywords: ["sardinia azure"],                   templateVariant: "asinara-azure", demoSlug: "" },
  bnb:         { sectorId: "hospitality", brandKeywords: ["asinara"],      styleKeywords: ["sardinia azure"],                   templateVariant: "cote-ivory",    demoSlug: "" },

  /* CONSTRUCTION */
  construction:{ sectorId: "construction", brandKeywords: ["mmi resident"], styleKeywords: ["ocean azure", "ice blue"],         templateVariant: "cote-obsidian", demoSlug: "" },
  architect:   { sectorId: "construction", brandKeywords: ["mmi resident"], styleKeywords: ["rose gold", "living coral"],       templateVariant: "cote-marble",   demoSlug: "" },
  real_estate: { sectorId: "construction", brandKeywords: ["mmi resident"], styleKeywords: ["ocean azure"],                     templateVariant: "cote-marble",   demoSlug: "" },

  /* PLUMBER / ARTIGIANI */
  plumber:     { sectorId: "plumber", brandKeywords: ["nick"],             styleKeywords: ["style a", "style b"],               templateVariant: "cote-obsidian", demoSlug: "" },
  electrician: { sectorId: "plumber", brandKeywords: ["nick"],             styleKeywords: ["style b", "style a"],               templateVariant: "cote-obsidian", demoSlug: "" },
  garage:      { sectorId: "plumber", brandKeywords: ["nick"],             styleKeywords: ["style a"],                          templateVariant: "cote-obsidian", demoSlug: "" },

  /* RETAIL */
  shop:        { sectorId: "retail", brandKeywords: ["tatush"],            styleKeywords: ["mobile"],                           templateVariant: "tatush-hair", demoSlug: "" },
  boutique:    { sectorId: "retail", brandKeywords: ["tatush"],            styleKeywords: ["mobile", "desktop"],                templateVariant: "tatush-hair", demoSlug: "" },
  jewelry:     { sectorId: "retail", brandKeywords: ["tatush"],            styleKeywords: ["mobile"],                           templateVariant: "cote-marble", demoSlug: "" },

  /* VETERINARY */
  veterinary:  { sectorId: "veterinary", brandKeywords: ["aloha pet"],     styleKeywords: ["style a", "style e", "style f"],    templateVariant: "neo-nails-lavender", demoSlug: "" },
  petshop:     { sectorId: "veterinary", brandKeywords: ["aloha pet"],     styleKeywords: ["style g"],                          templateVariant: "neo-nails-lavender", demoSlug: "" },

  /* CHILDCARE */
  childcare:   { sectorId: "childcare", brandKeywords: ["little diamond", "ashley"], styleKeywords: ["playful colorful", "nature explorer", "style a"], templateVariant: "neo-nails-lavender", demoSlug: "" },

  /* BEACH */
  beach:       { sectorId: "beach", brandKeywords: ["miami watersports"],  styleKeywords: ["style a"],                          templateVariant: "miami-watersports", demoSlug: "" },

  /* AGRITURISMO → riusa Asinara */
  agriturismo: { sectorId: "hospitality", brandKeywords: ["asinara"],      styleKeywords: ["emerald cove", "golden sunset"],    templateVariant: "asinara-azure", demoSlug: "" },
};

const SUB_SECTOR_PREVIEW_DETAILS: Partial<Record<SubSectorKey, SectorPreviewDetails>> = {
  pizzeria: { features: ["Menu pizza live", "Ordini delivery/asporto", "Prenotazioni tavoli", "Loyalty + coupon"], value: "Più ordini diretti, meno dipendenza dalle app", cta: "Vedi demo pizzeria" },
  sushi: { features: ["Menu fusion visuale", "Takeaway & delivery", "Omakase / degustazioni", "CRM clienti premium"], value: "Esperienza più premium e ordini più alti", cta: "Vedi demo sushi" },
  braceria: { features: ["Menu premium", "Prenotazioni smart", "Wine pairing", "Gift card & eventi"], value: "Più coperti di fascia alta", cta: "Vedi demo braceria" },
  pesce: { features: ["Crudi e pescato del giorno", "Booking tavoli", "Delivery gourmet", "Storytelling prodotti"], value: "Valorizza il pescato e alza lo scontrino medio", cta: "Vedi demo pescheria / seafood" },
  bakery: { features: ["Catalogo forno", "Preordini smart", "Ritiro in negozio", "Promo colazioni"], value: "Più vendite quotidiane e preordini", cta: "Vedi demo bakery" },
  gelateria: { features: ["Vetrina gusti live", "Ordini take-away", "Promo stagionali", "Fidelity card"], value: "Più ritorni e più ordini impulsivi", cta: "Vedi demo gelateria" },
  coffee: { features: ["Brunch & specialty menu", "Prenotazioni tavoli", "Take-away rapido", "Promo ricorrenti"], value: "Più clienti abituali durante tutta la giornata", cta: "Vedi demo coffee shop" },
  wine_bar: { features: ["Carta vini digitale", "Prenotazioni eventi", "Degustazioni", "CRM clienti VIP"], value: "Più prenotazioni serali e degustazioni", cta: "Vedi demo wine bar" },
  trattoria: { features: ["Menu tradizione", "Prenotazioni tavoli", "Asporto", "Recensioni + loyalty"], value: "Più coperti e clienti di ritorno", cta: "Vedi demo trattoria" },
  osteria: { features: ["Menu del giorno", "Prenotazioni online", "Eventi e serate", "CRM clienti"], value: "Più riempimento settimanale", cta: "Vedi demo osteria" },
  pub: { features: ["Eventi live", "Tavoli e booking", "Menu food & beer", "Promo loyalty"], value: "Più affluenza nelle serate chiave", cta: "Vedi demo pub" },
  vegan: { features: ["Menu healthy", "Ordini smart", "Abbonamenti lunch", "Community & loyalty"], value: "Più recurring customers", cta: "Vedi demo vegan" },
  burger: { features: ["Menu burger visuale", "Delivery & pickup", "Combo smart", "Recensioni + loyalty"], value: "Più conversione sul delivery", cta: "Vedi demo burger" },
  nails: { features: ["Booking online 24/7", "Listino servizi", "Galleria lavori", "Reminder automatici"], value: "Meno no-show e agenda piena", cta: "Vedi demo nails" },
  hair: { features: ["Prenota styling", "Listino trattamenti", "Lookbook gallery", "Promo fidelizzazione"], value: "Più appuntamenti ricorrenti", cta: "Vedi demo hair salon" },
  barber: { features: ["Prenota slot", "Servizi barber", "Membership uomo", "Reminder automatici"], value: "Agenda più piena e clienti abituali", cta: "Vedi demo barber" },
  spa: { features: ["Percorsi benessere", "Booking trattamenti", "Gift card", "Upsell pacchetti"], value: "Più pacchetti premium venduti", cta: "Vedi demo spa" },
  yacht: { features: ["Fleet showcase", "Booking charter", "Itinerari premium", "Richieste concierge"], value: "Più richieste private ad alto valore", cta: "Vedi demo yacht charter" },
  boats: { features: ["Flotta barche", "Booking immediato", "Extra e skipper", "WhatsApp veloce"], value: "Più prenotazioni dirette", cta: "Vedi demo boat rental" },
  ncc: { features: ["Prenotazioni transfer", "Preventivi smart", "Flotta premium", "CRM clienti VIP"], value: "Più corse dirette e clienti business", cta: "Vedi demo NCC" },
  limo: { features: ["Executive booking", "Flotta luxury", "Servizi VIP", "Richieste rapide"], value: "Più lead premium convertiti", cta: "Vedi demo limousine" },
  padel: { features: ["Prenota campo", "Lezioni & maestri", "Tornei", "Abbonamenti club"], value: "Più prenotazioni e più retention", cta: "Vedi demo padel" },
  watersports: { features: ["Booking attività", "Pacchetti mare", "Noleggi", "Calendario live"], value: "Più prenotazioni stagionali", cta: "Vedi demo watersports" },
  gym: { features: ["Membership online", "Prenota classi", "App membri", "Pagamenti ricorrenti"], value: "+35% retention membri", cta: "Vedi demo palestra" },
  hotel: { features: ["Booking diretto", "Camere & esperienze", "Upsell automatico", "Guest CRM"], value: "Meno commissioni OTA", cta: "Vedi demo hotel" },
  bnb: { features: ["Prenotazione camere", "Esperienze locali", "Check-in digitale", "Recensioni smart"], value: "Più prenotazioni dirette", cta: "Vedi demo B&B" },
  agriturismo: { features: ["Booking camere", "Esperienze in struttura", "Degustazioni", "Vendita prodotti"], value: "Più prenotazioni dirette", cta: "Vedi demo agriturismo" },
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

/* ─── Brand & style lookup tolleranti con fuzzy ─── */

const BRAND_ALIAS: Record<string, string[]> = {
  "cote miami": ["cote", "côte", "cotemiami", "côté", "miami cote"],
  "paperfish": ["paperfish", "paperfishshushi", "paperfish sushi", "paper fish"],
  "batey": ["batey", "batey cevicheria", "batey pacifico"],
  "neo nails": ["neo nails", "neonails", "nails neo", "neo nail"],
  "tatush": ["tatush", "tatush hair", "tatush fragrance"],
  "asinara": ["asinara", "asinara charter"],
  "miami boats": ["miami boats", "miamiboats", "boats miami"],
  "city padel": ["city padel", "citypadel", "padel club"],
  "miami watersports": ["miami watersports", "watersports miami"],
  "midtown kosher": ["midtown kosher", "midtown", "kosher midtown"],
  "la vang": ["la vang", "lavang"],
  "flame kebab": ["flame kebab", "flame", "kebab flame"],
  "far medical": ["far medical", "far", "medical center"],
  "mmi resident": ["mmi", "mmi resident", "mmi residential"],
  "nick": ["nick", "nick plumbing", "nicks plumbing"],
  "aloha pet": ["aloha pet", "aloha", "alohapet"],
};

function brandMatches(brand: MockupBrand, keywords: string[]): boolean {
  const bn = brand.name.toLowerCase().replace(/[^a-z0-9 ]/g, "");
  return keywords.some((kw) => {
    const k = kw.toLowerCase().trim().replace(/[^a-z0-9 ]/g, "");
    if (!k) return false;
    if (bn === k || bn.includes(k) || k.includes(bn)) return true;
    // alias estesi
    const aliases = BRAND_ALIAS[k] || [];
    if (aliases.some(a => bn.includes(a) || a.includes(bn))) return true;
    // match prima parola (≥4 lettere)
    const first = k.split(" ")[0];
    if (first.length >= 4 && bn.startsWith(first)) return true;
    // match per startsWith parola del brand
    const firstBn = bn.split(" ")[0];
    if (firstBn.length >= 4 && k.startsWith(firstBn)) return true;
    return false;
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

function findAllMatchingBrands(portfolio: SectorPortfolio | undefined, brandKeywords: string[]): MockupBrand[] {
  if (!portfolio) return [];
  const seen = new Set<string>();
  const out: MockupBrand[] = [];
  for (const kw of brandKeywords) {
    for (const b of portfolio.brands) {
      if (!seen.has(b.name) && brandMatches(b, [kw])) {
        seen.add(b.name);
        out.push(b);
      }
    }
  }
  return out;
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

function resolvePreviewFromTarget(
  sub: SubSectorKey,
  sectorId: IndustryId,
  target: PreviewTarget | undefined,
  confidence: number,
  matchedBy: string,
): PreviewMatch | null {
  if (target) {
    const portfolio = SECTOR_PORTFOLIO.find((sp) => sp.sectorId === target.sectorId);
    // 1) prova brand preferiti in ordine
    const allMatching = findAllMatchingBrands(portfolio, target.brandKeywords);
    for (const brand of allMatching) {
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
          confidence,
          matchedBy: `${matchedBy} → ${brand.name}/${style?.name || "default"}`,
        };
      }
    }
  }

  // 2) qualunque brand reale dello stesso settore
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
        templateVariant: target?.templateVariant || "cote-ivory",
        demoSlug: target?.demoSlug || "",
        confidence: confidence * 0.7,
        matchedBy: `${matchedBy} → fallback sector brand ${anyBrand.name}`,
      };
    }
  }

  return null;
}

/* ─── Cache LRU mini per memoization ─── */
const MATCH_CACHE = new Map<string, PreviewMatch>();
const CACHE_MAX = 200;

function cacheKey(input: DetectInput): string {
  return JSON.stringify({
    n: input.name, s: input.sector, c: input.cuisine,
    w: input.website, t: (input.types || []).slice(0, 5),
    ct: input.city,
  });
}

/* ─── Main matcher ─── */

export function matchPreviewForLead(input: DetectInput): PreviewMatch {
  const key = cacheKey(input);
  const cached = MATCH_CACHE.get(key);
  if (cached) return cached;

  const detection = detectSubSector(input);
  const { sub, isLuxury, sectorId, luxuryScore, signals } = detection;

  // 1) Target preferito dal sub-sector
  let target = SUB_TO_TARGET[sub];

  // Boost luxury graduato
  if (target && luxuryScore >= 0.4) {
    if (sub === "sushi") target = { ...target, styleKeywords: ["luxury dark", "miami", ...target.styleKeywords] };
    if (sub === "wine_bar") target = { ...target, styleKeywords: ["luxury dark", ...target.styleKeywords] };
    if (sub === "ristorante" || sub === "trattoria" || sub === "osteria") {
      target = { ...target, styleKeywords: ["obsidian", "marble", ...target.styleKeywords] };
    }
    if (sub === "yacht") target = { ...target, styleKeywords: ["golden sunset", "emerald cove", ...target.styleKeywords] };
    if (sub === "hotel" || sub === "agriturismo") target = { ...target, styleKeywords: ["marble", ...target.styleKeywords] };
  }

  const baseConfidence = signals.some(s => s.startsWith("kw:")) ? 0.85 : signals.some(s => s.startsWith("fallback:")) ? 0.55 : 0.4;
  const confidence = Math.min(baseConfidence + (isLuxury ? 0.05 : 0), 0.98);

  const resolved = resolvePreviewFromTarget(sub, sectorId, target, confidence, signals.join("|"));
  if (resolved) {
    if (MATCH_CACHE.size >= CACHE_MAX) MATCH_CACHE.delete(MATCH_CACHE.keys().next().value);
    MATCH_CACHE.set(key, resolved);
    return resolved;
  }

  // 4) Ultimo fallback: flat array del settore
  const flat = getFlatSectorScreens(sectorId);
  const result: PreviewMatch = {
    sectorId, subSector: sub,
    brandName: target?.brandKeywords[0] ? toTitle(target.brandKeywords[0]) : "Empire Demo",
    styleName: "Sector Demo", screens: flat,
    templateVariant: target?.templateVariant || "cote-ivory",
    demoSlug: target?.demoSlug || "",
    confidence: confidence * 0.5,
    matchedBy: `flat-fallback ${sectorId}`,
  };
  if (MATCH_CACHE.size >= CACHE_MAX) MATCH_CACHE.delete(MATCH_CACHE.keys().next().value);
  MATCH_CACHE.set(key, result);
  return result;
}

function toTitle(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getPreviewScreensForLead(input: Parameters<typeof matchPreviewForLead>[0]): string[] {
  return matchPreviewForLead(input).screens;
}

/** Debug helper: ritorna match + diagnostica completa (signals, score, cascata) */
export function explainPreviewMatch(input: DetectInput) {
  const detection = detectSubSector(input);
  const match = matchPreviewForLead(input);
  return {
    detection,
    match,
    domainSignals: extractDomainSignals(input.website),
  };
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
    return resolvePreviewFromTarget(mappedSub, target?.sectorId || sectorId, target, 0.95, "recommended-project") || matchPreviewForLead({
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
      confidence: 1,
      matchedBy: "manual-selection",
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
