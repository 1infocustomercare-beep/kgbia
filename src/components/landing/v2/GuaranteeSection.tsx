import { motion } from "framer-motion";
import { ShieldCheck, RefreshCw, Clock, Award } from "lucide-react";

const GUARANTEES = [
  {
    Icon: ShieldCheck,
    title: "Garanzia 90 giorni",
    desc: "Soddisfatti o rimborsati al 100%. Senza domande, senza penali, senza vincoli contrattuali.",
    accent: "#22c55e",
  },
  {
    Icon: RefreshCw,
    title: "Aggiornamenti continui",
    desc: "Nuovi agenti, modelli AI più potenti, integrazioni: tutto incluso nel canone, per sempre.",
    accent: "#a78bfa",
  },
  {
    Icon: Clock,
    title: "Live in 14 giorni",
    desc: "Dal primo contatto al sito attivo con agenti operativi. Niente attese di mesi, niente promesse vaghe.",
    accent: "#D4AF37",
  },
  {
    Icon: Award,
    title: "Conformità totale",
    desc: "GDPR, fatturazione elettronica 2026, sicurezza enterprise. Tutto certificato, tutto a norma.",
    accent: "#60a5fa",
  },
];

export default function GuaranteeSection() {
  return (
    <section className="relative py-24 px-5 overflow-hidden">
      <div className="relative max-w-[1300px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[3px] mb-5 border border-emerald-400/30 text-emerald-400 bg-emerald-400/5 backdrop-blur-md">
            Le nostre garanzie
          </span>
          <h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] mb-4 text-white">
            Zero rischi.
            <span className="bg-gradient-to-r from-emerald-400 to-[#D4AF37] bg-clip-text text-transparent"> Solo crescita.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {GUARANTEES.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="relative p-6 rounded-3xl border backdrop-blur-xl group overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${g.accent}0d, rgba(255,255,255,0.01))`,
                borderColor: `${g.accent}25`,
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl grid place-items-center mb-4"
                style={{
                  background: `linear-gradient(135deg, ${g.accent}33, ${g.accent}0a)`,
                  border: `1px solid ${g.accent}55`,
                  boxShadow: `0 8px 24px ${g.accent}30`,
                }}
              >
                <g.Icon className="w-5 h-5" style={{ color: g.accent }} strokeWidth={2} />
              </div>
              <h3 className="text-base font-heading font-bold text-white mb-2">{g.title}</h3>
              <p className="text-[12.5px] text-white/65 leading-[1.6]">{g.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
