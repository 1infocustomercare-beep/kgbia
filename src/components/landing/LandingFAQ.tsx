import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS: [string, string][] = [
  ["Quanto tempo serve per la mia app?", "In media 7-14 giorni lavorativi. Progetti complessi fino a 21 giorni. Aggiornamenti quotidiani."],
  ["Posso personalizzare tutto?", "Sì. Colori, logo, font, layout, funzionalità — tutto personalizzabile. Il TUO brand, nessun logo Empire."],
  ["Come funzionano le rate?", "Rate a TAN 0% — dividi in 3 rate mensili senza interessi."],
  ["Cosa succede dopo il pagamento?", "Paghi solo il canone mensile (da €0 a €49/mese) + commissioni (da 0% a 2%). Empire: €0 per 24 mesi."],
  ["Gli agenti IA sono autonomi?", "Sì. Lavorano 24/7. Review Shield filtra recensioni, Content AI genera post, GhostManager recupera clienti."],
  ["Posso aggiungere agenti extra?", "Certo. €29/mese ciascuno (sconto 30% clienti Empire). Attivi/disattivi dalla dashboard."],
  ["Che supporto offrite?", "Digital Start: email. Growth AI: prioritario 7/7. Empire: Account Manager VIP, risposta in 2h."],
  ["Funziona per il mio settore?", "25+ settori supportati: ristorazione, fitness, beauty, hotel, legal, immobiliare, healthcare e molti altri."],
  ["Posso vedere una demo?", "Certamente! Demo gratuita di 15 minuti nel tuo settore specifico."],
  ["Garanzia rimborso?", "Sì — 90 giorni. Se non vedi miglioramenti misurabili, rimborso integrale."],
];

export default function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 lg:py-24" style={{ background: "linear-gradient(180deg, #020204 0%, #0d0d1a 50%, #020204 100%)" }}>
      <div className="max-w-[1320px] mx-auto px-5">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-5">
            <span className="w-5 h-[1.5px] bg-[#7eb7be]" />FAQ
          </span>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold text-white">
            Domande <span className="bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">Frequenti</span>
          </h2>
        </div>

        <div className="max-w-[760px] mx-auto flex flex-col gap-1.5">
          {FAQS.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`rounded-2xl border overflow-hidden transition-colors ${isOpen ? "border-white/[0.14]" : "border-white/[0.07]"}`}>
                <button onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex justify-between items-center py-4 px-5 text-left text-white text-sm font-semibold font-heading hover:text-[#7eb7be] transition-colors gap-3">
                  <span>{q}</span>
                  <span className={`text-lg text-[#7eb7be] transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-45" : ""}`}>+</span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}>
                      <p className="px-5 pb-4 text-[13px] text-white/55 leading-[1.7]">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
