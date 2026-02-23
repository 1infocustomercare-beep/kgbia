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

/** The default Empire gold theme primary HSL */
export const DEFAULT_PRIMARY_HSL = "38 75% 55%";
export const DEFAULT_PRIMARY_HEX = "#C8963E";

/**
 * Apply a primary color (hex) to the document CSS variables,
 * generating a complete adaptive palette from the hue.
 */
export function applyBrandTheme(hexColor: string | null | undefined) {
  const hsl = hexColor ? hexToHsl(hexColor) : DEFAULT_PRIMARY_HSL;
  const parts = hsl.match(/[\d.]+/g);
  if (!parts || parts.length < 3) return;
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]);
  const l = parseFloat(parts[2]);

  const root = document.documentElement;
  // Primary color
  root.style.setProperty("--primary", `${h} ${s}% ${l}%`);
  // Ring matches primary
  root.style.setProperty("--ring", `${h} ${s}% ${l}%`);
  // Gold glow based on primary
  root.style.setProperty("--gold-glow", `${h} ${s}% ${l}% / 0.3`);
  // Sidebar primary
  root.style.setProperty("--sidebar-primary", `${h} ${s}% ${l}%`);
  root.style.setProperty("--sidebar-ring", `${h} ${s}% ${l}%`);
}

/** Remove all inline overrides and return to the CSS defaults */
export function resetBrandTheme() {
  const root = document.documentElement;
  ["--primary", "--ring", "--gold-glow", "--sidebar-primary", "--sidebar-ring"].forEach(prop => {
    root.style.removeProperty(prop);
  });
}
