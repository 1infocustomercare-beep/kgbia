import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { SECTOR_PORTFOLIO } from "@/data/sector-mockup-images";

/* ═══════════════════════════════════════════
   Types & Data Building
   ═══════════════════════════════════════════ */
interface Project {
  name: string;
  cat: string;
  sub: string;
  desc: string;
  client: string;
  year: string;
  platform: string;
  screens: string[];
  desktopScreens?: string[];
}

const SECTOR_CAT_MAP: Record<string, string> = {
  food: "Food",
  beauty: "Beauty",
  ncc: "Travel",
  fitness: "Fitness",
  healthcare: "Healthcare",
  veterinary: "Pet Care",
  childcare: "Education",
  plumber: "Services",
  beach: "Watersports",
  hospitality: "Hospitality",
  construction: "Real Estate",
  retail: "E-Commerce",
};

const BRAND_META: Record<string, { desc: string; sub: string; platform: string }> = {
  "COTE Miami": { desc: "Michelin-starred Korean steakhouse – 6 luxury design styles, mobile + desktop.", sub: "Korean Steakhouse", platform: "iOS, Android & Web" },
  "Paperfish Sushi": { desc: "Premium sushi ordering – 12 unique visual styles from sakura to arctic crystal.", sub: "Sushi & Nikkei", platform: "iOS & Android" },
  "La Vang Vietnamese": { desc: "Luxury Vietnamese cuisine – 8 mobile + 4 desktop styles.", sub: "Vietnamese Luxury", platform: "iOS & Android" },
  "Batey Cevicheria": { desc: "Peruvian cevicheria – Costa Pacifico, Casa Nostra, Bianco & Memoria.", sub: "Peruvian", platform: "iOS & Android" },
  "Midtown Kosher": { desc: "Kosher restaurant Miami – 8 style proposals in Israeli blue/white palette.", sub: "Kosher Restaurant", platform: "Web App" },
  "Flame Kebab": { desc: "Vibrant food ordering app – real-time tracking and customization.", sub: "Kebab & Grill", platform: "iOS & Android" },
  "Neo Nails Brickell": { desc: "Premium nail salon – glassmorphism, Apple Vision Pro aesthetic.", sub: "Nails & Beauty", platform: "iOS & Android" },
  "Tatush Hair Fragrance": { desc: "Hair fragrance brand – Fresh Minimal Blanc design.", sub: "Hair & Fragrance", platform: "iOS & Android" },
  "Miami Boats Rental": { desc: "Luxury yacht & boat rental – 5 design styles.", sub: "Boat & Yacht", platform: "Web App" },
  "Asinara Charter": { desc: "Sardinian luxury charter – deep azure + warm gold palette.", sub: "Charter", platform: "Web App" },
  "Aloha Pet Resorts": { desc: "Premium pet care – live cameras, pet profiles, resort management.", sub: "Pet Resort", platform: "iOS & Android" },
  "Little Diamond Nursery": { desc: "Premium nursery Dubai – 5 playful design styles.", sub: "Nursery", platform: "Web App" },
  "Ashley's Playhouse": { desc: "Drop-in childcare Austin TX – 4 autumn-themed styles.", sub: "Childcare", platform: "Web App" },
  "City Padel Milano": { desc: "Premium padel club Milano – 5 design styles, court booking.", sub: "Padel & Sport", platform: "Web App" },
  "Miami Watersports": { desc: "Jet ski, parasailing, flyboard – 4 tropical styles.", sub: "Watersports", platform: "Web App" },
  "Nick's Plumbing & AC": { desc: "Home services booking Houston TX – iOS 18 design.", sub: "Plumbing & HVAC", platform: "Web App" },
  "FAR Medical Solutions": { desc: "Medical devices – 4 premium light mode styles.", sub: "Medical Devices", platform: "Web App" },
  "MMI Resident Hub": { desc: "Luxury condo resident portal – 4 white luxury styles.", sub: "Luxury Condo", platform: "Web App" },
};

