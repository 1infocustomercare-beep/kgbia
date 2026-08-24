/**
 * sectorCompleteness.ts
 * ─────────────────────────────────────────────────────────────────────
 * Registry UNICO che dichiara, per ogni settore, COSA serve perché la
 * demo generata sia "completa al 100%": template iPhone canonico,
 * agenti AI obbligatori, moduli admin obbligatori, sezioni sito
 * obbligatorie e dataset seed minimo.
 *
 * Regole:
 *  - PURAMENTE ADDITIVO: non sostituisce sectorConfig / industry-config /
 *    sectorFeatures. Li unisce e dichiara la "soglia di completezza".
 *  - Lavora a livello di metadata: il VERO seed dati avviene server-side
 *    nell'edge function `generate-demo-from-lead` consumando questo
 *    registry come fonte di verità.
 *  - Ogni modulo / agente / blocco è marcabile come "seed" → la UI mostra
 *    il badge "Esempio personalizzabile" (vedi PersonalizableBadge).
 */

import { INDUSTRY_CONFIGS, type IndustryId } from "@/config/industry-config";
import { SECTOR_CONFIGS } from "@/config/sectorConfig";
import {
  UNIVERSAL_AGENTS,
  SECTOR_SPECIFIC_FEATURES,
} from "@/config/sectorFeatures";

/* ═══════════════════════════════════════════════════════════════════
   TIPI
   ═══════════════════════════════════════════════════════════════════ */

export interface RequiredAgent {
  /** chiave canonica usata nelle edge function e UI */
  key: string;
  name: string;
  emoji: string;
  description: string;
  /** se l'agente è considerato critico per la demo del settore */
  critical: boolean;
  /** capability principali esposte all'utente */
  capabilities: string[];
}

export interface RequiredModule {
  /** id stabile usato come ancora UI / route */
  id: string;
  label: string;
  icon: string;
  /** se il modulo deve sempre apparire nella demo del settore */
  critical: boolean;
  /** suggerimenti UI quando il modulo è popolato da seed */
  seedHint?: string;
}

export interface RequiredSiteBlock {
  id: string;
  label: string;
  /** sezione del sito iPhone (hero, menu, services, gallery, contacts, ...) */
  type:
    | "hero"
    | "menu"
    | "services"
    | "rooms"
    | "fleet"
    | "gallery"
    | "team"
    | "reviews"
    | "booking"
    | "contacts"
    | "map"
    | "loyalty"
    | "shop"
    | "portfolio"
    | "classes"
    | "membership";
  critical: boolean;
}

export interface SeedDataset {
  /** quanti elementi seed minimi servono perché la sezione non sembri vuota */
  minClients: number;
  minOrders: number;
  minCatalog: number;
  /** descrizione del tipo di catalogo (menu, servizi, camere, flotta, ...) */
  catalogType: string;
  minReviews: number;
  /** se il settore richiede un dataset orari/turni/calendario */
  needsSchedule: boolean;
}

export interface SectorCompleteness {
  sectorId: IndustryId | string;
  label: string;
  /** template iPhone canonico (chiave del preview-matcher) */
  defaultTemplateVariant: string;
  agents: RequiredAgent[];
  modules: RequiredModule[];
  siteBlocks: RequiredSiteBlock[];
  seed: SeedDataset;
  /** copy del badge esempio (può essere customizzato per settore) */
  exampleBadgeLabel: string;
  exampleBadgeTooltip: string;
}

/* ═══════════════════════════════════════════════════════════════════
   AGENTI UNIVERSALI (presenti in OGNI settore)
   ═══════════════════════════════════════════════════════════════════ */

const UNIVERSAL_REQUIRED: RequiredAgent[] = UNIVERSAL_AGENTS.map((a) => ({
  key: a.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  name: a.name,
  emoji: a.emoji,
  description: a.desc,
  critical: a.name.toLowerCase().includes("arianna") || a.name.toLowerCase().includes("analytics"),
  capabilities: a.capabilities,
}));

/* ═══════════════════════════════════════════════════════════════════
   AGENTI SPECIFICI PER SETTORE
   (additivi rispetto agli universali)
   ═══════════════════════════════════════════════════════════════════ */

