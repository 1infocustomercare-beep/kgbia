import React from "react";
import { cn } from "@/lib/utils";

interface IPhoneMockupProps {
  children: React.ReactNode;
  accentColor?: string;
  className?: string;
  scale?: "sm" | "md" | "lg";
}

/**
 * CSS-only iPhone mockup frame with Dynamic Island, status bar, and home indicator.
 * Displays any content inside a realistic phone frame.
 */
export function IPhoneMockup({ children, accentColor = "#C8963E", className, scale = "md" }: IPhoneMockupProps) {
  const sizes = {
    sm: "w-[140px] h-[285px]",
    md: "w-[200px] h-[408px]",
    lg: "w-[260px] h-[530px]",
  };

  return (
    <div className={cn("relative", sizes[scale], className)}>
      {/* Phone frame */}
      <div
        className="absolute inset-0 rounded-[2rem] border-2 overflow-hidden"
        style={{
          borderColor: `${accentColor}30`,
          background: "linear-gradient(180deg, #0d0d1a 0%, #0a0a12 100%)",
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${accentColor}08, inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 pt-2 pb-1 relative z-10">
          <span className="text-[7px] text-white/40 font-bold">9:41</span>
          {/* Dynamic Island */}
          <div className="w-16 h-4 rounded-full bg-black border border-white/10" />
          <div className="flex items-center gap-1">
            <div className="w-3 h-2 border border-white/30 rounded-[1px]">
              <div className="w-1.5 h-1 bg-white/40 rounded-[0.5px] ml-auto mr-px mt-px" />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="absolute inset-x-0 top-7 bottom-4 overflow-hidden rounded-b-[1.8rem]">
          {children}
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[35%] h-1 rounded-full bg-white/20" />
      </div>
    </div>
  );
}

/* ── Helper: small row item ── */
const Row = ({ label, sub, accent, icon }: { label: string; sub: string; accent: string; icon?: string }) => (
  <div className="flex items-center gap-2 p-2 rounded-xl" style={{ background: `${accent}08`, border: `1px solid ${accent}15` }}>
    {icon && <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: `${accent}20` }}>{icon}</div>}
    <div className="flex-1 min-w-0">
      <p className="text-[7px] font-bold text-white/80 truncate">{label}</p>
      <p className="text-[6px] text-white/30">{sub}</p>
    </div>
    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px]" style={{ background: accent, color: "white" }}>+</div>
  </div>
);

const Header = ({ emoji, title, accent }: { emoji: string; title: string; accent: string }) => (
  <div className="text-center py-2">
    <span className="text-lg">{emoji}</span>
    <p className="text-[8px] font-bold text-white mt-1">{title}</p>
  </div>
);

const KpiMini = ({ items, accent }: { items: { l: string; v: string }[]; accent: string }) => (
  <div className="grid grid-cols-2 gap-1.5">
    {items.map(k => (
      <div key={k.l} className="p-2 rounded-lg text-center" style={{ background: `${accent}08`, border: `1px solid ${accent}10` }}>
        <p className="text-[8px] font-bold text-white/70">{k.v}</p>
        <p className="text-[5px] text-white/30">{k.l}</p>
      </div>
    ))}
  </div>
);

const MiniChart = ({ accent }: { accent: string }) => (
  <div className="p-2 rounded-lg" style={{ background: `${accent}05` }}>
    <div className="flex items-end gap-0.5 h-6">
      {[4, 6, 5, 8, 7, 9, 8, 10].map((h, i) => (
        <div key={i} className="flex-1 rounded-sm" style={{ height: `${h * 10}%`, background: i >= 6 ? accent : `${accent}30` }} />
      ))}
    </div>
  </div>
);

/**
 * Pre-built iPhone mockup content for ALL 25 sector types
 * Each has unique colors, layout, and realistic content
 */
