import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MockupLightbox } from "@/components/ui/mockup-lightbox";
import { X, ChevronRight, ChevronLeft, Eye, ArrowLeft, Smartphone, Monitor } from "lucide-react";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

interface ScreenItem {
  url: string;
  label: string;
  type: "mobile" | "desktop";
}

interface PortfolioItem {
  name: string;
  description: string;
  category: string;
  subCategory: string;
  accent: string;
  client: string;
  year: string;
  platform: string;
  screens: ScreenItem[];
}

const m = (folder: string, file: string, label: string): ScreenItem => ({
  url: `${S}/${encodeURIComponent(folder)}/${file}`,
  label,
  type: "mobile",
});
const d = (folder: string, file: string, label: string): ScreenItem => ({
  url: `${S}/${encodeURIComponent(folder)}/${file}`,
  label,
  type: "desktop",
});

const PORTFOLIO: PortfolioItem[] = [
  {
    name: "COTE Miami", description: "Michelin-starred Korean steakhouse — 6 luxury design styles fusing Korean BBQ with Miami aesthetics.",
    category: "food", subCategory: "Korean Steakhouse", accent: "#c87533", client: "COTE Miami", year: "2025", platform: "iOS / Web",
    screens: [
      m("COTE Miami", "a-obsidian-mobile-home.png", "Obsidian — Home"),
      m("COTE Miami", "a-obsidian-mobile-menu.png", "Obsidian — Menu"),
      m("COTE Miami", "a-obsidian-mobile-detail.png", "Obsidian — Detail"),
    ],
  },
  {
    name: "Paperfish Sushi", description: "Contemporary Japanese & Nikkei sushi — 12 unique visual styles from sakura to luxury marble.",
    category: "food", subCategory: "Sushi", accent: "#e8a0bf", client: "Paperfish Sushi", year: "2025", platform: "iOS / Web",
    screens: [
      m("Paperfish Sushi", "a-sakura-home.png", "Sakura — Home"),
      m("Paperfish Sushi", "a-sakura-menu.png", "Sakura — Menu"),
      m("Paperfish Sushi", "a-sakura-detail.png", "Sakura — Detail"),
    ],
  },
  {
    name: "Flame Kebab", description: "Premium kebab chain — vibrant food ordering with real-time tracking and customization.",
    category: "food", subCategory: "Kebab", accent: "#e85d04", client: "Flame Kebab", year: "2025", platform: "iOS / Android",
    screens: [
      m("flame-kebab", "bd5def39-e58c-46db-92f9-19d48e0da2ea.png", "Home"),
      m("flame-kebab", "c31559c3-67cf-4f62-b4e7-74833046eda7.png", "Menu"),
      m("flame-kebab", "730290ed-5bf6-485f-b999-b75602a57d11.png", "Detail"),
    ],
  },
  {
    name: "La Vang Vietnamese", description: "Beverly Hills luxury Vietnamese — 8 stili mobile + 4 desktop, from Noir Saigon to Obsidian Gold.",
    category: "food", subCategory: "Vietnamese", accent: "#c9a84c", client: "La Vang Vietnamese", year: "2025", platform: "iOS / Web",
    screens: [
      m("La Vang Vietnamese Luxury", "a-noir-saigon-home.png", "Noir Saigon — Home"),
      m("La Vang Vietnamese Luxury", "a-noir-saigon-menu.png", "Noir Saigon — Menu"),
      m("La Vang Vietnamese Luxury", "a-noir-saigon-detail.png", "Noir Saigon — Detail"),
    ],
  },
  {
    name: "Neo Nails Brickell", description: "Premium nail salon with frosted glass design — glassmorphism, Apple Vision Pro aesthetic.",
    category: "App Design", subCategory: "Nails", accent: "#c084fc", client: "Neo Nails Brickell", year: "2025", platform: "iOS / Web",
    screens: [
      m("Neo Nails Brickell", "frosted-glass-home.png", "Frosted Glass — Home"),
      m("Neo Nails Brickell", "frosted-glass-servizi.png", "Frosted Glass — Servizi"),
      m("Neo Nails Brickell", "frosted-glass-dettaglio.png", "Frosted Glass — Dettaglio"),
    ],
  },
  {
    name: "Asinara Charter", description: "Luxury charter booking for Sardinia — deep azure + warm gold, Costa Smeralda aesthetic.",
    category: "App Design", subCategory: "Mediterranean Luxury", accent: "#2563eb", client: "Asinara Charter", year: "2025", platform: "iOS / Web",
    screens: [
      m("Asinara Charter - Sardinia Azure Luxury", "home.png", "Azure — Home"),
      m("Asinara Charter - Sardinia Azure Luxury", "escursioni.png", "Azure — Escursioni"),
      m("Asinara Charter - Sardinia Azure Luxury", "dettaglio-tour.png", "Azure — Dettaglio Tour"),
    ],
  },
  {
    name: "City Padel Milano", description: "Webapp iOS 18-style per campo da padel premium a Milano CityLife. Sistema di prenotazione campi, profili maestri, corsi e lezioni.",
    category: "App Design", subCategory: "UI/UX", accent: "#22c55e", client: "City Padel Milano", year: "2026", platform: "iOS / Web",
    screens: [
      m("City Padel Milano", "mobile-fresh-azzurro-home.png", "Fresh Azzurro — Home"),
      m("City Padel Milano", "mobile-fresh-azzurro-prenota.png", "Fresh Azzurro — Prenota Campo"),
      m("City Padel Milano", "mobile-fresh-azzurro-maestri.png", "Fresh Azzurro — Maestri & Lezioni"),
      m("City Padel Milano", "mobile-fresh-azzurro-dettaglio.png", "Fresh Azzurro — Dettaglio Corso"),
      m("City Padel Milano", "mobile-sage-luxe-home.png", "Sage Luxe — Home"),
      m("City Padel Milano", "mobile-sage-luxe-prenota.png", "Sage Luxe — Prenota Campo"),
      m("City Padel Milano", "mobile-sage-luxe-maestri.png", "Sage Luxe — Maestri & Lezioni"),
      m("City Padel Milano", "mobile-sage-luxe-dettaglio.png", "Sage Luxe — Dettaglio Corso"),
      m("City Padel Milano", "mobile-urban-concrete-home.png", "Urban Concrete — Home"),
      m("City Padel Milano", "mobile-urban-concrete-prenota.png", "Urban Concrete — Prenota Campo"),
      m("City Padel Milano", "mobile-urban-concrete-maestri.png", "Urban Concrete — Maestri & Lezioni"),
      m("City Padel Milano", "mobile-urban-concrete-dettaglio.png", "Urban Concrete — Dettaglio Corso"),
      m("City Padel Milano", "mobile-citylife-green-home.png", "CityLife Green — Home"),
      m("City Padel Milano", "mobile-citylife-green-prenota.png", "CityLife Green — Prenota Campo"),
      m("City Padel Milano", "mobile-citylife-green-maestri.png", "CityLife Green — Maestri & Lezioni"),
      m("City Padel Milano", "mobile-citylife-green-dettaglio.png", "CityLife Green — Dettaglio Corso"),
      m("City Padel Milano", "mobile-lime-minimal-home.png", "Lime Minimal — Home"),
      m("City Padel Milano", "mobile-lime-minimal-prenota.png", "Lime Minimal — Prenota Campo"),
      m("City Padel Milano", "mobile-lime-minimal-maestri.png", "Lime Minimal — Maestri & Lezioni"),
      m("City Padel Milano", "mobile-lime-minimal-dettaglio.png", "Lime Minimal — Dettaglio Corso"),
      d("City Padel Milano", "desktop-fresh-azzurro-home.png", "Fresh Azzurro — Home"),
      d("City Padel Milano", "desktop-fresh-azzurro-prenota.png", "Fresh Azzurro — Prenota Campo"),
      d("City Padel Milano", "desktop-fresh-azzurro-maestri.png", "Fresh Azzurro — Maestri & Lezioni"),
      d("City Padel Milano", "desktop-fresh-azzurro-dettaglio.png", "Fresh Azzurro — Dettaglio Corso"),
      d("City Padel Milano", "desktop-sage-luxe-home.png", "Sage Luxe — Home"),
      d("City Padel Milano", "desktop-sage-luxe-prenota.png", "Sage Luxe — Prenota Campo"),
      d("City Padel Milano", "desktop-sage-luxe-maestri.png", "Sage Luxe — Maestri & Lezioni"),
      d("City Padel Milano", "desktop-sage-luxe-dettaglio.png", "Sage Luxe — Dettaglio Corso"),
      d("City Padel Milano", "desktop-urban-concrete-home.png", "Urban Concrete — Home"),
      d("City Padel Milano", "desktop-urban-concrete-prenota.png", "Urban Concrete — Prenota Campo"),
      d("City Padel Milano", "desktop-urban-concrete-maestri.png", "Urban Concrete — Maestri & Lezioni"),
      d("City Padel Milano", "desktop-urban-concrete-dettaglio.png", "Urban Concrete — Dettaglio Corso"),
      d("City Padel Milano", "desktop-citylife-green-home.png", "CityLife Green — Home"),
      d("City Padel Milano", "desktop-citylife-green-prenota.png", "CityLife Green — Prenota Campo"),
      d("City Padel Milano", "desktop-citylife-green-maestri.png", "CityLife Green — Maestri & Lezioni"),
      d("City Padel Milano", "desktop-citylife-green-dettaglio.png", "CityLife Green — Dettaglio Corso"),
      d("City Padel Milano", "desktop-lime-minimal-home.png", "Lime Minimal — Home"),
      d("City Padel Milano", "desktop-lime-minimal-prenota.png", "Lime Minimal — Prenota Campo"),
      d("City Padel Milano", "desktop-lime-minimal-maestri.png", "Lime Minimal — Maestri & Lezioni"),
      d("City Padel Milano", "desktop-lime-minimal-dettaglio.png", "Lime Minimal — Dettaglio Corso"),
    ],
  },
  {
    name: "Miami Boats Rental", description: "Luxury yacht & boat rental — 80+ boats, 5 design styles from Miami Sunset to Ice Turquoise.",
    category: "App Design", subCategory: "Boat Rental", accent: "#0ea5e9", client: "Miami Boats Rental", year: "2025", platform: "iOS / Web",
    screens: [
      m("Miami Boats Rental", "A-mobile-home.png", "Sunset — Home"),
      m("Miami Boats Rental", "A-mobile-fleet.png", "Sunset — Fleet"),
      m("Miami Boats Rental", "A-mobile-yacht-detail.png", "Sunset — Yacht Detail"),
    ],
  },
  {
    name: "Batey Cevicheria", description: "Peruvian cevicheria in Milan — 4 styles: Costa del Pacifico, Casa Nostra, Bianco & Memoria.",
    category: "food", subCategory: "Peruvian", accent: "#38bdf8", client: "Batey Cevicheria", year: "2025", platform: "iOS / Web",
    screens: [
      m("Batey Cevicheria Urbana", "costa-pacifico-mobile-home.png", "Costa del Pacifico — Home"),
      m("Batey Cevicheria Urbana", "costa-pacifico-mobile-menu.png", "Costa del Pacifico — Menu"),
      m("Batey Cevicheria Urbana", "costa-pacifico-mobile-detail.png", "Costa del Pacifico — Detail"),
    ],
  },
  {
    name: "Aura Milano Spa", description: "Luxury spa wellness — 4 stili x 4 schermate x 2 versioni. 32 mockup premium.",
    category: "App Design", subCategory: "Wellness", accent: "#a78bfa", client: "Aura Milano Spa", year: "2025", platform: "iOS / Web",
    screens: [
      m("Aura Milano Spa", "mobile-luce-pura-home.png", "Luce Pura — Home"),
      m("Aura Milano Spa", "mobile-luce-pura-trattamenti.png", "Luce Pura — Trattamenti"),
      m("Aura Milano Spa", "mobile-luce-pura-dettaglio.png", "Luce Pura — Dettaglio"),
    ],
  },
  {
    name: "Little Diamond Nursery", description: "Premium nursery app for Dubai — playful, vivace e child-friendly con qualità premium.",
    category: "education", subCategory: "Nursery", accent: "#facc15", client: "Little Diamond Nursery", year: "2025", platform: "iOS",
    screens: [
      m("Little Diamond Nursery - Playful Colorful", "home.png", "Playful — Home"),
      m("Little Diamond Nursery - Playful Colorful", "programs-activities.png", "Playful — Programs"),
      m("Little Diamond Nursery - Playful Colorful", "team-tour.png", "Playful — Team Tour"),
    ],
  },
  {
    name: "Ashley's Playhouse", description: "Drop-in childcare Austin TX — iOS 18 design with 4 autumn-themed styles.",
    category: "App Design", subCategory: "Childcare", accent: "#f97316", client: "Ashley's Playhouse", year: "2025", platform: "iOS",
    screens: [
      m("Ashley's Playhouse", "stile-a-home.png", "Style A — Home"),
      m("Ashley's Playhouse", "stile-a-programs.png", "Style A — Programs"),
      m("Ashley's Playhouse", "stile-a-book.png", "Style A — Booking"),
    ],
  },
  {
    name: "Nick's Plumbing & AC", description: "Home services booking app — Houston TX. Clean White + Green and Dark Premium Amber.",
    category: "App Design", subCategory: "Home Services", accent: "#22c55e", client: "Nick's Plumbing", year: "2025", platform: "iOS / Web",
    screens: [
      m("Nick's Plumbing & AC", "stile-a-home.png", "Clean White — Home"),
      m("Nick's Plumbing & AC", "stile-a-services.png", "Clean White — Services"),
      m("Nick's Plumbing & AC", "stile-a-detail.png", "Clean White — Detail"),
    ],
  },
  {
    name: "DIMORA Milano", description: "App immobiliare premium — 6 proposte di stile da Eleganza Milanese a Bianco Puro.",
    category: "App Design", subCategory: "Real Estate", accent: "#64748b", client: "DIMORA Milano", year: "2025", platform: "iOS / Web",
    screens: [
      m("DIMORA Milano", "eleganza-milanese-home-mobile.png", "Eleganza Milanese — Home"),
      m("DIMORA Milano", "eleganza-milanese-annunci-mobile.png", "Eleganza Milanese — Annunci"),
      m("DIMORA Milano", "eleganza-milanese-dettaglio-mobile.png", "Eleganza Milanese — Dettaglio"),
    ],
  },
  {
    name: "Tatush Hair Fragrance", description: "Premium hair fragrance brand — Fresh Minimal Blanc: bianco puro, rosa cipria, rose gold.",
    category: "E-Commerce", subCategory: "Beauty", accent: "#f9a8d4", client: "Tatush", year: "2025", platform: "Web",
    screens: [
      m("Tatush Hair Fragrance", "mobile-home.png", "Blanc — Home"),
      m("Tatush Hair Fragrance", "mobile-shop.png", "Blanc — Shop"),
      m("Tatush Hair Fragrance", "mobile-detail.png", "Blanc — Detail"),
    ],
  },
  {
    name: "Miami Watersports", description: "Jet ski, parasailing, flyboard — 4 design styles from Tropical Energy to Miami Riviera Luxe.",
    category: "App Design", subCategory: "Watersports", accent: "#06b6d4", client: "Miami Watersports", year: "2025", platform: "iOS / Web",
    screens: [
      m("Miami Watersports", "style-a-mobile-home.png", "Tropical Energy — Home"),
      m("Miami Watersports", "style-a-mobile-activities.png", "Tropical Energy — Activities"),
      m("Miami Watersports", "style-a-mobile-detail.png", "Tropical Energy — Detail"),
    ],
  },
  {
    name: "Aloha Pet Resorts", description: "Premium pet care booking — live camera feeds, pet profiles, resort management.",
    category: "lifestyle", subCategory: "Pet Care", accent: "#f472b6", client: "Aloha Pet Resorts", year: "2025", platform: "iOS",
    screens: [
      m("Aloha Pet Resorts", "mobile-a-home.png", "Style A — Home"),
      m("Aloha Pet Resorts", "mobile-a-services.png", "Style A — Services"),
      m("Aloha Pet Resorts", "mobile-a-detail.png", "Style A — Detail"),
    ],
  },
  {
    name: "FAR Medical Solutions", description: "Medical devices webapp — 4 stili light mode premium: Ethereal Glass, Azure Gradient Flow.",
    category: "App Design", subCategory: "Medical", accent: "#60a5fa", client: "FAR Medical", year: "2025", platform: "Web",
    screens: [
      m("FAR Medical Solutions", "a-ethereal-glass-mobile-home.png", "Ethereal Glass — Home"),
      m("FAR Medical Solutions", "a-ethereal-glass-mobile-servizi.png", "Ethereal Glass — Servizi"),
      m("FAR Medical Solutions", "a-ethereal-glass-mobile-prodotti.png", "Ethereal Glass — Prodotti"),
    ],
  },
];

