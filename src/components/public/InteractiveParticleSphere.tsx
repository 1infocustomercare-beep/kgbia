import { useRef, useEffect, useCallback, useMemo } from "react";

/**
 * Interactive 3D Particle Sphere — Empire AI DNA Edition
 * Features:
 * - Fibonacci-distributed particle sphere with DNA helix strands
 * - Neural network connection lines
 * - Touch/mouse: particles scatter & reform with spring physics
 * - Orbital rings with data flow particles
 * - Empire gold + violet color palette
 */

// Pre-compute "E" letter shape points for morph target
function generateEmpireLetterPoints(cx: number, cy: number, scale: number): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  // Letter "E" simplified as line segments
  const lines = [
    // Vertical bar
    ...Array.from({ length: 20 }, (_, i) => ({ x: -0.35, y: -0.5 + (i / 19) })),
    // Top bar
    ...Array.from({ length: 12 }, (_, i) => ({ x: -0.35 + (i / 11) * 0.55, y: -0.5 })),
    // Middle bar
    ...Array.from({ length: 10 }, (_, i) => ({ x: -0.35 + (i / 9) * 0.45, y: 0 })),
    // Bottom bar
    ...Array.from({ length: 12 }, (_, i) => ({ x: -0.35 + (i / 11) * 0.55, y: 0.5 })),
  ];
  return lines.map(p => ({ x: cx + p.x * scale, y: cy + p.y * scale }));
}

