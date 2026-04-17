import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "In 60 giorni abbiamo automatizzato l'80% delle richieste clienti. Il fatturato è cresciuto del 34% senza assumere nessuno.",
    name: "Marco Bianchi",
    role: "CEO, COTE Miami Steakhouse",
    accent: "#f59e0b",
    initials: "MB",
  },
  {
    quote: "Empire ha trasformato la nostra spa. Le prenotazioni online sono triplicate. Il personale ringrazia ogni giorno.",
    name: "Giulia Romano",
    role: "Founder, Aura Milano Spa",
    accent: "#ec4899",
    initials: "GR",
  },
  {
    quote: "Il Voice Agent risponde meglio di una receptionist. I clienti pensano sia una persona vera. Risultato: zero chiamate perse.",
    name: "Andrea Conti",
    role: "Owner, City Padel Milano",
    accent: "#22d3ee",
    initials: "AC",
  },
  {
    quote: "Apex Acquisition ci ha portato 187% di lead qualificati in più. Chiudo solo trattative pronte. Tempo risparmiato: 30h/settimana.",
    name: "Laura De Luca",
    role: "Sales Director, DIMORA Real Estate",
    accent: "#c9a84c",
    initials: "LD",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonial" className="relative py-28 px-5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(212,175,55,0.08), transparent)" }} />

      <div className="relative max-w-[1300px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[3px] mb-5 border border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/5 backdrop-blur-md">
            Voci dei clienti
          </span>
          <h2 className="text-[clamp(2rem,5vw,3.6rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] mb-5 text-white">
            Imprenditori che hanno
            <span className="block bg-gradient-to-r from-[#D4AF37] to-[#7C3AED] bg-clip-text text-transparent">
              riscritto le regole.
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              whileHover={{ y: -6 }}
              className="relative p-7 lg:p-8 rounded-3xl border backdrop-blur-xl group overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${t.accent}10, rgba(255,255,255,0.02))`,
                borderColor: `${t.accent}25`,
              }}
            >
              <div
                className="absolute -top-1/2 -right-1/2 w-[120%] h-[120%] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${t.accent}20, transparent 60%)` }}
              />

              <Quote className="w-10 h-10 mb-5 opacity-40" style={{ color: t.accent }} strokeWidth={1.5} />

              <p className="text-white/85 text-[15px] lg:text-[16px] leading-[1.7] mb-7 font-light italic">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3 pt-5 border-t border-white/[0.07]">
                <div
                  className="w-12 h-12 rounded-full grid place-items-center font-heading font-bold text-sm flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${t.accent}, ${t.accent}cc)`,
                    color: "#000",
                    boxShadow: `0 8px 24px ${t.accent}40`,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-white font-semibold text-[14px] leading-tight">{t.name}</div>
                  <div className="text-white/50 text-[12px] mt-1">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
