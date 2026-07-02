import { useEffect, useRef } from "react";
import PrestigePhone, { PHONE_VIEWS, type PhoneView } from "./PrestigePhone";
import { getEmpireScreens } from "./EmpireMockupScreens";
import { useT } from "./PrestigeLang";

/**
 * PrestigeCinematic3D — pinned scroll-scene with 4 iPhones orbiting on a 3D stage.
 * Pure CSS 3D + rAF (no three.js). Additive-only.
 *
 * Behaviour:
 *  - Section is 300vh tall; a sticky viewport (100vh) pins the stage.
 *  - Scroll progress (0 → 1) drives:
 *      • camera zoom (translateZ)
 *      • stage rotation around Y
 *      • per-phone selection glow + label crossfade
 *      • foreground copy fade / slide
 *  - Fully responsive; degrades to a static grid on prefers-reduced-motion.
 */
const LABELS: PhoneView[] = PHONE_VIEWS;
const COPY = [
  {
    it: "Il tuo sito, cinematografico.",
    en: "Your website, cinematic.",
    subIt: "Fotografico, veloce, indicizzato, con prenotazioni integrate.",
    subEn: "Photographic, fast, indexed, with built-in bookings.",
  },
  {
    it: "Il tuo pannello, un'unica cabina.",
    en: "Your dashboard, one cockpit.",
    subIt: "Incassi, agenda, staff, stock, KPI — un solo pannello vivo.",
    subEn: "Revenue, schedule, staff, stock, KPIs — one living panel.",
  },
  {
    it: "L'app cliente che fideliza.",
    en: "The client app that retains.",
    subIt: "Ordini, punti, notifiche push, wallet fedeltà — brandizzata tua.",
    subEn: "Orders, points, push, loyalty wallet — fully your brand.",
  },
  {
    it: "L'AI che parla al posto tuo.",
    en: "The AI that talks for you.",
    subIt: "WhatsApp, voce, email — sempre in linea, sempre sul tono giusto.",
    subEn: "WhatsApp, voice, email — always on, always on-brand.",
  },
];

