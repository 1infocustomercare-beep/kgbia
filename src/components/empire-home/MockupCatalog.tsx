import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Monitor, Smartphone, Sparkles } from "lucide-react";
import { SECTOR_PORTFOLIO, type SectorPortfolio } from "@/data/sector-mockup-images";
import type { IndustryId } from "@/config/industry-config";
import { MockupReactScreen, type ColorStyle } from "@/components/partner/MockupReactScreen";
import { catalogMockupUrl } from "@/data/catalog-mockup-registry";

type CatalogItem = {
  id: string;
  sectorId: IndustryId;
  sectorLabel: string;
  brand: string;
  style: string;
  thumbnail: string;
  aiHero: string | null;
  screens: string[];
  desktopScreens?: string[];
  description: string;
};

const SECTOR_COPY: Partial<Record<IndustryId, string>> = {
  food: "Menu, ordini, prenotazioni, carrello e pagamenti per ristoranti, pizzerie, sushi e locali premium.",
  beauty: "Servizi, trattamenti, agenda, pacchetti e schede cliente per saloni, spa, nail studio e centri estetici.",
  ncc: "Flotta, preventivi, itinerari, booking e richieste rapide per NCC, charter, yacht e trasporti premium.",
  veterinary: "Servizi, pet resort, prenotazioni e profili animali per cliniche veterinarie e strutture pet care.",
  childcare: "Programmi, attività, team, pasti e iscrizioni per asili, nursery e servizi dedicati alle famiglie.",
  fitness: "Corsi, prenotazioni, coach, abbonamenti e schede attività per palestre, padel e centri sportivi.",
  healthcare: "Servizi, agenda, richieste paziente e percorsi clinici per studi medici e strutture sanitarie.",
  construction: "Dashboard, cantieri, unità, manutenzioni e community per edilizia, real estate e facility.",
  hospitality: "Esperienze, camere, escursioni, concierge e prenotazioni per hotel, resort e hospitality.",
  plumber: "Servizi, interventi, preventivi e booking urgente per artigiani e imprese tecniche.",
  retail: "Vetrina, shop, dettaglio prodotto e carrello per retail, profumerie, fashion e negozi verticali.",
  beach: "Attività, prenotazioni, pacchetti e vendita esperienze per stabilimenti balneari e watersport.",
};

const descriptionFor = (sectorId: IndustryId, brand: string, style: string): string => {
  const key = `${sectorId} ${brand} ${style}`.toLowerCase();

  if (sectorId === "food") {
    if (/onyx|steak|brace|joseon|obsidian|hanok|gangnam/.test(key)) {
      return "Steakhouse premium: tagli signature, carta vini, prenotazione tavoli, upsell degustazione e KDS cucina coerenti con il visual luxury del brand.";
    }
    if (/sakura|sushi|omakase|tsukiji|hinoki|wabi/.test(key)) {
      return "Sushi e omakase: menu degustazione, sashimi bar, prenotazioni a turni, sake pairing e percorso cliente elegante in stile Japanese luxury.";
    }
    if (/indocina|saigon|jade|silk|spice|matcha/.test(key)) {
      return "Asian fusion: piatti signature, cocktail pairing, booking serale, gestione allergeni e ordine premium con estetica noir esotica.";
    }
    if (/pacifico|ceviche|costa|lima|seafood|ocean/.test(key)) {
      return "Seafood e ceviche bar: crudi, daily catch, tavoli vista mare, cocktail e checkout rapido con interfacce fresche e costiere.";
    }
    if (/kebab/.test(key)) {
      return "Grill e street food: menu combo, delivery, zone di consegna, carrello veloce e offerte pranzo con identità calda e urbana.";
    }
    if (/pizza|forno|casa/.test(key)) {
      return "Pizzeria e forno: impasti, extra topping, asporto, delivery, tavoli e ordini cucina in uno stile editoriale italiano coerente.";
    }
    return "Ristorazione premium: vetrina, menu, tavoli, ordini, loyalty e cucina sincronizzata con interfacce coerenti al concept del locale.";
  }

  if (sectorId === "beauty") {
    if (/hair|velluto|color|balayage/.test(key)) {
      return "Hair salon: servizi colore, agenda stylist, retail prodotti, scheda cliente e rebooking automatico con immagine editoriale beauty.";
    }
    return "Nail, spa e beauty atelier: trattamenti, cabine, agenda staff, pacchetti VIP e schede cliente in un linguaggio soft luxury coerente.";
  }

  if (sectorId === "ncc") {
    if (/cala|charter|yacht|marina|vento|azure|emerald|sunset/.test(key)) {
      return "Charter e yacht: flotta, rotte, skipper, depositi, booking esperienze e upsell mare con dashboard premium da concierge nautico.";
    }
    return "NCC e transfer executive: flotta, tratte, flight tracking, preventivo istantaneo, driver assegnato e fatturazione B2B.";
  }

  if (sectorId === "healthcare") return "Clinica e studio medico: prestazioni, agenda medici, triage, consenso privacy, richiami e scheda paziente ad alto contrasto.";
  if (sectorId === "fitness") return "Padel, gym e sport club: campi/classi, coach, membership, calendario slot, progressi e conversione trial in stile energy premium.";
  if (sectorId === "construction") return "Edilizia e real estate: SAL, unità, ticket manutenzione, documenti, pianificazione squadre e area cliente con precisione blueprint.";
  if (sectorId === "plumber") return "Servizi tecnici: SOS, interventi, tecnico disponibile, ricambi, preventivi e SLA in una UI operativa chiara e pronta per WhatsApp.";
  if (sectorId === "veterinary") return "Veterinaria e pet care: visite, vaccini, pet resort, toeletta, schede animali e reminder proprietario con tono caldo e affidabile.";
  if (sectorId === "childcare") return "Asilo e famiglie: programmi, attività, diario genitori, mensa, team, tour e iscrizioni con visual rassicurante e giocoso.";
  if (sectorId === "hospitality") {
    if (/cala|charter|yacht|vento|marina|azure|sunset|emerald/.test(key)) {
      return "Charter e hospitality nautica: yacht, rotte, skipper, deposito, esperienze in mare e booking premium con concierge dedicato.";
    }
    return "Hotel e resort: camere, esperienze, concierge, extra, direct booking e profilo ospite in un percorso cinematico da hospitality premium.";
  }
  if (sectorId === "retail") return "Retail e boutique: vetrina drop, catalogo, varianti prodotto, carrello, CRM VIP e recupero checkout con look e-commerce premium.";
  if (sectorId === "beach") return "Beach club e watersport: mappa ombrelloni, cabane, attività, pass, upgrade e prenotazioni live con estetica resort costiera.";

  return SECTOR_COPY[sectorId] ?? "Mockup settoriale con schermate operative per presentare servizi, contenuti, conversione e gestione clienti.";
};

