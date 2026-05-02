import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export default function MagneticCTA() {
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = root.current; const b = btn.current;
    if (!el || !b) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const titleEl = q("[data-cta-title]")[0];
      if (titleEl) {
        gsap.from(q("[data-cta-title] .word"), {
          y: 200, opacity: 0, duration: 1.1, stagger: 0.06, ease: "expo.out",
          scrollTrigger: { trigger: titleEl, start: "top 85%" },
        });
      }
      gsap.fromTo(q("[data-cta-bg]"),
        { scale: 0.7, opacity: 0 },
        { scale: 1.2, opacity: 1, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 } });

      // Magnetic only on desktop
      let onMove: ((e: MouseEvent) => void) | null = null;
      if (!isMobile) {
        onMove = (e: MouseEvent) => {
          const r = b.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const dist = Math.hypot(dx, dy);
          if (dist < 260) {
            const f = (260 - dist) / 260;
            gsap.to(b, { x: dx * 0.35 * f, y: dy * 0.35 * f, scale: 1 + 0.08 * f, duration: 0.4, ease: "power3.out" });
          } else {
            gsap.to(b, { x: 0, y: 0, scale: 1, duration: 0.6, ease: "elastic.out(1,0.4)" });
          }
        };
        window.addEventListener("mousemove", onMove, { passive: true });
      }
      self.add(() => { if (onMove) window.removeEventListener("mousemove", onMove); });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="contatti" className="relative min-h-[100svh] overflow-hidden px-4 py-24 sm:px-5 sm:py-32">
      <div data-cta-bg className="absolute inset-0 -z-10" style={{
        background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(167,139,250,0.25), transparent 70%), radial-gradient(ellipse 40% 40% at 70% 60%, rgba(236,72,153,0.18), transparent 70%), #050505",
      }} />

      <div className="mx-auto flex min-h-[80svh] max-w-[1100px] flex-col items-center justify-center text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-bold tracking-[3px] text-white/80 backdrop-blur-md sm:mb-6 sm:px-4 sm:text-[11px]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ec4899]" />
          INIZIA OGGI · LIVE IN 7 GIORNI
        </div>

        <h2 data-cta-title className="font-heading font-black uppercase leading-[0.88] tracking-[-0.05em]" style={{ fontSize: "clamp(2.4rem, 11vw, 9rem)" }}>
          <span className="inline-block overflow-hidden"><span className="word inline-block text-white">Il tuo</span></span>{" "}
          <span className="inline-block overflow-hidden"><span className="word inline-block text-white">business</span></span>{" "}
          <span className="inline-block overflow-hidden"><span className="word inline-block text-white">merita</span></span>
          <br />
          <span className="inline-block overflow-hidden"><span className="word inline-block bg-gradient-to-r from-[#22d3ee] via-[#a78bfa] to-[#ec4899] bg-clip-text text-transparent">di scalare.</span></span>
        </h2>

        <p className="mx-auto mt-7 max-w-[600px] text-[14px] leading-[1.85] text-white/65 sm:mt-8 sm:text-[15px]">
          Prenota una demo gratuita di 20 minuti: ti mostriamo dal vivo come Empire può trasformare il tuo settore. Senza impegno, senza carta, senza fuffa.
        </p>

        <button
          ref={btn}
          onClick={() => navigate("/demo")}
          className="group relative mt-10 w-full max-w-[420px] overflow-hidden rounded-full px-10 py-5 text-sm font-extrabold uppercase tracking-[2px] text-white sm:mt-12 sm:w-auto sm:max-w-none sm:px-14 sm:py-6 sm:text-base"
          style={{
            background: "linear-gradient(135deg, #22d3ee, #a78bfa, #ec4899)",
            boxShadow: "0 40px 100px -20px rgba(167,139,250,0.6), 0 0 0 1px rgba(255,255,255,0.1) inset",
          }}
        >
          <span className="relative z-10">Prenota la tua demo gratuita →</span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        </button>

        <p className="mt-5 text-[10px] uppercase tracking-[2px] text-white/40 sm:mt-6 sm:text-[11px]">Garanzia soddisfatti 90 giorni · Nessuna carta richiesta · Live in 7 giorni</p>
      </div>
    </section>
  );
}
