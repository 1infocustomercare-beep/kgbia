/**
 * Preview Matcher (client-side)
 *
 * Sceglie il MOCKUP iPhone più adatto a un lead in base al sotto-settore
 * rilevato dal nome attività (mirror dell'edge function detectSubSector).
 *
 * Garantisce che la "📱 Preview" mostrata nella card del lead nella
 * /partner/leads sia visivamente identica al sito demo che verrà generato
 * dalla Demo Factory (stesso brand/style → stesso template_variant).
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
  /** Sotto-settore individuato (es. "sushi", "pizzeria", "yacht") */
  subSector: SubSectorKey;
  /** Brand del portfolio (es. "Paperfish Sushi", "Asinara Charter") */
  brandName: string;
  /** Stile scelto del brand (es. "Sakura", "Sardinia Azure Luxury") */
  styleName: string;
  /** 4 schermate iPhone del mockup scelto */
  screens: string[];
  /** template_variant equivalente lato server (per coerenza con DemoFactory) */
  templateVariant: string;
  /** Slug demo da aprire come "Vedi demo" reale */
  demoSlug: string;
}

const FOOD_SECTORS = new Set(["food", "restaurant", "bakery", "gelateria", "wine_bar", "catering"]);

/* ─── Detect sub-sector from lead name + sector + extra haystack ─── */
export function detectSubSector(input: {
  name?: string | null;
  sector?: string | null;
  sectorLabel?: string | null;
  cuisine?: string | null;
  extra?: string | null;
}): { sub: SubSectorKey; isLuxury: boolean } {
  const name = (input.name || "").toLowerCase();
  const sector = (input.sector || "").toLowerCase();
  const haystack = [
    input.name, input.sector, input.sectorLabel, input.cuisine, input.extra,
  ].filter(Boolean).join(" ").toLowerCase();

  const isLuxury = /\b(gourmet|luxury|prive|exclusive|noir|black|gold|royal|prestige|premium|fine dining|stellato|michelin)\b/.test(name + " " + haystack);

  /* FOOD */
  if (FOOD_SECTORS.has(sector) || /\b(menu|piatto|chef|ristorante|trattoria|osteria|pizzeria)\b/.test(haystack)) {
    if (/\b(pizz(a|eria|aiolo)|napolet|forno a legna|margherita|marinara|trapizz)\b/.test(haystack)) return { sub: "pizzeria", isLuxury };
    if (/\b(sushi|sashimi|ramen|nigiri|maki|temaki|giappones|japanese|izakaya|wagyu|omakase|hosomaki|uramaki)\b/.test(haystack)) return { sub: "sushi", isLuxury };
    if (/\b(braceri|steak|grill|fiorentin|bistecc|carne alla brace|smokehouse|barbecue|bbq|churrasc|asado)\b/.test(haystack)) return { sub: "braceria", isLuxury };
    if (/\b(pesce|fish|frutti di mare|crostacei|seafood|raw bar|ostriche|cevich|tartare di pesce)\b/.test(haystack)) return { sub: "pesce", isLuxury };
    if (/\b(panett|fornai|panificio|bakery|pasticceria|cornett|brioche|lievit|forno|bread|croissant)\b/.test(haystack) || sector === "bakery") return { sub: "bakery", isLuxury };
    if (/\b(vietnam|pho|banh|saigon|hanoi)\b/.test(haystack)) return { sub: "vietnamese", isLuxury };
    if (/\b(kosher|jewish|kasher)\b/.test(haystack)) return { sub: "kosher", isLuxury };
    if (/\b(gelater|gelato|ice cream|sorbet|sorbett)\b/.test(haystack) || sector === "gelateria") return { sub: "gelateria", isLuxury };
    if (/\b(caffetter|coffee|caffè|espresso|bar tavola|cappucc|barista|specialty coffee|brunch)\b/.test(haystack)) return { sub: "coffee", isLuxury };
    if (/\b(wine bar|enotec|cantina|wine|vino|sommelier|degustazion)\b/.test(haystack)) return { sub: "wine_bar", isLuxury };
    if (/\b(pub|birrer|brewery|craft beer|birra artigian|tap room|gastropub)\b/.test(haystack)) return { sub: "pub", isLuxury };
    if (/\b(vegan|vegano|vegetarian|plant based|healthy|raw food|biologic|bio)\b/.test(haystack)) return { sub: "vegan", isLuxury };
    if (/\b(burger|hamburger|smash|american diner|cheeseburg)\b/.test(haystack)) return { sub: "burger", isLuxury };
    if (/\bosteria\b/.test(haystack)) return { sub: "osteria", isLuxury };
    if (/\b(trattoria|cucina tipica|cucina casalinga|cucina tradizion)\b/.test(haystack)) return { sub: "trattoria", isLuxury };
    return { sub: "ristorante", isLuxury };
  }

  /* BEAUTY */
  if (sector === "beauty" || sector === "barber" || /\b(beauty|estetica|nail|hair|barber|spa|wellness|parrucch)\b/.test(haystack)) {
    if (/\b(nail|unghie|manicure|pedicure|gel|semipermanent)\b/.test(haystack)) return { sub: "nails", isLuxury };
    if (/\b(barber|barbier|barbershop)\b/.test(haystack) || sector === "barber") return { sub: "barber", isLuxury };
    if (/\b(spa|wellness|massagg|terme|hammam)\b/.test(haystack)) return { sub: "spa", isLuxury };
    if (/\b(hair|capell|parrucch|tagli|colore|coiffure|salon)\b/.test(haystack)) return { sub: "hair", isLuxury };
    return { sub: "nails", isLuxury }; // beauty default → nails (più frequente)
  }

  /* NCC */
  if (sector === "ncc" || /\b(ncc|noleggio|transfer|chauffeur|limousine|yacht|boat|barca|charter)\b/.test(haystack)) {
    if (/\b(yacht|charter|barca a vela|sail|crocier|cruise|asinara|sardin)\b/.test(haystack)) return { sub: "yacht", isLuxury };
    if (/\b(boat|gommone|motoscaf|speedboat|jet ski|miami)\b/.test(haystack)) return { sub: "boats", isLuxury };
    return { sub: "ncc", isLuxury };
  }

  /* FITNESS */
  if (sector === "fitness" || /\b(palestra|gym|fitness|padel|tennis|sport|crossfit|yoga)\b/.test(haystack)) {
    if (/\b(padel|tennis|squash|racchet)\b/.test(haystack)) return { sub: "padel", isLuxury };
    if (/\b(jet ski|surf|kite|sup|watersport|wakeboard)\b/.test(haystack)) return { sub: "watersports", isLuxury };
    return { sub: "padel", isLuxury };
  }

  return { sub: "default", isLuxury };
}

