import { useEffect, useRef, useState } from "react";

/**
 * Sfondo particellare interattivo per la home Empire.
 * - Canvas fisso SOTTO tutti gli elementi (z-index 0, pointer-events: none)
 * - Le particelle reagiscono allo scroll (drift verticale + velocità) e al mouse (parallasse)
 * - Nessuna immagine statica: tutto generato in runtime
 * - Rispetta prefers-reduced-motion (render statico leggerissimo)
 */
type P = {
  x: number;
  y: number;
  z: number; // 0.2 → 1 (profondità)
  vx: number;
  vy: number;
  r: number;
};

const HUES = [244, 250, 236];

export default function PrestigeScrubBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<P[]>([]);
  const rafRef = useRef<number | null>(null);
  const scrollRef = useRef({ y: 0, v: 0, p: 0 });
  const pointerRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const seed = () => {
      const area = w * h;
      const count = Math.round(
        Math.min(220, Math.max(60, area / (window.innerWidth < 768 ? 12000 : 7500))),
      );
      particles.current = Array.from({ length: count }, () => {
        const z = 0.2 + Math.random() * 0.8;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          vx: (Math.random() - 0.5) * 0.14 * z,
          vy: (Math.random() - 0.5) * 0.12 * z,
          r: (1.1 + Math.random() * 2.4) * z,
        };
      });
    };

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const onScroll = () => {
      const y = window.scrollY;
      const s = scrollRef.current;
      s.v = y - s.y;
      s.y = y;
      const max = Math.max(1, document.documentElement.scrollHeight - h);
      s.p = Math.min(1, Math.max(0, y / max));
    };

    const onPointer = (e: PointerEvent) => {
      pointerRef.current.tx = (e.clientX / w - 0.5) * 2;
      pointerRef.current.ty = (e.clientY / h - 0.5) * 2;
    };

    const draw = () => {
      const s = scrollRef.current;
      const pt = pointerRef.current;
      pt.x += (pt.tx - pt.x) * 0.06;
      pt.y += (pt.ty - pt.y) * 0.06;
      s.v *= 0.9;

      ctx.clearRect(0, 0, w, h);

      // Alone che segue lo scroll: fa "respirare" il fondo senza immagini
      const gx = w * (0.5 + pt.x * 0.12);
      const gy = h * (0.28 + s.p * 0.5);
      const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.62);
      const hue = 236 + s.p * 22;
      glow.addColorStop(0, `hsla(${hue}, 84%, 62%, 0.16)`);
      glow.addColorStop(0.45, `hsla(${hue + 10}, 76%, 48%, 0.06)`);
      glow.addColorStop(1, "hsla(240, 60%, 6%, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      const list = particles.current;
      const drift = s.v * 0.35;

      // Connessioni sottili (solo su schermi ampi, costo contenuto)
      if (w >= 768) {
        ctx.lineWidth = 0.5;
        for (let i = 0; i < list.length; i++) {
          const a = list[i];
          for (let j = i + 1; j < list.length; j++) {
            const b = list[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 15000) {
              const alpha = (1 - d2 / 15000) * 0.22;
              ctx.strokeStyle = `hsla(246, 88%, 74%, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      for (let i = 0; i < list.length; i++) {
        const p = list[i];
        p.x += p.vx + pt.x * p.z * 0.35;
        p.y += p.vy - drift * p.z;

        if (p.x < -40) p.x = w + 40;
        if (p.x > w + 40) p.x = -40;
        if (p.y < -40) p.y = h + 40;
        if (p.y > h + 40) p.y = -40;

        const hueP = HUES[i % HUES.length] + s.p * 18;
        const a = 0.3 + p.z * 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hueP}, 92%, ${68 + p.z * 12}%, ${a})`;
        ctx.fill();

        if (p.z > 0.75) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 4.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hueP}, 92%, 66%, 0.05)`;
          ctx.fill();
        }
      }

      rafRef.current = window.requestAnimationFrame(draw);
    };

    resize();
    onScroll();

    if (reduced) {
      // Render statico: una sola passata, nessun loop.
      draw();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    } else {
      rafRef.current = window.requestAnimationFrame(draw);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pointermove", onPointer, { passive: true });
    }
    window.addEventListener("resize", resize);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return (
    <div className="prestige-scrub-backdrop" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="prestige-scrub-vignette" />
    </div>
  );
}