export function SectorPhoneContent({ sector, accentColor = "#C8963E" }: { sector: string; accentColor?: string }) {
  const a = accentColor;
  const bg = "#0d0d1a";

  const contents: Record<string, React.ReactNode> = {
    /* ═══ FOOD ═══ rosso/oro — menu con foto piatti */
    food: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="🍽️" title="Menu Digitale" accent="#e85d04" />
        {[
          { l: "Carbonara Classica", s: "€14 · Primi", i: "🍝" },
          { l: "Pizza Margherita DOP", s: "€12 · Pizze", i: "🍕" },
          { l: "Tiramisù Artigianale", s: "€7 · Dolci", i: "🍰" },
        ].map((r, i) => <Row key={i} label={r.l} sub={r.s} accent="#e85d04" icon={r.i} />)}
        <div className="text-center"><p className="text-[6px] text-white/20">Scorri per altri piatti ↓</p></div>
      </div>
    ),

    /* ═══ BEAUTY ═══ rosa/gold — lista trattamenti */
    beauty: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="💅" title="Prenota Trattamento" accent="#ec4899" />
        {[
          { l: "Taglio + Colore", s: "€85 · 60 min" },
          { l: "Manicure Spa", s: "€35 · 45 min" },
          { l: "Trattamento Viso", s: "€120 · 90 min" },
        ].map((r, i) => (
          <div key={i} className="p-2 rounded-xl" style={{ background: "#ec489908", border: "1px solid #ec489915" }}>
            <p className="text-[7px] font-bold text-white/80">{r.l}</p>
            <p className="text-[6px] text-white/30">{r.s}</p>
          </div>
        ))}
        <div className="w-full py-1.5 rounded-lg text-center text-[7px] font-bold text-white" style={{ background: "#ec4899" }}>Prenota Ora</div>
      </div>
    ),

    /* ═══ NCC ═══ nero/argento — booking transfer */
    ncc: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="🚘" title="Prenota Transfer" accent="#D4A017" />
        <div className="p-2 rounded-xl space-y-1.5" style={{ background: "#D4A01708", border: "1px solid #D4A01715" }}>
          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /><p className="text-[6px] text-white/50">Partenza</p></div>
          <p className="text-[7px] font-bold text-white/80 pl-2.5">Aeroporto Napoli</p>
          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-400" /><p className="text-[6px] text-white/50">Arrivo</p></div>
          <p className="text-[7px] font-bold text-white/80 pl-2.5">Positano</p>
        </div>
        <div className="flex gap-1.5">
          {["Sedan", "SUV", "Van"].map(v => (
            <div key={v} className="flex-1 p-1.5 rounded-lg text-center" style={{ background: "#D4A01708", border: "1px solid #D4A01715" }}>
              <p className="text-[6px] font-bold text-white/60">{v}</p>
            </div>
          ))}
        </div>
      </div>
    ),

    /* ═══ HEALTHCARE ═══ azzurro/bianco — appuntamenti */
    healthcare: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="🏥" title="Agenda Medica" accent="#14b8a6" />
        {[
          { l: "Dr. Bianchi — Cardiologia", s: "Oggi 15:00 · ECG", i: "❤️" },
          { l: "Dr.ssa Verdi — Dermatologia", s: "Domani 10:00", i: "🩺" },
          { l: "Dr. Rossi — Ortopedia", s: "22/03 · Controllo", i: "🦴" },
        ].map((r, i) => <Row key={i} label={r.l} sub={r.s} accent="#14b8a6" icon={r.i} />)}
      </div>
    ),

    /* ═══ FITNESS ═══ nero/arancio — schedule lezioni */
    fitness: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="💪" title="Lezioni Oggi" accent="#f97316" />
        {[
          { l: "CrossFit — Luca T.", s: "09:00 · 18/20 posti", i: "🏋️" },
          { l: "Yoga Flow — Anna M.", s: "10:30 · 12/15 posti", i: "🧘" },
          { l: "Spinning — Marco P.", s: "12:00 · 8/20 posti", i: "🚴" },
        ].map((r, i) => <Row key={i} label={r.l} sub={r.s} accent="#f97316" icon={r.i} />)}
      </div>
    ),

    /* ═══ HOTEL / HOSPITALITY ═══ blu/oro — camere */
    hospitality: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="🏨" title="Gestione Camere" accent="#f59e0b" />
        <KpiMini items={[{ l: "Occupazione", v: "82%" }, { l: "Check-in", v: "14" }, { l: "ADR", v: "€185" }, { l: "Rating", v: "4.6" }]} accent="#f59e0b" />
        <div className="p-2 rounded-xl" style={{ background: "#f59e0b08", border: "1px solid #f59e0b15" }}>
          <p className="text-[7px] font-bold text-white/80">Suite 201 — J. Smith</p>
          <p className="text-[6px] text-white/30">Check-in oggi · 5 notti · €1.250</p>
        </div>
      </div>
    ),
    hotel: undefined, // alias below

    /* ═══ RETAIL ═══ bianco/viola — catalogo */
    retail: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="🛍️" title="Catalogo Prodotti" accent="#8b5cf6" />
        {[
          { l: "Giacca Lino Premium", s: "€189 · 12 in stock", i: "👔" },
          { l: "Borsa Pelle Italiana", s: "€245 · 4 in stock", i: "👜" },
          { l: "Scarpe Artigianali", s: "€178 · 8 in stock", i: "👞" },
        ].map((r, i) => <Row key={i} label={r.l} sub={r.s} accent="#8b5cf6" icon={r.i} />)}
      </div>
    ),

    /* ═══ BEACH ═══ azzurro/sabbia — prenotazione ombrelloni */
    beach: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="🏖️" title="Prenota Spiaggia" accent="#06b6d4" />
        <KpiMini items={[{ l: "Occupati", v: "142/180" }, { l: "Revenue", v: "€5.2k" }]} accent="#06b6d4" />
        {[
          { l: "Ombrellone + 2 Lettini", s: "€45/giorno · Fila A", i: "⛱️" },
          { l: "Gazebo VIP", s: "€120/giorno · Fila D", i: "🛖" },
        ].map((r, i) => <Row key={i} label={r.l} sub={r.s} accent="#06b6d4" icon={r.i} />)}
      </div>
    ),

    /* ═══ BAKERY ═══ marrone/crema — ordini prodotti */
    bakery: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="🥐" title="Ordini & Preordini" accent="#d97706" />
        {[
          { l: "Cornetti Classici x50", s: "€95 · B2B · Domani 05:00", i: "🥐" },
          { l: "Torta Compleanno", s: "€85 · Su misura", i: "🎂" },
          { l: "Pane Integrale x3", s: "€12 · Banco", i: "🍞" },
        ].map((r, i) => <Row key={i} label={r.l} sub={r.s} accent="#d97706" icon={r.i} />)}
      </div>
    ),

    /* ═══ PLUMBER ═══ blu/grigio — interventi */
    plumber: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="🔧" title="Interventi Oggi" accent="#3b82f6" />
        <KpiMini items={[{ l: "Oggi", v: "8" }, { l: "Revenue", v: "€2.8k" }, { l: "Preventivi", v: "14" }, { l: "T. Medio", v: "95min" }]} accent="#3b82f6" />
        <Row label="Perdita tubo bagno" sub="Roma Nord · €180 · In corso" accent="#3b82f6" icon="🔧" />
      </div>
    ),

    /* ═══ ELECTRICIAN ═══ giallo/nero — lavori */
    electrician: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="⚡" title="Lavori in Corso" accent="#eab308" />
        {[
          { l: "Quadro Elettrico — Bianchi", s: "€450 · Completato", i: "⚡" },
          { l: "Fotovoltaico — Verdi", s: "€8.5k · Sopralluogo", i: "☀️" },
          { l: "Domotica — Villa Rossi", s: "€12k · In corso", i: "🏠" },
        ].map((r, i) => <Row key={i} label={r.l} sub={r.s} accent="#eab308" icon={r.i} />)}
      </div>
    ),

    /* ═══ AGRITURISMO ═══ verde/terra — ospiti e degustazioni */
    agriturismo: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="🌿" title="Agriturismo" accent="#65a30d" />
        <KpiMini items={[{ l: "Ospiti", v: "34" }, { l: "Camere", v: "12/16" }, { l: "Revenue", v: "€2.7k" }, { l: "Degustat.", v: "8" }]} accent="#65a30d" />
        <Row label="Camera Ulivo — Fam. Bianchi" sub="3 notti · €420" accent="#65a30d" icon="🫒" />
      </div>
    ),

    /* ═══ CLEANING ═══ verde acqua — interventi pulizia */
    cleaning: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="🧹" title="Interventi" accent="#10b981" />
        {[
          { l: "Ufficio Tech Srl", s: "Pulizia ordinaria · €120", i: "🏢" },
          { l: "Cond. Via Roma", s: "Scale + Androni · €180", i: "🏠" },
          { l: "Rest. Da Mario", s: "Sanificazione · €250", i: "🍽️" },
        ].map((r, i) => <Row key={i} label={r.l} sub={r.s} accent="#10b981" icon={r.i} />)}
      </div>
    ),

    /* ═══ LEGAL ═══ bordeaux/oro — pratiche */
    legal: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="⚖️" title="Studio Legale" accent="#a855f7" />
        <KpiMini items={[{ l: "Pratiche", v: "42" }, { l: "Consulenze", v: "6" }, { l: "Revenue", v: "€28.5k" }, { l: "Clienti", v: "128" }]} accent="#a855f7" />
        <Row label="Rossi Srl — Contenzioso" sub="€8.500 · In corso" accent="#a855f7" icon="📋" />
      </div>
    ),

    /* ═══ ACCOUNTANT ═══ verde scuro — scadenzario */
    accountant: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="📊" title="Commercialista" accent="#059669" />
        {[
          { l: "Bilancio 2025 — Rossi Sas", s: "Scad. 30/04 · €2.800", i: "📑" },
          { l: "730 — Dr. Bianchi", s: "Scad. 30/09 · €180", i: "📝" },
          { l: "IVA Trim. — Tech Srl", s: "Scad. 16/03 · Inviato", i: "✅" },
        ].map((r, i) => <Row key={i} label={r.l} sub={r.s} accent="#059669" icon={r.i} />)}
      </div>
    ),

    /* ═══ GARAGE ═══ rosso/grigio — veicoli */
    garage: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="🔩" title="Officina" accent="#dc2626" />
        {[
          { l: "Audi A4 — Tagliando", s: "€480 · In lavorazione", i: "🚗" },
          { l: "Fiat 500 — Revisione", s: "€320 · Pronta", i: "🚙" },
          { l: "BMW X3 — Cambio Olio", s: "€280 · Domani", i: "🏎️" },
        ].map((r, i) => <Row key={i} label={r.l} sub={r.s} accent="#dc2626" icon={r.i} />)}
      </div>
    ),

    /* ═══ PHOTOGRAPHER ═══ grigio/gold — shooting */
    photographer: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="📸" title="Shooting" accent="#a3a3a3" />
        {[
          { l: "Matrimonio — Villa Aurelia", s: "€2.800 · Consegnato", i: "💒" },
          { l: "Corporate — Tech Srl", s: "€800 · 22/03", i: "🏢" },
          { l: "Newborn — Baby Emma", s: "€250 · Studio", i: "👶" },
        ].map((r, i) => <Row key={i} label={r.l} sub={r.s} accent="#a3a3a3" icon={r.i} />)}
      </div>
    ),

    /* ═══ CONSTRUCTION ═══ arancio/grigio — cantieri */
    construction: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="🏗️" title="Cantieri" accent="#ea580c" />
        <KpiMini items={[{ l: "Attivi", v: "6" }, { l: "Revenue", v: "€85k" }, { l: "Preventivi", v: "14" }, { l: "Operai", v: "28" }]} accent="#ea580c" />
        <div className="p-2 rounded-xl" style={{ background: "#ea580c08", border: "1px solid #ea580c15" }}>
          <div className="flex justify-between mb-1"><p className="text-[7px] font-bold text-white/80">Fam. Rossi — Ristrutturaz.</p><p className="text-[6px] text-white/50">72%</p></div>
          <div className="w-full h-1.5 rounded-full" style={{ background: "#ea580c20" }}>
            <div className="h-full rounded-full" style={{ width: "72%", background: "#ea580c" }} />
          </div>
        </div>
      </div>
    ),

    /* ═══ GARDENER ═══ verde chiaro — manutenzioni */
    gardener: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="🌱" title="Giardinaggio" accent="#22c55e" />
        {[
          { l: "Villa Rossi — Manutenzione", s: "€180 · Completato", i: "🌳" },
          { l: "Cond. Via Roma — Potatura", s: "€320 · Domani", i: "✂️" },
          { l: "Fam. Bianchi — Prato", s: "€2.400 · In corso", i: "🌿" },
        ].map((r, i) => <Row key={i} label={r.l} sub={r.s} accent="#22c55e" icon={r.i} />)}
      </div>
    ),

    /* ═══ VETERINARY ═══ azzurro/bianco — visite */
    veterinary: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="🐾" title="Clinica Veterinaria" accent="#0ea5e9" />
        {[
          { l: "Luna (Golden) — Vaccino", s: "€45 · Completato", i: "🐕" },
          { l: "Micio (Persiano) — Sterilizz.", s: "€180 · In corso", i: "🐈" },
          { l: "Rex (Pastore) — Ortopedia", s: "€320 · Ore 15:00", i: "🦮" },
        ].map((r, i) => <Row key={i} label={r.l} sub={r.s} accent="#0ea5e9" icon={r.i} />)}
      </div>
    ),

    /* ═══ TATTOO ═══ nero/rosso — sessioni */
    tattoo: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="🎨" title="Tattoo Studio" accent="#ef4444" />
        {[
          { l: "Sleeve braccio — Marco R.", s: "€800 · Sessione 3/5", i: "💉" },
          { l: "Minimal polso — Sara B.", s: "€120 · Ore 14:30", i: "✨" },
          { l: "Cover-up schiena — Davide", s: "€600 · Ore 16:00", i: "🎭" },
        ].map((r, i) => <Row key={i} label={r.l} sub={r.s} accent="#ef4444" icon={r.i} />)}
      </div>
    ),

    /* ═══ CHILDCARE ═══ celeste/rosa — bambini */
    childcare: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="👶" title="Asilo Nido" accent="#f472b6" />
        <KpiMini items={[{ l: "Presenti", v: "32/40" }, { l: "Educatrici", v: "6" }, { l: "Rette", v: "€19.2k" }, { l: "Rating", v: "4.9" }]} accent="#f472b6" />
        <Row label="Sofia R. — Sez. Farfalle" sub="08:00-16:00 · Presente" accent="#f472b6" icon="🦋" />
      </div>
    ),

    /* ═══ EDUCATION ═══ indaco — corsi e studenti */
    education: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="🎓" title="Corsi & Formazione" accent="#6366f1" />
        {[
          { l: "Full Stack Dev — React", s: "248 iscritti · 85%", i: "💻" },
          { l: "Data Science — ML", s: "186 iscritti · 92%", i: "📊" },
          { l: "UX Design — Figma", s: "124 iscritti · 60%", i: "🎨" },
        ].map((r, i) => <Row key={i} label={r.l} sub={r.s} accent="#6366f1" icon={r.i} />)}
      </div>
    ),

    /* ═══ EVENTS ═══ fucsia/oro — eventi */
    events: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="🎉" title="Gestione Eventi" accent="#d946ef" />
        {[
          { l: "Gala Aziendale — Rossi Corp", s: "28/03 · €18k · In preparaz.", i: "🎪" },
          { l: "Matrimonio — Bianchi & Neri", s: "12/04 · €32k · Confermato", i: "💒" },
          { l: "Team Building — Tech Srl", s: "05/04 · €4.5k · Preventivo", i: "🤝" },
        ].map((r, i) => <Row key={i} label={r.l} sub={r.s} accent="#d946ef" icon={r.i} />)}
      </div>
    ),

    /* ═══ LOGISTICS ═══ blu scuro/verde — spedizioni */
    logistics: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="🚛" title="Spedizioni" accent="#0284c7" />
        <KpiMini items={[{ l: "Oggi", v: "42" }, { l: "Revenue", v: "€8.7k" }, { l: "Puntuali", v: "94%" }, { l: "Mezzi", v: "12/15" }]} accent="#0284c7" />
        <Row label="Milano → Roma — Tech Srl" sub="Furgone #3 · €180 · Consegnato" accent="#0284c7" icon="📦" />
      </div>
    ),

    /* ═══ LUXURY ═══ oro/nero */
    luxury: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="💎" title="Luxury Concierge" accent="#C8963E" />
        <KpiMini items={[{ l: "Clienti VIP", v: "42" }, { l: "Revenue", v: "€128k" }, { l: "Rating", v: "5.0" }, { l: "Referral", v: "89%" }]} accent="#C8963E" />
        <MiniChart accent="#C8963E" />
      </div>
    ),

    /* ═══ CUSTOM ═══ fallback generico */
    custom: (
      <div className="h-full p-3 space-y-2" style={{ background: bg }}>
        <Header emoji="⚡" title="Dashboard" accent={a} />
        <KpiMini items={[{ l: "Clienti", v: "186" }, { l: "Ordini", v: "42" }, { l: "Revenue", v: "€24k" }, { l: "Rating", v: "4.8" }]} accent={a} />
        <MiniChart accent={a} />
      </div>
    ),
  };

  // hotel = hospitality alias
  contents.hotel = contents.hospitality;

  return <>{contents[sector] || contents.custom}</>;
}