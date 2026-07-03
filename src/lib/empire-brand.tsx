import empireLogoAsset from "@/assets/empire-logo.jpeg.asset.json";

/**
 * Single source of truth per l'identità visiva Empire AI.
 * Modifica qui e propaga a navbar, footer, splash, 404 e ovunque.
 */
export const EMPIRE_BRAND = {
  name: "Empire",
  suffix: ".AI",
  tagline: "Autonomous AI",
  logoUrl: empireLogoAsset.url,
  colors: {
    deep: "#081824",
    emerald: "#0B3B2E",
    gold: "#C9A24B",
    cream: "#F7F3EC",
  },
} as const;

export type EmpireLogoSize = "sm" | "md" | "lg" | "xl";

const SIZE_PX: Record<EmpireLogoSize, number> = {
  sm: 28,
  md: 40,
  lg: 64,
  xl: 96,
};

/**
 * <EmpireLogo /> — logo ufficiale, sempre identico ovunque.
 */
export function EmpireLogo({
  size = "md",
  rounded = "lg",
  glow = false,
  className = "",
  alt = "Empire AI",
}: {
  size?: EmpireLogoSize | number;
  rounded?: "md" | "lg" | "xl" | "2xl" | "full";
  glow?: boolean;
  className?: string;
  alt?: string;
}) {
  const px = typeof size === "number" ? size : SIZE_PX[size];
  const radiusMap = { md: 8, lg: 12, xl: 16, "2xl": 20, full: 9999 };
  const radius = radiusMap[rounded];
  return (
    <span
      className={`inline-flex overflow-hidden ${className}`}
      style={{
        width: px,
        height: px,
        borderRadius: radius,
        boxShadow: glow
          ? `inset 0 0 0 1px rgba(201,162,75,0.45), 0 8px 28px -10px rgba(201,162,75,0.55)`
          : `inset 0 0 0 1px rgba(201,162,75,0.35)`,
        background: EMPIRE_BRAND.colors.emerald,
      }}
    >
      <img
        src={EMPIRE_BRAND.logoUrl}
        alt={alt}
        draggable={false}
        className="h-full w-full object-cover"
      />
    </span>
  );
}

/**
 * Wordmark "EMPIRE.AI" con lo split gold sul suffisso.
 */
export function EmpireWordmark({
  size = 18,
  className = "",
  serif = false,
}: {
  size?: number;
  className?: string;
  serif?: boolean;
}) {
  return (
    <span
      className={className}
      style={{
        fontFamily: serif
          ? "'DM Serif Display', Georgia, serif"
          : "Urbanist, Inter, sans-serif",
        color: EMPIRE_BRAND.colors.cream,
        fontSize: size,
        fontWeight: serif ? 400 : 900,
        letterSpacing: serif ? "0.14em" : "0.02em",
        lineHeight: 1,
      }}
    >
      {EMPIRE_BRAND.name}
      <span style={{ color: EMPIRE_BRAND.colors.gold }}>{EMPIRE_BRAND.suffix}</span>
    </span>
  );
}
