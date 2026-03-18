import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ChevronLeft, ChevronRight, Grid3X3, X, Sparkles } from "lucide-react";

interface PhoneItem {
  name: string;
  color: string;
  emoji: string;
  label: string;
  nav: string;
}

interface Props {
  items: PhoneItem[];
  onNavigate: (path: string) => void;
  onShowAll?: () => void;
}

/* ═══ Single iPhone Card ═══ */
function PhoneCard({ item, onClick, size = "md" }: { item: PhoneItem; onClick: () => void; size?: "sm" | "md" }) {
  const w = size === "sm" ? "w-[140px]" : "w-[160px] sm:w-[180px]";
  const h = size === "sm" ? "h-[260px]" : "h-[300px] sm:h-[340px]";
  const round = size === "sm" ? "rounded-[22px]" : "rounded-[28px] sm:rounded-[32px]";
  const innerRound = size === "sm" ? "rounded-[18px]" : "rounded-[24px] sm:rounded-[28px]";
  const island = size === "sm" ? "w-[40px] h-[11px] top-[5px]" : "w-[48px] h-[14px] top-[6px] sm:w-[54px] sm:h-[16px] sm:top-[7px]";

  return (
    <div className="group cursor-pointer flex-shrink-0" onClick={onClick}>
      <div
        className={`relative ${w} ${h} ${round} border-[2px] sm:border-[2.5px] overflow-hidden transition-shadow duration-500 group-hover:shadow-[0_20px_60px_hsla(0,0%,0%,0.3)]`}
        style={{
          borderColor: `${item.color}40`,
          boxShadow: `0 14px 45px hsla(0,0%,0%,0.45), 0 0 30px ${item.color}10`,
        }}
      >
        {/* Dynamic Island */}
        <div className={`absolute ${island} left-1/2 -translate-x-1/2 bg-black rounded-full z-20`} />

        {/* Content — gradient placeholder */}
        <div
          className={`absolute inset-[2px] sm:inset-[3px] ${innerRound} overflow-hidden flex flex-col items-center justify-center transition-all duration-300`}
          style={{
            background: `linear-gradient(160deg, ${item.color}18 0%, #0a0a0a 45%, ${item.color}08 100%)`,
          }}
        >
          <span className="text-3xl sm:text-4xl mb-2 opacity-60 group-hover:opacity-90 transition-opacity duration-300">
            {item.emoji}
          </span>
          <div className="w-8 h-[1px] rounded-full" style={{ background: `${item.color}40` }} />
        </div>

        {/* Bottom overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 p-2 pt-6 sm:p-3 sm:pt-10"
          style={{ background: "linear-gradient(to top, hsla(0,0%,0%,0.94), transparent)" }}
        >
          <div className="flex items-center gap-1 mb-0.5 sm:mb-1">
            <span
              className="text-[6px] sm:text-[7px] px-1 sm:px-1.5 py-0.5 rounded-full font-bold tracking-wider uppercase"
              style={{
                background: `${item.color}25`,
                color: item.color,
                border: `1px solid ${item.color}35`,
              }}
            >
              ★ Live
            </span>
          </div>
          <p className="text-[9px] sm:text-[11px] font-bold text-white leading-tight">{item.name}</p>
          <p className="text-[6px] sm:text-[8px] text-white/40">{item.label}</p>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-[4px] sm:bottom-[6px] left-1/2 -translate-x-1/2 w-[36px] sm:w-[44px] h-[3px] sm:h-[4px] bg-white/20 rounded-full z-20" />
      </div>
    </div>
  );
}

export default function SectorPhoneCarousel({ items, onNavigate, onShowAll }: Props) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const visibleCount = 3;
  const maxIndex = Math.max(0, items.length - visibleCount);

  const goTo = useCallback((idx: number) => {
    setCurrentIndex(Math.max(0, Math.min(idx, maxIndex)));
  }, [maxIndex]);

  const next = useCallback(() => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-play
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isPlaying && !showAll) {
      intervalRef.current = setInterval(next, 2800);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, showAll, next]);

  // Pause on hover
  const pauseOnHover = () => { if (isPlaying) { clearInterval(intervalRef.current!); } };
  const resumeOnLeave = () => { if (isPlaying && !showAll) { intervalRef.current = setInterval(next, 2800); } };

  // Progress dots
  const totalSteps = maxIndex + 1;
  const dotCount = Math.min(totalSteps, 9);

  return (
    <div className="relative">
      {/* ═══ Controls bar ═══ */}
      <div className="flex items-center justify-center gap-2 mb-5">
        <button
          onClick={prev}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          aria-label="Precedente"
        >
          <ChevronLeft className="w-4 h-4 text-white/60" />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          aria-label={isPlaying ? "Pausa" : "Play"}
        >
          {isPlaying ? <Pause className="w-4 h-4 text-white/60" /> : <Play className="w-4 h-4 text-white/60" />}
        </button>

        <button
          onClick={next}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          aria-label="Successivo"
        >
          <ChevronRight className="w-4 h-4 text-white/60" />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1" />

        <button
          onClick={() => setShowAll(!showAll)}
          className="px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5"
        >
          {showAll ? <X className="w-3.5 h-3.5 text-white/60" /> : <Grid3X3 className="w-3.5 h-3.5 text-white/60" />}
          <span className="text-[10px] sm:text-xs font-medium text-white/60">
            {showAll ? "Chiudi" : "Vedi tutti"}
          </span>
        </button>
      </div>

      {/* ═══ Carousel view ═══ */}
      <AnimatePresence mode="wait">
        {!showAll ? (
          <motion.div
            key="carousel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="overflow-hidden px-4"
              onMouseEnter={pauseOnHover}
              onMouseLeave={resumeOnLeave}
            >
              <motion.div
                ref={trackRef}
                className="flex gap-3 sm:gap-5"
                animate={{ x: -(currentIndex * 172) }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ width: "max-content" }}
              >
                {items.map((item, i) => (
                  <PhoneCard key={i} item={item} onClick={() => onNavigate(item.nav)} />
                ))}
              </motion.div>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5 mt-5">
              {Array.from({ length: dotCount }).map((_, i) => {
                const mappedIdx = Math.round((i / (dotCount - 1)) * maxIndex);
                const isActive = Math.abs(currentIndex - mappedIdx) < (maxIndex / dotCount / 2 + 1);
                return (
                  <button
                    key={i}
                    onClick={() => goTo(mappedIdx)}
                    className={`rounded-full transition-all duration-300 ${isActive ? "w-5 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-white/15 hover:bg-white/25"}`}
                  />
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* ═══ Expanded grid view ═══ */
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 justify-items-center"
          >
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <PhoneCard item={item} onClick={() => onNavigate(item.nav)} size="sm" />
              </motion.div>
            ))}
            {onShowAll && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: items.length * 0.03 }}
                className="group cursor-pointer flex-shrink-0"
                onClick={onShowAll}
              >
                <div className="relative w-[140px] h-[260px] rounded-[22px] border-[2px] border-dashed border-white/10 hover:border-primary/20 transition-all duration-500 flex flex-col items-center justify-center text-center overflow-hidden">
                  <Sparkles className="w-6 h-6 text-white/15 mb-2 group-hover:text-primary/50 transition-colors" />
                  <p className="text-[10px] font-semibold text-white/30 group-hover:text-white/60 transition-colors">+18 settori</p>
                  <p className="text-[8px] text-primary/40 mt-1">Esplora →</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}