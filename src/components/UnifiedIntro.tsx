import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";

const smoothEase = [0.22, 1, 0.36, 1] as const;

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

/*
  Pure DNA Circuit Intro — no brand splash.
  Phases:
  1. scatter  — particles scattered randomly
  2. assemble — DNA double helix forms (gold + violet + green)
  3. pulse    — helix pulses with energy, circuit lines glow
  4. morph    — helix converges into center ring (matches hero rotating circle)
  5. exit     — dissolves seamlessly into the landing page
*/

const HELIX_NODES = IS_MOBILE ? 44 : 64;
const MESH_COUNT = IS_MOBILE ? 22 : 40;
const ENERGY_PARTICLES = IS_MOBILE ? 16 : 30;
const CIRCUIT_LINES = IS_MOBILE ? 8 : 16;

// Timings — brand phase first, then DNA
const TIMINGS = IS_MOBILE
  ? { brand: 0, assemble: 800, pulse: 1600, morph: 2400, exit: 3000, complete: 3400 }
  : { brand: 0, assemble: 1400, pulse: 2800, morph: 3800, exit: 4600, complete: 5200 };

const SAFETY_TIMEOUT = IS_MOBILE ? 4000 : 7000;

type Phase = "brand" | "assemble" | "pulse" | "morph" | "exit";

// Color palette: gold, violet, green
const COLORS = {
  gold: { h: 38, s: 55, l: 58 },
  violet: { h: 265, s: 85, l: 65 },
  green: { h: 155, s: 65, l: 50 },
};

