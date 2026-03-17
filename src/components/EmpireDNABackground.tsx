import { useEffect, useRef, useState } from "react";

/**
 * Empire Background v13 — AI Circuit Morphing
 * Scroll-reactive: nodes morph between circuit topologies per section.
 * Orthogonal traces, square/cross nodes, data-flow particles.
 * Professional tech aesthetic — no spirals, no biology.
 */

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

const NODE_COUNT = IS_MOBILE ? 55 : 110;
const MAX_DIST = IS_MOBILE ? 120 : 160;
const FLOW_COUNT = IS_MOBILE ? 20 : 45;
const GRID_SPACING = IS_MOBILE ? 50 : 60;

type Pt = { x: number; y: number };

// ── Circuit topologies that morph on scroll ──
const topologies: Array<(n: number, w: number, h: number, t: number) => Pt[]> = [
  // 0: Uniform grid — classic circuit board
  (n, w, h, t) => {
    const cols = Math.ceil(Math.sqrt(n * (w / h)));
    const rows = Math.ceil(n / cols);
    return Array.from({ length: n }, (_, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const fx = (col + 0.5) / cols, fy = (row + 0.5) / rows;
      const drift = Math.sin(t * 0.08 + i * 0.4) * 3;
      return { x: w * (0.04 + fx * 0.92) + drift, y: h * (0.04 + fy * 0.92) + Math.cos(t * 0.06 + i * 0.3) * 2 };
    });
  },
  // 1: Horizontal bus lanes — data highway
  (n, w, h, t) => {
    const lanes = 6;
    const per = Math.ceil(n / lanes);
    return Array.from({ length: n }, (_, i) => {
      const lane = Math.floor(i / per);
      const li = i % per;
      const fx = li / Math.max(per - 1, 1);
      const baseY = 0.08 + lane * 0.15;
      const offset = Math.sin(fx * Math.PI * 2 + t * 0.12 + lane * 1.5) * 0.012;
      return { x: w * (0.02 + fx * 0.96), y: h * (baseY + offset) };
    });
  },
  // 2: Branching tree — hierarchical network
  (n, w, h, t) => Array.from({ length: n }, (_, i) => {
    const depth = Math.floor(Math.log2(i + 1));
    const maxDepth = Math.floor(Math.log2(n));
    const posInLevel = i - (Math.pow(2, depth) - 1);
    const levelSize = Math.pow(2, depth);
    const fx = (posInLevel + 0.5) / levelSize;
    const fy = (depth + 0.5) / (maxDepth + 1);
    const sway = Math.sin(t * 0.1 + depth * 0.8 + posInLevel * 0.5) * 8;
    return {
      x: w * (0.05 + fx * 0.9) + sway,
      y: h * (0.05 + fy * 0.9) + Math.cos(t * 0.07 + i * 0.2) * 4,
    };
  }),
  // 3: Converging diamond — central processor
  (n, w, h, t) => Array.from({ length: n }, (_, i) => {
    const f = i / n;
    const ring = Math.floor(f * 5);
    const ringF = (f * 5) - ring;
    const ringR = 0.08 + ring * 0.09;
    // Diamond shape (45° rotated square)
    const side = Math.floor(ringF * 4);
    const sideF = (ringF * 4) - side;
    const corners = [
      [0, -1], [1, 0], [0, 1], [-1, 0]
    ];
    const [ax, ay] = corners[side % 4];
    const [bx, by] = corners[(side + 1) % 4];
    const px = lerp(ax, bx, sideF) * ringR;
    const py = lerp(ay, by, sideF) * ringR;
    const breathe = 1 + Math.sin(t * 0.1 + ring * 0.8) * 0.06;
    return {
      x: w * (0.5 + px * breathe) + Math.sin(t * 0.05 + i * 0.3) * 3,
      y: h * (0.5 + py * breathe) + Math.cos(t * 0.04 + i * 0.2) * 3,
    };
  }),
  // 4: Vertical columns — server rack / data center
  (n, w, h, t) => {
    const cols = IS_MOBILE ? 5 : 8;
    const per = Math.ceil(n / cols);
    return Array.from({ length: n }, (_, i) => {
      const col = Math.floor(i / per);
      const li = i % per;
      const fy = li / Math.max(per - 1, 1);
      const baseX = 0.06 + col * (0.88 / (cols - 1));
      const offset = Math.sin(fy * Math.PI * 3 + t * 0.15 + col * 1.2) * 0.01;
      return { x: w * (baseX + offset), y: h * (0.03 + fy * 0.94) + Math.cos(t * 0.08 + i * 0.4) * 3 };
    });
  },
  // 5: Scattered clusters — microchip zones
  (n, w, h, t) => {
    const zones = [[0.2, 0.2], [0.8, 0.2], [0.5, 0.5], [0.2, 0.8], [0.8, 0.8]];
    const per = Math.ceil(n / zones.length);
    return Array.from({ length: n }, (_, i) => {
      const zi = Math.floor(i / per) % zones.length;
      const li = i % per;
      const [cx, cy] = zones[zi];
      const gridLocal = Math.ceil(Math.sqrt(per));
      const lx = (li % gridLocal) / gridLocal - 0.5;
      const ly = Math.floor(li / gridLocal) / gridLocal - 0.5;
      const spread = 0.14 + Math.sin(t * 0.12 + zi * 1.5) * 0.02;
      return {
        x: w * (cx + lx * spread) + Math.sin(t * 0.06 + i * 0.5) * 2,
        y: h * (cy + ly * spread) + Math.cos(t * 0.05 + i * 0.3) * 2,
      };
    });
  },
  // 6: Cross-hatch — intersecting orthogonal lines
  (n, w, h, t) => {
    const half = Math.floor(n / 2);
    return Array.from({ length: n }, (_, i) => {
      if (i < half) {
        // Horizontal set
        const row = Math.floor(i / Math.ceil(Math.sqrt(half)));
        const col = i % Math.ceil(Math.sqrt(half));
        const totalRows = Math.ceil(half / Math.ceil(Math.sqrt(half)));
        const totalCols = Math.ceil(Math.sqrt(half));
        return {
          x: w * (0.05 + (col / Math.max(totalCols - 1, 1)) * 0.9) + Math.sin(t * 0.07 + i) * 3,
          y: h * (0.1 + (row / Math.max(totalRows - 1, 1)) * 0.8) + Math.cos(t * 0.09 + i * 0.4) * 3,
        };
      } else {
        // Diagonal offset set
        const j = i - half;
        const f = j / Math.max(half - 1, 1);
        const row = Math.floor(f * 6);
        const col = j % Math.ceil(Math.sqrt(half));
        const totalCols = Math.ceil(Math.sqrt(half));
        return {
          x: w * (0.08 + (col / Math.max(totalCols - 1, 1)) * 0.84) + Math.sin(t * 0.06 + j * 0.6) * 4,
          y: h * (0.12 + (row / 5) * 0.76) + Math.cos(t * 0.08 + j * 0.3) * 4,
        };
      }
    });
  },
];

