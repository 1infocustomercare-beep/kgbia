import { motion } from "framer-motion";
import LandingPremiumPanel from "@/components/landing/LandingPremiumPanel";

const FEATURES = [
  {
    panelEyebrow: "Platform Suite",
    panelCode: "01",
    panelTone: "teal" as const,
    title: "App & Web App White-Label",
    desc: "La tua app personalizzata — con il tuo brand, il tuo dominio e i tuoi colori. Installabile come un'app nativa, senza passare dagli store.",
    pills: ["White Label 100%", "PWA Nativa", "Il Tuo Dominio"],
  },
  {
    panelEyebrow: "AI System",
    panelCode: "02",
    panelTone: "violet" as const,
    title: "98 Agenti IA Autonomi",
    desc: "Un team di intelligenze artificiali che lavora per te 24/7: gestisce clienti, crea contenuti, analizza dati e ottimizza ogni processo.",
    pills: ["98 Agenti Attivi", "Operativi 24/7", "Apprendimento Continuo"],
  },
  {
    panelEyebrow: "Business Ops",
    panelCode: "03",
    panelTone: "slate" as const,
    title: "Gestionale All-in-One",
    desc: "CRM, prenotazioni, ordini, inventario, gestione staff, fatturazione elettronica e analytics avanzati — tutto in un'unica dashboard.",
    pills: ["CRM Integrato", "Fatturazione e-Fatt", "Pagamenti Stripe"],
  },
  {
    panelEyebrow: "Growth Engine",
    panelCode: "04",
    panelTone: "gold" as const,
    title: "Marketing Automatizzato",
    desc: "Email, post social, campagne WhatsApp, gestione recensioni e SEO — generati e ottimizzati dall'IA senza il tuo intervento.",
    pills: ["Content AI 24/7", "WhatsApp Auto", "SEO Intelligente"],
  },
];

export default function LandingServices() {
  return (
    <section id="servizi" className="py-16 lg:py-24" style={{ background: "linear-gradient(180deg, #020204 0%, #0d0d1a 50%, #020204 100%)" }}>
      <div className="max-w-[1320px] mx-auto px-5 text-center">
        <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-5">
          <span className="w-5 h-[1.5px] bg-[#7eb7be]" />TUTTO IN UN'UNICA PIATTAFORMA
        </span>
        <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold mb-2 text-white">
          Ogni Strumento di cui Hai Bisogno. <span className="bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">In un Solo Posto.</span>
        </h2>
        <p className="text-white/45 max-w-[600px] mx-auto text-[15px] leading-[1.7] mb-12">
          Non più 10 software diversi. Una piattaforma unica che gestisce l'intero ciclo del tuo business.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="relative overflow-hidden rounded-3xl p-8 text-left border border-white/[0.06] transition-all duration-500 hover:-translate-y-1.5 hover:border-white/[0.12] group"
              style={{ background: "rgba(13,13,26,0.6)" }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
                style={{ background: "linear-gradient(90deg, #7eb7be, #6c3ce0)" }}
              />

              <LandingPremiumPanel eyebrow={f.panelEyebrow} code={f.panelCode} title={f.title} tone={f.panelTone} />

              <h3 className="text-lg font-heading font-bold mb-2 text-white">{f.title}</h3>
              <p className="text-[13px] text-white/45 leading-[1.7] mb-3">{f.desc}</p>
              <div className="flex gap-1.5 flex-wrap">
                {f.pills.map((p) => (
                  <span key={p} className="text-[10px] px-2.5 py-1 rounded-lg font-semibold border border-[rgba(126,183,190,0.08)] bg-[rgba(126,183,190,0.08)] text-[#7eb7be]">
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
