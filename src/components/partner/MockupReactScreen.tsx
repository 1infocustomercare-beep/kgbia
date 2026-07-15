/**
 * Premium iPhone mockup screens — 100% in-app UI, no AI calls.
 * Each template variant has its OWN visual personality (colors, typography, layout density,
 * imagery style) but all 4 screens (home/menu/booking/profile/gallery/checkout) stay coherent
 * within the same template.
 *
 * Quality target: looks like a real production app — rich imagery (gradient/SVG art),
 * cards with prices and ratings, badges, search bars, segmented controls, swipeable rows,
 * loyalty banners, payment summaries.
 */

export type ColorStyle = "vivid" | "muted" | "pastel" | "mono";

interface Props {
  type: string;
  templateVariant: string;
  businessName: string;
  businessSector?: string;
  businessCity?: string;
  primaryColor?: string;
  width: number;
  height: number;
  /** 0–100. 0 = nessun blur, 100 = vetro massimo (default 60). Influisce su BottomNav e overlay. */
  glassIntensity?: number;
  /** vivid (originale) | muted (-20% sat) | pastel (+luminosità, -sat) | mono (B/N + accent). */
  colorStyle?: ColorStyle;
  /** Padding interno orizzontale aggiuntivo (px) per garantire safe-area dai bordi del frame. Default 0. */
  safeAreaPx?: number;
  /** Moltiplicatore tipografia (0.85–1.20). Default 1.00. Scala via CSS var --mockup-type-scale. */
  typeScale?: number;
  /** Forza testo con contrasto AA: opacizza meno il muted, schiarisce/scurisce il text base. */
  boostContrast?: boolean;
  /** Override font heading dal Branding Kit (es. "'Playfair Display', serif"). Se assente, usa il font del template. */
  fontHeadOverride?: string;
  /** Override font body dal Branding Kit (es. "'Inter', sans-serif"). Se assente, usa il font del template. */
  fontBodyOverride?: string;
}

interface ThemeTokens {
  bg: string;
  bgPanel: string;
  bgPanelAlt: string;
  text: string;
  textMuted: string;
  primary: string;
  accent: string;
  fontHead: string;
  fontBody: string;
  // Visual identity flags
  vibe:
    | "dark-luxury" | "warm-craft" | "ocean-breeze" | "minimal-zen"
    | "sushi-noir" | "gold-elegance" | "tech-modern" | "neon-vibrant"
    | "editorial-clean" | "boutique-pastel" | "monochrome-bold" | "glass-aurora"
    | "real-estate-trust" | "fitness-energy" | "clinical-crystal" | "sunset-hospitality"
    | "retail-chrome" | "blueprint-build" | "utility-flow" | "pet-playful"
    | "childcare-sun" | "legal-navy" | "emerald-ledger" | "limo-noir";
  radius: number;
  imageStyle:
    | "food-warm" | "spa-soft" | "ocean" | "noir" | "luxury" | "modern"
    | "vibrant" | "pastel" | "monochrome" | "aurora" | "estate" | "energy"
    | "clinical" | "hospitality" | "retail" | "blueprint" | "utility" | "pet"
    | "childcare" | "legal" | "ledger" | "limo";
  /** Optional runtime override for glass intensity propagated to BottomNav and overlays. */
  glassIntensity?: number;
}

// ────────────────────────────────────────────────────────────────────────────
// Color helpers — convert hex ↔ HSL to apply colorStyle transforms.
// ────────────────────────────────────────────────────────────────────────────
function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const m = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(m)) return null;
  const r = parseInt(m.slice(0, 2), 16) / 255;
  const g = parseInt(m.slice(2, 4), 16) / 255;
  const b = parseInt(m.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}
function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const c = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(c * 255).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function applyColorStyle(hex: string | undefined, style: ColorStyle | undefined): string | undefined {
  if (!hex || !style || style === "vivid") return hex;
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;
  if (style === "muted")  return hslToHex(hsl.h, Math.max(0, hsl.s - 25), hsl.l);
  if (style === "pastel") return hslToHex(hsl.h, Math.max(0, Math.min(hsl.s, 55)), Math.min(88, hsl.l + 15));
  if (style === "mono")   return hslToHex(hsl.h, 0, hsl.l); // grayscale
  return hex;
}

function getTheme(variant: string, primaryOverride?: string, colorStyle?: ColorStyle): ThemeTokens {
  const themes: Record<string, ThemeTokens> = {
    paperfish: {
      bg: "#0E0B0F", bgPanel: "#181216", bgPanelAlt: "#221A1F",
      text: "#F5E9EC", textMuted: "rgba(245,233,236,0.55)",
      primary: "#E89BAE", accent: "#C9A86A",
      fontHead: "'Cormorant Garamond', 'Playfair Display', serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "sushi-noir", radius: 14, imageStyle: "noir",
    },
    strapizzami: {
      bg: "#F5EBD8", bgPanel: "#FFFFFF", bgPanelAlt: "#FFF4E0",
      text: "#3D2818", textMuted: "rgba(61,40,24,0.55)",
      primary: "#C84A2A", accent: "#B8893E",
      fontHead: "'Caveat', 'Kalam', cursive",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "warm-craft", radius: 18, imageStyle: "food-warm",
    },
    batey: {
      bg: "#08131F", bgPanel: "#0E1E2D", bgPanelAlt: "#142838",
      text: "#E8D5A8", textMuted: "rgba(232,213,168,0.55)",
      primary: "#5CC8D9", accent: "#FF8966",
      fontHead: "'Sora', 'Manrope', sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "ocean-breeze", radius: 20, imageStyle: "ocean",
    },
    luxury_gold: {
      bg: "#1A1410", bgPanel: "#221915", bgPanelAlt: "#2C2018",
      text: "#F5E9D8", textMuted: "rgba(245,233,216,0.55)",
      primary: "#D4AF37", accent: "#F0D78C",
      fontHead: "'Cormorant Garamond', serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "gold-elegance", radius: 12, imageStyle: "luxury",
    },
    casual_warm: {
      bg: "#FAF6F0", bgPanel: "#FFFFFF", bgPanelAlt: "#FFF8EE",
      text: "#3D2818", textMuted: "rgba(61,40,24,0.55)",
      primary: "#E07856", accent: "#7A9B6B",
      fontHead: "'Outfit', system-ui, sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "warm-craft", radius: 18, imageStyle: "food-warm",
    },
    minimal_zen: {
      bg: "#F8F8F8", bgPanel: "#FFFFFF", bgPanelAlt: "#EFEFEF",
      text: "#1F1F1F", textMuted: "rgba(31,31,31,0.5)",
      primary: "#2A2A2A", accent: "#9B9B9B",
      fontHead: "'Helvetica Neue', sans-serif",
      fontBody: "'Helvetica Neue', sans-serif",
      vibe: "minimal-zen", radius: 8, imageStyle: "spa-soft",
    },
    modern_dark: {
      bg: "#0F172A", bgPanel: "#1E293B", bgPanelAlt: "#293548",
      text: "#F1F5F9", textMuted: "rgba(241,245,249,0.55)",
      primary: "#C8963E", accent: "#3B82F6",
      fontHead: "'Inter', system-ui, sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "tech-modern", radius: 16, imageStyle: "modern",
    },
    neon_vibrant: {
      bg: "#0A0118", bgPanel: "#15082A", bgPanelAlt: "#1F0F3D",
      text: "#F8F4FF", textMuted: "rgba(248,244,255,0.55)",
      primary: "#FF2E9A", accent: "#00E5FF",
      fontHead: "'Space Grotesk', 'Sora', sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "neon-vibrant", radius: 22, imageStyle: "vibrant",
    },
    editorial_clean: {
      bg: "#FFFFFF", bgPanel: "#F7F5F1", bgPanelAlt: "#EFEBE3",
      text: "#0A0A0A", textMuted: "rgba(10,10,10,0.55)",
      primary: "#0A0A0A", accent: "#D9534F",
      fontHead: "'Playfair Display', 'Cormorant Garamond', serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "editorial-clean", radius: 6, imageStyle: "monochrome",
    },
    boutique_pastel: {
      bg: "#FFF6F2", bgPanel: "#FFFFFF", bgPanelAlt: "#FFEDE3",
      text: "#3A2A35", textMuted: "rgba(58,42,53,0.55)",
      primary: "#E8A0B8", accent: "#A89DC9",
      fontHead: "'DM Serif Display', 'Cormorant Garamond', serif",
      fontBody: "'Outfit', system-ui, sans-serif",
      vibe: "boutique-pastel", radius: 24, imageStyle: "pastel",
    },
    monochrome_bold: {
      bg: "#0A0A0A", bgPanel: "#161616", bgPanelAlt: "#1F1F1F",
      text: "#FAFAFA", textMuted: "rgba(250,250,250,0.55)",
      primary: "#FAFAFA", accent: "#FFD60A",
      fontHead: "'Archivo Black', 'Inter', sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "monochrome-bold", radius: 4, imageStyle: "monochrome",
    },
    glass_aurora: {
      bg: "#0B0F1F", bgPanel: "#141B33", bgPanelAlt: "#1B2547",
      text: "#E8EEFF", textMuted: "rgba(232,238,255,0.55)",
      primary: "#7C9FFF", accent: "#A5F3D0",
      fontHead: "'Sora', 'Manrope', sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "glass-aurora", radius: 20, imageStyle: "aurora",
    },
    real_estate_trust: {
      bg: "#F5F2EC", bgPanel: "#FFFFFF", bgPanelAlt: "#EAE3D3",
      text: "#1B2A3A", textMuted: "rgba(27,42,58,0.55)",
      primary: "#1B2A3A", accent: "#B89760",
      fontHead: "'Cormorant Garamond', 'Playfair Display', serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "real-estate-trust", radius: 10, imageStyle: "estate",
    },
    fitness_energy: {
      bg: "#0D0D0D", bgPanel: "#171717", bgPanelAlt: "#222222",
      text: "#F5F5F5", textMuted: "rgba(245,245,245,0.55)",
      primary: "#C8FF00", accent: "#FF3D3D",
      fontHead: "'Archivo Black', 'Bebas Neue', sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "fitness-energy", radius: 14, imageStyle: "energy",
    },
    clinical_clean: {
      bg: "#F6FBFF", bgPanel: "#FFFFFF", bgPanelAlt: "#E8F5FF",
      text: "#123047", textMuted: "rgba(18,48,71,0.58)",
      primary: "#0EA5B7", accent: "#7DD3FC",
      fontHead: "'Sora', 'Manrope', sans-serif",
      fontBody: "'Manrope', system-ui, sans-serif",
      vibe: "clinical-crystal", radius: 16, imageStyle: "clinical",
    },
    beach_resort: {
      bg: "#06212C", bgPanel: "#0E3742", bgPanelAlt: "#155261",
      text: "#FFF2D6", textMuted: "rgba(255,242,214,0.62)",
      primary: "#4DD4C6", accent: "#FFB36B",
      fontHead: "'Sora', 'Manrope', sans-serif",
      fontBody: "'Outfit', system-ui, sans-serif",
      vibe: "ocean-breeze", radius: 26, imageStyle: "ocean",
    },
    hospitality_sunset: {
      bg: "#20121A", bgPanel: "#2D1B24", bgPanelAlt: "#3A2530",
      text: "#FFF0DE", textMuted: "rgba(255,240,222,0.62)",
      primary: "#FF9F6E", accent: "#D8B4FE",
      fontHead: "'DM Serif Display', 'Cormorant Garamond', serif",
      fontBody: "'Outfit', system-ui, sans-serif",
      vibe: "sunset-hospitality", radius: 24, imageStyle: "hospitality",
    },
    retail_chrome: {
      bg: "#F7F8FB", bgPanel: "#FFFFFF", bgPanelAlt: "#E9EEF7",
      text: "#111827", textMuted: "rgba(17,24,39,0.55)",
      primary: "#FF3B7A", accent: "#00B8D9",
      fontHead: "'Space Grotesk', 'Sora', sans-serif",
      fontBody: "'Manrope', system-ui, sans-serif",
      vibe: "retail-chrome", radius: 18, imageStyle: "retail",
    },
    construction_blueprint: {
      bg: "#0D1B2A", bgPanel: "#152C42", bgPanelAlt: "#1F3F5C",
      text: "#EAF4FF", textMuted: "rgba(234,244,255,0.62)",
      primary: "#F6C85F", accent: "#6BC6FF",
      fontHead: "'Urbanist', 'Sora', sans-serif",
      fontBody: "'Manrope', system-ui, sans-serif",
      vibe: "blueprint-build", radius: 8, imageStyle: "blueprint",
    },
    plumber_utility: {
      bg: "#071A24", bgPanel: "#0E2B38", bgPanelAlt: "#123C4F",
      text: "#E9FBFF", textMuted: "rgba(233,251,255,0.62)",
      primary: "#26D9B8", accent: "#FFCF5A",
      fontHead: "'Sora', 'Manrope', sans-serif",
      fontBody: "'Manrope', system-ui, sans-serif",
      vibe: "utility-flow", radius: 20, imageStyle: "utility",
    },
    pet_care_playful: {
      bg: "#FFF9EC", bgPanel: "#FFFFFF", bgPanelAlt: "#FCE8C8",
      text: "#3E2A1C", textMuted: "rgba(62,42,28,0.58)",
      primary: "#7C9A4B", accent: "#F08A5D",
      fontHead: "'Outfit', 'Nunito Sans', sans-serif",
      fontBody: "'Nunito Sans', system-ui, sans-serif",
      vibe: "pet-playful", radius: 22, imageStyle: "pet",
    },
    childcare_sunshine: {
      bg: "#FFF7D8", bgPanel: "#FFFFFF", bgPanelAlt: "#FFE9A8",
      text: "#49321A", textMuted: "rgba(73,50,26,0.58)",
      primary: "#FF8B3D", accent: "#57B7FF",
      fontHead: "'Outfit', 'Nunito Sans', sans-serif",
      fontBody: "'Nunito Sans', system-ui, sans-serif",
      vibe: "childcare-sun", radius: 28, imageStyle: "childcare",
    },
    legal_navy: {
      bg: "#081426", bgPanel: "#111F36", bgPanelAlt: "#1A2B46",
      text: "#F4ECDC", textMuted: "rgba(244,236,220,0.60)",
      primary: "#C7A66A", accent: "#8FB3D9",
      fontHead: "'Libre Baskerville', 'Cormorant Garamond', serif",
      fontBody: "'IBM Plex Sans', system-ui, sans-serif",
      vibe: "legal-navy", radius: 6, imageStyle: "legal",
    },
    accounting_emerald: {
      bg: "#06241D", bgPanel: "#0C352B", bgPanelAlt: "#10483A",
      text: "#F0FFF8", textMuted: "rgba(240,255,248,0.60)",
      primary: "#65D6A4", accent: "#E5C76B",
      fontHead: "'Sora', 'Manrope', sans-serif",
      fontBody: "'IBM Plex Sans', system-ui, sans-serif",
      vibe: "emerald-ledger", radius: 10, imageStyle: "ledger",
    },
    ncc_limo: {
      bg: "#070708", bgPanel: "#141416", bgPanelAlt: "#202026",
      text: "#F7F0E6", textMuted: "rgba(247,240,230,0.58)",
      primary: "#CFA85B", accent: "#A7B7C7",
      fontHead: "'Cormorant Garamond', 'Playfair Display', serif",
      fontBody: "'Manrope', system-ui, sans-serif",
      vibe: "limo-noir", radius: 12, imageStyle: "limo",
    },
  };
  // Aliases for variants used in edge function but mapped to closest existing theme
  const aliases: Record<string, string> = {
    noir_gold: "luxury_gold",
    blush_lavender: "boutique_pastel",
    ocean_deep: "beach_resort",
    luxury_chrome: "monochrome_bold",
    navy_trust: "real_estate_trust",
  };
  const resolved = aliases[variant] || variant;
  const base = themes[resolved] || themes.modern_dark;
  const styledPrimary = applyColorStyle(primaryOverride || base.primary, colorStyle) || base.primary;
  const styledAccent = applyColorStyle(base.accent, colorStyle) || base.accent;
  return { ...base, primary: styledPrimary, accent: styledAccent };
}

