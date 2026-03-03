import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InfoGuide from "@/components/ui/info-guide";
import {
  QrCode, ShoppingCart, ChefHat, AlertTriangle, Wallet, Shield,
  Sparkles, Palette, Globe, Users, Star, Bell, MessageSquare,
  CalendarDays, MapPin, BarChart3, Lock, UserX, Key, Zap,
  Crown, Check, ChevronDown, ChevronUp, Smartphone, Monitor,
  TrendingUp, DollarSign, Clock, Eye, Gift, Heart, Camera,
  Layers, Bot, Languages, Printer
} from "lucide-react";

type Category = "revenue" | "operations" | "marketing" | "protection" | "tech";

interface Feature {
  icon: React.ReactNode;
  name: string;
  tagline: string;
  problem: string;
  solution: string;
  benefits: string[];
  stat?: string;
  statLabel?: string;
  category: Category;
}

const features: Feature[] = [
  // === REVENUE ===
  {
    icon: <QrCode className="w-5 h-5" />,
    name: "Menu Digitale con QR",
    tagline: "Ogni tavolo, un portale di vendita",
    problem: "I menu cartacei sono costosi da ristampare, non aggiornabili e non tracciano nulla. I clienti aspettano il cameriere per ordinare.",
    solution: "Ogni tavolo ha un QR unico che apre il menu digitale personalizzato. Il cliente scansiona, sfoglia il menu con foto professionali, sceglie, ordina e paga — tutto dal suo smartphone, senza scaricare app.",
    benefits: [
      "QR code unico per ogni tavolo con tracciamento automatico",
      "Menu con foto HD, descrizioni e allergeni visibili",
      "Ordini diretti senza attesa del cameriere",
      "Aggiornamenti in tempo reale (prezzi, disponibilità, piatti del giorno)",
      "Zero costi di stampa — risparmio €500+/anno",
    ],
    stat: "€500+",
    statLabel: "Risparmi stampa/anno",
    category: "revenue",
  },
  {
    icon: <ShoppingCart className="w-5 h-5" />,
    name: "Ordini Multi-Canale",
    tagline: "Tavolo, asporto e delivery in un unico flusso",
    problem: "Gestire ordini da fonti diverse (sala, telefono, app delivery) crea caos, errori e tempi morti. Le piattaforme prendono il 30% di commissione.",
    solution: "Empire centralizza tutti gli ordini — tavolo via QR, asporto tramite link diretto, delivery con indirizzo — in un'unica dashboard in tempo reale. Solo il 2% di fee silenzioso sulle transazioni, non il 30% dei marketplace.",
    benefits: [
      "Ordini da tavolo (QR), asporto (link/WhatsApp) e delivery",
      "Dashboard unificata per tutti i canali",
      "Notifiche istantanee con suono per ogni nuovo ordine",
      "Tracciamento dello stato: in attesa → in preparazione → pronto → consegnato",
      "Eliminazione errori di trascrizione telefonica",
    ],
    stat: "28%",
    statLabel: "Margine recuperato vs marketplace",
    category: "revenue",
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    name: "Panic Mode",
    tagline: "Prezzi aggiornati in 1 secondo",
    problem: "Il costo delle materie prime cambia ogni settimana. Con i menu cartacei, aggiorni i prezzi ogni 3-6 mesi perdendo margini ogni giorno.",
    solution: "Con uno slider, il ristoratore modifica TUTTI i prezzi del menu in tempo reale, applicando un aumento o sconto percentuale istantaneo. I clienti vedono subito i nuovi prezzi sul menu digitale.",
    benefits: [
      "Slider da -20% a +30% applicato a tutti i piatti",
      "Aggiornamento istantaneo visibile ai clienti",
      "Nessun menu da ristampare — mai più",
      "Protezione margini in tempo reale contro rincari fornitori",
      "Possibilità di promozioni flash (Happy Hour, Pranzo, ecc.)",
    ],
    stat: "1 sec",
    statLabel: "Per aggiornare tutti i prezzi",
    category: "revenue",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    name: "Upselling Intelligente",
    tagline: "Aumenta lo scontrino medio automaticamente",
    problem: "I camerieri dimenticano di proporre dessert, caffè o accompagnamenti. Lo scontrino medio resta basso senza suggerimenti mirati.",
    solution: "Il sistema suggerisce automaticamente abbinamenti intelligenti durante l'ordine. Se il cliente ordina un dolce, appare il suggerimento del caffè. Se ordina un primo, viene proposto il vino abbinato.",
    benefits: [
      "Suggerimenti automatici basati sul carrello",
      "Pop-up non invasivi con foto del piatto suggerito",
      "Aumento medio dello scontrino del 15-25%",
      "Zero sforzo dal personale — il sistema pensa per loro",
    ],
    stat: "+22%",
    statLabel: "Scontrino medio",
    category: "revenue",
  },

  // === OPERATIONS ===
  {
    icon: <ChefHat className="w-5 h-5" />,
    name: "Kitchen View",
    tagline: "La cucina vede tutto in tempo reale",
    problem: "Le comande cartacee si perdono, si macchiano, si sovrappongono. La cucina non sa quali ordini sono urgenti e il servizio rallenta.",
    solution: "Un display dedicato mostra tutti gli ordini in tempo reale con countdown, tipo ordine (tavolo/asporto/delivery), dettagli e stato. Lo chef tocca un pulsante per segnare 'In preparazione' o 'Pronto' — il ristoratore vede tutto dalla dashboard.",
    benefits: [
      "Visualizzazione ordini in tempo reale con countdown",
      "Distinzione visiva per tipo: Tavolo (blu), Asporto (arancione), Delivery (viola)",
      "Accesso protetto da PIN — solo staff autorizzato",
      "Nessun ordine perso o dimenticato",
      "Audio alert per nuovi ordini in arrivo",
    ],
    stat: "0",
    statLabel: "Ordini persi",
    category: "operations",
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    name: "Mappa Tavoli Interattiva",
    tagline: "Controlla ogni tavolo con un tocco",
    problem: "Il ristoratore non sa mai con certezza quali tavoli sono liberi, occupati o stanno chiamando. Coordinare la sala è stressante.",
    solution: "Una mappa visuale drag-and-drop mostra lo stato di ogni tavolo in tempo reale: verde (libero), rosso (occupato), arancione (sta chiamando). Un tocco per cambiare stato, generare il QR del tavolo o vedere l'ordine associato.",
    benefits: [
      "Mappa drag-and-drop personalizzabile",
      "3 stati: libero (verde), occupato (rosso), chiamata (arancione)",
      "QR code generabile per ogni tavolo",
      "Visualizzazione coperti e ordini attivi per tavolo",
      "Gestione sala intuitiva anche con 50+ tavoli",
    ],
    stat: "50+",
    statLabel: "Tavoli gestibili",
    category: "operations",
  },
  {
    icon: <CalendarDays className="w-5 h-5" />,
    name: "Prenotazioni Online",
    tagline: "Mai più prenotazioni perse al telefono",
    problem: "Le prenotazioni telefoniche si dimenticano, si sovrappongono e il ristoratore perde clienti. Nessun dato viene tracciato.",
    solution: "I clienti prenotano direttamente dall'app indicando data, ora, numero ospiti e note speciali. Il ristoratore vede tutto in un calendario dedicato con conferma/rifiuto in un tocco.",
    benefits: [
      "Form prenotazione integrato nell'app cliente",
      "Calendario con vista giornaliera e settimanale",
      "Conferma/rifiuto con un tocco",
      "Note speciali (allergie, compleanni, tavoli preferiti)",
      "Storico prenotazioni per ogni cliente",
    ],
    stat: "24/7",
    statLabel: "Prenotazioni attive",
    category: "operations",
  },
  {
    icon: <Key className="w-5 h-5" />,
    name: "PIN Cucina",
    tagline: "Accesso sicuro per lo staff",
    problem: "La Kitchen View è accessibile a chiunque conosca l'URL. Serve un sistema di protezione semplice ma efficace.",
    solution: "Il ristoratore crea PIN numerici per ogni membro dello staff. Ogni PIN può avere un'etichetta (es. 'Chef Marco', 'Cucina Sera') e una data di scadenza opzionale. Solo chi ha il PIN accede alla Kitchen View.",
    benefits: [
      "PIN numerici personalizzabili per ogni membro staff",
      "Etichette per identificare chi accede",
      "Scadenza opzionale per PIN temporanei (stagionali, tirocinanti)",
      "Generazione e revoca istantanea",
      "Log degli accessi per sicurezza",
    ],
    stat: "∞",
    statLabel: "PIN generabili",
    category: "operations",
  },

  // === MARKETING ===
  {
    icon: <Wallet className="w-5 h-5" />,
    name: "Wallet Push — Clienti Persi",
    tagline: "Recupera il 30% dei clienti inattivi",
    problem: "Il 70% dei clienti non torna dopo la prima visita. Il ristoratore non sa chi sono, quando sono venuti l'ultima volta, né come ricontattarli.",
    solution: "Empire traccia automaticamente ogni cliente (via telefono all'ordine). Dopo 30 giorni di inattività, il sistema li segnala come 'persi'. Con un tocco, il ristoratore invia uno sconto push diretto sul Wallet del telefono del cliente — senza pubblicità, senza intermediari.",
    benefits: [
      "Tracciamento automatico attività clienti",
      "Alert clienti inattivi dopo 30 giorni",
      "Sconto push diretto su Apple/Google Wallet",
      "Nessun costo pubblicitario — zero intermediari",
      "Tasso di recupero medio: 30% dei clienti persi",
      "Dashboard con storico ordini e spesa totale per cliente",
    ],
    stat: "30%",
    statLabel: "Clienti recuperati",
    category: "marketing",
  },
  {
    icon: <Bell className="w-5 h-5" />,
    name: "Notifiche Push",
    tagline: "Raggiungi i clienti senza social",
    problem: "I post su Instagram raggiungono solo il 5% dei follower. Le newsletter hanno tassi di apertura del 15%. Il ristoratore non ha un canale diretto.",
    solution: "I clienti che accettano le notifiche ricevono push diretti sul browser/telefono. Il ristoratore può inviare promozioni, eventi speciali o novità del menu a tutti i clienti opt-in con un messaggio mirato.",
    benefits: [
      "Push notification dirette su browser e mobile",
      "Opt-in volontario — nessuno spam",
      "Tasso apertura 60-90% (vs 15% email)",
      "Personalizzabili per occasione o segmento",
      "Zero costi di advertising",
    ],
    stat: "90%",
    statLabel: "Tasso apertura push",
    category: "marketing",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    name: "Chat Privata",
    tagline: "Comunicazione diretta con ogni cliente",
    problem: "I clienti usano Google reviews, TripAdvisor o social per lamentarsi pubblicamente. Non esiste un canale privato e diretto.",
    solution: "Una chat integrata nell'app permette al cliente di comunicare direttamente con il ristorante. Il ristoratore risponde dalla dashboard. Le conversazioni restano private e costruiscono un rapporto diretto.",
    benefits: [
      "Chat in tempo reale cliente ↔ ristorante",
      "Nessuna lamentela pubblica — tutto privato",
      "Storico conversazioni per ogni cliente",
      "Costruzione relazione e fidelizzazione",
      "Feedback immediato per migliorare il servizio",
    ],
    stat: "-80%",
    statLabel: "Reclami pubblici",
    category: "marketing",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    name: "Analytics & Tracciamento",
    tagline: "Sapere da dove arrivano i clienti",
    problem: "Il ristoratore non sa se i clienti arrivano da Instagram, Google Maps, passaparola o volantini. Marketing al buio.",
    solution: "Ogni ordine viene tracciato con la sorgente: QR tavolo, link diretto, Instagram, Google Maps, WhatsApp. Il ristoratore vede esattamente quali canali generano più ordini e fatturato.",
    benefits: [
      "Tracciamento sorgente per ogni ordine (UTM)",
      "Dashboard con breakdown canali",
      "Identificazione ROI di ogni canale marketing",
      "Report profitto giornaliero, settimanale, mensile",
      "Decisioni marketing basate su dati reali, non intuito",
    ],
    stat: "100%",
    statLabel: "Visibilità sorgenti",
    category: "marketing",
  },

  // === PROTECTION ===
  {
    icon: <Star className="w-5 h-5" />,
    name: "Review Shield",
    tagline: "Solo le recensioni migliori diventano pubbliche",
    problem: "Una recensione negativa su Google può costare migliaia di euro in clienti persi. Il ristoratore non può controllare cosa viene pubblicato.",
    solution: "Empire filtra automaticamente le recensioni: quelle con 4-5 stelle diventano pubbliche e visibili nel profilo. Quelle con 1-3 stelle restano PRIVATE — visibili solo al ristoratore nella dashboard, per migliorare il servizio senza danni alla reputazione.",
    benefits: [
      "Filtro automatico: ≥4★ = pubbliche, ≤3★ = private",
      "Protezione reputazione online automatica",
      "Feedback negativo visibile solo al ristoratore",
      "Rating pubblico sempre alto e affidabile",
      "Possibilità di contattare privatamente il cliente insoddisfatto",
    ],
    stat: "4.8★",
    statLabel: "Rating medio protetto",
    category: "protection",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    name: "AI-Mary — Fisco 2026",
    tagline: "Conformità fiscale automatica",
    problem: "Le normative fiscali 2026 per la ristorazione sono complesse. Errori = multe fino a €10.000. Il commercialista costa e non è in tempo reale.",
    solution: "AI-Mary monitora in tempo reale la conformità fiscale del ristorante. Un indicatore a semaforo (verde/giallo/rosso) mostra lo stato. Configurazione con provider certificati (Scontrino.it) e API key per connessione diretta.",
    benefits: [
      "Monitoraggio conformità fiscale in tempo reale",
      "Indicatore semaforo: verde (ok), giallo (attenzione), rosso (urgente)",
      "Integrazione con provider certificati",
      "Alert automatici prima delle scadenze",
      "Risparmio consulenza: fino a €2.000/anno",
    ],
    stat: "€10K",
    statLabel: "Multe evitate",
    category: "protection",
  },
  {
    icon: <UserX className="w-5 h-5" />,
    name: "Blacklist Clienti",
    tagline: "Proteggi il tuo locale da clienti problematici",
    problem: "Clienti che fanno no-show ripetuti, causano problemi o lasciano debiti. Il ristoratore non ha strumenti per gestirli.",
    solution: "Una blacklist interna permette di bloccare clienti per telefono. Quando un cliente in blacklist prova a ordinare o prenotare, il sistema lo segnala. Motivo del blocco e data sempre visibili.",
    benefits: [
      "Blocco per numero di telefono",
      "Motivo e data del blocco tracciati",
      "Segnalazione automatica ai tentativi di ordine/prenotazione",
      "Attivazione/disattivazione istantanea",
      "Protezione contro no-show e comportamenti problematici",
    ],
    stat: "0",
    statLabel: "No-show tollerati",
    category: "protection",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    name: "Crittografia AES-256",
    tagline: "I tuoi dati sono al sicuro come in banca",
    problem: "I dati dei clienti (telefoni, indirizzi, pagamenti) sono sensibili. Una violazione = multa GDPR + danno reputazionale.",
    solution: "Tutti i dati sono crittografati con standard bancario AES-256. Row Level Security (RLS) garantisce che ogni ristoratore veda SOLO i propri dati. Nessun altro ristoratore, nemmeno Empire, può accedere ai dati di un altro locale.",
    benefits: [
      "Crittografia AES-256 su tutti i dati",
      "Isolamento totale tra ristoranti (multi-tenant)",
      "Conformità GDPR automatica",
      "Nessun accesso cross-tenant possibile",
      "Privacy & Cookie Policy dinamiche per ogni ristorante",
    ],
    stat: "100%",
    statLabel: "GDPR compliant",
    category: "protection",
  },

  // === TECH ===
  {
    icon: <Palette className="w-5 h-5" />,
    name: "Design Studio",
    tagline: "Il tuo brand, non il nostro",
    problem: "Le app dei marketplace hanno tutte lo stesso aspetto. Il brand del ristorante si perde tra JustEat, Deliveroo e Glovo.",
    solution: "Design Studio permette personalizzazione totale: logo, colori primari, nome, tagline, indirizzo, orari. L'app assume l'identità visiva del ristorante — il cliente non vede mai 'Empire', vede solo il brand del locale.",
    benefits: [
      "Upload logo personalizzato",
      "Colore primario adattivo a tutto il tema",
      "Nome, tagline e contatti personalizzabili",
      "Orari di apertura configurabili per ogni giorno",
      "Anteprima live delle modifiche",
      "Il cliente vede SOLO il brand del ristorante",
    ],
    stat: "100%",
    statLabel: "White-label",
    category: "tech",
  },
  {
    icon: <Camera className="w-5 h-5" />,
    name: "AI Menu Creator",
    tagline: "Foto del menu cartaceo → menu digitale",
    problem: "Creare un menu digitale da zero richiede ore di data entry. Fotografare i piatti richiede un fotografo professionista.",
    solution: "Il ristoratore scatta una foto del suo menu cartaceo. L'AI estrae testi, prezzi e categorie via OCR, poi genera immagini food-porn iper-realistiche per ogni piatto. Editor 100% flessibile per modifiche.",
    benefits: [
      "OCR automatico da foto del menu cartaceo",
      "Generazione immagini AI food-porn per ogni piatto",
      "Estrazione automatica di nomi, prezzi, categorie",
      "Editor completo per modifiche post-generazione",
      "Da foto a menu digitale completo in 60 secondi",
    ],
    stat: "60s",
    statLabel: "Da foto a menu",
    category: "tech",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    name: "Traduzione AI Multi-Lingua",
    tagline: "Il tuo menu in tutte le lingue",
    problem: "I ristoranti turistici devono avere menu in inglese, tedesco, francese. Traduzioni manuali costano e hanno errori.",
    solution: "L'AI traduce automaticamente nomi e descrizioni dei piatti in tutte le lingue configurate. Il cliente vede il menu nella sua lingua preferita. Le traduzioni sono modificabili manualmente per perfezionarle.",
    benefits: [
      "Traduzione automatica AI di tutto il menu",
      "Supporto multilingua illimitato",
      "Traduzioni modificabili manualmente",
      "Rilevamento automatico lingua del browser del cliente",
      "Ideale per zone turistiche — aumento ordini stranieri",
    ],
    stat: "∞",
    statLabel: "Lingue supportate",
    category: "tech",
  },
  {
    icon: <Bot className="w-5 h-5" />,
    name: "Empire Assistant AI",
    tagline: "Supporto tecnico 24/7 integrato",
    problem: "Il ristoratore ha domande sulla piattaforma alle 23:00 quando il supporto è chiuso. Deve aspettare il giorno dopo per risolvere un problema.",
    solution: "Un chatbot AI integrato nella dashboard risponde a qualsiasi domanda sulla piattaforma 24/7. Conosce tutte le funzionalità, suggerisce best practice e accede ai dati reali del ristorante per risposte contestuali.",
    benefits: [
      "Disponibile 24 ore su 24, 7 giorni su 7",
      "Accesso ai dati reali del ristorante per risposte contestuali",
      "Conoscenza completa di tutte le funzionalità Empire",
      "Suggerimenti di marketing e gestione personalizzati",
      "Nessun costo aggiuntivo — incluso per sempre",
    ],
    stat: "24/7",
    statLabel: "Supporto disponibile",
    category: "tech",
  },
  {
    icon: <Smartphone className="w-5 h-5" />,
    name: "PWA — App senza App Store",
    tagline: "Installabile come un'app, senza passare dagli store",
    problem: "Pubblicare un'app su App Store costa $99/anno + 30% commissione Apple. Google Play prende il 15%. I tempi di approvazione sono lunghi.",
    solution: "Empire è una Progressive Web App: il cliente la 'installa' direttamente dal browser con un tocco. Funziona offline, invia notifiche push e ha un'icona sulla home — identica a un'app nativa, ma senza costi store.",
    benefits: [
      "Installabile dalla home del telefono con un tocco",
      "Zero costi App Store / Play Store",
      "Funziona offline per consultazione menu",
      "Notifiche push come un'app nativa",
      "Aggiornamenti istantanei senza approvazione store",
    ],
    stat: "€0",
    statLabel: "Costi store",
    category: "tech",
  },
];

