import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown } from "lucide-react";
import empireAgentMascot from "@/assets/empire-agent-mascot.png";

const smoothEase = [0.22, 1, 0.36, 1] as const;

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

/*
  Unified 5-phase intro:
  1. brand   — Logo, crown, EMPIRE.AI text
  2. dna     — DNA helix assembles from scattered particles
  3. pulse   — Helix pulses, HUD shows status
  4. morph   — DNA converges to center, mascot emerges
  5. exit    — Everything dissolves into the landing page
*/

// Canvas params — lighter on mobile
const HELIX_NODES = IS_MOBILE ? 20 : 42;
const MESH_COUNT = IS_MOBILE ? 10 : 28;
const CELL_COUNT = IS_MOBILE ? 2 : 5;

// Phase timing (ms) — brand shorter, DNA longer for full effect
const TIMINGS = IS_MOBILE
  ? { brand: 0, dna: 1200, pulse: 3200, morph: 4200, exit: 5000, complete: 5600 }
  : { brand: 0, dna: 1400, pulse: 3600, morph: 4800, exit: 5600, complete: 6200 };

// Absolute safety: never block app beyond this
const SAFETY_TIMEOUT = IS_MOBILE ? 7000 : 8000;

type Phase = "brand" | "dna" | "pulse" | "morph" | "exit";

const UnifiedIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<Phase>("brand");
  const phaseRef = useRef<Phase>("brand");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const completedRef = useRef(false);

  const safeComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }, [onComplete]);

  // Phase scheduler
  useEffect(() => {
    const set = (p: Phase) => {
      setPhase(p);
      phaseRef.current = p;
    };

    const timers = [
      setTimeout(() => set("dna"), TIMINGS.dna),
      setTimeout(() => set("pulse"), TIMINGS.pulse),
      setTimeout(() => set("morph"), TIMINGS.morph),
      setTimeout(() => set("exit"), TIMINGS.exit),
      setTimeout(safeComplete, TIMINGS.complete),
      // Safety: force complete no matter what
      setTimeout(safeComplete, SAFETY_TIMEOUT),
    ];
    return () => timers.forEach(clearTimeout);
  }, [safeComplete]);

  // ═══ Canvas animation (DNA helix) — starts at "dna" phase ═══
  const startCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return () => {};
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => {};

    const dpr = IS_MOBILE ? 1 : Math.min(window.devicePixelRatio, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener("resize", resize);

    // Background mesh nodes
    const meshNodes: { x: number; y: number; vx: number; vy: number; r: number; gold: boolean }[] = [];
    for (let i = 0; i < MESH_COUNT; i++) {
      meshNodes.push({
        x: Math.random(), y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0003,
        vy: (Math.random() - 0.5) * 0.0003,
        r: 0.5 + Math.random() * 0.8,
        gold: Math.random() > 0.85,
      });
    }

    // DNA helix nodes
    const turns = 3;
    const helixNodes: {
      sx: number; sy: number; tx: number; ty: number;
      x: number; y: number; r: number; gold: boolean;
      strand: number; baseAngle: number;
    }[] = [];
    for (let i = 0; i < HELIX_NODES; i++) {
      const t = i / HELIX_NODES;
      const angle = t * Math.PI * 2 * turns;
      const yPos = 0.1 + t * 0.8;
      const amp = 0.09 + Math.sin(t * Math.PI) * 0.04;
      const strand = i % 2 === 0 ? 1 : -1;
      const xPos = 0.5 + Math.sin(angle) * amp * strand;
      const isGold = i % 5 === 0;
      helixNodes.push({
        sx: Math.random(), sy: Math.random(),
        tx: xPos, ty: yPos,
        x: Math.random(), y: Math.random(),
        r: isGold ? 1.8 : 0.9,
        gold: isGold,
        strand, baseAngle: angle,
      });
    }

    // Cellular membranes
    const cells: { cx: number; cy: number; radius: number; speed: number; offset: number }[] = [];
    for (let i = 0; i < CELL_COUNT; i++) {
      cells.push({
        cx: 0.15 + Math.random() * 0.7,
        cy: 0.1 + Math.random() * 0.8,
        radius: 25 + Math.random() * 40,
        speed: 0.3 + Math.random() * 0.4,
        offset: Math.random() * Math.PI * 2,
      });
    }

    let animId: number;
    let lastFrame = 0;
    const FRAME_INTERVAL = IS_MOBILE ? 33 : 0; // 30fps on mobile
    const startTime = performance.now();

    const draw = (now: number) => {
      if (IS_MOBILE && now - lastFrame < FRAME_INTERVAL) {
        animId = requestAnimationFrame(draw);
        return;
      }
      lastFrame = now;

      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, w, h);
      const cp = phaseRef.current;

      // Only draw canvas stuff from "dna" phase onward
      if (cp === "brand") {
        animId = requestAnimationFrame(draw);
        return;
      }

      // Calculate progress for each sub-phase
      const dnaStart = TIMINGS.dna / 1000;
      const pulseStart = TIMINGS.pulse / 1000;
      const morphStart = TIMINGS.morph / 1000;
      const exitStart = TIMINGS.exit / 1000;

      let assembleP = 0, morphP = 0, dissolveP = 0;

      if (cp === "dna") {
        assembleP = Math.min((elapsed - dnaStart) / 1.4, 1);
        assembleP = 1 - Math.pow(1 - Math.max(assembleP, 0), 3);
      } else if (cp === "pulse") {
        assembleP = 1;
      } else if (cp === "morph") {
        assembleP = 1;
        morphP = Math.min((elapsed - morphStart) / 1.0, 1);
        morphP = Math.max(morphP, 0) ** 2;
      } else if (cp === "exit") {
        assembleP = 1;
        morphP = 1;
        dissolveP = Math.min((elapsed - exitStart) / 0.8, 1);
        dissolveP = Math.max(dissolveP, 0) ** 2;
      }

      const globalFade = dissolveP > 0 ? 1 - dissolveP : Math.min((elapsed - dnaStart) / 0.4, 1);
      ctx.globalAlpha = Math.max(globalFade, 0);

      // Cellular membranes
      for (const cell of cells) {
        const breathe = Math.sin(elapsed * cell.speed + cell.offset) * 4;
        const r = cell.radius + breathe;
        const cellAlpha = 0.03 * (1 - morphP);
        ctx.beginPath();
        ctx.arc(cell.cx * w, cell.cy * h, r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(265, 60%, 55%, ${cellAlpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Background mesh
      const meshAlpha = 0.04 * (1 - morphP * 0.5);
      for (const n of meshNodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
        ctx.beginPath();
        ctx.arc(n.x * w, n.y * h, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.gold
          ? `hsla(35, 50%, 60%, ${0.1 * (1 - morphP * 0.7)})`
          : `hsla(265, 75%, 65%, ${0.08 * (1 - morphP * 0.7)})`;
        ctx.fill();
      }

      // Mesh connections (limited range)
      const checkRange = IS_MOBILE ? 3 : 6;
      for (let i = 0; i < meshNodes.length; i++) {
        for (let j = i + 1; j < Math.min(i + checkRange, meshNodes.length); j++) {
          const dx = meshNodes[i].x - meshNodes[j].x;
          const dy = meshNodes[i].y - meshNodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.12) {
            const a = (1 - dist / 0.12) * meshAlpha;
            ctx.beginPath();
            ctx.moveTo(meshNodes[i].x * w, meshNodes[i].y * h);
            ctx.lineTo(meshNodes[j].x * w, meshNodes[j].y * h);
            ctx.strokeStyle = `hsla(265, 70%, 60%, ${a})`;
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        }
      }

      // DNA helix — position nodes
      const helixRotation = elapsed * 0.25;
      for (const n of helixNodes) {
        if (morphP > 0) {
          n.x = n.tx + (0.5 - n.tx) * morphP;
          n.y = n.ty + (0.5 - n.ty) * morphP;
        } else {
          const rotatedAngle = n.baseAngle + helixRotation;
          const amp = 0.09 + Math.sin(n.ty * Math.PI) * 0.04;
          const rotTx = 0.5 + Math.sin(rotatedAngle) * amp * n.strand;
          n.x = n.sx + (rotTx - n.sx) * assembleP;
          n.y = n.sy + (n.ty - n.sy) * assembleP;
        }
      }

      // Helix connections
      for (let i = 0; i < helixNodes.length - 1; i++) {
        const a = helixNodes[i], b = helixNodes[i + 1];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.1) {
          const alpha = (1 - dist / 0.1) * (assembleP > 0.5 ? 0.1 : 0.04);
          ctx.beginPath();
          ctx.moveTo(a.x * w, a.y * h);
          ctx.lineTo(b.x * w, b.y * h);
          ctx.strokeStyle = `hsla(265, 70%, 60%, ${alpha})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }

      // Helix dots
      for (const n of helixNodes) {
        ctx.beginPath();
        ctx.arc(n.x * w, n.y * h, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.gold
          ? `hsla(35, 50%, 60%, ${0.5 * (1 - dissolveP)})`
          : `hsla(265, 75%, 65%, ${0.35 * (1 - dissolveP)})`;
        ctx.fill();
      }

      // Morph ring
      if (morphP > 0 && dissolveP < 1) {
        const radius = morphP * Math.max(w, h) * 0.25;
        const ringAlpha = (1 - morphP) * 0.05 * (1 - dissolveP);
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(265, 70%, 60%, ${ringAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Dissolve ripples
      if (dissolveP > 0) {
        const rr = dissolveP * Math.max(w, h) * 0.7;
        const ra = (1 - dissolveP) * 0.12;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, rr, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(265, 80%, 65%, ${ra})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const gr = Math.max(0, dissolveP - 0.12) * Math.max(w, h) * 0.7;
        const ga = Math.max(0, 1 - dissolveP) * 0.08;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, gr, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(38, 50%, 55%, ${ga})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const cleanup = startCanvas();
    return cleanup;
  }, [startCanvas]);

  // Compute cross-fade for brand vs DNA overlay
  const showBrand = phase === "brand" || phase === "dna";
  const showHUD = phase === "dna" || phase === "pulse" || phase === "morph";
  const showMascot = phase === "morph" || phase === "exit";

  return (
    <AnimatePresence>
      {phase !== "exit" || !completedRef.current ? (
        <motion.div
          key="unified-intro"
          className="fixed inset-0 z-[9999] overflow-hidden"
          style={{ backgroundColor: "hsl(260, 20%, 4%)" }}
          animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.8, ease: smoothEase }}
          onAnimationComplete={() => {
            if (phase === "exit") safeComplete();
          }}
        >
          {/* Canvas for DNA helix */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ opacity: phase === "brand" ? 0 : 1, transition: "opacity 0.8s ease" }}
          />

          {/* Ambient glow — CSS only, no blur on mobile */}
          {IS_MOBILE ? (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, hsla(265,85%,65%,0.06) 0%, transparent 70%)" }}
            />
          ) : (
            <motion.div
              className="absolute w-[400px] h-[400px] rounded-full blur-[80px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsla(265,85%,65%,0.08), transparent)" }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {/* Subtle grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.015]"
            style={{
              backgroundImage:
                "linear-gradient(hsla(265,60%,55%,0.5) 1px, transparent 1px), linear-gradient(90deg, hsla(265,60%,55%,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              maskImage: "radial-gradient(ellipse at center, black 15%, transparent 65%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 15%, transparent 65%)",
            }}
          />

          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsla(260,20%,4%,0.75)_80%)] pointer-events-none" />

          {/* Orbital ring */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] sm:w-[380px] sm:h-[380px] rounded-full pointer-events-none"
            style={{ border: "1px solid hsla(265,85%,65%,0.04)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* ═══ BRAND PHASE — Crown logo + EMPIRE.AI ═══ */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{
              opacity: showBrand ? 1 : 0,
              scale: phase === "dna" ? 0.85 : 1,
              y: phase === "dna" ? -30 : 0,
            }}
            transition={{ duration: 1.2, ease: smoothEase }}
          >
            <div className="flex flex-col items-center gap-5">
              {/* Crown container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[22px] sm:rounded-[28px] bg-gradient-to-br from-white/[0.06] to-white/[0.02] flex items-center justify-center border border-white/[0.08] shadow-[0_0_40px_hsla(265,85%,65%,0.1)]">
                  <div
                    className="w-[56px] h-[56px] sm:w-[68px] sm:h-[68px] rounded-[16px] sm:rounded-[20px] flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, hsl(265,85%,65%), hsl(280,80%,60%), hsl(265,85%,55%))" }}
                  >
                    <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
                  </div>
                </div>
              </motion.div>

              {/* Brand text */}
              <motion.div
                className="flex flex-col items-center gap-2.5"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: smoothEase }}
              >
                <h1 className="font-heading font-bold text-2xl sm:text-3xl tracking-[0.25em] uppercase text-foreground">
                  EMPIRE<span className="text-shimmer">.AI</span>
                </h1>
                <motion.div
                  className="h-px rounded-full mx-auto"
                  style={{ background: "linear-gradient(90deg, transparent, hsl(265,85%,65%), hsl(280,80%,60%), transparent)" }}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 140, opacity: 0.5 }}
                  transition={{ duration: 0.6, delay: 0.9, ease: smoothEase }}
                />
                <p className="text-[0.5rem] sm:text-[0.55rem] tracking-[0.5em] uppercase text-foreground/20 font-heading">
                  Il Sistema Operativo del Business
                </p>
              </motion.div>

              {/* Loading bar */}
              <motion.div
                className="w-36 sm:w-48 h-[1.5px] rounded-full overflow-hidden"
                style={{ background: "hsla(265,85%,65%,0.06)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, hsl(265,85%,65%), hsl(280,80%,60%), hsl(265,85%,65%))" }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: TIMINGS.exit / 1000 - 0.5, delay: 0.7, ease: [0.4, 0, 0.2, 1] }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* ═══ HUD — DNA status indicators ═══ */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{
              opacity: showHUD ? 1 : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center mt-40 sm:mt-52">
              {/* Scanning ring — only visible during dna/pulse */}
              <motion.div
                className="w-16 h-16 sm:w-24 sm:h-24 rounded-full absolute -mt-32 sm:-mt-40"
                style={{ border: "0.5px solid hsla(265,60%,60%,0.05)" }}
                animate={{
                  rotate: 360,
                  scale: phase === "morph" ? 2 : 1,
                  opacity: phase === "morph" || phase === "exit" ? 0 : 0.6,
                }}
                transition={{
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 0.8, ease: smoothEase },
                  opacity: { duration: 0.5 },
                }}
              >
                {!IS_MOBILE && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "conic-gradient(from 0deg, transparent 0%, hsla(265,80%,65%,0.05) 8%, transparent 16%)",
                    }}
                  />
                )}
              </motion.div>

              {/* Status pill */}
              <motion.div
                className="flex items-center gap-2 px-3 py-1 rounded-full"
                style={{
                  background: "hsla(252,15%,10%,0.5)",
                  border: "0.5px solid hsla(265,50%,55%,0.06)",
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: phase === "pulse" || phase === "morph" ? 0.8 : phase === "dna" ? 0.3 : 0,
                  y: phase === "morph" ? 20 : 0,
                }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="w-1 h-1 rounded-full animate-pulse" style={{ background: "hsla(140,65%,50%,0.7)" }} />
                <span
                  className="text-[0.35rem] sm:text-[0.4rem] tracking-[0.3em] uppercase font-mono"
                  style={{ color: "hsla(265,55%,65%,0.25)" }}
                >
                  {phase === "morph" ? "AGENT READY" : "NEURAL GENESIS"}
                </span>
              </motion.div>

              {/* Phase dots */}
              <motion.div
                className="flex items-center gap-4 mt-3"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: phase === "pulse" ? 0.5 : phase === "morph" ? 0.7 : 0,
                  y: phase === "morph" ? 20 : 0,
                }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                {["DNA", "AGENTS", "DEPLOY"].map((label, i) => (
                  <div key={label} className="flex items-center gap-1">
                    <div
                      className="w-[3px] h-[3px] rounded-full animate-pulse"
                      style={{
                        background: i === 0 ? "hsl(265,80%,65%)" : i === 1 ? "hsl(38,50%,55%)" : "hsl(170,60%,50%)",
                        animationDelay: `${i * 300}ms`,
                      }}
                    />
                    <span
                      className="text-[0.28rem] sm:text-[0.32rem] tracking-[0.2em] uppercase font-mono"
                      style={{ color: "hsla(265,50%,60%,0.16)" }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* ═══ MASCOT — emerges from DNA morph ═══ */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: showMascot ? 1 : 0,
              scale: showMascot ? 1 : 0.5,
            }}
            transition={{ duration: IS_MOBILE ? 0.5 : 0.8, ease: smoothEase }}
          >
            <div className="relative w-24 h-24 sm:w-36 sm:h-36">
              <div
                className="absolute inset-[-20%] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, hsla(265,70%,60%,0.1) 0%, transparent 60%)" }}
              />
              <img
                src={empireAgentMascot}
                alt="Empire AI Agent"
                className="w-full h-full object-contain relative z-10"
                style={{ filter: "drop-shadow(0 0 16px hsla(265,70%,60%,0.15))" }}
                loading="eager"
                decoding="async"
              />
            </div>
          </motion.div>

          {/* Bottom branding */}
          <motion.div
            className="absolute bottom-5 sm:bottom-8 left-0 right-0 flex justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "exit" ? 0 : 0.4 }}
            transition={{ delay: 1, duration: 0.4 }}
          >
            <p className="text-[0.4rem] sm:text-[0.45rem] tracking-[0.6em] uppercase text-foreground/10 font-heading">
              Powered by Autonomous AI
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default UnifiedIntro;
