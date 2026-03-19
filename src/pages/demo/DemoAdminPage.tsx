/**
 * DemoAdminPage — Public admin demo dashboard for ANY sector
 * Accessible at /demo/:slug/admin WITHOUT authentication
 * Rich, sector-specific, with realistic mock data
 */
import { useState, useMemo, useEffect, useRef } from "react";
import { TutorialPopup } from "@/components/ui/tutorial-popup";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getSectorConfig, SECTOR_CONFIGS } from "@/config/sectorConfig";
import { getAllAgentsForSector } from "@/config/sectorFeatures";
import { DEMO_SLUGS } from "@/data/demo-industries";
import { INDUSTRY_CONFIGS } from "@/config/industry-config";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Users, Calendar, BarChart3, Bot, MessageCircle, Settings,
  ShoppingBag, Star, Package, Bell, TrendingUp, ArrowRight, Menu as MenuIcon,
  X, Search, Moon, Sun, ChevronRight, Activity, DollarSign, Eye, Clock,
  CheckCircle, AlertTriangle, ArrowUp, ArrowDown, Filter, MoreHorizontal,
  CreditCard, Shield, Wrench, Car, Camera, FileText, Building, Heart,
  Sparkles, Smartphone, Globe, UserCog, QrCode, Truck, HardHat, Baby,
  BookOpen, GraduationCap, Scissors, ChefHat, Coffee, Plus, Send,
  Zap, Target, Wallet, PieChart as PieChartIcon, ChevronLeft, Dumbbell,
  Bed, UtensilsCrossed, MapPin, Navigation, Route, ClipboardList
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";

const ICON_MAP: Record<string, any> = {
  LayoutDashboard, Users, Calendar, BarChart3, Bot, MessageCircle, Settings,
  ShoppingBag, Star, Package, Bell, TrendingUp, Search, Activity, DollarSign,
  Eye, Clock, CheckCircle, AlertTriangle, CreditCard, Shield, Wrench, Car,
  Camera, FileText, Building, Heart, Sparkles, Smartphone, Globe, UserCog,
  QrCode, Truck, HardHat, Baby, BookOpen, GraduationCap, Scissors, ChefHat,
  Coffee, Plus, Send, Zap, Target, Wallet, Dumbbell, Bed, MapPin, Navigation, Route, ClipboardList,
  UtensilsCrossed: ChefHat, UserCheck: Users, Stethoscope: Heart,
};

const resolveIcon = (name: string) => ICON_MAP[name] || Star;

function resolveIndustryFromSlug(slug: string): string | null {
  if (SECTOR_CONFIGS[slug]) return slug;
  for (const [industryId, demoSlug] of Object.entries(DEMO_SLUGS)) {
    if (demoSlug === slug) return industryId;
  }
  if (slug in INDUSTRY_CONFIGS) return slug;
  return null;
}

