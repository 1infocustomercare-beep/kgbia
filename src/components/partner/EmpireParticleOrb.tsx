import { useEffect, useRef, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Bot, Zap, Target, TrendingUp, Rocket } from "lucide-react";

/**
 * Empire Particle Orb — interactive WOW hero element.
 *
 * Inspired by horacle.ai: a sphere of glowing particles that reacts to
 * pointer movement (gravity/repulsion) and morphs on click into a
 * structured "feature constellation" with cards.
 *
 * Empire-themed in violet/purple, fully responsive (desktop + mobile),
 * touch + mouse interactive, GPU-friendly canvas rendering.
 */

type Mode = "orb" | "constellation";

interface Particle {
  // home position (normalised 0..1 in canvas space)
  hx: number;
  hy: number;
  // current position (px)
  x: number;
  y: number;
  // velocity
  vx: number;
  vy: number;
  // visual
  r: number;
  hue: number;
  alpha: number;
  // target (for morph)
  tx: number;
  ty: number;
}

const FEATURES = [
  { icon: Bot, label: "AI Agents", angle: -90 },
  { icon: Target, label: "Lead Engine", angle: -30 },
  { icon: Rocket, label: "Demo Factory", angle: 30 },
  { icon: TrendingUp, label: "Earnings", angle: 90 },
  { icon: Zap, label: "Automations", angle: 150 },
  { icon: Sparkles, label: "Brand Studio", angle: 210 },
];

