import { motion } from "framer-motion";
import { MessageSquare, Target, Bell, Shield, User, Star, Mic, Zap, Brain } from "lucide-react";

const AGENTS = [
  {
    name: "Empire WhatsApp Orchestrator",
    desc: "Gestisci menù, prezzi, foto fotorealistiche e comunicazioni clienti via voce o testo. Senza aprire app, senza perdere tempo.",
    Icon: MessageSquare,
    accent: "#22c55e",
    big: true,
    tag: "Flagship",
  },
  {
    name: "Apex Acquisition Engine",
    desc: "Tre agenti in serie — Esploratore, Profilatore, Negoziatore — che trovano lead, qualificano l'intent e chiudono la trattativa.",
    Icon: Target,
    accent: "#7C3AED",
    big: true,
    tag: "B2B Pro",
  },
  {
    name: "Notifiche Proattive",
    desc: "L'AI avvisa il cliente prima che chieda. Reminder, upsell, recensioni.",
    Icon: Bell,
    accent: "#F97316",
  },
  {
    name: "Fiscal Vault 2026",
    desc: "Fatturazione elettronica, allergeni, normative. Zero sanzioni.",
    Icon: Shield,
    accent: "#D4AF37",
  },
  {
    name: "Customer 360°",
    desc: "Profilo unificato, storia ordini, preferenze, lifetime value.",
    Icon: User,
    accent: "#60a5fa",
  },
  {
    name: "Review Shield",
    desc: "Intercetta le recensioni negative prima che vengano pubblicate.",
    Icon: Star,
    accent: "#fbbf24",
  },
  {
    name: "Empire Voice Agent",
    desc: "Risponde al telefono 24/7, prende prenotazioni, qualifica le richieste.",
    Icon: Mic,
    accent: "#ec4899",
  },
  {
    name: "Empire Command Agent",
    desc: "Esegui qualsiasi comando aziendale parlando o scrivendo. L'AI capisce e agisce.",
    Icon: Zap,
    accent: "#22d3ee",
  },
  {
    name: "Brain Analytics",
    desc: "Insight predittivi sul business: cosa accadrà nei prossimi 30 giorni.",
    Icon: Brain,
    accent: "#a78bfa",
  },
];

export default function AgentsBento() {
  return (
    <section id="agenti" className="relative py-28 px-5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 40% at 50% 30%, rgba(124,58,237,0.14), transparent)" }} />

      <div className="relative max-w-[1300px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[3px] mb-5 border border-[#7C3AED]/30 text-[#a78bfa] bg-[#7C3AED]/5 backdrop-blur-md">
            98 Agenti AI Proprietari
          </span>
          <h2 className="text-[clamp(2rem,5vw,3.6rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] mb-5 text-white">
            Una squadra digitale
            <span className="block bg-gradient-to-r from-[#7C3AED] via-[#D4AF37] to-[#F97316] bg-clip-text text-transparent">
              che non dorme mai.
            </span>
          </h2>
          <p className="text-white/65 text-[clamp(0.95rem,1.6vw,1.08rem)] max-w-[700px] mx-auto leading-[1.65]">
            Ogni agente è specializzato in un compito chirurgico. Tutti collaborano in autonomia, condividono dati,
            si coordinano. Tu vedi solo i risultati.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 auto-rows-fr">
          {AGENTS.map((a, i) => (
            <BentoCard key={a.name} a={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BentoCard({ a, index }: { a: typeof AGENTS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.7 }}
      whileHover={{ y: -8, rotateX: 4, rotateY: 4 }}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      className={`relative p-7 rounded-3xl border backdrop-blur-xl group overflow-hidden transition-shadow duration-500 hover:shadow-[0_30px_80px_rgba(0,0,0,0.5)] ${
        a.big ? "md:col-span-2" : ""
      }`}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${a.accent}14, rgba(255,255,255,0.01))`,
          borderColor: `${a.accent}22`,
        }}
      />
      {/* Border */}
      <div
        className="absolute inset-0 rounded-3xl border pointer-events-none transition-colors duration-500 group-hover:border-opacity-60"
        style={{ borderColor: `${a.accent}30` }}
      />

      {/* Animated glow on hover */}
      <div
        className="absolute -top-1/2 -right-1/2 w-[120%] h-[120%] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${a.accent}22, transparent 60%)`,
        }}
      />

      {a.tag && (
        <span
          className="absolute top-5 right-5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border backdrop-blur-md z-10"
          style={{
            borderColor: `${a.accent}66`,
            color: a.accent,
            background: `${a.accent}1a`,
          }}
        >
          {a.tag}
        </span>
      )}

      <div className="relative z-10">
        {/* Icon container */}
        <div
          className="w-14 h-14 rounded-2xl grid place-items-center mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
          style={{
            background: `linear-gradient(135deg, ${a.accent}33, ${a.accent}0a)`,
            border: `1px solid ${a.accent}55`,
            boxShadow: `0 12px 32px ${a.accent}30, inset 0 1px 0 rgba(255,255,255,0.1)`,
          }}
        >
          <a.Icon className="w-6 h-6" style={{ color: a.accent }} strokeWidth={2} />
        </div>

        <h3 className={`font-heading font-bold text-white mb-2.5 leading-tight ${a.big ? "text-xl lg:text-2xl" : "text-base"}`}>
          {a.name}
        </h3>
        <p className={`text-white/65 leading-[1.6] ${a.big ? "text-[14px]" : "text-[13px]"}`}>{a.desc}</p>

        {/* Animated arrow */}
        <div
          className="mt-5 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-2 group-hover:translate-x-0"
          style={{ color: a.accent }}
        >
          Scopri di più
          <span>→</span>
        </div>
      </div>
    </motion.div>
  );
}
