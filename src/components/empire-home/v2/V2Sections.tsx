import { useEffect, useRef, useState } from "react";
import {
  Bot, Calendar, CreditCard, Globe, MessageSquare, ShoppingBag, ShieldCheck, Sparkles, Star, Truck, Users, Zap,
  ChefHat, Scissors, Stethoscope, Wrench, Briefcase, Hammer, Camera, GraduationCap, Building2, Plane, Car,
  ArrowRight, Check, X as XIcon, Headphones, BarChart3, FileText, Layers
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmpireScrollDirector } from "../ScrollDirector";
import { createMockupPool } from "@/lib/mockup-pool";
import PrestigePhone from "../prestige/PrestigePhone";

/* ======================= 1. STORY: Caos → Empire (pinned) ======================= */
export function V2Story() {
  const { ref } = useEmpireScrollDirector<HTMLDivElement>("v2-story", { steps: 3 });
  return (
    <section ref={ref} id="v2-story" className="relative" style={{ height: "260svh" }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* Chaos side */}
        <div
          className="absolute inset-0"
          style={{
            opacity: `calc(1 - var(--empire-progress, 0))`,
            background:
              "radial-gradient(circle at 30% 50%, hsl(0 60% 30% / 0.35), transparent 60%), linear-gradient(135deg, hsl(0 0% 8%), hsl(0 30% 14%))",
          }}
        />
        {/* Empire side */}
        <div
          className="absolute inset-0"
          style={{
            opacity: `var(--empire-progress, 0)`,
            background:
              "radial-gradient(circle at 70% 50%, hsl(var(--v2-glow) / 0.25), transparent 60%), linear-gradient(135deg, hsl(var(--v2-emerald-deep)), hsl(var(--v2-emerald)))",
          }}
        />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-5 lg:grid-cols-2 lg:gap-16 lg:px-10">
          {/* Chaos */}
          <div
            style={{
              transform: `translateX(calc(var(--empire-progress, 0) * -60px)) scale(${1 - 0.04 * 1})`,
              opacity: `calc(1 - var(--empire-progress, 0) * 0.7)`,
              filter: `grayscale(calc(var(--empire-progress, 0) * 100%))`,
            }}
          >
            <div className="v2-eyebrow" style={{ color: "hsl(0 80% 70%)" }}>PRIMA · CAOS QUOTIDIANO</div>
            <h2 className="v2-display mt-4 text-4xl font-semibold sm:text-5xl">
              Telefoni che squillano.<br />Clienti che <span style={{ color: "hsl(0 70% 65%)" }}>scappano</span>.
            </h2>
            <ul className="mt-6 space-y-3 text-base" style={{ color: "hsl(0 30% 80%)" }}>
              {[
                "10 piattaforme diverse, nessuna parla con l'altra",
                "WhatsApp, telefono, email: nulla risponde di notte",
                "Recensioni negative che ammazzano il brand",
                "Staff bruciato in compiti ripetitivi",
                "Clienti VIP dimenticati, fatture in ritardo",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <XIcon size={18} className="mt-0.5 flex-shrink-0" style={{ color: "hsl(0 70% 65%)" }} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Empire */}
          <div
            style={{
              transform: `translateX(calc((1 - var(--empire-progress, 0)) * 60px))`,
              opacity: `calc(var(--empire-progress, 0) * 1.2)`,
            }}
          >
            <div className="v2-eyebrow">DOPO · IMPERO ATTIVO 24/7</div>
            <h2 className="v2-display mt-4 text-4xl font-semibold sm:text-5xl">
              Una <span className="v2-gold-text">AI sola</span><br />comanda tutto.
            </h2>
            <ul className="mt-6 space-y-3 text-base" style={{ color: "hsl(var(--v2-text))" }}>
              {[
                "Sito + app + WhatsApp + telefono in un solo cervello",
                "Risponde, prenota, vende, gestisce reclami h24",
                "Recensioni 5★ filtrate prima di Google",
                "Staff libero di pensare, non di rispondere",
                "Fatture, scadenze, fedeltà: tutto automatico",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <Check size={18} className="mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--v2-glow))" }} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center arrow / E logo rotating */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
          style={{ transform: `translate(-50%, -50%) rotate(calc(var(--empire-progress, 0) * 360deg))` }}
        >
          <div
            className="grid h-20 w-20 place-items-center rounded-full border-2"
            style={{
              borderColor: "hsl(var(--v2-gold) / 0.6)",
              background: "hsl(var(--v2-emerald-deep) / 0.7)",
              boxShadow: "0 0 60px hsl(var(--v2-gold) / 0.4)",
            }}
          >
            <ArrowRight size={28} style={{ color: "hsl(var(--v2-gold-light))" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ======================= 2. SERVICES — alternated rows with iPhone ======================= */
const SERVICES = [
  {
    icon: Globe,
    eyebrow: "SITO + APP CLIENTE",
    title: "La tua vetrina che vende h24.",
    desc: "Sito SEO, multilingua, ultra-veloce + app brandizzata sul telefono dei tuoi clienti. Loro tornano. Noi li trasformiamo in fan.",
    bullets: ["SEO Google primi 3", "App iOS + Android pronta", "Pagamenti integrati", "Push notifications"],
  },
  {
    icon: Bot,
    eyebrow: "AI CONVERSAZIONALE",
    title: "Risponde, prenota, vende. 24/7.",
    desc: "AI parlante per WhatsApp, sito, telefonate. Conosce listino, agenda, clienti VIP. Non dorme mai. Non ammala mai.",
    bullets: ["Voce naturale italiana", "WhatsApp + telefono", "Riconosce VIP e cronologia", "Costo medio 1€/giorno"],
  },
  {
    icon: Calendar,
    eyebrow: "AGENDA + PRENOTAZIONI",
    title: "Una sola agenda. Zero overbooking.",
    desc: "Da Google, Instagram, sito, WhatsApp e chiamate. Tutto su un calendario sincronizzato che la tua AI gestisce per te.",
    bullets: ["Sync Google/Apple", "Conferme automatiche", "Lista d'attesa intelligente", "Cancellazioni gestite dall'AI"],
  },
  {
    icon: CreditCard,
    eyebrow: "FATTURE + CASSA",
    title: "Vault Fiscale 2026 incluso.",
    desc: "Fatturazione elettronica, scontrini, ricevute, pagamenti online e in negozio. Disclaimer auto, conservazione AdE compliant.",
    bullets: ["Fatt. elettronica SDI", "POS + link pagamento", "Scadenzario auto", "Export commercialista"],
  },
  {
    icon: Users,
    eyebrow: "CRM + FEDELTÀ",
    title: "I clienti tornano. Spendono di più.",
    desc: "Schede cliente complete, segmentazione AI, programma fedeltà a punti, recupero clienti persi su WhatsApp.",
    bullets: ["Schede 360°", "Lost-customer recovery", "Wallet fedeltà", "Compleanni automatici"],
  },
  {
    icon: ShieldCheck,
    eyebrow: "REVIEW SHIELD™",
    title: "Recensioni 5★ filtrate prima di Google.",
    desc: "Le esperienze negative arrivano a te in privato. Quelle felici finiscono pubbliche. Reputazione blindata.",
    bullets: ["Filtro intelligente", "Risposte AI premium", "Alert critiche immediati", "Reportistica brand"],
  },
];

export function V2Services() {
  const pool = createMockupPool();
  const mocks = pool.images(SERVICES.length);
  return (
    <section id="v2-services" className="v2-section relative">
      <div className="mx-auto max-w-6xl px-5 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="v2-eyebrow">COSA FACCIAMO</div>
          <h2 className="v2-display mt-3 text-4xl font-semibold sm:text-5xl">
            Una piattaforma. <span className="v2-gold-text">Tutto compreso</span>.
          </h2>
          <div className="v2-divider mx-auto mt-5" />
          <p className="mt-4 text-base" style={{ color: "hsl(var(--v2-text-muted))" }}>
            Niente abbonamenti sparpagliati. Niente integrazioni che si rompono.
            Empire è il sistema operativo del tuo business.
          </p>
        </div>

        <div className="mt-16 space-y-24">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            const reverse = i % 2 === 1;
            return (
              <div
                key={s.title}
                className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14"
              >
                <div className={`lg:col-span-6 ${reverse ? "lg:order-2" : ""}`}>
                  <div className="v2-eyebrow flex items-center gap-2">
                    <Icon size={14} /> {s.eyebrow}
                  </div>
                  <h3 className="v2-display mt-3 text-3xl font-semibold sm:text-4xl">{s.title}</h3>
                  <p className="mt-4 text-base" style={{ color: "hsl(var(--v2-text-muted))" }}>{s.desc}</p>
                  <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm">
                        <Check size={16} style={{ color: "hsl(var(--v2-glow))" }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`relative mx-auto lg:col-span-6 ${reverse ? "lg:order-1" : ""}`}>
                  <div
                    className="pointer-events-none absolute inset-0 -m-8 rounded-[40px]"
                    style={{
                      background:
                        "radial-gradient(circle at center, hsl(var(--v2-gold) / 0.18), transparent 65%)",
                      filter: "blur(40px)",
                    }}
                  />
                  <PrestigePhone src={mocks[i]} width={260} loading="lazy" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ======================= 3. SECTORS ======================= */
const SECTORS = [
  { icon: ChefHat, label: "Ristoranti & Pizzerie", desc: "Menu QR, ordini tavolo, mappa, recensioni" },
  { icon: Scissors, label: "Beauty & Estetica", desc: "Agenda, schede clienti, promemoria, fedeltà" },
  { icon: Car, label: "NCC & Autonoleggio", desc: "Flotta, autisti, prezzi dinamici, mappa live" },
  { icon: Stethoscope, label: "Studi Medici", desc: "Agenda, cartelle, telemedicina, fatture" },
  { icon: Wrench, label: "Idraulici & Tecnici", desc: "Interventi, preventivi AI, foto, magazzino" },
  { icon: Hammer, label: "Edilizia & Cantieri", desc: "Timeline, squadre, materiali, certificati" },
  { icon: Plane, label: "Hotel & B&B", desc: "Camere, housekeeping, ospiti, recensioni" },
  { icon: Briefcase, label: "Commercialisti & Legali", desc: "Pratiche, scadenze, clienti, fatture" },
  { icon: Camera, label: "Fotografi & Creator", desc: "Gallery, prenotazioni, contratti, pagamenti" },
  { icon: ShoppingBag, label: "Retail & Negozi", desc: "Catalogo, magazzino, fedeltà, e-commerce" },
  { icon: GraduationCap, label: "Scuole & Corsi", desc: "Iscrizioni, classi, pagamenti, attestati" },
  { icon: Building2, label: "Immobiliare", desc: "Annunci, lead, visite, contratti" },
];

export function V2Sectors() {
  return (
    <section id="v2-sectors" className="v2-section relative">
      <div className="mx-auto max-w-6xl px-5 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="v2-eyebrow">PER OGNI SETTORE</div>
          <h2 className="v2-display mt-3 text-4xl font-semibold sm:text-5xl">
            25+ verticali. <span className="v2-gold-text">Una sola AI</span> che parla la tua lingua.
          </h2>
          <div className="v2-divider mx-auto mt-5" />
          <p className="mt-4 text-base" style={{ color: "hsl(var(--v2-text-muted))" }}>
            Empire si adatta automaticamente al tuo settore: terminologia, flussi,
            documenti fiscali, integrazioni. Non un template — una piattaforma viva.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {SECTORS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="v2-card p-4 sm:p-5">
                <div
                  className="grid h-10 w-10 place-items-center rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--v2-gold) / 0.25), hsl(var(--v2-glow) / 0.15))",
                    border: "1px solid hsl(var(--v2-gold) / 0.3)",
                  }}
                >
                  <Icon size={18} style={{ color: "hsl(var(--v2-gold-light))" }} />
                </div>
                <div className="mt-3 text-sm font-semibold">{s.label}</div>
                <div className="mt-1 text-[12px] leading-snug" style={{ color: "hsl(var(--v2-text-muted))" }}>
                  {s.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ======================= 4. PORTFOLIO — carousel + modal ======================= */
const PROJECTS = [
  {
    name: "Paperfish Sushi",
    sector: "Sushi · Tokyo Vibes",
    color: "hsl(340 60% 45%)",
    problem: "Code in negozio, prenotazioni perse di sera, recensioni miste.",
    solution: "Sito sakura + app ordini iPad-ready + AI WhatsApp che gestisce omakase e allergie.",
    results: ["+182% prenotazioni online", "−68% chiamate allo staff", "Da 4.3 a 4.8★ in 3 mesi"],
  },
  {
    name: "Strapizzami",
    sector: "Pizzeria Tradizionale",
    color: "hsl(18 70% 45%)",
    problem: "Asporto a voce con errori, niente fedeltà, fatture manuali.",
    solution: "Menu QR + ordini tavolo/asporto + Vault Fiscale + AI che riconosce i clienti VIP.",
    results: ["+€38.000 ricavi extra in 6 mesi", "0 errori asporto", "12.000 punti fedeltà attivi"],
  },
  {
    name: "Asinara Boats",
    sector: "Charter & Escursioni",
    color: "hsl(195 65% 40%)",
    problem: "Email infinite per disponibilità, no-show senza acconto.",
    solution: "Sito azzurro caraibico + booking con acconto + AI multilingua che chiude in chat.",
    results: ["+220% prenotazioni in alta stagione", "97% acconti incassati", "5★ TripAdvisor stabile"],
  },
  {
    name: "Flame Kebab",
    sector: "Street Food",
    color: "hsl(8 80% 50%)",
    problem: "Coda fuori, ordini sbagliati, niente brand digitale.",
    solution: "Menu QR + ordine al tavolo + cucina display + AI per gli orari di punta.",
    results: ["−45 minuti tempo medio cucina", "+€12.500/mese delivery", "Brand riconoscibile su Google"],
  },
  {
    name: "Atelier Aurora",
    sector: "Beauty & Estetica",
    color: "hsl(330 35% 55%)",
    problem: "Agenda cartacea, scadenze trattamenti dimenticate, pochi richiami.",
    solution: "Agenda intelligente + storico clienti + promemoria WhatsApp AI personalizzati.",
    results: ["+62% richiami trattamento", "Zero buchi in agenda", "+34% upselling prodotti"],
  },
  {
    name: "Rental Empire NCC",
    sector: "Autonoleggio Luxury",
    color: "hsl(45 65% 50%)",
    problem: "Prezzi statici, autisti scoordinati, clienti VIP non riconosciuti.",
    solution: "Pricing dinamico + mappa autisti live + CRM VIP + AI che gestisce richieste premium.",
    results: ["+41% margine medio per corsa", "Real-time fleet visibility", "Loyalty 5 corse/mese stabile"],
  },
];

export function V2Portfolio() {
  const pool = createMockupPool();
  const mocks = pool.images(PROJECTS.length * 3);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [modalView, setModalView] = useState(0);

  return (
    <section id="v2-portfolio" className="v2-section relative">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="v2-eyebrow">CASI REALI · CATALOGO</div>
          <h2 className="v2-display mt-3 text-4xl font-semibold sm:text-5xl">
            Sei progetti. Sei <span className="v2-gold-text">vittorie misurabili</span>.
          </h2>
          <div className="v2-divider mx-auto mt-5" />
          <p className="mt-4 text-base" style={{ color: "hsl(var(--v2-text-muted))" }}>
            Tap su un progetto per vedere il problema, la soluzione, i numeri reali e tutti
            i mockup (sito, admin, app cliente, AI WhatsApp).
          </p>
        </div>

        {/* Carousel */}
        <div
          className="mt-12 -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 lg:mx-0 lg:px-0"
          style={{ scrollbarWidth: "none" }}
        >
          {PROJECTS.map((p, i) => (
            <button
              key={p.name}
              onClick={() => {
                setOpenIdx(i);
                setModalView(0);
              }}
              className="v2-card group min-w-[80vw] snap-center text-left sm:min-w-[360px] lg:min-w-[400px]"
              style={{ borderColor: `${p.color} / 0.3` }}
            >
              <div className="relative mx-auto" style={{ width: 220 }}>
                <div
                  className="pointer-events-none absolute inset-0 -m-6 rounded-[40px]"
                  style={{
                    background: `radial-gradient(circle, ${p.color} / 0.25, transparent 65%)`,
                    filter: "blur(30px)",
                  }}
                />
                <PrestigePhone src={mocks[i * 3]} width={220} loading="lazy" />
              </div>
              <div className="mt-5">
                <div className="text-[11px] uppercase tracking-[0.3em]" style={{ color: p.color }}>{p.sector}</div>
                <div className="mt-1 v2-display text-2xl font-semibold">{p.name}</div>
                <div className="mt-2 text-sm" style={{ color: "hsl(var(--v2-text-muted))" }}>{p.problem}</div>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "hsl(var(--v2-gold-light))" }}>
                  Vedi caso completo <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {openIdx !== null && (
        <div
          className="fixed inset-0 z-[10020] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md"
          onClick={() => setOpenIdx(null)}
        >
          <div
            className="relative my-8 w-full max-w-5xl rounded-3xl border border-white/10 p-6 sm:p-10"
            style={{
              background: "linear-gradient(180deg, hsl(var(--v2-emerald)), hsl(var(--v2-emerald-deep)))",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenIdx(null)}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/80 hover:bg-white/20"
              aria-label="Chiudi"
            >
              <XIcon size={18} />
            </button>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Phone + view switcher */}
              <div>
                <div className="mx-auto" style={{ width: 240 }}>
                  <PrestigePhone
                    src={mocks[openIdx * 3 + modalView] ?? mocks[openIdx * 3]}
                    width={240}
                    label={(["Home sito", "Admin", "App cliente", "AI WhatsApp"] as const)[modalView]}
                    loading="eager"
                  />
                </div>
                <div className="mt-10 flex flex-wrap justify-center gap-2">
                  {(["Home sito", "Admin", "App cliente", "AI WhatsApp"] as const).map((l, j) => (
                    <button
                      key={l}
                      onClick={() => setModalView(j)}
                      className="rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors"
                      style={{
                        borderColor: j === modalView ? "hsl(var(--v2-gold))" : "hsl(var(--v2-gold) / 0.3)",
                        background: j === modalView ? "hsl(var(--v2-gold))" : "transparent",
                        color: j === modalView ? "hsl(var(--v2-emerald-deep))" : "hsl(var(--v2-text-muted))",
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-[0.3em]" style={{ color: PROJECTS[openIdx].color }}>
                  {PROJECTS[openIdx].sector}
                </div>
                <h3 className="v2-display mt-2 text-3xl font-semibold sm:text-4xl">{PROJECTS[openIdx].name}</h3>

                <div className="mt-6">
                  <div className="v2-eyebrow">PROBLEMA</div>
                  <p className="mt-2 text-base" style={{ color: "hsl(var(--v2-text-muted))" }}>{PROJECTS[openIdx].problem}</p>
                </div>
                <div className="mt-5">
                  <div className="v2-eyebrow">SOLUZIONE</div>
                  <p className="mt-2 text-base" style={{ color: "hsl(var(--v2-text-muted))" }}>{PROJECTS[openIdx].solution}</p>
                </div>
                <div className="mt-5">
                  <div className="v2-eyebrow">RISULTATI</div>
                  <ul className="mt-2 space-y-2">
                    {PROJECTS[openIdx].results.map((r) => (
                      <li key={r} className="flex items-start gap-2">
                        <Check size={18} className="mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--v2-glow))" }} />
                        <span className="text-base font-medium">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className="v2-cta mt-8"
                  onClick={() => {
                    setOpenIdx(null);
                    document.getElementById("v2-pricing")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Voglio risultati così <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ======================= 5. PROCESS ======================= */
const STEPS = [
  { n: "01", title: "Discovery in 30 minuti", desc: "Call gratuita: capiamo il tuo settore, lo staff, le tue mancanze." },
  { n: "02", title: "Mockup su misura in 24h", desc: "Ti mandiamo 4 schermate iPhone reali del tuo futuro Empire." },
  { n: "03", title: "Setup e attivazione AI", desc: "Configuriamo agenda, listino, fatturazione e l'AI parla con la tua voce." },
  { n: "04", title: "Lancio e crescita", desc: "Sei online in 24h. Account manager dedicato per i primi 90 giorni gratis." },
];
export function V2Process() {
  return (
    <section id="v2-process" className="v2-section relative">
      <div className="mx-auto max-w-6xl px-5 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="v2-eyebrow">COME LAVORIAMO</div>
          <h2 className="v2-display mt-3 text-4xl font-semibold sm:text-5xl">
            4 passi. <span className="v2-gold-text">7 giorni</span>. Risultati.
          </h2>
          <div className="v2-divider mx-auto mt-5" />
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="v2-card">
              <div className="v2-display v2-gold-text text-5xl font-semibold">{s.n}</div>
              <div className="mt-3 text-lg font-semibold">{s.title}</div>
              <div className="mt-2 text-sm" style={{ color: "hsl(var(--v2-text-muted))" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======================= 6. AGENTS ======================= */
const AGENTS = [
  { icon: MessageSquare, name: "Agent WhatsApp", price: "+€39/mese", desc: "Risponde in chat 24/7, prenota e vende. Costo medio 1€/giorno." },
  { icon: Headphones, name: "Agent Voce", price: "+€89/mese", desc: "Risponde alle telefonate con voce naturale italiana. Filtra spam." },
  { icon: Star, name: "Agent Recensioni", price: "+€29/mese", desc: "Filtra esperienze negative, risponde alle 5★, alza il rating Google." },
  { icon: Truck, name: "Agent Logistica", price: "+€49/mese", desc: "Per chi consegna: assegna ordini, ottimizza rotte, traccia stato." },
  { icon: BarChart3, name: "Agent Analista", price: "+€39/mese", desc: "Report settimanale via WhatsApp con insight e azioni consigliate." },
  { icon: Sparkles, name: "Agent Marketing", price: "+€59/mese", desc: "Crea post, story, email e campagne automatiche per la tua attività." },
];
export function V2Agents() {
  return (
    <section id="v2-agents" className="v2-section relative">
      <div className="mx-auto max-w-6xl px-5 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="v2-eyebrow">AI AGENT À LA CARTE</div>
          <h2 className="v2-display mt-3 text-4xl font-semibold sm:text-5xl">
            Scegli i tuoi <span className="v2-gold-text">specialisti AI</span>.
          </h2>
          <div className="v2-divider mx-auto mt-5" />
          <p className="mt-4 text-base" style={{ color: "hsl(var(--v2-text-muted))" }}>
            Inclusi 1-3 agent nei piani superiori. Aggiungine altri quando crescono i bisogni.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.name} className="v2-card">
                <div className="flex items-start justify-between">
                  <div
                    className="grid h-12 w-12 place-items-center rounded-2xl"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--v2-gold) / 0.25), hsl(var(--v2-glow) / 0.15))",
                      border: "1px solid hsl(var(--v2-gold) / 0.3)",
                    }}
                  >
                    <Icon size={20} style={{ color: "hsl(var(--v2-gold-light))" }} />
                  </div>
                  <span className="rounded-full px-3 py-1 text-[11px] font-semibold" style={{ background: "hsl(var(--v2-gold) / 0.15)", color: "hsl(var(--v2-gold-light))" }}>
                    {a.price}
                  </span>
                </div>
                <div className="mt-4 text-lg font-semibold">{a.name}</div>
                <div className="mt-2 text-sm" style={{ color: "hsl(var(--v2-text-muted))" }}>{a.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
