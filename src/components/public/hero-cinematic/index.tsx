/**
 * ═══ HERO CINEMATIC — scroll-driven 3D flyby layers for demo sites ═══
 *
 * One signature "wow" moment per sector: while the visitor scrolls the hero,
 * a sector object crosses the screen in 3D (perspective + roll + speed blur),
 * dragging a light trail that momentarily wipes over the headline — exactly the
 * "jet crossing the title" moment, generalised to every industry.
 *
 * Rules:
 * - purely decorative: `pointer-events-none`, `aria-hidden`
 * - GPU-only transforms driven by `useScroll` (no layout thrash)
 * - static single frame under `prefers-reduced-motion`
 * - ADDITIVE: mount inside an existing hero `<section className="relative">`
 */
import { useReducedMotion, motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";
import privateJet from "@/assets/hero-cinematic/private-jet.png";

/* ══════════════════════════════════════════════════════════
   Silhouettes (viewBox 0 0 120 40, nose pointing right)
   ══════════════════════════════════════════════════════════ */
const SHAPES: Record<string, string> = {
  // private jet
  jet: "M2 22 L46 18 L64 6 L72 6 L68 17 L96 14 L104 4 L112 4 L110 15 L118 16 L118 22 L108 26 L112 36 L104 36 L94 26 L66 24 L70 35 L62 35 L44 24 Z",
  // luxury sedan
  car: "M6 30 L14 20 L38 14 L74 14 L94 21 L114 24 L116 30 L106 31 A9 9 0 0 0 88 31 L44 31 A9 9 0 0 0 26 31 Z",
  // motor yacht
  boat: "M8 28 L112 28 L100 36 L20 36 Z M34 27 L34 14 L74 14 L82 27 Z M78 13 L110 13 L104 22 L84 22 Z",
  // croissant
  croissant: "M10 30 C22 8 60 2 92 12 C112 18 116 30 104 34 C92 38 76 28 60 28 C40 28 26 36 10 30 Z",
  // dumbbell
  dumbbell: "M8 12 H20 V28 H8 Z M22 16 H98 V24 H22 Z M100 12 H112 V28 H100 Z",
  // shears
  scissors: "M6 8 L74 20 L6 32 L14 20 Z M78 12 A8 8 0 1 1 78 28 A8 8 0 1 1 78 12 Z M100 6 A7 7 0 1 1 100 20 A7 7 0 1 1 100 6 Z M100 22 A7 7 0 1 1 100 36 A7 7 0 1 1 100 22 Z",
  // pulse capsule
  pulse: "M4 20 H30 L38 8 L48 32 L58 16 L66 24 H116 V26 H64 L57 20 L47 38 L37 14 L31 22 H4 Z",
  // hotel key card
  key: "M6 10 H92 A8 8 0 0 1 100 18 V26 A8 8 0 0 1 92 34 H6 A6 6 0 0 1 0 28 V16 A6 6 0 0 1 6 10 Z M104 16 H118 V28 H104 Z",
  // shopping bag
  bag: "M20 14 H100 L110 36 H10 Z M40 14 C40 4 80 4 80 14",
  // wrench
  wrench: "M4 18 H70 V26 H4 Z M72 10 A12 12 0 1 1 72 34 L86 26 H116 V18 H86 Z",
  // diamond
  diamond: "M30 6 H90 L118 20 L60 38 L2 20 Z",
  // sun / beach parasol arc
  sun: "M60 4 A20 20 0 0 1 60 36 A20 20 0 0 1 60 4 Z M2 20 H24 M96 20 H118 M60 0 V6 M60 34 V40",
};

export type CinematicShape = keyof typeof SHAPES;

function Silhouette({ shape, color, glow }: { shape: CinematicShape; color: string; glow: string }) {
  if (shape === "jet") {
    return (
      <img
        src={privateJet}
        alt=""
        width={1536}
        height={1024}
        className="h-full w-full object-contain"
        style={{ filter: `drop-shadow(0 20px 35px ${glow}55)` }}
      />
    );
  }

  return (
    <svg viewBox="0 0 120 40" className="h-full w-full overflow-visible">
      <defs>
        <linearGradient id={`hc-${shape}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={glow} />
        </linearGradient>
      </defs>
      <path
        d={SHAPES[shape]}
        fill={`url(#hc-${shape})`}
        stroke={glow}
        strokeWidth="0.6"
        style={{ filter: `drop-shadow(0 6px 18px ${glow}66)` }}
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   Core: scroll-driven 3D flyby + light trail + title wipe
   ══════════════════════════════════════════════════════════ */
export function HeroCinematicFlyby({
  shape,
  color = "#e9edf5",
  glow = "#9fb4d8",
  from = "left",
  altitude = 42,
  size = 34,
  trail = true,
  label,
}: {
  shape: CinematicShape;
  color?: string;
  glow?: string;
  from?: "left" | "right";
  /** vertical position of the flight path, in % of hero height */
  altitude?: number;
  /** object width, in % of hero width */
  size?: number;
  trail?: boolean;
  label?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const dir = from === "left" ? 1 : -1;
  const isJet = shape === "jet";
  const isCar = shape === "car";
  const isBoat = shape === "boat";
  const isPulse = shape === "pulse";
  const isKey = shape === "key";
  const isDiamond = shape === "diamond";
  const isSun = shape === "sun";

  // Direct mapping (no spring) keeps the scene locked to the visitor's finger/wheel.
  // Every object starts visible in the first viewport and completes before the hero exits.
  const x = useTransform(
    p,
    [0, 0.72, 1],
    isJet
      ? ["-18vw", "105vw", "118vw"]
      : isCar
        ? ["62vw", "-42vw", "-55vw"]
        : isBoat
          ? ["-22vw", "72vw", "88vw"]
          : isPulse
            ? ["-8vw", "18vw", "24vw"]
            : isKey
              ? ["58vw", "12vw", "4vw"]
              : isDiamond
                ? ["8vw", "54vw", "68vw"]
                : isSun
                  ? ["58vw", "42vw", "36vw"]
                  : from === "left"
                    ? ["-10vw", "70vw", "86vw"]
                    : ["68vw", "-18vw", "-28vw"],
  );
  const y = useTransform(
    p,
    [0, 0.5, 1],
    isJet ? ["10vh", "-8vh", "-20vh"] : isBoat ? ["10vh", "0vh", "8vh"] : isSun ? ["18vh", "-12vh", "-20vh"] : ["4vh", "-3vh", "-10vh"],
  );
  const rotate = useTransform(
    p,
    [0, 0.5, 1],
    isJet ? [-8, 1, 5] : isCar ? [-2, 1, 0] : isKey ? [-18, 8, 18] : isDiamond ? [-16, 22, 48] : [dir * 8, dir * -3, dir * -10],
  );
  const rotateX = useTransform(p, [0, 0.5, 1], isKey ? [62, 4, -20] : isDiamond ? [32, -12, 24] : [8, 0, -5]);
  const scale = useTransform(
    p,
    [0, 0.48, 1],
    isJet ? [0.74, 1.16, 0.82] : isSun ? [0.72, 1.18, 1.35] : isKey ? [0.82, 1.08, 0.96] : [0.82, 1.06, 0.88],
  );
  const blur = useTransform(p, [0, 0.48, 1], isJet ? ["blur(0px)", "blur(0px)", "blur(5px)"] : ["blur(0px)", "blur(0px)", "blur(2px)"]);
  const opacity = useTransform(p, [0, 0.74, 0.94, 1], [0.96, 1, 0.55, 0]);
  const wipe = useTransform(p, [0, 0.28, 0.64, 0.82], [0.08, 0.52, 0.16, 0]);

  const staticStyle = reduced
    ? { transform: `translate(${dir * -18}%, 6%) rotate(${dir * 6}deg)` }
    : undefined;

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 z-[24] overflow-hidden"
      style={{ perspective: 1200 }}
      aria-hidden
    >
      {/* light wipe that momentarily washes over the headline */}
      {trail && !reduced && (
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: wipe,
            background: `linear-gradient(100deg, transparent 20%, ${glow}2e 48%, transparent 72%)`,
            mixBlendMode: "screen",
          }}
        />
      )}

      {isJet && (
        <motion.div
          className="absolute left-0 top-[42%] h-px w-[70%] origin-left"
          style={{
            scaleX: useTransform(p, [0, 0.5, 0.85], [0.15, 1, 0]),
            opacity: useTransform(p, [0, 0.55, 0.85], [0.5, 0.8, 0]),
            background: `linear-gradient(90deg, transparent, ${glow}bb, transparent)`,
            filter: "blur(1px)",
          }}
        />
      )}

      {isCar && (
        <motion.div
          className="absolute inset-x-0 bottom-[22%] h-px"
          style={{
            opacity: useTransform(p, [0, 0.7, 1], [0.18, 0.7, 0]),
            background: `linear-gradient(90deg, transparent, ${glow}88, transparent)`,
            boxShadow: `0 10px 28px ${glow}55`,
          }}
        />
      )}

      {isKey && (
        <motion.div
          className="absolute right-[12%] top-[18%] h-[48%] w-px"
          style={{ opacity: wipe, background: `linear-gradient(transparent, ${glow}, transparent)` }}
        />
      )}

      <motion.div
        className="absolute"
        style={{
          top: `${altitude}%`,
          left: from === "left" ? "0%" : "auto",
          right: from === "right" ? "0%" : "auto",
          width: isJet ? "min(72vw, 980px)" : `${size}%`,
          aspectRatio: isJet ? "3 / 2" : "3 / 1",
          ...(reduced
            ? staticStyle
            : { x, y, rotate, rotateX, scale, filter: blur, opacity, transformStyle: "preserve-3d" as const }),
        }}
      >
        {trail && !isPulse && !isSun && (
          <div
            className="absolute right-[86%] top-1/2 h-[14%] w-[220%] -translate-y-1/2 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${glow}00 10%, ${glow}66)`,
              filter: "blur(6px)",
            }}
          />
        )}
        <Silhouette shape={shape} color={color} glow={glow} />
        {label && (
          <span
            className="absolute -bottom-6 right-0 whitespace-nowrap text-[10px] uppercase tracking-[0.32em]"
            style={{ color: glow }}
          >
            {label}
          </span>
        )}
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Depth: scroll dolly-zoom + horizon rails behind the hero
   ══════════════════════════════════════════════════════════ */
export function HeroCinematicDepth({ color = "#9fb4d8" }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const z = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [0.55, 0]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden>
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: reduced ? 0.35 : fade,
          translateZ: reduced ? 0 : z,
          backgroundImage: `radial-gradient(60% 40% at 50% 78%, ${color}22, transparent 70%),
            repeating-linear-gradient(90deg, ${color}14 0 1px, transparent 1px 74px)`,
          maskImage: "linear-gradient(180deg, transparent, #000 55%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, #000 55%, transparent)",
        }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Sector presets — one cinematic signature per demo site
   ══════════════════════════════════════════════════════════ */
export const JetFlyby = () => (
  <>
    <HeroCinematicDepth color="#8fb2e0" />
    <HeroCinematicFlyby shape="jet" color="#f3f6fb" glow="#c9a84c" from="left" altitude={18} size={72} label="Empire Private Aviation" />
  </>
);
export const ChauffeurFlyby = () => (
  <>
    <HeroCinematicDepth color="#c9a84c" />
    <HeroCinematicFlyby shape="car" color="#1b1b1b" glow="#c9a84c" from="right" altitude={62} size={42} trail={false} />
  </>
);
export const YachtFlyby = () => (
  <>
    <HeroCinematicDepth color="#3aa8c1" />
    <HeroCinematicFlyby shape="boat" color="#ffffff" glow="#3aa8c1" from="left" altitude={64} size={42} trail={false} />
  </>
);
export const CroissantFlyby = () => (
  <HeroCinematicFlyby shape="croissant" color="#f2d2a0" glow="#c98b45" from="right" altitude={40} size={26} />
);
export const PlateFlyby = () => (
  <HeroCinematicFlyby shape="diamond" color="#ffb672" glow="#ff8a3d" from="left" altitude={38} size={30} />
);
export const DumbbellFlyby = () => (
  <>
    <HeroCinematicDepth color="#c8ff3d" />
    <HeroCinematicFlyby shape="dumbbell" color="#e9ffb0" glow="#c8ff3d" from="right" altitude={52} size={34} />
  </>
);
export const ShearsFlyby = () => (
  <HeroCinematicFlyby shape="scissors" color="#f6dfe6" glow="#d4a24c" from="left" altitude={36} size={30} />
);
export const PulseFlyby = () => (
  <HeroCinematicFlyby shape="pulse" color="#d8fbf7" glow="#4fd1c5" from="left" altitude={46} size={44} trail />
);
export const KeycardFlyby = () => (
  <>
    <HeroCinematicDepth color="#d4b063" />
    <HeroCinematicFlyby shape="key" color="#f7ecd0" glow="#d4b063" from="right" altitude={44} size={32} />
  </>
);
export const BagFlyby = () => (
  <HeroCinematicFlyby shape="bag" color="#f9e9c9" glow="#f2d9a0" from="right" altitude={42} size={26} />
);
export const WrenchFlyby = () => (
  <HeroCinematicFlyby shape="wrench" color="#ffd894" glow="#ffb020" from="left" altitude={50} size={36} />
);
export const DiamondFlyby = () => (
  <>
    <HeroCinematicDepth color="#d4af37" />
    <HeroCinematicFlyby shape="diamond" color="#fff3c4" glow="#d4af37" from="left" altitude={34} size={30} />
  </>
);
export const SunFlyby = () => (
  <HeroCinematicFlyby shape="sun" color="#ffe2ab" glow="#ffc46b" from="right" altitude={26} size={22} trail={false} />
);
