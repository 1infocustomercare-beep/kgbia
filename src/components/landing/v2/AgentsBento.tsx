import { motion } from "framer-motion";

const AGENTS = [
  {
    name: "Empire WhatsApp Orchestrator",
    desc: "Gestisci menù, prezzi, foto fotorealistiche e comunicazioni clienti via voce o testo. Senza aprire app, senza perdere tempo.",
    icon: "💬",
    accent: "#22c55e",
    big: true,
    tag: "Flagship",
  },
  {
    name: "Apex Acquisition Engine",
    desc: "3 agenti in serie — Esploratore, Profilatore, Negoziatore — che trovano lead, qualificano l'intent e chiudono la trattativa.",
    icon: "🎯",
    accent: "#7C3AED",
    big: true,
    tag: "B2B",
  },
  {
    name: "Notifiche Proattive",
    desc: "L'AI avvisa il cliente prima che chieda. Reminder, upsell, recensioni.",
    icon: "🔔",
    accent: "#F97316",
  },
  {
    name: "Fiscal Vault 2026",
    desc: "Gestione automatica fatturazione elettronica, allergeni, normative. Zero sanzioni.",
    icon: "🛡️",
    accent: "#D4AF37",
  },
  {
    name: "Customer 360°",
    desc: "Profilo unificato, storia ordini, preferenze, lifetime value. Sempre pronto.",
    icon: "👤",
    accent: "#60a5fa",
  },
  {
    name: "Review Shield",
    desc: "Intercetta le recensioni negative prima che vengano pubblicate online.",
    icon: "⭐",
    accent: "#fbbf24",
  },
  {
    name: "Empire Voice Agent",
    desc: "Risponde al telefono 24/7, prende prenotazioni, qualifica le richieste.",
    icon: "🎙️",
    accent: "#ec4899",
  },
];

export default function AgentsBento() {
  return (
    <section id="agenti" className="relative py-24 px-5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 40% at 50% 30%, rgba(124,58,237,0.12), transparent)" }} />

      <div className="relative max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[2px] mb-4 border border-[#7C3AED]/30 text-[#a78bfa] bg-[#7C3AED]/5">
            98 Agenti AI
          </span>
          <h2 className="text-[clamp(2rem,5vw,3.4rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] mb-4 text-white">
            Una squadra digitale
            <span className="block bg-gradient-to-r from-[#7C3AED] via-[#D4AF37] to-[#F97316] bg-clip-text text-transparent">
              che non dorme mai.
            </span>
          </h2>
          <p className="text-white/65 text-[clamp(0.95rem,1.6vw,1.05rem)] max-w-[680px] mx-auto leading-[1.65]">
            Ogni agente è specializzato in un compito chirurgico. Tutti collaborano in autonomia, condividono dati,
            si coordinano. Tu vedi solo i risultati.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 auto-rows-fr">
          {AGENTS.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className={`relative p-6 rounded-3xl border backdrop-blur-xl group overflow-hidden ${a.big ? "md:col-span-2 md:row-span-1" : ""}`}
              style={{
                borderColor: `${a.accent}22`,
                background: `linear-gradient(135deg, ${a.accent}10, rgba(255,255,255,0.01))`,
              }}
            >
              {a.tag && (
                <span
                  className="absolute top-4 right-4 px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border"
                  style={{
                    borderColor: `${a.accent}55`,
                    color: a.accent,
                    background: `${a.accent}15`,
                  }}
                >
                  {a.tag}
                </span>
              )}

              <div
                className="w-14 h-14 rounded-2xl grid place-items-center text-2xl mb-4"
                style={{
                  background: `linear-gradient(135deg, ${a.accent}33, ${a.accent}11)`,
                  border: `1px solid ${a.accent}44`,
                  boxShadow: `0 8px 24px ${a.accent}25`,
                }}
              >
                {a.icon}
              </div>

              <h3 className={`font-heading font-bold text-white mb-2 ${a.big ? "text-xl" : "text-base"}`}>{a.name}</h3>
              <p className="text-[13px] text-white/60 leading-[1.6]">{a.desc}</p>

              {/* Glow on hover */}
              <div
                className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none -z-10 blur-2xl"
                style={{ background: a.accent }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
