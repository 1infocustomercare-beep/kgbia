import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";

const smoothEase = [0.22, 1, 0.36, 1] as const;

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

/*
  Empire Cinematic Intro — DNA Circuit → Orbital Collapse into Hero Circle
  
  Phases:
  1. brand    — Logo + EMPIRE.AI reveal with loading bar
  2. assemble — DNA double helix forms (gold + violet + green), BIG and dramatic
  3. pulse    — helix pulses with energy, circuit lines glow, scanning beams
  4. orbit    — helix nodes become an orbiting ring
  5. collapse — ring contracts into the exact center (hero rotating circle position)
  6. exit     — dissolves seamlessly into the landing page
*/

const HELIX_NODES = IS_MOBILE ? 48 : 72;
const MESH_COUNT = IS_MOBILE ? 18 : 36;
const ENERGY_PARTICLES = IS_MOBILE ? 14 : 28;
const CIRCUIT_LINES = IS_MOBILE ? 10 : 18;
const ORBIT_DOTS = IS_MOBILE ? 24 : 36;

// Slower, more dramatic timings — especially on mobile
const TIMINGS = IS_MOBILE
  ? { brand: 0, assemble: 1200, pulse: 2800, orbit: 4200, collapse: 5400, exit: 6200, complete: 6800 }
  : { brand: 0, assemble: 1600, pulse: 3200, orbit: 4800, collapse: 6000, exit: 7000, complete: 7600 };

const SAFETY_TIMEOUT = IS_MOBILE ? 8000 : 10000;

