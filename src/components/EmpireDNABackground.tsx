import { useEffect, useRef, useState } from "react";

/**
 * Empire Background v15 — Hyper-Dynamic AI Circuit System
 * Multi-layer: morphing topologies, pulsing traces, active data highways,
 * scan beams, circuit junction flashes, flowing energy, radar sweeps.
 */

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

const NODE_COUNT = IS_MOBILE ? 40 : 80;
const MAX_DIST = IS_MOBILE ? 110 : 150;
const FLOW_COUNT = IS_MOBILE ? 12 : 25;
const PULSE_COUNT = IS_MOBILE ? 3 : 6;
const HIGHWAY_COUNT = IS_MOBILE ? 2 : 4;

type Pt = { x: number; y: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpC = (a: number[], b: number[], t: number): number[] => a.map((v, i) => lerp(v, b[i], t));
const hsla = (c: number[], a: number) => `hsla(${c[0]},${c[1]}%,${c[2]}%,${a})`;
const ss = (t: number) => t * t * (3 - 2 * t);

// ── 7 Circuit topologies ──
const topologies: Array<(n: number, w: number, h: number, t: number) => Pt[]> = [
  // 0: Uniform grid
  (n, w, h, t) => {
    const cols = Math.ceil(Math.sqrt(n * (w / h))), rows = Math.ceil(n / cols);
    return Array.from({ length: n }, (_, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      return { x: w * (0.04 + (col + 0.5) / cols * 0.92) + Math.sin(t * 0.1 + i * 0.4) * 4, y: h * (0.04 + (row + 0.5) / rows * 0.92) + Math.cos(t * 0.08 + i * 0.3) * 3 };
    });
  },
  // 1: Horizontal bus lanes
  (n, w, h, t) => {
    const lanes = 7, per = Math.ceil(n / lanes);
    return Array.from({ length: n }, (_, i) => {
      const lane = Math.floor(i / per), li = i % per;
      const fx = li / Math.max(per - 1, 1);
      return { x: w * (0.02 + fx * 0.96), y: h * (0.06 + lane * 0.13 + Math.sin(fx * Math.PI * 3 + t * 0.15 + lane) * 0.015) };
    });
  },
  // 2: Branching tree
  (n, w, h, t) => Array.from({ length: n }, (_, i) => {
    const depth = Math.floor(Math.log2(i + 1)), maxD = Math.floor(Math.log2(n));
    const pos = i - (Math.pow(2, depth) - 1), lSize = Math.pow(2, depth);
    return { x: w * (0.05 + (pos + 0.5) / lSize * 0.9) + Math.sin(t * 0.12 + depth + pos * 0.5) * 8, y: h * (0.05 + (depth + 0.5) / (maxD + 1) * 0.9) + Math.cos(t * 0.09 + i * 0.2) * 5 };
  }),
  // 3: Diamond processor
  (n, w, h, t) => Array.from({ length: n }, (_, i) => {
    const f = i / n, ring = Math.floor(f * 6), rF = (f * 6) - ring, rR = 0.06 + ring * 0.075;
    const side = Math.floor(rF * 4), sF = (rF * 4) - side;
    const corners = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    const [ax, ay] = corners[side % 4], [bx, by] = corners[(side + 1) % 4];
    const breathe = 1 + Math.sin(t * 0.12 + ring) * 0.08;
    return { x: w * (0.5 + lerp(ax, bx, sF) * rR * breathe) + Math.sin(t * 0.06 + i) * 3, y: h * (0.5 + lerp(ay, by, sF) * rR * breathe) + Math.cos(t * 0.05 + i) * 3 };
  }),
  // 4: Vertical columns — server rack
  (n, w, h, t) => {
    const cols = IS_MOBILE ? 6 : 9, per = Math.ceil(n / cols);
    return Array.from({ length: n }, (_, i) => {
      const col = Math.floor(i / per), li = i % per, fy = li / Math.max(per - 1, 1);
      return { x: w * (0.05 + col * (0.9 / (cols - 1)) + Math.sin(fy * Math.PI * 4 + t * 0.18 + col) * 0.008), y: h * (0.03 + fy * 0.94) + Math.cos(t * 0.1 + i * 0.4) * 4 };
    });
  },
  // 5: Microchip clusters
  (n, w, h, t) => {
    const zones = [[0.18, 0.18], [0.82, 0.18], [0.5, 0.5], [0.18, 0.82], [0.82, 0.82], [0.5, 0.2], [0.5, 0.8]];
    const per = Math.ceil(n / zones.length);
    return Array.from({ length: n }, (_, i) => {
      const zi = Math.floor(i / per) % zones.length, li = i % per, [cx, cy] = zones[zi];
      const g = Math.ceil(Math.sqrt(per)), lx = (li % g) / g - 0.5, ly = Math.floor(li / g) / g - 0.5;
      const spread = 0.12 + Math.sin(t * 0.14 + zi * 1.5) * 0.025;
      return { x: w * (cx + lx * spread) + Math.sin(t * 0.08 + i * 0.5) * 3, y: h * (cy + ly * spread) + Math.cos(t * 0.07 + i * 0.3) * 3 };
    });
  },
  // 6: Cross-hatch matrix
  (n, w, h, t) => {
    const half = Math.floor(n / 2);
    return Array.from({ length: n }, (_, i) => {
      if (i < half) {
        const g = Math.ceil(Math.sqrt(half));
        const row = Math.floor(i / g), col = i % g;
        return { x: w * (0.05 + (col / Math.max(g - 1, 1)) * 0.9) + Math.sin(t * 0.09 + i) * 4, y: h * (0.1 + (row / Math.max(Math.ceil(half / g) - 1, 1)) * 0.8) + Math.cos(t * 0.11 + i * 0.4) * 4 };
      }
      const j = i - half, f = j / Math.max(half - 1, 1);
      const diag = Math.sin(f * Math.PI * 2 + t * 0.08) * 0.04;
      return { x: w * (0.08 + f * 0.84 + diag) + Math.sin(t * 0.07 + j * 0.6) * 5, y: h * (0.12 + f * 0.76 - diag) + Math.cos(t * 0.1 + j * 0.3) * 5 };
    });
  },
];
const SECTIONS = topologies.length;

// Vivid tech palettes per section (more saturated than before)
const PALETTES = [
  { node: [215, 18, 50], line: [215, 15, 44], glow: [215, 25, 58], accent: [180, 30, 52] },
  { node: [200, 20, 48], line: [200, 14, 42], glow: [200, 28, 56], accent: [160, 25, 50] },
  { node: [225, 18, 50], line: [225, 12, 44], glow: [225, 25, 58], accent: [265, 22, 55] },
  { node: [190, 20, 48], line: [190, 14, 42], glow: [190, 28, 56], accent: [38, 30, 50] },
  { node: [210, 18, 50], line: [210, 12, 44], glow: [210, 25, 58], accent: [180, 28, 52] },
  { node: [220, 20, 50], line: [220, 14, 44], glow: [220, 28, 58], accent: [265, 25, 55] },
  { node: [205, 18, 50], line: [205, 12, 44], glow: [205, 25, 58], accent: [38, 28, 52] },
];

interface FlowParticle { fromIdx: number; toIdx: number; progress: number; speed: number; life: number; }
interface PulseRing { x: number; y: number; r: number; maxR: number; alpha: number; color: number[]; }
interface Highway { y: number; speed: number; particles: { x: number; sp: number; len: number }[]; }

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
  const hwRef = useRef<Highway[]>([]);
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
      posRef.current = Array.from({ length: NODE_COUNT }, () => ({ x: Math.random() * (w || 1000), y: Math.random() * (h || 800) }));
      velRef.current = Array.from({ length: NODE_COUNT }, () => ({ x: 0, y: 0 }));
    }

    const spawnFlow = (): FlowParticle => ({ fromIdx: Math.floor(Math.random() * NODE_COUNT), toIdx: Math.floor(Math.random() * NODE_COUNT), progress: 0, speed: 0.002 + Math.random() * 0.006, life: 0 });
    if (!flowsRef.current.length) flowsRef.current = Array.from({ length: FLOW_COUNT }, spawnFlow);

    // Initialize pulse rings
    if (!pulsesRef.current.length) {
      pulsesRef.current = Array.from({ length: PULSE_COUNT }, () => ({
        x: Math.random() * (w || 1000), y: Math.random() * (h || 800),
        r: 0, maxR: 40 + Math.random() * 80, alpha: 0, color: PALETTES[0].glow,
      }));
    }

    // Initialize data highways
    if (!hwRef.current.length) {
      hwRef.current = Array.from({ length: HIGHWAY_COUNT }, (_, i) => ({
        y: (h || 800) * (0.1 + (i / HIGHWAY_COUNT) * 0.8),
        speed: 0.15 + Math.random() * 0.4,
        particles: Array.from({ length: IS_MOBILE ? 2 : 4 }, () => ({
          x: Math.random() * (w || 1000), sp: 0.3 + Math.random() * 0.8, len: 15 + Math.random() * 40,
        })),
      }));
    }

    // Route styles morphing
    const getRoute = (a: Pt, b: Pt, mode: number): Pt[] => {
      const mx = (a.x + b.x) * 0.5, my = (a.y + b.y) * 0.5;
      switch (mode) {
        case 0: return [a, { x: b.x, y: a.y }, b]; // L-shape
        case 1: return [a, { x: mx, y: a.y }, { x: mx, y: b.y }, b]; // step horizontal
        case 2: return [a, { x: a.x + (b.x - a.x) * 0.3, y: a.y }, { x: a.x + (b.x - a.x) * 0.7, y: b.y }, b]; // step-down
        case 3: return [a, b]; // diagonal
        case 4: return [a, { x: a.x, y: b.y }, b]; // vertical-first L
        case 5: return [a, { x: lerp(a.x, b.x, 0.3), y: a.y }, { x: lerp(a.x, b.x, 0.7), y: b.y }, b]; // Z-route
        default: return [a, { x: mx, y: my }, b]; // through midpoint
      }
    };

    // Walk a polyline at parameter t (0..1)
    const walkPolyline = (pts: Pt[], t: number): Pt => {
      if (pts.length < 2) return pts[0] || { x: 0, y: 0 };
      const segs = pts.length - 1;
      const seg = Math.min(Math.floor(t * segs), segs - 1);
      const lt = (t * segs) - seg;
      return { x: lerp(pts[seg].x, pts[seg + 1].x, lt), y: lerp(pts[seg].y, pts[seg + 1].y, lt) };
    };

    const animate = () => {
      if (!w || !h) { animRef.current = requestAnimationFrame(animate); return; }
      timeRef.current += 0.016;
      const time = timeRef.current;
      ctx.clearRect(0, 0, w, h);

      scrollRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const pageH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - h;
      const scrollN = pageH > 0 ? Math.max(0, Math.min(scrollRef.current / pageH, 1)) : 0;
      const sF = scrollN * (SECTIONS - 1);
      const sIdx = Math.min(Math.floor(sF), SECTIONS - 2);
      const blend = sF - sIdx;
      const t3 = ss(blend);

      const pNode = lerpC(PALETTES[sIdx].node, PALETTES[sIdx + 1].node, t3);
      const pLine = lerpC(PALETTES[sIdx].line, PALETTES[sIdx + 1].line, t3);
      const pGlow = lerpC(PALETTES[sIdx].glow, PALETTES[sIdx + 1].glow, t3);
      const pAccent = lerpC(PALETTES[sIdx].accent, PALETTES[sIdx + 1].accent, t3);

      // Morph topologies
      const shA = sIdx % SECTIONS, shB = (sIdx + 1) % SECTIONS;
      const tA = topologies[shA](NODE_COUNT, w, h, time);
      const tB = topologies[shB](NODE_COUNT, w, h, time);
      const targets = tA.map((a, i) => ({ x: lerp(a.x, tB[i].x, t3), y: lerp(a.y, tB[i].y, t3) }));

      const pos = posRef.current;
      const vel = velRef.current;
      const ptr = ptrRef.current;
      const repR = IS_MOBILE ? 80 : 120;

      // Spring physics + repulsion
      for (let i = 0; i < NODE_COUNT; i++) {
        if (!pos[i]) { pos[i] = { ...targets[i] }; vel[i] = { x: 0, y: 0 }; }
        let tx = targets[i].x, ty = targets[i].y;
        if (ptr.active) {
          const dx = pos[i].x - ptr.x, dy = pos[i].y - ptr.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < repR && d > 1) { const f = (1 - d / repR) * 35; tx = pos[i].x + (dx / d) * f; ty = pos[i].y + (dy / d) * f; }
        }
        vel[i].x = vel[i].x * 0.78 + (tx - pos[i].x) * 0.08;
        vel[i].y = vel[i].y * 0.78 + (ty - pos[i].y) * 0.08;
        pos[i].x += vel[i].x; pos[i].y += vel[i].y;
      }

      const routeA = sIdx % SECTIONS, routeB = (sIdx + 1) % SECTIONS;

      // ═══ L0: AMBIENT DOT MATRIX — breathing grid ═══
      const gridSp = IS_MOBILE ? 45 : 55;
      const gridPulse = 0.5 + Math.sin(time * 0.3) * 0.5;
      ctx.fillStyle = hsla(pLine, 0.02 + gridPulse * 0.015);
      for (let gx = gridSp * 0.5; gx < w; gx += gridSp) {
        for (let gy = gridSp * 0.5; gy < h; gy += gridSp) {
          const localPulse = Math.sin(gx * 0.01 + gy * 0.01 + time * 0.5) * 0.5 + 0.5;
          const s = 0.5 + localPulse * 0.8;
          ctx.globalAlpha = 0.4 + localPulse * 0.6;
          ctx.fillRect(gx - s / 2, gy - s / 2, s, s);
        }
      }
      ctx.globalAlpha = 1;

      // ═══ L1: DATA HIGHWAYS — horizontal energy streams ═══
      const hws = hwRef.current;
      for (const hw of hws) {
        const baseAlpha = 0.04 + Math.sin(time * 0.2 + hw.y * 0.01) * 0.02;
        // Highway baseline
        ctx.strokeStyle = hsla(pLine, baseAlpha);
        ctx.lineWidth = 0.3;
        ctx.setLineDash([6, 12]);
        ctx.beginPath(); ctx.moveTo(0, hw.y); ctx.lineTo(w, hw.y); ctx.stroke();
        ctx.setLineDash([]);

        // Fast particles on highway
        for (const p of hw.particles) {
          p.x = (p.x + p.sp * hw.speed) % (w + p.len * 2);
          const px = p.x - p.len;
          const grad = ctx.createLinearGradient(px, hw.y, px + p.len, hw.y);
          grad.addColorStop(0, hsla(pAccent, 0));
          grad.addColorStop(0.7, hsla(pAccent, 0.04));
          grad.addColorStop(1, hsla(pGlow, 0.06));
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.moveTo(px, hw.y); ctx.lineTo(px + p.len, hw.y); ctx.stroke();
        }
      }

      // ═══ L2: CIRCUIT CONNECTIONS — morphing route style ═══
      ctx.lineCap = "square"; ctx.lineJoin = "miter";
      for (let i = 0; i < NODE_COUNT; i++) {
        const maxJ = Math.min(i + (IS_MOBILE ? 5 : 7), NODE_COUNT);
        for (let j = i + 1; j < maxJ; j++) {
          const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const alpha = Math.pow(1 - d / MAX_DIST, 2);
            const pulse = 0.5 + Math.sin(time * 1.2 + i * 0.3 + j * 0.2) * 0.5;
            const activeTrace = (i + j + Math.floor(time * 0.5)) % 7 === 0;

            // Compute morphed route
            const rA = getRoute(pos[i], pos[j], routeA);
            const rB = getRoute(pos[i], pos[j], routeB);
            const maxLen = Math.max(rA.length, rB.length);
            // Pad shorter array
            while (rA.length < maxLen) rA.push(rA[rA.length - 1]);
            while (rB.length < maxLen) rB.push(rB[rB.length - 1]);
            const route = rA.map((a, wi) => ({ x: lerp(a.x, rB[wi].x, t3), y: lerp(a.y, rB[wi].y, t3) }));

            // Draw trace
            ctx.strokeStyle = hsla(activeTrace ? pAccent : pLine, alpha * (activeTrace ? 0.14 : 0.06) * pulse);
            ctx.lineWidth = activeTrace ? 1.0 : 0.5 + alpha * 0.4;
            ctx.beginPath();
            ctx.moveTo(route[0].x, route[0].y);
            for (let wi = 1; wi < route.length; wi++) ctx.lineTo(route[wi].x, route[wi].y);
            ctx.stroke();

            // Active traces get animated dashes
            if (activeTrace && alpha > 0.3) {
              ctx.setLineDash([4, 6]);
              ctx.lineDashOffset = -(time * 40);
              ctx.strokeStyle = hsla(pGlow, alpha * 0.12);
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(route[0].x, route[0].y);
              for (let wi = 1; wi < route.length; wi++) ctx.lineTo(route[wi].x, route[wi].y);
              ctx.stroke();
              ctx.setLineDash([]);
              ctx.lineDashOffset = 0;
            }
          }
        }
      }

      // ═══ L3: NODES — crosses, squares, with energy halos ═══
      for (let i = 0; i < NODE_COUNT; i++) {
        const breathe = 0.4 + Math.sin(time * 1.2 + i * 0.7) * 0.6;
        let na = 0.12 * breathe;
        const isJunction = i % 4 === 0;
        const isActive = (i + Math.floor(time * 0.3)) % 11 === 0;

        if (ptr.active) {
          const dx = pos[i].x - ptr.x, dy = pos[i].y - ptr.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < repR * 1.5) na += (1 - d / (repR * 1.5)) * 0.35;
        }

        if (isActive) na = Math.min(na + 0.3, 0.6);

        if (i % 3 === 0) {
          // Cross (+) node
          const arm = 2.5 + breathe * 2;
          ctx.strokeStyle = hsla(isActive ? pAccent : pNode, na + 0.15);
          ctx.lineWidth = isActive ? 1.0 : 0.7;
          ctx.beginPath();
          ctx.moveTo(pos[i].x - arm, pos[i].y); ctx.lineTo(pos[i].x + arm, pos[i].y);
          ctx.moveTo(pos[i].x, pos[i].y - arm); ctx.lineTo(pos[i].x, pos[i].y + arm);
          ctx.stroke();
        } else {
          // Square node
          const s = 1.5 + breathe;
          ctx.fillStyle = hsla(isActive ? pAccent : pNode, na + 0.15);
          ctx.fillRect(pos[i].x - s / 2, pos[i].y - s / 2, s, s);
        }

        // Glow halo for junction/active nodes
        if (isJunction || isActive) {
          const glowR = isActive ? 24 : 16;
          const gr = ctx.createRadialGradient(pos[i].x, pos[i].y, 0, pos[i].x, pos[i].y, glowR);
          gr.addColorStop(0, hsla(isActive ? pAccent : pGlow, na * 0.6));
          gr.addColorStop(0.5, hsla(pGlow, na * 0.15));
          gr.addColorStop(1, hsla(pGlow, 0));
          ctx.fillStyle = gr;
          ctx.beginPath(); ctx.arc(pos[i].x, pos[i].y, glowR, 0, Math.PI * 2); ctx.fill();
        }
      }

      // ═══ L4: DATA FLOW PARTICLES — follow morphed routes ═══
      const flows = flowsRef.current;
      for (let fi = 0; fi < flows.length; fi++) {
        const fl = flows[fi];
        fl.progress += fl.speed;
        fl.life++;
        if (fl.progress > 1 || fl.life > 220) { flows[fi] = spawnFlow(); continue; }

        const a = pos[fl.fromIdx], b = pos[fl.toIdx];
        if (!a || !b) continue;
        const dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d > MAX_DIST * 1.5 || d < 5) { flows[fi] = spawnFlow(); continue; }

        const rA = getRoute(a, b, routeA);
        const rB = getRoute(a, b, routeB);
        const maxLen = Math.max(rA.length, rB.length);
        while (rA.length < maxLen) rA.push(rA[rA.length - 1]);
        while (rB.length < maxLen) rB.push(rB[rB.length - 1]);
        const route = rA.map((pa, wi) => ({ x: lerp(pa.x, rB[wi].x, t3), y: lerp(pa.y, rB[wi].y, t3) }));

        const pt = walkPolyline(route, fl.progress);
        const fadeA = Math.sin(fl.progress * Math.PI);

        // Trail (3 ghost positions)
        for (let ti = 1; ti <= 3; ti++) {
          const trailT = Math.max(0, fl.progress - ti * 0.04);
          const tp = walkPolyline(route, trailT);
          const ta = fadeA * (1 - ti * 0.3) * 0.15;
          ctx.fillStyle = hsla(pGlow, ta);
          ctx.fillRect(tp.x - 1, tp.y - 1, 2, 2);
        }

        // Main particle glow
        const tg = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 8);
        tg.addColorStop(0, hsla(pAccent, fadeA * 0.5));
        tg.addColorStop(0.5, hsla(pGlow, fadeA * 0.15));
        tg.addColorStop(1, hsla(pGlow, 0));
        ctx.fillStyle = tg;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2); ctx.fill();

        // Core dot
        ctx.fillStyle = hsla(pAccent, fadeA * 0.7 + 0.15);
        ctx.fillRect(pt.x - 1, pt.y - 1, 2, 2);
      }

      // ═══ L5: PULSE RINGS — junction flashes ═══
      const pulses = pulsesRef.current;
      for (let pi = 0; pi < pulses.length; pi++) {
        const p = pulses[pi];
        p.r += 0.6 + Math.sin(time + pi) * 0.2;
        p.alpha = (1 - p.r / p.maxR) * 0.08;
        if (p.r >= p.maxR) {
          // Respawn at a random node
          const ni = Math.floor(Math.random() * NODE_COUNT);
          const node = pos[ni];
          if (node) {
            p.x = node.x; p.y = node.y;
            p.r = 0; p.maxR = 35 + Math.random() * 70;
            p.color = (pi % 2 === 0) ? pGlow : pAccent;
          }
        }
        if (p.alpha > 0.005) {
          ctx.strokeStyle = hsla(p.color, p.alpha);
          ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke();
        }
      }

      // ═══ L6: RADAR SWEEP — rotating scanner ═══
      const radarAngle = time * 0.25;
      const radarR = Math.min(w, h) * 0.5;
      const rGrad = ctx.createConicGradient(radarAngle, w * 0.5, h * 0.5);
      rGrad.addColorStop(0, hsla(pGlow, 0));
      rGrad.addColorStop(0.02, hsla(pGlow, 0.03));
      rGrad.addColorStop(0.08, hsla(pGlow, 0));
      rGrad.addColorStop(1, hsla(pGlow, 0));
      ctx.beginPath(); ctx.moveTo(w * 0.5, h * 0.5);
      ctx.arc(w * 0.5, h * 0.5, radarR, radarAngle, radarAngle + Math.PI * 0.18); ctx.closePath();
      ctx.fillStyle = rGrad; ctx.fill();

      // ═══ L7: HORIZONTAL SCAN LINE ═══
      const scanY = h * (0.5 + Math.sin(time * 0.08) * 0.48);
      const scanGrad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      scanGrad.addColorStop(0, hsla(pAccent, 0));
      scanGrad.addColorStop(0.5, hsla(pAccent, 0.025));
      scanGrad.addColorStop(1, hsla(pAccent, 0));
      ctx.fillStyle = scanGrad; ctx.fillRect(0, scanY - 40, w, 80);
      // Scan line core
      ctx.strokeStyle = hsla(pGlow, 0.04);
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(w, scanY); ctx.stroke();

      // ═══ L8: VERTICAL DATA STREAMS ═══
      const streamCount = IS_MOBILE ? 4 : 8;
      for (let si = 0; si < streamCount; si++) {
        const sx = w * (0.1 + (si / streamCount) * 0.8) + Math.sin(si * 2.7 + time * 0.1) * 15;
        const streamPhase = (time * (0.08 + si * 0.01) + si * 1.1) % 1;
        const streamLen = h * 0.15;
        const sy = streamPhase * (h + streamLen * 2) - streamLen;
        const sGrad = ctx.createLinearGradient(sx, sy, sx, sy + streamLen);
        sGrad.addColorStop(0, hsla(pGlow, 0));
        sGrad.addColorStop(0.5, hsla(pGlow, 0.04));
        sGrad.addColorStop(1, hsla(pGlow, 0));
        ctx.strokeStyle = sGrad; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx, sy + streamLen); ctx.stroke();
        // Stream head
        const shg = ctx.createRadialGradient(sx, sy + streamLen, 0, sx, sy + streamLen, 4);
        shg.addColorStop(0, hsla(pAccent, 0.12)); shg.addColorStop(1, hsla(pAccent, 0));
        ctx.fillStyle = shg; ctx.beginPath(); ctx.arc(sx, sy + streamLen, 4, 0, Math.PI * 2); ctx.fill();
      }

      // ═══ L9: CORNER CIRCUIT BRACKETS — tech frame ═══
      const brk = 30;
      ctx.strokeStyle = hsla(pLine, 0.04 + Math.sin(time * 0.3) * 0.015);
      ctx.lineWidth = 0.6;
      // Top-left
      ctx.beginPath(); ctx.moveTo(8, 8 + brk); ctx.lineTo(8, 8); ctx.lineTo(8 + brk, 8); ctx.stroke();
      // Top-right
      ctx.beginPath(); ctx.moveTo(w - 8 - brk, 8); ctx.lineTo(w - 8, 8); ctx.lineTo(w - 8, 8 + brk); ctx.stroke();
      // Bottom-left
      ctx.beginPath(); ctx.moveTo(8, h - 8 - brk); ctx.lineTo(8, h - 8); ctx.lineTo(8 + brk, h - 8); ctx.stroke();
      // Bottom-right
      ctx.beginPath(); ctx.moveTo(w - 8 - brk, h - 8); ctx.lineTo(w - 8, h - 8); ctx.lineTo(w - 8, h - 8 - brk); ctx.stroke();

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [ready]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: 0.35, willChange: "transform", transform: "translateZ(0)" }}
    />
  );
};

export default EmpireDNABackground;
