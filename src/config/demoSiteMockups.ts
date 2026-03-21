// ══════════════════════════════════════════════════════════════
// DEMO SITE MOCKUPS — 583 professional AI-generated mockups
// All hosted on Supabase Storage (public, no auth required)
// ══════════════════════════════════════════════════════════════

const BASE = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

export interface MockupImage {
  url: string;
  type: "home" | "menu" | "services" | "detail" | "cart" | "booking" | "contact" | "portfolio" | "classes" | "rooms" | "programs" | "team" | "enroll" | "membership" | "projects" | "products" | "other";
  style: string;
  device: "mobile" | "desktop";
}

export interface MockupProject {
  name: string;
  slug: string;
  images: MockupImage[];
  inspiration?: string;
}

export interface SectorMockups {
  sectorId: string;
  label: string;
  projects: MockupProject[];
  designReferences: string[];
  heroImage: string; // Best image to use as sector hero
  totalCount: number;
}

// ── Helper to build URLs ──
const m = (path: string) => `${BASE}/${path}`;

// ── Helper for Midtown-style projects (style-a through style-h, 4 pages each) ──
function midtownStyleImages(folder: string, styles: string[], pages: string[], device: "mobile" | "desktop"): MockupImage[] {
  return styles.flatMap(style =>
    pages.map(page => ({
      url: m(`${folder}/${device === "mobile" ? "mobile" : "style"}-${style}-${page}.png`),
      type: page as MockupImage["type"],
      style,
      device,
    }))
  );
}

// ── Helper for standard 4-page projects ──
function standardPages(folder: string, styles: string[], pages: string[], device: "mobile" | "desktop"): MockupImage[] {
  return styles.flatMap(style =>
    pages.map(page => ({
      url: m(`${folder}/mobile-${style}-${page}.png`),
      type: page as MockupImage["type"],
      style,
      device,
    }))
  );
}

// ═══════════════════════════════════════════
// 1. FOOD & RISTORAZIONE (279 mockup)
// ═══════════════════════════════════════════
const FOOD_PROJECTS: MockupProject[] = [
  {
    name: "Cote Miami",
    slug: "cote-miami",
    inspiration: "cotemiami.com",
    images: [
      ...midtownStyleImages("cote-miami", ["a","b","c","d","e","f","g","h"], ["home","menu","detail","cart"], "mobile"),
      ...midtownStyleImages("cote-miami", ["a","b","c","d","e","f"], ["home","menu","detail","cart"], "desktop"),
    ],
  },
  {
    name: "Paperfish Sushi",
    slug: "paperfish-sushi",
    inspiration: "paperfishshushi.com",
    images: [
      ...midtownStyleImages("paperfish-sushi", ["a","b","c","d","e","f","g","h"], ["home","menu","detail","cart"], "mobile"),
      ...midtownStyleImages("paperfish-sushi", ["a","b","c","d","e","f"], ["home","menu","detail","cart"], "desktop"),
    ],
  },
  {
    name: "Midtown Kosher",
    slug: "midtown-kosher",
    inspiration: "midtownkosher.com",
    images: [
      ...midtownStyleImages("Midtown%20Kosher", ["a","b","c","d","e","f","g","h"], ["home","menu","detail","cart"], "mobile"),
      ...midtownStyleImages("Midtown%20Kosher", ["a","b","c","d","e","f"], ["home","menu","detail","cart"], "desktop"),
    ],
  },
  {
    name: "La Vang Vietnamese Luxury",
    slug: "la-vang-vietnamese-luxury",
    images: [
      ...midtownStyleImages("la-vang-vietnamese-luxury", ["a","b","c","d","e","f","g","h"], ["home","menu","detail","cart"], "mobile"),
      ...midtownStyleImages("la-vang-vietnamese-luxury", ["a","b","c","d","e","f"], ["home","menu","detail","cart"], "desktop"),
    ],
  },
  {
    name: "Batey Cevicheria Urbana",
    slug: "batey-cevicheria-urbana",
    images: [
      ...midtownStyleImages("batey-cevicheria-urbana", ["a","b","c","d","e","f","g","h"], ["home","menu","detail","cart"], "mobile"),
    ],
  },
  {
    name: "Flame Kebab",
    slug: "flame-kebab",
    images: [
      { url: m("flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png"), type: "home", style: "a", device: "mobile" },
      { url: m("flame-kebab/a1b2c3d4-home-2.png"), type: "home", style: "b", device: "mobile" },
      { url: m("flame-kebab/e5f6g7h8-menu.png"), type: "menu", style: "a", device: "mobile" },
      { url: m("flame-kebab/i9j0k1l2-detail.png"), type: "detail", style: "a", device: "mobile" },
      { url: m("flame-kebab/m3n4o5p6-cart.png"), type: "cart", style: "a", device: "mobile" },
    ],
  },
  {
    name: "Otomaki Sushi",
    slug: "otomaki-sushi",
    images: Array.from({ length: 16 }, (_, i) => ({
      url: m(`migrated-1773167901906-9e1e562a9a71c0a8aed3ac62c7a611a0-177290488${2643 + i}.png`),
      type: (["home", "menu", "detail", "cart"] as const)[i % 4],
      style: String.fromCharCode(97 + Math.floor(i / 4)),
      device: "mobile" as const,
    })),
  },
  {
    name: "La Patrona",
    slug: "la-patrona",
    images: Array.from({ length: 16 }, (_, i) => ({
      url: m(`migrated-1773167903321-8f595dd2f0fbb30d4310e2d299c2f260-177283854${4173 + i}.png`),
      type: (["home", "menu", "detail", "cart"] as const)[i % 4],
      style: String.fromCharCode(97 + Math.floor(i / 4)),
      device: "mobile" as const,
    })),
  },
  {
    name: "Papagua",
    slug: "papagua",
    images: Array.from({ length: 16 }, (_, i) => ({
      url: m(`migrated-1773167904818-09cd270c062b9d2856b48b9f63f7c234-177288110${6900 + i}.png`),
      type: (["home", "menu", "detail", "cart"] as const)[i % 4],
      style: String.fromCharCode(97 + Math.floor(i / 4)),
      device: "mobile" as const,
    })),
  },
];