/* ─── Sub-sector → exact brand/style of the SECTOR_PORTFOLIO ─── */
const SUB_TO_BRAND_STYLE: Record<SubSectorKey, { sectorId: IndustryId; brandName: string; styleNames: string[]; templateVariant: string; demoSlug: string }> = {
  pizzeria:    { sectorId: "food", brandName: "COTE Miami",       styleNames: ["Ivory", "Marble"],         templateVariant: "strapizzami",       demoSlug: "strapizzami-roma" },
  sushi:       { sectorId: "food", brandName: "Paperfish Sushi",  styleNames: ["Sakura", "Luxury Dark"],   templateVariant: "paperfish-sakura",  demoSlug: "paperfish-sushi" },
  braceria:    { sectorId: "food", brandName: "COTE Miami",       styleNames: ["Obsidian"],                templateVariant: "cote-obsidian",     demoSlug: "impero-roma" },
  pesce:       { sectorId: "food", brandName: "Batey Cevicheria", styleNames: ["Costa Pacifico", "Casa Nostra"], templateVariant: "batey-pacifico", demoSlug: "batey-pacifico" },
  bakery:      { sectorId: "food", brandName: "COTE Miami",       styleNames: ["Marble", "Ivory"],         templateVariant: "cote-ivory",        demoSlug: "impero-roma" },
  vietnamese:  { sectorId: "food", brandName: "La Vang Vietnamese", styleNames: ["Noir Saigon", "Obsidian Gold"], templateVariant: "lavang-noir",   demoSlug: "impero-roma" },
  kosher:      { sectorId: "food", brandName: "Midtown Kosher",   styleNames: ["Style A", "Style B"],      templateVariant: "midtown-kosher",    demoSlug: "impero-roma" },
  gelateria:   { sectorId: "food", brandName: "COTE Miami",       styleNames: ["Marble", "Ivory"],         templateVariant: "cote-ivory",        demoSlug: "impero-roma" },
  coffee:      { sectorId: "food", brandName: "COTE Miami",       styleNames: ["Ivory", "Marble"],         templateVariant: "cote-ivory",        demoSlug: "impero-roma" },
  wine_bar:    { sectorId: "food", brandName: "Paperfish Sushi",  styleNames: ["Luxury Dark"],             templateVariant: "paperfish-dark",    demoSlug: "impero-roma" },
  pub:         { sectorId: "food", brandName: "COTE Miami",       styleNames: ["Obsidian"],                templateVariant: "cote-obsidian",     demoSlug: "impero-roma" },
  vegan:       { sectorId: "food", brandName: "COTE Miami",       styleNames: ["Marble"],                  templateVariant: "city-padel-sage",   demoSlug: "impero-roma" },
  burger:      { sectorId: "food", brandName: "COTE Miami",       styleNames: ["Obsidian"],                templateVariant: "cote-obsidian",     demoSlug: "impero-roma" },
  trattoria:   { sectorId: "food", brandName: "COTE Miami",       styleNames: ["Ivory"],                   templateVariant: "cote-ivory",        demoSlug: "impero-roma" },
  osteria:     { sectorId: "food", brandName: "COTE Miami",       styleNames: ["Ivory", "Marble"],         templateVariant: "cote-ivory",        demoSlug: "impero-roma" },
  ristorante:  { sectorId: "food", brandName: "COTE Miami",       styleNames: ["Ivory", "Marble"],         templateVariant: "cote-ivory",        demoSlug: "impero-roma" },

  nails:       { sectorId: "beauty", brandName: "Neo Nails Brickell", styleNames: ["Lavender Luxe", "Blush Rosegold"], templateVariant: "neo-nails-lavender", demoSlug: "glow-beauty-milano" },
  hair:        { sectorId: "beauty", brandName: "Tatush Hair Fragrance", styleNames: ["Mobile"],            templateVariant: "tatush-hair",         demoSlug: "glow-beauty-milano" },
  barber:      { sectorId: "beauty", brandName: "Tatush Hair Fragrance", styleNames: ["Mobile"],            templateVariant: "tatush-hair",         demoSlug: "glow-beauty-milano" },
  spa:         { sectorId: "beauty", brandName: "Neo Nails Brickell", styleNames: ["Lavender Luxe"],       templateVariant: "neo-nails-lavender",  demoSlug: "glow-beauty-milano" },

  yacht:       { sectorId: "ncc", brandName: "Asinara Charter",    styleNames: ["Sardinia Azure Luxury", "Emerald Cove"], templateVariant: "asinara-azure", demoSlug: "amalfi-luxury-transfer" },
  boats:       { sectorId: "ncc", brandName: "Miami Boats Rental", styleNames: ["Style A", "Style C", "Style F"],         templateVariant: "miami-boats",   demoSlug: "amalfi-luxury-transfer" },
  ncc:         { sectorId: "ncc", brandName: "Asinara Charter",    styleNames: ["Sardinia Azure Luxury"],                 templateVariant: "asinara-azure", demoSlug: "amalfi-luxury-transfer" },

  padel:        { sectorId: "fitness", brandName: "City Padel Milano",  styleNames: ["Sage Luxe", "Fresh Azzurro"], templateVariant: "city-padel-sage", demoSlug: "fitness-club-roma" },
  watersports:  { sectorId: "fitness", brandName: "Miami Watersports",  styleNames: ["Style A"],                    templateVariant: "miami-watersports", demoSlug: "fitness-club-roma" },

  default:     { sectorId: "food", brandName: "COTE Miami",       styleNames: ["Ivory"],                   templateVariant: "default",           demoSlug: "impero-roma" },
};

