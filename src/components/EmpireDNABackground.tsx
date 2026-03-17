import { useEffect, useRef, useState } from "react";

/**
 * Empire DNA Neural Background — Ultra-tech AI circuit aesthetic.
 * Each scroll section morphs topology: neural mesh → circuit board → DNA helix →
 * constellation → hex lattice → wave interference → radial burst.
 * Features: circuit traces, data packets, glowing junctions, pulsing rings.
 */

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

const NODE_COUNT = IS_MOBILE ? 45 : 80;
const MAX_DIST = IS_MOBILE ? 120 : 160;
const TRACE_COUNT = IS_MOBILE ? 6 : 14;
const DATA_PACKET_COUNT = IS_MOBILE ? 12 : 28;

/* ---------- section palettes — more vivid & distinct ---------- */
const PALETTES = [
  // 0: Neural mesh — electric blue
  { line: [220,35,50,0.10], node: [220,45,60,0.20], pulse: [200,60,70,0.45], glow: [210,50,65,0.12], trace: [220,40,55,0.15] },
  // 1: Circuit board — teal/cyan
  { line: [175,30,45,0.09], node: [175,40,55,0.18], pulse: [170,55,65,0.40], glow: [180,45,60,0.10], trace: [175,35,50,0.14] },
  // 2: DNA helix — violet/magenta
  { line: [280,30,45,0.08], node: [280,40,55,0.16], pulse: [290,55,65,0.38], glow: [275,40,58,0.10], trace: [280,35,50,0.12] },
  // 3: Constellation — deep blue/indigo
  { line: [240,25,40,0.07], node: [240,35,50,0.14], pulse: [250,50,60,0.35], glow: [245,40,55,0.09], trace: [240,30,48,0.11] },
  // 4: Hex lattice — emerald
  { line: [160,28,42,0.08], node: [160,38,52,0.15], pulse: [155,50,62,0.36], glow: [165,42,57,0.09], trace: [160,32,47,0.12] },
  // 5: Wave — amber/gold
  { line: [38,30,45,0.08], node: [38,42,55,0.16], pulse: [42,55,65,0.38], glow: [35,45,58,0.10], trace: [38,36,50,0.13] },
  // 6: Radial — rose/crimson
  { line: [345,28,42,0.07], node: [345,38,52,0.14], pulse: [350,50,62,0.35], glow: [340,40,55,0.09], trace: [345,32,47,0.11] },
];

const SECTIONS = PALETTES.length;

/* ---------- shape generators ---------- */
type ShapeGen = (n: number, w: number, h: number, t: number) => { x: number; y: number }[];

