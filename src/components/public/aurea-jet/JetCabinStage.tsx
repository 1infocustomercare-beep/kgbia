/**
 * ═══ JET CABIN STAGE ═══
 * Adattamento 1:1 dello "stage" prodotto del sito di riferimento:
 * palco sticky con immagini che si dissolvono, indice numerato cliccabile
 * e pannelli di dettaglio che scorrono e pilotano il palco.
 *
 * ADDITIVO — solo presentazione.
 */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Gauge, Ruler, Users, Wind } from "lucide-react";
import cabinMain from "@/assets/aurea-jet/cabin-main.jpg";
import cabinDining from "@/assets/aurea-jet/cabin-dining.jpg";
import cabinNight from "@/assets/aurea-jet/cabin-night.jpg";
import { LuxeCorners, LuxeTag } from "@/components/public/luxe";

const CABINS = [
  {
    id: "light",
    name: "Aurea Light",
    label: "Cabina executive · 6 posti · 2.800 km",
    image: cabinMain,
    lines: [
      { dt: "Missione", dd: "City-hop europeo, andata e ritorno in giornata" },
      { dt: "Cabina", dd: "6 poltrone in pelle, tavolo pieghevole, bagno privato" },
      { dt: "A bordo", dd: "Wi-Fi satellitare, catering freddo firmato, 2 bagagli cabina" },
    ],
    specs: [
      { icon: Users, k: "Passeggeri", v: "5 – 6" },
      { icon: Ruler, k: "Autonomia", v: "2.800 km" },
      { icon: Gauge, k: "Velocità", v: "780 km/h" },
      { icon: Wind, k: "Quota", v: "13.100 m" },
    ],
  },
  {
    id: "midsize",
    name: "Aurea Midsize",
    label: "Cabina stand-up · 9 posti · 5.600 km",
    image: cabinDining,
    lines: [
      { dt: "Missione", dd: "Milano–Dubai, Londra–Riyadh, transfer mediterranei" },
      { dt: "Cabina", dd: "Altezza in piedi, club four, divano trasformabile" },
      { dt: "A bordo", dd: "Chef a bordo, cantina selezionata, hostess dedicata" },
    ],
    specs: [
      { icon: Users, k: "Passeggeri", v: "8 – 9" },
      { icon: Ruler, k: "Autonomia", v: "5.600 km" },
      { icon: Gauge, k: "Velocità", v: "850 km/h" },
      { icon: Wind, k: "Quota", v: "13.700 m" },
    ],
  },
  {
    id: "ultra",
    name: "Aurea Ultra",
    label: "Suite intercontinentale · 14 posti · 12.000 km",
    image: cabinNight,
    lines: [
      { dt: "Missione", dd: "Intercontinentale senza scali: Europa–Asia, Europa–Americhe" },
      { dt: "Cabina", dd: "Tre ambienti separati, suite notte con letto matrimoniale" },
      { dt: "A bordo", dd: "Doccia, sala riunioni, equipaggio doppio, privacy assoluta" },
    ],
    specs: [
      { icon: Users, k: "Passeggeri", v: "12 – 14" },
      { icon: Ruler, k: "Autonomia", v: "12.000 km" },
      { icon: Gauge, k: "Velocità", v: "900 km/h" },
      { icon: Wind, k: "Quota", v: "15.500 m" },
    ],
  },
];

export default function JetCabinStage() {
  const [active, setActive] = useState(CABINS.length - 1);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    panelRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const cabin = CABINS[active];

  return (
    <section id="flotta" className="relative bg-background px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col gap-5">
          <LuxeTag>Flotta selezionata</LuxeTag>
          <h2 className="max-w-2xl font-heading text-3xl font-semibold leading-tight sm:text-5xl">
            Tre cabine. <span className="italic text-primary">Una sola idea di tempo.</span>
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-16">
          {/* Palco sticky */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden border border-border/60 bg-card/40 sm:aspect-[3/4]">
              <LuxeCorners />
              {CABINS.map((c, i) => (
                <motion.img
                  key={c.id}
                  src={c.image}
                  alt={`Cabina ${c.name}`}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                  animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.06 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-background/25" />

              <div className="absolute inset-x-5 bottom-5">
                <p className="font-heading text-2xl font-semibold">{cabin.name}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-foreground/60">{cabin.label}</p>
              </div>
            </div>

            {/* Indice numerato */}
            <ol className="mt-5 grid grid-cols-3 divide-x divide-border/60 border border-border/60">
              {CABINS.map((c, i) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActive(i);
                      panelRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className="flex min-h-11 w-full flex-col items-center justify-center gap-1 px-2 py-3 transition-colors"
                    style={{
                      background: active === i ? "hsl(var(--primary) / 0.12)" : "transparent",
                      color: active === i ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                    }}
                    aria-current={active === i}
                  >
                    <span className="text-[9px] tracking-[0.28em]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[10px] uppercase tracking-[0.18em]">{c.name.replace("Aurea ", "")}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* Pannelli */}
          <div className="flex flex-col gap-14 sm:gap-24">
            {CABINS.map((c, i) => (
              <article
                key={c.id}
                id={c.id}
                data-index={i}
                ref={(el) => (panelRefs.current[i] = el)}
                className="scroll-mt-28 transition-opacity duration-500"
                style={{ opacity: active === i ? 1 : 0.42 }}
              >
                <p className="text-[10px] uppercase tracking-[0.28em] text-primary">{c.label}</p>
                <h3 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">{c.name}</h3>

                <dl className="mt-7 divide-y divide-border/60 border-y border-border/60">
                  {c.lines.map((l) => (
                    <div key={l.dt} className="grid grid-cols-[92px_1fr] gap-4 py-4 sm:grid-cols-[128px_1fr]">
                      <dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{l.dt}</dt>
                      <dd className="text-sm leading-relaxed text-foreground/85">{l.dd}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 grid grid-cols-2 gap-px bg-border/60 sm:grid-cols-4">
                  {c.specs.map(({ icon: Icon, k, v }) => (
                    <div key={k} className="bg-card/70 px-4 py-5">
                      <Icon className="mb-3 h-4 w-4 text-primary" />
                      <p className="font-heading text-lg font-semibold leading-none">{v}</p>
                      <p className="mt-1.5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{k}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
