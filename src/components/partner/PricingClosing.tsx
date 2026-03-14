import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, CreditCard, Zap, Shield, CheckCircle, Star, Package, ChevronDown, Gem, Sparkles } from "lucide-react";

interface Props {
  onOpenROI: () => void;
  demoMode?: boolean;
}

const PACKAGES = [
  {
    id: "digital_start",
    name: "Digital Start",
    price: 1997,
    monthlyFee: 49,
    commission: "2%",
    tagline: "Digitalizza in 24h",
    features: [
      "App White Label completa",
      "Menu/Catalogo QR illimitato",
      "Ordini & Prenotazioni",
      "Dashboard Analytics base",
      "Setup & Onboarding guidato",
      "12 mesi di piattaforma inclusi",
    ],
    installments3: 666, // €1.997 / 3 = ~€666 TAN 0%
    installments6: 352, // €1.997 × 1.059 / 6 = ~€352 TAN 5.9%
    partnerCommission: 997,
  },
  {
    id: "growth_ai",
    name: "Growth AI",
    price: 4997,
    monthlyFee: 29,
    commission: "1%",
    tagline: "IA + automazioni per esplodere",
    badge: "PIÙ SCELTO",
    highlight: true,
    features: [
      "Tutto di Digital Start +",
      "AI Engine completo sbloccato",
      "CRM & Fidelizzazione avanzata",
      "Review Shield™",
      "Push Notification illimitate",
      "Traduzioni automatiche 8 lingue",
      "2 Agenti IA inclusi",
      "Commissioni ridotte all'1%",
      "18 mesi inclusi",
    ],
    installments3: 1666, // €4.997 / 3 TAN 0%
    installments6: 880, // €4.997 × 1.059 / 6 TAN 5.9%
    partnerCommission: 997,
  },
  {
    id: "empire_domination",
    name: "Empire Domination",
    price: 7997,
    monthlyFee: 0,
    commission: "0%",
    tagline: "Tutto incluso, zero limiti, per sempre",
    badge: "TUTTO INCLUSO",
    features: [
      "✅ TUTTO incluso — ogni funzione",
      "ZERO commissioni sulle transazioni",
      "ZERO canone mensile — 24 mesi",
      "5 Agenti IA inclusi",
      "Multi-lingua illimitato",
      "Loyalty Wallet avanzato",
      "GhostManager™ clienti persi",
      "Analytics predittivi con IA",
      "Supporto prioritario 7/7 VIP",
      "White Label completo",
      "Account Manager dedicato",
    ],
    installments3: 2666, // €7.997 / 3 TAN 0%
    installments6: 1412, // €7.997 × 1.059 / 6 TAN 5.9%
    partnerCommission: 997,
    daily: "~€11/giorno per 24 mesi",
  },
];

