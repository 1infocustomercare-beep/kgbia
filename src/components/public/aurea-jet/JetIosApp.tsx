/**
 * ═══ JET iOS APP ═══
 * Web-app iOS premium dimostrativa di Aurea Jet: telaio iPhone Pro Max,
 * status bar, tab bar nativa e 4 interfacce reali con strumentazione live
 * (tracker di volo, configuratore cabina, wallet boarding pass, concierge).
 *
 * ADDITIVO — solo presentazione, nessuna logica di business.
 */
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BatteryFull,
  ChevronRight,
  Fingerprint,
  Gauge,
  Luggage,
  MapPin,
  Plane,
  Signal,
  Sparkles,
  Thermometer,
  Wallet,
  Wifi,
  Wine,
} from "lucide-react";
import cabinMain from "@/assets/aurea-jet/cabin-main.jpg";
import cabinNight from "@/assets/aurea-jet/cabin-night.jpg";
import wingCoast from "@/assets/aurea-jet/wing-coast.jpg";
import { LuxeTag } from "@/components/public/luxe";

type TabId = "volo" | "cabina" | "wallet" | "concierge";

const TABS: { id: TabId; label: string; icon: typeof Plane }[] = [
  { id: "volo", label: "Volo", icon: Plane },
  { id: "cabina", label: "Cabina", icon: Wine },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "concierge", label: "Livia", icon: Sparkles },
];

const FEATURES = [
  { k: "Tracker live", v: "Quota, velocità, ETA e consumo aggiornati ogni secondo." },
  { k: "Cabina su misura", v: "Luce, clima, menu e champagne scelti prima del decollo." },
  { k: "Boarding pass", v: "Pass Wallet con accesso al terminal privato e Face ID." },
  { k: "Concierge AI", v: "Livia riprogramma la rotta e avvisa autista ed equipaggio." },
];

/** Quadrante circolare strumentale */
function Dial({ value, max, unit, label }: { value: number; max: number; unit: string; label: string }) {
  const pct = Math.min(1, value / max);
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[62px] w-[62px]">
        <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
          <circle cx="32" cy="32" r={r} fill="none" stroke="hsl(var(--foreground) / 0.14)" strokeWidth="3" />
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - pct)}
            style={{ transition: "stroke-dashoffset 0.6s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-[13px] font-semibold leading-none">
            {Math.round(value).toLocaleString("it-IT")}
          </span>
          <span className="mt-0.5 text-[7px] uppercase tracking-[0.14em] text-muted-foreground">{unit}</span>
        </div>
      </div>
      <p className="text-[8px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
    </div>
  );
}


