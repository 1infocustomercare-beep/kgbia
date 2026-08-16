/**
 * ═══ SIGNATURE HERO BACKDROPS — one distinct choreography per sector ═══
 *
 * Each backdrop is scroll-driven (receives the hero `progress` MotionValue)
 * and purely decorative. They intentionally use DIFFERENT geometry, motion
 * language and colour behaviour so no two demo sites look alike:
 *
 *  food      → flame arc sweeping across + ember bloom
 *  bakery    → oven doors splitting open on warm light
 *  beauty    → silk veils wiping vertically
 *  fitness   → diagonal kinetic speed blades
 *  healthcare→ calm dilating rings (breathing)
 *  hotel     → golden theatre curtain rising
 *  beach     → tide line rising with sun glare
 *  retail    → shutter grid tiles flipping open
 *  trades    → blueprint grid drawing itself
 *  luxury    → obsidian monolith rotating in raking light
 *  ncc       → low road light-sweep with horizon streaks
 */
import { motion, type MotionValue, useTransform } from "framer-motion";

const layer = "pointer-events-none absolute inset-0";

export type BackdropProps = { progress: MotionValue<number>; reduced?: boolean };

/* 1) FOOD ─ flame arc + ember bloom */
export function FoodFlameSweep({ progress }: BackdropProps) {
  const x = useTransform(progress, [0, 1], ["-40%", "40%"]);
  const glow = useTransform(progress, [0, 0.5, 1], [0.25, 0.75, 0.35]);
  return (
    <div className={`${layer} overflow-hidden`} aria-hidden>
      <motion.div
        className="absolute -left-1/4 top-1/2 h-[70vh] w-[150vw] -translate-y-1/2 rounded-[50%] blur-3xl"
        style={{
          x,
          opacity: glow,
          background:
            "radial-gradient(50% 50% at 50% 50%, hsl(24 90% 55% / 0.55), hsl(12 85% 40% / 0.18) 55%, transparent 75%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(120%_80%_at_50%_120%,hsl(24_90%_52%/0.22),transparent_65%)]" />
    </div>
  );
}

/* 2) BAKERY ─ oven doors splitting open */
export function BakeryOvenDoors({ progress }: BackdropProps) {
  const left = useTransform(progress, [0, 0.75], ["0%", "-100%"]);
  const right = useTransform(progress, [0, 0.75], ["0%", "100%"]);
  const heat = useTransform(progress, [0, 0.6], [0.2, 0.8]);
  return (
    <div className={`${layer} overflow-hidden`} aria-hidden>
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: heat,
          background:
            "radial-gradient(60% 60% at 50% 60%, hsl(38 92% 62% / 0.42), hsl(28 70% 30% / 0.15) 60%, transparent 78%)",
        }}
      />
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 border-r border-primary/25 bg-[linear-gradient(90deg,hsl(var(--background)),hsl(var(--background)/0.86))]"
        style={{ x: left }}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 border-l border-primary/25 bg-[linear-gradient(270deg,hsl(var(--background)),hsl(var(--background)/0.86))]"
        style={{ x: right }}
      />
    </div>
  );
}

/* 3) BEAUTY ─ silk veils wiping vertically */
function SilkVeil({ progress, index }: BackdropProps & { index: number }) {
  const y = useTransform(progress, [0, 1], [`${-20 - index * 12}%`, `${110 + index * 6}%`]);
  return (
    <motion.div
      className="absolute inset-x-0 h-[45vh] blur-2xl"
      style={{
        y,
        left: `${index * 22 - 6}%`,
        width: "38%",
        background:
          "linear-gradient(180deg, transparent, hsl(320 55% 72% / 0.30), hsl(280 45% 60% / 0.16), transparent)",
      }}
    />
  );
}

export function BeautySilkVeils({ progress }: BackdropProps) {
  return (
    <div className={`${layer} overflow-hidden`} aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <SilkVeil key={i} progress={progress} index={i} />
      ))}
    </div>
  );
}

