import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const TEAM = [
  { name: "Team Empire", role: "Fondatori & Sviluppatori", emoji: "👨‍💻" },
  { name: "Arianna", role: "AI Sales Assistant", emoji: "🤖" },
  { name: "Dev Team", role: "Full-Stack & AI Engineers", emoji: "⚡" },
  { name: "Design Team", role: "UX/UI & Brand Design", emoji: "🎨" },
];

export default function LandingTeamContact() {
  const navigate = useNavigate();

  return (
    <>
      {/* Team */}
      <section className="py-16 lg:py-24 border-t border-white/[0.07]" style={{ background: "#080810" }}>
        <div className="max-w-[1320px] mx-auto px-5">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-5">
              <span className="w-5 h-[1.5px] bg-[#7eb7be]" />IL TEAM
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold">
              Chi <span className="bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">Siamo</span>
            </h2>
            <p className="text-white/55 max-w-[620px] mx-auto text-[15px] leading-[1.7] mt-2">
              Un team di innovatori italiani che unisce tecnologia, design e intelligenza artificiale per trasformare ogni business.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-[900px] mx-auto">
            {TEAM.map((t, i) => (
              <motion.div key={t.name}
                className="text-center py-8 px-4 rounded-3xl border border-white/[0.07] hover:-translate-y-1.5 transition-all"
                style={{ background: "#0d0d1a" }}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}>
                <div className="text-4xl mb-3">{t.emoji}</div>
                <h3 className="font-heading font-bold text-sm text-white mb-1">{t.name}</h3>
                <p className="text-[11px] text-white/55">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contatti" className="py-16 lg:py-24" style={{ background: "#020204" }}>
        <div className="max-w-[1320px] mx-auto px-5">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-5">
              <span className="w-5 h-[1.5px] bg-[#7eb7be]" />CONTATTI
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold">
              Parliamo del Tuo <span className="bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">Progetto</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[900px] mx-auto">
            {[
              { icon: "📧", label: "Email", value: "info@empire-ai.it", href: "mailto:info@empire-ai.it" },
              { icon: "📱", label: "WhatsApp", value: "Scrivici su WhatsApp", href: "https://wa.me/393000000000" },
              { icon: "📍", label: "Sede", value: "Italia — Operativi 7/7", href: "#" },
            ].map((c, i) => (
              <motion.a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                className="text-center py-8 px-6 rounded-3xl border border-white/[0.07] hover:-translate-y-1 hover:border-[#7eb7be] transition-all block"
                style={{ background: "#0d0d1a" }}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}>
                <div className="text-3xl mb-3">{c.icon}</div>
                <h3 className="font-heading font-bold text-sm text-white mb-1">{c.label}</h3>
                <p className="text-xs text-[#7eb7be]">{c.value}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
