import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Crown, ChevronRight, Check, Calculator, Play, Star, 
  Zap, Shield, Smartphone, TrendingUp, ArrowRight, X,
  UtensilsCrossed, Eye, Sparkles, Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import restaurantLogo from "@/assets/restaurant-logo.png";
import heroVideo from "@/assets/hero-restaurant.mp4";

const LandingPage = () => {
  const navigate = useNavigate();
  const [monthlyOrders, setMonthlyOrders] = useState(500);
  const [avgOrder, setAvgOrder] = useState(25);
  const [showVideo, setShowVideo] = useState(false);

  // ROI Calculator
  const justEatFee = 0.30; // 30%
  const empireFee = 0.02; // 2%
  const setupCost = 1997;
  const monthlyRevenue = monthlyOrders * avgOrder;
  const justEatCost = monthlyRevenue * justEatFee;
  const empireCost = monthlyRevenue * empireFee;
  const monthlySaving = justEatCost - empireCost;
  const roiMonths = monthlySaving > 0 ? Math.ceil(setupCost / monthlySaving) : 0;

  const features = [
    { icon: <Sparkles className="w-6 h-6" />, title: "IA Menu Creator", desc: "Foto del menu cartaceo → menu digitale con foto food-porn generate dall'IA" },
    { icon: <Smartphone className="w-6 h-6" />, title: "PWA White Label", desc: "App installabile col TUO brand. Nessun logo di terzi. È casa tua." },
    { icon: <Shield className="w-6 h-6" />, title: "Review Shield", desc: "Recensioni negative restano private. Solo le migliori vanno su Google." },
    { icon: <Zap className="w-6 h-6" />, title: "Panic Mode", desc: "Modifica tutti i prezzi con un solo slider. Promozioni flash in 2 secondi." },
    { icon: <TrendingUp className="w-6 h-6" />, title: "Dashboard Real-Time", desc: "Ordini, incassi, cucina. Tutto in un unico pannello. Zero caos." },
    { icon: <Lock className="w-6 h-6" />, title: "Zero Abbonamenti", desc: "Paghi una volta, è tuo per sempre. Solo 2% sulle transazioni. Basta." },
  ];

  const painPoints = [
    { percent: "30%", label: "Commissioni JustEat/Deliveroo su ogni ordine" },
    { percent: "0%", label: "Controllo sul TUO brand e i TUOI clienti" },
    { percent: "0€/mese", label: "Nessun canone mensile per il resto della vita" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-strong">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-lg text-foreground">Empire</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Funzionalità</a>
            <a href="#calculator" className="hover:text-foreground transition-colors">Calcolatore ROI</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Prezzo</a>
          </div>
        </div>
      </nav>

      {/* Hero Section — Full-screen Video */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Video Background */}
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <Crown className="w-10 h-10 text-primary mb-3" />
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-bold tracking-[0.25em] text-foreground uppercase">
              Empire
            </h1>
            <div className="flex items-center gap-4 mt-3">
              <span className="w-12 h-px bg-primary" />
              <span className="text-xs sm:text-sm tracking-[0.3em] text-primary uppercase font-medium">
                Restaurant Suite
              </span>
              <span className="w-12 h-px bg-primary" />
            </div>
          </motion.div>

          <motion.p
            className="mt-8 text-lg sm:text-xl text-foreground/80 max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            La tua app di proprietà. Zero abbonamenti. Zero intermediari.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <motion.button
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              className="px-10 py-4 rounded-none border-2 border-primary bg-primary text-primary-foreground font-semibold text-sm tracking-widest uppercase gold-glow"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Ottieni Empire
            </motion.button>
            <button
              onClick={() => navigate("/r/impero-roma")}
              className="px-10 py-4 rounded-none border-2 border-foreground/30 text-foreground font-semibold text-sm tracking-widest uppercase hover:border-primary hover:text-primary transition-colors"
            >
              Demo Live
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronRight className="w-6 h-6 text-foreground/50 rotate-90" />
        </motion.div>
      </section>

      {/* Pain Points */}
      <section className="py-20 px-5">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl sm:text-4xl font-display font-bold text-center text-foreground mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Il problema che stai ignorando
          </motion.h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Ogni ordine su JustEat ti costa il 30%. Su 1.000 ordini al mese, 
            sono <span className="text-accent font-semibold">€7.500 bruciati</span> — ogni mese.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {painPoints.map((point, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-2xl bg-card text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <p className="text-3xl font-display font-bold text-primary">{point.percent}</p>
                <p className="mt-2 text-sm text-muted-foreground">{point.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-5 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl sm:text-4xl font-display font-bold text-center text-foreground mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Non è un'app. È un <span className="text-gold-gradient">impero</span>.
          </motion.h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Tutto ciò di cui il tuo ristorante ha bisogno, senza dipendere da nessuno.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-2xl bg-secondary/30 border border-border hover:border-primary/30 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feat.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{feat.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section id="calculator" className="py-20 px-5">
        <div className="max-w-2xl mx-auto">
          <motion.h2
            className="text-3xl sm:text-4xl font-display font-bold text-center text-foreground mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Calculator className="w-8 h-8 inline-block mr-2 text-primary" />
            Calcola il tuo risparmio
          </motion.h2>
          <p className="text-center text-muted-foreground mb-10">
            Scopri quanto stai regalando ogni mese alle piattaforme
          </p>

          <motion.div
            className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Sliders */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Ordini al mese</span>
                <span className="text-foreground font-semibold">{monthlyOrders}</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={monthlyOrders}
                onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                className="w-full accent-primary h-2 rounded-full"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Scontrino medio</span>
                <span className="text-foreground font-semibold">€{avgOrder}</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={avgOrder}
                onChange={(e) => setAvgOrder(Number(e.target.value))}
                className="w-full accent-primary h-2 rounded-full"
              />
            </div>

            {/* Results */}
            <div className="border-t border-border pt-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">💸 Con JustEat (30%)</span>
                <span className="text-accent font-display font-bold text-lg">
                  -€{justEatCost.toLocaleString("it-IT", { maximumFractionDigits: 0 })}/mese
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">👑 Con Empire (2%)</span>
                <span className="text-green-400 font-display font-bold text-lg">
                  -€{empireCost.toLocaleString("it-IT", { maximumFractionDigits: 0 })}/mese
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="text-foreground font-semibold">Risparmi ogni mese</span>
                <span className="text-primary font-display font-bold text-2xl">
                  €{monthlySaving.toLocaleString("it-IT", { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">ROI completo in</span>
                <span className="text-foreground font-display font-bold">
                  {roiMonths} {roiMonths === 1 ? "mese" : "mesi"}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
              <p className="text-sm text-foreground text-center">
                In <strong>{12 - roiMonths > 0 ? 12 - roiMonths : 0} mesi</strong> del primo anno, 
                il risparmio netto è di{" "}
                <strong className="text-primary">
                  €{Math.max(0, monthlySaving * (12 - roiMonths) - setupCost).toLocaleString("it-IT", { maximumFractionDigits: 0 })}
                </strong>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-5 bg-card/50">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-xs font-medium text-primary mb-6">
              <Crown className="w-3 h-3" />
              Pagamento unico · Per sempre
            </div>

            <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground">
              €1.997
            </h2>
            <p className="text-muted-foreground mt-1">+ IVA 22% · Pagamento unico</p>

            <div className="mt-8 space-y-3 text-left">
              {[
                "App PWA col TUO brand",
                "Menu IA con foto food-porn",
                "Dashboard Admin completa",
                "Kitchen View real-time",
                "Panic Mode (prezzi di massa)",
                "Review Shield",
                "Academy integrata",
                "Assistenza dedicata",
                "Aggiornamenti inclusi",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>

            <motion.button
              className="mt-10 w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg gold-glow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Inizia Ora · €1.997 + IVA
            </motion.button>

            <p className="mt-4 text-xs text-muted-foreground">
              Costo mensile: <strong className="text-foreground">€0</strong> · Solo 2% sulle transazioni
            </p>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span>🔒 Pagamento sicuro Stripe</span>
              <span>📞 Supporto incluso</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold text-foreground">
            Il tuo ristorante merita un <span className="text-gold-gradient">impero</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Ogni giorno che passi su JustEat, stai regalando migliaia di euro.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <motion.button
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold gold-glow"
              whileTap={{ scale: 0.97 }}
            >
              Ottieni Empire Adesso
            </motion.button>
            <button
              onClick={() => navigate("/r/impero-roma")}
              className="px-8 py-4 rounded-2xl bg-secondary text-secondary-foreground font-medium"
            >
              Prova la Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-5">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-primary" />
            <span>Empire Restaurant Suite</span>
          </div>
          <p>© 2026 Empire. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
