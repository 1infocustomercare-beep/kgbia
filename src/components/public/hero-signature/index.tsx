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
  food: { align: "left", intro: { x: -120, rotate: -2 }, reveal: { x: 130, align: "right" }, height: "h-[220svh]" },
  bakery: { align: "center", intro: { y: 110, scale: 1.16 }, reveal: { x: -120, align: "left" }, height: "h-[195svh]" },
  beauty: { align: "right", intro: { y: -110, scale: 0.88 }, reveal: { y: 130, align: "left" }, height: "h-[210svh]" },
  fitness: { align: "left", intro: { x: -70, rotate: -1.5 }, reveal: { x: 90, align: "left" }, height: "h-[180svh]" },
  healthcare: { align: "left", intro: { x: -90 }, reveal: { x: 110, align: "right" }, height: "h-[190svh]" },
  hotel: { align: "left", intro: { y: -140 }, reveal: { y: 140, align: "right" }, height: "h-[230svh]" },
  beach: { align: "center", intro: { y: 90, scale: 0.9 }, reveal: { x: -140, align: "left" }, height: "h-[205svh]" },
  retail: { align: "right", intro: { x: 150, rotate: 3 }, reveal: { x: -150, align: "left" }, height: "h-[200svh]" },
  trades: { align: "left", intro: { x: -150 }, reveal: { y: -120, align: "right" }, height: "h-[215svh]" },
  luxury: { align: "center", intro: { scale: 1.42 }, reveal: { y: 150, align: "center" }, height: "h-[240svh]" },
  ncc: { align: "left", intro: { x: -80 }, reveal: { x: 80, align: "right" }, height: "h-[180svh]" },
};

const alignClass = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
} as const;

/** The shell is deliberately sector-specific too: backdrop changes alone still feel templated. */
const PRESENTATION: Record<SignatureVariant, {
  intro: string;
  introInner: string;
  title: string;
  reveal: string;
  revealInner: string;
  chrome: "corners" | "rail" | "crosshair" | "none";
}> = {
  food: {
    intro: "justify-end pb-[16svh] sm:justify-center sm:pb-0",
    introInner: "mr-auto border-l-4 border-[color:var(--sig-accent)] pl-5 sm:pl-9",
    title: "max-w-[8ch] uppercase",
    reveal: "justify-start pt-[22svh]",
    revealInner: "ml-auto max-w-sm",
    chrome: "rail",
  },
  bakery: {
    intro: "justify-end pb-[12svh]",
    introInner: "mx-auto max-w-4xl",
    title: "italic leading-[0.95]",
    reveal: "justify-center",
    revealInner: "mr-auto max-w-md",
    chrome: "none",
  },
  beauty: {
    intro: "justify-start pt-[18svh]",
    introInner: "ml-auto max-w-2xl",
    title: "font-light leading-none",
    reveal: "justify-end pb-[12svh]",
    revealInner: "mr-auto max-w-sm",
    chrome: "none",
  },
  fitness: {
    intro: "justify-center",
    introInner: "mr-auto",
    title: "uppercase italic",
    reveal: "justify-center",
    revealInner: "mr-auto",
    chrome: "rail",
  },
  healthcare: {
    intro: "justify-center",
    introInner: "mr-auto max-w-xl border-t border-[color:var(--sig-accent)] pt-6",
    title: "leading-[0.96]",
    reveal: "justify-center",
    revealInner: "ml-auto max-w-md",
    chrome: "crosshair",
  },
  hotel: {
    intro: "justify-start pt-[17svh]",
    introInner: "mr-auto max-w-2xl",
    title: "max-w-[10ch] font-light",
    reveal: "justify-end pb-[11svh]",
    revealInner: "ml-auto max-w-md",
    chrome: "corners",
  },
  beach: {
    intro: "justify-center",
    introInner: "mx-auto max-w-5xl",
    title: "uppercase leading-[0.82]",
    reveal: "justify-end pb-[9svh]",
    revealInner: "mr-auto max-w-xl border-t border-[color:var(--sig-accent)] pt-5",
    chrome: "none",
  },
  retail: {
    intro: "justify-center",
    introInner: "ml-auto max-w-xl border-r-8 border-[color:var(--sig-accent)] pr-5 sm:pr-9",
    title: "uppercase leading-[0.84]",
    reveal: "justify-center",
    revealInner: "mr-auto max-w-md",
    chrome: "rail",
  },
  trades: {
    intro: "justify-end pb-[11svh]",
    introInner: "mr-auto max-w-xl border border-[color:var(--sig-accent)]/40 bg-background/65 p-5 backdrop-blur-md sm:p-8",
    title: "uppercase leading-[0.9]",
    reveal: "justify-start pt-[15svh]",
    revealInner: "ml-auto max-w-sm",
    chrome: "crosshair",
  },
  luxury: {
    intro: "justify-center",
    introInner: "mx-auto max-w-4xl",
    title: "uppercase leading-[0.8]",
    reveal: "justify-end pb-[10svh]",
    revealInner: "mx-auto max-w-lg",
    chrome: "corners",
  },
  ncc: {
    intro: "justify-end pb-[12svh]",
    introInner: "mr-auto max-w-2xl",
    title: "uppercase italic leading-[0.86]",
    reveal: "justify-center",
    revealInner: "ml-auto max-w-md",
    chrome: "rail",
  },
};

