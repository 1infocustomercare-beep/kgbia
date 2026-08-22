/**
 * Empire — PONTE RIFERIMENTI LOWENGELD.
 *
 * Il portfolio Lowengeld è stato archiviato per intero in `public/lowengeld-refs`
 * (57 mockup, catalogati in `src/data/lowengeld-styles.ts`). Questo modulo lega
 * ogni riferimento alle identità Empire dello stesso settore, così ogni prompt
 * di generazione porta con sé:
 *  - il livello qualitativo del riferimento (palette, vibe, tipo di schermate);
 *  - l'obbligo di DIFFERENZIARSI: mai lo stesso nome brand, mai la stessa palette
 *    identica, sempre un elemento in più rispetto al riferimento.
 *
 * Nessun asset del riferimento viene ridistribuito: serve solo come brief interno.
 */
import { LOWENGELD_STYLES, type LowengeldStyle } from "@/data/lowengeld-styles";
import type { MockupIdentity, SectorKey } from "./mockup-identity-matrix";

/** Settori del catalogo Lowengeld → settori del registro Empire. */
const SECTOR_BRIDGE: Record<LowengeldStyle["sector"], SectorKey[]> = {
  food: ["food"],
  beauty: ["beauty"],
  pet: ["petcare"],
  fitness: ["fitness", "golf"],
  ncc: ["ncc"],
  hospitality: ["hospitality", "events"],
  real_estate: ["realestate", "condo"],
  construction: ["homeservices"],
  healthcare: ["healthcare"],
  retail: ["retail"],
  professional: ["legal", "aiservices"],
  childcare: ["childcare", "education"],
  automotive: ["ncc"],
  wellness: ["beauty", "fitness"],
  events: ["events"],
  nautical: ["watersports", "equestrian"],
};

export type LowengeldBrief = {
  slug: string;
  styleName: string;
  palette: string;
  vibe: string;
  screens: string[];
  avoidBrand: string;
};

const briefOf = (s: LowengeldStyle): LowengeldBrief => ({
  slug: s.slug,
  styleName: s.style_name,
  palette: s.palette,
  vibe: s.vibe,
  screens: [...s.screen_labels],
  avoidBrand: s.brand_original,
});

/** Tutti i riferimenti disponibili per un settore Empire. */
export function referencesForSector(sector: SectorKey): LowengeldBrief[] {
  return LOWENGELD_STYLES.filter((s) => (SECTOR_BRIDGE[s.sector] ?? []).includes(sector)).map(briefOf);
}

/**
 * Riferimenti assegnati a una identità: distribuiti in modo deterministico
 * (round-robin sull'indice dell'identità nel settore) così che identità diverse
 * dello stesso settore guardino riferimenti diversi e non convergano.
 */
export function referencesForIdentity(
  identity: MockupIdentity,
  indexInSector: number,
  count = 2,
): LowengeldBrief[] {
  const pool = referencesForSector(identity.sector);
  if (!pool.length) return [];
  return Array.from({ length: Math.min(count, pool.length) }, (_, k) =>
    pool[(indexInSector * count + k) % pool.length]);
}

/** Blocco testuale da appendere al prompt di generazione. */
export function buildReferenceBrief(refs: LowengeldBrief[]): string {
  if (!refs.length) return "";
  const lines = refs.map(
    (r) => `· "${r.styleName}" — palette ${r.palette}; carattere: ${r.vibe} Schermate tipiche: ${r.screens.join(", ")}.`,
  );
  return [
    "Livello qualitativo di riferimento (benchmark interno, da SUPERARE non copiare):",
    ...lines,
    `Obbligo di differenziazione: palette diversa da quelle citate almeno nel colore dominante, tipografia diversa, almeno una funzione in più rispetto alle schermate tipiche. Vietato usare i nomi ${refs
      .map((r) => `"${r.avoidBrand}"`)
      .join(", ")} o qualsiasi nome non italiano.`,
  ].join("\n");
}

/** Copertura: ogni riferimento archiviato viene effettivamente usato da almeno una identità. */
export function referenceCoverage(identitiesBySector: Record<SectorKey, MockupIdentity[]>) {
  const used = new Set<string>();
  (Object.keys(identitiesBySector) as SectorKey[]).forEach((sector) => {
    identitiesBySector[sector].forEach((identity, i) => {
      referencesForIdentity(identity, i).forEach((r) => used.add(r.slug));
    });
  });
  const missing = LOWENGELD_STYLES.map((s) => s.slug).filter((s) => !used.has(s));
  return { ok: missing.length === 0, total: LOWENGELD_STYLES.length, used: used.size, missing };
}
