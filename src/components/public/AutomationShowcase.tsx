import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Brain, Zap, TrendingUp, Shield, Clock, Smartphone,
  BarChart3, Bot, Sparkles, ArrowRight, CheckCircle
} from "lucide-react";

interface AutomationShowcaseProps {
  accentColor: string;
  accentBg: string;
  sectorName: string;
  darkMode?: boolean;
}

const BENEFITS = [
  { icon: <Brain className="w-5 h-5" />, title: "IA Integrata", desc: "Automatizza cataloghi, prezzi, comunicazioni e analisi con intelligenza artificiale avanzata" },
  { icon: <Clock className="w-5 h-5" />, title: "−80% Tempo Gestione", desc: "Elimina ore di lavoro manuale con automazioni intelligenti che lavorano per te 24/7" },
  { icon: <TrendingUp className="w-5 h-5" />, title: "+45% Fatturato", desc: "Analytics predittivi, upselling automatico e campagne mirate aumentano i tuoi ricavi" },
  { icon: <Shield className="w-5 h-5" />, title: "Sicurezza Enterprise", desc: "Crittografia AES-256, GDPR compliant, backup automatici e proprietà totale dei dati" },
  { icon: <Smartphone className="w-5 h-5" />, title: "App White Label", desc: "La TUA app professionale con il tuo brand, i tuoi colori, zero marchi di terzi" },
  { icon: <Bot className="w-5 h-5" />, title: "Aggiornamenti Continui", desc: "Nuove funzionalità ogni settimana. Il tuo sistema non invecchia mai, sempre all'avanguardia" },
];

const AUTOMATIONS = [
  "Gestione prenotazioni e ordini automatica",
  "Notifiche push e reminder clienti",
  "Fatturazione elettronica integrata",
  "CRM con storico e preferenze cliente",
  "Programma fedeltà digitale",
  "Review Shield™ — reputazione protetta",
  "Analytics e report in tempo reale",
  "Marketing automation multicanale",
];

export function AutomationShowcase({ accentColor, accentBg, sectorName, darkMode = true }: AutomationShowcaseProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  
  const bg = darkMode ? "#0a0a0a" : "#fafafa";
  const text = darkMode ? "#ffffff" : "#1a1a1a";
  const textMuted = darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const borderColor = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  return (
    <section ref={ref} style={{ background: bg, color: text }} className="relative py-20 sm:py-28 px-5 sm:px-6 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)` }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[40px] blur-[40px]" style={{ background: `${accentColor}20` }} />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
            style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}25` }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span className="text-[0.65rem] font-bold tracking-[2px] uppercase" style={{ color: accentColor }}>Tecnologia Empire.AI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Automatizziamo <span style={{ color: accentColor }}>Qualsiasi Processo</span>
          </h2>
          <p className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: textMuted }}>
            La piattaforma IA più avanzata per {sectorName}. Risparmi tempo, aumenti i ricavi, resti sempre un passo avanti alla concorrenza.
          </p>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {BENEFITS.map((b, i) => (
            <motion.div key={i} className="group p-6 rounded-2xl transition-all duration-500 hover:-translate-y-1"
              style={{ background: cardBg, border: `1px solid ${borderColor}` }}
              initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} 
              transition={{ delay: 0.1 + i * 0.08, duration: 0.6 }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                style={{ background: `${accentColor}15`, color: accentColor }}>
                {b.icon}
              </div>
              <h3 className="font-bold text-sm mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{b.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: textMuted }}>{b.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Automations ticker */}
        <motion.div className="rounded-2xl p-8 sm:p-10 relative overflow-hidden"
          style={{ background: cardBg, border: `1px solid ${borderColor}` }}
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.7 }}>
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} />
          <h3 className="text-center font-bold text-lg sm:text-xl mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Tutto Incluso, <span style={{ color: accentColor }}>Zero Costi Extra</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AUTOMATIONS.map((a, i) => (
              <motion.div key={i} className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.7 + i * 0.05, duration: 0.4 }}>
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
                <span className="text-sm" style={{ color: textMuted }}>{a}</span>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <motion.div className="inline-flex items-center gap-2 text-sm font-bold cursor-pointer group"
              style={{ color: accentColor }}
              whileHover={{ x: 5 }}>
              Scopri tutte le funzionalità <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </div>
        </motion.div>

        {/* Stats strip */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { value: "€0", label: "Canone mensile" },
            { value: "2%", label: "Unica commissione" },
            { value: "24h", label: "Attivazione" },
            { value: "7/7", label: "Supporto dedicato" },
          ].map((s, i) => (
            <motion.div key={i} className="text-center p-4 rounded-xl"
              style={{ background: cardBg, border: `1px solid ${borderColor}` }}
              initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.9 + i * 0.1, duration: 0.4 }}>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: accentColor, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
              <p className="text-[0.6rem] tracking-[2px] uppercase mt-1" style={{ color: textMuted }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
