// ── Sector Visual Themes for Public Sites ──
// Each sector gets a unique luxury palette, typography mood, and default content

export interface SectorTheme {
  id: string;
  palette: {
    bg: string;        // Main background
    bgAlt: string;     // Alternate section bg
    accent: string;    // Primary accent HSL
    accentHex: string; // Hex for inline styles
    text: string;      // Main text color
    textMuted: string; // Muted text
    cardBg: string;    // Card background
    cardBorder: string;
    heroBg: string;    // Hero gradient
    heroOverlay: string;
  };
  fonts: {
    heading: string;   // Google Font family for headings
    body: string;      // Google Font family for body
  };
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    cta1: string;
    cta2: string;
  };
  services: { emoji: string; name: string; desc: string }[];
  whyUs: { title: string; desc: string }[];
  howItWorks: { step: string; title: string; desc: string }[];
  testimonials: { name: string; text: string; rating: number }[];
}

export const SECTOR_THEMES: Record<string, SectorTheme> = {
  beauty: {
    id: "beauty",
    palette: {
      bg: "#0A080C", bgAlt: "#12101A",
      accent: "330 70% 55%", accentHex: "#D946A8",
      text: "#FFFFFF", textMuted: "rgba(255,255,255,0.55)",
      cardBg: "rgba(217,70,168,0.06)", cardBorder: "rgba(217,70,168,0.15)",
      heroBg: "linear-gradient(135deg, #0A080C 0%, #1A0818 50%, #0A080C 100%)",
      heroOverlay: "rgba(217,70,168,0.05)",
    },
    fonts: { heading: "'Playfair Display', serif", body: "'Lato', sans-serif" },
    hero: {
      eyebrow: "Bellezza & Benessere",
      headline: "Il tuo momento di bellezza",
      subheadline: "Trattamenti esclusivi, professionisti certificati e un'esperienza di relax unica nel suo genere",
      cta1: "Prenota Appuntamento", cta2: "I Nostri Trattamenti",
    },
    services: [
      { emoji: "✂️", name: "Taglio & Piega", desc: "Styling personalizzato con i migliori prodotti" },
      { emoji: "🎨", name: "Colore & Meches", desc: "Colorazioni premium e tecniche avanzate" },
      { emoji: "✨", name: "Trattamenti Viso", desc: "Pulizia profonda e idratazione" },
      { emoji: "💅", name: "Manicure & Pedicure", desc: "Cura e bellezza delle unghie" },
      { emoji: "💆", name: "Massaggi Relax", desc: "Trattamenti corpo e benessere totale" },
      { emoji: "👁️", name: "Lash & Brow", desc: "Extension ciglia e design sopracciglia" },
    ],
    whyUs: [
      { title: "Team di Esperti", desc: "Professionisti con anni di esperienza nel settore beauty" },
      { title: "Prodotti Premium", desc: "Solo brand di alta qualità per risultati eccellenti" },
      { title: "Ambiente Esclusivo", desc: "Spazi eleganti progettati per il tuo relax" },
      { title: "Prenotazione Facile", desc: "Prenota online in pochi click, conferma immediata" },
    ],
    howItWorks: [
      { step: "01", title: "Scegli il trattamento", desc: "Sfoglia i nostri servizi e pacchetti" },
      { step: "02", title: "Prenota online", desc: "Seleziona data e orario che preferisci" },
      { step: "03", title: "Goditi l'esperienza", desc: "Rilassati e lasciati coccolare" },
    ],
    testimonials: [
      { name: "Giulia M.", text: "Il miglior salone della città! Professionalità e risultati top.", rating: 5 },
      { name: "Sara T.", text: "Ambiente fantastico, mi sento sempre come nuova uscendo da qui.", rating: 5 },
      { name: "Valentina R.", text: "Le extension ciglia sono perfette. Consiglio assolutamente!", rating: 5 },
    ],
  },

  beach: {
    id: "beach",
    palette: {
      bg: "#061820", bgAlt: "#0A2030",
      accent: "195 85% 50%", accentHex: "#0EA5E9",
      text: "#FFFFFF", textMuted: "rgba(255,255,255,0.55)",
      cardBg: "rgba(14,165,233,0.06)", cardBorder: "rgba(14,165,233,0.15)",
      heroBg: "linear-gradient(135deg, #061820 0%, #0A2838 50%, #061820 100%)",
      heroOverlay: "rgba(14,165,233,0.05)",
    },
    fonts: { heading: "'Playfair Display', serif", body: "'Lato', sans-serif" },
    hero: {
      eyebrow: "Sole, Mare & Relax",
      headline: "La tua oasi sul mare",
      subheadline: "Ombrelloni premium, servizio in spiaggia e un'esperienza balneare indimenticabile",
      cta1: "Prenota Ombrellone", cta2: "I Nostri Servizi",
    },
    services: [
      { emoji: "🏖️", name: "Ombrelloni Premium", desc: "Prima fila fronte mare con lettini luxury" },
      { emoji: "🍹", name: "Bar & Ristorante", desc: "Servizio al posto con cucina mediterranea" },
      { emoji: "🏊", name: "Area Piscina", desc: "Piscina con acqua di mare e idromassaggio" },
      { emoji: "👶", name: "Area Bambini", desc: "Parco giochi e animazione per i più piccoli" },
      { emoji: "🚿", name: "Servizi Premium", desc: "Spogliatoi, docce calde e cassette di sicurezza" },
      { emoji: "🎾", name: "Sport & Wellness", desc: "Beach volley, paddleboard, yoga al tramonto" },
    ],
    whyUs: [
      { title: "Posizione Privilegiata", desc: "Spiaggia privata con sabbia fine e acqua cristallina" },
      { title: "Comfort Premium", desc: "Lettini e ombrelloni distanziati per la tua privacy" },
      { title: "Cucina Fresca", desc: "Piatti di pesce e cocktail serviti direttamente al lettino" },
      { title: "WiFi & Servizi", desc: "Connessione veloce e servizi di alto livello inclusi" },
    ],
    howItWorks: [
      { step: "01", title: "Scegli posto e data", desc: "Mappa interattiva con disponibilità live" },
      { step: "02", title: "Prenota e paga", desc: "Conferma immediata e pagamento sicuro" },
      { step: "03", title: "Goditi la spiaggia", desc: "Il tuo posto ti aspetta, tutto pronto" },
    ],
    testimonials: [
      { name: "Marco & Lucia", text: "La miglior spiaggia della costa. Servizio impeccabile!", rating: 5 },
      { name: "Famiglia Rossi", text: "I bambini adorano l'area giochi. Torneremo sicuramente.", rating: 5 },
      { name: "Andrea P.", text: "Lettini comodissimi e cocktail fantastici. Paradiso!", rating: 5 },
    ],
  },

  plumber: {
    id: "plumber",
    palette: {
      bg: "#0A0E14", bgAlt: "#111820",
      accent: "210 70% 50%", accentHex: "#2563EB",
      text: "#FFFFFF", textMuted: "rgba(255,255,255,0.55)",
      cardBg: "rgba(37,99,235,0.06)", cardBorder: "rgba(37,99,235,0.15)",
      heroBg: "linear-gradient(135deg, #0A0E14 0%, #0A1828 50%, #0A0E14 100%)",
      heroOverlay: "rgba(37,99,235,0.05)",
    },
    fonts: { heading: "'Inter', sans-serif", body: "'Inter', sans-serif" },
    hero: {
      eyebrow: "Pronto Intervento Idraulico",
      headline: "Soluzioni rapide e garantite",
      subheadline: "Idraulico certificato, interventi in giornata e preventivi gratuiti per ogni emergenza",
      cta1: "Richiedi Intervento", cta2: "I Nostri Servizi",
    },
    services: [
      { emoji: "🔧", name: "Riparazioni", desc: "Perdite, guasti e malfunzionamenti" },
      { emoji: "🚿", name: "Installazioni", desc: "Sanitari, rubinetti, docce" },
      { emoji: "🔥", name: "Caldaie", desc: "Manutenzione e sostituzione" },
      { emoji: "🏠", name: "Impianti Idrici", desc: "Nuovi impianti e rifacimenti" },
      { emoji: "⚠️", name: "Pronto Intervento", desc: "Emergenze allagamento 24/7" },
      { emoji: "📋", name: "Certificazioni", desc: "Conformità e collaudo impianti" },
    ],
    whyUs: [
      { title: "Intervento Rapido", desc: "Arriviamo in giornata per le emergenze" },
      { title: "Preventivi Gratuiti", desc: "Nessun costo nascosto, prezzi trasparenti" },
      { title: "Garanzia Lavori", desc: "Tutti gli interventi sono garantiti" },
      { title: "Certificati", desc: "Professionisti abilitati e assicurati" },
    ],
    howItWorks: [
      { step: "01", title: "Descrivi il problema", desc: "Compila il form o chiamaci" },
      { step: "02", title: "Ricevi preventivo", desc: "Gratuito e senza impegno" },
      { step: "03", title: "Interveniamo", desc: "Risolviamo il problema rapidamente" },
    ],
    testimonials: [
      { name: "Giuseppe L.", text: "Intervenuti in 2 ore per una perdita. Professionali!", rating: 5 },
      { name: "Maria C.", text: "Caldaia riparata perfettamente. Prezzi onesti.", rating: 5 },
      { name: "Paolo R.", text: "Impianto bagno rifatto in 3 giorni. Impeccabili.", rating: 5 },
    ],
  },

  electrician: {
    id: "electrician",
    palette: {
      bg: "#0A0A0A", bgAlt: "#111111",
      accent: "45 95% 50%", accentHex: "#F59E0B",
      text: "#FFFFFF", textMuted: "rgba(255,255,255,0.55)",
      cardBg: "rgba(245,158,11,0.06)", cardBorder: "rgba(245,158,11,0.15)",
      heroBg: "linear-gradient(135deg, #0A0A0A 0%, #1A1500 50%, #0A0A0A 100%)",
      heroOverlay: "rgba(245,158,11,0.05)",
    },
    fonts: { heading: "'Inter', sans-serif", body: "'Inter', sans-serif" },
    hero: {
      eyebrow: "Impianti Elettrici Certificati",
      headline: "Energia sicura per la tua casa",
      subheadline: "Elettricista qualificato per impianti, messe a norma, domotica e certificazioni",
      cta1: "Richiedi Preventivo", cta2: "I Nostri Servizi",
    },
    services: [
      { emoji: "⚡", name: "Impianti Elettrici", desc: "Installazione e messa a norma" },
      { emoji: "💡", name: "Illuminazione", desc: "LED, faretti, design luminoso" },
      { emoji: "🔌", name: "Quadri Elettrici", desc: "Progettazione e installazione" },
      { emoji: "🏠", name: "Domotica", desc: "Casa intelligente e automazioni" },
      { emoji: "📋", name: "Certificazioni", desc: "Dichiarazioni di conformità" },
      { emoji: "⚠️", name: "Emergenze", desc: "Intervento rapido per guasti" },
    ],
    whyUs: [
      { title: "Certificati", desc: "Abilitati per rilascio DiCo" },
      { title: "Prezzi Chiari", desc: "Preventivi dettagliati e trasparenti" },
      { title: "Tecnologia", desc: "Soluzioni smart e risparmio energetico" },
      { title: "Garanzia", desc: "Lavori garantiti e assicurati" },
    ],
    howItWorks: [
      { step: "01", title: "Sopralluogo", desc: "Valutiamo l'intervento necessario" },
      { step: "02", title: "Preventivo", desc: "Dettagliato e senza sorprese" },
      { step: "03", title: "Realizziamo", desc: "Lavoro a regola d'arte" },
    ],
    testimonials: [
      { name: "Andrea F.", text: "Impianto rifatto completamente. Lavoro perfetto!", rating: 5 },
      { name: "Laura M.", text: "Domotica installata in casa. Cambiata la vita!", rating: 5 },
      { name: "Roberto S.", text: "Certificazione ottenuta subito. Molto professionali.", rating: 5 },
    ],
  },

  hotel: {
    id: "hotel",
    palette: {
      bg: "#0F0A14", bgAlt: "#15101A",
      accent: "40 60% 45%", accentHex: "#C8A951",
      text: "#FFFFFF", textMuted: "rgba(255,255,255,0.5)",
      cardBg: "rgba(200,169,81,0.06)", cardBorder: "rgba(200,169,81,0.15)",
      heroBg: "linear-gradient(135deg, #0F0A14 0%, #1A1020 50%, #0F0A14 100%)",
      heroOverlay: "rgba(200,169,81,0.04)",
    },
    fonts: { heading: "'Libre Baskerville', serif", body: "'Lato', sans-serif" },
    hero: {
      eyebrow: "Ospitalità d'Eccellenza",
      headline: "Il lusso che meriti",
      subheadline: "Camere esclusive, servizio 5 stelle e un'esperienza di soggiorno indimenticabile",
      cta1: "Prenota Camera", cta2: "Le Nostre Camere",
    },
    services: [
      { emoji: "🛏️", name: "Camere Suite", desc: "Comfort e design italiano" },
      { emoji: "🍽️", name: "Ristorante", desc: "Cucina gourmet con chef stellato" },
      { emoji: "🧖", name: "SPA & Wellness", desc: "Centro benessere completo" },
      { emoji: "🏊", name: "Piscina", desc: "Vista panoramica mozzafiato" },
      { emoji: "🅿️", name: "Parcheggio", desc: "Custodito e gratuito" },
      { emoji: "📶", name: "WiFi Premium", desc: "Connessione ultraveloce ovunque" },
    ],
    whyUs: [
      { title: "Posizione Unica", desc: "Nel cuore della città o fronte mare" },
      { title: "Servizio 24/7", desc: "Concierge e room service sempre disponibili" },
      { title: "Colazione Gourmet", desc: "Buffet con eccellenze locali e internazionali" },
      { title: "Esperienza Unica", desc: "Ogni soggiorno è curato nei minimi dettagli" },
    ],
    howItWorks: [
      { step: "01", title: "Scegli le date", desc: "Check-in e check-out flessibili" },
      { step: "02", title: "Seleziona la camera", desc: "Suite, deluxe, superior" },
      { step: "03", title: "Conferma online", desc: "Pagamento sicuro e conferma immediata" },
    ],
    testimonials: [
      { name: "Thomas W.", text: "Best hotel experience in Italy! Amazing staff.", rating: 5 },
      { name: "Giulia S.", text: "Camera stupenda con vista mare. Torneremo!", rating: 5 },
      { name: "Pierre D.", text: "Service impeccable, cuisine délicieuse.", rating: 5 },
    ],
  },
  healthcare: {
    id: "healthcare",
    palette: {
      bg: "#FAFFFE", bgAlt: "#F0FAFA",
      accent: "160 60% 40%", accentHex: "#00B4A0",
      text: "#1A1A2E", textMuted: "#5A6B7A",
      cardBg: "rgba(0,180,160,0.04)", cardBorder: "rgba(0,180,160,0.12)",
      heroBg: "linear-gradient(135deg, #F0FAFA 0%, #E0F7F5 50%, #FAFFFE 100%)",
      heroOverlay: "rgba(26,74,122,0.03)",
    },
    fonts: { heading: "'Nunito', sans-serif", body: "'Open Sans', sans-serif" },
    hero: {
      eyebrow: "Il tuo benessere, la nostra missione",
      headline: "Cura professionale, tecnologia moderna",
      subheadline: "Prenota la tua visita in pochi click e affida la tua salute a professionisti qualificati",
      cta1: "Prenota Visita", cta2: "I Nostri Servizi",
    },
    services: [
      { emoji: "🩺", name: "Visite Specialistiche", desc: "Consulti con medici esperti" },
      { emoji: "🦷", name: "Odontoiatria", desc: "Igiene e cura dentale" },
      { emoji: "💆", name: "Fisioterapia", desc: "Riabilitazione e benessere" },
      { emoji: "🧪", name: "Analisi Cliniche", desc: "Esami di laboratorio" },
      { emoji: "👁️", name: "Oculistica", desc: "Controllo della vista" },
      { emoji: "❤️", name: "Cardiologia", desc: "Salute del cuore" },
    ],
    whyUs: [
      { title: "Personale Qualificato", desc: "Medici e specialisti con anni di esperienza" },
      { title: "Tecnologia Avanzata", desc: "Strumentazione diagnostica di ultima generazione" },
      { title: "Privacy Garantita", desc: "Dati protetti secondo normativa GDPR" },
      { title: "Orari Flessibili", desc: "Appuntamenti anche in orari serali e weekend" },
    ],
    howItWorks: [
      { step: "01", title: "Scegli la specializzazione", desc: "Seleziona il tipo di visita" },
      { step: "02", title: "Prenota online", desc: "Scegli data e orario disponibile" },
      { step: "03", title: "Ricevi conferma", desc: "Conferma via WhatsApp o email" },
    ],
    testimonials: [
      { name: "Maria R.", text: "Professionali e puntuali. Ambiente moderno e accogliente.", rating: 5 },
      { name: "Giuseppe L.", text: "Finalmente uno studio medico che rispetta gli orari!", rating: 5 },
      { name: "Anna T.", text: "Personale gentilissimo, mi sono sentita subito a mio agio.", rating: 4 },
    ],
  },

  fitness: {
    id: "fitness",
    palette: {
      bg: "#0A0A0A", bgAlt: "#111111",
      accent: "24 100% 50%", accentHex: "#FF6B00",
      text: "#FFFFFF", textMuted: "rgba(255,255,255,0.55)",
      cardBg: "rgba(255,107,0,0.06)", cardBorder: "rgba(255,107,0,0.15)",
      heroBg: "linear-gradient(135deg, #0A0A0A 0%, #1A1000 50%, #0A0A0A 100%)",
      heroOverlay: "rgba(255,107,0,0.05)",
    },
    fonts: { heading: "'Oswald', sans-serif", body: "'Roboto', sans-serif" },
    hero: {
      eyebrow: "Trasforma il tuo corpo",
      headline: "Allenati con i migliori",
      subheadline: "Corsi, personal training e attrezzature all'avanguardia per raggiungere i tuoi obiettivi",
      cta1: "Iscriviti Ora", cta2: "I Nostri Corsi",
    },
    services: [
      { emoji: "🏋️", name: "Sala Pesi", desc: "Attrezzature professionali" },
      { emoji: "🧘", name: "Yoga & Pilates", desc: "Flessibilità e relax" },
      { emoji: "🥊", name: "Boxe & MMA", desc: "Allenamento funzionale" },
      { emoji: "🏃", name: "Cardio Zone", desc: "Tapis roulant e cyclette" },
      { emoji: "💪", name: "Personal Training", desc: "Sessioni 1-to-1" },
      { emoji: "🤸", name: "CrossFit", desc: "Allenamento ad alta intensità" },
    ],
    whyUs: [
      { title: "500+ Iscritti Attivi", desc: "Una community motivata e in crescita" },
      { title: "Trainer Certificati", desc: "Istruttori con certificazioni internazionali" },
      { title: "20+ Corsi Settimanali", desc: "Un programma vario per ogni esigenza" },
      { title: "Aperto 6-23", desc: "Allenati quando vuoi, senza limiti" },
    ],
    howItWorks: [
      { step: "01", title: "Scegli il tuo piano", desc: "Mensile, trimestrale o annuale" },
      { step: "02", title: "Prenota una lezione", desc: "Dall'app o dal sito" },
      { step: "03", title: "Inizia ad allenarti", desc: "Check-in con QR code" },
    ],
    testimonials: [
      { name: "Marco P.", text: "Ho perso 15kg in 6 mesi. Trainer fantastici!", rating: 5 },
      { name: "Sofia B.", text: "Ambiente motivante e struttura pulitissima.", rating: 5 },
      { name: "Luca D.", text: "Corsi di CrossFit eccezionali, li consiglio!", rating: 5 },
    ],
  },

  retail: {
    id: "retail",
    palette: {
      bg: "#FAFAFA", bgAlt: "#F5F5F5",
      accent: "0 0% 10%", accentHex: "#1A1A1A",
      text: "#1A1A1A", textMuted: "#6B6B6B",
      cardBg: "rgba(0,0,0,0.02)", cardBorder: "rgba(0,0,0,0.08)",
      heroBg: "linear-gradient(135deg, #FAFAFA 0%, #F0F0F0 50%, #FAFAFA 100%)",
      heroOverlay: "rgba(0,0,0,0.02)",
    },
    fonts: { heading: "'DM Sans', sans-serif", body: "'Inter', sans-serif" },
    hero: {
      eyebrow: "Shopping Experience",
      headline: "Scopri le nostre collezioni",
      subheadline: "Prodotti selezionati con cura per offrirti il meglio della qualità",
      cta1: "Scopri i Prodotti", cta2: "Novità",
    },
    services: [
      { emoji: "👗", name: "Abbigliamento", desc: "Moda donna e uomo" },
      { emoji: "👜", name: "Accessori", desc: "Borse, cinture, gioielli" },
      { emoji: "👟", name: "Calzature", desc: "Scarpe per ogni occasione" },
      { emoji: "🎁", name: "Idee Regalo", desc: "Confezioni personalizzate" },
      { emoji: "🏷️", name: "Promozioni", desc: "Offerte e saldi esclusivi" },
      { emoji: "🚚", name: "Consegna", desc: "Spedizione gratuita sopra €50" },
    ],
    whyUs: [
      { title: "Qualità Garantita", desc: "Solo brand selezionati e certificati" },
      { title: "Reso Facile", desc: "14 giorni per il reso gratuito" },
      { title: "Assistenza Dedicata", desc: "Un team a tua disposizione" },
      { title: "Pagamenti Sicuri", desc: "Carte, PayPal e contrassegno" },
    ],
    howItWorks: [
      { step: "01", title: "Sfoglia il catalogo", desc: "Cerca per categoria o brand" },
      { step: "02", title: "Aggiungi al carrello", desc: "Scegli taglia e colore" },
      { step: "03", title: "Ricevi a casa", desc: "Consegna in 24-48h" },
    ],
    testimonials: [
      { name: "Elena M.", text: "Prodotti eccellenti, spedizione velocissima!", rating: 5 },
      { name: "Andrea G.", text: "Servizio clienti impeccabile.", rating: 5 },
      { name: "Francesca L.", text: "Qualità top, prezzi competitivi.", rating: 4 },
    ],
  },

  hospitality: {
    id: "hospitality",
    palette: {
      bg: "#0F0A14", bgAlt: "#15101A",
      accent: "340 50% 40%", accentHex: "#6B2D3E",
      text: "#FFFFFF", textMuted: "rgba(255,255,255,0.5)",
      cardBg: "rgba(200,169,81,0.06)", cardBorder: "rgba(200,169,81,0.15)",
      heroBg: "linear-gradient(135deg, #0F0A14 0%, #1A1020 50%, #0F0A14 100%)",
      heroOverlay: "rgba(200,169,81,0.04)",
    },
    fonts: { heading: "'Libre Baskerville', serif", body: "'Lato', sans-serif" },
    hero: {
      eyebrow: "Ospitalità d'eccellenza",
      headline: "Benvenuti nel lusso",
      subheadline: "Un'esperienza indimenticabile in ogni soggiorno, dal check-in alla partenza",
      cta1: "Prenota Camera", cta2: "Le Nostre Camere",
    },
    services: [
      { emoji: "🛏️", name: "Camere Suite", desc: "Comfort e stile italiano" },
      { emoji: "🍽️", name: "Ristorante", desc: "Cucina gourmet interna" },
      { emoji: "🧖", name: "SPA & Wellness", desc: "Relax totale" },
      { emoji: "🏊", name: "Piscina", desc: "Vista panoramica" },
      { emoji: "🅿️", name: "Parcheggio", desc: "Custodito e gratuito" },
      { emoji: "📶", name: "WiFi Premium", desc: "Connessione ultraveloce" },
    ],
    whyUs: [
      { title: "Posizione Strategica", desc: "Nel cuore della città" },
      { title: "Servizio 5 Stelle", desc: "Personale dedicato 24/7" },
      { title: "Colazione Gourmet", desc: "Buffet con prodotti locali" },
      { title: "Esperienza Unica", desc: "Ogni soggiorno è speciale" },
    ],
    howItWorks: [
      { step: "01", title: "Scegli le date", desc: "Check-in e check-out" },
      { step: "02", title: "Seleziona la camera", desc: "Suite, doppia, singola" },
      { step: "03", title: "Conferma e paga", desc: "Pagamento sicuro online" },
    ],
    testimonials: [
      { name: "Thomas W.", text: "Best hotel experience in Italy! Amazing staff.", rating: 5 },
      { name: "Giulia S.", text: "Camera stupenda con vista mare. Torneremo!", rating: 5 },
      { name: "Pierre D.", text: "Service impeccable, cuisine délicieuse.", rating: 5 },
    ],
  },

  education: {
    id: "education",
    palette: {
      bg: "#FAFAFE", bgAlt: "#F5F0FF",
      accent: "270 60% 50%", accentHex: "#5B2D8E",
      text: "#1A1A2E", textMuted: "#6B6B8A",
      cardBg: "rgba(91,45,142,0.04)", cardBorder: "rgba(91,45,142,0.12)",
      heroBg: "linear-gradient(135deg, #FAFAFE 0%, #F0E8FF 50%, #FAFAFE 100%)",
      heroOverlay: "rgba(91,45,142,0.03)",
    },
    fonts: { heading: "'Poppins', sans-serif", body: "'Inter', sans-serif" },
    hero: {
      eyebrow: "Impara, Cresci, Conquista",
      headline: "La formazione che fa la differenza",
      subheadline: "Corsi in aula e online con docenti esperti per accelerare la tua carriera",
      cta1: "Scopri i Corsi", cta2: "Contattaci",
    },
    services: [
      { emoji: "📚", name: "Corsi Online", desc: "Studia dove e quando vuoi" },
      { emoji: "🎓", name: "Certificazioni", desc: "Attestati riconosciuti" },
      { emoji: "👩‍🏫", name: "Lezioni Live", desc: "Classi interattive" },
      { emoji: "📝", name: "Tutoring", desc: "Supporto individuale" },
      { emoji: "🏆", name: "Workshop", desc: "Laboratori pratici" },
      { emoji: "🌍", name: "Lingue", desc: "Corsi di lingue straniere" },
    ],
    whyUs: [
      { title: "Docenti Esperti", desc: "Professionisti con esperienza reale" },
      { title: "Certificati Validi", desc: "Riconosciuti a livello nazionale" },
      { title: "Flessibilità Totale", desc: "Online, in aula o blended" },
      { title: "Community Attiva", desc: "Network di ex-studenti" },
    ],
    howItWorks: [
      { step: "01", title: "Scegli il corso", desc: "Sfoglia il catalogo formativo" },
      { step: "02", title: "Iscriviti online", desc: "Pochi click per confermare" },
      { step: "03", title: "Inizia a studiare", desc: "Accedi ai materiali subito" },
    ],
    testimonials: [
      { name: "Davide M.", text: "Corso eccellente, ho trovato lavoro in 3 mesi!", rating: 5 },
      { name: "Sara C.", text: "Docenti preparatissimi e disponibili.", rating: 5 },
      { name: "Luca R.", text: "La piattaforma online è intuitiva e completa.", rating: 4 },
    ],
  },

  events: {
    id: "events",
    palette: {
      bg: "#0A0A0A", bgAlt: "#110A10",
      accent: "330 70% 45%", accentHex: "#C2185B",
      text: "#FFFFFF", textMuted: "rgba(255,255,255,0.5)",
      cardBg: "rgba(194,24,91,0.06)", cardBorder: "rgba(194,24,91,0.15)",
      heroBg: "linear-gradient(135deg, #0A0A0A 0%, #1A0A15 50%, #0A0A0A 100%)",
      heroOverlay: "rgba(194,24,91,0.05)",
    },
    fonts: { heading: "'Playfair Display', serif", body: "'Lato', sans-serif" },
    hero: {
      eyebrow: "Creiamo emozioni",
      headline: "Eventi indimenticabili",
      subheadline: "Matrimoni, corporate events, feste private — ogni dettaglio curato alla perfezione",
      cta1: "Richiedi Preventivo", cta2: "I Nostri Lavori",
    },
    services: [
      { emoji: "💒", name: "Matrimoni", desc: "Il giorno perfetto" },
      { emoji: "🎉", name: "Feste Private", desc: "Compleanni e anniversari" },
      { emoji: "🏢", name: "Corporate Events", desc: "Conferenze e team building" },
      { emoji: "🎶", name: "Intrattenimento", desc: "DJ, band, artisti" },
      { emoji: "🍾", name: "Catering", desc: "Cucina gourmet per eventi" },
      { emoji: "📸", name: "Foto & Video", desc: "Servizio professionale" },
    ],
    whyUs: [
      { title: "Esperienza Decennale", desc: "Centinaia di eventi organizzati" },
      { title: "Team Dedicato", desc: "Un coordinatore personale" },
      { title: "Location Esclusive", desc: "Partner con le migliori venue" },
      { title: "Budget Flessibile", desc: "Soluzioni per ogni budget" },
    ],
    howItWorks: [
      { step: "01", title: "Raccontaci il tuo evento", desc: "Descrivi la tua visione" },
      { step: "02", title: "Ricevi la proposta", desc: "Progetto su misura e preventivo" },
      { step: "03", title: "Goditi il momento", desc: "Noi ci occupiamo di tutto" },
    ],
    testimonials: [
      { name: "Valentina & Marco", text: "Il matrimonio dei sogni, grazie a loro!", rating: 5 },
      { name: "Azienda XYZ", text: "Team building perfetto, tutti entusiasti.", rating: 5 },
      { name: "Famiglia Rossi", text: "Festa dei 50 anni indimenticabile.", rating: 5 },
    ],
  },

  // Fallback for all other sectors
  default: {
    id: "default",
    palette: {
      bg: "#0A0A0A", bgAlt: "#111111",
      accent: "250 70% 55%", accentHex: "#6C3AED",
      text: "#FFFFFF", textMuted: "rgba(255,255,255,0.5)",
      cardBg: "rgba(108,58,237,0.06)", cardBorder: "rgba(108,58,237,0.15)",
      heroBg: "linear-gradient(135deg, #0A0A0A 0%, #0A0A1A 50%, #0A0A0A 100%)",
      heroOverlay: "rgba(108,58,237,0.04)",
    },
    fonts: { heading: "'Inter', sans-serif", body: "'Inter', sans-serif" },
    hero: {
      eyebrow: "Professionalità e qualità",
      headline: "Al tuo servizio",
      subheadline: "Soluzioni professionali su misura per ogni tua esigenza",
      cta1: "Contattaci", cta2: "I Nostri Servizi",
    },
    services: [
      { emoji: "⭐", name: "Servizio Premium", desc: "Qualità garantita" },
      { emoji: "🤝", name: "Consulenza", desc: "Supporto personalizzato" },
      { emoji: "📋", name: "Preventivi", desc: "Gratuiti e senza impegno" },
      { emoji: "🔧", name: "Assistenza", desc: "Supporto post-servizio" },
      { emoji: "📅", name: "Prenotazioni", desc: "Facili e veloci" },
      { emoji: "✅", name: "Garanzia", desc: "Soddisfazione assicurata" },
    ],
    whyUs: [
      { title: "Esperienza", desc: "Anni di professionalità comprovata" },
      { title: "Qualità", desc: "Standard elevati su ogni progetto" },
      { title: "Affidabilità", desc: "Tempi rispettati, sempre" },
      { title: "Prezzo Giusto", desc: "Trasparenza e competitività" },
    ],
    howItWorks: [
      { step: "01", title: "Contattaci", desc: "Descrivi di cosa hai bisogno" },
      { step: "02", title: "Ricevi proposta", desc: "Preventivo personalizzato" },
      { step: "03", title: "Iniziamo", desc: "Lavoriamo insieme al progetto" },
    ],
    testimonials: [
      { name: "Cliente Soddisfatto", text: "Servizio eccellente, lo consiglio!", rating: 5 },
      { name: "Azienda Partner", text: "Collaborazione perfetta e risultati concreti.", rating: 5 },
      { name: "Privato", text: "Puntuali, professionali e competenti.", rating: 4 },
    ],
  },
};

