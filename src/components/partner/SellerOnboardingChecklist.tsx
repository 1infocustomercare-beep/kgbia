// SellerOnboardingChecklist — Onboarding step-by-step persistente per nuovi venditori.
// Si apre automaticamente al primo accesso al pannello partner, poi resta accessibile
// come FAB compatto in basso a sinistra. Ogni step ha micro-istruzioni + scorciatoia.
import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Circle, ChevronRight, X, Rocket, Target, Zap,
  FolderOpen, Palette, DollarSign, ListChecks, Sparkles,
} from "lucide-react";

const STORAGE_KEY = "empire-seller-checklist-v1";
const AUTO_OPEN_KEY = "empire-seller-checklist-autoopened-v1";

interface ChecklistStep {
  id: string;
  icon: React.ReactNode;
  title: string;
  micro: string; // micro-istruzione 1 frase
  why: string; // perché farlo
  cta: { label: string; path: string };
  accent: string;
}

const STEPS: ChecklistStep[] = [
  {
    id: "profile",
    icon: <Sparkles className="w-4 h-4" />,
    title: "Completa il tuo profilo",
    micro: "Aggiungi foto, nome e zona operativa per personalizzare l'AI.",
    why: "Arianna usa il tuo profilo per firmare email e WhatsApp con il tuo nome reale.",
    cta: { label: "Vai al Profilo", path: "/partner/profile" },
    accent: "from-violet-500 to-fuchsia-500",
  },
  {
    id: "api",
    icon: <Zap className="w-4 h-4" />,
    title: "Verifica connessioni API",
    micro: "Controlla che Email e WhatsApp siano operativi prima dell'autopilot.",
    why: "Senza canali attivi, Arianna non può inviare messaggi automatici ai lead.",
    cta: { label: "Apri Connessioni API", path: "/partner/api-connections" },
    accent: "from-cyan-500 to-blue-500",
  },
  {
    id: "leads",
    icon: <Target className="w-4 h-4" />,
    title: "Esplora il Lead Engine",
    micro: "Filtra per zona, settore o AI score ≥75 per i lead più caldi.",
    why: "Qui vedi tutti i prospect raccolti da Arianna con scoring automatico.",
    cta: { label: "Apri Lead Engine", path: "/partner/leads" },
    accent: "from-emerald-500 to-teal-500",
  },
  {
    id: "demo",
    icon: <Palette className="w-4 h-4" />,
    title: "Genera la tua prima preview",
    micro: "Crea un mockup iPhone personalizzato per mostrare al cliente in 30 sec.",
    why: "Le preview pre-generate aumentano la conversione dell'85% al primo contatto.",
    cta: { label: "Custom Preview", path: "/partner/custom-preview" },
    accent: "from-pink-500 to-rose-500",
  },
  {
    id: "portfolio",
    icon: <FolderOpen className="w-4 h-4" />,
    title: "Allestisci il Portfolio",
    micro: "Salva i tuoi progetti migliori da mostrare in trattativa.",
    why: "Un portfolio curato chiude più contratti del 40% rispetto alle demo neutre.",
    cta: { label: "Vai al Portfolio", path: "/partner/portfolio" },
    accent: "from-amber-500 to-orange-500",
  },
  {
    id: "earnings",
    icon: <DollarSign className="w-4 h-4" />,
    title: "Configura i Guadagni",
    micro: "Collega Stripe Connect per ricevere le commissioni in automatico.",
    why: "Senza Stripe configurato non puoi incassare le commissioni dai contratti firmati.",
    cta: { label: "Apri Guadagni", path: "/partner/earnings" },
    accent: "from-yellow-500 to-amber-600",
  },
];

interface SavedState {
  completed: string[];
  dismissedAt?: number;
}

function loadState(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: [] };
    const parsed = JSON.parse(raw);
    return { completed: Array.isArray(parsed?.completed) ? parsed.completed : [], dismissedAt: parsed?.dismissedAt };
  } catch {
    return { completed: [] };
  }
}

