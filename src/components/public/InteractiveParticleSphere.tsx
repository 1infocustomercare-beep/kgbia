import { useRef, useEffect, useCallback } from "react";

/**
 * InteractiveParticleSphere v3 — Unified DNA + Data Flow Entity
 *
 * Combines the splash DNA helix with flowing data lines that communicate
 * between nodes. One single living organism: rotating double helix with
 * neural mesh, circuit data paths, energy particles, and data streams
 * all interconnected. No separate effects — everything is one system.
 */

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

const HELIX_NODES = IS_MOBILE ? 52 : 80;
const MESH_COUNT = IS_MOBILE ? 20 : 38;
const ENERGY_PARTICLES = IS_MOBILE ? 14 : 28;
const DATA_STREAMS = IS_MOBILE ? 6 : 14;
const CIRCUIT_PATHS = IS_MOBILE ? 10 : 20;

const COLORS = {
  gold: { h: 38, s: 50, l: 55 },
  violet: { h: 265, s: 75, l: 62 },
  green: { h: 160, s: 55, l: 48 },
  cyan: { h: 195, s: 70, l: 55 },
};

const palette = [COLORS.violet, COLORS.gold, COLORS.green];

const hsl = (c: { h: number; s: number; l: number }, a: number) =>
  `hsla(${c.h},${c.s}%,${c.l}%,${a})`;

interface DataStream {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  ci: number;
}

interface CircuitPath {
  segments: { x: number; y: number }[];
  progress: number;
  speed: number;
  life: number;
  maxLife: number;
  ci: number;
}

function spawnCircuit(w: number, h: number, ci: number): CircuitPath {
  const segs: { x: number; y: number }[] = [];
  let x = Math.random() * w, y = Math.random() * h;
  segs.push({ x, y });
  const steps = 3 + Math.floor(Math.random() * 4);
  for (let s = 0; s < steps; s++) {
    const horiz = Math.random() > 0.5;
    const dist = 20 + Math.random() * (w * 0.25);
    if (horiz) x += (Math.random() > 0.5 ? 1 : -1) * dist;
    else y += (Math.random() > 0.5 ? 1 : -1) * dist;
    x = Math.max(5, Math.min(w - 5, x));
    y = Math.max(5, Math.min(h - 5, y));
    segs.push({ x, y });
  }
  return { segments: segs, progress: 0, speed: 0.003 + Math.random() * 0.005, life: 0, maxLife: 200 + Math.random() * 300, ci };
}

