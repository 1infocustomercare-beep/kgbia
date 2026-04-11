import { motion } from "framer-motion";
import { Sparkles, Smartphone, Brain, Workflow, BrainCircuit, Gauge, Fingerprint, BarChart3, QrCode, Bell, Bot, Globe, MonitorSmartphone } from "lucide-react";
import FunnelDNAVisual from "@/components/public/FunnelDNAVisual";
import { WordScrollReveal, ParallaxLayer } from "@/components/public/LusionScrollReveal";

const vpOnce = { once: true, margin: "-100px" as any } as const;

const PILLARS = [
  {
    icon: <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "App & Siti Web",
    desc: "App native PWA white-label, siti web responsivi, cataloghi digitali e menu QR. Tutto personalizzato con il tuo brand.",
    features: ["PWA Installabile", "Dominio Custom", "Menu / Catalogo QR", "Design Responsivo"],
    gradient: "from-primary to-blue-600",
    hue: "215",
  },
  {
    icon: <Brain className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "IA & Automazione",
    desc: "98+ agenti IA autonomi che gestiscono vendite, marketing, operazioni e customer service 24/7 senza intervento umano.",
    features: ["98+ Agenti IA", "Voice Agent", "Chatbot Multilingua", "Automazioni Smart"],
    gradient: "from-empire-violet to-purple-600",
    hue: "265",
  },
  {
    icon: <Workflow className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Gestionali Custom",
    desc: "Dashboard complete, CRM clienti, fatturazione, prenotazioni, inventario e analytics predittivi — tutto in un unico sistema.",
    features: ["Dashboard Analytics", "CRM Completo", "Fatturazione", "Multi-sede"],
    gradient: "from-accent to-emerald-600",
    hue: "168",
  },
];

const CAPABILITIES = [
  { icon: <BrainCircuit className="w-4 h-4" />, label: "Agenti IA Autonomi", desc: "98+ modelli specializzati", hue: "265" },
  { icon: <Gauge className="w-4 h-4" />, label: "Dashboard Predittive", desc: "Decisioni data-driven", hue: "150" },
  { icon: <Workflow className="w-4 h-4" />, label: "Automazioni 24/7", desc: "Zero intervento umano", hue: "38" },
  { icon: <Fingerprint className="w-4 h-4" />, label: "White-Label Custom", desc: "Il tuo brand, la nostra tech", hue: "210" },
];

const QUICK_FEATURES = [
  { icon: <MonitorSmartphone className="w-3.5 h-3.5" />, label: "Siti Web" },
  { icon: <QrCode className="w-3.5 h-3.5" />, label: "Menu QR" },
  { icon: <Bot className="w-3.5 h-3.5" />, label: "Voice IA" },
  { icon: <BarChart3 className="w-3.5 h-3.5" />, label: "Analytics" },
  { icon: <Bell className="w-3.5 h-3.5" />, label: "Notifiche" },
  { icon: <Globe className="w-3.5 h-3.5" />, label: "Multi-lingua" },
];

