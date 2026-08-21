/**
 * ═══ JET FLEET GRID ═══
 * Griglia minimalista con card glassmorphism: hover → zoom immagine,
 * specifiche in dissolvenza e bordo oro champagne.
 * ADDITIVO — solo presentazione.
 */
import { motion } from "framer-motion";
import { Gauge, Ruler, Users } from "lucide-react";
import exteriorG700 from "@/assets/aurea-jet/exterior-g700.jpg";
import exteriorHangar from "@/assets/aurea-jet/exterior-hangar.jpg";
import galleyDetail from "@/assets/aurea-jet/galley-detail.jpg";
import wingCoast from "@/assets/aurea-jet/wing-coast.jpg";
import cockpit from "@/assets/aurea-jet/cockpit.jpg";
import helicopter from "@/assets/aurea-jet/helicopter.jpg";

const FLEET = [
  { name: "Aurea G700", tier: "Ultra long range", img: exteriorG700, pax: "19", range: "13.890 km", speed: "Mach 0.925", hourly: "€ 12.400 / h" },
  { name: "Aurea Global 8000", tier: "Ultra long range", img: exteriorHangar, pax: "17", range: "14.800 km", speed: "Mach 0.94", hourly: "€ 13.100 / h" },
  { name: "Aurea Falcon 10X", tier: "Wide cabin", img: galleyDetail, pax: "16", range: "13.900 km", speed: "Mach 0.925", hourly: "€ 11.700 / h" },
  { name: "Aurea Challenger 3500", tier: "Super mid-size", img: wingCoast, pax: "10", range: "6.500 km", speed: "Mach 0.83", hourly: "€ 6.900 / h" },
  { name: "Aurea Praetor 600", tier: "Super mid-size", img: cockpit, pax: "12", range: "7.400 km", speed: "Mach 0.83", hourly: "€ 6.400 / h" },
  { name: "Aurea Rotor 175", tier: "Elicottero VIP", img: helicopter, pax: "8", range: "780 km", speed: "287 km/h", hourly: "€ 4.200 / h" },
];

export default function JetFleetGrid() {
  return (
    <section id="flotta" className="relative px-5 py-24 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-primary">La flotta</p>
          <h2 className="jet-serif mt-5 text-4xl leading-[0.95] sm:text-6xl">
            Sei macchine. <span className="italic text-primary">Una sola promessa.</span>
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-foreground/65 sm:text-base">
            Ogni aeromobile è operato da vettori certificati e ispezionato prima di ogni missione. Tariffe indicative, tutto incluso.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FLEET.map((jet, i) => (
            <motion.article
              key={jet.name}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden border border-border/60 bg-card/40 backdrop-blur-xl transition-all duration-500 hover:border-primary/70 hover:shadow-[0_28px_80px_-32px_hsl(var(--primary)/0.55)]"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={jet.img}
                  alt={`Aeromobile ${jet.name}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,hsl(var(--background)/0.9)_100%)]" />
                <span className="absolute left-4 top-4 border border-primary/50 bg-background/50 px-3 py-1 text-[9px] uppercase tracking-[0.28em] text-primary backdrop-blur">
                  {jet.tier}
                </span>
              </div>

              <div className="relative p-5">
                <h3 className="jet-serif text-2xl">{jet.name}</h3>
                <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-primary">{jet.hourly}</p>

                <div className="mt-5 grid grid-cols-3 gap-3 opacity-70 transition-opacity duration-500 group-hover:opacity-100 sm:opacity-0">
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
    <div>
      <span className="flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
        {icon}
        {label}
      </span>
      <p className="mt-1 text-xs font-semibold text-foreground">{value}</p>
    </div>
  );
}
