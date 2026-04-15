import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

const SECTORS = [
  { name: "Ristorazione", img: `${S}/flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png`, accent: "#f97316" },
  { name: "Fitness & Sport", img: `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-home.png`, accent: "#22d3ee" },
  { name: "Beauty & Wellness", img: `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`, accent: "#ec4899" },
  { name: "Hospitality", img: `${S}/COTE%20Miami/a-obsidian-mobile-home.png`, accent: "#c9a84c" },
  { name: "Pet Care", img: `${S}/Aloha%20Pet%20Resorts/mobile-a-home.png`, accent: "#4ade80" },
  { name: "Sushi & Nikkei", img: `${S}/Paperfish%20Sushi/a-sakura-home.png`, accent: "#fb923c" },
  { name: "NCC & Transfer", img: `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png`, accent: "#60a5fa" },
  { name: "Charter & Nautica", img: `${S}/Miami%20Boats%20Rental/A-mobile-home.png`, accent: "#38bdf8" },
  { name: "Luxury Retail", img: `${S}/Tatush%20Hair%20Fragrance/mobile-home.png`, accent: "#a855f7" },
  { name: "Healthcare", img: `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png`, accent: "#3b82f6" },
  { name: "Immobiliare", img: `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`, accent: "#8b5cf6" },
  { name: "Watersports", img: `${S}/Miami%20Watersports/style-a-mobile-home.png`, accent: "#06b6d4" },
  { name: "Nail Art", img: `${S}/Neo%20Nails%20Brickell/frosted-glass-home.png`, accent: "#f472b6" },
  { name: "Nursery", img: `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/home.png`, accent: "#fbbf24" },
  { name: "Fast Food", img: `${S}/STRAPIZZAMI/stile-a-home.png`, accent: "#ef4444" },
];

export function SectorPhoneCarousel() {
  const [active, setActive] = useState(0);

  const advance = useCallback(() => setActive((p) => (p + 1) % SECTORS.length), []);

  useEffect(() => {
    const id = setInterval(advance, 3500);
    return () => clearInterval(id);
  }, [advance]);

  const cur = SECTORS[active];

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Phone mockup */}
      <div className="relative">
        <div className="absolute -inset-8 rounded-full blur-3xl opacity-40" style={{ background: `radial-gradient(ellipse, ${cur.accent}30, transparent 65%)` }} />
        <div
          className="relative w-[140px] aspect-[9/19.5] rounded-[22%/10%] border-[2px] overflow-hidden"
          style={{ borderColor: `${cur.accent}35`, background: "#0a0a14", boxShadow: `0 16px 48px rgba(0,0,0,0.5), 0 0 30px ${cur.accent}12` }}
        >
          <div className="absolute top-[3%] left-1/2 -translate-x-1/2 w-[28%] h-[3%] bg-black rounded-full z-20" />
          <div className="absolute inset-[2px] rounded-[20%/9%] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={active}
                src={cur.img}
                alt={cur.name}
                className="w-full h-full object-cover object-top"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                loading="lazy"
              />
            </AnimatePresence>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
          <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[26%] h-[1.5%] bg-white/15 rounded-full z-20" />
        </div>
      </div>

      {/* Label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className="text-[10px] font-bold tracking-wider"
          style={{ color: cur.accent }}
        >
          {cur.name}
        </motion.span>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex gap-1">
        {SECTORS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="w-1 h-1 rounded-full transition-all duration-300"
            style={{
              background: i === active ? cur.accent : "rgba(255,255,255,0.15)",
              transform: i === active ? "scale(1.5)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
