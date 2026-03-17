import { useEffect, useRef, useState } from "react";

/**
 * Empire Background v8 — Professional AI Circuit Data Flow
 * Desaturated, monochrome-ish palette. Lines, dashes, data packets.
 * Scroll morphs topology. Feels like a living circuit board / data network.
 * Zero circles. Pure lines and crosses.
 */

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

const NODE_COUNT = IS_MOBILE ? 45 : 85;
const MAX_DIST = IS_MOBILE ? 125 : 155;
const CIRCUIT_COUNT = IS_MOBILE ? 10 : 22;

/* Desaturated professional palettes — barely colored, like a real circuit schematic */
const PALETTES = [
  { line: [215,8,42,0.05],  trace: [215,10,45,0.08], accent: [215,8,50,0.06] },
  { line: [200,6,40,0.04],  trace: [200,8,43,0.07],  accent: [200,6,48,0.05] },
  { line: [230,7,38,0.04],  trace: [230,9,42,0.07],  accent: [230,7,46,0.05] },
  { line: [210,8,41,0.05],  trace: [210,10,44,0.08], accent: [210,8,49,0.06] },
  { line: [220,6,39,0.04],  trace: [220,8,42,0.07],  accent: [220,6,47,0.05] },
  { line: [205,7,40,0.04],  trace: [205,9,43,0.07],  accent: [205,7,48,0.05] },
  { line: [215,8,41,0.05],  trace: [215,10,44,0.08], accent: [215,8,49,0.06] },
];
const SECTIONS = PALETTES.length;

type Pt = { x: number; y: number };

const topologies: Array<(n: number, w: number, h: number, t: number) => Pt[]> = [
  // Circuit board grid
  (n, w, h, t) => {
    const cols = Math.ceil(Math.sqrt(n * (w / h)));
    const rows = Math.ceil(n / cols);
    const px = w * 0.05, py = h * 0.05;
    return Array.from({ length: n }, (_, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const j = Math.sin(t * 0.2 + i * 0.3) * 2;
      return {
        x: px + (col / Math.max(cols - 1, 1)) * (w - px * 2) + (row % 2 ? (w - px * 2) / cols * 0.5 : 0) + j,
        y: py + (row / Math.max(rows - 1, 1)) * (h - py * 2) + j * 0.5,
      };
    });
  },
  // Data wave lanes
  (n, w, h, t) => {
    const rows = 6;
    const perRow = Math.ceil(n / rows);
    return Array.from({ length: n }, (_, i) => {
      const row = Math.floor(i / perRow), col = i % perRow;
      const f = col / Math.max(perRow - 1, 1);
      return {
        x: w * 0.02 + f * w * 0.96,
        y: h * (0.08 + row * 0.15) + Math.sin(f * Math.PI * 3 + t * 0.35 + row * 0.9) * h * 0.04,
      };
    });
  },
  // Cluster nodes
  (n, w, h, t) => {
    const clusters = 5;
    const perC = Math.ceil(n / clusters);
    return Array.from({ length: n }, (_, i) => {
      const ci = Math.floor(i / perC), li = i % perC;
      const cx = w * (0.14 + (ci % 3) * 0.36);
      const cy = h * (0.2 + Math.floor(ci / 3) * 0.5);
      const a = li * 2.4 + t * 0.04 + ci;
      const r = Math.sqrt(li / perC) * Math.min(w, h) * 0.1;
      return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
    });
  },
  // Hex lattice
  (n, w, h, t) => {
    const cols = Math.ceil(Math.sqrt(n * 1.1)), rows = Math.ceil(n / cols);
    const sx = (w * 0.9) / cols, sy = (h * 0.88) / rows;
    return Array.from({ length: n }, (_, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const b = Math.sin(t * 0.15 + row * 0.3 + col * 0.2) * 3;
      return {
        x: w * 0.05 + col * sx + (row % 2 ? sx * 0.5 : 0) + b,
        y: h * 0.06 + row * sy + b * 0.4,
      };
    });
  },
  // Diagonal data lanes
  (n, w, h, t) => {
    const lanes = 7;
    const perL = Math.ceil(n / lanes);
    return Array.from({ length: n }, (_, i) => {
      const lane = Math.floor(i / perL), li = i % perL;
      const f = li / Math.max(perL - 1, 1);
      const drift = Math.sin(f * Math.PI * 1.5 + t * 0.25 + lane) * h * 0.02;
      return { x: w * (-0.05 + f * 1.1), y: h * (0.04 + lane * 0.13) + f * h * 0.12 + drift };
    });
  },
  // Converging streams
  (n, w, h, t) => {
    const streams = 4;
    const perS = Math.ceil(n / streams);
    return Array.from({ length: n }, (_, i) => {
      const si = Math.floor(i / perS), li = i % perS;
      const f = li / Math.max(perS - 1, 1);
      const sx = si < 2 ? w * 0.02 : w * 0.98;
      const sy = si % 2 === 0 ? h * 0.05 : h * 0.95;
      const ex = w * 0.5 + Math.sin(t * 0.08 + si) * w * 0.12;
      const ey = h * 0.5 + Math.cos(t * 0.06 + si) * h * 0.08;
      const bend = Math.sin(f * Math.PI + t * 0.15 + si * 1.3) * Math.min(w, h) * 0.04;
      return { x: sx + (ex - sx) * f + bend * (si < 2 ? 1 : -1), y: sy + (ey - sy) * f + bend * 0.4 };
    });
  },
  // Scattered fibonacci
  (n, w, h, t) => {
    return Array.from({ length: n }, (_, i) => {
      const seed = i * 137.508;
      const a = seed + t * 0.05;
      const r = 0.08 + (i / n) * 0.42;
      return {
        x: w * 0.5 + Math.cos(a) * r * w + Math.sin(seed * 2 + t * 0.03) * w * 0.06,
        y: h * 0.5 + Math.sin(a) * r * h + Math.cos(seed * 1.7 + t * 0.02) * h * 0.05,
      };
    });
  },
];

