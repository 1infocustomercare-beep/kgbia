import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ShiftSection() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=160%",
          pin: true,
          scrub: 1,
        },
      });

      tl.to(q("[data-shift-chaos]"), { opacity: 0, scale: 0.7, filter: "blur(40px)", rotate: -8, duration: 1 }, 0)
        .to(q("[data-shift-chaos] .frag"), { x: () => gsap.utils.random(-500, 500), y: () => gsap.utils.random(-260, 260), opacity: 0, duration: 1 }, 0)
        .fromTo(q("[data-shift-line]"), { scaleX: 0 }, { scaleX: 1, duration: 0.6 }, 0.4)
        .fromTo(q("[data-shift-empire]"), { opacity: 0, scale: 1.4, filter: "blur(30px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1 }, 0.6)
        .fromTo(q("[data-shift-empire] .word"), { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.6 }, 0.7)
        .fromTo(q("[data-shift-stat]"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 }, 1.0);
    }, root);
    return () => ctx.revert();
  }, []);

  const chaos = ["EMAIL", "EXCEL", "WHATSAPP", "FATTURE", "STAFF", "ORDINI", "CRM", "REPORT", "CALL", "DM", "POST", "BOOKING"];

  return (
    <section ref={root} className="relative h-screen overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #050505 0%, #0a0518 50%, #050505 100%)" }} />

      <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-5">
        <div data-shift-chaos className="absolute inset-0 grid place-items-center px-4">
          <div className="relative flex flex-wrap items-center justify-center gap-2 sm:gap-5 max-w-[900px]">
            {chaos.map((w, i) => (
              <span
                key={i}
                className="frag inline-block rounded-md border border-red-500/30 bg-red-500/5 px-2.5 py-1 font-mono text-[10px] sm:px-3 sm:py-1.5 sm:text-sm text-red-300/80"
                style={{ transform: `rotate(${(i * 17) % 30 - 15}deg)` }}
              >
                {w}
              </span>
            ))}
          </div>
          <div className="absolute bottom-[14%] text-center">
            <div className="font-heading text-[clamp(1.6rem,5vw,3.4rem)] font-black uppercase tracking-tight text-white/80">Caos manuale</div>
            <div className="mt-2 text-[10px] uppercase tracking-[3px] text-red-300/70 sm:text-xs">14 strumenti scollegati · 60% errori umani</div>
          </div>
        </div>

        <div data-shift-line className="absolute left-1/2 top-1/2 z-20 h-[2px] w-[80%] origin-left -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#22d3ee] to-transparent" />

        <div data-shift-empire className="absolute inset-0 grid place-items-center px-4">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#22d3ee]/40 bg-[#22d3ee]/5 px-3 py-1 text-[10px] font-bold tracking-[3px] text-[#22d3ee]">
              EMPIRE PROTOCOL
            </div>
            <h2 className="font-heading font-black uppercase tracking-[-0.04em]" style={{ fontSize: "clamp(2rem, 8vw, 7rem)", lineHeight: 0.9 }}>
              <span className="word inline-block bg-gradient-to-r from-[#22d3ee] via-[#a78bfa] to-[#ec4899] bg-clip-text text-transparent">Sincronizzazione</span>{" "}
              <span className="word inline-block text-white">neurale.</span>
            </h2>
            <div className="mx-auto mt-8 grid max-w-[820px] grid-cols-3 gap-3 sm:gap-8">
              {[
                { k: "98", l: "Agenti AI" },
                { k: "0", l: "Errori umani" },
                { k: "∞", l: "Scalabilità" },
              ].map((s, i) => (
                <div key={i} data-shift-stat className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-md sm:p-6">
                  <div className="font-heading text-2xl font-black text-white sm:text-5xl">{s.k}</div>
                  <div className="mt-1 text-[9px] font-semibold uppercase tracking-[2px] text-white/50 sm:text-xs">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
