import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, HelpCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface TutorialStep {
  title: string;
  description: string;
  emoji?: string;
}

interface TutorialPopupProps {
  id: string;
  title: string;
  steps: TutorialStep[];
  accentColor?: string;
  /** Position: bottom-right default */
  position?: "bottom-right" | "bottom-center" | "top-right";
}

const STORAGE_KEY = "empire-tutorials-dismissed";
const GLOBAL_TOGGLE_KEY = "empire-tutorials-enabled";

function getDismissed(): string[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function setDismissed(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}
export function isTutorialsEnabled(): boolean {
  return localStorage.getItem(GLOBAL_TOGGLE_KEY) !== "false";
}
export function setTutorialsEnabled(v: boolean) {
  localStorage.setItem(GLOBAL_TOGGLE_KEY, v ? "true" : "false");
}

export function TutorialPopup({ id, title, steps, accentColor = "#C8963E", position = "bottom-right" }: TutorialPopupProps) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isTutorialsEnabled()) return;
    const dismissed = getDismissed();
    if (dismissed.includes(id)) return;
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, [id]);

  const dismiss = () => {
    setVisible(false);
    const d = getDismissed();
    if (!d.includes(id)) setDismissed([...d, id]);
  };

  const posClasses: Record<string, string> = {
    "bottom-right": "bottom-20 right-4 lg:bottom-6 lg:right-6",
    "bottom-center": "bottom-20 left-1/2 -translate-x-1/2 lg:bottom-6",
    "top-right": "top-20 right-4 lg:top-16 lg:right-6",
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={cn("fixed z-50 w-[320px] max-w-[calc(100vw-2rem)]", posClasses[position])}
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            style={{ background: "linear-gradient(145deg, rgba(15,15,25,0.98), rgba(10,10,18,0.99))" }}>
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-white/[0.06]"
              style={{ background: `${accentColor}10` }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${accentColor}20` }}>
                  <HelpCircle className="w-3.5 h-3.5" style={{ color: accentColor }} />
                </div>
                <span className="text-xs font-bold text-white/80">{title}</span>
              </div>
              <button onClick={dismiss} className="w-6 h-6 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-all">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Step content */}
            <div className="p-4">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <div className="flex items-start gap-3">
                    {steps[step].emoji && <span className="text-2xl shrink-0 mt-0.5">{steps[step].emoji}</span>}
                    <div>
                      <p className="text-sm font-bold text-white mb-1">{steps[step].title}</p>
                      <p className="text-xs text-white/50 leading-relaxed">{steps[step].description}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer with navigation */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
              <div className="flex gap-1">
                {steps.map((_, i) => (
                  <div key={i} className={cn("w-2 h-2 rounded-full transition-all", i === step ? "w-4" : "bg-white/15")}
                    style={i === step ? { background: accentColor } : {}} />
                ))}
              </div>
              <div className="flex items-center gap-2">
                {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 bg-white/[0.04] hover:bg-white/[0.08] transition-all">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                )}
                {step < steps.length - 1 ? (
                  <button onClick={() => setStep(s => s + 1)}
                    className="px-3 py-1.5 rounded-lg text-[0.65rem] font-bold text-white transition-all"
                    style={{ background: accentColor }}>
                    Avanti <ChevronRight className="w-3 h-3 inline ml-0.5" />
                  </button>
                ) : (
                  <button onClick={dismiss}
                    className="px-3 py-1.5 rounded-lg text-[0.65rem] font-bold text-white transition-all"
                    style={{ background: accentColor }}>
                    Ho capito ✓
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Tooltip help button */
export function HelpTooltip({ text, accentColor = "#C8963E" }: { text: string; accentColor?: string }) {
  const [open, setOpen] = useState(false);
  if (!isTutorialsEnabled()) return null;
  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen(o => !o)}
        className="w-5 h-5 rounded-full flex items-center justify-center text-white/20 hover:text-white/50 transition-all"
        style={open ? { background: `${accentColor}20`, color: accentColor } : {}}>
        <HelpCircle className="w-3 h-3" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 rounded-xl text-[0.6rem] text-white/70 z-50 shadow-xl border border-white/10"
            style={{ background: "rgba(15,15,25,0.98)" }}>
            {text}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b border-white/10" style={{ background: "rgba(15,15,25,0.98)" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
