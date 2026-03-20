import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface MockupLightboxProps {
  children: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  disabled?: boolean;
}

/**
 * Wraps any iPhone mockup — tap to open fullscreen lightbox.
 * Extracts the first <img> from children if no imageSrc is given.
 */
export function MockupLightbox({ children, imageSrc, imageAlt = "Preview", disabled }: MockupLightboxProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);
  const [resolvedAlt, setResolvedAlt] = useState(imageAlt);

  const handleOpen = useCallback(() => {
    if (disabled) return;

    // If no imageSrc, try to find an img inside the children DOM
    if (!imageSrc && containerRef.current) {
      const img = containerRef.current.querySelector("img");
      if (img?.src) {
        setResolvedSrc(img.src);
        setResolvedAlt(img.alt || imageAlt);
      }
    }
    setOpen(true);
  }, [disabled, imageSrc, imageAlt]);

  const displaySrc = imageSrc || resolvedSrc;

  return (
    <>
      <div
        ref={containerRef}
        onClick={handleOpen}
        className={disabled ? "" : "cursor-pointer relative group"}
        role={disabled ? undefined : "button"}
        tabIndex={disabled ? undefined : 0}
        onKeyDown={disabled ? undefined : (e) => e.key === "Enter" && handleOpen()}
      >
        {children}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-lg"
            onClick={() => setOpen(false)}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              onClick={(e) => { e.stopPropagation(); setOpen(false); }}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-all"
              aria-label="Chiudi"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Alt label */}
            {(resolvedAlt || imageAlt) && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-xs font-medium truncate max-w-[60vw] z-20"
              >
                {resolvedAlt || imageAlt}
              </motion.span>
            )}

            {/* Fullscreen iPhone mockup image */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              style={{ width: "min(85vw, 380px)", height: "min(85vh, 780px)" }}
            >
              {displaySrc ? (
                <div
                  className="relative w-full h-full rounded-[40px] overflow-hidden"
                  style={{
                    aspectRatio: "9/19.5",
                    maxHeight: "82vh",
                    maxWidth: "min(85vw, 380px)",
                    border: "3px solid hsl(220 12% 75%)",
                    background: "#0a0a12",
                    boxShadow: "0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
                  }}
                >
                  {/* Dynamic Island */}
                  <div
                    className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[90px] h-[26px] bg-black rounded-full z-30"
                    style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }}
                  />
                  {/* Screen */}
                  <div className="absolute inset-[3px] rounded-[37px] overflow-hidden">
                    <img
                      src={displaySrc}
                      alt={resolvedAlt || imageAlt}
                      className="w-full h-full object-cover select-none"
                      style={{ objectPosition: "center top" }}
                      draggable={false}
                    />
                  </div>
                  {/* Bottom bar */}
                  <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[34%] h-[4px] bg-white/25 rounded-full z-20" />
                  {/* Glass reflection */}
                  <div
                    className="absolute inset-0 rounded-[40px] pointer-events-none"
                    style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 35%)" }}
                  />
                </div>
              ) : (
                /* Fallback: render children scaled */
                <div className="w-[85vw] max-w-[380px] pointer-events-none">
                  {children}
                </div>
              )}
            </motion.div>

            {/* Tap hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-5 text-white/30 text-[10px] tracking-[2px] uppercase"
            >
              Tocca per chiudere
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
