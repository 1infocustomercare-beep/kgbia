import React, { useState, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import { Crown } from "lucide-react";

const smoothEase = [0.22, 1, 0.36, 1] as const;

// Detect low-power devices
const IS_MOBILE = typeof window !== "undefined" && (
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
  window.innerWidth < 768
);

/* ═══ Neural mesh background — lightweight on mobile ═══ */
const MESH_NODES_DESKTOP = [
  { id: "AI CORE", x: 50, y: 50, size: 14 },
  { id: "CRM", x: 22, y: 28 },
  { id: "ORDINI", x: 78, y: 25 },
  { id: "ANALYTICS", x: 15, y: 65 },
  { id: "PAGAMENTI", x: 82, y: 68 },
  { id: "CATALOGO", x: 35, y: 82 },
  { id: "BOOKING", x: 68, y: 85 },
  { id: "STAFF", x: 28, y: 48 },
  { id: "MARKETING", x: 74, y: 46 },
];

// Mobile: only 5 nodes — much less SVG rendering
const MESH_NODES_MOBILE = [
  { id: "AI CORE", x: 50, y: 50, size: 14 },
  { id: "CRM", x: 25, y: 30 },
  { id: "ORDINI", x: 75, y: 30 },
  { id: "ANALYTICS", x: 25, y: 70 },
  { id: "PAGAMENTI", x: 75, y: 70 },
];

const CONNECTIONS_DESKTOP = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
  [1, 7], [7, 3], [3, 5], [5, 6], [6, 4], [4, 8], [8, 2], [2, 1],
];

const CONNECTIONS_MOBILE = [
  [0, 1], [0, 2], [0, 3], [0, 4],
];

