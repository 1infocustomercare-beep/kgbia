import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Sparkles, Zap, Crown } from "lucide-react";

/* ─── SECTOR-SPECIFIC PRICING DATA ─── */
const SECTOR_PRICING: Record<string, { plans: { name: string; price: string; unit: string; features: string[]; popular?: boolean; cta: string }[] }> = {
  beauty: {
    plans: [
      { name: "Essential", price: "€49", unit: "/mese", features: ["Gestione appuntamenti", "Schede clienti", "Notifiche automatiche", "1 operatore", "Report base"], cta: "Inizia Gratis" },
      { name: "Professional", price: "€99", unit: "/mese", popular: true, features: ["Tutto Essential +", "Fino a 5 operatori", "Marketing automatico", "Programma fedeltà", "AI Beauty Advisor", "App clienti branded"], cta: "Prova 14gg Gratis" },
      { name: "Enterprise", price: "€199", unit: "/mese", features: ["Tutto Professional +", "Operatori illimitati", "Multi-sede", "API & integrazioni", "Account manager dedicato", "Formazione personalizzata"], cta: "Contattaci" },
    ],
  },
  healthcare: {
    plans: [
      { name: "Studio Base", price: "€79", unit: "/mese", features: ["Agenda digitale", "Cartelle pazienti", "Teleconsulto base", "Referti online", "1 medico"], cta: "Inizia Gratis" },
      { name: "Studio Pro", price: "€149", unit: "/mese", popular: true, features: ["Tutto Base +", "Fino a 5 medici", "Teleconsulto HD", "AI Triage Assistant", "Integrazione SSN", "Promemoria automatici"], cta: "Prova 14gg Gratis" },
      { name: "Clinica", price: "€349", unit: "/mese", features: ["Tutto Pro +", "Medici illimitati", "Multi-ambulatorio", "Fatturazione elettronica", "API HL7/FHIR", "Support prioritario"], cta: "Contattaci" },
    ],
  },
  fitness: {
    plans: [
      { name: "Starter", price: "€59", unit: "/mese", features: ["Gestione iscritti", "Classi & prenotazioni", "Check-in digitale", "1 trainer", "Report base"], cta: "Prova Gratis" },
      { name: "Performance", price: "€129", unit: "/mese", popular: true, features: ["Tutto Starter +", "Fino a 10 trainer", "App soci branded", "Programmi allenamento AI", "Marketing automatico", "Pagamenti ricorrenti"], cta: "Prova 14gg Gratis" },
      { name: "Enterprise", price: "€249", unit: "/mese", features: ["Tutto Performance +", "Trainer illimitati", "Multi-sede", "Wearable integration", "Account manager", "White label"], cta: "Contattaci" },
    ],
  },
  hotel: {
    plans: [
      { name: "Boutique", price: "€99", unit: "/mese", features: ["Channel manager base", "Booking engine", "Gestione camere", "Check-in digitale", "Fino a 20 camere"], cta: "Inizia Gratis" },
      { name: "Premium", price: "€249", unit: "/mese", popular: true, features: ["Tutto Boutique +", "Fino a 80 camere", "Revenue management AI", "Concierge digitale", "Upselling automatico", "Integrazione OTA"], cta: "Prova 14gg Gratis" },
      { name: "Resort", price: "€499", unit: "/mese", features: ["Tutto Premium +", "Camere illimitate", "Multi-struttura", "SPA & F&B management", "API complete", "Support 24/7"], cta: "Contattaci" },
    ],
  },
  retail: {
    plans: [
      { name: "Shop", price: "€49", unit: "/mese", features: ["Catalogo prodotti", "Ordini online", "Gestione inventario", "1 punto vendita", "Report vendite"], cta: "Inizia Gratis" },
      { name: "Store Pro", price: "€99", unit: "/mese", popular: true, features: ["Tutto Shop +", "Fino a 5 POS", "CRM clienti", "Programma loyalty", "AI Product Advisor", "Marketing automatico"], cta: "Prova 14gg Gratis" },
      { name: "Chain", price: "€249", unit: "/mese", features: ["Tutto Pro +", "POS illimitati", "Multi-negozio", "Warehouse management", "API & integrazioni", "Account manager"], cta: "Contattaci" },
    ],
  },
  bakery: {
    plans: [
      { name: "Artigiano", price: "€39", unit: "/mese", features: ["Pre-ordini online", "Gestione prodotti", "Notifiche clienti", "QR menu", "Report giornaliero"], cta: "Inizia Gratis" },
      { name: "Maestro", price: "€79", unit: "/mese", popular: true, features: ["Tutto Artigiano +", "Programma fedeltà", "Consegne a domicilio", "AI Menu Advisor", "Marketing WhatsApp", "App clienti"], cta: "Prova 14gg Gratis" },
      { name: "Catena", price: "€159", unit: "/mese", features: ["Tutto Maestro +", "Multi-punto vendita", "Gestione produzione", "Fornitori & ordini", "API complete", "Support dedicato"], cta: "Contattaci" },
    ],
  },
  beach: {
    plans: [
      { name: "Spiaggia", price: "€49", unit: "/mese", features: ["Mappa ombrelloni", "Prenotazioni online", "Gestione postazioni", "Cassa base", "Report giornaliero"], cta: "Inizia Gratis" },
      { name: "Lido Pro", price: "€99", unit: "/mese", popular: true, features: ["Tutto Spiaggia +", "Abbonamenti stagionali", "Bar & ristorante", "App clienti", "Marketing automatico", "AI Weather Alerts"], cta: "Prova 14gg Gratis" },
      { name: "Resort", price: "€199", unit: "/mese", features: ["Tutto Pro +", "Multi-stabilimento", "Piscine & SPA", "Cross-selling", "API complete", "Support prioritario"], cta: "Contattaci" },
    ],
  },
  trades: {
    plans: [
      { name: "Artigiano", price: "€39", unit: "/mese", features: ["Gestione interventi", "Preventivi digitali", "Calendario lavori", "1 tecnico", "Report base"], cta: "Inizia Gratis" },
      { name: "Impresa", price: "€89", unit: "/mese", popular: true, features: ["Tutto Artigiano +", "Fino a 10 tecnici", "Fatturazione automatica", "GPS fleet tracking", "AI Scheduler", "CRM clienti"], cta: "Prova 14gg Gratis" },
      { name: "Enterprise", price: "€199", unit: "/mese", features: ["Tutto Impresa +", "Tecnici illimitati", "Multi-sede", "Integrazione contabile", "API complete", "Account manager"], cta: "Contattaci" },
    ],
  },
};

