import { useState, useEffect, useCallback, CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroPhotoCarouselProps {
  images: string[];
  interval?: number;
  className?: string;
  style?: CSSProperties;
  overlay?: boolean;
  accentColor?: string;
}

export function HeroPhotoCarousel({
  images,
  interval = 5000,
  className = "absolute inset-0 w-full h-full",
  style,
  overlay = true,
  accentColor = "hsl(var(--primary) / 0.22)",
}: HeroPhotoCarouselProps) {
  const [current, setCurrent] = useState(0);

  const advance = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(advance, interval);
    return () => clearInterval(id);
  }, [advance, interval, images.length]);

  return (
    <>
      {/* Photo layers with crossfade */}
      <AnimatePresence mode="popLayout">
        <motion.img
          key={`hero-photo-${current}`}
          src={images[current]}
          alt=""
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2, ease: "easeInOut" }, scale: { duration: 7, ease: "linear" } }}
          className={`${className} object-cover`}
          style={{ ...style, position: "absolute", zIndex: 1 }}
          aria-hidden="true"
          loading="eager"
        />
      </AnimatePresence>

      {/* Preload next image */}
      {images.length > 1 && (
        <link
          rel="preload"
          as="image"
          href={images[(current + 1) % images.length]}
        />
      )}

      {overlay && (
        <>
          {/* Cinematic darkening */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 2,
              background:
                "linear-gradient(180deg, hsl(var(--background) / 0.15) 0%, hsl(var(--background) / 0.5) 70%, hsl(var(--background) / 0.75) 100%)",
            }}
            aria-hidden="true"
          />

          {/* Sector tint */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 2,
              background: `linear-gradient(135deg, ${accentColor} 0%, transparent 45%, hsl(var(--background) / 0.35) 100%)`,
              opacity: 0.55,
            }}
            aria-hidden="true"
          />

          {/* Vignette */}
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

      {/* Subtle progress dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5" style={{ zIndex: 3 }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="w-1.5 h-1.5 rounded-full transition-all duration-500"
              style={{
                background: i === current ? "white" : "rgba(255,255,255,0.35)",
                transform: i === current ? "scale(1.4)" : "scale(1)",
              }}
              aria-label={`Foto ${i + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
}
