import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChefHat, Car, Scissors, Heart, Store, Dumbbell, Building,
  Calendar, Shield, TrendingUp, Bell, QrCode, MonitorSmartphone,
  Wallet, Users, Package, CreditCard, Target, BarChart3,
  Fingerprint, ClipboardCheck, Bot, ArrowRight, Layers,
  Umbrella, Wrench, Zap, Grape, SprayCan, Scale, Calculator,
  Hammer, Camera, TreePine, PawPrint, Brush, Baby, GraduationCap,
  PartyPopper, Truck, Settings, Stethoscope, Receipt, MapPin,
  Sparkles, Route, Star, BookOpen, Grid, Eye,
  ChevronLeft, ChevronRight, Play, Pause, LayoutGrid, X,
} from "lucide-react";

import { IPhoneFrame, getSectorStyle } from "@/components/public/IndustryPhoneShowcase";
import { INDUSTRY_CONFIGS, type IndustryId } from "@/config/industry-config";
import { DEMO_INDUSTRY_DATA } from "@/data/demo-industries";

import cartoonFood from "@/assets/cartoon-sector-food.png";
import cartoonNcc from "@/assets/cartoon-sector-ncc.png";
import cartoonBeauty from "@/assets/cartoon-sector-beauty.png";
import cartoonHealthcare from "@/assets/cartoon-sector-healthcare.png";
import cartoonRetail from "@/assets/cartoon-sector-retail.png";
import cartoonFitness from "@/assets/cartoon-sector-fitness.png";
import cartoonHotel from "@/assets/cartoon-sector-hotel.png";

const smoothEase = [0.22, 1, 0.36, 1] as const;

interface SectorData {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  headline: string;
  shimmer: string;
  desc: string;
  features: { title: string; desc: string; icon: React.ReactNode }[];
  img: string | null;
  stats: { label: string; val: string }[];
  slug: string;
}

