import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coins, Play, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface DemoCreditsWalletProps {
  userId?: string;
}

const DemoCreditsWallet = ({ userId }: DemoCreditsWalletProps) => {
  const [credits, setCredits] = useState(0);
  const [activeSession, setActiveSession] = useState<{ expires_at: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [spending, setSpending] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetchCredits();
  }, [userId]);

  const fetchCredits = async () => {
    if (!userId) return;
    setLoading(true);
    
    const { data: creditData } = await supabase
      .from("partner_demo_credits" as any)
      .select("balance")
      .eq("user_id", userId)
      .maybeSingle();
    
    setCredits((creditData as any)?.balance || 0);

    // Check for active sandbox session (not expired)
    const { data: usage } = await supabase
      .from("demo_credit_usage" as any)
      .select("expires_at")
      .eq("user_id", userId)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1);

    if (usage && (usage as any[]).length > 0) {
      setActiveSession({ expires_at: (usage as any[])[0].expires_at });
    } else {
      setActiveSession(null);
    }
    
    setLoading(false);
  };

  const handleUnlockSandbox = async () => {
    if (!userId || credits <= 0 || spending) return;
    setSpending(true);

    try {
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      // Deduct credit
      const { error: updateErr } = await supabase
        .from("partner_demo_credits" as any)
        .update({ balance: credits - 1, updated_at: new Date().toISOString() } as any)
        .eq("user_id", userId);
      if (updateErr) throw updateErr;

      // Log usage
      const { error: insertErr } = await supabase
        .from("demo_credit_usage" as any)
        .insert({ user_id: userId, action: "sandbox_unlock", credits_used: 1, expires_at: expiresAt } as any);
      if (insertErr) throw insertErr;

      toast({ title: "🎟️ Sandbox Sbloccata!", description: "Accesso completo per 24 ore. Mostra tutto al cliente!" });
      fetchCredits();
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    } finally {
      setSpending(false);
    }
  };

  const getTimeRemaining = () => {
    if (!activeSession) return null;
    const diff = new Date(activeSession.expires_at).getTime() - Date.now();
    if (diff <= 0) return null;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  const timeRemaining = getTimeRemaining();

  if (loading) {
    return (
      <div className="p-5 rounded-2xl bg-card border border-border/50 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-card via-card to-amber-500/5 border border-amber-500/20 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Coins className="w-4 h-4 text-amber-400" /> Demo Credits
        </h3>
        <span className="text-2xl font-display font-bold text-amber-400">{credits}</span>
      </div>

      {timeRemaining ? (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-emerald-400">Sandbox Attiva</p>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> Scade tra {timeRemaining}
            </p>
          </div>
        </div>
      ) : (
        <motion.button
          onClick={handleUnlockSandbox}
          disabled={credits <= 0 || spending}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-500/20 transition-all"
          whileTap={{ scale: 0.97 }}
        >
          {spending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {credits > 0 
            ? "Sblocca Sandbox 24h (1 credito)" 
            : "Nessun credito disponibile"
          }
        </motion.button>
      )}

      <p className="text-[10px] text-muted-foreground text-center">
        Ogni credito sblocca AI Menu, Kitchen View e tutte le funzionalità per 24 ore.
      </p>
    </div>
  );
};

export default DemoCreditsWallet;
