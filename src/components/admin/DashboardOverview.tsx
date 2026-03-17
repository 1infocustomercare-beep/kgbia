import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, ShoppingCart, DollarSign, Users, Star, CalendarDays, ChefHat, ExternalLink, Sparkles, Loader2, Zap, Crown, X } from "lucide-react";
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
  const [showTokenShop, setShowTokenShop] = useState(false);
  const [buyingPack, setBuyingPack] = useState<string | null>(null);
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
      <div className="flex flex-col items-center text-center gap-2 py-2">
        <img src={cartoonDashboard} alt="" className="w-24 h-24 object-contain" />
        <div>
          <h2 className="text-lg font-display font-bold text-foreground">{restaurantName}</h2>
          <p className="text-[0.6rem] uppercase tracking-[3px] text-muted-foreground/50 font-semibold">Command Center · Oggi</p>
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
          <p className="text-[0.55rem] uppercase tracking-[2px] text-muted-foreground/50 font-semibold mt-1">Revenue Giornaliero</p>
        </motion.div>
        <motion.div className="p-3.5 rounded-2xl bg-card cursor-pointer active:scale-[0.97] transition-transform" onClick={() => onNavigate("orders")}>
          <ShoppingCart className="w-5 h-5 text-primary mb-1.5" />
          <p className="text-2xl font-display font-bold text-foreground leading-tight">{todayOrderCount}</p>
          <p className="text-[0.55rem] uppercase tracking-[2px] text-muted-foreground/50 font-semibold mt-1">Ordini Ricevuti</p>
        </motion.div>
        <motion.div className="p-3.5 rounded-2xl bg-card cursor-pointer active:scale-[0.97] transition-transform" onClick={() => onNavigate("orders")}>
          <ChefHat className="w-5 h-5 text-primary mb-1.5" />
          <div className="flex items-center gap-2">
            <p className="text-2xl font-display font-bold text-foreground leading-tight">{activeOrderCount}</p>
            {activeOrderCount > 0 && <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />}
          </div>
          <p className="text-[0.55rem] uppercase tracking-[2px] text-muted-foreground/50 font-semibold mt-1">In Preparazione</p>
        </motion.div>
        <motion.div className="p-3.5 rounded-2xl bg-card cursor-pointer active:scale-[0.97] transition-transform" onClick={() => onNavigate("studio")}>
          <TrendingUp className="w-5 h-5 text-primary mb-1.5" />
          <p className="text-2xl font-display font-bold text-foreground leading-tight">{menuItemCount}</p>
          <p className="text-[0.55rem] uppercase tracking-[2px] text-muted-foreground/50 font-semibold mt-1">Catalogo Piatti</p>
        </motion.div>
      </div>

      {/* Reviews & Reservations */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div className="p-3 rounded-2xl bg-card border border-border/50 cursor-pointer active:scale-[0.97] transition-transform" onClick={() => onNavigate("profit")}>
          <div className="flex items-center gap-1.5 mb-1">
            <Star className="w-3.5 h-3.5 text-primary" />
            <span className="text-[0.55rem] uppercase tracking-[2px] text-muted-foreground/50 font-semibold">Reputazione</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-display font-bold text-primary">{avgRating}</span>
            <span className="text-[10px] text-muted-foreground">({reviews.length})</span>
          </div>
        </motion.div>
        <motion.div className="p-3 rounded-2xl bg-card border border-border/50 cursor-pointer active:scale-[0.97] transition-transform" onClick={() => onNavigate("orders")}>
          <div className="flex items-center gap-1.5 mb-1">
            <CalendarDays className="w-3.5 h-3.5 text-primary" />
            <span className="text-[0.55rem] uppercase tracking-[2px] text-muted-foreground/50 font-semibold">Prenotazioni</span>
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
      <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 relative">
        <div className="absolute top-2 right-2">
          <InfoGuide
            title="Gettoni IA"
            description="I gettoni alimentano le funzionalità AI: creazione menu da foto, generazione immagini food e traduzione automatica in più lingue."
            steps={[
              "Ogni operazione AI consuma 1 gettone",
              "Acquista pacchetti quando li esaurisci",
              "Vai in Studio → AI per usarli",
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Gettoni IA</p>
            <p className="text-[11px] text-muted-foreground truncate">Menu Creator, Foto, Traduzioni</p>
          </div>
          <span className={`text-lg font-display font-bold flex-shrink-0 ${aiTokens <= 5 ? "text-destructive" : "text-primary"}`}>{aiTokens}</span>
        </div>

        {aiTokens <= 10 && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-2 rounded-lg bg-destructive/10 border border-destructive/20 text-[11px] text-destructive text-center">
            ⚠️ Gettoni in esaurimento! Ricarica per continuare ad usare le funzioni IA.
          </motion.div>
        )}

        <motion.button
          onClick={() => setShowTokenShop(true)}
          className="w-full mt-3 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 min-h-[44px]"
          whileTap={{ scale: 0.97 }}
        >
          <Zap className="w-4 h-4" /> Acquista Gettoni IA
        </motion.button>
      </div>

      {/* Token Shop Modal */}
      <AnimatePresence>
        {showTokenShop && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowTokenShop(false)}>
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-sm bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-display font-bold text-foreground">Ricarica Gettoni IA</h3>
                  <p className="text-[11px] text-muted-foreground">Saldo attuale: {aiTokens} gettoni</p>
                </div>
                <button onClick={() => setShowTokenShop(false)} className="p-1.5 rounded-full hover:bg-secondary">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: "50", credits: 50, price: 15, label: "Starter", icon: <Zap className="w-4 h-4" />, popular: false },
                  { id: "150", credits: 150, price: 39, label: "Pro", icon: <Sparkles className="w-4 h-4" />, popular: true, save: "13%" },
                  { id: "500", credits: 500, price: 99, label: "Business", icon: <Crown className="w-4 h-4" />, popular: false, save: "34%" },
                ].map((pack) => (
                  <motion.button key={pack.id}
                    onClick={async () => {
                      if (!restaurantId) return;
                      setBuyingPack(pack.id);
                      try {
                        const { data, error } = await supabase.functions.invoke("ai-token-checkout", {
                          body: {
                            restaurantId,
                            customerEmail: user?.email,
                            credits: pack.credits,
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
                      setBuyingPack(null);
                    }}
                    disabled={!!buyingPack}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left relative overflow-hidden min-h-[60px] ${
                      pack.popular
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border bg-secondary/30 hover:border-primary/40"
                    } ${buyingPack === pack.id ? "opacity-70" : ""}`}
                    whileTap={{ scale: 0.98 }}
                  >
                    {pack.popular && (
                      <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">
                        PIÙ SCELTO
                      </span>
                    )}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      pack.popular ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                    }`}>
                      {buyingPack === pack.id ? <Loader2 className="w-4 h-4 animate-spin" /> : pack.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{pack.label} — {pack.credits} gettoni</p>
                      <p className="text-[11px] text-muted-foreground">
                        €{(pack.price / pack.credits).toFixed(2)}/gettone
                        {pack.save && <span className="text-primary font-semibold ml-1">Risparmi {pack.save}</span>}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-foreground flex-shrink-0">€{pack.price}</span>
                  </motion.button>
                ))}
              </div>

              <p className="text-[10px] text-muted-foreground/60 text-center">
                Pagamento sicuro via Stripe · I gettoni non scadono
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