const CATEGORIES = ["All", "food", "App Design", "E-Commerce", "lifestyle", "education"];
const CATEGORY_LABELS: Record<string, string> = {
  All: "All", food: "Food", "App Design": "App Design", "E-Commerce": "E-Commerce",
  lifestyle: "Lifestyle", education: "Education",
};

/* ─────────── PhoneMockup ─────────── */
function PhoneMockup({ src, alt, accent, size = "sm" }: { src: string; alt: string; accent: string; size?: "sm" | "md" | "lg" }) {
  const w = size === "lg" ? "w-[160px] sm:w-[200px]" : size === "md" ? "w-[120px] sm:w-[155px]" : "w-[100px] sm:w-[120px]";
  const r = size === "lg" ? "rounded-[24px] sm:rounded-[30px]" : size === "md" ? "rounded-[20px] sm:rounded-[24px]" : "rounded-[18px] sm:rounded-[22px]";
  const ir = size === "lg" ? "rounded-[22px] sm:rounded-[28px]" : size === "md" ? "rounded-[18px] sm:rounded-[22px]" : "rounded-[16px] sm:rounded-[20px]";
  return (
    <div className={`relative ${w} aspect-[9/19.5] ${r} border-[2px] overflow-hidden flex-shrink-0`}
      style={{ borderColor: `color-mix(in srgb, ${accent} 28%, transparent)`, background: "hsl(240 20% 4%)",
        boxShadow: `0 12px 40px hsl(0 0% 0% / 0.5), 0 0 20px color-mix(in srgb, ${accent} 8%, transparent)` }}>
      <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[34%] max-w-[40px] h-[9px] bg-black rounded-full z-20"
        style={{ boxShadow: "0 0 0 1px hsl(0 0% 100% / 0.05)" }} />
      <div className={`absolute inset-[2px] ${ir} overflow-hidden`}>
        <img src={src} alt={alt} className="w-full h-full object-cover object-top" loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.15"; }} />
      </div>
      <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[28%] h-[3px] bg-white/15 rounded-full z-20" />
    </div>
  );
}

