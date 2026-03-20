/**
 * Mockup screen images for each sector's iPhone showcase.
 * Each sector has up to 14 unique app interface screenshots.
 * Images are curated to show diverse UI styles relevant to each industry.
 */

import { type IndustryId } from "@/config/industry-config";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

export const SECTOR_MOCKUP_IMAGES: Partial<Record<IndustryId, string[]>> = {
  food: [
    // COTE Miami — Obsidian dark luxury Korean BBQ
    `${S}/COTE%20Miami/a-obsidian-mobile-home.png`,
    `${S}/COTE%20Miami/a-obsidian-mobile-menu.png`,
    `${S}/COTE%20Miami/a-obsidian-mobile-detail.png`,
    // Paperfish Sushi — Sakura Japanese
    `${S}/Paperfish%20Sushi/a-sakura-home.png`,
    `${S}/Paperfish%20Sushi/a-sakura-menu.png`,
    `${S}/Paperfish%20Sushi/a-sakura-detail.png`,
    // Flame Kebab — vibrant food ordering
    `${S}/flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png`,
    `${S}/flame-kebab/730290ed-5bf6-485f-b999-b75602a57d11.png`,
    `${S}/flame-kebab/c31559c3-67cf-4f62-b4e7-74833046eda7.png`,
    // La Vang Vietnamese — Noir Saigon luxury
    `${S}/La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-home.png`,
    `${S}/La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-menu.png`,
    `${S}/La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-detail.png`,
    // Batey Cevicheria
    `${S}/Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-home.png`,
    `${S}/Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-menu.png`,
  ],

  beauty: [
    // Neo Nails Brickell — frosted glass premium
    `${S}/Neo%20Nails%20Brickell/frosted-glass-home.png`,
    `${S}/Neo%20Nails%20Brickell/frosted-glass-servizi.png`,
    `${S}/Neo%20Nails%20Brickell/frosted-glass-dettaglio.png`,
    // Tatush Hair Fragrance — fresh minimal blanc
    `${S}/Tatush%20Hair%20Fragrance/mobile-home.png`,
    `${S}/Tatush%20Hair%20Fragrance/mobile-shop.png`,
    `${S}/Tatush%20Hair%20Fragrance/mobile-detail.png`,
  ],

  ncc: [
    // Meridia Rental Car — sleek car rental
    `${S}/migrated-1773167906872-821da26dd0f0fec05286424b7e1d3a11-1772620868489.png`,
    `${S}/migrated-1773167907191-360951700ee2756f3cb37cc9119ba26f-1772620944505.png`,
    `${S}/migrated-1773167907500-cecfe2b244765df008519b7024925b5b-1772620948139.png`,
    // Miami Boats Rental — luxury yacht
    `${S}/Miami%20Boats%20Rental/A-mobile-home.png`,
    `${S}/Miami%20Boats%20Rental/A-mobile-fleet.png`,
    `${S}/Miami%20Boats%20Rental/A-mobile-yacht-detail.png`,
    // Asinara Charter — Sardinia azure luxury
    `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png`,
    `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/escursioni.png`,
    `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/dettaglio-tour.png`,
  ],

  fitness: [
    // City Padel Milano — fresh azzurro iOS 18
    `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-home.png`,
    `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-prenota.png`,
    `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-maestri.png`,
  ],

  healthcare: [
    // FAR Medical Solutions — ethereal glass
    `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png`,
    `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-servizi.png`,
    `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-prodotti.png`,
  ],

  veterinary: [
    // Aloha Pet Resorts
    `${S}/Aloha%20Pet%20Resorts/mobile-a-home.png`,
    `${S}/Aloha%20Pet%20Resorts/mobile-a-services.png`,
    `${S}/Aloha%20Pet%20Resorts/mobile-a-detail.png`,
  ],

  childcare: [
    // Little Diamond Nursery — playful colorful
    `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/home.png`,
    `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/programs-activities.png`,
    `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/team-tour.png`,
    // Ashley's Playhouse — autumn themed
    `${S}/Ashley's%20Playhouse/stile-a-home.png`,
    `${S}/Ashley's%20Playhouse/stile-a-programs.png`,
    `${S}/Ashley's%20Playhouse/stile-a-book.png`,
  ],

  plumber: [
    // Nick's Plumbing & AC
    `${S}/Nick's%20Plumbing%20&%20AC/stile-a-home.png`,
    `${S}/Nick's%20Plumbing%20&%20AC/stile-a-services.png`,
    `${S}/Nick's%20Plumbing%20&%20AC/stile-a-detail.png`,
  ],

  beach: [
    // Miami Watersports
    `${S}/Miami%20Watersports/style-a-mobile-home.png`,
    `${S}/Miami%20Watersports/style-a-mobile-activities.png`,
    `${S}/Miami%20Watersports/style-a-mobile-detail.png`,
  ],

  hospitality: [
    // MMI Resident Hub — ocean azure luxury
    `${S}/MMI%20Resident%20Hub/01-ocean-azure-desktop-dashboard.png`,
  ],

  // Education sector doesn't have matching portfolio images — uses CSS fallback
};