// ════════════════════════════════════════════════════════════════════════════
// Visual asset generator: SVG "photos" using gradients + abstract shapes
// Different per imageStyle so each template feels visually distinct.
// ════════════════════════════════════════════════════════════════════════════
function ArtImage({ theme, seed = 0, className = "", style = {} }: { theme: ThemeTokens; seed?: number; className?: string; style?: React.CSSProperties }) {
  const palettes: Record<ThemeTokens["imageStyle"], string[][]> = {
    "food-warm":  [["#E07856","#C84A2A","#7A4A2A"], ["#F4A261","#E76F51","#8B4513"], ["#D4814B","#A0522D","#5C2E0E"], ["#E89B6C","#B85450","#3D1F0A"]],
    "spa-soft":   [["#C9D4C5","#A8B5A0","#6B7B6F"], ["#D8C8B8","#A89880","#705F4F"], ["#B8C8D4","#8FA0B0","#5A6B7A"], ["#E0D5C8","#B8AB9C","#7A6F60"]],
    "ocean":      [["#5CC8D9","#3B7A8C","#0E1E2D"], ["#FF8966","#D4814B","#5C2E0E"], ["#A8D8E0","#5CB0C2","#1F4858"], ["#E8D5A8","#B89E6E","#5A4828"]],
    "noir":       [["#E89BAE","#A66578","#3D1A28"], ["#C9A86A","#8B7548","#2A1F12"], ["#D4A0B8","#7A4858","#1F0F18"], ["#F0DCC8","#A0826B","#2D1F18"]],
    "luxury":     [["#D4AF37","#9B8030","#3D2F18"], ["#F0D78C","#B89548","#5C4220"], ["#E8C46A","#A07830","#2D1F0E"], ["#F5E9D8","#C8A878","#5C4828"]],
    "modern":     [["#3B82F6","#1E40AF","#0F172A"], ["#C8963E","#8B6928","#3D2D14"], ["#8B5CF6","#5B21B6","#1E1B4B"], ["#10B981","#047857","#022C22"]],
    "vibrant":    [["#FF2E9A","#9C27B0","#0A0118"], ["#00E5FF","#1976D2","#0A0118"], ["#FFD60A","#FF8C00","#1F0F3D"], ["#7C4DFF","#311B92","#0A0118"]],
    "pastel":     [["#FAD0C4","#FFD3DC","#A89DC9"], ["#FFEAA7","#FAB1A0","#E8A0B8"], ["#A8E6CF","#FFD3B6","#FFAAA5"], ["#D4A5C9","#F5C6E0","#B8E0D2"]],
    "monochrome": [["#0A0A0A","#3F3F3F","#FAFAFA"], ["#FAFAFA","#A1A1A1","#0A0A0A"], ["#1F1F1F","#5C5C5C","#E5E5E5"], ["#FAFAFA","#737373","#0A0A0A"]],
    "aurora":     [["#7C9FFF","#A5F3D0","#0B0F1F"], ["#C9A4FF","#7CD8FF","#141B33"], ["#A5F3D0","#FFD3B6","#0B0F1F"], ["#FF9EC7","#A8B0FF","#1B2547"]],
    "estate":     [["#B89760","#7A6240","#1B2A3A"], ["#D4BC8A","#9C8557","#2C3E50"], ["#E0C9A0","#A88B5C","#34495E"], ["#F5E9D2","#B89760","#1B2A3A"]],
    "energy":     [["#C8FF00","#7AAD00","#0D0D0D"], ["#FF3D3D","#A02020","#0D0D0D"], ["#00FFE5","#0099A8","#171717"], ["#FFD60A","#B89500","#0D0D0D"]],
    "clinical":   [["#DDF7FF","#6ED8E8","#0EA5B7"], ["#FFFFFF","#BFEFFF","#1B7A8A"], ["#EAFBFF","#7DD3FC","#123047"], ["#F6FBFF","#9FE7F2","#0B7285"]],
    "hospitality":[["#FF9F6E","#C45C8A","#20121A"], ["#D8B4FE","#FFB36B","#3A2530"], ["#FFE0B8","#D9826B","#2D1B24"], ["#F8C7A3","#B85B88","#20121A"]],
    "retail":     [["#FF3B7A","#00B8D9","#F7F8FB"], ["#111827","#C7D2FE","#FFFFFF"], ["#00E0C6","#FFB4D2","#E9EEF7"], ["#FB7185","#38BDF8","#111827"]],
    "blueprint":  [["#F6C85F","#6BC6FF","#0D1B2A"], ["#D7E7F5","#416D91","#152C42"], ["#FFDD7A","#1F3F5C","#091522"], ["#9DD5FF","#F6C85F","#20364E"]],
    "utility":    [["#26D9B8","#FFCF5A","#071A24"], ["#3B82F6","#26D9B8","#0E2B38"], ["#E9FBFF","#FFCF5A","#123C4F"], ["#12BFA5","#F97316","#071A24"]],
    "pet":        [["#7C9A4B","#F08A5D","#FFF9EC"], ["#FFD36E","#78B7A6","#5A3D2B"], ["#F6C177","#A7C957","#FFFFFF"], ["#E5989B","#6B705C","#FFF1DC"]],
    "childcare":  [["#FF8B3D","#57B7FF","#FFF7D8"], ["#FFE45E","#8BD3DD","#F7A072"], ["#9AE66E","#FFB6C1","#FFF4B8"], ["#57B7FF","#FFCF5A","#49321A"]],
    "legal":      [["#C7A66A","#8FB3D9","#081426"], ["#F4ECDC","#455A78","#111F36"], ["#B79A5D","#233957","#06101F"], ["#E8D9BE","#8FB3D9","#1A2B46"]],
    "ledger":     [["#65D6A4","#E5C76B","#06241D"], ["#D9FFF0","#2E8B67","#0C352B"], ["#A7F3D0","#FDE68A","#10483A"], ["#30B981","#C7A64A","#06241D"]],
    "limo":       [["#CFA85B","#A7B7C7","#070708"], ["#F7F0E6","#CFA85B","#141416"], ["#4B5563","#D8C08A","#020203"], ["#A7B7C7","#725A2E","#202026"]],
  };
  const palette = palettes[theme.imageStyle][seed % palettes[theme.imageStyle].length];
  const id = `g-${theme.imageStyle}-${seed}`;
  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette[0]} />
            <stop offset="60%" stopColor={palette[1]} />
            <stop offset="100%" stopColor={palette[2]} />
          </linearGradient>
          <radialGradient id={`${id}-r`} cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor={palette[0]} stopOpacity="0.9" />
            <stop offset="100%" stopColor={palette[2]} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#${id})`} />
        <circle cx={20 + (seed * 17) % 60} cy={25 + (seed * 13) % 50} r={18 + (seed % 4) * 4} fill={`url(#${id}-r)`} opacity="0.8" />
        <circle cx={70 - (seed * 11) % 40} cy={70 - (seed * 7) % 30} r={12 + (seed % 3) * 3} fill={palette[0]} opacity="0.3" />
        {theme.imageStyle === "noir" && <rect x="0" y="60" width="100" height="40" fill="black" opacity="0.4" />}
        {theme.imageStyle === "luxury" && <path d={`M0,${50 + seed % 20} Q50,${30 + seed % 20} 100,${55 + seed % 15} L100,100 L0,100 Z`} fill={palette[2]} opacity="0.5" />}
        {theme.imageStyle === "ocean" && <path d={`M0,${65 + seed % 10} Q25,${55 + seed % 10} 50,${65} T100,${60} L100,100 L0,100 Z`} fill="white" opacity="0.15" />}
        {theme.imageStyle === "clinical" && <g opacity="0.24" stroke="#fff" strokeWidth="1"><path d="M15 20h70M15 38h70M15 56h70M15 74h70M24 12v76M46 12v76M68 12v76"/><path d="M40 26h20M50 16v20" strokeWidth="3"/></g>}
        {theme.imageStyle === "hospitality" && <path d="M0 78 C24 54 34 82 58 58 S82 38 100 58 L100 100 L0 100 Z" fill="#fff" opacity="0.18" />}
        {theme.imageStyle === "retail" && <g opacity="0.18" fill="#fff"><path d="M-10 24 L24 -10 H48 L-10 48Z"/><path d="M48 110 L110 48 V75 L75 110Z"/><rect x="12" y="62" width="42" height="10" rx="5"/></g>}
        {theme.imageStyle === "blueprint" && <g opacity="0.30" stroke="#fff" fill="none"><path d="M8 18h84v54H8zM8 38h84M35 18v54M62 18v54"/><path d="M14 84h70" strokeDasharray="4 3"/></g>}
        {theme.imageStyle === "utility" && <g opacity="0.22" fill="#fff"><path d="M0 72 C18 56 36 90 54 68 S82 48 100 64 V100 H0Z"/><rect x="18" y="22" width="64" height="12" rx="6" transform="rotate(-14 50 28)"/></g>}
        {theme.imageStyle === "pet" && <g opacity="0.23" fill="#fff"><ellipse cx="34" cy="46" rx="13" ry="10"/><circle cx="22" cy="32" r="5"/><circle cx="34" cy="28" r="5"/><circle cx="47" cy="32" r="5"/><path d="M68 22 C82 34 82 54 66 70" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round"/></g>}
        {theme.imageStyle === "childcare" && <g opacity="0.24" fill="#fff"><path d="M50 16l6 12 14 2-10 10 3 14-13-7-13 7 3-14-10-10 14-2z"/><path d="M8 76 Q30 52 52 76 T96 76" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round"/></g>}
        {theme.imageStyle === "legal" && <g opacity="0.18" stroke="#fff" fill="none" strokeWidth="2"><path d="M50 14v64M28 28h44M32 78h36"/><path d="M28 28l-14 30h28zM72 28l-14 30h28z"/></g>}
        {theme.imageStyle === "ledger" && <g opacity="0.22" stroke="#fff" fill="none"><path d="M16 18h68v64H16zM16 34h68M16 50h68M16 66h68M36 18v64"/><path d="M44 58l8-10 8 7 12-18" strokeWidth="3"/></g>}
        {theme.imageStyle === "limo" && <g opacity="0.20" fill="#fff"><path d="M14 60 C22 42 36 34 58 38 L76 48 C84 49 90 54 92 62 H14Z"/><circle cx="32" cy="66" r="6"/><circle cx="74" cy="66" r="6"/><rect x="34" y="43" width="20" height="10" rx="2" fill={palette[2]} opacity="0.8"/></g>}
      </svg>
    </div>
  );
}

function screenBackground(theme: ThemeTokens) {
  const base = theme.bg;
  const bgByVibe: Partial<Record<ThemeTokens["vibe"], string>> = {
    "sushi-noir": `linear-gradient(180deg, ${base}, ${theme.bgPanelAlt})`,
    "warm-craft": `linear-gradient(160deg, ${theme.bg} 0%, ${theme.bgPanelAlt} 58%, ${theme.primary}18 100%)`,
    "ocean-breeze": `linear-gradient(180deg, ${theme.bg} 0%, ${theme.bgPanelAlt} 100%)`,
    "clinical-crystal": `linear-gradient(180deg, #F8FDFF 0%, ${theme.bgPanelAlt} 100%)`,
    "fitness-energy": `linear-gradient(160deg, ${theme.bg} 0%, #111 46%, ${theme.primary}18 100%)`,
    "blueprint-build": `linear-gradient(180deg, ${theme.bg} 0%, ${theme.bgPanelAlt} 100%)`,
    "childcare-sun": `linear-gradient(180deg, ${theme.bg} 0%, #FFEFB7 100%)`,
    "retail-chrome": `linear-gradient(180deg, ${theme.bg} 0%, ${theme.bgPanelAlt} 100%)`,
    "limo-noir": `linear-gradient(180deg, #020203 0%, ${theme.bgPanel} 100%)`,
  };
  return bgByVibe[theme.vibe] ?? base;
}

