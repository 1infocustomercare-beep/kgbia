import { useEffect, useRef, useState } from "react";

/**
 * Empire Background v10 — Organic Neural Data Flow
 * Fluid, non-geometric lines. Bezier curves, flowing particles,
 * organic topology morphing on scroll. Professional & alive.
 */

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

const NODE_COUNT = IS_MOBILE ? 50 : 95;
const MAX_DIST = IS_MOBILE ? 120 : 160;
const FLOW_COUNT = IS_MOBILE ? 18 : 40;
const PULSE_COUNT = IS_MOBILE ? 8 : 18;

type Pt = { x: number; y: number };

// ── Organic topologies (no grids, no squares) ──
const topologies: Array<(n: number, w: number, h: number, t: number) => Pt[]> = [
  // 0: Neural nebula — scattered with organic drift
  (n, w, h, t) => Array.from({ length: n }, (_, i) => {
    const seed = i * 137.508;
    const r = 0.08 + (i / n) * 0.42;
    const wobble = Math.sin(t * 0.12 + i * 0.7) * 0.04;
    return {
      x: w * 0.5 + Math.cos(seed + t * 0.03) * (r + wobble) * w,
      y: h * 0.5 + Math.sin(seed * 0.7 + t * 0.025) * (r + wobble) * h,
    };
  }),
  // 1: Flowing river streams
  (n, w, h, t) => {
    const streams = 5;
    const per = Math.ceil(n / streams);
    return Array.from({ length: n }, (_, i) => {
      const s = Math.floor(i / per), li = i % per;
      const f = li / Math.max(per - 1, 1);
      const baseY = 0.1 + s * 0.18;
      const wave = Math.sin(f * Math.PI * 3 + t * 0.25 + s * 1.4) * 0.06
        + Math.sin(f * Math.PI * 7 + t * 0.15) * 0.02
        + Math.cos(f * Math.PI * 1.5 - t * 0.1 + s) * 0.03;
      return { x: f * w, y: h * (baseY + wave) };
    });
  },
  // 2: Organic clusters — amoeba-like groupings
  (n, w, h, t) => {
    const clusters = 5;
    const per = Math.ceil(n / clusters);
    const centers = [
      [0.2, 0.25], [0.75, 0.2], [0.5, 0.55], [0.25, 0.78], [0.8, 0.72],
    ];
    return Array.from({ length: n }, (_, i) => {
      const ci = Math.floor(i / per) % clusters, li = i % per;
      const [cx, cy] = centers[ci];
      const angle = li * 2.39996 + t * 0.04 + ci * 2.1;
      const r = Math.pow(li / per, 0.6) * Math.min(w, h) * 0.12;
      const breathe = 1 + Math.sin(t * 0.15 + ci * 1.3) * 0.15;
      return {
        x: w * cx + Math.cos(angle) * r * breathe + Math.sin(t * 0.08 + i * 0.3) * 8,
        y: h * cy + Math.sin(angle) * r * breathe + Math.cos(t * 0.06 + i * 0.5) * 6,
      };
    });
  },
  // 3: DNA double helix — organic spiral
  (n, w, h, t) => Array.from({ length: n }, (_, i) => {
    const f = i / n;
    const turns = 4;
    const angle = f * Math.PI * 2 * turns + t * 0.2;
    const strand = i % 2 === 0 ? 1 : -1;
    const amp = 0.15 + Math.sin(f * Math.PI) * 0.08;
    const drift = Math.sin(f * Math.PI * 6 + t * 0.12) * 0.015;
    return {
      x: w * (0.5 + Math.sin(angle) * amp * strand + drift),
      y: h * (0.05 + f * 0.9) + Math.cos(angle * 0.5 + t * 0.1) * 8,
    };
  }),
  // 4: Converging vortex
  (n, w, h, t) => Array.from({ length: n }, (_, i) => {
    const f = i / n;
    const spiralAngle = f * Math.PI * 6 + t * 0.08;
    const r = (1 - f * 0.7) * Math.min(w, h) * 0.45;
    const wobble = Math.sin(f * Math.PI * 8 + t * 0.2) * 12;
    return {
      x: w * 0.5 + Math.cos(spiralAngle) * r + wobble,
      y: h * 0.5 + Math.sin(spiralAngle) * r * 0.65 + Math.cos(spiralAngle * 0.3) * wobble * 0.5,
    };
  }),
  // 5: Constellation drift — scattered stars with gravity wells
  (n, w, h, t) => {
    const wells = [[0.3, 0.3], [0.7, 0.5], [0.4, 0.8]];
    return Array.from({ length: n }, (_, i) => {
      const seed = i * 137.508;
      let bx = (Math.sin(seed) * 0.5 + 0.5) * w;
      let by = (Math.cos(seed * 0.7) * 0.5 + 0.5) * h;
      for (const [gx, gy] of wells) {
        const dx = gx * w - bx, dy = gy * h - by;
        const d = Math.sqrt(dx * dx + dy * dy);
        const pull = Math.max(0, 1 - d / (Math.min(w, h) * 0.4)) * 0.3;
        bx += dx * pull * (1 + Math.sin(t * 0.1 + i * 0.2) * 0.3);
        by += dy * pull * (1 + Math.cos(t * 0.08 + i * 0.15) * 0.3);
      }
      return {
        x: bx + Math.sin(t * 0.05 + seed) * 10,
        y: by + Math.cos(t * 0.04 + seed * 0.6) * 8,
      };
    });
  },
  // 6: Wave interference pattern
  (n, w, h, t) => Array.from({ length: n }, (_, i) => {
    const ix = i % Math.ceil(Math.sqrt(n));
    const iy = Math.floor(i / Math.ceil(Math.sqrt(n)));
    const cols = Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);
    const fx = ix / Math.max(cols - 1, 1);
    const fy = iy / Math.max(rows - 1, 1);
    const wave1 = Math.sin(fx * Math.PI * 4 + t * 0.3) * 30;
    const wave2 = Math.cos(fy * Math.PI * 3 + t * 0.2) * 25;
    const wave3 = Math.sin((fx + fy) * Math.PI * 2 + t * 0.15) * 20;
    return {
      x: w * (0.05 + fx * 0.9) + wave2 * 0.5 + wave3 * 0.3,
      y: h * (0.05 + fy * 0.9) + wave1 + wave3 * 0.4,
    };
  }),
];

