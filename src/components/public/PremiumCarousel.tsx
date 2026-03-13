import { useRef, useState, useCallback, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const animRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const speeds: Record<string, number> = { fast: 70, normal: 45, slow: 30 };
  const pxPerSec = speeds[speed];

  const gap = 20;
  const totalWidth = children.length * (itemWidth + gap);

  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    setScrollPos(prev => {
      const next = prev + pxPerSec * delta;
      return next >= totalWidth ? next - totalWidth : next;
    });

    animRef.current = requestAnimationFrame(animate);
  }, [pxPerSec, totalWidth]);

  useEffect(() => {
    if (!isPaused) {
      lastTimeRef.current = 0;
      animRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPaused, animate]);

  const scroll = (dir: "left" | "right") => {
    setScrollPos(prev => {
      const shift = itemWidth + gap;
      const next = dir === "right" ? prev + shift : prev - shift;
      if (next < 0) return totalWidth + next;
      if (next >= totalWidth) return next - totalWidth;
      return next;
    });
  };

  const duplicated = [...children, ...children, ...children];

  const activeIndex = Math.floor(scrollPos / (itemWidth + gap)) % children.length;

  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={() => { setIsPaused(true); setIsHovered(true); }}
      onMouseLeave={() => { setIsPaused(false); setIsHovered(false); }}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setTimeout(() => setIsPaused(false), 4000)}
    >
      {/* Luxury edge fades with glow */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-20 pointer-events-none"
        style={{
          background: `linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background) / 0.85) 40%, transparent 100%)`,
        }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-20 pointer-events-none"
        style={{
          background: `linear-gradient(to left, hsl(var(--background)) 0%, hsl(var(--background) / 0.85) 40%, transparent 100%)`,
        }} />

      {/* Subtle accent glow at edges */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 rounded-full z-20 pointer-events-none blur-xl opacity-40"
        style={{ background: accentColor }} />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1/2 rounded-full z-20 pointer-events-none blur-xl opacity-40"
        style={{ background: accentColor }} />

      {/* Track */}
      <div className={`overflow-hidden ${fullWidth ? "" : "-mx-5 sm:mx-0"}`}>
        <div
          ref={scrollRef}
          className="flex py-4 will-change-transform"
          style={{
            transform: `translateX(-${scrollPos}px)`,
            gap: `${gap}px`,
          }}
        >
          {duplicated.map((child, i) => {
            const childIndex = i % children.length;
            const isActive = childIndex === activeIndex;
            return (
              <motion.div
                key={i}
                className="flex-shrink-0 relative"
                style={{ width: itemWidth }}
                animate={{
                  scale: isActive ? 1.03 : 1,
                  opacity: isActive ? 1 : 0.7,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Glow behind active item */}
                {isActive && (
                  <div
                    className="absolute -inset-2 rounded-2xl blur-2xl opacity-20 transition-opacity duration-700 -z-10"
                    style={{ background: accentColor }}
                  />
                )}
                {child}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Controls — glassmorphism floating bar */}
      {showControls && (
        <AnimatePresence>
          <motion.div
            className="flex items-center justify-center gap-2 mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-full backdrop-blur-xl border"
              style={{
                background: `linear-gradient(135deg, ${accentColor}08, ${accentColor}04)`,
                borderColor: `${accentColor}15`,
                boxShadow: `0 4px 24px ${accentColor}10, inset 0 1px 0 ${accentColor}08`,
              }}
            >
              <button
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90"
                style={{
                  background: `${accentColor}10`,
                  color: accentColor,
                }}
                aria-label="Precedente"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Progress bar */}
              <div className="flex items-center gap-[3px] px-2">
                {Array.from({ length: Math.min(children.length, 7) }).map((_, i) => {
                  const isActive = activeIndex % Math.min(children.length, 7) === i;
                  return (
                    <motion.div
                      key={i}
                      className="h-[3px] rounded-full"
                      animate={{
                        width: isActive ? 24 : 6,
                        background: isActive ? accentColor : `${accentColor}20`,
                      }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  );
                })}
              </div>

              <button
                onClick={() => setIsPaused(!isPaused)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90"
                style={{
                  background: isPaused ? `${accentColor}20` : `${accentColor}10`,
                  color: accentColor,
                }}
                aria-label={isPaused ? "Riproduci" : "Pausa"}
              >
                {isPaused ? <Play className="w-3 h-3 ml-0.5" /> : <Pause className="w-3 h-3" />}
              </button>

              <button
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90"
                style={{
                  background: `${accentColor}10`,
                  color: accentColor,
                }}
                aria-label="Successivo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
