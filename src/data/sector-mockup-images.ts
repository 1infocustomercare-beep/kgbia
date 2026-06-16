/**
 * Mockup screen images for each sector's iPhone showcase.
 *
 * Cover art is generated locally (SVG data URIs) by empireCoverFromPath().
 * Brand folder identifiers below are Empire-proprietary; the legacy third-party
 * competitor bucket is no longer referenced.
 */

import { type IndustryId } from "@/config/industry-config";
import { empireCoverFromPath } from "@/lib/empire-cover";

// Legacy _wrap("path.png") template now resolves to a proprietary Empire cover.
const S = { toString() { return ""; } };
const _wrap = (path: string) => empireCoverFromPath(path);
// Tagged-template style helper kept for compatibility with the catalog below.
// (The catalog uses both _wrap("foo") and bare strings; we normalise via _wrap.)

// Local generated assets for sectors without Lowengeld mockups
import retailHome from "@/assets/mockups/retail-home.png";
import retailDetail from "@/assets/mockups/retail-detail.png";
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
import constructionHome from "@/assets/mockups/construction-home.png";
import constructionTimeline from "@/assets/mockups/construction-timeline.png";
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

/* ═══════════════════════════════════════════
   FLAT ARRAY — used by IndustryPhoneShowcase carousel
   Shows best 3-6 screens per sector for quick preview
   Priority: obsidian/luxury-dark/noir styles first
   ═══════════════════════════════════════════ */

export const SECTOR_MOCKUP_IMAGES: Partial<Record<IndustryId, string[]>> = {
  food: [
    // COTE Obsidian (premium first)
    _wrap("COTE%20Miami/a-obsidian-mobile-home.png"),
    _wrap("COTE%20Miami/a-obsidian-mobile-menu.png"),
    _wrap("COTE%20Miami/a-obsidian-mobile-detail.png"),
    // Paperfish Luxury Dark
    _wrap("Paperfish%20Sushi/b-luxury-dark-home.png"),
    _wrap("Paperfish%20Sushi/b-luxury-dark-menu.png"),
    _wrap("Paperfish%20Sushi/a-sakura-home.png"),
    // La Vang Noir Saigon
    _wrap("La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-home.png"),
    _wrap("La%20Vang%20Vietnamese%20Luxury/l-obsidian-gold-home.png"),
    // Batey
    _wrap("Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-home.png"),
    // COTE other styles
    _wrap("COTE%20Miami/d-marble-mobile-home.png"),
    _wrap("COTE%20Miami/b-ivory-mobile-home.png"),
    // Midtown
    _wrap("Midtown%20Kosher/mobile-a-home.png"),
  ],

  beauty: [
    _wrap("Neo%20Nails%20Brickell/lavender-luxe-home.png"),
    _wrap("Neo%20Nails%20Brickell/blush-rosegold-home.png"),
    _wrap("Neo%20Nails%20Brickell/lavender-luxe-servizi.png"),
    _wrap("Neo%20Nails%20Brickell/blush-rosegold-servizi.png"),
    _wrap("Tatush%20Hair%20Fragrance/mobile-home.png"),
    _wrap("Tatush%20Hair%20Fragrance/mobile-shop.png"),
  ],

  ncc: [
    _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png"),
    _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/escursioni.png"),
    _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/dettaglio-tour.png"),
    _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/prenotazione.png"),
    _wrap("Miami%20Boats%20Rental/A-mobile-home.png"),
    _wrap("Miami%20Boats%20Rental/A-mobile-fleet.png"),
    _wrap("Miami%20Boats%20Rental/A-mobile-yacht-detail.png"),
    _wrap("Miami%20Boats%20Rental/A-mobile-booking.png"),
  ],

  fitness: [
    // City Padel — sage-luxe first
    _wrap("City%20Padel%20Milano/mobile-sage-luxe-home.png"),
    _wrap("City%20Padel%20Milano/mobile-sage-luxe-prenota.png"),
    _wrap("City%20Padel%20Milano/mobile-sage-luxe-maestri.png"),
    _wrap("City%20Padel%20Milano/mobile-sage-luxe-dettaglio.png"),
    _wrap("City%20Padel%20Milano/mobile-fresh-azzurro-home.png"),
    _wrap("City%20Padel%20Milano/mobile-fresh-azzurro-prenota.png"),
    // Miami Watersports
    _wrap("Miami%20Watersports/style-a-mobile-home.png"),
    _wrap("Miami%20Watersports/style-a-mobile-activities.png"),
  ],

  healthcare: [
    _wrap("FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png"),
    _wrap("FAR%20Medical%20Solutions/a-ethereal-glass-mobile-servizi.png"),
    _wrap("FAR%20Medical%20Solutions/b-azure-gradient-mobile-home.png"),
    _wrap("FAR%20Medical%20Solutions/b-azure-gradient-mobile-servizi.png"),
    _wrap("FAR%20Medical%20Solutions/c-ice-crystal-mobile-home.png"),
    _wrap("FAR%20Medical%20Solutions/d-soft-blue-mobile-home.png"),
  ],

  veterinary: [
    _wrap("Aloha%20Pet%20Resorts/mobile-a-home.png"),
    _wrap("Aloha%20Pet%20Resorts/mobile-a-services.png"),
    _wrap("Aloha%20Pet%20Resorts/mobile-a-detail.png"),
    _wrap("Aloha%20Pet%20Resorts/mobile-a-booking.png"),
    _wrap("Aloha%20Pet%20Resorts/mobile-e-home.png"),
    _wrap("Aloha%20Pet%20Resorts/mobile-e-services.png"),
    _wrap("Aloha%20Pet%20Resorts/mobile-f-home.png"),
    _wrap("Aloha%20Pet%20Resorts/mobile-g-home.png"),
  ],

  childcare: [
    _wrap("Little%20Diamond%20Nursery%20-%20Playful%20Colorful/home.png"),
    _wrap("Little%20Diamond%20Nursery%20-%20Playful%20Colorful/programs-activities.png"),
    _wrap("Little%20Diamond%20Nursery%20-%20Playful%20Colorful/team-tour.png"),
    _wrap("Little%20Diamond%20Nursery%20-%20Playful%20Colorful/meal-plan-enroll.png"),
    _wrap("Little%20Diamond%20Nursery%20-%20Nature%20Explorer/home.png"),
    _wrap("Little%20Diamond%20Nursery%20-%20Nature%20Explorer/programs-activities.png"),
    _wrap("Little%20Diamond%20Nursery%20-%20Ocean%20Breeze/home.png"),
    _wrap("Little%20Diamond%20Nursery%20-%20Sunny%20Garden/home.png"),
    _wrap("Little%20Diamond%20Nursery%20-%20Sunset%20Playful/home.png"),
    _wrap("Ashley's%20Playhouse/stile-a-home.png"),
    _wrap("Ashley's%20Playhouse/stile-a-programs.png"),
    _wrap("Ashley's%20Playhouse/stile-b-home.png"),
  ],

  plumber: [
    _wrap("Nick's%20Plumbing%20&%20AC/stile-a-home.png"),
    _wrap("Nick's%20Plumbing%20&%20AC/stile-a-services.png"),
    _wrap("Nick's%20Plumbing%20&%20AC/stile-a-detail.png"),
    _wrap("Nick's%20Plumbing%20&%20AC/stile-a-booking.png"),
    _wrap("Nick's%20Plumbing%20&%20AC/stile-b-home.png"),
    _wrap("Nick's%20Plumbing%20&%20AC/stile-b-services.png"),
  ],

  beach: [
    _wrap("Miami%20Watersports/style-a-mobile-home.png"),
    _wrap("Miami%20Watersports/style-a-mobile-activities.png"),
    _wrap("Miami%20Watersports/style-e-mobile-home.png"),
    _wrap("Miami%20Watersports/style-g-mobile-home.png"),
  ],

  hospitality: [
    _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png"),
    _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/escursioni.png"),
    _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/dettaglio-tour.png"),
    _wrap("Miami%20Boats%20Rental/A-mobile-home.png"),
    _wrap("Miami%20Boats%20Rental/A-mobile-fleet.png"),
    _wrap("Miami%20Boats%20Rental/C-mobile-home.png"),
  ],

  construction: [
    _wrap("MMI%20Resident%20Hub/05-ocean-azure-mobile-dashboard.png"),
    _wrap("MMI%20Resident%20Hub/06-ocean-azure-mobile-units.png"),
    _wrap("MMI%20Resident%20Hub/07-ocean-azure-mobile-maintenance.png"),
    _wrap("MMI%20Resident%20Hub/08-ocean-azure-mobile-community.png"),
    constructionHome, constructionTimeline,
  ],

  retail: [
    _wrap("Tatush%20Hair%20Fragrance/desktop-homepage.png"),
    _wrap("Tatush%20Hair%20Fragrance/desktop-shop.png"),
    _wrap("Tatush%20Hair%20Fragrance/mobile-home.png"),
    _wrap("Tatush%20Hair%20Fragrance/mobile-shop.png"),
    _wrap("Tatush%20Hair%20Fragrance/mobile-detail.png"),
    _wrap("Tatush%20Hair%20Fragrance/mobile-cart.png"),
    retailHome, retailDetail,
  ],

  electrician: [electricianHome, electricianDetail],
  agriturismo: [agriturismoHome, agriturismoActivities],
  cleaning: [cleaningHome, cleaningBooking],
  legal: [legalHome, legalCase],
  accounting: [accountingHome, accountingInvoice],
  garage: [garageHome, garageDetail],
  photography: [photographyHome, photographyGallery],
  gardening: [gardeningHome, gardeningProject],
  tattoo: [tattooHome, tattooArtist],
  education: [educationHome, educationCourse],
  events: [eventsHome, eventsDetail],
  logistics: [logisticsHome, logisticsTracking],
};

