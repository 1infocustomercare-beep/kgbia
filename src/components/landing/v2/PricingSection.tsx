import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check, ShieldCheck, Sparkles } from "lucide-react";

const PLANS = [
  {
    name: "Digital Start",
    price: "1.997",
    monthly: "49",
    desc: "Per chi vuole testare il potere dell'AI senza compromessi.",
    features: [
      "Sito premium responsive",
      "Dashboard admin verticale",
      "5 agenti AI essenziali",
      "WhatsApp integrato base",
      "Onboarding guidato",
      "Supporto email",
    ],
    accent: "#22d3ee",
    badge: null,
  },
  {
    name: "Empire Pro",
    price: "3.997",
    monthly: "149",
    desc: "La soluzione completa per imprese che vogliono crescere senza limiti.",
    features: [
      "Tutto del Digital Start",
      "25+ agenti AI specializzati",
      "Empire WhatsApp Orchestrator",
      "Apex Acquisition Engine",
      "Voice Agent Arianna 24/7",
      "Fiscal Vault 2026 (compliance)",
      "Personalizzazione settoriale",
      "Account manager dedicato",
    ],
    accent: "#D4AF37",
    badge: "Più scelto",
    featured: true,
  },
  {
    name: "Empire Elite",
    price: "9.997",
    monthly: "299",
    desc: "Per chi vuole un'infrastruttura AI proprietaria e dominare il mercato.",
    features: [
      "Tutto dell'Empire Pro",
      "98 agenti AI completi",
      "Agenti custom su misura",
      "API & integrazioni illimitate",
      "Multi-sede & multi-brand",
      "SLA 99.9% garantito",
      "Consulenza strategica mensile",
      "Priority support 24/7",
    ],
    accent: "#7C3AED",
    badge: null,
  },
];

export default function PricingSection() {
  const navigate = useNavigate();

  return (
    <section id="prezzi" className="relative py-28 px-5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(212,175,55,0.12), transparent)" }} />

      <div className="relative max-w-[1300px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[3px] mb-5 border border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/5 backdrop-blur-md">
            Investimento
          </span>
          <h2 className="text-[clamp(2rem,5vw,3.6rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] mb-5 text-white">
            Investimenti chiari.
            <span className="block bg-gradient-to-r from-[#D4AF37] to-[#7C3AED] bg-clip-text text-transparent">
              ROI verificabile.
            </span>
          </h2>
          <p className="text-white/65 text-[clamp(0.95rem,1.6vw,1.08rem)] max-w-[640px] mx-auto leading-[1.7]">
            Una tantum + canone di mantenimento mensile. Rateizzabile in 3 o 6 rate.
            Garanzia 90 giorni soddisfatti o rimborsati.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {PLANS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              whileHover={{ y: -8 }}
              className={`relative p-7 lg:p-8 rounded-[28px] border backdrop-blur-xl flex flex-col group overflow-hidden ${
                p.featured ? "lg:scale-[1.04] lg:-my-2 z-10" : ""
              }`}
              style={{
                borderColor: p.featured ? `${p.accent}66` : "rgba(255,255,255,0.08)",
                background: p.featured
                  ? `linear-gradient(160deg, ${p.accent}1a, rgba(124,58,237,0.06) 60%, rgba(255,255,255,0.02))`
                  : "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                boxShadow: p.featured ? `0 30px 80px ${p.accent}30` : "none",
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute -top-1/2 -right-1/2 w-[120%] h-[120%] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${p.accent}1a, transparent 60%)` }}
              />

              {p.badge && (
                <span
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap inline-flex items-center gap-1.5"
                  style={{
                    background: `linear-gradient(135deg, ${p.accent}, ${p.accent}cc)`,
                    color: "#000",
                    boxShadow: `0 8px 24px ${p.accent}66`,
                  }}
                >
                  <Sparkles className="w-3 h-3" strokeWidth={2.5} />
                  {p.badge}
                </span>
              )}

              <div className="relative">
                <h3 className="text-xl font-heading font-bold text-white mb-1.5">{p.name}</h3>
                <p className="text-[12px] text-white/55 mb-6 leading-[1.55] min-h-[36px]">{p.desc}</p>

                <div className="mb-6 pb-6 border-b border-white/[0.06]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[14px] text-white/50">€</span>
                    <span className="text-[44px] font-heading font-extrabold text-white leading-none">{p.price}</span>
                  </div>
                  <div className="text-[12px] text-white/50 mt-2">+ €{p.monthly}/mese mantenimento</div>
                  <div className="text-[11px] text-white/35 mt-1">Rateizzabile 3x o 6x</div>
                </div>

                <ul className="space-y-3 mb-7 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-white/80">
                      <span
                        className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full grid place-items-center"
                        style={{ background: `${p.accent}22`, border: `1px solid ${p.accent}55` }}
                      >
                        <Check className="w-2.5 h-2.5" style={{ color: p.accent }} strokeWidth={3} />
                      </span>
                      <span className="leading-[1.5]">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate("/onboarding")}
                  className="w-full py-3.5 rounded-full font-semibold text-sm transition-all hover:-translate-y-[2px]"
                  style={{
                    background: p.featured
                      ? `linear-gradient(135deg, ${p.accent}, #7C3AED)`
                      : `${p.accent}1a`,
                    border: p.featured ? "none" : `1px solid ${p.accent}55`,
                    color: p.featured ? "#000" : p.accent,
                    boxShadow: p.featured ? `0 16px 40px ${p.accent}55` : "none",
                  }}
                >
                  Scegli {p.name}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 mt-10 text-[12px] text-white/50">
          <ShieldCheck className="w-4 h-4 text-[#22c55e]" strokeWidth={2} />
          Garanzia 90 giorni — Soddisfatti o rimborsati. Nessun vincolo, zero penali.
        </div>
      </div>
    </section>
  );
}
