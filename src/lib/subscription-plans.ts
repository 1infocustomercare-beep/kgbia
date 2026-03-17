// ── Subscription plan → feature gate mapping ──────────────────────────
// Universal for ALL sectors (Food, NCC, Beauty, Healthcare, etc.)

import type { IndustryId } from "@/config/industry-config";

export type PlanId = "essential" | "smart_ia" | "empire_pro";

export type FeatureKey =
  | "menu_qr"
  | "orders"
  | "dashboard"
  | "support_email"
  | "ai_assistant"
  | "ai_tokens"
  | "auto_translations"
  | "analytics_advanced"
  | "reservations"
  | "crm_customers"
  | "push_notifications"
  | "priority_support"
  | "multi_language"
  | "lost_customers"
  | "review_shield"
  | "upselling"
  | "private_chat"
  | "table_map"
  | "loyalty_wallet"
  | "inventory_ai"
  | "fiscal_vault"
  // Non-food features
  | "appointments"
  | "interventions"
  | "fleet_management"
  | "route_planning"
  | "driver_management"
  | "online_booking"
  | "service_catalog"
  | "client_history"
  | "team_management"
  | "automations"
  | "whatsapp_business"
  | "custom_site"
  | "api_access";

export interface PlanConfig {
  id: PlanId;
  name: string;
  price: number;
  yearlyPrice: number;
  features: Set<FeatureKey>;
}

const ESSENTIAL_FEATURES: FeatureKey[] = [
  "menu_qr",
  "orders",
  "dashboard",
  "support_email",
  "table_map",
  "appointments",
  "interventions",
  "fleet_management",
  "online_booking",
  "service_catalog",
];

const SMART_IA_FEATURES: FeatureKey[] = [
  ...ESSENTIAL_FEATURES,
  "ai_assistant",
  "ai_tokens",
  "auto_translations",
  "analytics_advanced",
  "private_chat",
  "review_shield",
  "upselling",
  "inventory_ai",
  "fiscal_vault",
  "client_history",
  "team_management",
  "automations",
  "whatsapp_business",
  "route_planning",
  "driver_management",
];

const EMPIRE_PRO_FEATURES: FeatureKey[] = [
  ...SMART_IA_FEATURES,
  "reservations",
  "crm_customers",
  "push_notifications",
  "priority_support",
  "multi_language",
  "lost_customers",
  "loyalty_wallet",
  "custom_site",
  "api_access",
];

export const PLAN_CONFIGS: Record<PlanId, PlanConfig> = {
  essential: {
    id: "essential",
    name: "Essential",
    price: 29,
    yearlyPrice: 24,
    features: new Set(ESSENTIAL_FEATURES),
  },
  smart_ia: {
    id: "smart_ia",
    name: "Smart IA",
    price: 59,
    yearlyPrice: 49,
    features: new Set(SMART_IA_FEATURES),
  },
  empire_pro: {
    id: "empire_pro",
    name: "Empire Pro",
    price: 89,
    yearlyPrice: 74,
    features: new Set(EMPIRE_PRO_FEATURES),
  },
};

/** During trial, all features are unlocked. */
export function hasFeature(
  plan: string | undefined,
  status: string | undefined,
  feature: FeatureKey,
): boolean {
  if (status === "trialing") return true;
  const normalizedPlan = normalizePlanId(plan);
  return PLAN_CONFIGS[normalizedPlan].features.has(feature);
}

export function normalizePlanId(plan: string | undefined): PlanId {
  if (plan === "smart_ia" || plan === "empire_pro") return plan;
  return "essential";
}

/** Returns the minimum plan required for a feature */
export function getRequiredPlan(feature: FeatureKey): PlanId {
  if (PLAN_CONFIGS.essential.features.has(feature)) return "essential";
  if (PLAN_CONFIGS.smart_ia.features.has(feature)) return "smart_ia";
  return "empire_pro";
}

