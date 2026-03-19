import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

/* ═══ SECTOR-SPECIFIC TESTIMONIALS ═══ */
const SECTOR_TESTIMONIALS: Record<string, { name: string; text: string; rating: number; role: string; photo: string }[]> = {
  beauty: [
    { name: "Giulia R.", text: "Ambiente raffinato e professionalità incredibile. Il balayage più bello che abbia mai fatto!", rating: 5, role: "Cliente da 2 anni", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
    { name: "Sara M.", text: "Il massaggio rilassante è stata un'esperienza celestiale. Prodotti top e staff gentilissimo.", rating: 5, role: "Pacchetto SPA", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
    { name: "Valentina P.", text: "Manicure perfetta, nail art d'autore. Non trovo un salone migliore in tutta la città.", rating: 5, role: "Cliente Gold", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face" },
    { name: "Chiara L.", text: "Extension ciglia naturali e impeccabili. Il mio salone di fiducia ormai da anni.", rating: 5, role: "Trattamenti Viso", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face" },
  ],
  healthcare: [
    { name: "Marco R.", text: "Competenza medica eccezionale. Diagnosi rapida e trattamento efficace. Consiglio vivamente.", rating: 5, role: "Paziente Cardiologia", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    { name: "Laura B.", text: "Il teleconsulto mi ha risparmiato ore di attesa. Pratico, professionale e preciso.", rating: 5, role: "Teleconsulto", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
    { name: "Giovanni V.", text: "Check-up preventivo completo in una mattina. Referti digitali immediatamente disponibili.", rating: 5, role: "Check-up Annuale", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
    { name: "Anna F.", text: "Studio medico moderno, attrezzature all'avanguardia. Il personale ti mette subito a tuo agio.", rating: 5, role: "Ortopedia", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  ],
  fitness: [
    { name: "Luca P.", text: "Da quando mi alleno qui la mia vita è cambiata. Trainer preparatissimi e attrezzature Technogym.", rating: 5, role: "CrossFit Member", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    { name: "Sofia R.", text: "Le classi di yoga sono fantastiche. Atmosfera rilassante e istruttrice bravissima.", rating: 5, role: "Yoga + Pilates", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
    { name: "Andrea M.", text: "Programmazione scientifica e community straordinaria. Ho perso 15kg in 6 mesi!", rating: 5, role: "Trasformazione", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
    { name: "Elena B.", text: "Pulitissima, moderna e con orari flessibili. Il piano PT è stato il miglior investimento.", rating: 5, role: "Personal Training", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  ],
  hotel: [
    { name: "James W.", text: "A stunning boutique experience. The digital concierge was incredibly helpful for local tips.", rating: 5, role: "Suite Vista Mare", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    { name: "Marie D.", text: "Service impeccable, chambre magnifique. Le check-in digital a rendu tout si simple.", rating: 5, role: "Honeymoon", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
    { name: "Hans M.", text: "Erstklassiger Service und wunderschöne Aussicht. Das SPA-Paket war fantastisch.", rating: 5, role: "Spa Weekend", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
    { name: "Lucia T.", text: "Esperienza indimenticabile. Staff attento, colazione gourmet e una vista che toglie il fiato.", rating: 5, role: "Family Vacation", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  ],
  retail: [
    { name: "Francesca N.", text: "Selezione curatissima e servizio personalizzato. Il programma fedeltà è fantastico!", rating: 5, role: "VIP Client", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
    { name: "Simone G.", text: "Spedizione velocissima e packaging premium. L'esperienza online è perfetta.", rating: 5, role: "E-Commerce", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    { name: "Elena R.", text: "Consulenza personalizzata eccezionale. Mi hanno aiutato a trovare il regalo perfetto.", rating: 5, role: "Gift Shopping", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
    { name: "Roberto M.", text: "Qualità dei prodotti superiore. Il QR vetrina è comodissimo per acquistare fuori orario.", rating: 5, role: "Cliente Abituale", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  ],
  bakery: [
    { name: "Marta L.", text: "Il cornetto alla crema è il migliore della città. Ogni mattina è una gioia passare di qui.", rating: 5, role: "Colazione Quotidiana", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
    { name: "Paolo S.", text: "Torta di compleanno spettacolare! Ordinata online e consegnata perfetta. Bravi!", rating: 5, role: "Torta Personalizzata", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    { name: "Giulia C.", text: "Il pane a lievitazione naturale è una poesia. Ingredienti bio e sapore autentico.", rating: 5, role: "Pane Artigianale", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face" },
    { name: "Antonio B.", text: "Pasticceria di altissimo livello. I macarons sono paragonabili a quelli parigini!", rating: 5, role: "Pasticceria Fine", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  ],
  beach: [
    { name: "Paolo M.", text: "Il miglior stabilimento della costa. Servizio impeccabile e spiaggia sempre curata.", rating: 5, role: "Abbonamento Stagionale", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    { name: "Anna S.", text: "Prenotazione online semplicissima. Il bar in spiaggia ha cocktail fantastici!", rating: 5, role: "Weekend Estivo", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
    { name: "Famiglia R.", text: "Area bambini sicura e attrezzata. Ci sentiamo come a casa ogni estate!", rating: 5, role: "Family Season", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
    { name: "Marco D.", text: "Il gazebo VIP è un'esperienza premium. Servizio al posto impeccabile.", rating: 5, role: "Gazebo VIP", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  ],
  trades: [
    { name: "Giuseppe F.", text: "Intervento rapido e risolutivo. Preventivo rispettato alla perfezione. Professionisti veri.", rating: 5, role: "Impianto Completo", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    { name: "Maria C.", text: "Puntuali, precisi e puliti. Hanno risolto un problema che altri non riuscivano a diagnosticare.", rating: 5, role: "Riparazione Urgente", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
    { name: "Condominio V.", text: "Manutenzione condominiale impeccabile. Sempre reperibili e con prezzi trasparenti.", rating: 5, role: "Contratto Annuale", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
    { name: "Andrea T.", text: "Ristrutturazione bagno in soli 5 giorni. Risultato superiore alle aspettative!", rating: 5, role: "Ristrutturazione", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  ],
};

const DEFAULT_TESTIMONIALS = SECTOR_TESTIMONIALS.trades;

interface Props {
  sector: string;
  accentColor: string;
  darkMode?: boolean;
  bgColor?: string;
  textColor?: string;
  fontDisplay?: string;
  fontBody?: string;
}

export function DemoTestimonialsCarousel({ sector, accentColor, darkMode = false, bgColor, textColor, fontDisplay, fontBody }: Props) {
  const testimonials = SECTOR_TESTIMONIALS[sector] || DEFAULT_TESTIMONIALS;
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, [testimonials.length]);

  const bg = bgColor || (darkMode ? "#0c0c0c" : "#f9f9f7");
  const text = textColor || (darkMode ? "#fff" : "#111");
  const muted = darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "#fff";
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

  const prev = () => setActive(p => (p - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive(p => (p + 1) % testimonials.length);

  return (
    <section ref={ref} className="py-20 sm:py-28 px-4 overflow-hidden" style={{ background: bg }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-3"
            style={{ color: accentColor, fontFamily: fontBody }}
          >
            Cosa Dicono di Noi
          </motion.p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: text, fontFamily: fontDisplay }}>
            Le Voci dei Nostri <span style={{ color: accentColor }}>Clienti</span>
          </h2>
        </div>

        {/* Desktop: All cards visible */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
              className="relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group"
              style={{
                background: cardBg,
                border: `1px solid ${cardBorder}`,
              }}
            >
              {/* Quote icon */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: `${accentColor}12` }}
              >
                <Quote className="w-4 h-4" style={{ color: accentColor }} />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <Star key={si} className="w-3.5 h-3.5 fill-current" style={{ color: accentColor }} />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm leading-relaxed mb-5 line-clamp-4" style={{ color: muted, fontFamily: fontBody }}>
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4" style={{ borderTop: `1px solid ${cardBorder}` }}>
                <img
                  src={t.photo}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                  style={{ border: `2px solid ${accentColor}30` }}
                />
                <div>
                  <p className="text-sm font-semibold" style={{ color: text }}>{t.name}</p>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: `${accentColor}99`, fontFamily: fontBody }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl p-6"
              style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4" style={{ background: `${accentColor}12` }}>
                <Quote className="w-4 h-4" style={{ color: accentColor }} />
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: testimonials[active].rating }).map((_, si) => (
                  <Star key={si} className="w-3.5 h-3.5 fill-current" style={{ color: accentColor }} />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: muted, fontFamily: fontBody }}>
                "{testimonials[active].text}"
              </p>
              <div className="flex items-center gap-3 pt-4" style={{ borderTop: `1px solid ${cardBorder}` }}>
                <img src={testimonials[active].photo} alt={testimonials[active].name} className="w-10 h-10 rounded-full object-cover" style={{ border: `2px solid ${accentColor}30` }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: text }}>{testimonials[active].name}</p>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: `${accentColor}99`, fontFamily: fontBody }}>{testimonials[active].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prev} className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ background: `${accentColor}15`, color: accentColor }}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} className="w-2 h-2 rounded-full transition-all" style={{ background: i === active ? accentColor : `${accentColor}25`, transform: i === active ? "scale(1.3)" : "scale(1)" }} />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ background: `${accentColor}15`, color: accentColor }}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-6 mt-12 flex-wrap"
        >
          {[
            { v: "4.9/5", l: "Rating Medio" },
            { v: "500+", l: "Recensioni" },
            { v: "98%", l: "Raccomanda" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-xs" style={{ color: muted, fontFamily: fontBody }}>
              <Star className="w-3.5 h-3.5 fill-current" style={{ color: accentColor }} />
              <span className="font-bold" style={{ color: text }}>{s.v}</span>
              <span>{s.l}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}