import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingCart, DollarSign, Users, Star, CalendarDays, ChefHat, ExternalLink, Sparkles, Loader2 } from "lucide-react";
import InfoGuide from "@/components/ui/info-guide";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import cartoonDashboard from "@/assets/cartoon-dashboard.png";

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
      {/* Cartoon illustration */}
      <div className="flex items-center gap-3 py-1">
        <img src={cartoonDashboard} alt="" className="w-16 h-16 object-contain flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-display font-bold text-foreground">{restaurantName}</h2>
          <p className="text-xs text-muted-foreground">Panoramica giornaliera</p>
        </div>
        <InfoGuide
          title="Dashboard Principale"
          description="La tua panoramica quotidiana con i KPI più importanti: incasso, ordini, piatti in cucina e statistiche."
          steps={[
            "Tocca ogni card per accedere alla sezione dedicata",
            "I dati si aggiornano in tempo reale",
            "Usa 'Azioni rapide' per aprire menu o cucina",
          ]}
        />
      </div>

      {/* Main KPIs — 2x2 grid */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div className="p-3.5 rounded-2xl bg-card border border-primary/20 cursor-pointer active:scale-[0.97] transition-transform" onClick={() => onNavigate("profit")}>
          <DollarSign className="w-5 h-5 text-primary mb-1.5" />
          <p className="text-2xl font-display font-bold text-primary leading-tight">€{todayRevenue.toFixed(0)}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Incasso oggi</p>
        </motion.div>
        <motion.div className="p-3.5 rounded-2xl bg-card cursor-pointer active:scale-[0.97] transition-transform" onClick={() => onNavigate("orders")}>
          <ShoppingCart className="w-5 h-5 text-primary mb-1.5" />
          <p className="text-2xl font-display font-bold text-foreground leading-tight">{todayOrderCount}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Ordini oggi</p>
        </motion.div>
        <motion.div className="p-3.5 rounded-2xl bg-card cursor-pointer active:scale-[0.97] transition-transform" onClick={() => onNavigate("orders")}>
          <ChefHat className="w-5 h-5 text-primary mb-1.5" />
          <div className="flex items-center gap-2">
            <p className="text-2xl font-display font-bold text-foreground leading-tight">{activeOrderCount}</p>
            {activeOrderCount > 0 && <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">In cucina</p>
        </motion.div>
        <motion.div className="p-3.5 rounded-2xl bg-card cursor-pointer active:scale-[0.97] transition-transform" onClick={() => onNavigate("studio")}>
          <TrendingUp className="w-5 h-5 text-primary mb-1.5" />
          <p className="text-2xl font-display font-bold text-foreground leading-tight">{menuItemCount}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Piatti in menu</p>
        </motion.div>
      </div>

      {/* Reviews & Reservations */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div className="p-3 rounded-2xl bg-card border border-border/50 cursor-pointer active:scale-[0.97] transition-transform" onClick={() => onNavigate("profit")}>
          <div className="flex items-center gap-1.5 mb-1">
            <Star className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] text-muted-foreground">Recensioni</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-display font-bold text-primary">{avgRating}</span>
            <span className="text-[10px] text-muted-foreground">({reviews.length})</span>
          </div>
        </motion.div>
        <motion.div className="p-3 rounded-2xl bg-card border border-border/50 cursor-pointer active:scale-[0.97] transition-transform" onClick={() => onNavigate("orders")}>
          <div className="flex items-center gap-1.5 mb-1">
            <CalendarDays className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] text-muted-foreground">Prenotazioni</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-display font-bold text-foreground">{todayReservations.length}</span>
            <span className="text-[10px] text-muted-foreground">oggi</span>
          </div>
          {pendingReservations.length > 0 && (
            <div className="mt-1 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] text-amber-400 font-semibold">{pendingReservations.length} da confermare</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* AI Tokens */}
      <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-3 relative">
        <div className="absolute top-2 right-2">
          <InfoGuide
            title="Gettoni IA"
            description="I gettoni alimentano le funzionalità AI: creazione menu da foto, generazione immagini food e traduzione automatica in più lingue."
            steps={[
              "Ogni operazione AI consuma 1 gettone",
              "Premi +50 per acquistare un pacchetto aggiuntivo",
              "Vai in Studio → AI per usarli",
            ]}
          />
        </div>
        <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">Gettoni IA</p>
          <p className="text-[11px] text-muted-foreground truncate">Menu Creator, Foto, Traduzioni</p>
        </div>
        <span className="text-lg font-display font-bold text-primary flex-shrink-0">{aiTokens}</span>
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
              if (data?.error) throw new Error(data.error);
              if (data?.url) window.open(data.url, "_blank");
            } catch (e: any) {
              toast({ title: "Errore", description: e.message || "Impossibile avviare l'acquisto", variant: "destructive" });
            }
            setBuyingTokens(false);
          }}
          disabled={buyingTokens}
          className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1 disabled:opacity-50 flex-shrink-0 min-h-[36px]"
          whileTap={{ scale: 0.95 }}
        >
          {buyingTokens ? <Loader2 className="w-3 h-3 animate-spin" /> : <DollarSign className="w-3 h-3" />}
          +50
        </motion.button>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider">Azioni rapide</p>
        <div className="grid grid-cols-2 gap-2">
          <motion.button onClick={() => window.open(menuUrl, "_blank")}
            className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50 text-sm text-foreground min-h-[48px] active:bg-secondary transition-colors"
            whileTap={{ scale: 0.97 }}>
            <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" /> Vedi Menu
          </motion.button>
          <motion.button onClick={() => window.open("/kitchen", "_blank")}
            className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50 text-sm text-foreground min-h-[48px] active:bg-secondary transition-colors"
            whileTap={{ scale: 0.97 }}>
            <ChefHat className="w-4 h-4 text-primary flex-shrink-0" /> Cucina
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardOverview;
