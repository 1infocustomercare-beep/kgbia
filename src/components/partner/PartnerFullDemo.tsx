import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronRight, ChevronLeft, Sparkles, Eye, AlertTriangle,
  Shield, ChefHat, Wallet, Smartphone, Bell, MapPin, Star,
  MessageCircle, QrCode, Brain, Lock, Maximize2, Minimize2
} from "lucide-react";

interface SalesStep {
  id: string;
  title: string;
  subtitle: string;
  script: string;
  objection: string;
  closer: string;
  icon: React.ReactNode;
  position: "top" | "center" | "bottom";
  emoji: string;
}

const salesSteps: SalesStep[] = [
  {
    id: "pwa",
    title: "La Tua App — Zero Commissioni",
    subtitle: "PWA White-Label installabile",
    script: "\"Questa è l'app del tuo ristorante. I clienti la installano dal browser, ordinano direttamente da te. Zero marketplace, zero 30% di commissioni.\"",
    objection: "\"Ma i clienti usano JustEat...\" → \"Guarda: con un QR sui tavoli, il 60% migra in 3 mesi. €3.200/mese risparmiati.\"",
    closer: "Fai scorrere il menu al ristoratore e mostra la qualità delle foto AI.",
    icon: <Smartphone className="w-5 h-5" />,
    position: "top",
    emoji: "📱",
  },
  {
    id: "menu-ai",
    title: "Menu Creato dall'IA in 60 Secondi",
    subtitle: "Foto professionali + testi automatici",
    script: "\"Scatta una foto del menu cartaceo. In 60 secondi l'IA genera il catalogo digitale con foto food-porn e descrizioni persuasive. Risparmi €2.000+ di fotografo.\"",
    objection: "\"Non ho tempo per queste cose\" → \"Ci metti letteralmente 1 minuto. Guarda, carico una foto e... fatto.\"",
    closer: "Mostra la sezione menù con le immagini professionali dei piatti.",
    icon: <Brain className="w-5 h-5" />,
    position: "center",
    emoji: "🤖",
  },
  {
    id: "ordering",
    title: "Ordini Diretti — Soldi sul TUO Conto",
    subtitle: "Stripe Connect integrato",
    script: "\"Il cliente ordina, paga, e i soldi arrivano direttamente sul tuo conto. Noi tratteniamo solo il 2% — 15 volte meno di JustEat.\"",
    objection: "\"Come funziona il pagamento?\" → \"Stripe, lo stesso di Amazon. Setup in 5 minuti, soldi sul conto in 2 giorni.\"",
    closer: "Fai aggiungere un piatto al carrello e mostra il flusso d'ordine.",
    icon: <Wallet className="w-5 h-5" />,
    position: "bottom",
    emoji: "💰",
  },
  {
    id: "notifications",
    title: "Push & Wallet — Riporta i Clienti",
    subtitle: "Notifiche + coupon digitali",
    script: "\"Vedi questa notifica? Un coupon -20% che arriva direttamente nel wallet del cliente. Zero costi pubblicitari, il 30% dei clienti persi ritorna.\"",
    objection: "\"Già faccio social media\" → \"I social ti costano tempo e soldi. Qui premi un pulsante e il coupon arriva nel telefono del cliente.\"",
    closer: "Mostra la sezione Wallet e l'opt-in notifiche nell'app.",
    icon: <Bell className="w-5 h-5" />,
    position: "center",
    emoji: "🔔",
  },
  {
    id: "kitchen",
    title: "Cucina Real-Time — Zero Errori",
    subtitle: "Kitchen View con notifiche sonore",
    script: "\"L'ordine arriva in cucina in 0.3 secondi con suono. Niente più foglietti, niente più errori. Lo staff vede tutto su tablet.\"",
    objection: "\"Il mio staff non è tecnologico\" → \"Se sa usare WhatsApp, sa usare questo. Un pulsante: Nuovo → In Preparazione → Pronto.\"",
    closer: "Fai un ordine dall'app e mostralo apparire nella Kitchen View.",
    icon: <ChefHat className="w-5 h-5" />,
    position: "top",
    emoji: "👨‍🍳",
  },
  {
    id: "reviews",
    title: "Review Shield™ — Solo 5 Stelle su Google",
    subtitle: "Filtro intelligente recensioni",
    script: "\"Le recensioni 1-3 stelle vanno nel tuo archivio privato. Solo le 4-5 stelle costruiscono la tua reputazione su Google. Il tuo rating sale automaticamente.\"",
    objection: "\"E se un cliente si lamenta?\" → \"Lo vedi nel tuo archivio privato e lo risolvi in privato. Su Google appari perfetto.\"",
    closer: "Mostra il rating 4.8★ nell'header dell'app.",
    icon: <Shield className="w-5 h-5" />,
    position: "center",
    emoji: "🛡️",
  },
  {
    id: "qr-tables",
    title: "QR Tavoli + Mappa Sala",
    subtitle: "Gestione tavoli drag-and-drop",
    script: "\"QR Code su ogni tavolo. Il cliente scansiona, ordina, paga. Tu risparmi un cameriere. E con la mappa sala vedi tutto in tempo reale.\"",
    objection: "\"I miei clienti preferiscono il cameriere\" → \"Il cameriere non sparisce. Ma per riordinare un'acqua non serve aspettare 10 minuti.\"",
    closer: "Mostra la mappa tavoli nell'Admin e il banner 'Tavolo X' nell'app cliente.",
    icon: <QrCode className="w-5 h-5" />,
    position: "bottom",
    emoji: "📲",
  },
  {
    id: "fiscal",
    title: "Vault Fiscale AES-256",
    subtitle: "Criptazione standard bancario",
    script: "\"Le tue chiavi fiscali criptate con lo stesso standard delle banche. Gennaio 2026 arriva. Con Empire sei già pronto e protetto.\"",
    objection: "\"Ho già il commercialista\" → \"Perfetto. Questo non sostituisce il commercialista, lo affianca. Tu sei protetto in automatico.\"",
    closer: "Mostra l'icona Vault verde nell'Admin che indica 'configurato e attivo'.",
    icon: <Lock className="w-5 h-5" />,
    position: "center",
    emoji: "🔐",
  },
  {
    id: "close",
    title: "Chiudi il Contratto",
    subtitle: "€2.997 una tantum — ROI in 1-2 mesi",
    script: "\"€2.997 una tantum o 3 rate da €1.099. Poi €0/mese per sempre. Solo il 2% sulle transazioni. Al tuo volume, il ROI arriva in meno di 2 mesi.\"",
    objection: "\"Devo pensarci\" → \"Capisco. Ma ogni mese che aspetti, perdi €3.000+ in commissioni marketplace. Ti blocco il prezzo per 48 ore?\"",
    closer: "🏆 Stretta di mano. Benvenuto nella famiglia Empire!",
    icon: <Star className="w-5 h-5" />,
    position: "center",
    emoji: "🏆",
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
  demoSlug?: string;
}

const PartnerFullDemo = ({ open, onClose, demoSlug = "impero-roma" }: Props) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showScript, setShowScript] = useState(true);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    if (open) {
      setCurrentStep(0);
      setShowScript(true);
      setMinimized(false);
    }
  }, [open]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  const goNext = () => {
    if (currentStep < salesSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const goPrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  if (!open) return null;

  const step = salesSteps[currentStep];
  const progress = ((currentStep + 1) / salesSteps.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex flex-col bg-background"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-card/90 backdrop-blur-xl border-b border-border/30 z-20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-vibrant-gradient flex items-center justify-center">
              <Eye className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground font-heading">Presentazione Vendita</p>
              <p className="text-[9px] text-muted-foreground">Step {currentStep + 1}/{salesSteps.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setMinimized(!minimized)}
              className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
              {minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-muted">
          <motion.div className="h-full bg-vibrant-gradient" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>

        {/* Restaurant iframe */}
        <div className="flex-1 relative overflow-hidden">
          <iframe
            src={`/r/${demoSlug}`}
            className="w-full h-full border-0"
            title="Demo Restaurant"
          />

          {/* Sales Script Overlay */}
          <AnimatePresence>
            {showScript && !minimized && (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`absolute left-3 right-3 z-30 ${
                  step.position === "top" ? "top-4" : step.position === "center" ? "top-1/4" : "bottom-20"
                }`}
              >
                <div className="rounded-2xl bg-card/95 backdrop-blur-xl border border-primary/30 shadow-[0_0_60px_-15px_hsl(var(--primary)/0.4)] overflow-hidden">
                  {/* Step header */}
                  <div className="px-4 pt-4 pb-3 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{step.emoji}</span>
                        <div>
                          <h3 className="text-sm font-bold text-foreground font-heading">{step.title}</h3>
                          <p className="text-[10px] text-muted-foreground">{step.subtitle}</p>
                        </div>
                      </div>
                      <button onClick={() => setShowScript(false)}
                        className="p-1 rounded-full hover:bg-secondary text-muted-foreground">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {/* Mini progress dots */}
                    <div className="flex gap-1">
                      {salesSteps.map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all ${
                          i === currentStep ? "w-5 bg-primary" : i < currentStep ? "w-2 bg-primary/50" : "w-2 bg-muted"
                        }`} />
                      ))}
                    </div>
                  </div>

                  {/* Script content */}
                  <div className="p-4 space-y-3">
                    {/* What to say */}
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-primary font-bold mb-1">💬 Cosa Dire</p>
                      <p className="text-xs text-foreground/90 leading-relaxed italic">{step.script}</p>
                    </div>

                    {/* Objection handling */}
                    <div className="p-2.5 rounded-xl bg-accent/5 border border-accent/15">
                      <p className="text-[9px] uppercase tracking-wider text-accent font-bold mb-1">🛡️ Se Obietta</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{step.objection}</p>
                    </div>

                    {/* Action hint */}
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-[10px] text-primary/80 font-medium">{step.closer}</p>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between px-4 py-3 border-t border-border/20">
                    <button onClick={goPrev} disabled={currentStep === 0}
                      className="flex items-center gap-1 text-xs text-muted-foreground disabled:opacity-30 hover:text-foreground transition-colors">
                      <ChevronLeft className="w-4 h-4" /> Indietro
                    </button>
                    <motion.button onClick={goNext}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-vibrant-gradient text-primary-foreground text-xs font-bold shadow-lg"
                      whileTap={{ scale: 0.95 }}>
                      {currentStep < salesSteps.length - 1 ? (
                        <>Prossimo Step <ChevronRight className="w-4 h-4" /></>
                      ) : (
                        <>Chiudi Contratto 🏆</>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Minimized floating button to reopen script */}
          {(!showScript || minimized) && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => { setShowScript(true); setMinimized(false); }}
              className="absolute bottom-6 right-4 z-30 w-12 h-12 rounded-full bg-vibrant-gradient text-primary-foreground shadow-xl flex items-center justify-center"
            >
              <Eye className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PartnerFullDemo;
