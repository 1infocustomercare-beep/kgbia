import { useRef, useEffect, useCallback, useMemo } from "react";

/**
 * Interactive 3D Particle Sphere — Empire IA DNA Neural Core
 * - Fibonacci sphere with DNA helix + neural network connections
 * - On touch/press: particles morph into "EMPIRE IA" text
 * - 3s after release: smoothly returns to rotating DNA sphere
 * - Fluid spring physics, neural synapses, scanning beams
 */

function generateTextPoints(
  text: string, cx: number, cy: number, fontSize: number, charSpacing: number
): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];

  // Simplified pixel font for block letters
  const font: Record<string, number[][]> = {
    E: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[1,2],[2,2],[1,4],[2,4]],
    M: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,1],[2,2],[3,1],[4,0],[4,1],[4,2],[4,3],[4,4]],
    P: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[2,1],[2,2],[1,2]],
    I: [[0,0],[1,0],[2,0],[1,1],[1,2],[1,3],[0,4],[1,4],[2,4]],
    R: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[2,1],[2,2],[1,2],[2,3],[3,4]],
    A: [[1,0],[0,1],[2,1],[0,2],[1,2],[2,2],[0,3],[2,3],[0,4],[2,4]],
    " ": [],
  };

  const chars = text.split("");
  // Calculate total width
  const charWidths = chars.map(c => {
    const glyph = font[c];
    if (!glyph || glyph.length === 0) return 2;
    return Math.max(...glyph.map(p => p[0])) + 1;
  });
  const totalWidth = charWidths.reduce((s, w, i) => s + w + (i < charWidths.length - 1 ? charSpacing : 0), 0);
  const scale = fontSize / 5;
  
  let offsetX = cx - (totalWidth * scale) / 2;
  
  for (let ci = 0; ci < chars.length; ci++) {
    const glyph = font[chars[ci]] || [];
    for (const [gx, gy] of glyph) {
      // Add slight randomness for organic feel
      pts.push({
        x: offsetX + gx * scale + (Math.random() - 0.5) * scale * 0.3,
        y: cy - (2.5 * scale) + gy * scale + (Math.random() - 0.5) * scale * 0.3,
      });
    }
    offsetX += (charWidths[ci] + charSpacing) * scale;
  }
  return pts;
}