const flattenPortfolio = (portfolio: SectorPortfolio[]): CatalogItem[] =>
  portfolio.flatMap((sector) =>
    sector.brands.flatMap((brand) =>
      brand.styles.map((style, index) => {
        // Prefer premium AI-generated hero when available, else fall back to SVG cover.
        const aiHero = catalogMockupUrl(sector.sectorId, brand.name, style.name);
        const thumbnail = aiHero ?? style.thumbnail;
        // When we have an AI hero, use it as the FIRST screen too so the expanded
        // card leads with the premium artwork.
        const screens = aiHero
          ? [aiHero, ...style.screens.slice(1)]
          : style.screens;
        return {
          id: `${sector.sectorId}-${brand.name}-${style.name}-${index}`,
          sectorId: sector.sectorId,
          sectorLabel: sector.sectorLabel,
          brand: brand.name,
          style: style.name,
          thumbnail,
          aiHero: aiHero ?? null,
          screens,
          desktopScreens: style.desktopScreens,
          description: descriptionFor(sector.sectorId, brand.name, style.name),
        };
      })
    )
  );

const interleaveBySector = (items: CatalogItem[]): CatalogItem[] => {
  const buckets = new Map<IndustryId, CatalogItem[]>();
  items.forEach((item) => buckets.set(item.sectorId, [...(buckets.get(item.sectorId) ?? []), item]));
  const sectors = Array.from(buckets.keys());
  const out: CatalogItem[] = [];
  let index = 0;
  while (out.length < items.length) {
    let added = false;
    sectors.forEach((sectorId) => {
      const item = buckets.get(sectorId)?.[index];
      if (item) {
        out.push(item);
        added = true;
      }
    });
    if (!added) break;
    index += 1;
  }
  return out;
};

// Slug helper (must match the registry's slug)
const heroSlug = (v: string) => v.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/**
 * HERO_MATCH — exact (sector::brand::style) → { template, primary } lookup
 * Ensures the side "live" MockupReactScreen phones share the same vibe/palette
 * as the AI hero PNG shown in the center, so the whole card reads as ONE brand.
 */
type HeroMatch = { template: string; primary?: string; colorStyle?: ColorStyle; cue?: string };
const HERO_MATCH: Record<string, HeroMatch> = {
  // FOOD — Onyx Brace Steakhouse
  "food::onyx-brace-steakhouse::obsidian":       { template: "luxury_gold",     primary: "#C9A24A" },
  "food::onyx-brace-steakhouse::ivory":          { template: "editorial_clean", primary: "#B08A54" },
  "food::onyx-brace-steakhouse::hanok":          { template: "paperfish",       primary: "#E88AA8" },
  "food::onyx-brace-steakhouse::gangnam":        { template: "neon_vibrant",    primary: "#FF3D8B" },
  "food::onyx-brace-steakhouse::joseon":         { template: "luxury_gold",     primary: "#8B5E3C" },
  // FOOD — Sakura Atelier
  "food::sakura-atelier::sakura":                { template: "paperfish",       primary: "#E88AA8" },
  "food::sakura-atelier::luxury-dark":           { template: "luxury_gold",     primary: "#C9A24A" },
  "food::sakura-atelier::white-clean":           { template: "editorial_clean", primary: "#2D2D2D" },
  "food::sakura-atelier::miami-ocean":           { template: "beach_resort",   primary: "#00A5C8" },
  "food::sakura-atelier::pearl-gold":            { template: "luxury_gold",     primary: "#D4B45A" },
  "food::sakura-atelier::marble-zen":            { template: "minimal_zen",     primary: "#B98A5C" },
  "food::sakura-atelier::champagne-rose":        { template: "boutique_pastel", primary: "#D9A8B6" },
  "food::sakura-atelier::arctic-crystal":        { template: "clinical_clean",  primary: "#7FC6D9" },
  "food::sakura-atelier::tsukiji-ice":           { template: "paperfish",       primary: "#5FA8C7" },
  "food::sakura-atelier::sakura-garden":         { template: "pet_care_playful",primary: "#F0A8B8" },
  "food::sakura-atelier::wabi-sabi-marble":      { template: "editorial_clean", primary: "#8B7355" },
  "food::sakura-atelier::hinoki-frost":          { template: "hospitality_sunset", primary: "#7FA8C7" },
  // FOOD — Indocina Noir
  "food::indocina-noir::noir-saigon":            { template: "luxury_gold",     primary: "#C9A24A" },
  "food::indocina-noir::jade-dynasty":           { template: "luxury_gold",     primary: "#3F8F72" },
  "food::indocina-noir::crimson-silk":           { template: "casual_warm",     primary: "#B23A3A" },
  "food::indocina-noir::golden-hour":            { template: "hospitality_sunset", primary: "#FF9F6E" },
  "food::indocina-noir::neon-spice":             { template: "neon_vibrant",    primary: "#FF3D8B" },
  "food::indocina-noir::matcha-blaze":           { template: "fitness_energy",  primary: "#8FBC5A" },
  "food::indocina-noir::obsidian-gold":          { template: "luxury_gold",     primary: "#C9A24A" },
  // FOOD — Pacifico Ceviche
  "food::pacifico-ceviche::costa-pacifico":      { template: "beach_resort",    primary: "#00A5C8" },
  "food::pacifico-ceviche::casa-nostra":         { template: "editorial_clean", primary: "#B08A54" },
  "food::pacifico-ceviche::bianco-memoria":      { template: "paperfish",       primary: "#E88AA8" },
  "food::pacifico-ceviche::ocra-lima":           { template: "casual_warm",     primary: "#D48A3C" },
  // FOOD — Levante Deli
  "food::levante-deli::style-a":                 { template: "casual_warm",     primary: "#D48A3C" },
  "food::levante-deli::style-b":                 { template: "beach_resort",    primary: "#00A5C8" },
  "food::levante-deli::style-c":                 { template: "paperfish",       primary: "#E88AA8" },
  "food::levante-deli::style-d":                 { template: "editorial_clean", primary: "#B08A54" },
  "food::levante-deli::style-e":                 { template: "hospitality_sunset", primary: "#FF9F6E" },
  "food::levante-deli::style-f":                 { template: "boutique_pastel", primary: "#D9A8B6" },
  "food::levante-deli::style-h":                 { template: "neon_vibrant",    primary: "#FF3D8B" },
  // FOOD — Brace Kebab
  "food::brace-kebab::default":                  { template: "casual_warm",     primary: "#C9662B" },
  // BEAUTY — Aurora Nail Atelier
  "beauty::aurora-nail-atelier::lavender-luxe":  { template: "boutique_pastel", primary: "#A89DC9" },
  "beauty::aurora-nail-atelier::blush-rosegold": { template: "boutique_pastel", primary: "#E8A0B8" },
  // BEAUTY — Velluto Hair Lab
  "beauty::velluto-hair-lab::mobile":            { template: "boutique_pastel", primary: "#E8A0B8" },
  "beauty::velluto-hair-lab::desktop":           { template: "boutique_pastel", primary: "#A89DC9" },
  // NCC
  "ncc::marina-riviera::style-a":                { template: "ncc_limo",        primary: "#5CC8D9" },
  "ncc::marina-riviera::style-c":                { template: "ncc_limo",        primary: "#4A7FB3" },
  "ncc::marina-riviera::style-f":                { template: "hospitality_sunset", primary: "#FF9F6E" },
  "ncc::marina-riviera::style-g":                { template: "batey",           primary: "#5CC8D9" },
  "ncc::marina-riviera::style-h":                { template: "ncc_limo",        primary: "#5CC8D9" },
  "ncc::cala-vento-charter::emerald-cove":       { template: "batey",           primary: "#2FA98A" },
  "ncc::cala-vento-charter::golden-sunset":      { template: "hospitality_sunset", primary: "#FF9F6E" },
  "ncc::cala-vento-charter::sardinia-azure-desktop": { template: "batey",       primary: "#00A5C8" },
  "ncc::cala-vento-charter::emerald-cove-desktop":   { template: "hospitality_sunset", primary: "#FF9F6E" },
  // VETERINARY
  "veterinary::tropico-pet-resort::style-a":     { template: "pet_care_playful",primary: "#7C9A4B" },
  "veterinary::tropico-pet-resort::style-e":     { template: "childcare_sunshine", primary: "#FF8B3D" },
  "veterinary::tropico-pet-resort::style-f":     { template: "pet_care_playful",primary: "#7C9A4B" },
  // CHILDCARE
  "childcare::stelle-nursery::playful-colorful": { template: "childcare_sunshine", primary: "#FF8B3D" },
  "childcare::stelle-nursery::nature-explorer":  { template: "pet_care_playful",primary: "#7C9A4B" },
  "childcare::stelle-nursery::ocean-breeze":     { template: "beach_resort",    primary: "#57B7FF" },
  "childcare::stelle-nursery::sunny-garden":     { template: "childcare_sunshine", primary: "#F6C85F" },
  "childcare::stelle-nursery::sunset-playful":   { template: "hospitality_sunset", primary: "#FF9F6E" },
  "childcare::arcobaleno-playhouse::style-a":    { template: "childcare_sunshine", primary: "#FF8B3D" },
  // FITNESS
  "fitness::centro-padel-brera::sage-luxe":      { template: "fitness_energy",  primary: "#9CBF6A" },
  "fitness::centro-padel-brera::fresh-azzurro":  { template: "fitness_energy",  primary: "#00E5FF" },
  "fitness::onda-sport-club::wave-pro":          { template: "fitness_energy",  primary: "#00E5FF" },
  // HEALTHCARE
  "healthcare::lumen-clinic::ethereal-glass":    { template: "clinical_clean",  primary: "#7FC6D9" },
  "healthcare::lumen-clinic::azure-gradient":    { template: "batey",           primary: "#0EA5B7" },
  "healthcare::lumen-clinic::ice-crystal":       { template: "clinical_clean",  primary: "#9BD4E4" },
  "healthcare::lumen-clinic::soft-blue":         { template: "ncc_limo",        primary: "#5CC8D9" },
  // HOSPITALITY
  "hospitality::cala-vento-charter::sardinia-azure": { template: "batey",       primary: "#00A5C8" },
  "hospitality::cala-vento-charter::sunset-suite":   { template: "hospitality_sunset", primary: "#FF9F6E" },
  // CONSTRUCTION — Domus Living
  "construction::domus-living::ocean-azure":     { template: "construction_blueprint", primary: "#3F8FBF" },
  "construction::domus-living::living-coral":    { template: "construction_blueprint", primary: "#F07A5A" },
  "construction::domus-living::ice-blue":        { template: "construction_blueprint", primary: "#7FB8D4" },
  "construction::domus-living::rose-gold":       { template: "construction_blueprint", primary: "#D9A8B6" },
  // PLUMBER
  "plumber::idro-pronto::style-a":               { template: "plumber_utility", primary: "#26D9B8" },
  "plumber::idro-pronto::style-b":               { template: "plumber_utility", primary: "#2E9BD9" },
};

