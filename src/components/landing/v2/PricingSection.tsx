import { motion } from "framer-motion";
import { Check, ShieldCheck, Zap, TrendingUp, Crown, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileCarousel from "./MobileCarousel";
import { useHomepageContent, pick } from "@/hooks/useHomepageContent";
import type { PricingPlan } from "@/lib/homepage-content";

const ICON_MAP: Record<string, any> = { Sparkles, TrendingUp, Crown, Zap, ShieldCheck };
const TONE_TO_ICON: Record<string, any> = { blue: Sparkles, gold: TrendingUp, violet: Crown };

const PLANS_DEFAULT: PricingPlan[] = [
  {
    name: "Digital Start",

    setup: "€1.997",
    setupRate: "o 3× €697",
    monthly: "€49",
    desc: "Ingresso premium per chi vuole iniziare a delegare all'AI le attività ripetitive del giorno per giorno.",
    valueLine: "Sostituisce ~€1.200/mese di lavoro umano",
    saved: "€14.400/anno",
    features: [
      "Sito premium su misura",
      "Dashboard verticale completa",
      "5 agenti AI essenziali",
      "WhatsApp operativo 24/7",
      "Onboarding guidato (14 giorni)",
    ],
    bestFor: "1 sede · fino a 30 ordini/giorno",
    tone: "blue",
    cta: "Inizia con Digital Start",
  },
  {
    name: "Empire Pro",

    setup: "€3.997",
    setupRate: "o 6× €697",
    monthly: "€149",
    desc: "La configurazione completa per scalare acquisizione, vendite e operations senza assumere personale.",
    valueLine: "Sostituisce ~€4.500/mese di lavoro umano",
    saved: "€54.000/anno",
    features: [
      "Tutto Digital Start +",
      "25+ agenti specializzati",
      "Voice Agent telefonico 24/7",
      "Lead engine + CRM integrato",
      "Personalizzazione verticale",
      "Account manager dedicato",
    ],
    bestFor: "1-3 sedi · scalabilità immediata",
    tone: "gold",
    featured: true,
    badge: "Più scelto · 73% sceglie questo",
    cta: "Sblocca Empire Pro",
  },
  {
    name: "Empire Elite",

    setup: "€9.997",
    setupRate: "o 6× €1.747",
    monthly: "€299",
    desc: "Infrastruttura proprietaria, AI custom e strategia enterprise per chi vuole dominare la categoria.",
    valueLine: "Sostituisce un team di 8-12 persone",
    saved: "€180k+/anno",
    features: [
      "Tutto Empire Pro +",
      "98 agenti AI completi",
      "Agenti custom per il tuo brand",
      "Integrazioni illimitate",
      "Multi-brand · multi-sede",
      "Priority support 24/7",
    ],
    bestFor: "Catene · franchising · enterprise",
    tone: "violet",
    cta: "Parla con un consulente",
  },
];

export default function PricingSection() {
  const navigate = useNavigate();
  const { content } = useHomepageContent();
  const pc = content.pricing ?? {};
  const PLANS = pick(pc.plans, PLANS_DEFAULT);
  const PILL_LABEL = pick(pc.eyebrow, "Investimento · ROI · Scala");
  const TITLE_LEAD = pick(pc.titleLead, "Smetti di pagare stipendi.");
  const TITLE_ACC = pick(pc.titleAccent, "Inizia a pagare risultati.");
  const PR_SUB = pick(pc.subtitle, "Setup una tantum (rateizzabile) + mantenimento mensile. Ogni piano si ripaga in 2–4 mesi sostituendo costi operativi reali.");
  const TRUST_STRIP = pick(pc.trustStrip, ["Garanzia 90 giorni", "Cambio piano in qualsiasi momento", "Setup rateizzabile 3× o 6×"]);
  const BOTTOM_STATS = pick(pc.bottomStats, [
    { value: "14 giorni", label: "Time to live" },
    { value: "847+", label: "Business attivi" },
    { value: "€2.8M", label: "Risparmiati nel 2024" },
  ]);

  return (
    <section id="prezzi" className="landing-section relative overflow-visible px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20" data-theme="light">
      <div className="landing-section-glow" data-tone="gold" />

      <div className="relative mx-auto max-w-[1320px]">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-10 max-w-[820px] text-center sm:mb-14"
          data-tone="gold"
        >
          <span className="landing-pill mb-4 inline-flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em]">
            <Zap className="h-3 w-3" strokeWidth={2.5} /> Investimento · ROI · Scala
          </span>
          <h2 className="text-[clamp(1.8rem,5vw,3.6rem)] font-heading font-extrabold leading-[0.94] tracking-[-0.05em] text-foreground">
            Smetti di pagare stipendi. <span className="landing-heading-gradient">Inizia a pagare risultati.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-[clamp(0.95rem,1.6vw,1.05rem)] leading-[1.68] text-foreground/78">
            Setup una tantum (rateizzabile) + mantenimento mensile. Ogni piano si ripaga in <strong className="text-foreground">2–4 mesi</strong> sostituendo costi operativi reali.
          </p>

          {/* Trust strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-foreground/65 sm:text-[13px]">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-accent" /> Garanzia 90 giorni</span>
            <span className="text-foreground/25">•</span>
            <span>Cambio piano in qualsiasi momento</span>
            <span className="text-foreground/25">•</span>
            <span>Setup rateizzabile 3× o 6×</span>
          </div>
        </motion.div>

        {(() => {
          const renderPlan = (plan: PricingPlan, index: number, inCarousel = false) => {
            const Icon = TONE_TO_ICON[plan.tone ?? "gold"] ?? Sparkles;
            return (
              <motion.article
                key={plan.name}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: inCarousel ? 0 : index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8 }}
                className={`landing-surface relative flex h-full flex-col rounded-[26px] p-5 sm:p-6 lg:p-7 ${
                  plan.featured ? "ring-2 ring-primary/40 lg:scale-[1.03] lg:shadow-[0_32px_80px_-24px_hsl(var(--primary)/0.45)]" : ""
                }`}
                data-tone={plan.tone}
              >
                {/* Badge featured */}
                {plan.badge ? (
                  <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                    <span className="landing-pill whitespace-nowrap bg-primary px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-primary-foreground shadow-lg">
                      ★ {plan.badge}
                    </span>
                  </div>
                ) : null}

                {/* Header with icon */}
                <div className="mb-5 flex items-start gap-3">
                  <div className="landing-icon-frame flex h-11 w-11 items-center justify-center rounded-xl">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-2xl font-extrabold tracking-[-0.04em] text-foreground">{plan.name}</h3>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">{plan.bestFor}</p>
                  </div>
                </div>

                <p className="mb-5 text-sm leading-[1.65] text-foreground/78">{plan.desc}</p>

                {/* Price block */}
                <div className="mb-5 rounded-[22px] border border-border/75 bg-background/85 p-5 backdrop-blur-xl">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-foreground/60">Setup una tantum</div>
                  <div className="mt-1.5 flex items-end gap-2">
                    <span className="font-heading text-[44px] font-extrabold leading-none tracking-[-0.06em] text-foreground sm:text-5xl">
                      {plan.setup}
                    </span>
                    <span className="pb-1.5 text-[11px] text-foreground/55">{plan.setupRate}</span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1.5 border-t border-border/50 pt-3">
                    <span className="font-heading text-2xl font-bold text-foreground">{plan.monthly}</span>
                    <span className="text-[12px] text-foreground/65">/mese mantenimento</span>
                  </div>

                  {/* ROI line */}
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-accent/10 px-2.5 py-2">
                    <TrendingUp className="h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2.5} />
                    <div className="text-[11px] leading-[1.35] text-foreground/82">
                      <span className="font-semibold">{plan.valueLine}</span>
                      <span className="block text-foreground/60">Risparmio: <strong className="text-accent">{plan.saved}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <ul className="mb-6 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-[13px] leading-[1.55] text-foreground/82 sm:text-sm">
                      <span className="landing-icon-frame mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    const planParam =
                      plan.name === "Digital Start" ? "essential"
                      : plan.name === "Empire Pro" ? "smart_ia"
                      : "empire_pro";
                    navigate(`/auth?plan=${planParam}&mode=register`);
                  }}
                  className={`group ${plan.featured ? "landing-button-primary" : "landing-button-secondary"} w-full px-6 py-3.5 text-sm font-semibold`}
                >
                  {plan.cta}
                  <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-1">→</span>
                </button>
              </motion.article>
            );
          };

          return (
            <>
              {/* Mobile: carousel */}
              <div className="lg:hidden">
                <MobileCarousel autoplayMs={0} ariaLabel="Pacchetti Empire">
                  {PLANS.map((plan, i) => renderPlan(plan, i, true))}
                </MobileCarousel>
              </div>

              {/* Desktop: 3-col grid */}
              <div className="hidden items-stretch gap-4 pt-3 lg:grid lg:grid-cols-3 lg:gap-5">
                {PLANS.map((plan, i) => renderPlan(plan, i, false))}
              </div>
            </>
          );
        })()}

        {/* Comparison strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-10 max-w-[920px] rounded-[20px] border border-border/60 bg-card/40 p-5 backdrop-blur-md sm:p-6"
        >
          <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
            <div>
              <div className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">14 giorni</div>
              <div className="mt-1 text-[12px] uppercase tracking-[0.2em] text-foreground/60">Time to live</div>
            </div>
            <div className="sm:border-x sm:border-border/40">
              <div className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">847+</div>
              <div className="mt-1 text-[12px] uppercase tracking-[0.2em] text-foreground/60">Business attivi</div>
            </div>
            <div>
              <div className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">€2.8M</div>
              <div className="mt-1 text-[12px] uppercase tracking-[0.2em] text-foreground/60">Risparmiati nel 2024</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
