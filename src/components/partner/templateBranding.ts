/**
 * Template Branding Registry
 * ──────────────────────────────────────────────────────────────────────────
 * Single source of truth for "Mockup Libero" branding rules.
 * Each template variant exposes a curated palette (primary + accent + 2 supports)
 * and a typography pair (heading + body) so the standalone generator can
 * keep brand color, font choice and screen UI perfectly coherent with the
 * selected iPhone template.
 *
 * Values are intentionally aligned with the runtime themes defined in
 * MockupReactScreen.getTheme() — changing one without the other will cause
 * visual drift between the live preview and the rendered screens.
 */

export interface TemplateBrandingKit {
  /** Internal template variant key (matches getTheme & TEMPLATE_VARIANTS). */
  variant: string;
  /** Human label shown in the panel header. */
  label: string;
  /** Primary brand color (used as the dominant accent in screens). */
  primary: string;
  /** Secondary accent — used for highlights, CTAs, badges. */
  accent: string;
  /** Curated 4-swatch palette aligned with the template's mood. */
  palette: { name: string; hex: string }[];
  /** Typography pair: display/heading + body font (CSS font-family stacks). */
  typography: {
    pairLabel: string;
    headingFont: string;
    bodyFont: string;
  };
  /** Short branding rule sentence shown in the UI. */
  rule: string;
}

