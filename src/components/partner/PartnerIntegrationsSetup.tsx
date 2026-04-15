import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, ExternalLink, CheckCircle2, AlertCircle, Loader2,
  ChevronDown, ChevronUp, Copy, Shield, Zap, Link2, Wallet,
  Globe, FileText, HelpCircle, ArrowRight, RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Props {
  userId: string;
  userEmail: string;
}

interface StripeStatus {
  connected: boolean;
  onboarding_complete: boolean;
  charges_enabled?: boolean;
  payouts_enabled?: boolean;
  stripe_account_id?: string;
}

/* ── Step Card ── */
function StepCard({ number, title, description, status, children, defaultOpen }: {
  number: number; title: string; description: string;
  status: "pending" | "active" | "done"; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const statusColors = {
    pending: { bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.06)", dot: "#6b7280" },
    active: { bg: "rgba(251,191,36,0.04)", border: "rgba(251,191,36,0.15)", dot: "#fbbf24" },
    done: { bg: "rgba(52,211,153,0.04)", border: "rgba(52,211,153,0.15)", dot: "#34d399" },
  };
  const c = statusColors[status];

  return (
    <div className="rounded-2xl overflow-hidden transition-all" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-4 text-left">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
          style={{ background: status === "done" ? "rgba(52,211,153,0.15)" : "rgba(167,139,250,0.12)", color: status === "done" ? "#34d399" : "#a78bfa" }}>
          {status === "done" ? <CheckCircle2 className="w-4 h-4" /> : number}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground">{title}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{description}</p>
        </div>
        <div className="w-5 h-5 flex items-center justify-center text-muted-foreground">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <div className="px-4 pb-4 pt-1 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Info Pill ── */
function InfoPill({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
      <div className="min-w-0 flex-1">
        <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-xs font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

export default function PartnerIntegrationsSetup({ userId, userEmail }: Props) {
  const [stripeStatus, setStripeStatus] = useState<StripeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const checkStripeStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("partner-connect-onboarding", {
        body: { action: "status", userId },
      });
      if (error) throw error;
      setStripeStatus(data as StripeStatus);
    } catch {
      setStripeStatus({ connected: false, onboarding_complete: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { checkStripeStatus(); }, [userId]);

  const handleConnectStripe = async () => {
    setConnecting(true);
    try {
      const returnUrl = `${window.location.origin}/partner/profile?stripe=success`;
      const refreshUrl = `${window.location.origin}/partner/profile?stripe=refresh`;
      const { data, error } = await supabase.functions.invoke("partner-connect-onboarding", {
        body: { action: "create", userId, email: userEmail, returnUrl, refreshUrl },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
        toast({ title: "📋 Stripe aperto in una nuova scheda", description: "Completa la registrazione e torna qui." });
      }
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    } finally {
      setConnecting(false);
    }
  };

  const handleOpenDashboard = async () => {
    setDashboardLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("partner-connect-onboarding", {
        body: { action: "dashboard", userId },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    } finally {
      setDashboardLoading(false);
    }
  };

  const isStripeComplete = stripeStatus?.onboarding_complete === true;
  const isStripePartial = stripeStatus?.connected && !stripeStatus.onboarding_complete;

  return (
    <div className="space-y-4">
      {/* ═══ HEADER ═══ */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
          <Link2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">Integrazioni & Pagamenti</h3>
          <p className="text-[10px] text-muted-foreground">Configura i tuoi strumenti per ricevere commissioni</p>
        </div>
      </div>

      {/* ═══ STRIPE CONNECT ═══ */}
      <StepCard
        number={1}
        title="Stripe Connect — Ricevi le Commissioni"
        description={isStripeComplete ? "✅ Account verificato e attivo" : isStripePartial ? "⚠️ Registrazione in corso — completa i dati" : "Collega il tuo account per ricevere i pagamenti"}
        status={isStripeComplete ? "done" : isStripePartial ? "active" : "pending"}
        defaultOpen={!isStripeComplete}
      >
        <div className="space-y-3">
          {/* What is Stripe Connect */}
          <div className="p-3 rounded-xl space-y-2" style={{ background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.1)" }}>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#a78bfa" }}>Cos'è Stripe Connect?</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Stripe Connect è la piattaforma di pagamento che usiamo per trasferire le tue <strong className="text-foreground">commissioni (€997 per vendita)</strong> direttamente
              sul tuo conto bancario. È sicuro, gratuito per te, e conforme alle normative europee.
            </p>
          </div>

          {/* Step-by-step guide */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Come funziona:</p>
            {[
              { n: "1", text: "Clicca 'Collega Stripe' — si aprirà il portale Stripe" },
              { n: "2", text: "Inserisci i tuoi dati personali e bancari (IBAN)" },
              { n: "3", text: "Carica un documento d'identità per la verifica" },
              { n: "4", text: "Conferma e torna qui — lo stato si aggiornerà automaticamente" },
            ].map(s => (
              <div key={s.n} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold mt-0.5"
                  style={{ background: "rgba(167,139,250,0.12)", color: "#a78bfa" }}>{s.n}</div>
                <p className="text-[11px] text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>

          {/* Status display */}
          {loading ? (
            <div className="flex items-center gap-2 py-3 justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Controllo stato...</span>
            </div>
          ) : (
            <>
              {isStripeComplete && (
                <div className="grid grid-cols-2 gap-2">
                  <InfoPill icon={CheckCircle2} label="Stato" value="Verificato" color="#34d399" />
                  <InfoPill icon={Wallet} label="Pagamenti" value={stripeStatus?.charges_enabled ? "Attivi" : "In attesa"} color={stripeStatus?.charges_enabled ? "#34d399" : "#fbbf24"} />
                  <InfoPill icon={CreditCard} label="Bonifici" value={stripeStatus?.payouts_enabled ? "Abilitati" : "In attesa"} color={stripeStatus?.payouts_enabled ? "#34d399" : "#fbbf24"} />
                  <InfoPill icon={Shield} label="Sicurezza" value="PCI DSS L1" color="#a78bfa" />
                </div>
              )}

              {isStripePartial && (
                <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}>
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#fbbf24" }} />
                  <div>
                    <p className="text-xs font-medium text-foreground">Registrazione incompleta</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Hai iniziato la registrazione ma non hai completato tutti i passaggi. Clicca sotto per riprendere da dove avevi lasciato.
                    </p>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                {!isStripeComplete && (
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handleConnectStripe} disabled={connecting}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #635BFF, #7B73FF)", color: "#fff" }}>
                    {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                    {isStripePartial ? "Completa Registrazione" : "Collega Stripe"}
                  </motion.button>
                )}

                {isStripeComplete && (
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handleOpenDashboard} disabled={dashboardLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold disabled:opacity-50"
                    style={{ background: "rgba(99,91,255,0.12)", border: "1px solid rgba(99,91,255,0.25)", color: "#7B73FF" }}>
                    {dashboardLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                    Dashboard Stripe
                  </motion.button>
                )}

                <button onClick={() => { setLoading(true); checkStripeStatus(); }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <RefreshCw className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </>
          )}

          {/* Security note */}
          <div className="flex items-start gap-2 p-2.5 rounded-xl" style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.1)" }}>
            <Shield className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#34d399" }} />
            <p className="text-[9px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground">I tuoi dati bancari sono protetti.</strong> Empire non ha mai accesso ai tuoi dati finanziari.
              Tutto è gestito da Stripe, certificato PCI DSS Livello 1.
            </p>
          </div>
        </div>
      </StepCard>

      {/* ═══ COMMISSION STRUCTURE ═══ */}
      <StepCard number={2} title="Struttura Commissioni" description="Come vengono calcolati i tuoi guadagni" status="done">
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            {[
              { label: "Commissione per Vendita", value: "€997", desc: "Per ogni cliente che attivi", color: "#34d399" },
              { label: "Bonus PRO (3+ vendite/mese)", value: "€500", desc: "Bonus mensile automatico", color: "#fbbf24" },
              { label: "Bonus ELITE (5+ vendite/mese)", value: "€1.500", desc: "Bonus mensile premium", color: "#a78bfa" },
              { label: "Override Team Leader", value: "€200", desc: "Per ogni vendita del tuo team", color: "#38bdf8" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <p className="text-xs font-medium text-foreground">{item.label}</p>
                  <p className="text-[9px] text-muted-foreground">{item.desc}</p>
                </div>
                <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-muted-foreground text-center">
            I pagamenti vengono elaborati entro 7 giorni lavorativi dalla conferma del setup del cliente.
          </p>
        </div>
      </StepCard>

      {/* ═══ TOOLS & RESOURCES ═══ */}
      <StepCard number={3} title="Risorse & Strumenti" description="Tutto ciò che ti serve per vendere" status="done">
        <div className="space-y-2">
          {[
            { icon: Globe, label: "Sito Demo Interattivo", desc: "Mostra ai clienti un'anteprima live di Empire", action: "Già integrato nel Portfolio", color: "#34d399" },
            { icon: Zap, label: "LeadEngine Scout", desc: "Trova prospect automaticamente con AI", action: "Disponibile nella Dashboard", color: "#fbbf24" },
            { icon: FileText, label: "Materiali di Vendita", desc: "PDF, presentazioni, brochure digitali", action: "Disponibile nell'Asset Vault", color: "#a78bfa" },
            { icon: CreditCard, label: "Link di Pagamento Setup", desc: "Invia al cliente il link per pagare il setup", action: "Generato automaticamente alla vendita", color: "#38bdf8" },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <item.icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: item.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">{item.label}</p>
                <p className="text-[9px] text-muted-foreground">{item.desc}</p>
                <p className="text-[9px] mt-1 font-medium" style={{ color: item.color }}>→ {item.action}</p>
              </div>
            </div>
          ))}
        </div>
      </StepCard>

      {/* ═══ FAQ ═══ */}
      <StepCard number={4} title="Domande Frequenti" description="Le risposte alle domande più comuni" status="done">
        <div className="space-y-2">
          {[
            { q: "Quando ricevo la mia commissione?", a: "Le commissioni vengono trasferite sul tuo conto Stripe entro 7 giorni lavorativi dalla conferma del pagamento del setup del cliente." },
            { q: "Devo pagare qualcosa per usare Stripe?", a: "No, la creazione dell'account è gratuita. Le commissioni di Stripe (circa 0.25% per bonifico) sono a carico di Empire." },
            { q: "Posso cambiare il conto bancario?", a: "Sì, accedi alla Dashboard Stripe dal pulsante qui sopra e modifica i tuoi dati bancari in qualsiasi momento." },
            { q: "Come funziona il bonus Team Leader?", a: "Quando recluti venditori nel tuo team e loro effettuano vendite, ricevi automaticamente €200 per ogni vendita completata da un membro del tuo team." },
            { q: "Come vedo lo storico dei pagamenti?", a: "Dalla Dashboard Stripe puoi vedere tutti i trasferimenti ricevuti, le date e gli importi." },
          ].map((faq, i) => (
            <details key={i} className="group">
              <summary className="flex items-center gap-2 p-2.5 rounded-xl cursor-pointer list-none"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <HelpCircle className="w-3.5 h-3.5 shrink-0 text-muted-foreground group-open:text-purple-400 transition-colors" />
                <p className="text-xs font-medium text-foreground flex-1">{faq.q}</p>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-4 pb-3 pt-1">
                <p className="text-[11px] text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </StepCard>

      {/* ═══ SUPPORT ═══ */}
      <div className="p-4 rounded-2xl text-center space-y-2" style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.1)" }}>
        <p className="text-xs font-medium text-foreground">Hai bisogno di aiuto?</p>
        <p className="text-[10px] text-muted-foreground">Contatta il supporto partner dedicato</p>
        <a href="mailto:partner@empireaigroup.com"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold transition-colors hover:underline" style={{ color: "#a78bfa" }}>
          partner@empireaigroup.com <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
