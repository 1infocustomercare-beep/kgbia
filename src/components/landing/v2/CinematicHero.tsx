import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

const PREVIEWS = [
  {
    src: `${S}/COTE%20Miami/a-obsidian-mobile-home.png`,
    sector: "Hospitality premium",
    title: "COTE Miami",
    metric: "+34% revenue medio",
  },
  {
    src: `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`,
    sector: "Wellness & beauty",
    title: "Aura Milano Spa",
    metric: "+218% prenotazioni online",
  },
  {
    src: `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`,
    sector: "Real estate luxury",
    title: "DIMORA Milano",
    metric: "+187% lead qualificati",
  },
];

const TRUST = ["847+ business attivi", "98 agenti proprietari", "25+ verticali", "Go-live in 14 giorni"];

function SplitTextReveal({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const letters = Array.from(text);

  return (
    <span className={className}>
      {letters.map((letter, index) => (
        <span key={`${letter}-${index}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "115%", opacity: 0, filter: "blur(10px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            transition={{
              delay: delay + index * 0.018,
              duration: 0.82,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function CinematicHero() {
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 85, damping: 24, mass: 0.7 });

  const titleY = useTransform(smooth, [0, 0.72, 1], [0, -120, -260]);
  const titleOpacity = useTransform(smooth, [0, 0.68, 0.96], [1, 1, 0]);
  const phoneRotateY = useTransform(smooth, [0, 1], [-18, 28]);
  const phoneRotateX = useTransform(smooth, [0, 0.5, 1], [10, 2, -10]);
  const phoneScale = useTransform(smooth, [0, 0.38, 0.8, 1], [0.9, 1.02, 0.96, 0.76]);
  const phoneY = useTransform(smooth, [0, 1], [18, -120]);
  const haloScale = useTransform(smooth, [0, 1], [0.8, 1.5]);
  const haloOpacity = useTransform(smooth, [0, 0.4, 1], [0.5, 0.9, 0.24]);

  const screen1Opacity = useTransform(smooth, [0, 0.28, 0.4], [1, 1, 0]);
  const screen2Opacity = useTransform(smooth, [0.22, 0.45, 0.62], [0, 1, 0]);
  const screen3Opacity = useTransform(smooth, [0.48, 0.72, 1], [0, 1, 1]);

  const cardLeftY = useTransform(smooth, [0, 1], [40, -70]);
  const cardRightY = useTransform(smooth, [0, 1], [-20, -120]);
  const cardBottomY = useTransform(smooth, [0, 1], [50, -25]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-[215svh] sm:min-h-[230svh] lg:min-h-[255svh]"
      style={{ perspective: "1800px" }}
    >
      <div className="landing-section-glow" data-tone="violet" />

      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden pt-24 sm:pt-28">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(440px,0.98fr)] lg:gap-8 lg:px-10">
          <motion.div style={{ y: titleY, opacity: titleOpacity }} className="relative z-20 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.75 }}
              className="landing-pill mx-auto mb-6 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em] lg:mx-0"
              data-tone="gold"
            >
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_16px_hsl(var(--accent)/0.8)]" />
              Agency AI premium per business reali
            </motion.div>

            <h1 className="mx-auto mb-6 max-w-[12ch] font-heading text-[clamp(2.65rem,9vw,6.6rem)] font-extrabold leading-[0.84] tracking-[-0.06em] text-foreground lg:mx-0 lg:max-w-[9.5ch]">
              <span className="block"><SplitTextReveal text="L’evoluzione" delay={0.15} /></span>
              <span className="block landing-heading-gradient"><SplitTextReveal text="operativa" delay={0.44} /></span>
              <span className="block text-foreground/96"><SplitTextReveal text="del tuo business." delay={0.76} /></span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.02, duration: 0.82 }}
              className="mx-auto mb-8 max-w-[650px] text-[clamp(1rem,2vw,1.18rem)] leading-[1.68] text-foreground/72 lg:mx-0"
            >
              Costruiamo ecosistemi AI cinematografici e performanti: sito premium, acquisizione clienti, automazioni,
              voice agent, WhatsApp, dashboard e integrazioni. <span className="font-semibold text-foreground">Ogni scroll deve far percepire valore, autorevolezza e conversione.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.18, duration: 0.82 }}
              className="mb-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
            >
              <button onClick={() => navigate("/demo")} className="landing-button-primary px-8 py-4 text-sm font-semibold sm:text-[15px]">
                Guarda una demo premium
              </button>
              <button
                onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
                className="landing-button-secondary px-8 py-4 text-sm font-semibold sm:text-[15px]"
              >
                Scorri il portfolio live
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.32, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-2.5 lg:justify-start"
            >
              {TRUST.map((item, index) => (
                <span
                  key={item}
                  className="landing-pill px-3.5 py-2 text-[11px] font-medium tracking-[0.03em] text-foreground/75"
                  data-tone={index % 2 === 0 ? "gold" : "violet"}
                >
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <div className="relative mx-auto flex min-h-[48svh] w-full max-w-[580px] items-center justify-center sm:min-h-[58svh] lg:min-h-[82svh]">
            <motion.div
              className="absolute h-[18rem] w-[18rem] rounded-full blur-[72px] sm:h-[26rem] sm:w-[26rem]"
              style={{
                scale: haloScale,
                opacity: haloOpacity,
                background:
                  "radial-gradient(circle, hsl(var(--primary) / 0.38), hsl(var(--empire-violet) / 0.22) 45%, transparent 72%)",
              }}
            />

            <motion.div
              style={{ y: cardLeftY, rotate: -8 }}
              className="landing-surface absolute left-0 top-[10%] hidden w-[210px] rounded-[30px] p-3 lg:block"
              data-tone="gold"
            >
              <img src={PREVIEWS[0].src} alt="Preview sito hospitality premium" loading="lazy" className="aspect-[4/5] w-full rounded-[24px] object-cover object-top" />
              <div className="px-1 pb-1 pt-3">
                <div className="text-[11px] uppercase tracking-[0.2em] text-gold-light">{PREVIEWS[0].sector}</div>
                <div className="mt-1 text-sm font-semibold text-foreground">{PREVIEWS[0].title}</div>
                <div className="mt-2 text-xs text-foreground/60">{PREVIEWS[0].metric}</div>
              </div>
            </motion.div>

            <motion.div
              style={{ y: cardRightY, rotate: 10 }}
              className="landing-surface absolute right-0 top-[8%] hidden w-[220px] rounded-[30px] p-3 lg:block"
              data-tone="violet"
            >
              <img src={PREVIEWS[1].src} alt="Preview sito wellness premium" loading="lazy" className="aspect-[4/5] w-full rounded-[24px] object-cover object-top" />
              <div className="px-1 pb-1 pt-3">
                <div className="text-[11px] uppercase tracking-[0.2em] text-empire-violet-glow">{PREVIEWS[1].sector}</div>
                <div className="mt-1 text-sm font-semibold text-foreground">{PREVIEWS[1].title}</div>
                <div className="mt-2 text-xs text-foreground/60">{PREVIEWS[1].metric}</div>
              </div>
            </motion.div>

            <motion.div
              style={{ y: cardBottomY, rotate: -4 }}
              className="landing-surface absolute bottom-[6%] left-1/2 hidden w-[300px] -translate-x-1/2 rounded-[30px] p-3 lg:block"
              data-tone="blue"
            >
              <div className="grid grid-cols-[104px_1fr] items-center gap-3">
                <img src={PREVIEWS[2].src} alt="Preview sito real estate premium" loading="lazy" className="aspect-[4/5] w-full rounded-[22px] object-cover object-top" />
                <div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-primary">{PREVIEWS[2].sector}</div>
                  <div className="mt-1 text-base font-semibold leading-tight text-foreground">{PREVIEWS[2].title}</div>
                  <div className="mt-3 text-xs leading-[1.6] text-foreground/62">
                    Funnel visivo, storytelling e conversione ad alto valore percepito.
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{
                rotateY: phoneRotateY,
                rotateX: phoneRotateX,
                scale: phoneScale,
                y: phoneY,
                transformStyle: "preserve-3d",
              }}
              className="relative z-10"
            >
              <div className="relative aspect-[9/19.5] w-[250px] rounded-[2.7rem] border border-border/80 bg-card/70 shadow-[0_50px_130px_-40px_hsl(var(--primary)/0.75)] sm:w-[290px] lg:w-[330px]">
                <div className="absolute left-1/2 top-[1.8%] z-20 h-[2.3%] w-[30%] -translate-x-1/2 rounded-full bg-black/90" />
                <div className="absolute inset-[4px] overflow-hidden rounded-[2.4rem] bg-background">
                  <motion.img src={PREVIEWS[0].src} alt="Preview mobile hospitality" style={{ opacity: screen1Opacity }} className="absolute inset-0 h-full w-full object-cover object-top" />
                  <motion.img src={PREVIEWS[1].src} alt="Preview mobile wellness" style={{ opacity: screen2Opacity }} className="absolute inset-0 h-full w-full object-cover object-top" />
                  <motion.img src={PREVIEWS[2].src} alt="Preview mobile real estate" style={{ opacity: screen3Opacity }} className="absolute inset-0 h-full w-full object-cover object-top" />
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--foreground)/0.16),transparent_28%,transparent_72%,hsl(var(--primary)/0.12))]" />
                </div>
                <div className="absolute inset-0 rounded-[2.7rem] bg-[linear-gradient(145deg,hsl(var(--foreground)/0.12),transparent_24%,transparent_64%,hsl(var(--gold)/0.09))] pointer-events-none" />
                <div className="absolute bottom-[1.4%] left-1/2 h-[1.2%] w-[30%] -translate-x-1/2 rounded-full bg-foreground/20" />
              </div>
            </motion.div>

            <div className="absolute bottom-0 left-0 right-0 grid gap-3 lg:hidden">
              {PREVIEWS.slice(0, 2).map((preview, index) => (
                <div key={preview.title} className="landing-surface mx-auto flex w-full max-w-[340px] items-center gap-3 rounded-[24px] p-3" data-tone={index === 0 ? "gold" : "violet"}>
                  <img src={preview.src} alt={`Preview ${preview.title}`} loading="lazy" className="h-20 w-16 rounded-[16px] object-cover object-top" />
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-foreground/54">{preview.sector}</div>
                    <div className="mt-1 text-sm font-semibold text-foreground">{preview.title}</div>
                    <div className="mt-2 text-xs text-foreground/62">{preview.metric}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-foreground/46"
        >
          <span className="text-[10px] uppercase tracking-[0.38em]">Scroll cinematico</span>
          <div className="h-10 w-px bg-[linear-gradient(180deg,hsl(var(--gold)/0.75),transparent)]" />
        </motion.div>
      </div>
    </section>
  );
}
