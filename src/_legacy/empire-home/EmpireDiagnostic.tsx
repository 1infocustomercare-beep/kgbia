import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { INDUSTRIES } from "@/data/industries";
import {
  Sparkles, Brain, Calculator, Layers, ClipboardList,
  Loader2, ArrowRight, CheckCircle2, TrendingUp, Clock, Target, AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

type Mode = "diagnostic" | "roi" | "sectors" | "custom";

interface DiagnosticResult {
  diagnosis?: string;
  rootCauses?: string[];
  solution?: string;
  features?: string[];
  recommendedPlan?: string;
  estimatedMonthlyGain?: string;
  timeToValue?: string;
  nextStep?: string;
}

// Pre-baked sector problems (quick chips)
const SECTOR_PROBLEMS: Record<string, string[]> = {
  food: ["Pochi coperti infrasettimanali", "Recensioni negative", "Costo del personale alto", "Niente prenotazioni online"],
  ncc: ["Auto ferme nei weekend", "Tariffe non competitive", "Prenotazioni perse al telefono", "Niente cross-selling"],
  beauty: ["Cancellazioni last-minute", "Clienti che non tornano", "Agenda piena ma incasso basso", "Niente promemoria automatici"],
  healthcare: ["Pazienti dimenticano appuntamenti", "Telefono sempre occupato", "Cartelle disorganizzate", "Niente teleconsulto"],
  retail: ["E-commerce locale fermo", "Magazzino sempre sbagliato", "Niente loyalty", "Recensioni inesistenti"],
  fitness: ["Disdette abbonamenti", "Sala vuota a certi orari", "Niente personalizzazione coach", "Recupero ex-clienti zero"],
  hospitality: ["OTA mangiano margini", "Recensioni medie", "Camere vuote in bassa stagione", "Upselling assente"],
};
const DEFAULT_PROBLEMS = [
  "Troppe ore al telefono",
  "Marketing che non converte",
  "Recensioni e reputazione",
  "Niente automazione",
];

export default function EmpireDiagnostic() {
  const [mode, setMode] = useState<Mode>("diagnostic");

  // Diagnostic state
  const [sector, setSector] = useState<string>("food");
  const [problem, setProblem] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  // ROI state
  const [revenue, setRevenue] = useState<number>(20000);
  const [staffCost, setStaffCost] = useState<number>(6000);
  const [hoursAdmin, setHoursAdmin] = useState<number>(20);

  // Custom questionnaire
  const [cName, setCName] = useState("");
  const [cBusiness, setCBusiness] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cText, setCText] = useState("");
  const [cSubmitting, setCSubmitting] = useState(false);
  const [cDone, setCDone] = useState(false);

  const problems = SECTOR_PROBLEMS[sector] ?? DEFAULT_PROBLEMS;

  const runDiagnosis = async () => {
    if (!problem.trim()) {
      toast.error("Descrivi o seleziona un problema");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("empire-diagnostic", {
        body: { mode: "diagnostic", sector, problem },
      });
      if (error) throw error;
      if (data?.error === "rate_limited") {
        toast.error("Troppe richieste, riprova tra un minuto");
        return;
      }
      setResult(data?.result ?? {});
    } catch (e) {
      toast.error("Errore diagnosi. Riprova.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const submitCustom = async () => {
    if (!cEmail && !cPhone) {
      toast.error("Inserisci email o telefono per essere ricontattato");
      return;
    }
    setCSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("empire-diagnostic", {
        body: {
          mode: "custom",
          sector,
          businessName: cBusiness || cName,
          email: cEmail,
          phone: cPhone,
          freeText: cText,
        },
      });
      if (error) throw error;
      setResult(data?.result ?? {});
      setCDone(true);
      toast.success("Richiesta ricevuta! Ti ricontattiamo entro 24h");
    } catch (e) {
      toast.error("Errore invio. Riprova.");
    } finally {
      setCSubmitting(false);
    }
  };

  // ROI calculations: Empire saves ~40% admin time + 15% revenue uplift typical
  const monthlySaving = Math.round(staffCost * 0.4 + revenue * 0.12);
  const yearlySaving = monthlySaving * 12;
  const empireCost = 297; // Pro plan default
  const roiMultiple = (monthlySaving / empireCost).toFixed(1);

  return (
    <section
      id="empire-diagnostic"
      className="relative w-full py-24 md:py-32 bg-[#0d0d0d] overflow-hidden"
    >
      {/* Gold orbital glow */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-3xl"
             style={{ background: "radial-gradient(circle, rgba(201,168,76,0.18), transparent 60%)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <Badge variant="outline" className="mb-4 border-[#c9a84c]/40 text-[#f0d78c] bg-[#c9a84c]/5">
            <Sparkles className="w-3 h-3 mr-1" /> Diagnosi AI
          </Badge>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Dimmi il tuo <span className="bg-gradient-to-r from-[#c9a84c] to-[#f0d78c] bg-clip-text text-transparent">problema</span>.
            <br /> Empire ti dà la <span className="italic">soluzione</span>.
          </h2>
          <p className="font-body text-base md:text-lg text-white/60 max-w-2xl mx-auto">
            25+ settori, 1 piattaforma. Scopri in 30 secondi quale pacchetto Empire
            risolve davvero il tuo business — o costruiamone uno su misura.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: "diagnostic", icon: Brain, label: "Diagnostica AI" },
            { id: "roi", icon: Calculator, label: "Calcolatore ROI" },
            { id: "sectors", icon: Layers, label: "I 25 settori" },
            { id: "custom", icon: ClipboardList, label: "Pacchetto su misura" },
          ].map((t) => {
            const Icon = t.icon;
            const active = mode === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setMode(t.id as Mode)}
                className={`font-body inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all border ${
                  active
                    ? "bg-gradient-to-r from-[#c9a84c] to-[#f0d78c] text-[#0d0d0d] border-[#c9a84c] shadow-[0_0_30px_rgba(201,168,76,0.4)]"
                    : "bg-white/5 text-white/80 border-white/10 hover:border-[#c9a84c]/40 hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl p-6 md:p-10 shadow-2xl">
          <AnimatePresence mode="wait">
            {/* === DIAGNOSTIC === */}
            {mode === "diagnostic" && (
              <motion.div
                key="diag"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="grid md:grid-cols-2 gap-8"
              >
                {/* Input side */}
                <div>
                  <Label className="font-body text-white/80 mb-2 block">1. Il tuo settore</Label>
                  <div className="flex flex-wrap gap-2 mb-6 max-h-40 overflow-y-auto pr-2">
                    {INDUSTRIES.slice(0, 16).map((ind) => (
                      <button
                        key={ind.id}
                        onClick={() => { setSector(ind.id); setProblem(""); setResult(null); }}
                        className={`font-body text-xs px-3 py-1.5 rounded-full border transition ${
                          sector === ind.id
                            ? "bg-[#c9a84c] text-[#0d0d0d] border-[#c9a84c]"
                            : "bg-white/5 text-white/70 border-white/10 hover:border-[#c9a84c]/40"
                        }`}
                      >
                        {ind.label}
                      </button>
                    ))}
                  </div>

                  <Label className="font-body text-white/80 mb-2 block">2. Il tuo problema</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {problems.map((p) => (
                      <button
                        key={p}
                        onClick={() => setProblem(p)}
                        className={`font-body text-xs px-3 py-1.5 rounded-full border transition ${
                          problem === p
                            ? "bg-white text-[#0d0d0d] border-white"
                            : "bg-white/5 text-white/70 border-white/10 hover:border-white/30"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <Textarea
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="Oppure scrivi qui il tuo problema specifico…"
                    className="font-body bg-black/40 border-white/10 text-white placeholder:text-white/30 min-h-[100px] mb-4"
                  />
                  <Button
                    onClick={runDiagnosis}
                    disabled={loading}
                    className="font-body w-full bg-gradient-to-r from-[#c9a84c] to-[#f0d78c] text-[#0d0d0d] hover:opacity-90 font-semibold h-12 text-base"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analisi in corso…</>
                    ) : (
                      <><Sparkles className="w-4 h-4 mr-2" /> Genera soluzione AI</>
                    )}
                  </Button>
                </div>

                {/* Result side */}
                <div className="min-h-[400px]">
                  {!result && !loading && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-white/10">
                      <Brain className="w-12 h-12 text-[#c9a84c]/40 mb-4" />
                      <p className="font-body text-white/40 text-sm">
                        La tua diagnosi personalizzata apparirà qui.<br />
                        Seleziona settore + problema, poi clicca Genera.
                      </p>
                    </div>
                  )}
                  {loading && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <Loader2 className="w-10 h-10 text-[#c9a84c] animate-spin mb-4" />
                      <p className="font-body text-white/60 text-sm">L'AI di Empire sta analizzando il tuo caso…</p>
                    </div>
                  )}
                  {result && <DiagnosticCard r={result} />}
                </div>
              </motion.div>
            )}

            {/* === ROI === */}
            {mode === "roi" && (
              <motion.div
                key="roi"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="grid md:grid-cols-2 gap-8"
              >
                <div className="space-y-5">
                  <h3 className="font-display text-2xl text-white font-semibold mb-2">Quanto stai perdendo senza Empire?</h3>
                  <p className="font-body text-white/60 text-sm mb-4">Inserisci 3 numeri reali, scopri il tuo guadagno mensile stimato.</p>

                  <div>
                    <Label className="font-body text-white/80">Fatturato mensile attuale</Label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Input
                        type="number" value={revenue} onChange={(e) => setRevenue(+e.target.value || 0)}
                        className="font-body bg-black/40 border-white/10 text-white"
                      />
                      <span className="font-body text-white/40">€</span>
                    </div>
                  </div>
                  <div>
                    <Label className="font-body text-white/80">Costo mensile staff amministrativo</Label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Input
                        type="number" value={staffCost} onChange={(e) => setStaffCost(+e.target.value || 0)}
                        className="font-body bg-black/40 border-white/10 text-white"
                      />
                      <span className="font-body text-white/40">€</span>
                    </div>
                  </div>
                  <div>
                    <Label className="font-body text-white/80">Ore/settimana spese in telefono, agenda, social</Label>
                    <Input
                      type="number" value={hoursAdmin} onChange={(e) => setHoursAdmin(+e.target.value || 0)}
                      className="font-body bg-black/40 border-white/10 text-white mt-1.5"
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-[#c9a84c]/15 to-[#c9a84c]/5 border border-[#c9a84c]/30 p-6 flex flex-col justify-between">
                  <div>
                    <p className="font-body text-xs uppercase tracking-widest text-[#f0d78c] mb-2">Stima risparmio</p>
                    <div className="font-display text-5xl md:text-6xl font-bold text-white mb-1">
                      +€{monthlySaving.toLocaleString("it-IT")}
                    </div>
                    <p className="font-body text-white/60 text-sm mb-6">al mese con Empire Pro</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <Stat icon={TrendingUp} label="Risparmio annuo" value={`€${yearlySaving.toLocaleString("it-IT")}`} />
                      <Stat icon={Target} label="ROI vs costo Empire" value={`${roiMultiple}x`} />
                      <Stat icon={Clock} label="Ore liberate/mese" value={`${Math.round(hoursAdmin * 4 * 0.6)}h`} />
                      <Stat icon={CheckCircle2} label="Piano consigliato" value="Growth AI" />
                    </div>
                  </div>
                  <Button asChild className="font-body bg-gradient-to-r from-[#c9a84c] to-[#f0d78c] text-[#0d0d0d] hover:opacity-90 font-semibold h-12">
                    <Link to="/auth">Inizia ora — senza impegno <ArrowRight className="w-4 h-4 ml-2" /></Link>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* === SECTORS === */}
            {mode === "sectors" && (
              <motion.div
                key="sec"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              >
                <h3 className="font-display text-2xl text-white font-semibold mb-2">Empire copre 25+ settori verticali</h3>
                <p className="font-body text-white/60 text-sm mb-6">Clicca il tuo per vedere features, demo e caso reale.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {INDUSTRIES.map((ind) => (
                    <Link
                      key={ind.id}
                      to={`/auth?sector=${ind.id}`}
                      className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/5 transition-all"
                    >
                      <div className="font-display text-sm text-white font-semibold mb-1 group-hover:text-[#f0d78c]">{ind.label}</div>
                      <div className="font-body text-[11px] text-white/50 line-clamp-2">{ind.description}</div>
                    </Link>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Button asChild variant="outline" className="font-body border-[#c9a84c]/40 text-[#f0d78c] hover:bg-[#c9a84c]/10">
                    <a href="#sectors-carousel">Esplora portfolio completo <ArrowRight className="w-4 h-4 ml-2" /></a>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* === CUSTOM QUESTIONNAIRE === */}
            {mode === "custom" && (
              <motion.div
                key="cus"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              >
                {!cDone ? (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-display text-2xl text-white font-semibold mb-2">Pacchetto su misura</h3>
                      <p className="font-body text-white/60 text-sm mb-6">
                        Nessun pacchetto standard ti convince? Raccontaci il tuo business: l'AI di Empire
                        progetta una configurazione cucita addosso a te in &lt;24h.
                      </p>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="font-body text-white/80">Il tuo nome</Label>
                            <Input value={cName} onChange={(e) => setCName(e.target.value)} className="font-body bg-black/40 border-white/10 text-white mt-1.5" />
                          </div>
                          <div>
                            <Label className="font-body text-white/80">Nome attività</Label>
                            <Input value={cBusiness} onChange={(e) => setCBusiness(e.target.value)} className="font-body bg-black/40 border-white/10 text-white mt-1.5" />
                          </div>
                        </div>
                        <div>
                          <Label className="font-body text-white/80">Settore</Label>
                          <select
                            value={sector} onChange={(e) => setSector(e.target.value)}
                            className="font-body w-full mt-1.5 h-10 rounded-md bg-black/40 border border-white/10 text-white px-3"
                          >
                            {INDUSTRIES.map((i) => <option key={i.id} value={i.id} className="bg-[#0d0d0d]">{i.label}</option>)}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="font-body text-white/80">Email</Label>
                            <Input type="email" value={cEmail} onChange={(e) => setCEmail(e.target.value)} className="font-body bg-black/40 border-white/10 text-white mt-1.5" />
                          </div>
                          <div>
                            <Label className="font-body text-white/80">Telefono / WhatsApp</Label>
                            <Input value={cPhone} onChange={(e) => setCPhone(e.target.value)} className="font-body bg-black/40 border-white/10 text-white mt-1.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <Label className="font-body text-white/80 mb-2">Cosa ti serve veramente?</Label>
                      <Textarea
                        value={cText} onChange={(e) => setCText(e.target.value)}
                        placeholder="Es. ho 3 sedi, mi serve gestione multi-punto + agente vocale che prende prenotazioni in 2 lingue + integrazione con il mio gestionale X…"
                        className="font-body bg-black/40 border-white/10 text-white placeholder:text-white/30 flex-1 min-h-[200px] mb-4"
                      />
                      <Button
                        onClick={submitCustom}
                        disabled={cSubmitting}
                        className="font-body bg-gradient-to-r from-[#c9a84c] to-[#f0d78c] text-[#0d0d0d] hover:opacity-90 font-semibold h-12"
                      >
                        {cSubmitting ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Invio…</>
                        ) : (
                          <><ClipboardList className="w-4 h-4 mr-2" /> Progetta il mio Empire</>
                        )}
                      </Button>
                      <p className="font-body text-[11px] text-white/40 mt-3 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Risposta entro 24h. Nessun impegno.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 text-[#c9a84c] mx-auto mb-4" />
                    <h3 className="font-display text-3xl text-white font-bold mb-2">Richiesta ricevuta</h3>
                    <p className="font-body text-white/60 mb-6">Ti ricontattiamo entro 24h con la tua configurazione su misura.</p>
                    {result && <div className="max-w-xl mx-auto text-left"><DiagnosticCard r={result} /></div>}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function DiagnosticCard({ r }: { r: DiagnosticResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl bg-gradient-to-br from-[#c9a84c]/15 via-white/[0.03] to-transparent border border-[#c9a84c]/30 p-6 space-y-4"
    >
      {r.diagnosis && (
        <div>
          <p className="font-body text-xs uppercase tracking-widest text-[#f0d78c] mb-1">Diagnosi</p>
          <p className="font-display text-lg text-white font-semibold leading-snug">{r.diagnosis}</p>
        </div>
      )}
      {r.rootCauses && r.rootCauses.length > 0 && (
        <div>
          <p className="font-body text-xs uppercase tracking-widest text-white/40 mb-2">Cause radice</p>
          <ul className="space-y-1.5">
            {r.rootCauses.map((c, i) => (
              <li key={i} className="font-body text-sm text-white/80 flex gap-2">
                <span className="text-[#c9a84c]">·</span>{c}
              </li>
            ))}
          </ul>
        </div>
      )}
      {r.solution && (
        <div>
          <p className="font-body text-xs uppercase tracking-widest text-white/40 mb-1">Soluzione Empire</p>
          <p className="font-body text-sm text-white/90 leading-relaxed">{r.solution}</p>
        </div>
      )}
      {r.features && r.features.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {r.features.map((f, i) => (
            <Badge key={i} variant="outline" className="font-body text-[11px] border-[#c9a84c]/30 text-[#f0d78c] bg-[#c9a84c]/5">
              {f}
            </Badge>
          ))}
        </div>
      )}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
        {r.recommendedPlan && (
          <div>
            <p className="font-body text-[10px] uppercase text-white/40">Piano</p>
            <p className="font-display text-sm text-white font-bold">{r.recommendedPlan}</p>
          </div>
        )}
        {r.estimatedMonthlyGain && (
          <div>
            <p className="font-body text-[10px] uppercase text-white/40">Guadagno/mese</p>
            <p className="font-display text-sm text-[#f0d78c] font-bold">{r.estimatedMonthlyGain}</p>
          </div>
        )}
        {r.timeToValue && (
          <div>
            <p className="font-body text-[10px] uppercase text-white/40">Time-to-value</p>
            <p className="font-display text-sm text-white font-bold">{r.timeToValue}</p>
          </div>
        )}
      </div>
      <Button asChild className="font-body w-full bg-gradient-to-r from-[#c9a84c] to-[#f0d78c] text-[#0d0d0d] hover:opacity-90 font-semibold mt-2">
        <Link to="/auth">{r.nextStep || "Inizia ora"} <ArrowRight className="w-4 h-4 ml-2" /></Link>
      </Button>
    </motion.div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/10 p-3">
      <Icon className="w-4 h-4 text-[#c9a84c] mb-1" />
      <p className="font-body text-[10px] uppercase tracking-wide text-white/40">{label}</p>
      <p className="font-display text-base text-white font-bold leading-tight">{value}</p>
    </div>
  );
}
