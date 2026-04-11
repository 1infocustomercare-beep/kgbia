import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingCTA() {
  const navigate = useNavigate();

  return (
    <section id="contact" className="relative py-20 sm:py-28 px-5 overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(228 22% 8%), hsl(240 22% 10%), hsl(228 22% 8%))" }}>
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(ellipse, hsla(265,60%,55%,0.5), hsla(38,50%,50%,0.3), transparent 70%)", filter: "blur(180px)" }} />
      </div>

      <div className="max-w-[700px] mx-auto relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="w-16 h-16 mx-auto rounded-2xl bg-vibrant-gradient flex items-center justify-center mb-6" style={{ boxShadow: "0 8px 40px hsla(265,60%,50%,0.25)" }}>
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-[clamp(1.8rem,5vw,3rem)] font-heading font-bold text-white leading-[1.05] mb-4">
            Pronto a <span className="text-shimmer">Dominare</span> il Tuo Mercato?
          </h2>
          <p className="text-sm text-foreground/45 leading-[1.8] max-w-[480px] mx-auto mb-8">
            Unisciti a centinaia di attività che hanno già scelto Empire. Setup in 24 ore, formazione inclusa, supporto italiano 7/7.
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-10">
            {[
              { icon: <Zap className="w-3.5 h-3.5" />, label: "Setup 24h" },
              { icon: <Shield className="w-3.5 h-3.5" />, label: "GDPR" },
              { icon: <Sparkles className="w-3.5 h-3.5" />, label: "98+ Agenti IA" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-1.5 text-foreground/30">
                <span className="text-primary/60">{b.icon}</span>
                <span className="text-[0.6rem] font-medium">{b.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              onClick={() => navigate("/auth")}
              className="group px-10 py-4 rounded-2xl text-primary-foreground font-bold text-sm tracking-wider uppercase flex items-center gap-2 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, hsla(38,55%,48%,1), hsla(30,45%,38%,1))", boxShadow: "0 8px 40px hsla(38,55%,50%,0.3)" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)" }} animate={{ x: ["-200%", "300%"] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }} />
              <span className="relative z-10 flex items-center gap-2">Inizia Ora — Gratis <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
            </motion.button>
            <motion.button
              onClick={() => navigate("/partner")}
              className="px-8 py-4 rounded-2xl text-white/60 font-semibold text-sm tracking-wide hover:text-white transition-colors"
              style={{ border: "1px solid hsla(0,0%,100%,0.1)", background: "hsla(0,0%,100%,0.04)" }}
              whileHover={{ scale: 1.02 }}
            >
              Diventa Partner
            </motion.button>
          </div>

          <p className="text-[0.55rem] text-foreground/20 mt-6">Nessun impegno · Setup gratuito · Cancella quando vuoi</p>
        </motion.div>
      </div>
    </section>
  );
}
