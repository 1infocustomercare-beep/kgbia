import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

const SECTORS = [
  { name: "Ristorazione", img: `${S}/flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png`, desc: "Menu digitali, ordini automatici, prenotazioni smart, delivery integrato e fidelizzazione clienti." },
  { name: "Fitness & Sport", img: `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-home.png`, desc: "Prenotazione campi e corsi, schede allenamento personalizzate, abbonamenti e pagamenti in-app." },
  { name: "Beauty & Wellness", img: `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`, desc: "Booking trattamenti, gestione staff, programmi fedeltà e vendita prodotti direttamente dall'app." },
  { name: "Hospitality", img: `${S}/COTE%20Miami/a-obsidian-mobile-home.png`, desc: "Check-in digitale, room service, concierge AI e housekeeping management tutto in un'unica piattaforma." },
  { name: "Pet Care", img: `${S}/Aloha%20Pet%20Resorts/mobile-a-home.png`, desc: "Prenotazioni struttura, profili animali, monitoraggio live e comunicazione veterinaria integrata." },
  { name: "Sushi & Nikkei", img: `${S}/Paperfish%20Sushi/a-sakura-home.png`, desc: "Ordini all-you-can-eat, menu interattivo con foto IA, consegna tracciata e programmi loyalty." },
  { name: "NCC & Transfer", img: `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png`, desc: "Prenotazioni flotta, tracking in tempo reale, tariffario dinamico e pagamenti automatici." },
  { name: "Charter & Nautica", img: `${S}/Miami%20Boats%20Rental/A-mobile-home.png`, desc: "Booking imbarcazioni, gestione itinerari, crew management e contratti digitali." },
  { name: "Luxury Retail", img: `${S}/Tatush%20Hair%20Fragrance/mobile-home.png`, desc: "Catalogo premium, checkout ottimizzato, brand experience e clienteling personalizzato." },
  { name: "Healthcare", img: `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png`, desc: "Gestione appuntamenti, cartelle cliniche digitali, telemedicina e fatturazione automatica." },
  { name: "Immobiliare", img: `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`, desc: "Annunci smart, virtual tour, CRM acquirenti e automazione follow-up con IA." },
  { name: "Watersports", img: `${S}/Miami%20Watersports/style-a-mobile-home.png`, desc: "Noleggio attrezzature, corsi e escursioni con booking online e meteo integrato." },
  { name: "Nail Art", img: `${S}/Neo%20Nails%20Brickell/frosted-glass-home.png`, desc: "Galleria lavori, prenotazione servizi, programma loyalty e gestione magazzino prodotti." },
  { name: "Nursery & Education", img: `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/home.png`, desc: "Iscrizioni digitali, diario giornaliero, comunicazioni genitori e pagamenti rette." },
  { name: "Fast Food", img: `${S}/STRAPIZZAMI/stile-a-home.png`, desc: "Ordini rapidi, combo personalizzabili, fidelity card digitale e gestione multi-punto vendita." },
];

export default function LandingSectors() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % SECTORS.length), 4500);
    return () => clearInterval(t);
  }, []);

  const current = SECTORS[active];

  return (
    <section id="settori" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Premium background */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #08081a 0%, #0e0e24 30%, #0a0a1c 70%, #060612 100%)",
      }} />
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(ellipse 50% 50% at 20% 80%, rgba(126,183,190,0.05) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 80% 20%, rgba(108,60,224,0.04) 0%, transparent 60%)",
      }} />
      <div className="absolute inset-0" style={{
        backgroundImage: "linear-gradient(rgba(126,183,190,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(126,183,190,0.015) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative z-[1] max-w-[1320px] mx-auto px-5 text-center">
        <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-bold mb-5">
          <span className="w-6 h-[2px] bg-gradient-to-r from-[#7eb7be] to-transparent" />SETTORI VERTICALI
        </span>
        <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold mb-3 text-white">
          Una Piattaforma. <span className="bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">Ogni Settore Coperto.</span>
        </h2>
        <p className="text-white/55 max-w-[580px] mx-auto text-[15px] leading-[1.7] mb-10">
          App, siti web, gestionali e automazioni IA — costruiti su misura per il tuo tipo di business.
        </p>

        {/* Sector pills */}
        <div className="flex gap-2 flex-wrap justify-center mb-10">
          {SECTORS.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-full text-[11px] font-semibold font-heading transition-all border ${
                i === active
                  ? "bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] border-transparent text-white shadow-lg shadow-[#7eb7be]/20"
                  : "bg-white/[0.02] border-white/[0.08] text-white/50 hover:border-[#7eb7be]/40 hover:text-white/80"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Active sector showcase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="flex items-center justify-center gap-8 lg:gap-12 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {/* Phone mockup */}
            <div className="relative">
              <div className="absolute -inset-10 bg-gradient-to-br from-[#7eb7be]/12 to-[#6c3ce0]/10 rounded-full blur-3xl" />
              <div
                className="relative w-[180px] sm:w-[200px] aspect-[9/19.5] rounded-[22%/10%] border-[2.5px] overflow-hidden"
                style={{ borderColor: "rgba(255,255,255,0.12)", background: "#0a0a14", boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)" }}
              >
                <div className="absolute top-[3%] left-1/2 -translate-x-1/2 w-[28%] h-[3%] bg-black rounded-full z-20" />
                <div className="absolute inset-[2px] rounded-[20%/9%] overflow-hidden">
                  <img src={current.img} alt={current.name} className="w-full h-full object-cover object-top" loading="lazy" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[26%] h-[1.5%] bg-white/15 rounded-full z-20" />
              </div>
            </div>

            {/* Info */}
            <div className="max-w-[380px] text-left">
              <h3 className="text-xl sm:text-2xl font-heading font-bold mb-3 text-white">{current.name}</h3>
              <p className="text-white/60 text-sm leading-[1.8] mb-5">{current.desc}</p>
              <button
                onClick={() => navigate("/demo")}
                className="px-6 py-2.5 rounded-full text-white font-semibold text-xs transition-all hover:-translate-y-[1px] hover:shadow-lg hover:shadow-[#7eb7be]/20"
                style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)" }}
              >
                Vedi Demo del Settore →
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