const shapes: ShapeGen[] = [
  // 0: Neural mesh — organic scattered clusters
  (n, w, h, t) => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < n; i++) {
      const seed = i * 137.508;
      const cluster = Math.floor(i / (n / 5));
      const cx = (0.15 + (cluster % 3) * 0.3) * w;
      const cy = (0.2 + Math.floor(cluster / 3) * 0.5) * h;
      const angle = seed + t * 0.06;
      const r = 0.08 + (i % (n / 5)) / (n / 5) * 0.15;
      pts.push({
        x: cx + Math.cos(angle) * r * w + Math.sin(seed * 2.1 + t * 0.04) * w * 0.05,
        y: cy + Math.sin(angle) * r * h + Math.cos(seed * 1.7 + t * 0.03) * h * 0.04,
      });
    }
    return pts;
  },
  // 1: Circuit board — orthogonal grid with junctions
  (n, w, h, _t) => {
    const cols = Math.ceil(Math.sqrt(n * (w / h)) * 1.2);
    const rows = Math.ceil(n / cols);
    const pts: { x: number; y: number }[] = [];
    const padX = w * 0.06, padY = h * 0.06;
    for (let i = 0; i < n; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const jitterX = ((i * 7 + 3) % 5 - 2) * 3;
      const jitterY = ((i * 11 + 7) % 5 - 2) * 3;
      pts.push({
        x: padX + (col / Math.max(cols - 1, 1)) * (w - padX * 2) + ((row % 2) ? (w - padX * 2) / cols * 0.5 : 0) + jitterX,
        y: padY + (row / Math.max(rows - 1, 1)) * (h - padY * 2) + jitterY,
      });
    }
    return pts;
  },
  // 2: DNA Double helix — tighter, with rungs
  (n, w, h, t) => {
    const pts: { x: number; y: number }[] = [];
    const cx = w * 0.5, amp = w * 0.2;
    for (let i = 0; i < n; i++) {
      const f = i / (n - 1);
      const y = h * 0.05 + f * h * 0.9;
      const phase = f * Math.PI * 5 + t * 0.5;
      const strand = i % 3 === 0 ? 0 : (i % 3 === 1 ? 1 : -1);
      const xOff = strand === 0 ? 0 : Math.sin(phase) * amp * strand;
      pts.push({ x: cx + xOff, y });
    }
    return pts;
  },
  // 3: Constellation — fibonacci spiral with arms
  (n, w, h, t) => {
    const pts: { x: number; y: number }[] = [];
    const cx = w * 0.5, cy = h * 0.5;
    for (let i = 0; i < n; i++) {
      const angle = i * 2.3999632 + t * 0.025;
      const r = Math.sqrt(i / n) * Math.min(w, h) * 0.42;
      const wobble = Math.sin(i * 0.5 + t * 0.1) * 5;
      pts.push({ x: cx + Math.cos(angle) * r + wobble, y: cy + Math.sin(angle) * r + wobble });
    }
    return pts;
  },
  // 4: Hexagonal lattice — tight honeycomb
  (n, w, h) => {
    const pts: { x: number; y: number }[] = [];
    const cols = Math.ceil(Math.sqrt(n * 1.15));
    const rows = Math.ceil(n / cols);
    const sx = (w * 0.85) / cols;
    const sy = (h * 0.85) / rows;
    for (let i = 0; i < n; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      pts.push({
        x: w * 0.075 + col * sx + (row % 2 ? sx * 0.5 : 0),
        y: h * 0.075 + row * sy,
      });
    }
    return pts;
  },
  // 5: Wave interference — multi-layer
  (n, w, h, t) => {
    const pts: { x: number; y: number }[] = [];
    const layers = 3;
    const perLayer = Math.ceil(n / layers);
    for (let i = 0; i < n; i++) {
      const layer = Math.floor(i / perLayer);
      const idx = i % perLayer;
      const f = idx / (perLayer - 1);
      const x = w * 0.04 + f * w * 0.92;
      const baseY = h * (0.25 + layer * 0.25);
      const wave1 = Math.sin(f * Math.PI * 3.5 + t * 0.35 + layer) * h * 0.1;
      const wave2 = Math.cos(f * Math.PI * 5.5 - t * 0.25 + layer * 2) * h * 0.05;
      pts.push({ x, y: baseY + wave1 + wave2 });
    }
    return pts;
  },
  // 6: Radial burst — concentric rings with spin
  (n, w, h, t) => {
    const pts: { x: number; y: number }[] = [];
    const cx = w * 0.5, cy = h * 0.5;
    const rings = 5;
    for (let i = 0; i < n; i++) {
      const ring = Math.floor(i / (n / rings));
      const idxInRing = i % Math.ceil(n / rings);
      const countInRing = Math.ceil(n / rings);
      const angle = (idxInRing / countInRing) * Math.PI * 2 + ring * 0.4 + t * (0.015 + ring * 0.008);
      const r = ((ring + 1) / rings) * Math.min(w, h) * 0.4;
      pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
    return pts;
  },
];

/* ---------- helpers ---------- */
const hsla = (c: number[], ao?: number) => `hsla(${c[0]},${c[1]}%,${c[2]}%,${ao ?? c[3]})`;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpC = (a: number[], b: number[], t: number): number[] => a.map((v, i) => lerp(v, b[i], t));

/* ---------- circuit trace path ---------- */
interface TracePath {
  nodes: number[]; // indices of nodes forming path
  progress: number;
  speed: number;
  dir: number;
}

/* ---------- data packet ---------- */
interface DataPacket {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  size: number;
}

