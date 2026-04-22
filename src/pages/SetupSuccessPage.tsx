import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, Loader2, Crown } from "lucide-react";
import empireLogoNew from "@/assets/empire-logo-new.png";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 30; // 60 sec max

const SetupSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { user } = useAuth();

  const [status, setStatus] = useState<"polling" | "ready" | "timeout">("polling");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }
    if (!sessionId) {
      navigate("/checkout-setup", { replace: true });
      return;
    }

    let cancelled = false;
    let attempt = 0;

    const poll = async () => {
      while (!cancelled && attempt < MAX_POLL_ATTEMPTS) {
        attempt++;
        setAttempts(attempt);
        try {
          const [{ data: paidRestaurant }, { data: paidCompany }] = await Promise.all([
            supabase.from("restaurants").select("id").eq("owner_id", user.id).eq("setup_paid", true).limit(1).maybeSingle(),
            supabase.from("companies").select("id").eq("owner_id", user.id).eq("setup_paid", true).limit(1).maybeSingle(),
          ]);
          if (paidRestaurant || paidCompany) {
            if (!cancelled) {
              setStatus("ready");
              await supabase.auth.refreshSession();
              setTimeout(() => navigate("/app", { replace: true }), 1500);
            }
            return;
          }
        } catch (err) {
          console.warn("[SetupSuccess] poll error", err);
        }
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      }
      if (!cancelled) setStatus("timeout");
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [user, sessionId, navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "linear-gradient(180deg, hsl(228 22% 6%) 0%, hsl(230 20% 8%) 100%)" }}
    >
      <div className="text-center max-w-md">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <img
            src={empireLogoNew}
            alt="Empire"
            className="w-10 h-10 rounded-full object-cover border border-primary/30"
          />
          <span className="font-heading font-bold tracking-wider uppercase text-foreground">EMPIRE</span>
        </div>

        {status === "polling" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-3">
              Conferma del pagamento in corso...
            </h1>
            <p className="text-foreground/65 text-sm">
              Stripe sta confermando l'addebito. Non chiudere questa pagina.
            </p>
            <p className="text-foreground/45 text-xs mt-4">
              Tentativo {attempts}/{MAX_POLL_ATTEMPTS}
            </p>
          </motion.div>
        )}

        {status === "ready" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <div className="w-20 h-20 rounded-full bg-primary/15 border-2 border-primary flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_hsl(var(--primary)/0.4)]">
              <Check className="w-10 h-10 text-primary" strokeWidth={3} />
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-3">
              Pagamento confermato!
            </h1>
            <p className="text-foreground/65 text-sm">
              Il tuo account Empire AI è ora attivo. Reindirizzamento alla dashboard...
            </p>
          </motion.div>
        )}

        {status === "timeout" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-amber-400" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-3">
              Pagamento ricevuto, attivazione in corso
            </h1>
            <p className="text-foreground/65 text-sm mb-6">
              La conferma da Stripe sta richiedendo qualche minuto. Riceverai un'email appena l'account è attivo, oppure ricarica questa pagina tra poco.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-heading font-bold tracking-wider uppercase text-xs"
            >
              Ricarica
            </button>
            <p className="mt-6 text-xs text-foreground/45">
              Problemi?{" "}
              <a href="mailto:info@empireaigroup.com" className="text-primary underline">
                info@empireaigroup.com
              </a>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SetupSuccessPage;
