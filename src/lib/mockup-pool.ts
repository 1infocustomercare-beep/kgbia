/**
 * Global mockup pool — guarantees zero repetition across homepage sections.
 * Each call to `take(n)` removes those mockups from the global pool so the next
 * section automatically receives fresh assets.
 */
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import type { IndustryId } from "@/config/industry-config";

export type SectorPick = { sector: IndustryId; image: string };

function buildInterleavedPool(): SectorPick[] {
  const sectors = Object.keys(SECTOR_MOCKUP_IMAGES) as IndustryId[];
  const lists: { sector: IndustryId; imgs: string[] }[] = sectors
    .map((s) => ({ sector: s, imgs: (SECTOR_MOCKUP_IMAGES[s] ?? []).slice() }))
    .filter((x) => x.imgs.length > 0);

  // Round-robin interleave so consecutive picks come from different sectors
  const out: SectorPick[] = [];
  let added = true;
  let idx = 0;
  while (added) {
    added = false;
    for (const l of lists) {
      if (l.imgs[idx]) {
        out.push({ sector: l.sector, image: l.imgs[idx] });
        added = true;
      }
    }
    idx++;
  }
  return out;
}

export function createMockupPool() {
  const pool = buildInterleavedPool();
  let cursor = 0;

  return {
    take(n: number): SectorPick[] {
      if (!pool.length) return [];
      const out: SectorPick[] = [];
      for (let i = 0; i < n; i++) {
        out.push(pool[(cursor + i) % pool.length]);
      }
      cursor = (cursor + n) % pool.length;
      return out;
    },
    images(n: number): string[] {
      return this.take(n).map((p) => p.image);
    },
    size: pool.length,
  };
}