export default function LandingServices() {
  return (
    <section id="services" className="relative py-20 sm:py-28 px-5 overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(228 22% 8%) 0%, hsl(240 20% 10%) 50%, hsl(228 22% 8%) 100%)" }}>
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[8%] left-[20%] w-[550px] h-[550px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, hsla(265,65%,50%,0.55), transparent 65%)", filter: "blur(140px)" }} />
        <div className="absolute top-[30%] right-[12%] w-[480px] h-[480px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, hsla(38,60%,48%,0.45), transparent 65%)", filter: "blur(130px)" }} />
      </div>

      <div className="max-w-[1100px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div className="inline-flex items-center gap-2.5 mb-5 px-5 py-2.5 rounded-2xl" style={{ background: "hsla(var(--primary) / 0.1)", border: "1px solid hsla(var(--primary) / 0.15)" }} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--empire-violet)))" }}>
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-[0.65rem] font-heading font-bold tracking-[2.5px] uppercase text-white/90">Su Misura</span>
          </motion.div>
          <motion.h2 className="text-[clamp(1.8rem,5vw,3.2rem)] font-heading font-bold text-white leading-[1.05] mb-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce}>
            Costruiamo <span className="text-shimmer">Qualsiasi Cosa</span>
          </motion.h2>
          <motion.p className="text-foreground/55 max-w-[500px] mx-auto text-sm leading-[1.8]" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={vpOnce}>
            Nessun pacchetto standard. Analizziamo il tuo business, progettiamo la soluzione perfetta e la costruiamo su misura.
          </motion.p>
        </div>

        {/* 3 Pillars */}
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-14">
          {PILLARS.map((p, i) => (
            <motion.div key={p.title} className="relative rounded-2xl overflow-hidden p-6 sm:p-7 group" style={{ background: "linear-gradient(160deg, hsl(228 20% 14% / 0.92), hsl(232 22% 12% / 0.88))", border: `1px solid hsla(${p.hue},40%,50%,0.18)`, boxShadow: `0 2px 20px hsla(${p.hue},50%,40%,0.08)` }} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce} transition={{ delay: i * 0.1, duration: 0.65 }} whileHover={{ y: -6, borderColor: `hsla(${p.hue},50%,55%,0.35)` }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, hsla(${p.hue},60%,55%,0.3), transparent)` }} />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-white mb-4`} style={{ boxShadow: `0 4px 20px hsla(${p.hue},50%,50%,0.2)` }}>
                {p.icon}
              </div>
              <h3 className="text-base sm:text-lg font-heading font-bold text-white mb-2">{p.title}</h3>
              <p className="text-xs text-foreground/40 leading-relaxed mb-4">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.features.map((f) => (
                  <span key={f} className="px-2.5 py-1 rounded-full text-[0.55rem] font-medium" style={{ background: `hsla(${p.hue},40%,50%,0.1)`, color: `hsla(${p.hue},60%,65%,0.8)`, border: `1px solid hsla(${p.hue},40%,50%,0.12)` }}>{f}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick features grid */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {QUICK_FEATURES.map((f, i) => (
            <motion.div key={f.label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: "hsla(0,0%,100%,0.03)", border: "1px solid hsla(0,0%,100%,0.06)" }} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce} transition={{ delay: i * 0.05 }}>
              <span className="text-primary/60">{f.icon}</span>
              <span className="text-xs font-medium text-foreground/50">{f.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Word scroll reveal */}
        <ParallaxLayer speed={0.08} className="mb-14">
          <WordScrollReveal
            text="Empire non è un software. È il sistema nervoso digitale della tua attività. Ogni processo, ogni cliente, ogni decisione — potenziata dall'intelligenza artificiale."
            className="text-[clamp(1.2rem,3.5vw,2.2rem)] max-w-4xl mx-auto text-center"
            highlightWords={["sistema", "nervoso", "digitale", "intelligenza", "artificiale"]}
          />
        </ParallaxLayer>

        {/* Capabilities grid */}
        <ParallaxLayer speed={0.05}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-14">
            {CAPABILITIES.map((cap, i) => (
              <motion.div key={cap.label} className="relative rounded-2xl overflow-hidden p-4 sm:p-5" style={{ background: "linear-gradient(160deg, hsl(228 20% 14% / 0.9), hsl(232 22% 12% / 0.86))", border: `1px solid hsla(${cap.hue},40%,50%,0.18)` }} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }}>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `hsla(${cap.hue},50%,50%,0.12)`, color: `hsla(${cap.hue},65%,60%,1)` }}>{cap.icon}</div>
                <h4 className="text-[0.7rem] sm:text-sm font-heading font-bold text-foreground mb-0.5">{cap.label}</h4>
                <p className="text-[0.55rem] sm:text-xs text-foreground/35">{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </ParallaxLayer>

        {/* DNA Visual */}
        <motion.div className="relative max-w-3xl mx-auto rounded-2xl overflow-hidden" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={vpOnce}>
          <div className="absolute -inset-8 bg-primary/[0.05] rounded-[60px] blur-[80px] pointer-events-none" />
          <FunnelDNAVisual />
          <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: "linear-gradient(180deg, transparent 60%, hsla(0,0%,4%,0.94) 100%)" }} />
        </motion.div>
      </div>
    </section>
  );
}
