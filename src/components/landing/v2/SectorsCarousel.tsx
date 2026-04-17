import { motion } from "framer-motion";

const SECTORS = [
  "Ristoranti & hospitality",
  "Spa & wellness",
  "Beauty & estetica",
  "Sport & fitness",
  "Real estate luxury",
  "Healthcare & cliniche",
  "NCC & trasporti",
  "Hotel & B&B",
  "Bakery & pastry",
  "Stabilimenti balneari",
  "Retail & e-commerce",
  "Studi professionali",
  "Saloni premium",
  "Palestre & yoga",
  "Cliniche dentali",
  "Agenzie immobiliari",
];

export default function SectorsCarousel() {
  return (
    <section id="settori" className="landing-section relative overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12" data-theme="dark">
      <div className="landing-section-glow" data-tone="blue" />

      <div className="relative mx-auto max-w-[1400px]">
        <div className="mb-7 text-center" data-tone="blue">
          <span className="landing-pill mb-4 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em]">25+ settori verticali</span>
          <h3 className="mx-auto max-w-[760px] text-[clamp(1.25rem,2vw,1.8rem)] font-heading font-bold tracking-[-0.04em] text-foreground">
            Strutture persuasive, contenuti di conversione e preview professionali per qualsiasi business ad alto potenziale.
          </h3>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-border/80 bg-card/45 py-4 backdrop-blur-xl">
...
                {sector}
              </span>
            ))}
          </motion.div>

          <motion.div className="flex gap-3" animate={{ x: ["-50%", "0%"] }} transition={{ duration: 42, repeat: Infinity, ease: "linear" }}>
            {[...SECTORS.slice().reverse(), ...SECTORS.slice().reverse()].map((sector, index) => (
              <span key={`b-${sector}-${index}`} className="landing-pill whitespace-nowrap px-4 py-2.5 text-sm font-medium text-foreground/74" data-tone={index % 3 === 0 ? "emerald" : index % 3 === 1 ? "violet" : "gold"}>
                {sector}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
