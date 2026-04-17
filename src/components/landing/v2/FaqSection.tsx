import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ = [
  {
    q: "In quanto tempo posso essere operativo?",
    a: "Il deploy completo (sito + dashboard + agenti AI configurati) avviene in 14 giorni lavorativi. Per Empire Pro/Elite includiamo onboarding guidato e formazione del team.",
  },
  {
    q: "Cosa succede se non sono soddisfatto?",
    a: "Garanzia 90 giorni soddisfatti o rimborsati. Senza domande, senza penali, senza burocrazia. Restituiamo l'intero investimento se l'AI non genera valore tangibile.",
  },
  {
    q: "I miei dati sono al sicuro?",
    a: "Infrastruttura cloud europea, conforme GDPR. Cifratura end-to-end dei dati sensibili. Backup automatici. Conformità AI Act 2026 nativa. I tuoi dati sono solo tuoi.",
  },
  {
    q: "Devo essere esperto di tecnologia?",
    a: "Assolutamente no. La piattaforma è progettata per imprenditori, non per tecnici. L'Empire WhatsApp Orchestrator ti permette di gestire tutto via voce, come parlare a un assistente.",
  },
  {
    q: "Posso integrarla con i miei sistemi attuali?",
    a: "Sì. Supportiamo integrazioni native con i principali POS, CRM, gestionali, piattaforme di delivery, sistemi di prenotazione. Per Empire Elite costruiamo integrazioni su misura.",
  },
  {
    q: "Come funziona il pagamento?",
    a: "Una tantum + canone mensile di mantenimento. La quota una tantum è rateizzabile in 3 o 6 rate senza interessi. Pagamenti sicuri tramite Stripe.",
  },
  {
    q: "Posso scegliere solo alcuni agenti?",
    a: "Sì, completamente modulabile. Puoi partire con il pacchetto base e attivare nuovi agenti man mano che cresci. Ogni agente è un'unità indipendente attivabile/disattivabile.",
  },
  {
    q: "Funziona per il mio settore specifico?",
    a: "Copriamo 25+ settori verticali con dashboard e agenti dedicati. Se il tuo settore non è ancora supportato, lo costruiamo su misura entro 30 giorni con il pacchetto Elite.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 px-5 overflow-hidden">
      <div className="relative max-w-[860px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[2px] mb-4 border border-white/15 text-white/70 bg-white/[0.03]">
            Domande Frequenti
          </span>
          <h2 className="text-[clamp(2rem,5vw,3.2rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] mb-4 text-white">
            Tutto quello che vuoi sapere.
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQ.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-white/[0.07] backdrop-blur-xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span className="text-[14px] sm:text-[15px] font-heading font-semibold text-white">{f.q}</span>
                <span
                  className="flex-shrink-0 w-8 h-8 rounded-full grid place-items-center border border-white/10 text-white/70 transition-transform"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-[13px] text-white/65 leading-[1.7]">{f.a}</div>
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