export type SignatureCinematicHeroProps = {
  variant: SignatureVariant;
  /** Optional sub-sector used to specialize shared sector families. */
  industry?: string;
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
  industry,
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
  const presentation = PRESENTATION[variant];
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

        {!reduced && <Backdrop progress={scrollYProgress} industry={industry} />}

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background)/0.75),transparent_35%,hsl(var(--background)/0.85))]" />
        <LuxeGrain opacity={0.05} />
        {presentation.chrome === "corners" && <LuxeCorners className="m-5 sm:m-8" />}
        {presentation.chrome === "rail" && (
          <div className="pointer-events-none absolute inset-y-0 right-5 z-10 hidden w-px bg-border/40 sm:block">
            <motion.span className="absolute right-0 w-1 bg-[color:var(--sig-accent)]" style={{ top: useTransform(scrollYProgress, [0, 1], ["0%", "92%"]), height: "8%" }} />
          </div>
        )}
        {presentation.chrome === "crosshair" && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-16 w-16 -translate-x-1/2 -translate-y-1/2 opacity-30">
            <span className="absolute left-0 top-1/2 h-px w-full bg-[color:var(--sig-accent)]" />
            <span className="absolute left-1/2 top-0 h-full w-px bg-[color:var(--sig-accent)]" />
          </div>
        )}

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
            presentation.intro,
            reduced && "relative inset-auto min-h-[80svh]",
          )}
          style={
            reduced
              ? undefined
              : { opacity: introOpacity, y: introY, x: introX, scale: introScale, rotate: introRotate }
          }
        >
          <div className={cn("max-w-3xl pt-16", presentation.introInner)}>
            <span
              className="inline-flex items-center gap-2 border bg-background/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.26em] backdrop-blur-xl"
              style={{ borderColor: "var(--sig-accent)", color: "var(--sig-accent)" }}
            >
              {eyebrow}
            </span>
            <h2
              className={cn("mt-6 font-heading text-[clamp(2.4rem,7vw,6.2rem)] font-semibold leading-[0.88] text-foreground [text-shadow:0_2px_28px_hsl(var(--background)/0.9)]", presentation.title)}
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
            presentation.reveal,
            reduced && "relative inset-auto pb-24 pt-4",
          )}
          style={reduced ? { opacity: 1 } : { opacity: revealOpacity, y: revealY, x: revealX }}
        >
          <div
            className={cn(
              "mt-20 max-w-lg px-1",
              presentation.revealInner,
              choreo.reveal.align === "right" ? "border-r pr-6 sm:pr-10" : "border-l pl-6 sm:pl-10",
            )}
            style={{ borderColor: "var(--sig-accent)" }}
          >
            {reveal.kicker && (
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--sig-accent)" }}>{reveal.kicker}</p>
            )}
            <p className="font-heading text-3xl font-semibold leading-tight text-foreground [text-shadow:0_2px_24px_hsl(var(--background)/0.9)] sm:text-5xl">{reveal.title}</p>
            {reveal.text && (
              <p className="mt-5 max-w-md text-sm leading-relaxed text-foreground/80 sm:text-base">{reveal.text}</p>
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
