import { motion } from "framer-motion";
import LandingPremiumPanel from "@/components/landing/LandingPremiumPanel";

const TEAM = [
  { name: "Team Empire", role: "Fondatori & Sviluppatori", panelEyebrow: "Leadership", panelCode: "HQ-01", panelTone: "teal" as const },
  { name: "Arianna", role: "AI Sales Assistant", panelEyebrow: "Voice AI", panelCode: "HQ-02", panelTone: "violet" as const },
  { name: "Dev Team", role: "Full-Stack & AI Engineers", panelEyebrow: "Engineering", panelCode: "HQ-03", panelTone: "slate" as const },
  { name: "Design Team", role: "UX/UI & Brand Design", panelEyebrow: "Creative", panelCode: "HQ-04", panelTone: "gold" as const },
];

const CONTACTS = [
  { label: "Email", value: "info@empire-ai.it", href: "mailto:info@empire-ai.it", panelEyebrow: "Direct Line", panelCode: "CT-01", panelTone: "teal" as const },
  { label: "WhatsApp", value: "Scrivici su WhatsApp", href: "https://wa.me/393000000000", panelEyebrow: "Instant Contact", panelCode: "CT-02", panelTone: "violet" as const },
  { label: "Sede", value: "Italia — Operativi 7/7", href: "#", panelEyebrow: "Operations", panelCode: "CT-03", panelTone: "gold" as const },
];

export default function LandingTeamContact() {
  return (
    <>
      <section className="py-16 lg:py-24 border-t border-white/[0.07]" style={{ background: "#080810" }}>
        <div className="max-w-[1320px] mx-auto px-5">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-5">
              <span className="w-5 h-[1.5px] bg-[#7eb7be]" />IL TEAM
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold text-white">
              Chi <span className="bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">Siamo</span>
            </h2>
            <p className="text-white/55 max-w-[620px] mx-auto text-[15px] leading-[1.7] mt-2">
              Un team di innovatori italiani che unisce tecnologia, design e intelligenza artificiale per trasformare ogni business.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1100px] mx-auto">
            {TEAM.map((t, i) => (
              <motion.div
                key={t.name}
                className="text-center py-8 px-4 rounded-3xl border border-white/[0.07] hover:-translate-y-1.5 transition-all"
                style={{ background: "#0d0d1a" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <LandingPremiumPanel eyebrow={t.panelEyebrow} code={t.panelCode} title={t.name} tone={t.panelTone} />
                <h3 className="font-heading font-bold text-sm text-white mb-1">{t.name}</h3>
                <p className="text-[11px] text-white/55">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contatti" className="py-16 lg:py-24" style={{ background: "#020204" }}>
        <div className="max-w-[1320px] mx-auto px-5">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-5">
              <span className="w-5 h-[1.5px] bg-[#7eb7be]" />CONTATTI
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold text-white">
              Parliamo del Tuo <span className="bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">Progetto</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1000px] mx-auto">
            {CONTACTS.map((c, i) => (
              <motion.a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="text-center py-8 px-6 rounded-3xl border border-white/[0.07] hover:-translate-y-1 hover:border-[#7eb7be] transition-all block"
                style={{ background: "#0d0d1a" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <LandingPremiumPanel eyebrow={c.panelEyebrow} code={c.panelCode} title={c.label} tone={c.panelTone} />
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
