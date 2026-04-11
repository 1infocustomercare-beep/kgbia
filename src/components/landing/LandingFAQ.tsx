import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  { q: "Per quali settori funziona Empire?", a: "Empire copre oltre 25 settori: ristoranti, NCC, saloni di bellezza, studi medici, negozi, palestre, hotel, idraulici, elettricisti, agriturismi, lidi, e molti altri. Ogni settore ha moduli, terminologia e flussi dedicati che si attivano automaticamente. Con 98+ agenti IA autonomi." },
  { q: "È difficile da usare?", a: "No. Se sai usare Instagram, sai usare Empire. L'interfaccia si adatta al tuo settore. L'IA fa il lavoro pesante: carica una foto e in 60 secondi hai il tuo catalogo digitale completo." },
  { q: "Come funzionano i pagamenti?", a: "I pagamenti arrivano direttamente sul TUO conto via Stripe Connect. Non tocchiamo mai i tuoi soldi. L'unica trattenuta è la commissione automatica — molto meno delle piattaforme tradizionali." },
  { q: "Quanto costa davvero?", a: "Da €1.997 una tantum (o rate da €699). Dopodiché canone ridotto o €0/mese per sempre con Empire Domination. Solo una piccola percentuale sulle transazioni. Nessun vincolo, nessun costo nascosto." },
  { q: "I miei dati sono al sicuro?", a: "Sì. Crittografia AES-256, conformità GDPR, backup automatici e accessi multi-ruolo. Standard enterprise anche per la piccola attività. I tuoi dati sono di tua proprietà." },
  { q: "Come funziona il Partner Program?", a: "Diventi Partner gratis. Guadagni commissioni per ogni vendita + bonus mensili. Pagamenti istantanei via Stripe Connect. Nessun rischio, nessun investimento iniziale." },
  { q: "Quanto tempo serve per essere operativi?", a: "24 ore. Il nostro team configura tutto: branding, menu/catalogo, integrazioni. Formazione inclusa. Sei operativo dal giorno 1." },
  { q: "Posso personalizzare tutto?", a: "Assolutamente. Logo, colori, dominio, moduli attivi, flussi operativi, notifiche, template email — tutto è personalizzabile senza toccare codice." },
];

export default function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-20 sm:py-28 px-5 overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(228 22% 8%), hsl(230 22% 9%), hsl(228 22% 8%))" }}>
      <div className="max-w-[700px] mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.div className="inline-flex items-center gap-2.5 mb-5 px-5 py-2.5 rounded-2xl" style={{ background: "hsla(var(--primary) / 0.1)", border: "1px solid hsla(var(--primary) / 0.15)" }} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--empire-violet)))" }}>
              <HelpCircle className="w-3 h-3 text-white" />
            </div>
            <span className="text-[0.65rem] font-heading font-bold tracking-[2.5px] uppercase text-white/90">FAQ</span>
          </motion.div>
          <motion.h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-heading font-bold text-white leading-[1.1]" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Domande <span className="text-shimmer">Frequenti</span>
          </motion.h2>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <motion.div key={i} className="rounded-2xl overflow-hidden border border-white/[0.06]" style={{ background: "linear-gradient(160deg, hsl(228 20% 14% / 0.9), hsl(232 22% 12% / 0.86))" }} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="text-sm font-heading font-semibold text-white/80 pr-4">{faq.q}</span>
                <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="w-4 h-4 text-foreground/30 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="px-5 pb-5 pt-0">
                      <div className="h-px mb-4" style={{ background: "linear-gradient(90deg, transparent, hsla(var(--primary) / 0.15), transparent)" }} />
                      <p className="text-xs sm:text-sm text-foreground/45 leading-[1.8]">{faq.a}</p>
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
