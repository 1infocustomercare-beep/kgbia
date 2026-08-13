import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PRESTIGE_SECTOR_HERO } from "@/data/prestige-home-mockups";

/**
 * Sezione scroll orizzontale pinnata (stile "I know you love to scroll").
 * Ora attiva su TUTTI i dispositivi: la sezione resta pinnata e i pannelli
 * traslano in orizzontale legati al progresso di scroll verticale.
 * Solo con `prefers-reduced-motion` si passa a un rail nativo con snap.
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
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.35 });
  const x = useTransform(smooth, [0, 1], ["0%", `-${((PANELS.length - 1) / PANELS.length) * 100}%`]);
  const bar = useTransform(smooth, [0, 1], ["4%", "100%"]);

  if (reduce) {
    return (
      <section
        id="prestige-horizontal"
        data-section="prestige-horizontal"
        data-no-reveal
        className="prestige-section prestige-dark prestige-hscroll"
        aria-label="Il metodo Empire in cinque fasi"
      >
        <div className="prestige-hscroll-native">
          <Header />
          <div className="prestige-hscroll-rail" role="list">
            {PANELS.map((p) => (
              <article key={p.word} role="listitem" className="prestige-hscroll-card">
                <PanelCard panel={p} />
              </article>
            ))}
          </div>
        </div>
        <style>{HSCROLL_CSS}</style>
      </section>
    );
  }

  return (
    <section
      id="prestige-horizontal"
      data-section="prestige-horizontal"
      data-no-reveal
      className="prestige-section prestige-dark prestige-hscroll"
      aria-label="Il metodo Empire in cinque fasi"
    >
      <div
        ref={wrapRef}
        className="prestige-hscroll-track"
        style={{ height: `${PANELS.length * 100}svh` }}
      >
        <div className="prestige-hscroll-viewport">
          <Header sticky />

          <motion.div
            className="prestige-hscroll-row"
            style={{ x, width: `${PANELS.length * 100}%` }}
          >
            {PANELS.map((p, i) => (
              <div key={p.word} className="prestige-hscroll-panel" style={{ width: `${100 / PANELS.length}%` }}>
                <PanelCard panel={p} large />
                {i === PANELS.length - 1 && (
                  <button
                    onClick={() => navigate("/demo")}
                    className="prestige-cta mt-4 justify-center"
                  >
                    <span>Apri i siti demo live</span>
                    <ArrowUpRight size={14} />
                  </button>
                )}
              </div>
            ))}
          </motion.div>

          {/* progress bar della sequenza */}
          <div className="prestige-hscroll-progress" aria-hidden>
            <motion.div style={{ width: bar }} />
          </div>
        </div>
      </div>
      <style>{HSCROLL_CSS}</style>
    </section>
  );
}

function Header({ sticky = false }: { sticky?: boolean }) {
  return (
    <div className={`mx-auto w-full max-w-6xl shrink-0 px-4 sm:px-6 ${sticky ? "pb-2 pt-16 sm:pt-20" : "pt-16"}`}>
      <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-light))" }}>
        ✦ Il metodo
      </div>
      <h2 className="prestige-display mt-2 text-2xl sm:text-4xl">
        Scorri <span className="prestige-italic prestige-gold-text">le cinque fasi</span>
      </h2>
    </div>
  );
}

const HSCROLL_CSS = `
  .prestige-hscroll { position: relative; }
  .prestige-hscroll-native { padding-bottom: 4rem; }
  .prestige-hscroll-rail {
    display: flex; gap: 1rem; overflow-x: auto; scroll-snap-type: x mandatory;
    padding: 1.5rem 1rem 0.5rem; -webkit-overflow-scrolling: touch;
  }
  .prestige-hscroll-rail::-webkit-scrollbar { display: none; }
  .prestige-hscroll-card { flex: 0 0 82%; max-width: 22rem; scroll-snap-align: center; }

  .prestige-hscroll-track { position: relative; display: block; }
  .prestige-hscroll-viewport {
    position: sticky; top: 0; height: 100svh; overflow: hidden;
    display: flex; flex-direction: column; justify-content: flex-start;
  }
  .prestige-hscroll-row {
    display: flex; will-change: transform; flex: 1 1 auto;
    align-items: center; min-height: 0;
  }
  .prestige-hscroll-panel {
    flex: 0 0 auto; display: flex; flex-direction: column; justify-content: center;
    padding: 0 1rem 0.5rem; height: 100%; overflow: hidden;
  }
  .prestige-hscroll-panel > .prestige-bento { max-height: 100%; overflow: hidden; }
  .prestige-hscroll-media { max-height: 34svh; }
  @media (min-width: 900px) { .prestige-hscroll-media { max-height: 52svh; } }
  .prestige-hscroll-progress {
    position: absolute; bottom: 1.25rem; left: 50%; transform: translateX(-50%);
    width: min(28rem, 76vw); height: 3px; border-radius: 999px;
    background: hsl(var(--pr-gold) / 0.18); overflow: hidden;
  }
  .prestige-hscroll-progress > div {
    height: 100%; border-radius: 999px;
    background: linear-gradient(90deg, hsl(var(--pr-gold)), hsl(var(--pr-gold-light)));
    box-shadow: 0 0 12px hsl(var(--pr-gold) / .6);
  }
  @media (min-width: 1024px) {
    .prestige-hscroll-panel { padding: 0 6vw 2rem; }
  }
`;

function PanelCard({
  panel,
  large = false,
}: {
  panel: { word: string; label: string; desc: string; image?: string };
  large?: boolean;
}) {
  return (
    <div
      className="prestige-bento w-full overflow-hidden rounded-3xl p-5 sm:p-7"
      style={{
        display: "grid",
        gap: large ? "1.5rem" : "1rem",
        gridTemplateColumns: "1fr",
        alignItems: "center",
        maxWidth: large ? "76rem" : undefined,
        margin: large ? "0 auto" : undefined,
      }}
    >
      <div className="prestige-hscroll-copy">
        <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-light))" }}>
          {panel.label}
        </div>
        <h3
          className="prestige-display mt-2 leading-[0.95]"
          style={{ fontSize: large ? "clamp(2.1rem, 7vw, 6rem)" : "2rem" }}
        >
          {panel.word}
        </h3>
        <p
          className="mt-3 max-w-md text-sm sm:text-base"
          style={{ color: "hsl(var(--pr-muted-on-dark))" }}
        >
          {panel.desc}
        </p>
      </div>
      {panel.image && (
        <div
          className="prestige-hscroll-media overflow-hidden rounded-2xl"
          style={{ border: "1px solid hsl(var(--pr-gold-deep) / 0.25)" }}
        >
          <img
            src={panel.image}
            alt={`Mockup Empire — ${panel.word}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            style={{ aspectRatio: "16 / 10", objectPosition: "center top", maxHeight: "inherit" }}
          />
        </div>
      )}
      <style>{`
        @media (min-width: 900px) {
          .prestige-hscroll-panel > .prestige-bento {
            grid-template-columns: 1.05fr 0.95fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
