import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, X, Check, Quote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmpireScrollDirector } from "../ScrollDirector";
import { createMockupPool } from "@/lib/mockup-pool";
import PrestigePhone, { PHONE_VIEWS } from "./PrestigePhone";

/**
 * PrestigePortfolioCarousel — horizontal swipe carousel + fullscreen detail modal.
 * Inspired by Lowengeld's /flame-kebab case study, adapted for Empire's
 * persuasive narrative (problem → solution → result).
 *
 * Each project ships 4 unique mockups (Home / Admin / App / AI) — never repeated
 * across the homepage thanks to the global mockup pool.
 */

const pool = createMockupPool();

interface Project {
  id: string;
  tag: string;
  subtag: string;
  /** Tailwind class pair for pastel pills: [bg, text] */
  pill: { bg: string; text: string };
  pill2: { bg: string; text: string };
  title: string;
  city: string;
  oneLiner: string;
  problem: string[];
  solution: string[];
  results: { value: string; label: string }[];
  testimonial: { quote: string; author: string; role: string };
  /** 4 distinct screens — Home / Admin / App / AI */
  screens: string[];
  cover: string;
  accent: string;
}


const PROJECTS: Project[] = [
  {
    id: "strapizzami",
    tag: "Food",
    subtag: "Pizzeria",
    pill: { bg: "hsl(20 90% 92%)", text: "hsl(20 80% 38%)" },
    pill2: { bg: "hsl(20 60% 95%)", text: "hsl(20 50% 35%)" },
    title: "Strapizzami",

    city: "Milano",
    oneLiner: "Da pizzeria di quartiere a marchio digitale che vende anche di notte.",
    problem: [
      "Telefono sempre occupato durante il rush serale",
      "Ordini WhatsApp persi tra centinaia di messaggi",
      "Nessun modo per riconoscere i clienti fedeli",
    ],
    solution: [
      "Sito menu digitale con ordini diretti in cassa",
      "AI che risponde a WhatsApp 24/7 in 12 secondi",
      "Programma fedeltà automatico con punti e premi",
    ],
    results: [
      { value: "+38%", label: "ordini serali" },
      { value: "0", label: "chiamate perse" },
      { value: "12s", label: "tempo risposta" },
    ],
    testimonial: {
      quote: "Prima rifiutavamo ordini perché il telefono era sempre occupato. Adesso l'AI risponde a tutti, anche quando chiudiamo.",
      author: "Marco R.",
      role: "Titolare",
    },
    screens: pool.images(4),
    cover: "",
    accent: "hsl(20 80% 50%)",
  },
  {
    id: "paperfish",
    tag: "Food",
    subtag: "Sushi",
    pill: { bg: "hsl(20 90% 92%)", text: "hsl(20 80% 38%)" },
    pill2: { bg: "hsl(340 60% 94%)", text: "hsl(340 55% 40%)" },
    title: "Paperfish",

    city: "Roma",
    oneLiner: "L'esperienza del ristorante stellato, anche prima di entrare.",
    problem: [
      "Prenotazioni gestite a mano da un solo cameriere",
      "Clienti che non si presentano (15% no-show)",
      "Nessuna immagine digitale del fine dining",
    ],
    solution: [
      "Sito editoriale con storytelling dei piatti",
      "Prenotazioni con conferma + reminder automatici",
      "Admin con calendario sale + lista d'attesa intelligente",
    ],
    results: [
      { value: "−92%", label: "no-show" },
      { value: "+24%", label: "scontrino medio" },
      { value: "4.9★", label: "Google reviews" },
    ],
    testimonial: {
      quote: "Il sito comunica esattamente l'eleganza che viviamo in sala. I clienti arrivano già preparati all'esperienza.",
      author: "Yuki T.",
      role: "Executive Chef",
    },
    screens: pool.images(4),
    cover: "",
    accent: "hsl(340 50% 55%)",
  },
  {
    id: "empire-ncc",
    tag: "Travel",
    subtag: "NCC Luxury",
    pill: { bg: "hsl(210 70% 92%)", text: "hsl(210 65% 35%)" },
    pill2: { bg: "hsl(45 70% 90%)", text: "hsl(45 70% 32%)" },
    title: "Empire NCC",

    city: "Milano · Como · Sankt Moritz",
    oneLiner: "Un centralino AI che parla 4 lingue e non dorme mai.",
    problem: [
      "Richieste internazionali fuori orario",
      "Preventivi calcolati a mano con errori",
      "Autisti senza visibilità sulla giornata",
    ],
    solution: [
      "Sito multilingua con preventivo istantaneo",
      "AI vocale che gestisce richieste in IT/EN/FR/RU",
      "App autisti con corse, pagamenti e fatturazione",
    ],
    results: [
      { value: "×3.2", label: "richieste serali" },
      { value: "100%", label: "lingue coperte" },
      { value: "−70%", label: "tempo amministrativo" },
    ],
    testimonial: {
      quote: "Ricevo prenotazioni da clienti russi alle 3 di notte. Prima era impossibile. Oggi è normale.",
      author: "Alessandro V.",
      role: "Founder",
    },
    screens: pool.images(4),
    cover: "",
    accent: "hsl(45 70% 55%)",
  },
  {
    id: "velvet-studio",
    tag: "Beauty & Spa",
    title: "Velvet Studio",
    city: "Torino",
    oneLiner: "Agenda piena tutti i giorni, senza alzare mai il telefono.",
    problem: [
      "Receptionist passa metà del tempo al telefono",
      "Cancellazioni dell'ultimo minuto difficili da riempire",
      "Nessuna comunicazione post-trattamento",
    ],
    solution: [
      "Booking online con scelta operatore + servizio",
      "AI WhatsApp per spostamenti e liste d'attesa",
      "App cliente con storico e promemoria home-care",
    ],
    results: [
      { value: "+47%", label: "occupazione agenda" },
      { value: "−60%", label: "no-show" },
      { value: "8h/sett.", label: "tempo recuperato" },
    ],
    testimonial: {
      quote: "La mia receptionist finalmente fa quello per cui l'ho assunta: coccolare i clienti in salone.",
      author: "Giulia M.",
      role: "Owner",
    },
    screens: pool.images(4),
    cover: "",
    accent: "hsl(320 50% 60%)",
  },
  {
    id: "asinara-resort",
    tag: "Boutique Hotel",
    title: "Asinara Resort",
    city: "Sardegna",
    oneLiner: "Concierge digitale 24/7, in 6 lingue, sempre sul tono giusto.",
    problem: [
      "Ospiti internazionali con richieste a tutte le ore",
      "Booking diretti persi a vantaggio degli OTA",
      "Servizi extra (escursioni, spa) sotto-venduti",
    ],
    solution: [
      "Sito direct-booking con mappa esperienze",
      "Concierge AI multilingua su WhatsApp",
      "Admin con upselling automatico pre e post check-in",
    ],
    results: [
      { value: "+58%", label: "booking diretti" },
      { value: "+31%", label: "ricavi extra" },
      { value: "6", label: "lingue native" },
    ],
    testimonial: {
      quote: "Abbiamo dimezzato la commissione Booking.com e gli ospiti dicono che il nostro 'concierge' è il migliore mai avuto.",
      author: "Paolo F.",
      role: "General Manager",
    },
    screens: pool.images(4),
    cover: "",
    accent: "hsl(195 60% 50%)",
  },
  {
    id: "iron-club",
    tag: "Fitness & Wellness",
    title: "Iron Club",
    city: "Bologna",
    oneLiner: "Onboarding nuovi membri 100% automatico, in 4 minuti.",
    problem: [
      "Trial gratuiti senza follow-up = zero conversioni",
      "Pagamenti ricorrenti gestiti a mano",
      "Nessun contatto tra trainer e membri fuori palestra",
    ],
    solution: [
      "Landing trial con prenotazione + form medico",
      "App membri con prenotazione corsi + scheda PT",
      "AI che fa follow-up post-trial e propone abbonamento",
    ],
    results: [
      { value: "+72%", label: "trial → abbonati" },
      { value: "−85%", label: "ore amministrative" },
      { value: "4.8★", label: "App rating" },
    ],
    testimonial: {
      quote: "L'AI converte i trial meglio del miglior commerciale che abbia mai avuto. E lavora di domenica.",
      author: "Luca B.",
      role: "Co-Founder",
    },
    screens: pool.images(4),
    cover: "",
    accent: "hsl(15 75% 55%)",
  },
];

