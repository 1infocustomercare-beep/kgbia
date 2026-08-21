/**
 * ═══ JET FLIGHT DECK ═══
 * La web-app Aurea Jet vera e propria: console full-bleed di ultima generazione
 * (rail di navigazione, header operativo, moduli live) — NESSUN mockup di
 * telefono, questa È l'interfaccia che il cliente usa.
 *
 * Moduli: Operativo (telemetria live), Flotta, Rotta, Cabina & Catering,
 * Wallet (boarding pass), Concierge (chat AI).
 *
 * ADDITIVO — presentazione + stato locale, nessuna chiamata backend.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowUpRight,
  Bell,
  CalendarClock,
  Check,
  ChevronRight,
  Fingerprint,
  Gauge,
  Globe2,
  LayoutGrid,
  MapPin,
  Plane,
  Send,
  ShieldCheck,
  Sparkles,
  Utensils,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import cabinMain from "@/assets/aurea-jet/cabin-main.jpg";
import cabinDining from "@/assets/aurea-jet/cabin-dining.jpg";
import cabinNight from "@/assets/aurea-jet/cabin-night.jpg";
import cockpit from "@/assets/aurea-jet/cockpit.jpg";
import wingCoast from "@/assets/aurea-jet/wing-coast.jpg";
import { LuxeTag } from "@/components/public/luxe";

type ModuleId = "operativo" | "flotta" | "rotta" | "cabina" | "wallet" | "concierge";

const MODULES: { id: ModuleId; label: string; icon: typeof Gauge }[] = [
  { id: "operativo", label: "Operativo", icon: Gauge },
  { id: "flotta", label: "Flotta", icon: Plane },
  { id: "rotta", label: "Rotta", icon: Globe2 },
  { id: "cabina", label: "Cabina", icon: Utensils },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "concierge", label: "Concierge", icon: Sparkles },
];

const FLEET = [
  {
    id: "citation",
    name: "Citation XLS+",
    class: "Light Jet",
    pax: 8,
    range: "3.400 km",
    speed: "820 km/h",
    hourly: 3900,
    img: cockpit,
  },
  {
    id: "challenger",
    name: "Challenger 350",
    class: "Super Midsize",
    pax: 9,
    range: "5.900 km",
    speed: "870 km/h",
    hourly: 6400,
    img: cabinMain,
  },
  {
    id: "global",
    name: "Global 7500",
    class: "Ultra Long Range",
    pax: 14,
    range: "14.260 km",
    speed: "982 km/h",
    hourly: 11800,
    img: cabinNight,
  },
];

const LEGS = [
  { code: "LIN", city: "Milano Linate", time: "09:40", note: "Handling privato · Gate FBO 2" },
  { code: "FCO", city: "Roma Fiumicino", time: "10:35", note: "Sosta tecnica 25 min" },
  { code: "OLB", city: "Olbia Costa Smeralda", time: "11:50", note: "Transfer Maybach in pista" },
];

const CATERING = [
  { label: "Menu degustazione", detail: "Chef stellato a bordo", price: "+ 890 €", img: cabinDining },
  { label: "Cellar selection", detail: "Krug 2008 · Sassicaia", price: "+ 1.450 €", img: cabinNight },
  { label: "Wellness set", detail: "Kit sonno, luce circadiana", price: "incluso", img: cabinMain },
];

export default function JetFlightDeck() {
  const [module, setModule] = useState<ModuleId>("operativo");
  const [aircraft, setAircraft] = useState(FLEET[1].id);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { margin: "-20% 0px" });

  const selected = FLEET.find((f) => f.id === aircraft) ?? FLEET[1];

  /* Telemetria live (solo estetica) */
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1400);
    return () => window.clearInterval(id);
  }, [inView]);

  const telemetry = useMemo(() => {
    const w = (a: number, b: number, o: number) => a + Math.round((Math.sin(tick / 2 + o) + 1) * b);
    return {
      altitude: w(12400, 320, 0),
      speed: w(842, 34, 1.2),
      eta: 68 - (tick % 12),
      fuel: 82 - (tick % 6),
    };
  }, [tick]);

  return (
    <section id="app" ref={wrapRef} className="relative bg-background px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <LuxeTag>Aurea Deck · web-app cliente</LuxeTag>
            <h2 className="mt-5 max-w-2xl font-heading text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[0.96]">
              La tua flotta, in una <span className="italic text-primary">console sola</span>.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-foreground/65">
            Nessuna telefonata, nessuna email: quota, cabina, catering, documenti e concierge in un unico
            ambiente operativo, sincronizzato con il flight desk 24/7.
          </p>
        </header>

        {/* ── Console ── */}
        <div className="relative overflow-hidden border border-border/60 bg-card/70 backdrop-blur-2xl shadow-[0_50px_140px_-70px_hsl(var(--primary)/0.6)]">
          {/* header operativo */}
          <div className="flex items-center gap-3 border-b border-border/60 bg-background/50 px-4 py-3 sm:px-6">
            <span className="flex h-7 w-7 items-center justify-center bg-primary/15 text-primary">
              <Plane className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.24em]">
                AUREA · {selected.name}
              </p>
              <p className="truncate text-[10px] uppercase tracking-[0.2em] text-foreground/45">
                Volo AU-114 · in rotta · LIN → OLB
              </p>
            </div>
            <span className="hidden items-center gap-2 border border-primary/40 px-2.5 py-1 text-[9px] uppercase tracking-[0.24em] text-primary sm:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> live
            </span>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center border border-border/60 text-foreground/70 transition-colors hover:border-primary/60 hover:text-primary"
              aria-label="Notifiche"
            >
              <Bell className="h-4 w-4" />
            </button>
          </div>

          <div className="grid lg:grid-cols-[224px_1fr]">
            {/* rail */}
            <nav className="flex gap-1 overflow-x-auto border-b border-border/60 bg-background/30 p-2 no-scrollbar lg:flex-col lg:border-b-0 lg:border-r lg:p-3">
              {MODULES.map((m) => {
                const Icon = m.icon;
                const on = module === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setModule(m.id)}
                    className={cn(
                      "group relative flex min-h-11 shrink-0 items-center gap-2.5 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all lg:w-full",
                      on ? "bg-primary/12 text-primary" : "text-foreground/55 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {m.label}
                    {on && (
                      <motion.span
                        layoutId="deck-rail"
                        className="absolute inset-y-0 left-0 w-[2px] bg-primary"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                  </button>
                );
              })}
              <div className="ml-auto hidden lg:mt-6 lg:block lg:w-full">
                <p className="px-3 text-[9px] uppercase tracking-[0.24em] text-foreground/35">Flight advisor</p>
                <div className="mt-3 flex items-center gap-2.5 border border-border/60 bg-card/60 p-2.5">
                  <span className="flex h-8 w-8 items-center justify-center bg-primary/15 text-[10px] font-semibold text-primary">
                    LV
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium">Livia Verando</p>
                    <p className="truncate text-[9px] uppercase tracking-[0.18em] text-primary">online</p>
                  </div>
                </div>
              </div>
            </nav>

            {/* pannello attivo */}
            <div className="relative min-h-[520px] p-4 sm:p-7">
              <motion.div
                key={module}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {module === "operativo" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <Metric label="Quota" value={`${telemetry.altitude.toLocaleString("it-IT")} m`} />
                      <Metric label="Velocità" value={`${telemetry.speed} km/h`} />
                      <Metric label="ETA" value={`${telemetry.eta} min`} />
                      <Metric label="Carburante" value={`${telemetry.fuel}%`} />
                    </div>
                    <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
                      <Card title="Profilo di volo" hint="ultimo aggiornamento ora">
                        <Sparkline seed={tick} />
                        <div className="mt-4 grid grid-cols-3 gap-3 text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                          <span>Salita</span>
                          <span className="text-center">Crociera</span>
                          <span className="text-right text-primary">Discesa</span>
                        </div>
                      </Card>
                      <Card title="Checklist di bordo">
                        <ul className="space-y-3">
                          {["Slot confermato", "Catering caricato", "Transfer in pista", "Documenti passeggeri"].map(
                            (t, i) => (
                              <li key={t} className="flex items-center gap-3 text-sm">
                                <span
                                  className={cn(
                                    "flex h-5 w-5 items-center justify-center border",
                                    i < 3 ? "border-primary bg-primary/15 text-primary" : "border-border/70 text-foreground/40",
                                  )}
                                >
                                  <Check className="h-3 w-3" />
                                </span>
                                <span className={i < 3 ? "text-foreground/85" : "text-foreground/50"}>{t}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </Card>
                    </div>
                  </div>
                )}

                {module === "flotta" && (
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {FLEET.map((f) => {
                        const on = f.id === aircraft;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setAircraft(f.id)}
                            className={cn(
                              "group relative overflow-hidden border text-left transition-all",
                              on ? "border-primary/70" : "border-border/60 hover:border-primary/40",
                            )}
                          >
                            <div className="relative h-32 overflow-hidden">
                              <img
                                src={f.img}
                                alt={f.name}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                            </div>
                            <div className="space-y-1.5 p-4">
                              <p className="text-[9px] uppercase tracking-[0.24em] text-primary">{f.class}</p>
                              <p className="font-heading text-lg font-semibold leading-tight">{f.name}</p>
                              <p className="text-[11px] text-foreground/55">
                                {f.pax} pax · {f.range}
                              </p>
                            </div>
                            {on && (
                              <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center bg-primary text-primary-foreground">
                                <Check className="h-3.5 w-3.5" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-4">
                      <Metric label="Autonomia" value={selected.range} />
                      <Metric label="Crociera" value={selected.speed} />
                      <Metric label="Posti" value={`${selected.pax}`} />
                      <Metric label="Tariffa oraria" value={`${selected.hourly.toLocaleString("it-IT")} €`} accent />
                    </div>
                  </div>
                )}

                {module === "rotta" && (
                  <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                    <Card title="Rotta AU-114" hint="LIN → FCO → OLB">
                      <div className="relative h-56 overflow-hidden border border-border/50">
                        <img src={wingCoast} alt="" className="h-full w-full object-cover opacity-45" loading="lazy" />
                        <svg viewBox="0 0 400 200" className="absolute inset-0 h-full w-full">
                          <path
                            d="M40 160 C 140 40, 260 40, 360 100"
                            fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth="1.5"
                            strokeDasharray="4 6"
                          />
                          {[
                            [40, 160],
                            [200, 66],
                            [360, 100],
                          ].map(([cx, cy], i) => (
                            <g key={i}>
                              <circle cx={cx} cy={cy} r="4" fill="hsl(var(--primary))" />
                              <circle cx={cx} cy={cy} r="10" fill="none" stroke="hsl(var(--primary))" strokeOpacity="0.35" />
                            </g>
                          ))}
                        </svg>
                        <span className="absolute bottom-3 left-3 text-[9px] uppercase tracking-[0.24em] text-foreground/70">
                          tracking satellitare
                        </span>
                      </div>
                    </Card>
                    <Card title="Timeline">
                      <ol className="relative space-y-6 pl-6">
                        <span className="absolute left-[7px] top-1 h-[calc(100%-8px)] w-px bg-border/70" />
                        {LEGS.map((l, i) => (
                          <li key={l.code} className="relative">
                            <span
                              className={cn(
                                "absolute -left-6 top-1 h-3.5 w-3.5 rotate-45 border",
                                i === 0 ? "border-primary bg-primary" : "border-border/70 bg-card",
                              )}
                            />
                            <div className="flex items-baseline justify-between gap-3">
                              <p className="font-heading text-base font-semibold">
                                {l.code} <span className="text-xs font-normal text-foreground/55">{l.city}</span>
                              </p>
                              <span className="text-xs text-primary">{l.time}</span>
                            </div>
                            <p className="mt-1 text-[11px] text-foreground/55">{l.note}</p>
                          </li>
                        ))}
                      </ol>
                    </Card>
                  </div>
                )}

                {module === "cabina" && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {CATERING.map((c) => (
                      <article key={c.label} className="group overflow-hidden border border-border/60">
                        <div className="relative h-36 overflow-hidden">
                          <img
                            src={c.img}
                            alt={c.label}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <div className="space-y-2 p-4">
                          <p className="font-heading text-base font-semibold leading-tight">{c.label}</p>
                          <p className="text-[11px] text-foreground/55">{c.detail}</p>
                          <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-primary">
                            {c.price} <ChevronRight className="h-3 w-3" />
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {module === "wallet" && (
                  <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                    <div className="relative overflow-hidden border border-primary/40 bg-background/60 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.26em] text-primary">Boarding pass</p>
                          <p className="mt-3 font-heading text-3xl font-semibold leading-none">LIN → OLB</p>
                        </div>
                        <Fingerprint className="h-8 w-8 text-primary" />
                      </div>
                      <div className="mt-8 grid grid-cols-3 gap-4 text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                        <div>
                          <p>Passeggero</p>
                          <p className="mt-1 text-sm normal-case tracking-normal text-foreground">K. Bernardini</p>
                        </div>
                        <div>
                          <p>Imbarco</p>
                          <p className="mt-1 text-sm normal-case tracking-normal text-foreground">09:25</p>
                        </div>
                        <div>
                          <p>Gate</p>
                          <p className="mt-1 text-sm normal-case tracking-normal text-foreground">FBO 2</p>
                        </div>
                      </div>
                      <div className="mt-7 flex h-12 items-end gap-[3px] border-t border-border/50 pt-4">
                        {Array.from({ length: 46 }).map((_, i) => (
                          <span
                            key={i}
                            className="w-px bg-foreground/70"
                            style={{ height: `${8 + ((i * 37) % 22)}px`, opacity: i % 4 ? 0.75 : 1 }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Card title="Documenti">
                        {["Contratto charter", "Assicurazione passeggeri", "Manifest doganale"].map((d) => (
                          <div
                            key={d}
                            className="flex min-h-11 items-center justify-between border-b border-border/50 py-2 text-sm last:border-b-0"
                          >
                            <span className="flex items-center gap-2.5 text-foreground/80">
                              <ShieldCheck className="h-4 w-4 text-primary" /> {d}
                            </span>
                            <ArrowUpRight className="h-4 w-4 text-foreground/40" />
                          </div>
                        ))}
                      </Card>
                      <Card title="Prossimo volo">
                        <div className="flex items-center gap-3 text-sm">
                          <CalendarClock className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-foreground/85">28 agosto · 07:15</p>
                            <p className="text-[11px] text-foreground/55">Olbia → Nizza · Challenger 350</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                {module === "concierge" && <ConciergeChat />}
              </motion.div>
            </div>
          </div>

          {/* footer console */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-background/50 px-4 py-3 text-[9px] uppercase tracking-[0.22em] text-foreground/45 sm:px-6">
            <span className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-primary" /> flight desk milano · 24/7
            </span>
            <span className="flex items-center gap-2">
              <LayoutGrid className="h-3 w-3 text-primary" /> aurea deck v4 · sincronizzato
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── sub-componenti ── */

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="border border-border/60 bg-background/40 p-3.5">
      <p className="text-[9px] uppercase tracking-[0.22em] text-foreground/45">{label}</p>
      <p className={cn("mt-2 font-heading text-xl font-semibold tabular-nums", accent && "text-primary")}>{value}</p>
    </div>
  );
}

function Card({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border/60 bg-background/40 p-4 sm:p-5">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.22em] text-foreground/60">{title}</p>
        {hint && <span className="text-[9px] uppercase tracking-[0.18em] text-primary/70">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Sparkline({ seed }: { seed: number }) {
  const pts = Array.from({ length: 28 }).map((_, i) => {
    const y = 40 - Math.sin(i / 3 + seed / 3) * 14 - (i > 20 ? (i - 20) * 2 : 0);
    return `${(i / 27) * 300},${Math.max(6, y)}`;
  });
  return (
    <svg viewBox="0 0 300 56" className="h-24 w-full">
      <polyline points={pts.join(" ")} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" />
      <polyline
        points={`0,56 ${pts.join(" ")} 300,56`}
        fill="hsl(var(--primary) / 0.12)"
        stroke="none"
      />
    </svg>
  );
}

function ConciergeChat() {
  const QUICK = ["Aggiungi un passeggero", "Anticipa il volo di 2 ore", "Chef a bordo", "Transfer in elicottero"];
  const [log, setLog] = useState<{ from: "me" | "ai"; text: string }[]>([
    { from: "ai", text: "Sono Livia, il tuo flight advisor. Cosa serve per il volo di domani?" },
  ]);
  const [draft, setDraft] = useState("");

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setLog((l) => [...l, { from: "me", text: t }]);
    setDraft("");
    window.setTimeout(() => {
      setLog((l) => [
        ...l,
        {
          from: "ai",
          text: "Ricevuto: aggiorno il piano operativo e ti confermo entro 4 minuti con slot e costo definitivo.",
        },
      ]);
    }, 900);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
      <div className="flex min-h-[380px] flex-col border border-border/60 bg-background/40">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {log.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}
            >
              <p
                className={cn(
                  "max-w-[78%] px-3.5 py-2.5 text-sm leading-relaxed",
                  m.from === "me"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border/60 bg-card/70 text-foreground/85",
                )}
              >
                {m.text}
              </p>
            </motion.div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
          className="flex items-center gap-2 border-t border-border/60 p-3"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Scrivi al flight advisor…"
            className="min-h-11 flex-1 border border-border/60 bg-background/60 px-3 text-sm text-foreground outline-none placeholder:text-foreground/40 focus:border-primary/60"
          />
          <button
            type="submit"
            className="flex h-11 w-11 items-center justify-center bg-primary text-primary-foreground transition-opacity hover:opacity-90"
            aria-label="Invia"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
      <div className="space-y-2">
        <p className="text-[9px] uppercase tracking-[0.22em] text-foreground/45">Richieste rapide</p>
        {QUICK.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => send(q)}
            className="flex min-h-11 w-full items-center justify-between gap-2 border border-border/60 px-3 text-left text-[12px] text-foreground/75 transition-colors hover:border-primary/60 hover:text-primary"
          >
            {q}
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>
    </div>
  );
}
