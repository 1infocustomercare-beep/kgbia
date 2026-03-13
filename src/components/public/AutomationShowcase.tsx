import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { PremiumCarousel } from "./PremiumCarousel";
import { 
  Brain, Zap, TrendingUp, Shield, Clock, Smartphone,
  Bot, Sparkles, ArrowRight, CheckCircle, Rocket,
  BarChart3, Cpu, Globe, Workflow, Fingerprint,
  Bell, Wallet, Users, LineChart, Mail, MessageCircle
} from "lucide-react";

interface AutomationShowcaseProps {
  accentColor: string;
  accentBg: string;
  sectorName: string;
  darkMode?: boolean;
}

const SECTOR_AUTOMATIONS: Record<string, string[]> = {
  "Ristorazione": [
    "Ordini da QR code direttamente al tavolo",
    "Notifiche cucina in tempo reale",
    "Fatturazione elettronica automatica",
    "Upselling intelligente basato su IA",
    "Gestione prenotazioni 24/7",
    "Programma fedeltà digitale",
    "Review Shield™ — reputazione protetta",
    "Menu multilingua con traduzione IA",
    "Analisi profitto per piatto",
    "Marketing automatico ai clienti persi",
  ],
  default: [
    "Gestione prenotazioni e ordini automatica",
    "Notifiche push e reminder clienti",
    "Fatturazione elettronica integrata",
    "CRM con storico e preferenze cliente",
    "Programma fedeltà digitale",
    "Review Shield™ — reputazione protetta",
    "Analytics e report in tempo reale",
    "Marketing automation multicanale",
    "Preventivi e pagamenti digitali",
    "Assistente IA per decisioni strategiche",
  ],
};

const BENEFITS = [
  { icon: <Brain className="w-5 h-5" />, title: "IA Integrata", desc: "Automatizza cataloghi, prezzi, comunicazioni e analisi con intelligenza artificiale avanzata", stat: "24/7" },
  { icon: <Clock className="w-5 h-5" />, title: "−80% Tempo Gestione", desc: "Elimina ore di lavoro manuale con automazioni intelligenti che lavorano per te", stat: "-80%" },
  { icon: <TrendingUp className="w-5 h-5" />, title: "+45% Fatturato", desc: "Analytics predittivi, upselling automatico e campagne mirate aumentano i tuoi ricavi", stat: "+45%" },
  { icon: <Shield className="w-5 h-5" />, title: "Sicurezza Enterprise", desc: "Crittografia AES-256, GDPR compliant, backup automatici e proprietà totale dei dati", stat: "256bit" },
  { icon: <Smartphone className="w-5 h-5" />, title: "App White Label", desc: "La TUA app professionale con il tuo brand, i tuoi colori, zero marchi di terzi", stat: "100%" },
  { icon: <Bot className="w-5 h-5" />, title: "Aggiornamenti Continui", desc: "Nuove funzionalità ogni settimana. Il tuo sistema non invecchia mai", stat: "∞" },
];

const PROCESS_STEPS = [
  { icon: <Rocket className="w-5 h-5" />, title: "Attivazione Immediata", desc: "In meno di 24 ore il tuo sistema è operativo e personalizzato" },
  { icon: <Cpu className="w-5 h-5" />, title: "IA Apprende il Tuo Business", desc: "L'intelligenza artificiale studia i tuoi dati e ottimizza ogni processo" },
  { icon: <Workflow className="w-5 h-5" />, title: "Automazione Totale", desc: "Ogni task ripetitivo viene automatizzato: ordini, fatture, comunicazioni" },
  { icon: <LineChart className="w-5 h-5" />, title: "Crescita Continua", desc: "Report e suggerimenti IA per scalare il business senza limiti" },
];

