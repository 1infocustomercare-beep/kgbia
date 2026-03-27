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
// 12. BEACH (using Miami Watersports + Asinara)
// ═══════════════════════════════════════════
const BEACH_PROJECTS: MockupProject[] = [
  {
    name: "Miami Watersports",
    slug: "miami-watersports",
    images: [
      { url: m("Miami%20Watersports/style-a-mobile-home.png"), type: "home", style: "a", device: "mobile" },
      { url: m("Miami%20Watersports/style-a-mobile-activities.png"), type: "services", style: "a", device: "mobile" },
      { url: m("Miami%20Watersports/style-e-mobile-home.png"), type: "home", style: "e", device: "mobile" },
      { url: m("Miami%20Watersports/style-g-mobile-home.png"), type: "home", style: "g", device: "mobile" },
    ],
  },
  localProject("Lido Azzurro", "lido-azzurro", [
    { url: beachHomeMockup, type: "home" }, { url: beachBookingMockup, type: "booking" },
  ]),
];

// ═══════════════════════════════════════════
// 13-24. LOCAL ASSET SECTORS
// ═══════════════════════════════════════════
import electricianHome from "@/assets/mockups/electrician-home.png";
import electricianDetail from "@/assets/mockups/electrician-detail.png";
import agriturismoHome from "@/assets/mockups/agriturismo-home.png";
import agriturismoActivities from "@/assets/mockups/agriturismo-activities.png";
import cleaningHome from "@/assets/mockups/cleaning-home.png";
import cleaningBooking from "@/assets/mockups/cleaning-booking.png";
import legalHome from "@/assets/mockups/legal-home.png";
import legalCase from "@/assets/mockups/legal-case.png";
import accountingHome from "@/assets/mockups/accounting-home.png";
import accountingInvoice from "@/assets/mockups/accounting-invoice.png";
import garageHome from "@/assets/mockups/garage-home.png";
import garageDetail from "@/assets/mockups/garage-detail.png";
import photographyHome from "@/assets/mockups/photography-home.png";
import photographyGallery from "@/assets/mockups/photography-gallery.png";
import gardeningHome from "@/assets/mockups/gardening-home.png";
import gardeningProject from "@/assets/mockups/gardening-project.png";
import tattooHome from "@/assets/mockups/tattoo-home.png";
import tattooArtist from "@/assets/mockups/tattoo-artist.png";
import educationHome from "@/assets/mockups/education-home.png";
import educationCourse from "@/assets/mockups/education-course.png";
import eventsHome from "@/assets/mockups/events-home.png";
import eventsDetail from "@/assets/mockups/events-detail.png";
import logisticsHome from "@/assets/mockups/logistics-home.png";
import logisticsTracking from "@/assets/mockups/logistics-tracking.png";
import retailHomeMockup from "@/assets/mockups/retail-home.png";
import retailDetailMockup from "@/assets/mockups/retail-detail.png";
import constructionHomeMockup from "@/assets/mockups/construction-home.png";
import constructionTimelineMockup from "@/assets/mockups/construction-timeline.png";
import beachHomeMockup from "@/assets/mockups/beach-home.png";
import beachBookingMockup from "@/assets/mockups/beach-booking.png";
import electricianServicesMockup from "@/assets/mockups/electrician-services.png";
import agriturismoRoomsMockup from "@/assets/mockups/agriturismo-rooms.png";
import cleaningScheduleMockup from "@/assets/mockups/cleaning-schedule.png";
import legalDeadlinesMockup from "@/assets/mockups/legal-deadlines.png";
import accountingDeadlinesMockup from "@/assets/mockups/accounting-deadlines.png";
import garageRepairsMockup from "@/assets/mockups/garage-repairs.png";
import photographyCalendarMockup from "@/assets/mockups/photography-calendar.png";
import gardeningJobsMockup from "@/assets/mockups/gardening-jobs.png";
import tattooPortfolioMockup from "@/assets/mockups/tattoo-portfolio.png";
import educationCalendarMockup from "@/assets/mockups/education-calendar.png";
import eventsTimelineMockup from "@/assets/mockups/events-timeline.png";
import logisticsFleetMockup from "@/assets/mockups/logistics-fleet.png";

