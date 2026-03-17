import { useRef, useEffect, useCallback } from "react";

/**
 * InteractiveParticleSphere — EXACT replica of UnifiedIntro splash canvas
 * Cycles: DNA helix (assemble+pulse) → Orbit ring → loop back
 * NO rose shape, NO collapse. Infinite cinematic loop with pointer interaction.
 */

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

const HELIX_NODES = IS_MOBILE ? 48 : 72;
const MESH_COUNT = IS_MOBILE ? 18 : 36;
const ENERGY_PARTICLES = IS_MOBILE ? 14 : 28;
const CIRCUIT_LINES = IS_MOBILE ? 10 : 18;
const ORBIT_DOTS = IS_MOBILE ? 24 : 36;

const COLORS = {
  gold: { h: 38, s: 50, l: 55 },
  violet: { h: 265, s: 75, l: 62 },
  green: { h: 160, s: 55, l: 48 },
  cyan: { h: 195, s: 70, l: 55 },
};

const colorPalette = [COLORS.violet, COLORS.gold, COLORS.green];

const hsl = (c: { h: number; s: number; l: number }, a: number) =>
  `hsla(${c.h},${c.s}%,${c.l}%,${a})`;

// Cycle timings (seconds) — each full cycle
const CYCLE_DURATION = 12; // total loop
const HELIX_END = 5;       // DNA helix visible 0-5s
const ORBIT_START = 4;     // orbit fades in at 4s
const ORBIT_END = 11;      // orbit fades out at 11s
const HELIX_RESTART = 10;  // helix fades back in at 10s