// ── Animated counter ──
const AnimCounter = ({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let start = 0;
    const dur = 1500;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <span ref={ref}>{prefix}{display.toLocaleString("it-IT")}{suffix}</span>;
};

// ── Sector-specific KPIs ──
const SECTOR_KPIS: Record<string, { label: string; value: number; prefix?: string; suffix?: string; change: string; up: boolean; icon: string }[]> = {
  food: [
    { label: "Ordini Oggi", value: 47, change: "+22%", up: true, icon: "ShoppingBag" },
    { label: "Coperti", value: 128, change: "+15%", up: true, icon: "Users" },
    { label: "Revenue Giornata", value: 3420, prefix: "€", change: "+18%", up: true, icon: "DollarSign" },
    { label: "Piatto Top", value: 34, suffix: " venduti", change: "+8%", up: true, icon: "ChefHat" },
    { label: "Rating Medio", value: 47, suffix: "", change: "+0.2", up: true, icon: "Star" },
  ],
  beauty: [
    { label: "Appuntamenti Oggi", value: 18, change: "+12%", up: true, icon: "Calendar" },
    { label: "Revenue Giornata", value: 1850, prefix: "€", change: "+24%", up: true, icon: "DollarSign" },
    { label: "Clienti Attive", value: 342, change: "+8%", up: true, icon: "Users" },
    { label: "Rating", value: 49, suffix: "/5", change: "+0.1", up: true, icon: "Star" },
    { label: "Prodotti Venduti", value: 12, change: "+32%", up: true, icon: "ShoppingBag" },
  ],
  healthcare: [
    { label: "Visite Oggi", value: 24, change: "+10%", up: true, icon: "Calendar" },
    { label: "Pazienti Totali", value: 3580, change: "+6%", up: true, icon: "Users" },
    { label: "Prescrizioni", value: 156, change: "+14%", up: true, icon: "FileText" },
    { label: "Revenue Mensile", value: 42800, prefix: "€", change: "+18%", up: true, icon: "DollarSign" },
  ],
  fitness: [
    { label: "Membri Attivi", value: 487, change: "+15%", up: true, icon: "Users" },
    { label: "Lezioni Oggi", value: 12, change: "+3", up: true, icon: "Calendar" },
    { label: "Nuovi Abbonamenti", value: 28, change: "+22%", up: true, icon: "CreditCard" },
    { label: "Tasso Rinnovo", value: 87, suffix: "%", change: "+4%", up: true, icon: "TrendingUp" },
  ],
  hospitality: [
    { label: "Occupazione", value: 82, suffix: "%", change: "+8%", up: true, icon: "Building" },
    { label: "Check-in Oggi", value: 14, change: "+3", up: true, icon: "Users" },
    { label: "Revenue Camera", value: 185, prefix: "€", suffix: " avg", change: "+12%", up: true, icon: "DollarSign" },
    { label: "Rating Booking", value: 46, suffix: "/5", change: "+0.3", up: true, icon: "Star" },
  ],
  hotel: [
    { label: "Occupazione", value: 82, suffix: "%", change: "+8%", up: true, icon: "Building" },
    { label: "Check-in Oggi", value: 14, change: "+3", up: true, icon: "Users" },
    { label: "Revenue Camera", value: 185, prefix: "€", suffix: " avg", change: "+12%", up: true, icon: "DollarSign" },
    { label: "Rating Booking", value: 46, suffix: "/5", change: "+0.3", up: true, icon: "Star" },
  ],
  ncc: [
    { label: "Corse Oggi", value: 18, change: "+24%", up: true, icon: "Car" },
    { label: "Revenue Giornata", value: 4250, prefix: "€", change: "+31%", up: true, icon: "DollarSign" },
    { label: "Flotta Attiva", value: 8, suffix: "/10", change: "80%", up: true, icon: "Truck" },
    { label: "Rating Clienti", value: 49, suffix: "/5", change: "+0.1", up: true, icon: "Star" },
  ],
  retail: [
    { label: "Vendite Oggi", value: 64, change: "+18%", up: true, icon: "ShoppingBag" },
    { label: "Revenue", value: 4870, prefix: "€", change: "+22%", up: true, icon: "DollarSign" },
    { label: "Scontrino Medio", value: 76, prefix: "€", change: "+8%", up: true, icon: "CreditCard" },
    { label: "Clienti Fidelity", value: 234, change: "+14%", up: true, icon: "Heart" },
  ],
  beach: [
    { label: "Ombrelloni Occupati", value: 142, suffix: "/180", change: "+12%", up: true, icon: "Eye" },
    { label: "Revenue Giornata", value: 5240, prefix: "€", change: "+28%", up: true, icon: "DollarSign" },
    { label: "Abbonamenti Attivi", value: 87, change: "+18%", up: true, icon: "CreditCard" },
    { label: "Bar & Ristoro", value: 1850, prefix: "€", change: "+22%", up: true, icon: "Coffee" },
    { label: "Soddisfazione", value: 48, suffix: "/5", change: "+0.3", up: true, icon: "Star" },
  ],
  bakery: [
    { label: "Ordini Oggi", value: 68, change: "+25%", up: true, icon: "ShoppingBag" },
    { label: "Revenue", value: 2180, prefix: "€", change: "+18%", up: true, icon: "DollarSign" },
    { label: "Prodotti Sfornati", value: 245, change: "+12%", up: true, icon: "ChefHat" },
    { label: "Preordini Domani", value: 34, change: "+42%", up: true, icon: "Calendar" },
  ],
  plumber: [
    { label: "Interventi Oggi", value: 8, change: "+15%", up: true, icon: "Wrench" },
    { label: "Revenue Giornata", value: 2840, prefix: "€", change: "+22%", up: true, icon: "DollarSign" },
    { label: "Preventivi Aperti", value: 14, change: "+8%", up: true, icon: "FileText" },
    { label: "Clienti Attivi", value: 186, change: "+12%", up: true, icon: "Users" },
    { label: "Tempo Medio", value: 95, suffix: " min", change: "-8%", up: true, icon: "Clock" },
  ],
  electrician: [
    { label: "Interventi Oggi", value: 6, change: "+20%", up: true, icon: "Zap" },
    { label: "Revenue Giornata", value: 3120, prefix: "€", change: "+18%", up: true, icon: "DollarSign" },
    { label: "Preventivi", value: 11, change: "+14%", up: true, icon: "FileText" },
    { label: "Certificazioni", value: 28, change: "+6%", up: true, icon: "Shield" },
  ],
  agriturismo: [
    { label: "Ospiti Presenti", value: 34, change: "+18%", up: true, icon: "Users" },
    { label: "Camere Occupate", value: 12, suffix: "/16", change: "+8%", up: true, icon: "Bed" },
    { label: "Revenue Giornata", value: 2680, prefix: "€", change: "+24%", up: true, icon: "DollarSign" },
    { label: "Degustazioni", value: 8, change: "+32%", up: true, icon: "Coffee" },
  ],
  cleaning: [
    { label: "Interventi Oggi", value: 12, change: "+18%", up: true, icon: "CheckCircle" },
    { label: "Revenue", value: 1960, prefix: "€", change: "+22%", up: true, icon: "DollarSign" },
    { label: "Clienti Ricorrenti", value: 156, change: "+12%", up: true, icon: "Users" },
    { label: "Soddisfazione", value: 49, suffix: "/5", change: "+0.2", up: true, icon: "Star" },
  ],
  legal: [
    { label: "Pratiche Attive", value: 42, change: "+8%", up: true, icon: "FileText" },
    { label: "Consulenze Oggi", value: 6, change: "+12%", up: true, icon: "Calendar" },
    { label: "Revenue Mensile", value: 28500, prefix: "€", change: "+15%", up: true, icon: "DollarSign" },
    { label: "Clienti Attivi", value: 128, change: "+6%", up: true, icon: "Users" },
  ],
  accountant: [
    { label: "Clienti Gestiti", value: 186, change: "+10%", up: true, icon: "Users" },
    { label: "Dichiarazioni", value: 34, change: "+28%", up: true, icon: "FileText" },
    { label: "Revenue Mensile", value: 32400, prefix: "€", change: "+14%", up: true, icon: "DollarSign" },
    { label: "Scadenze Prossime", value: 12, change: "-4", up: true, icon: "Clock" },
  ],
  garage: [
    { label: "Veicoli in Officina", value: 14, change: "+3", up: true, icon: "Car" },
    { label: "Revenue Giornata", value: 4250, prefix: "€", change: "+22%", up: true, icon: "DollarSign" },
    { label: "Preventivi Aperti", value: 8, change: "+18%", up: true, icon: "FileText" },
    { label: "Ricambi Ordinati", value: 24, change: "+12%", up: true, icon: "Package" },
  ],
  photographer: [
    { label: "Shooting Oggi", value: 3, change: "+1", up: true, icon: "Camera" },
    { label: "Revenue Mensile", value: 8500, prefix: "€", change: "+24%", up: true, icon: "DollarSign" },
    { label: "Gallery Online", value: 18, change: "+6", up: true, icon: "Eye" },
    { label: "Prenotazioni", value: 12, change: "+32%", up: true, icon: "Calendar" },
  ],
  construction: [
    { label: "Cantieri Attivi", value: 6, change: "+2", up: true, icon: "HardHat" },
    { label: "Revenue Mensile", value: 85000, prefix: "€", change: "+18%", up: true, icon: "DollarSign" },
    { label: "Preventivi", value: 14, change: "+22%", up: true, icon: "FileText" },
    { label: "Operai Impiegati", value: 28, change: "+4", up: true, icon: "Users" },
  ],
  gardener: [
    { label: "Interventi Oggi", value: 5, change: "+2", up: true, icon: "Scissors" },
    { label: "Revenue Giornata", value: 1450, prefix: "€", change: "+18%", up: true, icon: "DollarSign" },
    { label: "Clienti Ricorrenti", value: 92, change: "+14%", up: true, icon: "Users" },
    { label: "Manutenzioni Sett.", value: 28, change: "+8%", up: true, icon: "Calendar" },
  ],
  veterinary: [
    { label: "Visite Oggi", value: 16, change: "+12%", up: true, icon: "Heart" },
    { label: "Pazienti Registrati", value: 1240, change: "+8%", up: true, icon: "Users" },
    { label: "Revenue Giornata", value: 2850, prefix: "€", change: "+18%", up: true, icon: "DollarSign" },
    { label: "Vaccini Somministrati", value: 8, change: "+4", up: true, icon: "Shield" },
  ],
  tattoo: [
    { label: "Sessioni Oggi", value: 5, change: "+2", up: true, icon: "Camera" },
    { label: "Revenue Giornata", value: 1800, prefix: "€", change: "+28%", up: true, icon: "DollarSign" },
    { label: "Consulenze", value: 8, change: "+15%", up: true, icon: "Calendar" },
    { label: "Portfolio Views", value: 2450, change: "+42%", up: true, icon: "Eye" },
  ],
  childcare: [
    { label: "Bambini Presenti", value: 32, suffix: "/40", change: "+4", up: true, icon: "Baby" },
    { label: "Educatrici Attive", value: 6, change: "0", up: true, icon: "Users" },
    { label: "Rette Mensili", value: 19200, prefix: "€", change: "+12%", up: true, icon: "DollarSign" },
    { label: "Soddisfazione", value: 49, suffix: "/5", change: "+0.1", up: true, icon: "Star" },
  ],
  education: [
    { label: "Studenti Iscritti", value: 248, change: "+18%", up: true, icon: "GraduationCap" },
    { label: "Corsi Attivi", value: 14, change: "+3", up: true, icon: "BookOpen" },
    { label: "Revenue Mensile", value: 24800, prefix: "€", change: "+22%", up: true, icon: "DollarSign" },
    { label: "Tasso Completamento", value: 87, suffix: "%", change: "+5%", up: true, icon: "CheckCircle" },
  ],
  events: [
    { label: "Eventi Prossimi", value: 8, change: "+3", up: true, icon: "Calendar" },
    { label: "Revenue Mese", value: 34500, prefix: "€", change: "+28%", up: true, icon: "DollarSign" },
    { label: "Partecipanti Tot.", value: 1240, change: "+35%", up: true, icon: "Users" },
    { label: "Feedback Medio", value: 47, suffix: "/5", change: "+0.3", up: true, icon: "Star" },
  ],
  logistics: [
    { label: "Spedizioni Oggi", value: 42, change: "+18%", up: true, icon: "Truck" },
    { label: "Revenue", value: 8750, prefix: "€", change: "+22%", up: true, icon: "DollarSign" },
    { label: "Consegne Puntuali", value: 94, suffix: "%", change: "+2%", up: true, icon: "CheckCircle" },
    { label: "Mezzi Attivi", value: 12, suffix: "/15", change: "80%", up: true, icon: "Navigation" },
  ],
};

// ── Sector-specific recent data ──
const SECTOR_TABLE_DATA: Record<string, { headers: string[]; rows: string[][] }> = {
  food: {
    headers: ["Ordine", "Cliente", "Piatti", "Totale", "Stato", "Ora"],
    rows: [
      ["#1247", "Marco Rossi", "Carbonara x2, Tiramisù", "€38", "✅ Servito", "13:45"],
      ["#1248", "Laura Bianchi", "Pizza Margherita x2, Birra", "€28", "🔥 In preparazione", "13:52"],
      ["#1249", "Giovanni Paoli", "Risotto Funghi, Tagliata", "€42", "📦 Delivery", "14:00"],
      ["#1250", "Anna Verdi", "Bruschetta, Lasagna, Caffè", "€24", "✅ Servito", "14:08"],
      ["#1251", "Roberto Esposito", "Spaghetti Vongole, Branzino", "€48", "🔥 In preparazione", "14:15"],
      ["#1252", "Francesca Villa", "Antipasto Misto, Gnocchi", "€32", "⏳ In attesa", "14:22"],
      ["#1253", "Luca Marchetti", "Pizza Diavola x3, Fritti", "€35", "✅ Servito", "14:28"],
      ["#1254", "Sara Conti", "Insalata Caesar, Panna Cotta", "€22", "🔥 In preparazione", "14:35"],
      ["#1255", "Davide Romano", "Tagliatelle Ragù, Vino", "€28", "⏳ In attesa", "14:40"],
      ["#1256", "Elena Martini", "Cacio e Pepe, Supplì x2", "€26", "✅ Servito", "14:48"],
    ],
  },
  beauty: {
    headers: ["ID", "Cliente", "Trattamento", "Operatrice", "Importo", "Stato"],
    rows: [
      ["APP-201", "Giulia Ferretti", "Taglio + Colore", "Maria", "€85", "✅ Completato"],
      ["APP-202", "Alessia Romano", "Manicure Spa", "Laura", "€35", "🔄 In corso"],
      ["APP-203", "Chiara Moretti", "Trattamento Viso", "Sara", "€120", "📅 14:30"],
      ["APP-204", "Valentina Costa", "Piega + Trattamento", "Maria", "€55", "📅 15:00"],
      ["APP-205", "Martina Russo", "Pedicure + Smalto Gel", "Laura", "€45", "📅 15:30"],
      ["APP-206", "Sofia Ricci", "Extension Ciglia", "Giulia", "€90", "📅 16:00"],
      ["APP-207", "Aurora Galli", "Ceretta Totale", "Sara", "€65", "📅 16:30"],
      ["APP-208", "Giorgia Greco", "Hair Spa + Maschera", "Maria", "€48", "📅 17:00"],
      ["APP-209", "Federica Neri", "Sopracciglia + Tinta", "Laura", "€25", "✅ Completato"],
      ["APP-210", "Eleonora Bruno", "Pacchetto Sposa", "Team", "€280", "📅 Domani"],
    ],
  },
  healthcare: {
    headers: ["ID", "Paziente", "Tipo Visita", "Dottore", "Importo", "Esito"],
    rows: [
      ["VIS-301", "Antonio Verdi", "Cardiologica + ECG", "Dr. Bianchi", "€150", "✅ Refertato"],
      ["VIS-302", "Maria Conti", "Ecografia", "Dr. Rossi", "€120", "🔄 In corso"],
      ["VIS-303", "Roberto Esposito", "Ortopedica + RX", "Dr. Neri", "€180", "📅 15:00"],
      ["VIS-304", "Teresa Russo", "Dermatologica", "Dr.ssa Verdi", "€90", "📅 15:30"],
      ["VIS-305", "Paolo Ferraro", "Oculistica", "Dr. Costa", "€100", "📅 16:00"],
      ["VIS-306", "Lucia Marino", "Ginecologica", "Dr.ssa Galli", "€130", "✅ Refertato"],
      ["VIS-307", "Franco Romano", "Pneumologica", "Dr. Bianchi", "€120", "📅 16:30"],
      ["VIS-308", "Carla Colombo", "Endocrinologica", "Dr.ssa Verdi", "€140", "📅 Domani"],
      ["VIS-309", "Stefano Ricci", "Controllo Annuale", "Dr. Rossi", "€80", "✅ Refertato"],
      ["VIS-310", "Angela Greco", "Fisioterapia", "Dr. Neri", "€60", "🔄 In corso"],
    ],
  },
  hospitality: {
    headers: ["Camera", "Ospite", "Check-in", "Notti", "Importo", "Stato"],
    rows: [
      ["Suite 201", "J. Smith (USA)", "Oggi", "5", "€1.250", "✅ Arrivato"],
      ["Junior 105", "Fam. Müller (DE)", "Oggi", "3", "€540", "⏳ In arrivo"],
      ["Classic 302", "M. Dupont (FR)", "Ieri", "7", "€980", "✅ Soggiorno"],
      ["Suite 401", "K. Tanaka (JP)", "Oggi", "4", "€1.100", "⏳ In arrivo"],
      ["Classic 108", "A. García (ES)", "2gg fa", "5", "€750", "✅ Soggiorno"],
      ["Deluxe 203", "L. Rossi (IT)", "Oggi", "2", "€440", "✅ Arrivato"],
      ["Junior 110", "P. Johnson (UK)", "Domani", "6", "€1.080", "📅 Prenotato"],
      ["Suite 501", "R. Chen (CN)", "Domani", "3", "€990", "📅 Prenotato"],
    ],
  },
  ncc: {
    headers: ["Corsa", "Cliente", "Tratta", "Veicolo", "Importo", "Stato"],
    rows: [
      ["NCC-401", "Hotel Belvedere", "Aeroporto → Positano", "Mercedes S", "€180", "✅ Completata"],
      ["NCC-402", "Fam. De Luca", "Tour Costiera 8h", "Sprinter", "€450", "🔄 In corso"],
      ["NCC-403", "Tour Op. Amalfi", "Ravello → Napoli", "E-Class", "€120", "📅 15:00"],
      ["NCC-404", "Hotel Caruso", "Napoli → Ravello", "Mercedes S", "€160", "📅 16:30"],
      ["NCC-405", "Sig. Weber", "Positano → Capri (boat)", "SUV + Barca", "€380", "📅 Domani"],
      ["NCC-406", "Agenzia Roma", "Roma → Amalfi", "Sprinter 8pax", "€520", "📅 Domani"],
      ["NCC-407", "Hotel Palazzo", "Transfer Aeroporto", "E-Class", "€90", "✅ Completata"],
      ["NCC-408", "Sig.ra Johnson", "Pompei + Sorrento", "Mercedes S", "€280", "📅 22 Mar"],
    ],
  },
  fitness: {
    headers: ["ID", "Membro", "Attività", "Trainer", "Orario", "Stato"],
    rows: [
      ["FIT-101", "Marco Rossi", "CrossFit", "Luca T.", "09:00", "✅ Completato"],
      ["FIT-102", "Sara Bianchi", "Yoga Flow", "Anna M.", "10:00", "🔄 In corso"],
      ["FIT-103", "Davide Neri", "Personal Training", "Luca T.", "11:00", "📅 Prossimo"],
      ["FIT-104", "Elena Costa", "Spinning", "Marco P.", "12:00", "📅 Prossimo"],
      ["FIT-105", "Paolo Verdi", "Functional", "Anna M.", "14:00", "📅 Prossimo"],
      ["FIT-106", "Lucia Romano", "Pilates", "Sara L.", "15:00", "📅 Prossimo"],
      ["FIT-107", "Andrea Ricci", "Boxe", "Marco P.", "16:00", "📅 Prossimo"],
      ["FIT-108", "Martina Greco", "TRX", "Luca T.", "17:00", "📅 Prossimo"],
    ],
  },
  retail: {
    headers: ["Scontrino", "Cliente", "Articoli", "Totale", "Pagamento", "Ora"],
    rows: [
      ["#4501", "Walk-in", "Giacca Lino, Camicia", "€189", "Carta", "10:15"],
      ["#4502", "Giulia F.", "Borsa Premium", "€245", "Contanti", "10:42"],
      ["#4503", "Online", "Scarpe x2, Accessori", "€178", "PayPal", "11:08"],
      ["#4504", "Marco R.", "Completo Uomo", "€320", "Carta", "11:35"],
      ["#4505", "Walk-in", "T-Shirt x3", "€87", "Carta", "12:00"],
      ["#4506", "Anna V.", "Vestito Sera", "€195", "Carta", "12:28"],
      ["#4507", "Online", "Accessori Set", "€65", "Bonifico", "13:10"],
      ["#4508", "Sara M.", "Cappotto Cashmere", "€450", "Carta", "13:45"],
    ],
  },
  beach: {
    headers: ["Postazione", "Cliente", "Tipo", "Periodo", "Importo", "Stato"],
    rows: [
      ["A-12", "Fam. Rossi", "Ombrellone + 2 lettini", "Giornaliero", "€45", "✅ Occupato"],
      ["B-05", "Sig.ra Bianchi", "Ombrellone Premium", "Settimanale", "€280", "✅ Occupato"],
      ["C-08", "Fam. Esposito", "Gazebo VIP", "Giornaliero", "€120", "✅ Occupato"],
      ["A-18", "Marco Neri", "Lettino singolo", "Giornaliero", "€15", "✅ Occupato"],
      ["D-02", "Hotel Belvedere", "10 Ombrelloni", "Stagionale", "€4.500", "✅ Abbonamento"],
      ["B-14", "Prenotazione Web", "Ombrellone + 2 lettini", "Domani", "€45", "📅 Prenotato"],
      ["A-22", "Walk-in", "2 Lettini", "Pomeriggio", "€20", "⏳ In arrivo"],
    ],
  },
  bakery: {
    headers: ["Ordine", "Cliente", "Prodotti", "Totale", "Tipo", "Stato"],
    rows: [
      ["#B-401", "Pasticceria Roma", "Cornetti x50, Bombe x30", "€95", "B2B", "✅ Consegnato"],
      ["#B-402", "Anna Verdi", "Torta Compleanno + Dolcetti", "€85", "Su misura", "🔥 In preparazione"],
      ["#B-403", "Walk-in", "Pane Integrale x3, Focaccia", "€12", "Banco", "✅ Venduto"],
      ["#B-404", "Bar Centrale", "Croissant x40, Danish x20", "€72", "B2B", "📅 Domani 05:00"],
      ["#B-405", "Maria Rossi", "Colomba Artigianale", "€28", "Preordine", "📅 Pasqua"],
      ["#B-406", "Evento Aziendale", "Buffet dolce 50 pax", "€320", "Catering", "🔥 In preparazione"],
    ],
  },
  plumber: {
    headers: ["Ticket", "Cliente", "Intervento", "Zona", "Importo", "Stato"],
    rows: [
      ["INT-201", "Marco Rossi", "Perdita tubo bagno", "Roma Nord", "€180", "✅ Completato"],
      ["INT-202", "Cond. Via Roma 15", "Sostituzione caldaia", "Centro", "€2.400", "🔄 In corso"],
      ["INT-203", "Laura Bianchi", "Scarico intasato", "Trastevere", "€95", "📅 15:00"],
      ["INT-204", "Ufficio Verdi Srl", "Impianto idraulico", "EUR", "€4.800", "📅 Domani"],
      ["INT-205", "Anna Conti", "Riparazione rubinetto", "Prati", "€65", "📅 16:30"],
      ["INT-206", "Rest. Da Mario", "Lavastoviglie industr.", "Testaccio", "€350", "🔄 In corso"],
    ],
  },
  electrician: {
    headers: ["Ticket", "Cliente", "Intervento", "Zona", "Importo", "Stato"],
    rows: [
      ["EL-301", "Fam. Bianchi", "Quadro elettrico", "Milano Nord", "€450", "✅ Completato"],
      ["EL-302", "Ufficio Tech Srl", "Cablaggio strutturato", "Centro", "€3.200", "🔄 In corso"],
      ["EL-303", "Marco Verdi", "Impianto fotovoltaico", "Monza", "€8.500", "📅 Sopralluogo"],
      ["EL-304", "Cond. Via Dante", "Messa a norma", "Brera", "€5.600", "📅 Preventivo"],
      ["EL-305", "Rest. Stellato", "Illuminazione design", "Navigli", "€1.800", "🔄 In corso"],
      ["EL-306", "Villa Rossi", "Domotica completa", "Brianza", "€12.000", "📅 Progetto"],
    ],
  },
  veterinary: {
    headers: ["Visita", "Proprietario", "Paziente", "Tipo", "Importo", "Stato"],
    rows: [
      ["VET-101", "Maria Rossi", "Luna (Golden)", "Vaccino annuale", "€45", "✅ Completato"],
      ["VET-102", "Paolo Neri", "Micio (Persiano)", "Sterilizzazione", "€180", "🔄 In corso"],
      ["VET-103", "Laura Verdi", "Rex (Pastore)", "Ortopedia", "€320", "📅 15:00"],
      ["VET-104", "Anna Conti", "Nemo (Pesce rosso)", "Consulenza", "€25", "📅 15:30"],
      ["VET-105", "Fam. Esposito", "Birba (Meticcio)", "Check-up completo", "€90", "📅 16:00"],
      ["VET-106", "Giulia Ferretti", "Oscar (Labrador)", "Ecografia", "€120", "📅 Domani"],
    ],
  },
  tattoo: {
    headers: ["ID", "Cliente", "Progetto", "Artista", "Importo", "Stato"],
    rows: [
      ["TAT-101", "Marco R.", "Sleeve braccio dx", "Alex Art", "€800", "🔄 Sessione 3/5"],
      ["TAT-102", "Sara B.", "Minimal polso", "Luna Ink", "€120", "📅 14:30"],
      ["TAT-103", "Davide N.", "Cover-up schiena", "Alex Art", "€600", "📅 16:00"],
      ["TAT-104", "Elena C.", "Watercolor coscia", "Jade", "€450", "📅 Domani"],
      ["TAT-105", "Walk-in", "Scritta piccola", "Luna Ink", "€80", "⏳ In attesa"],
      ["TAT-106", "Online", "Consulenza design", "Alex Art", "€0", "📅 Sabato"],
    ],
  },
  legal: {
    headers: ["Pratica", "Cliente", "Tipo", "Avvocato", "Valore", "Stato"],
    rows: [
      ["LEG-501", "Rossi Srl", "Contenzioso civile", "Avv. Bianchi", "€8.500", "🔄 In corso"],
      ["LEG-502", "Mario Verdi", "Divorzio consensuale", "Avv. Neri", "€3.200", "✅ Concluso"],
      ["LEG-503", "Tech Corp", "Contrattualistica", "Avv. Bianchi", "€4.800", "📅 Revisione"],
      ["LEG-504", "Anna Conti", "Successione", "Avv. Romano", "€2.400", "🔄 In corso"],
      ["LEG-505", "Cond. Via Roma", "Recupero crediti", "Avv. Neri", "€1.800", "📅 Udienza 28/3"],
    ],
  },
  accountant: {
    headers: ["Pratica", "Cliente", "Tipo", "Scadenza", "Importo", "Stato"],
    rows: [
      ["FIS-201", "Rossi & C. Sas", "Bilancio 2025", "30/04", "€2.800", "🔄 In lavorazione"],
      ["FIS-202", "Dr. Bianchi", "730 Precompilato", "30/09", "€180", "📅 Da iniziare"],
      ["FIS-203", "Tech Srl", "IVA Trimestrale", "16/03", "€450", "✅ Inviato"],
      ["FIS-204", "Fam. Verdi", "ISEE 2026", "Urgente", "€60", "⏳ In attesa doc."],
      ["FIS-205", "Bar Centrale", "F24 + Libro giornale", "16/03", "€320", "✅ Completato"],
      ["FIS-206", "Startup AI Srl", "Apertura P.IVA + SCIA", "ASAP", "€800", "🔄 In lavorazione"],
    ],
  },
  garage: {
    headers: ["Ticket", "Cliente", "Veicolo", "Intervento", "Importo", "Stato"],
    rows: [
      ["OFF-101", "Marco R.", "Audi A4 2022", "Tagliando + Freni", "€480", "🔄 In officina"],
      ["OFF-102", "Laura B.", "Fiat 500 2020", "Revisione + Gomme", "€320", "✅ Pronta"],
      ["OFF-103", "Paolo N.", "BMW X3 2023", "Cambio olio + Filtri", "€280", "📅 Domani"],
      ["OFF-104", "Anna V.", "Mercedes GLA", "Diagnosi elettronica", "€90", "🔄 In diagnosi"],
      ["OFF-105", "Davide E.", "VW Golf 8", "Carrozzeria laterale", "€1.200", "📅 Preventivo"],
      ["OFF-106", "Sara M.", "Toyota Yaris", "Climatizzatore", "€180", "📅 Mercoledì"],
    ],
  },
  agriturismo: {
    headers: ["Camera", "Ospite", "Check-in", "Notti", "Importo", "Stato"],
    rows: [
      ["Ulivo", "Fam. Bianchi", "Oggi", "3", "€420", "✅ Arrivato"],
      ["Quercia", "Fam. Rossi", "Ieri", "5", "€750", "✅ Soggiorno"],
      ["Lavanda", "M. Dupont (FR)", "Oggi", "4", "€560", "⏳ In arrivo"],
      ["Girasole", "K. Weber (DE)", "Domani", "7", "€980", "📅 Prenotato"],
      ["Olivo", "L. Smith (UK)", "2gg fa", "3", "€450", "✅ Soggiorno"],
    ],
  },
  cleaning: {
    headers: ["Ticket", "Cliente", "Servizio", "Squadra", "Importo", "Stato"],
    rows: [
      ["CL-101", "Ufficio Tech Srl", "Pulizia ordinaria", "Squadra A", "€120", "✅ Completato"],
      ["CL-102", "Cond. Via Roma", "Scale + Androni", "Squadra B", "€180", "🔄 In corso"],
      ["CL-103", "Rest. Da Mario", "Sanificazione", "Squadra A", "€250", "📅 15:00"],
      ["CL-104", "Uffici Verdi Srl", "Pulizia profonda", "Squadra C", "€320", "📅 Domani"],
      ["CL-105", "Cantiere Bianchi", "Post-cantiere", "Squadra B", "€480", "📅 Giovedì"],
      ["CL-106", "Hotel Stella", "Vetri esterni", "Squadra D", "€380", "📅 Venerdì"],
    ],
  },
  photographer: {
    headers: ["Shooting", "Cliente", "Tipo", "Location", "Importo", "Stato"],
    rows: [
      ["PH-201", "Rossi & Bianchi", "Matrimonio", "Villa Aurelia", "€2.800", "✅ Consegnato"],
      ["PH-202", "Tech Srl", "Corporate", "Ufficio Milano", "€800", "📅 22/03"],
      ["PH-203", "Sara Conti", "Portrait", "Studio", "€180", "🔄 Editing"],
      ["PH-204", "Baby Emma", "Newborn", "Studio", "€250", "📅 25/03"],
      ["PH-205", "Rist. Stellato", "Food & Beverage", "Location", "€450", "📅 28/03"],
      ["PH-206", "Fam. Verdi", "Family Portrait", "Parco", "€220", "✅ Consegnato"],
    ],
  },
  construction: {
    headers: ["Cantiere", "Cliente", "Tipo Lavoro", "Importo", "Avanzamento", "Stato"],
    rows: [
      ["C-01", "Fam. Rossi", "Ristrutturaz. completa", "€85.000", "72%", "🔄 In corso"],
      ["C-02", "Cond. Via Dante", "Cappotto termico", "€120.000", "45%", "🔄 In corso"],
      ["C-03", "Villa Conti", "Ampliamento", "€65.000", "15%", "📅 Avviato"],
      ["C-04", "Ufficio Bianchi", "Controsoffitto", "€18.000", "100%", "✅ Completato"],
      ["C-05", "Fam. Esposito", "Impermeabilizz.", "€12.000", "0%", "📅 Sopralluogo"],
      ["C-06", "Rest. Nuovo", "Ristrutturaz. locale", "€42.000", "60%", "🔄 In corso"],
    ],
  },
  gardener: {
    headers: ["Ticket", "Cliente", "Servizio", "Zona", "Importo", "Stato"],
    rows: [
      ["GR-101", "Villa Rossi", "Manutenzione mensile", "EUR", "€180", "✅ Completato"],
      ["GR-102", "Cond. Via Roma", "Potatura siepi", "Centro", "€320", "📅 Domani"],
      ["GR-103", "Fam. Bianchi", "Rifacimento prato", "Trastevere", "€2.400", "🔄 In corso"],
      ["GR-104", "Villa Conti", "Impianto irrigazione", "Parioli", "€1.800", "📅 Preventivo"],
      ["GR-105", "Hotel Garden", "Manutenzione sett.", "Centro", "€480/mese", "✅ Attivo"],
      ["GR-106", "Fam. Verdi", "Trattamento fitosan.", "Monteverde", "€120", "📅 Mercoledì"],
    ],
  },
  childcare: {
    headers: ["Bambino", "Età", "Sezione", "Orario", "Retta", "Stato"],
    rows: [
      ["Sofia R.", "3 anni", "Farfalle", "08:00-16:00", "€580", "✅ Presente"],
      ["Luca M.", "4 anni", "Coccinelle", "08:30-13:00", "€380", "❌ Assente"],
      ["Emma V.", "2 anni", "Pulcini", "08:00-16:00", "€620", "✅ Presente"],
      ["Marco B.", "3 anni", "Farfalle", "08:00-16:00", "€580", "✅ Presente"],
      ["Giulia N.", "5 anni", "Api", "08:30-16:30", "€580", "✅ Presente"],
      ["Leonardo C.", "4 anni", "Coccinelle", "08:00-13:00", "€380", "✅ Presente"],
    ],
  },
  education: {
    headers: ["Corso", "Studente", "Modulo", "Progress", "Voto", "Stato"],
    rows: [
      ["Full Stack", "Marco V.", "React Advanced", "85%", "28/30", "🔄 In corso"],
      ["Data Science", "Sara B.", "ML Algorithms", "100%", "30/30", "✅ Completato"],
      ["UX Design", "Luca N.", "Prototyping", "60%", "—", "🔄 In corso"],
      ["Marketing", "Elena C.", "Google Ads", "45%", "—", "🔄 In corso"],
      ["Cybersecurity", "Davide E.", "Ethical Hacking", "30%", "—", "📅 Iniziato"],
      ["AI/ML", "Anna R.", "Neural Networks", "92%", "29/30", "✅ Completato"],
    ],
  },
  events: {
    headers: ["Evento", "Cliente", "Tipo", "Data", "Budget", "Stato"],
    rows: [
      ["EV-201", "Rossi Corp", "Gala Aziendale", "28/03", "€18.000", "🔄 In preparaz."],
      ["EV-202", "Bianchi & Neri", "Matrimonio", "12/04", "€32.000", "📅 Confermato"],
      ["EV-203", "Tech Srl", "Team Building", "05/04", "€4.500", "📅 Preventivo"],
      ["EV-204", "Fam. Conti", "50° Anniversario", "20/03", "€8.000", "✅ Completato"],
      ["EV-205", "Camera Commercio", "Congresso", "15/04", "€12.000", "🔄 In preparaz."],
      ["EV-206", "Sara M.", "Compleanno 30", "22/03", "€3.200", "📅 Confermato"],
    ],
  },
  logistics: {
    headers: ["Spedizione", "Mittente", "Tratta", "Mezzo", "Importo", "Stato"],
    rows: [
      ["L-428", "Tech Srl", "Milano → Roma", "Furgone #3", "€180", "✅ Consegnato"],
      ["L-429", "Fashion SpA", "Torino → Napoli", "Bilico #1", "€420", "🔄 In transito"],
      ["L-430", "Food Corp", "Bologna → Bari", "Frigo #2", "€350", "🔄 In transito"],
      ["L-431", "Auto Parts", "Roma → Milano", "Furgone #5", "€220", "📅 Ritiro domani"],
      ["L-432", "Pharma Srl", "Napoli → Firenze", "Express #4", "€280", "📅 Urgente"],
      ["L-433", "Wine Export", "Verona → Hamburg", "Container", "€850", "📅 Internazionale"],
    ],
  },
};

// ── Sector-specific activity feeds ──
const SECTOR_ACTIVITIES: Record<string, { text: string; time: string; type: "success" | "info" | "ai" | "warning" }[]> = {
  food: [
    { text: "Nuovo ordine Tavolo 7: Carbonara x2, Tiramisù — €38", time: "2 min fa", type: "success" },
    { text: "Chef AI: piatto esaurito 'Branzino' rimosso automaticamente", time: "8 min fa", type: "ai" },
    { text: "Pagamento €128 ricevuto da Marco Rossi", time: "15 min fa", type: "success" },
    { text: "Delivery: ordine #1245 consegnato in 28 min", time: "22 min fa", type: "info" },
    { text: "Review Shield: intercettata recensione 2★, risposta suggerita", time: "35 min fa", type: "ai" },
    { text: "Magazzino: scorta mozzarella sotto soglia, ordine suggerito", time: "1 ora fa", type: "warning" },
    { text: "Prenotazione confermata: 6 persone ore 20:30", time: "1 ora fa", type: "info" },
    { text: "Social AI: post Instagram pranzo pubblicato — 340 impression", time: "2 ore fa", type: "ai" },
  ],
  beauty: [
    { text: "Nuovo appuntamento: Giulia F. — Taglio + Colore ore 15:00", time: "3 min fa", type: "success" },
    { text: "Beauty Advisor AI: suggerito trattamento keratina a Chiara M.", time: "10 min fa", type: "ai" },
    { text: "Pagamento €85 ricevuto da Alessia Romano", time: "18 min fa", type: "success" },
    { text: "Reminder inviato a 8 clienti per appuntamenti domani", time: "30 min fa", type: "info" },
    { text: "No-show evitato: Valentina C. confermata via WhatsApp", time: "45 min fa", type: "ai" },
    { text: "Prodotto venduto: Shampoo Premium — €24", time: "1 ora fa", type: "info" },
    { text: "Portfolio: 3 nuove foto Before/After caricate", time: "2 ore fa", type: "info" },
    { text: "Social Beauty AI: Reel Instagram generato con 520 views", time: "3 ore fa", type: "ai" },
  ],
  healthcare: [
    { text: "Check-in paziente: Antonio Verdi — Cardiologia", time: "5 min fa", type: "success" },
    { text: "Referto completato: ECG Maria Conti — da firmare", time: "12 min fa", type: "info" },
    { text: "Patient AI: follow-up suggerito per Roberto E. (3 mesi)", time: "20 min fa", type: "ai" },
    { text: "Fattura SDI #2847 inviata — €150", time: "30 min fa", type: "success" },
    { text: "Reminder SMS inviato a 12 pazienti per domani", time: "1 ora fa", type: "info" },
    { text: "Compliance Guard: consenso privacy aggiornato per 3 pazienti", time: "2 ore fa", type: "ai" },
    { text: "Telemedicina: videoconsulto Dr. Bianchi completato", time: "2 ore fa", type: "info" },
    { text: "Prescrizione digitale inviata a farmacia — Teresa R.", time: "3 ore fa", type: "success" },
  ],
  fitness: [
    { text: "Check-in: Marco R. — CrossFit ore 09:00", time: "3 min fa", type: "success" },
    { text: "Nuovo abbonamento Premium attivato: Sara B. — €89/mese", time: "12 min fa", type: "success" },
    { text: "Fitness AI: piano allenamento personalizzato generato per Davide N.", time: "25 min fa", type: "ai" },
    { text: "Classe Yoga ore 10:00 — 18/20 posti occupati", time: "40 min fa", type: "info" },
    { text: "Reminder rinnovo inviato a 14 membri in scadenza", time: "1 ora fa", type: "info" },
    { text: "Body Scan AI: analisi composizione corporea completata", time: "2 ore fa", type: "ai" },
    { text: "Pagamento ricevuto: €267 da 3 rinnovi", time: "3 ore fa", type: "success" },
    { text: "Attrezzatura: tapis roulant #3 manutenzione programmata", time: "4 ore fa", type: "warning" },
  ],
  hospitality: [
    { text: "Check-in Suite 201: J. Smith (USA) — 5 notti", time: "5 min fa", type: "success" },
    { text: "Room Service: ordine camera 302 — €45", time: "12 min fa", type: "info" },
    { text: "Concierge AI: prenotato ristorante per Fam. Müller", time: "20 min fa", type: "ai" },
    { text: "Housekeeping: camera 108 pronta, notifica ospite inviata", time: "35 min fa", type: "success" },
    { text: "Spa: prenotazione massaggio ore 16 — K. Tanaka", time: "50 min fa", type: "info" },
    { text: "Revenue Manager AI: tariffa weekend ottimizzata +12%", time: "1 ora fa", type: "ai" },
    { text: "Check-out camera 205: feedback 5★ ricevuto", time: "2 ore fa", type: "success" },
    { text: "Minibar: rifornimento richiesto camere 301, 405", time: "3 ore fa", type: "warning" },
  ],
  hotel: [
    { text: "Check-in Suite 201: J. Smith (USA) — 5 notti", time: "5 min fa", type: "success" },
    { text: "Concierge AI: tour Costiera prenotato per camera 302", time: "15 min fa", type: "ai" },
    { text: "Room Service ordine €65 — camera 401", time: "25 min fa", type: "info" },
    { text: "Housekeeping completato: 8 camere pronte", time: "40 min fa", type: "success" },
    { text: "Revenue AI: prezzo dinamico aggiornato per weekend", time: "1 ora fa", type: "ai" },
    { text: "Prenotazione Booking.com: Deluxe 3 notti — €540", time: "2 ore fa", type: "success" },
    { text: "Guest Feedback: media 4.8★ questa settimana", time: "3 ore fa", type: "info" },
    { text: "Manutenzione: AC camera 110 da verificare", time: "4 ore fa", type: "warning" },
  ],
  ncc: [
    { text: "Corsa NCC-402 completata: Fam. De Luca — Tour Costiera €450", time: "5 min fa", type: "success" },
    { text: "Dispatch AI: autista assegnato per NCC-403 — Marco P.", time: "10 min fa", type: "ai" },
    { text: "Nuova prenotazione: Hotel Caruso → Napoli — €160", time: "22 min fa", type: "success" },
    { text: "Fleet Monitor: Mercedes S — manutenzione tra 1.200 km", time: "35 min fa", type: "warning" },
    { text: "Pricing AI: tariffa alta stagione ottimizzata +18%", time: "1 ora fa", type: "ai" },
    { text: "Pagamento €520 ricevuto da Agenzia Roma", time: "2 ore fa", type: "success" },
    { text: "Tour Operator: richiesta preventivo 8 transfer luglio", time: "3 ore fa", type: "info" },
    { text: "Rating update: 4.9★ su Google (nuova recensione 5★)", time: "4 ore fa", type: "info" },
  ],
  retail: [
    { text: "Vendita #4508: Cappotto Cashmere — €450", time: "3 min fa", type: "success" },
    { text: "Merchandising AI: riassortimento taglia M giacche suggerito", time: "15 min fa", type: "ai" },
    { text: "Pagamento online: ordine #4503 — €178 spedito", time: "25 min fa", type: "success" },
    { text: "Loyalty: Giulia F. ha raggiunto status Gold — 2.400 punti", time: "40 min fa", type: "info" },
    { text: "Inventory Alert: Stock scarpe nere 42 sotto soglia", time: "1 ora fa", type: "warning" },
    { text: "Social Commerce AI: post shoppable creato — 8 click", time: "2 ore fa", type: "ai" },
    { text: "Reso processato: Sara M. — buono €65 emesso", time: "3 ore fa", type: "info" },
    { text: "WhatsApp: campagna flash sale inviata a 340 clienti", time: "4 ore fa", type: "ai" },
  ],
  beach: [
    { text: "Prenotazione online: Fam. Rossi — Ombrellone A-12, domani", time: "3 min fa", type: "success" },
    { text: "Bar AI: ordine bevande spiaggia — postazione C-08, €24", time: "10 min fa", type: "ai" },
    { text: "Abbonamento stagionale attivato: Hotel Belvedere — €4.500", time: "25 min fa", type: "success" },
    { text: "Meteo AI: previsto bel tempo, +30% prenotazioni suggerite", time: "40 min fa", type: "ai" },
    { text: "Walk-in: 14 ingressi pomeridiani registrati", time: "1 ora fa", type: "info" },
    { text: "Pagamento POS: totale mattinata €1.240", time: "2 ore fa", type: "success" },
    { text: "Manutenzione: ombrellone B-09 da sostituire", time: "3 ore fa", type: "warning" },
    { text: "Social AI: foto tramonto pubblicata — 890 like", time: "4 ore fa", type: "ai" },
  ],
  bakery: [
    { text: "Ordine B2B: Bar Centrale — 40 croissant + 20 danish per domani 05:00", time: "5 min fa", type: "success" },
    { text: "Sfornata completata: 120 cornetti classici pronti", time: "15 min fa", type: "info" },
    { text: "Baker AI: ricetta ottimizzata per colomba artigianale", time: "25 min fa", type: "ai" },
    { text: "Preordine torta compleanno: Anna V. — €85 per sabato", time: "40 min fa", type: "success" },
    { text: "Scorte: farina 00 sotto soglia, ordine automatico inviato", time: "1 ora fa", type: "warning" },
    { text: "Pagamento catering evento aziendale — €320", time: "2 ore fa", type: "success" },
    { text: "Social AI: foto pane artigianale postata — 240 interazioni", time: "3 ore fa", type: "ai" },
    { text: "HACCP: registrazione temperatura frigo completata ✓", time: "4 ore fa", type: "info" },
  ],
  plumber: [
    { text: "Intervento INT-201 completato: perdita tubo bagno — €180", time: "5 min fa", type: "success" },
    { text: "Dispatch AI: tecnico assegnato per INT-203 — zona Trastevere", time: "12 min fa", type: "ai" },
    { text: "Preventivo inviato: impianto idraulico Ufficio Verdi — €4.800", time: "30 min fa", type: "info" },
    { text: "Pagamento ricevuto: Cond. Via Roma — €2.400", time: "1 ora fa", type: "success" },
    { text: "Urgenza: chiamata pronto intervento — perdita acqua zona Prati", time: "1 ora fa", type: "warning" },
    { text: "Inventory AI: tubo rame 22mm sotto scorta, ordine suggerito", time: "2 ore fa", type: "ai" },
    { text: "Fattura elettronica #891 emessa — €350", time: "3 ore fa", type: "success" },
    { text: "Review: 5★ da Marco Rossi — 'Rapidi e professionali'", time: "4 ore fa", type: "info" },
  ],
  electrician: [
    { text: "Intervento EL-301 completato: quadro elettrico Fam. Bianchi — €450", time: "5 min fa", type: "success" },
    { text: "Diagnostica AI: analisi consumi anomali Villa Rossi", time: "15 min fa", type: "ai" },
    { text: "Preventivo fotovoltaico inviato: Marco Verdi — €8.500", time: "30 min fa", type: "info" },
    { text: "Pagamento €3.200 — cablaggio Ufficio Tech Srl", time: "1 ora fa", type: "success" },
    { text: "Certificazione impianto: Cond. Via Dante — in scadenza", time: "2 ore fa", type: "warning" },
    { text: "Domotica AI: progetto smart home generato", time: "3 ore fa", type: "ai" },
    { text: "Sopralluogo programmato: fotovoltaico Monza — domani 10:00", time: "4 ore fa", type: "info" },
    { text: "Fattura SDI #445 emessa — €1.800", time: "5 ore fa", type: "success" },
  ],
  agriturismo: [
    { text: "Check-in: Fam. Bianchi — Camera Ulivo, 3 notti", time: "5 min fa", type: "success" },
    { text: "Degustazione prenotata: 8 persone ore 17:00 — €160", time: "15 min fa", type: "info" },
    { text: "Farm AI: raccolto pomodori previsto eccellente questa settimana", time: "30 min fa", type: "ai" },
    { text: "Ristorante agriturismo: 22 coperti per cena", time: "1 ora fa", type: "info" },
    { text: "Pagamento soggiorno €680 — Fam. Rossi", time: "2 ore fa", type: "success" },
    { text: "Meteo AI: irrigazione ottimizzata per prossimi 3 giorni", time: "3 ore fa", type: "ai" },
    { text: "Prenotazione Booking: camera Quercia, 5 notti — €750", time: "4 ore fa", type: "success" },
    { text: "Prodotti: olio EVO in esaurimento, nuova spremitura tra 2 sett.", time: "5 ore fa", type: "warning" },
  ],
  cleaning: [
    { text: "Intervento completato: Ufficio Tech Srl — pulizia ordinaria €120", time: "5 min fa", type: "success" },
    { text: "Schedule AI: piano settimanale ottimizzato — 3 spostamenti", time: "15 min fa", type: "ai" },
    { text: "Nuovo contratto: Cond. Via Roma — pulizia scale bi-settimanale €280/mese", time: "30 min fa", type: "success" },
    { text: "Squadra B: completata sanificazione ristorante Da Mario", time: "1 ora fa", type: "info" },
    { text: "Scorte: detergente industriale sotto soglia", time: "2 ore fa", type: "warning" },
    { text: "Quality AI: report controllo qualità inviato a 5 clienti", time: "3 ore fa", type: "ai" },
    { text: "Pagamento €960 ricevuto — Uffici Verdi Srl (trimestrale)", time: "4 ore fa", type: "success" },
    { text: "Feedback 5★: 'Impeccabili come sempre' — Cond. Via Dante", time: "5 ore fa", type: "info" },
  ],
  legal: [
    { text: "Pratica LEG-501 aggiornata: nuova udienza fissata 15/04", time: "5 min fa", type: "info" },
    { text: "Legal AI: analisi contratto Tech Corp completata — 3 criticità", time: "15 min fa", type: "ai" },
    { text: "Consulenza completata: Mario Verdi — divorzio consensuale €3.200", time: "30 min fa", type: "success" },
    { text: "Scadenza: deposito memoria Rossi Srl — entro 22/03", time: "1 ora fa", type: "warning" },
    { text: "Fattura parcella #234 emessa — €4.800", time: "2 ore fa", type: "success" },
    { text: "Compliance AI: aggiornamento normativo privacy segnalato", time: "3 ore fa", type: "ai" },
    { text: "Nuova consulenza programmata: Startup AI — proprietà intellettuale", time: "4 ore fa", type: "info" },
    { text: "Mediazione: accordo raggiunto — Cond. Via Roma vs. Fornitore", time: "5 ore fa", type: "success" },
  ],
  accountant: [
    { text: "Dichiarazione IVA trimestrale Rossi Sas inviata all'AdE", time: "5 min fa", type: "success" },
    { text: "Fiscal AI: anomalia detrazioni rilevata — F.lli Bianchi", time: "15 min fa", type: "ai" },
    { text: "ISEE 2026 completato: Fam. Verdi — consegnato", time: "30 min fa", type: "success" },
    { text: "Scadenza: F24 dipendenti — 16/03 per 8 clienti", time: "1 ora fa", type: "warning" },
    { text: "Pagamento consulenza €800 — Startup AI Srl", time: "2 ore fa", type: "success" },
    { text: "Tax Optimizer AI: risparmio €2.400 trovato per Tech Srl", time: "3 ore fa", type: "ai" },
    { text: "Bilancio 2025 Rossi & C.: bozza completata al 85%", time: "4 ore fa", type: "info" },
    { text: "Nuova P.IVA aperta: regime forfettario — Dr. Neri", time: "5 ore fa", type: "success" },
  ],
  garage: [
    { text: "Tagliando completato: Audi A4 — Marco R. — €480", time: "5 min fa", type: "success" },
    { text: "Diagnosi AI: errore P0301 BMW X3 — cilindro 1 misfire", time: "12 min fa", type: "ai" },
    { text: "Fiat 500 Laura B. pronta per ritiro — notifica inviata", time: "30 min fa", type: "info" },
    { text: "Ricambio ordinato: pastiglie freni Brembo per Mercedes GLA", time: "1 ora fa", type: "info" },
    { text: "Preventivo carrozzeria inviato: VW Golf — €1.200", time: "2 ore fa", type: "success" },
    { text: "Revisione: Toyota Yaris in scadenza — reminder cliente inviato", time: "3 ore fa", type: "warning" },
    { text: "Fleet AI: analisi usura pneumatici flotta completata", time: "4 ore fa", type: "ai" },
    { text: "Fattura #678 emessa — €320 revisione + gomme", time: "5 ore fa", type: "success" },
  ],
  photographer: [
    { text: "Shooting matrimonio completato: 480 foto RAW importate", time: "5 min fa", type: "success" },
    { text: "Editing AI: preset automatico applicato a 120 foto portrait", time: "15 min fa", type: "ai" },
    { text: "Gallery online pubblicata: Matrimonio Rossi — link inviato", time: "30 min fa", type: "info" },
    { text: "Prenotazione: shooting corporate Tech Srl — 22/03 ore 10", time: "1 ora fa", type: "success" },
    { text: "Pagamento €1.200 ricevuto — pacchetto matrimonio Bianchi", time: "2 ore fa", type: "success" },
    { text: "Social AI: portfolio carousel pubblicato — 680 impression", time: "3 ore fa", type: "ai" },
    { text: "Stampa: album 30x30 inviato in produzione — consegna 5gg", time: "4 ore fa", type: "info" },
    { text: "Backup cloud: 42GB caricati su storage sicuro", time: "5 ore fa", type: "info" },
  ],
  construction: [
    { text: "Cantiere Via Roma: gettata fondamenta completata", time: "5 min fa", type: "success" },
    { text: "Project AI: timeline aggiornata — consegna prevista 15/06", time: "15 min fa", type: "ai" },
    { text: "Preventivo ristrutturazione Villa Conti inviato — €85.000", time: "30 min fa", type: "info" },
    { text: "Pagamento SAL #3 ricevuto: €28.000 — Cantiere Bianchi", time: "1 ora fa", type: "success" },
    { text: "Sicurezza: DPI operai cantiere #4 in scadenza — da rinnovare", time: "2 ore fa", type: "warning" },
    { text: "Safety AI: checklist giornaliera completata — 100% conforme", time: "3 ore fa", type: "ai" },
    { text: "Materiale consegnato: 15 t cemento al cantiere Via Dante", time: "4 ore fa", type: "info" },
    { text: "Sopralluogo: nuovo progetto ampliamento — Fam. Esposito", time: "5 ore fa", type: "success" },
  ],
  gardener: [
    { text: "Manutenzione completata: giardino Villa Rossi — €180", time: "5 min fa", type: "success" },
    { text: "Garden AI: piano irrigazione ottimizzato per siccità", time: "15 min fa", type: "ai" },
    { text: "Potatura siepi programmata: Cond. Via Roma — domani 08:00", time: "30 min fa", type: "info" },
    { text: "Preventivo rifacimento prato inviato: €2.400 — Villa Bianchi", time: "1 ora fa", type: "success" },
    { text: "Trattamento fitosanitario: piante malate giardino Verdi", time: "2 ore fa", type: "warning" },
    { text: "Plant AI: identificata malattia fogliare — trattamento suggerito", time: "3 ore fa", type: "ai" },
    { text: "Pagamento €480 ricevuto — contratto annuale Fam. Conti", time: "4 ore fa", type: "success" },
    { text: "Forniture: nuovo rasaerba professionale ordinato", time: "5 ore fa", type: "info" },
  ],
  veterinary: [
    { text: "Visita completata: Luna (Golden) — vaccino annuale €45", time: "5 min fa", type: "success" },
    { text: "Vet AI: analisi sangue Rex — valori nella norma", time: "15 min fa", type: "ai" },
    { text: "Intervento chirurgico programmato: Milo — sterilizzazione domani", time: "30 min fa", type: "info" },
    { text: "Pagamento €280 — intervento ortopedico Buddy", time: "1 ora fa", type: "success" },
    { text: "Reminder vaccini: 6 pazienti con richiamo in scadenza", time: "2 ore fa", type: "warning" },
    { text: "Nutrition AI: piano alimentare personalizzato generato per Bella", time: "3 ore fa", type: "ai" },
    { text: "Nuova registrazione: gattino 'Nuvola' — prima visita", time: "4 ore fa", type: "info" },
    { text: "Farmacia veterinaria: antiparassitario sotto scorta", time: "5 ore fa", type: "warning" },
  ],
  tattoo: [
    { text: "Sessione completata: sleeve braccio Marco — 4h, €480", time: "5 min fa", type: "success" },
    { text: "Design AI: bozza tatuaggio geometrico generata per consulenza", time: "15 min fa", type: "ai" },
    { text: "Consulenza online: Sara — richiesta cover-up, €80 caparra", time: "30 min fa", type: "success" },
    { text: "Portfolio aggiornato: 5 nuovi lavori caricati", time: "1 ora fa", type: "info" },
    { text: "Sterilizzazione: autoclave ciclo completato ✓", time: "2 ore fa", type: "info" },
    { text: "Social AI: time-lapse sessione pubblicato — 1.2K views", time: "3 ore fa", type: "ai" },
    { text: "Materiale: aghi cartridge in esaurimento — ordine suggerito", time: "4 ore fa", type: "warning" },
    { text: "Review Google: 5★ — 'Artista incredibile, super consigliato'", time: "5 ore fa", type: "success" },
  ],
  childcare: [
    { text: "Ingresso registrato: Sofia R. — accompagnata da mamma ore 08:15", time: "5 min fa", type: "success" },
    { text: "Activity AI: programma didattico settimanale generato", time: "15 min fa", type: "ai" },
    { text: "Pasto: pranzo servito a 32 bambini — menù pasta al pomodoro", time: "30 min fa", type: "info" },
    { text: "Comunicazione inviata: foto attività pittura a 28 famiglie", time: "1 ora fa", type: "info" },
    { text: "Retta mensile ricevuta: Fam. Bianchi — €580", time: "2 ore fa", type: "success" },
    { text: "Safety AI: temperatura aule verificata — tutti i valori OK", time: "3 ore fa", type: "ai" },
    { text: "Assenza segnalata: Luca M. — febbre, rientro lunedì", time: "4 ore fa", type: "warning" },
    { text: "Iscrizione nuova: Emma V. — inserimento dal 01/04", time: "5 ore fa", type: "success" },
  ],
  education: [
    { text: "Lezione completata: Corso React Advanced — 24 studenti", time: "5 min fa", type: "success" },
    { text: "Tutor AI: quiz personalizzato generato per modulo 3", time: "15 min fa", type: "ai" },
    { text: "Nuova iscrizione: Marco V. — Corso Full Stack €1.200", time: "30 min fa", type: "success" },
    { text: "Certificato emesso: Sara B. — Data Science completato", time: "1 ora fa", type: "info" },
    { text: "Pagamento rata 3/6 ricevuto: €200 — Davide N.", time: "2 ore fa", type: "success" },
    { text: "Learning AI: tasso completamento modulo 5 sotto media — alert", time: "3 ore fa", type: "warning" },
    { text: "Webinar live: 48 partecipanti connessi — feedback 4.8★", time: "4 ore fa", type: "info" },
    { text: "Content AI: slide corso UX Design aggiornate automaticamente", time: "5 ore fa", type: "ai" },
  ],
  events: [
    { text: "Evento confermato: Gala Aziendale 150 pax — 28/03", time: "5 min fa", type: "success" },
    { text: "Event AI: layout sala ottimizzato per 150 ospiti — 15 tavoli", time: "15 min fa", type: "ai" },
    { text: "Catering confermato: menù degustazione 4 portate — €6.800", time: "30 min fa", type: "info" },
    { text: "Pagamento acconto €12.000 ricevuto — Wedding Rossi", time: "1 ora fa", type: "success" },
    { text: "DJ e luci: fornitore AV confermato per evento 28/03", time: "2 ore fa", type: "info" },
    { text: "Budget AI: riepilogo costi vs. preventivo — margine 22%", time: "3 ore fa", type: "ai" },
    { text: "Location: sala congressi — disponibilità da confermare per 05/04", time: "4 ore fa", type: "warning" },
    { text: "Post-evento: survey soddisfazione inviato a 120 partecipanti", time: "5 ore fa", type: "success" },
  ],
  logistics: [
    { text: "Spedizione #L-428 consegnata: Milano → Roma — on time", time: "3 min fa", type: "success" },
    { text: "Route AI: percorso ottimizzato per 8 consegne — -35 km", time: "12 min fa", type: "ai" },
    { text: "Ritiro programmato: magazzino Torino — domani 06:00", time: "25 min fa", type: "info" },
    { text: "Tracking update: 12 spedizioni in transito — ETA aggiornati", time: "40 min fa", type: "info" },
    { text: "Pagamento €2.400 ricevuto — Tech Srl (contratto mensile)", time: "1 ora fa", type: "success" },
    { text: "Fleet AI: mezzo #7 manutenzione programmata — 15.000 km", time: "2 ore fa", type: "warning" },
    { text: "Nuova tratta attivata: Napoli ↔ Bari — 3 consegne/sett.", time: "3 ore fa", type: "success" },
    { text: "Warehouse: 4 colli in attesa smistamento — priorità alta", time: "4 ore fa", type: "ai" },
  ],
};

// ── Revenue data generator (sector-aware) ──
const MONTHS = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
const generateRevenueData = (sector: string) => {
  const bases: Record<string, number[]> = {
    food: [18, 16, 20, 22, 24, 28, 32, 35, 30, 26, 22, 24],
    beauty: [12, 11, 14, 16, 18, 20, 22, 19, 17, 15, 14, 16],
    healthcare: [28, 30, 32, 34, 36, 34, 30, 28, 35, 38, 40, 42],
    fitness: [22, 24, 28, 26, 24, 20, 16, 14, 26, 30, 28, 24],
    hospitality: [8, 6, 10, 18, 28, 38, 42, 44, 34, 22, 12, 10],
    hotel: [8, 6, 10, 18, 28, 38, 42, 44, 34, 22, 12, 10],
    ncc: [10, 8, 14, 22, 32, 42, 48, 50, 38, 24, 14, 12],
    retail: [20, 18, 22, 24, 26, 24, 28, 22, 20, 24, 30, 38],
    beach: [2, 2, 4, 8, 18, 32, 48, 52, 35, 12, 3, 2],
    bakery: [14, 12, 16, 18, 20, 22, 18, 16, 20, 22, 24, 28],
    plumber: [16, 14, 18, 20, 22, 24, 18, 16, 22, 24, 20, 18],
    electrician: [18, 16, 20, 22, 26, 28, 20, 18, 24, 28, 24, 22],
    agriturismo: [4, 3, 6, 12, 20, 28, 35, 38, 25, 14, 6, 5],
    cleaning: [12, 12, 14, 16, 18, 18, 14, 12, 16, 18, 16, 14],
    legal: [22, 24, 28, 26, 24, 20, 16, 14, 26, 30, 28, 26],
    accountant: [18, 22, 32, 28, 20, 16, 12, 10, 24, 28, 22, 18],
    garage: [18, 16, 22, 24, 26, 22, 18, 16, 24, 28, 24, 20],
    photographer: [6, 4, 8, 12, 18, 24, 28, 26, 22, 14, 8, 10],
    construction: [40, 35, 50, 60, 70, 80, 85, 75, 65, 55, 45, 40],
    gardener: [4, 4, 10, 16, 22, 24, 18, 14, 18, 14, 6, 4],
    veterinary: [16, 14, 18, 20, 22, 20, 16, 14, 20, 22, 18, 16],
    tattoo: [8, 6, 10, 12, 14, 16, 18, 20, 16, 12, 10, 12],
    childcare: [16, 16, 18, 18, 18, 14, 4, 4, 18, 18, 18, 16],
    education: [20, 22, 26, 24, 22, 16, 10, 8, 28, 30, 26, 22],
    events: [8, 6, 12, 18, 24, 32, 28, 22, 26, 20, 14, 30],
    logistics: [24, 22, 26, 28, 30, 28, 24, 22, 30, 32, 34, 38],
  };
  const base = bases[sector] || bases.food!;
  return MONTHS.map((m, i) => ({
    month: m,
    revenue: (base[i] || 20) * 1000 + Math.round(Math.random() * 3000),
    prenotazioni: 40 + Math.round((base[i] || 20) * 2.5) + Math.round(Math.random() * 15),
  }));
};

// ── Top services bar chart data ──
const SECTOR_BAR_DATA: Record<string, { name: string; valore: number }[]> = {
  food: [
    { name: "Carbonara", valore: 142 }, { name: "Margherita", valore: 128 },
    { name: "Tiramisù", valore: 96 }, { name: "Risotto", valore: 84 },
    { name: "Bruschetta", valore: 72 }, { name: "Tagliata", valore: 58 },
  ],
  beauty: [
    { name: "Taglio+Piega", valore: 89 }, { name: "Colore", valore: 72 },
    { name: "Manicure", valore: 65 }, { name: "Tratt. Viso", valore: 48 },
    { name: "Extension", valore: 34 }, { name: "Ceretta", valore: 28 },
  ],
  healthcare: [
    { name: "Cardiologia", valore: 68 }, { name: "Ortopedia", valore: 54 },
    { name: "Ecografia", valore: 48 }, { name: "Dermatologia", valore: 42 },
    { name: "Oculistica", valore: 36 }, { name: "Fisioterapia", valore: 32 },
  ],
  fitness: [
    { name: "CrossFit", valore: 95 }, { name: "Yoga", valore: 78 },
    { name: "Personal", valore: 62 }, { name: "Spinning", valore: 55 },
    { name: "Pilates", valore: 48 }, { name: "Boxe", valore: 35 },
  ],
  hospitality: [
    { name: "Suite", valore: 42 }, { name: "Deluxe", valore: 68 },
    { name: "Junior Suite", valore: 54 }, { name: "Classic", valore: 85 },
    { name: "Family", valore: 32 }, { name: "Single", valore: 28 },
  ],
  ncc: [
    { name: "Aeroporto", valore: 78 }, { name: "Tour Costiera", valore: 45 },
    { name: "Transfer Hotel", valore: 62 }, { name: "Capri Boat", valore: 34 },
    { name: "Pompei Tour", valore: 28 }, { name: "Roma Transfer", valore: 22 },
  ],
  retail: [
    { name: "Abbigliamento", valore: 145 }, { name: "Accessori", valore: 98 },
    { name: "Scarpe", valore: 72 }, { name: "Borse", valore: 58 },
    { name: "Gioielli", valore: 42 }, { name: "Cosmetici", valore: 35 },
  ],
  beach: [
    { name: "Ombrellone+2", valore: 128 }, { name: "Gazebo VIP", valore: 42 },
    { name: "Lettino Sing.", valore: 95 }, { name: "Abb. Settimanale", valore: 38 },
    { name: "Bar Spiaggia", valore: 210 }, { name: "Abb. Stagionale", valore: 12 },
  ],
  bakery: [
    { name: "Cornetti", valore: 280 }, { name: "Pane Artigianale", valore: 145 },
    { name: "Torte Su Misura", valore: 42 }, { name: "Focaccia", valore: 120 },
    { name: "Biscotti", valore: 95 }, { name: "Colomba/Panettone", valore: 35 },
  ],
  plumber: [
    { name: "Ripar. Perdite", valore: 48 }, { name: "Sost. Caldaia", valore: 18 },
    { name: "Scarico Intasato", valore: 42 }, { name: "Imp. Idraulico", valore: 12 },
    { name: "Rubinetteria", valore: 35 }, { name: "Pronto Interv.", valore: 28 },
  ],
  electrician: [
    { name: "Quadro Elettrico", valore: 32 }, { name: "Cablaggio", valore: 18 },
    { name: "Fotovoltaico", valore: 14 }, { name: "Messa a Norma", valore: 22 },
    { name: "Domotica", valore: 8 }, { name: "Illuminazione", valore: 28 },
  ],
  agriturismo: [
    { name: "Soggiorno B&B", valore: 65 }, { name: "Degustazione", valore: 48 },
    { name: "Cena Agriturist.", valore: 82 }, { name: "Olio EVO", valore: 120 },
    { name: "Vino Locale", valore: 95 }, { name: "Esperienza Farm", valore: 28 },
  ],
  cleaning: [
    { name: "Uffici", valore: 85 }, { name: "Condomini", valore: 62 },
    { name: "Ristoranti", valore: 42 }, { name: "Post-Cantiere", valore: 18 },
    { name: "Sanificazione", valore: 35 }, { name: "Vetri/Esterni", valore: 28 },
  ],
  legal: [
    { name: "Civile", valore: 42 }, { name: "Contrattualistica", valore: 38 },
    { name: "Famiglia", valore: 28 }, { name: "Recupero Crediti", valore: 22 },
    { name: "Successioni", valore: 18 }, { name: "Penale", valore: 12 },
  ],
  accountant: [
    { name: "Bilanci", valore: 45 }, { name: "730/Redditi", valore: 86 },
    { name: "IVA Trimest.", valore: 65 }, { name: "ISEE", valore: 42 },
    { name: "Apertura P.IVA", valore: 18 }, { name: "Consulenza", valore: 55 },
  ],
  garage: [
    { name: "Tagliando", valore: 85 }, { name: "Revisione", valore: 72 },
    { name: "Gomme Stag.", valore: 58 }, { name: "Carrozzeria", valore: 28 },
    { name: "Diagnosi Elett.", valore: 42 }, { name: "Climatizzatore", valore: 22 },
  ],
  photographer: [
    { name: "Matrimoni", valore: 18 }, { name: "Portrait", valore: 42 },
    { name: "Corporate", valore: 28 }, { name: "Prodotto", valore: 35 },
    { name: "Newborn", valore: 22 }, { name: "Eventi", valore: 15 },
  ],
  construction: [
    { name: "Ristrutturaz.", valore: 28 }, { name: "Nuova Costruz.", valore: 8 },
    { name: "Impermeabilizz.", valore: 18 }, { name: "Cappotto Term.", valore: 14 },
    { name: "Cartongesso", valore: 35 }, { name: "Pavimentazione", valore: 22 },
  ],
  gardener: [
    { name: "Manutenzione", valore: 92 }, { name: "Potatura", valore: 65 },
    { name: "Prato Nuovo", valore: 18 }, { name: "Irrigazione", valore: 28 },
    { name: "Fitosanitario", valore: 35 }, { name: "Progettazione", valore: 12 },
  ],
  veterinary: [
    { name: "Vaccini", valore: 85 }, { name: "Visita Generale", valore: 72 },
    { name: "Chirurgia", valore: 28 }, { name: "Dentale", valore: 35 },
    { name: "Ecografia", valore: 22 }, { name: "Dermatologia", valore: 18 },
  ],
  tattoo: [
    { name: "Sleeve", valore: 15 }, { name: "Piccoli", valore: 68 },
    { name: "Cover-up", valore: 22 }, { name: "Lettering", valore: 45 },
    { name: "Realistico", valore: 18 }, { name: "Geometrico", valore: 32 },
  ],
  childcare: [
    { name: "Tempo Pieno", valore: 28 }, { name: "Part-time Matt.", valore: 8 },
    { name: "Part-time Pom.", valore: 4 }, { name: "Extra Orario", valore: 12 },
    { name: "Centro Estivo", valore: 35 }, { name: "Lab Creativi", valore: 22 },
  ],
  education: [
    { name: "Full Stack", valore: 85 }, { name: "Data Science", valore: 62 },
    { name: "UX Design", valore: 48 }, { name: "Marketing Dig.", valore: 42 },
    { name: "Cybersecurity", valore: 28 }, { name: "AI/ML", valore: 55 },
  ],
  events: [
    { name: "Matrimoni", valore: 18 }, { name: "Corporate", valore: 32 },
    { name: "Compleanni", valore: 45 }, { name: "Congressi", valore: 12 },
    { name: "Feste Private", valore: 28 }, { name: "Team Building", valore: 22 },
  ],
  logistics: [
    { name: "Espresso", valore: 85 }, { name: "Standard", valore: 128 },
    { name: "Groupage", valore: 45 }, { name: "Dedicato", valore: 22 },
    { name: "Internazionale", valore: 18 }, { name: "Ultimo Miglio", valore: 65 },
  ],
};

// ── Pie data (client sources) ──
const PIE_DATA = [
  { name: "Organico", value: 38 }, { name: "Social", value: 25 },
  { name: "Referral", value: 18 }, { name: "Google Ads", value: 12 },
  { name: "WhatsApp", value: 7 },
];
const PIE_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

// ── Quick actions per sector ──
const SECTOR_QUICK_ACTIONS: Record<string, { label: string; icon: string }[]> = {
  food: [{ label: "Nuovo Ordine", icon: "Plus" }, { label: "Prenotazione", icon: "Calendar" }, { label: "Genera Report", icon: "BarChart3" }],
  beauty: [{ label: "Nuovo Appuntamento", icon: "Plus" }, { label: "Invia Reminder", icon: "Bell" }, { label: "Genera Report", icon: "BarChart3" }],
  healthcare: [{ label: "Nuova Visita", icon: "Plus" }, { label: "Prescrizione", icon: "FileText" }, { label: "Genera Report", icon: "BarChart3" }],
  fitness: [{ label: "Nuovo Membro", icon: "Plus" }, { label: "Nuova Classe", icon: "Calendar" }, { label: "Genera Report", icon: "BarChart3" }],
  hospitality: [{ label: "Nuovo Check-in", icon: "Plus" }, { label: "Housekeeping", icon: "CheckCircle" }, { label: "Genera Report", icon: "BarChart3" }],
  hotel: [{ label: "Nuovo Check-in", icon: "Plus" }, { label: "Room Service", icon: "Bell" }, { label: "Genera Report", icon: "BarChart3" }],
  ncc: [{ label: "Nuova Corsa", icon: "Plus" }, { label: "Assegna Autista", icon: "Users" }, { label: "Genera Report", icon: "BarChart3" }],
  retail: [{ label: "Nuova Vendita", icon: "Plus" }, { label: "Inventario", icon: "Package" }, { label: "Genera Report", icon: "BarChart3" }],
  beach: [{ label: "Prenota Ombrellone", icon: "Plus" }, { label: "Walk-in", icon: "Users" }, { label: "Genera Report", icon: "BarChart3" }],
  bakery: [{ label: "Nuovo Ordine", icon: "Plus" }, { label: "Preordine", icon: "Calendar" }, { label: "Genera Report", icon: "BarChart3" }],
  plumber: [{ label: "Nuovo Intervento", icon: "Plus" }, { label: "Preventivo", icon: "FileText" }, { label: "Genera Report", icon: "BarChart3" }],
  electrician: [{ label: "Nuovo Intervento", icon: "Plus" }, { label: "Sopralluogo", icon: "Eye" }, { label: "Genera Report", icon: "BarChart3" }],
  agriturismo: [{ label: "Nuovo Check-in", icon: "Plus" }, { label: "Degustazione", icon: "Calendar" }, { label: "Genera Report", icon: "BarChart3" }],
  cleaning: [{ label: "Nuovo Intervento", icon: "Plus" }, { label: "Contratto", icon: "FileText" }, { label: "Genera Report", icon: "BarChart3" }],
  legal: [{ label: "Nuova Pratica", icon: "Plus" }, { label: "Consulenza", icon: "Calendar" }, { label: "Genera Report", icon: "BarChart3" }],
  accountant: [{ label: "Nuova Pratica", icon: "Plus" }, { label: "Scadenzario", icon: "Clock" }, { label: "Genera Report", icon: "BarChart3" }],
  garage: [{ label: "Nuovo Veicolo", icon: "Plus" }, { label: "Preventivo", icon: "FileText" }, { label: "Genera Report", icon: "BarChart3" }],
  photographer: [{ label: "Nuovo Shooting", icon: "Plus" }, { label: "Gallery", icon: "Camera" }, { label: "Genera Report", icon: "BarChart3" }],
  construction: [{ label: "Nuovo Cantiere", icon: "Plus" }, { label: "Preventivo", icon: "FileText" }, { label: "Genera Report", icon: "BarChart3" }],
  gardener: [{ label: "Nuovo Intervento", icon: "Plus" }, { label: "Preventivo", icon: "FileText" }, { label: "Genera Report", icon: "BarChart3" }],
  veterinary: [{ label: "Nuova Visita", icon: "Plus" }, { label: "Vaccini", icon: "Shield" }, { label: "Genera Report", icon: "BarChart3" }],
  tattoo: [{ label: "Nuova Sessione", icon: "Plus" }, { label: "Consulenza", icon: "Calendar" }, { label: "Genera Report", icon: "BarChart3" }],
  childcare: [{ label: "Registra Ingresso", icon: "Plus" }, { label: "Comunicazione", icon: "Send" }, { label: "Genera Report", icon: "BarChart3" }],
  education: [{ label: "Nuovo Studente", icon: "Plus" }, { label: "Nuovo Corso", icon: "BookOpen" }, { label: "Genera Report", icon: "BarChart3" }],
  events: [{ label: "Nuovo Evento", icon: "Plus" }, { label: "Preventivo", icon: "FileText" }, { label: "Genera Report", icon: "BarChart3" }],
  logistics: [{ label: "Nuova Spedizione", icon: "Plus" }, { label: "Tracking", icon: "Navigation" }, { label: "Genera Report", icon: "BarChart3" }],
};

// ── Calendar mock data ──
const generateCalendarDays = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const names = ["Marco R.", "Laura B.", "Anna V.", "Giovanni P.", "Sara M.", "Davide N.", "Elena C.", "Roberto E."];
  const days: { day: number; events: number; highlight?: boolean; names: string[] }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today.getDate();
    const events = d === today.getDate() ? 6 : Math.floor(Math.random() * 5);
    days.push({
      day: d,
      events,
      highlight: isToday,
      names: events > 0 ? names.slice(0, Math.min(events, 3)) : [],
    });
  }
  return { days, firstDay: firstDay === 0 ? 6 : firstDay - 1, monthName: today.toLocaleDateString("it-IT", { month: "long", year: "numeric" }) };
};