export const TEMPLATE_BRANDING: Record<string, TemplateBrandingKit> = {
  paperfish: {
    variant: "paperfish",
    label: "Paperfish Sakura",
    primary: "#E89BAE",
    accent: "#C9A86A",
    palette: [
      { name: "Sakura Pink", hex: "#E89BAE" },
      { name: "Gold Accent", hex: "#C9A86A" },
      { name: "Sushi Noir",  hex: "#181216" },
      { name: "Ivory Mist",  hex: "#F5E9EC" },
    ],
    typography: {
      pairLabel: "Cormorant Garamond × Inter",
      headingFont: "'Cormorant Garamond', 'Playfair Display', serif",
      bodyFont: "'Inter', system-ui, sans-serif",
    },
    rule: "Serif editoriale + sans-serif neutro · palette dark sakura/oro.",
  },
  strapizzami: {
    variant: "strapizzami",
    label: "Strapizzami",
    primary: "#C84A2A",
    accent: "#B8893E",
    palette: [
      { name: "Terracotta",  hex: "#C84A2A" },
      { name: "Olive Gold",  hex: "#B8893E" },
      { name: "Cream",       hex: "#F5EBD8" },
      { name: "Espresso",    hex: "#3D2818" },
    ],
    typography: {
      pairLabel: "Caveat × Inter",
      headingFont: "'Caveat', 'Kalam', cursive",
      bodyFont: "'Inter', system-ui, sans-serif",
    },
    rule: "Heading manoscritto caldo + sans-serif leggibile · cream/terracotta.",
  },
  batey: {
    variant: "batey",
    label: "Batey Pacifico",
    primary: "#5CC8D9",
    accent: "#FF8966",
    palette: [
      { name: "Azure Lagoon", hex: "#5CC8D9" },
      { name: "Coral Sunset", hex: "#FF8966" },
      { name: "Deep Ocean",   hex: "#08131F" },
      { name: "Sand Dune",    hex: "#E8D5A8" },
    ],
    typography: {
      pairLabel: "Sora × Inter",
      headingFont: "'Sora', 'Manrope', sans-serif",
      bodyFont: "'Inter', system-ui, sans-serif",
    },
    rule: "Sans geometrico moderno + Inter · azure/coral su deep ocean.",
  },
  luxury_gold: {
    variant: "luxury_gold",
    label: "Luxury Gold",
    primary: "#D4AF37",
    accent: "#F0D78C",
    palette: [
      { name: "Champagne Gold", hex: "#D4AF37" },
      { name: "Pale Gold",      hex: "#F0D78C" },
      { name: "Onyx",           hex: "#0E0B0F" },
      { name: "Cream Linen",    hex: "#F5E9D8" },
    ],
    typography: {
      pairLabel: "Cormorant Garamond × Inter",
      headingFont: "'Cormorant Garamond', serif",
      bodyFont: "'Inter', system-ui, sans-serif",
    },
    rule: "Serif classico raffinato + sans-serif sobrio · oro su nero.",
  },
  casual_warm: {
    variant: "casual_warm",
    label: "Casual Warm",
    primary: "#E07856",
    accent: "#7A9B6B",
    palette: [
      { name: "Warm Coral",  hex: "#E07856" },
      { name: "Sage Olive",  hex: "#7A9B6B" },
      { name: "Cream",       hex: "#F5EBD8" },
      { name: "Espresso",    hex: "#3D2818" },
    ],
    typography: {
      pairLabel: "Outfit × Inter",
      headingFont: "'Outfit', system-ui, sans-serif",
      bodyFont: "'Inter', system-ui, sans-serif",
    },
    rule: "Sans amichevole + Inter · cream/coral con verde salvia.",
  },
  minimal_zen: {
    variant: "minimal_zen",
    label: "Minimal Zen",
    primary: "#2A2A2A",
    accent: "#9B9B9B",
    palette: [
      { name: "Ink Black",   hex: "#2A2A2A" },
      { name: "Stone Gray",  hex: "#9B9B9B" },
      { name: "Linen White", hex: "#FAFAFA" },
      { name: "Misty Sage",  hex: "#C8D5C0" },
    ],
    typography: {
      pairLabel: "Helvetica Neue × Helvetica Neue",
      headingFont: "'Helvetica Neue', sans-serif",
      bodyFont: "'Helvetica Neue', sans-serif",
    },
    rule: "Helvetica monospaziale per heading + body · scala di grigi pura.",
  },
  modern_dark: {
    variant: "modern_dark",
    label: "Modern Dark",
    primary: "#C8963E",
    accent: "#3B82F6",
    palette: [
      { name: "Imperial Gold", hex: "#C8963E" },
      { name: "Tech Blue",     hex: "#3B82F6" },
      { name: "Slate 950",     hex: "#0F172A" },
      { name: "Cool White",    hex: "#F1F5F9" },
    ],
    typography: {
      pairLabel: "Inter × Inter",
      headingFont: "'Inter', system-ui, sans-serif",
      bodyFont: "'Inter', system-ui, sans-serif",
    },
    rule: "Inter end-to-end · oro imperiale su dark slate per UI tech.",
  },
  neon_vibrant: {
    variant: "neon_vibrant",
    label: "Neon Vibrant",
    primary: "#FF2E9A",
    accent: "#00E5FF",
    palette: [
      { name: "Neon Magenta", hex: "#FF2E9A" },
      { name: "Cyber Cyan",   hex: "#00E5FF" },
      { name: "Deep Violet",  hex: "#1F0F3D" },
      { name: "Electric Yellow", hex: "#FFD60A" },
    ],
    typography: {
      pairLabel: "Space Grotesk × Inter",
      headingFont: "'Space Grotesk', 'Sora', sans-serif",
      bodyFont: "'Inter', system-ui, sans-serif",
    },
    rule: "Display geometrico hi-tech + Inter · accenti neon su violet base.",
  },
  editorial_clean: {
    variant: "editorial_clean",
    label: "Editorial Clean",
    primary: "#0A0A0A",
    accent: "#D9534F",
    palette: [
      { name: "Ink Black",     hex: "#0A0A0A" },
      { name: "Editorial Red", hex: "#D9534F" },
      { name: "Paper White",   hex: "#FAFAFA" },
      { name: "Warm Stone",    hex: "#E8E2D4" },
    ],
    typography: {
      pairLabel: "Playfair Display × Inter",
      headingFont: "'Playfair Display', 'Cormorant Garamond', serif",
      bodyFont: "'Inter', system-ui, sans-serif",
    },
    rule: "Serif magazine drammatico + Inter · b/n con accent rosso editoriale.",
  },
  boutique_pastel: {
    variant: "boutique_pastel",
    label: "Boutique Pastel",
    primary: "#E8A0B8",
    accent: "#A89DC9",
    palette: [
      { name: "Blush Rose",  hex: "#E8A0B8" },
      { name: "Lavender",    hex: "#A89DC9" },
      { name: "Plum Wine",   hex: "#3A2A35" },
      { name: "Soft Cream",  hex: "#F8F0F4" },
    ],
    typography: {
      pairLabel: "DM Serif Display × Outfit",
      headingFont: "'DM Serif Display', 'Cormorant Garamond', serif",
      bodyFont: "'Outfit', system-ui, sans-serif",
    },
    rule: "Display serif vezzoso + Outfit morbido · pastello rosa/lavanda.",
  },
  monochrome_bold: {
    variant: "monochrome_bold",
    label: "Monochrome Bold",
    primary: "#FAFAFA",
    accent: "#FFD60A",
    palette: [
      { name: "Pure White",  hex: "#FAFAFA" },
      { name: "Hi-Vis Yellow", hex: "#FFD60A" },
      { name: "True Black",  hex: "#0A0A0A" },
      { name: "Steel Gray",  hex: "#5C5C5C" },
    ],
    typography: {
      pairLabel: "Archivo Black × Inter",
      headingFont: "'Archivo Black', 'Inter', sans-serif",
      bodyFont: "'Inter', system-ui, sans-serif",
    },
    rule: "Display extra-bold + Inter · b/n estremo con un solo accento giallo.",
  },
  glass_aurora: {
    variant: "glass_aurora",
    label: "Glass Aurora",
    primary: "#7C9FFF",
    accent: "#A5F3D0",
    palette: [
      { name: "Aurora Blue", hex: "#7C9FFF" },
      { name: "Mint Glow",   hex: "#A5F3D0" },
      { name: "Midnight",    hex: "#0B0F1F" },
      { name: "Iris Lilac",  hex: "#C9A4FF" },
    ],
    typography: {
      pairLabel: "Sora × Inter",
      headingFont: "'Sora', 'Manrope', sans-serif",
      bodyFont: "'Inter', system-ui, sans-serif",
    },
    rule: "Sans futurista + Inter · glassmorphism aurora su midnight blue.",
  },
  real_estate_trust: {
    variant: "real_estate_trust",
    label: "Real Estate Trust",
    primary: "#1B2A3A",
    accent: "#B89760",
    palette: [
      { name: "Navy Trust",   hex: "#1B2A3A" },
      { name: "Brass Gold",   hex: "#B89760" },
      { name: "Marble White", hex: "#F5F5F0" },
      { name: "Slate Mist",   hex: "#7A8899" },
    ],
    typography: {
      pairLabel: "Cormorant Garamond × Inter",
      headingFont: "'Cormorant Garamond', 'Playfair Display', serif",
      bodyFont: "'Inter', system-ui, sans-serif",
    },
    rule: "Serif istituzionale + Inter · navy/oro per trust finanza & immobiliare.",
  },
  fitness_energy: {
    variant: "fitness_energy",
    label: "Fitness Energy",
    primary: "#C8FF00",
    accent: "#FF3D3D",
    palette: [
      { name: "Lime Energy", hex: "#C8FF00" },
      { name: "Burst Red",   hex: "#FF3D3D" },
      { name: "Carbon",      hex: "#0D0D0D" },
      { name: "Cool White",  hex: "#F5F5F5" },
    ],
    typography: {
      pairLabel: "Archivo Black × Inter",
      headingFont: "'Archivo Black', 'Bebas Neue', sans-serif",
      bodyFont: "'Inter', system-ui, sans-serif",
    },
    rule: "Display sport extra-bold + Inter · lime hi-vis su carbon nero.",
  },
};

/** Default kit when no template matches (safe fallback). */
export const DEFAULT_BRANDING_KIT: TemplateBrandingKit = TEMPLATE_BRANDING.modern_dark;

/** Returns the branding kit for a given variant key, or the default fallback. */
export function getBrandingKit(variant: string | undefined | null): TemplateBrandingKit {
  if (!variant) return DEFAULT_BRANDING_KIT;
  return TEMPLATE_BRANDING[variant] ?? DEFAULT_BRANDING_KIT;
}
