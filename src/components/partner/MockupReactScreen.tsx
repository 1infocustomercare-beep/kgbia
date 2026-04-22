/**
 * Premium iPhone mockup screens — 100% in-app UI, no AI calls.
 * Each template variant has its OWN visual personality (colors, typography, layout density,
 * imagery style) but all 4 screens (home/menu/booking/profile/gallery/checkout) stay coherent
 * within the same template.
 *
 * Quality target: looks like a real production app — rich imagery (gradient/SVG art),
 * cards with prices and ratings, badges, search bars, segmented controls, swipeable rows,
 * loyalty banners, payment summaries.
 */

interface Props {
  type: string;
  templateVariant: string;
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
  bgPanelAlt: string;
  text: string;
  textMuted: string;
  primary: string;
  accent: string;
  fontHead: string;
  fontBody: string;
  // Visual identity flags
  vibe:
    | "dark-luxury" | "warm-craft" | "ocean-breeze" | "minimal-zen"
    | "sushi-noir" | "gold-elegance" | "tech-modern" | "neon-vibrant"
    | "editorial-clean" | "boutique-pastel" | "monochrome-bold" | "glass-aurora"
    | "real-estate-trust" | "fitness-energy";
  radius: number;
  imageStyle:
    | "food-warm" | "spa-soft" | "ocean" | "noir" | "luxury" | "modern"
    | "vibrant" | "pastel" | "monochrome" | "aurora" | "estate" | "energy";
}

function getTheme(variant: string, primaryOverride?: string): ThemeTokens {
  const themes: Record<string, ThemeTokens> = {
    paperfish: {
      bg: "#0E0B0F", bgPanel: "#181216", bgPanelAlt: "#221A1F",
      text: "#F5E9EC", textMuted: "rgba(245,233,236,0.55)",
      primary: "#E89BAE", accent: "#C9A86A",
      fontHead: "'Cormorant Garamond', 'Playfair Display', serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "sushi-noir", radius: 14, imageStyle: "noir",
    },
    strapizzami: {
      bg: "#F5EBD8", bgPanel: "#FFFFFF", bgPanelAlt: "#FFF4E0",
      text: "#3D2818", textMuted: "rgba(61,40,24,0.55)",
      primary: "#C84A2A", accent: "#B8893E",
      fontHead: "'Caveat', 'Kalam', cursive",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "warm-craft", radius: 18, imageStyle: "food-warm",
    },
    batey: {
      bg: "#08131F", bgPanel: "#0E1E2D", bgPanelAlt: "#142838",
      text: "#E8D5A8", textMuted: "rgba(232,213,168,0.55)",
      primary: "#5CC8D9", accent: "#FF8966",
      fontHead: "'Sora', 'Manrope', sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "ocean-breeze", radius: 20, imageStyle: "ocean",
    },
    luxury_gold: {
      bg: "#1A1410", bgPanel: "#221915", bgPanelAlt: "#2C2018",
      text: "#F5E9D8", textMuted: "rgba(245,233,216,0.55)",
      primary: "#D4AF37", accent: "#F0D78C",
      fontHead: "'Cormorant Garamond', serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "gold-elegance", radius: 12, imageStyle: "luxury",
    },
    casual_warm: {
      bg: "#FAF6F0", bgPanel: "#FFFFFF", bgPanelAlt: "#FFF8EE",
      text: "#3D2818", textMuted: "rgba(61,40,24,0.55)",
      primary: "#E07856", accent: "#7A9B6B",
      fontHead: "'Outfit', system-ui, sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "warm-craft", radius: 18, imageStyle: "food-warm",
    },
    minimal_zen: {
      bg: "#F8F8F8", bgPanel: "#FFFFFF", bgPanelAlt: "#EFEFEF",
      text: "#1F1F1F", textMuted: "rgba(31,31,31,0.5)",
      primary: "#2A2A2A", accent: "#9B9B9B",
      fontHead: "'Helvetica Neue', sans-serif",
      fontBody: "'Helvetica Neue', sans-serif",
      vibe: "minimal-zen", radius: 8, imageStyle: "spa-soft",
    },
    modern_dark: {
      bg: "#0F172A", bgPanel: "#1E293B", bgPanelAlt: "#293548",
      text: "#F1F5F9", textMuted: "rgba(241,245,249,0.55)",
      primary: "#C8963E", accent: "#3B82F6",
      fontHead: "'Inter', system-ui, sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "tech-modern", radius: 16, imageStyle: "modern",
    },
    neon_vibrant: {
      bg: "#0A0118", bgPanel: "#15082A", bgPanelAlt: "#1F0F3D",
      text: "#F8F4FF", textMuted: "rgba(248,244,255,0.55)",
      primary: "#FF2E9A", accent: "#00E5FF",
      fontHead: "'Space Grotesk', 'Sora', sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "neon-vibrant", radius: 22, imageStyle: "vibrant",
    },
    editorial_clean: {
      bg: "#FFFFFF", bgPanel: "#F7F5F1", bgPanelAlt: "#EFEBE3",
      text: "#0A0A0A", textMuted: "rgba(10,10,10,0.55)",
      primary: "#0A0A0A", accent: "#D9534F",
      fontHead: "'Playfair Display', 'Cormorant Garamond', serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "editorial-clean", radius: 6, imageStyle: "monochrome",
    },
    boutique_pastel: {
      bg: "#FFF6F2", bgPanel: "#FFFFFF", bgPanelAlt: "#FFEDE3",
      text: "#3A2A35", textMuted: "rgba(58,42,53,0.55)",
      primary: "#E8A0B8", accent: "#A89DC9",
      fontHead: "'DM Serif Display', 'Cormorant Garamond', serif",
      fontBody: "'Outfit', system-ui, sans-serif",
      vibe: "boutique-pastel", radius: 24, imageStyle: "pastel",
    },
    monochrome_bold: {
      bg: "#0A0A0A", bgPanel: "#161616", bgPanelAlt: "#1F1F1F",
      text: "#FAFAFA", textMuted: "rgba(250,250,250,0.55)",
      primary: "#FAFAFA", accent: "#FFD60A",
      fontHead: "'Archivo Black', 'Inter', sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "monochrome-bold", radius: 4, imageStyle: "monochrome",
    },
    glass_aurora: {
      bg: "#0B0F1F", bgPanel: "#141B33", bgPanelAlt: "#1B2547",
      text: "#E8EEFF", textMuted: "rgba(232,238,255,0.55)",
      primary: "#7C9FFF", accent: "#A5F3D0",
      fontHead: "'Sora', 'Manrope', sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "glass-aurora", radius: 20, imageStyle: "aurora",
    },
    real_estate_trust: {
      bg: "#F5F2EC", bgPanel: "#FFFFFF", bgPanelAlt: "#EAE3D3",
      text: "#1B2A3A", textMuted: "rgba(27,42,58,0.55)",
      primary: "#1B2A3A", accent: "#B89760",
      fontHead: "'Cormorant Garamond', 'Playfair Display', serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "real-estate-trust", radius: 10, imageStyle: "estate",
    },
    fitness_energy: {
      bg: "#0D0D0D", bgPanel: "#171717", bgPanelAlt: "#222222",
      text: "#F5F5F5", textMuted: "rgba(245,245,245,0.55)",
      primary: "#C8FF00", accent: "#FF3D3D",
      fontHead: "'Archivo Black', 'Bebas Neue', sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",
      vibe: "fitness-energy", radius: 14, imageStyle: "energy",
    },
  };
  // Aliases for variants used in edge function but mapped to closest existing theme
  const aliases: Record<string, string> = {
    noir_gold: "luxury_gold",
    blush_lavender: "boutique_pastel",
    ocean_deep: "batey",
    clinical_clean: "minimal_zen",
    luxury_chrome: "monochrome_bold",
    navy_trust: "real_estate_trust",
  };
  const resolved = aliases[variant] || variant;
  const base = themes[resolved] || themes.modern_dark;
  return primaryOverride ? { ...base, primary: primaryOverride } : base;
}