/* ─────────── DesktopMockup ─────────── */
function DesktopMockup({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-white/8"
      style={{ background: "hsl(240 20% 4%)", boxShadow: "0 12px 40px hsl(0 0% 0% / 0.4)" }}>
      <img src={src} alt={alt} className="w-full h-full object-cover object-top" loading="lazy"
        onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.15"; }} />
    </div>
  );
}

/* ─────────── Lowengeld-Style Detail Page ─────────── */
function ProjectDetailPage({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  const [screenFilter, setScreenFilter] = useState<"all" | "mobile" | "desktop">("all");
  const hasMobile = item.screens.some((s) => s.type === "mobile");
  const hasDesktop = item.screens.some((s) => s.type === "desktop");

  const filteredScreens = useMemo(() => {
    if (screenFilter === "all") return item.screens;
    return item.screens.filter((s) => s.type === screenFilter);
  }, [item.screens, screenFilter]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const heroScreen = item.screens.find((s) => s.type === "mobile") || item.screens[0];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: "hsl(228 22% 6%)" }}
    >
      {/* Top bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4"
        style={{ background: "hsl(228 22% 6% / 0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid hsl(0 0% 100% / 0.06)" }}>
        <button onClick={onClose}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[0.7rem] font-heading font-semibold text-white/50 hover:text-white transition-colors"
          style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.08)" }}>
          <ArrowLeft className="w-3.5 h-3.5" /> Portfolio
        </button>
        <span className="text-[0.75rem] font-heading font-bold text-white/70">{item.name}</span>
        <button onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Section — Lowengeld Style */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 pt-8 pb-12">
        {/* Filter Tabs */}
        {(hasMobile && hasDesktop) && (
          <div className="inline-flex items-center rounded-xl overflow-hidden mb-8"
            style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.06)" }}>
            {(["all", "mobile", "desktop"] as const).map((f) => (
              <button key={f} onClick={() => setScreenFilter(f)}
                className={`px-5 py-2.5 text-[0.7rem] font-heading font-semibold tracking-wider capitalize transition-all ${
                  screenFilter === f ? "bg-white/10 text-white" : "text-white/35 hover:text-white/55"
                }`}>
                {f === "all" ? "All" : f === "mobile" ? "Mobile" : "Desktop"}
              </button>
            ))}
          </div>
        )}

        {/* Hero Card */}
        <div className="relative rounded-3xl overflow-hidden mb-12 flex flex-col lg:flex-row"
          style={{ background: "hsl(228 20% 10%)", border: "1px solid hsl(0 0% 100% / 0.06)" }}>
          {/* Left: Info */}
          <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-[0.6rem] px-3 py-1.5 rounded-full font-bold tracking-wider uppercase flex items-center gap-1.5"
                style={{ background: `color-mix(in srgb, ${item.accent} 14%, transparent)`, color: item.accent, border: `1px solid color-mix(in srgb, ${item.accent} 22%, transparent)` }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: item.accent }} />
                {item.category}
              </span>
              <span className="text-[0.6rem] px-3 py-1.5 rounded-full font-bold tracking-wider uppercase bg-white/5 text-white/40 border border-white/8">
                {item.subCategory}
              </span>
            </div>

            <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-heading font-bold text-white leading-[1.1] mb-4">
              <span className="w-1 h-8 rounded-full mr-3 inline-block align-middle" style={{ background: item.accent }} />
              {item.name}
            </h2>

            <p className="text-[0.82rem] sm:text-[0.92rem] text-white/50 leading-relaxed max-w-lg mb-8">{item.description}</p>

            {/* Meta */}
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              {[
                { icon: "◈", label: "Client", value: item.client },
                { icon: "◷", label: "Year", value: item.year },
                { icon: "⬡", label: "Platform", value: item.platform },
              ].map((meta, i) => (
                <div key={i} className="px-4 py-3 rounded-xl" style={{ background: "hsl(0 0% 100% / 0.03)", border: "1px solid hsl(0 0% 100% / 0.06)" }}>
                  <p className="text-[0.5rem] text-white/30 uppercase tracking-wider font-bold mb-0.5">{meta.icon} {meta.label}</p>
                  <p className="text-[0.75rem] text-white/80 font-heading font-semibold">{meta.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Hero Phone */}
          <div className="flex items-center justify-center p-8 sm:p-10 lg:w-[340px]">
            <PhoneMockup src={heroScreen.url} alt={item.name} accent={item.accent} size="lg" />
          </div>
        </div>

        {/* All Screens Section */}
        <div className="mb-8">
          <h3 className="text-[0.65rem] font-heading font-bold tracking-[4px] uppercase text-white/30 mb-6">
            All Screens <span className="text-white/15 ml-2">({filteredScreens.length})</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredScreens.map((screen, i) => (
              <motion.div key={`${screen.url}-${i}`}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.5) }}
                className="group">
                <MockupLightbox imageSrc={screen.url} imageAlt={screen.label}>
                  <div className="cursor-pointer">
                    {screen.type === "mobile" ? (
                      <PhoneMockup src={screen.url} alt={screen.label} accent={item.accent} size="md" />
                    ) : (
                      <DesktopMockup src={screen.url} alt={screen.label} />
                    )}
                    <p className="text-[0.6rem] text-white/35 mt-2 text-center truncate group-hover:text-white/55 transition-colors">{screen.label}</p>
                  </div>
                </MockupLightbox>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────── CarouselCard ─────────── */
function CarouselCard({ item, onClick }: { item: PortfolioItem; onClick: () => void }) {
  const mobileScreens = item.screens.filter((s) => s.type === "mobile").slice(0, 3);
  const heroScreens = mobileScreens.length >= 3 ? mobileScreens : item.screens.slice(0, 3);

  return (
    <motion.div
      onClick={onClick}
      className="flex-shrink-0 w-[260px] sm:w-[300px] group cursor-pointer relative rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(160deg, hsl(228 20% 12% / 0.95), hsl(232 22% 10% / 0.9))",
        border: "1px solid hsl(0 0% 100% / 0.06)",
        boxShadow: "0 4px 24px hsl(0 0% 0% / 0.3)",
      }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
    >
      {/* Phones preview */}
      <div className="relative p-4 pb-2 flex items-end justify-center gap-1.5 min-h-[200px] sm:min-h-[240px]"
        style={{ background: `linear-gradient(180deg, color-mix(in srgb, ${item.accent} 5%, transparent) 0%, transparent 60%)` }}>
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[180px] h-[100px] rounded-full opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(circle, color-mix(in srgb, ${item.accent} 22%, transparent), transparent 70%)`, filter: "blur(40px)" }} />
        {heroScreens.map((screen, si) => {
          const isCenter = si === 0;
          return (
            <div key={si} className="relative"
              style={{
                zIndex: isCenter ? 10 : 5 - si,
                marginBottom: isCenter ? 0 : si === 1 ? "6px" : "3px",
                marginRight: si === 1 ? "-6px" : undefined,
                marginLeft: si === 2 ? "-6px" : undefined,
              }}>
              <PhoneMockup src={screen.url} alt={`${item.name} ${si + 1}`} accent={item.accent} />
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="px-4 pb-4 pt-2">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[0.5rem] px-2 py-0.5 rounded-full font-bold tracking-wider uppercase"
            style={{ background: `color-mix(in srgb, ${item.accent} 14%, transparent)`, color: item.accent, border: `1px solid color-mix(in srgb, ${item.accent} 20%, transparent)` }}>
            {item.category}
          </span>
          <span className="text-[0.5rem] text-white/25">{item.subCategory}</span>
        </div>
        <h3 className="text-sm font-heading font-bold text-white mb-1 group-hover:text-white/90 transition-colors">{item.name}</h3>
        <p className="text-[0.62rem] text-white/35 leading-relaxed line-clamp-2">{item.description}</p>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-[0.5rem] text-white/20">{item.screens.length} screens</span>
          <div className="flex items-center gap-1 text-[0.58rem] font-heading font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ color: item.accent }}>
            VIEW <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${item.accent} 22%, transparent), 0 0 30px color-mix(in srgb, ${item.accent} 8%, transparent)` }} />
    </motion.div>
  );
}

