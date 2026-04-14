import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

const SECTORS = [
  { name: "Ristorazione", img: `${S}/flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png`, desc: "Menu digitali interattivi, ordini automatici via QR, prenotazioni smart con conferma istantanea, delivery integrato e programmi fedeltà che trasformano clienti occasionali in habituè.", accent: "#e67e22" },
  { name: "Fitness & Sport", img: `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-home.png`, desc: "Prenotazione campi e corsi in un tap, schede allenamento personalizzate dall'IA, abbonamenti con rinnovo automatico e analytics sulle performance dei tuoi iscritti.", accent: "#22d3ee" },
  { name: "Beauty & Wellness", img: `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`, desc: "Booking trattamenti con staff scheduling, gestione clienti VIP, programmi fedeltà con reward automatici e vendita prodotti integrata nel tuo ecosistema digitale.", accent: "#ec4899" },
  { name: "Hospitality", img: `${S}/COTE%20Miami/a-obsidian-mobile-home.png`, desc: "Check-in digitale contactless, room service con menu interattivo, concierge IA disponibile 24/7 e housekeeping management in tempo reale per ogni camera.", accent: "#c9a84c" },
  { name: "Pet Care", img: `${S}/Aloha%20Pet%20Resorts/mobile-a-home.png`, desc: "Prenotazioni struttura con profili dettagliati per ogni animale, monitoraggio live con webcam, comunicazione veterinaria integrata e reminder vaccinazioni automatici.", accent: "#4ade80" },
  { name: "NCC & Transfer", img: `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png`, desc: "Gestione flotta professionale con GPS live, preventivi istantanei basati su distanza e fascia oraria, pagamenti automatici e reportistica fiscale completa.", accent: "#60a5fa" },
  { name: "Healthcare", img: `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png`, desc: "Agenda appuntamenti intelligente, cartelle cliniche digitali crittografate, telemedicina con video-consulti e fatturazione automatica con invio al Sistema Tessera Sanitaria.", accent: "#3b82f6" },
  { name: "Immobiliare", img: `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`, desc: "Portfolio immobili con virtual tour immersivi, CRM acquirenti con scoring automatico, follow-up IA personalizzati e matching proprietà-cliente intelligente.", accent: "#a855f7" },
];

export default function LandingSectors() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % SECTORS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const current = SECTORS[active];

  return (
    <section id="settori" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #060818 0%, #0a0e24 40%, #070a1c 100%)" }} />
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(ellipse 40% 40% at 20% 70%, ${current.accent}08 0%, transparent 60%)`,
        transition: "background-image 0.8s ease",
      }} />

      <div className="relative z-[1] max-w-[1200px] mx-auto px-5">
        <div className="text-center mb-10">
          <span className="inline-block text-[11px] tracking-[3px] uppercase font-bold mb-4 px-4 py-1.5 rounded-full border border-[#c9a84c]/20 bg-[#c9a84c]/5 text-[#c9a84c]">
            25+ Settori Verticali
          </span>
          <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-heading font-bold mb-4 text-white leading-tight">
            Un'Unica Piattaforma.<br />
            <span className="text-[#c9a84c]">Ogni Settore Dominato.</span>
          </h2>
          <p className="text-white/60 max-w-[600px] mx-auto text-[16px] leading-[1.8]">
            App personalizzate, gestionali completi e automazioni IA — progettati specificamente per le esigenze del tuo settore, non soluzioni generiche.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap justify-center mb-12">
          {SECTORS.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setActive(i)}
              className="px-4 py-2.5 rounded-full text-[12px] font-semibold transition-all border"
              style={i === active ? {
                background: current.accent,
                borderColor: current.accent,
                color: "#fff",
                boxShadow: `0 8px 24px ${current.accent}40`,
              } : {
                background: "rgba(255,255,255,0.02)",
                borderColor: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {s.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="flex items-center justify-center gap-10 lg:gap-16 flex-wrap"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45 }}
          >
            <div className="relative">
              <div className="absolute -inset-12 rounded-full blur-[60px] opacity-20" style={{ background: current.accent }} />
              <div
                className="relative w-[200px] sm:w-[220px] aspect-[9/19.5] rounded-[22%/10%] border-[3px] overflow-hidden"
                style={{ borderColor: "rgba(255,255,255,0.1)", background: "#0a0a14", boxShadow: `0 24px 64px rgba(0,0,0,0.6), 0 0 80px ${current.accent}15` }}
              >
                <div className="absolute top-[3%] left-1/2 -translate-x-1/2 w-[28%] h-[3%] bg-black rounded-full z-20" />
                <div className="absolute inset-[2px] rounded-[20%/9%] overflow-hidden">
                  <img src={current.img} alt={current.name} className="w-full h-full object-cover object-top" loading="lazy" />
                </div>
                <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[26%] h-[1.5%] bg-white/15 rounded-full z-20" />
              </div>
            </div>

            <div className="max-w-[420px] text-left">
              <h3 className="text-2xl sm:text-3xl font-heading font-bold mb-4 text-white">{current.name}</h3>
              <p className="text-white/65 text-[15px] leading-[1.9] mb-6">{current.desc}</p>
              <button
                onClick={() => navigate("/demo")}
                className="px-7 py-3 rounded-full text-white font-semibold text-sm transition-all hover:-translate-y-[1px]"
                style={{ background: current.accent, boxShadow: `0 12px 32px ${current.accent}30` }}
              >
                Esplora il Settore →
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
