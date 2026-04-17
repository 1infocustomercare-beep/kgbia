import { motion } from "framer-motion";
import MobileCarousel from "./MobileCarousel";

const STEPS = [
  {
    n: "01",
    title: "Discovery & Strategia",
    desc: "Audit completo del business, analisi dei processi e identificazione dei punti di automazione ad alto impatto con roadmap personalizzata.",
    days: "Giorno 1-3",
    tone: "gold",
  },
  {
    n: "02",
    title: "Design & Architettura",
    desc: "Sito premium responsive, dashboard verticale, identità visiva e struttura agenti AI allineati al posizionamento del brand.",
    days: "Giorno 4-7",
    tone: "violet",
  },
  {
    n: "03",
    title: "Sviluppo & Integrazione",
    desc: "Implementazione tecnica, configurazione agenti e integrazione con WhatsApp, POS e gestionali in ambiente controllato.",
    days: "Giorno 8-12",
    tone: "blue",
  },
  {
    n: "04",
    title: "Onboarding & Lancio",
    desc: "Formazione del team, migrazione dati, attivazione agenti AI e pubblicazione live con affiancamento operativo dedicato.",
    days: "Giorno 13-14",
    tone: "emerald",
  },
  {
    n: "05",
    title: "Ottimizzazione Continua",
    desc: "Monitoraggio KPI, training sui dati reali ed espansione progressiva delle automazioni per aumentare margine e controllo.",
    days: "Mese 1+",
    tone: "violet",
  },
];

export default function ProcessSection() {
  return (
    <section
      id="processo"
      className="landing-section relative overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12"
      data-theme="dark"
    >
      <div className="landing-section-glow" data-tone="violet" />

      <div className="relative mx-auto max-w-[1180px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-7 max-w-[760px] text-center sm:mb-8"
          data-tone="gold"
        >
          <span className="landing-pill mb-4 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em]">
            Come lavoriamo
          </span>
          <h2 className="font-heading text-[clamp(1.8rem,4.7vw,3.2rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-foreground">
            Da idea a struttura operativa
            <span className="block landing-heading-gradient">in 14 giorni.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-[clamp(0.92rem,1.55vw,1rem)] leading-[1.68] text-foreground/74">
            Timeline chiara, senza vuoti visivi e senza sezioni spezzate: ogni step prepara il successivo e porta al go-live.
          </p>
        </motion.div>

        {/* Mobile: carousel of step cards */}
        <div className="md:hidden">
          <MobileCarousel autoplayMs={5500} ariaLabel="Processo in 14 giorni">
            {STEPS.map((step) => (
              <div key={step.n} className="landing-surface h-full rounded-[24px] p-5" data-tone={step.tone}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="landing-icon-frame grid h-12 w-12 place-items-center rounded-2xl font-heading text-base font-extrabold">
                    {step.n}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60">
                    {step.days}
                  </div>
                </div>
                <h3 className="mb-2 font-heading text-lg font-extrabold tracking-[-0.03em] text-foreground">
                  {step.title}
                </h3>
                <p className="text-[13px] leading-[1.72] text-foreground/76">{step.desc}</p>
              </div>
            ))}
          </MobileCarousel>
        </div>

        {/* Desktop: timeline */}
        <div className="relative mx-auto hidden max-w-[920px] pb-1 pl-16 sm:pl-20 md:block">
          <div className="absolute bottom-4 left-[22px] top-4 w-px bg-[linear-gradient(180deg,hsl(var(--gold)/0.42),hsl(var(--empire-violet)/0.42),hsl(var(--accent)/0.42))] sm:left-[31px]" />

          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            {STEPS.map((step, index) => (
              <motion.article
                key={step.n}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.07, duration: 0.6 }}
                className="relative"
                data-tone={step.tone}
              >
                <div className="landing-icon-frame absolute left-[-64px] top-5 z-10 grid h-11 w-11 place-items-center rounded-2xl font-heading text-sm font-extrabold sm:left-[-80px] sm:h-14 sm:w-14 sm:text-lg">
                  {step.n}
                </div>

                <div className="landing-surface rounded-[24px] p-5 sm:rounded-[28px] sm:p-6 lg:p-7">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60">
                    {step.days}
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-extrabold tracking-[-0.03em] text-foreground lg:text-[1.35rem]">
                    {step.title}
                  </h3>
                  <p className="max-w-[60ch] text-[13px] leading-[1.72] text-foreground/76 sm:text-[14px]">
                    {step.desc}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
