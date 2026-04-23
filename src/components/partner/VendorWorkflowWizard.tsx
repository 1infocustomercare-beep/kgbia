import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Target, Palette, Presentation, ArrowRight, Sparkles,
  HelpCircle, X, ChevronRight, Wand2, FolderOpen, Rocket,
} from "lucide-react";

/**
 * VendorWorkflowWizard
 * ─────────────────────────────────────────────────────────────
 * Risolve la confusione "quale strumento uso per quale scopo?".
 * Mostra 3 scenari di vendita realistici e guida il vendor allo
 * strumento giusto in 1 click.
 *
 * Posizionato in cima alla Home Partner (dopo l'orb), sempre visibile
 * ma comprimibile (stato persistito su localStorage).
 */

const STORAGE_KEY = "vendor-wizard-collapsed";

interface Scenario {
  id: string;
  emoji: string;
  question: string;
  context: string;
  recommendation: {
    label: string;
    micro: string;
    path: string;
    icon: typeof Target;
    accent: string;
    glow: string;
  };
  alt?: {
    label: string;
    path: string;
  };
  steps: string[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "new-lead",
    emoji: "🎯",
    question: "Ho scoperto un locale nuovo da contattare",
    context: "Non hai ancora parlato col titolare. Ti serve un sito demo 1:1 da inviare via WhatsApp per agganciarlo.",
    recommendation: {
      label: "Caccia Lead + Demo Auto",
      micro: "L'AI scova il locale e genera in 60s il sito demo brandizzato",
      path: "/partner/leads",
      icon: Target,
      accent: "#a78bfa",
      glow: "rgba(167,139,250,0.45)",
    },
    steps: [
      "Vai su Caccia Lead, cerca per zona/settore",
      "Seleziona il lead → l'AI genera il sito demo automaticamente",
      "Copia il link demo e invialo via WhatsApp con il messaggio pronto",
    ],
  },
  {
    id: "appointment",
    emoji: "🤝",
    question: "Ho un appuntamento col cliente fra poco",
    context: "Conosci già il brand, hai logo e colori. Vuoi un mockup iPhone PERSONALIZZATO da mostrargli in trattativa.",
    recommendation: {
      label: "Mockup su Misura",
      micro: "Costruisci a mano il mockup iPhone con logo, colori e contenuti del cliente",
      path: "/partner/custom-preview",
      icon: Palette,
      accent: "#fb7185",
      glow: "rgba(251,113,133,0.45)",
    },
    alt: {
      label: "Oppure usa un mockup salvato",
      path: "/partner/portfolio",
    },
    steps: [
      "Vai su Mockup su Misura, carica logo e colori del cliente",
      "Scegli il template e personalizza testi/foto",
      "Salva → lo trovi nella Vetrina, pronto da mostrare",
    ],
  },
  {
    id: "live-show",
    emoji: "📱",
    question: "Devo mostrare ORA qualcosa al cliente in faccia",
    context: "Sei davanti al cliente. Ti serve aprire fullscreen una preview senza menu, senza distrazioni — solo il prodotto.",
    recommendation: {
      label: "Pronta da Mostrare",
      micro: "Apri la Vetrina in modalità presentazione fullscreen, zero menu, solo preview",
      path: "/partner/portfolio?present=1",
      icon: Presentation,
      accent: "#34d399",
      glow: "rgba(52,211,153,0.45)",
    },
    steps: [
      "Vai sulla Vetrina, scegli il mockup/demo da mostrare",
      "Tap 'Modalità Presentazione' → fullscreen attivo",
      "Mostralo al cliente, swipe per scorrere le screen",
    ],
  },
];

