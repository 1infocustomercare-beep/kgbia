import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { INDUSTRY_CONFIGS, type IndustryId } from "@/config/industry-config";
import { DEMO_INDUSTRY_DATA, DEMO_SLUGS } from "@/data/demo-industries";

/* ═══════════════════════════════════════════
   PER-SECTOR SCREEN STYLES
   Each sector gets unique gradients, layouts, KPIs and visual identity
   ═══════════════════════════════════════════ */

interface SectorStyleBase {
  heroGradient: string;
  cardBg: string;
  chartColors: string[];
  kpis: { label: string; val: string }[];
  bookingFields: string[];
  heroSubtext: string;
  serviceIcon: string;
}

interface SectorStyleExtended extends SectorStyleBase {
  analyticsTitle: string;
  analyticsBars: number[];
  crmClients: { name: string; tag: string; spent: string }[];
  notifications: { icon: string; text: string; time: string }[];
  settingsToggles: { label: string; on: boolean }[];
}

// Alias for internal use — always the full type
type SectorStyle = SectorStyleExtended;

const SECTOR_STYLES: Partial<Record<IndustryId, Partial<SectorStyle>>> = {
  food: {
    heroGradient: "linear-gradient(135deg, #e85d0422, #ff6b3510)",
    cardBg: "#e85d0412",
    chartColors: ["#e85d04", "#ff6b35", "#ffa94d"],
    kpis: [{ label: "Coperti", val: "86" }, { label: "Ordini", val: "142" }, { label: "Rating", val: "4.9★" }, { label: "Incasso", val: "€3.2K" }],
    bookingFields: ["Nome", "Telefono", "Data", "Ospiti"],
    heroSubtext: "Cucina d'autore",
    serviceIcon: "🍝",
    analyticsTitle: "Vendite Piatti",
    analyticsBars: [45, 72, 38, 90, 55, 82, 60, 95, 48, 70, 65, 88],
    crmClients: [
      { name: "Marco R.", tag: "VIP", spent: "€1.8K" },
      { name: "Sofia L.", tag: "Habitué", spent: "€920" },
      { name: "Luca P.", tag: "Nuovo", spent: "€85" },
      { name: "Elena V.", tag: "Premium", spent: "€2.4K" },
    ],
    notifications: [
      { icon: "🍕", text: "Ordine tavolo 5 pronto", time: "1m" },
      { icon: "⭐", text: "Recensione 5★ su Google", time: "12m" },
      { icon: "📦", text: "Scorte pomodori basse", time: "45m" },
      { icon: "💰", text: "Incasso giornaliero €1.2K", time: "2h" },
    ],
    settingsToggles: [
      { label: "Menu QR attivo", on: true },
      { label: "Ordini online", on: true },
      { label: "Notifiche cucina", on: true },
      { label: "Upselling AI", on: false },
      { label: "Fidelity card", on: true },
    ],
  },
  ncc: {
    heroGradient: "linear-gradient(135deg, #C9A84C22, #8B6F2E10)",
    cardBg: "#C9A84C12",
    chartColors: ["#C9A84C", "#8B6F2E", "#E6D5A8"],
    kpis: [{ label: "Transfer", val: "28" }, { label: "Flotta", val: "12" }, { label: "Rating", val: "5.0★" }, { label: "Revenue", val: "€8.4K" }],
    bookingFields: ["Partenza", "Arrivo", "Data", "Pax"],
    heroSubtext: "Luxury Transfer",
    serviceIcon: "🚘",
    analyticsTitle: "Revenue Tratte",
    analyticsBars: [60, 85, 45, 92, 70, 88, 55, 95, 78, 82, 68, 90],
    crmClients: [
      { name: "Hotel Excelsior", tag: "Corporate", spent: "€12K" },
      { name: "James W.", tag: "VIP", spent: "€4.2K" },
      { name: "Concierge Roma", tag: "Partner", spent: "€8.5K" },
      { name: "Villa Rufolo", tag: "Premium", spent: "€6.8K" },
    ],
    notifications: [
      { icon: "🚗", text: "Transfer NAP→Amalfi confermato", time: "3m" },
      { icon: "✈️", text: "Volo cliente atterrato", time: "20m" },
      { icon: "📋", text: "Revisione Mercedes scade", time: "2g" },
      { icon: "⭐", text: "Review 5★ TripAdvisor", time: "1h" },
    ],
    settingsToggles: [
      { label: "Booking online", on: true },
      { label: "GPS tracking", on: true },
      { label: "Pricing dinamico", on: true },
      { label: "Alert scadenze", on: true },
      { label: "Cross-selling", on: false },
    ],
  },
  beauty: {
    heroGradient: "linear-gradient(135deg, #e91e8c22, #ff69b410)",
    cardBg: "#e91e8c12",
    chartColors: ["#e91e8c", "#ff69b4", "#ffb6c1"],
    kpis: [{ label: "Appuntamenti", val: "47" }, { label: "Clienti", val: "234" }, { label: "Rating", val: "4.8★" }, { label: "Incasso", val: "€4.1K" }],
    bookingFields: ["Nome", "Servizio", "Data", "Ora"],
    heroSubtext: "Beauty & Wellness",
    serviceIcon: "💅",
    analyticsTitle: "Performance Servizi",
    analyticsBars: [35, 68, 52, 85, 40, 78, 62, 90, 45, 72, 58, 82],
    crmClients: [
      { name: "Giulia M.", tag: "Fedele", spent: "€1.4K" },
      { name: "Valentina R.", tag: "VIP", spent: "€3.2K" },
      { name: "Chiara S.", tag: "Nuova", spent: "€120" },
      { name: "Francesca D.", tag: "Premium", spent: "€2.8K" },
    ],
    notifications: [
      { icon: "💇", text: "Appuntamento tra 30min", time: "ora" },
      { icon: "⭐", text: "Recensione 5★ ricevuta", time: "25m" },
      { icon: "🎁", text: "Compleanno cliente domani", time: "1h" },
      { icon: "📊", text: "Report settimanale pronto", time: "3h" },
    ],
    settingsToggles: [
      { label: "Prenotazioni online", on: true },
      { label: "Reminder WhatsApp", on: true },
      { label: "Loyalty points", on: true },
      { label: "Marketing SMS", on: false },
      { label: "Galleria lavori", on: true },
    ],
  },
  healthcare: {
    heroGradient: "linear-gradient(135deg, #0d9e7122, #14b8a610)",
    cardBg: "#0d9e7112",
    chartColors: ["#0d9e71", "#14b8a6", "#5eead4"],
    kpis: [{ label: "Visite", val: "38" }, { label: "Pazienti", val: "412" }, { label: "Rating", val: "4.9★" }, { label: "Fatturato", val: "€12K" }],
    bookingFields: ["Paziente", "Telefono", "Data", "Visita"],
    heroSubtext: "Centro Medico",
    serviceIcon: "🏥",
  },
  retail: {
    heroGradient: "linear-gradient(135deg, #1a1a1a22, #33333310)",
    cardBg: "#ffffff08",
    chartColors: ["#ffffff", "#999999", "#666666"],
    kpis: [{ label: "Vendite", val: "89" }, { label: "Prodotti", val: "340" }, { label: "Rating", val: "4.7★" }, { label: "Revenue", val: "€5.8K" }],
    bookingFields: ["Nome", "Email", "Prodotto", "Qta"],
    heroSubtext: "Fashion & Style",
    serviceIcon: "🛍️",
  },
  fitness: {
    heroGradient: "linear-gradient(135deg, #f9731622, #ff990010)",
    cardBg: "#f9731612",
    chartColors: ["#f97316", "#ff9900", "#fbbf24"],
    kpis: [{ label: "Iscritti", val: "156" }, { label: "Corsi", val: "24" }, { label: "Rating", val: "4.8★" }, { label: "MRR", val: "€6.2K" }],
    bookingFields: ["Nome", "Corso", "Data", "Orario"],
    heroSubtext: "Fitness Club",
    serviceIcon: "💪",
  },
  hospitality: {
    heroGradient: "linear-gradient(135deg, #92400e22, #b4540010)",
    cardBg: "#92400e12",
    chartColors: ["#b45309", "#d97706", "#fbbf24"],
    kpis: [{ label: "Camere", val: "42" }, { label: "Occupaz.", val: "87%" }, { label: "Rating", val: "4.9★" }, { label: "ADR", val: "€189" }],
    bookingFields: ["Ospite", "Check-in", "Check-out", "Camere"],
    heroSubtext: "Luxury Hotel",
    serviceIcon: "🏨",
  },
  beach: {
    heroGradient: "linear-gradient(135deg, #0891b222, #06b6d410)",
    cardBg: "#0891b212",
    chartColors: ["#0891b2", "#06b6d4", "#67e8f9"],
    kpis: [{ label: "Ombrelloni", val: "120" }, { label: "Prenot.", val: "95" }, { label: "Rating", val: "4.7★" }, { label: "Incasso", val: "€2.8K" }],
    bookingFields: ["Nome", "Data", "Fila", "Ombrellone"],
    heroSubtext: "Lido & Beach",
    serviceIcon: "🏖️",
  },
  plumber: {
    heroGradient: "linear-gradient(135deg, #2563eb22, #3b82f610)",
    cardBg: "#2563eb12",
    chartColors: ["#2563eb", "#3b82f6", "#93c5fd"],
    kpis: [{ label: "Interventi", val: "23" }, { label: "Clienti", val: "87" }, { label: "Rating", val: "4.8★" }, { label: "Fatturato", val: "€3.5K" }],
    bookingFields: ["Cliente", "Indirizzo", "Tipo", "Urgenza"],
    heroSubtext: "Pronto Intervento",
    serviceIcon: "🔧",
  },
  electrician: {
    heroGradient: "linear-gradient(135deg, #eab30822, #f59e0b10)",
    cardBg: "#eab30812",
    chartColors: ["#eab308", "#f59e0b", "#fcd34d"],
    kpis: [{ label: "Lavori", val: "31" }, { label: "Clienti", val: "124" }, { label: "Rating", val: "4.9★" }, { label: "Fatturato", val: "€4.8K" }],
    bookingFields: ["Cliente", "Indirizzo", "Tipo", "Data"],
    heroSubtext: "Impianti Elettrici",
    serviceIcon: "⚡",
  },
  construction: {
    heroGradient: "linear-gradient(135deg, #78350f22, #92400e10)",
    cardBg: "#78350f12",
    chartColors: ["#78350f", "#92400e", "#d97706"],
    kpis: [{ label: "Cantieri", val: "8" }, { label: "Operai", val: "34" }, { label: "Avanz.", val: "72%" }, { label: "Budget", val: "€45K" }],
    bookingFields: ["Committente", "Cantiere", "Data", "Note"],
    heroSubtext: "Edilizia & Costruzioni",
    serviceIcon: "🏗️",
  },
  veterinary: {
    heroGradient: "linear-gradient(135deg, #059a6e22, #10b98110)",
    cardBg: "#059a6e12",
    chartColors: ["#059a6e", "#10b981", "#6ee7b7"],
    kpis: [{ label: "Visite", val: "45" }, { label: "Pazienti", val: "312" }, { label: "Rating", val: "5.0★" }, { label: "Fatturato", val: "€5.1K" }],
    bookingFields: ["Proprietario", "Animale", "Data", "Tipo"],
    heroSubtext: "Clinica Veterinaria",
    serviceIcon: "🐾",
  },
  tattoo: {
    heroGradient: "linear-gradient(135deg, #7c3aed22, #8b5cf610)",
    cardBg: "#7c3aed12",
    chartColors: ["#7c3aed", "#8b5cf6", "#c4b5fd"],
    kpis: [{ label: "Sessioni", val: "18" }, { label: "Artisti", val: "4" }, { label: "Rating", val: "4.9★" }, { label: "Incasso", val: "€3.9K" }],
    bookingFields: ["Nome", "Stile", "Zona", "Data"],
    heroSubtext: "Tattoo Studio",
    serviceIcon: "🎨",
  },
  events: {
    heroGradient: "linear-gradient(135deg, #dc264f22, #ef444410)",
    cardBg: "#dc264f12",
    chartColors: ["#dc2626", "#ef4444", "#fca5a5"],
    kpis: [{ label: "Eventi", val: "12" }, { label: "Ospiti", val: "480" }, { label: "Rating", val: "4.8★" }, { label: "Revenue", val: "€18K" }],
    bookingFields: ["Evento", "Data", "Location", "Budget"],
    heroSubtext: "Event Planning",
    serviceIcon: "🎉",
  },
  logistics: {
    heroGradient: "linear-gradient(135deg, #0369a122, #0284c710)",
    cardBg: "#0369a112",
    chartColors: ["#0369a1", "#0284c7", "#38bdf8"],
    kpis: [{ label: "Spedizioni", val: "67" }, { label: "Mezzi", val: "15" }, { label: "On-Time", val: "96%" }, { label: "Revenue", val: "€22K" }],
    bookingFields: ["Mittente", "Dest.", "Data", "Tipo"],
    heroSubtext: "Logistica & Trasporti",
    serviceIcon: "📦",
  },
  agriturismo: {
    heroGradient: "linear-gradient(135deg, #4d7c0f22, #65a30d10)",
    cardBg: "#4d7c0f12",
    chartColors: ["#4d7c0f", "#65a30d", "#a3e635"],
    kpis: [{ label: "Camere", val: "18" }, { label: "Ospiti", val: "42" }, { label: "Rating", val: "4.9★" }, { label: "Incasso", val: "€3.6K" }],
    bookingFields: ["Ospite", "Check-in", "Check-out", "Persone"],
    heroSubtext: "Agriturismo Bio",
    serviceIcon: "🌿",
  },
  cleaning: {
    heroGradient: "linear-gradient(135deg, #0891b222, #22d3ee10)",
    cardBg: "#0891b212",
    chartColors: ["#0891b2", "#22d3ee", "#67e8f9"],
    kpis: [{ label: "Servizi", val: "34" }, { label: "Clienti", val: "78" }, { label: "Rating", val: "4.7★" }, { label: "Fatturato", val: "€4.2K" }],
    bookingFields: ["Cliente", "Indirizzo", "Tipo", "Data"],
    heroSubtext: "Pulizie Professionali",
    serviceIcon: "🧹",
  },
  legal: {
    heroGradient: "linear-gradient(135deg, #1e3a5f22, #1e40af10)",
    cardBg: "#1e3a5f12",
    chartColors: ["#1e3a5f", "#1e40af", "#60a5fa"],
    kpis: [{ label: "Pratiche", val: "52" }, { label: "Clienti", val: "134" }, { label: "Rating", val: "5.0★" }, { label: "Fatturato", val: "€18K" }],
    bookingFields: ["Cliente", "Pratica", "Data", "Tipo"],
    heroSubtext: "Studio Legale",
    serviceIcon: "⚖️",
  },
  accounting: {
    heroGradient: "linear-gradient(135deg, #2563eb22, #3b82f610)",
    cardBg: "#2563eb12",
    chartColors: ["#2563eb", "#3b82f6", "#93c5fd"],
    kpis: [{ label: "Clienti", val: "89" }, { label: "Dichiar.", val: "156" }, { label: "Rating", val: "4.8★" }, { label: "Fatturato", val: "€12K" }],
    bookingFields: ["Cliente", "P.IVA", "Tipo", "Scadenza"],
    heroSubtext: "Studio Commercialista",
    serviceIcon: "📊",
  },
  garage: {
    heroGradient: "linear-gradient(135deg, #78350f22, #a16207 10)",
    cardBg: "#78350f12",
    chartColors: ["#78350f", "#a16207", "#fbbf24"],
    kpis: [{ label: "Riparazioni", val: "27" }, { label: "Veicoli", val: "45" }, { label: "Rating", val: "4.8★" }, { label: "Fatturato", val: "€6.3K" }],
    bookingFields: ["Cliente", "Veicolo", "Targa", "Lavoro"],
    heroSubtext: "Autofficina",
    serviceIcon: "🔩",
  },
  photography: {
    heroGradient: "linear-gradient(135deg, #9333ea22, #a855f710)",
    cardBg: "#9333ea12",
    chartColors: ["#9333ea", "#a855f7", "#d8b4fe"],
    kpis: [{ label: "Shooting", val: "14" }, { label: "Clienti", val: "67" }, { label: "Rating", val: "5.0★" }, { label: "Revenue", val: "€5.8K" }],
    bookingFields: ["Cliente", "Tipo", "Data", "Location"],
    heroSubtext: "Studio Fotografico",
    serviceIcon: "📸",
  },
  gardening: {
    heroGradient: "linear-gradient(135deg, #16a34a22, #22c55e10)",
    cardBg: "#16a34a12",
    chartColors: ["#16a34a", "#22c55e", "#86efac"],
    kpis: [{ label: "Giardini", val: "23" }, { label: "Clienti", val: "56" }, { label: "Rating", val: "4.9★" }, { label: "Fatturato", val: "€3.8K" }],
    bookingFields: ["Cliente", "Indirizzo", "Tipo", "Data"],
    heroSubtext: "Giardinaggio",
    serviceIcon: "🌱",
  },
  childcare: {
    heroGradient: "linear-gradient(135deg, #f472b622, #fb923c10)",
    cardBg: "#f472b612",
    chartColors: ["#f472b6", "#fb923c", "#fcd34d"],
    kpis: [{ label: "Bambini", val: "32" }, { label: "Iscritti", val: "28" }, { label: "Rating", val: "5.0★" }, { label: "MRR", val: "€4.5K" }],
    bookingFields: ["Genitore", "Bambino", "Età", "Orario"],
    heroSubtext: "Asilo & Infanzia",
    serviceIcon: "👶",
  },
  education: {
    heroGradient: "linear-gradient(135deg, #0d9488 22, #14b8a610)",
    cardBg: "#0d948812",
    chartColors: ["#0d9488", "#14b8a6", "#5eead4"],
    kpis: [{ label: "Studenti", val: "124" }, { label: "Corsi", val: "18" }, { label: "Rating", val: "4.9★" }, { label: "Revenue", val: "€8.2K" }],
    bookingFields: ["Studente", "Corso", "Livello", "Orario"],
    heroSubtext: "Formazione",
    serviceIcon: "🎓",
  },
  custom: {
    heroGradient: "linear-gradient(135deg, #6366f122, #818cf810)",
    cardBg: "#6366f112",
    chartColors: ["#6366f1", "#818cf8", "#c7d2fe"],
    kpis: [{ label: "Clienti", val: "45" }, { label: "Ordini", val: "89" }, { label: "Rating", val: "4.8★" }, { label: "Revenue", val: "€3.1K" }],
    bookingFields: ["Nome", "Email", "Servizio", "Data"],
    heroSubtext: "Business Custom",
    serviceIcon: "✨",
  },
};

