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
    a: "Hosting premium, aggiornamenti continui agli agenti AI, nuove funzionalità rilasciate, supporto tecnico, monitoraggio KPI, nuove integrazioni. Tutto incluso, niente sorprese, niente costi extra.",
  },
  {
    q: "Posso cambiare pacchetto in corsa?",
    a: "Sì. Upgrade in qualsiasi momento, paghi solo la differenza pro-rata. Il downgrade avviene al rinnovo successivo. Massima flessibilità per scalare al ritmo del tuo business.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="landing-section relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28" data-theme="dark">
      <div className="relative max-w-[900px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[3px] mb-5 border border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/5 backdrop-blur-md">
            Domande Frequenti
          </span>
          <h2 className="text-[clamp(2rem,5vw,3.4rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] mb-4 text-white">
            Tutto chiaro,
            <span className="block bg-gradient-to-r from-[#D4AF37] to-[#7C3AED] bg-clip-text text-transparent">
              prima di partire.
            </span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQ.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-white/[0.08] backdrop-blur-xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left group"
              >
                <span className="text-white font-semibold text-[15px] lg:text-[16px] group-hover:text-[#D4AF37] transition-colors">
                  {f.q}
                </span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 w-8 h-8 rounded-full grid place-items-center border border-white/10 group-hover:border-[#D4AF37]/40 group-hover:bg-[#D4AF37]/10 transition-all"
                >
                  <Plus className="w-4 h-4 text-white/70" strokeWidth={2.5} />
                </motion.span>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-white/65 text-[14px] leading-[1.7]">{f.a}</div>
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
