import { motion } from "framer-motion";

const TEAM = [
  { name: "Team Empire", role: "Fondatori & Sviluppatori", icon: "👨‍💻", accent: "#22d3ee" },
  { name: "Arianna", role: "AI Sales Assistant", icon: "🤖", accent: "#ec4899" },
  { name: "Dev Team", role: "Full-Stack & AI Engineers", icon: "⚙️", accent: "#a78bfa" },
  { name: "Design Team", role: "UX/UI & Brand Design", icon: "🎨", accent: "#f59e0b" },
];

const CONTACTS = [
  { label: "Email", value: "info@empire-ai.it", href: "mailto:info@empire-ai.it", icon: "✉️", accent: "#22d3ee" },
  { label: "WhatsApp", value: "Scrivici su WhatsApp", href: "https://wa.me/393000000000", icon: "💬", accent: "#4ade80" },
  { label: "Sede", value: "Italia — Operativi 7/7", href: "#", icon: "📍", accent: "#f59e0b" },
];

export default function LandingTeamContact() {
  return (
    <>
      {/* Team — cool steel blue */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, #020208 0%, #0a0e1a 40%, #0c1220 60%, #020208 100%)",
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(ellipse 50% 40% at 30% 50%, rgba(34,211,238,0.03) 0%, transparent 50%), radial-gradient(ellipse 40% 40% at 70% 50%, rgba(167,139,250,0.03) 0%, transparent 50%)",
        }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent" />

        <div className="relative z-[1] max-w-[1320px] mx-auto px-5">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-cyan-400 font-bold mb-5">
              <span className="w-6 h-[2px] bg-gradient-to-r from-cyan-400 to-transparent" />CHI SIAMO
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold text-white">
              Persone Reali. <span className="text-cyan-400">Tecnologia Straordinaria.</span>
            </h2>
            <p className="text-white/55 max-w-[620px] mx-auto text-[15px] leading-[1.7] mt-3">
              Un team di innovatori italiani che unisce ingegneria, design e intelligenza artificiale per trasformare ogni business.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1100px] mx-auto">
            {TEAM.map((t, i) => (
              <motion.div
                key={t.name}
                className="text-center py-8 px-5 rounded-3xl border border-white/[0.06] hover:-translate-y-2 hover:border-white/[0.14] transition-all group"
                style={{ background: "linear-gradient(180deg, rgba(10,14,26,0.9), rgba(6,8,18,0.95))" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 border border-white/[0.06] group-hover:scale-110 transition-transform"
                  style={{ background: `${t.accent}10`, boxShadow: `0 0 20px ${t.accent}08` }}>
                  {t.icon}
                </div>
                <h3 className="font-heading font-bold text-sm text-white/90 mb-1">{t.name}</h3>
                <p className="text-[12px] text-white/50">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts — warm amber */}
      <section id="contatti" className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, #020208 0%, #10100a 50%, #020208 100%)",
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(245,158,11,0.04) 0%, transparent 60%)",
        }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/10 to-transparent" />

        <div className="relative z-[1] max-w-[1320px] mx-auto px-5">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-amber-400 font-bold mb-5">
              <span className="w-6 h-[2px] bg-gradient-to-r from-amber-400 to-transparent" />PARLIAMONE
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold text-white">
              Pronto a Trasformare il Tuo <span className="text-amber-400">Business?</span>
            </h2>
            <p className="text-white/55 max-w-[520px] mx-auto text-[15px] leading-[1.7] mt-3">
              Contattaci per una consulenza gratuita di 15 minuti. Ti mostriamo cosa possiamo fare per il tuo settore.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1000px] mx-auto">
            {CONTACTS.map((c, i) => (
              <motion.a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="text-center py-8 px-6 rounded-3xl border border-white/[0.06] hover:-translate-y-1 hover:border-white/[0.14] transition-all block group"
                style={{ background: "linear-gradient(180deg, rgba(16,16,10,0.9), rgba(8,8,4,0.95))" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mx-auto mb-3 border border-white/[0.06] group-hover:scale-110 transition-transform"
                  style={{ background: `${c.accent}10` }}>
                  {c.icon}
                </div>
                <h3 className="font-heading font-bold text-sm text-white/90 mb-1">{c.label}</h3>
                <p className="text-[13px]" style={{ color: c.accent }}>{c.value}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
