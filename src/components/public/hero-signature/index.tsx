/**
 * ═══ SIGNATURE CINEMATIC HERO ═══
 *
 * Same craft as the Aurea Jet hero (pinned tall section, scroll-synced
 * choreography, progressive text reveal) but with a DIFFERENT motion signature
 * per sector — see `backdrops.tsx`.
 *
 * ADDITIVE: mount as the first section of a demo site. Headings use h2/p so
 * the page keeps a single H1.
 */
import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { LuxeCorners, LuxeGrain } from "@/components/public/luxe";
import { BACKDROPS, type SignatureVariant } from "./backdrops";

export type { SignatureVariant };

/** Per-sector text choreography — deliberately different per variant. */
const CHOREO: Record<
  SignatureVariant,
  {
    align: "left" | "center" | "right";
    intro: { x?: number; y?: number; scale?: number; rotate?: number };
    reveal: { x?: number; y?: number; align: "left" | "center" | "right" };
    height: string;
  }
> = {
  food: { align: "left", intro: { y: -70, scale: 0.94 }, reveal: { y: 80, align: "right" }, height: "h-[180svh]" },
  bakery: { align: "center", intro: { scale: 1.08 }, reveal: { y: 60, align: "center" }, height: "h-[180svh]" },
  beauty: { align: "center", intro: { y: -50, scale: 1.04 }, reveal: { y: 70, align: "center" }, height: "h-[180svh]" },
  fitness: { align: "left", intro: { x: -70, rotate: -1.5 }, reveal: { x: 90, align: "left" }, height: "h-[180svh]" },
  healthcare: { align: "center", intro: { y: -40 }, reveal: { y: 50, align: "center" }, height: "h-[180svh]" },
  hotel: { align: "left", intro: { y: -90 }, reveal: { y: 90, align: "right" }, height: "h-[180svh]" },
  beach: { align: "left", intro: { y: -60, scale: 0.97 }, reveal: { y: 70, align: "left" }, height: "h-[180svh]" },
  retail: { align: "center", intro: { scale: 0.92 }, reveal: { y: 60, align: "center" }, height: "h-[180svh]" },
  trades: { align: "left", intro: { x: -60 }, reveal: { x: 70, align: "left" }, height: "h-[180svh]" },
  luxury: { align: "right", intro: { y: -70, scale: 1.06 }, reveal: { y: 80, align: "left" }, height: "h-[180svh]" },
  ncc: { align: "left", intro: { x: -80 }, reveal: { x: 80, align: "right" }, height: "h-[180svh]" },
};

const alignClass = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
} as const;

export type SignatureCinematicHeroProps = {
  variant: SignatureVariant;
  eyebrow: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  reveal: { kicker?: ReactNode; title: ReactNode; text?: ReactNode };
  /** Optional photographic backdrop behind the sector choreography. */
  image?: string;
  brand?: { name: ReactNode; tagline?: ReactNode; icon?: ReactNode };
  /** Sector accent colour (any CSS colour). Falls back to the primary token. */
  accent?: string;
  action?: ReactNode;
  className?: string;
};

