import { Check, Sparkles, Crown, Rocket, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    icon: Rocket,
    name: "Digital Start",
    tagline: "Per partire subito",
    price: "€1.997",
    period: " una tantum",
    setup: "+ €49/mese · 90 giorni senza impegno",
    highlight: false,
    features: [
      "Setup completo",
      "App white-label",
      "Dashboard operativa",
      "Sito professionale + WhatsApp AI",
      "Supporto dedicato",
    ],
    cta: "Inizia ora",
  },
  {
    icon: Crown,
    name: "Growth AI",
    tagline: "Il più scelto",
    price: "€4.997",
    period: " una tantum",
    setup: "+ €29/mese · 90 giorni senza impegno",
    highlight: true,
    features: [
      "Tutto di Digital Start +",
      "AI & automazioni avanzate",
      "CRM avanzato",
      "Voice agent telefonico AI",
      "Supporto prioritario",
    ],
    cta: "Attiva Growth AI",
  },
  {
    icon: Sparkles,
    name: "Empire Domination",
    tagline: "Tutto incluso",
    price: "€7.997",
    period: " una tantum",
    setup: "+ €0/mese · Account manager dedicato",
    highlight: false,
    features: [
      "Tutto di Growth AI +",
      "0% commissioni",
      "AI avanzata su misura",
      "Multi-sede / multi-brand",
      "SLA prioritario",
    ],
    cta: "Parla con noi",
  },
];

export default function MinimalPackages() {
  const navigate = useNavigate();
  return (
    <section id="pricing" className="relative w-full bg-[#0a0d12] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full border border-amber-400/30 bg-amber-400/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-300">
            Pacchetti
          </span>
          <h2 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
            Scegli il tuo <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">Empire</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/60 sm:text-lg">
            Tre pacchetti chiari. Nessuna sorpresa. Cancelli quando vuoi.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.name}
                className={`relative flex flex-col rounded-2xl border p-6 transition-all hover:-translate-y-1 ${
                  p.highlight
                    ? "border-amber-400/50 bg-gradient-to-b from-amber-400/[0.08] to-transparent shadow-[0_20px_60px_-20px_rgba(251,191,36,0.35)]"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
                    Più scelto
                  </div>
                )}
                <Icon className={`h-8 w-8 ${p.highlight ? "text-amber-300" : "text-white/70"}`} />
                <h3 className="mt-4 text-2xl font-bold text-white">{p.name}</h3>
                <p className="text-sm text-white/50">{p.tagline}</p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{p.price}</span>
                  <span className="text-sm text-white/50">{p.period}</span>
                </div>
                <p className="mt-1 text-xs text-white/40">{p.setup}</p>

                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${p.highlight ? "text-amber-300" : "text-emerald-400"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate("/onboarding")}
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all ${
                    p.highlight
                      ? "bg-gradient-to-r from-amber-300 to-amber-500 text-black hover:shadow-[0_10px_30px_-5px_rgba(251,191,36,0.6)]"
                      : "border border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  {p.cta} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-white/40">
          Tutti i piani: 90 giorni soddisfatti o rimborsati · IVA esclusa · Nessun vincolo
        </p>
      </div>
    </section>
  );
}
