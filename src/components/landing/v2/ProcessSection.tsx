import { motion } from "framer-motion";

const STEPS = [
  {
    n: "01",
    title: "Discovery & Strategia",
    desc: "Audit completo del business, analisi dei processi, identificazione dei punti di automazione ad alto impatto. Output: roadmap personalizzata.",
    days: "Giorno 1-3",
    accent: "#D4AF37",
  },
  {
    n: "02",
    title: "Design & Architettura",
    desc: "Sito premium responsive, dashboard verticale, identità visiva, struttura agenti AI. Tutto allineato al posizionamento del brand.",
    days: "Giorno 4-7",
    accent: "#a78bfa",
  },
  {
    n: "03",
    title: "Sviluppo & Integrazione",
    desc: "Implementazione tecnica, configurazione agenti, integrazione WhatsApp, POS, gestionali. Test in ambiente sandbox.",
    days: "Giorno 8-12",
    accent: "#7C3AED",
  },
  {
    n: "04",
    title: "Onboarding & Lancio",
    desc: "Formazione del team, migrazione dati, attivazione agenti AI, pubblicazione live. Affiancamento dedicato in produzione.",
    days: "Giorno 13-14",
    accent: "#22d3ee",
  },
  {
    n: "05",
    title: "Ottimizzazione Continua",
    desc: "Monitoraggio KPI, training degli agenti sui dati reali, espansione delle automazioni. Crescita misurabile mese su mese.",
    days: "Mese 1+",
    accent: "#ec4899",
  },
];

export default function ProcessSection() {
  return (
    <section id="processo" className="landing-section relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28" data-theme="dark">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 40% at 50% 30%, rgba(124,58,237,0.1), transparent)" }} />

      <div className="relative max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[3px] mb-5 border border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/5 backdrop-blur-md">
            Come Lavoriamo
          </span>
          <h2 className="text-[clamp(2rem,5vw,3.6rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] mb-5 text-white">
            Da idea a impresa autonoma
            <span className="block bg-gradient-to-r from-[#D4AF37] to-[#7C3AED] bg-clip-text text-transparent">
              in 14 giorni.
            </span>
          </h2>
          <p className="text-white/65 text-[clamp(0.95rem,1.6vw,1.08rem)] max-w-[680px] mx-auto leading-[1.65]">
            Un processo ingegnerizzato, replicabile, garantito. Niente sorprese, niente ritardi, solo risultati.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-[28px] lg:left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#D4AF37]/40 via-[#7C3AED]/40 to-[#ec4899]/40 lg:-translate-x-1/2" />

          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className={`relative flex items-start gap-6 mb-10 lg:mb-14 lg:w-1/2 ${
                i % 2 === 0 ? "lg:pr-12" : "lg:ml-auto lg:pl-12"
              }`}
            >
              {/* Number badge */}
              <div
                className={`relative z-10 flex-shrink-0 w-14 h-14 rounded-2xl grid place-items-center font-heading font-extrabold text-lg backdrop-blur-md border ${
                  i % 2 === 0 ? "lg:order-2 lg:-mr-7" : "lg:-ml-7"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${s.accent}33, rgba(0,0,0,0.7))`,
                  borderColor: `${s.accent}66`,
                  color: s.accent,
                  boxShadow: `0 12px 32px ${s.accent}40`,
                }}
              >
                {s.n}
              </div>

              {/* Card */}
              <div
                className="flex-1 p-6 rounded-3xl border backdrop-blur-xl"
                style={{
                  background: `linear-gradient(135deg, ${s.accent}10, rgba(255,255,255,0.02))`,
                  borderColor: `${s.accent}33`,
                }}
              >
                <div
                  className="text-[10px] font-bold uppercase tracking-[2px] mb-2"
                  style={{ color: s.accent }}
                >
                  {s.days}
                </div>
                <h3 className="text-lg lg:text-xl font-heading font-bold text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-[13px] text-white/65 leading-[1.65]">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
