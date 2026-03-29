import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import { MockupLightbox } from "@/components/ui/mockup-lightbox";

/* ═══ activetheory.net inspired scroll-driven iPhone showcase ═══ */

const SHOWCASE_SECTORS = [
  { id: "food", label: "Food & Ristorazione", color: "#e85d04" },
  { id: "ncc", label: "NCC & Trasporti", color: "#C9A84C" },
  { id: "beauty", label: "Beauty & Wellness", color: "#e91e8c" },
  { id: "healthcare", label: "Healthcare", color: "#0ea5e9" },
  { id: "retail", label: "Retail & E-commerce", color: "#8b5cf6" },
  { id: "fitness", label: "Fitness & Sport", color: "#f97316" },
  { id: "hospitality", label: "Hotel & Ospitalità", color: "#10b981" },
];

function getScreens(sectorId: string): string[] {
  const imgs = SECTOR_MOCKUP_IMAGES[sectorId];
  if (!imgs) return [];
  const all = [
    ...(imgs.hero || []),
    ...(imgs.menu || []),
    ...(imgs.detail || []),
    ...(imgs.order || []),
    ...(imgs.profile || []),
    ...(imgs.admin || []),
  ].filter(Boolean);
  return all.slice(0, 4);
}

function IPhone({ src, alt, style, className = "" }: { src: string; alt: string; style?: React.CSSProperties; className?: string }) {
  return (
    <div
      className={`relative aspect-[9/19.5] rounded-[28px] overflow-hidden flex-shrink-0 ${className}`}
      style={{
        border: "2.5px solid hsl(220 10% 78%)",
        background: "#0a0a12",
        boxShadow: "0 30px 80px hsla(0,0%,0%,0.35), 0 8px 24px hsla(265,30%,30%,0.12), inset 0 1px 0 hsla(0,0%,100%,0.06)",
        ...style,
      }}
    >
      <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[34%] max-w-[44px] h-[12px] bg-black rounded-full z-30" style={{ boxShadow: "0 0 0 1px hsla(0,0%,100%,0.06)" }} />
      <div className="absolute inset-[3px] rounded-[24px] overflow-hidden">
        <img src={src} alt={alt} className="w-full h-full object-cover object-top" loading="lazy" />
        <div className="absolute inset-x-0 top-0 h-8" style={{ background: "linear-gradient(to bottom, hsla(0,0%,0%,0.25), transparent)" }} />
      </div>
      <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-[28%] h-[3px] bg-white/20 rounded-full z-20" />
      <div className="absolute inset-0 rounded-[28px] pointer-events-none" style={{ background: "linear-gradient(135deg, hsla(0,0%,100%,0.06) 0%, transparent 40%)" }} />
    </div>
  );
}

