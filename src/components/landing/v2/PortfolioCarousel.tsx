import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

const PROJECTS = [
  { brand: "COTE Miami", sector: "Steakhouse Premium", img: `${S}/COTE%20Miami/a-obsidian-mobile-home.png`, accent: "#f59e0b", result: "+34% scontrino medio" },
  { brand: "Aura Spa", sector: "Wellness Boutique", img: `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`, accent: "#ec4899", result: "+218% prenotazioni" },
  { brand: "Neo Nails", sector: "Beauty Studio", img: `${S}/Neo%20Nails%20Brickell/frosted-glass-home.png`, accent: "#a78bfa", result: "3.2× retention clienti" },
  { brand: "City Padel", sector: "Sport Club", img: `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-home.png`, accent: "#22d3ee", result: "94% occupazione campi" },
  { brand: "DIMORA", sector: "Real Estate Luxury", img: `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`, accent: "#c9a84c", result: "+187% lead qualificati" },
  { brand: "Paperfish", sector: "Sushi Omakase", img: `${S}/Paperfish%20Sushi/a-sakura-home.png`, accent: "#ef4444", result: "Sold-out 3 mesi" },
  { brand: "Aloha Pets", sector: "Pet Resort", img: `${S}/Aloha%20Pet%20Resorts/mobile-a-home.png`, accent: "#4ade80", result: "+156% boarding bookings" },
  { brand: "FAR Medical", sector: "Healthcare Premium", img: `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png`, accent: "#60a5fa", result: "100% GDPR compliance" },
];

export default function PortfolioCarousel() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % PROJECTS.length), 3500);
    return () => clearInterval(t);
  }, []);

  const current = PROJECTS[active];

  return (
    <section id="portfolio" className="relative py-24 px-5 overflow-hidden">
      <div className="relative max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[2px] mb-4 border border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/5">
            Portfolio Live
          </span>
          <h2 className="text-[clamp(2rem,5vw,3.4rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] mb-4 text-white">
            847+ imprese.
            <span className="block bg-gradient-to-r from-[#D4AF37] to-[#F97316] bg-clip-text text-transparent">
              Risultati verificabili.
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">
          {/* Active project */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.brand}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left"
            >
              <span
                className="inline-block px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[2px] mb-4 border"
                style={{ borderColor: `${current.accent}44`, color: current.accent, background: `${current.accent}10` }}
              >
                {current.sector}
              </span>
              <h3 className="text-3xl sm:text-5xl font-heading font-extrabold text-white mb-4 leading-tight">{current.brand}</h3>
              <div
                className="inline-block px-5 py-3 rounded-2xl border backdrop-blur-md mb-6"
                style={{
                  borderColor: `${current.accent}55`,
                  background: `linear-gradient(135deg, ${current.accent}25, rgba(0,0,0,0.4))`,
                }}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: current.accent }}>Risultato Verificato</div>
                <div className="text-2xl font-heading font-extrabold text-white">{current.result}</div>
              </div>
              <p className="text-white/60 text-[14px] leading-[1.65] max-w-[440px] mx-auto lg:mx-0">
                Sito premium, dashboard admin, agenti AI dedicati, integrazioni complete. Live in 14 giorni.
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Phone gallery */}
          <div className="relative w-[280px] sm:w-[320px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.brand}
                initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div
                  className="absolute -inset-12 blur-[80px] pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${current.accent}55, transparent 65%)` }}
                />
                <div
                  className="relative aspect-[9/19.5] rounded-[42px] overflow-hidden"
                  style={{
                    border: `2px solid ${current.accent}66`,
                    background: "#0a0a14",
                    boxShadow: `0 40px 100px ${current.accent}40, inset 0 0 0 1px rgba(255,255,255,0.06)`,
                  }}
                >
                  <div className="absolute top-[2%] left-1/2 -translate-x-1/2 w-[28%] h-[2.4%] bg-black rounded-full z-20" />
                  <div className="absolute inset-[3px] rounded-[40px] overflow-hidden">
                    <img src={current.img} alt={current.brand} loading="lazy" className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-[1.5%] left-1/2 -translate-x-1/2 w-[26%] h-[1.2%] bg-white/15 rounded-full z-20" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-10">
          {PROJECTS.map((p, i) => (
            <button
              key={p.brand}
              onClick={() => setActive(i)}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === active ? 32 : 8,
                background: i === active ? p.accent : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/demo")}
            className="px-7 py-3 rounded-full text-white/90 font-semibold text-sm border border-white/15 hover:border-[#D4AF37]/50 hover:bg-white/[0.03] transition-all"
          >
            Vedi tutti i progetti live →
          </button>
        </div>
      </div>
    </section>
  );
}
