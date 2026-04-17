import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const WORDS = [
  "Non",
  "vendiamo",
  "software.",
  "Costruiamo",
  "imprese",
  "che",
  "lavorano",
  "da",
  "sole.",
];

const STATS = [
  { value: "847+", label: "Imprese attive in Italia" },
  { value: "98", label: "Agenti AI proprietari" },
  { value: "25+", label: "Settori verticali coperti" },
  { value: "€12M+", label: "Revenue generato dai clienti" },
];

export default function ManifestoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <section ref={ref} id="manifesto" className="relative py-32 px-5 overflow-hidden">
      {/* Atmospheric layers */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,58,237,0.14), transparent 60%)",
          scale: useTransform(scrollYProgress, [0, 1], [0.6, 1.4]),
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0.3]),
        }}
      />

      <div className="relative max-w-[1300px] mx-auto">
        {/* Eyebrow */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[3px] border border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/5 backdrop-blur-md">
            Manifesto Empire
          </span>
        </div>

        {/* Reveal each word */}
        <h2 className="text-center font-heading font-extrabold leading-[0.95] tracking-[-0.04em] text-[clamp(2.4rem,7vw,6rem)] mb-16">
          {WORDS.map((w, i) => (
            <Word key={i} word={w} index={i} progress={scrollYProgress} total={WORDS.length} />
          ))}
        </h2>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 max-w-[1100px] mx-auto">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className="relative p-5 lg:p-7 rounded-3xl border border-white/[0.08] backdrop-blur-xl overflow-hidden group"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))" }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "radial-gradient(circle at top right, rgba(212,175,55,0.15), transparent 60%)",
                }}
              />
              <div className="relative">
                <div className="text-[clamp(1.6rem,4vw,2.6rem)] font-heading font-extrabold bg-gradient-to-br from-white via-white to-[#D4AF37] bg-clip-text text-transparent leading-none mb-2">
                  {s.value}
                </div>
                <div className="text-[11px] lg:text-[12px] text-white/55 font-medium uppercase tracking-wider leading-snug">
                  {s.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Word({
  word,
  index,
  progress,
  total,
}: {
  word: string;
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  total: number;
}) {
  const start = 0.15 + (index / total) * 0.5;
  const end = start + 0.12;
  const opacity = useTransform(progress, [start, end], [0.18, 1]);
  const blur = useTransform(progress, [start, end], [10, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const isAccent = word === "imprese" || word === "lavorano";

  return (
    <motion.span
      style={{ opacity, filter }}
      className={`inline-block mx-[0.18em] ${
        isAccent
          ? "bg-gradient-to-r from-[#D4AF37] via-[#a78bfa] to-[#7C3AED] bg-clip-text text-transparent"
          : "text-white"
      }`}
    >
      {word}
    </motion.span>
  );
}
