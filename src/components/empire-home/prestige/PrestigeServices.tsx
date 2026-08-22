import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent, useReducedMotion, type MotionValue } from "framer-motion";
import { useEmpireScrollDirector } from "../ScrollDirector";
import { Globe, Smartphone, Bot, MessageSquare, CreditCard, BarChart3, type LucideIcon } from "lucide-react";

type Service = { icon: LucideIcon; title: string; desc: string; bullets: string[] };

/** Switch mobile (stack carousel) / desktop (griglia). */
function useIsNarrow() {
  const [narrow, setNarrow] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia("(max-width: 767px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return narrow;
}


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

/** Tappe reali del progetto — trasparenza sui tempi. */
const MILESTONES = [
  { label: "Analisi", when: "Giorno 1" },
  { label: "Design", when: "Giorni 2–3" },
  { label: "Sviluppo", when: "Giorni 3–5" },
  { label: "Collaudo", when: "Giorno 6" },
  { label: "Lancio", when: "Giorno 7" },
];

/** Stack tecnologico effettivamente in uso sulla piattaforma. */
const TECH_STACK = [
  "React",
  "TypeScript",
  "Tailwind",
  "Supabase",
  "Stripe",
  "WhatsApp API",
  "Gemini AI",
  "Hosting UE",
];

export default function PrestigeServices() {
  const { ref } = useEmpireScrollDirector<HTMLDivElement>("prestige-services", { steps: SERVICES.length });
  const isNarrow = useIsNarrow();


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
            <h2 className="prestige-display mt-4 text-4xl font-semibold sm:text-5xl lg:text-6xl" style={{ color: "hsl(var(--pr-text-on-light))" }}>
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
            {isNarrow ? (
              <ServicesScrollStack />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {SERVICES.map((s, i) => (
                  <ServiceCard
                    key={s.title}
                    service={s}
                    style={{
                      animation: `prestigeSlideIn .8s ${i * 0.06}s cubic-bezier(.22,1,.36,1) backwards`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

        {/* MILESTONES + TECH STACK — trasparenza di processo e stack */}
        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="prestige-card lg:col-span-7">
            <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-deep))" }}>
              Come procede il progetto
            </div>
            <ol className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-3">
              {MILESTONES.map((m, i) => (
                <li key={m.label} className="relative flex flex-1 items-start gap-3 sm:flex-col sm:items-center sm:text-center">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--pr-emerald) / 0.95), hsl(var(--pr-emerald-deep)))",
                      color: "hsl(var(--pr-gold-light))",
                    }}
                  >
                    {i + 1}
                  </span>
                  {i < MILESTONES.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-4 top-8 hidden h-[calc(100%-2rem)] w-px sm:left-1/2 sm:top-4 sm:block sm:h-px sm:w-full"
                      style={{ background: "hsl(var(--pr-gold) / 0.28)" }}
                    />
                  )}
                  <div className="min-w-0 sm:mt-2">
                    <div
                      className="text-sm font-semibold"
                      style={{ color: "hsl(var(--pr-text-on-light))" }}
                    >
                      {m.label}
                    </div>
                    <div className="text-[11px]" style={{ color: "hsl(var(--pr-muted-on-light))" }}>
                      {m.when}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="prestige-card lg:col-span-5">
            <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-deep))" }}>
              Tecnologie che usiamo
            </div>
            <p className="mt-3 text-sm" style={{ color: "hsl(var(--pr-muted-on-light))" }}>
              Stack moderno, nessun lock-in artigianale: gli stessi strumenti delle app che usi ogni giorno.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {TECH_STACK.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold"
                  style={{
                    background: "hsl(var(--pr-gold) / 0.12)",
                    color: "hsl(var(--pr-gold-deep))",
                    border: "1px solid hsl(var(--pr-gold) / 0.3)",
                  }}
                >
                  {tech}
                </li>
              ))}
            </ul>
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

