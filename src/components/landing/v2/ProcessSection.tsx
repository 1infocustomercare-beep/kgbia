import { motion } from "framer-motion";

const STEPS = [
  {
    n: "01",
    title: "Discovery & Strategia",
    desc: "Audit completo del business, analisi dei processi, identificazione dei punti di automazione ad alto impatto. Output: roadmap personalizzata.",
    days: "Giorno 1-3",
    tone: "gold",
  },
  {
    n: "02",
    title: "Design & Architettura",
    desc: "Sito premium responsive, dashboard verticale, identità visiva, struttura agenti AI. Tutto allineato al posizionamento del brand.",
    days: "Giorno 4-7",
    tone: "violet",
  },
  {
    n: "03",
    title: "Sviluppo & Integrazione",
    desc: "Implementazione tecnica, configurazione agenti, integrazione WhatsApp, POS, gestionali. Test in ambiente sandbox.",
    days: "Giorno 8-12",
    tone: "blue",
  },
  {
    n: "04",
    title: "Onboarding & Lancio",
    desc: "Formazione del team, migrazione dati, attivazione agenti AI, pubblicazione live. Affiancamento dedicato in produzione.",
    days: "Giorno 13-14",
    tone: "emerald",
  },
  {
    n: "05",
    title: "Ottimizzazione Continua",
    desc: "Monitoraggio KPI, training agenti sui dati reali, espansione delle automazioni. Crescita misurabile mese su mese.",
    days: "Mese 1+",
    tone: "violet",
  },
];

export default function ProcessSection() {
  return (
    <section
      id="processo"
      className="landing-section relative overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16"
      data-theme="dark"
    >
      <div className="landing-section-glow" data-tone="violet" />

      <div className="relative mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-8 max-w-[760px] text-center sm:mb-10"
          data-tone="gold"
        >
          <span className="landing-pill mb-4 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em]">
            Come Lavoriamo
          </span>
          <h2 className="font-heading text-[clamp(1.9rem,5vw,3.6rem)] font-extrabold leading-[0.94] tracking-[-0.04em] text-foreground">
            Da idea a impresa autonoma
            <span className="block landing-heading-gradient">in 14 giorni.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-[clamp(0.95rem,1.6vw,1.05rem)] leading-[1.7] text-foreground/72">
            Un processo ingegnerizzato, replicabile, garantito. Niente sorprese, niente ritardi, solo risultati.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute bottom-4 left-[28px] top-4 w-[2px] bg-[linear-gradient(180deg,hsl(var(--gold)/0.4),hsl(var(--empire-violet)/0.4),hsl(var(--accent)/0.4))] lg:left-1/2 lg:-translate-x-1/2" />

          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.08, duration: 0.65 }}
              className={`relative mb-7 flex items-start gap-5 sm:mb-9 lg:mb-12 lg:w-1/2 ${
                i % 2 === 0 ? "lg:pr-12" : "lg:ml-auto lg:pl-12"
              }`}
              data-tone={s.tone}
            >
              {/* Number badge */}
              <div
                className={`landing-icon-frame relative z-10 grid h-14 w-14 flex-shrink-0 place-items-center rounded-2xl font-heading text-lg font-extrabold ${
                  i % 2 === 0 ? "lg:order-2 lg:-mr-7" : "lg:-ml-7"
                }`}
              >
                {s.n}
              </div>

              {/* Card */}
              <div className="landing-surface flex-1 rounded-[24px] p-5 sm:p-6">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60">
                  {s.days}
                </div>
                <h3 className="mb-2 font-heading text-lg font-extrabold tracking-[-0.03em] text-foreground lg:text-xl">
                  {s.title}
                </h3>
                <p className="text-[13px] leading-[1.7] text-foreground/74">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
