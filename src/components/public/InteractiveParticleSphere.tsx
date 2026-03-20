import { useRef, useEffect, useCallback } from "react";
import {
  Atom,
  Binary,
  Brain,
  BrainCircuit,
  CircuitBoard,
  Cpu,
  Database,
  Fingerprint,
  Network,
  Radar,
  ScanLine,
  Sparkles,
  Waypoints,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/**
 * InteractiveParticleSphere — Hyper-Tech AI DNA Neural Core
 * Dense with tech elements: DNA helix, orbit ring, neural synapses,
 * data streams, radar sweeps, floating particles, pulse rings.
 * Cycles: DNA helix → Orbit ring → loop. Always alive with activity.
 */

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

const HELIX_NODES = IS_MOBILE ? 28 : 80;
const MESH_COUNT = IS_MOBILE ? 14 : 50;
const ENERGY_PARTICLES = IS_MOBILE ? 10 : 40;
const CIRCUIT_LINES = IS_MOBILE ? 6 : 24;
const ORBIT_DOTS = IS_MOBILE ? 16 : 48;
const SYNAPSE_COUNT = IS_MOBILE ? 6 : 24;
const DATA_STREAMS = IS_MOBILE ? 4 : 16;
const FLOAT_PARTICLES = IS_MOBILE ? 10 : 45;

const TECH_ICON_SET: { Icon: LucideIcon; color: string; glow: string }[] = [
  { Icon: Brain, color: "hsla(265,80%,65%,0.9)", glow: "hsla(265,80%,65%,0.3)" },
  { Icon: Cpu, color: "hsla(38,55%,60%,0.9)", glow: "hsla(38,50%,55%,0.3)" },
  { Icon: Fingerprint, color: "hsla(265,70%,70%,0.9)", glow: "hsla(265,70%,70%,0.3)" },
  { Icon: Workflow, color: "hsla(38,60%,55%,0.9)", glow: "hsla(38,60%,55%,0.3)" },
  { Icon: Database, color: "hsla(265,65%,65%,0.9)", glow: "hsla(265,65%,65%,0.3)" },
  { Icon: ScanLine, color: "hsla(38,50%,60%,0.9)", glow: "hsla(38,50%,60%,0.3)" },
  { Icon: BrainCircuit, color: "hsla(265,75%,70%,0.85)", glow: "hsla(265,75%,70%,0.25)" },
  { Icon: Network, color: "hsla(38,55%,58%,0.85)", glow: "hsla(38,55%,58%,0.25)" },
  { Icon: Atom, color: "hsla(265,60%,72%,0.85)", glow: "hsla(265,60%,72%,0.25)" },
  { Icon: Radar, color: "hsla(38,50%,55%,0.85)", glow: "hsla(38,50%,55%,0.25)" },
  { Icon: CircuitBoard, color: "hsla(265,70%,62%,0.85)", glow: "hsla(265,70%,62%,0.25)" },
  { Icon: Waypoints, color: "hsla(38,60%,52%,0.85)", glow: "hsla(38,60%,52%,0.25)" },
  { Icon: Sparkles, color: "hsla(265,85%,75%,0.85)", glow: "hsla(265,85%,75%,0.25)" },
  { Icon: Binary, color: "hsla(38,45%,60%,0.85)", glow: "hsla(38,45%,60%,0.25)" },
];

const TECH_ICON_COUNT = IS_MOBILE ? 8 : TECH_ICON_SET.length;

const COLORS = {
  gold: { h: 38, s: 58, l: 58 },
  violet: { h: 265, s: 80, l: 65 },
  green: { h: 155, s: 72, l: 52 },
  cyan: { h: 185, s: 78, l: 58 },
  white: { h: 0, s: 0, l: 92 },
};

const colorPalette = [COLORS.violet, COLORS.gold, COLORS.green, COLORS.cyan];

const hsl = (c: { h: number; s: number; l: number }, a: number) =>
  `hsla(${c.h},${c.s}%,${c.l}%,${a})`;

const CYCLE_DURATION = 12;
const HELIX_END = 5;
const ORBIT_START = 4;
const ORBIT_END = 11;
const HELIX_RESTART = 10;

// ── Sample text outline into point cloud ──
const sampleTextPoints = (text: string, w: number, h: number, maxPts: number): { x: number; y: number }[] => {
  const offC = document.createElement("canvas");
  offC.width = w; offC.height = h;
  const offCtx = offC.getContext("2d");
  if (!offCtx) return [];
  offCtx.clearRect(0, 0, w, h);
  const fontSize = Math.min(w / (text.length * 0.52), h * 0.22);
  offCtx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`;
  offCtx.textAlign = "center";
  offCtx.textBaseline = "middle";
  offCtx.fillStyle = "#fff";
  offCtx.fillText(text, w / 2, h / 2);
  const imgData = offCtx.getImageData(0, 0, w, h).data;
  const pts: { x: number; y: number }[] = [];
  const step = Math.max(2, Math.floor(Math.sqrt((w * h) / (maxPts * 3))));
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (imgData[(y * w + x) * 4 + 3] > 128) pts.push({ x, y });
    }
  }
  // Shuffle and limit
  for (let i = pts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pts[i], pts[j]] = [pts[j], pts[i]]; }
  return pts.slice(0, maxPts);
};

const InteractiveParticleSphere = ({ size = 280 }: { size?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const pointerRef = useRef({ x: size / 2, y: size / 2, active: false });
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const morphRef = useRef<{ active: boolean; startTime: number; textPts: { x: number; y: number }[]; phase: "in" | "hold" | "out" | "idle" }>({ active: false, startTime: 0, textPts: [], phase: "idle" });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const w = size, h = size;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = w / 2, cy = h / 2;
    const turns = 5;
    const sc = Math.min(w, h) / (IS_MOBILE ? 400 : 700);

    // ── Mesh nodes — neural dust ──
    const mesh: { x: number; y: number; vx: number; vy: number; r: number; ci: number }[] = [];
    for (let i = 0; i < MESH_COUNT; i++) mesh.push({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0004, vy: (Math.random() - 0.5) * 0.0004,
      r: 0.8 + Math.random() * 1.8, ci: i % 4,
    });

    // ── DNA helix ──
    const helix: { tx: number; ty: number; x: number; y: number; r: number; ci: number; strand: number; ba: number; glow: boolean }[] = [];
    for (let i = 0; i < HELIX_NODES; i++) {
      const t = i / HELIX_NODES, angle = t * Math.PI * 2 * turns;
      const yPos = 0.05 + t * 0.9, amp = 0.18 + Math.sin(t * Math.PI) * 0.06;
      const strand = i % 2 === 0 ? 1 : -1;
      helix.push({ tx: 0.5 + Math.sin(angle) * amp * strand, ty: yPos, x: 0, y: 0, r: i % 3 === 1 ? 3.5 : 2.5, ci: i % 4, strand, ba: angle, glow: i % 3 === 0 });
    }

    // ── Energy particles ──
    const energy: { t: number; sp: number; strand: number; ci: number }[] = [];
    for (let i = 0; i < ENERGY_PARTICLES; i++) energy.push({ t: Math.random(), sp: 0.06 + Math.random() * 0.14, strand: Math.random() > 0.5 ? 1 : -1, ci: i % 4 });

    // ── Circuit lines ──
    const circuits: { x1: number; y1: number; x2: number; y2: number; ci: number; p: number }[] = [];
    for (let i = 0; i < CIRCUIT_LINES; i++) {
      const hz = i % 2 === 0;
      circuits.push({ x1: hz ? 0.02 : (0.1 + Math.random() * 0.8), y1: hz ? (0.05 + Math.random() * 0.9) : 0.02, x2: hz ? 0.98 : (0.1 + Math.random() * 0.8), y2: hz ? (0.05 + Math.random() * 0.9) : 0.98, ci: i % 4, p: Math.random() });
    }

    // ── Orbit dots ──
    const oDots: { a: number; sp: number; ci: number; sz: number }[] = [];
    for (let i = 0; i < ORBIT_DOTS; i++) oDots.push({ a: (i / ORBIT_DOTS) * Math.PI * 2, sp: 0.5 + Math.random() * 0.6, ci: i % 4, sz: 1.2 + Math.random() * 2.5 });

    // ── Synaptic pulses — fire between random nodes ──
    const synapses: { from: number; to: number; t: number; sp: number; ci: number; life: number }[] = [];
    for (let i = 0; i < SYNAPSE_COUNT; i++) synapses.push({ from: Math.floor(Math.random() * HELIX_NODES), to: Math.floor(Math.random() * HELIX_NODES), t: Math.random(), sp: 0.01 + Math.random() * 0.02, ci: i % 4, life: 0 });

    // ── Data streams — orbiting trails inside and outside ──
    const streams: { angle: number; rMult: number; sp: number; ci: number; trail: number }[] = [];
    for (let i = 0; i < DATA_STREAMS; i++) streams.push({ angle: Math.random() * Math.PI * 2, rMult: 0.15 + Math.random() * 0.75, sp: 0.3 + Math.random() * 1.2, ci: i % 4, trail: 3 + Math.random() * 6 });

    // ── Floating ambient particles ──
    const floats: { x: number; y: number; vx: number; vy: number; r: number; ci: number; pulse: number }[] = [];
    for (let i = 0; i < FLOAT_PARTICLES; i++) floats.push({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: 0.5 + Math.random() * 1.5, ci: i % 4, pulse: Math.random() * Math.PI * 2,
    });

    // ── Tech AI Icons — splash-identical set, floating & communicating ──
    const techIcons: { x: number; y: number; ci: number; orbitA: number; orbitR: number; orbitSp: number; pulse: number }[] = [];
    for (let i = 0; i < TECH_ICON_COUNT; i++) {
      const isInner = i < 6;
      const angle = (i / TECH_ICON_COUNT) * Math.PI * 2;
      techIcons.push({
        x: cx,
        y: cy,
        ci: i % 4,
        orbitA: angle,
        orbitR: isInner ? 0.2 + Math.random() * 0.06 : 0.28 + Math.random() * 0.1,
        orbitSp: (isInner ? 0.45 : -0.3) + Math.random() * 0.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // ── DNA Neural Labels — like "Il DNA Tecnologico" section ──
    const DNA_LABELS = [
      { label: "AI CORE", primary: true },
      { label: "CRM", primary: false },
      { label: "ORDINI", primary: false },
      { label: "ANALYTICS", primary: false },
      { label: "PAGAMENTI", primary: false },
      { label: "CATALOGO", primary: false },
      { label: "BOOKING", primary: false },
      { label: "STAFF", primary: false },
      { label: "MARKETING", primary: false },
    ];
    const dnaNodes: { x: number; y: number; label: string; primary: boolean; orbitA: number; orbitR: number; orbitSp: number; pulse: number }[] = [];
    for (let i = 0; i < DNA_LABELS.length; i++) {
      const d = DNA_LABELS[i];
      const angle = (i / DNA_LABELS.length) * Math.PI * 2;
      dnaNodes.push({
        x: cx, y: cy,
        label: d.label,
        primary: d.primary,
        orbitA: angle,
        orbitR: d.primary ? 0 : 0.12 + (i % 2 === 0 ? 0.05 : 0.1),
        orbitSp: d.primary ? 0 : (0.08 + (i % 3) * 0.04) * (i % 2 === 0 ? 1 : -1),
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const startTime = performance.now();
    let lastFrame = 0;
    const FI = IS_MOBILE ? 50 : 0; // ~20fps on mobile, 60fps on desktop
    const repelR = w * 0.2;

    const ss = (e0: number, e1: number, x: number) => { const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };

    const draw = (now: number) => {
      if (IS_MOBILE && now - lastFrame < FI) { animRef.current = requestAnimationFrame(draw); return; }
      lastFrame = now;
      const el = (now - startTime) / 1000;
      const ct = el % CYCLE_DURATION;
      const ptr = pointerRef.current;
      const hRot = el * 0.4;
      const cR = Math.min(w, h) * 0.16;

      const hA = ct < HELIX_END ? ss(0, 0.8, ct) : ct > HELIX_RESTART ? ss(HELIX_RESTART, HELIX_RESTART + 1.5, ct) : 1 - ss(ORBIT_START, ORBIT_START + 1.5, ct);
      const oA = ct < ORBIT_START ? 0 : ct < ORBIT_END ? ss(ORBIT_START, ORBIT_START + 1.5, ct) : 1 - ss(ORBIT_END, ORBIT_END + 1, ct);
      const anyA = Math.max(hA, oA, 0.15); // always some visibility

      ctx.clearRect(0, 0, w, h);

      // ═══ L0: FLOATING AMBIENT PARTICLES — always alive ═══
      for (const f of floats) {
        f.x += f.vx; f.y += f.vy; f.pulse += 0.03;
        if (f.x < -10) f.x = w + 10; if (f.x > w + 10) f.x = -10;
        if (f.y < -10) f.y = h + 10; if (f.y > h + 10) f.y = -10;
        const pa = (0.3 + Math.sin(f.pulse) * 0.15) * anyA;
        const c = colorPalette[f.ci];
        const gr = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 6);
        gr.addColorStop(0, hsl(c, pa * 0.8));
        gr.addColorStop(1, hsl(c, 0));
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 6, 0, Math.PI * 2); ctx.fillStyle = gr; ctx.fill();
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fillStyle = hsl(c, pa * 1.2); ctx.fill();
      }

      // ═══ L1: CIRCUIT DATA PATHWAYS ═══
      for (const cl of circuits) {
        cl.p = (cl.p + 0.008) % 1.3;
        const p = Math.min(cl.p, 1);
        const c = colorPalette[cl.ci];
        const lx = cl.x1 + (cl.x2 - cl.x1) * p, ly = cl.y1 + (cl.y2 - cl.y1) * p;
        ctx.beginPath(); ctx.moveTo(cl.x1 * w, cl.y1 * h); ctx.lineTo(lx * w, ly * h);
        ctx.strokeStyle = hsl(c, 0.12 * anyA); ctx.lineWidth = 0.7; ctx.stroke();
        if (p > 0.3) {
          ctx.beginPath(); ctx.arc(lx * w, ly * h, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = hsl(c, 0.35 * anyA); ctx.fill();
        }
      }

      // ═══ L2: CENTRAL INTELLIGENCE CORE ═══
      const cP = 1 + Math.sin(el * 1.8) * 0.1;
      const cAl = anyA * 0.45;
      const cGr = ctx.createRadialGradient(cx, cy, 0, cx, cy, cR * cP * 2);
      cGr.addColorStop(0, hsl(COLORS.violet, cAl * 1.8));
      cGr.addColorStop(0.15, hsl(COLORS.gold, cAl * 1.2));
      cGr.addColorStop(0.35, hsl(COLORS.cyan, cAl * 0.8));
      cGr.addColorStop(0.55, hsl(COLORS.green, cAl * 0.6));
      cGr.addColorStop(0.75, hsl(COLORS.green, cAl * 0.2));
      cGr.addColorStop(1, "hsla(265,80%,65%,0)");
      ctx.beginPath(); ctx.arc(cx, cy, cR * cP * 2, 0, Math.PI * 2); ctx.fillStyle = cGr; ctx.fill();

      // Concentric rings — more rings for tech density
      const rCols = [COLORS.violet, COLORS.green, COLORS.gold, COLORS.cyan, COLORS.green];
      const rRad = [0.35, 0.5, 0.65, 0.8, 0.95];
      for (let i = 0; i < 5; i++) {
        ctx.beginPath(); ctx.arc(cx, cy, cR * rRad[i] * cP, 0, Math.PI * 2);
        ctx.strokeStyle = hsl(rCols[i], 0.35 * (1 - i * 0.1) * anyA);
        ctx.lineWidth = i % 2 === 0 ? 1.2 : 0.6; ctx.stroke();
      }

      // ═══ L3: DATA STREAMS — orbiting trails ═══
      for (const ds of streams) {
        ds.angle += ds.sp * 0.016;
        const baseR = Math.min(w, h) * 0.35 * ds.rMult;
        const c = colorPalette[ds.ci];
        const trailLen = Math.floor(ds.trail);
        for (let ti = 0; ti < trailLen; ti++) {
          const ta = ds.angle - ti * 0.08;
          const wobble = Math.sin(ta * 3 + el * 2) * 5 * sc;
          const r = baseR + wobble;
          const px = cx + Math.cos(ta) * r, py = cy + Math.sin(ta) * r;
          const fa = (1 - ti / trailLen) * 0.55 * anyA;
          ctx.beginPath(); ctx.arc(px, py, (2 - ti * 0.1) * sc, 0, Math.PI * 2);
          ctx.fillStyle = hsl(c, fa); ctx.fill();
        }
      }

      // ═══ L4: NEURAL MESH ═══
      const ckR = IS_MOBILE ? 5 : 8;
      for (const n of mesh) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1; if (n.y < 0 || n.y > 1) n.vy *= -1;
        const c = colorPalette[n.ci];
        ctx.beginPath(); ctx.arc(n.x * w, n.y * h, n.r, 0, Math.PI * 2);
        ctx.fillStyle = hsl(c, 0.12 * anyA); ctx.fill();
      }
      for (let i = 0; i < mesh.length; i++) {
        for (let j = i + 1; j < Math.min(i + ckR, mesh.length); j++) {
          const dx = mesh[i].x - mesh[j].x, dy = mesh[i].y - mesh[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 0.18) {
            ctx.beginPath(); ctx.moveTo(mesh[i].x * w, mesh[i].y * h); ctx.lineTo(mesh[j].x * w, mesh[j].y * h);
            ctx.strokeStyle = hsl(colorPalette[mesh[i].ci], (1 - d / 0.18) * 0.06 * anyA);
            ctx.lineWidth = 0.4; ctx.stroke();
          }
        }
      }

      // ═══ L5: DNA DOUBLE HELIX ═══
      if (hA > 0.05) {
        const amp = 0.18;
        for (const n of helix) {
          const ra = n.ba + hRot;
          const av = amp + Math.sin(n.ty * Math.PI) * 0.06;
          n.x = 0.5 + Math.sin(ra) * av * n.strand; n.y = n.ty;
        }

        // Backbone + repulsion
        for (let i = 0; i < helix.length - 1; i++) {
          const a = helix[i], b = helix[i + 1];
          let ax = a.x * w, ay = a.y * h, bx = b.x * w, by = b.y * h;
          if (ptr.active) {
            for (const [o, isA] of [[{ px: ax, py: ay }, true], [{ px: bx, py: by }, false]] as any[]) {
              const ddx = o.px - ptr.x, ddy = o.py - ptr.y, dd = Math.sqrt(ddx * ddx + ddy * ddy);
              if (dd > 1 && dd < repelR) { const f = (1 - dd / repelR) * 18; if (isA) { ax += (ddx / dd) * f; ay += (ddy / dd) * f; } else { bx += (ddx / dd) * f; by += (ddy / dd) * f; } }
            }
          }
          const dx = ax - bx, dy = ay - by, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < w * 0.14) {
            ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
            ctx.strokeStyle = hsl(colorPalette[a.ci], (1 - dist / (w * 0.14)) * 0.4 * hA); ctx.lineWidth = 1; ctx.stroke();
          }
        }

        // Base pairs
        for (let i = 0; i < helix.length - 1; i += 2) {
          if (i + 1 < helix.length && helix[i].strand !== helix[i + 1].strand) {
            const a = helix[i], b = helix[i + 1];
            ctx.beginPath(); ctx.moveTo(a.x * w, a.y * h); ctx.lineTo(b.x * w, b.y * h);
            ctx.strokeStyle = hsl(colorPalette[(i / 2) % 4], 0.12 * hA); ctx.lineWidth = 0.5; ctx.stroke();
          }
        }

        // Nodes with glow
        for (const n of helix) {
          let px = n.x * w, py = n.y * h;
          if (ptr.active) { const ddx = px - ptr.x, ddy = py - ptr.y, dd = Math.sqrt(ddx * ddx + ddy * ddy); if (dd > 1 && dd < repelR) { const f = (1 - dd / repelR) * 18; px += (ddx / dd) * f; py += (ddy / dd) * f; } }
          const c = colorPalette[n.ci];
          if (n.glow) {
            const gR = n.r * 5;
            const gg = ctx.createRadialGradient(px, py, 0, px, py, gR);
            gg.addColorStop(0, hsl(c, 0.25 * hA)); gg.addColorStop(1, hsl(c, 0));
            ctx.beginPath(); ctx.arc(px, py, gR, 0, Math.PI * 2); ctx.fillStyle = gg; ctx.fill();
          }
          ctx.beginPath(); ctx.arc(px, py, n.r * sc * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = hsl(c, 0.9 * hA); ctx.fill();
        }

        // ── Synaptic pulses between helix nodes ──
        for (const syn of synapses) {
          syn.t += syn.sp; syn.life++;
          if (syn.t > 1 || syn.life > 200) { syn.from = Math.floor(Math.random() * HELIX_NODES); syn.to = Math.floor(Math.random() * HELIX_NODES); syn.t = 0; syn.life = 0; syn.ci = Math.floor(Math.random() * 4); }
          const a = helix[syn.from], b = helix[syn.to];
          if (!a || !b) continue;
          const spx = a.x * w + (b.x * w - a.x * w) * syn.t;
          const spy = a.y * h + (b.y * h - a.y * h) * syn.t;
          const fa = Math.sin(syn.t * Math.PI) * 0.5 * hA;
          const c = colorPalette[syn.ci];
          const sg = ctx.createRadialGradient(spx, spy, 0, spx, spy, 6 * sc);
          sg.addColorStop(0, hsl(c, fa)); sg.addColorStop(1, hsl(c, 0));
          ctx.beginPath(); ctx.arc(spx, spy, 6 * sc, 0, Math.PI * 2); ctx.fillStyle = sg; ctx.fill();
          ctx.beginPath(); ctx.arc(spx, spy, 1.2 * sc, 0, Math.PI * 2); ctx.fillStyle = `hsla(0,0%,100%,${fa * 0.7})`; ctx.fill();
        }

        // Energy particles
        for (const ep of energy) {
          ep.t = (ep.t + ep.sp * 0.016) % 1;
          const angle = ep.t * Math.PI * 2 * turns + hRot;
          const av = 0.18 + Math.sin(ep.t * Math.PI) * 0.06;
          let epx = (0.5 + Math.sin(angle) * av * ep.strand) * w;
          let epy = (0.05 + ep.t * 0.9) * h;
          if (ptr.active) { const ddx = epx - ptr.x, ddy = epy - ptr.y, dd = Math.sqrt(ddx * ddx + ddy * ddy); if (dd > 1 && dd < repelR) { const f = (1 - dd / repelR) * 12; epx += (ddx / dd) * f; epy += (ddy / dd) * f; } }
          const eA = 0.6 * hA * Math.sin(ep.t * Math.PI);
          const c = colorPalette[ep.ci];
          const tg = ctx.createRadialGradient(epx, epy, 0, epx, epy, 8 * sc);
          tg.addColorStop(0, hsl(c, eA)); tg.addColorStop(1, hsl(c, 0));
          ctx.beginPath(); ctx.arc(epx, epy, 8 * sc, 0, Math.PI * 2); ctx.fillStyle = tg; ctx.fill();
          ctx.beginPath(); ctx.arc(epx, epy, 1.5 * sc, 0, Math.PI * 2); ctx.fillStyle = `hsla(0,0%,100%,${eA * 0.8})`; ctx.fill();
        }

        // Scanning beam
        if (hA > 0.4) {
          const sY = (Math.sin(el * 1.2) * 0.5 + 0.5) * h;
          const sg = ctx.createLinearGradient(0, sY - 30, 0, sY + 30);
          sg.addColorStop(0, hsl(COLORS.cyan, 0)); sg.addColorStop(0.5, hsl(COLORS.cyan, 0.07 * hA)); sg.addColorStop(1, hsl(COLORS.cyan, 0));
          ctx.fillStyle = sg; ctx.fillRect(0, sY - 30, w, 60);
        }
      }

      // ═══ L6: ORBIT RING — Intelligence Ring ═══
      if (oA > 0.01) {
        const oR = Math.min(w, h) * 0.35;
        const rS = el * 0.6;
        const hS = 3, hSeg = IS_MOBILE ? 80 : 140, hAm = 10 * sc, hFr = 8;

        // Triple helix ring
        for (let s = 0; s < hS; s++) {
          const sC = colorPalette[s]; const pO = (s / hS) * Math.PI * 2;
          ctx.beginPath();
          for (let i = 0; i <= hSeg; i++) {
            const t = i / hSeg, bA = t * Math.PI * 2 + rS * (0.5 + s * 0.1);
            const wo = Math.sin(t * Math.PI * 2 * hFr + pO + el * 2.5) * hAm;
            const r = oR + wo, px = cx + Math.cos(bA) * r, py = cy + Math.sin(bA) * r;
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = hsl(sC, 0.45 * oA); ctx.lineWidth = 1.5 * sc; ctx.stroke();
          // Glow
          ctx.beginPath();
          for (let i = 0; i <= hSeg; i++) {
            const t = i / hSeg, bA = t * Math.PI * 2 + rS * (0.5 + s * 0.1);
            const wo = Math.sin(t * Math.PI * 2 * hFr + pO + el * 2.5) * hAm;
            const r = oR + wo, px = cx + Math.cos(bA) * r, py = cy + Math.sin(bA) * r;
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = hsl(sC, 0.1 * oA); ctx.lineWidth = 7 * sc; ctx.stroke();
        }

        // Cross-links
        const rC = IS_MOBILE ? 18 : 32;
        for (let i = 0; i < rC; i++) {
          const t = i / rC, bA = t * Math.PI * 2 + rS * 0.5;
          const w1 = Math.sin(t * Math.PI * 2 * hFr + el * 2.5) * hAm;
          const w2 = Math.sin(t * Math.PI * 2 * hFr + (2 / 3) * Math.PI * 2 + el * 2.5) * hAm;
          const r1 = oR + w1, r2 = oR + w2;
          const rA = 0.14 * oA * (0.5 + 0.5 * Math.sin(t * Math.PI * 4 + el));
          ctx.beginPath(); ctx.moveTo(cx + Math.cos(bA) * r1, cy + Math.sin(bA) * r1); ctx.lineTo(cx + Math.cos(bA) * r2, cy + Math.sin(bA) * r2);
          ctx.strokeStyle = hsl(COLORS.gold, rA); ctx.lineWidth = 0.5; ctx.stroke();
        }

        // Data nodes
        for (const dot of oDots) {
          const a = dot.a + rS * dot.sp;
          const sI = Math.floor(dot.a / (Math.PI * 2 / 3)) % 3;
          const wO = Math.sin(dot.a * hFr + (sI / 3) * Math.PI * 2 + el * 2.5) * hAm;
          const r = oR + wO, px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
          const c = colorPalette[dot.ci], p = 0.7 + 0.3 * Math.sin(el * 3 + dot.a * 3);
          const gR = dot.sz * 4 * p * sc;
          const gg = ctx.createRadialGradient(px, py, 0, px, py, gR);
          gg.addColorStop(0, hsl(c, 0.4 * oA * p)); gg.addColorStop(0.5, hsl(c, 0.1 * oA)); gg.addColorStop(1, hsl(c, 0));
          ctx.beginPath(); ctx.arc(px, py, gR, 0, Math.PI * 2); ctx.fillStyle = gg; ctx.fill();
          ctx.beginPath(); ctx.arc(px, py, dot.sz * p * sc * 0.7, 0, Math.PI * 2); ctx.fillStyle = hsl(c, 0.9 * oA); ctx.fill();
        }

        // Rotating scan arcs (more arcs)
        for (let i = 0; i < 5; i++) {
          const aA = el * (0.6 + i * 0.15) + (i * Math.PI * 2) / 5;
          const aL = Math.PI * (0.15 + i * 0.03);
          const aR = oR * (0.88 + i * 0.03);
          const aC = colorPalette[i % 4];
          const aG = ctx.createConicGradient(aA - aL, cx, cy);
          aG.addColorStop(0, hsl(aC, 0)); aG.addColorStop(0.5, hsl(aC, 0.2 * oA)); aG.addColorStop(1, hsl(aC, 0));
          ctx.beginPath(); ctx.arc(cx, cy, aR, aA - aL, aA + aL);
          ctx.strokeStyle = aG as unknown as string; ctx.lineWidth = 2 * sc; ctx.stroke();
        }

        // Inner neural network — always visible during orbit
        if (oA > 0.15) {
          const nA = (oA - 0.15) * 1.18 * 0.15;
          const nN = IS_MOBILE ? 14 : 22;
          const nR = oR * 0.55;
          const nP: { x: number; y: number }[] = [];
          for (let i = 0; i < nN; i++) {
            const na = (i / nN) * Math.PI * 2 + el * 0.3;
            const nr = nR * (0.25 + 0.75 * Math.abs(Math.sin(na * 2.5 + el * 0.8)));
            const nx = cx + Math.cos(na) * nr, ny = cy + Math.sin(na) * nr;
            nP.push({ x: nx, y: ny });
            // Node glow
            const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, 4 * sc);
            ng.addColorStop(0, hsl(COLORS.violet, nA * 4)); ng.addColorStop(1, hsl(COLORS.violet, 0));
            ctx.beginPath(); ctx.arc(nx, ny, 4 * sc, 0, Math.PI * 2); ctx.fillStyle = ng; ctx.fill();
            ctx.beginPath(); ctx.arc(nx, ny, 1.5 * sc, 0, Math.PI * 2); ctx.fillStyle = hsl(COLORS.violet, nA * 5); ctx.fill();
          }
          // Neural connections
          for (let i = 0; i < nP.length; i++) for (let j = i + 1; j < nP.length; j++) {
            if ((i + j) % 2 === 0) {
              const dx = nP[i].x - nP[j].x, dy = nP[i].y - nP[j].y, d = Math.sqrt(dx * dx + dy * dy);
              if (d < nR * 1.4) {
                ctx.beginPath(); ctx.moveTo(nP[i].x, nP[i].y); ctx.lineTo(nP[j].x, nP[j].y);
                ctx.strokeStyle = hsl(COLORS.cyan, nA * 0.8 * (1 - d / (nR * 1.4))); ctx.lineWidth = 0.5; ctx.stroke();
              }
            }
          }
          // Brain core — pulsing intelligence
          const bP = 1 + Math.sin(el * 2.5) * 0.12;
          const bR = 16 * sc;
          const bG = ctx.createRadialGradient(cx, cy, 0, cx, cy, bR * bP * 2.5);
          bG.addColorStop(0, `hsla(0,0%,100%,${0.3 * nA * 6})`);
          bG.addColorStop(0.15, hsl(COLORS.violet, nA * 5));
          bG.addColorStop(0.35, hsl(COLORS.gold, nA * 3));
          bG.addColorStop(0.6, hsl(COLORS.cyan, nA * 2));
          bG.addColorStop(1, hsl(COLORS.violet, 0));
          ctx.beginPath(); ctx.arc(cx, cy, bR * bP * 2.5, 0, Math.PI * 2); ctx.fillStyle = bG; ctx.fill();
        }

        // ── Outer pulse rings — expanding from ring ──
        const pulsePhase = (el * 0.5) % 3;
        if (pulsePhase < 1) {
          const pR = oR + pulsePhase * oR * 0.4;
          ctx.beginPath(); ctx.arc(cx, cy, pR, 0, Math.PI * 2);
          ctx.strokeStyle = hsl(COLORS.cyan, 0.15 * (1 - pulsePhase) * oA);
          ctx.lineWidth = 1; ctx.stroke();
        }
      }

      // ═══ L6.5: TECH AI ICONS — splash-identical, floating & communicating ═══
      for (let i = 0; i < techIcons.length; i++) {
        const ti = techIcons[i];
        ti.orbitA += ti.orbitSp * 0.016;
        ti.pulse += 0.04;
        const baseR = Math.min(w, h) * ti.orbitR;
        const wobble = Math.sin(ti.orbitA * 2 + el) * 8 * sc;
        ti.x = cx + Math.cos(ti.orbitA) * (baseR + wobble);
        ti.y = cy + Math.sin(ti.orbitA) * (baseR + wobble);

        if (ptr.active) {
          const ddx = ti.x - ptr.x, ddy = ti.y - ptr.y, dd = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dd > 1 && dd < repelR) { const f = (1 - dd / repelR) * 15; ti.x += (ddx / dd) * f; ti.y += (ddy / dd) * f; }
        }

        const iconEl = iconRefs.current[i];
        if (iconEl) {
          const iconCfg = TECH_ICON_SET[i];
          const pA = 0.65 + Math.sin(ti.pulse) * 0.2;
          iconEl.style.transform = `translate(${ti.x}px, ${ti.y}px) translate(-50%, -50%) scale(${0.92 + pA * 0.12})`;
          iconEl.style.opacity = `${Math.max(0.35, anyA * pA)}`;
          if (iconCfg) {
            iconEl.style.boxShadow = `0 0 ${10 * sc}px ${iconCfg.glow}, inset 0 0 4px hsla(265,30%,35%,0.1)`;
          }
        }
      }

      // Communication lines between nearby icons
      const commR = Math.min(w, h) * 0.32;
      for (let i = 0; i < techIcons.length; i++) {
        for (let j = i + 1; j < techIcons.length; j++) {
          const a = techIcons[i], b = techIcons[j];
          const dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < commR) {
            const lineA = (1 - d / commR) * 0.25 * anyA;
            const pulseT = Math.sin(el * 2 + i * 0.5 + j * 0.3) * 0.5 + 0.5;
            const c = colorPalette[(i + j) % 4];
            ctx.beginPath();
            ctx.setLineDash([3, 4]);
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = hsl(c, lineA * 0.7);
            ctx.lineWidth = 0.6; ctx.stroke();
            ctx.setLineDash([]);

            const px = a.x + (b.x - a.x) * pulseT;
            const py = a.y + (b.y - a.y) * pulseT;
            const pg = ctx.createRadialGradient(px, py, 0, px, py, 4 * sc);
            pg.addColorStop(0, hsl(c, lineA * 1.5));
            pg.addColorStop(1, hsl(c, 0));
            ctx.beginPath(); ctx.arc(px, py, 4 * sc, 0, Math.PI * 2); ctx.fillStyle = pg; ctx.fill();
            ctx.beginPath(); ctx.arc(px, py, 1.2 * sc, 0, Math.PI * 2); ctx.fillStyle = hsl(COLORS.white, lineA); ctx.fill();
          }
        }
      }

      // Render anchor glow (icons are HTML overlay for splash-identical look)
      for (const ti of techIcons) {
        const pA = 0.55 + Math.sin(ti.pulse) * 0.2;
        const c = colorPalette[ti.ci];
        const gR = (IS_MOBILE ? 5 : 7) * (0.9 + pA * 0.3) * sc;
        const gg = ctx.createRadialGradient(ti.x, ti.y, 0, ti.x, ti.y, gR);
        gg.addColorStop(0, hsl(c, 0.2 * anyA * pA));
        gg.addColorStop(0.7, hsl(c, 0.05 * anyA));
        gg.addColorStop(1, hsl(c, 0));
        ctx.beginPath(); ctx.arc(ti.x, ti.y, gR, 0, Math.PI * 2); ctx.fillStyle = gg; ctx.fill();
        ctx.beginPath(); ctx.arc(ti.x, ti.y, 1.1 * sc, 0, Math.PI * 2); ctx.fillStyle = hsl(COLORS.white, 0.5 * anyA); ctx.fill();
      }

      // ═══ L6.8: DNA NEURAL LABELS — "Il DNA Tecnologico" effect ═══
      const coreNode = dnaNodes[0];
      coreNode.x = cx; coreNode.y = cy; coreNode.pulse += 0.035;

      // Update satellite positions
      for (let i = 1; i < dnaNodes.length; i++) {
        const dn = dnaNodes[i];
        dn.orbitA += dn.orbitSp * 0.016;
        dn.pulse += 0.03;
        const baseR = Math.min(w, h) * dn.orbitR;
        const wobble = Math.sin(dn.orbitA * 3 + el * 1.5) * 4 * sc;
        dn.x = cx + Math.cos(dn.orbitA) * (baseR + wobble);
        dn.y = cy + Math.sin(dn.orbitA) * (baseR + wobble);
      }

      // Connection lines from AI CORE to satellites — animated dashes
      for (let i = 1; i < dnaNodes.length; i++) {
        const dn = dnaNodes[i];
        const dashOffset = (el * 30 + i * 8) % 16;
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.lineDashOffset = -dashOffset;
        ctx.moveTo(cx, cy); ctx.lineTo(dn.x, dn.y);
        ctx.strokeStyle = hsl(COLORS.violet, 0.18 * anyA);
        ctx.lineWidth = 0.7; ctx.stroke();
        ctx.setLineDash([]);

        // Data packet traveling to node
        const pktT = (el * 0.5 + i * 0.12) % 1;
        const pktX = cx + (dn.x - cx) * pktT;
        const pktY = cy + (dn.y - cy) * pktT;
        const pktA = Math.sin(pktT * Math.PI) * 0.6 * anyA;
        ctx.beginPath(); ctx.arc(pktX, pktY, 1.5 * sc, 0, Math.PI * 2);
        ctx.fillStyle = hsl(COLORS.violet, pktA); ctx.fill();
        const pktG = ctx.createRadialGradient(pktX, pktY, 0, pktX, pktY, 6 * sc);
        pktG.addColorStop(0, hsl(COLORS.violet, pktA * 0.5));
        pktG.addColorStop(1, hsl(COLORS.violet, 0));
        ctx.beginPath(); ctx.arc(pktX, pktY, 6 * sc, 0, Math.PI * 2); ctx.fillStyle = pktG; ctx.fill();
      }

      // Render all DNA nodes with labels
      const labelFS = IS_MOBILE ? 5 : 7;
      const coreLabelFS = IS_MOBILE ? 6 : 8;
      for (const dn of dnaNodes) {
        const pA = 0.7 + Math.sin(dn.pulse) * 0.2;
        const nodeR = dn.primary ? (IS_MOBILE ? 8 : 12) * sc : (IS_MOBILE ? 4 : 6) * sc;

        // Node glow
        const glowR = nodeR * 3;
        const ng = ctx.createRadialGradient(dn.x, dn.y, 0, dn.x, dn.y, glowR);
        ng.addColorStop(0, hsl(COLORS.violet, (dn.primary ? 0.4 : 0.2) * anyA * pA));
        ng.addColorStop(0.5, hsl(COLORS.violet, (dn.primary ? 0.12 : 0.05) * anyA));
        ng.addColorStop(1, hsl(COLORS.violet, 0));
        ctx.beginPath(); ctx.arc(dn.x, dn.y, glowR, 0, Math.PI * 2); ctx.fillStyle = ng; ctx.fill();

        // Node circle — gradient like landing page
        const ncg = ctx.createRadialGradient(dn.x, dn.y, 0, dn.x, dn.y, nodeR);
        if (dn.primary) {
          ncg.addColorStop(0, hsl(COLORS.violet, 0.9 * anyA));
          ncg.addColorStop(1, hsl(COLORS.gold, 0.6 * anyA));
        } else {
          ncg.addColorStop(0, hsl(COLORS.violet, 0.5 * anyA));
          ncg.addColorStop(1, hsl(COLORS.gold, 0.2 * anyA));
        }
        ctx.beginPath(); ctx.arc(dn.x, dn.y, nodeR * pA, 0, Math.PI * 2); ctx.fillStyle = ncg; ctx.fill();

        // Label text
        ctx.font = `700 ${dn.primary ? coreLabelFS : labelFS}px system-ui, sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.letterSpacing = "1.5px";
        ctx.fillStyle = dn.primary
          ? hsl(COLORS.violet, 0.85 * anyA)
          : hsl(COLORS.white, 0.4 * anyA);
        ctx.fillText(dn.label, dn.x, dn.y + nodeR * pA + 2 * sc);
        ctx.letterSpacing = "0px";
      }

      // ═══ L7: RADAR SWEEP — always present ═══
      const radarAngle = el * 0.8;
      const radarR = Math.min(w, h) * 0.42;
      const rGrad = ctx.createConicGradient(radarAngle, cx, cy);
      rGrad.addColorStop(0, hsl(COLORS.violet, 0));
      rGrad.addColorStop(0.03, hsl(COLORS.violet, 0.04 * anyA));
      rGrad.addColorStop(0.12, hsl(COLORS.violet, 0));
      rGrad.addColorStop(1, hsl(COLORS.violet, 0));
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, radarR, radarAngle, radarAngle + Math.PI * 0.25); ctx.closePath();
      ctx.fillStyle = rGrad; ctx.fill();

      // ═══ L8: TEXT MORPH — "EMPIRE AI GROUP" on touch release ═══
      const morph = morphRef.current;
      if (morph.active) {
        const mElapsed = (now - morph.startTime) / 1000;
        let mBlend = 0;
        if (mElapsed < 1.2) {
          mBlend = mElapsed / 1.2;
          mBlend = mBlend * mBlend * (3 - 2 * mBlend);
          morph.phase = "in";
        } else if (mElapsed < 6.5) {
          mBlend = 1;
          morph.phase = "hold";
        } else if (mElapsed < 7.5) {
          mBlend = 1 - (mElapsed - 6.5) / 1.0;
          mBlend = mBlend * mBlend * (3 - 2 * mBlend);
          morph.phase = "out";
        } else {
          morph.active = false;
          morph.phase = "idle";
          mBlend = 0;
        }

        if (mBlend > 0.01 && morph.textPts.length > 0) {
          const totalPts = morph.textPts.length;

          // Collect all animatable source positions
          const allSources: { x: number; y: number }[] = [];
          for (const f of floats) allSources.push({ x: f.x, y: f.y });
          for (const m of mesh) allSources.push({ x: m.x * w, y: m.y * h });
          for (const n of helix) allSources.push({ x: n.x * w, y: n.y * h });
          for (const ds of streams) {
            const baseR = Math.min(w, h) * 0.35 * ds.rMult;
            allSources.push({ x: cx + Math.cos(ds.angle) * baseR, y: cy + Math.sin(ds.angle) * baseR });
          }

          // ── Dark overlay for dramatic contrast ──
          ctx.save();
          ctx.fillStyle = `hsla(260,20%,4%,${mBlend * 0.6})`;
          ctx.fillRect(0, 0, w, h);
          ctx.restore();

          // ── Central aura glow — intense violet/gold ──
          const auraR = Math.min(w, h) * 0.48;
          const auraG = ctx.createRadialGradient(cx, cy, auraR * 0.05, cx, cy, auraR);
          auraG.addColorStop(0, hsl(COLORS.violet, 0.28 * mBlend));
          auraG.addColorStop(0.25, hsl(COLORS.gold, 0.1 * mBlend));
          auraG.addColorStop(0.5, hsl(COLORS.violet, 0.06 * mBlend));
          auraG.addColorStop(1, hsl(COLORS.violet, 0));
          ctx.beginPath(); ctx.arc(cx, cy, auraR, 0, Math.PI * 2);
          ctx.fillStyle = auraG; ctx.fill();

          // ── Agent labels radiating outward from center with circuit connections ──
          const AGENT_LABELS = ["AI ENGINE", "CRM", "BOOKING", "ANALYTICS", "MARKETING", "INVENTORY", "PAYMENTS", "VOICE AI"];
          const agentCount = AGENT_LABELS.length;
          const agentRadius = Math.min(w, h) * (IS_MOBILE ? 0.38 : 0.42);
          const agentLabelAlpha = mBlend * (morph.phase === "hold" ? 0.9 : Math.min(mBlend, 0.7));

          if (agentLabelAlpha > 0.05) {
            for (let ai = 0; ai < agentCount; ai++) {
              const agentAngle = (ai / agentCount) * Math.PI * 2 - Math.PI / 2;
              // Stagger appearance
              const agentDelay = ai * 0.08;
              const agentBlend = Math.max(0, Math.min(1, (mBlend - 0.2 - agentDelay) / 0.5));
              if (agentBlend < 0.01) continue;

              const easeBlend = agentBlend * agentBlend * (3 - 2 * agentBlend);
              const ax = cx + Math.cos(agentAngle) * agentRadius * easeBlend;
              const ay = cy + Math.sin(agentAngle) * agentRadius * easeBlend;

              // Circuit connection line from center to agent
              ctx.save();
              // Solid circuit trace (L-shaped)
              ctx.strokeStyle = hsl(COLORS.violet, 0.5 * easeBlend);
              ctx.lineWidth = 1.2;
              ctx.lineCap = "square";
              const midX = cx + Math.cos(agentAngle) * agentRadius * 0.4 * easeBlend;
              const midY = cy + Math.sin(agentAngle) * agentRadius * 0.4 * easeBlend;
              ctx.beginPath();
              ctx.moveTo(cx, cy);
              // L-shaped circuit path
              if (Math.abs(Math.cos(agentAngle)) > Math.abs(Math.sin(agentAngle))) {
                ctx.lineTo(midX, cy);
                ctx.lineTo(midX, ay);
                ctx.lineTo(ax, ay);
              } else {
                ctx.lineTo(cx, midY);
                ctx.lineTo(ax, midY);
                ctx.lineTo(ax, ay);
              }
              ctx.stroke();

              // Animated dashed overlay on circuit
              ctx.setLineDash([4, 3]);
              ctx.lineDashOffset = -(el * 40 + ai * 15);
              ctx.strokeStyle = hsl(COLORS.gold, 0.55 * easeBlend);
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(cx, cy);
              if (Math.abs(Math.cos(agentAngle)) > Math.abs(Math.sin(agentAngle))) {
                ctx.lineTo(midX, cy); ctx.lineTo(midX, ay); ctx.lineTo(ax, ay);
              } else {
                ctx.lineTo(cx, midY); ctx.lineTo(ax, midY); ctx.lineTo(ax, ay);
              }
              ctx.stroke();
              ctx.setLineDash([]);
              ctx.restore();

              // Junction dot at endpoint
              const jR = 3 * sc;
              const jGrad = ctx.createRadialGradient(ax, ay, 0, ax, ay, jR * 4);
              jGrad.addColorStop(0, hsl(COLORS.violet, 0.8 * easeBlend));
              jGrad.addColorStop(0.4, hsl(COLORS.gold, 0.3 * easeBlend));
              jGrad.addColorStop(1, hsl(COLORS.violet, 0));
              ctx.beginPath(); ctx.arc(ax, ay, jR * 4, 0, Math.PI * 2); ctx.fillStyle = jGrad; ctx.fill();
              ctx.beginPath(); ctx.arc(ax, ay, jR, 0, Math.PI * 2); ctx.fillStyle = hsl(COLORS.violet, 0.95 * easeBlend); ctx.fill();
              ctx.beginPath(); ctx.arc(ax, ay, jR * 0.4, 0, Math.PI * 2); ctx.fillStyle = `hsla(0,0%,100%,${0.9 * easeBlend})`; ctx.fill();

              // Agent label text
              ctx.save();
              const labelFS = Math.min(w * 0.032, IS_MOBILE ? 8 : 10);
              ctx.font = `700 ${labelFS}px system-ui, -apple-system, sans-serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.shadowColor = hsl(COLORS.violet, 0.5);
              ctx.shadowBlur = 8;
              ctx.fillStyle = hsl(COLORS.gold, 0.85 * easeBlend);
              // Position label slightly outward from the dot
              const labelR = agentRadius * 1.12 * easeBlend;
              const lx = cx + Math.cos(agentAngle) * labelR;
              const ly = cy + Math.sin(agentAngle) * labelR;
              ctx.fillText(AGENT_LABELS[ai], lx, ly);
              ctx.restore();

              // Data pulse traveling along circuit
              const pulseT = ((el * 1.2 + ai * 0.5) % 1.5) / 1.5;
              if (pulseT < 1) {
                let ppx: number, ppy: number;
                if (pulseT < 0.4) {
                  const t2 = pulseT / 0.4;
                  if (Math.abs(Math.cos(agentAngle)) > Math.abs(Math.sin(agentAngle))) {
                    ppx = cx + (midX - cx) * t2; ppy = cy;
                  } else { ppx = cx; ppy = cy + (midY - cy) * t2; }
                } else {
                  const t2 = (pulseT - 0.4) / 0.6;
                  if (Math.abs(Math.cos(agentAngle)) > Math.abs(Math.sin(agentAngle))) {
                    ppx = midX; ppy = cy + (ay - cy) * Math.min(t2 * 1.5, 1);
                    if (t2 > 0.67) ppx = midX + (ax - midX) * ((t2 - 0.67) * 3);
                  } else {
                    ppx = cx + (ax - cx) * Math.min(t2 * 1.5, 1); ppy = midY;
                    if (t2 > 0.67) ppy = midY + (ay - midY) * ((t2 - 0.67) * 3);
                  }
                }
                const dpg2 = ctx.createRadialGradient(ppx, ppy, 0, ppx, ppy, 6 * sc);
                dpg2.addColorStop(0, `hsla(0,0%,100%,${0.95 * easeBlend})`);
                dpg2.addColorStop(0.3, hsl(COLORS.gold, 0.7 * easeBlend));
                dpg2.addColorStop(1, hsl(COLORS.violet, 0));
                ctx.beginPath(); ctx.arc(ppx, ppy, 6 * sc, 0, Math.PI * 2); ctx.fillStyle = dpg2; ctx.fill();
                ctx.beginPath(); ctx.arc(ppx, ppy, 1.5 * sc, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(0,0%,100%,${0.95 * easeBlend})`; ctx.fill();
              }
            }
          }

          // ── Circuit trace connections between text points ──
          ctx.save();
          const traceCount = Math.min(totalPts, 60);
          ctx.globalAlpha = mBlend * 0.4;
          ctx.strokeStyle = hsl(COLORS.violet, 0.35);
          ctx.lineWidth = 0.8;
          ctx.lineCap = "square";
          for (let i = 0; i < traceCount - 1; i += 2) {
            const a = morph.textPts[i], b = morph.textPts[i + 1];
            ctx.beginPath(); ctx.moveTo(a.x, a.y);
            if (i % 4 === 0) { ctx.lineTo(b.x, a.y); ctx.lineTo(b.x, b.y); }
            else { ctx.lineTo(a.x, b.y); ctx.lineTo(b.x, b.y); }
            ctx.stroke();
          }
          ctx.setLineDash([4, 3]);
          ctx.lineDashOffset = -(el * 50);
          ctx.globalAlpha = mBlend * 0.25;
          ctx.strokeStyle = hsl(COLORS.gold, 0.5);
          ctx.lineWidth = 0.5;
          for (let i = 0; i < traceCount - 1; i += 2) {
            const a = morph.textPts[i], b = morph.textPts[i + 1];
            ctx.beginPath(); ctx.moveTo(a.x, a.y);
            if (i % 4 === 0) { ctx.lineTo(b.x, a.y); ctx.lineTo(b.x, b.y); }
            else { ctx.lineTo(a.x, b.y); ctx.lineTo(b.x, b.y); }
            ctx.stroke();
          }
          ctx.setLineDash([]);
          ctx.restore();

          // ── Morphed particles converging to text form ──
          for (let i = 0; i < totalPts; i++) {
            const target = morph.textPts[i];
            const src = allSources[i % allSources.length];
            const px = src.x + (target.x - src.x) * mBlend;
            const py = src.y + (target.y - src.y) * mBlend;
            const ci = i % 4;
            const c = colorPalette[ci];
            const pulse = Math.sin(el * 3 + i * 0.25) * 0.3 + 0.7;
            const nodeR = (1.8 + pulse * 1.5) * sc;

            // Glow halo
            const glR = nodeR * 5;
            const gg = ctx.createRadialGradient(px, py, 0, px, py, glR);
            gg.addColorStop(0, hsl(c, 0.65 * mBlend * pulse));
            gg.addColorStop(0.3, hsl(COLORS.violet, 0.2 * mBlend));
            gg.addColorStop(1, hsl(c, 0));
            ctx.beginPath(); ctx.arc(px, py, glR, 0, Math.PI * 2); ctx.fillStyle = gg; ctx.fill();

            // Core dot
            ctx.beginPath(); ctx.arc(px, py, nodeR, 0, Math.PI * 2);
            ctx.fillStyle = hsl(c, 0.9 * mBlend); ctx.fill();

            // White center
            ctx.beginPath(); ctx.arc(px, py, nodeR * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(0,0%,100%,${0.8 * mBlend * pulse})`; ctx.fill();

            // During decompose (in phase), draw trail lines back to source
            if (morph.phase === "in" && i % 6 === 0) {
              ctx.strokeStyle = hsl(c, 0.15 * mBlend);
              ctx.lineWidth = 0.5;
              ctx.beginPath(); ctx.moveTo(src.x, src.y); ctx.lineTo(px, py); ctx.stroke();
            }
          }

          // ── Premium "EMPIRE AI GROUP" text — centered, large, glowing ──
          if (mBlend > 0.35) {
            const textAlpha = morph.phase === "hold" ? 0.9 : Math.min((mBlend - 0.35) / 0.3, 1) * 0.9;
            ctx.save();
            const tFS = Math.min(w * 0.08, IS_MOBILE ? 16 : 24);
            ctx.font = `800 ${tFS}px system-ui, -apple-system, sans-serif`;
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.letterSpacing = "2px";
            // Outer glow pass
            ctx.shadowColor = hsl(COLORS.violet, 0.7);
            ctx.shadowBlur = 25;
            ctx.fillStyle = hsl(COLORS.violet, textAlpha * 0.6);
            ctx.fillText("EMPIRE AI GROUP", cx, cy);
            // Inner bright pass
            ctx.shadowBlur = 10;
            ctx.shadowColor = hsl(COLORS.gold, 0.5);
            ctx.fillStyle = `hsla(0,0%,96%,${textAlpha * 0.85})`;
            ctx.fillText("EMPIRE AI GROUP", cx, cy);
            ctx.restore();

            // Animated underline circuit
            const ulW = tFS * 6.5;
            const ulY = cy + tFS * 0.65;
            ctx.strokeStyle = hsl(COLORS.gold, 0.35 * textAlpha);
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(cx - ulW / 2, ulY); ctx.lineTo(cx + ulW / 2, ulY); ctx.stroke();
            ctx.setLineDash([4, 3]); ctx.lineDashOffset = -(el * 35);
            ctx.strokeStyle = hsl(COLORS.violet, 0.5 * textAlpha);
            ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.moveTo(cx - ulW / 2, ulY); ctx.lineTo(cx + ulW / 2, ulY); ctx.stroke();
            ctx.setLineDash([]);

            // Subtitle
            if (morph.phase === "hold") {
              const subFS = tFS * 0.35;
              ctx.font = `600 ${subFS}px system-ui, -apple-system, sans-serif`;
              ctx.fillStyle = hsl(COLORS.gold, 0.5 * textAlpha);
              ctx.textAlign = "center";
              ctx.fillText("INTELLIGENT BUSINESS PLATFORM", cx, cy + tFS * 1.1);
            }
          }

          // ── Pulse rings during hold ──
          if (morph.phase === "hold") {
            for (let pr = 0; pr < 4; pr++) {
              const prPhase = ((el * 0.35 + pr * 0.8) % 3) / 3;
              const prR = prPhase * Math.min(w, h) * 0.35;
              const prA = (1 - prPhase) * 0.1 * mBlend;
              ctx.strokeStyle = hsl(COLORS.violet, prA);
              ctx.lineWidth = 0.6;
              ctx.beginPath(); ctx.arc(cx, cy, prR, 0, Math.PI * 2); ctx.stroke();
            }
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [size]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerRef.current.x = e.clientX - rect.left;
    pointerRef.current.y = e.clientY - rect.top;
    pointerRef.current.active = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    const morph = morphRef.current;
    if (morph.active) return; // already morphing
    const totalParticles = FLOAT_PARTICLES + MESH_COUNT + HELIX_NODES + DATA_STREAMS;
    const pts = sampleTextPoints("EMPIRE AI GROUP", size, size, totalParticles);
    if (pts.length < 10) return;
    morph.textPts = pts;
    morph.startTime = performance.now();
    morph.active = true;
    morph.phase = "in";
  }, [size]);

  return (
    <div className="relative touch-none" style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="absolute inset-0 touch-none"
        style={{ width: size, height: size }}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => { pointerRef.current.active = false; }}
      />

      <div className="pointer-events-none absolute inset-0">
        {TECH_ICON_SET.slice(0, TECH_ICON_COUNT).map(({ Icon, color, glow }, i) => (
          <div
            key={`sphere-tech-icon-${i}`}
            ref={(el) => { iconRefs.current[i] = el; }}
            className="absolute flex items-center justify-center rounded-md border"
            style={{
              width: IS_MOBILE ? 18 : 22,
              height: IS_MOBILE ? 18 : 22,
              background: "hsla(260,15%,8%,0.88)",
              borderColor: "hsla(265,40%,45%,0.25)",
              backdropFilter: "blur(4px)",
              color,
              boxShadow: `0 0 10px ${glow}, inset 0 0 4px hsla(265,30%,35%,0.1)`,
              transform: "translate(-50%, -50%)",
              opacity: 0,
            }}
          >
            <Icon style={{ width: IS_MOBILE ? 10 : 12, height: IS_MOBILE ? 10 : 12 }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveParticleSphere;
