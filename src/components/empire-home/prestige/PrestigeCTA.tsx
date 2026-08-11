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
      className="prestige-section prestige-light pt-20 pb-16 sm:pt-32 sm:pb-24 md:pt-40 md:pb-32"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-5 text-center lg:px-10">
        <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-deep))" }}>
          ✦ La decisione
        </div>
        <h2
          className="prestige-display mt-5 text-3xl font-semibold sm:text-6xl lg:text-7xl break-words leading-tight"
          style={{ color: "hsl(var(--pr-text-on-light))" }}
        >
          Pronto a costruire il <span className="prestige-gold-text italic">tuo impero?</span>
        </h2>
        <div className="prestige-divider mx-auto mt-6" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--pr-gold) / 0.7), transparent)" }} />
        <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base md:text-lg" style={{ color: "hsl(var(--pr-muted-on-light))" }}>
          Setup chiavi in mano in 7 giorni, cancellazione in qualunque momento, soddisfatti o
          rimborsati per iscritto. Decidi tu quando partire.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
          <button className="prestige-cta justify-center w-full sm:w-auto" onClick={() => navigate("/onboarding")}>
            <span className="truncate">Inizia ora</span> <ArrowRight size={16} className="shrink-0" />
          </button>
          <a className="prestige-cta-ghost justify-center w-full sm:w-auto" href="tel:+390000000000" style={{ color: "hsl(var(--pr-emerald))" }}>
            <Phone size={14} className="shrink-0" /> <span className="truncate">Parla con un consulente</span>
          </a>
        </div>

        <p className="mt-8 text-[11px] sm:text-xs leading-relaxed" style={{ color: "hsl(var(--pr-muted-on-light))" }}>
          ✓ Setup in 7 giorni · ✓ Cancelli quando vuoi · ✓ Soddisfatti o rimborsati
        </p>

      </div>
    </section>
  );
}
