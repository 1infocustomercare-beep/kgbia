import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Star, UserX, ExternalLink, Shield, ThumbsUp, ThumbsDown } from "lucide-react";
import InfoGuide from "@/components/ui/info-guide";
import { Slider } from "@/components/ui/slider";
import LostCustomers from "@/components/restaurant/LostCustomers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { MenuItem } from "@/types/restaurant";
import cartoonProfit from "@/assets/cartoon-profit.png";

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
  const negativeCount = reviews.filter(r => r.rating <= 3).length;
  const positivePercent = reviews.length > 0 ? Math.round((positiveCount / reviews.length) * 100) : 0;

  const sections = [
    { id: "panic" as ProfitSection, label: "⚡ Panic" },
    { id: "clients" as ProfitSection, label: "👥 Clienti" },
    { id: "reviews" as ProfitSection, label: "⭐ Reviews" },
  ];

  return (
    <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Cartoon illustration */}
      <div className="flex flex-col items-center text-center gap-2 py-2">
        <img src={cartoonProfit} alt="" className="w-24 h-24 object-contain" />
        <div>
          <h3 className="text-lg font-display font-bold text-foreground">Protezione Profitto</h3>
          <p className="text-xs text-muted-foreground">Prezzi, clienti persi e recensioni</p>
        </div>
      </div>
      {/* Segmented tabs */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1 bg-secondary/30 p-1 rounded-2xl">
          {sections.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all min-h-[40px] ${
                section === s.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
              }`}>
              {s.label}
            </button>
          ))}
        </div>
        <InfoGuide
          title="Protezione Profitto"
          description="Strumenti per proteggere i tuoi margini: modifica prezzi istantaneamente, recupera clienti persi e gestisci le recensioni."
          steps={[
            "Panic Mode: usa lo slider per variare tutti i prezzi in %",
            "Clienti Persi: identifica chi non ordina da tempo e invia sconti",
            "Review Shield: filtra le recensioni negative dal pubblico",
          ]}
        />
      </div>

      {/* ═══════ PANIC MODE ═══════ */}
      {section === "panic" && (
        <div className="space-y-4">
          <div className="text-center py-2">
            <AlertTriangle className="w-8 h-8 mx-auto mb-1.5 text-destructive" />
            <h3 className="text-base font-display font-bold text-foreground">Panic Mode</h3>
            <p className="text-[11px] text-muted-foreground">Variazione % istantanea su tutti i prezzi del menu</p>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-4">
            {/* Big percentage display */}
            <div className="text-center py-2">
              <span className={`text-5xl font-display font-bold tabular-nums ${
                panicPercent > 0 ? "text-green-400" : panicPercent < 0 ? "text-destructive" : "text-foreground"
              }`}>
                {panicPercent > 0 ? "+" : ""}{panicPercent}%
              </span>
            </div>

            {/* Slider */}
            <Slider value={[panicPercent]} onValueChange={v => setPanicPercent(v[0])} min={-30} max={30} step={1} className="w-full" />
            <div className="flex justify-between text-[10px] text-muted-foreground px-1">
              <span>-30%</span><span>0%</span><span>+30%</span>
            </div>

            {/* Preview of impact */}
            {panicPercent !== 0 && (
              <div className="p-2.5 rounded-xl bg-secondary/40 text-center">
                <p className="text-[11px] text-muted-foreground">
                  {panicPercent > 0 ? "📈 Aumento" : "📉 Sconto"} su <strong className="text-foreground">{menuItems.length} piatti</strong>
                </p>
              </div>
            )}

            {/* Apply button */}
            <motion.button onClick={handlePanicApply} disabled={panicPercent === 0}
              className="w-full py-3.5 rounded-2xl bg-destructive text-destructive-foreground font-semibold text-sm disabled:opacity-30 min-h-[48px] active:scale-[0.97] transition-transform"
              whileTap={{ scale: 0.97 }}>
              ⚡ Applica a {menuItems.length} piatti
            </motion.button>

            {panicApplied && (
              <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                <p className="text-xs text-green-400 font-medium">✅ Prezzi aggiornati — sync real-time attiva</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════ LOST CUSTOMERS ═══════ */}
      {section === "clients" && restaurant && (
        <LostCustomers restaurantId={restaurant.id} restaurantName={restaurant.name} />
      )}

      {/* ═══════ REVIEW SHIELD ═══════ */}
      {section === "reviews" && (
        <div className="space-y-3">
          {/* Shield header */}
          <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-display font-bold text-foreground text-sm">Review Shield</h3>
              <p className="text-[10px] text-muted-foreground">1-3★ archivio privato · 4-5★ su Google</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { value: avgRating, label: "Media", color: "text-primary" },
              { value: reviews.length, label: "Totali", color: "text-foreground" },
              { value: positiveCount, label: "4-5★", color: "text-green-400" },
              { value: negativeCount, label: "1-3★", color: "text-destructive" },
            ].map(stat => (
              <div key={stat.label} className="p-2.5 rounded-xl bg-card border border-border/30 text-center">
                <p className={`text-lg font-display font-bold leading-none ${stat.color}`}>{stat.value}</p>
                <p className="text-[8px] text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          {reviews.length > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-green-400" /> {positivePercent}% positive</span>
                <span className="flex items-center gap-1"><ThumbsDown className="w-3 h-3 text-destructive" /> {100 - positivePercent}%</span>
              </div>
              <div className="h-2 rounded-full bg-destructive/20 overflow-hidden">
                <div className="h-full rounded-full bg-green-400 transition-all" style={{ width: `${positivePercent}%` }} />
              </div>
            </div>
          )}

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <Star className="w-8 h-8 mx-auto mb-2 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">Nessuna recensione ancora</p>
            </div>
          ) : (
            <div className="space-y-2">
              {reviews.map(review => (
                <motion.div key={review.id}
                  className={`p-3 rounded-xl border ${
                    review.is_public
                      ? "bg-card border-border/30"
                      : "bg-destructive/5 border-destructive/15"
                  }`}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  {/* Top row: name + stars */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {review.customer_name || "Anonimo"}
                      </span>
                      <span className="text-[9px] text-muted-foreground/60 flex-shrink-0">
                        {new Date(review.created_at).toLocaleDateString("it-IT")}
                      </span>
                    </div>
                    <div className="flex gap-0.5 flex-shrink-0">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-3 h-3 ${j < review.rating ? "text-primary fill-primary" : "text-muted"}`} />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mb-1.5">{review.comment}</p>
                  )}

                  {/* Status badge */}
                  {review.is_public ? (
                    <span className="inline-flex items-center gap-1 text-[9px] text-green-400 font-medium">
                      <ExternalLink className="w-2.5 h-2.5" /> Pubblica su Google
                    </span>
                  ) : (
                    <span className="text-[9px] text-destructive/70 font-medium">🔒 Archivio privato</span>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ProfitTab;
