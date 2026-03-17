import { useRef, useEffect, useCallback } from "react";

/**
 * InteractiveParticleSphere — Exact splash DNA effect (assemble+pulse)
 * running as infinite loop. No orbit, no collapse, no rose.
 * Identical visuals to UnifiedIntro's DNA phases with pointer interactivity.
 */

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

const HELIX_NODES = IS_MOBILE ? 48 : 72;
const MESH_COUNT = IS_MOBILE ? 18 : 36;
const ENERGY_PARTICLES = IS_MOBILE ? 14 : 28;
const CIRCUIT_LINES = IS_MOBILE ? 10 : 18;

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
    const w = size, h = size;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = w / 2, cy = h / 2;
    const turns = 5;
    const baseScale = Math.min(w, h) / (IS_MOBILE ? 400 : 700);

    // ── Mesh nodes ──
    const meshNodes = Array.from({ length: MESH_COUNT }, (_, i) => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
      r: 1 + Math.random() * 1.5,
      ci: i % 3,
    }));

    // ── DNA helix nodes ──
    const helixNodes = Array.from({ length: HELIX_NODES }, (_, i) => {
      const t = i / HELIX_NODES;
      const angle = t * Math.PI * 2 * turns;
      const yPos = 0.05 + t * 0.90;
      const amp = 0.18;
      const ampVar = amp + Math.sin(t * Math.PI) * 0.06;
      const strand = i % 2 === 0 ? 1 : -1;
      const xPos = 0.5 + Math.sin(angle) * ampVar * strand;
      return {
        sx: Math.random(), sy: Math.random(),
        tx: xPos, ty: yPos,
        x: xPos, y: yPos,
        r: i % 3 === 1 ? 3.5 : 2.5,
        ci: i % 3, strand, baseAngle: angle,
        glow: i % 4 === 0,
      };
    });

    // ── Energy particles ──
    const energyParticles = Array.from({ length: ENERGY_PARTICLES }, (_, i) => ({
      t: Math.random(),
      speed: 0.08 + Math.random() * 0.12,
      strand: Math.random() > 0.5 ? 1 : -1,
      ci: i % 3,
    }));

    // ── Circuit lines ──
    const circuitLines = Array.from({ length: CIRCUIT_LINES }, (_, i) => {
      const isH = i % 2 === 0;
      return {
        x1: isH ? 0.05 : (0.15 + Math.random() * 0.7),
        y1: isH ? (0.1 + Math.random() * 0.8) : 0.05,
        x2: isH ? 0.95 : (0.15 + Math.random() * 0.7),
        y2: isH ? (0.1 + Math.random() * 0.8) : 0.95,
        ci: i % 3,
        progress: 0,
      };
    });

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
      const scale = baseScale;
      const ptr = pointerRef.current;
      const helixRotation = elapsed * 0.4;
      const repelR = w * 0.2;
      const coreRadius = Math.min(w, h) * 0.16;

      ctx.clearRect(0, 0, w, h);

      // ═══ SUBTLE DATA PATHWAYS (circuit lines) ═══
      for (const cl of circuitLines) {
        cl.progress = (cl.progress + 0.003) % 1.2; // loop
        const p = Math.min(cl.progress, 1);
        const c = palette[cl.ci];
        const lx = cl.x1 + (cl.x2 - cl.x1) * p;
        const ly = cl.y1 + (cl.y2 - cl.y1) * p;

        ctx.beginPath();
        ctx.moveTo(cl.x1 * w, cl.y1 * h);
        ctx.lineTo(lx * w, ly * h);
        ctx.strokeStyle = hsl(c, 0.04);
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Junction node
        if (p > 0.5) {
          ctx.beginPath();
          ctx.arc(lx * w, ly * h, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = hsl(c, 0.12);
          ctx.fill();
        }
      }

      // ═══ CENTRAL INTELLIGENCE CORE ═══
      const corePulse = 1 + Math.sin(elapsed * 1.8) * 0.08;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * corePulse * 1.5);
      coreGrad.addColorStop(0, hsl(COLORS.violet, 0.2));
      coreGrad.addColorStop(0.3, hsl(COLORS.gold, 0.1));
      coreGrad.addColorStop(0.6, hsl(COLORS.green, 0.05));
      coreGrad.addColorStop(1, "hsla(265,75%,62%,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * corePulse * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Thin concentric rings
      const ringColors = [COLORS.violet, COLORS.gold, COLORS.green];
      const ringRadii = [0.45, 0.65, 0.85];
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, coreRadius * ringRadii[i] * corePulse, 0, Math.PI * 2);
        ctx.strokeStyle = hsl(ringColors[i], 0.3 * (1 - i * 0.2));
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // ═══ NEURAL MESH BACKGROUND ═══
      const checkRange = IS_MOBILE ? 4 : 6;
      for (const n of meshNodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
        const c = palette[n.ci];
        ctx.beginPath();
        ctx.arc(n.x * w, n.y * h, n.r, 0, Math.PI * 2);
        ctx.fillStyle = hsl(c, 0.1);
        ctx.fill();
      }
      for (let i = 0; i < meshNodes.length; i++) {
        for (let j = i + 1; j < Math.min(i + checkRange, meshNodes.length); j++) {
          const dx = meshNodes[i].x - meshNodes[j].x;
          const dy = meshNodes[i].y - meshNodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.16) {
            ctx.beginPath();
            ctx.moveTo(meshNodes[i].x * w, meshNodes[i].y * h);
            ctx.lineTo(meshNodes[j].x * w, meshNodes[j].y * h);
            ctx.strokeStyle = hsl(palette[meshNodes[i].ci], (1 - dist / 0.16) * 0.04);
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      // ═══ DNA DOUBLE HELIX ═══
      const amp = 0.18;
      for (const n of helixNodes) {
        const rotAngle = n.baseAngle + helixRotation;
        const ampVar = amp + Math.sin(n.ty * Math.PI) * 0.06;
        n.x = 0.5 + Math.sin(rotAngle) * ampVar * n.strand;
        n.y = n.ty;
      }

      // Backbone connections
      for (let i = 0; i < helixNodes.length - 1; i++) {
        const a = helixNodes[i], b = helixNodes[i + 1];
        const ax = a.x * w, ay = a.y * h, bx = b.x * w, by = b.y * h;

        // Pointer repulsion
        let fax = ax, fay = ay, fbx = bx, fby = by;
        if (ptr.active) {
          for (const [px, py] of [[ax, ay], [bx, by]] as [number, number][]) {
            const ddx = px - ptr.x, ddy = py - ptr.y;
            const dd = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dd > 1 && dd < repelR) {
              const force = (1 - dd / repelR) * 18;
              if (px === ax) { fax += (ddx / dd) * force; fay += (ddy / dd) * force; }
              else { fbx += (ddx / dd) * force; fby += (ddy / dd) * force; }
            }
          }
        }

        const dx = fax - fbx, dy = fay - fby;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < w * 0.14) {
          const alpha = (1 - dist / (w * 0.14)) * 0.35;
          ctx.beginPath();
          ctx.moveTo(fax, fay);
          ctx.lineTo(fbx, fby);
          ctx.strokeStyle = hsl(palette[a.ci], alpha);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Cross-connections (base pairs)
      for (let i = 0; i < helixNodes.length - 1; i += 2) {
        if (i + 1 < helixNodes.length && helixNodes[i].strand !== helixNodes[i + 1].strand) {
          const a = helixNodes[i], b = helixNodes[i + 1];
          let ax = a.x * w, ay = a.y * h, bx = b.x * w, by = b.y * h;
          if (ptr.active) {
            for (const pp of [{ rx: ax, ry: ay, set: 'a' }, { rx: bx, ry: by, set: 'b' }]) {
              const ddx = pp.rx - ptr.x, ddy = pp.ry - ptr.y;
              const dd = Math.sqrt(ddx * ddx + ddy * ddy);
              if (dd > 1 && dd < repelR) {
                const force = (1 - dd / repelR) * 18;
                if (pp.set === 'a') { ax += (ddx / dd) * force; ay += (ddy / dd) * force; }
                else { bx += (ddx / dd) * force; by += (ddy / dd) * force; }
              }
            }
          }
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.strokeStyle = hsl(palette[(i / 2) % 3], 0.1);
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }

      // Helix nodes with glow
      for (const n of helixNodes) {
        let px = n.x * w, py = n.y * h;
        if (ptr.active) {
          const ddx = px - ptr.x, ddy = py - ptr.y;
          const dd = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dd > 1 && dd < repelR) {
            const force = (1 - dd / repelR) * 18;
            px += (ddx / dd) * force;
            py += (ddy / dd) * force;
          }
        }
        const c = palette[n.ci];

        if (n.glow) {
          const glowR = n.r * 4;
          const gg = ctx.createRadialGradient(px, py, 0, px, py, glowR);
          gg.addColorStop(0, hsl(c, 0.2));
          gg.addColorStop(1, hsl(c, 0));
          ctx.beginPath();
          ctx.arc(px, py, glowR, 0, Math.PI * 2);
          ctx.fillStyle = gg;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(px, py, n.r * scale * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = hsl(c, 0.85);
        ctx.fill();
      }

      // ═══ ENERGY PARTICLES — flowing data ═══
      for (const ep of energyParticles) {
        ep.t = (ep.t + ep.speed * 0.016) % 1;
        const angle = ep.t * Math.PI * 2 * turns + helixRotation;
        const ampVar = amp + Math.sin(ep.t * Math.PI) * 0.06;
        let epx = (0.5 + Math.sin(angle) * ampVar * ep.strand) * w;
        let epy = (0.05 + ep.t * 0.9) * h;
        const epAlpha = 0.6 * Math.sin(ep.t * Math.PI);
        const c = palette[ep.ci];

        if (ptr.active) {
          const ddx = epx - ptr.x, ddy = epy - ptr.y;
          const dd = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dd > 1 && dd < repelR) {
            const force = (1 - dd / repelR) * 12;
            epx += (ddx / dd) * force;
            epy += (ddy / dd) * force;
          }
        }

        const tg = ctx.createRadialGradient(epx, epy, 0, epx, epy, 8 * scale);
        tg.addColorStop(0, hsl(c, epAlpha));
        tg.addColorStop(1, hsl(c, 0));
        ctx.beginPath();
        ctx.arc(epx, epy, 8 * scale, 0, Math.PI * 2);
        ctx.fillStyle = tg;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(epx, epy, 1.5 * scale, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(0,0%,100%,${epAlpha * 0.8})`;
        ctx.fill();
      }

      // ═══ SCANNING BEAM ═══
      const scanY = (Math.sin(elapsed * 1.2) * 0.5 + 0.5) * h;
      const sg = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      sg.addColorStop(0, hsl(COLORS.cyan, 0));
      sg.addColorStop(0.5, hsl(COLORS.cyan, 0.06));
      sg.addColorStop(1, hsl(COLORS.cyan, 0));
      ctx.fillStyle = sg;
      ctx.fillRect(0, scanY - 40, w, 80);

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
