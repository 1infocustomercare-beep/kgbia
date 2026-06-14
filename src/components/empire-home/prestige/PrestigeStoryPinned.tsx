import { useEmpireScrollDirector } from "../ScrollDirector";
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
 * PrestigeStoryPinned — sezione sticky con horizontal scroll guidato dal verticale.
 * Trasforma "Caos" in "Empire" mentre l'utente scorre; usa --empire-progress.
 */
export default function PrestigeStoryPinned() {
  const t = useT();
  const { ref, progress } = useEmpireScrollDirector<HTMLDivElement>("prestige-story", { steps: 4 });

  // mappa progress → split di transizione (0..1) tra caos e empire
  const split = Math.min(1, Math.max(0, (progress - 0.18) / 0.6));

  return (
    <section
      ref={ref}
      data-section="prestige-story"
      className="prestige-section prestige-dark relative scroll-mt-24"
      style={{ height: "min(200svh, 1600px)" }}
    >
      <div className="prestige-story-sticky sticky top-0 flex h-[100svh] w-full items-center overflow-hidden pt-20 sm:pt-16">

        {/* Sfondo che vira da rosso bruciato a oro smeraldo */}
        <div
          className="absolute inset-0 transition-[background] duration-200"
          style={{
            background: `radial-gradient(ellipse 60% 45% at ${20 + split * 60}% 50%, hsl(${0 + split * 158} ${60 + split * 10}% ${20 + split * 25}% / ${0.5 - split * 0.2}), transparent 60%)`,
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
            <h2 className="prestige-display mt-3 text-2xl font-semibold sm:text-5xl md:text-6xl break-words leading-tight">
              <span
                className="italic line-through"
                style={{
                  color: `hsl(0 ${70 - split * 70}% ${65 - split * 25}% / ${1 - split * 0.7})`,
                  textDecorationColor: `hsl(0 70% 60% / ${1 - split})`,
                  transition: "color .3s",
                }}
              >
                {t({ it: "Caos quotidiano", en: "Daily chaos" })}
              </span>{" "}
              <span style={{ opacity: 0.4 + split * 0.6 }}>→</span>{" "}
              <span
                className="prestige-gold-text italic"
                style={{ opacity: 0.3 + split * 0.7, transition: "opacity .3s" }}
              >
                {t({ it: "Impero ordinato", en: "Ordered empire" })}
              </span>
            </h2>
            <div className="prestige-divider mx-auto mt-5" />
          </div>


          {/* Track orizzontale: due colonne che si scambiano peso visivo */}
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            {/* PRIMA */}
            <div
              className="prestige-card"
              style={{
                borderColor: `hsl(0 ${60 - split * 30}% 50% / ${0.45 - split * 0.3})`,
                opacity: 1 - split * 0.55,
                transform: `translateX(${-split * 40}px) scale(${1 - split * 0.06})`,
                filter: `grayscale(${split * 0.6}) blur(${split * 1.5}px)`,
                transition: "transform .25s linear, opacity .25s linear, filter .25s linear",
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
                  boxShadow: `0 0 ${20 + split * 50}px hsl(var(--pr-gold) / ${0.3 + split * 0.6})`,
                  transform: `scale(${0.85 + split * 0.4}) rotate(${split * 360}deg)`,
                  transition: "transform .25s linear, box-shadow .25s linear",
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
                  transform: `rotate(${90 + split * 180}deg) scale(${0.9 + split * 0.4})`,
                  transition: "transform .25s linear",
                }}
              />
            </div>

            {/* DOPO */}
            <div
              className="prestige-card"
              style={{
                borderColor: `hsl(var(--pr-gold) / ${0.2 + split * 0.45})`,
                transform: `translateX(${split * 40}px) scale(${0.94 + split * 0.06})`,
                opacity: 0.55 + split * 0.45,
                boxShadow: `0 ${20 + split * 30}px ${40 + split * 40}px -20px hsl(var(--pr-gold) / ${0.15 + split * 0.4})`,
                transition: "transform .25s linear, opacity .25s linear, box-shadow .25s linear",
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

          {/* Progress dots della sezione */}
          <div className="mt-10 flex justify-center gap-1.5">
            {[0, 0.33, 0.66, 1].map((threshold, i) => {
              const active = split >= threshold - 0.05;
              return (
                <span
                  key={i}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: active ? 28 : 8,
                    background: active ? "hsl(var(--pr-gold))" : "hsl(var(--pr-gold) / 0.25)",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