/** Feature display metadata for upgrade prompts */
export const FEATURE_LABELS: Record<FeatureKey, string> = {
  menu_qr: "Menu QR",
  orders: "Ordini",
  dashboard: "Dashboard",
  support_email: "Supporto Email",
  ai_assistant: "Assistente IA",
  ai_tokens: "Gettoni IA",
  auto_translations: "Traduzioni Automatiche",
  analytics_advanced: "Analytics Avanzati",
  reservations: "Prenotazioni",
  crm_customers: "CRM Clienti",
  push_notifications: "Notifiche Push",
  priority_support: "Supporto Prioritario",
  multi_language: "Multi-Lingua",
  lost_customers: "Clienti Persi",
  review_shield: "Scudo Recensioni",
  upselling: "Upselling",
  private_chat: "Chat Privata",
  table_map: "Mappa Tavoli",
  loyalty_wallet: "Wallet Fedeltà",
  inventory_ai: "Scorte IA",
  fiscal_vault: "Vault Fiscale",
  appointments: "Appuntamenti",
  interventions: "Interventi",
  fleet_management: "Gestione Flotta",
  route_planning: "Pianificazione Tratte",
  driver_management: "Gestione Autisti",
  online_booking: "Prenotazioni Online",
  service_catalog: "Catalogo Servizi",
  client_history: "Storico Clienti",
  team_management: "Gestione Team",
  automations: "Automazioni",
  whatsapp_business: "WhatsApp Business",
  custom_site: "Sito Personalizzato",
  api_access: "Accesso API",
};

// ── Industry-adaptive plan feature descriptions ──────────────────────
// Each sector sees features described in its own terminology.

interface PlanFeatureDisplay {
  text: string;
  included: boolean;
}

interface IndustryPlanDisplay {
  essential: PlanFeatureDisplay[];
  smart_ia: PlanFeatureDisplay[];
  empire_pro: PlanFeatureDisplay[];
}

const DEFAULT_PLAN_FEATURES: IndustryPlanDisplay = {
  essential: [
    { text: "Dashboard completa", included: true },
    { text: "Catalogo / Listino digitale", included: true },
    { text: "Gestione ordini", included: true },
    { text: "CRM base", included: true },
    { text: "50 gettoni IA/mese", included: true },
    { text: "2 membri team", included: true },
    { text: "Sito pubblico base", included: true },
    { text: "Supporto email", included: true },
    { text: "Automazioni avanzate", included: false },
    { text: "Agent IA", included: false },
    { text: "Multi-lingua", included: false },
  ],
  smart_ia: [
    { text: "Tutto di Essential", included: true },
    { text: "IA avanzata — 200 gettoni", included: true },
    { text: "10 membri team", included: true },
    { text: "Dominio personalizzato", included: true },
    { text: "Automazioni WhatsApp", included: true },
    { text: "Report e analytics avanzati", included: true },
    { text: "Review Shield™", included: true },
    { text: "Supporto prioritario", included: true },
    { text: "1 Agent IA incluso", included: true },
    { text: "Multi-sede", included: false },
    { text: "API access", included: false },
  ],
  empire_pro: [
    { text: "Tutto di Smart IA", included: true },
    { text: "500 gettoni IA/mese", included: true },
    { text: "Team illimitato", included: true },
    { text: "Multi-sede", included: true },
    { text: "API access completo", included: true },
    { text: "3 Agent IA inclusi", included: true },
    { text: "Account manager dedicato", included: true },
    { text: "Funzioni custom prioritarie", included: true },
    { text: "Cross-selling IA", included: true },
    { text: "Programma fedeltà avanzato", included: true },
    { text: "SLA garantito", included: true },
  ],
};

