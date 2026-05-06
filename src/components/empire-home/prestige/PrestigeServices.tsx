import { useEmpireScrollDirector } from "../ScrollDirector";
import { Globe, Smartphone, Bot, MessageSquare, CreditCard, BarChart3 } from "lucide-react";

const SERVICES = [
  {
    icon: Globe,
    title: "Sito web professionale",
    desc: "Realizziamo il sito della tua azienda — moderno, veloce, ottimizzato per Google e per i tuoi clienti. Niente template anonimi: ogni pagina è disegnata sul tuo brand.",
    bullets: ["SEO incluso", "Mobile-first", "Hosting compreso"],
  },
  {
    icon: Smartphone,
    title: "App e gestionale",
    desc: "Una mini-app dedicata ai tuoi clienti per ordinare, prenotare e fidelizzarsi. Tu gestisci tutto da una dashboard semplice come WhatsApp.",
    bullets: ["Ordini in tempo reale", "Notifiche push", "Niente commissioni"],
  },
  {
    icon: Bot,
    title: "AI personalizzata",
    desc: "Un assistente virtuale che conosce il tuo menu, i tuoi servizi e i tuoi prezzi. Risponde con il tuo tono di voce, 24 ore su 24, in più lingue.",
    bullets: ["Addestrata sul tuo business", "Multilingua", "Migliora ogni giorno"],
  },
  {
    icon: MessageSquare,
    title: "WhatsApp & Telefono automatici",
    desc: "L'AI risponde a chiamate e messaggi al posto tuo. Prende prenotazioni, dà informazioni, gestisce reclami. Tu interrompi solo quando serve davvero.",
    bullets: ["Voce naturale", "Prenotazioni dirette", "Trascrizioni complete"],
  },
  {
    icon: CreditCard,
    title: "Pagamenti integrati",
    desc: "Stripe collegato in 5 minuti. I clienti pagano dal sito, dall'app, dalla chat o tramite link. Tu vedi tutto in un'unica dashboard.",
    bullets: ["Carte, Apple Pay, Klarna", "Fatturazione automatica", "Antifrode incluso"],
  },
  {
    icon: BarChart3,
    title: "Dashboard chiara",
    desc: "Vendite, prenotazioni, recensioni, AI: tutto in una sola schermata, leggibile anche per chi non capisce di tecnologia. Esportabile in PDF.",
    bullets: ["Report automatici", "Alert WhatsApp", "Multi-sede"],
  },
];

export default function PrestigeServices() {
  const { ref } = useEmpireScrollDirector<HTMLDivElement>("prestige-services", { steps: SERVICES.length });

  return (
    <section
      ref={ref}
      data-section="prestige-services"
      className="prestige-section prestige-light py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-deep))" }}>
              ✦ Cosa facciamo per te
            </div>
            <h2 className="prestige-display mt-4 text-4xl font-semibold sm:text-5xl md:text-6xl" style={{ color: "hsl(var(--pr-text-on-light))" }}>
              Sei servizi.<br /> Una sola <span className="prestige-gold-text">agenzia.</span>
            </h2>
            <div className="prestige-divider mt-5" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--pr-gold) / 0.7), transparent)" }} />
            <p className="mt-5 max-w-md text-base sm:text-lg" style={{ color: "hsl(var(--pr-muted-on-light))" }}>
              Non ti vendiamo software complicati. Ti consegniamo un sistema completo,
              <strong> già pronto e personalizzato</strong> per il tuo settore — pizzeria, NCC, beauty,
              palestra, hotel, qualunque cosa tu faccia.
            </p>
            <p className="mt-3 text-sm italic" style={{ color: "hsl(var(--pr-muted-on-light))" }}>
              Se non capisci la tecnologia, è il nostro lavoro renderla invisibile.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {SERVICES.map((s, i) => {
                const Icon = s.icon;
                return (
                  <article
                    key={s.title}
                    className="prestige-card group"
                    style={{
                      animation: `prestigeSlideIn .8s ${i * 0.06}s cubic-bezier(.22,1,.36,1) backwards`,
                    }}
                  >
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{
                        background: "linear-gradient(135deg, hsl(var(--pr-emerald) / 0.95), hsl(var(--pr-emerald-deep)))",
                        color: "hsl(var(--pr-gold-light))",
                        boxShadow: "inset 0 1px 0 hsl(var(--pr-gold) / 0.25)",
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <h3 className="prestige-display mt-4 text-xl sm:text-2xl" style={{ color: "hsl(var(--pr-text-on-light))" }}>
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: "hsl(var(--pr-muted-on-light))" }}>
                      {s.desc}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {s.bullets.map((b) => (
                        <li
                          key={b}
                          className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                          style={{ background: "hsl(var(--pr-emerald) / 0.08)", color: "hsl(var(--pr-emerald))" }}
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes prestigeSlideIn {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
