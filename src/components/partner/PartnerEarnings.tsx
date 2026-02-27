import { forwardRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, ArrowUpRight, Crown, CreditCard, Calendar, CheckCircle, Link2, ExternalLink, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const PartnerEarnings = forwardRef<HTMLDivElement>((_, ref) => {
  const { user } = useAuth();
  const [connectStatus, setConnectStatus] = useState<{ connected: boolean; onboarding_complete: boolean } | null>(null);
  const [connectLoading, setConnectLoading] = useState(false);
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Check Stripe Connect status
  useEffect(() => {
    if (!user?.id) return;
    checkConnectStatus();
    fetchSales();
  }, [user?.id]);

  const checkConnectStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("partner-connect-onboarding", {
        body: { action: "status", userId: user?.id },
      });
      if (!error && data) setConnectStatus(data);
    } catch (e) {
      console.error("Connect status check failed:", e);
    }
  };

  const fetchSales = async () => {
    try {
      // Fetch real payment records where this partner was the referrer
      const { data } = await supabase
        .from("restaurant_payments")
        .select("*, restaurants(name)")
        .eq("partner_id", user?.id || "")
        .order("created_at", { ascending: false });
      if (data) setSales(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleConnectStripe = async () => {
    if (!user?.id) return;
    setConnectLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("partner-connect-onboarding", {
        body: {
          action: "create",
          userId: user.id,
          email: user.email,
          returnUrl: `${window.location.origin}/partner?stripe=success`,
          refreshUrl: `${window.location.origin}/partner?stripe=refresh`,
        },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (e: any) {
      toast({ title: "Errore", description: e.message || "Impossibile aprire Stripe Connect", variant: "destructive" });
    }
    setConnectLoading(false);
  };

  const handleOpenDashboard = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("partner-connect-onboarding", {
        body: { action: "dashboard", userId: user?.id },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (e: any) {
      toast({ title: "Errore", description: e.message, variant: "destructive" });
    }
  };

  const totalEarned = sales.filter(s => s.partner_paid).reduce((sum, s) => sum + (s.partner_commission || 0), 0);
  const pendingEarnings = sales.filter(s => !s.partner_paid).reduce((sum, s) => sum + (s.partner_commission || 0), 0);

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
      <h2 className="text-lg font-display font-bold text-foreground">I tuoi Guadagni</h2>

      {/* Stripe Connect Status */}
      <div className="p-4 rounded-2xl border border-border/50 bg-card space-y-3">
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Conto Stripe Connect</h3>
        </div>
        {connectStatus?.connected && connectStatus?.onboarding_complete ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Connesso</span>
            </div>
            <button onClick={handleOpenDashboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-xs font-medium text-foreground hover:bg-secondary/80">
              <ExternalLink className="w-3.5 h-3.5" /> Dashboard Stripe
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Collega il tuo conto bancario per ricevere le commissioni di €997 per ogni vendita chiusa.
            </p>
            <motion.button
              onClick={handleConnectStripe}
              disabled={connectLoading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              whileTap={{ scale: 0.97 }}
            >
              {connectLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              {connectLoading ? "Apertura..." : "Collega Conto Bancario"}
            </motion.button>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-amber-500/10 border border-primary/20">
          <DollarSign className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-display font-bold text-foreground">€{totalEarned.toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground">Guadagnato</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/50">
          <CreditCard className="w-5 h-5 text-amber-400 mb-2" />
          <p className="text-2xl font-display font-bold text-foreground">€{pendingEarnings.toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground">In Attesa</p>
        </div>
      </div>

      {/* Split Breakdown Visual */}
      <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-3">
        <h3 className="text-sm font-bold text-foreground">Split per Vendita (€2.997)</h3>
        <div className="space-y-2">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-primary" /> Platform Revenue (Kevin)
              </span>
              <span className="font-bold text-foreground">€2.000</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-amber-500"
                initial={{ width: 0 }} animate={{ width: "66.7%" }} transition={{ delay: 0.3, duration: 0.8 }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Your Commission (Partner)
              </span>
              <span className="font-bold text-foreground">€997</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                initial={{ width: 0 }} animate={{ width: "33.3%" }} transition={{ delay: 0.5, duration: 0.8 }} />
            </div>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-1">
          Rate 3 mesi: €350 x 3 | Rate 6 mesi: €166 x 6 (pro-rata via Stripe Connect)
        </p>
      </div>

      {/* Recent Sales */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-foreground">Vendite Recenti</h3>
        {sales.length === 0 && !loading && (
          <p className="text-xs text-muted-foreground py-4 text-center">Nessuna vendita ancora. Inizia a vendere Empire!</p>
        )}
        {sales.map((sale, i) => (
          <motion.div key={sale.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${sale.partner_paid ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
              {sale.partner_paid ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Calendar className="w-4 h-4 text-amber-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{(sale.restaurants as any)?.name || "Ristorante"}</p>
              <p className="text-[10px] text-muted-foreground">
                {sale.plan_type === "full" ? "Full Pay" : `${sale.installments_total} Rate`} · {new Date(sale.created_at).toLocaleDateString("it-IT")}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-primary">+€{sale.partner_commission}</p>
              <p className="text-[10px] text-muted-foreground">
                {sale.partner_paid ? "Ricevuto" : "In attesa"}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

PartnerEarnings.displayName = "PartnerEarnings";

export default PartnerEarnings;
