import { ReactNode } from "react";
import {
  Activity,
  BatteryFull,
  BedDouble,
  Bell,
  Building2,
  Calendar,
  Car,
  Check,
  CheckCheck,
  Clock,
  Dumbbell,
  Flame,
  Home,
  MapPin,
  MessageCircle,
  Plus,
  Scissors,
  Search,
  Send,
  Shield,
  ShoppingBag,
  Signal,
  Sparkles,
  Star,
  TrendingUp,
  Utensils,
  Waves,
  Wifi,
} from "lucide-react";
import type { PhoneView } from "./PrestigePhone";

import restaurantHero from "@/assets/empire-mockups/restaurant-hero.jpg";
import restaurantDish from "@/assets/empire-mockups/restaurant-dish.jpg";
import sushiHero from "@/assets/empire-mockups/sushi-hero.jpg";
import sushiDish from "@/assets/empire-mockups/sushi-detail.jpg";
import nccHero from "@/assets/empire-mockups/ncc-hero.jpg";
import nccDetail from "@/assets/empire-mockups/ncc-detail.jpg";
import beautyHero from "@/assets/empire-mockups/beauty-hero.jpg";
import beautyDish from "@/assets/empire-mockups/beauty-dish.jpg";
import hospitalityHero from "@/assets/empire-mockups/hospitality-hero.jpg";
import hospitalityDetail from "@/assets/empire-mockups/hospitality-detail.jpg";
import fitnessHero from "@/assets/empire-mockups/fitness-hero.jpg";
import fitnessDish from "@/assets/empire-mockups/fitness-dish.jpg";
import realestateHero from "@/assets/empire-mockups/realestate-hero.jpg";
import realestateDish from "@/assets/empire-mockups/realestate-dish.jpg";

export type EmpireSector = "restaurant" | "sushi" | "ncc" | "beauty" | "hospitality" | "fitness" | "realestate";

type IconType = typeof Home;

interface SectorPalette {
  bg: string;
  bg2: string;
  surface: string;
  surface2: string;
  line: string;
  text: string;
  muted: string;
  accent: string;
  accent2: string;
  accentText: string;
  glow: string;
  heroVeil: string;
  bubble: string;
  inbound: string;
  // Style DNA — unique per sector
  font: string;          // heading font-family
  uiFont: string;        // body / UI font-family
  radius: number;        // base corner radius (px) for hero/cards
  radiusSmall: number;   // chips / pills
  texture: string;       // CSS background-image overlay (subtle pattern)
  shadow: string;        // signature box-shadow for hero
  badgeShape: "pill" | "square" | "cut"; // signature label
  chartStyle: "bars" | "line" | "dots";
  tracking: string;      // letter-spacing default for uppercase labels
}

interface SectorMeta {
  brand: string;
  monogram: string;
  tagline: string;
  heroIcon: IconType;
  primaryCta: string;
  services: string[];
  reviews: number;
  reviewsCount: number;
  catalogTitle: string;
  signatureLabel: string;
  catalog: { name: string; sub: string; price: string }[];
  cartLabel: string;
  cartCta: string;
  kpis: { label: string; value: string; trend: string }[];
  chart: number[];
  liveList: { primary: string; secondary: string; meta: string }[];
  chat: { from: "in" | "out"; text: string; time: string }[];
  quickReplies: string[];
  tab: { label: string; icon: IconType }[];
  hero: string;
  detail: string;
  palette: SectorPalette;
}

