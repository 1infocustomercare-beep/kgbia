/**
 * Portfolio showcase data for each sector — Lowengeld-style project pages.
 * Each sector has its own "project" with metadata, categories, and screen labels.
 */

import { type IndustryId } from "@/config/industry-config";

export interface PortfolioProject {
  /** Display name of the demo business */
  name: string;
  /** Short description */
  description: string;
  /** Category badges (e.g. "Food & Beverage", "Luxury Dining") */
  tags: string[];
  /** Client / Year / Platform metadata */
  client: string;
  year: string;
  platform: string;
  /** Accent color for the project (HSL or hex) */
  accent: string;
  /** Screen labels — maps 1:1 to images in SECTOR_MOCKUP_IMAGES */
  screenLabels: string[];
  /** Optional sub-projects (e.g. multiple food restaurants) */
  subProjects?: {
    name: string;
    description: string;
    tags: string[];
    accent: string;
    screenLabels: string[];
    /** Image indices from the parent's mockup array */
    imageRange: [number, number];
  }[];
}

export const PORTFOLIO_PROJECTS: Partial<Record<IndustryId, PortfolioProject>> = {
  food: {
    name: "Food & Ristorazione",
    description: "Piattaforme premium di ristorazione con menu digitale, ordini real-time, kitchen display e analytics avanzati per ristoranti di ogni livello.",
    tags: ["Food & Beverage", "Luxury Dining", "QR Ordering"],
    client: "Multi-Brand Restaurant Group",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#d4af37",
    screenLabels: [
      "COTE – Home", "COTE – Menu", "COTE – Detail",
      "Paperfish Sushi – Home", "Paperfish – Menu", "Paperfish – Detail",
      "Flame Kebab – Home", "Flame Kebab – Menu", "Flame Kebab – Detail",
      "La Vang – Home", "La Vang – Menu", "La Vang – Detail",
      "Batey Cevicheria – Home", "Batey – Menu",
    ],
    subProjects: [
      {
        name: "COTE Miami",
        description: "Michelin-starred Korean BBQ with premium dark UI, featured cuts showcase and table-side ordering.",
        tags: ["Fine Dining", "Korean BBQ", "Michelin Star"],
        accent: "#c87533",
        screenLabels: ["Home", "Menu", "Detail"],
        imageRange: [0, 2],
      },
      {
        name: "Paperfish Sushi",
        description: "Japanese omakase experience with sakura-inspired design, chef's selections and sake pairing.",
        tags: ["Sushi", "Japanese", "Omakase"],
        accent: "#e8a0bf",
        screenLabels: ["Home", "Menu", "Detail"],
        imageRange: [3, 5],
      },
      {
        name: "Flame Kebab",
        description: "Modern Middle Eastern grill with fire-themed UI, combo builder and delivery tracking.",
        tags: ["Kebab", "Grill", "Street Food"],
        accent: "#e85d04",
        screenLabels: ["Home", "Menu", "Detail"],
        imageRange: [6, 8],
      },
      {
        name: "La Vang Vietnamese",
        description: "Luxury Vietnamese cuisine with noir-saigon aesthetic, pho bar and cocktail pairing.",
        tags: ["Vietnamese", "Luxury", "Asian Fusion"],
        accent: "#c9a84c",
        screenLabels: ["Home", "Menu", "Detail"],
        imageRange: [9, 11],
      },
      {
        name: "Batey Cevicheria",
        description: "Urban Latin ceviche bar with coastal Pacific design, fresh catch of the day and tropical cocktails.",
        tags: ["Ceviche", "Latin", "Seafood"],
        accent: "#38bdf8",
        screenLabels: ["Home", "Menu"],
        imageRange: [12, 13],
      },
    ],
  },

  beauty: {
    name: "Beauty & Wellness",
    description: "Piattaforme eleganti per saloni di bellezza, spa e centri estetici con prenotazioni smart e gestione clienti.",
    tags: ["Beauty", "Wellness", "Booking"],
    client: "Premium Beauty Brands",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#ec4899",
    screenLabels: [
      "Neo Nails – Home", "Neo Nails – Servizi", "Neo Nails – Dettaglio",
      "Tatush Hair – Home", "Tatush Hair – Shop", "Tatush Hair – Detail",
    ],
    subProjects: [
      {
        name: "Neo Nails Brickell",
        description: "Frosted glass UI for a luxury nail art studio with appointment booking and loyalty rewards.",
        tags: ["Nail Art", "Luxury", "Miami"],
        accent: "#f0abfc",
        screenLabels: ["Home", "Services", "Detail"],
        imageRange: [0, 2],
      },
      {
        name: "Tatush Hair & Fragrance",
        description: "Premium hair salon with product shop, stylist profiles and fragrance customization.",
        tags: ["Hair Salon", "E-commerce", "Fragrance"],
        accent: "#be185d",
        screenLabels: ["Home", "Shop", "Detail"],
        imageRange: [3, 5],
      },
    ],
  },

  ncc: {
    name: "NCC & Luxury Transfer",
    description: "Piattaforme di prenotazione premium per noleggio con conducente, charter nautici e transfer aeroportuali.",
    tags: ["Transportation", "Luxury", "Booking"],
    client: "Premium Transfer Operators",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#D4A017",
    screenLabels: [
      "Amalfi Transfer – Home", "Amalfi Transfer – Fleet", "Amalfi Transfer – Booking",
      "Miami Boats – Home", "Miami Boats – Fleet", "Miami Boats – Yacht Detail",
      "Asinara Charter – Home", "Asinara Charter – Tours", "Asinara Charter – Detail",
    ],
    subProjects: [
      {
        name: "Amalfi Luxury Transfer",
        description: "Premium chauffeur service for the Amalfi Coast with real-time fleet tracking and VIP booking.",
        tags: ["NCC", "Amalfi Coast", "VIP"],
        accent: "#D4A017",
        screenLabels: ["Home", "Fleet", "Booking"],
        imageRange: [0, 2],
      },
      {
        name: "Miami Boats Rental",
        description: "Luxury yacht and boat rental platform with captain booking and marina management.",
        tags: ["Yacht", "Boat Rental", "Miami"],
        accent: "#0ea5e9",
        screenLabels: ["Home", "Fleet", "Yacht Detail"],
        imageRange: [3, 5],
      },
      {
        name: "Asinara Charter",
        description: "Sardinian azure luxury charter with tour packages, snorkeling excursions and group booking.",
        tags: ["Charter", "Sardinia", "Excursions"],
        accent: "#06b6d4",
        screenLabels: ["Home", "Tours", "Detail"],
        imageRange: [6, 8],
      },
    ],
  },

  fitness: {
    name: "Fitness & Sport",
    description: "Piattaforme per palestre, padel club e centri sportivi con prenotazione campi e gestione abbonamenti.",
    tags: ["Fitness", "Sport", "Club Management"],
    client: "Sports & Fitness Centers",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#22d3ee",
    screenLabels: ["City Padel – Home", "City Padel – Prenota", "City Padel – Maestri"],
  },

  healthcare: {
    name: "Healthcare & Medical",
    description: "Piattaforme per cliniche, studi medici e centri diagnostici con telemedicina e cartelle digitali.",
    tags: ["Healthcare", "Medical", "Telemedicine"],
    client: "Medical Solutions Group",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#60a5fa",
    screenLabels: ["FAR Medical – Home", "FAR Medical – Services", "FAR Medical – Products"],
  },

  veterinary: {
    name: "Veterinary & Pet Care",
    description: "Piattaforme per cliniche veterinarie e pet resort con profili animali, videocamere live e booking.",
    tags: ["Veterinary", "Pet Care", "Booking"],
    client: "Aloha Pet Resorts Inc.",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#4ade80",
    screenLabels: ["Aloha Pets – Home", "Aloha Pets – Services", "Aloha Pets – Detail"],
  },

  childcare: {
    name: "Childcare & Nursery",
    description: "Piattaforme per asili nido e centri per l'infanzia con programmi educativi e comunicazione genitori.",
    tags: ["Childcare", "Education", "Family"],
    client: "Premium Nursery Brands",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#fb923c",
    screenLabels: [
      "Little Diamond – Home", "Little Diamond – Programs", "Little Diamond – Team",
      "Ashley's Playhouse – Home", "Ashley's Playhouse – Programs", "Ashley's Playhouse – Book",
    ],
    subProjects: [
      {
        name: "Little Diamond Nursery",
        description: "Playful and colorful nursery platform with daily updates, photo sharing and parent portal.",
        tags: ["Nursery", "Colorful", "Family"],
        accent: "#f97316",
        screenLabels: ["Home", "Programs", "Team"],
        imageRange: [0, 2],
      },
      {
        name: "Ashley's Playhouse",
        description: "Modern playhouse booking with activity programs, birthday parties and enrichment classes.",
        tags: ["Playhouse", "Activities", "Kids"],
        accent: "#a855f7",
        screenLabels: ["Home", "Programs", "Book"],
        imageRange: [3, 5],
      },
    ],
  },

  plumber: {
    name: "Plumbing & HVAC",
    description: "Piattaforme per idraulici e tecnici HVAC con richieste di intervento, preventivi e tracking.",
    tags: ["Plumbing", "HVAC", "Service"],
    client: "Nick's Plumbing & AC",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#3b82f6",
    screenLabels: ["Nick's Plumbing – Home", "Nick's Plumbing – Services", "Nick's Plumbing – Detail"],
  },

  beach: {
    name: "Beach & Watersports",
    description: "Piattaforme per lidi balneari e centri watersport con mappa spiaggia, prenotazioni e servizi extra.",
    tags: ["Beach", "Watersports", "Resort"],
    client: "Miami Watersports Co.",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#06b6d4",
    screenLabels: ["Miami Watersports – Home", "Miami Watersports – Activities", "Miami Watersports – Detail"],
  },

  retail: {
    name: "Retail & E-Commerce",
    description: "Piattaforme e-commerce per negozi con catalogo prodotti, carrello e gestione ordini.",
    tags: ["Retail", "E-Commerce", "Shopping"],
    client: "Premium Retail Brand",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#8b5cf6",
    screenLabels: ["Store – Home", "Store – Detail"],
  },

  electrician: {
    name: "Electrician Services",
    description: "Piattaforme per elettricisti con gestione interventi, preventivi automatici e domotica.",
    tags: ["Electrical", "Home Automation", "Service"],
    client: "Elite Electrical Co.",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#eab308",
    screenLabels: ["Electrician – Home", "Electrician – Detail"],
  },

  agriturismo: {
    name: "Agriturismo & Country",
    description: "Piattaforme per agriturismi con prenotazioni camere, attività ed esperienze enogastronomiche.",
    tags: ["Agriturismo", "Country", "Farm Stay"],
    client: "Tuscan Country Estate",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#84cc16",
    screenLabels: ["Agriturismo – Home", "Agriturismo – Activities"],
  },

  cleaning: {
    name: "Cleaning Services",
    description: "Piattaforme per imprese di pulizia con booking istantaneo, pricing trasparente e gestione team.",
    tags: ["Cleaning", "Home Service", "Booking"],
    client: "Premium Clean Co.",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#06b6d4",
    screenLabels: ["Cleaning – Home", "Cleaning – Booking"],
  },

  legal: {
    name: "Legal & Law Firm",
    description: "Piattaforme per studi legali con gestione casi, consultazioni online e document management.",
    tags: ["Legal", "Law Firm", "Consulting"],
    client: "Studio Legale Associato",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#78716c",
    screenLabels: ["Legal – Home", "Legal – Case"],
  },

  accounting: {
    name: "Accounting & Finance",
    description: "Piattaforme per commercialisti con fatturazione, dichiarazioni e consulenza fiscale digitale.",
    tags: ["Accounting", "Finance", "Tax"],
    client: "Studio Commercialista Pro",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#14b8a6",
    screenLabels: ["Accounting – Home", "Accounting – Invoice"],
  },

  garage: {
    name: "Auto Garage & Service",
    description: "Piattaforme per officine meccaniche con prenotazioni tagliandi, tracking riparazioni e preventivi.",
    tags: ["Auto Repair", "Garage", "Service"],
    client: "Speed Auto Service",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#ef4444",
    screenLabels: ["Garage – Home", "Garage – Detail"],
  },

  photography: {
    name: "Photography Studio",
    description: "Piattaforme per fotografi con portfolio, booking sessioni e gallerie private per clienti.",
    tags: ["Photography", "Portfolio", "Creative"],
    client: "Vision Photography Studio",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#a855f7",
    screenLabels: ["Photography – Home", "Photography – Gallery"],
  },

  construction: {
    name: "Construction & Building",
    description: "Piattaforme per imprese edili con gestione cantieri, timeline progetti e preventivi.",
    tags: ["Construction", "Building", "Project Management"],
    client: "Premium Costruzioni Srl",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#f97316",
    screenLabels: ["Construction – Home", "Construction – Timeline"],
  },

  gardening: {
    name: "Gardening & Landscaping",
    description: "Piattaforme per giardinieri con portfolio progetti, preventivi e manutenzione programmata.",
    tags: ["Gardening", "Landscaping", "Green"],
    client: "Verde & Giardini",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#22c55e",
    screenLabels: ["Gardening – Home", "Gardening – Project"],
  },

  tattoo: {
    name: "Tattoo Studio",
    description: "Piattaforme per studi tattoo con portfolio artisti, booking e gallery personalizzata.",
    tags: ["Tattoo", "Body Art", "Creative"],
    client: "Ink Masters Studio",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#ef4444",
    screenLabels: ["Tattoo – Home", "Tattoo – Artist"],
  },

  education: {
    name: "Education & Training",
    description: "Piattaforme per scuole e centri formazione con corsi, iscrizioni online e e-learning.",
    tags: ["Education", "E-Learning", "Training"],
    client: "Academy Pro Institute",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#3b82f6",
    screenLabels: ["Education – Home", "Education – Course"],
  },

  events: {
    name: "Events & Entertainment",
    description: "Piattaforme per organizzazione eventi con ticketing, seating e gestione fornitori.",
    tags: ["Events", "Entertainment", "Booking"],
    client: "Elite Events Agency",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#ec4899",
    screenLabels: ["Events – Home", "Events – Detail"],
  },

  logistics: {
    name: "Logistics & Delivery",
    description: "Piattaforme logistiche con tracking spedizioni, gestione magazzino e ottimizzazione rotte.",
    tags: ["Logistics", "Delivery", "Tracking"],
    client: "FastTrack Logistics",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#64748b",
    screenLabels: ["Logistics – Home", "Logistics – Tracking"],
  },

  hospitality: {
    name: "Hospitality & Hotel",
    description: "Piattaforme per hotel e resort con prenotazioni, concierge digitale e guest experience.",
    tags: ["Hotel", "Hospitality", "Resort"],
    client: "MMI Resident Hub",
    year: "2025",
    platform: "iOS, Android & Web",
    accent: "#c9a84c",
    screenLabels: ["Hotel – Dashboard"],
  },
};
