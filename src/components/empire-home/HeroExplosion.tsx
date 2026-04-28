import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

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

      gsap.set(q("[data-hero-line] .char, [data-hero-sub], [data-hero-cta], [data-hero-meta], [data-hero-grid], [data-hero-orb]"), { clearProps: "all" });

      // Initial state: mai invisibile senza fallback; la classe CSS sotto rende tutto visibile se GSAP non parte.
      gsap.set(q("[data-hero-line] .char"), {
        y: () => gsap.utils.random(isMobile ? -160 : -260, isMobile ? 160 : 260),
        x: () => gsap.utils.random(isMobile ? -220 : -380, isMobile ? 220 : 380),
        rotate: () => gsap.utils.random(-90, 90),
        scale: () => gsap.utils.random(0.4, 2.2),
        opacity: 0,
        filter: "blur(20px)",
      });
      gsap.set(q("[data-hero-sub]"), { y: 30, opacity: 0, clipPath: "inset(0 100% 0 0)" });
      gsap.set(q("[data-hero-cta]"), { y: 50, opacity: 0, scale: 0.85 });
      gsap.set(q("[data-hero-meta]"), { y: 20, opacity: 0 });
      gsap.set(q("[data-hero-shock]"), { scale: 0, opacity: 0.95 });
      gsap.set(q("[data-hero-shock-2]"), { scale: 0, opacity: 0.7 });
      gsap.set(q("[data-hero-grid]"), { opacity: 0, scale: 1.18 });
      gsap.set(q("[data-hero-orb]"), { opacity: 0, scale: 0.6 });
      gsap.set(q("[data-hero-flash]"), { opacity: 0 });

      const trigger = () => {
        setArmed(true);
        if (reduceMotion) {
          gsap.set(q("[data-hero-line] .char, [data-hero-sub], [data-hero-cta], [data-hero-meta]"), { y: 0, x: 0, rotate: 0, scale: 1, opacity: 1, filter: "none", clipPath: "inset(0 0% 0 0)" });
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
          .to(q("[data-hero-line] .char"), {
            y: 0, x: 0, rotate: 0, scale: 1, opacity: 1, filter: "blur(0px)",
            duration: 1.2,
            stagger: { each: 0.014, from: "random" },
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
          }, 1.15);
      };

      const isHome = window.location.pathname === "/" || window.location.pathname === "/home" || window.location.pathname === "/index";
      const alreadyShown = sessionStorage.getItem("empire-splash-shown");
      const introSkippedByApp = isHome;
      const splashDelay = introSkippedByApp || alreadyShown ? 120 : 2550;
      const fallback = window.setTimeout(() => setArmed(true), 700);
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
        };
        window.addEventListener("mousemove", onMove, { passive: true });
      }

      gsap.to(q("[data-hero-content]"), {
        y: -120,
        opacity: 0,
        filter: "blur(8px)",
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom 42%",
          scrub: 0.8,
        },
      });

      // Cleanup hook for context
      self.add(() => {
        clearTimeout(t);
        clearTimeout(fallback);
        if (onMove) window.removeEventListener("mousemove", onMove);
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const splitChars = (txt: string) =>
    Array.from(txt).map((c, i) => (
      <span key={i} className="char inline-block will-change-transform" style={{ whiteSpace: c === " " ? "pre" : "normal" }}>
        {c}
      </span>
    ));

  return (
    <section ref={root} id="hero" data-hero-armed={armed ? "true" : "false"} className="relative min-h-[100svh] overflow-hidden">
      <div data-hero-flash className="pointer-events-none absolute inset-0 z-[5] bg-white opacity-0" />

      <div
        data-hero-shock
        className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[40vmin] w-[40vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{
          background: "radial-gradient(circle, rgba(34,211,238,0.45) 0%, rgba(167,139,250,0.22) 40%, transparent 70%)",
          boxShadow: "0 0 240px 80px rgba(34,211,238,0.3), inset 0 0 100px rgba(255,255,255,0.18)",
        }}
      />
      <div
        data-hero-shock-2
        className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[30vmin] w-[30vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#ec4899]/40 opacity-0"
      />

      <div
        data-hero-grid
        data-hero-parallax="1"
        className="pointer-events-none absolute inset-0 z-[1] opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.08) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      <div data-hero-orb data-hero-parallax="2" className="pointer-events-none absolute left-[6%] top-[15%] z-[1] h-72 w-72 rounded-full opacity-70" style={{ background: "radial-gradient(circle, rgba(34,211,238,0.45), transparent 60%)", filter: "blur(40px)" }} />
      <div data-hero-orb data-hero-parallax="3" className="pointer-events-none absolute right-[5%] bottom-[12%] z-[1] h-96 w-96 rounded-full opacity-70" style={{ background: "radial-gradient(circle, rgba(236,72,153,0.38), transparent 60%)", filter: "blur(60px)" }} />
      <div data-hero-orb data-hero-parallax="2" className="pointer-events-none absolute left-[40%] top-[8%] z-[1] h-48 w-48 rounded-full opacity-70" style={{ background: "radial-gradient(circle, rgba(167,139,250,0.4), transparent 60%)", filter: "blur(50px)" }} />

      <div data-hero-content className="relative z-[3] flex min-h-[100svh] flex-col items-center justify-center px-5 pb-20 pt-24 text-center sm:pt-28">
        <div data-hero-meta className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold tracking-[3px] text-white/80 backdrop-blur-md">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22d3ee]" />
          EMPIRE.AI · DOMINIO ALGORITMICO
        </div>

        <h1 className="font-heading font-black leading-[0.86] tracking-[-0.05em] text-white" style={{ fontSize: "clamp(2.8rem, 13vw, 12rem)" }}>
          <div data-hero-line className="overflow-visible">{splitChars("Automazione")}</div>
          <div data-hero-line className="overflow-visible">
            <span className="bg-gradient-to-r from-[#22d3ee] via-[#a78bfa] to-[#ec4899] bg-clip-text text-transparent">
              {splitChars("Assoluta.")}
            </span>
          </div>
        </h1>

        <p data-hero-sub className="mx-auto mt-8 max-w-[640px] text-[14px] leading-[1.85] text-white/65 sm:text-[17px]">
          Sincronizzazione neurale tra ogni processo del tuo business.
          Solo <span className="text-white">efficienza algoritmica pura</span> al servizio del tuo dominio del mercato.
        </p>

        <div data-hero-cta className="mt-10 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <button
            onClick={() => navigate("/demo")}
            className="group relative w-full overflow-hidden rounded-full px-8 py-4 text-sm font-bold tracking-wide text-white transition-transform hover:-translate-y-1 sm:w-auto sm:px-9"
            style={{
              background: "linear-gradient(135deg, #22d3ee, #a78bfa, #ec4899)",
              boxShadow: "0 24px 60px -20px rgba(167,139,250,0.6)",
            }}
          >
            <span className="relative z-10">ATTIVA L'ESPERIENZA →</span>
            <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-700 group-hover:translate-x-0" />
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="w-full rounded-full border border-white/20 px-8 py-4 text-sm font-semibold text-white/85 backdrop-blur-md transition-all hover:border-white/50 hover:bg-white/5 sm:w-auto sm:px-9"
          >
            Accedi al Comando
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
