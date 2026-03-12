// ── Demo Data for All Industry Sectors ──────────────────────────────
// Each sector has realistic Italian demo services, hero content, and booking config.

import type { IndustryId } from "@/config/industry-config";

export interface DemoService {
  name: string;
  description: string;
  price: number;
  duration?: string;
  category: string;
  popular?: boolean;
  emoji?: string;
}

export interface DemoReview {
  name: string;
  rating: number;
  comment: string;
}

export interface DemoIndustryData {
  companyName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  services: DemoService[];
  reviews: DemoReview[];
  address: string;
  city: string;
  phone: string;
  email: string;
  hours: { day: string; hours: string }[];
  bookingLabel: string;
  bookingFields: string[]; // which fields to show in the booking form
  ctaLabel: string;
  features: { icon: string; label: string; desc: string }[];
}

export const DEMO_INDUSTRY_DATA: Record<IndustryId, DemoIndustryData> = {
  food: {
    companyName: "Impero Roma",
    tagline: "L'arte della cucina italiana dal 1987",
    heroTitle: "Un'esperienza culinaria unica",
    heroSubtitle: "Scopri i sapori autentici della tradizione italiana",
    address: "Via del Corso 42, Roma",
    city: "Roma",
    phone: "+39 06 1234 5678",
    email: "info@impero-roma.it",
    bookingLabel: "Prenota un Tavolo",
    ctaLabel: "Vedi il Menu",
    bookingFields: ["name", "phone", "date", "time", "guests"],
    hours: [
      { day: "Lun - Ven", hours: "12:00 - 15:00 · 19:00 - 23:30" },
      { day: "Sabato", hours: "12:00 - 24:00" },
      { day: "Domenica", hours: "Chiuso" },
    ],
    services: [
      { name: "Bruschetta Classica", description: "Pomodoro, basilico, olio EVO", price: 8.5, category: "Antipasti", popular: true, emoji: "🍅" },
      { name: "Spaghetti Carbonara", description: "Guanciale, pecorino, uovo", price: 14, category: "Primi", popular: true, emoji: "🍝" },
      { name: "Pizza Margherita", description: "Mozzarella di bufala, pomodoro, basilico", price: 12, category: "Pizze", popular: true, emoji: "🍕" },
      { name: "Tagliata di Manzo", description: "Controfiletto alla griglia con rucola", price: 22, category: "Secondi", emoji: "🥩" },
      { name: "Tiramisù", description: "Mascarpone, caffè, cacao", price: 7, category: "Dolci", popular: true, emoji: "🍰" },
      { name: "Risotto ai Funghi", description: "Carnaroli mantecato con porcini", price: 16, category: "Primi", emoji: "🍄" },
    ],
    reviews: [
      { name: "Marco R.", rating: 5, comment: "Carbonara perfetta, ambiente stupendo!" },
      { name: "Sara T.", rating: 5, comment: "Servizio impeccabile, tornerò sicuramente." },
      { name: "Paolo V.", rating: 4, comment: "Ottima pizza, prezzi giusti." },
    ],
    features: [
      { icon: "ChefHat", label: "Chef Stellato", desc: "Cucina d'autore con prodotti selezionati" },
      { icon: "Wine", label: "Cantina Pregiata", desc: "Oltre 200 etichette italiane" },
      { icon: "Clock", label: "Servizio Rapido", desc: "Ordini dal tavolo con QR code" },
    ],
  },

  ncc: {
    companyName: "Royal Transfer Roma",
    tagline: "Viaggia con classe in tutta Italia",
    heroTitle: "Il tuo autista privato",
    heroSubtitle: "Trasferimenti di lusso, puntuali e sicuri",
    address: "Via Veneto 120, Roma",
    city: "Roma",
    phone: "+39 06 9876 5432",
    email: "info@royaltransfer.it",
    bookingLabel: "Prenota un Transfer",
    ctaLabel: "Vedi Tariffe",
    bookingFields: ["name", "phone", "pickup", "dropoff", "date", "passengers"],
    hours: [
      { day: "Tutti i giorni", hours: "24 ore su 24" },
    ],
    services: [
      { name: "Transfer Aeroporto Fiumicino", description: "Berlina di lusso, meet & greet incluso", price: 65, category: "Aeroporti", popular: true, emoji: "✈️" },
      { name: "Transfer Aeroporto Ciampino", description: "Servizio porta a porta", price: 55, category: "Aeroporti", emoji: "🛫" },
      { name: "Tour Roma Imperiale", description: "4 ore con autista, Colosseo e Fori", price: 250, category: "Tour", popular: true, emoji: "🏛️" },
      { name: "Transfer Napoli", description: "Berlina o minivan, autostrada inclusa", price: 320, category: "Interurbani", emoji: "🚗" },
      { name: "Servizio Matrimoni", description: "Auto d'epoca o berlina premium", price: 450, category: "Eventi", emoji: "💍" },
      { name: "Disposizione Oraria", description: "Autista dedicato, min. 3 ore", price: 60, duration: "/ora", category: "Business", emoji: "⏰" },
    ],
    reviews: [
      { name: "Giovanni L.", rating: 5, comment: "Puntualissimi, auto impeccabile." },
      { name: "Anna M.", rating: 5, comment: "Servizio perfetto per il nostro matrimonio." },
      { name: "Thomas W.", rating: 5, comment: "Best transfer service in Rome!" },
    ],
    features: [
      { icon: "Shield", label: "Autisti Certificati", desc: "Licenza NCC e assicurazione completa" },
      { icon: "Clock", label: "Sempre Puntuali", desc: "Monitoraggio voli in tempo reale" },
      { icon: "Star", label: "Flotta Premium", desc: "Mercedes, BMW, veicoli di lusso" },
    ],
  },

  beauty: {
    companyName: "Glow Beauty Studio",
    tagline: "Il tuo spazio di bellezza e benessere",
    heroTitle: "Riscopri la tua bellezza",
    heroSubtitle: "Trattamenti personalizzati con prodotti di alta qualità",
    address: "Corso Buenos Aires 18, Milano",
    city: "Milano",
    phone: "+39 02 1234 5678",
    email: "info@glowbeauty.it",
    bookingLabel: "Prenota un Appuntamento",
    ctaLabel: "Vedi Trattamenti",
    bookingFields: ["name", "phone", "service", "date", "time"],
    hours: [
      { day: "Mar - Sab", hours: "09:00 - 19:30" },
      { day: "Lunedì", hours: "Chiuso" },
      { day: "Domenica", hours: "Chiuso" },
    ],
    services: [
      { name: "Taglio Donna", description: "Consulenza, shampoo, taglio e piega", price: 45, duration: "60 min", category: "Capelli", popular: true, emoji: "✂️" },
      { name: "Colore + Piega", description: "Tinta professionale con prodotti biologici", price: 75, duration: "90 min", category: "Capelli", popular: true, emoji: "🎨" },
      { name: "Manicure Semipermanente", description: "Smalto gel con trattamento cuticole", price: 35, duration: "45 min", category: "Unghie", popular: true, emoji: "💅" },
      { name: "Trattamento Viso Anti-Age", description: "Pulizia profonda + siero + maschera", price: 85, duration: "75 min", category: "Viso", emoji: "✨" },
      { name: "Massaggio Rilassante", description: "Full body con oli essenziali", price: 70, duration: "60 min", category: "Corpo", emoji: "💆" },
      { name: "Ceretta Completa", description: "Gambe intere + inguine + ascelle", price: 50, duration: "45 min", category: "Corpo", emoji: "🌸" },
    ],
    reviews: [
      { name: "Giulia B.", rating: 5, comment: "Il miglior salone di Milano! Ambiente curatissimo." },
      { name: "Francesca L.", rating: 5, comment: "Finalmente ho trovato chi capisce i miei capelli." },
      { name: "Elena R.", rating: 4, comment: "Ottimi trattamenti viso, tornerò!" },
    ],
    features: [
      { icon: "Sparkles", label: "Prodotti Bio", desc: "Solo prodotti certificati e naturali" },
      { icon: "Clock", label: "Zero Attesa", desc: "Prenota online, niente coda" },
      { icon: "Heart", label: "Esperienza Premium", desc: "Bevanda di benvenuto inclusa" },
    ],
  },

  healthcare: {
    companyName: "Studio Medico Salus",
    tagline: "La tua salute, la nostra priorità",
    heroTitle: "Cure mediche d'eccellenza",
    heroSubtitle: "Equipe specializzata e tecnologie all'avanguardia",
    address: "Via Dante 45, Torino",
    city: "Torino",
    phone: "+39 011 987 6543",
    email: "info@studiosalus.it",
    bookingLabel: "Prenota una Visita",
    ctaLabel: "Vedi Specialità",
    bookingFields: ["name", "phone", "service", "date", "time"],
    hours: [
      { day: "Lun - Ven", hours: "08:00 - 19:00" },
      { day: "Sabato", hours: "08:00 - 13:00" },
    ],
    services: [
      { name: "Visita Medica Generale", description: "Check-up completo con ECG", price: 80, duration: "30 min", category: "Medicina Generale", popular: true, emoji: "🩺" },
      { name: "Visita Dermatologica", description: "Controllo nei e patologie cutanee", price: 120, duration: "30 min", category: "Dermatologia", popular: true, emoji: "🔬" },
      { name: "Ecografia Addominale", description: "Ecografia completa addome sup/inf", price: 100, duration: "30 min", category: "Diagnostica", emoji: "📡" },
      { name: "Visita Cardiologica", description: "ECG + ecocardiogramma", price: 150, duration: "45 min", category: "Cardiologia", emoji: "❤️" },
      { name: "Fisioterapia", description: "Seduta riabilitativa personalizzata", price: 60, duration: "45 min", category: "Riabilitazione", popular: true, emoji: "🏋️" },
      { name: "Analisi del Sangue", description: "Prelievo + esami completi", price: 45, duration: "15 min", category: "Laboratorio", emoji: "🩸" },
    ],
    reviews: [
      { name: "Roberto M.", rating: 5, comment: "Professionisti eccezionali, struttura moderna." },
      { name: "Maria G.", rating: 5, comment: "Tempi di attesa minimi, ottimo servizio." },
      { name: "Luca P.", rating: 4, comment: "Fisioterapista bravissima, mi ha risolto il problema." },
    ],
    features: [
      { icon: "Shield", label: "Medici Specialisti", desc: "Team di professionisti certificati" },
      { icon: "Zap", label: "Referti Rapidi", desc: "Risultati in 24-48 ore" },
      { icon: "Heart", label: "Cura del Paziente", desc: "Approccio umano e personalizzato" },
    ],
  },

  retail: {
    companyName: "Bottega Artigiana",
    tagline: "Artigianato italiano, qualità senza tempo",
    heroTitle: "Il meglio del Made in Italy",
    heroSubtitle: "Prodotti artigianali selezionati con cura",
    address: "Via Tornabuoni 12, Firenze",
    city: "Firenze",
    phone: "+39 055 234 5678",
    email: "info@bottega-artigiana.it",
    bookingLabel: "Ordina Online",
    ctaLabel: "Vedi Prodotti",
    bookingFields: ["name", "phone", "email", "notes"],
    hours: [
      { day: "Lun - Sab", hours: "10:00 - 19:30" },
      { day: "Domenica", hours: "11:00 - 18:00" },
    ],
    services: [
      { name: "Borsa in Pelle Artigianale", description: "Realizzata a mano in pellame toscano", price: 280, category: "Pelletteria", popular: true, emoji: "👜" },
      { name: "Portafoglio Uomo", description: "Pelle pieno fiore, cuciture a mano", price: 95, category: "Pelletteria", emoji: "💼" },
      { name: "Sciarpa in Cashmere", description: "100% cashmere italiano, tinta naturale", price: 120, category: "Accessori", popular: true, emoji: "🧣" },
      { name: "Cintura Artigianale", description: "Cuoio vegetale conciato al naturale", price: 65, category: "Accessori", emoji: "🪢" },
      { name: "Set Ceramiche Montelupo", description: "6 piatti dipinti a mano", price: 180, category: "Casa", emoji: "🍽️" },
      { name: "Olio EVO Toscano DOP", description: "Latta da 5L, raccolta manuale", price: 55, category: "Alimentari", popular: true, emoji: "🫒" },
    ],
    reviews: [
      { name: "Chiara N.", rating: 5, comment: "Qualità incredibile, la borsa è stupenda!" },
      { name: "James K.", rating: 5, comment: "Authentic Italian craftsmanship. Worth every euro." },
      { name: "Marta D.", rating: 5, comment: "Regali perfetti, packaging curatissimo." },
    ],
    features: [
      { icon: "Award", label: "100% Artigianale", desc: "Ogni pezzo è unico e fatto a mano" },
      { icon: "Package", label: "Spedizione Gratis", desc: "In tutta Italia sopra i €100" },
      { icon: "Shield", label: "Garanzia a Vita", desc: "Riparazione gratuita per sempre" },
    ],
  },

  fitness: {
    companyName: "Iron Gym Club",
    tagline: "Supera i tuoi limiti ogni giorno",
    heroTitle: "Il tuo percorso fitness inizia qui",
    heroSubtitle: "Attrezzatura premium, trainer certificati, risultati reali",
    address: "Viale Monza 88, Milano",
    city: "Milano",
    phone: "+39 02 3456 7890",
    email: "info@irongym.it",
    bookingLabel: "Prova Gratuita",
    ctaLabel: "Vedi Abbonamenti",
    bookingFields: ["name", "phone", "email", "service"],
    hours: [
      { day: "Lun - Ven", hours: "06:00 - 23:00" },
      { day: "Sab - Dom", hours: "08:00 - 20:00" },
    ],
    services: [
      { name: "Abbonamento Mensile", description: "Accesso illimitato sala + corsi", price: 49, category: "Abbonamenti", popular: true, emoji: "💪" },
      { name: "Personal Training", description: "1 sessione con trainer certificato", price: 50, duration: "60 min", category: "Servizi", popular: true, emoji: "🏋️" },
      { name: "Corso Yoga", description: "Lezione di gruppo, tutti i livelli", price: 15, duration: "60 min", category: "Corsi", emoji: "🧘" },
      { name: "Corso CrossFit", description: "Allenamento funzionale ad alta intensità", price: 18, duration: "45 min", category: "Corsi", popular: true, emoji: "🔥" },
      { name: "Piano Alimentare", description: "Consulenza nutrizionale personalizzata", price: 80, category: "Servizi", emoji: "🥗" },
      { name: "Abbonamento Annuale", description: "12 mesi + 2 PT sessions gratuite", price: 399, category: "Abbonamenti", emoji: "⭐" },
    ],
    reviews: [
      { name: "Alessandro F.", rating: 5, comment: "Palestra top, attrezzatura sempre nuova!" },
      { name: "Valentina S.", rating: 5, comment: "I corsi di yoga sono fantastici." },
      { name: "Davide L.", rating: 4, comment: "Personal trainer competente, risultati in 3 mesi." },
    ],
    features: [
      { icon: "Dumbbell", label: "Attrezzatura Top", desc: "Macchinari Technogym di ultima generazione" },
      { icon: "Users", label: "Trainer Certificati", desc: "Team di professionisti del fitness" },
      { icon: "Clock", label: "Orari Flessibili", desc: "Aperto 7 giorni su 7, dalle 6:00" },
    ],
  },

  hospitality: {
    companyName: "Villa Belvedere B&B",
    tagline: "Il tuo angolo di paradiso nel cuore della Toscana",
    heroTitle: "Soggiorna nel cuore della Toscana",
    heroSubtitle: "Camere eleganti, vista mozzafiato, colazione artigianale",
    address: "Strada dei Colli 5, San Gimignano (SI)",
    city: "San Gimignano",
    phone: "+39 0577 123 456",
    email: "info@villabelvedere.it",
    bookingLabel: "Prenota Camera",
    ctaLabel: "Vedi Camere",
    bookingFields: ["name", "phone", "email", "date", "guests", "notes"],
    hours: [
      { day: "Check-in", hours: "14:00 - 21:00" },
      { day: "Check-out", hours: "Entro le 10:30" },
      { day: "Reception", hours: "08:00 - 22:00" },
    ],
    services: [
      { name: "Camera Classica", description: "Letto matrimoniale, bagno privato, Wi-Fi", price: 95, category: "Camere", popular: true, emoji: "🛏️" },
      { name: "Suite Panoramica", description: "Vista colline, terrazza privata, minibar", price: 165, category: "Camere", popular: true, emoji: "🌅" },
      { name: "Colazione Toscana", description: "Dolce e salato con prodotti locali", price: 0, category: "Servizi", emoji: "🥐" },
      { name: "Degustazione Vini", description: "3 vini locali + tagliere toscano", price: 35, category: "Esperienze", emoji: "🍷" },
      { name: "Tour in E-bike", description: "Mezza giornata tra vigneti e oliveti", price: 45, category: "Esperienze", popular: true, emoji: "🚴" },
      { name: "Cena in Vigna", description: "Menu toscano 4 portate sotto le stelle", price: 55, category: "Esperienze", emoji: "🌟" },
    ],
    reviews: [
      { name: "Hans W.", rating: 5, comment: "Die beste Aussicht in der Toskana! Wunderbar!" },
      { name: "Sophie B.", rating: 5, comment: "Un séjour magique, petit-déjeuner incroyable." },
      { name: "Marco C.", rating: 5, comment: "Posto incantevole, ospitalità genuina." },
    ],
    features: [
      { icon: "Sun", label: "Vista Panoramica", desc: "Affacciato sulle colline toscane" },
      { icon: "Coffee", label: "Colazione Inclusa", desc: "Prodotti a km zero ogni mattina" },
      { icon: "Bike", label: "Esperienze Locali", desc: "Wine tour, e-bike, cooking class" },
    ],
  },

  beach: {
    companyName: "Lido Azzurro",
    tagline: "Il tuo stabilimento balneare preferito",
    heroTitle: "Una giornata al mare perfetta",
    heroSubtitle: "Ombrelloni, lettini, cocktail e relax sulla spiaggia più bella",
    address: "Lungomare Colombo 15, Rimini",
    city: "Rimini",
    phone: "+39 0541 123 456",
    email: "info@lidoazzurro.it",
    bookingLabel: "Prenota il tuo Ombrellone",
    ctaLabel: "Vedi Tariffe",
    bookingFields: ["name", "phone", "date", "service", "notes"],
    hours: [
      { day: "Lun - Dom", hours: "07:30 - 19:30" },
      { day: "Beach Bar", hours: "10:00 - 01:00" },
    ],
    services: [
      { name: "Ombrellone + 2 Lettini", description: "Prima fila fronte mare", price: 35, category: "Prima Fila", popular: true, emoji: "⛱️" },
      { name: "Ombrellone + 2 Lettini", description: "Seconda/terza fila", price: 25, category: "Centrale", popular: true, emoji: "🏖️" },
      { name: "Gazebo VIP", description: "Tenda privata, 4 lettini, servizio bar", price: 80, category: "Premium", emoji: "🌴" },
      { name: "Solo Lettino", description: "Lettino singolo senza ombrellone", price: 12, category: "Base", emoji: "🛋️" },
      { name: "Abb. Settimanale", description: "7 giorni ombrellone + 2 lettini", price: 150, category: "Abbonamenti", popular: true, emoji: "📅" },
      { name: "Abb. Stagionale", description: "Giugno-Settembre, posto fisso", price: 1200, category: "Abbonamenti", emoji: "☀️" },
    ],
    reviews: [
      { name: "Lucia F.", rating: 5, comment: "Spiaggia pulitissima, staff gentilissimo!" },
      { name: "Andrea P.", rating: 5, comment: "Beach bar eccezionale, aperitivi top." },
      { name: "Carla M.", rating: 4, comment: "Ottimo per famiglie, area bimbi fantastica." },
    ],
    features: [
      { icon: "Waves", label: "Spiaggia Privata", desc: "100m di spiaggia attrezzata" },
      { icon: "Wine", label: "Beach Bar", desc: "Cocktail, pranzi e aperitivi in spiaggia" },
      { icon: "Baby", label: "Area Bimbi", desc: "Animazione e giochi per bambini" },
    ],
  },

  plumber: {
    companyName: "Idraulica Rapida",
    tagline: "Pronto intervento idraulico 24/7",
    heroTitle: "Problemi idraulici? Ci pensiamo noi",
    heroSubtitle: "Interventi rapidi, preventivi gratuiti, garanzia su ogni lavoro",
    address: "Via dell'Industria 33, Bologna",
    city: "Bologna",
    phone: "+39 051 234 5678",
    email: "info@idraulicarapida.it",
    bookingLabel: "Richiedi Intervento",
    ctaLabel: "Vedi Servizi",
    bookingFields: ["name", "phone", "address", "service", "notes"],
    hours: [
      { day: "Lun - Ven", hours: "08:00 - 18:00" },
      { day: "Sabato", hours: "08:00 - 13:00" },
      { day: "Emergenze", hours: "24/7" },
    ],
    services: [
      { name: "Riparazione Perdita", description: "Intervento rapido su perdite d'acqua", price: 80, category: "Riparazioni", popular: true, emoji: "💧" },
      { name: "Sturatura Scarico", description: "Disostruzione meccanica o idrodinamica", price: 90, category: "Riparazioni", popular: true, emoji: "🔧" },
      { name: "Installazione Caldaia", description: "Montaggio + collaudo + certificazione", price: 350, category: "Installazioni", emoji: "🔥" },
      { name: "Ristrutturazione Bagno", description: "Progettazione completa + lavori", price: 3500, category: "Ristrutturazioni", emoji: "🚿" },
      { name: "Manutenzione Caldaia", description: "Controllo annuale + pulizia", price: 120, category: "Manutenzione", popular: true, emoji: "🛠️" },
      { name: "Pronto Intervento", description: "Emergenze idrauliche H24", price: 120, category: "Emergenze", emoji: "🚨" },
    ],
    reviews: [
      { name: "Franco B.", rating: 5, comment: "Sono arrivati in 30 minuti, problema risolto subito!" },
      { name: "Silvia R.", rating: 5, comment: "Preventivo rispettato al centesimo." },
      { name: "Maurizio L.", rating: 4, comment: "Professionali e puliti, bravi." },
    ],
    features: [
      { icon: "Zap", label: "Intervento Rapido", desc: "Arriviamo entro 1 ora in città" },
      { icon: "FileText", label: "Preventivo Gratis", desc: "Sopralluogo e preventivo senza impegno" },
      { icon: "Shield", label: "Garanzia 2 Anni", desc: "Su tutti i lavori e materiali" },
    ],
  },

  electrician: {
    companyName: "Elettrica Moderna",
    tagline: "Impianti elettrici sicuri e certificati",
    heroTitle: "Sicurezza e innovazione elettrica",
    heroSubtitle: "Impianti a norma, domotica, efficienza energetica",
    address: "Via Marconi 22, Verona",
    city: "Verona",
    phone: "+39 045 678 9012",
    email: "info@elettricamoderna.it",
    bookingLabel: "Richiedi Preventivo",
    ctaLabel: "Vedi Servizi",
    bookingFields: ["name", "phone", "address", "service", "notes"],
    hours: [
      { day: "Lun - Ven", hours: "07:30 - 18:00" },
      { day: "Sabato", hours: "08:00 - 13:00" },
      { day: "Emergenze", hours: "24/7" },
    ],
    services: [
      { name: "Impianto Elettrico Nuovo", description: "Progettazione + installazione + certificazione", price: 2500, category: "Impianti", popular: true, emoji: "⚡" },
      { name: "Riparazione Guasto", description: "Diagnosi e riparazione rapida", price: 80, category: "Riparazioni", popular: true, emoji: "🔌" },
      { name: "Certificazione Impianto", description: "Verifica conformità e rilascio DiCo", price: 200, category: "Certificazioni", emoji: "📋" },
      { name: "Domotica Smart Home", description: "Automazione luci, tapparelle, clima", price: 1500, category: "Domotica", popular: true, emoji: "🏠" },
      { name: "Pannelli Fotovoltaici", description: "Installazione + pratiche GSE", price: 8000, category: "Energie Rinnovabili", emoji: "☀️" },
      { name: "Ampliamento Impianto", description: "Aggiunta punti luce e prese", price: 150, category: "Ampliamenti", emoji: "💡" },
    ],
    reviews: [
      { name: "Giorgio T.", rating: 5, comment: "Domotica installata in 2 giorni, funziona perfettamente!" },
      { name: "Laura C.", rating: 5, comment: "Certificazione rapida e professionale." },
      { name: "Piero N.", rating: 4, comment: "Ottimo lavoro sul fotovoltaico." },
    ],
    features: [
      { icon: "Shield", label: "Certificati", desc: "Abilitazione completa Decreto 37/08" },
      { icon: "Zap", label: "Pronto Intervento", desc: "Emergenze elettriche H24" },
      { icon: "Leaf", label: "Green Energy", desc: "Specialisti in rinnovabili e risparmio" },
    ],
  },

  agriturismo: {
    companyName: "Podere del Sole",
    tagline: "Natura, sapori e tradizione in campagna",
    heroTitle: "Vivi l'esperienza della campagna",
    heroSubtitle: "Camere rustiche, cucina genuina, attività all'aria aperta",
    address: "Loc. Poggio Alto 7, Montepulciano (SI)",
    city: "Montepulciano",
    phone: "+39 0578 123 456",
    email: "info@poderesole.it",
    bookingLabel: "Prenota Soggiorno",
    ctaLabel: "Vedi Offerte",
    bookingFields: ["name", "phone", "email", "date", "guests", "notes"],
    hours: [
      { day: "Check-in", hours: "15:00 - 20:00" },
      { day: "Ristorante", hours: "12:30 - 14:00 · 19:30 - 21:00" },
      { day: "Fattoria didattica", hours: "Su prenotazione" },
    ],
    services: [
      { name: "Camera Rustica", description: "Matrimoniale con vista campagna", price: 85, category: "Camere", popular: true, emoji: "🏡" },
      { name: "Appartamento Familiare", description: "2 camere, angolo cottura, giardino", price: 140, category: "Camere", emoji: "👨‍👩‍👧‍👦" },
      { name: "Cena Contadina", description: "Menu 4 portate con prodotti nostri", price: 30, category: "Ristorante", popular: true, emoji: "🍷" },
      { name: "Raccolta Olive", description: "Esperienza in uliveto + degustazione", price: 25, category: "Attività", emoji: "🫒" },
      { name: "Corso di Cucina", description: "Pasta fatta in casa con la nonna", price: 45, category: "Attività", popular: true, emoji: "👩‍🍳" },
      { name: "Box Prodotti Tipici", description: "Olio, vino, miele, confetture", price: 60, category: "Shop", emoji: "📦" },
    ],
    reviews: [
      { name: "Katharine S.", rating: 5, comment: "The most authentic Tuscan experience!" },
      { name: "Marco V.", rating: 5, comment: "Cena sublime, prodotti genuini." },
      { name: "Julia R.", rating: 5, comment: "I bambini hanno adorato la fattoria." },
    ],
    features: [
      { icon: "Leaf", label: "Prodotti a Km 0", desc: "Olio, vino e verdure del nostro orto" },
      { icon: "Sun", label: "Piscina Panoramica", desc: "Vista mozzafiato sulla Val d'Orcia" },
      { icon: "Heart", label: "Pet Friendly", desc: "I vostri amici a 4 zampe sono benvenuti" },
    ],
  },

  cleaning: {
    companyName: "PulitoPro",
    tagline: "Pulizie professionali per ogni esigenza",
    heroTitle: "Ambienti impeccabili, ogni giorno",
    heroSubtitle: "Servizi di pulizia per case, uffici e attività commerciali",
    address: "Via Emilia 78, Modena",
    city: "Modena",
    phone: "+39 059 876 5432",
    email: "info@pulitopro.it",
    bookingLabel: "Richiedi Preventivo",
    ctaLabel: "Vedi Servizi",
    bookingFields: ["name", "phone", "address", "service", "notes"],
    hours: [
      { day: "Lun - Ven", hours: "07:00 - 20:00" },
      { day: "Sabato", hours: "08:00 - 14:00" },
    ],
    services: [
      { name: "Pulizia Ordinaria Casa", description: "Pulizia completa appartamento fino a 100mq", price: 80, category: "Residenziale", popular: true, emoji: "🏠" },
      { name: "Pulizia Ufficio", description: "Pulizia quotidiana uffici e spazi comuni", price: 120, category: "Commerciale", popular: true, emoji: "🏢" },
      { name: "Pulizia Post-Cantiere", description: "Rimozione polveri e detriti edili", price: 250, category: "Straordinaria", emoji: "🧹" },
      { name: "Pulizia Fine Locazione", description: "Pulizia profonda per restituzione chiavi", price: 200, category: "Straordinaria", popular: true, emoji: "🔑" },
      { name: "Sanificazione", description: "Trattamento antibatterico certificato", price: 150, category: "Specializzata", emoji: "🧴" },
      { name: "Pulizia Vetri & Facciate", description: "Vetri, vetrine, facciate esterne", price: 100, category: "Specializzata", emoji: "🪟" },
    ],
    reviews: [
      { name: "Stefano G.", rating: 5, comment: "Puntuali, meticolosi, prezzo giusto." },
      { name: "Marina T.", rating: 5, comment: "Il mio ufficio non è mai stato così pulito!" },
      { name: "Rita B.", rating: 4, comment: "Ottima pulizia post-cantiere." },
    ],
    features: [
      { icon: "Sparkles", label: "Prodotti Eco", desc: "Solo detergenti certificati e biodegradabili" },
      { icon: "Clock", label: "Flessibilità", desc: "Orari adattabili alle tue esigenze" },
      { icon: "Shield", label: "Assicurati", desc: "Copertura RC per tutti i nostri operatori" },
    ],
  },

  legal: {
    companyName: "Studio Legale Martini",
    tagline: "Difendiamo i tuoi diritti con competenza",
    heroTitle: "Assistenza legale a 360°",
    heroSubtitle: "Diritto civile, penale, societario e del lavoro",
    address: "Piazza Cavour 8, Napoli",
    city: "Napoli",
    phone: "+39 081 234 5678",
    email: "avv.martini@studiolegalemartini.it",
    bookingLabel: "Prenota Consulenza",
    ctaLabel: "Vedi Aree di Pratica",
    bookingFields: ["name", "phone", "email", "service", "notes"],
    hours: [
      { day: "Lun - Ven", hours: "09:00 - 18:00" },
      { day: "Sabato", hours: "Su appuntamento" },
    ],
    services: [
      { name: "Consulenza Legale", description: "Primo incontro conoscitivo 30 min", price: 80, duration: "30 min", category: "Consulenze", popular: true, emoji: "⚖️" },
      { name: "Diritto di Famiglia", description: "Separazioni, divorzi, affidamento", price: 150, category: "Civile", popular: true, emoji: "👨‍👩‍👧" },
      { name: "Diritto del Lavoro", description: "Licenziamenti, contratti, vertenze", price: 200, category: "Lavoro", emoji: "📋" },
      { name: "Diritto Societario", description: "Costituzione società, statuti, patti", price: 300, category: "Commerciale", popular: true, emoji: "🏛️" },
      { name: "Recupero Crediti", description: "Procedure monitorie e esecutive", price: 250, category: "Civile", emoji: "💶" },
      { name: "Diritto Penale", description: "Assistenza in procedimenti penali", price: 500, category: "Penale", emoji: "🔒" },
    ],
    reviews: [
      { name: "Carlo D.", rating: 5, comment: "Competenti e disponibili, caso risolto brillantemente." },
      { name: "Simona P.", rating: 5, comment: "Mi hanno assistita nella separazione con grande umanità." },
      { name: "Antonio R.", rating: 4, comment: "Professionali e puntuali nelle scadenze." },
    ],
    features: [
      { icon: "GraduationCap", label: "Esperienza 25+", desc: "Oltre 25 anni di pratica legale" },
      { icon: "Shield", label: "Riservatezza", desc: "Massima tutela della privacy del cliente" },
      { icon: "Globe", label: "Multilingue", desc: "Assistenza in italiano, inglese e francese" },
    ],
  },

  accounting: {
    companyName: "Studio Rossi & Associati",
    tagline: "Il tuo commercialista di fiducia",
    heroTitle: "Gestione fiscale senza pensieri",
    heroSubtitle: "Contabilità, dichiarazioni, consulenza aziendale",
    address: "Via Roma 56, Padova",
    city: "Padova",
    phone: "+39 049 876 5432",
    email: "info@studiorossi.it",
    bookingLabel: "Prenota Consulenza",
    ctaLabel: "Vedi Servizi",
    bookingFields: ["name", "phone", "email", "service"],
    hours: [
      { day: "Lun - Ven", hours: "09:00 - 18:00" },
      { day: "Sabato", hours: "09:00 - 12:00 (su appuntamento)" },
    ],
    services: [
      { name: "Dichiarazione dei Redditi", description: "730, Unico PF, compilazione e invio", price: 120, category: "Fiscale", popular: true, emoji: "📊" },
      { name: "Contabilità Ordinaria", description: "Gestione contabile mensile azienda", price: 300, category: "Contabilità", popular: true, emoji: "📒" },
      { name: "Apertura Partita IVA", description: "Consulenza + pratica completa", price: 200, category: "Startup", popular: true, emoji: "🚀" },
      { name: "Consulenza Societaria", description: "Bilancio, assemblee, verbali", price: 250, category: "Societario", emoji: "🏢" },
      { name: "Buste Paga", description: "Elaborazione cedolini mensili", price: 25, category: "Lavoro", emoji: "💰" },
      { name: "Consulenza Fiscale", description: "Pianificazione fiscale personalizzata", price: 150, category: "Consulenza", emoji: "🎯" },
    ],
    reviews: [
      { name: "Massimo B.", rating: 5, comment: "Ci seguono da 10 anni, impeccabili." },
      { name: "Giovanna T.", rating: 5, comment: "Hanno ottimizzato le nostre tasse in modo incredibile." },
      { name: "Roberto F.", rating: 4, comment: "Professionali e sempre disponibili." },
    ],
    features: [
      { icon: "Calculator", label: "Precisione", desc: "Zero errori su dichiarazioni e bilanci" },
      { icon: "Clock", label: "Scadenze OK", desc: "Mai un ritardo su adempimenti fiscali" },
      { icon: "TrendingUp", label: "Risparmio Fiscale", desc: "Ottimizzazione legale del carico fiscale" },
    ],
  },

  garage: {
    companyName: "Autofficina Rossi",
    tagline: "La tua auto in buone mani dal 1995",
    heroTitle: "Riparazioni auto di qualità",
    heroSubtitle: "Meccanica, elettronica, tagliandi e revisioni",
    address: "Via dell'Artigianato 12, Brescia",
    city: "Brescia",
    phone: "+39 030 456 7890",
    email: "info@autofficinarossi.it",
    bookingLabel: "Prenota Appuntamento",
    ctaLabel: "Vedi Servizi",
    bookingFields: ["name", "phone", "service", "notes"],
    hours: [
      { day: "Lun - Ven", hours: "08:00 - 18:30" },
      { day: "Sabato", hours: "08:00 - 12:30" },
    ],
    services: [
      { name: "Tagliando Completo", description: "Olio, filtri, controllo livelli e freni", price: 180, category: "Manutenzione", popular: true, emoji: "🔧" },
      { name: "Revisione Auto", description: "Revisione ministeriale obbligatoria", price: 79, category: "Revisioni", popular: true, emoji: "📋" },
      { name: "Cambio Gomme", description: "Smontaggio, montaggio, equilibratura x4", price: 60, category: "Pneumatici", emoji: "🛞" },
      { name: "Diagnosi Elettronica", description: "Scansione centralina + report completo", price: 50, category: "Diagnostica", popular: true, emoji: "💻" },
      { name: "Sostituzione Freni", description: "Pastiglie + dischi anteriori", price: 250, category: "Riparazioni", emoji: "🛑" },
      { name: "Ricarica Clima", description: "Sanificazione + ricarica gas R134a", price: 85, category: "Clima", emoji: "❄️" },
    ],
    reviews: [
      { name: "Luca M.", rating: 5, comment: "Onesti e competenti, ci vado da sempre." },
      { name: "Federica S.", rating: 5, comment: "Tagliando fatto in 2 ore, prezzo corretto." },
      { name: "Giuseppe R.", rating: 4, comment: "Diagnosi precisa, hanno trovato subito il problema." },
    ],
    features: [
      { icon: "Wrench", label: "Multi-Marca", desc: "Assistenza su tutte le marche auto" },
      { icon: "Shield", label: "Ricambi Originali", desc: "Solo ricambi OEM o equivalenti certificati" },
      { icon: "Clock", label: "Auto Sostitutiva", desc: "Disponibile per riparazioni lunghe" },
    ],
  },

  photography: {
    companyName: "Luce Studio",
    tagline: "Catturiamo i momenti che contano",
    heroTitle: "Fotografia che emoziona",
    heroSubtitle: "Matrimoni, ritratti, eventi e corporate",
    address: "Via dei Mille 10, Firenze",
    city: "Firenze",
    phone: "+39 055 987 6543",
    email: "info@lucestudio.it",
    bookingLabel: "Richiedi Preventivo",
    ctaLabel: "Vedi Portfolio",
    bookingFields: ["name", "phone", "email", "service", "date", "notes"],
    hours: [
      { day: "Lun - Ven", hours: "10:00 - 19:00" },
      { day: "Weekend", hours: "Su prenotazione (shooting)" },
    ],
    services: [
      { name: "Servizio Matrimonio", description: "Copertura intera giornata + album", price: 2500, category: "Matrimoni", popular: true, emoji: "💍" },
      { name: "Shooting Ritratto", description: "30 foto ritoccate, indoor o outdoor", price: 200, duration: "90 min", category: "Ritratti", popular: true, emoji: "📸" },
      { name: "Foto Corporate", description: "Headshot team + foto ambiente", price: 500, category: "Corporate", emoji: "🏢" },
      { name: "Video Evento", description: "Riprese + montaggio professionale", price: 800, category: "Video", popular: true, emoji: "🎬" },
      { name: "Foto Prodotto E-commerce", description: "10 prodotti, 3 foto ciascuno", price: 350, category: "Prodotti", emoji: "🛍️" },
      { name: "Foto Newborn", description: "Sessione per neonati in studio", price: 250, duration: "120 min", category: "Famiglia", emoji: "👶" },
    ],
    reviews: [
      { name: "Alessia & Marco", rating: 5, comment: "Le foto del matrimonio sono un capolavoro!" },
      { name: "Studio Legale XY", rating: 5, comment: "Foto corporate perfette per il nostro sito." },
      { name: "Valentina G.", rating: 5, comment: "Shooting ritratto naturale e bellissimo." },
    ],
    features: [
      { icon: "Camera", label: "Attrezzatura Pro", desc: "Sony A7IV, obiettivi premium, drone" },
      { icon: "Image", label: "Consegna Rapida", desc: "Gallery online in 7 giorni lavorativi" },
      { icon: "Heart", label: "Stile Naturale", desc: "Foto emozionali, mai forzate" },
    ],
  },

  construction: {
    companyName: "Edil Costruzioni SRL",
    tagline: "Costruiamo il tuo futuro, mattone dopo mattone",
    heroTitle: "Ristrutturazioni e costruzioni",
    heroSubtitle: "Dalla progettazione alla consegna chiavi in mano",
    address: "Via dell'Edilizia 5, Bergamo",
    city: "Bergamo",
    phone: "+39 035 678 9012",
    email: "info@edilcostruzioni.it",
    bookingLabel: "Richiedi Sopralluogo",
    ctaLabel: "Vedi Lavori",
    bookingFields: ["name", "phone", "address", "service", "notes"],
    hours: [
      { day: "Lun - Ven", hours: "07:30 - 17:30" },
      { day: "Sabato", hours: "08:00 - 12:00" },
    ],
    services: [
      { name: "Ristrutturazione Appartamento", description: "Progetto + lavori completi chiavi in mano", price: 25000, category: "Ristrutturazioni", popular: true, emoji: "🏗️" },
      { name: "Rifacimento Bagno", description: "Demolizione, impianti, piastrelle, sanitari", price: 6000, category: "Ristrutturazioni", popular: true, emoji: "🚿" },
      { name: "Cappotto Termico", description: "Isolamento esterno con bonus fiscale", price: 15000, category: "Efficienza", emoji: "🧱" },
      { name: "Pittura Appartamento", description: "Tinteggiatura completa fino a 100mq", price: 2500, category: "Finiture", popular: true, emoji: "🎨" },
      { name: "Costruzione Nuova", description: "Edificazione da zero su progetto", price: 150000, category: "Costruzioni", emoji: "🏠" },
      { name: "Manutenzione Condominio", description: "Lavori su parti comuni e facciate", price: 5000, category: "Manutenzione", emoji: "🏢" },
    ],
    reviews: [
      { name: "Andrea B.", rating: 5, comment: "Ristrutturazione perfetta, tempi rispettati!" },
      { name: "Patrizia M.", rating: 5, comment: "Bagno nuovo bellissimo, squadra seria." },
      { name: "Marco Z.", rating: 4, comment: "Buon lavoro sul cappotto termico." },
    ],
    features: [
      { icon: "HardHat", label: "Esperienza 30+", desc: "Oltre 500 cantieri completati" },
      { icon: "FileText", label: "Bonus Fiscali", desc: "Ti seguiamo con le detrazioni fiscali" },
      { icon: "Shield", label: "Garanzia 10 Anni", desc: "Su tutti i lavori strutturali" },
    ],
  },

  gardening: {
    companyName: "Verde Vivo",
    tagline: "Il tuo giardino dei sogni, in ogni stagione",
    heroTitle: "Giardinaggio professionale",
    heroSubtitle: "Progettazione, manutenzione e cura del verde",
    address: "Via dei Giardini 8, Lucca",
    city: "Lucca",
    phone: "+39 0583 123 456",
    email: "info@verdevivo.it",
    bookingLabel: "Richiedi Sopralluogo",
    ctaLabel: "Vedi Servizi",
    bookingFields: ["name", "phone", "address", "service", "notes"],
    hours: [
      { day: "Lun - Ven", hours: "07:00 - 18:00" },
      { day: "Sabato", hours: "07:00 - 13:00" },
    ],
    services: [
      { name: "Manutenzione Ordinaria", description: "Taglio prato, pulizia aiuole, potatura", price: 80, category: "Manutenzione", popular: true, emoji: "🌿" },
      { name: "Potatura Alberi", description: "Potatura professionale con piattaforma", price: 200, category: "Potatura", popular: true, emoji: "🌳" },
      { name: "Impianto Irrigazione", description: "Progettazione e installazione automatica", price: 800, category: "Impianti", emoji: "💦" },
      { name: "Progettazione Giardino", description: "Progetto 3D + preventivo dettagliato", price: 300, category: "Progettazione", popular: true, emoji: "📐" },
      { name: "Prato a Rotoli", description: "Preparazione terreno + posa prato pronto", price: 15, category: "Prati", emoji: "🟢" },
      { name: "Abbonamento Manutenzione", description: "2 interventi/mese tutto l'anno", price: 150, category: "Abbonamenti", emoji: "📅" },
    ],
    reviews: [
      { name: "Claudia F.", rating: 5, comment: "Giardino trasformato, è meraviglioso!" },
      { name: "Roberto A.", rating: 5, comment: "Manutenzione impeccabile tutto l'anno." },
      { name: "Teresa L.", rating: 4, comment: "Impianto irrigazione perfetto, zero sprechi." },
    ],
    features: [
      { icon: "Leaf", label: "Eco-Friendly", desc: "Prodotti biologici e compostaggio" },
      { icon: "Calendar", label: "Abbonamenti", desc: "Manutenzione programmata tutto l'anno" },
      { icon: "Palette", label: "Design Verde", desc: "Progetti personalizzati con render 3D" },
    ],
  },

  veterinary: {
    companyName: "Clinica Veterinaria Amica",
    tagline: "Perché i tuoi amici a 4 zampe meritano il meglio",
    heroTitle: "Cure veterinarie con amore",
    heroSubtitle: "Visite, chirurgia, prevenzione e emergenze H24",
    address: "Via Pasteur 15, Genova",
    city: "Genova",
    phone: "+39 010 987 6543",
    email: "info@veterinariaamica.it",
    bookingLabel: "Prenota Visita",
    ctaLabel: "Vedi Servizi",
    bookingFields: ["name", "phone", "service", "date", "time", "notes"],
    hours: [
      { day: "Lun - Ven", hours: "09:00 - 19:00" },
      { day: "Sabato", hours: "09:00 - 13:00" },
      { day: "Emergenze", hours: "24/7" },
    ],
    services: [
      { name: "Visita Generale", description: "Check-up completo + vaccinazioni", price: 50, duration: "30 min", category: "Visite", popular: true, emoji: "🐾" },
      { name: "Ecografia", description: "Ecografia addominale completa", price: 80, duration: "30 min", category: "Diagnostica", emoji: "📡" },
      { name: "Sterilizzazione", description: "Intervento chirurgico + follow-up", price: 200, category: "Chirurgia", popular: true, emoji: "💉" },
      { name: "Pulizia Dentale", description: "Detartrasi e lucidatura in anestesia", price: 150, category: "Odontoiatria", emoji: "🦷" },
      { name: "Microchip", description: "Inserimento microchip + registrazione", price: 30, category: "Prevenzione", popular: true, emoji: "📡" },
      { name: "Pensione", description: "Soggiorno giornaliero con area dedicata", price: 25, category: "Servizi", emoji: "🏠" },
    ],
    reviews: [
      { name: "Marta G.", rating: 5, comment: "Veterinaria gentilissima, il mio cane adora venire!" },
      { name: "Paolo S.", rating: 5, comment: "Intervento perfetto, recupero rapidissimo." },
      { name: "Sara D.", rating: 5, comment: "Sempre disponibili per le emergenze, grazie!" },
    ],
    features: [
      { icon: "Heart", label: "Passione Animale", desc: "Team appassionato e competente" },
      { icon: "Stethoscope", label: "Diagnostica Avanzata", desc: "Radiologia, ecografia, laboratorio interno" },
      { icon: "Clock", label: "Emergenze H24", desc: "Pronto soccorso veterinario sempre attivo" },
    ],
  },

  tattoo: {
    companyName: "Ink Factory Studio",
    tagline: "Arte sulla pelle, da oltre 15 anni",
    heroTitle: "Il tuo tatuaggio unico",
    heroSubtitle: "Artisti specializzati in ogni stile, dal realistico al geometrico",
    address: "Via del Pratello 44, Bologna",
    city: "Bologna",
    phone: "+39 051 456 7890",
    email: "info@inkfactory.it",
    bookingLabel: "Prenota Consulenza",
    ctaLabel: "Vedi Portfolio",
    bookingFields: ["name", "phone", "email", "service", "notes"],
    hours: [
      { day: "Mar - Sab", hours: "11:00 - 20:00" },
      { day: "Lunedì e Domenica", hours: "Chiuso" },
    ],
    services: [
      { name: "Tatuaggio Piccolo", description: "Fino a 5cm, disegno personalizzato", price: 80, duration: "60 min", category: "Tatuaggi", popular: true, emoji: "🎨" },
      { name: "Tatuaggio Medio", description: "5-15cm, design su misura", price: 200, duration: "2-3 ore", category: "Tatuaggi", popular: true, emoji: "✒️" },
      { name: "Tatuaggio Grande", description: "Pezzo unico, più sessioni", price: 500, category: "Tatuaggi", emoji: "🖼️" },
      { name: "Cover Up", description: "Copertura tatuaggio esistente", price: 300, category: "Speciali", popular: true, emoji: "🔄" },
      { name: "Piercing", description: "Piercing + gioiello in titanio", price: 40, category: "Piercing", emoji: "💎" },
      { name: "Consulenza Gratuita", description: "Parliamo del tuo progetto", price: 0, duration: "30 min", category: "Consulenze", emoji: "💬" },
    ],
    reviews: [
      { name: "Matteo R.", rating: 5, comment: "Artista incredibile, tatuaggio realistico pazzesco." },
      { name: "Giada L.", rating: 5, comment: "Studio pulitissimo, grande professionalità." },
      { name: "Daniele M.", rating: 5, comment: "Cover up perfetto, non si vede più il vecchio!" },
    ],
    features: [
      { icon: "Palette", label: "Tutti gli Stili", desc: "Realistico, geometrico, giapponese, lettering" },
      { icon: "Shield", label: "Igiene Certificata", desc: "Sterilizzazione e materiali monouso" },
      { icon: "Star", label: "Disegno Custom", desc: "Ogni tatuaggio è unico e personalizzato" },
    ],
  },

  childcare: {
    companyName: "Piccoli Passi",
    tagline: "Dove i bambini crescono felici",
    heroTitle: "Il nido dei tuoi bambini",
    heroSubtitle: "Asilo nido e baby-sitting con educatori qualificati",
    address: "Via dei Bambini 20, Parma",
    city: "Parma",
    phone: "+39 0521 234 567",
    email: "info@piccolipassi.it",
    bookingLabel: "Richiedi Informazioni",
    ctaLabel: "Vedi Servizi",
    bookingFields: ["name", "phone", "email", "service", "notes"],
    hours: [
      { day: "Lun - Ven", hours: "07:30 - 18:00" },
      { day: "Sabato", hours: "Su richiesta" },
    ],
    services: [
      { name: "Nido Full Time", description: "Accoglienza 07:30-18:00, pranzo incluso", price: 600, category: "Nido", popular: true, emoji: "🍼" },
      { name: "Nido Part Time", description: "Accoglienza 07:30-13:00, pranzo incluso", price: 400, category: "Nido", popular: true, emoji: "🌈" },
      { name: "Baby Sitting Serale", description: "Servizio a domicilio dalle 18:00", price: 12, duration: "/ora", category: "Baby Sitting", emoji: "🌙" },
      { name: "Centro Estivo", description: "Attività ludiche e sportive, giugno-agosto", price: 200, category: "Estate", popular: true, emoji: "☀️" },
      { name: "Laboratorio Creativo", description: "Pittura, musica, inglese (4-6 anni)", price: 80, category: "Laboratori", emoji: "🎨" },
      { name: "Festa di Compleanno", description: "Animazione + merenda, max 15 bambini", price: 250, category: "Eventi", emoji: "🎂" },
    ],
    reviews: [
      { name: "Chiara M.", rating: 5, comment: "Educatrici meravigliose, mio figlio adora andarci!" },
      { name: "Francesco T.", rating: 5, comment: "Ambiente sicuro e stimolante." },
      { name: "Alessia P.", rating: 5, comment: "Centro estivo organizzato benissimo." },
    ],
    features: [
      { icon: "Heart", label: "Amore e Cura", desc: "Rapporto educatore/bambino 1:5" },
      { icon: "Shield", label: "Sicurezza Totale", desc: "Telecamere, accessi controllati" },
      { icon: "BookOpen", label: "Metodo Montessori", desc: "Apprendimento naturale e creativo" },
    ],
  },

  education: {
    companyName: "Accademia del Sapere",
    tagline: "Formazione che fa la differenza",
    heroTitle: "Impara, cresci, eccelli",
    heroSubtitle: "Corsi professionali, certificazioni e formazione continua",
    address: "Via dell'Università 30, Bologna",
    city: "Bologna",
    phone: "+39 051 789 0123",
    email: "info@accademiasapere.it",
    bookingLabel: "Iscriviti al Corso",
    ctaLabel: "Vedi Catalogo Corsi",
    bookingFields: ["name", "phone", "email", "service"],
    hours: [
      { day: "Lun - Ven", hours: "09:00 - 21:00" },
      { day: "Sabato", hours: "09:00 - 14:00" },
    ],
    services: [
      { name: "Corso Excel Avanzato", description: "Macro, tabelle pivot, dashboard", price: 250, duration: "20 ore", category: "Informatica", popular: true, emoji: "💻" },
      { name: "Corso di Inglese B2", description: "Preparazione certificazione Cambridge", price: 400, duration: "40 ore", category: "Lingue", popular: true, emoji: "🇬🇧" },
      { name: "Digital Marketing", description: "SEO, social media, Google Ads", price: 500, duration: "30 ore", category: "Marketing", popular: true, emoji: "📱" },
      { name: "Corso Barista", description: "Latte art + espresso professionale", price: 300, duration: "16 ore", category: "Food & Beverage", emoji: "☕" },
      { name: "Sicurezza sul Lavoro", description: "Formazione obbligatoria D.Lgs 81/08", price: 150, duration: "8 ore", category: "Sicurezza", emoji: "⚠️" },
      { name: "Corso Python", description: "Programmazione da zero a intermedio", price: 450, duration: "30 ore", category: "Informatica", emoji: "🐍" },
    ],
    reviews: [
      { name: "Nicola C.", rating: 5, comment: "Corso Excel utilissimo, docente fantastico!" },
      { name: "Elisa M.", rating: 5, comment: "Ho trovato lavoro grazie al corso di marketing." },
      { name: "Davide R.", rating: 4, comment: "Buon corso di inglese, ben organizzato." },
    ],
    features: [
      { icon: "GraduationCap", label: "Certificati", desc: "Attestati riconosciuti a livello nazionale" },
      { icon: "Users", label: "Classi Piccole", desc: "Max 12 partecipanti per garantire qualità" },
      { icon: "Monitor", label: "Online + Presenza", desc: "Frequenta come preferisci" },
    ],
  },

  events: {
    companyName: "Dream Events",
    tagline: "Trasformiamo le tue idee in eventi indimenticabili",
    heroTitle: "Eventi che lasciano il segno",
    heroSubtitle: "Matrimoni, corporate, feste private e congressi",
    address: "Corso Vittorio Emanuele 100, Milano",
    city: "Milano",
    phone: "+39 02 456 7890",
    email: "info@dreamevents.it",
    bookingLabel: "Richiedi Preventivo",
    ctaLabel: "Vedi i Nostri Eventi",
    bookingFields: ["name", "phone", "email", "service", "date", "notes"],
    hours: [
      { day: "Lun - Ven", hours: "09:00 - 19:00" },
      { day: "Weekend", hours: "Reperibili per eventi" },
    ],
    services: [
      { name: "Wedding Planning", description: "Organizzazione completa matrimonio", price: 5000, category: "Matrimoni", popular: true, emoji: "💒" },
      { name: "Evento Corporate", description: "Lancio prodotto, team building, gala", price: 3000, category: "Corporate", popular: true, emoji: "🏢" },
      { name: "Festa Privata", description: "Compleanno, laurea, anniversario", price: 1500, category: "Private", popular: true, emoji: "🎉" },
      { name: "Congresso / Fiera", description: "Logistica completa + allestimenti", price: 8000, category: "Congressi", emoji: "🎤" },
      { name: "Catering Premium", description: "Menu personalizzato + servizio", price: 45, category: "Catering", emoji: "🍽️" },
      { name: "Fiori & Allestimenti", description: "Composizioni floreali + decor", price: 2000, category: "Allestimenti", emoji: "💐" },
    ],
    reviews: [
      { name: "Silvia & Luca", rating: 5, comment: "Il matrimonio dei nostri sogni, grazie Dream Events!" },
      { name: "Azienda XYZ", rating: 5, comment: "Lancio prodotto perfetto, 500 invitati senza intoppi." },
      { name: "Famiglia Bianchi", rating: 5, comment: "Festa dei 50 anni indimenticabile." },
    ],
    features: [
      { icon: "Sparkles", label: "Creatività", desc: "Ogni evento è un progetto unico" },
      { icon: "Users", label: "Team Esperto", desc: "10+ professionisti dedicati" },
      { icon: "MapPin", label: "Location Esclusive", desc: "Network di 50+ location in Italia" },
    ],
  },

  logistics: {
    companyName: "Flash Logistica",
    tagline: "Spedizioni veloci, sicure, puntuali",
    heroTitle: "La logistica che ti serve",
    heroSubtitle: "Trasporti nazionali e internazionali per ogni esigenza",
    address: "Via della Logistica 1, Piacenza",
    city: "Piacenza",
    phone: "+39 0523 456 789",
    email: "info@flashlogistica.it",
    bookingLabel: "Richiedi Preventivo",
    ctaLabel: "Vedi Servizi",
    bookingFields: ["name", "phone", "email", "service", "notes"],
    hours: [
      { day: "Lun - Ven", hours: "06:00 - 22:00" },
      { day: "Sabato", hours: "08:00 - 14:00" },
    ],
    services: [
      { name: "Spedizione Nazionale", description: "Consegna in 24/48h in tutta Italia", price: 8, category: "Spedizioni", popular: true, emoji: "📦" },
      { name: "Spedizione Express", description: "Consegna in giornata, stesso giorno", price: 25, category: "Express", popular: true, emoji: "⚡" },
      { name: "Trasporto Groupage", description: "Carichi parziali, tariffe competitive", price: 150, category: "Trasporti", emoji: "🚛" },
      { name: "Magazzino & Stoccaggio", description: "Deposito merci con gestione inventario", price: 200, category: "Magazzino", emoji: "🏭" },
      { name: "Spedizione Internazionale", description: "Europa e mondo, via terra o aerea", price: 30, category: "Internazionale", popular: true, emoji: "🌍" },
      { name: "Trasporto ADR", description: "Merci pericolose con autisti certificati", price: 500, category: "Speciali", emoji: "⚠️" },
    ],
    reviews: [
      { name: "E-shop Italia", rating: 5, comment: "Gestiscono tutte le nostre spedizioni, perfetti!" },
      { name: "Marco T.", rating: 5, comment: "Express sempre puntuale, ottimo servizio." },
      { name: "Fabbrica XY", rating: 4, comment: "Groupage affidabile, prezzi competitivi." },
    ],
    features: [
      { icon: "Truck", label: "Flotta Moderna", desc: "50+ veicoli di ogni dimensione" },
      { icon: "MapPin", label: "Tracking Live", desc: "Segui la spedizione in tempo reale" },
      { icon: "Shield", label: "Assicurazione", desc: "Copertura totale su ogni spedizione" },
    ],
  },

  custom: {
    companyName: "La Tua Attività",
    tagline: "La piattaforma su misura per il tuo business",
    heroTitle: "Il tuo business, digitalizzato",
    heroSubtitle: "Gestisci clienti, ordini e appuntamenti da un'unica piattaforma",
    address: "Via Roma 1, Italia",
    city: "Italia",
    phone: "+39 800 123 456",
    email: "info@tuaattivita.it",
    bookingLabel: "Contattaci",
    ctaLabel: "Scopri di Più",
    bookingFields: ["name", "phone", "email", "notes"],
    hours: [
      { day: "Lun - Ven", hours: "09:00 - 18:00" },
    ],
    services: [
      { name: "Consulenza Iniziale", description: "Analizziamo insieme le tue esigenze", price: 0, category: "Consulenza", popular: true, emoji: "💬" },
      { name: "Setup Piattaforma", description: "Configurazione completa del tuo account", price: 99, category: "Setup", popular: true, emoji: "⚙️" },
      { name: "Formazione Team", description: "Training personalizzato per il tuo staff", price: 200, category: "Formazione", emoji: "📚" },
      { name: "Supporto Premium", description: "Assistenza dedicata prioritaria", price: 49, category: "Supporto", emoji: "🎯" },
    ],
    reviews: [
      { name: "Cliente Demo", rating: 5, comment: "Piattaforma facile da usare e completa." },
    ],
    features: [
      { icon: "Settings", label: "Personalizzabile", desc: "Adattabile a qualsiasi tipo di business" },
      { icon: "Zap", label: "Pronto all'Uso", desc: "Operativo in pochi minuti" },
      { icon: "Shield", label: "Sicuro", desc: "Dati protetti e backup automatici" },
    ],
  },
};

export const DEMO_SLUGS: Record<IndustryId, string> = {
  food: "impero-roma",
  ncc: "royal-transfer-roma",
  beauty: "glow-beauty-milano",
  healthcare: "studio-salus-torino",
  retail: "bottega-artigiana-firenze",
  fitness: "iron-gym-milano",
  hospitality: "villa-belvedere",
  beach: "lido-azzurro-rimini",
  plumber: "idraulica-rapida-bologna",
  electrician: "elettrica-moderna-verona",
  agriturismo: "podere-del-sole",
  cleaning: "pulitopro-modena",
  legal: "studio-martini-napoli",
  accounting: "studio-rossi-padova",
  garage: "autofficina-rossi-brescia",
  photography: "luce-studio-firenze",
  construction: "edil-costruzioni-bergamo",
  gardening: "verde-vivo-lucca",
  veterinary: "clinica-amica-genova",
  tattoo: "ink-factory-bologna",
  childcare: "piccoli-passi-parma",
  education: "accademia-sapere-bologna",
  events: "dream-events-milano",
  logistics: "flash-logistica-piacenza",
  custom: "demo-custom",
};