// ═══════════════════════════════════════════
// 2. NCC & TRASPORTI (16 mockup)
// ═══════════════════════════════════════════
const NCC_PROJECTS: MockupProject[] = [
  {
    name: "Meridia Rental Car",
    slug: "meridia-rental-car",
    inspiration: "nccmilano.com",
    images: [
      ...Array.from({ length: 4 }, (_, i) => ({
        url: m(`migrated-1773167906872-ncc-${i}.png`),
        type: (["home", "services", "detail", "booking"] as const)[i],
        style: "a",
        device: "mobile" as const,
      })),
      ...Array.from({ length: 12 }, (_, i) => ({
        url: m(`meridia-rental-car/37023edeca24-177262101${1473 + i}.png`),
        type: (["home", "services", "detail", "booking"] as const)[i % 4],
        style: String.fromCharCode(97 + Math.floor(i / 4)),
        device: "mobile" as const,
      })),
    ],
  },
];

// ═══════════════════════════════════════════
// 3. BEAUTY & WELLNESS (8 mockup)
// ═══════════════════════════════════════════
const BEAUTY_PROJECTS: MockupProject[] = [
  {
    name: "Neo Nails Brickell",
    slug: "neo-nails-brickell",
    inspiration: "canyonranch.com",
    images: [
      { url: m("Neo%20Nails%20Brickell/lavender-luxe-home.png"), type: "home", style: "lavender-luxe", device: "mobile" },
      { url: m("Neo%20Nails%20Brickell/lavender-luxe-servizi.png"), type: "services", style: "lavender-luxe", device: "mobile" },
      { url: m("Neo%20Nails%20Brickell/lavender-luxe-dettaglio.png"), type: "detail", style: "lavender-luxe", device: "mobile" },
      { url: m("Neo%20Nails%20Brickell/lavender-luxe-booking.png"), type: "booking", style: "lavender-luxe", device: "mobile" },
      { url: m("Neo%20Nails%20Brickell/blush-rosegold-home.png"), type: "home", style: "blush-rosegold", device: "mobile" },
      { url: m("Neo%20Nails%20Brickell/blush-rosegold-servizi.png"), type: "services", style: "blush-rosegold", device: "mobile" },
      { url: m("Neo%20Nails%20Brickell/blush-rosegold-dettaglio.png"), type: "detail", style: "blush-rosegold", device: "mobile" },
      { url: m("Neo%20Nails%20Brickell/blush-rosegold-booking.png"), type: "booking", style: "blush-rosegold", device: "mobile" },
    ],
  },
];

// ═══════════════════════════════════════════
// 4. HEALTHCARE (32 mockup)
// ═══════════════════════════════════════════
const HEALTHCARE_PROJECTS: MockupProject[] = [
  {
    name: "HealthGlow Dermatology",
    slug: "healthglow-dermatology",
    inspiration: "clevelandclinic.org",
    images: standardPages("HealthGlow%20Dermatology", ["a","b","c","d"], ["home","services","detail","booking"], "mobile"),
  },
  {
    name: "ClearView Optometry",
    slug: "clearview-optometry",
    inspiration: "onemedical.com",
    images: standardPages("ClearView%20Optometry", ["a","b","c","d"], ["home","services","detail","booking"], "mobile"),
  },
];

