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
  { name: "Notifiche Proattive", desc: "Reminder, upsell e recovery automatico prima che il cliente si raffreddi.", Icon: Bell, tone: "gold" },
  { name: "Fiscal Vault 2026", desc: "Compliance, processi fiscali e controllo documentale con struttura enterprise.", Icon: Shield, tone: "blue" },
  { name: "Customer 360", desc: "Profilo cliente unificato, storico, preferenze e lifetime value sempre disponibili.", Icon: User, tone: "violet" },
  { name: "Review Shield", desc: "Intercetta criticità, tutela la reputazione e alza la qualità percepita del brand.", Icon: Star, tone: "gold" },
  { name: "Empire Voice Agent", desc: "Risponde, qualifica e converte al telefono 24/7 con tono professionale e coerente.", Icon: Mic, tone: "emerald" },
  { name: "Empire Command Agent", desc: "Trasforma comandi vocali o testuali in azioni operative immediate.", Icon: Zap, tone: "blue" },
  { name: "Brain Analytics", desc: "Prevede trend, opportunità e colli di bottiglia prima che impattino sul fatturato.", Icon: Brain, tone: "violet" },
];

export default function AgentsBento() {
  return (
    <section id="agenti" className="landing-section relative overflow-visible px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16" data-theme="light">
      <div className="landing-section-glow" data-tone="violet" />

      <div className="relative mx-auto max-w-[1320px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-8 max-w-[760px] text-center"
          data-tone="violet"
        >
          <span className="landing-pill mb-4 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em]">98 agenti AI proprietari</span>
          <h2 className="text-[clamp(1.8rem,4.8vw,3.4rem)] font-heading font-extrabold leading-[0.94] tracking-[-0.05em] text-foreground">
            Un’infrastruttura operativa che <span className="landing-heading-gradient">sembra un team senior.</span>
          </h2>
          <p className="mt-4 text-[clamp(0.94rem,1.55vw,1rem)] leading-[1.68] text-foreground/80">
            Ogni card mostra una funzione reale del sistema con profondità visiva, leggibilità alta e un taglio più premium.
          </p>
        </motion.div>

        <div className="grid auto-rows-fr gap-3 md:grid-cols-3 lg:gap-4">
          {AGENTS.map((agent, index) => (
            <motion.article
              key={agent.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.05, duration: 0.65 }}
              whileHover={{ y: -4 }}
              className={`landing-surface rounded-[26px] p-5 sm:p-6 lg:p-7 ${agent.big ? "md:col-span-2" : ""}`}
              data-tone={agent.tone}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="landing-icon-frame h-14 w-14">
                  <agent.Icon className="h-6 w-6" strokeWidth={2} />
                </div>
                {agent.tag ? <span className="landing-pill px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em]">{agent.tag}</span> : null}
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_150px] lg:items-end">
                <div>
                  <h3 className={`font-heading font-extrabold leading-[1] tracking-[-0.04em] text-foreground ${agent.big ? "text-2xl lg:text-[2rem]" : "text-lg lg:text-xl"}`}>
                    {agent.name}
                  </h3>
                  <p className="mt-3 max-w-[36ch] text-[14px] leading-[1.68] text-foreground/82">{agent.desc}</p>
                </div>

                <div className="rounded-[20px] border border-border bg-card p-4 shadow-[0_8px_24px_-12px_hsl(228_28%_14%/0.12),inset_0_1px_0_hsl(0_0%_100%)]">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60">Effetto</div>
                  <div className="mt-2 text-sm font-semibold text-foreground">Operatività continua</div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-foreground/12">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--empire-violet)),hsl(var(--gold)))]"
                      style={{ width: `${agent.big ? 92 : 78}%` }}
                    />
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
