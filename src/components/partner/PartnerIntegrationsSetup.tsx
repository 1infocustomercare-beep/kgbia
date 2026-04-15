import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, CheckCircle2,
  ChevronDown, ChevronUp, Shield, Zap, Link2, Wallet,
  Globe, FileText, HelpCircle, BanknoteIcon, BadgeEuro
} from "lucide-react";

interface Props {
  userId: string;
  userEmail: string;
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

export default function PartnerIntegrationsSetup({ userId, userEmail }: Props) {
  return (
    <div className="space-y-4">
      {/* ═══ HEADER ═══ */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
          <Link2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">Pagamenti & Commissioni</h3>
          <p className="text-[10px] text-muted-foreground">Come ricevi i tuoi guadagni da Empire</p>
        </div>
      </div>

      {/* ═══ COME FUNZIONANO I PAGAMENTI ═══ */}
      <StepCard
        number={1}
        title="Come Ricevi le Commissioni"
        description="Il sistema di pagamento è gestito centralmente da Empire"
        status="done"
        defaultOpen={true}
      >
        <div className="space-y-3">
          <div className="p-3 rounded-xl space-y-2" style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.12)" }}>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#34d399" }}>💰 Pagamenti Centralizzati</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Tutti i pagamenti dei clienti vengono processati <strong className="text-foreground">direttamente dall'account Stripe di Empire</strong>.
              Non devi configurare nessun account di pagamento personale.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Come funziona il flusso:</p>
            {[
              { n: "1", text: "Il cliente paga il setup tramite il link generato dalla tua vendita", icon: "💳" },
              { n: "2", text: "Il pagamento arriva sull'account Stripe centrale di Empire", icon: "🏦" },
              { n: "3", text: "Empire verifica il pagamento e conferma il setup", icon: "✅" },
              { n: "4", text: "La tua commissione viene calcolata automaticamente", icon: "📊" },
              { n: "5", text: "Ricevi il bonifico bancario entro 7 giorni lavorativi", icon: "💸" },
            ].map(s => (
              <div key={s.n} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold mt-0.5"
                  style={{ background: "rgba(167,139,250,0.12)", color: "#a78bfa" }}>{s.n}</div>
                <p className="text-[11px] text-muted-foreground"><span className="mr-1">{s.icon}</span>{s.text}</p>
              </div>
            ))}
          </div>

          {/* Info dati bancari */}
          <div className="p-3 rounded-xl space-y-2" style={{ background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.1)" }}>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#a78bfa" }}>📋 Per ricevere i bonifici</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Assicurati di avere il tuo <strong className="text-foreground">IBAN</strong> e i <strong className="text-foreground">dati intestatario</strong> aggiornati
              nel tuo profilo. Il team Empire ti contatterà per completare i dati di fatturazione prima del primo pagamento.
            </p>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-xl" style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.1)" }}>
            <Shield className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#34d399" }} />
            <p className="text-[9px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Pagamenti sicuri e tracciabili.</strong> Ogni transazione è registrata e visibile nel tuo pannello guadagni.
              Empire gestisce tutta la compliance fiscale e le certificazioni di pagamento.
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
            I pagamenti vengono elaborati entro 7 giorni lavorativi dalla conferma del pagamento del setup del cliente.
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
            { q: "Quando ricevo la mia commissione?", a: "Le commissioni vengono trasferite sul tuo conto bancario entro 7 giorni lavorativi dalla conferma del pagamento del setup del cliente." },
            { q: "Devo configurare Stripe o un sistema di pagamento?", a: "No. Tutti i pagamenti sono gestiti centralmente da Empire. Tu devi solo fornire il tuo IBAN e i dati per la fatturazione." },
            { q: "Come posso controllare i miei guadagni?", a: "Dalla sezione 'Guadagni' nella tua dashboard puoi vedere tutte le commissioni maturate, i bonus e lo storico dei pagamenti." },
            { q: "Come funziona il bonus Team Leader?", a: "Quando recluti venditori nel tuo team e loro effettuano vendite, ricevi automaticamente €200 per ogni vendita completata da un membro del tuo team." },
            { q: "Chi gestisce la fatturazione verso i clienti?", a: "Empire gestisce tutta la fatturazione verso i clienti finali. Tu ricevi un compenso per la tua attività commerciale con relativa documentazione fiscale." },
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
        <a href="mailto:info@empireaigroup.com"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors"
          style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>
          📧 info@empireaigroup.com
        </a>
      </div>
    </div>
  );
}
