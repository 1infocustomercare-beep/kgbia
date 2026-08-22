import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let tickerAttached = false;

const lenisTicker = (time: number) => {
  lenis?.raf(time * 1000);
};

export function getLenis(): Lenis {
  if (lenis) return lenis;
  lenis = new Lenis({
    duration: 1.4,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
  });

  lenis.on("scroll", ScrollTrigger.update);

  if (!tickerAttached) {
    gsap.ticker.add(lenisTicker);
    tickerAttached = true;
  }
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/** Returns the active Lenis instance without creating one. */
export function peekLenis(): Lenis | null {
  return lenis;
}

export function destroyLenis() {
  lenis?.destroy();
  lenis = null;
  if (tickerAttached) {
    gsap.ticker.remove(lenisTicker);
    tickerAttached = false;
  }
}