const PALETTES: Record<string, SectorPalette> = {
  pizzeria: {
    bg: "#1B100B",
    bg2: "#3A1710",
    surface: "rgba(255, 235, 204, 0.10)",
    surface2: "rgba(98, 36, 19, 0.74)",
    line: "rgba(246, 174, 89, 0.34)",
    text: "#FFF3DF",
    muted: "#D8B894",
    accent: "#F4A340",
    accent2: "#D9582A",
    accentText: "#1B100B",
    glow: "rgba(244, 126, 48, 0.45)",
    heroVeil: "linear-gradient(180deg, rgba(27,16,11,0.08), rgba(27,16,11,0.54) 48%, rgba(27,16,11,0.95))",
    bubble: "linear-gradient(135deg, #B94A24, #6E2718)",
    inbound: "rgba(255, 243, 223, 0.94)",
    font: "'Fraunces', Georgia, serif",
    uiFont: "'Plus Jakarta Sans', system-ui, sans-serif",
    radius: 22,
    radiusSmall: 10,
    // grainy warm paper
    texture: "radial-gradient(circle at 15% 20%, rgba(244,163,64,0.10), transparent 28%), radial-gradient(circle at 85% 75%, rgba(217,88,42,0.08), transparent 30%)",
    shadow: "0 14px 34px rgba(0,0,0,0.55), 0 0 0 1px rgba(246,174,89,0.18) inset",
    badgeShape: "pill",
    chartStyle: "bars",
    tracking: "0.14em",
  },
  sushi: {
    bg: "#08090B",
    bg2: "#201116",
    surface: "rgba(255, 221, 226, 0.08)",
    surface2: "rgba(32, 17, 22, 0.82)",
    line: "rgba(236, 149, 164, 0.32)",
    text: "#FFF7F8",
    muted: "#C7A5AC",
    accent: "#EF9AAB",
    accent2: "#F5D6C6",
    accentText: "#13080C",
    glow: "rgba(239, 154, 171, 0.42)",
    heroVeil: "linear-gradient(180deg, rgba(8,9,11,0.2), rgba(8,9,11,0.58) 48%, rgba(8,9,11,0.97))",
    bubble: "linear-gradient(135deg, #7C2B3D, #2D1119)",
    inbound: "rgba(255, 247, 248, 0.94)",
    font: "'Cormorant Garamond', 'Fraunces', serif",
    uiFont: "'Inter', system-ui, sans-serif",
    radius: 6,
    radiusSmall: 2,
    // vertical brush hairlines (sumi-e)
    texture: "repeating-linear-gradient(90deg, transparent 0 22px, rgba(239,154,171,0.04) 22px 23px)",
    shadow: "0 18px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(239,154,171,0.10) inset",
    badgeShape: "square",
    chartStyle: "line",
    tracking: "0.32em",
  },
  ncc: {
    bg: "#05070A",
    bg2: "#0B1720",
    surface: "rgba(176, 209, 224, 0.08)",
    surface2: "rgba(9, 22, 31, 0.82)",
    line: "rgba(98, 191, 213, 0.32)",
    text: "#F3FBFF",
    muted: "#9FB5C0",
    accent: "#62BFD5",
    accent2: "#D9B66F",
    accentText: "#061015",
    glow: "rgba(98, 191, 213, 0.42)",
    heroVeil: "linear-gradient(180deg, rgba(5,7,10,0.08), rgba(5,7,10,0.50) 48%, rgba(5,7,10,0.97))",
    bubble: "linear-gradient(135deg, #0D5C70, #0A2633)",
    inbound: "rgba(243, 251, 255, 0.94)",
    font: "'Archivo Black', 'Space Grotesk', sans-serif",
    uiFont: "'Space Grotesk', system-ui, sans-serif",
    radius: 4,
    radiusSmall: 2,
    // carbon micro-grid
    texture: "linear-gradient(rgba(98,191,213,0.05) 1px, transparent 1px) 0 0/100% 14px, linear-gradient(90deg, rgba(98,191,213,0.05) 1px, transparent 1px) 0 0/14px 100%",
    shadow: "0 20px 50px rgba(0,0,0,0.78), 0 0 0 1px rgba(98,191,213,0.16) inset",
    badgeShape: "cut",
    chartStyle: "line",
    tracking: "0.28em",
  },
  beauty: {
    bg: "#1A0E16",
    bg2: "#3B1F32",
    surface: "rgba(255, 219, 238, 0.10)",
    surface2: "rgba(65, 30, 54, 0.78)",
    line: "rgba(234, 164, 204, 0.34)",
    text: "#FFF6FB",
    muted: "#DAB4C9",
    accent: "#EAA4CC",
    accent2: "#D7B7FF",
    accentText: "#1A0E16",
    glow: "rgba(234, 164, 204, 0.42)",
    heroVeil: "linear-gradient(180deg, rgba(26,14,22,0.08), rgba(26,14,22,0.52) 48%, rgba(26,14,22,0.96))",
    bubble: "linear-gradient(135deg, #9B4E78, #4C203A)",
    inbound: "rgba(255, 246, 251, 0.94)",
    font: "'Playfair Display', Georgia, serif",
    uiFont: "'Plus Jakarta Sans', system-ui, sans-serif",
    radius: 28,
    radiusSmall: 999,
    // soft petal dots
    texture: "radial-gradient(circle at 30% 40%, rgba(234,164,204,0.08) 0 6px, transparent 7px) 0 0/24px 24px",
    shadow: "0 12px 36px rgba(155,78,120,0.40), 0 0 30px rgba(234,164,204,0.18)",
    badgeShape: "pill",
    chartStyle: "dots",
    tracking: "0.20em",
  },
  hospitality: {
    bg: "#082027",
    bg2: "#0B3A43",
    surface: "rgba(226, 245, 240, 0.11)",
    surface2: "rgba(13, 70, 78, 0.78)",
    line: "rgba(102, 214, 214, 0.32)",
    text: "#F4FFFB",
    muted: "#B7D8D2",
    accent: "#66D6D6",
    accent2: "#F4B56B",
    accentText: "#062027",
    glow: "rgba(102, 214, 214, 0.40)",
    heroVeil: "linear-gradient(180deg, rgba(8,32,39,0.02), rgba(8,32,39,0.46) 48%, rgba(8,32,39,0.96))",
    bubble: "linear-gradient(135deg, #178493, #0B4650)",
    inbound: "rgba(244, 255, 251, 0.94)",
    font: "'DM Serif Display', 'Cormorant Garamond', serif",
    uiFont: "'Inter', system-ui, sans-serif",
    radius: 18,
    radiusSmall: 6,
    // linen horizontal weave
    texture: "repeating-linear-gradient(0deg, rgba(102,214,214,0.04) 0 1px, transparent 1px 6px)",
    shadow: "0 16px 38px rgba(0,0,0,0.50), 0 0 0 1px rgba(102,214,214,0.14) inset",
    badgeShape: "square",
    chartStyle: "bars",
    tracking: "0.18em",
  },
  fitness: {
    bg: "#090908",
    bg2: "#1B1814",
    surface: "rgba(238, 238, 224, 0.09)",
    surface2: "rgba(30, 28, 23, 0.84)",
    line: "rgba(210, 255, 73, 0.30)",
    text: "#F7F7E9",
    muted: "#B9B8A7",
    accent: "#D2FF49",
    accent2: "#FF6B35",
    accentText: "#090908",
    glow: "rgba(210, 255, 73, 0.34)",
    heroVeil: "linear-gradient(180deg, rgba(9,9,8,0.08), rgba(9,9,8,0.52) 48%, rgba(9,9,8,0.96))",
    bubble: "linear-gradient(135deg, #566D14, #20290A)",
    inbound: "rgba(247, 247, 233, 0.94)",
    font: "'Bebas Neue', 'Archivo Black', sans-serif",
    uiFont: "'Space Grotesk', system-ui, sans-serif",
    radius: 4,
    radiusSmall: 2,
    // diagonal sport stripes
    texture: "repeating-linear-gradient(135deg, rgba(210,255,73,0.05) 0 1px, transparent 1px 9px)",
    shadow: "0 16px 38px rgba(0,0,0,0.65), 0 0 22px rgba(210,255,73,0.18)",
    badgeShape: "cut",
    chartStyle: "bars",
    tracking: "0.36em",
  },
  realestate: {
    bg: "#07110D",
    bg2: "#10241B",
    surface: "rgba(227, 218, 184, 0.10)",
    surface2: "rgba(23, 49, 38, 0.80)",
    line: "rgba(220, 190, 112, 0.34)",
    text: "#F7F1DB",
    muted: "#C4B890",
    accent: "#DCBE70",
    accent2: "#88B7A0",
    accentText: "#07110D",
    glow: "rgba(220, 190, 112, 0.42)",
    heroVeil: "linear-gradient(180deg, rgba(7,17,13,0.06), rgba(7,17,13,0.50) 48%, rgba(7,17,13,0.97))",
    bubble: "linear-gradient(135deg, #476F59, #173126)",
    inbound: "rgba(247, 241, 219, 0.94)",
    font: "'DM Serif Display', 'Playfair Display', serif",
    uiFont: "'Inter', system-ui, sans-serif",
    radius: 12,
    radiusSmall: 4,
    // marble vein soft
    texture: "radial-gradient(ellipse at 70% 30%, rgba(220,190,112,0.08), transparent 40%), radial-gradient(ellipse at 20% 80%, rgba(136,183,160,0.08), transparent 38%)",
    shadow: "0 18px 44px rgba(0,0,0,0.60), 0 0 0 1px rgba(220,190,112,0.18) inset",
    badgeShape: "square",
    chartStyle: "line",
    tracking: "0.22em",
  },
};

