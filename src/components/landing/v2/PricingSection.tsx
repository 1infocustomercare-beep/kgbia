import { motion } from "framer-motion";
import { Check, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PLANS = [
  {
    name: "Digital Start",
    setup: "€1.997",
    monthly: "€49/mese",
    desc: "Ingresso premium per business che vogliono automatizzare i flussi essenziali con un posizionamento superiore.",
    features: ["Sito premium responsive", "Dashboard verticale", "5 agenti AI essenziali", "WhatsApp operativo", "Onboarding guidato"],
    tone: "blue",
  },
  {
    name: "Empire Pro",
    setup: "€3.997",
    monthly: "€149/mese",
    desc: "La configurazione completa per scalare acquisizione, vendite e operations con massima percezione di valore.",
    features: ["25+ agenti specializzati", "Voice Agent 24/7", "Lead engine", "Personalizzazione verticale", "Account manager dedicato"],
    tone: "gold",
    featured: true,
    badge: "Più scelto",
  },
  {
    name: "Empire Elite",
    setup: "€9.997",
    monthly: "€299/mese",
    desc: "Infrastruttura proprietaria, custom AI e strategia enterprise per chi vuole dominare la categoria.",
    features: ["98 agenti completi", "Agenti custom", "Integrazioni illimitate", "Multi-brand", "Priority support"],
    tone: "violet",
  },
];

export default function PricingSection() {
  const navigate = useNavigate();

  return (
    <section id="prezzi" className="landing-section relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28" data-theme="light">
      <div className="landing-section-glow" data-tone="gold" />

      <div className="relative mx-auto max-w-[1320px]">
        <div className="mx-auto mb-16 max-w-[760px] text-center" data-tone="gold">
          <span className="landing-pill mb-5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em]">Pacchetti & ROI</span>
          <h2 className="text-[clamp(2rem,5.2vw,4.1rem)] font-heading font-extrabold leading-[0.92] tracking-[-0.05em] text-foreground">
            Investimenti chiari. <span className="landing-heading-gradient">Impatto misurabile.</span>
          </h2>
          <p className="mt-5 text-[clamp(0.98rem,1.7vw,1.08rem)] leading-[1.72] text-foreground/68">
            Setup una tantum (rateizzabile fino a 6 mesi) + canone di mantenimento. Tutto compreso: agenti AI, hosting premium, aggiornamenti continui, supporto dedicato.
          </p>
        </div>

        <div className="grid items-stretch gap-5 lg:grid-cols-3">
          {PLANS.map((plan, index) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.65 }}
              className={`landing-surface flex rounded-[32px] p-7 lg:p-8 ${plan.featured ? "lg:scale-[1.03]" : ""}`}
              data-tone={plan.tone}
            >
              <div className="flex w-full flex-col">
                <div className="mb-6 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-2xl font-extrabold tracking-[-0.04em] text-foreground">{plan.name}</h3>
                    <p className="mt-3 max-w-[32ch] text-sm leading-[1.7] text-foreground/64">{plan.desc}</p>
                  </div>
                  {plan.badge ? <span className="landing-pill px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em]">{plan.badge}</span> : null}
                </div>

                <div className="mb-6 rounded-[26px] border border-border/75 bg-background/36 p-5 backdrop-blur-xl">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-foreground/46">Setup</div>
                  <div className="mt-2 font-heading text-5xl font-extrabold leading-none tracking-[-0.06em] text-foreground">{plan.setup}</div>
                  <div className="mt-3 text-sm text-foreground/60">{plan.monthly} mantenimento continuo</div>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm leading-[1.65] text-foreground/72">
                      <span className="landing-icon-frame mt-0.5 h-5 w-5 rounded-full">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button onClick={() => navigate("/onboarding")} className={`${plan.featured ? "landing-button-primary" : "landing-button-secondary"} w-full px-6 py-3.5 text-sm font-semibold`}>
                  Scegli {plan.name}
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-sm text-foreground/58">
          <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent" strokeWidth={2} /> Onboarding garantito in 14 giorni</span>
          <span className="hidden sm:inline text-foreground/30">·</span>
          <span>Setup rateizzabile 3× o 6×</span>
          <span className="hidden sm:inline text-foreground/30">·</span>
          <span>Cambio piano in qualsiasi momento</span>
        </div>
      </div>
    </section>
  );
}
