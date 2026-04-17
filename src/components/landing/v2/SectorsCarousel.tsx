import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SECTORS = [
  { emoji: "🍝", name: "Ristoranti", count: "180+ attivi", color: "#f59e0b" },
  { emoji: "💆", name: "Spa & Wellness", count: "92+ attivi", color: "#ec4899" },
  { emoji: "💅", name: "Beauty & Estetica", count: "134+ attivi", color: "#a78bfa" },
  { emoji: "🏋️", name: "Fitness & Sport", count: "76+ attivi", color: "#22d3ee" },
  { emoji: "🏠", name: "Real Estate", count: "48+ attivi", color: "#c9a84c" },
  { emoji: "🩺", name: "Healthcare", count: "61+ attivi", color: "#60a5fa" },
  { emoji: "🚗", name: "NCC & Mobility", count: "38+ attivi", color: "#4ade80" },
  { emoji: "🏖️", name: "Beach Club", count: "29+ attivi", color: "#06b6d4" },
  { emoji: "🍰", name: "Pasticcerie", count: "54+ attivi", color: "#f472b6" },
  { emoji: "🐾", name: "Pet Care", count: "42+ attivi", color: "#84cc16" },
  { emoji: "🛒", name: "Retail", count: "88+ attivi", color: "#fb923c" },
  { emoji: "🏨", name: "Hotel & B&B", count: "57+ attivi", color: "#e879f9" },
  { emoji: "🔧", name: "Servizi Tecnici", count: "33+ attivi", color: "#fbbf24" },
  { emoji: "👔", name: "Consulenza", count: "21+ attivi", color: "#94a3b8" },
];

export default function SectorsCarousel() {
  const navigate = useNavigate();
  const [paused, setPaused] = useState(false);

  // Duplicate for infinite scroll
  const loop = [...SECTORS, ...SECTORS];

  return (
    <section id="settori" className="relative py-24 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[2px] mb-4 border border-[#F97316]/30 text-[#F97316] bg-[#F97316]/5">
            25+ Settori
          </span>
          <h2 className="text-[clamp(2rem,5vw,3.4rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] mb-4 text-white">
            Una soluzione per
            <span className="block bg-gradient-to-r from-[#F97316] to-[#D4AF37] bg-clip-text text-transparent">
              ogni tipo di business.
            </span>
          </h2>
          <p className="text-white/65 text-[clamp(0.95rem,1.6vw,1.05rem)] max-w-[640px] mx-auto leading-[1.65]">
            Ogni settore ha la sua dashboard verticale, i suoi agenti specializzati, le sue automazioni native.
            Non un template generico — una piattaforma costruita su misura per il tuo mercato.
          </p>
        </motion.div>
      </div>

      {/* Infinite ticker */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(90deg, #020204, transparent)" }} />
        <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(-90deg, #020204, transparent)" }} />

        <motion.div
          className="flex gap-4 py-4"
          animate={{ x: paused ? undefined : ["0%", "-50%"] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          {loop.map((s, i) => (
            <button
              key={i}
              onClick={() => navigate("/demo")}
              className="group flex-shrink-0 w-[200px] p-5 rounded-3xl border border-white/[0.07] backdrop-blur-xl text-left transition-all hover:-translate-y-1"
              style={{
                background: `linear-gradient(135deg, ${s.color}10, rgba(255,255,255,0.02))`,
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl grid place-items-center text-2xl mb-3 transition-transform group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${s.color}33, ${s.color}11)`,
                  border: `1px solid ${s.color}33`,
                }}
              >
                {s.emoji}
              </div>
              <h3 className="text-sm font-heading font-bold text-white mb-1">{s.name}</h3>
              <p className="text-[11px] font-medium" style={{ color: s.color }}>{s.count}</p>
            </button>
          ))}
        </motion.div>
      </div>

      <div className="text-center mt-10">
        <button
          onClick={() => navigate("/demo")}
          className="px-7 py-3 rounded-full text-white/90 font-semibold text-sm border border-white/15 hover:border-[#D4AF37]/50 hover:bg-white/[0.03] transition-all"
        >
          Esplora tutti i settori →
        </button>
      </div>
    </section>
  );
}
