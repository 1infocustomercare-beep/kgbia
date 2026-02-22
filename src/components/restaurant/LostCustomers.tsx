import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserX, Gift, Clock, TrendingDown, Send, Check } from "lucide-react";
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
}

const LostCustomers = ({ restaurantId }: LostCustomersProps) => {
  const [customers, setCustomers] = useState<CustomerActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [inactivityDays, setInactivityDays] = useState(30);
  const [discountPercent, setDiscountPercent] = useState(10);
  const [sendingTo, setSendingTo] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, [restaurantId, inactivityDays]);

  const fetchCustomers = async () => {
    setLoading(true);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - inactivityDays);

    const { data, error } = await supabase
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
    // Mark discount as sent in DB
    await supabase
      .from("customer_activity")
      .update({ discount_sent: true, discount_sent_at: new Date().toISOString() } as any)
      .eq("id", customer.id);

    // Update local state
    setCustomers(prev =>
      prev.map(c => c.id === customer.id ? { ...c, discount_sent: true, discount_sent_at: new Date().toISOString() } : c)
    );

    toast({
      title: "Sconto inviato!",
      description: `${discountPercent}% di sconto inviato a ${customer.customer_name || customer.customer_phone}`,
    });
    setSendingTo(null);
  };

  const handleSendToAll = async () => {
    const unsent = customers.filter(c => !c.discount_sent);
    for (const c of unsent) {
      await supabase
        .from("customer_activity")
        .update({ discount_sent: true, discount_sent_at: new Date().toISOString() } as any)
        .eq("id", c.id);
    }
    setCustomers(prev =>
      prev.map(c => c.discount_sent ? c : { ...c, discount_sent: true, discount_sent_at: new Date().toISOString() })
    );
    toast({
      title: "Sconti inviati a tutti!",
      description: `${unsent.length} clienti riceveranno il ${discountPercent}% di sconto nel Wallet`,
    });
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
        <p className="text-sm text-muted-foreground mt-1">Rileva clienti inattivi e riportali con sconti automatici nel Wallet</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-secondary/50">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">Soglia inattività</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={7}
              max={90}
              value={inactivityDays}
              onChange={e => setInactivityDays(Number(e.target.value) || 30)}
              className="w-16 px-2 py-2 rounded-lg bg-background text-foreground text-base text-center focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[40px]"
            />
            <span className="text-xs text-muted-foreground">giorni</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-secondary/50">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">Sconto offerto</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={5}
              max={50}
              step={5}
              value={discountPercent}
              onChange={e => setDiscountPercent(Number(e.target.value) || 10)}
              className="w-16 px-2 py-2 rounded-lg bg-background text-foreground text-base text-center focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[40px]"
            />
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
          <p className="text-[10px] text-muted-foreground">Sconti inviati</p>
        </div>
      </div>

      {/* Send all */}
      {unsentCount > 0 && (
        <motion.button
          onClick={handleSendToAll}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 gold-glow min-h-[48px]"
          whileTap={{ scale: 0.97 }}
        >
          <Gift className="w-4 h-4" />
          Invia {discountPercent}% a tutti i {unsentCount} clienti persi
        </motion.button>
      )}

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
            <motion.div
              key={customer.id}
              className={`p-3 rounded-xl flex items-center gap-3 ${
                customer.discount_sent ? "bg-green-500/5 border border-green-500/20" : "bg-secondary/50"
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
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
                  <Check className="w-3 h-3" /> Inviato
                </span>
              ) : (
                <motion.button
                  onClick={() => handleSendDiscount(customer)}
                  disabled={sendingTo === customer.id}
                  className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-[10px] font-medium flex items-center gap-1 min-h-[36px] disabled:opacity-50"
                  whileTap={{ scale: 0.95 }}
                >
                  <Gift className="w-3 h-3" />
                  {discountPercent}%
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
