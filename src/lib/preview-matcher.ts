/**
 * Preview Matcher (client-side)
 *
 * Usa TUTTI i segnali reali disponibili del lead (nome, settore, categoria,
 * cucina, tipi OSM/Google, sito, indirizzo e metadati extra) per scegliere
 * il mockup iPhone più coerente.
 *
 * Regola fondamentale:
 * - se il lead appartiene a un settore con mockup dedicati, NON deve mai
 *   cadere sul fallback food generico.
 */

import { SECTOR_PORTFOLIO, SECTOR_MOCKUP_IMAGES, type SectorPortfolio } from "@/data/sector-mockup-images";
import { type IndustryId } from "@/config/industry-config";

export type SubSectorKey =
  | "pizzeria" | "sushi" | "braceria" | "pesce" | "bakery" | "vietnamese"
  | "kosher" | "gelateria" | "coffee" | "wine_bar" | "pub" | "vegan"
  | "burger" | "trattoria" | "osteria" | "ristorante"
  | "nails" | "hair" | "barber" | "spa"
  | "yacht" | "boats" | "ncc"
  | "padel" | "watersports" | "default";

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
  brandName: string;
  styleNames: string[];
  templateVariant: string;
  demoSlug: string;
};

const FOOD_SECTORS = new Set(["food", "restaurant", "bakery", "gelateria", "wine_bar", "catering"]);

const KNOWN_SECTORS = new Set<IndustryId>([
  "food", "ncc", "beauty", "healthcare", "retail", "fitness", "hospitality", "beach",
  "plumber", "electrician", "agriturismo", "cleaning", "legal", "accounting", "garage",
  "photography", "construction", "gardening", "veterinary", "tattoo", "childcare",
  "education", "events", "logistics", "custom",
]);

const SECTOR_PARENT: Partial<Record<string, IndustryId>> = {
  bakery: "food",
  gelateria: "food",
  wine_bar: "food",
  catering: "food",
  barber: "beauty",
  spa: "beauty",
  dentist: "healthcare",
  physiotherapy: "healthcare",
  psychology: "healthcare",
  pharmacy: "healthcare",
  optics: "healthcare",
  martial_arts: "fitness",
  dance: "fitness",
  pet_shop: "veterinary",
  jewelry: "retail",
  car_wash: "garage",
  tech_repair: "retail",
  printing: "retail",
  driving_school: "education",
  music: "education",
  florist: "gardening",
  laundry: "cleaning",
  locksmith: "plumber",
  tailor: "retail",
  travel: "hospitality",
  coworking: "hospitality",
  real_estate: "construction",
  architect: "construction",
  insurance: "accounting",
  funeral: "events",
  moving: "logistics",
  pest_control: "cleaning",
};

