/**
 * DemoAdminCTA — Strategic "Explore Admin Dashboard" section + sticky mobile bar
 * Placed in demo site pages in 3 strategic positions
 */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, ArrowRight, Lock, LayoutDashboard, Sparkles } from "lucide-react";

interface Props {
  slug: string;
  accentColor: string;
  sectorName: string;
  variant: "hero" | "section" | "sticky";
}

export default function DemoAdminCTA({ slug, accentColor, sectorName, variant }: Props) {
  const navigate = useNavigate();
  const goAdmin = () => navigate(`/demo/${slug}/admin`);

  if (variant === "hero") {
    return (
      <Button
        onClick={goAdmin}
        variant="outline"
        className="text-xs font-bold border-2 gap-2 hover:scale-[1.02] transition-all"
        style={{ borderColor: `${accentColor}60`, color: accentColor }}
      >
        <Monitor className="w-4 h-4" />
        Esplora Dashboard Admin →
      </Button>
    );
  }

  if (variant === "sticky") {
    return (
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-[80] lg:hidden safe-area-pb"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 2 }}
      >
        <div className="px-3 py-2.5 backdrop-blur-xl border-t" style={{ background: `${accentColor}15`, borderColor: `${accentColor}30` }}>
          <button
            onClick={goAdmin}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white transition-all active:scale-[0.98]"
            style={{ background: accentColor }}
          >
            <LayoutDashboard className="w-4 h-4" />
            Prova la Dashboard Admin Demo
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <p className="text-center text-[0.5rem] text-white/40 mt-1">
            <Lock className="w-2.5 h-2.5 inline mr-0.5" /> Accesso immediato · Nessuna registrazione
          </p>
        </div>
      </motion.div>
    );
  }

  // variant === "section"
  return (
    <section className="py-16 px-4" style={{ background: `linear-gradient(135deg, ${accentColor}08, ${accentColor}04)` }}>
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 text-[0.6rem] px-3 py-1" style={{ background: `${accentColor}20`, color: accentColor }}>
            <Sparkles className="w-3 h-3 mr-1 inline" /> ACCESSO IMMEDIATO
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Prova la Dashboard in Azione
          </h2>
          <p className="text-sm text-white/40 mb-6 max-w-md mx-auto">
            Esplora la dashboard completa di <strong style={{ color: accentColor }}>{sectorName}</strong> con dati realistici, tutti i moduli attivi e gli agenti AI operativi.
          </p>

          {/* Preview mockup */}
          <div className="relative rounded-2xl overflow-hidden border mb-6 mx-auto max-w-lg" style={{ borderColor: `${accentColor}20` }}>
            <div className="bg-[#0d0d1a] p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                </div>
                <span className="text-[0.5rem] text-white/20 ml-2">empire-ai.app/admin/{slug}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {["€24.850", "342", "156", "+18%"].map((v, i) => (
                  <div key={i} className="bg-white/[0.04] rounded-lg p-2 text-center">
                    <p className="text-xs font-bold text-white">{v}</p>
                    <p className="text-[0.45rem] text-white/30">{["Fatturato", "Clienti", "Booking", "Crescita"][i]}</p>
                  </div>
                ))}
              </div>
              <div className="mt-2 h-16 bg-white/[0.02] rounded-lg flex items-end justify-around px-2 pb-1">
                {[40, 55, 45, 70, 60, 80, 65, 90, 75, 85, 95, 88].map((h, i) => (
                  <div key={i} className="w-[6%] rounded-t" style={{ height: `${h}%`, background: `${accentColor}${i > 8 ? "80" : "40"}` }} />
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={goAdmin}
            size="lg"
            className="text-sm font-bold gap-2 hover:scale-[1.02] transition-all px-8"
            style={{ background: accentColor }}
          >
            <Monitor className="w-5 h-5" />
            Entra nella Dashboard Demo
            <ArrowRight className="w-4 h-4" />
          </Button>
          <p className="text-[0.6rem] text-white/30 mt-3">
            <Lock className="w-3 h-3 inline mr-1" />
            Nessuna registrazione richiesta · Tutti i moduli attivi · Dati demo realistici
          </p>
        </motion.div>
      </div>
    </section>
  );
}
