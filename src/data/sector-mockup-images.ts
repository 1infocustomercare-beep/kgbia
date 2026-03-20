/**
 * Mockup screen images for each sector's iPhone showcase.
 * All 577 real mockups from Lowengeld Agency, organized by sector.
 */

import { type IndustryId } from "@/config/industry-config";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

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
   ═══════════════════════════════════════════ */

export const SECTOR_MOCKUP_IMAGES: Partial<Record<IndustryId, string[]>> = {
  food: [
    `${S}/COTE%20Miami/a-obsidian-mobile-home.png`,
    `${S}/COTE%20Miami/b-ivory-mobile-home.png`,
    `${S}/COTE%20Miami/d-marble-mobile-home.png`,
    `${S}/Paperfish%20Sushi/a-sakura-home.png`,
    `${S}/Paperfish%20Sushi/b-luxury-dark-home.png`,
    `${S}/Paperfish%20Sushi/c-white-clean-home.png`,
    `${S}/flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png`,
    `${S}/La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-home.png`,
    `${S}/La%20Vang%20Vietnamese%20Luxury/b-jade-dynasty-home.png`,
    `${S}/La%20Vang%20Vietnamese%20Luxury/e-crimson-silk-home.png`,
    `${S}/Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-home.png`,
    `${S}/Midtown%20Kosher/mobile-a-home.png`,
  ],

  beauty: [
    `${S}/Neo%20Nails%20Brickell/lavender-luxe-home.png`,
    `${S}/Neo%20Nails%20Brickell/blush-rosegold-home.png`,
    `${S}/Neo%20Nails%20Brickell/lavender-luxe-servizi.png`,
    `${S}/Neo%20Nails%20Brickell/blush-rosegold-servizi.png`,
    `${S}/Tatush%20Hair%20Fragrance/mobile-home.png`,
    `${S}/Tatush%20Hair%20Fragrance/mobile-shop.png`,
  ],

  ncc: [
    `${S}/Miami%20Boats%20Rental/A-mobile-home.png`,
    `${S}/Miami%20Boats%20Rental/A-mobile-fleet.png`,
    `${S}/Miami%20Boats%20Rental/A-mobile-yacht-detail.png`,
    `${S}/Miami%20Boats%20Rental/A-mobile-booking.png`,
    `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png`,
    `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/escursioni.png`,
    `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/dettaglio-tour.png`,
    `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/prenotazione.png`,
  ],

  fitness: [
    `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-home.png`,
    `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-prenota.png`,
    `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-maestri.png`,
    `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-dettaglio.png`,
    `${S}/Miami%20Watersports/style-a-mobile-home.png`,
    `${S}/Miami%20Watersports/style-a-mobile-activities.png`,
  ],

  healthcare: [
    `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png`,
    `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-servizi.png`,
  ],

  veterinary: [
    `${S}/Aloha%20Pet%20Resorts/mobile-a-home.png`,
    `${S}/Aloha%20Pet%20Resorts/mobile-a-services.png`,
    `${S}/Aloha%20Pet%20Resorts/mobile-a-detail.png`,
    `${S}/Aloha%20Pet%20Resorts/mobile-a-booking.png`,
    `${S}/Aloha%20Pet%20Resorts/mobile-e-home.png`,
    `${S}/Aloha%20Pet%20Resorts/mobile-e-services.png`,
  ],

  childcare: [
    `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/home.png`,
    `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/programs-activities.png`,
    `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/team-tour.png`,
    `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/meal-plan-enroll.png`,
    `${S}/Little%20Diamond%20Nursery%20-%20Nature%20Explorer/home.png`,
    `${S}/Little%20Diamond%20Nursery%20-%20Nature%20Explorer/programs-activities.png`,
    `${S}/Ashley's%20Playhouse/stile-a-home.png`,
    `${S}/Ashley's%20Playhouse/stile-a-programs.png`,
  ],

  plumber: [
    `${S}/Nick's%20Plumbing%20&%20AC/stile-a-home.png`,
    `${S}/Nick's%20Plumbing%20&%20AC/stile-a-services.png`,
    `${S}/Nick's%20Plumbing%20&%20AC/stile-a-detail.png`,
    `${S}/Nick's%20Plumbing%20&%20AC/stile-a-booking.png`,
    `${S}/Nick's%20Plumbing%20&%20AC/stile-b-home.png`,
    `${S}/Nick's%20Plumbing%20&%20AC/stile-b-services.png`,
  ],

  beach: [
    `${S}/Miami%20Watersports/style-a-mobile-home.png`,
    `${S}/Miami%20Watersports/style-a-mobile-activities.png`,
  ],

  hospitality: [
    `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png`,
    `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/escursioni.png`,
    `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/dettaglio-tour.png`,
    `${S}/Miami%20Boats%20Rental/A-mobile-home.png`,
    `${S}/Miami%20Boats%20Rental/A-mobile-fleet.png`,
  ],

  construction: [
    `${S}/MMI%20Resident%20Hub/05-ocean-azure-mobile-dashboard.png`,
    constructionHome, constructionTimeline,
  ],

  retail: [
    `${S}/Tatush%20Hair%20Fragrance/mobile-home.png`,
    `${S}/Tatush%20Hair%20Fragrance/mobile-shop.png`,
    `${S}/Tatush%20Hair%20Fragrance/mobile-detail.png`,
    `${S}/Tatush%20Hair%20Fragrance/mobile-cart.png`,
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
   ═══════════════════════════════════════════ */

export interface MockupBrand {
  name: string;
  styles: MockupStyle[];
}

export interface MockupStyle {
  name: string;
  screens: string[];        // [home, menu/services, detail, cart/booking]
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
          { name: "Obsidian", thumbnail: `${S}/COTE%20Miami/a-obsidian-mobile-home.png`, screens: [
            `${S}/COTE%20Miami/a-obsidian-mobile-home.png`, `${S}/COTE%20Miami/a-obsidian-mobile-menu.png`,
            `${S}/COTE%20Miami/a-obsidian-mobile-detail.png`, `${S}/COTE%20Miami/a-obsidian-mobile-cart.png`,
          ]},
          { name: "Ivory", thumbnail: `${S}/COTE%20Miami/b-ivory-mobile-home.png`, screens: [
            `${S}/COTE%20Miami/b-ivory-mobile-home.png`, `${S}/COTE%20Miami/b-ivory-mobile-menu.png`,
            `${S}/COTE%20Miami/b-ivory-mobile-detail.png`, `${S}/COTE%20Miami/b-ivory-mobile-cart.png`,
          ]},
          { name: "Marble", thumbnail: `${S}/COTE%20Miami/d-marble-mobile-home.png`, screens: [
            `${S}/COTE%20Miami/d-marble-mobile-home.png`, `${S}/COTE%20Miami/d-marble-mobile-menu.png`,
            `${S}/COTE%20Miami/d-marble-mobile-detail.png`, `${S}/COTE%20Miami/d-marble-mobile-cart.png`,
          ]},
          { name: "Hanok", thumbnail: `${S}/COTE%20Miami/e-hanok-mobile-home.png`, screens: [
            `${S}/COTE%20Miami/e-hanok-mobile-home.png`, `${S}/COTE%20Miami/e-hanok-mobile-menu.png`,
            `${S}/COTE%20Miami/e-hanok-mobile-detail.png`, `${S}/COTE%20Miami/e-hanok-mobile-cart.png`,
          ]},
          { name: "Gangnam", thumbnail: `${S}/COTE%20Miami/f-gangnam-mobile-home.png`, screens: [
            `${S}/COTE%20Miami/f-gangnam-mobile-home.png`, `${S}/COTE%20Miami/f-gangnam-mobile-menu.png`,
            `${S}/COTE%20Miami/f-gangnam-mobile-detail.png`, `${S}/COTE%20Miami/f-gangnam-mobile-cart.png`,
          ]},
          { name: "Joseon", thumbnail: `${S}/COTE%20Miami/h-joseon-mobile-home.png`, screens: [
            `${S}/COTE%20Miami/h-joseon-mobile-home.png`, `${S}/COTE%20Miami/h-joseon-mobile-menu.png`,
            `${S}/COTE%20Miami/h-joseon-mobile-detail.png`, `${S}/COTE%20Miami/h-joseon-mobile-cart.png`,
          ]},
        ],
      },
      {
        name: "Paperfish Sushi",
        styles: [
          { name: "Sakura", thumbnail: `${S}/Paperfish%20Sushi/a-sakura-home.png`, screens: [
            `${S}/Paperfish%20Sushi/a-sakura-home.png`, `${S}/Paperfish%20Sushi/a-sakura-menu.png`,
            `${S}/Paperfish%20Sushi/a-sakura-detail.png`, `${S}/Paperfish%20Sushi/a-sakura-cart.png`,
          ]},
          { name: "Luxury Dark", thumbnail: `${S}/Paperfish%20Sushi/b-luxury-dark-home.png`, screens: [
            `${S}/Paperfish%20Sushi/b-luxury-dark-home.png`, `${S}/Paperfish%20Sushi/b-luxury-dark-menu.png`,
            `${S}/Paperfish%20Sushi/b-luxury-dark-detail.png`, `${S}/Paperfish%20Sushi/b-luxury-dark-cart.png`,
          ]},
          { name: "White Clean", thumbnail: `${S}/Paperfish%20Sushi/c-white-clean-home.png`, screens: [
            `${S}/Paperfish%20Sushi/c-white-clean-home.png`, `${S}/Paperfish%20Sushi/c-white-clean-menu.png`,
            `${S}/Paperfish%20Sushi/c-white-clean-detail.png`, `${S}/Paperfish%20Sushi/c-white-clean-cart.png`,
          ]},
        ],
      },
      {
        name: "Flame Kebab",
        styles: [
          { name: "Default", thumbnail: `${S}/flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png`, screens: [
            `${S}/flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png`,
            `${S}/flame-kebab/730290ed-5bf6-485f-b999-b75602a57d11.png`,
            `${S}/flame-kebab/c31559c3-67cf-4f62-b4e7-74833046eda7.png`,
            `${S}/flame-kebab/2c4522d2-0ca5-4dbf-a412-ef366f55a13e.png`,
            `${S}/flame-kebab/27beb33c-82a4-46b4-9090-279f7e6b2911.png`,
            `${S}/flame-kebab/312c85cb-9d51-4b8c-98d1-eadca41acc70.png`,
            `${S}/flame-kebab/9952edef-41f5-499f-baeb-ad1b127f4cd6.png`,
          ]},
        ],
      },
      {
        name: "La Vang Vietnamese",
        styles: [
          { name: "Noir Saigon", thumbnail: `${S}/La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-home.png`, screens: [
            `${S}/La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-home.png`, `${S}/La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-menu.png`,
            `${S}/La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-detail.png`, `${S}/La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-cart.png`,
          ]},
          { name: "Jade Dynasty", thumbnail: `${S}/La%20Vang%20Vietnamese%20Luxury/b-jade-dynasty-home.png`, screens: [
            `${S}/La%20Vang%20Vietnamese%20Luxury/b-jade-dynasty-home.png`, `${S}/La%20Vang%20Vietnamese%20Luxury/b-jade-dynasty-menu.png`,
            `${S}/La%20Vang%20Vietnamese%20Luxury/b-jade-dynasty-detail.png`, `${S}/La%20Vang%20Vietnamese%20Luxury/b-jade-dynasty-cart.png`,
          ]},
          { name: "Crimson Silk", thumbnail: `${S}/La%20Vang%20Vietnamese%20Luxury/e-crimson-silk-home.png`, screens: [
            `${S}/La%20Vang%20Vietnamese%20Luxury/e-crimson-silk-home.png`, `${S}/La%20Vang%20Vietnamese%20Luxury/e-crimson-silk-menu.png`,
            `${S}/La%20Vang%20Vietnamese%20Luxury/e-crimson-silk-detail.png`, `${S}/La%20Vang%20Vietnamese%20Luxury/e-crimson-silk-cart.png`,
          ]},
        ],
      },
      {
        name: "Batey Cevicheria",
        styles: [
          { name: "Costa Pacifico", thumbnail: `${S}/Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-home.png`, screens: [
            `${S}/Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-home.png`, `${S}/Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-menu.png`,
            `${S}/Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-detail.png`, `${S}/Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-cart.png`,
          ]},
        ],
      },
      {
        name: "Midtown Kosher",
        styles: [
          { name: "Style A", thumbnail: `${S}/Midtown%20Kosher/mobile-a-home.png`, screens: [
            `${S}/Midtown%20Kosher/mobile-a-home.png`, `${S}/Midtown%20Kosher/mobile-a-menu.png`,
            `${S}/Midtown%20Kosher/mobile-a-detail.png`, `${S}/Midtown%20Kosher/mobile-a-cart.png`,
          ]},
        ],
      },
    ],
  },
  {
    sectorId: "beauty",
    sectorLabel: "Beauty & Wellness",
    brands: [
      {
        name: "Neo Nails Brickell",
        styles: [
          { name: "Lavender Luxe", thumbnail: `${S}/Neo%20Nails%20Brickell/lavender-luxe-home.png`, screens: [
            `${S}/Neo%20Nails%20Brickell/lavender-luxe-home.png`, `${S}/Neo%20Nails%20Brickell/lavender-luxe-servizi.png`,
            `${S}/Neo%20Nails%20Brickell/lavender-luxe-dettaglio.png`, `${S}/Neo%20Nails%20Brickell/lavender-luxe-booking.png`,
          ]},
          { name: "Blush Rosegold", thumbnail: `${S}/Neo%20Nails%20Brickell/blush-rosegold-home.png`, screens: [
            `${S}/Neo%20Nails%20Brickell/blush-rosegold-home.png`, `${S}/Neo%20Nails%20Brickell/blush-rosegold-servizi.png`,
            `${S}/Neo%20Nails%20Brickell/blush-rosegold-dettaglio.png`, `${S}/Neo%20Nails%20Brickell/blush-rosegold-booking.png`,
          ]},
        ],
      },
      {
        name: "Tatush Hair Fragrance",
        styles: [
          { name: "Mobile", thumbnail: `${S}/Tatush%20Hair%20Fragrance/mobile-home.png`, screens: [
            `${S}/Tatush%20Hair%20Fragrance/mobile-home.png`, `${S}/Tatush%20Hair%20Fragrance/mobile-shop.png`,
            `${S}/Tatush%20Hair%20Fragrance/mobile-detail.png`, `${S}/Tatush%20Hair%20Fragrance/mobile-cart.png`,
          ]},
        ],
      },
    ],
  },
  {
    sectorId: "ncc",
    sectorLabel: "NCC & Trasporti",
    brands: [
      {
        name: "Miami Boats Rental",
        styles: [
          { name: "Style A", thumbnail: `${S}/Miami%20Boats%20Rental/A-mobile-home.png`, screens: [
            `${S}/Miami%20Boats%20Rental/A-mobile-home.png`, `${S}/Miami%20Boats%20Rental/A-mobile-fleet.png`,
            `${S}/Miami%20Boats%20Rental/A-mobile-yacht-detail.png`, `${S}/Miami%20Boats%20Rental/A-mobile-booking.png`,
          ]},
        ],
      },
      {
        name: "Asinara Charter",
        styles: [
          { name: "Sardinia Azure", thumbnail: `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png`, screens: [
            `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png`, `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/escursioni.png`,
            `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/dettaglio-tour.png`, `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/prenotazione.png`,
          ]},
        ],
      },
    ],
  },
  {
    sectorId: "veterinary",
    sectorLabel: "Veterinario",
    brands: [
      {
        name: "Aloha Pet Resorts",
        styles: [
          { name: "Style A", thumbnail: `${S}/Aloha%20Pet%20Resorts/mobile-a-home.png`, screens: [
            `${S}/Aloha%20Pet%20Resorts/mobile-a-home.png`, `${S}/Aloha%20Pet%20Resorts/mobile-a-services.png`,
            `${S}/Aloha%20Pet%20Resorts/mobile-a-detail.png`, `${S}/Aloha%20Pet%20Resorts/mobile-a-booking.png`,
          ]},
          { name: "Style E", thumbnail: `${S}/Aloha%20Pet%20Resorts/mobile-e-home.png`, screens: [
            `${S}/Aloha%20Pet%20Resorts/mobile-e-home.png`, `${S}/Aloha%20Pet%20Resorts/mobile-e-services.png`,
            `${S}/Aloha%20Pet%20Resorts/mobile-e-detail.png`, `${S}/Aloha%20Pet%20Resorts/mobile-e-booking.png`,
          ]},
        ],
      },
    ],
  },
  {
    sectorId: "childcare",
    sectorLabel: "Asili & Infanzia",
    brands: [
      {
        name: "Little Diamond Nursery",
        styles: [
          { name: "Playful Colorful", thumbnail: `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/home.png`, screens: [
            `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/home.png`, `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/programs-activities.png`,
            `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/team-tour.png`, `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/meal-plan-enroll.png`,
          ]},
          { name: "Nature Explorer", thumbnail: `${S}/Little%20Diamond%20Nursery%20-%20Nature%20Explorer/home.png`, screens: [
            `${S}/Little%20Diamond%20Nursery%20-%20Nature%20Explorer/home.png`, `${S}/Little%20Diamond%20Nursery%20-%20Nature%20Explorer/programs-activities.png`,
            `${S}/Little%20Diamond%20Nursery%20-%20Nature%20Explorer/team-tour.png`, `${S}/Little%20Diamond%20Nursery%20-%20Nature%20Explorer/meal-plan-enroll.png`,
          ]},
        ],
      },
      {
        name: "Ashley's Playhouse",
        styles: [
          { name: "Style A", thumbnail: `${S}/Ashley's%20Playhouse/stile-a-home.png`, screens: [
            `${S}/Ashley's%20Playhouse/stile-a-home.png`, `${S}/Ashley's%20Playhouse/stile-a-programs.png`,
            `${S}/Ashley's%20Playhouse/stile-a-book.png`, `${S}/Ashley's%20Playhouse/stile-a-parent.png`,
          ]},
        ],
      },
    ],
  },
  {
    sectorId: "fitness",
    sectorLabel: "Fitness & Palestre",
    brands: [
      {
        name: "City Padel Milano",
        styles: [
          { name: "Fresh Azzurro", thumbnail: `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-home.png`, screens: [
            `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-home.png`, `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-prenota.png`,
            `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-maestri.png`, `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-dettaglio.png`,
          ]},
        ],
      },
      {
        name: "Miami Watersports",
        styles: [
          { name: "Style A", thumbnail: `${S}/Miami%20Watersports/style-a-mobile-home.png`, screens: [
            `${S}/Miami%20Watersports/style-a-mobile-home.png`, `${S}/Miami%20Watersports/style-a-mobile-activities.png`,
          ]},
        ],
      },
    ],
  },
  {
    sectorId: "healthcare",
    sectorLabel: "Healthcare & Cliniche",
    brands: [
      {
        name: "FAR Medical Solutions",
        styles: [
          { name: "Ethereal Glass", thumbnail: `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png`, screens: [
            `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png`, `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-servizi.png`,
          ]},
        ],
      },
    ],
  },
  {
    sectorId: "hospitality",
    sectorLabel: "Hospitality & Hotel",
    brands: [
      {
        name: "Asinara Charter",
        styles: [
          { name: "Sardinia Azure", thumbnail: `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png`, screens: [
            `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png`, `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/escursioni.png`,
            `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/dettaglio-tour.png`, `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/prenotazione.png`,
          ]},
        ],
      },
      {
        name: "Miami Boats Rental",
        styles: [
          { name: "Style A", thumbnail: `${S}/Miami%20Boats%20Rental/A-mobile-home.png`, screens: [
            `${S}/Miami%20Boats%20Rental/A-mobile-home.png`, `${S}/Miami%20Boats%20Rental/A-mobile-fleet.png`,
            `${S}/Miami%20Boats%20Rental/A-mobile-yacht-detail.png`, `${S}/Miami%20Boats%20Rental/A-mobile-booking.png`,
          ]},
        ],
      },
    ],
  },
  {
    sectorId: "plumber",
    sectorLabel: "Artigiani & Servizi",
    brands: [
      {
        name: "Nick's Plumbing & AC",
        styles: [
          { name: "Style A", thumbnail: `${S}/Nick's%20Plumbing%20&%20AC/stile-a-home.png`, screens: [
            `${S}/Nick's%20Plumbing%20&%20AC/stile-a-home.png`, `${S}/Nick's%20Plumbing%20&%20AC/stile-a-services.png`,
            `${S}/Nick's%20Plumbing%20&%20AC/stile-a-detail.png`, `${S}/Nick's%20Plumbing%20&%20AC/stile-a-booking.png`,
          ]},
          { name: "Style B", thumbnail: `${S}/Nick's%20Plumbing%20&%20AC/stile-b-home.png`, screens: [
            `${S}/Nick's%20Plumbing%20&%20AC/stile-b-home.png`, `${S}/Nick's%20Plumbing%20&%20AC/stile-b-services.png`,
            `${S}/Nick's%20Plumbing%20&%20AC/stile-b-detail.png`, `${S}/Nick's%20Plumbing%20&%20AC/stile-b-booking.png`,
          ]},
        ],
      },
    ],
  },
  {
    sectorId: "construction",
    sectorLabel: "Edilizia & Cantieri",
    brands: [
      {
        name: "MMI Resident Hub",
        styles: [
          { name: "Ocean Azure", thumbnail: `${S}/MMI%20Resident%20Hub/05-ocean-azure-mobile-dashboard.png`, screens: [
            `${S}/MMI%20Resident%20Hub/05-ocean-azure-mobile-dashboard.png`,
            `${S}/MMI%20Resident%20Hub/01-ocean-azure-desktop-dashboard.png`,
          ]},
        ],
      },
    ],
  },
  {
    sectorId: "retail",
    sectorLabel: "Retail & Negozi",
    brands: [
      {
        name: "Tatush Hair Fragrance",
        styles: [
          { name: "Mobile", thumbnail: `${S}/Tatush%20Hair%20Fragrance/mobile-home.png`, screens: [
            `${S}/Tatush%20Hair%20Fragrance/mobile-home.png`, `${S}/Tatush%20Hair%20Fragrance/mobile-shop.png`,
            `${S}/Tatush%20Hair%20Fragrance/mobile-detail.png`, `${S}/Tatush%20Hair%20Fragrance/mobile-cart.png`,
          ]},
          { name: "Desktop", thumbnail: `${S}/Tatush%20Hair%20Fragrance/desktop-homepage.png`, screens: [
            `${S}/Tatush%20Hair%20Fragrance/desktop-homepage.png`, `${S}/Tatush%20Hair%20Fragrance/desktop-shop.png`,
            `${S}/Tatush%20Hair%20Fragrance/desktop-detail.png`, `${S}/Tatush%20Hair%20Fragrance/desktop-cart.png`,
          ]},
        ],
      },
    ],
  },
  {
    sectorId: "beach",
    sectorLabel: "Stabilimenti Balneari",
    brands: [
      {
        name: "Miami Watersports",
        styles: [
          { name: "Style A", thumbnail: `${S}/Miami%20Watersports/style-a-mobile-home.png`, screens: [
            `${S}/Miami%20Watersports/style-a-mobile-home.png`, `${S}/Miami%20Watersports/style-a-mobile-activities.png`,
          ]},
        ],
      },
    ],
  },
];
