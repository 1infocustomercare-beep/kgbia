import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmpireScrollDirector } from "../ScrollDirector";
import { createMockupPool } from "@/lib/mockup-pool";

const pool = createMockupPool();
// reserve 12 mockups for the portfolio strip
const PORT = pool.take(12);

const META = [
  { tag: "Food", title: "Strapizzami", desc: "Pizzeria · Ordini WhatsApp gestiti dall'AI in 12 secondi", year: "2025" },
  { tag: "Sushi", title: "Paperfish", desc: "Sushi bar · Prenotazioni 24/7 senza staff al telefono", year: "2025" },
  { tag: "NCC", title: "Empire NCC", desc: "Trasporti luxury · Centralino AI in 4 lingue", year: "2025" },
  { tag: "Beauty", title: "Velvet Studio", desc: "Beauty · Agenda piena, zero no-show grazie ai reminder", year: "2025" },
  { tag: "Hotel", title: "Asinara Resort", desc: "Boutique hotel · Concierge AI multilingua 24/7", year: "2024" },
  { tag: "Boat", title: "Batey Pacifico", desc: "Yacht charter · Booking con voice agent", year: "2025" },
  { tag: "Fitness", title: "Iron Club", desc: "Palestra · Onboarding membri 100% automatico", year: "2025" },
  { tag: "Caffè", title: "Bar Centrale", desc: "Caffetteria · Ordini al banco via QR + fidelity", year: "2024" },
  { tag: "Pro", title: "Studio Legale Riva", desc: "Avvocati · Filtro AI delle richieste in entrata", year: "2025" },
  { tag: "Pet", title: "Pet Care", desc: "Toelettatura · Appuntamenti via WhatsApp", year: "2025" },
  { tag: "Auto", title: "Officina Romeo", desc: "Meccanico · Preventivi istantanei + check-in foto", year: "2024" },
  { tag: "Eventi", title: "Wedding Planner", desc: "Eventi · CRM clienti + portfolio interattivo", year: "2025" },
];

const ITEMS = PORT.map((p, i) => ({ ...META[i], image: p.image, sector: p.sector }));

export default function PrestigePortfolio() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const { ref } = useEmpireScrollDirector<HTMLDivElement>("prestige-mockups", { steps: 4 });
  const visible = expanded ? ITEMS : ITEMS.slice(0, 4);

  return (
    <section
      ref={ref}
      id="prestige-mockups"
      data-section="prestige-mockups"
      className="prestige-section prestige-light py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-deep))" }}>
              ✦ I nostri lavori
            </div>
            <h2 className="prestige-display mt-3 text-4xl font-semibold sm:text-5xl md:text-6xl" style={{ color: "hsl(var(--pr-text-on-light))" }}>
              Casi reali.<br />
              <span className="prestige-gold-text">Risultati misurabili.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm sm:text-base" style={{ color: "hsl(var(--pr-muted-on-light))" }}>
            Ogni progetto è disegnato sul brand del cliente. Tocca un mockup per esplorare il caso studio
            completo: problema, soluzione e risultati ottenuti.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((item, i) => (
            <article
              key={item.title}
              className="group cursor-pointer"
              onClick={() => navigate("/portfolio")}
              style={{ animation: `prestigeSlideUp .7s ${(i % 4) * 0.08}s cubic-bezier(.22,1,.36,1) backwards` }}
            >
              <div
                className="relative aspect-[4/5] overflow-hidden rounded-2xl"
                style={{
                  background: "linear-gradient(145deg, hsl(var(--pr-emerald)), hsl(var(--pr-emerald-deep)))",
                  boxShadow: "0 20px 50px -20px hsl(var(--pr-emerald) / 0.4)",
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
                />
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: "linear-gradient(180deg, transparent 50%, hsl(var(--pr-emerald-deep) / 0.85))" }}
                />
                <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-end justify-between opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ background: "hsl(var(--pr-gold))", color: "hsl(var(--pr-emerald-deep))" }}>
                    {item.tag}
                  </span>
                  <ExternalLink size={16} style={{ color: "hsl(var(--pr-gold-light))" }} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <h3 className="prestige-display text-lg" style={{ color: "hsl(var(--pr-text-on-light))" }}>{item.title}</h3>
                <span className="text-[11px] tabular-nums" style={{ color: "hsl(var(--pr-muted-on-light))" }}>{item.year}</span>
              </div>
              <p className="mt-1 text-xs leading-snug sm:text-sm" style={{ color: "hsl(var(--pr-muted-on-light))" }}>
                {item.desc}
              </p>
            </article>
          ))}
        </div>

        {/* Expand button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all"
            style={{
              background: "hsl(var(--pr-emerald))",
              color: "hsl(var(--pr-gold-light))",
              border: "1px solid hsl(var(--pr-gold) / 0.35)",
            }}
          >
            {expanded ? (
              <>Mostra meno <ChevronUp size={16} /></>
            ) : (
              <>Vedi tutti i {ITEMS.length} progetti <ChevronDown size={16} /></>
            )}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes prestigeSlideUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
