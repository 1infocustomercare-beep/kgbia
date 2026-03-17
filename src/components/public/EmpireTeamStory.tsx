import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Crown, Rocket, Heart, Brain, Target, Users, Sparkles, Linkedin, Dna, Zap, Globe, Network, ShieldCheck } from "lucide-react";

import teamKevin from "@/assets/team-kevin-ceo.jpg";
import teamAlessandra from "@/assets/team-alessandra-cto.jpg";
import teamMarco from "@/assets/team-marco-design.jpg";
import teamGiulia from "@/assets/team-giulia-sales.jpg";
import teamLuca from "@/assets/team-luca-ai.jpg";
import teamSofia from "@/assets/team-sofia-success.jpg";

const vpOnce = { once: true, margin: "-50px" as const };

const TEAM = [
  {
    name: "Kevin Berardini",
    role: "CEO & Founder",
    photo: teamKevin,
    bio: "Visionario tech con 10+ anni nell'automazione aziendale. Ha fondato Empire AI per democratizzare l'intelligenza artificiale nelle PMI italiane.",
    accent: "hsla(38,50%,55%,0.3)",
    objectPos: "center 30%",
  },
  {
    name: "Alessandra Vitali",
    role: "CTO & Co-Founder",
    photo: teamAlessandra,
    bio: "Ex lead architect in enterprise SaaS. Progetta l'architettura multi-tenant che alimenta 25+ settori in simultanea.",
    accent: "hsla(265,60%,60%,0.3)",
  },
  {
    name: "Marco De Santis",
    role: "Head of Design",
    photo: teamMarco,
    bio: "Pluripremiato UX designer. Crea interfacce che trasformano operazioni complesse in esperienze intuitive e premium.",
    accent: "hsla(180,50%,50%,0.3)",
  },
  {
    name: "Giulia Ferretti",
    role: "Head of Sales",
    photo: teamGiulia,
    bio: "Specialista in growth B2B con track record di 200+ aziende onboardate. Guida la rete partner su tutto il territorio.",
    accent: "hsla(15,60%,55%,0.3)",
  },
  {
    name: "Luca Marchetti",
    role: "AI Research Lead",
    photo: teamLuca,
    bio: "PhD in Machine Learning. Progetta i 91 agenti IA specializzati che automatizzano ogni aspetto del business.",
    accent: "hsla(220,60%,55%,0.3)",
  },
  {
    name: "Sofia Romano",
    role: "Customer Success",
    photo: teamSofia,
    bio: "Garantisce il successo di ogni cliente con onboarding personalizzato, formazione continua e supporto dedicato 24/7.",
    accent: "hsla(330,50%,55%,0.3)",
  },
];

/* ── DNA Helix Node ── */
const DnaNode = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-10"
    initial={{ scale: 0 }}
    whileInView={{ scale: 1 }}
    viewport={vpOnce}
    transition={{ type: "spring", stiffness: 300, delay }}
  >
    <div className="relative">
      {/* Outer orbital ring */}
      <motion.div
        className="absolute -inset-2 rounded-full"
        style={{ border: "1px solid hsla(265,70%,60%,0.15)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      {/* Pulse ring */}
      <motion.div
        className="absolute -inset-1 rounded-full"
        style={{ background: "radial-gradient(circle, hsla(265,70%,60%,0.2), transparent 70%)" }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, delay }}
      />
      {/* Core */}
      <div
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center relative"
        style={{
          background: "linear-gradient(135deg, hsla(265,70%,55%,0.3), hsla(38,50%,55%,0.2))",
          border: "1.5px solid hsla(265,70%,60%,0.3)",
          boxShadow: "0 0 20px hsla(265,70%,60%,0.15), inset 0 0 12px hsla(265,70%,60%,0.1)",
        }}
      />
    </div>
  </motion.div>
);

const MILESTONES = [
  {
    year: "2022",
    label: "Genesi — Il Codice Zero",
    desc: "Un singolo sviluppatore. Una visione: creare il DNA digitale che avrebbe dato vita all'intelligenza operativa per le imprese italiane. La prima cellula di Empire AI prende forma.",
    icon: Dna,
    metric: "Giorno 1",
    color: "hsla(265,70%,60%,0.2)",
    glowColor: "hsla(265,70%,60%,0.12)",
  },
  {
    year: "2023",
    label: "Prima Mutazione — Food OS",
    desc: "Il primo organismo digitale respira: menu IA generativi, ordini zero-attrito, cucina connessa in tempo reale. I ristoranti pilota registrano +40% efficienza dal primo mese.",
    icon: Zap,
    metric: "+40% efficienza",
    color: "hsla(38,55%,55%,0.25)",
    glowColor: "hsla(38,55%,55%,0.12)",
  },
  {
    year: "2024",
    label: "Replicazione — 25 Settori",
    desc: "Il DNA si replica. NCC, Beauty, Healthcare, Fitness, Retail, Hotel: ogni settore riceve il proprio genoma operativo personalizzato. La piattaforma diventa un ecosistema.",
    icon: Network,
    metric: "25+ verticali",
    color: "hsla(180,60%,50%,0.2)",
    glowColor: "hsla(180,60%,50%,0.1)",
  },
  {
    year: "2025",
    label: "Coscienza — 91 Agenti IA",
    desc: "L'intelligenza collettiva emerge: 91 agenti specializzati che apprendono, collaborano e si evolvono. Ogni business riceve un team di menti artificiali dedicate 24/7.",
    icon: Brain,
    metric: "91 AI agents",
    color: "hsla(265,70%,60%,0.2)",
    glowColor: "hsla(265,70%,60%,0.12)",
  },
  {
    year: "2026",
    label: "Simbiosi — Rete Nazionale",
    desc: "L'organismo raggiunge la massa critica: 150+ partner, 500+ aziende connesse, crescita 300% YoY. Empire AI è il sistema nervoso digitale delle PMI italiane.",
    icon: Globe,
    metric: "500+ aziende",
    color: "hsla(38,55%,55%,0.25)",
    glowColor: "hsla(38,55%,55%,0.12)",
  },
];

