import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INDUSTRY_CONFIGS, type IndustryId } from "@/config/industry-config";
import { DEMO_INDUSTRY_DATA, DEMO_SLUGS } from "@/data/demo-industries";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import { MockupLightbox } from "@/components/ui/mockup-lightbox";
import {
  ChefHat, Car, Scissors, Heart, Store, Dumbbell, Building,
  Calendar, Wrench, Zap, Grape, SprayCan, Scale, Calculator,
  Hammer, Camera, TreePine, PawPrint, Brush, Baby, GraduationCap,
  PartyPopper, Truck, Settings, Umbrella, type LucideIcon,
} from "lucide-react";

const SECTOR_ICONS: Record<string, LucideIcon> = {
  food: ChefHat, ncc: Car, beauty: Scissors, healthcare: Heart,
  retail: Store, fitness: Dumbbell, hospitality: Building,
  beach: Umbrella, plumber: Wrench, electrician: Zap,
  agriturismo: Grape, cleaning: SprayCan, legal: Scale,
  accounting: Calculator, garage: Wrench, photography: Camera,
  construction: Hammer, gardening: TreePine, veterinary: PawPrint,
  tattoo: Brush, childcare: Baby, education: GraduationCap,
  events: PartyPopper, logistics: Truck, custom: Settings,
};

/* Premium app-icon style per settore — gradient + icona */
const SECTOR_APP_ICON: Record<string, { gradient: string; shadow: string }> = {
  food:         { gradient: "linear-gradient(135deg, #FF6B35, #E85D04)", shadow: "0 4px 14px rgba(232,93,4,0.35)" },
  ncc:          { gradient: "linear-gradient(135deg, #C9A84C, #8B6F2E)", shadow: "0 4px 14px rgba(201,168,76,0.35)" },
  beauty:       { gradient: "linear-gradient(135deg, #E091C9, #C44FA0)", shadow: "0 4px 14px rgba(224,145,201,0.35)" },
  healthcare:   { gradient: "linear-gradient(135deg, #4ECDC4, #2AB5AC)", shadow: "0 4px 14px rgba(78,205,196,0.35)" },
  retail:       { gradient: "linear-gradient(135deg, #667EEA, #764BA2)", shadow: "0 4px 14px rgba(102,126,234,0.35)" },
  fitness:      { gradient: "linear-gradient(135deg, #F7971E, #FFD200)", shadow: "0 4px 14px rgba(247,151,30,0.35)" },
  hospitality:  { gradient: "linear-gradient(135deg, #1A2980, #26D0CE)", shadow: "0 4px 14px rgba(26,41,128,0.35)" },
  beach:        { gradient: "linear-gradient(135deg, #00B4DB, #0083B0)", shadow: "0 4px 14px rgba(0,180,219,0.35)" },
  plumber:      { gradient: "linear-gradient(135deg, #2980B9, #3498DB)", shadow: "0 4px 14px rgba(41,128,185,0.35)" },
  electrician:  { gradient: "linear-gradient(135deg, #F39C12, #E67E22)", shadow: "0 4px 14px rgba(243,156,18,0.35)" },
  agriturismo:  { gradient: "linear-gradient(135deg, #6B8E23, #9ACD32)", shadow: "0 4px 14px rgba(107,142,35,0.35)" },
  cleaning:     { gradient: "linear-gradient(135deg, #00CED1, #20B2AA)", shadow: "0 4px 14px rgba(0,206,209,0.35)" },
  legal:        { gradient: "linear-gradient(135deg, #34495E, #5D6D7E)", shadow: "0 4px 14px rgba(52,73,94,0.35)" },
  accounting:   { gradient: "linear-gradient(135deg, #2C3E50, #4CA1AF)", shadow: "0 4px 14px rgba(44,62,80,0.35)" },
  garage:       { gradient: "linear-gradient(135deg, #D35400, #E74C3C)", shadow: "0 4px 14px rgba(211,84,0,0.35)" },
  photography:  { gradient: "linear-gradient(135deg, #302B63, #24243E)", shadow: "0 4px 14px rgba(48,43,99,0.35)" },
  construction: { gradient: "linear-gradient(135deg, #F2994A, #F2C94C)", shadow: "0 4px 14px rgba(242,153,74,0.35)" },
  gardening:    { gradient: "linear-gradient(135deg, #11998E, #38EF7D)", shadow: "0 4px 14px rgba(17,153,142,0.35)" },
  veterinary:   { gradient: "linear-gradient(135deg, #7B68EE, #9B59B6)", shadow: "0 4px 14px rgba(123,104,238,0.35)" },
  tattoo:       { gradient: "linear-gradient(135deg, #1C1C1C, #434343)", shadow: "0 4px 14px rgba(28,28,28,0.35)" },
  childcare:    { gradient: "linear-gradient(135deg, #FF9A9E, #FECFEF)", shadow: "0 4px 14px rgba(255,154,158,0.35)" },
  education:    { gradient: "linear-gradient(135deg, #667DB6, #0082C8)", shadow: "0 4px 14px rgba(102,125,182,0.35)" },
  events:       { gradient: "linear-gradient(135deg, #ED4264, #FFEDBC)", shadow: "0 4px 14px rgba(237,66,100,0.35)" },
  logistics:    { gradient: "linear-gradient(135deg, #0F2027, #2C5364)", shadow: "0 4px 14px rgba(15,32,39,0.35)" },
  custom:       { gradient: "linear-gradient(135deg, #8E2DE2, #4A00E0)", shadow: "0 4px 14px rgba(142,45,226,0.35)" },
};