function ScreenMotif({ theme }: { theme: ThemeTokens }) {
  const stroke = theme.text;
  const primary = theme.primary;
  const accent = theme.accent;
  const common = "pointer-events-none absolute inset-0 z-0 h-full w-full";
  if (theme.vibe === "blueprint-build") return (
    <svg className={common} viewBox="0 0 240 520" preserveAspectRatio="none" opacity="0.18">
      <path d="M0 70H240M0 140H240M0 210H240M0 280H240M0 350H240M0 420H240M48 0V520M96 0V520M144 0V520M192 0V520" stroke={accent} strokeWidth="1" />
      <path d="M26 470 L104 330 L214 394" stroke={primary} strokeWidth="3" fill="none" strokeDasharray="8 7" />
    </svg>
  );
  if (theme.vibe === "ocean-breeze" || theme.vibe === "sunset-hospitality") return (
    <svg className={common} viewBox="0 0 240 520" preserveAspectRatio="none" opacity="0.18">
      <path d="M-20 130 C50 80 88 164 156 118 S250 114 270 86" stroke={accent} strokeWidth="18" fill="none" strokeLinecap="round" />
      <path d="M-30 420 C42 368 104 450 172 404 S254 378 282 418" stroke={primary} strokeWidth="10" fill="none" strokeLinecap="round" />
    </svg>
  );
  if (theme.vibe === "childcare-sun" || theme.vibe === "pet-playful") return (
    <svg className={common} viewBox="0 0 240 520" preserveAspectRatio="none" opacity="0.16">
      <path d="M24 78 Q72 34 120 78 T216 78" stroke={accent} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M36 430l16 9 16-9 16 9 16-9 16 9 16-9" stroke={primary} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M182 130l8 16 18 3-13 12 3 18-16-8-16 8 3-18-13-12 18-3z" fill={primary} />
    </svg>
  );
  if (theme.vibe === "clinical-crystal") return (
    <svg className={common} viewBox="0 0 240 520" preserveAspectRatio="none" opacity="0.14">
      <path d="M36 80h168M36 150h168M36 220h168M36 290h168M36 360h168M60 40v420M120 40v420M180 40v420" stroke={primary} />
      <path d="M96 126h48M120 102v48" stroke={accent} strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
  if (theme.vibe === "retail-chrome" || theme.vibe === "neon-vibrant") return (
    <svg className={common} viewBox="0 0 240 520" preserveAspectRatio="none" opacity="0.16">
      <path d="M-42 84 L72 -30 H120 L-42 132Z" fill={primary} />
      <path d="M132 550 L282 332 V412 L180 550Z" fill={accent} />
    </svg>
  );
  if (theme.vibe === "legal-navy" || theme.vibe === "emerald-ledger" || theme.vibe === "limo-noir") return (
    <svg className={common} viewBox="0 0 240 520" preserveAspectRatio="none" opacity="0.12">
      <path d="M0 112H240M0 392H240M36 0V520M204 0V520" stroke={primary} />
      <path d="M52 88H188M52 416H188" stroke={stroke} strokeWidth="2" />
    </svg>
  );
  return (
    <svg className={common} viewBox="0 0 240 520" preserveAspectRatio="none" opacity="0.12">
      <path d="M-20 88 C64 38 108 134 188 72 S270 66 292 38" stroke={primary} strokeWidth="12" fill="none" strokeLinecap="round" />
      <path d="M26 466 L112 344 L214 424" stroke={accent} strokeWidth="7" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function mockupSurfaceCss(theme: ThemeTokens) {
  const radiusMap: Partial<Record<ThemeTokens["vibe"], string>> = {
    "sushi-noir": "3px 18px 3px 18px",
    "warm-craft": "18px 8px 22px 10px",
    "ocean-breeze": "24px 24px 10px 24px",
    "minimal-zen": "2px",
    "gold-elegance": "4px 18px 4px 18px",
    "tech-modern": "16px 6px 16px 6px",
    "neon-vibrant": "20px 5px 20px 5px",
    "editorial-clean": "2px",
    "boutique-pastel": "26px 14px 26px 14px",
    "monochrome-bold": "0px",
    "glass-aurora": "22px 8px 22px 8px",
    "real-estate-trust": "8px 2px 18px 2px",
    "fitness-energy": "3px",
    "clinical-crystal": "18px 18px 6px 18px",
    "sunset-hospitality": "26px 10px 26px 10px",
    "retail-chrome": "18px 4px 18px 4px",
    "blueprint-build": "6px",
    "utility-flow": "20px 8px 8px 20px",
    "pet-playful": "22px 14px 28px 14px",
    "childcare-sun": "28px 18px 28px 18px",
    "legal-navy": "2px",
    "emerald-ledger": "10px 2px 10px 2px",
    "limo-noir": "3px 15px 3px 15px",
  };
  const specialClip = theme.vibe === "blueprint-build"
    ? `clip-path: polygon(0 0, 100% 0, 96% 100%, 0 100%);`
    : theme.vibe === "fitness-energy"
    ? `clip-path: polygon(4% 0, 100% 0, 96% 100%, 0 100%);`
    : theme.vibe === "retail-chrome"
    ? `clip-path: polygon(0 0, 92% 0, 100% 18%, 100% 100%, 8% 100%, 0 82%);`
    : "";
  return `
    .mockup-screen .rounded-xl,.mockup-screen .rounded-2xl,.mockup-screen .rounded-lg{
      border-radius:${radiusMap[theme.vibe] ?? `${theme.radius}px`} !important;
      border-color:${theme.primary}22;
      box-shadow: inset 0 1px 0 ${theme.text}10, 0 10px 26px -20px ${theme.primary};
    }
    .mockup-screen[data-vibe="blueprint-build"] .rounded-xl,
    .mockup-screen[data-vibe="fitness-energy"] .rounded-xl,
    .mockup-screen[data-vibe="retail-chrome"] .rounded-xl{${specialClip}}
    .mockup-screen[data-vibe="sushi-noir"] .rounded-full{border-radius:2px 999px 999px 2px!important;}
    .mockup-screen[data-vibe="monochrome-bold"] .rounded-full{border-radius:0!important;}
    .mockup-screen[data-vibe="childcare-sun"] .rounded-md{border-radius:14px!important;}
    @media (prefers-reduced-motion:no-preference){
      .mockup-screen [data-float="true"]{animation:mockupFloat 3.8s ease-in-out infinite;}
      .mockup-screen [data-slide="true"]{animation:mockupSlide 4.4s ease-in-out infinite;}
    }
    @keyframes mockupFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
    @keyframes mockupSlide{0%,100%{transform:translateX(0)}50%{transform:translateX(4px)}}
  `;
}

// ════════════════════════════════════════════════════════════════════════════
// Reusable iPhone shell pieces
// ════════════════════════════════════════════════════════════════════════════
function StatusBar({ theme }: { theme: ThemeTokens }) {
  return (
    <div className="flex items-center justify-between px-5 pt-2 pb-1 text-[9px] font-semibold relative z-20" style={{ color: theme.text }}>
      <span>9:41</span>
      <span className="absolute left-1/2 -translate-x-1/2 w-12 h-3" />
      <span className="flex items-center gap-1.5">
        <svg width="11" height="7" viewBox="0 0 11 7" fill="currentColor"><path d="M0 5h2v2H0zM3 3h2v4H3zM6 1h2v6H6zM9 0h2v7H9z"/></svg>
        <svg width="9" height="7" viewBox="0 0 9 7" fill="currentColor"><path d="M4.5 1.2A6 6 0 018.4 2.7l-.5.6A5 5 0 004.5 2 5 5 0 001.1 3.3l-.5-.6A6 6 0 014.5 1.2zM4.5 3a4 4 0 012.6 1l-.5.6a3 3 0 00-2.1-.8 3 3 0 00-2.1.8l-.5-.6a4 4 0 012.6-1zM4.5 5a2 2 0 011.3.5L4.5 7 3.2 5.5A2 2 0 014.5 5z"/></svg>
        <span className="flex items-center gap-0.5">
          <span className="text-[8px]">100</span>
          <span className="inline-block w-4 h-2 border rounded-[2px]" style={{ borderColor: theme.text }}><span className="block h-full w-full" style={{ background: theme.text, borderRadius: 1 }} /></span>
        </span>
      </span>
    </div>
  );
}

function BottomNav({ theme, active = "home", glassIntensity }: { theme: ThemeTokens; active?: string; glassIntensity?: number }) {
  const intensity = glassIntensity ?? theme.glassIntensity ?? 60;
  const items = [
    { key: "home",    icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2z", label: "Home" },
    { key: "menu",    icon: "M4 6h16M4 12h16M4 18h16", label: "Menu", stroke: true },
    { key: "booking", icon: "M3 5h18v16H3zM3 10h18M8 3v4M16 3v4", label: "Prenota", stroke: true },
    { key: "profile", icon: "M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0z", label: "Profilo" },
  ];
  // Glass intensity: 0 = nessun blur, opacità 100%; 100 = blur massimo, opacità ridotta
  const clamped = Math.max(0, Math.min(100, intensity));
  const blurPx = Math.round((clamped / 100) * 24); // 0–24px
  // Alpha del pannello (più alto = più opaco): 100% glass → bg trasparente con blur, 0% → opaco
  const alphaHex = Math.round(255 - (clamped * 1.4)).toString(16).padStart(2, "0"); // 100→ ~7d, 0→ ff
  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex justify-around items-center pb-3 pt-2 px-2 z-10"
      style={{
        background: `${theme.bgPanel}${alphaHex}`,
        backdropFilter: blurPx > 0 ? `blur(${blurPx}px) saturate(160%)` : undefined,
        WebkitBackdropFilter: blurPx > 0 ? `blur(${blurPx}px) saturate(160%)` : undefined,
        borderTop: `1px solid ${theme.primary}${clamped > 30 ? "40" : "25"}`,
      }}
    >
      {items.map((it) => {
        const isActive = it.key === active;
        return (
          <div key={it.key} className="flex flex-col items-center gap-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill={it.stroke ? "none" : (isActive ? theme.primary : theme.textMuted)} stroke={it.stroke ? (isActive ? theme.primary : theme.textMuted) : "none"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={it.icon} />
            </svg>
            <span className="text-[7px] font-semibold" style={{ color: isActive ? theme.primary : theme.textMuted }}>{it.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function brandInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase() || "B";
}

function sectorLabel(sector: string) {
  const s = (sector || "").toLowerCase();
  if (s === "food") return "Food & Ristorazione";
  if (s === "beauty") return "Beauty & Wellness";
  if (s === "ncc") return "NCC & Charter";
  if (s === "veterinary") return "Pet Care";
  if (s === "childcare") return "Asilo & Famiglie";
  if (s === "fitness") return "Fitness Club";
  if (s === "healthcare") return "Studio Medico";
  if (s === "construction") return "Cantieri & Real Estate";
  if (s === "hospitality") return "Hotel & Resort";
  if (s === "plumber") return "Servizi Tecnici";
  if (s === "retail") return "Boutique Retail";
  if (s === "beach") return "Beach Club";
  if (/sushi|giappon/.test(s)) return "Sushi & Ramen";
  if (/pizz/.test(s)) return "Pizzeria";
  if (/ristor|trattor|oster/.test(s)) return "Ristorante";
  if (/bar|cafe|caff/.test(s)) return "Caffetteria";
  if (/spa|wellness|benesser/.test(s)) return "Spa & Wellness";
  if (/beauty|estetic|parruc|hair|nail/.test(s)) return "Beauty";
  if (/hotel|albergh|b&b|bnb/.test(s)) return "Hospitality";
  if (/lido|spiagg|beach/.test(s)) return "Beach Club";
  if (/yacht|charter|boat|vela/.test(s)) return "Charter";
  if (/fitness|palestra|gym|crossfit/.test(s)) return "Fitness Club";
  if (/medic|dent|cliniche|salute/.test(s)) return "Healthcare";
  if (/immobil|real ?estate|agenzi/.test(s)) return "Immobiliare";
  if (/ncc|taxi|transfer|noleggi/.test(s)) return "Transfer Premium";
  if (/avvocat|legal|notai|commercia/.test(s)) return "Studio Legale";
  if (/ecommerce|shop|store|fashion|moda|boutique/.test(s)) return "Boutique";
  if (/turism|tour|viagg|escursion/.test(s)) return "Travel";
  if (/event|wedding|cerimoni/.test(s)) return "Eventi";
  if (/edili|costruz|impresa|impiant|ristruttur/.test(s)) return "Trades";
  if (/scuola|academy|corso|format/.test(s)) return "Academy";
  if (/auto|moto|conces/.test(s)) return "Automotive";
  return sector || "Premium";
}

function sectorKind(sector: string) {
  const s = (sector || "").toLowerCase();
  if (s === "food" || /sushi|pizz|ristor|trattor|oster|bar|cafe|kebab|deli|steak/.test(s)) return "food";
  if (s === "beauty" || /spa|wellness|beauty|estetic|parruc|hair|nail/.test(s)) return "beauty";
  if (s === "ncc" || /ncc|taxi|transfer|noleggi|limousine|driver/.test(s)) return "ncc";
  if (s === "beach" || /lido|spiagg|beach|ombrell/.test(s)) return "beach";
  if (s === "hospitality" || s === "agriturismo" || /hotel|resort|albergh|b&b|bnb|stay|suite/.test(s)) return "hospitality";
  if (s === "healthcare" || /medic|dent|clinic|salute|physio/.test(s)) return "healthcare";
  if (s === "fitness" || /fitness|palestra|gym|crossfit|padel|sport/.test(s)) return "fitness";
  if (s === "retail" || /ecommerce|shop|store|fashion|moda|boutique|profum/.test(s)) return "retail";
  if (s === "construction" || /edili|costruz|cantiere|immobil|real ?estate|domus|resident/.test(s)) return "construction";
  if (s === "plumber" || /idraul|plumb|elettr|impiant|cleaning|artigian/.test(s)) return "plumber";
  if (s === "veterinary" || /vet|pet|animali|dog|cat/.test(s)) return "veterinary";
  if (s === "childcare" || /asilo|nursery|scuola|bimbi|child/.test(s)) return "childcare";
  if (s === "legal" || /legal|avvocat|notai/.test(s)) return "legal";
  if (s === "accounting" || /account|commercia|fiscal/.test(s)) return "accounting";
  return "custom";
}

function getExperienceCopy(sector: string) {
  const kind = sectorKind(sector);
  const copy: Record<string, { search: string; hero: string; sub: string; tabs: string[]; featured: string; menu: string; booking: string; bookingNote: string }> = {
    food: { search: "piatti, tavoli, delivery", hero: "Sala piena, cucina sincronizzata", sub: "Menù live · KDS · recensioni", tabs: ["Cena", "Delivery", "Carta vini", "Chef", "Allergeni"], featured: "Piatti che vendono", menu: "Menu operativo", booking: "Prenota tavolo", bookingNote: "Capienza, turni e no-show sotto controllo" },
    beauty: { search: "trattamenti, staff, pacchetti", hero: "Agenda piena e clientela VIP", sub: "Cabine · rebooking · beauty card", tabs: ["Viso", "Capelli", "Nails", "Spa", "VIP"], featured: "Trattamenti signature", menu: "Trattamenti & rituali", booking: "Prenota trattamento", bookingNote: "Staff, cabine e reminder automatici" },
    ncc: { search: "tratte, driver, aeroporti", hero: "Transfer premium in 40 secondi", sub: "Flotta · preventivi · fattura B2B", tabs: ["Airport", "Hourly", "Eventi", "VIP", "B2B"], featured: "Servizi executive", menu: "Tratte & pacchetti", booking: "Calcola preventivo", bookingNote: "Pickup, flight tracking e autista assegnato" },
    beach: { search: "ombrelloni, cabane, attività", hero: "Spiaggia live, mare già prenotato", sub: "Mappa ombrelloni · pass · esperienze", tabs: ["Cabane", "Lettini", "Boat", "Food", "Sunset"], featured: "Esperienze sul mare", menu: "Attività & pass", booking: "Prenota posto", bookingNote: "Mappa real-time e upgrade in spiaggia" },
    hospitality: { search: "camere, suite, concierge", hero: "Ospiti seguiti prima del check-in", sub: "Direct booking · extra · concierge", tabs: ["Suite", "Spa", "Tour", "Dinner", "Transfer"], featured: "Esperienze da vendere", menu: "Camere & extra", booking: "Prenota soggiorno", bookingNote: "Date, ospiti, extra e caparra in un flusso" },
    healthcare: { search: "prestazioni, medici, referti", hero: "Percorso paziente chiaro e sicuro", sub: "Agenda medici · richiami · privacy", tabs: ["Visite", "Esami", "Follow-up", "Urgenze", "Referti"], featured: "Prestazioni richieste", menu: "Prestazioni cliniche", booking: "Prenota visita", bookingNote: "Medico, sede, consenso e promemoria" },
    fitness: { search: "classi, coach, abbonamenti", hero: "Club energico, progressi visibili", sub: "Classi · PT · membership", tabs: ["WOD", "Padel", "PT", "Yoga", "Scan"], featured: "Classi ad alta conversione", menu: "Classi & membership", booking: "Iscriviti alla classe", bookingNote: "Slot, coach e livello sempre evidenti" },
    retail: { search: "prodotti, taglie, novità", hero: "Vetrina shop che spinge il carrello", sub: "Catalogo · drop · CRM VIP", tabs: ["Drop", "Nuovi", "VIP", "Outlet", "Gift"], featured: "Prodotti in evidenza", menu: "Catalogo dinamico", booking: "Completa acquisto", bookingNote: "Taglie, varianti e recupero carrello" },
    construction: { search: "cantieri, unità, ticket", hero: "Cantiere sotto controllo, cliente aggiornato", sub: "SAL · manutenzioni · documenti", tabs: ["SAL", "Unità", "Ticket", "Team", "Docs"], featured: "Cantieri prioritari", menu: "Interventi & unità", booking: "Apri ticket", bookingNote: "Priorità, squadra e materiali tracciati" },
    plumber: { search: "urgenze, tecnici, ricambi", hero: "Interventi rapidi senza caos", sub: "SLA · tecnico · preventivo", tabs: ["SOS", "Caldaie", "Clima", "Ricambi", "Check"], featured: "Servizi tecnici", menu: "Interventi disponibili", booking: "Richiedi intervento", bookingNote: "Urgenza, zona e tecnico disponibili" },
    veterinary: { search: "visite, pet hotel, vaccini", hero: "Pet care premium e proprietari sereni", sub: "Schede animali · vaccini · resort", tabs: ["Visite", "Resort", "Toeletta", "Vaccini", "Shop"], featured: "Servizi pet care", menu: "Cure & resort", booking: "Prenota pet care", bookingNote: "Animale, trattamento e reminder vaccini" },
    childcare: { search: "programmi, mensa, iscrizioni", hero: "Famiglie informate, bambini felici", sub: "Attività · team · diario genitori", tabs: ["Programmi", "Mensa", "Team", "Tour", "Iscrivi"], featured: "Programmi educativi", menu: "Programmi & attività", booking: "Prenota tour", bookingNote: "Età, fascia oraria e genitore referente" },
    legal: { search: "pratiche, scadenze, clienti", hero: "Studio ordinato, cliente sempre aggiornato", sub: "Pratiche · scadenze · documenti", tabs: ["Pratiche", "Udienza", "Contratti", "KYC", "Firme"], featured: "Servizi professionali", menu: "Pratiche & consulenze", booking: "Prenota consulenza", bookingNote: "Materia, riservatezza e documenti" },
    accounting: { search: "scadenze, fatture, fiscalità", hero: "Scadenze fiscali senza sorprese", sub: "F24 · fatture · consulenza", tabs: ["F24", "IVA", "Paghe", "Bilanci", "Alert"], featured: "Servizi contabili", menu: "Scadenze & consulenze", booking: "Apri pratica", bookingNote: "Documenti, scadenza e responsabile" },
    custom: { search: "servizi, clienti, richieste", hero: "Esperienza digitale su misura", sub: "Sito · agenti · conversione", tabs: ["Top", "Nuovi", "VIP", "Demo", "Care"], featured: "Servizi richiesti", menu: "Offerta completa", booking: "Prenota demo", bookingNote: "Richiesta, team e conferma immediata" },
  };
  return copy[kind] ?? copy.custom;
}

function getMenuItems(sector: string) {
  const s = sector.toLowerCase();
  if (/sushi|giappon/.test(s)) {
    return [
      { name: "Sashimi Misto", desc: "Tonno, salmone, branzino · 9 pz", price: 24, badge: "Chef" },
      { name: "Uramaki Dragon", desc: "Gambero tempura, avocado, anguilla", price: 18, badge: "Top" },
      { name: "Nigiri Selection", desc: "8 pz · Wasabi fresco", price: 22 },
      { name: "Ramen Tonkotsu", desc: "12h di brodo · Chashu di maiale", price: 16, badge: "Hot" },
      { name: "Gyoza al Vapore", desc: "6 pz · Maiale e cavolo", price: 9 },
      { name: "Mochi Dessert", desc: "Tè verde, mango, sesamo nero", price: 7 },
    ];
  }
  if (/pizz/.test(s)) {
    return [
      { name: "Margherita DOP", desc: "San Marzano, fior di latte, basilico", price: 9, badge: "Top" },
      { name: "Diavola Premium", desc: "Salame piccante calabrese, fiordilatte", price: 12 },
      { name: "Tartufo & Burrata", desc: "Tartufo nero estivo, burrata pugliese", price: 18, badge: "Chef" },
      { name: "Quattro Formaggi", desc: "Mozzarella, gorgonzola, parmigiano, provola", price: 13 },
      { name: "Capricciosa", desc: "Prosciutto cotto, funghi, carciofi, olive", price: 12 },
      { name: "Calzone Classico", desc: "Pomodoro, mozzarella, prosciutto, ricotta", price: 11 },
    ];
  }
  if (/ristor|trattor|oster|food/.test(s)) {
    return [
      { name: "Crudo di Tonno", desc: "Pinzimonio agli agrumi · Olio EVO", price: 22, badge: "Chef" },
      { name: "Tagliolini al Tartufo", desc: "Tartufo nero · Burro di malga", price: 19, badge: "Top" },
      { name: "Branzino in Crosta", desc: "Sale rosa, erbe aromatiche", price: 28 },
      { name: "Filetto al Barolo", desc: "Riduzione di Barolo · Patate dauphine", price: 32 },
      { name: "Tiramisù della Casa", desc: "Mascarpone fresco · Caffè espresso", price: 9 },
      { name: "Calice di Vino", desc: "Selezione cantina del giorno", price: 8 },
    ];
  }
  if (/spa|wellness|benesser/.test(s)) {
    return [
      { name: "Massaggio Rituale Signature", desc: "90 min · Oli essenziali · Pietre calde", price: 145, badge: "Top" },
      { name: "Percorso Hammam", desc: "120 min · Vapore, scrub, idromassaggio", price: 95 },
      { name: "Trattamento Viso Gold", desc: "75 min · Maschera 24K · Anti-age", price: 110, badge: "Chef" },
      { name: "Riflessologia Plantare", desc: "45 min · Riequilibrio energetico", price: 65 },
      { name: "Percorso Coppia Luxury", desc: "Spa privata 90 min · Champagne", price: 280, badge: "Hot" },
      { name: "Day Spa Completo", desc: "Mezza giornata · Tutti i trattamenti", price: 180 },
    ];
  }
  if (/beauty|estetic|parruc|hair/.test(s)) {
    return [
      { name: "Taglio & Piega Signature", desc: "Consulenza · Taglio · Styling", price: 45, badge: "Top" },
      { name: "Colore Vegetale", desc: "100% naturale · Trattamento ricostruttivo", price: 75 },
      { name: "Balayage Premium", desc: "Schiariture su misura · Toner", price: 120, badge: "Chef" },
      { name: "Trattamento Botox Capillare", desc: "Liscio e luminoso 6 settimane", price: 85 },
      { name: "Manicure & Pedicure", desc: "Spa per mani e piedi · Smalto incluso", price: 55 },
      { name: "Make-Up Evento", desc: "Trucco professionale · Prova inclusa", price: 90 },
    ];
  }
  if (/hotel|albergh|lido|beach|yacht|b&b|bnb/.test(s)) {
    return [
      { name: "Suite Vista Mare", desc: "Camera deluxe · Terrazza privata", price: 280, badge: "Top" },
      { name: "Cabana Premium", desc: "Lettini, ombrellone, servizio bar", price: 95 },
      { name: "Charter Privato 4h", desc: "Skipper, aperitivo, snorkeling", price: 450, badge: "Chef" },
      { name: "Cena in Spiaggia", desc: "Tavolo sul mare · Menu degustazione", price: 120 },
      { name: "SPA & Mare Package", desc: "Day spa + lettini + pranzo", price: 165, badge: "Hot" },
      { name: "Aperitivo al Tramonto", desc: "Calice champagne + tagliere", price: 35 },
    ];
  }
  if (/immobil|real ?estate|agenzi/.test(s)) {
    return [
      { name: "Attico Panoramico", desc: "120 mq · 3 camere · Terrazzo 40 mq", price: 890, badge: "Top" },
      { name: "Villa con Piscina", desc: "350 mq · Giardino · Garage doppio", price: 1450, badge: "Chef" },
      { name: "Bilocale in Centro", desc: "55 mq · Ristrutturato · Balcone", price: 320 },
      { name: "Loft Industrial", desc: "85 mq · Open space · Travi a vista", price: 540, badge: "Hot" },
      { name: "Casale di Campagna", desc: "210 mq · 8.000 mq di terreno", price: 720 },
      { name: "Trilocale Vista Mare", desc: "95 mq · 2 bagni · Vista aperta", price: 480 },
    ];
  }
  if (/ncc|taxi|transfer|noleggi/.test(s)) {
    return [
      { name: "Transfer Aeroporto", desc: "Mercedes E-Class · 1-3 pax", price: 65, badge: "Top" },
      { name: "Tour Costiera 8h", desc: "Van premium · Autista · Acqua", price: 380, badge: "Chef" },
      { name: "Disposizione Oraria", desc: "Min 3h · Veicolo executive", price: 55 },
      { name: "Wedding Package", desc: "Auto fiori · Decorazioni · Foto", price: 480, badge: "Hot" },
      { name: "Shuttle Eventi", desc: "Bus 16 posti · Climatizzato", price: 120 },
      { name: "Charter Limousine", desc: "Maybach · Champagne · Red carpet", price: 650 },
    ];
  }
  if (/fitness|palestra|gym|crossfit/.test(s)) {
    return [
      { name: "Personal Training 1:1", desc: "60 min · Coach certificato", price: 65, badge: "Top" },
      { name: "Abbonamento Mensile", desc: "Accesso illimitato · Sauna inclusa", price: 79 },
      { name: "Pacchetto 10 PT", desc: "10 sessioni · Piano nutrizionale", price: 550, badge: "Chef" },
      { name: "Crossfit · Open WOD", desc: "Lezione di gruppo · 60 min", price: 18 },
      { name: "Functional · Bootcamp", desc: "Allenamento outdoor 90 min", price: 25, badge: "Hot" },
      { name: "Body Composition Scan", desc: "Analisi InBody + consulenza", price: 40 },
    ];
  }
  if (/ecommerce|shop|store|fashion|moda|boutique/.test(s)) {
    return [
      { name: "Sneakers Premium", desc: "Edizione limitata · Pelle italiana", price: 280, badge: "Top" },
      { name: "Giacca Sartoriale", desc: "100% lana vergine · Made in Italy", price: 540, badge: "Chef" },
      { name: "Borsa Iconica", desc: "Pelle saffiano · Hardware oro", price: 690, badge: "Hot" },
      { name: "Camicia Lino", desc: "Slim fit · Bottone perlato", price: 95 },
      { name: "Occhiali Aviator", desc: "Lenti polarizzate · Custodia", price: 165 },
      { name: "Fragranza Signature", desc: "Eau de parfum · 100ml", price: 130 },
    ];
  }
  if (/avvocat|legal|notai|commercia/.test(s)) {
    return [
      { name: "Consulenza Legale", desc: "Prima visita · 60 min · Riservato", price: 150, badge: "Top" },
      { name: "Pratica Successione", desc: "Gestione completa · Atto incluso", price: 1200, badge: "Chef" },
      { name: "Contratto Commerciale", desc: "Redazione + revisione · 5 gg", price: 480 },
      { name: "Costituzione SRL", desc: "Atto, statuto, registrazione", price: 1800, badge: "Hot" },
      { name: "Recupero Crediti", desc: "Fee successo · No win no fee", price: 0 },
      { name: "Abbonamento Imprese", desc: "Consulenza mensile illimitata", price: 390 },
    ];
  }
  if (/turism|tour|viagg|escursion/.test(s)) {
    return [
      { name: "Tour Roma Classica", desc: "Colosseo · Vaticano · Skip line", price: 89, badge: "Top" },
      { name: "Wine Experience", desc: "Cantina + degustazione + pranzo", price: 145, badge: "Chef" },
      { name: "Costiera in Barca", desc: "Giornata intera · Pranzo a bordo", price: 220 },
      { name: "Cooking Class", desc: "3h con chef · Mercato + cucina", price: 95, badge: "Hot" },
      { name: "Trekking Etna", desc: "Guida alpina · Pranzo al sacco", price: 75 },
      { name: "Tour Gastronomico", desc: "5 tappe street food · 3h", price: 60 },
    ];
  }
  if (/event|wedding|cerimoni/.test(s)) {
    return [
      { name: "Wedding Planner Full", desc: "Pacchetto completo · 250 ospiti", price: 8900, badge: "Top" },
      { name: "Allestimento Floreale", desc: "Cerimonia + ricevimento", price: 2400, badge: "Chef" },
      { name: "DJ + Service Audio", desc: "8h · Luci · Tecnico dedicato", price: 1200 },
      { name: "Catering Gourmet", desc: "5 portate · Servizio al tavolo", price: 95 },
      { name: "Foto + Video Wedding", desc: "Pacchetto completo · Album", price: 2800, badge: "Hot" },
      { name: "Open Bar Cocktail", desc: "Mixology pro · 4h illimitato", price: 35 },
    ];
  }
  if (/edili|costruz|impresa|impiant|ristruttur/.test(s)) {
    return [
      { name: "Sopralluogo Omaggio", desc: "Tecnico in 24h · Preventivo dettagliato", price: 0, badge: "Top" },
      { name: "Ristrutturazione Bagno", desc: "Chiavi in mano · 2 settimane", price: 6500, badge: "Chef" },
      { name: "Cappotto Termico", desc: "Bonus 65% · Pratica inclusa", price: 12000 },
      { name: "Impianto Fotovoltaico", desc: "6 kW · Accumulo · Detrazione", price: 9800, badge: "Hot" },
      { name: "Tinteggiatura Casa", desc: "Trilocale · Materiali premium", price: 1400 },
      { name: "Manutenzione Annuale", desc: "Caldaia + impianti · 12 mesi", price: 280 },
    ];
  }
  if (/auto|moto|conces/.test(s)) {
    return [
      { name: "Test Drive Omaggio", desc: "Modello a scelta · 30 min", price: 0, badge: "Top" },
      { name: "Tagliando Premium", desc: "Olio · Filtri · Check 30 punti", price: 220 },
      { name: "Cambio Gomme + Bilanc.", desc: "4 pneumatici premium installati", price: 480, badge: "Hot" },
      { name: "Detailing Completo", desc: "Lavaggio + lucidatura + interni", price: 180 },
      { name: "Diagnosi Elettronica", desc: "OBD2 · Lettura centralina", price: 45 },
      { name: "Noleggio LT 36 mesi", desc: "All inclusive · Da 290€/mese", price: 290, badge: "Chef" },
    ];
  }
  if (/scuola|academy|corso|format/.test(s)) {
    return [
      { name: "Corso Base 8 Settimane", desc: "16 lezioni · Materiale incluso", price: 480, badge: "Top" },
      { name: "Masterclass Avanzata", desc: "Weekend intensivo · Certificato", price: 290, badge: "Chef" },
      { name: "Lezione Privata 1:1", desc: "60 min · Online o in sede", price: 55 },
      { name: "Pacchetto 10 Lezioni", desc: "Sconto 15% · Validità 6 mesi", price: 470 },
      { name: "Workshop Open Day", desc: "3h omaggio · Iscrizione richiesta", price: 0, badge: "Hot" },
      { name: "Certificazione Pro", desc: "Esame + diploma riconosciuto", price: 350 },
    ];
  }
  return [
    { name: "Servizio Premium", desc: "Pacchetto base · 60 min", price: 60, badge: "Top" },
    { name: "Consulenza Esperto", desc: "Analisi personalizzata · 90 min", price: 95 },
    { name: "Pacchetto Completo", desc: "Servizio full · Risultati garantiti", price: 180, badge: "Chef" },
    { name: "Abbonamento Mensile", desc: "Accesso illimitato · 30 giorni", price: 99 },
    { name: "Gift Card Brand", desc: "Da 50€ a 500€ · Personalizzabile", price: 50 },
    { name: "Esperienza VIP", desc: "Servizio dedicato · Champagne", price: 250, badge: "Hot" },
  ];
}

// ════════════════════════════════════════════════════════════════════════════
// HOME SCREEN — rich landing with hero, search, categories, featured cards
// ════════════════════════════════════════════════════════════════════════════
function HomeScreen({ theme, name, sector, city }: { theme: ThemeTokens; name: string; sector: string; city: string }) {
  const sLabel = sectorLabel(sector);
  const items = getMenuItems(sector).slice(0, 3);

  return (
    <div className="pb-14 overflow-hidden h-full">
      {/* Header */}
      <div className="px-4 pt-1 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black"
            style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, color: theme.bg, fontFamily: theme.fontHead }}>
            {brandInitials(name)}
          </div>
          <div>
            <p className="text-[7px] uppercase tracking-wider font-semibold" style={{ color: theme.textMuted }}>{city || "Italia"}</p>
            <p className="text-[10px] font-bold leading-none" style={{ color: theme.text, fontFamily: theme.fontHead }}>{name}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${theme.text}10` }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2.5" strokeLinecap="round"><path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 01-6 0"/></svg>
            <span className="absolute mt-[-10px] ml-[10px] w-2 h-2 rounded-full" style={{ background: theme.primary }} />
          </div>
          <div className="w-7 h-7 rounded-full overflow-hidden border" style={{ borderColor: `${theme.primary}40` }}>
            <ArtImage theme={theme} seed={42} className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-2.5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-full" style={{ background: theme.bgPanel }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <span className="text-[8px]" style={{ color: theme.textMuted }}>Cerca {sLabel.toLowerCase()}…</span>
        </div>
      </div>

      {/* Hero */}
      <div className="px-4 mb-2.5">
        <div className="relative rounded-2xl overflow-hidden h-[105px]" style={{ borderRadius: theme.radius }}>
          <ArtImage theme={theme} seed={1} className="absolute inset-0" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 30%, ${theme.bg}ee 100%)` }} />
          <div className="absolute inset-0 p-3 flex flex-col justify-end">
            <span className="self-start px-1.5 py-0.5 rounded text-[7px] font-bold mb-1" style={{ background: theme.primary, color: theme.bg }}>NUOVO</span>
            <p className="text-[12px] font-black leading-tight" style={{ color: "#fff", fontFamily: theme.fontHead }}>Esperienza Signature 2026</p>
            <p className="text-[8px] mt-0.5 opacity-90" style={{ color: "#fff" }}>{sLabel} · {city || "Italia"} · ★ 4.9</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-2.5">
        <div className="flex gap-1.5 overflow-hidden">
          {["Tutti", "Top", "Nuovi", "Promo", "VIP"].map((c, i) => (
            <span key={i} className="text-[8px] px-2.5 py-1 rounded-full font-semibold whitespace-nowrap" style={{
              background: i === 0 ? theme.primary : theme.bgPanel,
              color: i === 0 ? theme.bg : theme.text,
            }}>{c}</span>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div className="px-4 flex items-center justify-between mb-1.5">
        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: theme.text }}>I Più Richiesti</p>
        <p className="text-[7px] font-semibold" style={{ color: theme.primary }}>Vedi tutti →</p>
      </div>
      <div className="px-4 space-y-1.5">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2 p-1.5 rounded-xl" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.7 }}>
            <ArtImage theme={theme} seed={i + 3} className="w-10 h-10 rounded-lg shrink-0" style={{ borderRadius: theme.radius * 0.5 }} />
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold truncate" style={{ color: theme.text }}>{it.name}</p>
              <p className="text-[7px] truncate" style={{ color: theme.textMuted }}>{it.desc}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[7px]" style={{ color: theme.accent }}>★ 4.{8 + i}</span>
                <span className="text-[7px]" style={{ color: theme.textMuted }}>· {120 - i * 23} ordini</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black" style={{ color: theme.primary, fontFamily: theme.fontHead }}>€{it.price}</p>
              {it.badge && <span className="text-[6px] font-bold px-1 py-0.5 rounded" style={{ background: `${theme.accent}25`, color: theme.accent }}>{it.badge}</span>}
            </div>
          </div>
        ))}
      </div>

      <BottomNav theme={theme} active="home" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MENU SCREEN
// ════════════════════════════════════════════════════════════════════════════
function MenuScreen({ theme, sector }: { theme: ThemeTokens; sector: string }) {
  const items = getMenuItems(sector);
  const isFood = /ristor|pizz|sushi|trat|oster|food|cucin|bar|cafe/i.test(sector);
  const cats = isFood ? ["Tutti", "Antipasti", "Primi", "Secondi", "Dolci"] : ["Tutti", "Top", "Nuovi", "VIP", "Pacchetti"];

  return (
    <div className="pb-14 overflow-hidden h-full">
      <div className="px-4 pt-1 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[10px] font-black leading-tight" style={{ color: theme.text, fontFamily: theme.fontHead }}>{isFood ? "Il Nostro Menù" : "I Nostri Servizi"}</p>
            <p className="text-[7px]" style={{ color: theme.textMuted }}>Selezionati con cura · 2026</p>
          </div>
          <div className="flex gap-1">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: theme.bgPanel }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2.5"><path d="M3 6h18M6 12h12M10 18h4"/></svg>
            </div>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: theme.bgPanel }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 overflow-hidden mb-2.5">
          {cats.map((c, i) => (
            <span key={i} className="text-[8px] px-2.5 py-1 rounded-full font-semibold whitespace-nowrap" style={{
              background: i === 0 ? theme.primary : `${theme.text}10`,
              color: i === 0 ? theme.bg : theme.text,
            }}>{c}</span>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-1.5">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2 p-1.5 rounded-xl" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.7 }}>
            <ArtImage theme={theme} seed={i + 7} className="w-11 h-11 shrink-0" style={{ borderRadius: theme.radius * 0.55 }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-[9px] font-bold truncate" style={{ color: theme.text }}>{it.name}</p>
                {it.badge && <span className="text-[6px] font-bold px-1 rounded" style={{ background: theme.primary, color: theme.bg }}>{it.badge}</span>}
              </div>
              <p className="text-[7px] leading-tight mt-0.5" style={{ color: theme.textMuted }}>{it.desc}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[6px]" style={{ color: theme.accent }}>★ 4.{7 + (i % 3)}</span>
                <span className="text-[6px]" style={{ color: theme.textMuted }}>· {12 + i * 4} min</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="text-[10px] font-black" style={{ color: theme.primary, fontFamily: theme.fontHead }}>€{it.price}</p>
              <button className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: theme.primary, color: theme.bg }}>+</button>
            </div>
          </div>
        ))}
      </div>

      <BottomNav theme={theme} active="menu" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// BOOKING SCREEN
// ════════════════════════════════════════════════════════════════════════════
function BookingScreen({ theme, sector }: { theme: ThemeTokens; sector: string }) {
  const isService = /spa|wellness|beauty|estetic|parruc|medic|dent|fitness/i.test(sector);
  return (
    <div className="pb-14 overflow-hidden h-full">
      <div className="px-4 pt-1 pb-2">
        <p className="text-[10px] font-black leading-tight" style={{ color: theme.text, fontFamily: theme.fontHead }}>{isService ? "Prenota un Trattamento" : "Prenota un Tavolo"}</p>
        <p className="text-[7px]" style={{ color: theme.textMuted }}>Conferma immediata via SMS · WhatsApp</p>
      </div>

      {/* Date picker */}
      <div className="px-4 mb-2">
        <p className="text-[7px] font-bold mb-1 uppercase tracking-wider" style={{ color: theme.textMuted }}>Data</p>
        <div className="rounded-xl p-2.5" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.8 }}>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[9px] font-bold" style={{ color: theme.text }}>Aprile 2026</p>
            <div className="flex gap-1">
              <button className="w-4 h-4 rounded-full flex items-center justify-center text-[8px]" style={{ background: `${theme.text}10`, color: theme.text }}>‹</button>
              <button className="w-4 h-4 rounded-full flex items-center justify-center text-[8px]" style={{ background: `${theme.text}10`, color: theme.text }}>›</button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {["L","M","M","G","V","S","D"].map((d, i) => (
              <p key={i} className="text-[6px] text-center font-semibold" style={{ color: theme.textMuted }}>{d}</p>
            ))}
            {Array.from({ length: 14 }).map((_, i) => {
              const day = 18 + i;
              const isSel = i === 4;
              const isDisabled = i === 1 || i === 8;
              return (
                <div key={i} className="aspect-square flex items-center justify-center rounded-md text-[8px] font-bold" style={{
                  background: isSel ? theme.primary : "transparent",
                  color: isSel ? theme.bg : (isDisabled ? `${theme.text}30` : theme.text),
                }}>
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Time */}
      <div className="px-4 mb-2">
        <p className="text-[7px] font-bold mb-1 uppercase tracking-wider" style={{ color: theme.textMuted }}>Orario disponibile</p>
        <div className="grid grid-cols-4 gap-1">
          {["12:30","13:00","13:30","14:00","19:30","20:00","20:30","21:00"].map((t, i) => (
            <span key={i} className="text-[8px] py-1.5 text-center rounded-md font-semibold" style={{
              background: i === 5 ? theme.primary : `${theme.text}10`,
              color: i === 5 ? theme.bg : theme.text,
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Guests */}
      <div className="px-4 mb-2">
        <div className="rounded-xl p-2.5 flex items-center justify-between" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.8 }}>
          <div>
            <p className="text-[7px] font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>{isService ? "Persone" : "Ospiti"}</p>
            <p className="text-[12px] font-black" style={{ color: theme.text, fontFamily: theme.fontHead }}>4 persone</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="w-6 h-6 rounded-full text-[12px] font-bold flex items-center justify-center" style={{ background: `${theme.primary}20`, color: theme.text }}>−</button>
            <span className="text-[10px] font-bold w-3 text-center" style={{ color: theme.text }}>4</span>
            <button className="w-6 h-6 rounded-full text-[12px] font-bold flex items-center justify-center" style={{ background: theme.primary, color: theme.bg }}>+</button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4">
        <button className="w-full py-2.5 rounded-xl text-[10px] font-bold" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, color: theme.bg, borderRadius: theme.radius * 0.8 }}>
          Conferma · Ven 22 alle 20:00
        </button>
        <p className="text-[7px] text-center mt-1" style={{ color: theme.textMuted }}>Cancellazione omaggio fino a 4h prima</p>
      </div>

      <BottomNav theme={theme} active="booking" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PROFILE SCREEN
// ════════════════════════════════════════════════════════════════════════════
function ProfileScreen({ theme, name }: { theme: ThemeTokens; name: string }) {
  return (
    <div className="pb-14 overflow-hidden h-full">
      {/* Cover */}
      <div className="relative h-[60px] mb-7" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}>
        <ArtImage theme={theme} seed={11} className="absolute inset-0 opacity-50" />
        <div className="absolute -bottom-7 left-4 w-14 h-14 rounded-full border-[3px] flex items-center justify-center text-[14px] font-black"
          style={{ borderColor: theme.bg, background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`, color: theme.bg, fontFamily: theme.fontHead }}>
          MR
        </div>
        <button className="absolute top-2 right-2 px-2 py-1 rounded-full text-[7px] font-bold" style={{ background: `${theme.bg}aa`, color: theme.text, backdropFilter: "blur(8px)" }}>Modifica</button>
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black" style={{ color: theme.text, fontFamily: theme.fontHead }}>Marco Rossi</p>
            <p className="text-[7px]" style={{ color: theme.textMuted }}>marco.rossi@email.com · Membro Gold dal 2024</p>
          </div>
          <span className="text-[6px] font-bold px-1.5 py-0.5 rounded" style={{ background: theme.primary, color: theme.bg }}>VIP</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-1.5 mt-2.5 mb-2.5">
          {[{ v: "12", l: "Visite" }, { v: "240", l: "Punti" }, { v: "4.9★", l: "Rating" }].map((s, i) => (
            <div key={i} className="text-center rounded-xl py-2" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.7 }}>
              <p className="text-[12px] font-black" style={{ color: theme.primary, fontFamily: theme.fontHead }}>{s.v}</p>
              <p className="text-[7px] font-semibold" style={{ color: theme.textMuted }}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* Loyalty card */}
        <div className="rounded-xl p-2.5 mb-2.5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, borderRadius: theme.radius * 0.8 }}>
          <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-20" style={{ background: "white" }} />
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[7px] font-black uppercase tracking-wider" style={{ color: theme.bg }}>Fedeltà Gold Member</p>
              <p className="text-[7px] font-bold" style={{ color: theme.bg }}>★★★★★</p>
            </div>
            <p className="text-[12px] font-black" style={{ color: theme.bg, fontFamily: theme.fontHead }}>240 / 300 punti</p>
            <div className="h-1 rounded-full bg-black/20 mt-1.5">
              <div className="h-1 rounded-full bg-white" style={{ width: "80%" }} />
            </div>
            <p className="text-[7px] mt-1 opacity-90" style={{ color: theme.bg }}>60 punti per la tua prossima cena omaggio 🎁</p>
          </div>
        </div>

        {/* Menu list */}
        <div className="rounded-xl overflow-hidden" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.7 }}>
          {[
            { icon: "M3 5h18v16H3zM3 10h18", label: "Le mie prenotazioni", count: "3" },
            { icon: "M12 21l-1.5-1.4C5 15 2 12.3 2 9a5 5 0 019-3 5 5 0 019 3c0 3.3-3 6-8.5 10.6L12 21z", label: "Preferiti", count: "12" },
            { icon: "M21 11.5a8.4 8.4 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7A8.4 8.4 0 018 19l-5 1 1-5a8.4 8.4 0 01-1-4 8.5 8.5 0 014.7-7.6A8.4 8.4 0 0111.5 3h.5a8.5 8.5 0 018 8v.5z", label: "Recensioni", count: "8" },
          ].map((it, i, arr) => (
            <div key={i} className="flex items-center gap-2 p-2" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${theme.text}08` : "none" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={it.icon} /></svg>
              <p className="text-[9px] flex-1 font-semibold" style={{ color: theme.text }}>{it.label}</p>
              <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${theme.primary}20`, color: theme.primary }}>{it.count}</span>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2.5"><path d="M9 6l6 6-6 6"/></svg>
            </div>
          ))}
        </div>

        <p className="text-[6px] text-center mt-2 font-bold" style={{ color: theme.textMuted, fontFamily: theme.fontHead }}>{name}</p>
      </div>

      <BottomNav theme={theme} active="profile" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// GALLERY SCREEN
// ════════════════════════════════════════════════════════════════════════════
function GalleryScreen({ theme, name }: { theme: ThemeTokens; name: string }) {
  return (
    <div className="pb-14 overflow-hidden h-full">
      <div className="px-4 pt-1 pb-2 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black leading-tight" style={{ color: theme.text, fontFamily: theme.fontHead }}>Galleria</p>
          <p className="text-[7px]" style={{ color: theme.textMuted }}>{name} · 248 foto</p>
        </div>
        <div className="flex gap-1">
          {["Tutti", "Cibo", "Locale"].map((c, i) => (
            <span key={c} className="text-[7px] px-1.5 py-0.5 rounded-full font-bold" style={{
              background: i === 0 ? theme.primary : `${theme.text}10`,
              color: i === 0 ? theme.bg : theme.text,
            }}>{c}</span>
          ))}
        </div>
      </div>

      {/* Featured big */}
      <div className="px-4 mb-1.5">
        <div className="relative rounded-xl overflow-hidden h-[80px]" style={{ borderRadius: theme.radius * 0.8 }}>
          <ArtImage theme={theme} seed={20} className="absolute inset-0" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 50%, ${theme.bg}cc 100%)` }} />
          <div className="absolute bottom-1.5 left-2">
            <p className="text-[9px] font-black" style={{ color: "#fff", fontFamily: theme.fontHead }}>Storia in immagini</p>
            <p className="text-[7px] opacity-80" style={{ color: "#fff" }}>★ 4.9 · 1.2k likes</p>
          </div>
          <span className="absolute top-1.5 right-1.5 text-[6px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${theme.bg}cc`, color: theme.text }}>FEATURED</span>
        </div>
      </div>

      {/* Masonry-ish grid */}
      <div className="px-4 grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="relative aspect-square overflow-hidden" style={{ borderRadius: theme.radius * 0.5 }}>
            <ArtImage theme={theme} seed={30 + i} className="w-full h-full" />
            {i === 2 && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><p className="text-[10px] font-bold text-white">+24</p></div>}
            {i === 5 && <div className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full flex items-center justify-center" style={{ background: theme.primary }}><svg width="6" height="6" viewBox="0 0 24 24" fill={theme.bg}><path d="M8 5v14l11-7z"/></svg></div>}
          </div>
        ))}
      </div>

      <BottomNav theme={theme} active="home" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CHECKOUT SCREEN
// ════════════════════════════════════════════════════════════════════════════
function CheckoutScreen({ theme, sector }: { theme: ThemeTokens; sector: string }) {
  const items = getMenuItems(sector).slice(0, 3);
  const subtotal = items.reduce((s, x) => s + x.price, 0);
  const fee = 2.5;
  const total = subtotal + fee;

  return (
    <div className="pb-14 overflow-hidden h-full">
      <div className="px-4 pt-1 pb-2">
        <div className="flex items-center gap-2">
          <button className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: theme.bgPanel }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div>
            <p className="text-[10px] font-black leading-tight" style={{ color: theme.text, fontFamily: theme.fontHead }}>Riepilogo Ordine</p>
            <p className="text-[7px]" style={{ color: theme.textMuted }}>3 articoli · Pronto in 25 min</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="px-4 mb-2">
        <div className="rounded-xl p-2 space-y-1.5" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.7 }}>
          {items.map((it, i) => (
            <div key={i} className="flex items-center gap-2">
              <ArtImage theme={theme} seed={i + 50} className="w-8 h-8 shrink-0" style={{ borderRadius: theme.radius * 0.4 }} />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold truncate" style={{ color: theme.text }}>{it.name}</p>
                <p className="text-[7px]" style={{ color: theme.textMuted }}>x1 · {it.desc.split("·")[0]}</p>
              </div>
              <p className="text-[9px] font-black" style={{ color: theme.text, fontFamily: theme.fontHead }}>€{it.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Promo */}
      <div className="px-4 mb-2">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border-2 border-dashed" style={{ borderColor: `${theme.primary}50` }}>
          <span className="text-[10px]">🎁</span>
          <div className="flex-1">
            <p className="text-[8px] font-bold" style={{ color: theme.primary }}>WELCOME10 applicato</p>
            <p className="text-[6px]" style={{ color: theme.textMuted }}>Sconto del 10% sul totale</p>
          </div>
          <span className="text-[8px] font-bold" style={{ color: theme.primary }}>−€{(subtotal * 0.1).toFixed(2)}</span>
        </div>
      </div>

      {/* Totals */}
      <div className="px-4 mb-2 space-y-1">
        <div className="flex justify-between text-[8px]" style={{ color: theme.textMuted }}>
          <span>Subtotale</span><span>€{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[8px]" style={{ color: theme.textMuted }}>
          <span>Servizio</span><span>€{fee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-1.5 border-t" style={{ borderColor: `${theme.text}15` }}>
          <span className="text-[10px] font-black" style={{ color: theme.text, fontFamily: theme.fontHead }}>Totale</span>
          <span className="text-[12px] font-black" style={{ color: theme.primary, fontFamily: theme.fontHead }}>€{(total * 0.9).toFixed(2)}</span>
        </div>
      </div>

      {/* Payment */}
      <div className="px-4 mb-2">
        <div className="rounded-xl p-2 flex items-center gap-2" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.7 }}>
          <div className="w-7 h-5 rounded flex items-center justify-center text-[7px] font-black" style={{ background: "#1A1F71", color: "#fff" }}>VISA</div>
          <div className="flex-1">
            <p className="text-[8px] font-bold" style={{ color: theme.text }}>•••• •••• •••• 4242</p>
            <p className="text-[6px]" style={{ color: theme.textMuted }}>Apple Pay · scade 12/27</p>
          </div>
          <p className="text-[7px] font-bold" style={{ color: theme.primary }}>Cambia</p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4">
        <button className="w-full py-2.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, color: theme.bg, borderRadius: theme.radius * 0.8 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.7 2 6 4.7 6 8v3H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2v-8a2 2 0 00-2-2h-1V8c0-3.3-2.7-6-6-6zm0 2a4 4 0 014 4v3H8V8a4 4 0 014-4z"/></svg>
          Paga €{(total * 0.9).toFixed(2)}
        </button>
        <p className="text-[7px] text-center mt-1" style={{ color: theme.textMuted }}>Pagamento sicuro · SSL crittografato</p>
      </div>

      <BottomNav theme={theme} active="menu" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// DASHBOARD / STATS SCREEN — analytics-style con KPI e grafici
// ════════════════════════════════════════════════════════════════════════════
function DashboardScreen({ theme, name, sector }: { theme: ThemeTokens; name: string; sector: string }) {
  const sLabel = sectorLabel(sector);
  const kpis = [
    { v: "€12.4k", l: "Ricavi mese", trend: "+18%" },
    { v: "247", l: "Clienti attivi", trend: "+12%" },
    { v: "4.9★", l: "Rating medio", trend: "+0.2" },
  ];
  const bars = [40, 65, 50, 85, 70, 95, 78];
  return (
    <div className="pb-14 overflow-hidden h-full">
      <div className="px-4 pt-1 pb-2">
        <p className="text-[7px] uppercase tracking-wider font-semibold" style={{ color: theme.textMuted }}>Dashboard · {sLabel}</p>
        <p className="text-[11px] font-black leading-tight" style={{ color: theme.text, fontFamily: theme.fontHead }}>Ciao, {name.split(" ")[0]} 👋</p>
      </div>
      <div className="px-4 grid grid-cols-3 gap-1.5 mb-2">
        {kpis.map((k, i) => (
          <div key={i} className="rounded-xl p-2" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.7 }}>
            <p className="text-[10px] font-black" style={{ color: theme.text, fontFamily: theme.fontHead }}>{k.v}</p>
            <p className="text-[6px] font-semibold" style={{ color: theme.textMuted }}>{k.l}</p>
            <p className="text-[6px] font-bold mt-0.5" style={{ color: theme.primary }}>↑ {k.trend}</p>
          </div>
        ))}
      </div>
      <div className="px-4 mb-2">
        <div className="rounded-xl p-2.5" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.8 }}>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[8px] font-bold uppercase tracking-wider" style={{ color: theme.text }}>Andamento settimanale</p>
            <span className="text-[6px] px-1.5 py-0.5 rounded font-bold" style={{ background: `${theme.primary}25`, color: theme.primary }}>7gg</span>
          </div>
          <div className="flex items-end justify-between gap-1 h-16">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-full rounded-t" style={{ height: `${h}%`, background: i === 5 ? theme.primary : `${theme.primary}55` }} />
                <span className="text-[5px] font-bold" style={{ color: theme.textMuted }}>{["L","M","M","G","V","S","D"][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 space-y-1">
        <p className="text-[7px] font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>Attività recente</p>
        {["Nuova prenotazione · Tavolo per 4", "Recensione 5★ ricevuta", "Pagamento €45 ricevuto"].map((a, i) => (
          <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.5 }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: theme.accent }} />
            <p className="text-[8px] flex-1" style={{ color: theme.text }}>{a}</p>
            <span className="text-[6px]" style={{ color: theme.textMuted }}>{i === 0 ? "ora" : i === 1 ? "12m" : "1h"}</span>
          </div>
        ))}
      </div>
      <BottomNav theme={theme} active="profile" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CHAT SCREEN — assistente AI / chat support
// ════════════════════════════════════════════════════════════════════════════
function ChatScreen({ theme, name, sector }: { theme: ThemeTokens; name: string; sector: string }) {
  const sLabel = sectorLabel(sector);
  const msgs = [
    { from: "ai", text: `Ciao! Sono l'assistente di ${name}. Come posso aiutarti oggi?` },
    { from: "me", text: "Vorrei prenotare per sabato sera, sei persone." },
    { from: "ai", text: `Perfetto! Per ${sLabel.toLowerCase()} sabato 26 abbiamo disponibilità alle 19:30, 20:00 e 21:30. Quale preferisci?` },
    { from: "me", text: "20:00 va benissimo." },
    { from: "ai", text: "Confermato ✓ Ti ho inviato il riepilogo via WhatsApp. A presto!" },
  ];
  return (
    <div className="pb-14 overflow-hidden h-full flex flex-col">
      <div className="px-4 pt-1 pb-2 border-b flex items-center gap-2" style={{ borderColor: `${theme.text}10` }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, color: theme.bg }}>
          AI
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black" style={{ color: theme.text, fontFamily: theme.fontHead }}>Assistente {name}</p>
          <p className="text-[6px] flex items-center gap-1" style={{ color: theme.textMuted }}>
            <span className="w-1 h-1 rounded-full" style={{ background: "#22c55e" }} />
            Online · Risponde subito
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden px-3 py-2 space-y-1.5">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] px-2 py-1.5 text-[8px] leading-snug`}
              style={{
                background: m.from === "me" ? theme.primary : theme.bgPanel,
                color: m.from === "me" ? theme.bg : theme.text,
                borderRadius: 12,
                borderBottomRightRadius: m.from === "me" ? 4 : 12,
                borderBottomLeftRadius: m.from === "me" ? 12 : 4,
              }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="px-3 pb-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full" style={{ background: theme.bgPanel }}>
          <span className="text-[8px] flex-1" style={{ color: theme.textMuted }}>Scrivi un messaggio…</span>
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: theme.primary }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill={theme.bg}><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
          </div>
        </div>
      </div>
      <BottomNav theme={theme} active="profile" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAP SCREEN — mappa punti vendita / annunci geo
// ════════════════════════════════════════════════════════════════════════════
function MapScreen({ theme, name, sector, city }: { theme: ThemeTokens; name: string; sector: string; city: string }) {
  const sLabel = sectorLabel(sector);
  return (
    <div className="pb-14 overflow-hidden h-full">
      <div className="px-4 pt-1 pb-2">
        <p className="text-[10px] font-black leading-tight" style={{ color: theme.text, fontFamily: theme.fontHead }}>Esplora {city || "la zona"}</p>
        <div className="flex items-center gap-2 mt-1.5 px-2.5 py-1.5 rounded-full" style={{ background: theme.bgPanel }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <span className="text-[7px]" style={{ color: theme.textMuted }}>Cerca {sLabel.toLowerCase()} vicino a te…</span>
        </div>
      </div>
      {/* Faux map */}
      <div className="px-4 mb-2">
        <div className="relative rounded-2xl overflow-hidden h-[140px]" style={{ borderRadius: theme.radius, background: theme.bgPanelAlt }}>
          <svg viewBox="0 0 200 140" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
            <rect width="200" height="140" fill={theme.bgPanelAlt} />
            {/* streets */}
            <path d="M0 40 L200 50 M0 90 L200 80 M50 0 L60 140 M120 0 L130 140 M170 0 L175 140" stroke={`${theme.text}20`} strokeWidth="1.5" fill="none" />
            <path d="M0 70 Q100 60 200 75" stroke={theme.primary} strokeWidth="2" fill="none" opacity="0.6" />
            {/* park / water */}
            <ellipse cx="40" cy="110" rx="30" ry="18" fill={`${theme.accent}30`} />
            <rect x="140" y="20" width="35" height="25" fill={`${theme.accent}25`} rx="3" />
          </svg>
          {/* Pins */}
          {[
            { x: "30%", y: "45%", price: "€89" },
            { x: "55%", y: "30%", price: "€120" },
            { x: "70%", y: "60%", price: "€65", active: true },
            { x: "20%", y: "70%", price: "€95" },
          ].map((p, i) => (
            <div key={i} className="absolute -translate-x-1/2 -translate-y-full text-[7px] font-black px-1.5 py-0.5 rounded-full whitespace-nowrap"
              style={{
                left: p.x, top: p.y,
                background: p.active ? theme.primary : `${theme.bg}f0`,
                color: p.active ? theme.bg : theme.text,
                border: `1.5px solid ${theme.primary}`,
              }}>
              {p.price}
            </div>
          ))}
          {/* User location */}
          <div className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ background: "#3B82F6", border: "2px solid #fff", boxShadow: "0 0 0 6px rgba(59,130,246,0.25)" }} />
        </div>
      </div>
      {/* Card slider */}
      <div className="px-4">
        <p className="text-[7px] font-bold uppercase tracking-wider mb-1" style={{ color: theme.textMuted }}>4 risultati nelle vicinanze</p>
        <div className="space-y-1.5">
          {getMenuItems(sector).slice(0, 2).map((it, i) => (
            <div key={i} className="flex items-center gap-2 p-1.5 rounded-xl" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.7 }}>
              <ArtImage theme={theme} seed={i + 60} className="w-9 h-9 shrink-0" style={{ borderRadius: theme.radius * 0.5 }} />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold truncate" style={{ color: theme.text }}>{it.name}</p>
                <p className="text-[6px] truncate" style={{ color: theme.textMuted }}>{0.4 + i * 0.3} km · ★ 4.{8 - i}</p>
              </div>
              <p className="text-[10px] font-black" style={{ color: theme.primary, fontFamily: theme.fontHead }}>€{it.price}</p>
            </div>
          ))}
        </div>
      </div>
      <BottomNav theme={theme} active="home" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// KITCHEN / KDS SCREEN — ticket board cucina (food/sushi/retail)
// ════════════════════════════════════════════════════════════════════════════
function KitchenScreen({ theme, sector }: { theme: ThemeTokens; sector: string }) {
  const tickets = [
    { id: "#A124", table: "Tav. 7", time: "00:42", status: "fire", items: ["Tartare manzo", "Risotto zafferano", "Bistecca medium"] },
    { id: "#A125", table: "Tav. 3", time: "01:18", status: "wait", items: ["Carbonara", "Insalata cesare"] },
    { id: "#A126", table: "Asporto", time: "02:05", status: "ready", items: ["2× Pizza margherita", "Tiramisù"] },
  ];
  const colorOf = (s: string) => s === "fire" ? theme.accent : s === "ready" ? theme.primary : `${theme.text}40`;
  return (
    <div className="pb-14 overflow-hidden h-full">
      <div className="px-4 pt-1 pb-2 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black leading-tight" style={{ color: theme.text, fontFamily: theme.fontHead }}>Cucina · Live</p>
          <p className="text-[7px]" style={{ color: theme.textMuted }}>{tickets.length} ticket attivi · KDS</p>
        </div>
        <div className="flex gap-1">
          {["Tutti", "Sala", "Asporto"].map((c, i) => (
            <span key={c} className="text-[7px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: i === 0 ? theme.primary : `${theme.text}10`, color: i === 0 ? theme.bg : theme.text }}>{c}</span>
          ))}
        </div>
      </div>
      <div className="px-4 grid grid-cols-3 gap-1 mb-2">
        {[{ v: tickets.length, l: "In coda" }, { v: "8m", l: "Tempo medio" }, { v: "94%", l: "On time" }].map((k, i) => (
          <div key={i} className="rounded-lg p-1.5 text-center" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.55 }}>
            <p className="text-[10px] font-black" style={{ color: theme.primary, fontFamily: theme.fontHead }}>{k.v}</p>
            <p className="text-[6px]" style={{ color: theme.textMuted }}>{k.l}</p>
          </div>
        ))}
      </div>
      <div className="px-4 space-y-1.5">
        {tickets.map((t, i) => (
          <div key={i} className="rounded-xl p-2" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.7, borderLeft: `3px solid ${colorOf(t.status)}` }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black" style={{ color: theme.text, fontFamily: theme.fontHead }}>{t.id}</span>
                <span className="text-[6px] px-1 py-0.5 rounded font-bold" style={{ background: `${theme.text}10`, color: theme.text }}>{t.table}</span>
              </div>
              <span className="text-[8px] font-black tabular-nums" style={{ color: colorOf(t.status) }}>{t.time}</span>
            </div>
            <div className="space-y-0.5">
              {t.items.map((it, j) => (
                <div key={j} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full" style={{ background: theme.primary }} />
                  <p className="text-[8px]" style={{ color: theme.text }}>{it}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-1 mt-1.5">
              <button className="flex-1 py-1 rounded-md text-[7px] font-bold" style={{ background: `${theme.text}10`, color: theme.text }}>In preparazione</button>
              <button className="flex-1 py-1 rounded-md text-[7px] font-bold" style={{ background: theme.primary, color: theme.bg }}>Pronto ✓</button>
            </div>
          </div>
        ))}
      </div>
      <BottomNav theme={theme} active="menu" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// FLEET SCREEN — flotta NCC / yacht / logistica
// ════════════════════════════════════════════════════════════════════════════
function FleetScreen({ theme, sector }: { theme: ThemeTokens; sector: string }) {
  const isBoat = /boat|yacht|marina|charter|nautic/i.test(sector);
  const isLog = /logist|deliver|trasport|tracking/i.test(sector);
  const units = isBoat
    ? [{ n: "Riviera 42", t: "Yacht", k: "8 ospiti · skipper", s: "In tour" }, { n: "Azimut 60", t: "Yacht", k: "12 ospiti · chef", s: "Disponibile" }, { n: "Lagoon 50", t: "Catamarano", k: "10 ospiti · weekend", s: "Disponibile" }]
    : isLog
    ? [{ n: "Iveco 220", t: "Furgone", k: "Milano → Roma", s: "In transito" }, { n: "Sprinter 314", t: "Express", k: "Torino city", s: "Disponibile" }, { n: "Daily 35", t: "Cold chain", k: "Bologna", s: "Manutenzione" }]
    : [{ n: "Mercedes S 580", t: "Executive", k: "Patente B+ · 3 pax", s: "In corsa" }, { n: "BMW 7 LWB", t: "Business", k: "WiFi · 3 pax", s: "Disponibile" }, { n: "Van V-Class", t: "Group", k: "7 pax · bagagli", s: "Disponibile" }];
  const colorOf = (s: string) => s.includes("Dispon") ? theme.primary : s.includes("Manut") ? theme.accent : `${theme.text}50`;
  return (
    <div className="pb-14 overflow-hidden h-full">
      <div className="px-4 pt-1 pb-2">
        <p className="text-[10px] font-black leading-tight" style={{ color: theme.text, fontFamily: theme.fontHead }}>{isBoat ? "Flotta nautica" : isLog ? "Mezzi in linea" : "La nostra flotta"}</p>
        <p className="text-[7px]" style={{ color: theme.textMuted }}>{units.length} unità · live GPS · oggi</p>
      </div>
      <div className="px-4 mb-2">
        <div className="relative h-[88px] rounded-xl overflow-hidden" style={{ background: theme.bgPanelAlt, borderRadius: theme.radius * 0.7 }}>
          <svg viewBox="0 0 200 88" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
            <rect width="200" height="88" fill={theme.bgPanelAlt} />
            <path d="M0 30 L200 38 M0 60 L200 55 M40 0 L48 88 M120 0 L128 88" stroke={`${theme.text}18`} strokeWidth="1.2" fill="none" />
            <path d="M10 70 Q60 30 110 50 T195 35" stroke={theme.primary} strokeWidth="1.8" fill="none" strokeDasharray="4 3" />
          </svg>
          {[{ x: "18%", y: "70%" }, { x: "55%", y: "50%" }, { x: "84%", y: "38%" }].map((p, i) => (
            <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full" style={{ left: p.x, top: p.y, background: theme.primary, boxShadow: `0 0 0 4px ${theme.primary}30` }} />
          ))}
        </div>
      </div>
      <div className="px-4 space-y-1.5">
        {units.map((u, i) => (
          <div key={i} className="flex items-center gap-2 p-1.5 rounded-xl" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.7 }}>
            <ArtImage theme={theme} seed={i + 70} className="w-10 h-10 shrink-0" style={{ borderRadius: theme.radius * 0.5 }} />
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold" style={{ color: theme.text }}>{u.n}</p>
              <p className="text-[7px]" style={{ color: theme.textMuted }}>{u.t} · {u.k}</p>
            </div>
            <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${colorOf(u.s)}25`, color: colorOf(u.s) }}>{u.s}</span>
          </div>
        ))}
      </div>
      <BottomNav theme={theme} active="menu" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ROOMS SCREEN — camere / unità (hotel / agriturismo / real estate)
// ════════════════════════════════════════════════════════════════════════════
function RoomsScreen({ theme, sector }: { theme: ThemeTokens; sector: string }) {
  const isRE = /real|estate|immob|domus|resident/i.test(sector);
  const items = isRE
    ? [{ n: "Attico Brera", k: "180m² · 3 letti · terrazzo", p: "€2.450.000", b: "Esclusiva" }, { n: "Loft Navigli", k: "95m² · 2 letti · open", p: "€1.180.000", b: "Nuovo" }, { n: "Villa Como", k: "320m² · 5 letti · piscina", p: "€3.900.000" }]
    : [{ n: "Suite Vista Mare", k: "King size · Jacuzzi · 38m²", p: "€420 / notte", b: "Top" }, { n: "Camera Deluxe", k: "Queen · balcone · 28m²", p: "€280 / notte" }, { n: "Family Lodge", k: "4 ospiti · cucina · 55m²", p: "€360 / notte", b: "Famiglia" }];
  return (
    <div className="pb-14 overflow-hidden h-full">
      <div className="px-4 pt-1 pb-2">
        <p className="text-[10px] font-black leading-tight" style={{ color: theme.text, fontFamily: theme.fontHead }}>{isRE ? "Unità in vetrina" : "Camere & suite"}</p>
        <p className="text-[7px]" style={{ color: theme.textMuted }}>{isRE ? "Aggiornate oggi · valutazione AI" : "Disponibili nei prossimi 7 giorni"}</p>
      </div>
      <div className="px-4 space-y-1.5">
        {items.map((it, i) => (
          <div key={i} className="rounded-xl overflow-hidden" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.7 }}>
            <div className="relative h-[78px]">
              <ArtImage theme={theme} seed={i + 80} className="absolute inset-0" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 40%, ${theme.bg}d0 100%)` }} />
              {it.b && <span className="absolute top-1.5 left-1.5 text-[6px] font-black px-1.5 py-0.5 rounded uppercase" style={{ background: theme.primary, color: theme.bg }}>{it.b}</span>}
              <span className="absolute top-1.5 right-1.5 text-[6px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${theme.bg}cc`, color: theme.text }}>★ 4.{8 + (i % 2)}</span>
              <div className="absolute bottom-1 left-2 right-2 flex items-end justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] font-black truncate" style={{ color: "#fff", fontFamily: theme.fontHead }}>{it.n}</p>
                  <p className="text-[6px] opacity-80 truncate" style={{ color: "#fff" }}>{it.k}</p>
                </div>
                <p className="text-[9px] font-black" style={{ color: theme.primary, fontFamily: theme.fontHead }}>{it.p}</p>
              </div>
            </div>
            <div className="flex gap-1 p-1.5">
              <button className="flex-1 py-1 rounded-md text-[7px] font-bold" style={{ background: `${theme.text}10`, color: theme.text }}>Dettagli</button>
              <button className="flex-1 py-1 rounded-md text-[7px] font-bold" style={{ background: theme.primary, color: theme.bg }}>{isRE ? "Prenota visita" : "Prenota"}</button>
            </div>
          </div>
        ))}
      </div>
      <BottomNav theme={theme} active="menu" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCHEDULE SCREEN — agenda operatori (beauty/healthcare/fitness/legal/tecnici)
// ════════════════════════════════════════════════════════════════════════════
function ScheduleScreen({ theme, sector }: { theme: ThemeTokens; sector: string }) {
  const isHealth = /clinic|medic|dent|physio|health|vet/i.test(sector);
  const isBeauty = /beauty|hair|spa|nail|estet/i.test(sector);
  const isFit = /fitness|gym|padel|sport|trainer/i.test(sector);
  const staff = isHealth ? ["Dr. Conti", "Dr. Sala", "Inf. Rossi"] : isBeauty ? ["Giulia", "Sara", "Anna"] : isFit ? ["Coach Luca", "Marta", "Free"] : ["Team A", "Team B", "Team C"];
  const slots = [
    { t: "09:00", s: 0, n: "Visita controllo", c: "M. Bianchi" },
    { t: "09:30", s: 1, n: "Trattamento viso", c: "L. Verdi" },
    { t: "10:00", s: 2, n: "Sessione PT", c: "G. Neri" },
    { t: "10:30", s: 0, n: "Follow-up", c: "P. Ricci" },
    { t: "11:00", s: 1, n: "Manicure + spa", c: "A. Russo" },
  ];
  return (
    <div className="pb-14 overflow-hidden h-full">
      <div className="px-4 pt-1 pb-2 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black leading-tight" style={{ color: theme.text, fontFamily: theme.fontHead }}>Agenda · Mar 22</p>
          <p className="text-[7px]" style={{ color: theme.textMuted }}>{slots.length} appuntamenti · 3 operatori</p>
        </div>
        <button className="text-[7px] font-bold px-2 py-1 rounded-full" style={{ background: theme.primary, color: theme.bg }}>+ Nuovo</button>
      </div>
      <div className="px-4 grid grid-cols-7 gap-0.5 mb-2">
        {["L","M","M","G","V","S","D"].map((d, i) => (
          <div key={i} className="text-center py-1 rounded-md" style={{ background: i === 1 ? theme.primary : theme.bgPanel, color: i === 1 ? theme.bg : theme.text }}>
            <p className="text-[6px] font-bold opacity-70">{d}</p>
            <p className="text-[8px] font-black">{20 + i}</p>
          </div>
        ))}
      </div>
      <div className="px-4 grid grid-cols-3 gap-1 mb-1.5">
        {staff.map((s, i) => (
          <div key={i} className="text-center rounded-md py-1" style={{ background: theme.bgPanel }}>
            <div className="w-5 h-5 rounded-full mx-auto mb-0.5 flex items-center justify-center text-[7px] font-black" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, color: theme.bg }}>{s.charAt(s.length - 1)}</div>
            <p className="text-[7px] font-bold truncate" style={{ color: theme.text }}>{s}</p>
          </div>
        ))}
      </div>
      <div className="px-4 space-y-1">
        {slots.map((sl, i) => (
          <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.55, borderLeft: `2px solid ${theme.primary}` }}>
            <span className="text-[8px] font-black tabular-nums w-9" style={{ color: theme.text, fontFamily: theme.fontHead }}>{sl.t}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[8px] font-bold truncate" style={{ color: theme.text }}>{sl.n}</p>
              <p className="text-[6px] truncate" style={{ color: theme.textMuted }}>{sl.c} · {staff[sl.s]}</p>
            </div>
            <span className="text-[6px] px-1 py-0.5 rounded font-bold" style={{ background: `${theme.accent}25`, color: theme.accent }}>30m</span>
          </div>
        ))}
      </div>
      <BottomNav theme={theme} active="booking" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Main export
// ════════════════════════════════════════════════════════════════════════════
// SECTOR CONTENT HELPERS (Casi, Recensioni, Pricing, FAQ, CTA)
// ════════════════════════════════════════════════════════════════════════════
function getCases(sector: string): { title: string; kpi: string; result: string; tag: string }[] {
  const s = (sector || "").toLowerCase();
  if (/pizz|ristor|trattor|oster|food|sushi|bar/i.test(s)) return [
    { title: "Copertura serale +38%", kpi: "+38%", result: "coperti · 6 settimane", tag: "Ristorante" },
    { title: "No-show ridotti al 3%", kpi: "-71%", result: "cancellazioni · SMS smart", tag: "Prenotazioni" },
    { title: "Recensioni 5★ raddoppiate", kpi: "×2", result: "Google · funnel AI", tag: "Reputazione" },
  ];
  if (/spa|wellness|beauty|estetic|parruc|hair|nail/i.test(s)) return [
    { title: "Poltrone piene al 92%", kpi: "92%", result: "occupancy · agenda AI", tag: "Salone" },
    { title: "Pacchetti VIP +52%", kpi: "+52%", result: "upsell automatico", tag: "Fidelity" },
    { title: "Rebooking 30 giorni", kpi: "78%", result: "clienti che tornano", tag: "Retention" },
  ];
  if (/hotel|resort|b&b|bnb|agriturismo|hospit/i.test(s)) return [
    { title: "Direct booking +64%", kpi: "+64%", result: "meno OTA · più margine", tag: "Hotel" },
    { title: "Extra concierge +€47", kpi: "€47", result: "spesa media per stay", tag: "Upsell" },
    { title: "ADR premium +18%", kpi: "+18%", result: "revenue per notte", tag: "Revenue" },
  ];
  if (/ncc|taxi|charter|transfer|yacht|boat/i.test(s)) return [
    { title: "Preventivi in 40 sec", kpi: "40s", result: "risposta media WhatsApp", tag: "Flotta" },
    { title: "Corse ripetute +46%", kpi: "+46%", result: "clienti B2B fidelizzati", tag: "Loyalty" },
    { title: "Riempimento flotta 88%", kpi: "88%", result: "utilizzo mezzi mensile", tag: "Ops" },
  ];
  if (/fitness|palestra|gym|padel|crossfit|sport/i.test(s)) return [
    { title: "Iscritti trial → member", kpi: "42%", result: "conversione onboarding", tag: "Sales" },
    { title: "Classi piene 96%", kpi: "96%", result: "occupancy prime-time", tag: "Ops" },
    { title: "Abbonamenti annuali +34%", kpi: "+34%", result: "upgrade automatico", tag: "Revenue" },
  ];
  if (/medic|dent|clinic|salute|health|vet/i.test(s)) return [
    { title: "Slot liberi visibili", kpi: "-58%", result: "no-show pazienti", tag: "Studio" },
    { title: "Richiami automatici", kpi: "82%", result: "adesione ai richiami", tag: "Care" },
    { title: "Recensioni verificate", kpi: "+120", result: "Google in 90 giorni", tag: "Trust" },
  ];
  if (/edili|costruz|impresa|impiant|idraul|elettr|plumb|cleaning/i.test(s)) return [
    { title: "Preventivi in 2h", kpi: "2h", result: "risposta media clienti", tag: "Cantiere" },
    { title: "Interventi tracciati 100%", kpi: "100%", result: "team sempre allineato", tag: "Ops" },
    { title: "Ticket urgenti risolti", kpi: "24h", result: "SLA rispettato", tag: "Service" },
  ];
  if (/retail|shop|store|fashion|moda|boutique|profum/i.test(s)) return [
    { title: "Carrello medio +€28", kpi: "€28", result: "cross-sell automatico", tag: "E-com" },
    { title: "Recupero abbandoni 34%", kpi: "34%", result: "WhatsApp + email", tag: "Funnel" },
    { title: "Clienti VIP +2.4×", kpi: "×2.4", result: "spesa vs standard", tag: "CRM" },
  ];
  return [
    { title: "Contatti qualificati +58%", kpi: "+58%", result: "lead pronti a firmare", tag: "Sales" },
    { title: "Risposta media 90 sec", kpi: "90s", result: "agente AI H24", tag: "Care" },
    { title: "Recensioni 5★ ×2", kpi: "×2", result: "reputation autopilot", tag: "Trust" },
  ];
}

function getReviews(sector: string): { name: string; role: string; text: string; stars: number }[] {
  const s = (sector || "").toLowerCase();
  if (/pizz|ristor|trattor|oster|food|sushi/i.test(s)) return [
    { name: "Marco B.", role: "Chef · Milano", text: "Ordini raddoppiati la sera. Il KDS in cucina è oro.", stars: 5 },
    { name: "Giulia R.", role: "Cliente abituale", text: "Prenoto in 10 secondi, non torno indietro.", stars: 5 },
    { name: "Andrea V.", role: "Titolare pizzeria", text: "Le recensioni Google sono salite subito.", stars: 5 },
  ];
  if (/spa|beauty|estetic|parruc|hair|nail/i.test(s)) return [
    { name: "Chiara M.", role: "Titolare salone", text: "Agenda sempre piena, zero telefonate a vuoto.", stars: 5 },
    { name: "Sara P.", role: "Cliente VIP", text: "Ricordi ogni mio trattamento. Sembra magia.", stars: 5 },
    { name: "Elena F.", role: "Nail artist", text: "Upselling automatico, tip più alte.", stars: 5 },
  ];
  if (/hotel|resort|hospit|b&b/i.test(s)) return [
    { name: "Luca T.", role: "Direttore hotel", text: "Direct booking finalmente competitivi contro OTA.", stars: 5 },
    { name: "Anna S.", role: "Ospite", text: "Concierge risponde di notte in 30 secondi.", stars: 5 },
    { name: "Marco D.", role: "Revenue manager", text: "ADR e occupancy insieme. Rarissimo.", stars: 5 },
  ];
  if (/ncc|charter|yacht|transfer|taxi/i.test(s)) return [
    { name: "Roberto G.", role: "Autista NCC", text: "Preventivi mentre guido. Chiudo 3 su 4.", stars: 5 },
    { name: "Cliente B2B", role: "Studio legale", text: "Prenoto trasferte in 20 secondi, ricevo fattura.", stars: 5 },
    { name: "Skipper", role: "Capitano charter", text: "Booking chiaro, deposito già incassato.", stars: 5 },
  ];
  return [
    { name: "Sofia L.", role: "Cliente Empire", text: "Come avere 5 persone in più senza assumere.", stars: 5 },
    { name: "Davide N.", role: "Founder", text: "In 30 giorni ha cambiato il business.", stars: 5 },
    { name: "Martina P.", role: "Titolare", text: "Non torno indietro. Team più sereno.", stars: 5 },
  ];
}

function getPricingTiers(sector: string): { name: string; price: string; period: string; highlight: boolean; features: string[] }[] {
  const s = (sector || "").toLowerCase();
  const isB2C = /pizz|ristor|spa|beauty|hotel|hospit|shop|retail|charter|ncc|fitness/i.test(s);
  return [
    {
      name: isB2C ? "Essential" : "Starter",
      price: "€197",
      period: "/mese",
      highlight: false,
      features: ["Sito & prenotazioni", "1 agente AI", "Support base"],
    },
    {
      name: isB2C ? "Signature" : "Growth",
      price: "€397",
      period: "/mese",
      highlight: true,
      features: ["Sito Full Power", "3 agenti AI · WhatsApp", "Concierge H24", "Recensioni autopilot"],
    },
    {
      name: "Empire",
      price: "€997",
      period: "/mese",
      highlight: false,
      features: ["Tutto incluso", "Agenti illimitati", "Voice AI · Analytics"],
    },
  ];
}

function getFaqs(sector: string): { q: string; a: string }[] {
  const s = (sector || "").toLowerCase();
  const base = [
    { q: "In quanti giorni parte tutto?", a: "48–72h. Setup, brand kit e agenti pronti chiavi in mano." },
    { q: "Serve competenza tecnica?", a: "No. Ti seguiamo passo passo, tu approvi e vai online." },
    { q: "Posso disdire?", a: "Sì, in ogni momento. Zero vincoli, zero penali." },
  ];
  if (/pizz|ristor|trattor|food|sushi|bar/i.test(s)) return [
    { q: "Funziona con il mio POS?", a: "Sì. Integrazione con Cassa in Cloud, TheFork, Deliverect e altri." },
    { q: "Gestisce anche il delivery?", a: "Sì, orari, zone, tariffe e KDS cucina in un unico posto." },
    ...base,
  ];
  if (/hotel|hospit|b&b|resort/i.test(s)) return [
    { q: "Si integra con il PMS?", a: "Sì. Beddy, Octorate, Simplebooking e altri channel manager." },
    { q: "Gestisce Booking.com?", a: "Sincronizziamo tariffe e disponibilità, riducendo commissioni." },
    ...base,
  ];
  if (/ncc|charter|transfer|yacht/i.test(s)) return [
    { q: "Come arrivano le richieste?", a: "WhatsApp, sito, Google Maps. Tutte nello stesso pannello." },
    { q: "L'agente parla in inglese?", a: "Sì, 32 lingue. Risposta media 40 secondi." },
    ...base,
  ];
  if (/spa|beauty|estetic|parruc|nail/i.test(s)) return [
    { q: "Gestisce staff multiplo?", a: "Sì. Ogni operatore ha la sua agenda, competenze e cabine." },
    { q: "Come funziona il rebooking?", a: "Automatico via WhatsApp a 30 gg dall'ultimo appuntamento." },
    ...base,
  ];
  return base;
}
// ════════════════════════════════════════════════════════════════════════════
// CASES SCREEN — success stories with KPI badges + pulse indicator
// ════════════════════════════════════════════════════════════════════════════
function CasesScreen({ theme, sector }: { theme: ThemeTokens; sector: string }) {
  const cases = getCases(sector);
  return (
    <div className="pb-14 overflow-hidden h-full">
      <div className="px-4 pt-1 pb-2">
        <p className="text-[7px] uppercase tracking-[2px] font-bold" style={{ color: theme.textMuted }}>Risultati veri</p>
        <p className="text-[15px] font-black leading-tight" style={{ color: theme.text, fontFamily: theme.fontHead }}>
          Casi <span style={{ color: theme.primary }}>reali</span>.
        </p>
      </div>

      {/* KPI hero band */}
      <div className="px-4 mb-2.5">
        <div className="relative rounded-2xl overflow-hidden p-3" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, borderRadius: theme.radius }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[8px] font-bold uppercase opacity-90" style={{ color: theme.bg }}>Media clienti Empire</p>
              <p className="text-[22px] font-black leading-none mt-0.5" style={{ color: theme.bg, fontFamily: theme.fontHead }}>+58%</p>
              <p className="text-[8px] opacity-90 mt-0.5" style={{ color: theme.bg }}>fatturato dopo 90 giorni</p>
            </div>
            <div className="relative">
              <span className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ background: theme.bg }} />
              <span className="relative block w-2 h-2 rounded-full" style={{ background: theme.bg }} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-1.5">
        {cases.map((c, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.7 }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${theme.primary}30, ${theme.accent}25)`, borderRadius: theme.radius * 0.55 }}>
              <span className="text-[11px] font-black" style={{ color: theme.primary, fontFamily: theme.fontHead }}>{c.kpi}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold truncate" style={{ color: theme.text }}>{c.title}</p>
              <p className="text-[7px] truncate" style={{ color: theme.textMuted }}>{c.result}</p>
            </div>
            <span className="text-[6px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ background: `${theme.accent}25`, color: theme.accent }}>{c.tag}</span>
          </div>
        ))}
      </div>

      {/* trust strip */}
      <div className="px-4 mt-2.5">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: `${theme.primary}12`, border: `1px solid ${theme.primary}30` }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2.5" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>
          <span className="text-[7.5px] font-bold" style={{ color: theme.text }}>Dati verificati · 340+ clienti attivi</span>
        </div>
      </div>

      <BottomNav theme={theme} active="home" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// REVIEWS SCREEN — testimonials with star badges + shimmer avatar
// ════════════════════════════════════════════════════════════════════════════
function ReviewsScreen({ theme, sector }: { theme: ThemeTokens; sector: string }) {
  const reviews = getReviews(sector);
  return (
    <div className="pb-14 overflow-hidden h-full">
      <div className="px-4 pt-1 pb-2 flex items-center justify-between">
        <div>
          <p className="text-[7px] uppercase tracking-[2px] font-bold" style={{ color: theme.textMuted }}>Voci vere</p>
          <p className="text-[15px] font-black leading-tight" style={{ color: theme.text, fontFamily: theme.fontHead }}>
            Cosa dicono <span style={{ color: theme.primary }}>di noi</span>.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[13px] font-black" style={{ color: theme.accent, fontFamily: theme.fontHead }}>4.9</p>
          <p className="text-[6px] font-bold" style={{ color: theme.textMuted }}>★★★★★</p>
        </div>
      </div>

      <div className="px-4 space-y-2">
        {reviews.map((r, i) => (
          <div key={i} className="p-2.5 rounded-xl" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.7 }}>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}>
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black" style={{ color: theme.bg, fontFamily: theme.fontHead }}>
                  {r.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[8.5px] font-bold" style={{ color: theme.text }}>{r.name}</p>
                <p className="text-[7px]" style={{ color: theme.textMuted }}>{r.role}</p>
              </div>
              <span className="text-[7px] font-bold" style={{ color: theme.accent }}>{"★".repeat(r.stars)}</span>
            </div>
            <p className="text-[8px] leading-snug italic" style={{ color: theme.text }}>"{r.text}"</p>
          </div>
        ))}
      </div>

      {/* micro-badge live */}
      <div className="px-4 mt-2">
        <div className="flex items-center justify-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70" style={{ background: theme.primary }} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: theme.primary }} />
          </span>
          <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>3 nuove recensioni oggi</span>
        </div>
      </div>

      <BottomNav theme={theme} active="profile" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PRICING SCREEN — 3 tier cards, middle highlighted, feature bullets
// ════════════════════════════════════════════════════════════════════════════
function PricingScreen({ theme, sector }: { theme: ThemeTokens; sector: string }) {
  const tiers = getPricingTiers(sector);
  return (
    <div className="pb-14 overflow-hidden h-full">
      <div className="px-4 pt-1 pb-2">
        <p className="text-[7px] uppercase tracking-[2px] font-bold" style={{ color: theme.textMuted }}>Pacchetti</p>
        <p className="text-[15px] font-black leading-tight" style={{ color: theme.text, fontFamily: theme.fontHead }}>
          Un prezzo. <span style={{ color: theme.primary }}>Tutto incluso.</span>
        </p>
      </div>

      <div className="px-4 space-y-1.5">
        {tiers.map((t, i) => (
          <div
            key={i}
            className="relative p-2.5 rounded-xl"
            style={{
              background: t.highlight ? `linear-gradient(135deg, ${theme.primary}18, ${theme.accent}12)` : theme.bgPanel,
              border: t.highlight ? `1px solid ${theme.primary}70` : `1px solid ${theme.text}12`,
              borderRadius: theme.radius * 0.7,
              boxShadow: t.highlight ? `0 8px 24px -12px ${theme.primary}80` : undefined,
            }}
          >
            {t.highlight && (
              <span className="absolute -top-1.5 right-2 px-1.5 py-0.5 rounded text-[6px] font-black uppercase tracking-wider" style={{ background: theme.primary, color: theme.bg }}>
                Consigliato
              </span>
            )}
            <div className="flex items-baseline justify-between mb-1">
              <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: theme.text, fontFamily: theme.fontHead }}>{t.name}</p>
              <p className="text-[13px] font-black" style={{ color: t.highlight ? theme.primary : theme.text, fontFamily: theme.fontHead }}>
                {t.price}<span className="text-[8px] font-semibold opacity-70">{t.period}</span>
              </p>
            </div>
            <div className="space-y-0.5">
              {t.features.map((f, j) => (
                <div key={j} className="flex items-center gap-1.5">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={t.highlight ? theme.primary : theme.accent} strokeWidth="3" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>
                  <span className="text-[7.5px]" style={{ color: theme.text }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 mt-2">
        <div className="rounded-xl py-2 text-center" style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`, borderRadius: theme.radius * 0.6 }}>
          <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: theme.bg }}>Prova 90 giorni gratis →</span>
        </div>
      </div>

      <BottomNav theme={theme} active="home" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// FAQ SCREEN — accordion with the first row "open"
