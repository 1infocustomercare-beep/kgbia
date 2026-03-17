import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Empire DNA Neural Background — scroll-reactive with SHAPE-MORPHING.
 * Each scroll section changes the topology: grid, helix, circuit, constellation, neural mesh, wave, hex lattice.
 * Professional, tech, AI aesthetic.
 */

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

const NODE_COUNT = IS_MOBILE ? 40 : 65;
const MAX_DIST = IS_MOBILE ? 110 : 145;

/* ---------- section palettes ---------- */
const PALETTES = [
  { line: [240,15,45,0.07], node: [240,18,55,0.12], pulse: [265,30,60,0.30] },
  { line: [210,12,42,0.06], node: [210,15,50,0.10], pulse: [210,25,58,0.25] },
  { line: [180,10,40,0.06], node: [180,14,48,0.10], pulse: [175,22,55,0.24] },
  { line: [260,12,38,0.05], node: [260,14,46,0.09], pulse: [270,22,54,0.22] },
  { line: [220,10,38,0.05], node: [220,12,46,0.08], pulse: [220,18,52,0.20] },
  { line: [195,10,40,0.06], node: [195,12,48,0.09], pulse: [195,20,55,0.22] },
  { line: [340,10,40,0.05], node: [340,12,48,0.08], pulse: [340,18,52,0.20] },
];

const SECTIONS = PALETTES.length;

/* ---------- shape generators: return target positions for N nodes ---------- */
type ShapeGen = (n: number, w: number, h: number, time: number) => { x: number; y: number }[];

const shapes: ShapeGen[] = [
  // 0: Neural mesh — scattered organic
  (n, w, h, t) => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < n; i++) {
      const seed = i * 137.508;
      const angle = seed + t * 0.05;
      const r = 0.15 + (i / n) * 0.35;
      pts.push({
        x: w * 0.5 + Math.cos(angle) * r * w + Math.sin(seed * 2.1 + t * 0.03) * w * 0.08,
        y: h * 0.5 + Math.sin(angle) * r * h + Math.cos(seed * 1.7 + t * 0.02) * h * 0.06,
      });
    }
    return pts;
  },
  // 1: Circuit board — grid with offsets
  (n, w, h) => {
    const cols = Math.ceil(Math.sqrt(n * (w / h)));
    const rows = Math.ceil(n / cols);
    const pts: { x: number; y: number }[] = [];
    const padX = w * 0.1, padY = h * 0.1;
    for (let i = 0; i < n; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      pts.push({
        x: padX + (col / Math.max(cols - 1, 1)) * (w - padX * 2) + ((row % 2) ? (w - padX * 2) / cols * 0.5 : 0),
        y: padY + (row / Math.max(rows - 1, 1)) * (h - padY * 2),
      });
    }
    return pts;
  },
  // 2: DNA Double helix
  (n, w, h, t) => {
    const pts: { x: number; y: number }[] = [];
    const cx = w * 0.5, amp = w * 0.18;
    for (let i = 0; i < n; i++) {
      const f = i / (n - 1);
      const y = h * 0.08 + f * h * 0.84;
      const phase = f * Math.PI * 4 + t * 0.4;
      const strand = i % 2 === 0 ? 1 : -1;
      pts.push({ x: cx + Math.sin(phase) * amp * strand, y });
    }
    return pts;
  },
  // 3: Constellation — fibonacci spiral
  (n, w, h, t) => {
    const pts: { x: number; y: number }[] = [];
    const cx = w * 0.5, cy = h * 0.5;
    for (let i = 0; i < n; i++) {
      const angle = i * 2.3999632 + t * 0.02;
      const r = Math.sqrt(i / n) * Math.min(w, h) * 0.4;
      pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
    return pts;
  },
  // 4: Hexagonal lattice
  (n, w, h) => {
    const pts: { x: number; y: number }[] = [];
    const cols = Math.ceil(Math.sqrt(n * 1.15));
    const rows = Math.ceil(n / cols);
    const spacingX = (w * 0.8) / cols;
    const spacingY = (h * 0.8) / rows;
    for (let i = 0; i < n; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      pts.push({
        x: w * 0.1 + col * spacingX + (row % 2 ? spacingX * 0.5 : 0),
        y: h * 0.1 + row * spacingY,
      });
    }
    return pts;
  },
  // 5: Wave interference
  (n, w, h, t) => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < n; i++) {
      const f = i / (n - 1);
      const x = w * 0.05 + f * w * 0.9;
      const wave1 = Math.sin(f * Math.PI * 3 + t * 0.3) * h * 0.15;
      const wave2 = Math.sin(f * Math.PI * 5 - t * 0.2) * h * 0.08;
      pts.push({ x, y: h * 0.5 + wave1 + wave2 });
    }
    return pts;
  },
  // 6: Radial burst / starburst
  (n, w, h, t) => {
    const pts: { x: number; y: number }[] = [];
    const cx = w * 0.5, cy = h * 0.5;
    const rings = 4;
    for (let i = 0; i < n; i++) {
      const ring = Math.floor(i / (n / rings));
      const idxInRing = i % Math.ceil(n / rings);
      const countInRing = Math.ceil(n / rings);
      const angle = (idxInRing / countInRing) * Math.PI * 2 + ring * 0.3 + t * 0.02;
      const r = (ring + 1) / rings * Math.min(w, h) * 0.38;
      pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
    return pts;
  },
];

