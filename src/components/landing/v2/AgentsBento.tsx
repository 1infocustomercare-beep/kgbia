import { motion } from "framer-motion";
import { Bell, Brain, MessageSquare, Mic, Shield, Star, Target, User, Zap } from "lucide-react";

const AGENTS = [
  {
    name: "Empire WhatsApp Orchestrator",
    desc: "Coordina messaggi, menu, prenotazioni, follow-up e contenuti commerciali in tempo reale con logica conversazionale premium.",
    Icon: MessageSquare,
    tone: "emerald",
    big: true,
    tag: "Core system",
  },
  {
    name: "Apex Acquisition Engine",
    desc: "Lead scouting, qualificazione, nurturing e chiusura commerciale in una pipeline assistita da agenti verticali.",
    Icon: Target,
    tone: "violet",
    big: true,
    tag: "Revenue",
  },
  {
    name: "Notifiche Proattive",
    desc: "Reminder, upsell e recovery automatico prima che il cliente si raffreddi.",
    Icon: Bell,
    tone: "gold",
  },
  {
    name: "Fiscal Vault 2026",
    desc: "Compliance, processi fiscali e controllo documentale con struttura enterprise.",
    Icon: Shield,
    tone: "blue",
  },
  {
    name: "Customer 360",
    desc: "Profilo cliente unificato, storico, preferenze e lifetime value sempre disponibili.",
    Icon: User,
    tone: "violet",
  },
  {
    name: "Review Shield",
    desc: "Intercetta criticità, tutela la reputazione e alza la qualità percepita del brand.",
    Icon: Star,
    tone: "gold",
  },
  {
    name: "Empire Voice Agent",
    desc: "Risponde, qualifica e converte al telefono 24/7 con tono professionale e coerente.",
    Icon: Mic,
    tone: "emerald",
  },
  {
    name: "Empire Command Agent",
    desc: "Trasforma comandi vocali o testuali in azioni operative immediate.",
    Icon: Zap,
    tone: "blue",
  },
  {
    name: "Brain Analytics",
    desc: "Prevede trend, opportunità e colli di bottiglia prima che impattino sul fatturato.",
    Icon: Brain,
    tone: "violet",
  },
];

export default function AgentsBento() {
  return (
    <section id="agenti" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28">
      <div className="landing-section-glow" data-tone="violet" />

      <div className="relative mx-auto max-w-[1320px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-[760px] text-center"
          data-tone="violet"
        >
          <span className="landing-pill mb-5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em]">98 agenti AI proprietari</span>
          <h2 className="text-[clamp(2rem,5.2vw,4.2rem)] font-heading font-extrabold leading-[0.92] tracking-[-0.05em] text-foreground">
            Un’infrastruttura operativa che <span className="landing-heading-gradient">sembra un team senior.</span>
          </h2>
          <p className="mt-5 text-[clamp(0.98rem,1.7vw,1.08rem)] leading-[1.72] text-foreground/68">
            Ogni card mostra una funzione reale del sistema: niente effetti gratuiti, solo valore percepito alto, profondità visiva e architettura premium.
          </p>
        </motion.div>

        <div className="grid auto-rows-fr gap-4 md:grid-cols-3 lg:gap-5">
          {AGENTS.map((agent, index) => (
            <motion.article
              key={agent.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.05, duration: 0.65 }}
              whileHover={{ y: -10, rotateX: 3, rotateY: index % 2 === 0 ? 5 : -5, scale: 1.01 }}
              style={{ transformStyle: "preserve-3d", perspective: "1200px" }}
              className={`landing-surface rounded-[30px] p-6 lg:p-7 ${agent.big ? "md:col-span-2" : ""}`}
              data-tone={agent.tone}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="landing-icon-frame h-14 w-14">
                  <agent.Icon className="h-6 w-6" strokeWidth={2} />
                </div>
                {agent.tag ? (
                  <span className="landing-pill px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em]">{agent.tag}</span>
                ) : null}
              </div>

              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_150px] lg:items-end">
                <div>
                  <h3 className={`font-heading font-extrabold leading-[1] tracking-[-0.04em] text-foreground ${agent.big ? "text-2xl lg:text-[2rem]" : "text-lg lg:text-xl"}`}>
                    {agent.name}
                  </h3>
                  <p className="mt-3 max-w-[36ch] text-[14px] leading-[1.7] text-foreground/64">{agent.desc}</p>
                </div>

                <div className="rounded-[24px] border border-border/80 bg-background/42 p-4 backdrop-blur-xl">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-foreground/44">Effetto</div>
                  <div className="mt-2 text-sm font-semibold text-foreground">Operatività continua</div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-foreground/10">
                    <div className="h-full rounded-full bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--empire-violet)),hsl(var(--gold)))]" style={{ width: `${agent.big ? 92 : 78}%` }} />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
