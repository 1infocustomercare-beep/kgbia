/**
 * ═══ JET FLEET SELECTOR ═══
 * Editorial variant switcher (Ruzza-style triple product selector) adapted to
 * three cabin classes: immagine grande, specifiche e note di bordo.
 */
import { AnimatePresence, motion } from "framer-motion";
import { Gauge, Users, Ruler, Timer } from "lucide-react";
import cabinMain from "@/assets/aurea-jet/cabin-main.jpg";
import cabinNight from "@/assets/aurea-jet/cabin-night.jpg";
import helicopter from "@/assets/aurea-jet/helicopter.jpg";
import { LuxePanel, LuxeTag } from "@/components/public/luxe";
import { useJetStepper } from "./useJetStepper";


const FLEET = [
  {
    id: "light",
    name: "Aurea Light",
    family: "Very Light / Light Jet",
    image: helicopter,
    tagline: "Salti brevi, città vicine.",
    specs: [
      { icon: Users, label: "Passeggeri", value: "4 – 7" },
      { icon: Ruler, label: "Autonomia", value: "2.400 km" },
      { icon: Timer, label: "Attivazione", value: "da 2 h" },
      { icon: Gauge, label: "Velocità", value: "780 km/h" },
    ],
    notes: ["Milano – Nizza in 55 minuti", "Accesso a piste corte e isole", "Transfer in elicottero coordinato"],
    price: "da € 3.900 / tratta",
  },
  {
    id: "midsize",
    name: "Aurea Midsize",
    family: "Midsize / Super Midsize",
    image: cabinMain,
    tagline: "L’ufficio che vola.",
    specs: [
      { icon: Users, label: "Passeggeri", value: "8 – 9" },
      { icon: Ruler, label: "Autonomia", value: "5.600 km" },
      { icon: Timer, label: "Attivazione", value: "da 3 h" },
      { icon: Gauge, label: "Velocità", value: "870 km/h" },
    ],
    notes: ["Cabina in piedi, Wi-Fi satellitare", "Tavolo riunione a 4 posti", "Catering firmato da chef stellato"],
    price: "da € 8.400 / tratta",
  },
  {
    id: "ultra",
    name: "Aurea Ultra",
    family: "Heavy / Ultra Long Range",
    image: cabinNight,
    tagline: "Intercontinentale, senza scali.",
    specs: [
      { icon: Users, label: "Passeggeri", value: "12 – 16" },
      { icon: Ruler, label: "Autonomia", value: "13.900 km" },
      { icon: Timer, label: "Attivazione", value: "da 5 h" },
      { icon: Gauge, label: "Velocità", value: "950 km/h" },
    ],
    notes: ["Suite notte con letto matrimoniale", "Doccia e zona spa a bordo", "Doppio equipaggio per rotte lunghe"],
    price: "da € 21.500 / tratta",
  },
];

export default function JetFleetSelector() {
  const {
    ref: sectionRef,
    index: active,
    setIndex: setActive,
    swipeHandlers,
  } = useJetStepper<HTMLElement>({ count: FLEET.length, initial: 1 });
  const jet = FLEET[active];

  return (
    <section
      ref={sectionRef}
      id="flotta"
      className="relative border-y border-border/50 px-5 py-20 sm:px-8 sm:py-28"
    >

      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <LuxeTag>Flotta selezionata</LuxeTag>
            <h2 className="mt-5 max-w-xl font-heading text-3xl font-semibold leading-tight sm:text-5xl">
              Tre cabine. Una sola idea di tempo.
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {FLEET.map((f, i) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={`min-h-11 border px-4 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                  active === i
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {f.name.replace("Aurea ", "")}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <LuxePanel glass className="relative overflow-hidden p-0">
            <AnimatePresence mode="wait">
              <motion.img
                key={jet.id}
                src={jet.image}
                alt={`Cabina ${jet.name}`}
                loading="lazy"
                width={1600}
                height={1000}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="h-[46svh] w-full object-cover sm:h-[62svh]"
              />
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-9">
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary">{jet.family}</p>
              <h3 className="mt-3 font-heading text-3xl font-semibold sm:text-5xl">{jet.name}</h3>
              <p className="mt-2 text-sm text-foreground/75">{jet.tagline}</p>
            </div>
          </LuxePanel>

          <div className="flex flex-col gap-5">
            <LuxePanel className="grid grid-cols-2 divide-x divide-y divide-border/50">
              {jet.specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="p-6">
                  <Icon className="mb-4 h-5 w-5 text-primary" />
                  <p className="font-heading text-2xl font-semibold">{value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
                </div>
              ))}
            </LuxePanel>

            <LuxePanel glass className="flex-1 p-6 sm:p-8">
              <p className="text-[10px] uppercase tracking-[0.28em] text-primary">A bordo</p>
              <ul className="mt-5 space-y-4">
                {jet.notes.map((n) => (
                  <li key={n} className="flex gap-3 text-sm leading-relaxed text-foreground/80">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-primary" />
                    {n}
                  </li>
                ))}
              </ul>
              <p className="mt-7 border-t border-border/50 pt-5 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                {jet.price}
              </p>
            </LuxePanel>
          </div>
        </div>
      </div>
    </section>
  );
}
