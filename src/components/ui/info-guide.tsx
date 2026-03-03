import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X } from "lucide-react";
import { useFeatureGuides } from "@/hooks/useFeatureGuides";

interface InfoGuideProps {
  title: string;
  description: string;
  /** Optional: short usage steps */
  steps?: string[];
  /** Compact inline mode vs standalone */
  inline?: boolean;
  /** Custom icon size */
  size?: "sm" | "md";
}

export const InfoGuide = ({ title, description, steps, inline = true, size = "sm" }: InfoGuideProps) => {
  const { guidesEnabled } = useFeatureGuides();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!guidesEnabled) return null;

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const btnSize = size === "sm" ? "w-6 h-6 min-w-[24px] min-h-[24px]" : "w-8 h-8 min-w-[32px] min-h-[32px]";

  return (
    <div ref={ref} className={`relative ${inline ? "inline-flex" : ""}`}>
      <motion.button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className={`${btnSize} rounded-full flex items-center justify-center bg-primary/10 hover:bg-primary/20 text-primary transition-colors`}
        whileTap={{ scale: 0.9 }}
        aria-label={`Info: ${title}`}
      >
        <HelpCircle className={iconSize} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Mobile: bottom sheet overlay */}
            <motion.div
              className="fixed inset-0 z-[200] bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Desktop: positioned popover */}
            <motion.div
              className="hidden md:block absolute z-[201] w-72 top-full mt-2 right-0"
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <GuideCard title={title} description={description} steps={steps} onClose={() => setOpen(false)} />
            </motion.div>

            {/* Mobile: bottom sheet */}
            <motion.div
              className="md:hidden fixed bottom-0 left-0 right-0 z-[201] px-4 pb-6"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              <GuideCard title={title} description={description} steps={steps} onClose={() => setOpen(false)} mobile />
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
  mobile,
}: {
  title: string;
  description: string;
  steps?: string[];
  onClose: () => void;
  mobile?: boolean;
}) => (
  <div className={`bg-card border border-border/60 shadow-xl ${mobile ? "rounded-2xl" : "rounded-xl"} overflow-hidden`}>
    {/* Drag handle on mobile */}
    {mobile && (
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
      </div>
    )}

    <div className="p-4 space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-4 h-4 text-primary" />
          </div>
          <h4 className="text-sm font-bold text-foreground leading-tight">{title}</h4>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors flex-shrink-0"
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>

      {steps && steps.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <p className="text-[10px] font-semibold text-primary uppercase tracking-widest">Come si usa</p>
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
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
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
        guidesEnabled
          ? "bg-primary/10 text-primary border border-primary/20"
          : "bg-secondary text-muted-foreground border border-border/50"
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <HelpCircle className="w-3.5 h-3.5" />
      {guidesEnabled ? "Guide Attive" : "Guide Disattivate"}
    </motion.button>
  );
};

export default InfoGuide;
