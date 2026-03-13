import { useRef, useState, useCallback, useEffect, ReactNode } from "react";
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
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animRef = useRef<number>();
  const posRef = useRef(0);
  const lastTimeRef = useRef(0);
  const pausedRef = useRef(false);

  const speeds: Record<string, number> = { fast: 55, normal: 38, slow: 25 };
  const pxPerSec = speeds[speed];
  const gap = 16;
  const singleSetWidth = children.length * (itemWidth + gap);

  // Sync ref with state for animation loop
  useEffect(() => { pausedRef.current = isPaused; }, [isPaused]);

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

  // Triple duplicate for seamless loop
  const tripled = [...children, ...children, ...children];

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setTimeout(() => setIsPaused(false), 3500)}
    >
      {/* Premium edge masks — narrow translucent blur instead of solid black */}
      <div
        className="absolute left-0 top-0 bottom-0 w-6 sm:w-16 z-20 pointer-events-none"
        style={{
          background: `linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background) / 0.5) 50%, transparent 100%)`,
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-6 sm:w-16 z-20 pointer-events-none"
        style={{
          background: `linear-gradient(to left, hsl(var(--background)) 0%, hsl(var(--background) / 0.5) 50%, transparent 100%)`,
        }}
      />
      {/* Subtle edge accent lines */}
      <div className="absolute left-0 top-[10%] bottom-[10%] w-[1px] z-20 pointer-events-none"
        style={{ background: `linear-gradient(180deg, transparent, ${accentColor}20, transparent)` }} />
      <div className="absolute right-0 top-[10%] bottom-[10%] w-[1px] z-20 pointer-events-none"
        style={{ background: `linear-gradient(180deg, transparent, ${accentColor}20, transparent)` }} />

      {/* Scrolling track */}
      <div className={`overflow-hidden ${fullWidth ? "" : "-mx-4 sm:mx-0"}`}>
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ gap: `${gap}px`, padding: "12px 0" }}
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

      {/* Floating glassmorphism controls */}
      {showControls && (
        <div className="flex justify-center mt-5">
          <div
            className="inline-flex items-center gap-1 p-1 rounded-full backdrop-blur-2xl border"
            style={{
              background: `linear-gradient(135deg, hsl(var(--background) / 0.8), hsl(var(--background) / 0.6))`,
              borderColor: `${accentColor}15`,
              boxShadow: `0 8px 32px hsl(var(--background) / 0.5), 0 0 0 1px ${accentColor}08`,
            }}
          >
            <button
              onClick={() => jump("left")}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90"
              style={{ color: accentColor }}
              aria-label="Precedente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90"
              style={{
                background: isPaused ? `${accentColor}15` : "transparent",
                color: accentColor,
              }}
              aria-label={isPaused ? "Play" : "Pause"}
            >
              {isPaused ? (
                <Play className="w-3 h-3 ml-0.5" />
              ) : (
                <Pause className="w-3 h-3" />
              )}
            </button>

            <button
              onClick={() => jump("right")}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90"
              style={{ color: accentColor }}
              aria-label="Successivo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
