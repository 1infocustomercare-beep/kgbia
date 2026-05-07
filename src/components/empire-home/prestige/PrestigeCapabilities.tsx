import { useEmpireScrollDirector } from "../ScrollDirector";
import {
  Workflow, Cpu, Database, FileSpreadsheet, Calendar, Users, Package,
  TrendingUp, Mail, Phone, Receipt, ShieldCheck, Zap, Bot, Globe,
  Smartphone, CreditCard, BarChart3, MessageSquare, Camera, Truck,
  ClipboardList, Languages, Bell, MapPin, Star, Lock, Cloud, Sparkles,
} from "lucide-react";

const PILLARS = [
  {
    eyebrow: "Processi",
    title: "Processiamo",
    desc: "Trasformiamo task ripetitivi in flussi automatici. Risparmi ore ogni giorno.",
    color: "var(--pr-emerald)",
    items: [
      { icon: Receipt, label: "Fatturazione automatica" },
      { icon: ClipboardList, label: "Ordini & ricevute" },
      { icon: Mail, label: "Email & follow-up" },
      { icon: FileSpreadsheet, label: "Report & export PDF/CSV" },
      { icon: Bell, label: "Promemoria clienti" },
      { icon: Database, label: "Sincronizzazione dati" },
    ],
  },
  {
    eyebrow: "Automazioni",
    title: "Automatizziamo",
    desc: "Workflow AI che lavorano 24/7 al posto tuo: rispondono, prenotano, vendono.",
    color: "var(--pr-gold)",
    items: [
      { icon: Bot, label: "Assistente AI dedicato" },
      { icon: MessageSquare, label: "WhatsApp & SMS" },
      { icon: Phone, label: "Risposta telefonica AI" },
      { icon: Calendar, label: "Prenotazioni & calendario" },
      { icon: Languages, label: "Traduzioni multilingua" },
      { icon: Workflow, label: "Trigger & sequenze" },
    ],
  },
  {
    eyebrow: "Crescita",
    title: "Miglioriamo",
    desc: "Analizziamo, ottimizziamo, scaliamo. Ogni mese il tuo business performa di più.",
    color: "var(--pr-emerald)",
    items: [
      { icon: TrendingUp, label: "Analytics & KPI live" },
      { icon: Star, label: "Recensioni & reputazione" },
      { icon: BarChart3, label: "Forecast vendite" },
      { icon: Sparkles, label: "Suggerimenti AI" },
      { icon: Camera, label: "Contenuti social" },
      { icon: Zap, label: "A/B test automatici" },
    ],
  },
  {
    eyebrow: "Software",
    title: "Creiamo gestionali",
    desc: "Un'unica piattaforma per gestire tutto: clienti, magazzino, staff, pagamenti.",
    color: "var(--pr-gold)",
    items: [
      { icon: Users, label: "CRM clienti 360°" },
      { icon: Package, label: "Magazzino & inventario" },
      { icon: Truck, label: "Logistica & consegne" },
      { icon: CreditCard, label: "Pagamenti integrati" },
      { icon: MapPin, label: "Multi-sede & flotte" },
      { icon: Cpu, label: "Dashboard real-time" },
    ],
  },
];

const FOUNDATION = [
  { icon: Globe, label: "Sito web premium" },
  { icon: Smartphone, label: "App cliente PWA" },
  { icon: ShieldCheck, label: "GDPR & sicurezza" },
  { icon: Lock, label: "Backup quotidiani" },
  { icon: Cloud, label: "Hosting incluso" },
  { icon: Bot, label: "AI personalizzata" },
];