// ═══════════════════════════════════════════
// 5. RETAIL (8 mockup)
// ═══════════════════════════════════════════
const RETAIL_PROJECTS: MockupProject[] = [
  {
    name: "Mercato di Nonna",
    slug: "mercato-di-nonna",
    inspiration: "eataly.com",
    images: [
      { url: m("Mercato%20Di%20Nonna/warm-tuscan-home.png"), type: "home", style: "warm-tuscan", device: "mobile" },
      { url: m("Mercato%20Di%20Nonna/warm-tuscan-products.png"), type: "products", style: "warm-tuscan", device: "mobile" },
      { url: m("Mercato%20Di%20Nonna/warm-tuscan-detail.png"), type: "detail", style: "warm-tuscan", device: "mobile" },
      { url: m("Mercato%20Di%20Nonna/warm-tuscan-cart.png"), type: "cart", style: "warm-tuscan", device: "mobile" },
      { url: m("Mercato%20Di%20Nonna/olive-grove-home.png"), type: "home", style: "olive-grove", device: "mobile" },
      { url: m("Mercato%20Di%20Nonna/olive-grove-products.png"), type: "products", style: "olive-grove", device: "mobile" },
      { url: m("Mercato%20Di%20Nonna/olive-grove-detail.png"), type: "detail", style: "olive-grove", device: "mobile" },
      { url: m("Mercato%20Di%20Nonna/olive-grove-cart.png"), type: "cart", style: "olive-grove", device: "mobile" },
    ],
  },
];

// ═══════════════════════════════════════════
// 6. FITNESS (72 mockup)
// ═══════════════════════════════════════════
const FITNESS_PROJECTS: MockupProject[] = [
  {
    name: "City Padel Milano",
    slug: "city-padel-milano",
    inspiration: "equinox.com",
    images: [
      ...["fresh-azzurro","neon-energy","dark-premium","sunset-warm","minimal-white"].flatMap(style =>
        (["home","classes","detail","membership"] as const).map(page => ({
          url: m(`City%20Padel%20Milano/mobile-${style}-${page}.png`),
          type: page,
          style,
          device: "mobile" as const,
        }))
      ),
      ...["fresh-azzurro","neon-energy","dark-premium","sunset-warm","minimal-white"].flatMap(style =>
        (["home","classes","detail","membership"] as const).map(page => ({
          url: m(`City%20Padel%20Milano/desktop-${style}-${page}.png`),
          type: page,
          style,
          device: "desktop" as const,
        }))
      ),
    ],
  },
  {
    name: "IronForge Gym",
    slug: "ironforge-gym",
    inspiration: "barrys.com",
    images: [
      ...standardPages("IronForge%20Gym", ["a","b","c","d"], ["home","classes","detail","membership"], "mobile"),
      ...["a","b","c","d"].flatMap(style =>
        (["home","classes","detail","membership"] as const).map(page => ({
          url: m(`IronForge%20Gym/desktop-${style}-${page}.png`),
          type: page,
          style,
          device: "desktop" as const,
        }))
      ),
    ],
  },
];

// ═══════════════════════════════════════════
// 7. HOSPITALITY (60 mockup)
// ═══════════════════════════════════════════
const HOSPITALITY_PROJECTS: MockupProject[] = [
  {
    name: "Asinara Charter",
    slug: "asinara-charter",
    inspiration: "aman.com",
    images: [
      ...["azure","coral","sunset"].flatMap(style =>
        (["home","services","detail","booking"] as const).map(page => ({
          url: m(`Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/mobile-${style}-${page}.png`),
          type: page,
          style,
          device: "mobile" as const,
        }))
      ),
      ...["azure","premium"].flatMap(style =>
        (["home","services","detail","booking"] as const).map(page => ({
          url: m(`Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/desktop-${style}-${page}.png`),
          type: page,
          style,
          device: "desktop" as const,
        }))
      ),
    ],
  },
  {
    name: "Grand Palladium Resort",
    slug: "grand-palladium-resort",
    inspiration: "borgoegnazia.com",
    images: standardPages("Grand%20Palladium%20Resort", ["a","b","c","d","e","f"], ["home","rooms","detail","booking"], "mobile"),
  },
  {
    name: "Villa Aurora Toscana",
    slug: "villa-aurora-toscana",
    inspiration: "borgoegnazia.com",
    images: standardPages("Villa%20Aurora%20Toscana", ["a","b","c","d"], ["home","rooms","detail","booking"], "mobile"),
  },
];

