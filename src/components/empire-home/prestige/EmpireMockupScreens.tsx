import { ReactNode } from "react";
import {
  Home,
  Calendar,
  ShoppingBag,
  MessageCircle,
  Sparkles,
  Flame,
  Dumbbell,
  Building2,
  Star,
  Wifi,
  Signal,
  BatteryFull,
  Send,
  Bell,
  User,
  TrendingUp,
  Check,
  CheckCheck,
  MapPin,
  Clock,
} from "lucide-react";
import type { PhoneView } from "./PrestigePhone";

/**
 * Empire native iPhone screens — Emerald Prestige design system.
 * Palette: emerald #04130E→#0A2A1E · gold #D4AF37 / #E8D9A0 · ivory #F5F1E6.
 * No emojis. Only lucide SVG icons. iOS status bar + bottom tabbar on every screen.
 */

export type EmpireSector = "restaurant" | "beauty" | "fitness" | "realestate";

interface SectorMeta {
  brand: string;
  monogram: string;
  tagline: string;
  heroIcon: typeof Flame;
  primaryCta: string;
  services: string[];
  reviews: number;
  reviewsCount: number;
  catalog: { name: string; sub: string; price: string }[];
  cartLabel: string;
  cartCta: string;
  kpis: { label: string; value: string; trend: string }[];
  chart: number[];
  liveList: { primary: string; secondary: string; meta: string }[];
  chat: { from: "in" | "out"; text: string; time: string }[];
  quickReplies: string[];
  tab: { label: string; icon: typeof Home }[];
}