/* ---------- helpers ---------- */
const hsla = (c: number[], alphaOverride?: number) =>
  `hsla(${c[0]},${c[1]}%,${c[2]}%,${alphaOverride ?? c[3]})`;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const lerpHSLA = (a: number[], b: number[], t: number): number[] => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
  lerp(a[3], b[3], t),
];

/* ---------- component ---------- */
const EmpireDNABackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const scrollRef = useRef(0);
  const [ready, setReady] = useState(false);

  // Current interpolated positions
  const posRef = useRef<{ x: number; y: number }[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !ready) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      if (!w || !h) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Init positions
    if (posRef.current.length !== NODE_COUNT) {
      posRef.current = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * (w || 1000),
        y: Math.random() * (h || 800),
      }));
    }

    const animate = () => {
      if (!w || !h) { animRef.current = requestAnimationFrame(animate); return; }
      timeRef.current += 0.016;
      const time = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      // Scroll section
      const pageH = document.documentElement.scrollHeight - h;
      const scrollNorm = pageH > 0 ? Math.min(scrollRef.current / pageH, 1) : 0;
      const sectionF = scrollNorm * (SECTIONS - 1);
      const sIdx = Math.min(Math.floor(sectionF), SECTIONS - 2);
      const blend = sectionF - sIdx;

      // Palette
      const palLine = lerpHSLA(PALETTES[sIdx].line, PALETTES[sIdx + 1].line, blend);
      const palNode = lerpHSLA(PALETTES[sIdx].node, PALETTES[sIdx + 1].node, blend);
      const palPulse = lerpHSLA(PALETTES[sIdx].pulse, PALETTES[sIdx + 1].pulse, blend);

      // Shape morphing: get targets from current & next shape
      const shapeIdx = sIdx % shapes.length;
      const shapeNext = (sIdx + 1) % shapes.length;
      const targetA = shapes[shapeIdx](NODE_COUNT, w, h, time);
      const targetB = shapes[shapeNext](NODE_COUNT, w, h, time);

      // Smoothstep for organic easing
      const t3 = blend * blend * (3 - 2 * blend);

      // Interpolate targets
      const targets = targetA.map((a, i) => ({
        x: lerp(a.x, targetB[i].x, t3),
        y: lerp(a.y, targetB[i].y, t3),
      }));

      // Ease current positions toward targets
      const pos = posRef.current;
      const easeSpeed = 0.035;
      for (let i = 0; i < NODE_COUNT; i++) {
        if (!pos[i]) pos[i] = { x: targets[i].x, y: targets[i].y };
        pos[i].x += (targets[i].x - pos[i].x) * easeSpeed;
        pos[i].y += (targets[i].y - pos[i].y) * easeSpeed;
      }

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = pos[i].x - pos[j].x;
          const dy = pos[i].y - pos[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.5;
            ctx.strokeStyle = hsla(palLine, palLine[3] * alpha * 8);
            ctx.beginPath();
            ctx.moveTo(pos[i].x, pos[i].y);
            ctx.lineTo(pos[j].x, pos[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes with glow
      for (let i = 0; i < NODE_COUNT; i++) {
        const r = IS_MOBILE ? 1.8 : 1.3;
        ctx.globalAlpha = 0.7 + Math.sin(time * 2 + i) * 0.3;
        ctx.fillStyle = hsla(palNode, palNode[3] * 3);
        ctx.beginPath();
        ctx.arc(pos[i].x, pos[i].y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Traveling pulses
      ctx.globalAlpha = 1;
      let pulseN = 0;
      const maxP = IS_MOBILE ? 10 : 18;
      for (let i = 0; i < NODE_COUNT && pulseN < maxP; i++) {
        for (let j = i + 1; j < NODE_COUNT && pulseN < maxP; j++) {
          const dx = pos[i].x - pos[j].x;
          const dy = pos[i].y - pos[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST * 0.65 && (i * 7 + j) % 11 === 0) {
            const prog = ((time * 0.25 + i * 0.37) % 1);
            const px = pos[i].x + (pos[j].x - pos[i].x) * prog;
            const py = pos[i].y + (pos[j].y - pos[i].y) * prog;
            ctx.globalAlpha = Math.sin(prog * Math.PI) * 0.55;
            ctx.fillStyle = hsla(palPulse);
            ctx.beginPath();
            ctx.arc(px, py, IS_MOBILE ? 2.2 : 1.8, 0, Math.PI * 2);
            ctx.fill();
            pulseN++;
          }
        }
      }
      ctx.globalAlpha = 1;

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [ready]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: ready ? 0.45 : 0, transition: "opacity 1.5s ease" }}
    />
  );
};

export default EmpireDNABackground;
