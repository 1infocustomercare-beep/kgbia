/**
 * ═══ JET QUOTE CONSOLE ═══
 * Preventivo istantaneo interattivo (demo, calcolo locale): tratta, rotta,
 * passeggeri, cabina e servizi → stima prezzo e tempo di volo in tempo reale.
 */
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Plane, Users, CalendarDays, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LuxePanel, LuxeTag } from "@/components/public/luxe";

type Trip = "one-way" | "round" | "multi";

const ROUTES = [
  { id: "mxp-nce", from: "Milano Linate", to: "Nizza", km: 290, min: 55 },
  { id: "rom-ibz", from: "Roma Ciampino", to: "Ibiza", km: 1180, min: 120 },
  { id: "mxp-lon", from: "Milano Linate", to: "Londra Luton", km: 1000, min: 115 },
  { id: "vce-dxb", from: "Venezia", to: "Dubai", km: 4400, min: 360 },
  { id: "rom-nyc", from: "Roma Fiumicino", to: "New York Teterboro", km: 6900, min: 525 },
];

const CABINS = [
  { id: "light", label: "Light", rate: 3.1 },
  { id: "midsize", label: "Midsize", rate: 5.4 },
  { id: "ultra", label: "Ultra", rate: 9.2 },
];

const EXTRAS = [
  { id: "chef", label: "Chef stellato a bordo", cost: 2400 },
  { id: "limo", label: "Transfer Maybach A/R", cost: 900 },
  { id: "heli", label: "Coda in elicottero", cost: 3800 },
  { id: "pet", label: "Pet suite dedicata", cost: 600 },
];

const fmt = (n: number) => new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export default function JetQuoteConsole() {
  const [trip, setTrip] = useState<Trip>("round");
  const [routeId, setRouteId] = useState(ROUTES[1].id);
  const [cabin, setCabin] = useState("midsize");
  const [pax, setPax] = useState(4);
  const [extras, setExtras] = useState<string[]>(["limo"]);
  const [sent, setSent] = useState(false);

  const route = ROUTES.find((r) => r.id === routeId)!;
  const rate = CABINS.find((c) => c.id === cabin)!.rate;

  const { total, minutes, legs } = useMemo(() => {
    const legs = trip === "one-way" ? 1 : trip === "round" ? 2 : 3;
    const base = route.km * rate * legs * 10;
    const paxFee = Math.max(0, pax - 4) * 320 * legs;
    const extrasFee = extras.reduce((s, id) => s + (EXTRAS.find((e) => e.id === id)?.cost || 0), 0);
    return { total: Math.round((base + paxFee + extrasFee) / 100) * 100, minutes: route.min * legs, legs };
  }, [trip, route, rate, pax, extras]);

  const toggleExtra = (id: string) =>
    setExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const hrs = `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`;

  return (
    <section id="preventivo" className="relative px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <LuxeTag><Sparkles className="h-3 w-3" /> Flight desk · live</LuxeTag>
          <h2 className="mt-5 max-w-2xl font-heading text-3xl font-semibold leading-tight sm:text-5xl">
            Configura il volo. La stima è immediata.
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <LuxePanel glass className="p-6 sm:p-9">
            {/* Trip type */}
            <div className="flex flex-wrap gap-2">
              {([
                ["one-way", "Solo andata"],
                ["round", "Andata e ritorno"],
                ["multi", "Multi-tratta"],
              ] as [Trip, string][]).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTrip(id)}
                  aria-pressed={trip === id}
                  className={`min-h-11 border px-4 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                    trip === id ? "border-primary bg-primary/15 text-primary" : "border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Route */}
            <div className="mt-8">
              <p className="mb-3 text-[10px] uppercase tracking-[0.26em] text-muted-foreground">Rotta</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {ROUTES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRouteId(r.id)}
                    aria-pressed={routeId === r.id}
                    className={`flex min-h-14 items-center justify-between gap-3 border px-4 text-left transition-colors ${
                      routeId === r.id ? "border-primary bg-primary/10" : "border-border/60 hover:border-primary/50"
                    }`}
                  >
                    <span className="text-sm">
                      <span className="block font-medium">{r.from}</span>
                      <span className="text-xs text-muted-foreground">→ {r.to}</span>
                    </span>
                    <Plane className="h-4 w-4 shrink-0 text-primary" />
                  </button>
                ))}
              </div>
            </div>

            {/* Cabin + pax */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.26em] text-muted-foreground">Cabina</p>
                <div className="flex gap-2">
                  {CABINS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCabin(c.id)}
                      aria-pressed={cabin === c.id}
                      className={`min-h-11 flex-1 border text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                        cabin === c.id ? "border-primary bg-primary/15 text-primary" : "border-border/60 text-muted-foreground"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> Passeggeri · {pax}
                </p>
                <input
                  type="range"
                  min={1}
                  max={14}
                  value={pax}
                  onChange={(e) => setPax(Number(e.target.value))}
                  aria-label="Numero passeggeri"
                  className="h-11 w-full accent-[hsl(var(--primary))]"
                />
              </div>
            </div>

            {/* Extras */}
            <div className="mt-8">
              <p className="mb-3 text-[10px] uppercase tracking-[0.26em] text-muted-foreground">Servizi concierge</p>
              <div className="flex flex-wrap gap-2">
                {EXTRAS.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => toggleExtra(e.id)}
                    aria-pressed={extras.includes(e.id)}
                    className={`min-h-11 border px-4 text-xs transition-colors ${
                      extras.includes(e.id)
                        ? "border-primary bg-primary/12 text-primary"
                        : "border-border/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
          </LuxePanel>

          {/* Live estimate */}
          <LuxePanel glow className="flex flex-col p-6 sm:p-9">
            <p className="text-[10px] uppercase tracking-[0.28em] text-primary">Stima indicativa</p>
            <motion.p
              key={total}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mt-4 font-heading text-4xl font-semibold sm:text-6xl"
            >
              {fmt(total)}
            </motion.p>
            <p className="mt-2 text-xs text-muted-foreground">
              {legs} {legs === 1 ? "tratta" : "tratte"} · {pax} passeggeri · cabina {CABINS.find((c) => c.id === cabin)!.label}
            </p>

            <div className="mt-7 space-y-3 border-t border-border/50 pt-6 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> Tempo di volo</span>
                <span className="font-medium">{hrs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground"><Plane className="h-4 w-4" /> Rotta</span>
                <span className="text-right font-medium">{route.from} → {route.to}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground"><CalendarDays className="h-4 w-4" /> Attivazione</span>
                <span className="font-medium">da 2 ore</span>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => setSent(true)}
              className="mt-auto min-h-12 w-full rounded-none uppercase tracking-[0.16em]"
            >
              {sent ? "Richiesta inviata" : "Conferma con un advisor"}
              {!sent && <ArrowRight className="h-4 w-4" />}
            </Button>
            <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
              {sent
                ? "Un flight advisor Aurea ti risponde entro 20 minuti, 24/7."
                : "Stima dimostrativa: la quotazione definitiva dipende da slot, handling e disponibilità dell’aeromobile."}
            </p>
          </LuxePanel>
        </div>
      </div>
    </section>
  );
}
