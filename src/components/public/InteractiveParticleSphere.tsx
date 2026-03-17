import { useRef, useEffect, useCallback, useMemo } from "react";

/**
 * Interactive 3D Particle Sphere — Oracle-style clean rotating globe
 * On touch/hover: morphs smoothly into "EMPIRE IA GROUP" text
 * Drag to rotate the sphere manually
 */

function generateTextPoints(
  text: string, cx: number, cy: number, scale: number
): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  const font: Record<string, number[][]> = {
    E: [[0,0],[1,0],[2,0],[3,0],[0,1],[0,2],[1,2],[2,2],[0,3],[0,4],[1,4],[2,4],[3,4]],
    M: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,1],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4],[1,1],[3,1],[2,2]],
    P: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[3,0],[3,1],[3,2],[2,2],[1,2]],
    I: [[0,0],[1,0],[2,0],[1,1],[1,2],[1,3],[0,4],[1,4],[2,4]],
    R: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[3,0],[3,1],[3,2],[2,2],[1,2],[2,3],[3,4]],
    G: [[1,0],[2,0],[3,0],[0,1],[0,2],[0,3],[1,4],[2,4],[3,4],[3,3],[3,2],[2,2]],
    O: [[1,0],[2,0],[0,1],[3,1],[0,2],[3,2],[0,3],[3,3],[1,4],[2,4]],
    U: [[0,0],[0,1],[0,2],[0,3],[3,0],[3,1],[3,2],[3,3],[1,4],[2,4]],
    A: [[1,0],[2,0],[0,1],[3,1],[0,2],[1,2],[2,2],[3,2],[0,3],[3,3],[0,4],[3,4]],
    " ": [],
  };

  const chars = text.split("");
  const charWidths = chars.map(c => {
    const glyph = font[c];
    if (!glyph || glyph.length === 0) return 2;
    return Math.max(...glyph.map(p => p[0])) + 2;
  });
  const totalWidth = charWidths.reduce((s, w) => s + w, 0);
  let offsetX = cx - (totalWidth * scale) / 2;

  for (let ci = 0; ci < chars.length; ci++) {
    const glyph = font[chars[ci]] || [];
    for (const [gx, gy] of glyph) {
      for (let d = 0; d < 3; d++) {
        pts.push({
          x: offsetX + gx * scale + (Math.random() - 0.5) * scale * 0.45,
          y: cy - (2 * scale) + gy * scale + (Math.random() - 0.5) * scale * 0.45,
        });
      }
    }
    offsetX += charWidths[ci] * scale;
  }
  return pts;
}

