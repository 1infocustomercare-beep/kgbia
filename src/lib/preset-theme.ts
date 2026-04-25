/**
 * preset-theme.ts
 * Converte un MockupStylePreset in CSS variables HSL (compatibili con i token
 * semantici del design system) così che bottoni, card, menu e accenti dell'UI
 * ereditino dinamicamente la palette del preset selezionato.
 *
 * Strategy:
 *  - convertiamo i colori del preset (hex/rgba/gradient) in HSL triplets
 *  - sovrascriviamo i token chiave: --primary, --primary-foreground, --accent,
 *    --accent-foreground, --card, --card-foreground, --muted, --muted-foreground,
 *    --background, --foreground, --border, --ring, --radius
 *  - Esposti come variabili scoped: <PresetThemeScope/> applica lo style ad un
 *    container limitato (non al :root) per non rompere il chrome globale.
 */

import type { MockupStylePreset } from "@/lib/mockup-style-presets";

// ─── Color utils ───────────────────────────────────────────────
function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

/** Estrae il primo colore esadecimale da una stringa (utile per gradient bg). */
function pickFirstColor(input: string): string {
  if (!input) return "#ffffff";
  const m = input.match(/#([0-9a-fA-F]{3,8})/);
  if (m) return `#${m[1]}`;
  const rgba = input.match(/rgba?\(([^)]+)\)/);
  if (rgba) {
    const [r, g, b] = rgba[1].split(",").map((x) => parseFloat(x.trim()));
    return rgbToHex(r, g, b);
  }
  return "#ffffff";
}

function rgbToHex(r: number, g: number, b: number): string {
  const h = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

/** Converte hex (#rgb / #rrggbb) in [r,g,b] 0-255. */
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean.slice(0, 6);
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/** Converte qualsiasi stringa colore in formato HSL "H S% L%" (per Tailwind). */
export function colorToHslTriplet(input: string): string {
  const hex = pickFirstColor(input);
  const [r, g, b] = hexToRgb(hex).map((c) => c / 255) as [number, number, number];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / d + 2) * 60;
        break;
      default:
        h = ((r - g) / d + 4) * 60;
    }
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/** Restituisce "0 0% 100%" o "0 0% 0%" in base alla luminosità del bg. */
export function autoForeground(bgInput: string): string {
  const hex = pickFirstColor(bgInput);
  const [r, g, b] = hexToRgb(hex);
  // YIQ
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140 ? "222 47% 11%" : "0 0% 100%";
}

/** Costruisce la mappa di CSS variables semantiche dal preset. */
export function buildPresetCssVars(
  preset: MockupStylePreset
): Record<string, string> {
  const bg = colorToHslTriplet(preset.palette.bg);
  const surface = colorToHslTriplet(preset.palette.surface);
  const text = colorToHslTriplet(preset.palette.text);
  const muted = colorToHslTriplet(preset.palette.muted);
  const accent = colorToHslTriplet(preset.palette.accent);
  const accentSoft = colorToHslTriplet(preset.palette.accentSoft);
  const card = colorToHslTriplet(preset.palette.cardBg);

  const accentFg = autoForeground(preset.palette.accent);
  const cardFg = autoForeground(preset.palette.cardBg);
  const surfaceFg = autoForeground(preset.palette.surface);
  const bgFg = autoForeground(preset.palette.bg);

  return {
    "--background": bg,
    "--foreground": bgFg === text ? text : text, // preferisci text del preset
    "--card": card,
    "--card-foreground": cardFg === text ? text : text,
    "--popover": surface,
    "--popover-foreground": surfaceFg === text ? text : text,
    "--primary": accent,
    "--primary-foreground": accentFg,
    "--secondary": accentSoft,
    "--secondary-foreground": text,
    "--muted": accentSoft,
    "--muted-foreground": muted,
    "--accent": accentSoft,
    "--accent-foreground": text,
    "--border": muted,
    "--input": muted,
    "--ring": accent,
    "--radius": `${preset.radius}px`,
    // token custom esposti per uso diretto nei componenti
    "--preset-accent": accent,
    "--preset-accent-soft": accentSoft,
    "--preset-surface": surface,
    "--preset-text": text,
    "--preset-muted": muted,
    "--preset-shadow":
      preset.shadow === "dramatic"
        ? "0 24px 64px -12px hsl(var(--preset-accent) / 0.45)"
        : preset.shadow === "medium"
          ? "0 12px 32px -10px hsl(var(--preset-accent) / 0.30)"
          : "0 4px 14px -6px hsl(var(--preset-accent) / 0.18)",
    "--preset-font-head": `"${preset.fonts.heading}", serif`,
    "--preset-font-body": `"${preset.fonts.body}", sans-serif`,
  };
}

/** Converte la mappa in stringa CSS inline da passare a `style`. */
export function presetCssVarsToStyle(
  preset: MockupStylePreset
): React.CSSProperties {
  const vars = buildPresetCssVars(preset);
  return vars as unknown as React.CSSProperties;
}

/** Inietta il <link> Google Fonts del preset (se non già presente). */
export function ensurePresetGoogleFonts(preset: MockupStylePreset) {
  if (typeof document === "undefined") return;
  const id = `gf-${preset.key}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?${preset.fonts.googleFontsQuery}&display=swap`;
  document.head.appendChild(link);
}

clamp01; // silence unused if tree-shaking removes
