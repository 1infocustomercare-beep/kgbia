import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useMemo, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Monitor, Smartphone } from "lucide-react";
import { SECTOR_PORTFOLIO } from "@/data/sector-mockup-images";

/* ═══════════════════════════════════════════
   Types & Data
   ═══════════════════════════════════════════ */
interface Project {
  name: string;
  cat: string;
  sub: string;
  desc: string;
  screens: string[];
  desktopScreens?: string[];
}

const SECTOR_CAT_MAP: Record<string, string> = {
  food: "Food", beauty: "Beauty", ncc: "Travel", fitness: "Fitness",
  healthcare: "Healthcare", veterinary: "Pet Care", childcare: "Education",
  plumber: "Services", beach: "Watersports", hospitality: "Hospitality",
  construction: "Real Estate", retail: "E-Commerce",
};

const BRAND_META: Record<string, { desc: string; sub: string }> = {
  "COTE Miami": { desc: "Michelin-starred Korean steakhouse – 6 luxury styles.", sub: "Korean Steakhouse" },
  "Paperfish Sushi": { desc: "Premium sushi ordering – 12 unique visual styles.", sub: "Sushi & Nikkei" },
  "La Vang Vietnamese": { desc: "Luxury Vietnamese cuisine – 8 mobile + 4 desktop.", sub: "Vietnamese Luxury" },
  "Batey Cevicheria": { desc: "Peruvian cevicheria – Costa Pacifico, Bianco & Memoria.", sub: "Peruvian" },
  "Midtown Kosher": { desc: "Kosher restaurant Miami – 8 style proposals.", sub: "Kosher Restaurant" },
  "Flame Kebab": { desc: "Vibrant food ordering – real-time tracking.", sub: "Kebab & Grill" },
  "Neo Nails Brickell": { desc: "Premium nail salon – glassmorphism aesthetic.", sub: "Nails & Beauty" },
  "Tatush Hair Fragrance": { desc: "Hair fragrance brand – Fresh Minimal Blanc.", sub: "Hair & Fragrance" },
  "Miami Boats Rental": { desc: "Luxury yacht & boat rental – 5 styles.", sub: "Boat & Yacht" },
  "Asinara Charter": { desc: "Sardinian luxury charter – azure + gold palette.", sub: "Charter" },
  "Aloha Pet Resorts": { desc: "Premium pet care – live cameras & resort management.", sub: "Pet Resort" },
  "Little Diamond Nursery": { desc: "Premium nursery Dubai – 5 playful styles.", sub: "Nursery" },
  "Ashley's Playhouse": { desc: "Drop-in childcare Austin TX – 4 autumn styles.", sub: "Childcare" },
  "City Padel Milano": { desc: "Premium padel club Milano – court booking.", sub: "Padel & Sport" },
  "Miami Watersports": { desc: "Jet ski, parasailing, flyboard – 4 tropical styles.", sub: "Watersports" },
  "Nick's Plumbing & AC": { desc: "Home services booking Houston TX – iOS 18.", sub: "Plumbing & HVAC" },
  "FAR Medical Solutions": { desc: "Medical devices – 4 premium light mode styles.", sub: "Medical Devices" },
  "MMI Resident Hub": { desc: "Luxury condo resident portal – 4 styles.", sub: "Luxury Condo" },
  "Pokewaii Brescia": { desc: "Pokeria hawaiana – 4 tropical styles.", sub: "Poke & Hawaiian" },
  "Orygano Pizzeria": { desc: "Pizzeria Gourmet Catania – Dark Gourmet.", sub: "Pizza Gourmet" },
  "STRAPIZZAMI": { desc: "Premium pizza ordering – Italian warm design.", sub: "Pizza" },
  "Aura Milano Spa": { desc: "Luxury spa wellness app Milano.", sub: "Wellness & Spa" },
  "DIMORA Milano": { desc: "Premium real estate app Milano.", sub: "Real Estate" },
};

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