const SECTORS: Record<EmpireSector, SectorMeta> = {
  restaurant: {
    brand: "Strapizzami",
    monogram: "SP",
    tagline: "Pizzeria napoletana · Milano",
    heroIcon: Flame,
    primaryCta: "Ordina caldo",
    services: ["Menu", "Asporto", "Tavoli"],
    reviews: 4.9,
    reviewsCount: 1284,
    catalogTitle: "Menu forno",
    signatureLabel: "Più richiesta",
    catalog: [
      { name: "Regina Vesuvio", sub: "Bufala · basilico · olio EVO", price: "€ 12,50" },
      { name: "Provola & Pepe", sub: "Affumicata · pepe nero", price: "€ 11,00" },
      { name: "Friarielli", sub: "Salsiccia · crema aglio dolce", price: "€ 13,50" },
      { name: "Tiramisù casa", sub: "Mascarpone · cacao", price: "€ 6,00" },
    ],
    cartLabel: "3 articoli · 28 min",
    cartCta: "Carrello · € 37,00",
    kpis: [
      { label: "Ordini", value: "148", trend: "+38%" },
      { label: "Tavoli", value: "31", trend: "+8" },
      { label: "Ticket medio", value: "€ 29", trend: "+12%" },
    ],
    chart: [44, 58, 52, 76, 68, 91, 98],
    liveList: [
      { primary: "Tavolo 8 · 5 pax", secondary: "Regina ×3 · Provola ×2", meta: "20:45" },
      { primary: "Delivery · Porta Romana", secondary: "4 pizze · 2 dolci", meta: "20:37" },
      { primary: "Asporto · Giulia M.", secondary: "Pronto tra 9 minuti", meta: "20:31" },
    ],
    chat: [
      { from: "in", text: "Avete un tavolo per 4 alle 21?", time: "20:14" },
      { from: "out", text: "Sì Marta, sala interna alle 21:00. Vuoi confermare?", time: "20:14" },
      { from: "in", text: "Confermo, serve un seggiolone.", time: "20:15" },
      { from: "out", text: "Fatto: 4 pax · 21:00 · seggiolone già segnato.", time: "20:15" },
    ],
    quickReplies: ["Prenota", "Menu", "Asporto"],
    tab: [
      { label: "Home", icon: Home },
      { label: "Menu", icon: ShoppingBag },
      { label: "Tavoli", icon: Calendar },
      { label: "AI", icon: MessageCircle },
    ],
    hero: restaurantHero,
    detail: restaurantDish,
    palette: PALETTES.pizzeria,
  },
  sushi: {
    brand: "Paperfish",
    monogram: "PF",
    tagline: "Sushi fine dining · Roma",
    heroIcon: Utensils,
    primaryCta: "Riserva omakase",
    services: ["Omakase", "Delivery", "Wine"],
    reviews: 4.9,
    reviewsCount: 742,
    catalogTitle: "Omakase",
    signatureLabel: "Chef's cut",
    catalog: [
      { name: "Sakura Tasting", sub: "12 portate · pairing sake", price: "€ 95" },
      { name: "Nigiri Selection", sub: "Tonno · salmone · ricciola", price: "€ 34" },
      { name: "Black Cod", sub: "Miso · yuzu kosho", price: "€ 29" },
      { name: "Mochi trio", sub: "Matcha · sesamo · lampone", price: "€ 12" },
    ],
    cartLabel: "Ven 21:30 · counter",
    cartCta: "Conferma esperienza",
    kpis: [
      { label: "No-show", value: "−92%", trend: "ok" },
      { label: "Lista attesa", value: "18", trend: "+6" },
      { label: "Scontrino", value: "€ 74", trend: "+24%" },
    ],
    chart: [36, 42, 58, 61, 73, 84, 88],
    liveList: [
      { primary: "Counter · Tanaka", secondary: "Omakase 2 pax", meta: "21:30" },
      { primary: "Sala privata", secondary: "Wine pairing richiesto", meta: "22:00" },
      { primary: "Lista attesa · Leone", secondary: "Avviso automatico inviato", meta: "ora" },
    ],
    chat: [
      { from: "in", text: "Avete due posti al banco domani sera?", time: "18:08" },
      { from: "out", text: "Disponibile 21:30 al counter. Posso bloccare Sakura Tasting?", time: "18:08" },
      { from: "in", text: "Sì, con sake pairing.", time: "18:09" },
      { from: "out", text: "Prenotazione confermata. Ho aggiunto pairing sake e nota allergie.", time: "18:09" },
    ],
    quickReplies: ["Counter", "Menu", "Allergie"],
    tab: [
      { label: "Home", icon: Home },
      { label: "Carta", icon: Utensils },
      { label: "Riserva", icon: Calendar },
      { label: "AI", icon: MessageCircle },
    ],
    hero: sushiHero,
    detail: sushiDish,
    palette: PALETTES.sushi,
  },
  ncc: {
    brand: "Empire NCC",
    monogram: "EN",
    tagline: "Chauffeur luxury · Como",
    heroIcon: Car,
    primaryCta: "Calcola corsa",
    services: ["Airport", "Hourly", "VIP"],
    reviews: 5.0,
    reviewsCount: 413,
    catalogTitle: "Flotta live",
    signatureLabel: "Executive",
    catalog: [
      { name: "Mercedes S-Class", sub: "Malpensa → Como · 62 min", price: "€ 190" },
      { name: "V-Class Business", sub: "6 pax · luggage assist", price: "€ 240" },
      { name: "Hourly Black", sub: "Driver dedicato 4 ore", price: "€ 420" },
      { name: "Lake tour", sub: "Como · Bellagio · Lugano", price: "€ 680" },
    ],
    cartLabel: "Domani 08:10 · MXP",
    cartCta: "Blocca autista",
    kpis: [
      { label: "Preventivi", value: "64", trend: "+3.2×" },
      { label: "Lingue", value: "4", trend: "live" },
      { label: "Incasso", value: "€ 9.8k", trend: "+31%" },
    ],
    chart: [52, 48, 67, 72, 69, 88, 94],
    liveList: [
      { primary: "MXP → Mandarin", secondary: "Driver Paolo · S-Class", meta: "08:10" },
      { primary: "Como → St. Moritz", secondary: "V-Class · 5 ospiti", meta: "11:40" },
      { primary: "Cliente RU", secondary: "Preventivo inviato in russo", meta: "ora" },
    ],
    chat: [
      { from: "in", text: "Need transfer from Malpensa to Como tomorrow 8am.", time: "23:41" },
      { from: "out", text: "Of course. S-Class available at 08:10, fixed rate €190. Confirm?", time: "23:41" },
      { from: "in", text: "Yes, flight EK091.", time: "23:42" },
      { from: "out", text: "Booked. Driver tracks EK091 and waits at arrivals with name sign.", time: "23:42" },
    ],
    quickReplies: ["Transfer", "Hourly", "Invoice"],
    tab: [
      { label: "Home", icon: Home },
      { label: "Fleet", icon: Car },
      { label: "Trips", icon: MapPin },
      { label: "AI", icon: MessageCircle },
    ],
    hero: nccHero,
    detail: nccDetail,
    palette: PALETTES.ncc,
  },
  beauty: {
    brand: "Velvet Studio",
    monogram: "VS",
    tagline: "Beauty atelier · Torino",
    heroIcon: Scissors,
    primaryCta: "Prenota slot",
    services: ["Viso", "Hair", "Nails"],
    reviews: 4.9,
    reviewsCount: 962,
    catalogTitle: "Agenda beauty",
    signatureLabel: "Rituale",
    catalog: [
      { name: "Glow Signature", sub: "90 min · facial couture", price: "€ 160" },
      { name: "Velvet Color", sub: "Piega · gloss · tonalizzante", price: "€ 95" },
      { name: "Manicure Silk", sub: "Semipermanente premium", price: "€ 45" },
      { name: "Lymph Drain", sub: "Corpo · 60 min", price: "€ 80" },
    ],
    cartLabel: "Sab 14 · 16:30",
    cartCta: "Conferma slot",
    kpis: [
      { label: "Agenda", value: "94%", trend: "+47%" },
      { label: "No-show", value: "−60%", trend: "ok" },
      { label: "Recuperate", value: "8h", trend: "/sett" },
    ],
    chart: [30, 48, 60, 55, 72, 80, 78],
    liveList: [
      { primary: "Sofia · Glow Signature", secondary: "Operatrice Chiara", meta: "16:30" },
      { primary: "Lista attesa", secondary: "Slot riempito automaticamente", meta: "17:00" },
      { primary: "Elena · Velvet Color", secondary: "Reminder inviato", meta: "18:15" },
    ],
    chat: [
      { from: "in", text: "Vorrei spostare il trattamento a sabato.", time: "11:02" },
      { from: "out", text: "Ho 16:30 con Chiara o 18:00 con Sara. Quale preferisci?", time: "11:02" },
      { from: "in", text: "16:30 perfetto.", time: "11:03" },
      { from: "out", text: "Fatto: sabato 14 · 16:30 · Glow Signature con Chiara.", time: "11:03" },
    ],
    quickReplies: ["Prenota", "Sposta", "Gift"],
    tab: [
      { label: "Home", icon: Home },
      { label: "Servizi", icon: Sparkles },
      { label: "Agenda", icon: Calendar },
      { label: "AI", icon: MessageCircle },
    ],
    hero: beautyHero,
    detail: beautyDish,
    palette: PALETTES.beauty,
  },
  hospitality: {
    brand: "Asinara Resort",
    monogram: "AR",
    tagline: "Boutique hotel · Sardegna",
    heroIcon: BedDouble,
    primaryCta: "Book direct",
    services: ["Rooms", "Beach", "Spa"],
    reviews: 4.9,
    reviewsCount: 611,
    catalogTitle: "Esperienze",
    signatureLabel: "Sea view",
    catalog: [
      { name: "Suite Maestrale", sub: "Vista mare · colazione inclusa", price: "€ 420" },
      { name: "Boat Sunset", sub: "Aperitivo · cala privata", price: "€ 180" },
      { name: "Spa Ritual", sub: "Coppia · 75 min", price: "€ 140" },
      { name: "Chef Table", sub: "Degustazione locale", price: "€ 95" },
    ],
    cartLabel: "Check-in 18 Lug · 2 notti",
    cartCta: "Conferma diretto",
    kpis: [
      { label: "Diretti", value: "+58%", trend: "OTA↓" },
      { label: "Extra", value: "+31%", trend: "upsell" },
      { label: "Lingue", value: "6", trend: "native" },
    ],
    chart: [38, 52, 49, 66, 74, 86, 92],
    liveList: [
      { primary: "Suite Maestrale", secondary: "Check-in online completato", meta: "18:00" },
      { primary: "Ospite DE", secondary: "Concierge risponde in tedesco", meta: "ora" },
      { primary: "Boat Sunset", secondary: "Upsell accettato", meta: "+€180" },
    ],
    chat: [
      { from: "in", text: "Can you arrange a boat tour tomorrow?", time: "08:24" },
      { from: "out", text: "Yes. Sunset boat leaves at 18:30, private cove included. Shall I reserve?", time: "08:24" },
      { from: "in", text: "Please reserve for two.", time: "08:25" },
      { from: "out", text: "Reserved. Pickup in lobby at 18:10; towels already included.", time: "08:25" },
    ],
    quickReplies: ["Boat", "Spa", "Room"],
    tab: [
      { label: "Home", icon: Home },
      { label: "Stay", icon: BedDouble },
      { label: "Extra", icon: Waves },
      { label: "AI", icon: MessageCircle },
    ],
    hero: hospitalityHero,
    detail: hospitalityDetail,
    palette: PALETTES.hospitality,
  },
  fitness: {
    brand: "Iron Club",
    monogram: "IC",
    tagline: "Performance gym · Bologna",
    heroIcon: Dumbbell,
    primaryCta: "Start trial",
    services: ["PT", "HIIT", "Mobility"],
    reviews: 4.8,
    reviewsCount: 547,
    catalogTitle: "Training",
    signatureLabel: "Today",
    catalog: [
      { name: "HIIT Engine", sub: "18:00 · coach Luca", price: "€ 22" },
      { name: "PT Strength", sub: "1-on-1 · 60 min", price: "€ 70" },
      { name: "Mobility Lab", sub: "Recovery · 45 min", price: "€ 18" },
      { name: "Elite Month", sub: "Illimitato + body scan", price: "€ 189" },
    ],
    cartLabel: "Mar 18:00 · sala A",
    cartCta: "Blocca posto",
    kpis: [
      { label: "Trial→Abbon.", value: "+72%", trend: "hot" },
      { label: "Admin", value: "−85%", trend: "ore" },
      { label: "Membri", value: "312", trend: "+11" },
    ],
    chart: [50, 62, 70, 65, 80, 88, 92],
    liveList: [
      { primary: "HIIT Engine", secondary: "18 / 20 posti", meta: "18:00" },
      { primary: "Trial Andrea", secondary: "Follow-up AI pronto", meta: "ora" },
      { primary: "PT Marta", secondary: "Scheda aggiornata", meta: "19:00" },
    ],
    chat: [
      { from: "in", text: "Posso prenotare la prova HIIT?", time: "09:21" },
      { from: "out", text: "Sì, martedì 18:00 con Luca: restano 2 posti. Ti registro?", time: "09:21" },
      { from: "in", text: "Sì, grazie.", time: "09:22" },
      { from: "out", text: "Confermato. Ti mando anche waiver e indicazioni per arrivare.", time: "09:22" },
    ],
    quickReplies: ["Trial", "Classi", "PT"],
    tab: [
      { label: "Home", icon: Home },
      { label: "Classi", icon: Activity },
      { label: "Book", icon: Calendar },
      { label: "AI", icon: MessageCircle },
    ],
    hero: fitnessHero,
    detail: fitnessDish,
    palette: PALETTES.fitness,
  },
  realestate: {
    brand: "Dimore Smeraldo",
    monogram: "DS",
    tagline: "Real estate luxury · Costa Smeralda",
    heroIcon: Building2,
    primaryCta: "Richiedi visita",
    services: ["Ville", "Invest", "Rent"],
    reviews: 5.0,
    reviewsCount: 218,
    catalogTitle: "Mandati",
    signatureLabel: "New listing",
    catalog: [
      { name: "Villa Mirto", sub: "Porto Cervo · vista mare", price: "€ 4.8M" },
      { name: "Attico Marina", sub: "280 m² · terrazza 90 m²", price: "€ 1.2M" },
      { name: "Casale Storico", sub: "Arzachena · uliveto", price: "€ 2.4M" },
      { name: "Penthouse Darsena", sub: "Approdo privato", price: "€ 3.1M" },
    ],
    cartLabel: "Visita · Sab 14 · 11:00",
    cartCta: "Conferma appuntamento",
    kpis: [
      { label: "Mandati", value: "47", trend: "+6" },
      { label: "Visite", value: "32", trend: "+9" },
      { label: "Conv.", value: "21%", trend: "+3%" },
    ],
    chart: [35, 42, 50, 58, 64, 72, 78],
    liveList: [
      { primary: "Rossi · Villa Mirto", secondary: "Visita confermata", meta: "Sab" },
      { primary: "Brown · Attico Marina", secondary: "Offerta in valutazione", meta: "Ven" },
      { primary: "Notaio Bianchi", secondary: "Documenti inviati", meta: "ora" },
    ],
    chat: [
      { from: "in", text: "Vorrei informazioni su Villa Mirto.", time: "10:08" },
      { from: "out", text: "Disponibile per visita sabato 11:00 o domenica 16:00. Quale preferisce?", time: "10:08" },
      { from: "in", text: "Sabato 11:00.", time: "10:09" },
      { from: "out", text: "Confermato. Invio scheda tecnica e indicazioni per Porto Cervo.", time: "10:09" },
    ],
    quickReplies: ["Visita", "Scheda", "Valuta"],
    tab: [
      { label: "Home", icon: Home },
      { label: "Ville", icon: Building2 },
      { label: "Agenda", icon: Calendar },
      { label: "AI", icon: MessageCircle },
    ],
    hero: realestateHero,
    detail: realestateDish,
    palette: PALETTES.realestate,
  },
};

