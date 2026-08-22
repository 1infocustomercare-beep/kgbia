import { useMemo } from "react";
import { motion } from "framer-motion";
import { SECTOR_MOCKUPS } from "@/data/sector-mockups";

const useSectorGalleryImages = () => {
  return useMemo(() => {
    const primaryScreens: string[] = [];
    const companionScreens: string[] = [];

    SECTOR_MOCKUPS.forEach((group) => {
      group.variants.forEach((variant) => {
        if (variant.tier === "primary" || variant.source === "studio") {
          primaryScreens.push(variant.screen);
          variant.screens.slice(1).forEach((s) => companionScreens.push(s.image));
        } else {
          variant.screens.forEach((s) => companionScreens.push(s.image));
        }
      });
    });

    // Ensure we have enough images for the gallery; fill with primary if companions are short.
    const all = [...primaryScreens, ...companionScreens];
    while (all.length < 14 && all.length > 0) all.push(...all);
    return {
      primary: primaryScreens.filter(Boolean),
      left: all.filter(Boolean).slice(0, 5),
      middle: all.filter(Boolean).slice(5, 8),
      right: all.filter(Boolean).slice(8, 13),
    };
  }, []);
};

export default function PrestigeIndustries() {
  const gallery = useSectorGalleryImages();

  return (
    <section
      data-section="prestige-industries"
      className="prestige-section prestige-dark"
      id="sectors"
    >
      {/* Sticky hero intro */}
      <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-16 sm:px-5 sm:pt-24 lg:px-10">
        <div className="prestige-industries-intro text-center">
          <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-light))" }}>
            ✦ Il caso tuo
          </div>
          <h2 className="prestige-display mt-3 text-3xl font-semibold break-words sm:mt-4 sm:text-4xl lg:text-6xl">
            Empire parla la lingua del{" "}
            <span className="prestige-gold-text italic">tuo settore</span>
          </h2>
          <div className="prestige-divider mx-auto mt-4 sm:mt-5" />
          <p
            className="mx-auto mt-4 max-w-2xl text-sm sm:text-base md:text-lg"
            style={{ color: "hsl(var(--pr-muted-on-dark))" }}
          >
            Scorri tra i progetti reali. Ogni mockup è un prodotto navigabile pensato per
            risolvere i problemi della tua giornata-tipo.
          </p>
        </div>
      </div>

      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          background:
            "linear-gradient(to right, hsl(var(--pr-gold) / 0.08) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--pr-gold) / 0.08) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
        }}
      />

      {/* Mobile: 2-col flat masonry */}
      <div className="mx-auto max-w-7xl px-3 pb-12 sm:hidden">
        <div className="grid grid-cols-2 gap-3">
          {[...gallery.left, ...gallery.middle, ...gallery.right].map((src, i) => (
            <motion.figure
              key={`mobile-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group relative w-full overflow-hidden rounded-xl"
              style={{ aspectRatio: "9 / 19.5" }}
            >
              <img
                src={src}
                alt={`Mockup settore ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
            </motion.figure>
          ))}
        </div>
      </div>

      {/* Desktop: sticky masonry gallery */}
      <div className="mx-auto hidden max-w-7xl grid-cols-12 gap-4 px-4 pb-16 sm:grid lg:gap-6 lg:px-8">
        {/* Left column */}
        <div className="grid gap-4 sm:col-span-4 lg:gap-6">
          {gallery.left.map((src, i) => (
            <motion.figure
              key={`left-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative w-full overflow-hidden rounded-2xl"
              style={{ aspectRatio: "9 / 16" }}
            >
              <img
                src={src}
                alt={`Mockup settore ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
            </motion.figure>
          ))}
        </div>

        {/* Middle sticky column */}
        <div className="relative sm:col-span-4">
          <div className="sticky top-28 grid h-[calc(100svh-8rem)] grid-rows-3 gap-4 lg:gap-6">
            {gallery.middle.map((src, i) => (
              <motion.figure
                key={`middle-${i}`}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="group relative h-full w-full overflow-hidden rounded-2xl"
              >
                <img
                  src={src}
                  alt={`Mockup settore centrale ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
              </motion.figure>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="grid gap-4 sm:col-span-4 lg:gap-6">
          {gallery.right.map((src, i) => (
            <motion.figure
              key={`right-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative w-full overflow-hidden rounded-2xl"
              style={{ aspectRatio: "9 / 16" }}
            >
              <img
                src={src}
                alt={`Mockup settore ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );

}