function findStyleScreens(portfolio: SectorPortfolio | undefined, brandName: string, preferredStyles: string[]): { brand?: string; style?: string; screens: string[] } {
  if (!portfolio) return { screens: [] };
  const brand = portfolio.brands.find(b => b.name.toLowerCase().includes(brandName.toLowerCase().split(" ")[0]));
  if (!brand) return { screens: [] };
  // Try preferred style names in order
  for (const name of preferredStyles) {
    const style = brand.styles.find(s => s.name.toLowerCase().includes(name.toLowerCase()));
    if (style?.screens?.length) return { brand: brand.name, style: style.name, screens: style.screens.slice(0, 4) };
  }
  // Fallback to first style
  const first = brand.styles[0];
  return { brand: brand.name, style: first?.name, screens: first?.screens?.slice(0, 4) || [] };
}

/**
 * Match a lead → 4 mockup screens of the most relevant brand/style.
 * Always returns something (falls back to flat SECTOR_MOCKUP_IMAGES, then to defaults).
 */
export function matchPreviewForLead(input: {
  name?: string | null;
  sector?: string | null;
  sectorLabel?: string | null;
  cuisine?: string | null;
  extra?: string | null;
}): PreviewMatch {
  const { sub, isLuxury } = detectSubSector(input);
  let target = SUB_TO_BRAND_STYLE[sub];

  // Luxury upgrade: prefer "Obsidian" / "Luxury Dark" / "Noir" when present
  let preferredStyles = target.styleNames;
  if (isLuxury) {
    if (sub === "sushi") preferredStyles = ["Luxury Dark", "Sakura"];
    if (sub === "ristorante" || sub === "trattoria" || sub === "osteria") preferredStyles = ["Obsidian", "Marble", "Ivory"];
    if (sub === "wine_bar") preferredStyles = ["Luxury Dark"];
  }

  const portfolio = SECTOR_PORTFOLIO.find(sp => sp.sectorId === target.sectorId);
  const found = findStyleScreens(portfolio, target.brandName, preferredStyles);

  // Final fallback to flat array
  let screens = found.screens;
  if (!screens.length) {
    const flat = SECTOR_MOCKUP_IMAGES[target.sectorId as keyof typeof SECTOR_MOCKUP_IMAGES];
    screens = flat?.slice(0, 4) || [];
  }

  return {
    subSector: sub,
    brandName: found.brand || target.brandName,
    styleName: found.style || preferredStyles[0] || "Default",
    screens,
    templateVariant: target.templateVariant,
    demoSlug: target.demoSlug,
  };
}

/** Quick helper: only screens (back-compat with previous getPreviewScreens). */
export function getPreviewScreensForLead(input: {
  name?: string | null;
  sector?: string | null;
  sectorLabel?: string | null;
}): string[] {
  return matchPreviewForLead(input).screens;
}
