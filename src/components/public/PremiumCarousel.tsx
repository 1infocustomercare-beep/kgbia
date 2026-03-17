import { useRef, useState, useCallback, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, LayoutGrid, X } from "lucide-react";

interface PremiumCarouselProps {
  children: ReactNode[];
  speed?: "fast" | "normal" | "slow";
  itemWidth?: number;
  showControls?: boolean;
  accentColor?: string;
  className?: string;
  fullWidth?: boolean;
}

export function PremiumCarousel({
  children,
  speed = "normal",
  itemWidth = 260,
  showControls = true,
  accentColor = "hsl(var(--primary))",
  className = "",
  fullWidth = false,
}: PremiumCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const animRef = useRef<number>();
  const posRef = useRef(0);
  const lastTimeRef = useRef(0);
  const pausedRef = useRef(false);

  const speeds: Record<string, number> = { fast: 55, normal: 38, slow: 25 };
  const pxPerSec = speeds[speed];
  const gap = 20;
  const singleSetWidth = children.length * (itemWidth + gap);

  useEffect(() => { pausedRef.current = isPaused || isExpanded; }, [isPaused, isExpanded]);

  const tick = useCallback((ts: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = ts;
    const delta = (ts - lastTimeRef.current) / 1000;
    lastTimeRef.current = ts;

    if (!pausedRef.current && trackRef.current) {
      posRef.current += pxPerSec * delta;
      if (posRef.current >= singleSetWidth) {
        posRef.current -= singleSetWidth;
      }
      trackRef.current.style.transform = `translate3d(-${posRef.current}px, 0, 0)`;
    }

    animRef.current = requestAnimationFrame(tick);
  }, [pxPerSec, singleSetWidth]);

  useEffect(() => {
    lastTimeRef.current = 0;
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [tick]);

  const jump = (dir: "left" | "right") => {
    const shift = itemWidth + gap;
    posRef.current += dir === "right" ? shift : -shift;
    if (posRef.current < 0) posRef.current += singleSetWidth;
    if (posRef.current >= singleSetWidth) posRef.current -= singleSetWidth;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(-${posRef.current}px, 0, 0)`;
    }
  };

  const tripled = [...children, ...children, ...children];

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setTimeout(() => setIsPaused(false), 3500)}
    >
      {/* ═══ EXPANDED GRID VIEW ═══ */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
              {children.map((child, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  {child}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ CAROUSEL VIEW ═══ */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={`overflow-hidden ${fullWidth ? "" : "-mx-4 sm:mx-0"}`} style={{ maxHeight: "340px" }}>
              <div
                ref={trackRef}
                className="flex flex-nowrap will-change-transform"
                style={{ gap: `${gap}px`, padding: "16px 0" }}
              >
                {tripled.map((child, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0"
                    style={{ width: itemWidth }}
                  >
                    {child}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Luxury floating controls */}
      {showControls && (
        <div className="flex justify-center mt-6">
          <motion.div
            className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-full backdrop-blur-2xl"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`,
              border: `1px solid rgba(255,255,255,0.08)`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {!isExpanded && (
              <>
                <button
                  onClick={() => jump("left")}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90"
                  style={{ color: accentColor, background: "rgba(255,255,255,0.04)" }}
                  aria-label="Precedente"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90"
                  style={{
                    background: isPaused ? `${accentColor}20` : "rgba(255,255,255,0.04)",
                    color: accentColor,
                    boxShadow: isPaused ? `0 0 12px ${accentColor}25` : "none",
                  }}
                  aria-label={isPaused ? "Play" : "Pause"}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 ml-0.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => jump("right")}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90"
                  style={{ color: accentColor, background: "rgba(255,255,255,0.04)" }}
                  aria-label="Successivo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="w-px h-5 mx-0.5" style={{ background: "rgba(255,255,255,0.08)" }} />
              </>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90"
              style={{
                background: isExpanded ? `${accentColor}20` : "rgba(255,255,255,0.04)",
                color: accentColor,
                boxShadow: isExpanded ? `0 0 12px ${accentColor}25` : "none",
              }}
              aria-label={isExpanded ? "Chiudi griglia" : "Mostra tutti"}
            >
              {isExpanded ? <X className="w-4 h-4" /> : <LayoutGrid className="w-3.5 h-3.5" />}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
