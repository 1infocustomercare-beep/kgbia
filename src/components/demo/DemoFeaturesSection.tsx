/**
 * DemoFeaturesSection — Shows ALL features (universal + sector) organized by category
 * Used in every demo site page
 */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAllFeaturesForSector, type FeatureItem } from "@/config/sectorFeatures";
import PremiumSectionBg from "./PremiumSectionBg";
import {
  Users, Calendar, BarChart3, Bot, MessageCircle, Settings, ShoppingBag, Star,
  Package, Bell, TrendingUp, Globe, CreditCard, Shield, Phone, Mail, Send,
  FileText, QrCode, Filter, UserCog, Award, Smartphone, Instagram, Clock,
  CalendarClock, FileSignature, Wrench, Car, Camera, Image, Building, Heart,
  Coffee, Baby, BookOpen, GraduationCap, HardHat, Truck, Navigation, Route,
  ClipboardList, Scissors, Monitor, ShoppingCart, Ticket, Video, Pill,
  AlertTriangle, Download, Archive, Calculator, CheckCircle, ChefHat, LayoutGrid,
  Code, Sparkles
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Users, Calendar, BarChart3, Bot, MessageCircle, Settings, ShoppingBag, Star,
  Package, Bell, TrendingUp, Globe, CreditCard, Shield, Phone, Mail, Send,
  FileText, QrCode, Filter, UserCog, Award, Smartphone, Instagram, Clock,
  CalendarClock, FileSignature, Wrench, Car, Camera, Image, Building, Heart,
  Coffee, Baby, BookOpen, GraduationCap, HardHat, Truck, Navigation, Route,
  ClipboardList, Scissors, Monitor, ShoppingCart, Ticket, Video, Pill,
  AlertTriangle, Download, Archive, Calculator, CheckCircle, ChefHat, LayoutGrid,
  Code, Sparkles, Workflow: Settings, Barcode: QrCode, UtensilsCrossed: ChefHat,
};

const CATEGORY_LABELS: Record<string, string> = {
  crm: "CRM & Clienti",
  booking: "Prenotazioni & Agenda",
  marketing: "Marketing & Comunicazione",
  finance: "Finanza & Pagamenti",
  analytics: "Analytics & Reportistica",
  operations: "Operatività & Team",
  ai: "AI & Automazione",
  sector: "Specifiche del Settore",
};

const CATEGORY_ORDER = ["sector", "crm", "booking", "marketing", "ai", "analytics", "finance", "operations"];

interface Props {
  sector: string;
  accentColor: string;
  sectorName: string;
}

export default function DemoFeaturesSection({ sector, accentColor, sectorName }: Props) {
  const allFeatures = getAllFeaturesForSector(sector);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const grouped = CATEGORY_ORDER.reduce<Record<string, FeatureItem[]>>((acc, cat) => {
    const items = allFeatures.filter(f => f.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <section ref={ref} className="py-16 px-4 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #060608 0%, #0a0a12 50%, #080810 100%)" }}>
      <PremiumSectionBg accentColor={accentColor} variant="default" />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-3 text-[0.6rem] px-3 py-1" style={{ background: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}30` }}>
            {allFeatures.length}+ FUNZIONALITÀ
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Tutto quello che Empire può fare per{" "}
            <span style={{ color: accentColor }}>{sectorName}</span>
          </h2>
          <p className="text-sm text-white/40 max-w-xl mx-auto">
            Una piattaforma completa con CRM, booking, marketing, analytics, pagamenti e agenti AI — tutto integrato e pronto all'uso
          </p>
        </motion.div>

        {Object.entries(grouped).map(([cat, features], catIdx) => (
          <div key={cat} className="mb-10">
            <motion.div
              className="flex items-center gap-2 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: catIdx * 0.1 }}
            >
              <div className="w-1 h-6 rounded-full" style={{ background: accentColor }} />
              <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider">
                {CATEGORY_LABELS[cat] || cat}
              </h3>
              <Badge variant="outline" className="text-[0.5rem] border-white/10 text-white/30 ml-2">{features.length}</Badge>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {features.map((f, i) => {
                const Icon = ICON_MAP[f.icon] || Star;
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: catIdx * 0.1 + i * 0.03 }}
                  >
                    <Card className="border-white/[0.06] hover:border-white/[0.12] transition-all group h-full"
                      style={{ background: `linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))` }}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: `${accentColor}15` }}>
                            <Icon className="w-4 h-4" style={{ color: accentColor }} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white/90 mb-1">{f.title}</p>
                            <p className="text-[0.65rem] text-white/40 leading-relaxed">{f.desc}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
