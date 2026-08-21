/**
 * ═══ JET SCROLL KIT ═══
 * Primitive di scroll cinematografico ricostruite dal linguaggio di movimento
 * del sito di riferimento (Ruzza) e adattate all'aviazione privata:
 *
 *  · ScrollWords   — rivelazione parola-per-parola pilotata dallo scroll
 *  · ScrollMarquee — nastro infinito con skew e drift legati alla velocità
 *  · ClipCurtain   — immagine che si apre a tendina (clip-path) sullo scroll
 *  · ScrollCounter — numeri che salgono all'ingresso in viewport
 *  · LineWipe      — hairline che si disegna da sinistra
 *
 * ADDITIVO — solo presentazione, nessuna logica di business.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────── ScrollWords */

export function ScrollWords({
  text,
  className,
  accent,
  offset = ["start 0.85", "end 0.45"] as const,
}: {
  text: string;
  className?: string;
  /** parole (0-based) da colorare con l'accento */
  accent?: number[];
  offset?: readonly [string, string];
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as unknown as ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");

  return (
    <p ref={ref} className={cn("flex flex-wrap gap-x-[0.28em] gap-y-1", className)}>
      {words.map((w, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word
            key={`${w}-${i}`}
            progress={scrollYProgress}
            range={[start, end]}
            reduced={!!reduced}
            accent={accent?.includes(i)}
          >
            {w}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  reduced,
  accent,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  reduced: boolean;
  accent?: boolean;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  const y = useTransform(progress, range, [12, 0]);
  const blur = useTransform(progress, range, [6, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  return (
    <motion.span
      className={cn("inline-block", accent && "italic text-primary")}
      style={reduced ? undefined : { opacity, y, filter }}
    >
      {children}
    </motion.span>
  );
}

/* ──────────────────────────────────────────────────────────── ScrollMarquee */

export function ScrollMarquee({
  items,
  baseSpeed = 26,
  className,
  separator = "✦",
}: {
  items: string[];
  baseSpeed?: number;
  className?: string;
  separator?: string;
}) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 320, damping: 48 });
  const boost = useTransform(smooth, [-2200, 0, 2200], [-4.2, 1, 4.2], { clamp: false });
  const skew = useTransform(smooth, [-2400, 0, 2400], [-5, 0, 5], { clamp: true });
  const dir = useRef(1);

  useMotionValueEvent(smooth, "change", (v) => {
    if (v !== 0) dir.current = v < 0 ? -1 : 1;
  });

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const move = dir.current * baseSpeed * (delta / 1000) * Math.abs(boost.get() || 1);
    let next = x.get() - move;
    if (next <= -50) next += 50;
    if (next > 0) next -= 50;
    x.set(next);
  });

  const row = [...items, ...items, ...items, ...items];

  return (
    <div className={cn("relative overflow-hidden border-y border-border/50 bg-card/40 py-4", className)}>
      <motion.div
        className="flex w-[200%] shrink-0 items-center whitespace-nowrap will-change-transform"
        style={reduced ? undefined : { x: useTransform(x, (v) => `${v}%`), skewX: skew }}
      >
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-6 px-6 text-[11px] font-semibold uppercase tracking-[0.32em] text-foreground/70"
          >
            {item}
            <span className="text-primary">{separator}</span>
          </span>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── ClipCurtain */

export function ClipCurtain({
  src,
  alt,
  caption,
  className,
  from = "bottom",
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  from?: "bottom" | "left";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "center 0.55"] });
  const inset = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clip = useTransform(inset, (v) =>
    from === "bottom" ? `inset(${v}% 0% 0% 0%)` : `inset(0% ${v}% 0% 0%)`,
  );
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);

  return (
    <figure ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div className="absolute inset-0" style={reduced ? undefined : { clipPath: clip }}>
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          style={reduced ? undefined : { scale }}
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,hsl(var(--background)/0.85)_100%)]" />
      {caption && (
        <figcaption className="absolute inset-x-0 bottom-0 p-5 text-[10px] uppercase tracking-[0.28em] text-foreground/70">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ────────────────────────────────────────────────────────────── ScrollCounter */

export function ScrollCounter({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1500,
  className,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("it-IT", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────── LineWipe */

export function LineWipe({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <div ref={ref} className={cn("h-px w-full bg-border/50", className)}>
      <div
        className="h-px bg-primary transition-[width] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ width: inView ? "100%" : "0%" }}
      />
    </div>
  );
}
