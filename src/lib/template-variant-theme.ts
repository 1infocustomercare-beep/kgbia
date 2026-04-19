/**
 * Template Variant → Mockup iPhone Shell Resolver
 *
 * Mappa ogni `template_variant` (cote-ivory, neo-nails-lavender, asinara-azure, ecc.)
 * a UNA delle 3 shell iPhone esistenti (Strapizzami / Paperfish / Batey) e applica
 * un override di palette/font tramite CSS variables, così il sito demo /b/:slug
 * e l'admin /demo-admin/:slug risultano 1:1 al mockup scelto.
 *
 * Ogni variant produce la stessa struttura mobile-first (Home → Menu/Servizi →
 * Dettaglio → Carrello/Booking) ma con il "vestito" — colori, tipografia, hero
 * label — del mockup di riferimento.
 */
export type TemplateShell = "strapizzami" | "paperfish" | "batey";

export type TemplateVariantId =
  // Food
  | "strapizzami"
  | "paperfish-sakura"
  | "paperfish-dark"
  | "cote-obsidian"
  | "cote-marble"
  | "cote-ivory"
  | "lavang-noir"
  | "midtown-kosher"
  | "batey-pacifico"
  // Beauty
  | "neo-nails-lavender"
  | "neo-nails-blush"
  | "tatush-hair"
  // NCC / Mobility
  | "asinara-azure"
  | "miami-boats"
  // Fitness
  | "city-padel-sage"
  | "miami-watersports"
  // Generic fallback
  | "default";

export interface VariantThemeSpec {
  /** Iframe-mockup shell to use (Strapizzami / Paperfish / Batey) */
  shell: TemplateShell;
  /** Display label for the variant */
  label: string;
  /** Hero tagline shown in the mockup hero */
  heroTagline: string;
  /** Subtitle / kicker (es. "寿司 · 刺身", "Sardinia Charter") */
  subtitle: string;
  /** Default hero image when none extracted from scrape */
  heroImage: string;
  /** Override of CSS variables of the chosen shell */
  cssVars: Record<string, string>;
  /** Optional font family override (loaded via Google Fonts inside the demo) */
  fontHeading?: string;
  fontBody?: string;
  /** Google Fonts URL for the variant (if any) */
  googleFontsHref?: string;
  /** Extra google fonts css (optional) */
  extraCss?: string;
  /** Industry hint used for nav labels & default content */
  industryGroup: "food" | "beauty" | "ncc" | "fitness";
  /** Default category list when menu/services empty */
  defaultCategories: string[];
}

/* ─── Palette overrides per variant ─── */

const FONTS_GF = {
  cormorant: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
  crimsonPro: "https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
  playfair: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
  forum: "https://fonts.googleapis.com/css2?family=Forum&family=Inter:wght@300;400;500;600;700&display=swap",
};

