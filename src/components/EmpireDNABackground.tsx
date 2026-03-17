import { useEffect, useRef, useState } from "react";

/**
 * Empire DNA Background v7 — Pure data-flow lines.
 * No circles, no radial effects. Only flowing lines, data streams,
 * circuit traces and neural connections that communicate.
 */

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

const NODE_COUNT = IS_MOBILE ? 50 : 90;
const MAX_DIST = IS_MOBILE ? 130 : 165;
const STREAM_COUNT = IS_MOBILE ? 12 : 28;
const CIRCUIT_TRACES = IS_MOBILE ? 8 : 18;

/* ---------- palettes per section ---------- */
const PALETTES = [
  { line: [220,16,48,0.07], trace: [210,35,52,0.12], stream: [200,55,60,0.35], accent: [220,25,55,0.10] },
  { line: [185,14,44,0.06], trace: [180,30,48,0.10], stream: [175,50,58,0.32], accent: [185,22,50,0.09] },
  { line: [260,14,42,0.06], trace: [265,28,46,0.09], stream: [270,48,58,0.30], accent: [255,20,48,0.08] },
  { line: [195,18,46,0.07], trace: [195,33,50,0.11], stream: [190,55,62,0.34], accent: [195,25,52,0.09] },
  { line: [240,12,40,0.06], trace: [240,26,46,0.09], stream: [235,45,56,0.28], accent: [240,20,46,0.08] },
  { line: [170,15,44,0.06], trace: [170,28,48,0.10], stream: [165,50,60,0.32], accent: [170,22,50,0.09] },
  { line: [210,16,46,0.07], trace: [210,32,50,0.11], stream: [205,52,62,0.34], accent: [210,24,52,0.09] },
];
const SECTIONS = PALETTES.length;

type Pt = { x: number; y: number };

/* Grid-based topology generators — all produce interconnectable points */
const topologies: Array<(n: number, w: number, h: number, t: number) => Pt[]> = [
  // 0: Staggered grid
  (n, w, h, t) => {
    const cols = Math.ceil(Math.sqrt(n * (w / h)));
    const rows = Math.ceil(n / cols);
    const px = w * 0.06, py = h * 0.06;
    return Array.from({ length: n }, (_, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const j = Math.sin(t * 0.25 + i * 0.4) * 3;
      return {
        x: px + (col / Math.max(cols - 1, 1)) * (w - px * 2) + (row % 2 ? (w - px * 2) / cols * 0.5 : 0) + j,
        y: py + (row / Math.max(rows - 1, 1)) * (h - py * 2) + j * 0.6,
      };
    });
  },
  // 1: Flowing wave rows
  (n, w, h, t) => {
    const rows = 5;
    const perRow = Math.ceil(n / rows);
    return Array.from({ length: n }, (_, i) => {
      const row = Math.floor(i / perRow), col = i % perRow;
      const f = col / (perRow - 1);
      return {
        x: w * 0.02 + f * w * 0.96,
        y: h * (0.1 + row * 0.18) + Math.sin(f * Math.PI * 3.5 + t * 0.4 + row * 1.1) * h * 0.06,
      };
    });
  },
  // 2: Neural clusters
  (n, w, h, t) => {
    const clusters = 6;
    const perCluster = Math.ceil(n / clusters);
    return Array.from({ length: n }, (_, i) => {
      const ci = Math.floor(i / perCluster);
      const li = i % perCluster;
      const cx = w * (0.12 + (ci % 3) * 0.38);
      const cy = h * (0.18 + Math.floor(ci / 3) * 0.52);
      const angle = li * 2.4 + t * 0.05 + ci * 1.2;
      const r = Math.sqrt(li / perCluster) * Math.min(w, h) * 0.12;
      return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
    });
  },
  // 3: Fibonacci scatter
  (n, w, h, t) => {
    return Array.from({ length: n }, (_, i) => {
      const seed = i * 137.508;
      const angle = seed + t * 0.06;
      const r = 0.1 + (i / n) * 0.4;
      return {
        x: w * 0.5 + Math.cos(angle) * r * w + Math.sin(seed * 2.1 + t * 0.04) * w * 0.08,
        y: h * 0.5 + Math.sin(angle) * r * h + Math.cos(seed * 1.7 + t * 0.03) * h * 0.06,
      };
    });
  },
  // 4: Hexagonal lattice
  (n, w, h, t) => {
    const cols = Math.ceil(Math.sqrt(n * 1.15)), rows = Math.ceil(n / cols);
    const sx = (w * 0.88) / cols, sy = (h * 0.86) / rows;
    return Array.from({ length: n }, (_, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const b = Math.sin(t * 0.18 + row * 0.35 + col * 0.25) * 4;
      return {
        x: w * 0.06 + col * sx + (row % 2 ? sx * 0.5 : 0) + b,
        y: h * 0.07 + row * sy + b * 0.5,
      };
    });
  },
  // 5: Diagonal data lanes
  (n, w, h, t) => {
    const lanes = 6;
    const perLane = Math.ceil(n / lanes);
    return Array.from({ length: n }, (_, i) => {
      const lane = Math.floor(i / perLane);
      const li = i % perLane;
      const f = li / (perLane - 1);
      const baseX = w * (-0.1 + f * 1.2);
      const baseY = h * (0.05 + lane * 0.16) + f * h * 0.15;
      const drift = Math.sin(f * Math.PI * 2 + t * 0.3 + lane) * h * 0.03;
      return { x: baseX, y: baseY + drift };
    });
  },
  // 6: Converging streams
  (n, w, h, t) => {
    const streams = 4;
    const perStream = Math.ceil(n / streams);
    return Array.from({ length: n }, (_, i) => {
      const si = Math.floor(i / perStream);
      const li = i % perStream;
      const f = li / (perStream - 1);
      const startX = si < 2 ? w * 0.02 : w * 0.98;
      const startY = si % 2 === 0 ? h * 0.05 : h * 0.95;
      const endX = w * 0.5 + Math.sin(t * 0.1 + si) * w * 0.15;
      const endY = h * 0.5 + Math.cos(t * 0.08 + si) * h * 0.1;
      const bend = Math.sin(f * Math.PI + t * 0.2 + si * 1.5) * Math.min(w, h) * 0.06;
      return {
        x: startX + (endX - startX) * f + bend * (si < 2 ? 1 : -1),
        y: startY + (endY - startY) * f + bend * 0.5,
      };
    });
  },
];

