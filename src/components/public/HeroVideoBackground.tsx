import { CSSProperties, useEffect, useRef, useState } from "react";

interface HeroVideoBackgroundProps {
  primarySrc: string;
  fallbackSrc?: string;
  poster?: string;
  className?: string;
  style?: CSSProperties;
}

export function HeroVideoBackground({
  primarySrc,
  fallbackSrc,
  poster,
  className = "absolute inset-0 w-full h-full object-cover",
  style,
}: HeroVideoBackgroundProps) {
  const [useFallback, setUseFallback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeSrc = useFallback && fallbackSrc ? fallbackSrc : primarySrc;

  useEffect(() => {
    videoRef.current?.play().catch(() => {
      // Some mobile browsers block autoplay despite muted; poster remains visible.
    });
  }, [activeSrc]);

  return (
    <video
      key={activeSrc}
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      className={className}
      style={style}
      onError={() => {
        if (!useFallback && fallbackSrc) {
          setUseFallback(true);
        }
      }}
      aria-hidden="true"
    >
      <source src={activeSrc} type="video/mp4" />
    </video>
  );
}