export default function PrestigeCapabilities() {
  const { ref } = useEmpireScrollDirector<HTMLDivElement>("prestige-capabilities", {
    steps: PILLARS.length,
  });

  return (
    <section
      ref={ref}
      data-section="prestige-capabilities"
      className="prestige-section prestige-dark py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="max-w-3xl">
          <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold))" }}>
            ✦ Tutto quello che possiamo fare per te
          </div>
          <h2
            className="prestige-display mt-4 text-4xl font-semibold sm:text-5xl md:text-6xl"
            style={{ color: "hsl(var(--pr-text-on-dark))" }}
          >
            Una piattaforma. <span className="prestige-gold-text">Quattro super-poteri.</span>
          </h2>
          <div
            className="prestige-divider mt-5"
            style={{ background: "linear-gradient(90deg, transparent, hsl(var(--pr-gold) / 0.7), transparent)" }}
          />
          <p
            className="mt-5 text-base sm:text-lg"
            style={{ color: "hsl(var(--pr-muted-on-dark))" }}
          >
            Non vendiamo un singolo strumento. Costruiamo l'<strong>intero sistema</strong> che fa
            funzionare il tuo business: processiamo i dati noiosi, automatizziamo le risposte,
            miglioriamo i risultati e creiamo il gestionale su misura per il tuo settore.
            Tu pensi solo a fare quello che ami.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {PILLARS.map((pillar, idx) => (
            <article
              key={pillar.title}
              className="prestige-card-dark group relative overflow-hidden"
              style={{
                animation: `prestigeRise .8s ${idx * 0.08}s cubic-bezier(.22,1,.36,1) backwards`,
              }}
            >
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
                style={{ background: `hsl(${pillar.color})` }}
              />
              <div className="relative">
                <div
                  className="prestige-eyebrow text-xs"
                  style={{ color: `hsl(${pillar.color})` }}
                >
                  {pillar.eyebrow}
                </div>
                <h3
                  className="prestige-display mt-2 text-3xl sm:text-4xl"
                  style={{ color: "hsl(var(--pr-text-on-dark))" }}
                >
                  {pillar.title}
                </h3>
                <p
                  className="mt-3 text-sm leading-relaxed sm:text-base"
                  style={{ color: "hsl(var(--pr-muted-on-dark))" }}
                >
                  {pillar.desc}
                </p>

                <ul className="mt-6 grid grid-cols-2 gap-2.5">
                  {pillar.items.map((it, i) => {
                    const Ic = it.icon;
                    return (
                      <li
                        key={it.label}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-all duration-300 hover:translate-x-1"
                        style={{
                          background: "hsl(var(--pr-text-on-dark) / 0.04)",
                          border: "1px solid hsl(var(--pr-text-on-dark) / 0.08)",
                          animation: `prestigeFadeIn .5s ${idx * 0.08 + i * 0.04 + 0.2}s cubic-bezier(.22,1,.36,1) backwards`,
                        }}
                      >
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                          style={{
                            background: `hsl(${pillar.color} / 0.15)`,
                            color: `hsl(${pillar.color})`,
                          }}
                        >
                          <Ic size={14} />
                        </span>
                        <span
                          className="text-[12px] font-medium leading-tight sm:text-[13px]"
                          style={{ color: "hsl(var(--pr-text-on-dark) / 0.85)" }}
                        >
                          {it.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* Foundation strip */}
        <div
          className="mt-10 rounded-3xl border p-6 sm:p-8"
          style={{
            background: "linear-gradient(135deg, hsl(var(--pr-emerald-deep) / 0.4), hsl(var(--pr-bg-dark) / 0.6))",
            borderColor: "hsl(var(--pr-gold) / 0.18)",
          }}
        >
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="prestige-eyebrow text-xs" style={{ color: "hsl(var(--pr-gold))" }}>
                ✦ Incluso in ogni progetto
              </div>
              <p
                className="prestige-display mt-1 text-xl sm:text-2xl"
                style={{ color: "hsl(var(--pr-text-on-dark))" }}
              >
                La base tecnologica è <span className="prestige-gold-text">sempre compresa.</span>
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {FOUNDATION.map((f, i) => {
              const Ic = f.icon;
              return (
                <div
                  key={f.label}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                  style={{
                    background: "hsl(var(--pr-text-on-dark) / 0.05)",
                    border: "1px solid hsl(var(--pr-gold) / 0.12)",
                    animation: `prestigeFadeIn .5s ${i * 0.05}s cubic-bezier(.22,1,.36,1) backwards`,
                  }}
                >
                  <Ic size={14} style={{ color: "hsl(var(--pr-gold))" }} />
                  <span
                    className="text-[11px] font-medium leading-tight sm:text-[12px]"
                    style={{ color: "hsl(var(--pr-text-on-dark) / 0.9)" }}
                  >
                    {f.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes prestigeRise {
          from { opacity: 0; transform: translateY(36px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes prestigeFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
