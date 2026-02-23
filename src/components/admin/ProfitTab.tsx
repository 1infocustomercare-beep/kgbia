import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Star, UserX, ExternalLink, Shield } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import LostCustomers from "@/components/restaurant/LostCustomers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { MenuItem } from "@/types/restaurant";

type ProfitSection = "panic" | "clients" | "reviews";

interface ProfitTabProps {
  restaurant: any;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  reviews: any[];
}

const ProfitTab = ({ restaurant, menuItems, setMenuItems, reviews }: ProfitTabProps) => {
  const [section, setSection] = useState<ProfitSection>("panic");
  const [panicPercent, setPanicPercent] = useState(0);
  const [panicApplied, setPanicApplied] = useState(false);

  const handlePanicApply = async () => {
    if (!restaurant || panicPercent === 0) return;
    const multiplier = 1 + panicPercent / 100;
    for (const item of menuItems) {
      const newPrice = Math.round(item.price * multiplier * 100) / 100;
      await supabase.from("menu_items").update({ price: newPrice }).eq("id", item.id);
    }
    setMenuItems(prev => prev.map(i => ({ ...i, price: Math.round(i.price * (1 + panicPercent / 100) * 100) / 100 })));
    setPanicApplied(true); setPanicPercent(0);
    toast({ title: "Panic Mode eseguito", description: "Tutti i prezzi aggiornati in tempo reale." });
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";
  const positiveCount = reviews.filter(r => r.rating >= 4).length;
  const positivePercent = reviews.length > 0 ? Math.round((positiveCount / reviews.length) * 100) : 0;

  const sections = [
    { id: "panic" as ProfitSection, label: "Panic" },
    { id: "clients" as ProfitSection, label: "Clienti" },
    { id: "reviews" as ProfitSection, label: "Reviews" },
  ];

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
        {sections.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors min-h-[36px] ${
              section === s.id ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground"
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* PANIC MODE */}
      {section === "panic" && (
        <div className="space-y-5">
          <div className="text-center py-2">
            <AlertTriangle className="w-10 h-10 mx-auto mb-2 text-accent" />
            <h3 className="text-base font-display font-bold text-foreground">Panic Mode</h3>
            <p className="text-xs text-muted-foreground">Variazione % istantanea su tutti i prezzi</p>
          </div>
          <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
            <div className="text-center">
              <span className={`text-4xl font-display font-bold ${panicPercent > 0 ? "text-green-400" : panicPercent < 0 ? "text-accent" : "text-foreground"}`}>
                {panicPercent > 0 ? "+" : ""}{panicPercent}%
              </span>
            </div>
            <Slider value={[panicPercent]} onValueChange={v => setPanicPercent(v[0])} min={-30} max={30} step={1} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>-30% Sconto</span><span>0%</span><span>+30% Rincaro</span>
            </div>
            <motion.button onClick={handlePanicApply} disabled={panicPercent === 0}
              className="w-full py-3.5 rounded-2xl bg-accent text-accent-foreground font-semibold text-sm disabled:opacity-30 min-h-[48px]"
              whileTap={{ scale: 0.97 }}>
              ⚡ Applica a {menuItems.length} piatti
            </motion.button>
            {panicApplied && (
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                <p className="text-xs text-green-400 font-medium">✅ Prezzi aggiornati — sincronizzazione real-time attiva</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LOST CUSTOMERS */}
      {section === "clients" && restaurant && (
        <LostCustomers restaurantId={restaurant.id} restaurantName={restaurant.name} />
      )}

      {/* REVIEW SHIELD */}
      {section === "reviews" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-foreground">Review Shield</h3>
            </div>
            <p className="text-xs text-muted-foreground">1-3★ private · 4-5★ su Google</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl bg-card text-center">
              <p className="text-xl font-display font-bold text-primary">{avgRating}</p>
              <p className="text-xs text-muted-foreground">Media</p>
            </div>
            <div className="p-3 rounded-xl bg-card text-center">
              <p className="text-xl font-display font-bold text-foreground">{reviews.length}</p>
              <p className="text-xs text-muted-foreground">Totali</p>
            </div>
            <div className="p-3 rounded-xl bg-card text-center">
              <p className="text-xl font-display font-bold text-green-400">{positivePercent}%</p>
              <p className="text-xs text-muted-foreground">Positive</p>
            </div>
          </div>
          <div className="space-y-2">
            {reviews.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nessuna recensione</p>}
            {reviews.map(review => (
              <motion.div key={review.id}
                className={`p-3 rounded-xl ${review.is_public ? "bg-card" : "bg-accent/5 border border-accent/15"}`}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{review.customer_name || "Anonimo"}</span>
                    <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString("it-IT")}</span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-3 h-3 ${j < review.rating ? "text-primary fill-primary" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{review.comment || "—"}</p>
                {review.is_public ? (
                  <span className="inline-flex items-center gap-1 text-xs text-green-400 mt-1"><ExternalLink className="w-3 h-3" /> Su Google</span>
                ) : (
                  <span className="text-xs text-accent mt-1 inline-block">🔒 Archivio privato</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProfitTab;
