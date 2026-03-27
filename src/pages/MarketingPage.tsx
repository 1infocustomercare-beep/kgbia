import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Crown, Check, ArrowRight, ChefHat, Car, Scissors,
  Heart, Store, Dumbbell, Building, Brain, Globe, BarChart3,
  Shield, Smartphone, Bot, Rocket, Zap, Star, Users,
  Sparkles, Phone, Award, Lock, MessageSquare, Palette
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { INDUSTRIES } from "@/data/industries";

/* ── Icon map ── */
const ICON_MAP: Record<string, any> = {
  ChefHat, Car, Scissors, Heart, Store, Dumbbell, Building, Brain, Globe,
  BarChart3, Shield, Smartphone, Bot, Sparkles, Palette, Users, Lock, Phone,
};

/* ── Animated counter ── */
const Counter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(interval); }
      else setCount(start);
    }, 30);
    return () => clearInterval(interval);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
};

/* ══════════════════════════════════════════════════
   HERO — Full-screen dark with parallax grain
   ══════════════════════════════════════════════════ */
const HeroSection = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dark base */}
      <div className="absolute inset-0 bg-[hsl(228,22%,5%)]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

      {/* Ambient orbs */}
      <div className="absolute top-[15%] left-[20%] w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[160px]"
        style={{ background: "radial-gradient(circle, hsl(172 80% 48%), transparent 70%)" }} />
      <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] rounded-full opacity-[0.06] blur-[140px]"
        style={{ background: "radial-gradient(circle, hsl(248 60% 56%), transparent 70%)" }} />
      <div className="absolute top-[60%] left-[60%] w-[300px] h-[300px] rounded-full opacity-[0.05] blur-[120px]"
        style={{ background: "radial-gradient(circle, hsl(42 90% 55%), transparent 70%)" }} />

      <motion.div style={{ y: yText, opacity }} className="relative z-10 text-center max-w-5xl mx-auto px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-xl mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium tracking-widest uppercase text-white/60">
            Piattaforma AI per Business Locali
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-8"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span className="text-white">Il futuro del</span>
          <br />
          <span className="bg-gradient-to-r from-[hsl(172,80%,48%)] via-[hsl(210,100%,62%)] to-[hsl(248,60%,56%)] bg-clip-text text-transparent">
            tuo business
          </span>
          <br />
          <span className="text-white">inizia qui.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          App, CRM, IA e marketing integrati in un'unica piattaforma.
          <br className="hidden md:block" />
          Configura in 5 minuti. 90 giorni gratis.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-[hsl(172,80%,48%)] to-[hsl(210,100%,62%)] text-white border-0 px-10 py-6 text-base font-semibold shadow-[0_0_40px_hsl(172,80%,48%,0.3)] hover:shadow-[0_0_60px_hsl(172,80%,48%,0.4)]"
          >
            Inizia Gratis <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            size="lg" variant="outline"
            onClick={() => navigate("/home")}
            className="border-white/15 text-white/80 hover:bg-white/5 px-10 py-6 text-base"
          >
            Scopri la Demo
          </Button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="flex justify-center gap-12 mt-16 text-center"
        >
          {[
            { n: 7, s: "+", label: "Settori" },
            { n: 25, s: "+", label: "Moduli" },
            { n: 90, s: "gg", label: "Trial Gratuito" },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-bold text-white">
                <Counter target={s.n} suffix={s.s} />
              </div>
              <div className="text-xs text-white/40 mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 rounded-full bg-white/40" />
        </div>
      </motion.div>
    </section>
  );
};

/* ══════════════════════════════════════════════════
   TRUST BAR
   ══════════════════════════════════════════════════ */
const TrustBar = () => (
  <section className="py-10 border-y border-white/5 bg-[hsl(228,18%,7%)]">
    <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-12 gap-y-4 px-4">
      {["GDPR Compliant", "Made in Italy", "99.9% Uptime", "AI-Powered", "SOC2 Ready"].map((t) => (
        <div key={t} className="flex items-center gap-2 text-white/30 text-xs tracking-widest uppercase">
          <Shield className="w-3.5 h-3.5" />
          <span>{t}</span>
        </div>
      ))}
    </div>
  </section>
);

/* ══════════════════════════════════════════════════
   INDUSTRIES — Compact grid on dark bg
   ══════════════════════════════════════════════════ */
const IndustriesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const topIndustries = INDUSTRIES.slice(0, 8);

  return (
    <section ref={ref} className="py-24 px-4 bg-[hsl(225,14%,9%)]">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[hsl(172,80%,48%)]/70 mb-3">Multi-Settore</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Un sistema, <span className="bg-gradient-to-r from-[hsl(172,80%,48%)] to-[hsl(210,100%,62%)] bg-clip-text text-transparent">ogni verticale</span>
          </h2>
          <p className="text-white/40 max-w-lg mx-auto">Configurazione intelligente per Food, NCC, Beauty, Hotel, Retail e oltre.</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {topIndustries.map((ind, i) => {
            const Icon = ICON_MAP[ind.icon] || Sparkles;
            return (
              <motion.div key={ind.id}
                initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.06 }}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 cursor-default"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `hsl(${ind.color} / 0.12)` }}>
                  <Icon className="w-5 h-5" style={{ color: `hsl(${ind.color})` }} />
                </div>
                <h3 className="text-sm font-semibold text-white/90">{ind.label}</h3>
                <p className="text-xs text-white/30 mt-1 line-clamp-2">{ind.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════
   BENEFITS — Gradient accent bg
   ══════════════════════════════════════════════════ */
const benefits = [
  { icon: Brain, title: "IA Integrata", desc: "Assistente AI, traduzioni e suggerimenti intelligenti inclusi in ogni piano." },
  { icon: BarChart3, title: "Analytics Real-Time", desc: "Dashboard con KPI, trend, previsioni e insight automatici." },
  { icon: Shield, title: "Sicurezza Enterprise", desc: "GDPR compliant, dati in EU, crittografia end-to-end." },
  { icon: Smartphone, title: "PWA Installabile", desc: "App mobile nativa, notifiche push, funziona offline." },
  { icon: Bot, title: "Agenti AI 24/7", desc: "Concierge, sommelier, assistente che lavorano per te." },
  { icon: Globe, title: "Multi-Lingua", desc: "Traduzioni automatiche in 20+ lingue con un click." },
];

const BenefitsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(228,22%,5%)] via-[hsl(225,20%,8%)] to-[hsl(228,22%,5%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-px bg-gradient-to-r from-transparent via-[hsl(172,80%,48%)]/20 to-transparent" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <p className="text-xs uppercase tracking-[0.3em] text-[hsl(248,60%,56%)]/70 mb-3">Perché Empire</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Tecnologia che fa la <span className="bg-gradient-to-r from-[hsl(248,60%,56%)] to-[hsl(172,80%,48%)] bg-clip-text text-transparent">differenza</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((b, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[hsl(172,80%,48%)]/10 to-[hsl(248,60%,56%)]/10 flex items-center justify-center mb-4">
                <b.icon className="w-5 h-5 text-[hsl(172,80%,48%)]" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{b.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════
   COMPARISON TABLE
   ══════════════════════════════════════════════════ */
const ComparisonSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const rows = [
    { feature: "IA integrata", empire: true, others: false },
    { feature: "Multi-settore nativo", empire: true, others: false },
    { feature: "CRM + Loyalty", empire: true, others: "Extra €€" },
    { feature: "PWA installabile", empire: true, others: false },
    { feature: "Agenti AI autonomi", empire: true, others: false },
    { feature: "Trial 90 giorni", empire: true, others: "14 gg" },
    { feature: "Supporto italiano", empire: true, others: "Parziale" },
  ];

  return (
    <section ref={ref} className="py-24 px-4 bg-[hsl(225,14%,9%)]">
      <div className="max-w-3xl mx-auto">
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl md:text-5xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Empire <span className="text-white/30">vs gli altri</span>
          </h2>
        </motion.div>

        <div className="rounded-2xl border border-white/[0.06] overflow-hidden bg-white/[0.01]">
          {/* Header */}
          <div className="grid grid-cols-3 text-xs uppercase tracking-wider border-b border-white/[0.06]">
            <div className="p-4 text-white/40">Feature</div>
            <div className="p-4 text-center text-[hsl(172,80%,48%)] font-semibold">Empire</div>
            <div className="p-4 text-center text-white/30">Competitor</div>
          </div>
          {rows.map((r, i) => (
            <motion.div key={i} className="grid grid-cols-3 border-b border-white/[0.03] last:border-0"
              initial={{ opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.05 }}>
              <div className="p-4 text-sm text-white/70">{r.feature}</div>
              <div className="p-4 text-center">
                {r.empire === true ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : r.empire}
              </div>
              <div className="p-4 text-center text-white/25 text-sm">
                {r.others === true ? <Check className="w-4 h-4 mx-auto" /> : r.others === false ? "—" : r.others}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════
   PRICING
   ══════════════════════════════════════════════════ */
const plans = [
  { name: "Essential", price: 29, desc: "Per iniziare", features: ["Menu QR", "Ordini base", "Dashboard", "Supporto email", "Mappa Tavoli"] },
  { name: "Smart IA", price: 59, desc: "Crescita intelligente", popular: true, features: ["Tutto Essential +", "Assistente IA", "Traduzioni auto", "Analytics avanzati", "Chat privata", "Inventario IA", "Scudo Recensioni"] },
  { name: "Empire Pro", price: 89, desc: "Domina il mercato", features: ["Tutto Smart IA +", "Prenotazioni", "CRM Clienti", "Notifiche Push", "Multi-lingua", "Wallet Fedeltà", "Supporto prioritario"] },
];

const PricingSection = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(225,14%,9%)] via-[hsl(228,20%,6%)] to-[hsl(228,22%,5%)]" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6 }}>
          <p className="text-xs uppercase tracking-[0.3em] text-[hsl(42,90%,55%)]/70 mb-3">Pricing</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Piani <span className="bg-gradient-to-r from-[hsl(42,90%,55%)] to-[hsl(172,80%,48%)] bg-clip-text text-transparent">trasparenti</span>
          </h2>
          <p className="text-white/40">90 giorni gratis. Nessun vincolo. Disdici quando vuoi.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12 }}
              className={`relative rounded-2xl border p-7 transition-all duration-500 ${
                p.popular
                  ? "border-[hsl(172,80%,48%)]/30 bg-gradient-to-b from-[hsl(172,80%,48%)]/[0.04] to-transparent shadow-[0_0_60px_hsl(172,80%,48%,0.08)]"
                  : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.03]"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[hsl(172,80%,48%)] to-[hsl(210,100%,62%)] text-white text-[10px] font-bold uppercase tracking-wider">
                  Più Popolare
                </div>
              )}
              <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
              <p className="text-xs text-white/40 mb-5">{p.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">€{p.price}</span>
                <span className="text-white/30 text-sm">/mese</span>
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2.5 text-sm text-white/60">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full py-5 font-semibold ${
                  p.popular
                    ? "bg-gradient-to-r from-[hsl(172,80%,48%)] to-[hsl(210,100%,62%)] text-white border-0 shadow-[0_0_30px_hsl(172,80%,48%,0.2)]"
                    : "bg-white/5 text-white/80 border border-white/10 hover:bg-white/10"
                }`}
                onClick={() => navigate("/auth")}
              >
                Inizia Gratis
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════
   FINAL CTA
   ══════════════════════════════════════════════════ */
const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative py-28 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[hsl(228,22%,5%)]" />
      <div className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, hsl(172,80%,48%), transparent 60%)",
        }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="relative max-w-2xl mx-auto text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(172,80%,48%)]/20 to-[hsl(248,60%,56%)]/20 flex items-center justify-center mx-auto mb-8">
          <Rocket className="w-7 h-7 text-[hsl(172,80%,48%)]" />
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Pronto a iniziare?
        </h2>
        <p className="text-white/40 text-lg mb-10">
          Unisciti a centinaia di imprenditori. 90 giorni gratis, zero rischi, setup in 5 minuti.
        </p>
        <Button
          size="lg"
          onClick={() => navigate("/auth")}
          className="bg-gradient-to-r from-[hsl(172,80%,48%)] to-[hsl(210,100%,62%)] text-white border-0 px-12 py-6 text-base font-semibold shadow-[0_0_50px_hsl(172,80%,48%,0.3)] hover:shadow-[0_0_70px_hsl(172,80%,48%,0.4)]"
        >
          Inizia Ora — È Gratis <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>
    </section>
  );
};

/* ══════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════ */
export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-[hsl(228,22%,5%)] text-white overflow-x-hidden">
      <HeroSection />
      <TrustBar />
      <IndustriesSection />
      <BenefitsSection />
      <ComparisonSection />
      <PricingSection />
      <CTASection />
    </main>
  );
}