const heroMatchFor = (item: CatalogItem): HeroMatch | undefined =>
  HERO_MATCH[`${item.sectorId}::${heroSlug(item.brand)}::${heroSlug(item.style)}`];

const sectorCueFor = (item: CatalogItem): string => {
  const override = heroMatchFor(item)?.cue;
  if (override) return override;
  const name = `${item.sectorId} ${item.brand} ${item.style}`.toLowerCase();
  if (item.sectorId === "food") {
    if (/sakura|sushi|tsukiji|hinoki|omakase/.test(name)) return "food sushi omakase japanese tasting bar";
    if (/pizza|casa nostra|strapizzami|forno/.test(name)) return "food pizzeria forno delivery tavoli";
    if (/ceviche|pacifico|seafood|ocean|costa/.test(name)) return "food seafood ceviche beach club raw bar";
    if (/kebab/.test(name)) return "food kebab grill street food delivery";
    if (/onyx|steak|brace|joseon|obsidian|hanok|gangnam/.test(name)) return "food steakhouse fine dining grill wine cellar kds table booking";
    if (/indocina|saigon|jade|spice|matcha/.test(name)) return "food asian fusion vietnamese cocktail dining";
    return "food steakhouse fine dining wine cellar kitchen kds";
  }
  if (item.sectorId === "beauty") return /hair|velluto/.test(name) ? "beauty hair salon color balayage retail" : "beauty nail spa treatment agenda vip";
  if (item.sectorId === "ncc") return /cala|charter|yacht|marina|vento/.test(name) ? "ncc yacht charter marina boat skipper booking" : "ncc limousine driver airport corporate transfer";
  if (item.sectorId === "beach") return "beach lido ombrelloni cabana watersport pass";
  if (item.sectorId === "hospitality") return /cala|charter|yacht|vento|marina/.test(name)
    ? "ncc yacht charter marina boat skipper booking hospitality concierge"
    : "hospitality resort hotel suite concierge experiences direct booking";
  if (item.sectorId === "healthcare") return "healthcare medical clinic patient agenda referti privacy";
  if (item.sectorId === "fitness") return /padel/.test(name) ? "fitness padel club courts coaches membership" : "fitness gym classes coach progress membership";
  if (item.sectorId === "retail") return "retail fashion boutique ecommerce product variants checkout";
  if (item.sectorId === "construction") return "construction real estate cantiere sal units maintenance tickets";
  if (item.sectorId === "plumber") return "plumber idraulico ac emergency technician quote booking";
  if (item.sectorId === "veterinary") return "veterinary pet resort dog cat vaccines grooming";
  if (item.sectorId === "childcare") return "childcare nursery kids parents meals enrollment";
  return `${item.sectorId} ${item.brand} ${item.style}`;
};

