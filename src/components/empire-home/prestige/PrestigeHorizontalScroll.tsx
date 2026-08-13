import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { PRESTIGE_SECTOR_HERO } from "@/data/prestige-home-mockups";

/**
 * Sezione scroll orizzontale pinnata (stile "I know you love to scroll").
 * Additiva: non sostituisce né disattiva nessun altro effetto della home.
 * - Desktop: la sezione resta pinnata e i pannelli scorrono in orizzontale.
 * - Mobile / reduced-motion: fallback a scroll orizzontale nativo con snap.
 */
const PANELS: Array<{ word: string; label: string; desc: string; image?: string }> = [
  {
    word: "STRATEGIA",
    label: "Fase 01",
    desc: "Analizziamo settore, concorrenti e margini prima di disegnare una singola schermata.",
    image: PRESTIGE_SECTOR_HERO.food,
  },
  {
    word: "DESIGN",
    label: "Fase 02",
    desc: "Un'identità su misura: colori, tipografia e layout pensati per il tuo pubblico reale.",
    image: PRESTIGE_SECTOR_HERO.beauty,
  },
  {
    word: "AI",
    label: "Fase 03",
    desc: "Agenti addestrati sul tuo business che rispondono, prenotano e vendono al posto tuo.",
    image: PRESTIGE_SECTOR_HERO.ncc,
  },
  {
    word: "CRESCITA",
    label: "Fase 04",
    desc: "Dati chiari, automazioni e recupero clienti: ogni settimana il sistema migliora.",
    image: PRESTIGE_SECTOR_HERO.fitness,
  },
  {
    word: "IMPERO",
    label: "Fase 05",
    desc: "Più sedi, più canali, un solo pannello di controllo. Il tuo brand diventa sistema.",
    image: PRESTIGE_SECTOR_HERO.hospitality,
  },
];

export default function PrestigeHorizontalScroll() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], ["0%", `-${(PANELS.length - 1) * 100}%`]);

  return (
    <section
      id="prestige-horizontal"
      data-section="prestige-horizontal"
      className="prestige-section prestige-dark prestige-hscroll"
      aria-label="Il metodo Empire in cinque fasi"
    >
      {/* Fallback mobile / reduced motion: scroll orizzontale nativo */}
      <div className="prestige-hscroll-native">
        <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-5">
          <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-light))" }}>
            ✦ Il metodo
          </div>
          <h2 className="prestige-display mt-3 text-3xl sm:text-4xl">
            Scorri <span className="prestige-italic prestige-gold-text">le cinque fasi</span>
          </h2>
        </div>
        <div className="prestige-hscroll-rail" role="list">
          {PANELS.map((p) => (
            <article key={p.word} role="listitem" className="prestige-hscroll-card">
              <PanelCard panel={p} />
            </article>
          ))}
        </div>
      </div>

      {/* Desktop: pin + traslazione orizzontale */}
      <div
        ref={wrapRef}
        className="prestige-hscroll-track"
        style={{ height: `${PANELS.length * 100}vh` }}
      >
        <div className="prestige-hscroll-viewport">
          <motion.div
            className="prestige-hscroll-row"
            style={{ x: reduce ? "0%" : x, width: `${PANELS.length * 100}vw` }}
          >
            {PANELS.map((p) => (
              <div key={p.word} className="prestige-hscroll-panel">
                <PanelCard panel={p} large />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <style>{`
        .prestige-hscroll { position: relative; }
        .prestige-hscroll-track { display: none; }
        .prestige-hscroll-native { padding-bottom: 4rem; }
        .prestige-hscroll-rail {
          display: flex; gap: 1rem; overflow-x: auto; scroll-snap-type: x mandatory;
          padding: 1.5rem 1rem 0.5rem; -webkit-overflow-scrolling: touch;
        }
        .prestige-hscroll-rail::-webkit-scrollbar { display: none; }
        .prestige-hscroll-card { flex: 0 0 82%; max-width: 22rem; scroll-snap-align: center; }

        @media (min-width: 1024px) {
          .prestige-hscroll-native { display: none; }
          .prestige-hscroll-track { display: block; position: relative; }
          .prestige-hscroll-viewport {
            position: sticky; top: 0; height: 100vh; overflow: hidden;
            display: flex; align-items: center;
          }
          .prestige-hscroll-row { display: flex; will-change: transform; }
          .prestige-hscroll-panel {
            width: 100vw; flex: 0 0 100vw; height: 100vh;
            display: flex; align-items: center; justify-content: center;
            padding: 0 6vw;
          }
        }
      `}</style>
    </section>
  );
}

function PanelCard({
  panel,
  large = false,
}: {
  panel: { word: string; label: string; desc: string; image?: string };
  large?: boolean;
}) {
  return (
    <div
      className="prestige-bento h-full w-full overflow-hidden rounded-3xl p-5 sm:p-7"
      style={{ display: "grid", gap: large ? "2rem" : "1rem", gridTemplateColumns: large ? "1.05fr 0.95fr" : "1fr", alignItems: "center", maxWidth: large ? "76rem" : undefined, margin: large ? "0 auto" : undefined }}
    >
      <div>
        <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-light))" }}>
          {panel.label}
        </div>
        <h3
          className="prestige-display mt-3 leading-[0.95]"
          style={{ fontSize: large ? "clamp(2.75rem, 7vw, 6rem)" : "2rem" }}
        >
          {panel.word}
        </h3>
        <p
          className="mt-4 max-w-md text-sm sm:text-base"
          style={{ color: "hsl(var(--pr-muted-on-dark))" }}
        >
          {panel.desc}
        </p>
      </div>
      {panel.image && (
        <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid hsl(var(--pr-gold-deep) / 0.25)" }}>
          <img
            src={panel.image}
            alt={`Mockup Empire — ${panel.word}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            style={{ aspectRatio: large ? "4 / 3" : "16 / 10" }}
          />
        </div>
      )}
    </div>
  );
}
