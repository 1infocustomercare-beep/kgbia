import { useEffect, useRef, useState } from "react";

/**
 * Empire Background v12 — AI Neural Circuit
 * Professional tech aesthetic: orthogonal circuit traces, neural network nodes,
 * data-flow particles along straight/angled paths, subtle grid underlay.
 * No spirals, no helixes, no biological shapes.
 */

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

const NODE_COUNT = IS_MOBILE ? 50 : 100;
const CIRCUIT_LINES = IS_MOBILE ? 12 : 24;
const DATA_PARTICLES = IS_MOBILE ? 18 : 40;
const GRID_SPACING = IS_MOBILE ? 50 : 60;

type Pt = { x: number; y: number };

interface CircuitPath {
  points: Pt[];
  speed: number;
  phase: number;
}

interface DataParticle {
  pathIdx: number;
  progress: number;
  speed: number;
  size: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const hsl = (h: number, s: number, l: number, a: number) => `hsla(${h},${s}%,${l}%,${a})`;

const EmpireDNABackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const [ready, setReady] = useState(false);
  const timeRef = useRef(0);
  const nodesRef = useRef<Pt[]>([]);
  const circuitsRef = useRef<CircuitPath[]>([]);
  const particlesRef = useRef<DataParticle[]>([]);
  const ptrRef = useRef<{ x: number; y: number; active: boolean }>({ x: -999, y: -999, active: false });

  useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t); }, []);

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
      generateLayout();
    };

    const generateLayout = () => {
      if (!w || !h) return;

      // Generate grid-snapped nodes (circuit junctions)
      const nodes: Pt[] = [];
      const cols = Math.floor(w / GRID_SPACING);
      const rows = Math.floor(h / GRID_SPACING);
      for (let i = 0; i < NODE_COUNT; i++) {
        const col = Math.floor(Math.random() * cols);
        const row = Math.floor(Math.random() * rows);
        nodes.push({
          x: (col + 0.5) * GRID_SPACING + (Math.random() - 0.5) * 8,
          y: (row + 0.5) * GRID_SPACING + (Math.random() - 0.5) * 8,
        });
      }
      nodesRef.current = nodes;

      // Generate circuit paths (orthogonal/45° traces between nodes)
      const circuits: CircuitPath[] = [];
      for (let i = 0; i < CIRCUIT_LINES; i++) {
        const startIdx = Math.floor(Math.random() * nodes.length);
        const start = nodes[startIdx];
        const segments = 2 + Math.floor(Math.random() * 4);
        const points: Pt[] = [{ ...start }];

        let cx = start.x, cy = start.y;
        for (let s = 0; s < segments; s++) {
          // Choose orthogonal or 45° direction
          const dirs = [
            { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
            { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
            { dx: 1, dy: 1 }, { dx: -1, dy: -1 },
            { dx: 1, dy: -1 }, { dx: -1, dy: 1 },
          ];
          const dir = dirs[Math.floor(Math.random() * dirs.length)];
          const len = (2 + Math.floor(Math.random() * 5)) * GRID_SPACING;
          cx = Math.max(20, Math.min(w - 20, cx + dir.dx * len));
          cy = Math.max(20, Math.min(h - 20, cy + dir.dy * len));
          points.push({ x: cx, y: cy });
        }

        circuits.push({
          points,
          speed: 0.002 + Math.random() * 0.004,
          phase: Math.random() * Math.PI * 2,
        });
      }
      circuitsRef.current = circuits;

      // Generate data particles
      const particles: DataParticle[] = [];
      for (let i = 0; i < DATA_PARTICLES; i++) {
        particles.push({
          pathIdx: Math.floor(Math.random() * circuits.length),
          progress: Math.random(),
          speed: 0.001 + Math.random() * 0.003,
          size: 1 + Math.random() * 2,
        });
      }
      particlesRef.current = particles;
    };

    resize();
    window.addEventListener("resize", resize);

    // Color palette — cool blue-grey, desaturated, professional
    const HUE = 215;
    const SAT = 10;

    const getPointOnPath = (path: Pt[], t: number): Pt => {
      const totalSegs = path.length - 1;
      if (totalSegs <= 0) return path[0];
      const seg = Math.min(Math.floor(t * totalSegs), totalSegs - 1);
      const localT = (t * totalSegs) - seg;
      return {
        x: lerp(path[seg].x, path[seg + 1].x, localT),
        y: lerp(path[seg].y, path[seg + 1].y, localT),
      };
    };

    const animate = () => {
      if (!w || !h) { animRef.current = requestAnimationFrame(animate); return; }
      timeRef.current += 0.016;
      const time = timeRef.current;
      ctx.clearRect(0, 0, w, h);

      const ptr = ptrRef.current;
      const nodes = nodesRef.current;
      const circuits = circuitsRef.current;
      const particles = particlesRef.current;

      // ═══ L0: SUBTLE DOT GRID ═══
      ctx.fillStyle = hsl(HUE, SAT, 40, 0.04);
      const gridStep = GRID_SPACING;
      for (let gx = gridStep * 0.5; gx < w; gx += gridStep) {
        for (let gy = gridStep * 0.5; gy < h; gy += gridStep) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ═══ L1: CIRCUIT TRACES ═══
      for (let ci = 0; ci < circuits.length; ci++) {
        const c = circuits[ci];
        const pulse = 0.5 + Math.sin(time * 0.8 + c.phase) * 0.5;
        const baseAlpha = 0.035 + pulse * 0.025;

        ctx.strokeStyle = hsl(HUE, SAT + 4, 45, baseAlpha);
        ctx.lineWidth = 0.8;
        ctx.lineCap = "square";
        ctx.lineJoin = "miter";
        ctx.beginPath();
        ctx.moveTo(c.points[0].x, c.points[0].y);
        for (let pi = 1; pi < c.points.length; pi++) {
          ctx.lineTo(c.points[pi].x, c.points[pi].y);
        }
        ctx.stroke();

        // Junction dots at bends
        for (let pi = 0; pi < c.points.length; pi++) {
          const p = c.points[pi];
          const jSize = pi === 0 || pi === c.points.length - 1 ? 2 : 1.5;
          ctx.fillStyle = hsl(HUE, SAT + 6, 50, baseAlpha * 2);
          ctx.fillRect(p.x - jSize / 2, p.y - jSize / 2, jSize, jSize);
        }
      }

      // ═══ L2: NEURAL NETWORK CONNECTIONS (node-to-node) ═══
      const maxDist = IS_MOBILE ? 110 : 150;
      ctx.lineCap = "round";
      for (let i = 0; i < nodes.length; i++) {
        const limitJ = Math.min(i + (IS_MOBILE ? 5 : 8), nodes.length);
        for (let j = i + 1; j < limitJ; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxDist) {
            const alpha = Math.pow(1 - d / maxDist, 2);
            const breathe = 0.5 + Math.sin(time * 1.2 + i * 0.3 + j * 0.2) * 0.5;
            ctx.strokeStyle = hsl(HUE, SAT, 45, alpha * 0.06 * breathe);
            ctx.lineWidth = 0.4 + alpha * 0.4;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // ═══ L3: NODES — small squares and crosses (no circles) ═══
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const breathe = 0.4 + Math.sin(time * 1.0 + i * 0.7) * 0.6;
        let na = 0.1 * breathe;

        // Pointer proximity boost
        if (ptr.active) {
          const dx = n.x - ptr.x, dy = n.y - ptr.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) na += (1 - d / 120) * 0.3;
        }

        if (i % 3 === 0) {
          // Cross node (+)
          const arm = 3 + breathe * 2;
          ctx.strokeStyle = hsl(HUE, SAT + 8, 52, na + 0.12);
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(n.x - arm, n.y); ctx.lineTo(n.x + arm, n.y);
          ctx.moveTo(n.x, n.y - arm); ctx.lineTo(n.x, n.y + arm);
          ctx.stroke();
        } else {
          // Square node
          const s = 1.5 + breathe;
          ctx.fillStyle = hsl(HUE, SAT + 6, 50, na + 0.12);
          ctx.fillRect(n.x - s / 2, n.y - s / 2, s, s);
        }

        // Subtle glow for key nodes
        if (i % 6 === 0) {
          const gr = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 20);
          gr.addColorStop(0, hsl(HUE, SAT + 12, 55, na * 0.5));
          gr.addColorStop(1, hsl(HUE, SAT, 50, 0));
          ctx.fillStyle = gr;
          ctx.fillRect(n.x - 20, n.y - 20, 40, 40);
        }
      }

      // ═══ L4: DATA FLOW PARTICLES along circuit traces ═══
      for (let pi = 0; pi < particles.length; pi++) {
        const p = particles[pi];
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
          p.pathIdx = Math.floor(Math.random() * circuits.length);
        }

        const circuit = circuits[p.pathIdx];
        if (!circuit || circuit.points.length < 2) continue;

        const pos = getPointOnPath(circuit.points, p.progress);
        const fadeAlpha = Math.sin(p.progress * Math.PI) * 0.45;

        // Glow trail
        const tg = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 8);
        tg.addColorStop(0, hsl(HUE, SAT + 15, 58, fadeAlpha * 0.5));
        tg.addColorStop(1, hsl(HUE, SAT, 50, 0));
        ctx.fillStyle = tg;
        ctx.fillRect(pos.x - 8, pos.y - 8, 16, 16);

        // Core particle (square)
        const ps = p.size;
        ctx.fillStyle = hsl(HUE, SAT + 12, 60, fadeAlpha + 0.1);
        ctx.fillRect(pos.x - ps / 2, pos.y - ps / 2, ps, ps);
      }

      // ═══ L5: HORIZONTAL SCAN LINE ═══
      const scanY = h * (0.5 + Math.sin(time * 0.06) * 0.48);
      const scanGrad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      scanGrad.addColorStop(0, hsl(HUE, SAT, 50, 0));
      scanGrad.addColorStop(0.5, hsl(HUE, SAT + 5, 50, 0.018));
      scanGrad.addColorStop(1, hsl(HUE, SAT, 50, 0));
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 40, w, 80);

      // ═══ L6: VERTICAL DATA STREAMS (matrix-like, subtle) ═══
      const streamCount = IS_MOBILE ? 4 : 8;
      for (let si = 0; si < streamCount; si++) {
        const sx = w * (0.1 + (si / streamCount) * 0.8) + Math.sin(si * 2.7) * 30;
        const streamPhase = (time * 0.15 + si * 1.3) % 1;
        const streamLen = h * 0.15;
        const sy = streamPhase * (h + streamLen) - streamLen;

        const streamGrad = ctx.createLinearGradient(sx, sy, sx, sy + streamLen);
        streamGrad.addColorStop(0, hsl(HUE, SAT + 8, 50, 0));
        streamGrad.addColorStop(0.5, hsl(HUE, SAT + 8, 52, 0.04));
        streamGrad.addColorStop(1, hsl(HUE, SAT + 8, 50, 0));
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
