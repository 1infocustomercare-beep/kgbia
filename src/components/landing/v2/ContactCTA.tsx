import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useHomepageContent, pick } from "@/hooks/useHomepageContent";

export default function ContactCTA() {
  const navigate = useNavigate();
  const { content } = useHomepageContent();
  const cc = content.cta ? undefined : content.contactCta ?? {};
  const c = content.contactCta ?? {};
  const f = content.footer ?? {};

  const PILL = pick(c.pillLabel, "Pronto a iniziare?");
  const TITLE_LEAD = pick(c.titleLead, "Il tuo business merita");
  const TITLE_ACC = pick(c.titleAccent, "di essere autonomo.");
  const SUBTITLE = pick(c.subtitle, "Prenota una demo personalizzata di 30 minuti e scopri come trasformare il tuo settore con una struttura più premium e più redditizia.");
  const P_LABEL = pick(c.primaryLabel, "Inizia ora — attiva Empire");
  const P_HREF = pick(c.primaryHref, "/auth?plan=empire_pro&mode=register");
  const S_LABEL = pick(c.secondaryLabel, "Vedi una demo live");
  const S_HREF = pick(c.secondaryHref, "/demo");
  const TAGLINE = pick(f.tagline, "Empire AI Group");
  const EMAIL = pick(f.email, "info@empireaigroup.com");

  return (
    <section id="contatti" className="landing-section relative overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12" data-theme="dark">
      <div className="landing-section-glow" data-tone="gold" />

      <div className="relative mx-auto max-w-[1100px]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75 }}
          className="landing-surface relative overflow-hidden rounded-[30px] p-6 text-center sm:p-8 lg:rounded-[36px] lg:p-10"
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
            <span className="landing-pill mb-5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em]">{PILL}</span>

            <h2 className="mb-4 font-heading text-[clamp(1.8rem,5.3vw,3.6rem)] font-extrabold leading-[0.97] tracking-[-0.04em] text-foreground">
              {TITLE_LEAD}
              <span className="block landing-heading-gradient">{TITLE_ACC}</span>
            </h2>

            <p className="mx-auto mb-7 max-w-[640px] text-[clamp(0.96rem,1.55vw,1.08rem)] leading-[1.68] text-foreground/78">
              {SUBTITLE}
            </p>

            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <button
                onClick={() => navigate(P_HREF)}
                className="landing-button-primary group inline-flex items-center justify-center gap-2.5 rounded-full px-9 py-4 font-heading text-base font-semibold transition-transform hover:-translate-y-0.5"
              >
                <span>{P_LABEL}</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
              </button>
              <button onClick={() => navigate(S_HREF)} className="landing-button-secondary rounded-full px-9 py-4 text-base font-semibold">
                {S_LABEL}
              </button>
            </div>

            <div className="mt-8 border-t border-border/50 pt-5 text-[12px] text-foreground/60">
              <span className="font-semibold text-foreground/82">{TAGLINE}</span> · {EMAIL} · Risposta entro 24h
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
