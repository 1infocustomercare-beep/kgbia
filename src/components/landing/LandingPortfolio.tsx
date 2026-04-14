import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { SECTOR_PORTFOLIO, type SectorPortfolio } from "@/data/sector-mockup-images";

/* ═══════════════════════════════════════════
   Build flat project list from SECTOR_PORTFOLIO
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
  styleName?: string;
}

const SECTOR_CAT_MAP: Record<string, string> = {
  food: "Food",
  beauty: "Beauty & Wellness",
  ncc: "Travel & Transport",
  fitness: "Fitness & Sport",
  healthcare: "Healthcare",
  veterinary: "Pet Care",
  childcare: "Education",
  plumber: "Home Services",
  beach: "Watersports",
  hospitality: "Hospitality",
  construction: "Real Estate",
  retail: "E-Commerce",
};

const BRAND_META: Record<string, { desc: string; sub: string; platform: string }> = {
  "COTE Miami": { desc: "Michelin-starred Korean steakhouse – 6 luxury design styles, mobile + desktop webapp.", sub: "Korean Steakhouse", platform: "iOS, Android & Web" },
  "Paperfish Sushi": { desc: "Premium sushi ordering – 12 unique visual styles from sakura to arctic crystal.", sub: "Japanese & Nikkei", platform: "iOS & Android" },
  "La Vang Vietnamese": { desc: "Luxury Vietnamese cuisine – 8 mobile + 4 desktop styles. Noir Saigon, Jade Dynasty, Crimson Silk.", sub: "Vietnamese Luxury", platform: "iOS & Android" },
  "Batey Cevicheria": { desc: "Peruvian cevicheria premium – Costa del Pacifico, Casa Nostra, Bianco & Memoria, Ocra di Lima.", sub: "Peruvian", platform: "iOS & Android" },
  "Midtown Kosher": { desc: "Premium kosher restaurant – 8 proposte di stile in palette israeliana blu/bianco.", sub: "Kosher Restaurant", platform: "Web App" },
  "Flame Kebab": { desc: "Vibrant food ordering app – real-time order tracking and customization.", sub: "Kebab & Grill", platform: "iOS & Android" },
  "Neo Nails Brickell": { desc: "Premium nail salon – glassmorphism, lavender-peach-sky gradients, Apple Vision Pro aesthetic.", sub: "Nails & Beauty", platform: "iOS & Android" },
  "Tatush Hair Fragrance": { desc: "Hair fragrance brand – Fresh Minimal Blanc: bianco puro, rosa cipria, accenti rose gold.", sub: "Hair & Beauty", platform: "iOS & Android" },
  "Miami Boats Rental": { desc: "Luxury yacht & boat rental – 80+ boats, 5 design styles: Miami Vibrant, Ocean Deep, Azure Coast.", sub: "Boat & Yacht", platform: "Web App" },
  "Asinara Charter": { desc: "Sardinian luxury charter – tour packages, snorkeling, group booking. Azure + warm gold palette.", sub: "Mediterranean Charter", platform: "Web App" },
  "Aloha Pet Resorts": { desc: "Premium pet care – live camera feeds, pet profiles, resort management. 4 mobile + 4 desktop styles.", sub: "Pet Care & Resort", platform: "iOS & Android" },
  "Little Diamond Nursery": { desc: "Premium nursery for Dubai – 5 playful styles: Colorful, Nature, Ocean, Sunny, Sunset.", sub: "Nursery & Childcare", platform: "Web App" },
  "Ashley's Playhouse": { desc: "Drop-in childcare Austin TX – 4 autumn-themed styles with activity booking.", sub: "Childcare & Play", platform: "Web App" },
  "City Padel Milano": { desc: "Premium padel club Milano CityLife – 5 design styles, court booking, coach profiles.", sub: "Padel & Sport", platform: "Web App" },
  "Miami Watersports": { desc: "Jet ski, parasailing, flyboard – 4 tropical design styles for Miami watersports.", sub: "Watersports", platform: "Web App" },
  "Nick's Plumbing & AC": { desc: "Home services booking – Houston TX. iOS 18 design with 2 style proposals.", sub: "Plumbing & HVAC", platform: "Web App" },
  "FAR Medical Solutions": { desc: "Medical devices platform – 4 light mode premium styles: Ethereal Glass, Azure Gradient, Ice Crystal.", sub: "Medical Devices", platform: "Web App" },
  "MMI Resident Hub": { desc: "Luxury condo resident portal – 4 white luxury styles. Amenity booking, maintenance requests.", sub: "Luxury Condo & HOA", platform: "Web App" },
};

function buildProjects(): Project[] {
  const projects: Project[] = [];

  for (const sector of SECTOR_PORTFOLIO) {
    const cat = SECTOR_CAT_MAP[sector.sectorId] || sector.sectorLabel;

    for (const brand of sector.brands) {
      const meta = BRAND_META[brand.name] || {
        desc: `Premium ${cat.toLowerCase()} app with multiple design styles.`,
        sub: cat,
        platform: "iOS & Android",
      };

      // Collect ALL screens across all styles for this brand
      const allScreens: string[] = [];
      const allDesktopScreens: string[] = [];

      for (const style of brand.styles) {
        for (const s of style.screens) {
          if (!allScreens.includes(s)) allScreens.push(s);
        }
        if (style.desktopScreens) {
          for (const d of style.desktopScreens) {
            if (!allDesktopScreens.includes(d)) allDesktopScreens.push(d);
          }
        }
      }

      // Use first 3 screens for preview, keep all for detail
      projects.push({
        name: brand.name,
        cat,
        sub: meta.sub,
        desc: meta.desc,
        client: brand.name,
        year: "2025",
        platform: meta.platform,
        screens: allScreens,
        desktopScreens: allDesktopScreens.length > 0 ? allDesktopScreens : undefined,
      });
    }
  }

  // Add extra projects not in SECTOR_PORTFOLIO
  const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";
  const extras: Project[] = [
    {
      name: "Otomaki Sushi", cat: "Food", sub: "Sushi",
      desc: "Immersive sushi ordering with custom roll builder and table reservation.",
      client: "Otomaki Sushi", year: "2025", platform: "iOS & Android",
      screens: [
        `${S}/migrated-1773167901906-9e1e562a9a71c0a8aed3ac62c7a611a0-1772904882643.png`,
        `${S}/migrated-1773167902215-cc78c59f3e7ac20af97500c2150ee325-1772904886788.png`,
        `${S}/migrated-1773167902581-874b87d01f2114131311e5cee0b273ae-1772904891706.png`,
      ],
    },
    {
      name: "La Patrona", cat: "Food", sub: "Mexican",
      desc: "Culturally rich restaurant app with traditional menus, reservations, and catering.",
      client: "La Patrona", year: "2025", platform: "iOS & Android",
      screens: [
        `${S}/migrated-1773167903321-8f595dd2f0fbb30d4310e2d299c2f260-1772838544173.png`,
        `${S}/migrated-1773167903695-5b07a42263dfcbcbd5de69be1e4a7433-1772838638563.png`,
        `${S}/migrated-1773167904054-7297a6739fd678e2e2a0c96eaa0fe9e1-1772838655677.png`,
      ],
    },
    {
      name: "Papagua", cat: "Food", sub: "Energy & Bowls",
      desc: "Tropical-themed food app with custom bowl builder, rewards program, and express ordering.",
      client: "Papagua", year: "2025", platform: "iOS & Android",
      screens: [`${S}/migrated-1773167904818-09cd270c062b9d2856b48b9f63f7c234-1772881106900.png`],
    },
    {
      name: "Meridia Rental Car", cat: "Travel & Transport", sub: "Car Rental",
      desc: "Sleek car rental with real-time availability, booking management, and trip dashboards.",
      client: "Meridia Rental", year: "2025", platform: "Web App",
      screens: [
        `${S}/migrated-1773167906872-821da26dd0f0fec05286424b7e1d3a11-1772620868489.png`,
        `${S}/migrated-1773167907191-360951700ee2756f3cb37cc9119ba26f-1772620944505.png`,
        `${S}/migrated-1773167907500-cecfe2b244765df008519b7024925b5b-1772620948139.png`,
      ],
    },
    {
      name: "Aura Milano Spa", cat: "Beauty & Wellness", sub: "Wellness & Spa",
      desc: "Luxury spa wellness app Milano – 4 stili x 4 schermate. React TypeScript responsive.",
      client: "Aura Milano Spa", year: "2025", platform: "iOS & Android",
      screens: [
        `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`,
        `${S}/Aura%20Milano%20Spa/mobile-luce-pura-trattamenti.png`,
        `${S}/Aura%20Milano%20Spa/mobile-luce-pura-dettaglio.png`,
      ],
    },
    {
      name: "DIMORA Milano", cat: "Real Estate", sub: "Real Estate",
      desc: "Premium real estate app Milano – 6 proposte: Eleganza Milanese, Nero Lusso, Verde Urbano.",
      client: "DIMORA Milano", year: "2025", platform: "iOS & Android",
      screens: [
        `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`,
        `${S}/DIMORA%20Milano/eleganza-milanese-annunci-mobile.png`,
        `${S}/DIMORA%20Milano/eleganza-milanese-dettaglio-mobile.png`,
      ],
    },
    {
      name: "Pokewaii Brescia", cat: "Food", sub: "Poke & Hawaiian",
      desc: "Pokeria hawaiana Brescia – 4 stili: Tropical Hawaiano, Sunset Aloha, Fresh & Clean, Dark Tiki.",
      client: "Pokewaii Brescia", year: "2025", platform: "iOS & Android",
      screens: [
        `${S}/Pokewaii%20Brescia/mobile-a-tropical-home.png`,
        `${S}/Pokewaii%20Brescia/mobile-a-tropical-menu.png`,
        `${S}/Pokewaii%20Brescia/mobile-a-tropical-detail.png`,
      ],
    },
    {
      name: "Orygano Pizzeria", cat: "Food", sub: "Pizza Gourmet",
      desc: "Pizzeria Gourmet Catania – Dark Gourmet Natural con AI Recensioni e AI Previsione Domanda.",
      client: "Orygano Pizzeria", year: "2025", platform: "iOS & Android",
      screens: [
        `${S}/Orygano%20Pizzeria%20Gourmet/mobile-home.png`,
        `${S}/Orygano%20Pizzeria%20Gourmet/mobile-menu.png`,
        `${S}/Orygano%20Pizzeria%20Gourmet/mobile-detail.png`,
      ],
    },
    {
      name: "STRAPIZZAMI", cat: "Food", sub: "Pizza",
      desc: "Premium pizza ordering app – Italian-style design with warm colors and delivery tracking.",
      client: "STRAPIZZAMI", year: "2025", platform: "iOS & Android",
      screens: [`${S}/STRAPIZZAMI/stile-a-home.png`],
    },
    {
      name: "LuxDrive", cat: "Travel & Transport", sub: "NCC & Chauffeur",
      desc: "Premium luxury chauffeur service – real-time booking, fleet management, VIP experience.",
      client: "LuxDrive", year: "2025", platform: "iOS & Android",
      screens: [`${S}/LuxDrive/style-a-home.png`],
    },
    {
      name: "Top Golf Bay", cat: "Fitness & Sport", sub: "Golf & Sport",
      desc: "Premium golf booking and social app – tee time reservations, score tracking, member community.",
      client: "Top Golf Bay", year: "2025", platform: "Web App",
      screens: [`${S}/Top%20Golf%20Bay%20App/a-official-home.png`],
    },
  ];

  // Don't add duplicates
  const existingNames = new Set(projects.map(p => p.name));
  for (const e of extras) {
    if (!existingNames.has(e.name)) {
      projects.push(e);
    }
  }

  return projects;
}

const ALL_PROJECTS = buildProjects();

const CAT_COLORS: Record<string, string> = {
  "Food": "#e67e22",
  "Beauty & Wellness": "#ec4899",
  "Travel & Transport": "#1abc9c",
  "Fitness & Sport": "#22d3ee",
  "Healthcare": "#3b82f6",
  "Pet Care": "#4ade80",
  "Education": "#f39c12",
  "Home Services": "#64748b",
  "Watersports": "#06b6d4",
  "Hospitality": "#c9a84c",
  "Real Estate": "#a855f7",
  "E-Commerce": "#9b59b6",
};

/* ═══════════════════════════════════════════
   iPhone Frame Component
   ═══════════════════════════════════════════ */
