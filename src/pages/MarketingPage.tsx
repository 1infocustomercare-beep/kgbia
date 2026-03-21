import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Crown, Check, Calculator, Star, Zap, Shield, Smartphone,
  TrendingUp, Sparkles, ArrowRight, ChefHat, Car, Scissors,
  Heart, Store, Dumbbell, Building, Brain, Globe, BarChart3,
  Users, Rocket, Bot, Phone, Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { INDUSTRIES } from "@/data/industries";

/* ── Helpers ── */
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const ICON_MAP: Record<string, any> = {
  ChefHat, Car, Scissors, Heart, Store, Dumbbell, Building,
};

/* ── Hero ── */
const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-[140px] opacity-20 bg-primary animate-blob-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-[160px] opacity-15 bg-accent animate-blob-float-reverse" />

      <motion.div
        className="relative z-10 text-center max-w-5xl mx-auto"
        initial="hidden" animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      >
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
          <Crown className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">La piattaforma #1 per il business locale</span>
        </motion.div>

        <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading leading-tight mb-6">
          Un unico sistema per{" "}
          <span className="text-brand-gradient">ogni settore</span>
        </motion.h1>

        <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Digitalizza la tua attività in 5 minuti. Ordini, prenotazioni, CRM, IA e marketing — tutto integrato.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-vibrant-gradient text-white px-8 py-6 text-lg" onClick={() => navigate("/auth")}>
            Inizia Gratis <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-border" onClick={() => navigate("/home")}>
            Scopri di più
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ── Industries ── */
const IndustriesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial="hidden" animate={inView ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold font-heading mb-4">
            Si adatta al <span className="text-brand-gradient">tuo settore</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-xl mx-auto">
            Stessa piattaforma, configurazione intelligente per ogni verticale.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {INDUSTRIES.map((ind, i) => {
            const Icon = ICON_MAP[ind.icon] || Sparkles;
            return (
              <motion.div
                key={ind.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="glass border-border/50 hover:border-primary/40 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `hsl(${ind.color} / 0.15)` }}>
                        <Icon className="w-5 h-5" style={{ color: `hsl(${ind.color})` }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{ind.label}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{ind.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ── Benefits ── */
const benefits = [
  { icon: Brain, title: "IA Integrata", desc: "Assistente, traduzioni automatiche e suggerimenti intelligenti inclusi." },
  { icon: Globe, title: "Multi-Lingua", desc: "Traduci menu e comunicazioni in 20+ lingue con un click." },
  { icon: BarChart3, title: "Analytics Avanzati", desc: "Dashboard in tempo reale con KPI, trend e previsioni." },
  { icon: Shield, title: "GDPR Compliant", desc: "Privacy by design, dati in EU, consensi granulari." },
  { icon: Smartphone, title: "PWA Mobile", desc: "App installabile, notifiche push, funziona offline." },
  { icon: Bot, title: "Concierge AI", desc: "Chat assistente 24/7 per i tuoi clienti e il tuo staff." },
];

const BenefitsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-24 px-4 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-5xl font-bold font-heading text-center mb-16"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        >
          Perché scegliere <span className="text-brand-gradient">Empire</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass border-border/50 h-full hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <b.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{b.title}</h3>
                  <p className="text-muted-foreground text-sm">{b.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── Comparison ── */
const ComparisonSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const rows = [
    { feature: "Menu digitale QR", empire: true, others: "Parziale" },
    { feature: "IA integrata", empire: true, others: false },
    { feature: "Multi-settore", empire: true, others: false },
    { feature: "CRM + Loyalty", empire: true, others: "Extra €€" },
    { feature: "PWA installabile", empire: true, others: false },
    { feature: "Supporto italiano", empire: true, others: "Parziale" },
    { feature: "Trial 90 giorni", empire: true, others: "14 gg" },
  ];

  return (
    <section ref={ref} className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl md:text-5xl font-bold font-heading text-center mb-16"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        >
          Empire vs <span className="text-muted-foreground">gli altri</span>
        </motion.h2>

        <div className="glass rounded-xl overflow-hidden">
          <div className="grid grid-cols-3 gap-0 text-sm">
            <div className="p-4 font-semibold border-b border-border">Feature</div>
            <div className="p-4 font-semibold border-b border-border text-center text-primary">Empire</div>
            <div className="p-4 font-semibold border-b border-border text-center text-muted-foreground">Altri</div>
            {rows.map((r, i) => (
              <motion.div
                key={i}
                className="contents"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <div className="p-4 border-b border-border/50">{r.feature}</div>
                <div className="p-4 border-b border-border/50 text-center">
                  {r.empire === true ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : r.empire}
                </div>
                <div className="p-4 border-b border-border/50 text-center text-muted-foreground">
                  {r.others === true ? <Check className="w-5 h-5 mx-auto" /> : r.others === false ? "—" : r.others}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── Pricing ── */
const plans = [
  { name: "Essential", price: 29, desc: "Per iniziare subito", features: ["Menu QR", "Ordini base", "Dashboard", "Supporto email", "Mappa Tavoli"] },
  { name: "Smart IA", price: 59, desc: "Crescita intelligente", popular: true, features: ["Tutto Essential +", "Assistente IA", "Traduzioni auto", "Analytics avanzati", "Chat privata", "Inventario IA", "Scudo Recensioni"] },
  { name: "Empire Pro", price: 89, desc: "Domina il mercato", features: ["Tutto Smart IA +", "Prenotazioni", "CRM Clienti", "Notifiche Push", "Multi-lingua", "Wallet Fedeltà", "Supporto prioritario"] },
];

const PricingSection = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-24 px-4 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        >
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">
            Piani <span className="text-brand-gradient">trasparenti</span>
          </h2>
          <p className="text-muted-foreground text-lg">90 giorni gratis. Nessun vincolo.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
            >
              <Card className={`relative glass border-border/50 h-full ${p.popular ? "border-primary/60 vibrant-glow" : ""}`}>
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-vibrant-gradient text-white text-xs font-semibold">
                    Più Popolare
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-1">{p.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{p.desc}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">€{p.price}</span>
                    <span className="text-muted-foreground">/mese</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${p.popular ? "bg-vibrant-gradient text-white" : ""}`}
                    variant={p.popular ? "default" : "outline"}
                    onClick={() => navigate("/auth")}
                  >
                    Inizia Gratis
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── CTA ── */
const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <Award className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">
            Pronto a trasformare la tua attività?
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Unisciti a centinaia di imprenditori che hanno scelto Empire. 90 giorni gratis, zero rischi.
          </p>
          <Button size="lg" className="bg-vibrant-gradient text-white px-10 py-6 text-lg" onClick={() => navigate("/admin")}>
            Inizia Ora — È Gratis <Rocket className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

/* ── Page ── */
export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <HeroSection />
      <IndustriesSection />
      <BenefitsSection />
      <ComparisonSection />
      <PricingSection />
      <CTASection />
    </main>
  );
}
