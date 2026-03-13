import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Bot, Brain, Zap, TrendingUp, Shield, Sparkles,
  ChefHat, Car, Scissors, Heart, Store, Dumbbell, Building,
  Clock, Target, Wallet, Users, BarChart3, Bell, Cpu,
  Workflow, ArrowRight, Crown, Rocket, Eye, Radio,
  MessageSquare, Layers, Fingerprint, Globe, Timer
} from "lucide-react";

/* ── Animated counter ── */
const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let s = 0;
    const step = (ts: number) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / 2000, 1);
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value]);
  return <span ref={ref}>{n}{suffix}</span>;
};

/* ── Neural pulse line ── */
const NeuralPulse = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"
    style={{ width: "100%", top: "50%" }}
    initial={{ scaleX: 0, opacity: 0 }}
    animate={{ scaleX: [0, 1, 0], opacity: [0, 0.6, 0] }}
    transition={{ duration: 3, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

/* ── Data ── */
const aiAgents = [
  {
    id: "ghost-manager",
    icon: <Bot className="w-6 h-6" />,
    name: "GhostManager™",
    role: "Direttore Operativo Autonomo",
    desc: "Il tuo manager virtuale che non dorme mai. Monitora ordini, ottimizza turni, rileva anomalie e prende decisioni operative in tempo reale — 24/7, 365 giorni l'anno.",
    capabilities: ["Gestione ordini autonoma", "Ottimizzazione turni staff", "Alert anomalie istantanei", "Decisioni predittive"],
    gradient: "from-violet-500 to-purple-600",
    glow: "hsl(265, 80%, 60%)",
    stat: { value: 24, suffix: "/7", label: "Operativo" }
  },
  {
    id: "concierge-ai",
    icon: <MessageSquare className="w-6 h-6" />,
    name: "Concierge AI",
    role: "Assistente Clienti Intelligente",
    desc: "Risponde ai clienti in tempo reale via chat, gestisce prenotazioni, suggerisce prodotti e risolve problemi — parlando in 12 lingue con empatia umana.",
    capabilities: ["Chat multilingue 24/7", "Prenotazioni automatiche", "Upselling intelligente", "Risoluzione problemi"],
    gradient: "from-sky-500 to-blue-600",
    glow: "hsl(210, 80%, 55%)",
    stat: { value: 12, suffix: "+", label: "Lingue" }
  },
  {
    id: "analytics-engine",
    icon: <BarChart3 className="w-6 h-6" />,
    name: "Predictive Engine",
    role: "Analista Predittivo",
    desc: "Analizza pattern di vendita, previsione domanda, trend stagionali e comportamento clienti. Ti dice PRIMA cosa succederà — tu agisci, non reagisci.",
    capabilities: ["Previsione domanda", "Analisi trend automatica", "Segmentazione clienti AI", "Report generati da IA"],
    gradient: "from-emerald-500 to-teal-600",
    glow: "hsl(160, 70%, 45%)",
    stat: { value: 45, suffix: "%", label: "↑ Revenue" }
  },
  {
    id: "auto-marketing",
    icon: <Rocket className="w-6 h-6" />,
    name: "AutoPilot Marketing",
    role: "Growth Hacker Autonomo",
    desc: "Lancia campagne email, WhatsApp e push notification basate su comportamenti reali. Recupera clienti persi, premia i fedeli, converte i nuovi — tutto in automatico.",
    capabilities: ["Campagne comportamentali", "Recupero clienti inattivi", "Push & WhatsApp auto", "A/B testing continuo"],
    gradient: "from-amber-400 to-orange-500",
    glow: "hsl(35, 90%, 55%)",
    stat: { value: 3, suffix: "×", label: "ROI Marketing" }
  },
];

const sectorCapabilities = [
  { icon: <ChefHat className="w-4 h-4" />, sector: "Ristorazione", features: "Menu IA · Cucina Live · QR Ordini · HACCP Auto", color: "from-orange-500 to-amber-400" },
  { icon: <Car className="w-4 h-4" />, sector: "NCC & Transfer", features: "Routing IA · Flotta Smart · Pricing Dinamico", color: "from-sky-500 to-blue-500" },
  { icon: <Scissors className="w-4 h-4" />, sector: "Beauty & Wellness", features: "Agenda IA · No-Show Prediction · Remind Auto", color: "from-pink-500 to-rose-400" },
  { icon: <Heart className="w-4 h-4" />, sector: "Healthcare", features: "Cartelle IA · Triage Smart · Fatturazione Auto", color: "from-emerald-500 to-teal-400" },
  { icon: <Store className="w-4 h-4" />, sector: "Retail", features: "Inventario Predittivo · POS Smart · Promozioni IA", color: "from-cyan-500 to-blue-400" },
  { icon: <Dumbbell className="w-4 h-4" />, sector: "Fitness", features: "Piani IA · Check-in Auto · Rinnovi Predittivi", color: "from-lime-500 to-green-400" },
  { icon: <Building className="w-4 h-4" />, sector: "Hospitality", features: "Revenue Mgmt IA · Concierge Bot · Review Auto", color: "from-amber-400 to-orange-400" },
  { icon: <Globe className="w-4 h-4" />, sector: "+18 Settori", features: "Ogni settore ha agenti IA dedicati e personalizzati", color: "from-primary to-accent" },
];

const impactStats = [
  { icon: <Timer className="w-5 h-5" />, value: 80, suffix: "%", label: "Tempo Risparmiato", desc: "sulle operazioni manuali" },
  { icon: <TrendingUp className="w-5 h-5" />, value: 45, suffix: "%", label: "Aumento Revenue", desc: "nei primi 90 giorni" },
  { icon: <Users className="w-5 h-5" />, value: 3, suffix: "×", label: "Clienti Fidelizzati", desc: "tasso di ritorno" },
  { icon: <Shield className="w-5 h-5" />, value: 99, suffix: ".9%", label: "Uptime Garantito", desc: "disponibilità continua" },
];

const autonomousProcesses = [
  { icon: <Eye className="w-4 h-4" />, title: "Monitoraggio Continuo", desc: "Ogni dato del tuo business viene analizzato in tempo reale. Vendite, performance, anomalie — nulla sfugge." },
  { icon: <Brain className="w-4 h-4" />, title: "Apprendimento Adattivo", desc: "L'IA impara dal TUO business. Più la usi, più diventa precisa nelle previsioni e nelle automazioni." },
  { icon: <Workflow className="w-4 h-4" />, title: "Automazione Zero-Touch", desc: "Fatturazione, reminder, reorder scorte, campagne marketing — tutto accade senza il tuo intervento." },
  { icon: <Fingerprint className="w-4 h-4" />, title: "Personalizzazione Totale", desc: "Ogni agente si adatta al tuo settore, ai tuoi prodotti, al tuo stile comunicativo e ai tuoi clienti." },
  { icon: <Radio className="w-4 h-4" />, title: "Comunicazione Omnicanale", desc: "Email, WhatsApp, push notification, SMS — i tuoi agenti comunicano sul canale preferito di ogni cliente." },
  { icon: <Layers className="w-4 h-4" />, title: "Evoluzione Perpetua", desc: "Nuovi agenti e capacità ogni settimana. Il tuo sistema non invecchia mai — migliora per sempre." },
];

export function AIAgentsShowcase() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 px-5 sm:px-6 overflow-hidden">
      {/* ── Ambient background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[800px] h-[800px] rounded-full blur-[300px] opacity-[0.06] bg-primary top-0 left-1/2 -translate-x-1/2" />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[200px] opacity-[0.04] bg-accent bottom-0 right-0" />
        {/* Neural grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.015]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="neural-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="0.8" fill="hsl(var(--primary))" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-grid)" />
        </svg>
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">

        {/* ══════ HEADER ══════ */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/[0.06] backdrop-blur-sm mb-6"
          >
            <Bot className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-[0.65rem] font-heading font-bold text-primary/80 tracking-[0.15em] uppercase">Agenti IA Autonomi</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-[clamp(1.8rem,5vw,3.6rem)] font-heading font-bold text-foreground leading-[1.05] mb-5"
          >
            Il Tuo Esercito di{" "}
            <span className="relative inline-block">
              <span className="text-shimmer">Agenti IA</span>
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>
            <br className="sm:hidden" />
            {" "}Lavora Per Te
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-foreground/45 max-w-[650px] mx-auto leading-[1.8] text-sm sm:text-base"
          >
            Mentre dormi, i tuoi agenti IA gestiscono clienti, ottimizzano operazioni, lanciano campagne
            e analizzano dati. <strong className="text-foreground/70">Il tuo business non si ferma mai.</strong>
          </motion.p>
        </div>

        {/* ══════ AI AGENTS GRID ══════ */}
        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 mb-20 sm:mb-24">
          {aiAgents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 25 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative rounded-2xl border border-foreground/[0.06] bg-card/40 backdrop-blur-sm p-6 sm:p-7 overflow-hidden transition-all duration-500 hover:border-primary/20 hover:shadow-[0_0_40px_rgba(139,92,246,0.08)]">
                {/* Neural pulse */}
                <NeuralPulse delay={i * 0.8} />
                
                {/* Gradient corner */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${agent.gradient} opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-700 rounded-bl-full`} />

                {/* Agent header */}
                <div className="flex items-start gap-4 mb-5 relative z-10">
                  <div className="relative">
                    <div className={`absolute -inset-1 rounded-xl bg-gradient-to-br ${agent.gradient} opacity-30 blur-md group-hover:opacity-50 transition-opacity duration-500`} />
                    <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-white shadow-lg`}>
                      <div className="absolute inset-[1.5px] rounded-[10px] border border-white/20" />
                      {agent.icon}
                    </div>
                    {/* Status dot */}
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-card shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-foreground text-base sm:text-lg">{agent.name}</h3>
                    <p className="text-[0.65rem] font-heading text-primary/60 tracking-wider uppercase">{agent.role}</p>
                  </div>
                  {/* Stat badge */}
                  <div className="text-right">
                    <div className="text-lg font-heading font-bold text-foreground">
                      <Counter value={agent.stat.value} suffix={agent.stat.suffix} />
                    </div>
                    <p className="text-[0.6rem] text-foreground/30">{agent.stat.label}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-foreground/45 leading-[1.7] mb-5 relative z-10">{agent.desc}</p>

                {/* Capabilities */}
                <div className="grid grid-cols-2 gap-2 relative z-10">
                  {agent.capabilities.map((cap, ci) => (
                    <motion.div
                      key={ci}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + ci * 0.05 }}
                      className="flex items-center gap-1.5"
                    >
                      <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${agent.gradient}`} />
                      <span className="text-[0.65rem] text-foreground/50">{cap}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ══════ SECTOR CAPABILITIES MATRIX ══════ */}
        <div className="mb-20 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h3 className="text-[clamp(1.3rem,3.5vw,2.2rem)] font-heading font-bold text-foreground leading-[1.1] mb-3">
              IA Dedicata Per <span className="text-shimmer">Ogni Settore</span>
            </h3>
            <p className="text-foreground/40 text-sm max-w-[500px] mx-auto">
              Ogni settore ha agenti specializzati che parlano la lingua del tuo business
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {sectorCapabilities.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 25 }}
                className="group relative rounded-xl border border-foreground/[0.06] bg-card/30 backdrop-blur-sm p-4 overflow-hidden hover:border-primary/15 transition-all duration-400"
              >
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${s.color} opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-3 shadow-md`}>
                  {s.icon}
                </div>
                <h4 className="font-heading font-bold text-xs text-foreground mb-1">{s.sector}</h4>
                <p className="text-[0.6rem] text-foreground/35 leading-[1.5]">{s.features}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ══════ AUTONOMOUS PROCESSES ══════ */}
        <div className="mb-20 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/[0.06] mb-4">
              <Cpu className="w-3 h-3 text-accent animate-spin" style={{ animationDuration: "8s" }} />
              <span className="text-[0.6rem] font-heading font-bold text-accent/70 tracking-[0.15em] uppercase">Processi Autonomi</span>
            </div>
            <h3 className="text-[clamp(1.3rem,3.5vw,2.2rem)] font-heading font-bold text-foreground leading-[1.1] mb-3">
              L'IA che Lavora<br className="sm:hidden" /> <span className="text-shimmer">Mentre Tu Cresci</span>
            </h3>
            <p className="text-foreground/40 text-sm max-w-[550px] mx-auto leading-[1.7]">
              Non è un semplice software. È un ecosistema intelligente che si evolve, impara e agisce — rendendo la tua attività inarrestabile.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {autonomousProcesses.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 25 }}
                className="group relative rounded-xl border border-foreground/[0.05] bg-card/25 backdrop-blur-sm p-5 hover:border-primary/15 transition-all duration-500"
              >
                {/* Animated corner accent */}
                <motion.div
                  className="absolute top-0 right-0 w-12 h-12"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className="absolute top-0 right-0 w-[1px] h-6 bg-gradient-to-b from-primary/30 to-transparent" />
                  <div className="absolute top-0 right-0 h-[1px] w-6 bg-gradient-to-l from-primary/30 to-transparent" />
                </motion.div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 min-w-[36px] rounded-lg bg-primary/[0.08] border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors duration-400">
                    {p.icon}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-foreground mb-1">{p.title}</h4>
                    <p className="text-[0.7rem] text-foreground/40 leading-[1.6]">{p.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ══════ IMPACT STATS ══════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl border border-foreground/[0.06] bg-card/30 backdrop-blur-sm p-8 sm:p-10 overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-transparent to-accent/[0.03]" />
          <NeuralPulse delay={0} />
          <NeuralPulse delay={1.5} />

          <div className="relative z-10 text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-gold" />
              <span className="font-heading font-bold text-foreground text-lg sm:text-xl">L'Impatto Empire sui Tuoi Risultati</span>
            </div>
            <p className="text-foreground/35 text-xs sm:text-sm max-w-[450px] mx-auto">
              Numeri reali, misurabili. Non promesse — risultati garantiti per contratto.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {impactStats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 300, damping: 25 }}
                className="text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/[0.08] border border-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-1">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-xs font-heading font-semibold text-foreground/70 mb-0.5">{stat.label}</p>
                <p className="text-[0.6rem] text-foreground/30">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════ FOREVER ADVANTAGE ══════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 sm:mt-20"
        >
          <div className="relative inline-block">
            <motion.div
              className="absolute -inset-4 rounded-full bg-primary/10 blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <Sparkles className="w-8 h-8 text-primary relative z-10 mx-auto mb-4" />
          </div>
          <h3 className="text-[clamp(1.2rem,3vw,2rem)] font-heading font-bold text-foreground leading-[1.15] mb-3">
            Sempre Avanti. <span className="text-shimmer">Per Sempre.</span>
          </h3>
          <p className="text-foreground/40 text-sm max-w-[550px] mx-auto leading-[1.7] mb-6">
            Ogni settimana nuovi agenti, nuove automazioni, nuove integrazioni. Il tuo business
            non resta mai indietro — evolve costantemente, anni luce davanti alla concorrenza.
            <strong className="text-foreground/60"> Per tutta la vita.</strong>
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Aggiornamenti Settimanali", "Nuovi Agenti IA", "Zero Costi Extra", "Evoluzione Perpetua"].map((t, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/[0.04] text-[0.65rem] font-heading font-semibold text-primary/70"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                {t}
              </motion.span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