/* ---------- component ---------- */
const EmpireDNABackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const scrollRef = useRef(0);
  const [ready, setReady] = useState(false);
  const posRef = useRef<{ x: number; y: number }[]>([]);
  const timeRef = useRef(0);
  const tracesRef = useRef<TracePath[]>([]);
  const packetsRef = useRef<DataPacket[]>([]);

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

    // Init traces
    if (tracesRef.current.length === 0) {
      for (let i = 0; i < TRACE_COUNT; i++) {
        const len = 3 + Math.floor(Math.random() * 5);
        const nodes: number[] = [];
        let cur = Math.floor(Math.random() * NODE_COUNT);
        for (let j = 0; j < len; j++) {
          nodes.push(cur);
          cur = (cur + 1 + Math.floor(Math.random() * 8)) % NODE_COUNT;
        }
        tracesRef.current.push({ nodes, progress: Math.random(), speed: 0.002 + Math.random() * 0.004, dir: 1 });
      }
    }

    // Init data packets
    if (packetsRef.current.length === 0) {
      for (let i = 0; i < DATA_PACKET_COUNT; i++) {
        packetsRef.current.push({
          fromIdx: Math.floor(Math.random() * NODE_COUNT),
          toIdx: Math.floor(Math.random() * NODE_COUNT),
          progress: Math.random(),
          speed: 0.005 + Math.random() * 0.015,
          size: IS_MOBILE ? 1.5 + Math.random() * 1.5 : 1 + Math.random() * 2,
        });
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
      const t3 = blend * blend * (3 - 2 * blend); // smoothstep

      // Palette interpolation
      const pal = {
        line: lerpC(PALETTES[sIdx].line, PALETTES[sIdx + 1].line, t3),
        node: lerpC(PALETTES[sIdx].node, PALETTES[sIdx + 1].node, t3),
        pulse: lerpC(PALETTES[sIdx].pulse, PALETTES[sIdx + 1].pulse, t3),
        glow: lerpC(PALETTES[sIdx].glow, PALETTES[sIdx + 1].glow, t3),
        trace: lerpC(PALETTES[sIdx].trace, PALETTES[sIdx + 1].trace, t3),
      };

      // Shape morphing
      const shA = sIdx % shapes.length;
      const shB = (sIdx + 1) % shapes.length;
      const tgtA = shapes[shA](NODE_COUNT, w, h, time);
      const tgtB = shapes[shB](NODE_COUNT, w, h, time);
      const targets = tgtA.map((a, i) => ({
        x: lerp(a.x, tgtB[i].x, t3),
        y: lerp(a.y, tgtB[i].y, t3),
      }));

      // Ease positions
      const pos = posRef.current;
      for (let i = 0; i < NODE_COUNT; i++) {
        if (!pos[i]) pos[i] = { ...targets[i] };
        pos[i].x += (targets[i].x - pos[i].x) * 0.04;
        pos[i].y += (targets[i].y - pos[i].y) * 0.04;
      }

      // ---------- DRAW CIRCUIT TRACE PATHS ----------
      ctx.lineCap = "round";
      for (const trace of tracesRef.current) {
        trace.progress += trace.speed * trace.dir;
        if (trace.progress > 1) { trace.progress = 1; trace.dir = -1; }
        if (trace.progress < 0) { trace.progress = 0; trace.dir = 1; }

        const ns = trace.nodes;
        if (ns.length < 2) continue;

        // Draw the full trace path (dim)
        ctx.lineWidth = IS_MOBILE ? 1.2 : 0.8;
        ctx.strokeStyle = hsla(pal.trace, pal.trace[3] * 0.4);
        ctx.beginPath();
        ctx.moveTo(pos[ns[0]].x, pos[ns[0]].y);
        for (let k = 1; k < ns.length; k++) {
          // Circuit-style: horizontal then vertical
          const prev = pos[ns[k - 1]];
          const cur = pos[ns[k]];
          const midX = cur.x;
          ctx.lineTo(midX, prev.y);
          ctx.lineTo(cur.x, cur.y);
        }
        ctx.stroke();

        // Draw glowing progress indicator on trace
        const totalSegs = ns.length - 1;
        const segF = trace.progress * totalSegs;
        const segI = Math.min(Math.floor(segF), totalSegs - 1);
        const segBlend = segF - segI;
        const pA = pos[ns[segI]];
        const pB = pos[ns[segI + 1]];
        // Circuit path: horizontal then vertical
        let px: number, py: number;
        if (segBlend < 0.5) {
          const t2 = segBlend * 2;
          px = lerp(pA.x, pB.x, t2);
          py = pA.y;
        } else {
          px = pB.x;
          py = lerp(pA.y, pB.y, (segBlend - 0.5) * 2);
        }

        // Glow ring
        const grad = ctx.createRadialGradient(px, py, 0, px, py, IS_MOBILE ? 12 : 18);
        grad.addColorStop(0, hsla(pal.pulse, 0.5));
        grad.addColorStop(0.5, hsla(pal.pulse, 0.15));
        grad.addColorStop(1, hsla(pal.pulse, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, IS_MOBILE ? 12 : 18, 0, Math.PI * 2);
        ctx.fill();
      }

      // ---------- DRAW CONNECTIONS ----------
      ctx.lineWidth = IS_MOBILE ? 0.6 : 0.4;
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = pos[i].x - pos[j].x;
          const dy = pos[i].y - pos[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST);
            // Circuit-style: L-shaped lines for some connections
            const isCircuit = (i + j) % 4 === 0;
            ctx.strokeStyle = hsla(pal.line, pal.line[3] * alpha * 6);
            ctx.beginPath();
            if (isCircuit) {
              ctx.moveTo(pos[i].x, pos[i].y);
              ctx.lineTo(pos[j].x, pos[i].y); // horizontal
              ctx.lineTo(pos[j].x, pos[j].y); // vertical
            } else {
              ctx.moveTo(pos[i].x, pos[i].y);
              ctx.lineTo(pos[j].x, pos[j].y);
            }
            ctx.stroke();
          }
        }
      }

      // ---------- DRAW DATA PACKETS ----------
      for (const pkt of packetsRef.current) {
        pkt.progress += pkt.speed;
        if (pkt.progress > 1) {
          pkt.progress = 0;
          pkt.fromIdx = pkt.toIdx;
          pkt.toIdx = Math.floor(Math.random() * NODE_COUNT);
          pkt.speed = 0.005 + Math.random() * 0.015;
        }
        const from = pos[pkt.fromIdx];
        const to = pos[pkt.toIdx];
        if (!from || !to) continue;
        const px = lerp(from.x, to.x, pkt.progress);
        const py = lerp(from.y, to.y, pkt.progress);
        const a = Math.sin(pkt.progress * Math.PI) * 0.7;

        // Packet glow
        ctx.globalAlpha = a;
        ctx.fillStyle = hsla(pal.pulse, 0.8);
        ctx.beginPath();
        ctx.arc(px, py, pkt.size, 0, Math.PI * 2);
        ctx.fill();

        // Packet trail
        const trail = 0.08;
        for (let t = 1; t <= 3; t++) {
          const tp = Math.max(0, pkt.progress - trail * t);
          const tx = lerp(from.x, to.x, tp);
          const ty = lerp(from.y, to.y, tp);
          ctx.globalAlpha = a * (1 - t * 0.3) * 0.4;
          ctx.fillStyle = hsla(pal.pulse, 0.5);
          ctx.beginPath();
          ctx.arc(tx, ty, pkt.size * (1 - t * 0.2), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // ---------- DRAW NODES ----------
      for (let i = 0; i < NODE_COUNT; i++) {
        const pulse = 0.6 + Math.sin(time * 2.5 + i * 0.7) * 0.4;

        // Outer glow for junction nodes (every 5th)
        if (i % 5 === 0) {
          const glowR = IS_MOBILE ? 8 : 12;
          const grd = ctx.createRadialGradient(pos[i].x, pos[i].y, 0, pos[i].x, pos[i].y, glowR);
          grd.addColorStop(0, hsla(pal.glow, pal.glow[3] * pulse * 3));
          grd.addColorStop(1, hsla(pal.glow, 0));
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(pos[i].x, pos[i].y, glowR, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node dot
        const r = i % 5 === 0 ? (IS_MOBILE ? 2.5 : 2) : (IS_MOBILE ? 1.5 : 1.1);
        ctx.globalAlpha = pulse;
        ctx.fillStyle = hsla(pal.node, pal.node[3] * 3.5);
        ctx.beginPath();
        ctx.arc(pos[i].x, pos[i].y, r, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing ring on junction nodes
        if (i % 10 === 0) {
          const ringPhase = (time * 0.8 + i) % 2;
          if (ringPhase < 1.5) {
            const ringR = 3 + ringPhase * 8;
            ctx.globalAlpha = (1 - ringPhase / 1.5) * 0.3;
            ctx.strokeStyle = hsla(pal.pulse, 0.6);
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.arc(pos[i].x, pos[i].y, ringR, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // ---------- SECTION INDICATOR RINGS (subtle) ----------
      const ringCx = w * 0.5;
      const ringCy = h * 0.5;
      const ringR = Math.min(w, h) * 0.35;
      const ringAlpha = 0.04 + Math.sin(time * 0.5) * 0.02;
      ctx.strokeStyle = hsla(pal.trace, ringAlpha);
      ctx.lineWidth = 0.5;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.arc(ringCx, ringCy, ringR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

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
      style={{ opacity: ready ? 0.55 : 0, transition: "opacity 1.5s ease" }}
    />
  );
};

export default EmpireDNABackground;
