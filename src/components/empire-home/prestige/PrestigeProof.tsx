import { useEmpireScrollDirector } from "../ScrollDirector";

const STATS = [
  { value: "3.500+", label: "Aziende attive in 7 paesi" },
  { value: "24h", label: "Setup medio chiavi in mano" },
  { value: "+38%", label: "Ricavi medi nei primi 90 giorni" },
  { value: "4.9★", label: "Soddisfazione clienti (Google)" },
];

const TESTIMONIALS = [
  {
    quote:
      "Da quando abbiamo Empire, il telefono non squilla più a vuoto. L'AI prende le prenotazioni anche alle 2 di notte. Sabato scorso abbiamo fatto +47 coperti senza un dipendente in più.",
    name: "Marco Riva",
    role: "Pizzeria Strapizzami · Milano",
  },
  {
    quote:
      "Sono un avvocato, non capisco di tecnologia. Ma Empire l'hanno installato loro in due giorni, e adesso le richieste arrivano già filtrate. Ho recuperato 10 ore a settimana.",
    name: "Avv. Chiara De Luca",
    role: "Studio Legale Riva · Roma",
  },
  {
    quote:
      "Il centralino AI parla inglese, francese e arabo. I clienti VIP non aspettano più 3 squilli. Le corse sono cresciute del 30% in tre mesi.",
    name: "Karim El Hassan",
    role: "Empire NCC · Costa Smeralda",
  },
];

export default function PrestigeProof() {
  const { ref } = useEmpireScrollDirector<HTMLDivElement>("prestige-proof", { steps: 2 });

  return (
    <section
      ref={ref}
      data-section="prestige-proof"
      className="prestige-section prestige-dark py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 lg:px-10">
        {/* Stats strip */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="prestige-card text-center"
              style={{ animation: `prestigePop .8s ${i * 0.1}s cubic-bezier(.22,1,.36,1) backwards` }}
            >
              <div className="prestige-display text-3xl sm:text-4xl md:text-5xl prestige-gold-text">{s.value}</div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.2em]" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <div className="text-center">
            <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-light))" }}>
              ✦ Lo dicono loro, non noi
            </div>
            <h2 className="prestige-display mt-3 text-3xl font-semibold sm:text-4xl md:text-5xl">
              Le storie dei nostri <span className="prestige-gold-text italic">imperatori.</span>
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <figure
                key={t.name}
                className="prestige-card"
                style={{ animation: `prestigePop .8s ${0.2 + i * 0.1}s cubic-bezier(.22,1,.36,1) backwards` }}
              >
                <div className="text-3xl leading-none" style={{ color: "hsl(var(--pr-gold) / 0.6)" }}>"</div>
                <blockquote className="mt-2 text-sm leading-relaxed sm:text-base" style={{ color: "hsl(var(--pr-text-on-dark))" }}>
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 border-t pt-4" style={{ borderColor: "hsl(var(--pr-gold) / 0.18)" }}>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes prestigePop {
          from { opacity: 0; transform: translateY(20px) scale(.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </section>
  );
}
