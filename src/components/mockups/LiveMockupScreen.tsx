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

type ScreenRendererArgs = {
  variant: SectorMockupVariant;
  screen: MockupScreen;
  copy: SectorCopy;
  compact: boolean;
  styles: ReturnType<typeof buildStyles>;
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

const hexToRgb = (hex: string) => {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};

const readableOn = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.58 ? "#101010" : "#ffffff";
};

const buildStyles = (variant: SectorMockupVariant) => {
  const t = variant.theme;
  const accentText = readableOn(t.accent);
  return {
    pill: { background: t.surface2, color: t.text, border: `1px solid ${t.line}` } satisfies CSSProperties,
    card: { background: t.surface, border: `1px solid ${t.line}`, boxShadow: `0 18px 38px -28px ${t.accent}` } satisfies CSSProperties,
    soft: { background: t.surface2, border: `1px solid ${t.line}` } satisfies CSSProperties,
    accentBlock: { background: t.accent, color: accentText } satisfies CSSProperties,
    accentSoft: { background: `${t.accent}22`, border: `1px solid ${t.accent}55` } satisfies CSSProperties,
    line: { background: t.line } satisfies CSSProperties,
    muted: { color: t.muted } satisfies CSSProperties,
    gradient: { background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`, color: accentText } satisfies CSSProperties,
  };
};

const InitialBadge = ({ variant, styles }: { variant: SectorMockupVariant; styles: ReturnType<typeof buildStyles> }) => (
  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-black" style={styles.accentBlock}>
    {variant.brand.slice(0, 1)}
  </div>
);

const CompactHeader = ({ variant, styles, centered = false }: { variant: SectorMockupVariant; styles: ReturnType<typeof buildStyles>; centered?: boolean }) => (
  <div className={`flex items-center ${centered ? "justify-center text-center" : "justify-between"} gap-2`}>
    <div className="min-w-0">
      <div className="truncate text-[10px] font-black uppercase tracking-[0.18em]" style={styles.muted}>{variant.sectorId}</div>
      <div className="truncate text-[17px] font-black leading-tight">{variant.brand}</div>
    </div>
    {!centered && <InitialBadge variant={variant} styles={styles} />}
  </div>
);

const Dots = ({ count = 3, active = 0, color }: { count?: number; active?: number; color: string }) => (
  <div className="flex gap-1.5">
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className="h-1.5 rounded-full" style={{ width: i === active ? 18 : 6, background: i === active ? color : `${color}55` }} />
    ))}
  </div>
);

const HomeLuxury = ({ variant, copy, compact, styles }: ScreenRendererArgs) => (
  <>
    <div className="mt-1 text-center">
      <div className="text-[10px] font-black uppercase tracking-[0.28em]" style={styles.muted}>{variant.style}</div>
      <div className={`mt-2 font-black leading-none ${compact ? "text-[19px]" : "text-[22px]"}`}>{variant.brand}</div>
    </div>
    <div className={`${compact ? "mt-5 rounded-[26px] p-4" : "mt-7 rounded-[30px] p-5"}`} style={styles.accentBlock}>
      <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-75">Private club</div>
      <div className={`mt-3 font-black leading-[0.92] ${compact ? "text-[23px]" : "text-[28px]"}`}>{copy.hero}</div>
      <div className={`${compact ? "mt-4 px-4" : "mt-6 px-5"} inline-flex rounded-full py-2 text-[11px] font-black`} style={styles.card}>{copy.cta}</div>
    </div>
    <div className="mt-4 grid grid-cols-3 gap-2">
      {copy.stats.map((s) => <div key={s} className="rounded-2xl p-3 text-center" style={styles.card}><div className="text-sm font-black">{s}</div><div className="mt-2 h-1 rounded-full" style={{ background: variant.theme.accent }} /></div>)}
    </div>
    <div className="mt-auto grid grid-cols-2 gap-2">
      {variant.features.slice(0, 4).map((f) => <div key={f} className="rounded-2xl px-3 py-2 text-[11px] font-bold" style={styles.pill}>{f}</div>)}
    </div>
  </>
);

const HomeEditorial = ({ variant, copy, compact, styles }: ScreenRendererArgs) => (
  <>
    <div className="border-y py-3 text-center" style={{ borderColor: variant.theme.line }}>
      <div className="text-[9px] font-black uppercase tracking-[0.28em]" style={styles.muted}>Special issue</div>
      <div className={`mt-1 font-black leading-[0.95] ${compact ? "text-[21px]" : "text-[24px]"}`}>{copy.hero}</div>
    </div>
    <div className="mt-4 grid grid-cols-[1.15fr_0.85fr] gap-3">
      <div className="rounded-[26px] p-4" style={styles.card}>
        <div className="h-28 rounded-[22px]" style={styles.gradient} />
        <div className="mt-3 text-[11px] font-bold leading-tight" style={styles.muted}>{variant.description}</div>
      </div>
      <div className="space-y-2">
        {copy.stats.map((s) => <div key={s} className="rounded-2xl p-3" style={styles.soft}><div className="text-base font-black">{s}</div><div className="mt-1 h-px" style={styles.line} /></div>)}
      </div>
    </div>
    <div className="mt-auto rounded-[24px] p-3" style={styles.accentBlock}>
      <div className="text-center text-xs font-black">{copy.cta}</div>
    </div>
  </>
);

const HomeCommerce = ({ variant, copy, compact, styles }: ScreenRendererArgs) => (
  <>
    <div className="flex items-center justify-between rounded-full px-3 py-2" style={styles.pill}>
      <span className="text-[10px] font-black uppercase tracking-[0.16em]">Shop live</span>
      <Dots color={variant.theme.accent} active={1} />
    </div>
    <div className="mt-4 rounded-[28px] p-4" style={styles.card}>
      <div className="grid grid-cols-2 gap-2">
        <div className="aspect-[0.8] rounded-[24px]" style={styles.gradient} />
        <div className="space-y-2">
          <div className="h-14 rounded-2xl" style={styles.soft} />
          <div className="h-20 rounded-2xl" style={styles.accentSoft} />
        </div>
      </div>
      <div className={`mt-4 font-black leading-[0.95] ${compact ? "text-[21px]" : "text-[25px]"}`}>{copy.hero}</div>
    </div>
    <div className="mt-3 grid grid-cols-2 gap-2">
      {variant.features.slice(0, 4).map((f, i) => <div key={f} className="rounded-[20px] p-3 text-[10px] font-black" style={i === 0 ? styles.accentBlock : styles.pill}>{f}</div>)}
    </div>
    <div className="mt-auto rounded-full py-3 text-center text-xs font-black" style={styles.accentBlock}>{copy.cta}</div>
  </>
);

const HomeDashboard = ({ variant, copy, compact, styles }: ScreenRendererArgs) => (
  <>
    <div className="grid grid-cols-3 gap-2">
      {copy.stats.map((s, i) => <div key={s} className="rounded-2xl p-3" style={i === 0 ? styles.accentBlock : styles.card}><div className="text-[10px] font-bold opacity-70">KPI</div><div className="mt-1 text-sm font-black">{s}</div></div>)}
    </div>
    <div className="mt-4 rounded-[26px] p-4" style={styles.card}>
      <div className="text-[10px] font-black uppercase tracking-[0.18em]" style={styles.muted}>Control room</div>
      <div className={`mt-2 font-black leading-[0.94] ${compact ? "text-[21px]" : "text-[25px]"}`}>{copy.hero}</div>
      <div className={`${compact ? "h-20" : "h-28"} mt-5 flex items-end gap-2`}>
        {[42, 76, 58, 92, 68].map((h, i) => <div key={i} className="flex-1 rounded-t-xl" style={{ height: `${h}%`, background: i === 3 ? variant.theme.accent : variant.theme.surface2 }} />)}
      </div>
    </div>
    <div className="mt-auto space-y-2">
      {variant.features.slice(0, 3).map((f, i) => <div key={f} className="flex items-center justify-between rounded-2xl p-3 text-[11px] font-bold" style={styles.pill}><span>{f}</span><span style={{ color: variant.theme.accent }}>{i === 0 ? "ON" : "+"}</span></div>)}
    </div>
  </>
);

const HomeAgenda = ({ variant, copy, compact, styles }: ScreenRendererArgs) => (
  <>
    <div className="rounded-[26px] p-4" style={styles.accentBlock}>
      <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Oggi</div>
      <div className={`mt-2 font-black leading-[0.92] ${compact ? "text-[22px]" : "text-[27px]"}`}>{copy.hero}</div>
    </div>
    <div className="mt-4 space-y-3">
      {["08:30", "12:00", "18:45"].map((time, i) => <div key={time} className="grid grid-cols-[48px_1fr] gap-3 rounded-[22px] p-3" style={styles.card}><div className="text-xs font-black" style={{ color: variant.theme.accent }}>{time}</div><div><div className="text-sm font-black">{copy.catalog[i]}</div><div className="mt-1 text-[10px]" style={styles.muted}>{variant.features[i]}</div></div></div>)}
    </div>
    <div className="mt-auto rounded-full py-3 text-center text-xs font-black" style={styles.accentBlock}>{copy.cta}</div>
  </>
);

const HomeMap = ({ variant, copy, compact, styles }: ScreenRendererArgs) => (
  <>
    <div className={`${compact ? "h-40" : "h-48"} relative mt-1 overflow-hidden rounded-[30px]`} style={styles.card}>
      <div className="absolute inset-0 opacity-70" style={{ backgroundImage: `linear-gradient(${variant.theme.accent}20 1px, transparent 1px), linear-gradient(90deg, ${variant.theme.accent}20 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
      <div className="absolute left-8 top-10 h-3 w-3 rounded-full" style={styles.accentBlock} />
      <div className="absolute right-9 bottom-9 h-4 w-4 rounded-full" style={styles.gradient} />
      <div className="absolute left-10 top-12 h-24 w-32 rounded-br-[42px] border-b-4 border-r-4" style={{ borderColor: variant.theme.accent }} />
      <div className="absolute bottom-4 left-4 right-4 rounded-2xl p-3" style={styles.pill}><div className="text-sm font-black">{copy.hero}</div><div className="text-[10px]" style={styles.muted}>{copy.stats.join(" · ")}</div></div>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-2">
      {variant.features.slice(0, 4).map((f) => <div key={f} className="rounded-2xl p-3 text-[11px] font-bold" style={styles.card}>{f}</div>)}
    </div>
    <div className="mt-auto rounded-full py-3 text-center text-xs font-black" style={styles.accentBlock}>{copy.cta}</div>
  </>
);

const HomeClinical = ({ variant, copy, styles }: ScreenRendererArgs) => (
  <>
    <div className="rounded-[26px] p-4" style={styles.card}>
      <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl text-lg font-black" style={styles.accentBlock}>+</div><div><div className="text-[10px] font-black uppercase tracking-[0.18em]" style={styles.muted}>Percorso paziente</div><div className="text-xl font-black leading-none">{copy.hero}</div></div></div>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-3">
      {copy.catalog.map((item, i) => <div key={item} className="rounded-[22px] p-3" style={i === 0 ? styles.accentSoft : styles.card}><div className="text-[10px] font-black" style={styles.muted}>0{i + 1}</div><div className="mt-3 text-sm font-black">{item}</div><div className="mt-3 h-1.5 rounded-full" style={{ background: i === 0 ? variant.theme.accent : variant.theme.line }} /></div>)}
    </div>
    <div className="mt-auto rounded-[24px] p-4" style={styles.pill}><div className="text-xs font-black">{copy.cta}</div><div className="mt-1 text-[10px]" style={styles.muted}>Agenda, consensi e follow-up ordinati.</div></div>
  </>
);

const HomePlayful = ({ variant, copy, compact, styles }: ScreenRendererArgs) => (
  <>
    <div className={`${compact ? "h-36" : "h-44"} relative rounded-[32px] p-4`} style={styles.accentSoft}>
      <div className="absolute right-5 top-5 h-16 w-16 rounded-full" style={styles.accentBlock} />
      <div className="absolute bottom-5 left-5 h-10 w-24 rounded-full" style={styles.soft} />
      <div className={`relative max-w-[75%] font-black leading-[0.9] ${compact ? "text-[22px]" : "text-[27px]"}`}>{copy.hero}</div>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-2">
      {variant.features.slice(0, 4).map((f, i) => <div key={f} className="rounded-[24px] p-3 text-[11px] font-black" style={i % 2 ? styles.card : styles.accentBlock}>{f}</div>)}
    </div>
    <div className="mt-auto flex items-center justify-between rounded-full p-2" style={styles.pill}><span className="pl-3 text-xs font-black">{copy.cta}</span><InitialBadge variant={variant} styles={styles} /></div>
  </>
);

const HomeTechnical = ({ variant, copy, compact, styles }: ScreenRendererArgs) => (
  <>
    <div className="rounded-[22px] border p-3" style={{ borderColor: variant.theme.accent, background: `${variant.theme.accent}14` }}>
      <div className="flex items-center justify-between"><span className="text-[10px] font-black uppercase tracking-[0.18em]">Dispatch</span><span className="h-2 w-2 rounded-full" style={{ background: variant.theme.accent }} /></div>
      <div className={`mt-3 font-black leading-[0.94] ${compact ? "text-[21px]" : "text-[25px]"}`}>{copy.hero}</div>
    </div>
    <div className="mt-4 space-y-2">
      {variant.features.slice(0, 4).map((f, i) => <div key={f} className="grid grid-cols-[34px_1fr_38px] items-center gap-2 rounded-2xl p-3" style={styles.card}><div className="text-[10px] font-black" style={{ color: variant.theme.accent }}>#{i + 1}</div><div className="text-xs font-black">{f}</div><div className="text-right text-[10px]" style={styles.muted}>{i === 0 ? "SOS" : "OK"}</div></div>)}
    </div>
    <div className="mt-auto rounded-full py-3 text-center text-xs font-black" style={styles.accentBlock}>{copy.cta}</div>
  </>
);

const renderHome = (args: ScreenRendererArgs) => {
  switch (args.variant.layout) {
    case "luxury": return <HomeLuxury {...args} />;
    case "editorial": return <HomeEditorial {...args} />;
    case "commerce": return <HomeCommerce {...args} />;
    case "dashboard": return <HomeDashboard {...args} />;
    case "agenda": return <HomeAgenda {...args} />;
    case "map": return <HomeMap {...args} />;
    case "clinical": return <HomeClinical {...args} />;
    case "playful": return <HomePlayful {...args} />;
    case "technical": return <HomeTechnical {...args} />;
    default: return <HomeEditorial {...args} />;
  }
};

const CatalogScreen = ({ variant, screen, copy, styles }: ScreenRendererArgs) => {
  if (variant.layout === "agenda") {
    return <><div className="mt-4 text-2xl font-black">{screen.label}</div><div className="mt-4 space-y-2">{copy.catalog.map((item, i) => <div key={item} className="flex items-center gap-3 rounded-2xl p-3" style={styles.card}><div className="rounded-xl px-2 py-1 text-[10px] font-black" style={styles.accentBlock}>{`${9 + i}:00`}</div><div><div className="text-sm font-black">{item}</div><div className="text-[10px]" style={styles.muted}>{variant.features[i % variant.features.length]}</div></div></div>)}</div></>;
  }
  if (variant.layout === "map") {
    return <><div className="mt-4 text-2xl font-black">{screen.label}</div><div className="relative mt-4 h-56 rounded-[30px]" style={styles.card}><div className="absolute inset-5 rounded-[24px] border-2 border-dashed" style={{ borderColor: variant.theme.accent }} /><div className="absolute left-9 top-11 rounded-full px-3 py-1 text-[10px] font-black" style={styles.accentBlock}>START</div><div className="absolute bottom-10 right-8 rounded-full px-3 py-1 text-[10px] font-black" style={styles.pill}>VIP</div></div><div className="mt-3 grid grid-cols-2 gap-2">{copy.catalog.slice(0, 4).map((item) => <div key={item} className="rounded-2xl p-3 text-[11px] font-bold" style={styles.pill}>{item}</div>)}</div></>;
  }
  if (variant.layout === "technical" || variant.layout === "dashboard") {
    return <><div className="mt-4 flex items-end justify-between"><div className="text-2xl font-black">{screen.label}</div><div className="text-[10px] font-black" style={{ color: variant.theme.accent }}>LIVE</div></div><div className="mt-4 space-y-2">{copy.catalog.map((item, i) => <div key={item} className="grid grid-cols-[1fr_52px] rounded-2xl p-3" style={styles.card}><div><div className="text-sm font-black">{item}</div><div className="text-[10px]" style={styles.muted}>{variant.features[i % variant.features.length]}</div></div><div className="text-right text-sm font-black" style={{ color: variant.theme.accent }}>{i === 0 ? "87%" : "+"}</div></div>)}</div></>;
  }
  return <><div className="mt-5 flex items-end justify-between"><div className="text-2xl font-black">{screen.label}</div><div className="rounded-full px-3 py-1 text-[10px] font-black" style={styles.pill}>LIVE</div></div><div className="mt-4 grid grid-cols-2 gap-3">{copy.catalog.map((item, i) => <div key={item} className={`${i === 0 ? "row-span-2" : ""} rounded-[22px] p-3`} style={styles.card}><div className="h-16 rounded-2xl" style={i % 2 ? styles.soft : styles.accentBlock} /><div className="mt-3 text-sm font-black leading-tight">{item}</div><div className="mt-1 text-[10px]" style={styles.muted}>{variant.features[i % variant.features.length]}</div></div>)}</div></>;
};

const DetailScreen = ({ variant, screen, copy, styles }: ScreenRendererArgs) => {
  if (variant.layout === "clinical") {
    return <><div className="mt-5 rounded-[26px] p-4" style={styles.card}><div className="flex items-center justify-between"><div><div className="text-[10px] font-black uppercase tracking-[0.18em]" style={styles.muted}>Scheda</div><div className="mt-1 text-2xl font-black leading-none">{copy.detailTitle}</div></div><div className="grid h-12 w-12 place-items-center rounded-2xl text-lg font-black" style={styles.accentBlock}>✓</div></div><div className="mt-5 space-y-2">{["Anamnesi", "Documenti", "Follow-up"].map((item, i) => <div key={item} className="flex items-center justify-between rounded-2xl p-3" style={styles.pill}><span className="text-xs font-black">{item}</span><span className="text-[10px]" style={{ color: variant.theme.accent }}>{i === 0 ? "OK" : "+"}</span></div>)}</div></div><div className="mt-4 text-xs leading-relaxed" style={styles.muted}>{screen.caption}</div></>;
  }
  if (variant.layout === "map") {
    return <><div className="mt-5 rounded-[28px] p-4" style={styles.card}><div className="text-2xl font-black leading-none">{copy.detailTitle}</div><div className="mt-4 h-40 rounded-[24px]" style={{ background: `linear-gradient(145deg, ${variant.theme.surface2}, ${variant.theme.accent}55)` }} /><div className="mt-4 grid grid-cols-2 gap-2">{["Partenza", "Arrivo", "ETA", "Concierge"].map((f, i) => <div key={f} className="rounded-2xl p-2 text-[10px] font-black" style={i === 2 ? styles.accentBlock : styles.pill}>{f}</div>)}</div></div></>;
  }
  return <><div className="mt-6 rounded-[28px] p-4" style={styles.card}><div className="aspect-[1.25] rounded-[24px]" style={styles.gradient} /><div className="mt-4 text-2xl font-black leading-none">{copy.detailTitle}</div><div className="mt-2 text-xs leading-relaxed" style={styles.muted}>{screen.caption}</div><div className="mt-4 grid grid-cols-2 gap-2">{variant.features.slice(0, 4).map((f) => <div key={f} className="rounded-2xl p-2 text-[10px] font-bold" style={styles.pill}>{f}</div>)}</div></div><div className="mt-4 rounded-[22px] p-3" style={styles.pill}><div className="flex items-center justify-between text-xs font-black"><span>Priorità cliente</span><span style={{ color: variant.theme.accent }}>Alta</span></div><div className="mt-2 h-2 rounded-full" style={styles.line}><div className="h-full w-3/4 rounded-full" style={{ background: variant.theme.accent }} /></div></div></>;
};

const BookingScreen = ({ variant, copy, styles }: ScreenRendererArgs) => {
  if (variant.layout === "technical" || variant.layout === "map") {
    return <><div className="mt-5 text-2xl font-black leading-none">{copy.bookingTitle}</div><div className="mt-4 rounded-[28px] p-4" style={styles.card}><div className="grid grid-cols-[1fr_48px] gap-3">{["Cliente", "Squadra", "Pagamento"].map((item, i) => <div key={item} className="contents"><div className="rounded-2xl p-3 text-xs font-black" style={styles.pill}>{item}</div><div className="grid place-items-center rounded-2xl text-[10px] font-black" style={i === 1 ? styles.accentBlock : styles.soft}>{i === 0 ? "OK" : i === 1 ? "GO" : "€"}</div></div>)}</div></div><div className="mt-auto rounded-full py-3 text-center text-xs font-black" style={styles.accentBlock}>Conferma richiesta</div></>;
  }
  if (variant.layout === "playful") {
    return <><div className="mt-5 text-[27px] font-black leading-none">{copy.bookingTitle}</div><div className="mt-4 grid grid-cols-2 gap-3">{["Oggi", "Domani", "Sabato", "Domenica"].map((slot, i) => <div key={slot} className="rounded-[24px] p-4 text-center" style={i === 1 ? styles.accentBlock : styles.card}><div className="text-sm font-black">{slot}</div><div className="mt-2 text-[10px] opacity-70">{i + 1} slot</div></div>)}</div><div className="mt-auto rounded-[28px] p-4" style={styles.pill}><div className="text-xs font-black">{variant.brand}</div><div className="mt-2 rounded-full py-3 text-center text-xs font-black" style={styles.accentBlock}>Invia richiesta</div></div></>;
  }
  return <><div className="mt-6 text-2xl font-black leading-none">{copy.bookingTitle}</div><div className="mt-4 space-y-3">{["Oggi", "Domani", "Weekend"].map((slot, i) => <div key={slot} className="flex items-center justify-between rounded-[22px] p-3" style={i === 1 ? styles.accentBlock : styles.card}><div><div className="text-sm font-black">{slot}</div><div className="text-[10px] opacity-70">{i === 0 ? "2 slot rimasti" : i === 1 ? "Consigliato" : "Lista attesa"}</div></div><div className="rounded-full px-3 py-1 text-[10px] font-black" style={i === 1 ? styles.card : styles.pill}>{i === 0 ? "18:30" : i === 1 ? "12:00" : "VIP"}</div></div>)}</div><div className="mt-auto rounded-[26px] p-4" style={styles.card}><div className="text-xs font-black uppercase tracking-[0.16em]" style={styles.muted}>Riepilogo</div><div className="mt-3 flex items-center justify-between text-sm font-black"><span>{variant.brand}</span><span style={{ color: variant.theme.accent }}>OK</span></div><div className="mt-4 rounded-full py-3 text-center text-xs font-black" style={styles.accentBlock}>Conferma richiesta</div></div></>;
};

export default function LiveMockupScreen({ variant, screen, compact = false }: Props) {
  const t = variant.theme;
  const copy = COPY[variant.sectorId] ?? COPY.food;
  const wrap: CSSProperties = {
    background: t.bg,
    color: t.text,
    fontFamily: variant.layout === "editorial" || variant.layout === "luxury" ? "Georgia, serif" : "Inter, ui-sans-serif, system-ui",
  };
  const overlay: CSSProperties = {
    backgroundImage: texture(variant.layout, t.accent),
    backgroundSize: variant.layout === "technical" || variant.layout === "dashboard" ? "34px 34px" : "100% 100%",
  };
  const styles = buildStyles(variant);

  const tiny = compact;
  const args = { variant, screen, copy, compact: tiny, styles };
  const header = <CompactHeader variant={variant} styles={styles} centered={variant.layout === "luxury" && screen.kind === "home"} />;

  return (
    <div className="relative h-full w-full overflow-hidden" style={wrap}>
      <div className="pointer-events-none absolute inset-0 opacity-80" style={overlay} />
      <div className={`relative flex h-full flex-col ${tiny ? "p-3 pt-7" : "p-5 pt-12"}`}>
        {header}

        {screen.kind === "home" && renderHome(args)}
        {screen.kind === "catalog" && <CatalogScreen {...args} />}
        {screen.kind === "detail" && <DetailScreen {...args} />}
        {screen.kind === "booking" && <BookingScreen {...args} />}
      </div>
    </div>
  );
}