/* ─────────── Main Component ─────────── */
export default function PortfolioGrid() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollL, setCanScrollL] = useState(false);
  const [canScrollR, setCanScrollR] = useState(true);

  const filtered = useMemo(() => {
    return activeFilter === "All" ? PORTFOLIO : PORTFOLIO.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollL(el.scrollLeft > 10);
    setCanScrollR(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => { checkScroll(); }, [filtered, checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <section id="portfolio" className="relative py-20 sm:py-28 overflow-hidden"
      style={{ background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted) / 0.3) 50%, hsl(var(--background)) 100%)" }}>

      {/* Ambient glows */}
      <div className="absolute top-[10%] right-[20%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.06), transparent 65%)", filter: "blur(120px)" }} />

      <div className="max-w-[1200px] mx-auto relative z-10 px-5 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
            style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.08)" }}
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Eye className="w-3 h-3 text-white/40" />
            <span className="text-[0.6rem] font-heading font-semibold tracking-[3px] uppercase text-white/40">Our Portfolio</span>
          </motion.div>

          <motion.h2 className="text-[clamp(1.8rem,5vw,3.5rem)] font-heading font-bold text-white leading-[1.05] mb-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Mobile App{" "}
            <span style={{
              background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Development</span>
          </motion.h2>
          <motion.p className="text-sm text-white/40 max-w-lg mx-auto"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            Progetti reali realizzati per clienti in tutto il mondo. Design premium, funzionalità avanzate.
          </motion.p>
        </div>

        {/* Category Filters */}
        <motion.div className="flex items-center justify-center gap-2 mb-8 flex-wrap"
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {CATEGORIES.map((cat) => {
            const count = cat === "All" ? PORTFOLIO.length : PORTFOLIO.filter((p) => p.category === cat).length;
            return (
              <button key={cat} onClick={() => { setActiveFilter(cat); scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" }); }}
                className={`px-4 py-2 rounded-full text-[0.65rem] font-heading font-semibold tracking-wider uppercase transition-all ${
                  activeFilter === cat
                    ? "bg-white/10 text-white border border-white/20"
                    : "text-white/30 hover:text-white/50 border border-transparent"
                }`}>
                {CATEGORY_LABELS[cat] || cat}
                <span className="ml-1.5 text-[0.5rem] opacity-50">{count}</span>
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Arrows */}
        {canScrollL && (
          <button onClick={() => scroll("left")}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
            style={{ background: "hsl(228 22% 10% / 0.8)", backdropFilter: "blur(8px)", border: "1px solid hsl(0 0% 100% / 0.1)" }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {canScrollR && (
          <button onClick={() => scroll("right")}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
            style={{ background: "hsl(228 22% 10% / 0.8)", backdropFilter: "blur(8px)", border: "1px solid hsl(0 0% 100% / 0.1)" }}>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }} />

        <div ref={scrollRef} onScroll={checkScroll}
          className="flex gap-5 overflow-x-auto scrollbar-hide py-2 px-6 sm:px-10"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          {filtered.map((item) => (
            <div key={item.name} style={{ scrollSnapAlign: "center" }}>
              <CarouselCard item={item} onClick={() => setSelectedItem(item)} />
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
        <motion.div className="flex items-center justify-center gap-8 sm:gap-14 mt-12"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {[
            { value: `${PORTFOLIO.length}+`, label: "Apps Launched" },
            { value: "50+", label: "Clients Worldwide" },
            { value: "583+", label: "Premium Screens" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl sm:text-3xl font-heading font-bold text-white">{stat.value}</p>
              <p className="text-[0.6rem] text-white/30 tracking-wider uppercase mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Detail Page Overlay */}
      <AnimatePresence>
        {selectedItem && <ProjectDetailPage item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </AnimatePresence>
    </section>
  );
}
