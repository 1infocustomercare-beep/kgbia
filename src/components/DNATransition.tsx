import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import empireAgentMascot from "@/assets/empire-agent-mascot.png";

const smoothEase = [0.22, 1, 0.36, 1] as const;

/* ═══ DNA Helix Points ═══ */
const DNA_STRANDS = 24;
const generateHelixPoints = () => {
  const points: { x1: number; y1: number; x2: number; y2: number; delay: number }[] = [];
  for (let i = 0; i < DNA_STRANDS; i++) {
    const t = i / DNA_STRANDS;
    const y = t * 120 - 10;
    const xOffset = Math.sin(t * Math.PI * 3) * 18;
    points.push({
      x1: 50 + xOffset,
      y1: y,
      x2: 50 - xOffset,
      y2: y,
      delay: i * 0.04,
    });
  }
  return points;
};

const helixPoints = generateHelixPoints();

/* ═══ Floating particles ═══ */
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2.5,
  delay: Math.random() * 1.5,
  duration: 2 + Math.random() * 3,
}));

/* ═══ Data stream nodes ═══ */
const DATA_NODES = [
  { label: "AI AGENTS", x: 20, y: 30 },
  { label: "ANALYTICS", x: 80, y: 25 },
  { label: "CRM", x: 15, y: 65 },
  { label: "AUTOMATION", x: 85, y: 70 },
  { label: "COMMERCE", x: 30, y: 85 },
  { label: "OPERATIONS", x: 70, y: 88 },
];

