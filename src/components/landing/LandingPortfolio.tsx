import { useState } from "react";

const SB = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups/";

const PORTFOLIO = [
  { n: "Flame Kebab", c: "food", img: "flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png" },
  { n: "Aura Milano Spa", c: "beauty", img: "Aura%20Milano%20Spa/mobile-luce-pura-home.png" },
  { n: "COTE Miami", c: "food", img: "COTE%20Miami/a-obsidian-mobile-home.png" },
  { n: "Midtown Kosher", c: "food", img: "Midtown%20Kosher/style-a-home.png", land: true },
  { n: "Neo Nails", c: "beauty", img: "Neo%20Nails%20Brickell/frosted-glass-home.png" },
  { n: "Top Golf Bay", c: "sport", img: "Top%20Golf%20Bay%20App/a-official-home.png" },
  { n: "Paperfish Sushi", c: "food", img: "Paperfish%20Sushi/a-sakura-home.png" },
  { n: "City Padel", c: "sport", img: "City%20Padel%20Milano/mobile-fresh-azzurro-home.png" },
  { n: "MMI Resident Hub", c: "app", img: "MMI%20Resident%20Hub/01-ocean-azure-desktop-dashboard.png", land: true },
  { n: "LuxDrive", c: "app", img: "LuxDrive/style-a-home.png" },
  { n: "Tatush Hair", c: "ecom", img: "Tatush%20Hair%20Fragrance/mobile-home.png" },
  { n: "DIMORA Milano", c: "app", img: "DIMORA%20Milano/eleganza-milanese-home-mobile.png" },
  { n: "Little Diamond", c: "life", img: "Little%20Diamond%20Nursery%20-%20Playful%20Colorful/home.png" },
  { n: "Asinara Charter", c: "app", img: "Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png" },
  { n: "Aloha Pet", c: "life", img: "Aloha%20Pet%20Resorts/mobile-a-home.png" },
  { n: "Strapizzami", c: "food", img: "STRAPIZZAMI/stile-a-home.png" },
];

const FILTERS = [
  { label: "Tutti", value: "all" },
  { label: "Food", value: "food" },
  { label: "Beauty", value: "beauty" },
  { label: "Sport", value: "sport" },
  { label: "App", value: "app" },
  { label: "E-Commerce", value: "ecom" },
  { label: "Lifestyle", value: "life" },
];

export default function LandingPortfolio() {
  const [filter, setFilter] = useState("all");
  const items = filter === "all" ? PORTFOLIO : PORTFOLIO.filter(p => p.c === filter);

  return (
    <section className="py-[100px] sm:py-[100px]" id="portfolio" style={{ background: "linear-gradient(180deg, #020204 0%, #0d0d1a 50%, #020204 100%)" }}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="flex justify-between items-end flex-wrap gap-4 mb-6">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-4 before:content-[''] before:w-5 before:h-[1.5px] before:bg-[#7eb7be]">PORTFOLIO</span>
            <h2 className="text-[#f0f0f5]" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 700, lineHeight: 1.1 }}>
              30+ Progetti <em className="not-italic" style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Premium</em>
            </h2>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {FILTERS.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)} className={`px-[18px] py-2 rounded-3xl text-xs font-semibold transition-all ${filter === f.value ? "text-white" : "text-[rgba(240,240,245,0.55)] hover:border-[#7eb7be] hover:text-[#7eb7be]"}`}
              style={{
                border: filter === f.value ? "1px solid transparent" : "1px solid rgba(255,255,255,0.07)",
                background: filter === f.value ? "linear-gradient(135deg, #7eb7be, #6c3ce0)" : "transparent",
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <div key={i} className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 group hover:translate-y-[-6px] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] ${item.land ? "sm:col-span-2" : ""}`}
              style={{ border: "1px solid rgba(255,255,255,0.07)", background: "#0d0d1a" }}>
              <img src={`${SB}${item.img}`} alt={item.n} className={`w-full block transition-transform duration-500 group-hover:scale-[1.03] ${item.land ? "aspect-video object-cover" : "aspect-[9/16] object-cover"}`} loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="font-bold text-sm text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.n}</span>
                <span className="text-[10px] text-[#7eb7be] uppercase tracking-[1.5px] mt-1">{item.c}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-10 justify-center mt-10 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          {[{ v: "30+", l: "Apps Launched" }, { v: "50+", l: "Clients Worldwide" }, { v: "25+", l: "Industry Sectors" }].map(s => (
            <div key={s.l} className="text-center">
              <strong className="block text-[1.6rem] font-extrabold" style={{ fontFamily: "'Space Grotesk', sans-serif", background: "linear-gradient(135deg, #7eb7be, #6c3ce0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.v}</strong>
              <span className="text-[11px] text-[rgba(240,240,245,0.55)]">{s.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