// ════════════════════════════════════════════════════════════════════════════
function FaqScreen({ theme, sector }: { theme: ThemeTokens; sector: string }) {
  const faqs = getFaqs(sector).slice(0, 5);
  return (
    <div className="pb-14 overflow-hidden h-full">
      <div className="px-4 pt-1 pb-2">
        <p className="text-[7px] uppercase tracking-[2px] font-bold" style={{ color: theme.textMuted }}>Domande frequenti</p>
        <p className="text-[15px] font-black leading-tight" style={{ color: theme.text, fontFamily: theme.fontHead }}>
          Prima di <span style={{ color: theme.primary }}>iniziare</span>.
        </p>
      </div>

      <div className="px-4 space-y-1.5">
        {faqs.map((f, i) => {
          const open = i === 0;
          return (
            <div key={i} className="rounded-xl overflow-hidden" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.6, border: open ? `1px solid ${theme.primary}50` : `1px solid ${theme.text}10` }}>
              <div className="flex items-center justify-between px-2.5 py-2">
                <p className="text-[8.5px] font-bold flex-1 pr-2" style={{ color: theme.text }}>{f.q}</p>
                <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: open ? theme.primary : `${theme.text}12` }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={open ? theme.bg : theme.text} strokeWidth="3" strokeLinecap="round">
                    {open ? <path d="M5 12h14"/> : <path d="M12 5v14M5 12h14"/>}
                  </svg>
                </div>
              </div>
              {open && (
                <div className="px-2.5 pb-2">
                  <p className="text-[7.5px] leading-snug" style={{ color: theme.textMuted }}>{f.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-4 mt-2 flex items-center gap-2 py-2 rounded-xl" style={{ background: `${theme.primary}10` }}>
        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: theme.primary }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={theme.bg} strokeWidth="2.5" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        </div>
        <span className="text-[7.5px] font-bold" style={{ color: theme.text }}>Chatta con un consulente ora</span>
      </div>

      <BottomNav theme={theme} active="profile" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CTA SCREEN — final conversion block, glowing button + urgency ticker
// ════════════════════════════════════════════════════════════════════════════
function CtaScreen({ theme, name, sector }: { theme: ThemeTokens; name: string; sector: string }) {
  const sLabel = sectorLabel(sector);
  return (
    <div className="pb-14 overflow-hidden h-full relative">
      {/* radial glow bg */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 55% at 50% 30%, ${theme.primary}25, transparent 65%)` }} />

      <div className="relative px-4 pt-4 flex flex-col items-center text-center">
        <div className="mb-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: `${theme.primary}15`, border: `1px solid ${theme.primary}40` }}>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70" style={{ background: theme.primary }} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: theme.primary }} />
          </span>
          <span className="text-[6.5px] font-black uppercase tracking-[1.5px]" style={{ color: theme.primary }}>Ultimi posti · {sLabel}</span>
        </div>

        <p className="text-[17px] font-black leading-[1.05]" style={{ color: theme.text, fontFamily: theme.fontHead }}>
          Trasforma <span style={{ color: theme.primary }}>{name || "il tuo brand"}</span> in un impero.
        </p>
        <p className="text-[8.5px] mt-1.5 max-w-[85%]" style={{ color: theme.textMuted }}>
          Setup completo in 72h. Agenti AI attivi H24. Zero rischio, garanzia 30 giorni.
        </p>

        {/* stat row */}
        <div className="mt-3 grid grid-cols-3 gap-1.5 w-full">
          {[
            { v: "72h", l: "Setup" },
            { v: "H24", l: "Agenti AI" },
            { v: "30gg", l: "Garanzia" },
          ].map((s, i) => (
            <div key={i} className="rounded-lg py-1.5 px-1" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.5 }}>
              <p className="text-[11px] font-black" style={{ color: theme.primary, fontFamily: theme.fontHead }}>{s.v}</p>
              <p className="text-[6.5px] font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* Primary CTA — glow pulse */}
        <div className="mt-3 w-full relative">
          <div className="absolute inset-0 rounded-full blur-md opacity-70 animate-pulse" style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})` }} />
          <button className="relative w-full py-2.5 rounded-full font-black text-[10px] uppercase tracking-[2px]" style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`, color: theme.bg, fontFamily: theme.fontHead }}>
            Prenota Demo →
          </button>
        </div>
        <button className="mt-1.5 w-full py-2 rounded-full font-bold text-[8.5px] uppercase tracking-[2px]" style={{ background: "transparent", color: theme.text, border: `1px solid ${theme.text}25` }}>
          Parla su WhatsApp
        </button>

        {/* ticker */}
        <p className="text-[6.5px] mt-2" style={{ color: theme.textMuted }}>
          ✓ 340+ imprese attive · ✓ 4.9★ 128 recensioni · ✓ Nessuna carta richiesta
        </p>
      </div>

      <BottomNav theme={theme} active="home" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
export function MockupReactScreen({


  type, templateVariant, businessName, businessSector = "", businessCity = "", primaryColor, width, height,
  glassIntensity = 60, colorStyle = "vivid",
  safeAreaPx = 0, typeScale = 1, boostContrast = false,
  fontHeadOverride, fontBodyOverride,
}: Props) {
  const baseTheme = getTheme(templateVariant, primaryColor, colorStyle);

  // ─── Readability boost: garantisce contrasto AA su qualsiasi template ────
  // - text: forza luminosità verso gli estremi (chiaro su scuro, scuro su chiaro)
  // - textMuted: alza l'opacità minima a 0.78 invece di 0.55
  let text = baseTheme.text;
  let textMuted = baseTheme.textMuted;
  if (boostContrast) {
    const bgHsl = hexToHsl(baseTheme.bg.startsWith("#") ? baseTheme.bg : "#ffffff");
    const isDark = (bgHsl?.l ?? 100) < 50;
    text = isDark ? "#FFFFFF" : "#0A0A0A";
    // textMuted può essere rgba(...) — lo sostituiamo con una versione più contrastata
    textMuted = isDark ? "rgba(255,255,255,0.82)" : "rgba(10,10,10,0.78)";
  }

  // Override font dal Branding Kit (se presente, sovrascrive il font del template)
  const fontHead = (fontHeadOverride && fontHeadOverride.trim()) || baseTheme.fontHead;
  const fontBody = (fontBodyOverride && fontBodyOverride.trim()) || baseTheme.fontBody;

  const theme: ThemeTokens = { ...baseTheme, glassIntensity, text, textMuted, fontHead, fontBody };

  const renderContent = () => {
    switch (type) {
      case "menu":
      case "catalog":
      case "listing":
      case "services":
      case "portfolio":
        return <MenuScreen theme={theme} sector={businessSector} />;
      case "booking":
      case "contact":
        return <BookingScreen theme={theme} sector={businessSector} />;
      case "profile":
        return <ProfileScreen theme={theme} name={businessName} />;
      case "dashboard":
      case "stats":
        return <DashboardScreen theme={theme} name={businessName} sector={businessSector} />;
      case "chat":
        return <ChatScreen theme={theme} name={businessName} sector={businessSector} />;
      case "map":
        return <MapScreen theme={theme} name={businessName} sector={businessSector} city={businessCity} />;
      case "gallery":
      case "detail":
        return <GalleryScreen theme={theme} name={businessName} />;
      case "checkout":
      case "cart":
        return <CheckoutScreen theme={theme} sector={businessSector} />;
      case "kitchen":
      case "kds":
      case "orders":
        return <KitchenScreen theme={theme} sector={businessSector} />;
      case "fleet":
        return <FleetScreen theme={theme} sector={businessSector} />;
      case "rooms":
      case "units":
        return <RoomsScreen theme={theme} sector={businessSector} />;
      case "schedule":
      case "agenda":
      case "calendar":
        return <ScheduleScreen theme={theme} sector={businessSector} />;
      case "cases":
      case "casi":
      case "success":
        return <CasesScreen theme={theme} sector={businessSector} />;
      case "reviews":
      case "testimonials":
      case "recensioni":
        return <ReviewsScreen theme={theme} sector={businessSector} />;
      case "pricing":
      case "packages":
      case "plans":
        return <PricingScreen theme={theme} sector={businessSector} />;
      case "faq":
      case "faqs":
        return <FaqScreen theme={theme} sector={businessSector} />;
      case "cta":
      case "conversion":
      case "final":
        return <CtaScreen theme={theme} name={businessName} sector={businessSector} />;
      case "hero":
      case "home":
      default:
        return <HomeScreen theme={theme} name={businessName} sector={businessSector} city={businessCity} />;

    }
  };

  // Type scale clamp 0.85–1.20 — viene moltiplicato sui font-size dei figli via CSS zoom
  // su mobile stack (no zoom) usiamo `fontSize` sul contenitore + transform-scale del child wrapper.
  const clampedScale = Math.max(0.85, Math.min(1.20, typeScale));
  const safe = Math.max(0, Math.min(24, safeAreaPx));

  return (
    <div
      className="relative overflow-hidden flex flex-col"
      style={{
        width,
        height,
        background: theme.bg,
        fontFamily: theme.fontBody,
        // CSS var disponibile ai figli che vogliono leggerla; fallback gestito sotto via fontSize
        ["--mockup-type-scale" as any]: clampedScale,
        // fontSize base scalato → tutti i `text-[Npx]` Tailwind restano in px assoluti,
        // ma i figli che usano `em`/`rem` o ereditano da parent ne beneficiano.
        fontSize: `${clampedScale}em`,
      }}
    >
      <StatusBar theme={theme} />
      <div
        className="flex-1 overflow-hidden"
        style={{
          paddingLeft: safe,
          paddingRight: safe,
          // safe-area verticale leggermente ridotta (top già coperto da StatusBar/Dynamic Island)
          paddingBottom: Math.round(safe * 0.5),
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
}
