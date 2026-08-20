/**
 * ═══ JET FILM SCRUB ═══
 * Cinematic scroll-scrubbed film: the cabin dolly video advances frame by frame
 * with the scroll position (Ruzza-style editorial film), with sequential
 * caption reveals pinned over the footage.
 *
 * ADDITIVE — presentational only.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import cabinFilm from "@/assets/aurea-jet/cabin-scrub.mp4.asset.json";
import cabinPoster from "@/assets/aurea-jet/cabin-main.jpg";

const CAPTIONS = [
  { at: 0.06, kicker: "01 · Imbarco", title: "Nessuna fila. Nessuna attesa.", text: "Arrivi 15 minuti prima. L’auto ti lascia sotto l’ala." },
  { at: 0.34, kicker: "02 · Cabina", title: "Il tuo salotto a 13.000 metri.", text: "Pelle su misura, radica lucidata, luce calibrata sul fuso orario di arrivo." },
  { at: 0.62, kicker: "03 · Servizio", title: "Un solo referente, sempre.", text: "Chef, champagne, transfer e privacy coordinati da un unico flight advisor." },
  { at: 0.86, kicker: "04 · Arrivo", title: "Atterri dove serve davvero.", text: "Oltre 5.000 aeroporti: scendi a 20 minuti dalla tua destinazione." },
];

export default function JetFilmScrub() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number>();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });

  const frameScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1, 1.06]);
  const veil = useTransform(scrollYProgress, [0, 0.5, 1], [0.62, 0.42, 0.7]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    targetRef.current = Math.min(Math.max(p, 0), 1);
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
      if (video && video.duration && !Number.isNaN(video.duration)) {
        currentRef.current += (targetRef.current - currentRef.current) * 0.12;
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
    <section ref={wrapRef} className="relative h-[420svh] bg-background">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0" style={reduced ? undefined : { scale: frameScale }}>
          <video
            ref={videoRef}
            src={cabinFilm.url}
            poster={cabinPoster}
            muted
            playsInline
            preload="auto"
            autoPlay={!!reduced}
            loop={!!reduced}
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <motion.div className="absolute inset-0 bg-background" style={{ opacity: reduced ? 0.5 : veil }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--background)/0.9)_0%,hsl(var(--background)/0.25)_55%,transparent_100%)]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background to-transparent" />

        {/* Captions */}
        <div className="absolute inset-0 flex items-center px-5 sm:px-10 lg:px-16">
          <div className="relative w-full max-w-xl">
            {CAPTIONS.map((c, i) => (
              <div
                key={c.title}
                className="transition-all duration-700"
                style={{
                  position: i === 0 ? "relative" : "absolute",
                  inset: i === 0 ? undefined : 0,
                  opacity: active === i ? 1 : 0,
                  transform: `translateY(${active === i ? 0 : active > i ? -28 : 28}px)`,
                  pointerEvents: active === i ? "auto" : "none",
                }}
              >
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-primary">{c.kicker}</p>
                <h3 className="font-heading text-[clamp(2rem,5.4vw,4.2rem)] font-semibold leading-[0.94]">{c.title}</h3>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-foreground/75 sm:text-base">{c.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Film progress rail */}
        <div className="absolute inset-x-5 bottom-8 sm:inset-x-10 lg:inset-x-16">
          <div className="mb-3 flex items-center justify-between text-[9px] uppercase tracking-[0.3em] text-foreground/50">
            <span>Film · Cabina Aurea</span>
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