const GENERIC_SECTOR_TARGETS: Partial<Record<IndustryId, PreviewTarget>> = {
  food:         { sectorId: "food",         brandName: "COTE Miami",              styleNames: ["Ivory", "Marble"],         templateVariant: "default", demoSlug: "impero-roma" },
  healthcare:   { sectorId: "healthcare",   brandName: "FAR Medical Solutions",   styleNames: ["Ethereal Glass", "Azure Gradient"], templateVariant: "default", demoSlug: "" },
  hospitality:  { sectorId: "hospitality",  brandName: "Grand Hotel Premium",     styleNames: ["Luxury Hospitality"],       templateVariant: "default", demoSlug: "" },
  beach:        { sectorId: "beach",        brandName: "Beach Club Premium",      styleNames: ["Sunset Coral"],             templateVariant: "default", demoSlug: "" },
  retail:       { sectorId: "retail",       brandName: "Store Premium",           styleNames: ["Editorial Commerce"],       templateVariant: "default", demoSlug: "" },
  plumber:      { sectorId: "plumber",      brandName: "Nick's Plumbing & AC",    styleNames: ["Service Pro"],              templateVariant: "default", demoSlug: "" },
  electrician:  { sectorId: "electrician",  brandName: "Elite Electrical",        styleNames: ["Service Pro"],              templateVariant: "default", demoSlug: "" },
  agriturismo:  { sectorId: "agriturismo",  brandName: "Tuscan Country Estate",   styleNames: ["Country Escape"],           templateVariant: "default", demoSlug: "" },
  cleaning:     { sectorId: "cleaning",     brandName: "Premium Clean",           styleNames: ["Service Clean"],            templateVariant: "default", demoSlug: "" },
  legal:        { sectorId: "legal",        brandName: "Studio Legale Premium",   styleNames: ["Professional Trust"],       templateVariant: "default", demoSlug: "" },
  accounting:   { sectorId: "accounting",   brandName: "Studio Commercialista Pro", styleNames: ["Professional Finance"],   templateVariant: "default", demoSlug: "" },
  garage:       { sectorId: "garage",       brandName: "Speed Auto Service",      styleNames: ["Garage Pro"],               templateVariant: "default", demoSlug: "" },
  photography:  { sectorId: "photography",  brandName: "Vision Photography",      styleNames: ["Visual Stories"],           templateVariant: "default", demoSlug: "" },
  construction: { sectorId: "construction", brandName: "Premium Costruzioni",     styleNames: ["Build Pro"],                templateVariant: "default", demoSlug: "" },
  gardening:    { sectorId: "gardening",    brandName: "Verde & Giardini",        styleNames: ["Nature Project"],           templateVariant: "default", demoSlug: "" },
  veterinary:   { sectorId: "veterinary",   brandName: "Aloha Pet Resorts",       styleNames: ["Pet Care"],                 templateVariant: "default", demoSlug: "" },
  tattoo:       { sectorId: "tattoo",       brandName: "Ink Masters Studio",      styleNames: ["Ink Noir"],                 templateVariant: "default", demoSlug: "" },
  childcare:    { sectorId: "childcare",    brandName: "Little Diamond Nursery",  styleNames: ["Playful Colorful"],         templateVariant: "default", demoSlug: "" },
  education:    { sectorId: "education",    brandName: "Academy Pro",             styleNames: ["Course Flow"],              templateVariant: "default", demoSlug: "" },
  events:       { sectorId: "events",       brandName: "Elite Events",            styleNames: ["Event Luxe"],               templateVariant: "default", demoSlug: "" },
  logistics:    { sectorId: "logistics",    brandName: "Logistics Pro",           styleNames: ["Dispatch Flow"],            templateVariant: "default", demoSlug: "" },
};

