// SellerOnboardingWizard — Tour guidato 4 step per nuovi venditori.
// Spiega: 1) cos'è Arianna autopilot, 2) come funzionano i crediti,
// 3) le API a pagamento (Ricerca Estrema PRO), 4) custom preview.
// Mostrato una volta sola: dismiss salvato in localStorage.
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Coins, Sparkles, Wand2, ChevronRight, X, Check, Link2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "empire-seller-onboarded-v1";

interface Step {
  icon: React.ReactNode;
  title: string;
  highlight: string;
  body: string;
  bullets: string[];
  cta?: { label: string; path: string };
  accent: string;
}

const STEPS: Step[] = [
  {
    icon: <Bot className="w-6 h-6" />,
    title: "Arianna lavora per te in autopilota",
    highlight: "Scegli da sola zone e settori, scansiona, filtra solo lead caldi.",
    body: "Accendi l'interruttore una volta e Arianna parte: ogni 90 secondi sceglie una zona × settore con il suo cervello adattivo, scarta chi ha già sito o social, salva nella tua pipeline solo lead premium con rating ≥4 e 20+ recensioni.",
    bullets: [
      "❌ Zero clic manuali — toggle ON e basta",
      "🧠 Impara dai risultati: sale dove converti meglio",
      "🔥 Solo lead caldi: senza sito, senza social, premium",
    ],
    accent: "linear-gradient(135deg, #a78bfa, #14b8a6)",
  },
  {
    icon: <Coins className="w-6 h-6" />,
    title: "Crediti — paghi solo quello che usi",
    highlight: "Ogni azione costa crediti. Niente abbonamento, niente sorprese.",
    body: "I crediti scalano automaticamente dal tuo saldo a ogni ricerca, arricchimento, demo o preview. Vedi sempre saldo e cronologia in alto a destra. Ricarichi quando vuoi dalla sezione Abbonamento.",
    bullets: [
      "🔍 Ricerca lead: 1–2 crediti",
      "🎬 Demo factory: 3 crediti",
      "🚀 Ricerca Estrema PRO: 4 crediti (Yelp, TripAdvisor, social, P.IVA)",
    ],
    accent: "linear-gradient(135deg, #fbbf24, #fb923c)",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "API esterne — gestite da noi",
    highlight: "Niente chiavi API da configurare. Lavori e basta.",
    body: "Tutte le fonti dati premium (Google, Firecrawl, Yelp, TripAdvisor, registro imprese) sono già connesse. Tu paghi un piccolo fee in crediti per ogni chiamata, noi ci occupiamo dei provider.",
    bullets: [
      "✅ Zero configurazione tecnica",
      "📊 Stato delle fonti dati visibile sempre",
      "🛡️ Cache 24h: stesso lead = stessi dati gratis",
    ],
    cta: { label: "Vedi connessioni API", path: "/partner/api-connections" },
    accent: "linear-gradient(135deg, #06b6d4, #3b82f6)",
  },
  {
    icon: <Wand2 className="w-6 h-6" />,
    title: "Preview custom per qualsiasi settore",
    highlight: "Genera anteprime professionali anche per settori non standard.",
    body: "Hai un fioraio, un tatuatore, un'attività particolare? Crea una preview iPhone su misura scegliendo stile (Modern, Luxury, Casual, Zen) e colori. Da mostrare al cliente in 30 secondi.",
    bullets: [
      "🎨 4 stili visuali pronti",
      "📱 Mockup iPhone professionale",
      "💼 Perfetto per chiusura in trattativa",
    ],
    cta: { label: "Apri Custom Preview", path: "/partner/custom-preview" },
    accent: "linear-gradient(135deg, #ec4899, #a78bfa)",
  },
];

export default function SellerOnboardingWizard() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      // Apri dopo 800ms così il pannello sotto è già montato
      const t = window.setTimeout(() => setOpen(true), 800);
      return () => window.clearTimeout(t);
    }
  }, []);

  const close = () => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else close();
  };

  const skip = () => close();

  if (!open) return null;
  const cur = STEPS[step];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-6"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
        onClick={skip}
      >
        <motion.div
          initial={{ y: 40, scale: 0.95 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 40, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-md rounded-2xl overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, #0a0a14, #14141f)",
            border: "1px solid rgba(167,139,250,0.3)",
            boxShadow: "0 20px 60px rgba(167,139,250,0.25)",
          }}
        >
          {/* Skip */}
          <button
            onClick={skip}
            className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition hover:bg-white/10"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <X className="w-3.5 h-3.5 text-white/60" />
          </button>

          {/* Header con icona accent */}
          <div className="p-5 pt-7" style={{ background: cur.accent }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0" style={{
                background: "rgba(0,0,0,0.25)", backdropFilter: "blur(10px)",
              }}>
                {cur.icon}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-white/80 mb-0.5">
                  Step {step + 1} di {STEPS.length}
                </div>
                <h2 className="text-base font-bold text-white leading-tight">{cur.title}</h2>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            <p className="text-sm font-semibold text-foreground leading-snug">{cur.highlight}</p>
            <p className="text-[12px] text-muted-foreground leading-relaxed">{cur.body}</p>

            <div className="space-y-1.5">
              {cur.bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-foreground/85 px-2.5 py-1.5 rounded-lg" style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <Check className="w-3 h-3 mt-0.5 shrink-0 text-emerald-400" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            {cur.cta && (
              <button
                onClick={() => { close(); navigate(cur.cta!.path); }}
                className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold py-2 rounded-lg transition hover:scale-[1.01]"
                style={{
                  background: "rgba(167,139,250,0.12)",
                  border: "1px solid rgba(167,139,250,0.3)",
                  color: "#c4b5fd",
                }}
              >
                <Link2 className="w-3 h-3" />
                {cur.cta.label}
              </button>
            )}

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className="h-1 rounded-full transition-all"
                  style={{
                    width: i === step ? 18 : 6,
                    background: i === step ? "#a78bfa" : i < step ? "#4ade80" : "rgba(255,255,255,0.15)",
                  }}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={skip}
                className="flex-1 py-2.5 rounded-lg text-[11px] font-semibold text-muted-foreground transition hover:bg-white/5"
              >
                Salta tour
              </button>
              <button
                onClick={next}
                className="flex-[2] flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[12px] font-bold text-white transition hover:scale-[1.02]"
                style={{ background: cur.accent }}
              >
                {step < STEPS.length - 1 ? "Avanti" : "Iniziamo"}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