const SECTIONS = topologies.length;

// Subtle, desaturated palette per section
const PALETTES = [
  { node: [220, 8, 50], line: [220, 6, 45], glow: [220, 12, 55] },
  { node: [200, 10, 48], line: [200, 8, 42], glow: [200, 14, 52] },
  { node: [265, 8, 48], line: [265, 6, 42], glow: [265, 12, 52] },
  { node: [180, 10, 46], line: [180, 8, 40], glow: [180, 14, 50] },
  { node: [240, 8, 47], line: [240, 6, 41], glow: [240, 12, 51] },
  { node: [210, 10, 49], line: [210, 8, 43], glow: [210, 14, 53] },
  { node: [195, 8, 48], line: [195, 6, 42], glow: [195, 12, 52] },
];

interface FlowParticle {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  life: number;
}

interface PulseRing {
  x: number; y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  alpha: number;
  color: number[];
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpC = (a: number[], b: number[], t: number): number[] =>
  a.map((v, i) => lerp(v, b[i], t));
const hsl = (c: number[], a: number) => `hsla(${c[0]},${c[1]}%,${c[2]}%,${a})`;

const EmpireDNABackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const scrollRef = useRef(0);
  const [ready, setReady] = useState(false);
  const posRef = useRef<Pt[]>([]);
  const velRef = useRef<Pt[]>([]);
  const timeRef = useRef(0);
  const flowsRef = useRef<FlowParticle[]>([]);
  const pulsesRef = useRef<PulseRing[]>([]);
  const ptrRef = useRef<{ x: number; y: number; active: boolean }>({ x: -999, y: -999, active: false });

  useEffect(() => { const t = setTimeout(() => setReady(true), 250); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const fn = () => { scrollRef.current = window.scrollY || document.documentElement.scrollTop || 0; };
    window.addEventListener("scroll", fn, { passive: true });
    // Also listen on possible scroll containers
    const mainEl = document.querySelector("main");
    if (mainEl) mainEl.addEventListener("scroll", () => { scrollRef.current = mainEl.scrollTop; }, { passive: true });
    fn(); // init
    return () => { window.removeEventListener("scroll", fn); };
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => { ptrRef.current = { x: e.clientX, y: e.clientY, active: true }; };
    const leave = () => { ptrRef.current.active = false; };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", leave);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerleave", leave); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !ready) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth; h = window.innerHeight;
      if (!w || !h) return;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Init positions with velocity
    if (!posRef.current.length) {
      posRef.current = Array.from({ length: NODE_COUNT }, () => ({ x: Math.random() * (w || 1000), y: Math.random() * (h || 800) }));
      velRef.current = Array.from({ length: NODE_COUNT }, () => ({ x: 0, y: 0 }));
    }

