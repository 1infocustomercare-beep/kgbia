/**
 * Schema dei contenuti modificabili della Homepage pubblica.
 * Tutti i campi sono OPZIONALI: se non valorizzati, il componente usa il default hardcoded.
 * Salvataggi e pubblicazioni vivono in tabella `homepage_content` (singleton JSONB).
 */

export type HeroScene = {
  sector: string;
  brand: string;
  metric: string;
  metricLabel: string;
  img?: string;
  accent?: string;
};

export type PricingPlan = {
  name: string;
  setup: string;
  setupRate: string;
  monthly: string;
  desc: string;
  valueLine: string;
  saved: string;
  features: string[];
  bestFor: string;
  cta: string;
  badge?: string;
  featured?: boolean;
  tone?: "blue" | "gold" | "violet";
};

export type FaqItem = { q: string; a: string };

export type Stat = { value: string; label: string };

export type HomepageContent = {
  brand?: {
    primaryHsl?: string;   // es. "215 90% 62%"
    accentHsl?: string;
    goldHsl?: string;
  };
  nav?: {
    ctaLabel?: string;
    ctaHref?: string;
  };
  hero?: {
    eyebrow?: string;
    titleLine1?: string;
    titleLine2?: string;
    titleAccent?: string;
    subtitle?: string;
    rotatingWords?: string[];
    trustPills?: string[];
    marquee?: string[];
    ctaPrimaryLabel?: string;
    ctaPrimaryHref?: string;
    ctaSecondaryLabel?: string;
    ctaSecondaryHref?: string;
    scenes?: HeroScene[];
  };
  manifesto?: {
    pillLabel?: string;
    words?: string[];
    accentWords?: string[];
    stats?: Stat[];
  };
  pricing?: {
    eyebrow?: string;
    titleLead?: string;
    titleAccent?: string;
    subtitle?: string;
    trustStrip?: string[];
    plans?: PricingPlan[];
    bottomStats?: Stat[];
  };
  faq?: {
    pillLabel?: string;
    titleLead?: string;
    titleAccent?: string;
    items?: FaqItem[];
  };
  contactCta?: {
    pillLabel?: string;
    titleLead?: string;
    titleAccent?: string;
    subtitle?: string;
    primaryLabel?: string;
    primaryHref?: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
  footer?: {
    tagline?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  /** Sezioni completamente nascoste */
  hidden?: {
    manifesto?: boolean;
    storyPinned?: boolean;
    sectorsCarousel?: boolean;
    horizontalPortfolio?: boolean;
    orbital3D?: boolean;
    agentsBento?: boolean;
    agentsAlaCarte?: boolean;
    process?: boolean;
    customization?: boolean;
    about?: boolean;
    team?: boolean;
    pricing?: boolean;
    guarantee?: boolean;
    testimonials?: boolean;
    faq?: boolean;
    contactCta?: boolean;
  };
};

export const EMPTY_CONTENT: HomepageContent = {};

/** Deep merge utility — sovrappone `override` su `base` mantenendo array integri come override. */
export function mergeContent(base: HomepageContent, override?: HomepageContent | null): HomepageContent {
  if (!override) return base;
  const out: any = { ...base };
  for (const k of Object.keys(override) as (keyof HomepageContent)[]) {
    const v = (override as any)[k];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out[k] = { ...(base as any)[k], ...v };
    } else if (v !== undefined) {
      out[k] = v;
    }
  }
  return out;
}