const SECTORS: Record<EmpireSector, SectorMeta> = {
  restaurant: {
    brand: "Forno Verde",
    monogram: "FV",
    tagline: "Pizzeria contemporanea · Milano",
    heroIcon: Flame,
    primaryCta: "Ordina ora",
    services: ["Asporto", "Delivery", "Tavolo"],
    reviews: 4.9,
    reviewsCount: 1284,
    catalog: [
      { name: "Margherita Verace", sub: "Pomodoro DOP · Fior di latte", price: "€ 9,50" },
      { name: "Tartufo Nero", sub: "Crema tartufo · Mozzarella di bufala", price: "€ 16,00" },
      { name: "Salsiccia & Friarielli", sub: "Salsiccia napoletana · Friarielli", price: "€ 12,50" },
      { name: "Diavola d'Autore", sub: "Salame piccante calabrese", price: "€ 11,00" },
    ],
    cartLabel: "3 articoli · 32 min",
    cartCta: "Vai al carrello · € 38,50",
    kpis: [
      { label: "Incassi oggi", value: "€ 2.847", trend: "+12%" },
      { label: "Coperti", value: "84", trend: "+8" },
      { label: "Occupazione", value: "92%", trend: "+4%" },
    ],
    chart: [40, 55, 48, 70, 62, 88, 95],
    liveList: [
      { primary: "Tavolo 12 · 4 pax", secondary: "Margherita ×2 · Diavola ×1", meta: "20:45" },
      { primary: "Asporto · Rossi M.", secondary: "Tartufo Nero · Acqua 1L", meta: "20:38" },
      { primary: "Delivery · Via Tortona 9", secondary: "3 pizze · Tiramisù", meta: "20:31" },
    ],
    chat: [
      { from: "in", text: "Buonasera, avete un tavolo per 4 alle 21?", time: "20:14" },
      { from: "out", text: "Buonasera Marta! Sì, ho disponibilità in sala interna alle 21:00. Confermo?", time: "20:14" },
      { from: "in", text: "Perfetto, confermo. Possiamo avere un seggiolone?", time: "20:15" },
      { from: "out", text: "Annotato. Prenotazione confermata per Marta · 4 pax · 21:00 · seggiolone. A stasera.", time: "20:15" },
    ],
    quickReplies: ["Prenota", "Vedi menu", "Asporto"],
    tab: [
      { label: "Home", icon: Home },
      { label: "Menu", icon: ShoppingBag },
      { label: "Prenota", icon: Calendar },
      { label: "Chat", icon: MessageCircle },
    ],
  },
  beauty: {
    brand: "Aurea Spa",
    monogram: "AS",
    tagline: "Beauty & Wellness · Roma",
    heroIcon: Sparkles,
    primaryCta: "Prenota",
    services: ["Viso", "Corpo", "Mani"],
    reviews: 4.9,
    reviewsCount: 962,
    catalog: [
      { name: "Rituale Oro 24K", sub: "90 min · Anti-età viso", price: "€ 180" },
      { name: "Massaggio Mediterraneo", sub: "60 min · Olio di argan", price: "€ 95" },
      { name: "Manicure Couture", sub: "Smalto semipermanente", price: "€ 45" },
      { name: "Hammam Reale", sub: "Percorso 75 min", price: "€ 120" },
    ],
    cartLabel: "Sabato 14 giugno · 16:30",
    cartCta: "Conferma · € 180",
    kpis: [
      { label: "Incassi oggi", value: "€ 1.640", trend: "+9%" },
      { label: "Appuntamenti", value: "27", trend: "+5" },
      { label: "Occupazione", value: "88%", trend: "+6%" },
    ],
    chart: [30, 48, 60, 55, 72, 80, 78],
    liveList: [
      { primary: "Sofia M. · Rituale Oro", secondary: "Operatrice: Chiara", meta: "16:30" },
      { primary: "Elena B. · Massaggio", secondary: "Operatrice: Sara", meta: "17:00" },
      { primary: "Giulia R. · Manicure", secondary: "Operatrice: Anna", meta: "17:15" },
    ],
    chat: [
      { from: "in", text: "Ciao, vorrei un massaggio per sabato pomeriggio.", time: "11:02" },
      { from: "out", text: "Ciao Sofia! Sabato ho 15:00 con Sara o 17:30 con Chiara. Quale preferisci?", time: "11:02" },
      { from: "in", text: "17:30 con Chiara, perfetto.", time: "11:03" },
      { from: "out", text: "Confermo: Sabato 14 · 17:30 · Massaggio Mediterraneo con Chiara. Ti aspettiamo.", time: "11:03" },
    ],
    quickReplies: ["Prenota", "Listino", "Regalo"],
    tab: [
      { label: "Home", icon: Home },
      { label: "Servizi", icon: Sparkles },
      { label: "Agenda", icon: Calendar },
      { label: "Chat", icon: MessageCircle },
    ],
  },
  fitness: {
    brand: "Vertex Club",
    monogram: "VC",
    tagline: "Performance Studio · Torino",
    heroIcon: Dumbbell,
    primaryCta: "Prenota lezione",
    services: ["PT", "Classi", "Functional"],
    reviews: 4.8,
    reviewsCount: 547,
    catalog: [
      { name: "Personal Training", sub: "Sessione 60 min · 1-on-1", price: "€ 70" },
      { name: "HIIT Performance", sub: "Classe 45 min · Coach Luca", price: "€ 22" },
      { name: "Yoga Flow", sub: "Classe 75 min · Sala dorata", price: "€ 25" },
      { name: "Abbonamento Élite", sub: "Mensile illimitato", price: "€ 189" },
    ],
    cartLabel: "Mar 18:00 · Sala A",
    cartCta: "Conferma · € 22",
    kpis: [
      { label: "Incassi mese", value: "€ 18.420", trend: "+14%" },
      { label: "Iscritti attivi", value: "312", trend: "+11" },
      { label: "Occupazione", value: "84%", trend: "+7%" },
    ],
    chart: [50, 62, 70, 65, 80, 88, 92],
    liveList: [
      { primary: "HIIT · Coach Luca", secondary: "18 / 20 posti", meta: "18:00" },
      { primary: "PT · Andrea V.", secondary: "Sala Pesi B", meta: "19:00" },
      { primary: "Yoga Flow · Coach Emma", secondary: "12 / 15 posti", meta: "20:00" },
    ],
    chat: [
      { from: "in", text: "Posso prenotare HIIT di martedì sera?", time: "09:21" },
      { from: "out", text: "Ciao Marco! Martedì 18:00 con Luca: liberi 2 posti. Te lo blocco?", time: "09:21" },
      { from: "in", text: "Sì, prenota.", time: "09:22" },
      { from: "out", text: "Confermato: Mar 11 · 18:00 · HIIT con Luca · Sala A. Buon allenamento.", time: "09:22" },
    ],
    quickReplies: ["Prenota classe", "Listino", "PT"],
    tab: [
      { label: "Home", icon: Home },
      { label: "Classi", icon: Dumbbell },
      { label: "Prenota", icon: Calendar },
      { label: "Chat", icon: MessageCircle },
    ],
  },
  realestate: {
    brand: "Dimore Smeraldo",
    monogram: "DS",
    tagline: "Real Estate Luxury · Costa Smeralda",
    heroIcon: Building2,
    primaryCta: "Richiedi visita",
    services: ["Vendita", "Affitto", "Investment"],
    reviews: 5.0,
    reviewsCount: 218,
    catalog: [
      { name: "Villa Mirto", sub: "Porto Cervo · 6 camere · vista mare", price: "€ 4.8M" },
      { name: "Attico Smeraldo", sub: "Olbia · 280 m² · terrazza 90 m²", price: "€ 1.2M" },
      { name: "Casale Storico", sub: "Arzachena · uliveto 2 ha", price: "€ 2.4M" },
      { name: "Penthouse Marina", sub: "Cannigione · darsena privata", price: "€ 3.1M" },
    ],
    cartLabel: "Visita · Sab 14 · 11:00",
    cartCta: "Conferma appuntamento",
    kpis: [
      { label: "Mandati attivi", value: "47", trend: "+6" },
      { label: "Visite settimana", value: "32", trend: "+9" },
      { label: "Conversione", value: "21%", trend: "+3%" },
    ],
    chart: [35, 42, 50, 58, 64, 72, 78],
    liveList: [
      { primary: "Famiglia Rossi · Villa Mirto", secondary: "Visita confermata", meta: "Sab 11:00" },
      { primary: "Mr. Brown · Attico Smeraldo", secondary: "Offerta in valutazione", meta: "Ven 18:00" },
      { primary: "Studio Bianchi · Casale", secondary: "Documenti notaio", meta: "Lun 09:30" },
    ],
    chat: [
      { from: "in", text: "Buongiorno, vorrei informazioni su Villa Mirto.", time: "10:08" },
      { from: "out", text: "Buongiorno Sig. Rossi. Villa Mirto è disponibile per visita sabato alle 11:00 o domenica alle 16:00. Quale preferisce?", time: "10:08" },
      { from: "in", text: "Sabato 11:00, perfetto.", time: "10:09" },
      { from: "out", text: "Confermato. Le invio scheda tecnica e indicazioni per Porto Cervo. A sabato.", time: "10:09" },
    ],
    quickReplies: ["Visita", "Scheda", "Valutazione"],
    tab: [
      { label: "Home", icon: Home },
      { label: "Immobili", icon: Building2 },
      { label: "Agenda", icon: Calendar },
      { label: "Chat", icon: MessageCircle },
    ],
  },
};