const SHOWCASE_SECTORS: SectorData[] = [
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
    desc: "Gestisci flotta NCC, prenotazioni e autisti con un sistema AI che automatizza tariffe, assegnazioni e comunicazioni.",
    features: [
      { title: "Booking Engine Intelligente", desc: "Prenotazioni con calcolo tariffe automatico per tratta", icon: <Calendar className="w-3 h-3" /> },
      { title: "Gestione Flotta & Autisti", desc: "Monitora scadenze CQC, patenti e revisioni", icon: <Shield className="w-3 h-3" /> },
      { title: "Tariffe Dinamiche", desc: "Prezzi custom per tratta, extra notturno e festivi", icon: <TrendingUp className="w-3 h-3" /> },
      { title: "Tracking & Notifiche Live", desc: "Conferme, reminder e tracking in tempo reale", icon: <Bell className="w-3 h-3" /> },
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
  {
    id: "beach",
    label: "Stabilimenti Balneari",
    icon: <Umbrella className="w-3.5 h-3.5" />,
    color: "hsla(190,70%,50%,1)",
    headline: "Spiaggia Digitale,",
    shimmer: "Ombrelloni Sempre Pieni",
    desc: "Mappa interattiva ombrelloni, prenotazione online, abbonamenti stagionali e gestione bar integrata — ogni lettino monetizzato.",
    features: [
      { title: "Mappa Interattiva Spot", desc: "Griglia visuale con disponibilità in tempo reale", icon: <MapPin className="w-3 h-3" /> },
      { title: "Booking Online", desc: "Prenotazioni da web/WhatsApp con conferma automatica", icon: <Calendar className="w-3 h-3" /> },
      { title: "Abbonamenti & Pass", desc: "Stagionali, settimanali e giornalieri digitali", icon: <CreditCard className="w-3 h-3" /> },
      { title: "Bar & Extra Ordering", desc: "Ordini cibo e bevande direttamente dal lettino", icon: <QrCode className="w-3 h-3" /> },
    ],
    img: null,
    stats: [{ label: "Occupazione", val: "+52%" }, { label: "Prenotazioni", val: "3x" }, { label: "Revenue bar", val: "+35%" }],
    slug: "lido-azzurro",
  },
  {
    id: "plumber",
    label: "Idraulici",
    icon: <Wrench className="w-3.5 h-3.5" />,
    color: "hsla(210,60%,50%,1)",
    headline: "Interventi Smart,",
    shimmer: "Zero Carta, +Lavori",
    desc: "Gestione interventi da richiesta a fattura, schede tecniche, foto cantiere e dispatch automatico — tutta la tua attività in tasca.",
    features: [
      { title: "Gestione Interventi", desc: "Workflow completo: richiesta → sopralluogo → fattura", icon: <ClipboardCheck className="w-3 h-3" /> },
      { title: "Dispatch Automatico", desc: "Assegnazione tecnico per zona e disponibilità", icon: <MapPin className="w-3 h-3" /> },
      { title: "Foto & Documenti", desc: "Report fotografico cantiere con firma digitale", icon: <Camera className="w-3 h-3" /> },
      { title: "Preventivi & Fatture", desc: "Generazione automatica con materiali e manodopera", icon: <Receipt className="w-3 h-3" /> },
    ],
    img: null,
    stats: [{ label: "Interventi/mese", val: "+40%" }, { label: "Tempo admin", val: "-70%" }, { label: "Incassi", val: "+35%" }],
    slug: "idraulico-express",
  },
  {
    id: "electrician",
    label: "Elettricisti",
    icon: <Zap className="w-3.5 h-3.5" />,
    color: "hsla(50,80%,50%,1)",
    headline: "Elettricista Connesso,",
    shimmer: "Lavori × Automatici",
    desc: "Interventi, preventivi e gestione clienti — tutto digitalizzato per risparmiare tempo e guadagnare di più.",
    features: [
      { title: "Schede Intervento", desc: "Dettaglio materiali, ore e foto per ogni lavoro", icon: <ClipboardCheck className="w-3 h-3" /> },
      { title: "Preventivi Rapidi", desc: "Template predefiniti con listino materiali", icon: <Receipt className="w-3 h-3" /> },
      { title: "Gestione Scadenze", desc: "Certificazioni, verifiche e manutenzioni programmate", icon: <Shield className="w-3 h-3" /> },
      { title: "CRM Clienti", desc: "Storico impianti, contratti e richiami automatici", icon: <Users className="w-3 h-3" /> },
    ],
    img: null,
    stats: [{ label: "Preventivi", val: "+55%" }, { label: "Tempo carta", val: "-65%" }, { label: "Clienti", val: "+30%" }],
    slug: "elettricista-pro",
  },
  {
    id: "agriturismo",
    label: "Agriturismo",
    icon: <Grape className="w-3.5 h-3.5" />,
    color: "hsla(80,50%,45%,1)",
    headline: "Agriturismo Digitale,",
    shimmer: "Natura + Tecnologia",
    desc: "Prenotazioni camere e ristorante, esperienze, degustazioni e vendita diretta — valorizza ogni aspetto della tua attività rurale.",
    features: [
      { title: "Booking Camere & Tavoli", desc: "Prenotazioni integrate con calendario unificato", icon: <Calendar className="w-3 h-3" /> },
      { title: "Menu Km Zero", desc: "Menu digitale con prodotti dell'azienda agricola", icon: <QrCode className="w-3 h-3" /> },
      { title: "Esperienze & Tour", desc: "Degustazioni, visite guidate e cooking class", icon: <Star className="w-3 h-3" /> },
      { title: "Shop Prodotti Tipici", desc: "E-commerce per olio, vino e prodotti locali", icon: <Package className="w-3 h-3" /> },
    ],
    img: null,
    stats: [{ label: "Prenotazioni", val: "+48%" }, { label: "Shop online", val: "+120%" }, { label: "Review", val: "4.9★" }],
    slug: "podere-toscano",
  },
  {
    id: "cleaning",
    label: "Imprese di Pulizia",
    icon: <SprayCan className="w-3.5 h-3.5" />,
    color: "hsla(160,50%,48%,1)",
    headline: "Pulizie Professionali,",
    shimmer: "Gestione Totale",
    desc: "Pianificazione turni, checklist digitali, report fotografici e gestione contratti — professionalità certificata.",
    features: [
      { title: "Pianificazione Turni", desc: "Calendario squadre con assegnazione zone", icon: <Calendar className="w-3 h-3" /> },
      { title: "Checklist Digitali", desc: "Verifiche per ogni ambiente con foto prima/dopo", icon: <ClipboardCheck className="w-3 h-3" /> },
      { title: "Gestione Contratti", desc: "Scadenze, rinnovi e fatturazione automatica", icon: <Receipt className="w-3 h-3" /> },
      { title: "Report Qualità", desc: "Dashboard soddisfazione cliente con KPI", icon: <BarChart3 className="w-3 h-3" /> },
    ],
    img: null,
    stats: [{ label: "Efficienza", val: "+45%" }, { label: "Reclami", val: "-60%" }, { label: "Contratti", val: "+30%" }],
    slug: "clean-pro-service",
  },
  {
    id: "legal",
    label: "Studi Legali",
    icon: <Scale className="w-3.5 h-3.5" />,
    color: "hsla(220,40%,45%,1)",
    headline: "Studio Legale Digitale,",
    shimmer: "Casi × Organizzati",
    desc: "Gestione pratiche, scadenze processuali, time tracking e fatturazione — ogni fascicolo sotto controllo.",
    features: [
      { title: "Gestione Fascicoli", desc: "Pratiche con documenti, scadenze e stato avanzamento", icon: <ClipboardCheck className="w-3 h-3" /> },
      { title: "Scadenze & Udienze", desc: "Calendario con alert automatici per termini", icon: <Calendar className="w-3 h-3" /> },
      { title: "Time Tracking", desc: "Registrazione ore per cliente e pratica", icon: <BarChart3 className="w-3 h-3" /> },
      { title: "Fatturazione Legale", desc: "Note proforma e parcelle con calcolo automatico", icon: <Receipt className="w-3 h-3" /> },
    ],
    img: null,
    stats: [{ label: "Pratiche", val: "+35%" }, { label: "Scadenze mancate", val: "0" }, { label: "Fatturazione", val: "-50% tempo" }],
    slug: "studio-legale-roma",
  },
  {
    id: "accounting",
    label: "Commercialisti",
    icon: <Calculator className="w-3.5 h-3.5" />,
    color: "hsla(200,35%,48%,1)",
    headline: "Studio Commerciale,",
    shimmer: "Efficienza ×5",
    desc: "Gestione clienti, scadenze fiscali, raccolta documenti e collaborazione — lo studio del futuro è digitale.",
    features: [
      { title: "Portale Clienti", desc: "Area riservata per documenti e comunicazioni", icon: <Users className="w-3 h-3" /> },
      { title: "Scadenzario Fiscale", desc: "Alert automatici per adempimenti e dichiarazioni", icon: <Bell className="w-3 h-3" /> },
      { title: "Raccolta Documenti", desc: "Upload sicuro fatture e giustificativi", icon: <Package className="w-3 h-3" /> },
      { title: "Dashboard Clienti", desc: "Panoramica situazione contabile per cliente", icon: <BarChart3 className="w-3 h-3" /> },
    ],
    img: null,
    stats: [{ label: "Tempo admin", val: "-55%" }, { label: "Clienti gestiti", val: "+40%" }, { label: "Soddisfazione", val: "4.7★" }],
    slug: "studio-fiscale-pro",
  },
  {
    id: "garage",
    label: "Autofficine",
    icon: <Settings className="w-3.5 h-3.5" />,
    color: "hsla(0,65%,50%,1)",
    headline: "Officina Connessa,",
    shimmer: "Riparazioni × Smart",
    desc: "Gestione veicoli, preventivi, stato riparazione in tempo reale e richiami automatici per tagliandi.",
    features: [
      { title: "Schede Veicolo", desc: "Storico completo riparazioni per ogni auto", icon: <ClipboardCheck className="w-3 h-3" /> },
      { title: "Preventivi Rapidi", desc: "Template ricambi e manodopera con listino", icon: <Receipt className="w-3 h-3" /> },
      { title: "Status Tracking", desc: "Il cliente vede lo stato della riparazione live", icon: <MonitorSmartphone className="w-3 h-3" /> },
      { title: "Recall Tagliandi", desc: "Promemoria automatici per manutenzioni periodiche", icon: <Bell className="w-3 h-3" /> },
    ],
    img: null,
    stats: [{ label: "Riparazioni", val: "+38%" }, { label: "Recall", val: "85%" }, { label: "Revenue", val: "+30%" }],
    slug: "auto-service-pro",
  },
  {
    id: "photography",
    label: "Fotografi",
    icon: <Camera className="w-3.5 h-3.5" />,
    color: "hsla(280,45%,55%,1)",
    headline: "Studio Fotografico,",
    shimmer: "Portfolio × Infinito",
    desc: "Booking servizi, gallery clienti, contratti digitali e consegna automatica — concentrati sulla creatività.",
    features: [
      { title: "Booking Servizi", desc: "Calendario con tipologie shooting e pacchetti", icon: <Calendar className="w-3 h-3" /> },
      { title: "Gallery Private", desc: "Consegna foto con download e selezione cliente", icon: <MonitorSmartphone className="w-3 h-3" /> },
      { title: "Contratti Digitali", desc: "Liberatorie e contratti con firma elettronica", icon: <ClipboardCheck className="w-3 h-3" /> },
      { title: "Portfolio & Social", desc: "Sito portfolio con integrazione social automatica", icon: <Target className="w-3 h-3" /> },
    ],
    img: null,
    stats: [{ label: "Booking", val: "+50%" }, { label: "Consegne", val: "-3 giorni" }, { label: "Clienti", val: "+45%" }],
    slug: "photo-studio-art",
  },
  {
    id: "construction",
    label: "Edilizia",
    icon: <Hammer className="w-3.5 h-3.5" />,
    color: "hsla(30,60%,48%,1)",
    headline: "Cantiere Digitale,",
    shimmer: "Progetti × Controllati",
    desc: "Gestione cantieri, timeline progetti, SAL, sicurezza e documentazione — tutto il cantiere in un'app.",
    features: [
      { title: "Timeline Progetti", desc: "Gantt interattivo con milestone e dipendenze", icon: <BarChart3 className="w-3 h-3" /> },
      { title: "SAL & Contabilità", desc: "Stati avanzamento lavori con calcolo automatico", icon: <Receipt className="w-3 h-3" /> },
      { title: "Sicurezza Cantiere", desc: "Checklist DPI, infortuni e documentazione", icon: <Shield className="w-3 h-3" /> },
      { title: "Foto & Report", desc: "Documentazione fotografica georeferenziata", icon: <Camera className="w-3 h-3" /> },
    ],
    img: null,
    stats: [{ label: "Ritardi", val: "-40%" }, { label: "Margine", val: "+22%" }, { label: "Documentazione", val: "100%" }],
    slug: "costruzioni-smart",
  },
  {
    id: "gardening",
    label: "Giardinieri",
    icon: <TreePine className="w-3.5 h-3.5" />,
    color: "hsla(120,45%,42%,1)",
    headline: "Verde Professionale,",
    shimmer: "Clienti × Automatici",
    desc: "Pianificazione interventi, gestione clienti, preventivi e manutenzioni programmate — il tuo business verde cresce con l'AI.",
    features: [
      { title: "Calendario Interventi", desc: "Pianificazione settimanale con routing ottimizzato", icon: <Calendar className="w-3 h-3" /> },
      { title: "Schede Giardino", desc: "Piante, trattamenti e foto per ogni cliente", icon: <ClipboardCheck className="w-3 h-3" /> },
      { title: "Preventivi Automatici", desc: "Template con voci standard e personalizzate", icon: <Receipt className="w-3 h-3" /> },
      { title: "Manutenzioni Ricorrenti", desc: "Alert per potature, concimazioni e trattamenti", icon: <Bell className="w-3 h-3" /> },
    ],
    img: null,
    stats: [{ label: "Clienti", val: "+35%" }, { label: "Efficienza", val: "+50%" }, { label: "Revenue", val: "+28%" }],
    slug: "verde-pro-service",
  },
  {
    id: "veterinary",
    label: "Veterinari",
    icon: <PawPrint className="w-3.5 h-3.5" />,
    color: "hsla(140,50%,45%,1)",
    headline: "Clinica Veterinaria,",
    shimmer: "Cure × Smart",
    desc: "Cartelle cliniche animali, vaccini, recall e telemedicina veterinaria — la salute dei pet è digitale.",
    features: [
      { title: "Cartelle Cliniche", desc: "Storico visite, diagnosi e terapie per animale", icon: <ClipboardCheck className="w-3 h-3" /> },
      { title: "Scadenzario Vaccini", desc: "Reminder automatici per richiami e profilassi", icon: <Bell className="w-3 h-3" /> },
      { title: "Telemedicina Vet", desc: "Consulti video per urgenze e follow-up", icon: <MonitorSmartphone className="w-3 h-3" /> },
      { title: "Shop & Farmacia", desc: "Vendita alimenti e farmaci con prescrizione", icon: <Package className="w-3 h-3" /> },
    ],
    img: null,
    stats: [{ label: "Pazienti", val: "+42%" }, { label: "Recall vaccini", val: "95%" }, { label: "Soddisfazione", val: "4.9★" }],
    slug: "clinica-pet-care",
  },
  {
    id: "tattoo",
    label: "Tattoo Studio",
    icon: <Brush className="w-3.5 h-3.5" />,
    color: "hsla(0,0%,40%,1)",
    headline: "Tattoo Studio Pro,",
    shimmer: "Arte × Digitale",
    desc: "Portfolio artistico, prenotazioni, consensi digitali e gestione appuntamenti — ogni tatuaggio è un'esperienza premium.",
    features: [
      { title: "Portfolio Artisti", desc: "Gallery stili per artista con filtri avanzati", icon: <MonitorSmartphone className="w-3 h-3" /> },
      { title: "Booking & Depositi", desc: "Prenotazioni con acconto online obbligatorio", icon: <CreditCard className="w-3 h-3" /> },
      { title: "Consensi Digitali", desc: "Moduli sanitari e liberatorie con firma", icon: <Shield className="w-3 h-3" /> },
      { title: "Aftercare AI", desc: "Istruzioni personalizzate post-sessione via WhatsApp", icon: <Bot className="w-3 h-3" /> },
    ],
    img: null,
    stats: [{ label: "Prenotazioni", val: "+55%" }, { label: "No-show", val: "-85%" }, { label: "Rating", val: "4.8★" }],
    slug: "ink-art-studio",
  },
  {
    id: "childcare",
    label: "Asili & Infanzia",
    icon: <Baby className="w-3.5 h-3.5" />,
    color: "hsla(340,55%,58%,1)",
    headline: "Asilo Connesso,",
    shimmer: "Genitori × Sereni",
    desc: "Diario digitale, comunicazioni ai genitori, presenze e menu settimanale — trasparenza totale per le famiglie.",
    features: [
      { title: "Diario Digitale", desc: "Foto, attività e pasti condivisi con i genitori", icon: <Camera className="w-3 h-3" /> },
      { title: "Presenze & Check-in", desc: "Registro digitale con notifica ingresso/uscita", icon: <Fingerprint className="w-3 h-3" /> },
      { title: "Comunicazioni", desc: "Avvisi, circolari e chat diretta con educatori", icon: <Bell className="w-3 h-3" /> },
      { title: "Menu & Allergie", desc: "Piano alimentare con gestione intolleranze", icon: <QrCode className="w-3 h-3" /> },
    ],
    img: null,
    stats: [{ label: "Soddisfazione", val: "4.9★" }, { label: "Comunicazioni", val: "+80%" }, { label: "Admin", val: "-60%" }],
    slug: "happy-kids-nursery",
  },
  {
    id: "education",
    label: "Formazione",
    icon: <GraduationCap className="w-3.5 h-3.5" />,
    color: "hsla(250,50%,55%,1)",
    headline: "Scuola Digitale,",
    shimmer: "Apprendimento × Smart",
    desc: "Corsi online, iscrizioni digitali, certificati e community — la formazione professionale del futuro.",
    features: [
      { title: "Catalogo Corsi", desc: "Corsi con descrizione, prerequisiti e calendario", icon: <BookOpen className="w-3 h-3" /> },
      { title: "Iscrizioni Online", desc: "Checkout con posti limitati e lista d'attesa", icon: <CreditCard className="w-3 h-3" /> },
      { title: "Certificati Digitali", desc: "Attestati con verifica QR e badge", icon: <Shield className="w-3 h-3" /> },
      { title: "Community Studenti", desc: "Forum, risorse e networking tra partecipanti", icon: <Users className="w-3 h-3" /> },
    ],
    img: null,
    stats: [{ label: "Iscrizioni", val: "+65%" }, { label: "Completion", val: "88%" }, { label: "Rating", val: "4.8★" }],
    slug: "academy-pro",
  },
  {
    id: "events",
    label: "Eventi & Catering",
    icon: <PartyPopper className="w-3.5 h-3.5" />,
    color: "hsla(300,45%,52%,1)",
    headline: "Eventi Perfetti,",
    shimmer: "Organizzazione × AI",
    desc: "Preventivi eventi, gestione fornitori, timeline e RSVP digitale — ogni evento diventa un successo pianificato.",
    features: [
      { title: "Preventivi Eventi", desc: "Configuratore menù, location e servizi accessori", icon: <Receipt className="w-3 h-3" /> },
      { title: "Timeline Evento", desc: "Scaletta con assegnazione task al team", icon: <Calendar className="w-3 h-3" /> },
      { title: "RSVP & Inviti", desc: "Inviti digitali con conferma e preferenze menu", icon: <Users className="w-3 h-3" /> },
      { title: "Gestione Fornitori", desc: "Database fornitori con disponibilità e prezzi", icon: <Package className="w-3 h-3" /> },
    ],
    img: null,
    stats: [{ label: "Eventi/anno", val: "+40%" }, { label: "Margine", val: "+25%" }, { label: "Referral", val: "60%" }],
    slug: "events-luxury",
  },
  {
    id: "logistics",
    label: "Logistica & Spedizioni",
    icon: <Truck className="w-3.5 h-3.5" />,
    color: "hsla(215,55%,48%,1)",
    headline: "Logistica Intelligente,",
    shimmer: "Consegne × Ottimizzate",
    desc: "Tracking spedizioni, routing ottimizzato, magazzino e notifiche clienti — ogni pacco consegnato in tempo.",
    features: [
      { title: "Tracking Real-Time", desc: "Posizione e stato spedizione per ogni ordine", icon: <MapPin className="w-3 h-3" /> },
      { title: "Routing Ottimizzato", desc: "Percorsi calcolati per minimizzare tempi e costi", icon: <Route className="w-3 h-3" /> },
      { title: "Gestione Magazzino", desc: "Inventario con barcode scan e movimentazioni", icon: <Package className="w-3 h-3" /> },
      { title: "Notifiche Clienti", desc: "SMS e WhatsApp automatici per stato consegna", icon: <Bell className="w-3 h-3" /> },
    ],
    img: null,
    stats: [{ label: "On-time", val: "96%" }, { label: "Costi route", val: "-30%" }, { label: "Soddisfazione", val: "4.7★" }],
    slug: "express-delivery-pro",
  },
];

// Map sector IDs to their best screen type for iPhone preview
const SECTOR_BEST_SCREEN: Record<string, { label: string; type: string }> = {
  food: { label: "Menu", type: "services" },
  ncc: { label: "Transfer", type: "services" },
  beauty: { label: "Prenota", type: "booking" },
  healthcare: { label: "Dashboard", type: "dashboard" },
  retail: { label: "Analytics", type: "analytics" },
  fitness: { label: "Clienti", type: "crm" },
  hospitality: { label: "Vetrina", type: "hero" },
  beach: { label: "Prenota", type: "booking" },
  plumber: { label: "Interventi", type: "notifications" },
  electrician: { label: "Dashboard", type: "dashboard" },
  construction: { label: "Cantieri", type: "analytics" },
  veterinary: { label: "Pazienti", type: "crm" },
  tattoo: { label: "Portfolio", type: "hero" },
  events: { label: "Eventi", type: "notifications" },
  logistics: { label: "Tracking", type: "analytics" },
  agriturismo: { label: "Camere", type: "services" },
  cleaning: { label: "Servizi", type: "services" },
  legal: { label: "Pratiche", type: "crm" },
  accounting: { label: "Fiscale", type: "dashboard" },
  garage: { label: "Officina", type: "notifications" },
  photography: { label: "Studio", type: "hero" },
  gardening: { label: "Servizi", type: "services" },
  childcare: { label: "Iscrizioni", type: "booking" },
  education: { label: "Corsi", type: "services" },
  custom: { label: "Dashboard", type: "dashboard" },
  bakery: { label: "Vetrina", type: "hero" },
};

const ALL_SCREENS = [
  { label: "Home", type: "hero" },
  { label: "Catalogo", type: "services" },
  { label: "Prenota", type: "booking" },
  { label: "Dashboard", type: "dashboard" },
  { label: "Analytics", type: "analytics" },
  { label: "Clienti", type: "crm" },
  { label: "Notifiche", type: "notifications" },
  { label: "Settings", type: "settings" },
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

// Category groups for filtering
const SECTOR_CATEGORIES: { id: string; label: string; icon: React.ReactNode; sectorIds: string[] }[] = [
  { id: "all", label: "Tutti", icon: <Grid className="w-3 h-3" />, sectorIds: [] },
  { id: "food-hosp", label: "Food & Hotel", icon: <ChefHat className="w-3 h-3" />, sectorIds: ["food", "hospitality", "beach", "agriturismo", "events"] },
  { id: "services", label: "Servizi", icon: <Scissors className="w-3 h-3" />, sectorIds: ["beauty", "fitness", "photography", "tattoo", "childcare", "education"] },
  { id: "health", label: "Salute", icon: <Heart className="w-3 h-3" />, sectorIds: ["healthcare", "veterinary"] },
  { id: "trade", label: "Artigiani", icon: <Wrench className="w-3 h-3" />, sectorIds: ["plumber", "electrician", "construction", "gardening", "garage", "cleaning"] },
  { id: "business", label: "Business", icon: <Store className="w-3 h-3" />, sectorIds: ["retail", "ncc", "legal", "accounting", "logistics"] },
];

export default function MultiSectorShowcase() {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showAllScreens, setShowAllScreens] = useState(false);
  const [showAllSectors, setShowAllSectors] = useState(false);
  const [activeCat, setActiveCat] = useState("all");
  const sector = SHOWCASE_SECTORS[activeIdx];

  const filteredSectors = useMemo(() => {
    if (activeCat === "all") return SHOWCASE_SECTORS;
    const cat = SECTOR_CATEGORIES.find(c => c.id === activeCat);
    if (!cat) return SHOWCASE_SECTORS;
    return SHOWCASE_SECTORS.filter(s => cat.sectorIds.includes(s.id));
  }, [activeCat]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveIdx(p => (p + 1) % SHOWCASE_SECTORS.length);
      setShowAllScreens(false);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  // Get iPhone preview data for current sector
  const sectorId = sector.id as IndustryId;
  const industryCfg = INDUSTRY_CONFIGS[sectorId];
  const demoData = DEMO_INDUSTRY_DATA[sectorId];
  const sectorStyle = industryCfg ? getSectorStyle(sectorId) : undefined;
  const screenType = SECTOR_BEST_SCREEN[sector.id] || { label: "Home", type: "hero" };
  const clr = industryCfg?.defaultPrimaryColor || sector.color;

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

      {/* Category filter tabs */}
      <div className="flex gap-1.5 justify-center flex-wrap mb-4 px-2">
        {SECTOR_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCat(cat.id); setIsAutoPlaying(false); }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.55rem] font-heading font-semibold tracking-wider uppercase transition-all duration-300 border ${
              activeCat === cat.id
                ? "text-foreground border-primary/40 bg-primary/10"
                : "text-foreground/30 border-border/15 hover:text-foreground/50 hover:border-border/30 bg-transparent"
            }`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sector grid — ultra-compact scrollable pills */}
      <div className="relative mb-8 px-2">
        <div className="flex flex-wrap justify-center gap-1">
          {filteredSectors.map((s) => {
            const globalIdx = SHOWCASE_SECTORS.findIndex(ss => ss.id === s.id);
            const isActive = activeIdx === globalIdx;
            return (
              <motion.button
                key={s.id}
                onClick={() => { setActiveIdx(globalIdx); setIsAutoPlaying(false); setShowAllScreens(false); }}
                className={`relative flex items-center gap-1 py-1 px-2 rounded-full text-[0.55rem] font-heading font-semibold tracking-wider uppercase transition-all duration-300 border whitespace-nowrap ${
                  isActive
                    ? "text-foreground border-primary/40"
                    : "text-foreground/25 border-border/10 hover:text-foreground/50 hover:border-border/25"
                }`}
                style={isActive ? {
                  background: `linear-gradient(135deg, ${s.color.replace("1)", "0.15)")}, hsla(265,20%,15%,0.3))`,
                  boxShadow: `0 0 10px ${s.color.replace("1)", "0.08)")}`,
                } : { background: "hsla(0,0%,100%,0.02)" }}
                whileTap={{ scale: 0.95 }}
                layout
              >
                <span className="text-[0.65rem]">{s.icon}</span>
                <span className="relative z-10 leading-none">{s.label}</span>
                {isActive && isAutoPlaying && (
                  <motion.div className="absolute bottom-0 left-2 right-2 h-[1.5px] rounded-full origin-left"
                    style={{ background: s.color }}
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                    transition={{ duration: 5, ease: "linear" }}
                    key={`progress-${activeIdx}`} />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Carousel controls: Prev / Play-Pause / Next + Show All Previews */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <button
          onClick={() => { setActiveIdx(p => (p - 1 + SHOWCASE_SECTORS.length) % SHOWCASE_SECTORS.length); setIsAutoPlaying(false); setShowAllScreens(false); }}
          className="w-8 h-8 rounded-full border border-border/20 flex items-center justify-center text-foreground/40 hover:text-foreground/70 hover:border-border/40 transition-all bg-background/5"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsAutoPlaying(p => !p)}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
            isAutoPlaying 
              ? "border-primary/40 text-primary bg-primary/10" 
              : "border-border/20 text-foreground/40 hover:text-foreground/70 hover:border-border/40 bg-background/5"
          }`}
        >
          {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </button>
        <button
          onClick={() => { setActiveIdx(p => (p + 1) % SHOWCASE_SECTORS.length); setIsAutoPlaying(false); setShowAllScreens(false); }}
          className="w-8 h-8 rounded-full border border-border/20 flex items-center justify-center text-foreground/40 hover:text-foreground/70 hover:border-border/40 transition-all bg-background/5"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-border/15 mx-1" />

        <button
          onClick={() => { setShowAllSectors(p => !p); setIsAutoPlaying(false); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.55rem] font-heading font-semibold tracking-wider uppercase border transition-all ${
            showAllSectors
              ? "border-primary/40 text-primary bg-primary/10"
              : "border-border/20 text-foreground/40 hover:text-foreground/60 hover:border-border/30 bg-background/5"
          }`}
        >
          <LayoutGrid className="w-3 h-3" />
          {showAllSectors ? "Chiudi Gallery" : "Tutti i Mockup"}
        </button>

        {/* Progress indicator */}
        <span className="text-[0.5rem] text-foreground/25 font-mono ml-1">
          {activeIdx + 1}/{SHOWCASE_SECTORS.length}
        </span>
      </div>

      {/* All sectors iPhone gallery */}
      <AnimatePresence>
        {showAllSectors && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: smoothEase }}
            className="mb-10 overflow-hidden"
          >
            <div className="rounded-2xl border border-border/15 backdrop-blur-md p-4"
              style={{ background: "linear-gradient(135deg, hsla(0,0%,100%,0.02), hsla(265,20%,12%,0.3))" }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[0.6rem] font-heading font-semibold tracking-widest uppercase text-foreground/40">
                  <LayoutGrid className="w-3 h-3 inline mr-1.5" />
                  Preview di tutti i {SHOWCASE_SECTORS.length} settori
                </p>
                <button onClick={() => setShowAllSectors(false)} className="w-6 h-6 rounded-full border border-border/20 flex items-center justify-center text-foreground/30 hover:text-foreground/60 transition-all">
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {SHOWCASE_SECTORS.map((s, idx) => {
                  const sid = s.id as IndustryId;
                  const cfg = INDUSTRY_CONFIGS[sid];
                  const dd = DEMO_INDUSTRY_DATA[sid];
                  const ss = cfg ? getSectorStyle(sid) : undefined;
                  const sc = SECTOR_BEST_SCREEN[s.id] || { label: "Home", type: "hero" };
                  const c = cfg?.defaultPrimaryColor || s.color;
                  return (
                    <motion.div
                      key={s.id}
                      className="flex flex-col items-center cursor-pointer group"
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.03 }}
                      onClick={() => { setActiveIdx(idx); setShowAllSectors(false); setShowAllScreens(false); }}
                    >
                      <div className={`transform scale-[0.45] sm:scale-[0.5] origin-top transition-all duration-300 group-hover:scale-[0.52] ${activeIdx === idx ? "ring-2 ring-primary/40 rounded-[2rem]" : ""}`}>
                        {cfg && dd ? (
                          <IPhoneFrame
                            screen={sc}
                            color={c}
                            emoji={cfg.emoji}
                            companyName={dd.companyName}
                            services={dd.services}
                            index={idx}
                            sectorStyle={ss}
                            industryId={sid}
                          />
                        ) : (
                          <div className="w-[180px] h-[360px] rounded-[2rem] flex flex-col items-center justify-center gap-2"
                            style={{ background: s.color.replace("1)", "0.08)"), border: `1px solid ${s.color.replace("1)", "0.15)")}` }}>
                            <span style={{ color: s.color }}>{s.icon}</span>
                            <span className="text-foreground/30 text-[0.55rem]">{s.label}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[6px] font-heading font-bold tracking-widest uppercase mt-[-2rem] relative z-10 text-center"
                        style={{ color: activeIdx === idx ? s.color : "hsla(0,0%,100%,0.35)" }}>
                        {s.icon} {s.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div key={sector.id}
          className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-14 items-center"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4, ease: smoothEase }}>

          {/* Left — Text + features */}
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

            {/* Action buttons */}
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <motion.button
                onClick={() => navigate(`/demo/${sector.id}`)}
                className="group px-6 py-3 rounded-full font-bold text-sm font-heading tracking-wider uppercase inline-flex items-center gap-2 text-white"
                style={{
                  background: `linear-gradient(135deg, ${sector.color}, ${sector.color.replace("1)", "0.7)")})`,
                  boxShadow: `0 8px 30px ${sector.color.replace("1)", "0.2)")}`,
                }}
                whileHover={{ scale: 1.03, boxShadow: `0 15px 50px ${sector.color.replace("1)", "0.3)")}` }}
                whileTap={{ scale: 0.97 }}>
                Scopri Demo <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </motion.button>

              {/* Expand all screens button */}
              {industryCfg && demoData && (
                <motion.button
                  onClick={() => { setShowAllScreens(p => !p); setIsAutoPlaying(false); }}
                  className="px-4 py-3 rounded-full text-[0.6rem] font-heading font-semibold tracking-wider uppercase border inline-flex items-center gap-2 transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: `${sector.color.replace("1)", "0.2)")}`,
                    color: sector.color,
                    background: sector.color.replace("1)", "0.05)"),
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Layers className="w-3.5 h-3.5" />
                  {showAllScreens ? "Chiudi Preview" : "Vedi Tutte le Schermate"}
                </motion.button>
              )}
            </div>
          </div>

          {/* Right — iPhone Preview */}
          <div className="w-full flex flex-col items-center">
            <AnimatePresence mode="wait">
              {!showAllScreens ? (
                /* Single iPhone preview — the sector's best screen */
                <motion.div
                  key="single"
                  className="cursor-pointer transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.03]"
                  onClick={() => { setShowAllScreens(true); setIsAutoPlaying(false); }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: smoothEase }}
                >
                  {industryCfg && demoData ? (
                    <div className="relative">
                      <IPhoneFrame
                        screen={screenType}
                        color={clr}
                        emoji={industryCfg.emoji}
                        companyName={demoData.companyName}
                        services={demoData.services}
                        index={activeIdx}
                        sectorStyle={sectorStyle}
                        industryId={sectorId}
                      />
                      {/* Stats overlay below phone */}
                      <div className="flex gap-2 mt-4 justify-center">
                        {sector.stats.map((s, i) => (
                          <motion.div key={i} className="px-3 py-2 rounded-xl text-center"
                            style={{ background: "hsla(0,0%,100%,0.03)", border: `1px solid ${sector.color.replace("1)", "0.1)")}` }}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                            <p className="text-[0.5rem] tracking-wider uppercase" style={{ color: sector.color.replace("1)", "0.6)") }}>{s.label}</p>
                            <p className="text-[0.7rem] font-heading font-bold text-foreground">{s.val}</p>
                          </motion.div>
                        ))}
                      </div>
                      {/* Tap hint */}
                      <motion.p className="text-center text-[0.55rem] text-foreground/25 mt-3 tracking-wider uppercase"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}>
                        <Layers className="w-3 h-3 inline mr-1" /> Tap per vedere tutte le schermate
                      </motion.p>
                    </div>
                  ) : (
                    /* Fallback for sectors without demo data */
                    <div className="relative rounded-2xl overflow-hidden" style={{
                      boxShadow: `0 0 60px ${sector.color.replace("1)", "0.08)")}, 0 20px 60px hsla(0,0%,0%,0.3)`,
                      border: `1px solid ${sector.color.replace("1)", "0.12)")}`,
                    }}>
                      {sector.img ? (
                        <img src={sector.img} alt={sector.label} className="w-full aspect-[4/3] object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full aspect-[4/3] flex flex-col items-center justify-center relative overflow-hidden rounded-2xl"
                          style={{ background: `linear-gradient(135deg, ${sector.color.replace("1)", "0.15)")}, hsla(260,14%,10%,0.95))` }}>
                          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
                            style={{ background: sector.color.replace("1)", "0.15)"), border: `1px solid ${sector.color.replace("1)", "0.25)")}` }}>
                            <span style={{ color: sector.color }}>{sector.icon}</span>
                          </div>
                          <p className="text-sm font-heading font-bold text-foreground/60">{sector.label}</p>
                        </div>
                      )}
                      <div className="absolute inset-0 pointer-events-none" style={{
                        background: `linear-gradient(to top, hsla(260,14%,10%,0.8) 0%, transparent 50%, ${sector.color.replace("1)", "0.05)")} 100%)`,
                      }} />
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
                  )}
                </motion.div>
              ) : (
                /* Expanded: all 8 screens in grid */
                <motion.div
                  key="expanded"
                  className="w-full"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: smoothEase }}
                >
                  <div className="rounded-2xl border backdrop-blur-md p-4 sm:p-6"
                    style={{ borderColor: `${sector.color.replace("1)", "0.15)")}`, background: `linear-gradient(135deg, hsla(0,0%,100%,0.02), ${sector.color.replace("1)", "0.05)")})` }}>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 justify-items-center mb-4">
                      {ALL_SCREENS.map((screen, si) => (
                        <motion.div key={screen.type} className="flex flex-col items-center"
                          initial={{ opacity: 0, y: 20, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.4, delay: si * 0.06, ease: smoothEase }}>
                          <div className="transform scale-[0.6] sm:scale-[0.7] origin-top">
                            {industryCfg && demoData ? (
                              <IPhoneFrame
                                screen={screen}
                                color={clr}
                                emoji={industryCfg.emoji}
                                companyName={demoData.companyName}
                                services={demoData.services}
                                index={si}
                                sectorStyle={sectorStyle}
                                industryId={sectorId}
                              />
                            ) : (
                              <div className="w-[160px] h-[320px] rounded-2xl flex items-center justify-center"
                                style={{ background: sector.color.replace("1)", "0.08)"), border: `1px solid ${sector.color.replace("1)", "0.15)")}` }}>
                                <span className="text-foreground/30 text-xs">{screen.label}</span>
                              </div>
                            )}
                          </div>
                          <span className="text-[7px] font-bold tracking-widest uppercase mt-1"
                            style={{ color: sector.color.replace("1)", "0.7)") }}>{screen.label}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <motion.button
                        onClick={() => navigate(`/demo/${sector.id}`)}
                        className="px-4 py-2 rounded-xl text-[10px] sm:text-xs font-bold tracking-wider uppercase flex items-center gap-2 text-white"
                        style={{
                          background: `linear-gradient(135deg, ${sector.color}, ${sector.color.replace("1)", "0.8)")})`,
                          boxShadow: `0 4px 20px ${sector.color.replace("1)", "0.25)")}`,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="w-3.5 h-3.5" /> Prova Demo Live
                      </motion.button>
                      <motion.button
                        onClick={() => setShowAllScreens(false)}
                        className="px-4 py-2 rounded-xl text-[10px] sm:text-xs font-semibold border text-foreground/50 hover:text-foreground transition-all"
                        style={{ borderColor: sector.color.replace("1)", "0.15)") }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Chiudi
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom persuasion */}
      <motion.div className="text-center mt-12 pt-8 border-t border-border/10"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <p className="text-foreground/25 text-xs font-heading tracking-wider uppercase">
          <span style={{ color: "hsl(38,45%,52%)" }}>{SHOWCASE_SECTORS.length} settori</span> · 95+ Agenti IA · 1 piattaforma · <span className="text-foreground/40">il tuo brand</span>
        </p>
      </motion.div>
    </>
  );
}
