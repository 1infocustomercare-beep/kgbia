/**
 * ═══ JET PLATE STRIP ═══
 * Adattamento 1:1 della "strip" di piatti prodotto del sito di riferimento:
 * nastro orizzontale con snap, piatti su fondo scenografico e didascalia
 * su due righe.
 *
 * ADDITIVO — solo presentazione.
 */
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import detailStitching from "@/assets/aurea-jet/detail-stitching.jpg";
import detailVeneer from "@/assets/aurea-jet/detail-veneer.jpg";
import detailCrystal from "@/assets/aurea-jet/detail-crystal.jpg";
import { LuxeCorners } from "@/components/public/luxe";

const PLATES = [
  { image: detailStitching, title: "Pelle cucita a mano", caption: "Nabuk avorio · filo oro champagne" },
  { image: detailVeneer, title: "Radica e titanio", caption: "Tavolo su misura · inserti spazzolati" },
  { image: detailCrystal, title: "Cristalleria di bordo", caption: "Servizio dedicato · marmo nero" },
];

export default function JetPlateStrip() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  /* Nastro guidato dallo scroll: scorre in orizzontale mentre la sezione attraversa il viewport */
  const railX = useTransform(smooth, [0, 1], ["6%", "-24%"]);
  const depth0 = useTransform(smooth, [0, 1], [26, -26]);
  const depth1 = useTransform(smooth, [0, 1], [38, -38]);
  const depth2 = useTransform(smooth, [0, 1], [50, -50]);
  const depths = [depth0, depth1, depth2];

  return (
    <section ref={sectionRef} id="allestimenti" className="relative overflow-hidden bg-background py-20 sm:py-28">
      <div className="mx-auto mb-12 grid max-w-6xl gap-6 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:items-end">
        <h3 className="font-heading text-3xl font-semibold leading-tight sm:text-5xl">
          L’allestimento
        </h3>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Materiali scelti a mano, uno per volta: pelle, radica, titanio e cristallo.
          Il dettaglio che si sente sotto le dita, prima ancora di decollare.
        </p>
      </div>

      <div
        ref={railRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        className="no-scrollbar cursor-grab overflow-x-auto active:cursor-grabbing"
        style={{ touchAction: "pan-y" }}
      >
      <motion.div
        className="flex w-max gap-5 px-5 pb-4 sm:gap-7 sm:px-8"
        style={reduced ? undefined : { x: railX }}
      >

        {PLATES.map((plate, i) => {
          const depth = depths[i];
          return (
            <motion.figure
              key={plate.title}
              className="w-[78vw] shrink-0 sm:w-[46vw] lg:w-[32vw]"
              style={reduced ? undefined : { y: depth }}
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
          );
        })}
      </motion.div>
    </section>
  );
}

