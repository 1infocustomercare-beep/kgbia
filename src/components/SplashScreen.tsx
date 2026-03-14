import React, { useState, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import { Crown } from "lucide-react";

const smoothEase = [0.22, 1, 0.36, 1] as const;

/* ═══ Neural mesh background (like Tech DNA section) ═══ */
const MESH_NODES = [
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

const CONNECTIONS = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
  [1, 7], [7, 3], [3, 5], [5, 6], [6, 4], [4, 8], [8, 2], [2, 1],
];

function NeuralMeshBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {/* Connection lines */}
        {CONNECTIONS.map(([a, b], i) => (
          <motion.line
            key={`c${i}`}
            x1={MESH_NODES[a].x} y1={MESH_NODES[a].y}
            x2={MESH_NODES[b].x} y2={MESH_NODES[b].y}
            stroke="hsla(265,85%,65%,0.25)"
            strokeWidth="0.2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 + i * 0.06, ease: "easeOut" }}
          />
        ))}
        {/* Data pulses along connections */}
        {CONNECTIONS.map(([a, b], i) => {
          const na = MESH_NODES[a], nb = MESH_NODES[b];
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
        {/* Nodes */}
        {MESH_NODES.map((node, i) => (
          <g key={node.id}>
            {/* Glow */}
            <motion.circle
              cx={node.x} cy={node.y} r={node.size ? 3 : 1.8}
              fill="hsla(265,85%,65%,0.15)"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            />
            {/* Dot */}
            <motion.circle
              cx={node.x} cy={node.y} r={node.size ? 1.2 : 0.6}
              fill={i === 0 ? "hsla(265,85%,65%,0.8)" : "hsla(265,85%,65%,0.45)"}
              stroke="hsla(265,85%,65%,0.3)"
              strokeWidth="0.15"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.08, ease: smoothEase }}
            />
            {/* Label */}
            <motion.text
              x={node.x} y={node.y + (node.size ? 3.5 : 2.5)}
              textAnchor="middle"
              fill="hsla(265,85%,65%,0.35)"
              fontSize="1.1"
              fontFamily="monospace"
              letterSpacing="0.15"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              {node.id}
            </motion.text>
          </g>
        ))}
      </svg>
    </div>
  );
}

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"build" | "exit">("build");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("exit"), 2400);
    const t2 = setTimeout(onComplete, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "hsl(260, 20%, 4%)" }}
      animate={phase === "exit" ? { opacity: 0, scale: 1.08 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: smoothEase }}
    >
      {/* ═══ Neural Mesh Background ═══ */}
      <NeuralMeshBg />

      {/* Deep space ambient layers */}
      <motion.div
        className="absolute rounded-full blur-[140px]"
        style={{ width: 500, height: 500, background: "radial-gradient(circle, hsla(265,85%,65%,0.12), hsla(280,80%,60%,0.04), transparent)" }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3], rotate: [0, 180, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full blur-[100px]"
        style={{ width: 300, height: 300, left: "65%", top: "25%", background: "radial-gradient(circle, hsla(265,85%,65%,0.08), transparent)" }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Perspective grid floor */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(hsla(265,85%,65%,0.5) 1px, transparent 1px), linear-gradient(90deg, hsla(265,85%,65%,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
        }}
      />

      {/* Scan lines */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, hsla(265,85%,65%,0.01) 3px, hsla(265,85%,65%,0.01) 4px)",
        }}
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,hsla(260,20%,4%,0.7)_80%)]" />

      {/* Orbital rings */}
      <motion.div
        className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full border border-primary/[0.04] pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] rounded-full border border-accent/[0.06] pointer-events-none"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] rounded-full pointer-events-none"
        style={{ border: "1px dashed hsla(265,85%,65%,0.03)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* Center content */}
      <div className="relative flex flex-col items-center gap-6">

        {/* Outer glow ring */}
        <motion.div
          className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsla(265,85%,65%,0.12), transparent 70%)" }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Logo container */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0, rotateY: -90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: smoothEase }}
        >
          {/* Hexagonal outer shell */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-2xl flex items-center justify-center border border-white/[0.08] shadow-[0_0_60px_hsla(265,85%,65%,0.15),inset_0_1px_0_hsla(0,0%,100%,0.05)]">
            <motion.div
              className="w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-[20px] sm:rounded-[24px] flex items-center justify-center relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, hsl(265,85%,65%), hsl(280,80%,60%), hsl(265,85%,55%))" }}
              animate={{
                boxShadow: [
                  "0 0 30px hsla(265,85%,65%,0.3), 0 0 60px hsla(280,80%,60%,0.1)",
                  "0 0 50px hsla(265,85%,65%,0.5), 0 0 100px hsla(280,80%,60%,0.2)",
                  "0 0 30px hsla(265,85%,65%,0.3), 0 0 60px hsla(280,80%,60%,0.1)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Inner shine sweep */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(105deg, transparent 40%, hsla(0,0%,100%,0.15) 50%, transparent 60%)" }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1, repeatDelay: 2 }}
              />
              {/* Crown icon */}
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ perspective: "600px" }}
              >
                <Crown className="w-8 h-8 sm:w-9 sm:h-9 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]" />
              </motion.div>
            </motion.div>
          </div>

          {/* Corner accents */}
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-primary/30 rounded-tr-md"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          />
          <motion.div
            className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-accent/30 rounded-bl-md"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          />
        </motion.div>

        {/* Brand text */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: smoothEase }}
        >
          <div className="relative">
            <h1 className="font-heading font-bold text-3xl sm:text-4xl tracking-[0.25em] uppercase text-foreground">
              {"EMPIRE".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, y: 20, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + i * 0.08, ease: smoothEase }}
                >
                  {letter}
                </motion.span>
              ))}
              <motion.span
                className="text-shimmer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                .AI
              </motion.span>
            </h1>
            {/* Underline accent */}
            <motion.div
              className="h-px mt-2 rounded-full mx-auto"
              style={{ background: "linear-gradient(90deg, transparent, hsl(265,85%,65%), hsl(280,80%,60%), transparent)" }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 0.6 }}
              transition={{ duration: 0.8, delay: 1.5, ease: smoothEase }}
            />
          </div>

          <motion.p
            className="text-[0.55rem] sm:text-[0.6rem] tracking-[0.5em] uppercase text-foreground/20 font-heading"
            initial={{ opacity: 0, letterSpacing: "0.8em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ duration: 1.2, delay: 1.2 }}
          >
            Il Sistema Operativo del Business
          </motion.p>
        </motion.div>

        {/* Loading bar */}
        <motion.div
          className="w-40 sm:w-52 h-[1.5px] rounded-full overflow-hidden mt-2"
          style={{ background: "hsla(265,85%,65%,0.06)" }}
          initial={{ opacity: 0, scaleX: 0.3 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, hsl(265,85%,65%), hsl(280,80%,60%), hsl(265,85%,65%))" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 1.1, ease: smoothEase }}
          />
        </motion.div>

        {/* Status dots */}
        <motion.div
          className="flex items-center gap-3 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          {["Neural Core", "AI Agents", "Systems"].map((label, i) => (
            <motion.div key={label} className="flex items-center gap-1.5">
              <motion.div
                className="w-1 h-1 rounded-full"
                style={{ background: "hsl(265,85%,65%)" }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              />
              <span className="text-[0.45rem] sm:text-[0.5rem] tracking-[0.2em] uppercase text-foreground/15 font-heading">{label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Neural mesh status bar */}
        <motion.div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/[0.08] bg-primary/[0.03] backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "hsla(140,70%,50%,0.8)" }}
            animate={{ opacity: [0.5, 1, 0.5], boxShadow: ["0 0 4px hsla(140,70%,50%,0.3)", "0 0 8px hsla(140,70%,50%,0.6)", "0 0 4px hsla(140,70%,50%,0.3)"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-[0.4rem] sm:text-[0.45rem] tracking-[0.3em] uppercase text-foreground/20 font-mono">
            NEURAL MESH v4.2 — NODES: 9 — STATUS: OPTIMAL
          </span>
        </motion.div>

        {/* Scanner ring */}
        <motion.div
          className="absolute -inset-24 sm:-inset-28 rounded-full pointer-events-none"
          style={{
            background: "conic-gradient(from 0deg, transparent 0%, hsla(265,85%,65%,0.06) 8%, transparent 16%)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        />
      </div>

      {/* Bottom branding */}
      <motion.div
        className="absolute bottom-6 sm:bottom-8 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <p className="text-[0.45rem] sm:text-[0.5rem] tracking-[0.6em] uppercase text-foreground/8 font-heading">
          Powered by Autonomous AI
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
