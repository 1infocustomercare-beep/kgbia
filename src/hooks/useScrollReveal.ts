import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Scroll-triggered reveal hook with stagger support.
 * Elements enter with fade-in + translateY(20px) using IntersectionObserver.
 *
 * Honours `prefers-reduced-motion`: if the user requests reduced motion the
 * element is reported visible immediately so no animation runs.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: { threshold?: number; rootMargin?: string; once?: boolean; delay?: number }
) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion preference — skip the observer dance.
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    let timeoutId: number | undefined;
    const delay = options?.delay ?? 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            timeoutId = window.setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }
          if (options?.once !== false) observer.unobserve(el);
        } else if (options?.once === false) {
          setIsVisible(false);
        }
      },
      {
        threshold: options?.threshold ?? 0.1,
        rootMargin: options?.rootMargin ?? "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [options?.threshold, options?.rootMargin, options?.once, options?.delay]);

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
