import { useEffect, useRef } from "react";
import {
  Globe, MessageCircle, Phone, CalendarCheck, ShoppingBag, Star,
  Megaphone, BarChart3, Users, CreditCard, Bot, Sparkles,
} from "lucide-react";
import { useT } from "./PrestigeLang";

/**
 * PrestigeCapabilities — "Tutto quello che Empire fa per il tuo business"
 * Additive-only. Editorial bento with per-capability metric + micro-scenario.
 * Uses 3D tilt (inherits from PrestigeEffects), scroll reveal, and
 * a subtle scroll-linked parallax on every card.
 */
const CAPS = [
  {
    icon: Globe,
    metric: "72h",
    titleIt: "Sito AI su misura",
    titleEn: "Bespoke AI website",
    descIt: "Un sito che vende davvero: brand, foto, copy, SEO, prenotazioni, pagamenti — cucito sul tuo settore in 72 ore.",
    descEn: "A site that actually sells: brand, photos, copy, SEO, bookings, payments — tailored to your industry in 72h.",
    egIt: "Ristorante → menu digitale + prenotazioni + delivery",
    egEn: "Restaurant → digital menu + bookings + delivery",
  },
  {
    icon: MessageCircle,
    metric: "24/7",
    titleIt: "WhatsApp AI Concierge",
    titleEn: "WhatsApp AI Concierge",
    descIt: "Risponde in italiano, inglese, arabo. Prenota, upselling, incassa. Zero messaggi persi la notte o nel weekend.",
    descEn: "Answers in Italian, English, Arabic. Books, upsells, collects. Zero messages lost at night or weekends.",
    egIt: "Beauty → agenda sempre piena, niente no-show",
    egEn: "Beauty → agenda always full, no no-shows",
  },
  {
    icon: Phone,
    metric: "0 sec",
    titleIt: "Centralino Vocale AI",
    titleEn: "AI Voice Receptionist",
    descIt: "Voce naturale che risponde al primo squillo, filtra, prende prenotazioni e passa in escalation solo il necessario.",
    descEn: "Natural voice that answers on first ring, screens, takes bookings, escalates only what matters.",
    egIt: "NCC → nessuna corsa persa mentre guidi",
    egEn: "NCC → no ride lost while you drive",
  },
  {
    icon: CalendarCheck,
    metric: "-38%",
    titleIt: "Prenotazioni Smart",
    titleEn: "Smart Bookings",
    descIt: "Calendario intelligente con conferme, reminder, deposito. Taglia i no-show fino al 38%.",
    descEn: "Smart calendar with confirmations, reminders, deposits. Cuts no-shows up to 38%.",
    egIt: "Fitness → corsi pieni, lista d'attesa auto",
    egEn: "Fitness → full classes, auto waitlist",
  },
  {
    icon: ShoppingBag,
    metric: "+27%",
    titleIt: "Ordini & Delivery",
    titleEn: "Orders & Delivery",
    descIt: "Menu digitale, ordini al tavolo, take-away, delivery diretto — senza commissioni terze parti.",
    descEn: "Digital menu, table orders, take-away, direct delivery — no third-party fees.",
    egIt: "Pizzeria → +27% scontrino medio con upselling AI",
    egEn: "Pizzeria → +27% avg ticket with AI upselling",
  },
  {
    icon: Star,
    metric: "★ 4.8+",
    titleIt: "Recensioni & Reputazione",
    titleEn: "Reviews & Reputation",
    descIt: "Chiede recensioni al momento giusto, intercetta i negativi in privato, risponde con tono brand-safe.",
    descEn: "Asks for reviews at the right moment, catches negatives privately, replies brand-safe.",
    egIt: "Hotel → da 3.9 a 4.6 stelle in 90 giorni",
    egEn: "Hotel → from 3.9 to 4.6 stars in 90 days",
  },
  {
    icon: Megaphone,
    metric: "Autopilot",
    titleIt: "Marketing Autopilot",
    titleEn: "Marketing Autopilot",
    descIt: "Post social, campagne Meta/Google, newsletter, WhatsApp broadcast — pianificati e pubblicati in automatico.",
    descEn: "Social posts, Meta/Google ads, newsletters, WhatsApp broadcasts — auto-planned and published.",
    egIt: "Beauty → 4 post/settimana + campagne stagionali",
    egEn: "Beauty → 4 posts/week + seasonal campaigns",
  },
  {
    icon: Users,
    metric: "360°",
    titleIt: "CRM Clienti 360°",
    titleEn: "360° Customer CRM",
    descIt: "Ogni cliente ha una scheda viva: preferenze, ordini, appuntamenti, spesa, fedeltà. L'AI suggerisce l'azione giusta.",
    descEn: "Every customer gets a living profile: preferences, orders, appointments, spend, loyalty. AI suggests next best action.",
    egIt: "Ristorante → riconosci i top spender in tempo reale",
    egEn: "Restaurant → spot top spenders in real-time",
  },
  {
    icon: CreditCard,
    metric: "1-tap",
    titleIt: "Pagamenti & Fatture",
    titleEn: "Payments & Invoicing",
    descIt: "Stripe, satispay, POS collegati. Fatturazione elettronica e scontrini fiscali automatici.",
    descEn: "Stripe, Satispay, POS connected. E-invoicing and fiscal receipts fully automated.",
    egIt: "NCC → paga con link, fattura in 30 secondi",
    egEn: "NCC → pay by link, invoice in 30 seconds",
  },
  {
    icon: BarChart3,
    metric: "Live",
    titleIt: "Dashboard Operativa",
    titleEn: "Operations Dashboard",
    descIt: "Un solo pannello: incassi, prenotazioni, stock, staff, KPI. Nessun tab da tenere aperto.",
    descEn: "One panel: revenue, bookings, stock, staff, KPIs. No tabs to keep open.",
    egIt: "Ovunque → apri, capisci in 5 secondi",
    egEn: "Anywhere → open, understand in 5 seconds",
  },
  {
    icon: Bot,
    metric: "12+",
    titleIt: "Agenti AI Specialisti",
    titleEn: "Specialist AI Agents",
    descIt: "12+ agenti verticali: sales, HR, contabilità, HACCP, ispezione flotta, social. Lavorano in team, in silenzio.",
    descEn: "12+ vertical agents: sales, HR, accounting, HACCP, fleet ops, social. Work as a team, silently.",
    egIt: "Hotel → concierge multilingua + revenue manager",
    egEn: "Hotel → multilingual concierge + revenue manager",
  },
  {
    icon: Sparkles,
    metric: "1:1",
    titleIt: "Onboarding Guidato",
    titleEn: "Guided Onboarding",
    descIt: "Uno stratega Empire ti prende per mano. Import dati, brand, formazione, go-live. Zero tecnicismi.",
    descEn: "An Empire strategist takes you by the hand. Data import, brand, training, go-live. No jargon.",
    egIt: "Setup 7 giorni → livello enterprise, zero stress",
    egEn: "Setup 7 days → enterprise-grade, zero stress",
  },
] as const;

