import { useEffect, useRef, useState } from "react";

/**
 * Empire Background v16 — Sector Circuit Network
 * Nodes represent industry sectors communicating via data flows.
 * Topology morphs on scroll: grid → hub → clusters → mesh.
 * Uniform intensity across all layers. Mobile-optimized at 24fps.
 */

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

const NODE_COUNT = IS_MOBILE ? 14 : 55;
const MAX_DIST = IS_MOBILE ? 90 : 145;
const FLOW_COUNT = IS_MOBILE ? 2 : 18;
const PULSE_COUNT = IS_MOBILE ? 1 : 3;
const HUB_COUNT = IS_MOBILE ? 3 : 7;
const TARGET_FPS = IS_MOBILE ? 20 : 60;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

type Pt = { x: number; y: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpC = (a: number[], b: number[], t: number): number[] => a.map((v, i) => lerp(v, b[i], t));
const hsla = (c: number[], a: number) => `hsla(${c[0]},${c[1]}%,${c[2]}%,${a})`;
const ss = (t: number) => t * t * (3 - 2 * t);

// ── Sector hub positions (normalized 0-1) ──
const SECTOR_HUBS = [
  { label: "Food", cx: 0.15, cy: 0.2 },
  { label: "Beauty", cx: 0.5, cy: 0.12 },
  { label: "Health", cx: 0.85, cy: 0.2 },
  { label: "Hotel", cx: 0.22, cy: 0.55 },
  { label: "NCC", cx: 0.78, cy: 0.55 },
  { label: "Retail", cx: 0.35, cy: 0.85 },
  { label: "Fitness", cx: 0.65, cy: 0.85 },
];

// ── 5 Scroll-driven topologies (sector communication patterns) ──
const topologies: Array<(n: number, w: number, h: number, t: number) => Pt[]> = [
  // 0: Scattered grid — independent sectors
  (n, w, h, t) => {
    const cols = Math.ceil(Math.sqrt(n * (w / h))), rows = Math.ceil(n / cols);
    return Array.from({ length: n }, (_, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      return {
        x: w * (0.06 + (col + 0.5) / cols * 0.88) + Math.sin(t * 0.08 + i * 0.5) * 3,
        y: h * (0.06 + (row + 0.5) / rows * 0.88) + Math.cos(t * 0.06 + i * 0.4) * 3,
      };
    });
  },
  // 1: Hub-spoke — sectors forming clusters
  (n, w, h, t) => {
    const hubs = SECTOR_HUBS.slice(0, HUB_COUNT);
    const perHub = Math.ceil(n / hubs.length);
    return Array.from({ length: n }, (_, i) => {
      const hi = Math.floor(i / perHub) % hubs.length;
      const li = i % perHub;
      const hub = hubs[hi];
      const angle = (li / perHub) * Math.PI * 2 + t * 0.04 + hi;
      const radius = 0.06 + (li / perHub) * 0.08;
      return {
        x: w * (hub.cx + Math.cos(angle) * radius) + Math.sin(t * 0.1 + i) * 2,
        y: h * (hub.cy + Math.sin(angle) * radius) + Math.cos(t * 0.08 + i) * 2,
      };
    });
  },
  // 2: Diamond processor — centralized AI
  (n, w, h, t) => Array.from({ length: n }, (_, i) => {
    const f = i / n, ring = Math.floor(f * 5), rF = (f * 5) - ring, rR = 0.08 + ring * 0.08;
    const side = Math.floor(rF * 4), sF = (rF * 4) - side;
    const corners = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    const [ax, ay] = corners[side % 4], [bx, by] = corners[(side + 1) % 4];
    const breathe = 1 + Math.sin(t * 0.1 + ring) * 0.06;
    return {
      x: w * (0.5 + lerp(ax, bx, sF) * rR * breathe) + Math.sin(t * 0.05 + i) * 2,
      y: h * (0.5 + lerp(ay, by, sF) * rR * breathe) + Math.cos(t * 0.04 + i) * 2,
    };
  }),
  // 3: Cross-mesh — full integration
  (n, w, h, t) => {
    const half = Math.floor(n / 2);
    return Array.from({ length: n }, (_, i) => {
      if (i < half) {
        const g = Math.ceil(Math.sqrt(half));
        const row = Math.floor(i / g), col = i % g;
        return {
          x: w * (0.08 + (col / Math.max(g - 1, 1)) * 0.84) + Math.sin(t * 0.07 + i) * 3,
          y: h * (0.12 + (row / Math.max(Math.ceil(half / g) - 1, 1)) * 0.76) + Math.cos(t * 0.09 + i * 0.3) * 3,
        };
      }
      const j = i - half, f = j / Math.max(half - 1, 1);
      const diag = Math.sin(f * Math.PI * 2 + t * 0.06) * 0.03;
      return {
        x: w * (0.1 + f * 0.8 + diag) + Math.sin(t * 0.06 + j * 0.5) * 3,
        y: h * (0.14 + f * 0.72 - diag) + Math.cos(t * 0.08 + j * 0.3) * 3,
      };
    });
  },
  // 4: Hub-spoke v2 — sectors with stronger radial
  (n, w, h, t) => {
    const hubs = SECTOR_HUBS.slice(0, HUB_COUNT);
    const perHub = Math.ceil(n / hubs.length);
    return Array.from({ length: n }, (_, i) => {
      const hi = Math.floor(i / perHub) % hubs.length;
      const li = i % perHub;
      const hub = hubs[hi];
      if (li === 0) return { x: w * hub.cx, y: h * hub.cy };
      const angle = (li / perHub) * Math.PI * 2 + hi * 0.9 + t * 0.03;
      const radius = 0.04 + (li / perHub) * 0.1 + Math.sin(t * 0.12 + hi) * 0.015;
      return {
        x: w * (hub.cx + Math.cos(angle) * radius) + Math.sin(t * 0.07 + i) * 2,
        y: h * (hub.cy + Math.sin(angle) * radius) + Math.cos(t * 0.06 + i) * 2,
      };
    });
  },
];
const SECTIONS = topologies.length;

// Uniform palette — consistent intensity per section
const BASE_ALPHA = 0.04; // Master intensity — very subtle
const PALETTES = [
  { node: [215, 15, 40], line: [215, 12, 32], glow: [215, 20, 45], accent: [38, 30, 45] },
  { node: [265, 18, 40], line: [265, 14, 32], glow: [265, 22, 45], accent: [38, 28, 43] },
  { node: [210, 16, 40], line: [210, 12, 34], glow: [210, 20, 45], accent: [42, 28, 46] },
  { node: [220, 15, 38], line: [220, 12, 32], glow: [220, 20, 44], accent: [35, 30, 44] },
  { node: [218, 14, 38], line: [218, 10, 32], glow: [218, 18, 42], accent: [40, 28, 45] },
];

interface FlowParticle { fromIdx: number; toIdx: number; progress: number; speed: number; life: number; }
interface PulseRing { x: number; y: number; r: number; maxR: number; alpha: number; color: number[]; }

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

  useEffect(() => { const t = setTimeout(() => setReady(true), IS_MOBILE ? 800 : 200); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const fn = () => { scrollRef.current = window.scrollY || document.documentElement.scrollTop || 0; };
    window.addEventListener("scroll", fn, { passive: true });
    const mainEl = document.querySelector("main");
    if (mainEl) mainEl.addEventListener("scroll", () => { scrollRef.current = mainEl.scrollTop; }, { passive: true });
    fn();
    return () => { window.removeEventListener("scroll", fn); };
  }, []);

  useEffect(() => {
    if (IS_MOBILE) return; // No pointer tracking on mobile
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
      const dpr = IS_MOBILE ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
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

    const spawnFlow = (): FlowParticle => ({
      fromIdx: Math.floor(Math.random() * NODE_COUNT),
      toIdx: Math.floor(Math.random() * NODE_COUNT),
      progress: 0, speed: 0.003 + Math.random() * 0.005, life: 0,
    });
    if (!flowsRef.current.length) flowsRef.current = Array.from({ length: FLOW_COUNT }, spawnFlow);

    if (!pulsesRef.current.length) {
      pulsesRef.current = Array.from({ length: PULSE_COUNT }, () => ({
        x: Math.random() * (w || 1000), y: Math.random() * (h || 800),
        r: 0, maxR: 35 + Math.random() * 60, alpha: 0, color: PALETTES[0].glow,
      }));
    }

    // Simple straight-line routes only (no rectangular/orthogonal patterns)
    const getRoute = (a: Pt, b: Pt, _mode: number): Pt[] => {
      return [a, b];
    };

    const walkPolyline = (pts: Pt[], t: number): Pt => {
      if (pts.length < 2) return pts[0] || { x: 0, y: 0 };
      const segs = pts.length - 1;
      const seg = Math.min(Math.floor(t * segs), segs - 1);
      const lt = (t * segs) - seg;
      return { x: lerp(pts[seg].x, pts[seg + 1].x, lt), y: lerp(pts[seg].y, pts[seg + 1].y, lt) };
    };

    let lastFrameTime = 0;

    const animate = (now: number) => {
      animRef.current = requestAnimationFrame(animate);
      if (now - lastFrameTime < FRAME_INTERVAL) return;
      lastFrameTime = now;
      if (!w || !h) return;

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

      const pNode = lerpC(PALETTES[sIdx % PALETTES.length].node, PALETTES[(sIdx + 1) % PALETTES.length].node, t3);
      const pLine = lerpC(PALETTES[sIdx % PALETTES.length].line, PALETTES[(sIdx + 1) % PALETTES.length].line, t3);
      const pGlow = lerpC(PALETTES[sIdx % PALETTES.length].glow, PALETTES[(sIdx + 1) % PALETTES.length].glow, t3);
      const pAccent = lerpC(PALETTES[sIdx % PALETTES.length].accent, PALETTES[(sIdx + 1) % PALETTES.length].accent, t3);

      // Morph topologies
      const shA = sIdx % SECTIONS, shB = (sIdx + 1) % SECTIONS;
      const tA = topologies[shA](NODE_COUNT, w, h, time);
      const tB = topologies[shB](NODE_COUNT, w, h, time);
      const targets = tA.map((a, i) => ({ x: lerp(a.x, tB[i].x, t3), y: lerp(a.y, tB[i].y, t3) }));

      const pos = posRef.current;
      const vel = velRef.current;
      const ptr = ptrRef.current;
      const repR = IS_MOBILE ? 80 : 120;

      // Spring physics
      for (let i = 0; i < NODE_COUNT; i++) {
        if (!pos[i]) { pos[i] = { ...targets[i] }; vel[i] = { x: 0, y: 0 }; }
        let tx = targets[i].x, ty = targets[i].y;
        if (ptr.active) {
          const dx = pos[i].x - ptr.x, dy = pos[i].y - ptr.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < repR && d > 1) { const f = (1 - d / repR) * 30; tx = pos[i].x + (dx / d) * f; ty = pos[i].y + (dy / d) * f; }
        }
        vel[i].x = vel[i].x * 0.78 + (tx - pos[i].x) * 0.08;
        vel[i].y = vel[i].y * 0.78 + (ty - pos[i].y) * 0.08;
        pos[i].x += vel[i].x; pos[i].y += vel[i].y;
      }

      const routeMode = sIdx;

      // ═══ LAYER 0: Dot Matrix ═══
      if (!IS_MOBILE) {
        const gridSp = 55;
        const gridPulse = 0.5 + Math.sin(time * 0.25) * 0.5;
        ctx.fillStyle = hsla(pLine, 0.012 + gridPulse * 0.006);
        for (let gx = gridSp * 0.5; gx < w; gx += gridSp) {
          for (let gy = gridSp * 0.5; gy < h; gy += gridSp) {
            const lp = Math.sin(gx * 0.01 + gy * 0.01 + time * 0.2) * 0.5 + 0.5;
            const s = 0.3 + lp * 0.3;
            ctx.globalAlpha = 0.2 + lp * 0.2;
            ctx.fillRect(gx - s / 2, gy - s / 2, s, s);
          }
        }
        ctx.globalAlpha = 1;
      }

      // ═══ LAYER 1: Sector Hub Labels (subtle text markers) ═══
      const hubCount = Math.min(HUB_COUNT, SECTOR_HUBS.length);
      const hubBlend = 0.3 + t3 * 0.4; // More visible in hub topologies
      const isHubTopo = shA === 1 || shA === 4 || shB === 1 || shB === 4;
      if (!IS_MOBILE && isHubTopo) {
        ctx.font = "600 7px system-ui, sans-serif";
        ctx.textAlign = "center";
        for (let hi = 0; hi < hubCount; hi++) {
          const hub = SECTOR_HUBS[hi];
          const hx = w * hub.cx, hy = h * hub.cy;
          // Subtle ring
          ctx.strokeStyle = hsla(pAccent, 0.04 * hubBlend);
          ctx.lineWidth = 0.5;
          const ringR = 25 + Math.sin(time * 0.3 + hi) * 5;
          ctx.beginPath(); ctx.arc(hx, hy, ringR, 0, Math.PI * 2); ctx.stroke();
          // Label
          ctx.fillStyle = hsla(pAccent, 0.06 * hubBlend);
          ctx.fillText(hub.label.toUpperCase(), hx, hy + ringR + 10);
        }
      }

      // ═══ LAYER 2: Circuit Connections ═══
      ctx.lineCap = "square"; ctx.lineJoin = "miter";
      for (let i = 0; i < NODE_COUNT; i++) {
        const maxJ = Math.min(i + (IS_MOBILE ? 3 : 6), NODE_COUNT);
        for (let j = i + 1; j < maxJ; j++) {
          const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const alpha = Math.pow(1 - d / MAX_DIST, 2);
            const pulse = 0.5 + Math.sin(time * 1 + i * 0.3 + j * 0.2) * 0.5;
            const activeTrace = (i + j + Math.floor(time * 0.4)) % 8 === 0;

            const rA = getRoute(pos[i], pos[j], routeMode);
            const rB = getRoute(pos[i], pos[j], (routeMode + 1) % 4);
            const maxLen = Math.max(rA.length, rB.length);
            while (rA.length < maxLen) rA.push(rA[rA.length - 1]);
            while (rB.length < maxLen) rB.push(rB[rB.length - 1]);
            const route = rA.map((a, wi) => ({ x: lerp(a.x, rB[wi].x, t3), y: lerp(a.y, rB[wi].y, t3) }));

            // Uniform line rendering
            ctx.strokeStyle = hsla(activeTrace ? pAccent : pLine, alpha * (activeTrace ? 0.08 : 0.04) * (0.6 + pulse * 0.4));
            ctx.lineWidth = activeTrace ? 0.4 : 0.2 + alpha * 0.2;
            ctx.beginPath();
            ctx.moveTo(route[0].x, route[0].y);
            for (let wi = 1; wi < route.length; wi++) ctx.lineTo(route[wi].x, route[wi].y);
            ctx.stroke();

            // Active dashes
            if (activeTrace && alpha > 0.3) {
              ctx.setLineDash([3, 5]);
              ctx.lineDashOffset = -(time * 35);
              ctx.strokeStyle = hsla(pGlow, alpha * 0.12);
              ctx.lineWidth = 0.5;
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

      // ═══ LAYER 3: Nodes — uniform crosses and squares ═══
      for (let i = 0; i < NODE_COUNT; i++) {
        const breathe = 0.4 + Math.sin(time * 1 + i * 0.7) * 0.6;
        let na = 0.06 * breathe;
        const isActive = (i + Math.floor(time * 0.3)) % 10 === 0;

        if (ptr.active) {
          const dx = pos[i].x - ptr.x, dy = pos[i].y - ptr.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < repR * 1.5) na += (1 - d / (repR * 1.5)) * 0.15;
        }
        if (isActive) na = Math.min(na + 0.12, 0.3);

        if (i % 3 === 0) {
          const arm = 2 + breathe * 1.5;
          ctx.strokeStyle = hsla(isActive ? pAccent : pNode, na + 0.08);
          ctx.lineWidth = isActive ? 0.6 : 0.4;
          ctx.beginPath();
          ctx.moveTo(pos[i].x - arm, pos[i].y); ctx.lineTo(pos[i].x + arm, pos[i].y);
          ctx.moveTo(pos[i].x, pos[i].y - arm); ctx.lineTo(pos[i].x, pos[i].y + arm);
          ctx.stroke();
        } else {
          const s = 1.2 + breathe;
          ctx.fillStyle = hsla(isActive ? pAccent : pNode, na + 0.08);
          ctx.fillRect(pos[i].x - s / 2, pos[i].y - s / 2, s, s);
        }

        // Halo for active
        if (isActive) {
          const gr = ctx.createRadialGradient(pos[i].x, pos[i].y, 0, pos[i].x, pos[i].y, 8);
          gr.addColorStop(0, hsla(pAccent, na * 0.1));
          gr.addColorStop(1, hsla(pGlow, 0));
          ctx.fillStyle = gr;
          ctx.beginPath(); ctx.arc(pos[i].x, pos[i].y, 8, 0, Math.PI * 2); ctx.fill();
        }
      }

      // ═══ LAYER 4: Data Flow Particles ═══
      const flows = flowsRef.current;
      for (let fi = 0; fi < flows.length; fi++) {
        const fl = flows[fi];
        fl.progress += fl.speed;
        fl.life++;
        if (fl.progress > 1 || fl.life > 200) { flows[fi] = spawnFlow(); continue; }

        const a = pos[fl.fromIdx], b = pos[fl.toIdx];
        if (!a || !b) continue;
        const dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d > MAX_DIST * 1.5 || d < 5) { flows[fi] = spawnFlow(); continue; }

        const rA = getRoute(a, b, routeMode);
        const rB = getRoute(a, b, (routeMode + 1) % 4);
        const maxLen = Math.max(rA.length, rB.length);
        while (rA.length < maxLen) rA.push(rA[rA.length - 1]);
        while (rB.length < maxLen) rB.push(rB[rB.length - 1]);
        const route = rA.map((pa, wi) => ({ x: lerp(pa.x, rB[wi].x, t3), y: lerp(pa.y, rB[wi].y, t3) }));

        const pt = walkPolyline(route, fl.progress);
        const fadeA = Math.sin(fl.progress * Math.PI);

        // Trail (desktop)
        if (!IS_MOBILE) {
          for (let ti = 1; ti <= 3; ti++) {
            const trailT = Math.max(0, fl.progress - ti * 0.04);
            const tp = walkPolyline(route, trailT);
            ctx.fillStyle = hsla(pGlow, fadeA * (1 - ti * 0.3) * 0.12);
            ctx.fillRect(tp.x - 0.8, tp.y - 0.8, 1.6, 1.6);
          }
        }

        ctx.fillStyle = hsla(pAccent, fadeA * 0.15);
        ctx.fillRect(pt.x - 0.8, pt.y - 0.8, 1.6, 1.6);
      }

      // ═══ LAYER 5: Pulse Rings ═══
      const pulses = pulsesRef.current;
      for (let pi = 0; pi < pulses.length; pi++) {
        const p = pulses[pi];
        p.r += 0.2 + Math.sin(time + pi) * 0.08;
        p.alpha = (1 - p.r / p.maxR) * 0.018;
        if (p.r >= p.maxR) {
          const ni = Math.floor(Math.random() * NODE_COUNT);
          const node = pos[ni];
          if (node) { p.x = node.x; p.y = node.y; p.r = 0; p.maxR = 30 + Math.random() * 55; p.color = (pi % 2 === 0) ? pGlow : pAccent; }
        }
        if (p.alpha > 0.004) {
          ctx.strokeStyle = hsla(p.color, p.alpha);
          ctx.lineWidth = 0.35;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke();
        }
      }

      // ═══ LAYER 6: Desktop-only (radar, scan) ═══
      if (!IS_MOBILE) {
        // Radar
        const radarAngle = time * 0.08;
        const radarR = Math.min(w, h) * 0.45;
        const rGrad = ctx.createConicGradient(radarAngle, w * 0.5, h * 0.5);
        rGrad.addColorStop(0, hsla(pGlow, 0));
        rGrad.addColorStop(0.02, hsla(pGlow, 0.012));
        rGrad.addColorStop(0.06, hsla(pGlow, 0));
        rGrad.addColorStop(1, hsla(pGlow, 0));
        ctx.beginPath(); ctx.moveTo(w * 0.5, h * 0.5);
        ctx.arc(w * 0.5, h * 0.5, radarR, radarAngle, radarAngle + Math.PI * 0.15); ctx.closePath();
        ctx.fillStyle = rGrad; ctx.fill();

        // Scan line
        const scanY = h * (0.5 + Math.sin(time * 0.06) * 0.45);
        const scanGrad = ctx.createLinearGradient(0, scanY - 35, 0, scanY + 35);
        scanGrad.addColorStop(0, hsla(pAccent, 0));
        scanGrad.addColorStop(0.5, hsla(pAccent, 0.012));
        scanGrad.addColorStop(1, hsla(pAccent, 0));
        ctx.fillStyle = scanGrad; ctx.fillRect(0, scanY - 35, w, 70);
      }

      // ═══ LAYER 7: Corner brackets ═══
      const brk = 28;
      ctx.strokeStyle = hsla(pLine, 0.022 + Math.sin(time * 0.25) * 0.008);
      ctx.lineWidth = 0.35;
      ctx.beginPath(); ctx.moveTo(8, 8 + brk); ctx.lineTo(8, 8); ctx.lineTo(8 + brk, 8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w - 8 - brk, 8); ctx.lineTo(w - 8, 8); ctx.lineTo(w - 8, 8 + brk); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(8, h - 8 - brk); ctx.lineTo(8, h - 8); ctx.lineTo(8 + brk, h - 8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w - 8 - brk, h - 8); ctx.lineTo(w - 8, h - 8); ctx.lineTo(w - 8, h - 8 - brk); ctx.stroke();
    };

    animRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [ready]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: IS_MOBILE ? 0.14 : 0.045, willChange: "transform", transform: "translateZ(0)" }}
    />
  );
};

export default EmpireDNABackground;
