import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import type { IndustryId } from "@/config/industry-config";

/**
 * Mockup rotation helper — guarantees that the same sector mockup is NEVER
 * repeated across different homepage slots (hero / showcase / reel / proof).
 * Each slot has a stable offset so re-renders are deterministic.
 */
const SLOT_OFFSET = {
  hero: 0,
  showcase: 2,
  reel: 5,
  proof: 7,
  case: 3,
} as const;

export type MockupSlot = keyof typeof SLOT_OFFSET;

export function pickMockup(sector: IndustryId, slot: MockupSlot, extra = 0): string | undefined {
  const list = SECTOR_MOCKUP_IMAGES[sector];
  if (!list || !list.length) return undefined;
  const offset = (SLOT_OFFSET[slot] + extra) % list.length;
  return list[offset];
}

/**
 * Returns N distinct images for a single slot from a sector,
 * starting from the slot offset (no repeats unless list is too small).
 */
export function pickMockupSet(sector: IndustryId, slot: MockupSlot, count: number): string[] {
  const list = SECTOR_MOCKUP_IMAGES[sector];
  if (!list || !list.length) return [];
  const start = SLOT_OFFSET[slot] % list.length;
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(list[(start + i) % list.length]);
  }
  return out;
}