function buildProjects(): Project[] {
  const projects: Project[] = [];
  const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

  for (const sector of SECTOR_PORTFOLIO) {
    const cat = SECTOR_CAT_MAP[sector.sectorId] || sector.sectorLabel;
    for (const brand of sector.brands) {
      const meta = BRAND_META[brand.name] || { desc: `Premium ${cat.toLowerCase()} app.`, sub: cat, platform: "iOS & Android" };
      const allScreens: string[] = [];
      const allDesktop: string[] = [];
      for (const style of brand.styles) {
        for (const s of style.screens) if (!allScreens.includes(s)) allScreens.push(s);
        if (style.desktopScreens) for (const d of style.desktopScreens) if (!allDesktop.includes(d)) allDesktop.push(d);
      }
      projects.push({ name: brand.name, cat, sub: meta.sub, desc: meta.desc, client: brand.name, year: "2025", platform: meta.platform, screens: allScreens, desktopScreens: allDesktop.length > 0 ? allDesktop : undefined });
    }
  }

  // Extra projects not in SECTOR_PORTFOLIO
  const extras: Project[] = [
    { name: "Otomaki Sushi", cat: "Food", sub: "Sushi", desc: "Immersive sushi ordering with custom roll builder.", client: "Otomaki Sushi", year: "2025", platform: "iOS & Android", screens: [`${S}/migrated-1773167901906-9e1e562a9a71c0a8aed3ac62c7a611a0-1772904882643.png`, `${S}/migrated-1773167902215-cc78c59f3e7ac20af97500c2150ee325-1772904886788.png`, `${S}/migrated-1773167902581-874b87d01f2114131311e5cee0b273ae-1772904891706.png`] },
    { name: "La Patrona", cat: "Food", sub: "Mexican", desc: "Culturally rich restaurant app with traditional menus.", client: "La Patrona", year: "2025", platform: "iOS & Android", screens: [`${S}/migrated-1773167903321-8f595dd2f0fbb30d4310e2d299c2f260-1772838544173.png`, `${S}/migrated-1773167903695-5b07a42263dfcbcbd5de69be1e4a7433-1772838638563.png`, `${S}/migrated-1773167904054-7297a6739fd678e2e2a0c96eaa0fe9e1-1772838655677.png`] },
    { name: "Papagua", cat: "Food", sub: "Energy & Bowls", desc: "Tropical food app with custom bowl builder.", client: "Papagua", year: "2025", platform: "iOS & Android", screens: [`${S}/migrated-1773167904818-09cd270c062b9d2856b48b9f63f7c234-1772881106900.png`] },
    { name: "Meridia Rental Car", cat: "Travel", sub: "Car Rental", desc: "Sleek car rental with real-time availability.", client: "Meridia Rental", year: "2025", platform: "Web App", screens: [`${S}/migrated-1773167906872-821da26dd0f0fec05286424b7e1d3a11-1772620868489.png`, `${S}/migrated-1773167907191-360951700ee2756f3cb37cc9119ba26f-1772620944505.png`, `${S}/migrated-1773167907500-cecfe2b244765df008519b7024925b5b-1772620948139.png`] },
    { name: "Aura Milano Spa", cat: "Beauty", sub: "Wellness & Spa", desc: "Luxury spa wellness app Milano.", client: "Aura Milano Spa", year: "2025", platform: "iOS & Android", screens: [`${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`, `${S}/Aura%20Milano%20Spa/mobile-luce-pura-trattamenti.png`, `${S}/Aura%20Milano%20Spa/mobile-luce-pura-dettaglio.png`] },
    { name: "DIMORA Milano", cat: "Real Estate", sub: "Real Estate", desc: "Premium real estate app Milano – 6 proposte.", client: "DIMORA Milano", year: "2025", platform: "iOS & Android", screens: [`${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`, `${S}/DIMORA%20Milano/eleganza-milanese-annunci-mobile.png`, `${S}/DIMORA%20Milano/eleganza-milanese-dettaglio-mobile.png`] },
    { name: "Pokewaii Brescia", cat: "Food", sub: "Poke & Hawaiian", desc: "Pokeria hawaiana – 4 tropical styles.", client: "Pokewaii Brescia", year: "2025", platform: "iOS & Android", screens: [`${S}/Pokewaii%20Brescia/mobile-a-tropical-home.png`, `${S}/Pokewaii%20Brescia/mobile-a-tropical-menu.png`, `${S}/Pokewaii%20Brescia/mobile-a-tropical-detail.png`] },
    { name: "Orygano Pizzeria", cat: "Food", sub: "Pizza Gourmet", desc: "Pizzeria Gourmet Catania – Dark Gourmet Natural.", client: "Orygano Pizzeria", year: "2025", platform: "iOS & Android", screens: [`${S}/Orygano%20Pizzeria%20Gourmet/mobile-home.png`, `${S}/Orygano%20Pizzeria%20Gourmet/mobile-menu.png`, `${S}/Orygano%20Pizzeria%20Gourmet/mobile-detail.png`] },
    { name: "STRAPIZZAMI", cat: "Food", sub: "Pizza", desc: "Premium pizza ordering – Italian warm design.", client: "STRAPIZZAMI", year: "2025", platform: "iOS & Android", screens: [`${S}/STRAPIZZAMI/stile-a-home.png`] },
    { name: "LuxDrive", cat: "Travel", sub: "NCC & Chauffeur", desc: "Premium luxury chauffeur service.", client: "LuxDrive", year: "2025", platform: "iOS & Android", screens: [`${S}/LuxDrive/style-a-home.png`] },
    { name: "Top Golf Bay", cat: "Fitness", sub: "Golf & Sport", desc: "Premium golf booking and social app.", client: "Top Golf Bay", year: "2025", platform: "Web App", screens: [`${S}/Top%20Golf%20Bay%20App/a-official-home.png`] },
  ];

  const existing = new Set(projects.map(p => p.name));
  for (const e of extras) if (!existing.has(e.name)) projects.push(e);
  return projects;
}