const hsl = (c: typeof COLORS.gold, a: number) => `hsla(${c.h},${c.s}%,${c.l}%,${a})`;

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
      setTimeout(() => set("assemble"), TIMINGS.assemble),
      setTimeout(() => set("pulse"), TIMINGS.pulse),
      setTimeout(() => set("morph"), TIMINGS.morph),
      setTimeout(() => set("exit"), TIMINGS.exit),
      setTimeout(safeComplete, TIMINGS.complete),
      setTimeout(safeComplete, SAFETY_TIMEOUT),
    ];
    return () => timers.forEach(clearTimeout);
  }, [safeComplete]);

  // ═══ Canvas animation — VIVID DNA circuit helix ═══
  const startCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return () => {};
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => {};

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

    // Background mesh nodes
    const meshNodes: { x: number; y: number; vx: number; vy: number; r: number; colorIdx: number }[] = [];
    for (let i = 0; i < MESH_COUNT; i++) {
      meshNodes.push({
        x: Math.random(), y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0005,
        vy: (Math.random() - 0.5) * 0.0005,
        r: 0.8 + Math.random() * 1.5,
        colorIdx: i % 3, // 0=violet, 1=gold, 2=green
      });
    }

    // DNA helix nodes — BIGGER AND BRIGHTER
    const turns = 4;
    const helixNodes: {
      sx: number; sy: number; tx: number; ty: number;
      x: number; y: number; r: number; colorIdx: number;
      strand: number; baseAngle: number; glow: boolean;
    }[] = [];
    for (let i = 0; i < HELIX_NODES; i++) {
      const t = i / HELIX_NODES;
      const angle = t * Math.PI * 2 * turns;
      const yPos = 0.05 + t * 0.9;
      const amp = IS_MOBILE ? 0.16 : 0.14;
      const ampVar = amp + Math.sin(t * Math.PI) * 0.07;
      const strand = i % 2 === 0 ? 1 : -1;
      const xPos = 0.5 + Math.sin(angle) * ampVar * strand;
      const colorIdx = i % 3; // cycle through violet, gold, green
      const isGlow = i % 4 === 0;
      helixNodes.push({
        sx: Math.random(), sy: Math.random(),
        tx: xPos, ty: yPos,
        x: Math.random(), y: Math.random(),
        r: colorIdx === 1 ? 3.5 : (IS_MOBILE ? 2.2 : 1.8),
        colorIdx,
        strand, baseAngle: angle,
        glow: isGlow,
      });
    }

    // Energy particles traveling along helix
    const energyParticles: { t: number; speed: number; strand: number; colorIdx: number }[] = [];
    for (let i = 0; i < ENERGY_PARTICLES; i++) {
      energyParticles.push({
        t: Math.random(),
        speed: 0.12 + Math.random() * 0.18,
        strand: Math.random() > 0.5 ? 1 : -1,
        colorIdx: i % 3,
      });
    }

    // Circuit board lines — futuristic grid
    const circuitLines: { x1: number; y1: number; x2: number; y2: number; colorIdx: number }[] = [];
    for (let i = 0; i < CIRCUIT_LINES; i++) {
      const isHoriz = i % 2 === 0;
      circuitLines.push({
        x1: isHoriz ? 0.05 : (0.1 + Math.random() * 0.8),
        y1: isHoriz ? (0.1 + Math.random() * 0.8) : 0.05,
        x2: isHoriz ? 0.95 : (0.1 + Math.random() * 0.8),
        y2: isHoriz ? (0.1 + Math.random() * 0.8) : 0.95,
        colorIdx: i % 3,
      });
    }

    const colorPalette = [COLORS.violet, COLORS.gold, COLORS.green];

    let animId: number;
    let lastFrame = 0;
    const FRAME_INTERVAL = IS_MOBILE ? 25 : 0;
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

      // Don't draw DNA during brand phase
      if (cp === "brand") {
        animId = requestAnimationFrame(draw);
        return;
      }
      const assembleStart = TIMINGS.assemble / 1000;
      const morphStart = TIMINGS.morph / 1000;
      const exitStart = TIMINGS.exit / 1000;

      let assembleP = 0, morphP = 0, dissolveP = 0;

      if (cp === "assemble") {
        assembleP = Math.min((elapsed - assembleStart) / 1.2, 1);
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

      const globalFade = dissolveP > 0 ? 1 - dissolveP : Math.min(elapsed / 0.4, 1);
      ctx.globalAlpha = Math.max(globalFade, 0);

      // ═══ CIRCUIT BOARD LINES — futuristic background ═══
      if (assembleP > 0.2) {
        const circuitAlpha = Math.min((assembleP - 0.2) * 1.5, 1) * 0.04 * (1 - morphP * 0.8);
        for (const cl of circuitLines) {
          const c = colorPalette[cl.colorIdx];
          ctx.beginPath();
          ctx.moveTo(cl.x1 * w, cl.y1 * h);
          ctx.lineTo(cl.x2 * w, cl.y2 * h);
          ctx.strokeStyle = hsl(c, circuitAlpha);
          ctx.lineWidth = 0.5;
          ctx.stroke();

          // Circuit junction dots
          ctx.beginPath();
          ctx.arc(cl.x1 * w, cl.y1 * h, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = hsl(c, circuitAlpha * 3);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(cl.x2 * w, cl.y2 * h, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = hsl(c, circuitAlpha * 3);
          ctx.fill();
        }
      }

      // ═══ CENTRAL GLOW — the "core" that becomes the hero circle ═══
      const coreRadius = IS_MOBILE ? 85 : 130;
      const corePulse = 1 + Math.sin(elapsed * 2.5) * 0.1;
      const coreAlpha = cp === "pulse" ? 0.2 : cp === "morph" ? 0.3 * (1 - dissolveP) : 0.08;

      // Triple-color core glow
      const coreGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, coreRadius * corePulse);
      coreGrad.addColorStop(0, hsl(COLORS.violet, coreAlpha * 1.5));
      coreGrad.addColorStop(0.3, hsl(COLORS.gold, coreAlpha * 0.8));
      coreGrad.addColorStop(0.6, hsl(COLORS.green, coreAlpha * 0.5));
      coreGrad.addColorStop(1, `hsla(265,85%,65%,0)`);
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, coreRadius * corePulse, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Core rings (matching hero rotating circles)
      if (assembleP > 0.4) {
        const ringAlpha = Math.min((assembleP - 0.4) * 2, 1) * 0.4 * (1 - dissolveP);

        // Violet ring
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, coreRadius * 0.55 * corePulse, 0, Math.PI * 2);
        ctx.strokeStyle = hsl(COLORS.violet, ringAlpha);
        ctx.lineWidth = 2;
        ctx.stroke();

        // Gold ring
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, coreRadius * 0.75 * corePulse, 0, Math.PI * 2);
        ctx.strokeStyle = hsl(COLORS.gold, ringAlpha * 0.6);
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Green ring (outer)
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, coreRadius * 0.95 * corePulse, 0, Math.PI * 2);
        ctx.strokeStyle = hsl(COLORS.green, ringAlpha * 0.3);
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // ═══ BACKGROUND MESH ═══
      const meshAlpha = 0.1 * (1 - morphP * 0.5);
      for (const n of meshNodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
        const c = colorPalette[n.colorIdx];
        ctx.beginPath();
        ctx.arc(n.x * w, n.y * h, n.r, 0, Math.PI * 2);
        ctx.fillStyle = hsl(c, 0.2 * (1 - morphP * 0.7));
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
            const c = colorPalette[meshNodes[i].colorIdx];
            ctx.beginPath();
            ctx.moveTo(meshNodes[i].x * w, meshNodes[i].y * h);
            ctx.lineTo(meshNodes[j].x * w, meshNodes[j].y * h);
            ctx.strokeStyle = hsl(c, a);
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // ═══ DNA HELIX — position & render ═══
      const helixRotation = elapsed * 0.4;
      for (const n of helixNodes) {
        if (morphP > 0) {
          // Converge to center ring
          const targetAngle = n.baseAngle + helixRotation;
          const ringR = coreRadius * 0.55 / Math.max(w, h);
          const morphTx = 0.5 + Math.cos(targetAngle) * ringR * morphP + (n.tx - (0.5 + Math.cos(targetAngle) * ringR)) * (1 - morphP);
          const morphTy = 0.5 + Math.sin(targetAngle) * ringR * (h / w) * morphP + (n.ty - (0.5 + Math.sin(targetAngle) * ringR * (h / w))) * (1 - morphP);
          n.x = n.tx + (morphTx - n.tx) * morphP;
          n.y = n.ty + (morphTy - n.ty) * morphP;
        } else {
          const rotatedAngle = n.baseAngle + helixRotation;
          const amp = IS_MOBILE ? 0.16 : 0.14;
          const ampVar = amp + Math.sin(n.ty * Math.PI) * 0.07;
          const rotTx = 0.5 + Math.sin(rotatedAngle) * ampVar * n.strand;
          n.x = n.sx + (rotTx - n.sx) * assembleP;
          n.y = n.sy + (n.ty - n.sy) * assembleP;
        }
      }

      // Helix backbone connections — colored strands
      for (let i = 0; i < helixNodes.length - 1; i++) {
        const a = helixNodes[i], b = helixNodes[i + 1];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.12) {
          const alpha = (1 - dist / 0.12) * (assembleP > 0.5 ? 0.35 : 0.12) * (1 - dissolveP);
          const c = colorPalette[a.colorIdx];
          ctx.beginPath();
          ctx.moveTo(a.x * w, a.y * h);
          ctx.lineTo(b.x * w, b.y * h);
          ctx.strokeStyle = hsl(c, alpha);
          ctx.lineWidth = IS_MOBILE ? 1.2 : 1;
          ctx.stroke();
        }
      }

      // Cross-connections (rungs of DNA ladder) — alternating colors
      for (let i = 0; i < helixNodes.length - 1; i += 2) {
        if (i + 1 < helixNodes.length && helixNodes[i].strand !== helixNodes[i + 1].strand) {
          const a = helixNodes[i], b = helixNodes[i + 1];
          const alpha = 0.12 * assembleP * (1 - morphP) * (1 - dissolveP);
          const c = colorPalette[(i / 2) % 3];
          ctx.beginPath();
          ctx.moveTo(a.x * w, a.y * h);
          ctx.lineTo(b.x * w, b.y * h);
          ctx.strokeStyle = hsl(c, alpha);
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Helix dots — MUCH BIGGER AND BRIGHTER with glow
      for (const n of helixNodes) {
        const px = n.x * w, py = n.y * h;
        const c = colorPalette[n.colorIdx];

        // Glow halo for key nodes
        if (n.glow && assembleP > 0.3) {
          const glowR = n.r * 5;
          const glowGrad = ctx.createRadialGradient(px, py, 0, px, py, glowR);
          const glowAlpha = 0.2 * (1 - dissolveP);
          glowGrad.addColorStop(0, hsl(c, glowAlpha));
          glowGrad.addColorStop(1, hsl(c, 0));
          ctx.beginPath();
          ctx.arc(px, py, glowR, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(px, py, n.r, 0, Math.PI * 2);
        ctx.fillStyle = hsl(c, 0.85 * (1 - dissolveP));
        ctx.fill();

        // White center dot for larger nodes
        if (n.r > 2) {
          ctx.beginPath();
          ctx.arc(px, py, n.r * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(0,0%,100%,${0.6 * (1 - dissolveP)})`;
          ctx.fill();
        }
      }

      // ═══ ENERGY PARTICLES traveling along helix ═══
      if (assembleP > 0.5 && dissolveP < 0.8) {
        for (const ep of energyParticles) {
          ep.t = (ep.t + ep.speed * 0.016) % 1;
          const angle = ep.t * Math.PI * 2 * turns + helixRotation;
          const amp = IS_MOBILE ? 0.16 : 0.14;
          const ampVar = amp + Math.sin(ep.t * Math.PI) * 0.07;
          const epx = (0.5 + Math.sin(angle) * ampVar * ep.strand) * w;
          const epy = (0.05 + ep.t * 0.9) * h;
          const epAlpha = 0.7 * (1 - dissolveP) * Math.sin(ep.t * Math.PI);
          const c = colorPalette[ep.colorIdx];

          // Trail glow
          const trailGrad = ctx.createRadialGradient(epx, epy, 0, epx, epy, IS_MOBILE ? 8 : 10);
          trailGrad.addColorStop(0, hsl(c, epAlpha * 0.9));
          trailGrad.addColorStop(1, hsl(c, 0));
          ctx.beginPath();
          ctx.arc(epx, epy, IS_MOBILE ? 8 : 10, 0, Math.PI * 2);
          ctx.fillStyle = trailGrad;
          ctx.fill();

          // Core particle
          ctx.beginPath();
          ctx.arc(epx, epy, IS_MOBILE ? 2 : 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(0,0%,100%,${epAlpha})`;
          ctx.fill();
        }
      }

      // ═══ SCANNING BEAM (vertical sweep) ═══
      if (cp === "pulse" && dissolveP < 0.5) {
        const scanY = (Math.sin(elapsed * 1.8) * 0.5 + 0.5) * h;
        const scanGrad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
        scanGrad.addColorStop(0, hsl(COLORS.green, 0));
        scanGrad.addColorStop(0.5, hsl(COLORS.green, 0.08));
        scanGrad.addColorStop(1, hsl(COLORS.green, 0));
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanY - 40, w, 80);
      }

      // ═══ MORPH CONVERGENCE RING — matches hero rotating circle ═══
      if (morphP > 0 && dissolveP < 1) {
        const radius = coreRadius * 0.55 * morphP;
        const ringAlpha = morphP * 0.5 * (1 - dissolveP);

        // Outer glow — tri-color
        const morphGlow = ctx.createRadialGradient(w / 2, h / 2, radius - 15, w / 2, h / 2, radius + 30);
        morphGlow.addColorStop(0, hsl(COLORS.violet, ringAlpha * 0.4));
        morphGlow.addColorStop(0.5, hsl(COLORS.gold, ringAlpha * 0.2));
        morphGlow.addColorStop(1, hsl(COLORS.green, 0));
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, radius + 30, 0, Math.PI * 2);
        ctx.fillStyle = morphGlow;
        ctx.fill();

        // Ring — violet
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
        ctx.strokeStyle = hsl(COLORS.violet, ringAlpha);
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Inner ring — gold
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, radius * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = hsl(COLORS.gold, ringAlpha * 0.6);
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Innermost — green
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, radius * 0.4, 0, Math.PI * 2);
        ctx.strokeStyle = hsl(COLORS.green, ringAlpha * 0.35);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // ═══ DISSOLVE expanding ripple ═══
      if (dissolveP > 0) {
        // Violet ripple
        const rr = dissolveP * Math.max(w, h) * 0.7;
        const ra = (1 - dissolveP) * 0.2;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, rr, 0, Math.PI * 2);
        ctx.strokeStyle = hsl(COLORS.violet, ra);
        ctx.lineWidth = 2;
        ctx.stroke();

        // Gold ripple (delayed)
        const gr = Math.max(0, dissolveP - 0.1) * Math.max(w, h) * 0.7;
        const ga = Math.max(0, 1 - dissolveP) * 0.15;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, gr, 0, Math.PI * 2);
        ctx.strokeStyle = hsl(COLORS.gold, ga);
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Green ripple (more delayed)
        const gnr = Math.max(0, dissolveP - 0.2) * Math.max(w, h) * 0.7;
        const gna = Math.max(0, 1 - dissolveP) * 0.1;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, gnr, 0, Math.PI * 2);
        ctx.strokeStyle = hsl(COLORS.green, gna);
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
          willChange: "opacity",
          WebkitTransform: "translate3d(0,0,0)",
        }}
      />

      {/* Ambient tri-color glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, hsla(265,85%,65%,0.12) 0%, hsla(38,55%,58%,0.05) 30%, hsla(155,65%,50%,0.03) 50%, transparent 70%)",
        }}
      />

      {/* Subtle circuit grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsla(155,65%,50%,0.5) 1px, transparent 1px), linear-gradient(90deg, hsla(265,60%,55%,0.5) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 65%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 65%)",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,hsla(260,20%,4%,0.8)_75%)] pointer-events-none" />

      {/* Orbital rings — tri-color */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[380px] sm:h-[380px] rounded-full pointer-events-none"
        style={{ border: "1px solid hsla(265,85%,65%,0.08)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] sm:w-[300px] sm:h-[300px] rounded-full pointer-events-none"
        style={{ border: "1px solid hsla(38,55%,58%,0.06)" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] sm:w-[220px] sm:h-[220px] rounded-full pointer-events-none"
        style={{ border: "1px solid hsla(155,65%,50%,0.04)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />

      {/* ═══ HUD Status — minimal, no brand ═══ */}
      <motion.div
        className="absolute inset-0 flex items-end justify-center pb-20 sm:pb-24 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "brand" ? 0 : phase === "exit" ? 0 : 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex flex-col items-center gap-3">
          {/* Phase dots — tri-color */}
          <motion.div
            className="flex items-center gap-5"
            initial={{ opacity: 0 }}
            animate={{
              opacity: phase === "pulse" || phase === "morph" ? 0.8 : phase === "assemble" ? 0.4 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            {[
              { label: "DNA", color: "hsl(265,85%,65%)" },
              { label: "CIRCUIT", color: "hsl(38,55%,58%)" },
              { label: "DEPLOY", color: "hsl(155,65%,50%)" },
            ].map(({ label, color }, i) => (
              <div key={label} className="flex items-center gap-1.5">
                <div
                  className="w-[4px] h-[4px] rounded-full animate-pulse"
                  style={{ background: color, animationDelay: `${i * 300}ms` }}
                />
                <span
                  className="text-[0.35rem] sm:text-[0.4rem] tracking-[0.2em] uppercase font-mono"
                  style={{ color: "hsla(265,55%,65%,0.3)" }}
                >
                  {label}
                </span>
              </div>
            ))}
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
              opacity: phase === "pulse" || phase === "morph" ? 0.8 : phase === "assemble" ? 0.3 : 0,
            }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "hsla(155,65%,50%,0.8)" }} />
            <span
              className="text-[0.4rem] sm:text-[0.45rem] tracking-[0.3em] uppercase font-mono"
              style={{ color: "hsla(265,60%,70%,0.4)" }}
            >
              {phase === "morph" ? "NEURAL CORE · READY" : "EMPIRE · GENESIS"}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Tap hint on mobile */}
      {IS_MOBILE && (
        <motion.div
          className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "assemble" || phase === "pulse" ? 0.4 : 0 }}
          transition={{ delay: 1.5, duration: 0.4 }}
        >
          <p className="text-[0.5rem] tracking-[0.3em] uppercase text-foreground/20 font-mono">
            Tap per continuare
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UnifiedIntro;