// ════════════════════════════════════════════════════════════════════════════
// Visual asset generator: SVG "photos" using gradients + abstract shapes
// Different per imageStyle so each template feels visually distinct.
// ════════════════════════════════════════════════════════════════════════════
function ArtImage({ theme, seed = 0, className = "", style = {} }: { theme: ThemeTokens; seed?: number; className?: string; style?: React.CSSProperties }) {
  const palettes: Record<ThemeTokens["imageStyle"], string[][]> = {
    "food-warm":  [["#E07856","#C84A2A","#7A4A2A"], ["#F4A261","#E76F51","#8B4513"], ["#D4814B","#A0522D","#5C2E0E"], ["#E89B6C","#B85450","#3D1F0A"]],
    "spa-soft":   [["#C9D4C5","#A8B5A0","#6B7B6F"], ["#D8C8B8","#A89880","#705F4F"], ["#B8C8D4","#8FA0B0","#5A6B7A"], ["#E0D5C8","#B8AB9C","#7A6F60"]],
    "ocean":      [["#5CC8D9","#3B7A8C","#0E1E2D"], ["#FF8966","#D4814B","#5C2E0E"], ["#A8D8E0","#5CB0C2","#1F4858"], ["#E8D5A8","#B89E6E","#5A4828"]],
    "noir":       [["#E89BAE","#A66578","#3D1A28"], ["#C9A86A","#8B7548","#2A1F12"], ["#D4A0B8","#7A4858","#1F0F18"], ["#F0DCC8","#A0826B","#2D1F18"]],
    "luxury":     [["#D4AF37","#9B8030","#3D2F18"], ["#F0D78C","#B89548","#5C4220"], ["#E8C46A","#A07830","#2D1F0E"], ["#F5E9D8","#C8A878","#5C4828"]],
    "modern":     [["#3B82F6","#1E40AF","#0F172A"], ["#C8963E","#8B6928","#3D2D14"], ["#8B5CF6","#5B21B6","#1E1B4B"], ["#10B981","#047857","#022C22"]],
    "vibrant":    [["#FF2E9A","#9C27B0","#0A0118"], ["#00E5FF","#1976D2","#0A0118"], ["#FFD60A","#FF8C00","#1F0F3D"], ["#7C4DFF","#311B92","#0A0118"]],
    "pastel":     [["#FAD0C4","#FFD3DC","#A89DC9"], ["#FFEAA7","#FAB1A0","#E8A0B8"], ["#A8E6CF","#FFD3B6","#FFAAA5"], ["#D4A5C9","#F5C6E0","#B8E0D2"]],
    "monochrome": [["#0A0A0A","#3F3F3F","#FAFAFA"], ["#FAFAFA","#A1A1A1","#0A0A0A"], ["#1F1F1F","#5C5C5C","#E5E5E5"], ["#FAFAFA","#737373","#0A0A0A"]],
    "aurora":     [["#7C9FFF","#A5F3D0","#0B0F1F"], ["#C9A4FF","#7CD8FF","#141B33"], ["#A5F3D0","#FFD3B6","#0B0F1F"], ["#FF9EC7","#A8B0FF","#1B2547"]],
    "estate":     [["#B89760","#7A6240","#1B2A3A"], ["#D4BC8A","#9C8557","#2C3E50"], ["#E0C9A0","#A88B5C","#34495E"], ["#F5E9D2","#B89760","#1B2A3A"]],
    "energy":     [["#C8FF00","#7AAD00","#0D0D0D"], ["#FF3D3D","#A02020","#0D0D0D"], ["#00FFE5","#0099A8","#171717"], ["#FFD60A","#B89500","#0D0D0D"]],
  };
  const palette = palettes[theme.imageStyle][seed % palettes[theme.imageStyle].length];
  const id = `g-${theme.imageStyle}-${seed}`;
  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette[0]} />
            <stop offset="60%" stopColor={palette[1]} />
            <stop offset="100%" stopColor={palette[2]} />
          </linearGradient>
          <radialGradient id={`${id}-r`} cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor={palette[0]} stopOpacity="0.9" />
            <stop offset="100%" stopColor={palette[2]} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#${id})`} />
        <circle cx={20 + (seed * 17) % 60} cy={25 + (seed * 13) % 50} r={18 + (seed % 4) * 4} fill={`url(#${id}-r)`} opacity="0.8" />
        <circle cx={70 - (seed * 11) % 40} cy={70 - (seed * 7) % 30} r={12 + (seed % 3) * 3} fill={palette[0]} opacity="0.3" />
        {theme.imageStyle === "noir" && <rect x="0" y="60" width="100" height="40" fill="black" opacity="0.4" />}
        {theme.imageStyle === "luxury" && <path d={`M0,${50 + seed % 20} Q50,${30 + seed % 20} 100,${55 + seed % 15} L100,100 L0,100 Z`} fill={palette[2]} opacity="0.5" />}
        {theme.imageStyle === "ocean" && <path d={`M0,${65 + seed % 10} Q25,${55 + seed % 10} 50,${65} T100,${60} L100,100 L0,100 Z`} fill="white" opacity="0.15" />}
      </svg>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Reusable iPhone shell pieces
