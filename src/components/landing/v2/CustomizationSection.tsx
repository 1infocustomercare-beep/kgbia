import { motion } from "framer-motion";
import { Palette, Code2, Workflow, Plug } from "lucide-react";

const CUSTOM = [
  {
    Icon: Palette,
    title: "Brand Identity Tailored",
    desc: "Sito e dashboard personalizzati al 100% sul tuo brand: colori, tipografia, asset visivi, tone of voice.",
    accent: "#D4AF37",
  },
  {
    Icon: Workflow,
    title: "Flussi Settoriali Custom",
    desc: "Processi modellati sul tuo settore specifico: prenotazioni, ordini, fatturazione, automazioni dedicate.",
    accent: "#a78bfa",
  },
  {
    Icon: Code2,
    title: "Agenti AI On-Demand",
    desc: "Hai un'esigenza unica? Sviluppiamo un agente AI dedicato per il tuo caso d'uso, integrato nel tuo ecosistema.",
    accent: "#7C3AED",
  },
  {
    Icon: Plug,
    title: "Integrazioni Senza Limiti",
    desc: "POS, gestionali, CRM, marketplace: collegniamo qualsiasi sistema. La tua infrastruttura non si ferma più.",
    accent: "#22d3ee",
  },
];

export default function CustomizationSection() {
  return (
    <section id="personalizzazione" className="relative py-28 px-5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(124,58,237,0.1), transparent)" }} />

      <div className="relative max-w-[1300px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[3px] mb-5 border border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/5 backdrop-blur-md">
            Personalizzazione Totale
          </span>
          <h2 className="text-[clamp(2rem,5vw,3.6rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] mb-5 text-white">
            Una piattaforma.
            <span className="block bg-gradient-to-r from-[#D4AF37] to-[#7C3AED] bg-clip-text text-transparent">
              Mille configurazioni.
            </span>
          </h2>
          <p className="text-white/65 text-[clamp(0.95rem,1.6vw,1.08rem)] max-w-[700px] mx-auto leading-[1.7]">
            Empire non è un template. È un'infrastruttura modellata su misura per il tuo business, il tuo settore, la tua visione.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {CUSTOM.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              whileHover={{ y: -6 }}
              className="relative p-7 lg:p-8 rounded-3xl border backdrop-blur-xl group overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${c.accent}10, rgba(255,255,255,0.02))`,
                borderColor: `${c.accent}25`,
              }}
            >
              <div
                className="absolute -top-1/2 -right-1/2 w-[120%] h-[120%] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${c.accent}20, transparent 60%)` }}
              />
              <div
                className="relative w-14 h-14 rounded-2xl grid place-items-center mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                style={{
                  background: `linear-gradient(135deg, ${c.accent}33, ${c.accent}0a)`,
                  border: `1px solid ${c.accent}55`,
                  boxShadow: `0 12px 32px ${c.accent}30`,
                }}
              >
                <c.Icon className="w-6 h-6" style={{ color: c.accent }} strokeWidth={2} />
              </div>
              <h3 className="text-lg lg:text-xl font-heading font-bold text-white mb-2.5 relative">{c.title}</h3>
              <p className="text-[13.5px] text-white/65 leading-[1.7] relative">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