function SectorAppIcon({ id, size = 40 }: { id: string; size?: number }) {
  const Icon = SECTOR_ICONS[id];
  const style = SECTOR_APP_ICON[id] || { gradient: "linear-gradient(135deg, #666, #999)", shadow: "none" };
  const iconSize = Math.round(size * 0.48);
  const radius = Math.round(size * 0.26);

  return (
    <div
      className="flex items-center justify-center flex-shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: style.gradient,
        boxShadow: style.shadow,
      }}
    >
      {Icon ? (
        <Icon style={{ width: iconSize, height: iconSize }} className="text-white drop-shadow-sm" />
      ) : (
        <span style={{ fontSize: iconSize }} className="drop-shadow-sm">{INDUSTRY_CONFIGS[id as IndustryId]?.emoji || "⚙️"}</span>
      )}
    </div>
  );
}

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
  analyticsMetrics: { label: string; val: string; delta: string }[];
  activityFeed: { icon: string; text: string; time: string; status: string }[];
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
    analyticsMetrics: [
      { label: "Scontrino medio", val: "€34.50", delta: "+€3.20" },
      { label: "Coperti/giorno", val: "86", delta: "+12" },
      { label: "Food cost", val: "28%", delta: "-1.4%" },
      { label: "Ritorno clienti", val: "67%", delta: "+5%" },
    ],
    activityFeed: [
      { icon: "🍕", text: "Ordine tavolo 7 — €68", time: "1m", status: "new" },
      { icon: "💳", text: "Pagamento POS €142", time: "4m", status: "ok" },
      { icon: "⭐", text: "Review Google 5★", time: "18m", status: "star" },
    ],
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
    analyticsMetrics: [
      { label: "Revenue/transfer", val: "€185", delta: "+€22" },
      { label: "Occupazione flotta", val: "87%", delta: "+6%" },
      { label: "Clienti corporate", val: "42", delta: "+8" },
      { label: "NPS Score", val: "94", delta: "+3" },
    ],
    activityFeed: [
      { icon: "🚗", text: "Transfer NAP→Positano", time: "3m", status: "new" },
      { icon: "💳", text: "Bonifico €340 Hotel Exc.", time: "12m", status: "ok" },
      { icon: "✈️", text: "Volo AZ1284 atterrato", time: "25m", status: "new" },
    ],
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
    analyticsMetrics: [
      { label: "Tasso prenotazione", val: "78%", delta: "+4.2%" },
      { label: "Clienti fidelizzati", val: "156", delta: "+23" },
      { label: "Ticket medio", val: "€62", delta: "+€8" },
      { label: "No-show rate", val: "3.2%", delta: "-1.1%" },
    ],
    activityFeed: [
      { icon: "💇", text: "Appuntamento Giulia M.", time: "2m", status: "new" },
      { icon: "💳", text: "Pagamento €75 Colore+Piega", time: "8m", status: "ok" },
      { icon: "⭐", text: "Review 5★ da Valentina", time: "35m", status: "star" },
    ],
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
    analyticsTitle: "Performance Clinica",
    analyticsBars: [40, 65, 50, 88, 72, 90, 55, 80, 68, 85, 60, 92],
    crmClients: [
      { name: "Dott. Rossi", tag: "Referente", spent: "€5.2K" },
      { name: "Maria G.", tag: "Regolare", spent: "€1.8K" },
      { name: "Paolo V.", tag: "Nuovo", spent: "€180" },
      { name: "Teresa M.", tag: "Cronico", spent: "€3.6K" },
    ],
    notifications: [
      { icon: "🩺", text: "Visita Dr. Bianchi tra 15min", time: "ora" },
      { icon: "📋", text: "Referti lab pronti", time: "30m" },
      { icon: "💊", text: "Prescrizione rinnovata", time: "1h" },
      { icon: "📊", text: "Report mensile generato", time: "3h" },
    ],
    settingsToggles: [
      { label: "Prenotazioni online", on: true },
      { label: "Reminder SMS", on: true },
      { label: "Schede paziente", on: true },
      { label: "Telemedicina", on: false },
      { label: "Fatturazione auto", on: true },
    ],
  },
  retail: {
    heroGradient: "linear-gradient(135deg, #1a1a1a22, #33333310)",
    cardBg: "#ffffff08",
    chartColors: ["#ffffff", "#999999", "#666666"],
    kpis: [{ label: "Vendite", val: "89" }, { label: "Prodotti", val: "340" }, { label: "Rating", val: "4.7★" }, { label: "Revenue", val: "€5.8K" }],
    bookingFields: ["Nome", "Email", "Prodotto", "Qta"],
    heroSubtext: "Fashion & Style",
    serviceIcon: "🛍️",
    analyticsTitle: "Vendite Categoria",
    analyticsBars: [55, 78, 42, 95, 60, 85, 48, 72, 90, 65, 80, 70],
    crmClients: [
      { name: "Alessia R.", tag: "Gold", spent: "€4.5K" },
      { name: "Martina B.", tag: "Silver", spent: "€1.2K" },
      { name: "Stefano C.", tag: "Nuovo", spent: "€95" },
      { name: "Claudia P.", tag: "VIP", spent: "€7.8K" },
    ],
    notifications: [
      { icon: "🛒", text: "Ordine online #1284", time: "5m" },
      { icon: "📦", text: "Riordino stock sneakers", time: "1h" },
      { icon: "🏷️", text: "Promo weekend attivata", time: "2h" },
      { icon: "⭐", text: "Review 5★ Google", time: "4h" },
    ],
    settingsToggles: [
      { label: "E-commerce", on: true },
      { label: "Inventario live", on: true },
      { label: "Loyalty program", on: true },
      { label: "Click & collect", on: false },
      { label: "Newsletter AI", on: true },
    ],
  },
  fitness: {
    heroGradient: "linear-gradient(135deg, #f9731622, #ff990010)",
    cardBg: "#f9731612",
    chartColors: ["#f97316", "#ff9900", "#fbbf24"],
    kpis: [{ label: "Iscritti", val: "156" }, { label: "Corsi", val: "24" }, { label: "Rating", val: "4.8★" }, { label: "MRR", val: "€6.2K" }],
    bookingFields: ["Nome", "Corso", "Data", "Orario"],
    heroSubtext: "Fitness Club",
    serviceIcon: "💪",
    analyticsTitle: "Frequenza Palestra",
    analyticsBars: [70, 85, 55, 92, 78, 88, 60, 95, 82, 75, 90, 68],
    crmClients: [
      { name: "Andrea M.", tag: "Premium", spent: "€1.8K" },
      { name: "Sara L.", tag: "Annuale", spent: "€890" },
      { name: "Davide F.", tag: "Trial", spent: "€39" },
      { name: "Roberta N.", tag: "PT", spent: "€3.2K" },
    ],
    notifications: [
      { icon: "🏋️", text: "Lezione HIIT tra 30min", time: "ora" },
      { icon: "🎯", text: "Obiettivo raggiunto: 10 sedute", time: "2h" },
      { icon: "📈", text: "Nuovi iscritti +12 questa settimana", time: "5h" },
      { icon: "💳", text: "Rinnovo abbonamento Sara L.", time: "1g" },
    ],
    settingsToggles: [
      { label: "Booking corsi", on: true },
      { label: "Check-in QR", on: true },
      { label: "Piani allenamento", on: true },
      { label: "Streaming corsi", on: false },
      { label: "App branded", on: true },
    ],
  },
  hospitality: {
    heroGradient: "linear-gradient(135deg, #92400e22, #b4540010)",
    cardBg: "#92400e12",
    chartColors: ["#b45309", "#d97706", "#fbbf24"],
    kpis: [{ label: "Camere", val: "42" }, { label: "Occupaz.", val: "87%" }, { label: "Rating", val: "4.9★" }, { label: "ADR", val: "€189" }],
    bookingFields: ["Ospite", "Check-in", "Check-out", "Camere"],
    heroSubtext: "Luxury Hotel",
    serviceIcon: "🏨",
    analyticsTitle: "Occupazione Mensile",
    analyticsBars: [65, 78, 82, 95, 88, 92, 70, 85, 90, 75, 80, 88],
    crmClients: [
      { name: "Famiglia Bianchi", tag: "Habitué", spent: "€8.4K" },
      { name: "John S.", tag: "Intl VIP", spent: "€12K" },
      { name: "Agenzia Viaggi", tag: "B2B", spent: "€25K" },
      { name: "Marco L.", tag: "Corporate", spent: "€6.2K" },
    ],
    notifications: [
      { icon: "🛎️", text: "Check-in ospite Suite 201", time: "10m" },
      { icon: "🍽️", text: "Room service camera 305", time: "25m" },
      { icon: "⭐", text: "Booking.com review 9.4", time: "1h" },
      { icon: "🧹", text: "Pulizia camera 112 completata", time: "2h" },
    ],
    settingsToggles: [
      { label: "Channel manager", on: true },
      { label: "Self check-in", on: true },
      { label: "Concierge AI", on: true },
      { label: "Room service app", on: false },
      { label: "Revenue management", on: true },
    ],
  },
  beach: {
    heroGradient: "linear-gradient(135deg, #0891b222, #06b6d410)",
    cardBg: "#0891b212",
    chartColors: ["#0891b2", "#06b6d4", "#67e8f9"],
    kpis: [{ label: "Ombrelloni", val: "120" }, { label: "Prenot.", val: "95" }, { label: "Rating", val: "4.7★" }, { label: "Incasso", val: "€2.8K" }],
    bookingFields: ["Nome", "Data", "Fila", "Ombrellone"],
    heroSubtext: "Lido & Beach",
    serviceIcon: "🏖️",
    analyticsTitle: "Presenze Stagione",
    analyticsBars: [30, 45, 58, 72, 88, 95, 98, 92, 85, 60, 40, 25],
    crmClients: [
      { name: "Famiglia Russo", tag: "Stagionale", spent: "€2.4K" },
      { name: "Hotel Miramare", tag: "B2B", spent: "€8.5K" },
      { name: "Luca D.", tag: "Weekend", spent: "€340" },
      { name: "Anna P.", tag: "Fedele", spent: "€1.6K" },
    ],
    notifications: [
      { icon: "☀️", text: "Previsione: 34°C domani", time: "1h" },
      { icon: "🏖️", text: "Ombrellone A12 prenotato", time: "15m" },
      { icon: "🍹", text: "Ordine bar lettino B7", time: "5m" },
      { icon: "🌊", text: "Bandiera verde confermata", time: "3h" },
    ],
    settingsToggles: [
      { label: "Mappa interattiva", on: true },
      { label: "Prenotazione online", on: true },
      { label: "Ordini spiaggia", on: true },
      { label: "Abbonamenti", on: true },
      { label: "Meteo widget", on: false },
    ],
  },
  plumber: {
    heroGradient: "linear-gradient(135deg, #2563eb22, #3b82f610)",
    cardBg: "#2563eb12",
    chartColors: ["#2563eb", "#3b82f6", "#93c5fd"],
    kpis: [{ label: "Interventi", val: "23" }, { label: "Clienti", val: "87" }, { label: "Rating", val: "4.8★" }, { label: "Fatturato", val: "€3.5K" }],
    bookingFields: ["Cliente", "Indirizzo", "Tipo", "Urgenza"],
    heroSubtext: "Pronto Intervento",
    serviceIcon: "🔧",
    analyticsTitle: "Interventi Mese",
    analyticsBars: [45, 62, 38, 80, 55, 72, 48, 85, 60, 75, 50, 68],
    crmClients: [
      { name: "Condominio Via Roma", tag: "Contratto", spent: "€4.8K" },
      { name: "Hotel Vesuvio", tag: "B2B", spent: "€3.2K" },
      { name: "Mario B.", tag: "Urgente", spent: "€450" },
      { name: "Laura C.", tag: "Regolare", spent: "€1.1K" },
    ],
    notifications: [
      { icon: "🚨", text: "Emergenza: perdita Via Dante 12", time: "3m" },
      { icon: "🔧", text: "Intervento completato #847", time: "45m" },
      { icon: "📸", text: "Foto prima/dopo caricate", time: "1h" },
      { icon: "💰", text: "Preventivo approvato €680", time: "2h" },
    ],
    settingsToggles: [
      { label: "Richieste online", on: true },
      { label: "GPS tracking", on: true },
      { label: "Foto interventi", on: true },
      { label: "Preventivi auto", on: false },
      { label: "Fatturazione", on: true },
    ],
  },
  electrician: {
    heroGradient: "linear-gradient(135deg, #eab30822, #f59e0b10)",
    cardBg: "#eab30812",
    chartColors: ["#eab308", "#f59e0b", "#fcd34d"],
    kpis: [{ label: "Lavori", val: "31" }, { label: "Clienti", val: "124" }, { label: "Rating", val: "4.9★" }, { label: "Fatturato", val: "€4.8K" }],
    bookingFields: ["Cliente", "Indirizzo", "Tipo", "Data"],
    heroSubtext: "Impianti Elettrici",
    serviceIcon: "⚡",
    analyticsTitle: "Lavori per Tipo",
    analyticsBars: [52, 78, 45, 85, 62, 90, 55, 82, 70, 88, 58, 75],
    crmClients: [
      { name: "Impresa Edile Srl", tag: "Partner", spent: "€8.2K" },
      { name: "Giuseppe T.", tag: "Residenziale", spent: "€1.5K" },
      { name: "Uffici Centro", tag: "Manutenzione", spent: "€4.6K" },
      { name: "Negozio Moda", tag: "Commerciale", spent: "€2.3K" },
    ],
    notifications: [
      { icon: "⚡", text: "Certificazione impianto pronta", time: "20m" },
      { icon: "📋", text: "Sopralluogo domani h.9", time: "1h" },
      { icon: "🔌", text: "Materiale ordinato per #231", time: "3h" },
      { icon: "💳", text: "Pagamento ricevuto €1.2K", time: "5h" },
    ],
    settingsToggles: [
      { label: "Richieste intervento", on: true },
      { label: "Certificazioni DICO", on: true },
      { label: "Magazzino ricambi", on: true },
      { label: "Dispatch autisti", on: false },
      { label: "Report tecnici", on: true },
    ],
  },
  construction: {
    heroGradient: "linear-gradient(135deg, #78350f22, #92400e10)",
    cardBg: "#78350f12",
    chartColors: ["#78350f", "#92400e", "#d97706"],
    kpis: [{ label: "Cantieri", val: "8" }, { label: "Operai", val: "34" }, { label: "Avanz.", val: "72%" }, { label: "Budget", val: "€45K" }],
    bookingFields: ["Committente", "Cantiere", "Data", "Note"],
    heroSubtext: "Edilizia & Costruzioni",
    serviceIcon: "🏗️",
    analyticsTitle: "Avanzamento Cantieri",
    analyticsBars: [25, 45, 60, 72, 55, 80, 40, 65, 78, 50, 70, 85],
    crmClients: [
      { name: "Comune di Napoli", tag: "Pubblico", spent: "€120K" },
      { name: "Rossi Costruzioni", tag: "Subappalto", spent: "€45K" },
      { name: "Villa Privata", tag: "Residenziale", spent: "€28K" },
      { name: "Centro Comm.", tag: "Commerciale", spent: "€85K" },
    ],
    notifications: [
      { icon: "🏗️", text: "Cantiere Via Napoli: fase 3", time: "30m" },
      { icon: "📸", text: "Foto avanzamento caricate", time: "2h" },
      { icon: "⚠️", text: "Consegna materiali ritardata", time: "4h" },
      { icon: "📊", text: "SAL #4 pronto per firma", time: "1g" },
    ],
    settingsToggles: [
      { label: "Timeline cantieri", on: true },
      { label: "Gestione operai", on: true },
      { label: "Foto avanzamento", on: true },
      { label: "Contabilità SAL", on: true },
      { label: "Sicurezza cantiere", on: false },
    ],
  },
  veterinary: {
    heroGradient: "linear-gradient(135deg, #059a6e22, #10b98110)",
    cardBg: "#059a6e12",
    chartColors: ["#059a6e", "#10b981", "#6ee7b7"],
    kpis: [{ label: "Visite", val: "45" }, { label: "Pazienti", val: "312" }, { label: "Rating", val: "5.0★" }, { label: "Fatturato", val: "€5.1K" }],
    bookingFields: ["Proprietario", "Animale", "Data", "Tipo"],
    heroSubtext: "Clinica Veterinaria",
    serviceIcon: "🐾",
    analyticsTitle: "Visite per Specie",
    analyticsBars: [65, 80, 45, 90, 55, 75, 60, 85, 70, 78, 50, 88],
    crmClients: [
      { name: "Famiglia Verde", tag: "Multi-pet", spent: "€2.8K" },
      { name: "Allevamento Rex", tag: "Business", spent: "€5.4K" },
      { name: "Sara M.", tag: "Gatto", spent: "€680" },
      { name: "Marco P.", tag: "Cane", spent: "€1.2K" },
    ],
    notifications: [
      { icon: "🐶", text: "Vaccino Rex - richiamo", time: "1h" },
      { icon: "🏥", text: "Intervento chirurgico h.14", time: "3h" },
      { icon: "💊", text: "Ricetta antiparassitario", time: "5h" },
      { icon: "📞", text: "Emergenza: gatto in arrivo", time: "2m" },
    ],
    settingsToggles: [
      { label: "Prenotazioni online", on: true },
      { label: "Cartelle cliniche", on: true },
      { label: "Reminder vaccini", on: true },
      { label: "Telemedicina vet", on: false },
      { label: "Farmacia integrata", on: true },
    ],
  },
  tattoo: {
    heroGradient: "linear-gradient(135deg, #7c3aed22, #8b5cf610)",
    cardBg: "#7c3aed12",
    chartColors: ["#7c3aed", "#8b5cf6", "#c4b5fd"],
    kpis: [{ label: "Sessioni", val: "18" }, { label: "Artisti", val: "4" }, { label: "Rating", val: "4.9★" }, { label: "Incasso", val: "€3.9K" }],
    bookingFields: ["Nome", "Stile", "Zona", "Data"],
    heroSubtext: "Tattoo Studio",
    serviceIcon: "🎨",
    analyticsTitle: "Sessioni per Stile",
    analyticsBars: [40, 75, 55, 88, 62, 80, 48, 92, 58, 70, 85, 65],
    crmClients: [
      { name: "Alex K.", tag: "Collector", spent: "€4.5K" },
      { name: "Giulia F.", tag: "First timer", spent: "€280" },
      { name: "Dario S.", tag: "Sleeves", spent: "€3.8K" },
      { name: "Elena R.", tag: "Minimalista", spent: "€650" },
    ],
    notifications: [
      { icon: "🎨", text: "Bozza approvata da Alex", time: "30m" },
      { icon: "📅", text: "Sessione domani h.15", time: "2h" },
      { icon: "📸", text: "Portfolio aggiornato", time: "4h" },
      { icon: "⭐", text: "Review Instagram 5★", time: "1g" },
    ],
    settingsToggles: [
      { label: "Prenotazioni", on: true },
      { label: "Portfolio online", on: true },
      { label: "Consenso digitale", on: true },
      { label: "Custom design AI", on: false },
      { label: "Aftercare reminder", on: true },
    ],
  },
  events: {
    heroGradient: "linear-gradient(135deg, #dc264f22, #ef444410)",
    cardBg: "#dc264f12",
    chartColors: ["#dc2626", "#ef4444", "#fca5a5"],
    kpis: [{ label: "Eventi", val: "12" }, { label: "Ospiti", val: "480" }, { label: "Rating", val: "4.8★" }, { label: "Revenue", val: "€18K" }],
    bookingFields: ["Evento", "Data", "Location", "Budget"],
    heroSubtext: "Event Planning",
    serviceIcon: "🎉",
    analyticsTitle: "Eventi per Mese",
    analyticsBars: [35, 55, 70, 85, 92, 78, 65, 90, 80, 60, 45, 88],
    crmClients: [
      { name: "Comune Sorrento", tag: "Istituzionale", spent: "€25K" },
      { name: "Wedding Planner", tag: "Partner", spent: "€18K" },
      { name: "Corporate Srl", tag: "Aziendale", spent: "€12K" },
      { name: "Luca & Maria", tag: "Matrimonio", spent: "€8.5K" },
    ],
    notifications: [
      { icon: "🎪", text: "Allestimento Gala confermato", time: "1h" },
      { icon: "🎵", text: "DJ confermato per sabato", time: "3h" },
      { icon: "🍾", text: "Catering 200 pax ordinato", time: "5h" },
      { icon: "📋", text: "Checklist evento completata", time: "1g" },
    ],
    settingsToggles: [
      { label: "Booking eventi", on: true },
      { label: "Gestione fornitori", on: true },
      { label: "Timeline evento", on: true },
      { label: "Streaming live", on: false },
      { label: "Survey post-evento", on: true },
    ],
  },
  logistics: {
    heroGradient: "linear-gradient(135deg, #0369a122, #0284c710)",
    cardBg: "#0369a112",
    chartColors: ["#0369a1", "#0284c7", "#38bdf8"],
    kpis: [{ label: "Spedizioni", val: "67" }, { label: "Mezzi", val: "15" }, { label: "On-Time", val: "96%" }, { label: "Revenue", val: "€22K" }],
    bookingFields: ["Mittente", "Dest.", "Data", "Tipo"],
    heroSubtext: "Logistica & Trasporti",
    serviceIcon: "📦",
    analyticsTitle: "Consegne Giornaliere",
    analyticsBars: [55, 72, 48, 85, 68, 92, 58, 80, 75, 88, 62, 78],
    crmClients: [
      { name: "Amazon Hub", tag: "Enterprise", spent: "€45K" },
      { name: "E-Shop Italia", tag: "E-commerce", spent: "€12K" },
      { name: "Farmacia Online", tag: "Express", spent: "€8.5K" },
      { name: "Distrib. Food", tag: "Refrigerato", spent: "€15K" },
    ],
    notifications: [
      { icon: "🚛", text: "Consegna #4521 completata", time: "5m" },
      { icon: "📍", text: "Mezzo 7: ritardo 15min", time: "20m" },
      { icon: "📦", text: "42 pacchi in uscita", time: "1h" },
      { icon: "⛽", text: "Rifornimento mezzo 3", time: "3h" },
    ],
    settingsToggles: [
      { label: "Tracking live", on: true },
      { label: "Ottimizza percorsi", on: true },
      { label: "Prova di consegna", on: true },
      { label: "Drone delivery", on: false },
      { label: "Alert ritardi", on: true },
    ],
  },
  agriturismo: {
    heroGradient: "linear-gradient(135deg, #4d7c0f22, #65a30d10)",
    cardBg: "#4d7c0f12",
    chartColors: ["#4d7c0f", "#65a30d", "#a3e635"],
    kpis: [{ label: "Camere", val: "18" }, { label: "Ospiti", val: "42" }, { label: "Rating", val: "4.9★" }, { label: "Incasso", val: "€3.6K" }],
    bookingFields: ["Ospite", "Check-in", "Check-out", "Persone"],
    heroSubtext: "Agriturismo Bio",
    serviceIcon: "🌿",
    analyticsTitle: "Stagionalità Ospiti",
    analyticsBars: [20, 35, 50, 72, 88, 95, 98, 90, 78, 55, 30, 18],
    crmClients: [
      { name: "Famiglia Esposito", tag: "Ritornanti", spent: "€3.2K" },
      { name: "Gruppo Trekking", tag: "Avventura", spent: "€1.8K" },
      { name: "Blog Travel", tag: "Influencer", spent: "€0" },
      { name: "Coppia Tedesca", tag: "Internaz.", spent: "€2.4K" },
    ],
    notifications: [
      { icon: "🌿", text: "Check-in famiglia h.15", time: "2h" },
      { icon: "🍷", text: "Degustazione vini ore 18", time: "4h" },
      { icon: "🐓", text: "Raccolta uova completata", time: "6h" },
      { icon: "⭐", text: "Review Airbnb 5★", time: "1g" },
    ],
    settingsToggles: [
      { label: "Booking diretto", on: true },
      { label: "Menu km-zero", on: true },
      { label: "Esperienze rurali", on: true },
      { label: "Channel manager", on: false },
      { label: "Fattoria didattica", on: true },
    ],
  },
  cleaning: {
    heroGradient: "linear-gradient(135deg, #0891b222, #22d3ee10)",
    cardBg: "#0891b212",
    chartColors: ["#0891b2", "#22d3ee", "#67e8f9"],
    kpis: [{ label: "Servizi", val: "34" }, { label: "Clienti", val: "78" }, { label: "Rating", val: "4.7★" }, { label: "Fatturato", val: "€4.2K" }],
    bookingFields: ["Cliente", "Indirizzo", "Tipo", "Data"],
    heroSubtext: "Pulizie Professionali",
    serviceIcon: "🧹",
    analyticsTitle: "Servizi Settimanali",
    analyticsBars: [60, 72, 55, 80, 68, 85, 50, 78, 62, 88, 58, 75],
    crmClients: [
      { name: "Uffici Centro", tag: "Contratto", spent: "€6.8K" },
      { name: "Condominio Sole", tag: "Settimanale", spent: "€3.2K" },
      { name: "Villa Privata", tag: "Una tantum", spent: "€350" },
      { name: "B&B Costiera", tag: "Stagionale", spent: "€4.5K" },
    ],
    notifications: [
      { icon: "🧹", text: "Servizio Ufficio A completato", time: "30m" },
      { icon: "📋", text: "Checklist pulizia approvata", time: "1h" },
      { icon: "🧴", text: "Riordino prodotti necessario", time: "3h" },
      { icon: "💳", text: "Fattura #892 pagata", time: "5h" },
    ],
    settingsToggles: [
      { label: "Prenotazioni", on: true },
      { label: "Checklist digitale", on: true },
      { label: "Gestione team", on: true },
      { label: "Foto prima/dopo", on: true },
      { label: "Preventivi auto", on: false },
    ],
  },
  legal: {
    heroGradient: "linear-gradient(135deg, #1e3a5f22, #1e40af10)",
    cardBg: "#1e3a5f12",
    chartColors: ["#1e3a5f", "#1e40af", "#60a5fa"],
    kpis: [{ label: "Pratiche", val: "52" }, { label: "Clienti", val: "134" }, { label: "Rating", val: "5.0★" }, { label: "Fatturato", val: "€18K" }],
    bookingFields: ["Cliente", "Pratica", "Data", "Tipo"],
    heroSubtext: "Studio Legale",
    serviceIcon: "⚖️",
    analyticsTitle: "Pratiche per Area",
    analyticsBars: [70, 85, 55, 90, 75, 82, 60, 88, 78, 65, 80, 72],
    crmClients: [
      { name: "Azienda Tech Srl", tag: "Societario", spent: "€15K" },
      { name: "Marco R.", tag: "Civile", spent: "€3.8K" },
      { name: "Immobiliare SpA", tag: "Contratti", spent: "€22K" },
      { name: "Dott.ssa Verdi", tag: "Tributario", spent: "€5.5K" },
    ],
    notifications: [
      { icon: "⚖️", text: "Udienza domani h.10 Tribunale", time: "1h" },
      { icon: "📄", text: "Contratto firmato digitalmente", time: "3h" },
      { icon: "⏰", text: "Scadenza deposito atto", time: "1g" },
      { icon: "💼", text: "Nuovo mandato ricevuto", time: "2g" },
    ],
    settingsToggles: [
      { label: "Agenda udienze", on: true },
      { label: "Fascicolo digitale", on: true },
      { label: "Timesheet ore", on: true },
      { label: "Fatturazione auto", on: true },
      { label: "Firma digitale", on: false },
    ],
  },
  accounting: {
    heroGradient: "linear-gradient(135deg, #2563eb22, #3b82f610)",
    cardBg: "#2563eb12",
    chartColors: ["#2563eb", "#3b82f6", "#93c5fd"],
    kpis: [{ label: "Clienti", val: "89" }, { label: "Dichiar.", val: "156" }, { label: "Rating", val: "4.8★" }, { label: "Fatturato", val: "€12K" }],
    bookingFields: ["Cliente", "P.IVA", "Tipo", "Scadenza"],
    heroSubtext: "Studio Commercialista",
    serviceIcon: "📊",
    analyticsTitle: "Scadenze Fiscali",
    analyticsBars: [85, 92, 70, 45, 80, 55, 90, 75, 60, 88, 78, 95],
    crmClients: [
      { name: "Ristorante Bella", tag: "Semplificata", spent: "€2.4K" },
      { name: "Tech Startup", tag: "Ordinaria", spent: "€5.8K" },
      { name: "Dott. Bianchi", tag: "Professionista", spent: "€1.8K" },
      { name: "Import Export", tag: "Intra-UE", spent: "€8.2K" },
    ],
    notifications: [
      { icon: "📊", text: "Scadenza F24: 16 marzo", time: "2g" },
      { icon: "📄", text: "730 precompilato pronto", time: "1h" },
      { icon: "💰", text: "IVA trimestrale calcolata", time: "5h" },
      { icon: "📋", text: "Bilancio 2025 da approvare", time: "1g" },
    ],
    settingsToggles: [
      { label: "Scadenzario auto", on: true },
      { label: "Fatturazione elett.", on: true },
      { label: "Portale clienti", on: true },
      { label: "Paghe integrate", on: false },
      { label: "Alert normative", on: true },
    ],
  },
  garage: {
    heroGradient: "linear-gradient(135deg, #78350f22, #a1620710)",
    cardBg: "#78350f12",
    chartColors: ["#78350f", "#a16207", "#fbbf24"],
    kpis: [{ label: "Riparazioni", val: "27" }, { label: "Veicoli", val: "45" }, { label: "Rating", val: "4.8★" }, { label: "Fatturato", val: "€6.3K" }],
    bookingFields: ["Cliente", "Veicolo", "Targa", "Lavoro"],
    heroSubtext: "Autofficina",
    serviceIcon: "🔩",
    analyticsTitle: "Lavori per Tipo",
    analyticsBars: [50, 72, 42, 88, 58, 80, 45, 75, 65, 90, 55, 82],
    crmClients: [
      { name: "Flotta Taxi Roma", tag: "Flotta", spent: "€12K" },
      { name: "Giuseppe M.", tag: "Privato", spent: "€890" },
      { name: "Noleggio Auto", tag: "B2B", spent: "€8.5K" },
      { name: "Angela S.", tag: "Tagliando", spent: "€450" },
    ],
    notifications: [
      { icon: "🔩", text: "Riparazione #345 completata", time: "20m" },
      { icon: "📋", text: "Preventivo inviato a Giuseppe", time: "1h" },
      { icon: "⚠️", text: "Ricambio in arrivo domani", time: "3h" },
      { icon: "🚗", text: "Revisione scaduta: AB123CD", time: "1g" },
    ],
    settingsToggles: [
      { label: "Prenotazioni online", on: true },
      { label: "Gestione ricambi", on: true },
      { label: "Scheda veicolo", on: true },
      { label: "Preventivi digitali", on: true },
      { label: "Alert revisioni", on: false },
    ],
  },
  photography: {
    heroGradient: "linear-gradient(135deg, #9333ea22, #a855f710)",
    cardBg: "#9333ea12",
    chartColors: ["#9333ea", "#a855f7", "#d8b4fe"],
    kpis: [{ label: "Shooting", val: "14" }, { label: "Clienti", val: "67" }, { label: "Rating", val: "5.0★" }, { label: "Revenue", val: "€5.8K" }],
    bookingFields: ["Cliente", "Tipo", "Data", "Location"],
    heroSubtext: "Studio Fotografico",
    serviceIcon: "📸",
    analyticsTitle: "Shooting per Mese",
    analyticsBars: [35, 58, 45, 80, 72, 90, 55, 85, 68, 75, 82, 62],
    crmClients: [
      { name: "Sposi Maggio", tag: "Wedding", spent: "€3.5K" },
      { name: "Brand Moda", tag: "E-commerce", spent: "€8.2K" },
      { name: "Neonato Leo", tag: "Newborn", spent: "€450" },
      { name: "Chef Stellato", tag: "Food Photo", spent: "€1.8K" },
    ],
    notifications: [
      { icon: "📸", text: "Shooting matrimonio domani", time: "1h" },
      { icon: "🖼️", text: "Gallery consegnata a Brand", time: "3h" },
      { icon: "💳", text: "Acconto ricevuto €500", time: "5h" },
      { icon: "⭐", text: "Recensione Google 5★", time: "1g" },
    ],
    settingsToggles: [
      { label: "Booking shooting", on: true },
      { label: "Gallery privata", on: true },
      { label: "Watermark auto", on: true },
      { label: "AI photo editing", on: false },
      { label: "Portfolio pubblico", on: true },
    ],
  },
  gardening: {
    heroGradient: "linear-gradient(135deg, #16a34a22, #22c55e10)",
    cardBg: "#16a34a12",
    chartColors: ["#16a34a", "#22c55e", "#86efac"],
    kpis: [{ label: "Giardini", val: "23" }, { label: "Clienti", val: "56" }, { label: "Rating", val: "4.9★" }, { label: "Fatturato", val: "€3.8K" }],
    bookingFields: ["Cliente", "Indirizzo", "Tipo", "Data"],
    heroSubtext: "Giardinaggio",
    serviceIcon: "🌱",
    analyticsTitle: "Manutenzioni Mese",
    analyticsBars: [30, 48, 62, 78, 85, 92, 88, 80, 65, 50, 35, 22],
    crmClients: [
      { name: "Villa Costiera", tag: "Premium", spent: "€5.2K" },
      { name: "Condominio Verde", tag: "Contratto", spent: "€3.6K" },
      { name: "B&B Giardino", tag: "Stagionale", spent: "€1.8K" },
      { name: "Parco Comunale", tag: "Pubblico", spent: "€8.4K" },
    ],
    notifications: [
      { icon: "🌱", text: "Potatura Villa completata", time: "1h" },
      { icon: "🌧️", text: "Pioggia domani: spostare lavori", time: "3h" },
      { icon: "🌸", text: "Piantumazione primavera pianificata", time: "1g" },
      { icon: "💰", text: "Fattura #234 pagata", time: "2g" },
    ],
    settingsToggles: [
      { label: "Pianificazione lavori", on: true },
      { label: "Foto prima/dopo", on: true },
      { label: "Meteo integrato", on: true },
      { label: "Irrigazione smart", on: false },
      { label: "Preventivi online", on: true },
    ],
  },
  childcare: {
    heroGradient: "linear-gradient(135deg, #f472b622, #fb923c10)",
    cardBg: "#f472b612",
    chartColors: ["#f472b6", "#fb923c", "#fcd34d"],
    kpis: [{ label: "Bambini", val: "32" }, { label: "Iscritti", val: "28" }, { label: "Rating", val: "5.0★" }, { label: "MRR", val: "€4.5K" }],
    bookingFields: ["Genitore", "Bambino", "Età", "Orario"],
    heroSubtext: "Asilo & Infanzia",
    serviceIcon: "👶",
    analyticsTitle: "Presenze Settimana",
    analyticsBars: [85, 90, 82, 88, 78, 45, 20, 88, 92, 80, 85, 75],
    crmClients: [
      { name: "Fam. Rossi", tag: "2 figli", spent: "€4.8K" },
      { name: "Fam. Bianchi", tag: "Nido", spent: "€3.2K" },
      { name: "Fam. Verdi", tag: "Materna", spent: "€2.8K" },
      { name: "Fam. Neri", tag: "Nuovo", spent: "€480" },
    ],
    notifications: [
      { icon: "👶", text: "Merenda preparata h.15:30", time: "30m" },
      { icon: "📷", text: "Foto giornata condivise", time: "2h" },
      { icon: "🎨", text: "Laboratorio creativo domani", time: "5h" },
      { icon: "📋", text: "Menu settimanale aggiornato", time: "1g" },
    ],
    settingsToggles: [
      { label: "Diario digitale", on: true },
      { label: "Comunicazione genitori", on: true },
      { label: "Menu & allergie", on: true },
      { label: "Video sorveglianza", on: false },
      { label: "Fatturazione auto", on: true },
    ],
  },
  education: {
    heroGradient: "linear-gradient(135deg, #0d948822, #14b8a610)",
    cardBg: "#0d948812",
    chartColors: ["#0d9488", "#14b8a6", "#5eead4"],
    kpis: [{ label: "Studenti", val: "124" }, { label: "Corsi", val: "18" }, { label: "Rating", val: "4.9★" }, { label: "Revenue", val: "€8.2K" }],
    bookingFields: ["Studente", "Corso", "Livello", "Orario"],
    heroSubtext: "Formazione",
    serviceIcon: "🎓",
    analyticsTitle: "Iscrizioni Corsi",
    analyticsBars: [45, 65, 78, 82, 70, 88, 55, 72, 90, 60, 80, 75],
    crmClients: [
      { name: "Giulia P.", tag: "Certificato", spent: "€2.4K" },
      { name: "Azienda Form.", tag: "Corporate", spent: "€12K" },
      { name: "Marco T.", tag: "Online", spent: "€480" },
      { name: "Scuola Privata", tag: "Istituzionale", spent: "€8.5K" },
    ],
    notifications: [
      { icon: "🎓", text: "Corso React: lezione 8 oggi", time: "1h" },
      { icon: "📝", text: "Esame certificazione domani", time: "3h" },
      { icon: "🏆", text: "Studente del mese: Giulia P.", time: "1g" },
      { icon: "📊", text: "Report frequenze pronto", time: "2g" },
    ],
    settingsToggles: [
      { label: "Iscrizioni online", on: true },
      { label: "E-learning", on: true },
      { label: "Certificazioni", on: true },
      { label: "Esami online", on: false },
      { label: "Pagamenti rateali", on: true },
    ],
  },
  custom: {
    heroGradient: "linear-gradient(135deg, #6366f122, #818cf810)",
    cardBg: "#6366f112",
    chartColors: ["#6366f1", "#818cf8", "#a5b4fc"],
    kpis: [{ label: "Clienti", val: "45" }, { label: "Progetti", val: "12" }, { label: "Rating", val: "4.9★" }, { label: "Revenue", val: "€7.2K" }],
    bookingFields: ["Nome", "Progetto", "Budget", "Data"],
    heroSubtext: "Custom Business",
    serviceIcon: "✨",
    analyticsTitle: "Performance",
    analyticsBars: [50, 68, 42, 85, 60, 78, 55, 90, 72, 80, 65, 88],
    crmClients: [
      { name: "Cliente A", tag: "Enterprise", spent: "€12K" },
      { name: "Cliente B", tag: "PMI", spent: "€1.8K" },
      { name: "Cliente C", tag: "Startup", spent: "€680" },
      { name: "Cliente D", tag: "Freelance", spent: "€340" },
    ],
    notifications: [
      { icon: "✨", text: "Nuovo ordine ricevuto", time: "5m" },
      { icon: "💳", text: "Pagamento confermato", time: "30m" },
      { icon: "📊", text: "Report settimanale pronto", time: "2h" },
      { icon: "⭐", text: "Recensione 5★", time: "5h" },
    ],
    settingsToggles: [
      { label: "Booking online", on: true },
      { label: "Pagamenti digitali", on: true },
      { label: "CRM integrato", on: true },
      { label: "Marketing AI", on: false },
      { label: "App white-label", on: true },
    ],
  },
};

