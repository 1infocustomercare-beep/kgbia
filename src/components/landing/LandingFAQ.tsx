import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS: [string, string][] = [
  ["In quanto tempo sarà pronta la mia app?", "Il setup standard richiede 7-14 giorni lavorativi. Per progetti enterprise fino a 21 giorni. Ricevi aggiornamenti quotidiani con preview in tempo reale durante tutto lo sviluppo."],
  ["Posso personalizzare ogni aspetto del design?", "Assolutamente sì. Colori, logo, font, layout, funzionalità — tutto costruito attorno al tuo brand. Nessun logo Empire sarà mai visibile ai tuoi clienti. È 100% tuo."],
  ["Come funziona il pagamento a rate?", "Offriamo rateizzazione a TAN 0% su tutti i piani — dividi il costo in 3 o 6 rate mensili senza interessi né spese aggiuntive. Nessuna sorpresa."],
  ["Quali costi ci sono dopo l'attivazione?", "Solo il canone mensile (da €0 a €49/mese in base al piano) e una commissione sulle transazioni (da 0% a 2%). Nessun costo nascosto, mai."],
  ["Gli agenti IA funzionano davvero in autonomia?", "Sì. Ogni agente opera 24/7 senza il tuo intervento. Review Shield gestisce le recensioni, Content AI crea e pubblica contenuti, GhostManager recupera clienti persi — tutto in automatico."],
  ["Posso aggiungere o rimuovere agenti IA?", "Certamente. Ogni agente aggiuntivo costa €29/mese con sconto del 30% per clienti Empire. Li attivi e disattivi con un click dalla dashboard."],
  ["Che tipo di supporto riceverò?", "Digital Start: email dedicata. Growth AI: supporto prioritario 7/7. Empire: Account Manager VIP personale con risposta garantita entro 2 ore."],
  ["Funziona per qualsiasi tipo di business?", "Supportiamo 25+ settori: ristorazione, fitness, beauty, hotel, immobiliare, healthcare, NCC, e-commerce, servizi professionali e molti altri."],
  ["Posso provare prima di decidere?", "Certo. Offriamo una demo live gratuita di 15 minuti nel tuo settore specifico, più una garanzia soddisfatti o rimborsati di 90 giorni su ogni piano."],
  ["E se non fossi soddisfatto?", "Rimborso integrale entro 90 giorni. Nessuna domanda, nessun vincolo contrattuale. Il rischio è completamente a carico nostro — non tuo."],
];

export default function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #080a1c 0%, #0c0e26 50%, #080a1c 100%)" }} />

      <div className="relative z-[1] max-w-[800px] mx-auto px-5">
        <div className="text-center mb-12">
          <span className="inline-block text-[11px] tracking-[3px] uppercase font-bold mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-white/60">
            Domande Frequenti
          </span>
          <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-heading font-bold mb-4 text-white leading-tight">
            Hai Domande?<br />
            <span className="text-white/60">Abbiamo le Risposte.</span>
          </h2>
        </div>

        <div className="flex flex-col gap-2.5">
          {FAQS.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="rounded-xl border overflow-hidden transition-all"
                style={{
                  borderColor: isOpen ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.06)",
                  background: isOpen ? "rgba(201,168,76,0.03)" : "rgba(255,255,255,0.015)",
                }}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex justify-between items-center py-5 px-6 text-left text-white/90 text-[15px] font-semibold hover:text-[#c9a84c] transition-colors gap-4"
                >
                  <span>{q}</span>
                  <span className="text-lg text-[#c9a84c] transition-transform duration-300 flex-shrink-0" style={{ transform: isOpen ? "rotate(45deg)" : "none" }}>+</span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-6 pb-5 text-[14px] text-white/60 leading-[1.85]">{a}</p>
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
