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
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Premium background */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, #080818 0%, #0c0c26 40%, #0a0a1e 100%)",
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(ellipse 50% 40% at 30% 50%, rgba(126,183,190,0.04) 0%, transparent 50%), radial-gradient(ellipse 40% 40% at 70% 50%, rgba(108,60,224,0.03) 0%, transparent 50%)",
        }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="relative z-[1] max-w-[1320px] mx-auto px-5">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-bold mb-5">
              <span className="w-6 h-[2px] bg-gradient-to-r from-[#7eb7be] to-transparent" />IL TEAM
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold text-white">
              Chi <span className="bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">Siamo</span>
            </h2>
            <p className="text-white/55 max-w-[620px] mx-auto text-[15px] leading-[1.7] mt-3">
              Un team di innovatori italiani che unisce tecnologia, design e intelligenza artificiale per trasformare ogni business.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1100px] mx-auto">
            {TEAM.map((t, i) => (
              <motion.div
                key={t.name}
                className="text-center py-8 px-5 rounded-3xl border border-white/[0.08] hover:-translate-y-2 hover:border-white/[0.14] transition-all"
                style={{ background: "linear-gradient(180deg, rgba(15,15,32,0.9), rgba(10,10,22,0.95))" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <LandingPremiumPanel eyebrow={t.panelEyebrow} code={t.panelCode} title={t.name} tone={t.panelTone} />
                <h3 className="font-heading font-bold text-sm text-white/90 mb-1">{t.name}</h3>
                <p className="text-[12px] text-white/55">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contatti" className="relative py-20 lg:py-28 overflow-hidden">
        {/* Premium background */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, #060614 0%, #0a0a1e 50%, #060610 100%)",
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(126,183,190,0.04) 0%, transparent 60%)",
        }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7eb7be]/10 to-transparent" />

        <div className="relative z-[1] max-w-[1320px] mx-auto px-5">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-bold mb-5">
              <span className="w-6 h-[2px] bg-gradient-to-r from-[#7eb7be] to-transparent" />CONTATTI
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
                className="text-center py-8 px-6 rounded-3xl border border-white/[0.08] hover:-translate-y-1 hover:border-[#7eb7be]/30 transition-all block"
                style={{ background: "linear-gradient(180deg, rgba(15,15,32,0.9), rgba(10,10,22,0.95))" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <LandingPremiumPanel eyebrow={c.panelEyebrow} code={c.panelCode} title={c.label} tone={c.panelTone} />
                <h3 className="font-heading font-bold text-sm text-white/90 mb-1">{c.label}</h3>
                <p className="text-[13px] text-[#7eb7be]">{c.value}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
