import { useEffect, useRef, useState } from "react";

/**
 * Empire DNA Neural Background v5 — scroll-reactive + pointer-interactive.
 * 7 topologies morph per scroll section. Pointer proximity creates ripple effects.
 * Features: DNA helix strands, neural bezier synapses, circuit traces, traveling pulses.
 */

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

const NODE_COUNT = IS_MOBILE ? 50 : 90;
const MAX_DIST = IS_MOBILE ? 130 : 170;
const PULSE_COUNT = IS_MOBILE ? 16 : 35;
const CIRCUIT_TRACES = IS_MOBILE ? 5 : 12;
const DNA_STRANDS = IS_MOBILE ? 2 : 3;
const DNA_SEGMENTS = IS_MOBILE ? 40 : 70;

/* ---------- palettes per section ---------- */
const PALETTES = [
  { line: [220,20,50,0.09], node: [220,30,60,0.18], pulse: [200,65,65,0.5], circuit: [210,40,55,0.14], dna: [265,60,60,0.3] },
  { line: [185,18,45,0.08], node: [185,25,55,0.16], pulse: [175,60,62,0.45], circuit: [180,35,50,0.12], dna: [38,50,55,0.28] },
  { line: [260,18,44,0.07], node: [260,24,54,0.14], pulse: [270,55,64,0.42], circuit: [265,30,50,0.10], dna: [185,55,55,0.26] },
  { line: [195,22,48,0.08], node: [195,30,58,0.16], pulse: [190,65,68,0.48], circuit: [195,38,52,0.13], dna: [160,50,50,0.25] },
  { line: [240,14,42,0.07], node: [240,22,52,0.13], pulse: [235,50,60,0.40], circuit: [240,28,48,0.10], dna: [280,45,55,0.24] },
  { line: [170,18,46,0.08], node: [170,26,56,0.15], pulse: [165,60,64,0.45], circuit: [170,32,52,0.12], dna: [38,55,58,0.28] },
  { line: [210,20,48,0.08], node: [210,28,58,0.16], pulse: [205,62,66,0.48], circuit: [210,36,54,0.13], dna: [265,55,58,0.27] },
];
const SECTIONS = PALETTES.length;

type Pt = { x: number; y: number };
type ShapeGen = (n: number, w: number, h: number, t: number) => Pt[];

const shapes: ShapeGen[] = [
  // 0: Neural mesh — organic fibonacci scatter
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
  // 1: Circuit board grid
  (n, w, h, t) => {
    const cols = Math.ceil(Math.sqrt(n * (w / h)));
    const rows = Math.ceil(n / cols);
    const pts: Pt[] = [];
    const px = w * 0.08, py = h * 0.08;
    for (let i = 0; i < n; i++) {
      const col = i % cols, row = Math.floor(i / cols);
      const j = Math.sin(t * 0.3 + i * 0.5) * 4;
      pts.push({
        x: px + (col / Math.max(cols - 1, 1)) * (w - px * 2) + (row % 2 ? (w - px * 2) / cols * 0.5 : 0) + j,
        y: py + (row / Math.max(rows - 1, 1)) * (h - py * 2) + j * 0.7,
      });
    }
    return pts;
  },
  // 2: DNA Double helix vertical
  (n, w, h, t) => {
    const pts: Pt[] = [];
    const cx = w * 0.5, amp = w * 0.22;
    for (let i = 0; i < n; i++) {
      const f = i / (n - 1);
      const y = h * 0.04 + f * h * 0.92;
      const phase = f * Math.PI * 6 + t * 0.7;
      const strand = i % 2 === 0 ? 1 : -1;
      pts.push({ x: cx + Math.sin(phase) * amp * strand * (Math.cos(phase) * 0.3 + 0.7), y });
    }
    return pts;
  },
  // 3: Fibonacci constellation spiral
  (n, w, h, t) => {
    const pts: Pt[] = [];
    const cx = w * 0.5, cy = h * 0.5;
    for (let i = 0; i < n; i++) {
      const angle = i * 2.3999632 + t * 0.04;
      const r = Math.sqrt(i / n) * Math.min(w, h) * 0.44;
      pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
    return pts;
  },
  // 4: Hexagonal lattice breathing
  (n, w, h, t) => {
    const pts: Pt[] = [];
    const cols = Math.ceil(Math.sqrt(n * 1.15)), rows = Math.ceil(n / cols);
    const sx = (w * 0.84) / cols, sy = (h * 0.84) / rows;
    for (let i = 0; i < n; i++) {
      const col = i % cols, row = Math.floor(i / cols);
      const b = Math.sin(t * 0.2 + row * 0.4 + col * 0.3) * 5;
      pts.push({
        x: w * 0.08 + col * sx + (row % 2 ? sx * 0.5 : 0) + b,
        y: h * 0.08 + row * sy + b * 0.6,
      });
    }
    return pts;
  },
  // 5: Wave interference multi-row
  (n, w, h, t) => {
    const pts: Pt[] = [];
    const rows = 4;
    const perRow = Math.ceil(n / rows);
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / perRow), col = i % perRow;
      const f = col / (perRow - 1);
      const x = w * 0.03 + f * w * 0.94;
      const baseY = h * (0.15 + row * 0.2);
      pts.push({ x, y: baseY + Math.sin(f * Math.PI * 4 + t * 0.5 + row) * h * 0.07 + Math.cos(f * Math.PI * 7 - t * 0.3) * h * 0.03 });
    }
    return pts;
  },
  // 6: Radial burst / processor core
  (n, w, h, t) => {
    const pts: Pt[] = [];
    const cx = w * 0.5, cy = h * 0.5, rings = 5;
    for (let i = 0; i < n; i++) {
      const ring = Math.floor(i / (n / rings));
      const idx = i % Math.ceil(n / rings), cnt = Math.ceil(n / rings);
      const angle = (idx / cnt) * Math.PI * 2 + ring * 0.5 + t * (0.02 + ring * 0.01);
      const r = ((ring + 1) / rings) * Math.min(w, h) * 0.42;
      pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
    return pts;
  },
];

