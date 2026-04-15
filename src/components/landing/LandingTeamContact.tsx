import { motion } from "framer-motion";
import { useState } from "react";

/* ── Team Members ── */
const TEAM = [
  {
    name: "Kevin Berardini",
    role: "Co-Founder & CEO",
    bio: "Visione strategica e leadership. Guida Empire AI Group verso la trasformazione digitale delle PMI italiane.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    accent: "#7eb7be",
    linkedin: "#",
  },
  {
    name: "Team Sviluppo",
    role: "Full-Stack & AI Engineers",
    bio: "6 ingegneri specializzati in React, Node.js, Python e modelli di Intelligenza Artificiale generativa.",
    avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop&crop=face",
    accent: "#a78bfa",
    linkedin: "#",
  },
  {
    name: "Team Design",
    role: "UX/UI & Brand Design",
    bio: "Design system premium, interfacce che convertono e brand identity riconoscibile per ogni settore.",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face",
    accent: "#ec4899",
    linkedin: "#",
  },
  {
    name: "Arianna",
    role: "AI Sales & Support Agent",
    bio: "Il nostro agente IA gestisce lead, risponde ai clienti 24/7 e chiude vendite in autonomia.",
    avatar: "",
    accent: "#22d3ee",
    isAI: true,
    linkedin: "#",
  },
];

const STATS = [
  { value: "847+", label: "Clienti Attivi", accent: "#7eb7be" },
  { value: "25+", label: "Settori Serviti", accent: "#a78bfa" },
  { value: "98%", label: "Retention Rate", accent: "#4ade80" },
  { value: "24/7", label: "Supporto AI", accent: "#f59e0b" },
];

const CONTACTS = [
  { label: "Email", value: "info@empireaigroup.com", href: "mailto:info@empireaigroup.com", icon: "✉️", accent: "#7eb7be" },
  { label: "WhatsApp", value: "Scrivici su WhatsApp", href: "https://wa.me/393000000000", icon: "💬", accent: "#4ade80" },
  { label: "Sede", value: "Italia — Operativi 7/7", href: "#", icon: "📍", accent: "#f59e0b" },
];

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function LandingTeamContact() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  return (
    <>
      {/* ═══ ABOUT & TEAM ═══ */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Atmospheric BG */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, #020208 0%, #080c18 30%, #0a1020 50%, #020208 100%)",
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(ellipse 50% 40% at 25% 40%, rgba(126,183,190,0.04) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 75% 60%, rgba(167,139,250,0.04) 0%, transparent 60%)",
        }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7eb7be]/15 to-transparent" />

        <div className="relative z-[1] max-w-[1200px] mx-auto px-5">
          {/* Section header */}
          <div className="text-center mb-16">
            <motion.span
              className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-bold mb-5"
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            >
              <span className="w-8 h-[2px] bg-gradient-to-r from-[#7eb7be] to-transparent" />
              CHI SIAMO
              <span className="w-8 h-[2px] bg-gradient-to-l from-[#7eb7be] to-transparent" />
            </motion.span>

            <motion.h2
              className="text-[clamp(2rem,4.5vw,3.4rem)] font-heading font-bold text-white mb-4 leading-[1.1]"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              L'Agenzia AI che Sta <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#7eb7be] via-[#a78bfa] to-[#7d51eb] bg-clip-text text-transparent">Ridefinendo il Business Digitale</span>
            </motion.h2>

            <motion.p
              className="text-white/55 max-w-[640px] mx-auto text-[15px] leading-[1.75] mt-4"
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Empire AI Group è il partner tecnologico scelto da centinaia di imprese italiane.
              Progettiamo piattaforme su misura, integriamo agenti di Intelligenza Artificiale
              e automatizziamo ogni processo — dal primo contatto alla fidelizzazione.
            </motion.p>
          </div>

          {/* Company Stats bar */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16 max-w-[900px] mx-auto"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                className="text-center py-5 px-4 rounded-2xl border border-white/[0.06]"
                style={{ background: "linear-gradient(180deg, rgba(10,14,26,0.9), rgba(6,8,18,0.95))" }}
                variants={cardVariant}
                custom={i}
              >
                <div className="text-[clamp(1.6rem,3vw,2.2rem)] font-heading font-black leading-none mb-1" style={{ color: s.accent }}>
                  {s.value}
                </div>
                <div className="text-[11px] text-white/45 tracking-wider uppercase font-medium">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Team grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            {TEAM.map((t, i) => (
              <motion.div
                key={t.name}
                className="relative rounded-3xl border border-white/[0.06] overflow-hidden group cursor-default"
                style={{ background: "linear-gradient(180deg, rgba(10,14,26,0.92), rgba(4,6,14,0.96))" }}
                variants={cardVariant}
                custom={i}
                onMouseEnter={() => setHoveredMember(i)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                {/* Top accent glow */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${t.accent}, transparent)` }}
                />

                {/* Hover glow */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{
                    opacity: hoveredMember === i ? 0.08 : 0,
                  }}
                  style={{ background: `radial-gradient(circle at 50% 30%, ${t.accent}, transparent 70%)` }}
                />

                <div className="relative p-6 text-center">
                  {/* Avatar */}
                  <motion.div
                    className="w-20 h-20 rounded-2xl mx-auto mb-4 overflow-hidden border-2 group-hover:scale-105 transition-transform"
                    style={{ borderColor: `${t.accent}33` }}
                  >
                    {(t as any).isAI ? (
                      <div className="w-full h-full flex items-center justify-center text-3xl" style={{ background: `linear-gradient(135deg, ${t.accent}22, ${t.accent}44)` }}>
                        🤖
                      </div>
                    ) : (
                      <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                    )}
                  </motion.div>

                  <h3 className="font-heading font-bold text-white text-[15px] mb-0.5">{t.name}</h3>
                  <p className="text-[12px] font-semibold mb-3" style={{ color: t.accent }}>{t.role}</p>
                  <p className="text-[12px] text-white/45 leading-[1.6]">{t.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mission statement */}
          <motion.div
            className="mt-14 text-center max-w-[800px] mx-auto py-8 px-6 rounded-3xl border border-white/[0.06]"
            style={{ background: "linear-gradient(135deg, rgba(126,183,190,0.04), rgba(167,139,250,0.04))" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-white/70 text-[14px] leading-[1.8] italic">
              "La nostra missione è rendere l'Intelligenza Artificiale accessibile a ogni impresa,
              indipendentemente dalla dimensione. Non vendiamo software — costruiamo il futuro digitale
              del tuo business."
            </p>
            <p className="text-[12px] text-[#7eb7be] font-bold mt-3">— Empire AI Group</p>
          </motion.div>
        </div>
      </section>

      {/* ═══ CONTACTS ═══ */}
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
