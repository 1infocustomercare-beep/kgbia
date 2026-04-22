import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Crown, Check, Loader2, AlertTriangle, Lock, CreditCard } from "lucide-react";
import empireLogoNew from "@/assets/empire-logo-new.png";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type PlanKey = "digital_start" | "smart_ia" | "full_empire";

const PLANS: Array<{
  key: PlanKey;
  name: string;
  price1x: number;
  price3x: number;
  price6x: number;
  features: string[];
  recommended?: boolean;
}> = [
  {
    key: "digital_start",
    name: "Digital Start",
    price1x: 1997,
    price3x: 666,
    price6x: 333,
    features: [
      "App White Label completa",
      "Menu / Catalogo QR illimitato",
      "Ordini & Prenotazioni",
      "Dashboard Analytics base",
      "Setup & Onboarding guidato",
    ],
  },
  {
    key: "smart_ia",
    name: "Smart IA",
    price1x: 2997,
    price3x: 1099,
    price6x: 549,
    recommended: true,
    features: [
      "Tutto Digital Start",
      "5 Agenti AI essenziali",
      "WhatsApp operativo",
      "Voice Agent Arianna",
      "Onboarding guidato premium",
    ],
  },
  {
    key: "full_empire",
    name: "Full Empire",
    price1x: 4997,
    price3x: 1832,
    price6x: 916,
    features: [
      "Tutto Smart IA",
      "Agenti AI premium illimitati",
      "Voice Agent multi-canale",
      "Supporto dedicato 24/7",
      "Personalizzazione avanzata",
    ],
  },
];

const SetupCheckoutPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cancelled = searchParams.get("cancelled") === "1";
  const presetPlan = (searchParams.get("plan") as PlanKey | null) ?? null;
  const { user, signOut } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<PlanKey>(
    presetPlan && PLANS.find((p) => p.key === presetPlan) ? presetPlan : "smart_ia"
  );
  const [installments, setInstallments] = useState<1 | 3 | 6>(1);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const plan = useMemo(() => PLANS.find((p) => p.key === selectedPlan)!, [selectedPlan]);
  const displayPrice = installments === 1 ? plan.price1x : installments === 3 ? plan.price3x : plan.price6x;

  // ── Verify user actually has a pending entity (avoid showing this page if already paid) ──
  useEffect(() => {
    if (!user) return;
    let isCancelled = false;
    (async () => {
      try {
        const [{ data: paidRestaurant }, { data: paidCompany }] = await Promise.all([
          supabase.from("restaurants").select("id").eq("owner_id", user.id).eq("setup_paid", true).limit(1).maybeSingle(),
          supabase.from("companies").select("id").eq("owner_id", user.id).eq("setup_paid", true).limit(1).maybeSingle(),
        ]);
        if (isCancelled) return;
        if (paidRestaurant || paidCompany) navigate("/app", { replace: true });
      } catch (err) {
        console.warn("[SetupCheckout] paid check failed", err);
      } finally {
        if (!isCancelled) setCheckingStatus(false);
      }
    })();
    return () => { isCancelled = true; };
  }, [user, navigate]);

  const handleCheckout = async () => {
    if (!user) {
      toast({ title: "Devi essere registrato", description: "Reindirizzamento al login..." });
      navigate("/auth", { replace: true });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("setup-checkout", {
        body: { plan: selectedPlan, installments },
      });

      if (error) throw error;
      if (!data?.checkout_url) throw new Error("Nessun URL di checkout ricevuto");

      // Redirect to Stripe
      window.location.href = data.checkout_url;
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast({
        title: "Errore checkout",
        description: err.message || "Riprova più tardi o contatta il supporto.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, hsl(228 22% 6%) 0%, hsl(230 20% 8%) 100%)" }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, hsl(265 60% 50%), transparent 65%)", filter: "blur(140px)" }}
        />
        <div
          className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsl(210 80% 55%), transparent 70%)", filter: "blur(160px)" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 px-5 py-4 flex items-center justify-between max-w-3xl mx-auto">
        <div className="flex items-center gap-2.5">
          <img
            src={empireLogoNew}
            alt="Empire"
            className="w-8 h-8 rounded-full object-cover border border-primary/30"
          />
          <span className="font-heading font-bold text-sm tracking-wider uppercase text-foreground">
            EMPIRE
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Esci
        </button>
      </header>

      <div className="relative z-10 px-5 pt-6 pb-16 max-w-3xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Lock className="w-4 h-4 text-primary" />
            <span className="text-[0.65rem] font-heading font-bold tracking-[2px] uppercase text-primary">
              Setup richiesto
            </span>
          </div>
          <h1 className="text-[clamp(1.75rem,5vw,2.75rem)] font-heading font-bold text-foreground leading-tight mb-3">
            Completa il setup<br />per accedere alla dashboard
          </h1>
          <p className="text-foreground/65 text-sm max-w-md mx-auto">
            Per attivare il tuo account Empire AI con tutti gli agenti operativi, completa il pagamento del setup iniziale.
          </p>
        </motion.div>

        {cancelled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl border border-destructive/30 bg-destructive/10 flex gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-destructive font-semibold">Pagamento annullato</p>
              <p className="text-foreground/70 mt-0.5">
                Nessun addebito effettuato. Riprova quando vuoi.
              </p>
            </div>
          </motion.div>
        )}

        {/* Plan selector */}
        <div className="space-y-3 mb-6">
          {PLANS.map((p) => {
            const isSelected = p.key === selectedPlan;
            return (
              <motion.button
                key={p.key}
                onClick={() => setSelectedPlan(p.key)}
                whileTap={{ scale: 0.99 }}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/[0.07] shadow-[0_0_30px_hsl(var(--primary)/0.15)]"
                    : "border-border/30 bg-card/30 hover:border-border/60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-foreground text-base">{p.name}</h3>
                    {p.recommended && (
                      <span className="text-[0.6rem] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                        Consigliato
                      </span>
                    )}
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? "border-primary bg-primary" : "border-border/50"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />}
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-heading font-bold text-foreground">
                    €{p.price1x.toLocaleString("it-IT")}
                  </span>
                  <span className="text-xs text-foreground/55">una tantum · oppure rate</span>
                </div>
                <ul className="space-y-1 mt-3">
                  {p.features.slice(0, 3).map((f) => (
                    <li key={f} className="text-xs text-foreground/70 flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.button>
            );
          })}
        </div>

        {/* Installments selector */}
        <div className="mb-6">
          <p className="text-xs font-heading font-bold uppercase tracking-wider text-foreground/55 mb-2">
            Modalità di pagamento
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[1, 3, 6].map((n) => {
              const isSelected = installments === n;
              const price = n === 1 ? plan.price1x : n === 3 ? plan.price3x : plan.price6x;
              return (
                <button
                  key={n}
                  onClick={() => setInstallments(n as 1 | 3 | 6)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/[0.07]"
                      : "border-border/30 bg-card/30 hover:border-border/60"
                  }`}
                >
                  <div className="text-xs font-bold text-foreground">
                    {n === 1 ? "Una tantum" : `Rate ${n}x`}
                  </div>
                  <div className="text-base font-heading font-bold text-primary mt-0.5">
                    €{price.toLocaleString("it-IT")}
                  </div>
                  {n > 1 && <div className="text-[0.65rem] text-foreground/50 mt-0.5">/mese</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.button
          onClick={handleCheckout}
          disabled={loading}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl bg-vibrant-gradient text-primary-foreground font-heading font-bold tracking-wider uppercase text-sm shadow-[0_8px_32px_hsl(var(--primary)/0.35)] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Apertura checkout...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Paga €{displayPrice.toLocaleString("it-IT")} {installments > 1 && "ora"}
            </>
          )}
        </motion.button>

        <div className="mt-4 flex items-center justify-center gap-2 text-[0.65rem] text-foreground/45">
          <Lock className="w-3 h-3" />
          <span>Pagamento sicuro Stripe · SSL 256-bit · Nessun dato carta salvato</span>
        </div>

        <p className="mt-6 text-center text-xs text-foreground/55">
          Hai domande? Contatta{" "}
          <a href="mailto:info@empireaigroup.com" className="text-primary underline">
            info@empireaigroup.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default SetupCheckoutPage;
