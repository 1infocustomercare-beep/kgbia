import { useEffect, useRef, useState } from "react";

/**
 * Empire DNA Ultra-Tech Background — scroll-reactive circuit/neural morphing.
 * Each section: different topology + animated data streams + circuit traces + AI synapses.
 */

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

const NODE_COUNT = IS_MOBILE ? 45 : 80;
const MAX_DIST = IS_MOBILE ? 120 : 160;
const PULSE_COUNT = IS_MOBILE ? 14 : 30;
const CIRCUIT_TRACES = IS_MOBILE ? 6 : 14;

/* ---------- section palettes (ultra-tech desaturated) ---------- */
const PALETTES = [
  { line: [220, 20, 50, 0.08], node: [220, 25, 60, 0.15], pulse: [200, 60, 65, 0.45], circuit: [210, 35, 55, 0.12] },
  { line: [185, 18, 45, 0.07], node: [185, 22, 55, 0.13], pulse: [175, 55, 60, 0.40], circuit: [180, 30, 50, 0.10] },
  { line: [260, 15, 42, 0.06], node: [260, 20, 52, 0.12], pulse: [270, 50, 62, 0.38], circuit: [265, 25, 48, 0.09] },
  { line: [195, 22, 48, 0.07], node: [195, 28, 58, 0.14], pulse: [190, 65, 68, 0.42], circuit: [195, 35, 52, 0.11] },
  { line: [240, 12, 40, 0.06], node: [240, 18, 50, 0.11], pulse: [235, 45, 58, 0.35], circuit: [240, 22, 46, 0.08] },
  { line: [170, 16, 44, 0.07], node: [170, 22, 54, 0.13], pulse: [165, 55, 62, 0.40], circuit: [170, 28, 50, 0.10] },
  { line: [210, 18, 46, 0.07], node: [210, 24, 56, 0.14], pulse: [205, 58, 64, 0.42], circuit: [210, 32, 52, 0.11] },
];

const SECTIONS = PALETTES.length;

/* ---------- shape generators ---------- */
type Pt = { x: number; y: number };
type ShapeGen = (n: number, w: number, h: number, t: number) => Pt[];