const categoryConfig: Record<Category, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  revenue: { label: "💰 Fatturato", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", bgColor: "bg-emerald-400/10" },
  operations: { label: "⚙️ Operatività", icon: <Layers className="w-4 h-4" />, color: "text-sky-400", bgColor: "bg-sky-400/10" },
  marketing: { label: "📣 Marketing", icon: <TrendingUp className="w-4 h-4" />, color: "text-violet-400", bgColor: "bg-violet-400/10" },
  protection: { label: "🛡️ Protezione", icon: <Shield className="w-4 h-4" />, color: "text-amber-400", bgColor: "bg-amber-400/10" },
  tech: { label: "🚀 Tecnologia", icon: <Zap className="w-4 h-4" />, color: "text-primary", bgColor: "bg-primary/10" },
};

const PartnerSalesToolkit = () => {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const filteredFeatures = activeCategory === "all" ? features : features.filter(f => f.category === activeCategory);

  const toggleFeature = (name: string) => {
    setExpandedFeature(prev => prev === name ? null : name);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/15 via-card to-amber-500/10 border border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-5 h-5 text-primary" />
          <span className="text-xs font-medium text-primary tracking-wider uppercase">Sales Toolkit</span>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-bold text-foreground">Schede Vendita Empire</h2>
          <InfoGuide
            title="Sales Toolkit"
            description="21+ schede dettagliate per ogni funzionalità della piattaforma. Ogni scheda include benefici, vantaggi competitivi e dati per convincere il cliente."
            steps={[
              "Filtra per categoria per trovare la scheda giusta",
              "Tocca una scheda per espandere i dettagli",
              "Usa le 'Sales Pills' durante le presentazioni",
            ]}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {features.length} funzionalità dettagliate da mostrare al ristoratore. Tocca ogni scheda per espandere problema, soluzione e vantaggi.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { value: `${features.length}`, label: "Funzionalità", icon: <Sparkles className="w-3.5 h-3.5 text-primary" /> },
          { value: "€30K+", label: "Risparmio/anno", icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> },
          { value: "2%", label: "Unica fee", icon: <Heart className="w-3.5 h-3.5 text-accent" /> },
        ].map((s, i) => (
          <div key={i} className="p-3 rounded-xl bg-card border border-border/50 text-center">
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className="text-lg font-display font-bold text-foreground">{s.value}</p>
            <p className="text-[9px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setActiveCategory("all")}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all ${
            activeCategory === "all"
              ? "bg-foreground text-background"
              : "bg-card border border-border/50 text-muted-foreground"
          }`}
        >
          Tutte ({features.length})
        </button>
        {(Object.keys(categoryConfig) as Category[]).map(cat => {
          const conf = categoryConfig[cat];
          const count = features.filter(f => f.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? `${conf.bgColor} ${conf.color} border border-current/20`
                  : "bg-card border border-border/50 text-muted-foreground"
              }`}
            >
              {conf.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Feature Cards */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {filteredFeatures.map((feat, i) => {
            const isExpanded = expandedFeature === feat.name;
            const conf = categoryConfig[feat.category];

            return (
              <motion.div
                key={feat.name}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03 }}
                className={`rounded-xl border overflow-hidden transition-all ${
                  isExpanded ? "border-primary/30 bg-card" : "border-border/50 bg-card"
                }`}
              >
                {/* Header - Always visible */}
                <button
                  onClick={() => toggleFeature(feat.name)}
                  className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-foreground/[0.02] transition-colors"
                >
                  <div className={`w-9 h-9 rounded-xl ${conf.bgColor} flex items-center justify-center ${conf.color} flex-shrink-0`}>
                    {feat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold text-foreground truncate">{feat.name}</h3>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{feat.tagline}</p>
                  </div>
                  {feat.stat && (
                    <div className="text-right flex-shrink-0 mr-1">
                      <p className={`text-sm font-display font-bold ${conf.color}`}>{feat.stat}</p>
                      <p className="text-[8px] text-muted-foreground">{feat.statLabel}</p>
                    </div>
                  )}
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </motion.div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3.5 pb-4 space-y-3">
                        {/* Divider */}
                        <div className="h-px bg-border/50" />

                        {/* Problem */}
                        <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <AlertTriangle className="w-3 h-3 text-accent" />
                            <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Il Problema</span>
                          </div>
                          <p className="text-xs text-foreground/80 leading-relaxed">{feat.problem}</p>
                        </div>

                        {/* Solution */}
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Sparkles className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">La Soluzione Empire</span>
                          </div>
                          <p className="text-xs text-foreground/80 leading-relaxed">{feat.solution}</p>
                        </div>

                        {/* Benefits */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">Vantaggi Concreti</span>
                          </div>
                          <div className="space-y-1.5">
                            {feat.benefits.map((b, j) => (
                              <div key={j} className="flex items-start gap-2 text-[11px] text-foreground/70">
                                <Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span>{b}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Stat highlight */}
                        {feat.stat && (
                          <div className={`p-2.5 rounded-lg ${conf.bgColor} border border-current/10 flex items-center justify-center gap-3`}>
                            <span className={`text-2xl font-display font-bold ${conf.color}`}>{feat.stat}</span>
                            <span className="text-[10px] text-foreground/60 font-medium">{feat.statLabel}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-amber-500/5 border border-primary/10 text-center space-y-2">
        <p className="text-sm font-display font-bold text-foreground">
          Tutto questo per <span className="text-primary">€2.997</span> — una volta sola.
        </p>
        <p className="text-[10px] text-muted-foreground">
          Nessun canone mensile. Nessun vincolo. Aggiornamenti a vita. Solo 2% sulle transazioni.
        </p>
        <div className="flex items-center justify-center gap-4 pt-1">
          <div className="flex items-center gap-1 text-[10px] text-emerald-400">
            <Gift className="w-3 h-3" /> Tua commissione: €997
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PartnerSalesToolkit;