// ═══════════════════════════════════════════
// 8. CHILDCARE (36 mockup)
// ═══════════════════════════════════════════
const CHILDCARE_PROJECTS: MockupProject[] = [
  {
    name: "Little Diamond Nursery",
    slug: "little-diamond-nursery",
    images: [
      ...["playful","pastel","rainbow","nature","modern"].flatMap(style =>
        (["home","programs","team","enroll"] as const).map(page => ({
          url: m(`Little%20Diamond%20Nursery%20-%20Playful%20Colorful/mobile-${style}-${page}.png`),
          type: page,
          style,
          device: "mobile" as const,
        }))
      ),
    ],
    inspiration: "kindercare.com",
  },
  {
    name: "Sunshine Academy",
    slug: "sunshine-academy",
    inspiration: "brighthorizons.com",
    images: standardPages("Sunshine%20Academy", ["a","b","c","d"], ["home","programs","team","enroll"], "mobile"),
  },
];

// ═══════════════════════════════════════════
// 9. VETERINARY (32 mockup)
// ═══════════════════════════════════════════
const VETERINARY_PROJECTS: MockupProject[] = [
  {
    name: "Aloha Pet Resorts",
    slug: "aloha-pet-resorts",
    inspiration: "banfield.com",
    images: [
      ...standardPages("Aloha%20Pet%20Resorts", ["a","e","f","g"], ["home","services","detail","booking"], "mobile"),
      ...["a","b","c","d"].flatMap(style =>
        (["home","services","detail","booking"] as const).map(page => ({
          url: m(`Aloha%20Pet%20Resorts/desktop-${style}-${page}.png`),
          type: page,
          style,
          device: "desktop" as const,
        }))
      ),
    ],
  },
];

// ═══════════════════════════════════════════
// 10. CONSTRUCTION (32 mockup)
// ═══════════════════════════════════════════
const CONSTRUCTION_PROJECTS: MockupProject[] = [
  {
    name: "Elite Costruzioni Roma",
    slug: "elite-costruzioni-roma",
    inspiration: "lendlease.com",
    images: standardPages("Elite%20Costruzioni%20Roma", ["a","b","c","d"], ["home","projects","detail","contact"], "mobile"),
  },
  {
    name: "MasterCraft Builders",
    slug: "mastercraft-builders",
    inspiration: "skanska.com",
    images: standardPages("MasterCraft%20Builders", ["a","b","c","d"], ["home","projects","detail","contact"], "mobile"),
  },
];

// ═══════════════════════════════════════════
// 11. TRADES / ARTIGIANI (8 mockup)
// ═══════════════════════════════════════════
const TRADES_PROJECTS: MockupProject[] = [
  {
    name: "Bottega Del Mobile",
    slug: "bottega-del-mobile",
    inspiration: "poltronafrau.com",
    images: [
      { url: m("Bottega%20Del%20Mobile/classic-walnut-home.png"), type: "home", style: "classic-walnut", device: "mobile" },
      { url: m("Bottega%20Del%20Mobile/classic-walnut-portfolio.png"), type: "portfolio", style: "classic-walnut", device: "mobile" },
      { url: m("Bottega%20Del%20Mobile/classic-walnut-detail.png"), type: "detail", style: "classic-walnut", device: "mobile" },
      { url: m("Bottega%20Del%20Mobile/classic-walnut-contact.png"), type: "contact", style: "classic-walnut", device: "mobile" },
      { url: m("Bottega%20Del%20Mobile/modern-oak-home.png"), type: "home", style: "modern-oak", device: "mobile" },
      { url: m("Bottega%20Del%20Mobile/modern-oak-portfolio.png"), type: "portfolio", style: "modern-oak", device: "mobile" },
      { url: m("Bottega%20Del%20Mobile/modern-oak-detail.png"), type: "detail", style: "modern-oak", device: "mobile" },
      { url: m("Bottega%20Del%20Mobile/modern-oak-contact.png"), type: "contact", style: "modern-oak", device: "mobile" },
    ],
  },
];

// ═══════════════════════════════════════════
// MASTER CATALOG
// ═══════════════════════════════════════════