/* Circuit trace — orthogonal data path */
interface CircuitTrace {
  segments: Pt[]; progress: number; speed: number; life: number; maxLife: number;
}

function spawnTrace(w: number, h: number): CircuitTrace {
  const segs: Pt[] = [];
  let x = Math.random() * w, y = Math.random() * h;
  segs.push({ x, y });
  const steps = 4 + Math.floor(Math.random() * 6);
  for (let s = 0; s < steps; s++) {
    const horiz = Math.random() > 0.5;
    const dist = 50 + Math.random() * 160;
    if (horiz) x += (Math.random() > 0.5 ? 1 : -1) * dist;
    else y += (Math.random() > 0.5 ? 1 : -1) * dist;
    x = Math.max(5, Math.min(w - 5, x));
    y = Math.max(5, Math.min(h - 5, y));
    segs.push({ x, y });
  }
  return { segments: segs, progress: 0, speed: 0.002 + Math.random() * 0.005, life: 0, maxLife: 250 + Math.random() * 400 };
}

/* Data stream — flowing particles along a path */
interface DataStream {
  points: Pt[]; speed: number; offset: number; width: number;
}

function spawnStream(w: number, h: number): DataStream {
  const pts: Pt[] = [];
  const horizontal = Math.random() > 0.4;
  const numPts = 4 + Math.floor(Math.random() * 4);

  if (horizontal) {
    const baseY = h * (0.05 + Math.random() * 0.9);
    for (let i = 0; i < numPts; i++) {
      const f = i / (numPts - 1);
      pts.push({ x: f * w, y: baseY + (Math.random() - 0.5) * h * 0.15 });
    }
  } else {
    const baseX = w * (0.05 + Math.random() * 0.9);
    for (let i = 0; i < numPts; i++) {
      const f = i / (numPts - 1);
      pts.push({ x: baseX + (Math.random() - 0.5) * w * 0.12, y: f * h });
    }
  }

  return { points: pts, speed: 0.15 + Math.random() * 0.3, offset: Math.random() * 100, width: 0.3 + Math.random() * 0.4 };
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
  const tracesRef = useRef<CircuitTrace[]>([]);
  const streamsRef = useRef<DataStream[]>([]);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({ x: -999, y: -999, active: false });

  useEffect(() => { const t = setTimeout(() => setReady(true), 300); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

    if (streamsRef.current.length === 0 && w && h) {
      for (let i = 0; i < STREAM_COUNT; i++) streamsRef.current.push(spawnStream(w, h));
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
      const palTrace = lerpC(PALETTES[sIdx].trace, PALETTES[sIdx + 1].trace, t3);
      const palStream = lerpC(PALETTES[sIdx].stream, PALETTES[sIdx + 1].stream, t3);
      const palAccent = lerpC(PALETTES[sIdx].accent, PALETTES[sIdx + 1].accent, t3);

      // Shape morphing
      const shA = sIdx % topologies.length, shB = (sIdx + 1) % topologies.length;
      const tA = topologies[shA](NODE_COUNT, w, h, time);
      const tB = topologies[shB](NODE_COUNT, w, h, time);
      const targets = tA.map((a, i) => ({ x: lerp(a.x, tB[i].x, t3), y: lerp(a.y, tB[i].y, t3) }));

      const pos = posRef.current;
      const ptr = pointerRef.current;
      const repelR = IS_MOBILE ? 80 : 110;

      for (let i = 0; i < NODE_COUNT; i++) {
        if (!pos[i]) pos[i] = { ...targets[i] };
        let tx = targets[i].x, ty = targets[i].y;
        if (ptr.active) {
          const dx = tx - ptr.x, dy = ty - ptr.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < repelR && dist > 1) {
            const force = (1 - dist / repelR) * 30;
            tx += (dx / dist) * force;
            ty += (dy / dist) * force;
          }
        }
        pos[i].x += (tx - pos[i].x) * 0.04;
        pos[i].y += (ty - pos[i].y) * 0.04;
      }

      // ═══ LAYER 0: Data Streams — flowing dashed lines across the canvas ═══
      const streams = streamsRef.current;
      for (const stream of streams) {
        const pts = stream.points;
        const dashOffset = -(time * stream.speed * 60 + stream.offset);

        // Main stream line
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
          const prev = pts[i - 1];
          const cur = pts[i];
          const mx = (prev.x + cur.x) / 2, my = (prev.y + cur.y) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
        }
        ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
        ctx.strokeStyle = hsl(palStream, palStream[3] * 0.4);
        ctx.lineWidth = stream.width;
        ctx.setLineDash([2, 8]);
        ctx.lineDashOffset = dashOffset;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.lineDashOffset = 0;

        // Data packet traveling along stream
        const packetPos = ((time * stream.speed + stream.offset) % 3) / 3;
        if (packetPos >= 0 && packetPos <= 1 && pts.length >= 2) {
          const totalSegs = pts.length - 1;
          const segF = packetPos * totalSegs;
          const segIdx = Math.min(Math.floor(segF), totalSegs - 1);
          const segT = segF - segIdx;
          const px = pts[segIdx].x + (pts[segIdx + 1].x - pts[segIdx].x) * segT;
          const py = pts[segIdx].y + (pts[segIdx + 1].y - pts[segIdx].y) * segT;

          // Small dash burst at packet position
          const burstLen = 6;
          const angle = Math.atan2(
            pts[Math.min(segIdx + 1, pts.length - 1)].y - pts[segIdx].y,
            pts[Math.min(segIdx + 1, pts.length - 1)].x - pts[segIdx].x
          );
          ctx.beginPath();
          ctx.moveTo(px - Math.cos(angle) * burstLen, py - Math.sin(angle) * burstLen);
          ctx.lineTo(px + Math.cos(angle) * burstLen, py + Math.sin(angle) * burstLen);
          ctx.strokeStyle = hsl(palStream, palStream[3] * 2.2);
          ctx.lineWidth = stream.width * 2;
          ctx.stroke();
        }
      }

      // ═══ LAYER 1: Circuit Traces — orthogonal data paths ═══
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

        // Trace line
        ctx.beginPath();
        ctx.strokeStyle = hsl(palTrace, palTrace[3] * 2);
        ctx.lineWidth = 0.6;
        ctx.setLineDash([4, 6]);
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

        // Bright head — small horizontal line, not a circle
        let ha = 0;
        const hd = totalLen * tr.progress;
        for (let si = 1; si < segs.length; si++) {
          const sl = Math.hypot(segs[si].x - segs[si - 1].x, segs[si].y - segs[si - 1].y);
          if (ha + sl >= hd) {
            const f = (hd - ha) / sl;
            const hx = segs[si - 1].x + (segs[si].x - segs[si - 1].x) * f;
            const hy = segs[si - 1].y + (segs[si].y - segs[si - 1].y) * f;
            const dir = Math.atan2(segs[si].y - segs[si - 1].y, segs[si].x - segs[si - 1].x);
            const headLen = IS_MOBILE ? 4 : 6;
            ctx.beginPath();
            ctx.moveTo(hx - Math.cos(dir) * headLen, hy - Math.sin(dir) * headLen);
            ctx.lineTo(hx + Math.cos(dir) * headLen, hy + Math.sin(dir) * headLen);
            ctx.strokeStyle = hsl(palStream, 0.6);
            ctx.lineWidth = 1.5;
            ctx.stroke();
            break;
          }
          ha += sl;
        }
      }

      // ═══ LAYER 2: Neural connections — curved bezier lines ═══
      ctx.lineWidth = 0.3;
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST);
            const flicker = 0.6 + Math.sin(time * 2.5 + i * 0.6 + j * 0.3) * 0.4;
            ctx.strokeStyle = hsl(palLine, palLine[3] * alpha * 4.5 * flicker);
            ctx.beginPath();
            ctx.moveTo(pos[i].x, pos[i].y);
            const mx = (pos[i].x + pos[j].x) * 0.5 + Math.sin(time * 0.7 + i) * 8;
            const my = (pos[i].y + pos[j].y) * 0.5 + Math.cos(time * 0.5 + j) * 6;
            ctx.quadraticCurveTo(mx, my, pos[j].x, pos[j].y);
            ctx.stroke();
          }
        }
      }

      // ═══ LAYER 3: Node intersection marks — tiny crosses, not circles ═══
      for (let i = 0; i < NODE_COUNT; i++) {
        const breathe = 0.5 + Math.sin(time * 2 + i * 1.3) * 0.5;
        const sz = IS_MOBILE ? 2 : 1.8;

        // Pointer proximity highlight — brighter cross
        let nodeAlpha = palAccent[3] * 2.5 * breathe;
        if (ptr.active) {
          const dx = pos[i].x - ptr.x, dy = pos[i].y - ptr.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < repelR * 1.3) {
            nodeAlpha = Math.min(nodeAlpha + (1 - dist / (repelR * 1.3)) * 0.3, 0.6);
          }
        }

        ctx.strokeStyle = hsl(palAccent, nodeAlpha);
        ctx.lineWidth = 0.5;
        // Horizontal tick
        ctx.beginPath();
        ctx.moveTo(pos[i].x - sz, pos[i].y);
        ctx.lineTo(pos[i].x + sz, pos[i].y);
        ctx.stroke();
        // Vertical tick
        ctx.beginPath();
        ctx.moveTo(pos[i].x, pos[i].y - sz);
        ctx.lineTo(pos[i].x, pos[i].y + sz);
        ctx.stroke();
      }

      // ═══ LAYER 4: Data pulses — small dashes traveling between close nodes ═══
      let pulseN = 0;
      const maxPulses = IS_MOBILE ? 15 : 35;
      for (let i = 0; i < NODE_COUNT && pulseN < maxPulses; i++) {
        for (let j = i + 1; j < NODE_COUNT && pulseN < maxPulses; j++) {
          const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST * 0.5 && (i * 7 + j) % 9 === 0) {
            const speed = 0.15 + (i % 5) * 0.04;
            const prog = ((time * speed + i * 0.37 + j * 0.13) % 1);
            const px = pos[i].x + (pos[j].x - pos[i].x) * prog;
            const py = pos[i].y + (pos[j].y - pos[i].y) * prog;
            const angle = Math.atan2(pos[j].y - pos[i].y, pos[j].x - pos[i].x);
            const fadeAlpha = Math.sin(prog * Math.PI) * 0.55;
            const dashLen = IS_MOBILE ? 3 : 2.5;

            ctx.beginPath();
            ctx.moveTo(px - Math.cos(angle) * dashLen, py - Math.sin(angle) * dashLen);
            ctx.lineTo(px + Math.cos(angle) * dashLen, py + Math.sin(angle) * dashLen);
            ctx.strokeStyle = hsl(palStream, fadeAlpha);
            ctx.lineWidth = 0.8;
            ctx.stroke();
            pulseN++;
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
      style={{
        opacity: 0.85,
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    />
  );
};

export default EmpireDNABackground;
