import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Play, Pause, Volume2, VolumeX } from "lucide-react";
import promoClip1 from "@/assets/promo-clip-1.mp4";
import promoClip2 from "@/assets/promo-clip-2.mp4";
import promoClip3 from "@/assets/promo-clip-3.mp4";

// Subtitle segments synced to ~15s total (3 clips × 5s)
const subtitles: { start: number; end: number; text: string }[] = [
  // Clip 1: Luxury restaurant interior (0-5s)
  { start: 0, end: 2.5, text: "Benvenuto in Empire Restaurant Suite." },
  { start: 2.5, end: 5, text: "Progettata per il lusso, l'efficienza e il profitto totale." },
  // Clip 2: Chef kitchen (5-10s)
  { start: 5, end: 7.5, text: "AI-Mary: il tuo scudo fiscale automatico." },
  { start: 7.5, end: 10, text: "Panic Mode: aggiorna i prezzi istantaneamente." },
  // Clip 3: App interface (10-15s)
  { start: 10, end: 12.5, text: "AI Menu Creator trasforma la carta in un catalogo mozzafiato." },
  { start: 12.5, end: 15, text: "Empire: il tuo impero digitale. €2.997 una volta. Per sempre." },
];

const clips = [promoClip1, promoClip2, promoClip3];

interface PromoVideoPlayerProps {
  autoPlay?: boolean;
  className?: string;
  compact?: boolean;
}

const PromoVideoPlayer = ({ autoPlay = true, className = "", compact = false }: PromoVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const controlsTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Global time = clipIndex * 5 + video.currentTime
  const globalTime = currentClipIndex * 5 + currentTime;

  const currentSubtitle = subtitles.find(
    (s) => globalTime >= s.start && globalTime < s.end
  );

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, []);

  const handleEnded = useCallback(() => {
    const nextIndex = (currentClipIndex + 1) % clips.length;
    setCurrentClipIndex(nextIndex);
    setCurrentTime(0);
  }, [currentClipIndex]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.src = clips[currentClipIndex];
    v.load();
    if (isPlaying) {
      v.play().catch(() => {});
    }
  }, [currentClipIndex]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
    } else {
      v.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleInteraction = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
  };

  // Progress bar (total ~15s)
  const totalDuration = clips.length * 5;
  const progress = (globalTime / totalDuration) * 100;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-black group cursor-pointer ${className}`}
      onClick={handleInteraction}
      style={{ aspectRatio: compact ? "9/12" : "9/16" }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted={isMuted}
        playsInline
        autoPlay={autoPlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Dark gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

      {/* Crown logo watermark — top right */}
      <div className="absolute top-4 right-4 z-10 opacity-40">
        <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
          <Crown className="w-4 h-4 text-primary" />
        </div>
      </div>

      {/* "EMPIRE" text watermark — top left */}
      <div className="absolute top-4 left-4 z-10 opacity-30">
        <span className="text-[10px] font-display font-bold text-white tracking-[0.3em] uppercase">Empire</span>
      </div>

      {/* Clip progress dots */}
      <div className="absolute top-14 left-4 right-4 z-10 flex gap-1.5">
        {clips.map((_, i) => (
          <div key={i} className="flex-1 h-[2px] rounded-full bg-white/20 overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: "0%" }}
              animate={{
                width:
                  i < currentClipIndex
                    ? "100%"
                    : i === currentClipIndex
                    ? `${(currentTime / 5) * 100}%`
                    : "0%",
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        ))}
      </div>

      {/* Play/Pause overlay */}
      <AnimatePresence>
        {(showControls || !isPlaying) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-20"
          >
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom section: subtitles + controls */}
      <div className="absolute bottom-0 inset-x-0 z-20 px-4 pb-6 pt-12 bg-gradient-to-t from-black/90 to-transparent">
        {/* Subtitle */}
        <div className="min-h-[48px] flex items-center justify-center mb-4">
          <AnimatePresence mode="wait">
            {currentSubtitle && (
              <motion.p
                key={currentSubtitle.text}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-center text-sm sm:text-base font-medium leading-relaxed px-4 py-2 rounded-xl"
                style={{
                  color: "hsl(38, 75%, 65%)",
                  textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                }}
              >
                {currentSubtitle.text}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="w-full h-[3px] rounded-full bg-white/10 mb-3 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white/70" />
            ) : (
              <Volume2 className="w-4 h-4 text-white/70" />
            )}
          </button>

          {!compact && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40 font-medium tracking-wider uppercase">
                Empire Restaurant Suite
              </span>
            </div>
          )}

          <span className="text-[10px] text-white/40 tabular-nums">
            {Math.floor(globalTime)}s / {totalDuration}s
          </span>
        </div>
      </div>

      {/* CTA overlay — last clip, last 2 seconds */}
      <AnimatePresence>
        {currentClipIndex === clips.length - 1 && currentTime > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-28 inset-x-4 z-30"
          >
            <div className="p-4 rounded-2xl bg-primary/20 backdrop-blur-md border border-primary/30 text-center">
              <p className="text-lg font-display font-bold text-white">
                €2.997 <span className="text-sm font-normal text-white/60">una tantum</span>
              </p>
              <p className="text-[11px] text-primary mt-1">Il tuo Asset Digitale di Proprietà</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromoVideoPlayer;
