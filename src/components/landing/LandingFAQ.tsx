import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS: [string, string][] = [
  ["In quanto tempo sarà pronta la mia app?", "Il setup standard richiede 7-14 giorni lavorativi. Progetti enterprise fino a 21 giorni. Ricevi aggiornamenti quotidiani durante lo sviluppo."],
  ["Posso personalizzare ogni aspetto?", "Assolutamente. Colori, logo, font, layout, funzionalità — tutto costruito attorno al tuo brand. Nessun logo Empire visibile ai tuoi clienti."],
  ["Come funziona il pagamento a rate?", "Offriamo rateizzazione a TAN 0% — dividi il costo in 3 o 6 rate mensili, senza interessi né spese aggiuntive."],
  ["Quali costi ci sono dopo l'attivazione?", "Solo il canone mensile (da €0 a €49/mese) e una commissione sulle transazioni (da 0% a 2%, in base al piano scelto)."],
  ["Gli agenti IA lavorano davvero da soli?", "Sì. Ogni agente opera 24/7 in modo autonomo. Review Shield gestisce le recensioni, Content AI crea contenuti, GhostManager recupera clienti persi — tutto senza il tuo intervento."],
  ["Posso aggiungere o rimuovere agenti?", "Certo. Ogni agente aggiuntivo costa €29/mese (sconto 30% per clienti Empire). Li attivi e disattivi in un click dalla dashboard."],
  ["Che tipo di supporto offrite?", "Digital Start: supporto email dedicato. Growth AI: supporto prioritario 7/7. Empire: Account Manager VIP con risposta garantita entro 2 ore."],
  ["Funziona per qualsiasi tipo di business?", "Supportiamo 25+ settori: ristorazione, fitness, beauty, hotel, legal, immobiliare, healthcare, NCC, e-commerce e molti altri."],
  ["Posso provare prima di decidere?", "Certamente. Offriamo una demo gratuita di 15 minuti nel tuo settore specifico, più una garanzia soddisfatti o rimborsati di 90 giorni."],
  ["Cosa succede se non sono soddisfatto?", "Rimborso integrale entro 90 giorni. Nessuna domanda, nessun vincolo. Il rischio è completamente nostro."],
];

export default function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Premium background */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #070714 0%, #0b0b22 30%, #0d0d26 60%, #070714 100%)",
      }} />
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(126,183,190,0.03) 0%, transparent 60%)",
      }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative z-[1] max-w-[1320px] mx-auto px-5">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-bold mb-5">
            <span className="w-6 h-[2px] bg-gradient-to-r from-[#7eb7be] to-transparent" />DOMANDE FREQUENTI
          </span>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold text-white">
            Tutto Quello che <span className="bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">Devi Sapere</span>
          </h2>
          <p className="text-white/50 max-w-[480px] mx-auto text-[15px] mt-3 leading-[1.7]">
            Risposte chiare alle domande più comuni. Se non trovi quello che cerchi, contattaci.
          </p>
        </div>

        <div className="max-w-[760px] mx-auto flex flex-col gap-2">
          {FAQS.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`rounded-2xl border overflow-hidden transition-all ${isOpen ? "border-white/[0.14] bg-white/[0.03]" : "border-white/[0.07] bg-white/[0.01]"}`}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex justify-between items-center py-4.5 px-5 text-left text-white/90 text-[14px] font-semibold font-heading hover:text-[#7eb7be] transition-colors gap-3"
                >
                  <span>{q}</span>
                  <span className={`text-lg text-[#7eb7be] transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-45" : ""}`}>+</span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <p className="px-5 pb-5 text-[13px] text-white/55 leading-[1.8]">{a}</p>
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
