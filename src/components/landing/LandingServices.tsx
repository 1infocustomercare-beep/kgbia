import { motion } from "framer-motion";
import LandingPremiumPanel from "@/components/landing/LandingPremiumPanel";

const FEATURES = [
  { panelEyebrow: "Platform Suite", panelCode: "01", panelTone: "teal" as const, title: "App & Web App", desc: "Applicazioni installabili con il TUO brand, dominio e colori. Design premium white-label.", pills: ["White Label", "PWA", "Su misura"] },
  { panelEyebrow: "AI System", panelCode: "02", panelTone: "violet" as const, title: "Intelligenza Artificiale", desc: "98+ agenti IA che automatizzano marketing, gestione clienti, analisi dati e fatturazione.", pills: ["98+ Agenti", "24/7", "Predittivi"] },
  { panelEyebrow: "Business Ops", panelCode: "03", panelTone: "slate" as const, title: "Gestionale Completo", desc: "CRM, prenotazioni, ordini, inventario, staff, fatturazione elettronica, analytics, Stripe.", pills: ["CRM", "Fatturazione", "Stripe"] },
  { panelEyebrow: "Growth Engine", panelCode: "04", panelTone: "gold" as const, title: "Marketing Automatico", desc: "Email, social, WhatsApp auto, review management, SEO — generato dall'IA continuamente.", pills: ["Email", "WhatsApp", "SEO"] },
];

export default function LandingServices() {
  return (
    <section id="servizi" className="py-16 lg:py-24" style={{ background: "linear-gradient(180deg, #020204 0%, #0d0d1a 50%, #020204 100%)" }}>
      <div className="max-w-[1320px] mx-auto px-5 text-center">
        <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-5">
          <span className="w-5 h-[1.5px] bg-[#7eb7be]" />TUTTO IN UN'UNICA PIATTAFORMA
        </span>
        <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold mb-2 text-white">
          App, Siti e Gestionali <span className="bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">Potenziati dall'IA</span>
        </h2>
        <p className="text-white/55 max-w-[620px] mx-auto text-[15px] leading-[1.7] mb-12">
          Applicazioni dedicate, web app e gestionali completi — personalizzati al 100% per il tuo settore.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="relative overflow-hidden rounded-3xl p-8 text-left border border-white/[0.07] transition-all duration-500 hover:-translate-y-1.5 hover:border-white/[0.14] group"
              style={{ background: "#0d0d1a" }}
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
              <p className="text-[13px] text-white/55 leading-[1.7] mb-3">{f.desc}</p>
              <div className="flex gap-1.5 flex-wrap">
                {f.pills.map((p) => (
                  <span
                    key={p}
                    className="text-[10px] px-2.5 py-1 rounded-lg font-semibold border border-[rgba(126,183,190,0.1)]"
                    style={{ background: "rgba(126,183,190,0.12)", color: "#7eb7be" }}
                  >
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