function PhoneFrame({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) return null;

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <div className="w-full aspect-[9/19.5] rounded-[20px] border-[2.5px] border-[#3a3a4a] overflow-hidden bg-[#0a0a14] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[32%] h-[22px] bg-black rounded-full z-10" />
        <div className="absolute inset-[2px] rounded-[18px] overflow-hidden">
          {!loaded && <div className="w-full h-full bg-gradient-to-b from-[#1a1a2e] to-[#0a0a14] animate-pulse" />}
          <img
            src={src} alt={alt} loading="lazy"
            className={`w-full h-full object-cover object-top transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        </div>
        <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-[28%] h-[3px] bg-white/15 rounded-full z-10" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Portfolio Card
   ═══════════════════════════════════════════ */
function PortfolioCard({ project, onClick, index }: { project: Project; onClick: () => void; index: number }) {
  const previewScreens = project.screens.slice(0, 3);

  return (
    <motion.div
      className="group cursor-pointer rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.14] transition-all duration-500"
      style={{ background: "linear-gradient(180deg, #0d0d1a 0%, #080812 100%)" }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: (index % 3) * 0.1, duration: 0.5 }}
      onClick={onClick}
    >
      <div className="relative flex items-end justify-center gap-3 px-6 pt-8 pb-4 min-h-[220px] sm:min-h-[280px]">
        <div className="absolute inset-0 opacity-30"
          style={{ background: `radial-gradient(ellipse at 50% 80%, ${CAT_COLORS[project.cat] || "#7eb7be"}22, transparent 70%)` }} />

        {previewScreens.length >= 3 ? (
          <>
            <PhoneFrame src={previewScreens[0]} alt={project.name} className="w-[90px] sm:w-[100px] -rotate-3 translate-y-2 opacity-80 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-500" />
            <PhoneFrame src={previewScreens[1]} alt={project.name} className="w-[100px] sm:w-[115px] z-10 group-hover:-translate-y-2 transition-all duration-500" />
            <PhoneFrame src={previewScreens[2]} alt={project.name} className="w-[90px] sm:w-[100px] rotate-3 translate-y-2 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500" />
          </>
        ) : previewScreens.length === 2 ? (
          <>
            <PhoneFrame src={previewScreens[0]} alt={project.name} className="w-[100px] sm:w-[115px] -rotate-2 group-hover:-translate-x-1 transition-all duration-500" />
            <PhoneFrame src={previewScreens[1]} alt={project.name} className="w-[100px] sm:w-[115px] rotate-2 group-hover:translate-x-1 transition-all duration-500" />
          </>
        ) : (
          <PhoneFrame src={previewScreens[0]} alt={project.name} className="w-[115px] sm:w-[130px] group-hover:-translate-y-2 transition-all duration-500" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold tracking-wide">
            VIEW PROJECT →
          </span>
        </div>
      </div>

      <div className="px-5 pb-5 pt-2">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
            style={{ background: CAT_COLORS[project.cat] || "#7eb7be" }}>
            {project.cat}
          </span>
          <span className="text-[10px] text-white/40 uppercase tracking-wider font-medium">{project.sub}</span>
        </div>
        <h3 className="text-sm sm:text-base font-bold text-white mb-1 group-hover:text-[#7eb7be] transition-colors">{project.name}</h3>
        <p className="text-[11px] sm:text-xs text-white/40 leading-relaxed line-clamp-2">{project.desc}</p>
        {project.screens.length > 3 && (
          <span className="text-[10px] text-[#7eb7be]/60 mt-1.5 block">{project.screens.length} screens</span>
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

  const currentScreens = showDesktop && project.desktopScreens?.length ? project.desktopScreens : project.screens;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => { setActiveScreen(0); }, [showDesktop]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] overflow-y-auto"
      style={{ background: "linear-gradient(180deg, #080812 0%, #0d0d1a 50%, #080812 100%)" }}
    >
      {/* Top Bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3 backdrop-blur-xl bg-[#080812]/80 border-b border-white/[0.06]">
        <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] transition text-white/70 hover:text-white text-sm">
          <ArrowLeft className="w-4 h-4" /> Portfolio
        </button>
        <span className="text-sm font-bold text-white hidden sm:block">{project.name}</span>
        {project.desktopScreens && project.desktopScreens.length > 0 && (
          <div className="flex gap-1 bg-white/[0.06] rounded-full p-0.5">
            <button onClick={() => setShowDesktop(false)}
              className={`px-3 py-1 rounded-full text-xs transition ${!showDesktop ? "bg-[#7eb7be] text-black font-bold" : "text-white/50"}`}>
              Mobile
            </button>
            <button onClick={() => setShowDesktop(true)}
              className={`px-3 py-1 rounded-full text-xs transition ${showDesktop ? "bg-[#7eb7be] text-black font-bold" : "text-white/50"}`}>
              Desktop
            </button>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex gap-2 mb-4 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5"
                style={{ background: CAT_COLORS[project.cat] || "#7eb7be" }}>
                <span className="w-1.5 h-1.5 bg-white rounded-full" />{project.cat}
              </span>
              <span className="px-3 py-1 rounded-full text-xs text-white/60 bg-white/[0.06] uppercase tracking-wider">{project.sub}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight" style={{ borderLeft: "3px solid #7eb7be", paddingLeft: "16px" }}>
              {project.name}
            </h1>
            <p className="text-sm sm:text-base text-white/50 leading-relaxed mb-8">{project.desc}</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <span className="text-[10px] text-white/30 uppercase tracking-wider flex items-center gap-1.5"><span className="text-[#7eb7be]">◆</span> CLIENT</span>
                <p className="text-sm font-semibold text-white mt-1">{project.client}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <span className="text-[10px] text-white/30 uppercase tracking-wider flex items-center gap-1.5"><span className="text-[#7eb7be]">◎</span> YEAR</span>
                <p className="text-sm font-semibold text-white mt-1">{project.year}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <span className="text-[10px] text-white/30 uppercase tracking-wider flex items-center gap-1.5"><span className="text-[#7eb7be]">○</span> PLATFORM</span>
                <p className="text-sm font-semibold text-white mt-1">{project.platform}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <span className="text-[10px] text-white/30 uppercase tracking-wider flex items-center gap-1.5"><span className="text-[#7eb7be]">◇</span> SCREENS</span>
                <p className="text-sm font-semibold text-white mt-1">{project.screens.length}{project.desktopScreens ? ` + ${project.desktopScreens.length} desktop` : ""}</p>
              </div>
            </div>
          </motion.div>

          <motion.div className="flex justify-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <div className="relative">
              <div className="absolute -inset-20 opacity-40 blur-3xl"
                style={{ background: `radial-gradient(ellipse, ${CAT_COLORS[project.cat] || "#7eb7be"}33, transparent 70%)` }} />
              <PhoneFrame
                src={currentScreens[activeScreen] || currentScreens[0]}
                alt={`${project.name} screen ${activeScreen + 1}`}
                className="w-[200px] sm:w-[250px] relative z-10"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ALL SCREENS Gallery */}
      {currentScreens.length > 1 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-bold text-white/40 uppercase tracking-[3px]">
              ALL SCREENS — {currentScreens.length} {showDesktop ? "DESKTOP" : "MOBILE"}
            </span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
            {currentScreens.map((screen, i) => (
              <motion.button
                key={`${showDesktop}-${i}`}
                onClick={() => setActiveScreen(i)}
                className={`flex-shrink-0 snap-center transition-all duration-300 ${i === activeScreen ? "scale-105 ring-2 ring-[#7eb7be]/50 rounded-2xl" : "opacity-60 hover:opacity-100"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <PhoneFrame src={screen} alt={`Screen ${i + 1}`} className="w-[120px] sm:w-[140px]" />
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-16">
        <div className="rounded-2xl p-8 text-center border border-white/[0.06]"
          style={{ background: "linear-gradient(135deg, rgba(126,183,190,0.08), rgba(108,60,224,0.08))" }}>
          <h3 className="text-xl font-bold text-white mb-2">Vuoi un progetto simile?</h3>
          <p className="text-sm text-white/40 mb-4">Contattaci per una consulenza gratuita e un preventivo personalizzato.</p>
          <a href="#contact"
            onClick={(e) => { e.preventDefault(); onClose(); setTimeout(() => document.getElementById("team")?.scrollIntoView({ behavior: "smooth" }), 300); }}
            className="inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] text-white font-semibold text-sm hover:shadow-lg hover:shadow-[#7eb7be]/20 transition-all">
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

  const CATS = useMemo(() => {
    const cats = Array.from(new Set(ALL_PROJECTS.map(p => p.cat)));
    return ["All", ...cats.sort()];
  }, []);

  const items = filter === "All" ? ALL_PROJECTS : ALL_PROJECTS.filter(p => p.cat === filter);
  const totalScreens = ALL_PROJECTS.reduce((sum, p) => sum + p.screens.length + (p.desktopScreens?.length || 0), 0);

  return (
    <>
      <section id="portfolio" className="py-20 lg:py-32" style={{ background: "linear-gradient(180deg, #020204 0%, #0a0a18 50%, #020204 100%)" }}>
        <div className="max-w-[1320px] mx-auto px-5">
          <motion.div className="mb-10"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-[11px] tracking-[3px] uppercase text-[#7eb7be] font-semibold mb-3 block">OUR WORK</span>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-white leading-tight">Portfolio</h2>
              <div className="flex gap-2 flex-wrap">
                {CATS.map((c) => (
                  <button key={c} onClick={() => setFilter(c)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                      c === filter
                        ? "bg-[#0d1b2f] border-[#7eb7be] text-[#7eb7be] shadow-[0_0_12px_rgba(126,183,190,0.15)]"
                        : "bg-transparent border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/70"
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-sm text-white/30 mt-3">{items.length} projects · {totalScreens}+ screens</p>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {items.map((project, i) => (
                <PortfolioCard key={project.name} project={project} index={i} onClick={() => setSelected(project)} />
              ))}
            </motion.div>
          </AnimatePresence>

          <motion.div className="flex gap-10 justify-center mt-14 pt-8 border-t border-white/[0.06]"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            {[
              [ALL_PROJECTS.length + "+", "Apps Launched"],
              [totalScreens + "+", "Screens Designed"],
              ["25+", "Industry Sectors"],
            ].map(([v, l]) => (
              <div key={String(l)} className="text-center">
                <strong className="text-2xl font-extrabold bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent block">{v}</strong>
                <span className="text-[11px] text-white/40">{l}</span>
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
