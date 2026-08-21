/**
 * ═══ JET MANIFESTO STACK ═══
 * Adattamento 1:1 della sezione manifesto di riferimento (Ruzza):
 * blocco 300svh, pannello sticky a tutta altezza, backdrop a 3 colonne
 * scalato/traslato, veli radiali profondi e frasi che si dissolvono
 * una nell'altra al variare dello scroll, con tick-rail di progresso.
 *
 * ADDITIVO — solo presentazione.
 */
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import cabinMain from "@/assets/aurea-jet/cabin-main.jpg";
import cockpit from "@/assets/aurea-jet/cockpit.jpg";
import wingCoast from "@/assets/aurea-jet/wing-coast.jpg";

const COLUMNS = [
  { src: cabinMain, position: "52% 45%" },
  { src: cockpit, position: "50% 52%" },
  { src: wingCoast, position: "48% 45%" },
];

const PHRASES = [
  { lead: "Il tempo non si compra.", accent: "Si riprende." },
  { lead: "Ogni volo esiste", accent: "solo per la tua agenda." },
  { lead: "Da Milano al mondo,", accent: "in due ore di preavviso." },
];

const TICKS = 22;

export default function JetManifestoStack() {
  const wrapRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });

  const backdropY = useTransform(scrollYProgress, [0, 1], ["10%", "-6%"]);
  const backdropScale = useTransform(scrollYProgress, [0, 1], [1.32, 1.08]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setProgress(p);
    const step = Math.min(PHRASES.length - 1, Math.floor(p * PHRASES.length * 1.02));
    setActive(step < 0 ? 0 : step);
  });

  return (
    <section ref={wrapRef} className="relative bg-background" style={{ height: "300svh" }}>
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        {/* Backdrop tri-colonna */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 opacity-90"
          style={reduced ? { transform: "scale(1.14)" } : { y: backdropY, scale: backdropScale }}
        >
          <div className="absolute inset-0 grid grid-cols-3">
            {COLUMNS.map((col, i) => (
              <div key={i} className="relative overflow-hidden border-x border-foreground/[0.04]">
                <img
                  src={col.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: col.position }}
                />
                <div className="absolute inset-0 bg-background/10" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Veli profondi */}
        <div className="absolute inset-0 bg-background/[0.34]" />
        <div className="absolute inset-0 bg-[radial-gradient(78%_60%_at_50%_48%,hsl(var(--background)/0.08),hsl(var(--background)/0.52)_70%,hsl(var(--background)/0.9)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

        {/* Frasi in dissolvenza */}
        {PHRASES.map((phrase, i) => (
          <motion.div
            key={phrase.lead}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            animate={{
              opacity: active === i ? 1 : 0,
              y: active === i ? 0 : active > i ? -26 : 26,
            }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{ pointerEvents: "none" }}
          >
            <p className="font-heading text-[clamp(2rem,5.5vw,4.8rem)] font-semibold leading-[1.08]">
              {phrase.lead}
              <br />
              <span className="italic text-primary">{phrase.accent}</span>
            </p>
          </motion.div>
        ))}

        {/* Tick-rail */}
        <div className="absolute bottom-12 left-1/2 w-40 -translate-x-1/2">
          <div className="flex items-end justify-between">
            {Array.from({ length: TICKS }).map((_, i) => {
              const on = i / (TICKS - 1) <= progress;
              return (
                <span
                  key={i}
                  className="w-px transition-all duration-300"
                  style={{
                    height: on ? (i % 5 === 0 ? 14 : 9) : i % 5 === 0 ? 10 : 6,
                    background: on ? "hsl(var(--primary))" : "hsl(var(--foreground) / 0.2)",
                  }}
                />
              );
            })}
          </div>
          <p className="mt-3 text-center text-[9px] uppercase tracking-[0.3em] text-foreground/45">Aurea · manifesto</p>
        </div>
      </div>
    </section>
  );
}
