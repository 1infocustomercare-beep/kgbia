import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Sparkles, Eye, AlertTriangle, Shield, ChefHat, Wallet } from "lucide-react";

interface GuidedStep {
  id: string;
  title: string;
  script: string;
  icon: React.ReactNode;
  highlight: string; // CSS selector hint for visual reference
  position: "top" | "center" | "bottom";
}

const steps: GuidedStep[] = [
  {
    id: "hook",
    title: "🎬 L'Esca Visiva",
    script: "\"Guarda che app ha il ristorante in fondo alla via. Tu come fai ordinare i tuoi clienti?\"",
    icon: <Eye className="w-5 h-5" />,
    highlight: "customer-pwa",
    position: "top",
  },
  {
    id: "panic",
    title: "⚡ Il Colpo di Scena",
    script: "\"Quanto tempo perdi a cambiare i prezzi sul menù cartaceo? Con Empire ci metti 1 secondo. Guarda.\"",
    icon: <AlertTriangle className="w-5 h-5" />,
    highlight: "panic-mode",
    position: "center",
  },
  {
    id: "shield",
    title: "🛡️ La Protezione",
    script: "\"Vedi questa luce verde? Significa che il tuo registratore è collegato. Gennaio 2026 è vicino. Tu sei pronto?\"",
    icon: <Shield className="w-5 h-5" />,
    highlight: "ai-mary",
    position: "center",
  },
  {
    id: "wallet",
    title: "💰 Il Recupero Clienti",
    script: "\"Stai perdendo il 30% dei clienti ogni mese. Clicca qui: riportali nel locale senza spendere 1€ in pubblicità.\"",
    icon: <Wallet className="w-5 h-5" />,
    highlight: "wallet-push",
    position: "bottom",
  },
  {
    id: "kitchen",
    title: "👨‍🍳 L'Efficienza Totale",
    script: "\"Zero errori, zero carta. L'ordine arriva in cucina in 0.3 secondi con suono. Staff felice, clienti felici.\"",
    icon: <ChefHat className="w-5 h-5" />,
    highlight: "kitchen-view",
    position: "bottom",
  },
];

interface Props {
  active: boolean;
  onClose: () => void;
  onStepChange?: (stepId: string) => void;
}

const GuidedDemoOverlay = ({ active, onClose, onStepChange }: Props) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (active) {
      setCurrentStep(0);
      onStepChange?.(steps[0].id);
    }
  }, [active]);

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      onStepChange?.(steps[next].id);
    } else {
      onClose();
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      onStepChange?.(steps[prev].id);
    }
  };

  if (!active) return null;

  const step = steps[currentStep];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] pointer-events-none"
      >
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] pointer-events-auto" onClick={onClose} />

        {/* Sales Bubble */}
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`absolute left-4 right-4 pointer-events-auto ${
            step.position === "top" ? "top-20" : step.position === "center" ? "top-1/3" : "bottom-28"
          }`}
        >
          <div className="p-5 rounded-2xl bg-card/95 backdrop-blur-xl border border-primary/30 shadow-[0_0_40px_-10px_hsl(var(--primary)/0.3)]">
            {/* Close */}
            <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-secondary text-muted-foreground">
              <X className="w-4 h-4" />
            </button>

            {/* Step indicator */}
            <div className="flex items-center gap-1.5 mb-3">
              {steps.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all ${i === currentStep ? "w-6 bg-primary" : "w-2 bg-muted"}`} />
              ))}
              <span className="text-[10px] text-muted-foreground ml-auto">{currentStep + 1}/{steps.length}</span>
            </div>

            {/* Content */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary flex-shrink-0">
                {step.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-foreground mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed italic">{step.script}</p>
              </div>
            </div>

            {/* Animated arrow pointer */}
            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mt-3 flex items-center gap-2 text-primary"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                {currentStep < steps.length - 1 ? "Mostra questa sezione al ristoratore →" : "Pronto per chiudere il contratto!"}
              </span>
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
              <button
                onClick={goPrev}
                disabled={currentStep === 0}
                className="flex items-center gap-1 text-xs text-muted-foreground disabled:opacity-30 hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Indietro
              </button>
              <motion.button
                onClick={goNext}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
                whileTap={{ scale: 0.95 }}
              >
                {currentStep < steps.length - 1 ? (
                  <>Prossimo <ChevronRight className="w-4 h-4" /></>
                ) : (
                  <>Chiudi Contratto 🏆</>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GuidedDemoOverlay;
