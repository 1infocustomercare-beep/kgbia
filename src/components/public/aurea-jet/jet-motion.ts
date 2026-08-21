export const JET_EASE = [0.16, 1, 0.3, 1] as const;

export const JET_SCROLL = {
  heroHeight: "h-[190svh] sm:h-[215svh]",
  portalHeight: "h-[245svh] sm:h-[285svh]",
  filmHeight: "h-[300svh] sm:h-[340svh]",
  explodedHeight: "h-[235svh] sm:h-[275svh]",
} as const;

export const clampProgress = (value: number) => Math.min(1, Math.max(0, value));
