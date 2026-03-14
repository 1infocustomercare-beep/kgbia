// PremiumSiteKit — Shared luxury UI components for all public demo sites
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote, ChevronDown } from "lucide-react";

// ═══════════ AUTO-SCROLL MARQUEE CAROUSEL ═══════════
interface MarqueeCarouselProps {
  items: React.ReactNode[];
  speed?: number;
  pauseOnHover?: boolean;
  reverse?: boolean;
  className?: string;
}

export function MarqueeCarousel({ items, speed = 60, pauseOnHover = true, reverse = false, className = "" }: MarqueeCarouselProps) {
  const doubled = [...items, ...items, ...items];
  return (
    <div className={`overflow-hidden ${pauseOnHover ? "group/marquee" : ""} ${className}`}>
      <div
        className={`flex ${pauseOnHover ? "group-hover/marquee:[animation-play-state:paused]" : ""}`}
        style={{
          width: "max-content",
          animation: `${reverse ? "premium-marquee-reverse" : "premium-marquee"} ${speed}s linear infinite`,
        }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="flex-shrink-0">{item}</div>
        ))}
      </div>
    </div>
  );
}

// ═══════════ PREMIUM CARD CAROUSEL WITH DOTS ═══════════
interface CardCarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  accentColor?: string;
  className?: string;
}

export function PremiumCardCarousel({ children, autoPlay = true, interval = 4000, accentColor = "#C9A84C", className = "" }: CardCarouselProps) {
  const [current, setCurrent] = useState(0);
  const total = children.length;
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!autoPlay || paused) return;
    timerRef.current = setInterval(() => setCurrent(p => (p + 1) % total), interval);
    return () => clearInterval(timerRef.current);
  }, [autoPlay, interval, total, paused]);

  return (
    <div className={`relative ${className}`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="overflow-hidden rounded-2xl sm:rounded-3xl">
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            {children[current]}
          </motion.div>
        </AnimatePresence>
      </div>
      <button onClick={() => setCurrent(p => (p - 1 + total) % total)} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full backdrop-blur-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10" style={{ background: "rgba(0,0,0,0.5)", border: `1px solid ${accentColor}30` }}>
        <ChevronLeft className="w-4 h-4 text-white" />
      </button>
      <button onClick={() => setCurrent(p => (p + 1) % total)} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full backdrop-blur-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10" style={{ background: "rgba(0,0,0,0.5)", border: `1px solid ${accentColor}30` }}>
        <ChevronRight className="w-4 h-4 text-white" />
      </button>
      <div className="flex justify-center gap-1.5 mt-4">
        {children.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className="rounded-full transition-all duration-500" style={{ width: i === current ? 24 : 8, height: 8, background: i === current ? accentColor : `${accentColor}30` }} />
        ))}
      </div>
    </div>
  );
}

// ═══════════ GLASSMORPHISM SERVICE CARD ═══════════
interface GlassCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accentColor?: string;
  className?: string;
}

