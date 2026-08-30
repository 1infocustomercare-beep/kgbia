/**
 * Desktop mockup nativi per settore.
 *
 * Ogni immagine è uno screenshot 16:10 di una webapp desktop reale (non un
 * ritaglio di uno screen mobile), così le cornici Desktop/iPad del portfolio
 * mostrano un layout coerente — come sui case study di riferimento.
 *
 * ADDITIVO: non sostituisce `sector-mockups.ts`, lo completa.
 */
import foodDesktop from "@/assets/mockups/desktop/food-desktop.jpg";
import beautyDesktop from "@/assets/mockups/desktop/beauty-desktop.jpg";
import nccDesktop from "@/assets/mockups/desktop/ncc-desktop.jpg";
import hospitalityDesktop from "@/assets/mockups/desktop/hospitality-desktop.jpg";
import fitnessDesktop from "@/assets/mockups/desktop/fitness-desktop.jpg";
import healthcareDesktop from "@/assets/mockups/desktop/healthcare-desktop.jpg";
import veterinaryDesktop from "@/assets/mockups/desktop/veterinary-desktop.jpg";
import childcareDesktop from "@/assets/mockups/desktop/childcare-desktop.jpg";
import constructionDesktop from "@/assets/mockups/desktop/construction-desktop.jpg";
import plumberDesktop from "@/assets/mockups/desktop/plumber-desktop.jpg";
import retailDesktop from "@/assets/mockups/desktop/retail-desktop.jpg";

export const SECTOR_DESKTOP_SHOT: Record<string, string> = {
  food: foodDesktop,
  beauty: beautyDesktop,
  ncc: nccDesktop,
  hospitality: hospitalityDesktop,
  fitness: fitnessDesktop,
  healthcare: healthcareDesktop,
  veterinary: veterinaryDesktop,
  childcare: childcareDesktop,
  construction: constructionDesktop,
  plumber: plumberDesktop,
  retail: retailDesktop,
};

export function getSectorDesktopShot(sectorId?: string | null): string | undefined {
  if (!sectorId) return undefined;
  return SECTOR_DESKTOP_SHOT[sectorId];
}
