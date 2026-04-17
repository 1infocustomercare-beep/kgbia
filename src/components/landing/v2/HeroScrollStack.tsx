import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

const SCENES = [
  {
    src: `${S}/COTE%20Miami/a-obsidian-mobile-home.png`,
    eyebrow: "Ristoranti & Hospitality",
    title: "Il menù si aggiorna da solo.",
    sub: "I clienti ordinano dal QR code, lo staff riceve le comande in cucina, l'AI gestisce upselling e recensioni. Tu incassi il 30% in più senza alzare un dito.",
    accent: "#f59e0b",
    metric: "+34% ordini medi",
  },
  {
    src: `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`,
    eyebrow: "Spa & Wellness",
    title: "Agenda piena, zero no-show.",
    sub: "Prenotazioni 24/7, promemoria automatici via WhatsApp, cross-selling intelligente sui trattamenti. La tua spa lavora anche mentre dormi.",
    accent: "#ec4899",
    metric: "−72% appuntamenti persi",
  },
  {
    src: `${S}/Neo%20Nails%20Brickell/frosted-glass-home.png`,
    eyebrow: "Beauty & Estetica",
    title: "Il tuo salone diventa un brand.",
    sub: "Sito premium, booking integrato, programma fedeltà digitale. Ogni cliente torna 3,2 volte in più rispetto alla media di settore.",
    accent: "#a78bfa",
    metric: "3.2× retention",
  },
  {
    src: `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-home.png`,
    eyebrow: "Sport & Fitness",
    title: "Campi sempre prenotati.",
    sub: "Calendario in tempo reale, pagamenti istantanei, gestione abbonamenti. Trasformiamo i tuoi spazi in una macchina che genera cassa ogni giorno.",
    accent: "#22d3ee",
    metric: "94% occupazione media",
  },
  {
    src: `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`,
    eyebrow: "Real Estate & Luxury",
    title: "Lead qualificati in autonomia.",
    sub: "Agenti AI che scovano prospect, qualificano l'intent e fissano gli appuntamenti. Tu chiudi solo trattative pronte alla firma.",
    accent: "#c9a84c",
    metric: "+187% lead qualificati",
  },
  {
    src: `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png`,
    eyebrow: "Healthcare & Cliniche",
    title: "Pazienti gestiti come in un 5 stelle.",
    sub: "Cartelle digitali sicure, telemedicina integrata, reminder farmacologici automatici. Conformità GDPR e AI compliance fiscale 2026.",
    accent: "#60a5fa",
    metric: "100% GDPR compliant",
  },
];

const TRUST = [
  "847+ Imprese Attive",
  "25+ Settori Verticali",
  "98 Agenti IA Specializzati",
  "Garanzia 90 Giorni",
];

