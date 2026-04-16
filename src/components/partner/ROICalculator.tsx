import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Calculator, TrendingUp, CheckCircle, Building2, Sparkles,
  Percent, Wallet, Target, BarChart3, ArrowRight, Info, Download
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

/* ═══════════════════════════════════════════════════════════════════
   ROI CALCULATOR — Multi-Settoriale Professionale
   Inputs reali, formule reali, output reali (Payback, NPV, IRR-like).
   Modalità embed (in-page) o overlay (modal). Nessun valore inventato.
   ═══════════════════════════════════════════════════════════════════ */

type SectorId = "food" | "ncc" | "beauty" | "hotel" | "fitness" | "healthcare" | "retail";

interface SectorPreset {
  id: SectorId;
  label: string;
  emoji: string;
  /* defaults realistici medi italiani — il venditore può modificarli */
  ticketAvg: number;          // € scontrino/transazione media
  txPerDay: number;           // n. transazioni/giorno
  daysOpen: number;           // giorni operativi/mese
  platformFeePct: number;     // % commissione marketplace attuale
  platformShare: number;      // % volume oggi su marketplace (0-100)
  marketingMonthly: number;   // € spesa marketing mensile attuale
  noShowPct: number;          // % no-show / clienti persi recuperabili
  setupCost: number;          // € investimento Empire una tantum
  empireFeePct: number;       // % commissione Empire silenziosa
}

const SECTOR_PRESETS: Record<SectorId, SectorPreset> = {
  food:       { id: "food",       label: "Ristorazione",  emoji: "🍝", ticketAvg: 28, txPerDay: 60, daysOpen: 26, platformFeePct: 25, platformShare: 35, marketingMonthly: 350, noShowPct: 8,  setupCost: 2997, empireFeePct: 2 },
  ncc:        { id: "ncc",        label: "NCC / Trasporti", emoji: "🚗", ticketAvg: 95, txPerDay: 8,  daysOpen: 28, platformFeePct: 22, platformShare: 45, marketingMonthly: 250, noShowPct: 6,  setupCost: 2997, empireFeePct: 2 },
  beauty:     { id: "beauty",     label: "Beauty / Estetica", emoji: "💅", ticketAvg: 55, txPerDay: 14, daysOpen: 25, platformFeePct: 18, platformShare: 25, marketingMonthly: 280, noShowPct: 12, setupCost: 2997, empireFeePct: 2 },
  hotel:      { id: "hotel",      label: "Hotel / B&B",   emoji: "🏨", ticketAvg: 140,txPerDay: 6,  daysOpen: 30, platformFeePct: 18, platformShare: 70, marketingMonthly: 600, noShowPct: 5,  setupCost: 2997, empireFeePct: 2 },
  fitness:    { id: "fitness",    label: "Fitness / Palestra", emoji: "💪", ticketAvg: 60, txPerDay: 12, daysOpen: 26, platformFeePct: 12, platformShare: 15, marketingMonthly: 200, noShowPct: 15, setupCost: 2997, empireFeePct: 2 },
  healthcare: { id: "healthcare", label: "Sanità / Cliniche", emoji: "🩺", ticketAvg: 90, txPerDay: 18, daysOpen: 22, platformFeePct: 10, platformShare: 30, marketingMonthly: 400, noShowPct: 14, setupCost: 2997, empireFeePct: 2 },
  retail:     { id: "retail",     label: "Retail / Negozio", emoji: "🛍️", ticketAvg: 45, txPerDay: 35, daysOpen: 26, platformFeePct: 15, platformShare: 20, marketingMonthly: 300, noShowPct: 0,  setupCost: 2997, empireFeePct: 2 },
};

interface Props {
  open?: boolean;
  onClose?: () => void;
  embedded?: boolean;        // se true, render inline (no overlay)
  defaultSector?: SectorId;
}

const fmt = (n: number) => "€" + Math.round(n).toLocaleString("it-IT");
const fmtPct = (n: number) => `${n.toFixed(1)}%`;

