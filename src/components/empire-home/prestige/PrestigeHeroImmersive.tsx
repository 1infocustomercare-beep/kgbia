import { useEffect, useRef } from "react";

/**
 * PrestigeHeroImmersive — livello cinematografico 3D interattivo per la hero.
 *
 * Tre strati compositi, tutti dentro un singolo <canvas> (un solo RAF, zero DOM
 * thrash):
 *  1. Warp tunnel di particelle con profondità reale (proiezione prospettica).
 *     La velocità del warp reagisce alla velocità di scroll → sensazione di
 *     "salto iperspaziale" mentre l'utente scende.
 *  2. Griglia prospettica sul pavimento che si muove verso l'osservatore e
 *     ruota leggermente con il puntatore (camera yaw).
 *  3. Anelli oro concentrici che pulsano sul ritmo dello scroll.
 *
 * Il canvas vive DIETRO ai contenuti della hero (z-0) e non intercetta eventi.
 * Rispetta prefers-reduced-motion (render statico, nessun RAF).
 */
export default function PrestigeHeroImmersive() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const COUNT = isMobile ? 130 : 320;
    const FOCAL = 620;

    type P = { x: number; y: number; z: number; r: number; hue: number };
    const parts: P[] = [];

    const spawn = (zFront = false): P => ({
      x: (Math.random() - 0.5) * 2600,
      y: (Math.random() - 0.5) * 1700,
      z: zFront ? Math.random() * 1800 + 60 : Math.random() * 1800 + 60,
      r: Math.random() * 1.9 + 0.5,
      hue: Math.random() < 0.62 ? 44 : Math.random() < 0.6 ? 258 : 165,
    });
    for (let i = 0; i < COUNT; i++) parts.push(spawn(true));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // ── input: puntatore (camera yaw/pitch) + scroll (warp speed) ──────────
    let px = 0;
    let py = 0;
    let tpx = 0;
    let tpy = 0;
    const onMove = (e: PointerEvent) => {
      tpx = e.clientX / window.innerWidth - 0.5;
      tpy = e.clientY / window.innerHeight - 0.5;
    };
    if (!isMobile) window.addEventListener("pointermove", onMove, { passive: true });

    let lastScroll = window.scrollY;
    let warp = 0; // 0..1
    const onScroll = () => {
      const dy = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      warp = Math.min(1, warp + Math.min(Math.abs(dy) / 90, 0.5));
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    let t = 0;

    const draw = () => {
      t += 0.016;
      warp *= 0.93;
      px += (tpx - px) * 0.06;
      py += (tpy - py) * 0.06;

      const cx = w / 2 + px * (isMobile ? 0 : 120);
      const cy = h * 0.5 + py * (isMobile ? 0 : 70);

      ctx.clearRect(0, 0, w, h);

      // ── 1. griglia prospettica (pavimento) ──────────────────────────────
      const horizon = h * 0.58;
      ctx.save();
      ctx.lineWidth = 1;
      // linee orizzontali che scorrono verso l'osservatore
      const rows = 16;
      const offset = (t * (0.12 + warp * 0.6)) % 1;
      for (let i = 0; i < rows; i++) {
        const k = (i + offset) / rows; // 0 = horizon, 1 = vicino
        const y = horizon + Math.pow(k, 2.6) * (h - horizon) * 1.35;
        if (y > h + 4) continue;
        const a = (1 - k) * 0.16 + 0.02;
        ctx.strokeStyle = `hsla(44, 78%, 62%, ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      // linee di fuga
      const cols = isMobile ? 9 : 15;
      for (let i = 0; i <= cols; i++) {
        const nx = (i / cols - 0.5) * 2;
        const vx = cx + nx * 60;
        const bx = cx + nx * w * 1.9;
        ctx.strokeStyle = `hsla(258, 74%, 70%, ${(0.055 + Math.abs(nx) * 0.03).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(vx, horizon);
        ctx.lineTo(bx, h);
        ctx.stroke();
      }
      ctx.restore();

      // ── 2. anelli oro pulsanti sul punto di fuga ────────────────────────
      for (let i = 0; i < 3; i++) {
        const phase = (t * 0.22 + i / 3) % 1;
        const rad = 60 + phase * (isMobile ? 320 : 560);
        const a = (1 - phase) * 0.22 * (0.5 + warp);
        ctx.strokeStyle = `hsla(44, 84%, 64%, ${a.toFixed(3)})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(cx, horizon, rad, rad * 0.34, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // ── 3. warp tunnel di particelle ────────────────────────────────────
      const speed = 1.6 + warp * 26;
      for (const p of parts) {
        p.z -= speed;
        if (p.z < 40) {
          const np = spawn();
          np.z = 1900;
          Object.assign(p, np);
        }
        const s = FOCAL / p.z;
        const x = cx + (p.x + px * 420) * s;
        const y = cy + (p.y + py * 260) * s;
        if (x < -40 || x > w + 40 || y < -40 || y > h + 40) continue;

        const depth = 1 - p.z / 1900;
        const alpha = Math.min(0.85, depth * 0.9);
        const radius = Math.max(0.4, p.r * s * 1.5);

        // scia in warp: la particella diventa un tratto luminoso
        const trail = warp * speed * s * 0.9;
        if (trail > 1.5) {
          ctx.strokeStyle = `hsla(${p.hue}, 88%, ${p.hue === 44 ? 68 : 74}%, ${(alpha * 0.7).toFixed(3)})`;
          ctx.lineWidth = radius * 1.1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          const dx = x - cx;
          const dy = y - cy;
          const len = Math.hypot(dx, dy) || 1;
          ctx.lineTo(x + (dx / len) * trail, y + (dy / len) * trail);
          ctx.stroke();
        } else {
          ctx.fillStyle = `hsla(${p.hue}, 88%, ${p.hue === 44 ? 70 : 76}%, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = window.requestAnimationFrame(draw);
    };

    if (reduced) {
      draw();
      window.cancelAnimationFrame(raf);
    } else {
      raf = window.requestAnimationFrame(draw);
    }

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full" style={{ display: "block" }} />
      {/* vignette per mantenere il testo leggibile sopra al tunnel */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 0%, hsl(250 40% 5% / 0.45) 58%, hsl(250 42% 4% / 0.82) 100%)",
        }}
      />
    </div>
  );
}