const DNATransition = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"dna" | "morph" | "reveal" | "exit">("dna");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("morph"), 800);
    const t2 = setTimeout(() => setPhase("reveal"), 1800);
    const t3 = setTimeout(() => setPhase("exit"), 2800);
    const t4 = setTimeout(onComplete, 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "hsl(252, 12%, 14%)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: smoothEase }}
        >
          {/* ═══ Background grid ═══ */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(hsla(265,85%,65%,0.6) 1px, transparent 1px), linear-gradient(90deg, hsla(265,85%,65%,0.6) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            }}
          />

          {/* ═══ Ambient glow ═══ */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none"
            style={{ background: "radial-gradient(circle, hsla(265,70%,55%,0.15), hsla(38,50%,55%,0.05), transparent)" }}
            animate={{
              scale: phase === "morph" ? [1, 1.5] : phase === "reveal" ? [1.5, 2] : [1, 1.2, 1],
              opacity: phase === "reveal" ? [0.6, 0] : [0.3, 0.6, 0.3],
            }}
            transition={{ duration: phase === "reveal" ? 1 : 3, ease: "easeInOut" }}
          />

          {/* ═══ DNA HELIX SVG ═══ */}
          <motion.svg
            className="absolute w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
            animate={
              phase === "morph"
                ? { scale: 1.5, opacity: 0.4 }
                : phase === "reveal"
                ? { scale: 3, opacity: 0 }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 1, ease: smoothEase }}
          >
            {/* Strand paths */}
            <motion.path
              d={`M ${helixPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x1} ${p.y1}`).join(" ")}`}
              fill="none"
              stroke="hsla(265,80%,65%,0.4)"
              strokeWidth="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <motion.path
              d={`M ${helixPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x2} ${p.y2}`).join(" ")}`}
              fill="none"
              stroke="hsla(38,50%,55%,0.3)"
              strokeWidth="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.15, ease: "easeOut" }}
            />

            {/* Rungs (bridges) */}
            {helixPoints.filter((_, i) => i % 2 === 0).map((p, i) => (
              <motion.line
                key={`rung-${i}`}
                x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}
                stroke="hsla(265,60%,60%,0.15)"
                strokeWidth="0.15"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.06 }}
              />
            ))}

            {/* Helix nodes */}
            {helixPoints.map((p, i) => (
              <React.Fragment key={`node-${i}`}>
                <motion.circle
                  cx={p.x1} cy={p.y1} r={i % 3 === 0 ? 0.8 : 0.4}
                  fill={i % 2 === 0 ? "hsla(265,85%,65%,0.8)" : "hsla(265,70%,60%,0.5)"}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: p.delay }}
                />
                <motion.circle
                  cx={p.x2} cy={p.y2} r={i % 3 === 0 ? 0.8 : 0.4}
                  fill={i % 2 === 0 ? "hsla(38,50%,55%,0.7)" : "hsla(38,40%,50%,0.4)"}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: p.delay + 0.1 }}
                />
              </React.Fragment>
            ))}

            {/* Data pulses traveling along strands */}
            {[0, 1, 2].map((i) => (
              <React.Fragment key={`pulse-${i}`}>
                <motion.circle
                  r="0.6"
                  fill="hsla(265,90%,70%,0.9)"
                  filter="url(#glow)"
                  initial={{ cx: helixPoints[0].x1, cy: helixPoints[0].y1, opacity: 0 }}
                  animate={{
                    cx: helixPoints.map(p => p.x1),
                    cy: helixPoints.map(p => p.y1),
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{ duration: 2, delay: 0.3 + i * 0.6, ease: "easeInOut" }}
                />
                <motion.circle
                  r="0.6"
                  fill="hsla(38,60%,60%,0.9)"
                  initial={{ cx: helixPoints[0].x2, cy: helixPoints[0].y2, opacity: 0 }}
                  animate={{
                    cx: helixPoints.map(p => p.x2),
                    cy: helixPoints.map(p => p.y2),
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{ duration: 2, delay: 0.5 + i * 0.6, ease: "easeInOut" }}
                />
              </React.Fragment>
            ))}

            {/* SVG filter for glow */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="0.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </motion.svg>

          {/* ═══ Data Nodes — appear in morph phase ═══ */}
          {DATA_NODES.map((node, i) => (
            <motion.div
              key={node.label}
              className="absolute flex items-center gap-1.5 pointer-events-none"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={
                phase === "morph" || phase === "reveal"
                  ? { opacity: phase === "reveal" ? 0 : 0.7, scale: phase === "reveal" ? 2 : 1 }
                  : { opacity: 0, scale: 0 }
              }
              transition={{ duration: 0.5, delay: i * 0.08, ease: smoothEase }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: i % 2 === 0 ? "hsl(265,85%,65%)" : "hsl(38,50%,55%)" }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
              <span className="text-[0.4rem] tracking-[0.2em] uppercase font-mono"
                style={{ color: i % 2 === 0 ? "hsla(265,80%,65%,0.5)" : "hsla(38,50%,55%,0.4)" }}>
                {node.label}
              </span>
            </motion.div>
          ))}

          {/* ═══ Floating particles ═══ */}
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                background: p.id % 3 === 0
                  ? "hsla(265,85%,65%,0.5)"
                  : p.id % 3 === 1
                  ? "hsla(38,50%,55%,0.4)"
                  : "hsla(280,60%,60%,0.3)",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={
                phase === "reveal"
                  ? { opacity: 0, scale: 3, x: (50 - p.x) * 5, y: (50 - p.y) * 5 }
                  : { opacity: [0, 0.8, 0], scale: [0.5, 1.2, 0.5] }
              }
              transition={{
                duration: phase === "reveal" ? 0.8 : p.duration,
                delay: p.delay * 0.3,
                repeat: phase === "reveal" ? 0 : Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* ═══ Center: Mascot morphing from DNA ═══ */}
          <motion.div
            className="relative z-20 flex flex-col items-center gap-4"
            animate={
              phase === "reveal"
                ? { scale: 1.1, y: -20 }
                : phase === "morph"
                ? { scale: 1 }
                : { scale: 0.8 }
            }
            transition={{ duration: 0.8, ease: smoothEase }}
          >
            {/* Agent mascot — fades in during morph */}
            <motion.div
              className="relative w-32 h-32 sm:w-44 sm:h-44"
              initial={{ opacity: 0, scale: 0.3, rotateY: -180 }}
              animate={
                phase === "morph" || phase === "reveal"
                  ? { opacity: 1, scale: 1, rotateY: 0 }
                  : { opacity: 0, scale: 0.3, rotateY: -180 }
              }
              transition={{ duration: 0.9, ease: smoothEase }}
            >
              {/* Glow ring */}
              <motion.div
                className="absolute inset-[-20%] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, hsla(265,70%,60%,0.2), transparent 70%)" }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Orbiting DNA fragments around mascot */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full pointer-events-none"
                  style={{
                    background: i % 2 === 0
                      ? "hsla(265,85%,65%,0.7)"
                      : "hsla(38,50%,55%,0.6)",
                    boxShadow: i % 2 === 0
                      ? "0 0 10px hsla(265,85%,65%,0.4)"
                      : "0 0 10px hsla(38,50%,55%,0.4)",
                    top: "50%",
                    left: "50%",
                  }}
                  animate={{
                    x: Math.cos((i * Math.PI) / 3) * 75,
                    y: Math.sin((i * Math.PI) / 3) * 75,
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    x: { duration: 0.6, delay: 0.5 + i * 0.08, ease: smoothEase },
                    y: { duration: 0.6, delay: 0.5 + i * 0.08, ease: smoothEase },
                    scale: { duration: 2, repeat: Infinity, delay: i * 0.2 },
                  }}
                />
              ))}

              {/* Mascot image */}
              <motion.img
                src={empireAgentMascot}
                alt="Empire AI System"
                className="relative z-10 w-full h-full object-contain"
                style={{ filter: "drop-shadow(0 0 30px hsla(265,70%,60%,0.4))" }}
                animate={
                  phase === "reveal"
                    ? { y: [0, -8, 0], scale: [1, 1.05, 1] }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* ═══ System status text ═══ */}
            <motion.div
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={
                phase === "morph" || phase === "reveal"
                  ? { opacity: phase === "reveal" ? 0 : 1, y: 0 }
                  : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/[0.12] bg-primary/[0.04] backdrop-blur-sm">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "hsla(140,70%,50%,0.8)" }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[0.4rem] sm:text-[0.45rem] tracking-[0.3em] uppercase font-mono" style={{ color: "hsla(265,80%,65%,0.4)" }}>
                  EMPIRE DNA SYSTEM — INITIALIZING AGENTS
                </span>
              </div>

              {/* Progress indicators */}
              <div className="flex items-center gap-3">
                {["Neural Core", "AI Fleet", "Data Mesh"].map((label, i) => (
                  <motion.div key={label} className="flex items-center gap-1">
                    <motion.div
                      className="w-1 h-1 rounded-full"
                      style={{ background: i === 0 ? "hsl(265,85%,65%)" : i === 1 ? "hsl(38,50%,55%)" : "hsl(280,70%,60%)" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                    />
                    <motion.span
                      className="text-[0.35rem] tracking-[0.2em] uppercase font-heading"
                      style={{ color: "hsla(265,80%,65%,0.25)" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.15 }}
                    >
                      {label}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ═══ Expanding rings on reveal ═══ */}
          {phase === "reveal" && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`ring-${i}`}
                  className="absolute w-20 h-20 rounded-full pointer-events-none"
                  style={{ border: `1px solid ${i % 2 === 0 ? "hsla(265,70%,60%,0.3)" : "hsla(38,50%,55%,0.2)"}` }}
                  initial={{ scale: 0, opacity: 0.6 }}
                  animate={{ scale: 15, opacity: 0 }}
                  transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
                />
              ))}
            </>
          )}

          {/* ═══ Vignette ═══ */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsla(252,12%,14%,0.5)_85%)] pointer-events-none" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default DNATransition;