// Additional sector overrides (merged with default)
const ADDITIONAL_PALETTES: Record<string, Partial<SectorTheme["palette"]>> = {
  legal: { accent: "220 50% 30%", accentHex: "#1C2B4A", bg: "#FAFAFA", bgAlt: "#F5F5F0", text: "#1A1A2E", textMuted: "#5A5A6A", cardBg: "rgba(28,43,74,0.04)", cardBorder: "rgba(28,43,74,0.12)", heroBg: "linear-gradient(135deg, #FAFAFA 0%, #F0F0EA 50%, #FAFAFA 100%)", heroOverlay: "rgba(28,43,74,0.03)" },
  accounting: { accent: "155 50% 35%", accentHex: "#1D6B4A", bg: "#FAFFFE", bgAlt: "#F0FAF5", text: "#1A2E1A", textMuted: "#5A6B5A", cardBg: "rgba(29,107,74,0.04)", cardBorder: "rgba(29,107,74,0.12)", heroBg: "linear-gradient(135deg, #FAFFFE 0%, #E8F5E9 50%, #FAFFFE 100%)", heroOverlay: "rgba(29,107,74,0.03)" },
  photography: { accent: "20 60% 45%", accentHex: "#B87333", bg: "#0A0A0A", bgAlt: "#111111", text: "#FFFFFF", textMuted: "rgba(255,255,255,0.5)", cardBg: "rgba(184,115,51,0.06)", cardBorder: "rgba(184,115,51,0.15)", heroBg: "linear-gradient(135deg, #0A0A0A 0%, #1A1008 50%, #0A0A0A 100%)", heroOverlay: "rgba(184,115,51,0.04)" },
  logistics: { accent: "24 80% 50%", accentHex: "#E67E22", bg: "#0A0A0A", bgAlt: "#111111", text: "#FFFFFF", textMuted: "rgba(255,255,255,0.5)", cardBg: "rgba(230,126,34,0.06)", cardBorder: "rgba(230,126,34,0.15)", heroBg: "linear-gradient(135deg, #0A0A0A 0%, #1A1000 50%, #0A0A0A 100%)", heroOverlay: "rgba(230,126,34,0.04)" },
  agriturismo: { accent: "90 50% 30%", accentHex: "#2D5A1B", bg: "#FAFFF5", bgAlt: "#F0F5E8", text: "#1A2E10", textMuted: "#5A6B4A", cardBg: "rgba(45,90,27,0.05)", cardBorder: "rgba(45,90,27,0.12)", heroBg: "linear-gradient(135deg, #FAFFF5 0%, #E8F0D8 50%, #FAFFF5 100%)", heroOverlay: "rgba(45,90,27,0.03)" },
  veterinary: { accent: "160 60% 45%", accentHex: "#10B981" },
  tattoo: { accent: "280 60% 50%", accentHex: "#8B5CF6", bg: "#0A0A0A", bgAlt: "#111111", text: "#FFFFFF", textMuted: "rgba(255,255,255,0.5)" },
  childcare: { accent: "200 70% 55%", accentHex: "#3B82F6", bg: "#FAFCFF", bgAlt: "#F0F5FF", text: "#1A1A2E", textMuted: "#5A6B7A" },
  construction: { accent: "24 80% 45%", accentHex: "#D97706", bg: "#0A0A0A", bgAlt: "#111111", text: "#FFFFFF", textMuted: "rgba(255,255,255,0.5)" },
  gardening: { accent: "120 50% 40%", accentHex: "#16A34A", bg: "#FAFFF5", bgAlt: "#F0FAE8", text: "#1A2E10", textMuted: "#5A6B4A" },
  garage: { accent: "0 70% 45%", accentHex: "#C0392B", bg: "#0A0A0A", bgAlt: "#111111", text: "#FFFFFF", textMuted: "rgba(255,255,255,0.5)" },
  custom: {},
};

// Industry aliases for theme lookup
const INDUSTRY_ALIASES: Record<string, string> = {
  hospitality: "hotel",
  cleaning: "plumber",
  garage: "plumber",
};

export function getSectorTheme(industry: string): SectorTheme {
  const resolved = INDUSTRY_ALIASES[industry] || industry;
  if (SECTOR_THEMES[resolved]) return SECTOR_THEMES[resolved];
  
  const overrides = ADDITIONAL_PALETTES[industry];
  const base = { ...SECTOR_THEMES.default };
  if (overrides) {
    base.palette = { ...base.palette, ...overrides };
  }
  return base;
}
