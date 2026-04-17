import { motion } from "framer-motion";

const STEPS = [
  {
    n: "01",
    title: "Audit & Discovery",
    desc: "Analizziamo il tuo business, processi, KPI critici. Identifichiamo le 3 aree con il ROI più alto da automatizzare per primo.",
    accent: "#D4AF37",
  },
  {
    n: "02",
    title: "Design Verticale",
    desc: "Progettiamo dashboard, sito e flussi su misura per il tuo settore. Niente template — architettura proprietaria.",
    accent: "#7C3AED",
  },
  {
    n: "03",
    title: "Configurazione Agenti",
    desc: "Selezioniamo, addestriamo e calibriamo gli agenti AI sui tuoi dati, brand voice e regole di business.",
    accent: "#F97316",
  },
  {
    n: "04",
    title: "Deploy & Onboarding",
    desc: "Live in 14 giorni. Formazione completa per il team. Account manager dedicato per i primi 90 giorni.",
    accent: "#22d3ee",
  },
  {
    n: "05",
    title: "Ottimizzazione Continua",
    desc: "Ogni mese aggiorniamo modelli, aggiungiamo agenti, espandiamo capacità. La tua piattaforma cresce con te.",
    accent: "#ec4899",
  },
];

export default function CustomizationSection() {
  return (
    <section id="personalizzazione" className="relative py-24 px-5 overflow-hidden">
      <div className="relative max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[2px] mb-4 border border-[#F97316]/30 text-[#F97316] bg-[#F97316]/5">
            Personalizzazione
          </span>
          <h2 className="text-[clamp(2rem,5vw,3.4rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] mb-4 text-white">
            Il tuo business è unico.
            <span className="block bg-gradient-to-r from-[#F97316] to-[#D4AF37] bg-clip-text text-transparent">
              La tua AI deve esserlo altrettanto.
            </span>
          </h2>
          <p className="text-white/65 text-[clamp(0.95rem,1.6vw,1.05rem)] max-w-[640px] mx-auto leading-[1.65]">
            Un percorso chirurgico in 5 fasi. Live in 14 giorni. Risultati misurabili dal primo mese.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent md:-translate-x-1/2" />

          <div className="space-y-8">
            {STEPS.map((s, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative pl-16 md:pl-0 md:grid md:grid-cols-2 md:gap-12 ${isLeft ? "" : "md:[&>*:first-child]:order-2"}`}
                >
                  {/* Dot */}
                  <div
                    className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full md:-translate-x-1/2 top-3"
                    style={{
                      background: s.accent,
                      boxShadow: `0 0 0 4px rgba(2,2,4,1), 0 0 24px ${s.accent}88`,
                    }}
                  />
                  <div className={`md:px-8 ${isLeft ? "md:text-right" : "md:text-left"}`}>
                    <div className="text-5xl font-heading font-extrabold mb-1" style={{ color: s.accent, opacity: 0.8 }}>
                      {s.n}
                    </div>
                    <h3 className="text-xl font-heading font-bold text-white mb-2">{s.title}</h3>
                    <p className="text-[13px] text-white/60 leading-[1.65] max-w-[400px] md:ml-auto">{s.desc}</p>
                  </div>
                  <div />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
