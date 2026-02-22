import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Crown, ChevronRight, Check, Calculator, Star, 
  Zap, Shield, Smartphone, TrendingUp, ArrowRight, X,
  Sparkles, Lock, Menu, Target, DollarSign, Brain
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import demoVideo from "@/assets/demo-app-video.mp4";

const LandingPage = () => {
  const navigate = useNavigate();
  const [monthlyOrders, setMonthlyOrders] = useState(500);
  const [avgOrder, setAvgOrder] = useState(25);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navLinks = [
    { id: "home", href: "#hero", label: "Home" },
    { id: "features", href: "#features", label: "Menù" },
    { id: "pricing", href: "#pricing", label: "Prezzo" },
    { id: "contact", href: "#contact", label: "Contatti" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["contact", "pricing", "features", "vision", "hero"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            if (id === "hero" || id === "vision") setActiveSection("home");
            else setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ROI Calculator
  const justEatFee = 0.30;
  const empireFee = 0.02;
  const setupCost = 1997;
  const monthlyRevenue = monthlyOrders * avgOrder;
  const justEatCost = monthlyRevenue * justEatFee;
  const empireCost = monthlyRevenue * empireFee;
  const monthlySaving = justEatCost - empireCost;
  const roiMonths = monthlySaving > 0 ? Math.ceil(setupCost / monthlySaving) : 0;

  const features = [
    { icon: <Brain className="w-6 h-6" />, title: "IA Menu Creator", desc: "Carica una foto del menu cartaceo. L'IA genera il menu digitale con foto food-porn in 60 secondi." },
    { icon: <Smartphone className="w-6 h-6" />, title: "PWA White Label", desc: "App installabile col TUO brand. Nessun logo di terzi. Il cliente vede solo te." },
    { icon: <Shield className="w-6 h-6" />, title: "Review Shield", desc: "Recensioni negative restano private. Solo le migliori vanno su Google. Tu controlli la narrazione." },
    { icon: <Zap className="w-6 h-6" />, title: "Panic Mode", desc: "Modifica tutti i prezzi con un solo slider. Promozioni flash in 2 secondi. Margini protetti." },
    { icon: <TrendingUp className="w-6 h-6" />, title: "Dashboard Real-Time", desc: "Ordini, incassi, cucina. Tutto in un unico pannello. Zero caos, massimo controllo." },
    { icon: <Lock className="w-6 h-6" />, title: "Zero Abbonamenti", desc: "Paghi una volta, è tuo per sempre. Solo 2% sulle transazioni. Basta regalare margini." },
  ];

  const painPoints = [
    { percent: "30%", label: "Commissioni che JustEat/Deliveroo ti rubano su ogni ordine" },
    { percent: "0%", label: "Controllo sul TUO brand e i TUOI dati cliente" },
    { percent: "0€/mese", label: "Nessun canone mensile. Mai. Per sempre." },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-strong border-b border-border/30">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <Crown className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-lg text-foreground tracking-[0.15em] uppercase">Empire</span>
          </a>

          <div className="hidden md:flex items-center gap-8 text-xs font-medium tracking-[0.15em] uppercase">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`transition-colors relative py-1 ${
                  activeSection === link.id ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/r/impero-roma")}
              className="hidden md:inline-flex px-5 py-2 rounded-none border border-primary text-primary text-xs font-medium tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Demo Live
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden glass-strong border-t border-border/30"
            >
              <div className="flex flex-col items-center gap-1 py-4">
                {navLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full text-center py-3 text-sm font-medium tracking-[0.15em] uppercase transition-colors ${
                      activeSection === link.id ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
                <button
                  onClick={() => { navigate("/r/impero-roma"); setMobileMenuOpen(false); }}
                  className="mt-2 mx-5 w-[calc(100%-2.5rem)] py-3 border border-primary text-primary text-sm font-medium tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Demo Live
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section — Demo Video */}
      <section id="hero" className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <video
          src={demoVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

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
            Smetti di regalare il 30% a JustEat. Costruisci il tuo impero digitale.
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
              Ottieni Empire · €1.997
            </motion.button>
            <button
              onClick={() => navigate("/r/impero-roma")}
              className="px-10 py-4 rounded-none border-2 border-foreground/30 text-foreground font-semibold text-sm tracking-widest uppercase hover:border-primary hover:text-primary transition-colors"
            >
              Demo Live
            </button>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronRight className="w-6 h-6 text-foreground/50 rotate-90" />
        </motion.div>
      </section>

      {/* La Nostra Visione — B2B Tech */}
      <section id="vision" className="py-24 px-5 bg-background">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">La Nostra Visione</span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight">
              Tecnologia per la tua <span className="text-gold-gradient">indipendenza finanziaria</span>
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Empire nasce con una missione: distruggere il monopolio delle piattaforme di delivery. 
              Ogni ristoratore merita di possedere i propri clienti, i propri dati e i propri margini — 
              senza intermediari che divorano il 30% del fatturato.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              La nostra suite IA trasforma qualsiasi ristorante in un ecosistema digitale autonomo: 
              app nativa, menu intelligente, gestione ordini real-time, e zero abbonamenti. 
              Il futuro della ristorazione è <strong className="text-foreground">indipendente</strong>.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-primary">2%</p>
                <p className="text-[11px] text-muted-foreground mt-1">Fee totale</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-primary">0€</p>
                <p className="text-[11px] text-muted-foreground mt-1">Canone mensile</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-primary">60s</p>
                <p className="text-[11px] text-muted-foreground mt-1">Menu IA pronto</p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {[
              { icon: <Target className="w-7 h-7" />, stat: "€7.500", label: "Risparmio medio mensile", sub: "su 1000 ordini" },
              { icon: <DollarSign className="w-7 h-7" />, stat: "ROI < 3", label: "Mesi per il rientro", sub: "investimento coperto" },
              { icon: <Brain className="w-7 h-7" />, stat: "100%", label: "Proprietà totale", sub: "dati, brand, clienti" },
              { icon: <Zap className="w-7 h-7" />, stat: "∞", label: "Nessun limite", sub: "ordini illimitati" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors flex flex-col items-center text-center"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                  {item.icon}
                </div>
                <p className="text-2xl font-display font-bold text-primary">{item.stat}</p>
                <p className="text-xs font-semibold text-foreground mt-1">{item.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
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
            sono <span className="text-accent font-semibold">€7.500 bruciati</span> — ogni singolo mese.
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
            Non è un'app. È un <span className="text-gold-gradient">arsenale</span>.
          </motion.h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Ogni strumento che ti serve per dominare il mercato, senza dipendere da nessuno.
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
            Calcola quanto stai bruciando
          </motion.h2>
          <p className="text-center text-muted-foreground mb-10">
            Muovi gli slider e guarda il danno che le piattaforme fanno ai tuoi margini
          </p>

          <motion.div
            className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Ordini al mese</span>
                <span className="text-foreground font-semibold">{monthlyOrders}</span>
              </div>
              <input
                type="range" min="100" max="3000" step="50"
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
                type="range" min="10" max="80" step="5"
                value={avgOrder}
                onChange={(e) => setAvgOrder(Number(e.target.value))}
                className="w-full accent-primary h-2 rounded-full"
              />
            </div>

            <div className="border-t border-border pt-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">💸 Con JustEat (30%)</span>
                <span className="text-accent font-display font-bold text-lg">
                  -€{justEatCost.toLocaleString("it-IT", { maximumFractionDigits: 0 })}/mese
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">👑 Con Empire (2%)</span>
                <span className="text-primary font-display font-bold text-lg">
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
              Pagamento unico · Per sempre tuo
            </div>

            <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground">
              €1.997
            </h2>
            <p className="text-muted-foreground mt-1">+ IVA 22% · Pagamento unico · Mai più canoni</p>

            <div className="mt-8 space-y-3 text-left">
              {[
                "App PWA col TUO brand — installabile",
                "Menu IA con foto food-porn generate",
                "Dashboard Admin completa",
                "Kitchen View real-time per lo staff",
                "Panic Mode (prezzi di massa)",
                "Review Shield — solo 4-5★ pubbliche",
                "Checkout 1-Tap con Apple/Google Pay",
                "Assistenza dedicata a vita",
                "Aggiornamenti inclusi per sempre",
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
            Ogni giorno senza Empire, <span className="text-gold-gradient">regali soldi</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            I tuoi competitor stanno già costruendo il loro ecosistema. Tu stai ancora pagando il 30%.
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
      <footer id="contact" className="border-t border-border py-12 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-primary" />
                <span className="font-display font-bold text-foreground tracking-[0.1em] uppercase">Empire</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                La suite tecnologica che libera i ristoratori dalle commissioni delle piattaforme di delivery.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Contatti</p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p>📧 info@empire-suite.it</p>
                <p>📞 +39 06 1234 5678</p>
                <p>📍 Roma, Italia</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Link Utili</p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <a href="#features" className="block hover:text-primary transition-colors">Funzionalità</a>
                <a href="#calculator" className="block hover:text-primary transition-colors">Calcolatore ROI</a>
                <a href="#pricing" className="block hover:text-primary transition-colors">Prezzo</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© 2026 Empire Restaurant Suite. Tutti i diritti riservati.</p>
            <p>P.IVA IT12345678901</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
