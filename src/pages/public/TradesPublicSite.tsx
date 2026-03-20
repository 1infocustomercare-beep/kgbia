import { useState, useRef, useEffect, forwardRef } from "react";
import DemoAdminAccessButton from "@/components/public/DemoAdminAccessButton";
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
import { AIAgentsShowcase } from "@/components/public/AIAgentsShowcase";
import { SectorValueProposition } from "@/components/public/SectorValueProposition";
import { MarqueeCarousel, AmbientGlow, FloatingOrbs, NeonDivider, ScrollIndicator, PremiumFAQ } from "@/components/public/PremiumSiteKit";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Wrench, Zap, Star, Phone, Mail, MapPin, Clock, Calendar,
  Shield, CheckCircle, Send, Award, Users, FileText,
  Hammer, Lightbulb, Droplets, Settings, AlertTriangle,
  Sparkles, ChevronDown, Menu, X, Camera, Baby, BookOpen,
  GraduationCap, HardHat, Truck, Car, Heart, Package, Scissors,
  Palette, Music, Building, TreePine, Stethoscope, Scale
} from "lucide-react";
import { type IndustryId, getIndustryConfig } from "@/config/industry-config";
import { HeroVideoBackground } from "@/components/public/HeroVideoBackground";
import { HeroPhotoCarousel } from "@/components/public/HeroPhotoCarousel";
import { DemoPricingSection } from "@/components/public/DemoPricingSection";
import { DemoRichFooter } from "@/components/public/DemoRichFooter";
import { DemoTestimonialsCarousel } from "@/components/public/DemoTestimonialsCarousel";
import fallbackHeroVideo from "@/assets/video-industries.mp4";

/* ─── DYNAMIC PALETTE PER TRADE TYPE ─── */
type VisualStyle = "glass" | "solid" | "neon" | "warm" | "minimal" | "bold" | "organic";
interface SectorPalette {
  accent: string;
  dark: string;
  glow: string;
  heroLayout: "standard" | "split" | "centered" | "bold" | "elegant";
  visualStyle: VisualStyle;
  fontDisplay: string;
  fontBody: string;
  cardRadius: string;
  heroGradient?: string;
  bgPattern?: "grid" | "dots" | "diagonal" | "none";
  sectionBg?: string;
}

const PALETTES: Record<string, SectorPalette> = {
  electrician: { accent: "#F5B800", dark: "#0C0A06", glow: "#FFF3C4", heroLayout: "bold", visualStyle: "neon", fontDisplay: "'Space Grotesk', sans-serif", fontBody: "'Inter', sans-serif", cardRadius: "rounded-xl", heroGradient: "linear-gradient(135deg, #F5B80020, #FF880010)", bgPattern: "grid" },
  plumber: { accent: "#3B82F6", dark: "#060A10", glow: "#DBEAFE", heroLayout: "standard", visualStyle: "solid", fontDisplay: "'Space Grotesk', sans-serif", fontBody: "'Inter', sans-serif", cardRadius: "rounded-2xl", bgPattern: "dots" },
  construction: { accent: "#EF6C00", dark: "#0A0704", glow: "#FFE0B2", heroLayout: "bold", visualStyle: "bold", fontDisplay: "'Space Grotesk', sans-serif", fontBody: "'Inter', sans-serif", cardRadius: "rounded-xl", heroGradient: "linear-gradient(160deg, #EF6C0015, #FF980010)", bgPattern: "diagonal" },
  gardening: { accent: "#4CAF50", dark: "#040A04", glow: "#C8E6C9", heroLayout: "elegant", visualStyle: "organic", fontDisplay: "'Playfair Display', serif", fontBody: "'Inter', sans-serif", cardRadius: "rounded-3xl", bgPattern: "none" },
  cleaning: { accent: "#00BCD4", dark: "#040A0A", glow: "#B2EBF2", heroLayout: "centered", visualStyle: "minimal", fontDisplay: "'Space Grotesk', sans-serif", fontBody: "'Inter', sans-serif", cardRadius: "rounded-2xl", heroGradient: "linear-gradient(180deg, #00BCD410, transparent)", bgPattern: "grid" },
  garage: { accent: "#E53935", dark: "#0A0404", glow: "#FFCDD2", heroLayout: "bold", visualStyle: "bold", fontDisplay: "'Space Grotesk', sans-serif", fontBody: "'Inter', sans-serif", cardRadius: "rounded-xl", heroGradient: "linear-gradient(135deg, #E5393520, #B7171710)", bgPattern: "diagonal" },
  photography: { accent: "#AB47BC", dark: "#0A040A", glow: "#E1BEE7", heroLayout: "elegant", visualStyle: "glass", fontDisplay: "'Playfair Display', serif", fontBody: "'Inter', sans-serif", cardRadius: "rounded-2xl", bgPattern: "none" },
  veterinary: { accent: "#66BB6A", dark: "#040A04", glow: "#C8E6C9", heroLayout: "split", visualStyle: "warm", fontDisplay: "'Nunito', sans-serif", fontBody: "'Inter', sans-serif", cardRadius: "rounded-3xl", heroGradient: "linear-gradient(135deg, #66BB6A15, #4CAF5010)", bgPattern: "none" },
  tattoo: { accent: "#F44336", dark: "#0A0404", glow: "#FFCDD2", heroLayout: "bold", visualStyle: "neon", fontDisplay: "'Space Grotesk', sans-serif", fontBody: "'Inter', sans-serif", cardRadius: "rounded-xl", heroGradient: "linear-gradient(135deg, #F4433620, #E91E6310)", bgPattern: "diagonal" },
  childcare: { accent: "#FF9800", dark: "#0A0804", glow: "#FFE0B2", heroLayout: "centered", visualStyle: "warm", fontDisplay: "'Nunito', sans-serif", fontBody: "'Inter', sans-serif", cardRadius: "rounded-3xl", bgPattern: "none", sectionBg: "#FFFBF5" },
  education: { accent: "#2196F3", dark: "#04080A", glow: "#BBDEFB", heroLayout: "split", visualStyle: "minimal", fontDisplay: "'Space Grotesk', sans-serif", fontBody: "'Inter', sans-serif", cardRadius: "rounded-2xl", bgPattern: "dots" },
  events: { accent: "#E91E63", dark: "#0A0408", glow: "#F8BBD0", heroLayout: "elegant", visualStyle: "glass", fontDisplay: "'Playfair Display', serif", fontBody: "'Inter', sans-serif", cardRadius: "rounded-2xl", heroGradient: "linear-gradient(135deg, #E91E6318, #9C27B010)", bgPattern: "none" },
  logistics: { accent: "#607D8B", dark: "#060808", glow: "#CFD8DC", heroLayout: "standard", visualStyle: "solid", fontDisplay: "'Space Grotesk', sans-serif", fontBody: "'Inter', sans-serif", cardRadius: "rounded-xl", bgPattern: "grid" },
  agriturismo: { accent: "#8BC34A", dark: "#060A04", glow: "#DCEDC8", heroLayout: "elegant", visualStyle: "organic", fontDisplay: "'Playfair Display', serif", fontBody: "'Inter', sans-serif", cardRadius: "rounded-3xl", bgPattern: "none" },
  legal: { accent: "#795548", dark: "#080604", glow: "#D7CCC8", heroLayout: "split", visualStyle: "minimal", fontDisplay: "'Playfair Display', serif", fontBody: "'Inter', sans-serif", cardRadius: "rounded-xl", bgPattern: "none" },
  accounting: { accent: "#009688", dark: "#040A08", glow: "#B2DFDB", heroLayout: "centered", visualStyle: "solid", fontDisplay: "'Space Grotesk', sans-serif", fontBody: "'Inter', sans-serif", cardRadius: "rounded-2xl", bgPattern: "dots" },
  default: { accent: "#F5B800", dark: "#0C0A06", glow: "#FFF3C4", heroLayout: "standard", visualStyle: "solid", fontDisplay: "'Space Grotesk', sans-serif", fontBody: "'Inter', sans-serif", cardRadius: "rounded-xl", bgPattern: "grid" },
};

