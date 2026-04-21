/**
 * Renderizza UNA schermata React di un template (Paperfish/Strapizzami/Batey/Modern/etc)
 * dentro la cornice iPhone. 0 chiamate AI, fedele al 100% allo stile.
 *
 * Per ogni combinazione (template_variant × screen_type) costruisce una schermata
 * mobile-style con header, contenuto, bottom nav.
 */

interface Props {
  type: string;                 // 'home' | 'menu' | 'booking' | 'profile' | 'gallery' | 'checkout'
  templateVariant: string;      // 'paperfish' | 'strapizzami' | 'batey' | 'luxury_gold' | 'modern_dark' | 'casual_warm' | 'minimal_zen'
  businessName: string;
  businessSector?: string;
  businessCity?: string;
  primaryColor?: string;
  width: number;
  height: number;
}

interface ThemeTokens {
  bg: string;
  bgPanel: string;
  text: string;
  textMuted: string;
  primary: string;
  accent: string;
  fontHead: string;
  fontBody: string;
}

function getTheme(variant: string, primaryOverride?: string): ThemeTokens {
  const themes: Record<string, ThemeTokens> = {
    paperfish: {
      bg: "#0E0B0F", bgPanel: "#181216", text: "#F5E9EC", textMuted: "rgba(245,233,236,0.62)",
      primary: "#E89BAE", accent: "#C9A86A",
      fontHead: "'Cormorant Garamond', 'Playfair Display', serif",
      fontBody: "'Inter', system-ui, sans-serif",
    },
    strapizzami: {
      bg: "#F5EBD8", bgPanel: "#FFFFFF", text: "#3D2818", textMuted: "rgba(61,40,24,0.6)",
      primary: "#C84A2A", accent: "#B8893E",
      fontHead: "'Caveat', 'Kalam', cursive",
      fontBody: "'Inter', system-ui, sans-serif",
    },
    batey: {
      bg: "#08131F", bgPanel: "#0E1E2D", text: "#E8D5A8", textMuted: "rgba(232,213,168,0.6)",
      primary: "#5CC8D9", accent: "#FF8966",
      fontHead: "'Sora', 'Manrope', sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",
    },
    luxury_gold: {
      bg: "#1A1410", bgPanel: "#221915", text: "#F5E9D8", textMuted: "rgba(245,233,216,0.6)",
      primary: "#D4AF37", accent: "#F0D78C",
      fontHead: "'Cormorant Garamond', serif",
      fontBody: "'Inter', system-ui, sans-serif",
    },
    casual_warm: {
      bg: "#FAF6F0", bgPanel: "#FFFFFF", text: "#3D2818", textMuted: "rgba(61,40,24,0.6)",
      primary: "#E07856", accent: "#7A9B6B",
      fontHead: "'Outfit', system-ui, sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",
    },
    minimal_zen: {
      bg: "#F8F8F8", bgPanel: "#FFFFFF", text: "#222222", textMuted: "rgba(34,34,34,0.55)",
      primary: "#222222", accent: "#888888",
      fontHead: "'Helvetica Neue', sans-serif",
      fontBody: "'Helvetica Neue', sans-serif",
    },
    modern_dark: {
      bg: "#0F172A", bgPanel: "#1E293B", text: "#F1F5F9", textMuted: "rgba(241,245,249,0.6)",
      primary: "#C8963E", accent: "#3B82F6",
      fontHead: "'Inter', system-ui, sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",
    },
  };
  const base = themes[variant] || themes.modern_dark;
  return primaryOverride ? { ...base, primary: primaryOverride } : base;
}

function StatusBar({ text }: { text: string }) {
  return (
    <div
      className="flex items-center justify-between px-5 pt-2 pb-1 text-[10px] font-semibold"
      style={{ color: text }}
    >
      <span>9:41</span>
      <span className="opacity-0">●</span>
      <span className="flex items-center gap-1">
        <span>5G</span>
        <span>●●●</span>
        <span>100%</span>
      </span>
    </div>
  );
}

