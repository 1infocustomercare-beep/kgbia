/**
 * Extracts the dominant vibrant color from an image URL using canvas sampling.
 * Returns an HSL string suitable for CSS variables.
 */
export function extractDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve("38 75% 55%"); return; }

        const size = 64;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        const data = ctx.getImageData(0, 0, size, size).data;

        // Collect vibrant pixel colors (skip too dark/light/gray)
        const colors: [number, number, number][] = [];
        for (let i = 0; i < data.length; i += 16) { // sample every 4th pixel
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          if (a < 128) continue; // skip transparent

          const brightness = (r + g + b) / 3;
          const max = Math.max(r, g, b), min = Math.min(r, g, b);
          const saturation = max === 0 ? 0 : (max - min) / max;

          // Keep vibrant, non-gray, non-extreme pixels
          if (brightness > 25 && brightness < 235 && saturation > 0.15) {
            colors.push([r, g, b]);
          }
        }

        if (colors.length === 0) { resolve("38 75% 55%"); return; }

        // Average the vibrant colors
        let rAvg = 0, gAvg = 0, bAvg = 0;
        colors.forEach(([r, g, b]) => { rAvg += r; gAvg += g; bAvg += b; });
        rAvg = Math.round(rAvg / colors.length);
        gAvg = Math.round(gAvg / colors.length);
        bAvg = Math.round(bAvg / colors.length);

        // Convert RGB to HSL
        const hsl = rgbToHsl(rAvg, gAvg, bAvg);
        // Boost saturation for branding
        const s = Math.max(hsl[1], 50);
        const l = Math.min(Math.max(hsl[2], 35), 65);
        resolve(`${Math.round(hsl[0])} ${Math.round(s)}% ${Math.round(l)}%`);
      } catch {
        resolve("38 75% 55%");
      }
    };
    img.onerror = () => resolve("38 75% 55%");
    img.src = imageUrl;
  });
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return [h * 360, s * 100, l * 100];
}

