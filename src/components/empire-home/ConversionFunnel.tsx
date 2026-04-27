import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { n: "01", title: "Diagnosi", text: "Mappiamo vendite, operazioni e colli di bottiglia in una dashboard unica.", c: "#22d3ee" },
  { n: "02", title: "Demo su misura", text: "Mostriamo al cliente sito, mockup e automazioni già nel suo settore.", c: "#4ade80" },
  { n: "03", title: "Attivazione", text: "Setup guidato, funnel, agenti AI e metriche operative in produzione.", c: "#a78bfa" },
  { n: "04", title: "Scala", text: "Ottimizziamo campagne, processi e retention con cicli AI continui.", c: "#ec4899" },
];

export default function ConversionFunnel() {
  const root = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context((self) => {
      const q = self.selector!;
      gsap.from(q("[data-funnel-title] .word"), {
        y: 90,
        opacity: 0,
        rotateX: -55,
        stagger: 0.06,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 78%" },
      });

      gsap.fromTo(q("[data-funnel-line]"),
        { scaleY: 0, transformOrigin: "top" },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 35%", scrub: 1 } }
      );

      gsap.from(q("[data-funnel-step]"), {
        x: (i) => isMobile ? 0 : (i % 2 ? 140 : -140),
        y: isMobile ? 60 : 30,
        opacity: 0,
        scale: 0.9,
        rotate: (i) => isMobile ? 0 : (i % 2 ? 4 : -4),
        duration: 0.9,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: q("[data-funnel-steps]")[0], start: "top 78%" },
      });

      gsap.to(q("[data-funnel-orbit]"), {
        rotate: 360,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.4 },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden px-4 py-24 sm:px-5 sm:py-32">
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 65% 45% at 50% 35%, rgba(74,222,128,0.16), transparent 62%), radial-gradient(ellipse 46% 40% at 18% 72%, rgba(34,211,238,0.14), transparent 64%), linear-gradient(180deg, transparent, rgba(5,8,19,0.82), transparent)" }} />
      <div data-funnel-orbit className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

      <div className="relative mx-auto max-w-[1180px]">
        <div className="mx-auto mb-14 max-w-[780px] text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[3px] text-white/70">
            Funnel · dalla preview al contratto
          </div>
          <h2 data-funnel-title className="font-heading text-[clamp(2.2rem,6.2vw,5.4rem)] font-black uppercase leading-[0.9] text-white">
            <span className="inline-block overflow-hidden"><span className="word inline-block">Percorso</span></span>{" "}
            <span className="inline-block overflow-hidden"><span className="word inline-block">di</span></span>{" "}
            <span className="inline-block overflow-hidden"><span className="word inline-block" style={{ background: "linear-gradient(90deg, #4ade80, #22d3ee, #a78bfa)", WebkitBackgroundClip: "text", color: "transparent" }}>conversione.</span></span>
          </h2>
          <p className="mx-auto mt-5 max-w-[620px] text-sm leading-7 text-white/60 sm:text-base">
            Home, demo, mockup, chiamata e onboarding lavorano come un unico funnel: meno attrito, più fiducia, decisione più veloce.
          </p>
        </div>

        <div data-funnel-steps className="relative grid gap-4 md:grid-cols-2 md:gap-x-20 md:gap-y-8">
          <div data-funnel-line className="absolute left-1/2 top-2 hidden h-[calc(100%-1rem)] w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#22d3ee] via-[#4ade80] to-[#ec4899] md:block" />
          {STEPS.map((step, i) => (
            <article key={step.n} data-funnel-step className={`relative rounded-2xl border border-white/10 bg-white/[0.035] p-5 ${i % 2 ? "md:mt-24" : ""}`} style={{ boxShadow: `0 24px 70px -45px ${step.c}` }}>
              <div className="mb-8 flex items-center justify-between">
                <span className="font-mono text-xs font-bold tracking-[3px]" style={{ color: step.c }}>{step.n}</span>
                <span className="h-3 w-3 rounded-full" style={{ background: step.c, boxShadow: `0 0 22px ${step.c}` }} />
              </div>
              <h3 className="font-heading text-2xl font-black uppercase text-white sm:text-3xl">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/58">{step.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button onClick={() => navigate("/demo")} className="rounded-full px-7 py-4 text-xs font-black uppercase tracking-[2px] text-white" style={{ background: "linear-gradient(135deg, #22d3ee, #4ade80, #a78bfa)", boxShadow: "0 22px 58px -18px rgba(34,211,238,0.55)" }}>
            Esplora catalogo demo →
          </button>
          <button onClick={() => navigate("/auth")} className="rounded-full border border-white/15 bg-white/[0.04] px-7 py-4 text-xs font-bold uppercase tracking-[2px] text-white/75 transition-colors hover:bg-white/[0.08]">
            Avvia onboarding
          </button>
        </div>
      </div>
    </section>
  );
}
