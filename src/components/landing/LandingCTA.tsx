import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative py-28 lg:py-36 px-5 text-center overflow-hidden">
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #0a0818 0%, #12102e 40%, #0e0c24 100%)",
      }} />
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)",
      }} />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/20 to-transparent" />

      <div className="relative z-[1] max-w-[700px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-[11px] tracking-[3px] uppercase font-bold mb-6 px-4 py-1.5 rounded-full border border-[#c9a84c]/20 bg-[#c9a84c]/5 text-[#c9a84c]">
            Inizia Adesso
          </span>

          <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] font-heading font-bold mb-5 text-white leading-tight">
            Il Tuo Business Merita<br />
            <span className="text-[#c9a84c]">di Funzionare da Solo.</span>
          </h2>

          <p className="text-white/55 max-w-[560px] mx-auto text-[16px] leading-[1.8] mb-10">
            847+ imprese italiane hanno già scelto Empire AI per automatizzare ogni processo, eliminare i costi operativi e moltiplicare il fatturato. Inizia oggi — garanzia 90 giorni, rischio zero.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => navigate("/demo")}
              className="px-10 py-4 rounded-full text-black font-bold text-[15px] transition-all hover:-translate-y-[2px]"
              style={{ background: "linear-gradient(135deg, #c9a84c, #e8c47a)", boxShadow: "0 16px 48px rgba(201,168,76,0.3)" }}
            >
              Prenota una Demo Gratuita →
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="px-10 py-4 rounded-full text-white/85 font-semibold text-[15px] border border-white/[0.1] hover:border-[#c9a84c]/40 hover:text-white transition-all"
            >
              Accedi alla Piattaforma
            </button>
          </div>

          <p className="text-[13px] text-white/35">
            Nessuna carta di credito · Setup in 7 giorni · Supporto dedicato 7/7
          </p>
        </motion.div>
      </div>
    </section>
  );
}
