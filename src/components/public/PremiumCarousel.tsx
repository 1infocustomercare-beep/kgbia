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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const animRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const speeds: Record<string, number> = { fast: 80, normal: 50, slow: 35 };
  const pxPerSec = speeds[speed];

  const totalWidth = children.length * (itemWidth + 16);

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
      const shift = itemWidth + 16;
      const next = dir === "right" ? prev + shift : prev - shift;
      if (next < 0) return totalWidth + next;
      if (next >= totalWidth) return next - totalWidth;
      return next;
    });
  };

  // Duplicate children for seamless loop
  const duplicated = [...children, ...children];

  return (
    <div className={`relative group ${className}`}>
      {/* Gradient fades */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }} />

      {/* Track */}
      <div className={`overflow-hidden ${fullWidth ? "" : "-mx-5 sm:mx-0"}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setTimeout(() => setIsPaused(false), 3000)}>
        <div
          ref={scrollRef}
          className="flex py-3 will-change-transform"
          style={{ transform: `translateX(-${scrollPos}px)` }}>
          {duplicated.map((child, i) => (
            <div key={i} className="flex-shrink-0 px-2" style={{ width: itemWidth }}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex items-center justify-center gap-3 mt-5">
          <button
            onClick={() => scroll("left")}
            className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              borderColor: `${accentColor}30`,
              background: `${accentColor}08`,
              color: accentColor,
            }}
            aria-label="Precedente">
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              borderColor: `${accentColor}30`,
              background: isPaused ? `${accentColor}20` : `${accentColor}08`,
              color: accentColor,
            }}
            aria-label={isPaused ? "Riproduci" : "Pausa"}>
            {isPaused ? <Play className="w-3.5 h-3.5 ml-0.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => scroll("right")}
            className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              borderColor: `${accentColor}30`,
              background: `${accentColor}08`,
              color: accentColor,
            }}
            aria-label="Successivo">
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Progress dots */}
          <div className="hidden sm:flex items-center gap-1.5 ml-3">
            {Array.from({ length: Math.min(children.length, 8) }).map((_, i) => {
              const segmentWidth = totalWidth / Math.min(children.length, 8);
              const isActive = Math.floor(scrollPos / segmentWidth) % Math.min(children.length, 8) === i;
              return (
                <div key={i} className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: isActive ? 20 : 6,
                    background: isActive ? accentColor : `${accentColor}25`,
                  }} />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