const INDUSTRY_PLAN_FEATURES: Partial<Record<IndustryId, IndustryPlanDisplay>> = {
  food: {
    essential: [
      { text: "Dashboard ristorante", included: true },
      { text: "Menu QR illimitato", included: true },
      { text: "Ordini tavolo / asporto / delivery", included: true },
      { text: "Mappa tavoli", included: true },
      { text: "50 gettoni IA/mese", included: true },
      { text: "2 membri staff", included: true },
      { text: "Sito pubblico base", included: true },
      { text: "Supporto email", included: true },
      { text: "Cucina display / HACCP", included: false },
      { text: "Agent IA", included: false },
      { text: "Multi-lingua menu", included: false },
    ],
    smart_ia: [
      { text: "Tutto di Essential", included: true },
      { text: "IA avanzata — 200 gettoni", included: true },
      { text: "10 membri staff", included: true },
      { text: "Review Shield™", included: true },
      { text: "Upselling intelligente", included: true },
      { text: "Inventario IA", included: true },
      { text: "Vault fiscale", included: true },
      { text: "Chat privata clienti", included: true },
      { text: "1 Agent IA incluso", included: true },
      { text: "Multi-sede", included: false },
      { text: "Programma fedeltà", included: false },
    ],
    empire_pro: [
      { text: "Tutto di Smart IA", included: true },
      { text: "500 gettoni IA/mese", included: true },
      { text: "Staff illimitato", included: true },
      { text: "Multi-sede", included: true },
      { text: "CRM clienti avanzato", included: true },
      { text: "3 Agent IA inclusi", included: true },
      { text: "Wallet fedeltà", included: true },
      { text: "Multi-lingua completo", included: true },
      { text: "Notifiche push", included: true },
      { text: "Account manager dedicato", included: true },
      { text: "SLA garantito", included: true },
    ],
  },
  ncc: {
    essential: [
      { text: "Dashboard NCC", included: true },
      { text: "Gestione flotta veicoli", included: true },
      { text: "Prenotazioni corse", included: true },
      { text: "Listino tratte base", included: true },
      { text: "50 gettoni IA/mese", included: true },
      { text: "2 autisti", included: true },
      { text: "Sito pubblico base", included: true },
      { text: "Supporto email", included: true },
      { text: "Mappa autisti live", included: false },
      { text: "Cross-selling servizi", included: false },
      { text: "Multi-lingua", included: false },
    ],
    smart_ia: [
      { text: "Tutto di Essential", included: true },
      { text: "IA avanzata — 200 gettoni", included: true },
      { text: "10 autisti", included: true },
      { text: "Matrice prezzi dinamica", included: true },
      { text: "CRM passeggeri VIP", included: true },
      { text: "Automazioni WhatsApp", included: true },
      { text: "Scadenzario documenti", included: true },
      { text: "Report e analytics", included: true },
      { text: "1 Agent IA incluso", included: true },
      { text: "Multi-sede", included: false },
      { text: "API access", included: false },
    ],
    empire_pro: [
      { text: "Tutto di Smart IA", included: true },
      { text: "500 gettoni IA/mese", included: true },
      { text: "Autisti illimitati", included: true },
      { text: "Multi-sede / Multi-flotta", included: true },
      { text: "API access completo", included: true },
      { text: "3 Agent IA inclusi", included: true },
      { text: "Cross-selling tour", included: true },
      { text: "Account manager dedicato", included: true },
      { text: "Ricevute automatiche", included: true },
      { text: "Mappa live autisti", included: true },
      { text: "SLA garantito", included: true },
    ],
  },
  beauty: {
    essential: [
      { text: "Dashboard salone", included: true },
      { text: "Agenda appuntamenti", included: true },
      { text: "Catalogo trattamenti", included: true },
      { text: "CRM clienti base", included: true },
      { text: "50 gettoni IA/mese", included: true },
      { text: "2 operatori", included: true },
      { text: "Sito pubblico base", included: true },
      { text: "Supporto email", included: true },
      { text: "Storico trattamenti", included: false },
      { text: "Agent IA", included: false },
      { text: "Programma fedeltà", included: false },
    ],
    smart_ia: [
      { text: "Tutto di Essential", included: true },
      { text: "IA avanzata — 200 gettoni", included: true },
      { text: "10 operatori", included: true },
      { text: "Storico completo clienti", included: true },
      { text: "Promemoria WhatsApp", included: true },
      { text: "Review Shield™", included: true },
      { text: "Analytics avanzati", included: true },
      { text: "Gestione prodotti", included: true },
      { text: "1 Agent IA incluso", included: true },
      { text: "Multi-sede", included: false },
      { text: "API access", included: false },
    ],
    empire_pro: [
      { text: "Tutto di Smart IA", included: true },
      { text: "500 gettoni IA/mese", included: true },
      { text: "Operatori illimitati", included: true },
      { text: "Multi-sede", included: true },
      { text: "Programma fedeltà", included: true },
      { text: "3 Agent IA inclusi", included: true },
      { text: "Account manager dedicato", included: true },
      { text: "Funzioni custom", included: true },
      { text: "Notifiche push", included: true },
      { text: "Multi-lingua", included: true },
      { text: "SLA garantito", included: true },
    ],
  },
  healthcare: {
    essential: [
      { text: "Dashboard studio medico", included: true },
      { text: "Agenda appuntamenti", included: true },
      { text: "Schede pazienti", included: true },
      { text: "Listino prestazioni", included: true },
      { text: "50 gettoni IA/mese", included: true },
      { text: "2 collaboratori", included: true },
      { text: "Sito pubblico base", included: true },
      { text: "Supporto email", included: true },
      { text: "Cartella clinica digitale", included: false },
      { text: "Telemedicina", included: false },
      { text: "Multi-lingua", included: false },
    ],
    smart_ia: [
      { text: "Tutto di Essential", included: true },
      { text: "IA avanzata — 200 gettoni", included: true },
      { text: "10 collaboratori", included: true },
      { text: "Promemoria appuntamenti", included: true },
      { text: "Automazioni WhatsApp", included: true },
      { text: "Analytics avanzati", included: true },
      { text: "Fatturazione elettronica", included: true },
      { text: "Supporto prioritario", included: true },
      { text: "1 Agent IA incluso", included: true },
      { text: "Telemedicina", included: false },
      { text: "API access", included: false },
    ],
    empire_pro: [
      { text: "Tutto di Smart IA", included: true },
      { text: "500 gettoni IA/mese", included: true },
      { text: "Team illimitato", included: true },
      { text: "Multi-sede / Multi-studio", included: true },
      { text: "Telemedicina integrata", included: true },
      { text: "3 Agent IA inclusi", included: true },
      { text: "Account manager dedicato", included: true },
      { text: "API access completo", included: true },
      { text: "Notifiche push pazienti", included: true },
      { text: "Multi-lingua", included: true },
      { text: "SLA garantito", included: true },
    ],
  },
  plumber: {
    essential: [
      { text: "Dashboard interventi", included: true },
      { text: "Gestione lavori", included: true },
      { text: "CRM clienti", included: true },
      { text: "Magazzino materiali", included: true },
      { text: "50 gettoni IA/mese", included: true },
      { text: "2 tecnici", included: true },
      { text: "Sito pubblico base", included: true },
      { text: "Supporto email", included: true },
      { text: "Preventivi automatici", included: false },
      { text: "Agent IA", included: false },
      { text: "Foto interventi", included: false },
    ],
    smart_ia: [
      { text: "Tutto di Essential", included: true },
      { text: "IA avanzata — 200 gettoni", included: true },
      { text: "10 tecnici", included: true },
      { text: "Preventivi IA", included: true },
      { text: "Foto e documentazione lavori", included: true },
      { text: "Automazioni WhatsApp", included: true },
      { text: "Fatturazione elettronica", included: true },
      { text: "Analytics avanzati", included: true },
      { text: "1 Agent IA incluso", included: true },
      { text: "Multi-sede", included: false },
      { text: "API access", included: false },
    ],
    empire_pro: [
      { text: "Tutto di Smart IA", included: true },
      { text: "500 gettoni IA/mese", included: true },
      { text: "Tecnici illimitati", included: true },
      { text: "Multi-sede", included: true },
      { text: "API access completo", included: true },
      { text: "3 Agent IA inclusi", included: true },
      { text: "Account manager dedicato", included: true },
      { text: "Funzioni custom", included: true },
      { text: "GPS tracking squadre", included: true },
      { text: "Notifiche push clienti", included: true },
      { text: "SLA garantito", included: true },
    ],
  },
  electrician: {
    essential: [
      { text: "Dashboard lavori", included: true },
      { text: "Gestione interventi", included: true },
      { text: "CRM clienti", included: true },
      { text: "Magazzino componenti", included: true },
      { text: "50 gettoni IA/mese", included: true },
      { text: "2 tecnici", included: true },
      { text: "Sito pubblico base", included: true },
      { text: "Supporto email", included: true },
      { text: "Certificazioni", included: false },
      { text: "Agent IA", included: false },
      { text: "Preventivi auto", included: false },
    ],
    smart_ia: [
      { text: "Tutto di Essential", included: true },
      { text: "IA avanzata — 200 gettoni", included: true },
      { text: "10 tecnici", included: true },
      { text: "Gestione certificazioni", included: true },
      { text: "Preventivi IA", included: true },
      { text: "Automazioni WhatsApp", included: true },
      { text: "Fatturazione elettronica", included: true },
      { text: "Analytics avanzati", included: true },
      { text: "1 Agent IA incluso", included: true },
      { text: "Multi-sede", included: false },
      { text: "API access", included: false },
    ],
    empire_pro: [
      { text: "Tutto di Smart IA", included: true },
      { text: "500 gettoni IA/mese", included: true },
      { text: "Tecnici illimitati", included: true },
      { text: "Multi-sede", included: true },
      { text: "API access completo", included: true },
      { text: "3 Agent IA inclusi", included: true },
      { text: "Account manager dedicato", included: true },
      { text: "Funzioni custom", included: true },
      { text: "Notifiche push", included: true },
      { text: "GPS tracking", included: true },
      { text: "SLA garantito", included: true },
    ],
  },
  construction: {
    essential: [
      { text: "Dashboard cantieri", included: true },
      { text: "Gestione cantieri", included: true },
      { text: "CRM committenti", included: true },
      { text: "Magazzino materiali", included: true },
      { text: "50 gettoni IA/mese", included: true },
      { text: "2 operai", included: true },
      { text: "Sito pubblico base", included: true },
      { text: "Supporto email", included: true },
      { text: "Preventivi automatici", included: false },
      { text: "Agent IA", included: false },
      { text: "Foto cantiere", included: false },
    ],
    smart_ia: [
      { text: "Tutto di Essential", included: true },
      { text: "IA avanzata — 200 gettoni", included: true },
      { text: "10 operai / squadre", included: true },
      { text: "Preventivi IA", included: true },
      { text: "Documentazione foto cantiere", included: true },
      { text: "Automazioni WhatsApp", included: true },
      { text: "Fatturazione", included: true },
      { text: "Analytics avanzati", included: true },
      { text: "1 Agent IA incluso", included: true },
      { text: "Multi-cantiere", included: false },
      { text: "API access", included: false },
    ],
    empire_pro: [
      { text: "Tutto di Smart IA", included: true },
      { text: "500 gettoni IA/mese", included: true },
      { text: "Team illimitato", included: true },
      { text: "Multi-cantiere", included: true },
      { text: "API access completo", included: true },
      { text: "3 Agent IA inclusi", included: true },
      { text: "Account manager dedicato", included: true },
      { text: "Timeline progetti", included: true },
      { text: "GPS tracking squadre", included: true },
      { text: "Notifiche push", included: true },
      { text: "SLA garantito", included: true },
    ],
  },
  fitness: {
    essential: [
      { text: "Dashboard palestra", included: true },
      { text: "Gestione corsi", included: true },
      { text: "Iscrizioni membri", included: true },
      { text: "Scheda allenamento base", included: true },
      { text: "50 gettoni IA/mese", included: true },
      { text: "2 trainer", included: true },
      { text: "Sito pubblico base", included: true },
      { text: "Supporto email", included: true },
      { text: "Tracking progressi", included: false },
      { text: "Agent IA", included: false },
      { text: "Programma fedeltà", included: false },
    ],
    smart_ia: [
      { text: "Tutto di Essential", included: true },
      { text: "IA avanzata — 200 gettoni", included: true },
      { text: "10 trainer", included: true },
      { text: "Tracking progressi", included: true },
      { text: "Promemoria WhatsApp", included: true },
      { text: "Analytics avanzati", included: true },
      { text: "Review Shield™", included: true },
      { text: "Supporto prioritario", included: true },
      { text: "1 Agent IA incluso", included: true },
      { text: "Multi-sede", included: false },
      { text: "API access", included: false },
    ],
    empire_pro: [
      { text: "Tutto di Smart IA", included: true },
      { text: "500 gettoni IA/mese", included: true },
      { text: "Trainer illimitati", included: true },
      { text: "Multi-sede", included: true },
      { text: "Programma fedeltà", included: true },
      { text: "3 Agent IA inclusi", included: true },
      { text: "Account manager dedicato", included: true },
      { text: "Funzioni custom", included: true },
      { text: "Notifiche push", included: true },
      { text: "Multi-lingua", included: true },
      { text: "SLA garantito", included: true },
    ],
  },
  hospitality: {
    essential: [
      { text: "Dashboard struttura", included: true },
      { text: "Gestione camere", included: true },
      { text: "Prenotazioni", included: true },
      { text: "Check-in / Check-out", included: true },
      { text: "50 gettoni IA/mese", included: true },
      { text: "2 collaboratori", included: true },
      { text: "Sito pubblico base", included: true },
      { text: "Supporto email", included: true },
      { text: "Concierge digitale", included: false },
      { text: "Agent IA", included: false },
      { text: "Multi-lingua", included: false },
    ],
    smart_ia: [
      { text: "Tutto di Essential", included: true },
      { text: "IA avanzata — 200 gettoni", included: true },
      { text: "10 collaboratori", included: true },
      { text: "Concierge IA", included: true },
      { text: "Automazioni WhatsApp", included: true },
      { text: "Housekeeping digitale", included: true },
      { text: "Review Shield™", included: true },
      { text: "Analytics avanzati", included: true },
      { text: "1 Agent IA incluso", included: true },
      { text: "Channel manager", included: false },
      { text: "API access", included: false },
    ],
    empire_pro: [
      { text: "Tutto di Smart IA", included: true },
      { text: "500 gettoni IA/mese", included: true },
      { text: "Staff illimitato", included: true },
      { text: "Multi-struttura", included: true },
      { text: "Channel manager", included: true },
      { text: "3 Agent IA inclusi", included: true },
      { text: "Account manager dedicato", included: true },
      { text: "Multi-lingua completo", included: true },
      { text: "Notifiche push ospiti", included: true },
      { text: "API access completo", included: true },
      { text: "SLA garantito", included: true },
    ],
  },
  retail: {
    essential: [
      { text: "Dashboard negozio", included: true },
      { text: "Catalogo prodotti", included: true },
      { text: "Gestione ordini", included: true },
      { text: "Magazzino base", included: true },
      { text: "50 gettoni IA/mese", included: true },
      { text: "2 commessi", included: true },
      { text: "Sito pubblico base", included: true },
      { text: "Supporto email", included: true },
      { text: "Inventario IA", included: false },
      { text: "Agent IA", included: false },
      { text: "Programma fedeltà", included: false },
    ],
    smart_ia: [
      { text: "Tutto di Essential", included: true },
      { text: "IA avanzata — 200 gettoni", included: true },
      { text: "10 commessi", included: true },
      { text: "Inventario IA", included: true },
      { text: "Automazioni WhatsApp", included: true },
      { text: "Analytics vendite", included: true },
      { text: "Review Shield™", included: true },
      { text: "Supporto prioritario", included: true },
      { text: "1 Agent IA incluso", included: true },
      { text: "Multi-sede", included: false },
      { text: "API access", included: false },
    ],
    empire_pro: [
      { text: "Tutto di Smart IA", included: true },
      { text: "500 gettoni IA/mese", included: true },
      { text: "Team illimitato", included: true },
      { text: "Multi-punto vendita", included: true },
      { text: "Programma fedeltà", included: true },
      { text: "3 Agent IA inclusi", included: true },
      { text: "Account manager dedicato", included: true },
      { text: "API access completo", included: true },
      { text: "Notifiche push", included: true },
      { text: "Multi-lingua", included: true },
      { text: "SLA garantito", included: true },
    ],
  },
  beach: {
    essential: [
      { text: "Dashboard spiaggia", included: true },
      { text: "Mappa postazioni live", included: true },
      { text: "Prenotazioni ombrelloni", included: true },
      { text: "Abbonamenti stagionali", included: true },
      { text: "50 gettoni IA/mese", included: true },
      { text: "2 operatori", included: true },
      { text: "Sito pubblico base", included: true },
      { text: "Supporto email", included: true },
      { text: "Analytics occupazione", included: false },
      { text: "Agent IA", included: false },
      { text: "Multi-lingua", included: false },
    ],
    smart_ia: [
      { text: "Tutto di Essential", included: true },
      { text: "IA avanzata — 200 gettoni", included: true },
      { text: "10 operatori", included: true },
      { text: "Analytics occupazione", included: true },
      { text: "Automazioni WhatsApp", included: true },
      { text: "Review Shield™", included: true },
      { text: "Gestione bar/ristoro", included: true },
      { text: "Supporto prioritario", included: true },
      { text: "1 Agent IA incluso", included: true },
      { text: "Multi-sede", included: false },
      { text: "API access", included: false },
    ],
    empire_pro: [
      { text: "Tutto di Smart IA", included: true },
      { text: "500 gettoni IA/mese", included: true },
      { text: "Team illimitato", included: true },
      { text: "Multi-stabilimento", included: true },
      { text: "API access completo", included: true },
      { text: "3 Agent IA inclusi", included: true },
      { text: "Account manager dedicato", included: true },
      { text: "Multi-lingua", included: true },
      { text: "Notifiche push ospiti", included: true },
      { text: "Programma fedeltà", included: true },
      { text: "SLA garantito", included: true },
    ],
  },
};

/**
 * Get plan feature descriptions adapted to the sector.
 * Falls back to the default generic descriptions if no industry-specific config exists.
 */
export function getIndustryPlanFeatures(
  industry: IndustryId | undefined,
): IndustryPlanDisplay {
  if (industry && INDUSTRY_PLAN_FEATURES[industry]) {
    return INDUSTRY_PLAN_FEATURES[industry]!;
  }
  return DEFAULT_PLAN_FEATURES;
}