// Use the first (Home) screen as cover
PROJECTS.forEach((p) => (p.cover = p.screens[0]));

export default function PrestigePortfolioCarousel() {
  const navigate = useNavigate();
  const { ref } = useEmpireScrollDirector<HTMLDivElement>("prestige-mockups", { steps: 4 });
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);

  const open = openId ? PROJECTS.find((p) => p.id === openId) ?? null : null;

  // Snap-scroll observer to highlight current slide
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const slides = Array.from(el.querySelectorAll<HTMLElement>("[data-slide]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.5) {
            const idx = Number(e.target.getAttribute("data-slide"));
            setActiveIdx(idx);
          }
        });
      },
      { root: el, threshold: [0.5, 0.75] },
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const w = el.clientWidth * 0.85;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      id="prestige-mockups"
      data-section="prestige-mockups"
      className="prestige-section prestige-light py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-deep))" }}>
              ✦ Casi reali · Risultati certificati
            </div>
            <h2
              className="prestige-display mt-3 text-4xl font-semibold sm:text-5xl md:text-6xl"
              style={{ color: "hsl(var(--pr-text-on-light))" }}
            >
              Un sito non basta.<br />
              <span className="prestige-gold-text">Costruiamo ecosistemi.</span>
            </h2>
          </div>
          <p
            className="max-w-sm text-sm sm:text-base"
            style={{ color: "hsl(var(--pr-muted-on-light))" }}
          >
            Ogni progetto include sito vetrina, dashboard admin, app cliente e agente AI su WhatsApp.
            Tocca un caso per vedere problema, soluzione e risultati ottenuti.
          </p>
        </div>

        {/* Desktop arrows */}
        <div className="mt-10 hidden items-center justify-end gap-2 sm:flex">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Progetto precedente"
            className="prestige-arrow"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Progetto successivo"
            className="prestige-arrow"
          >
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Carousel track */}
        <div
          ref={trackRef}
          className="prestige-portfolio-track mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-8 sm:gap-7"
          style={{ scrollPaddingLeft: "1.25rem", scrollbarWidth: "none" }}
        >
          {PROJECTS.map((p, i) => (
            <article
              key={p.id}
              data-slide={i}
              className="snap-start shrink-0"
              style={{ width: "min(82vw, 340px)" }}
            >
              <button
                onClick={() => setOpenId(p.id)}
                className="group block w-full text-left"
              >
                <div
                  className="relative aspect-[4/5] overflow-hidden rounded-3xl"
                  style={{
                    background: `linear-gradient(155deg, ${p.accent}, hsl(var(--pr-emerald-deep)))`,
                    boxShadow: "0 25px 60px -25px hsl(var(--pr-emerald) / 0.6)",
                  }}
                >
                  <img
                    src={p.cover}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-90 transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06] group-active:scale-[1.02]"
                  />
                  {/* Bottom gradient + tag */}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent, hsl(var(--pr-emerald-deep) / 0.92))",
                    }}
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span
                        className="inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          background: "hsl(var(--pr-gold))",
                          color: "hsl(var(--pr-emerald-deep))",
                        }}
                      >
                        {p.tag}
                      </span>
                      <h3
                        className="prestige-display mt-2 text-2xl font-semibold text-white"
                        style={{ textShadow: "0 2px 14px hsl(0 0% 0% / 0.5)" }}
                      >
                        {p.title}
                      </h3>
                      <p className="mt-0.5 text-[11px] uppercase tracking-wider text-white/70">
                        {p.city}
                      </p>
                    </div>
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full"
                      style={{
                        background: "hsl(var(--pr-gold))",
                        color: "hsl(var(--pr-emerald-deep))",
                      }}
                    >
                      <ExternalLink size={14} />
                    </div>
                  </div>
                </div>
                <p
                  className="mt-3 line-clamp-2 text-sm"
                  style={{ color: "hsl(var(--pr-muted-on-light))" }}
                >
                  {p.oneLiner}
                </p>
              </button>
            </article>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5">
          {PROJECTS.map((_, i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === activeIdx ? 22 : 6,
                background:
                  i === activeIdx
                    ? "hsl(var(--pr-gold))"
                    : "hsl(var(--pr-emerald) / 0.25)",
              }}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button onClick={() => navigate("/portfolio")} className="prestige-cta-ghost">
            Esplora il portfolio completo <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Detail modal */}
      {open && <ProjectModal project={open} onClose={() => setOpenId(null)} />}

      <style>{`
        .prestige-portfolio-track::-webkit-scrollbar { display: none; }
        .prestige-arrow {
          width: 44px; height: 44px;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 999px;
          background: hsl(var(--pr-emerald));
          color: hsl(var(--pr-gold-light));
          border: 1px solid hsl(var(--pr-gold) / 0.35);
          transition: transform .25s ease, background .25s ease;
          cursor: pointer;
        }
        .prestige-arrow:hover {
          transform: translateY(-2px);
          background: hsl(var(--pr-emerald-deep));
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────── Modal ─────────────────────── */

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [phoneIdx, setPhoneIdx] = useState(0);

  // ESC to close
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-stretch justify-center overflow-y-auto"
      style={{
        background: "hsl(var(--pr-emerald-deep) / 0.96)",
        backdropFilter: "blur(20px)",
        animation: "prestigeFadeIn .35s ease-out",
      }}
      onClick={onClose}
    >
      <div
        className="relative my-0 w-full max-w-5xl bg-transparent"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "prestigeSlideUp .5s cubic-bezier(.22,1,.36,1)" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Chiudi"
          className="fixed right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full"
          style={{
            background: "hsl(var(--pr-gold))",
            color: "hsl(var(--pr-emerald-deep))",
            boxShadow: "0 8px 30px -8px hsl(0 0% 0% / 0.5)",
          }}
        >
          <X size={20} />
        </button>

        <div className="px-5 py-12 sm:px-10 sm:py-16">
          {/* Header */}
          <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-light))" }}>
            ✦ Caso studio · {project.tag}
          </div>
          <h3
            className="prestige-display mt-3 text-4xl font-semibold sm:text-5xl md:text-6xl"
            style={{ color: "hsl(var(--pr-text-on-dark))" }}
          >
            {project.title}
          </h3>
          <p
            className="mt-2 text-sm uppercase tracking-[0.3em]"
            style={{ color: "hsl(var(--pr-muted-on-dark))" }}
          >
            {project.city}
          </p>
          <p
            className="prestige-display mt-6 max-w-3xl text-xl italic sm:text-2xl"
            style={{ color: "hsl(var(--pr-gold-light))" }}
          >
            "{project.oneLiner}"
          </p>

          {/* Phone showcase — 4 views with switcher */}
          <div className="mt-12 grid gap-10 md:grid-cols-2 md:items-center">
            <div className="flex flex-col items-center">
              <PrestigePhone
                src={project.screens[phoneIdx]}
                label={PHONE_VIEWS[phoneIdx]}
                width={280}
                loading="eager"
              />
              <div className="mt-10 flex gap-2">
                {PHONE_VIEWS.map((v, i) => (
                  <button
                    key={v}
                    onClick={() => setPhoneIdx(i)}
                    className="rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all"
                    style={{
                      background:
                        i === phoneIdx
                          ? "hsl(var(--pr-gold))"
                          : "hsl(var(--pr-emerald-mid) / 0.6)",
                      color:
                        i === phoneIdx
                          ? "hsl(var(--pr-emerald-deep))"
                          : "hsl(var(--pr-gold-light))",
                      border:
                        i === phoneIdx
                          ? "1px solid transparent"
                          : "1px solid hsl(var(--pr-gold) / 0.3)",
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Problem / Solution */}
            <div className="space-y-8">
              <div>
                <div
                  className="prestige-eyebrow"
                  style={{ color: "hsl(var(--pr-gold-light))" }}
                >
                  Il problema
                </div>
                <ul className="mt-3 space-y-2">
                  {project.problem.map((t) => (
                    <li
                      key={t}
                      className="flex gap-2 text-sm sm:text-base"
                      style={{ color: "hsl(var(--pr-muted-on-dark))" }}
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400/80" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div
                  className="prestige-eyebrow"
                  style={{ color: "hsl(var(--pr-gold-light))" }}
                >
                  La nostra soluzione
                </div>
                <ul className="mt-3 space-y-2">
                  {project.solution.map((t) => (
                    <li
                      key={t}
                      className="flex gap-2 text-sm sm:text-base"
                      style={{ color: "hsl(var(--pr-text-on-dark))" }}
                    >
                      <Check
                        size={16}
                        className="mt-1 shrink-0"
                        style={{ color: "hsl(var(--pr-gold-light))" }}
                      />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mt-16">
            <div
              className="prestige-eyebrow text-center"
              style={{ color: "hsl(var(--pr-gold-light))" }}
            >
              Risultati a 90 giorni
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-6">
              {project.results.map((r) => (
                <div
                  key={r.label}
                  className="rounded-2xl p-4 text-center sm:p-6"
                  style={{
                    background: "hsl(var(--pr-emerald-mid) / 0.5)",
                    border: "1px solid hsl(var(--pr-gold) / 0.25)",
                  }}
                >
                  <div
                    className="prestige-display text-3xl font-semibold sm:text-5xl"
                    style={{ color: "hsl(var(--pr-gold-light))" }}
                  >
                    {r.value}
                  </div>
                  <div
                    className="mt-1 text-[10px] uppercase tracking-wider sm:text-xs"
                    style={{ color: "hsl(var(--pr-muted-on-dark))" }}
                  >
                    {r.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div
            className="mt-16 rounded-3xl p-6 sm:p-10"
            style={{
              background:
                "linear-gradient(145deg, hsl(var(--pr-emerald-mid) / 0.6), hsl(var(--pr-emerald) / 0.3))",
              border: "1px solid hsl(var(--pr-gold) / 0.3)",
            }}
          >
            <Quote
              size={28}
              style={{ color: "hsl(var(--pr-gold))" }}
              className="opacity-80"
            />
            <p
              className="prestige-display mt-3 text-lg italic sm:text-2xl"
              style={{ color: "hsl(var(--pr-text-on-dark))" }}
            >
              {project.testimonial.quote}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full font-semibold"
                style={{
                  background: "hsl(var(--pr-gold))",
                  color: "hsl(var(--pr-emerald-deep))",
                }}
              >
                {project.testimonial.author[0]}
              </div>
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: "hsl(var(--pr-text-on-dark))" }}
                >
                  {project.testimonial.author}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "hsl(var(--pr-muted-on-dark))" }}
                >
                  {project.testimonial.role} · {project.title}
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <h4
              className="prestige-display text-2xl font-semibold sm:text-3xl"
              style={{ color: "hsl(var(--pr-text-on-dark))" }}
            >
              Vuoi un risultato così per la tua attività?
            </h4>
            <p
              className="max-w-md text-sm"
              style={{ color: "hsl(var(--pr-muted-on-dark))" }}
            >
              Ti costruiamo lo stesso ecosistema, calibrato sul tuo brand, in 24 ore.
              Primi 90 giorni gratis.
            </p>
            <button
              className="prestige-cta"
              onClick={() => {
                onClose();
                window.location.href = "/onboarding";
              }}
            >
              Voglio il mio Empire <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes prestigeFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes prestigeSlideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
