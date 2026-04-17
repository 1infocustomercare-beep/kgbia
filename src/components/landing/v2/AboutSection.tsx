import { motion } from "framer-motion";
import { Cpu, Target, ShieldCheck } from "lucide-react";

const PILLARS = [
  {
    Icon: Cpu,
    title: "Tecnologia Proprietaria",
    desc: "Stack AI sviluppato internamente: 98 agenti specializzati, modelli verticali per settore, infrastruttura cloud-native europea conforme GDPR.",
    accent: "#7C3AED",
  },
  {
    Icon: Target,
    title: "Risultati Misurabili",
    desc: "Ogni cliente accede a un dashboard con KPI reali: revenue, conversioni, ore risparmiate, ROI sull'investimento. Niente promesse, solo dati.",
    accent: "#D4AF37",
  },
  {
    Icon: ShieldCheck,
    title: "Garanzia 90 Giorni",
    desc: "Se in 90 giorni l'AI non genera valore tangibile per il tuo business, ti restituiamo l'intero investimento. Senza domande, senza vincoli.",
    accent: "#22c55e",
  },
];

export default function AboutSection() {
  return (
    <section id="chi-siamo" className="relative py-28 px-5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,58,237,0.08), transparent)" }} />

      <div className="relative max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[3px] mb-5 border border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/5 backdrop-blur-md">
            Chi Siamo
          </span>
          <h2 className="text-[clamp(2rem,5vw,3.6rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] mb-5 text-white">
            Non vendiamo software.
            <span className="block bg-gradient-to-r from-[#D4AF37] to-[#7C3AED] bg-clip-text text-transparent">
              Costruiamo imprese autonome.
            </span>
          </h2>
          <p className="text-white/65 text-[clamp(0.98rem,1.7vw,1.1rem)] leading-[1.7] max-w-[760px] mx-auto">
            Empire AI Group nasce da un'osservazione: il 78% degli imprenditori italiani lavora 60+ ore a settimana
            per gestire processi che potrebbero essere automatizzati. Noi eliminiamo quel sovraccarico.
            Costruiamo l'infrastruttura AI che fa funzionare il tuo business mentre tu pensi al futuro.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.7 }}
              whileHover={{ y: -6 }}
              className="relative p-7 rounded-3xl border backdrop-blur-xl group overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${p.accent}10, rgba(255,255,255,0.01))`,
                borderColor: `${p.accent}25`,
              }}
            >
              <div
                className="absolute -top-1/2 -right-1/2 w-[120%] h-[120%] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${p.accent}20, transparent 60%)` }}
              />
              <div
                className="relative w-14 h-14 rounded-2xl grid place-items-center mb-5 transition-transform duration-500 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${p.accent}33, ${p.accent}0a)`,
                  border: `1px solid ${p.accent}55`,
                  boxShadow: `0 12px 32px ${p.accent}30`,
                }}
              >
                <p.Icon className="w-6 h-6" style={{ color: p.accent }} strokeWidth={2} />
              </div>
              <h3 className="text-lg font-heading font-bold text-white mb-2.5 relative">{p.title}</h3>
              <p className="text-[13px] text-white/65 leading-[1.7] relative">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
