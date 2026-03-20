import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

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

  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);
  const [resolvedAlt, setResolvedAlt] = useState(imageAlt);

  const displaySrc = imageSrc || resolvedSrc;

  return (
    <>
      <div
        ref={containerRef}
        onClick={handleOpen}
        className={disabled ? "" : "cursor-pointer active:scale-[0.97] transition-transform duration-150 relative group"}
        role={disabled ? undefined : "button"}
        tabIndex={disabled ? undefined : 0}
        onKeyDown={disabled ? undefined : (e) => e.key === "Enter" && handleOpen()}
      >
        {children}
        {/* Zoom hint icon */}
        {!disabled && (
          <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <ZoomIn className="w-3.5 h-3.5 text-white/80" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={() => setOpen(false)}
          >
            {/* Top bar with close */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3"
            >
              <button
                onClick={(e) => { e.stopPropagation(); setOpen(false); }}
                className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white active:scale-95 transition-transform"
                aria-label="Chiudi"
              >
                <X className="w-5 h-5" />
              </button>
              {displaySrc && (
                <span className="text-white/50 text-xs font-medium truncate max-w-[60vw]">
                  {resolvedAlt || imageAlt}
                </span>
              )}
              <div className="w-9" /> {/* spacer */}
            </motion.div>

            {/* Fullscreen image */}
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="w-full h-full flex items-center justify-center px-3 py-16"
              onClick={(e) => e.stopPropagation()}
            >
              {displaySrc ? (
                <img
                  src={displaySrc}
                  alt={resolvedAlt || imageAlt}
                  className="max-w-full max-h-full rounded-2xl object-contain select-none"
                  style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.5))" }}
                  draggable={false}
                />
              ) : (
                /* Fallback: render children scaled to fill screen */
                <div className="w-[85vw] max-w-[400px] pointer-events-none">
                  <div className="w-full" style={{ transform: "scale(1)", transformOrigin: "center center" }}>
                    {children}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Bottom hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-4 text-white/30 text-[10px] tracking-wide"
            >
              Tocca per chiudere
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
