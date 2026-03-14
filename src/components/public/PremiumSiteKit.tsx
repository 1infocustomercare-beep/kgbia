// PremiumSiteKit — Shared luxury UI components for all public demo sites
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

// ═══════════ AUTO-SCROLL MARQUEE CAROUSEL ═══════════
interface MarqueeCarouselProps {
  items: React.ReactNode[];
  speed?: number; // seconds for full scroll
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
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden rounded-2xl sm:rounded-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {children[current]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => setCurrent(p => (p - 1 + total) % total)}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full backdrop-blur-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10"
        style={{ background: "rgba(0,0,0,0.5)", border: `1px solid ${accentColor}30` }}
      >
        <ChevronLeft className="w-4 h-4 text-white" />
      </button>
      <button
        onClick={() => setCurrent(p => (p + 1) % total)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full backdrop-blur-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10"
        style={{ background: "rgba(0,0,0,0.5)", border: `1px solid ${accentColor}30` }}
      >
        <ChevronRight className="w-4 h-4 text-white" />
      </button>

      {/* Pill dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {children.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all duration-500"
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              background: i === current ? accentColor : `${accentColor}30`,
            }}
          />
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
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 group cursor-pointer relative overflow-hidden ${className}`}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid rgba(255,255,255,0.08)`,
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl sm:rounded-3xl"
        style={{ background: `radial-gradient(circle at 50% 0%, ${accentColor}12, transparent 70%)` }}
      />
      <div className="relative z-10">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
          style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}20` }}
        >
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
    <div
      className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 relative overflow-hidden h-full"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
      }}
    >
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
interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}

export function PremiumStatsBar({ stats, accentColor = "#C9A84C" }: { stats: StatItem[]; accentColor?: string }) {
  return (
    <div
      className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px)",
      }}
    >
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

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!isInView || value <= 0) return;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 2000, 1);
      setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(step);
    };
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
}

export function PremiumSectionHeader({ badge, title, highlight, subtitle, accentColor = "#C9A84C", align = "center" }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={align === "center" ? "text-center" : "text-left"}
    >
      {badge && (
        <span
          className="inline-block px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-semibold mb-4"
          style={{ background: `${accentColor}12`, color: accentColor, border: `1px solid ${accentColor}20` }}
        >
          {badge}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
        <span className="text-white">{title} </span>
        {highlight && (
          <span className="relative inline-block" style={{ color: accentColor }}>
            {highlight}
            <span
              className="absolute -bottom-1 left-0 w-full h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                backgroundSize: "200% 100%",
                animation: "premium-shimmer 3s ease-in-out infinite",
              }}
            />
          </span>
        )}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-white/40 leading-relaxed">{subtitle}</p>
      )}
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

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % total), 5000);
    return () => clearInterval(t);
  }, [total]);

  return (
    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden" style={{ aspectRatio }}>
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current].src}
          alt={images[current].alt || ""}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7 }}
        />
      </AnimatePresence>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all duration-500"
            style={{
              width: i === current ? 20 : 6,
              height: 6,
              background: i === current ? accentColor : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ═══════════ FLOATING PILL CTA ═══════════
interface PillCTAProps {
  text: string;
  icon?: React.ReactNode;
  accentColor?: string;
  onClick?: () => void;
}

export function FloatingPillCTA({ text, icon, accentColor = "#C9A84C", onClick }: PillCTAProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
        color: "#000",
        boxShadow: `0 8px 30px ${accentColor}30`,
      }}
    >
      {icon}
      {text}
    </motion.button>
  );
}

// ═══════════ AMBIENT GLOW SECTION ═══════════
export function AmbientGlow({ color = "#C9A84C", position = "top" }: { color?: string; position?: "top" | "bottom" | "both" }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {(position === "top" || position === "both") && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.06]"
          style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
        />
      )}
      {(position === "bottom" || position === "both") && (
        <div
          className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full opacity-[0.04]"
          style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
        />
      )}
    </div>
  );
}
