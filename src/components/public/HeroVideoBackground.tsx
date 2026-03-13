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
  overlay = true,
}: HeroVideoBackgroundProps) {
  const [useFallback, setUseFallback] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeSrc = useFallback && fallbackSrc ? fallbackSrc : primarySrc;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Force load and play
    video.load();
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => {
        // Autoplay blocked - poster remains visible
        // Try muted play as fallback (some browsers need explicit muted)
        video.muted = true;
        video.play().catch(() => {
          // Video truly can't play - show poster
        });
      });
    }
  }, [activeSrc]);

  return (
    <>
      {/* Video element */}
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
        style={{ ...style, opacity: videoFailed ? 0 : undefined }}
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
      
      {/* Poster fallback when video fails */}
      {videoFailed && poster && (
        <img src={poster} alt="" className={className} style={style} aria-hidden="true" />
      )}
    </>
  );
}