/* ─── SECTOR-SPECIFIC SERVICES ─── */
const SECTOR_SERVICES: Record<string, { emoji: string; name: string; desc: string }[]> = {
  electrician: [
    { emoji: "⚡", name: "Impianti Elettrici", desc: "Installazione e messa a norma" },
    { emoji: "💡", name: "Illuminazione", desc: "LED, faretti, lampadari design" },
    { emoji: "🔌", name: "Quadri Elettrici", desc: "Progettazione e installazione" },
    { emoji: "🏠", name: "Domotica", desc: "Casa intelligente e automazioni" },
    { emoji: "📋", name: "Certificazioni", desc: "Dichiarazioni di conformità" },
    { emoji: "🚨", name: "Pronto Intervento", desc: "Emergenze elettriche 24h" },
  ],
  plumber: [
    { emoji: "🔧", name: "Riparazioni", desc: "Perdite, guasti e emergenze" },
    { emoji: "🚿", name: "Impianti Idrici", desc: "Bagni, cucine e lavanderie" },
    { emoji: "🔥", name: "Caldaie", desc: "Installazione e manutenzione" },
    { emoji: "❄️", name: "Riscaldamento", desc: "Termosifoni e pavimento radiante" },
    { emoji: "🏗️", name: "Ristrutturazioni", desc: "Rifacimento bagni e impianti" },
    { emoji: "🚨", name: "Pronto Intervento", desc: "Emergenze allagamenti 24h" },
  ],
  construction: [
    { emoji: "🏗️", name: "Costruzioni", desc: "Nuove edificazioni residenziali e commerciali" },
    { emoji: "🔨", name: "Ristrutturazioni", desc: "Rinnovo completo di interni ed esterni" },
    { emoji: "📐", name: "Progettazione", desc: "Rendering 3D e computi metrici" },
    { emoji: "🏢", name: "Edilizia Commerciale", desc: "Uffici, negozi e spazi pubblici" },
    { emoji: "🛡️", name: "Sicurezza Cantiere", desc: "Certificazioni e piani di sicurezza" },
    { emoji: "📋", name: "Pratiche Edilizie", desc: "SCIA, permessi e collaudi" },
  ],
  gardening: [
    { emoji: "🌿", name: "Manutenzione Giardini", desc: "Potatura, taglio erba e concimazione" },
    { emoji: "🌺", name: "Progettazione Verde", desc: "Design giardini e terrazze" },
    { emoji: "🌳", name: "Potatura Alberi", desc: "Abbattimento e potatura in quota" },
    { emoji: "💧", name: "Irrigazione", desc: "Impianti automatici smart" },
    { emoji: "🪴", name: "Vivaio", desc: "Vendita piante e fioriere" },
    { emoji: "🏡", name: "Piscine & Esterni", desc: "Allestimento aree esterne" },
  ],
  cleaning: [
    { emoji: "✨", name: "Pulizie Uffici", desc: "Sanificazione e pulizia professionale" },
    { emoji: "🏠", name: "Pulizie Domestiche", desc: "Servizio regolare o straordinario" },
    { emoji: "🏗️", name: "Post Cantiere", desc: "Pulizia fine lavori specializzata" },
    { emoji: "🏥", name: "Sanificazione", desc: "Trattamenti certificati anti-batteri" },
    { emoji: "🪟", name: "Vetri & Facciate", desc: "Pulizia vetrate e superfici esterne" },
    { emoji: "📋", name: "Contratti Fissi", desc: "Abbonamenti settimanali e mensili" },
  ],
  garage: [
    { emoji: "🔧", name: "Tagliandi", desc: "Manutenzione ordinaria completa" },
    { emoji: "🛞", name: "Pneumatici", desc: "Cambio gomme e convergenza" },
    { emoji: "🔩", name: "Riparazioni", desc: "Meccanica, elettronica e carrozzeria" },
    { emoji: "📋", name: "Revisioni", desc: "Revisione ministeriale e pre-revisione" },
    { emoji: "🎨", name: "Carrozzeria", desc: "Verniciatura e riparazione danni" },
    { emoji: "🚗", name: "Diagnostica", desc: "Analisi computerizzata motore" },
  ],
  photography: [
    { emoji: "📸", name: "Shooting Professionali", desc: "Ritratti, still life e corporate" },
    { emoji: "💒", name: "Matrimoni", desc: "Servizio completo cerimonia e ricevimento" },
    { emoji: "🎬", name: "Video & Reel", desc: "Video professionali e contenuti social" },
    { emoji: "🏢", name: "Corporate", desc: "Foto aziendali, team e prodotti" },
    { emoji: "🖼️", name: "Post-Produzione", desc: "Ritocco professionale e consegna digitale" },
    { emoji: "📱", name: "Social Content", desc: "Pacchetti foto per Instagram e TikTok" },
  ],
  veterinary: [
    { emoji: "🐕", name: "Visite Generali", desc: "Check-up completo e vaccinazioni" },
    { emoji: "🔬", name: "Diagnostica", desc: "Esami sangue, ecografie e radiografie" },
    { emoji: "💊", name: "Farmacia", desc: "Medicinali veterinari e integratori" },
    { emoji: "🦷", name: "Odontoiatria", desc: "Pulizia e cure dentali" },
    { emoji: "✂️", name: "Chirurgia", desc: "Interventi programmati e d'urgenza" },
    { emoji: "🚨", name: "Emergenze H24", desc: "Pronto soccorso veterinario" },
  ],
  tattoo: [
    { emoji: "🎨", name: "Tattoo Custom", desc: "Design personalizzato su misura" },
    { emoji: "⚡", name: "Flash Tattoo", desc: "Disegni pronti a prezzo fisso" },
    { emoji: "🔄", name: "Cover-Up", desc: "Copertura tatuaggi esistenti" },
    { emoji: "✨", name: "Ritocchi", desc: "Rinfreschi e correzioni colore" },
    { emoji: "💎", name: "Piercing", desc: "Piercing professionali con gioielli" },
    { emoji: "🖋️", name: "Lettering", desc: "Scritte calligrafiche e tipografiche" },
  ],
  childcare: [
    { emoji: "👶", name: "Nido (0-3 anni)", desc: "Accoglienza e sviluppo prima infanzia" },
    { emoji: "🎨", name: "Laboratori Creativi", desc: "Arte, musica e attività manuali" },
    { emoji: "📚", name: "Pre-Scuola", desc: "Preparazione alla scuola dell'infanzia" },
    { emoji: "🌿", name: "Attività all'Aperto", desc: "Giardino sensoriale e gioco libero" },
    { emoji: "🍎", name: "Mensa Bio", desc: "Pasti freschi e biologici quotidiani" },
    { emoji: "⏰", name: "Orario Flessibile", desc: "Part-time, full-time e prolungato" },
  ],
  education: [
    { emoji: "📖", name: "Corsi in Aula", desc: "Formazione frontale con esperti" },
    { emoji: "💻", name: "E-Learning", desc: "Piattaforma online con video e quiz" },
    { emoji: "🎓", name: "Certificazioni", desc: "Attestati riconosciuti e accreditati" },
    { emoji: "👥", name: "Workshop", desc: "Laboratori pratici in piccoli gruppi" },
    { emoji: "🏢", name: "Corsi Aziendali", desc: "Formazione su misura per imprese" },
    { emoji: "📱", name: "Tutoring 1:1", desc: "Lezioni individuali online e in sede" },
  ],
  events: [
    { emoji: "💒", name: "Matrimoni", desc: "Organizzazione completa dalla A alla Z" },
    { emoji: "🎉", name: "Feste Private", desc: "Compleanni, anniversari e celebrazioni" },
    { emoji: "🏢", name: "Corporate", desc: "Convention, team building e gala dinner" },
    { emoji: "🎵", name: "Concerti & Festival", desc: "Produzione eventi musicali e live" },
    { emoji: "🍽️", name: "Catering", desc: "Servizio banqueting e chef a domicilio" },
    { emoji: "📸", name: "Allestimenti", desc: "Scenografie, luci e decorazioni" },
  ],
  logistics: [
    { emoji: "📦", name: "Spedizioni", desc: "Nazionali e internazionali" },
    { emoji: "🚛", name: "Trasporto Merci", desc: "Carichi completi e groupage" },
    { emoji: "🏭", name: "Magazzino", desc: "Stoccaggio e logistica integrata" },
    { emoji: "📋", name: "Documenti", desc: "Pratiche doganali e bolle" },
    { emoji: "🔍", name: "Tracking", desc: "Monitoraggio spedizioni in tempo reale" },
    { emoji: "⏰", name: "Same-Day", desc: "Consegne espresse entro giornata" },
  ],
  agriturismo: [
    { emoji: "🏡", name: "Soggiorni", desc: "Camere e appartamenti immersi nel verde" },
    { emoji: "🍷", name: "Degustazioni", desc: "Vini, oli e prodotti della terra" },
    { emoji: "🌾", name: "Fattoria Didattica", desc: "Esperienze educative per famiglie" },
    { emoji: "🍝", name: "Ristorante km0", desc: "Cucina tipica con ingredienti locali" },
    { emoji: "🚲", name: "Attività Outdoor", desc: "Trekking, bike e passeggiate a cavallo" },
    { emoji: "🛒", name: "Shop Prodotti", desc: "Vendita diretta e spedizione" },
  ],
  legal: [
    { emoji: "⚖️", name: "Diritto Civile", desc: "Contratti, successioni e proprietà" },
    { emoji: "🏢", name: "Diritto Societario", desc: "Costituzioni, fusioni e acquisizioni" },
    { emoji: "👷", name: "Diritto del Lavoro", desc: "Assunzioni, licenziamenti e vertenze" },
    { emoji: "🏠", name: "Diritto Immobiliare", desc: "Compravendite, locazioni e condominio" },
    { emoji: "💰", name: "Recupero Crediti", desc: "Ingiunzioni e procedure esecutive" },
    { emoji: "🛡️", name: "Tutela Consumatore", desc: "Reclami, garanzie e risarcimenti" },
  ],
  accounting: [
    { emoji: "📊", name: "Contabilità", desc: "Tenuta libri e registri obbligatori" },
    { emoji: "📄", name: "Dichiarazioni", desc: "730, Unico, IVA e tutte le scadenze" },
    { emoji: "💼", name: "Consulenza Fiscale", desc: "Pianificazione e ottimizzazione fiscale" },
    { emoji: "🏢", name: "Bilanci", desc: "Redazione e deposito bilanci societari" },
    { emoji: "📋", name: "Buste Paga", desc: "Elaborazione cedolini e contributi" },
    { emoji: "🚀", name: "Start-up", desc: "Apertura P.IVA e avvio attività" },
  ],
};