/* 4) FITNESS ─ diagonal kinetic blades */
export function FitnessKineticBlades({ progress }: BackdropProps) {
  const shift = useTransform(progress, [0, 1], ["-30%", "35%"]);
  const opacity = useTransform(progress, [0, 0.4, 1], [0.35, 0.9, 0.4]);
  return (
    <div className={`${layer} overflow-hidden`} aria-hidden>
      <motion.div
        className="absolute -inset-x-1/3 inset-y-0"
        style={{
          x: shift,
          opacity,
          background:
            "repeating-linear-gradient(115deg, hsl(var(--primary)/0.22) 0 3px, transparent 3px 68px)",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_20%_20%,hsl(var(--primary)/0.16),transparent_65%)]" />
    </div>
  );
}

/* 5) HEALTHCARE ─ calm dilating rings */
function DilationRing({ progress, index }: BackdropProps & { index: number }) {
  const scale = useTransform(progress, [0, 1], [0.5 + index * 0.16, 1.35 + index * 0.24]);
  const opacity = useTransform(progress, [0, 0.6, 1], [0.35 - index * 0.05, 0.28, 0.06]);
  return (
    <motion.span
      className="absolute left-1/2 top-1/2 aspect-square w-[42vw] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40"
      style={{ scale, opacity }}
    />
  );
}

export function HealthcareDilation({ progress }: BackdropProps) {
  return (
    <div className={`${layer} overflow-hidden`} aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <DilationRing key={i} progress={progress} index={i} />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(55%_55%_at_50%_50%,hsl(var(--primary)/0.12),transparent_70%)]" />
    </div>
  );
}

/* 6) HOTEL ─ golden curtain rising */
export function HotelCurtainRise({ progress }: BackdropProps) {
  const y = useTransform(progress, [0, 0.85], ["0%", "-102%"]);
  const shine = useTransform(progress, [0, 0.5, 1], [0.2, 0.6, 0.28]);
  return (
    <div className={`${layer} overflow-hidden`} aria-hidden>
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: shine,
          background:
            "radial-gradient(70% 60% at 50% 85%, hsl(42 80% 60% / 0.35), transparent 70%)",
        }}
      />
      <motion.div
        className="absolute inset-0 border-b border-primary/40"
        style={{
          y,
          background:
            "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--background)/0.92) 70%, hsl(42 70% 55% / 0.25) 100%), repeating-linear-gradient(90deg, hsl(42 60% 50% / 0.10) 0 2px, transparent 2px 26px)",
        }}
      />
    </div>
  );
}