interface Circuit {
  segs: Pt[]; prog: number; speed: number; life: number; maxLife: number;
}

function spawnCircuit(w: number, h: number): Circuit {
  const segs: Pt[] = [];
  let x = Math.random() * w, y = Math.random() * h;
  segs.push({ x, y });
  const steps = 3 + Math.floor(Math.random() * 5);
  for (let s = 0; s < steps; s++) {
    const horiz = Math.random() > 0.5;
    const dist = 40 + Math.random() * 150;
    if (horiz) x += (Math.random() > 0.5 ? 1 : -1) * dist;
    else y += (Math.random() > 0.5 ? 1 : -1) * dist;
    x = Math.max(5, Math.min(w - 5, x));
    y = Math.max(5, Math.min(h - 5, y));
    segs.push({ x, y });
  }
  return { segs, prog: 0, speed: 0.002 + Math.random() * 0.004, life: 0, maxLife: 280 + Math.random() * 380 };
}

const hsl = (c: number[], ao?: number) => `hsla(${c[0]},${c[1]}%,${c[2]}%,${ao ?? c[3]})`;
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
  const circuitsRef = useRef<Circuit[]>([]);
  const ptrRef = useRef<{ x: number; y: number; active: boolean }>({ x: -999, y: -999, active: false });

  useEffect(() => { const t = setTimeout(() => setReady(true), 300); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const fn = () => { scrollRef.current = window.scrollY; };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
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

    if (!posRef.current.length) posRef.current = Array.from({ length: NODE_COUNT }, () => ({ x: Math.random() * (w || 1000), y: Math.random() * (h || 800) }));
    if (!circuitsRef.current.length && w && h) for (let i = 0; i < CIRCUIT_COUNT; i++) circuitsRef.current.push(spawnCircuit(w, h));

    const animate = () => {
      if (!w || !h) { animRef.current = requestAnimationFrame(animate); return; }
      timeRef.current += 0.016;
      const time = timeRef.current;
      ctx.clearRect(0, 0, w, h);

      const pageH = document.documentElement.scrollHeight - h;
      const scrollN = pageH > 0 ? Math.min(scrollRef.current / pageH, 1) : 0;
      const sF = scrollN * (SECTIONS - 1);
      const sIdx = Math.min(Math.floor(sF), SECTIONS - 2);
      const blend = sF - sIdx;
      const t3 = blend * blend * (3 - 2 * blend);

      const pLine = lerpC(PALETTES[sIdx].line, PALETTES[sIdx + 1].line, t3);
      const pTrace = lerpC(PALETTES[sIdx].trace, PALETTES[sIdx + 1].trace, t3);
      const pAccent = lerpC(PALETTES[sIdx].accent, PALETTES[sIdx + 1].accent, t3);

      // Morph topology
      const shA = sIdx % topologies.length, shB = (sIdx + 1) % topologies.length;
      const tA = topologies[shA](NODE_COUNT, w, h, time);
      const tB = topologies[shB](NODE_COUNT, w, h, time);
      const targets = tA.map((a, i) => ({ x: lerp(a.x, tB[i].x, t3), y: lerp(a.y, tB[i].y, t3) }));

      const pos = posRef.current;
      const ptr = ptrRef.current;
      const repR = IS_MOBILE ? 75 : 105;

      for (let i = 0; i < NODE_COUNT; i++) {
        if (!pos[i]) pos[i] = { ...targets[i] };
        let tx = targets[i].x, ty = targets[i].y;
        if (ptr.active) {
          const dx = tx - ptr.x, dy = ty - ptr.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < repR && d > 1) { const f = (1 - d / repR) * 25; tx += (dx / d) * f; ty += (dy / d) * f; }
        }
        pos[i].x += (tx - pos[i].x) * 0.04;
        pos[i].y += (ty - pos[i].y) * 0.04;
      }

      // ═══ CIRCUIT TRACES ═══
      const circuits = circuitsRef.current;
      for (let ci = 0; ci < circuits.length; ci++) {
        const ct = circuits[ci];
        ct.prog = Math.min(ct.prog + ct.speed, 1);
        ct.life++;
        if (ct.life > ct.maxLife || ct.prog >= 1) { circuits[ci] = spawnCircuit(w, h); continue; }

        const segs = ct.segs;
        let totalLen = 0;
        for (let si = 1; si < segs.length; si++) totalLen += Math.hypot(segs[si].x - segs[si - 1].x, segs[si].y - segs[si - 1].y);
        const drawLen = totalLen * ct.prog;

        ctx.beginPath();
        ctx.strokeStyle = hsl(pTrace, pTrace[3] * 1.8);
        ctx.lineWidth = 0.5;
        ctx.setLineDash([3, 7]);
        let acc = 0;
        ctx.moveTo(segs[0].x, segs[0].y);
        let hx = segs[0].x, hy = segs[0].y, ha = 0;
        for (let si = 1; si < segs.length; si++) {
          const sl = Math.hypot(segs[si].x - segs[si - 1].x, segs[si].y - segs[si - 1].y);
          if (acc + sl <= drawLen) {
            ctx.lineTo(segs[si].x, segs[si].y);
            hx = segs[si].x; hy = segs[si].y;
            ha = Math.atan2(segs[si].y - segs[si - 1].y, segs[si].x - segs[si - 1].x);
            acc += sl;
          } else {
            const f = (drawLen - acc) / sl;
            hx = segs[si - 1].x + (segs[si].x - segs[si - 1].x) * f;
            hy = segs[si - 1].y + (segs[si].y - segs[si - 1].y) * f;
            ha = Math.atan2(segs[si].y - segs[si - 1].y, segs[si].x - segs[si - 1].x);
            ctx.lineTo(hx, hy);
            break;
          }
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Head dash
        const hl = IS_MOBILE ? 3 : 5;
        ctx.beginPath();
        ctx.moveTo(hx - Math.cos(ha) * hl, hy - Math.sin(ha) * hl);
        ctx.lineTo(hx + Math.cos(ha) * hl, hy + Math.sin(ha) * hl);
        ctx.strokeStyle = hsl(pAccent, 0.35);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // ═══ NEURAL CONNECTIONS — curved bezier ═══
      ctx.lineWidth = 0.25;
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const alpha = (1 - d / MAX_DIST);
            const flicker = 0.6 + Math.sin(time * 2 + i * 0.5 + j * 0.25) * 0.4;
            ctx.strokeStyle = hsl(pLine, pLine[3] * alpha * 4 * flicker);
            ctx.beginPath();
            ctx.moveTo(pos[i].x, pos[i].y);
            const mx = (pos[i].x + pos[j].x) * 0.5 + Math.sin(time * 0.6 + i) * 6;
            const my = (pos[i].y + pos[j].y) * 0.5 + Math.cos(time * 0.4 + j) * 5;
            ctx.quadraticCurveTo(mx, my, pos[j].x, pos[j].y);
            ctx.stroke();
          }
        }
      }

      // ═══ NODE CROSSES ═══
      for (let i = 0; i < NODE_COUNT; i++) {
        const breathe = 0.5 + Math.sin(time * 1.8 + i * 1.2) * 0.5;
        const sz = IS_MOBILE ? 1.8 : 1.5;
        let na = pAccent[3] * 2 * breathe;
        if (ptr.active) {
          const dx = pos[i].x - ptr.x, dy = pos[i].y - ptr.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < repR * 1.2) na = Math.min(na + (1 - d / (repR * 1.2)) * 0.2, 0.4);
        }
        ctx.strokeStyle = hsl(pAccent, na);
        ctx.lineWidth = 0.4;
        ctx.beginPath(); ctx.moveTo(pos[i].x - sz, pos[i].y); ctx.lineTo(pos[i].x + sz, pos[i].y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pos[i].x, pos[i].y - sz); ctx.lineTo(pos[i].x, pos[i].y + sz); ctx.stroke();
      }

      // ═══ DATA PACKETS traveling between close nodes ═══
      let pN = 0;
      const maxP = IS_MOBILE ? 12 : 30;
      for (let i = 0; i < NODE_COUNT && pN < maxP; i++) {
        for (let j = i + 1; j < NODE_COUNT && pN < maxP; j++) {
          const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST * 0.45 && (i * 7 + j) % 10 === 0) {
            const spd = 0.12 + (i % 4) * 0.04;
            const prog = ((time * spd + i * 0.3 + j * 0.12) % 1);
            const px = pos[i].x + (pos[j].x - pos[i].x) * prog;
            const py = pos[i].y + (pos[j].y - pos[i].y) * prog;
            const angle = Math.atan2(pos[j].y - pos[i].y, pos[j].x - pos[i].x);
            const fa = Math.sin(prog * Math.PI) * 0.35;
            const dl = IS_MOBILE ? 2.5 : 2;
            ctx.beginPath();
            ctx.moveTo(px - Math.cos(angle) * dl, py - Math.sin(angle) * dl);
            ctx.lineTo(px + Math.cos(angle) * dl, py + Math.sin(angle) * dl);
            ctx.strokeStyle = hsl(pTrace, fa);
            ctx.lineWidth = 0.7;
            ctx.stroke();
            pN++;
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
      style={{ opacity: 0.9, willChange: "transform", transform: "translateZ(0)" }}
    />
  );
};

export default EmpireDNABackground;