function getSectorStyle(id: IndustryId): SectorStyle {
  const cfg = INDUSTRY_CONFIGS[id];
  const base = SECTOR_STYLES[id] || {};
  const defaults: SectorStyle = {
    heroGradient: `linear-gradient(135deg, ${cfg.defaultPrimaryColor}22, ${cfg.defaultPrimaryColor}10)`,
    cardBg: `${cfg.defaultPrimaryColor}12`,
    chartColors: [cfg.defaultPrimaryColor, cfg.defaultPrimaryColor, cfg.defaultPrimaryColor],
    kpis: [{ label: "Clienti", val: "128" }, { label: "Ordini", val: "34" }, { label: "Rating", val: "4.8★" }, { label: "Incasso", val: "€2.4K" }],
    bookingFields: ["Nome", "Telefono", "Data", "Ora"],
    heroSubtext: cfg.label,
    serviceIcon: cfg.emoji,
    analyticsTitle: "Analytics",
    analyticsBars: [30, 55, 42, 78, 62, 90, 48, 72, 85, 40, 65, 58],
    crmClients: [
      { name: "Marco R.", tag: "VIP", spent: "€1.2K" },
      { name: "Laura B.", tag: "Nuovo", spent: "€340" },
      { name: "Giuseppe F.", tag: "Fedele", spent: "€890" },
      { name: "Anna M.", tag: "Premium", spent: "€2.1K" },
    ],
    notifications: [
      { icon: "🔔", text: "Nuovo ordine ricevuto", time: "2m" },
      { icon: "⭐", text: "Recensione 5 stelle", time: "15m" },
      { icon: "💳", text: "Pagamento confermato", time: "32m" },
      { icon: "📅", text: "Prenotazione domani", time: "1h" },
    ],
    settingsToggles: [
      { label: "Prenotazioni online", on: true },
      { label: "Notifiche push", on: true },
      { label: "Pagamenti online", on: true },
      { label: "Chat clienti", on: false },
      { label: "Marketing AI", on: true },
    ],
  };
  return { ...defaults, ...base };
}

