/**
 * ═══ JET COLLECTION TABS ═══
 * Adattamento del blocco collezione del sito di riferimento (tab "Luxury /
 * Basic / Maglie" + griglia prodotti con prezzo): qui categorie di flotta con
 * carosello trascinabile, contatore modelli e prezzi orari.
 *
 * ADDITIVO — solo presentazione.
 */
import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import cabinMain from "@/assets/aurea-jet/cabin-main.jpg";
import cabinNight from "@/assets/aurea-jet/cabin-night.jpg";
import cabinDining from "@/assets/aurea-jet/cabin-dining.jpg";
import cockpit from "@/assets/aurea-jet/cockpit.jpg";
import helicopter from "@/assets/aurea-jet/helicopter.jpg";
import tarmacLimo from "@/assets/aurea-jet/tarmac-limo.jpg";
import wingCoast from "@/assets/aurea-jet/wing-coast.jpg";
import fboLounge from "@/assets/aurea-jet/fbo-lounge.jpg";

const GROUPS = [
  {
    id: "long-range",
    label: "Long range",
    items: [
      { name: "Aurea G700", meta: "14 pax · 13.400 km", price: "€ 11.900 / ora", image: cabinMain },
      { name: "Aurea Global 7500", meta: "13 pax · 14.200 km", price: "€ 10.400 / ora", image: cabinNight },
      { name: "Aurea Falcon 8X", meta: "12 pax · 11.900 km", price: "€ 8.900 / ora", image: wingCoast },
    ],
  },
  {
    id: "mid-size",
    label: "Mid size",
    items: [
      { name: "Aurea Praetor 600", meta: "9 pax · 7.400 km", price: "€ 5.400 / ora", image: cabinDining },
      { name: "Aurea Citation XLS+", meta: "8 pax · 3.900 km", price: "€ 3.700 / ora", image: cockpit },
      { name: "Aurea Phenom 300E", meta: "7 pax · 3.650 km", price: "€ 2.950 / ora", image: fboLounge },
    ],
  },
  {
    id: "rotary",
    label: "Elicotteri & transfer",
    items: [
      { name: "Aurea H145", meta: "6 pax · elisuperficie", price: "€ 2.300 / ora", image: helicopter },
      { name: "Aurea AW109", meta: "5 pax · costiero", price: "€ 1.980 / ora", image: helicopter },
      { name: "Aurea Ground", meta: "Berlina blindata · autista", price: "€ 180 / ora", image: tarmacLimo },
    ],
  },
];

export default function JetCollectionTabs() {
  const [tab, setTab] = useState(0);
  const reduced = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, x: 0, left: 0 });
  const group = GROUPS[tab];

  const onDown = (e: React.PointerEvent) => {
    const el = railRef.current;
    if (!el) return;
    drag.current = { down: true, x: e.clientX, left: el.scrollLeft };
  };
  const onMove = (e: React.PointerEvent) => {
    const el = railRef.current;
    if (!el || !drag.current.down) return;
    el.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const onUp = () => {
    drag.current.down = false;
  };

  return (
    <section id="collezione" className="relative bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-heading text-[clamp(1.9rem,5vw,3.4rem)] font-semibold leading-[1.02]">
            Aurea Fleet
          </h2>
          <span className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
            {group.items.length} modelli
          </span>
        </div>

        <div className="mt-8 flex flex-wrap gap-6 border-b border-border/50 pb-3">
          {GROUPS.map((g, i) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setTab(i)}
              aria-pressed={tab === i}
              className={`relative min-h-11 text-[11px] uppercase tracking-[0.24em] transition-colors ${
                tab === i ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {g.label}
              {tab === i && (
                <motion.span layoutId="jet-fleet-tab" className="absolute -bottom-3 left-0 h-px w-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={group.id}
          ref={railRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          className="no-scrollbar mt-10 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 active:cursor-grabbing sm:gap-7 sm:px-8"
          initial={reduced ? undefined : { opacity: 0, y: 26 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -18 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {group.items.map((it) => (
            <figure key={it.name} className="w-[76vw] shrink-0 snap-center sm:w-[42vw] lg:w-[30vw]">
              <div className="group relative overflow-hidden border border-border/60 bg-card/40">
                <img
                  src={it.image}
                  alt={it.name}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/75 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.24em] text-foreground/80">
                  {it.meta}
                </span>
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-3">
                <span className="font-heading text-lg font-semibold">{it.name}</span>
                <span className="text-sm text-primary">{it.price}</span>
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </AnimatePresence>

      <p className="mx-auto mt-6 max-w-6xl px-5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80 sm:px-8">
        Tariffe indicative · trascina per scorrere la flotta
      </p>
    </section>
  );
}