/* ─── SECTOR-SPECIFIC INTERVENTION TYPES ─── */
const SECTOR_INTERVENTION_TYPES: Record<string, string[]> = {
  electrician: ["Impianto elettrico", "Messa a norma", "Corto circuito", "Installazione luci", "Quadro elettrico", "Domotica", "Certificazione", "Altro"],
  plumber: ["Perdita acqua", "Scarico intasato", "Sanitari", "Caldaia", "Riscaldamento", "Impianto idrico", "Emergenza allagamento", "Altro"],
  construction: ["Nuova costruzione", "Ristrutturazione", "Pratica edilizia", "Sopralluogo", "Preventivo", "Altro"],
  gardening: ["Manutenzione giardino", "Potatura alberi", "Progettazione verde", "Irrigazione", "Emergenza", "Altro"],
  cleaning: ["Pulizia uffici", "Pulizia domestica", "Post cantiere", "Sanificazione", "Preventivo", "Altro"],
  garage: ["Tagliando", "Riparazione", "Revisione", "Cambio gomme", "Carrozzeria", "Diagnostica", "Altro"],
  photography: ["Shooting ritratto", "Matrimonio", "Corporate", "Prodotto", "Video", "Social content", "Altro"],
  veterinary: ["Visita generica", "Vaccinazione", "Emergenza", "Chirurgia", "Esami diagnostici", "Altro"],
  tattoo: ["Tattoo custom", "Flash tattoo", "Cover-up", "Ritocco", "Piercing", "Consultazione", "Altro"],
  childcare: ["Iscrizione nido", "Info orari", "Visita struttura", "Richiesta info", "Altro"],
  education: ["Iscrizione corso", "Info programma", "Certificazione", "Tutoring", "Info aziendali", "Altro"],
  events: ["Matrimonio", "Festa privata", "Evento corporate", "Catering", "Preventivo", "Altro"],
  logistics: ["Spedizione nazionale", "Spedizione internazionale", "Trasporto merci", "Magazzino", "Preventivo", "Altro"],
  agriturismo: ["Prenotazione camera", "Degustazione", "Fattoria didattica", "Info ristorante", "Altro"],
  legal: ["Consulenza civile", "Consulenza lavoro", "Consulenza societaria", "Recupero crediti", "Appuntamento", "Altro"],
  accounting: ["Dichiarazione redditi", "Apertura P.IVA", "Consulenza fiscale", "Buste paga", "Bilancio", "Altro"],
};