function StatusBar({ p }: { p: SectorPalette }) {
  return (
    <div className="flex items-center justify-between px-4 pt-2 pb-1 text-[9px] font-semibold" style={{ color: p.text }}>
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <Signal size={9} />
        <Wifi size={9} />
        <BatteryFull size={11} />
      </div>
    </div>
  );
}

function TabBar({ items, p }: { items: SectorMeta["tab"]; p: SectorPalette }) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 flex items-center justify-around px-2 pt-1.5 pb-3"
      style={{
        background: `linear-gradient(180deg, transparent, ${p.bg} 56%)`,
        borderTop: `1px solid ${p.line}`,
        backdropFilter: "blur(12px)",
      }}
    >
      {items.map((t, i) => {
        const Icon = t.icon;
        const active = i === 0;
        return (
          <div key={t.label} className="flex flex-col items-center gap-0.5">
            <Icon size={13} color={active ? p.accent : p.muted} strokeWidth={active ? 2.2 : 1.6} />
            <span className="text-[7px] uppercase" style={{ color: active ? p.text : p.muted, letterSpacing: "0.06em" }}>
              {t.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Header({ s }: { s: SectorMeta }) {
  const p = s.palette;
  const monoRadius = p.badgeShape === "square" ? p.radiusSmall : p.badgeShape === "cut" ? 0 : 999;
  return (
    <div className="flex items-center gap-2 px-4 pt-1 pb-2" style={{ fontFamily: p.uiFont }}>
      <div
        className="flex h-6 w-6 items-center justify-center text-[8px] font-bold"
        style={{
          background: `linear-gradient(135deg, ${p.accent}, ${p.accent2})`,
          color: p.accentText,
          boxShadow: `0 0 0 1px ${p.line}, 0 0 18px ${p.glow}`,
          borderRadius: monoRadius,
          fontFamily: p.font,
        }}
      >
        {s.monogram}
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-semibold" style={{ color: p.text, fontFamily: p.font, letterSpacing: p.badgeShape === "cut" ? "0.04em" : "0" }}>
          {s.brand}
        </span>
        <span className="flex items-center gap-1 text-[7px] uppercase" style={{ color: p.muted, letterSpacing: p.tracking }}>
          <span className="inline-block h-1 w-1 rounded-full" style={{ background: p.accent, boxShadow: `0 0 5px ${p.accent}` }} />
          Empire AI · Live
        </span>
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <Shield size={10} color={p.muted} />
        <Bell size={11} color={p.muted} />
      </div>
    </div>
  );
}

function ScreenShell({ s, children }: { s: SectorMeta; children: ReactNode }) {
  const p = s.palette;
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: `radial-gradient(circle at 20% 0%, ${p.glow}, transparent 30%), linear-gradient(180deg, ${p.bg} 0%, ${p.bg2} 100%)`,
        color: p.text,
        fontFamily: p.uiFont,
      }}
    >
      {/* sector-unique texture overlay */}
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: p.texture, opacity: 0.9, mixBlendMode: "screen" }} />
      <StatusBar p={p} />
      {children}
    </div>
  );
}

