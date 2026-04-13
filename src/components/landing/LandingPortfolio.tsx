import { motion } from "framer-motion";
import { useState } from "react";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

const PORTFOLIO = [
  { n: "Flame Kebab", c: "food", img: `${S}/flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png` },
  { n: "Aura Milano Spa", c: "beauty", img: `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png` },
  { n: "COTE Miami", c: "food", img: `${S}/COTE%20Miami/a-obsidian-mobile-home.png` },
  { n: "Midtown Kosher", c: "food", img: `${S}/Midtown%20Kosher/style-a-home.png`, land: true },
  { n: "Neo Nails", c: "beauty", img: `${S}/Neo%20Nails%20Brickell/frosted-glass-home.png` },
  { n: "Top Golf Bay", c: "sport", img: `${S}/Top%20Golf%20Bay%20App/a-official-home.png` },
  { n: "Paperfish Sushi", c: "food", img: `${S}/Paperfish%20Sushi/a-sakura-home.png` },
  { n: "City Padel", c: "sport", img: `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-home.png` },
  { n: "MMI Resident", c: "app", img: `${S}/MMI%20Resident%20Hub/01-ocean-azure-desktop-dashboard.png`, land: true },
  { n: "LuxDrive", c: "app", img: `${S}/LuxDrive/style-a-home.png` },
  { n: "Tatush Hair", c: "ecom", img: `${S}/Tatush%20Hair%20Fragrance/mobile-home.png` },
  { n: "DIMORA Milano", c: "app", img: `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png` },
  { n: "La Vang", c: "food", img: `${S}/La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-home.png` },
  { n: "Little Diamond", c: "life", img: `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/home.png` },
  { n: "Asinara Charter", c: "app", img: `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png` },
  { n: "Miami Boats", c: "app", img: `${S}/Miami%20Boats%20Rental/A-mobile-home.png` },
  { n: "FAR Medical", c: "web", img: `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png` },
  { n: "STRAPIZZAMI", c: "food", img: `${S}/STRAPIZZAMI/stile-a-home.png` },
  { n: "Aloha Pet", c: "life", img: `${S}/Aloha%20Pet%20Resorts/mobile-a-home.png` },
  { n: "Batey Ceviche", c: "food", img: `${S}/Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-home.png` },
];

const CAT_NAMES: Record<string, string> = { food: "Food", beauty: "Beauty", sport: "Sport", app: "App", ecom: "E-Commerce", life: "Lifestyle", web: "Web" };
const CATS = ["all", ...Array.from(new Set(PORTFOLIO.map(d => d.c)))];

export default function LandingPortfolio() {
  const [filter, setFilter] = useState("all");
  const items = filter === "all" ? PORTFOLIO : PORTFOLIO.filter(d => d.c === filter);

  return (
    <section id="portfolio" className="py-16 lg:py-24" style={{ background: "linear-gradient(180deg, #020204 0%, #0d0d1a 50%, #020204 100%)" }}>
      <div className="max-w-[1320px] mx-auto px-5">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-3">
              <span className="w-5 h-[1.5px] bg-[#7eb7be]" />PORTFOLIO
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold text-white">
              30+ Progetti <span className="bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">Premium</span>
            </h2>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATS.map((c) => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-xs font-semibold font-heading transition-all border ${
                c === filter
                  ? "bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] border-transparent text-white"
                  : "bg-transparent border-white/[0.07] text-white/55 hover:border-[#7eb7be] hover:text-[#7eb7be]"
              }`}>
              {c === "all" ? "Tutti" : CAT_NAMES[c] || c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <motion.div key={item.n}
              className={`relative rounded-2xl overflow-hidden border border-white/[0.07] cursor-pointer group transition-all duration-500 hover:-translate-y-1.5 hover:border-white/[0.14] ${item.land ? "sm:col-span-2" : ""}`}
              style={{ background: "#0d0d1a" }}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.06, duration: 0.4 }}>
              <img src={item.img} alt={item.n} loading="lazy"
                className={`w-full block transition-transform duration-500 group-hover:scale-[1.03] ${item.land ? "aspect-video object-cover" : "aspect-[9/16] object-cover"}`} />
              <div className="text-center py-3 px-2 font-heading text-[11px] tracking-[1.5px] uppercase text-white/55 font-semibold">{item.n}</div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <div className="font-heading font-bold text-sm text-white">{item.n}</div>
                <div className="text-[10px] text-[#7eb7be] uppercase tracking-[1.5px] mt-1">{CAT_NAMES[item.c] || item.c}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-10 justify-center mt-10 pt-8 border-t border-white/[0.07]">
          {[["30+", "Apps Launched"], ["50+", "Clients Worldwide"], ["25+", "Industry Sectors"]].map(([v, l]) => (
            <div key={l} className="text-center">
              <strong className="font-heading text-2xl font-extrabold bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent block">{v}</strong>
              <span className="text-[11px] text-white/55">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
