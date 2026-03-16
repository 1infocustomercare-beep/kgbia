import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Crown, Brain, Cpu, Fingerprint, Workflow, ScanLine, Database,
  BrainCircuit, Network, Atom, Radar, CircuitBoard, Waypoints, Sparkles, Binary
} from "lucide-react";

const smoothEase = [0.22, 1, 0.36, 1] as const;

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

/*
  Empire Cinematic Intro — Intelligent DNA Ecosystem Evolution
  
  A unified experience across all devices. The animation represents
  the birth and evolution of an intelligent AI ecosystem through DNA-like
  structures that morph into a neural superintelligence core.
  
  Phases:
  1. brand    — Logo + EMPIRE.AI reveal
  2. assemble — DNA double helix forms vertically, representing code/data strands
  3. pulse    — helix pulses with data flow, scanning beams analyze
  4. orbit    — DNA transforms into an orbital intelligence ring
  5. collapse — ring contracts into the core singularity
  6. exit     — dissolves into the landing page
*/

// Unified counts — desktop gets more detail but same structure
const HELIX_NODES = IS_MOBILE ? 48 : 72;
const MESH_COUNT = IS_MOBILE ? 18 : 36;
const ENERGY_PARTICLES = IS_MOBILE ? 14 : 28;
const CIRCUIT_LINES = IS_MOBILE ? 10 : 18;
const ORBIT_DOTS = IS_MOBILE ? 24 : 36;

// Same dramatic timing for both — desktop should feel equally cinematic
const TIMINGS = IS_MOBILE
  ? { brand: 0, assemble: 1200, pulse: 2800, orbit: 4200, collapse: 5400, exit: 6200, complete: 6800 }
  : { brand: 0, assemble: 1400, pulse: 3000, orbit: 4400, collapse: 5600, exit: 6400, complete: 7000 };

const SAFETY_TIMEOUT = IS_MOBILE ? 8000 : 10000;

type Phase = "brand" | "assemble" | "pulse" | "orbit" | "collapse" | "exit";

// Professional palette — deep violet core, warm gold accents, emerald data
const COLORS = {
  gold: { h: 38, s: 50, l: 55 },
  violet: { h: 265, s: 75, l: 62 },
  green: { h: 160, s: 55, l: 48 },
  cyan: { h: 195, s: 70, l: 55 },
};

