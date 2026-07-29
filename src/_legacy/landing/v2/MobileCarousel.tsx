import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode[];
  /** Autoplay interval in ms. 0 = disabled (manual swipe only). Default 5000. */
  autoplayMs?: number;
  /** Tailwind width class for each slide. Default w-[88%] (peek next card) */
  slideWidth?: string;
  /** Show pagination dots. Default true. */
  showDots?: boolean;
  /** Aria label for the carousel region */
  ariaLabel?: string;
};

/**
 * Premium mobile-only carousel: native scroll-snap + autoplay + dots + swipe.
 * Renders ONLY on mobile (<md). Parent should hide its grid on mobile and
 * render this in its place.
 */
export default function MobileCarousel({
  children,
  autoplayMs = 5000,
  slideWidth = "w-[86%]",
  showDots = true,
  ariaLabel = "Carosello contenuti",
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = children.length;

  // Track active index from scroll position
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const slideW = el.clientWidth * 0.86 + 12; // approx
        const idx = Math.round(el.scrollLeft / slideW);
        setActiveIndex(Math.max(0, Math.min(total - 1, idx)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [total]);

  // Pause autoplay during user touch interaction
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onStart = () => setPaused(true);
    const onEnd = () => {
      // small delay before resuming so user can settle
      window.setTimeout(() => setPaused(false), 2500);
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, []);

  // Autoplay
  useEffect(() => {
    if (!autoplayMs || paused || total < 2) return;
    const id = window.setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;
      // Skip if user not on this section (saves CPU, avoids snapping when off-screen)
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const next = (activeIndex + 1) % total;
      const child = el.children[next] as HTMLElement | undefined;
      if (child) {
        el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
      }
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [autoplayMs, paused, activeIndex, total]);

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (child) {
      el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
    }
  };

  return (
    <div className="relative" role="region" aria-label={ariaLabel}>
      <div
        ref={scrollerRef}
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollPaddingLeft: "1rem" }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            className={`${slideWidth} flex-shrink-0 snap-start`}
          >
            {child}
          </div>
        ))}
        {/* End padding so last card isn't flush */}
        <div className="w-2 flex-shrink-0" aria-hidden />
      </div>

      {showDots && total > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {children.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Vai alla slide ${i + 1}`}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === activeIndex ? 26 : 7,
                background:
                  i === activeIndex
                    ? "hsl(var(--gold))"
                    : "hsl(var(--foreground) / 0.22)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