const colorStyleFor = (item: CatalogItem): ColorStyle => {
  const override = heroMatchFor(item)?.colorStyle;
  if (override) return override;
  const name = `${item.brand} ${item.style}`.toLowerCase();
  if (/white|clean|ivory|marble|zen|ice|crystal|frost|soft/.test(name)) return "muted";
  if (/pastel|blush|lavender|rose|sakura|sunny|garden|champagne/.test(name)) return "pastel";
  if (/mono|chrome|black|obsidian|noir|luxury|dark|gold/.test(name)) return "vivid";
  return "vivid";
};

const screenFlowFor = (item: CatalogItem): Array<{ type: string; label: string }> => {
  const s = String(item.sectorId);
  const cue = sectorCueFor(item).toLowerCase();
  if (s === "food") {
    if (/kebab|delivery|street/.test(cue)) return [{ type: "home", label: "Brand" }, { type: "menu", label: "Combo" }, { type: "checkout", label: "Order" }, { type: "map", label: "Zone" }];
    if (/sushi|omakase|japanese/.test(cue)) return [{ type: "home", label: "Hero" }, { type: "menu", label: "Omakase" }, { type: "booking", label: "Turni" }, { type: "profile", label: "Sake" }];
    if (/seafood|ceviche|raw/.test(cue)) return [{ type: "home", label: "Hero" }, { type: "menu", label: "Crudi" }, { type: "booking", label: "Table" }, { type: "checkout", label: "Bill" }];
    if (/asian|vietnamese|cocktail/.test(cue)) return [{ type: "home", label: "Noir" }, { type: "menu", label: "Menu" }, { type: "booking", label: "Dinner" }, { type: "profile", label: "Club" }];
    return [{ type: "home", label: "Brand" }, { type: "menu", label: "Cuts" }, { type: "kitchen", label: "KDS" }, { type: "booking", label: "Table" }];
  }
  if (s === "retail") return [{ type: "home", label: "Drop" }, { type: "catalog", label: "Shop" }, { type: "detail", label: "Look" }, { type: "checkout", label: "Cart" }];
  if (s === "ncc") return /yacht|boat|charter/.test(cue)
    ? [{ type: "home", label: "Harbor" }, { type: "fleet", label: "Yachts" }, { type: "map", label: "Route" }, { type: "booking", label: "Charter" }]
    : [{ type: "home", label: "Concierge" }, { type: "fleet", label: "Fleet" }, { type: "map", label: "Pickup" }, { type: "booking", label: "Quote" }];
  if (s === "beach") return [{ type: "home", label: "Lido" }, { type: "map", label: "Map" }, { type: "services", label: "Extra" }, { type: "booking", label: "Pass" }];
  if (s === "hospitality") return /yacht|boat|charter|marina/.test(cue)
    ? [{ type: "home", label: "Harbor" }, { type: "fleet", label: "Yachts" }, { type: "map", label: "Route" }, { type: "booking", label: "Charter" }]
    : [{ type: "home", label: "Stay" }, { type: "rooms", label: "Rooms" }, { type: "services", label: "Concierge" }, { type: "booking", label: "Book" }];
  if (s === "construction") return [{ type: "dashboard", label: "SAL" }, { type: "units", label: "Units" }, { type: "schedule", label: "Plan" }, { type: "booking", label: "Ticket" }];
  if (s === "plumber") return [{ type: "dashboard", label: "SOS" }, { type: "services", label: "Jobs" }, { type: "fleet", label: "Team" }, { type: "booking", label: "Ticket" }];
  if (s === "healthcare") return [{ type: "home", label: "Clinic" }, { type: "services", label: "Care" }, { type: "schedule", label: "Agenda" }, { type: "profile", label: "Patient" }];
  if (s === "fitness") return [{ type: "home", label: "Club" }, { type: "services", label: "Class" }, { type: "schedule", label: "Slots" }, { type: "dashboard", label: "Stats" }];
  if (s === "childcare") return [{ type: "home", label: "School" }, { type: "services", label: "Kids" }, { type: "schedule", label: "Day" }, { type: "profile", label: "Parent" }];
  if (s === "veterinary") return [{ type: "home", label: "Care" }, { type: "services", label: "Pet" }, { type: "schedule", label: "Vet" }, { type: "profile", label: "Pet ID" }];
  if (s === "beauty") return /hair/.test(cue)
    ? [{ type: "home", label: "Salon" }, { type: "services", label: "Color" }, { type: "schedule", label: "Staff" }, { type: "profile", label: "VIP" }]
    : [{ type: "home", label: "Atelier" }, { type: "services", label: "Ritual" }, { type: "schedule", label: "Agenda" }, { type: "booking", label: "Book" }];
  return [{ type: "home", label: "Home" }, { type: "services", label: "Flow" }, { type: "detail", label: "Detail" }, { type: "booking", label: "Book" }];
};

const templateFor = (item: CatalogItem): string => {
  const override = heroMatchFor(item);
  if (override) return override.template;
  const name = `${item.brand} ${item.style}`.toLowerCase();
  const styleCycle = item.style.toLowerCase();
  if (/sakura|paperfish|sushi|omakase|hinoki|tsukiji/.test(name)) return "paperfish";
  if (/pizza|strapizzami|forno|casual|ivory|casa/.test(name)) return "strapizzami";
  if (/marina|ncc|limousine|driver|executive|transfer/.test(name) || item.sectorId === "ncc") return /cala|charter|yacht|marina|vento|azure|emerald|sunset/.test(name) ? "batey" : "ncc_limo";
  if (/boat|yacht|charter|pacifico|ocean|azure|beach|cala|batey/.test(name)) return "beach_resort";
  if (/nail|beauty|hair|rose|lavender|pastel|velluto|aurora/.test(name)) return "boutique_pastel";
  if (/clinic|medical|dental|health|lumen|crystal|ice|soft blue|azure gradient|ethereal/.test(name) || item.sectorId === "healthcare") return "clinical_clean";
  if (/fitness|padel|sport|gym|neon|onda/.test(name)) return "fitness_energy";
  if (/domus|construction|cantiere|building|maintenance|urban concrete/.test(name) || item.sectorId === "construction") return "construction_blueprint";
  if (/real|estate|resident|milan|property/.test(name)) return "real_estate_trust";
  if (/idro|plumb|servizi|artigiani|ac|tecnico/.test(name) || item.sectorId === "plumber") return "plumber_utility";
  if (/pet|veterin|resort|tropico/.test(name) || item.sectorId === "veterinary") return "pet_care_playful";
  if (/nursery|playhouse|stelle|arcobaleno|ashley|child|sunny|playful|nature explorer/.test(name) || item.sectorId === "childcare") return "childcare_sunshine";
  if (/hotel|hospitality|suite|resort|sardinia/.test(name) || item.sectorId === "hospitality") return "hospitality_sunset";
  if (/retail|shop|fashion|boutique|chrome/.test(name) || item.sectorId === "retail") return "retail_chrome";
  if (/legal|law|studio legale/.test(name) || item.sectorId === "legal") return "legal_navy";
  if (/account|commercial|fiscal/.test(name) || item.sectorId === "accounting") return "accounting_emerald";
  if (/noir|obsidian|gold|steak|brace|luxury|volcanic/.test(name)) return "luxury_gold";
  if (/minimal|white|clean|marble|zen/.test(name)) return "editorial_clean";
  if (/style a|sage|fresh|ocean/.test(styleCycle)) return item.sectorId === "food" ? "batey" : "glass_aurora";
  if (/style b|rose|coral|sunset/.test(styleCycle)) return item.sectorId === "food" ? "strapizzami" : "boutique_pastel";
  if (/style c|urban|ice/.test(styleCycle)) return item.sectorId === "food" ? "editorial_clean" : "modern_dark";
  if (/style d|green|nature/.test(styleCycle)) return item.sectorId === "food" ? "casual_warm" : "minimal_zen";
  if (/style e|lime|emerald/.test(styleCycle)) return item.sectorId === "food" ? "neon_vibrant" : "fitness_energy";
  if (/style f|azure/.test(styleCycle)) return "glass_aurora";
  if (/style g/.test(styleCycle)) return "monochrome_bold";
  if (/style h/.test(styleCycle)) return "luxury_gold";
  return "modern_dark";
};

