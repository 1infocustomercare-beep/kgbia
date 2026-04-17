import { motion } from "framer-motion";

const TEAM = [
  {
    name: "Kevin Berardini",
    role: "Founder & CEO",
    bio: "Visione, posizionamento e direzione strategica dell’intero ecosistema Empire.",
    initials: "KB",
    tone: "gold",
  },
  {
    name: "Marco Telese",
    role: "CTO & AI Architect",
    bio: "Architettura, integrazioni e progettazione dei sistemi AI che rendono l’ecosistema realmente operativo.",
    initials: "MT",
    tone: "violet",
  },
  {
    name: "Arianna AI",
    role: "Senior Sales Strategist",
    bio: "Voice intelligence proprietaria per demo, qualificazione e conversione commerciale continua.",
    initials: "AI",
    tone: "blue",
  },
];

export default function TeamSection() {
  return (
    <section id="team" className="relative overflow-hidden px-4 py-28 sm:px-6 lg:px-10">
      <div className="landing-section-glow" data-tone="gold" />

      <div className="relative mx-auto max-w-[1240px]">
        <div className="mx-auto mb-16 max-w-[740px] text-center" data-tone="gold">
          <span className="landing-pill mb-5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em]">Team ibrido</span>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-heading font-extrabold leading-[0.92] tracking-[-0.05em] text-foreground">
            Strategia umana. <span className="landing-heading-gradient">Potenza AI.</span>
          </h2>
          <p className="mt-5 text-[clamp(0.98rem,1.7vw,1.08rem)] leading-[1.74] text-foreground/68">
            Un team compatto, credibile e ad alto livello: leadership, engineering e sales intelligence integrati nello stesso sistema.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {TEAM.map((member, index) => (
            <motion.article
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.65 }}
              className="landing-surface rounded-[30px] p-7 text-center"
              data-tone={member.tone}
            >
              <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full border border-border/80 bg-[linear-gradient(135deg,hsl(var(--primary)/0.24),hsl(var(--empire-violet)/0.14),hsl(var(--gold)/0.18))] font-heading text-2xl font-extrabold text-foreground shadow-[0_24px_60px_-30px_hsl(var(--primary)/0.8)]">
                {member.initials}
              </div>
              <h3 className="font-heading text-xl font-extrabold tracking-[-0.04em] text-foreground">{member.name}</h3>
              <div className="mt-2 text-[11px] uppercase tracking-[0.24em] text-foreground/50">{member.role}</div>
              <p className="mt-4 text-sm leading-[1.72] text-foreground/64">{member.bio}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
