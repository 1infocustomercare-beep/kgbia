import { motion } from "framer-motion";

const AGENTS = [
  { icon: "🍽️", name: "Menu AI / Catalogo AI", desc: "Genera menu professionali e cataloghi da semplici foto. Traduzione multilingua istantanea in 12 lingue.", tag: "Incluso in Growth", accent: "#60a5fa" },
  { icon: "✍️", name: "Content AI Engine", desc: "Post social, email marketing, copy pubblicitari e blog — tutto generato e ottimizzato automaticamente ogni giorno.", tag: "Incluso in Growth", accent: "#60a5fa" },
  { icon: "💬", name: "Concierge AI 24/7", desc: "Chatbot intelligente addestrato sul tuo business specifico. Risponde ai clienti, prende prenotazioni e chiude vendite.", tag: "Incluso in Empire", accent: "#c9a84c" },
  { icon: "⭐", name: "Review Shield", desc: "Intercetta recensioni negative in privato prima che finiscano online. Amplifica automaticamente le 4-5★ su Google.", tag: "Incluso in Empire", accent: "#c9a84c" },
  { icon: "🎯", name: "LeadEngine Scout", desc: "Trova nuovi clienti in target dalla tua zona. Analizza Google Maps, social e directory per generare contatti qualificati.", tag: "Incluso in Empire", accent: "#c9a84c" },
  { icon: "👻", name: "GhostManager", desc: "Identifica i clienti che non tornano da 30+ giorni e li riattiva con campagne WhatsApp e email personalizzate dall'IA.", tag: "Incluso in Empire", accent: "#c9a84c" },
  { icon: "📸", name: "Visual AI Studio", desc: "Foto professionali dei tuoi prodotti generate dall'intelligenza artificiale. Qualità da shooting fotografico, costo zero.", tag: "Add-on €29/mese", accent: "#a78bfa" },
  { icon: "📊", name: "Analytics Predittivi", desc: "Previsioni vendite, analisi trend stagionali e suggerimenti operativi automatici basati sui dati reali del tuo business.", tag: "Add-on €29/mese", accent: "#a78bfa" },
];

export default function LandingAgents() {
  return (
    <section id="agenti" className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0a0820 0%, #120e30 40%, #0e0a26 100%)" }} />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(ellipse 50% 50% at 50% 30%, rgba(167,139,250,0.08) 0%, transparent 60%)",
      }} />

      <div className="relative z-[1] max-w-[1200px] mx-auto px-5">
        <div className="text-center mb-14">
          <span className="inline-block text-[11px] tracking-[3px] uppercase font-bold mb-4 px-4 py-1.5 rounded-full border border-[#a78bfa]/20 bg-[#a78bfa]/5 text-[#a78bfa]">
            Intelligenza Artificiale
          </span>
          <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-heading font-bold mb-4 text-white leading-tight">
            98 Dipendenti Digitali<br />
            <span className="text-[#a78bfa]">che Non Dormono Mai.</span>
          </h2>
          <p className="text-white/60 max-w-[640px] mx-auto text-[16px] leading-[1.8]">
            Ogni agente è specializzato in un compito preciso. Lavorano in sinergia 24/7 per far crescere il tuo business mentre tu ti concentri su ciò che ami fare.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {AGENTS.map((a, i) => (
            <motion.div
              key={a.name}
              className="rounded-2xl p-6 border border-white/[0.06] transition-all duration-500 hover:-translate-y-2 hover:border-white/[0.12] relative overflow-hidden group"
              style={{ background: "linear-gradient(160deg, rgba(18,14,48,0.9), rgba(10,8,32,0.95))" }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.06 }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4"
                style={{ background: `${a.accent}12`, border: `1px solid ${a.accent}20` }}>
                {a.icon}
              </div>
              <h4 className="text-[15px] font-heading font-bold mb-2 text-white">{a.name}</h4>
              <p className="text-[13px] text-white/55 leading-[1.8] mb-4">{a.desc}</p>
              <span className="inline-block text-[11px] px-3 py-1.5 rounded-full font-semibold"
                style={{ background: `${a.accent}10`, border: `1px solid ${a.accent}20`, color: a.accent }}>
                {a.tag}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-[13px] text-white/40">5 agenti inclusi in Empire · Add-on aggiuntivi a €29/mese · Sconto 30% per clienti attivi</p>
        </div>
      </div>
    </section>
  );
}