function localProject(name: string, slug: string, images: { url: string; type: MockupImage["type"] }[]): MockupProject {
  return {
    name, slug,
    images: images.map(img => ({ ...img, style: "premium", device: "mobile" as const })),
  };
}

const ELECTRICIAN_PROJECTS: MockupProject[] = [
  localProject("Elettrica Moderna", "elettrica-moderna", [
    { url: electricianHome, type: "home" }, { url: electricianDetail, type: "detail" },
    { url: electricianServicesMockup, type: "services" },
  ]),
];

const AGRITURISMO_PROJECTS: MockupProject[] = [
  localProject("Podere del Sole", "podere-del-sole", [
    { url: agriturismoHome, type: "home" }, { url: agriturismoActivities, type: "services" },
    { url: agriturismoRoomsMockup, type: "rooms" },
  ]),
];

const CLEANING_PROJECTS: MockupProject[] = [
  localProject("PulitoPro", "pulitopro", [
    { url: cleaningHome, type: "home" }, { url: cleaningBooking, type: "booking" },
    { url: cleaningScheduleMockup, type: "services" },
  ]),
];

const LEGAL_PROJECTS: MockupProject[] = [
  localProject("Studio Legale Martini", "studio-martini", [
    { url: legalHome, type: "home" }, { url: legalCase, type: "detail" },
    { url: legalDeadlinesMockup, type: "services" },
  ]),
];

const ACCOUNTING_PROJECTS: MockupProject[] = [
  localProject("Studio Rossi", "studio-rossi", [
    { url: accountingHome, type: "home" }, { url: accountingInvoice, type: "detail" },
    { url: accountingDeadlinesMockup, type: "services" },
  ]),
];

const GARAGE_PROJECTS: MockupProject[] = [
  localProject("Autofficina Rossi", "autofficina-rossi", [
    { url: garageHome, type: "home" }, { url: garageDetail, type: "detail" },
    { url: garageRepairsMockup, type: "services" },
  ]),
];

const PHOTOGRAPHY_PROJECTS: MockupProject[] = [
  localProject("Luce Studio", "luce-studio", [
    { url: photographyHome, type: "home" }, { url: photographyGallery, type: "portfolio" },
    { url: photographyCalendarMockup, type: "booking" },
  ]),
];

const GARDENING_PROJECTS: MockupProject[] = [
  localProject("Verde Vivo", "verde-vivo", [
    { url: gardeningHome, type: "home" }, { url: gardeningProject, type: "projects" },
    { url: gardeningJobsMockup, type: "services" },
  ]),
];

const TATTOO_PROJECTS: MockupProject[] = [
  localProject("Ink Factory", "ink-factory", [
    { url: tattooHome, type: "home" }, { url: tattooArtist, type: "portfolio" },
    { url: tattooPortfolioMockup, type: "booking" },
  ]),
];

const EDUCATION_PROJECTS: MockupProject[] = [
  localProject("Accademia Sapere", "accademia-sapere", [
    { url: educationHome, type: "home" }, { url: educationCourse, type: "detail" },
    { url: educationCalendarMockup, type: "services" },
  ]),
];

const EVENTS_PROJECTS: MockupProject[] = [
  localProject("Dream Events", "dream-events", [
    { url: eventsHome, type: "home" }, { url: eventsDetail, type: "detail" },
    { url: eventsTimelineMockup, type: "services" },
  ]),
];

