// Mapping agent names/functions → futuristic alien cartoon illustrations
import alienAnalytics from "@/assets/alien-fn-analytics.png";
import alienChef from "@/assets/alien-fn-chef.png";
import alienDriver from "@/assets/alien-fn-driver.png";
import alienMedical from "@/assets/alien-fn-medical.png";
import alienBeauty from "@/assets/alien-fn-beauty.png";
import alienScheduler from "@/assets/alien-fn-scheduler.png";
import alienInventory from "@/assets/alien-fn-inventory.png";
import alienSocial from "@/assets/alien-fn-social.png";
import alienVoice from "@/assets/alien-fn-voice.png";
import alienTranslate from "@/assets/alien-fn-translate.png";
import alienCompliance from "@/assets/alien-fn-compliance.png";
import alienSales from "@/assets/alien-fn-sales.png";
import alienContent from "@/assets/alien-fn-content.png";
import alienPhoto from "@/assets/alien-fn-photo.png";
import alienFinance from "@/assets/alien-fn-finance.png";
import alienConcierge from "@/assets/alien-fn-concierge.png";

// Keywords in agent name (lowercase) → image
const NAME_KEYWORD_MAP: [RegExp, string][] = [
  // Food / Kitchen
  [/chef|cucin|menu|kitchen|food|ricett|haccp|sommelier|wine|piatt|dish|bakery|pasticcer|forno|bar\b|caffè|ristoran|pizz|gelateria/i, alienChef],
  // NCC / Driver / Fleet / Transport
  [/driver|autista|fleet|ncc|transfer|airport|monitor.*vol|limousin|chauffeur|route|dispatch|vehicle/i, alienDriver],
  // Medical / Health / Triage
  [/medic|health|triage|pazient|clinical|telemedicin|pharma|doctor|nurse|patient|sanitari|aftercare/i, alienMedical],
  // Beauty / Spa / Tattoo
  [/beauty|spa|nail|hair|tattoo|estet|trucco|makeup|stylist|barbier|parrucchier/i, alienBeauty],
  // Scheduling / Appointments / Reservations / Calendar
  [/schedul|appointment|prenotazion|reserv|booking|calendar|orari|slot|wait.*list|check.?in/i, alienScheduler],
  // Inventory / Warehouse / Stock
  [/inventor|magazz|stock|warehouse|supply|fornitore|supplier|order.*track/i, alienInventory],
  // Social Media / Marketing
  [/social|instagram|facebook|tiktok|marketing|campaign|newsletter|email.*market|promo|influenc|hashtag/i, alienSocial],
  // Voice / Phone / Call / TTS / Chat
  [/voice|vocal|telefon|phone|call|tts|speech|conversa|chat|whatsapp|notif|smart.*notif|assistente|concierge.*ai/i, alienVoice],
  // Translation / Language / Multilingual
  [/translat|traduz|lingua|language|multilingu|interpre/i, alienTranslate],
  // Compliance / Legal / GDPR / Safety / HACCP related compliance
  [/complian|legal|gdpr|privacy|sicurezza|safety|normativ|regulat|licen|document.*ai|guardia|sentinel/i, alienCompliance],
  // Sales / CRM / Leads / Upsell / Loyalty
  [/sales|vendita|lead|crm|client|customer|loyal|fideliz|upsell|cross.?sell|closer|pipeline|deal/i, alienSales],
  // Content / Writing / Blog / SEO / Review
  [/content|blog|seo|copywr|articol|review|recension|risposta|reply|writer|editor|newsletter.*content/i, alienContent],
  // Photo / Camera / Image / Gallery / Visual
  [/photo|foto|camera|image|immag|visual|gallery|generat.*foto|generat.*imag|ai.*photo|ocr/i, alienPhoto],
  // Finance / Accounting / Invoice / Payment / Billing
  [/financ|contabil|account|invoice|fattur|pagament|payment|billing|fiscal|profit|revenue|cost|budget|pricing|payroll/i, alienFinance],
  // Analytics / Reports / BI / Data / Dashboard / KPI
  [/analyt|report|dashboard|statistic|kpi|insight|intelligen|brain|trend|predicti|data|monitor|metric/i, alienAnalytics],
  // Concierge / Reception / Welcome / Hospitality / Hotel
  [/concierge|reception|welcome|hotel|hospitality|guest|accoglienz|portier|check.*out|room/i, alienConcierge],
  // Planner / Operations / General ops
  [/planner|planning|pianific|gestio|operat|coordinat|workflow|automat|task|project|dispatch|field|logist|cleaning|pulizia|garden|giardin|agriturismo|beach|spiaggia|fitness|palestra|education|formazione|events|event/i, alienScheduler],
];

export function getAgentImage(
  name: string,
  category: string,
  _sectors: string[],
): string {
  const lowerName = name.toLowerCase();

  // Try to match by agent name keywords first (most specific)
  for (const [regex, img] of NAME_KEYWORD_MAP) {
    if (regex.test(lowerName)) return img;
  }

  // Fallback: match by category
  const CATEGORY_FALLBACK: Record<string, string> = {
    concierge: alienConcierge,
    analytics: alienAnalytics,
    content: alienContent,
    sales: alienSales,
    operations: alienScheduler,
    compliance: alienCompliance,
  };

  return CATEGORY_FALLBACK[category] || alienConcierge;
}
