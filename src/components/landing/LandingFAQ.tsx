import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS: [string, string][] = [
  ["In quanto tempo sarà pronta la mia app?", "Il setup standard richiede 7-14 giorni lavorativi. Progetti enterprise fino a 21 giorni. Ricevi aggiornamenti quotidiani."],
  ["Posso personalizzare ogni aspetto?", "Assolutamente. Colori, logo, font, layout, funzionalità — tutto costruito attorno al tuo brand. Nessun logo Empire visibile ai tuoi clienti."],
  ["Come funziona il pagamento a rate?", "Rateizzazione a TAN 0% — dividi il costo in 3 o 6 rate mensili, senza interessi né spese aggiuntive."],
  ["Quali costi ci sono dopo l'attivazione?", "Solo il canone mensile (da €0 a €49/mese) e una commissione sulle transazioni (0%-2%, in base al piano scelto). Stop."],
  ["Gli agenti IA lavorano davvero da soli?", "Sì. Ogni agente opera 24/7 in modo autonomo. Review Shield gestisce le recensioni, Content AI crea contenuti, GhostManager recupera clienti persi — senza il tuo intervento."],
  ["Posso aggiungere o rimuovere agenti?", "Certo. Ogni agente aggiuntivo costa €29/mese (sconto 30% per clienti Empire). Li attivi e disattivi in un click dalla dashboard."],
  ["Che tipo di supporto offrite?", "Digital Start: supporto email. Growth AI: prioritario 7/7. Empire: Account Manager VIP con risposta garantita entro 2 ore."],
  ["Funziona per qualsiasi tipo di business?", "Supportiamo 25+ settori: ristorazione, fitness, beauty, hotel, legal, immobiliare, healthcare, NCC, e-commerce e molti altri."],
  ["Posso provare prima di decidere?", "Demo omaggio di 15 minuti nel tuo settore specifico + garanzia soddisfatti o rimborsati di 90 giorni. Zero rischi."],
  ["Cosa succede se non sono soddisfatto?", "Rimborso integrale entro 90 giorni. Nessuna domanda, nessun vincolo. Il rischio è completamente nostro."],
];

export default function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Warm neutral — different from all other sections */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #020208 0%, #12100e 30%, #14120f 60%, #020208 100%)",
      }} />
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(245,158,11,0.03) 0%, transparent 60%)",
      }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/10 to-transparent" />

      <div className="relative z-[1] max-w-[1320px] mx-auto px-5">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-amber-400 font-bold mb-5">
            <span className="w-6 h-[2px] bg-gradient-to-r from-amber-400 to-transparent" />HAI DOMANDE? ECCO LE RISPOSTE
          </span>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold text-white">
            Domande Frequenti
          </h2>
          <p className="text-white/55 max-w-[480px] mx-auto text-[15px] mt-3 leading-[1.7]">
            Risposte chiare e dirette. Se non trovi quello che cerchi, scrivici — rispondiamo in meno di 2 ore.
          </p>
        </div>

        <div className="max-w-[760px] mx-auto flex flex-col gap-2">
          {FAQS.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`rounded-2xl border overflow-hidden transition-all ${isOpen ? "border-amber-400/20 bg-amber-500/[0.03]" : "border-white/[0.06] bg-white/[0.01]"}`}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex justify-between items-center py-4.5 px-5 text-left text-white/90 text-[14px] font-semibold font-heading hover:text-amber-300 transition-colors gap-3"
                >
                  <span>{q}</span>
                  <span className={`text-lg text-amber-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-45" : ""}`}>+</span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <p className="px-5 pb-5 text-[13px] text-white/60 leading-[1.8]">{a}</p>
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
