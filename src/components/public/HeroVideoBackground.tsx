import { CSSProperties, useEffect, useRef, useState } from "react";

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
  overlay = true,
  accentColor = "hsl(var(--primary) / 0.22)",
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

      {overlay && (
        <>
          {/* Subtle cinematic darkening for text readability */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 2,
              background:
                "linear-gradient(180deg, hsl(var(--background) / 0.15) 0%, hsl(var(--background) / 0.5) 70%, hsl(var(--background) / 0.75) 100%)",
            }}
            aria-hidden="true"
          />

          {/* Sector tint layer */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 2,
              background: `linear-gradient(135deg, ${accentColor} 0%, transparent 45%, hsl(var(--background) / 0.35) 100%)`,
              opacity: 0.55,
            }}
            aria-hidden="true"
          />

          {/* Professional vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 2,
              background:
                "radial-gradient(ellipse at center, transparent 42%, hsl(var(--background) / 0.62) 100%)",
            }}
            aria-hidden="true"
          />
        </>
      )}
    </>
  );
}
