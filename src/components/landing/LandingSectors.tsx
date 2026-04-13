import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

const SECTORS = [
  { name: "Ristorazione", img: `${S}/flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png`, desc: "App ordini, menu QR, prenotazioni, delivery" },
  { name: "Fitness", img: `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-home.png`, desc: "Prenotazioni corsi, schede, abbonamenti" },
  { name: "Beauty", img: `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`, desc: "Booking trattamenti, fidelity, prodotti" },
  { name: "Hotel", img: `${S}/COTE%20Miami/a-obsidian-mobile-home.png`, desc: "Check-in, room service, concierge AI" },
  { name: "Pet Care", img: `${S}/Aloha%20Pet%20Resorts/mobile-a-home.png`, desc: "Prenotazioni, profili animali, veterinario" },
  { name: "Sport", img: `${S}/Top%20Golf%20Bay%20App/a-official-home.png`, desc: "Campi, tornei, leaderboard, shop" },
  { name: "Sushi", img: `${S}/Paperfish%20Sushi/a-sakura-home.png`, desc: "Ordini, all-you-can-eat, delivery" },
  { name: "NCC", img: `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png`, desc: "Prenotazioni, tracking, pagamenti" },
  { name: "Charter", img: `${S}/Miami%20Boats%20Rental/A-mobile-home.png`, desc: "Booking barche, itinerari, crew" },
  { name: "Luxury", img: `${S}/Tatush%20Hair%20Fragrance/mobile-home.png`, desc: "Catalogo, checkout, brand premium" },
  { name: "Healthcare", img: `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png`, desc: "Appuntamenti, documenti, fatturazione" },
  { name: "Immobiliare", img: `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`, desc: "Annunci, virtual tour, CRM" },
  { name: "Nail Art", img: `${S}/Neo%20Nails%20Brickell/frosted-glass-home.png`, desc: "Galleria, booking, loyalty" },
  { name: "Nursery", img: `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/home.png`, desc: "Iscrizioni, diario, comunicazioni" },
  { name: "Watersport", img: `${S}/Miami%20Watersports/style-a-mobile-home.png`, desc: "Noleggi, corsi, escursioni" },
  { name: "Fast Food", img: `${S}/STRAPIZZAMI/stile-a-home.png`, desc: "Ordini rapidi, combo, fidelity" },
];

export default function LandingSectors() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % SECTORS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const current = SECTORS[active];

  return (
    <section id="settori" className="py-16 lg:py-24" style={{ background: "#020204" }}>
      <div className="max-w-[1320px] mx-auto px-5 text-center">
        <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-5">
          <span className="w-5 h-[1.5px] bg-[#7eb7be]" />I NOSTRI SETTORI
        </span>
        <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold mb-2 text-white">
          Un sistema. <span className="bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">Infiniti settori.</span>
        </h2>
        <p className="text-white/55 max-w-[620px] mx-auto text-[15px] leading-[1.7] mb-8">
          App, siti web, gestionali e automazioni IA personalizzati per ogni tipo di business.
        </p>

        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {SECTORS.map((s, i) => (
            <button key={s.name} onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-full text-xs font-semibold font-heading transition-all border ${
                i === active
                  ? "bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] border-transparent text-white shadow-lg"
                  : "bg-transparent border-white/[0.07] text-white/55 hover:border-[#7eb7be] hover:text-[#7eb7be]"
              }`}>
              {s.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={active}
            className="flex items-center justify-center gap-8 flex-wrap"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}>
            <div className="w-[200px] rounded-3xl overflow-hidden border border-white/[0.07]"
              style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
              <img src={current.img} alt={current.name} className="w-full block" loading="lazy" />
            </div>
            <div className="max-w-[340px] text-left">
              <h3 className="text-xl font-heading font-bold mb-2 text-white">{current.name}</h3>
              <p className="text-white/55 text-sm leading-[1.7] mb-4">
                {current.desc}. App dedicata con AI, dashboard gestionale e agenti inclusi.
              </p>
              <button onClick={() => navigate("/demo")}
                className="px-6 py-2.5 rounded-full text-white font-semibold text-xs"
                style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)" }}>
                Scopri il Piano →
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
