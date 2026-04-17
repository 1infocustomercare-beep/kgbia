import { motion } from "framer-motion";

const TEAM = [
  {
    name: "Sebastiano Romano",
    role: "Founder & CEO",
    bio: "10+ anni nell'automazione enterprise. Ha guidato la trasformazione AI di oltre 200 PMI italiane.",
    initials: "SR",
    accent: "#D4AF37",
  },
  {
    name: "Kevin Berardini",
    role: "CTO & AI Architect",
    bio: "Ex-Google, specializzato in modelli multi-agent. Costruisce l'infrastruttura che gestisce milioni di task/mese.",
    initials: "KB",
    accent: "#7C3AED",
  },
  {
    name: "Arianna",
    role: "Head of Customer Success",
    bio: "Il primo agente AI conversazionale italiano specializzato in onboarding e supporto premium 24/7.",
    initials: "AI",
    accent: "#F97316",
  },
  {
    name: "Marco Bianchi",
    role: "Head of Vertical Solutions",
    bio: "Architetto delle soluzioni settoriali. 25+ verticali industriali progettati e deployati.",
    initials: "MB",
    accent: "#22d3ee",
  },
];

export default function TeamSection() {
  return (
    <section id="team" className="relative py-24 px-5 overflow-hidden">
      <div className="relative max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[2px] mb-4 border border-[#7C3AED]/30 text-[#a78bfa] bg-[#7C3AED]/5">
            Il Team
          </span>
          <h2 className="text-[clamp(2rem,5vw,3.4rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] mb-4 text-white">
            Persone reali.
            <span className="block bg-gradient-to-r from-[#7C3AED] to-[#D4AF37] bg-clip-text text-transparent">
              Macchine che lavorano per te.
            </span>
          </h2>
          <p className="text-white/65 text-[clamp(0.95rem,1.6vw,1.05rem)] max-w-[600px] mx-auto leading-[1.65]">
            Un team ibrido di esperti umani e agenti AI. Disponibili sempre, decisioni prese in autonomia, escalation chirurgica quando serve.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TEAM.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="relative p-5 rounded-3xl border border-white/[0.07] backdrop-blur-xl text-center group"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))" }}
            >
              <div
                className="w-20 h-20 mx-auto rounded-full grid place-items-center text-white font-heading font-extrabold text-xl mb-4 transition-transform group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${m.accent}, ${m.accent}66)`,
                  boxShadow: `0 12px 36px ${m.accent}40`,
                }}
              >
                {m.initials}
              </div>
              <h3 className="text-sm font-heading font-bold text-white mb-1">{m.name}</h3>
              <p className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: m.accent }}>{m.role}</p>
              <p className="text-[12px] text-white/55 leading-[1.55]">{m.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