/* ─────────── Shared chrome ─────────── */

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-4 pt-2 pb-1 text-[9px] font-semibold" style={{ color: "#F5F1E6" }}>
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <Signal size={9} />
        <Wifi size={9} />
        <BatteryFull size={11} />
      </div>
    </div>
  );
}

function TabBar({ items }: { items: SectorMeta["tab"] }) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 flex items-center justify-around px-2 pt-1.5 pb-3"
      style={{
        background: "linear-gradient(180deg, rgba(4,19,14,0.6) 0%, rgba(4,19,14,0.95) 60%)",
        borderTop: "1px solid rgba(212,175,55,0.18)",
        backdropFilter: "blur(10px)",
      }}
    >
      {items.map((t, i) => {
        const Icon = t.icon;
        const active = i === 0;
        return (
          <div key={t.label} className="flex flex-col items-center gap-0.5">
            <Icon size={13} color={active ? "#D4AF37" : "#7E8B86"} />
            <span
              className="text-[7px] uppercase tracking-wider"
              style={{ color: active ? "#E8D9A0" : "#7E8B86", letterSpacing: "0.06em" }}
            >
              {t.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Header({ s }: { s: SectorMeta }) {
  return (
    <div className="flex items-center gap-2 px-4 pt-1 pb-2">
      <div
        className="flex h-6 w-6 items-center justify-center rounded-full text-[8px] font-bold"
        style={{
          background: "radial-gradient(circle at 30% 30%, #E8D9A0, #D4AF37 60%, #8a6e1f)",
          color: "#04130E",
          boxShadow: "0 0 0 1px rgba(212,175,55,0.4), 0 2px 6px rgba(0,0,0,0.4)",
        }}
      >
        {s.monogram}
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-semibold" style={{ color: "#F5F1E6", fontFamily: "'Fraunces', Georgia, serif" }}>
          {s.brand}
        </span>
        <span className="flex items-center gap-1 text-[7px] uppercase tracking-[0.12em]" style={{ color: "#9FB0A8" }}>
          <span
            className="inline-block h-1 w-1 rounded-full"
            style={{ background: "#4ADE80", boxShadow: "0 0 4px #4ADE80", animation: "pulse 1.8s ease-in-out infinite" }}
          />
          Empire AI · Live
        </span>
      </div>
      <div className="ml-auto">
        <Bell size={11} color="#9FB0A8" />
      </div>
    </div>
  );
}

function ScreenShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #04130E 0%, #07211A 45%, #0A2A1E 100%)",
        color: "#F5F1E6",
      }}
    >
      <StatusBar />
      {children}
    </div>
  );
}

/* ─────────── Views ─────────── */

function HomeView({ s }: { s: SectorMeta }) {
  const HeroIcon = s.heroIcon;
  return (
    <ScreenShell>
      <Header s={s} />
      {/* Hero */}
      <div
        className="relative mx-3 overflow-hidden rounded-xl"
        style={{
          height: "44%",
          background:
            "linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(10,42,30,0.9) 60%), radial-gradient(circle at 70% 30%, rgba(232,217,160,0.3), transparent 60%)",
          border: "1px solid rgba(212,175,55,0.28)",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
          <HeroIcon size={32} color="#E8D9A0" strokeWidth={1.4} />
          <div
            className="mt-1.5 text-[14px] leading-tight"
            style={{ fontFamily: "'Fraunces', Georgia, serif", color: "#F5F1E6", fontWeight: 600 }}
          >
            {s.brand}
          </div>
          <div
            className="mx-auto mt-1 h-px"
            style={{ width: 28, background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }}
          />
          <div className="mt-1 text-[7px] uppercase tracking-[0.18em]" style={{ color: "#E8D9A0" }}>
            {s.tagline}
          </div>
          <button
            className="mt-2 rounded-full px-3 py-1 text-[8px] font-semibold uppercase tracking-wider"
            style={{
              background: "linear-gradient(90deg, #D4AF37, #E8D9A0)",
              color: "#04130E",
              boxShadow: "0 4px 12px rgba(212,175,55,0.35)",
            }}
          >
            {s.primaryCta}
          </button>
        </div>
      </div>
      {/* Services */}
      <div className="mx-3 mt-2 flex gap-1.5">
        {s.services.map((sv) => (
          <div
            key={sv}
            className="flex-1 rounded-md py-1 text-center text-[7px] uppercase tracking-wider"
            style={{
              background: "rgba(10,42,30,0.7)",
              border: "1px solid rgba(212,175,55,0.22)",
              color: "#E8D9A0",
            }}
          >
            {sv}
          </div>
        ))}
      </div>
      {/* Reviews */}
      <div
        className="mx-3 mt-2 flex items-center gap-2 rounded-md px-2 py-1.5"
        style={{ background: "rgba(4,19,14,0.6)", border: "1px solid rgba(212,175,55,0.18)" }}
      >
        <div className="flex">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={9} color="#D4AF37" fill="#D4AF37" />
          ))}
        </div>
        <span className="text-[9px] font-semibold" style={{ color: "#F5F1E6" }}>
          {s.reviews.toFixed(1)}/5
        </span>
        <span className="text-[7px] uppercase tracking-wider" style={{ color: "#9FB0A8" }}>
          {s.reviewsCount} recensioni
        </span>
      </div>
      <TabBar items={s.tab} />
    </ScreenShell>
  );
}

