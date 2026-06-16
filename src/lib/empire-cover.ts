/**
 * Empire Cover Generator — proprietary placeholder cover art.
 *
 * Produces deterministic, brand-neutral SVG data URIs used wherever the
 * catalogo / portfolio / showcase needs a mockup screen image. Also routes
 * legacy catalog paths to proprietary Empire screenshots by sector keyword.
 */

import { empireMockupFromPath } from "@/lib/empire-mockup-screens";

export type EmpirePaletteId =
  | "obsidian-gold" | "azure-ocean" | "sakura-rose" | "sage-luxe"
  | "terracotta" | "violet-noir" | "amber-sand" | "turquoise-deep"
  | "coral-warm" | "mono-ink" | "emerald-noir" | "champagne-pearl";

interface PaletteSpec { from: string; to: string; accent: string; ink: string; }

export const EMPIRE_PALETTES: Record<EmpirePaletteId, PaletteSpec> = {
  "obsidian-gold":    { from: "#11141a", to: "#2a1f12", accent: "#d4af37", ink: "#fff5e0" },
  "azure-ocean":      { from: "#0f1620", to: "#13283f", accent: "#69c0ff", ink: "#e8f3ff" },
  "sakura-rose":      { from: "#1a0f1a", to: "#3a1a2a", accent: "#e8a0bf", ink: "#fff0f5" },
  "sage-luxe":        { from: "#0d1812", to: "#13261c", accent: "#6fd29a", ink: "#e6fff0" },
  "terracotta":       { from: "#1a1410", to: "#2c1d12", accent: "#c87533", ink: "#ffe8c4" },
  "violet-noir":      { from: "#0f0f14", to: "#1c1c28", accent: "#9d8cff", ink: "#e8e4ff" },
  "amber-sand":       { from: "#1c1209", to: "#332010", accent: "#f4b250", ink: "#fff2d4" },
  "turquoise-deep":   { from: "#0a1a1a", to: "#0f2e2c", accent: "#3fd5c0", ink: "#dfffeb" },
  "coral-warm":       { from: "#1c1010", to: "#321616", accent: "#ff8a6b", ink: "#ffe2d4" },
  "mono-ink":         { from: "#0e0e0e", to: "#1a1a1a", accent: "#f5f5f5", ink: "#cfcfcf" },
  "emerald-noir":     { from: "#0a1814", to: "#13261f", accent: "#4ade80", ink: "#dcfce7" },
  "champagne-pearl":  { from: "#171311", to: "#2a221c", accent: "#e7d4a8", ink: "#fff6e0" },
};

const PALETTE_IDS = Object.keys(EMPIRE_PALETTES) as EmpirePaletteId[];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}
function pickPalette(key: string): PaletteSpec {
  return EMPIRE_PALETTES[PALETTE_IDS[hashStr(key) % PALETTE_IDS.length]];
}
function escapeXml(s: string): string {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
}
function monogramFor(label: string): string {
  const c = label.replace(/[^a-zA-Z0-9 ]/g," ").split(/\s+/).filter(Boolean);
  if (c.length === 0) return "E";
  if (c.length === 1) return c[0].slice(0,2).toUpperCase();
  return (c[0][0] + c[1][0]).toUpperCase();
}

export interface EmpireCoverOpts {
  key: string; label: string; sublabel?: string;
  paletteId?: EmpirePaletteId; width?: number; height?: number;
}