export default function PrestigeCinematic3D() {
  const t = useT();
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      stage.style.setProperty("--p", "0.5");
      return;
    }

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = wrap.getBoundingClientRect();
        const vh = window.innerHeight;
        // progress: 0 when top hits viewport top, 1 when bottom leaves viewport bottom
        const total = r.height - vh;
        const p = Math.max(0, Math.min(1, -r.top / Math.max(1, total)));
        stage.style.setProperty("--p", p.toFixed(4));

        // Active phone
        const idx = Math.min(3, Math.floor(p * 4 + 0.001));
        if (idx !== activeRef.current) {
          activeRef.current = idx;
          stage.dataset.active = String(idx);
        }
        // Sync copy opacity/translate
        const copies = wrap.querySelectorAll<HTMLElement>(".cine-copy");
        copies.forEach((el) => {
          const i = Number(el.dataset.i || 0);
          const d = Math.min(1, Math.abs(p * 4 - i) * 1.4);
          el.style.opacity = String(1 - d);
          el.style.transform = `translateY(${(d * 24).toFixed(1)}px)`;
          el.style.pointerEvents = d > 0.6 ? "none" : "auto";
        });

      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      data-section="prestige-3d"
      data-no-reveal
      className="prestige-section prestige-dark relative"
      style={{ height: "300vh" }}
    >

      <div
        className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 20%, hsl(var(--pr-gold) / 0.08), transparent 60%), radial-gradient(ellipse 55% 45% at 15% 80%, hsl(var(--pr-emerald-glow) / 0.10), transparent 60%)",
        }}
      >
        {/* Header eyebrow floating top */}
        <div className="absolute top-[max(6rem,10svh)] left-1/2 -translate-x-1/2 z-20 text-center px-4">
          <span className="prestige-eyebrow-indexed" data-index="05">
            {t({ it: "Empire, in movimento", en: "Empire, in motion" })}
          </span>
          <h2
            className="prestige-display mt-4 mx-auto"
            style={{ fontSize: "clamp(1.6rem, 4.2vw, 3rem)", maxWidth: 820 }}
          >
            {t({ it: "Un ecosistema.", en: "One ecosystem." })}{" "}
            <span className="prestige-italic prestige-gold-text">
              {t({ it: "Quattro superfici.", en: "Four surfaces." })}
            </span>
          </h2>
        </div>

        {/* 3D Stage */}
        <div
          ref={stageRef}
          className="cine-stage relative"
          data-active="0"
          style={{
            width: "min(90vw, 900px)",
            height: "min(70vh, 560px)",
            perspective: "1600px",
            perspectiveOrigin: "50% 45%",
            // @ts-expect-error CSS var
            "--p": 0,
          }}
        >
          <div
            className="cine-carousel absolute inset-0"
            style={{
              transformStyle: "preserve-3d",
              transform:
                "rotateX(6deg) rotateY(calc(-90deg + calc(var(--p) * -360deg))) translateZ(calc(-60px + calc(var(--p) * -40px)))",
              transition: "transform 120ms linear",
            }}
          >
            {LABELS.map((label, i) => {
              const screen = getEmpireScreens("restaurant", label);
              const angle = i * 90;
              return (
                <div
                  key={label}
                  className="cine-slot absolute left-1/2 top-1/2 flex items-center justify-center"
                  style={{
                    width: 260,
                    height: 560,
                    marginLeft: -130,
                    marginTop: -280,
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${angle}deg) translateZ(320px)`,
                  }}
                >
                  <div
                    className="cine-phone-wrap"
                    style={{
                      transform: "rotateY(0deg)",
                      filter: "drop-shadow(0 40px 60px hsl(162 80% 5% / 0.55))",
                    }}
                  >
                    <PrestigePhone screen={screen} label={label} width={240} loading="lazy" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reflective floor */}
          <div
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: -30,
              width: "90%",
              height: 120,
              background:
                "radial-gradient(ellipse at center, hsl(var(--pr-gold) / 0.16), transparent 70%)",
              filter: "blur(20px)",
              transform: "translateZ(0)",
            }}
          />
        </div>

        {/* Copy that swaps with active phone (driven by data-active on stage) */}
        <div className="absolute bottom-[max(6rem,10svh)] left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4 text-center">
          {COPY.map((c, i) => (
            <div
              key={i}
              className="cine-copy absolute inset-x-0"
              data-i={i}
              style={{
                transition: "opacity 480ms ease, transform 480ms ease",
              }}
            >
              <h3
                className="prestige-display"
                style={{ fontSize: "clamp(1.2rem, 2.6vw, 2rem)", lineHeight: 1.1 }}
              >
                {t({ it: c.it, en: c.en })}
              </h3>
              <p
                className="mt-3 text-[14px] sm:text-[15px] leading-relaxed"
                style={{ color: "hsl(var(--pr-muted-on-dark))" }}
              >
                {t({ it: c.subIt, en: c.subEn })}
              </p>
            </div>
          ))}
        </div>


        {/* Progress rail */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {LABELS.map((_, i) => (
            <span
              key={i}
              className="cine-dot h-1.5 rounded-full transition-all duration-300"
              style={{
                width: 22,
                background:
                  "linear-gradient(90deg, hsl(var(--pr-gold) / 0.25), hsl(var(--pr-gold) / 0.25))",
                opacity: 0.35,
                // active dot highlighted via CSS below
              }}
              data-i={i}
            />
          ))}
        </div>
      </div>

      <style>{`
        .cine-stage[data-active="0"] .cine-dot[data-i="0"],
        .cine-stage[data-active="1"] .cine-dot[data-i="1"],
        .cine-stage[data-active="2"] .cine-dot[data-i="2"],
        .cine-stage[data-active="3"] .cine-dot[data-i="3"] {
          opacity: 1;
          background: linear-gradient(90deg, hsl(var(--pr-gold-light)), hsl(var(--pr-gold-deep)));
          box-shadow: 0 0 12px hsl(var(--pr-gold) / 0.55);
          width: 42px;
        }
        @supports not (transform: rotateY(1deg) translateZ(1px)) {
          .cine-carousel { transform: none !important; }
          .cine-slot { position: relative !important; transform: none !important; margin: 0 !important; display: inline-flex; }
        }
        @media (max-width: 640px) {
          .cine-stage { height: min(65vh, 480px) !important; }
        }
      `}</style>
    </section>
  );
}
