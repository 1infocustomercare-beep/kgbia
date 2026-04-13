import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingCTA() {
  const navigate = useNavigate();
  return (
    <section className="relative py-24 lg:py-32 px-5 text-center overflow-hidden" style={{ background: "#020204" }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(126,183,190,0.12), rgba(108,60,224,0.12) 40%, transparent 70%)" }} />
      <div className="relative z-[1]">
        <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-5">
          <span className="w-5 h-[1.5px] bg-[#7eb7be]" />PRONTO A DOMINARE?
        </span>
        <motion.h2 className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-heading font-bold mb-4 text-white"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          Il Tuo Business Merita <span className="bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">di Più</span>
        </motion.h2>
        <p className="text-white/55 max-w-[540px] mx-auto text-[15px] leading-[1.7] mb-8">
          Unisciti a 847+ imprese italiane che hanno già rivoluzionato il proprio business con Empire.AI. Inizia oggi con la garanzia 90 giorni.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigate("/demo")}
            className="px-10 py-4 rounded-full text-white font-semibold text-sm transition-all hover:-translate-y-[3px]"
            style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)", boxShadow: "0 16px 48px rgba(126,183,190,0.25)" }}>
            Prenota una Demo Gratuita →
          </button>
          <button onClick={() => navigate("/auth")}
            className="px-10 py-4 rounded-full text-white font-semibold text-sm border border-white/[0.14] hover:border-[#7eb7be] hover:text-[#7eb7be] transition-all">
            Accedi alla Piattaforma
          </button>
        </div>
      </div>
    </section>
  );
}