const primaryFor = (item: CatalogItem): string | undefined => {
  const override = heroMatchFor(item);
  if (override?.primary) return override.primary;
  const key = `${item.sectorId} ${item.brand} ${item.style}`.toLowerCase();
  if (/construction|domus|cantiere/.test(key)) return "#F6C85F";
  if (/plumber|idro|ac|artigiani/.test(key)) return "#26D9B8";
  if (/health|clinic|lumen/.test(key)) return "#0EA5B7";
  if (/child|nursery|playhouse|stelle|ashley/.test(key)) return /ocean/.test(key) ? "#57B7FF" : "#FF8B3D";
  if (/veterinary|pet|tropico/.test(key)) return "#7C9A4B";
  if (/hospitality|sardinia|hotel/.test(key)) return "#FF9F6E";
  if (/ncc|marina|charter|cala/.test(key)) return /sunset|gold/.test(key) ? "#FFB36B" : "#5CC8D9";
  if (/beauty|nail|hair|velluto/.test(key)) return /lavender/.test(key) ? "#A89DC9" : "#E8A0B8";
  if (/fitness|padel|onda/.test(key)) return /fresh|azzurro/.test(key) ? "#00E5FF" : "#C8FF00";
  return undefined;
};

type ScreenSpec = { type: string; label: string };

const screenSpecsFor = (sectorId: IndustryId): ScreenSpec[] => {
  const s = String(sectorId);
  // Landing sections shared by ALL sectors (with tailored content inside)
  const landing: ScreenSpec[] = [
    { type: "cases", label: "Casi reali" },
    { type: "reviews", label: "Recensioni" },
    { type: "pricing", label: "Pacchetti" },
    { type: "faq", label: "FAQ" },
    { type: "cta", label: "Prenota demo" },
  ];
  if (s === "food") return [
    { type: "home", label: "Vetrina" },
    { type: "menu", label: "Menù" },
    { type: "checkout", label: "Checkout" },
    { type: "kitchen", label: "Cucina KDS" },
    { type: "profile", label: "Fedeltà" },
    ...landing,
  ];
  if (s === "beauty") return [
    { type: "home", label: "Boutique" },
    { type: "services", label: "Trattamenti" },
    { type: "schedule", label: "Agenda staff" },
    { type: "booking", label: "Prenota" },
    { type: "profile", label: "Scheda VIP" },
    ...landing,
  ];
  if (s === "ncc") return [
    { type: "home", label: "Concierge" },
    { type: "fleet", label: "Flotta" },
    { type: "map", label: "Itinerario" },
    { type: "booking", label: "Preventivo" },
    { type: "profile", label: "Account" },
    ...landing,
  ];
  if (s === "beach") return [
    { type: "home", label: "Stabilimento" },
    { type: "map", label: "Mappa ombrelloni" },
    { type: "services", label: "Attività" },
    { type: "booking", label: "Prenota posto" },
    { type: "profile", label: "Pass" },
    ...landing,
  ];
  if (s === "healthcare") return [
    { type: "home", label: "Studio" },
    { type: "services", label: "Prestazioni" },
    { type: "schedule", label: "Agenda medici" },
    { type: "booking", label: "Prenota visita" },
    { type: "profile", label: "Paziente" },
    ...landing,
  ];
  if (s === "fitness") return [
    { type: "home", label: "Club" },
    { type: "services", label: "Classi" },
    { type: "schedule", label: "Calendario" },
    { type: "booking", label: "Iscrivi" },
    { type: "dashboard", label: "Progressi" },
    ...landing,
  ];
  if (s === "hospitality" || s === "agriturismo") return [
    { type: "home", label: "Esperienza" },
    { type: "rooms", label: "Camere" },
    { type: "services", label: "Concierge" },
    { type: "booking", label: "Prenota stay" },
    { type: "profile", label: "Ospite" },
    ...landing,
  ];
  if (s === "retail") return [
    { type: "home", label: "Vetrina" },
    { type: "catalog", label: "Catalogo" },
    { type: "detail", label: "Dettaglio" },
    { type: "checkout", label: "Carrello" },
    { type: "profile", label: "VIP" },
    ...landing,
  ];
  if (s === "construction" || s === "logistics" || s === "garage" || s === "plumber" || s === "electrician" || s === "cleaning") return [
    { type: "dashboard", label: "Dashboard" },
    { type: "fleet", label: "Mezzi/Team" },
    { type: "services", label: "Interventi" },
    { type: "schedule", label: "Pianificazione" },
    { type: "booking", label: "Nuovo ticket" },
    ...landing,
  ];
  if (s === "legal" || s === "accounting") return [
    { type: "dashboard", label: "Desk" },
    { type: "services", label: "Pratiche" },
    { type: "schedule", label: "Scadenze" },
    { type: "checkout", label: "Fatturazione" },
    { type: "profile", label: "Cliente" },
    ...landing,
  ];
  if (s === "veterinary" || s === "childcare") return [
    { type: "home", label: "Home" },
    { type: "services", label: "Servizi" },
    { type: "schedule", label: "Agenda" },
    { type: "booking", label: "Prenota" },
    { type: "profile", label: "Scheda" },
    ...landing,
  ];
  return [
    { type: "home", label: "Home" },
    { type: "services", label: "Servizi" },
    { type: "detail", label: "Dettaglio" },
    { type: "booking", label: "Prenota" },
    { type: "profile", label: "Profilo" },
    ...landing,
  ];
};

