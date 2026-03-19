/**
 * DemoTestimonialsSection — Auto-scrolling testimonial cards with sector-unique styling
 */
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { getSectorTheme } from "@/config/sector-themes";
import PremiumSectionBg from "./PremiumSectionBg";

interface Props {
  sector: string;
  accentColor: string;
  sectorName: string;
}

export default function DemoTestimonialsSection({ sector, accentColor, sectorName }: Props) {
  const theme = getSectorTheme(sector);
  const testimonials = theme.testimonials || [];
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [paused, setPaused] = useState(false);

  // Auto-scroll every 4s
  useEffect(() => {
    if (testimonials.length <= 1 || paused) return;
    intervalRef.current = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [testimonials.length, paused]);

  if (testimonials.length === 0) return null;

  // Layout variant based on sector type
  const isDark = theme.palette.bg.startsWith("#0") || theme.palette.bg.startsWith("rgba");
  const textColor = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-white/40" : "text-gray-500";
  const cardBg = isDark ? "bg-white/[0.04]" : "bg-white";
  const cardBorder = isDark ? "border-white/[0.08]" : "border-gray-200";

  return (
    <section
      ref={ref}
      className="py-20 px-4 relative overflow-hidden"
      style={{ background: isDark ? "linear-gradient(180deg, #0a0a12 0%, #060610 50%, #080812 100%)" : theme.palette.bgAlt }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <PremiumSectionBg accentColor={accentColor} variant="alt" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[0.65rem] font-bold uppercase tracking-[0.2em] mb-4"
            style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}25` }}
          >
            ⭐ Recensioni Verificate
          </div>
          <h2 className={`text-2xl sm:text-4xl font-bold ${textColor} mb-3`}>
            Cosa Dicono i Nostri{" "}
            <span style={{ color: accentColor }}>Clienti</span>
          </h2>
          <p className={`text-sm ${textMuted} max-w-lg mx-auto`}>
            La soddisfazione dei clienti è la nostra priorità assoluta
          </p>
        </motion.div>

        {/* Cards grid — show all on desktop, carousel on mobile */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className={`${cardBg} ${cardBorder} border rounded-2xl p-6 relative group hover:-translate-y-1 transition-all duration-300`}
              style={{ boxShadow: `0 8px 32px -8px ${accentColor}10` }}
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 absolute top-4 right-4 opacity-[0.06]" style={{ color: accentColor }} />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${j < t.rating ? "fill-amber-400 text-amber-400" : isDark ? "text-white/10" : "text-gray-200"}`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"} leading-relaxed mb-5 italic`}>
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: `${accentColor}20`, color: accentColor }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${textColor}`}>{t.name}</p>
                  <p className={`text-[0.65rem] ${textMuted}`}>Cliente verificato</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="sm:hidden relative">
          <div className="overflow-hidden">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              {testimonials[activeIdx] && (
                <div className={`${cardBg} ${cardBorder} border rounded-2xl p-6 mx-2`}>
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-4 h-4 ${j < testimonials[activeIdx].rating ? "fill-amber-400 text-amber-400" : isDark ? "text-white/10" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"} leading-relaxed mb-4 italic`}>
                    "{testimonials[activeIdx].text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: `${accentColor}20`, color: accentColor }}>
                      {testimonials[activeIdx].name[0]}
                    </div>
                    <p className={`text-sm font-semibold ${textColor}`}>{testimonials[activeIdx].name}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Navigation arrows */}
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={() => setActiveIdx((activeIdx - 1 + testimonials.length) % testimonials.length)}
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors"
              style={{ borderColor: `${accentColor}30`, color: accentColor }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveIdx(i)}
                className="w-2.5 h-2.5 rounded-full transition-all my-auto"
                style={{ background: i === activeIdx ? accentColor : `${accentColor}25` }}
              />
            ))}
            <button
              onClick={() => setActiveIdx((activeIdx + 1) % testimonials.length)}
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors"
              style={{ borderColor: `${accentColor}30`, color: accentColor }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Trust badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          {[
            { icon: "⭐", label: "4.9/5 Rating Medio" },
            { icon: "👥", label: "500+ Clienti Soddisfatti" },
            { icon: "🏆", label: "100% Consigliato" },
          ].map((b, i) => (
            <span key={i} className={`flex items-center gap-2 text-xs ${textMuted}`}>
              <span>{b.icon}</span> {b.label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
