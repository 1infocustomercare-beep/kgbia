import { useEffect, useRef, useState } from "react";

/**
 * Empire Background v9 — Hyper-Professional AI Circuit
 * More visible lines, faster data flow, horizontal scan lines,
 * stronger topology morphing. Still desaturated and professional.
 */

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

const NODE_COUNT = IS_MOBILE ? 55 : 110;
const MAX_DIST = IS_MOBILE ? 110 : 145;
const CIRCUIT_COUNT = IS_MOBILE ? 12 : 28;
const SCAN_LINES = IS_MOBILE ? 4 : 8;

const PALETTES = [
  { line: [215,10,44,0.07], trace: [215,12,48,0.11], accent: [215,10,52,0.09], scan: [215,8,50,0.03] },
  { line: [200,8,42,0.06],  trace: [200,10,46,0.10], accent: [200,8,50,0.08], scan: [200,6,48,0.025] },
  { line: [230,9,40,0.06],  trace: [230,11,44,0.10], accent: [230,9,48,0.08], scan: [230,7,46,0.025] },
  { line: [210,10,43,0.07], trace: [210,12,47,0.11], accent: [210,10,51,0.09], scan: [210,8,49,0.03] },
  { line: [220,8,41,0.06],  trace: [220,10,45,0.10], accent: [220,8,49,0.08], scan: [220,6,47,0.025] },
  { line: [205,9,42,0.06],  trace: [205,11,46,0.10], accent: [205,9,50,0.08], scan: [205,7,48,0.025] },
  { line: [215,10,43,0.07], trace: [215,12,47,0.11], accent: [215,10,51,0.09], scan: [215,8,49,0.03] },
];
const SECTIONS = PALETTES.length;

type Pt = { x: number; y: number };

