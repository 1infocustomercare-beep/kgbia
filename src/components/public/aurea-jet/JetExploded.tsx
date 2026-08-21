/**
 * ═══ JET ATELIER ═══
 * Sezione editoriale "L'Atelier": lo scroll rivela tre materie della cabina
 * (pelle cucita a mano, radica e cristallo, suite notte) con reveal a maschera
 * e testo sincronizzato. Nessuna vista esplosa, nessun dettaglio tecnico da
 * cabina di pilotaggio: solo ciò che il passeggero vive.
 * ADDITIVO — solo presentazione.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import leather from "@/assets/aurea-jet/atelier-leather.jpg";
import table from "@/assets/aurea-jet/atelier-table.jpg";
import suite from "@/assets/aurea-jet/atelier-suite.jpg";
import { JET_EASE, JET_SCROLL } from "./jet-motion";

const CHAPTERS = [
  {
    img: leather,
    kicker: "Capitolo I — Seduta",
    title: "Cucita a mano,",
    accent: "in 41 ore.",
    text:
      "Ogni poltrona nasce da una singola pelle italiana full-grain, tesa a mano e impunturata con filo di seta. Si reclina in posizione lounge senza un solo scatto meccanico percepibile.",
    specs: [
      ["Materia", "Pelle full-grain toscana"],
      ["Finitura", "Impuntura seta avorio"],
    ],
  },
  {
    img: table,
    kicker: "Capitolo II — Tavola",
    title: "Radica lucidata",
    accent: "a specchio.",
    text:
      "Piani in radica di noce con dieci mani di lacca, bordi in ottone spazzolato e cristallo soffiato a bocca. La cantina di bordo è selezionata dal vostro sommelier, non dal nostro catalogo.",
    specs: [
      ["Materia", "Radica di noce · ottone"],
      ["Servizio", "Chef e cantina su richiesta"],
    ],
  },
  {
    img: suite,
    kicker: "Capitolo III — Notte",
    title: "Una suite",
    accent: "a 13.000 metri.",
    text:
      "Letto matrimoniale vero, lino a 800 fili, cashmere e luce calda regolabile a 2.400 K. Atterrate riposati: è l'unica metrica di lusso che conta davvero.",
    specs: [
      ["Materia", "Lino 800 fili · cashmere"],
      ["Comfort", "Luce 2.400 K · silenzio 48 dB"],
    ],
  },
] as const;

export default function JetExploded() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v < 0.34 ? 0 : v < 0.67 ? 1 : 2;
    setActive((prev) => (prev === next ? prev : next));
  });

  // parallax leggero sull'immagine attiva
  const imgY = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.35, 0.6, 0.35]);
  const chapter = CHAPTERS[active];

  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <section ref={ref} className={`relative bg-background ${JET_SCROLL.explodedHeight}`}>
      <div className="sticky top-0 flex h-[100svh] w-full items-center overflow-hidden">
        <motion.div
          aria-hidden
          style={reduced ? undefined : { opacity: glowOpacity }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_45%,hsl(var(--primary)/0.14),transparent_60%)]"
        />

        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-6 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] sm:gap-14">
          {/* Materia — reveal a maschera */}
          <div className="relative mx-auto w-full max-w-[360px] sm:max-w-none">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-primary/15 bg-black/40 shadow-[0_50px_120px_-40px_hsl(var(--primary)/0.35)]">
              <AnimatePresence initial={false} mode="sync">
                <motion.div
                  key={chapter.kicker}
                  className="absolute inset-0"
                  initial={reduced ? undefined : { clipPath: "inset(0% 0% 100% 0%)" }}
                  animate={reduced ? undefined : { clipPath: "inset(0% 0% 0% 0%)" }}
                  exit={reduced ? undefined : { clipPath: "inset(100% 0% 0% 0%)" }}
                  transition={{ duration: 0.9, ease: JET_EASE }}
                >
                  <motion.img
                    src={chapter.img}
                    alt={`${chapter.title} ${chapter.accent}`}
                    loading="lazy"
                    width={1280}
                    height={1600}
                    className="h-[112%] w-full object-cover"
                    style={reduced || mobile ? undefined : { y: imgY }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/25" />
                </motion.div>
              </AnimatePresence>

              {/* indice capitoli */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                {CHAPTERS.map((c, i) => (
                  <span
                    key={c.kicker}
                    className={`h-[2px] flex-1 rounded-full transition-all duration-500 ${
                      i === active ? "bg-primary" : "bg-foreground/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Testo sincronizzato */}
          <div className="relative">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-primary">L'Atelier Aurea</p>

            <div className="relative mt-5 min-h-[290px] sm:min-h-[320px]">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={chapter.kicker}
                  initial={reduced ? undefined : { opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={reduced ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduced ? undefined : { opacity: 0, y: -16, filter: "blur(6px)" }}
                  transition={{ duration: 0.42, ease: JET_EASE }}
                >
                  <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{chapter.kicker}</p>
                  <h2 className="jet-serif mt-3 text-[clamp(2rem,5.2vw,3.9rem)] leading-[0.98]">
                    {chapter.title} <span className="italic text-primary">{chapter.accent}</span>
                  </h2>
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-foreground/75 sm:text-base">{chapter.text}</p>

                  <dl className="mt-7 grid max-w-md grid-cols-2 gap-x-6 gap-y-3 border-t border-primary/15 pt-5">
                    {chapter.specs.map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground">{k}</dt>
                        <dd className="mt-1 text-xs font-semibold text-foreground sm:text-sm">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