export default function PrestigeCapabilities() {
  const t = useT();
  const gridRef = useRef<HTMLDivElement>(null);

  // Rotate a subtle 3D tilt across cards driven by scroll progress.
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh));
        el.style.setProperty("--cap-tilt", (p * 6).toFixed(2) + "deg");
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      data-section="prestige-capabilities"
      className="prestige-section prestige-dark relative"
      style={{ paddingTop: "clamp(80px, 12svh, 140px)", paddingBottom: "clamp(80px, 12svh, 140px)" }}
    >
      {/* soft radial spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, hsl(var(--pr-gold) / 0.10), transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Section header */}
        <div className="max-w-3xl">
          <span className="prestige-eyebrow-indexed" data-index="04">
            {t({ it: "Cosa fa Empire per te", en: "What Empire does for you" })}
          </span>
          <h2
            className="prestige-display mt-6"
            style={{ fontSize: "clamp(2rem, 5.6vw, 4.4rem)" }}
          >
            {t({ it: "Un unico sistema.", en: "One single system." })}{" "}
            <span className="prestige-italic prestige-gold-text">
              {t({ it: "Dodici superpoteri.", en: "Twelve superpowers." })}
            </span>
          </h2>
          <p
            className="mt-6 text-base sm:text-lg leading-relaxed"
            style={{ color: "hsl(var(--pr-muted-on-dark))", maxWidth: 640 }}
          >
            {t({
              it: "Sito, WhatsApp, centralino, prenotazioni, ordini, recensioni, marketing, CRM, pagamenti, dashboard, agenti verticali e onboarding umano. Nessun tool da incollare: Empire è già tutto.",
              en: "Website, WhatsApp, phone, bookings, orders, reviews, marketing, CRM, payments, dashboard, vertical agents and human onboarding. No tools to duct-tape: Empire is already everything.",
            })}
          </p>
        </div>

        {/* Bento grid */}
        <div
          ref={gridRef}
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          style={{
            perspective: "1600px",
            transformStyle: "preserve-3d",
          }}
        >
          {CAPS.map((c, i) => {
            const Icon = c.icon;
            // vary card height / span for editorial rhythm
            const isFeatured = i === 0 || i === 5 || i === 10;
            return (
              <article
                key={c.titleIt}
                className={`prestige-card prestige-card-gilt relative overflow-hidden ${isFeatured ? "lg:col-span-1 lg:row-span-1" : ""}`}
                style={{
                  transform: "rotateX(var(--cap-tilt, 0deg))",
                  transformStyle: "preserve-3d",
                  minHeight: 260,
                  padding: "1.5rem 1.5rem 1.35rem",
                }}
                data-parallax={(6 + (i % 4) * 4).toString()}
              >
                {/* metric */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(var(--pr-gold) / 0.18), hsl(var(--pr-gold) / 0.04))",
                      border: "1px solid hsl(var(--pr-gold) / 0.35)",
                      color: "hsl(var(--pr-gold-light))",
                    }}
                  >
                    <Icon size={20} strokeWidth={1.6} />
                  </div>
                  <span
                    className="text-[11px] uppercase tracking-[0.28em] font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      color: "hsl(var(--pr-gold-light))",
                      background: "hsl(var(--pr-gold) / 0.10)",
                      border: "1px solid hsl(var(--pr-gold) / 0.30)",
                    }}
                  >
                    {c.metric}
                  </span>
                </div>

                <h3
                  className="mt-6 text-[1.35rem] sm:text-[1.5rem] leading-tight"
                  style={{
                    fontFamily: "'DM Serif Display', Georgia, serif",
                    color: "hsl(var(--pr-text-on-dark))",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {t({ it: c.titleIt, en: c.titleEn })}
                </h3>

                <p
                  className="mt-3 text-[14px] leading-relaxed"
                  style={{ color: "hsl(var(--pr-muted-on-dark))" }}
                >
                  {t({ it: c.descIt, en: c.descEn })}
                </p>

                <div
                  className="mt-5 pt-4 border-t text-[12px] leading-snug"
                  style={{
                    borderColor: "hsl(var(--pr-gold) / 0.18)",
                    color: "hsl(var(--pr-gold-light))",
                    fontFamily: "'Fira Sans', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.01em",
                  }}
                >
                  <span
                    className="inline-block mr-2 align-middle"
                    style={{
                      width: 6, height: 6, transform: "rotate(45deg)",
                      background: "linear-gradient(135deg, hsl(var(--pr-gold-light)), hsl(var(--pr-gold-deep)))",
                    }}
                  />
                  {t({ it: c.egIt, en: c.egEn })}
                </div>
              </article>
            );
          })}
        </div>

        {/* Inline conversion strip */}
        <div
          className="mt-16 rounded-3xl overflow-hidden relative prestige-shimmer prestige-corners"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--pr-emerald-mid) / 0.85), hsl(var(--pr-emerald-deep)))",
            border: "1px solid hsl(var(--pr-gold) / 0.35)",
            padding: "clamp(1.75rem, 4vw, 3rem)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_auto] gap-8 items-center relative z-10">
            <div>
              <span className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-light))" }}>
                {t({ it: "Il tuo prossimo passo", en: "Your next step" })}
              </span>
              <h3
                className="prestige-display mt-4"
                style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.8rem)" }}
              >
                {t({
                  it: "Vedi il tuo impero, prima di comprarlo.",
                  en: "See your empire, before you buy it.",
                })}
              </h3>
              <p
                className="mt-4 text-[15px] leading-relaxed max-w-xl"
                style={{ color: "hsl(var(--pr-muted-on-dark))" }}
              >
                {t({
                  it: "Ti costruiamo un mockup gratuito del tuo sito e del tuo pannello Empire. In 24 ore. Zero impegno.",
                  en: "We build you a free mockup of your website and Empire dashboard. In 24h. Zero commitment.",
                })}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#prestige-lead-form"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("prestige-lead-form")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="prestige-cta justify-center"
              >
                {t({ it: "Richiedi mockup gratis", en: "Get free mockup" })}
              </a>
              <a
                href="#prestige-mockups"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("prestige-mockups")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="prestige-cta-ghost justify-center"
              >
                {t({ it: "Vedi esempi reali", en: "See real examples" })}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