const topologies: Array<(n: number, w: number, h: number, t: number) => Pt[]> = [
  // 0: Staggered circuit grid
  (n, w, h, t) => {
    const cols = Math.ceil(Math.sqrt(n * (w / h)));
    const rows = Math.ceil(n / cols);
    const px = w * 0.04, py = h * 0.04;
    return Array.from({ length: n }, (_, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const j = Math.sin(t * 0.22 + i * 0.35) * 3;
      return {
        x: px + (col / Math.max(cols - 1, 1)) * (w - px * 2) + (row % 2 ? (w - px * 2) / cols * 0.5 : 0) + j,
        y: py + (row / Math.max(rows - 1, 1)) * (h - py * 2) + j * 0.5,
      };
    });
  },
  // 1: Flowing data waves
  (n, w, h, t) => {
    const rows = 7;
    const perRow = Math.ceil(n / rows);
    return Array.from({ length: n }, (_, i) => {
      const row = Math.floor(i / perRow), col = i % perRow;
      const f = col / Math.max(perRow - 1, 1);
      return {
        x: w * 0.01 + f * w * 0.98,
        y: h * (0.06 + row * 0.13) + Math.sin(f * Math.PI * 4 + t * 0.4 + row * 0.8) * h * 0.035 + Math.cos(f * Math.PI * 7 - t * 0.2) * h * 0.015,
      };
    });
  },
  // 2: Neural clusters
  (n, w, h, t) => {
    const clusters = 6;
    const perC = Math.ceil(n / clusters);
    return Array.from({ length: n }, (_, i) => {
      const ci = Math.floor(i / perC), li = i % perC;
      const cx2 = w * (0.12 + (ci % 3) * 0.38);
      const cy2 = h * (0.16 + Math.floor(ci / 3) * 0.48);
      const a = li * 2.4 + t * 0.045 + ci * 1.1;
      const r = Math.sqrt(li / perC) * Math.min(w, h) * 0.11;
      return { x: cx2 + Math.cos(a) * r, y: cy2 + Math.sin(a) * r };
    });
  },
  // 3: Hex lattice breathing
  (n, w, h, t) => {
    const cols = Math.ceil(Math.sqrt(n * 1.15)), rows = Math.ceil(n / cols);
    const sx = (w * 0.92) / cols, sy = (h * 0.9) / rows;
    return Array.from({ length: n }, (_, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const b = Math.sin(t * 0.18 + row * 0.35 + col * 0.22) * 4;
      return {
        x: w * 0.04 + col * sx + (row % 2 ? sx * 0.5 : 0) + b,
        y: h * 0.05 + row * sy + b * 0.4,
      };
    });
  },
  // 4: Diagonal data lanes
  (n, w, h, t) => {
    const lanes = 8;
    const perL = Math.ceil(n / lanes);
    return Array.from({ length: n }, (_, i) => {
      const lane = Math.floor(i / perL), li = i % perL;
      const f = li / Math.max(perL - 1, 1);
      const drift = Math.sin(f * Math.PI * 2 + t * 0.28 + lane * 0.7) * h * 0.02;
      return { x: w * (-0.03 + f * 1.06), y: h * (0.03 + lane * 0.115) + f * h * 0.1 + drift };
    });
  },
  // 5: Converging streams to center
  (n, w, h, t) => {
    const streams = 5;
    const perS = Math.ceil(n / streams);
    return Array.from({ length: n }, (_, i) => {
      const si = Math.floor(i / perS), li = i % perS;
      const f = li / Math.max(perS - 1, 1);
      const angles = [0, Math.PI * 0.4, Math.PI * 0.8, Math.PI * 1.2, Math.PI * 1.6];
      const sa = angles[si % 5];
      const startX = w * 0.5 + Math.cos(sa) * w * 0.55;
      const startY = h * 0.5 + Math.sin(sa) * h * 0.55;
      const ex = w * 0.5 + Math.sin(t * 0.07 + si) * w * 0.08;
      const ey = h * 0.5 + Math.cos(t * 0.05 + si) * h * 0.06;
      const bend = Math.sin(f * Math.PI + t * 0.15 + si * 1.2) * Math.min(w, h) * 0.05;
      const perpX = Math.cos(sa + Math.PI / 2) * bend;
      const perpY = Math.sin(sa + Math.PI / 2) * bend;
      return { x: startX + (ex - startX) * f + perpX, y: startY + (ey - startY) * f + perpY };
    });
  },
  // 6: Fibonacci scatter
  (n, w, h, t) => {
    return Array.from({ length: n }, (_, i) => {
      const seed = i * 137.508;
      const a = seed + t * 0.05;
      const r = 0.06 + (i / n) * 0.44;
      return {
        x: w * 0.5 + Math.cos(a) * r * w + Math.sin(seed * 2.1 + t * 0.03) * w * 0.07,
        y: h * 0.5 + Math.sin(a) * r * h + Math.cos(seed * 1.7 + t * 0.025) * h * 0.05,
      };
    });
  },
];

interface Circuit { segs: Pt[]; prog: number; speed: number; life: number; maxLife: number; }

function spawnCircuit(w: number, h: number): Circuit {
  const segs: Pt[] = [];
  let x = Math.random() * w, y = Math.random() * h;
  segs.push({ x, y });
  const steps = 4 + Math.floor(Math.random() * 6);
  for (let s = 0; s < steps; s++) {
    const horiz = Math.random() > 0.5;
    const dist = 50 + Math.random() * 200;
    if (horiz) x += (Math.random() > 0.5 ? 1 : -1) * dist;
    else y += (Math.random() > 0.5 ? 1 : -1) * dist;
    x = Math.max(5, Math.min(w - 5, x));
    y = Math.max(5, Math.min(h - 5, y));
    segs.push({ x, y });
  }
  return { segs, prog: 0, speed: 0.003 + Math.random() * 0.006, life: 0, maxLife: 220 + Math.random() * 350 };
}

