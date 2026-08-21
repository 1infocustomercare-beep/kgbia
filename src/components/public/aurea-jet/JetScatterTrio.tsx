/**
 * ═══ JET SCATTER TRIO ═══
 * Adattamento 1:1 del blocco d'apertura del sito di riferimento: tre fotografie
 * sfalsate che entrano dallo scroll con rotazione/parallasse diverse, alternate
 * a righe di manifesto in dissolvenza.
 *
 * ADDITIVO — solo presentazione.
 */
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import tarmacNight from "@/assets/aurea-jet/tarmac-night.jpg";
import wingSunrise from "@/assets/aurea-jet/wing-sunrise.jpg";
import loungeTerrace from "@/assets/aurea-jet/lounge-terrace.jpg";
import { ScrollWords } from "./JetScrollKit";

const SHOTS = [
  { src: tarmacNight, alt: "Jet privato sulla pista di notte", rot: -4.5, y: 120, w: "w-[62%] sm:w-[30%]", pos: "self-start" },
  { src: wingSunrise, alt: "Ala illuminata dall'alba sopra le Alpi", rot: 3.2, y: 220, w: "w-[54%] sm:w-[26%]", pos: "self-center" },
  { src: loungeTerrace, alt: "Lounge privata del terminal executive", rot: -2.4, y: 60, w: "w-[58%] sm:w-[28%]", pos: "self-end" },
];

function Shot({ src, alt, rot, y, w, pos }: (typeof SHOTS)[number]) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const ty = useTransform(scrollYProgress, [0, 1], [y, -y]);
  const rotate = useTransform(scrollYProgress, [0, 1], [rot * 2.2, rot * -0.4]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.04, 0.96]);

  return (
    <motion.div
      ref={ref}
      className={`${w} ${pos} overflow-hidden border border-border/60 shadow-[0_40px_120px_-40px_hsl(var(--background))]`}
      style={reduced ? undefined : { y: ty, rotate, scale }}
    >
      <img src={src} alt={alt} loading="lazy" decoding="async" className="aspect-[3/4] w-full object-cover" />
    </motion.div>
  );
}

export default function JetScatterTrio() {
  return (
    <section className="relative overflow-hidden bg-background px-5 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="flex min-h-[62svh] flex-col items-stretch gap-6 sm:flex-row sm:justify-between">
          {SHOTS.map((s) => (
            <Shot key={s.alt} {...s} />
          ))}
        </div>

        <div className="mt-24 space-y-6 sm:mt-32">
          <ScrollWords
            text="Il tempo non si possiede."
            className="font-heading text-[clamp(1.9rem,6vw,4.4rem)] font-semibold leading-[0.98]"
          />
          <ScrollWords
            text="Si programma."
            accent={[0, 1]}
            className="font-heading text-[clamp(1.9rem,6vw,4.4rem)] font-semibold leading-[0.98] sm:pl-[18%]"
          />
          <ScrollWords
            text="Ogni volo ha una storia prima di te."
            className="font-heading text-[clamp(1.4rem,4vw,2.8rem)] font-medium leading-[1.1] text-foreground/70 sm:pl-[8%]"
          />
          <ScrollWords
            text="A Milano, custodiamo il valore delle tue ore."
            className="font-heading text-[clamp(1.4rem,4vw,2.8rem)] font-medium leading-[1.1] text-foreground/70 sm:pl-[26%]"
          />
        </div>
      </div>
    </section>
  );
}
