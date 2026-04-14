import { motion } from "framer-motion";

const TEAM = [
  { icon: "🏛️", name: "Team Empire", role: "Fondatori & Strateghi", desc: "Imprenditori con 10+ anni di esperienza in tech, design e business digitale." },
  { icon: "🎙️", name: "Arianna", role: "AI Sales Assistant", desc: "Il primo agente vocale IA italiano che vende, prenota e assiste i tuoi clienti 24/7." },
  { icon: "💻", name: "Dev Team", role: "Full-Stack & AI Engineers", desc: "Ingegneri specializzati in React, IA generativa, automazioni e architetture scalabili." },
  { icon: "🎨", name: "Design Team", role: "UX/UI & Brand Design", desc: "Designer con un'ossessione per i dettagli e l'esperienza utente premium." },
];

const CONTACTS = [
  { icon: "✉️", label: "Email Diretta", value: "info@empireaigroup.com", href: "mailto:info@empireaigroup.com" },
  { icon: "💬", label: "WhatsApp Instant", value: "Risposta in meno di 2 ore", href: "https://wa.me/393000000000" },
  { icon: "📍", label: "Sede Operativa", value: "Italia — Operativi 7 giorni su 7", href: "#contatti" },
];

export default function LandingTeamContact() {
  return (
    <>
      {/* Team */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0a0c20 0%, #0e1028 40%, #0a0c20 100%)" }} />

        <div className="relative z-[1] max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-12">
            <span className="inline-block text-[11px] tracking-[3px] uppercase font-bold mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-white/60">
              Il Team Dietro Empire
            </span>
            <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-heading font-bold mb-4 text-white leading-tight">
              Persone Reali.<br />
              <span className="text-white/60">Tecnologia Straordinaria.</span>
            </h2>
            <p className="text-white/55 max-w-[600px] mx-auto text-[16px] leading-[1.8]">
              Un team di innovatori italiani che unisce tecnologia all'avanguardia, design di livello mondiale e intelligenza artificiale per trasformare ogni business.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map((t, i) => (
              <motion.div
                key={t.name}
                className="text-center py-8 px-6 rounded-2xl border border-white/[0.06] hover:-translate-y-1 transition-all"
                style={{ background: "linear-gradient(160deg, rgba(14,16,40,0.9), rgba(10,12,32,0.95))" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl mb-4">{t.icon}</div>
                <h3 className="font-heading font-bold text-[16px] text-white mb-1">{t.name}</h3>
                <p className="text-[12px] text-[#c9a84c] font-semibold mb-3">{t.role}</p>
                <p className="text-[13px] text-white/50 leading-[1.7]">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contatti" className="relative py-24 lg:py-28 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #080a1c 0%, #0c0e24 50%, #080a1c 100%)" }} />

        <div className="relative z-[1] max-w-[1000px] mx-auto px-5">
          <div className="text-center mb-12">
            <span className="inline-block text-[11px] tracking-[3px] uppercase font-bold mb-4 px-4 py-1.5 rounded-full border border-[#c9a84c]/20 bg-[#c9a84c]/5 text-[#c9a84c]">
              Contattaci
            </span>
            <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-heading font-bold mb-4 text-white leading-tight">
              Parliamo del Tuo Progetto.<br />
              <span className="text-[#c9a84c]">Senza Impegno.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CONTACTS.map((c, i) => (
              <motion.a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="text-center py-10 px-6 rounded-2xl border border-white/[0.06] hover:-translate-y-1 hover:border-[#c9a84c]/20 transition-all block"
                style={{ background: "linear-gradient(160deg, rgba(14,16,40,0.9), rgba(10,12,32,0.95))" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl mb-4">{c.icon}</div>
                <h3 className="font-heading font-bold text-[16px] text-white mb-2">{c.label}</h3>
                <p className="text-[14px] text-[#c9a84c]">{c.value}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