const hsl = (c: { h: number; s: number; l: number }, a: number) =>
  `hsla(${c.h},${c.s}%,${c.l}%,${a})`;

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

  // Unified click: double-tap on mobile, double-click on desktop
  const handleTap = useCallback(() => {
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

    // Responsive scale factor — ensures proportional sizing on all screens
    const baseScale = () => Math.min(w, h) / (IS_MOBILE ? 400 : 700);

    // Background mesh nodes — floating neural dust
    const meshNodes: { x: number; y: number; vx: number; vy: number; r: number; colorIdx: number }[] = [];
    for (let i = 0; i < MESH_COUNT; i++) {
      meshNodes.push({
        x: Math.random(), y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0003,
        vy: (Math.random() - 0.5) * 0.0003,
        r: 1 + Math.random() * 1.5,
        colorIdx: i % 3,
      });
    }

    // DNA helix nodes
    const turns = 5;
    const helixNodes: {
      sx: number; sy: number; tx: number; ty: number;
      x: number; y: number; r: number; colorIdx: number;
      strand: number; baseAngle: number; glow: boolean;
    }[] = [];
    for (let i = 0; i < HELIX_NODES; i++) {
      const t = i / HELIX_NODES;
      const angle = t * Math.PI * 2 * turns;
      const yPos = 0.05 + t * 0.90;
      const amp = 0.18;
      const ampVar = amp + Math.sin(t * Math.PI) * 0.06;
      const strand = i % 2 === 0 ? 1 : -1;
      const xPos = 0.5 + Math.sin(angle) * ampVar * strand;
      const colorIdx = i % 3;
      helixNodes.push({
        sx: Math.random(), sy: Math.random(),
        tx: xPos, ty: yPos,
        x: Math.random(), y: Math.random(),
        r: colorIdx === 1 ? 3.5 : 2.5,
        colorIdx, strand, baseAngle: angle,
        glow: i % 4 === 0,
      });
    }

    // Energy particles — data flowing through strands
    const energyParticles: { t: number; speed: number; strand: number; colorIdx: number }[] = [];
    for (let i = 0; i < ENERGY_PARTICLES; i++) {
      energyParticles.push({
        t: Math.random(),
        speed: 0.08 + Math.random() * 0.12,
        strand: Math.random() > 0.5 ? 1 : -1,
        colorIdx: i % 3,
      });
    }

    // Subtle circuit lines — data pathways
    const circuitLines: { x1: number; y1: number; x2: number; y2: number; colorIdx: number; progress: number }[] = [];
    for (let i = 0; i < CIRCUIT_LINES; i++) {
      const isHoriz = i % 2 === 0;
      circuitLines.push({
        x1: isHoriz ? 0.05 : (0.15 + Math.random() * 0.7),
        y1: isHoriz ? (0.1 + Math.random() * 0.8) : 0.05,
        x2: isHoriz ? 0.95 : (0.15 + Math.random() * 0.7),
        y2: isHoriz ? (0.1 + Math.random() * 0.8) : 0.95,
        colorIdx: i % 3,
        progress: 0,
      });
    }

    // Orbit dots — intelligence nodes
    const orbitDots: { angle: number; speed: number; colorIdx: number; size: number }[] = [];
    for (let i = 0; i < ORBIT_DOTS; i++) {
      orbitDots.push({
        angle: (i / ORBIT_DOTS) * Math.PI * 2,
        speed: 0.6 + Math.random() * 0.5,
        colorIdx: i % 3,
        size: 1.5 + Math.random() * 2.5,
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

      if (cp === "brand") {
        animId = requestAnimationFrame(draw);
        return;
      }

      const scale = baseScale();
      const assembleStart = TIMINGS.assemble / 1000;
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

      const coreRadius = Math.min(w, h) * 0.16;
      const helixRotation = elapsed * 0.4;
      const cx = w / 2, cy = h / 2;

      // ═══ SUBTLE DATA PATHWAYS ═══
      if (assembleP > 0.3 && orbitP < 1) {
        const circuitAlpha = Math.min((assembleP - 0.3) * 1.5, 1) * 0.04 * (1 - orbitP);
        for (const cl of circuitLines) {
          cl.progress = Math.min(cl.progress + 0.006, 1);
          const c = colorPalette[cl.colorIdx];
          const lx = cl.x1 + (cl.x2 - cl.x1) * cl.progress;
          const ly = cl.y1 + (cl.y2 - cl.y1) * cl.progress;
          
          ctx.beginPath();
          ctx.moveTo(cl.x1 * w, cl.y1 * h);
          ctx.lineTo(lx * w, ly * h);
          ctx.strokeStyle = hsl(c, circuitAlpha);
          ctx.lineWidth = 0.5;
          ctx.stroke();

          // Junction node
          if (cl.progress > 0.5) {
            ctx.beginPath();
            ctx.arc(lx * w, ly * h, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = hsl(c, circuitAlpha * 3);
            ctx.fill();
          }
        }
      }

      // ═══ CENTRAL INTELLIGENCE CORE ═══
      const corePulse = 1 + Math.sin(elapsed * 1.8) * 0.08;
      const coreAlpha = cp === "pulse" ? 0.2 : cp === "orbit" ? 0.3 : cp === "collapse" ? 0.35 * (1 - dissolveP) : 0.08;

      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * corePulse * 1.5);
      coreGrad.addColorStop(0, hsl(COLORS.violet, coreAlpha * 1.5));
      coreGrad.addColorStop(0.3, hsl(COLORS.gold, coreAlpha * 0.7));
      coreGrad.addColorStop(0.6, hsl(COLORS.green, coreAlpha * 0.3));
      coreGrad.addColorStop(1, `hsla(265,75%,62%,0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * corePulse * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Thin concentric rings — precision look
      if (assembleP > 0.5) {
        const ringAlpha = Math.min((assembleP - 0.5) * 2, 1) * 0.3 * (1 - dissolveP);
        const ringColors = [COLORS.violet, COLORS.gold, COLORS.green];
        const ringRadii = [0.45, 0.65, 0.85];
        
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(cx, cy, coreRadius * ringRadii[i] * corePulse, 0, Math.PI * 2);
          ctx.strokeStyle = hsl(ringColors[i], ringAlpha * (1 - i * 0.2));
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // ═══ NEURAL MESH BACKGROUND ═══
      if (orbitP < 1) {
        const meshAlpha = 0.1 * (1 - orbitP);
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

        // Mesh connections — subtle network
        const checkRange = IS_MOBILE ? 4 : 6;
        for (let i = 0; i < meshNodes.length; i++) {
          for (let j = i + 1; j < Math.min(i + checkRange, meshNodes.length); j++) {
            const dx = meshNodes[i].x - meshNodes[j].x;
            const dy = meshNodes[i].y - meshNodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.16) {
              const a = (1 - dist / 0.16) * meshAlpha * 0.4;
              ctx.beginPath();
              ctx.moveTo(meshNodes[i].x * w, meshNodes[i].y * h);
              ctx.lineTo(meshNodes[j].x * w, meshNodes[j].y * h);
              ctx.strokeStyle = hsl(colorPalette[meshNodes[i].colorIdx], a);
              ctx.lineWidth = 0.4;
              ctx.stroke();
            }
          }
        }
      }

      // ═══ DNA DOUBLE HELIX — Ecosystem strands ═══
      if (orbitP < 1) {
        const helixFade = 1 - orbitP;
        
        for (const n of helixNodes) {
          const rotatedAngle = n.baseAngle + helixRotation;
          const amp = 0.18;
          const ampVar = amp + Math.sin(n.ty * Math.PI) * 0.06;
          const rotTx = 0.5 + Math.sin(rotatedAngle) * ampVar * n.strand;
          n.x = n.sx + (rotTx - n.sx) * assembleP;
          n.y = n.sy + (n.ty - n.sy) * assembleP;
        }

        // Backbone connections — thin, precise
        for (let i = 0; i < helixNodes.length - 1; i++) {
          const a = helixNodes[i], b = helixNodes[i + 1];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.12) {
            const alpha = (1 - dist / 0.12) * (assembleP > 0.5 ? 0.35 : 0.12) * helixFade;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.strokeStyle = hsl(colorPalette[a.colorIdx], alpha);
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Cross-connections (base pairs)
        for (let i = 0; i < helixNodes.length - 1; i += 2) {
          if (i + 1 < helixNodes.length && helixNodes[i].strand !== helixNodes[i + 1].strand) {
            const a = helixNodes[i], b = helixNodes[i + 1];
            const alpha = 0.1 * assembleP * helixFade;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.strokeStyle = hsl(colorPalette[(i / 2) % 3], alpha);
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }

        // Helix nodes — clean, minimal glow
        for (const n of helixNodes) {
          const px = n.x * w, py = n.y * h;
          const c = colorPalette[n.colorIdx];

          if (n.glow && assembleP > 0.5) {
            const glowR = n.r * 4;
            const glowGrad = ctx.createRadialGradient(px, py, 0, px, py, glowR);
            glowGrad.addColorStop(0, hsl(c, 0.2 * helixFade));
            glowGrad.addColorStop(1, hsl(c, 0));
            ctx.beginPath();
            ctx.arc(px, py, glowR, 0, Math.PI * 2);
            ctx.fillStyle = glowGrad;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(px, py, n.r * scale * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = hsl(c, 0.85 * helixFade);
          ctx.fill();
        }

        // Energy particles — flowing data
        if (assembleP > 0.6) {
          for (const ep of energyParticles) {
            ep.t = (ep.t + ep.speed * 0.016) % 1;
            const angle = ep.t * Math.PI * 2 * turns + helixRotation;
            const amp = 0.18;
            const ampVar = amp + Math.sin(ep.t * Math.PI) * 0.06;
            const epx = (0.5 + Math.sin(angle) * ampVar * ep.strand) * w;
            const epy = (0.05 + ep.t * 0.9) * h;
            const epAlpha = 0.6 * helixFade * Math.sin(ep.t * Math.PI);
            const c = colorPalette[ep.colorIdx];

            const trailGrad = ctx.createRadialGradient(epx, epy, 0, epx, epy, 8 * scale);
            trailGrad.addColorStop(0, hsl(c, epAlpha));
            trailGrad.addColorStop(1, hsl(c, 0));
            ctx.beginPath();
            ctx.arc(epx, epy, 8 * scale, 0, Math.PI * 2);
            ctx.fillStyle = trailGrad;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(epx, epy, 1.5 * scale, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(0,0%,100%,${epAlpha * 0.8})`;
            ctx.fill();
          }
        }
      }

      // ═══ SCANNING BEAM — Analysis phase ═══
      if (cp === "pulse") {
        const scanY = (Math.sin(elapsed * 1.2) * 0.5 + 0.5) * h;
        const scanGrad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
        scanGrad.addColorStop(0, hsl(COLORS.cyan, 0));
        scanGrad.addColorStop(0.5, hsl(COLORS.cyan, 0.06));
        scanGrad.addColorStop(1, hsl(COLORS.cyan, 0));
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanY - 40, w, 80);
      }

      // ═══ ORBIT PHASE — DNA evolves into Intelligence Ring ═══
      if (orbitP > 0) {
        const maxOrbitR = Math.min(w, h) * 0.35;
        const orbitRadius = maxOrbitR * (1 - collapseP * 0.7);
        const orbitAlpha = (1 - dissolveP);
        const rotSpeed = elapsed * 0.6;

        // ── Triple helix ring — DNA wrapping the orbit ──
        const helixStrands = 3;
        const helixSegments = IS_MOBILE ? 80 : 140;
        const helixAmp = 10 * scale;
        const helixFreq = 8;

        for (let s = 0; s < helixStrands; s++) {
          const strandColor = colorPalette[s];
          const phaseOffset = (s / helixStrands) * Math.PI * 2;

          // Main strand
          ctx.beginPath();
          for (let i = 0; i <= helixSegments; i++) {
            const t = i / helixSegments;
            const baseAngle = t * Math.PI * 2 + rotSpeed * (0.5 + s * 0.1);
            const waveOffset = Math.sin(t * Math.PI * 2 * helixFreq + phaseOffset + elapsed * 2.5) * helixAmp;
            const r = orbitRadius + waveOffset;
            const px = cx + Math.cos(baseAngle) * r;
            const py = cy + Math.sin(baseAngle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = hsl(strandColor, 0.4 * orbitAlpha * orbitP);
          ctx.lineWidth = 1.5 * scale;
          ctx.stroke();

          // Soft glow layer
          ctx.beginPath();
          for (let i = 0; i <= helixSegments; i++) {
            const t = i / helixSegments;
            const baseAngle = t * Math.PI * 2 + rotSpeed * (0.5 + s * 0.1);
            const waveOffset = Math.sin(t * Math.PI * 2 * helixFreq + phaseOffset + elapsed * 2.5) * helixAmp;
            const r = orbitRadius + waveOffset;
            const px = cx + Math.cos(baseAngle) * r;
            const py = cy + Math.sin(baseAngle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = hsl(strandColor, 0.08 * orbitAlpha * orbitP);
          ctx.lineWidth = 6 * scale;
          ctx.stroke();
        }

        // ── Cross-links — base pair connections ──
        const rungCount = IS_MOBILE ? 16 : 28;
        for (let i = 0; i < rungCount; i++) {
          const t = i / rungCount;
          const baseAngle = t * Math.PI * 2 + rotSpeed * 0.5;
          const wave1 = Math.sin(t * Math.PI * 2 * helixFreq + elapsed * 2.5) * helixAmp;
          const wave2 = Math.sin(t * Math.PI * 2 * helixFreq + (2 / 3) * Math.PI * 2 + elapsed * 2.5) * helixAmp;
          const r1 = orbitRadius + wave1;
          const r2 = orbitRadius + wave2;
          const px1 = cx + Math.cos(baseAngle) * r1;
          const py1 = cy + Math.sin(baseAngle) * r1;
          const px2 = cx + Math.cos(baseAngle) * r2;
          const py2 = cy + Math.sin(baseAngle) * r2;

          const rungAlpha = 0.12 * orbitAlpha * orbitP * (0.5 + 0.5 * Math.sin(t * Math.PI * 4 + elapsed));
          ctx.beginPath();
          ctx.moveTo(px1, py1);
          ctx.lineTo(px2, py2);
          ctx.strokeStyle = hsl(COLORS.gold, rungAlpha);
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        // ── Data nodes on the ring ──
        for (const dot of orbitDots) {
          const a = dot.angle + rotSpeed * dot.speed;
          const strandIdx = Math.floor(dot.angle / (Math.PI * 2 / 3)) % 3;
          const phaseOff = (strandIdx / 3) * Math.PI * 2;
          const waveOff = Math.sin(dot.angle * helixFreq + phaseOff + elapsed * 2.5) * helixAmp;
          const r = orbitRadius + waveOff;
          const px = cx + Math.cos(a) * r;
          const py = cy + Math.sin(a) * r;
          const c = colorPalette[dot.colorIdx];
          const pulse = 0.7 + 0.3 * Math.sin(elapsed * 3 + dot.angle * 3);

          // Subtle glow
          const glowR = dot.size * 3.5 * pulse * scale;
          const glowGrad = ctx.createRadialGradient(px, py, 0, px, py, glowR);
          glowGrad.addColorStop(0, hsl(c, 0.35 * orbitAlpha * pulse));
          glowGrad.addColorStop(0.5, hsl(c, 0.08 * orbitAlpha));
          glowGrad.addColorStop(1, hsl(c, 0));
          ctx.beginPath();
          ctx.arc(px, py, glowR, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();

          // Core dot
          ctx.beginPath();
          ctx.arc(px, py, dot.size * orbitP * pulse * scale * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = hsl(c, 0.9 * orbitAlpha);
          ctx.fill();
        }

        // ── Rotating scan arcs ──
        for (let i = 0; i < 3; i++) {
          const arcAngle = elapsed * (0.8 + i * 0.2) + (i * Math.PI * 2) / 3;
          const arcLen = Math.PI * 0.25;
          const arcR = orbitRadius * (0.93 + i * 0.04);
          const arcColor = colorPalette[i];

          const arcGrad = ctx.createConicGradient(arcAngle - arcLen, cx, cy);
          arcGrad.addColorStop(0, hsl(arcColor, 0));
          arcGrad.addColorStop(0.5, hsl(arcColor, 0.18 * orbitAlpha));
          arcGrad.addColorStop(1, hsl(arcColor, 0));

          ctx.beginPath();
          ctx.arc(cx, cy, arcR, arcAngle - arcLen, arcAngle + arcLen);
          ctx.strokeStyle = arcGrad as unknown as string;
          ctx.lineWidth = 2 * scale;
          ctx.stroke();
        }

        // ── Inner neural network ──
        if (orbitP > 0.4) {
          const neuralAlpha = (orbitP - 0.4) * 1.67 * 0.12 * orbitAlpha;
          const neuralNodes = IS_MOBILE ? 10 : 16;
          const neuralR = orbitRadius * 0.5;
          const nPositions: { x: number; y: number }[] = [];

          for (let i = 0; i < neuralNodes; i++) {
            const na = (i / neuralNodes) * Math.PI * 2 + elapsed * 0.25;
            const nr = neuralR * (0.3 + 0.7 * Math.abs(Math.sin(na * 2 + elapsed * 0.7)));
            const nx = cx + Math.cos(na) * nr;
            const ny = cy + Math.sin(na) * nr;
            nPositions.push({ x: nx, y: ny });

            ctx.beginPath();
            ctx.arc(nx, ny, 1.5 * scale, 0, Math.PI * 2);
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
                  ctx.beginPath();
                  ctx.moveTo(nPositions[i].x, nPositions[i].y);
                  ctx.lineTo(nPositions[j].x, nPositions[j].y);
                  ctx.strokeStyle = hsl(COLORS.violet, neuralAlpha * (1 - dist / (neuralR * 1.2)));
                  ctx.lineWidth = 0.4;
                  ctx.stroke();
                }
              }
            }
          }

          // Center intelligence core
          const brainPulse = 1 + Math.sin(elapsed * 2.5) * 0.1;
          const brainR = 14 * scale;
          const brainGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, brainR * brainPulse * 2);
          brainGrad.addColorStop(0, `hsla(0,0%,100%,${0.25 * neuralAlpha * 6})`);
          brainGrad.addColorStop(0.2, hsl(COLORS.violet, neuralAlpha * 4));
          brainGrad.addColorStop(0.5, hsl(COLORS.gold, neuralAlpha * 2.5));
          brainGrad.addColorStop(1, hsl(COLORS.violet, 0));
          ctx.beginPath();
          ctx.arc(cx, cy, brainR * brainPulse * 2, 0, Math.PI * 2);
          ctx.fillStyle = brainGrad;
          ctx.fill();
        }

        // ═══ COLLAPSE — converging energy ═══
        if (collapseP > 0) {
          const beamCount = 6;
          for (let i = 0; i < beamCount; i++) {
            const ba = (i / beamCount) * Math.PI * 2 + elapsed * 1.5;
            const outerR = orbitRadius * 1.15;
            const ox = cx + Math.cos(ba) * outerR;
            const oy = cy + Math.sin(ba) * outerR;

            const beamGrad = ctx.createLinearGradient(ox, oy, cx, cy);
            const c = colorPalette[i % 3];
            beamGrad.addColorStop(0, hsl(c, 0));
            beamGrad.addColorStop(0.3, hsl(c, 0.06 * collapseP * orbitAlpha));
            beamGrad.addColorStop(0.8, hsl(c, 0.25 * collapseP * orbitAlpha));
            beamGrad.addColorStop(1, `hsla(0,0%,100%,${0.3 * collapseP * orbitAlpha})`);

            ctx.beginPath();
            ctx.moveTo(ox, oy);
            ctx.lineTo(cx, cy);
            ctx.strokeStyle = beamGrad as unknown as string;
            ctx.lineWidth = 1 + collapseP;
            ctx.stroke();
          }

          // Core singularity flash
          const flashR = coreRadius * (0.6 + collapseP * 0.5);
          const flashGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, flashR);
          flashGrad.addColorStop(0, `hsla(0,0%,100%,${0.4 * collapseP * orbitAlpha})`);
          flashGrad.addColorStop(0.15, hsl(COLORS.violet, 0.3 * collapseP * orbitAlpha));
          flashGrad.addColorStop(0.4, hsl(COLORS.gold, 0.15 * collapseP * orbitAlpha));
          flashGrad.addColorStop(1, hsl(COLORS.violet, 0));
          ctx.beginPath();
          ctx.arc(cx, cy, flashR, 0, Math.PI * 2);
          ctx.fillStyle = flashGrad;
          ctx.fill();

          // Hexagonal precision frame
          const hexR = coreRadius * 0.35 * (1 - collapseP * 0.2);
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const ha = (i / 6) * Math.PI * 2 + elapsed * 0.4;
            const hx = cx + Math.cos(ha) * hexR;
            const hy = cy + Math.sin(ha) * hexR;
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.strokeStyle = hsl(COLORS.gold, 0.3 * collapseP * orbitAlpha);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // ═══ DISSOLVE — expanding ripples ═══
      if (dissolveP > 0) {
        const ripples = [
          { color: COLORS.violet, delay: 0, width: 2 },
          { color: COLORS.gold, delay: 0.1, width: 1.5 },
          { color: COLORS.green, delay: 0.2, width: 1 },
        ];
        for (const r of ripples) {
          const p = Math.max(0, dissolveP - r.delay);
          const rr = p * Math.max(w, h) * 0.7;
          const ra = Math.max(0, 1 - dissolveP) * 0.15;
          ctx.beginPath();
          ctx.arc(cx, cy, rr, 0, Math.PI * 2);
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
      {/* Canvas */}
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

      {/* ═══ BRAND PHASE ═══ */}
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
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotateY: -20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: smoothEase }}
          >
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-[22px] sm:rounded-[26px] md:rounded-[30px] flex items-center justify-center border border-white/[0.08]"
              style={{
                background: "linear-gradient(135deg, hsla(265,75%,62%,0.08), hsla(38,50%,55%,0.04))",
                boxShadow: "0 0 60px hsla(265,75%,62%,0.15), 0 0 120px hsla(38,50%,55%,0.06)",
              }}
            >
              <div
                className="w-[52px] h-[52px] sm:w-[62px] sm:h-[62px] md:w-[72px] md:h-[72px] rounded-[16px] sm:rounded-[20px] flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, hsl(265,75%,62%), hsl(38,50%,55%), hsl(160,55%,48%))" }}
              >
                <Crown className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: smoothEase }}
          >
            <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl tracking-[0.3em] uppercase text-foreground">
              EMPIRE<span className="text-shimmer">.AI</span>
            </h1>
            <motion.div
              className="h-[1px] rounded-full mx-auto"
              style={{ background: "linear-gradient(90deg, transparent, hsl(265,75%,62%), hsl(38,50%,55%), hsl(160,55%,48%), transparent)" }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 140, opacity: 0.5 }}
              transition={{ duration: 0.5, delay: 0.55, ease: smoothEase }}
            />
            <p className="text-[0.5rem] sm:text-[0.55rem] md:text-[0.6rem] tracking-[0.5em] uppercase text-foreground/20 font-heading">
              Il Sistema Operativo del Business
            </p>
          </motion.div>

          <motion.div
            className="w-36 sm:w-44 md:w-52 h-[1.5px] rounded-full overflow-hidden"
            style={{ background: "hsla(265,75%,62%,0.06)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, hsl(265,75%,62%), hsl(38,50%,55%), hsl(160,55%,48%))" }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: TIMINGS.exit / 1000 - 0.5, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, hsla(265,75%,62%,0.1) 0%, hsla(38,50%,55%,0.04) 30%, transparent 60%)",
        }}
      />

      {/* Circuit grid — very subtle */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsla(160,55%,48%,0.5) 1px, transparent 1px), linear-gradient(90deg, hsla(265,50%,55%,0.5) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 60%)",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,hsla(260,20%,4%,0.85)_75%)] pointer-events-none" />

      {/* ═══ DNA Neural Nexus — from Landing Hero ═══ */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none overflow-visible"
        style={{ width: IS_MOBILE ? "55vmin" : "42vmin", height: IS_MOBILE ? "55vmin" : "42vmin" }}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{
          opacity: phase === "brand" ? 0 : phase === "exit" ? 0 : 1,
          scale: phase === "brand" ? 0.4 : phase === "collapse" ? 0.85 : phase === "exit" ? 0.3 : 1,
        }}
        transition={{ duration: 1.2, ease: smoothEase }}
      >
        {/* Ambient glow */}
        <motion.div
          className="absolute inset-[-40%] rounded-full blur-[90px] pointer-events-none"
          style={{ background: "radial-gradient(circle, hsla(38,55%,50%,0.25), hsla(35,50%,55%,0.1), transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* DNA Helix — Outer rotating neural mesh */}
        <motion.svg
          className="absolute inset-[-25%] w-[150%] h-[150%] pointer-events-none"
          viewBox="0 0 300 300"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <linearGradient id="splash-dna-strand1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsla(38,55%,58%,0.7)" />
              <stop offset="100%" stopColor="hsla(38,45%,45%,0.1)" />
            </linearGradient>
            <linearGradient id="splash-dna-strand2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsla(38,55%,55%,0.6)" />
              <stop offset="100%" stopColor="hsla(38,40%,45%,0.1)" />
            </linearGradient>
            <filter id="splash-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Double helix strands */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            const r1 = 105 + Math.sin(angle * 3) * 12;
            const r2 = 105 - Math.sin(angle * 3) * 12;
            const x1 = 150 + Math.cos(angle) * r1;
            const y1 = 150 + Math.sin(angle) * r1;
            const x2 = 150 + Math.cos(angle) * r2;
            const y2 = 150 + Math.sin(angle) * r2;
            const isPrimary = i % 2 === 0;
            return (
              <g key={`helix-${i}`}>
                <circle cx={x1} cy={y1} r={isPrimary ? 2.5 : 1.5}
                  fill={isPrimary ? "hsla(38,55%,58%,0.7)" : "hsla(35,50%,55%,0.5)"}
                  filter="url(#splash-glow)">
                  <animate attributeName="r" values={`${isPrimary ? 2.5 : 1.5};${isPrimary ? 4 : 2.5};${isPrimary ? 2.5 : 1.5}`} dur={`${2 + (i % 5) * 0.4}s`} repeatCount="indefinite" />
                </circle>
                <circle cx={x2} cy={y2} r={isPrimary ? 1.5 : 2.5}
                  fill={isPrimary ? "hsla(35,50%,55%,0.5)" : "hsla(38,55%,58%,0.7)"}
                  filter="url(#splash-glow)">
                  <animate attributeName="r" values={`${isPrimary ? 1.5 : 2.5};${isPrimary ? 2.5 : 4};${isPrimary ? 1.5 : 2.5}`} dur={`${2.5 + (i % 4) * 0.3}s`} repeatCount="indefinite" />
                </circle>
                {i % 3 === 0 && (
                  <line x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="hsla(38,45%,55%,0.15)" strokeWidth="0.8" strokeDasharray="2 2">
                    <animate attributeName="opacity" values="0.08;0.25;0.08" dur={`${3 + (i % 4)}s`} repeatCount="indefinite" />
                  </line>
                )}
              </g>
            );
          })}
          {/* Neural connection lines to center */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const outerX = 150 + Math.cos(angle) * 105;
            const outerY = 150 + Math.sin(angle) * 105;
            const cpX = 150 + Math.cos(angle + 0.3) * 55;
            const cpY = 150 + Math.sin(angle + 0.3) * 55;
            return (
              <path key={`neural-${i}`}
                d={`M ${outerX} ${outerY} Q ${cpX} ${cpY} 150 150`}
                fill="none" stroke="hsla(38,45%,55%,0.08)" strokeWidth="0.6">
                <animate attributeName="stroke-opacity" values="0.04;0.15;0.04" dur={`${4 + i * 0.5}s`} repeatCount="indefinite" />
              </path>
            );
          })}
          {/* Data pulse traveling along neural paths */}
          {Array.from({ length: 4 }).map((_, i) => (
            <circle key={`pulse-${i}`} r="2"
              fill={i % 2 === 0 ? "hsla(38,60%,60%,0.9)" : "hsla(35,55%,55%,0.9)"}
              filter="url(#splash-glow)">
              <animateMotion dur={`${6 + i * 2}s`} repeatCount="indefinite" begin={`${i * 1.5}s`}>
                <mpath xlinkHref={`#splash-orbit-path-${i}`} />
              </animateMotion>
            </circle>
          ))}
          {/* Orbit paths for data pulses */}
          {Array.from({ length: 4 }).map((_, i) => {
            const offset = i * 15;
            return (
              <path key={`orbit-path-${i}`} id={`splash-orbit-path-${i}`}
                d={`M 150 ${45 + offset} A ${105 - offset} ${105 - offset} 0 1 1 149.99 ${45 + offset}`}
                fill="none" stroke="none" />
            );
          })}
        </motion.svg>

        {/* Inner ring — counter-rotating */}
        <motion.div
          className="absolute inset-[8%] rounded-full pointer-events-none"
          style={{
            border: "1px solid hsla(38,50%,55%,0.1)",
            background: "conic-gradient(from 0deg, hsla(265,60%,60%,0.05), transparent 30%, hsla(38,50%,55%,0.05), transparent 60%, hsla(265,60%,60%,0.05))",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />

        {/* Orbiting tech icons — inner ring */}
        {[
          { Icon: Brain, color: "hsla(265,80%,65%,0.9)", glow: "hsla(265,80%,65%,0.3)" },
          { Icon: Cpu, color: "hsla(38,55%,60%,0.9)", glow: "hsla(38,50%,55%,0.3)" },
          { Icon: Fingerprint, color: "hsla(265,70%,70%,0.9)", glow: "hsla(265,70%,70%,0.3)" },
          { Icon: Workflow, color: "hsla(38,60%,55%,0.9)", glow: "hsla(38,60%,55%,0.3)" },
          { Icon: Database, color: "hsla(265,65%,65%,0.9)", glow: "hsla(265,65%,65%,0.3)" },
          { Icon: ScanLine, color: "hsla(38,50%,60%,0.9)", glow: "hsla(38,50%,60%,0.3)" },
        ].map(({ Icon, color, glow }, i) => {
          const innerR = IS_MOBILE ? 42 : 72;
          return (
            <motion.div
              key={`inner-${i}`}
              className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center pointer-events-none"
              style={{
                background: "hsla(260,15%,10%,0.85)",
                border: "1px solid hsla(265,40%,50%,0.2)",
                backdropFilter: "blur(8px)",
                boxShadow: `0 0 16px ${glow}, inset 0 0 6px hsla(265,40%,40%,0.1)`,
                top: "50%",
                left: "50%",
                marginTop: -12,
                marginLeft: -12,
              }}
              animate={{
                x: Array.from({ length: 7 }, (_, k) =>
                  Math.cos((i * Math.PI) / 3 + (k / 6) * Math.PI * 2) * innerR
                ),
                y: Array.from({ length: 7 }, (_, k) =>
                  Math.sin((i * Math.PI) / 3 + (k / 6) * Math.PI * 2) * innerR
                ),
                scale: [1, 1.15, 1, 0.92, 1],
              }}
              transition={{ duration: 14 + i * 1.5, repeat: Infinity, ease: "linear" }}
            >
              <Icon className="w-3 h-3 sm:w-4 sm:h-4" style={{ color }} />
            </motion.div>
          );
        })}

        {/* Outer DNA orbit — additional AI tech icons */}
        {[
          { Icon: BrainCircuit, color: "hsla(265,75%,70%,0.85)", glow: "hsla(265,75%,70%,0.25)" },
          { Icon: Network, color: "hsla(38,55%,58%,0.85)", glow: "hsla(38,55%,58%,0.25)" },
          { Icon: Atom, color: "hsla(265,60%,72%,0.85)", glow: "hsla(265,60%,72%,0.25)" },
          { Icon: Radar, color: "hsla(38,50%,55%,0.85)", glow: "hsla(38,50%,55%,0.25)" },
          { Icon: CircuitBoard, color: "hsla(265,70%,62%,0.85)", glow: "hsla(265,70%,62%,0.25)" },
          { Icon: Waypoints, color: "hsla(38,60%,52%,0.85)", glow: "hsla(38,60%,52%,0.25)" },
          { Icon: Sparkles, color: "hsla(265,85%,75%,0.85)", glow: "hsla(265,85%,75%,0.25)" },
          { Icon: Binary, color: "hsla(38,45%,60%,0.85)", glow: "hsla(38,45%,60%,0.25)" },
        ].map(({ Icon, color, glow }, i) => {
          const total = 8;
          const radius = IS_MOBILE ? 58 : 100;
          const radiusY = IS_MOBILE ? 54 : 92;
          return (
            <motion.div
              key={`outer-${i}`}
              className="absolute w-5 h-5 sm:w-7 sm:h-7 rounded-md flex items-center justify-center pointer-events-none"
              style={{
                background: "hsla(260,15%,8%,0.9)",
                border: "1px solid hsla(265,40%,45%,0.25)",
                backdropFilter: "blur(6px)",
                boxShadow: `0 0 12px ${glow}, inset 0 0 4px hsla(265,30%,35%,0.1)`,
                top: "50%",
                left: "50%",
                marginTop: -10,
                marginLeft: -10,
              }}
              animate={{
                x: Array.from({ length: 7 }, (_, k) =>
                  Math.cos((i / total) * Math.PI * 2 + (k / 6) * Math.PI * 2) * radius
                ),
                y: Array.from({ length: 7 }, (_, k) =>
                  Math.sin((i / total) * Math.PI * 2 + (k / 6) * Math.PI * 2) * radiusY
                ),
                rotate: [0, 180, 360],
                scale: [0.85, 1.1, 0.95, 1.05, 0.85],
              }}
              transition={{ duration: 20 + i * 2, repeat: Infinity, ease: "linear" }}
            >
              <Icon className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" style={{ color }} />
            </motion.div>
          );
        })}

        {/* Micro DNA particles */}
        {Array.from({ length: 12 }).map((_, i) => {
          const isViolet = i % 2 === 0;
          const radius = IS_MOBILE ? (48 + (i % 3) * 6) : (80 + (i % 3) * 12);
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: isViolet ? 4 : 3,
                height: isViolet ? 4 : 3,
                background: isViolet ? "hsla(265,85%,72%,0.8)" : "hsla(38,60%,60%,0.7)",
                boxShadow: isViolet
                  ? "0 0 8px hsla(265,85%,72%,0.5)"
                  : "0 0 8px hsla(38,60%,60%,0.4)",
                top: "50%",
                left: "50%",
                marginTop: -2,
                marginLeft: -2,
              }}
              animate={{
                x: Array.from({ length: 13 }, (_, k) =>
                  Math.cos((i / 12) * Math.PI * 2 + (k / 12) * Math.PI * 2) * radius
                ),
                y: Array.from({ length: 13 }, (_, k) =>
                  Math.sin((i / 12) * Math.PI * 2 + (k / 12) * Math.PI * 2) * (radius * 0.85)
                ),
                opacity: [0.4, 1, 0.6, 1, 0.4],
              }}
              transition={{ duration: 8 + i * 0.7, repeat: Infinity, ease: "linear" }}
            />
          );
        })}

        {/* Pulsing energy rings */}
        <motion.div
          className="absolute inset-[18%] rounded-full pointer-events-none"
          style={{ border: "1.5px solid hsla(265,70%,60%,0.15)" }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-[18%] rounded-full pointer-events-none"
          style={{ border: "1.5px solid hsla(38,50%,55%,0.1)" }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1.5 }}
        />

        {/* Interactive DNA Neural Core */}
        <motion.div
          className="absolute inset-0 z-10 w-[75%] h-[75%] m-auto"
          animate={{ y: [0, -6, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full" style={{ filter: "drop-shadow(0 0 40px hsla(265,70%,60%,0.4))" }}>
            <defs>
              <radialGradient id="splash-core-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsla(265,85%,70%,0.4)" />
                <stop offset="50%" stopColor="hsla(265,70%,50%,0.15)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <radialGradient id="splash-core-center" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsla(265,90%,75%,0.9)" />
                <stop offset="60%" stopColor="hsla(265,80%,55%,0.6)" />
                <stop offset="100%" stopColor="hsla(265,70%,40%,0.2)" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="url(#splash-core-glow)">
              <animate attributeName="r" values="75;85;75" dur="4s" repeatCount="indefinite" />
            </circle>
            {/* DNA Double Helix strands */}
            {Array.from({ length: 20 }).map((_, i) => {
              const t = i / 20;
              const y = 30 + t * 140;
              const x1c = 100 + Math.sin(t * Math.PI * 4) * 28;
              const x2c = 100 - Math.sin(t * Math.PI * 4) * 28;
              const opacity1 = 0.3 + Math.cos(t * Math.PI * 4) * 0.3;
              const opacity2 = 0.3 - Math.cos(t * Math.PI * 4) * 0.3;
              return (
                <g key={`dna-${i}`}>
                  <circle cx={x1c} cy={y} r="2.5" fill={`hsla(265,85%,70%,${opacity1})`}>
                    <animate attributeName="cx" values={`${x1c};${100 + Math.sin((t + 0.05) * Math.PI * 4) * 28};${x1c}`} dur="8s" repeatCount="indefinite" />
                    <animate attributeName="r" values="2.5;3.2;2.5" dur={`${3 + i * 0.2}s`} repeatCount="indefinite" />
                  </circle>
                  <circle cx={x2c} cy={y} r="2.5" fill={`hsla(38,55%,60%,${opacity2})`}>
                    <animate attributeName="cx" values={`${x2c};${100 - Math.sin((t + 0.05) * Math.PI * 4) * 28};${x2c}`} dur="8s" repeatCount="indefinite" />
                    <animate attributeName="r" values="2.5;3;2.5" dur={`${3.5 + i * 0.15}s`} repeatCount="indefinite" />
                  </circle>
                  {i % 2 === 0 && (
                    <line x1={x1c} y1={y} x2={x2c} y2={y}
                      stroke="hsla(265,60%,60%,0.12)" strokeWidth="0.8" strokeDasharray="2 2">
                      <animate attributeName="stroke-opacity" values="0.08;0.2;0.08" dur={`${4 + i * 0.3}s`} repeatCount="indefinite" />
                    </line>
                  )}
                </g>
              );
            })}
            {/* Central neural core — hexagonal */}
            <polygon points="100,72 124,86 124,114 100,128 76,114 76,86"
              fill="hsla(260,20%,10%,0.7)" stroke="hsla(265,70%,60%,0.35)" strokeWidth="1">
              <animate attributeName="stroke-opacity" values="0.25;0.5;0.25" dur="3s" repeatCount="indefinite" />
            </polygon>
            <polygon points="100,80 116,89 116,111 100,120 84,111 84,89"
              fill="url(#splash-core-center)" stroke="hsla(38,50%,55%,0.25)" strokeWidth="0.5" />
            <g transform="translate(100,100)">
              {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const x2 = Math.cos(rad) * 18;
                const y2 = Math.sin(rad) * 18;
                return (
                  <line key={`circuit-${i}`} x1="0" y1="0" x2={x2} y2={y2}
                    stroke={i % 2 === 0 ? "hsla(265,80%,70%,0.4)" : "hsla(38,55%,60%,0.35)"}
                    strokeWidth="0.6">
                    <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
                  </line>
                );
              })}
              <circle r="5" fill="hsla(265,85%,70%,0.9)">
                <animate attributeName="r" values="4;6;4" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle r="3" fill="hsla(38,55%,65%,0.8)">
                <animate attributeName="r" values="2.5;3.5;2.5" dur="2.5s" repeatCount="indefinite" />
              </circle>
            </g>
            {/* Orbiting data particles */}
            {[0, 1, 2, 3, 4, 5].map(i => (
              <circle key={`particle-${i}`} r="1.5"
                fill={i % 2 === 0 ? "hsla(265,90%,75%,0.8)" : "hsla(38,60%,65%,0.8)"}>
                <animateMotion dur={`${5 + i * 1.2}s`} repeatCount="indefinite" begin={`${i * 0.8}s`}>
                  <mpath xlinkHref={`#splash-cell-orbit-${i % 3}`} />
                </animateMotion>
              </circle>
            ))}
            <path id="splash-cell-orbit-0" d="M 100 55 A 45 45 0 1 1 99.99 55" fill="none" stroke="none" />
            <path id="splash-cell-orbit-1" d="M 100 65 A 35 35 0 1 1 99.99 65" fill="none" stroke="none" />
            <path id="splash-cell-orbit-2" d="M 100 75 A 25 25 0 1 1 99.99 75" fill="none" stroke="none" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="hsla(265,60%,60%,0.1)" strokeWidth="0.5" strokeDasharray="4 6">
              <animateTransform attributeName="transform" type="rotate" values="0 100 100;360 100 100" dur="30s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="100" r="75" fill="none" stroke="hsla(38,50%,55%,0.08)" strokeWidth="0.4" strokeDasharray="3 8">
              <animateTransform attributeName="transform" type="rotate" values="360 100 100;0 100 100" dur="40s" repeatCount="indefinite" />
            </circle>
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const outerX = 100 + Math.cos(angle) * 90;
              const outerY = 100 + Math.sin(angle) * 90;
              const cpX = 100 + Math.cos(angle + 0.3) * 50;
              const cpY = 100 + Math.sin(angle + 0.3) * 50;
              return (
                <path key={`synapse-${i}`}
                  d={`M ${outerX} ${outerY} Q ${cpX} ${cpY} 100 100`}
                  fill="none"
                  stroke={i % 2 === 0 ? "hsla(265,60%,60%,0.1)" : "hsla(38,50%,55%,0.08)"}
                  strokeWidth="0.5">
                  <animate attributeName="stroke-opacity" values="0.05;0.18;0.05" dur={`${3.5 + i * 0.5}s`} repeatCount="indefinite" />
                </path>
              );
            })}
          </svg>
        </motion.div>
      </motion.div>

      {/* ═══ HUD Status ═══ */}
      <motion.div
        className="absolute inset-0 flex items-end justify-center pb-16 sm:pb-20 md:pb-24 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "brand" || phase === "exit" ? 0 : 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex flex-col items-center gap-2.5">
          <motion.div
            className="flex items-center gap-4 sm:gap-5"
            initial={{ opacity: 0 }}
            animate={{
              opacity: phase === "pulse" || phase === "orbit" || phase === "collapse" ? 0.8 : phase === "assemble" ? 0.4 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            {[
              { label: "DNA", color: "hsl(265,75%,62%)" },
              { label: "NEURAL", color: "hsl(38,50%,55%)" },
              { label: "DEPLOY", color: "hsl(160,55%,48%)" },
            ].map(({ label, color }, i) => (
              <div key={label} className="flex items-center gap-1.5">
                <div
                  className="w-[4px] h-[4px] rounded-full animate-pulse"
                  style={{ background: color, animationDelay: `${i * 300}ms` }}
                />
                <span
                  className="text-[0.4rem] sm:text-[0.42rem] md:text-[0.45rem] tracking-[0.2em] uppercase font-mono"
                  style={{ color: "hsla(265,50%,62%,0.3)" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="flex items-center gap-2 px-3 py-1 rounded-full"
            style={{
              background: "hsla(252,15%,10%,0.6)",
              border: "0.5px solid hsla(265,50%,55%,0.1)",
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: phase === "pulse" || phase === "orbit" ? 0.8 : phase === "collapse" ? 0.5 : phase === "assemble" ? 0.3 : 0,
            }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "hsla(160,55%,48%,0.8)" }} />
            <span
              className="text-[0.4rem] sm:text-[0.42rem] md:text-[0.48rem] tracking-[0.25em] uppercase font-mono"
              style={{ color: "hsla(265,55%,68%,0.35)" }}
            >
              {phase === "collapse" ? "CORE · READY" : phase === "orbit" ? "NEURAL ORBIT · ACTIVE" : "EMPIRE · GENESIS"}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Tap hint */}
      <motion.div
        className="absolute bottom-6 sm:bottom-8 left-0 right-0 flex justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "assemble" || phase === "pulse" ? 0.35 : 0 }}
        transition={{ delay: 2, duration: 0.4 }}
      >
        <p className="text-[0.45rem] sm:text-[0.5rem] tracking-[0.3em] uppercase text-foreground/15 font-mono">
          {IS_MOBILE ? "Tap per continuare" : "Click per continuare"}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default UnifiedIntro;
