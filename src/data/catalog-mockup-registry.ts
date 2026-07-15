/**
 * Catalog Mockup Registry — real premium AI-generated iPhone screens
 * for the `/portfolio` catalogue.
 *
 * Each entry maps (sectorId, brandName, styleName) → real PNG URL.
 * `catalogMockupUrl()` returns the AI image when present, otherwise `null`
 * so the caller can gracefully fall back to the SVG generator.
 *
 * ADDITIVE ONLY: adding a new PNG here upgrades a card automatically
 * without touching SECTOR_PORTFOLIO. Removing an entry never breaks
 * the catalogue — the SVG fallback keeps the card valid.
 */

import type { IndustryId } from "@/config/industry-config";

// Batch 1 — premium sector hero mockups
import foodOnyxObsidian from "@/assets/mockups/catalog/food-onyx-obsidian.png";
import beautyAuroraLavender from "@/assets/mockups/catalog/beauty-aurora-lavender.png";
import nccMarinaRiviera from "@/assets/mockups/catalog/ncc-marina-riviera.png";
import veterinaryTropicoResort from "@/assets/mockups/catalog/veterinary-tropico-resort.png";
import childcareStellePlayful from "@/assets/mockups/catalog/childcare-stelle-playful.png";
import fitnessPadelSage from "@/assets/mockups/catalog/fitness-padel-sage.png";
import healthcareLumenGlass from "@/assets/mockups/catalog/healthcare-lumen-glass.png";
import hospitalityCalaVentoAzure from "@/assets/mockups/catalog/hospitality-cala-vento-azure.png";

// Batch 2 — Construction (Domus Living × 4 styles) + Plumber (Idro Pronto × 2 styles)
import constructionDomusOceanAzure from "@/assets/mockups/catalog/construction-domus-ocean-azure.png";
import constructionDomusLivingCoral from "@/assets/mockups/catalog/construction-domus-living-coral.png";
import constructionDomusIceBlue from "@/assets/mockups/catalog/construction-domus-ice-blue.png";
import constructionDomusRoseGold from "@/assets/mockups/catalog/construction-domus-rose-gold.png";
import plumberIdroProntoStyleA from "@/assets/mockups/catalog/plumber-idro-pronto-style-a.png";
import plumberIdroProntoStyleB from "@/assets/mockups/catalog/plumber-idro-pronto-style-b.png";

// Batch 3 — stronger style separation across food / beauty / fitness / childcare / travel
import foodOnyxIvory from "@/assets/mockups/catalog/food-onyx-ivory.png";
import foodSakuraSakura from "@/assets/mockups/catalog/food-sakura-sakura.png";
import foodSakuraLuxuryDark from "@/assets/mockups/catalog/food-sakura-luxury-dark.png";
import foodIndocinaNeonSpice from "@/assets/mockups/catalog/food-indocina-neon-spice.png";
import foodPacificoCosta from "@/assets/mockups/catalog/food-pacifico-costa.png";
import foodLevanteDeli from "@/assets/mockups/catalog/food-levante-deli.png";
import foodBraceKebab from "@/assets/mockups/catalog/food-brace-kebab.png";
import beautyVellutoEditorial from "@/assets/mockups/catalog/beauty-velluto-editorial.png";
import fitnessOndaAqua from "@/assets/mockups/catalog/fitness-onda-aqua.png";
import childcareArcobalenoBauhaus from "@/assets/mockups/catalog/childcare-arcobaleno-bauhaus.png";
import hospitalityCalaVentoSunset from "@/assets/mockups/catalog/hospitality-cala-vento-sunset.png";
import nccMarinaAmalfiStyleB from "@/assets/mockups/catalog/ncc-marina-amalfi-style-b.png";

type RegistryKey = `${IndustryId}::${string}::${string}`;

