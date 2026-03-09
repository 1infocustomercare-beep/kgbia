// ── Subscription plan → feature gate mapping ──────────────────────────

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
  | "fiscal_vault";

export interface PlanConfig {
  id: PlanId;
  name: string;
  price: number;
  features: Set<FeatureKey>;
}

const ESSENTIAL_FEATURES: FeatureKey[] = [
  "menu_qr",
  "orders",
  "dashboard",
  "support_email",
  "table_map",
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
];

export const PLAN_CONFIGS: Record<PlanId, PlanConfig> = {
  essential: {
    id: "essential",
    name: "Essential",
    price: 29,
    features: new Set(ESSENTIAL_FEATURES),
  },
  smart_ia: {
    id: "smart_ia",
    name: "Smart IA",
    price: 59,
    features: new Set(SMART_IA_FEATURES),
  },
  empire_pro: {
    id: "empire_pro",
    name: "Empire Pro",
    price: 89,
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
};
