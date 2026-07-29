import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useHomepageContent, pick } from "@/hooks/useHomepageContent";

const WORDS_DEFAULT = ["Non", "vendiamo", "software.", "Liberiamo", "il", "tuo", "tempo", "mentre", "fatturi", "di", "più."];
const ACCENT_DEFAULT = ["Liberiamo", "fatturi", "più."];
const STATS_DEFAULT = [
  { value: "847+", label: "business attivati" },
  { value: "38", label: "agenti proprietari" },
  { value: "24", label: "settori coperti" },
  { value: "−12h", label: "lavoro a settimana" },
];

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mobile;
}

export default function ManifestoSection() {
  const ref = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.55 });

  const { content } = useHomepageContent();
  const m = content.manifesto ?? {};
  const WORDS = pick(m.words, WORDS_DEFAULT);
  const ACCENT_WORDS = new Set(pick(m.accentWords, ACCENT_DEFAULT));
  const STATS = pick(m.stats, STATS_DEFAULT);
  const PILL = pick(m.pillLabel, "Manifesto Empire");

  return (
    <section ref={ref} id="manifesto" className="landing-section relative overflow-visible px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16" data-theme="light">
      <div className="landing-section-glow" data-tone="violet" />

      <div className="relative mx-auto max-w-[1280px]">
        <div className="mb-5 text-center sm:mb-6" data-tone="gold">
          <span className="landing-pill px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.26em] sm:px-4 sm:py-2 sm:text-[10px]">
            {PILL}
          </span>
        </div>

        {isMobile ? (
          // MOBILE: simple, immediate, fully readable — single fade-in on enter
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-8 max-w-[20ch] text-center font-heading text-[clamp(1.7rem,7.4vw,2.8rem)] font-extrabold leading-[1.12] tracking-[-0.03em] text-foreground"
          >
            Non vendiamo software.{" "}
            <span className="landing-heading-gradient">Liberiamo il tuo tempo</span>{" "}
            mentre <span className="landing-heading-gradient">fatturi di più.</span>
          </motion.h2>
        ) : (
          // DESKTOP / tablet: cinematic word-by-word reveal driven by scroll
          <h2 className="mx-auto mb-8 flex max-w-[22ch] flex-wrap justify-center gap-x-[0.28em] gap-y-1 text-center font-heading text-[clamp(2rem,5.4vw,4rem)] font-extrabold leading-[1] tracking-[-0.04em] text-foreground sm:mb-10 lg:mb-12">
            {WORDS.map((word, index) => (
              <Word key={word + index} word={word} index={index} total={WORDS.length} accentWords={ACCENT_WORDS} progress={smooth} />
            ))}
          </h2>
        )}

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
  accentWords,
}: {
  word: string;
  index: number;
  total: number;
  progress: ReturnType<typeof useSpring>;
  accentWords: Set<string>;
}) {
  const start = 0.08 + (index / total) * 0.44;
  const end = start + 0.18;
  const opacity = useTransform(progress, [start, end], [0.32, 1]);
  const y = useTransform(progress, [start, end], [14, 0]);
  const accent = accentWords.has(word);

  return (
    <motion.span
      style={{ opacity, y }}
      className={`inline-block ${accent ? "landing-heading-gradient" : "text-foreground"}`}
    >
      {word}
    </motion.span>
  );
}