export default function DemoAdminPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [agentsTab, setAgentsTab] = useState<"overview" | "activity" | "detail">("overview");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [tutorialsOn, setTutorialsOn] = useState(true);
  const [ordersPage, setOrdersPage] = useState(1);

  const resolvedSector = useMemo(() => resolveIndustryFromSlug(slug || "food"), [slug]);
  const config = getSectorConfig(resolvedSector || "food");
  const allAgents = useMemo(() => getAllAgentsForSector(resolvedSector || "food"), [resolvedSector]);
  const sectorKey = resolvedSector || "food";
  const revenueData = useMemo(() => generateRevenueData(sectorKey), [sectorKey]);
  const calendarData = useMemo(generateCalendarDays, []);

  if (!resolvedSector || !config) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-xl font-bold text-foreground">Demo non trovata</p>
        <p className="text-sm text-muted-foreground">Lo slug "{slug}" non corrisponde a nessun settore disponibile.</p>
        <Link to="/demo" className="text-sm font-medium text-primary underline hover:no-underline">← Torna alla Directory Demo</Link>
      </div>
    );
  }

  const accentColor = config.colors.accent;
  const kpis = SECTOR_KPIS[sectorKey] || SECTOR_KPIS.food!;
  const barData = SECTOR_BAR_DATA[sectorKey] || SECTOR_BAR_DATA.food!;
  const tableData = SECTOR_TABLE_DATA[sectorKey] || SECTOR_TABLE_DATA.food!;
  const activities = SECTOR_ACTIVITIES[sectorKey] || SECTOR_ACTIVITIES.food || [
    { text: `Nuovo cliente: ${config.mockClients[0]?.name || "Mario Rossi"}`, time: "2 min fa", type: "success" as const },
    { text: `${config.mockOrders[0]?.service || "Ordine #1234"} — €${config.mockOrders[0]?.amount || 85}`, time: "15 min fa", type: "info" as const },
    { text: `Pagamento ricevuto da ${config.mockClients[1]?.name || "Laura B."}`, time: "1 ora fa", type: "success" as const },
    { text: `Agente AI ha qualificato 3 nuovi lead`, time: "3 ore fa", type: "ai" as const },
  ];
  const quickActions = SECTOR_QUICK_ACTIONS[sectorKey] || [{ label: "Nuova Azione", icon: "Plus" }, { label: "Messaggio", icon: "Send" }, { label: "Report", icon: "BarChart3" }];

  // ── Sidebar ──
  const SidebarInner = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: accentColor }}>
            {config.heroEmoji}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-white truncate">{config.name}</h2>
            <p className="text-[0.55rem] text-white/35">Empire AI Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {config.adminModules.map((mod) => {
          const Icon = resolveIcon(mod.icon);
          const isActive = activeModule === mod.route;
          const badgeCount = mod.route === "agents" ? allAgents.length : mod.route === "whatsapp" ? 5 : mod.route === "orders" || mod.route === "bookings" ? 12 : 0;
          return (
            <button key={mod.route} onClick={() => { setActiveModule(mod.route); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${isActive ? "text-white" : "text-white/45 hover:text-white/75 hover:bg-white/[0.04]"}`}
              style={isActive ? { background: `${accentColor}18`, color: accentColor } : {}}>
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{mod.label}</span>
              {badgeCount > 0 && (
                <span className="text-[0.5rem] px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${accentColor}25`, color: accentColor }}>{badgeCount}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Admin avatar */}
      <div className="p-3 border-t border-white/10 space-y-2">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: `${accentColor}50` }}>AD</div>
          <div className="min-w-0">
            <p className="text-[0.65rem] font-bold text-white/80 truncate">Admin Demo</p>
            <p className="text-[0.5rem] text-white/30">admin@demo.empire.ai</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/demo/${slug}`)} variant="outline" size="sm"
          className="w-full text-[0.6rem] border-white/10 text-white/50 hover:text-white hover:bg-white/5">
          ← Torna al Sito Demo
        </Button>
      </div>
    </div>
  );

  // ══════════════════════════════════════
  //  DASHBOARD VIEW
  // ══════════════════════════════════════
  const renderDashboard = () => (
    <div className="space-y-5">
      {/* Quick Actions Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {quickActions.map((qa, i) => {
          const Icon = resolveIcon(qa.icon);
          return (
            <Button key={i} size="sm" className="text-xs h-9 gap-1.5" style={i === 0 ? { background: accentColor } : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)" }}>
              <Icon className="w-3.5 h-3.5" /> {qa.label}
            </Button>
          );
        })}
        <Button size="sm" variant="outline" className="text-xs h-9 gap-1.5 border-white/10 text-white/40 ml-auto">
          <Send className="w-3.5 h-3.5" /> Invia Messaggio
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {kpis.map((kpi, i) => {
          const Icon = resolveIcon(kpi.icon);
          const displayValue = kpi.label.includes("Rating") ? (kpi.value / 10).toFixed(1) : undefined;
          return (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] transition-all group">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${accentColor}15` }}>
                      <Icon className="w-4 h-4" style={{ color: accentColor }} />
                    </div>
                    <span className={`text-[0.6rem] font-bold flex items-center gap-0.5 ${kpi.up ? "text-emerald-400" : "text-red-400"}`}>
                      {kpi.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {kpi.change}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-white leading-none">
                    {displayValue || <AnimCounter value={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} />}
                  </p>
                  <p className="text-[0.6rem] text-white/35 mt-1">{kpi.label}</p>
                  {/* Mini sparkline mock */}
                  <div className="flex items-end gap-px mt-2 h-4">
                    {[3, 5, 4, 7, 6, 8, 7, 9, 8, 10, 9, 11].map((h, j) => (
                      <div key={j} className="flex-1 rounded-sm transition-all" style={{ height: `${h * 10}%`, background: j >= 10 ? accentColor : `${accentColor}30` }} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Area Chart */}
        <Card className="lg:col-span-2 bg-white/[0.03] border-white/[0.06]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-white/80">Fatturato 12 Mesi</CardTitle>
              <Badge className="text-[0.5rem] bg-emerald-500/15 text-emerald-400">+18% YoY</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={accentColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 11, color: "#fff" }} formatter={(v: number) => [`€${v.toLocaleString("it-IT")}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke={accentColor} fill="url(#colorRev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Client Source Pie */}
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Fonte Clienti</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={42} outerRadius={68} dataKey="value" paddingAngle={3}>
                  {PIE_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 10, color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
              {PIE_DATA.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-[0.5rem] text-white/40">{d.name} {d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart — Top services */}
      <Card className="bg-white/[0.03] border-white/[0.06]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white/80">
            {sectorKey === "food" ? "Piatti Più Venduti" : sectorKey === "beauty" ? "Servizi Top" : sectorKey === "ncc" ? "Tratte Più Richieste" : "Servizi Più Richiesti"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} width={75} />
              <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 11, color: "#fff" }} />
              <Bar dataKey="valore" fill={accentColor} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Data Table + AI Agents Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Table */}
        <Card className="lg:col-span-2 bg-white/[0.03] border-white/[0.06] overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-white/80">
                {sectorKey === "food" ? "Ordini Recenti" : sectorKey === "beauty" ? "Appuntamenti Oggi" : sectorKey === "healthcare" ? "Visite Recenti" : sectorKey === "ncc" ? "Corse Recenti" : "Attività Recenti"}
              </CardTitle>
              <Button size="sm" variant="outline" className="text-[0.55rem] border-white/10 text-white/40 h-7">Vedi tutti</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {tableData.headers.map((h) => (
                      <th key={h} className="text-left text-[0.55rem] text-white/35 font-medium p-3 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.rows.map((row, i) => (
                    <tr key={i} className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}>
                      {row.map((cell, j) => (
                        <td key={j} className="p-3 text-[0.65rem] text-white/60 whitespace-nowrap">
                          {cell.startsWith("✅") || cell.startsWith("🔥") || cell.startsWith("📦") || cell.startsWith("⏳") || cell.startsWith("🔄") || cell.startsWith("📅") ? (
                            <Badge className="text-[0.5rem] px-1.5" style={{
                              background: cell.startsWith("✅") ? "#22c55e18" : cell.startsWith("🔥") || cell.startsWith("🔄") ? "#3b82f618" : cell.startsWith("📦") ? "#8b5cf618" : "#f59e0b18",
                              color: cell.startsWith("✅") ? "#22c55e" : cell.startsWith("🔥") || cell.startsWith("🔄") ? "#3b82f6" : cell.startsWith("📦") ? "#8b5cf6" : "#f59e0b",
                            }}>{cell}</Badge>
                          ) : j === 0 ? (
                            <span className="font-mono text-white/40">{cell}</span>
                          ) : cell.startsWith("€") ? (
                            <span className="font-bold text-white/80">{cell}</span>
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* AI Agents Panel */}
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-white/80">Agenti AI Attivi</CardTitle>
              <span className="text-[0.5rem] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold">{allAgents.length} Online</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {allAgents.slice(0, 8).map((agent, i) => (
              <motion.div key={agent.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/[0.03] transition-all cursor-pointer group"
                onClick={() => { setActiveModule("agents"); setSelectedAgent(agent.name); setAgentsTab("detail"); }}>
                <div className="relative">
                  <span className="text-base">{agent.emoji}</span>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#0a0a12] ${i < 6 ? "bg-emerald-400 animate-pulse" : "bg-yellow-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.6rem] font-bold text-white/75 truncate group-hover:text-white transition-colors">{agent.name.split(" — ")[0]}</p>
                  <p className="text-[0.45rem] text-white/25 truncate">{agent.capabilities[0]}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[0.55rem] font-bold text-white/50">{120 + i * 18}</p>
                  <p className="text-[0.4rem] text-white/20">task oggi</p>
                </div>
              </motion.div>
            ))}
            {allAgents.length > 8 && (
              <button onClick={() => setActiveModule("agents")} className="w-full text-center text-[0.55rem] text-white/30 hover:text-white/50 py-1.5 transition-colors">
                +{allAgents.length - 8} altri agenti →
              </button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card className="bg-white/[0.03] border-white/[0.06]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white/80">Attività Recenti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {activities.map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 py-2.5 border-b border-white/[0.03] last:border-0">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${a.type === "success" ? "bg-emerald-400" : a.type === "ai" ? "bg-purple-400" : a.type === "warning" ? "bg-amber-400" : "bg-blue-400"}`} />
              <p className="text-[0.65rem] text-white/65 flex-1 leading-relaxed">{a.text}</p>
              <span className="text-[0.55rem] text-white/25 shrink-0 whitespace-nowrap">{a.time}</span>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  // ══════════════════════════════════════
  //  CRM CLIENTS VIEW
  // ══════════════════════════════════════
  const renderClients = () => {
    const extraClients = [
      { name: "Francesca Villa", phone: "+39 336 7778899", email: "f.villa@email.it" },
      { name: "Alessandro Conti", phone: "+39 337 2223344", email: "a.conti@email.it" },
      { name: "Sara Marchetti", phone: "+39 338 5556677", email: "s.marchetti@email.it" },
      { name: "Davide Lombardi", phone: "+39 339 8889900", email: "d.lombardi@email.it" },
      { name: "Elena Colombo", phone: "+39 340 1112233", email: "e.colombo@email.it" },
      { name: "Matteo Ferrari", phone: "+39 341 4445566", email: "m.ferrari@email.it" },
      { name: "Valentina Russo", phone: "+39 342 7778899", email: "v.russo@email.it" },
      { name: "Simone Galli", phone: "+39 343 0001122", email: "s.galli@email.it" },
    ];
    const allClients = [...config.mockClients, ...extraClients];
    const statuses = ["Attivo", "Attivo", "Attivo", "Premium", "Premium", "Da ricontattare", "Nuovo", "Attivo", "Premium", "Da ricontattare", "Nuovo"];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-base font-bold text-white">{sectorKey === "healthcare" ? "Pazienti" : "Clienti CRM"}</h2>
          <div className="flex gap-2">
            <Button size="sm" style={{ background: accentColor }} className="text-white text-xs h-8 gap-1"><Plus className="w-3 h-3" /> Nuovo</Button>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-white/20 outline-none focus:border-white/15 transition-colors" placeholder="Cerca clienti..." />
          </div>
          <Button variant="outline" size="sm" className="border-white/10 text-white/40 h-10"><Filter className="w-3.5 h-3.5" /></Button>
        </div>
        <Card className="bg-white/[0.03] border-white/[0.06] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Cliente", "Telefono", "Email", "Spesa Tot.", "Visite", "Stato"].map(h => (
                    <th key={h} className="text-left text-[0.55rem] text-white/35 font-medium p-3 uppercase tracking-wider cursor-pointer hover:text-white/50 transition-colors">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allClients.map((c, i) => (
                  <tr key={i} className={`border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors cursor-pointer ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[0.5rem] font-bold text-white" style={{ background: `${accentColor}30` }}>
                          {c.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-xs text-white/80 font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-xs text-white/45">{c.phone}</td>
                    <td className="p-3 text-xs text-white/45">{c.email}</td>
                    <td className="p-3 text-xs text-white/70 font-bold">€{(180 + i * 120 + Math.round(Math.random() * 400)).toLocaleString("it-IT")}</td>
                    <td className="p-3 text-xs text-white/50">{3 + Math.floor(Math.random() * 20)}</td>
                    <td className="p-3">
                      <Badge className="text-[0.5rem]" style={{
                        background: statuses[i % statuses.length] === "Attivo" ? "#22c55e18" : statuses[i % statuses.length] === "Premium" ? `${accentColor}18` : statuses[i % statuses.length] === "Nuovo" ? "#3b82f618" : "#f59e0b18",
                        color: statuses[i % statuses.length] === "Attivo" ? "#22c55e" : statuses[i % statuses.length] === "Premium" ? accentColor : statuses[i % statuses.length] === "Nuovo" ? "#3b82f6" : "#f59e0b",
                      }}>{statuses[i % statuses.length]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.04]">
            <span className="text-[0.6rem] text-white/30">{allClients.length} clienti totali</span>
            <div className="flex gap-1">
              {[1, 2, 3].map(p => (
                <button key={p} className={`w-7 h-7 rounded-lg text-[0.6rem] font-bold transition-all ${p === 1 ? "text-white" : "text-white/30 hover:text-white/50"}`}
                  style={p === 1 ? { background: `${accentColor}20`, color: accentColor } : { background: "rgba(255,255,255,0.03)" }}>{p}</button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // ══════════════════════════════════════
  //  CALENDAR VIEW
  // ══════════════════════════════════════
  const renderCalendar = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white capitalize">{sectorKey === "food" ? "Prenotazioni" : sectorKey === "healthcare" ? "Agenda Medica" : "Calendario"}</h2>
        <Button size="sm" style={{ background: accentColor }} className="text-white text-xs h-8 gap-1"><Plus className="w-3 h-3" /> Nuova</Button>
      </div>
      <Card className="bg-white/[0.03] border-white/[0.06]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <button className="text-white/40 hover:text-white/60 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <CardTitle className="text-sm text-white/80 capitalize">{calendarData.monthName}</CardTitle>
            <button className="text-white/40 hover:text-white/60 transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map(d => (
              <div key={d} className="text-center text-[0.5rem] text-white/25 font-bold uppercase py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for first day offset */}
            {Array.from({ length: calendarData.firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {calendarData.days.map((d) => (
              <div key={d.day}
                className={`relative p-1.5 rounded-lg text-center transition-all cursor-pointer hover:bg-white/[0.04] min-h-[48px] ${d.highlight ? "ring-1" : ""}`}
                style={d.highlight ? { background: `${accentColor}15`, borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}40` } : {}}>
                <span className={`text-[0.65rem] font-bold ${d.highlight ? "" : "text-white/50"}`} style={d.highlight ? { color: accentColor } : {}}>
                  {d.day}
                </span>
                {d.events > 0 && (
                  <div className="flex justify-center gap-0.5 mt-0.5">
                    {Array.from({ length: Math.min(d.events, 3) }).map((_, j) => (
                      <div key={j} className="w-1 h-1 rounded-full" style={{ background: j === 0 ? accentColor : `${accentColor}50` }} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Today's appointments list */}
      <Card className="bg-white/[0.03] border-white/[0.06]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white/80">Oggi — {new Date().toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {config.mockOrders.map((o, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-all border border-white/[0.04]">
              <div className="w-1 h-10 rounded-full" style={{ background: i === 0 ? "#22c55e" : i === 1 ? accentColor : "#3b82f6" }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white/80">{o.service}</p>
                <p className="text-[0.55rem] text-white/35">{o.client} · {o.date}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-bold text-white/70">€{o.amount}</p>
                <Badge className="text-[0.45rem]" style={{
                  background: o.status.includes("complet") || o.status.includes("conferm") ? "#22c55e18" : "#3b82f618",
                  color: o.status.includes("complet") || o.status.includes("conferm") ? "#22c55e" : "#3b82f6",
                }}>{o.status.replace(/_/g, " ")}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  // ══════════════════════════════════════
  //  ORDERS VIEW
  // ══════════════════════════════════════
  const ORDERS_PER_PAGE = 6;

  const renderOrders = () => {
    const totalPages = Math.ceil(tableData.rows.length / ORDERS_PER_PAGE);
    const pagedRows = tableData.rows.slice((ordersPage - 1) * ORDERS_PER_PAGE, ordersPage * ORDERS_PER_PAGE);
    return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-base font-bold text-white">{sectorKey === "food" ? "Ordini & Delivery" : sectorKey === "ncc" ? "Corse & Transfer" : "Ordini & Prenotazioni"}</h2>
        <div className="flex gap-2">
          {["Tutti", "In corso", "Completati"].map(f => (
            <Button key={f} variant="outline" size="sm" className="text-[0.6rem] border-white/10 text-white/40 h-7">{f}</Button>
          ))}
        </div>
      </div>
      {tableData.rows.length > 0 && (
        <Card className="bg-white/[0.03] border-white/[0.06] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {tableData.headers.map(h => (
                    <th key={h} className="text-left text-[0.55rem] text-white/35 font-medium p-3 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedRows.map((row, i) => (
                  <tr key={i} className={`border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}>
                    {row.map((cell, j) => (
                      <td key={j} className="p-3 text-[0.65rem] text-white/60 whitespace-nowrap">
                        {cell.startsWith("✅") || cell.startsWith("🔥") || cell.startsWith("📦") || cell.startsWith("⏳") || cell.startsWith("🔄") || cell.startsWith("📅") ? (
                          <Badge className="text-[0.5rem] px-1.5" style={{
                            background: cell.startsWith("✅") ? "#22c55e18" : cell.startsWith("🔥") || cell.startsWith("🔄") ? "#3b82f618" : "#f59e0b18",
                            color: cell.startsWith("✅") ? "#22c55e" : cell.startsWith("🔥") || cell.startsWith("🔄") ? "#3b82f6" : "#f59e0b",
                          }}>{cell}</Badge>
                        ) : j === 0 ? <span className="font-mono text-white/40">{cell}</span>
                          : cell.startsWith("€") ? <span className="font-bold text-white/80">{cell}</span>
                            : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.04]">
            <span className="text-[0.6rem] text-white/30">{tableData.rows.length} righe · Pagina {ordersPage}/{totalPages}</span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, p) => (
                <button key={p} onClick={() => setOrdersPage(p + 1)}
                  className={`w-7 h-7 rounded-lg text-[0.6rem] font-bold transition-all ${ordersPage === p + 1 ? "text-white" : "text-white/30 hover:text-white/50"}`}
                  style={ordersPage === p + 1 ? { background: `${accentColor}20`, color: accentColor } : { background: "rgba(255,255,255,0.03)" }}>{p + 1}</button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
    );
  };

  // ══════════════════════════════════════
  //  AGENTS VIEW (kept from original, enhanced)
  // ══════════════════════════════════════
  const renderAgents = () => {
    const totalHours = allAgents.reduce((s, a) => s + (a.hoursPerWeek || 8), 0);
    const avgAccuracy = Math.round(allAgents.reduce((s, a) => s + (a.accuracy || 90), 0) / allAgents.length);
    const totalActions = allAgents.length * 142;

    const mockActivityFeed = [
      { agent: allAgents[0]?.name || "Arianna", action: "Ha prenotato un appuntamento", time: "2 min fa", emoji: allAgents[0]?.emoji || "🎧" },
      { agent: allAgents[1]?.name || "Analytics", action: "Report settimanale generato", time: "15 min fa", emoji: allAgents[1]?.emoji || "📊" },
      { agent: allAgents[2]?.name || "Marketing", action: "Post Instagram pubblicato", time: "32 min fa", emoji: allAgents[2]?.emoji || "📣" },
      { agent: allAgents[3]?.name || "Sales", action: "Lead qualificato: score 87/100", time: "1 ora fa", emoji: allAgents[3]?.emoji || "💼" },
      { agent: allAgents[4]?.name || "Operations", action: "Turno assegnato automaticamente", time: "2 ore fa", emoji: allAgents[4]?.emoji || "⚙️" },
      { agent: allAgents[5]?.name || "Compliance", action: "GDPR audit completato", time: "3 ore fa", emoji: allAgents[5]?.emoji || "🛡️" },
      { agent: allAgents[6]?.name || "Customer", action: "Win-back inviato a cliente inattivo", time: "4 ore fa", emoji: allAgents[6]?.emoji || "❤️" },
      ...allAgents.slice(7).map((a, i) => ({ agent: a.name, action: `${a.capabilities[0] || "Azione"} eseguita`, time: `${5 + i} ore fa`, emoji: a.emoji })),
    ];

    const detailAgent = allAgents.find(a => a.name === selectedAgent) || allAgents[0];

    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-base font-bold text-white mb-1">Agenti AI Attivi</h2>
          <p className="text-xs text-white/40">{allAgents.length} agenti operativi per {config.name}</p>
        </div>

        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          {([["overview", "Panoramica"], ["activity", "Attività"], ["detail", "Dettaglio"]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setAgentsTab(key)}
              className={`flex-1 py-2 rounded-lg text-[0.6rem] font-bold transition-all ${agentsTab === key ? "text-white" : "text-white/40 hover:text-white/60"}`}
              style={agentsTab === key ? { background: `${accentColor}20`, color: accentColor } : {}}>
              {label}
            </button>
          ))}
        </div>

        {agentsTab === "overview" && (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Azioni Totali", value: totalActions.toLocaleString("it-IT"), icon: Activity },
                { label: "Ore Risparmiate/Sett", value: `${totalHours}h`, icon: Clock },
                { label: "Accuratezza Media", value: `${avgAccuracy}%`, icon: CheckCircle },
              ].map((s, i) => (
                <Card key={i} className="bg-white/[0.03] border-white/[0.06]">
                  <CardContent className="p-3 text-center">
                    <s.icon className="w-4 h-4 mx-auto mb-1" style={{ color: accentColor }} />
                    <p className="text-sm font-bold text-white">{s.value}</p>
                    <p className="text-[0.5rem] text-white/30">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allAgents.map((agent, i) => (
                <motion.div key={agent.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <Card className="bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer"
                    onClick={() => { setSelectedAgent(agent.name); setAgentsTab("detail"); }}>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{agent.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[0.65rem] font-bold text-white truncate">{agent.name}</p>
                          <div className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${i < allAgents.length - 2 ? "bg-emerald-400 animate-pulse" : "bg-yellow-400"}`} />
                            <span className={`text-[0.45rem] ${i < allAgents.length - 2 ? "text-emerald-400" : "text-yellow-400"}`}>{i < allAgents.length - 2 ? "ATTIVO" : "STANDBY"}</span>
                            {agent.isUniversal && <Badge className="text-[0.4rem] px-1 py-0 bg-purple-500/20 text-purple-300 ml-1">Universal</Badge>}
                          </div>
                        </div>
                        <MoreHorizontal className="w-3.5 h-3.5 text-white/20" />
                      </div>
                      <div className="flex items-center justify-between text-center">
                        <div><p className="text-[0.6rem] font-bold text-white">{agent.accuracy || 95}%</p><p className="text-[0.4rem] text-white/25">Accuracy</p></div>
                        <div><p className="text-[0.6rem] font-bold text-white">{agent.hoursPerWeek || 8}h</p><p className="text-[0.4rem] text-white/25">Ore/sett</p></div>
                        <div><p className="text-[0.6rem] font-bold text-white">{120 + i * 25}</p><p className="text-[0.4rem] text-white/25">Azioni</p></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {agentsTab === "activity" && (
          <Card className="bg-white/[0.03] border-white/[0.06]">
            <CardContent className="p-4 space-y-1">
              {mockActivityFeed.map((a, i) => (
                <motion.div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <span className="text-base shrink-0">{a.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-white/80"><strong className="text-white">{a.agent}</strong> — {a.action}</p>
                  </div>
                  <span className="text-[0.55rem] text-white/25 shrink-0">{a.time}</span>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        )}

        {agentsTab === "detail" && detailAgent && (
          <div className="space-y-4">
            <div className="flex gap-1.5 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {allAgents.map(a => (
                <button key={a.name} onClick={() => setSelectedAgent(a.name)}
                  className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[0.55rem] font-medium transition-all whitespace-nowrap ${selectedAgent === a.name || (!selectedAgent && a === allAgents[0]) ? "text-white" : "text-white/40 hover:text-white/60"}`}
                  style={(selectedAgent === a.name || (!selectedAgent && a === allAgents[0])) ? { background: `${accentColor}20`, color: accentColor } : { background: "rgba(255,255,255,0.03)" }}>
                  {a.emoji} {a.name.split(" — ")[0].split(" ").slice(0, 2).join(" ")}
                </button>
              ))}
            </div>

            <Card className="bg-white/[0.03] border-white/[0.06]">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{detailAgent.emoji}</span>
                  <div>
                    <p className="text-sm font-bold text-white">{detailAgent.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[0.6rem] text-emerald-400 font-medium">ATTIVO 24/7</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-white/60 mb-4">{detailAgent.desc}</p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { v: `${detailAgent.accuracy || 95}%`, l: "Accuratezza" },
                    { v: `${detailAgent.hoursPerWeek || 10}h`, l: "Risparmio/Sett" },
                    { v: "142", l: "Azioni eseguite" },
                  ].map((m, i) => (
                    <div key={i} className="text-center p-2.5 rounded-lg bg-white/[0.03]">
                      <p className="text-base font-bold text-white">{m.v}</p>
                      <p className="text-[0.5rem] text-white/30">{m.l}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {detailAgent.capabilities.map(c => (
                    <Badge key={c} variant="outline" className="text-[0.55rem] border-white/10 text-white/50 px-2">{c}</Badge>
                  ))}
                </div>

                {detailAgent.workflow && detailAgent.workflow.length > 0 && (
                  <div className="pt-4 border-t border-white/[0.06]">
                    <p className="text-[0.6rem] font-bold text-white/50 uppercase tracking-wider mb-3">⚡ Come Lavora</p>
                    <div className="space-y-2.5">
                      {detailAgent.workflow.map((step, i) => (
                        <div key={i} className="flex items-start gap-3 relative">
                          {i < detailAgent.workflow!.length - 1 && (
                            <div className="absolute left-[15px] top-[30px] w-[1px] h-[calc(100%+4px)]" style={{ background: `${accentColor}20` }} />
                          )}
                          <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-sm shrink-0 relative z-10" style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}>
                            {step.icon}
                          </div>
                          <div className="pt-0.5">
                            <p className="text-[0.65rem] font-bold text-white/80">{step.label}</p>
                            <p className="text-[0.55rem] text-white/40">{step.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {detailAgent.example && (
                  <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-[0.55rem] font-bold text-white/50 mb-1">💡 Esempio Concreto</p>
                    <p className="text-[0.6rem] text-white/60 leading-relaxed italic">{detailAgent.example}</p>
                  </div>
                )}

                {detailAgent.result && (
                  <div className="mt-3 p-2.5 rounded-lg text-center" style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}20` }}>
                    <p className="text-[0.6rem] font-bold" style={{ color: accentColor }}>{detailAgent.result}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  };

  // ══════════════════════════════════════
  //  MARKETING VIEW
  // ══════════════════════════════════════
  const renderMarketing = () => {
    const campaigns = [
      { name: "Newsletter Settimanale", type: "Email", sent: 1240, opened: 42, clicked: 18, status: "Attiva" },
      { name: "Promo Weekend", type: "WhatsApp", sent: 580, opened: 78, clicked: 34, status: "Attiva" },
      { name: "Lancio Nuovo Servizio", type: "SMS", sent: 890, opened: 65, clicked: 22, status: "Completata" },
      { name: "Flash Sale Estate", type: "Email", sent: 2100, opened: 38, clicked: 15, status: "Pianificata" },
      { name: "Win-back Inattivi", type: "WhatsApp", sent: 340, opened: 85, clicked: 42, status: "Attiva" },
    ];
    const socialMetrics = [
      { platform: "Instagram", followers: "2.4K", growth: "+12%", posts: 28, engagement: "4.8%" },
      { platform: "Facebook", followers: "1.8K", growth: "+6%", posts: 14, engagement: "2.1%" },
      { platform: "Google Business", reviews: "4.7★", total: 186, growth: "+8 questo mese" },
    ];
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Marketing & Social</h2>
          <Button size="sm" style={{ background: accentColor }} className="text-xs h-8 gap-1"><Plus className="w-3 h-3" /> Nuova Campagna</Button>
        </div>
        {/* Campaign overview KPIs */}
        <div className="grid grid-cols-3 gap-3">
          {[{ l: "Messaggi Inviati", v: "4.750", i: Send }, { l: "Tasso Apertura", v: "52%", i: Eye }, { l: "Click-Through", v: "26%", i: Target }].map((k, i) => (
            <Card key={i} className="bg-white/[0.03] border-white/[0.06]">
              <CardContent className="p-3 text-center">
                <k.i className="w-4 h-4 mx-auto mb-1" style={{ color: accentColor }} />
                <p className="text-sm font-bold text-white">{k.v}</p>
                <p className="text-[0.5rem] text-white/30">{k.l}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Campaigns table */}
        <Card className="bg-white/[0.03] border-white/[0.06] overflow-hidden">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-white/80">Campagne Recenti</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-white/[0.06]">
                  {["Campagna", "Tipo", "Inviati", "Aperture %", "Click %", "Stato"].map(h => (
                    <th key={h} className="text-left text-[0.55rem] text-white/35 font-medium p-3 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {campaigns.map((c, i) => (
                    <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 text-xs text-white/70 font-medium">{c.name}</td>
                      <td className="p-3"><Badge className="text-[0.5rem]" style={{ background: c.type === "WhatsApp" ? "#22c55e18" : c.type === "SMS" ? "#8b5cf618" : `${accentColor}18`, color: c.type === "WhatsApp" ? "#22c55e" : c.type === "SMS" ? "#8b5cf6" : accentColor }}>{c.type}</Badge></td>
                      <td className="p-3 text-xs text-white/50">{c.sent.toLocaleString("it-IT")}</td>
                      <td className="p-3 text-xs text-white/70 font-bold">{c.opened}%</td>
                      <td className="p-3 text-xs text-white/70 font-bold">{c.clicked}%</td>
                      <td className="p-3"><Badge className="text-[0.5rem]" style={{ background: c.status === "Attiva" ? "#22c55e18" : c.status === "Completata" ? `${accentColor}18` : "#f59e0b18", color: c.status === "Attiva" ? "#22c55e" : c.status === "Completata" ? accentColor : "#f59e0b" }}>{c.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        {/* Social metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {socialMetrics.map((s, i) => (
            <Card key={i} className="bg-white/[0.03] border-white/[0.06]">
              <CardContent className="p-4">
                <p className="text-xs font-bold text-white/80 mb-2">{s.platform}</p>
                <div className="space-y-1">
                  {"followers" in s && <div className="flex justify-between text-[0.6rem]"><span className="text-white/40">Follower</span><span className="text-white/70 font-bold">{s.followers}</span></div>}
                  {"reviews" in s && <div className="flex justify-between text-[0.6rem]"><span className="text-white/40">Rating</span><span className="text-white/70 font-bold">{s.reviews}</span></div>}
                  <div className="flex justify-between text-[0.6rem]"><span className="text-white/40">Crescita</span><span className="text-emerald-400 font-bold">{s.growth}</span></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // ══════════════════════════════════════
  //  INVOICING VIEW
  // ══════════════════════════════════════
  const renderInvoicing = () => {
    const invoices = [
      { num: "FT-2026/001", client: config.mockClients[0]?.name || "Marco Rossi", date: "18/03/2026", amount: 850, status: "Pagata", method: "Bonifico" },
      { num: "FT-2026/002", client: config.mockClients[1]?.name || "Laura Bianchi", date: "16/03/2026", amount: 420, status: "Inviata", method: "Carta" },
      { num: "FT-2026/003", client: config.mockClients[2]?.name || "Anna Verdi", date: "14/03/2026", amount: 1250, status: "Pagata", method: "Bonifico" },
      { num: "FT-2026/004", client: config.mockClients[3]?.name || "Paolo Neri", date: "12/03/2026", amount: 680, status: "Scaduta", method: "—" },
      { num: "FT-2026/005", client: config.mockClients[4]?.name || "Sara Conti", date: "10/03/2026", amount: 340, status: "Pagata", method: "Carta" },
      { num: "FT-2026/006", client: "Azienda Bianchi Srl", date: "08/03/2026", amount: 2800, status: "Inviata", method: "Bonifico" },
      { num: "FT-2026/007", client: "Rossi & Figli", date: "05/03/2026", amount: 1560, status: "Pagata", method: "Bonifico" },
    ];
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Fatturazione & Pagamenti</h2>
          <Button size="sm" style={{ background: accentColor }} className="text-xs h-8 gap-1"><Plus className="w-3 h-3" /> Nuova Fattura</Button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[{ l: "Fatturato Mese", v: "€7.900", c: "#22c55e" }, { l: "Da Incassare", v: "€1.100", c: "#f59e0b" }, { l: "Scadute", v: "€680", c: "#ef4444" }].map((k, i) => (
            <Card key={i} className="bg-white/[0.03] border-white/[0.06]">
              <CardContent className="p-3 text-center">
                <p className="text-sm font-bold" style={{ color: k.c }}>{k.v}</p>
                <p className="text-[0.5rem] text-white/30 mt-0.5">{k.l}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-white/[0.03] border-white/[0.06] overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-white/[0.06]">
                  {["N° Fattura", "Cliente", "Data", "Importo", "Stato", "Metodo"].map(h => (
                    <th key={h} className="text-left text-[0.55rem] text-white/35 font-medium p-3 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {invoices.map((inv, i) => (
                    <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 text-xs font-mono text-white/40">{inv.num}</td>
                      <td className="p-3 text-xs text-white/70">{inv.client}</td>
                      <td className="p-3 text-xs text-white/50">{inv.date}</td>
                      <td className="p-3 text-xs text-white/80 font-bold">€{inv.amount.toLocaleString("it-IT")}</td>
                      <td className="p-3"><Badge className="text-[0.5rem]" style={{ background: inv.status === "Pagata" ? "#22c55e18" : inv.status === "Inviata" ? "#3b82f618" : "#ef444418", color: inv.status === "Pagata" ? "#22c55e" : inv.status === "Inviata" ? "#3b82f6" : "#ef4444" }}>{inv.status}</Badge></td>
                      <td className="p-3 text-xs text-white/50">{inv.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.04]">
              <span className="text-[0.6rem] text-white/30">{invoices.length} fatture</span>
              <div className="flex gap-1">
                {[1, 2].map(p => (
                  <button key={p} className={`w-7 h-7 rounded-lg text-[0.6rem] font-bold ${p === 1 ? "text-white" : "text-white/30"}`}
                    style={p === 1 ? { background: `${accentColor}20`, color: accentColor } : { background: "rgba(255,255,255,0.03)" }}>{p}</button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // ══════════════════════════════════════
  //  SETTINGS VIEW
  // ══════════════════════════════════════
  const renderSettings = () => {
    return (
      <div className="space-y-5">
        <h2 className="text-base font-bold text-white">Impostazioni</h2>
        <div className="grid grid-cols-1 gap-4">
          {/* General */}
          <Card className="bg-white/[0.03] border-white/[0.06]">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-white/80">Generale</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[{ l: "Nome Attività", v: config.name }, { l: "Email", v: `info@${config.slug}.empire.ai` }, { l: "Telefono", v: "+39 06 1234 5678" }, { l: "Indirizzo", v: "Via Roma 42, Italia" }].map((f, i) => (
                <div key={i}>
                  <label className="text-[0.6rem] text-white/40 mb-1 block">{f.l}</label>
                  <input className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white/70 outline-none focus:border-white/20 transition-colors" defaultValue={f.v} />
                </div>
              ))}
            </CardContent>
          </Card>
          {/* Tutorials toggle */}
          <Card className="bg-white/[0.03] border-white/[0.06]">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-white/80">Tutorial & Guide</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70">Mostra Tutorial</p>
                  <p className="text-[0.55rem] text-white/30">Popup di aiuto contestuali nelle sezioni</p>
                </div>
                <button onClick={() => setTutorialsOn(o => !o)}
                  className={`w-10 h-6 rounded-full transition-all relative ${tutorialsOn ? "" : "bg-white/10"}`}
                  style={tutorialsOn ? { background: accentColor } : {}}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${tutorialsOn ? "left-5" : "left-1"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70">Notifiche Push</p>
                  <p className="text-[0.55rem] text-white/30">Ricevi aggiornamenti in tempo reale</p>
                </div>
                <button className="w-10 h-6 rounded-full transition-all relative" style={{ background: accentColor }}>
                  <div className="absolute top-1 left-5 w-4 h-4 rounded-full bg-white" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70">Tema Scuro</p>
                  <p className="text-[0.55rem] text-white/30">Sempre attivo su Empire</p>
                </div>
                <button className="w-10 h-6 rounded-full transition-all relative" style={{ background: accentColor }}>
                  <div className="absolute top-1 left-5 w-4 h-4 rounded-full bg-white" />
                </button>
              </div>
            </CardContent>
          </Card>
          {/* Branding */}
          <Card className="bg-white/[0.03] border-white/[0.06]">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-white/80">Branding</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-[0.6rem] text-white/40 mb-1 block">Colore Primario</label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg border border-white/10" style={{ background: accentColor }} />
                  <input className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white/70 outline-none" defaultValue={accentColor} />
                </div>
              </div>
              <div>
                <label className="text-[0.6rem] text-white/40 mb-1 block">Logo</label>
                <div className="w-full h-20 rounded-xl border border-dashed border-white/10 flex items-center justify-center">
                  <p className="text-[0.6rem] text-white/25">Trascina qui il tuo logo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // ── Generic module placeholder ──
  const renderGenericModule = () => {
    const mod = config.adminModules.find(m => m.route === activeModule);
    return (
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">{mod?.label || activeModule}</h2>
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: `${accentColor}15` }}>
              {(() => { const Icon = resolveIcon(mod?.icon || "Star"); return <Icon className="w-7 h-7" style={{ color: accentColor }} />; })()}
            </div>
            <p className="text-sm text-white/60 mb-2">Modulo <strong className="text-white">{mod?.label}</strong> attivo</p>
            <p className="text-xs text-white/30 max-w-sm mx-auto">Questa sezione è completamente funzionale nel tuo account Empire. Nella demo puoi esplorare l'interfaccia e scoprire tutte le funzionalità.</p>
            <Button className="mt-4 text-xs" style={{ background: accentColor }}>
              Attiva per il tuo business <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderModuleContent = () => {
    switch (activeModule) {
      case "": return renderDashboard();
      case "clients": case "patients": return renderClients();
      case "orders": case "bookings": case "fleet": case "cross-selling": return renderOrders();
      case "appointments": case "reservations": case "calendar": return renderCalendar();
      case "agents": return renderAgents();
      case "analytics": return renderDashboard();
      case "marketing": case "whatsapp": case "social": return renderMarketing();
      case "invoicing": case "billing": case "finance": return renderInvoicing();
      case "settings": return renderSettings();
      default: return renderGenericModule();
    }
  };

  return (
    <div className="min-h-screen flex relative" style={{ background: "#0a0a12" }}>
      {/* Premium sector-themed ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: `radial-gradient(circle, ${accentColor}, transparent 70%)`, filter: "blur(120px)", transform: "translate(-30%, -30%)" }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: `radial-gradient(circle, ${accentColor}, transparent 70%)`, filter: "blur(140px)", transform: "translate(30%, 30%)" }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full opacity-[0.02]"
          style={{ background: `radial-gradient(circle, ${accentColor}, transparent 65%)`, filter: "blur(100px)", transform: "translate(-50%, -50%)" }} />
        <div className="absolute inset-0" style={{ opacity: 0.015, backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      </div>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0d0d1a] border-r border-white/[0.06] transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarInner />
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Demo Banner */}
        <div className="sticky top-0 z-30 px-4 py-2 text-center text-xs font-medium" style={{ background: `linear-gradient(90deg, ${accentColor}20, ${accentColor}10)`, borderBottom: `1px solid ${accentColor}30` }}>
          <span className="text-white/60">🔍 DEMO MODE — Stai esplorando</span>{" "}
          <strong style={{ color: accentColor }}>{config.name}</strong>{" "}
          <Button size="sm" className="ml-3 text-[0.6rem] h-6 px-3" style={{ background: accentColor }} onClick={() => navigate("/admin")}>
            Inizia Ora →
          </Button>
        </div>

        {/* Top bar */}
        <header className="sticky top-8 z-20 bg-[#0a0a12]/80 backdrop-blur-xl border-b border-white/[0.04] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center text-white/50">
              <MenuIcon className="w-4 h-4" />
            </button>
            <h1 className="text-sm font-bold text-white">
              {config.adminModules.find(m => m.route === activeModule)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
              <input className="bg-white/[0.04] border border-white/[0.06] rounded-lg pl-8 pr-3 py-1.5 text-[0.65rem] text-white placeholder:text-white/20 outline-none w-48 focus:border-white/15 transition-colors" placeholder="Cerca..." />
            </div>
            <button className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/30 relative hover:bg-white/[0.06] transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 text-[6px] text-white font-bold flex items-center justify-center">3</span>
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: `${accentColor}40` }}>
              AD
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 lg:p-6 pb-20 lg:pb-6">
          {renderModuleContent()}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-[#0d0d1a]/95 backdrop-blur-xl border-t border-white/[0.06] px-2 py-1.5 flex items-center justify-around safe-area-pb">
        {config.adminModules.slice(0, 5).map(mod => {
          const Icon = resolveIcon(mod.icon);
          const isActive = activeModule === mod.route;
          return (
            <button key={mod.route} onClick={() => setActiveModule(mod.route)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all ${isActive ? "" : "text-white/30"}`}
              style={isActive ? { color: accentColor } : {}}>
              <Icon className="w-4 h-4" />
              <span className="text-[0.5rem]">{mod.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tutorial Popup */}
      {tutorialsOn && (
        <TutorialPopup
          id={`demo-admin-${sectorKey}`}
          title={`Benvenuto in ${config.name}!`}
          accentColor={accentColor}
          steps={[
            { emoji: "👋", title: "Benvenuto nella Dashboard!", description: "Questa è la tua dashboard demo. Esplora tutte le sezioni dal menu laterale." },
            { emoji: "📊", title: "KPI in Tempo Reale", description: "I numeri si aggiornano automaticamente. Ogni card mostra il trend rispetto al periodo precedente." },
            { emoji: "🤖", title: "Agenti AI Attivi", description: `${allAgents.length} agenti intelligenti lavorano 24/7 per il tuo business. Scoprili nella sezione dedicata.` },
            { emoji: "🚀", title: "Pronto per iniziare?", description: "Ogni funzionalità è completamente personalizzabile. Attiva Empire per il tuo business!" },
          ]}
        />
      )}
    </div>
  );
}