function Sparkline({ seed }: { seed: number }) {
  const points = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => {
      const y = 22 - Math.abs(Math.sin((i + seed) / 4.2)) * 16 - (i / 28) * 3;
      return `${(i / 27) * 100},${y.toFixed(1)}`;
    }).join(" ");
  }, [seed]);
  return (
    <svg viewBox="0 0 100 24" preserveAspectRatio="none" className="h-8 w-full">
      <polyline points={points} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ── Schermate ───────────────────────────────────────────── */

function FlightScreen({ tick }: { tick: number }) {
  const altitude = 12800 + Math.sin(tick / 6) * 320;
  const speed = 842 + Math.cos(tick / 5) * 22;
  const progress = 0.34 + ((tick % 90) / 90) * 0.5;

  return (
    <div className="flex flex-col gap-3.5">
      <div className="relative overflow-hidden rounded-[22px] border border-border/60">
        <img src={wingCoast} alt="" className="h-32 w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        <div className="absolute inset-x-3.5 bottom-3">
          <p className="text-[8px] uppercase tracking-[0.22em] text-primary">AJ · 412 · in volo</p>
          <div className="mt-1 flex items-end justify-between">
            <div>
              <p className="font-heading text-xl font-semibold leading-none">LIN</p>
              <p className="text-[8px] uppercase tracking-[0.16em] text-muted-foreground">Milano Linate</p>
            </div>
            <p className="pb-1 text-[9px] text-muted-foreground">ETA 11:47</p>
            <div className="text-right">
              <p className="font-heading text-xl font-semibold leading-none">NCE</p>
              <p className="text-[8px] uppercase tracking-[0.16em] text-muted-foreground">Nizza Côte d’Azur</p>
            </div>
          </div>
          <div className="relative mt-2.5 h-px w-full bg-foreground/20">
            <div className="absolute inset-y-0 left-0 bg-primary" style={{ width: `${progress * 100}%`, transition: "width 1s linear" }} />
            <Plane
              className="absolute -top-[7px] h-3.5 w-3.5 text-primary"
              style={{ left: `calc(${progress * 100}% - 7px)`, transition: "left 1s linear" }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 rounded-[22px] border border-border/60 bg-card/60 py-4">
        <Dial value={altitude} max={15500} unit="m" label="Quota" />
        <Dial value={speed} max={950} unit="km/h" label="Velocità" />
        <Dial value={78} max={100} unit="%" label="Carburante" />
      </div>

      <div className="rounded-[22px] border border-border/60 bg-card/60 p-3.5">
        <div className="flex items-center justify-between">
          <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Profilo di salita</p>
          <span className="flex items-center gap-1 text-[9px] text-primary"><Gauge className="h-3 w-3" /> stabile</span>
        </div>
        <Sparkline seed={tick / 3} />
        <div className="mt-1 grid grid-cols-3 gap-2 text-[9px] text-muted-foreground">
          <span className="flex items-center gap-1"><Thermometer className="h-3 w-3 text-primary" /> −52 °C</span>
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-primary" /> 246 km</span>
          <span className="flex items-center gap-1"><Luggage className="h-3 w-3 text-primary" /> 4 bagagli</span>
        </div>
      </div>
    </div>
  );
}

function CabinScreen() {
  const [light, setLight] = useState(2);
  const [temp, setTemp] = useState(22);
  const [menu, setMenu] = useState("Degustazione");
  const scenes = ["Alba", "Giorno", "Tramonto", "Notte"];

  return (
    <div className="flex flex-col gap-3.5">
      <div className="relative overflow-hidden rounded-[22px] border border-border/60">
        <img src={light >= 2 ? cabinNight : cabinMain} alt="" className="h-36 w-full object-cover transition-all duration-700" loading="lazy" />
        <div className="absolute inset-0" style={{ background: `hsl(var(--background) / ${0.15 + light * 0.09})` }} />
        <p className="absolute bottom-3 left-3.5 text-[9px] uppercase tracking-[0.22em] text-primary">Scena · {scenes[light]}</p>
      </div>

      <div className="rounded-[22px] border border-border/60 bg-card/60 p-3.5">
        <p className="mb-2.5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Luce cabina</p>
        <div className="grid grid-cols-4 gap-1.5">
          {scenes.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => setLight(i)}
              className="min-h-9 rounded-full border text-[9px] uppercase tracking-[0.12em] transition-colors"
              style={{
                borderColor: light === i ? "hsl(var(--primary))" : "hsl(var(--border))",
                background: light === i ? "hsl(var(--primary) / 0.16)" : "transparent",
                color: light === i ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Clima</p>
          <p className="font-heading text-lg font-semibold">{temp}°</p>
        </div>
        <input
          type="range"
          min={18}
          max={26}
          value={temp}
          onChange={(e) => setTemp(Number(e.target.value))}
          aria-label="Temperatura cabina"
          className="mt-1.5 h-1.5 w-full appearance-none rounded-full bg-foreground/15 accent-primary"
          style={{ accentColor: "hsl(var(--primary))" }}
        />
      </div>

      <div className="rounded-[22px] border border-border/60 bg-card/60 p-3.5">
        <p className="mb-2.5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Servizio a bordo</p>
        {["Degustazione", "Leggero", "Solo bar"].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMenu(m)}
            className="flex min-h-11 w-full items-center justify-between border-b border-border/50 text-left last:border-0"
          >
            <span className="text-xs">{m}</span>
            <span
              className="h-4 w-4 rounded-full border"
              style={{
                borderColor: menu === m ? "hsl(var(--primary))" : "hsl(var(--border))",
                background: menu === m ? "hsl(var(--primary))" : "transparent",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function WalletScreen() {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="relative overflow-hidden rounded-[22px] border border-primary/40 bg-gradient-to-br from-primary/25 via-card to-card p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-[0.24em] text-primary">Boarding pass · Aurea</p>
            <p className="mt-2 font-heading text-2xl font-semibold leading-none">LIN → NCE</p>
          </div>
          <Plane className="h-5 w-5 text-primary" />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-[9px]">
          {[
            ["Passeggero", "K. Bernardini"],
            ["Terminal", "Prime · Gate P2"],
            ["Imbarco", "09:05"],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="uppercase tracking-[0.14em] text-muted-foreground">{k}</p>
              <p className="mt-1 text-[11px] text-foreground">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex h-10 items-end gap-[3px] overflow-hidden">
          {Array.from({ length: 46 }).map((_, i) => (
            <span
              key={i}
              className="flex-1 bg-foreground/80"
              style={{ height: `${40 + ((i * 37) % 60)}%`, opacity: i % 3 ? 0.85 : 0.4 }}
            />
          ))}
        </div>
      </div>

      <button type="button" className="flex min-h-11 items-center justify-between rounded-[22px] border border-border/60 bg-card/60 px-4 py-3">
        <span className="flex items-center gap-2.5 text-xs"><Fingerprint className="h-4 w-4 text-primary" /> Sblocca con Face ID</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </button>

      <div className="rounded-[22px] border border-border/60 bg-card/60 p-3.5">
        <p className="mb-3 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Ore volo residue</p>
        <div className="flex items-end justify-between">
          <p className="font-heading text-3xl font-semibold leading-none">18:40</p>
          <p className="text-[9px] text-muted-foreground">su 25:00 · Jet Card</p>
        </div>
        <div className="mt-3 h-1.5 w-full rounded-full bg-foreground/15">
          <div className="h-1.5 rounded-full bg-primary" style={{ width: "74%" }} />
        </div>
      </div>

      <div className="rounded-[22px] border border-border/60 bg-card/60 p-3.5">
        <p className="mb-2.5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Prossimi voli</p>
        {[
          ["24 ago", "MXP → DXB", "Ultra"],
          ["02 set", "LIN → LCY", "Light"],
        ].map(([d, r, c]) => (
          <div key={r} className="flex min-h-11 items-center justify-between border-b border-border/50 last:border-0">
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{d}</span>
            <span className="text-xs">{r}</span>
            <span className="text-[9px] uppercase tracking-[0.14em] text-primary">{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConciergeScreen() {
  const msgs = [
    { from: "bot", t: "Buongiorno. Il transfer è sotto l’ala alle 08:35." },
    { from: "user", t: "Aggiungi un ospite e sposta a 10:00." },
    { from: "bot", t: "Fatto: 5 passeggeri, decollo 10:00, slot confermato." },
    { from: "bot", t: "Autista e chef aggiornati. Nuovo pass nel Wallet." },
  ];
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-[22px] border border-primary/35 bg-primary/10 p-3.5">
        <p className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Livia · concierge AI
        </p>
        <p className="mt-2 text-xs leading-relaxed text-foreground/85">
          Riprogramma rotte, equipaggio e transfer in un messaggio. Risposta media 40 secondi.
        </p>
      </div>
      {msgs.map((m, i) => (
        <p
          key={i}
          className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
            m.from === "bot"
              ? "self-start border border-border/60 bg-card/70"
              : "self-end bg-primary text-primary-foreground"
          }`}
        >
          {m.t}
        </p>
      ))}
      <div className="mt-1 flex items-center gap-2">
        <span className="flex-1 rounded-full border border-border/60 bg-card/60 px-3.5 py-2.5 text-[11px] text-muted-foreground">
          Scrivi a Livia…
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

/* ── Componente principale ───────────────────────────────── */

export default function JetIosApp() {
  const [tab, setTab] = useState<TabId>("volo");
  const [tick, setTick] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="app" className="relative bg-background px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-5">
          <LuxeTag>Web-app iOS Aurea</LuxeTag>
          <h2 className="max-w-2xl font-heading text-3xl font-semibold leading-tight sm:text-5xl">
            Il tuo hangar privato, <span className="italic text-primary">nel taschino.</span>
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Strumentazione di bordo, cabina configurabile, boarding pass e concierge AI in un’unica
            interfaccia iOS. Tocca le schede: è la web-app reale, non un rendering.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center lg:gap-16">
          {/* Telaio iPhone */}
          <motion.div
            className="mx-auto w-[min(88vw,368px)]"
            initial={reduced ? undefined : { opacity: 0, y: 48 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative rounded-[52px] border border-border/70 bg-card/40 p-[10px] shadow-[0_50px_120px_-40px_rgba(0,0,0,0.95)]">
              <div className="absolute inset-0 rounded-[52px] ring-1 ring-inset ring-primary/15" />
              <div className="relative overflow-hidden rounded-[44px] bg-background">
                {/* Status bar + dynamic island */}
                <div className="relative flex items-center justify-between px-6 pb-2 pt-3.5">
                  <span className="font-heading text-[11px] font-semibold">9:41</span>
                  <span className="absolute left-1/2 top-2.5 h-6 w-24 -translate-x-1/2 rounded-full bg-foreground/90" />
                  <span className="flex items-center gap-1.5 text-foreground/85">
                    <Signal className="h-3 w-3" />
                    <Wifi className="h-3 w-3" />
                    <BatteryFull className="h-3.5 w-3.5" />
                  </span>
                </div>

                {/* Header app */}
                <div className="flex items-center justify-between px-5 pb-3 pt-2">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.24em] text-primary">Aurea Jet</p>
                    <p className="font-heading text-lg font-semibold leading-tight">
                      {tab === "volo" && "Volo in corso"}
                      {tab === "cabina" && "La tua cabina"}
                      {tab === "wallet" && "Wallet"}
                      {tab === "concierge" && "Concierge"}
                    </p>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-[10px] font-semibold text-primary">
                    KB
                  </span>
                </div>

                {/* Contenuto */}
                <div className="h-[430px] overflow-y-auto px-4 pb-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={tab}
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -18 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {tab === "volo" && <FlightScreen tick={tick} />}
                      {tab === "cabina" && <CabinScreen />}
                      {tab === "wallet" && <WalletScreen />}
                      {tab === "concierge" && <ConciergeScreen />}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Tab bar */}
                <div className="border-t border-border/60 bg-card/70 px-2 pb-3 pt-2 backdrop-blur-xl">
                  <div className="grid grid-cols-4">
                    {TABS.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setTab(id)}
                        aria-current={tab === id}
                        className="flex min-h-11 flex-col items-center justify-center gap-1"
                        style={{ color: tab === id ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
                      >
                        <Icon className="h-[18px] w-[18px]" />
                        <span className="text-[8px] uppercase tracking-[0.14em]">{label}</span>
                      </button>
                    ))}
                  </div>
                  <span className="mx-auto mt-2 block h-1 w-28 rounded-full bg-foreground/25" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Callout funzioni */}
          <ul className="divide-y divide-border/60 border-y border-border/60">
            {FEATURES.map((f, i) => (
              <motion.li
                key={f.k}
                className="grid grid-cols-[96px_1fr] gap-4 py-5 sm:grid-cols-[132px_1fr]"
                initial={reduced ? undefined : { opacity: 0, y: 22 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.55, delay: i * 0.07 }}
              >
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary">{f.k}</span>
                <span className="text-sm leading-relaxed text-foreground/80">{f.v}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
