import { useRef, useCallback, useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import { createMockupPool } from "@/lib/mockup-pool";

const WAVE_SPRING = { stiffness: 160, damping: 22, mass: 0.6 };
const SCENE_SPRING = { stiffness: 80, damping: 22, mass: 1 };
const Z_SPREAD = 42;
const SIGMA = 2.8;

// Pool privato per StackedPanels — interleaved tra settori (no ripetizioni adiacenti).
const _pool = createMockupPool();
// salta i primi 8 (usati altrove) per ridurre overlap visivo con altre sezioni
_pool.images(8);
const EMPIRE_PANELS: string[] = (() => {
  const arr = _pool.images(22);
  while (arr.length < 22) arr.push("/placeholder.svg");
  return arr;
})();

const PANEL_COUNT = EMPIRE_PANELS.length; // = 22
const PANEL_IMAGES = EMPIRE_PANELS;

const GRADIENT_OVERLAYS = [
  "linear-gradient(135deg, rgba(99,55,255,0.55) 0%, rgba(236,72,153,0.45) 100%)",
  "linear-gradient(135deg, rgba(6,182,212,0.55) 0%, rgba(59,130,246,0.45) 100%)",
  "linear-gradient(135deg, rgba(245,158,11,0.55) 0%, rgba(239,68,68,0.45) 100%)",
  "linear-gradient(135deg, rgba(16,185,129,0.45) 0%, rgba(6,182,212,0.55) 100%)",
  "linear-gradient(135deg, rgba(236,72,153,0.55) 0%, rgba(245,158,11,0.45) 100%)",
  "linear-gradient(135deg, rgba(59,130,246,0.55) 0%, rgba(99,55,255,0.45) 100%)",
  "linear-gradient(135deg, rgba(239,68,68,0.45) 0%, rgba(236,72,153,0.55) 100%)",
  "linear-gradient(135deg, rgba(6,182,212,0.45) 0%, rgba(16,185,129,0.55) 100%)",
  "linear-gradient(135deg, rgba(99,55,255,0.45) 0%, rgba(6,182,212,0.55) 100%)",
  "linear-gradient(135deg, rgba(245,158,11,0.45) 0%, rgba(16,185,129,0.55) 100%)",
  "linear-gradient(135deg, rgba(239,68,68,0.55) 0%, rgba(245,158,11,0.45) 100%)",
  "linear-gradient(135deg, rgba(99,55,255,0.55) 0%, rgba(59,130,246,0.45) 100%)",
  "linear-gradient(135deg, rgba(16,185,129,0.55) 0%, rgba(99,55,255,0.45) 100%)",
  "linear-gradient(135deg, rgba(236,72,153,0.45) 0%, rgba(59,130,246,0.55) 100%)",
  "linear-gradient(135deg, rgba(6,182,212,0.55) 0%, rgba(245,158,11,0.45) 100%)",
  "linear-gradient(135deg, rgba(59,130,246,0.45) 0%, rgba(16,185,129,0.55) 100%)",
  "linear-gradient(135deg, rgba(245,158,11,0.55) 0%, rgba(99,55,255,0.45) 100%)",
  "linear-gradient(135deg, rgba(239,68,68,0.45) 0%, rgba(6,182,212,0.55) 100%)",
  "linear-gradient(135deg, rgba(99,55,255,0.45) 0%, rgba(236,72,153,0.55) 100%)",
  "linear-gradient(135deg, rgba(16,185,129,0.45) 0%, rgba(245,158,11,0.55) 100%)",
  "linear-gradient(135deg, rgba(236,72,153,0.55) 0%, rgba(239,68,68,0.45) 100%)",
  "linear-gradient(135deg, rgba(59,130,246,0.55) 0%, rgba(6,182,212,0.45) 100%)",
];

function Panel({
  index,
  total,
  waveY,
  scaleY,
}: {
  index: number;
  total: number;
  waveY: ReturnType<typeof useSpring>;
  scaleY: ReturnType<typeof useSpring>;
}) {
  const t = index / (total - 1);
  const baseZ = (index - (total - 1)) * Z_SPREAD;

  const w = 200 + t * 80;
  const h = 280 + t * 120;

  const opacity = 0.25 + t * 0.75;
  const imageUrl = PANEL_IMAGES[index % PANEL_IMAGES.length];
  const gradient = GRADIENT_OVERLAYS[index % GRADIENT_OVERLAYS.length];

  return (
    <motion.div
      className="absolute rounded-xl pointer-events-none overflow-hidden"
      style={{
        width: w,
        height: h,
        marginLeft: -w / 2,
        marginTop: -h / 2,
        translateZ: baseZ,
        y: waveY,
        scaleY,
        transformOrigin: "bottom center",
        opacity,
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Aesthetic gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: gradient,
          mixBlendMode: "multiply",
        }}
      />
      {/* Subtle dark vignette for depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.32) 100%)",
        }}
      />
      {/* Border glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          border: `1px solid rgba(255,255,255,${0.08 + t * 0.22})`,
          boxSizing: "border-box",
        }}
      />
    </motion.div>
  );
}

export default function StackedPanels() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);

  const waveYSprings = Array.from({ length: PANEL_COUNT }, () =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSpring(0, WAVE_SPRING)
  );

  const scaleYSprings = Array.from({ length: PANEL_COUNT }, () =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSpring(1, WAVE_SPRING)
  );

  const rotY = useSpring(-42, SCENE_SPRING);
  const rotX = useSpring(18, SCENE_SPRING);

  useEffect(() => {
    const updateFromScroll = () => {
      if (isHovering.current) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const progress = Math.min(Math.max((window.innerHeight * 0.72 - rect.top) / (rect.height + window.innerHeight * 0.6), 0), 1);
      rotY.set(-56 + progress * 34);
      rotX.set(24 - progress * 18);
      const cursorCardPos = progress * (PANEL_COUNT - 1);
      waveYSprings.forEach((spring, i) => {
        const dist = Math.abs(i - cursorCardPos);
        const influence = Math.exp(-(dist * dist) / (2 * SIGMA * SIGMA));
        spring.set(-influence * 78);
      });
      scaleYSprings.forEach((spring, i) => {
        const dist = Math.abs(i - cursorCardPos);
        const influence = Math.exp(-(dist * dist) / (2 * SIGMA * SIGMA));
        spring.set(0.42 + influence * 0.58);
      });
    };
    updateFromScroll();
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("resize", updateFromScroll);
    return () => {
      window.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("resize", updateFromScroll);
    };
  }, [rotY, rotX, waveYSprings, scaleYSprings]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      isHovering.current = true;

      const cx = (e.clientX - rect.left) / rect.width;
      const cy = (e.clientY - rect.top) / rect.height;

      rotY.set(-42 + (cx - 0.5) * 14);
      rotX.set(18 + (cy - 0.5) * -10);

      const cursorCardPos = cx * (PANEL_COUNT - 1);

      waveYSprings.forEach((spring, i) => {
        const dist = Math.abs(i - cursorCardPos);
        const influence = Math.exp(-(dist * dist) / (2 * SIGMA * SIGMA));
        spring.set(-influence * 70);
      });

      scaleYSprings.forEach((spring, i) => {
        const dist = Math.abs(i - cursorCardPos);
        const influence = Math.exp(-(dist * dist) / (2 * SIGMA * SIGMA));
        spring.set(0.35 + influence * 0.65);
      });
    },
    [rotY, rotX, waveYSprings, scaleYSprings]
  );

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
    rotY.set(-42);
    rotX.set(18);
    waveYSprings.forEach((s) => s.set(0));
    scaleYSprings.forEach((s) => s.set(1));
  }, [rotY, rotX, waveYSprings, scaleYSprings]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full flex items-center justify-center select-none"
      style={{ perspective: "900px" }}
    >
      <motion.div
        style={{
          rotateY: rotY,
          rotateX: rotX,
          transformStyle: "preserve-3d",
          position: "relative",
          width: 0,
          height: 0,
        }}
      >
        {Array.from({ length: PANEL_COUNT }).map((_, i) => (
          <Panel
            key={i}
            index={i}
            total={PANEL_COUNT}
            waveY={waveYSprings[i]}
            scaleY={scaleYSprings[i]}
          />
        ))}
      </motion.div>
    </div>
  );
}
