import type { CSSProperties } from "react";
import type { MockupScreen, SectorMockupVariant } from "@/data/sector-mockups";

type Props = {
  variant: SectorMockupVariant;
  screen: MockupScreen;
  compact?: boolean;
};

type SectorCopy = {
  hero: string;
  cta: string;
  stats: string[];
  catalog: string[];
  detailTitle: string;
  bookingTitle: string;
};

const COPY: Record<string, SectorCopy> = {
  food: {
    hero: "Esperienza cucina live",
    cta: "Prenota tavolo",
    stats: ["18:30", "42 coperti", "4.9"],
    catalog: ["Degustazione", "Crudi", "Cantina", "Dessert"],
    detailTitle: "Signature selezionato",
    bookingTitle: "Conferma tavolo",
  },
  beauty: {
    hero: "Percorso beauty su misura",
    cta: "Prenota slot",
    stats: ["12 servizi", "6 cabine", "VIP"],
    catalog: ["Manicure", "Color", "Rituali", "Retail"],
    detailTitle: "Scheda cliente VIP",
    bookingTitle: "Agenda specialisti",
  },
  ncc: {
    hero: "Transfer e charter concierge",
    cta: "Calcola rotta",
    stats: ["12 mezzi", "24/7", "ETA 8'"],
    catalog: ["Berline", "Van", "Yacht", "Tour"],
    detailTitle: "Itinerario privato",
    bookingTitle: "Preventivo corsa",
  },
  hospitality: {
    hero: "Soggiorno diretto premium",
    cta: "Verifica date",
    stats: ["9 suite", "Spa", "4.8"],
    catalog: ["Suite", "Spa", "Cena", "Tour"],
    detailTitle: "Esperienza curata",
    bookingTitle: "Booking diretto",
  },
  fitness: {
    hero: "Club, corsi e performance",
    cta: "Prenota campo",
    stats: ["8 campi", "22 corsi", "92%"],
    catalog: ["Padel", "Coach", "Corsi", "Shop"],
    detailTitle: "Coach e disponibilità",
    bookingTitle: "Prenotazione live",
  },
  healthcare: {
    hero: "Percorso medico ordinato",
    cta: "Prenota visita",
    stats: ["18 medici", "3 sedi", "48h"],
    catalog: ["Visite", "Esami", "Medici", "Referti"],
    detailTitle: "Specialista selezionato",
    bookingTitle: "Conferma visita",
  },
  veterinary: {
    hero: "Cura e soggiorni pet",
    cta: "Prenota pet",
    stats: ["32 ospiti", "Vet", "Foto"],
    catalog: ["Pensione", "Toeletta", "Visite", "Day-care"],
    detailTitle: "Profilo animale",
    bookingTitle: "Calendario soggiorno",
  },
  childcare: {
    hero: "Giornata bimbo sempre chiara",
    cta: "Open day",
    stats: ["4 classi", "Menu", "Foto"],
    catalog: ["Routine", "Laboratori", "Pasti", "Team"],
    detailTitle: "Diario attività",
    bookingTitle: "Iscrizione guidata",
  },
  construction: {
    hero: "Progetti, unità e cantieri",
    cta: "Prenota visita",
    stats: ["68%", "14 unità", "3D"],
    catalog: ["Unità", "Tour", "Ticket", "Report"],
    detailTitle: "Unità e capitolato",
    bookingTitle: "Visita in agenda",
  },
  plumber: {
    hero: "Intervento tecnico rapido",
    cta: "Chiama squadra",
    stats: ["18' ETA", "24/7", "SOS"],
    catalog: ["Idraulica", "Caldaia", "Clima", "Gas"],
    detailTitle: "Scheda intervento",
    bookingTitle: "Squadra in arrivo",
  },
};

const texture = (layout: SectorMockupVariant["layout"], color: string) => {
  if (layout === "playful") return `radial-gradient(circle at 18% 16%, ${color}33 0 12%, transparent 13%), radial-gradient(circle at 82% 22%, ${color}22 0 9%, transparent 10%)`;
  if (layout === "technical" || layout === "dashboard") return `linear-gradient(${color}14 1px, transparent 1px), linear-gradient(90deg, ${color}14 1px, transparent 1px)`;
  if (layout === "luxury") return `radial-gradient(circle at 50% -10%, ${color}42, transparent 42%)`;
  return `linear-gradient(135deg, ${color}1f, transparent 42%)`;
};