/* ─── SECTOR-SPECIFIC WHY US ─── */
const SECTOR_WHY_US: Record<string, { icon: typeof Shield; title: string; desc: string }[]> = {
  photography: [
    { icon: Camera, title: "Portfolio Premiato", desc: "Oltre 500 servizi fotografici realizzati" },
    { icon: Clock, title: "Consegna Rapida", desc: "Gallery pronta in 48-72 ore" },
    { icon: Award, title: "Stile Unico", desc: "Storytelling visivo personalizzato" },
    { icon: Shield, title: "Backup Garantito", desc: "Doppia copia di ogni scatto" },
    { icon: CheckCircle, title: "Prezzi Chiari", desc: "Pacchetti completi senza sorprese" },
    { icon: Heart, title: "Passione", desc: "Ogni progetto è unico per noi" },
  ],
  veterinary: [
    { icon: Stethoscope, title: "Staff Specializzato", desc: "Veterinari con 15+ anni di esperienza" },
    { icon: Clock, title: "Emergenze H24", desc: "Pronto soccorso sempre disponibile" },
    { icon: Heart, title: "Amore per gli Animali", desc: "Ambiente confortevole e accogliente" },
    { icon: Shield, title: "Attrezzatura Moderna", desc: "Ecografo, radiologia e laboratorio interno" },
    { icon: CheckCircle, title: "Prezzi Trasparenti", desc: "Preventivo prima di ogni intervento" },
    { icon: Award, title: "Certificati", desc: "Struttura autorizzata ASL" },
  ],
  events: [
    { icon: Sparkles, title: "Creatività", desc: "Ogni evento è un'esperienza unica" },
    { icon: Users, title: "Team Esperto", desc: "Coordinamento perfetto di ogni dettaglio" },
    { icon: Shield, title: "Assicurazione", desc: "Copertura completa per ogni evento" },
    { icon: Clock, title: "Puntualità", desc: "Rispetto rigoroso delle tempistiche" },
    { icon: Award, title: "500+ Eventi", desc: "Esperienza in ogni tipo di occasione" },
    { icon: CheckCircle, title: "Budget su Misura", desc: "Soluzioni per ogni fascia di prezzo" },
  ],
  childcare: [
    { icon: Heart, title: "Ambiente Sicuro", desc: "Spazi a norma con videosorveglianza" },
    { icon: Users, title: "Educatrici Certificate", desc: "Personale qualificato e formato" },
    { icon: Shield, title: "Norme HACCP", desc: "Cucina interna con pasti biologici" },
    { icon: Clock, title: "Orari Flessibili", desc: "Part-time, full-time e prolungato" },
    { icon: Award, title: "Metodo Montessori", desc: "Approccio educativo comprovato" },
    { icon: Sparkles, title: "Spazi Verdi", desc: "Giardino sensoriale e area gioco" },
  ],
  tattoo: [
    { icon: Award, title: "Artisti Premiati", desc: "Portfolio con migliaia di lavori" },
    { icon: Shield, title: "Igiene Certificata", desc: "Sterilizzazione e materiali monouso" },
    { icon: Palette, title: "Stili Unici", desc: "Realistico, old school, Japanese, minimal" },
    { icon: CheckCircle, title: "Consulenza Gratuita", desc: "Incontro per definire il progetto" },
    { icon: Heart, title: "Cura Post-Tattoo", desc: "Follow-up e istruzioni dettagliate" },
    { icon: Clock, title: "Su Appuntamento", desc: "Sessioni dedicate e rilassate" },
  ],
};

/* ─── SECTOR-SPECIFIC STATS ─── */
const SECTOR_STATS: Record<string, { value: string; label: string }[]> = {
  photography: [{ value: "500+", label: "Servizi" }, { value: "50k+", label: "Foto Consegnate" }, { value: "100%", label: "Soddisfatti" }],
  veterinary: [{ value: "3.000+", label: "Pazienti" }, { value: "15+", label: "Anni Esperienza" }, { value: "H24", label: "Emergenze" }],
  events: [{ value: "500+", label: "Eventi" }, { value: "98%", label: "Soddisfatti" }, { value: "50+", label: "Fornitori" }],
  childcare: [{ value: "120+", label: "Bambini" }, { value: "15+", label: "Educatrici" }, { value: "Bio", label: "Cucina Interna" }],
  tattoo: [{ value: "5.000+", label: "Tatuaggi" }, { value: "4.9★", label: "Rating" }, { value: "15+", label: "Anni Esperienza" }],
  education: [{ value: "2.000+", label: "Studenti" }, { value: "50+", label: "Corsi" }, { value: "95%", label: "Completamento" }],
  construction: [{ value: "200+", label: "Cantieri" }, { value: "€50M+", label: "Valore Lavori" }, { value: "30+", label: "Anni" }],
  gardening: [{ value: "800+", label: "Giardini" }, { value: "98%", label: "Soddisfatti" }, { value: "Bio", label: "Prodotti" }],
  cleaning: [{ value: "300+", label: "Clienti" }, { value: "99%", label: "Soddisfatti" }, { value: "H24", label: "Disponibili" }],
  garage: [{ value: "10.000+", label: "Veicoli" }, { value: "4.8★", label: "Rating" }, { value: "Autorizzato", label: "Revisioni" }],
  logistics: [{ value: "50.000+", label: "Spedizioni" }, { value: "99.2%", label: "On-Time" }, { value: "24h", label: "Same-Day" }],
  legal: [{ value: "2.000+", label: "Pratiche" }, { value: "30+", label: "Anni Esperienza" }, { value: "98%", label: "Casi Vinti" }],
  accounting: [{ value: "500+", label: "Clienti" }, { value: "100%", label: "Puntualità" }, { value: "€0", label: "Sanzioni" }],
  agriturismo: [{ value: "1.500+", label: "Ospiti/Anno" }, { value: "4.9★", label: "Rating" }, { value: "km0", label: "Cucina" }],
};