function HomeView({ s }: { s: SectorMeta }) {
  const p = s.palette;
  const HeroIcon = s.heroIcon;
  const badgeRadius = p.badgeShape === "pill" ? 999 : p.badgeShape === "cut" ? 0 : p.radiusSmall;
  return (
    <ScreenShell s={s}>
      <Header s={s} />
      <div className="relative mx-3 overflow-hidden" style={{ height: "45%", borderRadius: p.radius, border: `1px solid ${p.line}`, boxShadow: p.shadow }}>
        <img src={s.hero} alt={s.brand} loading="lazy" width={1024} height={1536} className="absolute inset-0 h-full w-full object-cover" style={{ filter: "saturate(1.08) contrast(1.04)" }} />
        <div className="absolute inset-0" style={{ background: p.heroVeil }} />
        <div className="absolute left-2 top-2 px-2 py-1 text-[6px] font-bold uppercase" style={{ background: "rgba(0,0,0,0.32)", border: `1px solid ${p.line}`, color: p.text, letterSpacing: p.tracking, borderRadius: badgeRadius, fontFamily: p.uiFont }}>
          Live preview
        </div>
        <div className="absolute inset-x-0 bottom-0 px-3 pb-3 text-left">
          <HeroIcon size={18} color={p.accent} strokeWidth={1.8} />
          <div className="mt-1 text-[16px] font-semibold leading-none" style={{ fontFamily: p.font, color: p.text }}>
            {s.brand}
          </div>
          <div className="mt-1 h-px" style={{ width: 46, background: `linear-gradient(90deg, ${p.accent}, transparent)` }} />
          <div className="mt-1 text-[7px] uppercase" style={{ color: p.muted, letterSpacing: p.tracking, fontFamily: p.uiFont }}>
            {s.tagline}
          </div>
          <button className="mt-2 px-3 py-1 text-[8px] font-bold uppercase" style={{ background: `linear-gradient(90deg, ${p.accent}, ${p.accent2})`, color: p.accentText, boxShadow: `0 6px 16px ${p.glow}`, letterSpacing: p.tracking, borderRadius: badgeRadius, fontFamily: p.uiFont }}>
            {s.primaryCta}
          </button>
        </div>
      </div>
      <div className="mx-3 mt-2 grid grid-cols-3 gap-1.5">
        {s.services.map((sv) => (
          <div key={sv} className="py-1.5 text-center text-[7px] font-semibold uppercase" style={{ background: p.surface, border: `1px solid ${p.line}`, color: p.text, letterSpacing: p.tracking, borderRadius: p.radiusSmall, fontFamily: p.uiFont }}>
            {sv}
          </div>
        ))}
      </div>
      <div className="mx-3 mt-2 px-2 py-2" style={{ background: p.surface2, border: `1px solid ${p.line}`, borderRadius: p.radiusSmall }}>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={9} color={p.accent} fill={p.accent} />)}
          <span className="ml-1 text-[9px] font-bold" style={{ color: p.text }}>{s.reviews.toFixed(1)}</span>
          <span className="text-[7px] uppercase" style={{ color: p.muted, letterSpacing: "0.08em" }}>{s.reviewsCount} recensioni</span>
        </div>
      </div>
      <TabBar items={s.tab} p={p} />
    </ScreenShell>
  );
}

