import { useEffect, useRef } from "react";

/**
 * Shared canvas animation loop for demo-site hero effects.
 * - Auto-resizes to the parent box (DPR aware, capped at 2)
 * - Pauses when the hero scrolls out of view or the tab is hidden
 * - Fully skipped when the user prefers reduced motion
 */
export function useHeroCanvas(
  draw: (ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => void,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    let raf = 0;
    let start = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      ctx.clearRect(0, 0, w, h);
      drawRef.current(ctx, (now - start) / 1000, w, h);
    };

    if (reduced) {
      // Single static frame, no loop.
      ctx.clearRect(0, 0, w, h);
      drawRef.current(ctx, 0, w, h);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return canvasRef;
}
