import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";

gsap.registerPlugin(ScrollTrigger);

const MOCKUPS = [
  { src: SECTOR_MOCKUP_IMAGES.food?.[0], label: "Food", glow: "rgba(251,191,36,0.55)" },
  { src: SECTOR_MOCKUP_IMAGES.beauty?.[0], label: "Beauty", glow: "rgba(236,72,153,0.55)" },
  { src: SECTOR_MOCKUP_IMAGES.ncc?.[0], label: "Luxury", glow: "rgba(34,211,238,0.55)" },
].filter((m) => Boolean(m.src)) as { src: string; label: string; glow: string }[];

const SIGNALS = ["Lead", "Booking", "CRM", "WhatsApp", "Marketing", "Pagamenti", "Staff", "Recensioni"];

export default function JungleParallax() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context((self) => {
      const q = self.selector!;
      gsap.set(q("[data-jungle-word], [data-jungle-phone], [data-signal]"), { opacity: 1, clearProps: "transform" });

      if (reduceMotion) return;

      gsap.to(q("[data-layer='back']"), {
        yPercent: isMobile ? -8 : -18,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 },
      });
      gsap.to(q("[data-layer='mid']"), {
        yPercent: isMobile ? -18 : -42,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.9 },
      });
      gsap.to(q("[data-layer='front']"), {
        yPercent: isMobile ? -28 : -70,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.65 },
      });

      gsap.from(q("[data-jungle-word]"), {
        y: 54,
        opacity: 0,
        rotateX: -30,
        filter: "blur(10px)",
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: { trigger: q("[data-jungle-title]")[0], start: "top 78%" },
      });

      gsap.from(q("[data-jungle-phone]"), {
        y: isMobile ? 52 : 90,
        x: (i) => (isMobile ? 0 : [-120, 0, 120][i % 3]),
        rotateY: (i) => (isMobile ? 0 : [-22, 0, 22][i % 3]),
        opacity: 0,
        scale: 0.86,
        duration: 1,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: q("[data-jungle-stage]")[0], start: "top 70%" },
      });

      gsap.from(q("[data-signal]"), {
        y: 24,
        opacity: 0,
        scale: 0.88,
        stagger: 0.035,
        duration: 0.55,
        ease: "power3.out",
        scrollTrigger: { trigger: q("[data-signal-grid]")[0], start: "top 86%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative min-h-[118svh] overflow-hidden px-4 py-24 sm:px-6 sm:py-32" style={{ perspective: "1400px" }}>
      <div data-layer="back" className="pointer-events-none absolute inset-0 -z-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_28%_18%,rgba(34,211,238,0.2),transparent_52%),radial-gradient(ellipse_at_82%_70%,rgba(74,222,128,0.16),transparent_58%),linear-gradient(180deg,rgba(4,9,17,0),rgba(4,18,16,0.62),rgba(5,8,19,0))]" />
      </div>

      <div data-layer="mid" className="pointer-events-none absolute inset-0 -z-20 opacity-80">
        {Array.from({ length: 22 }).map((_, i) => (
          <span
            key={i}
            className="absolute block rounded-full border border-white/10 bg-white/[0.025]"
            style={{
              left: `${(i * 47) % 100}%`,
              top: `${(i * 29) % 100}%`,
              width: 34 + (i % 5) * 18,
              height: 180 + (i % 4) * 54,
              transform: `rotate(${(i * 19) % 70 - 35}deg)`,
              boxShadow: i % 3 === 0 ? "0 0 36px rgba(34,211,238,0.18)" : "0 0 28px rgba(74,222,128,0.12)",
            }}
          />
        ))}
      </div>

      <div data-layer="front" className="pointer-events-none absolute inset-0 z-20">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/70"
            style={{
              left: `${(i * 71) % 100}%`,
              top: `${(i * 43) % 100}%`,
              boxShadow: i % 2 ? "0 0 14px rgba(34,211,238,0.95)" : "0 0 14px rgba(74,222,128,0.95)",
              opacity: 0.3 + (i % 4) * 0.12,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <div>
          <div className="mb-5 text-[10px] font-bold uppercase tracking-[4px] text-[#4ade80] sm:text-[11px]">02 · COSA FACCIAMO</div>
          <h2 data-jungle-title className="font-heading font-black uppercase leading-[0.9] tracking-normal text-white" style={{ fontSize: "clamp(2.6rem, 9vw, 7.4rem)", textShadow: "0 4px 34px rgba(0,0,0,0.72)" }}>
            <span className="block overflow-hidden"><span data-jungle-word className="inline-block">Un unico</span></span>
            <span className="block overflow-hidden"><span data-jungle-word className="inline-block bg-gradient-to-r from-[#4ade80] via-[#22d3ee] to-[#a78bfa] bg-clip-text text-transparent">sistema vivo.</span></span>
          </h2>
          <p className="mt-7 max-w-[620px] text-[14px] leading-[1.85] text-white/72 sm:text-[16px]" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.75)" }}>
            Sostituiamo i 10 strumenti scollegati che usi oggi con una piattaforma sola: sito, gestionale, CRM, WhatsApp, marketing, pagamenti, staff e recensioni — tutto orchestrato dalla nostra AI, tutto misurabile in tempo reale.
          </p>

          <div data-signal-grid className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:max-w-[560px]">
            {SIGNALS.map((s, i) => (
              <div key={s} data-signal className="min-h-11 rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-[10px] font-bold uppercase tracking-[2px] text-white/72 shadow-[0_16px_42px_rgba(0,0,0,0.22)]">
                <span className="mr-2 text-[#22d3ee]">0{i + 1}</span>{s}
              </div>
            ))}
          </div>
        </div>

        <div data-jungle-stage className="relative min-h-[560px] overflow-visible sm:min-h-[650px]" style={{ transformStyle: "preserve-3d" }}>
          <div className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#22d3ee]/18 shadow-[0_0_80px_rgba(34,211,238,0.14)]" />
          <div className="absolute left-1/2 top-1/2 h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#4ade80]/18" />
          {MOCKUPS.map((m, i) => (
            <article
              key={m.src}
              data-jungle-phone
              className="absolute top-1/2 overflow-hidden rounded-[2rem] border-[8px] border-black bg-black shadow-2xl"
              style={{
                left: `${[18, 50, 82][i]}%`,
                width: i === 1 ? "min(220px, 48vw)" : "min(172px, 38vw)",
                aspectRatio: "9/19.5",
                transform: `translate(-50%, -50%) rotate(${[-8, 0, 8][i]}deg)`,
                zIndex: i === 1 ? 3 : 2,
                boxShadow: `0 34px 90px -24px ${m.glow}`,
              }}
            >
              <img src={m.src} alt={`Mockup Empire ${m.label}`} className="h-full w-full object-cover" loading="lazy" draggable={false} />
              <div className="absolute inset-0 bg-gradient-to-b from-white/12 via-transparent to-black/45" />
              <div className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/70 px-3 py-1 text-[9px] font-bold uppercase tracking-[2px] text-white/80">
                {m.label}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
