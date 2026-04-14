import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PLANS = [
  {
    name: "Digital Start", price: "€1.997", old: "€2.880", disc: "-31%",
    rate: "oppure €666/mese x3 (TAN 0%)", after: "poi €49/mese · 2% transazioni",
    features: ["App White Label completa", "Menu/Catalogo QR illimitato", "Ordini & Prenotazioni", "Dashboard Analytics base", "Supporto Email dedicato", "Setup & Onboarding guidato"],
    cta: "Inizia con Digital Start", urgency: "Setup gratuito questa settimana", urgencyRed: true,
    accent: "#22d3ee", style: "default" as const,
  },
  {
    name: "Growth AI", price: "€4.997", old: "€7.200", disc: "-31%",
    rate: "oppure €1.666/mese x3 (TAN 0%)", after: "poi €29/mese · 1% transazioni",
    features: ["Tutto di Digital Start +", "AI Engine completo", "CRM & Fidelizzazione avanzata", "Review Shield automatico", "Push Notification illimitate", "2 Agenti IA inclusi", "Commissioni ridotte 1%"],
    cta: "Scelgo Growth AI", urgency: "Solo 7 posti rimasti", urgencyRed: false,
    accent: "#a78bfa", style: "popular" as const,
  },
  {
    name: "Empire Domination", price: "€7.997", old: "€14.400", disc: "-44%",
    rate: "oppure €2.666/mese x3 (TAN 0%)", after: "€0/mese · 0% commissioni · €11/giorno x24 mesi",
    features: ["TUTTO incluso — zero limiti", "ZERO commissioni per sempre", "ZERO canone per 24 mesi", "5 Agenti IA inclusi", "Multi-lingua illimitato", "GhostManager anti-abbandono", "Analytics predittivi IA", "Account Manager VIP 7/7"],
    cta: "Scelgo Empire", urgency: "Risparmia fino a €6.403", urgencyRed: true,
    accent: "#f59e0b", style: "gold" as const,
  },
];

export default function LandingPricing() {
  const navigate = useNavigate();

  return (
    <section id="prezzi" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Dark gold premium atmosphere */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #020208 0%, #120e08 30%, #161008 50%, #020208 100%)",
      }} />
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(ellipse 50% 50% at 50% 20%, rgba(245,158,11,0.04) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 50% 80%, rgba(167,139,250,0.03) 0%, transparent 60%)",
      }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/15 to-transparent" />

      <div className="relative z-[1] max-w-[1320px] mx-auto px-5">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-amber-400 font-bold mb-5">
            <span className="w-6 h-[2px] bg-gradient-to-r from-amber-400 to-transparent" />INVESTIMENTO, NON COSTO
          </span>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold mb-3 text-white">
            Scegli il Piano Che Ti Fa <span className="text-amber-400">Dominare il Mercato</span>
          </h2>
          <p className="text-white/60 max-w-[620px] mx-auto text-[15px] leading-[1.7]">
            Un investimento che si ripaga da solo nei primi 30 giorni. Rateizzabile a TAN 0%. Garanzia soddisfatti o rimborsati.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1100px] mx-auto">
          {PLANS.map((plan, i) => {
            const isPop = plan.style === "popular";
            const isGold = plan.style === "gold";
            return (
              <motion.div
                key={plan.name}
                className={`relative rounded-3xl p-8 border transition-all duration-500 hover:-translate-y-2 ${
                  isPop ? "border-violet-400/25 md:scale-[1.03]" : isGold ? "border-amber-400/25" : "border-white/[0.06]"
                }`}
                style={{
                  background: isPop
                    ? "linear-gradient(180deg, rgba(20,12,48,0.6), rgba(8,6,20,0.95))"
                    : isGold
                      ? "linear-gradient(180deg, rgba(22,16,8,0.6), rgba(8,6,4,0.95))"
                      : "linear-gradient(180deg, rgba(12,14,18,0.9), rgba(6,8,10,0.95))",
                }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {isPop && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] tracking-[2px] px-3.5 py-1 rounded-full font-bold text-white"
                    style={{ background: plan.accent }}>PIÙ POPOLARE</div>
                )}
                {isGold && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] tracking-[2px] px-3.5 py-1 rounded-full font-bold text-black"
                    style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}>MASSIMO RISPARMIO</div>
                )}

                <h3 className="text-xl font-heading font-bold mb-3 text-white">{plan.name}</h3>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-[2.4rem] font-extrabold font-heading" style={{ color: plan.accent }}>{plan.price}</span>
                  <span className="text-sm text-white/40 line-through">{plan.old}</span>
                  <span className="text-[11px] bg-[rgba(34,197,94,0.12)] text-emerald-400 px-2 py-0.5 rounded-lg font-bold">{plan.disc}</span>
                </div>
                <div className="text-xs font-semibold mt-1" style={{ color: plan.accent }}>{plan.rate}</div>
                <div className="text-[12px] text-white/50 mt-0.5">{plan.after}</div>

                <div className="flex flex-col gap-2.5 my-6">
                  {plan.features.map((f) => (
                    <div key={f} className="text-[13px] text-white/75 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:font-bold before:text-[11px]"
                      style={{ "--tw-content": "'✓'" } as any}>
                      <span className="absolute left-0 font-bold text-[11px]" style={{ color: plan.accent }}>✓</span>
                      {f}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/auth")}
                  className="w-full py-3.5 rounded-full font-semibold text-sm text-center transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{
                    background: isGold ? "linear-gradient(135deg, #f59e0b, #fbbf24)" : `linear-gradient(135deg, ${plan.accent}, ${plan.accent}cc)`,
                    color: isGold ? "#000" : "#fff",
                    boxShadow: `0 8px 32px ${plan.accent}25`,
                  }}
                >
                  {plan.cta}
                </button>
                <div className={`text-center text-[11px] mt-3 py-1.5 rounded-lg font-semibold ${
                  plan.urgencyRed ? "bg-[rgba(239,68,68,0.08)] text-red-400" : `bg-[${plan.accent}12]`
                }`} style={!plan.urgencyRed ? { background: `${plan.accent}12`, color: plan.accent } : undefined}>
                  {plan.urgency}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
