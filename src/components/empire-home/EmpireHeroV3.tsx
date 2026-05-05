import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Sparkles } from "lucide-react";
import { createMockupPool } from "@/lib/mockup-pool";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Empire Hero V3 — fusione di:
 *  1) CinematicHero skeumorfo (card 3D, mockup iPhone realistico, mouse parallax)
 *  2) HeroScrub (titolo top/bottom che si separano, card che fa zoom-in immersivo
 *     sincronizzato con lo scroll, usando layout sticky invece di pin GSAP)
 *
 * Niente sequenza frame PNG: usiamo i mockup iPhone REALI dal pool globale,
 * sincronizzati allo scroll come "carosello cinematografico".
 */

const heroPool = createMockupPool();
const HERO_PHONES = heroPool.images(8); // 8 mockup unici per il rolodex scroll

const PIN_VH_MULTIPLE = 2.6;

export default function EmpireHeroV3() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleTopRef = useRef<HTMLHeadingElement>(null);
  const titleBottomRef = useRef<HTMLHeadingElement>(null);
  const phoneStackRef = useRef<HTMLDivElement>(null);
  const phoneScreensRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const [activePhone, setActivePhone] = useState(0);
  const navigate = useNavigate();

  // Mouse parallax + sheen on the cinematic card
  useEffect(() => {
    const card = cardRef.current;
    const phones = phoneStackRef.current;
    const sheen = sheenRef.current;
    if (!card) return;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 1.5) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        if (sheen) {
          sheen.style.setProperty("--mouse-x", `${mx}px`);
          sheen.style.setProperty("--mouse-y", `${my}px`);
        }
        const xv = (e.clientX / window.innerWidth - 0.5) * 2;
        const yv = (e.clientY / window.innerHeight - 0.5) * 2;
        if (phones) {
          phones.style.transform = `perspective(1400px) rotateY(${xv * 8}deg) rotateX(${-yv * 6}deg)`;
        }
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Scroll-driven choreography (sticky-based, no GSAP pin → niente conflitti con Lenis)
  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const tTop = titleTopRef.current;
    const tBot = titleBottomRef.current;
    const cta = ctaRef.current;
    const screens = phoneScreensRef.current;
    if (!section || !card || !tTop || !tBot || !cta) return;

    const ctx = gsap.context(() => {
      const isMobile = () => window.innerWidth < 768;
      const startScale = () => (isMobile() ? 0.85 : 0.7);
      const immerseScale = () => (isMobile() ? 1.35 : 1.5);

      gsap.set(card, { scale: startScale(), transformOrigin: "50% 50%" });
      gsap.set(cta, { autoAlpha: 0, y: 30 });

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // sincronizza il "rolodex" dei mockup col progress
            const p = self.progress;
            const mapped = gsap.utils.clamp(0, 1, (p - 0.18) / 0.55);
            const idx = Math.min(HERO_PHONES.length - 1, Math.floor(mapped * HERO_PHONES.length));
            setActivePhone(idx);
            if (screens) {
              screens.style.transform = `translateY(${-idx * 100}%)`;
            }
          },
        },
      });

      // Phase 1 — separazione titoli + zoom card
      master.to(card, { scale: 1, ease: "power2.out", duration: 0.18 }, 0);
      master.to(tTop, {
        x: () => (isMobile() ? "-65vw" : "-55vw"),
        letterSpacing: "0.02em",
        ease: "power2.inOut",
        duration: 0.18,
      }, 0);
      master.to(tBot, {
        x: () => (isMobile() ? "65vw" : "55vw"),
        letterSpacing: "0.02em",
        ease: "power2.inOut",
        duration: 0.18,
      }, 0);

      // Phase 2 — immersione totale
      master.to(card, { scale: immerseScale(), ease: "power2.in", duration: 0.55 }, 0.18);
      master.to(tTop, { opacity: 0, ease: "power1.in", duration: 0.25 }, 0.18);
      master.to(tBot, { opacity: 0, ease: "power1.in", duration: 0.25 }, 0.18);
      master.to(cta, { autoAlpha: 1, y: 0, ease: "expo.out", duration: 0.25 }, 0.55);

      // Phase 3 — pull-back & ritorno titoli
      master.to(card, { scale: startScale(), ease: "power3.inOut", duration: 0.22 }, 0.78);
      master.to(tTop, {
        x: 0, opacity: 1, letterSpacing: "-0.04em", ease: "power2.inOut", duration: 0.22,
      }, 0.78);
      master.to(tBot, {
        x: 0, opacity: 1, letterSpacing: "-0.04em", ease: "power2.inOut", duration: 0.22,
      }, 0.78);
      master.to(cta, { autoAlpha: 0, y: -20, ease: "power1.in", duration: 0.18 }, 0.78);

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const tallHeight = `${(PIN_VH_MULTIPLE + 1) * 100}vh`;

  return (
    <>
      <style>{`
        .empire-hero-card {
          background: linear-gradient(145deg, #162C6D 0%, #0A101D 100%);
          box-shadow:
            0 40px 100px -20px rgba(0,0,0,0.9),
            0 20px 40px -20px rgba(0,0,0,0.8),
            inset 0 1px 2px rgba(255,255,255,0.2),
            inset 0 -2px 4px rgba(0,0,0,0.8);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .empire-hero-sheen {
          position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
          background: radial-gradient(700px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.08) 0%, transparent 45%);
          mix-blend-mode: screen;
        }
        .empire-hero-iphone {
          background: #0a0a0a;
          box-shadow:
            inset 0 0 0 2px #3f3f46,
            inset 0 0 0 6px #000,
            0 30px 60px -10px rgba(0,0,0,0.85),
            0 12px 24px -6px rgba(0,0,0,0.7);
        }
        .empire-hero-grid {
          background-size: 60px 60px;
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
        }
        .empire-text-silver {
          background: linear-gradient(180deg, #FFFFFF 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter:
            drop-shadow(0 10px 25px rgba(0,0,0,0.5))
            drop-shadow(0 2px 4px rgba(0,0,0,0.4));
        }
        .empire-text-accent {
          background: linear-gradient(135deg, #22d3ee 0%, #a78bfa 50%, #f472b6 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 30px rgba(34,211,238,0.35));
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative w-full overflow-clip bg-[#05070d] text-white"
        style={{ height: tallHeight }}
        aria-label="Empire AI cinematic hero"
      >
        {/* Inner sticky stage */}
        <div className="sticky top-0 flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden">
          {/* Aurora background */}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
            <div
              className="absolute -left-1/4 top-0 h-[80vh] w-[80vh] rounded-full blur-[120px] opacity-50"
              style={{ background: "radial-gradient(circle, #22d3ee 0%, transparent 60%)" }}
            />
            <div
              className="absolute -right-1/4 bottom-0 h-[80vh] w-[80vh] rounded-full blur-[120px] opacity-45"
              style={{ background: "radial-gradient(circle, #a78bfa 0%, transparent 60%)" }}
            />
            <div className="absolute inset-0 empire-hero-grid opacity-60" />
          </div>

          {/* Eyebrow */}
          <div className="relative z-20 mb-3 hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-white/80 backdrop-blur sm:inline-flex">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            Empire AI · Sistema Operativo per Aziende
          </div>

          {/* TOP TITLE */}
          <h1
            ref={titleTopRef}
            className="relative z-10 px-4 text-center font-black uppercase empire-text-silver"
            style={{
              fontSize: "clamp(2.6rem, 11vw, 9rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.04em",
            }}
          >
            La tua azienda
          </h1>

          {/* CINEMATIC CARD with iPhone mockup */}
          <div
            ref={cardRef}
            className="relative my-3 overflow-hidden rounded-[28px] empire-hero-card will-change-transform sm:my-5 sm:rounded-[36px]"
            style={{
              width: "min(92vw, 520px)",
              height: "min(54svh, 440px)",
            }}
          >
            <div ref={sheenRef} className="empire-hero-sheen" />

            {/* iPhone realistico al centro della card */}
            <div
              ref={phoneStackRef}
              className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out"
              style={{ perspective: "1400px" }}
            >
              <div
                className="relative overflow-hidden rounded-[36px] empire-hero-iphone"
                style={{
                  width: "min(58%, 230px)",
                  height: "min(86%, 460px)",
                }}
              >
                {/* notch */}
                <div className="absolute left-1/2 top-2 z-30 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
                {/* screen rolodex */}
                <div className="absolute inset-[6px] overflow-hidden rounded-[28px] bg-black">
                  <div
                    ref={phoneScreensRef}
                    className="relative h-full w-full transition-transform duration-700 ease-out"
                  >
                    {HERO_PHONES.map((src, i) => (
                      <div key={src + i} className="absolute left-0 h-full w-full" style={{ top: `${i * 100}%` }}>
                        <img
                          src={src}
                          alt={`Empire mockup ${i + 1}`}
                          loading={i < 2 ? "eager" : "lazy"}
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  {/* glare */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(110deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 45%)",
                    }}
                  />
                </div>
                {/* hardware buttons */}
                <div className="absolute -left-[3px] top-[22%] h-12 w-[3px] rounded-l bg-zinc-700" />
                <div className="absolute -left-[3px] top-[34%] h-20 w-[3px] rounded-l bg-zinc-700" />
                <div className="absolute -right-[3px] top-[28%] h-24 w-[3px] rounded-r bg-zinc-700" />
              </div>
            </div>

            {/* CTA overlay (visibile solo durante la fase immersiva) */}
            <div
              ref={ctaRef}
              className="absolute inset-x-0 bottom-4 z-30 flex flex-col items-center gap-3 px-4 sm:bottom-8"
            >
              <div className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/80 backdrop-blur">
                {activePhone + 1} / {HERO_PHONES.length} settori live
              </div>
              <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:justify-center">
                <button
                  onClick={() => navigate("/auth")}
                  className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-black transition hover:scale-[1.02]"
                >
                  Inizia ora
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => navigate("/join")}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Diventa Partner
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM TITLE */}
          <h2
            ref={titleBottomRef}
            className="relative z-10 px-4 text-center font-black uppercase empire-text-accent"
            style={{
              fontSize: "clamp(2.6rem, 11vw, 9rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.04em",
            }}
          >
            su pilota automatico
          </h2>

          {/* Scroll hint */}
          <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.4em] text-white/40">
            <span>Scrolla</span>
            <span className="h-6 w-px animate-pulse bg-gradient-to-b from-white/40 to-transparent" />
          </div>
        </div>
      </section>
    </>
  );
}
