import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PLANS = [
  {
    name: "Digital Start", price: "€1.997", old: "€2.880", disc: "-31%",
    rate: "oppure €666/mese x3 (TAN 0%)", after: "poi €49/mese · 2% transazioni",
    features: ["App White Label completa con il tuo brand", "Menu/Catalogo QR illimitato", "Ordini online & Prenotazioni smart", "Dashboard Analytics con metriche chiave", "Supporto Email dedicato 7/7", "Setup & Onboarding guidato in 7 giorni"],
    cta: "Inizia con Digital Start", urgency: "Setup gratuito questa settimana",
    accent: "#60a5fa", badgeBg: "", badgeText: "",
  },
  {
    name: "Growth AI", price: "€4.997", old: "€7.200", disc: "-31%",
    rate: "oppure €1.666/mese x3 (TAN 0%)", after: "poi €29/mese · 1% transazioni",
    features: ["Tutto di Digital Start +", "AI Content Engine — post e email automatici", "CRM Avanzato & Programma Fedeltà", "Review Shield — protezione reputazione", "Push Notification illimitate", "2 Agenti IA inclusi", "Commissioni ridotte all'1%"],
    cta: "Scelgo Growth AI", urgency: "Il più scelto — 7 posti rimasti",
    accent: "#22c55e", badgeBg: "linear-gradient(135deg, #22c55e, #16a34a)", badgeText: "PIÙ POPOLARE",
  },
  {
    name: "Empire Domination", price: "€7.997", old: "€14.400", disc: "-44%",
    rate: "oppure €2.666/mese x3 (TAN 0%)", after: "€0/mese · 0% commissioni per 24 mesi",
    features: ["TUTTO incluso — zero limiti", "ZERO commissioni per sempre", "ZERO canone per 24 mesi", "5 Agenti IA Premium inclusi", "Multi-lingua illimitato (12 lingue)", "GhostManager — recupero clienti automatico", "Analytics Predittivi con IA", "Account Manager VIP dedicato 7/7"],
    cta: "Voglio Empire Domination", urgency: "Risparmia fino a €6.403",
    accent: "#c9a84c", badgeBg: "linear-gradient(135deg, #c9a84c, #e8c47a)", badgeText: "MASSIMO VALORE",
  },
];

export default function LandingPricing() {
  const navigate = useNavigate();

  return (
    <section id="prezzi" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #080a1c 0%, #0e0c22 40%, #0a0818 100%)" }} />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(ellipse 50% 50% at 50% 30%, rgba(201,168,76,0.06) 0%, transparent 60%)",
      }} />

      <div className="relative z-[1] max-w-[1200px] mx-auto px-5">
        <div className="text-center mb-14">
          <span className="inline-block text-[11px] tracking-[3px] uppercase font-bold mb-4 px-4 py-1.5 rounded-full border border-[#c9a84c]/20 bg-[#c9a84c]/5 text-[#c9a84c]">
            Investimento Trasparente
          </span>
          <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-heading font-bold mb-4 text-white leading-tight">
            Un Investimento Una Tantum.<br />
            <span className="text-[#c9a84c]">Ritorni per Sempre.</span>
          </h2>
          <p className="text-white/60 max-w-[640px] mx-auto text-[16px] leading-[1.8]">
            Nessun abbonamento nascosto. Paghi una volta, il tuo business cresce per sempre. Rateizzazione a TAN 0% disponibile su tutti i piani.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
          {PLANS.map((plan, i) => {
            const isGold = plan.accent === "#c9a84c";
            return (
              <motion.div
                key={plan.name}
                className="relative rounded-2xl p-8 border transition-all duration-500 hover:-translate-y-2"
                style={{
                  borderColor: `${plan.accent}20`,
                  background: `linear-gradient(160deg, ${plan.accent}06, rgba(10,8,24,0.95))`,
                }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {plan.badgeText && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] tracking-[2px] px-4 py-1.5 rounded-full font-bold"
                    style={{ background: plan.badgeBg, color: isGold ? "#000" : "#fff" }}>
                    {plan.badgeText}
                  </div>
                )}

                <h3 className="text-xl font-heading font-bold mb-4 text-white">{plan.name}</h3>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-[2.6rem] font-extrabold font-heading text-white">{plan.price}</span>
                  <span className="text-sm text-white/40 line-through">{plan.old}</span>
                  <span className="text-[11px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-bold border border-emerald-500/20">{plan.disc}</span>
                </div>
                <div className="text-[13px] font-semibold mt-2" style={{ color: plan.accent }}>{plan.rate}</div>
                <div className="text-[12px] text-white/50 mt-1 mb-6">{plan.after}</div>

                <div className="flex flex-col gap-3 mb-8">
                  {plan.features.map((f) => (
                    <div key={f} className="text-[14px] text-white/75 pl-6 relative leading-[1.6]">
                      <span className="absolute left-0 font-bold text-[12px]" style={{ color: plan.accent }}>✓</span>
                      {f}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/auth")}
                  className="w-full py-4 rounded-full font-bold text-[15px] text-center transition-all hover:-translate-y-0.5"
                  style={{
                    background: isGold ? "linear-gradient(135deg, #c9a84c, #e8c47a)" : `linear-gradient(135deg, ${plan.accent}, ${plan.accent}cc)`,
                    color: isGold ? "#000" : "#fff",
                    boxShadow: `0 12px 32px ${plan.accent}25`,
                  }}
                >
                  {plan.cta}
                </button>
                <div className="text-center text-[12px] mt-4 py-2 rounded-full font-semibold"
                  style={{ background: `${plan.accent}08`, color: plan.accent, border: `1px solid ${plan.accent}15` }}>
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
