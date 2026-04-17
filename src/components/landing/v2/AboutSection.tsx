import { motion } from "framer-motion";
import { Cpu, ShieldCheck, Target } from "lucide-react";

const PILLARS = [
  { Icon: Cpu, title: "Tecnologia proprietaria", desc: "Un ecosistema AI costruito per dare velocità operativa, design premium e controllo completo su ogni punto del funnel.", tone: "violet" },
  { Icon: Target, title: "Risultati misurabili", desc: "Ogni progetto viene pensato per alzare conversione, valore percepito e redditività con metriche che il cliente capisce subito.", tone: "gold" },
  { Icon: ShieldCheck, title: "Operatività garantita", desc: "Infrastruttura enterprise, go-live in 14 giorni e supporto dedicato senza imprevisti tecnici.", tone: "emerald" },
];

export default function AboutSection() {
  return (
    <section id="chi-siamo" className="landing-section relative overflow-visible px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16" data-theme="light">
      <div className="landing-section-glow" data-tone="violet" />

      <div className="relative mx-auto max-w-[1240px]">
        <div className="mx-auto mb-8 max-w-[820px] text-center" data-tone="gold">
          <span className="landing-pill mb-4 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em]">Chi siamo</span>
          <h2 className="text-[clamp(1.8rem,4.8vw,3.4rem)] font-heading font-extrabold leading-[0.94] tracking-[-0.05em] text-foreground">
            Non facciamo siti vetrina. <span className="landing-heading-gradient">Costruiamo sistemi che convertono.</span>
          </h2>
          <p className="mt-4 text-[clamp(0.94rem,1.55vw,1.02rem)] leading-[1.68] text-foreground/72">
            Empire AI Group unisce strategia da agency high-end, execution product e infrastruttura AI per far percepire immediatamente un salto di categoria.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <motion.article
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.65 }}
              className="landing-surface rounded-[28px] p-5 lg:p-6"
              data-tone={pillar.tone}
            >
              <div className="landing-icon-frame mb-5 h-14 w-14">
                <pillar.Icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="font-heading text-xl font-extrabold tracking-[-0.04em] text-foreground">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-[1.68] text-foreground/72">{pillar.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