function normalizeSector(rawSector?: string | null, haystack = ""): IndustryId {
  const sector = (rawSector || "").toLowerCase().trim();

  if (KNOWN_SECTORS.has(sector as IndustryId)) return sector as IndustryId;
  if (SECTOR_PARENT[sector]) return SECTOR_PARENT[sector] as IndustryId;

  if (/\b(stabiliment|balneare|beach club|beach|lido|spiaggia|ombrellone|lettino)\b/.test(haystack)) return "beach";
  if (/\b(hotel|resort|suite|room|camere|bed and breakfast|b&b|guest house|ospitalità)\b/.test(haystack)) return "hospitality";
  if (/\b(agriturismo|masseria|fattoria|country house|farm stay|cantina)\b/.test(haystack)) return "agriturismo";
  if (/\b(dentista|clinica|medico|studio medico|fisioterapia|psicologo|farmacia|ambulatorio|visita)\b/.test(haystack)) return "healthcare";
  if (/\b(shop|store|boutique|negozio|e-commerce|vetrina|prodotti)\b/.test(haystack)) return "retail";
  if (/\b(idraulic|caldaia|tubo|scarico|termoidraul)\b/.test(haystack)) return "plumber";
  if (/\b(elettric|impianto elettrico|cablaggio|fotovoltaico)\b/.test(haystack)) return "electrician";
  if (/\b(veterinar|pet|animali|toelettatura)\b/.test(haystack)) return "veterinary";
  if (/\b(asilo|nursery|childcare|infanzia|nido)\b/.test(haystack)) return "childcare";
  if (/\b(logistica|spedizion|corriere|trasporto merci|warehouse)\b/.test(haystack)) return "logistics";
  if (/\b(formazione|corso|academy|scuola|lezioni)\b/.test(haystack)) return "education";
  if (/\b(eventi|wedding|matrimonio|planner|location eventi)\b/.test(haystack)) return "events";
  if (/\b(officina|carrozzeria|meccanico|tagliando|revisione)\b/.test(haystack)) return "garage";
  if (/\b(architett|interior|edil|ristruttur|costruzion|cantiere)\b/.test(haystack)) return "construction";
  if (/\b(foto|photography|fotograf|video maker|wedding photo)\b/.test(haystack)) return "photography";
  if (/\b(giardin|garden|verde|vivaio|paesagg)\b/.test(haystack)) return "gardening";
  if (/\b(tattoo|piercing|ink|tatuaggio)\b/.test(haystack)) return "tattoo";
  if (/\b(avvocat|legal|notai|studio legale)\b/.test(haystack)) return "legal";
  if (/\b(commercialist|caf|contabil|fiscal|tributar)\b/.test(haystack)) return "accounting";
  if (/\b(clean|pulizi|sanificaz|disinfestaz)\b/.test(haystack)) return "cleaning";

  return "food";
}

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
    input.name,
    input.sector,
    input.sectorLabel,
    input.cuisine,
    input.website,
    input.openingHours,
    input.extra,
    ...(input.types || []),
  ].filter(Boolean).join(" ").toLowerCase();

  const name = (input.name || "").toLowerCase();
  const sectorId = normalizeSector(input.sector, haystack);
  const isLuxury = /\b(gourmet|luxury|prive|exclusive|noir|black|gold|royal|prestige|premium|fine dining|stellato|michelin)\b/.test(`${name} ${haystack}`);

  if (FOOD_SECTORS.has(sectorId) || /\b(menu|piatto|chef|ristorante|trattoria|osteria|pizzeria)\b/.test(haystack)) {
    if (/\b(pizz(a|eria|aiolo)|napolet|forno a legna|margherita|marinara|trapizz)\b/.test(haystack)) return { sub: "pizzeria", isLuxury, sectorId: "food" };
    if (/\b(sushi|sashimi|ramen|nigiri|maki|temaki|giappones|japanese|izakaya|wagyu|omakase|hosomaki|uramaki)\b/.test(haystack)) return { sub: "sushi", isLuxury, sectorId: "food" };
    if (/\b(braceri|steak|grill|fiorentin|bistecc|carne alla brace|smokehouse|barbecue|bbq|churrasc|asado)\b/.test(haystack)) return { sub: "braceria", isLuxury, sectorId: "food" };
    if (/\b(pesce|fish|frutti di mare|crostacei|seafood|raw bar|ostriche|cevich|tartare di pesce)\b/.test(haystack)) return { sub: "pesce", isLuxury, sectorId: "food" };
    if (/\b(panett|fornai|panificio|bakery|pasticceria|cornett|brioche|lievit|forno|bread|croissant)\b/.test(haystack) || sectorId === "food" && (input.sector || "").toLowerCase() === "bakery") return { sub: "bakery", isLuxury, sectorId: "food" };
    if (/\b(vietnam|pho|banh|saigon|hanoi)\b/.test(haystack)) return { sub: "vietnamese", isLuxury, sectorId: "food" };
    if (/\b(kosher|jewish|kasher)\b/.test(haystack)) return { sub: "kosher", isLuxury, sectorId: "food" };
    if (/\b(gelater|gelato|ice cream|sorbet|sorbett)\b/.test(haystack) || (input.sector || "").toLowerCase() === "gelateria") return { sub: "gelateria", isLuxury, sectorId: "food" };
    if (/\b(caffetter|coffee|caffè|espresso|bar tavola|cappucc|barista|specialty coffee|brunch)\b/.test(haystack)) return { sub: "coffee", isLuxury, sectorId: "food" };
    if (/\b(wine bar|enotec|cantina|wine|vino|sommelier|degustazion)\b/.test(haystack)) return { sub: "wine_bar", isLuxury, sectorId: "food" };
    if (/\b(pub|birrer|brewery|craft beer|birra artigian|tap room|gastropub)\b/.test(haystack)) return { sub: "pub", isLuxury, sectorId: "food" };
    if (/\b(vegan|vegano|vegetarian|plant based|healthy|raw food|biologic|bio)\b/.test(haystack)) return { sub: "vegan", isLuxury, sectorId: "food" };
    if (/\b(burger|hamburger|smash|american diner|cheeseburg)\b/.test(haystack)) return { sub: "burger", isLuxury, sectorId: "food" };
    if (/\bosteria\b/.test(haystack)) return { sub: "osteria", isLuxury, sectorId: "food" };
    if (/\b(trattoria|cucina tipica|cucina casalinga|cucina tradizion)\b/.test(haystack)) return { sub: "trattoria", isLuxury, sectorId: "food" };
    return { sub: "ristorante", isLuxury, sectorId: "food" };
  }

  if (sectorId === "beauty" || /\b(beauty|estetica|nail|hair|barber|spa|wellness|parrucch)\b/.test(haystack)) {
    if (/\b(nail|unghie|manicure|pedicure|gel|semipermanent)\b/.test(haystack)) return { sub: "nails", isLuxury, sectorId: "beauty" };
    if (/\b(barber|barbier|barbershop)\b/.test(haystack) || (input.sector || "").toLowerCase() === "barber") return { sub: "barber", isLuxury, sectorId: "beauty" };
    if (/\b(spa|wellness|massagg|terme|hammam)\b/.test(haystack)) return { sub: "spa", isLuxury, sectorId: "beauty" };
    if (/\b(hair|capell|parrucch|tagli|colore|coiffure|salon)\b/.test(haystack)) return { sub: "hair", isLuxury, sectorId: "beauty" };
    return { sub: "nails", isLuxury, sectorId: "beauty" };
  }

  if (sectorId === "ncc" || /\b(ncc|noleggio|transfer|chauffeur|limousine|yacht|boat|barca|charter)\b/.test(haystack)) {
    if (/\b(yacht|charter|barca a vela|sail|crocier|cruise|asinara|sardin)\b/.test(haystack)) return { sub: "yacht", isLuxury, sectorId: "ncc" };
    if (/\b(boat|gommone|motoscaf|speedboat|jet ski|miami)\b/.test(haystack)) return { sub: "boats", isLuxury, sectorId: "ncc" };
    return { sub: "ncc", isLuxury, sectorId: "ncc" };
  }

  if (sectorId === "fitness" || /\b(palestra|gym|fitness|padel|tennis|sport|crossfit|yoga)\b/.test(haystack)) {
    if (/\b(padel|tennis|squash|racchet)\b/.test(haystack)) return { sub: "padel", isLuxury, sectorId: "fitness" };
    if (/\b(jet ski|surf|kite|sup|watersport|wakeboard)\b/.test(haystack)) return { sub: "watersports", isLuxury, sectorId: "fitness" };
    return { sub: "padel", isLuxury, sectorId: "fitness" };
  }

  return { sub: "default", isLuxury, sectorId };
}

