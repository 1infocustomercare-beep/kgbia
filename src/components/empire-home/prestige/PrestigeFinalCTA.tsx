import { ArrowRight, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { scrollToSection } from "@/lib/home-scroll";

export default function PrestigeFinalCTA() {
  const navigate = useNavigate();
  return (
    <section
      id="contatti"
      data-section="prestige-final-cta"
      className="prestige-section prestige-dark relative overflow-hidden py-24 sm:py-32"
    >
      {/* Gradiente radiale oro che pulsa */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 prestige-final-halo"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 50% 50%, hsl(var(--pr-gold) / 0.28), transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-5 lg:px-10 text-center">
        <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-light))" }}>
          ✦ Il tuo impero, in 7 giorni
        </div>
        <h2
          className="prestige-display mt-5"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
        >
          Il tuo prossimo cliente sta{" "}
          <span className="prestige-italic prestige-gold-text">scegliendo adesso.</span>
        </h2>
        <p
          className="mx-auto mt-5 max-w-xl text-base sm:text-lg"
          style={{ color: "hsl(var(--pr-muted-on-dark))" }}
        >
          Dacci 7 giorni: costruiamo il tuo sistema AI, lo colleghiamo al tuo telefono, WhatsApp
          e sito, e lo lanciamo live con te.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            className="prestige-cta justify-center w-full sm:w-auto"
            onClick={() => navigate("/onboarding")}
            aria-label="Inizia ora — vai all'onboarding"
          >
            <span>Inizia ora</span> <ArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("#prestige-lead")}
            className="prestige-cta-ghost justify-center w-full sm:w-auto"
            aria-label="Parla con un consulente"
          >
            <Phone size={14} /> <span>Parla con un consulente</span>
          </button>
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.24em]" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
          Setup 7 giorni · Assistenza in italiano · Codice di tua proprietà
        </p>
      </div>

      <style>{`
        .prestige-final-halo { animation: prestige-final-pulse 6s ease-in-out infinite; }
        @keyframes prestige-final-pulse {
          0%, 100% { opacity: .85; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.05); }
        }
        @media (prefers-reduced-motion: reduce) {
          .prestige-final-halo { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