function AppView({ s }: { s: SectorMeta }) {
  const p = s.palette;
  const cardR = Math.max(p.radius - 4, 6);
  const chipR = p.badgeShape === "pill" ? 999 : p.badgeShape === "cut" ? 0 : p.radiusSmall;
  const pillR = p.badgeShape === "cut" ? 4 : 999;
  // 4 catalog items: index 0 = featured hero, 1..3 = 2-col grid (we show 2 in grid + featured + 1 list)
  const featured = s.catalog[0];
  const grid = s.catalog.slice(1, 5);

  return (
    <ScreenShell s={s}>
      <Header s={s} />

      {/* Search bar */}
      <div className="mx-3 mb-2 flex items-center gap-1.5 px-2 py-1.5" style={{ background: p.surface, border: `1px solid ${p.line}`, borderRadius: pillR }}>
        <Search size={9} color={p.muted} />
        <span className="text-[8px]" style={{ color: p.muted, fontFamily: p.uiFont }}>Cerca {s.catalogTitle.toLowerCase()}…</span>
      </div>

      {/* Category pills */}
      <div className="mx-3 mb-2 flex gap-1 overflow-hidden">
        {[s.signatureLabel, ...s.services].slice(0, 4).map((cat, i) => (
          <div key={cat + i} className="px-2 py-1 text-[7px] font-bold uppercase shrink-0" style={{
            background: i === 0 ? `linear-gradient(135deg, ${p.accent}, ${p.accent2})` : p.surface2,
            color: i === 0 ? p.accentText : p.text,
            border: `1px solid ${i === 0 ? "transparent" : p.line}`,
            borderRadius: pillR,
            letterSpacing: p.tracking,
            fontFamily: p.uiFont,
            boxShadow: i === 0 ? `0 4px 12px ${p.glow}` : "none",
          }}>{cat}</div>
        ))}
      </div>

      <div className="px-3 pb-1.5 text-[9px] font-bold uppercase" style={{ color: p.accent, letterSpacing: p.tracking, fontFamily: p.uiFont }}>
        {s.catalogTitle}
      </div>

      <div className="space-y-2 px-3" style={{ maxHeight: "52%", overflow: "hidden" }}>
        {/* Featured hero card with big image */}
        {featured && (
          <div className="relative overflow-hidden" style={{ height: 86, border: `1px solid ${p.line}`, boxShadow: p.shadow, borderRadius: cardR }}>
            <img src={s.detail} alt={featured.name} loading="lazy" width={1024} height={1024} className="absolute inset-0 h-full w-full object-cover" style={{ filter: "saturate(1.1) contrast(1.05)" }} />
            <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${p.bg}EE 0%, ${p.bg}99 45%, transparent 75%)` }} />
            <div className="absolute left-2 top-2 px-1.5 py-[2px] text-[6px] font-bold uppercase" style={{ background: p.accent, color: p.accentText, borderRadius: pillR, letterSpacing: p.tracking }}>
              ★ {s.signatureLabel}
            </div>
            <div className="absolute inset-y-0 left-0 flex w-[62%] flex-col justify-end px-2.5 pb-2">
              <div className="text-[12px] font-semibold leading-tight" style={{ fontFamily: p.font, color: p.text }}>{featured.name}</div>
              <div className="mt-0.5 truncate text-[7px]" style={{ color: p.muted }}>{featured.sub}</div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="text-[11px] font-bold" style={{ color: p.accent, fontFamily: p.font }}>{featured.price}</span>
              </div>
            </div>
            <button className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center" style={{ background: `linear-gradient(135deg, ${p.accent}, ${p.accent2})`, color: p.accentText, borderRadius: 999, boxShadow: `0 4px 12px ${p.glow}` }}>
              <Plus size={12} strokeWidth={2.6} />
            </button>
          </div>
        )}

        {/* 2-column grid like Lowengeld food apps */}
        <div className="grid grid-cols-2 gap-1.5">
          {grid.map((item) => (
            <div key={item.name} className="relative overflow-hidden" style={{ border: `1px solid ${p.line}`, borderRadius: cardR, background: p.surface2 }}>
              <div className="relative" style={{ aspectRatio: "1.15 / 1" }}>
                <img src={s.detail} alt={item.name} loading="lazy" width={300} height={260} className="absolute inset-0 h-full w-full object-cover" style={{ filter: "saturate(1.08)" }} />
                <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 40%, ${p.bg}DD 100%)` }} />
                <button className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center" style={{ background: p.bg, color: p.accent, borderRadius: 999, border: `1px solid ${p.line}` }}>
                  <Plus size={8} strokeWidth={2.6} />
                </button>
              </div>
              <div className="px-1.5 pb-1.5 pt-1">
                <div className="truncate text-[8px] font-semibold leading-tight" style={{ color: p.text, fontFamily: p.font }}>{item.name}</div>
                <div className="mt-0.5 flex items-center justify-between">
                  <span className="truncate text-[6px]" style={{ color: p.muted, letterSpacing: p.tracking }}>{item.sub.split("·")[0]?.trim()}</span>
                  <span className="shrink-0 text-[8px] font-bold" style={{ color: p.accent, fontFamily: p.font }}>{item.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart bar */}
      <div className="absolute inset-x-3 flex items-center justify-between px-3 py-1.5" style={{ bottom: "10.5%", background: `linear-gradient(90deg, ${p.accent}, ${p.accent2})`, boxShadow: `0 8px 22px ${p.glow}`, borderRadius: chipR }}>
        <div className="flex items-center gap-1.5">
          <ShoppingBag size={10} color={p.accentText} strokeWidth={2.2} />
          <div className="flex flex-col leading-none">
            <span className="text-[6px] uppercase" style={{ color: p.accentText, letterSpacing: p.tracking, opacity: 0.85 }}>{s.cartLabel}</span>
            <span className="text-[9px] font-bold" style={{ color: p.accentText, fontFamily: p.font }}>{s.cartCta}</span>
          </div>
        </div>
        <Send size={11} color={p.accentText} />
      </div>
      <TabBar items={s.tab} p={p} />
    </ScreenShell>
  );
}

