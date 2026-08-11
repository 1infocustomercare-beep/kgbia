import { AlertTriangle, Phone, Clock, TrendingDown, Bot, Calendar, MessageSquare, TrendingUp, ArrowRight } from "lucide-react";
import { useT } from "./PrestigeLang";

const PROBLEMI = [
  { icon: Phone, it: "Telefono che squilla a vuoto", en: "Phone ringing into the void" },
  { icon: Clock, it: "Prenotazioni perse di notte", en: "Bookings lost overnight" },
  { icon: AlertTriangle, it: "WhatsApp pieno, nessuno risponde", en: "WhatsApp jammed, no one replies" },
  { icon: TrendingDown, it: "Clienti che vanno dai concorrenti", en: "Customers going to competitors" },
];

const SOLUZIONI = [
  { icon: Bot, it: "AI che risponde a chiamate e WhatsApp", en: "AI handling calls & WhatsApp" },
  { icon: Calendar, it: "Prenotazioni accettate 24/7, anche di notte", en: "24/7 booking, even overnight" },
  { icon: MessageSquare, it: "Risposte istantanee, zero attese", en: "Instant replies, zero waiting" },
  { icon: TrendingUp, it: "Clienti felici, fatturato che cresce", en: "Happy customers, growing revenue" },
];

/**
 * PrestigeStoryPinned — intentionally non-sticky.
 * This section used to be scroll-driven; keeping it natural prevents clipped cards
 * on short desktop viewports and mobile browsers with dynamic address bars.
 */
export default function PrestigeStoryPinned() {
  const t = useT();

  return (
    <section
      data-section="prestige-story"
      data-no-reveal
      className="prestige-section prestige-story-safe prestige-dark relative scroll-mt-24 overflow-visible py-20 sm:py-24 lg:py-28"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 20% 35%, hsl(0 62% 24% / 0.28), transparent 62%), radial-gradient(ellipse 68% 48% at 82% 58%, hsl(var(--pr-gold) / 0.18), transparent 64%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-5 lg:px-10">
          {/* Headline */}
          <div className="text-center">
            <div
              className="prestige-eyebrow inline-flex items-center gap-2"
              style={{ color: "hsl(var(--pr-gold-light))" }}
            >
              ✦ {t({ it: "Il problema · La soluzione", en: "The problem · The solution" })}
            </div>
            <h2 className="prestige-display mt-3 text-2xl font-semibold sm:text-5xl lg:text-6xl break-words leading-tight">
              <span
                className="italic line-through"
                style={{
                  color: "hsl(0 68% 72% / 0.78)",
                  textDecorationColor: "hsl(0 70% 60% / 0.78)",
                }}
              >
                {t({ it: "Caos quotidiano", en: "Daily chaos" })}
              </span>{" "}
              <span style={{ opacity: 0.85 }}>→</span>{" "}
              <span
                className="prestige-gold-text italic"
                style={{ opacity: 1 }}
              >
                {t({ it: "Impero ordinato", en: "Ordered empire" })}
              </span>
            </h2>
            <div className="prestige-divider mx-auto mt-5" />
          </div>


          {/* Stable comparison grid: no sticky, no scroll transforms, no clipping. */}
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-stretch">
            {/* PRIMA */}
            <div
              className="prestige-card h-full min-w-0"
              style={{
                borderColor: "hsl(0 62% 54% / 0.42)",
              }}
            >
              <div className="prestige-eyebrow mb-3" style={{ color: "hsl(0 70% 70%)" }}>
                {t({ it: "PRIMA · senza Empire", en: "BEFORE · without Empire" })}
              </div>
              <h3 className="prestige-display text-2xl sm:text-3xl">
                {t({ it: "Il giorno tipo (frustrante)", en: "A typical day (painful)" })}
              </h3>
              <ul className="mt-5 space-y-3">
                {PROBLEMI.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm sm:text-base"
                      style={{ color: "hsl(var(--pr-muted-on-dark))" }}
                    >
                      <span
                        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                        style={{ background: "hsl(0 60% 50% / 0.18)", color: "hsl(0 70% 75%)" }}
                      >
                        <Icon size={15} />
                      </span>
                      <span>{t({ it: p.it, en: p.en })}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* CENTRO — freccia che ruota */}
            <div className="hidden lg:flex items-center justify-center">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--pr-gold-light)), hsl(var(--pr-gold-deep)))",
                  color: "hsl(var(--pr-emerald-deep))",
                  boxShadow: "0 0 42px hsl(var(--pr-gold) / 0.42)",
                }}
              >
                <ArrowRight size={32} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex justify-center lg:hidden">
              <ArrowRight
                size={32}
                className="rotate-90"
                style={{
                  color: "hsl(var(--pr-gold))",
                }}
              />
            </div>

            {/* DOPO */}
            <div
              className="prestige-card h-full min-w-0"
              style={{
                borderColor: "hsl(var(--pr-gold) / 0.55)",
                boxShadow: "0 32px 70px -28px hsl(var(--pr-gold) / 0.35)",
              }}
            >
              <div className="prestige-eyebrow mb-3" style={{ color: "hsl(var(--pr-gold-light))" }}>
                {t({ it: "DOPO · con Empire", en: "AFTER · with Empire" })}
              </div>
              <h3 className="prestige-display text-2xl sm:text-3xl">
                {t({ it: "Il giorno tipo (fluido)", en: "A typical day (flowing)" })}
              </h3>
              <ul className="mt-5 space-y-3">
                {SOLUZIONI.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm sm:text-base"
                      style={{ color: "hsl(var(--pr-text-on-dark))" }}
                    >
                      <span
                        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                        style={{ background: "hsl(var(--pr-gold) / 0.2)", color: "hsl(var(--pr-gold-light))" }}
                      >
                        <Icon size={15} />
                      </span>
                      <span>{t({ it: p.it, en: p.en })}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
      </div>
    </section>
  );
}