function Scene({ scene, idx }: { scene: typeof SCENES[0]; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const phoneY = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -60]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.92]);
  const phoneRotate = useTransform(scrollYProgress, [0, 0.5, 1], [idx % 2 === 0 ? -3 : 3, 0, idx % 2 === 0 ? 2 : -2]);
  const textX = useTransform(scrollYProgress, [0, 0.5, 1], [idx % 2 === 0 ? -40 : 40, 0, idx % 2 === 0 ? 20 : -20]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.4]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1.2, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.55, 0.3]);

  const isReverse = idx % 2 !== 0;

  return (
    <div ref={ref} className="relative min-h-[80svh] flex items-center py-12 lg:py-20">
      <motion.div style={{ opacity }} className="w-full grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Phone */}
        <motion.div
          style={{
            y: phoneY,
            scale: phoneScale,
            rotate: phoneRotate,
            order: isReverse ? 2 : 1,
          }}
          className="relative mx-auto"
        >
          <motion.div
            style={{
              scale: glowScale,
              opacity: glowOpacity,
              background: `radial-gradient(circle, ${scene.accent}55, transparent 65%)`,
            }}
            className="absolute -inset-12 blur-[60px] pointer-events-none"
          />
          <div
            className="relative w-[240px] sm:w-[280px] aspect-[9/19.5] rounded-[42px] overflow-hidden"
            style={{
              border: `2px solid ${scene.accent}55`,
              background: "#0a0a14",
              boxShadow: `0 40px 100px ${scene.accent}30, 0 0 0 1px ${scene.accent}22, inset 0 0 0 1px rgba(255,255,255,0.06)`,
            }}
          >
            <div className="absolute top-[2%] left-1/2 -translate-x-1/2 w-[28%] h-[2.4%] bg-black rounded-full z-20" />
            <div className="absolute inset-[3px] rounded-[40px] overflow-hidden">
              <img src={scene.src} alt={scene.title} loading="lazy" decoding="async" className="w-full h-full object-cover object-top" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-[1.5%] left-1/2 -translate-x-1/2 w-[26%] h-[1.2%] bg-white/15 rounded-full z-20" />
          </div>

          {/* Floating metric */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ delay: 0.3, type: "spring" }}
            className="absolute -top-4 -right-2 sm:-right-8 px-3 py-2 rounded-2xl backdrop-blur-xl border z-30"
            style={{
              background: `linear-gradient(135deg, ${scene.accent}25, rgba(0,0,0,0.6))`,
              borderColor: `${scene.accent}55`,
              boxShadow: `0 12px 40px ${scene.accent}30`,
            }}
          >
            <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: scene.accent }}>Risultato Reale</div>
            <div className="text-sm font-heading font-extrabold text-white mt-0.5">{scene.metric}</div>
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          style={{ x: textX, order: isReverse ? 1 : 2 }}
          className="text-center lg:text-left px-4"
        >
          <span
            className="inline-block px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[2px] mb-4 border"
            style={{
              color: scene.accent,
              borderColor: `${scene.accent}44`,
              background: `${scene.accent}10`,
            }}
          >
            {scene.eyebrow}
          </span>
          <h3 className="text-[clamp(1.6rem,4vw,2.8rem)] font-heading font-extrabold leading-[1.05] tracking-[-0.03em] mb-4 text-white">
            {scene.title}
          </h3>
          <p className="text-[clamp(0.95rem,1.6vw,1.05rem)] text-white/65 leading-[1.65] max-w-[480px] mx-auto lg:mx-0">
            {scene.sub}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function HeroScrollStack() {
  const navigate = useNavigate();
  const introRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: introProgress } = useScroll({
    target: introRef,
    offset: ["start start", "end start"],
  });
  const introY = useTransform(introProgress, [0, 1], [0, -80]);
  const introOpacity = useTransform(introProgress, [0, 0.8], [1, 0]);
  const introScale = useTransform(introProgress, [0, 1], [1, 0.92]);

  return (
    <section id="hero" className="relative">
      {/* Atmospheric BG */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,58,237,0.18), transparent 60%)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
      }} />

      {/* Intro */}
      <div ref={introRef} className="relative min-h-[100svh] flex items-center justify-center px-5 pt-24 pb-12">
        <motion.div style={{ y: introY, opacity: introOpacity, scale: introScale }} className="relative z-[2] max-w-[920px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
            style={{
              borderColor: "rgba(212,175,55,0.3)",
              background: "rgba(212,175,55,0.06)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#22c55e] animate-pulse" />
            <span className="text-[11px] tracking-[2.5px] uppercase font-bold" style={{ color: "#D4AF37" }}>
              Empire Autonomous AI · Piattaforma #1 in Italia
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9 }}
            className="text-[clamp(2.4rem,7vw,5.2rem)] font-heading font-extrabold leading-[0.92] tracking-[-0.04em] mb-6"
          >
            <span className="block text-white">Il tuo business.</span>
            <span className="block bg-gradient-to-r from-[#D4AF37] via-[#a78bfa] to-[#7C3AED] bg-clip-text text-transparent">
              Completamente autonomo.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/75 text-[clamp(1rem,2vw,1.18rem)] leading-[1.6] max-w-[640px] mx-auto mb-8 font-light"
          >
            98 agenti AI specializzati prendono in carico ordini, prenotazioni, marketing, fiscalità e acquisizione clienti.
            <span className="text-white font-medium"> Tu decidi la strategia. Tutto il resto, lo facciamo noi.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
          >
            <button
              onClick={() => navigate("/demo")}
              className="group px-8 py-4 rounded-full text-white font-semibold text-sm font-heading inline-flex items-center justify-center gap-2 transition-all hover:-translate-y-[2px]"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #7C3AED)",
                boxShadow: "0 16px 48px rgba(124,58,237,0.45)",
              }}
            >
              Vedi una Demo Live
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
            <button
              onClick={() => document.getElementById("prezzi")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 rounded-full text-white/90 font-semibold text-sm border border-white/15 hover:border-[#D4AF37]/50 hover:bg-white/[0.03] transition-all"
            >
              Scopri i Pacchetti
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-wrap justify-center gap-x-5 gap-y-2"
          >
            {TRUST.map((t) => (
              <span key={t} className="text-[11px] text-white/45 font-medium tracking-wide flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60" />
                {t}
              </span>
            ))}
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ delay: 1.6, y: { repeat: Infinity, duration: 2 } }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-white/40 text-[10px] uppercase tracking-[3px] font-medium"
          >
            scroll
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll-revealed scenes */}
      <div className="relative max-w-[1200px] mx-auto px-5">
        {SCENES.map((s, i) => (
          <Scene key={s.title} scene={s} idx={i} />
        ))}
      </div>
    </section>
  );
}
