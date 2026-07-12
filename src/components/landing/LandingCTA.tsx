import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative py-28 lg:py-36 px-5 text-center overflow-hidden">
      {/* Bold gradient — stands out from everything */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #020208 0%, #0c0820 30%, #1a1040 50%, #0c0820 70%, #020208 100%)",
      }} />
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(126,183,190,0.08) 0%, transparent 50%), radial-gradient(ellipse 40% 40% at 50% 60%, rgba(167,139,250,0.06) 0%, transparent 50%)",
      }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent" />

      <div className="relative z-[1] max-w-[680px] mx-auto">
        <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-violet-400 font-bold mb-6">
          <span className="w-6 h-[2px] bg-gradient-to-r from-violet-400 to-transparent" />L'ULTIMO PASSO
        </span>

        <motion.h2
          className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-heading font-bold mb-5 text-white leading-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Il Tuo Business Merita
          <br />
          <span className="bg-gradient-to-r from-[#7eb7be] via-[#a78bfa] to-[#ec4899] bg-clip-text text-transparent">di Funzionare da Solo.</span>
        </motion.h2>

        <p className="text-white/60 max-w-[520px] mx-auto text-[15px] leading-[1.8] mb-9">
          847+ imprese italiane hanno già automatizzato ogni processo con Empire.AI. Inizia oggi — garanzia 90 giorni, zero rischi, zero carte di credito.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            onClick={() => navigate("/demo")}
            className="px-10 py-4 rounded-full text-white font-semibold text-sm transition-all hover:-translate-y-[2px]"
            style={{ background: "linear-gradient(135deg, #7eb7be, #a78bfa, #ec4899)", boxShadow: "0 16px 48px rgba(167,139,250,0.25)" }}
          >
            Prenota una Demo Omaggio →
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="px-10 py-4 rounded-full text-white/85 font-semibold text-sm border border-white/[0.12] hover:border-violet-400/50 hover:text-white hover:bg-white/[0.03] transition-all"
          >
            Accedi alla Piattaforma
          </button>
        </div>

        <p className="text-[12px] text-white/70">
          Nessuna carta di credito · Setup in 7 giorni · Supporto dedicato 7/7
        </p>
      </div>
    </section>
  );
}
