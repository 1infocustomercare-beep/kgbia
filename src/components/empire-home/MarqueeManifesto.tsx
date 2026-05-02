import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MarqueeManifesto() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context((self) => {
      const inner = self.selector!("[data-marquee-inner]")[0] as HTMLElement | undefined;
      if (!inner) return;
      gsap.to(inner, {
        xPercent: -50,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const text = "SITI CHE CONVERTONO · AGENTI AI 24/7 · CRM INTEGRATO · AUTOMAZIONI SU MISURA · ";

  return (
    <section ref={root} className="relative overflow-hidden py-20 sm:py-24">
      <div data-marquee-inner className="flex whitespace-nowrap will-change-transform">
        <span className="font-heading text-[clamp(3rem,14vw,12rem)] font-black uppercase leading-none tracking-[-0.05em] text-transparent" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.35)" }}>
          {text.repeat(4)}
        </span>
      </div>
    </section>
  );
}