export function SignatureCinematicHero({
  variant,
  eyebrow,
  title,
  subtitle,
  reveal,
  image,
  brand,
  accent,
  action,
  className,
}: SignatureCinematicHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end end"] });

  const choreo = CHOREO[variant];
  const Backdrop = BACKDROPS[variant];

  const introOpacity = useTransform(scrollYProgress, [0, 0.14, 0.3], [1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.3], [0, choreo.intro.y ?? 0]);
  const introX = useTransform(scrollYProgress, [0, 0.3], [0, choreo.intro.x ?? 0]);
  const introScale = useTransform(scrollYProgress, [0, 0.3], [1, choreo.intro.scale ?? 1]);
  const introRotate = useTransform(scrollYProgress, [0, 0.3], [0, choreo.intro.rotate ?? 0]);

  const revealOpacity = useTransform(scrollYProgress, [0.26, 0.42, 1], [0, 1, 1]);
  const revealY = useTransform(scrollYProgress, [0.26, 0.5], [choreo.reveal.y ?? 0, 0]);
  const revealX = useTransform(scrollYProgress, [0.26, 0.5], [choreo.reveal.x ?? 0, 0]);

  // Transform-based pin: works even when an ancestor uses overflow clip/hidden
  // (position: sticky silently fails inside such containers).
  const pinY = useTransform(scrollYProgress, [0, 1], ["0svh", "80svh"]);

  const imgScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.16]);
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 56]);
  const veil = useTransform(scrollYProgress, [0, 0.6, 1], [0.5, 0.7, 0.42]);

  return (
    <section
      ref={heroRef}
      className={cn("relative bg-background", reduced ? "h-auto" : choreo.height, className)}
      style={{ ["--sig-accent" as string]: accent ?? "hsl(var(--primary))" } as React.CSSProperties}
    >
      <motion.div
        className={cn("relative overflow-hidden", reduced ? "h-auto min-h-[100svh]" : "h-[100svh]")}
        style={reduced ? undefined : { y: pinY, willChange: "transform" }}
      >
        {image && (
          <motion.img
            src={image}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            style={reduced ? undefined : { scale: imgScale, y: imgY }}
          />
        )}
        <motion.div className="absolute inset-0 bg-background" style={{ opacity: reduced ? 0.55 : veil }} />

        {!reduced && <Backdrop progress={scrollYProgress} />}

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background)/0.75),transparent_35%,hsl(var(--background)/0.85))]" />
        <LuxeGrain opacity={0.05} />
        <LuxeCorners className="m-5 sm:m-8" />

        {brand && (
          <header className="absolute inset-x-0 top-0 z-40 flex h-20 items-center justify-between border-b border-border/30 px-5 sm:px-10 lg:px-16">
            <div className="ml-12 flex items-center gap-3 sm:ml-0">
              {brand.icon && (
                <div className="flex h-10 w-10 items-center justify-center border border-primary/45 bg-background/55 backdrop-blur-xl">
                  {brand.icon}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em]">{brand.name}</p>
                {brand.tagline && (
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{brand.tagline}</p>
                )}
              </div>
            </div>
            {action}
          </header>
        )}

        {/* Intro block */}
        <motion.div
          className={cn(
            "absolute inset-0 z-20 flex flex-col justify-center px-5 sm:px-10 lg:px-16",
            alignClass[choreo.align],
            reduced && "relative inset-auto min-h-[80svh]",
          )}
          style={
            reduced
              ? undefined
              : { opacity: introOpacity, y: introY, x: introX, scale: introScale, rotate: introRotate }
          }
        >
          <div className="max-w-3xl pt-16">
            <span
              className="inline-flex items-center gap-2 border bg-background/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.26em] backdrop-blur-xl"
              style={{ borderColor: "var(--sig-accent)", color: "var(--sig-accent)" }}
            >
              {eyebrow}
            </span>
            <h2
              className="mt-6 font-heading text-[clamp(2.4rem,7vw,6.2rem)] font-semibold leading-[0.88] text-foreground [text-shadow:0_2px_28px_hsl(var(--background)/0.9)]"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-foreground/75 sm:text-lg">{subtitle}</p>
            )}
          </div>
        </motion.div>

        {/* Reveal block */}
        <motion.div
          className={cn(
            "absolute inset-0 z-20 flex flex-col justify-center px-5 sm:px-10 lg:px-16",
            alignClass[choreo.reveal.align],
            reduced && "relative inset-auto pb-24 pt-4",
          )}
          style={reduced ? { opacity: 1 } : { opacity: revealOpacity, y: revealY, x: revealX }}
        >
          <div
            className={cn(
              "mt-20 max-w-lg px-1",
              choreo.reveal.align === "right" ? "border-r pr-6 sm:pr-10" : "border-l pl-6 sm:pl-10",
            )}
            style={{ borderColor: "var(--sig-accent)" }}
          >
            {reveal.kicker && (
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--sig-accent)" }}>{reveal.kicker}</p>
            )}
            <p className="font-heading text-3xl font-semibold leading-none sm:text-5xl">{reveal.title}</p>
            {reveal.text && (
              <p className="mt-5 max-w-md text-sm leading-relaxed text-foreground/70 sm:text-base">{reveal.text}</p>
            )}
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-7 left-1/2 z-30 -translate-x-1/2 text-center"
          style={reduced ? undefined : { opacity: introOpacity }}
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-foreground/60">Scorri</span>
          <ChevronDown className="mx-auto mt-2 h-5 w-5 animate-bounce" style={{ color: "var(--sig-accent)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default SignatureCinematicHero;
