import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserX, Gift, Clock, Check, Download, Bell, Wallet, Send } from "lucide-react";
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

/** Generate a downloadable wallet-style coupon as a PNG */
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

  ctx.fillStyle = "#C8963E";
  ctx.font = "bold 20px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(restaurantName.toUpperCase(), 40, 55);

  ctx.font = "bold 96px sans-serif";
  ctx.fillStyle = "#C8963E";
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
      .from("customer_activity")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .lt("last_order_at", cutoffDate.toISOString())
      .order("total_spent", { ascending: false });

    if (data) setCustomers(data as CustomerActivity[]);
    setLoading(false);
  };

  const handleSendDiscount = async (customer: CustomerActivity) => {
    setSendingTo(customer.id);

    // Call edge function to create wallet pass + send push
    const { data: pushResult, error: pushError } = await supabase.functions.invoke("send-push-discount", {
      body: {
        restaurant_id: restaurantId,
        customer_phone: customer.customer_phone,
        customer_name: customer.customer_name || customer.customer_phone,
        discount_percent: discountPercent,
        restaurant_name: restaurantName,
      },
    });

    if (pushError) {
      console.error("Push error:", pushError);
    }

    // Update customer activity
    await supabase
      .from("customer_activity")
      .update({ discount_sent: true, discount_sent_at: new Date().toISOString() } as any)
      .eq("id", customer.id);

    // Also generate coupon image for download
    const code = pushResult?.code || `TORNA${discountPercent}-${customer.id.slice(0, 6).toUpperCase()}`;
    const couponUrl = generateCouponImage(
      customer.customer_name || customer.customer_phone,
      discountPercent,
      restaurantName,
      code
    );
    if (couponUrl) downloadCoupon(couponUrl, `coupon-${customer.customer_name || "cliente"}.png`);

    setCustomers(prev =>
      prev.map(c => c.id === customer.id ? { ...c, discount_sent: true, discount_sent_at: new Date().toISOString() } : c)
    );

    const pushMsg = pushResult?.push_sent > 0 ? ` + ${pushResult.push_sent} push inviate` : "";
    toast({
      title: "🎁 Coupon Wallet + Push inviato!",
      description: `${discountPercent}% per ${customer.customer_name || customer.customer_phone} — coupon scaricato${pushMsg}`,
    });
    setSendingTo(null);
    fetchStats();
  };

  const handleSendToAll = async () => {
    const unsent = customers.filter(c => !c.discount_sent);
    for (const c of unsent) {
      await supabase.functions.invoke("send-push-discount", {
        body: {
          restaurant_id: restaurantId,
          customer_phone: c.customer_phone,
          customer_name: c.customer_name || c.customer_phone,
          discount_percent: discountPercent,
          restaurant_name: restaurantName,
        },
      });

      await supabase
        .from("customer_activity")
        .update({ discount_sent: true, discount_sent_at: new Date().toISOString() } as any)
        .eq("id", c.id);

      const code = `TORNA${discountPercent}-${c.id.slice(0, 6).toUpperCase()}`;
      const couponUrl = generateCouponImage(c.customer_name || c.customer_phone, discountPercent, restaurantName, code);
      if (couponUrl) downloadCoupon(couponUrl, `coupon-${c.customer_name || c.customer_phone}.png`);
    }
    setCustomers(prev =>
      prev.map(c => c.discount_sent ? c : { ...c, discount_sent: true, discount_sent_at: new Date().toISOString() })
    );
    toast({
      title: "🚀 Coupon + Push inviati a tutti!",
      description: `${unsent.length} coupon wallet generati e notifiche push inviate`,
    });
    fetchStats();
  };

  const daysSince = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const totalLostRevenue = customers.reduce((sum, c) => sum + (c.total_spent / c.total_orders) * 2, 0);
  const unsentCount = customers.filter(c => !c.discount_sent).length;

  return (
    <motion.div className="space-y-5 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-center py-4">
        <UserX className="w-12 h-12 mx-auto mb-3 text-accent" />
        <h3 className="text-lg font-display font-bold text-foreground">Sistema Clienti Persi</h3>
        <p className="text-sm text-muted-foreground mt-1">Push notification + Wallet Pass automatici per riconquistare clienti</p>
      </div>

      {/* Push & Wallet stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-center gap-3">
          <Bell className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-lg font-display font-bold text-blue-400">{pushSubCount}</p>
            <p className="text-[10px] text-muted-foreground">Iscritti Push</p>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 flex items-center gap-3">
          <Wallet className="w-5 h-5 text-purple-400" />
          <div>
            <p className="text-lg font-display font-bold text-purple-400">{walletPassCount}</p>
            <p className="text-[10px] text-muted-foreground">Pass Wallet emessi</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-secondary/50">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">Soglia inattività</label>
          <div className="flex items-center gap-2">
            <input type="number" min={7} max={90} value={inactivityDays}
              onChange={e => setInactivityDays(Number(e.target.value) || 30)}
              className="w-16 px-2 py-2 rounded-lg bg-background text-foreground text-base text-center focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[40px]" />
            <span className="text-xs text-muted-foreground">giorni</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-secondary/50">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">Sconto offerto</label>
          <div className="flex items-center gap-2">
            <input type="number" min={5} max={50} step={5} value={discountPercent}
              onChange={e => setDiscountPercent(Number(e.target.value) || 10)}
              className="w-16 px-2 py-2 rounded-lg bg-background text-foreground text-base text-center focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[40px]" />
            <span className="text-xs text-muted-foreground">%</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-xl bg-accent/5 border border-accent/20 text-center">
          <p className="text-xl font-display font-bold text-accent">{customers.length}</p>
          <p className="text-[10px] text-muted-foreground">Clienti persi</p>
        </div>
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-center">
          <p className="text-xl font-display font-bold text-primary">€{Math.round(totalLostRevenue)}</p>
          <p className="text-[10px] text-muted-foreground">Revenue perso/mese</p>
        </div>
        <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/20 text-center">
          <p className="text-xl font-display font-bold text-green-400">{customers.length - unsentCount}</p>
          <p className="text-[10px] text-muted-foreground">Push + Pass inviati</p>
        </div>
      </div>

      {/* Send all */}
      {unsentCount > 0 && (
        <motion.button onClick={handleSendToAll}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 gold-glow min-h-[48px]"
          whileTap={{ scale: 0.97 }}>
          <Send className="w-4 h-4" />
          Push + Wallet a {unsentCount} clienti ({discountPercent}%)
        </motion.button>
      )}

      {/* Info banner */}
      <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          <Bell className="w-3.5 h-3.5 inline-block mr-1 text-blue-400" />
          Ogni invio crea un <strong className="text-foreground">Wallet Pass</strong> (Apple/Google) + invia una <strong className="text-foreground">Push Notification</strong> ai clienti iscritti. 
          Il coupon viene anche scaricato come immagine da condividere via WhatsApp.
        </p>
      </div>

      {/* Customer list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-12">
          <Check className="w-12 h-12 mx-auto mb-3 text-green-400/30" />
          <p className="text-sm text-muted-foreground">Nessun cliente perso negli ultimi {inactivityDays} giorni! 🎉</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">
            Clienti inattivi da più di {inactivityDays} giorni
          </p>
          {customers.map((customer) => (
            <motion.div key={customer.id}
              className={`p-3 rounded-xl flex items-center gap-3 ${
                customer.discount_sent ? "bg-green-500/5 border border-green-500/20" : "bg-secondary/50"
              }`}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <UserX className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {customer.customer_name || customer.customer_phone}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    {daysSince(customer.last_order_at)}gg fa
                  </span>
                  <span>{customer.total_orders} ordini</span>
                  <span className="text-primary">€{Math.round(customer.total_spent)}</span>
                </div>
              </div>
              {customer.discount_sent ? (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-medium">
                  <Check className="w-3 h-3" /> Push + Pass ✓
                </span>
              ) : (
                <motion.button onClick={() => handleSendDiscount(customer)}
                  disabled={sendingTo === customer.id}
                  className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-[10px] font-medium flex items-center gap-1 min-h-[36px] disabled:opacity-50"
                  whileTap={{ scale: 0.95 }}>
                  {sendingTo === customer.id ? (
                    <motion.div className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full"
                      animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                  ) : (
                    <>
                      <Bell className="w-3 h-3" />
                      {discountPercent}%
                    </>
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