/* ─── SECTOR-SPECIFIC TICKER ITEMS ─── */
const SECTOR_TICKERS: Record<string, string[]> = {
  electrician: ["IMPIANTI ELETTRICI", "DOMOTICA", "MESSA A NORMA", "QUADRI ELETTRICI", "LED", "CERTIFICAZIONI", "H24"],
  plumber: ["RIPARAZIONI", "CALDAIE", "IMPIANTI IDRICI", "SCARICHI", "RISCALDAMENTO", "RISTRUTTURAZIONI", "H24"],
  construction: ["COSTRUZIONI", "RISTRUTTURAZIONI", "CANTIERI", "PROGETTAZIONE 3D", "PRATICHE EDILIZIE", "SICUREZZA"],
  gardening: ["GIARDINI", "POTATURA", "IRRIGAZIONE", "PROGETTAZIONE VERDE", "VIVAIO", "MANUTENZIONE"],
  cleaning: ["PULIZIE PROFESSIONALI", "SANIFICAZIONE", "UFFICI", "CONDOMINI", "POST CANTIERE", "CERTIFICATA"],
  garage: ["TAGLIANDI", "REVISIONI", "CARROZZERIA", "DIAGNOSTICA", "GOMME", "AUTORIZZATO"],
  photography: ["SHOOTING", "MATRIMONI", "CORPORATE", "VIDEO", "POST-PRODUZIONE", "SOCIAL CONTENT"],
  veterinary: ["VISITE", "VACCINAZIONI", "CHIRURGIA", "DIAGNOSTICA", "EMERGENZE H24", "FARMACIA"],
  tattoo: ["TATTOO CUSTOM", "FLASH", "COVER-UP", "PIERCING", "LETTERING", "REALISTICO"],
  childcare: ["NIDO", "LABORATORI", "PRE-SCUOLA", "MENSA BIO", "MONTESSORI", "SICURO"],
  education: ["CORSI", "E-LEARNING", "CERTIFICAZIONI", "WORKSHOP", "TUTORING", "AZIENDALI"],
  events: ["MATRIMONI", "FESTE", "CORPORATE", "CATERING", "ALLESTIMENTI", "CONCERTI"],
  logistics: ["SPEDIZIONI", "TRACKING", "MAGAZZINO", "SAME-DAY", "INTERNAZIONALI", "GROUPAGE"],
  agriturismo: ["SOGGIORNI", "DEGUSTAZIONI", "FATTORIA", "KM ZERO", "OUTDOOR", "PRODOTTI LOCALI"],
  legal: ["DIRITTO CIVILE", "LAVORO", "SOCIETARIO", "IMMOBILIARE", "CREDITI", "CONSULENZA"],
  accounting: ["CONTABILITÀ", "DICHIARAZIONI", "FISCALE", "BILANCI", "BUSTE PAGA", "START-UP"],
};

/* ─── SECTOR CTA LABELS ─── */
const SECTOR_CTA: Record<string, { primary: string; secondary: string; formTitle: string; formSubtitle: string }> = {
  photography: { primary: "Prenota Shooting", secondary: "Vedi Portfolio", formTitle: "Richiedi Preventivo", formSubtitle: "Descrivi il servizio che cerchi" },
  veterinary: { primary: "Prenota Visita", secondary: "Emergenza? Chiama", formTitle: "Prenota Appuntamento", formSubtitle: "Il tuo animale in buone mani" },
  events: { primary: "Organizza Evento", secondary: "Vedi Portfolio", formTitle: "Richiedi Preventivo", formSubtitle: "Raccontaci il tuo evento dei sogni" },
  childcare: { primary: "Prenota Visita", secondary: "Info Iscrizioni", formTitle: "Richiedi Informazioni", formSubtitle: "Prenota una visita alla struttura" },
  tattoo: { primary: "Prenota Sessione", secondary: "Vedi Portfolio", formTitle: "Prenota Appuntamento", formSubtitle: "Descrivi il tatuaggio che desideri" },
  education: { primary: "Iscriviti Ora", secondary: "Catalogo Corsi", formTitle: "Richiedi Informazioni", formSubtitle: "Scegli il percorso formativo ideale" },
  construction: { primary: "Richiedi Preventivo", secondary: "Vedi Cantieri", formTitle: "Preventivo Gratuito", formSubtitle: "Descrivi il tuo progetto edilizio" },
  legal: { primary: "Prenota Consulenza", secondary: "Info Studio", formTitle: "Prenota Consulenza", formSubtitle: "Primo incontro conoscitivo gratuito" },
  accounting: { primary: "Prenota Consulenza", secondary: "Info Servizi", formTitle: "Richiedi Preventivo", formSubtitle: "Gestione fiscale senza pensieri" },
  logistics: { primary: "Richiedi Preventivo", secondary: "Tracking", formTitle: "Preventivo Spedizione", formSubtitle: "Calcola il costo della tua spedizione" },
  default: { primary: "Preventivo Gratuito", secondary: "Emergenza? Chiama", formTitle: "Preventivo Gratuito", formSubtitle: "Descrivi il problema e ti rispondiamo in meno di 1 ora" },
};