// ════════════════════════════════════════════════════════════════════════════
function StatusBar({ theme }: { theme: ThemeTokens }) {
  return (
    <div className="flex items-center justify-between px-5 pt-2 pb-1 text-[9px] font-semibold relative z-20" style={{ color: theme.text }}>
      <span>9:41</span>
      <span className="absolute left-1/2 -translate-x-1/2 w-12 h-3" />
      <span className="flex items-center gap-1.5">
        <svg width="11" height="7" viewBox="0 0 11 7" fill="currentColor"><path d="M0 5h2v2H0zM3 3h2v4H3zM6 1h2v6H6zM9 0h2v7H9z"/></svg>
        <svg width="9" height="7" viewBox="0 0 9 7" fill="currentColor"><path d="M4.5 1.2A6 6 0 018.4 2.7l-.5.6A5 5 0 004.5 2 5 5 0 001.1 3.3l-.5-.6A6 6 0 014.5 1.2zM4.5 3a4 4 0 012.6 1l-.5.6a3 3 0 00-2.1-.8 3 3 0 00-2.1.8l-.5-.6a4 4 0 012.6-1zM4.5 5a2 2 0 011.3.5L4.5 7 3.2 5.5A2 2 0 014.5 5z"/></svg>
        <span className="flex items-center gap-0.5">
          <span className="text-[8px]">100</span>
          <span className="inline-block w-4 h-2 border rounded-[2px]" style={{ borderColor: theme.text }}><span className="block h-full w-full" style={{ background: theme.text, borderRadius: 1 }} /></span>
        </span>
      </span>
    </div>
  );
}

