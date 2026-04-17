import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import MobileCarousel from "./MobileCarousel";

const TESTIMONIALS = [
  { quote: "In 60 giorni abbiamo automatizzato l'80% delle richieste clienti. Il fatturato è cresciuto del 34% senza assumere nessuno.", name: "Marco Bianchi", role: "CEO, COTE Miami Steakhouse", initials: "MB", tone: "gold" },
  { quote: "Empire ha trasformato la nostra spa. Le prenotazioni online sono triplicate. Il personale ringrazia ogni giorno.", name: "Giulia Romano", role: "Founder, Aura Milano Spa", initials: "GR", tone: "violet" },
  { quote: "Il Voice Agent risponde meglio di una receptionist. I clienti pensano sia una persona vera. Risultato: zero chiamate perse.", name: "Andrea Conti", role: "Owner, City Padel Milano", initials: "AC", tone: "emerald" },
  { quote: "Apex Acquisition ci ha portato 187% di lead qualificati in più. Chiudo solo trattative pronte. Tempo risparmiato: 30h/settimana.", name: "Laura De Luca", role: "Sales Director, DIMORA Real Estate", initials: "LD", tone: "blue" },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonial" className="landing-section relative overflow-visible px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16" data-theme="light">
      <div className="landing-section-glow" data-tone="gold" />

      <div className="relative mx-auto max-w-[1300px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-8 max-w-[760px] text-center"
          data-tone="gold"
        >
          <span className="landing-pill mb-4 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em]">Voci dei clienti</span>
          <h2 className="font-heading text-[clamp(1.8rem,4.8vw,3.4rem)] font-extrabold leading-[0.94] tracking-[-0.04em] text-foreground">
            Imprenditori che hanno
            <span className="block landing-heading-gradient">riscritto le regole.</span>
          </h2>
        </motion.div>

        {(() => {
          const renderQuote = (t: typeof TESTIMONIALS[number], i: number, inCarousel = false) => (
            <motion.article
              key={t.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: inCarousel ? 0 : i * 0.08, duration: 0.65 }}
              whileHover={{ y: -6 }}
              className="landing-surface flex h-full flex-col rounded-[26px] p-5 lg:p-6"
              data-tone={t.tone}
            >
              <Quote className="mb-4 h-8 w-8 text-foreground/56" strokeWidth={1.5} />
              <p className="mb-6 flex-1 text-[15px] italic leading-[1.68] text-foreground/86 lg:text-[16px]">“{t.quote}”</p>
              <div className="flex items-center gap-3 border-t border-border/50 pt-5">
                <div className="landing-icon-frame h-12 w-12 flex-shrink-0 rounded-full font-heading text-sm font-bold">
                  {t.initials}
                </div>
                <div>
                  <div className="text-[14px] font-semibold leading-tight text-foreground">{t.name}</div>
                  <div className="mt-1 text-[12px] text-foreground/64">{t.role}</div>
                </div>
              </div>
            </motion.article>
          );

          return (
            <>
              <div className="md:hidden">
                <MobileCarousel autoplayMs={6000} ariaLabel="Testimonianze clienti">
                  {TESTIMONIALS.map((t, i) => renderQuote(t, i, true))}
                </MobileCarousel>
              </div>
              <div className="hidden gap-4 md:grid md:grid-cols-2">
                {TESTIMONIALS.map((t, i) => renderQuote(t, i, false))}
              </div>
            </>
          );
        })()}
      </div>
    </section>
  );
}