// Render EVERY screen live via MockupReactScreen so the whole set of screens
// per sector shares the same visual DNA (template + brand + sector) instead of
// mixing static PNGs (which caused incoherent, repetitive thumbnails).
const LIVE_SECTION_TYPES = new Set([
  "hero", "home",
  "menu", "catalog", "listing", "services", "portfolio",
  "booking", "contact",
  "profile",
  "dashboard", "stats",
  "chat",
  "map",
  "gallery",
  "checkout", "cart",
  "kitchen", "kds", "orders",
  "fleet",
  "rooms", "units",
  "schedule", "agenda", "calendar",
  "detail",
  "cases", "casi", "success",
  "reviews", "testimonials", "recensioni",
  "pricing", "packages", "plans",
  "faq", "faqs",
  "cta", "conversion", "final",
]);


const screenTypesFor = (sectorId: IndustryId): string[] => screenSpecsFor(sectorId).map((s) => s.type);

function CatalogPhonePreview({ item, imageUrl, alt, size = "lg", priority = false, className = "" }: { item: CatalogItem; imageUrl: string; alt: string; size?: "sm" | "lg"; priority?: boolean; className?: string }) {
  const frameWidth = size === "sm" ? 118 : 252;
  const frameHeight = Math.round(frameWidth * 19.5 / 9);
  return (
    <figure className={`relative flex flex-col items-center ${className}`}>
      <div className="relative shrink-0" style={{ width: frameWidth, height: frameHeight }}>
        <div
          aria-hidden
          className="absolute -bottom-[7%] left-1/2 h-[12%] w-[78%] -translate-x-1/2 rounded-full opacity-70 blur-2xl"
          style={{ background: "radial-gradient(ellipse, hsl(var(--primary) / 0.42), transparent 68%)" }}
        />
        <div
          className="absolute inset-0 overflow-hidden p-[2.8%]"
          style={{
            borderRadius: size === "sm" ? 28 : 44,
            background: "linear-gradient(145deg, hsl(var(--foreground) / 0.26), hsl(var(--deep-black)) 38%, hsl(var(--foreground) / 0.12))",
            boxShadow: priority ? "0 34px 88px -34px hsl(0 0% 0% / 0.95)" : "0 20px 60px -32px hsl(0 0% 0% / 0.88)",
          }}
        >
          <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: size === "sm" ? 24 : 38, background: "hsl(var(--deep-black))" }}>
            <img
              src={imageUrl}
              alt={alt}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-top"
              draggable={false}
            />
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-[2.3%] z-20 h-[4.7%] w-[33%] -translate-x-1/2 rounded-full" style={{ background: "hsl(0 0% 0%)" }} />
            <div aria-hidden className="pointer-events-none absolute inset-0 z-10" style={{ background: "linear-gradient(116deg, hsl(var(--foreground) / 0.12) 0%, transparent 30%, transparent 66%, hsl(var(--foreground) / 0.06) 100%)", mixBlendMode: "screen" }} />
          </div>
        </div>
      </div>
    </figure>
  );
}

// Sector → colored tag palette (Lowengeld-style category pills)
const SECTOR_TAG_PALETTE: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  food:         { text: "#FFB169", bg: "rgba(255,132,54,0.14)",  border: "rgba(255,132,54,0.55)",  glow: "rgba(255,132,54,0.55)" },
  beauty:       { text: "#F5A7C6", bg: "rgba(232,120,170,0.14)", border: "rgba(232,120,170,0.55)", glow: "rgba(232,120,170,0.5)" },
  ncc:          { text: "#8AE1F0", bg: "rgba(92,200,217,0.12)",  border: "rgba(92,200,217,0.55)",  glow: "rgba(92,200,217,0.5)" },
  beach:        { text: "#7DD3FC", bg: "rgba(56,189,248,0.12)",  border: "rgba(56,189,248,0.55)",  glow: "rgba(56,189,248,0.5)" },
  healthcare:   { text: "#7DDFE7", bg: "rgba(14,181,199,0.12)",  border: "rgba(14,181,199,0.55)",  glow: "rgba(14,181,199,0.5)" },
  fitness:      { text: "#D9FF66", bg: "rgba(200,255,0,0.10)",   border: "rgba(200,255,0,0.55)",   glow: "rgba(200,255,0,0.45)" },
  hospitality:  { text: "#FFC29E", bg: "rgba(255,159,110,0.14)", border: "rgba(255,159,110,0.55)", glow: "rgba(255,159,110,0.5)" },
  retail:       { text: "#B7F5C7", bg: "rgba(80,220,140,0.12)",  border: "rgba(80,220,140,0.5)",   glow: "rgba(80,220,140,0.45)" },
  construction: { text: "#F6D67C", bg: "rgba(246,200,95,0.12)",  border: "rgba(246,200,95,0.55)",  glow: "rgba(246,200,95,0.5)" },
  plumber:      { text: "#7EE9CE", bg: "rgba(38,217,184,0.12)",  border: "rgba(38,217,184,0.55)",  glow: "rgba(38,217,184,0.5)" },
  electrician:  { text: "#FFE28A", bg: "rgba(255,210,90,0.12)",  border: "rgba(255,210,90,0.55)",  glow: "rgba(255,210,90,0.5)" },
  cleaning:     { text: "#A8D8FF", bg: "rgba(120,180,255,0.12)", border: "rgba(120,180,255,0.55)", glow: "rgba(120,180,255,0.5)" },
  garage:       { text: "#FFB77A", bg: "rgba(255,140,60,0.12)",  border: "rgba(255,140,60,0.55)",  glow: "rgba(255,140,60,0.5)" },
  logistics:    { text: "#C6B8FF", bg: "rgba(150,130,255,0.14)", border: "rgba(150,130,255,0.55)", glow: "rgba(150,130,255,0.5)" },
  veterinary:   { text: "#C5E39A", bg: "rgba(160,200,110,0.12)", border: "rgba(160,200,110,0.55)", glow: "rgba(160,200,110,0.5)" },
  childcare:    { text: "#FFD98A", bg: "rgba(255,190,90,0.14)",  border: "rgba(255,190,90,0.55)",  glow: "rgba(255,190,90,0.5)" },
  legal:        { text: "#B8C6FF", bg: "rgba(120,140,255,0.12)", border: "rgba(120,140,255,0.55)", glow: "rgba(120,140,255,0.5)" },
  accounting:   { text: "#9DE8C4", bg: "rgba(60,200,150,0.12)",  border: "rgba(60,200,150,0.55)",  glow: "rgba(60,200,150,0.45)" },
  agriturismo:  { text: "#D8E39A", bg: "rgba(180,200,90,0.12)",  border: "rgba(180,200,90,0.5)",   glow: "rgba(180,200,90,0.45)" },
};
const DEFAULT_TAG = { text: "#C6B8FF", bg: "rgba(150,130,255,0.14)", border: "rgba(150,130,255,0.55)", glow: "rgba(150,130,255,0.5)" };
const paletteFor = (sectorId: IndustryId) => SECTOR_TAG_PALETTE[String(sectorId)] ?? DEFAULT_TAG;