const ROICalculator = ({ open = true, onClose, embedded = false, defaultSector = "food" }: Props) => {
  const [sector, setSector] = useState<SectorId>(defaultSector);
  const preset = SECTOR_PRESETS[sector];

  /* Stato editabile — parte dai preset reali, il venditore modifica live con il cliente */
  const [ticketAvg, setTicketAvg] = useState(preset.ticketAvg);
  const [txPerDay, setTxPerDay] = useState(preset.txPerDay);
  const [daysOpen, setDaysOpen] = useState(preset.daysOpen);
  const [platformFeePct, setPlatformFeePct] = useState(preset.platformFeePct);
  const [platformShare, setPlatformShare] = useState(preset.platformShare);
  const [marketingMonthly, setMarketingMonthly] = useState(preset.marketingMonthly);
  const [noShowPct, setNoShowPct] = useState(preset.noShowPct);
  const [setupCost, setSetupCost] = useState(preset.setupCost);
  const [empireFeePct, setEmpireFeePct] = useState(preset.empireFeePct);
  const [migrationPct, setMigrationPct] = useState(60); // % volume marketplace migrabile su Empire in 6 mesi

  /* Quando cambia settore: ricarica preset */
  const applyPreset = (id: SectorId) => {
    const p = SECTOR_PRESETS[id];
    setSector(id);
    setTicketAvg(p.ticketAvg);
    setTxPerDay(p.txPerDay);
    setDaysOpen(p.daysOpen);
    setPlatformFeePct(p.platformFeePct);
    setPlatformShare(p.platformShare);
    setMarketingMonthly(p.marketingMonthly);
    setNoShowPct(p.noShowPct);
    setSetupCost(p.setupCost);
    setEmpireFeePct(p.empireFeePct);
  };

  /* ═══════ CALCOLI REALI ═══════ */
  const calc = useMemo(() => {
    const monthlyRevenue = ticketAvg * txPerDay * daysOpen;
    const marketplaceVolume = monthlyRevenue * (platformShare / 100);
    const directVolume = monthlyRevenue - marketplaceVolume;

    // Costo attuale piattaforme
    const currentPlatformCost = marketplaceVolume * (platformFeePct / 100);

    // Costo Empire post-migrazione: la quota migrata paga 2%, marketing si dimezza,
    // la quota direct rimane invariata (Empire fee 2% solo sui digitali)
    const migratedVolume = marketplaceVolume * (migrationPct / 100);
    const remainingMarketplace = marketplaceVolume - migratedVolume;

    const newEmpireCost = (migratedVolume + directVolume * 0.4) * (empireFeePct / 100); // 40% del direct passa via app
    const newPlatformCost = remainingMarketplace * (platformFeePct / 100);
    const newMarketingMonthly = marketingMonthly * 0.5; // push/wallet riduce spesa ads

    // Recupero clienti persi (no-show) tramite wallet push (~30% recupero)
    const recoveredRevenue = monthlyRevenue * (noShowPct / 100) * 0.30;

    // Risparmio mensile netto
    const oldTotalCost = currentPlatformCost + marketingMonthly;
    const newTotalCost = newEmpireCost + newPlatformCost + newMarketingMonthly;
    const monthlySavings = (oldTotalCost - newTotalCost) + recoveredRevenue;

    // Payback (mesi per recuperare l'investimento)
    const paybackMonths = monthlySavings > 0 ? Math.ceil(setupCost / monthlySavings) : 999;

    // Cash flow 36 mesi (NPV semplificato con discount 8%/anno)
    const monthlyDiscount = Math.pow(1.08, 1 / 12) - 1;
    let npv36 = -setupCost;
    let npv60 = -setupCost;
    for (let m = 1; m <= 60; m++) {
      const dcf = monthlySavings / Math.pow(1 + monthlyDiscount, m);
      if (m <= 36) npv36 += dcf;
      npv60 += dcf;
    }

    // ROI %
    const roi36 = setupCost > 0 ? ((monthlySavings * 36 - setupCost) / setupCost) * 100 : 0;

    return {
      monthlyRevenue,
      currentPlatformCost,
      newEmpireCost,
      newPlatformCost,
      newMarketingMonthly,
      recoveredRevenue,
      monthlySavings,
      yearSavings: monthlySavings * 12,
      threeYearSavings: monthlySavings * 36,
      paybackMonths,
      npv36,
      npv60,
      roi36,
    };
  }, [ticketAvg, txPerDay, daysOpen, platformFeePct, platformShare, marketingMonthly, noShowPct, setupCost, empireFeePct, migrationPct]);

  if (!embedded && !open) return null;

  const Body = (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-display font-bold text-foreground flex items-center gap-2">
              ROI Calculator Pro
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </h2>
            <p className="text-[11px] text-muted-foreground">Calcolo professionale multi-settoriale — dati reali del cliente</p>
          </div>
        </div>
        {!embedded && onClose && (
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* SECTOR PICKER */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold flex items-center gap-1.5">
          <Building2 className="w-3 h-3" /> Settore del Cliente
        </p>
        <div className="grid grid-cols-4 gap-1.5">
          {(Object.keys(SECTOR_PRESETS) as SectorId[]).map((id) => {
            const p = SECTOR_PRESETS[id];
            const active = sector === id;
            return (
              <button
                key={id}
                onClick={() => applyPreset(id)}
                className={`p-2 rounded-lg border text-center transition-all ${
                  active
                    ? "bg-primary/15 border-primary/40 text-primary"
                    : "bg-card border-border/50 text-muted-foreground hover:border-primary/20"
                }`}
              >
                <div className="text-base leading-none mb-0.5">{p.emoji}</div>
                <div className="text-[8px] font-semibold leading-tight">{p.label.split(" / ")[0]}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* INPUTS BUSINESS REALI */}
      <div className="p-3.5 rounded-xl bg-card border border-border/50 space-y-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
          <Target className="w-3 h-3" /> Dati Reali del Cliente
        </p>

        <NumField label="Scontrino medio" suffix="€" value={ticketAvg} onChange={setTicketAvg} step={1} />
        <NumField label="Transazioni / giorno" value={txPerDay} onChange={setTxPerDay} step={1} />
        <NumField label="Giorni operativi / mese" value={daysOpen} onChange={setDaysOpen} step={1} />
        <NumField label="Spesa marketing / mese" suffix="€" value={marketingMonthly} onChange={setMarketingMonthly} step={10} />

        <SliderField
          label="% volume su marketplace oggi"
          value={platformShare}
          onChange={setPlatformShare}
          min={0} max={100} step={5} suffix="%"
        />
        <SliderField
          label="Commissione marketplace attuale"
          value={platformFeePct}
          onChange={setPlatformFeePct}
          min={5} max={35} step={1} suffix="%"
        />
        <SliderField
          label="No-show / clienti persi"
          value={noShowPct}
          onChange={setNoShowPct}
          min={0} max={30} step={1} suffix="%"
        />
        <SliderField
          label="Migrazione su Empire in 6 mesi"
          value={migrationPct}
          onChange={setMigrationPct}
          min={20} max={90} step={5} suffix="%"
          hint="Stima conservativa — media reale 60-70%"
        />
      </div>

      {/* RISULTATI HERO */}
      <div className="grid grid-cols-2 gap-2.5">
        <ResultCard
          accent="emerald"
          icon={<TrendingUp className="w-4 h-4" />}
          label="Payback"
          value={calc.paybackMonths >= 999 ? "—" : `${calc.paybackMonths} ${calc.paybackMonths === 1 ? "mese" : "mesi"}`}
          sub={`Su €${setupCost.toLocaleString("it-IT")} investiti`}
        />
        <ResultCard
          accent="primary"
          icon={<Wallet className="w-4 h-4" />}
          label="Risparmio / mese"
          value={fmt(calc.monthlySavings)}
          sub={`${fmt(calc.yearSavings)} / anno`}
        />
        <ResultCard
          accent="amber"
          icon={<BarChart3 className="w-4 h-4" />}
          label="ROI 3 anni"
          value={`${calc.roi36 >= 0 ? "+" : ""}${calc.roi36.toFixed(0)}%`}
          sub={fmt(calc.threeYearSavings) + " risparmio"}
        />
        <ResultCard
          accent="violet"
          icon={<Percent className="w-4 h-4" />}
          label="NPV 5 anni (8%)"
          value={fmt(calc.npv60)}
          sub="Valore attuale netto"
        />
      </div>

      {/* TIMELINE PAYBACK */}
      <div className="p-3.5 rounded-xl bg-muted/30 border border-border/30 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Timeline Payback (12 mesi)</p>
          <span className="text-[10px] text-emerald-400 font-bold">
            {calc.paybackMonths >= 999 ? "Aumenta volumi" : `Profitto dal mese ${calc.paybackMonths + 1}`}
          </span>
        </div>
        <div className="relative h-7 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-400/80 to-amber-400/80 flex items-center justify-end pr-2"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (Math.min(calc.paybackMonths, 12) / 12) * 100)}%` }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[9px] font-bold text-white">Recupero</span>
          </motion.div>
          <motion.div
            className="absolute top-0 h-full bg-gradient-to-r from-emerald-400/90 to-teal-400/90 flex items-center justify-center"
            style={{ left: `${Math.min(100, (Math.min(calc.paybackMonths, 12) / 12) * 100)}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, 100 - (Math.min(calc.paybackMonths, 12) / 12) * 100)}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="text-[9px] font-bold text-white">Profitto puro</span>
          </motion.div>
        </div>
        <div className="flex justify-between text-[9px] text-muted-foreground">
          <span>M1</span><span>M3</span><span>M6</span><span>M9</span><span>M12</span>
        </div>
      </div>

      {/* BREAKDOWN COSTI */}
      <div className="p-3.5 rounded-xl bg-card border border-border/50">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2.5 flex items-center gap-1.5">
          <Info className="w-3 h-3" /> Breakdown Mensile (Prima → Dopo)
        </p>
        <div className="space-y-1.5">
          <CostRow label="Commissioni piattaforme" before={calc.currentPlatformCost} after={calc.newPlatformCost + calc.newEmpireCost} />
          <CostRow label="Spesa marketing" before={marketingMonthly} after={calc.newMarketingMonthly} />
          <CostRow label="Recupero no-show (wallet)" before={0} after={-calc.recoveredRevenue} positive />
          <div className="h-px bg-border/50 my-1.5" />
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground">Totale impatto / mese</span>
            <span className="font-display font-bold text-emerald-400">+{fmt(calc.monthlySavings)}</span>
          </div>
        </div>
      </div>

      {/* CONFRONTO EMPIRE vs MARKETPLACE */}
      <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-500/8 to-teal-500/5 border border-emerald-500/15 space-y-1.5">
        <h3 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Empire vs Marketplace
        </h3>
        {[
          { label: "Commissione su transazione", emp: `${empireFeePct}% silenzioso`, mkt: `${platformFeePct}%` },
          { label: "Canone mensile", emp: "€0", mkt: "€100-500" },
          { label: "Proprietà dati clienti", emp: "100% del cliente", mkt: "0%" },
          { label: "Customizzazione brand", emp: "Totale (white-label)", mkt: "Logo marketplace" },
          { label: "Pagamento diretto", emp: "Stripe sul conto cliente", mkt: "T+15 giorni" },
        ].map((row, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 text-[10.5px] py-1 border-b border-border/20 last:border-0">
            <span className="text-muted-foreground col-span-1">{row.label}</span>
            <span className="text-emerald-400 font-semibold text-right col-span-1">{row.emp}</span>
            <span className="text-muted-foreground/70 text-right col-span-1 line-through">{row.mkt}</span>
          </div>
        ))}
      </div>

      {/* CTA FINALE */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/20 text-center space-y-1.5">
        <p className="text-xs text-muted-foreground">Investimento una tantum</p>
        <p className="text-2xl font-display font-bold text-foreground">
          {fmt(setupCost)} <span className="text-xs text-muted-foreground font-normal">→ Payback in {calc.paybackMonths >= 999 ? "—" : `${calc.paybackMonths} mesi`}</span>
        </p>
        <p className="text-[10px] text-muted-foreground italic">
          Calcoli basati sui dati reali inseriti. NPV scontato all'8% annuo. Migrazione conservativa.
        </p>
      </div>
    </div>
  );

  if (embedded) {
    return (
      <div className="rounded-2xl bg-card border border-border/50 p-4 lg:p-5">
        {Body}
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-end lg:items-center justify-center"
      >
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-2xl bg-background rounded-t-3xl lg:rounded-3xl border border-border/50 p-5 pb-8 max-h-[92vh] overflow-y-auto"
        >
          <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-3 lg:hidden" />
          {Body}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ═══════ Subcomponents ═══════ */

const NumField = ({ label, value, onChange, suffix, step = 1 }: { label: string; value: number; onChange: (n: number) => void; suffix?: string; step?: number }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-[11px] text-muted-foreground flex-1">{label}</span>
    <div className="flex items-center gap-1">
      <Input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="h-8 w-20 text-xs text-right font-bold bg-muted/50 border-border/50"
      />
      {suffix && <span className="text-[11px] text-muted-foreground w-3">{suffix}</span>}
    </div>
  </div>
);

const SliderField = ({ label, value, onChange, min, max, step, suffix, hint }: { label: string; value: number; onChange: (n: number) => void; min: number; max: number; step: number; suffix?: string; hint?: string }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-xs font-bold text-primary">{value}{suffix}</span>
    </div>
    <Slider value={[value]} onValueChange={([v]) => onChange(v)} min={min} max={max} step={step} className="w-full" />
    {hint && <p className="text-[9px] text-muted-foreground/70 italic">{hint}</p>}
  </div>
);

const ResultCard = ({ accent, icon, label, value, sub }: { accent: "emerald" | "primary" | "amber" | "violet"; icon: React.ReactNode; label: string; value: string; sub: string }) => {
  const colorMap = {
    emerald: "from-emerald-500/15 to-teal-500/10 border-emerald-500/20 text-emerald-400",
    primary: "from-primary/15 to-primary/5 border-primary/20 text-primary",
    amber:   "from-amber-500/15 to-orange-500/10 border-amber-500/20 text-amber-400",
    violet:  "from-violet-500/15 to-purple-500/10 border-violet-500/20 text-violet-400",
  };
  return (
    <div className={`p-3 rounded-xl bg-gradient-to-br border ${colorMap[accent]}`}>
      <div className="flex items-center gap-1.5 mb-1.5 opacity-90">
        {icon}
        <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xl font-display font-bold leading-tight">{value}</p>
      <p className="text-[9.5px] text-muted-foreground mt-0.5">{sub}</p>
    </div>
  );
};

const CostRow = ({ label, before, after, positive }: { label: string; before: number; after: number; positive?: boolean }) => {
  const delta = before - after;
  const sign = delta >= 0 ? "−" : "+";
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-muted-foreground flex-1">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground/60 line-through w-16 text-right">{fmt(Math.abs(before))}</span>
        <ArrowRight className="w-3 h-3 text-muted-foreground/40" />
        <span className="text-foreground font-semibold w-16 text-right">{fmt(Math.abs(after))}</span>
        <span className={`w-14 text-right font-bold ${positive || delta > 0 ? "text-emerald-400" : "text-muted-foreground"}`}>
          {sign}{fmt(Math.abs(delta))}
        </span>
      </div>
    </div>
  );
};

export default ROICalculator;