const PricingClosing = ({ onOpenROI, demoMode = false }: Props) => {
  const [expandedPkg, setExpandedPkg] = useState("growth_ai");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
      {/* Hero */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/15 via-card to-amber-500/10 border border-primary/20 text-center">
        <Crown className="w-10 h-10 text-primary mx-auto mb-3" />
        <h2 className="text-xl font-display font-bold text-foreground">
          {demoMode ? "Scegli il Tuo Piano" : "Chiudi il Contratto"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {demoMode ? "3 pacchetti per ogni esigenza" : "Mostra i 3 pacchetti al cliente"}
        </p>
      </div>

      {/* Package Cards */}
      {PACKAGES.map((pkg, idx) => {
        const isExpanded = expandedPkg === pkg.id;
        const isEmpire = pkg.id === "empire_domination";

        return (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.08 }}
            onClick={() => setExpandedPkg(pkg.id)}
            className={`relative p-4 rounded-2xl cursor-pointer transition-all ${
              isEmpire
                ? "border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-primary/5"
                : pkg.highlight
                  ? "border-2 border-primary bg-gradient-to-br from-primary/10 to-amber-500/5"
                  : "border border-border/50 bg-card"
            }`}
          >
            {/* Badge */}
            {pkg.badge && (
              <div className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 ${
                isEmpire
                  ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black"
                  : "bg-primary text-primary-foreground"
              }`}>
                <Star className="w-2.5 h-2.5" /> {pkg.badge}
              </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              {isEmpire ? <Gem className="w-5 h-5 text-amber-500" /> : pkg.highlight ? <Zap className="w-5 h-5 text-primary" /> : <Package className="w-5 h-5 text-muted-foreground" />}
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{pkg.name}</h3>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-1">
              <p className="text-3xl font-display font-bold text-foreground">€{pkg.price.toLocaleString("it-IT")}</p>
              <span className="text-[10px] text-muted-foreground">una tantum</span>
            </div>

            {/* Monthly + Commission pills */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                pkg.monthlyFee === 0 ? "bg-amber-500/15 text-amber-500" : "bg-muted/30 text-muted-foreground"
              }`}>
                {pkg.monthlyFee === 0 ? "€0/mese ✓" : `poi €${pkg.monthlyFee}/mese`}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                pkg.commission === "0%" ? "bg-amber-500/15 text-amber-500" : "bg-muted/30 text-muted-foreground"
              }`}>
                {pkg.commission === "0%" ? "0% commissioni ✓" : `${pkg.commission} transazioni`}
              </span>
            </div>

            {/* Empire daily nudge */}
            {isEmpire && pkg.daily && (
              <div className="mb-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                <p className="text-[10px] text-amber-500 font-bold">💰 {pkg.daily} — poi è tutto tuo</p>
              </div>
            )}

            {/* Features - expandable */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <div className="space-y-1.5 mb-3">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px]">
                        <CheckCircle className={`w-3 h-3 flex-shrink-0 ${
                          feature.includes("ZERO") || feature.includes("0%") ? "text-amber-500" : "text-emerald-400"
                        }`} />
                        <span className={`text-foreground ${feature.includes("ZERO") || feature.includes("0%") ? "font-bold text-amber-500" : ""}`}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Installments */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-muted/20 border border-border/30 text-center">
                      <p className="text-sm font-display font-bold text-foreground">€{pkg.installments3.toLocaleString("it-IT")}</p>
                      <p className="text-[9px] text-muted-foreground">x 3 mesi</p>
                      <p className="text-[9px] text-emerald-400 font-semibold">TAN 0%</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/20 border border-border/30 text-center">
                      <p className="text-sm font-display font-bold text-foreground">€{pkg.installments6.toLocaleString("it-IT")}</p>
                      <p className="text-[9px] text-muted-foreground">x 6 mesi</p>
                      <p className="text-[9px] text-amber-400 font-semibold">TAN 5.9%</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isExpanded && (
              <p className="text-[10px] text-primary/60 font-semibold mt-1 flex items-center gap-1">
                <ChevronDown className="w-3 h-3" /> Tocca per dettagli
              </p>
            )}

            {/* Partner commission - HIDDEN in demo mode */}
            {!demoMode && isExpanded && (
              <div className="mt-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                <p className="text-[10px] text-foreground font-semibold">
                  💰 Tua Commissione: <span className="text-emerald-400 font-bold">€{pkg.partnerCommission}</span>
                </p>
              </div>
            )}
          </motion.div>
        );
      })}

      {/* ROI Button */}
      <motion.button
        onClick={onOpenROI}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-amber-500 text-primary-foreground font-bold text-sm tracking-wide shadow-lg shadow-primary/20"
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        📊 {demoMode ? "Calcola il Tuo Risparmio" : "Quanto Risparmi con Empire?"}
      </motion.button>

      {/* Guarantee */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-amber-500/5 border border-primary/10 text-center space-y-2">
        <Shield className="w-6 h-6 text-primary mx-auto" />
        <p className="text-sm font-display font-bold text-foreground">
          Risultati Garantiti + 1 Mese Assistenza Gratuita
        </p>
        <p className="text-[10px] text-muted-foreground">
          Nessun vincolo. Proprietà totale. Supporto dedicato dal primo giorno.
        </p>
      </div>

      {/* Partner Note - HIDDEN in demo mode */}
      {!demoMode && (
        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-center">
          <p className="text-[10px] text-muted-foreground">
            💰 Commissione <span className="text-emerald-400 font-bold">€997</span> per ogni pacchetto venduto — qualsiasi tier.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default PricingClosing;