    const spawnFlow = (): FlowParticle => ({
      fromIdx: Math.floor(Math.random() * NODE_COUNT),
      toIdx: Math.floor(Math.random() * NODE_COUNT),
      progress: 0,
      speed: 0.005 + Math.random() * 0.015,
      life: 0,
    });

    if (!flowsRef.current.length) {
      flowsRef.current = Array.from({ length: FLOW_COUNT }, spawnFlow);
    }

    const spawnPulse = (x: number, y: number, color: number[]): PulseRing => ({
      x, y, radius: 0,
      maxRadius: 40 + Math.random() * 80,
      speed: 0.3 + Math.random() * 0.5,
      alpha: 0.15 + Math.random() * 0.1,
      color,
    });

    let lastPulseTime = 0;

    const animate = () => {
      if (!w || !h) { animRef.current = requestAnimationFrame(animate); return; }
      timeRef.current += 0.016;
      const time = timeRef.current;
      ctx.clearRect(0, 0, w, h);

      // Scroll-based section blending
      const pageH = document.documentElement.scrollHeight - h;
      const scrollN = pageH > 0 ? Math.min(scrollRef.current / pageH, 1) : 0;
      const sF = scrollN * (SECTIONS - 1);
      const sIdx = Math.min(Math.floor(sF), SECTIONS - 2);
      const blend = sF - sIdx;
      const t3 = blend * blend * (3 - 2 * blend); // smoothstep

      const pNode = lerpC(PALETTES[sIdx].node, PALETTES[sIdx + 1].node, t3);
      const pLine = lerpC(PALETTES[sIdx].line, PALETTES[sIdx + 1].line, t3);
      const pGlow = lerpC(PALETTES[sIdx].glow, PALETTES[sIdx + 1].glow, t3);

      // Morph topology
      const shA = sIdx % topologies.length, shB = (sIdx + 1) % topologies.length;
      const tA = topologies[shA](NODE_COUNT, w, h, time);
      const tB = topologies[shB](NODE_COUNT, w, h, time);
      const targets = tA.map((a, i) => ({ x: lerp(a.x, tB[i].x, t3), y: lerp(a.y, tB[i].y, t3) }));

      const pos = posRef.current;
      const vel = velRef.current;
      const ptr = ptrRef.current;
      const repR = IS_MOBILE ? 80 : 120;

      // Update positions with spring physics + pointer repulsion
      for (let i = 0; i < NODE_COUNT; i++) {
        if (!pos[i]) { pos[i] = { ...targets[i] }; vel[i] = { x: 0, y: 0 }; }
        let tx = targets[i].x, ty = targets[i].y;
        if (ptr.active) {
          const dx = pos[i].x - ptr.x, dy = pos[i].y - ptr.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < repR && d > 1) {
            const f = (1 - d / repR) * 35;
            tx = pos[i].x + (dx / d) * f;
            ty = pos[i].y + (dy / d) * f;
          }
        }
        // Spring-damped motion for organic feel
        // Faster spring for visible morphing on scroll
        const springK = 0.06;
        const damping = 0.82;
        vel[i].x = vel[i].x * damping + (tx - pos[i].x) * springK;
        vel[i].y = vel[i].y * damping + (ty - pos[i].y) * springK;
        pos[i].x += vel[i].x;
        pos[i].y += vel[i].y;
      }