function saveState(state: SavedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export default function SellerOnboardingChecklist() {
  const navigate = useNavigate();
  const [state, setState] = useState<SavedState>(() => loadState());
  const [open, setOpen] = useState(false);

  const completedSet = useMemo(() => new Set(state.completed), [state.completed]);
  const totalSteps = STEPS.length;
  const doneCount = STEPS.filter((s) => completedSet.has(s.id)).length;
  const progress = Math.round((doneCount / totalSteps) * 100);
  const allDone = doneCount === totalSteps;

  // Auto-open al primissimo accesso (solo se non ancora completato)
  useEffect(() => {
    if (allDone) return;
    const autoOpened = sessionStorage.getItem(AUTO_OPEN_KEY);
    if (autoOpened) return;
    const t = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(AUTO_OPEN_KEY, "1");
    }, 1200);
    return () => clearTimeout(t);
  }, [allDone]);

  const toggleStep = useCallback((id: string) => {
    setState((prev) => {
      const set = new Set(prev.completed);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      const next = { ...prev, completed: Array.from(set) };
      saveState(next);
      return next;
    });
  }, []);

  const handleCta = useCallback((step: ChecklistStep) => {
    // marca step come completato all'avvio dell'azione
    setState((prev) => {
      if (prev.completed.includes(step.id)) return prev;
      const next = { ...prev, completed: [...prev.completed, step.id] };
      saveState(next);
      return next;
    });
    setOpen(false);
    navigate(step.cta.path);
  }, [navigate]);

  const dismissForever = useCallback(() => {
    const next: SavedState = { completed: STEPS.map((s) => s.id), dismissedAt: Date.now() };
    saveState(next);
    setState(next);
    setOpen(false);
  }, []);

  // Se l'utente ha completato tutto e dismissato, nascondi anche il FAB
  if (allDone && state.dismissedAt) return null;

  return (
    <>
      {/* FAB compatto bottom-left (non collide con altri FAB bottom-right) */}
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Onboarding venditore"
        className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+76px)] left-3 z-[9995] flex items-center gap-2 px-3 h-10 rounded-full bg-card/90 backdrop-blur-xl border border-primary/30 shadow-soft text-foreground"
      >
        <div className="relative w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground">
          <ListChecks className="w-3.5 h-3.5" />
        </div>
        <div className="text-left leading-none">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Onboarding</div>
          <div className="text-[11px] font-bold">{doneCount}/{totalSteps}</div>
        </div>
        {/* mini progress dot */}
        <div className="w-8 h-1 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 z-[210] bg-black/40 backdrop-blur-[3px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="sheet"
              className="fixed inset-x-0 bottom-0 z-[211] px-3 pb-[max(env(safe-area-inset-bottom,12px),12px)]"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
            >
              <div className="bg-card/95 backdrop-blur-xl border border-border/60 shadow-2xl rounded-3xl overflow-hidden max-h-[85dvh] flex flex-col">
                {/* drag indicator */}
                <div className="flex justify-center pt-2.5 pb-1 flex-shrink-0">
                  <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
                </div>

                {/* Header */}
                <div className="px-4 pt-1 pb-3 flex-shrink-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground flex-shrink-0">
                        <Rocket className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-foreground leading-tight">Inizia da qui, venditore</h3>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{doneCount} di {totalSteps} completati • {progress}%</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      aria-label="Chiudi"
                      className="p-1.5 rounded-xl hover:bg-secondary/80 active:bg-secondary transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  {/* progress bar */}
                  <div className="mt-3 h-1.5 rounded-full bg-secondary/80 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary/60"
                      initial={false}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Steps list */}
                <div className="px-3 pb-3 space-y-2 overflow-y-auto flex-1">
                  {STEPS.map((step, idx) => {
                    const done = completedSet.has(step.id);
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className={`relative rounded-2xl border ${done ? "border-primary/30 bg-primary/[0.04]" : "border-border/60 bg-card/60"} p-3 transition-colors`}
                      >
                        <div className="flex items-start gap-3">
                          {/* check toggle */}
                          <button
                            onClick={() => toggleStep(step.id)}
                            aria-label={done ? "Segna da fare" : "Segna completato"}
                            className="flex-shrink-0 mt-0.5"
                          >
                            {done ? (
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground/60" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${step.accent} flex items-center justify-center text-white flex-shrink-0`}>
                                {step.icon}
                              </div>
                              <h4 className={`text-[13px] font-semibold leading-tight ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                                {idx + 1}. {step.title}
                              </h4>
                            </div>
                            <p className="text-[11px] text-muted-foreground/90 mt-1.5 leading-relaxed">{step.micro}</p>
                            <p className="text-[10px] text-primary/70 mt-1 leading-relaxed italic">→ {step.why}</p>

                            <button
                              onClick={() => handleCta(step)}
                              className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors"
                            >
                              {step.cta.label}
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {allDone && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5 p-4 text-center"
                    >
                      <Sparkles className="w-6 h-6 mx-auto text-primary mb-1.5" />
                      <p className="text-sm font-bold text-foreground">Sei pronto a vendere 🚀</p>
                      <p className="text-[11px] text-muted-foreground mt-1">Hai completato l'onboarding. Buona caccia!</p>
                      <button
                        onClick={dismissForever}
                        className="mt-3 text-[11px] text-primary font-semibold hover:underline"
                      >
                        Nascondi questa guida
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
