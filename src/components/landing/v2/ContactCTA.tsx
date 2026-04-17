import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function ContactCTA() {
  const navigate = useNavigate();

  return (
    <section
      id="contatti"
      className="landing-section relative overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16"
      data-theme="dark"
    >
      <div className="landing-section-glow" data-tone="gold" />

      <div className="relative mx-auto max-w-[1100px]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75 }}
          className="landing-surface relative overflow-hidden rounded-[32px] p-8 text-center sm:p-10 lg:rounded-[40px] lg:p-14"
          data-tone="gold"
        >
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(hsl(var(--gold) / 0.18) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--gold) / 0.18) 1px, transparent 1px)",
                backgroundSize: "70px 70px",
                maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent)",
              }}
            />
          </div>

          <div className="relative">
            <span className="landing-pill mb-6 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em]">
              Pronto a iniziare?
            </span>

            <h2 className="mb-5 font-heading text-[clamp(2rem,6vw,4.2rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-foreground">
              Il tuo business merita
              <span className="block landing-heading-gradient">di essere autonomo.</span>
            </h2>

            <p className="mx-auto mb-8 max-w-[640px] text-[clamp(1rem,1.7vw,1.15rem)] font-light leading-[1.7] text-foreground/76">
              Prenota una demo personalizzata di 30 minuti. Ti mostreremo come Empire AI può trasformare il tuo settore specifico, con dati reali sui ritorni d'investimento attesi.
            </p>

            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <button
                onClick={() => navigate("/onboarding")}
                className="landing-button-primary group inline-flex items-center justify-center gap-2.5 rounded-full px-9 py-4 font-heading text-base font-semibold transition-transform hover:-translate-y-0.5"
              >
                <span>Prenota la demo strategica</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
              </button>
              <button
                onClick={() => navigate("/demo")}
                className="landing-button-secondary rounded-full px-9 py-4 text-base font-semibold"
              >
                Vedi una demo live
              </button>
            </div>

            <div className="mt-10 border-t border-border/50 pt-6 text-[12px] text-foreground/55">
              <span className="font-semibold text-foreground/80">Empire AI Group</span> · info@empireaigroup.com · Risposta entro 24h
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
