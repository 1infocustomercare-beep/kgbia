import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import empireLogo from "@/assets/empire-logo-full.png";

gsap.registerPlugin(ScrollTrigger);

const HERO_MOCKUPS = [
  { img: SECTOR_MOCKUP_IMAGES.food?.[0], label: "Food", accent: "hsl(42 94% 62%)" },
  { img: SECTOR_MOCKUP_IMAGES.beauty?.[0], label: "Beauty", accent: "hsl(325 85% 58%)" },
  { img: SECTOR_MOCKUP_IMAGES.ncc?.[0], label: "Luxury", accent: "hsl(195 100% 55%)" },
].filter((m) => Boolean(m.img)) as { img: string; label: string; accent: string }[];

/**
 * HERO — Atterraggio cinematografico esplosivo dopo lo splash.
 * Tutti i selettori sono scoped al root via gsap.context per evitare warning "Invalid scope".
 */
export default function HeroExplosion() {
  const root = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context((self) => {
      const q = self.selector!;

      gsap.set(q("[data-hero-word], [data-hero-sub], [data-hero-cta], [data-hero-meta], [data-hero-grid], [data-hero-orb], [data-hero-preview]"), {
        x: 0, y: 0, rotate: 0, rotateY: 0, rotateX: 0, scale: 1, opacity: 1, filter: "none", clipPath: "inset(0 0% 0 0)", clearProps: "transform",
      });

      // Stato iniziale solido: niente lettere sparse o hero invisibile anche se GSAP/HMR si interrompe.
      gsap.set(q("[data-hero-shock]"), { scale: 0, opacity: 0.95 });
      gsap.set(q("[data-hero-shock-2]"), { scale: 0, opacity: 0.7 });
      gsap.set(q("[data-hero-grid]"), { opacity: 0.45, scale: 1 });
      gsap.set(q("[data-hero-orb]"), { opacity: 0.75, scale: 1 });
      gsap.set(q("[data-hero-flash]"), { opacity: 0 });

      const trigger = () => {
        setArmed(true);
        if (reduceMotion) {
          gsap.set(q("[data-hero-word], [data-hero-sub], [data-hero-cta], [data-hero-meta], [data-hero-preview]"), { y: 0, x: 0, rotate: 0, rotateY: 0, scale: 1, opacity: 1, filter: "none", clipPath: "inset(0 0% 0 0)" });
          gsap.set(q("[data-hero-grid], [data-hero-orb]"), { opacity: 1, scale: 1 });
          return;
        }
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        tl.to(q("[data-hero-flash]"), { opacity: 1, duration: 0.08, ease: "none" }, 0)
          .to(q("[data-hero-flash]"), { opacity: 0, duration: 0.7, ease: "power2.out" }, 0.08)
          .to(q("[data-hero-shock]"), { scale: 16, opacity: 0, duration: 1.6 }, 0)
          .to(q("[data-hero-shock-2]"), { scale: 22, opacity: 0, duration: 2.0 }, 0.15)
          .to(q("[data-hero-grid]"), { opacity: 0.6, scale: 1, duration: 1.4 }, 0.05)
          .to(q("[data-hero-orb]"), { opacity: 1, scale: 1, duration: 1.2, stagger: 0.08 }, 0.2)
          .fromTo(q("[data-hero-word]"), {
            y: isMobile ? 26 : 46, opacity: 0, rotateX: -22, filter: "blur(8px)",
          }, {
            y: 0, rotateX: 0, opacity: 1, filter: "blur(0px)",
            duration: 0.9,
            stagger: { each: 0.08, from: "start" },
            ease: "expo.out",
          }, 0.18)
          .to(el, {
            keyframes: [
              { x: -8, y: 4, duration: 0.05 },
              { x: 6, y: -3, duration: 0.05 },
              { x: -3, y: 2, duration: 0.05 },
              { x: 0, y: 0, duration: 0.06 },
            ],
          }, 0.4)
          .to(q("[data-hero-sub]"), {
            y: 0, opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 1.0, ease: "power3.out",
          }, 0.75)
          .to(q("[data-hero-cta]"), {
            y: 0, opacity: 1, scale: 1, duration: 1, ease: "back.out(2.2)",
          }, 0.95)
          .to(q("[data-hero-meta]"), {
            y: 0, opacity: 1, duration: 0.8, ease: "power2.out", stagger: 0.1,
          }, 1.15)
          .fromTo(q("[data-hero-preview]"), {
            y: isMobile ? 34 : 80,
            opacity: 0,
            rotateY: isMobile ? 0 : (i: number) => [-16, 0, 16][i % 3],
            scale: 0.9,
            filter: "blur(10px)",
          }, {
            y: 0, opacity: 1, rotateY: 0, rotateX: 0, scale: 1, filter: "blur(0px)", duration: 1.05, stagger: 0.08, ease: "expo.out",
          }, 0.82);
      };

      const isHome = window.location.pathname === "/" || window.location.pathname === "/home" || window.location.pathname === "/index";
      const alreadyShown = sessionStorage.getItem("empire-splash-shown");
      const introSkippedByApp = isHome;
      const splashDelay = introSkippedByApp || alreadyShown ? 120 : 2550;
      const fallback = window.setTimeout(() => {
        setArmed(true);
        gsap.set(q("[data-hero-word], [data-hero-sub], [data-hero-cta], [data-hero-meta], [data-hero-grid], [data-hero-orb], [data-hero-preview]"), {
          x: 0, y: 0, rotate: 0, rotateY: 0, scale: 1, opacity: 1, filter: "none", clipPath: "inset(0 0% 0 0)", clearProps: "transform",
        });
        gsap.set(q("[data-hero-flash], [data-hero-shock], [data-hero-shock-2]"), { opacity: 0 });
      }, 900);
      const t = window.setTimeout(trigger, splashDelay);
      sessionStorage.setItem("empire-splash-shown", "1");

      // Mouse parallax (desktop only)
      let onMove: ((e: MouseEvent) => void) | null = null;
      if (!isMobile) {
        onMove = (e: MouseEvent) => {
          const rx = (e.clientX / window.innerWidth - 0.5);
          const ry = (e.clientY / window.innerHeight - 0.5);
          gsap.to(q("[data-hero-parallax='1']"), { x: rx * 14, y: ry * 14, duration: 0.8, ease: "power2.out" });
          gsap.to(q("[data-hero-parallax='2']"), { x: rx * -28, y: ry * -28, duration: 0.9, ease: "power2.out" });
          gsap.to(q("[data-hero-parallax='3']"), { x: rx * 44, y: ry * 44, duration: 1.0, ease: "power2.out" });
          gsap.to(q("[data-hero-preview]"), { rotateY: rx * 10, rotateX: ry * -8, duration: 0.8, ease: "power2.out" });
        };
        window.addEventListener("mousemove", onMove, { passive: true });
      }

      gsap.to(q("[data-hero-content]"), {
        y: -44,
        opacity: 0.72,
        filter: "blur(1.5px)",
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top -12%",
          end: "bottom 18%",
          scrub: 0.8,
        },
      });

      // Cleanup hook for context
      self.add(() => {
        clearTimeout(t);
        clearTimeout(fallback);
        if (onMove) window.removeEventListener("mousemove", onMove);
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="hero" data-hero-armed={armed ? "true" : "false"} className="relative min-h-[100svh] overflow-hidden bg-background">
      <div data-hero-flash className="pointer-events-none absolute inset-0 z-[5] bg-foreground opacity-0" />

      <div
        data-hero-shock
        className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[40vmin] w-[40vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{
          background: "radial-gradient(circle, hsl(var(--neon-cyan) / 0.42) 0%, hsl(var(--gold) / 0.22) 38%, transparent 70%)",
          boxShadow: "0 0 240px 80px hsl(var(--primary) / 0.28), inset 0 0 100px hsl(var(--foreground) / 0.16)",
        }}
      />
      <div
        data-hero-shock-2
        className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[30vmin] w-[30vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold/40 opacity-0"
      />

      <div
        data-hero-grid
        data-hero-parallax="1"
        className="pointer-events-none absolute inset-0 z-[1] opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary) / 0.08) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.08) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      <div data-hero-orb data-hero-parallax="2" className="pointer-events-none absolute left-[6%] top-[15%] z-[1] h-72 w-72 rounded-full opacity-70" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.36), transparent 60%)", filter: "blur(40px)" }} />
      <div data-hero-orb data-hero-parallax="3" className="pointer-events-none absolute right-[5%] bottom-[12%] z-[1] h-96 w-96 rounded-full opacity-70" style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.30), transparent 60%)", filter: "blur(60px)" }} />
      <div data-hero-orb data-hero-parallax="2" className="pointer-events-none absolute left-[40%] top-[8%] z-[1] h-48 w-48 rounded-full opacity-70" style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.34), transparent 60%)", filter: "blur(50px)" }} />

      <div data-hero-content className="relative z-[3] flex min-h-[100svh] flex-col items-center justify-center px-5 pb-14 pt-24 text-center sm:pt-28">
        <div data-hero-meta className="mb-5 inline-flex items-center gap-3 rounded-full border border-foreground/15 bg-background/70 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[3px] text-foreground/85 shadow-[0_14px_40px_hsl(0_0%_0%_/_0.35)] backdrop-blur-xl sm:mb-7 sm:text-[11px]" style={{ textShadow: "0 2px 18px hsl(0 0% 0% / 0.75)" }}>
          <img src={empireLogo} alt="Empire AI" className="h-5 w-auto object-contain" loading="eager" />
          AI Agency · Sistemi premium per aziende
        </div>

        <h1 className="w-full font-heading font-black uppercase leading-[0.92] tracking-normal text-foreground" style={{ fontSize: "clamp(2.45rem, 11vw, 10.5rem)", textShadow: "0 4px 34px hsl(0 0% 0% / 0.72)" }}>
          <span data-hero-word className="block whitespace-nowrap will-change-transform">Il tuo business,</span>
          <span data-hero-word className="block whitespace-nowrap bg-[linear-gradient(110deg,hsl(var(--gold)),hsl(var(--primary)),hsl(var(--accent)))] bg-clip-text text-transparent will-change-transform">
            potenziato dall'AI.
          </span>
        </h1>

        <p data-hero-sub className="mx-auto mt-6 max-w-[720px] text-[14px] leading-[1.75] text-foreground/82 sm:mt-7 sm:text-[17px]" style={{ textShadow: "0 2px 22px hsl(0 0% 0% / 0.8)" }}>
          Costruiamo siti, app e agenti AI che lavorano per te 24/7: portano clienti, gestiscono prenotazioni, chiudono vendite e automatizzano l'operativo. Un ecosistema premium pronto in 7 giorni — senza perdere il tuo brand.
        </p>

        <div className="pointer-events-none mt-7 flex w-full items-end justify-center gap-2 sm:mt-9 sm:gap-3" style={{ perspective: "1200px" }}>
          {HERO_MOCKUPS.map((mockup, i) => (
            <div
              key={mockup.img}
              data-hero-preview
              className="relative overflow-hidden rounded-[1.45rem] border-[6px] border-background bg-background shadow-2xl sm:rounded-[1.8rem] sm:border-[8px]"
              style={{
                width: i === 1 ? "min(132px, 34vw)" : "min(96px, 25vw)",
                height: i === 1 ? "min(268px, 68vw)" : "min(196px, 50vw)",
                marginBottom: i === 1 ? 0 : 18,
                boxShadow: i === 1 ? `0 34px 90px -24px ${mockup.accent}` : "0 24px 70px -28px hsl(var(--empire-violet) / 0.55)",
              }}
            >
              <img src={mockup.img} alt={`Mockup Empire AI ${mockup.label}`} className="h-full w-full object-cover" loading="eager" draggable={false} />
              <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-transparent to-background/20" />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-foreground/15 bg-background/80 px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-[1.8px] text-foreground/80 backdrop-blur-md">
                {mockup.label}
              </div>
            </div>
          ))}
        </div>

        <div data-hero-cta className="mt-7 flex w-full flex-col items-center gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:gap-4">
          <button
            onClick={() => navigate("/demo")}
            className="group relative min-h-12 w-full overflow-hidden rounded-full px-8 py-4 text-sm font-bold tracking-wide text-primary-foreground transition-transform hover:-translate-y-1 sm:w-auto sm:px-9"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--empire-violet)), hsl(var(--gold)))",
              boxShadow: "0 24px 60px -20px hsl(var(--primary) / 0.6)",
            }}
          >
            <span className="relative z-10">PROVA UNA DEMO LIVE →</span>
            <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-700 group-hover:translate-x-0" />
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="min-h-12 w-full rounded-full border border-white/20 bg-white/[0.03] px-8 py-4 text-sm font-semibold text-white/90 shadow-[0_14px_40px_rgba(0,0,0,0.28)] transition-all hover:border-white/50 hover:bg-white/8 sm:w-auto sm:px-9"
          >
            Accedi alla piattaforma
          </button>
        </div>

        <div data-hero-meta className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold tracking-[4px] text-white/40 sm:flex">
          SCROLL
          <span className="block h-10 w-[1px] animate-pulse bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
