import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserX, Clock, Check, Bell, Wallet, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CustomerActivity {
  id: string;
  customer_phone: string;
  customer_name: string | null;
  last_order_at: string;
  total_orders: number;
  total_spent: number;
  discount_sent: boolean;
  discount_sent_at: string | null;
}

interface LostCustomersProps {
  restaurantId: string;
  restaurantName?: string;
}

const generateCouponImage = (customerName: string, discountPercent: number, restaurantName: string, code: string): string => {
  const canvas = document.createElement("canvas");
  canvas.width = 750;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const grad = ctx.createLinearGradient(0, 0, 750, 400);
  grad.addColorStop(0, "#1a1510");
  grad.addColorStop(1, "#2a1f14");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(0, 0, 750, 400, 24);
  ctx.fill();

  ctx.fillStyle = "#C8963E";
  ctx.fillRect(0, 0, 750, 6);
  ctx.font = "bold 20px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(restaurantName.toUpperCase(), 40, 55);

  ctx.font = "bold 96px sans-serif";
  ctx.fillText(`-${discountPercent}%`, 40, 180);

  ctx.font = "400 22px sans-serif";
  ctx.fillStyle = "#b0a090";
  ctx.fillText(`Sconto riservato a ${customerName}`, 40, 230);

  ctx.font = "600 28px monospace";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`Codice: ${code}`, 40, 300);

  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 30);
  ctx.font = "400 16px sans-serif";
  ctx.fillStyle = "#808080";
  ctx.fillText(`Valido fino al ${expiry.toLocaleDateString("it-IT")}`, 40, 340);

  ctx.fillStyle = "rgba(200, 150, 62, 0.15)";
  ctx.beginPath();
  ctx.arc(650, 300, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "40px serif";
  ctx.fillStyle = "#C8963E";
  ctx.textAlign = "center";
  ctx.fillText("🎁", 650, 315);

  return canvas.toDataURL("image/png");
};

const downloadCoupon = (dataUrl: string, filename: string) => {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
};

