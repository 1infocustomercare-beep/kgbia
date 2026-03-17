import { useRef, useEffect, useMemo, useCallback } from "react";

type NodeSeed = {
  angle: number;
  radial: number;
  speed: number;
  size: number;
  phase: number;
  color: "violet" | "gold" | "cyan";
};

type LinkSeed = { from: number; to: number };
type PulseState = { from: number; to: number; progress: number; speed: number; color: "violet" | "gold" | "cyan" };

const HUES = {
  violet: "265,70%,64%",
  gold: "38,55%,58%",
  cyan: "185,65%,56%",
};

const hsla = (tone: keyof typeof HUES, alpha: number) => `hsla(${HUES[tone]},${alpha})`;

const InteractiveParticleSphere = ({ size = 280 }: { size?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const pointerRef = useRef({
    x: size / 2,
    y: size / 2,
    active: false,
    pressing: false,
    lastX: size / 2,
    lastY: size / 2,
    dragX: 0,
    dragY: 0,
  });
  const pulsesRef = useRef<PulseState[]>([]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  const nodeSeeds = useMemo<NodeSeed[]>(() => {
    const count = isMobile ? 12 : 18;
    return Array.from({ length: count }, (_, i) => {
      const ratio = i / count;
      return {
        angle: ratio * Math.PI * 2,
        radial: 0.24 + ((i * 7) % 11) / 20,
        speed: 0.18 + ((i * 13) % 17) / 120,
        size: 1.2 + ((i * 5) % 9) / 6,
        phase: ratio * Math.PI * 4,
        color: i % 3 === 0 ? "gold" : i % 3 === 1 ? "violet" : "cyan",
      };
    });
  }, [isMobile]);

  const linkSeeds = useMemo<LinkSeed[]>(() => {
    const links: LinkSeed[] = [];
    const n = nodeSeeds.length;
    for (let i = 0; i < n; i++) {
      links.push({ from: i, to: (i + 2) % n });
      if (i % 2 === 0) links.push({ from: i, to: (i + 5) % n });
      if (i % 3 === 0) links.push({ from: i, to: (i + 7) % n });
    }
    return links;
  }, [nodeSeeds]);

  useEffect(() => {
    const pulseCount = isMobile ? 10 : 16;
    pulsesRef.current = Array.from({ length: pulseCount }, (_, i) => ({
      from: i % nodeSeeds.length,
      to: (i * 3 + 4) % nodeSeeds.length,
      progress: (i % 7) / 7,
      speed: 0.012 + ((i * 11) % 9) / 700,
      color: i % 3 === 0 ? "gold" : i % 3 === 1 ? "violet" : "cyan",
    }));
  }, [isMobile, nodeSeeds]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const ringRadius = size * 0.31;
    const helixAmp = size * (isMobile ? 0.013 : 0.018);
    const helixFreq = 8;
    const helixSegments = isMobile ? 100 : 160;
    const rungStep = isMobile ? 8 : 6;

    const draw = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const pointer = pointerRef.current;

      if (!pointer.pressing) {
        pointer.dragX *= 0.965;
        pointer.dragY *= 0.965;
      }

      const pxNorm = (pointer.x - size / 2) / (size / 2);
      const pyNorm = (pointer.y - size / 2) / (size / 2);
      const parallaxX = (pointer.active ? pxNorm : 0) * size * 0.035;
      const parallaxY = (pointer.active ? pyNorm : 0) * size * 0.03;

      const cx = size / 2 + parallaxX;
      const cy = size / 2 + parallaxY;
      const baseRot = t * 0.72 + pointer.dragX;
      const tilt = pointer.dragY * 0.2;
      const ellipseY = 0.86 + Math.sin(t * 0.35) * 0.03 + tilt;

      ctx.clearRect(0, 0, size, size);

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, ringRadius * 2.5);
      bg.addColorStop(0, hsla("violet", 0.12));
      bg.addColorStop(0.35, hsla("gold", 0.08));
      bg.addColorStop(0.7, hsla("cyan", 0.05));
      bg.addColorStop(1, "transparent");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);

      const strandTones: Array<keyof typeof HUES> = ["violet", "gold", "cyan"];
      const strands: Array<Array<{ x: number; y: number }>> = [[], [], []];

      for (let s = 0; s < 3; s++) {
        const phaseOffset = (s / 3) * Math.PI * 2;

        ctx.beginPath();
        for (let i = 0; i <= helixSegments; i++) {
          const f = i / helixSegments;
          const angle = f * Math.PI * 2 + baseRot * (0.78 + s * 0.12);
          const wave = Math.sin(f * Math.PI * 2 * helixFreq + phaseOffset + t * 2.3) * helixAmp;
          const rr = ringRadius + wave;

          let x = cx + Math.cos(angle) * rr;
          let y = cy + Math.sin(angle) * rr * ellipseY;

          if (pointer.active) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const dist = Math.hypot(dx, dy);
            const repelRadius = ringRadius * 0.8;
            if (dist > 1 && dist < repelRadius) {
              const force = (1 - dist / repelRadius) * 8;
              x += (dx / dist) * force;
              y += (dy / dist) * force;
            }
          }

          strands[s].push({ x, y });
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = hsla(strandTones[s], 0.45);
        ctx.lineWidth = isMobile ? 1.1 : 1.4;
        ctx.stroke();

        ctx.beginPath();
        strands[s].forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
        ctx.strokeStyle = hsla(strandTones[s], 0.1);
        ctx.lineWidth = isMobile ? 4 : 6;
        ctx.stroke();
      }

      for (let i = 0; i < helixSegments; i += rungStep) {
        const a = strands[0][i];
        const b = strands[1][i];
        const c = strands[2][i];
        if (!a || !b || !c) continue;

        const pulse = 0.45 + 0.55 * Math.sin(t * 3 + i * 0.18);
        ctx.strokeStyle = hsla("gold", 0.08 * pulse);
        ctx.lineWidth = 0.6;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        if (i % (rungStep * 2) === 0) {
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(c.x, c.y);
          ctx.stroke();
        }
      }

      const nodePositions = nodeSeeds.map((seed, idx) => {
        const angle = seed.angle + t * seed.speed + pointer.dragX * 0.4;
        const radiusWobble = 1 + Math.sin(t * 1.6 + seed.phase) * 0.08;
        let nx = cx + Math.cos(angle) * ringRadius * seed.radial * radiusWobble;
        let ny = cy + Math.sin(angle) * ringRadius * seed.radial * radiusWobble * ellipseY;

        if (pointer.active) {
          const dx = nx - pointer.x;
          const dy = ny - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d > 1 && d < ringRadius * 0.7) {
            const push = (1 - d / (ringRadius * 0.7)) * 10;
            nx += (dx / d) * push;
            ny += (dy / d) * push;
          }
        }

        const pulse = 0.75 + 0.25 * Math.sin(t * 2.4 + seed.phase + idx * 0.2);
        return { x: nx, y: ny, pulse };
      });

      for (const link of linkSeeds) {
        const from = nodePositions[link.from];
        const to = nodePositions[link.to];
        if (!from || !to) continue;

        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.hypot(dx, dy);
        if (dist > ringRadius * 0.95) continue;

        const alpha = (1 - dist / (ringRadius * 0.95)) * 0.22;
        const mx = (from.x + to.x) / 2 + dy * 0.14;
        const my = (from.y + to.y) / 2 - dx * 0.14;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.quadraticCurveTo(mx, my, to.x, to.y);
        ctx.strokeStyle = hsla("cyan", alpha);
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      for (const pulse of pulsesRef.current) {
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) {
          pulse.progress = 0;
          pulse.from = pulse.to;
          pulse.to = (pulse.to + 3 + Math.floor(Math.random() * 5)) % nodePositions.length;
        }

        const from = nodePositions[pulse.from];
        const to = nodePositions[pulse.to];
        if (!from || !to) continue;

        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const mx = (from.x + to.x) / 2 + dy * 0.14;
        const my = (from.y + to.y) / 2 - dx * 0.14;

        const p = pulse.progress;
        const qx =
          (1 - p) * (1 - p) * from.x +
          2 * (1 - p) * p * mx +
          p * p * to.x;
        const qy =
          (1 - p) * (1 - p) * from.y +
          2 * (1 - p) * p * my +
          p * p * to.y;

        const glowA = Math.sin(p * Math.PI) * 0.35;
        ctx.beginPath();
        ctx.arc(qx, qy, isMobile ? 3 : 4.2, 0, Math.PI * 2);
        ctx.fillStyle = hsla(pulse.color, glowA * 0.35);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(qx, qy, isMobile ? 1.3 : 1.8, 0, Math.PI * 2);
        ctx.fillStyle = hsla(pulse.color, glowA);
        ctx.fill();
      }

      nodeSeeds.forEach((seed, i) => {
        const p = nodePositions[i];
        const r = seed.size * p.pulse;

        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 5);
        glow.addColorStop(0, hsla(seed.color, 0.22));
        glow.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = hsla(seed.color, 0.9);
        ctx.fill();
      });

      for (let i = 0; i < 3; i++) {
        const start = t * (0.9 + i * 0.18) + i * 2.1;
        const length = Math.PI * (0.28 + i * 0.03);
        const radius = ringRadius * (0.9 + i * 0.06);
        ctx.beginPath();
        ctx.arc(cx, cy, radius, start, start + length);
        ctx.strokeStyle = hsla(strandTones[i], 0.22);
        ctx.lineWidth = isMobile ? 1.1 : 1.8;
        ctx.stroke();
      }

      const corePulse = 1 + Math.sin(t * 2.6) * 0.08;
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, ringRadius * 0.42 * corePulse);
      core.addColorStop(0, hsla("violet", 0.26));
      core.addColorStop(0.3, hsla("gold", 0.15));
      core.addColorStop(0.65, hsla("cyan", 0.08));
      core.addColorStop(1, "transparent");
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, size, size);

      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.015 * corePulse, 0, Math.PI * 2);
      ctx.fillStyle = "hsla(0,0%,100%,0.82)";
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [isMobile, linkSeeds, nodeSeeds, size]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pointer = pointerRef.current;

    if (pointer.pressing) {
      const dx = x - pointer.lastX;
      const dy = y - pointer.lastY;
      pointer.dragX += dx * 0.007;
      pointer.dragY += dy * 0.004;
    }

    pointer.x = x;
    pointer.y = y;
    pointer.lastX = x;
    pointer.lastY = y;
    pointer.active = true;
  }, []);

  const handlePointerLeave = useCallback(() => {
    const pointer = pointerRef.current;
    pointer.active = false;
    pointer.pressing = false;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="touch-none cursor-grab active:cursor-grabbing"
      style={{ width: size, height: size }}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerMove}
      onPointerDown={(e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const pointer = pointerRef.current;
        pointer.pressing = true;
        pointer.lastX = x;
        pointer.lastY = y;
        pointer.x = x;
        pointer.y = y;
        pointer.active = true;
      }}
      onPointerUp={() => {
        pointerRef.current.pressing = false;
      }}
      onPointerLeave={handlePointerLeave}
    />
  );
};

export default InteractiveParticleSphere;
