/**
 * PremiumSectionBg — Reusable premium ambient background for demo sections.
 * Renders sector-themed glows, subtle grid, and accent lines.
 */

interface Props {
  accentColor: string;
  variant?: "default" | "alt" | "deep" | "warm";
}

export default function PremiumSectionBg({ accentColor, variant = "default" }: Props) {
  const layouts: Record<string, { glows: { top: string; left: string; w: string; opacity: string }[]; gridOpacity: string }> = {
    default: {
      glows: [
        { top: "5%", left: "15%", w: "500px", opacity: "0.045" },
        { top: "60%", left: "70%", w: "400px", opacity: "0.035" },
      ],
      gridOpacity: "0.025",
    },
    alt: {
      glows: [
        { top: "10%", left: "75%", w: "450px", opacity: "0.04" },
        { top: "70%", left: "10%", w: "500px", opacity: "0.035" },
      ],
      gridOpacity: "0.02",
    },
    deep: {
      glows: [
        { top: "0%", left: "50%", w: "600px", opacity: "0.05" },
        { top: "80%", left: "20%", w: "350px", opacity: "0.03" },
        { top: "40%", left: "80%", w: "300px", opacity: "0.025" },
      ],
      gridOpacity: "0.03",
    },
    warm: {
      glows: [
        { top: "15%", left: "30%", w: "550px", opacity: "0.04" },
        { top: "55%", left: "65%", w: "450px", opacity: "0.035" },
      ],
      gridOpacity: "0.02",
    },
  };

  const layout = layouts[variant] || layouts.default;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Ambient glows */}
      {layout.glows.map((g, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: g.top,
            left: g.left,
            width: g.w,
            height: g.w,
            opacity: g.opacity,
            background: `radial-gradient(circle, ${accentColor}80, transparent 65%)`,
            filter: "blur(120px)",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          opacity: layout.gridOpacity,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}30, transparent)` }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[80px]"
        style={{ background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.3))" }}
      />
    </div>
  );
}