      // ═══ L1: ORGANIC NEURAL CONNECTIONS (Bezier curves) ═══
      ctx.lineCap = "round";
      for (let i = 0; i < NODE_COUNT; i++) {
        const maxJ = Math.min(i + (IS_MOBILE ? 6 : 10), NODE_COUNT);
        for (let j = i + 1; j < maxJ; j++) {
          const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const alpha = Math.pow(1 - d / MAX_DIST, 1.5);
            const breathe = 0.5 + Math.sin(time * 1.5 + i * 0.4 + j * 0.3) * 0.5;
            ctx.strokeStyle = hsl(pLine, alpha * 0.08 * breathe);
            ctx.lineWidth = 0.4 + alpha * 0.6;
            // Organic bezier — control point drifts with time
            const mx = (pos[i].x + pos[j].x) * 0.5 + Math.sin(time * 0.3 + i * 0.7 + j * 0.2) * d * 0.15;
            const my = (pos[i].y + pos[j].y) * 0.5 + Math.cos(time * 0.25 + j * 0.5) * d * 0.12;
            ctx.beginPath();
            ctx.moveTo(pos[i].x, pos[i].y);
            ctx.quadraticCurveTo(mx, my, pos[j].x, pos[j].y);
            ctx.stroke();
          }
        }
      }

      // ═══ L2: NODES — soft dots with glow ═══
      for (let i = 0; i < NODE_COUNT; i++) {
        const breathe = 0.4 + Math.sin(time * 1.2 + i * 0.9) * 0.6;
        const baseR = IS_MOBILE ? 1.2 : 1.5;
        let na = 0.12 * breathe;

        // Proximity boost near pointer
        if (ptr.active) {
          const dx = pos[i].x - ptr.x, dy = pos[i].y - ptr.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < repR * 1.5) na += (1 - d / (repR * 1.5)) * 0.25;
        }

        // Glow for every 4th node
        if (i % 4 === 0) {
          const gr = baseR * 8;
          const gg = ctx.createRadialGradient(pos[i].x, pos[i].y, 0, pos[i].x, pos[i].y, gr);
          gg.addColorStop(0, hsl(pGlow, na * 0.6));
          gg.addColorStop(1, hsl(pGlow, 0));
          ctx.beginPath();
          ctx.arc(pos[i].x, pos[i].y, gr, 0, Math.PI * 2);
          ctx.fillStyle = gg;
          ctx.fill();
        }

        // Core dot
        ctx.beginPath();
        ctx.arc(pos[i].x, pos[i].y, baseR * (0.8 + breathe * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = hsl(pNode, na + 0.15);
        ctx.fill();
      }

      // ═══ L3: FLOWING DATA PARTICLES along connections ═══
      const flows = flowsRef.current;
      for (let fi = 0; fi < flows.length; fi++) {
        const fl = flows[fi];
        fl.progress += fl.speed;
        fl.life++;

        if (fl.progress > 1 || fl.life > 300) {
          flows[fi] = spawnFlow();
          continue;
        }

        const a = pos[fl.fromIdx], b = pos[fl.toIdx];
        if (!a || !b) continue;

        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > MAX_DIST * 1.5) { flows[fi] = spawnFlow(); continue; }

        // Bezier path matching connections
        const mx = (a.x + b.x) * 0.5 + Math.sin(time * 0.3 + fl.fromIdx * 0.7 + fl.toIdx * 0.2) * d * 0.15;
        const my = (a.y + b.y) * 0.5 + Math.cos(time * 0.25 + fl.toIdx * 0.5) * d * 0.12;
        const t2 = fl.progress;
        const t2i = 1 - t2;
        const px = t2i * t2i * a.x + 2 * t2i * t2 * mx + t2 * t2 * b.x;
        const py = t2i * t2i * a.y + 2 * t2i * t2 * my + t2 * t2 * b.y;

        const fadeAlpha = Math.sin(fl.progress * Math.PI) * 0.5;

        // Trailing glow
        const tg = ctx.createRadialGradient(px, py, 0, px, py, 6);
        tg.addColorStop(0, hsl(pGlow, fadeAlpha * 0.6));
        tg.addColorStop(1, hsl(pGlow, 0));
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = tg;
        ctx.fill();

        // Core particle
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = hsl(pGlow, fadeAlpha + 0.1);
        ctx.fill();
      }

      // ═══ L4: PULSE RINGS — occasional ripple effects ═══
      if (time - lastPulseTime > (IS_MOBILE ? 3 : 1.8)) {
        const ri = Math.floor(Math.random() * NODE_COUNT);
        if (pos[ri]) {
          pulsesRef.current.push(spawnPulse(pos[ri].x, pos[ri].y, pGlow));
          lastPulseTime = time;
        }
      }

      const pulses = pulsesRef.current;
      for (let pi = pulses.length - 1; pi >= 0; pi--) {
        const p = pulses[pi];
        p.radius += p.speed;
        const fade = 1 - p.radius / p.maxRadius;
        if (fade <= 0) { pulses.splice(pi, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = hsl(p.color, p.alpha * fade * fade);
        ctx.lineWidth = 0.5 + fade;
        ctx.stroke();
      }

      // ═══ L5: AMBIENT SCAN — soft horizontal glow that drifts ═══
      const scanY = h * (0.5 + Math.sin(time * 0.08) * 0.45);
      const scanGrad = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
      scanGrad.addColorStop(0, hsl(pGlow, 0));
      scanGrad.addColorStop(0.5, hsl(pGlow, 0.02));
      scanGrad.addColorStop(1, hsl(pGlow, 0));
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 60, w, 120);

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [ready]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: 0.95, willChange: "transform", transform: "translateZ(0)" }}
    />
  );
};

export default EmpireDNABackground;
