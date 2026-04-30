import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";

gsap.registerPlugin(ScrollTrigger);

/**
 * MockupShowcase — Sticky 3D scrub.
 * 5 iPhone reali si avvicinano, ruotano in 3D e si fermano sul piano focale
 * mentre lo scroll avanza. Effect: depth-of-field cinematografico.
 */

const SLIDES = [
  { sector: "Food", label: "Ristorazione Premium", img: SECTOR_MOCKUP_IMAGES.food?.[0], color: "#fbbf24" },
  { sector: "Beauty", label: "Beauty & Wellness", img: SECTOR_MOCKUP_IMAGES.beauty?.[0], color: "#ec4899" },
  { sector: "NCC", label: "Charter & Yacht", img: SECTOR_MOCKUP_IMAGES.ncc?.[0], color: "#22d3ee" },
  { sector: "Healthcare", label: "Salute & Cliniche", img: SECTOR_MOCKUP_IMAGES.healthcare?.[0], color: "#4ade80" },
  { sector: "Hospitality", label: "Hotel & Resort", img: SECTOR_MOCKUP_IMAGES.hospitality?.[0], color: "#a78bfa" },
].filter((s) => !!s.img);

export default function MockupShowcase() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const isMobile = window.matchMedia("(max-width: 899px)").matches;

    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const phones = q("[data-phone]") as HTMLElement[];
      const total = phones.length;
      if (!total) return;

      // Init: tutti dietro
      phones.forEach((p, i) => {
        gsap.set(p, {
          xPercent: isMobile ? 0 : -50,
          yPercent: isMobile ? 0 : -50,
          scale: isMobile ? 1 : 0.72 + i * 0.02,
          opacity: i === 0 ? 1 : 0.0,
          rotateY: isMobile ? 0 : -18,
          rotateZ: 0,
          z: isMobile ? 0 : -i * 160,
          transformOrigin: "center center",
        });
      });

      // Title reveal
      gsap.from(q("[data-mks-title] .word"), {
        y: 80,
        opacity: 0,
        rotateX: -24,
        stagger: 0.06,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 75%" },
      });

      if (isMobile) {
        phones.forEach((phone, i) => {
          gsap.fromTo(phone,
            { y: 48, opacity: 0, scale: 0.92, filter: "blur(8px)" },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.8,
              ease: "expo.out",
              scrollTrigger: { trigger: phone, start: "top 84%", onEnter: () => setActive(i) },
            }
          );
        });
        return;
      }

      // Pinned scrub timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${window.innerHeight * (total + 1)}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (st) => {
            const idx = Math.min(total - 1, Math.floor(st.progress * total));
            setActive(idx);
          },
        },
      });

      phones.forEach((phone, i) => {
        const next = phones[i + 1];
        // Phone i arriva al centro
        tl.to(
          phone,
          { opacity: 1, scale: 1, rotateY: 0, rotateZ: 0, z: 0, filter: "blur(0px)", duration: 1, ease: "power2.out" },
          i
        );
        if (next) {
          // Phone i esce in avanti, next entra
          tl.to(
            phone,
            { opacity: 0, scale: 1.18, rotateY: 12, rotateZ: 0, z: 160, filter: "blur(12px)", duration: 1, ease: "power2.in" },
            i + 0.7
          );
        }
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="mockups"
      className="relative bg-gradient-to-b from-transparent via-background/80 to-transparent"
      style={{ perspective: "1400px" }}
    >
      <div className="relative min-h-[100svh] w-full overflow-hidden lg:h-[100svh]">
        {/* Aurora background */}
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.18), hsl(var(--gold) / 0.10) 35%, transparent 65%)", filter: "blur(80px)" }}
          />
        </div>

        {/* Grid floor */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
          style={{
            backgroundImage: "linear-gradient(hsl(var(--empire-violet) / 0.10) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--empire-violet) / 0.10) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            transform: "perspective(800px) rotateX(60deg)",
            transformOrigin: "top",
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />

        {/* Header */}
        <div className="absolute left-0 right-0 top-0 z-[5] px-5 pt-20 sm:pt-28">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[3px] text-[#22d3ee] backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22d3ee]" />
              577 mockup reali · in produzione
            </div>
            <h2 data-mks-title className="font-heading text-[clamp(2rem,5.5vw,4.5rem)] font-black uppercase leading-[0.95] tracking-[-0.04em] text-white">
              <span className="inline-block overflow-hidden align-bottom"><span className="word inline-block">Ogni</span></span>{" "}
              <span className="inline-block overflow-hidden align-bottom"><span className="word inline-block">settore.</span></span>{" "}
              <span className="inline-block overflow-hidden align-bottom"><span className="word inline-block bg-gradient-to-r from-[#22d3ee] via-[#4ade80] to-[#a78bfa] bg-clip-text text-transparent">Stessa precisione.</span></span>
            </h2>
          </div>
        </div>

        {/* Phones stack */}
        <div className="relative flex min-h-[760px] flex-col items-center justify-start gap-6 px-4 pt-56 lg:absolute lg:inset-0 lg:min-h-0 lg:flex-row lg:justify-center lg:gap-0 lg:px-0 lg:pt-0">
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              data-phone
              className="relative z-[3] lg:absolute lg:left-1/2 lg:top-1/2"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="relative overflow-hidden rounded-[42px] border-[10px] border-black bg-black shadow-2xl"
                style={{
                  width: "min(280px, 70vw)",
                  height: "min(580px, 80vh)",
                  boxShadow: `0 60px 140px -30px ${slide.color}66, 0 0 0 1px rgba(255,255,255,0.05)`,
                }}
              >
                {/* Notch */}
                <div className="absolute left-1/2 top-0 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-black" />
                <img
                  src={slide.img}
                  alt={slide.label}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
                <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(80% 60% at 50% 0%, ${slide.color}22, transparent 60%)` }} />
              </div>

              {/* Reflection */}
              <div
                className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 opacity-30"
                style={{
                  width: "min(280px, 70vw)",
                  height: "120px",
                  background: `linear-gradient(180deg, ${slide.color}33, transparent)`,
                  transform: "scaleY(-0.6) translateY(-6px)",
                  transformOrigin: "top",
                  filter: "blur(8px)",
                  maskImage: "linear-gradient(to bottom, black, transparent)",
                  WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
                }}
              />
            </div>
          ))}
        </div>

        {/* Active info */}
        <div className="absolute bottom-10 left-1/2 z-[5] w-[min(620px,92vw)] -translate-x-1/2 text-center">
          <div className="mb-2 font-mono text-[10px] tracking-[4px] text-white/40">
            {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </div>
          <div
            className="font-heading text-2xl font-black uppercase tracking-[-0.02em] text-white transition-all duration-500"
            style={{ textShadow: `0 0 30px ${SLIDES[active].color}aa` }}
          >
            {SLIDES[active].sector}
          </div>
          <div className="mt-1 text-xs text-white/55">{SLIDES[active].label}</div>
          {/* Progress dots */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {SLIDES.map((s, i) => (
              <span
                key={i}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: i === active ? 24 : 8,
                  background: i === active ? s.color : "rgba(255,255,255,0.18)",
                  boxShadow: i === active ? `0 0 12px ${s.color}` : "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
