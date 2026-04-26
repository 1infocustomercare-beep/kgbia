import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * PARALLAX LAYERS — strati a velocità diverse + rotazione 3D scrubbed.
 * Stile "Awwwards depth".
 */
export default function ParallaxDepth() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-pl-back]", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
      });
      gsap.to("[data-pl-mid]", {
        yPercent: -55,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
      });
      gsap.to("[data-pl-front]", {
        yPercent: -90,
        rotateX: 15,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
      });
      gsap.from("[data-pl-title] .word", {
        y: 200, opacity: 0, rotateX: 90, duration: 1.1, stagger: 0.08, ease: "expo.out",
        scrollTrigger: { trigger: "[data-pl-title]", start: "top 80%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative min-h-[100vh] overflow-hidden py-32" style={{ perspective: "1200px" }}>
      <div data-pl-back className="absolute inset-0 -z-10" style={{
        background: "radial-gradient(ellipse 80% 50% at 30% 30%, rgba(126,183,190,0.18), transparent 60%), radial-gradient(ellipse 60% 50% at 70% 70%, rgba(167,139,250,0.18), transparent 60%)",
      }} />

      <div data-pl-mid className="pointer-events-none absolute inset-0 -z-[5]">
        <div className="absolute left-[10%] top-[20%] h-40 w-40 rounded-full border border-white/10" />
        <div className="absolute right-[15%] top-[10%] h-72 w-72 rounded-full border border-white/5" />
        <div className="absolute left-[40%] bottom-[20%] h-56 w-56 rotate-45 border border-white/10" />
        <div className="absolute right-[25%] bottom-[10%] h-32 w-32 rounded-full border border-[#a78bfa]/20" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1100px] px-5 text-center">
        <div className="mb-6 text-[11px] font-bold uppercase tracking-[3px] text-[#7eb7be]">03 · LA TRASFORMAZIONE</div>
        <h2 data-pl-title className="font-heading font-black uppercase leading-[0.9] tracking-[-0.045em]" style={{ fontSize: "clamp(2.6rem,8vw,7rem)" }}>
          <span className="inline-block overflow-hidden"><span className="word inline-block text-white">Efficienza</span></span>{" "}
          <span className="inline-block overflow-hidden"><span className="word inline-block bg-gradient-to-r from-[#7eb7be] via-[#a78bfa] to-[#ec4899] bg-clip-text text-transparent">algoritmica.</span></span>
        </h2>
        <p data-pl-front className="mx-auto mt-10 max-w-[640px] text-[16px] leading-[1.85] text-white/70">
          Il tuo business diventa un sistema operativo neurale. Ogni reparto, ogni canale, ogni dato — sincronizzati in un unico cervello.
          Il risultato non è incrementale: è <span className="text-white">esponenziale</span>.
        </p>

        <div data-pl-front className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { k: "−68%", l: "tempo operativo" },
            { k: "+340%", l: "lead qualificati" },
            { k: "+212%", l: "conversioni" },
            { k: "−94%", l: "errori" },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
              <div className="font-heading text-2xl font-black text-white sm:text-3xl">{s.k}</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[2px] text-white/55">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