const ALL_PROJECTS = buildProjects();

const CAT_COLORS: Record<string, string> = {
  Food: "#e67e22", Beauty: "#ec4899", Travel: "#1abc9c", Fitness: "#22d3ee",
  Healthcare: "#3b82f6", "Pet Care": "#4ade80", Education: "#f39c12",
  Services: "#64748b", Watersports: "#06b6d4", Hospitality: "#c9a84c",
  "Real Estate": "#a855f7", "E-Commerce": "#9b59b6",
};

/* ═══════════════════════════════════════════
   iPhone Frame — contained, never overflows
   ═══════════════════════════════════════════ */
function PhoneFrame({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  if (error) return null;
  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <div className="w-full aspect-[9/19.5] rounded-[16px] sm:rounded-[20px] border-[2px] border-white/10 overflow-hidden bg-[#0a0a14] shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[30%] h-[16px] sm:h-[20px] bg-black rounded-full z-10" />
        <div className="absolute inset-[1.5px] rounded-[14px] sm:rounded-[18px] overflow-hidden">
          {!loaded && <div className="w-full h-full bg-gradient-to-b from-[#1a1a2e] to-[#0a0a14] animate-pulse" />}
          <img src={src} alt={alt} loading="lazy"
            className={`w-full h-full object-cover object-top transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded(true)} onError={() => setError(true)} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Portfolio Card — Lowengeld-style contained
   ═══════════════════════════════════════════ */
function PortfolioCard({ project, onClick, index }: { project: Project; onClick: () => void; index: number }) {
  const preview = project.screens.slice(0, 3);
  const accent = CAT_COLORS[project.cat] || "#7eb7be";

  return (
    <motion.div
      className="group cursor-pointer rounded-xl overflow-hidden border border-white/[0.06] hover:border-white/[0.15] transition-all duration-500 bg-[#0c0c18]"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 3) * 0.08, duration: 0.45 }}
      onClick={onClick}
    >
      {/* Phone Preview — contained, never overflows */}
      <div className="relative h-[160px] sm:h-[240px] lg:h-[260px] overflow-hidden flex items-end justify-center px-2 sm:px-4 pt-4 sm:pt-6">
        {/* Ambient glow */}
        <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at 50% 100%, ${accent}40, transparent 70%)` }} />

        {preview.length >= 3 ? (
          <div className="relative flex items-end justify-center w-full h-full">
            <div className="absolute left-1/2 -translate-x-[calc(50%+22px)] sm:-translate-x-[calc(50%+36px)] bottom-0 w-[50px] sm:w-[78px] -rotate-[6deg] origin-bottom opacity-70 group-hover:opacity-90 transition-all duration-500">
              <PhoneFrame src={preview[0]} alt={project.name} />
            </div>
            <div className="relative z-10 w-[58px] sm:w-[90px] group-hover:-translate-y-1 transition-all duration-500">
              <PhoneFrame src={preview[1]} alt={project.name} />
            </div>
            <div className="absolute left-1/2 translate-x-[calc(-50%+22px)] sm:translate-x-[calc(-50%+36px)] bottom-0 w-[50px] sm:w-[78px] rotate-[6deg] origin-bottom opacity-70 group-hover:opacity-90 transition-all duration-500">
              <PhoneFrame src={preview[2]} alt={project.name} />
            </div>
          </div>
        ) : preview.length === 2 ? (
          <div className="relative flex items-end justify-center w-full h-full gap-1 sm:gap-2">
            <div className="w-[56px] sm:w-[85px] -rotate-3 transition-all duration-500">
              <PhoneFrame src={preview[0]} alt={project.name} />
            </div>
            <div className="w-[56px] sm:w-[85px] rotate-3 transition-all duration-500">
              <PhoneFrame src={preview[1]} alt={project.name} />
            </div>
          </div>
        ) : (
          <div className="w-[64px] sm:w-[100px] group-hover:-translate-y-1 transition-all duration-500">
            <PhoneFrame src={preview[0]} alt={project.name} />
          </div>
        )}

        {/* Hover CTA */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3 z-20">
          <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-semibold tracking-wider">
            VIEW PROJECT →
          </span>
        </div>
      </div>

      {/* Info — high contrast text */}
      <div className="px-4 pb-4 pt-3 bg-[#0c0c18]">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white" style={{ background: accent }}>{project.cat}</span>
          <span className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider">{project.sub}</span>
        </div>
        <h3 className="text-[13px] sm:text-sm font-bold text-white mb-0.5 group-hover:text-[#7eb7be] transition-colors leading-snug">{project.name}</h3>
        <p className="text-[10px] sm:text-[11px] text-white/45 leading-relaxed line-clamp-2">{project.desc}</p>
        {project.screens.length > 3 && (
          <span className="text-[9px] text-[#7eb7be]/70 mt-1 block font-medium">{project.screens.length} screens{project.desktopScreens ? ` + ${project.desktopScreens.length} desktop` : ""}</span>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Project Detail Overlay
   ═══════════════════════════════════════════ */
function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  const [activeScreen, setActiveScreen] = useState(0);
  const [showDesktop, setShowDesktop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const accent = CAT_COLORS[project.cat] || "#7eb7be";
  const currentScreens = showDesktop && project.desktopScreens?.length ? project.desktopScreens : project.screens;

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  useEffect(() => { setActiveScreen(0); }, [showDesktop]);

  const scrollGallery = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] overflow-y-auto bg-[#060610]">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3 backdrop-blur-xl bg-[#060610]/90 border-b border-white/[0.06]">
        <button onClick={onClose} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] transition text-white/70 hover:text-white text-xs sm:text-sm">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[40%]">{project.name}</span>
        {project.desktopScreens && project.desktopScreens.length > 0 && (
          <div className="flex gap-0.5 bg-white/[0.06] rounded-full p-0.5">
            <button onClick={() => setShowDesktop(false)} className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs transition ${!showDesktop ? "bg-[#7eb7be] text-black font-bold" : "text-white/50"}`}>Mobile</button>
            <button onClick={() => setShowDesktop(true)} className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs transition ${showDesktop ? "bg-[#7eb7be] text-black font-bold" : "text-white/50"}`}>Desktop</button>
          </div>
        )}
      </div>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <div className="flex gap-2 mb-3 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white" style={{ background: accent }}>{project.cat}</span>
              <span className="px-2.5 py-0.5 rounded text-[10px] text-white/60 bg-white/[0.06] uppercase tracking-wider">{project.sub}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight border-l-[3px] border-[#7eb7be] pl-4">{project.name}</h1>
            <p className="text-xs sm:text-sm text-white/50 leading-relaxed mb-6">{project.desc}</p>
            <div className="grid grid-cols-2 gap-2.5">
              {[["CLIENT", project.client, "◆"], ["YEAR", project.year, "◎"], ["PLATFORM", project.platform, "○"], ["SCREENS", `${project.screens.length}${project.desktopScreens ? ` + ${project.desktopScreens.length} desktop` : ""}`, "◇"]].map(([label, value, icon]) => (
                <div key={label} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[9px] text-white/30 uppercase tracking-wider flex items-center gap-1"><span className="text-[#7eb7be]">{icon}</span> {label}</span>
                  <p className="text-[11px] sm:text-xs font-semibold text-white mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="flex justify-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}>
            <div className="relative">
              <div className="absolute -inset-16 opacity-30 blur-3xl" style={{ background: `radial-gradient(ellipse, ${accent}33, transparent 70%)` }} />
              <PhoneFrame src={currentScreens[activeScreen] || currentScreens[0]} alt={`${project.name} screen`} className="w-[160px] sm:w-[220px] relative z-10" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gallery */}
      {currentScreens.length > 1 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-[3px]">ALL SCREENS — {currentScreens.length}</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
            <button onClick={() => scrollGallery(-1)} className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-white/50 hover:text-white transition"><ChevronLeft className="w-3.5 h-3.5" /></button>
            <button onClick={() => scrollGallery(1)} className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-white/50 hover:text-white transition"><ChevronRight className="w-3.5 h-3.5" /></button>
          </div>
          <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
            {currentScreens.map((screen, i) => (
              <motion.button key={`${showDesktop}-${i}`} onClick={() => setActiveScreen(i)}
                className={`flex-shrink-0 snap-center transition-all duration-300 ${i === activeScreen ? "scale-[1.03] ring-2 ring-[#7eb7be]/50 rounded-xl" : "opacity-50 hover:opacity-80"}`}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.03 }}>
                <PhoneFrame src={screen} alt={`Screen ${i + 1}`} className="w-[100px] sm:w-[120px]" />
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-12">
        <div className="rounded-xl p-6 sm:p-8 text-center border border-white/[0.06]" style={{ background: "linear-gradient(135deg, rgba(126,183,190,0.06), rgba(108,60,224,0.06))" }}>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">Vuoi un progetto simile?</h3>
          <p className="text-xs text-white/40 mb-4">Contattaci per una consulenza gratuita e un preventivo personalizzato.</p>
          <a href="#contact"
            onClick={(e) => { e.preventDefault(); onClose(); setTimeout(() => document.getElementById("team")?.scrollIntoView({ behavior: "smooth" }), 300); }}
            className="inline-flex px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] text-white font-semibold text-xs sm:text-sm hover:shadow-lg hover:shadow-[#7eb7be]/20 transition-all">
            Richiedi Preventivo →
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════ */
export default function LandingPortfolio() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);

  const CATS = useMemo(() => ["All", ...Array.from(new Set(ALL_PROJECTS.map(p => p.cat))).sort()], []);
  const items = filter === "All" ? ALL_PROJECTS : ALL_PROJECTS.filter(p => p.cat === filter);
  const totalScreens = ALL_PROJECTS.reduce((sum, p) => sum + p.screens.length + (p.desktopScreens?.length || 0), 0);

  return (
    <>
      <section id="portfolio" className="py-16 sm:py-20 lg:py-28" style={{ background: "linear-gradient(180deg, #020204 0%, #0a0a16 50%, #020204 100%)" }}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div className="mb-8 sm:mb-10" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-[10px] sm:text-[11px] tracking-[3px] uppercase text-[#7eb7be] font-semibold mb-2 block">OUR WORK</span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">Portfolio</h2>

            {/* Filter Pills — horizontal scroll on mobile */}
            <div className="flex gap-1.5 flex-wrap max-h-[72px] overflow-hidden sm:max-h-none sm:overflow-visible">
              {CATS.map((c) => (
                <button key={c} onClick={() => setFilter(c)}
                  className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all border whitespace-nowrap ${
                    c === filter
                      ? "bg-[#7eb7be]/10 border-[#7eb7be]/50 text-[#7eb7be]"
                      : "bg-transparent border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/60"
                  }`}>
                  {c}
                </button>
              ))}
            </div>
            <p className="text-[11px] sm:text-sm text-white/30 mt-2">{items.length} projects · {totalScreens}+ screens</p>
          </motion.div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div key={filter}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              {items.map((project, i) => (
                <PortfolioCard key={project.name} project={project} index={i} onClick={() => setSelected(project)} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Stats */}
          <motion.div className="flex gap-6 sm:gap-10 justify-center mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-white/[0.06]"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            {[[ALL_PROJECTS.length + "+", "Apps"], [totalScreens + "+", "Screens"], ["25+", "Settori"]].map(([v, l]) => (
              <div key={String(l)} className="text-center">
                <strong className="text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent block">{v}</strong>
                <span className="text-[9px] sm:text-[11px] text-white/40">{l}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selected && <ProjectDetail project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}
