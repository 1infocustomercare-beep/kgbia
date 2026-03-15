// Mapping agent names → cartoon representative images
import agentAnalyticsBrain from "@/assets/agent-analytics-brain.png";
import agentAtlasVoice from "@/assets/agent-atlas-voice.png";
import agentComplianceGuardian from "@/assets/agent-compliance-guardian.png";
import agentConciergeAi from "@/assets/agent-concierge-ai.png";
import agentConciergeFood from "@/assets/agent-concierge-food.png";
import agentDocumentAi from "@/assets/agent-document-ai.png";
import agentEmpireAssistant from "@/assets/agent-empire-assistant.png";
import agentInventory from "@/assets/agent-inventory.png";
import agentMenuOcr from "@/assets/agent-menu-ocr.png";
import agentOpsBeauty from "@/assets/agent-ops-beauty.png";
import agentOpsConstruction from "@/assets/agent-ops-construction.png";
import agentOpsFood from "@/assets/agent-ops-food.png";
import agentOpsHealthcare from "@/assets/agent-ops-healthcare.png";
import agentOpsNcc from "@/assets/agent-ops-ncc.png";
import agentPhotoGen from "@/assets/agent-photo-gen.png";
import agentSalesCloser from "@/assets/agent-sales-closer.png";
import agentSmartNotifier from "@/assets/agent-smart-notifier.png";
import agentSocialManager from "@/assets/agent-social-manager.png";
import agentTranslator from "@/assets/agent-translator.png";
import agentTts from "@/assets/agent-tts.png";

// Maps keywords in agent name to images
const NAME_IMAGE_MAP: [RegExp, string][] = [
  [/analytics\s*brain/i, agentAnalyticsBrain],
  [/atlas|voice\s*agent/i, agentAtlasVoice],
  [/compliance|guardian|gdpr|haccp|legal/i, agentComplianceGuardian],
  [/concierge.*food|food.*concierge|menu\s*ai|waiter/i, agentConciergeFood],
  [/concierge|receptionist|welcome|hospitality.*ai|hotel.*ai/i, agentConciergeAi],
  [/document|invoice|fattur|ocr.*doc/i, agentDocumentAi],
  [/empire.*assistant|assistant.*empire/i, agentEmpireAssistant],
  [/inventory|magazzino|stock/i, agentInventory],
  [/menu.*ocr|ocr.*menu|scan/i, agentMenuOcr],
  [/beauty|estetica|salon|nail|hair|spa/i, agentOpsBeauty],
  [/construction|edilizi|cantier|field|dispatch/i, agentOpsConstruction],
  [/food.*ops|ops.*food|kitchen|cucina|bar\s*service|chef/i, agentOpsFood],
  [/health|medical|triage|telemedicin|patient|aftercare|veterinar/i, agentOpsHealthcare],
  [/ncc|driver|fleet|airport|transfer|chauffeur/i, agentOpsNcc],
  [/photo|image|generat.*foto|creative/i, agentPhotoGen],
  [/sales|closer|lead|crm|pitch|pricing|roi/i, agentSalesCloser],
  [/notifi|alert|push|remind|smart.*notif/i, agentSmartNotifier],
  [/social|instagram|post|marketing|campaign/i, agentSocialManager],
  [/translat|tradut|multilingua/i, agentTranslator],
  [/tts|text.*speech|speech|voce|narrat/i, agentTts],
];

// Category fallback images
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  concierge: agentConciergeAi,
  analytics: agentAnalyticsBrain,
  content: agentSocialManager,
  sales: agentSalesCloser,
  operations: agentOpsFood,
  compliance: agentComplianceGuardian,
};

// Sector fallback images
const SECTOR_IMAGE_MAP: Record<string, string> = {
  food: agentOpsFood,
  ncc: agentOpsNcc,
  beauty: agentOpsBeauty,
  healthcare: agentOpsHealthcare,
  construction: agentOpsConstruction,
  fitness: agentOpsBeauty,
  hospitality: agentConciergeAi,
  retail: agentInventory,
  beach: agentConciergeAi,
};

export function getAgentImage(name: string, category: string, sectors: string[]): string | null {
  // 1. Try matching name
  for (const [regex, img] of NAME_IMAGE_MAP) {
    if (regex.test(name)) return img;
  }

  // 2. Try sector-specific image
  for (const s of sectors) {
    if (SECTOR_IMAGE_MAP[s]) return SECTOR_IMAGE_MAP[s];
  }

  // 3. Category fallback
  return CATEGORY_IMAGE_MAP[category] || agentEmpireAssistant;
}
