import { useEmpireScrollDirector } from "../ScrollDirector";

const STEPS = [
  {
    n: "01",
    title: "Scopriamo la tua azienda",
    desc: "Una chiamata di 30 minuti. Ci racconti i tuoi problemi quotidiani, noi mappiamo le opportunità di automazione. Niente tecnicismi.",
  },
  {
    n: "02",
    title: "Disegniamo il tuo mockup",
    desc: "In 48 ore ricevi il mockup del tuo nuovo sito + app, già personalizzato con il tuo brand, i tuoi colori, le tue foto. Lo modifichi finché è perfetto.",
  },
  {
    n: "03",
    title: "Costruiamo l'AI",
    desc: "Addestriamo l'assistente virtuale con il tuo menu, listino, FAQ. Configuriamo WhatsApp, telefono e pagamenti. Tutto chiavi in mano.",
  },
  {
    n: "04",
    title: "Lanciamo & seguiamo",
    desc: "Setup completo in 7-14 giorni. Ti formiamo in 1 ora. Restiamo accanto a te per i primi 90 giorni — senza costi aggiuntivi — finché non vola da solo.",
  },
];

export default function PrestigeProcess() {
  const { ref, step } = useEmpireScrollDirector<HTMLDivElement>("prestige-process", { steps: STEPS.length });

  return (
    <section
      ref={ref}
      data-section="prestige-process"
      className="prestige-section prestige-dark py-16 sm:py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-5 lg:px-10">
        <div className="text-center">
          <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-light))" }}>
            ✦ Come lavoriamo
          </div>
          <h2 className="prestige-display mt-4 text-3xl font-semibold sm:text-5xl md:text-6xl break-words">
            Quattro passi. <span className="prestige-gold-text italic">Zero stress.</span>
          </h2>
          <div className="prestige-divider mx-auto mt-5" />
        </div>

        <ol className="mt-10 sm:mt-14 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">

          {STEPS.map((s, i) => {
            const isActive = i <= step;
            return (
              <li
                key={s.n}
                className="prestige-card relative"
                style={{
                  borderColor: isActive ? "hsl(var(--pr-gold) / 0.55)" : "hsl(var(--pr-gold) / 0.15)",
                  boxShadow: isActive ? "0 20px 50px -20px hsl(var(--pr-gold) / 0.4)" : "none",
                  transition: "all .6s cubic-bezier(.22,1,.36,1)",
                }}
              >
                <div
                  className="prestige-display text-4xl sm:text-5xl font-bold"
                  style={{
                    color: isActive ? "hsl(var(--pr-gold-light))" : "hsl(var(--pr-gold) / 0.3)",
                    transition: "color .6s ease",
                  }}
                >
                  {s.n}
                </div>
                <h3 className="prestige-display mt-3 text-lg sm:text-2xl break-words">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
                  {s.desc}
                </p>

                {isActive && (
                  <span
                    className="absolute right-3 top-3 h-2 w-2 rounded-full"
                    style={{ background: "hsl(var(--pr-gold-light))", boxShadow: "0 0 12px hsl(var(--pr-gold))" }}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