function buildProjects(): Project[] {
  const projects: Project[] = [];
  for (const sector of SECTOR_PORTFOLIO) {
    const cat = SECTOR_CAT_MAP[sector.sectorId] || sector.sectorLabel;
    for (const brand of sector.brands) {
      const meta = BRAND_META[brand.name] || { desc: `Premium ${cat.toLowerCase()} app.`, sub: cat };
      const allScreens: string[] = [];
      const allDesktop: string[] = [];
      for (const style of brand.styles) {
        for (const s of style.screens) if (!allScreens.includes(s)) allScreens.push(s);
        if (style.desktopScreens) for (const d of style.desktopScreens) if (!allDesktop.includes(d)) allDesktop.push(d);
      }
      projects.push({ name: brand.name, cat, sub: meta.sub, desc: meta.desc, screens: allScreens, desktopScreens: allDesktop.length > 0 ? allDesktop : undefined });
    }
  }
  const extras: Project[] = [
    { name: "Otomaki Sushi", cat: "Food", sub: "Sushi", desc: "Immersive sushi ordering with custom roll builder.", screens: [`${S}/migrated-1773167901906-9e1e562a9a71c0a8aed3ac62c7a611a0-1772904882643.png`, `${S}/migrated-1773167902215-cc78c59f3e7ac20af97500c2150ee325-1772904886788.png`, `${S}/migrated-1773167902581-874b87d01f2114131311e5cee0b273ae-1772904891706.png`] },
    { name: "La Patrona", cat: "Food", sub: "Mexican", desc: "Culturally rich restaurant app.", screens: [`${S}/migrated-1773167903321-8f595dd2f0fbb30d4310e2d299c2f260-1772838544173.png`, `${S}/migrated-1773167903695-5b07a42263dfcbcbd5de69be1e4a7433-1772838638563.png`, `${S}/migrated-1773167904054-7297a6739fd678e2e2a0c96eaa0fe9e1-1772838655677.png`] },
    { name: "Papagua", cat: "Food", sub: "Energy & Bowls", desc: "Tropical food app with custom bowl builder.", screens: [`${S}/migrated-1773167904818-09cd270c062b9d2856b48b9f63f7c234-1772881106900.png`] },
    { name: "Meridia Rental Car", cat: "Travel", sub: "Car Rental", desc: "Sleek car rental with real-time availability.", screens: [`${S}/migrated-1773167906872-821da26dd0f0fec05286424b7e1d3a11-1772620868489.png`, `${S}/migrated-1773167907191-360951700ee2756f3cb37cc9119ba26f-1772620944505.png`, `${S}/migrated-1773167907500-cecfe2b244765df008519b7024925b5b-1772620948139.png`] },
    { name: "Aura Milano Spa", cat: "Beauty", sub: "Wellness & Spa", desc: "Luxury spa wellness app Milano.", screens: [`${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`, `${S}/Aura%20Milano%20Spa/mobile-luce-pura-trattamenti.png`, `${S}/Aura%20Milano%20Spa/mobile-luce-pura-dettaglio.png`] },
    { name: "DIMORA Milano", cat: "Real Estate", sub: "Real Estate", desc: "Premium real estate app Milano.", screens: [`${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`, `${S}/DIMORA%20Milano/eleganza-milanese-annunci-mobile.png`, `${S}/DIMORA%20Milano/eleganza-milanese-dettaglio-mobile.png`] },
    { name: "Pokewaii Brescia", cat: "Food", sub: "Poke & Hawaiian", desc: "Pokeria hawaiana – 4 tropical styles.", screens: [`${S}/Pokewaii%20Brescia/mobile-a-tropical-home.png`, `${S}/Pokewaii%20Brescia/mobile-a-tropical-menu.png`, `${S}/Pokewaii%20Brescia/mobile-a-tropical-detail.png`] },
    { name: "Orygano Pizzeria", cat: "Food", sub: "Pizza Gourmet", desc: "Pizzeria Gourmet Catania.", screens: [`${S}/Orygano%20Pizzeria%20Gourmet/mobile-home.png`, `${S}/Orygano%20Pizzeria%20Gourmet/mobile-menu.png`, `${S}/Orygano%20Pizzeria%20Gourmet/mobile-detail.png`] },
    { name: "STRAPIZZAMI", cat: "Food", sub: "Pizza", desc: "Premium pizza ordering – Italian warm.", screens: [`${S}/STRAPIZZAMI/stile-a-home.png`] },
    { name: "LuxDrive", cat: "Travel", sub: "NCC & Chauffeur", desc: "Premium luxury chauffeur service.", screens: [`${S}/LuxDrive/style-a-home.png`] },
    { name: "Top Golf Bay", cat: "Fitness", sub: "Golf & Sport", desc: "Premium golf booking and social app.", screens: [`${S}/Top%20Golf%20Bay%20App/a-official-home.png`] },
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
   iPhone Frame — realistic device mockup
   ═══════════════════════════════════════════ */
function PhoneFrame({ src, className = "" }: { src: string; className?: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      {/* Device shell */}
      <div className="relative w-full aspect-[9/19.5] rounded-[22%/10%] border-[2.5px] border-[#2a2a3a] bg-[#0a0a14] shadow-[0_4px_24px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(255,255,255,0.04)] overflow-hidden">
        {/* Dynamic Island */}
        <div className="absolute top-[3%] left-1/2 -translate-x-1/2 w-[28%] h-[3.2%] bg-black rounded-full z-20" />
        {/* Screen */}
        <div className="absolute inset-[2px] rounded-[20%/9%] overflow-hidden">
          <img src={src} alt="" loading="lazy"
            className="w-full h-full object-cover object-top"
            onError={() => setOk(false)} />
        </div>
        {/* Screen glass reflection */}
        <div className="absolute inset-0 rounded-[20%/9%] bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Portfolio Card — Lowengeld-style with iPhone frames
   ═══════════════════════════════════════════ */
function PortfolioCard({ project, onClick, index }: { project: Project; onClick: () => void; index: number }) {
  const accent = CAT_COLORS[project.cat] || "#7eb7be";
  const preview = project.screens.slice(0, 3);

  return (
    <motion.div
      className="group cursor-pointer rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.15] transition-all duration-500 bg-[#0c0c18]/80 backdrop-blur-sm"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: (index % 4) * 0.06, duration: 0.4 }}
      onClick={onClick}
    >
      {/* Preview area — contained with overflow hidden */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-[#12121e] to-[#0a0a14]">
        {/* Ambient glow */}
        <div className="absolute inset-0 opacity-25" style={{ background: `radial-gradient(ellipse at 50% 90%, ${accent}40, transparent 60%)` }} />

        {/* iPhone mockups — centered, contained */}
        <div className="absolute inset-0 flex items-end justify-center px-[8%] pb-[4%] pt-[10%]">
          {preview.length >= 3 ? (
            <div className="relative flex items-end justify-center w-full h-full">
              <div className="absolute left-[4%] bottom-0 w-[30%] -rotate-[7deg] origin-bottom opacity-65 group-hover:opacity-85 transition-all duration-500 z-0">
                <PhoneFrame src={preview[0]} />
              </div>
              <div className="relative w-[34%] z-10 group-hover:-translate-y-1 transition-all duration-500">
                <PhoneFrame src={preview[1]} />
              </div>
              <div className="absolute right-[4%] bottom-0 w-[30%] rotate-[7deg] origin-bottom opacity-65 group-hover:opacity-85 transition-all duration-500 z-0">
                <PhoneFrame src={preview[2]} />
              </div>
            </div>
          ) : preview.length === 2 ? (
            <div className="flex items-end justify-center w-full h-full gap-[4%]">
              <div className="w-[34%] -rotate-3"><PhoneFrame src={preview[0]} /></div>
              <div className="w-[34%] rotate-3"><PhoneFrame src={preview[1]} /></div>
            </div>
          ) : (
            <div className="w-[36%] group-hover:-translate-y-1 transition-all duration-500">
              <PhoneFrame src={preview[0]} />
            </div>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 z-20">
          <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
            View Project →
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2 py-0.5 rounded text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-white" style={{ background: accent }}>{project.cat}</span>
          <span className="text-[8px] sm:text-[10px] text-white/50 uppercase tracking-wider">{project.sub}</span>
        </div>
        <h3 className="text-xs sm:text-sm font-bold text-white mb-0.5 group-hover:text-[#7eb7be] transition-colors leading-tight truncate">{project.name}</h3>
        <p className="text-[9px] sm:text-[11px] text-white/40 leading-relaxed line-clamp-2">{project.desc}</p>
        {project.screens.length > 1 && (
          <span className="text-[9px] text-[#7eb7be]/60 mt-1 block">{project.screens.length} screens{project.desktopScreens ? ` + ${project.desktopScreens.length} desktop` : ""}</span>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Project Detail Overlay — fullscreen, scrollable
   ═══════════════════════════════════════════ */
function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showDesktop, setShowDesktop] = useState(false);
  const accent = CAT_COLORS[project.cat] || "#7eb7be";
  const screens = showDesktop && project.desktopScreens?.length ? project.desktopScreens : project.screens;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-[#060610] flex flex-col"
      style={{ touchAction: "pan-y" }}
    >
      {/* Top Bar — sticky */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-8 py-3 border-b border-white/[0.06] bg-[#060610]/95 backdrop-blur-md z-50">
        <button onClick={onClose} className="flex items-center gap-1.5 text-white/60 hover:text-white transition text-xs sm:text-sm">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[40%]">{project.name}</span>
        {project.desktopScreens && project.desktopScreens.length > 0 ? (
          <div className="flex gap-0.5 bg-white/[0.06] rounded-full p-0.5">
            <button onClick={() => { setShowDesktop(false); setActiveIdx(0); }} className={`p-1.5 rounded-full transition ${!showDesktop ? "bg-[#7eb7be] text-black" : "text-white/40"}`}><Smartphone className="w-3.5 h-3.5" /></button>
            <button onClick={() => { setShowDesktop(true); setActiveIdx(0); }} className={`p-1.5 rounded-full transition ${showDesktop ? "bg-[#7eb7be] text-black" : "text-white/40"}`}><Monitor className="w-3.5 h-3.5" /></button>
          </div>
        ) : (
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-white/50 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }}>
        {/* Hero section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            {/* Info */}
            <div>
              <div className="flex gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white" style={{ background: accent }}>{project.cat}</span>
                <span className="px-2.5 py-0.5 rounded text-[10px] text-white/50 bg-white/[0.06] uppercase tracking-wider">{project.sub}</span>
              </div>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">{project.name}</h1>
              <p className="text-xs sm:text-sm text-white/40 leading-relaxed mb-4">{project.desc}</p>
              <div className="flex gap-3 text-[10px] sm:text-xs text-white/30">
                <span>{project.screens.length} mobile screens</span>
                {project.desktopScreens && <span>· {project.desktopScreens.length} desktop</span>}
              </div>
            </div>

            {/* Active screen preview */}
            <div className="flex justify-center">
              <div className="relative max-w-[200px] sm:max-w-[240px]">
                <div className="absolute -inset-12 opacity-20 blur-3xl" style={{ background: `radial-gradient(ellipse, ${accent}33, transparent 70%)` }} />
                <img
                  src={screens[activeIdx] || screens[0]}
                  alt={`${project.name} screen ${activeIdx + 1}`}
                  className="relative z-10 w-full rounded-2xl shadow-2xl ring-1 ring-white/10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ALL SCREENS gallery — grid wrap, no overflow */}
        {screens.length > 1 && (
          <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-[3px]">All Screens — {screens.length}</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            {/* Grid that wraps — all screens visible */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
              {screens.map((screen, i) => (
                <button
                  key={`${showDesktop}-${i}`}
                  onClick={() => setActiveIdx(i)}
                  className={`group relative transition-all duration-300 ${
                    i === activeIdx ? "scale-[1.03] z-10" : "opacity-50 hover:opacity-80"
                  }`}
                >
                  {/* iPhone frame */}
                  <div className={`relative aspect-[9/19.5] rounded-[18%/8%] border-[2px] overflow-hidden transition-all duration-300 ${
                    i === activeIdx ? "border-[#7eb7be] shadow-lg shadow-[#7eb7be]/20" : "border-[#2a2a3a] hover:border-white/20"
                  }`} style={{ background: "#0a0a14" }}>
                    {/* Dynamic island */}
                    <div className="absolute top-[3%] left-1/2 -translate-x-1/2 w-[28%] h-[3%] bg-black rounded-full z-20" />
                    {/* Screen */}
                    <div className="absolute inset-[2px] rounded-[16%/7%] overflow-hidden">
                      <img src={screen} alt={`Screen ${i + 1}`} loading="lazy" className="w-full h-full object-cover object-top" />
                    </div>
                    {/* Glass reflection */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
                    {/* Home indicator */}
                    <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[26%] h-[1.5%] bg-white/15 rounded-full z-20" />
                  </div>
                  {/* Label */}
                  <p className="text-[8px] sm:text-[9px] text-white/30 text-center mt-1.5 font-medium">{i + 1}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-10">
          <div className="rounded-xl p-5 sm:p-8 text-center border border-white/[0.06]" style={{ background: "linear-gradient(135deg, rgba(126,183,190,0.06), rgba(108,60,224,0.06))" }}>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1">Vuoi un progetto simile?</h3>
            <p className="text-[10px] sm:text-xs text-white/35 mb-3">Contattaci per una consulenza gratuita.</p>
            <a href="#contact"
              onClick={(e) => { e.preventDefault(); onClose(); setTimeout(() => document.getElementById("team")?.scrollIntoView({ behavior: "smooth" }), 300); }}
              className="inline-flex px-5 py-2 rounded-full bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] text-white font-semibold text-xs sm:text-sm hover:shadow-lg hover:shadow-[#7eb7be]/20 transition-all">
              Richiedi Preventivo →
            </a>
          </div>
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
      <section id="portfolio" className="py-14 sm:py-20 lg:py-28" style={{ background: "linear-gradient(180deg, #020204 0%, #0a0a16 50%, #020204 100%)" }}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div className="mb-6 sm:mb-10" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-[10px] sm:text-[11px] tracking-[3px] uppercase text-[#7eb7be] font-semibold mb-2 block">OUR WORK</span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">Portfolio</h2>

            {/* Filter pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible" style={{ scrollbarWidth: "none" }}>
              {CATS.map((c) => (
                <button key={c} onClick={() => setFilter(c)}
                  className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all border whitespace-nowrap flex-shrink-0 ${
                    c === filter
                      ? "bg-[#7eb7be]/10 border-[#7eb7be]/50 text-[#7eb7be]"
                      : "bg-transparent border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/60"
                  }`}>
                  {c}
                </button>
              ))}
            </div>
            <p className="text-[10px] sm:text-sm text-white/25 mt-2">{items.length} projects · {totalScreens}+ screens</p>
          </motion.div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div key={filter}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {items.map((project, i) => (
                <PortfolioCard key={project.name} project={project} index={i} onClick={() => setSelected(project)} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Stats */}
          <motion.div className="flex gap-6 sm:gap-10 justify-center mt-10 sm:mt-14 pt-6 border-t border-white/[0.06]"
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
