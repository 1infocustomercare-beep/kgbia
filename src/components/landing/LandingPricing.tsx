import { motion } from "framer-motion";
import { ArrowRight, Check, Crown, Timer, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PACKAGES = [
  { id: "base", name: "Digital Start", price: 1997, orig: 2880, monthly: 49, commission: "2%", tagline: "Digitalizza la tua attività in 24h", features: ["App White Label completa", "Menu/Catalogo QR illimitato", "Ordini & Prenotazioni", "Dashboard Analytics base", "Supporto Email dedicato", "12 mesi di piattaforma inclusi"], savings: "Risparmi €883" },
  { id: "growth", name: "Growth AI", price: 4997, orig: 7200, monthly: 29, commission: "1%", badge: "Più Scelto", highlight: true, tagline: "IA + automazioni per esplodere il fatturato", features: ["Tutto di Digital Start +", "AI Engine completo", "CRM & Fidelizzazione avanzata", "Review Shield™", "2 Agenti IA inclusi", "18 mesi di piattaforma inclusi"], savings: "Risparmi €2.203" },
  { id: "empire", name: "Empire Domination", price: 7997, orig: 14400, monthly: 0, commission: "0%", badge: "Tutto Incluso", tagline: "Tutto ciò che serve, senza compromessi", features: ["✅ TUTTO incluso", "ZERO commissioni", "ZERO canone per 24 mesi", "5 Agenti IA inclusi", "Analytics predittivi IA", "Supporto VIP 7/7", "Funzionalità custom su richiesta"], savings: "Risparmi €6.403+" },
];

export default function LandingPricing() {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="relative py-20 sm:py-28 px-5 overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(228 22% 8%), hsl(232 20% 10%), hsl(228 22% 8%))" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[15%] w-[500px] h-[500px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, hsla(38,60%,50%,0.5), transparent 65%)", filter: "blur(150px)" }} />
      </div>

      <div className="max-w-[1100px] mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.div className="inline-flex items-center gap-2.5 mb-5 px-5 py-2.5 rounded-2xl" style={{ background: "hsla(var(--primary) / 0.1)", border: "1px solid hsla(var(--primary) / 0.15)" }} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--empire-violet)))" }}>
              <Crown className="w-3 h-3 text-white" />
            </div>
            <span className="text-[0.65rem] font-heading font-bold tracking-[2.5px] uppercase text-white/90">Piani & Prezzi</span>
          </motion.div>
          <motion.h2 className="text-[clamp(1.6rem,4.5vw,3rem)] font-heading font-bold text-white leading-[1.08] mb-4" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Investi nel Tuo <span className="text-shimmer">Futuro Digitale</span>
          </motion.h2>
          <motion.p className="text-foreground/45 max-w-[500px] mx-auto text-sm leading-[1.7]" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Pacchetti una tantum con tutto incluso. Nessun vincolo, nessun costo nascosto. Pagamento in 3 rate a tasso zero.
          </motion.p>
        </div>

        {/* Urgency */}
        <motion.div className="max-w-xl mx-auto mb-8 p-3 rounded-xl border border-accent/25 bg-accent/[0.06] text-center" animate={{ borderColor: ["hsla(35,45%,50%,0.25)", "hsla(35,45%,50%,0.5)", "hsla(35,45%,50%,0.25)"] }} transition={{ duration: 2.5, repeat: Infinity }}>
          <p className="text-[0.7rem] text-accent font-bold flex items-center justify-center gap-1.5">
            <Timer className="w-3.5 h-3.5 animate-pulse" /> Offerta lancio — Risparmia fino a <strong className="text-sm">€6.403</strong>
          </p>
        </motion.div>

        {/* Package cards */}
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
          {PACKAGES.map((p, idx) => {
            const isEmpire = p.id === "empire";
            const isGrowth = p.id === "growth";
            const discount = Math.round((p.orig - p.price) / p.orig * 100);

            return (
              <motion.div key={p.id} className={`relative rounded-2xl overflow-hidden transition-all ${isEmpire ? "border-2 border-accent/40 shadow-[0_8px_40px_hsla(35,45%,50%,0.15)]" : isGrowth ? "border-2 border-primary/35" : "border border-white/[0.08]"}`} style={{ background: isEmpire ? "linear-gradient(165deg, hsl(228 20% 14% / 0.98), hsl(35 12% 12% / 0.95))" : "linear-gradient(165deg, hsl(228 20% 14% / 0.97), hsl(232 22% 12% / 0.94))" }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                {/* Top bar */}
                <div className={`h-1 w-full ${isEmpire ? "bg-gradient-to-r from-accent via-yellow-500 to-accent" : isGrowth ? "bg-vibrant-gradient" : "bg-gradient-to-r from-primary/60 to-primary/30"}`} />
                {p.badge && <div className={`absolute top-0 right-0 px-4 py-2 rounded-bl-2xl text-[0.6rem] font-bold tracking-[1.5px] uppercase ${isEmpire ? "bg-gradient-to-r from-accent via-yellow-500 to-accent text-black" : "bg-vibrant-gradient text-primary-foreground"}`}>{p.badge}</div>}

                <div className="p-5 sm:p-6">
                  <p className={`text-[0.6rem] font-heading font-semibold tracking-[3px] uppercase ${isEmpire ? "text-accent/80" : "text-foreground/50"}`}>{p.name}</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-[2rem] font-heading font-extrabold text-white leading-none">€{p.price.toLocaleString("it-IT")}</span>
                    <div className="flex flex-col">
                      <span className="text-xs text-foreground/30 line-through">€{p.orig.toLocaleString("it-IT")}</span>
                      <span className="text-[0.5rem] text-foreground/35">una tantum</span>
                    </div>
                  </div>
                  <p className="text-xs text-foreground/50 mt-2">oppure <strong className="text-foreground/75">€{Math.round(p.price / 3)}/mese ×3</strong> <span className="text-green-400/80 font-semibold">(TAN 0%)</span></p>

                  {/* Monthly + Commission */}
                  <div className="flex items-center gap-2 mt-4">
                    <span className={`flex-1 text-center py-2 rounded-xl text-[0.6rem] font-bold border ${p.monthly === 0 ? "bg-accent/12 text-accent border-accent/25" : "bg-white/[0.03] text-foreground/50 border-white/[0.06]"}`}>
                      {p.monthly === 0 ? "€0/mese ✓" : `poi €${p.monthly}/mese`}
                    </span>
                    <span className={`flex-1 text-center py-2 rounded-xl text-[0.6rem] font-bold border ${p.commission === "0%" ? "bg-accent/12 text-accent border-accent/25" : "bg-white/[0.03] text-foreground/50 border-white/[0.06]"}`}>
                      {p.commission === "0%" ? "0% comm. ✓" : `${p.commission} transazioni`}
                    </span>
                  </div>

                  {isEmpire && (
                    <motion.div className="mt-4 p-3 rounded-xl bg-accent/[0.08] border border-accent/20 text-center" animate={{ boxShadow: ["0 0 0px hsla(35,45%,50%,0)", "0 0 25px hsla(35,45%,50%,0.12)", "0 0 0px hsla(35,45%,50%,0)"] }} transition={{ duration: 3, repeat: Infinity }}>
                      <p className="text-sm text-accent font-bold">💰 Solo €11/giorno per 24 mesi</p>
                      <p className="text-[0.55rem] text-accent/50 mt-0.5">Meno di un caffè al bar</p>
                    </motion.div>
                  )}

                  <p className="text-[0.6rem] text-foreground/40 mt-3 italic">{p.tagline}</p>

                  {/* Features */}
                  <ul className="mt-4 space-y-2">
                    {p.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-xs text-foreground/65">
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${f.includes("ZERO") || f.includes("0%") ? "bg-accent/15" : "bg-primary/10"}`}>
                          <Check className={`w-2.5 h-2.5 ${f.includes("ZERO") || f.includes("0%") ? "text-accent" : "text-primary"}`} />
                        </div>
                        <span className={f.includes("ZERO") || f.includes("0%") ? "font-bold text-accent" : ""}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Savings */}
                  <div className={`mt-4 p-2.5 rounded-xl text-xs font-bold text-center ${isEmpire ? "bg-accent/10 text-accent border border-accent/15" : "bg-primary/[0.05] text-primary/70 border border-primary/10"}`}>
                    💸 {p.savings}
                  </div>

                  {/* CTA */}
                  <motion.button onClick={() => navigate("/auth?plan=" + p.id)} className={`w-full mt-4 py-3.5 rounded-xl text-sm font-heading font-bold tracking-wider uppercase relative overflow-hidden ${isEmpire ? "bg-gradient-to-r from-accent via-yellow-500 to-accent text-black shadow-lg shadow-accent/20" : isGrowth ? "bg-vibrant-gradient text-primary-foreground" : "bg-primary/15 text-primary border border-primary/20"}`} whileTap={{ scale: 0.97 }}>
                    {(isEmpire || isGrowth) && <motion.div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)" }} animate={{ x: ["-200%", "300%"] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }} />}
                    <span className="relative z-10">{isEmpire ? "👑 Scelgo Empire" : isGrowth ? "🚀 Scelgo Growth AI" : "Inizia con Digital Start"}</span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Feature request CTA */}
        <motion.div className="max-w-xl mx-auto mt-10 text-center" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="p-5 rounded-2xl border border-primary/15 bg-primary/[0.04]">
            <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
            <h3 className="text-sm font-heading font-bold text-white mb-1">Non trovi quello che cerchi?</h3>
            <p className="text-xs text-foreground/40 mb-3">Sviluppiamo funzionalità su misura per il tuo business.</p>
            <motion.button onClick={() => navigate("/auth")} className="px-6 py-2.5 rounded-full bg-vibrant-gradient text-primary-foreground text-xs font-heading font-bold tracking-wider uppercase" whileHover={{ scale: 1.03 }}>
              Contattaci →
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
