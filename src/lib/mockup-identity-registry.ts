/**
 * Empire — REGISTRO COMPLETO delle identità mockup.
 * Unisce la matrice base con i moduli di espansione per sotto-settore
 * (pizzeria, braceria, rosticceria, gelateria… e così via per ogni settore).
 * Regola: famiglia, materia, luce, fondale, staging e motivo sono UNICI.
 */
import {
  IDENTITY_MATRIX, SURFACE_SIGNATURES, SECTOR_LABELS,
  type MockupIdentity, type SectorKey, type SurfaceSignature,
} from "./mockup-identity-matrix";
import type { ExpansionRow } from "./mockup-identity-expansion-core";
import { FOOD_EXPANSION } from "./mockup-identity-expansion-food";
import { BEAUTY_EXPANSION } from "./mockup-identity-expansion-beauty";
import { NCC_EXPANSION } from "./mockup-identity-expansion-ncc";
import { FITNESS_EXPANSION } from "./mockup-identity-expansion-fitness";
import { HOSPITALITY_EXPANSION } from "./mockup-identity-expansion-hospitality";
import { REALESTATE_EXPANSION } from "./mockup-identity-expansion-realestate";
import { HEALTHCARE_EXPANSION } from "./mockup-identity-expansion-healthcare";
import { WAVE2_A } from "./mockup-identity-expansion-wave2-a";
import { WAVE2_B } from "./mockup-identity-expansion-wave2-b";
import { WAVE2_C } from "./mockup-identity-expansion-wave2-c";

const EXPANSIONS: ExpansionRow[] = [
  ...FOOD_EXPANSION, ...BEAUTY_EXPANSION, ...NCC_EXPANSION, ...FITNESS_EXPANSION,
  ...HOSPITALITY_EXPANSION, ...REALESTATE_EXPANSION, ...HEALTHCARE_EXPANSION,
  ...WAVE2_A, ...WAVE2_B, ...WAVE2_C,
];

/** Firme di superficie complete (base + espansioni). */
export const FULL_SURFACE_SIGNATURES: Record<string, SurfaceSignature> = {
  ...SURFACE_SIGNATURES,
  ...Object.fromEntries(EXPANSIONS.map((r) => [r.identity.family, r.surface])),
};

/** Matrice completa per settore. */
export const FULL_IDENTITY_MATRIX: Record<SectorKey, MockupIdentity[]> = (() => {
  const out = Object.fromEntries(
    (Object.keys(IDENTITY_MATRIX) as SectorKey[]).map((k) => [k, [...IDENTITY_MATRIX[k]]]),
  ) as Record<SectorKey, MockupIdentity[]>;
  EXPANSIONS.forEach((r) => out[r.identity.sector].push(r.identity));
  return out;
})();

export const FULL_IDENTITIES: MockupIdentity[] = Object.values(FULL_IDENTITY_MATRIX).flat();

export { SECTOR_LABELS };

export function getFullIdentities(sector: SectorKey): MockupIdentity[] {
  return FULL_IDENTITY_MATRIX[sector] ?? [];
}

export function getFullIdentity(id: string): MockupIdentity | undefined {
  return FULL_IDENTITIES.find((i) => i.id === id);
}

/** Validazione: nessuna famiglia o firma riusata, ogni settore con copertura minima. */
export function assertRegistryIntegrity(minPerSector = 20) {
  const famCount = new Map<string, number>();
  FULL_IDENTITIES.forEach((i) => famCount.set(i.family, (famCount.get(i.family) ?? 0) + 1));
  const duplicateFamilies = [...famCount].filter(([, n]) => n > 1).map(([f]) => f);

  const surfaceDuplicates: string[] = [];
  (["material", "light", "backdrop", "staging", "motif"] as const).forEach((k) => {
    const bag = new Map<string, string[]>();
    Object.entries(FULL_SURFACE_SIGNATURES).forEach(([f, s]) => {
      bag.set(s[k], [...(bag.get(s[k]) ?? []), f]);
    });
    bag.forEach((fams, v) => { if (fams.length > 1) surfaceDuplicates.push(`${k}="${v}" → ${fams.join(", ")}`); });
  });

  const missingSurface = FULL_IDENTITIES.filter((i) => !FULL_SURFACE_SIGNATURES[i.family]).map((i) => i.id);
  const totals = Object.fromEntries(
    (Object.keys(FULL_IDENTITY_MATRIX) as SectorKey[]).map((k) => [k, FULL_IDENTITY_MATRIX[k].length]),
  ) as Record<SectorKey, number>;
  const underMin = Object.entries(totals).filter(([, n]) => n < minPerSector).map(([k, n]) => `${k}:${n}`);

  return {
    ok: !duplicateFamilies.length && !surfaceDuplicates.length && !missingSurface.length && !underMin.length,
    duplicateFamilies, surfaceDuplicates, missingSurface, underMin, totals,
    total: FULL_IDENTITIES.length,
  };
}
