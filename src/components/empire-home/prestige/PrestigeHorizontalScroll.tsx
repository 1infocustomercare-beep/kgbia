import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useMotionValueEvent,
  useMotionValue,

  type MotionValue,
} from "framer-motion";

import {
  ArrowUpRight,
  Search,
  Palette,
  Bot,
  TrendingUp,
  Crown,
  Check,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Sezione scroll orizzontale pinnata: "Il metodo Empire".
 * Ogni pannello è una fase reale del processo, con deliverable concreti,
 * tempi e output misurabile — nessuna immagine decorativa fuori contesto.
 * Con `prefers-reduced-motion` si passa a un rail nativo con snap.
 */
type Phase = {
  n: string;
  word: string;
  claim: string;
  desc: string;
  items: string[];
  timing: string;
  output: string;
  Icon: LucideIcon;
};

const PANELS: Phase[] = [
  {
    n: "01",
    word: "STRATEGIA",
    claim: "Capiamo dove si perdono i soldi",
    desc: "Audit del settore, dei concorrenti locali e dei margini reali. Definiamo un solo obiettivo di business prima di disegnare qualsiasi schermata.",
    items: [
      "Audit presenza online e recensioni",
      "Analisi 5 concorrenti della tua zona",
      "Mappa dei punti di perdita clienti",
      "Obiettivo unico e KPI di riferimento",
    ],
    timing: "Giorni 1–3",
    output: "Piano d'azione in 1 pagina",
    Icon: Search,
  },
  {
    n: "02",
    word: "DESIGN",
    claim: "Un'identità che vende, non che decora",
    desc: "Scegli lo stile dal nostro catalogo o lo costruiamo su misura: colori, tipografia e gerarchia pensati per far compiere UNA azione al tuo cliente.",
    items: [
      "Scelta stile dal catalogo o su misura",
      "Palette, tipografia e componenti",
      "Mockup 1:1 approvato prima del build",
      "Copy persuasivo in italiano",
    ],
    timing: "Giorni 4–8",
    output: "Mockup approvato 1:1",
    Icon: Palette,
  },
  {
    n: "03",
    word: "AI",
    claim: "Un agente che risponde al posto tuo",
    desc: "Addestriamo l'assistente sui tuoi servizi, prezzi e orari. Risponde su sito e WhatsApp, qualifica, prenota e passa a te solo ciò che conta.",
    items: [
      "Agente addestrato sul tuo business",
      "Prenotazioni e ordini automatici",
      "Risposte 24/7 su sito e WhatsApp",
      "Escalation umana sui casi delicati",
    ],
    timing: "Giorni 9–14",
    output: "Agente live e collaudato",
    Icon: Bot,
  },
  {
    n: "04",
    word: "CRESCITA",
    claim: "Ogni settimana il sistema migliora",
    desc: "Dati leggibili, non grafici inutili: vedi da dove arrivano i clienti, cosa converte e cosa va corretto. Automazioni di recupero sempre attive.",
    items: [
      "Dashboard con metriche essenziali",
      "Recupero clienti inattivi",
      "Richiesta recensioni automatica",
      "Ottimizzazioni continue mensili",
    ],
    timing: "Dal giorno 15",
    output: "Report e azioni mensili",
    Icon: TrendingUp,
  },
  {
    n: "05",
    word: "IMPERO",
    claim: "Più sedi, un solo comando",
    desc: "Quando funziona, si replica: nuove sedi, nuovi canali e nuovi servizi gestiti da un unico pannello, con permessi e ruoli separati.",
    items: [
      "Multi-sede e multi-canale",
      "Ruoli e permessi per il team",
      "Nuovi servizi in giorni, non mesi",
      "Un solo pannello di controllo",
    ],
    timing: "Continuo",
    output: "Sistema scalabile",
    Icon: Crown,
  },
];

/** Breakpoint di switch fra esperienza desktop (pin orizzontale) e mobile (deck 3D). */
function useIsNarrow() {
  const [narrow, setNarrow] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia("(max-width: 1023px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return narrow;
}

export default function PrestigeHorizontalScroll() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isNarrow = useIsNarrow();
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  // Spring corto e reattivo: prima (110/26/0.35) l'inerzia faceva "scivolare"
  // i pannelli oltre la posizione dello scroll → sensazione di desync.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 42,
    mass: 0.18,
    restDelta: 0.0005,
  });
  const x = useTransform(smooth, [0, 1], ["0%", `-${((PANELS.length - 1) / PANELS.length) * 100}%`]);
  const bar = useTransform(smooth, [0, 1], ["4%", "100%"]);
  const activeIdx = useTransform(smooth, (v) =>
    Math.min(PANELS.length - 1, Math.round(v * (PANELS.length - 1)))
  );

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
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <button onClick={() => navigate("/demo")} className="prestige-cta justify-center">
              <span>Apri i siti demo live</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
        <style>{HSCROLL_CSS}</style>
      </section>
    );
  }

  /* ── MOBILE / TABLET: carosello orizzontale pinnato scroll-driven ──────
     Lo scroll verticale (unico gesto sul touch → zero conflitti) pilota
     la traslazione orizzontale del rail: ogni fase entra da destra, si
     centra ingrandendosi e esce ruotando. Solo transform + opacity. */
  if (isNarrow) {
    return (
      <section
        id="prestige-horizontal"
        data-section="prestige-horizontal"
        data-no-reveal
        className="prestige-section prestige-dark prestige-hscroll prestige-hmob"
        aria-label="Il metodo Empire in cinque fasi"
      >
        <div
          ref={wrapRef}
          className="prestige-hscroll-track"
          style={{ height: `${PANELS.length * 105}svh` }}
        >
          <div className="prestige-hscroll-viewport">
            <Header sticky activeIdx={activeIdx} />

            <motion.div
              className="prestige-hscroll-row"
              style={{ x, width: `${PANELS.length * 100}%` }}
            >
              {PANELS.map((p, i) => (
                <div
                  key={p.word}
                  className="prestige-hscroll-panel"
                  style={{ width: `${100 / PANELS.length}%` }}
                >
                  <MobileCarouselCard
                    panel={p}
                    index={i}
                    total={PANELS.length}
                    progress={smooth}
                  />
                </div>
              ))}
            </motion.div>

            <div className="prestige-hscroll-progress" aria-hidden>
              <motion.div style={{ width: bar }} />
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-6xl px-4 pb-8 pt-6 sm:px-6">
          <button onClick={() => navigate("/demo")} className="prestige-cta w-full justify-center">
            <span>Apri i siti demo live</span>
            <ArrowUpRight size={14} />
          </button>
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
          <Header sticky activeIdx={activeIdx} />

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
                    className="prestige-cta mt-4 self-center justify-center"
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

/** Fase singola su mobile: entra in 3D, si posa, esce in profondità. */
function MobilePhase({ panel, index, total }: { panel: Phase; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 96%", "end 8%"],
  });

  const stops = [0, 0.3, 0.72, 1];
  const rotateX = useTransform(scrollYProgress, stops, [20, 0, 0, -9]);
  const scale = useTransform(scrollYProgress, stops, [0.87, 1, 1, 0.93]);
  const y = useTransform(scrollYProgress, stops, [56, 0, 0, -18]);
  const opacity = useTransform(scrollYProgress, stops, [0, 1, 1, 0.32]);
  const glow = useTransform(scrollYProgress, stops, [0, 0.55, 0.55, 0]);

  return (
    <div ref={ref} className="prestige-hdeck-slot">
      <motion.article
        className="prestige-hdeck-card"
        style={{
          rotateX,
          scale,
          y,
          opacity,
          zIndex: index + 1,
          // @ts-expect-error CSS custom property
          "--deck-glow": glow,
          top: `calc(11svh + ${index * 6}px)`,
        }}
      >
        <span className="prestige-hdeck-step" aria-hidden>
          {panel.n} / {String(total).padStart(2, "0")}
        </span>
        <PanelCard panel={panel} />
      </motion.article>
    </div>
  );
}


function Header({
  sticky = false,
  activeIdx,
}: {
  sticky?: boolean;
  activeIdx?: MotionValue<number>;
}) {
  const [active, setActive] = useState(0);
  const fallback = useMotionValue(0);
  useMotionValueEvent(activeIdx ?? fallback, "change", (v) => setActive(Number(v)));

  return (
    <div className={`mx-auto w-full max-w-6xl shrink-0 px-4 sm:px-6 ${sticky ? "pb-2 pt-16 sm:pt-20" : "pt-16"}`}>
      <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-light))" }}>
        ✦ Il metodo Empire
      </div>
      <h2 className="prestige-display mt-2 text-2xl sm:text-4xl">
        Dal primo audit al <span className="prestige-italic prestige-gold-text">tuo sistema</span> in 5 fasi
      </h2>
      <p className="mt-2 max-w-xl text-sm sm:text-base" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
        Un processo chiuso, con tempi e deliverable dichiarati: sai cosa ricevi in ogni fase.
      </p>
      {sticky && (
        <div className="prestige-hscroll-steps" aria-hidden>
          {PANELS.map((p, i) => (
            <span key={p.n} data-active={i === active ? "true" : undefined}>
              {p.n}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}


const HSCROLL_CSS = `
  .prestige-hscroll { position: relative; }
  .prestige-hscroll-native { padding-bottom: 4rem; }
  .prestige-hscroll-rail {
    display: flex; gap: 1rem; overflow-x: auto; scroll-snap-type: x mandatory;
    padding: 1.5rem 1rem 1.25rem; -webkit-overflow-scrolling: touch;
  }
  .prestige-hscroll-rail::-webkit-scrollbar { display: none; }
  .prestige-hscroll-card { flex: 0 0 82%; max-width: 22rem; scroll-snap-align: center; }

  .prestige-hscroll-steps {
    display: flex; gap: .5rem; margin-top: .9rem;
    font-size: .7rem; letter-spacing: .18em; font-weight: 600;
    color: hsl(var(--pr-gold-light));
  }
  .prestige-hscroll-steps > span {
    padding: .15rem .5rem; border-radius: 999px;
    border: 1px solid hsl(var(--pr-gold) / .35);
    transition: background .3s ease, color .3s ease, box-shadow .3s ease, transform .3s ease;
  }
  .prestige-hscroll-steps > span[data-active] {
    background: hsl(var(--pr-gold) / .18);
    box-shadow: 0 0 14px hsl(var(--pr-gold) / .45);
    transform: translateY(-1px);
    color: hsl(var(--pr-gold-light));
  }

  /* ── MOBILE DECK 3D ─────────────────────────────────────────────── */
  .prestige-hdeck { padding-bottom: 1rem; }
  .prestige-hdeck-stage {
    perspective: 1100px;
    perspective-origin: 50% 40%;
    padding: 1.5rem 0 2rem;
  }
  .prestige-hdeck-slot { height: 118svh; }
  .prestige-hdeck-card {
    position: sticky;
    margin: 0 auto;
    width: calc(100% - 2rem);
    max-width: 30rem;
    transform-style: preserve-3d;
    transform-origin: 50% 12%;
    will-change: transform, opacity;
    border-radius: 1.5rem;
    box-shadow:
      0 24px 60px -28px hsl(0 0% 0% / .85),
      0 0 40px hsl(var(--pr-gold) / calc(var(--deck-glow, 0) * .5));
  }
  .prestige-hdeck-step {
    position: absolute; top: .85rem; right: 1rem; z-index: 2;
    font-size: .66rem; letter-spacing: .22em; font-weight: 700;
    color: hsl(var(--pr-gold-light) / .85);
  }
  .prestige-hdeck-card > .prestige-bento { border-radius: 1.5rem; }


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
    padding: 0 1rem 3rem; height: 100%; overflow: hidden;
  }
  .prestige-hscroll-panel > .prestige-bento { max-height: 100%; overflow: hidden; }
  .prestige-hscroll-list { display: grid; gap: .5rem; margin-top: 1rem; }
  .prestige-hscroll-list li {
    display: flex; gap: .55rem; align-items: flex-start;
    font-size: .82rem; line-height: 1.35;
    color: hsl(var(--pr-muted-on-dark));
  }
  .prestige-hscroll-list svg { flex: 0 0 auto; margin-top: .15rem; color: hsl(var(--pr-gold-light)); }
  .prestige-hscroll-meta {
    display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1.1rem;
  }
  .prestige-hscroll-meta span {
    font-size: .7rem; letter-spacing: .12em; text-transform: uppercase;
    padding: .3rem .6rem; border-radius: 999px;
    border: 1px solid hsl(var(--pr-gold) / .3);
    background: hsl(var(--pr-gold) / .08);
    color: hsl(var(--pr-gold-light));
  }
  .prestige-hscroll-badge {
    display: inline-flex; align-items: center; justify-content: center;
    width: 2.6rem; height: 2.6rem; border-radius: 1rem;
    border: 1px solid hsl(var(--pr-gold) / .35);
    background: hsl(var(--pr-gold) / .1);
    color: hsl(var(--pr-gold-light));
  }
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
    .prestige-hscroll-panel { padding: 0 6vw 3.5rem; }
  }
  @media (min-width: 900px) {
    .prestige-hscroll-panel > .prestige-bento {
      grid-template-columns: 1.05fr 0.95fr !important;
      gap: 2.25rem !important;
    }
    .prestige-hscroll-list li { font-size: .95rem; }
  }
`;

function PanelCard({ panel, large = false }: { panel: Phase; large?: boolean }) {
  const { Icon } = panel;
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
        <div className="flex items-center gap-3">
          <span className="prestige-hscroll-badge">
            <Icon size={18} />
          </span>
          <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-light))" }}>
            Fase {panel.n} · {panel.timing}
          </div>
        </div>
        <h3
          className="prestige-display mt-3 leading-[0.95]"
          style={{ fontSize: large ? "clamp(1.9rem, 5.4vw, 4.4rem)" : "1.8rem" }}
        >
          {panel.word}
        </h3>
        <p className="mt-2 text-sm font-semibold sm:text-base" style={{ color: "hsl(var(--pr-text-on-dark))" }}>
          {panel.claim}
        </p>
        <p className="mt-2 max-w-md text-sm sm:text-base" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
          {panel.desc}
        </p>
        <div className="prestige-hscroll-meta">
          <span>Output: {panel.output}</span>
        </div>
      </div>

      <ul className="prestige-hscroll-list">
        {panel.items.map((it) => (
          <li key={it}>
            <Check size={15} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
