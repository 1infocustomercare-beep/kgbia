import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChefHat, Car, Scissors, Heart, Store, Dumbbell, Building,
  Calendar, Shield, TrendingUp, Bell, QrCode, MonitorSmartphone,
  Wallet, Users, Package, CreditCard, Target, BarChart3,
  Fingerprint, ClipboardCheck, Bot, ArrowRight, Layers,
} from "lucide-react";

import cartoonFood from "@/assets/cartoon-sector-food.png";
import cartoonNcc from "@/assets/cartoon-sector-ncc.png";
import cartoonBeauty from "@/assets/cartoon-sector-beauty.png";
import cartoonHealthcare from "@/assets/cartoon-sector-healthcare.png";
import cartoonRetail from "@/assets/cartoon-sector-retail.png";
import cartoonFitness from "@/assets/cartoon-sector-fitness.png";
import cartoonHotel from "@/assets/cartoon-sector-hotel.png";

const smoothEase = [0.22, 1, 0.36, 1] as const;

const SHOWCASE_SECTORS = [
  {
    id: "food",
    label: "Food & Ristorazione",
    icon: <ChefHat className="w-3.5 h-3.5" />,
    color: "hsla(15,80%,55%,1)",
    headline: "Ristorante Digitale,",
    shimmer: "Revenue ×3",
    desc: "Menu QR, ordini in tempo reale, Kitchen Display, HACCP digitale e fidelizzazione automatica — trasforma ogni copertura in un cliente ricorrente.",
    features: [
      { title: "Menu QR & Ordini Smart", desc: "Ordinazioni digitali con upselling AI integrato", icon: <QrCode className="w-3 h-3" /> },
      { title: "Kitchen Display System", desc: "Gestione comande in tempo reale per la cucina", icon: <MonitorSmartphone className="w-3 h-3" /> },
      { title: "Fidelizzazione Automatica", desc: "Loyalty wallet, cashback e promo personalizzate", icon: <Wallet className="w-3 h-3" /> },
      { title: "Review Shield™", desc: "Intercetta recensioni negative prima che vadano online", icon: <Shield className="w-3 h-3" /> },
    ],
    img: cartoonFood,
    stats: [{ label: "Scontrino medio", val: "+35%" }, { label: "Clienti fedeli", val: "4x" }, { label: "Tempo ordine", val: "-60%" }],
    slug: "impero-roma",
  },
  {
    id: "ncc",
    label: "NCC & Trasporti",
    icon: <Car className="w-3.5 h-3.5" />,
    color: "hsla(38,50%,55%,1)",
    headline: "Trasporto Premium,",
    shimmer: "Automatizzato al 100%",
    desc: "Gestisci flotta NCC, prenotazioni e autisti con un sistema AI che automatizza tariffe, assegnazioni e comunicazioni — tutto con il tuo brand.",
    features: [
      { title: "Booking Engine Intelligente", desc: "Prenotazioni con calcolo tariffe automatico per tratta e veicolo", icon: <Calendar className="w-3 h-3" /> },
      { title: "Gestione Flotta & Autisti", desc: "Monitora scadenze CQC, patenti e revisioni in tempo reale", icon: <Shield className="w-3 h-3" /> },
      { title: "Tariffe Dinamiche", desc: "Prezzi custom per tratta, extra notturno e festivi", icon: <TrendingUp className="w-3 h-3" /> },
      { title: "Tracking & Notifiche Live", desc: "Conferme, reminder e tracking in tempo reale per il cliente", icon: <Bell className="w-3 h-3" /> },
    ],
    img: cartoonNcc,
    stats: [{ label: "Flotta", val: "12 veicoli" }, { label: "Rating", val: "4.9★" }, { label: "Revenue", val: "+40%" }],
    slug: "amalfi-luxury-transfer",
  },
  {
    id: "beauty",
    label: "Beauty & Wellness",
    icon: <Scissors className="w-3.5 h-3.5" />,
    color: "hsla(330,60%,55%,1)",
    headline: "Salone Intelligente,",
    shimmer: "Clienti × Infinito",
    desc: "Agenda smart, schede cliente, promozioni automatiche e fidelity digitale — riempi ogni slot e fai tornare ogni cliente.",
    features: [
      { title: "Agenda AI Multi-Operatore", desc: "Prenotazioni intelligenti che ottimizzano la giornata", icon: <Calendar className="w-3 h-3" /> },
      { title: "Schede Cliente Avanzate", desc: "Storico trattamenti, preferenze e allergie", icon: <Users className="w-3 h-3" /> },
      { title: "Marketing Automatico", desc: "Promo compleanno, recall e win-back automatici", icon: <Bell className="w-3 h-3" /> },
      { title: "Fidelity Card Digitale", desc: "Punti, cashback e premi personalizzati", icon: <Wallet className="w-3 h-3" /> },
    ],
    img: cartoonBeauty,
    stats: [{ label: "Slot occupati", val: "+45%" }, { label: "No-show", val: "-80%" }, { label: "Ritorni", val: "3.2x" }],
    slug: "glow-beauty-milano",
  },
  {
    id: "healthcare",
    label: "Salute & Cliniche",
    icon: <Heart className="w-3.5 h-3.5" />,
    color: "hsla(170,60%,45%,1)",
    headline: "Studio Medico Digitale,",
    shimmer: "Pazienti al Centro",
    desc: "Cartelle digitali, telemedicina, recall automatici e compliance sanitaria — modernizza il tuo studio senza compromessi.",
    features: [
      { title: "Cartelle Pazienti Digitali", desc: "Storico completo con documenti e referti", icon: <ClipboardCheck className="w-3 h-3" /> },
      { title: "Telemedicina Integrata", desc: "Visite remote sicure con condivisione documenti", icon: <MonitorSmartphone className="w-3 h-3" /> },
      { title: "Recall Automatici", desc: "Richiami per visite periodiche e follow-up", icon: <Bell className="w-3 h-3" /> },
      { title: "Compliance Sanitaria", desc: "GDPR, audit trail e archiviazione certificata", icon: <Shield className="w-3 h-3" /> },
    ],
    img: cartoonHealthcare,
    stats: [{ label: "Pazienti", val: "+60%" }, { label: "Recall", val: "92%" }, { label: "Soddisfazione", val: "4.8★" }],
    slug: "studio-salus-torino",
  },
  {
    id: "retail",
    label: "Retail & Negozi",
    icon: <Store className="w-3.5 h-3.5" />,
    color: "hsla(0,0%,65%,1)",
    headline: "Negozio Connesso,",
    shimmer: "Vendite × Automatiche",
    desc: "Inventario in tempo reale, POS integrato, e-commerce e promozioni AI — ogni interazione diventa conversione.",
    features: [
      { title: "Inventario Real-Time", desc: "Stock sincronizzato tra fisico e online", icon: <Package className="w-3 h-3" /> },
      { title: "E-commerce Integrato", desc: "Catalogo online con ordini e pagamenti", icon: <CreditCard className="w-3 h-3" /> },
      { title: "Promozioni AI", desc: "Coupon e offerte personalizzate per segmento", icon: <Target className="w-3 h-3" /> },
      { title: "Analytics Vendite", desc: "Report fatturato, margini e trend per prodotto", icon: <BarChart3 className="w-3 h-3" /> },
    ],
    img: cartoonRetail,
    stats: [{ label: "Conversion", val: "+55%" }, { label: "Scontrino", val: "+28%" }, { label: "Resi", val: "-40%" }],
    slug: "bottega-artigiana-firenze",
  },
  {
    id: "fitness",
    label: "Fitness & Palestre",
    icon: <Dumbbell className="w-3.5 h-3.5" />,
    color: "hsla(25,85%,55%,1)",
    headline: "Palestra Smart,",
    shimmer: "Members ×3",
    desc: "Gestione classi, abbonamenti digitali, check-in automatico e community — fai crescere la tua base iscritti con l'AI.",
    features: [
      { title: "Classi & Prenotazioni", desc: "Booking lezioni con lista d'attesa automatica", icon: <Calendar className="w-3 h-3" /> },
      { title: "Abbonamenti Digitali", desc: "Gestione piani, rinnovi e pagamenti ricorrenti", icon: <CreditCard className="w-3 h-3" /> },
      { title: "Check-in Automatico", desc: "QR code o NFC per accesso istantaneo", icon: <QrCode className="w-3 h-3" /> },
      { title: "Community & Social", desc: "Sfide, classifiche e engagement dei members", icon: <Users className="w-3 h-3" /> },
    ],
    img: cartoonFitness,
    stats: [{ label: "Iscritti", val: "+65%" }, { label: "Retention", val: "89%" }, { label: "Revenue", val: "+42%" }],
    slug: "iron-gym-milano",
  },
  {
    id: "hospitality",
    label: "Hotel & Ospitalità",
    icon: <Building className="w-3.5 h-3.5" />,
    color: "hsla(45,50%,50%,1)",
    headline: "Hotel Intelligente,",
    shimmer: "Ospiti Deliziati",
    desc: "Revenue management, check-in digitale, housekeeping tracker e concierge AI — ogni ospite riceve un'esperienza 5 stelle.",
    features: [
      { title: "Revenue Management AI", desc: "Tariffe dinamiche basate su domanda e stagionalità", icon: <TrendingUp className="w-3 h-3" /> },
      { title: "Check-in Digitale", desc: "Self check-in/out con documento e firma digitale", icon: <Fingerprint className="w-3 h-3" /> },
      { title: "Housekeeping Tracker", desc: "Gestione pulizie e manutenzione in tempo reale", icon: <ClipboardCheck className="w-3 h-3" /> },
      { title: "Concierge AI 24/7", desc: "Assistente multilingue per prenotazioni e info", icon: <Bot className="w-3 h-3" /> },
    ],
    img: cartoonHotel,
    stats: [{ label: "Occupancy", val: "+38%" }, { label: "RevPAR", val: "+52%" }, { label: "Review", val: "4.9★" }],
    slug: "villa-belvedere",
  },
];