/** Card servizio riutilizzabile (griglia desktop + stack mobile). */
function ServiceCard({
  service,
  style,
  className = "",
}: {
  service: Service;
  style?: CSSProperties;
  className?: string;
}) {
  const Icon = service.icon;
  return (
    <article className={`prestige-card group ${className}`} style={style}>
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
        {service.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "hsl(var(--pr-muted-on-light))" }}>
        {service.desc}
      </p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {service.bullets.map((b) => (
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
}

/**
 * MOBILE — carosello a pila scroll-driven: le card salgono dal basso,
 * si posano al centro e si impilano verso l'alto rimpicciolendosi.
 * Effetto distinto dal carosello orizzontale del "metodo Empire".
 */
function ServicesScrollStack() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const total = SERVICES.length;
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 240, damping: 40, mass: 0.2, restDelta: 0.0005 });
  const [active, setActive] = useState(0);
  useMotionValueEvent(p, "change", (v) => setActive(Math.min(total - 1, Math.max(0, Math.round(v * (total - 1))))));

  if (reduce) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {SERVICES.map((s) => (
          <ServiceCard key={s.title} service={s} />
        ))}
      </div>
    );
  }

  return (
    <div ref={trackRef} className="prestige-svcstack-track" style={{ height: `${total * 88}svh` }}>
      <div className="prestige-svcstack-viewport">
        <div className="prestige-svcstack-stage">
          {SERVICES.map((s, i) => (
            <StackCard key={s.title} service={s} index={i} total={total} progress={p} />
          ))}
        </div>
        <div className="prestige-svcstack-dots" role="tablist" aria-label="Servizi">
          {SERVICES.map((s, i) => (
            <button
              key={s.title}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={s.title}
              data-active={i === active ? "true" : undefined}
              onClick={() => {
                const el = trackRef.current;
                if (!el) return;
                const top = el.offsetTop + (el.offsetHeight - window.innerHeight) * (i / Math.max(1, total - 1));
                window.scrollTo({ top, behavior: "smooth" });
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        .prestige-svcstack-track { position: relative; }
        .prestige-svcstack-viewport {
          position: sticky; top: 0; height: 100svh;
          display: flex; flex-direction: column; justify-content: center;
          overflow: hidden;
        }
        .prestige-svcstack-stage {
          position: relative; height: 62svh; perspective: 1000px;
        }
        .prestige-svcstack-card {
          position: absolute; left: 0; right: 0; top: 0;
          transform-style: preserve-3d; will-change: transform, opacity;
          border-radius: 1.25rem;
          background: hsl(var(--pr-ivory, 40 30% 97%));
          box-shadow: 0 26px 60px -30px hsl(160 40% 8% / .45);
          overflow: hidden;
        }
        .prestige-svcstack-card > .prestige-card {
          border-radius: 1.25rem; background: transparent; box-shadow: none;
        }
        .prestige-svcstack-dots {
          display: flex; align-items: center; gap: .45rem;
          justify-content: center; padding-top: 1.25rem;
        }
        .prestige-svcstack-dots > button {
          flex: 0 0 auto;
          height: .5rem !important; width: .5rem; min-width: 0; padding: 0;
          border: 0; border-radius: 999px; appearance: none;
          background: hsl(var(--pr-emerald) / .22);
          transition: width .3s ease, background .3s ease;
        }
        .prestige-svcstack-dots > button[data-active] {
          width: 1.6rem; background: hsl(var(--pr-gold));
        }

      `}</style>
    </div>
  );
}

function StackCard({
  service,
  index,
  total,
  progress,
}: {
  service: Service;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const d = useTransform(progress, (v) => v * (total - 1) - index);
  const y = useTransform(d, (v) => (v <= 0 ? `${-v * 105}%` : `${-v * 6}%`));
  const scale = useTransform(d, (v) => (v <= 0 ? 1 : Math.max(0.82, 1 - v * 0.07)));
  const rotateX = useTransform(d, (v) => (v <= 0 ? Math.max(-10, v * 10) : Math.min(8, v * 3)));
  const opacity = useTransform(d, (v) => (v < -1.08 ? 0 : v > 2.4 ? 0 : v > 1.4 ? 0.4 : 1));

  return (
    <motion.div
      className="prestige-svcstack-card"
      style={{ y, scale, rotateX, opacity, zIndex: index + 1 }}
    >
      <ServiceCard service={service} />
    </motion.div>
  );
}
