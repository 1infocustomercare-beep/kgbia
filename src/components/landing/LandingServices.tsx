import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: "🌐", accent: "#22d3ee", title: "App & Web App White-Label",
    desc: "Il tuo brand, il tuo dominio, i tuoi colori. Installabile come app nativa — senza passare dagli store. I clienti pensano sia la tua app.",
    pills: ["White Label 100%", "PWA Nativa", "Il Tuo Dominio"],
  },
  {
    icon: "🧠", accent: "#a78bfa", title: "98 Agenti IA Autonomi",
    desc: "Un esercito di intelligenze artificiali che lavora per te 24/7. Gestisce clienti, crea contenuti, analizza dati e ti fa guadagnare — anche mentre dormi.",
    pills: ["98 Agenti Attivi", "Operativi 24/7", "Self-Learning"],
  },
  {
    icon: "📊", accent: "#4ade80", title: "Gestionale All-in-One",
    desc: "Basta con 10 software diversi. CRM, prenotazioni, ordini, inventario, staff, fatturazione e analytics — tutto in una dashboard che capisci al volo.",
    pills: ["CRM Integrato", "e-Fattura", "Pagamenti Stripe"],
  },
  {
    icon: "🚀", accent: "#f59e0b", title: "Marketing che Si Fa da Solo",
    desc: "Post social, email, campagne WhatsApp, recensioni e SEO — l'IA genera tutto. Tu approvi con un tap, il resto è automatico.",
    pills: ["Content AI 24/7", "WhatsApp Auto", "SEO Intelligente"],
  },
];

export default function LandingServices() {
  return (
    <section id="servizi" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Cool blue-steel background */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #020208 0%, #0a0e18 40%, #0c1020 60%, #020208 100%)",
      }} />
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(34,211,238,0.04) 0%, transparent 60%)",
      }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/10 to-transparent" />

      <div className="relative z-[1] max-w-[1320px] mx-auto px-5 text-center">
        <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-cyan-400 font-bold mb-5">
          <span className="w-6 h-[2px] bg-gradient-to-r from-cyan-400 to-transparent" />TUTTO IN UN'UNICA PIATTAFORMA
        </span>
        <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold mb-3 text-white">
          Smetti di Pagare 10 Software. <span className="text-cyan-300">Usa Solo Empire.</span>
        </h2>
        <p className="text-white/60 max-w-[600px] mx-auto text-[15px] leading-[1.7] mb-14">
          Ogni strumento di cui il tuo business ha bisogno, in un unico posto. Zero integrazioni complicate, zero costi nascosti.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="relative overflow-hidden rounded-3xl p-7 text-left border border-white/[0.06] transition-all duration-500 hover:-translate-y-2 hover:border-white/[0.14] group"
              style={{ background: "linear-gradient(180deg, rgba(12,16,32,0.9), rgba(6,8,18,0.95))" }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
                style={{ background: f.accent }} />
              {/* Glow */}
              <div className="absolute -bottom-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `${f.accent}12` }} />

              {/* Icon badge */}
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5 border border-white/[0.06]"
                style={{ background: `${f.accent}12`, boxShadow: `0 0 20px ${f.accent}10` }}>
                {f.icon}
              </div>

              <h3 className="text-lg font-heading font-bold mb-2 text-white/95">{f.title}</h3>
              <p className="text-[13px] text-white/55 leading-[1.8] mb-4">{f.desc}</p>
              <div className="flex gap-1.5 flex-wrap">
                {f.pills.map((p) => (
                  <span key={p} className="text-[10px] px-2.5 py-1 rounded-lg font-semibold border"
                    style={{ borderColor: `${f.accent}20`, background: `${f.accent}08`, color: f.accent }}>
                    {p}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
