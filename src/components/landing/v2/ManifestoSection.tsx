import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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

  return (
    <section ref={ref} id="manifesto" className="landing-section relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20" data-theme="light">
      <div className="landing-section-glow" data-tone="violet" />

      <div className="relative mx-auto max-w-[1320px]">
        <div className="mb-8 text-center sm:mb-10" data-tone="gold">
          <span className="landing-pill px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.26em] sm:px-4 sm:py-2 sm:text-[10px]">Manifesto Empire</span>
        </div>

        <h2 className="mx-auto mb-12 max-w-[15ch] text-center font-heading text-[clamp(1.9rem,7vw,5.4rem)] font-extrabold leading-[0.92] tracking-[-0.06em] text-foreground sm:mb-14 lg:mb-16">
          {WORDS.map((word, index) => (
            <Word key={word + index} word={word} index={index} total={WORDS.length} progress={scrollYProgress} />
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
              className="landing-surface rounded-[22px] p-4 sm:rounded-[28px] sm:p-6"
              data-tone={index % 2 === 0 ? "gold" : "violet"}
            >
              <div className="text-[clamp(1.6rem,4vw,2.9rem)] font-heading font-extrabold leading-none text-foreground">{stat.value}</div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-foreground/48 sm:mt-3 sm:text-[11px]">{stat.label}</div>
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
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const start = 0.12 + (index / total) * 0.5;
  const end = start + 0.14;
  const opacity = useTransform(progress, [start, end], [0.14, 1]);
  const blur = useTransform(progress, [start, end], [14, 0]);
  const filter = useTransform(blur, (value) => `blur(${value}px)`);
  const accent = word === "imprese" || word === "crescono";

  return (
    <motion.span
      style={{ opacity, filter }}
      className={`mx-[0.16em] inline-block ${accent ? "landing-heading-gradient" : "text-foreground"}`}
    >
      {word}
    </motion.span>
  );
}
