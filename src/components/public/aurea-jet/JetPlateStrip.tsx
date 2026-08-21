/**
 * ═══ JET PLATE STRIP ═══
 * Adattamento 1:1 della "strip" di piatti prodotto del sito di riferimento:
 * nastro orizzontale con snap, piatti su fondo scenografico e didascalia
 * su due righe.
 *
 * ADDITIVO — solo presentazione.
 */
import { motion, useReducedMotion } from "framer-motion";
import cabinDining from "@/assets/aurea-jet/cabin-dining.jpg";
import fboLounge from "@/assets/aurea-jet/fbo-lounge.jpg";
import tarmacLimo from "@/assets/aurea-jet/tarmac-limo.jpg";
import helicopter from "@/assets/aurea-jet/helicopter.jpg";
import { LuxeCorners } from "@/components/public/luxe";

const PLATES = [
  { image: cabinDining, title: "Tavola Aurea", caption: "Menu firmato · servito in quota" },
  { image: fboLounge, title: "Terminal privato", caption: "Lounge riservata · imbarco in 7 minuti" },
  { image: tarmacLimo, title: "Transfer sotto l’ala", caption: "Berlina blindata · autista dedicato" },
  { image: helicopter, title: "Ultimo miglio", caption: "Elicottero · da elisuperficie a villa" },
];

export default function JetPlateStrip() {
  const reduced = useReducedMotion();

  return (
    <section id="allestimenti" className="relative bg-background py-20 sm:py-28">
      <div className="mx-auto mb-12 grid max-w-6xl gap-6 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:items-end">
        <h3 className="font-heading text-3xl font-semibold leading-tight sm:text-5xl">
          L’allestimento
        </h3>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Ogni volo Aurea arriva completo del suo scenario: terminal privato, tavola a bordo,
          transfer coordinato e ultimo miglio in elicottero.
        </p>
      </div>

      <div className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:gap-7 sm:px-8">
        {PLATES.map((plate, i) => (
          <motion.figure
            key={plate.title}
            className="w-[78vw] shrink-0 snap-center sm:w-[46vw] lg:w-[32vw]"
            initial={reduced ? undefined : { opacity: 0, y: 40 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative overflow-hidden border border-border/60 bg-card/50">
              <LuxeCorners />
              <img
                src={plate.image}
                alt={plate.title}
                loading="lazy"
                decoding="async"
                className="aspect-[16/11] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            </div>
            <figcaption className="mt-4 flex flex-col gap-1">
              <span className="font-heading text-lg font-semibold">{plate.title}</span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{plate.caption}</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