const SUB_TO_BRAND_STYLE: Partial<Record<SubSectorKey, PreviewTarget>> = {
  pizzeria:    { sectorId: "food",    brandName: "COTE Miami",              styleNames: ["Ivory", "Marble"],                      templateVariant: "strapizzami",      demoSlug: "strapizzami-roma" },
  sushi:       { sectorId: "food",    brandName: "Paperfish Sushi",         styleNames: ["Sakura", "Luxury Dark"],                templateVariant: "paperfish-sakura", demoSlug: "paperfish-sushi" },
  braceria:    { sectorId: "food",    brandName: "COTE Miami",              styleNames: ["Obsidian"],                              templateVariant: "cote-obsidian",    demoSlug: "impero-roma" },
  pesce:       { sectorId: "food",    brandName: "Batey Cevicheria",        styleNames: ["Costa Pacifico", "Casa Nostra"],        templateVariant: "batey-pacifico",   demoSlug: "batey-pacifico" },
  bakery:      { sectorId: "food",    brandName: "COTE Miami",              styleNames: ["Marble", "Ivory"],                      templateVariant: "cote-ivory",       demoSlug: "impero-roma" },
  vietnamese:  { sectorId: "food",    brandName: "La Vang Vietnamese",      styleNames: ["Noir Saigon", "Obsidian Gold"],         templateVariant: "lavang-noir",      demoSlug: "impero-roma" },
  kosher:      { sectorId: "food",    brandName: "Midtown Kosher",          styleNames: ["Style A", "Style B"],                   templateVariant: "midtown-kosher",   demoSlug: "impero-roma" },
  gelateria:   { sectorId: "food",    brandName: "COTE Miami",              styleNames: ["Marble", "Ivory"],                      templateVariant: "cote-ivory",       demoSlug: "impero-roma" },
  coffee:      { sectorId: "food",    brandName: "COTE Miami",              styleNames: ["Ivory", "Marble"],                      templateVariant: "cote-ivory",       demoSlug: "impero-roma" },
  wine_bar:    { sectorId: "food",    brandName: "Paperfish Sushi",         styleNames: ["Luxury Dark"],                           templateVariant: "paperfish-dark",   demoSlug: "impero-roma" },
  pub:         { sectorId: "food",    brandName: "COTE Miami",              styleNames: ["Obsidian"],                              templateVariant: "cote-obsidian",    demoSlug: "impero-roma" },
  vegan:       { sectorId: "food",    brandName: "COTE Miami",              styleNames: ["Marble"],                                templateVariant: "city-padel-sage",  demoSlug: "impero-roma" },
  burger:      { sectorId: "food",    brandName: "COTE Miami",              styleNames: ["Obsidian"],                              templateVariant: "cote-obsidian",    demoSlug: "impero-roma" },
  trattoria:   { sectorId: "food",    brandName: "COTE Miami",              styleNames: ["Ivory"],                                 templateVariant: "cote-ivory",       demoSlug: "impero-roma" },
  osteria:     { sectorId: "food",    brandName: "COTE Miami",              styleNames: ["Ivory", "Marble"],                      templateVariant: "cote-ivory",       demoSlug: "impero-roma" },
  ristorante:  { sectorId: "food",    brandName: "COTE Miami",              styleNames: ["Ivory", "Marble"],                      templateVariant: "cote-ivory",       demoSlug: "impero-roma" },
  nails:       { sectorId: "beauty",  brandName: "Neo Nails Brickell",      styleNames: ["Lavender Luxe", "Blush Rosegold"],      templateVariant: "neo-nails-lavender", demoSlug: "glow-beauty-milano" },
  hair:        { sectorId: "beauty",  brandName: "Tatush Hair Fragrance",   styleNames: ["Mobile"],                                templateVariant: "tatush-hair",      demoSlug: "glow-beauty-milano" },
  barber:      { sectorId: "beauty",  brandName: "Tatush Hair Fragrance",   styleNames: ["Mobile"],                                templateVariant: "tatush-hair",      demoSlug: "glow-beauty-milano" },
  spa:         { sectorId: "beauty",  brandName: "Neo Nails Brickell",      styleNames: ["Lavender Luxe"],                         templateVariant: "neo-nails-lavender", demoSlug: "glow-beauty-milano" },
  yacht:       { sectorId: "ncc",     brandName: "Asinara Charter",         styleNames: ["Sardinia Azure Luxury", "Emerald Cove"], templateVariant: "asinara-azure",  demoSlug: "amalfi-luxury-transfer" },
  boats:       { sectorId: "ncc",     brandName: "Miami Boats Rental",      styleNames: ["Style A", "Style C", "Style F"],      templateVariant: "miami-boats",      demoSlug: "amalfi-luxury-transfer" },
  ncc:         { sectorId: "ncc",     brandName: "Asinara Charter",         styleNames: ["Sardinia Azure Luxury"],                 templateVariant: "asinara-azure",    demoSlug: "amalfi-luxury-transfer" },
  padel:       { sectorId: "fitness", brandName: "City Padel Milano",       styleNames: ["Sage Luxe", "Fresh Azzurro"],           templateVariant: "city-padel-sage",  demoSlug: "fitness-club-roma" },
  watersports: { sectorId: "fitness", brandName: "Miami Watersports",       styleNames: ["Style A"],                               templateVariant: "miami-watersports", demoSlug: "fitness-club-roma" },
};

