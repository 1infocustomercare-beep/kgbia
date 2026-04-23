import { useEffect, useState } from "react";
import { useScrollProgress, lerp, remap } from "../hooks/useScrollProgress";
import { PORTFOLIO_ITEMS, HERO_PHONES } from "../data/portfolio";

/**
 * 500vh sticky cinematic hero with 5-phase scroll choreography:
 *  1) Headline letters cascade in
 *  2) Description + CTAs fade up
 *  3) 5 phones emerge from depth (1 center + 4 corners)
 *  4) Parallax orbs + grid expansion
 *  5) Phones expand toward edges, transition handoff
 */
export default function CinematicHero() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const [centerIdx, setCenterIdx] = useState(0);

  // Auto-rotate the center phone through all 12 mockups
  useEffect(() => {
    const id = window.setInterval(() => {
      setCenterIdx((i) => (i + 1) % PORTFOLIO_ITEMS.length);
    }, 3500);
    return () => window.clearInterval(id);
  }, []);

  // Phase computations
  const headlineP = remap(progress, 0.0, 0.15, 0, 1);
  const descP = remap(progress, 0.15, 0.35, 0, 1);
  const phonesP = remap(progress, 0.3, 0.6, 0, 1);
  const parallaxP = remap(progress, 0.6, 0.85, 0, 1);
  const expandP = remap(progress, 0.8, 1.0, 0, 1);

  const centerScale = lerp(0.5, 1, phonesP) + expandP * 0.08;
  const cornerOffset = lerp(220, 0, phonesP); // px from rest

  return (
    <div ref={ref} className="empire-hero-stage relative" aria-label="Empire AI hero">
      <div className="empire-hero-sticky">
        {/* Background: golden grid + orbs + particles */}
        <div className="empire-hero-bg">
          <div
            className="empire-hero-grid"
            style={{ transform: `scale(${1 + parallaxP * 0.4}) rotateX(60deg)` }}
          />
          <div
            className="empire-hero-orb orb-gold-1"
            style={{
              transform: `translate3d(${parallaxP * -120}px, ${parallaxP * -60}px, 0) scale(${1 + parallaxP * 0.3})`,
            }}
          />
          <div
            className="empire-hero-orb orb-gold-2"
            style={{
              transform: `translate3d(${parallaxP * 140}px, ${parallaxP * 80}px, 0) scale(${1 + parallaxP * 0.4})`,
            }}
          />
          <div
            className="empire-hero-orb orb-violet"
            style={{
              transform: `translate3d(${parallaxP * 60}px, ${parallaxP * -100}px, 0) scale(${1 + parallaxP * 0.5})`,
            }}
          />
          {/* Floating gold particles */}
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="empire-hero-particle"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                animationDelay: `${(i % 8) * 0.6}s`,
                opacity: 0.2 + parallaxP * 0.4,
              }}
            />
          ))}
        </div>

        {/* Phones layer (behind text) */}
        <div className="empire-hero-phones" aria-hidden>
          {/* Corner phones — hidden on mobile */}
          {HERO_PHONES.map((p, i) => {
            const positions = [
              { left: "8%", top: "18%", tx: -cornerOffset, ty: -cornerOffset },
              { right: "8%", top: "18%", tx: cornerOffset, ty: -cornerOffset },
              { left: "10%", bottom: "14%", tx: -cornerOffset, ty: cornerOffset },
              { right: "10%", bottom: "14%", tx: cornerOffset, ty: cornerOffset },
            ];
            const pos = positions[i];
            const scale = lerp(0.35, 0.78, phonesP) + expandP * 0.15;
            return (
              <div
                key={i}
                className="empire-phone empire-phone--corner hidden md:block"
                style={{
                  ...pos,
                  transform: `translate3d(${pos.tx * (1 - phonesP)}px, ${pos.ty * (1 - phonesP)}px, 0) scale(${scale}) rotate(${(i % 2 === 0 ? -1 : 1) * (8 - phonesP * 4)}deg)`,
                  opacity: phonesP,
                }}
              >
                <img src={p.url} alt={p.name} loading="lazy" />
              </div>
            );
          })}

          {/* Center phone — auto-rotating */}
          <div
            className="empire-phone empire-phone--center"
            style={{
              transform: `translate3d(-50%, -50%, 0) scale(${centerScale}) translateY(${lerp(60, 0, phonesP)}px)`,
              opacity: lerp(0.4, 1, phonesP),
            }}
          >
            {PORTFOLIO_ITEMS.map((p, i) => (
              <img
                key={p.url}
                src={p.url}
                alt={p.name}
                loading={i === 0 ? "eager" : "lazy"}
                style={{ opacity: i === centerIdx ? 1 : 0 }}
              />
            ))}
          </div>
        </div>

        {/* Foreground content */}
        <div className="empire-hero-content">
          <span
            className="empire-eyebrow"
            style={{
              opacity: headlineP,
              transform: `translateY(${(1 - headlineP) * 30}px)`,
            }}
          >
            Metodo Sebastiano · Automazione Elite
          </span>

          <h1 className="empire-hero-title">
            <span
              className="line"
              style={{
                opacity: remap(headlineP, 0.1, 0.4, 0, 1),
                transform: `translateY(${(1 - remap(headlineP, 0.1, 0.4, 0, 1)) * 60}px)`,
              }}
            >
              EMPIRE
            </span>
            <span
              className="line italic"
              style={{
                opacity: remap(headlineP, 0.35, 0.7, 0, 1),
                transform: `translateY(${(1 - remap(headlineP, 0.35, 0.7, 0, 1)) * 60}px)`,
              }}
            >
              Autonomous
            </span>
            <span
              className="line"
              style={{
                opacity: remap(headlineP, 0.6, 1, 0, 1),
                transform: `translateY(${(1 - remap(headlineP, 0.6, 1, 0, 1)) * 60}px)`,
              }}
            >
              AI
            </span>
          </h1>

          <p
            className="empire-hero-desc"
            style={{
              opacity: descP,
              transform: `translateY(${(1 - descP) * 40}px)`,
            }}
          >
            Il sistema di automazione autonoma che trasforma il tuo business in una macchina di
            acquisizione clienti operativa 24/7, senza intervento umano.
          </p>

          <div
            className="empire-hero-ctas"
            style={{
              opacity: descP,
              transform: `translateY(${(1 - descP) * 30}px)`,
            }}
          >
            <a href="#pricing" className="empire-btn empire-btn--gold">
              Scopri i Piani
            </a>
            <a href="#portfolio" className="empire-btn empire-btn--ghost">
              Vedi il Portfolio
            </a>
          </div>

          {/* Scroll hint */}
          <span
            className="empire-scroll-hint"
            style={{ opacity: 1 - headlineP * 1.5 }}
          >
            <span className="dot" />
            scroll
          </span>
        </div>
      </div>
    </div>
  );
}
