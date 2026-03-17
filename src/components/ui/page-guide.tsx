import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useFeatureGuides } from "@/hooks/useFeatureGuides";
import { pageGuides } from "@/config/feature-guides";

/**
 * PageGuide — Floating help button that appears on every route
 * with a matching entry in the pageGuides registry.
 * Shows once per session per page, then stays as a subtle FAB.
 * Mobile-optimized, non-intrusive, safe-area aware.
 */
export const PageGuide = () => {
  const { guidesEnabled } = useFeatureGuides();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(() => {
    try {
      const stored = sessionStorage.getItem("empire-page-guides-seen");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });

  // Match current route to guide (exact first, then prefix)
  const guide = useMemo(() => {
    const path = location.pathname;
    if (pageGuides[path]) return { key: path, ...pageGuides[path] };
    // Try prefix match for dynamic routes (e.g. /app/ncc-bookings matches /app/ncc-bookings)
    const match = Object.entries(pageGuides).find(([k]) => path.startsWith(k) && k !== "/");
    if (match) return { key: match[0], ...match[1] };
    return null;
  }, [location.pathname]);

  // Auto-show hint pulse for first visit
  const [showPulse, setShowPulse] = useState(false);
  useEffect(() => {
    if (guide && !dismissed.has(guide.key)) {
      const timer = setTimeout(() => setShowPulse(true), 1500);
      return () => clearTimeout(timer);
    }
    setShowPulse(false);
  }, [guide, dismissed]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
    setShowPulse(false);
    if (guide) {
      const next = new Set(dismissed);
      next.add(guide.key);
      setDismissed(next);
      try { sessionStorage.setItem("empire-page-guides-seen", JSON.stringify([...next])); } catch {}
    }
  };

  if (!guidesEnabled || !guide) return null;

  return (
    <>
      {/* Floating Action Button — bottom-right, above BottomNav */}
      <motion.button
        onClick={handleOpen}
        className="fixed z-[90] left-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] w-9 h-9 rounded-full bg-primary/80 text-primary-foreground shadow-md shadow-primary/15 flex items-center justify-center"
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        aria-label="Guida pagina"
      >
        <HelpCircle className="w-5 h-5" />
        {/* Pulse ring for first visit */}
        {showPulse && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-primary"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[200] bg-black/30 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-[201] px-3 pb-[max(env(safe-area-inset-bottom,12px),12px)]"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
            >
              <div className="bg-card/95 backdrop-blur-xl border border-border/40 shadow-2xl rounded-2xl overflow-hidden max-h-[70dvh] overflow-y-auto">
                {/* Drag indicator */}
                <div className="flex justify-center pt-2.5 pb-1">
                  <div className="w-9 h-1 rounded-full bg-muted-foreground/15" />
                </div>

                <div className="px-4 pb-5 pt-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <HelpCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-foreground leading-tight">{guide.title}</h4>
                        <p className="text-[10px] text-primary/60 font-medium mt-0.5">Guida Pagina</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="p-1.5 rounded-xl hover:bg-secondary/80 active:bg-secondary transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground/90 leading-relaxed">{guide.description}</p>

                  {/* Steps */}
                  {guide.steps && guide.steps.length > 0 && (
                    <div className="space-y-2.5 pt-1">
                      <p className="text-[10px] font-semibold text-primary/80 uppercase tracking-wider">Passo dopo passo</p>
                      {guide.steps.map((step: string, i: number) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-[11px] text-muted-foreground leading-relaxed pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PageGuide;
