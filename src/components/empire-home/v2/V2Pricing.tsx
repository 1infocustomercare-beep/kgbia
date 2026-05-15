import { useState } from "react";
import { Check, Crown, Rocket, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PLAN_CONFIGS } from "@/lib/subscription-plans";

const PLAN_META = {
  essential: {
    icon: Rocket,
    badge: null as string | null,
    tagline: "Per chi parte e vuole ordine subito.",
    features: [
      "Sito web pubblico ottimizzato",
      "App cliente brandizzata",
      "Dashboard completa & catalogo",
      "Agenda + prenotazioni illimitate",
      "50 gettoni IA/mese",
      "2 membri team",
      "Supporto email",
    ],
  },
  smart_ia: {
    icon: Sparkles,
    badge: "PIÙ SCELTO",
    tagline: "Il piano che fa girare la macchina.",
    features: [
      "Tutto Essential, in più:",
      "1 Agent IA incluso (WhatsApp o Voce)",
      "200 gettoni IA/mese",
      "10 membri team",
      "Review Shield™ + analytics avanzati",
      "Vault Fiscale 2026 (FE + scontrini)",
      "Automazioni WhatsApp + dominio custom",
      "Supporto prioritario in 4 ore",
    ],
  },
  empire_pro: {
    icon: Crown,
    badge: "MASSIMO POTERE",
    tagline: "L'impero completo, account manager dedicato.",
    features: [
      "Tutto Smart IA, in più:",
      "3 Agent IA inclusi",
      "500 gettoni IA/mese",
      "Team illimitato + multi-sede",
      "API access completo",
      "Programma fedeltà avanzato",
      "Account manager dedicato",
      "SLA garantito 99.9%",
      "Funzioni custom prioritarie",
    ],
  },
} as const;

const ORDER: (keyof typeof PLAN_META)[] = ["essential", "smart_ia", "empire_pro"];

export default function V2Pricing() {
  const navigate = useNavigate();
  const [yearly, setYearly] = useState(true);

  return (
    <section id="v2-pricing" className="v2-section relative">
      <div className="mx-auto max-w-6xl px-5 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="v2-eyebrow">PACCHETTI · TUTTI I SETTORI</div>
          <h2 className="v2-display mt-3 text-4xl font-semibold sm:text-5xl">
            Prezzi onesti. <span className="v2-gold-text">Crescita garantita</span>.
          </h2>
          <div className="v2-divider mx-auto mt-5" />
          <p className="mt-4 text-base" style={{ color: "hsl(var(--v2-text-muted))" }}>
            90 giorni di prova totale gratuita. Nessuna carta richiesta.
            Disdici quando vuoi.
          </p>

          {/* Toggle */}
          <div
            className="mx-auto mt-6 inline-flex rounded-full border p-1"
            style={{ borderColor: "hsl(var(--v2-gold) / 0.3)" }}
          >
            <button
              onClick={() => setYearly(false)}
              className="rounded-full px-4 py-1.5 text-xs font-semibold transition-all"
              style={{
                background: !yearly ? "hsl(var(--v2-gold))" : "transparent",
                color: !yearly ? "hsl(var(--v2-emerald-deep))" : "hsl(var(--v2-text-muted))",
              }}
            >
              Mensile
            </button>
            <button
              onClick={() => setYearly(true)}
              className="rounded-full px-4 py-1.5 text-xs font-semibold transition-all"
              style={{
                background: yearly ? "hsl(var(--v2-gold))" : "transparent",
                color: yearly ? "hsl(var(--v2-emerald-deep))" : "hsl(var(--v2-text-muted))",
              }}
            >
              Annuale <span className="ml-1 opacity-70">−18%</span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {ORDER.map((id) => {
            const plan = PLAN_CONFIGS[id];
            const meta = PLAN_META[id];
            const Icon = meta.icon;
            const price = yearly ? plan.yearlyPrice : plan.price;
            const featured = id === "smart_ia";
            return (
              <div
                key={id}
                className="v2-card relative flex flex-col"
                style={{
                  borderColor: featured ? "hsl(var(--v2-gold) / 0.6)" : undefined,
                  background: featured
                    ? "linear-gradient(180deg, hsl(var(--v2-emerald) / 0.95), hsl(var(--v2-emerald-deep)))"
                    : undefined,
                  boxShadow: featured ? "0 30px 80px -30px hsl(var(--v2-gold) / 0.4)" : undefined,
                  transform: featured ? "scale(1.02)" : undefined,
                }}
              >
                {meta.badge && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--v2-gold-light)), hsl(var(--v2-gold)))",
                      color: "hsl(var(--v2-emerald-deep))",
                    }}
                  >
                    {meta.badge}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div
                    className="grid h-10 w-10 place-items-center rounded-xl"
                    style={{
                      background: "hsl(var(--v2-gold) / 0.18)",
                      border: "1px solid hsl(var(--v2-gold) / 0.3)",
                    }}
                  >
                    <Icon size={18} style={{ color: "hsl(var(--v2-gold-light))" }} />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{plan.name}</div>
                    <div className="text-[12px]" style={{ color: "hsl(var(--v2-text-muted))" }}>
                      {meta.tagline}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-baseline gap-2">
                  <div className="v2-display text-5xl font-semibold v2-gold-text">€{price}</div>
                  <div className="text-sm" style={{ color: "hsl(var(--v2-text-muted))" }}>/mese</div>
                </div>
                {yearly && (
                  <div className="mt-1 text-[11px]" style={{ color: "hsl(var(--v2-text-muted))" }}>
                    Fatturato annualmente · risparmi €{(plan.price - plan.yearlyPrice) * 12}/anno
                  </div>
                )}

                <ul className="mt-6 flex-1 space-y-2.5">
                  {meta.features.map((f, i) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--v2-glow))" }} />
                      <span style={{ fontWeight: i === 0 ? 600 : 400 }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={featured ? "v2-cta mt-7 w-full justify-center" : "v2-ghost mt-7 w-full justify-center"}
                  onClick={() => navigate(`/onboarding?plan=${id}`)}
                >
                  Inizia 90 giorni gratis <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Custom call */}
        <div
          className="mt-10 flex flex-col items-center gap-4 rounded-3xl border p-6 text-center sm:flex-row sm:justify-between sm:text-left"
          style={{
            borderColor: "hsl(var(--v2-gold) / 0.25)",
            background: "linear-gradient(135deg, hsl(var(--v2-emerald) / 0.5), hsl(var(--v2-emerald-deep) / 0.5))",
          }}
        >
          <div className="flex-1">
            <div className="v2-eyebrow">SU MISURA · ENTERPRISE</div>
            <div className="mt-2 text-xl font-semibold">Hai bisogno di più? Ti costruiamo l'impero su misura.</div>
            <div className="mt-1 text-sm" style={{ color: "hsl(var(--v2-text-muted))" }}>
              Multi-sede, integrazioni custom, training AI sui tuoi dati, branding totale.
            </div>
          </div>
          <button className="v2-cta" onClick={() => navigate("/onboarding?plan=custom")}>
            Prenota call commerciale <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
