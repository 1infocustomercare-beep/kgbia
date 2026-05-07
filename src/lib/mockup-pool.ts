/**
 * Global mockup pool — guarantees zero repetition across homepage sections.
 * Each call to `take(n)` removes those mockups from the global pool so the next
 * section automatically receives fresh assets.
 */
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import type { IndustryId } from "@/config/industry-config";

export type SectorPick = { sector: IndustryId; image: string };

/**
 * Curated allowlist of "premium" sectors only — excludes the weaker
 * locally generated mockups (electrician, gardening, tattoo, etc.) so the
 * homepage shows ONLY the polished Lowengeld brand variants.
 */
const PREMIUM_SECTORS: IndustryId[] = [
  "food",
  "beauty",
  "ncc",
  "fitness",
  "hospitality",
  "healthcare",
  "veterinary",
  "childcare",
  "construction",
  "retail",
];

function isLocalAsset(url: string): boolean {
  // Locally bundled mockups come through Vite as /src/... or /assets/... after build
  return !/^https?:\/\//.test(url);
}

function buildInterleavedPool(opts: { premiumOnly?: boolean } = {}): SectorPick[] {
  const allSectors = Object.keys(SECTOR_MOCKUP_IMAGES) as IndustryId[];
  const sectors = opts.premiumOnly
    ? allSectors.filter((s) => PREMIUM_SECTORS.includes(s))
    : allSectors;

  const lists: { sector: IndustryId; imgs: string[] }[] = sectors
    .map((s) => ({
      sector: s,
      imgs: (SECTOR_MOCKUP_IMAGES[s] ?? []).filter(
        (img) => !opts.premiumOnly || !isLocalAsset(img),
      ),
    }))
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

function shuffleInPlace<T>(arr: T[], seed = Date.now()): T[] {
  // Mulberry32 PRNG so we can vary shuffle across visits but stay deterministic per session
  let s = seed >>> 0;
  const rnd = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function createMockupPool(opts: { shuffle?: boolean; seed?: number; premiumOnly?: boolean } = {}) {
  let pool = buildInterleavedPool({ premiumOnly: opts.premiumOnly ?? true });
  if (opts.shuffle) pool = shuffleInPlace(pool, opts.seed);
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