/* ═══════════════════════════════════════════
   iPHONE FRAME COMPONENT — Premium with unique screens per sector
   ═══════════════════════════════════════════ */

function IPhoneFrame({
  screen, color, emoji, companyName, services, index, sectorStyle,
}: {
  screen: { label: string; type: string; desc?: string };
  color: string;
  emoji: string;
  companyName: string;
  services: { name: string; emoji?: string; price: number }[];
  index: number;
  sectorStyle: SectorStyle;
}) {
  const isCenter = index === 1 || index === 2;

  return (
    <motion.div
      className="flex-shrink-0 w-[130px] sm:w-[155px]"
      initial={{ opacity: 0, y: 40 + (isCenter ? 0 : 15), scale: 0.9 }}
      whileInView={{ opacity: 1, y: isCenter ? -8 : 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Ambient glow behind phone */}
      <div className="relative">
        <div className="absolute -inset-3 rounded-[32px] blur-2xl opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${color}40, transparent 70%)` }} />

        {/* iPhone shell */}
        <div className="relative rounded-[22px] sm:rounded-[26px] overflow-hidden"
          style={{
            border: "2.5px solid rgba(255,255,255,0.12)",
            background: "linear-gradient(180deg, #1c1c1e 0%, #0a0a0a 100%)",
            boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}>

          {/* Dynamic Island */}
          <div className="flex justify-center pt-2 pb-0.5">
            <div className="w-[48px] h-[13px] bg-black rounded-full" style={{ boxShadow: "inset 0 0 3px rgba(255,255,255,0.08)" }} />
          </div>

          {/* Screen */}
          <div className="aspect-[9/17] overflow-hidden relative" style={{ minHeight: 210 }}>

            {/* ═══ HERO SCREEN ═══ */}
            {screen.type === "hero" && (
              <div className="h-full flex flex-col" style={{ background: sectorStyle.heroGradient }}>
                <div className="flex-1 flex flex-col items-center justify-center p-3 text-center relative">
                  {/* Decorative ring */}
                  <motion.div className="absolute w-20 h-20 rounded-full border border-dashed opacity-10"
                    style={{ borderColor: color }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
                  <motion.span className="text-3xl mb-2 drop-shadow-lg"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >{emoji}</motion.span>
                  <p className="text-[10px] font-bold text-white/90 leading-tight tracking-wide">{companyName}</p>
                  <p className="text-[7px] text-white/35 mt-0.5 tracking-widest uppercase">{sectorStyle.heroSubtext}</p>
                  <motion.div className="mt-3 px-4 py-1.5 rounded-full text-[7px] font-bold text-white tracking-wider uppercase relative overflow-hidden"
                    style={{ backgroundColor: color, boxShadow: `0 4px 15px ${color}50` }}>
                    <motion.div className="absolute inset-0"
                      style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)" }}
                      animate={{ x: ["-200%", "200%"] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }} />
                    <span className="relative">Scopri di più</span>
                  </motion.div>
                </div>
                {/* Stats bar */}
                <div className="flex gap-0.5 p-1.5">
                  {sectorStyle.kpis.slice(0, 3).map((k, i) => (
                    <div key={i} className="flex-1 text-center p-1 rounded-md" style={{ backgroundColor: `${color}10` }}>
                      <p className="text-[6px] text-white/25">{k.label}</p>
                      <p className="text-[7px] font-bold" style={{ color }}>{k.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ SERVICES SCREEN ═══ */}
            {screen.type === "services" && (
              <div className="h-full p-2.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <p className="text-[8px] font-bold text-white/80 tracking-wide">{INDUSTRY_CONFIGS[services[0]?.emoji ? "food" : "custom"]?.terminology?.items || "Servizi"}</p>
                </div>
                <div className="space-y-1">
                  {services.slice(0, 4).map((s, i) => (
                    <motion.div key={i} className="flex items-center gap-1.5 p-1.5 rounded-lg relative overflow-hidden"
                      style={{ backgroundColor: sectorStyle.cardBg, border: `0.5px solid ${color}18` }}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.08 }}>
                      <span className="text-[10px]">{s.emoji || sectorStyle.serviceIcon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[7px] font-semibold text-white/80 truncate">{s.name}</p>
                      </div>
                      <span className="text-[7px] font-bold" style={{ color }}>€{s.price}</span>
                    </motion.div>
                  ))}
                </div>
                {/* Category tabs */}
                <div className="flex gap-1 mt-2">
                  {["Tutti", "Popolari", "Nuovi"].map((t, i) => (
                    <div key={i} className="px-2 py-0.5 rounded-full text-[5px] font-bold"
                      style={i === 0 ? { backgroundColor: color, color: "#fff" } : { backgroundColor: `${color}10`, color: `${color}90` }}>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ BOOKING SCREEN ═══ */}
            {screen.type === "booking" && (
              <div className="h-full p-2.5 flex flex-col">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <p className="text-[8px] font-bold text-white/80">Prenotazione</p>
                </div>
                <div className="space-y-1.5 flex-1">
                  {sectorStyle.bookingFields.map((f, i) => (
                    <div key={i} className="h-[18px] rounded-lg border px-2 flex items-center"
                      style={{ backgroundColor: `${color}06`, borderColor: `${color}15` }}>
                      <span className="text-[6px] text-white/25 tracking-wide">{f}</span>
                    </div>
                  ))}
                  {/* Date picker mock */}
                  <div className="grid grid-cols-7 gap-[1px] mt-1">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div key={i} className="aspect-square rounded-sm flex items-center justify-center text-[4px]"
                        style={{
                          backgroundColor: i === 8 ? color : `${color}06`,
                          color: i === 8 ? "#fff" : `${color}60`,
                          fontWeight: i === 8 ? 700 : 400,
                        }}>
                        {i + 15}
                      </div>
                    ))}
                  </div>
                  <motion.div className="h-[18px] rounded-lg flex items-center justify-center text-[7px] font-bold text-white mt-1 relative overflow-hidden"
                    style={{ backgroundColor: color, boxShadow: `0 3px 12px ${color}40` }}>
                    <motion.div className="absolute inset-0"
                      style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)" }}
                      animate={{ x: ["-200%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }} />
                    <span className="relative">Conferma ✓</span>
                  </motion.div>
                </div>
              </div>
            )}

            {/* ═══ DASHBOARD SCREEN ═══ */}
            {screen.type === "dashboard" && (
              <div className="h-full p-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <p className="text-[7px] font-bold text-white/70">Dashboard</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: `${color}40` }} />
                    ))}
                  </div>
                </div>
                {/* KPI Grid */}
                <div className="grid grid-cols-2 gap-1">
                  {sectorStyle.kpis.map((kpi, i) => (
                    <motion.div key={i} className="p-1.5 rounded-lg relative overflow-hidden"
                      style={{ backgroundColor: `${color}08`, border: `0.5px solid ${color}10` }}
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.08 }}>
                      <p className="text-[5px] text-white/30 tracking-wider uppercase">{kpi.label}</p>
                      <p className="text-[9px] font-bold" style={{ color }}>{kpi.val}</p>
                    </motion.div>
                  ))}
                </div>
                {/* Chart */}
                <div className="mt-1.5 h-10 rounded-lg flex items-end gap-[2px] p-1.5"
                  style={{ backgroundColor: `${color}06`, border: `0.5px solid ${color}08` }}>
                  {[35, 55, 42, 78, 62, 90, 45, 82, 68].map((h, i) => (
                    <motion.div key={i} className="flex-1 rounded-t-sm"
                      style={{ backgroundColor: sectorStyle.chartColors[i % sectorStyle.chartColors.length] + (i === 5 ? "CC" : "55") }}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.04, duration: 0.4 }}
                    />
                  ))}
                </div>
                {/* Activity feed */}
                <div className="mt-1.5 space-y-0.5">
                  {["Nuovo ordine", "Pagamento", "Review 5★"].map((t, i) => (
                    <div key={i} className="flex items-center gap-1 px-1 py-0.5 rounded text-[5px]"
                      style={{ backgroundColor: `${color}06` }}>
                      <div className="w-1 h-1 rounded-full" style={{ backgroundColor: sectorStyle.chartColors[i % sectorStyle.chartColors.length] }} />
                      <span className="text-white/40">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ ANALYTICS SCREEN ═══ */}
            {screen.type === "analytics" && (
              <div className="h-full p-2.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <p className="text-[8px] font-bold text-white/80 tracking-wide">{sectorStyle.analyticsTitle}</p>
                </div>
                {/* Revenue line chart */}
                <div className="h-12 rounded-lg p-1.5 mb-1.5 relative overflow-hidden" style={{ backgroundColor: `${color}06`, border: `0.5px solid ${color}10` }}>
                  <svg viewBox="0 0 120 40" className="w-full h-full">
                    <defs>
                      <linearGradient id={`ag-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={`M0,35 ${sectorStyle.analyticsBars.map((v, i) => `L${i * 11},${40 - v * 0.4}`).join(" ")} L120,35 Z`} fill={`url(#ag-${index})`} />
                    <path d={`M0,35 ${sectorStyle.analyticsBars.map((v, i) => `L${i * 11},${40 - v * 0.4}`).join(" ")}`} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                {/* Metric pills */}
                <div className="grid grid-cols-2 gap-1 mb-1.5">
                  {[
                    { label: "Conversione", val: "12.4%", delta: "+2.1%" },
                    { label: "Clienti attivi", val: "234", delta: "+18" },
                    { label: "Ticket medio", val: "€47", delta: "+€5" },
                    { label: "Retention", val: "89%", delta: "+3%" },
                  ].map((m, i) => (
                    <div key={i} className="p-1 rounded-md" style={{ backgroundColor: `${color}08`, border: `0.5px solid ${color}10` }}>
                      <p className="text-[4px] text-white/25 uppercase tracking-wider">{m.label}</p>
                      <div className="flex items-baseline gap-1">
                        <p className="text-[8px] font-bold" style={{ color }}>{m.val}</p>
                        <p className="text-[5px] text-emerald-400">{m.delta}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Mini bar chart */}
                <div className="h-6 rounded-md flex items-end gap-[1.5px] p-1" style={{ backgroundColor: `${color}04` }}>
                  {sectorStyle.analyticsBars.map((h, i) => (
                    <motion.div key={i} className="flex-1 rounded-t-sm"
                      style={{ backgroundColor: `${sectorStyle.chartColors[i % sectorStyle.chartColors.length]}88` }}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.03, duration: 0.3 }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ═══ CRM / CLIENTS SCREEN ═══ */}
            {screen.type === "crm" && (
              <div className="h-full p-2.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <p className="text-[8px] font-bold text-white/80">CRM Clienti</p>
                  </div>
                  <div className="px-1.5 py-0.5 rounded-full text-[5px] font-bold" style={{ backgroundColor: `${color}20`, color }}>
                    {sectorStyle.crmClients.length} attivi
                  </div>
                </div>
                {/* Search bar */}
                <div className="h-[16px] rounded-lg border px-2 flex items-center mb-1.5"
                  style={{ backgroundColor: `${color}04`, borderColor: `${color}12` }}>
                  <span className="text-[5px] text-white/20">🔍 Cerca cliente...</span>
                </div>
                {/* Client list */}
                <div className="space-y-1">
                  {sectorStyle.crmClients.map((c, i) => (
                    <motion.div key={i} className="flex items-center gap-1.5 p-1.5 rounded-lg"
                      style={{ backgroundColor: sectorStyle.cardBg, border: `0.5px solid ${color}12` }}
                      initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.08 }}>
                      {/* Avatar */}
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[6px] font-bold text-white"
                        style={{ background: `linear-gradient(135deg, ${sectorStyle.chartColors[i % sectorStyle.chartColors.length]}, ${color})` }}>
                        {c.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[6px] font-semibold text-white/80 truncate">{c.name}</p>
                        <div className="flex gap-1 items-center">
                          <span className="px-1 py-[0.5px] rounded text-[4px] font-bold" style={{ backgroundColor: `${color}15`, color: `${color}CC` }}>{c.tag}</span>
                          <span className="text-[4px] text-white/25">Speso: {c.spent}</span>
                        </div>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `${color}60` }} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ NOTIFICATIONS SCREEN ═══ */}
            {screen.type === "notifications" && (
              <div className="h-full p-2.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <p className="text-[8px] font-bold text-white/80">Notifiche</p>
                  </div>
                  <motion.div className="w-4 h-4 rounded-full flex items-center justify-center text-[6px] font-bold text-white"
                    style={{ backgroundColor: color }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}>
                    {sectorStyle.notifications.length}
                  </motion.div>
                </div>
                <div className="space-y-1">
                  {sectorStyle.notifications.map((n, i) => (
                    <motion.div key={i} className="flex items-start gap-1.5 p-1.5 rounded-lg relative"
                      style={{ backgroundColor: i === 0 ? `${color}12` : `${color}06`, border: `0.5px solid ${i === 0 ? `${color}25` : `${color}08`}` }}
                      initial={{ opacity: 0, y: 5 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.1 }}>
                      <span className="text-[8px]">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[6px] font-semibold text-white/80">{n.text}</p>
                        <p className="text-[4px] text-white/25 mt-0.5">{n.time} fa</p>
                      </div>
                      {i === 0 && <div className="w-1 h-1 rounded-full mt-0.5" style={{ backgroundColor: color }} />}
                    </motion.div>
                  ))}
                </div>
                {/* Quick action */}
                <div className="mt-2 flex gap-1">
                  {["Leggi tutto", "Impostazioni"].map((a, i) => (
                    <div key={i} className="flex-1 py-1 rounded-md text-center text-[5px] font-bold"
                      style={i === 0 ? { backgroundColor: color, color: "#fff" } : { backgroundColor: `${color}10`, color: `${color}90` }}>
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ SETTINGS SCREEN ═══ */}
            {screen.type === "settings" && (
              <div className="h-full p-2.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <p className="text-[8px] font-bold text-white/80">Impostazioni</p>
                </div>
                {/* Profile mini */}
                <div className="flex items-center gap-2 p-1.5 rounded-lg mb-2" style={{ backgroundColor: `${color}08`, border: `0.5px solid ${color}12` }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                    style={{ background: `linear-gradient(135deg, ${color}, ${sectorStyle.chartColors[1] || color})` }}>
                    {sectorStyle.serviceIcon}
                  </div>
                  <div>
                    <p className="text-[7px] font-bold text-white/80">Il Mio Business</p>
                    <p className="text-[5px] text-white/30">Piano Premium · Attivo</p>
                  </div>
                </div>
                {/* Toggle list */}
                <div className="space-y-1">
                  {sectorStyle.settingsToggles.map((t, i) => (
                    <div key={i} className="flex items-center justify-between p-1.5 rounded-md"
                      style={{ backgroundColor: `${color}04`, border: `0.5px solid ${color}08` }}>
                      <span className="text-[6px] text-white/60">{t.label}</span>
                      <div className="w-5 h-3 rounded-full relative"
                        style={{ backgroundColor: t.on ? color : "rgba(255,255,255,0.1)" }}>
                        <motion.div className="absolute top-[1.5px] w-[9px] h-[9px] rounded-full bg-white shadow-sm"
                          style={{ left: t.on ? 9 : 1.5 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 30%, ${color}08 0%, transparent 60%)` }} />
          </div>

          {/* Home indicator */}
          <div className="flex justify-center py-1.5">
            <div className="w-9 h-[3px] rounded-full bg-white/15" />
          </div>
        </div>
      </div>

      {/* Label + description */}
      <div className="text-center mt-2.5">
        <p className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase" style={{ color: `${color}cc` }}>{screen.label}</p>
        {screen.desc && <p className="text-[7px] text-white/25 mt-0.5">{screen.desc}</p>}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MAIN SHOWCASE COMPONENT
   ═══════════════════════════════════════════ */

interface IndustryPhoneShowcaseProps {
  industryId: IndustryId;
  className?: string;
  compact?: boolean;
}

const SCREENS = [
  { label: "Home", type: "hero", desc: "Vetrina principale" },
  { label: "Catalogo", type: "services", desc: "Lista servizi/prodotti" },
  { label: "Prenota", type: "booking", desc: "Form prenotazione" },
  { label: "Dashboard", type: "dashboard", desc: "Pannello gestione" },
  { label: "Analytics", type: "analytics", desc: "Grafici & trend" },
  { label: "Clienti", type: "crm", desc: "CRM & contatti" },
  { label: "Notifiche", type: "notifications", desc: "Aggiornamenti live" },
  { label: "Settings", type: "settings", desc: "Configurazione" },
];

export default function IndustryPhoneShowcase({ industryId, className = "", compact = false }: IndustryPhoneShowcaseProps) {
  const cfg = INDUSTRY_CONFIGS[industryId];
  const demo = DEMO_INDUSTRY_DATA[industryId];
  const color = cfg.defaultPrimaryColor;
  const sectorStyle = getSectorStyle(industryId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  // Auto-scroll on mobile
  useEffect(() => {
    if (!isPlaying) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % SCREENS.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  useEffect(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const child = el.children[activeIdx] as HTMLElement;
    if (child) {
      el.scrollTo({ left: child.offsetLeft - el.offsetWidth / 2 + child.offsetWidth / 2, behavior: "smooth" });
    }
  }, [activeIdx]);

  return (
    <div className={`${className}`}>
      {/* Desktop: horizontal scroll with 8 phones */}
      <div className={`hidden sm:block relative ${compact ? "scale-[0.85] origin-center" : ""}`}>
        <div className="overflow-x-auto pb-3 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          <div className="flex items-end gap-3 min-w-max justify-center px-2" style={{ perspective: "1000px" }}>
            {SCREENS.map((screen, i) => (
              <IPhoneFrame
                key={screen.type}
                screen={screen}
                color={color}
                emoji={cfg.emoji}
                companyName={demo.companyName}
                services={demo.services}
                index={i}
                sectorStyle={sectorStyle}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: horizontal scroll carousel */}
      <div className="sm:hidden relative">
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onTouchStart={() => setIsPlaying(false)}>
          {SCREENS.map((screen, i) => (
            <div key={screen.type} className="snap-center flex-shrink-0" style={{ width: "55vw", maxWidth: 200 }}>
              <IPhoneFrame
                screen={screen}
                color={color}
                emoji={cfg.emoji}
                companyName={demo.companyName}
                services={demo.services}
                index={i}
                sectorStyle={sectorStyle}
              />
            </div>
          ))}
        </div>

        {/* Controls & dots */}
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="flex gap-1.5">
            {SCREENS.map((_, i) => (
              <button key={i} onClick={() => { setActiveIdx(i); setIsPlaying(false); }}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{ backgroundColor: i === activeIdx ? color : `${color}30`, transform: i === activeIdx ? "scale(1.3)" : "scale(1)" }} />
            ))}
          </div>
          <button onClick={() => setIsPlaying(!isPlaying)}
            className="w-6 h-6 rounded-full flex items-center justify-center border transition-all"
            style={{ borderColor: `${color}40`, background: isPlaying ? `${color}15` : "transparent" }}>
            {isPlaying ? (
              <span className="flex gap-[2px]">
                <span className="w-[2px] h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="w-[2px] h-2 rounded-full" style={{ backgroundColor: color }} />
              </span>
            ) : (
              <span className="w-0 h-0 ml-[1px] border-t-[4px] border-b-[4px] border-l-[6px] border-transparent" style={{ borderLeftColor: color }} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION & GRID EXPORTS
   ═══════════════════════════════════════════ */

export function IndustryShowcaseSection({
  industryId,
  onViewDemo,
  showDemoLink = true,
}: {
  industryId: IndustryId;
  onViewDemo?: () => void;
  showDemoLink?: boolean;
}) {
  const cfg = INDUSTRY_CONFIGS[industryId];
  const demo = DEMO_INDUSTRY_DATA[industryId];

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: `${cfg.defaultPrimaryColor}15`, border: `1px solid ${cfg.defaultPrimaryColor}20` }}>
            {cfg.emoji}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{cfg.label}</h3>
            <p className="text-[10px] text-white/35">{demo.companyName} · {cfg.description}</p>
          </div>
        </div>
        {showDemoLink && (
          <motion.button
            onClick={onViewDemo}
            className="px-4 py-2 rounded-xl text-[10px] font-bold text-white/80 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all"
            whileTap={{ scale: 0.95 }}
          >
            Apri Demo →
          </motion.button>
        )}
      </div>
      <IndustryPhoneShowcase industryId={industryId} />
    </div>
  );
}

export function AllIndustriesShowcase({ onViewDemo }: { onViewDemo?: (id: IndustryId, slug: string) => void }) {
  const allIds = Object.keys(INDUSTRY_CONFIGS) as IndustryId[];

  return (
    <div className="space-y-3">
      {allIds.map(id => {
        const slug = DEMO_SLUGS[id];
        return (
          <motion.div key={id}
            className="rounded-2xl border border-white/[0.06] p-4 sm:p-5 hover:border-white/15 transition-all"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <IndustryShowcaseSection
              industryId={id}
              onViewDemo={() => onViewDemo?.(id, slug)}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
