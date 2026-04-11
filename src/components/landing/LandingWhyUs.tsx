import { motion } from "framer-motion";
import { Cpu, Workflow, Gauge, ServerCog, Database, Headphones, Shield, Check, CircleCheck, Minus } from "lucide-react";

const vpOnce = { once: true, margin: "-100px" as any } as const;

const REASONS = [
  { icon: <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Tecnologia Proprietaria", desc: "Stack tecnologico sviluppato internamente. Non rivendiamo software altrui." },
  { icon: <Workflow className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Automazione Totale", desc: "Ogni processo ripetitivo viene eliminato. Dal contatto alla fatturazione." },
  { icon: <Gauge className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Performance Garantite", desc: "99.9% uptime, <200ms latenza, scaling automatico." },
  { icon: <ServerCog className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Aggiornamenti Continui", desc: "Nuove funzionalità ogni settimana. Mai obsoleto." },
  { icon: <Database className="w-4 h-4 sm:w-5 sm:h-5" />, title: "I Tuoi Dati, Per Sempre", desc: "Proprietà totale dei dati. Esporta tutto. Zero lock-in." },
  { icon: <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Supporto Dedicato", desc: "Team italiano 7/7. Persone vere che risolvono." },
];

const COMPARISONS = [
  { label: "App White Label", empire: "✓ Inclusa", others: "€5.000+", icon: "📱" },
  { label: "Agenti IA", empire: "98+ inclusi", others: "Non disponibili", icon: "🤖" },
  { label: "Commissioni", empire: "0-2%", others: "15-30%", icon: "💸" },
  { label: "Setup", empire: "24 ore", others: "2-6 mesi", icon: "⚡" },
  { label: "Aggiornamenti", empire: "Settimanali", others: "Annuali", icon: "🔄" },
  { label: "Proprietà dati", empire: "100% tua", others: "Lock-in", icon: "🔒" },
  { label: "Multi-settore", empire: "25+ settori", others: "1 solo", icon: "🌐" },
  { label: "Supporto", empire: "7/7 italiano", others: "Ticket email", icon: "🎧" },
];

export default function LandingWhyUs() {
  return (
    <section className="relative py-20 sm:py-28 px-5 overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(228 22% 8%), hsl(232 20% 9%), hsl(228 22% 8%))" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, hsla(38,60%,50%,0.5), transparent 65%)", filter: "blur(140px)" }} />
      </div>

      <div className="max-w-[1100px] mx-auto relative z-10">
        <div className="text-center mb-14">
          <motion.div className="inline-flex items-center gap-2.5 mb-5 px-5 py-2.5 rounded-2xl" style={{ background: "hsla(var(--primary) / 0.1)", border: "1px solid hsla(var(--primary) / 0.15)" }} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--empire-violet)))" }}>
              <Shield className="w-3 h-3 text-white" />
            </div>
            <span className="text-[0.65rem] font-heading font-bold tracking-[2.5px] uppercase text-white/90">Perché Empire</span>
          </motion.div>
          <motion.h2 className="text-[clamp(1.6rem,4.5vw,3rem)] font-heading font-bold text-white leading-[1.08] mb-4" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce}>
            Non un Semplice Software. <span className="text-shimmer">Un Vantaggio Competitivo.</span>
          </motion.h2>
        </div>

        {/* Reasons grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 mb-14">
          {REASONS.map((r, i) => (
            <motion.div key={r.title} className="p-4 sm:p-5 rounded-2xl" style={{ background: "linear-gradient(160deg, hsl(228 20% 14% / 0.9), hsl(232 22% 12% / 0.86))", border: "1px solid hsla(0,0%,100%,0.06)" }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce} transition={{ delay: i * 0.08 }}>
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">{r.icon}</div>
              <h4 className="text-xs sm:text-sm font-heading font-bold text-white mb-1">{r.title}</h4>
              <p className="text-[0.6rem] sm:text-xs text-foreground/35 leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Comparison table */}
        <motion.div className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-white/[0.06]" style={{ background: "linear-gradient(160deg, hsl(228 20% 14% / 0.92), hsl(232 22% 12% / 0.88))" }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce}>
          <div className="grid grid-cols-3 text-center border-b border-white/[0.06]">
            <div className="p-4 text-[0.6rem] font-heading font-bold text-foreground/30 tracking-[2px] uppercase">Funzione</div>
            <div className="p-4 text-[0.6rem] font-heading font-bold text-primary tracking-[2px] uppercase">Empire.AI</div>
            <div className="p-4 text-[0.6rem] font-heading font-bold text-foreground/20 tracking-[2px] uppercase">Altri</div>
          </div>
          {COMPARISONS.map((row, i) => (
            <div key={i} className={`grid grid-cols-3 items-center py-2.5 sm:py-3 px-4 ${i > 0 ? "border-t border-white/[0.04]" : ""} ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
              <span className="text-[0.6rem] sm:text-xs text-foreground/40 font-medium flex items-center gap-1.5">
                <span className="text-xs">{row.icon}</span>{row.label}
              </span>
              <span className="text-center text-[0.6rem] sm:text-xs text-white font-bold flex items-center justify-center gap-1">
                <CircleCheck className="w-3 h-3 text-primary flex-shrink-0" /> {row.empire}
              </span>
              <span className="text-center text-[0.55rem] sm:text-xs text-foreground/20 line-through decoration-destructive/40">{row.others}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
