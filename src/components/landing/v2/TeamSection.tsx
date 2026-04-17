import { motion } from "framer-motion";
import teamKevin from "@/assets/team-kevin-ceo.jpg";
import teamAlessandra from "@/assets/team-alessandra-cto.jpg";
import teamGiulia from "@/assets/team-giulia-sales.jpg";
import teamMarco from "@/assets/team-marco-design.jpg";
import teamLuca from "@/assets/team-luca-ai.jpg";
import teamSofia from "@/assets/team-sofia-success.jpg";

const TEAM = [
  { name: "Kevin Berardini", role: "Founder & CEO", bio: "Visione, posizionamento e direzione strategica dell’ecosistema Empire.", photo: teamKevin, tone: "gold" },
  { name: "Alessandra Conti", role: "CTO & AI Architect", bio: "Architettura e progettazione dei sistemi AI proprietari.", photo: teamAlessandra, tone: "violet" },
  { name: "Marco Lombardi", role: "Head of Design", bio: "Direzione creativa, brand identity e UX premium per ogni verticale.", photo: teamMarco, tone: "blue" },
  { name: "Giulia Romano", role: "Sales Strategist", bio: "Funnel commerciali, pricing e percorsi di conversione ad alto valore.", photo: teamGiulia, tone: "gold" },
  { name: "Luca Ferrari", role: "AI Engineer", bio: "Sviluppo agenti, integrazioni e ottimizzazione continua dei modelli.", photo: teamLuca, tone: "violet" },
  { name: "Sofia Marini", role: "Customer Success", bio: "Onboarding, formazione e crescita continua dei clienti Empire.", photo: teamSofia, tone: "emerald" },
];

export default function TeamSection() {
  return (
    <section id="team" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28">
      <div className="landing-section-glow" data-tone="gold" />

      <div className="relative mx-auto max-w-[1320px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-12 max-w-[760px] text-center sm:mb-14"
          data-tone="gold"
        >
          <span className="landing-pill mb-4 px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.26em] sm:mb-5 sm:px-4 sm:py-2 sm:text-[10px]">Team ibrido</span>
          <h2 className="text-[clamp(1.85rem,5vw,3.6rem)] font-heading font-extrabold leading-[0.92] tracking-[-0.05em] text-foreground">
            Strategia umana. <span className="landing-heading-gradient">Potenza AI.</span>
          </h2>
          <p className="mt-4 text-[clamp(0.92rem,1.6vw,1.05rem)] leading-[1.7] text-foreground/68 sm:mt-5">
            Un team compatto e ad alto livello: leadership, engineering, design e success integrati nello stesso sistema.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-5">
          {TEAM.map((member, index) => (
            <motion.article
              key={member.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.06, duration: 0.65 }}
              whileHover={{ y: -6 }}
              className="landing-surface group rounded-[24px] p-3 sm:rounded-[28px] sm:p-4 lg:p-5"
              data-tone={member.tone}
            >
              <div className="relative overflow-hidden rounded-[18px] border border-border/80 sm:rounded-[22px]">
                <img
                  src={member.photo}
                  alt={`${member.name} — ${member.role}`}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,hsl(var(--deep-black)/0.85))]" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3">
                  <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-foreground/70 sm:text-[9px]">{member.role}</div>
                  <div className="mt-0.5 font-heading text-sm font-extrabold leading-tight tracking-[-0.02em] text-foreground sm:text-base lg:text-lg">{member.name}</div>
                </div>
              </div>
              <p className="mt-3 px-1 text-[11px] leading-[1.6] text-foreground/65 sm:text-[12px] lg:text-[13px]">{member.bio}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