const LOGISTICS_PROJECTS: MockupProject[] = [
  localProject("Flash Logistica", "flash-logistica", [
    { url: logisticsHome, type: "home" }, { url: logisticsTracking, type: "detail" },
    { url: logisticsFleetMockup, type: "services" },
  ]),
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
    projects: [...RETAIL_PROJECTS, localProject("Bottega Artigiana", "bottega-artigiana", [
      { url: retailHomeMockup, type: "home" }, { url: retailDetailMockup, type: "detail" },
    ])],
    designReferences: ["eataly.com", "rinascente.it"],
    heroImage: m("Mercato%20Di%20Nonna/warm-tuscan-home.png"),
    totalCount: 10,
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
  beach: {
    sectorId: "beach",
    label: "Stabilimento Balneare",
    projects: BEACH_PROJECTS,
    designReferences: ["miamiwatersports.com"],
    heroImage: m("Miami%20Watersports/style-a-mobile-home.png"),
    totalCount: 4,
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
    projects: [...CONSTRUCTION_PROJECTS, localProject("Edil Costruzioni", "edil-costruzioni", [
      { url: constructionHomeMockup, type: "home" }, { url: constructionTimelineMockup, type: "detail" },
    ])],
    designReferences: ["lendlease.com", "skanska.com"],
    heroImage: m("Elite%20Costruzioni%20Roma/mobile-a-home.png"),
    totalCount: 34,
  },
  plumber: {
    sectorId: "plumber",
    label: "Idraulico",
    projects: TRADES_PROJECTS,
    designReferences: ["poltronafrau.com"],
    heroImage: m("Bottega%20Del%20Mobile/classic-walnut-home.png"),
    totalCount: 8,
  },
  electrician: {
    sectorId: "electrician",
    label: "Elettricista",
    projects: ELECTRICIAN_PROJECTS,
    designReferences: [],
    heroImage: electricianHome,
    totalCount: 2,
  },
  agriturismo: {
    sectorId: "agriturismo",
    label: "Agriturismo",
    projects: AGRITURISMO_PROJECTS,
    designReferences: [],
    heroImage: agriturismoHome,
    totalCount: 2,
  },
  cleaning: {
    sectorId: "cleaning",
    label: "Impresa Pulizie",
    projects: CLEANING_PROJECTS,
    designReferences: [],
    heroImage: cleaningHome,
    totalCount: 2,
  },
  legal: {
    sectorId: "legal",
    label: "Studio Legale",
    projects: LEGAL_PROJECTS,
    designReferences: [],
    heroImage: legalHome,
    totalCount: 2,
  },
  accounting: {
    sectorId: "accounting",
    label: "Commercialista",
    projects: ACCOUNTING_PROJECTS,
    designReferences: [],
    heroImage: accountingHome,
    totalCount: 2,
  },
  garage: {
    sectorId: "garage",
    label: "Autofficina",
    projects: GARAGE_PROJECTS,
    designReferences: [],
    heroImage: garageHome,
    totalCount: 2,
  },
  photography: {
    sectorId: "photography",
    label: "Fotografo",
    projects: PHOTOGRAPHY_PROJECTS,
    designReferences: [],
    heroImage: photographyHome,
    totalCount: 2,
  },
  gardening: {
    sectorId: "gardening",
    label: "Giardiniere",
    projects: GARDENING_PROJECTS,
    designReferences: [],
    heroImage: gardeningHome,
    totalCount: 2,
  },
  tattoo: {
    sectorId: "tattoo",
    label: "Tatuatore",
    projects: TATTOO_PROJECTS,
    designReferences: [],
    heroImage: tattooHome,
    totalCount: 2,
  },
  education: {
    sectorId: "education",
    label: "Formazione",
    projects: EDUCATION_PROJECTS,
    designReferences: [],
    heroImage: educationHome,
    totalCount: 2,
  },
  events: {
    sectorId: "events",
    label: "Eventi",
    projects: EVENTS_PROJECTS,
    designReferences: [],
    heroImage: eventsHome,
    totalCount: 2,
  },
  logistics: {
    sectorId: "logistics",
    label: "Logistica",
    projects: LOGISTICS_PROJECTS,
    designReferences: [],
    heroImage: logisticsHome,
    totalCount: 2,
  },
  custom: {
    sectorId: "custom",
    label: "Personalizzato",
    projects: [],
    designReferences: [],
    heroImage: "",
    totalCount: 0,
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
