import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { X, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

/* ═══════════════════════════════════════════
   Portfolio Data — real projects with screens
   ═══════════════════════════════════════════ */
interface Project {
  name: string;
  cat: string;
  sub: string;
  desc: string;
  client?: string;
  year?: string;
  platform?: string;
  screens: string[];
  land?: boolean;
}

const PROJECTS: Project[] = [
  {
    name: "Flame Kebab", cat: "Food", sub: "Kebab",
    desc: "A vibrant food ordering app for a premium kebab chain, featuring real-time order tracking and customization.",
    client: "Flame Kebab Ltd.", year: "2025", platform: "iOS & Android",
    screens: [
      `${S}/flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png`,
      `${S}/flame-kebab/730290ed-5bf6-485f-b999-b75602a57d11.png`,
      `${S}/flame-kebab/c31559c3-67cf-4f62-b4e7-74833046eda7.png`,
    ],
  },
  {
    name: "Aloha Pet Resorts", cat: "Lifestyle", sub: "Pet Care",
    desc: "A premium pet care booking platform with live camera feeds, pet profiles, and resort management.",
    client: "Aloha Pet Resorts", year: "2025", platform: "iOS & Android",
    screens: [
      `${S}/Aloha%20Pet%20Resorts/mobile-a-home.png`,
      `${S}/Aloha%20Pet%20Resorts/mobile-a-services.png`,
      `${S}/Aloha%20Pet%20Resorts/mobile-a-detail.png`,
    ],
  },
  {
    name: "COTE Miami", cat: "Food", sub: "Korean Steakhouse",
    desc: "Michelin-starred Korean steakhouse in Miami's Design District. Premium mobile + desktop webapp with 6 luxury design styles.",
    client: "COTE Miami", year: "2025", platform: "iOS & Android",
    screens: [
      `${S}/COTE%20Miami/a-obsidian-mobile-home.png`,
      `${S}/COTE%20Miami/a-obsidian-mobile-menu.png`,
      `${S}/COTE%20Miami/a-obsidian-mobile-detail.png`,
    ],
  },
  {
    name: "Aura Milano Spa", cat: "App Design", sub: "Wellness",
    desc: "Luxury spa wellness app Milano. 4 stili x 4 schermate x 2 versioni. 32 mockup. React TypeScript responsive.",
    client: "Aura Milano Spa", year: "2025", platform: "iOS & Android",
    screens: [
      `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`,
      `${S}/Aura%20Milano%20Spa/mobile-luce-pura-trattamenti.png`,
      `${S}/Aura%20Milano%20Spa/mobile-luce-pura-dettaglio.png`,
    ],
  },
  {
    name: "Neo Nails Brickell", cat: "App Design", sub: "Nails",
    desc: "Premium nail salon app with Frosted Glass design — glassmorphism, translucent panels, lavender-peach-sky gradients.",
    client: "Neo Nails Brickell", year: "2025", platform: "iOS & Android",
    screens: [
      `${S}/Neo%20Nails%20Brickell/frosted-glass-home.png`,
      `${S}/Neo%20Nails%20Brickell/frosted-glass-servizi.png`,
      `${S}/Neo%20Nails%20Brickell/frosted-glass-dettaglio.png`,
    ],
  },
  {
    name: "Paperfish Sushi", cat: "Food", sub: "Sushi",
    desc: "Premium mobile-first sushi ordering app for Paperfish Sushi. 12 unique visual styles exploring sakura and Japanese aesthetics.",
    client: "Paperfish Sushi", year: "2025", platform: "iOS & Android",
    screens: [
      `${S}/Paperfish%20Sushi/a-sakura-home.png`,
      `${S}/Paperfish%20Sushi/a-sakura-menu.png`,
      `${S}/Paperfish%20Sushi/a-sakura-detail.png`,
    ],
  },
  {
    name: "City Padel Milano", cat: "App Design", sub: "Sport",
    desc: "Webapp iOS 18-style per campo da padel premium a Milano CityLife. Sistema di prenotazione campi, profili maestri, corsi.",
    client: "City Padel Milano", year: "2025", platform: "Web App",
    screens: [
      `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-home.png`,
      `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-prenota.png`,
      `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-maestri.png`,
    ],
  },
  {
    name: "MMI Resident Hub", cat: "App Design", sub: "Luxury Condo",
    desc: "Luxury condo resident portal for Miami high-rise towers. Resident dashboard, amenity booking, maintenance requests.",
    client: "MMI Residences", year: "2025", platform: "Web App", land: true,
    screens: [
      `${S}/MMI%20Resident%20Hub/01-ocean-azure-desktop-dashboard.png`,
    ],
  },
  {
    name: "La Vang Vietnamese", cat: "Food", sub: "Vietnamese",
    desc: "8 stili mobile + 4 stili desktop per app ristorante vietnamita luxury a Beverly Hills. Noir Saigon, Jade Dynasty e altro.",
    client: "La Vang Restaurant", year: "2025", platform: "iOS & Android",
    screens: [
      `${S}/La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-home.png`,
      `${S}/La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-menu.png`,
      `${S}/La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-detail.png`,
    ],
  },
  {
    name: "Miami Boats Rental", cat: "App Design", sub: "Boat Rental",
    desc: "Premium luxury yacht & boat rental webapp for Miami. 80+ boats, 5 design styles. Mobile (iOS 18) + desktop versions.",
    client: "Miami Boats Rental", year: "2025", platform: "Web App",
    screens: [
      `${S}/Miami%20Boats%20Rental/A-mobile-home.png`,
      `${S}/Miami%20Boats%20Rental/A-mobile-fleet.png`,
      `${S}/Miami%20Boats%20Rental/A-mobile-yacht-detail.png`,
    ],
  },
  {
    name: "Tatush Hair Fragrance", cat: "E-Commerce", sub: "Beauty",
    desc: "Premium hair fragrance brand. Design Fresh Minimal Blanc: bianco puro, rosa cipria, accenti rose gold. Webapp mobile + sito desktop.",
    client: "Tatush Hair", year: "2025", platform: "iOS & Android",
    screens: [
      `${S}/Tatush%20Hair%20Fragrance/mobile-home.png`,
      `${S}/Tatush%20Hair%20Fragrance/mobile-shop.png`,
      `${S}/Tatush%20Hair%20Fragrance/mobile-detail.png`,
    ],
  },
  {
    name: "DIMORA Milano", cat: "App Design", sub: "Real Estate",
    desc: "App immobiliare premium per agenzia di Milano. 6 proposte di stile: Eleganza Milanese, Nero Lusso, Verde Urbano.",
    client: "DIMORA Milano", year: "2025", platform: "iOS & Android",
    screens: [
      `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`,
      `${S}/DIMORA%20Milano/eleganza-milanese-annunci-mobile.png`,
      `${S}/DIMORA%20Milano/eleganza-milanese-dettaglio-mobile.png`,
    ],
  },
  {
    name: "LuxDrive", cat: "App Design", sub: "NCC",
    desc: "Premium luxury chauffeur service app. Real-time booking, fleet management, and VIP client experience.",
    client: "LuxDrive", year: "2025", platform: "iOS & Android",
    screens: [
      `${S}/LuxDrive/style-a-home.png`,
    ],
  },
  {
    name: "Little Diamond Nursery", cat: "Education", sub: "Nursery",
    desc: "Premium nursery app for Dubai. Playful Colorful — giallo sole, azzurro cielo, rosa corallo. Child-friendly con qualità premium.",
    client: "Little Diamond", year: "2025", platform: "Web App",
    screens: [
      `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/home.png`,
      `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/programs-activities.png`,
      `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/team-tour.png`,
    ],
  },
  {
    name: "Asinara Charter", cat: "Travel", sub: "Mediterranean Luxury",
    desc: "Mobile-first luxury charter booking app for Asinara Charter, Stintino (Sardegna). Sardinia Azure Luxury style.",
    client: "Asinara Charter", year: "2025", platform: "Web App",
    screens: [
      `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png`,
      `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/escursioni.png`,
      `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/dettaglio-tour.png`,
    ],
  },
  {
    name: "FAR Medical Solutions", cat: "Web Design", sub: "Medical",
    desc: "Webapp mobile + desktop per azienda di dispositivi medici. 4 stili light mode premium: Ethereal Glass, Azure Gradient Flow.",
    client: "FAR Medical", year: "2025", platform: "Web App",
    screens: [
      `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png`,
      `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-servizi.png`,
      `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-prodotti.png`,
    ],
  },
  {
    name: "Midtown Kosher", cat: "Web Design", sub: "Food & Restaurant",
    desc: "Premium desktop web app per ristorante kosher a Miami. 4 proposte di stile in palette israeliana blu/bianco.",
    client: "Midtown Kosher", year: "2025", platform: "Web App", land: true,
    screens: [
      `${S}/Midtown%20Kosher/style-a-home.png`,
    ],
  },
  {
    name: "Batey Cevicheria", cat: "Food", sub: "Peruvian",
    desc: "Premium Peruvian cevicheria app — Mobile + Desktop mockups in 4 styles. Luxury Peruvian dining experience in Milan.",
    client: "Batey Cevicheria", year: "2025", platform: "iOS & Android",
    screens: [
      `${S}/Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-home.png`,
      `${S}/Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-menu.png`,
      `${S}/Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-detail.png`,
    ],
  },
  {
    name: "STRAPIZZAMI", cat: "Food", sub: "Pizza",
    desc: "Premium pizza ordering app. Italian-style design with warm colors, custom pizza builder, and delivery tracking.",
    client: "STRAPIZZAMI", year: "2025", platform: "iOS & Android",
    screens: [
      `${S}/STRAPIZZAMI/stile-a-home.png`,
    ],
  },
  {
    name: "Top Golf Bay", cat: "App Design", sub: "Golf",
    desc: "Premium golf booking and social app. Tee time reservations, score tracking, and member community.",
    client: "Top Golf Bay", year: "2025", platform: "Web App",
    screens: [
      `${S}/Top%20Golf%20Bay%20App/a-official-home.png`,
    ],
  },
];

const CATS = ["All", ...Array.from(new Set(PROJECTS.map(p => p.cat)))];

const CAT_COLORS: Record<string, string> = {
  Food: "#e67e22",
  Lifestyle: "#27ae60",
  "App Design": "#3498db",
  "E-Commerce": "#9b59b6",
  Travel: "#1abc9c",
  Education: "#f39c12",
  "Web Design": "#e74c3c",
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
   Portfolio Card — with 2-3 phone stack
   ═══════════════════════════════════════════ */
function PortfolioCard({ project, onClick, index }: { project: Project; onClick: () => void; index: number }) {
  return (
    <motion.div
      className={`group cursor-pointer rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.14] transition-all duration-500 ${project.land ? "sm:col-span-2" : ""}`}
      style={{ background: "linear-gradient(180deg, #0d0d1a 0%, #080812 100%)" }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: (index % 3) * 0.1, duration: 0.5 }}
      onClick={onClick}
    >
      {/* Phone Mockup Stack */}
      <div className={`relative flex items-end justify-center gap-3 px-6 pt-8 pb-4 min-h-[220px] sm:min-h-[280px] ${project.land ? "min-h-[200px]" : ""}`}>
        {/* Ambient glow */}
        <div className="absolute inset-0 opacity-30"
          style={{ background: `radial-gradient(ellipse at 50% 80%, ${CAT_COLORS[project.cat] || "#7eb7be"}22, transparent 70%)` }} />

        {project.land ? (
          <PhoneFrame src={project.screens[0]} alt={project.name} className="w-[60%] max-w-[280px]" />
        ) : project.screens.length >= 3 ? (
          <>
            <PhoneFrame src={project.screens[0]} alt={project.name} className="w-[90px] sm:w-[100px] -rotate-3 translate-y-2 opacity-80 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-500" />
            <PhoneFrame src={project.screens[1]} alt={project.name} className="w-[100px] sm:w-[115px] z-10 group-hover:-translate-y-2 transition-all duration-500" />
            <PhoneFrame src={project.screens[2]} alt={project.name} className="w-[90px] sm:w-[100px] rotate-3 translate-y-2 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500" />
          </>
        ) : project.screens.length === 2 ? (
          <>
            <PhoneFrame src={project.screens[0]} alt={project.name} className="w-[100px] sm:w-[115px] -rotate-2 group-hover:-translate-x-1 transition-all duration-500" />
            <PhoneFrame src={project.screens[1]} alt={project.name} className="w-[100px] sm:w-[115px] rotate-2 group-hover:translate-x-1 transition-all duration-500" />
          </>
        ) : (
          <PhoneFrame src={project.screens[0]} alt={project.name} className="w-[115px] sm:w-[130px] group-hover:-translate-y-2 transition-all duration-500" />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold tracking-wide">
            VIEW PROJECT →
          </span>
        </div>
      </div>

      {/* Info */}
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
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Project Detail Overlay — full screen
   ═══════════════════════════════════════════ */
function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  const [activeScreen, setActiveScreen] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

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
        <span className="text-sm font-bold text-white">{project.name}</span>
        <div className="flex gap-1.5">
          {project.screens.map((_, i) => (
            <button key={i} onClick={() => setActiveScreen(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeScreen ? "bg-[#7eb7be] scale-125" : "bg-white/20 hover:bg-white/40"}`} />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Info */}
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
              {project.client && (
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <span className="text-[10px] text-white/30 uppercase tracking-wider flex items-center gap-1.5"><span className="text-[#7eb7be]">◆</span> CLIENT</span>
                  <p className="text-sm font-semibold text-white mt-1">{project.client}</p>
                </div>
              )}
              {project.year && (
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <span className="text-[10px] text-white/30 uppercase tracking-wider flex items-center gap-1.5"><span className="text-[#7eb7be]">◎</span> YEAR</span>
                  <p className="text-sm font-semibold text-white mt-1">{project.year}</p>
                </div>
              )}
              {project.platform && (
                <div className="col-span-2 p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <span className="text-[10px] text-white/30 uppercase tracking-wider flex items-center gap-1.5"><span className="text-[#7eb7be]">○</span> PLATFORM</span>
                  <p className="text-sm font-semibold text-white mt-1">{project.platform}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right — Featured Phone */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative">
              <div className="absolute -inset-20 opacity-40 blur-3xl"
                style={{ background: `radial-gradient(ellipse, ${CAT_COLORS[project.cat] || "#7eb7be"}33, transparent 70%)` }} />
              <PhoneFrame
                src={project.screens[activeScreen]}
                alt={`${project.name} screen ${activeScreen + 1}`}
                className="w-[200px] sm:w-[250px] relative z-10"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ALL SCREENS Gallery */}
      {project.screens.length > 1 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-bold text-white/40 uppercase tracking-[3px]">ALL SCREENS</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {project.screens.map((screen, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveScreen(i)}
                className={`flex-shrink-0 snap-center transition-all duration-300 ${i === activeScreen ? "scale-105 ring-2 ring-[#7eb7be]/50 rounded-2xl" : "opacity-60 hover:opacity-100"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <PhoneFrame src={screen} alt={`Screen ${i + 1}`} className="w-[140px] sm:w-[160px]" />
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
   MAIN EXPORT — Portfolio Section
   ═══════════════════════════════════════════ */
export default function LandingPortfolio() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const items = filter === "All" ? PROJECTS : PROJECTS.filter(p => p.cat === filter);
  const count = items.length;

  return (
    <>
      <section id="portfolio" className="py-20 lg:py-32" style={{ background: "linear-gradient(180deg, #020204 0%, #0a0a18 50%, #020204 100%)" }}>
        <div className="max-w-[1320px] mx-auto px-5">
          {/* Header */}
          <motion.div className="mb-10"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-[11px] tracking-[3px] uppercase text-[#7eb7be] font-semibold mb-3 block">OUR WORK</span>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-white leading-tight">Portfolio</h2>
              {/* Filter Pills */}
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
            <p className="text-sm text-white/30 mt-3">{count} projects</p>
          </motion.div>

          {/* Grid */}
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

          {/* Stats */}
          <motion.div className="flex gap-10 justify-center mt-14 pt-8 border-t border-white/[0.06]"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            {[["26+", "Apps Launched"], ["50+", "Clients Worldwide"], ["25+", "Industry Sectors"]].map(([v, l]) => (
              <div key={l} className="text-center">
                <strong className="text-2xl font-extrabold bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent block">{v}</strong>
                <span className="text-[11px] text-white/40">{l}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selected && <ProjectDetail project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}
