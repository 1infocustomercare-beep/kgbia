import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MessageSquare, Star, Bell, Brain, Mic, Camera, FileText, ShoppingCart, Languages, Calendar, Shield, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Agent = {
  name: string;
  role: string;
  desc: string;
  price: number;
  features: string[];
  Icon: typeof Phone;
  tone: "violet" | "gold" | "blue" | "emerald";
  popular?: boolean;
};

const AGENTS: Agent[] = [
  {
    name: "Voice Agent",
    role: "Risponde al telefono 24/7",
    desc: "Sostituisce centralino e segretaria. Qualifica, prenota, ricontatta. In 30+ lingue.",
    price: 79,
    features: ["Chiamate illimitate", "Voce naturale premium", "Multi-lingua", "CRM sync"],
    Icon: Phone,
    tone: "emerald",
    popular: true,
  },
  {
    name: "WhatsApp AI",
    role: "Vende su WhatsApp 24/7",
    desc: "Chat-commerce intelligente: catalogo, ordini, pagamenti, follow-up automatici.",
    price: 59,
    features: ["Risposte istantanee", "Catalogo dinamico", "Pagamenti integrati", "Broadcast smart"],
    Icon: MessageSquare,
    tone: "emerald",
  },
  {
    name: "Sales Closer",
    role: "Chiude lead caldi",
    desc: "Riconosce intent d'acquisto e porta il cliente al checkout. Conversione +180%.",
    price: 99,
    features: ["Lead scoring", "Sequenze automatiche", "Obiezioni gestite", "Analytics live"],
    Icon: ShoppingCart,
    tone: "gold",
    popular: true,
  },
  {
    name: "Review Shield",
    role: "Protegge la reputazione",
    desc: "Intercetta criticità prima che diventino recensioni negative. +1.2★ in 90 giorni.",
    price: 49,
    features: ["Sentiment analysis", "Risposte AI", "Multi-piattaforma", "Alert in real-time"],
    Icon: Star,
    tone: "gold",
  },
  {
    name: "Smart Notifier",
    role: "Recovery & upsell automatici",
    desc: "Reminder, win-back, upsell. Recupera fino al 32% dei clienti dormienti.",
    price: 39,
    features: ["Trigger personalizzati", "A/B test automatici", "Cross-channel", "ROI tracking"],
    Icon: Bell,
    tone: "violet",
  },
  {
    name: "Brain Analytics",
    role: "Predice trend e fatturato",
    desc: "Analisi predittiva del business. Vedi cosa succederà 30 giorni prima della concorrenza.",
    price: 69,
    features: ["Forecast vendite", "Cohort analysis", "Anomaly detection", "Report settimanali"],
    Icon: Brain,
    tone: "violet",
  },
  {
    name: "Photo Studio AI",
    role: "Genera foto professionali",
    desc: "Foto prodotti, piatti, location in stile editoriale senza fotografi né shooting.",
    price: 49,
    features: ["Generazione illimitata", "Brand consistency", "Editing one-click", "Export multi-formato"],
    Icon: Camera,
    tone: "blue",
  },
  {
    name: "Translator AI",
    role: "Multi-lingua istantaneo",
    desc: "Sito, menu, comunicazioni in 30+ lingue con tone-of-voice del tuo brand.",
    price: 29,
    features: ["30+ lingue", "Brand voice mantenuto", "SEO multi-lingua", "Auto-aggiornamento"],
    Icon: Languages,
    tone: "blue",
  },
  {
    name: "Concierge AI",
    role: "Esperienza cliente premium",
    desc: "Concierge digitale che ricorda preferenze, suggerisce, vizia i clienti VIP.",
    price: 89,
    features: ["Profilo cliente 360°", "Suggerimenti personalizzati", "VIP automation", "Multi-canale"],
    Icon: Sparkles,
    tone: "gold",
  },
  {
    name: "Scheduler Pro",
    role: "Gestione appuntamenti",
    desc: "Booking automatico con conferme, reminder, no-show recovery e ottimizzazione agenda.",
    price: 39,
    features: ["Calendari multipli", "Pagamenti anticipati", "No-show recovery", "Sync Google/Outlook"],
    Icon: Calendar,
    tone: "emerald",
  },
  {
    name: "Document AI",
    role: "Compliance & documenti",
    desc: "Estrae, archivia e gestisce contratti, fatture, ricevute. GDPR-ready.",
    price: 59,
    features: ["OCR avanzato", "Firma digitale", "Archiviazione GDPR", "Workflow approvazioni"],
    Icon: FileText,
    tone: "violet",
  },
  {
    name: "Compliance Guard",
    role: "Protezione fiscale & legale",
    desc: "Monitora scadenze, normative, audit. Zero sanzioni, zero stress.",
    price: 79,
    features: ["Alert scadenze", "Aggiornamenti normativi", "Audit trail completo", "Integrazione commercialista"],
    Icon: Shield,
    tone: "blue",
  },
];

const TONE_HSL: Record<Agent["tone"], string> = {
  violet: "262 75% 64%",
  gold: "38 80% 62%",
  blue: "215 90% 62%",
  emerald: "172 80% 58%",
};

