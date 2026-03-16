import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * Empire DNA Neural Background — shared across all internal account pages.
 * Tri-color (violet, gold, green) flowing DNA data network.
 * Lightweight: uses SVG with minimal animations on mobile.
 */

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

const EmpireDNABackground = () => {
  const [born, setBorn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBorn(true), 200);
    return () => clearTimeout(t);
  }, []);

  const CELL_COUNT = IS_MOBILE ? 28 : 38;
  const VB_W = IS_MOBILE ? 60 : 100;
  const VB_H = IS_MOBILE ? 130 : 100;

  const cells = useMemo(
    () =>
      Array.from({ length: CELL_COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * VB_W,
        y: Math.random() * VB_H,
        delay: Math.random() * 6,
        colorIdx: i % 3, // 0=violet, 1=gold, 2=green
      })),
    [CELL_COUNT, VB_W, VB_H]
  );

  const connections = useMemo(() => {
    const conns: { a: number; b: number }[] = [];
    const maxDist = 28;
    for (let i = 0; i < cells.length; i++) {
      for (let j = i + 1; j < cells.length; j++) {
        const dx = cells[i].x - cells[j].x;
        const dy = cells[i].y - cells[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist && dist > 5) conns.push({ a: i, b: j });
      }
    }
    return conns;
  }, [cells]);

  // Colors: violet, gold, green
  const lineColors = [
    "hsla(265,80%,65%,0.2)",
    "hsla(38,50%,55%,0.25)",
    "hsla(155,60%,50%,0.18)",
  ];
  const pulseColors = [
    "hsla(265,85%,70%,0.8)",
    "hsla(38,55%,60%,0.85)",
    "hsla(155,65%,55%,0.8)",
  ];
  const nodeColors = [
    "hsla(265,75%,65%,0.3)",
    "hsla(38,50%,55%,0.35)",
    "hsla(155,60%,50%,0.25)",
  ];

  // Limit animated elements on mobile
  const pulseConns = IS_MOBILE
    ? connections.filter((_, i) => i % 5 === 0)
    : connections.filter((_, i) => i % 3 === 0);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: IS_MOBILE ? 0.6 : 0.5 }}
      initial={{ opacity: 0 }}
      animate={born ? { opacity: IS_MOBILE ? 0.6 : 0.5 } : { opacity: 0 }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="dnaPulseGlow">
            <feGaussianBlur stdDeviation="0.3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="dnaCoreBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsla(265,85%,65%,0.04)" />
            <stop offset="40%" stopColor="hsla(38,55%,58%,0.02)" />
            <stop offset="70%" stopColor="hsla(155,65%,50%,0.01)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Central ambient glow */}
        <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#dnaCoreBg)" />

        {/* Connection lines — tri-color based on source node */}
        {connections.map(({ a, b }, i) => {
          const colorIdx = cells[a].colorIdx;
          return IS_MOBILE ? (
            <line
              key={`ln${i}`}
              x1={cells[a].x}
              y1={cells[a].y}
              x2={cells[b].x}
              y2={cells[b].y}
              stroke={lineColors[colorIdx]}
              strokeWidth="0.15"
            />
          ) : (
            <motion.line
              key={`ln${i}`}
              x1={cells[a].x}
              y1={cells[a].y}
              x2={cells[b].x}
              y2={cells[b].y}
              stroke={lineColors[colorIdx]}
              strokeWidth="0.12"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.08, 0.3, 0.08] }}
              transition={{
                duration: 5 + (i % 4) * 2,
                repeat: Infinity,
                delay: i * 0.12,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Traveling data pulses — tri-color */}
        {pulseConns.map(({ a, b }, i) => {
          const colorIdx = cells[a].colorIdx;
          return (
            <motion.circle
              key={`dp${i}`}
              r={IS_MOBILE ? "0.3" : "0.22"}
              fill={pulseColors[colorIdx]}
              filter="url(#dnaPulseGlow)"
              initial={{ cx: cells[a].x, cy: cells[a].y, opacity: 0 }}
              animate={{
                cx: [cells[a].x, cells[b].x],
                cy: [cells[a].y, cells[b].y],
                opacity: [0, 0.85, 0],
              }}
              transition={{
                duration: 2.5 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Junction nodes — tri-color */}
        {cells
          .filter((_, i) => i % 2 === 0)
          .map((cell) => (
            <motion.circle
              key={`nd${cell.id}`}
              cx={cell.x}
              cy={cell.y}
              r={IS_MOBILE ? "0.3" : "0.22"}
              fill={nodeColors[cell.colorIdx]}
              animate={
                IS_MOBILE
                  ? undefined
                  : {
                      r: [0.15, 0.35, 0.15],
                      opacity: [0.2, 0.5, 0.2],
                    }
              }
              transition={
                IS_MOBILE
                  ? undefined
                  : {
                      duration: 3.5,
                      repeat: Infinity,
                      delay: cell.delay,
                      ease: "easeInOut",
                    }
              }
            />
          ))}
      </svg>
    </motion.div>
  );
};

export default EmpireDNABackground;