function AppView({ s }: { s: SectorMeta }) {
  return (
    <ScreenShell>
      <Header s={s} />
      <div className="px-3 pb-2 text-[9px] uppercase tracking-[0.16em]" style={{ color: "#E8D9A0" }}>
        Catalogo
      </div>
      <div className="space-y-1.5 px-3" style={{ maxHeight: "62%", overflow: "hidden" }}>
        {s.catalog.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-2 rounded-lg p-1.5"
            style={{
              background: "rgba(10,42,30,0.75)",
              border: "1px solid rgba(212,175,55,0.18)",
            }}
          >
            <div
              className="h-8 w-8 shrink-0 rounded-md"
              style={{
                background:
                  "linear-gradient(135deg, rgba(212,175,55,0.35), rgba(10,42,30,0.9))",
                border: "1px solid rgba(212,175,55,0.3)",
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[9px] font-semibold" style={{ color: "#F5F1E6" }}>
                {p.name}
              </div>
              <div className="truncate text-[7px]" style={{ color: "#9FB0A8" }}>
                {p.sub}
              </div>
            </div>
            <div className="text-[9px] font-semibold" style={{ color: "#E8D9A0" }}>
              {p.price}
            </div>
          </div>
        ))}
      </div>
      {/* Cart bar */}
      <div
        className="absolute inset-x-3 flex items-center justify-between rounded-full px-3 py-1.5"
        style={{
          bottom: "11%",
          background: "linear-gradient(90deg, #D4AF37, #E8D9A0)",
          boxShadow: "0 6px 18px rgba(212,175,55,0.4)",
        }}
      >
        <div className="flex flex-col leading-none">
          <span className="text-[7px] uppercase tracking-wider" style={{ color: "#04130E" }}>
            {s.cartLabel}
          </span>
          <span className="text-[9px] font-bold" style={{ color: "#04130E" }}>
            {s.cartCta}
          </span>
        </div>
        <Send size={11} color="#04130E" />
      </div>
      <TabBar items={s.tab} />
    </ScreenShell>
  );
}

