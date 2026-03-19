import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, LayoutDashboard, Bot, Users, BarChart3,
  MessageSquare, Star, Settings, ShoppingBag, ArrowRight,
  Sparkles, Calendar, Package, CreditCard, Shield
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DEMO_PASSWORD = "Empire2024!";

const DEMO_EMAILS: Record<string, string> = {
  food: "admin-food@empire-test.com",
  ncc: "admin-ncc@empire-test.com",
  beauty: "admin-beauty@empire-test.com",
  healthcare: "admin-healthcare@empire-test.com",
  retail: "admin-retail@empire-test.com",
  fitness: "admin-fitness@empire-test.com",
  hospitality: "admin-hospitality@empire-test.com",
  beach: "admin-beach@empire-test.com",
  plumber: "admin-plumber@empire-test.com",
  electrician: "admin-electrician@empire-test.com",
  agriturismo: "admin-agriturismo@empire-test.com",
  cleaning: "admin-cleaning@empire-test.com",
  legal: "admin-legal@empire-test.com",
  accounting: "admin-accounting@empire-test.com",
  garage: "admin-garage@empire-test.com",
  photography: "admin-photography@empire-test.com",
  construction: "admin-construction@empire-test.com",
  gardening: "admin-gardening@empire-test.com",
  veterinary: "admin-veterinary@empire-test.com",
  tattoo: "admin-tattoo@empire-test.com",
  childcare: "admin-childcare@empire-test.com",
  education: "admin-education@empire-test.com",
  events: "admin-events@empire-test.com",
  logistics: "admin-logistics@empire-test.com",
  custom: "admin-custom@empire-test.com",
  bakery: "admin-food@empire-test.com",
  luxury: "admin-hospitality@empire-test.com",
  trades: "admin-plumber@empire-test.com",
};

const SECTOR_LABELS: Record<string, string> = {
  food: "Ristorazione", ncc: "NCC & Trasporto", beauty: "Beauty & Wellness",
  healthcare: "Studio Medico", retail: "Retail & Negozio", fitness: "Palestra & Fitness",
  hospitality: "Hotel & B&B", beach: "Stabilimento Balneare", plumber: "Idraulico",
  electrician: "Elettricista", agriturismo: "Agriturismo", cleaning: "Impresa Pulizie",
  legal: "Studio Legale", accounting: "Commercialista", garage: "Officina & Garage",
  photography: "Studio Fotografico", construction: "Edilizia", gardening: "Giardinaggio",
  veterinary: "Veterinario", tattoo: "Tattoo Studio", childcare: "Asilo Nido",
  education: "Formazione", events: "Eventi", logistics: "Logistica", custom: "Custom",
  bakery: "Panetteria & Bakery", luxury: "Luxury Brand", trades: "Artigiani & Servizi",
};

/* Features shown per sector category */
const SECTOR_FEATURES: Record<string, { icon: any; label: string }[]> = {
  food: [
    { icon: LayoutDashboard, label: "Dashboard Ordini" },
    { icon: ShoppingBag, label: "Menu Digitale" },
    { icon: Users, label: "CRM Clienti" },
    { icon: Bot, label: "Agenti IA" },
    { icon: BarChart3, label: "Finanza" },
    { icon: MessageSquare, label: "WhatsApp" },
  ],
  ncc: [
    { icon: LayoutDashboard, label: "Gestione Flotta" },
    { icon: Calendar, label: "Prenotazioni" },
    { icon: Users, label: "CRM Autisti" },
    { icon: Bot, label: "Agenti IA" },
    { icon: Shield, label: "Scadenzario" },
    { icon: BarChart3, label: "Finanza" },
  ],
  beauty: [
    { icon: Calendar, label: "Agenda" },
    { icon: Users, label: "Clienti & Fedeltà" },
    { icon: Bot, label: "Agenti IA" },
    { icon: Sparkles, label: "Automazioni" },
    { icon: Star, label: "Recensioni" },
    { icon: BarChart3, label: "Finanza" },
  ],
  healthcare: [
    { icon: Calendar, label: "Agenda Visite" },
    { icon: Users, label: "Pazienti" },
    { icon: Bot, label: "Agenti IA" },
    { icon: Shield, label: "HACCP" },
    { icon: MessageSquare, label: "Telemedicina" },
    { icon: BarChart3, label: "Finanza" },
  ],
  beach: [
    { icon: LayoutDashboard, label: "Mappa Spiaggia" },
    { icon: Calendar, label: "Prenotazioni" },
    { icon: CreditCard, label: "Abbonamenti" },
    { icon: Bot, label: "Agenti IA" },
    { icon: Users, label: "CRM Ospiti" },
    { icon: BarChart3, label: "Finanza" },
  ],
  fitness: [
    { icon: Calendar, label: "Corsi & Prenotazioni" },
    { icon: Users, label: "Membri" },
    { icon: Bot, label: "Agenti IA" },
    { icon: CreditCard, label: "Abbonamenti" },
    { icon: Sparkles, label: "Automazioni" },
    { icon: BarChart3, label: "Finanza" },
  ],
  hospitality: [
    { icon: Calendar, label: "Prenotazioni" },
    { icon: Users, label: "Ospiti" },
    { icon: Bot, label: "Agenti IA" },
    { icon: Package, label: "Inventario" },
    { icon: Star, label: "Recensioni" },
    { icon: BarChart3, label: "Finanza" },
  ],
  retail: [
    { icon: ShoppingBag, label: "Ordini" },
    { icon: Package, label: "Inventario" },
    { icon: Users, label: "Clienti" },
    { icon: Bot, label: "Agenti IA" },
    { icon: Star, label: "Recensioni" },
    { icon: BarChart3, label: "Finanza" },
  ],
};

