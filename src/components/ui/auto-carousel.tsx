import React, { useState, useEffect, useRef, useCallback, Children } from "react";
import { cn } from "@/lib/utils";

interface AutoCarouselProps {
  children: React.ReactNode;
  interval?: number;
  className?: string;
  showDots?: boolean;
  autoPlay?: boolean;
  pauseOnHover?: boolean;
  itemClassName?: string;
}

/**
 * Touch-swipeable, auto-scrolling carousel with dots.
 * Pauses on hover. CSS translateX transitions for 60fps.
 */
export function AutoCarousel({
  children,
  interval = 4500,
  className,
  showDots = true,
  autoPlay = true,
  pauseOnHover = true,
  itemClassName,
}: AutoCarouselProps) {
  const items = Children.toArray(children);
  const count = items.length;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);

  const next = useCallback(() => setCurrent((p) => (p + 1) % count), [count]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + count) % count), [count]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || paused || count <= 1) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [autoPlay, paused, interval, next, count]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = () => {
    const diff = touchStart.current - touchEnd.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  };

  if (count === 0) return null;

  return (
    <div
      className={cn("relative overflow-hidden rounded-2xl", className)}
      onMouseEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setPaused(false) : undefined}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((child, i) => (
          <div key={i} className={cn("w-full flex-shrink-0", itemClassName)}>
            {child}
          </div>
        ))}
      </div>

      {showDots && count > 1 && (
        <div className="flex justify-center gap-1.5 mt-3 pb-1">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                i === current
                  ? "bg-primary w-5"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
