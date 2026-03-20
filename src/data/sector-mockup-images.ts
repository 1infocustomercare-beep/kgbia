/**
 * Mockup screen images for each sector's iPhone showcase.
 * Each sector has unique app interface screenshots with diverse styles.
 */

import { type IndustryId } from "@/config/industry-config";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

// Local generated assets
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

export const SECTOR_MOCKUP_IMAGES: Partial<Record<IndustryId, string[]>> = {
  food: [
    `${S}/COTE%20Miami/a-obsidian-mobile-home.png`,
    `${S}/COTE%20Miami/a-obsidian-mobile-menu.png`,
    `${S}/COTE%20Miami/a-obsidian-mobile-detail.png`,
    `${S}/Paperfish%20Sushi/a-sakura-home.png`,
    `${S}/Paperfish%20Sushi/a-sakura-menu.png`,
    `${S}/Paperfish%20Sushi/a-sakura-detail.png`,
    `${S}/flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png`,
    `${S}/flame-kebab/730290ed-5bf6-485f-b999-b75602a57d11.png`,
    `${S}/flame-kebab/c31559c3-67cf-4f62-b4e7-74833046eda7.png`,
    `${S}/La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-home.png`,
    `${S}/La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-menu.png`,
    `${S}/La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-detail.png`,
    `${S}/Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-home.png`,
    `${S}/Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-menu.png`,
  ],

  beauty: [
    `${S}/Neo%20Nails%20Brickell/frosted-glass-home.png`,
    `${S}/Neo%20Nails%20Brickell/frosted-glass-servizi.png`,
    `${S}/Neo%20Nails%20Brickell/frosted-glass-dettaglio.png`,
    `${S}/Tatush%20Hair%20Fragrance/mobile-home.png`,
    `${S}/Tatush%20Hair%20Fragrance/mobile-shop.png`,
    `${S}/Tatush%20Hair%20Fragrance/mobile-detail.png`,
  ],

  ncc: [
    `${S}/migrated-1773167906872-821da26dd0f0fec05286424b7e1d3a11-1772620868489.png`,
    `${S}/migrated-1773167907191-360951700ee2756f3cb37cc9119ba26f-1772620944505.png`,
    `${S}/migrated-1773167907500-cecfe2b244765df008519b7024925b5b-1772620948139.png`,
    `${S}/Miami%20Boats%20Rental/A-mobile-home.png`,
    `${S}/Miami%20Boats%20Rental/A-mobile-fleet.png`,
    `${S}/Miami%20Boats%20Rental/A-mobile-yacht-detail.png`,
    `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png`,
    `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/escursioni.png`,
    `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/dettaglio-tour.png`,
  ],

  fitness: [
    `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-home.png`,
    `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-prenota.png`,
    `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-maestri.png`,
  ],

  healthcare: [
    `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png`,
    `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-servizi.png`,
    `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-prodotti.png`,
  ],

  veterinary: [
    `${S}/Aloha%20Pet%20Resorts/mobile-a-home.png`,
    `${S}/Aloha%20Pet%20Resorts/mobile-a-services.png`,
    `${S}/Aloha%20Pet%20Resorts/mobile-a-detail.png`,
  ],

  childcare: [
    `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/home.png`,
    `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/programs-activities.png`,
    `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/team-tour.png`,
    `${S}/Ashley's%20Playhouse/stile-a-home.png`,
    `${S}/Ashley's%20Playhouse/stile-a-programs.png`,
    `${S}/Ashley's%20Playhouse/stile-a-book.png`,
  ],

  plumber: [
    `${S}/Nick's%20Plumbing%20&%20AC/stile-a-home.png`,
    `${S}/Nick's%20Plumbing%20&%20AC/stile-a-services.png`,
    `${S}/Nick's%20Plumbing%20&%20AC/stile-a-detail.png`,
  ],

  beach: [
    `${S}/Miami%20Watersports/style-a-mobile-home.png`,
    `${S}/Miami%20Watersports/style-a-mobile-activities.png`,
    `${S}/Miami%20Watersports/style-a-mobile-detail.png`,
  ],

  hospitality: [
    `${S}/MMI%20Resident%20Hub/01-ocean-azure-desktop-dashboard.png`,
  ],

  // ── Generated mockups for remaining sectors ──

  retail: [retailHome, retailDetail],

  electrician: [electricianHome, electricianDetail],

  agriturismo: [agriturismoHome, agriturismoActivities],

  cleaning: [cleaningHome, cleaningBooking],

  legal: [legalHome, legalCase],

  accounting: [accountingHome, accountingInvoice],

  garage: [garageHome, garageDetail],

  photography: [photographyHome, photographyGallery],

  construction: [constructionHome, constructionTimeline],

  gardening: [gardeningHome, gardeningProject],

  tattoo: [tattooHome, tattooArtist],

  education: [educationHome, educationCourse],

  events: [eventsHome, eventsDetail],

  logistics: [logisticsHome, logisticsTracking],
};
