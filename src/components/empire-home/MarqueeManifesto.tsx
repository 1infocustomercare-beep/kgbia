import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * MARQUEE MANIFESTO — testo gigante che scorre orizzontalmente legato allo scroll.
 */
export default function MarqueeManifesto() {
  const root = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current; const inn = inner.current;
    if (!el || !inn) return;
    const ctx = gsap.context(() => {
      gsap.to(inn, {
        xPercent: -50,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const text = "DOMINIO ALGORITMICO · SCALABILITÀ INFINITA · AUTOMAZIONE ASSOLUTA · SINCRONIZZAZIONE NEURALE · ";

  return (
    <section ref={root} className="relative overflow-hidden py-24">
      <div ref={inner} className="flex whitespace-nowrap will-change-transform">
        <span className="font-heading text-[clamp(4rem,14vw,12rem)] font-black uppercase leading-none tracking-[-0.05em] text-transparent" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.35)" }}>
          {text.repeat(4)}
        </span>
      </div>
    </section>
  );
}
