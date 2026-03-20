/**
 * PortfolioShowcaseSite — Lowengeld Agency-style project showcase page.
 * Dark premium layout with hero mockup, metadata cards, and screenshot gallery.
 */

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Monitor, Smartphone, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type IndustryId } from "@/config/industry-config";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import { PORTFOLIO_PROJECTS, type PortfolioProject } from "@/data/portfolio-showcase-data";

/* ─── DESIGN TOKENS ─── */
const BG = "#08080a";
const BG_CARD = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#f5f5f5";
const TEXT_MUTED = "rgba(255,255,255,0.45)";

interface Props {
  industry: IndustryId;
  /** Slug for "Try Admin" link */
  slug: string;
  /** Optional: override accent color */
  accentColor?: string;
}

export default function PortfolioShowcaseSite({ industry, slug, accentColor }: Props) {
  const navigate = useNavigate();
  const project = PORTFOLIO_PROJECTS[industry];
  const allImages = SECTOR_MOCKUP_IMAGES[industry] || [];
  const [activeSubProject, setActiveSubProject] = useState<number | null>(null);
  const accent = accentColor || project?.accent || "#8b5cf6";

  if (!project) return null;

  // Determine which images/labels to show
  const sub = activeSubProject !== null ? project.subProjects?.[activeSubProject] : null;
  const visibleImages = sub
    ? allImages.slice(sub.imageRange[0], sub.imageRange[1] + 1)
    : allImages;
  const visibleLabels = sub ? sub.screenLabels : project.screenLabels;
  const currentAccent = sub?.accent || accent;
  const currentName = sub?.name || project.name;
  const currentDesc = sub?.description || project.description;
  const currentTags = sub?.tags || project.tags;

  return (
    <div className="min-h-screen" style={{ background: BG, color: TEXT }}>
      {/* ═══ TOP NAV ═══ */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b" style={{ background: `${BG}ee`, borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-12">
          <button onClick={() => navigate("/demo")} className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4" style={{ color: TEXT_MUTED }} />
            <span style={{ color: TEXT_MUTED }}>All Projects</span>
          </button>
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: currentAccent }}>
            {currentName}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5 border-white/10 hover:bg-white/5 text-white/70"
            onClick={() => navigate(`/demo/${slug}/admin`)}
          >
            <Monitor className="w-3.5 h-3.5" />
            Try Admin
          </Button>
        </div>
      </nav>

      {/* ═══ SUB-PROJECT TABS ═══ */}
      {project.subProjects && project.subProjects.length > 0 && (
        <div className="fixed top-12 inset-x-0 z-40 backdrop-blur-xl border-b" style={{ background: `${BG}dd`, borderColor: BORDER }}>
          <div className="max-w-6xl mx-auto flex items-center gap-1 px-4 py-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveSubProject(null)}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: activeSubProject === null ? `${accent}20` : "transparent",
                color: activeSubProject === null ? accent : TEXT_MUTED,
                border: `1px solid ${activeSubProject === null ? `${accent}40` : "transparent"}`,
              }}
            >
              All
            </button>
            {project.subProjects.map((sp, i) => (
              <button
                key={i}
                onClick={() => setActiveSubProject(i)}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
                style={{
                  background: activeSubProject === i ? `${sp.accent}20` : "transparent",
                  color: activeSubProject === i ? sp.accent : TEXT_MUTED,
                  border: `1px solid ${activeSubProject === i ? `${sp.accent}40` : "transparent"}`,
                }}
              >
                {sp.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══ HERO SECTION ═══ */}
      <div style={{ paddingTop: project.subProjects ? "96px" : "56px" }}>
        <section className="relative px-4 pt-12 pb-8 sm:pt-16 sm:pb-12">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Left: text */}
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Tags */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-4">
                {currentTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border"
                    style={{ borderColor: `${currentAccent}40`, color: currentAccent }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold leading-[1.08] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {currentName}
              </h1>
              <p className="text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0" style={{ color: TEXT_MUTED }}>
                {currentDesc}
              </p>

              {/* Metadata cards */}
              <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">
                {[
                  { icon: "◈", label: "Client", value: sub ? sub.name : project.client },
                  { icon: "◷", label: "Year", value: project.year },
                  { icon: "⬡", label: "Platform", value: project.platform },
                ].map((m) => (
                  <div key={m.label} className="px-3 py-2 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: currentAccent }}>{m.icon}</span>
                      <span className="text-[10px] uppercase tracking-wider" style={{ color: TEXT_MUTED }}>{m.label}</span>
                    </div>
                    <p className="text-xs font-medium mt-0.5 truncate max-w-[140px]">{m.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: hero phone mockup */}
            <motion.div
              className="flex-shrink-0"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {visibleImages[0] && (
                <div className="relative">
                  {/* Phone frame */}
                  <div
                    className="w-[220px] sm:w-[260px] rounded-[2.5rem] p-[6px] shadow-2xl"
                    style={{
                      background: `linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))`,
                      boxShadow: `0 0 80px ${currentAccent}15, 0 20px 60px rgba(0,0,0,0.5)`,
                    }}
                  >
                    <div className="rounded-[2.2rem] overflow-hidden bg-black">
                      {/* Notch */}
                      <div className="relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90px] h-[22px] bg-black rounded-b-2xl z-10" />
                      </div>
                      <img
                        src={visibleImages[0]}
                        alt={currentName}
                        className="w-full aspect-[9/19.5] object-cover object-top"
                        loading="eager"
                      />
                    </div>
                  </div>
                  {/* Glow */}
                  <div className="absolute -inset-8 rounded-full opacity-20 blur-3xl -z-10" style={{ background: currentAccent }} />
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ═══ DIVIDER ═══ */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${currentAccent}30, transparent)` }} />
        </div>

        {/* ═══ ALL SCREENS HEADER ═══ */}
        <section className="px-4 pt-10 pb-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <Smartphone className="w-4 h-4" style={{ color: currentAccent }} />
              <h2 className="text-lg sm:text-xl font-bold">All Screens</h2>
              <Badge variant="outline" className="text-[10px] border-white/10 text-white/40">
                {visibleImages.length} screens
              </Badge>
            </div>
            <p className="text-xs" style={{ color: TEXT_MUTED }}>
              Explore every screen and interaction of this project
            </p>
          </div>
        </section>

        {/* ═══ SCREENSHOT GALLERY ═══ */}
        <section className="px-4 pb-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {visibleImages.map((img, i) => (
                <ScreenCard
                  key={`${activeSubProject}-${i}`}
                  src={img}
                  label={visibleLabels[i] || `Screen ${i + 1}`}
                  accent={currentAccent}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA SECTION ═══ */}
        <section className="px-4 pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="p-8 rounded-2xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
              <h3 className="text-xl sm:text-2xl font-bold mb-3">Vuoi questo per la tua attività?</h3>
              <p className="text-sm mb-6" style={{ color: TEXT_MUTED }}>
                Prova la dashboard admin completa con analytics, ordini e agenti AI
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="h-12 px-8 font-bold rounded-xl text-white border-0"
                  style={{ background: `linear-gradient(135deg, ${currentAccent}, ${currentAccent}bb)` }}
                  onClick={() => navigate(`/demo/${slug}/admin`)}
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Prova Dashboard Admin
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 font-bold rounded-xl border-white/10 text-white/70 hover:bg-white/5"
                  onClick={() => navigate("/demo")}
                >
                  Vedi Tutti i Settori
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ─── Screen Card Component ─── */
function ScreenCard({ src, label, accent, index }: { src: string; label: string; accent: string; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div
        className="rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg"
        style={{
          background: BG_CARD,
          border: `1px solid ${BORDER}`,
          boxShadow: `0 0 0 0 transparent`,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${accent}15`;
          (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}30`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 0 transparent`;
          (e.currentTarget as HTMLDivElement).style.borderColor = BORDER;
        }}
      >
        <div className="aspect-[9/19.5] overflow-hidden bg-black/50">
          <img
            src={src}
            alt={label}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        </div>
        <div className="px-3 py-2.5">
          <p className="text-[11px] font-medium truncate">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}
