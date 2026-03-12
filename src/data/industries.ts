// ── Available Industries ──────────────────────────────────
import { type IndustryId, INDUSTRY_CONFIGS } from "@/config/industry-config";

export interface IndustryOption {
  id: IndustryId;
  label: string;
  description: string;
  icon: string;
  color: string;
  comingSoon?: boolean;
}

export const INDUSTRIES: IndustryOption[] = [
  {
    id: "food",
    label: INDUSTRY_CONFIGS.food.label,
    description: INDUSTRY_CONFIGS.food.description,
    icon: INDUSTRY_CONFIGS.food.icon,
    color: INDUSTRY_CONFIGS.food.color,
  },
  {
    id: "ncc",
    label: INDUSTRY_CONFIGS.ncc.label,
    description: INDUSTRY_CONFIGS.ncc.description,
    icon: INDUSTRY_CONFIGS.ncc.icon,
    color: INDUSTRY_CONFIGS.ncc.color,
  },
  {
    id: "beauty",
    label: INDUSTRY_CONFIGS.beauty.label,
    description: INDUSTRY_CONFIGS.beauty.description,
    icon: INDUSTRY_CONFIGS.beauty.icon,
    color: INDUSTRY_CONFIGS.beauty.color,
    comingSoon: true,
  },
  {
    id: "healthcare",
    label: INDUSTRY_CONFIGS.healthcare.label,
    description: INDUSTRY_CONFIGS.healthcare.description,
    icon: INDUSTRY_CONFIGS.healthcare.icon,
    color: INDUSTRY_CONFIGS.healthcare.color,
    comingSoon: true,
  },
  {
    id: "retail",
    label: INDUSTRY_CONFIGS.retail.label,
    description: INDUSTRY_CONFIGS.retail.description,
    icon: INDUSTRY_CONFIGS.retail.icon,
    color: INDUSTRY_CONFIGS.retail.color,
    comingSoon: true,
  },
  {
    id: "fitness",
    label: INDUSTRY_CONFIGS.fitness.label,
    description: INDUSTRY_CONFIGS.fitness.description,
    icon: INDUSTRY_CONFIGS.fitness.icon,
    color: INDUSTRY_CONFIGS.fitness.color,
    comingSoon: true,
  },
  {
    id: "hospitality",
    label: INDUSTRY_CONFIGS.hospitality.label,
    description: INDUSTRY_CONFIGS.hospitality.description,
    icon: INDUSTRY_CONFIGS.hospitality.icon,
    color: INDUSTRY_CONFIGS.hospitality.color,
    comingSoon: true,
  },
];

export const ACTIVE_INDUSTRIES = INDUSTRIES.filter((i) => !i.comingSoon);
