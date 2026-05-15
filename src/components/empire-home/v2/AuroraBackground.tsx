import { useEffect, useRef } from "react";

/**
 * Lightweight emerald + gold aurora background.
 * Canvas 2D particles reactive to mouse and scroll. ~60fps mobile.
 */
export default function AuroraBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = window.innerWidth;
    let h = window.innerHeight;
    let mx = w / 2;
    let my = h / 2;
    let scrollY = window.scrollY;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };
    resize();

    type P = { x: number; y: number; r: number; vx: number; vy: number; hue: number; a: number };
    const N = reduce ? 18 : Math.min(46, Math.round((w * h) / 36000));
    const parts: P[] = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 60 + Math.random() * 140,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      hue: Math.random() < 0.65 ? 158 : 42, // emerald or gold
      a: 0.05 + Math.random() * 0.08,
    }));

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      // Base gradient
      const g = ctx.createRadialGradient(w * 0.15, h * 0.1, 0, w * 0.15, h * 0.1, Math.max(w, h));
      g.addColorStop(0, "hsl(162 60% 8%)");
      g.addColorStop(1, "hsl(162 70% 5%)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const sNorm = Math.min(1, scrollY / 2400);

      for (const p of parts) {
        // Drift + pull toward mouse subtly
        const dx = mx - p.x;
        const dy = my - p.y;
        const d = Math.hypot(dx, dy) + 1;
        p.vx += (dx / d) * 0.0035;
        p.vy += (dy / d) * 0.0035;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy + sNorm * 0.4;
        if (p.x < -p.r) p.x = w + p.r;
        if (p.x > w + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = h + p.r;
        if (p.y > h + p.r) p.y = -p.r;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, `hsl(${p.hue} 70% 50% / ${p.a})`);
        grad.addColorStop(1, `hsl(${p.hue} 70% 50% / 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Vignette
      const vg = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.85);
      vg.addColorStop(0, "hsl(0 0% 0% / 0)");
      vg.addColorStop(1, "hsl(0 0% 0% / 0.55)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(tick);
    };
    if (!reduce) raf = requestAnimationFrame(tick);
    else tick();

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onScroll = () => (scrollY = window.scrollY);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ mixBlendMode: "screen", opacity: 0.85 }}
    />
  );
}