export function GlassServiceCard({ icon, title, description, accentColor = "#C9A84C", className = "" }: GlassCardProps) {
  return (
    <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 group cursor-pointer relative overflow-hidden ${className}`}
      style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.08)`, backdropFilter: "blur(16px)" }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl sm:rounded-3xl" style={{ background: `radial-gradient(circle at 50% 0%, ${accentColor}12, transparent 70%)` }} />
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}20` }}>
          {icon}
        </div>
        <h3 className="font-bold text-sm sm:text-base mb-2 text-white group-hover:text-white transition-colors">{title}</h3>
        <p className="text-xs sm:text-sm leading-relaxed text-white/40 group-hover:text-white/60 transition-colors">{description}</p>
      </div>
    </motion.div>
  );
}

// ═══════════ PREMIUM REVIEW CARD ═══════════
interface ReviewCardProps {
  name: string;
  text: string;
  rating: number;
  photo?: string;
  city?: string;
  accentColor?: string;
}

export function PremiumReviewCard({ name, text, rating, photo, city, accentColor = "#C9A84C" }: ReviewCardProps) {
  return (
    <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 relative overflow-hidden h-full" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
      <Quote className="w-8 h-8 mb-3 opacity-20" style={{ color: accentColor }} />
      <p className="text-sm leading-relaxed text-white/70 mb-4 italic">"{text}"</p>
      <div className="flex items-center gap-3">
        {photo && (
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ border: `2px solid ${accentColor}40` }}>
            <img src={photo} alt={name} className="w-full h-full object-cover" />
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-white">{name}</p>
          {city && <p className="text-[11px] text-white/40">{city}</p>}
        </div>
        <div className="ml-auto flex gap-0.5">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: accentColor }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════ AUTO-SCROLLING REVIEWS ═══════════
interface ReviewsMarqueeProps {
  reviews: ReviewCardProps[];
  accentColor?: string;
  speed?: number;
}

export function ReviewsMarquee({ reviews, accentColor = "#C9A84C", speed = 50 }: ReviewsMarqueeProps) {
  const cards = reviews.map((r, i) => (
    <div key={i} className="w-[300px] sm:w-[340px] mx-2 sm:mx-3 flex-shrink-0">
      <PremiumReviewCard {...r} accentColor={accentColor} />
    </div>
  ));
  return <MarqueeCarousel items={cards} speed={speed} pauseOnHover />;
}

// ═══════════ PREMIUM STATS BAR ═══════════
interface StatItem { value: number; suffix?: string; label: string; }

export function PremiumStatsBar({ stats, accentColor = "#C9A84C" }: { stats: StatItem[]; accentColor?: string }) {
  return (
    <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(16px)" }}>
      {stats.map((s, i) => (
        <div key={i} className="text-center">
          <p className="text-2xl sm:text-3xl font-black" style={{ color: accentColor }}>
            <AnimatedNumber value={s.value} suffix={s.suffix || ""} />
          </p>
          <p className="text-[11px] sm:text-xs text-white/40 mt-1 uppercase tracking-wider">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ═══════════ LIGHT THEME STATS BAR ═══════════
export function PremiumStatsBarLight({ stats, accentColor = "#C9A84C", textColor = "#1a1a2e" }: { stats: StatItem[]; accentColor?: string; textColor?: string }) {
  return (
    <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6" style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }}>
      {stats.map((s, i) => (
        <div key={i} className="text-center">
          <p className="text-2xl sm:text-3xl font-black" style={{ color: accentColor }}>
            <AnimatedNumber value={s.value} suffix={s.suffix || ""} />
          </p>
          <p className="text-[11px] sm:text-xs mt-1 uppercase tracking-wider" style={{ color: `${textColor}66` }}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!isInView || value <= 0) return;
    let start = 0;
    const step = (ts: number) => { if (!start) start = ts; const p = Math.min((ts - start) / 2000, 1); setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * value)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [isInView, value]);
  return <span ref={ref}>{display}{suffix}</span>;
}

// ═══════════ PREMIUM SECTION HEADER ═══════════
interface SectionHeaderProps {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  accentColor?: string;
  align?: "center" | "left";
  lightMode?: boolean;
}

export function PremiumSectionHeader({ badge, title, highlight, subtitle, accentColor = "#C9A84C", align = "center", lightMode = false }: SectionHeaderProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className={align === "center" ? "text-center" : "text-left"}>
      {badge && (
        <span className="inline-block px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-semibold mb-4" style={{ background: `${accentColor}12`, color: accentColor, border: `1px solid ${accentColor}20` }}>
          {badge}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
        <span style={{ color: lightMode ? "#1a1a2e" : "#fff" }}>{title} </span>
        {highlight && (
          <span className="relative inline-block" style={{ color: accentColor }}>
            {highlight}
            <span className="absolute -bottom-1 left-0 w-full h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, backgroundSize: "200% 100%", animation: "premium-shimmer 3s ease-in-out infinite" }} />
          </span>
        )}
      </h2>
      {subtitle && <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base leading-relaxed" style={{ color: lightMode ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.4)" }}>{subtitle}</p>}
    </motion.div>
  );
}

// ═══════════ PREMIUM IMAGE GALLERY CAROUSEL ═══════════
interface GalleryCarouselProps {
  images: { src: string; alt?: string }[];
  accentColor?: string;
  aspectRatio?: string;
}

export function PremiumGalleryCarousel({ images, accentColor = "#C9A84C", aspectRatio = "16/9" }: GalleryCarouselProps) {
  const [current, setCurrent] = useState(0);
  const total = images.length;
  useEffect(() => { const t = setInterval(() => setCurrent(p => (p + 1) % total), 5000); return () => clearInterval(t); }, [total]);

  return (
    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden" style={{ aspectRatio }}>
      <AnimatePresence mode="wait">
        <motion.img key={current} src={images[current].src} alt={images[current].alt || ""} className="absolute inset-0 w-full h-full object-cover" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.7 }} />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className="rounded-full transition-all duration-500" style={{ width: i === current ? 20 : 6, height: 6, background: i === current ? accentColor : "rgba(255,255,255,0.4)" }} />
        ))}
      </div>
    </div>
  );
}

// ═══════════ FLOATING PILL CTA ═══════════
export function FloatingPillCTA({ text, icon, accentColor = "#C9A84C", onClick }: { text: string; icon?: React.ReactNode; accentColor?: string; onClick?: () => void }) {
  return (
    <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} onClick={onClick}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-lg"
      style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`, color: "#000", boxShadow: `0 8px 30px ${accentColor}30` }}>
      {icon}{text}
    </motion.button>
  );
}