function BottomNav({ theme, active = "home" }: { theme: ThemeTokens; active?: string }) {
  const items = [
    { key: "home",    icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2z", label: "Home" },
    { key: "menu",    icon: "M4 6h16M4 12h16M4 18h16", label: "Menu", stroke: true },
    { key: "booking", icon: "M3 5h18v16H3zM3 10h18M8 3v4M16 3v4", label: "Prenota", stroke: true },
    { key: "profile", icon: "M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0z", label: "Profilo" },
  ];
  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex justify-around items-center pb-3 pt-2 px-2 z-10"
      style={{ background: `${theme.bgPanel}f0`, backdropFilter: "blur(12px)", borderTop: `1px solid ${theme.primary}25` }}
    >
      {items.map((it) => {
        const isActive = it.key === active;
        return (
          <div key={it.key} className="flex flex-col items-center gap-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill={it.stroke ? "none" : (isActive ? theme.primary : theme.textMuted)} stroke={it.stroke ? (isActive ? theme.primary : theme.textMuted) : "none"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={it.icon} />
            </svg>
            <span className="text-[7px] font-semibold" style={{ color: isActive ? theme.primary : theme.textMuted }}>{it.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function brandInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase() || "B";
}

function sectorLabel(sector: string) {
  const s = (sector || "").toLowerCase();
  if (/sushi|giappon/.test(s)) return "Sushi & Ramen";
  if (/pizz/.test(s)) return "Pizzeria";
  if (/ristor|trattor|oster/.test(s)) return "Ristorante";
  if (/bar|cafe|caff/.test(s)) return "Caffetteria";
  if (/spa|wellness|benesser/.test(s)) return "Spa & Wellness";
  if (/beauty|estetic|parruc|hair|nail/.test(s)) return "Beauty";
  if (/hotel|albergh|b&b|bnb/.test(s)) return "Hospitality";
  if (/lido|spiagg|beach/.test(s)) return "Beach Club";
  if (/yacht|charter|boat|vela/.test(s)) return "Charter";
  if (/fitness|palestra|gym|crossfit/.test(s)) return "Fitness Club";
  if (/medic|dent|cliniche|salute/.test(s)) return "Healthcare";
  if (/immobil|real ?estate|agenzi/.test(s)) return "Immobiliare";
  if (/ncc|taxi|transfer|noleggi/.test(s)) return "Transfer Premium";
  if (/avvocat|legal|notai|commercia/.test(s)) return "Studio Legale";
  if (/ecommerce|shop|store|fashion|moda|boutique/.test(s)) return "Boutique";
  if (/turism|tour|viagg|escursion/.test(s)) return "Travel";
  if (/event|wedding|cerimoni/.test(s)) return "Eventi";
  if (/edili|costruz|impresa|impiant|ristruttur/.test(s)) return "Trades";
  if (/scuola|academy|corso|format/.test(s)) return "Academy";
  if (/auto|moto|conces/.test(s)) return "Automotive";
  return sector || "Premium";
}

function getMenuItems(sector: string) {
  const s = sector.toLowerCase();
  if (/sushi|giappon/.test(s)) {
    return [
      { name: "Sashimi Misto", desc: "Tonno, salmone, branzino · 9 pz", price: 24, badge: "Chef" },
      { name: "Uramaki Dragon", desc: "Gambero tempura, avocado, anguilla", price: 18, badge: "Top" },
      { name: "Nigiri Selection", desc: "8 pz · Wasabi fresco", price: 22 },
      { name: "Ramen Tonkotsu", desc: "12h di brodo · Chashu di maiale", price: 16, badge: "Hot" },
      { name: "Gyoza al Vapore", desc: "6 pz · Maiale e cavolo", price: 9 },
      { name: "Mochi Dessert", desc: "Tè verde, mango, sesamo nero", price: 7 },
    ];
  }
  if (/pizz/.test(s)) {
    return [
      { name: "Margherita DOP", desc: "San Marzano, fior di latte, basilico", price: 9, badge: "Top" },
      { name: "Diavola Premium", desc: "Salame piccante calabrese, fiordilatte", price: 12 },
      { name: "Tartufo & Burrata", desc: "Tartufo nero estivo, burrata pugliese", price: 18, badge: "Chef" },
      { name: "Quattro Formaggi", desc: "Mozzarella, gorgonzola, parmigiano, provola", price: 13 },
      { name: "Capricciosa", desc: "Prosciutto cotto, funghi, carciofi, olive", price: 12 },
      { name: "Calzone Classico", desc: "Pomodoro, mozzarella, prosciutto, ricotta", price: 11 },
    ];
  }
  if (/ristor|trattor|oster|food/.test(s)) {
    return [
      { name: "Crudo di Tonno", desc: "Pinzimonio agli agrumi · Olio EVO", price: 22, badge: "Chef" },
      { name: "Tagliolini al Tartufo", desc: "Tartufo nero · Burro di malga", price: 19, badge: "Top" },
      { name: "Branzino in Crosta", desc: "Sale rosa, erbe aromatiche", price: 28 },
      { name: "Filetto al Barolo", desc: "Riduzione di Barolo · Patate dauphine", price: 32 },
      { name: "Tiramisù della Casa", desc: "Mascarpone fresco · Caffè espresso", price: 9 },
      { name: "Calice di Vino", desc: "Selezione cantina del giorno", price: 8 },
    ];
  }
  if (/spa|wellness|benesser/.test(s)) {
    return [
      { name: "Massaggio Rituale Empire", desc: "90 min · Oli essenziali · Pietre calde", price: 145, badge: "Top" },
      { name: "Percorso Hammam", desc: "120 min · Vapore, scrub, idromassaggio", price: 95 },
      { name: "Trattamento Viso Gold", desc: "75 min · Maschera 24K · Anti-age", price: 110, badge: "Chef" },
      { name: "Riflessologia Plantare", desc: "45 min · Riequilibrio energetico", price: 65 },
      { name: "Percorso Coppia Luxury", desc: "Spa privata 90 min · Champagne", price: 280, badge: "Hot" },
      { name: "Day Spa Completo", desc: "Mezza giornata · Tutti i trattamenti", price: 180 },
    ];
  }
  if (/beauty|estetic|parruc|hair/.test(s)) {
    return [
      { name: "Taglio & Piega Signature", desc: "Consulenza · Taglio · Styling", price: 45, badge: "Top" },
      { name: "Colore Vegetale", desc: "100% naturale · Trattamento ricostruttivo", price: 75 },
      { name: "Balayage Premium", desc: "Schiariture su misura · Toner", price: 120, badge: "Chef" },
      { name: "Trattamento Botox Capillare", desc: "Liscio e luminoso 6 settimane", price: 85 },
      { name: "Manicure & Pedicure", desc: "Spa per mani e piedi · Smalto incluso", price: 55 },
      { name: "Make-Up Evento", desc: "Trucco professionale · Prova inclusa", price: 90 },
    ];
  }
  if (/hotel|albergh|lido|beach|yacht|b&b|bnb/.test(s)) {
    return [
      { name: "Suite Vista Mare", desc: "Camera deluxe · Terrazza privata", price: 280, badge: "Top" },
      { name: "Cabana Premium", desc: "Lettini, ombrellone, servizio bar", price: 95 },
      { name: "Charter Privato 4h", desc: "Skipper, aperitivo, snorkeling", price: 450, badge: "Chef" },
      { name: "Cena in Spiaggia", desc: "Tavolo sul mare · Menu degustazione", price: 120 },
      { name: "SPA & Mare Package", desc: "Day spa + lettini + pranzo", price: 165, badge: "Hot" },
      { name: "Aperitivo al Tramonto", desc: "Calice champagne + tagliere", price: 35 },
    ];
  }
  if (/immobil|real ?estate|agenzi/.test(s)) {
    return [
      { name: "Attico Panoramico", desc: "120 mq · 3 camere · Terrazzo 40 mq", price: 890, badge: "Top" },
      { name: "Villa con Piscina", desc: "350 mq · Giardino · Garage doppio", price: 1450, badge: "Chef" },
      { name: "Bilocale in Centro", desc: "55 mq · Ristrutturato · Balcone", price: 320 },
      { name: "Loft Industrial", desc: "85 mq · Open space · Travi a vista", price: 540, badge: "Hot" },
      { name: "Casale di Campagna", desc: "210 mq · 8.000 mq di terreno", price: 720 },
      { name: "Trilocale Vista Mare", desc: "95 mq · 2 bagni · Vista aperta", price: 480 },
    ];
  }
  if (/ncc|taxi|transfer|noleggi/.test(s)) {
    return [
      { name: "Transfer Aeroporto", desc: "Mercedes E-Class · 1-3 pax", price: 65, badge: "Top" },
      { name: "Tour Costiera 8h", desc: "Van premium · Autista · Acqua", price: 380, badge: "Chef" },
      { name: "Disposizione Oraria", desc: "Min 3h · Veicolo executive", price: 55 },
      { name: "Wedding Package", desc: "Auto fiori · Decorazioni · Foto", price: 480, badge: "Hot" },
      { name: "Shuttle Eventi", desc: "Bus 16 posti · Climatizzato", price: 120 },
      { name: "Charter Limousine", desc: "Maybach · Champagne · Red carpet", price: 650 },
    ];
  }
  if (/fitness|palestra|gym|crossfit/.test(s)) {
    return [
      { name: "Personal Training 1:1", desc: "60 min · Coach certificato", price: 65, badge: "Top" },
      { name: "Abbonamento Mensile", desc: "Accesso illimitato · Sauna inclusa", price: 79 },
      { name: "Pacchetto 10 PT", desc: "10 sessioni · Piano nutrizionale", price: 550, badge: "Chef" },
      { name: "Crossfit · Open WOD", desc: "Lezione di gruppo · 60 min", price: 18 },
      { name: "Functional · Bootcamp", desc: "Allenamento outdoor 90 min", price: 25, badge: "Hot" },
      { name: "Body Composition Scan", desc: "Analisi InBody + consulenza", price: 40 },
    ];
  }
  if (/ecommerce|shop|store|fashion|moda|boutique/.test(s)) {
    return [
      { name: "Sneakers Premium", desc: "Edizione limitata · Pelle italiana", price: 280, badge: "Top" },
      { name: "Giacca Sartoriale", desc: "100% lana vergine · Made in Italy", price: 540, badge: "Chef" },
      { name: "Borsa Iconica", desc: "Pelle saffiano · Hardware oro", price: 690, badge: "Hot" },
      { name: "Camicia Lino", desc: "Slim fit · Bottone perlato", price: 95 },
      { name: "Occhiali Aviator", desc: "Lenti polarizzate · Custodia", price: 165 },
      { name: "Fragranza Signature", desc: "Eau de parfum · 100ml", price: 130 },
    ];
  }
  if (/avvocat|legal|notai|commercia/.test(s)) {
    return [
      { name: "Consulenza Legale", desc: "Prima visita · 60 min · Riservato", price: 150, badge: "Top" },
      { name: "Pratica Successione", desc: "Gestione completa · Atto incluso", price: 1200, badge: "Chef" },
      { name: "Contratto Commerciale", desc: "Redazione + revisione · 5 gg", price: 480 },
      { name: "Costituzione SRL", desc: "Atto, statuto, registrazione", price: 1800, badge: "Hot" },
      { name: "Recupero Crediti", desc: "Fee successo · No win no fee", price: 0 },
      { name: "Abbonamento Imprese", desc: "Consulenza mensile illimitata", price: 390 },
    ];
  }
  if (/turism|tour|viagg|escursion/.test(s)) {
    return [
      { name: "Tour Roma Classica", desc: "Colosseo · Vaticano · Skip line", price: 89, badge: "Top" },
      { name: "Wine Experience", desc: "Cantina + degustazione + pranzo", price: 145, badge: "Chef" },
      { name: "Costiera in Barca", desc: "Giornata intera · Pranzo a bordo", price: 220 },
      { name: "Cooking Class", desc: "3h con chef · Mercato + cucina", price: 95, badge: "Hot" },
      { name: "Trekking Etna", desc: "Guida alpina · Pranzo al sacco", price: 75 },
      { name: "Tour Gastronomico", desc: "5 tappe street food · 3h", price: 60 },
    ];
  }
  if (/event|wedding|cerimoni/.test(s)) {
    return [
      { name: "Wedding Planner Full", desc: "Pacchetto completo · 250 ospiti", price: 8900, badge: "Top" },
      { name: "Allestimento Floreale", desc: "Cerimonia + ricevimento", price: 2400, badge: "Chef" },
      { name: "DJ + Service Audio", desc: "8h · Luci · Tecnico dedicato", price: 1200 },
      { name: "Catering Gourmet", desc: "5 portate · Servizio al tavolo", price: 95 },
      { name: "Foto + Video Wedding", desc: "Pacchetto completo · Album", price: 2800, badge: "Hot" },
      { name: "Open Bar Cocktail", desc: "Mixology pro · 4h illimitato", price: 35 },
    ];
  }
  if (/edili|costruz|impresa|impiant|ristruttur/.test(s)) {
    return [
      { name: "Sopralluogo Gratuito", desc: "Tecnico in 24h · Preventivo dettagliato", price: 0, badge: "Top" },
      { name: "Ristrutturazione Bagno", desc: "Chiavi in mano · 2 settimane", price: 6500, badge: "Chef" },
      { name: "Cappotto Termico", desc: "Bonus 65% · Pratica inclusa", price: 12000 },
      { name: "Impianto Fotovoltaico", desc: "6 kW · Accumulo · Detrazione", price: 9800, badge: "Hot" },
      { name: "Tinteggiatura Casa", desc: "Trilocale · Materiali premium", price: 1400 },
      { name: "Manutenzione Annuale", desc: "Caldaia + impianti · 12 mesi", price: 280 },
    ];
  }
  if (/auto|moto|conces/.test(s)) {
    return [
      { name: "Test Drive Gratuito", desc: "Modello a scelta · 30 min", price: 0, badge: "Top" },
      { name: "Tagliando Premium", desc: "Olio · Filtri · Check 30 punti", price: 220 },
      { name: "Cambio Gomme + Bilanc.", desc: "4 pneumatici premium installati", price: 480, badge: "Hot" },
      { name: "Detailing Completo", desc: "Lavaggio + lucidatura + interni", price: 180 },
      { name: "Diagnosi Elettronica", desc: "OBD2 · Lettura centralina", price: 45 },
      { name: "Noleggio LT 36 mesi", desc: "All inclusive · Da 290€/mese", price: 290, badge: "Chef" },
    ];
  }
  if (/scuola|academy|corso|format/.test(s)) {
    return [
      { name: "Corso Base 8 Settimane", desc: "16 lezioni · Materiale incluso", price: 480, badge: "Top" },
      { name: "Masterclass Avanzata", desc: "Weekend intensivo · Certificato", price: 290, badge: "Chef" },
      { name: "Lezione Privata 1:1", desc: "60 min · Online o in sede", price: 55 },
      { name: "Pacchetto 10 Lezioni", desc: "Sconto 15% · Validità 6 mesi", price: 470 },
      { name: "Workshop Open Day", desc: "3h gratuita · Iscrizione richiesta", price: 0, badge: "Hot" },
      { name: "Certificazione Pro", desc: "Esame + diploma riconosciuto", price: 350 },
    ];
  }
  return [
    { name: "Servizio Premium", desc: "Pacchetto base · 60 min", price: 60, badge: "Top" },
    { name: "Consulenza Esperto", desc: "Analisi personalizzata · 90 min", price: 95 },
    { name: "Pacchetto Completo", desc: "Servizio full · Risultati garantiti", price: 180, badge: "Chef" },
    { name: "Abbonamento Mensile", desc: "Accesso illimitato · 30 giorni", price: 99 },
    { name: "Gift Card Empire", desc: "Da 50€ a 500€ · Personalizzabile", price: 50 },
    { name: "Esperienza VIP", desc: "Servizio dedicato · Champagne", price: 250, badge: "Hot" },
  ];
}

// ════════════════════════════════════════════════════════════════════════════
// HOME SCREEN — rich landing with hero, search, categories, featured cards
// ════════════════════════════════════════════════════════════════════════════
function HomeScreen({ theme, name, sector, city }: { theme: ThemeTokens; name: string; sector: string; city: string }) {
  const sLabel = sectorLabel(sector);
  const items = getMenuItems(sector).slice(0, 3);

  return (
    <div className="pb-14 overflow-hidden h-full">
      {/* Header */}
      <div className="px-4 pt-1 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black"
            style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, color: theme.bg, fontFamily: theme.fontHead }}>
            {brandInitials(name)}
          </div>
          <div>
            <p className="text-[7px] uppercase tracking-wider font-semibold" style={{ color: theme.textMuted }}>{city || "Italia"}</p>
            <p className="text-[10px] font-bold leading-none" style={{ color: theme.text, fontFamily: theme.fontHead }}>{name}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${theme.text}10` }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2.5" strokeLinecap="round"><path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 01-6 0"/></svg>
            <span className="absolute mt-[-10px] ml-[10px] w-2 h-2 rounded-full" style={{ background: theme.primary }} />
          </div>
          <div className="w-7 h-7 rounded-full overflow-hidden border" style={{ borderColor: `${theme.primary}40` }}>
            <ArtImage theme={theme} seed={42} className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-2.5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-full" style={{ background: theme.bgPanel }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <span className="text-[8px]" style={{ color: theme.textMuted }}>Cerca {sLabel.toLowerCase()}…</span>
        </div>
      </div>

      {/* Hero */}
      <div className="px-4 mb-2.5">
        <div className="relative rounded-2xl overflow-hidden h-[105px]" style={{ borderRadius: theme.radius }}>
          <ArtImage theme={theme} seed={1} className="absolute inset-0" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 30%, ${theme.bg}ee 100%)` }} />
          <div className="absolute inset-0 p-3 flex flex-col justify-end">
            <span className="self-start px-1.5 py-0.5 rounded text-[7px] font-bold mb-1" style={{ background: theme.primary, color: theme.bg }}>NUOVO</span>
            <p className="text-[12px] font-black leading-tight" style={{ color: "#fff", fontFamily: theme.fontHead }}>Esperienza Signature 2026</p>
            <p className="text-[8px] mt-0.5 opacity-90" style={{ color: "#fff" }}>{sLabel} · {city || "Italia"} · ★ 4.9</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-2.5">
        <div className="flex gap-1.5 overflow-hidden">
          {["Tutti", "Top", "Nuovi", "Promo", "VIP"].map((c, i) => (
            <span key={i} className="text-[8px] px-2.5 py-1 rounded-full font-semibold whitespace-nowrap" style={{
              background: i === 0 ? theme.primary : theme.bgPanel,
              color: i === 0 ? theme.bg : theme.text,
            }}>{c}</span>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div className="px-4 flex items-center justify-between mb-1.5">
        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: theme.text }}>I Più Richiesti</p>
        <p className="text-[7px] font-semibold" style={{ color: theme.primary }}>Vedi tutti →</p>
      </div>
      <div className="px-4 space-y-1.5">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2 p-1.5 rounded-xl" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.7 }}>
            <ArtImage theme={theme} seed={i + 3} className="w-10 h-10 rounded-lg shrink-0" style={{ borderRadius: theme.radius * 0.5 }} />
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold truncate" style={{ color: theme.text }}>{it.name}</p>
              <p className="text-[7px] truncate" style={{ color: theme.textMuted }}>{it.desc}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[7px]" style={{ color: theme.accent }}>★ 4.{8 + i}</span>
                <span className="text-[7px]" style={{ color: theme.textMuted }}>· {120 - i * 23} ordini</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black" style={{ color: theme.primary, fontFamily: theme.fontHead }}>€{it.price}</p>
              {it.badge && <span className="text-[6px] font-bold px-1 py-0.5 rounded" style={{ background: `${theme.accent}25`, color: theme.accent }}>{it.badge}</span>}
            </div>
          </div>
        ))}
      </div>

      <BottomNav theme={theme} active="home" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MENU SCREEN
// ════════════════════════════════════════════════════════════════════════════
function MenuScreen({ theme, sector }: { theme: ThemeTokens; sector: string }) {
  const items = getMenuItems(sector);
  const isFood = /ristor|pizz|sushi|trat|oster|food|cucin|bar|cafe/i.test(sector);
  const cats = isFood ? ["Tutti", "Antipasti", "Primi", "Secondi", "Dolci"] : ["Tutti", "Top", "Nuovi", "VIP", "Pacchetti"];

  return (
    <div className="pb-14 overflow-hidden h-full">
      <div className="px-4 pt-1 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[10px] font-black leading-tight" style={{ color: theme.text, fontFamily: theme.fontHead }}>{isFood ? "Il Nostro Menù" : "I Nostri Servizi"}</p>
            <p className="text-[7px]" style={{ color: theme.textMuted }}>Selezionati con cura · 2026</p>
          </div>
          <div className="flex gap-1">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: theme.bgPanel }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2.5"><path d="M3 6h18M6 12h12M10 18h4"/></svg>
            </div>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: theme.bgPanel }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 overflow-hidden mb-2.5">
          {cats.map((c, i) => (
            <span key={i} className="text-[8px] px-2.5 py-1 rounded-full font-semibold whitespace-nowrap" style={{
              background: i === 0 ? theme.primary : `${theme.text}10`,
              color: i === 0 ? theme.bg : theme.text,
            }}>{c}</span>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-1.5">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2 p-1.5 rounded-xl" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.7 }}>
            <ArtImage theme={theme} seed={i + 7} className="w-11 h-11 shrink-0" style={{ borderRadius: theme.radius * 0.55 }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-[9px] font-bold truncate" style={{ color: theme.text }}>{it.name}</p>
                {it.badge && <span className="text-[6px] font-bold px-1 rounded" style={{ background: theme.primary, color: theme.bg }}>{it.badge}</span>}
              </div>
              <p className="text-[7px] leading-tight mt-0.5" style={{ color: theme.textMuted }}>{it.desc}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[6px]" style={{ color: theme.accent }}>★ 4.{7 + (i % 3)}</span>
                <span className="text-[6px]" style={{ color: theme.textMuted }}>· {12 + i * 4} min</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="text-[10px] font-black" style={{ color: theme.primary, fontFamily: theme.fontHead }}>€{it.price}</p>
              <button className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: theme.primary, color: theme.bg }}>+</button>
            </div>
          </div>
        ))}
      </div>

      <BottomNav theme={theme} active="menu" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// BOOKING SCREEN
