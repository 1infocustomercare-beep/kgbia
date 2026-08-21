/**
 * ═══ JET SIGNATURE CARDS ═══
 * Adattamento del blocco "L'icona · Il classico · L'accessibile" del sito di
 * riferimento: pannelli full-bleed con immagine in parallasse, kicker, titolo,
 * prezzo/anno e CTA. Ogni pannello si rivela con clip-path sullo scroll.
 *
 * ADDITIVO — solo presentazione.
 */
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import cabinMain from "@/assets/aurea-jet/cabin-main.jpg";
import wingCoast from "@/assets/aurea-jet/wing-coast.jpg";
import helicopter from "@/assets/aurea-jet/helicopter.jpg";

const CARDS = [
  {
    kicker: "L'icona · Ultra long range",
    title: "Aurea G700 · 14 passeggeri",
    price: "da € 11.900 / ora",
    year: "Cabina 2025",
    image: cabinMain,
    note: "Milano — New York senza scalo, suite notte e area riunione.",
  },
  {
    kicker: "Il classico · Super mid size",
    title: "Aurea Praetor 600 · 9 passeggeri",
    price: "da € 5.400 / ora",
    year: "Cabina 2024",
    image: wingCoast,
    note: "La rotta europea perfetta: 6 ore di autonomia, cabina alta in piedi.",
  },
  {
    kicker: "L'accessibile · Ultimo miglio",
    title: "Aurea H145 · 6 passeggeri",
    price: "da € 2.300 / ora",
    year: "Elisuperficie privata",
    image: helicopter,
    note: "Dal terminal alla villa in 12 minuti, bagagli inclusi.",
  },
];

function SignatureCard({ card, index }: { card: (typeof CARDS)[number]; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const clipP = useTransform(scrollYProgress, [0, 0.35], [16, 0]);
  const clip = useTransform(clipP, (v) => `inset(${v}% ${v / 2}% ${v}% ${v / 2}%)`);
  const textY = useTransform(scrollYProgress, [0, 0.5], [50, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.05, 0.4], [0, 1]);

  return (
    <article ref={ref} className="relative">
      <motion.div
        className="relative h-[78svh] min-h-[420px] overflow-hidden border border-border/50"
        style={reduced ? undefined : { clipPath: clip }}
      >
        <motion.img
          src={card.image}
          alt={card.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-[124%] w-full object-cover"
          style={reduced ? undefined : { y }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background)/0.55)_0%,transparent_35%,hsl(var(--background)/0.92)_100%)]" />

        <motion.div
          className="absolute inset-x-0 bottom-0 p-6 sm:p-12"
          style={reduced ? undefined : { y: textY, opacity: textOpacity }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">{card.kicker}</p>
          <h3 className="mt-4 max-w-2xl font-heading text-[clamp(1.7rem,4.4vw,3.4rem)] font-semibold leading-[1.02]">
            {card.title}
          </h3>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-foreground/75">{card.note}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
            <span className="font-heading text-xl font-semibold text-primary">{card.price}</span>
            <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{card.year}</span>
            <a
              href="#preventivo"
              className="inline-flex min-h-11 items-center gap-2 border-b border-primary/60 pb-1 text-[11px] uppercase tracking-[0.24em] text-foreground transition-colors hover:text-primary"
            >
              Scopri l'aeromobile <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        <span className="absolute right-5 top-5 font-heading text-4xl font-semibold text-foreground/15 sm:text-6xl">
          {String(index + 1).padStart(2, "0")}
        </span>
      </motion.div>
    </article>
  );
}

export default function JetSignatureCards() {
  return (
    <section id="flotta-signature" className="relative bg-background px-3 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-10">
        {CARDS.map((c, i) => (
          <SignatureCard key={c.title} card={c} index={i} />
        ))}
      </div>
    </section>
  );
}