const shapes: ShapeGen[] = [
  // 0: Neural mesh — organic clusters
  (n, w, h, t) => {
    const pts: Pt[] = [];
    for (let i = 0; i < n; i++) {
      const seed = i * 137.508;
      const angle = seed + t * 0.08;
      const r = 0.12 + (i / n) * 0.38;
      pts.push({
        x: w * 0.5 + Math.cos(angle) * r * w + Math.sin(seed * 2.1 + t * 0.05) * w * 0.1,
        y: h * 0.5 + Math.sin(angle) * r * h + Math.cos(seed * 1.7 + t * 0.04) * h * 0.08,
      });
    }
    return pts;
  },
  // 1: Circuit board — orthogonal grid
  (n, w, h, t) => {
    const cols = Math.ceil(Math.sqrt(n * (w / h)));
    const rows = Math.ceil(n / cols);
    const pts: Pt[] = [];
    const px = w * 0.08, py = h * 0.08;
    for (let i = 0; i < n; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const jitter = Math.sin(t * 0.3 + i * 0.5) * 3;
      pts.push({
        x: px + (col / Math.max(cols - 1, 1)) * (w - px * 2) + (row % 2 ? (w - px * 2) / cols * 0.5 : 0) + jitter,
        y: py + (row / Math.max(rows - 1, 1)) * (h - py * 2) + jitter * 0.7,
      });
    }
    return pts;
  },
  // 2: DNA Double helix — rotating
  (n, w, h, t) => {
    const pts: Pt[] = [];
    const cx = w * 0.5, amp = w * 0.22;
    for (let i = 0; i < n; i++) {
      const f = i / (n - 1);
      const y = h * 0.05 + f * h * 0.9;
      const phase = f * Math.PI * 5 + t * 0.6;
      const strand = i % 2 === 0 ? 1 : -1;
      const depth = Math.cos(phase) * 0.3 + 0.7;
      pts.push({ x: cx + Math.sin(phase) * amp * strand * depth, y });
    }
    return pts;
  },
  // 3: Fibonacci constellation
  (n, w, h, t) => {
    const pts: Pt[] = [];
    const cx = w * 0.5, cy = h * 0.5;
    for (let i = 0; i < n; i++) {
      const angle = i * 2.3999632 + t * 0.04;
      const r = Math.sqrt(i / n) * Math.min(w, h) * 0.42;
      pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
    return pts;
  },
  // 4: Hexagonal lattice — honeycomb
  (n, w, h, t) => {
    const pts: Pt[] = [];
    const cols = Math.ceil(Math.sqrt(n * 1.15));
    const rows = Math.ceil(n / cols);
    const sx = (w * 0.84) / cols, sy = (h * 0.84) / rows;
    for (let i = 0; i < n; i++) {
      const col = i % cols, row = Math.floor(i / cols);
      const breathe = Math.sin(t * 0.2 + row * 0.4 + col * 0.3) * 4;
      pts.push({
        x: w * 0.08 + col * sx + (row % 2 ? sx * 0.5 : 0) + breathe,
        y: h * 0.08 + row * sy + breathe * 0.6,
      });
    }
    return pts;
  },
  // 5: Wave interference — dual sine
  (n, w, h, t) => {
    const pts: Pt[] = [];
    const rows = 3;
    const perRow = Math.ceil(n / rows);
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / perRow);
      const col = i % perRow;
      const f = col / (perRow - 1);
      const x = w * 0.04 + f * w * 0.92;
      const baseY = h * (0.25 + row * 0.25);
      const wave1 = Math.sin(f * Math.PI * 4 + t * 0.5 + row) * h * 0.08;
      const wave2 = Math.cos(f * Math.PI * 6 - t * 0.3 + row * 2) * h * 0.04;
      pts.push({ x, y: baseY + wave1 + wave2 });
    }
    return pts;
  },
  // 6: Radial burst / processor core
  (n, w, h, t) => {
    const pts: Pt[] = [];
    const cx = w * 0.5, cy = h * 0.5;
    const rings = 5;
    for (let i = 0; i < n; i++) {
      const ring = Math.floor(i / (n / rings));
      const idx = i % Math.ceil(n / rings);
      const cnt = Math.ceil(n / rings);
      const angle = (idx / cnt) * Math.PI * 2 + ring * 0.5 + t * (0.02 + ring * 0.008);
      const r = ((ring + 1) / rings) * Math.min(w, h) * 0.4;
      pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
    return pts;
  },
];

/* ---------- circuit trace paths (persistent animated traces) ---------- */
interface CircuitTrace {
  segments: Pt[];
  progress: number;
  speed: number;
  life: number;
  maxLife: number;
}

function spawnCircuitTrace(w: number, h: number): CircuitTrace {
  const segs: Pt[] = [];
  const steps = 4 + Math.floor(Math.random() * 5);
  let x = Math.random() * w;
  let y = Math.random() * h;
  segs.push({ x, y });
  for (let s = 0; s < steps; s++) {
    // orthogonal moves like real circuit traces
    const horizontal = Math.random() > 0.5;
    const dist = 30 + Math.random() * 120;
    if (horizontal) {
      x += (Math.random() > 0.5 ? 1 : -1) * dist;
    } else {
      y += (Math.random() > 0.5 ? 1 : -1) * dist;
    }
    x = Math.max(10, Math.min(w - 10, x));
    y = Math.max(10, Math.min(h - 10, y));
    segs.push({ x, y });
  }
  const maxLife = 180 + Math.random() * 300;
  return { segments: segs, progress: 0, speed: 0.003 + Math.random() * 0.005, life: 0, maxLife };
}

/* ---------- helpers ---------- */
const hsla = (c: number[], alphaOverride?: number) =>
  `hsla(${c[0]},${c[1]}%,${c[2]}%,${alphaOverride ?? c[3]})`;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const lerpC = (a: number[], b: number[], t: number): number[] => [
  lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t),
];