type Phase = "brand" | "assemble" | "pulse" | "orbit" | "collapse" | "exit";

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
      setTimeout(() => set("orbit"), TIMINGS.orbit),
      setTimeout(() => set("collapse"), TIMINGS.collapse),
      setTimeout(() => set("exit"), TIMINGS.exit),
      setTimeout(safeComplete, TIMINGS.complete),
      setTimeout(safeComplete, SAFETY_TIMEOUT),
    ];
    return () => timers.forEach(clearTimeout);
  }, [safeComplete]);

  // ═══ Canvas animation ═══
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

    const colorPalette = [COLORS.violet, COLORS.gold, COLORS.green];

    // Background mesh nodes
    const meshNodes: { x: number; y: number; vx: number; vy: number; r: number; colorIdx: number }[] = [];
    for (let i = 0; i < MESH_COUNT; i++) {
      meshNodes.push({
        x: Math.random(), y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0004,
        vy: (Math.random() - 0.5) * 0.0004,
        r: 1 + Math.random() * 2,
        colorIdx: i % 3,
      });
    }

    // DNA helix nodes — BIGGER
    const turns = 5;
    const helixNodes: {
      sx: number; sy: number; tx: number; ty: number;
      x: number; y: number; r: number; colorIdx: number;
      strand: number; baseAngle: number; glow: boolean;
    }[] = [];
    for (let i = 0; i < HELIX_NODES; i++) {
      const t = i / HELIX_NODES;
      const angle = t * Math.PI * 2 * turns;
      const yPos = 0.02 + t * 0.96;
      const amp = IS_MOBILE ? 0.22 : 0.18;
      const ampVar = amp + Math.sin(t * Math.PI) * 0.08;
      const strand = i % 2 === 0 ? 1 : -1;
      const xPos = 0.5 + Math.sin(angle) * ampVar * strand;
      const colorIdx = i % 3;
      helixNodes.push({
        sx: Math.random(), sy: Math.random(),
        tx: xPos, ty: yPos,
        x: Math.random(), y: Math.random(),
        r: colorIdx === 1 ? 4 : (IS_MOBILE ? 3 : 2.5),
        colorIdx,
        strand, baseAngle: angle,
        glow: i % 3 === 0,
      });
    }

    // Energy particles
    const energyParticles: { t: number; speed: number; strand: number; colorIdx: number }[] = [];
    for (let i = 0; i < ENERGY_PARTICLES; i++) {
      energyParticles.push({
        t: Math.random(),
        speed: 0.1 + Math.random() * 0.15,
        strand: Math.random() > 0.5 ? 1 : -1,
        colorIdx: i % 3,
      });
    }

    // Circuit lines
    const circuitLines: { x1: number; y1: number; x2: number; y2: number; colorIdx: number; progress: number }[] = [];
    for (let i = 0; i < CIRCUIT_LINES; i++) {
      const isHoriz = i % 2 === 0;
      circuitLines.push({
        x1: isHoriz ? 0.03 : (0.1 + Math.random() * 0.8),
        y1: isHoriz ? (0.08 + Math.random() * 0.84) : 0.03,
        x2: isHoriz ? 0.97 : (0.1 + Math.random() * 0.8),
        y2: isHoriz ? (0.08 + Math.random() * 0.84) : 0.97,
        colorIdx: i % 3,
        progress: 0,
      });
    }

    // Orbit dots (used in orbit/collapse phases)
    const orbitDots: { angle: number; speed: number; colorIdx: number; size: number }[] = [];
    for (let i = 0; i < ORBIT_DOTS; i++) {
      orbitDots.push({
        angle: (i / ORBIT_DOTS) * Math.PI * 2,
        speed: 0.8 + Math.random() * 0.6,
        colorIdx: i % 3,
        size: 2 + Math.random() * 3,
      });
    }

    let animId: number;
    let lastFrame = 0;
    const FRAME_INTERVAL = IS_MOBILE ? 22 : 0;
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

      // Skip canvas drawing during brand phase
      if (cp === "brand") {
        animId = requestAnimationFrame(draw);
        return;
      }

      const assembleStart = TIMINGS.assemble / 1000;
      const pulseStart = TIMINGS.pulse / 1000;
      const orbitStart = TIMINGS.orbit / 1000;
      const collapseStart = TIMINGS.collapse / 1000;
      const exitStart = TIMINGS.exit / 1000;

      // Progress values
      let assembleP = 0, orbitP = 0, collapseP = 0, dissolveP = 0;

      if (cp === "assemble") {
        assembleP = Math.min((elapsed - assembleStart) / 1.4, 1);
        assembleP = 1 - Math.pow(1 - Math.max(assembleP, 0), 3);
      } else if (cp === "pulse") {
        assembleP = 1;
      } else if (cp === "orbit") {
        assembleP = 1;
        orbitP = Math.min((elapsed - orbitStart) / 1.0, 1);
        orbitP = 1 - Math.pow(1 - Math.max(orbitP, 0), 2);
      } else if (cp === "collapse") {
        assembleP = 1;
        orbitP = 1;
        collapseP = Math.min((elapsed - collapseStart) / 0.8, 1);
        collapseP = Math.max(collapseP, 0) ** 2;
      } else if (cp === "exit") {
        assembleP = 1;
        orbitP = 1;
        collapseP = 1;
        dissolveP = Math.min((elapsed - exitStart) / 0.7, 1);
        dissolveP = Math.max(dissolveP, 0) ** 2;
      }

      const globalFade = dissolveP > 0 ? 1 - dissolveP : Math.min((elapsed - assembleStart) / 0.5, 1);
      ctx.globalAlpha = Math.max(globalFade, 0);

      const coreRadius = IS_MOBILE ? 90 : 140;
      const helixRotation = elapsed * 0.5;

      // ═══ CIRCUIT BOARD LINES with animated progress ═══
      if (assembleP > 0.3 && orbitP < 1) {
        const circuitAlpha = Math.min((assembleP - 0.3) * 1.5, 1) * 0.06 * (1 - orbitP);
        for (const cl of circuitLines) {
          cl.progress = Math.min(cl.progress + 0.008, 1);
          const c = colorPalette[cl.colorIdx];
          
          // Animated line draw
          const lx = cl.x1 + (cl.x2 - cl.x1) * cl.progress;
          const ly = cl.y1 + (cl.y2 - cl.y1) * cl.progress;
          
          ctx.beginPath();
          ctx.moveTo(cl.x1 * w, cl.y1 * h);
          ctx.lineTo(lx * w, ly * h);
          ctx.strokeStyle = hsl(c, circuitAlpha);
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Junction dots with glow
          const jAlpha = circuitAlpha * 4;
          ctx.beginPath();
          ctx.arc(cl.x1 * w, cl.y1 * h, 2, 0, Math.PI * 2);
          ctx.fillStyle = hsl(c, jAlpha);
          ctx.fill();
          
          if (cl.progress > 0.5) {
            ctx.beginPath();
            ctx.arc(lx * w, ly * h, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = hsl(c, jAlpha * 1.5);
            ctx.fill();
          }
        }
      }

      // ═══ CENTRAL GLOW — tri-color core ═══
      const corePulse = 1 + Math.sin(elapsed * 2) * 0.12;
      const coreAlpha = cp === "pulse" ? 0.25 : cp === "orbit" ? 0.35 : cp === "collapse" ? 0.4 * (1 - dissolveP) : 0.1;

      const coreGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, coreRadius * corePulse * 1.5);
      coreGrad.addColorStop(0, hsl(COLORS.violet, coreAlpha * 1.8));
      coreGrad.addColorStop(0.25, hsl(COLORS.gold, coreAlpha));
      coreGrad.addColorStop(0.5, hsl(COLORS.green, coreAlpha * 0.6));
      coreGrad.addColorStop(1, `hsla(265,85%,65%,0)`);
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, coreRadius * corePulse * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Concentric rings
      if (assembleP > 0.5) {
        const ringAlpha = Math.min((assembleP - 0.5) * 2, 1) * 0.5 * (1 - dissolveP);
        const ringColors = [COLORS.violet, COLORS.gold, COLORS.green];
        const ringRadii = [0.5, 0.72, 0.92];
        const ringWidths = [2.5, 1.5, 1];
        
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(w / 2, h / 2, coreRadius * ringRadii[i] * corePulse, 0, Math.PI * 2);
          ctx.strokeStyle = hsl(ringColors[i], ringAlpha * (1 - i * 0.25));
          ctx.lineWidth = ringWidths[i];
          ctx.stroke();
        }
      }

      // ═══ BACKGROUND MESH ═══
      if (orbitP < 1) {
        const meshAlpha = 0.15 * (1 - orbitP);
        for (const n of meshNodes) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > 1) n.vx *= -1;
          if (n.y < 0 || n.y > 1) n.vy *= -1;
          const c = colorPalette[n.colorIdx];
          ctx.beginPath();
          ctx.arc(n.x * w, n.y * h, n.r, 0, Math.PI * 2);
          ctx.fillStyle = hsl(c, meshAlpha);
          ctx.fill();
        }

        // Mesh connections
        const checkRange = IS_MOBILE ? 4 : 6;
        for (let i = 0; i < meshNodes.length; i++) {
          for (let j = i + 1; j < Math.min(i + checkRange, meshNodes.length); j++) {
            const dx = meshNodes[i].x - meshNodes[j].x;
            const dy = meshNodes[i].y - meshNodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.18) {
              const a = (1 - dist / 0.18) * meshAlpha * 0.6;
              ctx.beginPath();
              ctx.moveTo(meshNodes[i].x * w, meshNodes[i].y * h);
              ctx.lineTo(meshNodes[j].x * w, meshNodes[j].y * h);
              ctx.strokeStyle = hsl(colorPalette[meshNodes[i].colorIdx], a);
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
      }

      // ═══ DNA HELIX — visible during assemble & pulse ═══
      if (orbitP < 1) {
        const helixFade = 1 - orbitP;
        
        for (const n of helixNodes) {
          const rotatedAngle = n.baseAngle + helixRotation;
          const amp = IS_MOBILE ? 0.22 : 0.18;
          const ampVar = amp + Math.sin(n.ty * Math.PI) * 0.08;
          const rotTx = 0.5 + Math.sin(rotatedAngle) * ampVar * n.strand;
          n.x = n.sx + (rotTx - n.sx) * assembleP;
          n.y = n.sy + (n.ty - n.sy) * assembleP;
        }

        // Backbone connections
        for (let i = 0; i < helixNodes.length - 1; i++) {
          const a = helixNodes[i], b = helixNodes[i + 1];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.15) {
            const alpha = (1 - dist / 0.15) * (assembleP > 0.5 ? 0.45 : 0.15) * helixFade;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.strokeStyle = hsl(colorPalette[a.colorIdx], alpha);
            ctx.lineWidth = IS_MOBILE ? 1.5 : 1.2;
            ctx.stroke();
          }
        }

        // Cross-connections (rungs)
        for (let i = 0; i < helixNodes.length - 1; i += 2) {
          if (i + 1 < helixNodes.length && helixNodes[i].strand !== helixNodes[i + 1].strand) {
            const a = helixNodes[i], b = helixNodes[i + 1];
            const alpha = 0.15 * assembleP * helixFade;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.strokeStyle = hsl(colorPalette[(i / 2) % 3], alpha);
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Helix dots with glow
        for (const n of helixNodes) {
          const px = n.x * w, py = n.y * h;
          const c = colorPalette[n.colorIdx];

          if (n.glow && assembleP > 0.4) {
            const glowR = n.r * 6;
            const glowGrad = ctx.createRadialGradient(px, py, 0, px, py, glowR);
            glowGrad.addColorStop(0, hsl(c, 0.3 * helixFade));
            glowGrad.addColorStop(1, hsl(c, 0));
            ctx.beginPath();
            ctx.arc(px, py, glowR, 0, Math.PI * 2);
            ctx.fillStyle = glowGrad;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(px, py, n.r, 0, Math.PI * 2);
          ctx.fillStyle = hsl(c, 0.9 * helixFade);
          ctx.fill();

          if (n.r > 2.5) {
            ctx.beginPath();
            ctx.arc(px, py, n.r * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(0,0%,100%,${0.7 * helixFade})`;
            ctx.fill();
          }
        }

        // Energy particles
        if (assembleP > 0.6) {
          for (const ep of energyParticles) {
            ep.t = (ep.t + ep.speed * 0.016) % 1;
            const angle = ep.t * Math.PI * 2 * turns + helixRotation;
            const amp = IS_MOBILE ? 0.22 : 0.18;
            const ampVar = amp + Math.sin(ep.t * Math.PI) * 0.08;
            const epx = (0.5 + Math.sin(angle) * ampVar * ep.strand) * w;
            const epy = (0.02 + ep.t * 0.96) * h;
            const epAlpha = 0.8 * helixFade * Math.sin(ep.t * Math.PI);
            const c = colorPalette[ep.colorIdx];

            const trailGrad = ctx.createRadialGradient(epx, epy, 0, epx, epy, IS_MOBILE ? 10 : 12);
            trailGrad.addColorStop(0, hsl(c, epAlpha));
            trailGrad.addColorStop(1, hsl(c, 0));
            ctx.beginPath();
            ctx.arc(epx, epy, IS_MOBILE ? 10 : 12, 0, Math.PI * 2);
            ctx.fillStyle = trailGrad;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(epx, epy, IS_MOBILE ? 2.5 : 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(0,0%,100%,${epAlpha})`;
            ctx.fill();
          }
        }
      }

      // ═══ SCANNING BEAM ═══
      if (cp === "pulse") {
        const scanY = (Math.sin(elapsed * 1.5) * 0.5 + 0.5) * h;
        const scanGrad = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
        scanGrad.addColorStop(0, hsl(COLORS.green, 0));
        scanGrad.addColorStop(0.5, hsl(COLORS.green, 0.1));
        scanGrad.addColorStop(1, hsl(COLORS.green, 0));
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanY - 50, w, 100);
      }

      // ═══ ORBIT PHASE — Futuristic DNA Superintelligence Ring ═══
      if (orbitP > 0) {
        const orbitRadius = IS_MOBILE 
          ? Math.max(w, h) * 0.38 * (1 - collapseP) + coreRadius * 0.5 * collapseP
          : Math.max(w, h) * 0.35 * (1 - collapseP) + coreRadius * 0.5 * collapseP;
        
        const orbitAlpha = (1 - dissolveP);
        const rotSpeed = elapsed * 0.8;
        const cx = w / 2, cy = h / 2;

        // ── Triple helix ring (DNA around the orbit) ──
        const helixStrands = 3;
        const helixSegments = IS_MOBILE ? 80 : 120;
        const helixAmp = IS_MOBILE ? 12 : 18; // wave amplitude perpendicular to ring
        const helixFreq = 8; // number of waves around the ring

        for (let s = 0; s < helixStrands; s++) {
          const strandColor = colorPalette[s];
          const phaseOffset = (s / helixStrands) * Math.PI * 2;
          
          ctx.beginPath();
          for (let i = 0; i <= helixSegments; i++) {
            const t = i / helixSegments;
            const baseAngle = t * Math.PI * 2 + rotSpeed * (0.6 + s * 0.15);
            const waveOffset = Math.sin(t * Math.PI * 2 * helixFreq + phaseOffset + elapsed * 3) * helixAmp;
            const r = orbitRadius + waveOffset;
            const px = cx + Math.cos(baseAngle) * r;
            const py = cy + Math.sin(baseAngle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = hsl(strandColor, 0.5 * orbitAlpha * orbitP);
          ctx.lineWidth = IS_MOBILE ? 1.8 : 2.2;
          ctx.stroke();

          // Glow layer
          ctx.beginPath();
          for (let i = 0; i <= helixSegments; i++) {
            const t = i / helixSegments;
            const baseAngle = t * Math.PI * 2 + rotSpeed * (0.6 + s * 0.15);
            const waveOffset = Math.sin(t * Math.PI * 2 * helixFreq + phaseOffset + elapsed * 3) * helixAmp;
            const r = orbitRadius + waveOffset;
            const px = cx + Math.cos(baseAngle) * r;
            const py = cy + Math.sin(baseAngle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = hsl(strandColor, 0.12 * orbitAlpha * orbitP);
          ctx.lineWidth = IS_MOBILE ? 8 : 12;
          ctx.stroke();
        }

        // ── Cross-links between strands (DNA rungs) ──
        const rungCount = IS_MOBILE ? 16 : 24;
        for (let i = 0; i < rungCount; i++) {
          const t = i / rungCount;
          const baseAngle = t * Math.PI * 2 + rotSpeed * 0.6;
          
          const wave1 = Math.sin(t * Math.PI * 2 * helixFreq + elapsed * 3) * helixAmp;
          const wave2 = Math.sin(t * Math.PI * 2 * helixFreq + (2 / 3) * Math.PI * 2 + elapsed * 3) * helixAmp;
          
          const r1 = orbitRadius + wave1;
          const r2 = orbitRadius + wave2;
          
          const px1 = cx + Math.cos(baseAngle) * r1;
          const py1 = cy + Math.sin(baseAngle) * r1;
          const px2 = cx + Math.cos(baseAngle) * r2;
          const py2 = cy + Math.sin(baseAngle) * r2;
          
          const rungAlpha = 0.2 * orbitAlpha * orbitP * (0.5 + 0.5 * Math.sin(t * Math.PI * 4 + elapsed));
          ctx.beginPath();
          ctx.moveTo(px1, py1);
          ctx.lineTo(px2, py2);
          ctx.strokeStyle = hsl(COLORS.gold, rungAlpha);
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // ── Pulsing data nodes on the ring ──
        for (const dot of orbitDots) {
          const a = dot.angle + rotSpeed * dot.speed;
          const strandIdx = Math.floor(dot.angle / (Math.PI * 2 / 3)) % 3;
          const phaseOff = (strandIdx / 3) * Math.PI * 2;
          const waveOff = Math.sin(dot.angle * helixFreq + phaseOff + elapsed * 3) * helixAmp;
          const r = orbitRadius + waveOff;
          const px = cx + Math.cos(a) * r;
          const py = cy + Math.sin(a) * r;
          const c = colorPalette[dot.colorIdx];
          const pulse = 0.7 + 0.3 * Math.sin(elapsed * 4 + dot.angle * 3);

          // Node glow
          const glowR = dot.size * 5 * pulse;
          const glowGrad = ctx.createRadialGradient(px, py, 0, px, py, glowR);
          glowGrad.addColorStop(0, hsl(c, 0.5 * orbitAlpha * pulse));
          glowGrad.addColorStop(0.4, hsl(c, 0.15 * orbitAlpha));
          glowGrad.addColorStop(1, hsl(c, 0));
          ctx.beginPath();
          ctx.arc(px, py, glowR, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();

          // Core dot
          ctx.beginPath();
          ctx.arc(px, py, dot.size * orbitP * pulse, 0, Math.PI * 2);
          ctx.fillStyle = hsl(c, 0.95 * orbitAlpha);
          ctx.fill();

          // White highlight
          ctx.beginPath();
          ctx.arc(px - dot.size * 0.2, py - dot.size * 0.2, dot.size * 0.35 * orbitP, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(0,0%,100%,${0.8 * orbitAlpha * pulse})`;
          ctx.fill();
        }

        // ── Rotating scan arcs (radar-like) ──
        const arcCount = 3;
        for (let i = 0; i < arcCount; i++) {
          const arcAngle = elapsed * (1.2 + i * 0.3) + (i * Math.PI * 2) / arcCount;
          const arcLen = Math.PI * 0.3;
          const arcR = orbitRadius * (0.92 + i * 0.05);
          const arcColor = colorPalette[i];
          
          const arcGrad = ctx.createConicGradient(arcAngle - arcLen, cx, cy);
          arcGrad.addColorStop(0, hsl(arcColor, 0));
          arcGrad.addColorStop(0.5, hsl(arcColor, 0.25 * orbitAlpha));
          arcGrad.addColorStop(1, hsl(arcColor, 0));
          
          ctx.beginPath();
          ctx.arc(cx, cy, arcR, arcAngle - arcLen, arcAngle + arcLen);
          ctx.strokeStyle = arcGrad as unknown as string;
          ctx.lineWidth = IS_MOBILE ? 3 : 4;
          ctx.stroke();
        }

        // ── Inner neural network pattern ──
        if (orbitP > 0.5) {
          const neuralAlpha = (orbitP - 0.5) * 2 * 0.15 * orbitAlpha;
          const neuralNodes = IS_MOBILE ? 8 : 12;
          const neuralR = orbitRadius * 0.55;
          const nPositions: { x: number; y: number }[] = [];
          
          for (let i = 0; i < neuralNodes; i++) {
            const na = (i / neuralNodes) * Math.PI * 2 + elapsed * 0.3;
            const nr = neuralR * (0.4 + 0.6 * Math.abs(Math.sin(na * 2 + elapsed)));
            const nx = cx + Math.cos(na) * nr;
            const ny = cy + Math.sin(na) * nr;
            nPositions.push({ x: nx, y: ny });
            
            // Neural node
            ctx.beginPath();
            ctx.arc(nx, ny, 2, 0, Math.PI * 2);
            ctx.fillStyle = hsl(COLORS.violet, neuralAlpha * 3);
            ctx.fill();
          }
          
          // Neural connections
          for (let i = 0; i < nPositions.length; i++) {
            for (let j = i + 1; j < nPositions.length; j++) {
              if ((i + j) % 3 === 0) {
                const dx = nPositions[i].x - nPositions[j].x;
                const dy = nPositions[i].y - nPositions[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < neuralR * 1.2) {
                  const connAlpha = neuralAlpha * (1 - dist / (neuralR * 1.2));
                  ctx.beginPath();
                  ctx.moveTo(nPositions[i].x, nPositions[i].y);
                  ctx.lineTo(nPositions[j].x, nPositions[j].y);
                  ctx.strokeStyle = hsl(COLORS.violet, connAlpha);
                  ctx.lineWidth = 0.5;
                  ctx.stroke();
                }
              }
            }
          }
          
          // Center brain core
          const brainPulse = 1 + Math.sin(elapsed * 3) * 0.15;
          const brainR = IS_MOBILE ? 16 : 22;
          const brainGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, brainR * brainPulse * 2);
          brainGrad.addColorStop(0, `hsla(0,0%,100%,${0.3 * neuralAlpha * 6})`);
          brainGrad.addColorStop(0.2, hsl(COLORS.violet, neuralAlpha * 5));
          brainGrad.addColorStop(0.5, hsl(COLORS.gold, neuralAlpha * 3));
          brainGrad.addColorStop(1, hsl(COLORS.violet, 0));
          ctx.beginPath();
          ctx.arc(cx, cy, brainR * brainPulse * 2, 0, Math.PI * 2);
          ctx.fillStyle = brainGrad;
          ctx.fill();
        }

        // ═══ COLLAPSE — converging energy beams ═══
        if (collapseP > 0) {
          const beamCount = 8;
          for (let i = 0; i < beamCount; i++) {
            const ba = (i / beamCount) * Math.PI * 2 + elapsed * 2;
            const outerR = orbitRadius * 1.2;
            const ox = cx + Math.cos(ba) * outerR;
            const oy = cy + Math.sin(ba) * outerR;
            
            const beamGrad = ctx.createLinearGradient(ox, oy, cx, cy);
            const c = colorPalette[i % 3];
            beamGrad.addColorStop(0, hsl(c, 0));
            beamGrad.addColorStop(0.2, hsl(c, 0.1 * collapseP * orbitAlpha));
            beamGrad.addColorStop(0.7, hsl(c, 0.35 * collapseP * orbitAlpha));
            beamGrad.addColorStop(1, `hsla(0,0%,100%,${0.4 * collapseP * orbitAlpha})`);
            
            ctx.beginPath();
            ctx.moveTo(ox, oy);
            ctx.lineTo(cx, cy);
            ctx.strokeStyle = beamGrad as unknown as string;
            ctx.lineWidth = 1.5 + collapseP * 1.5;
            ctx.stroke();
          }

          // Central supernova flash
          const flashR = coreRadius * (0.8 + collapseP * 0.6) * (1 + Math.sin(elapsed * 6) * 0.08);
          const flashGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, flashR);
          flashGrad.addColorStop(0, `hsla(0,0%,100%,${0.5 * collapseP * orbitAlpha})`);
          flashGrad.addColorStop(0.15, hsl(COLORS.violet, 0.4 * collapseP * orbitAlpha));
          flashGrad.addColorStop(0.35, hsl(COLORS.gold, 0.25 * collapseP * orbitAlpha));
          flashGrad.addColorStop(0.6, hsl(COLORS.green, 0.1 * collapseP * orbitAlpha));
          flashGrad.addColorStop(1, hsl(COLORS.violet, 0));
          ctx.beginPath();
          ctx.arc(cx, cy, flashR, 0, Math.PI * 2);
          ctx.fillStyle = flashGrad;
          ctx.fill();

          // Hexagonal frame around the core
          const hexR = coreRadius * 0.45 * (1 - collapseP * 0.3);
          const hexAlpha = 0.4 * collapseP * orbitAlpha;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const ha = (i / 6) * Math.PI * 2 + elapsed * 0.5;
            const hx = cx + Math.cos(ha) * hexR;
            const hy = cy + Math.sin(ha) * hexR;
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.strokeStyle = hsl(COLORS.gold, hexAlpha);
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // ═══ DISSOLVE — expanding ripples ═══
      if (dissolveP > 0) {
        const ripples = [
          { color: COLORS.violet, delay: 0, width: 2.5 },
          { color: COLORS.gold, delay: 0.1, width: 2 },
          { color: COLORS.green, delay: 0.2, width: 1.5 },
        ];
        for (const r of ripples) {
          const p = Math.max(0, dissolveP - r.delay);
          const rr = p * Math.max(w, h) * 0.8;
          const ra = Math.max(0, 1 - dissolveP) * 0.2;
          ctx.beginPath();
          ctx.arc(w / 2, h / 2, rr, 0, Math.PI * 2);
          ctx.strokeStyle = hsl(r.color, ra);
          ctx.lineWidth = r.width;
          ctx.stroke();
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
      transition={{ duration: 0.7, ease: smoothEase }}
      onAnimationComplete={() => {
        if (phase === "exit") safeComplete();
      }}
      onClick={handleTap}
    >
      {/* Canvas for DNA + Orbit */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: phase === "brand" ? 0 : 1,
          transition: "opacity 0.6s ease",
          willChange: "opacity",
          WebkitTransform: "translate3d(0,0,0)",
        }}
      />

      {/* ═══ BRAND PHASE — Crown logo + EMPIRE.AI ═══ */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ willChange: "opacity, transform", WebkitTransform: "translate3d(0,0,0)" }}
        animate={{
          opacity: phase === "brand" ? 1 : 0,
          scale: phase === "brand" ? 1 : 0.85,
          y: phase === "brand" ? 0 : -30,
        }}
        transition={{ duration: 0.8, ease: smoothEase }}
      >
        <div className="flex flex-col items-center gap-5">
          {/* Crown container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotateY: -20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: smoothEase }}
          >
            <div className="w-22 h-22 sm:w-28 sm:h-28 rounded-[24px] sm:rounded-[30px] bg-gradient-to-br from-white/[0.08] to-white/[0.02] flex items-center justify-center border border-white/[0.1] shadow-[0_0_60px_hsla(265,85%,65%,0.2),0_0_120px_hsla(38,55%,58%,0.1)]">
              <div
                className="w-[60px] h-[60px] sm:w-[74px] sm:h-[74px] rounded-[18px] sm:rounded-[22px] flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, hsl(265,85%,65%), hsl(38,55%,58%), hsl(155,65%,50%))" }}
              >
                <Crown className="w-8 h-8 sm:w-9 sm:h-9 text-white drop-shadow-[0_0_16px_rgba(255,255,255,0.5)]" />
              </div>
            </div>
          </motion.div>

          {/* Brand text */}
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: smoothEase }}
          >
            <h1 className="font-heading font-bold text-3xl sm:text-4xl tracking-[0.3em] uppercase text-foreground">
              EMPIRE<span className="text-shimmer">.AI</span>
            </h1>
            <motion.div
              className="h-[1.5px] rounded-full mx-auto"
              style={{ background: "linear-gradient(90deg, transparent, hsl(265,85%,65%), hsl(38,55%,58%), hsl(155,65%,50%), transparent)" }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 160, opacity: 0.6 }}
              transition={{ duration: 0.5, delay: 0.55, ease: smoothEase }}
            />
            <p className="text-[0.55rem] sm:text-[0.6rem] tracking-[0.5em] uppercase text-foreground/25 font-heading">
              Il Sistema Operativo del Business
            </p>
          </motion.div>

          {/* Loading bar — tri-color gradient */}
          <motion.div
            className="w-44 sm:w-56 h-[2px] rounded-full overflow-hidden"
            style={{ background: "hsla(265,85%,65%,0.08)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, hsl(265,85%,65%), hsl(38,55%,58%), hsl(155,65%,50%))" }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: TIMINGS.exit / 1000 - 0.5, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Ambient tri-color glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, hsla(265,85%,65%,0.14) 0%, hsla(38,55%,58%,0.06) 30%, hsla(155,65%,50%,0.04) 50%, transparent 70%)",
        }}
      />

      {/* Subtle circuit grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsla(155,65%,50%,0.6) 1px, transparent 1px), linear-gradient(90deg, hsla(265,60%,55%,0.6) 1px, transparent 1px)",
          backgroundSize: "45px 45px",
          maskImage: "radial-gradient(ellipse at center, black 25%, transparent 65%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 25%, transparent 65%)",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,hsla(260,20%,4%,0.85)_75%)] pointer-events-none" />

      {/* Orbital rings — always rotating */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] sm:w-[420px] sm:h-[420px] rounded-full pointer-events-none"
        style={{ border: "1px solid hsla(265,85%,65%,0.1)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[170px] h-[170px] sm:w-[330px] sm:h-[330px] rounded-full pointer-events-none"
        style={{ border: "1px solid hsla(38,55%,58%,0.07)" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[130px] h-[130px] sm:w-[250px] sm:h-[250px] rounded-full pointer-events-none"
        style={{ border: "1px solid hsla(155,65%,50%,0.05)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* ═══ HUD Status indicators ═══ */}
      <motion.div
        className="absolute inset-0 flex items-end justify-center pb-20 sm:pb-24 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "brand" || phase === "exit" ? 0 : 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex flex-col items-center gap-3">
          {/* Phase dots */}
          <motion.div
            className="flex items-center gap-5"
            initial={{ opacity: 0 }}
            animate={{
              opacity: phase === "pulse" || phase === "orbit" || phase === "collapse" ? 0.9 : phase === "assemble" ? 0.5 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            {[
              { label: "DNA", color: "hsl(265,85%,65%)" },
              { label: "NEURAL", color: "hsl(38,55%,58%)" },
              { label: "DEPLOY", color: "hsl(155,65%,50%)" },
            ].map(({ label, color }, i) => (
              <div key={label} className="flex items-center gap-1.5">
                <div
                  className="w-[5px] h-[5px] rounded-full animate-pulse"
                  style={{ background: color, animationDelay: `${i * 300}ms` }}
                />
                <span
                  className="text-[0.4rem] sm:text-[0.45rem] tracking-[0.2em] uppercase font-mono"
                  style={{ color: "hsla(265,55%,65%,0.35)" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Status pill */}
          <motion.div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full"
            style={{
              background: "hsla(252,15%,10%,0.7)",
              border: "0.5px solid hsla(265,50%,55%,0.12)",
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: phase === "pulse" || phase === "orbit" ? 0.9 : phase === "collapse" ? 0.6 : phase === "assemble" ? 0.4 : 0,
            }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "hsla(155,65%,50%,0.9)" }} />
            <span
              className="text-[0.42rem] sm:text-[0.48rem] tracking-[0.3em] uppercase font-mono"
              style={{ color: "hsla(265,60%,70%,0.45)" }}
            >
              {phase === "collapse" ? "CORE · READY" : phase === "orbit" ? "NEURAL ORBIT · ACTIVE" : "EMPIRE · GENESIS"}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Tap hint on mobile */}
      {IS_MOBILE && (
        <motion.div
          className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "assemble" || phase === "pulse" ? 0.45 : 0 }}
          transition={{ delay: 2, duration: 0.4 }}
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