export default function VendorWorkflowWizard() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem(STORAGE_KEY) === "true"; } catch { return false; }
  });
  const [activeId, setActiveId] = useState<string>(SCENARIOS[0].id);

  const active = SCENARIOS.find((s) => s.id === activeId) || SCENARIOS[0];
  const RecIcon = active.recommendation.icon;

  const toggle = () => {
    const v = !collapsed;
    setCollapsed(v);
    try { localStorage.setItem(STORAGE_KEY, v ? "true" : "false"); } catch {}
  };

  return (
    <section className="px-4 mx-0">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative overflow-hidden rounded-3xl"
        style={{
          background: "linear-gradient(140deg, rgba(167,139,250,0.10) 0%, rgba(251,113,133,0.06) 50%, rgba(52,211,153,0.08) 100%)",
          border: "1.5px solid rgba(167,139,250,0.22)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Animated aurora background */}
        <div className="absolute inset-0 pointer-events-none opacity-50">
          <motion.div
            className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(167,139,250,0.25), transparent 70%)", filter: "blur(40px)" }}
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 w-[280px] h-[280px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(251,113,133,0.20), transparent 70%)", filter: "blur(40px)" }}
            animate={{ x: [0, -25, 0], y: [0, -15, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Header */}
        <div className="relative flex items-center justify-between p-4 sm:p-5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #a78bfa, #ec4899)", boxShadow: "0 6px 20px rgba(167,139,250,0.35)" }}>
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-violet-300/80">Guida rapida</p>
              <h2 className="text-sm sm:text-base font-bold text-foreground truncate">Cosa vuoi fare ora?</h2>
            </div>
          </div>
          <button
            onClick={toggle}
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-all"
            aria-label={collapsed ? "Mostra wizard" : "Nascondi wizard"}
          >
            {collapsed ? <HelpCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden"
            >
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3">
                {/* Scenario chips */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
                  {SCENARIOS.map((s) => {
                    const isActive = s.id === activeId;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setActiveId(s.id)}
                        className="shrink-0 px-3 py-2 rounded-xl text-[10.5px] sm:text-[11.5px] font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap"
                        style={{
                          background: isActive
                            ? `linear-gradient(135deg, ${s.recommendation.accent}30, ${s.recommendation.accent}10)`
                            : "rgba(255,255,255,0.04)",
                          border: `1px solid ${isActive ? s.recommendation.accent + "80" : "rgba(255,255,255,0.08)"}`,
                          color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                          boxShadow: isActive ? `0 4px 16px ${s.recommendation.glow}` : "none",
                        }}
                      >
                        <span className="text-base leading-none">{s.emoji}</span>
                        <span className="truncate max-w-[180px] sm:max-w-none">{s.question}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Active scenario detail */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-2xl p-3.5 sm:p-4 space-y-3"
                    style={{
                      background: "rgba(10,10,18,0.55)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {/* Context */}
                    <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                      {active.context}
                    </p>

                    {/* Recommendation CTA */}
                    <Link
                      to={active.recommendation.path}
                      className="block group"
                    >
                      <div
                        className="relative rounded-xl p-3 sm:p-3.5 flex items-center gap-3 transition-all active:scale-[0.98] group-hover:translate-x-0.5"
                        style={{
                          background: `linear-gradient(135deg, ${active.recommendation.accent}28, ${active.recommendation.accent}08)`,
                          border: `1.5px solid ${active.recommendation.accent}80`,
                          boxShadow: `0 8px 24px ${active.recommendation.glow}`,
                        }}
                      >
                        <div
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${active.recommendation.accent}, ${active.recommendation.accent}99)`,
                            boxShadow: `0 6px 16px ${active.recommendation.glow}`,
                          }}
                        >
                          <RecIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/60 mb-0.5">Vai qui</p>
                          <p className="text-sm sm:text-base font-bold text-white truncate">{active.recommendation.label}</p>
                          <p className="text-[10.5px] sm:text-[11.5px] text-white/65 leading-tight mt-0.5 line-clamp-2">{active.recommendation.micro}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/80 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>

                    {/* Steps */}
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70 px-0.5">Come si fa</p>
                      {active.steps.map((s, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div
                            className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-px"
                            style={{
                              background: `${active.recommendation.accent}20`,
                              border: `1px solid ${active.recommendation.accent}50`,
                            }}
                          >
                            <span className="text-[9px] font-bold" style={{ color: active.recommendation.accent }}>{i + 1}</span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-foreground/75 leading-relaxed">{s}</p>
                        </div>
                      ))}
                    </div>

                    {/* Alt link */}
                    {active.alt && (
                      <Link
                        to={active.alt.path}
                        className="flex items-center justify-center gap-1.5 text-[10.5px] font-semibold text-muted-foreground hover:text-foreground transition-colors py-1.5 px-2 rounded-lg hover:bg-white/[0.04]"
                      >
                        <FolderOpen className="w-3 h-3" />
                        {active.alt.label}
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