interface SectionLabelProps { text: string; icon?: React.ReactNode }
const SectionLabel = ({ text, icon }: SectionLabelProps) => (
  <motion.div className="inline-flex items-center gap-2.5 mb-5"
    initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -150px 0px" as any }}>
    <div className="relative flex items-center gap-2 px-4 py-2 rounded-full premium-label overflow-hidden" style={{ borderLeft: "1px solid hsla(35,45%,50%,0.15)" }}>
      <motion.div className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent 30%, hsla(35,45%,55%,0.12) 50%, transparent 70%)" }}
        animate={{ x: ["-150%", "250%"] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }} />
      {icon || <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(35,45%,50%)" }} animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }} />}
      <span className="text-[0.65rem] font-heading font-semibold tracking-[3px] uppercase text-primary/90 relative z-10">{text}</span>
    </div>
  </motion.div>
);

export default function MultiSectorShowcase() {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sector = SHOWCASE_SECTORS[activeIdx];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => setActiveIdx(p => (p + 1) % SHOWCASE_SECTORS.length), 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  return (
    <>
      {/* Section header */}
      <div className="text-center mb-10">
        <SectionLabel text="Il Tuo Settore, Potenziato" icon={<Layers className="w-3 h-3 text-primary" />} />
        <motion.h2 className="text-[clamp(1.6rem,4.5vw,3rem)] font-heading font-bold text-foreground leading-[1.08] mb-3"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          Una Piattaforma, <span className="text-shimmer">Ogni Business</span>
        </motion.h2>
        <p className="text-foreground/35 text-sm max-w-xl mx-auto">
          Non importa il settore — Empire AI si adatta al tuo business con moduli verticali, automazioni specifiche e un'AI che parla la lingua del tuo mercato.
        </p>
      </div>

      {/* Sector pills */}
      <div className="flex gap-2 justify-center flex-wrap mb-10">
        {SHOWCASE_SECTORS.map((s, i) => (
          <motion.button
            key={s.id}
            onClick={() => { setActiveIdx(i); setIsAutoPlaying(false); }}
            className={`relative px-4 py-2 rounded-full text-xs font-heading font-semibold tracking-wider uppercase transition-all duration-400 border ${
              activeIdx === i
                ? "text-foreground border-primary/40"
                : "text-foreground/30 border-border/20 hover:text-foreground/60 hover:border-border/40"
            }`}
            style={activeIdx === i ? {
              background: "linear-gradient(135deg, hsla(265,40%,20%,0.6), hsla(265,20%,15%,0.4))",
              boxShadow: `0 0 20px ${s.color.replace("1)", "0.12)")}, inset 0 1px 0 hsla(0,0%,100%,0.06)`,
            } : { background: "hsla(0,0%,100%,0.03)" }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            {activeIdx === i && (
              <motion.div className="absolute inset-0 rounded-full"
                style={{ border: `1px solid ${s.color.replace("1)", "0.3)")}` }}
                layoutId="sectorRing"
                transition={{ type: "spring", stiffness: 300, damping: 30 }} />
            )}
            <span className="relative z-10 flex items-center gap-1.5">{s.icon} {s.label}</span>
            {activeIdx === i && isAutoPlaying && (
              <motion.div className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full origin-left"
                style={{ background: s.color }}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 5, ease: "linear" }}
                key={`progress-${activeIdx}`} />
            )}
          </motion.button>
        ))}
      </div>

      {/* Content area */}
      <AnimatePresence mode="wait">
        <motion.div key={sector.id}
          className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4, ease: smoothEase }}>

          {/* Left — Text */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-[0.6rem] font-heading font-semibold tracking-[2px] uppercase"
              style={{ background: sector.color.replace("1)", "0.08)"), color: sector.color, border: `1px solid ${sector.color.replace("1)", "0.15)")}` }}>
              {sector.icon} {sector.label}
            </div>
            <h3 className="text-[clamp(1.5rem,3.5vw,2.4rem)] font-heading font-bold text-foreground leading-[1.08] mb-5">
              {sector.headline}<br /><span className="text-shimmer">{sector.shimmer}</span>
            </h3>
            <p className="text-foreground/40 leading-[1.7] max-w-lg mx-auto lg:mx-0 mb-7 text-sm">{sector.desc}</p>

            <div className="space-y-3 mb-8 text-left max-w-md mx-auto lg:mx-0">
              {sector.features.map((f, i) => (
                <motion.div key={i} className="flex gap-3 items-start group"
                  initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <div className="w-7 h-7 min-w-[28px] rounded-lg flex items-center justify-center mt-0.5 transition-colors"
                    style={{ background: sector.color.replace("1)", "0.1)") }}>
                    <span style={{ color: sector.color }}>{f.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{f.title}</p>
                    <p className="text-[0.6rem] text-foreground/35 mt-0.5">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={() => navigate(`/b/${sector.slug}`)}
              className="group px-7 py-3.5 rounded-full font-bold text-sm font-heading tracking-wider uppercase inline-flex items-center gap-2 text-white"
              style={{
                background: `linear-gradient(135deg, ${sector.color}, ${sector.color.replace("1)", "0.7)")})`,
                boxShadow: `0 8px 30px ${sector.color.replace("1)", "0.2)")}`,
              }}
              whileHover={{ scale: 1.03, boxShadow: `0 15px 50px ${sector.color.replace("1)", "0.3)")}` }}
              whileTap={{ scale: 0.97 }}>
              Scopri Demo {sector.label.split(" ")[0]} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
            </motion.button>
          </div>

          {/* Right — Visual */}
          <div className="w-full">
            <div className="relative rounded-2xl overflow-hidden" style={{
              boxShadow: `0 0 60px ${sector.color.replace("1)", "0.08)")}, 0 20px 60px hsla(0,0%,0%,0.3)`,
              border: `1px solid ${sector.color.replace("1)", "0.12)")}`,
            }}>
              <img src={sector.img} alt={sector.label} className="w-full aspect-[4/3] object-cover" loading="lazy" />
              <div className="absolute inset-0 pointer-events-none" style={{
                background: `linear-gradient(to top, hsla(260,14%,10%,0.8) 0%, transparent 50%, ${sector.color.replace("1)", "0.05)")} 100%)`,
              }} />
              {/* Scan line */}
              <motion.div className="absolute inset-x-0 h-[2px] pointer-events-none"
                style={{ background: `linear-gradient(90deg, transparent, ${sector.color.replace("1)", "0.3)")}, transparent)` }}
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
              {/* Corner accents */}
              <div className="absolute top-3 right-3 w-8 h-8 border-t border-r rounded-tr-lg pointer-events-none" style={{ borderColor: sector.color.replace("1)", "0.25)") }} />
              <div className="absolute bottom-14 left-3 w-6 h-6 border-b border-l rounded-bl-lg pointer-events-none" style={{ borderColor: sector.color.replace("1)", "0.2)") }} />

              {/* Stats overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                {sector.stats.map((s, i) => (
                  <motion.div key={i} className="flex-1 px-2 py-2 rounded-lg text-center"
                    style={{ background: "hsla(0,0%,0%,0.6)", backdropFilter: "blur(8px)", border: `1px solid ${sector.color.replace("1)", "0.12)")}` }}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                    <p className="text-[0.5rem] tracking-wider uppercase" style={{ color: sector.color.replace("1)", "0.7)") }}>{s.label}</p>
                    <p className="text-[0.7rem] font-heading font-bold text-foreground">{s.val}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Floating orbit */}
            <motion.div className="absolute -top-4 -right-4 w-20 h-20 rounded-full pointer-events-none hidden lg:block"
              style={{ border: `1px dashed ${sector.color.replace("1)", "0.12)")}` }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom persuasion */}
      <motion.div className="text-center mt-12 pt-8 border-t border-border/10"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <p className="text-foreground/25 text-xs font-heading tracking-wider uppercase">
          <span style={{ color: "hsl(38,45%,52%)" }}>7 settori</span> · 95+ Agenti IA · 1 piattaforma · <span className="text-foreground/40">il tuo brand</span>
        </p>
      </motion.div>
    </>
  );
}
