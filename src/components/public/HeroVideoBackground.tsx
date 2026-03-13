import { CSSProperties, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface HeroVideoBackgroundProps {
  primarySrc: string;
  fallbackSrc?: string;
  poster?: string;
  className?: string;
  style?: CSSProperties;
  overlay?: boolean;
  accentColor?: string;
}

export function HeroVideoBackground({
  primarySrc,
  fallbackSrc,
  poster,
  className = "absolute inset-0 w-full h-full object-cover",
  style,
  accentColor = "rgba(255,255,255,0.15)",
}: HeroVideoBackgroundProps) {
  const [useFallback, setUseFallback] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const retryCount = useRef(0);

  const activeSrc = useFallback && fallbackSrc ? fallbackSrc : primarySrc;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    setIsLoaded(false);
    retryCount.current = 0;
    
    const attemptPlay = () => {
      video.load();
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          video.muted = true;
          video.play().catch(() => {
            if (retryCount.current < 3) {
              retryCount.current++;
              setTimeout(attemptPlay, 1000 * retryCount.current);
            }
          });
        });
      }
    };

    attemptPlay();

    const timeout = setTimeout(() => {
      if (!isLoaded && !useFallback && fallbackSrc) {
        setUseFallback(true);
      }
    }, 8000);

    return () => clearTimeout(timeout);
  }, [activeSrc]);

  // Generate random particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 3,
    duration: 4 + Math.random() * 8,
    delay: Math.random() * 5,
  }));

  return (
    <>
      {/* Poster image - always shown as base layer */}
      {poster && (
        <img 
          src={poster} 
          alt="" 
          className={className} 
          style={{ ...style, position: "absolute", zIndex: 0 }} 
          aria-hidden="true" 
        />
      )}
      
      {/* Video element - overlays poster when loaded */}
      {!videoFailed && (
        <video
          key={activeSrc}
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          className={className}
          style={{ 
            ...style, 
            position: "absolute", 
            zIndex: 1,
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
          onCanPlayThrough={() => setIsLoaded(true)}
          onPlaying={() => setIsLoaded(true)}
          onError={() => {
            if (!useFallback && fallbackSrc) {
              setUseFallback(true);
            } else {
              setVideoFailed(true);
            }
          }}
          aria-hidden="true"
        >
          <source src={activeSrc} type="video/mp4" />
        </video>
      )}

      {/* ═══ ANIMATED OVERLAYS ═══ */}
      
      {/* 1. Diagonal light sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2, overflow: "hidden" }}
        aria-hidden="true"
      >
        <motion.div
          className="absolute w-[200%] h-[1px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            top: "50%",
            left: "-50%",
            transformOrigin: "center",
            rotate: "-35deg",
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatDelay: 4 }}
        />
      </motion.div>

      {/* 2. Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }} aria-hidden="true">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: accentColor,
            }}
            animate={{
              y: [0, -40, -20, -60, 0],
              x: [0, 10, -8, 5, 0],
              opacity: [0, 0.7, 0.3, 0.6, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* 3. Corner glow pulses */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }} aria-hidden="true">
        <motion.div
          className="absolute top-0 left-0 w-[40%] h-[40%]"
          style={{
            background: `radial-gradient(ellipse at top left, ${accentColor} 0%, transparent 70%)`,
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[40%] h-[40%]"
          style={{
            background: `radial-gradient(ellipse at bottom right, ${accentColor} 0%, transparent 70%)`,
          }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* 4. Subtle horizontal scan lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)`,
          mixBlendMode: "multiply",
        }}
        aria-hidden="true"
      />

      {/* 5. Animated vignette pulse */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      {/* 6. Film grain texture */}
      <div
        className="absolute inset-0 pointer-events-none hero-grain"
        style={{ zIndex: 2, opacity: 0.035, mixBlendMode: "overlay" }}
        aria-hidden="true"
      />
    </>
  );
}