interface ScanLine { y: number; speed: number; opacity: number; }

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
  const scansRef = useRef<ScanLine[]>([]);
  const ptrRef = useRef<{ x: number; y: number; active: boolean }>({ x: -999, y: -999, active: false });

  useEffect(() => { const t = setTimeout(() => setReady(true), 250); return () => clearTimeout(t); }, []);

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
    if (!scansRef.current.length) {
      for (let i = 0; i < SCAN_LINES; i++) scansRef.current.push({ y: Math.random(), speed: 0.0003 + Math.random() * 0.0006, opacity: 0.3 + Math.random() * 0.7 });
    }

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
      const pScan = lerpC(PALETTES[sIdx].scan, PALETTES[sIdx + 1].scan, t3);

      // Morph topology
      const shA = sIdx % topologies.length, shB = (sIdx + 1) % topologies.length;
      const tA = topologies[shA](NODE_COUNT, w, h, time);
      const tB = topologies[shB](NODE_COUNT, w, h, time);
      const targets = tA.map((a, i) => ({ x: lerp(a.x, tB[i].x, t3), y: lerp(a.y, tB[i].y, t3) }));

      const pos = posRef.current;
      const ptr = ptrRef.current;
      const repR = IS_MOBILE ? 70 : 100;

      for (let i = 0; i < NODE_COUNT; i++) {
        if (!pos[i]) pos[i] = { ...targets[i] };
        let tx = targets[i].x, ty = targets[i].y;
        if (ptr.active) {
          const dx = tx - ptr.x, dy = ty - ptr.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < repR && d > 1) { const f = (1 - d / repR) * 28; tx += (dx / d) * f; ty += (dy / d) * f; }
        }
        pos[i].x += (tx - pos[i].x) * 0.035;
        pos[i].y += (ty - pos[i].y) * 0.035;
      }

      // ═══ L0: HORIZONTAL SCAN LINES ═══
      const scans = scansRef.current;
      for (const sl of scans) {
        sl.y = (sl.y + sl.speed) % 1;
        const sy = sl.y * h;
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(w, sy);
        ctx.strokeStyle = hsl(pScan, pScan[3] * sl.opacity);
        ctx.lineWidth = 0.3;
        ctx.stroke();
      }

      // ═══ L1: CIRCUIT TRACES ═══
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
        ctx.strokeStyle = hsl(pTrace, pTrace[3] * 2);
        ctx.lineWidth = 0.6;
        ctx.setLineDash([4, 6]);
        let acc = 0;
        ctx.moveTo(segs[0].x, segs[0].y);
        let headX = segs[0].x, headY = segs[0].y, headA = 0;
        for (let si = 1; si < segs.length; si++) {
          const sl = Math.hypot(segs[si].x - segs[si - 1].x, segs[si].y - segs[si - 1].y);
          if (acc + sl <= drawLen) {
            ctx.lineTo(segs[si].x, segs[si].y);
            headX = segs[si].x; headY = segs[si].y;
            headA = Math.atan2(segs[si].y - segs[si - 1].y, segs[si].x - segs[si - 1].x);
            acc += sl;
          } else {
            const f = (drawLen - acc) / sl;
            headX = segs[si - 1].x + (segs[si].x - segs[si - 1].x) * f;
            headY = segs[si - 1].y + (segs[si].y - segs[si - 1].y) * f;
            headA = Math.atan2(segs[si].y - segs[si - 1].y, segs[si].x - segs[si - 1].x);
            ctx.lineTo(headX, headY);
            break;
          }
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Junction squares at corners
        for (let si = 1; si < segs.length - 1; si++) {
          const sx2 = segs[si].x, sy2 = segs[si].y;
          const segDone = totalLen > 0 ? acc / totalLen : 0;
          if (segDone > (si / segs.length)) {
            const sq = 1.5;
            ctx.strokeStyle = hsl(pAccent, 0.2);
            ctx.lineWidth = 0.4;
            ctx.strokeRect(sx2 - sq, sy2 - sq, sq * 2, sq * 2);
          }
        }

        // Head dash
        const hl = IS_MOBILE ? 4 : 6;
        ctx.beginPath();
        ctx.moveTo(headX - Math.cos(headA) * hl, headY - Math.sin(headA) * hl);
        ctx.lineTo(headX + Math.cos(headA) * hl, headY + Math.sin(headA) * hl);
        ctx.strokeStyle = hsl(pAccent, 0.45);
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // ═══ L2: NEURAL CONNECTIONS ═══
      ctx.lineWidth = 0.3;
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const alpha = (1 - d / MAX_DIST);
            const flicker = 0.55 + Math.sin(time * 2.2 + i * 0.5 + j * 0.3) * 0.45;
            ctx.strokeStyle = hsl(pLine, pLine[3] * alpha * 4.5 * flicker);
            ctx.beginPath();
            ctx.moveTo(pos[i].x, pos[i].y);
            const mx = (pos[i].x + pos[j].x) * 0.5 + Math.sin(time * 0.55 + i) * 7;
            const my = (pos[i].y + pos[j].y) * 0.5 + Math.cos(time * 0.4 + j) * 5;
            ctx.quadraticCurveTo(mx, my, pos[j].x, pos[j].y);
            ctx.stroke();
          }
        }
      }

      // ═══ L3: NODE MARKS ═══
      for (let i = 0; i < NODE_COUNT; i++) {
        const breathe = 0.5 + Math.sin(time * 1.8 + i * 1.1) * 0.5;
        const sz = IS_MOBILE ? 2 : 1.6;
        let na = pAccent[3] * 2.5 * breathe;
        if (ptr.active) {
          const dx = pos[i].x - ptr.x, dy = pos[i].y - ptr.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < repR * 1.3) na = Math.min(na + (1 - d / (repR * 1.3)) * 0.25, 0.5);
        }
        ctx.strokeStyle = hsl(pAccent, na);
        ctx.lineWidth = 0.45;
        // Cross
        ctx.beginPath(); ctx.moveTo(pos[i].x - sz, pos[i].y); ctx.lineTo(pos[i].x + sz, pos[i].y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pos[i].x, pos[i].y - sz); ctx.lineTo(pos[i].x, pos[i].y + sz); ctx.stroke();
        // Every 5th node: small square frame
        if (i % 5 === 0) {
          const sq = sz * 2;
          ctx.strokeStyle = hsl(pAccent, na * 0.5);
          ctx.lineWidth = 0.3;
          ctx.strokeRect(pos[i].x - sq, pos[i].y - sq, sq * 2, sq * 2);
        }
      }

      // ═══ L4: DATA PACKETS ═══
      let pN = 0;
      const maxP = IS_MOBILE ? 16 : 40;
      for (let i = 0; i < NODE_COUNT && pN < maxP; i++) {
        for (let j = i + 1; j < NODE_COUNT && pN < maxP; j++) {
          const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST * 0.5 && (i * 7 + j) % 8 === 0) {
            const spd = 0.14 + (i % 5) * 0.04;
            const prog = ((time * spd + i * 0.3 + j * 0.11) % 1);
            const px = pos[i].x + (pos[j].x - pos[i].x) * prog;
            const py = pos[i].y + (pos[j].y - pos[i].y) * prog;
            const angle = Math.atan2(pos[j].y - pos[i].y, pos[j].x - pos[i].x);
            const fa = Math.sin(prog * Math.PI) * 0.4;
            const dl = IS_MOBILE ? 3 : 2.5;
            ctx.beginPath();
            ctx.moveTo(px - Math.cos(angle) * dl, py - Math.sin(angle) * dl);
            ctx.lineTo(px + Math.cos(angle) * dl, py + Math.sin(angle) * dl);
            ctx.strokeStyle = hsl(pTrace, fa);
            ctx.lineWidth = 0.8;
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
      style={{ opacity: 0.95, willChange: "transform", transform: "translateZ(0)" }}
    />
  );
};

export default EmpireDNABackground;