/** Slug a display string to lowercase-kebab. */
function slug(v: string): string {
  return v.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Build a stable key from sector / brand / style triple. */
function key(sector: IndustryId, brand: string, style: string): RegistryKey {
  return `${sector}::${slug(brand)}::${slug(style)}`;
}

/**
 * Registry table. Add new AI-generated hero mockups here — the catalogue
 * picks them up automatically via `catalogMockupUrl()`.
 */
export const CATALOG_MOCKUPS: Partial<Record<RegistryKey, string>> = {
  [key("food", "Onyx Brace Steakhouse", "Obsidian")]: foodOnyxObsidian,
  [key("food", "Onyx Brace Steakhouse", "Ivory")]: foodOnyxIvory,
  [key("food", "Onyx Brace Steakhouse", "Hanok")]: foodSakuraSakura,
  [key("food", "Onyx Brace Steakhouse", "Gangnam")]: foodIndocinaNeonSpice,
  [key("food", "Onyx Brace Steakhouse", "Joseon")]: foodSakuraLuxuryDark,
  [key("food", "Sakura Atelier", "Sakura")]: foodSakuraSakura,
  [key("food", "Sakura Atelier", "Luxury Dark")]: foodSakuraLuxuryDark,
  [key("food", "Sakura Atelier", "White Clean")]: foodOnyxIvory,
  [key("food", "Sakura Atelier", "Miami Ocean")]: foodPacificoCosta,
  [key("food", "Sakura Atelier", "Pearl Gold")]: foodLevanteDeli,
  [key("food", "Sakura Atelier", "Marble Zen")]: foodSakuraSakura,
  [key("food", "Sakura Atelier", "Champagne Rose")]: beautyAuroraLavender,
  [key("food", "Sakura Atelier", "Arctic Crystal")]: healthcareLumenGlass,
  [key("food", "Sakura Atelier", "Tsukiji Ice")]: foodSakuraLuxuryDark,
  [key("food", "Sakura Atelier", "Sakura Garden")]: veterinaryTropicoResort,
  [key("food", "Sakura Atelier", "Wabi Sabi Marble")]: foodSakuraSakura,
  [key("food", "Sakura Atelier", "Hinoki Frost")]: hospitalityCalaVentoAzure,
  [key("food", "Indocina Noir", "Noir Saigon")]: foodSakuraLuxuryDark,
  [key("food", "Indocina Noir", "Jade Dynasty")]: foodLevanteDeli,
  [key("food", "Indocina Noir", "Crimson Silk")]: foodBraceKebab,
  [key("food", "Indocina Noir", "Golden Hour")]: hospitalityCalaVentoSunset,
  [key("food", "Indocina Noir", "Neon Spice")]: foodIndocinaNeonSpice,
  [key("food", "Indocina Noir", "Matcha Blaze")]: fitnessOndaAqua,
  [key("food", "Indocina Noir", "Obsidian Gold")]: foodOnyxObsidian,
  [key("food", "Pacifico Ceviche", "Costa Pacifico")]: foodPacificoCosta,
  [key("food", "Pacifico Ceviche", "Casa Nostra")]: foodOnyxIvory,
  [key("food", "Pacifico Ceviche", "Bianco Memoria")]: foodSakuraSakura,
  [key("food", "Pacifico Ceviche", "Ocra Lima")]: foodLevanteDeli,
  [key("food", "Levante Deli", "Style A")]: foodLevanteDeli,
  [key("food", "Levante Deli", "Style B")]: foodPacificoCosta,
  [key("food", "Levante Deli", "Style C")]: foodSakuraSakura,
  [key("food", "Levante Deli", "Style D")]: foodOnyxIvory,
  [key("food", "Levante Deli", "Style E")]: hospitalityCalaVentoSunset,
  [key("food", "Levante Deli", "Style F")]: beautyAuroraLavender,
  [key("food", "Levante Deli", "Style H")]: foodIndocinaNeonSpice,
  [key("food", "Brace Kebab", "Default")]: foodBraceKebab,
  [key("beauty", "Aurora Nail Atelier", "Lavender Luxe")]: beautyAuroraLavender,
  [key("beauty", "Aurora Nail Atelier", "Blush Rosegold")]: beautyVellutoEditorial,
  [key("beauty", "Velluto Hair Lab", "Mobile")]: beautyVellutoEditorial,
  [key("beauty", "Velluto Hair Lab", "Desktop")]: beautyAuroraLavender,
  [key("ncc", "Marina Riviera", "Style A")]: nccMarinaRiviera,
  [key("ncc", "Marina Riviera", "Style C")]: nccMarinaAmalfiStyleB,
  [key("ncc", "Marina Riviera", "Style F")]: hospitalityCalaVentoSunset,
  [key("ncc", "Marina Riviera", "Style G")]: hospitalityCalaVentoAzure,
  [key("ncc", "Marina Riviera", "Style H")]: nccMarinaRiviera,
  [key("veterinary", "Tropico Pet Resort", "Style A")]: veterinaryTropicoResort,
  [key("veterinary", "Tropico Pet Resort", "Style E")]: childcareStellePlayful,
  [key("veterinary", "Tropico Pet Resort", "Style F")]: veterinaryTropicoResort,
  [key("childcare", "Stelle Nursery", "Playful Colorful")]: childcareStellePlayful,
  [key("childcare", "Stelle Nursery", "Nature Explorer")]: veterinaryTropicoResort,
  [key("childcare", "Stelle Nursery", "Ocean Breeze")]: hospitalityCalaVentoAzure,
  [key("childcare", "Stelle Nursery", "Sunny Garden")]: childcareArcobalenoBauhaus,
  [key("childcare", "Stelle Nursery", "Sunset Playful")]: hospitalityCalaVentoSunset,
  [key("childcare", "Arcobaleno Playhouse", "Style A")]: childcareArcobalenoBauhaus,
  [key("fitness", "Centro Padel Brera", "Sage Luxe")]: fitnessPadelSage,
  [key("fitness", "Centro Padel Brera", "Fresh Azzurro")]: fitnessOndaAqua,
  [key("fitness", "Onda Sport Club", "Wave Pro")]: fitnessOndaAqua,
  [key("healthcare", "Lumen Clinic", "Ethereal Glass")]: healthcareLumenGlass,
  [key("healthcare", "Lumen Clinic", "Azure Gradient")]: hospitalityCalaVentoAzure,
  [key("healthcare", "Lumen Clinic", "Ice Crystal")]: healthcareLumenGlass,
  [key("healthcare", "Lumen Clinic", "Soft Blue")]: nccMarinaRiviera,
  [key("hospitality", "Cala Vento Charter", "Sardinia Azure")]: hospitalityCalaVentoAzure,
  [key("hospitality", "Cala Vento Charter", "Sunset Suite")]: hospitalityCalaVentoSunset,
  [key("ncc", "Cala Vento Charter", "Emerald Cove")]: hospitalityCalaVentoAzure,
  [key("ncc", "Cala Vento Charter", "Golden Sunset")]: hospitalityCalaVentoSunset,
  [key("ncc", "Cala Vento Charter", "Sardinia Azure Desktop")]: hospitalityCalaVentoAzure,
  [key("ncc", "Cala Vento Charter", "Emerald Cove Desktop")]: hospitalityCalaVentoSunset,
  [key("construction", "Domus Living", "Ocean Azure")]: constructionDomusOceanAzure,
  [key("construction", "Domus Living", "Living Coral")]: constructionDomusLivingCoral,
  [key("construction", "Domus Living", "Ice Blue")]: constructionDomusIceBlue,
  [key("construction", "Domus Living", "Rose Gold")]: constructionDomusRoseGold,
  [key("plumber", "Idro Pronto", "Style A")]: plumberIdroProntoStyleA,
  [key("plumber", "Idro Pronto", "Style B")]: plumberIdroProntoStyleB,
};

/**
 * Returns the real AI-generated mockup URL for a (sector, brand, style)
 * triple, or `null` if no override exists — callers fall back to the
 * legacy SVG cover.
 */
export function catalogMockupUrl(
  sector: IndustryId,
  brand: string,
  style: string,
): string | null {
  return CATALOG_MOCKUPS[key(sector, brand, style)] ?? null;
}

/**
 * Convenience: returns true when at least one AI mockup exists for the
 * given (sector, brand) — used by the catalogue to prioritise cards.
 */
export function brandHasCatalogMockup(sector: IndustryId, brand: string): boolean {
  const prefix = `${sector}::${slug(brand)}::`;
  return Object.keys(CATALOG_MOCKUPS).some((k) => k.startsWith(prefix));
}
