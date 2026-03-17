import { useRef, useEffect, useCallback, useMemo } from "react";

/**
 * Interactive 3D Particle Sphere — Empire IA DNA Neural Core
 * - 3D Fibonacci sphere with rotating DNA helix strands
 * - Neural ring particles circulating inside, communicating via curved synapses
 * - Traveling data pulses between nodes
 * - On hover/touch: morphs into "EMPIRE IA GROUP"
 * - Drag: manual 3D orbit
 */

function generateTextPoints(
  text: string, cx: number, cy: number, scale: number
): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  const font: Record<string, number[][]> = {
    E: [[0,0],[1,0],[2,0],[3,0],[0,1],[0,2],[1,2],[2,2],[0,3],[0,4],[1,4],[2,4],[3,4]],
    M: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,1],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4],[1,1],[3,1],[2,2]],
    P: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[3,0],[3,1],[3,2],[2,2],[1,2]],
    I: [[0,0],[1,0],[2,0],[1,1],[1,2],[1,3],[0,4],[1,4],[2,4]],
    R: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[3,0],[3,1],[3,2],[2,2],[1,2],[2,3],[3,4]],
    G: [[1,0],[2,0],[3,0],[0,1],[0,2],[0,3],[1,4],[2,4],[3,4],[3,3],[3,2],[2,2]],
    O: [[1,0],[2,0],[0,1],[3,1],[0,2],[3,2],[0,3],[3,3],[1,4],[2,4]],
    U: [[0,0],[0,1],[0,2],[0,3],[3,0],[3,1],[3,2],[3,3],[1,4],[2,4]],
    A: [[1,0],[2,0],[0,1],[3,1],[0,2],[1,2],[2,2],[3,2],[0,3],[3,3],[0,4],[3,4]],
    " ": [],
  };
  const chars = text.split("");
  const charWidths = chars.map(c => {
    const glyph = font[c];
    if (!glyph || glyph.length === 0) return 2;
    return Math.max(...glyph.map(p => p[0])) + 2;
  });
  const totalWidth = charWidths.reduce((s, w) => s + w, 0);
  let offsetX = cx - (totalWidth * scale) / 2;
  for (let ci = 0; ci < chars.length; ci++) {
    const glyph = font[chars[ci]] || [];
    for (const [gx, gy] of glyph) {
      for (let d = 0; d < 3; d++) {
        pts.push({
          x: offsetX + gx * scale + (Math.random() - 0.5) * scale * 0.5,
          y: cy - (2 * scale) + gy * scale + (Math.random() - 0.5) * scale * 0.5,
        });
      }
    }
    offsetX += charWidths[ci] * scale;
  }
  return pts;
}

