/**
 * ═══ JET ATMOSPHERE SELECTOR ═══
 * Ricostruzione del blocco "Elixir" del sito di riferimento: tre swatch in alto,
 * immagine grande che cambia con crossfade, elenco a tre livelli (qui: Cabina ·
 * Servizio · Rotta) e nastro didascalia. Interazione tap/click + drag-carousel.
 *
 * ADDITIVO — solo presentazione.
 */
import { AnimatePresence, motion } from "framer-motion";
import cabinNight from "@/assets/aurea-jet/cabin-night.jpg";
import cabinDining from "@/assets/aurea-jet/cabin-dining.jpg";
import fboLounge from "@/assets/aurea-jet/fbo-lounge.jpg";
import { LuxeCorners, LuxeTag } from "@/components/public/luxe";
import { useJetStepper } from "./useJetStepper";


const ATMOSPHERES = [
  {
    id: "notturna",
    name: "Notturna",
    swatch: "linear-gradient(140deg,#111827,#1f2937 55%,#0b1220)",
    image: cabinNight,
    subtitle: "Cabina notte · 4 passeggeri · long range",
    layers: [
      { k: "Cabina", v: "Suite letto, pelle nabuk, luce 2200K calibrata sul fuso di arrivo" },
      { k: "Servizio", v: "Turndown a bordo, silenzio operativo, sveglia programmata" },
      { k: "Rotta", v: "Milano — Dubai · 6h05 · atterraggio 07:10 locali" },
    ],
  },
  {
    id: "gourmet",
    name: "Gourmet",
    swatch: "linear-gradient(140deg,#3b2412,#a97142 55%,#2a1a0d)",
    image: cabinDining,
    subtitle: "Tavola in quota · 6 passeggeri · mid size",
    layers: [
      { k: "Cabina", v: "Tavolo in radica, servizio in porcellana, cristalleria dedicata" },
      { k: "Servizio", v: "Menu firmato da chef stellato, cantina a bordo, sommelier di volo" },
      { k: "Rotta", v: "Milano — Nizza · 55 min · cena servita in crociera" },
    ],
  },
  {
    id: "executive",
    name: "Executive",
    swatch: "linear-gradient(140deg,#0f2c2a,#c7a765 60%,#0b1a19)",
    image: fboLounge,
    subtitle: "Terminal privato · 8 passeggeri · super mid",
    layers: [
      { k: "Cabina", v: "Configurazione club, connettività satellitare, area riunione riservata" },
      { k: "Servizio", v: "Lounge FBO dedicata, imbarco in 7 minuti, transfer sotto l'ala" },
      { k: "Rotta", v: "Milano — Londra Luton · 1h40 · slot garantito" },
    ],
  },
];

export default function JetAtmosphereSelector() {
  const {
    ref: sectionRef,
    index: active,
    setIndex: select,
    engaged,
    inView,
    reduced,
    swipeHandlers,
  } = useJetStepper<HTMLElement>({ count: ATMOSPHERES.length, autoplayMs: 5200 });
  const autoplay = !engaged;
  const current = ATMOSPHERES[active];

  return (
    <section ref={sectionRef} id="atmosfere" className="relative bg-background px-5 py-24 sm:px-8 sm:py-32">

      <div className="mx-auto max-w-6xl">
        <LuxeTag>Atmosfere di bordo</LuxeTag>
        <h2 className="mt-6 max-w-2xl font-heading text-[clamp(1.9rem,5vw,3.6rem)] font-semibold leading-[1.02]">
          Ogni rotta ha la sua <span className="italic text-primary">ora</span>.
        </h2>

        {/* Swatch row — autoplay + tap/scroll orizzontale su mobile */}
        <div className="no-scrollbar mt-10 flex gap-4 overflow-x-auto pb-2">
          {ATMOSPHERES.map((a, i) => (
            <button
              key={a.id}
              type="button"
              onClick={() => select(i)}
              aria-pressed={active === i}
              className={`group relative flex min-h-11 shrink-0 items-center gap-3 overflow-hidden border px-4 py-3 transition-colors ${
                active === i ? "border-primary/70 bg-card" : "border-border/60 bg-card/40 hover:border-primary/40"
              }`}
            >
              {active === i && autoplay && inView && !reduced && (
                <motion.span
                  key={`bar-${a.id}`}
                  className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-primary/70"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 5.2, ease: "linear" }}
                />
              )}
              <span
                className="h-9 w-9 rounded-full border border-border/60"
                style={{ background: a.swatch }}
                aria-hidden
              />
              <span className="flex flex-col items-start">
                <span className="text-[9px] uppercase tracking-[0.26em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-heading text-sm font-semibold">{a.name}</span>
              </span>
            </button>
          ))}
        </div>


        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start">
          <div className="relative aspect-[4/5] overflow-hidden border border-border/60 bg-card/40 sm:aspect-[4/3]">
            <LuxeCorners />
            <AnimatePresence mode="wait">
              <motion.img
                key={current.id}
                src={current.image}
                alt={`Atmosfera ${current.name}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
                initial={reduced ? undefined : { opacity: 0, scale: 1.08 }}
                animate={reduced ? undefined : { opacity: 1, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 text-[10px] uppercase tracking-[0.26em] text-foreground/80">
              {current.subtitle}
            </p>
          </div>

          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={reduced ? undefined : { opacity: 0, y: 24 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -16 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="font-heading text-3xl font-semibold sm:text-4xl">{current.name}</h3>
                <div className="mt-8 divide-y divide-border/50 border-y border-border/50">
                  {current.layers.map((l) => (
                    <div key={l.k} className="grid gap-1 py-5 sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-6">
                      <span className="text-[10px] uppercase tracking-[0.26em] text-primary">{l.k}</span>
                      <span className="text-sm leading-relaxed text-foreground/75">{l.v}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  Allestimento configurabile · disponibilità su richiesta
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
