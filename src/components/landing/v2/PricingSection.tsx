import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
      "Apex Acquisition Engine (3 agenti)",
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
    desc: "Per chi vuole un'infrastruttura AI proprietaria e dominare il proprio mercato.",
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
    <section id="prezzi" className="relative py-24 px-5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(212,175,55,0.1), transparent)" }} />

      <div className="relative max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[2px] mb-4 border border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/5">
            Pacchetti
          </span>
          <h2 className="text-[clamp(2rem,5vw,3.4rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] mb-4 text-white">
            Investimenti chiari.
            <span className="block bg-gradient-to-r from-[#D4AF37] to-[#7C3AED] bg-clip-text text-transparent">
              ROI verificabile.
            </span>
          </h2>
          <p className="text-white/65 text-[clamp(0.95rem,1.6vw,1.05rem)] max-w-[600px] mx-auto leading-[1.65]">
            Una tantum + canone di mantenimento mensile. Rateizzabile in 3 o 6 rate.
            Garanzia 90 giorni soddisfatti o rimborsati.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {PLANS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-7 rounded-3xl border backdrop-blur-xl flex flex-col ${p.featured ? "lg:scale-105 lg:-my-2" : ""}`}
              style={{
                borderColor: p.featured ? `${p.accent}66` : "rgba(255,255,255,0.07)",
                background: p.featured
                  ? `linear-gradient(135deg, ${p.accent}15, rgba(255,255,255,0.02))`
                  : "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                boxShadow: p.featured ? `0 24px 80px ${p.accent}25` : "none",
              }}
            >
              {p.badge && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
                  style={{
                    background: `linear-gradient(135deg, ${p.accent}, ${p.accent}cc)`,
                    color: "#000",
                    boxShadow: `0 8px 24px ${p.accent}55`,
                  }}
                >
                  ⭐ {p.badge}
                </span>
              )}

              <h3 className="text-xl font-heading font-bold text-white mb-1">{p.name}</h3>
              <p className="text-[12px] text-white/55 mb-5 leading-[1.55]">{p.desc}</p>

              <div className="mb-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-[14px] text-white/50">€</span>
                  <span className="text-4xl font-heading font-extrabold text-white">{p.price}</span>
                </div>
                <div className="text-[12px] text-white/50 mt-1">+ €{p.monthly}/mese mantenimento</div>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-white/75">
                    <span className="mt-0.5 flex-shrink-0" style={{ color: p.accent }}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/onboarding")}
                className="w-full py-3 rounded-full text-white font-semibold text-sm transition-all hover:-translate-y-[2px]"
                style={{
                  background: p.featured
                    ? `linear-gradient(135deg, ${p.accent}, #7C3AED)`
                    : `${p.accent}22`,
                  border: p.featured ? "none" : `1px solid ${p.accent}55`,
                  color: p.featured ? "#000" : p.accent,
                  boxShadow: p.featured ? `0 12px 32px ${p.accent}55` : "none",
                }}
              >
                Scegli {p.name}
              </button>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-[12px] text-white/40 mt-8">
          🛡️ Garanzia 90 giorni — Soddisfatti o rimborsati. Nessun vincolo, zero penali.
        </p>
      </div>
    </section>
  );
}
