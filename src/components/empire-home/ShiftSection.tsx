import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * THE SHIFT — passaggio dal caos manuale all'automazione Empire.
 * Pin + scrub: la parte "CAOS" si sgretola, la parte "EMPIRE" si compone.
 */
export default function ShiftSection() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=160%",
          pin: true,
          scrub: 1,
        },
      });

      tl.to("[data-shift-chaos]", { opacity: 0, scale: 0.7, filter: "blur(40px)", rotate: -8, duration: 1 }, 0)
        .to("[data-shift-chaos] .frag", { x: () => gsap.utils.random(-600, 600), y: () => gsap.utils.random(-300, 300), opacity: 0, duration: 1 }, 0)
        .fromTo("[data-shift-line]", { scaleX: 0 }, { scaleX: 1, duration: 0.6 }, 0.4)
        .fromTo("[data-shift-empire]", { opacity: 0, scale: 1.4, filter: "blur(30px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1 }, 0.6)
        .fromTo("[data-shift-empire] .word", { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.6 }, 0.7)
        .fromTo("[data-shift-stat]", { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 }, 1.0);
    }, root);
    return () => ctx.revert();
  }, []);

  const chaos = ["EMAIL", "EXCEL", "WHATSAPP", "FATTURE", "STAFF", "ORDINI", "CRM", "REPORT", "CALL", "DM", "POST", "BOOKING"];

  return (
    <section ref={root} className="relative h-screen overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #050505 0%, #0a0518 50%, #050505 100%)" }} />

      <div className="relative z-10 flex h-full items-center justify-center px-5">
        {/* CHAOS layer */}
        <div data-shift-chaos className="absolute inset-0 grid place-items-center">
          <div className="relative flex flex-wrap items-center justify-center gap-3 sm:gap-5 max-w-[900px]">
            {chaos.map((w, i) => (
              <span
                key={i}
                className="frag inline-block rounded-md border border-red-500/30 bg-red-500/5 px-3 py-1.5 font-mono text-[11px] sm:text-sm text-red-300/80"
                style={{ transform: `rotate(${(i * 17) % 30 - 15}deg)` }}
              >
                {w}
              </span>
            ))}
          </div>
          <div className="absolute bottom-[18%] text-center">
            <div className="font-heading text-[clamp(2rem,5vw,3.4rem)] font-black uppercase tracking-tight text-white/80">Caos manuale</div>
            <div className="mt-2 text-xs uppercase tracking-[3px] text-red-300/70">14 strumenti scollegati · 60% errori umani</div>
          </div>
        </div>

        {/* DIVIDER LINE */}
        <div data-shift-line className="absolute left-1/2 top-1/2 z-20 h-[2px] w-[80%] origin-left -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#7eb7be] to-transparent" />

        {/* EMPIRE layer */}
        <div data-shift-empire className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#7eb7be]/40 bg-[#7eb7be]/5 px-3 py-1 text-[10px] font-bold tracking-[3px] text-[#7eb7be]">
              EMPIRE PROTOCOL
            </div>
            <h2 className="font-heading font-black uppercase tracking-[-0.04em]" style={{ fontSize: "clamp(2.4rem, 8vw, 7rem)", lineHeight: 0.9 }}>
              <span className="word inline-block bg-gradient-to-r from-[#7eb7be] via-[#a78bfa] to-[#ec4899] bg-clip-text text-transparent">Sincronizzazione</span>{" "}
              <span className="word inline-block text-white">neurale.</span>
            </h2>
            <div className="mx-auto mt-10 grid max-w-[820px] grid-cols-3 gap-4 sm:gap-8">
              {[
                { k: "98", l: "Agenti AI" },
                { k: "0", l: "Errori umani" },
                { k: "∞", l: "Scalabilità" },
              ].map((s, i) => (
                <div key={i} data-shift-stat className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md sm:p-6">
                  <div className="font-heading text-3xl font-black text-white sm:text-5xl">{s.k}</div>
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-[2px] text-white/50 sm:text-xs">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
