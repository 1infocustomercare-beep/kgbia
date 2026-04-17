import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function ContactCTA() {
  const navigate = useNavigate();

  return (
    <section id="contatti" className="landing-section relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20" data-theme="dark">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.18), transparent 60%), radial-gradient(ellipse 60% 50% at 30% 70%, rgba(212,175,55,0.14), transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.18) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent)",
          }}
        />
      </div>

      <div className="relative max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-10 lg:p-16 rounded-[40px] border backdrop-blur-2xl overflow-hidden text-center"
          style={{
            background:
              "linear-gradient(160deg, rgba(212,175,55,0.12), rgba(124,58,237,0.08) 60%, rgba(255,255,255,0.02))",
            borderColor: "rgba(212,175,55,0.3)",
            boxShadow: "0 40px 120px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <span className="inline-block px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[3px] mb-7 border border-[#D4AF37]/40 text-[#D4AF37] bg-[#D4AF37]/10 backdrop-blur-md">
            Pronto a iniziare?
          </span>

          <h2 className="text-[clamp(2rem,6vw,4.5rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.04em] mb-6 text-white">
            Il tuo business merita
            <span className="block bg-gradient-to-r from-[#D4AF37] via-[#a78bfa] to-[#7C3AED] bg-clip-text text-transparent">
              di essere autonomo.
            </span>
          </h2>

          <p className="text-white/75 text-[clamp(1rem,1.8vw,1.2rem)] leading-[1.65] max-w-[680px] mx-auto mb-10 font-light">
            Prenota una demo personalizzata di 30 minuti. Ti mostreremo come Empire AI può trasformare il tuo settore specifico,
            con dati reali sui ritorni d'investimento attesi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/onboarding")}
              className="group relative px-10 py-5 rounded-full text-white font-semibold text-base font-heading inline-flex items-center justify-center gap-2.5 transition-all hover:-translate-y-1 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #7C3AED 100%)",
                boxShadow: "0 24px 80px rgba(124,58,237,0.55), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              <span className="relative z-10">Prenota la demo strategica</span>
              <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
            </button>
            <button
              onClick={() => navigate("/demo")}
              className="px-10 py-5 rounded-full text-white/90 font-semibold text-base border border-white/20 hover:border-[#D4AF37]/60 hover:bg-white/[0.05] transition-all backdrop-blur-md"
            >
              Vedi una demo live
            </button>
          </div>

          <div className="mt-10 pt-8 border-t border-white/[0.08] text-[12px] text-white/50">
            <span className="font-semibold text-white/70">Empire AI Group</span> · info@empireaigroup.com · Risposta entro 24h
          </div>
        </motion.div>
      </div>
    </section>
  );
}