function findStyleScreens(portfolio: SectorPortfolio | undefined, brandName: string, preferredStyles: string[]) {
  if (!portfolio) return { screens: [] as string[], brand: undefined as string | undefined, style: undefined as string | undefined };

  const brandNeedle = brandName.toLowerCase();
  const firstWord = brandNeedle.split(" ")[0];
  const brand = portfolio.brands.find((b) => {
    const candidate = b.name.toLowerCase();
    return candidate === brandNeedle || candidate.includes(brandNeedle) || brandNeedle.includes(candidate) || candidate.includes(firstWord);
  });
  if (!brand) return { screens: [] as string[], brand: undefined, style: undefined };

  for (const name of preferredStyles) {
    const style = brand.styles.find((s) => s.name.toLowerCase().includes(name.toLowerCase()));
    if (style?.screens?.length) return { brand: brand.name, style: style.name, screens: style.screens.slice(0, 4) };
  }

  const first = brand.styles[0];
  return { brand: brand.name, style: first?.name, screens: first?.screens?.slice(0, 4) || [] };
}

function getFlatSectorScreens(sectorId: IndustryId): string[] {
  const flat = SECTOR_MOCKUP_IMAGES[sectorId as keyof typeof SECTOR_MOCKUP_IMAGES];
  if (flat?.length) return flat.slice(0, 4);

  const parent = SECTOR_PARENT[sectorId];
  if (!parent) return [];

  const parentFlat = SECTOR_MOCKUP_IMAGES[parent as keyof typeof SECTOR_MOCKUP_IMAGES];
  return parentFlat?.slice(0, 4) || [];
}