// ═══════════ AMBIENT GLOW SECTION ═══════════
export function AmbientGlow({ color = "#C9A84C", position = "top" }: { color?: string; position?: "top" | "bottom" | "both" }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {(position === "top" || position === "both") && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.06]" style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }} />
      )}
      {(position === "bottom" || position === "both") && (
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full opacity-[0.04]" style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }} />
      )}
    </div>
  );
}

// ═══════════ FLOATING ORBS — futuristic background particles ═══════════
export function FloatingOrbs({ color = "#C9A84C", count = 4 }: { color?: string; count?: number }) {
  const orbs = Array.from({ length: count }, (_, i) => ({
    size: 100 + Math.random() * 200,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: i * 2,
    dur: 12 + Math.random() * 8,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {orbs.map((o, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{ width: o.size, height: o.size, left: `${o.x}%`, top: `${o.y}%`, background: `radial-gradient(circle, ${color}0a, transparent 70%)`, filter: "blur(40px)" }}
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.2, 0.9, 1] }}
          transition={{ duration: o.dur, delay: o.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ═══════════ NEON DIVIDER LINE ═══════════
export function NeonDivider({ color = "#C9A84C", className = "" }: { color?: string; className?: string }) {
  return (
    <div className={`relative h-px w-full overflow-hidden ${className}`}>
      <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />
      <motion.div className="absolute h-full w-24 rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)`, boxShadow: `0 0 20px ${color}60` }}
        animate={{ x: ["-100%", "calc(100vw + 100%)"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
      />
    </div>
  );
}

// ═══════════ PREMIUM FAQ ACCORDION ═══════════
interface FAQItem { q: string; a: string; }

export function PremiumFAQ({ items, accentColor = "#C9A84C", lightMode = false }: { items: FAQItem[]; accentColor?: string; lightMode?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
          className="rounded-2xl overflow-hidden transition-all"
          style={{ background: lightMode ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)", border: `1px solid ${open === i ? accentColor + "40" : (lightMode ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)")}` }}>
          <button onClick={() => setOpen(open === i ? null : i)} className="w-full px-5 py-4 flex items-center justify-between text-left">
            <span className="text-sm font-semibold" style={{ color: lightMode ? "#1a1a2e" : "#fff" }}>{item.q}</span>
            <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="w-4 h-4" style={{ color: accentColor }} />
            </motion.div>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: lightMode ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)" }}>{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════ PREMIUM SERVICE CARD WITH IMAGE ═══════════
interface ServiceImageCardProps {
  name: string;
  description: string;
  image: string;
  icon?: string;
  accentColor?: string;
  badge?: string;
}

export function PremiumServiceCard({ name, description, image, icon, accentColor = "#C9A84C", badge }: ServiceImageCardProps) {
  return (
    <motion.div className="group relative rounded-3xl overflow-hidden cursor-pointer h-full"
      style={{ background: "rgba(255,255,255,0.02)", border: `1px solid rgba(255,255,255,0.06)`, backdropFilter: "blur(12px)" }}
      whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.4 }}>
      <div className="relative h-52 overflow-hidden rounded-t-3xl">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
        {icon && <span className="absolute top-3 left-3 text-2xl">{icon}</span>}
        {badge && (
          <span className="absolute top-3 right-3 text-[9px] rounded-full px-3 py-1 font-semibold uppercase tracking-wider" style={{ background: `${accentColor}25`, color: accentColor, border: `1px solid ${accentColor}40` }}>{badge}</span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-base mb-1 text-white">{name}</h3>
        <p className="text-sm text-white/40">{description}</p>
      </div>
    </motion.div>
  );
}

// ═══════════ SCROLL-DOWN INDICATOR ═══════════
export function ScrollIndicator({ color = "rgba(255,255,255,0.3)" }: { color?: string }) {
  return (
    <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
      <div className="flex flex-col items-center gap-2">
        <div className="w-5 h-8 rounded-full border-2" style={{ borderColor: color }}>
          <motion.div className="w-1 h-2 rounded-full mx-auto mt-1" style={{ background: color }} animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════ MORPHING GRADIENT BACKGROUND ═══════════
export function MorphingGradient({ colors, className = "" }: { colors: string[]; className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {colors.map((color, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: "50%", height: "50%",
            left: `${20 + i * 25}%`, top: `${10 + i * 20}%`,
            background: `radial-gradient(circle, ${color}15, transparent 70%)`,
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, i % 2 === 0 ? 50 : -50, 0],
            y: [0, i % 2 === 0 ? -30 : 30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 10 + i * 3, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ═══════════ PREMIUM TICKER BAR ═══════════
export function PremiumTicker({ items, icon, accentColor = "#C9A84C", bgColor = "#111" }: { items: string[]; icon: React.ReactNode; accentColor?: string; bgColor?: string }) {
  return (
    <div className="overflow-hidden py-4 sm:py-5 relative" style={{ background: bgColor }}>
      <AmbientGlow color={accentColor} position="top" />
      <MarqueeCarousel speed={35} pauseOnHover items={
        items.map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-sm font-medium mx-6 whitespace-nowrap" style={{ color: "rgba(255,255,255,0.25)" }}>
            <span style={{ color: `${accentColor}60` }}>{icon}</span> {item}
          </span>
        ))
      } />
    </div>
  );
}

// ═══════════ PREMIUM HERO OVERLAY PATTERN ═══════════
export function HeroPattern({ color = "#C9A84C" }: { color?: string }) {
  return (
    <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle, ${color}80 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />
  );
}

// ═══════════ PREMIUM BADGE (rotating images) ═══════════
interface PremiumBadgeProps {
  images: { src: string; label: string }[];
  accentColor?: string;
  label?: string;
}

export function PremiumBadge({ images, accentColor = "#C9A84C", label = "Premium" }: PremiumBadgeProps) {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(p => (p + 1) % images.length), 3500); return () => clearInterval(t); }, [images.length]);
  const img = images[idx];
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.5 }} className="absolute -bottom-4 right-3 sm:-bottom-5 sm:right-4 z-20">
      <div className="flex items-center gap-2 rounded-full backdrop-blur-xl pl-0.5 pr-3 py-0.5" style={{ background: "rgba(10,10,10,0.8)", border: `1px solid ${accentColor}40`, boxShadow: `0 8px 32px rgba(0,0,0,0.5)` }}>
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ border: `1.5px solid ${accentColor}50` }}>
          <AnimatePresence mode="wait">
            <motion.img key={idx} src={img.src} alt={img.label} className="w-full h-full object-cover" initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} />
          </AnimatePresence>
        </div>
        <div className="min-w-0">
          <p className="text-[8px] uppercase tracking-[0.15em] font-bold leading-none" style={{ color: accentColor }}>{label}</p>
          <p className="text-[8px] text-white/45 truncate leading-tight mt-0.5">{img.label}</p>
        </div>
      </div>
    </motion.div>
  );
}
