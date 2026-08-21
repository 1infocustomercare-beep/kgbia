/**
 * ═══ JET WINDOW DIVE ═══
 * Storytelling sticky: il jet resta incollato al centro, frasi persuasive
 * entrano/escono in blur-in guidate dallo scroll, poi la camera entra dentro
 * il finestrino e si apre la cabina extra-lusso.
 * ADDITIVO — solo presentazione.
 */
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import jetSide from "@/assets/aurea-jet/part-wing.png";
import cabinSuite from "@/assets/aurea-jet/cabin-suite.jpg";
import { JET_SCROLL } from "./jet-motion";

const LINES = [
  { at: 0.06, title: "Nessuna coda. Nessun gate.", body: "Il tuo equipaggio è già a bordo quando arrivi." },
  { at: 0.3, title: "Rotte off-market.", body: "Piste private, slot notturni, autorizzazioni gestite in silenzio." },
  { at: 0.54, title: "Un solo referente.", body: "Un flight advisor dedicato, ventiquattro ore su ventiquattro." },
];

export default function JetWindowDive() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const jetScale = useTransform(scrollYProgress, [0, 0.5, 0.76, 0.9], [0.92, 1.28, 7.5, 18]);
  const jetX = useTransform(scrollYProgress, [0, 0.5, 0.9], ["0%", "-3%", "-22%"]);
  const jetOpacity = useTransform(scrollYProgress, [0.7, 0.84], [1, 0]);
  const jetBlur = useTransform(scrollYProgress, [0.68, 0.86], [0, 10]);
  const jetFilter = useTransform(jetBlur, (b) => `blur(${b}px)`);

  const cabinOpacity = useTransform(scrollYProgress, [0.68, 0.84], [0, 1]);
  const cabinScale = useTransform(scrollYProgress, [0.68, 0.94], [1.24, 1]);
  const cabinCopyOpacity = useTransform(scrollYProgress, [0.82, 0.9], [0, 1]);

  return (
    <section ref={ref} className={`relative bg-background ${JET_SCROLL.portalHeight}`}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* cabina finale */}
        <motion.div className="absolute inset-0" style={reduced ? { opacity: 1 } : { opacity: cabinOpacity }}>
          <motion.img
            src={cabinSuite}
            alt="Suite privata a bordo di un jet extra-lusso"
            loading="lazy"
            className="h-full w-full object-cover"
            style={reduced ? undefined : { scale: cabinScale }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background)/0.72)_0%,hsl(var(--background)/0.2)_45%,hsl(var(--background)/0.92)_100%)]" />
          <motion.div
            className="absolute inset-x-0 bottom-14 px-6 text-center sm:bottom-20"
            style={reduced ? undefined : { opacity: cabinCopyOpacity }}
          >
            <p className="text-[10px] uppercase tracking-[0.34em] text-primary">Sei dentro</p>
            <h3 className="jet-serif mx-auto mt-4 max-w-2xl text-3xl leading-[1.05] sm:text-5xl">
              La cabina è la tua suite. A dodicimila metri.
            </h3>
          </motion.div>
        </motion.div>

        {/* jet sticky */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={reduced ? undefined : { opacity: jetOpacity, filter: jetFilter }}
        >
          <motion.img
            src={jetSide}
            alt="Jet privato in volo"
            loading="lazy"
            className="w-[min(92vw,1180px)] object-contain will-change-transform"
            style={reduced ? undefined : { scale: jetScale, x: jetX }}
          />
        </motion.div>

        {/* frasi blur-in */}
        <div className="pointer-events-none absolute inset-0">
          {LINES.map((l, i) => (
            <BlurLine key={l.title} line={l} progress={scrollYProgress} index={i} reduced={!!reduced} />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />
      </div>
    </section>
  );
}

function BlurLine({
  line,
  progress,
  index,
  reduced,
}: {
  line: (typeof LINES)[number];
  progress: import("framer-motion").MotionValue<number>;
  index: number;
  reduced: boolean;
}) {
  const start = line.at;
  const opacity = useTransform(progress, [start, start + 0.035, start + 0.12, start + 0.165], [0, 1, 1, 0]);
  const blur = useTransform(progress, [start, start + 0.035, start + 0.12, start + 0.165], [12, 0, 0, 10]);
  const y = useTransform(progress, [start, start + 0.165], [26, -24]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const side = index % 2 === 0;

  return (
    <motion.div
      className={`absolute top-1/2 max-w-sm -translate-y-1/2 px-6 ${side ? "left-0 text-left sm:left-10" : "right-0 text-right sm:right-10"}`}
      style={reduced ? { opacity: 1 } : { opacity, y, filter }}
    >
      <h3 className="jet-serif text-2xl leading-tight sm:text-4xl">{line.title}</h3>
      <p className="mt-3 text-xs leading-relaxed text-foreground/70 sm:text-sm">{line.body}</p>
    </motion.div>
  );
}
