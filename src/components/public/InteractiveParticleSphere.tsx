import { useRef, useEffect, useCallback } from "react";

/**
 * InteractiveParticleSphere — Continuous DNA Neural Helix
 * Replicates the UnifiedIntro splash DNA effect (assemble + pulse phases)
 * as an infinite interactive loop. No orbit/collapse/rose morphing.
 */

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

const HELIX_NODES = IS_MOBILE ? 48 : 72;
const MESH_COUNT = IS_MOBILE ? 16 : 30;
const ENERGY_PARTICLES = IS_MOBILE ? 12 : 24;
const CIRCUIT_LINES = IS_MOBILE ? 8 : 14;

const COLORS = {
  gold: { h: 38, s: 50, l: 55 },
  violet: { h: 265, s: 75, l: 62 },
  green: { h: 160, s: 55, l: 48 },
  cyan: { h: 195, s: 70, l: 55 },
};

const palette = [COLORS.violet, COLORS.gold, COLORS.green];

const hsl = (c: { h: number; s: number; l: number }, a: number) =>
  `hsla(${c.h},${c.s}%,${c.l}%,${a})`;

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
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const turns = 5;

    // --- Mesh nodes ---
    const meshNodes = Array.from({ length: MESH_COUNT }, (_, i) => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0004,
      vy: (Math.random() - 0.5) * 0.0004,
      r: 1 + Math.random() * 1.2,
      ci: i % 3,
    }));

    // --- Helix nodes ---
    const helixNodes = Array.from({ length: HELIX_NODES }, (_, i) => {
      const t = i / HELIX_NODES;
      const angle = t * Math.PI * 2 * turns;
      const strand = i % 2 === 0 ? 1 : -1;
      return {
        ty: 0.05 + t * 0.9,
        baseAngle: angle,
        strand,
        ci: i % 3,
        r: i % 3 === 1 ? 3.2 : 2.2,
        glow: i % 4 === 0,
      };
    });

    // --- Energy particles ---
    const energyParticles = Array.from({ length: ENERGY_PARTICLES }, (_, i) => ({
      t: Math.random(),
      speed: 0.06 + Math.random() * 0.1,
      strand: Math.random() > 0.5 ? 1 : -1,
      ci: i % 3,
    }));

    // --- Circuit lines ---
    const circuitLines = Array.from({ length: CIRCUIT_LINES }, (_, i) => {
      const horiz = i % 2 === 0;
      return {
        x1: horiz ? 0.05 : 0.15 + Math.random() * 0.7,
        y1: horiz ? 0.1 + Math.random() * 0.8 : 0.05,
        x2: horiz ? 0.95 : 0.15 + Math.random() * 0.7,
        y2: horiz ? 0.1 + Math.random() * 0.8 : 0.95,
        ci: i % 3,
        prog: Math.random(),
      };
    });

    const scale = () => Math.min(size, size) / (IS_MOBILE ? 400 : 600);
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
      const s = scale();
      const w = size, h = size;
      const cx = w / 2, cy = h / 2;
      const ptr = pointerRef.current;
      const helixRotation = elapsed * 0.5;

      ctx.clearRect(0, 0, w, h);

      // ═══ CIRCUIT LINES ═══
      for (const cl of circuitLines) {
        cl.prog = (cl.prog + 0.003) % 1;
        const lx = cl.x1 + (cl.x2 - cl.x1) * cl.prog;
        const ly = cl.y1 + (cl.y2 - cl.y1) * cl.prog;
        const c = palette[cl.ci];
        ctx.beginPath();
        ctx.moveTo(cl.x1 * w, cl.y1 * h);
        ctx.lineTo(lx * w, ly * h);
        ctx.strokeStyle = hsl(c, 0.06);
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(lx * w, ly * h, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = hsl(c, 0.15);
        ctx.fill();
      }

      // ═══ CENTRAL CORE ═══
      const corePulse = 1 + Math.sin(elapsed * 1.8) * 0.08;
      const coreR = Math.min(w, h) * 0.16;
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * corePulse * 1.3);
      cg.addColorStop(0, hsl(COLORS.violet, 0.18));
      cg.addColorStop(0.3, hsl(COLORS.gold, 0.1));
      cg.addColorStop(0.6, hsl(COLORS.green, 0.05));
      cg.addColorStop(1, "hsla(265,75%,62%,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * corePulse * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = cg;
      ctx.fill();

      // Thin concentric rings
      const ringColors = [COLORS.violet, COLORS.gold, COLORS.green];
      const ringRadii = [0.45, 0.65, 0.85];
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, coreR * ringRadii[i] * corePulse, 0, Math.PI * 2);
        ctx.strokeStyle = hsl(ringColors[i], 0.2 * (1 - i * 0.2));
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // ═══ NEURAL MESH ═══
      const checkRange = IS_MOBILE ? 4 : 6;
      for (const n of meshNodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
        ctx.beginPath();
        ctx.arc(n.x * w, n.y * h, n.r, 0, Math.PI * 2);
        ctx.fillStyle = hsl(palette[n.ci], 0.1);
        ctx.fill();
      }
      for (let i = 0; i < meshNodes.length; i++) {
        for (let j = i + 1; j < Math.min(i + checkRange, meshNodes.length); j++) {
          const dx = meshNodes[i].x - meshNodes[j].x;
          const dy = meshNodes[i].y - meshNodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.18) {
            ctx.beginPath();
            ctx.moveTo(meshNodes[i].x * w, meshNodes[i].y * h);
            ctx.lineTo(meshNodes[j].x * w, meshNodes[j].y * h);
            ctx.strokeStyle = hsl(palette[meshNodes[i].ci], (1 - dist / 0.18) * 0.04);
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      // ═══ DNA DOUBLE HELIX ═══
      const amp = 0.18;
      const nodePositions: { x: number; y: number }[] = [];

      for (const n of helixNodes) {
        const rotAngle = n.baseAngle + helixRotation;
        const ampVar = amp + Math.sin(n.ty * Math.PI) * 0.06;
        let nx = (0.5 + Math.sin(rotAngle) * ampVar * n.strand) * w;
        let ny = n.ty * h;

        // Pointer repulsion
        if (ptr.active) {
          const dx = nx - ptr.x;
          const dy = ny - ptr.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const repelR = w * 0.2;
          if (dist > 1 && dist < repelR) {
            const force = (1 - dist / repelR) * 18;
            nx += (dx / dist) * force;
            ny += (dy / dist) * force;
          }
        }
        nodePositions.push({ x: nx, y: ny });
      }

      // Backbone connections
      for (let i = 0; i < nodePositions.length - 1; i++) {
        const a = nodePositions[i], b = nodePositions[i + 1];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < w * 0.14) {
          const alpha = (1 - dist / (w * 0.14)) * 0.35;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = hsl(palette[helixNodes[i].ci], alpha);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Cross-connections (base pairs)
      for (let i = 0; i < helixNodes.length - 1; i += 2) {
        if (i + 1 < helixNodes.length && helixNodes[i].strand !== helixNodes[i + 1].strand) {
          const a = nodePositions[i], b = nodePositions[i + 1];
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = hsl(palette[(i / 2) % 3], 0.1);
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }

      // Helix nodes with glow
      helixNodes.forEach((n, i) => {
        const p = nodePositions[i];
        const c = palette[n.ci];

        if (n.glow) {
          const glowR = n.r * 4;
          const gg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
          gg.addColorStop(0, hsl(c, 0.2));
          gg.addColorStop(1, hsl(c, 0));
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = gg;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, n.r * s * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = hsl(c, 0.8);
        ctx.fill();
      });

      // ═══ ENERGY PARTICLES ═══
      for (const ep of energyParticles) {
        ep.t = (ep.t + ep.speed * 0.016) % 1;
        const angle = ep.t * Math.PI * 2 * turns + helixRotation;
        const ampVar = amp + Math.sin(ep.t * Math.PI) * 0.06;
        const epx = (0.5 + Math.sin(angle) * ampVar * ep.strand) * w;
        const epy = (0.05 + ep.t * 0.9) * h;
        const epAlpha = 0.55 * Math.sin(ep.t * Math.PI);
        const c = palette[ep.ci];

        const tg = ctx.createRadialGradient(epx, epy, 0, epx, epy, 7 * s);
        tg.addColorStop(0, hsl(c, epAlpha));
        tg.addColorStop(1, hsl(c, 0));
        ctx.beginPath();
        ctx.arc(epx, epy, 7 * s, 0, Math.PI * 2);
        ctx.fillStyle = tg;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(epx, epy, 1.5 * s, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(0,0%,100%,${epAlpha * 0.7})`;
        ctx.fill();
      }

      // ═══ SCANNING BEAM ═══
      const scanY = (Math.sin(elapsed * 1.0) * 0.5 + 0.5) * h;
      const sg = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      sg.addColorStop(0, hsl(COLORS.cyan, 0));
      sg.addColorStop(0.5, hsl(COLORS.cyan, 0.04));
      sg.addColorStop(1, hsl(COLORS.cyan, 0));
      ctx.fillStyle = sg;
      ctx.fillRect(0, scanY - 30, w, 60);

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
