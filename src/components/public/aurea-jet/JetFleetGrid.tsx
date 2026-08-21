/**
 * ═══ JET FLEET GRID ═══
 * Catalogo flotta luxury: card in vetro champagne (glass layer + sheen),
 * fotografie premium reali coerenti con ogni aeromobile, specifiche sempre
 * leggibili su mobile.
 * ADDITIVO — solo presentazione.
 */
import { motion } from "framer-motion";
import { Gauge, Ruler, Users } from "lucide-react";
import fleetG700 from "@/assets/aurea-jet/fleet-g700.jpg";
import fleetGlobal from "@/assets/aurea-jet/fleet-global8000.jpg";
import fleetFalcon from "@/assets/aurea-jet/fleet-falcon10x.jpg";
import fleetChallenger from "@/assets/aurea-jet/fleet-challenger3500.jpg";
import fleetPraetor from "@/assets/aurea-jet/fleet-praetor600.jpg";
import fleetRotor from "@/assets/aurea-jet/fleet-rotor175.jpg";

const FLEET = [
  { name: "Aurea G700", tier: "Ultra long range", img: fleetG700, pax: "19", range: "13.890 km", speed: "Mach 0.925", hourly: "€ 12.400 / h" },
  { name: "Aurea Global 8000", tier: "Ultra long range", img: fleetGlobal, pax: "17", range: "14.800 km", speed: "Mach 0.94", hourly: "€ 13.100 / h" },
  { name: "Aurea Falcon 10X", tier: "Wide cabin", img: fleetFalcon, pax: "16", range: "13.900 km", speed: "Mach 0.925", hourly: "€ 11.700 / h" },
  { name: "Aurea Challenger 3500", tier: "Super mid-size", img: fleetChallenger, pax: "10", range: "6.500 km", speed: "Mach 0.83", hourly: "€ 6.900 / h" },
  { name: "Aurea Praetor 600", tier: "Super mid-size", img: fleetPraetor, pax: "12", range: "7.400 km", speed: "Mach 0.83", hourly: "€ 6.400 / h" },
  { name: "Aurea Rotor 175", tier: "Elicottero VIP", img: fleetRotor, pax: "8", range: "780 km", speed: "287 km/h", hourly: "€ 4.200 / h" },
];

export default function JetFleetGrid() {
  return (
    <section id="flotta" className="relative px-4 py-20 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl sm:mb-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-primary">La flotta</p>
          <h2 className="jet-serif mt-5 text-[clamp(2rem,8vw,3.75rem)] leading-[0.95]">
            Sei macchine. <span className="italic text-primary">Una sola promessa.</span>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-foreground/65 sm:text-base">
            Ogni aeromobile è operato da vettori certificati e ispezionato prima di ogni missione. Tariffe indicative, tutto incluso.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {FLEET.map((jet, i) => (
            <motion.article
              key={jet.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="jet-glass jet-sheen group relative overflow-hidden rounded-[26px] transition-all duration-500 hover:border-primary/55 hover:shadow-[0_36px_100px_-40px_hsl(var(--primary)/0.55)]"
            >
              <div className="relative h-48 overflow-hidden sm:h-52">
                <motion.img
                  src={jet.img}
                  alt={`Aeromobile ${jet.name}`}
                  loading="lazy"
                  width={1536}
                  height={1024}
                  initial={{ scale: 1.14 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background)/0.15)_0%,transparent_38%,hsl(var(--background)/0.92)_100%)]" />
                <span className="absolute left-4 top-4 rounded-full border border-primary/45 bg-background/45 px-3 py-1 text-[9px] uppercase tracking-[0.26em] text-primary backdrop-blur-md">
                  {jet.tier}
                </span>
              </div>

              <div className="relative p-5">
                <h3 className="jet-serif text-2xl">{jet.name}</h3>
                <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-primary">{jet.hourly}</p>

                <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl border border-primary/12 bg-foreground/[0.03] p-3">
                  <Spec icon={<Users className="h-3.5 w-3.5" />} label="Pax" value={jet.pax} />
                  <Spec icon={<Ruler className="h-3.5 w-3.5" />} label="Autonomia" value={jet.range} />
                  <Spec icon={<Gauge className="h-3.5 w-3.5" />} label="Velocità" value={jet.speed} />
                </div>
              </div>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-700 group-hover:scale-x-100" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <span className="flex items-center gap-1 text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        {icon}
        <span className="truncate">{label}</span>
      </span>
      <p className="mt-1 truncate text-xs font-semibold text-foreground">{value}</p>
    </div>
  );
}
