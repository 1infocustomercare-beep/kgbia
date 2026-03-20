import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface MockupLightboxProps {
  children: React.ReactNode;
  /** The image URL to show fullscreen, OR pass imgElement for non-img content */
  imageSrc?: string;
  imageAlt?: string;
  /** If no imageSrc, captures a screenshot-like view of children */
  disabled?: boolean;
}

/**
 * Wraps any iPhone mockup — tap to open fullscreen lightbox.
 * Works with both image-based mockups and CSS-rendered content.
 */
export function MockupLightbox({ children, imageSrc, imageAlt = "Preview", disabled }: MockupLightboxProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    if (!disabled) setOpen(true);
  }, [disabled]);

  return (
    <>
      <div
        onClick={handleOpen}
        className={disabled ? "" : "cursor-pointer active:scale-[0.97] transition-transform duration-150"}
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
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setOpen(false)}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-95 transition-transform"
              aria-label="Chiudi"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Image display */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
                  draggable={false}
                />
              ) : (
                <div className="transform scale-[1.8] origin-center pointer-events-none">
                  {children}
                </div>
              )}
            </motion.div>

            {/* Tap hint */}
            <p className="absolute bottom-6 text-white/40 text-xs">
              Tocca ovunque per chiudere
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
