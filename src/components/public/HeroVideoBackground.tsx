import { CSSProperties, useEffect, useRef, useState } from "react";

interface HeroVideoBackgroundProps {
  primarySrc: string;
  fallbackSrc?: string;
  poster?: string;
  className?: string;
  style?: CSSProperties;
  overlay?: boolean;
}

export function HeroVideoBackground({
  primarySrc,
  fallbackSrc,
  poster,
  className = "absolute inset-0 w-full h-full object-cover",
  style,
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
    
    // Reset state
    setIsLoaded(false);
    retryCount.current = 0;
    
    const attemptPlay = () => {
      video.load();
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          video.muted = true;
          video.play().catch(() => {
            // Retry after a delay (mobile browsers sometimes need time)
            if (retryCount.current < 3) {
              retryCount.current++;
              setTimeout(attemptPlay, 1000 * retryCount.current);
            }
          });
        });
      }
    };

    attemptPlay();

    // Timeout: if video hasn't loaded in 8s, try fallback
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
    </>
  );
}
