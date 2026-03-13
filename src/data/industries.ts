// ── Available Industries ──────────────────────────────────
import { type IndustryId, INDUSTRY_CONFIGS } from "@/config/industry-config";

export interface IndustryOption {
  id: IndustryId;
  label: string;
  description: string;
  icon: string;
  color: string;
}

// All 25 industries — ALL unlocked and selectable
export const INDUSTRIES: IndustryOption[] = Object.values(INDUSTRY_CONFIGS).map(cfg => ({
  id: cfg.id,
  label: cfg.label,
  description: cfg.description,
  icon: cfg.icon,
  color: cfg.color,
}));

export const ACTIVE_INDUSTRIES = INDUSTRIES;
