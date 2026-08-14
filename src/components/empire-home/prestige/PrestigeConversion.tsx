import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle, Phone, Users, CalendarX, ShieldCheck, ShieldAlert, Lock, Sparkles,
  ArrowRight, Check, X, MessageSquare, Bot, Calendar, Star, Clock, Send, ChevronDown,
  Plug, BrainCircuit, Rocket, BadgePercent, Zap
} from "lucide-react";
import { useT } from "./PrestigeLang";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LEGAL, PRICING_LEGAL_NOTE_IT, PRICING_LEGAL_NOTE_EN } from "@/config/legal";

/* ============================================================
 *  Prestige Conversion Suite — ADDITIVE
 *  Riusa tipografia, card, CTA del PrestigeTheme.
 *  Bilingue via useT(). Nessuna nuova dipendenza pesante.
 * ============================================================ */

const SectionEyebrow = ({ index, children }: { index: string; children: React.ReactNode }) => (
  <div className="prestige-eyebrow-indexed" data-index={index} style={{ color: "hsl(var(--pr-gold-light))" }}>
    {children}
  </div>
);

/* ─── 1. PROBLEMA / AGITAZIONE ─────────────────────────────── */
export function PrestigeProblem() {
  const t = useT();
  const pains = [
    { icon: Phone, k: { it: "Telefono sempre occupato", en: "Phone constantly busy" }, d: { it: "1 chiamata persa = 1 cliente che va dal tuo concorrente.", en: "1 missed call = 1 customer going to your competitor." } },
    { icon: CalendarX, k: { it: "Prenotazioni perse di notte", en: "Lost bookings overnight" }, d: { it: "Il 38% delle prenotazioni arriva fuori orario. Tu dormi, loro chiamano altrove.", en: "38% of bookings come after hours. You sleep, they call elsewhere." } },
    { icon: Users, k: { it: "Staff costoso e instabile", en: "Expensive, unstable staff" }, d: { it: "Una receptionist costa €1.800/mese. Si ammala, va in ferie, sbaglia.", en: "A receptionist costs €1,800/month. Gets sick, takes holidays, makes mistakes." } },
    { icon: AlertTriangle, k: { it: "Recensioni che bruciano", en: "Reviews that burn" }, d: { it: "Risposte lente = stelle in meno. Google ti penalizza. I clienti scrollano.", en: "Slow replies = fewer stars. Google penalises you. Customers scroll past." } },
  ];

  return (
    <section data-section="prestige-problem" className="prestige-section prestige-dark py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-5 lg:px-10">
        <div className="max-w-3xl">
          <SectionEyebrow index="01">{t({ it: "Il problema reale", en: "The real problem" })}</SectionEyebrow>
          <h2 className="prestige-display mt-4 text-3xl sm:text-5xl lg:text-6xl">
            {t({ it: "Mentre leggi questo, ", en: "While you read this, " })}
            <span className="prestige-gold-text italic">{t({ it: "stai perdendo clienti.", en: "you're losing customers." })}</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
            {t({
              it: "Non è una metafora. Ogni squillo non risposto, ogni messaggio ignorato, ogni richiesta evasa in ritardo è un cliente che oggi compra da qualcun altro.",
              en: "It's not a metaphor. Every unanswered ring, every ignored message, every late reply is a customer buying from someone else today.",
            })}
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pains.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.k.it} className="prestige-card">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "hsl(0 75% 55% / 0.15)", color: "hsl(0 80% 70%)" }}>
                  <Icon size={20} />
                </div>
                <h3 className="prestige-display mt-4 text-lg sm:text-xl">{t(p.k)}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>{t(p.d)}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-10 rounded-2xl border p-5 sm:p-6" style={{ borderColor: "hsl(var(--pr-gold) / 0.4)", background: "hsl(var(--pr-emerald-mid) / 0.5)" }}>
          <div className="flex items-start gap-3">
            <Sparkles size={20} style={{ color: "hsl(var(--pr-gold-light))" }} className="mt-1 shrink-0" />
            <p className="text-base sm:text-lg" style={{ color: "hsl(var(--pr-text-on-dark))" }}>
              <strong>{t({ it: "Empire è la soluzione.", en: "Empire is the solution." })}</strong>{" "}
              {t({
                it: "Un sistema AI che risponde, prenota, vende e ti riporta i clienti — 24/7, in più lingue, senza staff aggiuntivo.",
                en: "An AI system that answers, books, sells and brings customers back — 24/7, multilingual, with zero extra staff.",
              })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 2. COME FUNZIONA in 3 step ───────────────────────────── */
export function PrestigeHowItWorks() {
  const t = useT();
  const steps = [
    { icon: Plug, n: "01", k: { it: "Onboarding 7 giorni", en: "7-day onboarding" }, d: { it: "Ci dai accesso al tuo sito, telefono e WhatsApp. Pensiamo a tutto noi.", en: "You give us access to your site, phone and WhatsApp. We handle the rest." } },
    { icon: BrainCircuit, n: "02", k: { it: "Addestriamo la tua AI", en: "We train your AI" }, d: { it: "L'AI impara il tuo menu, i prezzi, gli orari, il tuo tono di voce. Diventa un membro del team.", en: "The AI learns your menu, prices, hours, your tone of voice. It becomes a team member." } },
    { icon: Rocket, n: "03", k: { it: "Vai live in 7 giorni", en: "Go live in 7 days" }, d: { it: "Sito, app, AI, WhatsApp e pagamenti attivi. Tu guardi i numeri salire dalla dashboard.", en: "Site, app, AI, WhatsApp and payments live. You watch the numbers rise from the dashboard." } },
  ];

  return (
    <section data-section="prestige-how" className="prestige-section prestige-light py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-5 lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <SectionEyebrow index="02">{t({ it: "Come funziona", en: "How it works" })}</SectionEyebrow>
          <h2 className="prestige-display mt-4 text-3xl sm:text-5xl" style={{ color: "hsl(var(--pr-text-on-light))" }}>
            {t({ it: "Tre passi. ", en: "Three steps. " })}
            <span className="prestige-gold-text italic">{t({ it: "Zero complicazioni.", en: "Zero hassle." })}</span>
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3 relative">
          <div aria-hidden className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--pr-gold) / 0.6), transparent)" }} />
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.n} className="prestige-card text-center" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "linear-gradient(135deg, hsl(var(--pr-emerald)), hsl(var(--pr-emerald-deep)))", color: "hsl(var(--pr-gold-light))", boxShadow: "0 8px 24px -8px hsl(var(--pr-gold) / 0.4)" }}>
                  <Icon size={26} />
                </div>
                <div className="prestige-eyebrow mt-4" style={{ color: "hsl(var(--pr-gold-deep))" }}>{s.n}</div>
                <h3 className="prestige-display mt-2 text-xl sm:text-2xl" style={{ color: "hsl(var(--pr-text-on-light))" }}>{t(s.k)}</h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "hsl(var(--pr-muted-on-light))" }}>{t(s.d)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── 3. ARIANNA DEMO HIGHLIGHT ────────────────────────────── */
export function PrestigeAriannaDemo({ onTalk }: { onTalk?: () => void }) {
  const t = useT();
  return (
    <section data-section="prestige-arianna" className="prestige-section prestige-dark py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-5 lg:px-10">
        <div className="prestige-card-gilt relative overflow-hidden p-6 sm:p-10 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <SectionEyebrow index="03">{t({ it: "Provala in 30 secondi", en: "Try it in 30 seconds" })}</SectionEyebrow>
              <h2 className="prestige-display mt-4 text-3xl sm:text-5xl">
                {t({ it: "Parla con ", en: "Talk to " })}
                <span className="prestige-gold-text italic">Arianna</span>
                {t({ it: ", la nostra AI venditrice.", en: ", our AI saleswoman." })}
              </h2>
              <p className="mt-4 text-base sm:text-lg" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
                {t({
                  it: "Non è una demo finta. È la stessa AI che risponderebbe ai tuoi clienti. Chiedile qualunque cosa sulla tua azienda — capisce tutto, in italiano.",
                  en: "It's not a fake demo. It's the same AI that would answer your customers. Ask her anything about your business — she gets it all, in English.",
                })}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button className="prestige-cta justify-center w-full sm:w-auto" onClick={onTalk}>
                  <Bot size={16} /> <span>{t({ it: "Parla con Arianna ora", en: "Talk to Arianna now" })}</span>
                </button>
                <a className="prestige-cta-ghost justify-center w-full sm:w-auto" href="#prestige-lead">
                  <Calendar size={14} /> <span>{t({ it: "Prenota una demo live", en: "Book a live demo" })}</span>
                </a>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="relative aspect-square max-w-[280px] mx-auto rounded-full" style={{ background: "radial-gradient(circle, hsl(var(--pr-gold) / 0.35), transparent 70%)" }}>
                <div className="absolute inset-6 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--pr-emerald)), hsl(var(--pr-emerald-deep)))", border: "1px solid hsl(var(--pr-gold) / 0.5)" }}>
                  <Bot size={80} style={{ color: "hsl(var(--pr-gold-light))" }} />
                </div>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="absolute inset-0 rounded-full border" style={{ borderColor: "hsl(var(--pr-gold) / 0.3)", animation: `prestige-pulse-ring 3s ${i * 0.6}s ease-out infinite` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes prestige-pulse-ring {
          0% { transform: scale(.85); opacity: .8; }
          100% { transform: scale(1.2); opacity: 0; }
        }
      `}</style>
    </section>
  );
}

/* ─── 4. CASE STUDIES (esempi etichettati) ─────────────────── */
export function PrestigeCases() {
  const t = useT();
  const cases = [
    { sector: { it: "Pizzeria · Milano", en: "Pizzeria · Milan" }, result: "+37%", metric: { it: "prenotazioni in 90gg", en: "bookings in 90d" }, story: { it: "Telefono AI attivo H24. Zero serate vuote, anche di martedì.", en: "24/7 AI phone. No empty nights, even on Tuesdays." } },
    { sector: { it: "NCC · Costa Smeralda", en: "NCC · Costa Smeralda" }, result: "+62%", metric: { it: "corse VIP estive", en: "summer VIP rides" }, story: { it: "Centralino multilingua per turisti. Più corse, zero attese.", en: "Multilingual switchboard for tourists. More rides, zero waits." } },
    { sector: { it: "Studio Legale · Roma", en: "Law Firm · Rome" }, result: "−60%", metric: { it: "tempo al telefono", en: "phone time" }, story: { it: "AI filtra richieste e prenota consulenze. 10h/sett recuperate.", en: "AI filters requests and books consultations. 10h/wk reclaimed." } },
  ];

  return (
    <section data-section="prestige-cases" className="prestige-section prestige-dark py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-5 lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <SectionEyebrow index="04">{t({ it: "Esempi di risultati", en: "Sample results" })}</SectionEyebrow>
          <h2 className="prestige-display mt-4 text-3xl sm:text-5xl">
            {t({ it: "Numeri reali. ", en: "Real numbers. " })}
            <span className="prestige-gold-text italic">{t({ it: "Aziende vere.", en: "Real businesses." })}</span>
          </h2>
          <p className="mt-4 text-sm" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
            {t({ it: "Dati medi osservati sui clienti Empire. Risultati individuali possono variare.", en: "Average metrics observed on Empire customers. Individual results may vary." })}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {cases.map((c) => (
            <div key={c.sector.it} className="prestige-card-gilt relative">
              <span className="absolute right-4 top-4 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest" style={{ background: "hsl(var(--pr-gold) / 0.15)", color: "hsl(var(--pr-gold-light))", border: "1px solid hsl(var(--pr-gold) / 0.3)" }}>
                {t({ it: "esempio", en: "example" })}
              </span>
              <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-light))" }}>{t(c.sector)}</div>
              <div className="prestige-display mt-3 text-5xl sm:text-6xl prestige-gold-text">{c.result}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em]" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>{t(c.metric)}</div>
              <p className="mt-5 text-sm leading-relaxed" style={{ color: "hsl(var(--pr-text-on-dark))" }}>{t(c.story)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 5. ROI CALCULATOR ───────────────────────────────────── */
export function PrestigeRoiCalculator() {
  const t = useT();
  const [callsPerDay, setCalls] = useState(40);
  const [avgValue, setAvg] = useState(45);
  const [missedRate, setMissed] = useState(25);

  const data = useMemo(() => {
    const monthlyCalls = callsPerDay * 26;
    const missed = Math.round((monthlyCalls * missedRate) / 100);
    const recovered = Math.round(missed * 0.7);
    const extraRevenue = recovered * avgValue;
    const staffSaved = 1800;
    const empireCost = 297;
    const netGain = extraRevenue + staffSaved - empireCost;
    return { missed, recovered, extraRevenue, staffSaved, empireCost, netGain };
  }, [callsPerDay, avgValue, missedRate]);

  const fmtEur = (n: number) => new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  return (
    <section data-section="prestige-roi" className="prestige-section prestige-light py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-5 lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <SectionEyebrow index="05">{t({ it: "Calcolatore ROI", en: "ROI Calculator" })}</SectionEyebrow>
          <h2 className="prestige-display mt-4 text-3xl sm:text-5xl" style={{ color: "hsl(var(--pr-text-on-light))" }}>
            {t({ it: "Quanto stai perdendo ", en: "How much are you losing " })}
            <span className="prestige-gold-text italic">{t({ it: "oggi?", en: "today?" })}</span>
          </h2>
          <p className="mt-3 text-sm" style={{ color: "hsl(var(--pr-muted-on-light))" }}>
            {t({ it: "Stima indicativa basata su medie del settore. Non è una promessa di rendita.", en: "Indicative estimate based on industry averages. Not a yield promise." })}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="prestige-card space-y-6">
            <RoiSlider label={t({ it: "Chiamate / messaggi al giorno", en: "Calls / messages per day" })} value={callsPerDay} min={5} max={200} step={5} onChange={setCalls} suffix="" />
            <RoiSlider label={t({ it: "Valore medio cliente (€)", en: "Average customer value (€)" })} value={avgValue} min={10} max={500} step={5} onChange={setAvg} suffix="€" />
            <RoiSlider label={t({ it: "% chiamate perse oggi", en: "% calls lost today" })} value={missedRate} min={5} max={70} step={5} onChange={setMissed} suffix="%" />
          </div>

          <div className="prestige-card-gilt">
            <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-light))" }}>{t({ it: "Stima mensile", en: "Monthly estimate" })}</div>
            <RoiRow label={t({ it: "Chiamate perse oggi", en: "Calls lost today" })} value={`${data.missed}`} tone="bad" />
            <RoiRow label={t({ it: "Recuperate da Empire (~70%)", en: "Recovered by Empire (~70%)" })} value={`${data.recovered}`} tone="good" />
            <RoiRow label={t({ it: "Fatturato extra stimato", en: "Estimated extra revenue" })} value={fmtEur(data.extraRevenue)} tone="good" />
            <RoiRow label={t({ it: "Risparmio staff (vs receptionist)", en: "Staff savings (vs receptionist)" })} value={fmtEur(data.staffSaved)} tone="good" />
            <RoiRow label={t({ it: "Costo Empire", en: "Empire cost" })} value={`− ${fmtEur(data.empireCost)}`} tone="bad" />
            <div className="mt-4 border-t pt-4" style={{ borderColor: "hsl(var(--pr-gold) / 0.3)" }}>
              <div className="text-xs uppercase tracking-widest" style={{ color: "hsl(var(--pr-text-on-dark) / 0.8)" }}>{t({ it: "Guadagno netto stimato / mese", en: "Estimated net gain / month" })}</div>
              <div className="prestige-display mt-1 text-4xl sm:text-5xl prestige-gold-text">{fmtEur(data.netGain)}</div>
            </div>
            <a href="#prestige-lead" className="prestige-cta mt-6 w-full justify-center">
              <span>{t({ it: "Voglio questi risultati", en: "I want these results" })}</span> <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
function RoiSlider({ label, value, min, max, step, onChange, suffix }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; suffix: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium" style={{ color: "hsl(var(--pr-text-on-light))" }}>{label}</label>
        <span className="prestige-display text-2xl prestige-gold-text">{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full accent-amber-500" />
    </div>
  );
}
function RoiRow({ label, value, tone }: { label: string; value: string; tone: "good" | "bad" }) {
  return (
    <div className="mt-3 flex items-center justify-between gap-3 text-sm">
      <span style={{ color: "hsl(var(--pr-text-on-dark) / 0.85)" }}>{label}</span>
      <span className="font-semibold" style={{ color: tone === "good" ? "hsl(var(--pr-gold-light))" : "hsl(0 70% 70%)" }}>{value}</span>
    </div>
  );
}

/* ─── 6. COMPARISON TABLE ──────────────────────────────────── */
export function PrestigeComparison() {
  const t = useT();
  const rows = [
    { k: { it: "Risposta 24/7 multilingua", en: "24/7 multilingual answers" }, empire: true, agency: false, staff: false },
    { k: { it: "Setup in 7 giorni", en: "Setup in 7 days" }, empire: true, agency: false, staff: true },
    { k: { it: "Costo mensile", en: "Monthly cost" }, empire: "€29–49", agency: "€2.500+", staff: "€1.800+" },
    { k: { it: "Ferie / malattia", en: "Holidays / sick days" }, empire: { it: "Mai", en: "Never" }, agency: "—", staff: { it: "Sì", en: "Yes" } },
    { k: { it: "Si aggiorna da sola", en: "Self-improving" }, empire: true, agency: false, staff: false },
    { k: { it: "Garanzia soddisfatti", en: "Satisfaction guarantee" }, empire: { it: "90 gg", en: "90 days" }, agency: false, staff: false },
  ];

  const Cell = ({ v }: { v: any }) => {
    if (v === true) return <Check size={18} style={{ color: "hsl(var(--pr-gold-light))" }} className="mx-auto" />;
    if (v === false) return <X size={18} style={{ color: "hsl(0 60% 65%)" }} className="mx-auto" />;
    if (typeof v === "object") return <span>{t(v)}</span>;
    return <span>{v}</span>;
  };

  return (
    <section data-section="prestige-compare" className="prestige-section prestige-dark py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-5 lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <SectionEyebrow index="06">{t({ it: "Confronto onesto", en: "Honest comparison" })}</SectionEyebrow>
          <h2 className="prestige-display mt-4 text-3xl sm:text-5xl">
            {t({ it: "Empire vs ", en: "Empire vs " })}
            <span className="prestige-gold-text italic">{t({ it: "il vecchio modo.", en: "the old way." })}</span>
          </h2>
        </div>
        <div className="prestige-compare-wrap mt-10 overflow-x-auto rounded-2xl border" style={{ borderColor: "hsl(var(--pr-gold) / 0.25)", background: "hsl(var(--pr-emerald-mid) / 0.45)" }}>
          <table className="prestige-compare-table w-full text-sm min-w-[560px]">
            <thead>
              <tr style={{ background: "hsl(var(--pr-emerald-deep) / 0.8)" }}>
                <th className="p-4 text-left font-semibold" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>{t({ it: "Caratteristica", en: "Feature" })}</th>
                <th className="p-4 font-semibold" style={{ color: "hsl(var(--pr-gold-light))" }}>Empire</th>
                <th className="p-4 font-semibold" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>{t({ it: "Agenzia tradizionale", en: "Traditional agency" })}</th>
                <th className="p-4 font-semibold" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>{t({ it: "Assumere staff", en: "Hiring staff" })}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderTop: "1px solid hsl(var(--pr-gold) / 0.12)" }}>
                  <td className="p-4 font-medium" style={{ color: "hsl(var(--pr-text-on-dark))" }}>{t(r.k)}</td>
                  <td data-label="Empire" className="p-4 text-center" style={{ background: "hsl(var(--pr-gold) / 0.05)" }}><Cell v={r.empire} /></td>
                  <td data-label={t({ it: "Agenzia", en: "Agency" })} className="p-4 text-center" style={{ color: "hsl(var(--pr-muted-on-dark))" }}><Cell v={r.agency} /></td>
                  <td data-label={t({ it: "Staff", en: "Staff" })} className="p-4 text-center" style={{ color: "hsl(var(--pr-muted-on-dark))" }}><Cell v={r.staff} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ─── 7. PRICING ───────────────────────────────────────────── */
export function PrestigePricing() {
  const t = useT();
  const navigate = useNavigate();
  const plans = [
    {
      name: { it: "Digital Start", en: "Digital Start" },
      price: "€1.997",
      per: { it: " una tantum + €49/mese", en: " one-off + €49/month" },
      desc: { it: "Sito web, app white-label e dashboard operativa per partire subito.", en: "Website, white-label app and operational dashboard to launch fast." },
      feats: [
        { it: "Sito web + app white-label", en: "Website + white-label app" },
        { it: "Menu / catalogo QR", en: "QR menu / catalog" },
        { it: "Dashboard analytics", en: "Analytics dashboard" },
        { it: "Supporto dedicato", en: "Dedicated support" },
      ],
      highlight: false,
    },
    {
      name: { it: "Growth AI", en: "Growth AI" },
      price: "€4.997",
      per: { it: " una tantum + €29/mese", en: " one-off + €29/month" },
      desc: { it: "Il piano consigliato: AI engine, automazioni e CRM avanzato inclusi.", en: "Recommended plan: AI engine, automations and advanced CRM included." },
      feats: [
        { it: "Tutto di Digital Start", en: "Everything in Digital Start" },
        { it: "AI engine completo", en: "Full AI engine" },
        { it: "2 agenti IA inclusi", en: "2 AI agents included" },
        { it: "Review Shield™", en: "Review Shield™" },
      ],
      highlight: true, badge: { it: "Consigliato", en: "Recommended" },
    },
    {
      name: { it: "Empire Domination", en: "Empire Domination" },
      price: "€7.997",
      per: { it: " una tantum + €0/mese", en: " one-off + €0/month" },
      desc: { it: "Tutto incluso, 0% commissioni e account manager VIP dedicato.", en: "Everything included, 0% fees and a dedicated VIP account manager." },
      feats: [
        { it: "Tutto incluso", en: "Everything included" },
        { it: "0% commissioni", en: "0% fees" },
        { it: "5 agenti IA", en: "5 AI agents" },
        { it: "Account manager VIP", en: "VIP account manager" },
      ],
      highlight: false,
    },
  ];

  return (
    <section data-section="prestige-pricing" className="prestige-section prestige-light py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-5 lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <SectionEyebrow index="07">{t({ it: "Prezzi trasparenti", en: "Transparent pricing" })}</SectionEyebrow>
          <h2 className="prestige-display mt-4 text-3xl sm:text-5xl" style={{ color: "hsl(var(--pr-text-on-light))" }}>
            {t({ it: "Investi in un'AI, ", en: "Invest in an AI, " })}
            <span className="prestige-gold-text italic">{t({ it: "non in problemi.", en: "not in problems." })}</span>
          </h2>
          <p className="mt-3 text-sm" style={{ color: "hsl(var(--pr-muted-on-light))" }}>
            {t({ it: "Setup in 7 giorni · Cancelli quando vuoi · Nessun vincolo", en: "7-day setup · Cancel anytime · No commitment" })}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3 items-stretch">
          {plans.map((p) => (
            <div key={p.name.it} className={p.highlight ? "prestige-card-gilt relative md:scale-105 md:-translate-y-2" : "prestige-card relative"}>
              {p.highlight && p.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest" style={{ background: "linear-gradient(135deg, hsl(var(--pr-gold-light)), hsl(var(--pr-gold-deep)))", color: "hsl(var(--pr-emerald-deep))" }}>
                  ★ {t(p.badge)}
                </span>
              )}
              <h3 className="prestige-display text-2xl" style={{ color: p.highlight ? "hsl(var(--pr-text-on-dark))" : "hsl(var(--pr-text-on-light))" }}>{t(p.name)}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="prestige-display text-4xl prestige-gold-text">{typeof p.price === "string" ? p.price : t(p.price)}</span>
                <span className="text-sm" style={{ color: p.highlight ? "hsl(var(--pr-muted-on-dark))" : "hsl(var(--pr-muted-on-light))" }}>{typeof p.per === "string" ? p.per : t(p.per)}</span>
              </div>
              <p className="mt-3 text-sm" style={{ color: p.highlight ? "hsl(var(--pr-muted-on-dark))" : "hsl(var(--pr-muted-on-light))" }}>{t(p.desc)}</p>
              <ul className="mt-5 space-y-2 text-sm" style={{ color: p.highlight ? "hsl(var(--pr-text-on-dark))" : "hsl(var(--pr-text-on-light))" }}>
                {p.feats.map((f, i) => (
                  <li key={i} className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0" style={{ color: "hsl(var(--pr-gold))" }} />{t(f)}</li>
                ))}
              </ul>
              <button className={p.highlight ? "prestige-cta mt-6 w-full justify-center" : "prestige-cta-ghost mt-6 w-full justify-center"} style={p.highlight ? undefined : { color: "hsl(var(--pr-emerald))" }} onClick={() => navigate("/onboarding")}>
                <span>{t({ it: "Inizia ora", en: "Start now" })}</span> <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Two-track CTA — Base vs Completo */}
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <div className="prestige-card p-6">
            <div className="text-xs font-bold uppercase tracking-widest prestige-gold-text">Pacchetto Base</div>
            <h3 className="prestige-display text-2xl mt-1" style={{ color: "hsl(var(--pr-text-on-light))" }}>Self-service</h3>
            <p className="mt-2 text-sm" style={{ color: "hsl(var(--pr-muted-on-light))" }}>
              Scegli uno stile dal nostro catalogo, personalizza logo e colori, ricevi il sito.
            </p>
            <button onClick={() => navigate("/pacchetto-base")} className="prestige-cta mt-4 w-full justify-center">
              <span>Acquista ora — €1.997</span> <ArrowRight size={16} />
            </button>
          </div>
          <div className="prestige-card p-6">
            <div className="text-xs font-bold uppercase tracking-widest prestige-gold-text">Pacchetto Completo</div>
            <h3 className="prestige-display text-2xl mt-1" style={{ color: "hsl(var(--pr-text-on-light))" }}>Su misura</h3>
            <p className="mt-2 text-sm" style={{ color: "hsl(var(--pr-muted-on-light))" }}>
              Progetto personalizzato end-to-end. Compila il brief, ti ricontattiamo entro 24h.
            </p>
            <button onClick={() => navigate("/pacchetto-completo")} className="prestige-cta-ghost mt-4 w-full justify-center" style={{ color: "hsl(var(--pr-emerald))" }}>
              <span>Richiedi preventivo</span> <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Nota legale obbligatoria su IVA, fatturazione e recesso */}
        <p className="mx-auto mt-8 max-w-3xl text-center text-[11px] leading-relaxed" style={{ color: "hsl(var(--pr-muted-on-light))" }}>
          {t({ it: PRICING_LEGAL_NOTE_IT, en: PRICING_LEGAL_NOTE_EN })}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs" style={{ color: "hsl(var(--pr-muted-on-light))" }}>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} /> {t({ it: "GDPR compliant", en: "GDPR compliant" })}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1.5"><Lock size={14} /> {t({ it: "Dati in EU", en: "Data hosted in EU" })}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1.5"><BadgePercent size={14} /> {t({ it: "Nessun vincolo", en: "No commitment" })}</span>
        </div>

      </div>
    </section>
  );
}

/* ─── 8. URGENZA ETICA ─────────────────────────────────────── */
export function PrestigeUrgency() {
  const t = useT();
  const SLOTS_TOTAL = 12;
  const slotsLeft = useMemo(() => {
    const d = new Date();
    const seed = (d.getMonth() + 1) * 7 + d.getFullYear();
    return ((seed * 31) % SLOTS_TOTAL) % 5 + 2;
  }, []);
  return (
    <section data-section="prestige-urgency" className="prestige-section prestige-dark py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-5 lg:px-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border px-5 py-4" style={{ borderColor: "hsl(var(--pr-gold) / 0.4)", background: "hsl(var(--pr-emerald-mid) / 0.55)" }}>
          <div className="flex items-center gap-3">
            <Zap size={18} style={{ color: "hsl(var(--pr-gold-light))" }} />
            <p className="text-sm sm:text-base">
              <strong>{t({ it: "Onboarding limitato:", en: "Limited onboarding:" })}</strong>{" "}
              {t({
                it: `accettiamo solo ${SLOTS_TOTAL} nuovi clienti al mese per mantenere alta qualità. `,
                en: `we accept only ${SLOTS_TOTAL} new customers per month to ensure quality. `,
              })}
              <span style={{ color: "hsl(var(--pr-gold-light))" }}>
                {t({ it: `Restano ${slotsLeft} posti per questo mese.`, en: `${slotsLeft} slots left this month.` })}
              </span>
            </p>
          </div>
          <a href="#prestige-lead" className="prestige-cta whitespace-nowrap">
            <span>{t({ it: "Prenota il tuo posto", en: "Reserve your slot" })}</span> <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── 9. FAQ ───────────────────────────────────────────────── */
export function PrestigeFAQ() {
  const t = useT();
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    { q: { it: "E se non capisco di tecnologia?", en: "What if I'm not tech-savvy?" }, a: { it: "Non devi capire nulla. Pensiamo a tutto noi: installazione, configurazione e formazione. Tu usi solo una dashboard semplice come WhatsApp.", en: "You don't need to. We handle install, config and training. You use a dashboard as simple as WhatsApp." } },
    { q: { it: "L'AI sostituisce davvero il mio staff?", en: "Does the AI really replace my staff?" }, a: { it: "Lo affianca. L'AI risponde a routine, prenotazioni, FAQ. Il tuo staff si concentra sui clienti VIP e sulle situazioni che richiedono empatia umana.", en: "It supports them. The AI handles routine, bookings, FAQs. Your staff focuses on VIP customers and situations needing human empathy." } },
    { q: { it: "Quanto ci vuole davvero per partire?", en: "How long does it really take to launch?" }, a: { it: "7 giorni in media. Il primo giorno ci dai gli accessi, in una settimana sei live con sito, AI, WhatsApp e telefono.", en: "7 days on average. Day one you give us access, within a week you're live with site, AI, WhatsApp and phone." } },
    { q: { it: "I miei dati e quelli dei clienti sono sicuri?", en: "Are my and my customers' data safe?" }, a: { it: "Sì. Server in UE, crittografia at-rest, GDPR compliant, nessun dato venduto a terzi. Mai.", en: "Yes. EU servers, at-rest encryption, GDPR compliant, no data sold to third parties. Ever." } },
    { q: { it: "Posso cancellare in qualunque momento?", en: "Can I cancel anytime?" }, a: { it: "Sì, senza penali. Puoi disdire in qualunque momento, senza costi nascosti.", en: "Yes, no penalties. You can cancel anytime with no hidden fees." } },
    { q: { it: "Funziona anche per il mio settore?", en: "Does it work for my industry?" }, a: { it: "Empire è già attivo in 25+ settori: food, NCC, beauty, hotel, palestre, studi medici/legali, e-commerce. Lo addestriamo sul tuo specifico.", en: "Empire is live in 25+ industries: food, NCC, beauty, hotels, gyms, medical/legal practices, e-commerce. We train it on yours." } },
  ];

  return (
    <section data-section="prestige-faq" className="prestige-section prestige-dark py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-5 lg:px-10">
        <div className="text-center">
          <SectionEyebrow index="08">{t({ it: "Domande frequenti", en: "Frequently asked" })}</SectionEyebrow>
          <h2 className="prestige-display mt-4 text-3xl sm:text-5xl">
            {t({ it: "I tuoi dubbi, ", en: "Your doubts, " })}
            <span className="prestige-gold-text italic">{t({ it: "risolti.", en: "answered." })}</span>
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="rounded-2xl border overflow-hidden" style={{ borderColor: "hsl(var(--pr-gold) / 0.22)", background: "hsl(var(--pr-emerald-mid) / 0.45)" }}>
                <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                  <span className="font-semibold text-base sm:text-lg">{t(f.q)}</span>
                  <ChevronDown size={18} className="shrink-0 transition-transform" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", color: "hsl(var(--pr-gold-light))" }} />
                </button>
                <div className="grid transition-all" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>{t(f.a)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── 10. LEAD FORM + WHATSAPP ─────────────────────────────── */
const leadSchema = z.object({
  name: z.string().trim().min(2, "Nome troppo corto").max(80),
  business: z.string().trim().min(2, "Nome attività troppo corto").max(120),
  contact: z.string().trim().min(5, "Contatto non valido").max(120),
  sector: z.string().trim().max(60).optional().or(z.literal("")),
});

export function PrestigeLeadForm() {
  const t = useT();
  const WA = LEGAL.whatsapp;
  const [form, setForm] = useState({ name: "", business: "", contact: "", sector: "", projectType: "" });
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Dati non validi");
      return;
    }
    if (!consent) {
      toast.error(t({ it: "Devi accettare l'informativa privacy per inviare la richiesta.", en: "You must accept the privacy notice to submit." }));
      return;
    }
    setBusy(true);
    try {
      // Il lead viene SEMPRE persistito: nessuna richiesta si perde più anche
      // se il canale WhatsApp non è configurato.
      const { error } = await supabase.from("website_inquiries").insert({
        name: parsed.data.name,
        business: parsed.data.business,
        contact: parsed.data.contact,
        sector: parsed.data.sector || null,
        project_type: form.projectType || null,
        source: "homepage",
        privacy_consent: true,
        consent_at: new Date().toISOString(),
      });
      if (error) throw error;

      if (WA) {
        const msg =
          `🟢 ${t({ it: "Nuova richiesta demo Empire", en: "New Empire demo request" })}\n\n` +
          `👤 ${parsed.data.name}\n🏢 ${parsed.data.business}\n📞 ${parsed.data.contact}` +
          (parsed.data.sector ? `\n🏷️ ${parsed.data.sector}` : "") +
          (form.projectType ? `\n🎯 ${form.projectType}` : "");
        window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
      }
      toast.success(t({ it: "Richiesta inviata. Ti contattiamo entro 2–4 ore lavorative.", en: "Request sent. We'll reply within 2–4 business hours." }));
      setForm({ name: "", business: "", contact: "", sector: "", projectType: "" });
      setConsent(false);
    } catch (err) {
      console.error("[PrestigeLeadForm] submit failed", err);
      toast.error(t({ it: "Invio non riuscito. Riprova o scrivici via email.", en: "Submission failed. Please retry or email us." }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="prestige-lead" data-section="prestige-lead" className="prestige-section prestige-dark py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-5 lg:px-10">
        <div className="prestige-card-gilt p-6 sm:p-10">
          <div className="text-center">
            <SectionEyebrow index="09">{t({ it: "Prenota la tua demo", en: "Book your demo" })}</SectionEyebrow>
            <h2 className="prestige-display mt-4 text-3xl sm:text-5xl">
              {t({ it: "Demo personalizzata ", en: "Personalised demo " })}
              <span className="prestige-gold-text italic">{t({ it: "30 minuti.", en: "30 minutes." })}</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
              {t({ it: "Ti mostriamo l'AI live sulla tua azienda. Zero impegno.", en: "We show you the AI live on your business. Zero commitment." })}
            </p>
          </div>
          <form onSubmit={submit} className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label={t({ it: "Il tuo nome", en: "Your name" })} value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Mario Rossi" />
            <Field label={t({ it: "Nome attività", en: "Business name" })} value={form.business} onChange={(v) => setForm({ ...form, business: v })} placeholder={t({ it: "Pizzeria da Mario", en: "Mario's Pizza" })} />
            <Field label={t({ it: "Telefono o email", en: "Phone or email" })} value={form.contact} onChange={(v) => setForm({ ...form, contact: v })} placeholder="+39 …" />
            <Field label={t({ it: "Settore (opz.)", en: "Industry (opt.)" })} value={form.sector} onChange={(v) => setForm({ ...form, sector: v })} placeholder={t({ it: "Es. ristorazione", en: "e.g. hospitality" })} />

            {/* Tipo di progetto — qualifica la richiesta come fa il competitor */}
            <label className="block sm:col-span-2">
              <span className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
                {t({ it: "Di cosa hai bisogno?", en: "What do you need?" })}
              </span>
              <select
                value={form.projectType}
                onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition focus:ring-2"
                style={{
                  background: "hsl(var(--pr-emerald-deep) / 0.6)",
                  color: "hsl(var(--pr-text-on-dark))",
                  border: "1px solid hsl(var(--pr-gold) / 0.25)",
                }}
              >
                <option value="">{t({ it: "Seleziona…", en: "Select…" })}</option>
                <option value="Sito web professionale">{t({ it: "Sito web professionale", en: "Professional website" })}</option>
                <option value="App / webapp clienti">{t({ it: "App / webapp per i clienti", en: "Customer app / webapp" })}</option>
                <option value="Agente AI (chat, WhatsApp, telefono)">{t({ it: "Agente AI (chat, WhatsApp, telefono)", en: "AI agent (chat, WhatsApp, phone)" })}</option>
                <option value="Sistema completo Empire">{t({ it: "Sistema completo Empire", en: "Full Empire system" })}</option>
                <option value="Altro / più cose">{t({ it: "Altro / più cose", en: "Other / multiple" })}</option>
              </select>
            </label>

            {/* Consenso privacy esplicito (art. 6 e 13 GDPR) */}
            <label className="sm:col-span-2 mt-2 flex items-start gap-3 text-left text-[12px] leading-relaxed" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
                className="mt-0.5 h-4 w-4 shrink-0 accent-amber-400"
                aria-describedby="prestige-consent-note"
              />
              <span id="prestige-consent-note">
                {t({
                  it: "Ho letto l'",
                  en: "I have read the ",
                })}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "hsl(var(--pr-gold-light))" }}>
                  {t({ it: "informativa privacy", en: "privacy notice" })}
                </a>
                {t({
                  it: " e acconsento al trattamento dei miei dati per essere ricontattato in merito a questa richiesta. Nessun uso marketing senza un ulteriore consenso.",
                  en: " and consent to the processing of my data to be contacted about this request. No marketing use without further consent.",
                })}
              </span>
            </label>

            <div className="sm:col-span-2 mt-2 flex flex-col sm:flex-row gap-3">
              <button type="submit" disabled={busy || !consent} className="prestige-cta justify-center w-full sm:flex-1 disabled:cursor-not-allowed disabled:opacity-60">
                <Send size={16} /> <span>{busy ? "…" : t({ it: "Prenota la demo", en: "Book the demo" })}</span>
              </button>
              {WA ? (
                <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer" className="prestige-cta-ghost justify-center w-full sm:w-auto">
                  <MessageSquare size={14} /> <span>WhatsApp</span>
                </a>
              ) : (
                <a href={`mailto:${LEGAL.email}`} className="prestige-cta-ghost justify-center w-full sm:w-auto">
                  <MessageSquare size={14} /> <span>{t({ it: "Scrivici via email", en: "Email us" })}</span>
                </a>
              )}
            </div>
            <div
              className="sm:col-span-2 mt-1 flex items-center justify-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold"
              style={{
                background: "hsl(var(--pr-gold) / 0.12)",
                border: "1px solid hsl(var(--pr-gold) / 0.3)",
                color: "hsl(var(--pr-gold-light))",
              }}
            >
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: "hsl(var(--pr-gold))" }} aria-hidden />
              {t({ it: "Risposta entro 2–4 ore lavorative", en: "Reply within 2–4 business hours" })}
            </div>
            <p className="sm:col-span-2 mt-2 text-[11px] text-center" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
              <ShieldCheck size={12} className="inline mr-1" />
              {t({ it: "Dati protetti GDPR. Nessuno spam. Mai venduti.", en: "GDPR-protected. No spam. Never sold." })}
            </p>

          </form>
        </div>
      </div>
    </section>
  );
}
function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={120}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition focus:ring-2"
        style={{
          background: "hsl(var(--pr-emerald-deep) / 0.6)",
          color: "hsl(var(--pr-text-on-dark))",
          border: "1px solid hsl(var(--pr-gold) / 0.25)",
        }}
      />
    </label>
  );
}

/* ─── 11. STICKY MOBILE CTA ────────────────────────────────── */
export function PrestigeStickyCTA() {
  const t = useT();
  const [show, setShow] = useState(false);
  const WA = LEGAL.whatsapp;

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={`fixed bottom-0 inset-x-0 z-[40] sm:hidden transition-all ${show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 8px)" }}
    >
      <div className="mx-3 mb-3 rounded-2xl p-2 flex gap-2 shadow-2xl" style={{ background: "hsl(var(--pr-emerald-deep) / 0.95)", border: "1px solid hsl(var(--pr-gold) / 0.4)", backdropFilter: "blur(10px)" }}>
        <a href="#prestige-lead" className="prestige-cta flex-1 justify-center" style={{ padding: "0.7rem 1rem", fontSize: 13 }}>
          <Calendar size={14} /> <span>{t({ it: "Prenota demo", en: "Book demo" })}</span>
        </a>
        {WA ? (
          <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center rounded-full px-4" style={{ background: "hsl(142 70% 45%)", color: "white" }} aria-label="WhatsApp">
            <MessageSquare size={18} />
          </a>
        ) : (
          <a href={`mailto:${LEGAL.email}`} className="flex items-center justify-center rounded-full px-4" style={{ background: "hsl(var(--pr-gold))", color: "hsl(var(--pr-emerald-deep))" }} aria-label={t({ it: "Scrivici via email", en: "Email us" })}>
            <MessageSquare size={18} />
          </a>
        )}
      </div>
    </div>
  );
}