const InteractiveParticleSphere = ({ size = 280 }: { size?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const pointerRef = useRef({ x: size / 2, y: size / 2, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = size, h = size;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = w / 2, cy = h / 2;
    const turns = 5;
    const baseScale = Math.min(w, h) / (IS_MOBILE ? 400 : 700);

    // ── Background mesh nodes ──
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

    // ── DNA helix nodes ──
    const helixNodes: {
      tx: number; ty: number; x: number; y: number;
      r: number; colorIdx: number; strand: number; baseAngle: number; glow: boolean;
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
        tx: xPos, ty: yPos, x: xPos, y: yPos,
        r: colorIdx === 1 ? 3.5 : 2.5,
        colorIdx, strand, baseAngle: angle,
        glow: i % 4 === 0,
      });
    }

    // ── Energy particles ──
    const energyParticles: { t: number; speed: number; strand: number; colorIdx: number }[] = [];
    for (let i = 0; i < ENERGY_PARTICLES; i++) {
      energyParticles.push({
        t: Math.random(), speed: 0.08 + Math.random() * 0.12,
        strand: Math.random() > 0.5 ? 1 : -1, colorIdx: i % 3,
      });
    }

    // ── Circuit lines ──
    const circuitLines: { x1: number; y1: number; x2: number; y2: number; colorIdx: number; progress: number }[] = [];
    for (let i = 0; i < CIRCUIT_LINES; i++) {
      const isHoriz = i % 2 === 0;
      circuitLines.push({
        x1: isHoriz ? 0.05 : (0.15 + Math.random() * 0.7),
        y1: isHoriz ? (0.1 + Math.random() * 0.8) : 0.05,
        x2: isHoriz ? 0.95 : (0.15 + Math.random() * 0.7),
        y2: isHoriz ? (0.1 + Math.random() * 0.8) : 0.95,
        colorIdx: i % 3, progress: 0,
      });
    }

    // ── Orbit dots ──
    const orbitDots: { angle: number; speed: number; colorIdx: number; size: number }[] = [];
    for (let i = 0; i < ORBIT_DOTS; i++) {
      orbitDots.push({
        angle: (i / ORBIT_DOTS) * Math.PI * 2,
        speed: 0.6 + Math.random() * 0.5,
        colorIdx: i % 3,
        size: 1.5 + Math.random() * 2.5,
      });
    }

    const startTime = performance.now();
    let lastFrame = 0;
    const FRAME_INTERVAL = IS_MOBILE ? 22 : 0;
    const repelR = w * 0.2;

    // Smooth transition helper
    const smoothStep = (edge0: number, edge1: number, x: number) => {
      const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
      return t * t * (3 - 2 * t);
    };

    const draw = (now: number) => {
      if (IS_MOBILE && now - lastFrame < FRAME_INTERVAL) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrame = now;

      const elapsed = (now - startTime) / 1000;
      const cycleTime = elapsed % CYCLE_DURATION;
      const scale = baseScale;
      const ptr = pointerRef.current;
      const helixRotation = elapsed * 0.4;
      const coreRadius = Math.min(w, h) * 0.16;

      // Phase blending — helix and orbit fade in/out smoothly
      const helixAlpha = cycleTime < HELIX_END
        ? smoothStep(0, 0.8, cycleTime) // fade in
        : cycleTime > HELIX_RESTART
          ? smoothStep(HELIX_RESTART, HELIX_RESTART + 1.5, cycleTime) // fade back in
          : 1 - smoothStep(ORBIT_START, ORBIT_START + 1.5, cycleTime); // fade out

      const orbitAlpha = cycleTime < ORBIT_START
        ? 0
        : cycleTime < ORBIT_END
          ? smoothStep(ORBIT_START, ORBIT_START + 1.5, cycleTime)
          : 1 - smoothStep(ORBIT_END, ORBIT_END + 1, cycleTime);

      ctx.clearRect(0, 0, w, h);

      // ═══ CIRCUIT DATA PATHWAYS ═══
      if (helixAlpha > 0.1) {
        for (const cl of circuitLines) {
          cl.progress = (cl.progress + 0.006) % 1.2;
          const p = Math.min(cl.progress, 1);
          const c = colorPalette[cl.colorIdx];
          const lx = cl.x1 + (cl.x2 - cl.x1) * p;
          const ly = cl.y1 + (cl.y2 - cl.y1) * p;
          ctx.beginPath();
          ctx.moveTo(cl.x1 * w, cl.y1 * h);
          ctx.lineTo(lx * w, ly * h);
          ctx.strokeStyle = hsl(c, 0.04 * helixAlpha);
          ctx.lineWidth = 0.5;
          ctx.stroke();
          if (p > 0.5) {
            ctx.beginPath();
            ctx.arc(lx * w, ly * h, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = hsl(c, 0.12 * helixAlpha);
            ctx.fill();
          }
        }
      }

      // ═══ CENTRAL INTELLIGENCE CORE ═══
      const corePulse = 1 + Math.sin(elapsed * 1.8) * 0.08;
      const cAlpha = Math.max(helixAlpha, orbitAlpha) * 0.2;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * corePulse * 1.5);
      coreGrad.addColorStop(0, hsl(COLORS.violet, cAlpha * 1.5));
      coreGrad.addColorStop(0.3, hsl(COLORS.gold, cAlpha * 0.7));
      coreGrad.addColorStop(0.6, hsl(COLORS.green, cAlpha * 0.3));
      coreGrad.addColorStop(1, "hsla(265,75%,62%,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * corePulse * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Concentric rings
      const ringColors = [COLORS.violet, COLORS.gold, COLORS.green];
      const ringRadii = [0.45, 0.65, 0.85];
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, coreRadius * ringRadii[i] * corePulse, 0, Math.PI * 2);
        ctx.strokeStyle = hsl(ringColors[i], 0.3 * (1 - i * 0.2) * Math.max(helixAlpha, orbitAlpha));
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // ═══ NEURAL MESH BACKGROUND ═══
      if (helixAlpha > 0.05) {
        const checkRange = IS_MOBILE ? 4 : 6;
        for (const n of meshNodes) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > 1) n.vx *= -1;
          if (n.y < 0 || n.y > 1) n.vy *= -1;
          ctx.beginPath();
          ctx.arc(n.x * w, n.y * h, n.r, 0, Math.PI * 2);
          ctx.fillStyle = hsl(colorPalette[n.colorIdx], 0.1 * helixAlpha);
          ctx.fill();
        }
        for (let i = 0; i < meshNodes.length; i++) {
          for (let j = i + 1; j < Math.min(i + checkRange, meshNodes.length); j++) {
            const dx = meshNodes[i].x - meshNodes[j].x;
            const dy = meshNodes[i].y - meshNodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.16) {
              const a = (1 - dist / 0.16) * 0.1 * 0.4 * helixAlpha;
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

      // ═══ DNA DOUBLE HELIX (with pointer repulsion) ═══
      if (helixAlpha > 0.05) {
        const amp = 0.18;
        for (const n of helixNodes) {
          const rotatedAngle = n.baseAngle + helixRotation;
          const ampVar = amp + Math.sin(n.ty * Math.PI) * 0.06;
          n.x = 0.5 + Math.sin(rotatedAngle) * ampVar * n.strand;
          n.y = n.ty;
        }

        // Backbone
        for (let i = 0; i < helixNodes.length - 1; i++) {
          const a = helixNodes[i], b = helixNodes[i + 1];
          let ax = a.x * w, ay = a.y * h, bx = b.x * w, by = b.y * h;
          if (ptr.active) {
            for (const [orig, isA] of [[{ px: ax, py: ay }, true], [{ px: bx, py: by }, false]] as any[]) {
              const ddx = orig.px - ptr.x, ddy = orig.py - ptr.y;
              const dd = Math.sqrt(ddx * ddx + ddy * ddy);
              if (dd > 1 && dd < repelR) {
                const force = (1 - dd / repelR) * 18;
                if (isA) { ax += (ddx / dd) * force; ay += (ddy / dd) * force; }
                else { bx += (ddx / dd) * force; by += (ddy / dd) * force; }
              }
            }
          }
          const dx = ax - bx, dy = ay - by;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < w * 0.14) {
            ctx.beginPath();
            ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
            ctx.strokeStyle = hsl(colorPalette[a.colorIdx], (1 - dist / (w * 0.14)) * 0.35 * helixAlpha);
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Base pairs
        for (let i = 0; i < helixNodes.length - 1; i += 2) {
          if (i + 1 < helixNodes.length && helixNodes[i].strand !== helixNodes[i + 1].strand) {
            const a = helixNodes[i], b = helixNodes[i + 1];
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h); ctx.lineTo(b.x * w, b.y * h);
            ctx.strokeStyle = hsl(colorPalette[(i / 2) % 3], 0.1 * helixAlpha);
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }

        // Helix nodes with glow
        for (const n of helixNodes) {
          let px = n.x * w, py = n.y * h;
          if (ptr.active) {
            const ddx = px - ptr.x, ddy = py - ptr.y;
            const dd = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dd > 1 && dd < repelR) {
              const force = (1 - dd / repelR) * 18;
              px += (ddx / dd) * force; py += (ddy / dd) * force;
            }
          }
          const c = colorPalette[n.colorIdx];
          if (n.glow) {
            const glowR = n.r * 4;
            const glowGrad = ctx.createRadialGradient(px, py, 0, px, py, glowR);
            glowGrad.addColorStop(0, hsl(c, 0.2 * helixAlpha));
            glowGrad.addColorStop(1, hsl(c, 0));
            ctx.beginPath(); ctx.arc(px, py, glowR, 0, Math.PI * 2);
            ctx.fillStyle = glowGrad; ctx.fill();
          }
          ctx.beginPath();
          ctx.arc(px, py, n.r * scale * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = hsl(c, 0.85 * helixAlpha);
          ctx.fill();
        }

        // Energy particles
        for (const ep of energyParticles) {
          ep.t = (ep.t + ep.speed * 0.016) % 1;
          const angle = ep.t * Math.PI * 2 * turns + helixRotation;
          const ampVar = amp + Math.sin(ep.t * Math.PI) * 0.06;
          let epx = (0.5 + Math.sin(angle) * ampVar * ep.strand) * w;
          let epy = (0.05 + ep.t * 0.9) * h;
          if (ptr.active) {
            const ddx = epx - ptr.x, ddy = epy - ptr.y;
            const dd = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dd > 1 && dd < repelR) {
              const force = (1 - dd / repelR) * 12;
              epx += (ddx / dd) * force; epy += (ddy / dd) * force;
            }
          }
          const epAlpha = 0.6 * helixAlpha * Math.sin(ep.t * Math.PI);
          const c = colorPalette[ep.colorIdx];
          const trailGrad = ctx.createRadialGradient(epx, epy, 0, epx, epy, 8 * scale);
          trailGrad.addColorStop(0, hsl(c, epAlpha));
          trailGrad.addColorStop(1, hsl(c, 0));
          ctx.beginPath(); ctx.arc(epx, epy, 8 * scale, 0, Math.PI * 2);
          ctx.fillStyle = trailGrad; ctx.fill();
          ctx.beginPath(); ctx.arc(epx, epy, 1.5 * scale, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(0,0%,100%,${epAlpha * 0.8})`; ctx.fill();
        }

        // Scanning beam
        if (helixAlpha > 0.5) {
          const scanY = (Math.sin(elapsed * 1.2) * 0.5 + 0.5) * h;
          const scanGrad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
          scanGrad.addColorStop(0, hsl(COLORS.cyan, 0));
          scanGrad.addColorStop(0.5, hsl(COLORS.cyan, 0.06 * helixAlpha));
          scanGrad.addColorStop(1, hsl(COLORS.cyan, 0));
          ctx.fillStyle = scanGrad;
          ctx.fillRect(0, scanY - 40, w, 80);
        }
      }

      // ═══ ORBIT PHASE — Intelligence Ring (EXACT from splash) ═══
      if (orbitAlpha > 0.01) {
        const maxOrbitR = Math.min(w, h) * 0.35;
        const orbitRadius = maxOrbitR;
        const rotSpeed = elapsed * 0.6;
        const helixStrands = 3;
        const helixSegments = IS_MOBILE ? 80 : 140;
        const helixAmp = 10 * scale;
        const helixFreq = 8;

        // Triple helix ring strands
        for (let s = 0; s < helixStrands; s++) {
          const strandColor = colorPalette[s];
          const phaseOffset = (s / helixStrands) * Math.PI * 2;

          ctx.beginPath();
          for (let i = 0; i <= helixSegments; i++) {
            const t = i / helixSegments;
            const baseAngle = t * Math.PI * 2 + rotSpeed * (0.5 + s * 0.1);
            const waveOffset = Math.sin(t * Math.PI * 2 * helixFreq + phaseOffset + elapsed * 2.5) * helixAmp;
            const r = orbitRadius + waveOffset;
            const px = cx + Math.cos(baseAngle) * r;
            const py = cy + Math.sin(baseAngle) * r;
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = hsl(strandColor, 0.4 * orbitAlpha);
          ctx.lineWidth = 1.5 * scale;
          ctx.stroke();

          // Glow layer
          ctx.beginPath();
          for (let i = 0; i <= helixSegments; i++) {
            const t = i / helixSegments;
            const baseAngle = t * Math.PI * 2 + rotSpeed * (0.5 + s * 0.1);
            const waveOffset = Math.sin(t * Math.PI * 2 * helixFreq + phaseOffset + elapsed * 2.5) * helixAmp;
            const r = orbitRadius + waveOffset;
            const px = cx + Math.cos(baseAngle) * r;
            const py = cy + Math.sin(baseAngle) * r;
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = hsl(strandColor, 0.08 * orbitAlpha);
          ctx.lineWidth = 6 * scale;
          ctx.stroke();
        }

        // Cross-links (base pairs on ring)
        const rungCount = IS_MOBILE ? 16 : 28;
        for (let i = 0; i < rungCount; i++) {
          const t = i / rungCount;
          const baseAngle = t * Math.PI * 2 + rotSpeed * 0.5;
          const wave1 = Math.sin(t * Math.PI * 2 * helixFreq + elapsed * 2.5) * helixAmp;
          const wave2 = Math.sin(t * Math.PI * 2 * helixFreq + (2 / 3) * Math.PI * 2 + elapsed * 2.5) * helixAmp;
          const r1 = orbitRadius + wave1, r2 = orbitRadius + wave2;
          const px1 = cx + Math.cos(baseAngle) * r1, py1 = cy + Math.sin(baseAngle) * r1;
          const px2 = cx + Math.cos(baseAngle) * r2, py2 = cy + Math.sin(baseAngle) * r2;
          const rungA = 0.12 * orbitAlpha * (0.5 + 0.5 * Math.sin(t * Math.PI * 4 + elapsed));
          ctx.beginPath(); ctx.moveTo(px1, py1); ctx.lineTo(px2, py2);
          ctx.strokeStyle = hsl(COLORS.gold, rungA);
          ctx.lineWidth = 0.5; ctx.stroke();
        }

        // Data nodes on the ring
        for (const dot of orbitDots) {
          const a = dot.angle + rotSpeed * dot.speed;
          const strandIdx = Math.floor(dot.angle / (Math.PI * 2 / 3)) % 3;
          const phaseOff = (strandIdx / 3) * Math.PI * 2;
          const waveOff = Math.sin(dot.angle * helixFreq + phaseOff + elapsed * 2.5) * helixAmp;
          const r = orbitRadius + waveOff;
          const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
          const c = colorPalette[dot.colorIdx];
          const pulse = 0.7 + 0.3 * Math.sin(elapsed * 3 + dot.angle * 3);

          const glowR = dot.size * 3.5 * pulse * scale;
          const glowGrad = ctx.createRadialGradient(px, py, 0, px, py, glowR);
          glowGrad.addColorStop(0, hsl(c, 0.35 * orbitAlpha * pulse));
          glowGrad.addColorStop(0.5, hsl(c, 0.08 * orbitAlpha));
          glowGrad.addColorStop(1, hsl(c, 0));
          ctx.beginPath(); ctx.arc(px, py, glowR, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad; ctx.fill();

          ctx.beginPath();
          ctx.arc(px, py, dot.size * pulse * scale * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = hsl(c, 0.9 * orbitAlpha);
          ctx.fill();
        }

        // Rotating scan arcs
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

        // Inner neural network
        if (orbitAlpha > 0.3) {
          const neuralA = (orbitAlpha - 0.3) * 1.43 * 0.12;
          const neuralNodes = IS_MOBILE ? 10 : 16;
          const neuralR = orbitRadius * 0.5;
          const nPos: { x: number; y: number }[] = [];
          for (let i = 0; i < neuralNodes; i++) {
            const na = (i / neuralNodes) * Math.PI * 2 + elapsed * 0.25;
            const nr = neuralR * (0.3 + 0.7 * Math.abs(Math.sin(na * 2 + elapsed * 0.7)));
            const nx = cx + Math.cos(na) * nr, ny = cy + Math.sin(na) * nr;
            nPos.push({ x: nx, y: ny });
            ctx.beginPath(); ctx.arc(nx, ny, 1.5 * scale, 0, Math.PI * 2);
            ctx.fillStyle = hsl(COLORS.violet, neuralA * 3); ctx.fill();
          }
          for (let i = 0; i < nPos.length; i++) {
            for (let j = i + 1; j < nPos.length; j++) {
              if ((i + j) % 3 === 0) {
                const dx = nPos[i].x - nPos[j].x, dy = nPos[i].y - nPos[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < neuralR * 1.2) {
                  ctx.beginPath(); ctx.moveTo(nPos[i].x, nPos[i].y); ctx.lineTo(nPos[j].x, nPos[j].y);
                  ctx.strokeStyle = hsl(COLORS.violet, neuralA * (1 - dist / (neuralR * 1.2)));
                  ctx.lineWidth = 0.4; ctx.stroke();
                }
              }
            }
          }
          // Brain core
          const brainPulse = 1 + Math.sin(elapsed * 2.5) * 0.1;
          const brainR = 14 * scale;
          const brainGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, brainR * brainPulse * 2);
          brainGrad.addColorStop(0, `hsla(0,0%,100%,${0.25 * neuralA * 6})`);
          brainGrad.addColorStop(0.2, hsl(COLORS.violet, neuralA * 4));
          brainGrad.addColorStop(0.5, hsl(COLORS.gold, neuralA * 2.5));
          brainGrad.addColorStop(1, hsl(COLORS.violet, 0));
          ctx.beginPath(); ctx.arc(cx, cy, brainR * brainPulse * 2, 0, Math.PI * 2);
          ctx.fillStyle = brainGrad; ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [size]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerRef.current.x = e.clientX - rect.left;
    pointerRef.current.y = e.clientY - rect.top;
    pointerRef.current.active = true;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="touch-none"
      style={{ width: size, height: size }}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerMove}
      onPointerLeave={() => { pointerRef.current.active = false; }}
    />
  );
};

export default InteractiveParticleSphere;
