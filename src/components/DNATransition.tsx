import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import empireAgentMascot from "@/assets/empire-agent-mascot.png";

const smoothEase = [0.22, 1, 0.36, 1] as const;

const IS_MOBILE = typeof window !== "undefined" && (
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
  window.innerWidth < 768
);

// Parametri adattivi: mobile ridotti ma visibili
const MESH_COUNT = IS_MOBILE ? 16 : 35;
const HELIX_NODES_COUNT = IS_MOBILE ? 24 : 48;
const CELL_COUNT = IS_MOBILE ? 3 : 6;
const MESH_CHECK_RANGE = IS_MOBILE ? 4 : 8;

const DNATransition = ({ onComplete }: { onComplete: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"scatter" | "assemble" | "pulse" | "morph" | "dissolve">("scatter");
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    if (IS_MOBILE) {
      // Mobile: give each phase enough time to be visible
      const t1 = setTimeout(() => setPhase("assemble"), 300);
      const t2 = setTimeout(() => setPhase("pulse"), 1000);
      const t3 = setTimeout(() => setPhase("morph"), 1700);
      const t4 = setTimeout(() => setPhase("dissolve"), 2500);
      const t5 = setTimeout(onComplete, 3100);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
    }
    const t1 = setTimeout(() => setPhase("assemble"), 400);
    const t2 = setTimeout(() => setPhase("pulse"), 1400);
    const t3 = setTimeout(() => setPhase("morph"), 2200);
    const t4 = setTimeout(() => setPhase("dissolve"), 3000);
    const t5 = setTimeout(onComplete, 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, [onComplete]);

  const startCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return () => {};
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => {};

    // Mobile: use dpr 1 to save GPU; desktop: up to 2
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

    // ═══ BACKGROUND MESH ═══
    const meshNodes: { x: number; y: number; vx: number; vy: number; r: number; type: "v" | "g" }[] = [];
    for (let i = 0; i < MESH_COUNT; i++) {
      meshNodes.push({
        x: Math.random(), y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0004,
        vy: (Math.random() - 0.5) * 0.0004,
        r: 0.6 + Math.random() * 1,
        type: Math.random() > 0.8 ? "g" : "v",
      });
    }

    // ═══ DNA HELIX NODES ═══
    const helixNodes: {
      x: number; y: number;
      sx: number; sy: number;
      tx: number; ty: number;
      r: number; type: "v" | "g";
      strand: number; phase: number;
      baseAngle: number;
    }[] = [];

    const turns = 3.5;
    for (let i = 0; i < HELIX_NODES_COUNT; i++) {
      const t = i / HELIX_NODES_COUNT;
      const angle = t * Math.PI * 2 * turns;
      const yPos = 0.08 + t * 0.84;
      const amplitude = 0.10 + Math.sin(t * Math.PI) * 0.05;
      const strand = i % 2 === 0 ? 1 : -1;
      const xPos = 0.5 + Math.sin(angle) * amplitude * strand;
      const isGold = i % 6 === 0;

      helixNodes.push({
        x: Math.random(), y: Math.random(),
        sx: Math.random(), sy: Math.random(),
        tx: xPos, ty: yPos,
        r: isGold ? 2 : 1,
        type: isGold ? "g" : "v",
        strand, phase: t * Math.PI * 8,
        baseAngle: angle,
      });
    }

    // ═══ CELLULAR ORGANELLES ═══
    const cells: { cx: number; cy: number; radius: number; speed: number; offset: number }[] = [];
    for (let i = 0; i < CELL_COUNT; i++) {
      cells.push({
        cx: 0.15 + Math.random() * 0.7,
        cy: 0.1 + Math.random() * 0.8,
        radius: 30 + Math.random() * 50,
        speed: 0.3 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
      });
    }

    let startTime = performance.now();
    let animId: number;
    // Mobile: throttle to ~30fps
    let lastFrame = 0;
    const FRAME_INTERVAL = IS_MOBILE ? 33 : 0;

    const draw = (now: number) => {
      if (IS_MOBILE && now - lastFrame < FRAME_INTERVAL) {
        animId = requestAnimationFrame(draw);
        return;
      }
      lastFrame = now;

      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, w, h);
      const currentPhase = phaseRef.current;

      let assembleP = 0, morphP = 0, dissolveP = 0;

      if (currentPhase === "assemble") {
        assembleP = Math.min(elapsed / 1.0, 1);
        assembleP = 1 - Math.pow(1 - Math.max(assembleP, 0), 3);
      } else if (currentPhase === "pulse") {
        assembleP = 1;
      } else if (currentPhase === "morph") {
        assembleP = 1;
        morphP = Math.min((elapsed - (IS_MOBILE ? 1.7 : 2.2)) / 0.8, 1);
        morphP = Math.max(morphP, 0) ** 2;
      } else if (currentPhase === "dissolve") {
        assembleP = 1; morphP = 1;
        dissolveP = Math.min((elapsed - (IS_MOBILE ? 2.5 : 3.0)) / 0.6, 1);
        dissolveP = Math.max(dissolveP, 0) ** 2;
      }

      const globalFade = dissolveP > 0 ? 1 - dissolveP : Math.min(elapsed / 0.3, 1);
      ctx.globalAlpha = globalFade;

      // ═══ CELLULAR MEMBRANES ═══
      for (const cell of cells) {
        const breathe = Math.sin(elapsed * cell.speed + cell.offset) * 5;
        const r = cell.radius + breathe;
        const px = cell.cx * w;
        const py = cell.cy * h;
        const cellAlpha = 0.03 * (1 - morphP);

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(265, 60%, 55%, ${cellAlpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // ═══ BACKGROUND MESH ═══
      for (const n of meshNodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
      }

      const meshAlpha = 0.05 * (1 - morphP * 0.5);
      for (let i = 0; i < meshNodes.length; i++) {
        for (let j = i + 1; j < Math.min(i + MESH_CHECK_RANGE, meshNodes.length); j++) {
          const dx = meshNodes[i].x - meshNodes[j].x;
          const dy = meshNodes[i].y - meshNodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.12) {
            const a = (1 - dist / 0.12) * meshAlpha;
            ctx.beginPath();
            ctx.moveTo(meshNodes[i].x * w, meshNodes[i].y * h);
            ctx.lineTo(meshNodes[j].x * w, meshNodes[j].y * h);
            ctx.strokeStyle = `hsla(265, 70%, 60%, ${a})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      for (const n of meshNodes) {
        const px = n.x * w;
        const py = n.y * h;
        ctx.beginPath();
        ctx.arc(px, py, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.type === "g"
          ? `hsla(35, 50%, 60%, ${0.12 * (1 - morphP * 0.7)})`
          : `hsla(265, 75%, 65%, ${0.1 * (1 - morphP * 0.7)})`;
        ctx.fill();
      }

      // ═══ DNA HELIX ═══
      const helixRotation = elapsed * 0.3;
      for (const n of helixNodes) {
        if (morphP > 0) {
          n.x = n.tx + (0.5 - n.tx) * morphP;
          n.y = n.ty + (0.5 - n.ty) * morphP;
        } else {
          const rotatedAngle = n.baseAngle + helixRotation;
          const amplitude = 0.10 + Math.sin(n.ty * Math.PI) * 0.05;
          const rotatedTx = 0.5 + Math.sin(rotatedAngle) * amplitude * n.strand;
          n.x = n.sx + (rotatedTx - n.sx) * assembleP;
          n.y = n.sy + (n.ty - n.sy) * assembleP;
        }
      }

      // Helix connections — adjacent nodes only
      for (let i = 0; i < helixNodes.length - 1; i++) {
        const a = helixNodes[i], b = helixNodes[i + 1];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.1) {
          const alpha = (1 - dist / 0.1) * (assembleP > 0.5 ? 0.12 : 0.05);
          ctx.beginPath();
          ctx.moveTo(a.x * w, a.y * h);
          ctx.lineTo(b.x * w, b.y * h);
          ctx.strokeStyle = `hsla(265, 70%, 60%, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Helix nodes
      for (const n of helixNodes) {
        const px = n.x * w;
        const py = n.y * h;
        ctx.beginPath();
        ctx.arc(px, py, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.type === "g"
          ? `hsla(35, 50%, 60%, ${0.5 * (1 - dissolveP)})`
          : `hsla(265, 75%, 65%, ${0.4 * (1 - dissolveP)})`;
        ctx.fill();
      }

      // ═══ MORPH ring ═══
      if (morphP > 0 && dissolveP < 1) {
        const radius = morphP * Math.max(w, h) * 0.3;
        const ringAlpha = (1 - morphP) * 0.06 * (1 - dissolveP);
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(265, 70%, 60%, ${ringAlpha})`;
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

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9998] overflow-hidden"
        style={{ backgroundColor: "hsl(252, 12%, 6%)" }}
        animate={phase === "dissolve" ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: IS_MOBILE ? 0.3 : 0.6, ease: smoothEase }}
        onAnimationComplete={() => {
          if (phase === "dissolve") onComplete();
        }}
      >
        {/* Canvas — both desktop and mobile */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,hsla(252,12%,6%,0.7)_75%)] pointer-events-none" />

        {/* Center HUD */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "dissolve" ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center gap-4 relative">
            {/* Scanning ring */}
            <motion.div
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-full relative"
              style={{ border: "0.5px solid hsla(265,60%,60%,0.06)" }}
              animate={{ 
                rotate: 360,
                scale: phase === "morph" ? 1.8 : 1,
                opacity: phase === "morph" || phase === "dissolve" ? 0 : 1,
              }}
              transition={{ 
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.8, ease: smoothEase },
                opacity: { duration: 0.6 },
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, transparent 0%, hsla(265,80%,65%,0.06) 8%, transparent 16%)",
                }}
              />
              <motion.div
                className="absolute inset-4 rounded-full"
                style={{ border: "0.5px solid hsla(38,45%,55%,0.06)" }}
                animate={{ rotate: -360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            {/* Agent mascot — emerges during morph phase */}
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: phase === "morph" || phase === "dissolve" ? 1 : 0,
                scale: phase === "morph" ? 1 : phase === "dissolve" ? 1.05 : 0.5,
              }}
              transition={{ duration: IS_MOBILE ? 0.4 : 0.8, ease: smoothEase }}
            >
              <div className="relative w-24 h-24 sm:w-40 sm:h-40">
                <div className="absolute inset-[-20%] rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, hsla(265,70%,60%,0.12) 0%, transparent 60%)" }}
                />
                <img
                  src={empireAgentMascot}
                  alt="Empire AI Agent"
                  className="w-full h-full object-contain relative z-10"
                  style={{ filter: "drop-shadow(0 0 20px hsla(265,70%,60%,0.2))" }}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </motion.div>

            {/* Status text */}
            <motion.div
              className="flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{
                background: "hsla(252,15%,10%,0.5)",
                border: "0.5px solid hsla(265,50%,55%,0.06)",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ 
                opacity: phase === "pulse" || phase === "morph" ? 0.9 : phase === "assemble" ? 0.4 : 0, 
                y: phase === "morph" ? 70 : 0,
              }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div
                className="w-1 h-1 rounded-full animate-pulse"
                style={{ background: "hsla(140,65%,50%,0.7)" }}
              />
              <span
                className="text-[0.38rem] sm:text-[0.42rem] tracking-[0.3em] uppercase font-mono"
                style={{ color: "hsla(265,55%,65%,0.25)" }}
              >
                {phase === "morph" ? "EMPIRE · AGENT READY" : "EMPIRE · NEURAL GENESIS"}
              </span>
            </motion.div>

            {/* Phase indicators */}
            <motion.div
              className="flex items-center gap-5"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: phase === "pulse" ? 0.6 : phase === "morph" ? 0.8 : 0,
                y: phase === "morph" ? 70 : 0,
              }}
              transition={{ duration: 0.3, delay: IS_MOBILE ? 0.5 : 1.2 }}
            >
              {["DNA", "AGENTS", "DEPLOY"].map((label, i) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div
                    className="w-[3px] h-[3px] rounded-full animate-pulse"
                    style={{
                      background: i === 0 ? "hsl(265,80%,65%)" : i === 1 ? "hsl(38,50%,55%)" : "hsl(170,60%,50%)",
                      animationDelay: `${i * 300}ms`,
                    }}
                  />
                  <span
                    className="text-[0.3rem] sm:text-[0.33rem] tracking-[0.2em] uppercase font-mono"
                    style={{ color: "hsla(265,50%,60%,0.18)" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Subtle tech grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.01]"
          style={{
            backgroundImage:
              "linear-gradient(hsla(265,60%,55%,0.5) 1px, transparent 1px), linear-gradient(90deg, hsla(265,60%,55%,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black 15%, transparent 65%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 15%, transparent 65%)",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default DNATransition;