/* fallback */
const DEFAULT_PLANS = SECTOR_PRICING.trades;

function AnimatedNum({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!isInView || value <= 0) return;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1200, 1);
      setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value]);
  return <span ref={ref}>{display}{suffix}</span>;
}

interface Props {
  sector: string;
  accentColor: string;
  darkMode?: boolean;
  bgColor?: string;
  textColor?: string;
}

export function DemoPricingSection({ sector, accentColor, darkMode = false, bgColor, textColor }: Props) {
  const sectorData = SECTOR_PRICING[sector] || DEFAULT_PLANS;
  const plans = sectorData.plans;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const bg = bgColor || (darkMode ? "#0a0a0a" : "#fff");
  const text = textColor || (darkMode ? "#fff" : "#111");
  const muted = darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)";
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)";
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const popularCardBg = darkMode ? "rgba(255,255,255,0.06)" : "#fff";

  const icons = [Sparkles, Zap, Crown];

  return (
    <section ref={ref} className="py-20 sm:py-28 px-4" style={{ background: bg }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-3"
            style={{ color: accentColor }}
          >
            I Nostri Piani
          </motion.p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: text }}>
            Scegli il Piano <span style={{ color: accentColor }}>Perfetto</span>
          </h2>
          <p className="text-sm mt-3 max-w-md mx-auto" style={{ color: muted }}>
            Prova gratuita 14 giorni. Nessuna carta di credito richiesta.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 lg:gap-6">
          {plans.map((plan, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.6 }}
                className={`relative rounded-2xl p-6 sm:p-7 transition-transform hover:-translate-y-1 ${plan.popular ? "scale-[1.02] sm:scale-105" : ""}`}
                style={{
                  background: plan.popular ? popularCardBg : cardBg,
                  border: plan.popular ? `2px solid ${accentColor}` : `1px solid ${cardBorder}`,
                  boxShadow: plan.popular ? `0 20px 60px -15px ${accentColor}33` : "none",
                }}
              >
                {plan.popular && (
                  <Badge
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] px-4 py-1 rounded-full text-white font-bold tracking-wider uppercase shadow-lg"
                    style={{ background: accentColor }}
                  >
                    Più Scelto
                  </Badge>
                )}

                <div className="flex items-center gap-2 mb-4 mt-1">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${accentColor}15` }}
                  >
                    <Icon className="w-4.5 h-4.5" style={{ color: accentColor }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: text }}>{plan.name}</h3>
                </div>

                <div className="mb-5">
                  <span className="text-4xl font-bold" style={{ color: text }}>{plan.price}</span>
                  <span className="text-sm ml-1" style={{ color: muted }}>{plan.unit}</span>
                </div>

                <ul className="space-y-2.5 mb-7">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm" style={{ color: muted }}>
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: accentColor }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full h-11 rounded-xl font-semibold text-sm shadow-lg transition-all hover:shadow-xl"
                  style={{
                    background: plan.popular ? accentColor : "transparent",
                    color: plan.popular ? "#fff" : text,
                    border: plan.popular ? "none" : `1px solid ${cardBorder}`,
                  }}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center text-xs mt-8"
          style={{ color: muted }}
        >
          Tutti i piani includono supporto tecnico, aggiornamenti gratuiti e conformità GDPR.
        </motion.p>
      </motion.div>
    </section>
  );
}
