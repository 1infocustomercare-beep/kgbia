import { useEffect, useRef, useState } from "react";
import EmpireLogo from "./EmpireLogo";

/**
 * Cinematic splash: gold particles converge toward the Empire logo.
 * Tap to "explode" particles outward then morph back into the logo.
 * Auto-dismisses after ~3.2s. Skipped in iframes / demo / admin routes.
 */
const STORAGE_KEY = "empire_splash_seen_v2";

function shouldSkip() {
  if (typeof window === "undefined") return true;
  if (window.self !== window.top) return true;
  const p = window.location.pathname;
  if (/^\/(b|r|demo|superadmin|admin|partner|auth|onboarding|kitchen|t\/)/.test(p)) return true;
  try {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return true;
  } catch {}
  return false;
}

export default function EmpireSplash() {
  const [open, setOpen] = useState(() => !shouldSkip());
  const [tapped, setTapped] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startRef = useRef<number>(performance.now());

  useEffect(() => {
    if (!open) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    const t = setTimeout(() => setOpen(false), 3200);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = window.innerWidth;
    const h = window.innerHeight;
    cv.width = w * dpr;
    cv.height = h * dpr;
    cv.style.width = `${w}px`;
    cv.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    type P = { x: number; y: number; tx: number; ty: number; vx: number; vy: number; r: number; hue: number };
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) * 0.18;

    const N = 140;
    const parts: P[] = Array.from({ length: N }, (_, i) => {
      const a = (i / N) * Math.PI * 2;
      return {
        x: cx + (Math.random() - 0.5) * w,
        y: cy + (Math.random() - 0.5) * h,
        tx: cx + Math.cos(a) * R,
        ty: cy + Math.sin(a) * R,
        vx: 0,
        vy: 0,
        r: 1 + Math.random() * 2.4,
        hue: Math.random() < 0.7 ? 42 : 158,
      };
    });

    let raf = 0;
    let exploding = false;
    let explodeAt = 0;

    const onTap = () => {
      if (exploding) return;
      setTapped(true);
      exploding = true;
      explodeAt = performance.now();
      for (const p of parts) {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const d = Math.hypot(dx, dy) + 1;
        p.vx = (dx / d) * (8 + Math.random() * 6);
        p.vy = (dy / d) * (8 + Math.random() * 6);
      }
      // settle back after 600ms
      setTimeout(() => (exploding = false), 600);
    };
    cv.addEventListener("pointerdown", onTap);

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      const t = performance.now() - startRef.current;
      const conv = Math.min(1, t / 1400); // converge over 1.4s

      for (const p of parts) {
        if (exploding) {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.94;
          p.vy *= 0.94;
        } else {
          p.x += (p.tx - p.x) * (0.04 + conv * 0.08);
          p.y += (p.ty - p.y) * (0.04 + conv * 0.08);
          // Subtle orbit
          const ang = Math.atan2(p.y - cy, p.x - cx) + 0.004;
          const dist = Math.hypot(p.x - cx, p.y - cy);
          p.x = cx + Math.cos(ang) * dist;
          p.y = cy + Math.sin(ang) * dist;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${p.hue} 75% 60% / 0.9)`;
        ctx.shadowColor = `hsl(${p.hue} 80% 55% / 0.9)`;
        ctx.shadowBlur = 10;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      cv.removeEventListener("pointerdown", onTap);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10010] flex items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at center, hsl(162 70% 8%) 0%, hsl(162 80% 4%) 60%, hsl(0 0% 0%) 100%)",
        animation: "eg-splash-out .5s 2.7s ease-in forwards",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 cursor-pointer" />

      <div
        className="relative z-10 flex flex-col items-center gap-5"
        style={{
          transform: tapped ? "scale(1.08)" : "scale(1)",
          transition: "transform .6s cubic-bezier(.22,1,.36,1)",
        }}
      >
        <div
          style={{
            filter: "drop-shadow(0 0 30px hsl(42 80% 55% / 0.55))",
            animation: "eg-logo-in 1.4s .2s cubic-bezier(.22,1,.36,1) backwards",
          }}
        >
          <EmpireLogo size={120} animated />
        </div>
        <div
          className="text-center"
          style={{
            opacity: 0,
            animation: "eg-text-in .9s 1.2s ease-out forwards",
          }}
        >
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 36,
              letterSpacing: "-0.02em",
              background:
                "linear-gradient(120deg, hsl(42 75% 80%), hsl(42 65% 58%) 60%, hsl(38 70% 42%))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Empire AI
          </div>
          <div className="mt-2 text-[11px] uppercase tracking-[0.5em] text-white/55">
            tocca per evocare
          </div>
        </div>
      </div>

      <button
        onClick={() => setOpen(false)}
        className="absolute bottom-6 right-6 z-20 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] text-white/70 backdrop-blur"
      >
        Salta
      </button>

      <style>{`
        @keyframes eg-splash-out { to { opacity: 0; pointer-events: none; transform: scale(1.05); } }
        @keyframes eg-logo-in { from { opacity: 0; transform: scale(.6) rotateY(60deg); } to { opacity: 1; transform: scale(1) rotateY(0); } }
        @keyframes eg-text-in { to { opacity: 1; transform: translateY(0); } from { opacity: 0; transform: translateY(8px); } }
      `}</style>
    </div>
  );
}
