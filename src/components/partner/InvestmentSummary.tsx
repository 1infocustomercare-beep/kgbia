import { motion } from "framer-motion";
import {
  TrendingUp, Shield, CheckCircle, Crown,
  BarChart3, Users, Zap, Star, ChefHat,
  Wallet, Bell, Globe, Camera, Lock,
  CalendarDays, QrCode, MessageSquare, Package, Gem
} from "lucide-react";

const growthMetrics = [
  { label: "Aumento Scontrino Medio", value: "+22%", icon: <TrendingUp className="w-5 h-5" />, desc: "Grazie a upselling intelligente e menu visuale con foto" },
  { label: "Clienti Recuperati", value: "30%", icon: <Users className="w-5 h-5" />, desc: "Via Wallet Push automatico sui clienti inattivi da 30+ giorni" },
  { label: "Riduzione Errori Ordini", value: "-95%", icon: <ChefHat className="w-5 h-5" />, desc: "Ordini digitali diretti in cucina, zero trascrizione" },
  { label: "Risparmio Stampa/Anno", value: "€500+", icon: <QrCode className="w-5 h-5" />, desc: "Niente più menu cartacei da aggiornare e ristampare" },
  { label: "Risparmio Consulenze", value: "€2.000+", icon: <Shield className="w-5 h-5" />, desc: "AI-Mary gestisce la conformità fiscale 2026 automaticamente" },
  { label: "Tasso Apertura Push", value: "90%", icon: <Bell className="w-5 h-5" />, desc: "vs 15% delle newsletter — comunicazione diretta al cliente" },
];

const allIncluded = [
  { icon: <QrCode className="w-4 h-4" />, name: "Menu Digitale QR" },
  { icon: <TrendingUp className="w-4 h-4" />, name: "Panic Mode Prezzi" },
  { icon: <ChefHat className="w-4 h-4" />, name: "Kitchen View" },
  { icon: <Wallet className="w-4 h-4" />, name: "Wallet Push Clienti" },
  { icon: <Bell className="w-4 h-4" />, name: "Notifiche Push" },
  { icon: <Star className="w-4 h-4" />, name: "Review Shield" },
  { icon: <Shield className="w-4 h-4" />, name: "AI-Mary Fisco 2026" },
  { icon: <Camera className="w-4 h-4" />, name: "AI Menu Creator" },
  { icon: <Globe className="w-4 h-4" />, name: "Traduzione Multi-Lingua" },
  { icon: <MessageSquare className="w-4 h-4" />, name: "Chat Privata" },
  { icon: <CalendarDays className="w-4 h-4" />, name: "Prenotazioni Online" },
  { icon: <Lock className="w-4 h-4" />, name: "Crittografia AES-256" },
  { icon: <BarChart3 className="w-4 h-4" />, name: "Analytics Sorgenti" },
  { icon: <Users className="w-4 h-4" />, name: "Blacklist Clienti" },
  { icon: <Zap className="w-4 h-4" />, name: "Upselling Automatico" },
];

const packages = [
  { name: "Digital Start", price: "€1.997", monthly: "poi €49/mese", commission: "2%", icon: <Package className="w-4 h-4" /> },
  { name: "Growth AI", price: "€4.997", monthly: "poi €29/mese", commission: "1%", icon: <Zap className="w-4 h-4" />, popular: true },
  { name: "Empire Domination", price: "€7.997", monthly: "€0/mese", commission: "0%", icon: <Gem className="w-4 h-4" />, empire: true },
];

