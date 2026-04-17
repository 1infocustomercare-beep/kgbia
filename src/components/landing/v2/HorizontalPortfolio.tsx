import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

const PROJECTS = [
  { brand: "COTE Miami", sector: "Steakhouse Premium", img: `${S}/COTE%20Miami/a-obsidian-mobile-home.png`, accent: "#f59e0b", result: "+34%", metric: "Scontrino medio" },
  { brand: "Aura Spa", sector: "Wellness Boutique", img: `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`, accent: "#ec4899", result: "+218%", metric: "Prenotazioni online" },
  { brand: "Neo Nails", sector: "Beauty Studio", img: `${S}/Neo%20Nails%20Brickell/frosted-glass-home.png`, accent: "#a78bfa", result: "3.2×", metric: "Customer retention" },
  { brand: "City Padel", sector: "Sport Club", img: `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-home.png`, accent: "#22d3ee", result: "94%", metric: "Occupazione campi" },
  { brand: "DIMORA", sector: "Real Estate Luxury", img: `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`, accent: "#c9a84c", result: "+187%", metric: "Lead qualificati" },
  { brand: "Paperfish", sector: "Sushi Omakase", img: `${S}/Paperfish%20Sushi/a-sakura-home.png`, accent: "#ef4444", result: "100%", metric: "Sold-out 3 mesi" },
  { brand: "FAR Medical", sector: "Healthcare Premium", img: `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png`, accent: "#60a5fa", result: "GDPR", metric: "Compliance totale" },
];

export default function HorizontalPortfolio() {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Translate to show all cards. Move from 0 to -(N-1)*cardWidth%
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(PROJECTS.length - 1) * 78}%`]);

  return (
    <section
      ref={ref}
      id="portfolio"
      className="relative"
      style={{ height: `${PROJECTS.length * 80}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col justify-center">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(212,175,55,0.08), transparent)" }} />

        {/* Header */}
        <div className="relative z-10 px-5 lg:px-12 mb-8">
          <div className="max-w-[1400px] mx-auto flex items-end justify-between gap-6 flex-wrap">
            <div>
              <span className="inline-block px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[3px] mb-4 border border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/5 backdrop-blur-md">
                Portfolio Live
              </span>
              <h2 className="text-[clamp(2rem,5vw,3.6rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] text-white">
                847+ imprese.{" "}
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#7C3AED] bg-clip-text text-transparent">
                  Risultati verificabili.
                </span>
              </h2>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-white/40 text-[11px] uppercase tracking-[3px] font-medium">
              <span>Scroll orizzontale</span>
              <span className="w-12 h-[1px] bg-white/20" />
            </div>
          </div>
        </div>

        {/* Horizontal scrolling cards */}
        <motion.div style={{ x }} className="flex items-center gap-6 lg:gap-8 px-5 lg:px-12 will-change-transform">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.brand} p={p} />
          ))}
        </motion.div>

        {/* Footer */}
        <div className="relative z-10 px-5 lg:px-12 mt-8 text-center">
          <button
            onClick={() => navigate("/demo")}
            className="px-7 py-3 rounded-full text-white/90 font-semibold text-sm border border-white/15 hover:border-[#D4AF37]/50 hover:bg-white/[0.04] transition-all backdrop-blur-md"
          >
            Esplora tutti i progetti live →
          </button>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ p }: { p: typeof PROJECTS[0] }) {
  return (
    <div
      className="relative flex-shrink-0 w-[78vw] sm:w-[60vw] lg:w-[44vw] max-w-[640px] aspect-[16/10] rounded-[36px] overflow-hidden group"
      style={{
        background: `linear-gradient(135deg, ${p.accent}18, rgba(10,10,20,0.85))`,
        border: `1px solid ${p.accent}33`,
        boxShadow: `0 30px 80px ${p.accent}25, inset 0 0 0 1px rgba(255,255,255,0.05)`,
      }}
    >
      {/* Phone mockup */}
      <div className="absolute right-[-8%] top-1/2 -translate-y-1/2 w-[42%] aspect-[9/19.5] rotate-[8deg] transition-transform duration-700 group-hover:rotate-0 group-hover:scale-105">
        <div
          className="relative w-full h-full rounded-[36px] overflow-hidden"
          style={{
            border: `2px solid ${p.accent}55`,
            background: "#0a0a14",
            boxShadow: `0 30px 80px ${p.accent}40, inset 0 0 0 1px rgba(255,255,255,0.08)`,
          }}
        >
          <div className="absolute top-[1.5%] left-1/2 -translate-x-1/2 w-[28%] h-[2%] bg-black rounded-full z-20" />
          <div className="absolute inset-[3px] rounded-[34px] overflow-hidden">
            <img src={p.img} alt={p.brand} loading="lazy" className="w-full h-full object-cover object-top" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.1] via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Content */}
      <div className="relative h-full p-7 lg:p-10 flex flex-col justify-between max-w-[60%]">
        <div>
          <span
            className="inline-block px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[2px] mb-4 border backdrop-blur-md"
            style={{ borderColor: `${p.accent}55`, color: p.accent, background: `${p.accent}15` }}
          >
            {p.sector}
          </span>
          <h3 className="text-2xl lg:text-4xl font-heading font-extrabold text-white leading-[1] tracking-[-0.02em] mb-3">
            {p.brand}
          </h3>
          <p className="text-white/55 text-[12px] lg:text-[13px] leading-[1.6] max-w-[320px]">
            Sito premium, dashboard admin, agenti AI dedicati, integrazioni complete.
          </p>
        </div>

        <div
          className="inline-block px-4 py-3 rounded-2xl border backdrop-blur-md self-start"
          style={{
            borderColor: `${p.accent}55`,
            background: `linear-gradient(135deg, ${p.accent}25, rgba(0,0,0,0.5))`,
          }}
        >
          <div className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: p.accent }}>
            Risultato verificato
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-heading font-extrabold text-white">{p.result}</span>
            <span className="text-[11px] text-white/60">{p.metric}</span>
          </div>
        </div>
      </div>

      {/* Glow on hover */}
      <div
        className="absolute -inset-1 rounded-[36px] opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none -z-10 blur-3xl"
        style={{ background: p.accent }}
      />
    </div>
  );
}