const InteractiveParticleSphere = ({ size = 280 }: { size?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({
    x: 0, y: 0,
    active: false,
    pressing: false,
    hoverTime: 0,
    releaseTime: 0,
    dragAngleX: 0,
    dragAngleY: 0,
    lastX: 0, lastY: 0,
  });
  const timeRef = useRef(0);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const PARTICLE_COUNT = isMobile ? 800 : 1600;
  const SPHERE_RADIUS = size * 0.36;

  const textPoints = useMemo(
    () => generateTextPoints("EMPIRE IA", size / 2, size * 0.42, size * 0.05),
    [size]
  );
  const subTextPoints = useMemo(
    () => generateTextPoints("GROUP", size / 2, size * 0.62, size * 0.038),
    [size]
  );
  const allTextPoints = useMemo(
    () => [...textPoints, ...subTextPoints],
    [textPoints, subTextPoints]
  );

  // Oracle-style: warm gold/white palette
  const GOLD = "hsla(38,50%,62%,";
  const WHITE = "hsla(0,0%,85%,";
  const SOFT = "hsla(220,15%,72%,";

  interface Particle {
    theta: number; phi: number; radius: number;
    baseSize: number; color: string;
    ox: number; oy: number; speed: number;
    morphX: number; morphY: number;
  }

  const particlesRef = useRef<Particle[]>([]);

  const initParticles = useCallback(() => {
    const particles: Particle[] = [];
    const tLen = allTextPoints.length;
    const colors = [GOLD, WHITE, SOFT];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Fibonacci sphere distribution
      const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
      const theta = ((Math.sqrt(5) + 1) / 2) * i * Math.PI * 2;
      const phi = Math.acos(y);
      const mIdx = tLen > 0 ? i % tLen : 0;

      particles.push({
        theta, phi,
        radius: SPHERE_RADIUS * (0.92 + Math.random() * 0.16),
        baseSize: 0.3 + Math.random() * 1.0,
        color: colors[i % 3],
        ox: 0, oy: 0,
        speed: 0.4 + Math.random() * 0.3,
        morphX: tLen > 0 ? allTextPoints[mIdx].x : size / 2,
        morphY: tLen > 0 ? allTextPoints[mIdx].y : size / 2,
      });
    }
    particlesRef.current = particles;
  }, [PARTICLE_COUNT, SPHERE_RADIUS, size, allTextPoints]);

  useEffect(() => { initParticles(); }, [initParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;

    const animate = () => {
      timeRef.current += 1;
      const t = timeRef.current;
      ctx.clearRect(0, 0, size, size);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      // Morph on hover/touch
      if (mouse.active) {
        mouse.hoverTime = Math.min(mouse.hoverTime + 0.016, 1);
        mouse.releaseTime = 0;
      } else {
        mouse.releaseTime += 1;
        if (mouse.releaseTime > 120) {
          mouse.hoverTime = Math.max(mouse.hoverTime - 0.007, 0);
        }
      }
      const morphRaw = mouse.hoverTime;
      const morphFactor = morphRaw * morphRaw * (3 - 2 * morphRaw);

      // Drag damping
      if (!mouse.pressing) {
        mouse.dragAngleX *= 0.97;
        mouse.dragAngleY *= 0.97;
      }

      const autoRot = t * 0.0006 + mouse.dragAngleX;
      const tiltAngle = 0.25 + mouse.dragAngleY * 0.3;

      // Subtle background glow — Oracle style
      const bgGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, SPHERE_RADIUS * 1.6);
      bgGlow.addColorStop(0, `hsla(38,40%,55%,${0.03 + morphFactor * 0.06})`);
      bgGlow.addColorStop(0.5, `hsla(220,15%,50%,${0.01 + morphFactor * 0.03})`);
      bgGlow.addColorStop(1, "transparent");
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, size, size);

      // Equator ring (Oracle globe signature)
      ctx.save();
      ctx.globalAlpha = 0.06 + morphFactor * 0.02;
      ctx.strokeStyle = "hsla(38,40%,60%,0.5)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, SPHERE_RADIUS * 1.05, SPHERE_RADIUS * 0.28, autoRot * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, cy, SPHERE_RADIUS * 1.1, SPHERE_RADIUS * 0.2, -autoRot * 0.3 + 1.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Project particles
      type Proj = { x: number; y: number; z: number; sz: number; color: string; alpha: number };
      const projected: Proj[] = [];

      for (let pi = 0; pi < particles.length; pi++) {
        const p = particles[pi];
        const breathe = Math.sin(t * 0.002 + pi * 0.01) * 0.015;
        const r = p.radius * (1 + breathe);
        const sinPhi = Math.sin(p.phi);
        const cosPhi = Math.cos(p.phi);
        const rotTheta = p.theta + autoRot * p.speed;

        let sx = r * sinPhi * Math.cos(rotTheta);
        let sy = r * cosPhi;
        let sz = r * sinPhi * Math.sin(rotTheta);

        // Tilt
        const cosT = Math.cos(tiltAngle), sinT = Math.sin(tiltAngle);
        const ry = sy * cosT - sz * sinT;
        const rz = sy * sinT + sz * cosT;
        sy = ry; sz = rz;

        let worldX = cx + sx;
        let worldY = cy + sy;

        // Morph toward text
        if (morphFactor > 0.005) {
          worldX = worldX * (1 - morphFactor) + p.morphX * morphFactor;
          worldY = worldY * (1 - morphFactor) + p.morphY * morphFactor;
          sz *= (1 - morphFactor * 0.9);
        }

        // Mouse repulsion (subtle, when not morphed)
        if (mouse.active && morphFactor < 0.3) {
          const dx = worldX - mouse.x;
          const dy = worldY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const force = Math.max(0, 1 - dist / (SPHERE_RADIUS * 0.8));
          const push = force * force * 25;
          p.ox += (dx / (dist || 1)) * push * 0.04;
          p.oy += (dy / (dist || 1)) * push * 0.04;
        }
        p.ox *= 0.93;
        p.oy *= 0.93;

        const finalX = worldX + p.ox;
        const finalY = worldY + p.oy;
        const depthNorm = (sz + SPHERE_RADIUS * 1.2) / (SPHERE_RADIUS * 2.4);
        const alpha = Math.min(0.08 + depthNorm * 0.85 + morphFactor * 0.1, 1);
        const dotSize = p.baseSize * (0.2 + depthNorm * 0.9);

        projected.push({ x: finalX, y: finalY, z: sz, sz: dotSize, color: p.color, alpha });
      }

      projected.sort((a, b) => a.z - b.z);

      // Connections — Oracle-style subtle web
      const maxConn = isMobile ? 60 : 120;
      const connDist = isMobile ? 22 : 18;
      const front = projected.filter(p => p.z > -SPHERE_RADIUS * 0.15);
      const sample = front.slice(-maxConn);

      ctx.lineWidth = 0.25;
      for (let i = 0; i < sample.length; i++) {
        const lim = Math.min(i + 5, sample.length);
        for (let j = i + 1; j < lim; j++) {
          const dx = sample[i].x - sample[j].x;
          const dy = sample[i].y - sample[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < connDist) {
            const a = (1 - d / connDist) * (0.12 + morphFactor * 0.06);
            ctx.strokeStyle = `hsla(38,35%,60%,${a.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(sample[i].x, sample[i].y);
            ctx.lineTo(sample[j].x, sample[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const pt of projected) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.sz, 0, Math.PI * 2);
        ctx.fillStyle = pt.color + pt.alpha.toFixed(2) + ")";
        ctx.fill();
      }

      // Core glow
      const coreR = SPHERE_RADIUS * 0.25;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      coreGrad.addColorStop(0, `hsla(38,45%,60%,${0.04 + morphFactor * 0.18})`);
      coreGrad.addColorStop(1, "transparent");
      ctx.fillStyle = coreGrad;
      ctx.fillRect(0, 0, size, size);

      // Text label during morph
      if (morphFactor > 0.25) {
        const la = Math.min((morphFactor - 0.25) / 0.4, 1);
        ctx.save();

        // Glow behind text
        const tGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.35);
        tGlow.addColorStop(0, `hsla(38,45%,55%,${la * 0.12})`);
        tGlow.addColorStop(1, "transparent");
        ctx.fillStyle = tGlow;
        ctx.fillRect(0, 0, size, size);

        const mainSize = Math.round(size * 0.08);
        ctx.font = `800 ${mainSize}px 'Inter', system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.letterSpacing = `${size * 0.006}px`;

        // Shadow
        ctx.globalAlpha = la * 0.25;
        ctx.fillStyle = `hsla(38,50%,60%,1)`;
        ctx.filter = `blur(${size * 0.015}px)`;
        ctx.fillText("EMPIRE IA", cx, cy - size * 0.015);
        ctx.filter = "none";

        // Main text
        ctx.globalAlpha = la * 0.9;
        ctx.fillStyle = `hsla(38,50%,72%,1)`;
        ctx.fillText("EMPIRE IA", cx, cy - size * 0.015);

        // Subtitle
        const subSize = Math.round(size * 0.038);
        ctx.font = `600 ${subSize}px 'Inter', system-ui, sans-serif`;
        ctx.letterSpacing = `${size * 0.02}px`;
        ctx.globalAlpha = la * 0.6;
        ctx.fillStyle = `hsla(38,40%,68%,0.85)`;
        ctx.fillText("G R O U P", cx, cy + size * 0.055);

        // Accent lines
        ctx.globalAlpha = la * 0.25;
        ctx.strokeStyle = `hsla(38,40%,60%,0.45)`;
        ctx.lineWidth = 0.5;
        const lW = size * 0.2;
        ctx.beginPath();
        ctx.moveTo(cx - lW, cy + size * 0.09);
        ctx.lineTo(cx - size * 0.03, cy + size * 0.09);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + size * 0.03, cy + size * 0.09);
        ctx.lineTo(cx + lW, cy + size * 0.09);
        ctx.stroke();

        // Tagline
        const tagSize = Math.round(size * 0.02);
        ctx.font = `500 ${tagSize}px 'Inter', system-ui, sans-serif`;
        ctx.globalAlpha = la * 0.35;
        ctx.fillStyle = `hsla(220,15%,72%,0.7)`;
        ctx.letterSpacing = `${size * 0.01}px`;
        ctx.fillText("AI-POWERED BUSINESS PLATFORM", cx, cy + size * 0.14);

        ctx.restore();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [size, SPHERE_RADIUS, isMobile, allTextPoints]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const mouse = mouseRef.current;

    if (mouse.pressing) {
      mouse.dragAngleX += (mx - mouse.lastX) * 0.008;
      mouse.dragAngleY += (my - mouse.lastY) * 0.005;
    }

    mouse.x = mx;
    mouse.y = my;
    mouse.lastX = mx;
    mouse.lastY = my;
    mouse.active = true;
  }, []);

  const handlePointerLeave = useCallback(() => {
    mouseRef.current.active = false;
    mouseRef.current.pressing = false;
    mouseRef.current.releaseTime = 0;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="touch-none cursor-grab active:cursor-grabbing"
      style={{ width: size, height: size }}
      onPointerMove={handlePointerMove}
      onPointerEnter={(e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          mouseRef.current.x = e.clientX - rect.left;
          mouseRef.current.y = e.clientY - rect.top;
        }
        mouseRef.current.active = true;
        mouseRef.current.releaseTime = 0;
      }}
      onPointerDown={(e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          mouseRef.current.lastX = e.clientX - rect.left;
          mouseRef.current.lastY = e.clientY - rect.top;
        }
        mouseRef.current.pressing = true;
      }}
      onPointerUp={() => { mouseRef.current.pressing = false; }}
      onPointerLeave={handlePointerLeave}
    />
  );
};

export default InteractiveParticleSphere;
