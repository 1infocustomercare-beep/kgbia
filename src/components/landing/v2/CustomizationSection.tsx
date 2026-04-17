import { motion } from "framer-motion";
import { Code2, Palette, Plug, Workflow } from "lucide-react";

const CUSTOM = [
  {
    Icon: Palette,
    title: "Brand identity su misura",
    desc: "Colori, tono visivo, tipografia, immagini e gerarchia costruiti per sembrare immediatamente premium nel tuo settore.",
    tone: "gold",
  },
  {
    Icon: Workflow,
    title: "Funnel settoriale dedicato",
    desc: "Ogni sezione racconta valore, elimina attrito e porta il cliente al passo successivo con naturalezza.",
    tone: "violet",
  },
  {
    Icon: Code2,
    title: "Agenti AI custom",
    desc: "Funzioni specifiche per il tuo business, integrate direttamente nei processi operativi e commerciali.",
    tone: "blue",
  },
  {
    Icon: Plug,
    title: "Integrazioni reali",
    desc: "CRM, POS, gestionali, WhatsApp, prenotazioni e sistemi esterni connessi senza compromettere l’esperienza.",
    tone: "emerald",
  },
];

export default function CustomizationSection() {
  return (
    <section id="personalizzazione" className="relative overflow-hidden px-4 py-28 sm:px-6 lg:px-10">
      <div className="landing-section-glow" data-tone="blue" />

      <div className="relative mx-auto max-w-[1280px]">
        <div className="mx-auto mb-16 max-w-[760px] text-center" data-tone="blue">
          <span className="landing-pill mb-5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em]">Personalizzazione totale</span>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-heading font-extrabold leading-[0.92] tracking-[-0.05em] text-foreground">
            Nessun template. <span className="landing-heading-gradient">Solo strutture ad alto valore percepito.</span>
          </h2>
          <p className="mt-5 text-[clamp(0.98rem,1.7vw,1.08rem)] leading-[1.74] text-foreground/68">
            Design, funnel, copy, preview, automazioni e agenti vengono adattati al tuo mercato per rendere la home una leva di conversione, non una semplice pagina.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {CUSTOM.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.65 }}
              className="landing-surface rounded-[30px] p-7 lg:p-8"
              data-tone={item.tone}
            >
              <div className="landing-icon-frame mb-5 h-14 w-14">
                <item.Icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="font-heading text-xl font-extrabold tracking-[-0.04em] text-foreground">{item.title}</h3>
              <p className="mt-3 max-w-[34ch] text-sm leading-[1.72] text-foreground/64">{item.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