export function getSectorStyle(id: IndustryId): SectorStyle {
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
    analyticsMetrics: [
      { label: "Conversione", val: "12.4%", delta: "+2.1%" },
      { label: "Clienti attivi", val: "128", delta: "+12" },
      { label: "Ticket medio", val: "€38", delta: "+€4" },
      { label: "Retention", val: "85%", delta: "+2%" },
    ],
    activityFeed: [
      { icon: "🔔", text: "Nuovo ordine ricevuto", time: "2m", status: "new" },
      { icon: "💳", text: "Pagamento €85 confermato", time: "8m", status: "ok" },
      { icon: "⭐", text: "Recensione 5★ ricevuta", time: "22m", status: "star" },
    ],
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
   VARIANT SYSTEM — Each sector gets a unique visual style per screen
   ═══════════════════════════════════════════ */

const SECTOR_ORDER: IndustryId[] = [
  'food','ncc','beauty','healthcare','retail','fitness','hospitality','beach',
  'plumber','electrician','construction','veterinary','tattoo','events',
  'logistics','agriturismo','cleaning','legal','accounting','garage',
  'photography','gardening','childcare','education','custom'
];

function getVariant(industryId: IndustryId, screenIdx: number): number {
  const sectorIdx = SECTOR_ORDER.indexOf(industryId);
  // Different prime multipliers ensure unique combos
  return ((sectorIdx * 5 + screenIdx * 3 + 1) % 4);
}

/* ═══════════════════════════════════════════
   iPHONE FRAME COMPONENT — Premium with variant screens per sector
   ═══════════════════════════════════════════ */

export function IPhoneFrame({
  screen, color, emoji, companyName, services, index, sectorStyle, industryId, totalCount = 14,
}: {
  screen: { label: string; type: string; desc?: string };
  color: string;
  emoji: string;
  companyName: string;
  services: { name: string; emoji?: string; price: number }[];
  index: number;
  sectorStyle: SectorStyle;
  industryId: IndustryId;
  totalCount?: number;
}) {
  const centerIdx = Math.floor(totalCount / 2);
  const distFromCenter = Math.abs(index - centerIdx);
  const isCenter = distFromCenter === 0;
  const isNear = distFromCenter <= 1;
  const v = getVariant(industryId, index);

  // 3D perspective: lateral phones rotate toward center
  const rotateY = index < centerIdx ? 4 - distFromCenter * 0.5 : index > centerIdx ? -4 + distFromCenter * 0.5 : 0;
  const phoneScale = isCenter ? 1.08 : isNear ? 1.0 : 0.92;

  return (
    <motion.div
      className="flex-shrink-0 w-[105px] sm:w-[155px]"
      initial={{ opacity: 0, y: 40 + (isCenter ? 0 : 15), scale: 0.85 }}
      whileInView={{ opacity: 1, y: isCenter ? -12 : isNear ? -4 : 0, scale: phoneScale }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transform: `perspective(1200px) rotateY(${rotateY}deg)`,
        filter: "none",
        zIndex: isCenter ? 10 : isNear ? 5 : 1,
      }}
    >
      <MockupLightbox
        imageSrc={SECTOR_MOCKUP_IMAGES[industryId]?.[index % (SECTOR_MOCKUP_IMAGES[industryId]?.length || 1)]}
        imageAlt={`${companyName} - ${screen.label}`}
      >
      <div className="relative">
        {/* Ambient glow */}
        <div className="absolute -inset-4 rounded-[48px] blur-2xl pointer-events-none transition-opacity"
          style={{ background: `radial-gradient(circle, ${color}${isCenter ? '50' : '25'}, transparent 70%)`, opacity: isCenter ? 0.35 : 0.15 }} />

        {/* iPhone 16 Pro shell — titanium bezel */}
        <div className="relative rounded-[22px] sm:rounded-[36px] overflow-hidden"
          style={{
            border: "2.5px solid rgba(140,140,150,0.3)",
            background: "linear-gradient(180deg, #48484a 0%, #3a3a3c 2%, #2c2c2e 4%, #1c1c1e 8%, #0a0a0a 100%)",
            boxShadow: `0 30px 90px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.15), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(255,255,255,0.04)`,
          }}>

          {/* Glass reflection overlay */}
          <div className="absolute inset-0 pointer-events-none z-30 rounded-[22px] sm:rounded-[36px]"
            style={{ background: "linear-gradient(165deg, rgba(255,255,255,0.1) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.03) 100%)" }} />

          {/* Side buttons — action + volume (left) + power (right) */}
          <div className="absolute -left-[3.5px] top-[22%] w-[3px] h-[5%] rounded-l-full" style={{ background: "linear-gradient(180deg, rgba(160,160,170,0.35), rgba(120,120,130,0.25))" }} />
          <div className="absolute -left-[3.5px] top-[30%] w-[3px] h-[12%] rounded-l-full" style={{ background: "linear-gradient(180deg, rgba(160,160,170,0.35), rgba(120,120,130,0.25))" }} />
          <div className="absolute -left-[3.5px] top-[44%] w-[3px] h-[12%] rounded-l-full" style={{ background: "linear-gradient(180deg, rgba(160,160,170,0.35), rgba(120,120,130,0.25))" }} />
          <div className="absolute -right-[3.5px] top-[33%] w-[3px] h-[14%] rounded-r-full" style={{ background: "linear-gradient(180deg, rgba(160,160,170,0.35), rgba(120,120,130,0.25))" }} />

          {/* Screen area with inner radius */}
          <div className="m-[3px] sm:m-[4px] rounded-[19px] sm:rounded-[32px] overflow-hidden relative" style={{ background: "#000" }}>

            {/* Status bar */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-[5px] pb-0">
              <span className="text-[5.5px] font-semibold text-white/70 tracking-tight" style={{ fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif" }}>9:41</span>
              <div className="flex items-center gap-[3px]">
                <svg viewBox="0 0 16 12" className="w-[10px] h-[7px]" fill="none">
                  <rect x="0" y="4" width="3" height="8" rx="0.5" fill="white" opacity="0.6" />
                  <rect x="4" y="2.5" width="3" height="9.5" rx="0.5" fill="white" opacity="0.6" />
                  <rect x="8" y="1" width="3" height="11" rx="0.5" fill="white" opacity="0.6" />
                  <rect x="12" y="0" width="3" height="12" rx="0.5" fill="white" opacity="0.6" />
                </svg>
                <span className="text-[5px] text-white/50 font-semibold">5G</span>
                <svg viewBox="0 0 25 12" className="w-[14px] h-[7px]">
                  <rect x="0" y="0.5" width="21" height="11" rx="2" stroke="white" strokeOpacity="0.35" strokeWidth="1" fill="none" />
                  <rect x="22" y="3.5" width="2" height="5" rx="0.5" fill="white" fillOpacity="0.3" />
                  <rect x="1.5" y="2" width="14" height="8" rx="1" fill="white" fillOpacity="0.55" />
                </svg>
              </div>
            </div>

            {/* Dynamic Island */}
            <div className="absolute top-[2px] left-1/2 -translate-x-1/2 z-20">
              <div className="w-[38px] h-[11px] bg-black rounded-full relative" style={{ boxShadow: "0 0 0 0.5px rgba(255,255,255,0.06)" }}>
                <div className="absolute right-[6px] top-1/2 -translate-y-1/2 w-[3.5px] h-[3.5px] rounded-full" style={{ background: "radial-gradient(circle, #1a1a2e 40%, #0d0d15 100%)", boxShadow: "inset 0 0 1px rgba(255,255,255,0.08)" }} />
              </div>
            </div>

            {/* Screen content */}
            <div className="aspect-[9/19.5] overflow-hidden relative" style={{ background: "#000" }}>

              {/* ═══ MOCKUP IMAGE MODE — Use real screenshots when available ═══ */}
              {(() => {
                const mockups = SECTOR_MOCKUP_IMAGES[industryId];
                if (mockups && mockups.length > 0) {
                  const imgUrl = mockups[index % mockups.length];
                  return (
                    <img
                      src={imgUrl}
                      alt={`${companyName} - ${screen.label}`}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                      draggable={false}
                      style={{ objectPosition: "center 15%" }}
                    />
                  );
                }
                return null;
              })()}

            {/* ═══ CSS FALLBACK — Only renders when no mockup images are available ═══ */}
            {!SECTOR_MOCKUP_IMAGES[industryId]?.length && (<>

            {/* ═══ HERO SCREEN — 4 variants ═══ */}
            {screen.type === "hero" && (() => {
              if (v === 0) return (
                /* V0: Centered with orbit rings + realistic iOS hero */
                <div className="h-full flex flex-col" style={{ background: `linear-gradient(180deg, ${color}12 0%, #000 50%, ${color}06 100%)` }}>
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 30% 40%, ${color} 1px, transparent 1px), radial-gradient(circle at 70% 60%, ${color} 0.5px, transparent 0.5px)`, backgroundSize: "20px 20px, 15px 15px" }} />
                  <div className="flex-1 flex flex-col items-center justify-center p-3 text-center relative">
                    <motion.div className="absolute w-24 h-24 rounded-full border border-dashed opacity-[0.06]"
                      style={{ borderColor: color }} animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
                    <motion.div className="absolute w-16 h-16 rounded-full border opacity-[0.04]"
                      style={{ borderColor: color }} animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-2 relative" style={{ background: `linear-gradient(135deg, ${color}30, ${color}10)`, border: `1px solid ${color}25`, boxShadow: `0 8px 24px ${color}20` }}>
                      <motion.span className="text-xl drop-shadow-lg" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity }}>{emoji}</motion.span>
                    </div>
                    <p className="text-[10px] font-bold text-white/90 leading-tight tracking-wide">{companyName}</p>
                    <p className="text-[6px] text-white/30 mt-0.5 tracking-[0.2em] uppercase font-medium">{sectorStyle.heroSubtext}</p>
                    <motion.div className="mt-3 px-5 py-1.5 rounded-full text-[7px] font-bold text-white tracking-wider uppercase relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${color}, ${sectorStyle.chartColors[1] || color})`, boxShadow: `0 4px 20px ${color}40` }}>
                      <motion.div className="absolute inset-0" style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)" }}
                        animate={{ x: ["-200%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }} />
                      <span className="relative">Scopri di più</span>
                    </motion.div>
                  </div>
                  <div className="flex gap-0.5 p-1.5 pb-8">
                    {sectorStyle.kpis.slice(0, 3).map((k, i) => (
                      <motion.div key={i} className="flex-1 text-center p-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)", border: `0.5px solid rgba(255,255,255,0.06)` }}
                        initial={{ opacity: 0, y: 5 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.1 }}>
                        <p className="text-[5px] text-white/30">{k.label}</p>
                        <p className="text-[8px] font-bold" style={{ color }}>{k.val}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );

              if (v === 1) return (
                /* V1: Split layout — left-aligned with vertical accent */
                <div className="h-full flex flex-col relative" style={{ background: `linear-gradient(160deg, #0a0a0a 0%, ${color}08 100%)` }}>
                  <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: `linear-gradient(180deg, transparent, ${color}, transparent)` }} />
                  <div className="flex-1 flex flex-col justify-center p-3 pl-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg" style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
                        {emoji}
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#22c55e' }} />
                    </div>
                    <p className="text-[11px] font-black text-white/95 leading-tight">{companyName}</p>
                    <p className="text-[7px] text-white/30 mt-1 tracking-[0.2em] uppercase font-medium">{sectorStyle.heroSubtext}</p>
                    <div className="mt-3 flex gap-1">
                      {sectorStyle.kpis.slice(0, 2).map((k, i) => (
                        <div key={i} className="px-2 py-1 rounded-lg" style={{ background: `${color}10`, border: `0.5px solid ${color}15` }}>
                          <p className="text-[5px] text-white/20">{k.label}</p>
                          <p className="text-[8px] font-bold" style={{ color }}>{k.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-2">
                    <motion.div className="h-[22px] rounded-xl flex items-center justify-center text-[7px] font-bold text-black relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${color}, ${sectorStyle.chartColors[1] || color})` }}>
                      <motion.div className="absolute inset-0" style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)" }}
                        animate={{ x: ["-200%", "200%"] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }} />
                      <span className="relative">Inizia Ora →</span>
                    </motion.div>
                  </div>
                </div>
              );

              if (v === 2) return (
                /* V2: Floating card hero with glassmorphism */
                <div className="h-full flex flex-col items-center justify-center relative" style={{ background: `radial-gradient(circle at 50% 30%, ${color}12 0%, #0a0a0a 70%)` }}>
                  <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(${color}06 1px, transparent 1px), linear-gradient(90deg, ${color}06 1px, transparent 1px)`, backgroundSize: "16px 16px" }} />
                  <motion.div className="relative w-[85%] rounded-2xl p-3 text-center" 
                    style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`, border: `1px solid ${color}20`, backdropFilter: "blur(20px)", boxShadow: `0 8px 32px ${color}15` }}
                    animate={{ y: [0, -4, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                    <span className="text-2xl">{emoji}</span>
                    <p className="text-[10px] font-bold text-white/90 mt-1.5">{companyName}</p>
                    <p className="text-[6px] text-white/30 tracking-widest uppercase mt-0.5">{sectorStyle.heroSubtext}</p>
                    <div className="flex gap-1 mt-2 justify-center">
                      {sectorStyle.kpis.slice(0, 3).map((k, i) => (
                        <div key={i} className="px-1.5 py-0.5 rounded-md" style={{ backgroundColor: `${color}12` }}>
                          <p className="text-[4px] text-white/20">{k.label}</p>
                          <p className="text-[7px] font-bold" style={{ color }}>{k.val}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  <div className="mt-3 px-4 py-1.5 rounded-full text-[7px] font-bold tracking-wider" style={{ border: `1px solid ${color}40`, color }}>
                    Esplora ✦
                  </div>
                </div>
              );

              /* V3: Diagonal gradient split with futuristic HUD */
              return (
                <div className="h-full relative overflow-hidden" style={{ background: "#0a0a0a" }}>
                  <div className="absolute top-0 right-0 w-[70%] h-full" style={{ background: `linear-gradient(135deg, transparent 30%, ${color}08 60%, ${color}15 100%)`, clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)" }} />
                  <div className="absolute top-3 left-3 right-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: color }} />
                        <div className="w-1 h-3 rounded-full opacity-50" style={{ backgroundColor: color }} />
                        <div className="w-1 h-2 rounded-full opacity-25" style={{ backgroundColor: color }} />
                      </div>
                      <div className="px-2 py-0.5 rounded-full text-[5px] font-mono" style={{ border: `0.5px solid ${color}30`, color: `${color}80` }}>LIVE</div>
                    </div>
                  </div>
                  <div className="absolute bottom-12 left-3 right-3">
                    <span className="text-2xl">{emoji}</span>
                    <p className="text-[11px] font-black text-white mt-1">{companyName}</p>
                    <p className="text-[6px] tracking-[0.3em] uppercase mt-0.5" style={{ color: `${color}90` }}>{sectorStyle.heroSubtext}</p>
                  </div>
                  <div className="absolute bottom-2 left-3 right-3 flex gap-0.5">
                    {sectorStyle.kpis.map((k, i) => (
                      <div key={i} className="flex-1 py-1 text-center rounded-md" style={{ background: `${color}08`, border: `0.5px solid ${color}10` }}>
                        <p className="text-[4px] text-white/15">{k.label}</p>
                        <p className="text-[6px] font-bold" style={{ color }}>{k.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ═══ SERVICES SCREEN — Sector-specific + variant layouts ═══ */}
            {screen.type === "services" && (() => {
              /* ── Food: Photo-grid menu ── */
              if (industryId === "food") return (
                <div className="h-full p-2">
                  <div className="flex items-center gap-1 mb-1.5">
                    <span className="text-[7px] font-bold text-white/70">🍽️ Menu</span>
                    <div className="flex-1" />
                    <div className="px-1.5 py-0.5 rounded-full text-[4px]" style={{ backgroundColor: `${color}15`, color }}>🔍</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {services.slice(0, 4).map((s, i) => (
                      <motion.div key={i} className="rounded-lg overflow-hidden"
                        style={{ border: `0.5px solid ${color}15` }}
                        initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }}>
                        <div className="aspect-[4/3] relative" style={{
                          background: ['linear-gradient(135deg,#8B4513,#D2691E,#CD853F)','linear-gradient(135deg,#B22222,#DC143C,#FF6347)','linear-gradient(135deg,#DAA520,#F4A460,#FFDEAD)','linear-gradient(135deg,#654321,#8B6914,#B8860B)'][i%4]
                        }}>
                          <div className="absolute inset-0 bg-black/20" />
                          <span className="absolute bottom-1 left-1 text-[12px] drop-shadow-lg">{s.emoji||"🍕"}</span>
                        </div>
                        <div className="p-1 bg-black/40">
                          <p className="text-[6px] font-semibold text-white/90 truncate">{s.name}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[7px] font-bold" style={{ color }}>€{s.price}</span>
                            <div className="w-3 h-3 rounded-full flex items-center justify-center text-[5px] text-white" style={{ backgroundColor: color }}>+</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );

              /* ── NCC: Transfer route cards ── */
              if (industryId === "ncc") return (
                <div className="h-full p-2.5">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[8px] font-bold text-white/80 tracking-wide">Transfer & Tour</span>
                  </div>
                  <div className="space-y-1.5">
                    {services.slice(0, 4).map((s, i) => (
                      <motion.div key={i} className="p-2 rounded-xl relative overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${color}08, ${color}15)`, border: `0.5px solid ${color}20` }}
                        initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }}>
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px]"
                            style={{ background: `linear-gradient(135deg, ${color}30, ${color}15)` }}>
                            {["✈️","🚗","🏖️","⛵"][i%4]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[6px] font-bold text-white/85 truncate">{s.name}</p>
                            <div className="flex items-center gap-0.5 mt-0.5">
                              <div className="w-1 h-1 rounded-full bg-emerald-400" />
                              <span className="text-[4px] text-white/30">Disponibile</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] font-bold" style={{ color }}>€{s.price}</p>
                            <p className="text-[4px] text-white/25">per persona</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );

              /* ── Beauty: Appointment time-slot cards ── */
              if (industryId === "beauty") return (
                <div className="h-full p-2.5">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[8px] font-bold text-white/80">Trattamenti</span>
                  </div>
                  {services.slice(0, 4).map((s, i) => (
                    <motion.div key={i} className="flex items-center gap-1.5 p-1.5 rounded-lg mb-1"
                      style={{ backgroundColor: `${color}${i===0?'15':'08'}`, border: `0.5px solid ${color}${i===0?'25':'12'}` }}
                      initial={{ opacity: 0, y: 5 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.08 }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px]"
                        style={{ background: `linear-gradient(135deg, ${sectorStyle.chartColors[i%3]}, ${color})` }}>
                        {["💅","💇","✨","🧖"][i%4]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[6px] font-semibold text-white/85 truncate">{s.name}</p>
                        <div className="flex gap-1 mt-0.5">
                          {["10:00","11:30","14:00"].slice(0, 2+(i%2)).map((t, j) => (
                            <span key={j} className="px-1 py-[0.5px] rounded text-[4px] font-medium"
                              style={{ backgroundColor: j===0?color:`${color}15`, color: j===0?'#fff':`${color}90` }}>{t}</span>
                          ))}
                        </div>
                      </div>
                      <span className="text-[7px] font-bold" style={{ color }}>€{s.price}</span>
                    </motion.div>
                  ))}
                </div>
              );

              /* ── Healthcare: Medical service cards ── */
              if (industryId === "healthcare") return (
                <div className="h-full p-2.5">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[8px] font-bold text-white/80">Servizi Medici</span>
                  </div>
                  {services.slice(0, 4).map((s, i) => (
                    <motion.div key={i} className="p-1.5 rounded-lg mb-1"
                      style={{ backgroundColor: sectorStyle.cardBg, border: `0.5px solid ${color}15` }}
                      initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.08 }}>
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md flex items-center justify-center text-[8px]"
                          style={{ backgroundColor: `${color}20` }}>
                          {["🩺","🫀","🧬","💉"][i%4]}
                        </div>
                        <div className="flex-1">
                          <p className="text-[6px] font-semibold text-white/85 truncate">{s.name}</p>
                          <p className="text-[4px] text-white/30">Dr. {["Rossi","Bianchi","Verdi","Neri"][i]}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[7px] font-bold" style={{ color }}>€{s.price}</span>
                          <div className="px-1 py-[1px] rounded text-[3px] font-bold mt-0.5"
                            style={{ backgroundColor: i<2?'#22c55e20':`${color}15`, color: i<2?'#22c55e':`${color}90` }}>
                            {i<2?'Disponibile':'Su appunt.'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              );

              /* ── Beach: Umbrella map ── */
              if (industryId === "beach") return (
                <div className="h-full p-2.5">
                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[8px] font-bold text-white/80">Mappa Spiaggia</span>
                  </div>
                  <div className="rounded-lg p-1.5 mb-1.5" style={{ background: `linear-gradient(180deg, #87CEEB15, ${color}10)`, border: `0.5px solid ${color}15` }}>
                    <div className="grid grid-cols-6 gap-[2px]">
                      {Array.from({ length: 18 }).map((_, i) => (
                        <motion.div key={i} className="aspect-square rounded-sm flex items-center justify-center text-[4px]"
                          style={{ backgroundColor: [2,5,8,11,14].includes(i)?color:[3,7,12].includes(i)?'#ef444440':`${color}10`, color: [2,5,8,11,14].includes(i)?'#fff':'transparent' }}
                          initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.02 }}>
                          {[2,5,8,11,14].includes(i)?"☂":""}
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5"><div className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: color }} /><span className="text-[3px] text-white/30">Libero</span></div>
                      <div className="flex items-center gap-0.5"><div className="w-1.5 h-1.5 rounded-sm bg-red-500/25" /><span className="text-[3px] text-white/30">Occupato</span></div>
                    </div>
                  </div>
                  {services.slice(0, 2).map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5 p-1 rounded-md mb-0.5" style={{ backgroundColor: `${color}06` }}>
                      <span className="text-[8px]">{s.emoji || "🏖️"}</span>
                      <span className="text-[5px] text-white/60 flex-1 truncate">{s.name}</span>
                      <span className="text-[6px] font-bold" style={{ color }}>€{s.price}</span>
                    </div>
                  ))}
                </div>
              );

              /* ── Fitness: Class schedule cards ── */
              if (industryId === "fitness") return (
                <div className="h-full p-2.5">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[8px] font-bold text-white/80">Corsi & Lezioni</span>
                  </div>
                  {services.slice(0, 4).map((s, i) => (
                    <motion.div key={i} className="p-1.5 rounded-xl mb-1 relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${color}${i===0?'18':'08'}, transparent)`, border: `0.5px solid ${color}15` }}
                      initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.1 }}>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-xl flex items-center justify-center text-[10px]" style={{ background: `${color}20` }}>
                          {["🏋️","🧘","🥊","🏃"][i%4]}
                        </div>
                        <div className="flex-1">
                          <p className="text-[6px] font-bold text-white/85 truncate">{s.name}</p>
                          <div className="flex gap-1 mt-0.5">
                            <span className="text-[4px] px-1 rounded" style={{ backgroundColor: `${color}15`, color: `${color}90` }}>{["08:00","10:30","17:00","19:30"][i]}</span>
                            <span className="text-[4px] text-white/25">{["45","60","30","50"][i]}min</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[7px] font-bold" style={{ color }}>€{s.price}</p>
                          <div className="flex gap-[1px] mt-0.5">
                            {[1,2,3,4,5].map(j => <div key={j} className="w-[3px] h-[3px] rounded-full" style={{ backgroundColor: j <= (4 - i % 2) ? '#22c55e' : '#333' }} />)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              );

              /* ── Retail: Product grid ── */
              if (industryId === "retail") return (
                <div className="h-full p-2">
                  <div className="flex items-center gap-1 mb-1.5">
                    <span className="text-[7px] font-bold text-white/70">🛍️ Shop</span>
                    <div className="flex-1" />
                    <div className="px-1.5 py-0.5 rounded-full text-[4px]" style={{ backgroundColor: `${color}15`, color: `${color}CC` }}>Filtri</div>
                  </div>
                  <div className="flex gap-1 mb-1.5 overflow-hidden">
                    {["Tutti","Nuovi","Sale","Top"].map((t, i) => (
                      <div key={i} className="px-2 py-0.5 rounded-full text-[5px] font-bold whitespace-nowrap"
                        style={i===0?{ backgroundColor: color, color: "#fff" }:{ backgroundColor: `${color}08`, color: `${color}60` }}>{t}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {services.slice(0, 4).map((s, i) => (
                      <motion.div key={i} className="rounded-lg overflow-hidden" style={{ border: `0.5px solid ${color}12` }}
                        initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.08 }}>
                        <div className="aspect-square relative" style={{ background: `linear-gradient(135deg, ${color}08, ${color}18)` }}>
                          <span className="absolute inset-0 flex items-center justify-center text-[18px]">{s.emoji || "👗"}</span>
                          {i === 0 && <div className="absolute top-1 left-1 px-1 py-[1px] rounded text-[4px] font-bold bg-red-500 text-white">-20%</div>}
                        </div>
                        <div className="p-1">
                          <p className="text-[5px] text-white/70 truncate">{s.name}</p>
                          <p className="text-[7px] font-bold" style={{ color }}>€{s.price}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );

              /* ── Hospitality: Room cards ── */
              if (industryId === "hospitality") return (
                <div className="h-full p-2.5">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[8px] font-bold text-white/80">Camere & Suite</span>
                  </div>
                  {services.slice(0, 4).map((s, i) => (
                    <motion.div key={i} className="p-1.5 rounded-lg mb-1 relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg,${color}${i===0?'15':'06'},transparent)`, border: `0.5px solid ${color}15` }}
                      initial={{ opacity: 0, y: 5 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2+i*0.08 }}>
                      <div className="flex items-center gap-1.5">
                        <div className="w-8 h-6 rounded-md flex items-center justify-center text-[10px]"
                          style={{ background: `linear-gradient(135deg,${sectorStyle.chartColors[i%3]}30,${color}20)` }}>
                          {["🛏️","🏰","🌊","🍷"][i]}
                        </div>
                        <div className="flex-1">
                          <p className="text-[6px] font-semibold text-white/85 truncate">{s.name}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[4px] text-white/30">{["2 ospiti","4 ospiti","2 ospiti","6 ospiti"][i]}</span>
                            <span className="text-[4px]" style={{ color: i!==2?'#22c55e':'#ef4444' }}>●</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[7px] font-bold" style={{ color }}>€{s.price}</p>
                          <p className="text-[3px] text-white/20">/notte</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              );

              /* ── Default: Variant-based service list ── */
              const defaultVariants = [
                /* V0: Standard list */
                () => (
                  <div className="h-full p-2.5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <p className="text-[8px] font-bold text-white/80 tracking-wide">{INDUSTRY_CONFIGS[industryId]?.terminology?.items || "Servizi"}</p>
                    </div>
                    <div className="space-y-1">
                      {services.slice(0, 4).map((s, i) => (
                        <motion.div key={i} className="flex items-center gap-1.5 p-1.5 rounded-lg"
                          style={{ backgroundColor: sectorStyle.cardBg, border: `0.5px solid ${color}18` }}
                          initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3+i*0.08 }}>
                          <span className="text-[10px]">{s.emoji||sectorStyle.serviceIcon}</span>
                          <div className="flex-1 min-w-0"><p className="text-[7px] font-semibold text-white/80 truncate">{s.name}</p></div>
                          <span className="text-[7px] font-bold" style={{ color }}>€{s.price}</span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex gap-1 mt-2">
                      {["Tutti","Popolari","Nuovi"].map((t, i) => (
                        <div key={i} className="px-2 py-0.5 rounded-full text-[5px] font-bold"
                          style={i===0?{ backgroundColor: color, color: "#fff" }:{ backgroundColor: `${color}10`, color: `${color}90` }}>{t}</div>
                      ))}
                    </div>
                  </div>
                ),
                /* V1: Card grid */
                () => (
                  <div className="h-full p-2">
                    <div className="flex items-center gap-1 mb-1.5">
                      <span className="text-[7px] font-bold text-white/70">{emoji} {INDUSTRY_CONFIGS[industryId]?.terminology?.items || "Servizi"}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {services.slice(0, 4).map((s, i) => (
                        <motion.div key={i} className="rounded-xl p-2 text-center" style={{ background: `linear-gradient(135deg, ${color}${i===0?'15':'08'}, ${color}04)`, border: `0.5px solid ${color}15` }}
                          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.08 }}>
                          <span className="text-[14px]">{s.emoji || sectorStyle.serviceIcon}</span>
                          <p className="text-[5px] font-semibold text-white/70 truncate mt-1">{s.name}</p>
                          <p className="text-[7px] font-bold mt-0.5" style={{ color }}>€{s.price}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ),
                /* V2: Horizontal scrolling cards */
                () => (
                  <div className="h-full p-2.5">
                    <div className="flex items-center gap-1 mb-2">
                      <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-[8px] font-bold text-white/80">{INDUSTRY_CONFIGS[industryId]?.terminology?.items || "Servizi"}</span>
                    </div>
                    {services.slice(0, 4).map((s, i) => (
                      <motion.div key={i} className="flex items-center gap-1.5 p-1.5 rounded-xl mb-1 relative overflow-hidden"
                        style={{ background: `linear-gradient(90deg, ${color}${['12','08','06','04'][i]}, transparent)`, border: `0.5px solid ${color}12` }}
                        initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.1 }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px]" style={{ background: `${color}15` }}>
                          {s.emoji || sectorStyle.serviceIcon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[6px] font-bold text-white/85 truncate">{s.name}</p>
                          <div className="w-full h-[2px] rounded-full mt-1" style={{ backgroundColor: `${color}10` }}>
                            <div className="h-full rounded-full" style={{ width: `${60 + i * 10}%`, backgroundColor: color }} />
                          </div>
                        </div>
                        <p className="text-[7px] font-bold" style={{ color }}>€{s.price}</p>
                      </motion.div>
                    ))}
                  </div>
                ),
                /* V3: Minimal premium list */
                () => (
                  <div className="h-full p-2.5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[8px] font-bold text-white/80">{INDUSTRY_CONFIGS[industryId]?.terminology?.items || "Servizi"}</p>
                      <span className="text-[5px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${color}15`, color }}>{services.length}+</span>
                    </div>
                    {services.slice(0, 4).map((s, i) => (
                      <motion.div key={i} className="flex items-center gap-2 py-2 border-b" style={{ borderColor: `${color}08` }}
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.08 }}>
                        <div className="w-[3px] h-6 rounded-full" style={{ backgroundColor: sectorStyle.chartColors[i % 3] }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[6px] font-semibold text-white/80 truncate">{s.name}</p>
                          <p className="text-[4px] text-white/25 mt-0.5">{s.emoji || sectorStyle.serviceIcon} Disponibile</p>
                        </div>
                        <p className="text-[8px] font-black" style={{ color }}>€{s.price}</p>
                      </motion.div>
                    ))}
                  </div>
                ),
              ];

              return defaultVariants[v % defaultVariants.length]();
            })()}

            {/* ═══ BOOKING SCREEN — 4 variants ═══ */}
            {screen.type === "booking" && (() => {
              if (v === 0) return (
                /* V0: Classic form + calendar */
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
                    <div className="grid grid-cols-7 gap-[1px] mt-1">
                      {Array.from({ length: 14 }).map((_, i) => (
                        <div key={i} className="aspect-square rounded-sm flex items-center justify-center text-[4px]"
                          style={{ backgroundColor: i === 8 ? color : `${color}06`, color: i === 8 ? "#fff" : `${color}60`, fontWeight: i === 8 ? 700 : 400 }}>
                          {i + 15}
                        </div>
                      ))}
                    </div>
                    <motion.div className="h-[18px] rounded-lg flex items-center justify-center text-[7px] font-bold text-white mt-1 relative overflow-hidden"
                      style={{ backgroundColor: color, boxShadow: `0 3px 12px ${color}40` }}>
                      <motion.div className="absolute inset-0" style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)" }}
                        animate={{ x: ["-200%", "200%"] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }} />
                      <span className="relative">Conferma ✓</span>
                    </motion.div>
                  </div>
                </div>
              );

              if (v === 1) return (
                /* V1: Step wizard with progress */
                <div className="h-full p-2.5 flex flex-col">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <p className="text-[8px] font-bold text-white/80">Prenota</p>
                  </div>
                  {/* Progress steps */}
                  <div className="flex items-center gap-1 mb-3 px-1">
                    {[1,2,3].map(s => (
                      <div key={s} className="flex items-center gap-1 flex-1">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center text-[6px] font-bold"
                          style={{ backgroundColor: s <= 2 ? color : `${color}15`, color: s <= 2 ? '#fff' : `${color}60` }}>{s}</div>
                        {s < 3 && <div className="flex-1 h-[1px]" style={{ backgroundColor: s < 2 ? color : `${color}15` }} />}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 flex-1">
                    {sectorStyle.bookingFields.slice(0, 2).map((f, i) => (
                      <div key={i}>
                        <p className="text-[5px] text-white/30 mb-0.5 uppercase tracking-wider">{f}</p>
                        <div className="h-[20px] rounded-xl border px-2 flex items-center" style={{ backgroundColor: `${color}04`, borderColor: `${color}20` }}>
                          <span className="text-[6px] text-white/40">Inserisci {f.toLowerCase()}</span>
                        </div>
                      </div>
                    ))}
                    {/* Time slots */}
                    <div>
                      <p className="text-[5px] text-white/30 mb-1 uppercase tracking-wider">Orario</p>
                      <div className="grid grid-cols-3 gap-1">
                        {["09:00","10:30","12:00","14:00","15:30","17:00"].map((t, i) => (
                          <div key={i} className="py-1 rounded-lg text-center text-[5px] font-bold"
                            style={i === 2 ? { backgroundColor: color, color: '#fff' } : { backgroundColor: `${color}08`, color: `${color}70`, border: `0.5px solid ${color}15` }}>{t}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <motion.div className="h-[20px] rounded-xl flex items-center justify-center text-[7px] font-bold text-white relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${color}, ${sectorStyle.chartColors[1] || color})` }}>
                    <span>Avanti →</span>
                  </motion.div>
                </div>
              );

              if (v === 2) return (
                /* V2: Card-based selection */
                <div className="h-full p-2.5 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[8px] font-bold text-white/80">Prenota Online</p>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                  </div>
                  <div className="grid grid-cols-2 gap-1 mb-2">
                    {sectorStyle.bookingFields.map((f, i) => (
                      <motion.div key={i} className="p-2 rounded-xl text-center" 
                        style={{ background: i === 0 ? `${color}15` : `${color}06`, border: `0.5px solid ${i === 0 ? `${color}30` : `${color}10`}` }}
                        initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.05 }}>
                        <p className="text-[4px] text-white/25 uppercase tracking-wider">{f}</p>
                        <p className="text-[6px] text-white/50 mt-0.5">Seleziona</p>
                      </motion.div>
                    ))}
                  </div>
                  {/* Calendar preview */}
                  <div className="rounded-xl p-1.5 mb-2" style={{ backgroundColor: `${color}06`, border: `0.5px solid ${color}10` }}>
                    <div className="grid grid-cols-7 gap-[2px]">
                      {["L","M","M","G","V","S","D"].map((d, i) => (
                        <div key={i} className="text-[4px] text-white/20 text-center font-bold">{d}</div>
                      ))}
                      {Array.from({ length: 14 }).map((_, i) => (
                        <div key={i} className="aspect-square rounded flex items-center justify-center text-[4px]"
                          style={{ backgroundColor: i === 5 ? color : 'transparent', color: i === 5 ? '#fff' : `${color}40` }}>{i + 10}</div>
                      ))}
                    </div>
                  </div>
                  <motion.div className="h-[20px] rounded-xl flex items-center justify-center text-[7px] font-bold text-white relative overflow-hidden"
                    style={{ backgroundColor: color, boxShadow: `0 4px 16px ${color}40` }}>
                    <motion.div className="absolute inset-0" style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)" }}
                      animate={{ x: ["-200%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }} />
                    <span className="relative">Conferma Prenotazione</span>
                  </motion.div>
                </div>
              );

              /* V3: Minimalist form */
              return (
                <div className="h-full p-3 flex flex-col">
                  <div className="mb-3">
                    <p className="text-[9px] font-black text-white/90">Prenota</p>
                    <p className="text-[6px] text-white/25 mt-0.5">{sectorStyle.heroSubtext}</p>
                  </div>
                  <div className="space-y-2 flex-1">
                    {sectorStyle.bookingFields.map((f, i) => (
                      <div key={i}>
                        <p className="text-[5px] text-white/20 mb-0.5 font-bold uppercase tracking-[0.2em]">{f}</p>
                        <div className="h-[1px] w-full" style={{ backgroundColor: `${color}20` }} />
                        <p className="text-[6px] text-white/40 mt-1">...</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <div className="flex-1 h-[20px] rounded-lg flex items-center justify-center text-[6px] font-bold" style={{ border: `1px solid ${color}40`, color }}>Indietro</div>
                    <div className="flex-[2] h-[20px] rounded-lg flex items-center justify-center text-[6px] font-bold text-white" style={{ backgroundColor: color }}>Conferma →</div>
                  </div>
                </div>
              );
            })()}

            {/* ═══ DASHBOARD SCREEN — 4 variants ═══ */}
            {screen.type === "dashboard" && (() => {
              if (v === 0) return (
                /* V0: KPI Grid + chart + activity feed — iOS-style */
                <div className="h-full" style={{ background: "linear-gradient(180deg, #111 0%, #0a0a0a 100%)" }}>
                  <div className="px-2.5 pt-2 pb-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-[8px] font-bold text-white/90 tracking-tight">Dashboard</p>
                        <p className="text-[4px] text-white/25 mt-0.5">Oggi, {new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: `${color}15` }}>
                          <span className="text-[7px]">{emoji}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* KPI cards with glassmorphism */}
                  <div className="grid grid-cols-2 gap-[3px] px-2.5 mb-1.5">
                    {sectorStyle.kpis.map((kpi, i) => (
                      <motion.div key={i} className="p-2 rounded-xl relative overflow-hidden"
                        style={{ background: i === 0 ? `linear-gradient(135deg, ${color}18, ${color}08)` : "rgba(255,255,255,0.03)", border: `0.5px solid ${i === 0 ? `${color}25` : 'rgba(255,255,255,0.06)'}` }}
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.08 }}>
                        {i === 0 && <div className="absolute top-0 right-0 w-8 h-8 rounded-full opacity-20 blur-lg" style={{ background: color }} />}
                        <p className="text-[4px] text-white/35 tracking-wider uppercase font-medium">{kpi.label}</p>
                        <div className="flex items-baseline gap-0.5 mt-0.5">
                          <p className="text-[10px] font-black tracking-tight" style={{ color: i === 0 ? color : 'white', opacity: i === 0 ? 1 : 0.85 }}>{kpi.val}</p>
                          <span className="text-[4px] font-semibold text-emerald-400">+{(3 + i * 2)}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {/* Revenue chart */}
                  <div className="mx-2.5 rounded-xl p-2 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[5px] text-white/30 font-semibold uppercase tracking-wider">Revenue</span>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-emerald-400" />
                        <span className="text-[4px] font-bold text-emerald-400">+18%</span>
                      </div>
                    </div>
                    <svg viewBox="0 0 120 30" className="w-full h-8">
                      <defs><linearGradient id={`dg-${industryId}-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.25" /><stop offset="100%" stopColor={color} stopOpacity="0" />
                      </linearGradient></defs>
                      <path d="M0,28 C10,25 20,20 30,18 C40,16 50,22 60,15 C70,8 80,12 90,6 C100,4 110,8 120,3 L120,30 L0,30 Z" fill={`url(#dg-${industryId}-${index})`} />
                      <path d="M0,28 C10,25 20,20 30,18 C40,16 50,22 60,15 C70,8 80,12 90,6 C100,4 110,8 120,3" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="120" cy="3" r="2.5" fill={color}><animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" /></circle>
                      <circle cx="120" cy="3" r="5" fill={color} opacity="0.15"><animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" /></circle>
                    </svg>
                  </div>
                  {/* Activity feed */}
                  <div className="px-2.5 mt-1.5 space-y-[2px] pb-8">
                    {sectorStyle.notifications.slice(0, 2).map((n, i) => (
                      <motion.div key={i} className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg"
                        style={{ background: i === 0 ? `${color}08` : "rgba(255,255,255,0.02)", border: `0.5px solid ${i === 0 ? `${color}10` : 'rgba(255,255,255,0.04)'}` }}
                        initial={{ opacity: 0, x: -5 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 + i * 0.1 }}>
                        <span className="text-[7px]">{n.icon}</span>
                        <span className="text-[5px] text-white/50 flex-1 truncate">{n.text}</span>
                        <span className="text-[3px] text-white/20 font-medium">{n.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );

              if (v === 1) return (
                /* V1: Large radial gauge + horizontal metrics */
                <div className="h-full p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[7px] font-bold text-white/70">Dashboard</p>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#22c55e' }} />
                      <span className="text-[4px] text-white/30">Oggi</span>
                    </div>
                  </div>
                  {/* Radial gauge */}
                  <div className="flex justify-center mb-2">
                    <div className="relative w-20 h-20">
                      <svg viewBox="0 0 80 80" className="w-full h-full">
                        <circle cx="40" cy="40" r="32" fill="none" stroke={`${color}15`} strokeWidth="4" />
                        <motion.circle cx="40" cy="40" r="32" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
                          strokeDasharray="201" initial={{ strokeDashoffset: 201 }} whileInView={{ strokeDashoffset: 201 * 0.25 }}
                          viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut" }}
                          transform="rotate(-90 40 40)" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-[10px] font-black" style={{ color }}>{sectorStyle.kpis[0]?.val}</p>
                        <p className="text-[4px] text-white/25">{sectorStyle.kpis[0]?.label}</p>
                      </div>
                    </div>
                  </div>
                  {/* Horizontal metric bars */}
                  {sectorStyle.kpis.slice(1).map((kpi, i) => (
                    <div key={i} className="flex items-center gap-1.5 mb-1.5">
                      <p className="text-[5px] text-white/30 w-10 truncate">{kpi.label}</p>
                      <div className="flex-1 h-[6px] rounded-full" style={{ backgroundColor: `${color}10` }}>
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: sectorStyle.chartColors[i % 3] }}
                          initial={{ width: 0 }} whileInView={{ width: `${60 + i * 15}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }} />
                      </div>
                      <p className="text-[6px] font-bold" style={{ color }}>{kpi.val}</p>
                    </div>
                  ))}
                  {/* Activity */}
                  <div className="mt-1 space-y-0.5">
                    {sectorStyle.activityFeed.slice(0, 2).map((item, i) => (
                      <div key={i} className="flex items-center gap-1 px-1.5 py-1 rounded-md text-[5px]" style={{ backgroundColor: `${color}06` }}>
                        <span className="text-[7px]">{item.icon}</span>
                        <span className="text-white/40 flex-1 truncate">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );

              if (v === 2) return (
                /* V2: Stat columns with sparklines */
                <div className="h-full p-2.5">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="w-3 h-3 rounded-md flex items-center justify-center text-[8px]" style={{ backgroundColor: `${color}20` }}>{emoji}</div>
                    <p className="text-[7px] font-bold text-white/70">Overview</p>
                    <div className="flex-1" />
                    <span className="text-[5px] font-bold" style={{ color }}>↑ 12%</span>
                  </div>
                  {/* Large single metric */}
                  <div className="p-2 rounded-xl mb-2 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}12, ${color}06)`, border: `1px solid ${color}15` }}>
                    <p className="text-[5px] text-white/25 uppercase tracking-wider">{sectorStyle.kpis[3]?.label || "Revenue"}</p>
                    <p className="text-[14px] font-black" style={{ color }}>{sectorStyle.kpis[3]?.val}</p>
                    <svg viewBox="0 0 80 20" className="w-full h-4 mt-1">
                      <path d={`M0,18 ${sectorStyle.analyticsBars.slice(0,8).map((b,i)=>`L${i*11.5},${20-b*0.2}`).join(' ')}`} fill="none" stroke={color} strokeWidth="1" />
                    </svg>
                  </div>
                  {/* Stat columns */}
                  <div className="flex gap-1">
                    {sectorStyle.kpis.slice(0, 3).map((kpi, i) => (
                      <motion.div key={i} className="flex-1 p-1.5 rounded-lg text-center"
                        style={{ backgroundColor: `${color}06`, border: `0.5px solid ${color}08` }}
                        initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }}>
                        <p className="text-[4px] text-white/20">{kpi.label}</p>
                        <p className="text-[8px] font-bold" style={{ color }}>{kpi.val}</p>
                        <div className="flex justify-center gap-[1px] mt-1">
                          {[3,5,4,6,5,7,6].map((h, j) => (
                            <div key={j} className="w-[2px] rounded-full" style={{ height: h, backgroundColor: `${color}${j>4?'80':'30'}` }} />
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {/* Activity */}
                  <div className="mt-1.5 space-y-0.5">
                    {sectorStyle.activityFeed.slice(0, 2).map((item, i) => (
                      <div key={i} className="flex items-center gap-1 px-1 py-0.5 rounded text-[5px]" style={{ backgroundColor: `${color}04` }}>
                        <span className="text-[7px]">{item.icon}</span>
                        <span className="text-white/35 flex-1 truncate">{item.text}</span>
                        <span className="text-[3px] text-white/15">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );

              /* V3: Dark compact HUD */
              return (
                <div className="h-full p-2.5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-4 rounded-full" style={{ backgroundColor: color }} />
                      <div>
                        <p className="text-[7px] font-bold text-white/80">Command Center</p>
                        <p className="text-[4px] text-white/20">{sectorStyle.heroSubtext}</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-lg flex items-center justify-center text-[8px]" style={{ backgroundColor: `${color}15` }}>{emoji}</div>
                  </div>
                  {/* Horizontal stats */}
                  <div className="flex gap-[3px] mb-2">
                    {sectorStyle.kpis.map((kpi, i) => (
                      <div key={i} className="flex-1 p-1 rounded-md" style={{ backgroundColor: `${color}${i===0?'12':'06'}` }}>
                        <p className="text-[3px] text-white/15 uppercase">{kpi.label}</p>
                        <p className="text-[7px] font-black" style={{ color: i === 0 ? color : 'white', opacity: i === 0 ? 1 : 0.6 }}>{kpi.val}</p>
                      </div>
                    ))}
                  </div>
                  {/* Chart */}
                  <div className="h-12 rounded-lg p-1 relative" style={{ backgroundColor: `${color}04` }}>
                    <svg viewBox="0 0 120 40" className="w-full h-full">
                      <defs><linearGradient id={`dg3-${industryId}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" /><stop offset="100%" stopColor={color} stopOpacity="0" />
                      </linearGradient></defs>
                      <path d={`M0,35 ${sectorStyle.analyticsBars.map((b,i)=>`L${i*11},${40-b*0.35}`).join(' ')} L120,35 Z`} fill={`url(#dg3-${industryId})`} />
                      <path d={`M0,35 ${sectorStyle.analyticsBars.map((b,i)=>`L${i*11},${40-b*0.35}`).join(' ')}`} fill="none" stroke={color} strokeWidth="1.5" />
                    </svg>
                  </div>
                  {/* Activity */}
                  <div className="mt-1 space-y-[2px]">
                    {sectorStyle.activityFeed.map((item, i) => (
                      <div key={i} className="flex items-center gap-1 px-1 py-[3px] rounded text-[4px]" style={{ backgroundColor: `${color}04` }}>
                        <span className="text-[6px]">{item.icon}</span>
                        <span className="text-white/30 flex-1 truncate">{item.text}</span>
                        <span className="text-[3px] text-white/15">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ═══ ANALYTICS SCREEN — 4 variants ═══ */}
            {screen.type === "analytics" && (() => {
              if (v === 0) return (
                /* V0: Line chart + metric pills + bar chart */
                <div className="h-full p-2.5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <p className="text-[8px] font-bold text-white/80 tracking-wide">{sectorStyle.analyticsTitle}</p>
                  </div>
                  <div className="h-12 rounded-lg p-1.5 mb-1.5 relative overflow-hidden" style={{ backgroundColor: `${color}06`, border: `0.5px solid ${color}10` }}>
                    <svg viewBox="0 0 120 40" className="w-full h-full">
                      <defs><linearGradient id={`ag-${industryId}-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" /><stop offset="100%" stopColor={color} stopOpacity="0" />
                      </linearGradient></defs>
                      <path d={`M0,35 ${sectorStyle.analyticsBars.map((b, i) => `L${i * 11},${40 - b * 0.4}`).join(" ")} L120,35 Z`} fill={`url(#ag-${industryId}-${index})`} />
                      <path d={`M0,35 ${sectorStyle.analyticsBars.map((b, i) => `L${i * 11},${40 - b * 0.4}`).join(" ")}`} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="grid grid-cols-2 gap-1 mb-1.5">
                    {sectorStyle.analyticsMetrics.map((m, i) => (
                      <div key={i} className="p-1 rounded-md" style={{ backgroundColor: `${color}08`, border: `0.5px solid ${color}10` }}>
                        <p className="text-[4px] text-white/25 uppercase tracking-wider">{m.label}</p>
                        <div className="flex items-baseline gap-1">
                          <p className="text-[8px] font-bold" style={{ color }}>{m.val}</p>
                          <p className="text-[5px] text-emerald-400">{m.delta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="h-6 rounded-md flex items-end gap-[1.5px] p-1" style={{ backgroundColor: `${color}04` }}>
                    {sectorStyle.analyticsBars.map((h, i) => (
                      <motion.div key={i} className="flex-1 rounded-t-sm"
                        style={{ backgroundColor: `${sectorStyle.chartColors[i % sectorStyle.chartColors.length]}88` }}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.03, duration: 0.3 }} />
                    ))}
                  </div>
                </div>
              );

              if (v === 1) return (
                /* V1: Donut chart + ranked metrics */
                <div className="h-full p-2.5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <p className="text-[8px] font-bold text-white/80">{sectorStyle.analyticsTitle}</p>
                  </div>
                  {/* Donut chart */}
                  <div className="flex justify-center mb-2">
                    <div className="relative w-16 h-16">
                      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                        {[0.35, 0.25, 0.22, 0.18].map((pct, i) => {
                          const prevPcts = [0, 0.35, 0.6, 0.82];
                          return <circle key={i} cx="32" cy="32" r="24" fill="none" stroke={sectorStyle.chartColors[i % 3] || color} strokeWidth="6"
                            strokeDasharray={`${pct * 150.8} ${150.8}`} strokeDashoffset={`${-prevPcts[i] * 150.8}`} opacity={1 - i * 0.15} />;
                        })}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-[8px] font-black" style={{ color }}>{sectorStyle.kpis[3]?.val}</p>
                        <p className="text-[3px] text-white/20">Totale</p>
                      </div>
                    </div>
                  </div>
                  {/* Ranked metrics */}
                  {sectorStyle.analyticsMetrics.map((m, i) => (
                    <div key={i} className="flex items-center gap-1.5 mb-1">
                      <div className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: sectorStyle.chartColors[i % 3] }} />
                      <p className="text-[5px] text-white/40 flex-1">{m.label}</p>
                      <p className="text-[6px] font-bold" style={{ color }}>{m.val}</p>
                      <p className="text-[4px] text-emerald-400">{m.delta}</p>
                    </div>
                  ))}
                </div>
              );

              if (v === 2) return (
                /* V2: Heatmap grid + big numbers */
                <div className="h-full p-2.5">
                  <p className="text-[8px] font-bold text-white/80 mb-2">{sectorStyle.analyticsTitle}</p>
                  {/* Big number */}
                  <div className="text-center mb-2">
                    <p className="text-[16px] font-black" style={{ color }}>{sectorStyle.kpis[3]?.val}</p>
                    <p className="text-[5px] text-white/25">{sectorStyle.kpis[3]?.label} questo mese</p>
                  </div>
                  {/* Heatmap */}
                  <div className="grid grid-cols-7 gap-[2px] mb-2">
                    {sectorStyle.analyticsBars.concat(sectorStyle.analyticsBars.slice(0, 9)).map((b, i) => (
                      <motion.div key={i} className="aspect-square rounded-sm"
                        style={{ backgroundColor: `${color}${Math.round(b / 100 * 80).toString(16).padStart(2, '0')}` }}
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.02 }} />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {sectorStyle.analyticsMetrics.slice(0, 2).map((m, i) => (
                      <div key={i} className="flex-1 p-1.5 rounded-lg" style={{ backgroundColor: `${color}08` }}>
                        <p className="text-[4px] text-white/20">{m.label}</p>
                        <p className="text-[7px] font-bold" style={{ color }}>{m.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );

              /* V3: Stacked bars + comparison */
              return (
                <div className="h-full p-2.5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[8px] font-bold text-white/80">{sectorStyle.analyticsTitle}</p>
                    <div className="flex gap-1">
                      {["7g","30g"].map((p, i) => (
                        <span key={i} className="text-[4px] px-1.5 py-0.5 rounded-full font-bold"
                          style={i===0?{ backgroundColor: color, color: '#fff' }:{ backgroundColor: `${color}10`, color: `${color}60` }}>{p}</span>
                      ))}
                    </div>
                  </div>
                  {/* Stacked horizontal bars */}
                  {sectorStyle.analyticsMetrics.map((m, i) => (
                    <div key={i} className="mb-2">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-[5px] text-white/40">{m.label}</p>
                        <p className="text-[6px] font-bold" style={{ color }}>{m.val}</p>
                      </div>
                      <div className="h-[5px] rounded-full overflow-hidden flex" style={{ backgroundColor: `${color}08` }}>
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: sectorStyle.chartColors[i % 3] }}
                          initial={{ width: 0 }} whileInView={{ width: `${50 + i * 12}%` }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }} />
                      </div>
                      <p className="text-[4px] text-emerald-400 mt-0.5">{m.delta}</p>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* ═══ CRM / CLIENTS SCREEN — 4 variants ═══ */}
            {screen.type === "crm" && (() => {
              if (v === 0) return (
                /* V0: Avatar list */
                <div className="h-full p-2.5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <p className="text-[8px] font-bold text-white/80">CRM Clienti</p>
                    </div>
                    <div className="px-1.5 py-0.5 rounded-full text-[5px] font-bold" style={{ backgroundColor: `${color}20`, color }}>{sectorStyle.crmClients.length} attivi</div>
                  </div>
                  <div className="h-[16px] rounded-lg border px-2 flex items-center mb-1.5" style={{ backgroundColor: `${color}04`, borderColor: `${color}12` }}>
                    <span className="text-[5px] text-white/20">🔍 Cerca cliente...</span>
                  </div>
                  <div className="space-y-1">
                    {sectorStyle.crmClients.map((c, i) => (
                      <motion.div key={i} className="flex items-center gap-1.5 p-1.5 rounded-lg"
                        style={{ backgroundColor: sectorStyle.cardBg, border: `0.5px solid ${color}12` }}
                        initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.08 }}>
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[6px] font-bold text-white"
                          style={{ background: `linear-gradient(135deg, ${sectorStyle.chartColors[i % sectorStyle.chartColors.length]}, ${color})` }}>{c.name[0]}</div>
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
              );

              if (v === 1) return (
                /* V1: Grid cards */
                <div className="h-full p-2.5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[8px] font-bold text-white/80">Clienti</p>
                    <span className="text-[5px]" style={{ color }}>Vedi tutti →</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {sectorStyle.crmClients.map((c, i) => (
                      <motion.div key={i} className="p-2 rounded-xl text-center relative overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${color}${i===0?'15':'06'}, transparent)`, border: `0.5px solid ${color}15` }}
                        initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.08 }}>
                        <div className="w-7 h-7 rounded-full mx-auto mb-1 flex items-center justify-center text-[8px] font-bold text-white"
                          style={{ background: `linear-gradient(135deg, ${sectorStyle.chartColors[i % 3]}, ${color})` }}>{c.name[0]}</div>
                        <p className="text-[5px] font-semibold text-white/80 truncate">{c.name}</p>
                        <span className="text-[4px] px-1 py-[1px] rounded mt-0.5 inline-block" style={{ backgroundColor: `${color}15`, color: `${color}90` }}>{c.tag}</span>
                        <p className="text-[6px] font-bold mt-0.5" style={{ color }}>{c.spent}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );

              if (v === 2) return (
                /* V2: Compact table */
                <div className="h-full p-2.5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <p className="text-[8px] font-bold text-white/80">Anagrafica</p>
                  </div>
                  {/* Table header */}
                  <div className="flex items-center gap-1 px-1.5 py-1 mb-0.5">
                    <span className="text-[4px] text-white/20 flex-[2]">NOME</span>
                    <span className="text-[4px] text-white/20 flex-1 text-center">TIPO</span>
                    <span className="text-[4px] text-white/20 flex-1 text-right">VALORE</span>
                  </div>
                  {sectorStyle.crmClients.map((c, i) => (
                    <motion.div key={i} className="flex items-center gap-1 px-1.5 py-1.5 rounded-md mb-0.5"
                      style={{ backgroundColor: i % 2 === 0 ? `${color}06` : 'transparent' }}
                      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.06 }}>
                      <div className="flex items-center gap-1 flex-[2]">
                        <div className="w-3 h-3 rounded-full text-[4px] flex items-center justify-center font-bold text-white" style={{ backgroundColor: sectorStyle.chartColors[i % 3] }}>{c.name[0]}</div>
                        <p className="text-[5px] text-white/70 truncate">{c.name}</p>
                      </div>
                      <span className="text-[4px] flex-1 text-center px-1 py-[1px] rounded" style={{ color: `${color}90` }}>{c.tag}</span>
                      <p className="text-[5px] font-bold flex-1 text-right" style={{ color }}>{c.spent}</p>
                    </motion.div>
                  ))}
                </div>
              );

              /* V3: Timeline/activity view */
              return (
                <div className="h-full p-2.5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[8px] font-bold text-white/80">Clienti Recenti</p>
                    <span className="text-[5px] font-bold" style={{ color }}>{sectorStyle.crmClients.length}</span>
                  </div>
                  <div className="relative pl-3">
                    <div className="absolute left-1 top-0 bottom-0 w-[1px]" style={{ backgroundColor: `${color}15` }} />
                    {sectorStyle.crmClients.map((c, i) => (
                      <motion.div key={i} className="mb-2 relative"
                        initial={{ opacity: 0, x: -5 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.1 }}>
                        <div className="absolute -left-2 top-1 w-[6px] h-[6px] rounded-full border" style={{ borderColor: color, backgroundColor: i === 0 ? color : '#0a0a0a' }} />
                        <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${color}06`, border: `0.5px solid ${color}10` }}>
                          <div className="flex items-center justify-between">
                            <p className="text-[6px] font-bold text-white/80">{c.name}</p>
                            <p className="text-[5px] font-bold" style={{ color }}>{c.spent}</p>
                          </div>
                          <span className="text-[4px] px-1 py-[1px] rounded mt-0.5 inline-block" style={{ backgroundColor: `${color}12`, color: `${color}80` }}>{c.tag}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ═══ ORDERS SCREEN ═══ */}
            {screen.type === "orders" && (() => {
              const orderItems = [
                { id: "#1847", items: "2x " + (services[0]?.name || "Prodotto A"), total: "€" + ((services[0]?.price || 25) * 2), status: "in_prep", time: "2m", channel: "🪑 Tavolo 5" },
                { id: "#1846", items: "1x " + (services[1]?.name || "Prodotto B"), total: "€" + (services[1]?.price || 18), status: "ready", time: "8m", channel: "📱 Online" },
                { id: "#1845", items: "3x " + (services[2]?.name || "Prodotto C"), total: "€" + ((services[2]?.price || 12) * 3), status: "delivered", time: "22m", channel: "🛵 Delivery" },
                { id: "#1844", items: "1x " + (services[3]?.name || "Prodotto D"), total: "€" + (services[3]?.price || 30), status: "new", time: "ora", channel: "🪑 Tavolo 2" },
              ];
              const statusMap: Record<string, { label: string; bg: string; color: string }> = {
                new: { label: "Nuovo", bg: `${color}20`, color },
                in_prep: { label: "In prep.", bg: "#f59e0b20", color: "#f59e0b" },
                ready: { label: "Pronto", bg: "#22c55e20", color: "#22c55e" },
                delivered: { label: "Consegnato", bg: "#64748b20", color: "#64748b" },
              };
              return (
                <div className="h-full p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <p className="text-[7px] font-bold text-white/70">Ordini Live</p>
                    </div>
                    <motion.div className="px-1.5 py-0.5 rounded-full text-[5px] font-bold text-white" style={{ backgroundColor: color }}
                      animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      {orderItems.length} attivi
                    </motion.div>
                  </div>
                  <div className="flex gap-1 mb-1.5">
                    {["Tutti", "Nuovi", "In prep.", "Pronti"].map((t, i) => (
                      <div key={i} className="px-1.5 py-0.5 rounded-full text-[4px] font-bold"
                        style={i === 0 ? { backgroundColor: color, color: "#fff" } : { backgroundColor: `${color}08`, color: `${color}60` }}>{t}</div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {orderItems.map((o, i) => {
                      const st = statusMap[o.status] || statusMap.new;
                      return (
                        <motion.div key={i} className="p-1.5 rounded-lg"
                          style={{ backgroundColor: i === 0 ? `${color}10` : `${color}04`, border: `0.5px solid ${i === 0 ? `${color}20` : `${color}08`}` }}
                          initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.08 }}>
                          <div className="flex items-center justify-between mb-0.5">
                            <div className="flex items-center gap-1">
                              <span className="text-[5px] font-mono font-bold text-white/50">{o.id}</span>
                              <span className="text-[4px] text-white/25">{o.channel}</span>
                            </div>
                            <div className="px-1 py-[1px] rounded text-[4px] font-bold" style={{ backgroundColor: st.bg, color: st.color }}>{st.label}</div>
                          </div>
                          <p className="text-[5px] text-white/60 truncate">{o.items}</p>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="text-[6px] font-bold" style={{ color }}>{o.total}</span>
                            <span className="text-[3px] text-white/20">{o.time}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* ═══ REVIEWS SCREEN ═══ */}
            {screen.type === "reviews" && (() => {
              const reviewsList = [
                { name: "Marco R.", rating: 5, text: "Servizio eccellente, tornerò sicuramente!", time: "2h", source: "Google" },
                { name: "Sara L.", rating: 5, text: "Professionalità e qualità al top", time: "1g", source: "TripAdvisor" },
                { name: "Giovanni P.", rating: 4, text: "Molto bene, solo un po' di attesa", time: "2g", source: "Google" },
                { name: "Chiara M.", rating: 5, text: "Esperienza fantastica, consigliatissimo!", time: "3g", source: "Instagram" },
              ];
              return (
                <div className="h-full p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <p className="text-[7px] font-bold text-white/70">Recensioni</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <span className="text-[8px] font-black" style={{ color }}>4.9</span>
                      <span className="text-[6px] text-yellow-400">★</span>
                    </div>
                  </div>
                  {/* Rating bars */}
                  <div className="p-1.5 rounded-lg mb-1.5" style={{ backgroundColor: `${color}06`, border: `0.5px solid ${color}10` }}>
                    {[5, 4, 3, 2, 1].map(r => (
                      <div key={r} className="flex items-center gap-1 mb-0.5">
                        <span className="text-[4px] text-white/30 w-2">{r}★</span>
                        <div className="flex-1 h-[3px] rounded-full" style={{ backgroundColor: `${color}10` }}>
                          <div className="h-full rounded-full" style={{ backgroundColor: color, width: `${r === 5 ? 78 : r === 4 ? 18 : r === 3 ? 4 : 0}%` }} />
                        </div>
                        <span className="text-[3px] text-white/20 w-3 text-right">{r === 5 ? "78%" : r === 4 ? "18%" : r === 3 ? "4%" : "0%"}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {reviewsList.map((r, i) => (
                      <motion.div key={i} className="p-1.5 rounded-lg"
                        style={{ backgroundColor: `${color}${i === 0 ? '08' : '04'}`, border: `0.5px solid ${color}08` }}
                        initial={{ opacity: 0, y: 5 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.08 }}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[5px] font-bold text-white/70">{r.name}</span>
                          <div className="flex items-center gap-0.5">
                            <span className="text-[5px] text-yellow-400">{"★".repeat(r.rating)}</span>
                            <span className="text-[3px] text-white/20">{r.source}</span>
                          </div>
                        </div>
                        <p className="text-[4px] text-white/40 leading-relaxed">{r.text}</p>
                        <p className="text-[3px] text-white/15 mt-0.5">{r.time} fa</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ═══ LOYALTY SCREEN ═══ */}
            {screen.type === "loyalty" && (() => {
              return (
                <div className="h-full p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <p className="text-[7px] font-bold text-white/70">Fidelity Program</p>
                    </div>
                    <span className="text-[5px] font-bold" style={{ color }}>🎁 Attivo</span>
                  </div>
                  {/* Points card */}
                  <div className="p-2 rounded-xl mb-1.5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}20, ${color}08)`, border: `1px solid ${color}25` }}>
                    <div className="absolute top-0 right-0 w-12 h-12 rounded-full opacity-10" style={{ background: color, filter: "blur(12px)" }} />
                    <p className="text-[4px] text-white/30 uppercase tracking-wider">Punti Fedeltà</p>
                    <p className="text-[14px] font-black" style={{ color }}>2.450</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex-1 h-[4px] rounded-full" style={{ backgroundColor: `${color}15` }}>
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
                          initial={{ width: 0 }} whileInView={{ width: "72%" }} viewport={{ once: true }} transition={{ duration: 1 }} />
                      </div>
                      <span className="text-[4px] text-white/30">72%</span>
                    </div>
                    <p className="text-[4px] text-white/25 mt-0.5">550 punti al prossimo premio 🎁</p>
                  </div>
                  {/* Rewards */}
                  <p className="text-[4px] text-white/20 uppercase tracking-wider mb-1 font-bold">Premi Disponibili</p>
                  {[
                    { emoji: "☕", name: "Caffè omaggio", pts: "500", status: "available" },
                    { emoji: "🎂", name: "Dessert gratis", pts: "1.000", status: "available" },
                    { emoji: "💎", name: "Sconto 20%", pts: "2.000", status: "available" },
                    { emoji: "🌟", name: "Esperienza VIP", pts: "5.000", status: "locked" },
                  ].map((r, i) => (
                    <motion.div key={i} className="flex items-center gap-1.5 p-1 rounded-md mb-0.5"
                      style={{ backgroundColor: `${color}${r.status === 'locked' ? '03' : '06'}`, border: `0.5px solid ${color}${r.status === 'locked' ? '05' : '10'}` }}
                      initial={{ opacity: 0, x: -5 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.06 }}>
                      <span className="text-[8px]" style={{ opacity: r.status === 'locked' ? 0.3 : 1 }}>{r.emoji}</span>
                      <div className="flex-1">
                        <p className="text-[5px] font-semibold text-white/70">{r.name}</p>
                      </div>
                      <span className="text-[5px] font-bold" style={{ color: r.status === 'locked' ? `${color}40` : color }}>{r.pts} pt</span>
                    </motion.div>
                  ))}
                </div>
              );
            })()}

            {/* ═══ SOCIAL SCREEN ═══ */}
            {screen.type === "social" && (() => {
              return (
                <div className="h-full p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <p className="text-[7px] font-bold text-white/70">Social & Marketing</p>
                    </div>
                    <div className="px-1.5 py-0.5 rounded-full text-[4px] font-bold" style={{ backgroundColor: `${color}15`, color }}>+ Nuovo</div>
                  </div>
                  {/* Social stats */}
                  <div className="grid grid-cols-3 gap-1 mb-1.5">
                    {[
                      { platform: "📸", name: "IG", followers: "2.4K", growth: "+12%" },
                      { platform: "👍", name: "FB", followers: "1.8K", growth: "+5%" },
                      { platform: "🗺️", name: "Google", followers: "4.9★", growth: "+0.2" },
                    ].map((s, i) => (
                      <div key={i} className="p-1 rounded-md text-center" style={{ backgroundColor: `${color}06`, border: `0.5px solid ${color}08` }}>
                        <span className="text-[8px]">{s.platform}</span>
                        <p className="text-[6px] font-bold" style={{ color }}>{s.followers}</p>
                        <p className="text-[3px] text-emerald-400">{s.growth}</p>
                      </div>
                    ))}
                  </div>
                  {/* Scheduled posts */}
                  <p className="text-[4px] text-white/20 uppercase tracking-wider mb-1 font-bold">Post Programmati</p>
                  {[
                    { time: "Oggi 18:00", platform: "📸", text: "Novità della settimana! ✨", status: "scheduled" },
                    { time: "Dom 12:00", platform: "👍", text: "Promo weekend speciale 🔥", status: "draft" },
                    { time: "Lun 09:00", platform: "📸", text: "Buon inizio settimana! ☀️", status: "scheduled" },
                  ].map((p, i) => (
                    <motion.div key={i} className="flex items-center gap-1.5 p-1.5 rounded-md mb-0.5"
                      style={{ backgroundColor: `${color}${i === 0 ? '08' : '04'}`, border: `0.5px solid ${color}08` }}
                      initial={{ opacity: 0, y: 5 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.08 }}>
                      <span className="text-[8px]">{p.platform}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[5px] text-white/60 truncate">{p.text}</p>
                        <p className="text-[3px] text-white/25 mt-0.5">{p.time}</p>
                      </div>
                      <div className="px-1 py-[1px] rounded text-[3px] font-bold"
                        style={{ backgroundColor: p.status === 'scheduled' ? '#22c55e15' : `${color}10`, color: p.status === 'scheduled' ? '#22c55e' : `${color}60` }}>
                        {p.status === 'scheduled' ? '✓ Prog.' : 'Bozza'}
                      </div>
                    </motion.div>
                  ))}
                  {/* AI suggestion */}
                  <div className="mt-1 p-1.5 rounded-lg" style={{ background: `linear-gradient(135deg, ${color}08, ${color}04)`, border: `0.5px dashed ${color}20` }}>
                    <div className="flex items-center gap-1">
                      <span className="text-[6px]">🤖</span>
                      <p className="text-[4px] text-white/40">AI suggerisce: "Post sulla nuova stagione"</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ═══ INVENTORY SCREEN ═══ */}
            {screen.type === "inventory" && (() => {
              return (
                <div className="h-full p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <p className="text-[7px] font-bold text-white/70">Inventario</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
                      <span className="text-[4px] text-white/30">3 alert</span>
                    </div>
                  </div>
                  {/* Summary */}
                  <div className="grid grid-cols-3 gap-1 mb-1.5">
                    {[
                      { label: "Prodotti", val: "248", icon: "📦" },
                      { label: "In esaur.", val: "7", icon: "⚠️" },
                      { label: "Valore", val: "€12K", icon: "💰" },
                    ].map((s, i) => (
                      <div key={i} className="p-1 rounded-md text-center" style={{ backgroundColor: `${color}06`, border: `0.5px solid ${color}08` }}>
                        <span className="text-[6px]">{s.icon}</span>
                        <p className="text-[7px] font-bold" style={{ color }}>{s.val}</p>
                        <p className="text-[3px] text-white/25">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  {/* Stock items */}
                  <p className="text-[4px] text-white/20 uppercase tracking-wider mb-1 font-bold">⚠️ Scorte Basse</p>
                  {[
                    { name: services[0]?.name || "Prodotto A", stock: 3, min: 10, trend: "↓" },
                    { name: services[1]?.name || "Prodotto B", stock: 5, min: 15, trend: "↓" },
                    { name: services[2]?.name || "Prodotto C", stock: 8, min: 20, trend: "→" },
                  ].map((item, i) => (
                    <motion.div key={i} className="flex items-center gap-1.5 p-1 rounded-md mb-0.5"
                      style={{ backgroundColor: i === 0 ? '#ef444408' : `${color}04`, border: `0.5px solid ${i === 0 ? '#ef444415' : `${color}06`}` }}
                      initial={{ opacity: 0, x: -5 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.06 }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-[5px] font-semibold text-white/60 truncate">{item.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="flex-1 h-[3px] rounded-full" style={{ backgroundColor: `${color}10` }}>
                            <div className="h-full rounded-full" style={{ backgroundColor: item.stock <= 5 ? '#ef4444' : '#f59e0b', width: `${(item.stock / item.min) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[6px] font-bold" style={{ color: item.stock <= 5 ? '#ef4444' : '#f59e0b' }}>{item.stock}</span>
                        <span className="text-[4px] text-white/20">/{item.min}</span>
                      </div>
                    </motion.div>
                  ))}
                  {/* Recent movements */}
                  <p className="text-[4px] text-white/15 uppercase tracking-wider mt-1.5 mb-0.5 font-bold">Ultimi Movimenti</p>
                  {[
                    { text: "Carico #234 ricevuto", type: "+", time: "1h" },
                    { text: "Scarico cucina", type: "-", time: "3h" },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center gap-1 py-0.5 text-[4px]">
                      <span className="font-bold" style={{ color: m.type === '+' ? '#22c55e' : '#ef4444' }}>{m.type}</span>
                      <span className="text-white/35 flex-1 truncate">{m.text}</span>
                      <span className="text-white/15">{m.time}</span>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* ═══ STAFF SCREEN ═══ */}
            {screen.type === "staff" && (() => {
              const staffList = [
                { name: "Mario R.", role: "Manager", status: "online", hours: "8h", avatar: "👨‍💼" },
                { name: "Laura B.", role: "Operatore", status: "online", hours: "6h", avatar: "👩‍🔧" },
                { name: "Giuseppe F.", role: "Assistente", status: "break", hours: "4h", avatar: "👨‍🍳" },
                { name: "Anna M.", role: "Stagista", status: "offline", hours: "—", avatar: "👩‍💻" },
              ];
              return (
                <div className="h-full p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <p className="text-[7px] font-bold text-white/70">Team</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-[4px] text-white/30">3 online</span>
                    </div>
                  </div>
                  {/* Today summary */}
                  <div className="grid grid-cols-3 gap-1 mb-1.5">
                    {[
                      { label: "Presenti", val: "3/4", color: "#22c55e" },
                      { label: "Ore Oggi", val: "18h", color },
                      { label: "Produttività", val: "94%", color },
                    ].map((s, i) => (
                      <div key={i} className="p-1 rounded-md text-center" style={{ backgroundColor: `${color}06`, border: `0.5px solid ${color}08` }}>
                        <p className="text-[7px] font-bold" style={{ color: s.color }}>{s.val}</p>
                        <p className="text-[3px] text-white/25">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  {/* Staff list */}
                  <div className="space-y-0.5">
                    {staffList.map((s, i) => (
                      <motion.div key={i} className="flex items-center gap-1.5 p-1.5 rounded-lg"
                        style={{ backgroundColor: `${color}${s.status === 'online' ? '06' : '03'}`, border: `0.5px solid ${color}06` }}
                        initial={{ opacity: 0, y: 4 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.06 }}>
                        <div className="relative">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px]" style={{ backgroundColor: `${color}15` }}>{s.avatar}</div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-black"
                            style={{ backgroundColor: s.status === 'online' ? '#22c55e' : s.status === 'break' ? '#f59e0b' : '#64748b' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[5px] font-semibold text-white/70">{s.name}</p>
                          <p className="text-[3px] text-white/25">{s.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[5px] font-bold" style={{ color }}>{s.hours}</p>
                          <p className="text-[3px] capitalize" style={{ color: s.status === 'online' ? '#22c55e' : s.status === 'break' ? '#f59e0b' : '#64748b' }}>{s.status}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {/* Shift bar */}
                  <div className="mt-1.5 p-1 rounded-md" style={{ backgroundColor: `${color}04` }}>
                    <p className="text-[3px] text-white/20 mb-0.5 font-bold uppercase">Turni Oggi</p>
                    <div className="flex gap-[1px]">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="flex-1 h-[6px] rounded-sm" style={{ backgroundColor: i >= 2 && i <= 9 ? `${color}${i <= 7 ? '30' : '15'}` : `${color}05` }} />
                      ))}
                    </div>
                    <div className="flex justify-between mt-0.5">
                      <span className="text-[3px] text-white/15">08:00</span>
                      <span className="text-[3px] text-white/15">20:00</span>
                    </div>
                  </div>
                </div>
              );
            })()}


            {screen.type === "notifications" && (() => {
              if (v === 0) return (
                /* V0: Standard list */
                <div className="h-full p-2.5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <p className="text-[8px] font-bold text-white/80">Notifiche</p>
                    </div>
                    <motion.div className="w-4 h-4 rounded-full flex items-center justify-center text-[6px] font-bold text-white"
                      style={{ backgroundColor: color }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                      {sectorStyle.notifications.length}
                    </motion.div>
                  </div>
                  <div className="space-y-1">
                    {sectorStyle.notifications.map((n, i) => (
                      <motion.div key={i} className="flex items-start gap-1.5 p-1.5 rounded-lg relative"
                        style={{ backgroundColor: i === 0 ? `${color}12` : `${color}06`, border: `0.5px solid ${i === 0 ? `${color}25` : `${color}08`}` }}
                        initial={{ opacity: 0, y: 5 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.1 }}>
                        <span className="text-[8px]">{n.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[6px] font-semibold text-white/80">{n.text}</p>
                          <p className="text-[4px] text-white/25 mt-0.5">{n.time} fa</p>
                        </div>
                        {i === 0 && <div className="w-1 h-1 rounded-full mt-0.5" style={{ backgroundColor: color }} />}
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-1">
                    {["Leggi tutto", "Impostazioni"].map((a, i) => (
                      <div key={i} className="flex-1 py-1 rounded-md text-center text-[5px] font-bold"
                        style={i === 0 ? { backgroundColor: color, color: "#fff" } : { backgroundColor: `${color}10`, color: `${color}90` }}>{a}</div>
                    ))}
                  </div>
                </div>
              );

              if (v === 1) return (
                /* V1: Timeline with vertical line */
                <div className="h-full p-2.5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[8px] font-bold text-white/80">Aggiornamenti</p>
                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-[6px] font-bold text-white" style={{ backgroundColor: color }}>
                      {sectorStyle.notifications.length}
                    </div>
                  </div>
                  <div className="relative pl-4">
                    <div className="absolute left-1 top-0 bottom-0 w-[2px] rounded-full" style={{ background: `linear-gradient(180deg, ${color}, ${color}20, transparent)` }} />
                    {sectorStyle.notifications.map((n, i) => (
                      <motion.div key={i} className="mb-2.5 relative"
                        initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.12 }}>
                        <div className="absolute -left-3 top-1.5 w-2 h-2 rounded-full flex items-center justify-center text-[6px]" 
                          style={{ backgroundColor: i === 0 ? color : `${color}30`, boxShadow: i === 0 ? `0 0 6px ${color}50` : 'none' }}>
                        </div>
                        <p className="text-[6px] font-semibold text-white/80">{n.icon} {n.text}</p>
                        <p className="text-[4px] text-white/20 mt-0.5">{n.time} fa</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );

              if (v === 2) return (
                /* V2: Grouped by priority with badges */
                <div className="h-full p-2.5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <p className="text-[8px] font-bold text-white/80">Notifiche</p>
                    <div className="flex-1" />
                    <motion.div className="px-1.5 py-0.5 rounded-full text-[5px] font-bold text-white" style={{ backgroundColor: color }}
                      animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      {sectorStyle.notifications.length} nuove
                    </motion.div>
                  </div>
                  {/* Priority sections */}
                  <div className="mb-1.5">
                    <p className="text-[4px] text-white/20 uppercase tracking-wider mb-1 font-bold">● Urgenti</p>
                    {sectorStyle.notifications.slice(0, 2).map((n, i) => (
                      <motion.div key={i} className="flex items-center gap-1.5 p-1.5 rounded-xl mb-1"
                        style={{ background: `linear-gradient(135deg, ${color}15, ${color}06)`, border: `1px solid ${color}25` }}
                        initial={{ opacity: 0, y: 5 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.08 }}>
                        <span className="text-[10px]">{n.icon}</span>
                        <div className="flex-1"><p className="text-[6px] font-bold text-white/85">{n.text}</p></div>
                        <span className="text-[4px] text-white/20">{n.time}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div>
                    <p className="text-[4px] text-white/15 uppercase tracking-wider mb-1 font-bold">○ Precedenti</p>
                    {sectorStyle.notifications.slice(2).map((n, i) => (
                      <div key={i} className="flex items-center gap-1.5 p-1 rounded-md mb-0.5" style={{ backgroundColor: `${color}04` }}>
                        <span className="text-[7px]">{n.icon}</span>
                        <p className="text-[5px] text-white/50 flex-1 truncate">{n.text}</p>
                        <span className="text-[3px] text-white/15">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );

              /* V3: Card stack with swipe hints */
              return (
                <div className="h-full p-2.5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <p className="text-[8px] font-bold text-white/80">Centro Notifiche</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {sectorStyle.notifications.map((n, i) => (
                      <motion.div key={i} className="p-2 rounded-xl relative overflow-hidden"
                        style={{ background: `linear-gradient(${90 + i * 45}deg, ${color}${['12','08','06','04'][i]}, transparent)`, border: `0.5px solid ${color}${i === 0 ? '20' : '08'}` }}
                        initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.12 }}>
                        <div className="flex items-start gap-1.5">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px]" style={{ backgroundColor: `${color}15` }}>{n.icon}</div>
                          <div className="flex-1">
                            <p className="text-[6px] font-semibold text-white/85">{n.text}</p>
                            <p className="text-[4px] text-white/20 mt-0.5">{n.time} fa</p>
                          </div>
                        </div>
                        {i === 0 && <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-bl-md" style={{ backgroundColor: color }} />}
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ═══ SETTINGS SCREEN — 4 variants ═══ */}
            {screen.type === "settings" && (() => {
              if (v === 0) return (
                /* V0: Classic toggle list */
                <div className="h-full p-2.5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <p className="text-[8px] font-bold text-white/80">Impostazioni</p>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded-lg mb-2" style={{ backgroundColor: `${color}08`, border: `0.5px solid ${color}12` }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                      style={{ background: `linear-gradient(135deg, ${color}, ${sectorStyle.chartColors[1] || color})` }}>{sectorStyle.serviceIcon}</div>
                    <div>
                      <p className="text-[7px] font-bold text-white/80">Il Mio Business</p>
                      <p className="text-[5px] text-white/30">Piano Premium · Attivo</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {sectorStyle.settingsToggles.map((t, i) => (
                      <div key={i} className="flex items-center justify-between p-1.5 rounded-md" style={{ backgroundColor: `${color}04`, border: `0.5px solid ${color}08` }}>
                        <span className="text-[6px] text-white/60">{t.label}</span>
                        <div className="w-5 h-3 rounded-full relative" style={{ backgroundColor: t.on ? color : "rgba(255,255,255,0.1)" }}>
                          <motion.div className="absolute top-[1.5px] w-[9px] h-[9px] rounded-full bg-white shadow-sm" style={{ left: t.on ? 9 : 1.5 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-1.5 flex items-center justify-center gap-1">
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "#22c55e" }} />
                    <span className="text-[4px] text-white/20">Empire v3.2 · Tutti i sistemi attivi</span>
                  </div>
                </div>
              );

              if (v === 1) return (
                /* V1: Grid icons */
                <div className="h-full p-2.5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px]" style={{ background: `linear-gradient(135deg, ${color}, ${sectorStyle.chartColors[1] || color})` }}>{sectorStyle.serviceIcon}</div>
                    <div>
                      <p className="text-[7px] font-bold text-white/80">Settings</p>
                      <p className="text-[4px] text-white/25">Configura il tuo business</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 mb-2">
                    {sectorStyle.settingsToggles.slice(0, 6).map((t, i) => (
                      <motion.div key={i} className="p-1.5 rounded-xl text-center relative"
                        style={{ backgroundColor: `${color}${t.on ? '12' : '04'}`, border: `0.5px solid ${color}${t.on ? '20' : '08'}` }}
                        initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.05 }}>
                        <div className="w-4 h-4 rounded-full mx-auto mb-0.5 flex items-center justify-center text-[6px]"
                          style={{ backgroundColor: t.on ? `${color}30` : 'rgba(255,255,255,0.05)' }}>
                          {["⚙️","🔔","💳","📊","🔒","✨"][i]}
                        </div>
                        <p className="text-[4px] text-white/50 truncate">{t.label}</p>
                        {t.on && <div className="absolute top-1 right-1 w-1 h-1 rounded-full" style={{ backgroundColor: '#22c55e' }} />}
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${color}06`, border: `0.5px solid ${color}08` }}>
                    <p className="text-[5px] text-white/30 mb-1">Piano attivo</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[6px] font-bold" style={{ color }}>Premium</span>
                      <span className="text-[4px] text-white/20">v3.2</span>
                    </div>
                  </div>
                </div>
              );

              if (v === 2) return (
                /* V2: Sectioned cards */
                <div className="h-full p-2.5">
                  <p className="text-[8px] font-bold text-white/80 mb-2">Configurazione</p>
                  {/* Account section */}
                  <div className="p-1.5 rounded-xl mb-1.5" style={{ background: `linear-gradient(135deg, ${color}10, ${color}04)`, border: `0.5px solid ${color}15` }}>
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]" style={{ background: `${color}25` }}>{sectorStyle.serviceIcon}</div>
                      <div className="flex-1">
                        <p className="text-[6px] font-bold text-white/80">{sectorStyle.heroSubtext}</p>
                        <p className="text-[4px] text-white/25">Premium · Attivo</p>
                      </div>
                      <span className="text-[5px]" style={{ color }}>›</span>
                    </div>
                  </div>
                  {/* Feature sections */}
                  <p className="text-[4px] text-white/20 uppercase tracking-wider mb-1 font-bold">Funzionalità</p>
                  {sectorStyle.settingsToggles.slice(0, 4).map((t, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: `${color}06` }}>
                      <span className="text-[5px] text-white/50">{t.label}</span>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.on ? '#22c55e' : '#ef4444' }} />
                        <span className="text-[4px] text-white/20">{t.on ? 'On' : 'Off'}</span>
                      </div>
                    </div>
                  ))}
                  <div className="mt-2 text-center">
                    <span className="text-[4px] text-white/15">Empire v3.2</span>
                  </div>
                </div>
              );

              /* V3: Dark minimal with accent */
              return (
                <div className="h-full p-2.5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[9px] font-black text-white/90">Settings</p>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px]" style={{ background: `${color}15` }}>{sectorStyle.serviceIcon}</div>
                  </div>
                  {sectorStyle.settingsToggles.map((t, i) => (
                    <motion.div key={i} className="flex items-center justify-between py-2 border-b" style={{ borderColor: `${color}06` }}
                      initial={{ opacity: 0, x: -5 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.06 }}>
                      <div className="flex items-center gap-1.5">
                        <div className="w-[3px] h-4 rounded-full" style={{ backgroundColor: t.on ? color : `${color}15` }} />
                        <span className="text-[6px] text-white/60">{t.label}</span>
                      </div>
                      <div className="w-6 h-3.5 rounded-full relative cursor-pointer" style={{ backgroundColor: t.on ? color : "rgba(255,255,255,0.06)" }}>
                        <div className="absolute top-[2px] w-[10px] h-[10px] rounded-full bg-white shadow-md transition-all" style={{ left: t.on ? 11 : 2 }} />
                      </div>
                    </motion.div>
                  ))}
                  <div className="mt-3 p-1.5 rounded-xl text-center" style={{ backgroundColor: `${color}04` }}>
                    <p className="text-[4px] text-white/20">Piano <span style={{ color }} className="font-bold">Premium</span> · Empire v3.2</p>
                  </div>
                </div>
              );
            })()}

            {/* Screen overlay glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 30%, ${color}08 0%, transparent 60%)` }} />

            {/* iOS-style bottom tab bar — shows on dashboard-like screens */}
            {["dashboard","analytics","crm","notifications","settings","inventory","staff","social","loyalty","reviews"].includes(screen.type) && (
              <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 60%, transparent 100%)", backdropFilter: "blur(12px)" }}>
                <div className="flex items-center justify-around px-1 pt-1.5 pb-1">
                  {[
                    { icon: "🏠", label: "Home", active: screen.type === "dashboard" },
                    { icon: "📊", label: "Analytics", active: screen.type === "analytics" },
                    { icon: "👥", label: "Clienti", active: screen.type === "crm" },
                    { icon: "🔔", label: "Alert", active: screen.type === "notifications" },
                    { icon: "⚙️", label: "Menu", active: screen.type === "settings" },
                  ].map((tab, i) => (
                    <div key={i} className="flex flex-col items-center gap-[1px]">
                      <span className="text-[7px]" style={{ opacity: tab.active ? 1 : 0.4 }}>{tab.icon}</span>
                      <span className="text-[3px] font-medium" style={{ color: tab.active ? color : "rgba(255,255,255,0.3)" }}>{tab.label}</span>
                      {tab.active && <div className="w-1 h-[1px] rounded-full mt-[1px]" style={{ backgroundColor: color }} />}
                    </div>
                  ))}
                </div>
              </div>
            )}
            </>)}
            </div>

            {/* Home indicator bar */}
            <div className="flex justify-center py-1.5">
              <div className="w-9 h-[3px] rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </div>
      </MockupLightbox>

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
  { label: "Ordini", type: "orders", desc: "Gestione ordini live" },
  { label: "Analytics", type: "analytics", desc: "Grafici & trend" },
  { label: "Clienti", type: "crm", desc: "CRM & contatti" },
  { label: "Recensioni", type: "reviews", desc: "Feedback & reputazione" },
  { label: "Fidelity", type: "loyalty", desc: "Programma fedeltà" },
  { label: "Social", type: "social", desc: "Marketing & social" },
  { label: "Inventario", type: "inventory", desc: "Magazzino & scorte" },
  { label: "Team", type: "staff", desc: "Gestione personale" },
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
  const [activeIdx, setActiveIdx] = useState(Math.floor(SCREENS.length / 2));
  const [showAll, setShowAll] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  // Helper: compute visual props based on distance from active
  const getPhoneStyle = (i: number, total: number, active: number) => {
    // Calculate shortest circular distance
    let dist = i - active;
    if (dist > total / 2) dist -= total;
    if (dist < -total / 2) dist += total;
    const absDist = Math.abs(dist);

    if (absDist > 3) {
      return { scale: 0.85, opacity: 1, rotateY: 0, zIndex: 0 };
    }

    const configs: Record<number, { scale: number; opacity: number; rotateY: number; zIndex: number }> = {
      0: { scale: 1.1, opacity: 1, rotateY: 0, zIndex: 10 },
      1: { scale: 1.0, opacity: 1, rotateY: dist > 0 ? -2 : 2, zIndex: 5 },
      2: { scale: 0.95, opacity: 1, rotateY: dist > 0 ? -4 : 4, zIndex: 3 },
      3: { scale: 0.9, opacity: 1, rotateY: dist > 0 ? -6 : 6, zIndex: 1 },
    };

    return configs[absDist] || configs[3];
  };

  // Auto-scroll
  useEffect(() => {
    if (!isPlaying || showAll) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % SCREENS.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, showAll]);

  useEffect(() => {
    if (!scrollRef.current || showAll) return;
    const el = scrollRef.current;
    const child = el.children[activeIdx] as HTMLElement;
    if (child) {
      el.scrollTo({ left: child.offsetLeft - el.offsetWidth / 2 + child.offsetWidth / 2, behavior: "smooth" });
    }
  }, [activeIdx, showAll]);

  return (
    <div className={`${className}`}>
      {/* Desktop: horizontal scroll with 3D perspective showcase */}
      <div
        className={`hidden sm:block relative ${compact ? "scale-[0.85] origin-center" : ""}`}
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        <div className="overflow-x-auto pb-3 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          <div className="flex items-end gap-3 min-w-max justify-center px-2" style={{ perspective: "1200px" }}>
            {SCREENS.map((screen, i) => {
              const style = getPhoneStyle(i, SCREENS.length, activeIdx);
              return (
                <div
                  key={screen.type}
                  className="transition-all duration-500 ease-in-out cursor-pointer"
                  style={{
                    transform: `scale(${style.scale}) rotateY(${style.rotateY}deg)`,
                    opacity: style.opacity,
                    zIndex: style.zIndex,
                    filter: "none",
                  }}
                  onClick={() => { setActiveIdx(i); setIsPlaying(false); }}
                >
                  <IPhoneFrame
                    key={screen.type}
                    screen={screen}
                    color={color}
                    emoji={cfg.emoji}
                    companyName={demo.companyName}
                    services={demo.services}
                    index={i}
                    sectorStyle={sectorStyle}
                    industryId={industryId}
                    totalCount={SCREENS.length}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {/* Desktop dots */}
        <div className="flex justify-center gap-1.5 mt-2">
          {SCREENS.map((_, i) => (
            <button key={i} onClick={() => { setActiveIdx(i); setIsPlaying(false); }}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{ backgroundColor: i === activeIdx ? color : `${color}30`, transform: i === activeIdx ? "scale(1.3)" : "scale(1)" }} />
          ))}
        </div>
      </div>

      {/* Mobile: carousel OR full grid */}
      <div className="sm:hidden relative">
        {showAll ? (
          <motion.div
            className="grid grid-cols-2 gap-3 px-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {SCREENS.map((screen, i) => (
              <motion.div
                key={screen.type}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <IPhoneFrame
                  screen={screen}
                  color={color}
                  emoji={cfg.emoji}
                  companyName={demo.companyName}
                  services={demo.services}
                  index={i}
                  sectorStyle={sectorStyle}
                  industryId={industryId}
                  totalCount={SCREENS.length}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div ref={scrollRef} className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide px-4 items-center"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none", perspective: "1200px" }}
            onTouchStart={() => setIsPlaying(false)}
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(true)}>
            {SCREENS.map((screen, i) => {
              const style = getPhoneStyle(i, SCREENS.length, activeIdx);
              return (
                <div
                  key={screen.type}
                  className="snap-center flex-shrink-0 transition-all duration-500 ease-in-out"
                  style={{
                    width: "32vw",
                    maxWidth: 120,
                    transform: `scale(${style.scale}) rotateY(${style.rotateY}deg)`,
                    filter: "none",
                    opacity: style.opacity,
                    zIndex: style.zIndex,
                  }}
                  onClick={() => { setActiveIdx(i); setIsPlaying(false); }}
                >
                  <IPhoneFrame
                    screen={screen}
                    color={color}
                    emoji={cfg.emoji}
                    companyName={demo.companyName}
                    services={demo.services}
                    index={i}
                    sectorStyle={sectorStyle}
                    industryId={industryId}
                    totalCount={SCREENS.length}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mt-2">
          {!showAll && (
            <div className="flex gap-1.5">
              {SCREENS.map((_, i) => (
                <button key={i} onClick={() => { setActiveIdx(i); setIsPlaying(false); }}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{ backgroundColor: i === activeIdx ? color : `${color}30`, transform: i === activeIdx ? "scale(1.3)" : "scale(1)" }} />
              ))}
            </div>
          )}
          {!showAll && (
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
          )}
          <button
            onClick={() => { setShowAll(!showAll); setIsPlaying(false); }}
            className="px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase border transition-all"
            style={{
              borderColor: `${color}40`,
              color: showAll ? "#fff" : `${color}`,
              background: showAll ? `${color}` : `${color}10`,
            }}
          >
            {showAll ? "Carosello ←" : "Vedi Tutte →"}
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
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${cfg.defaultPrimaryColor}15`, border: `1px solid ${cfg.defaultPrimaryColor}20` }}>
            {(() => { const Icon = SECTOR_ICONS[industryId]; return Icon ? <Icon className="w-5 h-5" style={{ color: cfg.defaultPrimaryColor }} /> : <span className="text-xl">{cfg.emoji}</span>; })()}
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

const SECTOR_CATEGORIES: { label: string; emoji: string; ids: IndustryId[] }[] = [
  { label: "Ristorazione", emoji: "🍽️", ids: ["food", "agriturismo"] as IndustryId[] },
  { label: "Trasporti", emoji: "🚗", ids: ["ncc", "logistics"] },
  { label: "Benessere", emoji: "💆", ids: ["beauty", "fitness", "tattoo"] },
  { label: "Salute", emoji: "🏥", ids: ["healthcare", "veterinary"] },
  { label: "Ospitalità", emoji: "🏨", ids: ["hospitality", "beach"] },
  { label: "Commercio", emoji: "🛍️", ids: ["retail"] },
  { label: "Servizi Tecnici", emoji: "🔧", ids: ["plumber", "electrician", "construction", "gardening", "cleaning", "garage"] },
  { label: "Professionisti", emoji: "⚖️", ids: ["legal", "accounting", "photography"] },
  { label: "Educazione & Famiglia", emoji: "👶", ids: ["childcare", "education"] },
  { label: "Eventi & Custom", emoji: "🎉", ids: ["events", "custom"] },
];

export function AllIndustriesShowcase({ onViewDemo }: { onViewDemo?: (id: IndustryId, slug: string) => void }) {
  const [openSector, setOpenSector] = useState<IndustryId | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const allIds = Object.keys(INDUSTRY_CONFIGS) as IndustryId[];

  const filteredIds = allIds.filter(id => {
    const cfg = INDUSTRY_CONFIGS[id];
    const matchesSearch = !search ||
      cfg.label.toLowerCase().includes(search.toLowerCase()) ||
      cfg.description.toLowerCase().includes(search.toLowerCase());
    if (activeCategory) {
      const cat = SECTOR_CATEGORIES.find(c => c.label === activeCategory);
      return matchesSearch && cat?.ids.includes(id);
    }
    return matchesSearch;
  });

  const grouped = activeCategory
    ? [{ label: activeCategory, emoji: SECTOR_CATEGORIES.find(c => c.label === activeCategory)?.emoji || "", ids: filteredIds }]
    : SECTOR_CATEGORIES.map(cat => ({
        ...cat,
        ids: cat.ids.filter(id => filteredIds.includes(id)),
      })).filter(cat => cat.ids.length > 0);

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cerca settore..."
          className="w-full px-4 py-2.5 pl-9 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/25 transition-colors"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${!activeCategory ? "bg-white/15 text-white border border-white/20" : "bg-white/[0.04] text-white/50 border border-white/[0.06]"}`}
        >
          Tutti ({allIds.length})
        </button>
        {SECTOR_CATEGORIES.map(cat => {
          const count = cat.ids.filter(id => {
            const cfg = INDUSTRY_CONFIGS[id];
            return !search || cfg.label.toLowerCase().includes(search.toLowerCase()) || cfg.description.toLowerCase().includes(search.toLowerCase());
          }).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${activeCategory === cat.label ? "bg-white/15 text-white border border-white/20" : "bg-white/[0.04] text-white/50 border border-white/[0.06]"}`}
            >
              {cat.emoji} {cat.label} ({count})
            </button>
          );
        })}
      </div>

      <p className="text-[10px] text-white/30 px-1">{filteredIds.length} settori{search ? ` per "${search}"` : ""}</p>

      {/* Accordion */}
      {grouped.map(cat => (
        <div key={cat.label} className="space-y-1.5">
          {!activeCategory && (
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1 pt-2">
              {cat.emoji} {cat.label}
            </p>
          )}
          {cat.ids.map(id => {
            const cfg = INDUSTRY_CONFIGS[id];
            const demo = DEMO_INDUSTRY_DATA[id];
            const slug = DEMO_SLUGS[id];
            const isOpen = openSector === id;

            return (
              <motion.div
                key={id}
                className="rounded-2xl border overflow-hidden transition-colors"
                style={{
                  borderColor: isOpen ? `${cfg.defaultPrimaryColor}30` : "rgba(255,255,255,0.06)",
                  background: isOpen
                    ? `linear-gradient(135deg, ${cfg.defaultPrimaryColor}08, rgba(255,255,255,0.02))`
                    : "rgba(255,255,255,0.015)",
                }}
                layout
              >
                <button
                  onClick={() => setOpenSector(isOpen ? null : id)}
                  className="w-full flex items-center gap-3 p-3.5 active:scale-[0.98] transition-transform"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${cfg.defaultPrimaryColor}15`, border: `1px solid ${cfg.defaultPrimaryColor}20` }}
                  >
                    {(() => { const Icon = SECTOR_ICONS[id]; return Icon ? <Icon className="w-5 h-5" style={{ color: cfg.defaultPrimaryColor }} /> : <span className="text-lg">{cfg.emoji}</span>; })()}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-bold text-white truncate">{cfg.label}</p>
                    <p className="text-[10px] text-white/35 truncate">{demo?.companyName || cfg.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {onViewDemo && (
                      <motion.span
                        onClick={(e) => { e.stopPropagation(); onViewDemo(id, slug); }}
                        className="px-3 py-1.5 rounded-lg text-[9px] font-bold border border-white/10 text-white/60 hover:bg-white/5 transition-colors"
                        whileTap={{ scale: 0.95 }}
                      >
                        Demo →
                      </motion.span>
                    )}
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: isOpen ? `${cfg.defaultPrimaryColor}20` : "rgba(255,255,255,0.05)" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/60">
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-4">
                        <IndustryPhoneShowcase industryId={id} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      ))}

      {filteredIds.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-white/40">Nessun settore trovato</p>
          <button onClick={() => { setSearch(""); setActiveCategory(null); }} className="text-xs text-primary mt-2">
            Resetta filtri
          </button>
        </div>
      )}
    </div>
  );
}
