import { motion } from "framer-motion";

const SECTORS = [
  "Ristoranti & Hospitality",
  "Spa & Wellness",
  "Beauty & Estetica",
  "Sport & Fitness",
  "Real Estate Luxury",
  "Healthcare & Cliniche",
  "NCC & Trasporti",
  "Hotel & B&B",
  "Bakery & Pasticcerie",
  "Stabilimenti Balneari",
  "Servizi alla Persona",
  "Studi Professionali",
  "Retail & E-commerce",
  "Centri Estetici",
  "Palestre & Yoga",
  "Officine & Carrozzerie",
  "Studi Medici",
  "Agenzie Immobiliari",
  "Saloni di Bellezza",
  "Pizzerie & Pub",
  "Catering & Banqueting",
  "Studi Veterinari",
  "Scuole di Lingua",
  "Studi Notarili",
  "Studi Architettura",
];

export default function SectorsCarousel() {
  return (
    <section id="settori" className="relative py-20 overflow-hidden">
      <div className="text-center mb-10 px-5">
        <span className="inline-block px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[3px] mb-4 border border-[#7C3AED]/30 text-[#a78bfa] bg-[#7C3AED]/5 backdrop-blur-md">
          25+ Settori Verticali
        </span>
        <h3 className="text-white/80 text-[14px] font-medium tracking-wide max-w-[600px] mx-auto">
          Verticalizzati per ogni settore. Personalizzati per ogni cliente.
        </h3>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-r from-[#020204] to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-l from-[#020204] to-transparent" />

        <motion.div
          className="flex gap-3 mb-3"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          {[...SECTORS, ...SECTORS].map((s, i) => (
            <span
              key={`r1-${i}`}
              className="flex-shrink-0 px-5 py-3 rounded-full border border-white/[0.07] backdrop-blur-md text-white/75 text-[13px] font-medium whitespace-nowrap hover:border-[#D4AF37]/40 hover:bg-white/[0.04] hover:text-white transition-all"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}
            >
              {s}
            </span>
          ))}
        </motion.div>

        <motion.div
          className="flex gap-3"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        >
          {[...SECTORS.slice().reverse(), ...SECTORS.slice().reverse()].map((s, i) => (
            <span
              key={`r2-${i}`}
              className="flex-shrink-0 px-5 py-3 rounded-full border border-white/[0.07] backdrop-blur-md text-white/75 text-[13px] font-medium whitespace-nowrap hover:border-[#7C3AED]/40 hover:bg-white/[0.04] hover:text-white transition-all"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}
            >
              {s}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
