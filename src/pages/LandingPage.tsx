import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { 
  Crown, ChevronRight, Check, Calculator, Star, 
  Zap, Shield, Smartphone, TrendingUp, X,
  Sparkles, Lock, Menu, Target, DollarSign, Brain,
  ChefHat, AlertTriangle, Banknote, ArrowDown,
  MessageCircle, HelpCircle, ChevronDown, Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import demoVideo from "@/assets/demo-app-video.mp4";

// Animated counter component
const AnimatedNumber = ({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplay(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value]);

  return <span ref={ref}>{prefix}{display.toLocaleString("it-IT")}{suffix}</span>;
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [monthlyOrders, setMonthlyOrders] = useState(500);
  const [avgOrder, setAvgOrder] = useState(25);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const navLinks = [
    { id: "home", href: "#hero", label: "Home" },
    { id: "features", href: "#features", label: "Funzioni" },
    { id: "pricing", href: "#pricing", label: "Prezzo" },
    { id: "contact", href: "#contact", label: "Contatti" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["contact", "pricing", "calculator", "features", "pain", "vision", "hero"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            if (id === "hero" || id === "vision" || id === "pain") setActiveSection("home");
            else if (id === "calculator") setActiveSection("features");
            else setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ROI
  const justEatFee = 0.30;
  const empireFee = 0.02;
  const setupCost = 1997;
  const monthlyRevenue = monthlyOrders * avgOrder;
  const justEatCost = monthlyRevenue * justEatFee;
  const empireCost = monthlyRevenue * empireFee;
  const monthlySaving = justEatCost - empireCost;
  const roiMonths = monthlySaving > 0 ? Math.ceil(setupCost / monthlySaving) : 0;
  const yearSaving = monthlySaving * 12;
  const justEatBarWidth = 100;
  const empireBarWidth = Math.max(5, (empireCost / justEatCost) * 100);

  const featureCards = [
    { 
      icon: <Brain className="w-7 h-7" />, 
      title: "AI Menu Creator", 
      benefit: "Elimina €2.000+ in costi fotografi",
      desc: "Carica una foto del menu cartaceo. L'IA estrae testi, prezzi e genera foto food-porn iper-realistiche in 60 secondi. Zero intermediari, zero attese.",
      tag: "IA"
    },
    { 
      icon: <ChefHat className="w-7 h-7" />, 
      title: "Kitchen View Real-Time", 
      benefit: "Zero errori, zero perdite",
      desc: "Lo staff gestisce gli ordini con interfaccia dedicata: notifiche sonore istantanee, stati ordine (In Preparazione → Pronto → Consegnato), funzione Stampa Ticket integrata.",
      tag: "STAFF"
    },
    { 
      icon: <AlertTriangle className="w-7 h-7" />, 
      title: "Panic Mode", 
      benefit: "Margini protetti in 2 secondi",
      desc: "Un solo slider per modificare tutti i prezzi del catalogo in percentuale. Promozioni flash o rialzo istantaneo. Il database si sincronizza in tempo reale su tutti i dispositivi.",
      tag: "MARGINI"
    },
    { 
      icon: <Lock className="w-7 h-7" />, 
      title: "Vault Fiscale Criptato", 
      benefit: "Automazione fiscale 100% compliant",
      desc: "L'agente AI-Mary guida il setup delle API fiscali (Scontrino.it, Aruba). Chiavi criptate AES-256, isolamento totale per tenant. Il controllo centralizzato vede solo lo stato operativo.",
      tag: "FISCO"
    },
    { 
      icon: <Shield className="w-7 h-7" />, 
      title: "Review Shield", 
      benefit: "Solo 4-5★ raggiungono Google",
      desc: "Filtro intelligente: le recensioni da 1 a 3 stelle restano nel tuo archivio privato. Solo le migliori costruiscono la tua reputazione online.",
      tag: "BRAND"
    },
    { 
      icon: <Smartphone className="w-7 h-7" />, 
      title: "PWA White Label", 
      benefit: "L'unico Asset Digitale di Proprietà",
      desc: "App installabile come nativa. Logo, colori, dominio personalizzato. Il cliente vede solo il tuo brand. Zero commissioni marketplace, controllo fiscale centralizzato.",
      tag: "BRAND"
    },
  ];

  const faqs = [
    {
      q: "È difficile da usare?",
      a: "No. Se sai usare Instagram, sai usare Empire. L'interfaccia è progettata per ristoratori, non per programmatori. L'IA fa il lavoro pesante: carica una foto del menu e in 60 secondi hai il catalogo digitale completo."
    },
    {
      q: "Come arrivano i soldi?",
      a: "I pagamenti dei clienti arrivano direttamente sul TUO conto Stripe. Non tocchiamo mai i tuoi soldi. L'unica trattenuta è il 2% automatico — 15 volte meno di JustEat. Trasparenza totale."
    },
    {
      q: "Perché pago solo il 2%?",
      a: "Perché non siamo un marketplace. Non abbiamo rider, non abbiamo pubblicità da pagare. Il nostro modello è semplice: tu paghi €1.997 una volta, noi prendiamo il 2% per mantenere l'infrastruttura, l'IA e gli aggiornamenti. Per sempre."
    },
    {
      q: "La fiscalità è sicura?",
      a: "Assolutamente. Le tue chiavi API fiscali sono criptate con standard bancario AES-256 nel Vault privato. Nessuno può vederle, nemmeno il nostro team. L'agente AI-Mary valida la connessione e mostra solo lo stato operativo (semaforo Verde/Rosso)."
    },
    {
      q: "Cosa succede ai miei clienti di JustEat?",
      a: "Li recuperi. Con il QR Code sui tavoli e il tuo link diretto, i clienti ordinano dalla TUA app. Ogni ordine che sposti da JustEat a Empire ti fa risparmiare il 28% netto. Moltiplica per 1000 ordini/mese."
    },
  ];

  const scrollToPricing = () => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background overflow-x-hidden overflow-y-auto">
      {/* ====== STICKY NAV ====== */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-strong border-b border-border/30">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <Crown className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-lg text-foreground tracking-[0.15em] uppercase">Empire</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-xs font-medium tracking-[0.15em] uppercase">
            {navLinks.map((link) => (
              <a key={link.id} href={link.href}
                className={`transition-colors relative py-1 ${activeSection === link.id ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
                {link.label}
                {activeSection === link.id && (
                  <motion.span layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                )}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/r/impero-roma")}
              className="hidden md:inline-flex px-5 py-2 rounded-none border border-primary text-primary text-xs font-medium tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-colors">
              Demo Live
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-foreground" aria-label="Menu">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }} className="md:hidden overflow-hidden glass-strong border-t border-border/30">
              <div className="flex flex-col items-center gap-1 py-4">
                {navLinks.map((link) => (
                  <a key={link.id} href={link.href} onClick={() => setMobileMenuOpen(false)}
                    className={`w-full text-center py-3 text-sm font-medium tracking-[0.15em] uppercase transition-colors ${activeSection === link.id ? "text-primary bg-primary/5" : "text-muted-foreground"}`}>
                    {link.label}
                  </a>
                ))}
                <button onClick={() => { navigate("/r/impero-roma"); setMobileMenuOpen(false); }}
                  className="mt-2 mx-5 w-[calc(100%-2.5rem)] py-3 border border-primary text-primary text-sm font-medium tracking-widest uppercase">Demo Live</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ====== 1. HERO — HOOK ====== */}
      <section id="hero" className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <video src={demoVideo} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/90" />

        <div className="relative z-10 flex flex-col items-center text-center px-5 max-w-3xl">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }} className="flex flex-col items-center">
            <Crown className="w-12 h-12 text-primary mb-4 drop-shadow-[0_0_30px_hsla(38,75%,55%,0.5)]" />
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold text-foreground leading-[1.1]">
              Riprenditi il tuo{" "}
              <span className="text-gold-gradient">Impero</span>.{" "}
              Zero Commissioni.
            </h1>
          </motion.div>

          <motion.p className="mt-6 text-base sm:text-lg text-foreground/70 max-w-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            L'unico Asset Digitale di Proprietà con controllo fiscale centralizzato. 
            <strong className="text-foreground"> Una volta. Per sempre.</strong>
          </motion.p>

          <motion.div className="mt-8 flex flex-col sm:flex-row items-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <motion.button onClick={scrollToPricing}
              className="px-10 py-4 bg-primary text-primary-foreground font-semibold text-sm tracking-widest uppercase gold-glow"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Inizia il tuo Impero Ora
            </motion.button>
            <button onClick={() => navigate("/r/impero-roma")}
              className="px-10 py-4 border-2 border-foreground/20 text-foreground text-sm tracking-widest uppercase hover:border-primary hover:text-primary transition-colors">
              Demo Live
            </button>
          </motion.div>

          <motion.div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-foreground/50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            <span>🔒 Vault criptato AES-256</span>
            <span>⚡ Setup in 60 secondi</span>
            <span>♾️ Zero canoni</span>
          </motion.div>
        </div>

        <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ArrowDown className="w-5 h-5 text-primary/50" />
        </motion.div>
      </section>

      {/* ====== 2. AGITAZIONE — IL PROBLEMA ====== */}
      <section id="pain" className="py-20 px-5">
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-xs tracking-[0.3em] uppercase text-accent font-medium">Il problema</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground">
              Ogni mese, <span className="text-accent">regali migliaia di euro</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
              Le piattaforme di delivery si prendono il 30% di ogni ordine. Non è una commissione, è una perdita sistematica dei tuoi margini.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[
              { icon: <Banknote className="w-8 h-8" />, amount: "€7.500", label: "Margini erosi ogni mese", sub: "su 1000 ordini a €25", color: "text-accent" },
              { icon: <DollarSign className="w-8 h-8" />, amount: "€90.000", label: "Capitale disperso ogni anno", sub: "rendita che alimenta i competitor", color: "text-accent" },
              { icon: <Target className="w-8 h-8" />, amount: "€0", label: "Proprietà sui tuoi clienti", sub: "il marketplace possiede i tuoi dati", color: "text-accent" },
            ].map((item, i) => (
              <motion.div key={i} className="p-6 rounded-2xl bg-card border border-border text-center"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mx-auto mb-3">{item.icon}</div>
                <p className={`text-3xl font-display font-bold ${item.color}`}>{item.amount}</p>
                <p className="text-sm font-medium text-foreground mt-1">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
              </motion.div>
            ))}
          </div>

          <motion.div className="text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="text-lg text-muted-foreground">E se potessi trattenere <strong className="text-primary">il 98%</strong> dei tuoi margini?</p>
            <ArrowDown className="w-5 h-5 text-primary mx-auto mt-4 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* ====== 3. VISION — LA SOLUZIONE ====== */}
      <section id="vision" className="py-20 px-5 bg-card/30">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">La Soluzione</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground">
              L'unico Asset Digitale di Proprietà con{" "}
              <span className="text-gold-gradient">controllo fiscale centralizzato</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
              Una suite completa che ti libera dalle piattaforme, protegge i tuoi margini e automatizza la fiscalità.
            </p>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {[
            { value: 2, suffix: "%", label: "Fee totale" },
            { value: 0, prefix: "€", label: "Canone mensile" },
            { value: 60, suffix: "s", label: "Menu IA pronto" },
            { value: 98, suffix: "%", label: "Margini salvati" },
          ].map((s, i) => (
            <motion.div key={i} className="p-5 rounded-2xl bg-card border border-border text-center"
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <p className="text-3xl font-display font-bold text-primary">
                <AnimatedNumber value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ====== 4. FEATURES — CARD ANALITICHE ====== */}
      <section id="features" className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-14" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">L'Arsenale</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold text-foreground">
              Ogni funzione è un <span className="text-gold-gradient">vantaggio competitivo</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featureCards.map((feat, i) => (
              <motion.div key={i}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-500"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    {feat.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display text-lg font-bold text-foreground">{feat.title}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium tracking-wider">{feat.tag}</span>
                    </div>
                    <p className="text-sm font-semibold text-primary mb-2">💰 {feat.benefit}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== 5. ROI CALCULATOR ====== */}
      <section id="calculator" className="py-20 px-5 bg-card/30">
        <div className="max-w-2xl mx-auto">
          <motion.div className="text-center mb-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Calculator className="w-10 h-10 mx-auto text-primary mb-3" />
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              Calcola il tuo <span className="text-gold-gradient">risparmio reale</span>
            </h2>
            <p className="mt-3 text-muted-foreground">Muovi gli slider. Guarda la differenza sui tuoi margini.</p>
          </motion.div>

          <motion.div className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-6"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Ordini al mese</span>
                <span className="text-foreground font-semibold">{monthlyOrders}</span>
              </div>
              <input type="range" min="100" max="3000" step="50" value={monthlyOrders}
                onChange={(e) => setMonthlyOrders(Number(e.target.value))} className="w-full accent-primary h-2 rounded-full" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Scontrino medio</span>
                <span className="text-foreground font-semibold">€{avgOrder}</span>
              </div>
              <input type="range" min="10" max="80" step="5" value={avgOrder}
                onChange={(e) => setAvgOrder(Number(e.target.value))} className="w-full accent-primary h-2 rounded-full" />
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">💸 Marketplace (30%)</span>
                  <span className="text-accent font-display font-bold">-€{justEatCost.toLocaleString("it-IT", { maximumFractionDigits: 0 })}/mese</span>
                </div>
                <div className="h-8 rounded-lg bg-accent/20 overflow-hidden relative">
                  <motion.div className="h-full bg-accent/60 rounded-lg flex items-center justify-end pr-3"
                    initial={{ width: 0 }} animate={{ width: `${justEatBarWidth}%` }} transition={{ duration: 1, delay: 0.3 }}>
                    <span className="text-xs font-bold text-foreground">-30%</span>
                  </motion.div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">👑 Empire (2%)</span>
                  <span className="text-primary font-display font-bold">-€{empireCost.toLocaleString("it-IT", { maximumFractionDigits: 0 })}/mese</span>
                </div>
                <div className="h-8 rounded-lg bg-primary/10 overflow-hidden relative">
                  <motion.div className="h-full bg-primary/40 rounded-lg flex items-center justify-end pr-3"
                    initial={{ width: 0 }} animate={{ width: `${empireBarWidth}%` }} transition={{ duration: 1, delay: 0.5 }}>
                    <span className="text-xs font-bold text-foreground">-2%</span>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-foreground font-medium">Margini recuperati al mese</span>
                <span className="text-2xl font-display font-bold text-primary">
                  €{monthlySaving.toLocaleString("it-IT", { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground font-medium">Margini recuperati all'anno</span>
                <span className="text-2xl font-display font-bold text-gold-gradient">
                  €{yearSaving.toLocaleString("it-IT", { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-primary/20">
                <span className="text-muted-foreground text-sm">ROI completo in</span>
                <span className="text-foreground font-display font-bold">{roiMonths} {roiMonths === 1 ? "mese" : "mesi"}</span>
              </div>
            </div>

            <motion.button onClick={scrollToPricing}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base gold-glow"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              Inizia il tuo Impero Ora · €1.997
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ====== 6. PRICING ====== */}
      <section id="pricing" className="py-20 px-5">
        <div className="max-w-lg mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-xs font-medium text-primary mb-6">
              <Crown className="w-3 h-3" />
              Pagamento unico · Per sempre tuo
            </div>

            <h2 className="text-5xl sm:text-6xl font-display font-bold text-foreground">€1.997</h2>
            <p className="text-muted-foreground mt-1">+ IVA 22% · Una volta sola · Mai più canoni</p>

            <div className="mt-8 space-y-3 text-left">
              {[
                "L'unico Asset Digitale di Proprietà col TUO brand",
                "AI Menu Creator (OCR + foto food-porn automatiche)",
                "Centro di Controllo Admin completo",
                "Kitchen View real-time con notifiche sonore",
                "Vault Fiscale criptato AES-256 con AI-Mary",
                "Panic Mode — protezione margini istantanea",
                "Review Shield — solo 4-5★ su Google",
                "Checkout 1-Tap (Apple Pay / Google Pay)",
                "Assistenza dedicata e aggiornamenti a vita",
                "Controllo fiscale centralizzato 100% compliant",
              ].map((item, i) => (
                <motion.div key={i} className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>

            <motion.button className="mt-10 w-full py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-lg gold-glow tracking-wide"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              Inizia il tuo Impero Ora
            </motion.button>

            <p className="mt-4 text-xs text-muted-foreground">
              Dopo: <strong className="text-foreground">€0/mese</strong> · Solo 2% sulle transazioni
            </p>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span>🔒 Vault Criptato</span>
              <span>📞 Supporto incluso</span>
              <span>♾️ Per sempre</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== 7. FAQ ====== */}
      <section className="py-20 px-5 bg-card/30">
        <div className="max-w-2xl mx-auto">
          <motion.div className="text-center mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <HelpCircle className="w-10 h-10 mx-auto text-primary mb-3" />
            <h2 className="text-3xl font-display font-bold text-foreground">
              Domande? <span className="text-gold-gradient">Risposte.</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} className="rounded-2xl bg-card border border-border overflow-hidden"
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left">
                  <span className="text-sm font-semibold text-foreground pr-4">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}>
                      <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== 8. CTA FINALE ====== */}
      <section className="py-20 px-5">
        <div className="max-w-2xl mx-auto text-center">
          <Crown className="w-12 h-12 mx-auto text-primary mb-4" />
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Ogni giorno senza Empire,{" "}
            <span className="text-gold-gradient">regali margini</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            I tuoi competitor stanno costruendo il loro impero digitale. Tu stai ancora alimentando i marketplace.
          </p>
          <motion.button onClick={scrollToPricing}
            className="mt-8 px-10 py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-lg gold-glow"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            Inizia il tuo Impero Ora · €1.997
          </motion.button>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer id="contact" className="border-t border-border py-12 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-primary" />
                <span className="font-display font-bold text-foreground tracking-[0.1em] uppercase">Empire</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                L'unico Asset Digitale di Proprietà che libera i ristoratori dalle commissioni predatorie con controllo fiscale centralizzato.
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
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Risorse</p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <a href="#features" className="block hover:text-primary transition-colors">Arsenale Funzionalità</a>
                <a href="#calculator" className="block hover:text-primary transition-colors">Calcolatore ROI</a>
                <a href="#pricing" className="block hover:text-primary transition-colors">Investimento</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© 2026 Empire Restaurant Suite. Tutti i diritti riservati.</p>
            <p>P.IVA IT12345678901</p>
          </div>
        </div>
      </footer>

      {/* ====== STICKY CTA MOBILE ====== */}
      <motion.div className="fixed bottom-0 inset-x-0 z-40 p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] glass-strong border-t border-border/30 md:hidden"
        initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 2, type: "spring", damping: 25 }}>
        <motion.button onClick={scrollToPricing}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base tracking-wider gold-glow min-h-[48px]"
          whileTap={{ scale: 0.97 }}>
          👑 Inizia il tuo Impero Ora
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LandingPage;
