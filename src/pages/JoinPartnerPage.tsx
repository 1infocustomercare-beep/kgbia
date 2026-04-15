import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Crown, Handshake, Trophy, Rocket, ArrowRight, Check,
  DollarSign, Users, Star, Zap, Shield, TrendingUp
} from "lucide-react";
import empireLogoNew from "@/assets/empire-logo-new.png";

const JoinPartnerPage = () => {
  const navigate = useNavigate();

  const kpis = [
    { icon: <DollarSign className="w-5 h-5" />, value: "€997", label: "per vendita", color: "hsl(var(--primary))" },
    { icon: <Trophy className="w-5 h-5" />, value: "€1.500", label: "bonus mensile", color: "hsl(var(--empire-violet))" },
    { icon: <Users className="w-5 h-5" />, value: "25+", label: "settori coperti", color: "hsl(var(--accent))" },
    { icon: <Zap className="w-5 h-5" />, value: "€0", label: "investimento iniziale", color: "hsl(38, 65%, 55%)" },
  ];

  const benefits = [
    { icon: <Rocket />, title: "Kit Vendita Completo", desc: "Demo live, materiali, script di vendita e calcolatore ROI pronti all'uso." },
    { icon: <Shield />, title: "Modalità Presentazione", desc: "Nascondi dati sensibili durante le demo ai clienti. Privacy totale." },
    { icon: <TrendingUp />, title: "Carriera da Team Leader", desc: "4 vendite + 2 reclute → sblocchi bonus override sulle vendite del tuo team." },
    { icon: <Star />, title: "Pagamenti Istantanei", desc: "Commissioni accreditate via Stripe Connect immediatamente dopo ogni vendita." },
  ];

  const scenarios = [
    { sales: 2, commission: 1994, bonus: 0, total: 1994 },
    { sales: 3, commission: 2991, bonus: 500, total: 3491 },
    { sales: 5, commission: 4985, bonus: 1500, total: 6485 },
  ];

  return (
    <div className="min-h-screen landing-dark force-dark" style={{ background: "linear-gradient(180deg, hsl(228 22% 6%) 0%, hsl(230 20% 8%) 100%)" }}>
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b border-border/10" style={{ background: "hsla(228,22%,6%,0.85)" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5">
            <img src={empireLogoNew} alt="Empire" className="w-8 h-8 rounded-full object-cover border border-primary/30" />
            <span className="font-heading font-bold text-sm tracking-wider uppercase text-foreground">EMPIRE</span>
          </div>
          <motion.button
            onClick={() => navigate("/auth?role=partner")}
            className="px-5 py-2 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-xs font-heading tracking-wider uppercase"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          >
            Registrati Ora
          </motion.button>
        </div>
      </header>

      <div className="pt-24 pb-16 px-5 max-w-5xl mx-auto">
        {/* Hero */}
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Handshake className="w-4 h-4 text-primary" />
            <span className="text-[0.65rem] font-heading font-bold tracking-[2px] uppercase text-primary">Programma Partner</span>
          </div>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-heading font-bold text-foreground leading-[1.08] mb-5">
            Guadagna Vendendo la <span className="text-shimmer">Piattaforma AI</span> più Completa
          </h1>
          <p className="text-sm text-foreground/70 max-w-xl mx-auto leading-relaxed mb-8">
            Diventa Partner Empire e guadagna €997 per ogni vendita + bonus fino a €1.500/mese.
            Nessun investimento, nessun rischio. Solo guadagni.
          </p>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-16">
          {kpis.map((kpi, i) => (
            <motion.div key={i} className="rounded-2xl glow-card p-5 text-center"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}>
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}15`, color: kpi.color }}>
                {kpi.icon}
              </div>
              <p className="text-xl font-heading font-bold text-foreground">{kpi.value}</p>
              <p className="text-[0.6rem] text-foreground/60 uppercase tracking-wider font-heading">{kpi.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-2xl font-heading font-bold text-foreground text-center mb-8">
            Cosa Ottieni come <span className="text-shimmer">Partner</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <motion.div key={i} className="rounded-2xl glow-card p-6"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.1 * i }}>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3 [&>svg]:w-5 [&>svg]:h-5">
                  {b.icon}
                </div>
                <h3 className="font-heading font-bold text-sm text-foreground mb-1">{b.title}</h3>
                <p className="text-xs text-foreground/65 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Earnings Simulator */}
        <div className="mb-16">
          <h2 className="text-2xl font-heading font-bold text-foreground text-center mb-8">
            Simulatore <span className="text-shimmer">Guadagni</span>
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {scenarios.map((s, i) => (
              <motion.div key={i} className="rounded-2xl glow-card p-6 text-center"
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: 0.1 * i }}>
                <p className="text-[0.6rem] font-heading font-bold text-foreground/60 uppercase tracking-wider mb-4">
                  {s.sales} vendite/mese
                </p>
                <div className="space-y-2 text-xs mb-4">
                  <div className="flex justify-between"><span className="text-foreground/65">Commissioni</span><span className="font-bold text-foreground">€{s.commission.toLocaleString()}</span></div>
                  {s.bonus > 0 && <div className="flex justify-between"><span className="text-foreground/65">Bonus</span><span className="font-bold text-primary">€{s.bonus.toLocaleString()}</span></div>}
                </div>
                <div className="pt-3 border-t border-border/30">
                  <p className="text-[0.6rem] text-foreground/60 mb-1">Totale mensile</p>
                  <p className="text-2xl font-heading font-bold text-shimmer">€{s.total.toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div className="text-center p-10 rounded-3xl glow-card"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Crown className="w-12 h-12 mx-auto text-primary mb-4" />
          <h2 className="text-2xl font-heading font-bold text-foreground mb-3">
            Pronto a Guadagnare?
          </h2>
          <p className="text-sm text-foreground/65 mb-6 max-w-md mx-auto">
            Registrati gratis, ricevi il tuo kit vendita e inizia a guadagnare commissioni dal primo giorno.
          </p>
          <motion.button
            onClick={() => navigate("/auth?role=partner")}
            className="px-10 py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase inline-flex items-center gap-2"
            whileHover={{ scale: 1.03, boxShadow: "0 20px 60px hsla(265,70%,60%,0.25)" }}
            whileTap={{ scale: 0.97 }}
          >
            Diventa Partner Ora <ArrowRight className="w-4 h-4" />
          </motion.button>
          <div className="flex items-center justify-center gap-4 mt-4">
            {["Zero costi", "Zero rischi", "Pagamenti istantanei"].map((t, i) => (
              <span key={i} className="text-[0.6rem] text-foreground/50 flex items-center gap-1">
                <Check className="w-3 h-3 text-primary/60" /> {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinPartnerPage;