const SECTOR_AGENTS: Partial<Record<IndustryId | string, RequiredAgent[]>> = {
  food: [
    { key: "chef-ai", name: "Chef AI", emoji: "👨‍🍳", description: "Ottimizza menu, margini e suggerisce piatti del giorno", critical: true, capabilities: ["Menu engineering", "Food cost", "Piatti del giorno"] },
    { key: "sommelier-ai", name: "Sommelier AI", emoji: "🍷", description: "Abbinamenti vino-cibo e gestione cantina", critical: false, capabilities: ["Pairing", "Cantina", "Wine list"] },
    { key: "kitchen-ai", name: "Kitchen Coordinator", emoji: "🔥", description: "Coordina display cucina, tempi e priorità ordini", critical: true, capabilities: ["KDS", "Tempi cottura", "Priorità"] },
    { key: "review-shield", name: "Review Shield", emoji: "⭐", description: "Risponde recensioni, intercetta lamentele prima che diventino pubbliche", critical: true, capabilities: ["Reply auto", "Sentiment", "Filtro 1-2 stelle"] },
  ],
  ncc: [
    { key: "fleet-manager", name: "Fleet Manager AI", emoji: "🚗", description: "Monitora veicoli, scadenze, manutenzioni", critical: true, capabilities: ["Scadenze", "Manutenzione", "KM tracking"] },
    { key: "dispatcher", name: "Dispatcher AI", emoji: "📡", description: "Assegna corse all'autista migliore per posizione e rating", critical: true, capabilities: ["Auto-assign", "Routing", "Backup driver"] },
    { key: "dynamic-pricing", name: "Dynamic Pricing", emoji: "💰", description: "Tariffe ottimali per stagione, domanda, tratta", critical: true, capabilities: ["Surge pricing", "Tariffario", "Competitor watch"] },
    { key: "concierge-vip", name: "Concierge VIP", emoji: "🎩", description: "Gestione clienti VIP, preferenze, cross-selling tour", critical: false, capabilities: ["VIP profiling", "Cross-sell", "White glove"] },
  ],
  beauty: [
    { key: "beauty-advisor", name: "Beauty Advisor AI", emoji: "💄", description: "Suggerisce trattamenti su storico cliente", critical: true, capabilities: ["Personalizzazione", "Cross-sell", "Stagione"] },
    { key: "scheduling-ai", name: "Scheduling AI", emoji: "📅", description: "Ottimizza agenda, riempie buchi, gestisce no-show", critical: true, capabilities: ["Slot ottimizzati", "Lista attesa", "Anti no-show"] },
    { key: "social-beauty", name: "Social Beauty AI", emoji: "📸", description: "Crea contenuti before/after per Instagram", critical: false, capabilities: ["Post auto", "Hashtag", "Stories"] },
  ],
  healthcare: [
    { key: "medical-scheduler", name: "Medical Scheduler", emoji: "📋", description: "Bilancia urgenze e visite programmate", critical: true, capabilities: ["Triage", "Urgenze", "Liste attesa"] },
    { key: "patient-ai", name: "Patient AI", emoji: "🩺", description: "Suggerisce follow-up e screening su storico paziente", critical: true, capabilities: ["Follow-up", "Screening", "Prevenzione"] },
    { key: "compliance-guard", name: "Compliance Guard", emoji: "🛡️", description: "GDPR, consensi e scadenze normative", critical: true, capabilities: ["GDPR", "Consensi", "Audit"] },
    { key: "billing-ai-health", name: "Billing AI Sanitario", emoji: "💳", description: "Fatturazione SDI sanitaria + sistema TS", critical: true, capabilities: ["SDI", "Sistema TS", "STS"] },
  ],
  retail: [
    { key: "merchandiser", name: "Merchandiser AI", emoji: "🏷️", description: "Ottimizza catalogo, prezzi, varianti, layout vetrina", critical: true, capabilities: ["Pricing", "Varianti", "Stagionalità"] },
    { key: "inventory-ai", name: "Inventory AI", emoji: "📦", description: "Riordini automatici, rottura stock, dead stock", critical: true, capabilities: ["Riordini", "Stock alert", "ABC analysis"] },
    { key: "ecom-growth", name: "E-com Growth", emoji: "🛒", description: "Cross-sell, upsell, carrelli abbandonati", critical: false, capabilities: ["Cross-sell", "Upsell", "Cart recovery"] },
  ],
  fitness: [
    { key: "coach-ai", name: "Coach AI", emoji: "💪", description: "Programmi allenamento personalizzati", critical: true, capabilities: ["Schede auto", "Progressi", "Recovery"] },
    { key: "membership-retention", name: "Retention AI", emoji: "🔁", description: "Previene disdette, gestisce rinnovi, win-back", critical: true, capabilities: ["Churn", "Rinnovi", "Win-back"] },
    { key: "class-optimizer", name: "Class Optimizer", emoji: "📅", description: "Bilancia capienza, orari corsi, no-show", critical: false, capabilities: ["Capienza", "Slot", "Lista attesa"] },
  ],
  hospitality: [
    { key: "rm-ai", name: "Revenue Manager AI", emoji: "📈", description: "Ottimizza tariffe camere giorno per giorno", critical: true, capabilities: ["RevPAR", "Forecast", "Competitor"] },
    { key: "concierge-host", name: "Concierge Digitale", emoji: "🛎️", description: "Risponde ospiti 24/7 in 12 lingue, suggerisce esperienze", critical: true, capabilities: ["Multi-lingua", "Tips", "Cross-sell"] },
    { key: "housekeeping-ai", name: "Housekeeping AI", emoji: "🧹", description: "Pianifica pulizie, controlla qualità, gestisce turni", critical: true, capabilities: ["Turni", "Checklist", "QC"] },
  ],
  beach: [
    { key: "beach-ops", name: "Beach Ops AI", emoji: "🌊", description: "Mappa ombrelloni live, prenotazioni e walk-in", critical: true, capabilities: ["Mappa live", "Walk-in", "Cassa unica"] },
    { key: "beach-bar-ai", name: "Beach Bar AI", emoji: "🍹", description: "Ordini dal lettino, runner notification, upsell", critical: true, capabilities: ["Lettino-bar", "Runner", "Upsell"] },
    { key: "season-pass", name: "Season Pass AI", emoji: "🎟️", description: "Gestisce abbonamenti stagionali e VIP", critical: false, capabilities: ["Abbonamenti", "VIP", "Rinnovi"] },
  ],
  hotel: [
    { key: "rm-ai", name: "Revenue Manager AI", emoji: "📈", description: "Ottimizza tariffe camere giorno per giorno", critical: true, capabilities: ["RevPAR", "Forecast", "Competitor"] },
    { key: "concierge-host", name: "Concierge Digitale", emoji: "🛎️", description: "Risponde ospiti 24/7 in 12 lingue", critical: true, capabilities: ["Multi-lingua", "Tips", "Cross-sell"] },
    { key: "housekeeping-ai", name: "Housekeeping AI", emoji: "🧹", description: "Pianifica pulizie e controlla qualità", critical: true, capabilities: ["Turni", "Checklist", "QC"] },
  ],
  bakery: [
    { key: "production-planner", name: "Production Planner", emoji: "🥐", description: "Pianifica infornate su preordini e storico", critical: true, capabilities: ["Forecast", "Sprechi", "Riordini"] },
    { key: "preorder-ai", name: "Preorder AI", emoji: "📋", description: "Gestisce preordini WhatsApp e ritiri scaglionati", critical: true, capabilities: ["Preorder", "Slot ritiro", "Notifiche"] },
  ],
  agriturismo: [
    { key: "farm-experience", name: "Farm Experience AI", emoji: "🌾", description: "Pacchetti soggiorno + degustazioni + attività", critical: true, capabilities: ["Bundle", "Cross-sell", "Esperienze"] },
    { key: "rm-ai", name: "Revenue Manager AI", emoji: "📈", description: "Tariffe camere e occupazione", critical: true, capabilities: ["RevPAR", "Stagionalità"] },
  ],
  plumber: [
    { key: "dispatch-pro", name: "Dispatch Pro", emoji: "🛠️", description: "Assegna interventi al tecnico più vicino", critical: true, capabilities: ["Routing", "ETA", "Skill match"] },
    { key: "quote-ai", name: "Quote AI", emoji: "📝", description: "Preventivi automatici da foto e descrizione", critical: true, capabilities: ["Foto-to-quote", "Tariffario", "Materiali"] },
  ],
  electrician: [
    { key: "dispatch-pro", name: "Dispatch Pro", emoji: "⚡", description: "Assegna lavori al tecnico più vicino", critical: true, capabilities: ["Routing", "ETA", "Skill match"] },
    { key: "compliance-electric", name: "Compliance Elettrica", emoji: "📜", description: "Genera DICO/DIRI, verifica norme CEI", critical: true, capabilities: ["DICO", "DIRI", "Norme CEI"] },
  ],
  cleaning: [
    { key: "shift-planner", name: "Shift Planner AI", emoji: "🗓️", description: "Pianifica turni operatori per zona", critical: true, capabilities: ["Turni", "Zone", "Carico"] },
    { key: "qc-photo", name: "Quality Control Foto", emoji: "📸", description: "Checklist con foto e firma cliente", critical: true, capabilities: ["Checklist", "Foto", "Firma"] },
  ],
  legal: [
    { key: "deadline-keeper", name: "Deadline Keeper", emoji: "⏳", description: "Scadenze processuali, udienze, termini", critical: true, capabilities: ["Scadenzario", "Udienze", "Alert"] },
    { key: "billing-pro", name: "Parcelle AI", emoji: "🧾", description: "Timesheet automatico e parcelle forensi", critical: true, capabilities: ["Timesheet", "Parametri forensi", "Fatturazione"] },
  ],
  accounting: [
    { key: "tax-deadline-ai", name: "Tax Deadline AI", emoji: "📅", description: "Scadenze fiscali per cliente e tipologia", critical: true, capabilities: ["F24", "IVA", "Dichiarazioni"] },
    { key: "doc-collector", name: "Document Collector", emoji: "📂", description: "Sollecita documenti ai clienti via WhatsApp/email", critical: true, capabilities: ["Reminder doc", "OCR", "Categorizzazione"] },
  ],
  garage: [
    { key: "service-advisor", name: "Service Advisor AI", emoji: "🔧", description: "Diagnosi assistita, preventivi, ricambi", critical: true, capabilities: ["Diagnosi", "Preventivi", "Ricambi"] },
    { key: "service-reminder", name: "Service Reminder", emoji: "🔔", description: "Promemoria tagliando, revisione, gomme", critical: true, capabilities: ["Tagliando", "Revisione", "Gomme stagionali"] },
  ],
  photography: [
    { key: "shoot-planner", name: "Shoot Planner AI", emoji: "📸", description: "Briefing, location, attrezzatura, calendario", critical: true, capabilities: ["Briefing", "Calendario", "Mood board"] },
    { key: "delivery-portal", name: "Client Delivery Portal", emoji: "🖼️", description: "Galleria privata cliente con selezione e download", critical: true, capabilities: ["Gallery", "Selezione", "Download"] },
  ],
  construction: [
    { key: "site-coordinator", name: "Site Coordinator AI", emoji: "🏗️", description: "Gestione cantieri, squadre, materiali, SAL", critical: true, capabilities: ["Cantieri", "Squadre", "SAL"] },
    { key: "quote-ai-build", name: "Computo Metrico AI", emoji: "📐", description: "Computi metrici e preventivi edili", critical: true, capabilities: ["Computo", "Preventivi", "Margini"] },
  ],
  gardening: [
    { key: "season-planner", name: "Season Planner", emoji: "🌿", description: "Pianifica manutenzioni stagionali per cliente", critical: true, capabilities: ["Stagionalità", "Manutenzioni", "Ricorrenze"] },
  ],
  veterinary: [
    { key: "pet-records", name: "Pet Records AI", emoji: "🐾", description: "Cartelle animali, vaccinazioni, terapie", critical: true, capabilities: ["Cartella", "Vaccini", "Terapie"] },
    { key: "vaccine-reminder", name: "Vaccine Reminder", emoji: "💉", description: "Promemoria vaccini, sverminazioni, controlli", critical: true, capabilities: ["Vaccini", "Antiparassitari", "Controlli"] },
  ],
  tattoo: [
    { key: "portfolio-curator", name: "Portfolio Curator", emoji: "🎨", description: "Cura portfolio Instagram e suggerimenti style", critical: true, capabilities: ["Portfolio", "Style match", "Hashtag"] },
    { key: "consent-aftercare", name: "Consent & Aftercare", emoji: "📜", description: "Consensi digitali e istruzioni post-tattoo", critical: true, capabilities: ["Consensi", "Aftercare", "Follow-up"] },
  ],
  childcare: [
    { key: "family-comms", name: "Family Comms AI", emoji: "👶", description: "Aggiornamenti giornalieri foto+attività ai genitori", critical: true, capabilities: ["Daily report", "Foto", "Chat"] },
  ],
  education: [
    { key: "course-engine", name: "Course Engine", emoji: "🎓", description: "Iscrizioni, materiali, certificati, esami", critical: true, capabilities: ["LMS", "Certificati", "Esami"] },
  ],
  events: [
    { key: "event-orchestrator", name: "Event Orchestrator", emoji: "🎉", description: "Fornitori, timeline, ospiti, budget", critical: true, capabilities: ["Timeline", "Vendor", "Budget"] },
  ],
  logistics: [
    { key: "fleet-tracker", name: "Fleet Tracker", emoji: "🚚", description: "Tracking live, ETA, ottimizzazione percorsi", critical: true, capabilities: ["Live tracking", "ETA", "Routing"] },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   MODULI MINIMI PER SETTORE (oltre a quelli universali)
   ═══════════════════════════════════════════════════════════════════ */

const UNIVERSAL_MODULES: RequiredModule[] = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", critical: true },
  { id: "agents", label: "Agenti AI", icon: "Bot", critical: true, seedHint: "Tutti gli agenti del settore sono pre-installati" },
  { id: "whatsapp", label: "WhatsApp Business", icon: "MessageCircle", critical: true, seedHint: "3 conversazioni di esempio" },
  { id: "settings", label: "Impostazioni", icon: "Settings", critical: true },
  { id: "billing", label: "Fatturazione", icon: "CreditCard", critical: false },
  { id: "analytics", label: "Analytics", icon: "BarChart3", critical: true, seedHint: "Dati simulati realistici" },
];

/* ═══════════════════════════════════════════════════════════════════
   SEED DATASET MINIMI PER SETTORE
   ═══════════════════════════════════════════════════════════════════ */

const SEED_DATASETS: Partial<Record<IndustryId | string, SeedDataset>> = {
  food:        { minClients: 8, minOrders: 10, minCatalog: 16, catalogType: "Piatti del menu", minReviews: 6, needsSchedule: true },
  ncc:         { minClients: 6, minOrders: 8,  minCatalog: 6,  catalogType: "Tratte / veicoli", minReviews: 5, needsSchedule: true },
  beauty:      { minClients: 8, minOrders: 10, minCatalog: 12, catalogType: "Servizi salone",   minReviews: 8, needsSchedule: true },
  healthcare:  { minClients: 8, minOrders: 8,  minCatalog: 10, catalogType: "Prestazioni",      minReviews: 5, needsSchedule: true },
  retail:      { minClients: 6, minOrders: 12, minCatalog: 24, catalogType: "Prodotti",         minReviews: 8, needsSchedule: false },
  fitness:     { minClients: 8, minOrders: 6,  minCatalog: 10, catalogType: "Corsi & PT",       minReviews: 6, needsSchedule: true },
  hospitality: { minClients: 6, minOrders: 8,  minCatalog: 8,  catalogType: "Camere",           minReviews: 8, needsSchedule: true },
  hotel:       { minClients: 6, minOrders: 8,  minCatalog: 8,  catalogType: "Camere",           minReviews: 8, needsSchedule: true },
  beach:       { minClients: 6, minOrders: 10, minCatalog: 60, catalogType: "Postazioni mappa", minReviews: 5, needsSchedule: true },
  bakery:      { minClients: 6, minOrders: 10, minCatalog: 14, catalogType: "Prodotti forno",   minReviews: 5, needsSchedule: true },
  agriturismo: { minClients: 5, minOrders: 6,  minCatalog: 10, catalogType: "Camere & esperienze", minReviews: 6, needsSchedule: true },
  plumber:     { minClients: 6, minOrders: 6,  minCatalog: 8,  catalogType: "Tipi intervento",  minReviews: 4, needsSchedule: true },
  electrician: { minClients: 6, minOrders: 6,  minCatalog: 8,  catalogType: "Tipi intervento",  minReviews: 4, needsSchedule: true },
  cleaning:    { minClients: 6, minOrders: 8,  minCatalog: 6,  catalogType: "Pacchetti pulizia",minReviews: 5, needsSchedule: true },
  legal:       { minClients: 6, minOrders: 6,  minCatalog: 6,  catalogType: "Aree pratica",     minReviews: 3, needsSchedule: true },
  accounting:  { minClients: 8, minOrders: 8,  minCatalog: 6,  catalogType: "Servizi fiscali",  minReviews: 3, needsSchedule: true },
  garage:      { minClients: 6, minOrders: 8,  minCatalog: 10, catalogType: "Tipi lavorazione", minReviews: 5, needsSchedule: true },
  photography: { minClients: 6, minOrders: 6,  minCatalog: 8,  catalogType: "Pacchetti shoot",  minReviews: 6, needsSchedule: true },
  construction:{ minClients: 5, minOrders: 4,  minCatalog: 6,  catalogType: "Tipi cantiere",    minReviews: 4, needsSchedule: false },
  gardening:   { minClients: 6, minOrders: 6,  minCatalog: 8,  catalogType: "Servizi giardino", minReviews: 5, needsSchedule: true },
  veterinary:  { minClients: 8, minOrders: 8,  minCatalog: 10, catalogType: "Prestazioni",      minReviews: 6, needsSchedule: true },
  tattoo:      { minClients: 6, minOrders: 6,  minCatalog: 8,  catalogType: "Style tatuaggio",  minReviews: 8, needsSchedule: true },
  childcare:   { minClients: 6, minOrders: 0,  minCatalog: 6,  catalogType: "Programmi",        minReviews: 6, needsSchedule: true },
  education:   { minClients: 8, minOrders: 0,  minCatalog: 8,  catalogType: "Corsi",            minReviews: 6, needsSchedule: true },
  events:      { minClients: 5, minOrders: 5,  minCatalog: 6,  catalogType: "Tipi evento",      minReviews: 5, needsSchedule: true },
  logistics:   { minClients: 6, minOrders: 12, minCatalog: 6,  catalogType: "Tipi spedizione",  minReviews: 4, needsSchedule: true },
  custom:      { minClients: 5, minOrders: 5,  minCatalog: 5,  catalogType: "Servizi",          minReviews: 3, needsSchedule: false },
};

/* ═══════════════════════════════════════════════════════════════════
   BLOCCHI SITO MINIMI PER SETTORE
   ═══════════════════════════════════════════════════════════════════ */

const SITE_BLOCKS_BY_SECTOR: Partial<Record<string, RequiredSiteBlock[]>> = {
  food: [
    { id: "hero", label: "Hero ristorante", type: "hero", critical: true },
    { id: "menu", label: "Menu digitale", type: "menu", critical: true },
    { id: "gallery", label: "Galleria piatti", type: "gallery", critical: true },
    { id: "booking", label: "Prenotazione tavolo", type: "booking", critical: true },
    { id: "reviews", label: "Recensioni", type: "reviews", critical: true },
    { id: "contacts", label: "Contatti & mappa", type: "contacts", critical: true },
  ],
  ncc: [
    { id: "hero", label: "Hero flotta", type: "hero", critical: true },
    { id: "fleet", label: "Flotta veicoli", type: "fleet", critical: true },
    { id: "services", label: "Tratte & tour", type: "services", critical: true },
    { id: "booking", label: "Booking transfer", type: "booking", critical: true },
    { id: "reviews", label: "Testimonianze", type: "reviews", critical: true },
    { id: "contacts", label: "Contatti WhatsApp", type: "contacts", critical: true },
  ],
  beauty: [
    { id: "hero", label: "Hero salone", type: "hero", critical: true },
    { id: "services", label: "Listino trattamenti", type: "services", critical: true },
    { id: "team", label: "Operatrici", type: "team", critical: true },
    { id: "gallery", label: "Portfolio before/after", type: "gallery", critical: true },
    { id: "booking", label: "Prenotazione online", type: "booking", critical: true },
    { id: "loyalty", label: "Fidelity card", type: "loyalty", critical: false },
    { id: "contacts", label: "Contatti & mappa", type: "contacts", critical: true },
  ],
  healthcare: [
    { id: "hero", label: "Hero studio medico", type: "hero", critical: true },
    { id: "services", label: "Prestazioni", type: "services", critical: true },
    { id: "team", label: "Equipe medica", type: "team", critical: true },
    { id: "booking", label: "Prenotazione visita", type: "booking", critical: true },
    { id: "contacts", label: "Contatti & GDPR", type: "contacts", critical: true },
  ],
  retail: [
    { id: "hero", label: "Hero negozio", type: "hero", critical: true },
    { id: "shop", label: "Catalogo prodotti", type: "shop", critical: true },
    { id: "gallery", label: "Lookbook", type: "gallery", critical: false },
    { id: "loyalty", label: "Fidelity", type: "loyalty", critical: false },
    { id: "contacts", label: "Negozio fisico", type: "contacts", critical: true },
  ],
  fitness: [
    { id: "hero", label: "Hero palestra", type: "hero", critical: true },
    { id: "classes", label: "Calendario corsi", type: "classes", critical: true },
    { id: "membership", label: "Abbonamenti", type: "membership", critical: true },
    { id: "team", label: "Trainer", type: "team", critical: true },
    { id: "booking", label: "Prova senza impegno", type: "booking", critical: true },
    { id: "contacts", label: "Contatti", type: "contacts", critical: true },
  ],
  hospitality: [
    { id: "hero", label: "Hero struttura", type: "hero", critical: true },
    { id: "rooms", label: "Camere", type: "rooms", critical: true },
    { id: "gallery", label: "Galleria", type: "gallery", critical: true },
    { id: "services", label: "Servizi & SPA", type: "services", critical: true },
    { id: "booking", label: "Booking diretto", type: "booking", critical: true },
    { id: "reviews", label: "Recensioni ospiti", type: "reviews", critical: true },
    { id: "contacts", label: "Come arrivare", type: "contacts", critical: true },
  ],
  beach: [
    { id: "hero", label: "Hero stabilimento", type: "hero", critical: true },
    { id: "map", label: "Mappa ombrelloni", type: "map", critical: true },
    { id: "membership", label: "Abbonamenti stagionali", type: "membership", critical: true },
    { id: "menu", label: "Menu bar / ristorante", type: "menu", critical: false },
    { id: "gallery", label: "Galleria spiaggia", type: "gallery", critical: true },
    { id: "contacts", label: "Contatti & meteo", type: "contacts", critical: true },
  ],
  bakery: [
    { id: "hero", label: "Hero bakery", type: "hero", critical: true },
    { id: "menu", label: "Prodotti del giorno", type: "menu", critical: true },
    { id: "gallery", label: "Galleria forno", type: "gallery", critical: true },
    { id: "booking", label: "Preordine", type: "booking", critical: true },
    { id: "contacts", label: "Punti vendita", type: "contacts", critical: true },
  ],
};

/* fallback "service-business" generico */
const DEFAULT_SITE_BLOCKS: RequiredSiteBlock[] = [
  { id: "hero", label: "Hero attività", type: "hero", critical: true },
  { id: "services", label: "Servizi offerti", type: "services", critical: true },
  { id: "portfolio", label: "Portfolio lavori", type: "portfolio", critical: false },
  { id: "team", label: "Team", type: "team", critical: false },
  { id: "booking", label: "Richiedi preventivo", type: "booking", critical: true },
  { id: "reviews", label: "Recensioni clienti", type: "reviews", critical: true },
  { id: "contacts", label: "Contatti", type: "contacts", critical: true },
];

/* ═══════════════════════════════════════════════════════════════════
   TEMPLATE iPHONE CANONICO PER SETTORE
   (sincronizzato col preview-matcher; usato come fallback quando l'AI
    non sceglie un variant esplicito)
   ═══════════════════════════════════════════════════════════════════ */

const DEFAULT_VARIANT_BY_SECTOR: Partial<Record<string, string>> = {
  food: "cote-ivory",
  ncc: "asinara-azure",
  beauty: "neo-nails-lavender",
  healthcare: "cote-ivory",
  retail: "cote-marble",
  fitness: "city-padel-sage",
  hospitality: "cote-marble",
  hotel: "cote-marble",
  beach: "miami-watersports",
  bakery: "cote-ivory",
  agriturismo: "cote-ivory",
  plumber: "cote-obsidian",
  electrician: "cote-obsidian",
  cleaning: "cote-ivory",
  legal: "cote-marble",
  accounting: "cote-marble",
  garage: "cote-obsidian",
  photography: "cote-marble",
  construction: "cote-obsidian",
  gardening: "city-padel-sage",
  veterinary: "neo-nails-lavender",
  tattoo: "cote-obsidian",
  childcare: "neo-nails-lavender",
  education: "cote-marble",
  events: "cote-marble",
  logistics: "cote-obsidian",
  custom: "cote-ivory",
};

/* ═══════════════════════════════════════════════════════════════════
   API PUBBLICA
   ═══════════════════════════════════════════════════════════════════ */

export function getDemoCompleteness(rawSectorId: string): SectorCompleteness {
  const sectorId = (rawSectorId || "custom").toLowerCase();
  const industry = INDUSTRY_CONFIGS[sectorId as IndustryId] || INDUSTRY_CONFIGS.custom;
  const sectorCfg = SECTOR_CONFIGS[sectorId];

  const sectorAgents = SECTOR_AGENTS[sectorId] || [];
  const agents: RequiredAgent[] = [...UNIVERSAL_REQUIRED, ...sectorAgents];

  // moduli universali + moduli del settore (industry-config) + moduli ricchi (sectorConfig)
  const fromIndustry: RequiredModule[] = (industry?.modules || []).map((m) => ({
    id: m.id,
    label: m.label,
    icon: m.icon,
    critical: true,
  }));
  const fromSectorRich: RequiredModule[] = (sectorCfg?.adminModules || []).map((m) => ({
    id: m.route || m.label.toLowerCase(),
    label: m.label,
    icon: m.icon,
    critical: true,
  }));
  // dedup per id+label
  const map = new Map<string, RequiredModule>();
  for (const m of [...UNIVERSAL_MODULES, ...fromIndustry, ...fromSectorRich]) {
    const key = `${m.id}|${m.label}`.toLowerCase();
    if (!map.has(key)) map.set(key, m);
  }
  const modules = Array.from(map.values());

  const siteBlocks = SITE_BLOCKS_BY_SECTOR[sectorId] || DEFAULT_SITE_BLOCKS;
  const seed = SEED_DATASETS[sectorId] || SEED_DATASETS.custom!;
  const defaultTemplateVariant = DEFAULT_VARIANT_BY_SECTOR[sectorId] || "cote-ivory";

  return {
    sectorId,
    label: industry?.label || sectorCfg?.name || sectorId,
    defaultTemplateVariant,
    agents,
    modules,
    siteBlocks,
    seed,
    exampleBadgeLabel: "Esempio personalizzabile",
    exampleBadgeTooltip:
      "Dati di esempio realistici per il tuo settore. Il titolare può modificare ogni voce in 1 click dal pannello.",
  };
}

/** True se il modulo è classificato "critical" per la demo del settore. */
export function isCriticalModule(sectorId: string, moduleIdOrLabel: string): boolean {
  const completeness = getDemoCompleteness(sectorId);
  const key = moduleIdOrLabel.toLowerCase();
  return completeness.modules.some(
    (m) => m.critical && (m.id.toLowerCase() === key || m.label.toLowerCase() === key),
  );
}

/** Lista chiavi agenti settoriali (escludendo universali) — utile in seed. */
export function getSectorOnlyAgentKeys(sectorId: string): string[] {
  const sectorAgents = SECTOR_AGENTS[(sectorId || "").toLowerCase()] || [];
  return sectorAgents.map((a) => a.key);
}

/** Sector-specific features list, riusato da componenti UI esistenti. */
export function getSectorFeaturesList(sectorId: string) {
  return SECTOR_SPECIFIC_FEATURES[sectorId] || [];
}
