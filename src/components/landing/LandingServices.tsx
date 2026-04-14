import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: "📱", accent: "#60a5fa",
    title: "App & Sito Web White-Label",
    desc: "La tua app con il tuo brand, il tuo dominio, i tuoi colori. Installabile come app nativa senza passare dagli store. I tuoi clienti vedranno solo il tuo marchio, mai il nostro.",
    pills: ["White Label 100%", "PWA Nativa", "Dominio Personalizzato"],
  },
  {
    icon: "🤖", accent: "#a78bfa",
    title: "98 Agenti IA che Lavorano per Te",
    desc: "Un esercito di intelligenze artificiali operative 24/7: gestiscono clienti, creano contenuti, analizzano dati, rispondono alle recensioni e ottimizzano ogni processo — senza il tuo intervento.",
    pills: ["98 Agenti Attivi", "Operativi 24/7", "Apprendimento Continuo"],
  },
  {
    icon: "⚙️", accent: "#22c55e",
    title: "Gestionale Completo All-in-One",
    desc: "CRM avanzato, prenotazioni, ordini, inventario, gestione staff, turni, fatturazione elettronica e analytics predittivi — tutto in un'unica dashboard elegante e intuitiva.",
    pills: ["CRM Integrato", "e-Fatturazione", "Staff & Turni"],
  },
  {
    icon: "📈", accent: "#c9a84c",
    title: "Marketing Automatizzato dall'IA",
    desc: "Post social, newsletter, campagne WhatsApp, gestione recensioni Google e ottimizzazione SEO — tutto generato e pubblicato automaticamente. Tu non devi fare nulla.",
    pills: ["Content AI", "WhatsApp Auto", "SEO Intelligente"],
  },
];

export default function LandingServices() {
  return (
    <section id="servizi" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #070a1c 0%, #0d1230 40%, #0a0e24 100%)" }} />
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(96,165,250,0.06) 0%, transparent 60%)",
      }} />

      <div className="relative z-[1] max-w-[1200px] mx-auto px-5">
        <div className="text-center mb-14">
          <span className="inline-block text-[11px] tracking-[3px] uppercase font-bold mb-4 px-4 py-1.5 rounded-full border border-[#60a5fa]/20 bg-[#60a5fa]/5 text-[#60a5fa]">
            Piattaforma Integrata
          </span>
          <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-heading font-bold mb-4 text-white leading-tight">
            Smetti di Pagare 10 Software Diversi.<br />
            <span className="text-[#60a5fa]">Usa Solo Empire.</span>
          </h2>
          <p className="text-white/60 max-w-[640px] mx-auto text-[16px] leading-[1.8]">
            Una piattaforma unica che sostituisce CRM, booking, POS, marketing tools, social manager e gestionale — risparmiando migliaia di euro l'anno.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="relative overflow-hidden rounded-2xl p-8 text-left border border-white/[0.06] transition-all duration-500 hover:-translate-y-2 hover:border-white/[0.12] group"
              style={{ background: "linear-gradient(160deg, rgba(13,18,48,0.9), rgba(8,10,24,0.95))" }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
                style={{ background: f.accent }} />

              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                style={{ background: `${f.accent}15`, border: `1px solid ${f.accent}25` }}>
                {f.icon}
              </div>

              <h3 className="text-lg font-heading font-bold mb-3 text-white">{f.title}</h3>
              <p className="text-[14px] text-white/60 leading-[1.85] mb-5">{f.desc}</p>
              <div className="flex gap-2 flex-wrap">
                {f.pills.map((p) => (
                  <span key={p} className="text-[11px] px-3 py-1.5 rounded-full font-semibold"
                    style={{ background: `${f.accent}10`, border: `1px solid ${f.accent}20`, color: f.accent }}>
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
