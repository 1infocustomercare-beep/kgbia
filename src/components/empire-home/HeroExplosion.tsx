import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

/**
 * HERO — Atterraggio cinematografico esplosivo dopo lo splash.
 * I caratteri arrivano "spari" da angoli diversi, le linee si compongono,
 * il sottotitolo svela in mask, lo sfondo reagisce al mouse via parallax.
 */
export default function HeroExplosion() {
  const root = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Initial state
      gsap.set("[data-hero-line] .char", {
        y: () => gsap.utils.random(-220, 220),
        x: () => gsap.utils.random(-340, 340),
        rotate: () => gsap.utils.random(-90, 90),
        scale: () => gsap.utils.random(0.4, 2.4),
        opacity: 0,
        filter: "blur(20px)",
      });
      gsap.set("[data-hero-sub]", { y: 30, opacity: 0, clipPath: "inset(0 100% 0 0)" });
      gsap.set("[data-hero-cta]", { y: 40, opacity: 0, scale: 0.9 });
      gsap.set("[data-hero-meta]", { y: 20, opacity: 0 });
      gsap.set("[data-hero-shock]", { scale: 0, opacity: 0.9 });
      gsap.set("[data-hero-grid]", { opacity: 0, scale: 1.1 });

      const trigger = () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        // Shockwave + grid reveal (the "landing")
        tl.to("[data-hero-shock]", {
          scale: 14, opacity: 0, duration: 1.6, ease: "expo.out",
        }, 0)
        .to("[data-hero-grid]", {
          opacity: 0.55, scale: 1, duration: 1.4, ease: "expo.out",
        }, 0.05)
        // Characters slam into place
        .to("[data-hero-line] .char", {
          y: 0, x: 0, rotate: 0, scale: 1, opacity: 1, filter: "blur(0px)",
          duration: 1.1,
          stagger: { each: 0.012, from: "random" },
          ease: "expo.out",
        }, 0.18)
        // Camera shake on impact
        .to(el, {
          keyframes: [
            { x: -8, y: 4, duration: 0.05 },
            { x: 6, y: -3, duration: 0.05 },
            { x: -3, y: 2, duration: 0.05 },
            { x: 0, y: 0, duration: 0.05 },
          ],
        }, 0.4)
        .to("[data-hero-sub]", {
          y: 0, opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 1.0, ease: "power3.out",
        }, 0.7)
        .to("[data-hero-cta]", {
          y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "back.out(2)",
        }, 0.95)
        .to("[data-hero-meta]", {
          y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
        }, 1.1);
      };

      // Wait for splash to finish (~3.2s) — splash is untouched
      const splashDelay = sessionStorage.getItem("empire-splash-shown") ? 200 : 3200;
      const t = window.setTimeout(trigger, splashDelay);
      sessionStorage.setItem("empire-splash-shown", "1");

      // Mouse parallax
      const onMove = (e: MouseEvent) => {
        const rx = (e.clientX / window.innerWidth - 0.5);
        const ry = (e.clientY / window.innerHeight - 0.5);
        gsap.to("[data-hero-parallax='1']", { x: rx * 14, y: ry * 14, duration: 0.6, ease: "power2.out" });
        gsap.to("[data-hero-parallax='2']", { x: rx * -22, y: ry * -22, duration: 0.7, ease: "power2.out" });
        gsap.to("[data-hero-parallax='3']", { x: rx * 36, y: ry * 36, duration: 0.8, ease: "power2.out" });
      };
      window.addEventListener("mousemove", onMove, { passive: true });

      return () => {
        clearTimeout(t);
        window.removeEventListener("mousemove", onMove);
      };
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
    <section ref={root} id="hero" className="relative min-h-[100svh] overflow-hidden">
      {/* Shockwave ring */}
      <div
        data-hero-shock
        className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[40vmin] w-[40vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(126,183,190,0.35) 0%, rgba(167,139,250,0.18) 40%, transparent 70%)",
          boxShadow: "0 0 200px 60px rgba(126,183,190,0.25), inset 0 0 80px rgba(255,255,255,0.15)",
        }}
      />

      {/* Tech grid */}
      <div
        data-hero-grid
        data-hero-parallax="1"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(126,183,190,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(126,183,190,0.07) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      {/* Floating glow orbs */}
      <div data-hero-parallax="2" className="pointer-events-none absolute left-[8%] top-[18%] z-[1] h-72 w-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(126,183,190,0.4), transparent 60%)", filter: "blur(40px)" }} />
      <div data-hero-parallax="3" className="pointer-events-none absolute right-[6%] bottom-[14%] z-[1] h-96 w-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(236,72,153,0.32), transparent 60%)", filter: "blur(60px)" }} />

      <div className="relative z-[3] flex min-h-[100svh] flex-col items-center justify-center px-5 pt-28 pb-20 text-center">
        {/* Eyebrow */}
        <div data-hero-meta className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold tracking-[3px] text-white/80 backdrop-blur-md">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7eb7be]" />
          EMPIRE.AI · DOMINIO ALGORITMICO
        </div>

        {/* Title — gigantic */}
        <h1 className="font-heading font-black leading-[0.88] tracking-[-0.045em] text-white" style={{ fontSize: "clamp(3.4rem, 12vw, 11rem)" }}>
          <div data-hero-line className="overflow-visible">{splitChars("Automazione")}</div>
          <div data-hero-line className="overflow-visible">
            <span className="bg-gradient-to-r from-[#7eb7be] via-[#a78bfa] to-[#ec4899] bg-clip-text text-transparent">
              {splitChars("Assoluta.")}
            </span>
          </div>
        </h1>

        {/* Subtitle */}
        <p data-hero-sub className="mx-auto mt-8 max-w-[640px] text-[15px] leading-[1.85] text-white/65 sm:text-[17px]">
          Sincronizzazione neurale tra ogni processo del tuo business. Nessuna ripetizione, nessun errore umano.
          Solo <span className="text-white">efficienza algoritmica pura</span> al servizio del tuo dominio del mercato.
        </p>

        {/* CTAs */}
        <div data-hero-cta className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <button
            onClick={() => navigate("/demo")}
            className="group relative overflow-hidden rounded-full px-9 py-4 text-sm font-bold tracking-wide text-white transition-all hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg, #7eb7be, #a78bfa, #ec4899)",
              boxShadow: "0 24px 60px -20px rgba(167,139,250,0.6)",
            }}
          >
            <span className="relative z-10">ATTIVA L'ESPERIENZA →</span>
            <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-0" />
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="rounded-full border border-white/20 px-9 py-4 text-sm font-semibold text-white/85 backdrop-blur-md transition-all hover:border-white/50 hover:bg-white/5"
          >
            Accedi al Comando
          </button>
        </div>

        {/* Scroll indicator */}
        <div data-hero-meta className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold tracking-[4px] text-white/40">
          SCROLL
          <span className="block h-10 w-[1px] animate-pulse bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
