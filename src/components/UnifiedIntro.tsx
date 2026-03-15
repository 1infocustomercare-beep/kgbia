import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import empireAgentMascot from "@/assets/empire-agent-mascot.png";
// Splash narration removed — voice agent starts only on user interaction

const smoothEase = [0.22, 1, 0.36, 1] as const;

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

/*
  Unified 5-phase intro:
  1. brand   — Logo, crown, EMPIRE.AI text
  2. dna     — DNA helix assembles from scattered particles
  3. pulse   — Helix pulses with energy, HUD shows status
  4. morph   — DNA converges to center ring (matching home page hub)
  5. exit    — Everything dissolves into the landing page
*/

// Canvas params — MORE visible on mobile now
const HELIX_NODES = IS_MOBILE ? 36 : 52;
const MESH_COUNT = IS_MOBILE ? 18 : 35;
const CELL_COUNT = IS_MOBILE ? 4 : 6;
const ENERGY_PARTICLES = IS_MOBILE ? 12 : 24;

// Phase timing (ms)
const TIMINGS = IS_MOBILE
  ? { brand: 0, dna: 600, pulse: 1500, morph: 2200, exit: 2800, complete: 3200 }
  : { brand: 0, dna: 1400, pulse: 3600, morph: 4800, exit: 5600, complete: 6200 };

const SAFETY_TIMEOUT = IS_MOBILE ? 3500 : 8000;

type Phase = "brand" | "dna" | "pulse" | "morph" | "exit";

const UnifiedIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<Phase>("brand");
  const phaseRef = useRef<Phase>("brand");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const completedRef = useRef(false);
  const tappedRef = useRef(false);

  const safeComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }, [onComplete]);

  const handleTap = useCallback(() => {
    if (!IS_MOBILE) {
      safeComplete();
      return;
    }
    if (!tappedRef.current) {
      tappedRef.current = true;
      // No splash narration — skip to complete on second tap
      return;
    }
    safeComplete();
  }, [safeComplete]);

  // Phase scheduler
  useEffect(() => {
    const set = (p: Phase) => {
      setPhase(p);
      phaseRef.current = p;
    };

    const timers = [
      setTimeout(() => { set("dna"); }, TIMINGS.dna),
      setTimeout(() => set("pulse"), TIMINGS.pulse),
      setTimeout(() => set("morph"), TIMINGS.morph),
      setTimeout(() => set("exit"), TIMINGS.exit),
      setTimeout(safeComplete, TIMINGS.complete),
      setTimeout(safeComplete, SAFETY_TIMEOUT),
    ];
    return () => timers.forEach(clearTimeout);
  }, [safeComplete]);

  // ═══ Canvas animation — HIGH IMPACT DNA helix ═══
  const startCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return () => {};
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => {};

    const dpr = IS_MOBILE ? Math.min(window.devicePixelRatio, 2) : Math.min(window.devicePixelRatio, 2);
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
        vx: (Math.random() - 0.5) * 0.0004,
        vy: (Math.random() - 0.5) * 0.0004,
        r: 0.8 + Math.random() * 1.2,
        gold: Math.random() > 0.8,
      });
    }

    // DNA helix nodes — BIGGER, BRIGHTER
    const turns = 3.5;
    const helixNodes: {
      sx: number; sy: number; tx: number; ty: number;
      x: number; y: number; r: number; gold: boolean;
      strand: number; baseAngle: number; glow: boolean;
    }[] = [];
    for (let i = 0; i < HELIX_NODES; i++) {
      const t = i / HELIX_NODES;
      const angle = t * Math.PI * 2 * turns;
      const yPos = 0.08 + t * 0.84;
      const amp = IS_MOBILE ? 0.14 : 0.12;
      const ampVar = amp + Math.sin(t * Math.PI) * 0.06;
      const strand = i % 2 === 0 ? 1 : -1;
      const xPos = 0.5 + Math.sin(angle) * ampVar * strand;
      const isGold = i % 4 === 0;
      const isGlow = i % 6 === 0;
      helixNodes.push({
        sx: Math.random(), sy: Math.random(),
        tx: xPos, ty: yPos,
        x: Math.random(), y: Math.random(),
        r: isGold ? 3 : (IS_MOBILE ? 1.8 : 1.4),
        gold: isGold,
        strand, baseAngle: angle,
        glow: isGlow,
      });
    }

    // Energy particles that travel along the helix
    const energyParticles: { t: number; speed: number; strand: number; hue: number }[] = [];
    for (let i = 0; i < ENERGY_PARTICLES; i++) {
      energyParticles.push({
        t: Math.random(),
        speed: 0.15 + Math.random() * 0.2,
        strand: Math.random() > 0.5 ? 1 : -1,
        hue: Math.random() > 0.3 ? 265 : 38,
      });
    }

    // Cellular membranes
    const cells: { cx: number; cy: number; radius: number; speed: number; offset: number }[] = [];
    for (let i = 0; i < CELL_COUNT; i++) {
      cells.push({
        cx: 0.15 + Math.random() * 0.7,
        cy: 0.1 + Math.random() * 0.8,
        radius: 30 + Math.random() * 50,
        speed: 0.3 + Math.random() * 0.4,
        offset: Math.random() * Math.PI * 2,
      });
    }

    let animId: number;
    let lastFrame = 0;
    const FRAME_INTERVAL = IS_MOBILE ? 25 : 0; // ~40fps on mobile for smoothness
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

      if (cp === "brand") {
        animId = requestAnimationFrame(draw);
        return;
      }

      const dnaStart = TIMINGS.dna / 1000;
      const morphStart = TIMINGS.morph / 1000;
      const exitStart = TIMINGS.exit / 1000;

      let assembleP = 0, morphP = 0, dissolveP = 0;

      if (cp === "dna") {
        assembleP = Math.min((elapsed - dnaStart) / 1.2, 1);
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

      const globalFade = dissolveP > 0 ? 1 - dissolveP : Math.min((elapsed - dnaStart) / 0.3, 1);
      ctx.globalAlpha = Math.max(globalFade, 0);

      // ═══ CENTRAL GLOW — the "core" that becomes the home page circle ═══
      const coreRadius = IS_MOBILE ? 80 : 120;
      const corePulse = 1 + Math.sin(elapsed * 2) * 0.08;
      const coreAlpha = cp === "pulse" ? 0.15 : cp === "morph" ? 0.2 * (1 - dissolveP) : 0.06;
      const coreGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, coreRadius * corePulse);
      coreGrad.addColorStop(0, `hsla(265, 85%, 65%, ${coreAlpha * 1.5})`);
      coreGrad.addColorStop(0.4, `hsla(265, 70%, 55%, ${coreAlpha * 0.8})`);
      coreGrad.addColorStop(0.7, `hsla(280, 60%, 50%, ${coreAlpha * 0.3})`);
      coreGrad.addColorStop(1, `hsla(265, 85%, 65%, 0)`);
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, coreRadius * corePulse, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Core ring (matches home page circle)
      if (assembleP > 0.5) {
        const ringAlpha = Math.min((assembleP - 0.5) * 2, 1) * 0.3 * (1 - dissolveP);
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, coreRadius * 0.6 * corePulse, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(265, 85%, 65%, ${ringAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Second ring
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, coreRadius * 0.85 * corePulse, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(38, 45%, 55%, ${ringAlpha * 0.4})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // ═══ CELLULAR MEMBRANES ═══
      for (const cell of cells) {
        const breathe = Math.sin(elapsed * cell.speed + cell.offset) * 5;
        const r = cell.radius + breathe;
        const cellAlpha = 0.06 * (1 - morphP);
        ctx.beginPath();
        ctx.arc(cell.cx * w, cell.cy * h, r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(265, 60%, 55%, ${cellAlpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Inner membrane
        ctx.beginPath();
        ctx.arc(cell.cx * w, cell.cy * h, r * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(280, 50%, 50%, ${cellAlpha * 0.5})`;
        ctx.lineWidth = 0.3;
        ctx.stroke();
      }

      // ═══ BACKGROUND MESH ═══
      const meshAlpha = 0.08 * (1 - morphP * 0.5);
      for (const n of meshNodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
        ctx.beginPath();
        ctx.arc(n.x * w, n.y * h, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.gold
          ? `hsla(38, 50%, 60%, ${0.2 * (1 - morphP * 0.7)})`
          : `hsla(265, 75%, 65%, ${0.15 * (1 - morphP * 0.7)})`;
        ctx.fill();
      }

      // Mesh connections
      const checkRange = IS_MOBILE ? 4 : 7;
      for (let i = 0; i < meshNodes.length; i++) {
        for (let j = i + 1; j < Math.min(i + checkRange, meshNodes.length); j++) {
          const dx = meshNodes[i].x - meshNodes[j].x;
          const dy = meshNodes[i].y - meshNodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.15) {
            const a = (1 - dist / 0.15) * meshAlpha;
            ctx.beginPath();
            ctx.moveTo(meshNodes[i].x * w, meshNodes[i].y * h);
            ctx.lineTo(meshNodes[j].x * w, meshNodes[j].y * h);
            ctx.strokeStyle = `hsla(265, 70%, 60%, ${a})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // ═══ DNA HELIX — position & render ═══
      const helixRotation = elapsed * 0.35;
      for (const n of helixNodes) {
        if (morphP > 0) {
          // Converge to center ring
          const targetAngle = n.baseAngle + helixRotation;
          const ringR = coreRadius * 0.6 / Math.max(w, h);
          const morphTx = 0.5 + Math.cos(targetAngle) * ringR * morphP + (n.tx - (0.5 + Math.cos(targetAngle) * ringR)) * (1 - morphP);
          const morphTy = 0.5 + Math.sin(targetAngle) * ringR * (h / w) * morphP + (n.ty - (0.5 + Math.sin(targetAngle) * ringR * (h / w))) * (1 - morphP);
          n.x = n.tx + (morphTx - n.tx) * morphP;
          n.y = n.ty + (morphTy - n.ty) * morphP;
        } else {
          const rotatedAngle = n.baseAngle + helixRotation;
          const amp = IS_MOBILE ? 0.14 : 0.12;
          const ampVar = amp + Math.sin(n.ty * Math.PI) * 0.06;
          const rotTx = 0.5 + Math.sin(rotatedAngle) * ampVar * n.strand;
          n.x = n.sx + (rotTx - n.sx) * assembleP;
          n.y = n.sy + (n.ty - n.sy) * assembleP;
        }
      }

      // Helix backbone connections — BRIGHTER
      for (let i = 0; i < helixNodes.length - 1; i++) {
        const a = helixNodes[i], b = helixNodes[i + 1];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.12) {
          const alpha = (1 - dist / 0.12) * (assembleP > 0.5 ? 0.25 : 0.1) * (1 - dissolveP);
          ctx.beginPath();
          ctx.moveTo(a.x * w, a.y * h);
          ctx.lineTo(b.x * w, b.y * h);
          const grad = ctx.createLinearGradient(a.x * w, a.y * h, b.x * w, b.y * h);
          grad.addColorStop(0, `hsla(265, 80%, 65%, ${alpha})`);
          grad.addColorStop(1, `hsla(280, 70%, 60%, ${alpha * 0.8})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = IS_MOBILE ? 1 : 0.8;
          ctx.stroke();
        }
      }

      // Cross-connections (rungs of the DNA ladder)
      for (let i = 0; i < helixNodes.length - 1; i += 2) {
        if (i + 1 < helixNodes.length && helixNodes[i].strand !== helixNodes[i + 1].strand) {
          const a = helixNodes[i], b = helixNodes[i + 1];
          const alpha = 0.08 * assembleP * (1 - morphP) * (1 - dissolveP);
          ctx.beginPath();
          ctx.moveTo(a.x * w, a.y * h);
          ctx.lineTo(b.x * w, b.y * h);
          ctx.strokeStyle = `hsla(38, 45%, 55%, ${alpha})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }

      // Helix dots — MUCH BIGGER AND BRIGHTER
      for (const n of helixNodes) {
        const px = n.x * w, py = n.y * h;

        // Glow halo for key nodes
        if (n.glow && assembleP > 0.3) {
          const glowR = n.r * 4;
          const glowGrad = ctx.createRadialGradient(px, py, 0, px, py, glowR);
          const glowAlpha = 0.15 * (1 - dissolveP);
          glowGrad.addColorStop(0, n.gold ? `hsla(38, 60%, 60%, ${glowAlpha})` : `hsla(265, 85%, 65%, ${glowAlpha})`);
          glowGrad.addColorStop(1, `hsla(265, 85%, 65%, 0)`);
          ctx.beginPath();
          ctx.arc(px, py, glowR, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(px, py, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.gold
          ? `hsla(38, 55%, 60%, ${0.8 * (1 - dissolveP)})`
          : `hsla(265, 80%, 68%, ${0.6 * (1 - dissolveP)})`;
        ctx.fill();

        // Bright center dot
        if (n.r > 1.5) {
          ctx.beginPath();
          ctx.arc(px, py, n.r * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(0, 0%, 100%, ${0.5 * (1 - dissolveP)})`;
          ctx.fill();
        }
      }

      // ═══ ENERGY PARTICLES traveling along helix ═══
      if (assembleP > 0.5 && dissolveP < 0.8) {
        for (const ep of energyParticles) {
          ep.t = (ep.t + ep.speed * 0.016) % 1;
          const angle = ep.t * Math.PI * 2 * turns + helixRotation;
          const amp = IS_MOBILE ? 0.14 : 0.12;
          const ampVar = amp + Math.sin(ep.t * Math.PI) * 0.06;
          const epx = (0.5 + Math.sin(angle) * ampVar * ep.strand) * w;
          const epy = (0.08 + ep.t * 0.84) * h;
          const epAlpha = 0.6 * (1 - dissolveP) * Math.sin(ep.t * Math.PI);

          // Trail
          const trailGrad = ctx.createRadialGradient(epx, epy, 0, epx, epy, IS_MOBILE ? 6 : 8);
          trailGrad.addColorStop(0, `hsla(${ep.hue}, 85%, 70%, ${epAlpha * 0.8})`);
          trailGrad.addColorStop(1, `hsla(${ep.hue}, 85%, 65%, 0)`);
          ctx.beginPath();
          ctx.arc(epx, epy, IS_MOBILE ? 6 : 8, 0, Math.PI * 2);
          ctx.fillStyle = trailGrad;
          ctx.fill();

          // Core particle
          ctx.beginPath();
          ctx.arc(epx, epy, IS_MOBILE ? 1.5 : 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(0, 0%, 100%, ${epAlpha})`;
          ctx.fill();
        }
      }

      // ═══ SCANNING BEAM (vertical sweep) ═══
      if (cp === "pulse" && dissolveP < 0.5) {
        const scanY = (Math.sin(elapsed * 1.5) * 0.5 + 0.5) * h;
        const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
        scanGrad.addColorStop(0, `hsla(265, 85%, 65%, 0)`);
        scanGrad.addColorStop(0.5, `hsla(265, 85%, 65%, 0.06)`);
        scanGrad.addColorStop(1, `hsla(265, 85%, 65%, 0)`);
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanY - 30, w, 60);
      }

      // ═══ MORPH CONVERGENCE RING ═══
      if (morphP > 0 && dissolveP < 1) {
        const radius = coreRadius * 0.6 * morphP;
        const ringAlpha = morphP * 0.4 * (1 - dissolveP);

        // Outer glow
        const morphGlow = ctx.createRadialGradient(w / 2, h / 2, radius - 10, w / 2, h / 2, radius + 20);
        morphGlow.addColorStop(0, `hsla(265, 85%, 65%, ${ringAlpha * 0.3})`);
        morphGlow.addColorStop(1, `hsla(265, 85%, 65%, 0)`);
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, radius + 20, 0, Math.PI * 2);
        ctx.fillStyle = morphGlow;
        ctx.fill();

        // Ring itself
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(265, 85%, 70%, ${ringAlpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner ring (gold accent)
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, radius * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(38, 50%, 58%, ${ringAlpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // ═══ DISSOLVE expanding ripple ═══
      if (dissolveP > 0) {
        const rr = dissolveP * Math.max(w, h) * 0.7;
        const ra = (1 - dissolveP) * 0.2;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, rr, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(265, 85%, 65%, ${ra})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        const gr = Math.max(0, dissolveP - 0.1) * Math.max(w, h) * 0.7;
        const ga = Math.max(0, 1 - dissolveP) * 0.12;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, gr, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(38, 50%, 55%, ${ga})`;
        ctx.lineWidth = 1.5;
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

  const showBrand = phase === "brand" || phase === "dna";
  const showHUD = phase === "dna" || phase === "pulse" || phase === "morph";
  const showMascot = phase === "morph" || phase === "exit";

  if (phase === "exit" && completedRef.current) {
    return null;
  }

  return (
        <motion.div
          key="unified-intro"
          className="fixed inset-0 z-[9999] overflow-hidden"
          style={{
            backgroundColor: "hsl(260, 20%, 4%)",
            willChange: "opacity, transform",
            WebkitTransform: "translate3d(0,0,0)",
            transform: "translate3d(0,0,0)",
          }}
          animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.6, ease: smoothEase }}
          onAnimationComplete={() => {
            if (phase === "exit") safeComplete();
          }}
          onClick={handleTap}
        >
          {/* Canvas for DNA helix */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{
              opacity: phase === "brand" ? 0 : 1,
              transition: "opacity 0.5s ease",
              willChange: "opacity",
              WebkitTransform: "translate3d(0,0,0)",
            }}
          />

          {/* Ambient glow — visible on mobile too */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, hsla(265,85%,65%,0.1) 0%, hsla(280,70%,50%,0.04) 40%, transparent 70%)",
            }}
          />

          {/* Subtle grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(hsla(265,60%,55%,0.6) 1px, transparent 1px), linear-gradient(90deg, hsla(265,60%,55%,0.6) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
              maskImage: "radial-gradient(ellipse at center, black 20%, transparent 60%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 60%)",
            }}
          />

          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,hsla(260,20%,4%,0.8)_75%)] pointer-events-none" />

          {/* Orbital rings */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[380px] sm:h-[380px] rounded-full pointer-events-none"
            style={{ border: "1px solid hsla(265,85%,65%,0.06)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] sm:w-[300px] sm:h-[300px] rounded-full pointer-events-none"
            style={{ border: "1px solid hsla(38,45%,55%,0.04)" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />

          {/* ═══ BRAND PHASE — Crown logo + EMPIRE.AI ═══ */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ willChange: "opacity, transform", WebkitTransform: "translate3d(0,0,0)" }}
            animate={{
              opacity: showBrand ? 1 : 0,
              scale: phase === "dna" ? 0.8 : 1,
              y: phase === "dna" ? -40 : 0,
            }}
            transition={{ duration: 0.8, ease: smoothEase }}
          >
            <div className="flex flex-col items-center gap-5">
              {/* Crown container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[22px] sm:rounded-[28px] bg-gradient-to-br from-white/[0.06] to-white/[0.02] flex items-center justify-center border border-white/[0.08] shadow-[0_0_50px_hsla(265,85%,65%,0.15)]">
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3, ease: smoothEase }}
              >
                <h1 className="font-heading font-bold text-2xl sm:text-3xl tracking-[0.25em] uppercase text-foreground">
                  EMPIRE<span className="text-shimmer">.AI</span>
                </h1>
                <motion.div
                  className="h-px rounded-full mx-auto"
                  style={{ background: "linear-gradient(90deg, transparent, hsl(265,85%,65%), hsl(280,80%,60%), transparent)" }}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 140, opacity: 0.5 }}
                  transition={{ duration: 0.4, delay: 0.5, ease: smoothEase }}
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
                  transition={{ duration: TIMINGS.exit / 1000 - 0.3, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
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
              {/* Scanning ring */}
              <motion.div
                className="w-16 h-16 sm:w-24 sm:h-24 rounded-full absolute -mt-32 sm:-mt-40"
                style={{ border: "0.5px solid hsla(265,60%,60%,0.08)" }}
                animate={{
                  rotate: 360,
                  scale: phase === "morph" ? 2 : 1,
                  opacity: phase === "morph" || phase === "exit" ? 0 : 0.8,
                }}
                transition={{
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 0.8, ease: smoothEase },
                  opacity: { duration: 0.5 },
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "conic-gradient(from 0deg, transparent 0%, hsla(265,80%,65%,0.08) 10%, transparent 20%)",
                  }}
                />
              </motion.div>

              {/* Status pill */}
              <motion.div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: "hsla(252,15%,10%,0.6)",
                  border: "0.5px solid hsla(265,50%,55%,0.1)",
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: phase === "pulse" || phase === "morph" ? 0.9 : phase === "dna" ? 0.4 : 0,
                  y: phase === "morph" ? 20 : 0,
                }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "hsla(140,65%,50%,0.8)" }} />
                <span
                  className="text-[0.4rem] sm:text-[0.45rem] tracking-[0.3em] uppercase font-mono"
                  style={{ color: "hsla(265,60%,70%,0.4)" }}
                >
                  {phase === "morph" ? "AGENT CORE · READY" : "NEURAL GENESIS · ACTIVE"}
                </span>
              </motion.div>

              {/* Phase dots */}
              <motion.div
                className="flex items-center gap-4 mt-3"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: phase === "pulse" ? 0.7 : phase === "morph" ? 0.9 : 0,
                  y: phase === "morph" ? 20 : 0,
                }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                {["DNA", "AGENTS", "DEPLOY"].map((label, i) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div
                      className="w-[4px] h-[4px] rounded-full animate-pulse"
                      style={{
                        background: i === 0 ? "hsl(265,85%,65%)" : i === 1 ? "hsl(38,50%,58%)" : "hsl(170,65%,50%)",
                        animationDelay: `${i * 300}ms`,
                      }}
                    />
                    <span
                      className="text-[0.35rem] sm:text-[0.38rem] tracking-[0.2em] uppercase font-mono"
                      style={{ color: "hsla(265,55%,65%,0.3)" }}
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
            style={{ willChange: "opacity, transform", WebkitTransform: "translate3d(0,0,0)" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: showMascot ? 1 : 0,
              scale: showMascot ? 1 : 0.5,
            }}
            transition={{ duration: IS_MOBILE ? 0.4 : 0.6, ease: smoothEase }}
          >
            <div className="relative w-24 h-24 sm:w-36 sm:h-36">
              <div
                className="absolute inset-[-25%] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, hsla(265,70%,60%,0.15) 0%, transparent 60%)" }}
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

          {/* Tap hint on mobile */}
          {IS_MOBILE && (
            <motion.div
              className="absolute bottom-16 left-0 right-0 flex justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "brand" ? 0.5 : 0.3 }}
              transition={{ delay: 1.5, duration: 0.4 }}
            >
              <p className="text-[0.5rem] tracking-[0.3em] uppercase text-foreground/20 font-mono">
                Tap per continuare
              </p>
            </motion.div>
          )}

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
  );
};

export default UnifiedIntro;