/* 7) BEACH ─ tide rising with sun glare */
export function BeachTideRise({ progress }: BackdropProps) {
  const tide = useTransform(progress, [0, 1], ["78%", "26%"]);
  const sun = useTransform(progress, [0, 1], ["26%", "8%"]);
  return (
    <div className={`${layer} overflow-hidden`} aria-hidden>
      <motion.div
        className="absolute left-1/2 h-[38vh] w-[38vh] -translate-x-1/2 rounded-full blur-2xl"
        style={{
          top: sun,
          background: "radial-gradient(50% 50% at 50% 50%, hsl(42 95% 68% / 0.5), transparent 70%)",
        }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0"
        style={{
          top: tide,
          background:
            "linear-gradient(180deg, hsl(196 70% 55% / 0.35), hsl(205 65% 22% / 0.85)), repeating-linear-gradient(180deg, hsl(0 0% 100% / 0.06) 0 1px, transparent 1px 18px)",
        }}
      />
    </div>
  );
}

/* 8) RETAIL ─ shutter grid tiles flipping open */
function ShutterTile({ progress, index }: BackdropProps & { index: number }) {
  const start = (index % 6) * 0.05 + Math.floor(index / 6) * 0.06;
  const rotateX = useTransform(progress, [start, start + 0.4], [0, -92]);
  const opacity = useTransform(progress, [start, start + 0.4], [1, 0]);
  return (
    <motion.span
      className="border border-border/40 bg-background/85"
      style={{ rotateX, opacity, transformOrigin: "top center" }}
    />
  );
}

export function RetailShutterGrid({ progress }: BackdropProps) {
  return (
    <div className={`${layer} grid grid-cols-6 grid-rows-4 overflow-hidden`} aria-hidden>
      {Array.from({ length: 24 }, (_, i) => (
        <ShutterTile key={i} progress={progress} index={i} />
      ))}
    </div>
  );
}

/* 9) TRADES ─ blueprint grid drawing itself */
export function TradesBlueprintDraw({ progress }: BackdropProps) {
  const dash = useTransform(progress, [0, 0.9], [1, 0]);
  const gridOpacity = useTransform(progress, [0, 0.4], [0.1, 0.4]);
  return (
    <div className={`${layer} overflow-hidden`} aria-hidden>
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: gridOpacity,
          background:
            "repeating-linear-gradient(0deg, hsl(var(--primary)/0.25) 0 1px, transparent 1px 48px), repeating-linear-gradient(90deg, hsl(var(--primary)/0.25) 0 1px, transparent 1px 48px)",
        }}
      />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 60" preserveAspectRatio="none">
        <motion.path
          d="M6 52 L6 20 L28 8 L50 20 L50 52 M50 34 L78 34 L78 12 L94 12"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.5"
          strokeOpacity="0.75"
          pathLength={1}
          style={{ pathOffset: dash }}
        />
      </svg>
    </div>
  );
}

/* 10) LUXURY ─ obsidian monolith rotating in raking light */
export function LuxuryMonolith({ progress }: BackdropProps) {
  const rotate = useTransform(progress, [0, 1], [-18, 22]);
  const scale = useTransform(progress, [0, 1], [0.85, 1.25]);
  const sheen = useTransform(progress, [0, 0.5, 1], ["-30%", "20%", "70%"]);
  return (
    <div className={`${layer} overflow-hidden [perspective:1200px]`} aria-hidden>
      <motion.div
        className="absolute left-1/2 top-1/2 h-[62vh] w-[30vh] -translate-x-1/2 -translate-y-1/2 border border-primary/35"
        style={{
          rotateY: rotate,
          scale,
          background: "linear-gradient(150deg, hsl(0 0% 100% / 0.08), transparent 45%, hsl(var(--primary)/0.16))",
          boxShadow: "0 60px 160px -70px hsl(var(--primary)/0.6)",
        }}
      />
      <motion.div
        className="absolute inset-y-0 w-1/3 blur-2xl"
        style={{
          left: sheen,
          background: "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.12), transparent)",
        }}
      />
    </div>
  );
}

/* 11) NCC ─ low road light sweep */
export function NccRoadSweep({ progress }: BackdropProps) {
  const x = useTransform(progress, [0, 1], ["-60%", "60%"]);
  const horizon = useTransform(progress, [0, 1], [0.25, 0.7]);
  return (
    <div className={`${layer} overflow-hidden`} aria-hidden>
      <motion.div
        className="absolute inset-x-0 bottom-[18%] h-px"
        style={{ opacity: horizon, background: "linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)" }}
      />
      <motion.div
        className="absolute bottom-[8%] h-[22vh] w-[70vw] blur-3xl"
        style={{
          x,
          background: "radial-gradient(50% 50% at 50% 50%, hsl(var(--primary)/0.35), transparent 70%)",
        }}
      />
    </div>
  );
}

export const BACKDROPS = {
  food: FoodFlameSweep,
  bakery: BakeryOvenDoors,
  beauty: BeautySilkVeils,
  fitness: FitnessKineticBlades,
  healthcare: HealthcareDilation,
  hotel: HotelCurtainRise,
  beach: BeachTideRise,
  retail: RetailShutterGrid,
  trades: TradesBlueprintDraw,
  luxury: LuxuryMonolith,
  ncc: NccRoadSweep,
} as const;

export type SignatureVariant = keyof typeof BACKDROPS;