const LostCustomers = ({ restaurantId, restaurantName = "Ristorante" }: LostCustomersProps) => {
  const [customers, setCustomers] = useState<CustomerActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [inactivityDays, setInactivityDays] = useState(30);
  const [discountPercent, setDiscountPercent] = useState(10);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [pushSubCount, setPushSubCount] = useState(0);
  const [walletPassCount, setWalletPassCount] = useState(0);

  useEffect(() => {
    fetchCustomers();
    fetchStats();
  }, [restaurantId, inactivityDays]);

  const fetchStats = async () => {
    const [{ count: pushCount }, { count: passCount }] = await Promise.all([
      supabase.from("push_subscriptions").select("*", { count: "exact", head: true }).eq("restaurant_id", restaurantId).eq("is_active", true),
      supabase.from("wallet_passes").select("*", { count: "exact", head: true }).eq("restaurant_id", restaurantId),
    ]);
    setPushSubCount(pushCount || 0);
    setWalletPassCount(passCount || 0);
  };

  const fetchCustomers = async () => {
    setLoading(true);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - inactivityDays);
    const { data } = await supabase
      .from("customer_activity").select("*").eq("restaurant_id", restaurantId)
      .lt("last_order_at", cutoffDate.toISOString()).order("total_spent", { ascending: false });
    if (data) setCustomers(data as CustomerActivity[]);
    setLoading(false);
  };

  const handleSendDiscount = async (customer: CustomerActivity) => {
    setSendingTo(customer.id);
    const { data: pushResult, error: pushError } = await supabase.functions.invoke("send-push-discount", {
      body: { restaurant_id: restaurantId, customer_phone: customer.customer_phone, customer_name: customer.customer_name || customer.customer_phone, discount_percent: discountPercent, restaurant_name: restaurantName },
    });
    if (pushError) console.error("Push error:", pushError);

    await supabase.from("customer_activity").update({ discount_sent: true, discount_sent_at: new Date().toISOString() } as any).eq("id", customer.id);

    const code = pushResult?.code || `TORNA${discountPercent}-${customer.id.slice(0, 6).toUpperCase()}`;
    const couponUrl = generateCouponImage(customer.customer_name || customer.customer_phone, discountPercent, restaurantName, code);
    if (couponUrl) downloadCoupon(couponUrl, `coupon-${customer.customer_name || "cliente"}.png`);

    setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, discount_sent: true, discount_sent_at: new Date().toISOString() } : c));
    const pushMsg = pushResult?.push_sent > 0 ? ` + ${pushResult.push_sent} push` : "";
    toast({ title: "🎁 Coupon inviato!", description: `${discountPercent}% per ${customer.customer_name || customer.customer_phone}${pushMsg}` });
    setSendingTo(null);
    fetchStats();
  };

  const handleSendToAll = async () => {
    const unsent = customers.filter(c => !c.discount_sent);
    for (const c of unsent) {
      await supabase.functions.invoke("send-push-discount", {
        body: { restaurant_id: restaurantId, customer_phone: c.customer_phone, customer_name: c.customer_name || c.customer_phone, discount_percent: discountPercent, restaurant_name: restaurantName },
      });
      await supabase.from("customer_activity").update({ discount_sent: true, discount_sent_at: new Date().toISOString() } as any).eq("id", c.id);
      const code = `TORNA${discountPercent}-${c.id.slice(0, 6).toUpperCase()}`;
      const couponUrl = generateCouponImage(c.customer_name || c.customer_phone, discountPercent, restaurantName, code);
      if (couponUrl) downloadCoupon(couponUrl, `coupon-${c.customer_name || c.customer_phone}.png`);
    }
    setCustomers(prev => prev.map(c => c.discount_sent ? c : { ...c, discount_sent: true, discount_sent_at: new Date().toISOString() }));
    toast({ title: "🚀 Inviati a tutti!", description: `${unsent.length} coupon wallet + push generati` });
    fetchStats();
  };

  const daysSince = (date: string) => Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
  const totalLostRevenue = customers.reduce((sum, c) => sum + (c.total_spent / c.total_orders) * 2, 0);
  const unsentCount = customers.filter(c => !c.discount_sent).length;

  return (
    <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header compact */}
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-destructive/5 border border-destructive/15">
        <UserX className="w-7 h-7 text-destructive flex-shrink-0" />
        <div className="min-w-0">
          <h3 className="text-sm font-display font-bold text-foreground">Clienti Persi</h3>
          <p className="text-[10px] text-muted-foreground">Push + Wallet Pass per riconquistarli</p>
        </div>
      </div>

      {/* Push & Wallet stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl bg-card border border-border/30 flex items-center gap-2.5">
          <Bell className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-base font-display font-bold text-foreground leading-none">{pushSubCount}</p>
            <p className="text-[9px] text-muted-foreground">Push iscritti</p>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border/30 flex items-center gap-2.5">
          <Wallet className="w-5 h-5 text-violet-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-base font-display font-bold text-foreground leading-none">{walletPassCount}</p>
            <p className="text-[9px] text-muted-foreground">Wallet Pass</p>
          </div>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex gap-2">
        <div className="flex-1 p-3 rounded-xl bg-secondary/40">
          <label className="text-[9px] text-muted-foreground uppercase tracking-wider block mb-1.5 font-medium">Inattività</label>
          <div className="flex items-center gap-1.5">
            <input type="number" min={7} max={90} value={inactivityDays}
              onChange={e => setInactivityDays(Math.max(7, Math.min(90, Number(e.target.value) || 30)))}
              className="w-12 px-1.5 py-2 rounded-lg bg-card border border-border/30 text-foreground text-sm text-center min-h-[40px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <span className="text-[10px] text-muted-foreground">gg</span>
          </div>
        </div>
        <div className="flex-1 p-3 rounded-xl bg-secondary/40">
          <label className="text-[9px] text-muted-foreground uppercase tracking-wider block mb-1.5 font-medium">Sconto</label>
          <div className="flex items-center gap-1.5">
            <input type="number" min={5} max={50} step={5} value={discountPercent}
              onChange={e => setDiscountPercent(Math.max(5, Math.min(50, Number(e.target.value) || 10)))}
              className="w-12 px-1.5 py-2 rounded-lg bg-card border border-border/30 text-foreground text-sm text-center min-h-[40px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <span className="text-[10px] text-muted-foreground">%</span>
          </div>
        </div>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-3 gap-1.5">
        <div className="p-2.5 rounded-xl bg-destructive/5 border border-destructive/15 text-center">
          <p className="text-lg font-display font-bold text-destructive leading-none">{customers.length}</p>
          <p className="text-[8px] text-muted-foreground mt-0.5">Persi</p>
        </div>
        <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/15 text-center">
          <p className="text-lg font-display font-bold text-primary leading-none">€{Math.round(totalLostRevenue)}</p>
          <p className="text-[8px] text-muted-foreground mt-0.5">Rev. perso</p>
        </div>
        <div className="p-2.5 rounded-xl bg-green-500/5 border border-green-500/15 text-center">
          <p className="text-lg font-display font-bold text-green-400 leading-none">{customers.length - unsentCount}</p>
          <p className="text-[8px] text-muted-foreground mt-0.5">Inviati</p>
        </div>
      </div>

      {/* Send all CTA */}
      {unsentCount > 0 && (
        <motion.button onClick={handleSendToAll}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 min-h-[48px] active:scale-[0.97] transition-transform"
          whileTap={{ scale: 0.97 }}>
          <Send className="w-4 h-4" />
          Invia a {unsentCount} clienti ({discountPercent}%)
        </motion.button>
      )}

      {/* Customer list */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-10">
          <Check className="w-8 h-8 mx-auto mb-2 text-green-400/30" />
          <p className="text-sm text-muted-foreground">Nessun cliente perso 🎉</p>
          <p className="text-[10px] text-muted-foreground/50 mt-0.5">Ultimi {inactivityDays} giorni</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          <p className="text-[9px] text-muted-foreground/70 uppercase tracking-wider font-medium">
            Inattivi da {inactivityDays}+ giorni
          </p>
          {customers.map(customer => (
            <motion.div key={customer.id}
              className={`p-3 rounded-xl flex items-center gap-2.5 ${
                customer.discount_sent ? "bg-green-500/5 border border-green-500/15" : "bg-card border border-border/30"
              }`}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                customer.discount_sent ? "bg-green-500/15" : "bg-destructive/10"
              }`}>
                {customer.discount_sent
                  ? <Check className="w-4 h-4 text-green-400" />
                  : <UserX className="w-4 h-4 text-destructive" />
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {customer.customer_name || customer.customer_phone}
                </p>
                <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {daysSince(customer.last_order_at)}gg
                  </span>
                  <span>{customer.total_orders} ord.</span>
                  <span className="text-primary font-medium">€{Math.round(customer.total_spent)}</span>
                </div>
              </div>

              {/* Action */}
              {customer.discount_sent ? (
                <span className="px-2 py-1 rounded-lg bg-green-500/10 text-green-400 text-[8px] font-medium flex-shrink-0">
                  ✓ Inviato
                </span>
              ) : (
                <motion.button onClick={() => handleSendDiscount(customer)}
                  disabled={sendingTo === customer.id}
                  className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-[10px] font-semibold flex items-center gap-1 min-h-[36px] min-w-[56px] justify-center disabled:opacity-50 flex-shrink-0 active:scale-[0.95] transition-transform"
                  whileTap={{ scale: 0.95 }}>
                  {sendingTo === customer.id ? (
                    <div className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>{discountPercent}%</>
                  )}
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default LostCustomers;
