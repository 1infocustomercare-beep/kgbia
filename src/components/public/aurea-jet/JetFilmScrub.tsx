/**
 * ═══ JET FILM SCRUB ═══
 * Cinematic scroll-scrubbed film: the cabin dolly video advances frame by frame
 * with the scroll position (Ruzza-style editorial film), with sequential
 * caption reveals pinned over the footage.
 *
 * ADDITIVE — presentational only.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import cabinFilm from "@/assets/aurea-jet/aurea-journey.mp4.asset.json";
import cabinPoster from "@/assets/aurea-jet/tarmac-night.jpg";
import { clampProgress, JET_SCROLL } from "./jet-motion";

const CAPTIONS = [
  { at: 0.04, kicker: "01 · Avvicinamento", title: "La pista è già tua.", text: "Arrivi al terminal privato. Equipaggio, slot e bagagli sono già coordinati." },
  { at: 0.29, kicker: "02 · Ingresso", title: "Dal piazzale alla suite.", text: "Nessun gate: attraversi la porta e il viaggio cambia immediatamente ritmo." },
  { at: 0.54, kicker: "03 · Materia", title: "Silenzio, pelle, luce.", text: "Ogni superficie e ogni atmosfera sono preparate sul tuo profilo di viaggio." },
  { at: 0.79, kicker: "04 · Quota", title: "Il tempo torna privato.", text: "Servizio discreto, continuità operativa e il mondo che scorre sotto di te." },
];

export default function JetFilmScrub() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number>();
  const activeRef = useRef(false);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });

  const frameScale = useTransform(scrollYProgress, [0, 0.48, 1], [1.045, 1, 1.025]);
  const veil = useTransform(scrollYProgress, [0, 0.46, 1], [0.66, 0.34, 0.58]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    targetRef.current = clampProgress(p);
    activeRef.current = p > 0.005 && p < 0.995;
    let idx = 0;
    CAPTIONS.forEach((c, i) => {
      if (p >= c.at - 0.06) idx = i;
    });
    setActive(idx);
  });

  useEffect(() => {
    if (reduced) return;
    const loop = () => {
      const video = videoRef.current;
      if (activeRef.current && video && video.duration && !Number.isNaN(video.duration)) {
        currentRef.current += (targetRef.current - currentRef.current) * 0.2;
        const t = currentRef.current * (video.duration - 0.05);
        if (Math.abs(video.currentTime - t) > 0.02) video.currentTime = t;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  return (
    <section ref={wrapRef} className={`relative bg-background ${JET_SCROLL.filmHeight}`}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0" style={reduced ? undefined : { scale: frameScale }}>
          <video
            ref={videoRef}
            src={cabinFilm.url}
            poster={cabinPoster}
            muted
            playsInline
            preload="metadata"
            autoPlay={!!reduced}
            loop={!!reduced}
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <motion.div className="absolute inset-0 bg-background" style={{ opacity: reduced ? 0.5 : veil }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--background)/0.92)_0%,hsl(var(--background)/0.24)_58%,transparent_100%)]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background to-transparent" />

        {/* Captions */}
        <div className="absolute inset-0 flex items-center px-5 sm:px-10 lg:px-16">
          <div className="relative min-h-[250px] w-full max-w-xl">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={CAPTIONS[active].title}
                initial={reduced ? undefined : { opacity: 0, y: 18, filter: "blur(8px)" }}
                animate={reduced ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduced ? undefined : { opacity: 0, y: -14, filter: "blur(6px)" }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-primary">{CAPTIONS[active].kicker}</p>
                <h3 className="font-heading text-[clamp(2rem,5.4vw,4.2rem)] font-semibold leading-[0.94]">{CAPTIONS[active].title}</h3>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-foreground/75 sm:text-base">{CAPTIONS[active].text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Film progress rail */}
        <div className="absolute inset-x-5 bottom-8 sm:inset-x-10 lg:inset-x-16">
          <div className="mb-3 flex items-center justify-between text-[9px] uppercase tracking-[0.3em] text-foreground/50">
            <span>Viaggio · Aurea Journey</span>
            <span>{String(active + 1).padStart(2, "0")} / {String(CAPTIONS.length).padStart(2, "0")}</span>
          </div>
          <div className="h-px w-full bg-border/60">
            <motion.div className="h-px origin-left bg-primary" style={{ scaleX: scrollYProgress }} />
          </div>
        </div>
      </div>
    </section>
  );
}
