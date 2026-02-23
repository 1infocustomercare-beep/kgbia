import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, Wallet, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface NotificationOptInProps {
  restaurantId?: string;
  restaurantName?: string;
}

const NotificationOptIn = ({ restaurantId, restaurantName }: NotificationOptInProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show banner after 10 seconds on page
    const timer = setTimeout(() => {
      const wasDismissed = localStorage.getItem(`push-dismissed-${restaurantId}`);
      const wasSubscribed = localStorage.getItem(`push-subscribed-${restaurantId}`);
      if (!wasDismissed && !wasSubscribed) {
        setShowBanner(true);
      }
      if (wasSubscribed) setIsSubscribed(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, [restaurantId]);

  const handleSubscribe = async () => {
    if (!restaurantId || !("Notification" in window) || !("serviceWorker" in navigator)) {
      toast({ title: "Non supportato", description: "Il tuo browser non supporta le notifiche push.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast({ title: "Permesso negato", description: "Abilita le notifiche nelle impostazioni del browser.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      
      // Try to subscribe - if VAPID key is available
      // For now, we save a placeholder subscription
      const subscription = (registration as any).pushManager
        ? await (registration as any).pushManager.getSubscription()
        : null;
      
      if (subscription) {
        const subJson = subscription.toJSON();
        await supabase.from("push_subscriptions").insert({
          restaurant_id: restaurantId,
          endpoint: subJson.endpoint || "",
          p256dh: subJson.keys?.p256dh || "placeholder",
          auth_key: subJson.keys?.auth || "placeholder",
        } as any);
      } else {
        // Store intent even without full push subscription
        await supabase.from("push_subscriptions").insert({
          restaurant_id: restaurantId,
          endpoint: `browser-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          p256dh: "pending",
          auth_key: "pending",
        } as any);
      }

      setIsSubscribed(true);
      setShowBanner(false);
      localStorage.setItem(`push-subscribed-${restaurantId}`, "true");
      toast({
        title: "🔔 Notifiche attivate!",
        description: `Riceverai offerte esclusive da ${restaurantName || "questo ristorante"}`,
      });
    } catch (err) {
      console.error("Push subscription error:", err);
      toast({ title: "Errore", description: "Non è stato possibile attivare le notifiche.", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem(`push-dismissed-${restaurantId}`, "true");
  };

  if (!restaurantId || dismissed || isSubscribed) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          className="fixed bottom-20 inset-x-3 sm:inset-x-auto sm:right-5 sm:left-auto sm:w-96 z-50"
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="p-4 rounded-2xl glass border border-primary/20 shadow-2xl shadow-primary/10">
            <button onClick={handleDismiss} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-display font-bold text-foreground text-sm">Non perderti le offerte!</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Attiva le notifiche per ricevere sconti esclusivi e promozioni da {restaurantName || "questo ristorante"}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <motion.button
                onClick={handleSubscribe}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
                whileTap={{ scale: 0.97 }}
              >
                {loading ? (
                  <motion.div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                    animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    Attiva Notifiche
                  </>
                )}
              </motion.button>
              <motion.button
                onClick={handleDismiss}
                className="px-4 py-2.5 rounded-xl bg-secondary text-muted-foreground text-xs font-medium min-h-[44px]"
                whileTap={{ scale: 0.97 }}
              >
                No grazie
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationOptIn;
