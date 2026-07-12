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

// Local generated assets for sectors without Empire Studio mockups
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
    _wrap("Onyx%20Brace%20Steakhouse/a-obsidian-mobile-home.png"),
    _wrap("Onyx%20Brace%20Steakhouse/a-obsidian-mobile-menu.png"),
    _wrap("Onyx%20Brace%20Steakhouse/a-obsidian-mobile-detail.png"),
    // Sakura Atelier Luxury Dark
    _wrap("Sakura%20Atelier/b-luxury-dark-home.png"),
    _wrap("Sakura%20Atelier/b-luxury-dark-menu.png"),
    _wrap("Sakura%20Atelier/a-sakura-home.png"),
    // Indocina Noir Noir Saigon
    _wrap("Indocina%20Noir/a-noir-saigon-home.png"),
    _wrap("Indocina%20Noir/l-obsidian-gold-home.png"),
    // Pacifico Ceviche
    _wrap("Pacifico%20Ceviche/costa-pacifico-mobile-home.png"),
    // COTE other styles
    _wrap("Onyx%20Brace%20Steakhouse/d-marble-mobile-home.png"),
    _wrap("Onyx%20Brace%20Steakhouse/b-ivory-mobile-home.png"),
    // Midtown
    _wrap("Levante%20Deli/mobile-a-home.png"),
  ],

  beauty: [
    _wrap("Aurora%20Nail%20Atelier/lavender-luxe-home.png"),
    _wrap("Aurora%20Nail%20Atelier/blush-rosegold-home.png"),
    _wrap("Aurora%20Nail%20Atelier/lavender-luxe-servizi.png"),
    _wrap("Aurora%20Nail%20Atelier/blush-rosegold-servizi.png"),
    _wrap("Velluto%20Hair%20Lab/mobile-home.png"),
    _wrap("Velluto%20Hair%20Lab/mobile-shop.png"),
  ],

  ncc: [
    _wrap("Cala%20Vento%20Charter/home.png"),
    _wrap("Cala%20Vento%20Charter/escursioni.png"),
    _wrap("Cala%20Vento%20Charter/dettaglio-tour.png"),
    _wrap("Cala%20Vento%20Charter/prenotazione.png"),
    _wrap("Marina%20Riviera/A-mobile-home.png"),
    _wrap("Marina%20Riviera/A-mobile-fleet.png"),
    _wrap("Marina%20Riviera/A-mobile-yacht-detail.png"),
    _wrap("Marina%20Riviera/A-mobile-booking.png"),
  ],

  fitness: [
    // City Padel — sage-luxe first
    _wrap("Centro%20Padel%20Brera/mobile-sage-luxe-home.png"),
    _wrap("Centro%20Padel%20Brera/mobile-sage-luxe-prenota.png"),
    _wrap("Centro%20Padel%20Brera/mobile-sage-luxe-maestri.png"),
    _wrap("Centro%20Padel%20Brera/mobile-sage-luxe-dettaglio.png"),
    _wrap("Centro%20Padel%20Brera/mobile-fresh-azzurro-home.png"),
    _wrap("Centro%20Padel%20Brera/mobile-fresh-azzurro-prenota.png"),
    // Onda Sport Club
    _wrap("Onda%20Sport%20Club/style-a-mobile-home.png"),
    _wrap("Onda%20Sport%20Club/style-a-mobile-activities.png"),
  ],

  healthcare: [
    _wrap("Lumen%20Clinic/a-ethereal-glass-mobile-home.png"),
    _wrap("Lumen%20Clinic/a-ethereal-glass-mobile-servizi.png"),
    _wrap("Lumen%20Clinic/b-azure-gradient-mobile-home.png"),
    _wrap("Lumen%20Clinic/b-azure-gradient-mobile-servizi.png"),
    _wrap("Lumen%20Clinic/c-ice-crystal-mobile-home.png"),
    _wrap("Lumen%20Clinic/d-soft-blue-mobile-home.png"),
  ],

  veterinary: [
    _wrap("Tropico%20Pet%20Resort/mobile-a-home.png"),
    _wrap("Tropico%20Pet%20Resort/mobile-a-services.png"),
    _wrap("Tropico%20Pet%20Resort/mobile-a-detail.png"),
    _wrap("Tropico%20Pet%20Resort/mobile-a-booking.png"),
    _wrap("Tropico%20Pet%20Resort/mobile-e-home.png"),
    _wrap("Tropico%20Pet%20Resort/mobile-e-services.png"),
    _wrap("Tropico%20Pet%20Resort/mobile-f-home.png"),
    _wrap("Tropico%20Pet%20Resort/mobile-g-home.png"),
  ],

  childcare: [
    _wrap("Stelle%20Nursery%20-%20Playful%20Colorful/home.png"),
    _wrap("Stelle%20Nursery%20-%20Playful%20Colorful/programs-activities.png"),
    _wrap("Stelle%20Nursery%20-%20Playful%20Colorful/team-tour.png"),
    _wrap("Stelle%20Nursery%20-%20Playful%20Colorful/meal-plan-enroll.png"),
    _wrap("Stelle%20Nursery%20-%20Nature%20Explorer/home.png"),
    _wrap("Stelle%20Nursery%20-%20Nature%20Explorer/programs-activities.png"),
    _wrap("Stelle%20Nursery%20-%20Ocean%20Breeze/home.png"),
    _wrap("Stelle%20Nursery%20-%20Sunny%20Garden/home.png"),
    _wrap("Stelle%20Nursery%20-%20Sunset%20Playful/home.png"),
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
    _wrap("Onda%20Sport%20Club/style-a-mobile-home.png"),
    _wrap("Onda%20Sport%20Club/style-a-mobile-activities.png"),
    _wrap("Onda%20Sport%20Club/style-e-mobile-home.png"),
    _wrap("Onda%20Sport%20Club/style-g-mobile-home.png"),
  ],

  hospitality: [
    _wrap("Cala%20Vento%20Charter/home.png"),
    _wrap("Cala%20Vento%20Charter/escursioni.png"),
    _wrap("Cala%20Vento%20Charter/dettaglio-tour.png"),
    _wrap("Marina%20Riviera/A-mobile-home.png"),
    _wrap("Marina%20Riviera/A-mobile-fleet.png"),
    _wrap("Marina%20Riviera/C-mobile-home.png"),
  ],

  construction: [
    _wrap("Domus%20Living/05-ocean-azure-mobile-dashboard.png"),
    _wrap("Domus%20Living/06-ocean-azure-mobile-units.png"),
    _wrap("Domus%20Living/07-ocean-azure-mobile-maintenance.png"),
    _wrap("Domus%20Living/08-ocean-azure-mobile-community.png"),
    constructionHome, constructionTimeline,
  ],

  retail: [
    _wrap("Velluto%20Hair%20Lab/desktop-homepage.png"),
    _wrap("Velluto%20Hair%20Lab/desktop-shop.png"),
    _wrap("Velluto%20Hair%20Lab/mobile-home.png"),
    _wrap("Velluto%20Hair%20Lab/mobile-shop.png"),
    _wrap("Velluto%20Hair%20Lab/mobile-detail.png"),
    _wrap("Velluto%20Hair%20Lab/mobile-cart.png"),
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
        name: "Onyx Brace Steakhouse",
        styles: [
          { name: "Obsidian", thumbnail: _wrap("Onyx%20Brace%20Steakhouse/a-obsidian-mobile-home.png"), screens: [
            _wrap("Onyx%20Brace%20Steakhouse/a-obsidian-mobile-home.png"), _wrap("Onyx%20Brace%20Steakhouse/a-obsidian-mobile-menu.png"),
            _wrap("Onyx%20Brace%20Steakhouse/a-obsidian-mobile-detail.png"), _wrap("Onyx%20Brace%20Steakhouse/a-obsidian-mobile-cart.png"),
          ], desktopScreens: [
            _wrap("Onyx%20Brace%20Steakhouse/a-obsidian-desktop-home.png"), _wrap("Onyx%20Brace%20Steakhouse/a-obsidian-desktop-menu.png"),
            _wrap("Onyx%20Brace%20Steakhouse/a-obsidian-desktop-detail.png"), _wrap("Onyx%20Brace%20Steakhouse/a-obsidian-desktop-cart.png"),
          ]},
          { name: "Ivory", thumbnail: _wrap("Onyx%20Brace%20Steakhouse/b-ivory-mobile-home.png"), screens: [
            _wrap("Onyx%20Brace%20Steakhouse/b-ivory-mobile-home.png"), _wrap("Onyx%20Brace%20Steakhouse/b-ivory-mobile-menu.png"),
            _wrap("Onyx%20Brace%20Steakhouse/b-ivory-mobile-detail.png"), _wrap("Onyx%20Brace%20Steakhouse/b-ivory-mobile-cart.png"),
          ], desktopScreens: [
            _wrap("Onyx%20Brace%20Steakhouse/b-ivory-desktop-home.png"), _wrap("Onyx%20Brace%20Steakhouse/b-ivory-desktop-menu.png"),
            _wrap("Onyx%20Brace%20Steakhouse/b-ivory-desktop-detail.png"), _wrap("Onyx%20Brace%20Steakhouse/b-ivory-desktop-cart.png"),
          ]},
          { name: "Hanok", thumbnail: _wrap("Onyx%20Brace%20Steakhouse/e-hanok-mobile-home.png"), screens: [
            _wrap("Onyx%20Brace%20Steakhouse/e-hanok-mobile-home.png"), _wrap("Onyx%20Brace%20Steakhouse/e-hanok-mobile-menu.png"),
            _wrap("Onyx%20Brace%20Steakhouse/e-hanok-mobile-detail.png"), _wrap("Onyx%20Brace%20Steakhouse/e-hanok-mobile-cart.png"),
          ], desktopScreens: [
            _wrap("Onyx%20Brace%20Steakhouse/e-hanok-desktop-home.png"), _wrap("Onyx%20Brace%20Steakhouse/e-hanok-desktop-menu.png"),
            _wrap("Onyx%20Brace%20Steakhouse/e-hanok-desktop-detail.png"), _wrap("Onyx%20Brace%20Steakhouse/e-hanok-desktop-cart.png"),
          ]},
          { name: "Gangnam", thumbnail: _wrap("Onyx%20Brace%20Steakhouse/f-gangnam-mobile-home.png"), screens: [
            _wrap("Onyx%20Brace%20Steakhouse/f-gangnam-mobile-home.png"), _wrap("Onyx%20Brace%20Steakhouse/f-gangnam-mobile-menu.png"),
            _wrap("Onyx%20Brace%20Steakhouse/f-gangnam-mobile-detail.png"), _wrap("Onyx%20Brace%20Steakhouse/f-gangnam-mobile-cart.png"),
          ], desktopScreens: [
            _wrap("Onyx%20Brace%20Steakhouse/f-gangnam-desktop-home.png"), _wrap("Onyx%20Brace%20Steakhouse/f-gangnam-desktop-menu.png"),
            _wrap("Onyx%20Brace%20Steakhouse/f-gangnam-desktop-detail.png"), _wrap("Onyx%20Brace%20Steakhouse/f-gangnam-desktop-cart.png"),
          ]},
          { name: "Joseon", thumbnail: _wrap("Onyx%20Brace%20Steakhouse/h-joseon-mobile-home.png"), screens: [
            _wrap("Onyx%20Brace%20Steakhouse/h-joseon-mobile-home.png"), _wrap("Onyx%20Brace%20Steakhouse/h-joseon-mobile-menu.png"),
            _wrap("Onyx%20Brace%20Steakhouse/h-joseon-mobile-detail.png"), _wrap("Onyx%20Brace%20Steakhouse/h-joseon-mobile-cart.png"),
          ], desktopScreens: [
            _wrap("Onyx%20Brace%20Steakhouse/h-joseon-desktop-home.png"), _wrap("Onyx%20Brace%20Steakhouse/h-joseon-desktop-menu.png"),
            _wrap("Onyx%20Brace%20Steakhouse/h-joseon-desktop-detail.png"), _wrap("Onyx%20Brace%20Steakhouse/h-joseon-desktop-cart.png"),
          ]},
        ],
      },
      {
        name: "Sakura Atelier",
        styles: [
          { name: "Sakura", thumbnail: _wrap("Sakura%20Atelier/a-sakura-home.png"), screens: [
            _wrap("Sakura%20Atelier/a-sakura-home.png"), _wrap("Sakura%20Atelier/a-sakura-menu.png"),
            _wrap("Sakura%20Atelier/a-sakura-detail.png"), _wrap("Sakura%20Atelier/a-sakura-cart.png"),
          ]},
          { name: "Luxury Dark", thumbnail: _wrap("Sakura%20Atelier/b-luxury-dark-home.png"), screens: [
            _wrap("Sakura%20Atelier/b-luxury-dark-home.png"), _wrap("Sakura%20Atelier/b-luxury-dark-menu.png"),
            _wrap("Sakura%20Atelier/b-luxury-dark-detail.png"), _wrap("Sakura%20Atelier/b-luxury-dark-cart.png"),
          ]},
          { name: "White Clean", thumbnail: _wrap("Sakura%20Atelier/c-white-clean-home.png"), screens: [
            _wrap("Sakura%20Atelier/c-white-clean-home.png"), _wrap("Sakura%20Atelier/c-white-clean-menu.png"),
            _wrap("Sakura%20Atelier/c-white-clean-detail.png"), _wrap("Sakura%20Atelier/c-white-clean-cart.png"),
          ]},
          { name: "Miami Ocean", thumbnail: _wrap("Sakura%20Atelier/d-miami-ocean-home.png"), screens: [
            _wrap("Sakura%20Atelier/d-miami-ocean-home.png"), _wrap("Sakura%20Atelier/d-miami-ocean-menu.png"),
            _wrap("Sakura%20Atelier/d-miami-ocean-detail.png"), _wrap("Sakura%20Atelier/d-miami-ocean-cart.png"),
          ]},
          { name: "Pearl Gold", thumbnail: _wrap("Sakura%20Atelier/e-pearl-gold-home.png"), screens: [
            _wrap("Sakura%20Atelier/e-pearl-gold-home.png"), _wrap("Sakura%20Atelier/e-pearl-gold-menu.png"),
            _wrap("Sakura%20Atelier/e-pearl-gold-detail.png"), _wrap("Sakura%20Atelier/e-pearl-gold-cart.png"),
          ]},
          { name: "Marble Zen", thumbnail: _wrap("Sakura%20Atelier/f-marble-zen-home.png"), screens: [
            _wrap("Sakura%20Atelier/f-marble-zen-home.png"), _wrap("Sakura%20Atelier/f-marble-zen-menu.png"),
            _wrap("Sakura%20Atelier/f-marble-zen-detail.png"), _wrap("Sakura%20Atelier/f-marble-zen-cart.png"),
          ]},
          { name: "Champagne Rose", thumbnail: _wrap("Sakura%20Atelier/g-champagne-rose-home.png"), screens: [
            _wrap("Sakura%20Atelier/g-champagne-rose-home.png"), _wrap("Sakura%20Atelier/g-champagne-rose-menu.png"),
            _wrap("Sakura%20Atelier/g-champagne-rose-detail.png"), _wrap("Sakura%20Atelier/g-champagne-rose-cart.png"),
          ]},
          { name: "Arctic Crystal", thumbnail: _wrap("Sakura%20Atelier/h-arctic-crystal-home.png"), screens: [
            _wrap("Sakura%20Atelier/h-arctic-crystal-home.png"), _wrap("Sakura%20Atelier/h-arctic-crystal-menu.png"),
            _wrap("Sakura%20Atelier/h-arctic-crystal-detail.png"), _wrap("Sakura%20Atelier/h-arctic-crystal-cart.png"),
          ]},
          { name: "Tsukiji Ice", thumbnail: _wrap("Sakura%20Atelier/i-tsukiji-ice-home.png"), screens: [
            _wrap("Sakura%20Atelier/i-tsukiji-ice-home.png"), _wrap("Sakura%20Atelier/i-tsukiji-ice-menu.png"),
            _wrap("Sakura%20Atelier/i-tsukiji-ice-detail.png"), _wrap("Sakura%20Atelier/i-tsukiji-ice-cart.png"),
          ]},
          { name: "Sakura Garden", thumbnail: _wrap("Sakura%20Atelier/j-sakura-garden-home.png"), screens: [
            _wrap("Sakura%20Atelier/j-sakura-garden-home.png"), _wrap("Sakura%20Atelier/j-sakura-garden-menu.png"),
            _wrap("Sakura%20Atelier/j-sakura-garden-detail.png"), _wrap("Sakura%20Atelier/j-sakura-garden-cart.png"),
          ]},
          { name: "Wabi Sabi Marble", thumbnail: _wrap("Sakura%20Atelier/k-wabi-sabi-marble-home.png"), screens: [
            _wrap("Sakura%20Atelier/k-wabi-sabi-marble-home.png"), _wrap("Sakura%20Atelier/k-wabi-sabi-marble-menu.png"),
            _wrap("Sakura%20Atelier/k-wabi-sabi-marble-detail.png"), _wrap("Sakura%20Atelier/k-wabi-sabi-marble-cart.png"),
          ]},
          { name: "Hinoki Frost", thumbnail: _wrap("Sakura%20Atelier/l-hinoki-frost-home.png"), screens: [
            _wrap("Sakura%20Atelier/l-hinoki-frost-home.png"), _wrap("Sakura%20Atelier/l-hinoki-frost-menu.png"),
            _wrap("Sakura%20Atelier/l-hinoki-frost-detail.png"), _wrap("Sakura%20Atelier/l-hinoki-frost-cart.png"),
          ]},
        ],
      },
      {
        name: "Indocina Noir",
        styles: [
          { name: "Noir Saigon", thumbnail: _wrap("Indocina%20Noir/a-noir-saigon-home.png"), screens: [
            _wrap("Indocina%20Noir/a-noir-saigon-home.png"), _wrap("Indocina%20Noir/a-noir-saigon-menu.png"),
            _wrap("Indocina%20Noir/a-noir-saigon-detail.png"), _wrap("Indocina%20Noir/a-noir-saigon-cart.png"),
          ]},
          { name: "Jade Dynasty", thumbnail: _wrap("Indocina%20Noir/b-jade-dynasty-home.png"), screens: [
            _wrap("Indocina%20Noir/b-jade-dynasty-home.png"), _wrap("Indocina%20Noir/b-jade-dynasty-menu.png"),
            _wrap("Indocina%20Noir/b-jade-dynasty-detail.png"), _wrap("Indocina%20Noir/b-jade-dynasty-cart.png"),
          ]},
          { name: "Crimson Silk", thumbnail: _wrap("Indocina%20Noir/e-crimson-silk-home.png"), screens: [
            _wrap("Indocina%20Noir/e-crimson-silk-home.png"), _wrap("Indocina%20Noir/e-crimson-silk-menu.png"),
            _wrap("Indocina%20Noir/e-crimson-silk-detail.png"), _wrap("Indocina%20Noir/e-crimson-silk-cart.png"),
          ]},
          { name: "Golden Hour", thumbnail: _wrap("Indocina%20Noir/g-golden-hour-home.png"), screens: [
            _wrap("Indocina%20Noir/g-golden-hour-home.png"), _wrap("Indocina%20Noir/g-golden-hour-menu.png"),
            _wrap("Indocina%20Noir/g-golden-hour-detail.png"), _wrap("Indocina%20Noir/g-golden-hour-cart.png"),
          ]},
          { name: "Neon Spice", thumbnail: _wrap("Indocina%20Noir/i-neon-spice-home.png"), screens: [
            _wrap("Indocina%20Noir/i-neon-spice-home.png"), _wrap("Indocina%20Noir/i-neon-spice-menu.png"),
            _wrap("Indocina%20Noir/i-neon-spice-detail.png"), _wrap("Indocina%20Noir/i-neon-spice-cart.png"),
          ], desktopScreens: [
            _wrap("Indocina%20Noir/i-neon-spice-desktop-home.png"), _wrap("Indocina%20Noir/i-neon-spice-desktop-menu.png"),
            _wrap("Indocina%20Noir/i-neon-spice-desktop-detail.png"), _wrap("Indocina%20Noir/i-neon-spice-desktop-cart.png"),
          ]},
          { name: "Matcha Blaze", thumbnail: _wrap("Indocina%20Noir/k-matcha-blaze-home.png"), screens: [
            _wrap("Indocina%20Noir/k-matcha-blaze-home.png"), _wrap("Indocina%20Noir/k-matcha-blaze-menu.png"),
            _wrap("Indocina%20Noir/k-matcha-blaze-detail.png"), _wrap("Indocina%20Noir/k-matcha-blaze-cart.png"),
          ], desktopScreens: [
            _wrap("Indocina%20Noir/k-matcha-blaze-desktop-home.png"), _wrap("Indocina%20Noir/k-matcha-blaze-desktop-menu.png"),
            _wrap("Indocina%20Noir/k-matcha-blaze-desktop-detail.png"), _wrap("Indocina%20Noir/k-matcha-blaze-desktop-cart.png"),
          ]},
          { name: "Obsidian Gold", thumbnail: _wrap("Indocina%20Noir/l-obsidian-gold-home.png"), screens: [
            _wrap("Indocina%20Noir/l-obsidian-gold-home.png"), _wrap("Indocina%20Noir/l-obsidian-gold-menu.png"),
            _wrap("Indocina%20Noir/l-obsidian-gold-detail.png"), _wrap("Indocina%20Noir/l-obsidian-gold-cart.png"),
          ], desktopScreens: [
            _wrap("Indocina%20Noir/l-obsidian-gold-desktop-home.png"), _wrap("Indocina%20Noir/l-obsidian-gold-desktop-menu.png"),
            _wrap("Indocina%20Noir/l-obsidian-gold-desktop-detail.png"), _wrap("Indocina%20Noir/l-obsidian-gold-desktop-cart.png"),
          ]},
        ],
      },
      {
        name: "Pacifico Ceviche",
        styles: [
          { name: "Costa Pacifico", thumbnail: _wrap("Pacifico%20Ceviche/costa-pacifico-mobile-home.png"), screens: [
            _wrap("Pacifico%20Ceviche/costa-pacifico-mobile-home.png"), _wrap("Pacifico%20Ceviche/costa-pacifico-mobile-menu.png"),
            _wrap("Pacifico%20Ceviche/costa-pacifico-mobile-detail.png"), _wrap("Pacifico%20Ceviche/costa-pacifico-mobile-cart.png"),
          ], desktopScreens: [
            _wrap("Pacifico%20Ceviche/costa-pacifico-desktop-home.png"), _wrap("Pacifico%20Ceviche/costa-pacifico-desktop-menu.png"),
            _wrap("Pacifico%20Ceviche/costa-pacifico-desktop-detail.png"), _wrap("Pacifico%20Ceviche/costa-pacifico-desktop-cart.png"),
          ]},
          { name: "Casa Nostra", thumbnail: _wrap("Pacifico%20Ceviche/casa-nostra-mobile-home.png"), screens: [
            _wrap("Pacifico%20Ceviche/casa-nostra-mobile-home.png"), _wrap("Pacifico%20Ceviche/casa-nostra-mobile-menu.png"),
            _wrap("Pacifico%20Ceviche/casa-nostra-mobile-detail.png"), _wrap("Pacifico%20Ceviche/casa-nostra-mobile-cart.png"),
          ], desktopScreens: [
            _wrap("Pacifico%20Ceviche/casa-nostra-desktop-home.png"), _wrap("Pacifico%20Ceviche/casa-nostra-desktop-menu.png"),
            _wrap("Pacifico%20Ceviche/casa-nostra-desktop-detail.png"), _wrap("Pacifico%20Ceviche/casa-nostra-desktop-cart.png"),
          ]},
          { name: "Bianco Memoria", thumbnail: _wrap("Pacifico%20Ceviche/bianco-memoria-mobile-home.png"), screens: [
            _wrap("Pacifico%20Ceviche/bianco-memoria-mobile-home.png"), _wrap("Pacifico%20Ceviche/bianco-memoria-mobile-menu.png"),
            _wrap("Pacifico%20Ceviche/bianco-memoria-mobile-detail.png"), _wrap("Pacifico%20Ceviche/bianco-memoria-mobile-cart.png"),
          ], desktopScreens: [
            _wrap("Pacifico%20Ceviche/bianco-memoria-desktop-home.png"), _wrap("Pacifico%20Ceviche/bianco-memoria-desktop-menu.png"),
            _wrap("Pacifico%20Ceviche/bianco-memoria-desktop-detail.png"), _wrap("Pacifico%20Ceviche/bianco-memoria-desktop-cart.png"),
          ]},
          { name: "Ocra Lima", thumbnail: _wrap("Pacifico%20Ceviche/ocra-lima-mobile-home.png"), screens: [
            _wrap("Pacifico%20Ceviche/ocra-lima-mobile-home.png"), _wrap("Pacifico%20Ceviche/ocra-lima-mobile-menu.png"),
            _wrap("Pacifico%20Ceviche/ocra-lima-mobile-detail.png"), _wrap("Pacifico%20Ceviche/ocra-lima-mobile-cart.png"),
          ], desktopScreens: [
            _wrap("Pacifico%20Ceviche/ocra-lima-desktop-home.png"), _wrap("Pacifico%20Ceviche/ocra-lima-desktop-menu.png"),
            _wrap("Pacifico%20Ceviche/ocra-lima-desktop-detail.png"), _wrap("Pacifico%20Ceviche/ocra-lima-desktop-cart.png"),
          ]},
        ],
      },
      {
        name: "Levante Deli",
        styles: [
          { name: "Style A", thumbnail: _wrap("Levante%20Deli/mobile-a-home.png"), screens: [
            _wrap("Levante%20Deli/mobile-a-home.png"), _wrap("Levante%20Deli/mobile-a-menu.png"),
            _wrap("Levante%20Deli/mobile-a-detail.png"), _wrap("Levante%20Deli/mobile-a-cart.png"),
          ], desktopScreens: [
            _wrap("Levante%20Deli/style-a-home.png"), _wrap("Levante%20Deli/style-a-menu.png"),
            _wrap("Levante%20Deli/style-a-detail.png"), _wrap("Levante%20Deli/style-a-cart.png"),
          ]},
          { name: "Style B", thumbnail: _wrap("Levante%20Deli/mobile-b-home.png"), screens: [
            _wrap("Levante%20Deli/mobile-b-home.png"), _wrap("Levante%20Deli/mobile-b-menu.png"),
            _wrap("Levante%20Deli/mobile-b-detail.png"), _wrap("Levante%20Deli/mobile-b-cart.png"),
          ], desktopScreens: [
            _wrap("Levante%20Deli/style-b-home.png"), _wrap("Levante%20Deli/style-b-menu.png"),
            _wrap("Levante%20Deli/style-b-detail.png"), _wrap("Levante%20Deli/style-b-cart.png"),
          ]},
          { name: "Style C", thumbnail: _wrap("Levante%20Deli/mobile-c-home.png"), screens: [
            _wrap("Levante%20Deli/mobile-c-home.png"), _wrap("Levante%20Deli/mobile-c-menu.png"),
            _wrap("Levante%20Deli/mobile-c-detail.png"), _wrap("Levante%20Deli/mobile-c-cart.png"),
          ], desktopScreens: [
            _wrap("Levante%20Deli/style-c-home.png"), _wrap("Levante%20Deli/style-c-menu.png"),
            _wrap("Levante%20Deli/style-c-detail.png"), _wrap("Levante%20Deli/style-c-cart.png"),
          ]},
          { name: "Style D", thumbnail: _wrap("Levante%20Deli/mobile-d-home.png"), screens: [
            _wrap("Levante%20Deli/mobile-d-home.png"), _wrap("Levante%20Deli/mobile-d-menu.png"),
            _wrap("Levante%20Deli/mobile-d-detail.png"), _wrap("Levante%20Deli/mobile-d-cart.png"),
          ], desktopScreens: [
            _wrap("Levante%20Deli/style-d-home.png"), _wrap("Levante%20Deli/style-d-menu.png"),
            _wrap("Levante%20Deli/style-d-detail.png"), _wrap("Levante%20Deli/style-d-cart.png"),
          ]},
          // Additional mobile-only styles (e-h)
          { name: "Style E", thumbnail: _wrap("Levante%20Deli/mobile-e-home.png"), screens: [
            _wrap("Levante%20Deli/mobile-e-home.png"), _wrap("Levante%20Deli/mobile-e-menu.png"),
            _wrap("Levante%20Deli/mobile-e-detail.png"), _wrap("Levante%20Deli/mobile-e-cart.png"),
          ]},
          { name: "Style F", thumbnail: _wrap("Levante%20Deli/mobile-f-home.png"), screens: [
            _wrap("Levante%20Deli/mobile-f-home.png"), _wrap("Levante%20Deli/mobile-f-menu.png"),
            _wrap("Levante%20Deli/mobile-f-detail.png"), _wrap("Levante%20Deli/mobile-f-cart.png"),
          ]},
          { name: "Style H", thumbnail: _wrap("Levante%20Deli/mobile-h-home.png"), screens: [
            _wrap("Levante%20Deli/mobile-h-home.png"), _wrap("Levante%20Deli/mobile-h-menu.png"),
            _wrap("Levante%20Deli/mobile-h-detail.png"), _wrap("Levante%20Deli/mobile-h-cart.png"),
          ]},
        ],
      },
      {
        name: "Brace Kebab",
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
        name: "Aurora Nail Atelier",
        styles: [
          { name: "Lavender Luxe", thumbnail: _wrap("Aurora%20Nail%20Atelier/lavender-luxe-home.png"), screens: [
            _wrap("Aurora%20Nail%20Atelier/lavender-luxe-home.png"), _wrap("Aurora%20Nail%20Atelier/lavender-luxe-servizi.png"),
            _wrap("Aurora%20Nail%20Atelier/lavender-luxe-dettaglio.png"), _wrap("Aurora%20Nail%20Atelier/lavender-luxe-booking.png"),
          ]},
          { name: "Blush Rosegold", thumbnail: _wrap("Aurora%20Nail%20Atelier/blush-rosegold-home.png"), screens: [
            _wrap("Aurora%20Nail%20Atelier/blush-rosegold-home.png"), _wrap("Aurora%20Nail%20Atelier/blush-rosegold-servizi.png"),
            _wrap("Aurora%20Nail%20Atelier/blush-rosegold-dettaglio.png"), _wrap("Aurora%20Nail%20Atelier/blush-rosegold-booking.png"),
          ]},
        ],
      },
      {
        name: "Velluto Hair Lab",
        styles: [
          { name: "Mobile", thumbnail: _wrap("Velluto%20Hair%20Lab/mobile-home.png"), screens: [
            _wrap("Velluto%20Hair%20Lab/mobile-home.png"), _wrap("Velluto%20Hair%20Lab/mobile-shop.png"),
            _wrap("Velluto%20Hair%20Lab/mobile-detail.png"), _wrap("Velluto%20Hair%20Lab/mobile-cart.png"),
          ]},
          { name: "Desktop", thumbnail: _wrap("Velluto%20Hair%20Lab/desktop-homepage.png"), screens: [
            _wrap("Velluto%20Hair%20Lab/desktop-homepage.png"), _wrap("Velluto%20Hair%20Lab/desktop-shop.png"),
            _wrap("Velluto%20Hair%20Lab/desktop-detail.png"), _wrap("Velluto%20Hair%20Lab/desktop-cart.png"),
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
        name: "Marina Riviera",
        styles: [
          { name: "Style A", thumbnail: _wrap("Marina%20Riviera/A-mobile-home.png"), screens: [
            _wrap("Marina%20Riviera/A-mobile-home.png"), _wrap("Marina%20Riviera/A-mobile-fleet.png"),
            _wrap("Marina%20Riviera/A-mobile-yacht-detail.png"), _wrap("Marina%20Riviera/A-mobile-booking.png"),
          ], desktopScreens: [
            _wrap("Marina%20Riviera/A-desktop-home.png"), _wrap("Marina%20Riviera/A-desktop-fleet.png"),
            _wrap("Marina%20Riviera/A-desktop-yacht-detail.png"), _wrap("Marina%20Riviera/A-desktop-booking.png"),
          ]},
          { name: "Style C", thumbnail: _wrap("Marina%20Riviera/C-mobile-home.png"), screens: [
            _wrap("Marina%20Riviera/C-mobile-home.png"), _wrap("Marina%20Riviera/C-mobile-fleet.png"),
            _wrap("Marina%20Riviera/C-mobile-yacht-detail.png"), _wrap("Marina%20Riviera/C-mobile-booking.png"),
          ], desktopScreens: [
            _wrap("Marina%20Riviera/C-desktop-home.png"), _wrap("Marina%20Riviera/C-desktop-fleet.png"),
            _wrap("Marina%20Riviera/C-desktop-yacht-detail.png"), _wrap("Marina%20Riviera/C-desktop-booking.png"),
          ]},
          { name: "Style F", thumbnail: _wrap("Marina%20Riviera/F-mobile-home.png"), screens: [
            _wrap("Marina%20Riviera/F-mobile-home.png"), _wrap("Marina%20Riviera/F-mobile-fleet.png"),
            _wrap("Marina%20Riviera/F-mobile-yacht-detail.png"), _wrap("Marina%20Riviera/F-mobile-booking.png"),
          ], desktopScreens: [
            _wrap("Marina%20Riviera/F-desktop-home.png"), _wrap("Marina%20Riviera/F-desktop-fleet.png"),
            _wrap("Marina%20Riviera/F-desktop-yacht-detail.png"), _wrap("Marina%20Riviera/F-desktop-booking.png"),
          ]},
          { name: "Style G", thumbnail: _wrap("Marina%20Riviera/G-mobile-home.png"), screens: [
            _wrap("Marina%20Riviera/G-mobile-home.png"), _wrap("Marina%20Riviera/G-mobile-fleet.png"),
            _wrap("Marina%20Riviera/G-mobile-yacht-detail.png"), _wrap("Marina%20Riviera/G-mobile-booking.png"),
          ], desktopScreens: [
            _wrap("Marina%20Riviera/G-desktop-home.png"), _wrap("Marina%20Riviera/G-desktop-fleet.png"),
            _wrap("Marina%20Riviera/G-desktop-yacht-detail.png"), _wrap("Marina%20Riviera/G-desktop-booking.png"),
          ]},
          { name: "Style H", thumbnail: _wrap("Marina%20Riviera/H-mobile-home.png"), screens: [
            _wrap("Marina%20Riviera/H-mobile-home.png"), _wrap("Marina%20Riviera/H-mobile-fleet.png"),
            _wrap("Marina%20Riviera/H-mobile-yacht-detail.png"), _wrap("Marina%20Riviera/H-mobile-booking.png"),
          ], desktopScreens: [
            _wrap("Marina%20Riviera/H-desktop-home.png"), _wrap("Marina%20Riviera/H-desktop-fleet.png"),
            _wrap("Marina%20Riviera/H-desktop-yacht-detail.png"), _wrap("Marina%20Riviera/H-desktop-booking.png"),
          ]},
        ],
      },
      {
        name: "Cala Vento Charter",
        styles: [
          { name: "Emerald Cove", thumbnail: _wrap("Cala%20Vento%20Charter%20-%20Emerald%20Cove/home.png"), screens: [
            _wrap("Cala%20Vento%20Charter%20-%20Emerald%20Cove/home.png"), _wrap("Cala%20Vento%20Charter%20-%20Emerald%20Cove/escursioni.png"),
            _wrap("Cala%20Vento%20Charter%20-%20Emerald%20Cove/dettaglio-tour.png"), _wrap("Cala%20Vento%20Charter%20-%20Emerald%20Cove/prenotazione.png"),
          ]},
          { name: "Golden Sunset", thumbnail: _wrap("Cala%20Vento%20Charter%20-%20Golden%20Sunset/home.png"), screens: [
            _wrap("Cala%20Vento%20Charter%20-%20Golden%20Sunset/home.png"), _wrap("Cala%20Vento%20Charter%20-%20Golden%20Sunset/escursioni.png"),
            _wrap("Cala%20Vento%20Charter%20-%20Golden%20Sunset/dettaglio-tour.png"), _wrap("Cala%20Vento%20Charter%20-%20Golden%20Sunset/prenotazione.png"),
          ]},
          // Desktop variants
          { name: "Sardinia Azure Desktop", thumbnail: _wrap("Cala%20Vento%20Charter%20Desktop/home.png"), screens: [
            _wrap("Cala%20Vento%20Charter%20Desktop/home.png"), _wrap("Cala%20Vento%20Charter%20Desktop/escursioni.png"),
            _wrap("Cala%20Vento%20Charter%20Desktop/dettaglio-tour.png"), _wrap("Cala%20Vento%20Charter%20Desktop/prenotazione.png"),
          ]},
          { name: "Emerald Cove Desktop", thumbnail: _wrap("Cala%20Vento%20Charter%20-%20Emerald%20Cove%20Desktop/home.png"), screens: [
            _wrap("Cala%20Vento%20Charter%20-%20Emerald%20Cove%20Desktop/home.png"), _wrap("Cala%20Vento%20Charter%20-%20Emerald%20Cove%20Desktop/escursioni.png"),
            _wrap("Cala%20Vento%20Charter%20-%20Emerald%20Cove%20Desktop/dettaglio-tour.png"), _wrap("Cala%20Vento%20Charter%20-%20Emerald%20Cove%20Desktop/prenotazione.png"),
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
        name: "Tropico Pet Resort",
        styles: [
          { name: "Style A", thumbnail: _wrap("Tropico%20Pet%20Resort/mobile-a-home.png"), screens: [
            _wrap("Tropico%20Pet%20Resort/mobile-a-home.png"), _wrap("Tropico%20Pet%20Resort/mobile-a-services.png"),
            _wrap("Tropico%20Pet%20Resort/mobile-a-detail.png"), _wrap("Tropico%20Pet%20Resort/mobile-a-booking.png"),
          ]},
          { name: "Style E", thumbnail: _wrap("Tropico%20Pet%20Resort/mobile-e-home.png"), screens: [
            _wrap("Tropico%20Pet%20Resort/mobile-e-home.png"), _wrap("Tropico%20Pet%20Resort/mobile-e-services.png"),
            _wrap("Tropico%20Pet%20Resort/mobile-e-detail.png"), _wrap("Tropico%20Pet%20Resort/mobile-e-booking.png"),
          ]},
          { name: "Style F", thumbnail: _wrap("Tropico%20Pet%20Resort/mobile-f-home.png"), screens: [
            _wrap("Tropico%20Pet%20Resort/mobile-f-home.png"), _wrap("Tropico%20Pet%20Resort/mobile-f-services.png"),
            _wrap("Tropico%20Pet%20Resort/mobile-f-detail.png"), _wrap("Tropico%20Pet%20Resort/mobile-f-booking.png"),
          ]},
          // Desktop
          { name: "Desktop A", thumbnail: _wrap("Tropico%20Pet%20Resort/desktop-a-home.png"), screens: [
            _wrap("Tropico%20Pet%20Resort/desktop-a-home.png"), _wrap("Tropico%20Pet%20Resort/desktop-a-services.png"),
            _wrap("Tropico%20Pet%20Resort/desktop-a-detail.png"), _wrap("Tropico%20Pet%20Resort/desktop-a-booking.png"),
          ]},
          { name: "Desktop B", thumbnail: _wrap("Tropico%20Pet%20Resort/desktop-b-home.png"), screens: [
            _wrap("Tropico%20Pet%20Resort/desktop-b-home.png"), _wrap("Tropico%20Pet%20Resort/desktop-b-services.png"),
            _wrap("Tropico%20Pet%20Resort/desktop-b-detail.png"), _wrap("Tropico%20Pet%20Resort/desktop-b-booking.png"),
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
        name: "Stelle Nursery",
        styles: [
          { name: "Playful Colorful", thumbnail: _wrap("Stelle%20Nursery%20-%20Playful%20Colorful/home.png"), screens: [
            _wrap("Stelle%20Nursery%20-%20Playful%20Colorful/home.png"), _wrap("Stelle%20Nursery%20-%20Playful%20Colorful/programs-activities.png"),
            _wrap("Stelle%20Nursery%20-%20Playful%20Colorful/team-tour.png"), _wrap("Stelle%20Nursery%20-%20Playful%20Colorful/meal-plan-enroll.png"),
          ]},
          { name: "Nature Explorer", thumbnail: _wrap("Stelle%20Nursery%20-%20Nature%20Explorer/home.png"), screens: [
            _wrap("Stelle%20Nursery%20-%20Nature%20Explorer/home.png"), _wrap("Stelle%20Nursery%20-%20Nature%20Explorer/programs-activities.png"),
            _wrap("Stelle%20Nursery%20-%20Nature%20Explorer/team-tour.png"), _wrap("Stelle%20Nursery%20-%20Nature%20Explorer/meal-plan-enroll.png"),
          ]},
          { name: "Ocean Breeze", thumbnail: _wrap("Stelle%20Nursery%20-%20Ocean%20Breeze/home.png"), screens: [
            _wrap("Stelle%20Nursery%20-%20Ocean%20Breeze/home.png"), _wrap("Stelle%20Nursery%20-%20Ocean%20Breeze/programs-activities.png"),
            _wrap("Stelle%20Nursery%20-%20Ocean%20Breeze/team-tour.png"), _wrap("Stelle%20Nursery%20-%20Ocean%20Breeze/meal-plan-enroll.png"),
          ]},
          { name: "Sunny Garden", thumbnail: _wrap("Stelle%20Nursery%20-%20Sunny%20Garden/home.png"), screens: [
            _wrap("Stelle%20Nursery%20-%20Sunny%20Garden/home.png"), _wrap("Stelle%20Nursery%20-%20Sunny%20Garden/programs-activities.png"),
            _wrap("Stelle%20Nursery%20-%20Sunny%20Garden/team-tour.png"), _wrap("Stelle%20Nursery%20-%20Sunny%20Garden/meal-plan-enroll.png"),
          ]},
          { name: "Sunset Playful", thumbnail: _wrap("Stelle%20Nursery%20-%20Sunset%20Playful/home.png"), screens: [
            _wrap("Stelle%20Nursery%20-%20Sunset%20Playful/home.png"), _wrap("Stelle%20Nursery%20-%20Sunset%20Playful/programs-activities.png"),
            _wrap("Stelle%20Nursery%20-%20Sunset%20Playful/team-tour.png"), _wrap("Stelle%20Nursery%20-%20Sunset%20Playful/meal-plan-enroll.png"),
          ]},
        ],
      },
      {
        name: "Arcobaleno Playhouse",
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
        name: "Centro Padel Brera",
        styles: [
          { name: "Sage Luxe", thumbnail: _wrap("Centro%20Padel%20Brera/mobile-sage-luxe-home.png"), screens: [
            _wrap("Centro%20Padel%20Brera/mobile-sage-luxe-home.png"), _wrap("Centro%20Padel%20Brera/mobile-sage-luxe-prenota.png"),
            _wrap("Centro%20Padel%20Brera/mobile-sage-luxe-maestri.png"), _wrap("Centro%20Padel%20Brera/mobile-sage-luxe-dettaglio.png"),
          ], desktopScreens: [
            _wrap("Centro%20Padel%20Brera/desktop-sage-luxe-home.png"), _wrap("Centro%20Padel%20Brera/desktop-sage-luxe-prenota.png"),
            _wrap("Centro%20Padel%20Brera/desktop-sage-luxe-maestri.png"), _wrap("Centro%20Padel%20Brera/desktop-sage-luxe-dettaglio.png"),
          ]},
          { name: "Fresh Azzurro", thumbnail: _wrap("Centro%20Padel%20Brera/mobile-fresh-azzurro-home.png"), screens: [
            _wrap("Centro%20Padel%20Brera/mobile-fresh-azzurro-home.png"), _wrap("Centro%20Padel%20Brera/mobile-fresh-azzurro-prenota.png"),
            _wrap("Centro%20Padel%20Brera/mobile-fresh-azzurro-maestri.png"), _wrap("Centro%20Padel%20Brera/mobile-fresh-azzurro-dettaglio.png"),
          ], desktopScreens: [
            _wrap("Centro%20Padel%20Brera/desktop-fresh-azzurro-home.png"), _wrap("Centro%20Padel%20Brera/desktop-fresh-azzurro-prenota.png"),
            _wrap("Centro%20Padel%20Brera/desktop-fresh-azzurro-maestri.png"), _wrap("Centro%20Padel%20Brera/desktop-fresh-azzurro-dettaglio.png"),
          ]},
          { name: "Urban Concrete", thumbnail: _wrap("Centro%20Padel%20Brera/mobile-urban-concrete-home.png"), screens: [
            _wrap("Centro%20Padel%20Brera/mobile-urban-concrete-home.png"), _wrap("Centro%20Padel%20Brera/mobile-urban-concrete-prenota.png"),
            _wrap("Centro%20Padel%20Brera/mobile-urban-concrete-maestri.png"), _wrap("Centro%20Padel%20Brera/mobile-urban-concrete-dettaglio.png"),
          ], desktopScreens: [
            _wrap("Centro%20Padel%20Brera/desktop-urban-concrete-home.png"), _wrap("Centro%20Padel%20Brera/desktop-urban-concrete-prenota.png"),
            _wrap("Centro%20Padel%20Brera/desktop-urban-concrete-maestri.png"), _wrap("Centro%20Padel%20Brera/desktop-urban-concrete-dettaglio.png"),
          ]},
          { name: "Citylife Green", thumbnail: _wrap("Centro%20Padel%20Brera/mobile-citylife-green-home.png"), screens: [
            _wrap("Centro%20Padel%20Brera/mobile-citylife-green-home.png"), _wrap("Centro%20Padel%20Brera/mobile-citylife-green-prenota.png"),
            _wrap("Centro%20Padel%20Brera/mobile-citylife-green-maestri.png"), _wrap("Centro%20Padel%20Brera/mobile-citylife-green-dettaglio.png"),
          ], desktopScreens: [
            _wrap("Centro%20Padel%20Brera/desktop-citylife-green-home.png"), _wrap("Centro%20Padel%20Brera/desktop-citylife-green-prenota.png"),
            _wrap("Centro%20Padel%20Brera/desktop-citylife-green-maestri.png"), _wrap("Centro%20Padel%20Brera/desktop-citylife-green-dettaglio.png"),
          ]},
          { name: "Lime Minimal", thumbnail: _wrap("Centro%20Padel%20Brera/mobile-lime-minimal-home.png"), screens: [
            _wrap("Centro%20Padel%20Brera/mobile-lime-minimal-home.png"), _wrap("Centro%20Padel%20Brera/mobile-lime-minimal-prenota.png"),
            _wrap("Centro%20Padel%20Brera/mobile-lime-minimal-maestri.png"), _wrap("Centro%20Padel%20Brera/mobile-lime-minimal-dettaglio.png"),
          ], desktopScreens: [
            _wrap("Centro%20Padel%20Brera/desktop-lime-minimal-home.png"), _wrap("Centro%20Padel%20Brera/desktop-lime-minimal-prenota.png"),
            _wrap("Centro%20Padel%20Brera/desktop-lime-minimal-maestri.png"), _wrap("Centro%20Padel%20Brera/desktop-lime-minimal-dettaglio.png"),
          ]},
        ],
      },
      {
        name: "Onda Sport Club",
        styles: [
          { name: "Style A", thumbnail: _wrap("Onda%20Sport%20Club/style-a-mobile-home.png"), screens: [
            _wrap("Onda%20Sport%20Club/style-a-mobile-home.png"), _wrap("Onda%20Sport%20Club/style-a-mobile-activities.png"),
            _wrap("Onda%20Sport%20Club/style-a-mobile-detail.png"), _wrap("Onda%20Sport%20Club/style-a-mobile-booking.png"),
          ], desktopScreens: [
            _wrap("Onda%20Sport%20Club/style-a-desktop-home.png"), _wrap("Onda%20Sport%20Club/style-a-desktop-activities.png"),
            _wrap("Onda%20Sport%20Club/style-a-desktop-detail.png"), _wrap("Onda%20Sport%20Club/style-a-desktop-booking.png"),
          ]},
          { name: "Style E", thumbnail: _wrap("Onda%20Sport%20Club/style-e-mobile-home.png"), screens: [
            _wrap("Onda%20Sport%20Club/style-e-mobile-home.png"), _wrap("Onda%20Sport%20Club/style-e-mobile-activities.png"),
            _wrap("Onda%20Sport%20Club/style-e-mobile-detail.png"), _wrap("Onda%20Sport%20Club/style-e-mobile-booking.png"),
          ], desktopScreens: [
            _wrap("Onda%20Sport%20Club/style-e-desktop-home.png"), _wrap("Onda%20Sport%20Club/style-e-desktop-activities.png"),
            _wrap("Onda%20Sport%20Club/style-e-desktop-detail.png"), _wrap("Onda%20Sport%20Club/style-e-desktop-booking.png"),
          ]},
          { name: "Style G", thumbnail: _wrap("Onda%20Sport%20Club/style-g-mobile-home.png"), screens: [
            _wrap("Onda%20Sport%20Club/style-g-mobile-home.png"), _wrap("Onda%20Sport%20Club/style-g-mobile-activities.png"),
            _wrap("Onda%20Sport%20Club/style-g-mobile-detail.png"), _wrap("Onda%20Sport%20Club/style-g-mobile-booking.png"),
          ], desktopScreens: [
            _wrap("Onda%20Sport%20Club/style-g-desktop-home.png"), _wrap("Onda%20Sport%20Club/style-g-desktop-activities.png"),
            _wrap("Onda%20Sport%20Club/style-g-desktop-detail.png"), _wrap("Onda%20Sport%20Club/style-g-desktop-booking.png"),
          ]},
          { name: "Style H", thumbnail: _wrap("Onda%20Sport%20Club/style-h-mobile-home.png"), screens: [
            _wrap("Onda%20Sport%20Club/style-h-mobile-home.png"), _wrap("Onda%20Sport%20Club/style-h-mobile-activities.png"),
            _wrap("Onda%20Sport%20Club/style-h-mobile-detail.png"), _wrap("Onda%20Sport%20Club/style-h-mobile-booking.png"),
          ], desktopScreens: [
            _wrap("Onda%20Sport%20Club/style-h-desktop-home.png"), _wrap("Onda%20Sport%20Club/style-h-desktop-activities.png"),
            _wrap("Onda%20Sport%20Club/style-h-desktop-detail.png"), _wrap("Onda%20Sport%20Club/style-h-desktop-booking.png"),
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
        name: "Lumen Clinic",
        styles: [
          { name: "Ethereal Glass", thumbnail: _wrap("Lumen%20Clinic/a-ethereal-glass-mobile-home.png"), screens: [
            _wrap("Lumen%20Clinic/a-ethereal-glass-mobile-home.png"), _wrap("Lumen%20Clinic/a-ethereal-glass-mobile-servizi.png"),
            _wrap("Lumen%20Clinic/a-ethereal-glass-mobile-prodotti.png"), _wrap("Lumen%20Clinic/a-ethereal-glass-mobile-contatti.png"),
          ], desktopScreens: [
            _wrap("Lumen%20Clinic/a-ethereal-glass-desktop-home.png"), _wrap("Lumen%20Clinic/a-ethereal-glass-desktop-servizi.png"),
            _wrap("Lumen%20Clinic/a-ethereal-glass-desktop-prodotti.png"), _wrap("Lumen%20Clinic/a-ethereal-glass-desktop-contatti.png"),
          ]},
          { name: "Azure Gradient", thumbnail: _wrap("Lumen%20Clinic/b-azure-gradient-mobile-home.png"), screens: [
            _wrap("Lumen%20Clinic/b-azure-gradient-mobile-home.png"), _wrap("Lumen%20Clinic/b-azure-gradient-mobile-servizi.png"),
            _wrap("Lumen%20Clinic/b-azure-gradient-mobile-prodotti.png"), _wrap("Lumen%20Clinic/b-azure-gradient-mobile-contatti.png"),
          ], desktopScreens: [
            _wrap("Lumen%20Clinic/b-azure-gradient-desktop-home.png"), _wrap("Lumen%20Clinic/b-azure-gradient-desktop-servizi.png"),
            _wrap("Lumen%20Clinic/b-azure-gradient-desktop-prodotti.png"), _wrap("Lumen%20Clinic/b-azure-gradient-desktop-contatti.png"),
          ]},
          { name: "Ice Crystal", thumbnail: _wrap("Lumen%20Clinic/c-ice-crystal-mobile-home.png"), screens: [
            _wrap("Lumen%20Clinic/c-ice-crystal-mobile-home.png"), _wrap("Lumen%20Clinic/c-ice-crystal-mobile-servizi.png"),
            _wrap("Lumen%20Clinic/c-ice-crystal-mobile-prodotti.png"), _wrap("Lumen%20Clinic/c-ice-crystal-mobile-contatti.png"),
          ], desktopScreens: [
            _wrap("Lumen%20Clinic/c-ice-crystal-desktop-home.png"), _wrap("Lumen%20Clinic/c-ice-crystal-desktop-servizi.png"),
            _wrap("Lumen%20Clinic/c-ice-crystal-desktop-prodotti.png"), _wrap("Lumen%20Clinic/c-ice-crystal-desktop-contatti.png"),
          ]},
          { name: "Soft Blue", thumbnail: _wrap("Lumen%20Clinic/d-soft-blue-mobile-home.png"), screens: [
            _wrap("Lumen%20Clinic/d-soft-blue-mobile-home.png"), _wrap("Lumen%20Clinic/d-soft-blue-mobile-servizi.png"),
            _wrap("Lumen%20Clinic/d-soft-blue-mobile-prodotti.png"), _wrap("Lumen%20Clinic/d-soft-blue-mobile-contatti.png"),
          ], desktopScreens: [
            _wrap("Lumen%20Clinic/d-soft-blue-desktop-home.png"), _wrap("Lumen%20Clinic/d-soft-blue-desktop-servizi.png"),
            _wrap("Lumen%20Clinic/d-soft-blue-desktop-prodotti.png"), _wrap("Lumen%20Clinic/d-soft-blue-desktop-contatti.png"),
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
        name: "Domus Living",
        styles: [
          { name: "Ocean Azure", thumbnail: _wrap("Domus%20Living/05-ocean-azure-mobile-dashboard.png"), screens: [
            _wrap("Domus%20Living/05-ocean-azure-mobile-dashboard.png"), _wrap("Domus%20Living/06-ocean-azure-mobile-units.png"),
            _wrap("Domus%20Living/07-ocean-azure-mobile-maintenance.png"), _wrap("Domus%20Living/08-ocean-azure-mobile-community.png"),
          ], desktopScreens: [
            _wrap("Domus%20Living/01-ocean-azure-desktop-dashboard.png"), _wrap("Domus%20Living/02-ocean-azure-desktop-units.png"),
            _wrap("Domus%20Living/03-ocean-azure-desktop-maintenance.png"), _wrap("Domus%20Living/04-ocean-azure-desktop-community.png"),
          ]},
          { name: "Living Coral", thumbnail: _wrap("Domus%20Living/05-living-coral-mobile-dashboard.png"), screens: [
            _wrap("Domus%20Living/05-living-coral-mobile-dashboard.png"), _wrap("Domus%20Living/06-living-coral-mobile-units.png"),
            _wrap("Domus%20Living/07-living-coral-mobile-maintenance.png"), _wrap("Domus%20Living/08-living-coral-mobile-community.png"),
          ], desktopScreens: [
            _wrap("Domus%20Living/01-living-coral-desktop-dashboard.png"), _wrap("Domus%20Living/02-living-coral-desktop-units.png"),
            _wrap("Domus%20Living/03-living-coral-desktop-maintenance.png"), _wrap("Domus%20Living/04-living-coral-desktop-community.png"),
          ]},
          { name: "Ice Blue", thumbnail: _wrap("Domus%20Living/05-ice-blue-mobile-dashboard.png"), screens: [
            _wrap("Domus%20Living/05-ice-blue-mobile-dashboard.png"), _wrap("Domus%20Living/06-ice-blue-mobile-units.png"),
            _wrap("Domus%20Living/07-ice-blue-mobile-maintenance.png"), _wrap("Domus%20Living/08-ice-blue-mobile-community.png"),
          ], desktopScreens: [
            _wrap("Domus%20Living/01-ice-blue-desktop-dashboard.png"), _wrap("Domus%20Living/02-ice-blue-desktop-units.png"),
            _wrap("Domus%20Living/03-ice-blue-desktop-maintenance.png"), _wrap("Domus%20Living/04-ice-blue-desktop-community.png"),
          ]},
          { name: "Rose Gold", thumbnail: _wrap("Domus%20Living/05-rose-gold-mobile-dashboard.png"), screens: [
            _wrap("Domus%20Living/05-rose-gold-mobile-dashboard.png"), _wrap("Domus%20Living/06-rose-gold-mobile-units.png"),
            _wrap("Domus%20Living/07-rose-gold-mobile-maintenance.png"), _wrap("Domus%20Living/08-rose-gold-mobile-community.png"),
          ], desktopScreens: [
            _wrap("Domus%20Living/01-rose-gold-desktop-dashboard.png"), _wrap("Domus%20Living/02-rose-gold-desktop-units.png"),
            _wrap("Domus%20Living/03-rose-gold-desktop-maintenance.png"), _wrap("Domus%20Living/04-rose-gold-desktop-community.png"),
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
        name: "Cala Vento Charter",
        styles: [
          { name: "Sardinia Azure", thumbnail: _wrap("Cala%20Vento%20Charter/home.png"), screens: [
            _wrap("Cala%20Vento%20Charter/home.png"), _wrap("Cala%20Vento%20Charter/escursioni.png"),
            _wrap("Cala%20Vento%20Charter/dettaglio-tour.png"), _wrap("Cala%20Vento%20Charter/prenotazione.png"),
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
        name: "Idro Pronto",
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
];
