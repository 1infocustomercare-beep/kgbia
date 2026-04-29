import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * JUNGLE URBANA — multi-layer parallax 3D depth
 * Ispirato a motionsites.ai "Giungla Urbana": strati con velocità diverse,
 * volumetric light + caratteri che emergono dal sottobosco digitale.
 */
export default function JungleParallax() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      // ogni layer scrolla a velocità diversa = depth fittizia
      gsap.to(q("[data-layer='1']"), {
        yPercent: -10, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 },
      });
      gsap.to(q("[data-layer='2']"), {
        yPercent: -25, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
      });
      gsap.to(q("[data-layer='3']"), {
        yPercent: -45, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 },
      });
      gsap.to(q("[data-layer='4']"), {
        yPercent: -70, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
      });
      // titolo che si compone parola per parola dal "sottobosco"
      gsap.from(q("[data-jungle-word]"), {
        yPercent: 120, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.1,
        scrollTrigger: { trigger: q("[data-jungle-title]")[0], start: "top 80%" },
      });
      // card business che emergono dalle foglie
      gsap.from(q("[data-jungle-card]"), {
        y: 60, opacity: 0, scale: 0.92, duration: 0.9, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: q("[data-jungle-grid]")[0], start: "top 75%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative min-h-[110vh] overflow-hidden py-24 sm:py-32" style={{ perspective: "1400px" }}>
      {/* LAYER 1 — sfondo profondo */}
      <div data-layer="1" className="pointer-events-none absolute inset-0 -z-30">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 30% 20%, rgba(34,211,238,0.18), transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(74,222,128,0.14), transparent 55%)",
        }} />
      </div>
      {/* LAYER 2 — foglie blur */}
      <div data-layer="2" className="pointer-events-none absolute inset-0 -z-20">
        {[
          { l: "5%", t: "10%", s: 240, c: "rgba(74,222,128,0.12)" },
          { l: "78%", t: "8%", s: 320, c: "rgba(34,211,238,0.10)" },
          { l: "60%", t: "55%", s: 280, c: "rgba(167,139,250,0.12)" },
          { l: "10%", t: "70%", s: 360, c: "rgba(74,222,128,0.10)" },
        ].map((b, i) => (
          <div key={i} className="absolute rounded-full" style={{
            left: b.l, top: b.t, width: b.s, height: b.s,
            background: `radial-gradient(circle, ${b.c}, transparent 65%)`,
            filter: "blur(40px)",
          }} />
        ))}
      </div>
      {/* LAYER 3 — geometrie fini */}
      <div data-layer="3" className="pointer-events-none absolute inset-0 -z-10">
        <svg className="absolute left-[8%] top-[15%] h-40 w-40 opacity-30 sm:h-56 sm:w-56" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="48" stroke="#22d3ee" strokeWidth="0.4" />
          <circle cx="50" cy="50" r="36" stroke="#22d3ee" strokeWidth="0.3" />
          <circle cx="50" cy="50" r="24" stroke="#22d3ee" strokeWidth="0.25" />
        </svg>
        <svg className="absolute right-[5%] bottom-[10%] h-32 w-32 rotate-12 opacity-30 sm:h-48 sm:w-48" viewBox="0 0 100 100" fill="none">
          <rect x="2" y="2" width="96" height="96" stroke="#a78bfa" strokeWidth="0.4" />
          <rect x="14" y="14" width="72" height="72" stroke="#a78bfa" strokeWidth="0.3" />
        </svg>
        <div className="absolute left-1/2 top-[40%] h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#4ade80]/40 to-transparent" />
      </div>
      {/* LAYER 4 — particelle frontali */}
      <div data-layer="4" className="pointer-events-none absolute inset-0 z-10">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="absolute h-1 w-1 rounded-full bg-[#22d3ee]" style={{
            left: `${(i * 73) % 100}%`,
            top: `${(i * 41) % 100}%`,
            opacity: 0.5 + ((i % 5) * 0.08),
            boxShadow: "0 0 8px rgba(34,211,238,0.8)",
          }} />
        ))}
      </div>

      {/* CONTENUTO */}
      <div className="relative z-20 mx-auto max-w-[1180px] px-4 sm:px-6">
        <div className="mb-5 text-[10px] font-bold uppercase tracking-[4px] text-[#4ade80] sm:text-[11px]">
          02 · ECOSISTEMA NEURALE
        </div>
        <h2 data-jungle-title className="font-heading font-black uppercase leading-[0.88] tracking-[-0.04em]" style={{ fontSize: "clamp(2.4rem,9vw,7.5rem)" }}>
          <span className="inline-block overflow-hidden align-bottom"><span data-jungle-word className="inline-block text-white">Una</span></span>{" "}
          <span className="inline-block overflow-hidden align-bottom"><span data-jungle-word className="inline-block bg-gradient-to-r from-[#4ade80] via-[#22d3ee] to-[#a78bfa] bg-clip-text text-transparent">giungla</span></span>{" "}
          <span className="inline-block overflow-hidden align-bottom"><span data-jungle-word className="inline-block text-white">di</span></span>{" "}
          <span className="inline-block overflow-hidden align-bottom"><span data-jungle-word className="inline-block text-white">dati,</span></span>
          <br className="hidden sm:block" />
          <span className="inline-block overflow-hidden align-bottom"><span data-jungle-word className="inline-block text-white/70">un</span></span>{" "}
          <span className="inline-block overflow-hidden align-bottom"><span data-jungle-word className="inline-block bg-gradient-to-r from-[#a78bfa] to-[#22d3ee] bg-clip-text text-transparent">solo</span></span>{" "}
          <span className="inline-block overflow-hidden align-bottom"><span data-jungle-word className="inline-block text-white">cervello.</span></span>
        </h2>
        <p className="mt-7 max-w-[640px] text-[14px] leading-[1.8] text-white/65 sm:text-[16px]">
          Il tuo business è già un ecosistema. Empire lo trasforma in un organismo intelligente:
          ogni reparto comunica, ogni decisione è data-driven, ogni cliente è seguito da agenti AI 24/7.
        </p>

        <div data-jungle-grid className="mt-14 grid grid-cols-1 gap-4 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "Vendite Auto-Pilota", d: "Arianna chiama, qualifica, prenota. Tu chiudi.", c: "#22d3ee" },
            { t: "Marketing Generativo", d: "Post, video, ads create e pubblicate ogni giorno.", c: "#a78bfa" },
            { t: "Customer Care 24/7", d: "WhatsApp, mail, voce — risposte in <2 secondi.", c: "#4ade80" },
            { t: "Reputation Shield", d: "Recensioni intercettate prima che diventino 1 stella.", c: "#fbbf24" },
            { t: "Lead Scout AI", d: "Trova i tuoi prossimi 100 clienti mentre dormi.", c: "#ec4899" },
            { t: "Empire Brain", d: "Un comando vocale, l'intero business si muove.", c: "#22d3ee" },
          ].map((card, i) => (
            <div
              key={i}
              data-jungle-card
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-white/25 sm:p-6"
              style={{ boxShadow: `0 20px 60px -30px ${card.c}40` }}
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `radial-gradient(circle, ${card.c}55, transparent 65%)`, filter: "blur(20px)" }} />
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${card.c}25`, color: card.c }}>
                <span className="text-sm font-black">0{i + 1}</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-white sm:text-xl">{card.t}</h3>
              <p className="mt-2 text-[13px] leading-[1.6] text-white/60 sm:text-[14px]">{card.d}</p>
              <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[2px] text-white/45">
                <span>Attivo</span>
                <span style={{ color: card.c }}>● live</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