export default function AgentsAlaCarte() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "popular" | "vendita" | "ops" | "marketing">("all");

  const filtered = AGENTS.filter((a) => {
    if (filter === "all") return true;
    if (filter === "popular") return a.popular;
    if (filter === "vendita") return ["Voice Agent", "WhatsApp AI", "Sales Closer", "Concierge AI"].includes(a.name);
    if (filter === "ops") return ["Scheduler Pro", "Document AI", "Compliance Guard", "Smart Notifier"].includes(a.name);
    if (filter === "marketing") return ["Review Shield", "Photo Studio AI", "Translator AI", "Brain Analytics"].includes(a.name);
    return true;
  });

  return (
    <section
      id="agenti-singoli"
      className="landing-section relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20"
      data-theme="dark"
    >
      <div className="landing-section-glow" data-tone="violet" />

      <div className="relative mx-auto max-w-[1400px]">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-8 max-w-[820px] text-center sm:mb-10"
          data-tone="violet"
        >
          <span className="landing-pill mb-4 inline-flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em]">
            <Sparkles className="h-3 w-3" strokeWidth={2.5} /> Agenti AI singoli · A la carte
          </span>
          <h2 className="text-[clamp(1.7rem,4.6vw,3.2rem)] font-heading font-extrabold leading-[0.96] tracking-[-0.04em] text-foreground">
            Costruisci il tuo team AI <span className="landing-heading-gradient">un agente alla volta.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-[clamp(0.9rem,1.5vw,1rem)] leading-[1.65] text-foreground/72">
            Hai già un sito? Nessun problema. Aggiungi solo gli agenti che ti servono. <strong className="text-foreground">Cancellazione in 1 click</strong>, prova senza impegno 14 giorni.
          </p>
        </motion.div>

        {/* Filter chips */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-7 flex flex-wrap items-center justify-center gap-2 sm:mb-9"
        >
          {[
            { key: "all", label: "Tutti", count: AGENTS.length },
            { key: "popular", label: "★ Più richiesti", count: AGENTS.filter((a) => a.popular).length },
            { key: "vendita", label: "Vendita", count: 4 },
            { key: "ops", label: "Operations", count: 4 },
            { key: "marketing", label: "Marketing", count: 4 },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all sm:px-4 sm:py-2 sm:text-[12px] ${
                filter === f.key
                  ? "border-primary/70 bg-primary/15 text-primary shadow-[0_0_16px_hsl(var(--primary)/0.35)]"
                  : "border-border/60 bg-card/30 text-foreground/65 hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {f.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${filter === f.key ? "bg-primary/20" : "bg-foreground/10"}`}>
                {f.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((agent, i) => {
            const accent = TONE_HSL[agent.tone];
            const Icon = agent.Icon;
            return (
              <motion.article
                key={agent.name}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.04, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="landing-surface group relative flex flex-col overflow-hidden rounded-[20px] p-4 sm:p-5"
                data-tone={agent.tone}
              >
                {/* Popular badge */}
                {agent.popular ? (
                  <span
                    className="absolute right-3 top-3 z-10 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.18em]"
                    style={{
                      background: `hsl(${accent} / 0.15)`,
                      color: `hsl(${accent})`,
                      border: `1px solid hsl(${accent} / 0.4)`,
                    }}
                  >
                    ★ Top
                  </span>
                ) : null}

                {/* Icon */}
                <div
                  className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    background: `hsl(${accent} / 0.12)`,
                    color: `hsl(${accent})`,
                    border: `1px solid hsl(${accent} / 0.3)`,
                  }}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>

                {/* Name + role */}
                <h3 className="font-heading text-lg font-extrabold tracking-[-0.03em] text-foreground sm:text-xl">{agent.name}</h3>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: `hsl(${accent})` }}>
                  {agent.role}
                </p>

                {/* Desc */}
                <p className="mt-2.5 flex-1 text-[12.5px] leading-[1.55] text-foreground/72 sm:text-[13px]">{agent.desc}</p>

                {/* Features mini */}
                <ul className="mt-3 space-y-1">
                  {agent.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-[11px] text-foreground/60">
                      <span className="h-1 w-1 rounded-full" style={{ background: `hsl(${accent})` }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="mt-4 flex items-end justify-between border-t border-border/40 pt-3">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-heading text-2xl font-extrabold leading-none tracking-[-0.04em] text-foreground">
                        €{agent.price}
                      </span>
                      <span className="text-[11px] text-foreground/55">/mese</span>
                    </div>
                    <div className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-foreground/50">14gg omaggio</div>
                  </div>
                  <button
                    onClick={() => navigate("/auth?mode=register")}
                    aria-label={`Attiva ${agent.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full transition-all group-hover:scale-110"
                    style={{
                      background: `hsl(${accent} / 0.15)`,
                      color: `hsl(${accent})`,
                      border: `1px solid hsl(${accent} / 0.4)`,
                    }}
                  >
                    <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                </div>

                {/* Hover glow */}
                <div
                  className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(ellipse 80% 60% at 50% 0%, hsl(${accent} / 0.18), transparent 70%)`,
                  }}
                />
              </motion.article>
            );
          })}
        </div>

        {/* Bundle CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-10 max-w-[760px] rounded-[24px] border border-primary/30 bg-gradient-to-br from-primary/10 via-card/30 to-card/10 p-6 text-center backdrop-blur-md sm:mt-12 sm:p-8"
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary">💡 Suggerimento</div>
          <h3 className="mt-2 font-heading text-[clamp(1.2rem,3vw,1.8rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-foreground">
            Risparmia fino al 60% scegliendo un pacchetto Empire
          </h3>
          <p className="mx-auto mt-2 max-w-[480px] text-[13px] leading-[1.55] text-foreground/68 sm:text-sm">
            Se ti servono 4+ agenti, conviene Empire Pro: tutti gli agenti inclusi + sito custom + dashboard a partire da €149/mese.
          </p>
          <button
            onClick={() => document.getElementById("prezzi")?.scrollIntoView({ behavior: "smooth" })}
            className="landing-button-primary group mt-5 px-6 py-3 text-sm font-semibold"
          >
            Confronta con i pacchetti
            <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-1">→</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
