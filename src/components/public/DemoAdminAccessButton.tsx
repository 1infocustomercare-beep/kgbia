import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Loader2, ChevronUp, Smartphone, LayoutDashboard, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { IndustryId } from "@/config/industry-config";

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
  food: "Ristorazione",
  ncc: "NCC & Trasporto",
  beauty: "Beauty & Wellness",
  healthcare: "Studio Medico",
  retail: "Retail & Negozio",
  fitness: "Palestra & Fitness",
  hospitality: "Hotel & B&B",
  beach: "Stabilimento Balneare",
  plumber: "Idraulico",
  electrician: "Elettricista",
  agriturismo: "Agriturismo",
  cleaning: "Impresa Pulizie",
  legal: "Studio Legale",
  accounting: "Commercialista",
  garage: "Officina & Garage",
  photography: "Studio Fotografico",
  construction: "Edilizia",
  gardening: "Giardinaggio",
  veterinary: "Veterinario",
  tattoo: "Tattoo Studio",
  childcare: "Asilo Nido",
  education: "Formazione",
  events: "Eventi",
  logistics: "Logistica",
  custom: "Custom",
  bakery: "Panetteria & Bakery",
  luxury: "Luxury Brand",
  trades: "Artigiani & Servizi",
};

interface DemoAdminAccessButtonProps {
  sector: string;
  accentColor?: string;
}

export default function DemoAdminAccessButton({ sector, accentColor = "#8b5cf6" }: DemoAdminAccessButtonProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

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
      // Sign out first to clear any existing session
      await supabase.auth.signOut();
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: DEMO_PASSWORD,
      });

      if (error) {
        toast.error("Accesso demo non riuscito", { description: error.message });
        setLoading(false);
        return;
      }

      toast.success("Accesso Demo", { description: `Benvenuto nel pannello ${SECTOR_LABELS[sector] || sector}` });
      
      // Redirect to appropriate dashboard
      const isFood = sector === "food" || sector === "bakery";
      navigate(isFood ? "/dashboard" : "/app");
    } catch (err) {
      toast.error("Errore durante l'accesso demo");
      setLoading(false);
    }
  };

  const sectorLabel = SECTOR_LABELS[sector] || sector;

  return (
    <div className="fixed bottom-20 right-4 z-[9999] flex flex-col items-end gap-2">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(145deg, rgba(15,12,20,0.98), rgba(20,16,28,0.97))",
              border: `1px solid ${accentColor}30`,
              backdropFilter: "blur(20px)",
              minWidth: 220,
            }}
          >
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-3.5 h-3.5" style={{ color: accentColor }} />
                <span className="text-[0.65rem] font-bold tracking-wider uppercase text-white/70">Demo Mode</span>
              </div>
              <p className="text-[0.6rem] text-white/45 leading-relaxed">
                Accedi come admin di <strong className="text-white/70">{sectorLabel}</strong> per esplorare tutte le funzionalità, agenti IA e interfacce.
              </p>
              
              <motion.button
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-white transition-all min-h-[44px]"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                  boxShadow: `0 4px 20px ${accentColor}40`,
                }}
                whileTap={{ scale: 0.97 }}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <LayoutDashboard className="w-4 h-4" />
                    Accedi al Pannello Admin
                  </>
                )}
              </motion.button>

              <div className="flex items-center gap-2 pt-1">
                <Smartphone className="w-3 h-3 text-white/25" />
                <span className="text-[0.5rem] text-white/30">Ottimizzato per mobile</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl min-h-[48px]"
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
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-white" />
        ) : (
          <>
            <Monitor className="w-4 h-4 text-white" />
            <span className="text-xs font-bold text-white">Prova Admin</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