const DEFAULT_FEATURES = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Users, label: "CRM Clienti" },
  { icon: Bot, label: "Agenti IA" },
  { icon: Sparkles, label: "Automazioni" },
  { icon: Star, label: "Recensioni" },
  { icon: BarChart3, label: "Finanza" },
];

interface DemoAdminAccessButtonProps {
  sector: string;
  accentColor?: string;
}

export default function DemoAdminAccessButton({ sector, accentColor = "#8b5cf6" }: DemoAdminAccessButtonProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Don't show inside iframes (mockup previews)
  if (typeof window !== "undefined" && window.self !== window.top) return null;

  const handleDemoLogin = async () => {
    const email = DEMO_EMAILS[sector];
    if (!email) {
      toast.error("Account demo non disponibile per questo settore");
      return;
    }
    setLoading(true);
    try {
      await supabase.auth.signOut();
      const { error } = await supabase.auth.signInWithPassword({ email, password: DEMO_PASSWORD });
      if (error) {
        toast.error("Accesso demo non riuscito", { description: error.message });
        setLoading(false);
        return;
      }
      toast.success("Accesso Demo", { description: `Benvenuto nel pannello ${SECTOR_LABELS[sector] || sector}` });
      const isFood = sector === "food" || sector === "bakery";
      navigate(isFood ? "/dashboard" : "/app");
    } catch {
      toast.error("Errore durante l'accesso demo");
      setLoading(false);
    }
  };

  const sectorLabel = SECTOR_LABELS[sector] || sector;
  const features = SECTOR_FEATURES[sector] || DEFAULT_FEATURES;

  return (
    <>
      {/* ── Inline CTA Section ── */}
      <section className="relative w-full overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, #0a0a0f 0%, ${accentColor}15 50%, #0a0a0f 100%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(${accentColor} 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 sm:py-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-6"
          >
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.6rem] font-bold uppercase tracking-[0.15em]"
              style={{
                background: `${accentColor}15`,
                border: `1px solid ${accentColor}30`,
                color: accentColor,
              }}
            >
              <LayoutDashboard className="w-3 h-3" />
              Accesso Demo Gratuito
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center text-2xl sm:text-4xl font-bold text-white mb-3"
          >
            Esplora il Pannello Admin
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-center text-sm sm:text-base text-white/50 mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Accedi come amministratore di <strong className="text-white/70">{sectorLabel}</strong> e scopri
            tutte le interfacce, gli agenti IA, le automazioni e i moduli inclusi nel piano.
          </motion.p>

          {/* Feature grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 mb-10 max-w-2xl mx-auto"
          >
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `${accentColor}18` }}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: accentColor }} />
                  </div>
                  <span className="text-[0.55rem] sm:text-[0.65rem] text-white/60 font-medium text-center leading-tight">
                    {f.label}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={handleDemoLogin}
              disabled={loading}
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl text-sm sm:text-base font-bold text-white transition-all min-h-[52px]"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                boxShadow: `0 8px 32px ${accentColor}35, 0 0 0 1px ${accentColor}20`,
              }}
              whileHover={{ scale: 1.03, boxShadow: `0 12px 40px ${accentColor}50` }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LayoutDashboard className="w-5 h-5" />
                  Prova il Pannello Admin — Gratis
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </motion.button>
          </motion.div>

          <p className="text-center text-[0.6rem] text-white/25 mt-4">
            Nessuna registrazione richiesta · Accesso immediato · Tutti i moduli attivi
          </p>
        </div>
      </section>

      {/* ── Floating mini-button (mobile quick access) ── */}
      <motion.button
        onClick={handleDemoLogin}
        disabled={loading}
        className="fixed bottom-[4.5rem] right-4 z-[90] flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl min-h-[48px] sm:hidden"
        style={{
          background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
          boxShadow: `0 8px 30px ${accentColor}40, 0 0 0 1px ${accentColor}20`,
        }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            `0 8px 30px ${accentColor}30, 0 0 0 1px ${accentColor}15`,
            `0 8px 40px ${accentColor}50, 0 0 0 2px ${accentColor}25`,
            `0 8px 30px ${accentColor}30, 0 0 0 1px ${accentColor}15`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 text-white animate-spin" />
        ) : (
          <>
            <LayoutDashboard className="w-4 h-4 text-white" />
            <span className="text-xs font-bold text-white">Prova Admin</span>
          </>
        )}
      </motion.button>
    </>
  );
}