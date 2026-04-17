import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ContactCTA() {
  const navigate = useNavigate();

  return (
    <section id="contatti" className="relative py-28 px-5 overflow-hidden">
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(124,58,237,0.18), transparent 70%), radial-gradient(ellipse 60% 50% at 50% 80%, rgba(212,175,55,0.12), transparent 70%)",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-[860px] mx-auto text-center"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border backdrop-blur-md"
          style={{ borderColor: "rgba(212,175,55,0.4)", background: "rgba(212,175,55,0.08)" }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#22c55e] animate-pulse" />
          <span className="text-[11px] tracking-[2.5px] uppercase font-bold text-[#D4AF37]">
            Inizia oggi · Live in 14 giorni
          </span>
        </div>

        <h2 className="text-[clamp(2.4rem,6vw,4.4rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] mb-5 text-white">
          Smetti di lavorare nel business.
          <span className="block bg-gradient-to-r from-[#D4AF37] via-[#a78bfa] to-[#7C3AED] bg-clip-text text-transparent">
            Inizia a guidarlo.
          </span>
        </h2>

        <p className="text-white/70 text-[clamp(1rem,2vw,1.15rem)] leading-[1.65] max-w-[620px] mx-auto mb-9 font-light">
          Mentre leggi questo testo, l'AI di Empire ha già processato 12.483 ordini, 847 prenotazioni
          e qualificato 234 nuovi lead per i nostri clienti. È il tuo turno.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <button
            onClick={() => navigate("/onboarding")}
            className="group px-9 py-4 rounded-full text-black font-bold text-sm font-heading inline-flex items-center justify-center gap-2 transition-all hover:-translate-y-[3px]"
            style={{
              background: "linear-gradient(135deg, #D4AF37, #F97316)",
              boxShadow: "0 20px 60px rgba(212,175,55,0.45)",
            }}
          >
            Inizia il mio Empire
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </button>
          <button
            onClick={() => navigate("/demo")}
            className="px-9 py-4 rounded-full text-white/90 font-semibold text-sm border border-white/20 hover:border-[#D4AF37]/50 hover:bg-white/[0.03] transition-all"
          >
            Prova una Demo Live
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[12px] text-white/55">
          <span className="flex items-center gap-2">
            <span className="text-[#D4AF37]">✓</span> Garanzia 90 giorni
          </span>
          <span className="flex items-center gap-2">
            <span className="text-[#D4AF37]">✓</span> Live in 14 giorni
          </span>
          <span className="flex items-center gap-2">
            <span className="text-[#D4AF37]">✓</span> Account manager dedicato
          </span>
          <span className="flex items-center gap-2">
            <span className="text-[#D4AF37]">✓</span> 847+ imprese ci hanno scelto
          </span>
        </div>

        <div className="mt-10 pt-8 border-t border-white/[0.06]">
          <p className="text-[12px] text-white/45 mb-2">Hai domande? Parla con noi:</p>
          <a href="mailto:info@empireaigroup.com" className="text-[14px] font-medium text-white hover:text-[#D4AF37] transition-colors">
            info@empireaigroup.com
          </a>
        </div>
      </motion.div>
    </section>
  );
}
