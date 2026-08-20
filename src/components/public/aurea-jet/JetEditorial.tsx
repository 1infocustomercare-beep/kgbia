/**
 * ═══ JET EDITORIAL ═══
 * Ruzza-style editorial blocks: word-by-word scroll reveal manifesto and a
 * three-image parallax triptych of the cabin experience.
 */
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import cabinNight from "@/assets/aurea-jet/cabin-night.jpg";
import cabinDining from "@/assets/aurea-jet/cabin-dining.jpg";
import wingCoast from "@/assets/aurea-jet/wing-coast.jpg";

const LINES = [
  "Il tempo non si compra.",
  "Si riprende.",
  "Ogni ora a terra",
  "è una riunione mancata.",
  "Aurea riporta le tue ore",
  "dove servono.",
];

function RevealLine({ text, index, total }: { text: string; index: number; total: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.92", "start 0.42"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.16, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [index % 2 ? 34 : -34, 0]);
  const accent = index === 1 || index === total - 1;

  return (
    <motion.p
      ref={ref}
      style={reduced ? undefined : { opacity, x }}
      className={`font-heading text-[clamp(1.7rem,5.4vw,3.6rem)] font-semibold leading-[1.08] ${
        accent ? "text-primary" : "text-foreground"
      }`}
    >
      {text}
    </motion.p>
  );
}

function ParallaxImage({ src, alt, label, offset }: { src: string; alt: string; label: string; offset: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.02, 1.08]);

  return (
    <div ref={ref} className="relative overflow-hidden border border-border/60">
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        width={1600}
        height={1000}
        className="h-[46svh] w-full object-cover sm:h-[62svh]"
        style={reduced ? undefined : { y, scale }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
      <p className="absolute bottom-5 left-5 text-[10px] uppercase tracking-[0.28em] text-foreground/80">{label}</p>
    </div>
  );
}

export default function JetEditorial() {
  return (
    <section className="relative px-5 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl space-y-3">
          {LINES.map((line, i) => (
            <RevealLine key={line} text={line} index={i} total={LINES.length} />
          ))}
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-3">
          <ParallaxImage src={cabinDining} alt="Servizio gourmet a bordo di un jet privato" label="Chef a bordo" offset={26} />
          <ParallaxImage src={cabinNight} alt="Suite notte in cabina jet privato" label="Suite notte" offset={44} />
          <ParallaxImage src={wingCoast} alt="Vista dall’ala sopra la costa al tramonto" label="Rotte su misura" offset={32} />
        </div>
      </div>
    </section>
  );
}
