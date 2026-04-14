import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PLANS = [
  {
    icon: "⚡", name: "Digital Start", price: "€1.997", old: "€2.880", disc: "-31%",
    rate: "oppure €666/mese x3 (TAN 0%)", after: "poi €49/mese · 2% transazioni",
    features: ["App White Label completa", "Menu/Catalogo QR illimitato", "Ordini & Prenotazioni", "Dashboard Analytics base", "Supporto Email dedicato", "Setup & Onboarding guidato"],
    cta: "Inizia con Digital Start", urgency: "Setup gratuito questa settimana", urgencyRed: true,
    style: "default" as const,
  },
  {
    icon: "🚀", name: "Growth AI", price: "€4.997", old: "€7.200", disc: "-31%",
    rate: "oppure €1.666/mese x3 (TAN 0%)", after: "poi €29/mese · 1% transazioni",
    features: ["Tutto di Digital Start +", "AI Engine completo", "CRM & Fidelizzazione avanzata", "Review Shield", "Push Notification illimitate", "2 Agenti IA inclusi", "Commissioni ridotte 1%"],
    cta: "Scelgo Growth AI", urgency: "Solo 7 posti rimasti", urgencyRed: false,
    style: "popular" as const,
  },
  {
    icon: "👑", name: "Empire Domination", price: "€7.997", old: "€14.400", disc: "-44%",
    rate: "oppure €2.666/mese x3 (TAN 0%)", after: "€0/mese · 0% commissioni · €11/giorno x24 mesi",
    features: ["TUTTO incluso", "ZERO commissioni", "ZERO canone 24 mesi", "5 Agenti IA inclusi", "Multi-lingua illimitato", "GhostManager", "Analytics predittivi IA", "Account Manager VIP 7/7"],
    cta: "Scelgo Empire", urgency: "Risparmia fino a €6.403", urgencyRed: true,
    style: "gold" as const,
  },
];

export default function LandingPricing() {
  const navigate = useNavigate();

  return (
    <section id="prezzi" className="py-16 lg:py-24" style={{ background: "#020204" }}>
      <div className="max-w-[1320px] mx-auto px-5">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-5">
            <span className="w-5 h-[1.5px] bg-[#7eb7be]" />PIANI & PREZZI
          </span>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold mb-2 text-white">
            Scegli Come Dominare <span className="bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">il Tuo Mercato</span>
          </h2>
          <p className="text-white/55 max-w-[620px] mx-auto text-[15px] leading-[1.7]">
            Pacchetto completo o abbonamento flessibile — il tuo business cambia per sempre.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1100px] mx-auto">
          {PLANS.map((plan, i) => {
            const isPop = plan.style === "popular";
            const isGold = plan.style === "gold";
            return (
              <motion.div key={plan.name}
                className={`relative rounded-3xl p-8 border transition-all duration-500 hover:-translate-y-1.5 ${
                  isPop ? "border-[rgba(126,183,190,0.25)] md:scale-[1.03]" : isGold ? "border-[rgba(212,168,85,0.25)]" : "border-white/[0.07]"
                }`}
                style={{ background: isPop ? "linear-gradient(180deg, rgba(126,183,190,0.04), #0d0d1a)" : "#0d0d1a" }}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}>
                
                {isPop && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] tracking-[2px] px-3.5 py-1 rounded-full font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)" }}>PIÙ POPOLARE</div>
                )}
                {isGold && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] tracking-[2px] px-3.5 py-1 rounded-full font-bold text-black"
                    style={{ background: "linear-gradient(135deg, #d4a855, #e8c47a)" }}>MASSIMO RISPARMIO</div>
                )}

                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[1.6rem] mb-3 border border-white/[0.08] shadow-lg" style={{ background: isPop ? "linear-gradient(135deg, rgba(126,183,190,0.15), rgba(108,60,224,0.1))" : isGold ? "linear-gradient(135deg, rgba(212,168,85,0.15), rgba(212,168,85,0.05))" : "linear-gradient(135deg, rgba(126,183,190,0.1), rgba(108,60,224,0.08))" }}>{plan.icon}</div>
                <h3 className="text-xl font-heading font-bold mb-3 text-white">{plan.name}</h3>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-[2.4rem] font-extrabold font-heading text-white">{plan.price}</span>
                  <span className="text-sm text-white/55 line-through">{plan.old}</span>
                  <span className="text-[11px] bg-[rgba(34,197,94,0.12)] text-green-500 px-2 py-0.5 rounded-lg font-bold">{plan.disc}</span>
                </div>
                <div className="text-xs text-[#7eb7be] font-semibold mt-1">{plan.rate}</div>
                <div className="text-[11px] text-white/55 mt-0.5">{plan.after}</div>

                <div className="flex flex-col gap-2 my-5">
                  {plan.features.map((f) => (
                    <div key={f} className="text-xs text-white/70 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-[#7eb7be] before:font-bold before:text-[11px]">{f}</div>
                  ))}
                </div>

                <button onClick={() => navigate("/auth")}
                  className="w-full py-3.5 rounded-full font-semibold text-sm text-center transition-all hover:-translate-y-0.5"
                  style={{
                    background: isGold ? "linear-gradient(135deg, #d4a855, #e8c47a)" : "linear-gradient(135deg, #7eb7be, #6c3ce0)",
                    color: isGold ? "#000" : "#fff",
                  }}>
                  {plan.cta}
                </button>
                <div className={`text-center text-[11px] mt-2.5 py-1.5 rounded-lg font-semibold ${
                  plan.urgencyRed ? "bg-[rgba(239,68,68,0.08)] text-red-400" : "bg-[rgba(126,183,190,0.12)] text-[#7eb7be]"
                }`}>{plan.urgency}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
