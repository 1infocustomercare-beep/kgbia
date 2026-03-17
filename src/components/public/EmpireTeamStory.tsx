import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Crown, Rocket, Heart, Brain, Target, Users, Sparkles, Linkedin } from "lucide-react";

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

const MILESTONES = [
  { year: "2022", label: "L'idea nasce", desc: "Kevin fonda Empire AI con la visione di un OS intelligente per le imprese italiane.", icon: Sparkles },
  { year: "2023", label: "Primo Prodotto", desc: "Lancio della piattaforma food con menu AI, ordini digitali e gestione completa.", icon: Rocket },
  { year: "2024", label: "Espansione Multi-Settore", desc: "Da 1 a 25+ settori: NCC, Beauty, Healthcare, Fitness, Retail, Hospitality e oltre.", icon: Target },
  { year: "2025", label: "91 Agenti IA", desc: "Ecosistema completo di intelligenze artificiali specializzate per ogni verticale.", icon: Brain },
  { year: "2026", label: "Rete Partner Nazionale", desc: "Oltre 150 partner attivi, 500+ aziende servite e crescita del 300% anno su anno.", icon: Users },
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
            <div className="relative flex items-center gap-2 px-4 py-2 rounded-full overflow-hidden" style={{ background: "hsla(38,50%,55%,0.06)", border: "1px solid hsla(38,50%,55%,0.12)" }}>
              <Heart className="w-3 h-3" style={{ color: "hsl(38,50%,55%)" }} />
              <span className="text-[0.65rem] font-semibold tracking-[3px] uppercase" style={{ color: "hsl(38,50%,55%)" }}>La Nostra Storia</span>
            </div>
          </motion.div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-5">
            <span className="text-foreground">Nati per </span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, hsl(38,50%,55%), hsl(32,45%,60%), hsl(38,55%,50%))" }}>
              Rivoluzionare
            </span>
          </h2>
          <p className="text-muted-foreground/70 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Empire AI nasce dalla convinzione che ogni impresa italiana merita la stessa potenza tecnologica delle multinazionali. 
            Un team di appassionati che ha trasformato questa visione in una piattaforma che serve 25+ settori con intelligenza artificiale dedicata.
          </p>
        </motion.div>

        {/* ── Timeline ── */}
        <div className="relative mb-20 sm:mb-28">
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px" style={{ background: "linear-gradient(180deg, transparent, hsla(38,50%,55%,0.25), hsla(265,60%,55%,0.2), transparent)" }} />
          
          {MILESTONES.map((m, i) => {
            const Icon = m.icon;
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={m.year}
                className={`relative flex items-start gap-4 sm:gap-0 mb-10 sm:mb-14 ${isLeft ? "sm:flex-row" : "sm:flex-row-reverse"}`}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={vpOnce}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                {/* Node */}
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-10">
                  <motion.div
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, hsla(38,50%,55%,0.2), hsla(265,60%,55%,0.15))", border: "1px solid hsla(38,50%,55%,0.2)" }}
                    whileHover={{ scale: 1.2, borderColor: "hsla(38,50%,55%,0.5)" }}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  </motion.div>
                </div>

                {/* Content card */}
                <div className={`ml-14 sm:ml-0 ${isLeft ? "sm:w-1/2 sm:pr-12 sm:text-right" : "sm:w-1/2 sm:pl-12"}`}>
                  <motion.div
                    className="p-4 sm:p-5 rounded-2xl"
                    style={{ background: "hsla(230,10%,15%,0.5)", border: "1px solid hsla(38,50%,55%,0.08)", backdropFilter: "blur(12px)" }}
                    whileHover={{ borderColor: "hsla(38,50%,55%,0.2)", y: -3 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-[0.65rem] font-bold tracking-[2px] uppercase text-primary/70">{m.year}</span>
                    <h4 className="text-sm sm:text-base font-bold text-foreground mt-1">{m.label}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground/60 mt-1.5 leading-relaxed">{m.desc}</p>
                  </motion.div>
                </div>

                {/* Spacer for the other side */}
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
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
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