function AdminView({ s }: { s: SectorMeta }) {
  const max = Math.max(...s.chart);
  return (
    <ScreenShell>
      <Header s={s} />
      <div className="px-3 pb-1.5 text-[9px] uppercase tracking-[0.16em]" style={{ color: "#E8D9A0" }}>
        Dashboard · Oggi
      </div>
      {/* KPIs */}
      <div className="mx-3 grid grid-cols-3 gap-1.5">
        {s.kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-md p-1.5"
            style={{
              background: "rgba(10,42,30,0.8)",
              border: "1px solid rgba(212,175,55,0.22)",
            }}
          >
            <div className="text-[6px] uppercase tracking-wider" style={{ color: "#9FB0A8" }}>
              {k.label}
            </div>
            <div className="mt-0.5 text-[11px] font-semibold leading-none" style={{ color: "#F5F1E6", fontFamily: "'Fraunces', Georgia, serif" }}>
              {k.value}
            </div>
            <div className="mt-0.5 flex items-center gap-0.5 text-[7px]" style={{ color: "#D4AF37" }}>
              <TrendingUp size={7} /> {k.trend}
            </div>
          </div>
        ))}
      </div>
      {/* Chart */}
      <div
        className="mx-3 mt-2 rounded-md p-2"
        style={{
          background: "rgba(4,19,14,0.7)",
          border: "1px solid rgba(212,175,55,0.18)",
        }}
      >
        <div className="text-[7px] uppercase tracking-wider" style={{ color: "#9FB0A8" }}>
          Andamento settimana
        </div>
        <div className="mt-1.5 flex h-10 items-end gap-1">
          {s.chart.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${(v / max) * 100}%`,
                background: i === s.chart.length - 1
                  ? "linear-gradient(180deg, #E8D9A0, #D4AF37)"
                  : "linear-gradient(180deg, rgba(212,175,55,0.55), rgba(212,175,55,0.2))",
              }}
            />
          ))}
        </div>
      </div>
      {/* Live list */}
      <div className="mx-3 mt-2 space-y-1">
        <div className="text-[7px] uppercase tracking-wider" style={{ color: "#9FB0A8" }}>
          Live ora
        </div>
        {s.liveList.map((row) => (
          <div
            key={row.primary}
            className="flex items-center gap-1.5 rounded-md p-1.5"
            style={{
              background: "rgba(10,42,30,0.6)",
              border: "1px solid rgba(212,175,55,0.14)",
            }}
          >
            <div className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#D4AF37", boxShadow: "0 0 6px #D4AF37" }} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[8px] font-semibold" style={{ color: "#F5F1E6" }}>
                {row.primary}
              </div>
              <div className="truncate text-[7px]" style={{ color: "#9FB0A8" }}>
                {row.secondary}
              </div>
            </div>
            <div className="text-[7px]" style={{ color: "#E8D9A0" }}>
              {row.meta}
            </div>
          </div>
        ))}
      </div>
      <TabBar items={s.tab} />
    </ScreenShell>
  );
}

function ChatView({ s }: { s: SectorMeta }) {
  return (
    <ScreenShell>
      {/* WhatsApp-style header */}
      <div
        className="flex items-center gap-2 px-3 pt-1 pb-2"
        style={{ borderBottom: "1px solid rgba(212,175,55,0.18)" }}
      >
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full text-[8px] font-bold"
          style={{
            background: "radial-gradient(circle at 30% 30%, #E8D9A0, #D4AF37 60%, #8a6e1f)",
            color: "#04130E",
          }}
        >
          E
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[10px] font-semibold" style={{ color: "#F5F1E6", fontFamily: "'Fraunces', Georgia, serif" }}>
            Empire AI
          </span>
          <span className="text-[7px] uppercase tracking-wider" style={{ color: "#9FB0A8" }}>
            online · risponde in 12s
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1 text-[7px]" style={{ color: "#9FB0A8" }}>
          <Clock size={8} /> 24/7
        </div>
      </div>

      {/* Bubbles */}
      <div className="flex flex-col gap-1.5 px-2.5 py-2" style={{ maxHeight: "62%", overflow: "hidden" }}>
        {s.chat.map((m, i) => {
          const out = m.from === "out";
          return (
            <div key={i} className={`flex ${out ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[78%] rounded-xl px-2 py-1.5"
                style={{
                  background: out
                    ? "linear-gradient(135deg, #1F5C42, #0E3A2A)"
                    : "rgba(245,241,230,0.92)",
                  color: out ? "#F5F1E6" : "#04130E",
                  border: out
                    ? "1px solid rgba(212,175,55,0.3)"
                    : "1px solid rgba(0,0,0,0.05)",
                  borderTopRightRadius: out ? 4 : 12,
                  borderTopLeftRadius: out ? 12 : 4,
                }}
              >
                <div className="text-[8px] leading-snug">{m.text}</div>
                <div className="mt-0.5 flex items-center justify-end gap-0.5 text-[6px] opacity-70">
                  {m.time}
                  {out && <CheckCheck size={8} color="#E8D9A0" />}
                  {!out && <Check size={8} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick replies */}
      <div className="absolute inset-x-3 flex gap-1.5" style={{ bottom: "12%" }}>
        {s.quickReplies.map((q) => (
          <div
            key={q}
            className="flex-1 rounded-full py-1 text-center text-[7px] font-semibold uppercase tracking-wider"
            style={{
              background: "rgba(212,175,55,0.14)",
              border: "1px solid rgba(212,175,55,0.4)",
              color: "#E8D9A0",
            }}
          >
            {q}
          </div>
        ))}
      </div>
      <TabBar items={s.tab} />
    </ScreenShell>
  );
}

/* ─────────── Public API ─────────── */

export function getEmpireScreens(sector: EmpireSector, view: PhoneView): ReactNode {
  const s = SECTORS[sector];
  if (!s) return null;
  switch (view) {
    case "Home sito":
      return <HomeView s={s} />;
    case "App cliente":
      return <AppView s={s} />;
    case "Admin":
      return <AdminView s={s} />;
    case "AI WhatsApp":
      return <ChatView s={s} />;
    default:
      return null;
  }
}

/** Map a portfolio project id to a sector with native screens (else null = image fallback). */
export function projectIdToSector(id: string): EmpireSector | null {
  switch (id) {
    case "strapizzami":
    case "paperfish":
      return "restaurant";
    case "velvet-studio":
      return "beauty";
    case "iron-club":
      return "fitness";
    default:
      return null;
  }
}
