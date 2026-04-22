/**
 * WCAG 2.1 contrast utilities + auto-suggestion for brand colors.
 *
 * Use cases nel Mockup Suite Generator:
 *  - verificare che il colore brand (CTA) sia leggibile su sfondo scuro/chiaro
 *  - verificare che il foreground (testo bianco/nero) sopra la CTA brand sia leggibile
 *  - suggerire automaticamente una variante più scura/chiara del brand che superi AA
 */

export type WcagLevel = "AAA" | "AA" | "AA Large" | "Fail";

export interface ContrastEvaluation {
  ratio: number;            // es. 4.73
  level: WcagLevel;         // grading WCAG
  passesAA: boolean;        // ≥ 4.5 (testo normale)
  passesAAA: boolean;       // ≥ 7
  passesAALarge: boolean;   // ≥ 3 (testo grande / icone)
}

/* ──────────────────────────────────────────────────────────────
 * HEX ⇄ RGB / HSL
 * ────────────────────────────────────────────────────────────── */

export function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
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

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [r * 255, g * 255, b * 255];
}

/* ──────────────────────────────────────────────────────────────
 * Luminanza relativa + ratio (WCAG 2.1)
 * ────────────────────────────────────────────────────────────── */

function relativeLuminance(r: number, g: number, b: number): number {
  const conv = (v: number) => {
    const sv = v / 255;
    return sv <= 0.03928 ? sv / 12.92 : Math.pow((sv + 0.055) / 1.055, 2.4);
  };
  const [rL, gL, bL] = [conv(r), conv(g), conv(b)];
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

export function contrastRatioHex(fgHex: string, bgHex: string): number {
  const fg = hexToRgb(fgHex);
  const bg = hexToRgb(bgHex);
  if (!fg || !bg) return 1;
  const l1 = relativeLuminance(...fg);
  const l2 = relativeLuminance(...bg);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export function evaluateContrast(fgHex: string, bgHex: string): ContrastEvaluation {
  const ratio = contrastRatioHex(fgHex, bgHex);
  const passesAAA = ratio >= 7;
  const passesAA = ratio >= 4.5;
  const passesAALarge = ratio >= 3;
  let level: WcagLevel = "Fail";
  if (passesAAA) level = "AAA";
  else if (passesAA) level = "AA";
  else if (passesAALarge) level = "AA Large";
  return { ratio, level, passesAA, passesAAA, passesAALarge };
}

/** Sceglie il foreground (bianco o nero) col contrasto più alto rispetto a uno sfondo. */
export function bestForegroundOn(bgHex: string): "#FFFFFF" | "#0A0A0A" {
  const white = contrastRatioHex("#FFFFFF", bgHex);
  const black = contrastRatioHex("#0A0A0A", bgHex);
  return white >= black ? "#FFFFFF" : "#0A0A0A";
}

/* ──────────────────────────────────────────────────────────────
 * Auto-suggestion: variante del brand color che passa AA
 * ────────────────────────────────────────────────────────────── */

/**
 * Restituisce una versione del colore brand con la stessa tonalità
 * ma luminosità adattata per superare la soglia di contrasto richiesta
 * sullo sfondo dato. Mantiene H e S, sposta L in steps fino a trovare un valore valido.
 *
 * @param brandHex   colore brand corrente
 * @param bgHex      sfondo su cui deve essere leggibile (es. card o background app)
 * @param minRatio   soglia minima (default 4.5 = WCAG AA testo normale)
 */
export function suggestAccessibleBrand(
  brandHex: string,
  bgHex: string,
  minRatio = 4.5
): { hex: string; ratio: number; adjusted: boolean } {
  const rgb = hexToRgb(brandHex);
  const bg = hexToRgb(bgHex);
  if (!rgb || !bg) return { hex: brandHex, ratio: 1, adjusted: false };

  const baseRatio = contrastRatioHex(brandHex, bgHex);
  if (baseRatio >= minRatio) {
    return { hex: brandHex, ratio: baseRatio, adjusted: false };
  }

  const [h, s, l] = rgbToHsl(...rgb);
  const bgLum = relativeLuminance(...bg);

  // Decidi direzione: se sfondo è scuro → schiarisci il brand; se chiaro → scuriscilo.
  const goLighter = bgLum < 0.18;

  let bestHex = brandHex;
  let bestRatio = baseRatio;

  // Esplora L in entrambe le direzioni, ma preferendo la direzione "naturale".
  const directions = goLighter ? [+1, -1] : [-1, +1];

  for (const dir of directions) {
    for (let step = 5; step <= 95; step += 5) {
      const newL = Math.max(2, Math.min(98, l + dir * step));
      // mantieni saturazione minima per non lavare il brand
      const newS = Math.max(s, 35);
      const [r2, g2, b2] = hslToRgb(h, newS, newL);
      const candidate = rgbToHex(r2, g2, b2);
      const ratio = contrastRatioHex(candidate, bgHex);
      if (ratio > bestRatio) {
        bestHex = candidate;
        bestRatio = ratio;
      }
      if (ratio >= minRatio) {
        return { hex: candidate, ratio, adjusted: true };
      }
    }
  }

  return { hex: bestHex, ratio: bestRatio, adjusted: bestHex !== brandHex };
}

/** Etichetta breve per un livello WCAG. */
export function wcagBadgeLabel(level: WcagLevel): string {
  switch (level) {
    case "AAA": return "WCAG AAA";
    case "AA": return "WCAG AA";
    case "AA Large": return "AA grande";
    case "Fail": return "Contrasto basso";
  }
}
