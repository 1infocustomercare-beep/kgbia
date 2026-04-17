import { motion } from "framer-motion";

const TEAM = [
  {
    name: "Kevin Berardini",
    role: "Founder & CEO",
    bio: "Visionario tech, ingegnere AI. Ha costruito Empire AI Group da zero. Specialista in automation enterprise.",
    initials: "KB",
    accent: "#D4AF37",
  },
  {
    name: "Marco Telese",
    role: "CTO & Lead Architect",
    bio: "Architettura AI proprietaria, sviluppo agenti, infrastruttura cloud-native europea. 15+ anni in tech.",
    initials: "MT",
    accent: "#7C3AED",
  },
  {
    name: "Arianna AI",
    role: "Senior Sales Strategist",
    bio: "Voice agent proprietaria. Conduce demo, qualifica clienti, chiude trattative. Mai stanca, sempre on-brand.",
    initials: "AI",
    accent: "#ec4899",
  },
];

export default function TeamSection() {
  return (
    <section id="team" className="relative py-28 px-5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.08), transparent)" }} />

      <div className="relative max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[3px] mb-5 border border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/5 backdrop-blur-md">
            Il Team
          </span>
          <h2 className="text-[clamp(2rem,5vw,3.6rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] mb-5 text-white">
            Umani e AI.
            <span className="block bg-gradient-to-r from-[#D4AF37] to-[#7C3AED] bg-clip-text text-transparent">
              Una squadra ibrida.
            </span>
          </h2>
          <p className="text-white/65 text-[clamp(0.95rem,1.6vw,1.05rem)] max-w-[640px] mx-auto leading-[1.65]">
            Imprenditori, ingegneri e agenti AI proprietari. Ogni cliente segue da un team che combina visione strategica e potenza computazionale.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {TEAM.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.7 }}
              whileHover={{ y: -8 }}
              className="relative p-7 rounded-3xl border backdrop-blur-xl group overflow-hidden text-center"
              style={{
                background: `linear-gradient(135deg, ${t.accent}0d, rgba(255,255,255,0.01))`,
                borderColor: `${t.accent}25`,
              }}
            >
              <div
                className="absolute -top-1/2 -right-1/2 w-[120%] h-[120%] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${t.accent}20, transparent 60%)` }}
              />

              <div
                className="relative w-24 h-24 rounded-full mx-auto mb-5 grid place-items-center font-heading font-extrabold text-2xl transition-transform duration-500 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${t.accent}, ${t.accent}99)`,
                  color: "#000",
                  boxShadow: `0 16px 48px ${t.accent}55`,
                  border: "2px solid rgba(255,255,255,0.1)",
                }}
              >
                {t.initials}
              </div>

              <h3 className="text-lg font-heading font-bold text-white mb-1 relative">{t.name}</h3>
              <div className="text-[11px] uppercase tracking-[2px] font-bold mb-4 relative" style={{ color: t.accent }}>
                {t.role}
              </div>
              <p className="text-[13px] text-white/65 leading-[1.65] relative">{t.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
