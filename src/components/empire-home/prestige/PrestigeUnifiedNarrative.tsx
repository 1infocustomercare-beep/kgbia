import {
  Phone, CalendarX, Users, AlertTriangle,
  Plug, BrainCircuit, Rocket, ArrowRight, Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useT } from "./PrestigeLang";

/**
 * PrestigeUnifiedNarrative — fonde Problema + Soluzione + Come funziona
 * in un'unica sezione editoriale (dark), stile Empire Studio/Apple.
 * Sostituisce 3 sezioni separate riducendo rumore visivo e accorciando
 * il funnel di conversione. Niente sticky, niente clipping.
 */
export default function PrestigeUnifiedNarrative() {
  const t = useT();
  const navigate = useNavigate();

  const pains = [
    { icon: Phone, k: { it: "Telefono sempre occupato", en: "Phone constantly busy" }, d: { it: "1 chiamata persa = 1 cliente che va dal concorrente.", en: "1 missed call = 1 customer lost to a competitor." } },
    { icon: CalendarX, k: { it: "Prenotazioni perse di notte", en: "Lost bookings overnight" }, d: { it: "Il 38% arriva fuori orario. Tu dormi, loro chiamano altrove.", en: "38% arrive after hours. You sleep, they call elsewhere." } },
    { icon: Users, k: { it: "Staff costoso e instabile", en: "Expensive, unstable staff" }, d: { it: "€1.800/mese una receptionist. Si ammala, sbaglia, va via.", en: "€1,800/mo for a receptionist. Gets sick, errs, leaves." } },
    { icon: AlertTriangle, k: { it: "Recensioni che bruciano", en: "Reviews that burn" }, d: { it: "Risposte lente = stelle in meno. Google ti penalizza.", en: "Slow replies = fewer stars. Google punishes you." } },
  ];

  const steps = [
    { icon: Plug, n: "01", k: { it: "Onboarding in 7 giorni", en: "7-day onboarding" }, d: { it: "Ci dai accesso a sito, telefono e WhatsApp. Pensiamo a tutto noi.", en: "You hand over site, phone and WhatsApp. We handle the rest." } },
    { icon: BrainCircuit, n: "02", k: { it: "Addestriamo la tua AI", en: "We train your AI" }, d: { it: "Impara menu, prezzi, orari e tono di voce. Diventa parte del team.", en: "Learns menu, prices, hours and tone. Becomes a team member." } },
    { icon: Rocket, n: "03", k: { it: "Vai live in 7 giorni", en: "Go live in 7 days" }, d: { it: "Sito, app, AI, WhatsApp e pagamenti attivi. Guardi i numeri salire.", en: "Site, app, AI, WhatsApp & payments live. Watch numbers rise." } },
  ];

  return (
    <section
      data-section="prestige-narrative"
      className="prestige-section prestige-dark relative overflow-hidden py-24 sm:py-32 md:py-40"
    >
      {/* Soft aurora */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(var(--pr-gold) / 0.10), transparent 65%)",
          filter: "blur(90px)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-5 lg:px-10">
        {/* ── ACT 1 — PROBLEM ─────────────────────────────────── */}
        <div className="max-w-3xl">
          <div className="prestige-eyebrow-indexed" data-index="01" style={{ color: "hsl(var(--pr-gold-light))" }}>
            {t({ it: "Il problema reale", en: "The real problem" })}
          </div>
          <h2 className="prestige-display mt-5 leading-[1.05] break-words [hyphens:auto]" style={{ fontSize: "clamp(2rem, 7.5vw, 5.25rem)" }} data-reveal>
            {t({ it: "Mentre leggi, ", en: "While you read this, " })}
            <span className="prestige-gold-text italic inline-block max-w-full">
              {t({ it: "stai perdendo clienti.", en: "you're losing customers." })}
            </span>
          </h2>
          <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
            {t({
              it: "Ogni squillo non risposto, ogni messaggio ignorato, ogni richiesta evasa in ritardo è un cliente che oggi compra da qualcun altro.",
              en: "Every unanswered ring, every ignored message, every late reply is a customer buying from someone else today.",
            })}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pains.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.k.it} className="prestige-card">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: "hsl(0 75% 55% / 0.14)", color: "hsl(0 80% 72%)" }}
                >
                  <Icon size={20} />
                </div>
                <h3 className="prestige-display mt-4 text-lg sm:text-xl">{t(p.k)}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
                  {t(p.d)}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── DIVIDER / SOLUTION HINGE ────────────────────────── */}
        <div className="my-20 sm:my-28 md:my-32 flex flex-col items-center text-center">
          <div
            className="h-px w-24"
            style={{ background: "linear-gradient(90deg, transparent, hsl(var(--pr-gold) / 0.6), transparent)" }}
          />
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] tracking-[0.3em] uppercase"
            style={{ borderColor: "hsl(var(--pr-gold) / 0.35)", color: "hsl(var(--pr-gold-light))" }}>
            <Sparkles size={12} /> {t({ it: "La soluzione", en: "The solution" })}
          </div>
          <h3 className="prestige-display mt-6 max-w-3xl text-3xl sm:text-5xl lg:text-6xl leading-[1.08]">
            {t({ it: "Empire è l'", en: "Empire is the " })}
            <span className="prestige-gold-text italic">{t({ it: "unico sistema", en: "single system" })}</span>
            {t({
              it: " che risponde, prenota, vende e fidelizza — 24/7, in più lingue, senza staff aggiuntivo.",
              en: " that answers, books, sells and retains — 24/7, multilingual, with zero extra staff.",
            })}
          </h3>
        </div>

        {/* ── ACT 2 — HOW IT WORKS ────────────────────────────── */}
        <div className="max-w-3xl">
          <div className="prestige-eyebrow-indexed" data-index="02" style={{ color: "hsl(var(--pr-gold-light))" }}>
            {t({ it: "Come funziona", en: "How it works" })}
          </div>
          <h3 className="prestige-display mt-5 text-[2rem] leading-[1.05] sm:text-4xl md:text-5xl">
            {t({ it: "Tre passi. ", en: "Three steps. " })}
            <span className="prestige-gold-text italic">{t({ it: "Zero complicazioni.", en: "Zero hassle." })}</span>
          </h3>
        </div>

        <div className="relative mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[14%] right-[14%] top-[44px] hidden h-px md:block"
            style={{ background: "linear-gradient(90deg, transparent, hsl(var(--pr-gold) / 0.5), transparent)" }}
          />
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.n} className="prestige-card relative text-center">
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--pr-emerald)), hsl(var(--pr-emerald-deep)))",
                    color: "hsl(var(--pr-gold-light))",
                    boxShadow: "0 10px 28px -10px hsl(var(--pr-gold) / 0.45)",
                  }}
                >
                  <Icon size={26} />
                </div>
                <div className="prestige-eyebrow mt-5" style={{ color: "hsl(var(--pr-gold-light))" }}>{s.n}</div>
                <h4 className="prestige-display mt-2 text-xl sm:text-2xl">{t(s.k)}</h4>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
                  {t(s.d)}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── CTA ────────────────────────────────────────────── */}
        <div className="mt-16 sm:mt-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
          <button className="prestige-cta justify-center w-full sm:w-auto" onClick={() => navigate("/onboarding")}>
            <span className="truncate">{t({ it: "Inizia ora", en: "Start now" })}</span>
            <ArrowRight size={16} className="shrink-0" />
          </button>
          <button
            className="prestige-cta-ghost justify-center w-full sm:w-auto"
            onClick={() => document.getElementById("prestige-lead")?.scrollIntoView({ behavior: "smooth" })}
          >
            <span className="truncate">{t({ it: "Parla con un consulente", en: "Talk to a consultant" })}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