const InteractiveParticleSphere = ({ size = 280 }: { size?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({
    x: 0, y: 0,
    active: false,
    pressing: false,
    hoverTime: 0,
    releaseTime: 0,
    dragAngleX: 0,
    dragAngleY: 0,
    lastX: 0, lastY: 0,
  });
  const timeRef = useRef(0);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const PARTICLE_COUNT = isMobile ? 700 : 1400;
  const SPHERE_RADIUS = size * 0.33;
  const DNA_PARTICLES = isMobile ? 100 : 200;
  const ORBIT_PARTICLES = isMobile ? 24 : 48;
  const NEURAL_PULSE_COUNT = isMobile ? 16 : 35;
  const NEURAL_RING_COUNT = isMobile ? 30 : 60;

  const textPoints = useMemo(
    () => generateTextPoints("EMPIRE IA", size / 2, size * 0.42, size * 0.052),
    [size]
  );
  const subTextPoints = useMemo(
    () => generateTextPoints("GROUP", size / 2, size * 0.62, size * 0.04),
    [size]
  );
  const allTextPoints = useMemo(
    () => [...textPoints, ...subTextPoints],
    [textPoints, subTextPoints]
  );

  const GOLD = "hsla(38,55%,58%,";
  const WARM = "hsla(35,50%,55%,";
  const VIOLET = "hsla(265,70%,65%,";
  const DEEP_V = "hsla(265,60%,58%,";
  const LIGHT_G = "hsla(32,60%,62%,";
  const PURPLE = "hsla(280,50%,60%,";
  const CYAN = "hsla(185,60%,55%,";
  const colors = [GOLD, WARM, VIOLET, DEEP_V, LIGHT_G, PURPLE, CYAN];

  interface Particle {
    theta: number; phi: number; radius: number;
    baseSize: number; color: string;
    ox: number; oy: number; speed: number;
    morphX: number; morphY: number;
    type: "sphere" | "dna" | "orbit" | "neural_ring";
    pulse: number;
  }

  interface NeuralPulse {
    fromIdx: number; toIdx: number;
    progress: number; speed: number;
    color: string; size: number;
  }

  const particlesRef = useRef<Particle[]>([]);
  const pulsesRef = useRef<NeuralPulse[]>([]);

  const initParticles = useCallback(() => {
    const particles: Particle[] = [];
    const tLen = allTextPoints.length;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
      const theta = ((Math.sqrt(5) + 1) / 2) * i * Math.PI * 2;
      const phi = Math.acos(y);
      const mIdx = tLen > 0 ? i % tLen : 0;
      particles.push({
        theta, phi,
        radius: SPHERE_RADIUS * (0.9 + Math.random() * 0.2),
        baseSize: 0.3 + Math.random() * 1.1,
        color: colors[i % colors.length],
        ox: 0, oy: 0,
        speed: 0.5 + Math.random() * 0.7,
        morphX: tLen > 0 ? allTextPoints[mIdx].x : size / 2,
        morphY: tLen > 0 ? allTextPoints[mIdx].y : size / 2,
        type: "sphere",
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // DNA double helix
    for (let i = 0; i < DNA_PARTICLES; i++) {
      const t = i / DNA_PARTICLES;
      const helixAngle = t * Math.PI * 10;
      const strand = i % 2 === 0 ? 1 : -1;
      const phi = Math.PI * 0.1 + t * Math.PI * 0.8;
      const theta = helixAngle + strand * 0.4;
      const mIdx = tLen > 0 ? i % tLen : 0;
      particles.push({
        theta, phi,
        radius: SPHERE_RADIUS * 1.08,
        baseSize: 1.0 + Math.random() * 1.0,
        color: strand > 0 ? VIOLET : GOLD,
        ox: 0, oy: 0,
        speed: 0.35 + Math.random() * 0.45,
        morphX: tLen > 0 ? allTextPoints[mIdx].x : size / 2,
        morphY: tLen > 0 ? allTextPoints[mIdx].y : size / 2,
        type: "dna",
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Orbital rings
    for (let i = 0; i < ORBIT_PARTICLES; i++) {
      const angle = (i / ORBIT_PARTICLES) * Math.PI * 2;
      const ring = i % 3;
      const mIdx = tLen > 0 ? i % tLen : 0;
      particles.push({
        theta: angle,
        phi: Math.PI / 2 + (ring - 1) * 0.3,
        radius: SPHERE_RADIUS * (1.3 + ring * 0.12),
        baseSize: 0.7 + Math.random() * 0.8,
        color: i % 4 === 0 ? GOLD : i % 4 === 1 ? VIOLET : i % 4 === 2 ? CYAN : PURPLE,
        ox: 0, oy: 0,
        speed: 0.8 + Math.random() * 0.8 + ring * 0.2,
        morphX: tLen > 0 ? allTextPoints[mIdx].x : size / 2,
        morphY: tLen > 0 ? allTextPoints[mIdx].y : size / 2,
        type: "orbit",
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Neural ring particles — orbit inside sphere, communicate via pulses
    for (let i = 0; i < NEURAL_RING_COUNT; i++) {
      const angle = (i / NEURAL_RING_COUNT) * Math.PI * 2;
      const layer = i % 4;
      const r = SPHERE_RADIUS * (0.5 + layer * 0.25);
      const mIdx = tLen > 0 ? i % tLen : 0;
      particles.push({
        theta: angle,
        phi: Math.PI * 0.3 + (layer * 0.35),
        radius: r,
        baseSize: 1.2 + Math.random() * 0.8,
        color: layer % 2 === 0 ? CYAN : VIOLET,
        ox: 0, oy: 0,
        speed: 1.2 + layer * 0.3 + Math.random() * 0.5,
        morphX: tLen > 0 ? allTextPoints[mIdx].x : size / 2,
        morphY: tLen > 0 ? allTextPoints[mIdx].y : size / 2,
        type: "neural_ring",
        pulse: Math.random() * Math.PI * 2,
      });
    }

    particlesRef.current = particles;

    const pulses: NeuralPulse[] = [];
    for (let i = 0; i < NEURAL_PULSE_COUNT; i++) {
      pulses.push({
        fromIdx: Math.floor(Math.random() * particles.length),
        toIdx: Math.floor(Math.random() * particles.length),
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.008,
        color: i % 4 === 0 ? GOLD : i % 4 === 1 ? VIOLET : i % 4 === 2 ? CYAN : PURPLE,
        size: 1.5 + Math.random() * 2,
      });
    }
    pulsesRef.current = pulses;
  }, [PARTICLE_COUNT, SPHERE_RADIUS, DNA_PARTICLES, ORBIT_PARTICLES, NEURAL_PULSE_COUNT, NEURAL_RING_COUNT, size, allTextPoints]);

  useEffect(() => { initParticles(); }, [initParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;

    const animate = () => {
      timeRef.current += 1;
      const t = timeRef.current;

      ctx.clearRect(0, 0, size, size);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;
      const pulses = pulsesRef.current;

      // Morph on hover/touch
      if (mouse.active) {
        mouse.hoverTime = Math.min(mouse.hoverTime + 0.018, 1);
        mouse.releaseTime = 0;
      } else {
        mouse.releaseTime += 1;
        if (mouse.releaseTime > 120) {
          mouse.hoverTime = Math.max(mouse.hoverTime - 0.008, 0);
        }
      }
      const morphRaw = mouse.hoverTime;
      const morphFactor = morphRaw * morphRaw * (3 - 2 * morphRaw);

      // Drag orbit
      const dragX = mouse.dragAngleX;
      const dragY = mouse.dragAngleY;
      if (!mouse.pressing) {
        mouse.dragAngleX *= 0.97;
        mouse.dragAngleY *= 0.97;
      }

      const autoRot = t * 0.0004 + dragX;
      const tiltAngle = 0.2 + dragY * 0.3;

      // Background glow
      const bgGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, SPHERE_RADIUS * 2);
      bgGlow.addColorStop(0, `hsla(265,60%,55%,${0.04 + morphFactor * 0.08})`);
      bgGlow.addColorStop(0.3, `hsla(38,50%,55%,${0.02 + morphFactor * 0.04})`);
      bgGlow.addColorStop(1, "transparent");
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, size, size);

      // Orbital ring guides
      for (let ring = 0; ring < 3; ring++) {
        ctx.save();
        ctx.globalAlpha = 0.04 + morphFactor * 0.03;
        ctx.strokeStyle = ring === 0 ? "hsla(38,45%,55%,0.4)" : ring === 1 ? "hsla(265,50%,55%,0.3)" : "hsla(185,50%,55%,0.25)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        const rMult = 1.3 + ring * 0.12;
        const flatMult = 0.35 + ring * 0.05;
        ctx.ellipse(cx, cy, SPHERE_RADIUS * rMult, SPHERE_RADIUS * flatMult, autoRot * (2 + ring) + ring * 1.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Project all particles in 3D
      type Proj = { x: number; y: number; z: number; sz: number; color: string; alpha: number; type: string; idx: number };
      const projected: Proj[] = [];

      for (let pi = 0; pi < particles.length; pi++) {
        const p = particles[pi];
        const breathe = Math.sin(t * 0.0025 + p.pulse) * 0.025;
        const r = p.radius * (1 + breathe);
        const sinPhi = Math.sin(p.phi);
        const cosPhi = Math.cos(p.phi);
        const speedMult = p.type === "neural_ring" ? p.speed * 1.5 : p.speed;
        const rotTheta = p.theta + autoRot * speedMult;

        let sx = r * sinPhi * Math.cos(rotTheta);
        let sy = r * cosPhi;
        let sz = r * sinPhi * Math.sin(rotTheta);

        const cosT = Math.cos(tiltAngle), sinT = Math.sin(tiltAngle);
        const ry = sy * cosT - sz * sinT;
        const rz = sy * sinT + sz * cosT;
        sy = ry; sz = rz;

        let worldX = cx + sx;
        let worldY = cy + sy;

        // Morph toward text
        if (morphFactor > 0.005) {
          worldX = worldX * (1 - morphFactor) + p.morphX * morphFactor;
          worldY = worldY * (1 - morphFactor) + p.morphY * morphFactor;
          sz *= (1 - morphFactor * 0.92);
        }

        // Mouse scatter
        if (mouse.active && morphFactor < 0.35 && !mouse.pressing) {
          const dx = worldX - mouse.x;
          const dy = worldY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const force = Math.max(0, 1 - dist / (SPHERE_RADIUS * 1.2));
          const push = force * force * 40;
          p.ox += (dx / (dist || 1)) * push * 0.05;
          p.oy += (dy / (dist || 1)) * push * 0.05;
        }

        p.ox *= 0.94;
        p.oy *= 0.94;

        const finalX = worldX + p.ox;
        const finalY = worldY + p.oy;
        const depthNorm = (sz + SPHERE_RADIUS * 1.5) / (SPHERE_RADIUS * 3);
        const alpha = Math.min(0.12 + depthNorm * 0.8 + morphFactor * 0.15, 1);
        const dotSize = p.baseSize * (0.25 + depthNorm * 0.95);

        projected.push({ x: finalX, y: finalY, z: sz, sz: dotSize, color: p.color, alpha, type: p.type, idx: pi });
      }

      projected.sort((a, b) => a.z - b.z);

      // Neural synapse connections
      const connThreshold = isMobile ? 450 : 600;
      const maxSample = isMobile ? 80 : 160;
      const front = projected.filter(p => p.z > -SPHERE_RADIUS * 0.25);
      const sample = front.slice(-maxSample);

      ctx.lineWidth = 0.3;
      for (let i = 0; i < sample.length; i++) {
        const lim = Math.min(i + 6, sample.length);
        for (let j = i + 1; j < lim; j++) {
          const dx = sample[i].x - sample[j].x;
          const dy = sample[i].y - sample[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < connThreshold) {
            const base = (1 - d2 / connThreshold);
            const pulse = Math.sin(t * 0.012 + i * 0.4) * 0.5 + 0.5;
            const a = base * (0.08 + morphFactor * 0.06) * (0.5 + pulse * 0.5);
            const isDna = sample[i].type === "dna" || sample[j].type === "dna";
            const isNeural = sample[i].type === "neural_ring" || sample[j].type === "neural_ring";
            const isOrbit = sample[i].type === "orbit" || sample[j].type === "orbit";
            ctx.strokeStyle = isDna
              ? `hsla(38,50%,55%,${a.toFixed(3)})`
              : isNeural
                ? `hsla(185,55%,58%,${(a * 0.9).toFixed(3)})`
                : isOrbit
                  ? `hsla(185,50%,55%,${(a * 0.7).toFixed(3)})`
                  : `hsla(265,50%,60%,${(a * 0.6).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(sample[i].x, sample[i].y);
            ctx.lineTo(sample[j].x, sample[j].y);
            ctx.stroke();
          }
        }
      }

      // DNA bridge lines with flowing dashes
      const dnaP = projected.filter(p => p.type === "dna");
      ctx.lineWidth = 0.4;
      for (let i = 0; i < dnaP.length - 1; i += 2) {
        const a = dnaP[i], b = dnaP[i + 1];
        if (!a || !b) continue;
        const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
        if (dist < SPHERE_RADIUS * 1.5) {
          const la = Math.max(0.04, (1 - dist / (SPHERE_RADIUS * 1.5)) * 0.18);
          const flow = (Math.sin(t * 0.018 + i * 0.6) + 1) * 0.5;
          ctx.strokeStyle = `hsla(38,45%,55%,${(la * (0.4 + flow * 0.6)).toFixed(3)})`;
          ctx.setLineDash([1.5 + flow * 4, 1.5]);
          ctx.lineDashOffset = -t * 0.15;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.lineDashOffset = 0;
        }
      }

      // Neural ring internal communication arcs (curved bezier)
      const neuralP = projected.filter(p => p.type === "neural_ring");
      ctx.lineWidth = 0.35;
      for (let i = 0; i < neuralP.length; i++) {
        const next = neuralP[(i + 1) % neuralP.length];
        const cur = neuralP[i];
        const dx = cur.x - next.x;
        const dy = cur.y - next.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < SPHERE_RADIUS * 1.2) {
          const wave = (Math.sin(t * 0.015 + i * 0.8) + 1) * 0.5;
          const a = (1 - dist / (SPHERE_RADIUS * 1.2)) * 0.15 * (0.5 + wave * 0.5);
          ctx.strokeStyle = `hsla(185,55%,58%,${a.toFixed(3)})`;
          const midX = (cur.x + next.x) / 2 + (cur.y - next.y) * 0.15;
          const midY = (cur.y + next.y) / 2 + (next.x - cur.x) * 0.15;
          ctx.beginPath();
          ctx.moveTo(cur.x, cur.y);
          ctx.quadraticCurveTo(midX, midY, next.x, next.y);
          ctx.stroke();
        }
      }

      // Draw particles
      for (const pt of projected) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.sz, 0, Math.PI * 2);
        ctx.fillStyle = pt.color + pt.alpha.toFixed(2) + ")";
        ctx.fill();

        if ((pt.type === "dna" || pt.type === "orbit" || pt.type === "neural_ring") && pt.sz > 0.5) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.sz * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = pt.color + (pt.alpha * 0.06).toFixed(3) + ")";
          ctx.fill();
        }
      }

      // Neural traveling pulses with trails
      for (const np of pulses) {
        np.progress += np.speed;
        if (np.progress >= 1) {
          np.progress = 0;
          np.fromIdx = np.toIdx;
          np.toIdx = Math.floor(Math.random() * projected.length);
        }
        const from = projected[np.fromIdx % projected.length];
        const to = projected[np.toIdx % projected.length];
        if (!from || !to) continue;

        const px = from.x + (to.x - from.x) * np.progress;
        const py = from.y + (to.y - from.y) * np.progress;
        const pa = Math.sin(np.progress * Math.PI);

        // Glow
        ctx.beginPath();
        ctx.arc(px, py, np.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = np.color + (pa * 0.08).toFixed(3) + ")";
        ctx.fill();
        // Core
        ctx.beginPath();
        ctx.arc(px, py, np.size, 0, Math.PI * 2);
        ctx.fillStyle = np.color + (pa * 0.7).toFixed(2) + ")";
        ctx.fill();
        // Trail
        if (np.progress > 0.1) {
          const trailX = from.x + (to.x - from.x) * (np.progress - 0.1);
          const trailY = from.y + (to.y - from.y) * (np.progress - 0.1);
          ctx.strokeStyle = np.color + (pa * 0.15).toFixed(3) + ")";
          ctx.lineWidth = 0.4;
          ctx.beginPath();
          ctx.moveTo(trailX, trailY);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
      }

      // Core glow
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, SPHERE_RADIUS * 0.35);
      coreGrad.addColorStop(0, `hsla(265,70%,65%,${0.05 + morphFactor * 0.25})`);
      coreGrad.addColorStop(0.4, `hsla(38,50%,55%,${0.03 + morphFactor * 0.12})`);
      coreGrad.addColorStop(1, "transparent");
      ctx.fillStyle = coreGrad;
      ctx.fillRect(0, 0, size, size);

      // Scanning beam
      const scanY = (Math.sin(t * 0.005) * 0.5 + 0.5) * size;
      ctx.fillStyle = `hsla(38,50%,55%,${0.02 + morphFactor * 0.04})`;
      ctx.fillRect(0, scanY - 1, size, 2);

      // Text during morph
      if (morphFactor > 0.3) {
        const labelAlpha = Math.min((morphFactor - 0.3) / 0.4, 1);
        ctx.save();

        const textGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.4);
        textGlow.addColorStop(0, `hsla(265,70%,55%,${labelAlpha * 0.15})`);
        textGlow.addColorStop(0.5, `hsla(38,55%,55%,${labelAlpha * 0.08})`);
        textGlow.addColorStop(1, "transparent");
        ctx.fillStyle = textGlow;
        ctx.fillRect(0, 0, size, size);

        const mainSize = Math.round(size * 0.085);
        ctx.font = `900 ${mainSize}px 'Inter', system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.letterSpacing = `${size * 0.008}px`;

        ctx.globalAlpha = labelAlpha * 0.3;
        ctx.fillStyle = `hsla(265,70%,65%,1)`;
        ctx.filter = `blur(${size * 0.02}px)`;
        ctx.fillText("EMPIRE IA", cx, cy - size * 0.02);
        ctx.filter = "none";

        ctx.globalAlpha = labelAlpha * 0.2;
        ctx.fillStyle = `hsla(38,55%,60%,1)`;
        ctx.filter = `blur(${size * 0.01}px)`;
        ctx.fillText("EMPIRE IA", cx, cy - size * 0.02);
        ctx.filter = "none";

        ctx.globalAlpha = labelAlpha * 0.9;
        ctx.fillStyle = `hsla(38,55%,72%,1)`;
        ctx.fillText("EMPIRE IA", cx, cy - size * 0.02);

        const subSize = Math.round(size * 0.04);
        ctx.font = `600 ${subSize}px 'Inter', system-ui, sans-serif`;
        ctx.letterSpacing = `${size * 0.025}px`;

        ctx.globalAlpha = labelAlpha * 0.15;
        ctx.fillStyle = `hsla(38,50%,60%,1)`;
        ctx.filter = `blur(${size * 0.008}px)`;
        ctx.fillText("G R O U P", cx, cy + size * 0.06);
        ctx.filter = "none";

        ctx.globalAlpha = labelAlpha * 0.65;
        ctx.fillStyle = `hsla(38,45%,65%,0.9)`;
        ctx.fillText("G R O U P", cx, cy + size * 0.06);

        // Accent lines
        ctx.globalAlpha = labelAlpha * 0.3;
        ctx.strokeStyle = `hsla(38,50%,55%,0.5)`;
        ctx.lineWidth = 0.5;
        const lineW = size * 0.25;
        ctx.beginPath();
        ctx.moveTo(cx - lineW, cy + size * 0.1);
        ctx.lineTo(cx - size * 0.04, cy + size * 0.1);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + size * 0.04, cy + size * 0.1);
        ctx.lineTo(cx + lineW, cy + size * 0.1);
        ctx.stroke();
        // Diamond
        ctx.fillStyle = `hsla(38,55%,60%,${labelAlpha * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(cx, cy + size * 0.1 - 2);
        ctx.lineTo(cx + 2, cy + size * 0.1);
        ctx.lineTo(cx, cy + size * 0.1 + 2);
        ctx.lineTo(cx - 2, cy + size * 0.1);
        ctx.closePath();
        ctx.fill();

        // Tagline
        const tagSize = Math.round(size * 0.022);
        ctx.font = `500 ${tagSize}px 'Inter', system-ui, sans-serif`;
        ctx.globalAlpha = labelAlpha * 0.4;
        ctx.fillStyle = `hsla(265,40%,70%,0.7)`;
        ctx.letterSpacing = `${size * 0.012}px`;
        ctx.fillText("AI-POWERED BUSINESS PLATFORM", cx, cy + size * 0.16);

        ctx.restore();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [size, SPHERE_RADIUS, isMobile, allTextPoints, NEURAL_PULSE_COUNT]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const mouse = mouseRef.current;

    if (mouse.pressing) {
      const dx = mx - mouse.lastX;
      const dy = my - mouse.lastY;
      mouse.dragAngleX += dx * 0.008;
      mouse.dragAngleY += dy * 0.005;
    }

    mouse.x = mx;
    mouse.y = my;
    mouse.lastX = mx;
    mouse.lastY = my;
    mouse.active = true;
  }, []);

  const handlePointerLeave = useCallback(() => {
    mouseRef.current.active = false;
    mouseRef.current.pressing = false;
    mouseRef.current.releaseTime = 0;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="touch-none cursor-grab active:cursor-grabbing"
      style={{ width: size, height: size }}
      onPointerMove={handlePointerMove}
      onPointerEnter={(e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          mouseRef.current.x = e.clientX - rect.left;
          mouseRef.current.y = e.clientY - rect.top;
        }
        mouseRef.current.active = true;
        mouseRef.current.releaseTime = 0;
      }}
      onPointerDown={(e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          mouseRef.current.lastX = e.clientX - rect.left;
          mouseRef.current.lastY = e.clientY - rect.top;
        }
        mouseRef.current.pressing = true;
      }}
      onPointerUp={() => {
        mouseRef.current.pressing = false;
      }}
      onPointerLeave={handlePointerLeave}
    />
  );
};

export default InteractiveParticleSphere;