function ChartViz({ p, data }: { p: SectorPalette; data: number[] }) {
  const max = Math.max(...data);
  if (p.chartStyle === "line") {
    const W = 100;
    const H = 44;
    const step = W / (data.length - 1);
    const pts = data.map((v, i) => `${i * step},${H - (v / max) * H}`).join(" ");
    const area = `0,${H} ${pts} ${W},${H}`;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-11 w-full">
        <defs>
          <linearGradient id={`gv-${p.accent.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.accent} stopOpacity="0.55" />
            <stop offset="100%" stopColor={p.accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill={`url(#gv-${p.accent.replace("#", "")})`} />
        <polyline points={pts} fill="none" stroke={p.accent} strokeWidth="1.4" />
        {data.map((v, i) => (
          <circle key={i} cx={i * step} cy={H - (v / max) * H} r={i === data.length - 1 ? 1.8 : 1} fill={i === data.length - 1 ? p.accent2 : p.accent} />
        ))}
      </svg>
    );
  }
  if (p.chartStyle === "dots") {
    return (
      <div className="flex h-11 items-end gap-1">
        {data.map((v, i) => {
          const h = (v / max) * 100;
          const dots = Math.max(2, Math.round(h / 14));
          return (
            <div key={i} className="flex flex-1 flex-col-reverse items-center gap-[2px]">
              {Array.from({ length: dots }).map((_, d) => (
                <span key={d} className="h-[5px] w-[5px] rounded-full" style={{ background: i === data.length - 1 && d === 0 ? p.accent2 : p.accent, opacity: 1 - d * 0.12 }} />
              ))}
            </div>
          );
        })}
      </div>
    );
  }
  // bars (default)
  return (
    <div className="flex h-11 items-end gap-1">
      {data.map((v, i) => (
        <div key={i} className="flex-1" style={{
          height: `${(v / max) * 100}%`,
          background: i === data.length - 1 ? `linear-gradient(180deg, ${p.accent2}, ${p.accent})` : `linear-gradient(180deg, ${p.accent}88, ${p.accent}22)`,
          borderRadius: p.radiusSmall <= 4 ? 0 : 3,
        }} />
      ))}
    </div>
  );
}

function AdminView({ s }: { s: SectorMeta }) {
  const p = s.palette;
  return (
    <ScreenShell s={s}>
      <Header s={s} />
      <div className="px-3 pb-1.5 text-[9px] font-bold uppercase" style={{ color: p.accent, letterSpacing: p.tracking, fontFamily: p.uiFont }}>Command · oggi</div>
      <div className="mx-3 grid grid-cols-3 gap-1.5">
        {s.kpis.map((k) => (
          <div key={k.label} className="p-1.5" style={{ background: p.surface2, border: `1px solid ${p.line}`, borderRadius: p.radiusSmall }}>
            <div className="truncate text-[6px] uppercase" style={{ color: p.muted, letterSpacing: p.tracking, fontFamily: p.uiFont }}>{k.label}</div>
            <div className="mt-0.5 text-[11px] font-semibold leading-none" style={{ color: p.text, fontFamily: p.font }}>{k.value}</div>
            <div className="mt-1 flex items-center gap-0.5 text-[7px]" style={{ color: p.accent, fontFamily: p.uiFont }}><TrendingUp size={7} /> {k.trend}</div>
          </div>
        ))}
      </div>
      <div className="mx-3 mt-2 p-2" style={{ background: p.surface, border: `1px solid ${p.line}`, borderRadius: p.radiusSmall }}>
        <div className="flex items-center justify-between text-[7px] uppercase" style={{ color: p.muted, letterSpacing: p.tracking, fontFamily: p.uiFont }}>
          <span>Settimana</span><span style={{ color: p.accent }}>AI optimized</span>
        </div>
        <div className="mt-2">
          <ChartViz p={p} data={s.chart} />
        </div>
      </div>
      <div className="mx-3 mt-2 space-y-1">
        <div className="text-[7px] uppercase" style={{ color: p.muted, letterSpacing: p.tracking, fontFamily: p.uiFont }}>Live ops</div>
        {s.liveList.map((row) => (
          <div key={row.primary} className="flex items-center gap-1.5 p-1.5" style={{ background: p.surface2, border: `1px solid ${p.line}`, borderRadius: p.radiusSmall }}>
            <div className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: p.accent, boxShadow: `0 0 8px ${p.accent}` }} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[8px] font-semibold" style={{ color: p.text, fontFamily: p.font }}>{row.primary}</div>
              <div className="truncate text-[7px]" style={{ color: p.muted }}>{row.secondary}</div>
            </div>
            <div className="text-[7px] font-semibold" style={{ color: p.accent, fontFamily: p.uiFont }}>{row.meta}</div>
          </div>
        ))}
      </div>
      <TabBar items={s.tab} p={p} />
    </ScreenShell>
  );
}

