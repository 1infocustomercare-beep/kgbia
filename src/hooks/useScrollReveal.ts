import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Scroll-triggered reveal hook with stagger support.
 * Elements enter with fade-in + translateY(20px) using IntersectionObserver.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: { threshold?: number; rootMargin?: string; once?: boolean }
) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options?.once !== false) observer.unobserve(el);
        }
      },
      {
        threshold: options?.threshold ?? 0.1,
        rootMargin: options?.rootMargin ?? "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.threshold, options?.rootMargin, options?.once]);

  return { ref, isVisible };
}

/**
 * Animated counter from 0 to target value on scroll into view.
 */
export function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  const { ref, isVisible } = useScrollReveal<HTMLSpanElement>();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!isVisible || hasRun.current) return;
    hasRun.current = true;

    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isVisible, target, duration]);

  return { ref, value };
}

/**
 * CSS class string for scroll-reveal with stagger delay.
 * Apply to parent: "scroll-reveal-container"
 * Apply to children: getRevealClass(index)
 */
export function getStaggerDelay(index: number, baseDelay = 0.1): string {
  return `${index * baseDelay}s`;
}
