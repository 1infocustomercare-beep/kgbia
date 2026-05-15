import { CSSProperties } from "react";

/**
 * Empire AI logo — emerald + gold monogram "E" with crown notch.
 * Pure SVG so it scales crisp everywhere and animates cheaply.
 */
interface Props {
  size?: number;
  withWordmark?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Stroke draw animation on mount */
  animated?: boolean;
}

export default function EmpireLogo({
  size = 36,
  withWordmark = false,
  className = "",
  style,
  animated = false,
}: Props) {
  const id = `eg-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`} style={style}>
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        aria-label="Empire AI"
        role="img"
      >
        <defs>
          <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(42 80% 76%)" />
            <stop offset="55%" stopColor="hsl(42 70% 58%)" />
            <stop offset="100%" stopColor="hsl(38 75% 42%)" />
          </linearGradient>
          <linearGradient id={`${id}-emerald`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(162 60% 22%)" />
            <stop offset="100%" stopColor="hsl(162 70% 8%)" />
          </linearGradient>
          <radialGradient id={`${id}-glow`} cx="0.5" cy="0.4" r="0.6">
            <stop offset="0%" stopColor="hsl(158 80% 55% / 0.55)" />
            <stop offset="100%" stopColor="hsl(158 80% 55% / 0)" />
          </radialGradient>
        </defs>

        {/* Glow */}
        <rect x="0" y="0" width="64" height="64" fill={`url(#${id}-glow)`} />

        {/* Shield */}
        <path
          d="M32 3 L57 12 V32 C57 47 46 56 32 61 C18 56 7 47 7 32 V12 Z"
          fill={`url(#${id}-emerald)`}
          stroke={`url(#${id}-gold)`}
          strokeWidth="1.4"
          strokeLinejoin="round"
          style={animated ? { strokeDasharray: 220, strokeDashoffset: 220, animation: "eg-draw 1.4s .1s ease-out forwards" } : undefined}
        />

        {/* Crown notch */}
        <path
          d="M22 14 L26 9 L32 13 L38 9 L42 14 Z"
          fill={`url(#${id}-gold)`}
        />

        {/* Letter E (monogram) */}
        <g
          fill="none"
          stroke={`url(#${id}-gold)`}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={animated ? { strokeDasharray: 80, strokeDashoffset: 80, animation: "eg-draw 1.1s .5s ease-out forwards" } : undefined}
        >
          <line x1="22" y1="22" x2="42" y2="22" />
          <line x1="22" y1="22" x2="22" y2="46" />
          <line x1="22" y1="34" x2="38" y2="34" />
          <line x1="22" y1="46" x2="42" y2="46" />
        </g>

        {/* Diamond accent */}
        <circle cx="46" cy="34" r="1.6" fill={`url(#${id}-gold)`} />

        <style>{`@keyframes eg-draw { to { stroke-dashoffset: 0; } }`}</style>
      </svg>

      {withWordmark && (
        <span
          className="font-semibold leading-none tracking-tight"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: size * 0.55,
            background:
              "linear-gradient(120deg, hsl(42 75% 76%), hsl(42 65% 56%) 60%, hsl(38 70% 42%))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Empire<span style={{ opacity: 0.7, marginLeft: 4 }}>AI</span>
        </span>
      )}
    </div>
  );
}