const SECTIONS = topologies.length;

// Desaturated blue-grey palette per section
const PALETTES = [
  { node: [215, 10, 48], line: [215, 8, 42], glow: [215, 14, 54] },
  { node: [200, 12, 46], line: [200, 8, 40], glow: [200, 16, 52] },
  { node: [225, 10, 47], line: [225, 7, 41], glow: [225, 15, 53] },
  { node: [190, 12, 46], line: [190, 8, 40], glow: [190, 16, 52] },
  { node: [210, 10, 48], line: [210, 7, 42], glow: [210, 14, 54] },
  { node: [220, 12, 47], line: [220, 8, 41], glow: [220, 16, 53] },
  { node: [205, 10, 48], line: [205, 7, 42], glow: [205, 14, 54] },
];

interface FlowParticle {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  life: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpC = (a: number[], b: number[], t: number): number[] =>
  a.map((v, i) => lerp(v, b[i], t));
const hsla = (c: number[], a: number) => `hsla(${c[0]},${c[1]}%,${c[2]}%,${a})`;

const EmpireDNABackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const scrollRef = useRef(0);
  const [ready, setReady] = useState(false);
  const posRef = useRef<Pt[]>([]);
  const velRef = useRef<Pt[]>([]);
  const timeRef = useRef(0);
  const flowsRef = useRef<FlowParticle[]>([]);
  const ptrRef = useRef<{ x: number; y: number; active: boolean }>({ x: -999, y: -999, active: false });

  useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const fn = () => { scrollRef.current = window.scrollY || document.documentElement.scrollTop || 0; };
    window.addEventListener("scroll", fn, { passive: true });
    const mainEl = document.querySelector("main");
    if (mainEl) mainEl.addEventListener("scroll", () => { scrollRef.current = mainEl.scrollTop; }, { passive: true });
    fn();
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

    if (!posRef.current.length) {
      posRef.current = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * (w || 1000),
        y: Math.random() * (h || 800),
      }));
      velRef.current = Array.from({ length: NODE_COUNT }, () => ({ x: 0, y: 0 }));
    }

    const spawnFlow = (): FlowParticle => ({
      fromIdx: Math.floor(Math.random() * NODE_COUNT),
      toIdx: Math.floor(Math.random() * NODE_COUNT),
      progress: 0,
      speed: 0.006 + Math.random() * 0.012,
      life: 0,
    });

    if (!flowsRef.current.length) {
      flowsRef.current = Array.from({ length: FLOW_COUNT }, spawnFlow);
    }

    // Route styles — each returns 4 waypoints (start, mid1, mid2, end)
    const getRoutePoints = (a: Pt, b: Pt, routeMode: number, _i: number, _j: number): Pt[] => {
      const mx = (a.x + b.x) * 0.5, my = (a.y + b.y) * 0.5;
      switch (routeMode) {
        case 0: // L-shape: horizontal then vertical
          return [a, { x: b.x, y: a.y }, { x: b.x, y: a.y }, b];
        case 1: // Straight horizontal bus
          return [a, { x: mx, y: a.y }, { x: mx, y: b.y }, b];
        case 2: // Step-down: go right, step down, go right
          return [a, { x: mx, y: a.y }, { x: mx, y: b.y }, b];
        case 3: // Diagonal direct
          return [a, { x: lerp(a.x, b.x, 0.33), y: lerp(a.y, b.y, 0.33) },
                     { x: lerp(a.x, b.x, 0.66), y: lerp(a.y, b.y, 0.66) }, b];
        case 4: // Vertical-first L: go down then across
          return [a, { x: a.x, y: b.y }, { x: a.x, y: b.y }, b];
        case 5: // Z-route: horizontal, diagonal, horizontal
          return [a, { x: lerp(a.x, b.x, 0.3), y: a.y },
                     { x: lerp(a.x, b.x, 0.7), y: b.y }, b];
        case 6: // Straight line
        default:
          return [a, { x: lerp(a.x, b.x, 0.33), y: lerp(a.y, b.y, 0.33) },
                     { x: lerp(a.x, b.x, 0.66), y: lerp(a.y, b.y, 0.66) }, b];
      }
    };

    const animate = () => {
      if (!w || !h) { animRef.current = requestAnimationFrame(animate); return; }
      timeRef.current += 0.016;
      const time = timeRef.current;
      ctx.clearRect(0, 0, w, h);

      // Live scroll read
      scrollRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

      // Scroll-based section blending
      const pageH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - h;
      const scrollN = pageH > 0 ? Math.max(0, Math.min(scrollRef.current / pageH, 1)) : 0;
      const sF = scrollN * (SECTIONS - 1);
      const sIdx = Math.min(Math.floor(sF), SECTIONS - 2);
      const blend = sF - sIdx;
      const t3 = blend * blend * (3 - 2 * blend); // smoothstep

      const pNode = lerpC(PALETTES[sIdx].node, PALETTES[sIdx + 1].node, t3);
      const pLine = lerpC(PALETTES[sIdx].line, PALETTES[sIdx + 1].line, t3);
      const pGlow = lerpC(PALETTES[sIdx].glow, PALETTES[sIdx + 1].glow, t3);

      // Morph between topologies
      const shA = sIdx % topologies.length, shB = (sIdx + 1) % topologies.length;
      const tA = topologies[shA](NODE_COUNT, w, h, time);
      const tB = topologies[shB](NODE_COUNT, w, h, time);
      const targets = tA.map((a, i) => ({ x: lerp(a.x, tB[i].x, t3), y: lerp(a.y, tB[i].y, t3) }));

      const pos = posRef.current;
      const vel = velRef.current;
      const ptr = ptrRef.current;
      const repR = IS_MOBILE ? 80 : 120;

      // Spring physics + pointer repulsion
      for (let i = 0; i < NODE_COUNT; i++) {
        if (!pos[i]) { pos[i] = { ...targets[i] }; vel[i] = { x: 0, y: 0 }; }
        let tx = targets[i].x, ty = targets[i].y;
        if (ptr.active) {
          const dx = pos[i].x - ptr.x, dy = pos[i].y - ptr.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < repR && d > 1) {
            const f = (1 - d / repR) * 30;
            tx = pos[i].x + (dx / d) * f;
            ty = pos[i].y + (dy / d) * f;
          }
        }
        const springK = 0.07;
        const damping = 0.8;
        vel[i].x = vel[i].x * damping + (tx - pos[i].x) * springK;
        vel[i].y = vel[i].y * damping + (ty - pos[i].y) * springK;
        pos[i].x += vel[i].x;
        pos[i].y += vel[i].y;
      }

      // ═══ L0: SUBTLE DOT GRID ═══
      ctx.fillStyle = hsla(pLine, 0.03);
      for (let gx = GRID_SPACING * 0.5; gx < w; gx += GRID_SPACING) {
        for (let gy = GRID_SPACING * 0.5; gy < h; gy += GRID_SPACING) {
          ctx.fillRect(gx - 0.5, gy - 0.5, 1, 1);
        }
      }

      // ═══ L1: CIRCUIT CONNECTIONS — routing style morphs per topology ═══
      // Routing modes: 0=L-shape, 1=straight horizontal bus, 2=step-down, 
      // 3=diagonal, 4=vertical-first-L, 5=Z-route, 6=straight
      const routeA = sIdx % SECTIONS;
      const routeB = (sIdx + 1) % SECTIONS;

      ctx.lineCap = "square";
      ctx.lineJoin = "miter";
      for (let i = 0; i < NODE_COUNT; i++) {
        const maxJ = Math.min(i + (IS_MOBILE ? 5 : 8), NODE_COUNT);
        for (let j = i + 1; j < maxJ; j++) {
          const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const alpha = Math.pow(1 - d / MAX_DIST, 1.8);
            const pulse = 0.5 + Math.sin(time * 1.0 + i * 0.3 + j * 0.2) * 0.5;
            ctx.strokeStyle = hsla(pLine, alpha * 0.07 * pulse);
            ctx.lineWidth = 0.5 + alpha * 0.5;

            // Compute waypoints for route A and route B, then lerp
            const wA = getRoutePoints(pos[i], pos[j], routeA, i, j);
            const wB = getRoutePoints(pos[i], pos[j], routeB, i, j);
            // Both arrays have same length (padded to 4 points)
            const waypoints = wA.map((a, wi) => ({
              x: lerp(a.x, wB[wi].x, t3),
              y: lerp(a.y, wB[wi].y, t3),
            }));

            ctx.beginPath();
            ctx.moveTo(waypoints[0].x, waypoints[0].y);
            for (let wi = 1; wi < waypoints.length; wi++) {
              ctx.lineTo(waypoints[wi].x, waypoints[wi].y);
            }
            ctx.stroke();
          }
        }
      }

      // ═══ L2: NODES — crosses (+) and squares ═══
      for (let i = 0; i < NODE_COUNT; i++) {
        const breathe = 0.4 + Math.sin(time * 1.0 + i * 0.7) * 0.6;
        let na = 0.1 * breathe;

        if (ptr.active) {
          const dx = pos[i].x - ptr.x, dy = pos[i].y - ptr.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < repR * 1.5) na += (1 - d / (repR * 1.5)) * 0.3;
        }

        if (i % 3 === 0) {
          // Cross (+)
          const arm = 2.5 + breathe * 1.5;
          ctx.strokeStyle = hsla(pNode, na + 0.14);
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(pos[i].x - arm, pos[i].y);
          ctx.lineTo(pos[i].x + arm, pos[i].y);
          ctx.moveTo(pos[i].x, pos[i].y - arm);
          ctx.lineTo(pos[i].x, pos[i].y + arm);
          ctx.stroke();
        } else {
          // Square
          const s = 1.2 + breathe * 0.8;
          ctx.fillStyle = hsla(pNode, na + 0.14);
          ctx.fillRect(pos[i].x - s / 2, pos[i].y - s / 2, s, s);
        }

        // Glow halo for key nodes
        if (i % 5 === 0) {
          const gr = ctx.createRadialGradient(pos[i].x, pos[i].y, 0, pos[i].x, pos[i].y, 18);
          gr.addColorStop(0, hsla(pGlow, na * 0.5));
          gr.addColorStop(1, hsla(pGlow, 0));
          ctx.fillStyle = gr;
          ctx.fillRect(pos[i].x - 18, pos[i].y - 18, 36, 36);
        }
      }

      // ═══ L3: DATA FLOW PARTICLES along connections ═══
      const flows = flowsRef.current;
      for (let fi = 0; fi < flows.length; fi++) {
        const fl = flows[fi];
        fl.progress += fl.speed;
        fl.life++;
        if (fl.progress > 1 || fl.life > 250) { flows[fi] = spawnFlow(); continue; }

        const a = pos[fl.fromIdx], b = pos[fl.toIdx];
        if (!a || !b) continue;
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > MAX_DIST * 1.5) { flows[fi] = spawnFlow(); continue; }

        // L-shaped path for particles too
        const t2 = fl.progress;
        let px: number, py: number;
        const useLRoute = Math.abs(dx) > Math.abs(dy) * 0.3 && Math.abs(dy) > Math.abs(dx) * 0.3;
        if (useLRoute) {
          const midX = b.x, midY = a.y;
          if (t2 < 0.5) {
            const lt = t2 * 2;
            px = lerp(a.x, midX, lt);
            py = lerp(a.y, midY, lt);
          } else {
            const lt = (t2 - 0.5) * 2;
            px = lerp(midX, b.x, lt);
            py = lerp(midY, b.y, lt);
          }
        } else {
          px = lerp(a.x, b.x, t2);
          py = lerp(a.y, b.y, t2);
        }

        const fadeAlpha = Math.sin(fl.progress * Math.PI) * 0.5;

        // Glow
        const tg = ctx.createRadialGradient(px, py, 0, px, py, 7);
        tg.addColorStop(0, hsla(pGlow, fadeAlpha * 0.55));
        tg.addColorStop(1, hsla(pGlow, 0));
        ctx.fillStyle = tg;
        ctx.fillRect(px - 7, py - 7, 14, 14);

        // Core (square particle)
        const ps = 1.2;
        ctx.fillStyle = hsla(pGlow, fadeAlpha + 0.12);
        ctx.fillRect(px - ps / 2, py - ps / 2, ps, ps);
      }

      // ═══ L4: HORIZONTAL SCAN LINE ═══
      const scanY = h * (0.5 + Math.sin(time * 0.06) * 0.48);
      const scanGrad = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
      scanGrad.addColorStop(0, hsla(pGlow, 0));
      scanGrad.addColorStop(0.5, hsla(pGlow, 0.02));
      scanGrad.addColorStop(1, hsla(pGlow, 0));
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 50, w, 100);

      // ═══ L5: VERTICAL DATA STREAMS ═══
      const streamCount = IS_MOBILE ? 3 : 6;
      for (let si = 0; si < streamCount; si++) {
        const sx = w * (0.12 + (si / streamCount) * 0.76) + Math.sin(si * 2.7) * 20;
        const streamPhase = (time * 0.12 + si * 1.1) % 1;
        const streamLen = h * 0.12;
        const sy = streamPhase * (h + streamLen) - streamLen;
        const streamGrad = ctx.createLinearGradient(sx, sy, sx, sy + streamLen);
        streamGrad.addColorStop(0, hsla(pGlow, 0));
        streamGrad.addColorStop(0.5, hsla(pGlow, 0.035));
        streamGrad.addColorStop(1, hsla(pGlow, 0));
        ctx.strokeStyle = streamGrad;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx, sy + streamLen);
        ctx.stroke();
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
