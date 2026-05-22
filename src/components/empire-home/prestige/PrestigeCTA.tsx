import { ArrowRight, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmpireScrollDirector } from "../ScrollDirector";

export default function PrestigeCTA() {
  const navigate = useNavigate();
  const { ref } = useEmpireScrollDirector<HTMLDivElement>("prestige-cta", { steps: 1 });

  return (
    <section
      ref={ref}
      data-section="prestige-cta"
      className="prestige-section prestige-light pt-32 pb-24 sm:pt-40 sm:pb-32"
    >
      <div className="mx-auto max-w-4xl px-5 text-center lg:px-10">
        <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-deep))" }}>
          ✦ La decisione
        </div>
        <h2
          className="prestige-display mt-5 text-4xl font-semibold sm:text-6xl md:text-7xl"
          style={{ color: "hsl(var(--pr-text-on-light))" }}
        >
          Pronto a costruire il <span className="prestige-gold-text italic">tuo impero?</span>
        </h2>
        <div className="prestige-divider mx-auto mt-6" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--pr-gold) / 0.7), transparent)" }} />
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg" style={{ color: "hsl(var(--pr-muted-on-light))" }}>
          Prova Empire <strong>gratis per 90 giorni</strong>. Nessuna carta richiesta. Setup incluso. Se non
          aumenti fatturato e clienti, non paghi un centesimo. Promesso per iscritto.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button className="prestige-cta" onClick={() => navigate("/onboarding")}>
            Inizia gratis ora <ArrowRight size={16} />
          </button>
          <a className="prestige-cta-ghost" href="tel:+390000000000" style={{ color: "hsl(var(--pr-emerald))" }}>
            <Phone size={14} /> Parla con un consulente
          </a>
        </div>

        <p className="mt-8 text-xs" style={{ color: "hsl(var(--pr-muted-on-light))" }}>
          ✓ Setup gratuito · ✓ 90 giorni di prova · ✓ Cancelli quando vuoi · ✓ Soddisfatti o rimborsati
        </p>
      </div>
    </section>
  );
}
