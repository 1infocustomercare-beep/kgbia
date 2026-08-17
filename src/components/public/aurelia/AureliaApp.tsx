import { useMemo, useState } from "react";
import {
  BadgeCheck,
  BatteryCharging,
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Fuel,
  Gauge,
  LayoutDashboard,
  PenLine,
  Repeat,
  Settings2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import carRosso from "@/assets/demo-aurelia/car-rosso-coupe.jpg";
import carGrigio from "@/assets/demo-aurelia/car-grigio-suv.jpg";
import carBianco from "@/assets/demo-aurelia/car-bianco-elettrica.jpg";
import carBlu from "@/assets/demo-aurelia/car-blu-wagon.jpg";

/* ══════════ Dati demo (nessun dato reale) ══════════ */

type Vehicle = {
  id: string;
  name: string;
  trim: string;
  img: string;
  price: number;
  year: number;
  km: number;
  fuel: "Benzina" | "Elettrica" | "Ibrida" | "Diesel";
  power: string;
  gear: string;
  tags: string[];
  category: "usato" | "km0" | "elettrica" | "ibrida";
};

const VEHICLES: Vehicle[] = [
  {
    id: "corsa-rossa",
    name: "Aurelia Corsa GT",
    trim: "3.9 V8 Coupé",
    img: carRosso,
    price: 128900,
    year: 2023,
    km: 12400,
    fuel: "Benzina",
    power: "620 CV",
    gear: "Automatico DCT",
    tags: ["Usato garantito", "360°", "Tagliandi certificati"],
    category: "usato",
  },
  {
    id: "monte-suv",
    name: "Aurelia Monte 4X",
    trim: "2.0 Mild Hybrid AWD",
    img: carGrigio,
    price: 62400,
    year: 2024,
    km: 3100,
    fuel: "Ibrida",
    power: "265 CV",
    gear: "Automatico 8M",
    tags: ["Km 0", "7 posti", "Pronta consegna"],
    category: "ibrida",
  },
  {
    id: "aria-ev",
    name: "Aurelia Aria E",
    trim: "Long Range 84 kWh",
    img: carBianco,
    price: 48900,
    year: 2025,
    km: 900,
    fuel: "Elettrica",
    power: "340 CV",
    gear: "Monomarcia",
    tags: ["Elettrica", "540 km reali", "Ricarica 150 kW"],
    category: "elettrica",
  },
  {
    id: "riva-wagon",
    name: "Aurelia Riva SW",
    trim: "2.0 TDI Business",
    img: carBlu,
    price: 27500,
    year: 2022,
    km: 46800,
    fuel: "Diesel",
    power: "190 CV",
    gear: "Automatico 7M",
    tags: ["Usato garantito", "Unico proprietario"],
    category: "usato",
  },
];

const FILTERS = [
  { id: "tutte", label: "Tutte" },
  { id: "usato", label: "Usato garantito" },
  { id: "km0", label: "Km 0" },
  { id: "elettrica", label: "Elettrica" },
  { id: "ibrida", label: "Ibrida" },
] as const;

const TABS = [
  { id: "vetrina", label: "Vetrina", icon: Car, role: "Cliente" },
  { id: "scheda", label: "Scheda veicolo", icon: Gauge, role: "Cliente" },
  { id: "testdrive", label: "Test drive", icon: CalendarDays, role: "Cliente" },
  { id: "permuta", label: "Permuta IA", icon: Repeat, role: "IA" },
  { id: "officina", label: "Officina", icon: Wrench, role: "Staff" },
  { id: "garage", label: "Il mio garage", icon: ShieldCheck, role: "Cliente" },
  { id: "crm", label: "CRM vendite", icon: LayoutDashboard, role: "Admin" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const eur = (n: number) => n.toLocaleString("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

/* ══════════ Chrome dell'app ══════════ */

function AppShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex min-h-[520px] flex-col">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-4 sm:px-7">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary">{subtitle}</p>
          <h3 className="mt-1 font-heading text-xl font-semibold sm:text-2xl">{title}</h3>
        </div>
        <span className="hidden items-center gap-2 rounded-full border border-border/60 bg-[#0f1c1b] px-3 py-1.5 text-[11px] text-muted-foreground sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" /> live
        </span>
      </div>
      <div className="flex-1 p-5 sm:p-7">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-[#0c1615] p-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

/* ══════════ Sezioni ══════════ */

function Vetrina({ onOpen }: { onOpen: (v: Vehicle) => void }) {
  const [filter, setFilter] = useState<string>("tutte");
  const list = useMemo(
    () => (filter === "tutte" ? VEHICLES : VEHICLES.filter((v) => v.category === filter || (filter === "km0" && v.km < 5000))),
    [filter],
  );

  return (
    <AppShell subtitle="Cliente" title="Vetrina · 4 vetture disponibili">
      <div className="-mx-1 mb-5 flex snap-x gap-2 overflow-x-auto px-1 pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`min-h-9 shrink-0 snap-start rounded-full border px-4 text-xs font-semibold transition-colors ${
              filter === f.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/60 bg-[#0c1615] text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => onOpen(v)}
            className="group overflow-hidden rounded-2xl border border-border/60 bg-[#0d1817] text-left transition-all hover:-translate-y-1 hover:border-primary/50"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-black">
              <img
                src={v.img}
                alt={`${v.name} in vetrina`}
                loading="lazy"
                width={1024}
                height={768}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                360°
              </span>
              {v.fuel === "Elettrica" && (
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
                  <BatteryCharging className="h-3 w-3" /> EV
                </span>
              )}
            </div>
            <div className="p-4">
              <h4 className="font-heading text-lg font-semibold">{v.name}</h4>
              <p className="text-xs text-muted-foreground">{v.trim}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                <span className="rounded-md border border-border/60 px-2 py-1">{v.year}</span>
                <span className="rounded-md border border-border/60 px-2 py-1">{v.km.toLocaleString("it-IT")} km</span>
                <span className="rounded-md border border-border/60 px-2 py-1">{v.fuel}</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-heading text-xl font-semibold text-primary">{eur(v.price)}</span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  Scheda <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </AppShell>
  );
}

function Scheda({ vehicle, onBook }: { vehicle: Vehicle; onBook: () => void }) {
  const [months, setMonths] = useState(48);
  const [down, setDown] = useState(Math.round(vehicle.price * 0.2));
  const rata = Math.round(((vehicle.price - down) * 1.069) / months);

  return (
    <AppShell subtitle="Cliente" title={vehicle.name}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-black">
            <img
              src={vehicle.img}
              alt={`${vehicle.name} — scheda veicolo`}
              loading="lazy"
              width={1024}
              height={768}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {vehicle.tags.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                <BadgeCheck className="h-3 w-3" /> {t}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{vehicle.trim}</p>
          <p className="mt-1 font-heading text-3xl font-semibold text-primary">{eur(vehicle.price)}</p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Field label="Immatricolazione" value={String(vehicle.year)} />
            <Field label="Chilometri" value={`${vehicle.km.toLocaleString("it-IT")} km`} />
            <Field label="Potenza" value={vehicle.power} />
            <Field label="Cambio" value={vehicle.gear} />
          </div>

          <div className="mt-5 rounded-2xl border border-border/60 bg-[#0d1817] p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Fuel className="h-3.5 w-3.5 text-primary" /> Simulatore finanziamento
            </p>
            <label className="mt-4 block text-xs text-muted-foreground" htmlFor="anticipo">
              Anticipo · {eur(down)}
            </label>
            <input
              id="anticipo"
              type="range"
              min={0}
              max={Math.round(vehicle.price * 0.6)}
              step={500}
              value={down}
              onChange={(e) => setDown(Number(e.target.value))}
              className="mt-2 w-full accent-primary"
            />
            <label className="mt-4 block text-xs text-muted-foreground" htmlFor="durata">
              Durata · {months} mesi
            </label>
            <input
              id="durata"
              type="range"
              min={12}
              max={84}
              step={12}
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="mt-2 w-full accent-primary"
            />
            <p className="mt-4 font-heading text-2xl font-semibold">
              {eur(rata)} <span className="text-sm font-normal text-muted-foreground">/ mese</span>
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button onClick={onBook} className="min-h-11 flex-1 rounded-none uppercase tracking-[0.14em]">
              Prenota test drive
            </Button>
            <Button variant="outline" className="min-h-11 flex-1 rounded-none uppercase tracking-[0.14em]">
              Valuta permuta
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

const DAYS = ["Lun 18", "Mar 19", "Mer 20", "Gio 21", "Ven 22"];
const SLOTS = ["09:00", "10:30", "12:00", "14:30", "16:00", "17:30"];
const BUSY = ["10:30", "16:00"];

function TestDrive({ vehicle }: { vehicle: Vehicle }) {
  const [day, setDay] = useState(DAYS[1]);
  const [slot, setSlot] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <AppShell subtitle="Cliente" title="Test drive confermato">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-primary/40 bg-primary/5 px-6 py-16 text-center">
          <CheckCircle2 className="h-12 w-12 text-primary" />
          <h4 className="mt-5 font-heading text-2xl font-semibold">Ci vediamo {day} alle {slot}</h4>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {vehicle.name} pronta in consegna. Promemoria WhatsApp 24 ore prima, consulente Marco Ferrero assegnato.
          </p>
          <Button variant="outline" className="mt-6 rounded-none uppercase tracking-[0.14em]" onClick={() => { setDone(false); setSlot(null); }}>
            Modifica prenotazione
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell subtitle="Cliente" title="Prenota il test drive">
      <div className="rounded-2xl border border-border/60 bg-[#0d1817] p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Veicolo selezionato</p>
        <p className="mt-1 font-heading text-lg font-semibold">{vehicle.name} · {vehicle.trim}</p>
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Giorno</p>
      <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
        {DAYS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDay(d)}
            className={`min-h-11 shrink-0 rounded-xl border px-5 text-sm font-semibold transition-colors ${
              day === d ? "border-primary bg-primary text-primary-foreground" : "border-border/60 bg-[#0c1615] text-muted-foreground"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Fascia oraria</p>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {SLOTS.map((s) => {
          const busy = BUSY.includes(s);
          return (
            <button
              key={s}
              type="button"
              disabled={busy}
              onClick={() => setSlot(s)}
              className={`min-h-11 rounded-xl border text-sm font-semibold transition-colors ${
                busy
                  ? "cursor-not-allowed border-border/40 bg-white/5 text-muted-foreground/50 line-through"
                  : slot === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/60 bg-[#0c1615] hover:border-primary/50"
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Field label="Sede" value="Aurelia Motori · Milano Nord" />
        <Field label="Consulente" value="Marco Ferrero" />
      </div>

      <Button
        disabled={!slot}
        onClick={() => setDone(true)}
        className="mt-6 min-h-12 w-full rounded-none uppercase tracking-[0.14em]"
      >
        {slot ? `Conferma ${day} · ${slot}` : "Scegli un orario"}
      </Button>
    </AppShell>
  );
}

function Permuta() {
  const [targa, setTarga] = useState("");
  const [km, setKm] = useState(85000);
  const [anno, setAnno] = useState(2019);
  const [stato, setStato] = useState("Buono");
  const [result, setResult] = useState<number | null>(null);

  const stima = () => {
    const base = 34000;
    const eta = (2026 - anno) * 1850;
    const usura = (km / 1000) * 92;
    const cond = stato === "Ottimo" ? 1.08 : stato === "Buono" ? 1 : 0.88;
    setResult(Math.max(1800, Math.round(((base - eta - usura) * cond) / 100) * 100));
  };

  return (
    <AppShell subtitle="Intelligenza artificiale" title="Valuta la tua permuta">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground" htmlFor="targa">Targa</label>
            <input
              id="targa"
              value={targa}
              onChange={(e) => setTarga(e.target.value.toUpperCase())}
              placeholder="AB 123 CD"
              className="mt-2 min-h-12 w-full rounded-xl border border-border/60 bg-[#0d1817] px-4 text-base font-semibold tracking-[0.2em] outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground" htmlFor="km">
              Chilometri · {km.toLocaleString("it-IT")}
            </label>
            <input id="km" type="range" min={0} max={300000} step={5000} value={km} onChange={(e) => setKm(Number(e.target.value))} className="mt-3 w-full accent-primary" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground" htmlFor="anno">
              Immatricolazione · {anno}
            </label>
            <input id="anno" type="range" min={2005} max={2025} step={1} value={anno} onChange={(e) => setAnno(Number(e.target.value))} className="mt-3 w-full accent-primary" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Condizioni</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {["Ottimo", "Buono", "Da sistemare"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStato(s)}
                  className={`min-h-11 rounded-xl border px-2 text-xs font-semibold ${
                    stato === s ? "border-primary bg-primary text-primary-foreground" : "border-border/60 bg-[#0c1615] text-muted-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={stima} className="min-h-12 w-full rounded-none uppercase tracking-[0.14em]">
            <Sparkles className="h-4 w-4" /> Calcola stima IA
          </Button>
        </div>

        <div className="flex flex-col justify-center rounded-2xl border border-border/60 bg-[#0d1817] p-7 text-center">
          {result === null ? (
            <>
              <Repeat className="mx-auto h-9 w-9 text-primary/60" />
              <p className="mt-4 text-sm text-muted-foreground">
                Inserisci i dati: l&apos;IA incrocia listini, aste e domanda locale e restituisce una stima in 30 secondi.
              </p>
            </>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.22em] text-primary">Valutazione stimata</p>
              <p className="mt-3 font-heading text-5xl font-semibold">{eur(result)}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                Range {eur(Math.round(result * 0.94))} – {eur(Math.round(result * 1.06))} · valida 7 giorni
              </p>
              <div className="mt-6 space-y-2 text-left text-xs text-muted-foreground">
                <p className="flex justify-between"><span>Base listino usato</span><span>{eur(34000)}</span></p>
                <p className="flex justify-between"><span>Svalutazione età</span><span>−{eur((2026 - anno) * 1850)}</span></p>
                <p className="flex justify-between"><span>Percorrenza</span><span>−{eur(Math.round((km / 1000) * 92))}</span></p>
              </div>
              <Button className="mt-6 min-h-11 w-full rounded-none uppercase tracking-[0.14em]">Blocca la valutazione</Button>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}

const BAYS = [
  {
    bay: "Ponte 1",
    car: "Aurelia Riva SW · AB 421 KD",
    job: "Tagliando 60.000 km",
    progress: 80,
    state: "In lavorazione",
    eta: "Pronta 16:30",
  },
  {
    bay: "Ponte 2",
    car: "Aurelia Monte 4X · FG 908 TR",
    job: "Sostituzione freni ant.",
    progress: 35,
    state: "Attesa ricambi",
    eta: "Ricambio in arrivo 15:10",
  },
  {
    bay: "Ponte 3",
    car: "Aurelia Aria E · EV 220 LM",
    job: "Diagnosi pacco batteria",
    progress: 100,
    state: "Completato",
    eta: "Consegna alle 17:00",
  },
];

function Officina() {
  const [firmati, setFirmati] = useState<string[]>([]);
  const preventivi = [
    { id: "p1", cliente: "Giulia Bassani", voce: "Pastiglie + dischi anteriori", tot: 412 },
    { id: "p2", cliente: "Loris Meucci", voce: "Cinghia distribuzione", tot: 890 },
  ];

  return (
    <AppShell subtitle="Staff officina" title="Agenda ponti · oggi">
      <div className="space-y-3">
        {BAYS.map((b) => (
          <div key={b.bay} className="rounded-2xl border border-border/60 bg-[#0d1817] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-primary">{b.bay}</p>
                <p className="mt-1 font-heading text-base font-semibold">{b.car}</p>
                <p className="text-xs text-muted-foreground">{b.job}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                  b.state === "Completato"
                    ? "bg-primary/15 text-primary"
                    : b.state === "Attesa ricambi"
                      ? "bg-amber-500/15 text-amber-400"
                      : "bg-sky-500/15 text-sky-400"
                }`}
              >
                {b.state}
              </span>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-primary" style={{ width: `${b.progress}%` }} />
            </div>
            <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" /> {b.eta}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Preventivi in attesa di firma</p>
      <div className="mt-3 space-y-3">
        {preventivi.map((p) => {
          const signed = firmati.includes(p.id);
          return (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-[#0d1817] p-4">
              <div>
                <p className="font-heading text-base font-semibold">{p.cliente}</p>
                <p className="text-xs text-muted-foreground">{p.voce} · {eur(p.tot)}</p>
              </div>
              <Button
                size="sm"
                variant={signed ? "outline" : "default"}
                onClick={() => setFirmati((f) => (signed ? f.filter((x) => x !== p.id) : [...f, p.id]))}
                className="min-h-10 rounded-none uppercase tracking-[0.14em]"
              >
                {signed ? <><CheckCircle2 className="h-4 w-4" /> Firmato</> : <><PenLine className="h-4 w-4" /> Firma digitale</>}
              </Button>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}

function Garage() {
  const storico = [
    { data: "12 mar 2026", voce: "Tagliando 40.000 km", tot: 289 },
    { data: "04 nov 2025", voce: "Sostituzione pneumatici", tot: 640 },
    { data: "27 mag 2025", voce: "Revisione + bollo", tot: 118 },
  ];
  return (
    <AppShell subtitle="Cliente" title="Il mio garage">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-primary/40 bg-primary/5 p-5">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <p className="mt-4 font-heading text-lg font-semibold">Garanzia attiva</p>
          <p className="text-xs text-muted-foreground">24 mesi · scade 09/2027</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-[#0d1817] p-5">
          <Settings2 className="h-6 w-6 text-primary" />
          <p className="mt-4 font-heading text-lg font-semibold">Prossimo tagliando</p>
          <p className="text-xs text-muted-foreground">tra 3.200 km · o 14 settimane</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-[#0d1817] p-5">
          <User className="h-6 w-6 text-primary" />
          <p className="mt-4 font-heading text-lg font-semibold">Consulente</p>
          <p className="text-xs text-muted-foreground">Marco Ferrero · risponde in 4 min</p>
        </div>
      </div>

      <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Storico interventi</p>
      <div className="mt-3 overflow-hidden rounded-2xl border border-border/60">
        {storico.map((s, i) => (
          <div key={s.data} className={`flex items-center justify-between gap-3 p-4 ${i % 2 ? "bg-[#0b1413]" : "bg-[#0f1c1b]"}`}>
            <div>
              <p className="text-sm font-semibold">{s.voce}</p>
              <p className="text-xs text-muted-foreground">{s.data} · {eur(s.tot)}</p>
            </div>
            <button type="button" className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border/60 px-3 text-xs text-muted-foreground hover:text-foreground">
              <Download className="h-3.5 w-3.5" /> Fattura
            </button>
          </div>
        ))}
      </div>

      <Button className="mt-6 min-h-12 w-full rounded-none uppercase tracking-[0.14em]">Prenota il prossimo tagliando</Button>
    </AppShell>
  );
}

function Crm() {
  const funnel = [
    { label: "Visite vetrina", v: 4820, w: 100 },
    { label: "Schede aperte", v: 1290, w: 62 },
    { label: "Test drive", v: 168, w: 34 },
    { label: "Permute richieste", v: 96, w: 22 },
    { label: "Vendite", v: 31, w: 12 },
  ];
  const leads = [
    { nome: "Chiara Ventura", auto: "Aurelia Aria E", temp: "Calda", nota: "Test drive giovedì" },
    { nome: "Davide Rinaldi", auto: "Aurelia Corsa GT", temp: "Calda", nota: "Attende offerta permuta" },
    { nome: "Sara Poggi", auto: "Aurelia Monte 4X", temp: "Tiepida", nota: "Richiesta rata 48 mesi" },
    { nome: "Enrico Salvi", auto: "Aurelia Riva SW", temp: "Fredda", nota: "Solo informazioni" },
  ];
  return (
    <AppShell subtitle="Admin" title="CRM vendite · agosto">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { l: "Vetture vendute", v: "31" },
          { l: "Margine medio", v: eur(3140) },
          { l: "Lead attivi", v: "96" },
          { l: "Tempo risposta", v: "4 min" },
        ].map((k) => (
          <div key={k.l} className="rounded-2xl border border-border/60 bg-[#0d1817] p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{k.l}</p>
            <p className="mt-2 font-heading text-2xl font-semibold text-primary">{k.v}</p>
          </div>
        ))}
      </div>

      <p className="mt-7 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <TrendingUp className="h-3.5 w-3.5 text-primary" /> Funnel di acquisizione
      </p>
      <div className="mt-3 space-y-2">
        {funnel.map((f) => (
          <div key={f.label} className="rounded-xl border border-border/60 bg-[#0c1615] p-3">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{f.label}</span>
              <span className="font-semibold">{f.v.toLocaleString("it-IT")}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-primary" style={{ width: `${f.w}%` }} />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Lead per temperatura</p>
      <div className="mt-3 overflow-hidden rounded-2xl border border-border/60">
        {leads.map((l, i) => (
          <div key={l.nome} className={`flex flex-wrap items-center justify-between gap-2 p-4 ${i % 2 ? "bg-[#0b1413]" : "bg-[#0f1c1b]"}`}>
            <div>
              <p className="text-sm font-semibold">{l.nome}</p>
              <p className="text-xs text-muted-foreground">{l.auto} · {l.nota}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                l.temp === "Calda" ? "bg-primary/15 text-primary" : l.temp === "Tiepida" ? "bg-amber-500/15 text-amber-400" : "bg-white/10 text-muted-foreground"
              }`}
            >
              {l.temp}
            </span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

/* ══════════ Contenitore con navigazione ══════════ */

export default function AureliaApp() {
  const [tab, setTab] = useState<TabId>("vetrina");
  const [vehicle, setVehicle] = useState<Vehicle>(VEHICLES[0]);

  return (
    <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border/60 bg-[#08100f] shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur">
      {/* barra app */}
      <div className="flex items-center justify-between border-b border-border/60 bg-[#0f1c1b] px-5 py-3">
        <span className="font-heading text-sm tracking-[0.3em]">AURELIA MOTORI</span>
        <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">webapp · demo navigabile</span>
      </div>

      {/* tab */}
      <div className="-mx-px flex gap-1 overflow-x-auto border-b border-border/60 bg-[#0b1413] px-3 py-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-xs font-semibold transition-colors ${
              tab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>

      {tab === "vetrina" && <Vetrina onOpen={(v) => { setVehicle(v); setTab("scheda"); }} />}
      {tab === "scheda" && <Scheda vehicle={vehicle} onBook={() => setTab("testdrive")} />}
      {tab === "testdrive" && <TestDrive vehicle={vehicle} />}
      {tab === "permuta" && <Permuta />}
      {tab === "officina" && <Officina />}
      {tab === "garage" && <Garage />}
      {tab === "crm" && <Crm />}
    </div>
  );
}
