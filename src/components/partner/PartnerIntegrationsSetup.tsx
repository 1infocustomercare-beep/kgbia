import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, ExternalLink, CheckCircle2, AlertCircle, Loader2,
  ChevronDown, ChevronUp, Shield, Zap, Link2, Wallet,
  Globe, FileText, HelpCircle, RefreshCw, PieChart, ArrowRight
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
    pending: { bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.06)" },
    active: { bg: "rgba(251,191,36,0.04)", border: "rgba(251,191,36,0.15)" },
    done: { bg: "rgba(52,211,153,0.04)", border: "rgba(52,211,153,0.15)" },
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
          <h3 className="text-base font-bold text-foreground">Pagamenti Automatici & Split</h3>
          <p className="text-[10px] text-muted-foreground">Collegati a Stripe per ricevere commissioni in automatico</p>
        </div>
      </div>

      {/* ═══ COME FUNZIONA LO SPLIT ═══ */}
      <StepCard
        number={1}
        title="Come Funziona lo Split Automatico"
        description="Ogni pagamento viene suddiviso automaticamente da Stripe"
        status="done"
        defaultOpen={false}
      >
        <div className="space-y-3">
          <div className="p-3 rounded-xl space-y-2" style={{ background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.1)" }}>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#a78bfa" }}>💰 Pagamento Automatico Split</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Quando il tuo cliente paga il setup tramite il tuo link, <strong className="text-foreground">Stripe divide automaticamente</strong> il denaro
              tra tutte le parti coinvolte. Non devi fare nulla manualmente.
            </p>
          </div>

          {/* Visual split breakdown */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Suddivisione per vendita (es. Setup €1.997):</p>
            {[
              { label: "La tua Commissione", amount: "€997", pct: "49.9%", color: "#34d399", desc: "Accreditata sul tuo conto Stripe" },
              { label: "Empire Platform", amount: "€800", pct: "40.1%", color: "#a78bfa", desc: "Gestione piattaforma e servizi" },
              { label: "Override Team Leader", amount: "€200", pct: "10%", color: "#38bdf8", desc: "Se hai un TL, va al tuo referente" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 p-2.5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="w-2 h-8 rounded-full shrink-0" style={{ background: item.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-foreground">{item.label}</p>
                    <span className="text-xs font-bold" style={{ color: item.color }}>{item.amount}</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground">{item.desc} • {item.pct}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-xl" style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.1)" }}>
            <PieChart className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#34d399" }} />
            <p className="text-[9px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Tutto è automatico.</strong> Appena il cliente paga, Stripe trasferisce la tua commissione
              direttamente sul tuo conto in 2-7 giorni lavorativi. Nessuna azione richiesta da parte tua.
            </p>
          </div>
        </div>
      </StepCard>

      {/* ═══ STRIPE CONNECT ═══ */}
      <StepCard
        number={2}
        title="Collega il Tuo Account Stripe"
        description={isStripeComplete ? "✅ Account verificato e attivo — ricevi pagamenti automatici" : isStripePartial ? "⚠️ Registrazione in corso — completa i dati" : "Obbligatorio per ricevere le commissioni in automatico"}
        status={isStripeComplete ? "done" : isStripePartial ? "active" : "pending"}
        defaultOpen={!isStripeComplete}
      >
        <div className="space-y-3">
          {/* What is Stripe Connect */}
          <div className="p-3 rounded-xl space-y-2" style={{ background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.1)" }}>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#a78bfa" }}>Perché devo collegare Stripe?</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Stripe Connect è il sistema che permette di <strong className="text-foreground">ricevere automaticamente la tua parte</strong> ogni volta che un cliente paga.
              Senza questo collegamento, dovremmo fare bonifici manuali — più lento e meno sicuro.
            </p>
          </div>

          {/* Step-by-step guide */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Procedura (5 minuti):</p>
            {[
              { n: "1", text: "Clicca 'Collega Stripe' qui sotto — si apre il portale sicuro Stripe", icon: "🔗" },
              { n: "2", text: "Inserisci i tuoi dati personali (nome, cognome, data di nascita)", icon: "👤" },
              { n: "3", text: "Aggiungi il tuo IBAN per ricevere i pagamenti sul tuo conto", icon: "🏦" },
              { n: "4", text: "Carica un documento d'identità (carta d'identità o passaporto)", icon: "📄" },
              { n: "5", text: "Conferma e torna qui — lo stato si aggiorna automaticamente", icon: "✅" },
            ].map(s => (
              <div key={s.n} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold mt-0.5"
                  style={{ background: "rgba(167,139,250,0.12)", color: "#a78bfa" }}>{s.n}</div>
                <p className="text-[11px] text-muted-foreground"><span className="mr-1">{s.icon}</span>{s.text}</p>
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
                      Hai iniziato ma non hai completato. Clicca sotto per riprendere — ci vogliono solo 2 minuti.
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
              <strong className="text-foreground">I tuoi dati bancari sono al sicuro.</strong> Empire non ha mai accesso ai tuoi dati finanziari.
              Stripe è certificato PCI DSS Livello 1, lo stesso standard usato dalle banche.
            </p>
          </div>
        </div>
      </StepCard>

      {/* ═══ COMMISSION & BONUS STRUCTURE ═══ */}
      <StepCard number={3} title="Commissioni & Bonus Automatici" description="Tutto viene calcolato e accreditato in automatico" status="done">
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            {[
              { label: "Commissione per Vendita", value: "€997", desc: "Accreditata automaticamente sul tuo Stripe", color: "#34d399", auto: true },
              { label: "Bonus PRO (3+ vendite/mese)", value: "+€500", desc: "Bonus mensile calcolato a fine mese", color: "#fbbf24", auto: true },
              { label: "Bonus ELITE (5+ vendite/mese)", value: "+€1.500", desc: "Bonus mensile premium", color: "#a78bfa", auto: true },
              { label: "Override Team Leader", value: "+€200", desc: "Per ogni vendita dei tuoi sotto-venditori", color: "#38bdf8", auto: true },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-medium text-foreground">{item.label}</p>
                    {item.auto && <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: "rgba(52,211,153,0.1)", color: "#34d399" }}>AUTO</span>}
                  </div>
                  <p className="text-[9px] text-muted-foreground">{item.desc}</p>
                </div>
                <span className="text-sm font-bold shrink-0 ml-2" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl" style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.1)" }}>
            <p className="text-[10px] font-bold text-foreground mb-1">📊 Esempio: 5 vendite in un mese</p>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">5 × €997 commissioni</span><span className="text-foreground font-medium">€4.985</span></div>
              <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Bonus ELITE</span><span className="text-foreground font-medium">€1.500</span></div>
              <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Override team (es. 3 vendite)</span><span className="text-foreground font-medium">€600</span></div>
              <div className="h-px my-1" style={{ background: "rgba(255,255,255,0.1)" }} />
              <div className="flex justify-between text-xs font-bold"><span style={{ color: "#34d399" }}>Totale Mensile</span><span style={{ color: "#34d399" }}>€7.085</span></div>
            </div>
          </div>
        </div>
      </StepCard>

      {/* ═══ TOOLS & RESOURCES ═══ */}
      <StepCard number={4} title="Risorse & Strumenti" description="Tutto ciò che ti serve per vendere" status="done">
        <div className="space-y-2">
          {[
            { icon: Globe, label: "Sito Demo Interattivo", desc: "Mostra ai clienti un'anteprima live di Empire", action: "Già integrato nel Portfolio", color: "#34d399" },
            { icon: Zap, label: "LeadEngine Scout", desc: "Trova prospect automaticamente con AI", action: "Disponibile nella Dashboard", color: "#fbbf24" },
            { icon: FileText, label: "Materiali di Vendita", desc: "PDF, presentazioni, brochure digitali", action: "Disponibile nell'Asset Vault", color: "#a78bfa" },
            { icon: CreditCard, label: "Link di Pagamento", desc: "Il cliente paga e lo split avviene in automatico", action: "Generato alla vendita", color: "#38bdf8" },
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
      <StepCard number={5} title="Domande Frequenti" description="Le risposte alle domande più comuni" status="done">
        <div className="space-y-2">
          {[
            { q: "Come funziona lo split automatico?", a: "Quando il cliente paga tramite il tuo link, Stripe divide automaticamente l'importo: la tua commissione va sul tuo conto Stripe, l'override al Team Leader, e il resto a Empire. Tutto in un'unica transazione." },
            { q: "Quanto tempo ci vuole per ricevere i soldi?", a: "La tua commissione arriva sul tuo conto bancario in 2-7 giorni lavorativi dal pagamento del cliente. Stripe gestisce tutto automaticamente." },
            { q: "Devo pagare qualcosa per Stripe?", a: "No, la creazione dell'account è gratuita. Le commissioni di Stripe (circa 1.4% + €0.25 per transazione) sono a carico di Empire." },
            { q: "Posso vedere tutti i pagamenti ricevuti?", a: "Sì! Dalla Dashboard Stripe (pulsante sopra) vedi lo storico completo di tutti i trasferimenti, date e importi." },
            { q: "E se sono un Team Leader?", a: "Come TL ricevi sia la tua commissione diretta (€997) che l'override (€200) per ogni vendita del tuo team. Entrambi arrivano automaticamente sul tuo Stripe." },
            { q: "Posso cambiare il mio conto bancario?", a: "Sì, accedi alla Dashboard Stripe e modifica i dati bancari in qualsiasi momento." },
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
        <p className="text-xs font-medium text-foreground">Hai bisogno di aiuto con Stripe?</p>
        <p className="text-[10px] text-muted-foreground">Il team ti guida passo passo nella configurazione</p>
        <a href="mailto:info@empireaigroup.com"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors"
          style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>
          📧 info@empireaigroup.com
        </a>
      </div>
    </div>
  );
}