// Compact iPhone-style frame used for the 3-phone card hero. Fully live via MockupReactScreen.
/**
 * Renders a MockupReactScreen at its intrinsic pixel size (renderWidth × renderHeight)
 * and fluidly scales it to fill the parent phone frame via CSS transform.
 * Uses ResizeObserver so the live UI stays crisp at any card width.
 */
function ScaledScreen({ renderWidth, renderHeight, children }: { renderWidth: number; renderHeight: number; children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    const apply = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      const s = Math.min(w / renderWidth, h / renderHeight);
      inner.style.transform = `scale(${s})`;
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [renderWidth, renderHeight]);
  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <div
        ref={innerRef}
        style={{ width: renderWidth, height: renderHeight, transformOrigin: "top left" }}
      >
        {children}
      </div>
    </div>
  );
}

function TripletPhone({ item, screenType, priority, imageUrl, objectPosition }: { item: CatalogItem; screenType: string; tilt?: number; elevate?: number; priority: boolean; imageUrl?: string | null; objectPosition?: string; scale?: number; }) {
  const template = templateFor(item);
  const primary = primaryFor(item);
  // Approximate iPhone-16 aspect for the inner screen so live UI renders at scale
  const renderWidth = 240;
  const renderHeight = Math.round(renderWidth * 19.5 / 9);
  return (
    <div className="relative w-full will-change-transform transition-transform duration-500 group-hover:-translate-y-1" style={{ aspectRatio: "9 / 19.5" }}>
      <div
        aria-hidden
        className="absolute -bottom-[6%] left-1/2 h-[10%] w-[80%] -translate-x-1/2 rounded-full blur-2xl opacity-70"
        style={{ background: `radial-gradient(ellipse, ${paletteFor(item.sectorId).glow}, transparent 70%)` }}
      />
      <div
        className="absolute inset-0 p-[3.5%]"
        style={{
          borderRadius: "14%/6.5%",
          background: "linear-gradient(145deg, hsl(var(--foreground) / 0.28), hsl(var(--deep-black)) 42%, hsl(var(--foreground) / 0.14))",
          boxShadow: priority
            ? "0 34px 78px -28px hsl(0 0% 0% / 0.95), 0 0 0 1px hsl(var(--foreground) / 0.08) inset"
            : "0 22px 58px -30px hsl(0 0% 0% / 0.92), 0 0 0 1px hsl(var(--foreground) / 0.08) inset",
        }}
      >
        <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: "11%/5%", background: "hsl(var(--deep-black))" }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${item.brand} — ${item.style}`}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: objectPosition ?? "center top" }}
              draggable={false}
            />
          ) : (
            <ScaledScreen renderWidth={renderWidth} renderHeight={renderHeight}>
              <MockupReactScreen
                type={screenType}
                templateVariant={template}
                businessName={item.brand}
                businessSector={sectorCueFor(item)}
                primaryColor={primary}
                colorStyle={colorStyleFor(item)}
                width={renderWidth}
                height={renderHeight}
                glassIntensity={32}
                typeScale={1}
                safeAreaPx={2}
                boostContrast
              />
            </ScaledScreen>
          )}
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-[2%] z-20 h-[3.2%] w-[32%] -translate-x-1/2 rounded-full" style={{ background: "hsl(0 0% 0%)" }} />
          <div aria-hidden className="pointer-events-none absolute inset-0 z-10" style={{ background: "linear-gradient(118deg, hsl(var(--foreground) / 0.14) 0%, transparent 32%, transparent 68%, hsl(var(--foreground) / 0.08) 100%)", mixBlendMode: "screen" }} />
        </div>
      </div>
    </div>
  );
}


export default function MockupCatalog({ mode = "section" }: { mode?: "section" | "page" }) {
  const navigate = useNavigate();
  const isPage = mode === "page";
  const [expanded, setExpanded] = useState(isPage);
  const [sector, setSector] = useState<IndustryId | "all">("all");
  const [selected, setSelected] = useState<string | null>(null);

  const allItems = useMemo(() => flattenPortfolio(SECTOR_PORTFOLIO), []);
  const interleavedItems = useMemo(() => interleaveBySector(allItems), [allItems]);
  const sectors = useMemo(
    () => SECTOR_PORTFOLIO.map((s) => ({ id: s.sectorId, label: s.sectorLabel, count: allItems.filter((it) => it.sectorId === s.sectorId).length })),
    [allItems]
  );
  const filtered = sector === "all" ? interleavedItems : allItems.filter((item) => item.sectorId === sector);
  const visible = expanded ? filtered : filtered.slice(0, 12);
  const screensCount = allItems.reduce((sum, item) => sum + item.screens.length + (item.desktopScreens?.length ?? 0), 0);

  return (
    <section id="mockup-catalog" className={`relative overflow-hidden px-4 sm:px-6 ${isPage ? "min-h-screen pb-24 pt-28 sm:pt-32" : "py-20 sm:py-28"}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 0%, hsl(var(--accent) / 0.20), transparent 68%), radial-gradient(ellipse 40% 30% at 82% 12%, hsl(var(--gold) / 0.14), transparent 70%), linear-gradient(180deg, hsl(var(--background)), hsl(var(--deep-black)))",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[6px] text-[hsl(var(--gold))]">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--gold))] shadow-[0_0_12px_hsl(var(--gold))]" />
              Our Portfolio
            </div>
            <h2 className="font-heading text-[clamp(2.4rem,7vw,5.6rem)] font-black uppercase leading-[0.92] tracking-tight text-foreground">
              Premium App
              <span className="block bg-[linear-gradient(110deg,hsl(var(--accent)),hsl(var(--gold)),hsl(var(--gold-light)))] bg-clip-text text-transparent">
                Development
              </span>
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-foreground/65 sm:text-base">
              {allItems.length} stili · {screensCount} schermate reali. Ogni card mostra 4 mockup iPhone dello stesso brand — home, servizi, dettaglio e booking — nello stile del settore, con la stessa qualità dei nostri progetti Full Power.
            </p>
          </div>

          <button
            type="button"
            onClick={() => (isPage ? navigate("/") : navigate("/portfolio"))}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 self-start rounded-full border border-[hsl(var(--gold))]/45 bg-[linear-gradient(110deg,hsl(var(--accent)),hsl(var(--gold)))] px-6 py-3 text-sm font-black uppercase tracking-[2px] text-[hsl(var(--deep-black))] shadow-[0_18px_60px_-24px_hsl(var(--gold))] transition-transform active:scale-[0.98] lg:self-end"
          >
            {isPage ? "Torna alla home" : "Apri il portfolio completo"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Category pills with count badges (Lowengeld-style) */}
        <div className="mb-10 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setSector("all")}
            className={`group inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-black uppercase tracking-[2px] transition-all ${sector === "all" ? "border-[hsl(var(--gold))] bg-[hsl(var(--accent))]/60 text-[hsl(var(--gold-light))] shadow-[0_10px_30px_-14px_hsl(var(--gold))]" : "border-foreground/12 bg-foreground/[0.04] text-foreground/72 hover:border-foreground/25"}`}
          >
            <span className={`rounded-full px-2 py-0.5 text-[10px] tabular-nums ${sector === "all" ? "bg-[hsl(var(--gold))]/25 text-[hsl(var(--gold-light))]" : "bg-foreground/10 text-foreground/70"}`}>
              {allItems.length}
            </span>
            Tutti
          </button>
          {sectors.map((s) => {
            const p = paletteFor(s.id);
            const active = sector === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSector(s.id)}
                className={`group inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-black uppercase tracking-[2px] transition-all ${active ? "text-[hsl(var(--foreground))]" : "text-foreground/72 hover:text-foreground"}`}
                style={{
                  borderColor: active ? p.border : "hsl(var(--foreground) / 0.12)",
                  background: active ? p.bg : "hsl(var(--foreground) / 0.04)",
                  boxShadow: active ? `0 10px 34px -18px ${p.glow}` : undefined,
                }}
              >
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] tabular-nums"
                  style={{
                    background: active ? `${p.text}22` : "hsl(var(--foreground) / 0.10)",
                    color: active ? p.text : "hsl(var(--foreground) / 0.75)",
                  }}
                >
                  {s.count}
                </span>
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Card grid — Lowengeld-style 4-phone lineup per card */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {visible.map((item, index) => {
            const isSelected = selected === item.id;
            const specs = screenSpecsFor(item.sectorId);
            const previewSpecs = isSelected ? specs : specs.slice(0, 5);
            const p = paletteFor(item.sectorId);
            // 4 distinct screens labelled like Lowengeld, but tailored per sector/style.
            const quartet = screenFlowFor(item);
            return (
              <article
                key={item.id}
                className="group relative overflow-hidden rounded-[1.6rem] border border-foreground/10 bg-[linear-gradient(180deg,hsl(var(--foreground)/0.05),hsl(var(--foreground)/0.02))] transition-all duration-500 hover:-translate-y-1"
                style={{
                  boxShadow: `0 30px 90px -50px hsl(0 0% 0% / 0.95), 0 0 0 1px hsl(var(--foreground) / 0.04) inset`,
                }}
              >
                {/* Hover glow tinted to sector */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${p.glow}, transparent 70%)`,
                  }}
                />

                {/* 4-phone lineup with labels (Lowengeld style): first phone = approved premium hero,
                    secondary phones = rebuilt live sector-specific interfaces matched to that hero. */}
                <div className="relative overflow-hidden px-4 pt-8 pb-4 sm:px-6 sm:pt-10">
                  <div className="grid grid-cols-4 items-end gap-2 sm:gap-3">
                    {quartet.map((screen, i) => {
                      const heroPng = item.aiHero ?? item.screens[0] ?? null;
                      return (
                        <div key={`${item.id}-quad-${i}`} className="flex flex-col items-center gap-2">
                          <div className="w-full">
                            <TripletPhone
                              item={item}
                              screenType={screen.type}
                              tilt={0}
                              elevate={0}
                              priority={index < 2}
                              imageUrl={i === 0 ? heroPng : null}
                              objectPosition={i === 0 ? "center top" : "center 12%"}
                            />
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-[2.4px] text-foreground/55 sm:text-[10px] sm:tracking-[3px]">

                          {screen.label}
                        </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,transparent,hsl(var(--background)/0.6))]" />
                </div>


                {/* Meta */}
                <div className="relative p-5 pt-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[2px]"
                      style={{ color: p.text, borderColor: p.border, background: p.bg }}
                    >
                      {item.sectorLabel}
                    </span>
                    <span className="rounded-full border border-foreground/15 bg-foreground/[0.05] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[2px] text-foreground/70">
                      {item.style}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl font-black uppercase leading-none tracking-tight text-foreground">
                    {item.brand}
                  </h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-foreground/62 line-clamp-3">
                    {item.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[2px] text-foreground/55">
                      <span className="inline-flex items-center gap-1.5"><Smartphone className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />{specs.length} screens</span>
                      {item.desktopScreens?.length ? <span className="inline-flex items-center gap-1.5"><Monitor className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />{item.desktopScreens.length} desktop</span> : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelected(isSelected ? null : item.id)}
                      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[2px] transition-colors"
                      style={{
                        color: p.text,
                        borderColor: p.border,
                        background: isSelected ? p.bg : "transparent",
                      }}
                    >
                      {isSelected ? "Chiudi" : "View"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Expanded live-screens strip */}
                  {isSelected ? (
                    <div className="mt-5 -mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {previewSpecs.map((spec, i) => {
                        const template = templateFor(item);
                        const primary = primaryFor(item);
                        const useHero = i === 0 && !!item.aiHero;
                        return (
                          <div
                            key={`${item.id}-${spec.type}-${i}`}
                            className="flex w-[112px] shrink-0 flex-col items-center gap-1.5"
                            aria-label={`${spec.label} ${item.brand}`}
                          >
                            <div className="relative flex h-[224px] w-[104px] items-center justify-center overflow-hidden rounded-[18px] border border-foreground/10 bg-muted shadow-[0_18px_44px_-28px_hsl(0_0%_0%)]">
                              {useHero ? (
                                <img
                                  src={item.aiHero as string}
                                  alt={`${item.brand} — ${spec.label}`}
                                  loading="lazy"
                                  decoding="async"
                                  className="absolute inset-0 h-full w-full object-cover object-top"
                                  draggable={false}
                                />
                              ) : (
                                <MockupReactScreen
                                  type={spec.type}
                                  templateVariant={template}
                                  businessName={item.brand}
                                  businessSector={sectorCueFor(item)}
                                  primaryColor={primary}
                                  colorStyle={colorStyleFor(item)}
                                  width={104}
                                  height={224}
                                  glassIntensity={40}
                                  typeScale={0.98}
                                  boostContrast
                                />
                              )}
                              {useHero ? (
                                <span className="pointer-events-none absolute right-1 top-1 rounded-full bg-[hsl(var(--gold))]/85 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-wider text-[hsl(var(--deep-black))]">
                                  Hero
                                </span>
                              ) : LIVE_SECTION_TYPES.has(spec.type) ? (
                                <span className="pointer-events-none absolute right-1 top-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-wider text-white">
                                  Live
                                </span>
                              ) : null}
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-[1.5px] text-foreground/65 text-center leading-tight">{spec.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        {!expanded && filtered.length > visible.length ? (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="min-h-[48px] rounded-full border border-foreground/15 bg-foreground/[0.05] px-6 py-3 text-xs font-black uppercase tracking-[2px] text-foreground transition-colors hover:border-[hsl(var(--gold))]/50"
            >
              <Sparkles className="mr-2 inline h-3.5 w-3.5 text-[hsl(var(--gold))]" />
              Mostra altri {filtered.length - visible.length} mockup
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