// ════════════════════════════════════════════════════════════════════════════
function BookingScreen({ theme, sector }: { theme: ThemeTokens; sector: string }) {
  const isService = /spa|wellness|beauty|estetic|parruc|medic|dent|fitness/i.test(sector);
  return (
    <div className="pb-14 overflow-hidden h-full">
      <div className="px-4 pt-1 pb-2">
        <p className="text-[10px] font-black leading-tight" style={{ color: theme.text, fontFamily: theme.fontHead }}>{isService ? "Prenota un Trattamento" : "Prenota un Tavolo"}</p>
        <p className="text-[7px]" style={{ color: theme.textMuted }}>Conferma immediata via SMS · WhatsApp</p>
      </div>

      {/* Date picker */}
      <div className="px-4 mb-2">
        <p className="text-[7px] font-bold mb-1 uppercase tracking-wider" style={{ color: theme.textMuted }}>Data</p>
        <div className="rounded-xl p-2.5" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.8 }}>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[9px] font-bold" style={{ color: theme.text }}>Aprile 2026</p>
            <div className="flex gap-1">
              <button className="w-4 h-4 rounded-full flex items-center justify-center text-[8px]" style={{ background: `${theme.text}10`, color: theme.text }}>‹</button>
              <button className="w-4 h-4 rounded-full flex items-center justify-center text-[8px]" style={{ background: `${theme.text}10`, color: theme.text }}>›</button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {["L","M","M","G","V","S","D"].map((d, i) => (
              <p key={i} className="text-[6px] text-center font-semibold" style={{ color: theme.textMuted }}>{d}</p>
            ))}
            {Array.from({ length: 14 }).map((_, i) => {
              const day = 18 + i;
              const isSel = i === 4;
              const isDisabled = i === 1 || i === 8;
              return (
                <div key={i} className="aspect-square flex items-center justify-center rounded-md text-[8px] font-bold" style={{
                  background: isSel ? theme.primary : "transparent",
                  color: isSel ? theme.bg : (isDisabled ? `${theme.text}30` : theme.text),
                }}>
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Time */}
      <div className="px-4 mb-2">
        <p className="text-[7px] font-bold mb-1 uppercase tracking-wider" style={{ color: theme.textMuted }}>Orario disponibile</p>
        <div className="grid grid-cols-4 gap-1">
          {["12:30","13:00","13:30","14:00","19:30","20:00","20:30","21:00"].map((t, i) => (
            <span key={i} className="text-[8px] py-1.5 text-center rounded-md font-semibold" style={{
              background: i === 5 ? theme.primary : `${theme.text}10`,
              color: i === 5 ? theme.bg : theme.text,
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Guests */}
      <div className="px-4 mb-2">
        <div className="rounded-xl p-2.5 flex items-center justify-between" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.8 }}>
          <div>
            <p className="text-[7px] font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>{isService ? "Persone" : "Ospiti"}</p>
            <p className="text-[12px] font-black" style={{ color: theme.text, fontFamily: theme.fontHead }}>4 persone</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="w-6 h-6 rounded-full text-[12px] font-bold flex items-center justify-center" style={{ background: `${theme.primary}20`, color: theme.text }}>−</button>
            <span className="text-[10px] font-bold w-3 text-center" style={{ color: theme.text }}>4</span>
            <button className="w-6 h-6 rounded-full text-[12px] font-bold flex items-center justify-center" style={{ background: theme.primary, color: theme.bg }}>+</button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4">
        <button className="w-full py-2.5 rounded-xl text-[10px] font-bold" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, color: theme.bg, borderRadius: theme.radius * 0.8 }}>
          Conferma · Ven 22 alle 20:00
        </button>
        <p className="text-[7px] text-center mt-1" style={{ color: theme.textMuted }}>Cancellazione gratuita fino a 4h prima</p>
      </div>

      <BottomNav theme={theme} active="booking" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PROFILE SCREEN
// ════════════════════════════════════════════════════════════════════════════
function ProfileScreen({ theme, name }: { theme: ThemeTokens; name: string }) {
  return (
    <div className="pb-14 overflow-hidden h-full">
      {/* Cover */}
      <div className="relative h-[60px] mb-7" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}>
        <ArtImage theme={theme} seed={11} className="absolute inset-0 opacity-50" />
        <div className="absolute -bottom-7 left-4 w-14 h-14 rounded-full border-[3px] flex items-center justify-center text-[14px] font-black"
          style={{ borderColor: theme.bg, background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`, color: theme.bg, fontFamily: theme.fontHead }}>
          MR
        </div>
        <button className="absolute top-2 right-2 px-2 py-1 rounded-full text-[7px] font-bold" style={{ background: `${theme.bg}aa`, color: theme.text, backdropFilter: "blur(8px)" }}>Modifica</button>
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black" style={{ color: theme.text, fontFamily: theme.fontHead }}>Marco Rossi</p>
            <p className="text-[7px]" style={{ color: theme.textMuted }}>marco.rossi@empire.com · Membro Gold dal 2024</p>
          </div>
          <span className="text-[6px] font-bold px-1.5 py-0.5 rounded" style={{ background: theme.primary, color: theme.bg }}>VIP</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-1.5 mt-2.5 mb-2.5">
          {[{ v: "12", l: "Visite" }, { v: "240", l: "Punti" }, { v: "4.9★", l: "Rating" }].map((s, i) => (
            <div key={i} className="text-center rounded-xl py-2" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.7 }}>
              <p className="text-[12px] font-black" style={{ color: theme.primary, fontFamily: theme.fontHead }}>{s.v}</p>
              <p className="text-[7px] font-semibold" style={{ color: theme.textMuted }}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* Loyalty card */}
        <div className="rounded-xl p-2.5 mb-2.5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, borderRadius: theme.radius * 0.8 }}>
          <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-20" style={{ background: "white" }} />
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[7px] font-black uppercase tracking-wider" style={{ color: theme.bg }}>Fedeltà Empire Gold</p>
              <p className="text-[7px] font-bold" style={{ color: theme.bg }}>★★★★★</p>
            </div>
            <p className="text-[12px] font-black" style={{ color: theme.bg, fontFamily: theme.fontHead }}>240 / 300 punti</p>
            <div className="h-1 rounded-full bg-black/20 mt-1.5">
              <div className="h-1 rounded-full bg-white" style={{ width: "80%" }} />
            </div>
            <p className="text-[7px] mt-1 opacity-90" style={{ color: theme.bg }}>60 punti per la tua prossima cena gratis 🎁</p>
          </div>
        </div>

        {/* Menu list */}
        <div className="rounded-xl overflow-hidden" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.7 }}>
          {[
            { icon: "M3 5h18v16H3zM3 10h18", label: "Le mie prenotazioni", count: "3" },
            { icon: "M12 21l-1.5-1.4C5 15 2 12.3 2 9a5 5 0 019-3 5 5 0 019 3c0 3.3-3 6-8.5 10.6L12 21z", label: "Preferiti", count: "12" },
            { icon: "M21 11.5a8.4 8.4 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7A8.4 8.4 0 018 19l-5 1 1-5a8.4 8.4 0 01-1-4 8.5 8.5 0 014.7-7.6A8.4 8.4 0 0111.5 3h.5a8.5 8.5 0 018 8v.5z", label: "Recensioni", count: "8" },
          ].map((it, i, arr) => (
            <div key={i} className="flex items-center gap-2 p-2" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${theme.text}08` : "none" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={it.icon} /></svg>
              <p className="text-[9px] flex-1 font-semibold" style={{ color: theme.text }}>{it.label}</p>
              <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${theme.primary}20`, color: theme.primary }}>{it.count}</span>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2.5"><path d="M9 6l6 6-6 6"/></svg>
            </div>
          ))}
        </div>

        <p className="text-[6px] text-center mt-2 font-bold" style={{ color: theme.textMuted, fontFamily: theme.fontHead }}>{name}</p>
      </div>

      <BottomNav theme={theme} active="profile" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// GALLERY SCREEN
// ════════════════════════════════════════════════════════════════════════════
function GalleryScreen({ theme, name }: { theme: ThemeTokens; name: string }) {
  return (
    <div className="pb-14 overflow-hidden h-full">
      <div className="px-4 pt-1 pb-2 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black leading-tight" style={{ color: theme.text, fontFamily: theme.fontHead }}>Galleria</p>
          <p className="text-[7px]" style={{ color: theme.textMuted }}>{name} · 248 foto</p>
        </div>
        <div className="flex gap-1">
          {["Tutti", "Cibo", "Locale"].map((c, i) => (
            <span key={c} className="text-[7px] px-1.5 py-0.5 rounded-full font-bold" style={{
              background: i === 0 ? theme.primary : `${theme.text}10`,
              color: i === 0 ? theme.bg : theme.text,
            }}>{c}</span>
          ))}
        </div>
      </div>

      {/* Featured big */}
      <div className="px-4 mb-1.5">
        <div className="relative rounded-xl overflow-hidden h-[80px]" style={{ borderRadius: theme.radius * 0.8 }}>
          <ArtImage theme={theme} seed={20} className="absolute inset-0" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 50%, ${theme.bg}cc 100%)` }} />
          <div className="absolute bottom-1.5 left-2">
            <p className="text-[9px] font-black" style={{ color: "#fff", fontFamily: theme.fontHead }}>Storia in immagini</p>
            <p className="text-[7px] opacity-80" style={{ color: "#fff" }}>★ 4.9 · 1.2k likes</p>
          </div>
          <span className="absolute top-1.5 right-1.5 text-[6px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${theme.bg}cc`, color: theme.text }}>FEATURED</span>
        </div>
      </div>

      {/* Masonry-ish grid */}
      <div className="px-4 grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="relative aspect-square overflow-hidden" style={{ borderRadius: theme.radius * 0.5 }}>
            <ArtImage theme={theme} seed={30 + i} className="w-full h-full" />
            {i === 2 && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><p className="text-[10px] font-bold text-white">+24</p></div>}
            {i === 5 && <div className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full flex items-center justify-center" style={{ background: theme.primary }}><svg width="6" height="6" viewBox="0 0 24 24" fill={theme.bg}><path d="M8 5v14l11-7z"/></svg></div>}
          </div>
        ))}
      </div>

      <BottomNav theme={theme} active="home" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CHECKOUT SCREEN
// ════════════════════════════════════════════════════════════════════════════
function CheckoutScreen({ theme, sector }: { theme: ThemeTokens; sector: string }) {
  const items = getMenuItems(sector).slice(0, 3);
  const subtotal = items.reduce((s, x) => s + x.price, 0);
  const fee = 2.5;
  const total = subtotal + fee;

  return (
    <div className="pb-14 overflow-hidden h-full">
      <div className="px-4 pt-1 pb-2">
        <div className="flex items-center gap-2">
          <button className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: theme.bgPanel }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div>
            <p className="text-[10px] font-black leading-tight" style={{ color: theme.text, fontFamily: theme.fontHead }}>Riepilogo Ordine</p>
            <p className="text-[7px]" style={{ color: theme.textMuted }}>3 articoli · Pronto in 25 min</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="px-4 mb-2">
        <div className="rounded-xl p-2 space-y-1.5" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.7 }}>
          {items.map((it, i) => (
            <div key={i} className="flex items-center gap-2">
              <ArtImage theme={theme} seed={i + 50} className="w-8 h-8 shrink-0" style={{ borderRadius: theme.radius * 0.4 }} />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold truncate" style={{ color: theme.text }}>{it.name}</p>
                <p className="text-[7px]" style={{ color: theme.textMuted }}>x1 · {it.desc.split("·")[0]}</p>
              </div>
              <p className="text-[9px] font-black" style={{ color: theme.text, fontFamily: theme.fontHead }}>€{it.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Promo */}
      <div className="px-4 mb-2">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border-2 border-dashed" style={{ borderColor: `${theme.primary}50` }}>
          <span className="text-[10px]">🎁</span>
          <div className="flex-1">
            <p className="text-[8px] font-bold" style={{ color: theme.primary }}>EMPIRE10 applicato</p>
            <p className="text-[6px]" style={{ color: theme.textMuted }}>Sconto del 10% sul totale</p>
          </div>
          <span className="text-[8px] font-bold" style={{ color: theme.primary }}>−€{(subtotal * 0.1).toFixed(2)}</span>
        </div>
      </div>

      {/* Totals */}
      <div className="px-4 mb-2 space-y-1">
        <div className="flex justify-between text-[8px]" style={{ color: theme.textMuted }}>
          <span>Subtotale</span><span>€{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[8px]" style={{ color: theme.textMuted }}>
          <span>Servizio</span><span>€{fee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-1.5 border-t" style={{ borderColor: `${theme.text}15` }}>
          <span className="text-[10px] font-black" style={{ color: theme.text, fontFamily: theme.fontHead }}>Totale</span>
          <span className="text-[12px] font-black" style={{ color: theme.primary, fontFamily: theme.fontHead }}>€{(total * 0.9).toFixed(2)}</span>
        </div>
      </div>

      {/* Payment */}
      <div className="px-4 mb-2">
        <div className="rounded-xl p-2 flex items-center gap-2" style={{ background: theme.bgPanel, borderRadius: theme.radius * 0.7 }}>
          <div className="w-7 h-5 rounded flex items-center justify-center text-[7px] font-black" style={{ background: "#1A1F71", color: "#fff" }}>VISA</div>
          <div className="flex-1">
            <p className="text-[8px] font-bold" style={{ color: theme.text }}>•••• •••• •••• 4242</p>
            <p className="text-[6px]" style={{ color: theme.textMuted }}>Apple Pay · scade 12/27</p>
          </div>
          <p className="text-[7px] font-bold" style={{ color: theme.primary }}>Cambia</p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4">
        <button className="w-full py-2.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, color: theme.bg, borderRadius: theme.radius * 0.8 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.7 2 6 4.7 6 8v3H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2v-8a2 2 0 00-2-2h-1V8c0-3.3-2.7-6-6-6zm0 2a4 4 0 014 4v3H8V8a4 4 0 014-4z"/></svg>
          Paga €{(total * 0.9).toFixed(2)}
        </button>
        <p className="text-[7px] text-center mt-1" style={{ color: theme.textMuted }}>Pagamento sicuro · SSL crittografato</p>
      </div>

      <BottomNav theme={theme} active="menu" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Main export
// ════════════════════════════════════════════════════════════════════════════
export function MockupReactScreen({
  type, templateVariant, businessName, businessSector = "", businessCity = "", primaryColor, width, height,
}: Props) {
  const theme = getTheme(templateVariant, primaryColor);

  const renderContent = () => {
    switch (type) {
      case "menu":
      case "catalog":
      case "listing":
      case "services":
      case "portfolio":
        return <MenuScreen theme={theme} sector={businessSector} />;
      case "booking":
      case "contact":
        return <BookingScreen theme={theme} sector={businessSector} />;
      case "profile":
      case "dashboard":
      case "stats":
        return <ProfileScreen theme={theme} name={businessName} />;
      case "gallery":
      case "map":
      case "chat":
        return <GalleryScreen theme={theme} name={businessName} />;
      case "checkout":
        return <CheckoutScreen theme={theme} sector={businessSector} />;
      case "home":
      default:
        return <HomeScreen theme={theme} name={businessName} sector={businessSector} city={businessCity} />;
    }
  };

  return (
    <div
      className="relative overflow-hidden flex flex-col"
      style={{ width, height, background: theme.bg, fontFamily: theme.fontBody }}
    >
      <StatusBar theme={theme} />
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}