const InteractiveParticleSphere = ({ size = 280 }: { size?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false, pressing: false, pressTime: 0 });
  const timeRef = useRef(0);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const PARTICLE_COUNT = isMobile ? 700 : 1400;
  const SPHERE_RADIUS = size * 0.36;
  const DNA_PARTICLES = isMobile ? 60 : 120;
  const ORBIT_PARTICLES = isMobile ? 15 : 30;

  // Pre-compute "E" morph targets
  const empirePoints = useMemo(
    () => generateEmpireLetterPoints(size / 2, size / 2, size * 0.55),
    [size]
  );

  // Colors
  const GOLD = "hsla(38,55%,58%,";
  const WARM = "hsla(35,50%,55%,";
  const VIOLET = "hsla(265,70%,65%,";
  const DEEP_V = "hsla(265,60%,58%,";
  const LIGHT_G = "hsla(32,60%,62%,";
  const PURPLE = "hsla(280,50%,60%,";
  const CYAN = "hsla(185,60%,55%,";
  const colors = [GOLD, WARM, VIOLET, DEEP_V, LIGHT_G, PURPLE, CYAN];

  interface Particle {
    theta: number; phi: number; radius: number;
    baseSize: number; color: string;
    ox: number; oy: number; speed: number;
    // Morph target
    morphX: number; morphY: number;
    type: "sphere" | "dna" | "orbit";
  }

  const particlesRef = useRef<Particle[]>([]);

  const initParticles = useCallback(() => {
    const particles: Particle[] = [];

    // Main sphere particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
      const theta = ((Math.sqrt(5) + 1) / 2) * i * Math.PI * 2;
      const phi = Math.acos(y);
      const mIdx = i % empirePoints.length;

      particles.push({
        theta, phi,
        radius: SPHERE_RADIUS * (0.94 + Math.random() * 0.12),
        baseSize: 0.5 + Math.random() * 1.3,
        color: colors[i % colors.length],
        ox: 0, oy: 0,
        speed: 0.7 + Math.random() * 0.5,
        morphX: empirePoints[mIdx].x,
        morphY: empirePoints[mIdx].y,
        type: "sphere",
      });
    }

    // DNA double helix particles winding around the sphere
    for (let i = 0; i < DNA_PARTICLES; i++) {
      const t = i / DNA_PARTICLES;
      const helixAngle = t * Math.PI * 6; // 3 full turns
      const strand = i % 2 === 0 ? 1 : -1;
      const helixR = SPHERE_RADIUS * 1.08;
      const phi = Math.PI * 0.15 + t * Math.PI * 0.7;
      const theta = helixAngle + strand * 0.3;

      particles.push({
        theta, phi,
        radius: helixR,
        baseSize: 1.2 + Math.random() * 0.8,
        color: strand > 0 ? VIOLET : GOLD,
        ox: 0, oy: 0,
        speed: 0.5 + Math.random() * 0.3,
        morphX: size / 2 + Math.cos(helixAngle) * size * 0.3,
        morphY: size / 2 + (t - 0.5) * size * 0.6,
        type: "dna",
      });
    }

    // Orbital ring particles
    for (let i = 0; i < ORBIT_PARTICLES; i++) {
      const angle = (i / ORBIT_PARTICLES) * Math.PI * 2;
      particles.push({
        theta: angle,
        phi: Math.PI / 2,
        radius: SPHERE_RADIUS * 1.35,
        baseSize: 1.0 + Math.random() * 0.6,
        color: i % 3 === 0 ? GOLD : i % 3 === 1 ? VIOLET : CYAN,
        ox: 0, oy: 0,
        speed: 1.2 + Math.random() * 0.5,
        morphX: size / 2 + Math.cos(angle) * size * 0.35,
        morphY: size / 2 + Math.sin(angle) * size * 0.35,
        type: "orbit",
      });
    }

    particlesRef.current = particles;
  }, [PARTICLE_COUNT, SPHERE_RADIUS, DNA_PARTICLES, ORBIT_PARTICLES, size, empirePoints]);

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
      const autoRot = t * 0.0007;

      ctx.clearRect(0, 0, size, size);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      // Track press duration for morph intensity
      if (mouse.pressing) {
        mouse.pressTime = Math.min(mouse.pressTime + 0.015, 1);
      } else {
        mouse.pressTime = Math.max(mouse.pressTime - 0.025, 0);
      }
      const morphFactor = mouse.pressTime;

      // === Draw subtle orbital ring guides ===
      ctx.save();
      ctx.strokeStyle = "hsla(38,45%,55%,0.06)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.ellipse(cx, cy, SPHERE_RADIUS * 1.35, SPHERE_RADIUS * 0.45, autoRot * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "hsla(265,50%,55%,0.05)";
      ctx.beginPath();
      ctx.ellipse(cx, cy, SPHERE_RADIUS * 1.2, SPHERE_RADIUS * 0.35, -autoRot * 1.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // === Project all particles ===
      const projected: { x: number; y: number; z: number; sz: number; color: string; alpha: number; type: string }[] = [];

      for (const p of particles) {
        const sinPhi = Math.sin(p.phi);
        const cosPhi = Math.cos(p.phi);
        const rotTheta = p.theta + autoRot * p.speed;
        const sinT = Math.sin(rotTheta);
        const cosT = Math.cos(rotTheta);

        let sx = p.radius * sinPhi * cosT;
        let sy = p.radius * cosPhi;
        let sz = p.radius * sinPhi * sinT;

        // Additional tilt rotation for visual interest
        const tiltAngle = 0.25;
        const ry = sy * Math.cos(tiltAngle) - sz * Math.sin(tiltAngle);
        const rz = sy * Math.sin(tiltAngle) + sz * Math.cos(tiltAngle);
        sy = ry;
        sz = rz;

        // World position (before morph)
        let worldX = cx + sx;
        let worldY = cy + sy;

        // === MORPH: on long press, particles morph toward "E" shape ===
        if (morphFactor > 0.01) {
          worldX = worldX * (1 - morphFactor) + p.morphX * morphFactor;
          worldY = worldY * (1 - morphFactor) + p.morphY * morphFactor;
          // Flatten z during morph
          sz = sz * (1 - morphFactor * 0.8);
        }

        // Mouse scatter interaction
        if (mouse.active && morphFactor < 0.3) {
          const dx = worldX - mouse.x;
          const dy = worldY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const force = Math.max(0, 1 - dist / (SPHERE_RADIUS * 1.1));
          const push = force * force * 50;
          p.ox += (dx / (dist || 1)) * push * 0.07;
          p.oy += (dy / (dist || 1)) * push * 0.07;
        }

        // Spring damping
        p.ox *= 0.91;
        p.oy *= 0.91;

        const finalX = worldX + p.ox;
        const finalY = worldY + p.oy;

        const depthNorm = (sz + SPHERE_RADIUS * 1.4) / (SPHERE_RADIUS * 2.8);
        const alpha = 0.12 + depthNorm * 0.78;
        const dotSize = p.baseSize * (0.35 + depthNorm * 0.85);

        projected.push({ x: finalX, y: finalY, z: sz, sz: dotSize, color: p.color, alpha, type: p.type });
      }

      // Sort back-to-front
      projected.sort((a, b) => a.z - b.z);

      // === Draw neural network connections (front particles only, desktop) ===
      if (!isMobile) {
        const front = projected.filter(p => p.z > -SPHERE_RADIUS * 0.2);
        const connLimit = Math.min(front.length, 100);
        const sample = front.slice(-connLimit);
        ctx.lineWidth = 0.4;
        for (let i = 0; i < sample.length; i++) {
          for (let j = i + 1; j < Math.min(i + 8, sample.length); j++) {
            const dx = sample[i].x - sample[j].x;
            const dy = sample[i].y - sample[j].y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 700) {
              const a = (1 - d2 / 700) * 0.12;
              const isGold = sample[i].type === "dna" || sample[j].type === "dna";
              ctx.strokeStyle = isGold
                ? `hsla(38,50%,55%,${a})`
                : `hsla(265,50%,60%,${a * 0.7})`;
              ctx.beginPath();
              ctx.moveTo(sample[i].x, sample[i].y);
              ctx.lineTo(sample[j].x, sample[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // === Draw DNA bridge lines between helix strand pairs ===
      const dnaParticles = projected.filter(p => p.type === "dna");
      ctx.lineWidth = 0.5;
      for (let i = 0; i < dnaParticles.length - 1; i += 2) {
        const a = dnaParticles[i], b = dnaParticles[i + 1];
        if (!a || !b) continue;
        const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
        if (dist < SPHERE_RADIUS * 1.5) {
          const lineAlpha = Math.max(0.04, Math.min(0.18, (1 - dist / (SPHERE_RADIUS * 1.5)) * 0.18));
          ctx.strokeStyle = `hsla(38,45%,55%,${lineAlpha})`;
          ctx.setLineDash([2, 3]);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // === Draw particles ===
      for (const pt of projected) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.sz, 0, Math.PI * 2);
        ctx.fillStyle = pt.color + pt.alpha.toFixed(2) + ")";
        ctx.fill();

        // Glow for DNA & orbit particles
        if (pt.type !== "sphere" && pt.sz > 1) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.sz * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = pt.color + (pt.alpha * 0.12).toFixed(2) + ")";
          ctx.fill();
        }
      }

      // === Central core glow ===
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, SPHERE_RADIUS * 0.25);
      coreGrad.addColorStop(0, `hsla(265,70%,65%,${0.08 + morphFactor * 0.15})`);
      coreGrad.addColorStop(0.5, `hsla(38,50%,55%,${0.04 + morphFactor * 0.08})`);
      coreGrad.addColorStop(1, "transparent");
      ctx.fillStyle = coreGrad;
      ctx.fillRect(0, 0, size, size);

      // === Scanning beam effect ===
      const scanY = (Math.sin(t * 0.008) * 0.5 + 0.5) * size;
      const scanGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      scanGrad.addColorStop(0, "transparent");
      scanGrad.addColorStop(0.5, `hsla(38,50%,55%,${0.03 + morphFactor * 0.04})`);
      scanGrad.addColorStop(1, "transparent");
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, 0, size, size);

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [size, SPHERE_RADIUS, isMobile, empirePoints]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.active = true;
  }, []);

  const handlePointerLeave = useCallback(() => {
    mouseRef.current.active = false;
    mouseRef.current.pressing = false;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="touch-none cursor-grab active:cursor-grabbing"
      style={{ width: size, height: size }}
      onPointerMove={handlePointerMove}
      onPointerDown={(e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          mouseRef.current.x = e.clientX - rect.left;
          mouseRef.current.y = e.clientY - rect.top;
        }
        mouseRef.current.active = true;
        mouseRef.current.pressing = true;
      }}
      onPointerUp={() => { mouseRef.current.pressing = false; }}
      onPointerLeave={handlePointerLeave}
    />
  );
};

export default InteractiveParticleSphere;