const EmpireParticleOrb = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const modeRef = useRef<Mode>("orb");
  const morphRef = useRef(0); // 0 = orb, 1 = constellation
  const [mode, setMode] = useState<Mode>("orb");
  const [hint, setHint] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, cx = 0, cy = 0, radius = 0;
    let raf = 0;
    let t = 0;

    const isMobile = window.innerWidth < 640;
    const COUNT = isMobile ? 280 : 520;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      w = rect.width; h = rect.height;
      cx = w / 2; cy = h / 2;
      radius = Math.min(w, h) * 0.36;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      // recompute home positions on resize so particles stay within sphere
      for (const p of particlesRef.current) {
        const ang = Math.atan2(p.hy - 0.5, p.hx - 0.5);
        const dist = Math.hypot(p.hx - 0.5, p.hy - 0.5);
        p.hx = 0.5 + Math.cos(ang) * dist;
        p.hy = 0.5 + Math.sin(ang) * dist;
      }
    };

    // Init particles in spherical projection
    const init = () => {
      const arr: Particle[] = [];
      for (let i = 0; i < COUNT; i++) {
        // golden-spiral distribution on sphere → projected to 2D disc
        const phi = Math.acos(1 - (2 * (i + 0.5)) / COUNT);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const sx = Math.sin(phi) * Math.cos(theta);
        const sy = Math.sin(phi) * Math.sin(theta);
        // depth-based jitter for volumetric feel
        const sz = Math.cos(phi);
        const px = 0.5 + sx * 0.42;
        const py = 0.5 + sy * 0.42;
        arr.push({
          hx: px,
          hy: py,
          x: px,
          y: py,
          vx: 0, vy: 0,
          r: 0.6 + (sz + 1) * 0.9,
          hue: 260 + Math.random() * 30, // violet → indigo
          alpha: 0.35 + (sz + 1) * 0.25,
          tx: px, ty: py,
        });
      }
      particlesRef.current = arr;
    };

    init();
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // ─── Pointer ───
    const handlePointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.x = e.clientX - rect.left;
      pointerRef.current.y = e.clientY - rect.top;
      pointerRef.current.active = true;
    };
    const handleLeave = () => {
      pointerRef.current.active = false;
      pointerRef.current.x = -9999;
      pointerRef.current.y = -9999;
    };
    canvas.addEventListener("pointermove", handlePointer);
    canvas.addEventListener("pointerleave", handleLeave);
    canvas.addEventListener("pointercancel", handleLeave);

    // ─── Animate ───
    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, w, h);

      // Recompute targets when mode changes
      const targetMorph = modeRef.current === "constellation" ? 1 : 0;
      morphRef.current += (targetMorph - morphRef.current) * 0.06;
      const m = morphRef.current;

      // Background ambient glow
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 2.4);
      bgGrad.addColorStop(0, `hsla(265, 80%, 55%, ${0.18 - m * 0.08})`);
      bgGrad.addColorStop(0.55, `hsla(265, 70%, 40%, ${0.06})`);
      bgGrad.addColorStop(1, "hsla(265, 70%, 30%, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      const pointerActive = pointerRef.current.active;

      // Compute constellation targets (ring around centre)
      const ringR = radius * 1.05;

      const arr = particlesRef.current;
      for (let i = 0; i < arr.length; i++) {
        const p = arr[i];

        // Home position in px (orb mode)
        const homeX = p.hx * w;
        const homeY = p.hy * h;

        // Constellation: assign each particle to one of 6 ring nodes
        const nodeIdx = i % FEATURES.length;
        const ringAng = (FEATURES[nodeIdx].angle * Math.PI) / 180 + t * 0.3;
        const jitter = ((i * 1.3) % 30) - 15;
        const ringX = cx + Math.cos(ringAng) * (ringR + jitter * 0.6);
        const ringY = cy + Math.sin(ringAng) * (ringR + jitter * 0.6);

        // Blended target between orb and constellation
        const tgtX = homeX * (1 - m) + ringX * m;
        const tgtY = homeY * (1 - m) + ringY * m;

        // Gentle orbital drift in orb mode (breathing rotation)
        const breathe = Math.sin(t * 1.6 + i * 0.05) * (1 - m) * 1.4;
        const driftAng = t * 0.35 + i * 0.011;
        const driftR = breathe;
        const finalTgtX = tgtX + Math.cos(driftAng) * driftR;
        const finalTgtY = tgtY + Math.sin(driftAng) * driftR;

        // Spring towards target
        p.vx += (finalTgtX - p.x) * 0.045;
        p.vy += (finalTgtY - p.y) * 0.045;

        // Pointer interaction (repel + slight attract on edge)
        if (pointerActive) {
          const dx = p.x - px;
          const dy = p.y - py;
          const dist = Math.hypot(dx, dy);
          const reach = isMobile ? 80 : 120;
          if (dist < reach && dist > 0.01) {
            const force = (1 - dist / reach) * 2.2;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Damping
        p.vx *= 0.86;
        p.vy *= 0.86;

        p.x += p.vx;
        p.y += p.vy;

        // Render particle with depth-based glow
        const pulse = 0.7 + Math.sin(t * 2 + i * 0.3) * 0.3;
        const alpha = p.alpha * pulse * (1 - m * 0.25);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${alpha})`;
        ctx.fill();

        // Bright core sparkle on bigger particles
        if (p.r > 1.4) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(0, 0%, 100%, ${alpha * 0.6})`;
          ctx.fill();
        }
      }

      // Connecting lines between nearby particles (only orb mode)
      if (m < 0.6) {
        const maxDist = isMobile ? 28 : 36;
        const lineAlphaBase = (1 - m) * 0.18;
        ctx.lineWidth = 0.5;
        // Sample a subset for perf
        const step = isMobile ? 5 : 3;
        for (let i = 0; i < arr.length; i += step) {
          for (let j = i + step; j < Math.min(i + step * 8, arr.length); j += step) {
            const a = arr[i], b = arr[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const d = Math.hypot(dx, dy);
            if (d < maxDist) {
              const alpha = (1 - d / maxDist) * lineAlphaBase;
              ctx.strokeStyle = `hsla(265, 80%, 70%, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      // Central core glow when in orb mode
      if (m < 0.85) {
        const coreAlpha = (1 - m) * (0.35 + Math.sin(t * 2) * 0.08);
        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.6);
        coreGrad.addColorStop(0, `hsla(280, 90%, 75%, ${coreAlpha})`);
        coreGrad.addColorStop(0.5, `hsla(265, 80%, 55%, ${coreAlpha * 0.4})`);
        coreGrad.addColorStop(1, "hsla(265, 70%, 40%, 0)");
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", handlePointer);
      canvas.removeEventListener("pointerleave", handleLeave);
      canvas.removeEventListener("pointercancel", handleLeave);
    };
  }, []);

  const toggle = () => {
    const next: Mode = mode === "orb" ? "constellation" : "orb";
    modeRef.current = next;
    setMode(next);
    setHint(false);
  };

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-[280px] sm:h-[340px] md:h-[400px] lg:h-[440px] overflow-hidden rounded-3xl select-none cursor-pointer touch-none"
      style={{
        background:
          "radial-gradient(ellipse at center, hsla(265,40%,12%,0.6) 0%, hsla(265,30%,8%,0.85) 60%, hsla(0,0%,4%,0.95) 100%)",
        border: "1px solid hsla(265,60%,40%,0.18)",
        boxShadow:
          "0 20px 60px -20px hsla(265,70%,30%,0.5), inset 0 1px 0 hsla(265,80%,70%,0.08)",
      }}
      onClick={toggle}
      role="button"
      aria-label={mode === "orb" ? "Espandi costellazione Empire" : "Comprimi orb"}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Centre label / hint */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <AnimatePresence mode="wait">
          {mode === "orb" ? (
            <motion.div
              key="orb-label"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="text-center px-4"
            >
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-violet-300/80 mb-2">
                Empire Core
              </p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white"
                style={{ textShadow: "0 0 24px hsla(265,80%,60%,0.6)" }}>
                Il tuo Universo AI
              </h3>
              <AnimatePresence>
                {hint && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.4, 0.9, 0.4] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                    className="text-[10px] sm:text-xs text-violet-300/70 mt-3 font-medium"
                  >
                    Tocca per esplorare
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="const-label"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-center px-4"
            >
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-violet-300/80 mb-1.5">
                Empire Stack
              </p>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">
                6 moduli sincronizzati
              </h3>
              <p className="text-[10px] sm:text-xs text-violet-300/60 mt-2">
                Tocca di nuovo per ricomporre
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feature cards (constellation mode) — positioned around the ring */}
      <AnimatePresence>
        {mode === "constellation" &&
          FEATURES.map((f, i) => {
            const Icon = f.icon;
            const angRad = (f.angle * Math.PI) / 180;
            // distance as % of container — responsive
            const dx = Math.cos(angRad) * 42;
            const dy = Math.sin(angRad) * 42;
            return (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                className="absolute z-20 pointer-events-none"
                style={{
                  left: `calc(50% + ${dx}% )`,
                  top: `calc(50% + ${dy}% )`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full backdrop-blur-md"
                  style={{
                    background: "hsla(265,40%,15%,0.75)",
                    border: "1px solid hsla(265,80%,65%,0.4)",
                    boxShadow: "0 4px 16px hsla(265,80%,40%,0.35)",
                  }}
                >
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-violet-300" />
                  <span className="text-[10px] sm:text-xs font-semibold text-white whitespace-nowrap">
                    {f.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
      </AnimatePresence>

      {/* Top gradient haze */}
      <div className="absolute inset-x-0 top-0 h-16 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, hsla(265,40%,8%,0.4), transparent)" }} />
    </div>
  );
});

EmpireParticleOrb.displayName = "EmpireParticleOrb";
export default EmpireParticleOrb;
