/**
 * Empire Cover Generator — proprietary placeholder cover art.
 *
 * Produces deterministic, brand-neutral SVG data URIs used wherever the
 * catalogo / portfolio / showcase needs a mockup screen image. Replaces the
 * legacy third-party competitor screenshots that used to live in an external
 * storage bucket. Zero IP risk: pure gradients + monogram + sector tag.
 *
 * Two usage modes:
 *  - empireCover({...})   → fully-specified palette + label
 *  - empireCoverFromPath("Brand Folder/style-a-mobile-home.png")
 *      → infers brand monogram and sublabel from a legacy path so we can swap
 *        old `${BASE}/${path}` call sites without touching their arguments.
 */

export type EmpirePaletteId =
  | "obsidian-gold"
  | "azure-ocean"
  | "sakura-rose"
  | "sage-luxe"
  | "terracotta"
  | "violet-noir"
  | "amber-sand"
  | "turquoise-deep"
  | "coral-warm"
  | "mono-ink"
  | "emerald-noir"
  | "champagne-pearl";

interface PaletteSpec {
  from: string;
  to: string;
  accent: string;
  ink: string;
}

export const EMPIRE_PALETTES: Record<EmpirePaletteId, PaletteSpec> = {
  "obsidian-gold":    { from: "#11141a", to: "#2a1f12", accent: "#d4af37", ink: "#fff5e0" },
  "azure-ocean":      { from: "#0f1620", to: "#13283f", accent: "#69c0ff", ink: "#e8f3ff" },
  "sakura-rose":      { from: "#1a0f1a", to: "#3a1a2a", accent: "#e8a0bf", ink: "#fff0f5" },
  "sage-luxe":        { from: "#0d1812", to: "#13261c", accent: "#6fd29a", ink: "#e6fff0" },
  "terracotta":       { from: "#1a1410", to: "#2c1d12", accent: "#c87533", ink: "#ffe8c4" },
  "violet-noir":      { from: "#0f0f14", to: "#1c1c28", accent: "#9d8cff", ink: "#e8e4ff" },
  "amber-sand":       { from: "#1c1209", to: "#332010", accent: "#f4b250", ink: "#fff2d4" },
  "turquoise-deep":   { from: "#0a1a1a", to: "#0f2e2c", accent: "#3fd5c0", ink: "#dfffeb" },
  "coral-warm":       { from: "#1c1010", to: "#321616", accent: "#ff8a6b", ink: "#ffe2d4" },
  "mono-ink":         { from: "#0e0e0e", to: "#1a1a1a", accent: "#f5f5f5", ink: "#cfcfcf" },
  "emerald-noir":     { from: "#0a1814", to: "#13261f", accent: "#4ade80", ink: "#dcfce7" },
  "champagne-pearl":  { from: "#171311", to: "#2a221c", accent: "#e7d4a8", ink: "#fff6e0" },
};

const PALETTE_IDS = Object.keys(EMPIRE_PALETTES) as EmpirePaletteId[];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function pickPalette(key: string): PaletteSpec {
  return EMPIRE_PALETTES[PALETTE_IDS[hashStr(key) % PALETTE_IDS.length]];
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function monogramFor(label: string): string {
  const cleaned = label
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (cleaned.length === 0) return "E";
  if (cleaned.length === 1) return cleaned[0].slice(0, 2).toUpperCase();
  return (cleaned[0][0] + cleaned[1][0]).toUpperCase();
}

export interface EmpireCoverOpts {
  /** Stable identifier — drives palette + glyph rotation when paletteId omitted. */
  key: string;
  /** Brand or section label, used to derive a 1–3 char monogram. */
  label: string;
  /** Small tag rendered under the monogram (e.g. screen type, style). */
  sublabel?: string;
  /** Optional explicit palette override. */
  paletteId?: EmpirePaletteId;
  /** Width / height of the SVG viewBox. Defaults to mobile phone ratio. */
  width?: number;
  height?: number;
}

/**
 * Build a proprietary SVG cover and return it as a data URI suitable for
 * <img src=...> or CSS background-image: url(...).
 */
export function empireCover(opts: EmpireCoverOpts): string {
  const palette = opts.paletteId
    ? EMPIRE_PALETTES[opts.paletteId]
    : pickPalette(opts.key);
  const w = opts.width ?? 360;
  const h = opts.height ?? 780;
  const mono = monogramFor(opts.label);
  const sub = (opts.sublabel ?? "").toString().toUpperCase().slice(0, 22);
  const accent = palette.accent;
  const ink = palette.ink;

  // Decorative grid stripes scaled to viewBox
  const gridLines: string[] = [];
  const step = Math.max(40, Math.round(h / 10));
  for (let y = step; y < h; y += step) {
    gridLines.push(`<line x1="0" y1="${y}" x2="${w}" y2="${y}" />`);
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">` +
      `<defs>` +
        `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
          `<stop offset="0" stop-color="${palette.from}"/>` +
          `<stop offset="1" stop-color="${palette.to}"/>` +
        `</linearGradient>` +
        `<radialGradient id="r" cx="50%" cy="30%" r="70%">` +
          `<stop offset="0" stop-color="${accent}" stop-opacity="0.22"/>` +
          `<stop offset="1" stop-color="${accent}" stop-opacity="0"/>` +
        `</radialGradient>` +
      `</defs>` +
      `<rect width="${w}" height="${h}" fill="url(#g)"/>` +
      `<rect width="${w}" height="${h}" fill="url(#r)"/>` +
      `<g opacity="0.08" stroke="${accent}" stroke-width="1">${gridLines.join("")}</g>` +
      `<g transform="translate(${w / 2} ${h * 0.42})" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif">` +
        `<circle r="${Math.min(w, h) * 0.22}" fill="none" stroke="${accent}" stroke-opacity="0.4" stroke-width="1"/>` +
        `<text y="32" font-size="${Math.min(w, h) * 0.24}" font-weight="600" fill="${ink}" letter-spacing="2">${escapeXml(mono)}</text>` +
      `</g>` +
      `<g transform="translate(${w / 2} ${h * 0.62})" text-anchor="middle" font-family="Inter, system-ui, sans-serif">` +
        `<text font-size="12" fill="${accent}" letter-spacing="6">EMPIRE STUDIO</text>` +
        (sub ? `<text y="22" font-size="10" fill="${ink}" fill-opacity="0.75" letter-spacing="3">${escapeXml(sub)}</text>` : "") +
      `</g>` +
      `<rect x="${w * 0.11}" y="${h * 0.9}" width="${w * 0.78}" height="2" fill="${accent}" opacity="0.5"/>` +
    `</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Drop-in replacement for the legacy `${BASE}/${path}` helper. Accepts the same
 * `Brand Folder/file-name.png` shape that the old catalog data uses and infers
 * a brand label + screen sublabel from it.
 */
export function empireCoverFromPath(path: string): string {
  const decoded = decodeURIComponent(path);
  const [rawFolder = "Empire Studio", rawFile = ""] = decoded.split("/", 2);
  const fileToken = rawFile.replace(/\.[a-z0-9]+$/i, "");
  // last segment after dashes is the screen type (home/menu/detail/cart…)
  const tokens = fileToken.split(/[-_]/).filter(Boolean);
  const screen = tokens[tokens.length - 1] ?? "";
  return empireCover({
    key: decoded,
    label: rawFolder,
    sublabel: screen,
  });
}