function AnimatedCounter({ value, suffix = "", accentColor }: { value: number; suffix?: string; accentColor: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView || value <= 0) return;
    let start = 0;
    const step = (ts: number) => { if (!start) start = ts; const p = Math.min((ts - start) / 2000, 1); setCount(Math.floor((1 - Math.pow(1 - p, 3)) * value)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [isInView, value]);
  return <span ref={ref} style={{ color: accentColor }}>{count}{suffix}</span>;
}

export function AutomationShowcase({ accentColor, accentBg, sectorName, darkMode = true }: AutomationShowcaseProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  
  const bg = darkMode ? "#0a0a0a" : "#fafafa";
  const text = darkMode ? "#ffffff" : "#1a1a1a";
  const textMuted = darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const borderColor = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  const automations = SECTOR_AUTOMATIONS[sectorName] || SECTOR_AUTOMATIONS.default;

  return (
    <section ref={ref} style={{ background: bg, color: text }} className="relative py-20 sm:py-28 px-5 sm:px-6 overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)` }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[60px] blur-[60px]" style={{ background: `${accentColor}15` }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}30, transparent)` }} />
      
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div key={i} className="absolute w-1 h-1 rounded-full"
          style={{ background: `${accentColor}30`, left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }} />
      ))}
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <motion.div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6"
            style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}25` }}
            animate={isInView ? { boxShadow: [`0 0 0 0 ${accentColor}00`, `0 0 20px 4px ${accentColor}15`, `0 0 0 0 ${accentColor}00`] } : {}}
            transition={{ duration: 3, repeat: Infinity }}>
            <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
            <span className="text-[0.7rem] font-bold tracking-[2.5px] uppercase" style={{ color: accentColor }}>Tecnologia Empire.AI</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.08] mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Automatizziamo <span style={{ color: accentColor }}>Qualsiasi Processo</span>
          </h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: textMuted }}>
            La piattaforma IA più avanzata per <strong style={{ color: text }}>{sectorName}</strong>. 
            Risparmi tempo, aumenti i ricavi, resti sempre un passo avanti alla concorrenza.
          </p>
        </motion.div>

        {/* Big Stats Row */}
        <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.7 }}>
          {[
            { value: 80, suffix: "%", label: "Tempo Risparmiato" },
            { value: 45, suffix: "%", label: "Più Fatturato" },
            { value: 24, suffix: "h", label: "Attivazione" },
            { value: 500, suffix: "+", label: "Aziende Attive" },
          ].map((s, i) => (
            <motion.div key={i} className="text-center p-5 rounded-2xl relative overflow-hidden group"
              style={{ background: cardBg, border: `1px solid ${borderColor}` }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at center, ${accentColor}08, transparent 70%)` }} />
              <p className="text-3xl sm:text-4xl font-bold relative z-10" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <AnimatedCounter value={s.value} suffix={s.suffix} accentColor={accentColor} />
              </p>
              <p className="text-[0.6rem] tracking-[2px] uppercase mt-2 relative z-10" style={{ color: textMuted }}>{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits Carousel */}
        <div className="mb-16">
          <motion.h3 className="text-center text-lg sm:text-xl font-bold mb-8"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}>
            Perché le Aziende Scelgono <span style={{ color: accentColor }}>Empire</span>
          </motion.h3>
          <PremiumCarousel speed="slow" itemWidth={280} accentColor={accentColor} fullWidth>
            {BENEFITS.map((b, i) => (
              <div key={i} className="group p-6 rounded-2xl transition-all duration-500 hover:-translate-y-1 h-full"
                style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${accentColor}15`, color: accentColor }}>
                    {b.icon}
                  </div>
                  <span className="text-xl font-bold" style={{ color: `${accentColor}60`, fontFamily: "'Space Grotesk', sans-serif" }}>{b.stat}</span>
                </div>
                <h4 className="font-bold text-sm mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{b.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: textMuted }}>{b.desc}</p>
              </div>
            ))}
          </PremiumCarousel>
        </div>

        {/* Process Steps */}
        <motion.div className="mb-16"
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4, duration: 0.7 }}>
          <h3 className="text-center text-lg sm:text-xl font-bold mb-10" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Come Funziona: <span style={{ color: accentColor }}>4 Passi</span>
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div key={i} className="relative p-5 rounded-2xl text-center"
                style={{ background: cardBg, border: `1px solid ${borderColor}` }}
                initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.12, duration: 0.6 }}>
                {/* Step number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: accentColor, color: darkMode ? "#000" : "#fff" }}>
                  {i + 1}
                </div>
                {/* Connector line */}
                {i < 3 && <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-[1px]" style={{ background: `${accentColor}30` }} />}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 mt-2"
                  style={{ background: `${accentColor}12`, color: accentColor }}>
                  {step.icon}
                </div>
                <h4 className="font-bold text-xs mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{step.title}</h4>
                <p className="text-[0.6rem] leading-relaxed" style={{ color: textMuted }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Automations checklist */}
        <motion.div className="rounded-2xl p-8 sm:p-10 relative overflow-hidden"
          style={{ background: cardBg, border: `1px solid ${borderColor}` }}
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.7 }}>
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} />
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px]" style={{ background: `${accentColor}08` }} />
          
          <h3 className="text-center font-bold text-lg sm:text-xl mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Tutto Incluso per <span style={{ color: accentColor }}>{sectorName}</span>
          </h3>
          <p className="text-center text-xs mb-8" style={{ color: textMuted }}>Zero costi extra, zero sorprese. Un unico sistema che fa tutto.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {automations.map((a, i) => (
              <motion.div key={i} className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-white/[0.02]"
                initial={{ opacity: 0, x: -10 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.7 + i * 0.04, duration: 0.4 }}>
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
                <span className="text-sm" style={{ color: textMuted }}>{a}</span>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-8 pt-6" style={{ borderTop: `1px solid ${borderColor}` }}>
            <p className="text-xs mb-4" style={{ color: textMuted }}>
              <strong style={{ color: text }}>Hai un'esigenza specifica?</strong> Il nostro team sviluppa qualsiasi automazione personalizzata per il tuo settore.
            </p>
            <motion.div className="inline-flex items-center gap-2 text-sm font-bold cursor-pointer group px-6 py-3 rounded-full"
              style={{ color: darkMode ? "#000" : "#fff", background: accentColor }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}>
              Richiedi una Demo Gratuita <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom stats */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <Wallet className="w-4 h-4" />, value: "€0", label: "Canone mensile" },
            { icon: <BarChart3 className="w-4 h-4" />, value: "2%", label: "Unica commissione" },
            { icon: <Globe className="w-4 h-4" />, value: "24h", label: "Attivazione" },
            { icon: <MessageCircle className="w-4 h-4" />, value: "7/7", label: "Supporto dedicato" },
          ].map((s, i) => (
            <motion.div key={i} className="text-center p-4 rounded-xl group cursor-default"
              style={{ background: cardBg, border: `1px solid ${borderColor}` }}
              initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.9 + i * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.03 }}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span style={{ color: `${accentColor}60` }}>{s.icon}</span>
                <p className="text-2xl sm:text-3xl font-bold" style={{ color: accentColor, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
              </div>
              <p className="text-[0.55rem] tracking-[2px] uppercase" style={{ color: textMuted }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