function NeuralMeshBg() {
  const nodes = IS_MOBILE ? MESH_NODES_MOBILE : MESH_NODES_DESKTOP;
  const connections = IS_MOBILE ? CONNECTIONS_MOBILE : CONNECTIONS_DESKTOP;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {/* Connection lines — no animation on mobile */}
        {connections.map(([a, b], i) => (
          IS_MOBILE ? (
            <line
              key={`c${i}`}
              x1={nodes[a].x} y1={nodes[a].y}
              x2={nodes[b].x} y2={nodes[b].y}
              stroke="hsla(265,85%,65%,0.2)"
              strokeWidth="0.2"
            />
          ) : (
            <motion.line
              key={`c${i}`}
              x1={nodes[a].x} y1={nodes[a].y}
              x2={nodes[b].x} y2={nodes[b].y}
              stroke="hsla(265,85%,65%,0.25)"
              strokeWidth="0.2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 + i * 0.06, ease: "easeOut" }}
            />
          )
        ))}
        {/* Data pulses — skip entirely on mobile */}
        {!IS_MOBILE && connections.map(([a, b], i) => {
          const na = nodes[a], nb = nodes[b];
          return (
            <motion.circle
              key={`p${i}`}
              r="0.3"
              fill="hsla(265,85%,70%,0.9)"
              initial={{ cx: na.x, cy: na.y, opacity: 0 }}
              animate={{
                cx: [na.x, nb.x, na.x],
                cy: [na.y, nb.y, na.y],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: 1 + i * 0.25,
                ease: "easeInOut",
              }}
            />
          );
        })}
        {/* Nodes — static on mobile */}
        {nodes.map((node, i) => (
          <g key={node.id}>
            {!IS_MOBILE && (
              <motion.circle
                cx={node.x} cy={node.y} r={node.size ? 3 : 1.8}
                fill="hsla(265,85%,65%,0.15)"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
              />
            )}
            <circle
              cx={node.x} cy={node.y} r={node.size ? 1.2 : 0.6}
              fill={i === 0 ? "hsla(265,85%,65%,0.8)" : "hsla(265,85%,65%,0.45)"}
              stroke="hsla(265,85%,65%,0.3)"
              strokeWidth="0.15"
            />
            {!IS_MOBILE && (
              <text
                x={node.x} y={node.y + (node.size ? 3.5 : 2.5)}
                textAnchor="middle"
                fill="hsla(265,85%,65%,0.35)"
                fontSize="1.1"
                fontFamily="monospace"
                letterSpacing="0.15"
              >
                {node.id}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"build" | "exit">("build");

  useEffect(() => {
    // Give mobile enough time to see the full splash animation
    const exitDelay = IS_MOBILE ? 1600 : 1800;
    const completeDelay = IS_MOBILE ? 2100 : 2400;
    const t1 = setTimeout(() => setPhase("exit"), exitDelay);
    const t2 = setTimeout(onComplete, completeDelay);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "hsl(260, 20%, 4%)" }}
      animate={phase === "exit" ? { opacity: 0, scale: 1.05 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: smoothEase }}
    >
      {/* ═══ Neural Mesh Background ═══ */}
      <NeuralMeshBg />

      {/* Deep space ambient — NO blur on mobile (GPU killer) */}
      {!IS_MOBILE && (
        <>
          <motion.div
            className="absolute rounded-full blur-[80px]"
            style={{ width: 400, height: 400, background: "radial-gradient(circle, hsla(265,85%,65%,0.1), transparent)" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute rounded-full blur-[60px]"
            style={{ width: 250, height: 250, left: "65%", top: "25%", background: "radial-gradient(circle, hsla(265,85%,65%,0.06), transparent)" }}
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* Mobile: simple gradient bg instead of blur */}
      {IS_MOBILE && (
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, hsla(265,85%,65%,0.08) 0%, transparent 70%)" }}
        />
      )}

      {/* Perspective grid floor — lightweight, no animation */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(hsla(265,85%,65%,0.5) 1px, transparent 1px), linear-gradient(90deg, hsla(265,85%,65%,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
        }}
      />

      {/* Scan lines — skip on mobile */}
      {!IS_MOBILE && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, hsla(265,85%,65%,0.01) 3px, hsla(265,85%,65%,0.01) 4px)",
          }}
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,hsla(260,20%,4%,0.7)_80%)]" />

      {/* Orbital rings — only 1 on mobile */}
      <motion.div
        className="absolute w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] rounded-full border border-primary/[0.04] pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      {!IS_MOBILE && (
        <>
          <motion.div
            className="absolute w-[300px] h-[300px] rounded-full border border-accent/[0.06] pointer-events-none"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ border: "1px dashed hsla(265,85%,65%,0.03)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
        </>
      )}

      {/* Center content */}
      <div className="relative flex flex-col items-center gap-6">

        {/* Outer glow ring — simpler on mobile */}
        <div
          className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsla(265,85%,65%,0.1), transparent 70%)" }}
        />

        {/* Logo container */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
        >
          {/* Hexagonal outer shell */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-sm flex items-center justify-center border border-white/[0.08] shadow-[0_0_40px_hsla(265,85%,65%,0.12)]">
            <div
              className="w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-[20px] sm:rounded-[24px] flex items-center justify-center relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, hsl(265,85%,65%), hsl(280,80%,60%), hsl(265,85%,55%))" }}
            >
              {/* Inner shine sweep — CSS only on mobile */}
              {!IS_MOBILE && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(105deg, transparent 40%, hsla(0,0%,100%,0.15) 50%, transparent 60%)" }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1, repeatDelay: 2 }}
                />
              )}
              <Crown className="w-8 h-8 sm:w-9 sm:h-9 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            </div>
          </div>

          {/* Corner accents */}
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-primary/30 rounded-tr-md" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-accent/30 rounded-bl-md" />
        </motion.div>

        {/* Brand text */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: smoothEase }}
        >
          <div className="relative">
            <h1 className="font-heading font-bold text-3xl sm:text-4xl tracking-[0.25em] uppercase text-foreground">
              EMPIRE<span className="text-shimmer">.AI</span>
            </h1>
            {/* Underline accent */}
            <motion.div
              className="h-px mt-2 rounded-full mx-auto"
              style={{ background: "linear-gradient(90deg, transparent, hsl(265,85%,65%), hsl(280,80%,60%), transparent)" }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 0.6 }}
              transition={{ duration: 0.6, delay: 0.8, ease: smoothEase }}
            />
          </div>

          <p
            className="text-[0.55rem] sm:text-[0.6rem] tracking-[0.5em] uppercase text-foreground/20 font-heading"
          >
            Il Sistema Operativo del Business
          </p>
        </motion.div>

        {/* Loading bar */}
        <motion.div
          className="w-40 sm:w-52 h-[1.5px] rounded-full overflow-hidden mt-2"
          style={{ background: "hsla(265,85%,65%,0.06)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, hsl(265,85%,65%), hsl(280,80%,60%), hsl(265,85%,65%))" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: IS_MOBILE ? 1 : 1.8, delay: 0.6, ease: smoothEase }}
          />
        </motion.div>

        {/* Status dots */}
        <motion.div
          className="flex items-center gap-3 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {["Neural Core", "AI Agents", "Systems"].map((label, i) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="w-1 h-1 rounded-full animate-pulse"
                style={{ background: "hsl(265,85%,65%)", animationDelay: `${i * 300}ms` }}
              />
              <span className="text-[0.45rem] sm:text-[0.5rem] tracking-[0.2em] uppercase text-foreground/15 font-heading">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Neural mesh status bar */}
        <motion.div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/[0.08] bg-primary/[0.03]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.4 }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "hsla(140,70%,50%,0.8)" }}
          />
          <span className="text-[0.4rem] sm:text-[0.45rem] tracking-[0.3em] uppercase text-foreground/20 font-mono">
            NEURAL MESH v4.2 — STATUS: OPTIMAL
          </span>
        </motion.div>

        {/* Scanner ring — desktop only */}
        {!IS_MOBILE && (
          <motion.div
            className="absolute -inset-28 rounded-full pointer-events-none"
            style={{
              background: "conic-gradient(from 0deg, transparent 0%, hsla(265,85%,65%,0.06) 8%, transparent 16%)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>

      {/* Bottom branding */}
      <motion.div
        className="absolute bottom-6 sm:bottom-8 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-[0.45rem] sm:text-[0.5rem] tracking-[0.6em] uppercase text-foreground/8 font-heading">
          Powered by Autonomous AI
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
