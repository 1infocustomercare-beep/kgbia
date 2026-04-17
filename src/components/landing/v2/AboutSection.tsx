import { motion } from "framer-motion";

const PILLARS = [
  {
    icon: "⚙️",
    title: "Tecnologia Proprietaria",
    desc: "Stack AI sviluppato internamente: 98 agenti specializzati, modelli verticali per settore, infrastruttura cloud-native europea conforme GDPR.",
  },
  {
    icon: "🎯",
    title: "Risultati Misurabili",
    desc: "Ogni cliente accede a un dashboard con KPI reali: revenue, conversioni, ore risparmiate, ROI sull'investimento. Niente promesse, solo dati.",
  },
  {
    icon: "🛡️",
    title: "Garanzia 90 Giorni",
    desc: "Se in 90 giorni l'AI non genera valore tangibile per il tuo business, ti restituiamo l'intero investimento. Senza domande, senza vincoli.",
  },
];

export default function AboutSection() {
  return (
    <section id="chi-siamo" className="relative py-24 px-5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,58,237,0.08), transparent)" }} />

      <div className="relative max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[2px] mb-4 border border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/5">
            Chi Siamo
          </span>
          <h2 className="text-[clamp(2rem,5vw,3.6rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] mb-5 text-white">
            Non vendiamo software.
            <span className="block bg-gradient-to-r from-[#D4AF37] to-[#7C3AED] bg-clip-text text-transparent">
              Costruiamo imprese autonome.
            </span>
          </h2>
          <p className="text-white/65 text-[clamp(0.98rem,1.7vw,1.1rem)] leading-[1.65] max-w-[720px] mx-auto">
            Empire AI Group nasce da un'osservazione: il 78% degli imprenditori italiani lavora 60+ ore a settimana
            per gestire processi che potrebbero essere automatizzati. Noi eliminiamo quel sovraccarico.
            Costruiamo l'infrastruttura AI che fa funzionare il tuo business mentre tu pensi al futuro.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative p-7 rounded-3xl border border-white/[0.07] backdrop-blur-xl"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))" }}
            >
              <div className="text-3xl mb-4">{p.icon}</div>
              <h3 className="text-lg font-heading font-bold text-white mb-2.5">{p.title}</h3>
              <p className="text-[13px] text-white/60 leading-[1.65]">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