export const SECTOR_MOCKUP_CATALOG: Record<string, SectorMockups> = {
  food: {
    sectorId: "food",
    label: "Food & Ristorazione",
    projects: FOOD_PROJECTS,
    designReferences: ["cotemiami.com", "paperfishshushi.com", "midtownkosher.com"],
    heroImage: m("Midtown%20Kosher/style-a-home.png"),
    totalCount: 279,
  },
  ncc: {
    sectorId: "ncc",
    label: "NCC & Trasporti",
    projects: NCC_PROJECTS,
    designReferences: ["nccmilano.com", "legendslimo.com"],
    heroImage: m("meridia-rental-car/37023edeca24-1772621011473.png"),
    totalCount: 16,
  },
  beauty: {
    sectorId: "beauty",
    label: "Beauty & Wellness",
    projects: BEAUTY_PROJECTS,
    designReferences: ["canyonranch.com", "tiarasalon.com"],
    heroImage: m("Neo%20Nails%20Brickell/lavender-luxe-home.png"),
    totalCount: 8,
  },
  healthcare: {
    sectorId: "healthcare",
    label: "Healthcare & Cliniche",
    projects: HEALTHCARE_PROJECTS,
    designReferences: ["clevelandclinic.org", "onemedical.com"],
    heroImage: m("HealthGlow%20Dermatology/mobile-a-home.png"),
    totalCount: 32,
  },
  retail: {
    sectorId: "retail",
    label: "Retail & Negozi",
    projects: RETAIL_PROJECTS,
    designReferences: ["eataly.com", "rinascente.it"],
    heroImage: m("Mercato%20Di%20Nonna/warm-tuscan-home.png"),
    totalCount: 8,
  },
  fitness: {
    sectorId: "fitness",
    label: "Fitness & Palestre",
    projects: FITNESS_PROJECTS,
    designReferences: ["equinox.com", "barrys.com"],
    heroImage: m("City%20Padel%20Milano/mobile-fresh-azzurro-home.png"),
    totalCount: 72,
  },
  hospitality: {
    sectorId: "hospitality",
    label: "Hospitality & Hotel",
    projects: HOSPITALITY_PROJECTS,
    designReferences: ["aman.com", "borgoegnazia.com"],
    heroImage: m("Grand%20Palladium%20Resort/mobile-a-home.png"),
    totalCount: 60,
  },
  childcare: {
    sectorId: "childcare",
    label: "Asili & Infanzia",
    projects: CHILDCARE_PROJECTS,
    designReferences: ["kindercare.com", "brighthorizons.com"],
    heroImage: m("Little%20Diamond%20Nursery%20-%20Playful%20Colorful/mobile-playful-home.png"),
    totalCount: 36,
  },
  veterinary: {
    sectorId: "veterinary",
    label: "Veterinario",
    projects: VETERINARY_PROJECTS,
    designReferences: ["banfield.com", "vcahospitals.com"],
    heroImage: m("Aloha%20Pet%20Resorts/mobile-a-home.png"),
    totalCount: 32,
  },
  construction: {
    sectorId: "construction",
    label: "Edilizia & Cantieri",
    projects: CONSTRUCTION_PROJECTS,
    designReferences: ["lendlease.com", "skanska.com"],
    heroImage: m("Elite%20Costruzioni%20Roma/mobile-a-home.png"),
    totalCount: 32,
  },
  plumber: {
    sectorId: "plumber",
    label: "Artigiani & Servizi",
    projects: TRADES_PROJECTS,
    designReferences: ["poltronafrau.com", "brunellocucinelli.com"],
    heroImage: m("Bottega%20Del%20Mobile/classic-walnut-home.png"),
    totalCount: 8,
  },
};

// ── Quick access: get all home mockups for a sector ──
export function getSectorHeroImages(sectorId: string): string[] {
  const sector = SECTOR_MOCKUP_CATALOG[sectorId];
  if (!sector) return [];
  return sector.projects.flatMap(p =>
    p.images.filter(img => img.type === "home").map(img => img.url)
  );
}

// ── Get all mockups for a sector (flat array of URLs) ──
export function getSectorAllImages(sectorId: string): string[] {
  const sector = SECTOR_MOCKUP_CATALOG[sectorId];
  if (!sector) return [];
  return sector.projects.flatMap(p => p.images.map(img => img.url));
}

// ── Get mockups grouped by project ──
export function getSectorProjectImages(sectorId: string): { projectName: string; images: MockupImage[] }[] {
  const sector = SECTOR_MOCKUP_CATALOG[sectorId];
  if (!sector) return [];
  return sector.projects.map(p => ({ projectName: p.name, images: p.images }));
}

// ── Sectors that have mockups ──
export const SECTORS_WITH_MOCKUPS = Object.keys(SECTOR_MOCKUP_CATALOG);
