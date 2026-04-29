import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";

gsap.registerPlugin(ScrollTrigger);

/**
 * ORBIT 3D — i mockup orbitano attorno a un core neurale.
 * Ispirato a motionsites.ai "Portfolio 3D Orbit": rotazione scroll-driven,
 * tap su un pianeta = focus + zoom.
 */
export default function Orbit3D() {
  const root = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<number | null>(null);

  // 8 mockup reali presi da diversi settori
  const planets: { src: string; sector: string; tag: string }[] = (() => {
    const out: { src: string; sector: string; tag: string }[] = [];
    const order: [string, string][] = [
      ["food", "Ristorazione"],
      ["beauty", "Beauty & Spa"],
      ["ncc", "NCC Luxury"],
      ["fitness", "Fitness"],
      ["hospitality", "Hospitality"],
      ["retail", "Retail"],
      ["medical", "Medical"],
      ["events", "Eventi"],
    ];
    order.forEach(([key, label]) => {
      const arr = (SECTOR_MOCKUP_IMAGES as any)[key];
      if (arr && arr.length > 0) out.push({ src: arr[0], sector: key, tag: label });
    });
    return out.slice(0, 8);
  })();

  useEffect(() => {
    const el = root.current;
    const orb = orbitRef.current;
    if (!el || !orb) return;
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      // pin + rotate dell'intera orbita scroll-driven
      gsap.to(orb, {
        rotateZ: 360,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: true,
          pinSpacing: true,
        },
      });
      // entrata pianeti
      gsap.from(q("[data-planet]"), {
        scale: 0, opacity: 0, duration: 0.9, ease: "back.out(1.6)", stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 70%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative min-h-screen overflow-hidden py-16 sm:py-24">
      {/* core glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(34,211,238,0.20), rgba(167,139,250,0.10) 40%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1180px] px-4 sm:px-6">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[4px] text-[#a78bfa] sm:text-[11px]">
          04 · PORTFOLIO ORBITALE
        </div>
        <h2 className="font-heading font-black uppercase leading-[0.9] tracking-[-0.04em]" style={{ fontSize: "clamp(2rem,7vw,5.5rem)" }}>
          <span className="text-white">Otto settori,</span>{" "}
          <span className="bg-gradient-to-r from-[#22d3ee] via-[#a78bfa] to-[#ec4899] bg-clip-text text-transparent">una sola orbita.</span>
        </h2>
        <p className="mt-5 max-w-[600px] text-[14px] leading-[1.75] text-white/65 sm:text-[16px]">
          Scrolla per ruotare la galassia. Tocca un pianeta per scoprirne il sito reale.
        </p>
      </div>

      {/* ORBITA */}
      <div className="relative mt-10 flex h-[80vh] items-center justify-center" style={{ perspective: "1600px" }}>
        <div
          ref={orbitRef}
          className="relative"
          style={{
            width: "min(72vh, 90vw)",
            height: "min(72vh, 90vw)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* anelli */}
          <div className="absolute inset-[10%] rounded-full border border-white/8" />
          <div className="absolute inset-[22%] rounded-full border border-white/6" />
          <div className="absolute inset-[34%] rounded-full border border-[#22d3ee]/15" />
          {/* core */}
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-32 sm:w-32"
            style={{
              background: "radial-gradient(circle at 30% 30%, #22d3ee, #a78bfa 60%, #050813 100%)",
              boxShadow: "0 0 60px rgba(34,211,238,0.55), inset 0 0 30px rgba(255,255,255,0.2)",
              animation: "pulse 3.5s ease-in-out infinite",
            }}
          />

          {/* pianeti */}
          {planets.map((p, i) => {
            const angle = (i / planets.length) * Math.PI * 2;
            const radius = 42; // % dal centro
            const x = 50 + Math.cos(angle) * radius;
            const y = 50 + Math.sin(angle) * radius;
            const isFocus = focus === i;
            return (
              <button
                key={i}
                data-planet
                onClick={() => setFocus(isFocus ? null : i)}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: isFocus ? "30%" : "18%",
                  zIndex: isFocus ? 50 : 10,
                }}
              >
                <div
                  className="relative overflow-hidden rounded-[18px] border border-white/15 bg-black shadow-2xl transition-all duration-500 hover:scale-110"
                  style={{
                    aspectRatio: "9/19.5",
                    boxShadow: isFocus
                      ? "0 30px 80px -10px rgba(34,211,238,0.55)"
                      : "0 12px 30px -8px rgba(0,0,0,0.6)",
                    transform: `rotate(${-angle * (180 / Math.PI) + 90}deg)`,
                  }}
                >
                  <img
                    src={p.src}
                    alt={p.tag}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    style={{ transform: `rotate(${angle * (180 / Math.PI) - 90}deg)` }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.3"; }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-left">
                    <div className="text-[9px] font-bold uppercase tracking-[2px] text-[#22d3ee]">{p.sector}</div>
                    <div className="truncate text-[11px] font-semibold text-white">{p.tag}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-6 max-w-[1180px] px-4 text-center sm:px-6">
        <div className="text-[11px] uppercase tracking-[3px] text-white/45">
          ↕ scroll per ruotare · tap per espandere
        </div>
      </div>
    </section>
  );
}
