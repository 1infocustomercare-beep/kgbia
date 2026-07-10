import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmpireScrollDirector } from "../ScrollDirector";
import { createMockupPool } from "@/lib/mockup-pool";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";

const MOCKUP_IMAGES = SECTOR_MOCKUP_IMAGES as Record<string, string[] | undefined>;

// Curated proprietary mockups — no low-quality generated PNG batch artifacts here.
// Order matches META below.
const PREMIUM_IMAGES: string[] = [
  MOCKUP_IMAGES.food?.[0],
  MOCKUP_IMAGES.beauty?.[0],
  MOCKUP_IMAGES.fitness?.[0],
  MOCKUP_IMAGES.realestate?.[0],
  MOCKUP_IMAGES.retail?.[0],
  MOCKUP_IMAGES.healthcare?.[0],
  MOCKUP_IMAGES.hospitality?.[0],
  MOCKUP_IMAGES.veterinary?.[0],
  MOCKUP_IMAGES.ncc?.[0],
  MOCKUP_IMAGES.hospitality?.[2],
  MOCKUP_IMAGES.garage?.[0],
  MOCKUP_IMAGES.legal?.[0],
].filter(Boolean) as string[];

// Fallback pool if a slot is missing.
const pool = createMockupPool();
const POOL_BACKUP = pool.take(12);

const META = [
  { tag: "Ristorante", title: "Voltaia", desc: "Menù digitale, prenotazioni e ordini WhatsApp gestiti dall'AI · da €39/mese", year: "2026" },
  { tag: "Spa & Wellness", title: "Séva", desc: "Booking 24/7, cataloghi trattamenti e reminder automatici · da €49/mese", year: "2026" },
  { tag: "Fitness", title: "Forgia", desc: "Iscrizioni online, schede AI e rinnovi abbonamento automatici · da €59/mese", year: "2026" },
  { tag: "Immobiliare", title: "Dimora", desc: "Vetrina immobili, tour virtuali e qualifica lead in chat · da €89/mese", year: "2026" },
  { tag: "Fashion", title: "Atelier Nove", desc: "E-commerce brandizzato, personal shopper AI e clienteling · da €79/mese", year: "2026" },
  { tag: "Studio Dentistico", title: "Aurora", desc: "Agenda medica, promemoria trattamenti e piani di cura digitali · da €69/mese", year: "2026" },
  { tag: "Viaggi & Tour", title: "Rotta", desc: "Preventivi istantanei multilingua e itinerari personalizzati AI · da €69/mese", year: "2026" },
  { tag: "Pet Care", title: "Coda Felice", desc: "Toelettatura e visite veterinarie prenotate via WhatsApp · da €39/mese", year: "2026" },
  { tag: "NCC", title: "Empire NCC", desc: "Centralino AI in 4 lingue e app autisti con corse e pagamenti · da €99/mese", year: "2026" },
  { tag: "Hotel Boutique", title: "Asinara Resort", desc: "Concierge AI multilingua 24/7 e upselling stanze automatico · da €149/mese", year: "2026" },
  { tag: "Officina Auto", title: "Officina Romeo", desc: "Preventivi istantanei, check-in foto e storico interventi cliente · da €49/mese", year: "2026" },
  { tag: "Studio Legale", title: "Studio Riva", desc: "Filtro AI richieste, appuntamenti con video-call e portale documenti · da €99/mese", year: "2026" },
];

const ITEMS = META.map((m, i) => ({
  ...m,
  image: PREMIUM_IMAGES[i] ?? POOL_BACKUP[i]?.image,
  sector: POOL_BACKUP[i]?.sector ?? "food",
}));


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
