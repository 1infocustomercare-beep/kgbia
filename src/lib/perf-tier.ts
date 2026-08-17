/**
 * perf-tier — rilevamento (una sola volta) della "classe" del dispositivo per
 * dosare glow, blur e overlay decorativi.
 *
 * Espone il risultato come attributi sull'elemento <html>, così il CSS può
 * ridurre il costo di rendering senza JS per-frame:
 *   data-perf-tier="lite" | "full"
 *   data-pointer="coarse" | "fine"
 *
 * "lite" quando il device dichiara pochi core / poca RAM, oppure quando l'utente
 * ha chiesto meno movimento o risparmio dati. In quel caso i layer più costosi
 * (blur su superfici a tutto schermo, spotlight in mix-blend-mode, film grain
 * animato) vengono spenti o semplificati.
 */
export type PerfTier = "lite" | "full";

let cached: PerfTier | null = null;

export function detectPerfTier(): PerfTier {
  if (cached) return cached;
  if (typeof window === "undefined") return "full";

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };

  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  const saveData = nav.connection?.saveData === true;
  const slowNet = /(^|-)2g$/.test(nav.connection?.effectiveType ?? "");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const smallScreen = Math.min(window.innerWidth, window.innerHeight) <= 480;

  const lite =
    cores <= 4 ||
    memory <= 4 ||
    saveData ||
    slowNet ||
    reducedMotion ||
    (coarse && smallScreen && cores <= 6);

  cached = lite ? "lite" : "full";
  return cached;
}

/** Applica gli attributi su <html>. Idempotente, sicuro da chiamare più volte. */
export function applyPerfTier(): PerfTier {
  const tier = detectPerfTier();
  if (typeof document === "undefined") return tier;
  const root = document.documentElement;
  root.setAttribute("data-perf-tier", tier);
  root.setAttribute(
    "data-pointer",
    window.matchMedia("(pointer: coarse)").matches ? "coarse" : "fine",
  );
  return tier;
}

/** true quando conviene evitare tracking del puntatore e layer extra. */
export function isLiteTier(): boolean {
  return detectPerfTier() === "lite";
}