const InteractiveParticleSphere = ({ size = 280 }: { size?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const pointerRef = useRef({ x: size / 2, y: size / 2, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = size, h = size;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const turns = 5;
    const cx = w / 2, cy = h / 2;
    const scale = Math.min(w, h) / (IS_MOBILE ? 400 : 600);

    // ── Mesh nodes (neural dust) ──
    const meshNodes = Array.from({ length: MESH_COUNT }, (_, i) => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0004,
      vy: (Math.random() - 0.5) * 0.0004,
      r: 0.8 + Math.random() * 1,
      ci: i % 3,
    }));

    // ── DNA Helix nodes ──
    const helixNodes = Array.from({ length: HELIX_NODES }, (_, i) => {
      const t = i / HELIX_NODES;
      const angle = t * Math.PI * 2 * turns;
      const strand = i % 2 === 0 ? 1 : -1;
      return {
        ty: 0.05 + t * 0.9,
        baseAngle: angle,
        strand,
        ci: i % 3,
        r: i % 3 === 1 ? 2.8 : 2,
        glow: i % 5 === 0,
      };
    });

    // ── Energy particles flowing on helix ──
    const energyParticles = Array.from({ length: ENERGY_PARTICLES }, (_, i) => ({
      t: Math.random(),
      speed: 0.06 + Math.random() * 0.1,
      strand: Math.random() > 0.5 ? 1 : -1,
      ci: i % 3,
    }));

    // ── Circuit data paths (orthogonal lines) ──
    const circuits: CircuitPath[] = Array.from({ length: CIRCUIT_PATHS }, (_, i) =>
      spawnCircuit(w, h, i % 3)
    );

    // ── Data streams between helix nodes ──
    const dataStreams: DataStream[] = Array.from({ length: DATA_STREAMS }, (_, i) => ({
      fromNode: Math.floor(Math.random() * HELIX_NODES),
      toNode: Math.floor(Math.random() * MESH_COUNT),
      progress: Math.random(),
      speed: 0.4 + Math.random() * 0.6,
      ci: i % 3,
    }));

    const startTime = performance.now();
    let lastFrame = 0;
    const FRAME_INTERVAL = IS_MOBILE ? 22 : 0;

    const draw = (now: number) => {
      if (IS_MOBILE && now - lastFrame < FRAME_INTERVAL) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrame = now;

      const elapsed = (now - startTime) / 1000;
      const ptr = pointerRef.current;
      const helixRotation = elapsed * 0.45;
      const repelR = w * 0.18;
      const amp = 0.18;

      ctx.clearRect(0, 0, w, h);

      // ═══ L0: CIRCUIT DATA PATHS — orthogonal tech lines ═══
      for (let ci = 0; ci < circuits.length; ci++) {
        const ct = circuits[ci];
        ct.progress = Math.min(ct.progress + ct.speed, 1);
        ct.life++;
        if (ct.life > ct.maxLife || ct.progress >= 1) {
          circuits[ci] = spawnCircuit(w, h, ci % 3);
          continue;
        }

        const segs = ct.segments;
        let totalLen = 0;
        for (let si = 1; si < segs.length; si++)
          totalLen += Math.hypot(segs[si].x - segs[si - 1].x, segs[si].y - segs[si - 1].y);
        const drawLen = totalLen * ct.progress;

        const c = palette[ct.ci];
        ctx.beginPath();
        ctx.strokeStyle = hsl(c, 0.08);
        ctx.lineWidth = 0.5;
        ctx.setLineDash([3, 6]);
        let acc = 0;
        ctx.moveTo(segs[0].x, segs[0].y);
        let headX = segs[0].x, headY = segs[0].y, headAngle = 0;
        for (let si = 1; si < segs.length; si++) {
          const segLen = Math.hypot(segs[si].x - segs[si - 1].x, segs[si].y - segs[si - 1].y);
          if (acc + segLen <= drawLen) {
            ctx.lineTo(segs[si].x, segs[si].y);
            headX = segs[si].x; headY = segs[si].y;
            headAngle = Math.atan2(segs[si].y - segs[si - 1].y, segs[si].x - segs[si - 1].x);
            acc += segLen;
          } else {
            const f = (drawLen - acc) / segLen;
            headX = segs[si - 1].x + (segs[si].x - segs[si - 1].x) * f;
            headY = segs[si - 1].y + (segs[si].y - segs[si - 1].y) * f;
            headAngle = Math.atan2(segs[si].y - segs[si - 1].y, segs[si].x - segs[si - 1].x);
            ctx.lineTo(headX, headY);
            break;
          }
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Head dash (not circle)
        const hl = 4;
        ctx.beginPath();
        ctx.moveTo(headX - Math.cos(headAngle) * hl, headY - Math.sin(headAngle) * hl);
        ctx.lineTo(headX + Math.cos(headAngle) * hl, headY + Math.sin(headAngle) * hl);
        ctx.strokeStyle = hsl(c, 0.35);
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // ═══ L1: NEURAL MESH — floating nodes + connections ═══
      const meshPositions: { x: number; y: number }[] = [];
      for (const n of meshNodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0.02 || n.x > 0.98) n.vx *= -1;
        if (n.y < 0.02 || n.y > 0.98) n.vy *= -1;
        meshPositions.push({ x: n.x * w, y: n.y * h });

        // Tiny cross mark (not circle)
        const sz = n.r;
        const mx = n.x * w, my = n.y * h;
        ctx.strokeStyle = hsl(palette[n.ci], 0.12);
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        ctx.moveTo(mx - sz, my); ctx.lineTo(mx + sz, my);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mx, my - sz); ctx.lineTo(mx, my + sz);
        ctx.stroke();
      }

      // Mesh connections
      const checkR = IS_MOBILE ? 5 : 7;
      for (let i = 0; i < meshNodes.length; i++) {
        for (let j = i + 1; j < Math.min(i + checkR, meshNodes.length); j++) {
          const dx = meshNodes[i].x - meshNodes[j].x;
          const dy = meshNodes[i].y - meshNodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.2) {
            ctx.beginPath();
            ctx.moveTo(meshNodes[i].x * w, meshNodes[i].y * h);
            ctx.lineTo(meshNodes[j].x * w, meshNodes[j].y * h);
            ctx.strokeStyle = hsl(palette[meshNodes[i].ci], (1 - dist / 0.2) * 0.06);
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        }
      }

      // ═══ L2: DNA DOUBLE HELIX ═══
      const helixPositions: { x: number; y: number }[] = [];

      for (const n of helixNodes) {
        const rotAngle = n.baseAngle + helixRotation;
        const ampVar = amp + Math.sin(n.ty * Math.PI) * 0.06;
        let nx = (0.5 + Math.sin(rotAngle) * ampVar * n.strand) * w;
        let ny = n.ty * h;

        if (ptr.active) {
          const dx = nx - ptr.x, dy = ny - ptr.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 1 && dist < repelR) {
            const force = (1 - dist / repelR) * 16;
            nx += (dx / dist) * force;
            ny += (dy / dist) * force;
          }
        }
        helixPositions.push({ x: nx, y: ny });
      }

      // Backbone lines
      for (let i = 0; i < helixPositions.length - 1; i++) {
        const a = helixPositions[i], b = helixPositions[i + 1];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < w * 0.14) {
          const alpha = (1 - dist / (w * 0.14)) * 0.3;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = hsl(palette[helixNodes[i].ci], alpha);
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }

      // Cross-connections (base pairs)
      for (let i = 0; i < helixNodes.length - 1; i += 2) {
        if (i + 1 < helixNodes.length && helixNodes[i].strand !== helixNodes[i + 1].strand) {
          const a = helixPositions[i], b = helixPositions[i + 1];
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = hsl(palette[(i / 2) % 3], 0.08);
          ctx.lineWidth = 0.35;
          ctx.stroke();
        }
      }

      // Helix node marks — small crosses with subtle glow lines
      helixNodes.forEach((n, i) => {
        const p = helixPositions[i];
        const c = palette[n.ci];
        const sz = n.r * scale * 0.6;

        if (n.glow) {
          // Radial line burst (not circle)
          const rays = 4;
          const rayLen = sz * 3;
          const breathe = 0.15 + Math.sin(elapsed * 2 + i) * 0.1;
          for (let r = 0; r < rays; r++) {
            const angle = (r / rays) * Math.PI + elapsed * 0.3 + i * 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + Math.cos(angle) * rayLen, p.y + Math.sin(angle) * rayLen);
            ctx.strokeStyle = hsl(c, breathe);
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        }

        // Node cross
        ctx.strokeStyle = hsl(c, 0.7);
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(p.x - sz, p.y); ctx.lineTo(p.x + sz, p.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - sz); ctx.lineTo(p.x, p.y + sz);
        ctx.stroke();
      });

      // ═══ L3: ENERGY PARTICLES flowing on helix strands ═══
      for (const ep of energyParticles) {
        ep.t = (ep.t + ep.speed * 0.016) % 1;
        const angle = ep.t * Math.PI * 2 * turns + helixRotation;
        const ampVar = amp + Math.sin(ep.t * Math.PI) * 0.06;
        const epx = (0.5 + Math.sin(angle) * ampVar * ep.strand) * w;
        const epy = (0.05 + ep.t * 0.9) * h;
        const epAlpha = 0.45 * Math.sin(ep.t * Math.PI);
        const c = palette[ep.ci];

        // Directional dash (not circle)
        const dir = Math.atan2(
          Math.cos(angle) * ampVar * ep.strand,
          0.9 / HELIX_NODES
        );
        const dashLen = 4 * scale;
        ctx.beginPath();
        ctx.moveTo(epx - Math.cos(dir) * dashLen, epy - Math.sin(dir) * dashLen);
        ctx.lineTo(epx + Math.cos(dir) * dashLen, epy + Math.sin(dir) * dashLen);
        ctx.strokeStyle = hsl(c, epAlpha);
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Trail
        for (let tr = 1; tr <= 3; tr++) {
          const tOff = ep.t - tr * 0.015;
          if (tOff < 0) continue;
          const tAngle = tOff * Math.PI * 2 * turns + helixRotation;
          const tAmp = amp + Math.sin(tOff * Math.PI) * 0.06;
          const tx = (0.5 + Math.sin(tAngle) * tAmp * ep.strand) * w;
          const ty = (0.05 + tOff * 0.9) * h;
          ctx.beginPath();
          ctx.moveTo(tx - 1.5, ty);
          ctx.lineTo(tx + 1.5, ty);
          ctx.strokeStyle = hsl(c, epAlpha * (0.3 - tr * 0.08));
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // ═══ L4: DATA STREAMS — lines connecting helix to mesh (communication) ═══
      for (const ds of dataStreams) {
        ds.progress = (ds.progress + ds.speed * 0.016) % 1;
        const from = helixPositions[ds.fromNode % helixPositions.length];
        const to = meshPositions[ds.toNode % meshPositions.length];
        if (!from || !to) continue;

        const c = palette[ds.ci];
        const fadeAlpha = Math.sin(ds.progress * Math.PI) * 0.12;

        // Faint connection line
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        const midX = (from.x + to.x) / 2 + Math.sin(elapsed + ds.fromNode) * 10;
        const midY = (from.y + to.y) / 2 + Math.cos(elapsed + ds.toNode) * 8;
        ctx.quadraticCurveTo(midX, midY, to.x, to.y);
        ctx.strokeStyle = hsl(c, fadeAlpha * 0.5);
        ctx.lineWidth = 0.25;
        ctx.stroke();

        // Data packet traveling along the curve
        const t = ds.progress;
        const invT = 1 - t;
        const px = invT * invT * from.x + 2 * invT * t * midX + t * t * to.x;
        const py = invT * invT * from.y + 2 * invT * t * midY + t * t * to.y;

        // Packet as short dash
        const pAngle = Math.atan2(to.y - from.y, to.x - from.x);
        const pLen = 3;
        ctx.beginPath();
        ctx.moveTo(px - Math.cos(pAngle) * pLen, py - Math.sin(pAngle) * pLen);
        ctx.lineTo(px + Math.cos(pAngle) * pLen, py + Math.sin(pAngle) * pLen);
        ctx.strokeStyle = hsl(c, Math.sin(ds.progress * Math.PI) * 0.5);
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // ═══ L5: SCANNING BEAM ═══
      const scanY = (Math.sin(elapsed * 0.8) * 0.5 + 0.5) * h;
      const sg = ctx.createLinearGradient(0, scanY - 25, 0, scanY + 25);
      sg.addColorStop(0, hsl(COLORS.cyan, 0));
      sg.addColorStop(0.5, hsl(COLORS.cyan, 0.03));
      sg.addColorStop(1, hsl(COLORS.cyan, 0));
      ctx.fillStyle = sg;
      ctx.fillRect(0, scanY - 25, w, 50);

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

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="touch-none"
      style={{ width: size, height: size }}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerMove}
      onPointerLeave={() => { pointerRef.current.active = false; }}
    />
  );
};

export default InteractiveParticleSphere;