function ChatView({ s }: { s: SectorMeta }) {
  const p = s.palette;
  const avatarR = p.badgeShape === "square" ? p.radiusSmall : p.badgeShape === "cut" ? 0 : 999;
  const chipR = p.badgeShape === "pill" ? 999 : p.badgeShape === "cut" ? 0 : p.radiusSmall;
  const bubbleR = Math.max(p.radius - 4, 6);
  return (
    <ScreenShell s={s}>
      <div className="flex items-center gap-2 px-3 pt-1 pb-2" style={{ borderBottom: `1px solid ${p.line}` }}>
        <div className="flex h-7 w-7 items-center justify-center text-[8px] font-bold" style={{ background: `linear-gradient(135deg, ${p.accent}, ${p.accent2})`, color: p.accentText, borderRadius: avatarR, fontFamily: p.font }}>E</div>
        <div className="flex flex-col leading-none">
          <span className="text-[10px] font-semibold" style={{ color: p.text, fontFamily: p.font }}>Empire AI</span>
          <span className="text-[7px] uppercase" style={{ color: p.muted, letterSpacing: p.tracking, fontFamily: p.uiFont }}>online · risponde in 12s</span>
        </div>
        <div className="ml-auto flex items-center gap-1 text-[7px]" style={{ color: p.muted }}><Clock size={8} /> 24/7</div>
      </div>
      <div className="flex flex-col gap-1.5 px-2.5 py-2" style={{ maxHeight: "62%", overflow: "hidden" }}>
        {s.chat.map((m, i) => {
          const out = m.from === "out";
          return (
            <div key={i} className={`flex ${out ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[78%] px-2 py-1.5" style={{ background: out ? p.bubble : p.inbound, color: out ? p.text : p.accentText, border: `1px solid ${out ? p.line : "rgba(0,0,0,0.06)"}`, borderRadius: bubbleR, borderTopRightRadius: out ? Math.min(5, bubbleR) : bubbleR, borderTopLeftRadius: out ? bubbleR : Math.min(5, bubbleR), fontFamily: p.uiFont }}>
                <div className="text-[8px] leading-snug">{m.text}</div>
                <div className="mt-0.5 flex items-center justify-end gap-0.5 text-[6px] opacity-70">
                  {m.time}{out ? <CheckCheck size={8} color={p.accent} /> : <Check size={8} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="absolute inset-x-3 flex gap-1.5" style={{ bottom: "12%" }}>
        {s.quickReplies.map((q) => (
          <div key={q} className="flex-1 py-1 text-center text-[7px] font-bold uppercase" style={{ background: p.surface, border: `1px solid ${p.line}`, color: p.accent, letterSpacing: p.tracking, borderRadius: chipR, fontFamily: p.uiFont }}>{q}</div>
        ))}
      </div>
      <TabBar items={s.tab} p={p} />
    </ScreenShell>
  );
}

export function getEmpireScreens(sector: EmpireSector, view: PhoneView): ReactNode {
  const s = SECTORS[sector];
  if (!s) return null;
  switch (view) {
    case "Home sito":
      return <HomeView s={s} />;
    case "App cliente":
      return <AppView s={s} />;
    case "Admin":
      return <AdminView s={s} />;
    case "AI WhatsApp":
      return <ChatView s={s} />;
    default:
      return null;
  }
}

export function projectIdToSector(id: string): EmpireSector | null {
  switch (id) {
    case "strapizzami":
      return "restaurant";
    case "paperfish":
      return "sushi";
    case "empire-ncc":
      return "ncc";
    case "velvet-studio":
      return "beauty";
    case "asinara-resort":
      return "hospitality";
    case "iron-club":
      return "fitness";
    default:
      return null;
  }
}