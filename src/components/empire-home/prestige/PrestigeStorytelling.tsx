import { useEmpireScrollDirector } from "../ScrollDirector";
import { AlertTriangle, Phone, Clock, TrendingDown, ArrowRight, Bot, Calendar, MessageSquare, TrendingUp } from "lucide-react";

const PROBLEMI = [
  { icon: Phone, text: "Telefono che squilla a vuoto" },
  { icon: Clock, text: "Prenotazioni perse di notte" },
  { icon: AlertTriangle, text: "WhatsApp pieno, nessuno risponde" },
  { icon: TrendingDown, text: "Clienti che scelgono i concorrenti" },
];

const SOLUZIONI = [
  { icon: Bot, text: "AI che risponde a chiamate e WhatsApp" },
  { icon: Calendar, text: "Prenotazioni accettate 24/7, anche di notte" },
  { icon: MessageSquare, text: "Risposte istantanee, zero attese" },
  { icon: TrendingUp, text: "Clienti soddisfatti, fatturato che cresce" },
];

export default function PrestigeStorytelling() {
  const { ref, progress } = useEmpireScrollDirector<HTMLDivElement>("prestige-story", { steps: 2 });
  const splitProgress = Math.min(1, Math.max(0, (progress - 0.25) / 0.5));

  return (
    <section
      ref={ref}
      data-section="prestige-story"
      className="prestige-section prestige-dark relative py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 lg:px-10">
        <div className="text-center">
          <div className="prestige-eyebrow inline-flex items-center gap-2" style={{ color: "hsl(var(--pr-gold-light))" }}>
            ✦ Il problema · La soluzione
          </div>
          <h2 className="prestige-display mt-4 text-3xl font-semibold sm:text-5xl md:text-6xl">
            Da <span className="text-red-400/80 italic line-through decoration-red-400/40">caos quotidiano</span>
            <br />
            a <span className="prestige-gold-text italic">impero ordinato</span>
          </h2>
          <div className="prestige-divider mx-auto mt-6" />
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
            Ogni giorno la tua azienda perde clienti per cose che <em>non dovrebbero</em> succedere.
            Empire le risolve tutte, in modo automatico.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6">
          {/* PRIMA */}
          <div
            className="prestige-card"
            style={{
              borderColor: "hsl(0 60% 50% / 0.25)",
              opacity: 1 - splitProgress * 0.4,
              transform: `translateX(${-splitProgress * 12}px)`,
              transition: "opacity .4s, transform .4s",
            }}
          >
            <div className="prestige-eyebrow mb-3" style={{ color: "hsl(0 70% 70%)" }}>PRIMA · senza Empire</div>
            <h3 className="prestige-display text-2xl sm:text-3xl">Il giorno tipo (frustrante)</h3>
            <ul className="mt-5 space-y-3">
              {PROBLEMI.map((p, i) => {
                const Icon = p.icon;
                return (
                  <li key={i} className="flex items-start gap-3 text-sm sm:text-base" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
                    <span
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      style={{ background: "hsl(0 60% 50% / 0.15)", color: "hsl(0 70% 75%)" }}
                    >
                      <Icon size={15} />
                    </span>
                    <span>{p.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ARROW */}
          <div className="hidden lg:flex items-center justify-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{
                background: "linear-gradient(135deg, hsl(var(--pr-gold-light)), hsl(var(--pr-gold-deep)))",
                color: "hsl(var(--pr-emerald-deep))",
                boxShadow: "0 12px 40px -10px hsl(var(--pr-gold) / 0.6)",
                transform: `scale(${0.85 + splitProgress * 0.3}) rotate(${splitProgress * 360}deg)`,
                transition: "transform .8s cubic-bezier(.22,1,.36,1)",
              }}
            >
              <ArrowRight size={26} strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex justify-center lg:hidden">
            <ArrowRight size={28} className="rotate-90" style={{ color: "hsl(var(--pr-gold))" }} />
          </div>

          {/* DOPO */}
          <div
            className="prestige-card"
            style={{
              borderColor: "hsl(var(--pr-gold) / 0.4)",
              transform: `translateX(${splitProgress * 12}px)`,
              boxShadow: `0 ${20 + splitProgress * 20}px 60px -20px hsl(var(--pr-gold) / ${0.2 + splitProgress * 0.3})`,
              transition: "transform .4s, box-shadow .4s",
            }}
          >
            <div className="prestige-eyebrow mb-3" style={{ color: "hsl(var(--pr-gold-light))" }}>DOPO · con Empire</div>
            <h3 className="prestige-display text-2xl sm:text-3xl">Il giorno tipo (fluido)</h3>
            <ul className="mt-5 space-y-3">
              {SOLUZIONI.map((p, i) => {
                const Icon = p.icon;
                return (
                  <li key={i} className="flex items-start gap-3 text-sm sm:text-base" style={{ color: "hsl(var(--pr-text-on-dark))" }}>
                    <span
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      style={{ background: "hsl(var(--pr-gold) / 0.18)", color: "hsl(var(--pr-gold-light))" }}
                    >
                      <Icon size={15} />
                    </span>
                    <span>{p.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