export default function ScrollMockupShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSector, setActiveSector] = useState(0);

  // Auto-rotate sectors
  useEffect(() => {
    const timer = setInterval(() => setActiveSector(p => (p + 1) % SHOWCASE_SECTORS.length), 4500);
    return () => clearInterval(timer);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Spring-smoothed scroll progress
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 30, mass: 0.5 });

  // iPhone transforms — inspired by activetheory.net cascading reveal
  const phone1Y = useTransform(smoothProgress, [0, 0.3, 0.6], [120, 0, -30]);
  const phone1Rotate = useTransform(smoothProgress, [0, 0.3, 0.6], [15, 0, -3]);
  const phone1Scale = useTransform(smoothProgress, [0, 0.3, 0.6], [0.8, 1, 0.95]);
  const phone1Opacity = useTransform(smoothProgress, [0, 0.15, 0.5, 0.8], [0, 1, 1, 0.6]);

  const phone2Y = useTransform(smoothProgress, [0.05, 0.35, 0.65], [160, 20, -20]);
  const phone2Rotate = useTransform(smoothProgress, [0.05, 0.35, 0.65], [-12, 3, -2]);
  const phone2Scale = useTransform(smoothProgress, [0.05, 0.35, 0.65], [0.75, 0.92, 0.88]);
  const phone2Opacity = useTransform(smoothProgress, [0.05, 0.2, 0.55, 0.85], [0, 1, 1, 0.5]);

  const phone3Y = useTransform(smoothProgress, [0.1, 0.4, 0.7], [200, 40, -10]);
  const phone3Rotate = useTransform(smoothProgress, [0.1, 0.4, 0.7], [10, -5, 2]);
  const phone3Scale = useTransform(smoothProgress, [0.1, 0.4, 0.7], [0.7, 0.85, 0.82]);
  const phone3Opacity = useTransform(smoothProgress, [0.1, 0.25, 0.6, 0.9], [0, 1, 1, 0.4]);

  const phone4Y = useTransform(smoothProgress, [0.15, 0.45, 0.75], [240, 60, 0]);
  const phone4Rotate = useTransform(smoothProgress, [0.15, 0.45, 0.75], [-8, 6, -1]);
  const phone4Scale = useTransform(smoothProgress, [0.15, 0.45, 0.75], [0.65, 0.78, 0.76]);
  const phone4Opacity = useTransform(smoothProgress, [0.15, 0.3, 0.65, 0.95], [0, 0.9, 0.9, 0.3]);

  // Text reveal
  const textOpacity = useTransform(smoothProgress, [0.1, 0.3, 0.7, 0.85], [0, 1, 1, 0]);
  const textY = useTransform(smoothProgress, [0.1, 0.3], [40, 0]);

  // Ambient glow pulse
  const glowOpacity = useTransform(smoothProgress, [0.2, 0.5, 0.8], [0, 0.08, 0]);

  const sector = SHOWCASE_SECTORS[activeSector];
  const screens = getScreens(sector.id);
  if (screens.length < 4) {
    // Pad with duplicates
    while (screens.length < 4) screens.push(screens[screens.length - 1] || "");
  }

  return (
    <section ref={containerRef} className="relative py-0" style={{ height: "180vh" }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Ambient glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: glowOpacity }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: `radial-gradient(circle, ${sector.color}30, transparent 70%)`, filter: "blur(120px)" }} />
        </motion.div>

        {/* Content wrapper */}
        <div className="relative z-10 max-w-[1200px] mx-auto w-full px-5 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-16">
            
            {/* Left: Text content */}
            <motion.div className="flex-1 text-center lg:text-left" style={{ opacity: textOpacity, y: textY }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
                style={{ background: "hsla(0,0%,100%,0.04)", border: "1px solid hsla(0,0%,100%,0.08)" }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: sector.color }} />
                <span className="text-[0.6rem] font-bold tracking-[3px] uppercase text-white/70" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Portfolio Live</span>
              </div>

              <h2 className="text-[clamp(1.8rem,5vw,3.5rem)] font-bold leading-[1.05] mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <span className="text-white">Esperienze digitali</span>
                <br />
                <span className="text-white">che le persone</span>{" "}
                <span className="text-vivid-gradient" style={{ filter: "brightness(1.2)" }}>amano</span>
              </h2>

              <p className="text-white/50 text-[0.85rem] sm:text-[0.95rem] leading-[1.8] max-w-[420px] mx-auto lg:mx-0 mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Ogni settore, un'esperienza unica. App, siti e gestionali progettati per convertire e fidelizzare.
              </p>

              {/* Sector pills */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                {SHOWCASE_SECTORS.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSector(i)}
                    className={`px-3 py-1.5 rounded-full text-[0.6rem] font-semibold tracking-wider uppercase transition-all duration-300 ${
                      i === activeSector 
                        ? "text-white border-white/30" 
                        : "text-white/30 border-transparent hover:text-white/50"
                    }`}
                    style={{
                      border: `1px solid ${i === activeSector ? s.color + "50" : "transparent"}`,
                      background: i === activeSector ? s.color + "15" : "transparent",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {s.label.split(" ")[0]}
                  </button>
                ))}
              </div>

              {/* Active sector indicator */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(90deg, ${sector.color}40, transparent)` }} />
                <span className="text-[0.55rem] tracking-[4px] uppercase font-semibold" style={{ color: sector.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {sector.label}
                </span>
              </div>
            </motion.div>

            {/* Right: Cascading iPhones */}
            <div className="relative flex-shrink-0 w-[340px] sm:w-[420px] lg:w-[480px] h-[500px] sm:h-[580px]">
              {/* Phone 4 — back */}
              <motion.div
                className="absolute"
                style={{
                  y: phone4Y, rotate: phone4Rotate, scale: phone4Scale, opacity: phone4Opacity,
                  right: "0%", top: "15%", width: "38%", zIndex: 1,
                  transformOrigin: "center center",
                }}
              >
                <MockupLightbox imageSrc={screens[3]} imageAlt={`${sector.label} 4`}>
                  <IPhone src={screens[3]} alt={`${sector.label} screen 4`} />
                </MockupLightbox>
              </motion.div>

              {/* Phone 3 */}
              <motion.div
                className="absolute"
                style={{
                  y: phone3Y, rotate: phone3Rotate, scale: phone3Scale, opacity: phone3Opacity,
                  left: "5%", top: "8%", width: "40%", zIndex: 2,
                  transformOrigin: "center center",
                }}
              >
                <MockupLightbox imageSrc={screens[2]} imageAlt={`${sector.label} 3`}>
                  <IPhone src={screens[2]} alt={`${sector.label} screen 3`} />
                </MockupLightbox>
              </motion.div>

              {/* Phone 2 */}
              <motion.div
                className="absolute"
                style={{
                  y: phone2Y, rotate: phone2Rotate, scale: phone2Scale, opacity: phone2Opacity,
                  right: "8%", top: "3%", width: "42%", zIndex: 3,
                  transformOrigin: "center center",
                }}
              >
                <MockupLightbox imageSrc={screens[1]} imageAlt={`${sector.label} 2`}>
                  <IPhone src={screens[1]} alt={`${sector.label} screen 2`} />
                </MockupLightbox>
              </motion.div>

              {/* Phone 1 — front, hero */}
              <motion.div
                className="absolute"
                style={{
                  y: phone1Y, rotate: phone1Rotate, scale: phone1Scale, opacity: phone1Opacity,
                  left: "18%", top: "0%", width: "48%", zIndex: 10,
                  transformOrigin: "center center",
                }}
              >
                <MockupLightbox imageSrc={screens[0]} imageAlt={`${sector.label} 1`}>
                  <IPhone
                    src={screens[0]}
                    alt={`${sector.label} hero screen`}
                    style={{
                      border: "3px solid hsl(220 10% 82%)",
                      boxShadow: `0 50px 100px hsla(0,0%,0%,0.4), 0 15px 40px hsla(265,30%,30%,0.15), 0 0 60px ${sector.color}10`,
                    }}
                  />
                </MockupLightbox>
              </motion.div>

              {/* Floating badges */}
              <motion.div
                className="absolute bottom-[12%] left-[-5%] z-20 px-3 py-2 rounded-xl"
                style={{
                  background: "hsla(0,0%,6%,0.85)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid hsla(0,0%,100%,0.08)",
                  boxShadow: "0 8px 32px hsla(0,0%,0%,0.4)",
                  opacity: phone1Opacity,
                  y: useTransform(smoothProgress, [0.2, 0.4], [30, 0]),
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: sector.color + "20" }}>
                    <span className="text-[0.6rem]">✦</span>
                  </div>
                  <div>
                    <p className="text-[0.5rem] font-bold text-white/90" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>25+ Settori</p>
                    <p className="text-[0.4rem] text-white/40">Tutti personalizzabili</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute top-[8%] right-[-8%] z-20 px-3 py-2 rounded-xl"
                style={{
                  background: "hsla(0,0%,6%,0.85)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid hsla(0,0%,100%,0.08)",
                  boxShadow: "0 8px 32px hsla(0,0%,0%,0.4)",
                  opacity: phone2Opacity,
                  y: useTransform(smoothProgress, [0.15, 0.35], [20, 0]),
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "hsla(150,60%,50%,0.15)" }}>
                    <span className="text-[0.6rem]">⚡</span>
                  </div>
                  <div>
                    <p className="text-[0.5rem] font-bold text-white/90" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>98+ AI Agents</p>
                    <p className="text-[0.4rem] text-white/40">Automazione totale</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