/** Converts HSL string "H S% L%" to a hex color for database storage */
export function hslToHex(hslStr: string): string {
  const parts = hslStr.match(/[\d.]+/g);
  if (!parts || parts.length < 3) return "#C8963E";
  const h = parseFloat(parts[0]) / 360;
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Convert hex color (#RRGGBB) to HSL string "H S% L%" */
export function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "38 75% 55%";
  const [r, g, b] = [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
  const hsl = rgbToHsl(r, g, b);
  return `${Math.round(hsl[0])} ${Math.round(hsl[1])}% ${Math.round(hsl[2])}%`;
}

/* ──────────────────────────────────────────────────────────────
 * WCAG contrast helpers
 * Compute relative luminance + contrast ratio so we can pick
 * an accessible foreground (black/white tinted) for any surface.
 * ────────────────────────────────────────────────────────────── */

/** Convert HSL components to linear RGB then to relative luminance (WCAG). */
function hslToLuminance(h: number, s: number, l: number): number {
  // hsl -> rgb (0..1)
  const sN = s / 100, lN = l / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0, g = 0, b = 0;
  if (hp >= 0 && hp < 1) { r = c; g = x; }
  else if (hp < 2)       { r = x; g = c; }
  else if (hp < 3)       { g = c; b = x; }
  else if (hp < 4)       { g = x; b = c; }
  else if (hp < 5)       { r = x; b = c; }
  else                   { r = c; b = x; }
  const m = lN - c / 2;
  const [rL, gL, bL] = [r + m, g + m, b + m].map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

/** Contrast ratio between two luminances (WCAG 2.1). */
function contrastRatio(l1: number, l2: number): number {
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Pick an accessible foreground HSL string for a given background HSL.
 * Returns a tinted near-white or near-black so it stays on-brand
 * while keeping a contrast ratio ≥ 4.5 (WCAG AA for body text).
 */
export function accessibleForeground(
  bgH: number,
  bgS: number,
  bgL: number,
  opts: { minContrast?: number; tint?: number } = {}
): string {
  const minContrast = opts.minContrast ?? 4.5;
  const tint = opts.tint ?? Math.min(bgS * 0.25, 18);
  const bgLum = hslToLuminance(bgH, bgS, bgL);

  // Try light foreground first, then dark, then push lightness further.
  const candidates: Array<[number, number]> = [
    [tint, 96], [tint, 92], [tint, 98],
    [tint, 8],  [tint, 4],  [tint, 12],
  ];
  for (const [s, l] of candidates) {
    const lum = hslToLuminance(bgH, s, l);
    if (contrastRatio(lum, bgLum) >= minContrast) {
      return `${Math.round(bgH)} ${Math.round(s)}% ${Math.round(l)}%`;
    }
  }
  // Fallback: pure white or black, whichever wins.
  const whiteContrast = contrastRatio(1, bgLum);
  const blackContrast = contrastRatio(0, bgLum);
  return whiteContrast >= blackContrast
    ? `${Math.round(bgH)} 0% 100%`
    : `${Math.round(bgH)} 0% 0%`;
}

/** Parse "H S% L%" CSS-style HSL string into numeric components. */
function parseHsl(hslStr: string): [number, number, number] | null {
  const parts = hslStr.match(/[\d.]+/g);
  if (!parts || parts.length < 3) return null;
  return [parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2])];
}

/** The default Empire gold theme primary HSL */
export const DEFAULT_PRIMARY_HSL = "38 75% 55%";
export const DEFAULT_PRIMARY_HEX = "#C8963E";

/**
 * Apply a primary color (hex) to the document CSS variables,
 * generating a FULL adaptive palette: background, card, secondary,
 * muted, accent, border, glass, sidebar — all derived from the hue.
 */
export function applyBrandTheme(hexColor: string | null | undefined) {
  const hsl = hexColor ? hexToHsl(hexColor) : DEFAULT_PRIMARY_HSL;
  const parts = hsl.match(/[\d.]+/g);
  if (!parts || parts.length < 3) return;
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]);
  const l = parseFloat(parts[2]);

  const root = document.documentElement;
  const set = (k: string, v: string) => root.style.setProperty(k, v);

  // ── Primary ──
  set("--primary", `${h} ${s}% ${l}%`);
  set("--primary-foreground", `${h} ${Math.min(s, 20)}% 4%`);
  set("--ring", `${h} ${s}% ${l}%`);

  // ── Backgrounds — very dark, tinted with brand hue ──
  const bs = Math.max(s * 0.15, 5); // subtle saturation for bg
  set("--background", `${h} ${bs}% 4%`);
  set("--foreground", `${h} ${Math.min(s * 0.3, 20)}% 92%`);

  // ── Card — slightly lighter than bg ──
  set("--card", `${h} ${Math.max(bs - 2, 3)}% 8%`);
  set("--card-foreground", `${h} ${Math.min(s * 0.3, 20)}% 92%`);

  // ── Popover ──
  set("--popover", `${h} ${Math.max(bs - 2, 3)}% 8%`);
  set("--popover-foreground", `${h} ${Math.min(s * 0.3, 20)}% 92%`);

  // ── Secondary — muted brand tint ──
  set("--secondary", `${h} ${Math.max(s * 0.12, 4)}% 14%`);
  set("--secondary-foreground", `${h} ${Math.min(s * 0.3, 20)}% 85%`);

  // ── Muted ──
  set("--muted", `${h} ${Math.max(s * 0.1, 3)}% 12%`);
  set("--muted-foreground", `${h} ${Math.min(s * 0.15, 10)}% 50%`);

  // ── Accent — complementary warm shift ──
  const accentH = (h + 330) % 360; // slight warm shift for contrast
  set("--accent", `${accentH} 70% 50%`);
  set("--accent-foreground", `${h} ${Math.min(s * 0.3, 20)}% 95%`);

  // ── Borders & inputs ──
  set("--border", `${h} ${Math.max(s * 0.12, 4)}% 16%`);
  set("--input", `${h} ${Math.max(s * 0.12, 4)}% 16%`);

  // ── Glassmorphism ──
  set("--glass", `${h} ${Math.max(bs - 2, 3)}% 10% / 0.6`);
  set("--glass-border", `${h} ${Math.min(s * 0.3, 20)}% 92% / 0.08`);
  set("--glass-shine", `${h} ${Math.min(s * 0.3, 20)}% 92% / 0.04`);
  set("--gold-glow", `${h} ${s}% ${l}% / 0.3`);

  // ── Sidebar ──
  set("--sidebar-background", `${h} ${Math.max(bs - 1, 3)}% 6%`);
  set("--sidebar-foreground", `${h} ${Math.min(s * 0.3, 20)}% 85%`);
  set("--sidebar-primary", `${h} ${s}% ${l}%`);
  set("--sidebar-primary-foreground", `${h} ${Math.min(s, 20)}% 4%`);
  set("--sidebar-accent", `${h} ${Math.max(s * 0.12, 4)}% 14%`);
  set("--sidebar-accent-foreground", `${h} ${Math.min(s * 0.3, 20)}% 85%`);
  set("--sidebar-border", `${h} ${Math.max(s * 0.12, 4)}% 16%`);
  set("--sidebar-ring", `${h} ${s}% ${l}%`);
}

/** All CSS variables managed by the brand theme */
const BRAND_VARS = [
  "--primary", "--primary-foreground", "--ring",
  "--background", "--foreground",
  "--card", "--card-foreground",
  "--popover", "--popover-foreground",
  "--secondary", "--secondary-foreground",
  "--muted", "--muted-foreground",
  "--accent", "--accent-foreground",
  "--border", "--input",
  "--glass", "--glass-border", "--glass-shine", "--gold-glow",
  "--sidebar-background", "--sidebar-foreground",
  "--sidebar-primary", "--sidebar-primary-foreground",
  "--sidebar-accent", "--sidebar-accent-foreground",
  "--sidebar-border", "--sidebar-ring",
];

/** Remove all inline overrides and return to the CSS defaults */
export function resetBrandTheme() {
  const root = document.documentElement;
  BRAND_VARS.forEach(prop => root.style.removeProperty(prop));
}
