import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingCart, DollarSign, Users, Star, CalendarDays, ChefHat, ExternalLink, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

interface DashboardOverviewProps {
  todayRevenue: number;
  todayOrderCount: number;
  activeOrderCount: number;
  menuItemCount: number;
  aiTokens: number;
  restaurantName: string;
  restaurantId?: string;
  reviews: any[];
  reservations: any[];
  menuUrl: string;
  onNavigate: (tab: string) => void;
}

const DashboardOverview = ({
  todayRevenue, todayOrderCount, activeOrderCount, menuItemCount, aiTokens, restaurantName,
  restaurantId, reviews, reservations, menuUrl, onNavigate,
}: DashboardOverviewProps) => {
  const [buyingTokens, setBuyingTokens] = useState(false);
  const { user } = useAuth();
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  const today = new Date().toISOString().split("T")[0];
  const todayReservations = reservations.filter((r: any) => r.reservation_date === today);
  const pendingReservations = reservations.filter((r: any) => r.status === "pending");

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-center py-2">
        <h2 className="text-lg font-display font-bold text-foreground">{restaurantName}</h2>
        <p className="text-xs text-muted-foreground">Panoramica giornaliera</p>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div className="p-4 rounded-2xl bg-card border border-primary/20 cursor-pointer" whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate("profit")}>
          <DollarSign className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-display font-bold text-primary">€{todayRevenue.toFixed(0)}</p>
          <p className="text-xs text-muted-foreground">Incasso oggi</p>
        </motion.div>
        <motion.div className="p-4 rounded-2xl bg-card cursor-pointer" whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate("orders")}>
          <ShoppingCart className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-display font-bold text-foreground">{todayOrderCount}</p>
          <p className="text-xs text-muted-foreground">Ordini oggi</p>
        </motion.div>
        <motion.div className="p-4 rounded-2xl bg-card cursor-pointer" whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate("orders")}>
          <ChefHat className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-display font-bold text-foreground">{activeOrderCount}</p>
          <p className="text-xs text-muted-foreground">In cucina</p>
          {activeOrderCount > 0 && (
            <div className="mt-1 w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
          )}
        </motion.div>
        <motion.div className="p-4 rounded-2xl bg-card cursor-pointer" whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate("studio")}>
          <TrendingUp className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-display font-bold text-foreground">{menuItemCount}</p>
          <p className="text-xs text-muted-foreground">Piatti in menu</p>
        </motion.div>
      </div>

      {/* Reviews & Reservations row */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div className="p-3 rounded-2xl bg-card border border-border/50 cursor-pointer" whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate("profit")}>
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Recensioni</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-display font-bold text-primary">{avgRating}</span>
            <span className="text-xs text-muted-foreground">({reviews.length})</span>
          </div>
        </motion.div>
        <motion.div className="p-3 rounded-2xl bg-card border border-border/50 cursor-pointer" whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate("orders")}>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Prenotazioni</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-display font-bold text-foreground">{todayReservations.length}</span>
            <span className="text-xs text-muted-foreground">oggi</span>
          </div>
          {pendingReservations.length > 0 && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] text-amber-400 font-semibold">{pendingReservations.length} da confermare</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* AI Tokens */}
      <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Gettoni IA</p>
          <p className="text-xs text-muted-foreground">Menu Creator, Foto, Traduzioni</p>
        </div>
        <span className="text-lg font-display font-bold text-primary mr-2">{aiTokens}</span>
        <motion.button
          onClick={async () => {
            if (!restaurantId) return;
            setBuyingTokens(true);
            try {
              const { data, error } = await supabase.functions.invoke("ai-token-checkout", {
                body: {
                  restaurantId,
                  customerEmail: user?.email,
                  successUrl: `${window.location.origin}/dashboard?tokens=success`,
                  cancelUrl: `${window.location.origin}/dashboard?tokens=cancelled`,
                },
              });
              if (error) throw error;
              if (data?.url) window.open(data.url, "_blank");
            } catch (e: any) {
              toast({ title: "Errore", description: e.message || "Impossibile avviare l'acquisto", variant: "destructive" });
            }
            setBuyingTokens(false);
          }}
          disabled={buyingTokens}
          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
          whileTap={{ scale: 0.95 }}
        >
          {buyingTokens ? <Loader2 className="w-3 h-3 animate-spin" /> : <DollarSign className="w-3 h-3" />}
          +50
        </motion.button>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">Azioni rapide</p>
        <div className="grid grid-cols-2 gap-2">
          <motion.button onClick={() => window.open(menuUrl, "_blank")}
            className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50 text-sm text-foreground min-h-[48px] hover:bg-secondary transition-colors"
            whileTap={{ scale: 0.97 }}>
            <ExternalLink className="w-4 h-4 text-primary" /> Vedi Menu
          </motion.button>
          <motion.button onClick={() => window.open("/kitchen", "_blank")}
            className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50 text-sm text-foreground min-h-[48px] hover:bg-secondary transition-colors"
            whileTap={{ scale: 0.97 }}>
            <ChefHat className="w-4 h-4 text-primary" /> Cucina
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardOverview;