export function empireCover(opts: EmpireCoverOpts): string {
  const generated = empireMockupFromPath(`${opts.label}/${opts.key}-${opts.sublabel ?? "home"}.png`, {
    label: opts.label,
    sublabel: opts.sublabel,
  });
  if (generated) return generated;
  const palette = opts.paletteId ? EMPIRE_PALETTES[opts.paletteId] : pickPalette(opts.key);
  const w = opts.width ?? 360, h = opts.height ?? 780;
  const mono = monogramFor(opts.label);
  const sub = (opts.sublabel ?? "").toString().toUpperCase().slice(0,22);
  const accent = palette.accent, ink = palette.ink;
  const lines: string[] = [];
  const step = Math.max(40, Math.round(h/10));
  for (let y = step; y < h; y += step) lines.push(`<line x1="0" y1="${y}" x2="${w}" y2="${y}"/>`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">`+
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${palette.from}"/><stop offset="1" stop-color="${palette.to}"/></linearGradient>`+
    `<radialGradient id="r" cx="50%" cy="30%" r="70%"><stop offset="0" stop-color="${accent}" stop-opacity="0.22"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient></defs>`+
    `<rect width="${w}" height="${h}" fill="url(#g)"/><rect width="${w}" height="${h}" fill="url(#r)"/>`+
    `<g opacity="0.08" stroke="${accent}" stroke-width="1">${lines.join("")}</g>`+
    `<g transform="translate(${w/2} ${h*0.42})" text-anchor="middle" font-family="Georgia,serif">`+
      `<circle r="${Math.min(w,h)*0.22}" fill="none" stroke="${accent}" stroke-opacity="0.4" stroke-width="1"/>`+
      `<text y="32" font-size="${Math.min(w,h)*0.24}" font-weight="600" fill="${ink}" letter-spacing="2">${escapeXml(mono)}</text></g>`+
    `<g transform="translate(${w/2} ${h*0.62})" text-anchor="middle" font-family="Inter,sans-serif">`+
      `<text font-size="12" fill="${accent}" letter-spacing="6">EMPIRE STUDIO</text>`+
      (sub ? `<text y="22" font-size="10" fill="${ink}" fill-opacity="0.75" letter-spacing="3">${escapeXml(sub)}</text>` : "")+
    `</g><rect x="${w*0.11}" y="${h*0.9}" width="${w*0.78}" height="2" fill="${accent}" opacity="0.5"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// ───────────────────────────────────────────────────────────────────────────
// Empire Studio proprietary mockup library — 14 AI hero shots + 42 sector
// specific PNGs, mapped per sector keyword for coherent catalog rendering.
// ───────────────────────────────────────────────────────────────────────────
import restaurantHero    from "@/assets/empire-mockups/restaurant-hero.jpg";
import restaurantDish    from "@/assets/empire-mockups/restaurant-dish.jpg";
import restaurantV2      from "@/assets/empire-mockups/restaurant-v2.jpg";
import restaurantV3      from "@/assets/empire-mockups/restaurant-v3.jpg";
import restaurantV4      from "@/assets/empire-mockups/restaurant-v4.jpg";
import pizzeriaV1        from "@/assets/empire-mockups/pizzeria-v1.jpg";
import sushiHero         from "@/assets/empire-mockups/sushi-hero.jpg";
import sushiDish         from "@/assets/empire-mockups/sushi-dish.jpg";
import sushiV2           from "@/assets/empire-mockups/sushi-v2.jpg";
import sushiV3           from "@/assets/empire-mockups/sushi-v3.jpg";
import nccHero           from "@/assets/empire-mockups/ncc-hero.jpg";
import nccDetail         from "@/assets/empire-mockups/ncc-detail.jpg";
import nccV2             from "@/assets/empire-mockups/ncc-v2.jpg";
import nccV3             from "@/assets/empire-mockups/ncc-v3.jpg";
import beautyHero        from "@/assets/empire-mockups/beauty-hero.jpg";
import beautyDish        from "@/assets/empire-mockups/beauty-dish.jpg";
import beautyV2          from "@/assets/empire-mockups/beauty-v2.jpg";
import beautyV3          from "@/assets/empire-mockups/beauty-v3.jpg";
import beautyV4          from "@/assets/empire-mockups/beauty-v4.jpg";
import hospitalityHero   from "@/assets/empire-mockups/hospitality-hero.jpg";
import hospitalityDetail from "@/assets/empire-mockups/hospitality-detail.jpg";
import hotelV2           from "@/assets/empire-mockups/hotel-v2.jpg";
import hotelV3           from "@/assets/empire-mockups/hotel-v3.jpg";
import hotelV4           from "@/assets/empire-mockups/hotel-v4.jpg";
import fitnessHero       from "@/assets/empire-mockups/fitness-hero.jpg";
import fitnessDish       from "@/assets/empire-mockups/fitness-dish.jpg";
import fitnessV2         from "@/assets/empire-mockups/fitness-v2.jpg";
import fitnessV3         from "@/assets/empire-mockups/fitness-v3.jpg";
import fitnessV4         from "@/assets/empire-mockups/fitness-v4.jpg";
import realestateHero    from "@/assets/empire-mockups/realestate-hero.jpg";
import realestateDish    from "@/assets/empire-mockups/realestate-dish.jpg";
import realestateV2      from "@/assets/empire-mockups/realestate-v2.jpg";
import realestateV3      from "@/assets/empire-mockups/realestate-v3.jpg";
import boatV1            from "@/assets/empire-mockups/boat-v1.jpg";
import boatV2            from "@/assets/empire-mockups/boat-v2.jpg";
import healthV1          from "@/assets/empire-mockups/health-v1.jpg";
import healthV2          from "@/assets/empire-mockups/health-v2.jpg";
import healthV3          from "@/assets/empire-mockups/health-v3.jpg";

import retailHome           from "@/assets/mockups/retail-home.png";
import retailDetail         from "@/assets/mockups/retail-detail.png";
import electricianHome      from "@/assets/mockups/electrician-home.png";
import electricianDetail    from "@/assets/mockups/electrician-detail.png";
import electricianServices  from "@/assets/mockups/electrician-services.png";
import agriturismoHome      from "@/assets/mockups/agriturismo-home.png";
import agriturismoActs      from "@/assets/mockups/agriturismo-activities.png";
import agriturismoRooms     from "@/assets/mockups/agriturismo-rooms.png";
import cleaningHome         from "@/assets/mockups/cleaning-home.png";
import cleaningBooking      from "@/assets/mockups/cleaning-booking.png";
import cleaningSchedule     from "@/assets/mockups/cleaning-schedule.png";
import legalHome            from "@/assets/mockups/legal-home.png";
import legalCase            from "@/assets/mockups/legal-case.png";
import legalDeadlines       from "@/assets/mockups/legal-deadlines.png";
import accountingHome       from "@/assets/mockups/accounting-home.png";
import accountingInvoice    from "@/assets/mockups/accounting-invoice.png";
import accountingDeadlines  from "@/assets/mockups/accounting-deadlines.png";
import garageHome           from "@/assets/mockups/garage-home.png";
import garageDetail         from "@/assets/mockups/garage-detail.png";
import garageRepairs        from "@/assets/mockups/garage-repairs.png";
import photographyHome      from "@/assets/mockups/photography-home.png";
import photographyGallery   from "@/assets/mockups/photography-gallery.png";
import photographyCalendar  from "@/assets/mockups/photography-calendar.png";
import constructionHome     from "@/assets/mockups/construction-home.png";
import constructionTimeline from "@/assets/mockups/construction-timeline.png";
import gardeningHome        from "@/assets/mockups/gardening-home.png";
import gardeningJobs        from "@/assets/mockups/gardening-jobs.png";
import gardeningProject     from "@/assets/mockups/gardening-project.png";
import tattooHome           from "@/assets/mockups/tattoo-home.png";
import tattooArtist         from "@/assets/mockups/tattoo-artist.png";
import tattooPortfolio      from "@/assets/mockups/tattoo-portfolio.png";
import educationHome        from "@/assets/mockups/education-home.png";
import educationCourse      from "@/assets/mockups/education-course.png";
import educationCalendar    from "@/assets/mockups/education-calendar.png";
import eventsHome           from "@/assets/mockups/events-home.png";
import eventsDetail         from "@/assets/mockups/events-detail.png";
import eventsTimeline       from "@/assets/mockups/events-timeline.png";
import logisticsHome        from "@/assets/mockups/logistics-home.png";
import logisticsTracking    from "@/assets/mockups/logistics-tracking.png";
import logisticsFleet       from "@/assets/mockups/logistics-fleet.png";
import beachHome            from "@/assets/mockups/beach-home.png";
import beachBooking         from "@/assets/mockups/beach-booking.png";

const POOL_FOOD    = [restaurantHero, restaurantDish, restaurantV2, restaurantV3, restaurantV4, pizzeriaV1];
const POOL_PIZZA   = [pizzeriaV1, restaurantV4, restaurantHero, restaurantDish];
const POOL_SUSHI   = [sushiHero, sushiDish, sushiV2, sushiV3];
const POOL_NCC     = [nccHero, nccDetail, nccV2, nccV3];
const POOL_BOAT    = [boatV1, boatV2, hospitalityHero, beachHome, beachBooking];
const POOL_BEAUTY  = [beautyHero, beautyDish, beautyV2, beautyV3, beautyV4];
const POOL_HOTEL   = [hospitalityHero, hospitalityDetail, hotelV2, hotelV3, hotelV4];
const POOL_FITNESS = [fitnessHero, fitnessDish, fitnessV2, fitnessV3, fitnessV4];
const POOL_REAL    = [realestateHero, realestateDish, realestateV2, realestateV3];
const POOL_RETAIL  = [retailHome, retailDetail];
const POOL_ELEC    = [electricianHome, electricianDetail, electricianServices];
const POOL_AGRI    = [agriturismoHome, agriturismoActs, agriturismoRooms, hotelV4];
const POOL_CLEAN   = [cleaningHome, cleaningBooking, cleaningSchedule];
const POOL_LEGAL   = [legalHome, legalCase, legalDeadlines];
const POOL_ACCT    = [accountingHome, accountingInvoice, accountingDeadlines];
const POOL_GARAGE  = [garageHome, garageDetail, garageRepairs];
const POOL_PHOTO   = [photographyHome, photographyGallery, photographyCalendar];
const POOL_CONSTR  = [constructionHome, constructionTimeline];
const POOL_GARDEN  = [gardeningHome, gardeningJobs, gardeningProject];
const POOL_TATTOO  = [tattooHome, tattooArtist, tattooPortfolio];
const POOL_EDU     = [educationHome, educationCourse, educationCalendar];
const POOL_EVENTS  = [eventsHome, eventsDetail, eventsTimeline];
const POOL_LOG     = [logisticsHome, logisticsTracking, logisticsFleet];
const POOL_BEACH   = [beachHome, beachBooking, boatV2];
const POOL_HEALTH  = [healthV1, healthV2, healthV3, beautyV3];
const POOL_PET     = [agriturismoHome, gardeningHome, retailHome];
const POOL_BABY    = [educationHome, eventsHome, retailHome];

const EMPIRE_KEY_TO_CDN: Record<string, string> = {
  "restaurant-hero": restaurantHero, "restaurant-dish": restaurantDish,
  "sushi-hero": sushiHero, "sushi-dish": sushiDish,
  "ncc-hero": nccHero, "ncc-detail": nccDetail,
  "beauty-hero": beautyHero, "beauty-dish": beautyDish,
  "hospitality-hero": hospitalityHero, "hospitality-detail": hospitalityDetail,
  "fitness-hero": fitnessHero, "fitness-dish": fitnessDish,
  "realestate-hero": realestateHero, "realestate-dish": realestateDish,
};

// Keyword → pool. Specific brand folders matched before generic sector terms.
const SECTOR_PROPRIETARY_POOL: Array<[string, string[]]> = [
  ["onyx", POOL_FOOD], ["brace", POOL_FOOD], ["steakhouse", POOL_FOOD],
  ["levante", POOL_FOOD], ["pacifico", POOL_FOOD], ["ceviche", POOL_FOOD], ["deli", POOL_FOOD],
  ["sakura", POOL_SUSHI], ["indocina", POOL_SUSHI], ["noir", POOL_SUSHI], ["paperfish", POOL_SUSHI],
  ["aurora", POOL_BEAUTY], ["velluto", POOL_BEAUTY], ["nail", POOL_BEAUTY], ["hair", POOL_BEAUTY],
  ["lumen", POOL_HEALTH], ["clinic", POOL_HEALTH],
  ["cala%20vento", POOL_NCC], ["cala vento", POOL_NCC], ["asinara", POOL_NCC],
  ["charter", POOL_NCC], ["yacht", POOL_NCC],
  ["marina", POOL_BOAT], ["riviera", POOL_BOAT], ["batey", POOL_BOAT],
  ["miami%20boats", POOL_BOAT], ["miami boats", POOL_BOAT], ["boat", POOL_BOAT],
  ["centro%20padel", POOL_FITNESS], ["padel", POOL_FITNESS],
  ["onda%20sport", POOL_FITNESS], ["sport", POOL_FITNESS],
  ["domus", POOL_REAL], ["resident", POOL_REAL], ["mmi", POOL_REAL],
  ["tropico", POOL_PET], ["pet", POOL_PET],
  ["stelle", POOL_BABY], ["nursery", POOL_BABY], ["playhouse", POOL_BABY], ["baby", POOL_BABY],
  ["plumbing", POOL_ELEC], ["electric", POOL_ELEC], ["nick", POOL_ELEC],
  // Generic
  ["pizzeria", POOL_PIZZA], ["pizza", POOL_PIZZA], ["napoletana", POOL_PIZZA],
  ["dental", POOL_HEALTH], ["dentist", POOL_HEALTH], ["physio", POOL_HEALTH], ["physiotherapy", POOL_HEALTH],
  ["restaurant", POOL_FOOD], ["food", POOL_FOOD], ["bistro", POOL_FOOD], ["trattoria", POOL_FOOD], ["osteria", POOL_FOOD],
  ["sushi", POOL_SUSHI], ["japanese", POOL_SUSHI], ["ramen", POOL_SUSHI],
  ["ncc", POOL_NCC], ["limousine", POOL_NCC], ["transfer", POOL_NCC],
  ["beauty", POOL_BEAUTY], ["spa", POOL_BEAUTY], ["salon", POOL_BEAUTY],
  ["hospitality", POOL_HOTEL], ["hotel", POOL_HOTEL], ["resort", POOL_HOTEL],
  ["fitness", POOL_FITNESS], ["gym", POOL_FITNESS], ["trainer", POOL_FITNESS],
  ["realestate", POOL_REAL], ["real-estate", POOL_REAL], ["realty", POOL_REAL],
  ["retail", POOL_RETAIL], ["shop", POOL_RETAIL], ["store", POOL_RETAIL],
  ["agriturismo", POOL_AGRI],
  ["cleaning", POOL_CLEAN], ["pulizie", POOL_CLEAN],
  ["legal", POOL_LEGAL], ["avvocato", POOL_LEGAL], ["studio%20legale", POOL_LEGAL],
  ["accounting", POOL_ACCT], ["commercialista", POOL_ACCT],
  ["garage", POOL_GARAGE], ["mechanic", POOL_GARAGE], ["officina", POOL_GARAGE],
  ["photo", POOL_PHOTO], ["foto", POOL_PHOTO],
  ["construction", POOL_CONSTR], ["edilizia", POOL_CONSTR],
  ["garden", POOL_GARDEN], ["giardin", POOL_GARDEN],
  ["tattoo", POOL_TATTOO],
  ["education", POOL_EDU], ["school", POOL_EDU], ["academy", POOL_EDU], ["formazione", POOL_EDU],
  ["event", POOL_EVENTS], ["wedding", POOL_EVENTS],
  ["logistic", POOL_LOG], ["delivery", POOL_LOG], ["trasporto", POOL_LOG],
  ["beach", POOL_BEACH], ["umbrella", POOL_BEACH],
  ["health", POOL_HEALTH], ["medical", POOL_HEALTH],
];

const ALL_PROPRIETARY: string[] = [
  ...POOL_FOOD, ...POOL_SUSHI, ...POOL_NCC, ...POOL_BEAUTY,
  ...POOL_HOTEL, ...POOL_FITNESS, ...POOL_REAL, ...POOL_RETAIL,
];

/**
 * Resolve any legacy catalog path to a proprietary Empire mockup by matching
 * sector keywords. Deterministic: same path → same image, but paths within
 * a sector rotate through that sector's pool for variety.
 */
export function empireCoverFromPath(path: string): string {
  return empireMockupFromPath(path);
}