export default function LiveMockupScreen({ variant, screen, compact = false }: Props) {
  const t = variant.theme;
  const copy = COPY[variant.sectorId] ?? COPY.food;
  const isDark = t.bg.toLowerCase() < "#777777";
  const wrap: CSSProperties = {
    background: t.bg,
    color: t.text,
    fontFamily: variant.layout === "editorial" || variant.layout === "luxury" ? "Georgia, serif" : "Inter, ui-sans-serif, system-ui",
  };
  const overlay: CSSProperties = {
    backgroundImage: texture(variant.layout, t.accent),
    backgroundSize: variant.layout === "technical" || variant.layout === "dashboard" ? "34px 34px" : "100% 100%",
  };
  const pill: CSSProperties = { background: t.surface2, color: t.text, border: `1px solid ${t.line}` };
  const accentBlock: CSSProperties = { background: t.accent, color: isDark ? "#111111" : "#ffffff" };
  const card: CSSProperties = { background: t.surface, border: `1px solid ${t.line}`, boxShadow: `0 18px 38px -28px ${t.accent}` };

  const tiny = compact;
  const header = (
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0">
        <div className="truncate text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: t.muted }}>{variant.sectorId}</div>
        <div className="truncate text-[17px] font-black leading-tight">{variant.brand}</div>
      </div>
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-black" style={accentBlock}>{variant.brand.slice(0, 1)}</div>
    </div>
  );

  return (
    <div className="relative h-full w-full overflow-hidden" style={wrap}>
      <div className="pointer-events-none absolute inset-0 opacity-80" style={overlay} />
      <div className={`relative flex h-full flex-col ${tiny ? "p-3 pt-7" : "p-5 pt-12"}`}>
        {header}

        {screen.kind === "home" && (
          <>
            <div className="mt-6 rounded-[26px] p-4" style={variant.layout === "luxury" ? accentBlock : card}>
              <div className="text-[10px] font-black uppercase tracking-[0.18em] opacity-70">{variant.style}</div>
              <div className="mt-2 text-[26px] font-black leading-[0.96]">{copy.hero}</div>
              <div className="mt-5 inline-flex rounded-full px-4 py-2 text-[11px] font-black" style={variant.layout === "luxury" ? card : accentBlock}>{copy.cta}</div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {copy.stats.map((s) => <div key={s} className="rounded-2xl p-3 text-center" style={card}><div className="text-sm font-black">{s}</div><div className="mt-1 h-1 rounded-full" style={{ background: t.accent }} /></div>)}
            </div>
            <div className="mt-auto grid grid-cols-2 gap-2">
              {variant.features.slice(0, 4).map((f) => <div key={f} className="rounded-2xl px-3 py-2 text-[11px] font-bold" style={pill}>{f}</div>)}
            </div>
          </>
        )}

        {screen.kind === "catalog" && (
          <>
            <div className="mt-5 flex items-end justify-between"><div className="text-2xl font-black">{screen.label}</div><div className="rounded-full px-3 py-1 text-[10px] font-black" style={pill}>LIVE</div></div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {copy.catalog.map((item, i) => <div key={item} className={`${i === 0 ? "row-span-2" : ""} rounded-[22px] p-3`} style={card}><div className="h-16 rounded-2xl" style={{ background: i % 2 ? t.surface2 : t.accent }} /><div className="mt-3 text-sm font-black leading-tight">{item}</div><div className="mt-1 text-[10px]" style={{ color: t.muted }}>{variant.features[i % variant.features.length]}</div></div>)}
            </div>
          </>
        )}

        {screen.kind === "detail" && (
          <>
            <div className="mt-6 rounded-[28px] p-4" style={card}>
              <div className="aspect-[1.25] rounded-[24px]" style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})` }} />
              <div className="mt-4 text-2xl font-black leading-none">{copy.detailTitle}</div>
              <div className="mt-2 text-xs leading-relaxed" style={{ color: t.muted }}>{screen.caption}</div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {variant.features.slice(0, 4).map((f) => <div key={f} className="rounded-2xl p-2 text-[10px] font-bold" style={pill}>{f}</div>)}
              </div>
            </div>
            <div className="mt-4 rounded-[22px] p-3" style={pill}><div className="flex items-center justify-between text-xs font-black"><span>Priorità cliente</span><span style={{ color: t.accent }}>Alta</span></div><div className="mt-2 h-2 rounded-full" style={{ background: t.line }}><div className="h-full w-3/4 rounded-full" style={{ background: t.accent }} /></div></div>
          </>
        )}

        {screen.kind === "booking" && (
          <>
            <div className="mt-6 text-2xl font-black leading-none">{copy.bookingTitle}</div>
            <div className="mt-4 space-y-3">
              {["Oggi", "Domani", "Weekend"].map((slot, i) => <div key={slot} className="flex items-center justify-between rounded-[22px] p-3" style={i === 1 ? accentBlock : card}><div><div className="text-sm font-black">{slot}</div><div className="text-[10px] opacity-70">{i === 0 ? "2 slot rimasti" : i === 1 ? "Consigliato" : "Lista attesa"}</div></div><div className="rounded-full px-3 py-1 text-[10px] font-black" style={i === 1 ? card : pill}>{i === 0 ? "18:30" : i === 1 ? "12:00" : "VIP"}</div></div>)}
            </div>
            <div className="mt-auto rounded-[26px] p-4" style={card}>
              <div className="text-xs font-black uppercase tracking-[0.16em]" style={{ color: t.muted }}>Riepilogo</div>
              <div className="mt-3 flex items-center justify-between text-sm font-black"><span>{variant.brand}</span><span style={{ color: t.accent }}>OK</span></div>
              <div className="mt-4 rounded-full py-3 text-center text-xs font-black" style={accentBlock}>Conferma richiesta</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}