/* ─── SECTOR HERO ICONS ─── */
const SECTOR_HERO_ICONS: Record<string, typeof Wrench> = {
  electrician: Zap, plumber: Droplets, construction: HardHat, gardening: TreePine,
  cleaning: Sparkles, garage: Car, photography: Camera, veterinary: Heart,
  tattoo: Palette, childcare: Baby, education: GraduationCap, events: Music,
  logistics: Truck, agriturismo: TreePine, legal: Scale, accounting: FileText,
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const Section = forwardRef<HTMLElement, { id?: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }>(
  ({ id, children, className = "", style }, _ref) => {
    const localRef = useRef(null);
    const isInView = useInView(localRef, { once: true, margin: "-60px" });
    return (
      <section id={id} ref={localRef} className={className} style={style}>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
      </section>
    );
  }
);
Section.displayName = "Section";

interface Props { company: any; afterHero?: React.ReactNode; }

const HERO_VIDEOS: Record<string, string> = {
  construction: "https://videos.pexels.com/video-files/5698648/5698648-uhd_2560_1440_25fps.mp4",
  education: "https://videos.pexels.com/video-files/5198164/5198164-uhd_2560_1440_25fps.mp4",
};

/* ─── PROFESSIONAL HERO PHOTOS per sector ─── */
const HERO_PHOTOS: Record<string, string[]> = {
  electrician: [
    "https://images.pexels.com/photos/8005397/pexels-photo-8005397.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/8005368/pexels-photo-8005368.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/257886/pexels-photo-257886.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  plumber: [
    "https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/6419073/pexels-photo-6419073.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/6419071/pexels-photo-6419071.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  gardening: [
    "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  cleaning: [
    "https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4239035/pexels-photo-4239035.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4239036/pexels-photo-4239036.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  garage: [
    "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4116193/pexels-photo-4116193.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  photography: [
    "https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  veterinary: [
    "https://images.pexels.com/photos/6234603/pexels-photo-6234603.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/6235116/pexels-photo-6235116.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/6234984/pexels-photo-6234984.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/7469214/pexels-photo-7469214.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  tattoo: [
    "https://images.pexels.com/photos/1304469/pexels-photo-1304469.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/955938/pexels-photo-955938.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/2183131/pexels-photo-2183131.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4125659/pexels-photo-4125659.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  childcare: [
    "https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3661193/pexels-photo-3661193.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3662579/pexels-photo-3662579.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  events: [
    "https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  logistics: [
    "https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4481326/pexels-photo-4481326.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  agriturismo: [
    "https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/5462249/pexels-photo-5462249.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1353938/pexels-photo-1353938.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/235725/pexels-photo-235725.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  legal: [
    "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/5669619/pexels-photo-5669619.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  accounting: [
    "https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/7681091/pexels-photo-7681091.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/5483071/pexels-photo-5483071.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  default: [
    "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
};

export default function TradesPublicSite({ company, afterHero }: Props) {
  const companyId = company.id;
  const industry = (company.industry || "plumber") as IndustryId;
  const config = getIndustryConfig(industry);
  const palette = PALETTES[industry] || PALETTES.default;
  const A = palette.accent;
  const D = palette.dark;
  const HeroIcon = SECTOR_HERO_ICONS[industry] || Wrench;
  const heroVideo = HERO_VIDEOS[industry];
  const heroPhotos = HERO_PHOTOS[industry] || HERO_PHOTOS.default;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => { const fn = () => setNavScrolled(window.scrollY > 40); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);

  const [form, setForm] = useState({ name: "", phone: "", email: "", type: "", urgency: "normal", address: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const { data: faqs = [] } = useQuery({
    queryKey: ["trades-pub-faq", companyId],
    queryFn: async () => { const { data } = await supabase.from("faq_items").select("*").eq("company_id", companyId).eq("is_active", true).order("sort_order"); return data || []; },
  });

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.type) { toast.error("Compila nome, telefono e tipo intervento"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("interventions").insert({
      company_id: companyId, client_name: form.name, client_phone: form.phone,
      intervention_type: form.type, urgency: form.urgency, address: form.address || null, notes: form.notes || null,
    });
    setSubmitting(false);
    if (error) { toast.error("Errore nell'invio"); return; }
    toast.success("Richiesta inviata!");
    setForm({ name: "", phone: "", email: "", type: "", urgency: "normal", address: "", notes: "" });
  };

  const services = SECTOR_SERVICES[industry] || SECTOR_SERVICES.plumber || [];
  const interventionTypes = SECTOR_INTERVENTION_TYPES[industry] || ["Riparazione", "Installazione", "Manutenzione", "Emergenza", "Preventivo", "Altro"];
  const whyUs = SECTOR_WHY_US[industry] || [
    { icon: Shield, title: "Lavoro Garantito", desc: "Garanzia con copertura assicurativa completa" },
    { icon: Clock, title: "Intervento Rapido", desc: "Rispondiamo in meno di 1 ora" },
    { icon: FileText, title: "Preventivo Gratuito", desc: "Sopralluogo senza impegno" },
    { icon: Award, title: "Esperienza Certificata", desc: "Tecnici qualificati con anni di esperienza" },
    { icon: CheckCircle, title: "Prezzi Trasparenti", desc: "Nessuna sorpresa sul prezzo finale" },
    { icon: AlertTriangle, title: "Emergenze H24", desc: "Disponibili tutti i giorni, festivi inclusi" },
  ];
  const stats = SECTOR_STATS[industry] || [{ value: "500+", label: "Clienti" }, { value: "98%", label: "Soddisfatti" }, { value: "24h", label: "Disponibili" }];
  const tickerItems = SECTOR_TICKERS[industry] || ["PROFESSIONALITÀ", "GARANZIA", "QUALITÀ", "ESPERIENZA", "H24"];
  const cta = SECTOR_CTA[industry] || SECTOR_CTA.default;

  const navLinks = [{ href: "#servizi", label: "Servizi" }, { href: "#perche", label: "Garanzie" }, { href: "#prenota", label: cta.formTitle.split(" ").slice(0, 2).join(" ") }];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: palette.fontDisplay, background: D, color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500`} style={{ background: `${D}F0`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${A}15` }}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {company.logo_url ? <img src={company.logo_url} alt="" className="h-9 w-9 rounded-xl object-cover" /> : <HeroIcon className="w-6 h-6" style={{ color: A }} />}
            <div className="min-w-0">
              <span className="font-bold truncate block text-sm">{company.name}</span>
              <span className="text-[8px] tracking-[0.25em] uppercase block font-medium text-white/30" style={{ fontFamily: "'Inter', sans-serif" }}>{config.label.toUpperCase()}</span>
            </div>
          </div>
          <div className="hidden md:flex gap-6 text-[11px] tracking-[0.15em] uppercase text-white/35" style={{ fontFamily: "'Inter', sans-serif" }}>
            {navLinks.map(l => <a key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</a>)}
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="text-white rounded-lg font-semibold hidden sm:flex" style={{ background: A, color: D }} asChild>
              <a href="#prenota">{cta.primary.split(" ").slice(0, 2).join(" ")}</a>
            </Button>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden" style={{ background: D, borderTop: `1px solid ${A}10` }}>
              <div className="px-5 py-4 space-y-1">
                {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm text-white/40 border-b border-white/5" style={{ fontFamily: "'Inter', sans-serif" }}>{l.label}</a>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-center pt-16 px-4 overflow-hidden">
        {heroVideo ? (
          <HeroVideoBackground primarySrc={heroVideo} fallbackSrc={fallbackHeroVideo} className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.4) saturate(1.1)" }} />
        ) : (
          <HeroPhotoCarousel images={heroPhotos} className="absolute inset-0 w-full h-full" style={{ filter: "brightness(0.4) saturate(1.1)" }} overlay={false} />
        )}
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${D}CC 0%, ${D}88 50%, transparent 100%)` }} />
        {/* Sector-specific decorative pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(${A}20 1px, transparent 1px), linear-gradient(90deg, ${A}20 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />
        {/* Animated accent orbs */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full blur-[120px] opacity-[0.08] animate-pulse" style={{ background: A }} />
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 rounded-full blur-[100px] opacity-[0.05]" style={{ background: palette.glow }} />

        <motion.div initial="hidden" animate="show" variants={stagger} className="relative z-10 max-w-3xl mx-auto w-full text-center">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium mb-8" style={{ background: `${A}15`, border: `1px solid ${A}25`, color: A }}>
            <HeroIcon className="w-4 h-4" /> {config.label}
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
            {company.tagline || `${config.label}: Qualità e Affidabilità`}
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} className="text-base text-white/40 mb-10 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            <strong className="text-white/70">{company.name}</strong> — {
              industry === "photography" ? "Fotografia professionale che racconta la tua storia." :
              industry === "veterinary" ? "Il benessere del tuo animale è la nostra priorità." :
              industry === "events" ? "Organizziamo il tuo evento perfetto, dal concept alla realizzazione." :
              industry === "childcare" ? "Un ambiente sicuro e stimolante per i tuoi bambini." :
              industry === "tattoo" ? "Arte sulla pelle. Design unici, igiene certificata." :
              industry === "education" ? "Formazione d'eccellenza per professionisti e aziende." :
              industry === "legal" ? "Assistenza legale specializzata e consulenza personalizzata." :
              industry === "accounting" ? "Gestione fiscale precisa, puntuale e senza stress." :
              industry === "logistics" ? "Spedizioni sicure, veloci e tracciate in tempo reale." :
              industry === "agriturismo" ? "Un'esperienza autentica immersa nella natura italiana." :
              "Interventi professionali, preventivi gratuiti e garanzia su ogni lavoro."
            }
            {company.city && ` Operiamo a ${company.city} e dintorni.`}
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="font-bold rounded-lg px-10 h-14 text-base shadow-2xl" style={{ background: A, color: D, boxShadow: `0 20px 60px -15px ${A}44` }} asChild>
              <a href="#prenota"><FileText className="w-5 h-5 mr-2" /> {cta.primary}</a>
            </Button>
            {company.phone && (
              <Button size="lg" variant="outline" className="rounded-lg px-8 h-14 border-white/10 text-white hover:bg-white/5" asChild>
                <a href={`tel:${company.phone}`}><Phone className="w-4 h-4 mr-2" /> {cta.secondary}</a>
              </Button>
            )}
          </motion.div>

          {/* Animated stats */}
          <motion.div variants={fadeUp} custom={4} className="grid grid-cols-3 gap-4 max-w-sm mx-auto mt-14">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold" style={{ color: A }}>{s.value}</p>
                <p className="text-[10px] text-white/25 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
        <ScrollIndicator />
      </section>

      {afterHero}

      {/* TICKER */}
      <div className="overflow-hidden py-4 relative" style={{ background: `${A}08` }}>
        <MarqueeCarousel speed={25} pauseOnHover items={
          tickerItems.map((item, i) => (
            <span key={i} className="flex items-center gap-4 text-sm font-bold tracking-[0.2em] mx-8 whitespace-nowrap" style={{ color: `${A}20` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: `${A}30` }} /> {item}
            </span>
          ))
        } />
      </div>

      <NeonDivider color={A} />

      {/* SERVICES */}
      <section id="servizi" className="py-20 px-4" style={{ background: `${A}04` }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[0.65rem] font-bold uppercase tracking-[0.2em] mb-4"
              style={{ background: `${A}15`, color: A, border: `1px solid ${A}25` }}>
              {config.emoji} {config.label}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">I Nostri Servizi</h2>
            <p className="text-white/30 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>Soluzioni professionali per ogni esigenza</p>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className={`grid gap-4 ${
              palette.visualStyle === "warm" || palette.visualStyle === "organic" 
                ? "grid-cols-2 sm:grid-cols-3" 
                : palette.visualStyle === "glass" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                  : "sm:grid-cols-2 lg:grid-cols-3"
            }`}>
            {services.map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                {palette.visualStyle === "glass" ? (
                  /* Glass style: frosted glass cards with blur */
                  <Card className={`border-0 h-full group ${palette.cardRadius} overflow-hidden transition-all duration-300 hover:-translate-y-1 backdrop-blur-xl`}
                    style={{ background: `${A}0A`, border: `1px solid ${A}18`, boxShadow: `0 8px 32px ${A}08` }}>
                    <CardContent className="p-5 relative">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-inherit"
                        style={{ background: `linear-gradient(135deg, ${A}15, transparent)` }} />
                      <div className="relative flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 backdrop-blur-sm"
                          style={{ background: `${A}18`, border: `1px solid ${A}25` }}>
                          <span className="text-2xl">{s.emoji}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-sm mb-1">{s.name}</h3>
                          <p className="text-xs text-white/35" style={{ fontFamily: palette.fontBody }}>{s.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : palette.visualStyle === "warm" ? (
                  /* Warm style: rounded colorful cards */
                  <Card className={`border-0 h-full group ${palette.cardRadius} overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                    style={{ background: `linear-gradient(145deg, ${A}12, ${A}06)`, border: `1px solid ${A}15` }}>
                    <CardContent className="p-5 text-center relative">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 transition-all group-hover:scale-110 group-hover:shadow-lg"
                        style={{ background: `${A}20`, boxShadow: `0 4px 20px ${A}15` }}>
                        <span className="text-2xl">{s.emoji}</span>
                      </div>
                      <h3 className="font-bold text-white text-sm mb-1" style={{ fontFamily: palette.fontDisplay }}>{s.name}</h3>
                      <p className="text-[11px] text-white/35" style={{ fontFamily: palette.fontBody }}>{s.desc}</p>
                    </CardContent>
                  </Card>
                ) : palette.visualStyle === "neon" ? (
                  /* Neon style: glowing borders with neon accents */
                  <Card className={`border-0 h-full group ${palette.cardRadius} overflow-hidden transition-all duration-300 hover:-translate-y-1`}
                    style={{ background: `${A}06`, border: `1px solid ${A}20`, boxShadow: `inset 0 1px 0 ${A}15` }}>
                    <CardContent className="p-5 relative">
                      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${A}40, transparent)` }} />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: `radial-gradient(ellipse at top, ${A}12, transparent 60%)` }} />
                      <div className="relative text-center">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all group-hover:scale-110 group-hover:shadow-neon"
                          style={{ background: `${A}12`, border: `1px solid ${A}30`, boxShadow: `0 0 20px ${A}10` }}>
                          <span className="text-2xl">{s.emoji}</span>
                        </div>
                        <h3 className="font-bold text-white text-sm mb-1">{s.name}</h3>
                        <p className="text-xs text-white/35" style={{ fontFamily: palette.fontBody }}>{s.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : palette.visualStyle === "bold" ? (
                  /* Bold style: large cards with strong presence */
                  <Card className={`border-0 h-full group ${palette.cardRadius} overflow-hidden transition-all duration-300 hover:-translate-y-2`}
                    style={{ background: `linear-gradient(180deg, ${A}10, ${A}04)`, border: `2px solid ${A}15` }}>
                    <CardContent className="p-6 relative">
                      <div className="absolute top-0 left-0 w-1 h-full" style={{ background: `linear-gradient(180deg, ${A}, ${A}20)` }} />
                      <div className="relative pl-3">
                        <span className="text-3xl mb-3 block">{s.emoji}</span>
                        <h3 className="font-extrabold text-white text-base mb-1.5">{s.name}</h3>
                        <p className="text-xs text-white/40" style={{ fontFamily: palette.fontBody }}>{s.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : palette.visualStyle === "organic" ? (
                  /* Organic style: natural flowing shapes */
                  <Card className={`border-0 h-full group ${palette.cardRadius} overflow-hidden transition-all duration-300 hover:-translate-y-1`}
                    style={{ background: `linear-gradient(160deg, ${A}0A, ${A}04)`, border: `1px solid ${A}10` }}>
                    <CardContent className="p-5 text-center relative">
                      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-10" style={{ background: A }} />
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-105"
                          style={{ background: `${A}10`, border: `1px solid ${A}12` }}>
                          <span className="text-3xl">{s.emoji}</span>
                        </div>
                        <h3 className="font-bold text-white text-sm mb-1" style={{ fontFamily: palette.fontDisplay }}>{s.name}</h3>
                        <p className="text-[11px] text-white/35" style={{ fontFamily: palette.fontBody }}>{s.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : palette.visualStyle === "minimal" ? (
                  /* Minimal style: clean lines, no decoration */
                  <Card className={`border-0 h-full group ${palette.cardRadius} overflow-hidden transition-all duration-200 hover:bg-opacity-80`}
                    style={{ background: `${A}05`, border: `1px solid ${A}08` }}>
                    <CardContent className="p-5 relative">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-lg flex-shrink-0 flex items-center justify-center"
                          style={{ background: `${A}10` }}>
                          <span className="text-xl">{s.emoji}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm mb-0.5">{s.name}</h3>
                          <p className="text-[11px] text-white/30" style={{ fontFamily: palette.fontBody }}>{s.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  /* Solid style: default */
                  <Card className={`border-0 h-full group ${palette.cardRadius} overflow-hidden transition-all duration-300 hover:-translate-y-1`} style={{ background: `${A}08`, border: `1px solid ${A}12` }}>
                    <CardContent className="p-6 relative">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ background: `radial-gradient(ellipse at center, ${A}15, transparent 70%)` }} />
                      <div className="relative text-center">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3"
                          style={{ background: `${A}15`, border: `1px solid ${A}20` }}>
                          <span className="text-3xl">{s.emoji}</span>
                        </div>
                        <h3 className="font-bold text-white mb-1.5">{s.name}</h3>
                        <p className="text-sm text-white/35" style={{ fontFamily: palette.fontBody }}>{s.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 50%, ${A}06, transparent 60%)` }} />
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Come Funziona</h2>
            <p className="text-white/30 text-sm">3 semplici passaggi</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "01", title: industry === "education" ? "Scegli il Corso" : industry === "events" ? "Raccontaci l'Evento" : industry === "childcare" ? "Visita la Struttura" : "Descrivi il Problema", desc: industry === "education" ? "Sfoglia il catalogo e trova il percorso ideale" : industry === "events" ? "Briefing iniziale per capire ogni tuo desiderio" : industry === "childcare" ? "Prenota una visita per conoscerci" : "Compila il form o chiamaci — rispondiamo in meno di 1 ora", emoji: "📝" },
              { step: "02", title: industry === "education" ? "Iscriviti Online" : industry === "events" ? "Preventivo Dettagliato" : industry === "childcare" ? "Iscrizione" : "Preventivo Gratuito", desc: industry === "education" ? "Completa l'iscrizione e accedi ai materiali" : industry === "events" ? "Proposta creativa con budget trasparente" : industry === "childcare" ? "Documenti e inserimento graduale" : "Sopralluogo, analisi e preventivo dettagliato senza impegno", emoji: "📋" },
              { step: "03", title: industry === "education" ? "Impara e Cresci" : industry === "events" ? "Il Giorno Perfetto" : industry === "childcare" ? "Il Tuo Bimbo è Felice" : "Interveniamo", desc: industry === "education" ? "Lezioni, esami e certificazione finale" : industry === "events" ? "Coordinamento perfetto dal setup al teardown" : industry === "childcare" ? "Aggiornamenti giornalieri e report sviluppo" : "Risolviamo il problema con garanzia su materiali e manodopera", emoji: "✅" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="text-center relative">
                {i < 2 && <div className="hidden sm:block absolute top-8 left-[60%] w-[80%] h-px" style={{ background: `linear-gradient(90deg, ${A}20, transparent)` }} />}
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl relative"
                  style={{ background: `${A}15`, border: `1px solid ${A}20` }}>
                  {s.emoji}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[0.6rem] font-bold flex items-center justify-center" style={{ background: A, color: D }}>{s.step}</span>
                </div>
                <h3 className="font-bold text-white mb-1.5 text-sm">{s.title}</h3>
                <p className="text-xs text-white/35">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="perche" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[0.65rem] font-bold uppercase tracking-[0.2em] mb-4"
              style={{ background: `${A}15`, color: A, border: `1px solid ${A}25` }}>
              🛡️ Garanzie
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Perché Scegliere Noi</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyUs.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Card className="border-0 h-full group rounded-xl transition-all duration-300 hover:-translate-y-1" style={{ background: `${A}06`, border: `1px solid ${A}10` }}>
                  <CardContent className="p-5 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `radial-gradient(ellipse at top left, ${A}12, transparent 60%)` }} />
                    <div className="relative">
                      <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110" style={{ background: `${A}12` }}>
                        <item.icon className="w-5 h-5" style={{ color: A }} />
                      </div>
                      <h3 className="font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-white/35" style={{ fontFamily: "'Inter', sans-serif" }}>{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-20 px-4" style={{ background: `${A}04` }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Domande Frequenti</h2>
            <PremiumFAQ items={faqs.map((f: any) => ({ q: f.question, a: f.answer }))} accentColor={A} />
          </div>
        </section>
      )}

      {/* QUOTE FORM */}
      <section id="prenota" className="py-20 px-4 relative">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(${A}20 1px, transparent 1px), linear-gradient(90deg, ${A}20 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
        <div className="max-w-lg mx-auto relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">{cta.formTitle}</h2>
            <p className="text-white/30 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{cta.formSubtitle}</p>
          </div>
          <Card className="border-0 rounded-xl backdrop-blur-xl" style={{ background: `${A}06`, border: `1px solid ${A}15` }}>
            <CardContent className="p-6 space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-white/40 text-xs">Nome *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 rounded-lg" placeholder="Nome" /></div>
                <div><Label className="text-white/40 text-xs">Telefono *</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 rounded-lg" placeholder="+39..." /></div>
              </div>
              <div><Label className="text-white/40 text-xs">{industry === "education" ? "Corso" : industry === "events" ? "Tipo Evento" : "Tipo Servizio"} *</Label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1 h-11 rounded-lg"><SelectValue placeholder="Seleziona tipo" /></SelectTrigger>
                  <SelectContent>{interventionTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {["plumber", "electrician", "construction", "garage", "gardening"].includes(industry) && (
                <div><Label className="text-white/40 text-xs">Urgenza</Label>
                  <Select value={form.urgency} onValueChange={v => setForm(p => ({ ...p, urgency: v }))}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1 h-11 rounded-lg"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 Bassa</SelectItem>
                      <SelectItem value="normal">🟡 Normale</SelectItem>
                      <SelectItem value="high">🔴 Urgente</SelectItem>
                      <SelectItem value="emergency">🚨 Emergenza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div><Label className="text-white/40 text-xs">{industry === "logistics" ? "Indirizzo Ritiro" : "Indirizzo"}</Label><Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 rounded-lg" placeholder="Via, civico, città..." /></div>
              <div><Label className="text-white/40 text-xs">{industry === "tattoo" ? "Descrivi il tatuaggio" : industry === "events" ? "Descrivi l'evento" : "Note aggiuntive"}</Label><Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 min-h-[100px] rounded-lg" placeholder="Dettagli..." /></div>
              <Button onClick={handleSubmit} disabled={submitting} className="w-full h-13 text-base font-bold rounded-lg shadow-2xl" style={{ background: A, color: D, boxShadow: `0 15px 40px -10px ${A}44` }}>
                {submitting ? "Invio..." : "Invia Richiesta"} <Send className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-[11px] text-white/20 text-center">
                {industry === "legal" || industry === "accounting" ? "Prima consulenza gratuita." :
                 industry === "childcare" ? "Ti ricontattiamo entro 24 ore." :
                 "Rispondiamo in meno di 1 ora."}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <DemoTestimonialsCarousel sector="trades" accentColor={A} darkMode={true} bgColor={D} fontBody="'Inter', sans-serif" />
      <DemoPricingSection sector="trades" accentColor={A} darkMode={true} bgColor={D} />
      <AIAgentsShowcase sector="trades" />
      <SectorValueProposition sectorKey={industry === "electrician" || industry === "plumber" ? "trades" : (industry as string)} accentColor={A} darkMode={true} sectorLabel={config.label} />
      <AutomationShowcase accentColor={A} accentBg={`bg-[${A}]`} sectorName={config.label.toLowerCase()} darkMode={true} />

      <DemoRichFooter company={company} accentColor={A} darkMode={true} bgColor={D} sectorLabel={config.label.toUpperCase()} fontFamily="'Inter', sans-serif" />
      <DemoAdminAccessButton sector="trades" accentColor="#2563eb" />
    </div>
  );
}