function BottomNav({ theme }: { theme: ThemeTokens }) {
  const items = [
    { icon: "🏠", label: "Home" },
    { icon: "🍽️", label: "Menu" },
    { icon: "📅", label: "Prenota" },
    { icon: "👤", label: "Profilo" },
  ];
  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex justify-around items-center pb-3 pt-2 px-2"
      style={{ background: theme.bgPanel, borderTop: `1px solid ${theme.primary}25` }}
    >
      {items.map((it, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <span className="text-[11px]" style={{ filter: i === 0 ? "none" : "grayscale(0.6) opacity(0.6)" }}>{it.icon}</span>
          <span className="text-[7px] font-medium" style={{ color: i === 0 ? theme.primary : theme.textMuted }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function HomeScreen({ theme, name, sector, city }: { theme: ThemeTokens; name: string; sector: string; city: string }) {
  return (
    <>
      <div className="px-4 pt-1">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[8px]" style={{ color: theme.textMuted }}>Benvenuto in</p>
            <p className="font-bold text-sm leading-tight" style={{ color: theme.text, fontFamily: theme.fontHead }}>{name}</p>
          </div>
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: theme.primary, color: theme.bg }}>
            <span className="text-[10px] font-bold">★</span>
          </div>
        </div>

        {/* Hero card */}
        <div
          className="rounded-2xl p-4 mb-3 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}
        >
          <p className="text-[8px] font-semibold opacity-80" style={{ color: theme.bg }}>★★★★★ 4.9</p>
          <p className="text-base font-bold mt-1 leading-tight" style={{ color: theme.bg, fontFamily: theme.fontHead }}>
            Vivi un'esperienza unica
          </p>
          <p className="text-[8px] mt-1 opacity-80" style={{ color: theme.bg }}>{sector || "Eccellenza"} a {city || "Italia"}</p>
          <button
            className="mt-2 px-3 py-1.5 rounded-full text-[9px] font-bold"
            style={{ background: theme.bg, color: theme.primary }}
          >
            Prenota Ora →
          </button>
        </div>

        {/* Quick actions */}
        <p className="text-[8px] font-semibold mb-1.5" style={{ color: theme.textMuted }}>RAPIDO</p>
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {["📋 Menu", "📞 Chiama", "📍 Mappa"].map((it, i) => (
            <div key={i} className="rounded-xl p-2 text-center" style={{ background: theme.bgPanel }}>
              <p className="text-[9px] font-medium" style={{ color: theme.text }}>{it}</p>
            </div>
          ))}
        </div>

        {/* Featured */}
        <p className="text-[8px] font-semibold mb-1.5" style={{ color: theme.textMuted }}>POPOLARI</p>
        {[1, 2].map(i => (
          <div key={i} className="rounded-xl p-2 mb-1.5 flex items-center gap-2" style={{ background: theme.bgPanel }}>
            <div className="w-8 h-8 rounded-lg" style={{ background: `linear-gradient(135deg, ${theme.primary}40, ${theme.accent}60)` }} />
            <div className="flex-1">
              <p className="text-[9px] font-bold" style={{ color: theme.text }}>Specialità #{i}</p>
              <p className="text-[7px]" style={{ color: theme.textMuted }}>★ 4.{8 + i} · 120+ ordini</p>
            </div>
            <p className="text-[9px] font-bold" style={{ color: theme.primary }}>€{12 + i * 4}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function MenuScreen({ theme, sector }: { theme: ThemeTokens; sector: string }) {
  const isFood = /ristor|pizz|sushi|trat|oster|food|cucin|bar|cafe/i.test(sector);
  const items = isFood
    ? [
        { name: "Antipasti", price: "8-14" },
        { name: "Primi Piatti", price: "12-18" },
        { name: "Secondi", price: "18-26" },
        { name: "Pizze", price: "9-15" },
        { name: "Dolci", price: "6-9" },
        { name: "Bevande", price: "3-12" },
      ]
    : [
        { name: "Servizio Base", price: "30" },
        { name: "Servizio Premium", price: "60" },
        { name: "Pacchetto Completo", price: "120" },
        { name: "Consulenza", price: "80" },
        { name: "Gift Card", price: "50+" },
        { name: "Abbonamento", price: "99/mese" },
      ];
  return (
    <div className="px-4 pt-1">
      <p className="font-bold text-sm mb-1" style={{ color: theme.text, fontFamily: theme.fontHead }}>{isFood ? "Il Nostro Menù" : "I Nostri Servizi"}</p>
      <p className="text-[8px] mb-3" style={{ color: theme.textMuted }}>Selezionati con cura</p>

      <div className="flex gap-1.5 mb-3 overflow-hidden">
        {["Tutti", "Popolari", "Nuovi"].map((c, i) => (
          <span key={i} className="text-[8px] px-2 py-1 rounded-full font-medium" style={{
            background: i === 0 ? theme.primary : theme.bgPanel,
            color: i === 0 ? theme.bg : theme.text,
          }}>{c}</span>
        ))}
      </div>

      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2 py-2 border-b" style={{ borderColor: `${theme.primary}15` }}>
          <div className="w-9 h-9 rounded-lg" style={{ background: `linear-gradient(135deg, ${theme.primary}30, ${theme.accent}50)` }} />
          <div className="flex-1">
            <p className="text-[10px] font-semibold" style={{ color: theme.text }}>{it.name}</p>
            <p className="text-[7px]" style={{ color: theme.textMuted }}>Selezione premium 2026</p>
          </div>
          <p className="text-[10px] font-bold" style={{ color: theme.primary }}>€{it.price}</p>
        </div>
      ))}
    </div>
  );
}

function BookingScreen({ theme }: { theme: ThemeTokens }) {
  return (
    <div className="px-4 pt-1">
      <p className="font-bold text-sm mb-1" style={{ color: theme.text, fontFamily: theme.fontHead }}>Prenota un tavolo</p>
      <p className="text-[8px] mb-3" style={{ color: theme.textMuted }}>Conferma immediata via SMS</p>

      <div className="rounded-xl p-3 mb-2" style={{ background: theme.bgPanel }}>
        <p className="text-[8px] font-semibold mb-1" style={{ color: theme.textMuted }}>DATA</p>
        <div className="grid grid-cols-7 gap-1">
          {["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map((d, i) => (
            <div key={i} className="text-center">
              <p className="text-[7px]" style={{ color: theme.textMuted }}>{d}</p>
              <p className="text-[10px] font-bold mt-0.5 py-1 rounded" style={{
                background: i === 4 ? theme.primary : "transparent",
                color: i === 4 ? theme.bg : theme.text,
              }}>{15 + i}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-3 mb-2" style={{ background: theme.bgPanel }}>
        <p className="text-[8px] font-semibold mb-1.5" style={{ color: theme.textMuted }}>ORARIO</p>
        <div className="grid grid-cols-4 gap-1.5">
          {["12:30", "13:00", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"].map((t, i) => (
            <span key={i} className="text-[8px] py-1 text-center rounded-md font-medium" style={{
              background: i === 4 ? theme.primary : `${theme.text}10`,
              color: i === 4 ? theme.bg : theme.text,
            }}>{t}</span>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-3 mb-2 flex items-center justify-between" style={{ background: theme.bgPanel }}>
        <div>
          <p className="text-[8px]" style={{ color: theme.textMuted }}>PERSONE</p>
          <p className="text-sm font-bold" style={{ color: theme.text }}>4 ospiti</p>
        </div>
        <div className="flex gap-1">
          <button className="w-6 h-6 rounded-full text-[10px] font-bold" style={{ background: `${theme.primary}30`, color: theme.text }}>−</button>
          <button className="w-6 h-6 rounded-full text-[10px] font-bold" style={{ background: theme.primary, color: theme.bg }}>+</button>
        </div>
      </div>

      <button
        className="w-full py-2.5 rounded-xl text-[10px] font-bold mt-2"
        style={{ background: theme.primary, color: theme.bg }}
      >
        Conferma Prenotazione
      </button>
    </div>
  );
}

function ProfileScreen({ theme, name }: { theme: ThemeTokens; name: string }) {
  return (
    <div className="px-4 pt-1">
      {/* Avatar */}
      <div className="flex flex-col items-center pb-3 mb-3 border-b" style={{ borderColor: `${theme.primary}20` }}>
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-1"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}
        >
          <span className="text-base font-bold" style={{ color: theme.bg, fontFamily: theme.fontHead }}>MR</span>
        </div>
        <p className="text-xs font-bold" style={{ color: theme.text }}>Marco Rossi</p>
        <p className="text-[8px]" style={{ color: theme.textMuted }}>Cliente VIP · Membro dal 2024</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        {[
          { v: "12", l: "Visite" },
          { v: "240", l: "Punti" },
          { v: "★4.9", l: "Rating" },
        ].map((s, i) => (
          <div key={i} className="text-center rounded-xl py-2" style={{ background: theme.bgPanel }}>
            <p className="text-sm font-bold" style={{ color: theme.primary, fontFamily: theme.fontHead }}>{s.v}</p>
            <p className="text-[7px]" style={{ color: theme.textMuted }}>{s.l}</p>
          </div>
        ))}
      </div>

      {/* Loyalty */}
      <div className="rounded-xl p-3 mb-3" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}>
        <p className="text-[8px] font-semibold opacity-80" style={{ color: theme.bg }}>FEDELTÀ EMPIRE</p>
        <p className="text-xs font-bold mt-0.5" style={{ color: theme.bg }}>240 / 300 punti</p>
        <div className="h-1 rounded-full bg-black/20 mt-1.5">
          <div className="h-1 rounded-full bg-white/90" style={{ width: "80%" }} />
        </div>
        <p className="text-[7px] mt-1 opacity-80" style={{ color: theme.bg }}>60 punti per cena gratis</p>
      </div>

      {/* Recent reviews */}
      <p className="text-[8px] font-semibold mb-1.5" style={{ color: theme.textMuted }}>LE TUE RECENSIONI</p>
      {[
        { stars: "★★★★★", txt: "Esperienza straordinaria, tornerò sicuramente!" },
        { stars: "★★★★★", txt: "Servizio impeccabile da inizio a fine." },
      ].map((r, i) => (
        <div key={i} className="rounded-xl p-2 mb-1.5" style={{ background: theme.bgPanel }}>
          <p className="text-[9px]" style={{ color: theme.primary }}>{r.stars}</p>
          <p className="text-[8px] mt-0.5" style={{ color: theme.text }}>"{r.txt}"</p>
        </div>
      ))}

      <p className="text-[7px] text-center mt-2" style={{ color: theme.textMuted }}>{name}</p>
    </div>
  );
}

function GalleryScreen({ theme, name }: { theme: ThemeTokens; name: string }) {
  return (
    <div className="px-4 pt-1">
      <p className="font-bold text-sm mb-1" style={{ color: theme.text, fontFamily: theme.fontHead }}>Galleria</p>
      <p className="text-[8px] mb-3" style={{ color: theme.textMuted }}>{name}</p>
      <div className="grid grid-cols-2 gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-lg" style={{
            background: `linear-gradient(${45 + i * 30}deg, ${theme.primary}${50 + (i % 3) * 20}, ${theme.accent}${40 + (i % 4) * 15})`,
          }} />
        ))}
      </div>
    </div>
  );
}

function CheckoutScreen({ theme }: { theme: ThemeTokens }) {
  return (
    <div className="px-4 pt-1">
      <p className="font-bold text-sm mb-1" style={{ color: theme.text, fontFamily: theme.fontHead }}>Riepilogo ordine</p>
      <p className="text-[8px] mb-3" style={{ color: theme.textMuted }}>Verifica e paga</p>

      {[
        { n: "Specialità della casa", p: "18.00" },
        { n: "Vino della casa 0.5L", p: "12.00" },
        { n: "Dessert", p: "7.00" },
      ].map((it, i) => (
        <div key={i} className="flex justify-between py-1.5 border-b" style={{ borderColor: `${theme.primary}15` }}>
          <p className="text-[10px]" style={{ color: theme.text }}>{it.n}</p>
          <p className="text-[10px] font-semibold" style={{ color: theme.text }}>€{it.p}</p>
        </div>
      ))}

      <div className="flex justify-between py-2 mt-2">
        <p className="text-xs font-bold" style={{ color: theme.text }}>Totale</p>
        <p className="text-xs font-bold" style={{ color: theme.primary }}>€37.00</p>
      </div>

      <div className="rounded-xl p-2 mb-2" style={{ background: theme.bgPanel }}>
        <p className="text-[8px] font-semibold" style={{ color: theme.textMuted }}>METODO PAGAMENTO</p>
        <p className="text-[10px] font-medium mt-0.5" style={{ color: theme.text }}>•••• 4242 · Apple Pay</p>
      </div>

      <button
        className="w-full py-2.5 rounded-xl text-[10px] font-bold"
        style={{ background: theme.primary, color: theme.bg }}
      >
        Paga €37.00
      </button>
    </div>
  );
}

export function MockupReactScreen({
  type,
  templateVariant,
  businessName,
  businessSector = "",
  businessCity = "",
  primaryColor,
  width,
  height,
}: Props) {
  const theme = getTheme(templateVariant, primaryColor);

  const renderContent = () => {
    switch (type) {
      case "menu":     return <MenuScreen theme={theme} sector={businessSector} />;
      case "booking":  return <BookingScreen theme={theme} />;
      case "profile":  return <ProfileScreen theme={theme} name={businessName} />;
      case "gallery":  return <GalleryScreen theme={theme} name={businessName} />;
      case "checkout": return <CheckoutScreen theme={theme} />;
      case "home":
      default:         return <HomeScreen theme={theme} name={businessName} sector={businessSector} city={businessCity} />;
    }
  };

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width,
        height,
        background: theme.bg,
        fontFamily: theme.fontBody,
      }}
    >
      <StatusBar text={theme.text} />
      <div className="overflow-hidden" style={{ height: height - 60 }}>
        {renderContent()}
      </div>
      <BottomNav theme={theme} />
    </div>
  );
}
