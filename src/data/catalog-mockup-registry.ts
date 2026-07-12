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

// Batch 1 — Phase 1 hero mockups (8 sectors, top style each)
import foodOnyxObsidian from "@/assets/mockups/catalog/food-onyx-obsidian.png";
import beautyAuroraLavender from "@/assets/mockups/catalog/beauty-aurora-lavender.png";
import nccMarinaRiviera from "@/assets/mockups/catalog/ncc-marina-riviera.png";
import veterinaryTropicoResort from "@/assets/mockups/catalog/veterinary-tropico-resort.png";
import childcareStellePlayful from "@/assets/mockups/catalog/childcare-stelle-playful.png";
import fitnessPadelSage from "@/assets/mockups/catalog/fitness-padel-sage.png";
import healthcareLumenGlass from "@/assets/mockups/catalog/healthcare-lumen-glass.png";
import hospitalityCalaVentoAzure from "@/assets/mockups/catalog/hospitality-cala-vento-azure.png";

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
  [key("beauty", "Aurora Nail Atelier", "Lavender Luxe")]: beautyAuroraLavender,
  [key("ncc", "Marina Riviera", "Style A")]: nccMarinaRiviera,
  [key("veterinary", "Tropico Pet Resort", "Style A")]: veterinaryTropicoResort,
  [key("childcare", "Stelle Nursery", "Playful Colorful")]: childcareStellePlayful,
  [key("fitness", "Centro Padel Brera", "Sage Luxe")]: fitnessPadelSage,
  [key("healthcare", "Lumen Clinic", "Ethereal Glass")]: healthcareLumenGlass,
  [key("hospitality", "Cala Vento Charter", "Sardinia Azure")]: hospitalityCalaVentoAzure,
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
