import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X, ChevronRight } from "lucide-react";
import { useFeatureGuides } from "@/hooks/useFeatureGuides";
import { featureGuides, type GuideEntry } from "@/config/feature-guides";

interface InfoGuideProps {
  /** Registry key — if set, content loads from feature-guides.ts */
  guideKey?: string;
  /** Manual override */
  title?: string;
  description?: string;
  steps?: string[];
  inline?: boolean;
  size?: "sm" | "md";
}

export const InfoGuide = ({ guideKey, title, description, steps, inline = true, size = "sm" }: InfoGuideProps) => {
  const { guidesEnabled } = useFeatureGuides();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Resolve from registry if guideKey provided
  const entry: GuideEntry | undefined = guideKey ? featureGuides[guideKey] : undefined;
  const resolvedTitle = title || entry?.title || "Info";
  const resolvedDesc = description || entry?.description || "";
  const resolvedSteps = steps || entry?.steps;

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Lock body scroll when mobile sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  if (!guidesEnabled) return null;

  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const btnSize = size === "sm" ? "w-6 h-6 min-w-[24px] min-h-[24px]" : "w-7 h-7 min-w-[28px] min-h-[28px]";

  return (
    <div ref={ref} className={`relative ${inline ? "inline-flex" : ""}`} style={{ zIndex: open ? 201 : "auto" }}>
      <motion.button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className={`${btnSize} rounded-full flex items-center justify-center bg-primary/8 hover:bg-primary/15 text-primary/70 hover:text-primary transition-colors`}
        whileTap={{ scale: 0.9 }}
        aria-label={`Info: ${resolvedTitle}`}
      >
        <HelpCircle className={iconSize} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[200] bg-black/30 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Bottom sheet — safe for all mobile viewports */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-[201] px-3 pb-[max(env(safe-area-inset-bottom,12px),12px)]"
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
            >
              <GuideCard
                title={resolvedTitle}
                description={resolvedDesc}
                steps={resolvedSteps}
                onClose={() => setOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const GuideCard = ({
  title,
  description,
  steps,
  onClose,
}: {
  title: string;
  description: string;
  steps?: string[];
  onClose: () => void;
}) => (
  <div className="bg-card/95 backdrop-blur-xl border border-border/40 shadow-2xl rounded-2xl overflow-hidden max-h-[70dvh] overflow-y-auto">
    {/* Drag indicator */}
    <div className="flex justify-center pt-2.5 pb-1">
      <div className="w-9 h-1 rounded-full bg-muted-foreground/15" />
    </div>

    <div className="px-4 pb-4 pt-1 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-4 h-4 text-primary" />
          </div>
          <h4 className="text-sm font-bold text-foreground leading-tight truncate">{title}</h4>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl hover:bg-secondary/80 active:bg-secondary transition-colors flex-shrink-0 -mt-0.5"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground/90 leading-relaxed">{description}</p>

      {/* Steps */}
      {steps && steps.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-[10px] font-semibold text-primary/80 uppercase tracking-wider">Come fare</p>
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

/** Toggle button for enabling/disabling all guides */
export const GuidesToggle = () => {
  const { guidesEnabled, toggleGuides } = useFeatureGuides();

  return (
    <motion.button
      onClick={toggleGuides}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
        guidesEnabled
          ? "bg-primary/10 text-primary border border-primary/20"
          : "bg-secondary text-muted-foreground border border-border/50"
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <HelpCircle className="w-3.5 h-3.5" />
      {guidesEnabled ? "Guide ?" : "Guide Off"}
    </motion.button>
  );
};

export default InfoGuide;
