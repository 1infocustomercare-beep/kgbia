/**
 * Unified sector → variants registry for the premium mockup showcase.
 *
 * Each variant now exposes a full COHERENT SCREEN SEQUENCE
 * (Home → Menu → Dettaglio → Prenotazione) built from the AI-generated
 * companion PNGs that share the hero's palette/typography.
 *
 * ADDITIVE: does not remove or alter the legacy registries.
 */

// Hero PNGs (screen 1 — Home)
import foodOnyxObsidian from "@/assets/mockups/catalog/food-onyx-obsidian.png";
import foodOnyxIvory from "@/assets/mockups/catalog/food-onyx-ivory.png";
import foodSakuraSakura from "@/assets/mockups/catalog/food-sakura-sakura.png";
import foodSakuraLuxuryDark from "@/assets/mockups/catalog/food-sakura-luxury-dark.png";
import foodIndocinaNeonSpice from "@/assets/mockups/catalog/food-indocina-neon-spice.png";
import foodPacificoCosta from "@/assets/mockups/catalog/food-pacifico-costa.png";
import foodLevanteDeli from "@/assets/mockups/catalog/food-levante-deli.png";
import foodBraceKebab from "@/assets/mockups/catalog/food-brace-kebab.png";
import beautyAuroraLavender from "@/assets/mockups/catalog/beauty-aurora-lavender.png";
import beautyAuroraBlushRosegold from "@/assets/mockups/catalog/beauty-aurora-blush-rosegold.png";
import beautyVellutoEditorial from "@/assets/mockups/catalog/beauty-velluto-editorial.png";
import beautyNailLavenderV2 from "@/assets/mockups/catalog/beauty-nail-lavender-v2--1-home.png";
import beautyHairNoir from "@/assets/mockups/catalog/beauty-hair-noir--1-home.png";
import beautyBarberIndustrial from "@/assets/mockups/catalog/beauty-barber-industrial--1-home.png";
import beautyMedspaClinical from "@/assets/mockups/catalog/beauty-medspa-clinical--1-home.png";
import nccMarinaRiviera from "@/assets/mockups/catalog/ncc-marina-riviera.png";
import nccMarinaAmalfiStyleB from "@/assets/mockups/catalog/ncc-marina-amalfi-style-b.png";
import fitnessPadelSage from "@/assets/mockups/catalog/fitness-padel-sage.png";
import fitnessOndaAqua from "@/assets/mockups/catalog/fitness-onda-aqua.png";
import hospitalityCalaVentoAzure from "@/assets/mockups/catalog/hospitality-cala-vento-azure.png";
import hospitalityCalaVentoSunset from "@/assets/mockups/catalog/hospitality-cala-vento-sunset.png";
import healthcareLumenGlass from "@/assets/mockups/catalog/healthcare-lumen-glass.png";
import veterinaryTropicoResort from "@/assets/mockups/catalog/veterinary-tropico-resort.png";
import childcareArcobalenoBauhaus from "@/assets/mockups/catalog/childcare-arcobaleno-bauhaus.png";
import childcareStellePlayful from "@/assets/mockups/catalog/childcare-stelle-playful.png";
import constructionDomusOceanAzure from "@/assets/mockups/catalog/construction-domus-ocean-azure.png";
import constructionDomusLivingCoral from "@/assets/mockups/catalog/construction-domus-living-coral.png";
import constructionDomusIceBlue from "@/assets/mockups/catalog/construction-domus-ice-blue.png";
import constructionDomusRoseGold from "@/assets/mockups/catalog/construction-domus-rose-gold.png";
import plumberIdroProntoStyleA from "@/assets/mockups/catalog/plumber-idro-pronto-style-a.png";
import plumberIdroProntoStyleB from "@/assets/mockups/catalog/plumber-idro-pronto-style-b.png";
...
  {
    id: "beauty",
    label: "Beauty & Salone",
    tagline: "Agenda, trattamenti, schede cliente, pacchetti VIP e rebooking.",
    variants: [
      V("beauty", "beauty-nail-lavender-v2", "Atelier Unghie", "Lavender Editorial II", "Lavanda · Avorio",
        "Nail atelier editoriale con listino premium, manicure lounge e prenotazione raffinata.",
        ["Listino manicure", "Nail art gallery", "Cabine beauty", "Prenotazione smart"],
        beautyNailLavenderV2, "beauty-nail-lavender-v2"),
      V("beauty", "beauty-hair-noir", "Velluto Hair Lab", "Noir Salon", "Nero · Champagne",
        "Hair salon fashion con lookbook, color service, stylist agenda e retail curato.",
        ["Color service", "Lookbook capelli", "Stylist agenda", "Retail premium"],
        beautyHairNoir, "beauty-hair-noir"),
      V("beauty", "beauty-barber-industrial", "Officina Barber Club", "Industrial Grooming", "Grafite · Rame",
        "Barber studio maschile con grooming menu, barber profile, combo e booking rapido.",
        ["Taglio & barba", "Combo grooming", "Barber profile", "Slot express"],
        beautyBarberIndustrial, "beauty-barber-industrial"),
      V("beauty", "beauty-medspa-clinical", "Lumen MedSpa", "Clinical Glass", "Ghiaccio · Teal",
        "MedSpa clinico con consulti estetici, trattamenti medicali e prenotazione consulto senza impegno.",
        ["Consulti medici", "Botox & filler", "Before/after", "Booking clinico"],
        beautyMedspaClinical, "beauty-medspa-clinical"),
      V("beauty", "beauty-aurora-lavender", "Atelier Unghie", "Lavender Luxe", "Lavanda · Oro",
        "Nail atelier soft luxury con menu trattamenti, cabine e schede cliente VIP.",
        ["Menu nail", "Cabine live", "Scheda VIP", "Rebooking auto"],
        beautyAuroraLavender, "beauty-aurora-lavender"),
      V("beauty", "beauty-aurora-blush", "Aurora Nail", "Blush Rosegold", "Blush · Oro rosa",
        "Nail luxury con pacchetti sposa, add-on premium e loyalty punti.",
        ["Pacchetti sposa", "Add-on premium", "Loyalty punti", "Gallery lavori"],
        beautyAuroraBlushRosegold, "beauty-aurora-blush-rosegold"),
      V("beauty", "beauty-velluto-editorial", "Velluto Hair Lab", "Editorial Hair", "Nero · Bordeaux",
        "Hair salon editoriale: colore, agenda stylist, retail prodotti, look book.",
        ["Servizi colore", "Agenda stylist", "Retail prodotti", "Look book"],
        beautyVellutoEditorial, "beauty-velluto-editorial"),
      // Remix: same premium PNGs applied as SPA and Make-up studios for more choice
      V("beauty", "beauty-spa-lumen", "Spa Lumen", "Ethereal Spa", "Ghiaccio · Perla",
        "Day spa etereo: rituali, cabine, wellness journey e pacchetti coppia.",
        ["Rituali firmati", "Cabine spa", "Journey coppia", "Retail wellness"],
        healthcareLumenGlass, "healthcare-lumen-glass"),
    ],
  }
  {
    id: "ncc",
    label: "NCC · Charter · Yacht",
    tagline: "Flotta, preventivi rapidi, itinerari, booking e concierge.",
    variants: [
      V("ncc", "ncc-marina-riviera", "Marina Riviera", "Riviera Blue", "Blu · Bianco",
        "NCC costiero con flotta, itinerari mappati, preventivo istantaneo.",
        ["Flotta live", "Itinerari mappa", "Preventivo istante", "Concierge chat"],
        nccMarinaRiviera, "ncc-marina-riviera"),
      V("ncc", "ncc-marina-amalfi", "Marina Amalfi", "Amalfi Sunset", "Ambra · Bianco",
        "Charter luxury Amalfi: tour privati, chef a bordo, sunset experience.",
        ["Tour privati", "Chef a bordo", "Sunset packages", "Booking flessibile"],
        nccMarinaAmalfiStyleB, "ncc-marina-amalfi-style-b"),
      V("ncc", "ncc-cala-azure", "Cala Vento Charter", "Emerald Cove", "Smeraldo · Sabbia",
        "Yacht charter Sardegna con calette, day cruise, transfer VIP porto.",
        ["Calette curate", "Day cruise", "Transfer VIP", "Skipper included"],
        hospitalityCalaVentoAzure, "hospitality-cala-vento-azure"),
      V("ncc", "ncc-cala-sunset", "Cala Vento Golden", "Golden Sunset", "Oro · Corallo",
        "Yacht sunset experience: aperitivo a bordo, tramonti, pacchetti coppia.",
        ["Aperitivo bordo", "Tramonti curati", "Pacchetti coppia", "Foto pro"],
        hospitalityCalaVentoSunset, "hospitality-cala-vento-sunset"),
    ],
  },
  {
    id: "hospitality",
    label: "Hotel & Hospitality",
    tagline: "Camere, esperienze, concierge, upsell escursioni e prenotazioni.",
    variants: [
      V("hospitality", "hosp-cala-azure", "Cala Vento Resort", "Sardinia Azure", "Azzurro · Sabbia",
        "Boutique resort: camere, esperienze curate, concierge chat, upsell tour.",
        ["Camere & suite", "Esperienze curate", "Concierge chat", "Upsell tour"],
        hospitalityCalaVentoAzure, "hospitality-cala-vento-azure"),
      V("hospitality", "hosp-cala-sunset", "Cala Vento Suite", "Sunset Suite", "Oro · Ambra",
        "Suite sunset: pacchetti romantic, spa in camera, cena privata a bordo mare.",
        ["Pacchetti romantic", "Spa in camera", "Cena privata", "Sunset ritual"],
        hospitalityCalaVentoSunset, "hospitality-cala-vento-sunset"),
      V("hospitality", "hosp-levante", "Levante Boutique", "Pearl Gold Retreat", "Perla · Oro",
        "Boutique urbano: suite curate, gastronomia interna, esperienze private.",
        ["Suite curate", "Ristorante interno", "Esperienze private", "Concierge"],
        foodLevanteDeli, "food-levante-deli"),
    ],
  },
  {
    id: "fitness",
    label: "Fitness · Padel · Sport",
    tagline: "Corsi, prenotazioni campi, abbonamenti, coach e schede attività.",
    variants: [
      V("fitness", "fit-padel-sage", "Centro Padel Brera", "Sage Luxe", "Salvia · Oro",
        "Padel club premium: prenotazione campi, tornei, coach privati, ranking.",
        ["Prenotazione campi", "Tornei live", "Coach privati", "Ranking club"],
        fitnessPadelSage, "fitness-padel-sage"),
      V("fitness", "fit-onda-aqua", "Onda Sport Club", "Fresh Azzurro", "Azzurro · Bianco",
        "Palestra multi-sport con classi, abbonamenti, schede coach e progressi.",
        ["Classi settimana", "Abbonamenti", "Schede coach", "Progressi live"],
        fitnessOndaAqua, "fitness-onda-aqua"),
    ],
  },
  {
    id: "healthcare",
    label: "Studi medici & Cliniche",
    tagline: "Agenda visite, prestazioni, cartella paziente e pagamenti.",
    variants: [
      V("healthcare", "health-lumen", "Lumen Clinic", "Ethereal Glass", "Ghiaccio · Blu",
        "Poliambulatorio pulito: prestazioni, prenotazione visite, cartella paziente.",
        ["Prestazioni", "Prenota visita", "Cartella paziente", "Pagamenti online"],
        healthcareLumenGlass, "healthcare-lumen-glass"),
    ],
  },
  {
    id: "veterinary",
    label: "Veterinaria & Pet",
    tagline: "Servizi pet, prenotazioni, profili animali e pet resort.",
    variants: [
      V("veterinary", "vet-tropico", "Tropico Pet Resort", "Tropico Resort", "Verde · Corallo",
        "Pet resort completo: pensione, servizi cliniche, profili pet, foto giornaliere.",
        ["Pensione booking", "Servizi clinica", "Profilo pet", "Foto giornata"],
        veterinaryTropicoResort, "veterinary-tropico-resort"),
    ],
  },
  {
    id: "childcare",
    label: "Nido & Nursery",
    tagline: "Iscrizioni, attività, pasti, team e comunicazioni famiglie.",
    variants: [
      V("childcare", "child-stelle", "Piccole Stelle Nursery", "Playful Colorful", "Corallo · Ocra",
        "Nursery giocosa: programmi settimanali, pasti, foto giornata, chat genitori.",
        ["Programma settimana", "Menu pasti", "Foto giornata", "Chat genitori"],
        childcareStellePlayful, "childcare-stelle-playful"),
      V("childcare", "child-arcobaleno", "Arcobaleno Playhouse", "Bauhaus Play", "Primari · Bianco",
        "Playhouse Bauhaus: attività, iscrizioni online, calendario, team educatori.",
        ["Attività settimana", "Iscrizioni online", "Calendario", "Team educatori"],
        childcareArcobalenoBauhaus, "childcare-arcobaleno-bauhaus"),
    ],
  },
  {
    id: "construction",
    label: "Edilizia & Real Estate",
    tagline: "Cantieri, unità, manutenzioni, community e dashboard operativa.",
    variants: [
      V("construction", "cons-ocean", "Domus Living", "Ocean Azure", "Blu · Bianco",
        "Real estate luxury: unità, tour 3D, prenota visita, dashboard cantieri.",
        ["Unità disponibili", "Tour 3D", "Prenota visita", "Dashboard cantieri"],
        constructionDomusOceanAzure, "construction-domus-ocean-azure"),
      V("construction", "cons-coral", "Domus Living Coral", "Living Coral", "Corallo · Sabbia",
        "Community residenti: manutenzioni, servizi condominio, prenota amenità.",
        ["Manutenzioni", "Servizi condominio", "Prenota amenità", "Bacheca residenti"],
        constructionDomusLivingCoral, "construction-domus-living-coral"),
      V("construction", "cons-ice", "Domus Ice", "Ice Blue", "Ghiaccio · Bianco",
        "Facility manager: ticket, calendario interventi, mezzi e squadre live.",
        ["Ticket sistem", "Calendario interventi", "Mezzi & squadre", "Report cliente"],
        constructionDomusIceBlue, "construction-domus-ice-blue"),
      V("construction", "cons-rose", "Domus Rose Gold", "Rose Gold", "Rosa · Oro",
        "Sales office real estate: lead in ingresso, scheda unità, offerte, follow-up.",
        ["Lead ingresso", "Scheda unità", "Offerte", "Follow-up auto"],
        constructionDomusRoseGold, "construction-domus-rose-gold"),
    ],
  },
  {
    id: "plumber",
    label: "Artigiani & Servizi tecnici",
    tagline: "Interventi urgenti, preventivi rapidi, agenda squadre.",
    variants: [
      V("plumber", "plumber-a", "Idro Pronto", "Rescue Blue", "Blu · Bianco",
        "Idraulica pronto intervento: chiamata rapida, preventivo, geolocalizzazione.",
        ["Chiamata rapida", "Preventivo", "Geolocalizzazione", "Storico interventi"],
        plumberIdroProntoStyleA, "plumber-idro-pronto-style-a"),
      V("plumber", "plumber-b", "Idro Pronto Pro", "Bold Orange", "Arancio · Nero",
        "Squadra tecnica: agenda interventi, foto pre/post, firma cliente, fatturazione.",
        ["Agenda squadra", "Foto pre/post", "Firma cliente", "Fatturazione"],
        plumberIdroProntoStyleB, "plumber-idro-pronto-style-b"),
    ],
  },
];

/** Lookup a sector group by id. */
export function getSectorGroup(id: string): SectorMockupGroup | undefined {
  return SECTOR_MOCKUPS.find((g) => g.id === id);
}

/** Flat list of all variants across sectors — useful for portfolio grids. */
export function allMockupVariants(): (SectorMockupVariant & { sectorId: string; sectorLabel: string })[] {
  return SECTOR_MOCKUPS.flatMap((g) =>
    g.variants.map((v) => ({ ...v, sectorId: g.id, sectorLabel: g.label })),
  );
}