const InteractiveParticleSphere = ({ size = 280 }: { size?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false, pressing: false, pressTime: 0, releaseTime: 0 });
  const timeRef = useRef(0);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const PARTICLE_COUNT = isMobile ? 600 : 1200;
  const SPHERE_RADIUS = size * 0.34;
  const DNA_PARTICLES = isMobile ? 80 : 160;
  const ORBIT_PARTICLES = isMobile ? 20 : 40;

  // Generate "EMPIRE IA" morph targets
  const textPoints = useMemo(
    () => generateTextPoints("EMPIRE IA", size / 2, size / 2, size * 0.08, 0.8),
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
    ox: number; oy: number; oz: number; speed: number;
    morphX: number; morphY: number;
    type: "sphere" | "dna" | "orbit";
    pulse: number;
  }

  const particlesRef = useRef<Particle[]>([]);

  const initParticles = useCallback(() => {
    const particles: Particle[] = [];
    const tLen = textPoints.length;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
      const theta = ((Math.sqrt(5) + 1) / 2) * i * Math.PI * 2;
      const phi = Math.acos(y);
      const mIdx = tLen > 0 ? i % tLen : 0;

      particles.push({
        theta, phi,
        radius: SPHERE_RADIUS * (0.92 + Math.random() * 0.16),
        baseSize: 0.4 + Math.random() * 1.2,
        color: colors[i % colors.length],
        ox: 0, oy: 0, oz: 0,
        speed: 0.6 + Math.random() * 0.6,
        morphX: tLen > 0 ? textPoints[mIdx].x : size / 2,
        morphY: tLen > 0 ? textPoints[mIdx].y : size / 2,
        type: "sphere",
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // DNA helix
    for (let i = 0; i < DNA_PARTICLES; i++) {
      const t = i / DNA_PARTICLES;
      const helixAngle = t * Math.PI * 8; // 4 full turns
      const strand = i % 2 === 0 ? 1 : -1;
      const helixR = SPHERE_RADIUS * 1.1;
      const phi = Math.PI * 0.12 + t * Math.PI * 0.76;
      const theta = helixAngle + strand * 0.35;
      const mIdx = tLen > 0 ? i % tLen : 0;

      particles.push({
        theta, phi, radius: helixR,
        baseSize: 1.1 + Math.random() * 0.9,
        color: strand > 0 ? VIOLET : GOLD,
        ox: 0, oy: 0, oz: 0,
        speed: 0.4 + Math.random() * 0.4,
        morphX: tLen > 0 ? textPoints[mIdx].x : size / 2,
        morphY: tLen > 0 ? textPoints[mIdx].y : size / 2,
        type: "dna",
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Orbital data particles
    for (let i = 0; i < ORBIT_PARTICLES; i++) {
      const angle = (i / ORBIT_PARTICLES) * Math.PI * 2;
      const mIdx = tLen > 0 ? i % tLen : 0;
      particles.push({
        theta: angle, phi: Math.PI / 2,
        radius: SPHERE_RADIUS * 1.4,
        baseSize: 0.8 + Math.random() * 0.7,
        color: i % 3 === 0 ? GOLD : i % 3 === 1 ? VIOLET : CYAN,
        ox: 0, oy: 0, oz: 0,
        speed: 1.0 + Math.random() * 0.7,
        morphX: tLen > 0 ? textPoints[mIdx].x : size / 2,
        morphY: tLen > 0 ? textPoints[mIdx].y : size / 2,
        type: "orbit",
        pulse: Math.random() * Math.PI * 2,
      });
    }

    particlesRef.current = particles;
  }, [PARTICLE_COUNT, SPHERE_RADIUS, DNA_PARTICLES, ORBIT_PARTICLES, size, textPoints]);

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
      const autoRot = t * 0.0005;

      ctx.clearRect(0, 0, size, size);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      // Morph logic: press to morph, 3s delay on release before returning
      if (mouse.pressing) {
        mouse.pressTime = Math.min(mouse.pressTime + 0.012, 1);
        mouse.releaseTime = 0;
      } else {
        mouse.releaseTime += 1;
        // Wait 180 frames (~3s at 60fps) before morphing back
        if (mouse.releaseTime > 180) {
          mouse.pressTime = Math.max(mouse.pressTime - 0.008, 0);
        }
      }
      const morphFactor = mouse.pressTime * mouse.pressTime; // easeIn for smoother morph

      // === Ambient outer glow ===
      const outerGlow = ctx.createRadialGradient(cx, cy, SPHERE_RADIUS * 0.8, cx, cy, SPHERE_RADIUS * 1.8);
      outerGlow.addColorStop(0, `hsla(265,60%,55%,${0.03 + morphFactor * 0.05})`);
      outerGlow.addColorStop(0.5, `hsla(38,50%,55%,${0.02 + morphFactor * 0.03})`);
      outerGlow.addColorStop(1, "transparent");
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, size, size);

      // === Orbital ring guides ===
      ctx.save();
      ctx.globalAlpha = 0.06 + morphFactor * 0.04;
      ctx.strokeStyle = "hsla(38,45%,55%,0.5)";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.ellipse(cx, cy, SPHERE_RADIUS * 1.4, SPHERE_RADIUS * 0.4, autoRot * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "hsla(265,50%,55%,0.4)";
      ctx.beginPath();
      ctx.ellipse(cx, cy, SPHERE_RADIUS * 1.25, SPHERE_RADIUS * 0.32, -autoRot * 1.5 + 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // === Project particles ===
      type Proj = { x: number; y: number; z: number; sz: number; color: string; alpha: number; type: string; glow: number };
      const projected: Proj[] = [];

      for (const p of particles) {
        const breathe = Math.sin(t * 0.003 + p.pulse) * 0.02;
        const sinPhi = Math.sin(p.phi);
        const cosPhi = Math.cos(p.phi);
        const rotTheta = p.theta + autoRot * p.speed;

        let sx = (p.radius + p.radius * breathe) * sinPhi * Math.cos(rotTheta);
        let sy = (p.radius + p.radius * breathe) * cosPhi;
        let sz = (p.radius + p.radius * breathe) * sinPhi * Math.sin(rotTheta);

        // Tilt
        const tiltA = 0.22;
        const ry = sy * Math.cos(tiltA) - sz * Math.sin(tiltA);
        const rz = sy * Math.sin(tiltA) + sz * Math.cos(tiltA);
        sy = ry; sz = rz;

        let worldX = cx + sx;
        let worldY = cy + sy;

        // Morph toward text
        if (morphFactor > 0.005) {
          const ease = morphFactor;
          worldX = worldX * (1 - ease) + p.morphX * ease;
          worldY = worldY * (1 - ease) + p.morphY * ease;
          sz = sz * (1 - ease * 0.9);
        }

        // Mouse scatter (only when not fully morphed)
        if (mouse.active && morphFactor < 0.4) {
          const dx = worldX - mouse.x;
          const dy = worldY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const force = Math.max(0, 1 - dist / (SPHERE_RADIUS * 1.2));
          const push = force * force * 45;
          p.ox += (dx / (dist || 1)) * push * 0.06;
          p.oy += (dy / (dist || 1)) * push * 0.06;
        }

        // Smooth spring damping
        p.ox *= 0.93;
        p.oy *= 0.93;

        const finalX = worldX + p.ox;
        const finalY = worldY + p.oy;

        const depthNorm = (sz + SPHERE_RADIUS * 1.5) / (SPHERE_RADIUS * 3);
        const alpha = 0.15 + depthNorm * 0.75 + morphFactor * 0.1;
        const dotSize = p.baseSize * (0.3 + depthNorm * 0.9);
        const glow = p.type !== "sphere" ? 1 : (Math.sin(t * 0.01 + p.pulse) > 0.7 ? 1 : 0);

        projected.push({ x: finalX, y: finalY, z: sz, sz: dotSize, color: p.color, alpha: Math.min(alpha, 1), type: p.type, glow });
      }

      projected.sort((a, b) => a.z - b.z);

      // === Neural network connections (flowing synapses) ===
      const connThreshold = isMobile ? 500 : 650;
      const maxConns = isMobile ? 60 : 120;
      const front = projected.filter(p => p.z > -SPHERE_RADIUS * 0.3);
      const sample = front.slice(-maxConns);
      ctx.lineWidth = 0.35;
      for (let i = 0; i < sample.length; i++) {
        const limit = Math.min(i + 6, sample.length);
        for (let j = i + 1; j < limit; j++) {
          const dx = sample[i].x - sample[j].x;
          const dy = sample[i].y - sample[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < connThreshold) {
            const a = (1 - d2 / connThreshold) * (0.1 + morphFactor * 0.08);
            // Pulsing synapse effect
            const pulse = Math.sin(t * 0.015 + i * 0.3) * 0.5 + 0.5;
            const finalA = a * (0.6 + pulse * 0.4);
            const isGold = sample[i].type === "dna" || sample[j].type === "dna";
            ctx.strokeStyle = isGold
              ? `hsla(38,50%,55%,${finalA.toFixed(3)})`
              : `hsla(265,50%,60%,${(finalA * 0.8).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(sample[i].x, sample[i].y);
            ctx.lineTo(sample[j].x, sample[j].y);
            ctx.stroke();
          }
        }
      }

      // === DNA bridge lines ===
      const dnaP = projected.filter(p => p.type === "dna");
      ctx.lineWidth = 0.5;
      for (let i = 0; i < dnaP.length - 1; i += 2) {
        const a = dnaP[i], b = dnaP[i + 1];
        if (!a || !b) continue;
        const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
        if (dist < SPHERE_RADIUS * 1.6) {
          const lineAlpha = Math.max(0.05, (1 - dist / (SPHERE_RADIUS * 1.6)) * 0.2);
          // Flowing data pulse along bridge
          const flow = (Math.sin(t * 0.02 + i * 0.5) + 1) * 0.5;
          ctx.strokeStyle = `hsla(38,45%,55%,${(lineAlpha * (0.5 + flow * 0.5)).toFixed(3)})`;
          ctx.setLineDash([2 + flow * 3, 2]);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // === Draw particles with glow ===
      for (const pt of projected) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.sz, 0, Math.PI * 2);
        ctx.fillStyle = pt.color + pt.alpha.toFixed(2) + ")";
        ctx.fill();

        // Glow halo for DNA/orbit or randomly pulsing sphere particles
        if (pt.glow && pt.sz > 0.6) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.sz * 3, 0, Math.PI * 2);
          ctx.fillStyle = pt.color + (pt.alpha * 0.08).toFixed(3) + ")";
          ctx.fill();
        }
      }

      // === Central core glow (intensifies during morph) ===
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, SPHERE_RADIUS * 0.3);
      coreGrad.addColorStop(0, `hsla(265,70%,65%,${0.06 + morphFactor * 0.2})`);
      coreGrad.addColorStop(0.5, `hsla(38,50%,55%,${0.03 + morphFactor * 0.1})`);
      coreGrad.addColorStop(1, "transparent");
      ctx.fillStyle = coreGrad;
      ctx.fillRect(0, 0, size, size);

      // === Horizontal scanning beam ===
      const scanY = (Math.sin(t * 0.006) * 0.5 + 0.5) * size;
      const scanGrad = ctx.createLinearGradient(0, scanY - 15, 0, scanY + 15);
      scanGrad.addColorStop(0, "transparent");
      scanGrad.addColorStop(0.5, `hsla(38,50%,55%,${0.025 + morphFactor * 0.04})`);
      scanGrad.addColorStop(1, "transparent");
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, 0, size, size);

      // === "EMPIRE IA" label hint when morphing ===
      if (morphFactor > 0.5) {
        const labelAlpha = (morphFactor - 0.5) * 2; // 0→1 as morph goes 0.5→1
        ctx.save();
        ctx.globalAlpha = labelAlpha * 0.6;
        ctx.font = `${Math.round(size * 0.028)}px 'Inter', sans-serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = `hsla(38,55%,65%,0.8)`;
        ctx.fillText("EMPIRE IA GROUP", cx, cy + size * 0.32);
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [size, SPHERE_RADIUS, isMobile, textPoints]);

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
        mouseRef.current.releaseTime = 0;
      }}
      onPointerUp={() => {
        mouseRef.current.pressing = false;
        mouseRef.current.releaseTime = 0;
      }}
      onPointerLeave={handlePointerLeave}
    />
  );
};

export default InteractiveParticleSphere;
