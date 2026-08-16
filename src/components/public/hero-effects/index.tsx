/**
 * ═══ HERO EFFECTS — one signature effect per demo site ═══
 *
 * Every public demo site gets its OWN cinematic hero effect, designed to be
 * coherent with its sector (embers for grill/food, flour dust for bakery,
 * silk ribbons for beauty, ECG for healthcare, waves for beach, ...).
 *
 * All effects are:
 * - purely decorative overlays: `absolute inset-0 pointer-events-none`
 * - GPU/canvas friendly, paused when out of view or tab hidden
 * - disabled (single static frame) under `prefers-reduced-motion`
 *
 * ADDITIVE ONLY: mount inside an existing hero `<section className="relative">`.
 */
import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useHeroCanvas } from "./useHeroRaf";

const layer = "pointer-events-none absolute inset-0";

/* ══════════════════════════════════════════════════════════
   1) FOOD — embers rising from the grill + smoke wisps
   ══════════════════════════════════════════════════════════ */
export function FoodEmberDrift({ color = "#ff8a3d" }: { color?: string }) {
  const embers = useMemo(
    () =>
      Array.from({ length: 46 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.6 + Math.random() * 1.9,
        speed: 0.02 + Math.random() * 0.06,
        drift: (Math.random() - 0.5) * 0.05,
        phase: Math.random() * Math.PI * 2,
      })),
    [],
  );

  const ref = useHeroCanvas((ctx, t, w, h) => {
    ctx.globalCompositeOperation = "lighter";
    embers.forEach((e) => {
      const y = (e.y - t * e.speed) % 1;
      const yy = (y < 0 ? y + 1 : y) * h;
      const xx = (e.x + Math.sin(t * 0.6 + e.phase) * e.drift) * w;
      const alpha = 0.25 + 0.55 * Math.abs(Math.sin(t * 1.4 + e.phase));
      const g = ctx.createRadialGradient(xx, yy, 0, xx, yy, e.r * 7);
      g.addColorStop(0, `${color}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(xx, yy, e.r * 7, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalCompositeOperation = "source-over";
  });

  return (
    <div className={`${layer} z-[1] overflow-hidden`} aria-hidden>
      <canvas ref={ref} className="absolute inset-0 h-full w-full opacity-80" />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: `radial-gradient(120% 80% at 50% 120%, ${color}26, transparent 65%)` }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   2) BAKERY — flour dust in warm morning light shafts
   ══════════════════════════════════════════════════════════ */
export function BakeryFlourLight({ color = "#f6e3c5" }: { color?: string }) {
  const motes = useMemo(
    () =>
      Array.from({ length: 60 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.5 + Math.random() * 1.4,
        speed: 0.008 + Math.random() * 0.03,
        sway: 0.02 + Math.random() * 0.06,
        phase: Math.random() * Math.PI * 2,
      })),
    [],
  );

  const ref = useHeroCanvas((ctx, t, w, h) => {
    ctx.fillStyle = color;
    motes.forEach((m) => {
      const y = (m.y + t * m.speed) % 1;
      const xx = (m.x + Math.sin(t * 0.4 + m.phase) * m.sway) * w;
      ctx.globalAlpha = 0.15 + 0.35 * Math.abs(Math.sin(t + m.phase));
      ctx.beginPath();
      ctx.arc(xx, y * h, m.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  });

  return (
    <div className={`${layer} z-[1] overflow-hidden`} aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute -top-1/3 h-[180%] w-[16%] blur-[2px]"
          style={{
            left: `${12 + i * 28}%`,
            transform: "rotate(14deg)",
            background: `linear-gradient(180deg, ${color}00, ${color}22 35%, ${color}00)`,
          }}
          animate={{ opacity: [0.35, 0.8, 0.35] }}
          transition={{ duration: 7 + i * 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   3) BEAUTY — silk ribbons + rose-gold shimmer
   ══════════════════════════════════════════════════════════ */
export function BeautySilkRibbons({
  from = "#e8b4c8",
  to = "#d4a24c",
}: { from?: string; to?: string }) {
  return (
    <div className={`${layer} z-[1] overflow-hidden`} aria-hidden>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <defs>
          <linearGradient id="silk-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} stopOpacity="0.55" />
            <stop offset="100%" stopColor={to} stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="silk-b" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={to} stopOpacity="0.4" />
            <stop offset="100%" stopColor={from} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {[
          { d: "M-100,520 C220,380 420,660 720,470 C960,320 1120,470 1320,380", stroke: "url(#silk-a)", w: 34, dur: 13 },
          { d: "M-100,620 C260,520 480,740 780,560 C1000,430 1160,560 1320,470", stroke: "url(#silk-b)", w: 20, dur: 17 },
          { d: "M-100,400 C200,300 460,520 760,340 C980,210 1140,340 1320,260", stroke: "url(#silk-a)", w: 10, dur: 21 },
        ].map((r, i) => (
          <motion.path
            key={i}
            d={r.d}
            fill="none"
            stroke={r.stroke}
            strokeWidth={r.w}
            strokeLinecap="round"
            style={{ filter: "blur(0.6px)" }}
            animate={{ y: [0, -22, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: r.dur, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>
      <motion.div
        className="absolute inset-y-0 w-1/3"
        style={{ background: `linear-gradient(90deg, transparent, ${from}2e, transparent)` }}
        animate={{ x: ["-40%", "160%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   4) FITNESS — energy pulse rings + reactive bars
   ══════════════════════════════════════════════════════════ */
export function FitnessPulseWave({ color = "#c8ff3d" }: { color?: string }) {
  const bars = useMemo(
    () => Array.from({ length: 34 }, (_, i) => ({ i, phase: Math.random() * Math.PI * 2 })),
    [],
  );

  const ref = useHeroCanvas((ctx, t, w, h) => {
    // Pulse rings
    ctx.globalCompositeOperation = "lighter";
    for (let k = 0; k < 3; k++) {
      const p = ((t * 0.35 + k / 3) % 1);
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.25 * (1 - p);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.55, p * Math.max(w, h) * 0.6, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Equalizer bars
    ctx.globalAlpha = 1;
    const bw = w / bars.length;
    bars.forEach((b) => {
      const amp = 0.06 + 0.22 * Math.abs(Math.sin(t * 2.2 + b.phase));
      const bh = amp * h;
      const g = ctx.createLinearGradient(0, h - bh, 0, h);
      g.addColorStop(0, `${color}00`);
      g.addColorStop(1, `${color}66`);
      ctx.fillStyle = g;
      ctx.fillRect(b.i * bw + bw * 0.25, h - bh, bw * 0.5, bh);
    });
    ctx.globalCompositeOperation = "source-over";
  });

  return (
    <div className={`${layer} z-[1] overflow-hidden`} aria-hidden>
      <canvas ref={ref} className="absolute inset-0 h-full w-full opacity-70" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   5) HEALTHCARE — calm ECG trace + breathing halo
   ══════════════════════════════════════════════════════════ */
export function HealthcareEcgTrace({ color = "#4fd1c5" }: { color?: string }) {
  const ref = useHeroCanvas((ctx, t, w, h) => {
    const baseline = h * 0.72;
    const speed = w * 0.22;
    const head = (t * speed) % (w + 200);

    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.beginPath();

    for (let x = 0; x <= w; x += 2) {
      const d = head - x;
      const alpha = d < 0 ? 0 : Math.max(0, 1 - d / (w * 0.8));
      if (alpha <= 0) continue;
      const u = ((x + t * speed) % 260) / 260;
      let y = 0;
      if (u < 0.42) y = Math.sin(u * Math.PI * 2) * 3;
      else if (u < 0.5) y = -((u - 0.42) / 0.08) * 46;
      else if (u < 0.56) y = -46 + ((u - 0.5) / 0.06) * 74;
      else if (u < 0.62) y = 28 - ((u - 0.56) / 0.06) * 28;
      else y = Math.sin(u * Math.PI * 4) * 2;
      ctx.globalAlpha = alpha * 0.85;
      if (x === 0) ctx.moveTo(x, baseline + y);
      else ctx.lineTo(x, baseline + y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  });

  return (
    <div className={`${layer} z-[1] overflow-hidden`} aria-hidden>
      <motion.div
        className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: `radial-gradient(circle, ${color}1f, transparent 65%)`, filter: "blur(40px)" }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <canvas ref={ref} className="absolute inset-0 h-full w-full opacity-80" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   6) HOTEL — golden dust + slow aurora veil
   ══════════════════════════════════════════════════════════ */
export function HotelGoldenAura({ color = "#d4b063" }: { color?: string }) {
  const dust = useMemo(
    () =>
      Array.from({ length: 54 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.5 + Math.random() * 1.6,
        speed: 0.006 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
      })),
    [],
  );

  const ref = useHeroCanvas((ctx, t, w, h) => {
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = color;
    dust.forEach((d) => {
      const y = (d.y - t * d.speed) % 1;
      const yy = (y < 0 ? y + 1 : y) * h;
      const xx = (d.x + Math.sin(t * 0.25 + d.phase) * 0.03) * w;
      ctx.globalAlpha = 0.2 + 0.5 * Math.abs(Math.sin(t * 0.8 + d.phase));
      ctx.beginPath();
      ctx.arc(xx, yy, d.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  });

  return (
    <div className={`${layer} z-[1] overflow-hidden`} aria-hidden>
      <motion.div
        className="absolute -inset-x-1/4 top-[-20%] h-[70%]"
        style={{
          background: `conic-gradient(from 200deg at 50% 100%, transparent, ${color}24, transparent 60%)`,
          filter: "blur(60px)",
        }}
        animate={{ rotate: [-4, 4, -4], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   7) BEACH — layered waves parallax + sun glare
   ══════════════════════════════════════════════════════════ */
export function BeachSunWaves({
  sun = "#ffc46b",
  sea = "#3aa8c1",
}: { sun?: string; sea?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div ref={wrapRef} className={`${layer} z-[1] overflow-hidden`} aria-hidden>
      <motion.div
        className="absolute left-1/2 top-[18%] h-[46vmin] w-[46vmin] -translate-x-1/2 rounded-full"
        style={{ background: `radial-gradient(circle, ${sun}59, transparent 62%)`, filter: "blur(30px)" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      {[
        { fill: `${sea}33`, dur: 11, y: y1, offset: "78%" },
        { fill: `${sea}4d`, dur: 8, y: y2, offset: "86%" },
      ].map((wv, i) => (
        <motion.svg
          key={i}
          className="absolute inset-x-[-10%] w-[120%]"
          style={{ top: wv.offset, y: wv.y }}
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          animate={{ x: ["-4%", "4%", "-4%"] }}
          transition={{ duration: wv.dur, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M0,90 C150,150 300,30 450,90 C600,150 750,30 900,90 C1050,150 1150,60 1200,90 L1200,200 L0,200 Z"
            fill={wv.fill}
          />
        </motion.svg>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   8) NCC — headlight sweep + motion speed lines
   ══════════════════════════════════════════════════════════ */
export function NccLightSweep({ color = "#c9a84c" }: { color?: string }) {
  const lines = useMemo(
    () =>
      Array.from({ length: 26 }, () => ({
        y: Math.random(),
        len: 0.08 + Math.random() * 0.3,
        speed: 0.35 + Math.random() * 0.9,
        delay: Math.random(),
      })),
    [],
  );

  const ref = useHeroCanvas((ctx, t, w, h) => {
    ctx.globalCompositeOperation = "lighter";
    lines.forEach((l) => {
      const p = ((t * l.speed + l.delay) % 1.4) - 0.2;
      const x = p * w;
      const len = l.len * w;
      const g = ctx.createLinearGradient(x - len, 0, x, 0);
      g.addColorStop(0, `${color}00`);
      g.addColorStop(1, `${color}80`);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x - len, l.y * h);
      ctx.lineTo(x, l.y * h);
      ctx.stroke();
    });
    ctx.globalCompositeOperation = "source-over";
  });

  return (
    <div className={`${layer} z-[1] overflow-hidden`} aria-hidden>
      <canvas ref={ref} className="absolute inset-0 h-full w-full opacity-60" />
      <motion.div
        className="absolute inset-y-0 w-[45%] skew-x-[-12deg]"
        style={{ background: `linear-gradient(90deg, transparent, ${color}1f, transparent)` }}
        animate={{ x: ["-60%", "180%"] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   9) RETAIL — boutique spotlight sweep + glass sheen
   ══════════════════════════════════════════════════════════ */
export function RetailSpotlightSheen({ color = "#f2d9a0" }: { color?: string }) {
  return (
    <div className={`${layer} z-[1] overflow-hidden`} aria-hidden>
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="absolute -top-[35%] h-[150%] w-[38%]"
          style={{
            left: `${i * 45}%`,
            transformOrigin: "top center",
            background: `linear-gradient(180deg, ${color}2b, ${color}0d 45%, transparent 75%)`,
            filter: "blur(14px)",
            clipPath: "polygon(42% 0%, 58% 0%, 100% 100%, 0% 100%)",
          }}
          animate={{ rotate: i === 0 ? [-8, 8, -8] : [9, -7, 9], opacity: [0.45, 0.85, 0.45] }}
          transition={{ duration: 12 + i * 3, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <motion.div
        className="absolute inset-y-0 w-1/4 skew-x-[-18deg]"
        style={{ background: `linear-gradient(90deg, transparent, #ffffff26, transparent)` }}
        animate={{ x: ["-50%", "220%"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   10) TRADES — blueprint grid + welding sparks
   ══════════════════════════════════════════════════════════ */
export function TradesBlueprintSparks({ color = "#ffb020" }: { color?: string }) {
  const sparks = useMemo(
    () =>
      Array.from({ length: 30 }, () => ({
        x: Math.random(),
        y: 0.55 + Math.random() * 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(0.15 + Math.random() * 0.3),
        life: Math.random(),
        dur: 0.8 + Math.random() * 1.2,
      })),
    [],
  );

  const ref = useHeroCanvas((ctx, t, w, h) => {
    ctx.globalCompositeOperation = "lighter";
    sparks.forEach((s) => {
      const p = ((t / s.dur + s.life) % 1);
      const x = (s.x + s.vx * p) * w;
      const y = (s.y + s.vy * p + 0.35 * p * p) * h;
      ctx.globalAlpha = Math.max(0, 1 - p) * 0.9;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `${color}66`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - s.vx * w * 0.02, y - s.vy * h * 0.02);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  });

  return (
    <div className={`${layer} z-[1] overflow-hidden`} aria-hidden>
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff14 1px, transparent 1px), linear-gradient(90deg, #ffffff14 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(120% 90% at 50% 40%, #000 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(120% 90% at 50% 40%, #000 30%, transparent 75%)",
        }}
        animate={{ backgroundPositionX: ["0px", "56px"], backgroundPositionY: ["0px", "56px"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   11) LUXURY / SHOWCASE — obsidian sheen + gold particle field
   ══════════════════════════════════════════════════════════ */
export function LuxuryObsidianSheen({ color = "#d4af37" }: { color?: string }) {
  const nodes = useMemo(
    () =>
      Array.from({ length: 40 }, () => ({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.012,
        vy: (Math.random() - 0.5) * 0.012,
      })),
    [],
  );

  const ref = useHeroCanvas((ctx, t, w, h) => {
    const pts = nodes.map((n) => {
      const x = (((n.x + n.vx * t) % 1) + 1) % 1;
      const y = (((n.y + n.vy * t) % 1) + 1) % 1;
      return { x: x * w, y: y * h };
    });
    ctx.lineWidth = 0.6;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d = Math.hypot(dx, dy);
        const max = Math.min(w, h) * 0.24;
        if (d < max) {
          ctx.strokeStyle = `${color}${Math.round((1 - d / max) * 60)
            .toString(16)
            .padStart(2, "0")}`;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.fillStyle = `${color}99`;
    pts.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
      ctx.fill();
    });
  });

  return (
    <div className={`${layer} z-[1] overflow-hidden`} aria-hidden>
      <canvas ref={ref} className="absolute inset-0 h-full w-full opacity-60" />
      <motion.div
        className="absolute inset-y-0 w-1/3 skew-x-[-14deg]"
        style={{ background: `linear-gradient(90deg, transparent, ${color}1a, transparent)` }}
        animate={{ x: ["-50%", "200%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
