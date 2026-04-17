import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const FAQ = [
  {
    q: "In quanto tempo sono operativo con Empire AI?",
    a: "Dal primo contatto al sito attivo con agenti AI operativi: 14 giorni lavorativi. Discovery e strategia (3 giorni), design e sviluppo (9 giorni), onboarding e lancio (2 giorni). Affiancamento dedicato dal giorno 1.",
  },
  {
    q: "Quanto risparmio davvero sul personale?",
    a: "Mediamente i nostri clienti riducono di 1-2 figure operative (centralino, gestione prenotazioni, recall, social, fatturazione). Significa €1.800-€3.500 al mese di costi in meno, con un servizio più rapido e senza errori umani.",
  },
  {
    q: "Funziona anche per il mio settore specifico?",
    a: "Empire copre 25+ settori verticali: ristorazione, beauty, fitness, healthcare, NCC, hotel, retail, studi professionali, real estate, e-commerce, palestre, cliniche e altro. Ogni configurazione è costruita sulle reali esigenze operative del tuo mercato.",
  },
  {
    q: "Devo avere competenze tecniche per usarlo?",
    a: "Zero. Tutto si gestisce da WhatsApp con comandi vocali o testuali, oppure dalla dashboard visuale. Il tuo Account Manager ti segue passo-passo nella formazione e nei primi 30 giorni di utilizzo.",
  },
  {
    q: "I dati dei miei clienti sono al sicuro?",
    a: "Infrastruttura enterprise europea, conformità GDPR totale, crittografia end-to-end, backup automatici giornalieri. Empire è già operativa nei settori sanitario, finanziario e legale.",
  },
  {
    q: "Posso integrare Empire con il mio gestionale o POS?",
    a: "Sì. Integriamo qualsiasi sistema esistente (POS, gestionali, CRM, marketplace, fatturazione elettronica, calendari, WhatsApp Business). I tuoi dati restano tuoi e tutti i sistemi parlano tra loro.",
  },
  {
    q: "Cosa include il canone mensile di mantenimento?",
    a: "Hosting premium, aggiornamenti continui agli agenti AI, nuove funzionalità rilasciate, supporto tecnico, monitoraggio KPI, nuove integrazioni. Tutto incluso, niente sorprese.",
  },
  {
    q: "Posso cambiare pacchetto in corsa?",
    a: "Sì. Upgrade in qualsiasi momento, paghi solo la differenza pro-rata. Il downgrade avviene al rinnovo successivo. Massima flessibilità per scalare al ritmo del tuo business.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="landing-section relative overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16"
      data-theme="dark"
    >
      <div className="landing-section-glow" data-tone="violet" />

      <div className="relative mx-auto max-w-[900px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-9 text-center"
          data-tone="gold"
        >
          <span className="landing-pill mb-4 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em]">
            Domande Frequenti
          </span>
          <h2 className="font-heading text-[clamp(1.9rem,5vw,3.4rem)] font-extrabold leading-[0.94] tracking-[-0.04em] text-foreground">
            Tutto chiaro,
            <span className="block landing-heading-gradient">prima di partire.</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQ.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="landing-surface overflow-hidden rounded-[20px]"
              data-tone={i % 3 === 0 ? "gold" : i % 3 === 1 ? "violet" : "blue"}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
              >
                <span className="text-[15px] font-semibold text-foreground transition-colors group-hover:text-[hsl(var(--landing-accent,var(--primary)))] lg:text-[16px]">
                  {f.q}
                </span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="landing-icon-frame h-8 w-8 flex-shrink-0 rounded-full"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                </motion.span>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-[14px] leading-[1.7] text-foreground/74 sm:px-6">
                      {f.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
