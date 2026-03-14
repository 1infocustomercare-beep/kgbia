import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const smoothEase = [0.22, 1, 0.36, 1] as const;

/**
 * Premium DNA Neural Transition
 * Canvas-based neural mesh that forms a DNA helix, then dissolves.
 * Matches the HeroNeuralCanvas aesthetic (purple + gold nodes/connections).
 */
const DNATransition = ({ onComplete }: { onComplete: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"assemble" | "pulse" | "dissolve">("assemble");
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("pulse"), 1200);
    const t2 = setTimeout(() => setPhase("dissolve"), 2400);
    const t3 = setTimeout(onComplete, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  const startCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
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

    // ═══ NODES: scattered → DNA helix formation ═══
    const NODE_COUNT = w < 640 ? 50 : 80;
    const nodes: {
      x: number; y: number;       // current position (0–1)
      sx: number; sy: number;     // start (random scatter)
      tx: number; ty: number;     // target (DNA helix)
      r: number;
      type: "v" | "g";           // violet or gold
      phase: number;
    }[] = [];

    // Generate DNA helix target positions
    const helixNodes = NODE_COUNT;
    const turns = 3;
    for (let i = 0; i < helixNodes; i++) {
      const t = i / helixNodes;
      const angle = t * Math.PI * 2 * turns;
      const yPos = 0.1 + t * 0.8;
      const amplitude = 0.12 + Math.sin(t * Math.PI) * 0.06;

      // Two strands
      const strand = i % 2 === 0 ? 1 : -1;
      const xPos = 0.5 + Math.sin(angle) * amplitude * strand;

      const isGold = i % 5 === 0;

      nodes.push({
        x: Math.random(),
        y: Math.random(),
        sx: Math.random(),
        sy: Math.random(),
        tx: xPos,
        ty: yPos,
        r: isGold ? 2.5 : (i % 3 === 0 ? 2 : 1.2),
        type: isGold ? "g" : "v",
        phase: t * Math.PI * 6,
      });
    }

    let startTime = performance.now();
    let animId: number;

    const draw = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, w, h);

      const currentPhase = phaseRef.current;

      // ═══ Animation progress ═══
      let assembleProgress: number;
      let dissolveProgress = 0;

      if (currentPhase === "assemble") {
        assembleProgress = Math.min(elapsed / 1.2, 1);
        // Smooth ease out
        assembleProgress = 1 - Math.pow(1 - assembleProgress, 3);
      } else if (currentPhase === "pulse") {
        assembleProgress = 1;
      } else {
        assembleProgress = 1;
        dissolveProgress = Math.min((elapsed - 2.4) / 0.8, 1);
        dissolveProgress = dissolveProgress * dissolveProgress; // ease in
      }

      // ═══ Update node positions ═══
      for (const n of nodes) {
        if (dissolveProgress > 0) {
          // Dissolve: explode outward from center
          const dx = n.tx - 0.5;
          const dy = n.ty - 0.5;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
          n.x = n.tx + dx * dissolveProgress * 3;
          n.y = n.ty + dy * dissolveProgress * 3;
        } else {
          // Assemble: lerp from scatter to helix
          n.x = n.sx + (n.tx - n.sx) * assembleProgress;
          n.y = n.sy + (n.ty - n.sy) * assembleProgress;
        }
      }

      const globalAlpha = dissolveProgress > 0 ? 1 - dissolveProgress : Math.min(elapsed / 0.4, 1);
      ctx.globalAlpha = globalAlpha;

      // ═══ Draw connections ═══
      const maxDist = 0.1 + (1 - assembleProgress) * 0.08;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * (assembleProgress > 0.5 ? 0.18 : 0.08);
            const isGold = nodes[i].type === "g" || nodes[j].type === "g";
            ctx.beginPath();
            ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
            ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
            ctx.strokeStyle = isGold
              ? `hsla(35, 45%, 55%, ${alpha})`
              : `hsla(265, 70%, 60%, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // ═══ Draw DNA bridge lines (when assembled) ═══
      if (assembleProgress > 0.6) {
        const bridgeAlpha = (assembleProgress - 0.6) / 0.4 * 0.12;
        for (let i = 0; i < nodes.length - 1; i += 2) {
          const a = nodes[i];
          const b = nodes[i + 1];
          if (Math.abs(a.ty - b.ty) < 0.03) {
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.strokeStyle = `hsla(265, 60%, 60%, ${bridgeAlpha})`;
            ctx.lineWidth = 0.4;
            ctx.setLineDash([3, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      // ═══ Draw nodes ═══
      for (const n of nodes) {
        const px = n.x * w;
        const py = n.y * h;
        const pulse = n.r + Math.sin(elapsed * 3 + n.phase) * 0.5;

        // Outer glow
        const grad = ctx.createRadialGradient(px, py, 0, px, py, pulse * 4);
        if (n.type === "g") {
          grad.addColorStop(0, "hsla(35, 50%, 55%, 0.15)");
          grad.addColorStop(1, "hsla(35, 50%, 55%, 0)");
        } else {
          grad.addColorStop(0, "hsla(265, 70%, 60%, 0.12)");
          grad.addColorStop(1, "hsla(265, 70%, 60%, 0)");
        }
        ctx.beginPath();
        ctx.arc(px, py, pulse * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(px, py, pulse, 0, Math.PI * 2);
        ctx.fillStyle = n.type === "g"
          ? `hsla(35, 50%, 60%, ${0.6 + Math.sin(elapsed * 2 + n.phase) * 0.2})`
          : `hsla(265, 75%, 65%, ${0.5 + Math.sin(elapsed * 2 + n.phase) * 0.2})`;
        ctx.fill();
      }

      // ═══ Data pulses traveling along helix ═══
      if (assembleProgress > 0.8 && dissolveProgress < 0.5) {
        const pulseCount = 4;
        for (let p = 0; p < pulseCount; p++) {
          const pt = ((elapsed * 0.4 + p / pulseCount) % 1);
          const idx = Math.floor(pt * (nodes.length - 1));
          const node = nodes[idx];
          if (node) {
            const px = node.x * w;
            const py = node.y * h;
            const pulseGrad = ctx.createRadialGradient(px, py, 0, px, py, 8);
            pulseGrad.addColorStop(0, p % 2 === 0 ? "hsla(265, 90%, 70%, 0.8)" : "hsla(38, 60%, 60%, 0.8)");
            pulseGrad.addColorStop(1, "transparent");
            ctx.beginPath();
            ctx.arc(px, py, 8, 0, Math.PI * 2);
            ctx.fillStyle = pulseGrad;
            ctx.fill();
          }
        }
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
      {phase !== "dissolve" || true ? (
        <motion.div
          className="fixed inset-0 z-[9998] overflow-hidden"
          style={{ backgroundColor: "hsl(252, 12%, 14%)" }}
          animate={phase === "dissolve" ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.8, ease: smoothEase }}
          onAnimationComplete={() => {
            if (phase === "dissolve") onComplete();
          }}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* ═══ Vignette overlay ═══ */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,hsla(252,12%,14%,0.6)_80%)] pointer-events-none" />

          {/* ═══ Center status HUD ═══ */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "dissolve" ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center gap-3">
              {/* Scanning ring */}
              <motion.div
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full pointer-events-none relative"
                style={{ border: "1px solid hsla(265,70%,60%,0.1)" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                {/* Scan beam */}
                <motion.div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: "conic-gradient(from 0deg, transparent 0%, hsla(265,85%,65%,0.08) 10%, transparent 20%)",
                  }}
                />
                {/* Inner ring */}
                <motion.div
                  className="absolute inset-3 rounded-full"
                  style={{ border: "1px dashed hsla(38,50%,55%,0.08)" }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>

              {/* Status label */}
              <motion.div
                className="flex items-center gap-2 px-4 py-1.5 rounded-full"
                style={{
                  background: "hsla(265,20%,15%,0.4)",
                  border: "1px solid hsla(265,60%,60%,0.08)",
                  backdropFilter: "blur(8px)",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: phase === "pulse" ? 1 : phase === "assemble" ? 0.6 : 0, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "hsla(140,70%,50%,0.8)" }}
                  animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span
                  className="text-[0.4rem] sm:text-[0.45rem] tracking-[0.3em] uppercase font-mono"
                  style={{ color: "hsla(265,70%,65%,0.35)" }}
                >
                  EMPIRE DNA — NEURAL ASSEMBLY
                </span>
              </motion.div>

              {/* Module indicators */}
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === "pulse" ? 0.7 : 0 }}
                transition={{ duration: 0.4, delay: 1.4 }}
              >
                {["CORE", "AGENTS", "MESH"].map((label, i) => (
                  <div key={label} className="flex items-center gap-1">
                    <motion.div
                      className="w-1 h-1 rounded-full"
                      style={{
                        background: i === 0 ? "hsl(265,85%,65%)" : i === 1 ? "hsl(38,50%,55%)" : "hsl(280,70%,60%)",
                      }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25 }}
                    />
                    <span
                      className="text-[0.35rem] tracking-[0.15em] uppercase font-heading"
                      style={{ color: "hsla(265,70%,65%,0.2)" }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* ═══ Subtle grid ═══ */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.015]"
            style={{
              backgroundImage:
                "linear-gradient(hsla(265,70%,60%,0.5) 1px, transparent 1px), linear-gradient(90deg, hsla(265,70%,60%,0.5) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
              maskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
            }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default DNATransition;
