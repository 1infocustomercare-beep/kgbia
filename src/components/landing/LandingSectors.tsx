import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

const SECTORS = [
  { name: "Ristorazione", img: `${S}/flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png`, desc: "Ordini automatici, prenotazioni smart e delivery — i tuoi clienti ordinano in 30 secondi.", accent: "#f97316" },
  { name: "Fitness & Sport", img: `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-home.png`, desc: "Prenota campi, corsi e abbonamenti in un tap. Più iscrizioni, meno telefonate.", accent: "#22d3ee" },
  { name: "Beauty & Wellness", img: `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`, desc: "Agenda sempre piena. I clienti prenotano da soli, tu ti concentri sul servizio.", accent: "#ec4899" },
  { name: "Hospitality", img: `${S}/COTE%20Miami/a-obsidian-mobile-home.png`, desc: "Check-in digitale, room service AI e concierge — l'esperienza 5 stelle automatizzata.", accent: "#c9a84c" },
  { name: "Pet Care", img: `${S}/Aloha%20Pet%20Resorts/mobile-a-home.png`, desc: "Prenotazioni, profili animali e monitoraggio live. I padroni adorano la trasparenza.", accent: "#4ade80" },
  { name: "Sushi & Nikkei", img: `${S}/Paperfish%20Sushi/a-sakura-home.png`, desc: "Menu interattivo con foto IA, ordini all-you-can-eat e consegna tracciata.", accent: "#fb923c" },
  { name: "NCC & Transfer", img: `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png`, desc: "Prenotazioni flotta, tracking in tempo reale e pagamenti automatici.", accent: "#60a5fa" },
  { name: "Charter & Nautica", img: `${S}/Miami%20Boats%20Rental/A-mobile-home.png`, desc: "Booking imbarcazioni, gestione itinerari e contratti digitali.", accent: "#38bdf8" },
  { name: "Luxury Retail", img: `${S}/Tatush%20Hair%20Fragrance/mobile-home.png`, desc: "Catalogo premium, checkout elegante e clienteling personalizzato dall'IA.", accent: "#a855f7" },
  { name: "Healthcare", img: `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png`, desc: "Appuntamenti, cartelle digitali e telemedicina — tutto conforme al GDPR.", accent: "#3b82f6" },
  { name: "Immobiliare", img: `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`, desc: "Annunci smart, virtual tour e CRM acquirenti con follow-up automatico.", accent: "#8b5cf6" },
  { name: "Watersports", img: `${S}/Miami%20Watersports/style-a-mobile-home.png`, desc: "Noleggio attrezzature, corsi ed escursioni con booking online e meteo live.", accent: "#06b6d4" },
  { name: "Nail Art", img: `${S}/Neo%20Nails%20Brickell/frosted-glass-home.png`, desc: "Galleria lavori, prenotazione servizi e programma loyalty tutto automatizzato.", accent: "#f472b6" },
  { name: "Nursery & Education", img: `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/home.png`, desc: "Iscrizioni, diario giornaliero e comunicazioni genitori — tutto in un'app.", accent: "#fbbf24" },
  { name: "Fast Food", img: `${S}/STRAPIZZAMI/stile-a-home.png`, desc: "Ordini rapidi, combo personalizzabili e fidelity digitale multi-punto vendita.", accent: "#ef4444" },
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
      {/* Deep emerald-tinted background */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #020208 0%, #06100e 30%, #08120f 50%, #020208 100%)",
      }} />
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(ellipse 50% 50% at 20% 80%, ${current.accent}08 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 80% 20%, ${current.accent}06 0%, transparent 60%)`,
      }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/15 to-transparent" />

      <div className="relative z-[1] max-w-[1320px] mx-auto px-5 text-center">
        <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase font-bold mb-5" style={{ color: current.accent }}>
          <span className="w-6 h-[2px] rounded-full" style={{ background: `linear-gradient(90deg, ${current.accent}, transparent)` }} />
          25+ SETTORI VERTICALI
        </span>
        <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold mb-3 text-white">
          Il Tuo Settore Ha Già la Sua <span style={{ color: current.accent }}>Soluzione Pronta.</span>
        </h2>
        <p className="text-white/60 max-w-[580px] mx-auto text-[15px] leading-[1.7] mb-10">
          Non partiamo da zero. Abbiamo già costruito piattaforme complete per il tuo tipo di business — pronte da personalizzare in 7 giorni.
        </p>

        <div className="flex gap-2 flex-wrap justify-center mb-10">
          {SECTORS.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-full text-[11px] font-semibold font-heading transition-all border ${
                i === active
                  ? "border-transparent text-white shadow-lg"
                  : "bg-white/[0.02] border-white/[0.08] text-white/45 hover:border-white/[0.18] hover:text-white/75"
              }`}
              style={i === active ? { background: current.accent, boxShadow: `0 4px 20px ${current.accent}40` } : undefined}
            >
              {s.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="flex items-center justify-center gap-8 lg:gap-12 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative">
              <div className="absolute -inset-10 rounded-full blur-3xl" style={{ background: `radial-gradient(ellipse, ${current.accent}18, transparent 60%)` }} />
              <div
                className="relative w-[180px] sm:w-[200px] aspect-[9/19.5] rounded-[22%/10%] border-[2.5px] overflow-hidden"
                style={{ borderColor: `${current.accent}30`, background: "#0a0a14", boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 40px ${current.accent}10` }}
              >
                <div className="absolute top-[3%] left-1/2 -translate-x-1/2 w-[28%] h-[3%] bg-black rounded-full z-20" />
                <div className="absolute inset-[2px] rounded-[20%/9%] overflow-hidden">
                  <img src={current.img} alt={current.name} className="w-full h-full object-cover object-top" loading="lazy" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[26%] h-[1.5%] bg-white/15 rounded-full z-20" />
              </div>
            </div>

            <div className="max-w-[380px] text-left">
              <h3 className="text-xl sm:text-2xl font-heading font-bold mb-3 text-white">{current.name}</h3>
              <p className="text-white/60 text-sm leading-[1.8] mb-5">{current.desc}</p>
              <button
                onClick={() => navigate("/demo")}
                className="px-6 py-2.5 rounded-full text-white font-semibold text-xs transition-all hover:-translate-y-[1px]"
                style={{ background: current.accent, boxShadow: `0 8px 24px ${current.accent}30` }}
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
