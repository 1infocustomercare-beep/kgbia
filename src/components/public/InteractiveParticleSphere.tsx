import { useRef, useEffect, useCallback } from "react";

/**
 * Interactive 3D Particle Sphere — inspired by Horacle.ai
 * Renders a rotating sphere of particles on canvas.
 * Responds to mouse/touch: particles scatter on interaction and reform.
 * Uses Empire DNA color palette (gold + violet).
 */
const InteractiveParticleSphere = ({ size = 280 }: { size?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  interface Particle {
    // Spherical coordinates
    theta: number;
    phi: number;
    radius: number;
    // Current projected position
    x: number;
    y: number;
    z: number;
    // Display
    baseSize: number;
    color: string;
    // Interaction offset
    ox: number;
    oy: number;
    speed: number;
  }

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const PARTICLE_COUNT = isMobile ? 600 : 1200;
  const SPHERE_RADIUS = size * 0.38;

  const initParticles = useCallback(() => {
    const particles: Particle[] = [];
    const colors = [
      "hsla(38,55%,58%,", // gold
      "hsla(35,50%,55%,", // warm gold
      "hsla(265,70%,65%,", // violet
      "hsla(265,60%,58%,", // deep violet
      "hsla(32,60%,62%,", // light gold
      "hsla(280,50%,60%,", // purple
    ];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Fibonacci sphere distribution for even spacing
      const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = ((Math.sqrt(5) + 1) / 2) * i * Math.PI * 2;
      const phi = Math.acos(y);

      particles.push({
        theta,
        phi,
        radius: SPHERE_RADIUS * (0.95 + Math.random() * 0.1),
        x: 0, y: 0, z: 0,
        baseSize: 0.6 + Math.random() * 1.2,
        color: colors[i % colors.length],
        ox: 0, oy: 0,
        speed: 0.8 + Math.random() * 0.4,
      });
    }
    particlesRef.current = particles;
  }, [PARTICLE_COUNT, SPHERE_RADIUS]);

  useEffect(() => {
    initParticles();
  }, [initParticles]);

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
    const rotSpeed = 0.0008;

    const animate = () => {
      timeRef.current += 1;
      const t = timeRef.current;

      ctx.clearRect(0, 0, size, size);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;
      const autoRotY = t * rotSpeed;

      // Sort by z for depth ordering
      const projected: { x: number; y: number; z: number; size: number; color: string; alpha: number }[] = [];

      for (const p of particles) {
        // Sphere coordinates
        const sinPhi = Math.sin(p.phi);
        const cosPhi = Math.cos(p.phi);
        const sinTheta = Math.sin(p.theta + autoRotY * p.speed);
        const cosTheta = Math.cos(p.theta + autoRotY * p.speed);

        let sx = p.radius * sinPhi * cosTheta;
        let sy = p.radius * cosPhi;
        let sz = p.radius * sinPhi * sinTheta;

        // Apply Y-axis rotation
        const rx = sx * Math.cos(autoRotY * 0.3) - sz * Math.sin(autoRotY * 0.3);
        const rz = sx * Math.sin(autoRotY * 0.3) + sz * Math.cos(autoRotY * 0.3);
        sx = rx;
        sz = rz;

        // Mouse interaction — push particles away
        if (mouse.active) {
          const dx = (cx + sx) - mouse.x;
          const dy = (cy + sy) - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const force = Math.max(0, 1 - dist / (SPHERE_RADIUS * 1.2));
          const pushStrength = force * force * 45;
          p.ox += (dx / (dist || 1)) * pushStrength * 0.08;
          p.oy += (dy / (dist || 1)) * pushStrength * 0.08;
        }

        // Dampen offsets — spring back
        p.ox *= 0.92;
        p.oy *= 0.92;

        const finalX = cx + sx + p.ox;
        const finalY = cy + sy + p.oy;

        // Depth-based alpha and size
        const depthNorm = (sz + SPHERE_RADIUS) / (SPHERE_RADIUS * 2);
        const alpha = 0.15 + depthNorm * 0.75;
        const dotSize = p.baseSize * (0.4 + depthNorm * 0.8);

        projected.push({
          x: finalX,
          y: finalY,
          z: sz,
          size: dotSize,
          color: p.color,
          alpha,
        });
      }

      // Sort back-to-front
      projected.sort((a, b) => a.z - b.z);

      // Draw particles
      for (const pt of projected) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = pt.color + pt.alpha.toFixed(2) + ")";
        ctx.fill();
      }

      // Draw subtle connecting lines for nearby front particles (desktop only)
      if (!isMobile) {
        const front = projected.filter(p => p.z > 0).slice(-80);
        ctx.lineWidth = 0.3;
        for (let i = 0; i < front.length; i++) {
          for (let j = i + 1; j < front.length; j++) {
            const dx = front[i].x - front[j].x;
            const dy = front[i].y - front[j].y;
            const d = dx * dx + dy * dy;
            if (d < 900) {
              const a = (1 - d / 900) * 0.15;
              ctx.strokeStyle = `hsla(38,50%,55%,${a})`;
              ctx.beginPath();
              ctx.moveTo(front[i].x, front[i].y);
              ctx.lineTo(front[j].x, front[j].y);
              ctx.stroke();
            }
          }
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [size, SPHERE_RADIUS, isMobile]);

  // Mouse/touch handlers
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.active = true;
  }, []);

  const handlePointerLeave = useCallback(() => {
    mouseRef.current.active = false;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="touch-none cursor-grab active:cursor-grabbing"
      style={{ width: size, height: size }}
      onPointerMove={handlePointerMove}
      onPointerDown={() => { mouseRef.current.active = true; }}
      onPointerUp={handlePointerLeave}
      onPointerLeave={handlePointerLeave}
    />
  );
};

export default InteractiveParticleSphere;
