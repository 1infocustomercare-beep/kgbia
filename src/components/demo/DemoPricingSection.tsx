/**
 * DemoPricingSection — 3-tier pricing preview with sector-specific accent
 */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, X, Sparkles, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSectorTheme } from "@/config/sector-themes";
import PremiumSectionBg from "./PremiumSectionBg";
import { motion, useInView } from "framer-motion";
import { Check, X, Sparkles, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSectorTheme } from "@/config/sector-themes";

interface Props {
  sector: string;
  accentColor: string;
  sectorName: string;
}

const PLANS = [
  {
    name: "Starter",
    price: 49,
    period: "/mese",
    desc: "Perfetto per iniziare a digitalizzare",
    features: [
      { label: "Sito Web Professionale", included: true },
      { label: "CRM fino a 100 clienti", included: true },
      { label: "Prenotazioni Online", included: true },
      { label: "1 Agente AI", included: true },
      { label: "WhatsApp Business", included: false },
      { label: "Analytics Avanzati", included: false },
      { label: "Marketing Automation", included: false },
      { label: "Supporto Prioritario", included: false },
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: 99,
    period: "/mese",
    desc: "Il più scelto — tutto ciò che serve per crescere",
    features: [
      { label: "Sito Web Premium + SEO", included: true },
      { label: "CRM Clienti Illimitati", included: true },
      { label: "Prenotazioni + Pagamenti", included: true },
      { label: "5 Agenti AI Attivi", included: true },
      { label: "WhatsApp Business AI", included: true },
      { label: "Analytics Avanzati", included: true },
      { label: "Marketing Automation", included: false },
      { label: "Account Manager Dedicato", included: false },
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: 199,
    period: "/mese",
    desc: "Per business ambiziosi che vogliono dominare",
    features: [
      { label: "Tutto di Professional +", included: true },
      { label: "Agenti AI Illimitati", included: true },
      { label: "Marketing Automation AI", included: true },
      { label: "Multi-sede / Multi-staff", included: true },
      { label: "API & Integrazioni Custom", included: true },
      { label: "Report White-label", included: true },
      { label: "Account Manager Dedicato", included: true },
      { label: "SLA 99.9% Uptime", included: true },
    ],
    popular: false,
  },
];

export default function DemoPricingSection({ sector, accentColor, sectorName }: Props) {
  const theme = getSectorTheme(sector);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const isDark = theme.palette.bg.startsWith("#0") || theme.palette.bg.startsWith("rgba");
  const textColor = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-white/40" : "text-gray-500";

  return (
    <section
      ref={ref}
      className="py-20 px-4 relative overflow-hidden"
      style={{ background: isDark ? "linear-gradient(180deg, rgba(10,10,20,0.98), rgba(0,0,0,0.95))" : theme.palette.bg }}
    >
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: `linear-gradient(${accentColor}30 1px, transparent 1px), linear-gradient(90deg, ${accentColor}30 1px, transparent 1px)`, backgroundSize: "60px 60px" }}
      />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[0.65rem] font-bold uppercase tracking-[0.2em] mb-4"
            style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}25` }}
          >
            <Zap className="w-3 h-3" /> Prezzi Trasparenti
          </div>
          <h2 className={`text-2xl sm:text-4xl font-bold ${textColor} mb-3`}>
            Scegli il Piano Perfetto per{" "}
            <span style={{ color: accentColor }}>{sectorName}</span>
          </h2>
          <p className={`text-sm ${textMuted} max-w-lg mx-auto`}>
            14 giorni di prova gratuita · Nessuna carta di credito richiesta · Cancella quando vuoi
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className={`relative rounded-2xl border p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? `${isDark ? "bg-white/[0.06]" : "bg-white"} shadow-2xl`
                  : `${isDark ? "bg-white/[0.02]" : "bg-white/80"}`
              }`}
              style={{
                borderColor: plan.popular ? accentColor : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
                boxShadow: plan.popular ? `0 20px 60px -15px ${accentColor}25` : undefined,
              }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[0.6rem] font-bold uppercase tracking-wider text-white flex items-center gap-1.5"
                  style={{ background: accentColor }}
                >
                  <Sparkles className="w-3 h-3" /> Più Popolare
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <h3 className={`text-lg font-bold ${textColor} mb-1`}>{plan.name}</h3>
                <p className={`text-xs ${textMuted} mb-4`}>{plan.desc}</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${textColor}`}>€{plan.price}</span>
                  <span className={`text-sm ${textMuted}`}>{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 flex-1 mb-6">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2.5">
                    {f.included ? (
                      <Check className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
                    ) : (
                      <X className={`w-4 h-4 shrink-0 ${isDark ? "text-white/15" : "text-gray-300"}`} />
                    )}
                    <span className={`text-xs ${f.included ? (isDark ? "text-white/70" : "text-gray-700") : (isDark ? "text-white/20" : "text-gray-400")}`}>
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button
                className={`w-full h-12 rounded-xl font-bold text-sm transition-all ${
                  plan.popular ? "text-white border-0 shadow-lg" : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
                style={plan.popular ? { background: accentColor, boxShadow: `0 8px 24px -4px ${accentColor}40` } : {
                  borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
                  color: isDark ? "white" : "black",
                }}
              >
                {plan.popular ? (
                  <>Inizia Gratis <ArrowRight className="w-4 h-4 ml-1" /></>
                ) : (
                  "Inizia la Prova"
                )}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          className={`text-center text-[0.65rem] ${textMuted} mt-8`}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          💡 Tutti i piani includono: Setup guidato · Migrazione dati · GDPR Compliance · Aggiornamenti automatici
        </motion.p>
      </div>
    </section>
  );
}
