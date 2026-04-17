import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const WORDS = ["Non", "vendiamo", "software.", "Liberiamo", "il", "tuo", "tempo", "mentre", "fatturi", "di", "più."];
const STATS = [
  { value: "847+", label: "business attivati" },
  { value: "98", label: "agenti proprietari" },
  { value: "25+", label: "settori coperti" },
  { value: "−12h", label: "lavoro a settimana" },
];

export default function ManifestoSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.55 });

  return (
    <section ref={ref} id="manifesto" className="landing-section relative overflow-visible px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16" data-theme="light">
      <div className="landing-section-glow" data-tone="violet" />

      <div className="relative mx-auto max-w-[1280px]">
        <div className="mb-5 text-center sm:mb-6" data-tone="gold">
          <span className="landing-pill px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.26em] sm:px-4 sm:py-2 sm:text-[10px]">
            Manifesto Empire
          </span>
        </div>

        <h2 className="mx-auto mb-8 max-w-[22ch] text-center font-heading text-[clamp(1.6rem,5.4vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-foreground sm:mb-10 sm:leading-[1] lg:mb-12">
          {WORDS.map((word, index) => (
            <Word key={word + index} word={word} index={index} total={WORDS.length} progress={smooth} />
          ))}
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {STATS.map((stat, index) => (
            <motion.article
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.65 }}
              className="landing-surface rounded-[22px] p-4 sm:rounded-[26px] sm:p-5"
              data-tone={index % 2 === 0 ? "gold" : "violet"}
            >
              <div className="text-[clamp(1.55rem,4vw,2.6rem)] font-heading font-extrabold leading-none text-foreground">{stat.value}</div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-foreground/66 sm:mt-3 sm:text-[11px]">{stat.label}</div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Word({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: ReturnType<typeof useSpring>;
}) {
  const start = 0.08 + (index / total) * 0.44;
  const end = start + 0.18;
  const opacity = useTransform(progress, [start, end], [0.32, 1]);
  const y = useTransform(progress, [start, end], [14, 0]);
  const accent = word === "Liberiamo" || word === "fatturi" || word === "più.";

  return (
    <motion.span
      style={{ opacity, y }}
      className={`mx-[0.14em] inline-block ${accent ? "landing-heading-gradient" : "text-foreground"}`}
    >
      {word}
    </motion.span>
  );
}
