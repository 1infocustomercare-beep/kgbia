import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";

gsap.registerPlugin(ScrollTrigger);

const HERO_PHONES = [
  { label: "Food OS", img: SECTOR_MOCKUP_IMAGES.food?.[0], tint: "#fbbf24" },
  { label: "Beauty OS", img: SECTOR_MOCKUP_IMAGES.beauty?.[0], tint: "#ec4899" },
  { label: "NCC OS", img: SECTOR_MOCKUP_IMAGES.ncc?.[0], tint: "#22d3ee" },
].filter((p) => Boolean(p.img));

export default function HeroExplosion() {
  const root = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const revealAll = () => {
        gsap.set(q("[data-hero-line] .char, [data-hero-sub], [data-hero-cta], [data-hero-meta], [data-hero-kpi], [data-hero-phone], [data-hero-grid]"), {
          x: 0,
          y: 0,
          rotate: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          opacity: 1,
          filter: "none",
          clipPath: "inset(0 0% 0 0)",
        });
      };

      gsap.set(q("[data-hero-line] .char"), {
        y: () => gsap.utils.random(isMobile ? -130 : -280, isMobile ? 130 : 280),
        x: () => gsap.utils.random(isMobile ? -180 : -520, isMobile ? 180 : 520),
        rotate: () => gsap.utils.random(-110, 110),
        scale: () => gsap.utils.random(0.35, 2.4),
        opacity: 0,
        filter: "blur(18px)",
      });
      gsap.set(q("[data-hero-sub]"), { y: 26, opacity: 0, clipPath: "inset(0 100% 0 0)" });
      gsap.set(q("[data-hero-cta]"), { y: 42, opacity: 0, scale: 0.9 });
      gsap.set(q("[data-hero-meta], [data-hero-kpi]"), { y: 22, opacity: 0 });
      gsap.set(q("[data-hero-shock]"), { scale: 0, opacity: 0.95 });
      gsap.set(q("[data-hero-shock-2]"), { scale: 0, opacity: 0.78 });
      gsap.set(q("[data-hero-grid]"), { opacity: 0.18, scale: 1.12 });
      gsap.set(q("[data-hero-flash]"), { opacity: 0 });
      gsap.set(q("[data-hero-phone]"), {
        y: () => gsap.utils.random(isMobile ? 120 : 240, isMobile ? 260 : 520),
        x: () => gsap.utils.random(isMobile ? -70 : -160, isMobile ? 70 : 160),
        rotate: () => gsap.utils.random(-22, 22),
        rotateY: () => gsap.utils.random(-42, 42),
        scale: 0.72,
        opacity: 0,
        filter: "blur(16px)",
      });

      const trigger = () => {
        if (reduceMotion) {
          revealAll();
          return;
        }

        const tl = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: revealAll });
        tl.to(q("[data-hero-flash]"), { opacity: 1, duration: 0.07, ease: "none" }, 0)
          .to(q("[data-hero-flash]"), { opacity: 0, duration: 0.85, ease: "power2.out" }, 0.07)
          .to(q("[data-hero-shock]"), { scale: isMobile ? 9 : 17, opacity: 0, duration: 1.55 }, 0)
          .to(q("[data-hero-shock-2]"), { scale: isMobile ? 12 : 24, opacity: 0, duration: 2.05 }, 0.12)
          .to(q("[data-hero-grid]"), { opacity: 0.62, scale: 1, duration: 1.15 }, 0.02)
          .to(q("[data-hero-line] .char"), {
            y: 0,
            x: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.15,
            stagger: { each: isMobile ? 0.008 : 0.012, from: "random" },
          }, 0.18)
          .to(q("[data-hero-phone]"), {
            y: 0,
            x: 0,
            rotate: (i) => [-8, 7, 0][i] ?? 0,
            rotateY: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.2,
            stagger: { each: 0.12, from: "center" },
            ease: "back.out(1.7)",
          }, 0.34)
          .to(el, {
            keyframes: [
              { x: -9, y: 5, duration: 0.045 },
              { x: 7, y: -4, duration: 0.045 },
              { x: -3, y: 2, duration: 0.045 },
              { x: 0, y: 0, duration: 0.08 },
            ],
          }, 0.42)
          .to(q("[data-hero-sub]"), { y: 0, opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.out" }, 0.82)
          .to(q("[data-hero-cta]"), { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "back.out(2)" }, 1.02)
          .to(q("[data-hero-meta], [data-hero-kpi]"), { y: 0, opacity: 1, duration: 0.75, ease: "power2.out", stagger: 0.07 }, 1.15);
      };

      const alreadyShown = sessionStorage.getItem("empire-splash-shown");
      const splashDelay = alreadyShown ? 40 : 260;
      const t = window.setTimeout(trigger, splashDelay);
      const emergency = window.setTimeout(revealAll, 1200);
      sessionStorage.setItem("empire-splash-shown", "1");

      let onMove: ((e: MouseEvent) => void) | null = null;
      if (!isMobile) {
        onMove = (e: MouseEvent) => {
          const rx = e.clientX / window.innerWidth - 0.5;
          const ry = e.clientY / window.innerHeight - 0.5;
          gsap.to(q("[data-hero-parallax='1']"), { x: rx * 18, y: ry * 18, duration: 0.8, ease: "power2.out" });
          gsap.to(q("[data-hero-parallax='2']"), { x: rx * -30, y: ry * -24, rotateY: rx * 10, duration: 0.9, ease: "power2.out" });
          gsap.to(q("[data-hero-parallax='3']"), { x: rx * 44, y: ry * 30, duration: 1.0, ease: "power2.out" });
        };
        window.addEventListener("mousemove", onMove, { passive: true });
      }

      gsap.to(q("[data-hero-content]"), {
        y: isMobile ? -42 : -110,
        opacity: 0.18,
        filter: "blur(5px)",
        ease: "none",
        scrollTrigger: { trigger: el, start: "55% top", end: "bottom top", scrub: 1 },
      });

      self.add(() => {
        clearTimeout(t);
        clearTimeout(emergency);
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
    <section ref={root} id="hero" className="relative min-h-[100svh] overflow-hidden">
      <div data-hero-flash className="pointer-events-none absolute inset-0 z-[8] bg-white" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 90% 70% at 50% 22%, rgba(34,211,238,0.24), transparent 58%), radial-gradient(ellipse 70% 55% at 78% 58%, rgba(236,72,153,0.20), transparent 64%), linear-gradient(135deg, #050813 0%, #081327 46%, #13081f 100%)" }} />

      <div data-hero-shock className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[40vmin] w-[40vmin] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(34,211,238,0.45) 20%, rgba(167,139,250,0.18) 48%, transparent 72%)", boxShadow: "0 0 260px 90px rgba(34,211,238,0.28)" }} />
      <div data-hero-shock-2 className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[28vmin] w-[28vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border-2" style={{ borderColor: "rgba(236,72,153,0.45)" }} />

      <div data-hero-grid data-hero-parallax="1" className="pointer-events-none absolute inset-0 z-[1]" style={{ backgroundImage: "linear-gradient(rgba(34,211,238,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.10) 1px, transparent 1px)", backgroundSize: "58px 58px", maskImage: "radial-gradient(ellipse 78% 62% at 50% 44%, black 28%, transparent 84%)", WebkitMaskImage: "radial-gradient(ellipse 78% 62% at 50% 44%, black 28%, transparent 84%)" }} />
      <div data-hero-parallax="3" className="pointer-events-none absolute -left-24 top-24 z-[1] h-[360px] w-[360px] rounded-full blur-3xl" style={{ background: "rgba(74,222,128,0.20)" }} />
      <div data-hero-parallax="3" className="pointer-events-none absolute -right-28 bottom-10 z-[1] h-[430px] w-[430px] rounded-full blur-3xl" style={{ background: "rgba(236,72,153,0.22)" }} />

      <div data-hero-content className="relative z-[3] mx-auto grid min-h-[100svh] max-w-[1380px] items-center gap-8 px-5 pb-16 pt-28 lg:grid-cols-[1fr_0.74fr] lg:gap-10 lg:pt-24">
        <div className="text-center lg:text-left">
          <div data-hero-meta className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[3px] text-white/80" style={{ textShadow: "0 0 18px rgba(34,211,238,0.5)" }}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "#22d3ee", boxShadow: "0 0 14px #22d3ee" }} />
            Empire AI Group · Future Business OS
          </div>

          <h1 className="font-heading font-black uppercase leading-[0.82] text-white" style={{ fontSize: "clamp(3.1rem, 10.4vw, 10.8rem)", textShadow: "0 18px 80px rgba(0,0,0,0.45)" }}>
            <div data-hero-line>{splitChars("Empire")}</div>
            <div data-hero-line>
              <span style={{ background: "linear-gradient(90deg, #22d3ee, #4ade80 36%, #a78bfa 68%, #ec4899)", WebkitBackgroundClip: "text", color: "transparent" }}>
                {splitChars("automatizza")}
              </span>
            </div>
          </h1>

          <p data-hero-sub className="mx-auto mt-7 max-w-[680px] text-[14px] leading-[1.85] text-white/72 sm:text-[17px] lg:mx-0">
            Trasformiamo siti, vendite, operations, marketing e customer care in un unico sistema AI: veloce, elegante, misurabile, pronto a scalare.
          </p>

          <div data-hero-cta className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4 lg:items-start">
            <button onClick={() => navigate("/demo")} className="group relative w-full overflow-hidden rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[1.8px] text-white transition-transform hover:-translate-y-1 sm:w-auto sm:px-9" style={{ background: "linear-gradient(135deg, #22d3ee, #4ade80, #a78bfa, #ec4899)", boxShadow: "0 26px 70px -18px rgba(34,211,238,0.55)" }}>
              <span className="relative z-10">Vedi i sistemi live →</span>
              <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-700 group-hover:translate-x-0" />
            </button>
            <button onClick={() => navigate("/auth")} className="w-full rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold text-white/85 transition-all hover:border-white/50 hover:bg-white/10 sm:w-auto sm:px-9">
              Entra nel comando
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-2 sm:max-w-[560px] sm:gap-3">
            {[
              ["577+", "Mockup reali"],
              ["25+", "Settori pronti"],
              ["90gg", "Trial vendita"],
            ].map(([k, l]) => (
              <div key={k} data-hero-kpi className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left">
                <div className="font-heading text-xl font-black text-white sm:text-3xl">{k}</div>
                <div className="mt-1 text-[9px] uppercase tracking-[1.6px] text-white/45 sm:text-[10px]">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div data-hero-parallax="2" className="relative mx-auto h-[380px] w-full max-w-[430px] sm:h-[520px] lg:h-[620px]" style={{ transformStyle: "preserve-3d" }}>
          <div className="absolute left-1/2 top-1/2 h-[92%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(34,211,238,0.24), rgba(167,139,250,0.18), transparent 68%)" }} />
          {HERO_PHONES.map((phone, i) => (
            <div key={phone.label} data-hero-phone className="absolute left-1/2 top-1/2" style={{ width: i === 1 ? "min(190px, 43vw)" : "min(164px, 38vw)", transform: `translate(-50%, -50%) translateX(${(i - 1) * 92}px) translateY(${i === 1 ? -8 : 26}px) rotate(${[-8, 7, 0][i]}deg)`, zIndex: i === 1 ? 3 : 2 }}>
              <div className="relative overflow-hidden rounded-[30px] border-[8px] border-black bg-black" style={{ aspectRatio: "9 / 19", boxShadow: `0 44px 110px -28px ${phone.tint}aa, 0 0 0 1px rgba(255,255,255,0.12)` }}>
                <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-black" />
                <img src={phone.img} alt={phone.label} className="h-full w-full object-cover" loading={i === 1 ? "eager" : "lazy"} draggable={false} />
              </div>
              <div className="mt-3 text-center text-[10px] font-bold uppercase tracking-[2px] text-white/55">{phone.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