const InvestmentSummary = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      {/* Hero */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/15 via-card to-amber-500/10 border border-primary/20 text-center">
        <Crown className="w-12 h-12 text-primary mx-auto mb-3" />
        <h2 className="text-2xl font-display font-bold text-foreground">Proiezione di Crescita</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
          Ecco cosa succede al tuo locale nei primi 12 mesi con Empire
        </p>
      </div>

      {/* Growth Metrics */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" /> Risultati Misurabili
        </h3>
        {growthMetrics.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-4 rounded-xl bg-card border border-border/50 flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              {m.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-foreground">{m.label}</p>
                <span className="text-sm font-display font-bold text-primary">{m.value}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">{m.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ROI Timeline */}
      <div className="p-5 rounded-2xl bg-card border border-border/50 space-y-4">
        <h3 className="text-sm font-bold text-foreground text-center">📈 Timeline di Ritorno</h3>
        <div className="space-y-3">
          {[
            { month: "Mese 1", event: "Attivazione completa + Menu digitale", color: "bg-primary" },
            { month: "Mese 2", event: "Primi clienti recuperati via Wallet Push", color: "bg-emerald-400" },
            { month: "Mese 3", event: "Scontrino medio +22% grazie all'upselling", color: "bg-amber-400" },
            { month: "Mese 6", event: "Investimento ripagato (ROI break-even)", color: "bg-sky-400" },
            { month: "Mese 12", event: "Profitto netto generato: €8.000-15.000", color: "bg-violet-400" },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className={`w-3 h-3 rounded-full ${step.color} flex-shrink-0`} />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">{step.month}</span>
                <span className="text-[10px] text-muted-foreground text-right">{step.event}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3 Package Comparison */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-amber-500/5 border border-primary/20 space-y-4">
        <div className="text-center">
          <h3 className="text-base font-display font-bold text-foreground">I 3 Pacchetti Empire</h3>
          <p className="text-[10px] text-muted-foreground mt-1">Rateizzazione: 3 rate TAN 0% o 6 rate TAN 5.9%</p>
        </div>
        <div className="space-y-2">
          {packages.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                p.empire ? "border-amber-500/30 bg-amber-500/5" : p.popular ? "border-primary/30 bg-primary/5" : "border-border/30 bg-card/50"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                p.empire ? "bg-amber-500/15 text-amber-500" : "bg-primary/10 text-primary"
              }`}>
                {p.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-foreground">{p.name}</p>
                <p className="text-[9px] text-muted-foreground">{p.monthly} · {p.commission} fee</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-sm font-display font-bold ${p.empire ? "text-amber-500" : "text-foreground"}`}>{p.price}</p>
                {p.popular && <p className="text-[8px] text-primary font-bold">PIÙ SCELTO</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Everything Included (Empire Domination) */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/5 to-primary/5 border border-amber-500/20 space-y-4">
        <div className="text-center">
          <h3 className="text-base font-display font-bold text-foreground">Empire Domination — Tutto Incluso</h3>
          <p className="text-[10px] text-muted-foreground mt-1">€7.997 · €0/mese · 0% commissioni — per sempre</p>
          <p className="text-[10px] text-amber-500 font-bold mt-1">💰 Solo ~€11/giorno per 24 mesi</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {allIncluded.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.03 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/50 border border-border/30"
            >
              <span className="text-primary flex-shrink-0">{item.icon}</span>
              <span className="text-[10px] font-medium text-foreground truncate">{item.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/20 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-display font-bold text-foreground">Da €1.997 a €7.997</span>
        </div>
        <p className="text-xs text-muted-foreground">
          IVA 22% inclusa • Rateizzazione disponibile • 3 rate TAN 0% o 6 rate TAN 5.9%
        </p>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { label: "Empire: Canoni", value: "€0/mese" },
            { label: "Empire: Fee", value: "0%" },
            { label: "Garanzia", value: "Risultati" },
          ].map((stat, i) => (
            <div key={i} className="p-2 rounded-lg bg-card/50 border border-border/30 text-center">
              <p className="text-xs font-display font-bold text-primary">{stat.value}</p>
              <p className="text-[9px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Guarantee */}
      <div className="p-4 rounded-2xl bg-card border border-border/50 text-center space-y-2">
        <Shield className="w-6 h-6 text-primary mx-auto" />
        <p className="text-sm font-display font-bold text-foreground">
          Risultati Garantiti + 1 Mese Assistenza Gratuita
        </p>
        <p className="text-[10px] text-muted-foreground">
          Nessun vincolo. Nessun rinnovo. Il software è tuo. Per sempre.
        </p>
      </div>
    </motion.div>
  );
};

export default InvestmentSummary;