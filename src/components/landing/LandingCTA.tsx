import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 lg:py-32 px-5 text-center overflow-hidden" style={{ background: "#020204" }}>
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(126,183,190,0.1), rgba(108,60,224,0.08) 40%, transparent 70%)" }} />

      <div className="relative z-[1] max-w-[680px] mx-auto">
        <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-5">
          <span className="w-5 h-[1.5px] bg-[#7eb7be]" />INIZIA ORA
        </span>

        <motion.h2
          className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-heading font-bold mb-4 text-white leading-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Il Tuo Business Merita
          <br />
          <span className="bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">di Funzionare da Solo.</span>
        </motion.h2>

        <p className="text-white/45 max-w-[520px] mx-auto text-[15px] leading-[1.7] mb-8">
          847+ imprese italiane hanno già scelto Empire.AI per automatizzare ogni processo, ridurre i costi e aumentare il fatturato. Inizia oggi — garanzia 90 giorni, zero rischi.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            onClick={() => navigate("/demo")}
            className="px-10 py-4 rounded-full text-white font-semibold text-sm transition-all hover:-translate-y-[2px]"
            style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)", boxShadow: "0 16px 48px rgba(126,183,190,0.25)" }}
          >
            Prenota una Demo Gratuita →
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="px-10 py-4 rounded-full text-white/80 font-semibold text-sm border border-white/[0.12] hover:border-[#7eb7be]/50 hover:text-white transition-all"
          >
            Accedi alla Piattaforma
          </button>
        </div>

        <p className="text-[11px] text-white/20">
          Nessuna carta di credito richiesta · Setup in 7 giorni · Supporto dedicato 7/7
        </p>
      </div>
    </section>
  );
}