export default function EmpireTeamStory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-20 sm:py-28 px-5 sm:px-6 overflow-hidden">
      <div className="max-w-[1100px] mx-auto relative z-10">

        {/* ── Story Header ── */}
        <motion.div className="text-center mb-16 sm:mb-20" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce} transition={{ duration: 0.7 }}>
          <motion.div className="inline-flex items-center gap-2.5 mb-5">
            <div className="relative flex items-center gap-2 px-4 py-2 rounded-full overflow-hidden" style={{ background: "hsla(265,70%,60%,0.06)", border: "1px solid hsla(265,70%,60%,0.15)" }}>
              <Dna className="w-3 h-3" style={{ color: "hsl(265,70%,60%)" }} />
              <span className="text-[0.65rem] font-semibold tracking-[3px] uppercase" style={{ color: "hsl(265,70%,60%)" }}>Evoluzione Digitale</span>
            </div>
          </motion.div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-5">
            <span className="text-foreground">Il DNA di </span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, hsl(265,70%,60%), hsl(38,50%,55%), hsl(265,60%,55%))" }}>
              Empire AI
            </span>
          </h2>
          <p className="text-muted-foreground/70 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Non un semplice software — un organismo digitale in continua evoluzione. 
            Ogni milestone è una mutazione che ha reso la nostra piattaforma più intelligente, più potente, più adattiva.
          </p>
        </motion.div>

        {/* ── DNA Evolution Timeline ── */}
        <div className="relative mb-20 sm:mb-28">
          {/* DNA Double Helix vertical line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px" style={{ background: "linear-gradient(180deg, transparent 0%, hsla(265,70%,60%,0.35) 15%, hsla(38,55%,55%,0.3) 50%, hsla(265,70%,60%,0.35) 85%, transparent 100%)" }} />
          {/* Second strand (helix effect) */}
          <div className="absolute left-[18px] sm:left-[calc(50%+2px)] top-0 bottom-0 w-px opacity-40" style={{ background: "linear-gradient(180deg, transparent 5%, hsla(38,55%,55%,0.3) 20%, hsla(265,70%,60%,0.2) 50%, hsla(38,55%,55%,0.3) 80%, transparent 95%)" }} />
          
          {/* Floating DNA particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${i % 2 === 0 ? 'calc(50% - 8px)' : 'calc(50% + 8px)'}`,
                top: `${15 + i * 16}%`,
                background: i % 2 === 0 ? "hsla(265,70%,65%,0.5)" : "hsla(38,55%,55%,0.5)",
              }}
              animate={{ y: [-5, 5, -5], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
          
          {MILESTONES.map((m, i) => {
            const Icon = m.icon;
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={m.year}
                className={`relative flex items-start gap-4 sm:gap-0 mb-8 sm:mb-14 ${isLeft ? "sm:flex-row" : "sm:flex-row-reverse"}`}
                initial={{ opacity: 0, x: isLeft ? -30 : 30, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={vpOnce}
                transition={{ duration: 0.7, delay: i * 0.12 }}
              >
                {/* DNA Node with orbital animation */}
                <DnaNode delay={i * 0.12} />
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "hsl(38,50%,60%)" }} />
                </div>

                {/* Content card — futuristic glass morphism */}
                <div className={`ml-16 sm:ml-0 ${isLeft ? "sm:w-1/2 sm:pr-14 sm:text-right" : "sm:w-1/2 sm:pl-14"}`}>
                  <motion.div
                    className="relative p-4 sm:p-5 rounded-2xl overflow-hidden group"
                    style={{
                      background: "linear-gradient(135deg, hsla(230,12%,12%,0.7), hsla(265,15%,14%,0.5))",
                      border: "1px solid hsla(265,50%,50%,0.1)",
                      backdropFilter: "blur(16px)",
                    }}
                    whileHover={{ borderColor: "hsla(265,70%,60%,0.3)", y: -4, boxShadow: `0 16px 40px ${m.glowColor}` }}
                    transition={{ duration: 0.35 }}
                  >
                    {/* Top glow line */}
                    <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${m.color}, transparent)` }} />
                    
                    {/* Corner DNA micro-detail */}
                    <div className={`absolute top-2 ${isLeft ? 'sm:left-auto sm:right-3 right-3' : 'left-3'}`}>
                      <Dna className="w-3 h-3 opacity-20" style={{ color: "hsl(265,60%,60%)" }} />
                    </div>

                    {/* Year badge */}
                    <div className="inline-flex items-center gap-1.5 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: m.color }} />
                      <span className="text-[0.6rem] font-black tracking-[3px] uppercase" style={{ color: "hsl(265,70%,65%)" }}>{m.year}</span>
                    </div>

                    <h4 className="text-[0.85rem] sm:text-base font-bold text-foreground leading-tight">{m.label}</h4>
                    <p className="text-[0.7rem] sm:text-xs text-muted-foreground/55 mt-2 leading-relaxed">{m.desc}</p>

                    {/* Metric badge */}
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: m.color, border: `1px solid ${m.color}` }}>
                      <ShieldCheck className="w-2.5 h-2.5" style={{ color: "hsl(38,50%,65%)" }} />
                      <span className="text-[0.55rem] font-bold tracking-wider uppercase text-foreground/90">{m.metric}</span>
                    </div>
                  </motion.div>
                </div>

                {/* Spacer */}
                <div className="hidden sm:block sm:w-1/2" />
              </motion.div>
            );
          })}
        </div>

        {/* ── Team Header ── */}
        <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce}>
          <motion.div className="inline-flex items-center gap-2.5 mb-5">
            <div className="relative flex items-center gap-2 px-4 py-2 rounded-full overflow-hidden" style={{ background: "hsla(265,60%,55%,0.06)", border: "1px solid hsla(265,60%,55%,0.12)" }}>
              <Crown className="w-3 h-3" style={{ color: "hsl(265,60%,55%)" }} />
              <span className="text-[0.65rem] font-semibold tracking-[3px] uppercase" style={{ color: "hsl(265,60%,55%)" }}>Il Nostro Team</span>
            </div>
          </motion.div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-5">
            <span className="text-foreground">Le Persone Dietro </span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, hsl(265,60%,55%), hsl(38,50%,55%))" }}>
              Empire AI
            </span>
          </h2>
          <p className="text-muted-foreground/70 max-w-xl mx-auto text-sm sm:text-base">
            Un team multidisciplinare unito dalla passione per l'innovazione e la tecnologia applicata al business.
          </p>
        </motion.div>

        {/* ── Team Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              className="group relative rounded-2xl overflow-hidden"
              style={{ background: "hsla(230,10%,15%,0.5)", border: "1px solid hsla(38,50%,55%,0.08)", backdropFilter: "blur(16px)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vpOnce}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6, borderColor: "hsla(38,50%,55%,0.25)", boxShadow: `0 20px 50px ${member.accent}` }}
            >
              {/* Top accent */}
              <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${member.accent}, transparent)` }} />

              {/* Photo */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: (member as any).objectPos || "center top" }}
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, hsla(230,15%,10%,0.95) 100%)" }} />

                {/* Name overlay */}
                <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">{member.name}</h3>
                  <p className="text-[0.6rem] sm:text-xs font-semibold tracking-[1px] uppercase mt-0.5" style={{ color: "hsl(38,50%,60%)" }}>{member.role}</p>
                </div>
              </div>

              {/* Bio */}
              <div className="p-3 sm:p-4 pt-2">
                <p className="text-[0.65rem] sm:text-xs text-muted-foreground/60 leading-relaxed line-clamp-3">{member.bio}</p>
                {/* LinkedIn icon */}
                <motion.div className="mt-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: "hsla(210,80%,55%,0.1)", border: "1px solid hsla(210,80%,55%,0.15)" }}>
                    <Linkedin className="w-2.5 h-2.5" style={{ color: "hsl(210,80%,55%)" }} />
                  </div>
                  <span className="text-[0.55rem] text-muted-foreground/40">LinkedIn</span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Values strip ── */}
        <motion.div
          className="mt-14 sm:mt-20 grid grid-cols-3 gap-3 sm:gap-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vpOnce}
        >
          {[
            { icon: Brain, label: "Innovazione", value: "91 Agenti IA", color: "hsla(265,60%,55%,0.2)" },
            { icon: Heart, label: "Passione", value: "25+ Settori", color: "hsla(338,60%,55%,0.2)" },
            { icon: Target, label: "Risultati", value: "500+ Clienti", color: "hsla(38,50%,55%,0.2)" },
          ].map((v, i) => (
            <div key={i} className="text-center p-4 sm:p-6 rounded-2xl" style={{ background: "hsla(230,10%,15%,0.4)", border: "1px solid hsla(38,50%,55%,0.06)" }}>
              <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: v.color }}>
                <v.icon className="w-4 h-4 text-foreground/80" />
              </div>
              <p className="text-[0.6rem] sm:text-xs tracking-[2px] uppercase text-muted-foreground/40 mb-1">{v.label}</p>
              <p className="text-sm sm:text-lg font-bold text-foreground">{v.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
