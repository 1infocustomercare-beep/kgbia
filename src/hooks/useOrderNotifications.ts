import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const NOTIFICATION_SOUND_FREQUENCY = 880; // A5 note
const NOTIFICATION_DURATION = 300; // ms

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = "sine";
    
    // Play two quick beeps
    const now = ctx.currentTime;
    oscillator.frequency.setValueAtTime(NOTIFICATION_SOUND_FREQUENCY, now);
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + NOTIFICATION_DURATION / 1000);
    
    oscillator.frequency.setValueAtTime(NOTIFICATION_SOUND_FREQUENCY * 1.25, now + 0.15);
    gainNode.gain.setValueAtTime(0.3, now + 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15 + NOTIFICATION_DURATION / 1000);

    oscillator.start(now);
    oscillator.stop(now + 0.5);
  } catch {
    // AudioContext not available, skip sound
  }
}

export function useOrderNotifications(restaurantId: string | undefined, onNewOrder?: () => void) {
  const knownOrderIds = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  const handleNewOrder = useCallback((payload: any) => {
    const newOrder = payload.new;
    if (!newOrder || payload.eventType !== "INSERT") return;

    // Skip initial load
    if (!initialized.current) return;

    // Skip if already seen
    if (knownOrderIds.current.has(newOrder.id)) return;
    knownOrderIds.current.add(newOrder.id);

    // Play sound
    playNotificationSound();

    // Show toast
    const orderType = newOrder.order_type === "table" 
      ? `Tavolo ${newOrder.table_number || "?"}` 
      : newOrder.order_type === "delivery" 
        ? "Delivery" 
        : "Asporto";

    toast({
      title: `🔔 Nuovo ordine! — ${orderType}`,
      description: `${newOrder.customer_name || "Cliente"} · €${Number(newOrder.total).toFixed(2)}`,
    });

    onNewOrder?.();
  }, [onNewOrder]);

  useEffect(() => {
    if (!restaurantId) return;

    // Mark as initialized after a short delay to skip existing orders
    const initTimer = setTimeout(() => {
      initialized.current = true;
    }, 2000);

    const channel = supabase
      .channel(`order-notifications-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        handleNewOrder
      )
      .subscribe();

    return () => {
      clearTimeout(initTimer);
      initialized.current = false;
      supabase.removeChannel(channel);
    };
  }, [restaurantId, handleNewOrder]);
}
