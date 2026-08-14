import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
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
          <Header sticky progress={smooth} />

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

function Header({
  sticky = false,
  progress,
}: {
  sticky?: boolean;
  progress?: ReturnType<typeof useSpring>;
}) {
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
      {sticky && progress && (
        <div className="prestige-hscroll-steps" aria-hidden>
          {PANELS.map((p, i) => {
            const active = useTransform(progress, (v) => {
              const idx = Math.round(v * (PANELS.length - 1));
              return idx >= i ? 1 : 0.28;
            });
            return (
              <motion.span key={p.n} style={{ opacity: active }}>
                {p.n}
              </motion.span>
            );
          })}
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
  }

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