/* ═══════════════════════════════════════════
   PORTFOLIO DATA — detailed by brand & style
   Used in partner portfolio / sales presentations
   All 577 mockups organized by brand and style variant
   ═══════════════════════════════════════════ */

export interface MockupBrand {
  name: string;
  styles: MockupStyle[];
}

export interface MockupStyle {
  name: string;
  screens: string[];        // [home, menu/services, detail, cart/booking]
  desktopScreens?: string[]; // optional desktop versions
  thumbnail: string;        // home screen URL
}

export interface SectorPortfolio {
  sectorId: IndustryId;
  sectorLabel: string;
  brands: MockupBrand[];
}

export const SECTOR_PORTFOLIO: SectorPortfolio[] = [
  {
    sectorId: "food",
    sectorLabel: "Food & Ristorazione",
    brands: [
      {
        name: "COTE Miami",
        styles: [
          { name: "Obsidian", thumbnail: _wrap("COTE%20Miami/a-obsidian-mobile-home.png"), screens: [
            _wrap("COTE%20Miami/a-obsidian-mobile-home.png"), _wrap("COTE%20Miami/a-obsidian-mobile-menu.png"),
            _wrap("COTE%20Miami/a-obsidian-mobile-detail.png"), _wrap("COTE%20Miami/a-obsidian-mobile-cart.png"),
          ], desktopScreens: [
            _wrap("COTE%20Miami/a-obsidian-desktop-home.png"), _wrap("COTE%20Miami/a-obsidian-desktop-menu.png"),
            _wrap("COTE%20Miami/a-obsidian-desktop-detail.png"), _wrap("COTE%20Miami/a-obsidian-desktop-cart.png"),
          ]},
          { name: "Ivory", thumbnail: _wrap("COTE%20Miami/b-ivory-mobile-home.png"), screens: [
            _wrap("COTE%20Miami/b-ivory-mobile-home.png"), _wrap("COTE%20Miami/b-ivory-mobile-menu.png"),
            _wrap("COTE%20Miami/b-ivory-mobile-detail.png"), _wrap("COTE%20Miami/b-ivory-mobile-cart.png"),
          ], desktopScreens: [
            _wrap("COTE%20Miami/b-ivory-desktop-home.png"), _wrap("COTE%20Miami/b-ivory-desktop-menu.png"),
            _wrap("COTE%20Miami/b-ivory-desktop-detail.png"), _wrap("COTE%20Miami/b-ivory-desktop-cart.png"),
          ]},
          { name: "Marble", thumbnail: _wrap("COTE%20Miami/d-marble-mobile-home.png"), screens: [
            _wrap("COTE%20Miami/d-marble-mobile-home.png"), _wrap("COTE%20Miami/d-marble-mobile-menu.png"),
            _wrap("COTE%20Miami/d-marble-mobile-detail.png"), _wrap("COTE%20Miami/d-marble-mobile-cart.png"),
          ], desktopScreens: [
            _wrap("COTE%20Miami/d-marble-desktop-home.png"), _wrap("COTE%20Miami/d-marble-desktop-menu.png"),
            _wrap("COTE%20Miami/d-marble-desktop-detail.png"), _wrap("COTE%20Miami/d-marble-desktop-cart.png"),
          ]},
          { name: "Hanok", thumbnail: _wrap("COTE%20Miami/e-hanok-mobile-home.png"), screens: [
            _wrap("COTE%20Miami/e-hanok-mobile-home.png"), _wrap("COTE%20Miami/e-hanok-mobile-menu.png"),
            _wrap("COTE%20Miami/e-hanok-mobile-detail.png"), _wrap("COTE%20Miami/e-hanok-mobile-cart.png"),
          ], desktopScreens: [
            _wrap("COTE%20Miami/e-hanok-desktop-home.png"), _wrap("COTE%20Miami/e-hanok-desktop-menu.png"),
            _wrap("COTE%20Miami/e-hanok-desktop-detail.png"), _wrap("COTE%20Miami/e-hanok-desktop-cart.png"),
          ]},
          { name: "Gangnam", thumbnail: _wrap("COTE%20Miami/f-gangnam-mobile-home.png"), screens: [
            _wrap("COTE%20Miami/f-gangnam-mobile-home.png"), _wrap("COTE%20Miami/f-gangnam-mobile-menu.png"),
            _wrap("COTE%20Miami/f-gangnam-mobile-detail.png"), _wrap("COTE%20Miami/f-gangnam-mobile-cart.png"),
          ], desktopScreens: [
            _wrap("COTE%20Miami/f-gangnam-desktop-home.png"), _wrap("COTE%20Miami/f-gangnam-desktop-menu.png"),
            _wrap("COTE%20Miami/f-gangnam-desktop-detail.png"), _wrap("COTE%20Miami/f-gangnam-desktop-cart.png"),
          ]},
          { name: "Joseon", thumbnail: _wrap("COTE%20Miami/h-joseon-mobile-home.png"), screens: [
            _wrap("COTE%20Miami/h-joseon-mobile-home.png"), _wrap("COTE%20Miami/h-joseon-mobile-menu.png"),
            _wrap("COTE%20Miami/h-joseon-mobile-detail.png"), _wrap("COTE%20Miami/h-joseon-mobile-cart.png"),
          ], desktopScreens: [
            _wrap("COTE%20Miami/h-joseon-desktop-home.png"), _wrap("COTE%20Miami/h-joseon-desktop-menu.png"),
            _wrap("COTE%20Miami/h-joseon-desktop-detail.png"), _wrap("COTE%20Miami/h-joseon-desktop-cart.png"),
          ]},
        ],
      },
      {
        name: "Paperfish Sushi",
        styles: [
          { name: "Sakura", thumbnail: _wrap("Paperfish%20Sushi/a-sakura-home.png"), screens: [
            _wrap("Paperfish%20Sushi/a-sakura-home.png"), _wrap("Paperfish%20Sushi/a-sakura-menu.png"),
            _wrap("Paperfish%20Sushi/a-sakura-detail.png"), _wrap("Paperfish%20Sushi/a-sakura-cart.png"),
          ]},
          { name: "Luxury Dark", thumbnail: _wrap("Paperfish%20Sushi/b-luxury-dark-home.png"), screens: [
            _wrap("Paperfish%20Sushi/b-luxury-dark-home.png"), _wrap("Paperfish%20Sushi/b-luxury-dark-menu.png"),
            _wrap("Paperfish%20Sushi/b-luxury-dark-detail.png"), _wrap("Paperfish%20Sushi/b-luxury-dark-cart.png"),
          ]},
          { name: "White Clean", thumbnail: _wrap("Paperfish%20Sushi/c-white-clean-home.png"), screens: [
            _wrap("Paperfish%20Sushi/c-white-clean-home.png"), _wrap("Paperfish%20Sushi/c-white-clean-menu.png"),
            _wrap("Paperfish%20Sushi/c-white-clean-detail.png"), _wrap("Paperfish%20Sushi/c-white-clean-cart.png"),
          ]},
          { name: "Miami Ocean", thumbnail: _wrap("Paperfish%20Sushi/d-miami-ocean-home.png"), screens: [
            _wrap("Paperfish%20Sushi/d-miami-ocean-home.png"), _wrap("Paperfish%20Sushi/d-miami-ocean-menu.png"),
            _wrap("Paperfish%20Sushi/d-miami-ocean-detail.png"), _wrap("Paperfish%20Sushi/d-miami-ocean-cart.png"),
          ]},
          { name: "Pearl Gold", thumbnail: _wrap("Paperfish%20Sushi/e-pearl-gold-home.png"), screens: [
            _wrap("Paperfish%20Sushi/e-pearl-gold-home.png"), _wrap("Paperfish%20Sushi/e-pearl-gold-menu.png"),
            _wrap("Paperfish%20Sushi/e-pearl-gold-detail.png"), _wrap("Paperfish%20Sushi/e-pearl-gold-cart.png"),
          ]},
          { name: "Marble Zen", thumbnail: _wrap("Paperfish%20Sushi/f-marble-zen-home.png"), screens: [
            _wrap("Paperfish%20Sushi/f-marble-zen-home.png"), _wrap("Paperfish%20Sushi/f-marble-zen-menu.png"),
            _wrap("Paperfish%20Sushi/f-marble-zen-detail.png"), _wrap("Paperfish%20Sushi/f-marble-zen-cart.png"),
          ]},
          { name: "Champagne Rose", thumbnail: _wrap("Paperfish%20Sushi/g-champagne-rose-home.png"), screens: [
            _wrap("Paperfish%20Sushi/g-champagne-rose-home.png"), _wrap("Paperfish%20Sushi/g-champagne-rose-menu.png"),
            _wrap("Paperfish%20Sushi/g-champagne-rose-detail.png"), _wrap("Paperfish%20Sushi/g-champagne-rose-cart.png"),
          ]},
          { name: "Arctic Crystal", thumbnail: _wrap("Paperfish%20Sushi/h-arctic-crystal-home.png"), screens: [
            _wrap("Paperfish%20Sushi/h-arctic-crystal-home.png"), _wrap("Paperfish%20Sushi/h-arctic-crystal-menu.png"),
            _wrap("Paperfish%20Sushi/h-arctic-crystal-detail.png"), _wrap("Paperfish%20Sushi/h-arctic-crystal-cart.png"),
          ]},
          { name: "Tsukiji Ice", thumbnail: _wrap("Paperfish%20Sushi/i-tsukiji-ice-home.png"), screens: [
            _wrap("Paperfish%20Sushi/i-tsukiji-ice-home.png"), _wrap("Paperfish%20Sushi/i-tsukiji-ice-menu.png"),
            _wrap("Paperfish%20Sushi/i-tsukiji-ice-detail.png"), _wrap("Paperfish%20Sushi/i-tsukiji-ice-cart.png"),
          ]},
          { name: "Sakura Garden", thumbnail: _wrap("Paperfish%20Sushi/j-sakura-garden-home.png"), screens: [
            _wrap("Paperfish%20Sushi/j-sakura-garden-home.png"), _wrap("Paperfish%20Sushi/j-sakura-garden-menu.png"),
            _wrap("Paperfish%20Sushi/j-sakura-garden-detail.png"), _wrap("Paperfish%20Sushi/j-sakura-garden-cart.png"),
          ]},
          { name: "Wabi Sabi Marble", thumbnail: _wrap("Paperfish%20Sushi/k-wabi-sabi-marble-home.png"), screens: [
            _wrap("Paperfish%20Sushi/k-wabi-sabi-marble-home.png"), _wrap("Paperfish%20Sushi/k-wabi-sabi-marble-menu.png"),
            _wrap("Paperfish%20Sushi/k-wabi-sabi-marble-detail.png"), _wrap("Paperfish%20Sushi/k-wabi-sabi-marble-cart.png"),
          ]},
          { name: "Hinoki Frost", thumbnail: _wrap("Paperfish%20Sushi/l-hinoki-frost-home.png"), screens: [
            _wrap("Paperfish%20Sushi/l-hinoki-frost-home.png"), _wrap("Paperfish%20Sushi/l-hinoki-frost-menu.png"),
            _wrap("Paperfish%20Sushi/l-hinoki-frost-detail.png"), _wrap("Paperfish%20Sushi/l-hinoki-frost-cart.png"),
          ]},
        ],
      },
      {
        name: "La Vang Vietnamese",
        styles: [
          { name: "Noir Saigon", thumbnail: _wrap("La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-home.png"), screens: [
            _wrap("La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-home.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-menu.png"),
            _wrap("La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-detail.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-cart.png"),
          ]},
          { name: "Jade Dynasty", thumbnail: _wrap("La%20Vang%20Vietnamese%20Luxury/b-jade-dynasty-home.png"), screens: [
            _wrap("La%20Vang%20Vietnamese%20Luxury/b-jade-dynasty-home.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/b-jade-dynasty-menu.png"),
            _wrap("La%20Vang%20Vietnamese%20Luxury/b-jade-dynasty-detail.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/b-jade-dynasty-cart.png"),
          ]},
          { name: "Crimson Silk", thumbnail: _wrap("La%20Vang%20Vietnamese%20Luxury/e-crimson-silk-home.png"), screens: [
            _wrap("La%20Vang%20Vietnamese%20Luxury/e-crimson-silk-home.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/e-crimson-silk-menu.png"),
            _wrap("La%20Vang%20Vietnamese%20Luxury/e-crimson-silk-detail.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/e-crimson-silk-cart.png"),
          ]},
          { name: "Golden Hour", thumbnail: _wrap("La%20Vang%20Vietnamese%20Luxury/g-golden-hour-home.png"), screens: [
            _wrap("La%20Vang%20Vietnamese%20Luxury/g-golden-hour-home.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/g-golden-hour-menu.png"),
            _wrap("La%20Vang%20Vietnamese%20Luxury/g-golden-hour-detail.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/g-golden-hour-cart.png"),
          ]},
          { name: "Neon Spice", thumbnail: _wrap("La%20Vang%20Vietnamese%20Luxury/i-neon-spice-home.png"), screens: [
            _wrap("La%20Vang%20Vietnamese%20Luxury/i-neon-spice-home.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/i-neon-spice-menu.png"),
            _wrap("La%20Vang%20Vietnamese%20Luxury/i-neon-spice-detail.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/i-neon-spice-cart.png"),
          ], desktopScreens: [
            _wrap("La%20Vang%20Vietnamese%20Luxury/i-neon-spice-desktop-home.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/i-neon-spice-desktop-menu.png"),
            _wrap("La%20Vang%20Vietnamese%20Luxury/i-neon-spice-desktop-detail.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/i-neon-spice-desktop-cart.png"),
          ]},
          { name: "Volcanic", thumbnail: _wrap("La%20Vang%20Vietnamese%20Luxury/j-volcanic-home.png"), screens: [
            _wrap("La%20Vang%20Vietnamese%20Luxury/j-volcanic-home.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/j-volcanic-menu.png"),
            _wrap("La%20Vang%20Vietnamese%20Luxury/j-volcanic-detail.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/j-volcanic-cart.png"),
          ], desktopScreens: [
            _wrap("La%20Vang%20Vietnamese%20Luxury/j-volcanic-desktop-home.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/j-volcanic-desktop-menu.png"),
            _wrap("La%20Vang%20Vietnamese%20Luxury/j-volcanic-desktop-detail.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/j-volcanic-desktop-cart.png"),
          ]},
          { name: "Matcha Blaze", thumbnail: _wrap("La%20Vang%20Vietnamese%20Luxury/k-matcha-blaze-home.png"), screens: [
            _wrap("La%20Vang%20Vietnamese%20Luxury/k-matcha-blaze-home.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/k-matcha-blaze-menu.png"),
            _wrap("La%20Vang%20Vietnamese%20Luxury/k-matcha-blaze-detail.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/k-matcha-blaze-cart.png"),
          ], desktopScreens: [
            _wrap("La%20Vang%20Vietnamese%20Luxury/k-matcha-blaze-desktop-home.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/k-matcha-blaze-desktop-menu.png"),
            _wrap("La%20Vang%20Vietnamese%20Luxury/k-matcha-blaze-desktop-detail.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/k-matcha-blaze-desktop-cart.png"),
          ]},
          { name: "Obsidian Gold", thumbnail: _wrap("La%20Vang%20Vietnamese%20Luxury/l-obsidian-gold-home.png"), screens: [
            _wrap("La%20Vang%20Vietnamese%20Luxury/l-obsidian-gold-home.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/l-obsidian-gold-menu.png"),
            _wrap("La%20Vang%20Vietnamese%20Luxury/l-obsidian-gold-detail.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/l-obsidian-gold-cart.png"),
          ], desktopScreens: [
            _wrap("La%20Vang%20Vietnamese%20Luxury/l-obsidian-gold-desktop-home.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/l-obsidian-gold-desktop-menu.png"),
            _wrap("La%20Vang%20Vietnamese%20Luxury/l-obsidian-gold-desktop-detail.png"), _wrap("La%20Vang%20Vietnamese%20Luxury/l-obsidian-gold-desktop-cart.png"),
          ]},
        ],
      },
      {
        name: "Batey Cevicheria",
        styles: [
          { name: "Costa Pacifico", thumbnail: _wrap("Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-home.png"), screens: [
            _wrap("Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-home.png"), _wrap("Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-menu.png"),
            _wrap("Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-detail.png"), _wrap("Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-cart.png"),
          ], desktopScreens: [
            _wrap("Batey%20Cevicheria%20Urbana/costa-pacifico-desktop-home.png"), _wrap("Batey%20Cevicheria%20Urbana/costa-pacifico-desktop-menu.png"),
            _wrap("Batey%20Cevicheria%20Urbana/costa-pacifico-desktop-detail.png"), _wrap("Batey%20Cevicheria%20Urbana/costa-pacifico-desktop-cart.png"),
          ]},
          { name: "Casa Nostra", thumbnail: _wrap("Batey%20Cevicheria%20Urbana/casa-nostra-mobile-home.png"), screens: [
            _wrap("Batey%20Cevicheria%20Urbana/casa-nostra-mobile-home.png"), _wrap("Batey%20Cevicheria%20Urbana/casa-nostra-mobile-menu.png"),
            _wrap("Batey%20Cevicheria%20Urbana/casa-nostra-mobile-detail.png"), _wrap("Batey%20Cevicheria%20Urbana/casa-nostra-mobile-cart.png"),
          ], desktopScreens: [
            _wrap("Batey%20Cevicheria%20Urbana/casa-nostra-desktop-home.png"), _wrap("Batey%20Cevicheria%20Urbana/casa-nostra-desktop-menu.png"),
            _wrap("Batey%20Cevicheria%20Urbana/casa-nostra-desktop-detail.png"), _wrap("Batey%20Cevicheria%20Urbana/casa-nostra-desktop-cart.png"),
          ]},
          { name: "Bianco Memoria", thumbnail: _wrap("Batey%20Cevicheria%20Urbana/bianco-memoria-mobile-home.png"), screens: [
            _wrap("Batey%20Cevicheria%20Urbana/bianco-memoria-mobile-home.png"), _wrap("Batey%20Cevicheria%20Urbana/bianco-memoria-mobile-menu.png"),
            _wrap("Batey%20Cevicheria%20Urbana/bianco-memoria-mobile-detail.png"), _wrap("Batey%20Cevicheria%20Urbana/bianco-memoria-mobile-cart.png"),
          ], desktopScreens: [
            _wrap("Batey%20Cevicheria%20Urbana/bianco-memoria-desktop-home.png"), _wrap("Batey%20Cevicheria%20Urbana/bianco-memoria-desktop-menu.png"),
            _wrap("Batey%20Cevicheria%20Urbana/bianco-memoria-desktop-detail.png"), _wrap("Batey%20Cevicheria%20Urbana/bianco-memoria-desktop-cart.png"),
          ]},
          { name: "Ocra Lima", thumbnail: _wrap("Batey%20Cevicheria%20Urbana/ocra-lima-mobile-home.png"), screens: [
            _wrap("Batey%20Cevicheria%20Urbana/ocra-lima-mobile-home.png"), _wrap("Batey%20Cevicheria%20Urbana/ocra-lima-mobile-menu.png"),
            _wrap("Batey%20Cevicheria%20Urbana/ocra-lima-mobile-detail.png"), _wrap("Batey%20Cevicheria%20Urbana/ocra-lima-mobile-cart.png"),
          ], desktopScreens: [
            _wrap("Batey%20Cevicheria%20Urbana/ocra-lima-desktop-home.png"), _wrap("Batey%20Cevicheria%20Urbana/ocra-lima-desktop-menu.png"),
            _wrap("Batey%20Cevicheria%20Urbana/ocra-lima-desktop-detail.png"), _wrap("Batey%20Cevicheria%20Urbana/ocra-lima-desktop-cart.png"),
          ]},
        ],
      },
      {
        name: "Midtown Kosher",
        styles: [
          { name: "Style A", thumbnail: _wrap("Midtown%20Kosher/mobile-a-home.png"), screens: [
            _wrap("Midtown%20Kosher/mobile-a-home.png"), _wrap("Midtown%20Kosher/mobile-a-menu.png"),
            _wrap("Midtown%20Kosher/mobile-a-detail.png"), _wrap("Midtown%20Kosher/mobile-a-cart.png"),
          ], desktopScreens: [
            _wrap("Midtown%20Kosher/style-a-home.png"), _wrap("Midtown%20Kosher/style-a-menu.png"),
            _wrap("Midtown%20Kosher/style-a-detail.png"), _wrap("Midtown%20Kosher/style-a-cart.png"),
          ]},
          { name: "Style B", thumbnail: _wrap("Midtown%20Kosher/mobile-b-home.png"), screens: [
            _wrap("Midtown%20Kosher/mobile-b-home.png"), _wrap("Midtown%20Kosher/mobile-b-menu.png"),
            _wrap("Midtown%20Kosher/mobile-b-detail.png"), _wrap("Midtown%20Kosher/mobile-b-cart.png"),
          ], desktopScreens: [
            _wrap("Midtown%20Kosher/style-b-home.png"), _wrap("Midtown%20Kosher/style-b-menu.png"),
            _wrap("Midtown%20Kosher/style-b-detail.png"), _wrap("Midtown%20Kosher/style-b-cart.png"),
          ]},
          { name: "Style C", thumbnail: _wrap("Midtown%20Kosher/mobile-c-home.png"), screens: [
            _wrap("Midtown%20Kosher/mobile-c-home.png"), _wrap("Midtown%20Kosher/mobile-c-menu.png"),
            _wrap("Midtown%20Kosher/mobile-c-detail.png"), _wrap("Midtown%20Kosher/mobile-c-cart.png"),
          ], desktopScreens: [
            _wrap("Midtown%20Kosher/style-c-home.png"), _wrap("Midtown%20Kosher/style-c-menu.png"),
            _wrap("Midtown%20Kosher/style-c-detail.png"), _wrap("Midtown%20Kosher/style-c-cart.png"),
          ]},
          { name: "Style D", thumbnail: _wrap("Midtown%20Kosher/mobile-d-home.png"), screens: [
            _wrap("Midtown%20Kosher/mobile-d-home.png"), _wrap("Midtown%20Kosher/mobile-d-menu.png"),
            _wrap("Midtown%20Kosher/mobile-d-detail.png"), _wrap("Midtown%20Kosher/mobile-d-cart.png"),
          ], desktopScreens: [
            _wrap("Midtown%20Kosher/style-d-home.png"), _wrap("Midtown%20Kosher/style-d-menu.png"),
            _wrap("Midtown%20Kosher/style-d-detail.png"), _wrap("Midtown%20Kosher/style-d-cart.png"),
          ]},
          // Additional mobile-only styles (e-h)
          { name: "Style E", thumbnail: _wrap("Midtown%20Kosher/mobile-e-home.png"), screens: [
            _wrap("Midtown%20Kosher/mobile-e-home.png"), _wrap("Midtown%20Kosher/mobile-e-menu.png"),
            _wrap("Midtown%20Kosher/mobile-e-detail.png"), _wrap("Midtown%20Kosher/mobile-e-cart.png"),
          ]},
          { name: "Style F", thumbnail: _wrap("Midtown%20Kosher/mobile-f-home.png"), screens: [
            _wrap("Midtown%20Kosher/mobile-f-home.png"), _wrap("Midtown%20Kosher/mobile-f-menu.png"),
            _wrap("Midtown%20Kosher/mobile-f-detail.png"), _wrap("Midtown%20Kosher/mobile-f-cart.png"),
          ]},
          { name: "Style G", thumbnail: _wrap("Midtown%20Kosher/mobile-g-home.png"), screens: [
            _wrap("Midtown%20Kosher/mobile-g-home.png"), _wrap("Midtown%20Kosher/mobile-g-menu.png"),
            _wrap("Midtown%20Kosher/mobile-g-detail.png"), _wrap("Midtown%20Kosher/mobile-g-cart.png"),
          ]},
          { name: "Style H", thumbnail: _wrap("Midtown%20Kosher/mobile-h-home.png"), screens: [
            _wrap("Midtown%20Kosher/mobile-h-home.png"), _wrap("Midtown%20Kosher/mobile-h-menu.png"),
            _wrap("Midtown%20Kosher/mobile-h-detail.png"), _wrap("Midtown%20Kosher/mobile-h-cart.png"),
          ]},
        ],
      },
      {
        name: "Flame Kebab",
        styles: [
          { name: "Default", thumbnail: _wrap("flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png"), screens: [
            _wrap("flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png"),
            _wrap("flame-kebab/730290ed-5bf6-485f-b999-b75602a57d11.png"),
            _wrap("flame-kebab/c31559c3-67cf-4f62-b4e7-74833046eda7.png"),
            _wrap("flame-kebab/2c4522d2-0ca5-4dbf-a412-ef366f55a13e.png"),
            _wrap("flame-kebab/27beb33c-82a4-46b4-9090-279f7e6b2911.png"),
            _wrap("flame-kebab/312c85cb-9d51-4b8c-98d1-eadca41acc70.png"),
            _wrap("flame-kebab/9952edef-41f5-499f-baeb-ad1b127f4cd6.png"),
          ]},
        ],
      },
    ],
  },
  // ═══ BEAUTY & WELLNESS ═══
  {
    sectorId: "beauty",
    sectorLabel: "Beauty & Wellness",
    brands: [
      {
        name: "Neo Nails Brickell",
        styles: [
          { name: "Lavender Luxe", thumbnail: _wrap("Neo%20Nails%20Brickell/lavender-luxe-home.png"), screens: [
            _wrap("Neo%20Nails%20Brickell/lavender-luxe-home.png"), _wrap("Neo%20Nails%20Brickell/lavender-luxe-servizi.png"),
            _wrap("Neo%20Nails%20Brickell/lavender-luxe-dettaglio.png"), _wrap("Neo%20Nails%20Brickell/lavender-luxe-booking.png"),
          ]},
          { name: "Blush Rosegold", thumbnail: _wrap("Neo%20Nails%20Brickell/blush-rosegold-home.png"), screens: [
            _wrap("Neo%20Nails%20Brickell/blush-rosegold-home.png"), _wrap("Neo%20Nails%20Brickell/blush-rosegold-servizi.png"),
            _wrap("Neo%20Nails%20Brickell/blush-rosegold-dettaglio.png"), _wrap("Neo%20Nails%20Brickell/blush-rosegold-booking.png"),
          ]},
        ],
      },
      {
        name: "Tatush Hair Fragrance",
        styles: [
          { name: "Mobile", thumbnail: _wrap("Tatush%20Hair%20Fragrance/mobile-home.png"), screens: [
            _wrap("Tatush%20Hair%20Fragrance/mobile-home.png"), _wrap("Tatush%20Hair%20Fragrance/mobile-shop.png"),
            _wrap("Tatush%20Hair%20Fragrance/mobile-detail.png"), _wrap("Tatush%20Hair%20Fragrance/mobile-cart.png"),
          ]},
          { name: "Desktop", thumbnail: _wrap("Tatush%20Hair%20Fragrance/desktop-homepage.png"), screens: [
            _wrap("Tatush%20Hair%20Fragrance/desktop-homepage.png"), _wrap("Tatush%20Hair%20Fragrance/desktop-shop.png"),
            _wrap("Tatush%20Hair%20Fragrance/desktop-detail.png"), _wrap("Tatush%20Hair%20Fragrance/desktop-cart.png"),
          ]},
        ],
      },
    ],
  },
  // ═══ NCC & TRASPORTI ═══
  {
    sectorId: "ncc",
    sectorLabel: "NCC & Trasporti",
    brands: [
      {
        name: "Miami Boats Rental",
        styles: [
          { name: "Style A", thumbnail: _wrap("Miami%20Boats%20Rental/A-mobile-home.png"), screens: [
            _wrap("Miami%20Boats%20Rental/A-mobile-home.png"), _wrap("Miami%20Boats%20Rental/A-mobile-fleet.png"),
            _wrap("Miami%20Boats%20Rental/A-mobile-yacht-detail.png"), _wrap("Miami%20Boats%20Rental/A-mobile-booking.png"),
          ], desktopScreens: [
            _wrap("Miami%20Boats%20Rental/A-desktop-home.png"), _wrap("Miami%20Boats%20Rental/A-desktop-fleet.png"),
            _wrap("Miami%20Boats%20Rental/A-desktop-yacht-detail.png"), _wrap("Miami%20Boats%20Rental/A-desktop-booking.png"),
          ]},
          { name: "Style C", thumbnail: _wrap("Miami%20Boats%20Rental/C-mobile-home.png"), screens: [
            _wrap("Miami%20Boats%20Rental/C-mobile-home.png"), _wrap("Miami%20Boats%20Rental/C-mobile-fleet.png"),
            _wrap("Miami%20Boats%20Rental/C-mobile-yacht-detail.png"), _wrap("Miami%20Boats%20Rental/C-mobile-booking.png"),
          ], desktopScreens: [
            _wrap("Miami%20Boats%20Rental/C-desktop-home.png"), _wrap("Miami%20Boats%20Rental/C-desktop-fleet.png"),
            _wrap("Miami%20Boats%20Rental/C-desktop-yacht-detail.png"), _wrap("Miami%20Boats%20Rental/C-desktop-booking.png"),
          ]},
          { name: "Style F", thumbnail: _wrap("Miami%20Boats%20Rental/F-mobile-home.png"), screens: [
            _wrap("Miami%20Boats%20Rental/F-mobile-home.png"), _wrap("Miami%20Boats%20Rental/F-mobile-fleet.png"),
            _wrap("Miami%20Boats%20Rental/F-mobile-yacht-detail.png"), _wrap("Miami%20Boats%20Rental/F-mobile-booking.png"),
          ], desktopScreens: [
            _wrap("Miami%20Boats%20Rental/F-desktop-home.png"), _wrap("Miami%20Boats%20Rental/F-desktop-fleet.png"),
            _wrap("Miami%20Boats%20Rental/F-desktop-yacht-detail.png"), _wrap("Miami%20Boats%20Rental/F-desktop-booking.png"),
          ]},
          { name: "Style G", thumbnail: _wrap("Miami%20Boats%20Rental/G-mobile-home.png"), screens: [
            _wrap("Miami%20Boats%20Rental/G-mobile-home.png"), _wrap("Miami%20Boats%20Rental/G-mobile-fleet.png"),
            _wrap("Miami%20Boats%20Rental/G-mobile-yacht-detail.png"), _wrap("Miami%20Boats%20Rental/G-mobile-booking.png"),
          ], desktopScreens: [
            _wrap("Miami%20Boats%20Rental/G-desktop-home.png"), _wrap("Miami%20Boats%20Rental/G-desktop-fleet.png"),
            _wrap("Miami%20Boats%20Rental/G-desktop-yacht-detail.png"), _wrap("Miami%20Boats%20Rental/G-desktop-booking.png"),
          ]},
          { name: "Style H", thumbnail: _wrap("Miami%20Boats%20Rental/H-mobile-home.png"), screens: [
            _wrap("Miami%20Boats%20Rental/H-mobile-home.png"), _wrap("Miami%20Boats%20Rental/H-mobile-fleet.png"),
            _wrap("Miami%20Boats%20Rental/H-mobile-yacht-detail.png"), _wrap("Miami%20Boats%20Rental/H-mobile-booking.png"),
          ], desktopScreens: [
            _wrap("Miami%20Boats%20Rental/H-desktop-home.png"), _wrap("Miami%20Boats%20Rental/H-desktop-fleet.png"),
            _wrap("Miami%20Boats%20Rental/H-desktop-yacht-detail.png"), _wrap("Miami%20Boats%20Rental/H-desktop-booking.png"),
          ]},
        ],
      },
      {
        name: "Asinara Charter",
        styles: [
          { name: "Sardinia Azure Luxury", thumbnail: _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png"), screens: [
            _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png"), _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/escursioni.png"),
            _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/dettaglio-tour.png"), _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/prenotazione.png"),
          ]},
          { name: "Emerald Cove", thumbnail: _wrap("Asinara%20Charter%20-%20Emerald%20Cove/home.png"), screens: [
            _wrap("Asinara%20Charter%20-%20Emerald%20Cove/home.png"), _wrap("Asinara%20Charter%20-%20Emerald%20Cove/escursioni.png"),
            _wrap("Asinara%20Charter%20-%20Emerald%20Cove/dettaglio-tour.png"), _wrap("Asinara%20Charter%20-%20Emerald%20Cove/prenotazione.png"),
          ]},
          { name: "Golden Sunset", thumbnail: _wrap("Asinara%20Charter%20-%20Golden%20Sunset/home.png"), screens: [
            _wrap("Asinara%20Charter%20-%20Golden%20Sunset/home.png"), _wrap("Asinara%20Charter%20-%20Golden%20Sunset/escursioni.png"),
            _wrap("Asinara%20Charter%20-%20Golden%20Sunset/dettaglio-tour.png"), _wrap("Asinara%20Charter%20-%20Golden%20Sunset/prenotazione.png"),
          ]},
          // Desktop variants
          { name: "Sardinia Azure Desktop", thumbnail: _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury%20Desktop/home.png"), screens: [
            _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury%20Desktop/home.png"), _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury%20Desktop/escursioni.png"),
            _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury%20Desktop/dettaglio-tour.png"), _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury%20Desktop/prenotazione.png"),
          ]},
          { name: "Emerald Cove Desktop", thumbnail: _wrap("Asinara%20Charter%20-%20Emerald%20Cove%20Desktop/home.png"), screens: [
            _wrap("Asinara%20Charter%20-%20Emerald%20Cove%20Desktop/home.png"), _wrap("Asinara%20Charter%20-%20Emerald%20Cove%20Desktop/escursioni.png"),
            _wrap("Asinara%20Charter%20-%20Emerald%20Cove%20Desktop/dettaglio-tour.png"), _wrap("Asinara%20Charter%20-%20Emerald%20Cove%20Desktop/prenotazione.png"),
          ]},
        ],
      },
    ],
  },
  // ═══ VETERINARIO ═══
  {
    sectorId: "veterinary",
    sectorLabel: "Veterinario",
    brands: [
      {
        name: "Aloha Pet Resorts",
        styles: [
          { name: "Style A", thumbnail: _wrap("Aloha%20Pet%20Resorts/mobile-a-home.png"), screens: [
            _wrap("Aloha%20Pet%20Resorts/mobile-a-home.png"), _wrap("Aloha%20Pet%20Resorts/mobile-a-services.png"),
            _wrap("Aloha%20Pet%20Resorts/mobile-a-detail.png"), _wrap("Aloha%20Pet%20Resorts/mobile-a-booking.png"),
          ]},
          { name: "Style E", thumbnail: _wrap("Aloha%20Pet%20Resorts/mobile-e-home.png"), screens: [
            _wrap("Aloha%20Pet%20Resorts/mobile-e-home.png"), _wrap("Aloha%20Pet%20Resorts/mobile-e-services.png"),
            _wrap("Aloha%20Pet%20Resorts/mobile-e-detail.png"), _wrap("Aloha%20Pet%20Resorts/mobile-e-booking.png"),
          ]},
          { name: "Style F", thumbnail: _wrap("Aloha%20Pet%20Resorts/mobile-f-home.png"), screens: [
            _wrap("Aloha%20Pet%20Resorts/mobile-f-home.png"), _wrap("Aloha%20Pet%20Resorts/mobile-f-services.png"),
            _wrap("Aloha%20Pet%20Resorts/mobile-f-detail.png"), _wrap("Aloha%20Pet%20Resorts/mobile-f-booking.png"),
          ]},
          { name: "Style G", thumbnail: _wrap("Aloha%20Pet%20Resorts/mobile-g-home.png"), screens: [
            _wrap("Aloha%20Pet%20Resorts/mobile-g-home.png"), _wrap("Aloha%20Pet%20Resorts/mobile-g-services.png"),
            _wrap("Aloha%20Pet%20Resorts/mobile-g-detail.png"), _wrap("Aloha%20Pet%20Resorts/mobile-g-booking.png"),
          ]},
          // Desktop
          { name: "Desktop A", thumbnail: _wrap("Aloha%20Pet%20Resorts/desktop-a-home.png"), screens: [
            _wrap("Aloha%20Pet%20Resorts/desktop-a-home.png"), _wrap("Aloha%20Pet%20Resorts/desktop-a-services.png"),
            _wrap("Aloha%20Pet%20Resorts/desktop-a-detail.png"), _wrap("Aloha%20Pet%20Resorts/desktop-a-booking.png"),
          ]},
          { name: "Desktop B", thumbnail: _wrap("Aloha%20Pet%20Resorts/desktop-b-home.png"), screens: [
            _wrap("Aloha%20Pet%20Resorts/desktop-b-home.png"), _wrap("Aloha%20Pet%20Resorts/desktop-b-services.png"),
            _wrap("Aloha%20Pet%20Resorts/desktop-b-detail.png"), _wrap("Aloha%20Pet%20Resorts/desktop-b-booking.png"),
          ]},
          { name: "Desktop C", thumbnail: _wrap("Aloha%20Pet%20Resorts/desktop-c-home.png"), screens: [
            _wrap("Aloha%20Pet%20Resorts/desktop-c-home.png"), _wrap("Aloha%20Pet%20Resorts/desktop-c-services.png"),
            _wrap("Aloha%20Pet%20Resorts/desktop-c-detail.png"), _wrap("Aloha%20Pet%20Resorts/desktop-c-booking.png"),
          ]},
          { name: "Desktop D", thumbnail: _wrap("Aloha%20Pet%20Resorts/desktop-d-home.png"), screens: [
            _wrap("Aloha%20Pet%20Resorts/desktop-d-home.png"), _wrap("Aloha%20Pet%20Resorts/desktop-d-services.png"),
            _wrap("Aloha%20Pet%20Resorts/desktop-d-detail.png"), _wrap("Aloha%20Pet%20Resorts/desktop-d-booking.png"),
          ]},
        ],
      },
    ],
  },
  // ═══ ASILI & INFANZIA ═══
  {
    sectorId: "childcare",
    sectorLabel: "Asili & Infanzia",
    brands: [
      {
        name: "Little Diamond Nursery",
        styles: [
          { name: "Playful Colorful", thumbnail: _wrap("Little%20Diamond%20Nursery%20-%20Playful%20Colorful/home.png"), screens: [
            _wrap("Little%20Diamond%20Nursery%20-%20Playful%20Colorful/home.png"), _wrap("Little%20Diamond%20Nursery%20-%20Playful%20Colorful/programs-activities.png"),
            _wrap("Little%20Diamond%20Nursery%20-%20Playful%20Colorful/team-tour.png"), _wrap("Little%20Diamond%20Nursery%20-%20Playful%20Colorful/meal-plan-enroll.png"),
          ]},
          { name: "Nature Explorer", thumbnail: _wrap("Little%20Diamond%20Nursery%20-%20Nature%20Explorer/home.png"), screens: [
            _wrap("Little%20Diamond%20Nursery%20-%20Nature%20Explorer/home.png"), _wrap("Little%20Diamond%20Nursery%20-%20Nature%20Explorer/programs-activities.png"),
            _wrap("Little%20Diamond%20Nursery%20-%20Nature%20Explorer/team-tour.png"), _wrap("Little%20Diamond%20Nursery%20-%20Nature%20Explorer/meal-plan-enroll.png"),
          ]},
          { name: "Ocean Breeze", thumbnail: _wrap("Little%20Diamond%20Nursery%20-%20Ocean%20Breeze/home.png"), screens: [
            _wrap("Little%20Diamond%20Nursery%20-%20Ocean%20Breeze/home.png"), _wrap("Little%20Diamond%20Nursery%20-%20Ocean%20Breeze/programs-activities.png"),
            _wrap("Little%20Diamond%20Nursery%20-%20Ocean%20Breeze/team-tour.png"), _wrap("Little%20Diamond%20Nursery%20-%20Ocean%20Breeze/meal-plan-enroll.png"),
          ]},
          { name: "Sunny Garden", thumbnail: _wrap("Little%20Diamond%20Nursery%20-%20Sunny%20Garden/home.png"), screens: [
            _wrap("Little%20Diamond%20Nursery%20-%20Sunny%20Garden/home.png"), _wrap("Little%20Diamond%20Nursery%20-%20Sunny%20Garden/programs-activities.png"),
            _wrap("Little%20Diamond%20Nursery%20-%20Sunny%20Garden/team-tour.png"), _wrap("Little%20Diamond%20Nursery%20-%20Sunny%20Garden/meal-plan-enroll.png"),
          ]},
          { name: "Sunset Playful", thumbnail: _wrap("Little%20Diamond%20Nursery%20-%20Sunset%20Playful/home.png"), screens: [
            _wrap("Little%20Diamond%20Nursery%20-%20Sunset%20Playful/home.png"), _wrap("Little%20Diamond%20Nursery%20-%20Sunset%20Playful/programs-activities.png"),
            _wrap("Little%20Diamond%20Nursery%20-%20Sunset%20Playful/team-tour.png"), _wrap("Little%20Diamond%20Nursery%20-%20Sunset%20Playful/meal-plan-enroll.png"),
          ]},
        ],
      },
      {
        name: "Ashley's Playhouse",
        styles: [
          { name: "Style A", thumbnail: _wrap("Ashley's%20Playhouse/stile-a-home.png"), screens: [
            _wrap("Ashley's%20Playhouse/stile-a-home.png"), _wrap("Ashley's%20Playhouse/stile-a-programs.png"),
            _wrap("Ashley's%20Playhouse/stile-a-book.png"), _wrap("Ashley's%20Playhouse/stile-a-parent.png"),
          ]},
          { name: "Style B", thumbnail: _wrap("Ashley's%20Playhouse/stile-b-home.png"), screens: [
            _wrap("Ashley's%20Playhouse/stile-b-home.png"), _wrap("Ashley's%20Playhouse/stile-b-programs.png"),
            _wrap("Ashley's%20Playhouse/stile-b-book.png"), _wrap("Ashley's%20Playhouse/stile-b-parent.png"),
          ]},
          { name: "Style C", thumbnail: _wrap("Ashley's%20Playhouse/stile-c-home.png"), screens: [
            _wrap("Ashley's%20Playhouse/stile-c-home.png"), _wrap("Ashley's%20Playhouse/stile-c-programs.png"),
            _wrap("Ashley's%20Playhouse/stile-c-book.png"), _wrap("Ashley's%20Playhouse/stile-c-parent.png"),
          ]},
          { name: "Style D", thumbnail: _wrap("Ashley's%20Playhouse/stile-d-home.png"), screens: [
            _wrap("Ashley's%20Playhouse/stile-d-home.png"), _wrap("Ashley's%20Playhouse/stile-d-programs.png"),
            _wrap("Ashley's%20Playhouse/stile-d-book.png"), _wrap("Ashley's%20Playhouse/stile-d-parent.png"),
          ]},
        ],
      },
    ],
  },
  // ═══ FITNESS & SPORT ═══
  {
    sectorId: "fitness",
    sectorLabel: "Fitness & Palestre",
    brands: [
      {
        name: "City Padel Milano",
        styles: [
          { name: "Sage Luxe", thumbnail: _wrap("City%20Padel%20Milano/mobile-sage-luxe-home.png"), screens: [
            _wrap("City%20Padel%20Milano/mobile-sage-luxe-home.png"), _wrap("City%20Padel%20Milano/mobile-sage-luxe-prenota.png"),
            _wrap("City%20Padel%20Milano/mobile-sage-luxe-maestri.png"), _wrap("City%20Padel%20Milano/mobile-sage-luxe-dettaglio.png"),
          ], desktopScreens: [
            _wrap("City%20Padel%20Milano/desktop-sage-luxe-home.png"), _wrap("City%20Padel%20Milano/desktop-sage-luxe-prenota.png"),
            _wrap("City%20Padel%20Milano/desktop-sage-luxe-maestri.png"), _wrap("City%20Padel%20Milano/desktop-sage-luxe-dettaglio.png"),
          ]},
          { name: "Fresh Azzurro", thumbnail: _wrap("City%20Padel%20Milano/mobile-fresh-azzurro-home.png"), screens: [
            _wrap("City%20Padel%20Milano/mobile-fresh-azzurro-home.png"), _wrap("City%20Padel%20Milano/mobile-fresh-azzurro-prenota.png"),
            _wrap("City%20Padel%20Milano/mobile-fresh-azzurro-maestri.png"), _wrap("City%20Padel%20Milano/mobile-fresh-azzurro-dettaglio.png"),
          ], desktopScreens: [
            _wrap("City%20Padel%20Milano/desktop-fresh-azzurro-home.png"), _wrap("City%20Padel%20Milano/desktop-fresh-azzurro-prenota.png"),
            _wrap("City%20Padel%20Milano/desktop-fresh-azzurro-maestri.png"), _wrap("City%20Padel%20Milano/desktop-fresh-azzurro-dettaglio.png"),
          ]},
          { name: "Urban Concrete", thumbnail: _wrap("City%20Padel%20Milano/mobile-urban-concrete-home.png"), screens: [
            _wrap("City%20Padel%20Milano/mobile-urban-concrete-home.png"), _wrap("City%20Padel%20Milano/mobile-urban-concrete-prenota.png"),
            _wrap("City%20Padel%20Milano/mobile-urban-concrete-maestri.png"), _wrap("City%20Padel%20Milano/mobile-urban-concrete-dettaglio.png"),
          ], desktopScreens: [
            _wrap("City%20Padel%20Milano/desktop-urban-concrete-home.png"), _wrap("City%20Padel%20Milano/desktop-urban-concrete-prenota.png"),
            _wrap("City%20Padel%20Milano/desktop-urban-concrete-maestri.png"), _wrap("City%20Padel%20Milano/desktop-urban-concrete-dettaglio.png"),
          ]},
          { name: "Citylife Green", thumbnail: _wrap("City%20Padel%20Milano/mobile-citylife-green-home.png"), screens: [
            _wrap("City%20Padel%20Milano/mobile-citylife-green-home.png"), _wrap("City%20Padel%20Milano/mobile-citylife-green-prenota.png"),
            _wrap("City%20Padel%20Milano/mobile-citylife-green-maestri.png"), _wrap("City%20Padel%20Milano/mobile-citylife-green-dettaglio.png"),
          ], desktopScreens: [
            _wrap("City%20Padel%20Milano/desktop-citylife-green-home.png"), _wrap("City%20Padel%20Milano/desktop-citylife-green-prenota.png"),
            _wrap("City%20Padel%20Milano/desktop-citylife-green-maestri.png"), _wrap("City%20Padel%20Milano/desktop-citylife-green-dettaglio.png"),
          ]},
          { name: "Lime Minimal", thumbnail: _wrap("City%20Padel%20Milano/mobile-lime-minimal-home.png"), screens: [
            _wrap("City%20Padel%20Milano/mobile-lime-minimal-home.png"), _wrap("City%20Padel%20Milano/mobile-lime-minimal-prenota.png"),
            _wrap("City%20Padel%20Milano/mobile-lime-minimal-maestri.png"), _wrap("City%20Padel%20Milano/mobile-lime-minimal-dettaglio.png"),
          ], desktopScreens: [
            _wrap("City%20Padel%20Milano/desktop-lime-minimal-home.png"), _wrap("City%20Padel%20Milano/desktop-lime-minimal-prenota.png"),
            _wrap("City%20Padel%20Milano/desktop-lime-minimal-maestri.png"), _wrap("City%20Padel%20Milano/desktop-lime-minimal-dettaglio.png"),
          ]},
        ],
      },
      {
        name: "Miami Watersports",
        styles: [
          { name: "Style A", thumbnail: _wrap("Miami%20Watersports/style-a-mobile-home.png"), screens: [
            _wrap("Miami%20Watersports/style-a-mobile-home.png"), _wrap("Miami%20Watersports/style-a-mobile-activities.png"),
            _wrap("Miami%20Watersports/style-a-mobile-detail.png"), _wrap("Miami%20Watersports/style-a-mobile-booking.png"),
          ], desktopScreens: [
            _wrap("Miami%20Watersports/style-a-desktop-home.png"), _wrap("Miami%20Watersports/style-a-desktop-activities.png"),
            _wrap("Miami%20Watersports/style-a-desktop-detail.png"), _wrap("Miami%20Watersports/style-a-desktop-booking.png"),
          ]},
          { name: "Style E", thumbnail: _wrap("Miami%20Watersports/style-e-mobile-home.png"), screens: [
            _wrap("Miami%20Watersports/style-e-mobile-home.png"), _wrap("Miami%20Watersports/style-e-mobile-activities.png"),
            _wrap("Miami%20Watersports/style-e-mobile-detail.png"), _wrap("Miami%20Watersports/style-e-mobile-booking.png"),
          ], desktopScreens: [
            _wrap("Miami%20Watersports/style-e-desktop-home.png"), _wrap("Miami%20Watersports/style-e-desktop-activities.png"),
            _wrap("Miami%20Watersports/style-e-desktop-detail.png"), _wrap("Miami%20Watersports/style-e-desktop-booking.png"),
          ]},
          { name: "Style G", thumbnail: _wrap("Miami%20Watersports/style-g-mobile-home.png"), screens: [
            _wrap("Miami%20Watersports/style-g-mobile-home.png"), _wrap("Miami%20Watersports/style-g-mobile-activities.png"),
            _wrap("Miami%20Watersports/style-g-mobile-detail.png"), _wrap("Miami%20Watersports/style-g-mobile-booking.png"),
          ], desktopScreens: [
            _wrap("Miami%20Watersports/style-g-desktop-home.png"), _wrap("Miami%20Watersports/style-g-desktop-activities.png"),
            _wrap("Miami%20Watersports/style-g-desktop-detail.png"), _wrap("Miami%20Watersports/style-g-desktop-booking.png"),
          ]},
          { name: "Style H", thumbnail: _wrap("Miami%20Watersports/style-h-mobile-home.png"), screens: [
            _wrap("Miami%20Watersports/style-h-mobile-home.png"), _wrap("Miami%20Watersports/style-h-mobile-activities.png"),
            _wrap("Miami%20Watersports/style-h-mobile-detail.png"), _wrap("Miami%20Watersports/style-h-mobile-booking.png"),
          ], desktopScreens: [
            _wrap("Miami%20Watersports/style-h-desktop-home.png"), _wrap("Miami%20Watersports/style-h-desktop-activities.png"),
            _wrap("Miami%20Watersports/style-h-desktop-detail.png"), _wrap("Miami%20Watersports/style-h-desktop-booking.png"),
          ]},
        ],
      },
    ],
  },
  // ═══ HEALTHCARE ═══
  {
    sectorId: "healthcare",
    sectorLabel: "Healthcare & Cliniche",
    brands: [
      {
        name: "FAR Medical Solutions",
        styles: [
          { name: "Ethereal Glass", thumbnail: _wrap("FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png"), screens: [
            _wrap("FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png"), _wrap("FAR%20Medical%20Solutions/a-ethereal-glass-mobile-servizi.png"),
            _wrap("FAR%20Medical%20Solutions/a-ethereal-glass-mobile-prodotti.png"), _wrap("FAR%20Medical%20Solutions/a-ethereal-glass-mobile-contatti.png"),
          ], desktopScreens: [
            _wrap("FAR%20Medical%20Solutions/a-ethereal-glass-desktop-home.png"), _wrap("FAR%20Medical%20Solutions/a-ethereal-glass-desktop-servizi.png"),
            _wrap("FAR%20Medical%20Solutions/a-ethereal-glass-desktop-prodotti.png"), _wrap("FAR%20Medical%20Solutions/a-ethereal-glass-desktop-contatti.png"),
          ]},
          { name: "Azure Gradient", thumbnail: _wrap("FAR%20Medical%20Solutions/b-azure-gradient-mobile-home.png"), screens: [
            _wrap("FAR%20Medical%20Solutions/b-azure-gradient-mobile-home.png"), _wrap("FAR%20Medical%20Solutions/b-azure-gradient-mobile-servizi.png"),
            _wrap("FAR%20Medical%20Solutions/b-azure-gradient-mobile-prodotti.png"), _wrap("FAR%20Medical%20Solutions/b-azure-gradient-mobile-contatti.png"),
          ], desktopScreens: [
            _wrap("FAR%20Medical%20Solutions/b-azure-gradient-desktop-home.png"), _wrap("FAR%20Medical%20Solutions/b-azure-gradient-desktop-servizi.png"),
            _wrap("FAR%20Medical%20Solutions/b-azure-gradient-desktop-prodotti.png"), _wrap("FAR%20Medical%20Solutions/b-azure-gradient-desktop-contatti.png"),
          ]},
          { name: "Ice Crystal", thumbnail: _wrap("FAR%20Medical%20Solutions/c-ice-crystal-mobile-home.png"), screens: [
            _wrap("FAR%20Medical%20Solutions/c-ice-crystal-mobile-home.png"), _wrap("FAR%20Medical%20Solutions/c-ice-crystal-mobile-servizi.png"),
            _wrap("FAR%20Medical%20Solutions/c-ice-crystal-mobile-prodotti.png"), _wrap("FAR%20Medical%20Solutions/c-ice-crystal-mobile-contatti.png"),
          ], desktopScreens: [
            _wrap("FAR%20Medical%20Solutions/c-ice-crystal-desktop-home.png"), _wrap("FAR%20Medical%20Solutions/c-ice-crystal-desktop-servizi.png"),
            _wrap("FAR%20Medical%20Solutions/c-ice-crystal-desktop-prodotti.png"), _wrap("FAR%20Medical%20Solutions/c-ice-crystal-desktop-contatti.png"),
          ]},
          { name: "Soft Blue", thumbnail: _wrap("FAR%20Medical%20Solutions/d-soft-blue-mobile-home.png"), screens: [
            _wrap("FAR%20Medical%20Solutions/d-soft-blue-mobile-home.png"), _wrap("FAR%20Medical%20Solutions/d-soft-blue-mobile-servizi.png"),
            _wrap("FAR%20Medical%20Solutions/d-soft-blue-mobile-prodotti.png"), _wrap("FAR%20Medical%20Solutions/d-soft-blue-mobile-contatti.png"),
          ], desktopScreens: [
            _wrap("FAR%20Medical%20Solutions/d-soft-blue-desktop-home.png"), _wrap("FAR%20Medical%20Solutions/d-soft-blue-desktop-servizi.png"),
            _wrap("FAR%20Medical%20Solutions/d-soft-blue-desktop-prodotti.png"), _wrap("FAR%20Medical%20Solutions/d-soft-blue-desktop-contatti.png"),
          ]},
        ],
      },
    ],
  },
  // ═══ EDILIZIA ═══
  {
    sectorId: "construction",
    sectorLabel: "Edilizia & Cantieri",
    brands: [
      {
        name: "MMI Resident Hub",
        styles: [
          { name: "Ocean Azure", thumbnail: _wrap("MMI%20Resident%20Hub/05-ocean-azure-mobile-dashboard.png"), screens: [
            _wrap("MMI%20Resident%20Hub/05-ocean-azure-mobile-dashboard.png"), _wrap("MMI%20Resident%20Hub/06-ocean-azure-mobile-units.png"),
            _wrap("MMI%20Resident%20Hub/07-ocean-azure-mobile-maintenance.png"), _wrap("MMI%20Resident%20Hub/08-ocean-azure-mobile-community.png"),
          ], desktopScreens: [
            _wrap("MMI%20Resident%20Hub/01-ocean-azure-desktop-dashboard.png"), _wrap("MMI%20Resident%20Hub/02-ocean-azure-desktop-units.png"),
            _wrap("MMI%20Resident%20Hub/03-ocean-azure-desktop-maintenance.png"), _wrap("MMI%20Resident%20Hub/04-ocean-azure-desktop-community.png"),
          ]},
          { name: "Living Coral", thumbnail: _wrap("MMI%20Resident%20Hub/05-living-coral-mobile-dashboard.png"), screens: [
            _wrap("MMI%20Resident%20Hub/05-living-coral-mobile-dashboard.png"), _wrap("MMI%20Resident%20Hub/06-living-coral-mobile-units.png"),
            _wrap("MMI%20Resident%20Hub/07-living-coral-mobile-maintenance.png"), _wrap("MMI%20Resident%20Hub/08-living-coral-mobile-community.png"),
          ], desktopScreens: [
            _wrap("MMI%20Resident%20Hub/01-living-coral-desktop-dashboard.png"), _wrap("MMI%20Resident%20Hub/02-living-coral-desktop-units.png"),
            _wrap("MMI%20Resident%20Hub/03-living-coral-desktop-maintenance.png"), _wrap("MMI%20Resident%20Hub/04-living-coral-desktop-community.png"),
          ]},
          { name: "Ice Blue", thumbnail: _wrap("MMI%20Resident%20Hub/05-ice-blue-mobile-dashboard.png"), screens: [
            _wrap("MMI%20Resident%20Hub/05-ice-blue-mobile-dashboard.png"), _wrap("MMI%20Resident%20Hub/06-ice-blue-mobile-units.png"),
            _wrap("MMI%20Resident%20Hub/07-ice-blue-mobile-maintenance.png"), _wrap("MMI%20Resident%20Hub/08-ice-blue-mobile-community.png"),
          ], desktopScreens: [
            _wrap("MMI%20Resident%20Hub/01-ice-blue-desktop-dashboard.png"), _wrap("MMI%20Resident%20Hub/02-ice-blue-desktop-units.png"),
            _wrap("MMI%20Resident%20Hub/03-ice-blue-desktop-maintenance.png"), _wrap("MMI%20Resident%20Hub/04-ice-blue-desktop-community.png"),
          ]},
          { name: "Rose Gold", thumbnail: _wrap("MMI%20Resident%20Hub/05-rose-gold-mobile-dashboard.png"), screens: [
            _wrap("MMI%20Resident%20Hub/05-rose-gold-mobile-dashboard.png"), _wrap("MMI%20Resident%20Hub/06-rose-gold-mobile-units.png"),
            _wrap("MMI%20Resident%20Hub/07-rose-gold-mobile-maintenance.png"), _wrap("MMI%20Resident%20Hub/08-rose-gold-mobile-community.png"),
          ], desktopScreens: [
            _wrap("MMI%20Resident%20Hub/01-rose-gold-desktop-dashboard.png"), _wrap("MMI%20Resident%20Hub/02-rose-gold-desktop-units.png"),
            _wrap("MMI%20Resident%20Hub/03-rose-gold-desktop-maintenance.png"), _wrap("MMI%20Resident%20Hub/04-rose-gold-desktop-community.png"),
          ]},
        ],
      },
    ],
  },
  // ═══ HOSPITALITY ═══
  {
    sectorId: "hospitality",
    sectorLabel: "Hospitality & Hotel",
    brands: [
      {
        name: "Asinara Charter",
        styles: [
          { name: "Sardinia Azure", thumbnail: _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png"), screens: [
            _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png"), _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/escursioni.png"),
            _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/dettaglio-tour.png"), _wrap("Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/prenotazione.png"),
          ]},
        ],
      },
      {
        name: "Miami Boats Rental",
        styles: [
          { name: "Style A", thumbnail: _wrap("Miami%20Boats%20Rental/A-mobile-home.png"), screens: [
            _wrap("Miami%20Boats%20Rental/A-mobile-home.png"), _wrap("Miami%20Boats%20Rental/A-mobile-fleet.png"),
            _wrap("Miami%20Boats%20Rental/A-mobile-yacht-detail.png"), _wrap("Miami%20Boats%20Rental/A-mobile-booking.png"),
          ]},
        ],
      },
    ],
  },
  // ═══ ARTIGIANI ═══
  {
    sectorId: "plumber",
    sectorLabel: "Artigiani & Servizi",
    brands: [
      {
        name: "Nick's Plumbing & AC",
        styles: [
          { name: "Style A", thumbnail: _wrap("Nick's%20Plumbing%20&%20AC/stile-a-home.png"), screens: [
            _wrap("Nick's%20Plumbing%20&%20AC/stile-a-home.png"), _wrap("Nick's%20Plumbing%20&%20AC/stile-a-services.png"),
            _wrap("Nick's%20Plumbing%20&%20AC/stile-a-detail.png"), _wrap("Nick's%20Plumbing%20&%20AC/stile-a-booking.png"),
          ]},
          { name: "Style B", thumbnail: _wrap("Nick's%20Plumbing%20&%20AC/stile-b-home.png"), screens: [
            _wrap("Nick's%20Plumbing%20&%20AC/stile-b-home.png"), _wrap("Nick's%20Plumbing%20&%20AC/stile-b-services.png"),
            _wrap("Nick's%20Plumbing%20&%20AC/stile-b-detail.png"), _wrap("Nick's%20Plumbing%20&%20AC/stile-b-booking.png"),
          ]},
        ],
      },
    ],
  },
  // ═══ RETAIL ═══
  {
    sectorId: "retail",
    sectorLabel: "Retail & Negozi",
    brands: [
      {
        name: "Tatush Hair Fragrance",
        styles: [
          { name: "Mobile", thumbnail: _wrap("Tatush%20Hair%20Fragrance/mobile-home.png"), screens: [
            _wrap("Tatush%20Hair%20Fragrance/mobile-home.png"), _wrap("Tatush%20Hair%20Fragrance/mobile-shop.png"),
            _wrap("Tatush%20Hair%20Fragrance/mobile-detail.png"), _wrap("Tatush%20Hair%20Fragrance/mobile-cart.png"),
          ]},
          { name: "Desktop", thumbnail: _wrap("Tatush%20Hair%20Fragrance/desktop-homepage.png"), screens: [
            _wrap("Tatush%20Hair%20Fragrance/desktop-homepage.png"), _wrap("Tatush%20Hair%20Fragrance/desktop-shop.png"),
            _wrap("Tatush%20Hair%20Fragrance/desktop-detail.png"), _wrap("Tatush%20Hair%20Fragrance/desktop-cart.png"),
          ]},
        ],
      },
    ],
  },
  // ═══ BEACH ═══
  {
    sectorId: "beach",
    sectorLabel: "Stabilimenti Balneari",
    brands: [
      {
        name: "Miami Watersports",
        styles: [
          { name: "Style A", thumbnail: _wrap("Miami%20Watersports/style-a-mobile-home.png"), screens: [
            _wrap("Miami%20Watersports/style-a-mobile-home.png"), _wrap("Miami%20Watersports/style-a-mobile-activities.png"),
          ]},
        ],
      },
    ],
  },
];
