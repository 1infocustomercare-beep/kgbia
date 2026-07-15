/**
 * Catalog Mockup Registry — real premium AI-generated iPhone screens
 * (Nano Banana Pro / gemini-3-pro-image) for the `/portfolio` catalogue.
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
...
export const CATALOG_MOCKUPS: Partial<Record<RegistryKey, string>> = {
  [key("food", "Onyx Brace Steakhouse", "Obsidian")]: foodOnyxObsidian,
  [key("food", "Onyx Brace Steakhouse", "Ivory")]: foodOnyxIvory,
  [key("food", "Sakura Atelier", "Sakura")]: foodSakuraSakura,
  [key("food", "Sakura Atelier", "Luxury Dark")]: foodSakuraLuxuryDark,
  [key("food", "Indocina Noir", "Neon Spice")]: foodIndocinaNeonSpice,
  [key("food", "Pacifico Ceviche", "Costa Pacifico")]: foodPacificoCosta,
  [key("food", "Levante Deli", "Levant Gold")]: foodLevanteDeli,
  [key("food", "Brace Kebab", "Street Deluxe")]: foodBraceKebab,
  [key("beauty", "Aurora Nail Atelier", "Lavender Luxe")]: beautyAuroraLavender,
  [key("beauty", "Velluto Hair Lab", "Editorial Velvet")]: beautyVellutoEditorial,
  [key("ncc", "Marina Riviera", "Style A")]: nccMarinaRiviera,
  [key("ncc", "Marina Riviera", "Style B")]: nccMarinaAmalfiStyleB,
  [key("veterinary", "Tropico Pet Resort", "Style A")]: veterinaryTropicoResort,
  [key("childcare", "Stelle Nursery", "Playful Colorful")]: childcareStellePlayful,
  [key("childcare", "Arcobaleno Playhouse", "Style A")]: childcareArcobalenoBauhaus,
  [key("fitness", "Centro Padel Brera", "Sage Luxe")]: fitnessPadelSage,
  [key("fitness", "Onda Sport Club", "Wave Pro")]: fitnessOndaAqua,
  [key("healthcare", "Lumen Clinic", "Ethereal Glass")]: healthcareLumenGlass,
  [key("hospitality", "Cala Vento Charter", "Sardinia Azure")]: hospitalityCalaVentoAzure,
  [key("hospitality", "Cala Vento Charter", "Sunset Suite")]: hospitalityCalaVentoSunset,
  // Batch 2
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