/* Circuit trace */
interface CircuitTrace {
  segments: Pt[]; progress: number; speed: number; life: number; maxLife: number;
}

function spawnTrace(w: number, h: number): CircuitTrace {
  const segs: Pt[] = [];
  let x = Math.random() * w, y = Math.random() * h;
  segs.push({ x, y });
  const steps = 3 + Math.floor(Math.random() * 5);
  for (let s = 0; s < steps; s++) {
    const horiz = Math.random() > 0.5;
    const dist = 40 + Math.random() * 130;
    if (horiz) x += (Math.random() > 0.5 ? 1 : -1) * dist;
    else y += (Math.random() > 0.5 ? 1 : -1) * dist;
    x = Math.max(10, Math.min(w - 10, x));
    y = Math.max(10, Math.min(h - 10, y));
    segs.push({ x, y });
  }
  return { segments: segs, progress: 0, speed: 0.003 + Math.random() * 0.006, life: 0, maxLife: 200 + Math.random() * 350 };
}

const hsla = (c: number[], ao?: number) => `hsla(${c[0]},${c[1]}%,${c[2]}%,${ao ?? c[3]})`;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpC = (a: number[], b: number[], t: number): number[] =>
  [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t)];

const EmpireDNABackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const scrollRef = useRef(0);
  const [ready, setReady] = useState(false);
  const posRef = useRef<Pt[]>([]);
  const timeRef = useRef(0);
  const tracesRef = useRef<CircuitTrace[]>([]);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({ x: -999, y: -999, active: false });

  useEffect(() => { const t = setTimeout(() => setReady(true), 300); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Pointer tracking for interactivity
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      pointerRef.current.active = true;
    };
    const onLeave = () => { pointerRef.current.active = false; };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
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

    if (tracesRef.current.length === 0 && w && h) {
      for (let i = 0; i < CIRCUIT_TRACES; i++) tracesRef.current.push(spawnTrace(w, h));
    }

    const animate = () => {
      if (!w || !h) { animRef.current = requestAnimationFrame(animate); return; }
      timeRef.current += 0.016;
      const time = timeRef.current;
      ctx.clearRect(0, 0, w, h);

      const pageH = document.documentElement.scrollHeight - h;
      const scrollNorm = pageH > 0 ? Math.min(scrollRef.current / pageH, 1) : 0;
      const sectionF = scrollNorm * (SECTIONS - 1);
      const sIdx = Math.min(Math.floor(sectionF), SECTIONS - 2);
      const blend = sectionF - sIdx;
      const t3 = blend * blend * (3 - 2 * blend);

      const palLine = lerpC(PALETTES[sIdx].line, PALETTES[sIdx + 1].line, t3);
      const palNode = lerpC(PALETTES[sIdx].node, PALETTES[sIdx + 1].node, t3);
      const palPulse = lerpC(PALETTES[sIdx].pulse, PALETTES[sIdx + 1].pulse, t3);
      const palCircuit = lerpC(PALETTES[sIdx].circuit, PALETTES[sIdx + 1].circuit, t3);
      const palDna = lerpC(PALETTES[sIdx].dna, PALETTES[sIdx + 1].dna, t3);

      // Shape morphing targets
      const shA = sIdx % shapes.length, shB = (sIdx + 1) % shapes.length;
      const tA = shapes[shA](NODE_COUNT, w, h, time);
      const tB = shapes[shB](NODE_COUNT, w, h, time);
      const targets = tA.map((a, i) => ({ x: lerp(a.x, tB[i].x, t3), y: lerp(a.y, tB[i].y, t3) }));

      // Ease positions toward targets + pointer repulsion
      const pos = posRef.current;
      const ptr = pointerRef.current;
      const repelRadius = IS_MOBILE ? 80 : 120;

      for (let i = 0; i < NODE_COUNT; i++) {
        if (!pos[i]) pos[i] = { ...targets[i] };
        let tx = targets[i].x, ty = targets[i].y;

        // Pointer repulsion
        if (ptr.active) {
          const dx = tx - ptr.x;
          const dy = ty - ptr.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < repelRadius && dist > 1) {
            const force = (1 - dist / repelRadius) * 35;
            tx += (dx / dist) * force;
            ty += (dy / dist) * force;
          }
        }

        pos[i].x += (tx - pos[i].x) * 0.045;
        pos[i].y += (ty - pos[i].y) * 0.045;
      }

      // ═══ LAYER 0: (DNA helix removed for cleaner readability) ═══

      // ═══ LAYER 1: Circuit Traces ═══
      const traces = tracesRef.current;
      for (let ti = 0; ti < traces.length; ti++) {
        const tr = traces[ti];
        tr.progress = Math.min(tr.progress + tr.speed, 1);
        tr.life++;
        if (tr.life > tr.maxLife || tr.progress >= 1) { traces[ti] = spawnTrace(w, h); continue; }

        const segs = tr.segments;
        let totalLen = 0;
        for (let si = 1; si < segs.length; si++) totalLen += Math.hypot(segs[si].x - segs[si - 1].x, segs[si].y - segs[si - 1].y);
        const drawLen = totalLen * tr.progress;

        ctx.beginPath();
        ctx.strokeStyle = hsla(palCircuit, palCircuit[3] * 2.5);
        ctx.lineWidth = 0.7;
        ctx.setLineDash([3, 5]);
        let acc = 0;
        ctx.moveTo(segs[0].x, segs[0].y);
        for (let si = 1; si < segs.length; si++) {
          const segLen = Math.hypot(segs[si].x - segs[si - 1].x, segs[si].y - segs[si - 1].y);
          if (acc + segLen <= drawLen) { ctx.lineTo(segs[si].x, segs[si].y); acc += segLen; }
          else {
            const f = (drawLen - acc) / segLen;
            ctx.lineTo(segs[si - 1].x + (segs[si].x - segs[si - 1].x) * f, segs[si - 1].y + (segs[si].y - segs[si - 1].y) * f);
            break;
          }
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Glowing trace head
        let ha = 0;
        const hd = totalLen * tr.progress;
        for (let si = 1; si < segs.length; si++) {
          const sl = Math.hypot(segs[si].x - segs[si - 1].x, segs[si].y - segs[si - 1].y);
          if (ha + sl >= hd) {
            const f = (hd - ha) / sl;
            const hx = segs[si - 1].x + (segs[si].x - segs[si - 1].x) * f;
            const hy = segs[si - 1].y + (segs[si].y - segs[si - 1].y) * f;
            const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, IS_MOBILE ? 5 : 8);
            g.addColorStop(0, hsla(palPulse, 0.55));
            g.addColorStop(1, hsla(palPulse, 0));
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(hx, hy, IS_MOBILE ? 5 : 8, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          ha += sl;
        }
      }

      // ═══ LAYER 2: Neural connections (curved bezier) ═══
      ctx.lineWidth = 0.35;
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST);
            const flicker = 0.5 + Math.sin(time * 3 + i * 0.7 + j * 0.3) * 0.5;
            ctx.strokeStyle = hsla(palLine, palLine[3] * alpha * 5 * flicker);
            ctx.beginPath();
            ctx.moveTo(pos[i].x, pos[i].y);
            const mx = (pos[i].x + pos[j].x) * 0.5 + Math.sin(time * 0.8 + i) * 10;
            const my = (pos[i].y + pos[j].y) * 0.5 + Math.cos(time * 0.6 + j) * 8;
            ctx.quadraticCurveTo(mx, my, pos[j].x, pos[j].y);
            ctx.stroke();
          }
        }
      }

      // ═══ LAYER 3: Nodes with micro-rings + pointer glow ═══
      for (let i = 0; i < NODE_COUNT; i++) {
        const breathe = 0.5 + Math.sin(time * 2.5 + i * 1.3) * 0.5;
        const r = IS_MOBILE ? 1.5 : 1.1;

        // Pointer proximity glow
        if (ptr.active) {
          const dx = pos[i].x - ptr.x, dy = pos[i].y - ptr.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < repelRadius * 1.5) {
            const glow = (1 - dist / (repelRadius * 1.5)) * 0.4;
            const g = ctx.createRadialGradient(pos[i].x, pos[i].y, 0, pos[i].x, pos[i].y, 12);
            g.addColorStop(0, hsla(palPulse, glow));
            g.addColorStop(1, hsla(palPulse, 0));
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(pos[i].x, pos[i].y, 12, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Micro-ring
        if (!IS_MOBILE && i % 4 === 0) {
          ctx.strokeStyle = hsla(palNode, palNode[3] * 1.2 * breathe);
          ctx.lineWidth = 0.3;
          ctx.beginPath();
          ctx.arc(pos[i].x, pos[i].y, r * 4, 0, Math.PI * 2);
          ctx.stroke();
        }

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
          const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST * 0.55 && (i * 7 + j) % 8 === 0) {
            const speed = 0.18 + (i % 5) * 0.05;
            const prog = ((time * speed + i * 0.37 + j * 0.13) % 1);

            for (let trail = 0; trail < 3; trail++) {
              const tp = Math.max(0, prog - trail * 0.05);
              const tx = pos[i].x + (pos[j].x - pos[i].x) * tp;
              const ty = pos[i].y + (pos[j].y - pos[i].y) * tp;
              ctx.globalAlpha = Math.sin(tp * Math.PI) * (0.15 - trail * 0.04);
              ctx.fillStyle = hsla(palPulse);
              ctx.beginPath();
              ctx.arc(tx, ty, IS_MOBILE ? 1 : 0.8, 0, Math.PI * 2);
              ctx.fill();
            }

            const px = pos[i].x + (pos[j].x - pos[i].x) * prog;
            const py = pos[i].y + (pos[j].y - pos[i].y) * prog;
            ctx.globalAlpha = Math.sin(prog * Math.PI) * 0.7;
            ctx.fillStyle = hsla(palPulse);
            ctx.beginPath();
            ctx.arc(px, py, IS_MOBILE ? 1.8 : 1.5, 0, Math.PI * 2);
            ctx.fill();
            pulseN++;
          }
        }
      }
      ctx.globalAlpha = 1;

      // ═══ LAYER 5: Synapse flashes ═══
      if (!IS_MOBILE) {
        for (let i = 0; i < NODE_COUNT; i++) {
          if (Math.sin(time * 8 + i * 37.7) > 0.97) {
            const g = ctx.createRadialGradient(pos[i].x, pos[i].y, 0, pos[i].x, pos[i].y, 14);
            g.addColorStop(0, hsla(palPulse, 0.45));
            g.addColorStop(1, hsla(palPulse, 0));
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(pos[i].x, pos[i].y, 14, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [ready]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: ready ? 0.55 : 0, transition: "opacity 1.5s ease" }}
    />
  );
};

export default EmpireDNABackground;
