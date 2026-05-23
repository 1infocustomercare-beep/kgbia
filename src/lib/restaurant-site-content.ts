/**
 * Schema dei contenuti modificabili del sito pubblico del ristorante (/r/:slug).
 * Vive dentro `restaurants.theme_config.site` come JSONB.
 * Tutti i campi sono OPZIONALI: se assenti la pagina usa il valore di default
 * (campi della tabella restaurants o fallback hardcoded).
 */

export type RestaurantSiteContent = {
  hero?: {
    eyebrow?: string;
    title?: string;          // override del nome ristorante
    subtitle?: string;       // override del tagline
    ctaPrimaryLabel?: string;
    ctaPrimaryHref?: string;
    ctaSecondaryLabel?: string;
    ctaSecondaryHref?: string;
    videoUrl?: string;
    imageUrl?: string;       // poster / fallback
    overlayOpacity?: number; // 0..100
  };
  splash?: {
    enabled?: boolean;
    title?: string;
    subtitle?: string;
  };
  about?: {
    enabled?: boolean;
    title?: string;
    body?: string;
  };
  story?: {
    enabled?: boolean;
    title?: string;
    intro?: string;
    images?: string[];   // fino a 4
    captions?: string[]; // 4
  };
  popular?: {
    enabled?: boolean;
    title?: string;
    eyebrow?: string;
  };
  reservations?: {
    enabled?: boolean;
    title?: string;
    body?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };
  reviews?: {
    enabled?: boolean;
    title?: string;
  };
  contact?: {
    title?: string;
    whatsapp?: string;
    instagram?: string;
    facebook?: string;
    extraLine?: string;
  };
  footer?: {
    tagline?: string;
    copyright?: string;
  };
  brand?: {
    primaryHex?: string;
    accentHex?: string;
    headingFont?: "display" | "serif" | "sans" | "mono";
  };
};

export const EMPTY_SITE: RestaurantSiteContent = {};

export function mergeSite(
  base: RestaurantSiteContent,
  override?: RestaurantSiteContent | null
): RestaurantSiteContent {
  if (!override) return base;
  const out: any = { ...base };
  for (const k of Object.keys(override) as (keyof RestaurantSiteContent)[]) {
    const v: any = (override as any)[k];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out[k] = { ...(base as any)[k], ...v };
    } else if (v !== undefined) {
      out[k] = v;
    }
  }
  return out;
}

/** Recupera l'override dal record ristorante (theme_config.site) in modo difensivo. */
export function extractSiteOverride(restaurant: any): RestaurantSiteContent {
  const tc = restaurant?.theme_config;
  if (!tc || typeof tc !== "object") return {};
  const site = tc.site;
  return site && typeof site === "object" ? site : {};
}