function getGenericSectorTarget(sectorId: IndustryId): PreviewTarget {
  return GENERIC_SECTOR_TARGETS[sectorId] || GENERIC_SECTOR_TARGETS[SECTOR_PARENT[sectorId] as IndustryId] || GENERIC_SECTOR_TARGETS.food!;
}

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
  const target = SUB_TO_BRAND_STYLE[sub] || getGenericSectorTarget(sectorId);

  let preferredStyles = [...target.styleNames];
  if (isLuxury) {
    if (sub === "sushi") preferredStyles = ["Luxury Dark", "Sakura", ...preferredStyles];
    if (sub === "ristorante" || sub === "trattoria" || sub === "osteria") preferredStyles = ["Obsidian", "Marble", "Ivory", ...preferredStyles];
    if (sub === "wine_bar") preferredStyles = ["Luxury Dark", ...preferredStyles];
  }

  const portfolio = SECTOR_PORTFOLIO.find((sp) => sp.sectorId === target.sectorId);
  const found = findStyleScreens(portfolio, target.brandName, preferredStyles);
  const screens = found.screens.length ? found.screens : getFlatSectorScreens(target.sectorId);

  return {
    sectorId: target.sectorId,
    subSector: sub,
    brandName: found.brand || target.brandName,
    styleName: found.style || preferredStyles[0] || "Sector Demo",
    screens,
    templateVariant: target.templateVariant,
    demoSlug: target.demoSlug,
  };
}

export function getPreviewScreensForLead(input: {
  name?: string | null;
  sector?: string | null;
  sectorLabel?: string | null;
  cuisine?: string | null;
  extra?: string | null;
  website?: string | null;
  openingHours?: string | null;
  types?: string[] | null;
}): string[] {
  return matchPreviewForLead(input).screens;
}
