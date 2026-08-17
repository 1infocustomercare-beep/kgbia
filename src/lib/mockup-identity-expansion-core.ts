/**
 * Empire — CORE per l'espansione della matrice mockup.
 * DSL compatta per dichiarare identità visive uniche (20+ per settore)
 * senza duplicare mai famiglia, materia, luce, fondale, staging o motivo.
 */
import type { MockupIdentity, ScreenSpec, SectorKey, SurfaceSignature } from "./mockup-identity-matrix";

export type ExpansionRow = {
  identity: MockupIdentity;
  surface: SurfaceSignature;
};

/**
 * @param screens formato: "key|Titolo|scopo|el·el·el" — prefisso "D:" per desktop
 * @param surf    formato: "materia|luce|fondale|staging|motivo"
 */
export function X(
  sector: SectorKey,
  id: string,
  family: string,
  label: string,
  brand: string,
  tagline: string,
  /** "bg,surface,text,muted,accent,accent2" */
  palette: string,
  /** "display|body|trattamento" */
  typography: string,
  /** "radius|border|grid|density" */
  geometry: string,
  /** "nav|light|signature" */
  chrome: string,
  photography: string,
  composition: string,
  surf: string,
  screens: string[],
): ExpansionRow {
  const [bg, surface, text, muted, accent, accent2] = palette.split(",").map((s) => s.trim());
  const [display, body, treatment] = typography.split("|").map((s) => s.trim());
  const [radius, border, grid, density] = geometry.split("|").map((s) => s.trim());
  const [nav, statusBar, signature] = chrome.split("|").map((s) => s.trim());
  const [material, light, backdrop, staging, motif] = surf.split("|").map((s) => s.trim());

  const parsed: ScreenSpec[] = screens.map((raw) => {
    const isDesktop = raw.startsWith("D:");
    const [key, title, purpose, els] = (isDesktop ? raw.slice(2) : raw).split("|").map((s) => s.trim());
    return {
      key,
      title,
      purpose,
      elements: els.split("·").map((s) => s.trim()),
      surface: isDesktop ? "desktop" : "mobile",
    };
  });

  return {
    identity: {
      id, sector, family: family as MockupIdentity["family"], label, brand, tagline,
      palette: { bg, surface, text, muted, accent, accent2 },
      typography: { display, body, treatment },
      geometry: { radius, border, grid, density: density as MockupIdentity["geometry"]["density"] },
      chrome: { nav, statusBar: statusBar as "light" | "dark", signature },
      photography, composition,
      screens: parsed,
    },
    surface: { material, light, backdrop, staging, motif },
  };
}
