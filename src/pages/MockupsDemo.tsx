import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PrestigePhone, { PHONE_VIEWS, type PhoneView } from "@/components/empire-home/prestige/PrestigePhone";
import { getEmpireScreens, type EmpireSector } from "@/components/empire-home/prestige/EmpireMockupScreens";

const SECTORS: { id: EmpireSector; brand: string; tagline: string }[] = [
  { id: "restaurant", brand: "Strapizzami", tagline: "Pizzeria napoletana · Milano" },
  { id: "sushi", brand: "Paperfish", tagline: "Sushi fine dining · Roma" },
  { id: "ncc", brand: "Empire NCC", tagline: "Chauffeur luxury · Como" },
  { id: "beauty", brand: "Velvet Studio", tagline: "Beauty atelier · Torino" },
  { id: "hospitality", brand: "Asinara Resort", tagline: "Boutique hotel · Sardegna" },
  { id: "fitness", brand: "Iron Club", tagline: "Performance gym · Bologna" },
  { id: "realestate", brand: "Dimore Smeraldo", tagline: "Real estate · Costa Smeralda" },
];

export default function MockupsDemo() {
  const [active, setActive] = useState<EmpireSector | "all">("all");
  const [view, setView] = useState<PhoneView>("Home sito");

  const visible = useMemo(
    () => (active === "all" ? SECTORS : SECTORS.filter((s) => s.id === active)),
    [active]
  );

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0A0B0F]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/" className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70 hover:text-white">
            ← Home
          </Link>
          <h1 className="text-base font-semibold tracking-tight" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
            Mockup demo · stile per settore
          </h1>
          <div className="ml-auto flex flex-wrap gap-2">
            {PHONE_VIEWS.map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-full border px-3 py-1 text-[11px] font-medium transition ${
                  view === v
                    ? "border-white bg-white text-black"
                    : "border-white/20 text-white/70 hover:border-white/50"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl flex-wrap gap-1.5 px-4 pb-3">
          <button
            onClick={() => setActive("all")}
            className={`rounded-md border px-2.5 py-1 text-[11px] uppercase tracking-wider ${
              active === "all" ? "border-emerald-400 text-emerald-300" : "border-white/15 text-white/60"
            }`}
          >
            Tutti
          </button>
          {SECTORS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`rounded-md border px-2.5 py-1 text-[11px] uppercase tracking-wider ${
                active === s.id ? "border-emerald-400 text-emerald-300" : "border-white/15 text-white/60"
              }`}
            >
              {s.brand}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <p className="mb-8 max-w-2xl text-sm text-white/60">
          Anteprima dei 7 settori con DNA visivo unico: palette, font, raggi, texture, ombre e stile grafici differenti.
          Usa i filtri sopra per cambiare schermata (Home sito / App cliente / Admin / AI WhatsApp) o isolare un settore.
        </p>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((s) => (
            <article key={s.id} className="flex flex-col items-center gap-3">
              <PrestigePhone
                width={240}
                label={view}
                loading="eager"
                screen={getEmpireScreens(s.id, view)}
              />
              <div className="text-center">
                <div className="text-sm font-semibold" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                  {s.brand}
                </div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">{s.tagline}</div>
              </div>
            </article>
          ))}
        </div>

        {active === "all" && (
          <section className="mt-16 border-t border-white/10 pt-10">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
              Tutte le viste · settore selezionato
            </h2>
            <div className="flex flex-wrap gap-2">
              {SECTORS.map((s) => (
                <Link
                  key={s.id}
                  to={`?focus=${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActive(s.id);
                  }}
                  className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:border-emerald-400 hover:text-emerald-300"
                >
                  Vedi {s.brand} → tutte le 4 schermate
                </Link>
              ))}
            </div>
          </section>
        )}

        {active !== "all" && (
          <section className="mt-16 border-t border-white/10 pt-10">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
              {SECTORS.find((s) => s.id === active)?.brand} · tutte le 4 schermate
            </h2>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {PHONE_VIEWS.map((v) => (
                <div key={v} className="flex flex-col items-center gap-2">
                  <PrestigePhone
                    width={220}
                    label={v}
                    loading="eager"
                    screen={getEmpireScreens(active, v)}
                  />
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/55">{v}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