/* ---------- component ---------- */
const EmpireDNABackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const scrollRef = useRef(0);
  const [ready, setReady] = useState(false);
  const posRef = useRef<Pt[]>([]);
  const timeRef = useRef(0);
  const tracesRef = useRef<CircuitTrace[]>([]);

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
      w = window.innerWidth; h = window.innerHeight;
      if (!w || !h) return;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    if (posRef.current.length !== NODE_COUNT) {
      posRef.current = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * (w || 1000), y: Math.random() * (h || 800),
      }));
    }

    // Init circuit traces
    if (tracesRef.current.length === 0 && w && h) {
      for (let i = 0; i < CIRCUIT_TRACES; i++) {
        tracesRef.current.push(spawnCircuitTrace(w, h));
      }
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
      const t3 = blend * blend * (3 - 2 * blend);

      // Palette interpolation
      const palLine = lerpC(PALETTES[sIdx].line, PALETTES[sIdx + 1].line, t3);
      const palNode = lerpC(PALETTES[sIdx].node, PALETTES[sIdx + 1].node, t3);
      const palPulse = lerpC(PALETTES[sIdx].pulse, PALETTES[sIdx + 1].pulse, t3);
      const palCircuit = lerpC(PALETTES[sIdx].circuit, PALETTES[sIdx + 1].circuit, t3);

      // Shape morphing
      const shA = sIdx % shapes.length;
      const shB = (sIdx + 1) % shapes.length;
      const tA = shapes[shA](NODE_COUNT, w, h, time);
      const tB = shapes[shB](NODE_COUNT, w, h, time);
      const targets = tA.map((a, i) => ({
        x: lerp(a.x, tB[i].x, t3), y: lerp(a.y, tB[i].y, t3),
      }));

      // Ease positions
      const pos = posRef.current;
      for (let i = 0; i < NODE_COUNT; i++) {
        if (!pos[i]) pos[i] = { ...targets[i] };
        pos[i].x += (targets[i].x - pos[i].x) * 0.04;
        pos[i].y += (targets[i].y - pos[i].y) * 0.04;
      }

      // ═══ LAYER 1: Circuit Traces (animated orthogonal paths) ═══
      const traces = tracesRef.current;
      for (let t = 0; t < traces.length; t++) {
        const tr = traces[t];
        tr.progress = Math.min(tr.progress + tr.speed, 1);
        tr.life++;

        if (tr.life > tr.maxLife || tr.progress >= 1) {
          traces[t] = spawnCircuitTrace(w, h);
          continue;
        }

        const segs = tr.segments;
        const totalLen = segs.reduce((acc, s, i) => {
          if (i === 0) return 0;
          return acc + Math.hypot(s.x - segs[i - 1].x, s.y - segs[i - 1].y);
        }, 0);
        const drawLen = totalLen * tr.progress;

        ctx.beginPath();
        ctx.strokeStyle = hsla(palCircuit, palCircuit[3] * 2.5);
        ctx.lineWidth = 0.8;
        ctx.setLineDash([3, 4]);

        let accumulated = 0;
        ctx.moveTo(segs[0].x, segs[0].y);
        for (let s = 1; s < segs.length; s++) {
          const segLen = Math.hypot(segs[s].x - segs[s - 1].x, segs[s].y - segs[s - 1].y);
          if (accumulated + segLen <= drawLen) {
            ctx.lineTo(segs[s].x, segs[s].y);
            accumulated += segLen;
          } else {
            const remain = drawLen - accumulated;
            const frac = remain / segLen;
            ctx.lineTo(
              segs[s - 1].x + (segs[s].x - segs[s - 1].x) * frac,
              segs[s - 1].y + (segs[s].y - segs[s - 1].y) * frac,
            );
            break;
          }
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Glowing head of trace
        const headFrac = tr.progress;
        let headAccum = 0;
        const headDist = totalLen * headFrac;
        for (let s = 1; s < segs.length; s++) {
          const segLen = Math.hypot(segs[s].x - segs[s - 1].x, segs[s].y - segs[s - 1].y);
          if (headAccum + segLen >= headDist) {
            const f = (headDist - headAccum) / segLen;
            const hx = segs[s - 1].x + (segs[s].x - segs[s - 1].x) * f;
            const hy = segs[s - 1].y + (segs[s].y - segs[s - 1].y) * f;
            const grad = ctx.createRadialGradient(hx, hy, 0, hx, hy, IS_MOBILE ? 6 : 10);
            grad.addColorStop(0, hsla(palPulse, 0.6));
            grad.addColorStop(1, hsla(palPulse, 0));
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(hx, hy, IS_MOBILE ? 6 : 10, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          headAccum += segLen;
        }
      }

      // ═══ LAYER 2: Neural connections (curved bezier lines) ═══
      ctx.lineWidth = 0.4;
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = pos[i].x - pos[j].x;
          const dy = pos[i].y - pos[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST);
            const flicker = 0.6 + Math.sin(time * 3 + i * 0.7 + j * 0.3) * 0.4;
            ctx.strokeStyle = hsla(palLine, palLine[3] * alpha * 6 * flicker);
            ctx.beginPath();
            ctx.moveTo(pos[i].x, pos[i].y);
            // Slight curve for organic feel
            const mx = (pos[i].x + pos[j].x) * 0.5 + Math.sin(time + i) * 8;
            const my = (pos[i].y + pos[j].y) * 0.5 + Math.cos(time + j) * 6;
            ctx.quadraticCurveTo(mx, my, pos[j].x, pos[j].y);
            ctx.stroke();
          }
        }
      }

      // ═══ LAYER 3: Nodes with micro-rings ═══
      for (let i = 0; i < NODE_COUNT; i++) {
        const breathe = 0.6 + Math.sin(time * 2.5 + i * 1.3) * 0.4;
        const r = IS_MOBILE ? 1.6 : 1.2;

        // Outer micro-ring for "processor" look
        if (!IS_MOBILE && i % 3 === 0) {
          ctx.strokeStyle = hsla(palNode, palNode[3] * 1.5 * breathe);
          ctx.lineWidth = 0.3;
          ctx.beginPath();
          ctx.arc(pos[i].x, pos[i].y, r * 3.5, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Core dot
        ctx.globalAlpha = breathe;
        ctx.fillStyle = hsla(palNode, palNode[3] * 3);
        ctx.beginPath();
        ctx.arc(pos[i].x, pos[i].y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // ═══ LAYER 4: Data pulses with trails ═══
      let pulseN = 0;
      for (let i = 0; i < NODE_COUNT && pulseN < PULSE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT && pulseN < PULSE_COUNT; j++) {
          const dx = pos[i].x - pos[j].x;
          const dy = pos[i].y - pos[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST * 0.6 && (i * 7 + j) % 9 === 0) {
            const speed = 0.2 + (i % 5) * 0.06;
            const prog = ((time * speed + i * 0.37 + j * 0.13) % 1);

            // Trail (3 fading dots behind)
            for (let trail = 0; trail < 3; trail++) {
              const tp = Math.max(0, prog - trail * 0.06);
              const tx = pos[i].x + (pos[j].x - pos[i].x) * tp;
              const ty = pos[i].y + (pos[j].y - pos[i].y) * tp;
              ctx.globalAlpha = Math.sin(tp * Math.PI) * (0.15 - trail * 0.04);
              ctx.fillStyle = hsla(palPulse);
              ctx.beginPath();
              ctx.arc(tx, ty, IS_MOBILE ? 1.2 : 0.9, 0, Math.PI * 2);
              ctx.fill();
            }

            // Main pulse with glow
            const px = pos[i].x + (pos[j].x - pos[i].x) * prog;
            const py = pos[i].y + (pos[j].y - pos[i].y) * prog;
            ctx.globalAlpha = Math.sin(prog * Math.PI) * 0.7;
            ctx.fillStyle = hsla(palPulse);
            ctx.beginPath();
            ctx.arc(px, py, IS_MOBILE ? 2 : 1.6, 0, Math.PI * 2);
            ctx.fill();

            pulseN++;
          }
        }
      }
      ctx.globalAlpha = 1;

      // ═══ LAYER 5: Synapse flashes (random bright sparks at nodes) ═══
      if (!IS_MOBILE) {
        for (let i = 0; i < NODE_COUNT; i++) {
          const spark = Math.sin(time * 8 + i * 37.7) > 0.97;
          if (spark) {
            const grad = ctx.createRadialGradient(pos[i].x, pos[i].y, 0, pos[i].x, pos[i].y, 15);
            grad.addColorStop(0, hsla(palPulse, 0.5));
            grad.addColorStop(1, hsla(palPulse, 0));
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(pos[i].x, pos[i].y, 15, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

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
      style={{ opacity: ready ? 0.5 : 0, transition: "opacity 1.5s ease" }}
    />
  );
};

export default EmpireDNABackground;