export const VARIANT_THEME_MAP: Record<TemplateVariantId, VariantThemeSpec> = {
  /* ═══════════════ FOOD ═══════════════ */
  strapizzami: {
    shell: "strapizzami",
    label: "Strapizzami",
    heroTagline: "LA VERA PIZZA NAPOLETANA",
    subtitle: "Pizzeria Napoletana",
    heroImage: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=1200",
    industryGroup: "food",
    defaultCategories: ["Classiche", "Speciali", "Calzoni", "Antipasti", "Dolci", "Bevande"],
    cssVars: {}, // identità nativa Strapizzami
    googleFontsHref: FONTS_GF.crimsonPro,
  },
  "paperfish-sakura": {
    shell: "paperfish",
    label: "Paperfish Sakura",
    heroTagline: "L'ARTE GIAPPONESE DEL GUSTO",
    subtitle: "寿司 · 刺身",
    heroImage: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=1200",
    industryGroup: "food",
    defaultCategories: ["Nigiri", "Sashimi", "Hosomaki", "Uramaki", "Special Roll", "Ramen", "Antipasti", "Dolci"],
    cssVars: {}, // identità nativa Paperfish-sakura
    googleFontsHref: FONTS_GF.cormorant,
  },
  "paperfish-dark": {
    shell: "paperfish",
    label: "Paperfish Luxury Dark",
    heroTagline: "OMAKASE EXPERIENCE",
    subtitle: "Edomae · Luxury Sushi",
    heroImage: "https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=1200",
    industryGroup: "food",
    defaultCategories: ["Nigiri", "Sashimi", "Special Roll", "Ramen", "Dolci"],
    cssVars: {
      "--pf-bg": "#070506",
      "--pf-bg-deep": "#000000",
      "--pf-bg-panel": "#0F0B0D",
      "--pf-primary": "#C9A86A",
      "--pf-primary-strong": "#A7873C",
      "--pf-gold": "#E5C46A",
    },
    googleFontsHref: FONTS_GF.cormorant,
  },
  "cote-obsidian": {
    shell: "paperfish",
    label: "COTE Obsidian",
    heroTagline: "FUOCO, CARNE, TRADIZIONE",
    subtitle: "Steakhouse · Wood Fire",
    heroImage: "https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg?auto=compress&cs=tinysrgb&w=1200",
    industryGroup: "food",
    defaultCategories: ["Tartare", "Antipasti", "Carni alla Brace", "Tagliate", "Contorni", "Dolci"],
    cssVars: {
      "--pf-bg": "#0a0a0a",
      "--pf-bg-deep": "#000000",
      "--pf-bg-panel": "#161616",
      "--pf-primary": "#C8963E",
      "--pf-primary-strong": "#a47728",
      "--pf-gold": "#d4af37",
      "--pf-text": "#F5E9D6",
    },
    googleFontsHref: FONTS_GF.playfair,
  },
  "cote-marble": {
    shell: "strapizzami",
    label: "COTE Marble",
    heroTagline: "OSPITALITÀ ESCLUSIVA",
    subtitle: "Fine Dining · Editorial",
    heroImage: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1200",
    industryGroup: "food",
    defaultCategories: ["Antipasti", "Primi", "Secondi", "Dolci", "Vini"],
    cssVars: {
      "--strap-bg": "#FFFAF2",
      "--strap-bg-deep": "#F5EDE0",
      "--strap-bg-wood": "#2C2418",
      "--strap-card": "#FFFFFF",
      "--strap-card-soft": "#FAF4EA",
      "--strap-primary": "#8B6F47",
      "--strap-primary-light": "#A88A60",
      "--strap-primary-dark": "#5C4830",
      "--strap-text": "#2A1F18",
      "--strap-text-muted": "#7A6552",
    },
    googleFontsHref: FONTS_GF.cormorant,
    extraCss: `.strapizzami-theme .font-serif-strap { font-family: 'Cormorant Garamond', 'Playfair Display', serif !important; font-weight: 600 !important; letter-spacing: 0.04em !important; }`,
  },
  "cote-ivory": {
    shell: "strapizzami",
    label: "COTE Ivory",
    heroTagline: "BENVENUTI A TAVOLA",
    subtitle: "Ristorante · Ivory Editorial",
    heroImage: "https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1200",
    industryGroup: "food",
    defaultCategories: ["Antipasti", "Primi", "Secondi", "Dolci", "Vini"],
    cssVars: {
      "--strap-bg": "#F8F2E8",
      "--strap-bg-deep": "#EDE3CF",
      "--strap-bg-wood": "#332720",
      "--strap-card": "#FFFFFF",
      "--strap-card-soft": "#F5EBD8",
      "--strap-primary": "#9C7A4F",
      "--strap-primary-light": "#BB9974",
      "--strap-primary-dark": "#6E5532",
      "--strap-text": "#2D241A",
      "--strap-text-muted": "#7C6850",
    },
    googleFontsHref: FONTS_GF.cormorant,
    extraCss: `.strapizzami-theme .font-serif-strap { font-family: 'Cormorant Garamond', serif !important; font-weight: 500 !important; }`,
  },
  "lavang-noir": {
    shell: "paperfish",
    label: "La Vang Noir Saigon",
    heroTagline: "ESSENCE OF VIETNAM",
    subtitle: "Vietnamese · Saigon Noir",
    heroImage: "https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=1200",
    industryGroup: "food",
    defaultCategories: ["Pho", "Banh", "Spring Rolls", "Wok", "Dessert"],
    cssVars: {
      "--pf-bg": "#0A0908",
      "--pf-bg-deep": "#000000",
      "--pf-bg-panel": "#13110F",
      "--pf-primary": "#E0B255",
      "--pf-primary-strong": "#B0883B",
      "--pf-gold": "#F0CB7A",
      "--pf-text": "#F5E9D2",
    },
    googleFontsHref: FONTS_GF.cormorant,
  },
  "midtown-kosher": {
    shell: "strapizzami",
    label: "Midtown Kosher",
    heroTagline: "TRADITION & TASTE",
    subtitle: "Kosher · Midtown",
    heroImage: "https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=1200",
    industryGroup: "food",
    defaultCategories: ["Antipasti", "Primi", "Secondi", "Dessert", "Bevande"],
    cssVars: {
      "--strap-bg": "#F5F0E8",
      "--strap-bg-deep": "#E8DEC8",
      "--strap-bg-wood": "#1C1814",
      "--strap-card": "#FFFFFF",
      "--strap-card-soft": "#FAF4E9",
      "--strap-primary": "#7A6038",
      "--strap-primary-light": "#9C8252",
      "--strap-primary-dark": "#564326",
      "--strap-text": "#1F1813",
    },
    googleFontsHref: FONTS_GF.crimsonPro,
  },
  "batey-pacifico": {
    shell: "batey",
    label: "Batey Pacifico",
    heroTagline: "PESCA FRESCA OGNI GIORNO",
    subtitle: "Cevicheria · Costa Pacifico",
    heroImage: "https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg?auto=compress&cs=tinysrgb&w=1200",
    industryGroup: "food",
    defaultCategories: ["Crudi", "Ceviche", "Primi", "Secondi", "Dolci"],
    cssVars: {}, // identità nativa Batey
    googleFontsHref: FONTS_GF.cormorant,
  },

  /* ═══════════════ BEAUTY ═══════════════ */
  "neo-nails-lavender": {
    shell: "strapizzami",
    label: "Neo Nails Lavender Luxe",
    heroTagline: "BELLEZZA SU MISURA",
    subtitle: "Nail Art · Lavender Luxe",
    heroImage: "https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=1200",
    industryGroup: "beauty",
    defaultCategories: ["Manicure", "Pedicure", "Nail Art", "Gel & Semi", "Trattamenti"],
    cssVars: {
      "--strap-bg": "#F5EEFB",
      "--strap-bg-deep": "#E8DBF5",
      "--strap-bg-wood": "#2A1E3F",
      "--strap-card": "#FFFFFF",
      "--strap-card-soft": "#F0E6FA",
      "--strap-primary": "#8B6FBF",
      "--strap-primary-light": "#A78BFA",
      "--strap-primary-dark": "#5C4790",
      "--strap-text": "#1E1B2E",
      "--strap-text-muted": "#6B5F7D",
    },
    googleFontsHref: FONTS_GF.cormorant,
    extraCss: `.strapizzami-theme .font-serif-strap { font-family: 'Cormorant Garamond', serif !important; font-weight: 500 !important; letter-spacing: 0.03em !important; }`,
  },
  "neo-nails-blush": {
    shell: "strapizzami",
    label: "Neo Nails Blush Rosegold",
    heroTagline: "BELLEZZA SU MISURA",
    subtitle: "Nail Art · Blush Rosegold",
    heroImage: "https://images.pexels.com/photos/887352/pexels-photo-887352.jpeg?auto=compress&cs=tinysrgb&w=1200",
    industryGroup: "beauty",
    defaultCategories: ["Manicure", "Pedicure", "Nail Art", "Gel & Semi", "Trattamenti"],
    cssVars: {
      "--strap-bg": "#FCF1F4",
      "--strap-bg-deep": "#F5DCE3",
      "--strap-bg-wood": "#3A2228",
      "--strap-card": "#FFFFFF",
      "--strap-card-soft": "#FAEAEF",
      "--strap-primary": "#C45C7C",
      "--strap-primary-light": "#E07898",
      "--strap-primary-dark": "#8E3F58",
      "--strap-text": "#2D1820",
      "--strap-text-muted": "#7A5560",
    },
    googleFontsHref: FONTS_GF.cormorant,
    extraCss: `.strapizzami-theme .font-serif-strap { font-family: 'Cormorant Garamond', serif !important; font-weight: 500 !important; }`,
  },
  "tatush-hair": {
    shell: "paperfish",
    label: "Tatush Hair Fragrance",
    heroTagline: "LO STILE È UN'ARTE",
    subtitle: "Hair Boutique · Fragrance",
    heroImage: "https://images.pexels.com/photos/3993456/pexels-photo-3993456.jpeg?auto=compress&cs=tinysrgb&w=1200",
    industryGroup: "beauty",
    defaultCategories: ["Tagli", "Colore", "Trattamenti", "Hair Spa", "Make-Up"],
    cssVars: {
      "--pf-bg": "#1A1410",
      "--pf-bg-deep": "#0A0805",
      "--pf-bg-panel": "#241B14",
      "--pf-primary": "#C8963E",
      "--pf-primary-strong": "#9C7128",
      "--pf-gold": "#E5C46A",
      "--pf-text": "#F5E9D2",
    },
    googleFontsHref: FONTS_GF.cormorant,
  },

  /* ═══════════════ NCC / MOBILITY ═══════════════ */
  "asinara-azure": {
    shell: "batey",
    label: "Asinara Sardinia Azure",
    heroTagline: "LUSSO IN MARE APERTO",
    subtitle: "Charter · Sardinia Azure",
    heroImage: "https://images.pexels.com/photos/1450354/pexels-photo-1450354.jpeg?auto=compress&cs=tinysrgb&w=1200",
    industryGroup: "ncc",
    defaultCategories: ["Charter Privati", "Escursioni", "Tour Asinara", "Sunset Cruise", "Eventi"],
    cssVars: {
      "--bt-bg": "#06121E",
      "--bt-bg-deep": "#020912",
      "--bt-bg-panel": "#0E2034",
      "--bt-primary": "#5CC8D9",
      "--bt-primary-strong": "#2EA8BD",
      "--bt-coral": "#E8D5A8",
      "--bt-sand": "#E8D5A8",
    },
    googleFontsHref: FONTS_GF.cormorant,
  },
  "miami-boats": {
    shell: "batey",
    label: "Miami Boats Rental",
    heroTagline: "EXCLUSIVE BOAT EXPERIENCE",
    subtitle: "Yacht & Boat · Miami",
    heroImage: "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=1200",
    industryGroup: "ncc",
    defaultCategories: ["Yacht", "Speedboat", "Sunset Tour", "Day Charter", "Eventi"],
    cssVars: {
      "--bt-bg": "#08131F",
      "--bt-bg-deep": "#040A12",
      "--bt-bg-panel": "#0F2034",
      "--bt-primary": "#5CC8D9",
      "--bt-primary-strong": "#2EA8BD",
      "--bt-coral": "#FF8966",
    },
    googleFontsHref: FONTS_GF.cormorant,
  },

  /* ═══════════════ FITNESS ═══════════════ */
  "city-padel-sage": {
    shell: "batey",
    label: "City Padel Sage Luxe",
    heroTagline: "GIOCA AL TUO MEGLIO",
    subtitle: "Padel Club · Sage Luxe",
    heroImage: "https://images.pexels.com/photos/8224066/pexels-photo-8224066.jpeg?auto=compress&cs=tinysrgb&w=1200",
    industryGroup: "fitness",
    defaultCategories: ["Prenota Campo", "Lezioni", "Maestri", "Tornei", "Pacchetti"],
    cssVars: {
      "--bt-bg": "#1A2218",
      "--bt-bg-deep": "#0D110C",
      "--bt-bg-panel": "#243024",
      "--bt-primary": "#A8C0A0",
      "--bt-primary-strong": "#7D9B76",
      "--bt-coral": "#E8D5A8",
      "--bt-sand": "#E8D5A8",
    },
    googleFontsHref: FONTS_GF.cormorant,
  },
  "miami-watersports": {
    shell: "batey",
    label: "Miami Watersports",
    heroTagline: "ADRENALINA SUL MARE",
    subtitle: "Watersports · Miami Beach",
    heroImage: "https://images.pexels.com/photos/3756168/pexels-photo-3756168.jpeg?auto=compress&cs=tinysrgb&w=1200",
    industryGroup: "fitness",
    defaultCategories: ["Jet Ski", "Surf", "SUP", "Kite", "Pacchetti"],
    cssVars: {
      "--bt-bg": "#08131F",
      "--bt-bg-deep": "#040A12",
      "--bt-bg-panel": "#0F2034",
      "--bt-primary": "#5CC8D9",
      "--bt-primary-strong": "#2EA8BD",
      "--bt-coral": "#FF8966",
    },
    googleFontsHref: FONTS_GF.cormorant,
  },

  /* ═══════════════ DEFAULT ═══════════════ */
  default: {
    shell: "strapizzami",
    label: "Empire Default",
    heroTagline: "BENVENUTO",
    subtitle: "Sito Demo Empire AI",
    heroImage: "https://images.pexels.com/photos/941864/pexels-photo-941864.jpeg?auto=compress&cs=tinysrgb&w=1200",
    industryGroup: "food",
    defaultCategories: ["Servizi", "Categoria 1", "Categoria 2"],
    cssVars: {},
    googleFontsHref: FONTS_GF.crimsonPro,
  },
};

/** Resolve a variant id (or null) to a guaranteed VariantThemeSpec. */
export function resolveVariantTheme(variantId?: string | null): VariantThemeSpec & { id: TemplateVariantId } {
  const id = (variantId || "default") as TemplateVariantId;
  const spec = VARIANT_THEME_MAP[id] || VARIANT_THEME_MAP.default;
  return { ...spec, id: VARIANT_THEME_MAP[id] ? id : "default" };
}

/**
 * Build an inline `<style>` string that overrides the chosen shell's CSS vars
 * with the variant-specific palette. Inject once in <head> when rendering the
 * demo site or admin.
 */
export function buildVariantStyleTag(spec: VariantThemeSpec): string {
  const selector =
    spec.shell === "strapizzami"
      ? ".strapizzami-theme"
      : spec.shell === "paperfish"
      ? ".paperfish-theme"
      : ".batey-theme";

  const varsBlock = Object.entries(spec.cssVars || {})
    .map(([k, v]) => `  ${k}: ${v} !important;`)
    .join("\n");

  return `
${selector} {
${varsBlock}
}
${spec.extraCss || ""}
  `.trim();
}
