import { DEMO_SLUGS } from "@/data/demo-industries";

export type SectorPack = {
  id: string;
  emoji: string;
  label: string;
  tagline: string;
  hero: string;
  pains: string[];
  wins: string[];
  agents: string[];
  preview: { name: string; route: string };
  accent: string; // hex
};

// Pacchetti curati per i settori più caldi — link diretti ai demo Lovable
export const SECTOR_PACKS: SectorPack[] = [
  {
    id: "food",
    emoji: "🍝",
    label: "Ristoranti & Pizzerie",
    tagline: "Sala piena, cucina sotto controllo, recensioni a 5 stelle.",
    hero: "Il tuo ristorante diventa una macchina che si gestisce da sola.",
    pains: ["Telefono che squilla mentre servi", "No-show che bruciano coperti", "Recensioni negative non gestite"],
    wins: ["+38% prenotazioni dirette", "−72% no-show con reminder AI", "Risposta in 4 secondi h24"],
    agents: ["Maître AI", "Chef Digital", "Review Shield", "Loyalty Concierge"],
    preview: { name: "Impero Roma", route: `/r/${DEMO_SLUGS.food}` },
    accent: "#F5DBA2",
  },
  {
    id: "ncc",
    emoji: "🚘",
    label: "NCC & Transfer Luxury",
    tagline: "Booking premium, autisti coordinati, guest che ritornano.",
    hero: "Mercedes pronte, autisti briefati, prenotazioni che si chiudono da sole.",
    pains: ["Quote chieste e mai chiuse", "Voli in ritardo non monitorati", "Hotel che non ti girano i clienti"],
    wins: ["Quote in 90 secondi 24/7", "Tracking voli automatico", "Concierge multilingua"],
    agents: ["Concierge AI", "Smart Dispatcher", "Fleet Sentinel", "Tour Planner"],
    preview: { name: "Amalfi Luxury Transfer", route: `/b/${DEMO_SLUGS.ncc}` },
    accent: "#8A7CFF",
  },
  {
    id: "beauty",
    emoji: "💆‍♀️",
    label: "Beauty, SPA & Hair",
    tagline: "Agenda piena, clienti fidelizzati, zero appuntamenti persi.",
    hero: "L'agenda si riempie da sola, i tuoi operatori non rispondono più al telefono.",
    pains: ["Whatsapp che esplode in pausa", "Clienti che spariscono dopo 60 giorni", "Operatori inattivi a metà giornata"],
    wins: ["+52% riprenotazioni automatiche", "Riempimento slot vuoti in 5 min", "Upsell trattamenti +28%"],
    agents: ["Concierge Salone", "Loyalty Coach", "Smart Scheduler", "Recall AI"],
    preview: { name: "Glow Beauty Milano", route: `/demo/${DEMO_SLUGS.beauty}` },
    accent: "#F58B7C",
  },
  {
    id: "healthcare",
    emoji: "🩺",
    label: "Studi Medici & Dentisti",
    tagline: "Pazienti gestiti, agende ottimizzate, conformità sicura.",
    hero: "Anamnesi, prenotazioni, richiami: tutto orchestrato senza segretaria.",
    pains: ["Segretaria sommersa", "Pazienti che saltano la visita", "Richiami persi"],
    wins: ["Triage automatico h24", "−61% mancate visite", "Richiami clinici puntuali"],
    agents: ["Triage AI", "Smart Recall", "Compliance Sentinel", "Patient Concierge"],
    preview: { name: "Studio Salus Torino", route: `/demo/${DEMO_SLUGS.healthcare}` },
    accent: "#4DD9E5",
  },
  {
    id: "hospitality",
    emoji: "🏨",
    label: "Hotel & B&B Boutique",
    tagline: "Direct booking, guest deliziati, OTA fee abbattute.",
    hero: "Il tuo concierge AI parla 12 lingue e converte richieste in prenotazioni dirette.",
    pains: ["Booking.com prende il 18%", "Richieste di notte ignorate", "Recensioni instabili"],
    wins: ["+41% direct booking", "Risposta multilingua h24", "Upsell esperienze automatizzato"],
    agents: ["Concierge Multilingua", "Direct Booking AI", "Experience Curator", "Review Shield"],
    preview: { name: "Villa Belvedere", route: `/demo/${DEMO_SLUGS.hospitality}` },
    accent: "#E7C679",
  },
  {
    id: "fitness",
    emoji: "🏋️",
    label: "Palestre & Studio Fitness",
    tagline: "Lead caldi, abbonamenti rinnovati, classi sempre piene.",
    hero: "I tuoi lead vengono qualificati, scaldati e chiusi mentre alleni.",
    pains: ["Lead Instagram che dimentichi", "Abbonamenti che scadono in silenzio", "Classi semivuote"],
    wins: ["Lead richiamati in 3 minuti", "Rinnovi automatici +34%", "Classi al 92% di riempimento"],
    agents: ["Lead Hunter", "Renewal Coach", "Class Filler", "Member Concierge"],
    preview: { name: "Iron Gym Milano", route: `/demo/${DEMO_SLUGS.fitness}` },
    accent: "#7DD9B5",
  },
  {
    id: "plumber",
    emoji: "🔧",
    label: "Idraulici & Tecnici",
    tagline: "Emergenze gestite, preventivi in chat, agenda piena.",
    hero: "Quando squilla alle 2 di notte, l'AI risponde, qualifica e ti svegli solo se ne vale la pena.",
    pains: ["Emergenze notturne perse", "Preventivi che non arrivano mai", "Pagamenti dimenticati"],
    wins: ["Triage emergenze h24", "Preventivo in chat in 45 sec", "Solleciti automatici"],
    agents: ["Emergency Triage", "Quote Builder", "Smart Dispatcher", "Payment Sentinel"],
    preview: { name: "Idraulica Rapida Bologna", route: `/demo/${DEMO_SLUGS.plumber}` },
    accent: "#B6A9FF",
  },
  {
    id: "agriturismo",
    emoji: "🌿",
    label: "Agriturismi & Ville",
    tagline: "Esperienze vendute, calendario sincronizzato, ospiti felici.",
    hero: "Camere, esperienze, cene: un unico AI orchestra tutto in 8 lingue.",
    pains: ["Calendario double-booking", "Esperienze non monetizzate", "Ospiti che non tornano"],
    wins: ["Channel manager AI sincrono", "Bundle esperienze +47%", "Recensioni 4.9★ stabili"],
    agents: ["Direct Booking AI", "Experience Curator", "Local Storyteller", "Loyalty AI"],
    preview: { name: "Podere del Sole", route: `/demo/${DEMO_SLUGS.agriturismo}` },
    accent: "#9AEBF3",
  },
];

export const HERO_PHASES = [
  {
    eyebrow: "Empire.AI · Agenzia AI Italiana",
    title: { lead: "Sostituisci i tuoi", accent: "dipendenti", tail: "con AI che lavorano 24/7." },
    sub: "Agenti vocali e digitali addestrati sulla tua azienda. Rispondono ai clienti, gestiscono appuntamenti, chiudono vendite — mentre tu dormi.",
    cta: { primary: "Prenota call gratuita", secondary: "Vedi i settori live" },
    proof: ["★★★★★ 4,9/5 su 127 PMI italiane", "14 giorni al go-live", "Garanzia 30gg o rimborsato"],
  },
  {
    eyebrow: "Il calcolo è brutale",
    title: { lead: "Risparmia", accent: "€120.000", tail: "ogni singolo anno." },
    sub: "Un dipendente FTE in Italia ti costa €35K + contributi + ferie + sostituti. Un agente Empire costa quanto un caffè al giorno e non si ammala mai.",
    cta: { primary: "Configura il tuo pacchetto", secondary: "Calcola il risparmio" },
    proof: ["💰 €120k+ risparmio medio/anno", "⚡ 3.400h umane liberate", "📈 +47% conversione"],
  },
  {
    eyebrow: "Velocità chirurgica",
    title: { lead: "14 giorni", accent: "al go-live", tail: ". Zero scuse." },
    sub: "Briefing lunedì, agenti in produzione entro due settimane. 30 giorni soddisfatto o rimborsato. Senza avvocati, senza clausole nascoste.",
    cta: { primary: "Inizia adesso", secondary: "Come funziona la garanzia" },
    proof: ["✓ Garanzia 30 giorni", "✓ Zero vincoli", "✓ Proprietà totale del sistema"],
  },
];

export const AGENT_FAMILIES = [
  {
    id: "voice",
    title: "Voice Agents",
    subtitle: "Risponde, qualifica, prenota — al telefono e in chat.",
    icon: "Mic",
    accent: "#8A7CFF",
    skills: ["Italiano nativo + 12 lingue", "Trasferisce a umano se serve", "Memoria cliente persistente"],
    impact: "Tasso di risposta 100% h24",
  },
  {
    id: "concierge",
    title: "Concierge AI",
    subtitle: "Maître virtuale che vende esperienze e upsell.",
    icon: "Sparkles",
    accent: "#4DD9E5",
    skills: ["Suggerisce upsell smart", "Personalizza per cliente VIP", "Multilingua certificato"],
    impact: "+38% scontrino medio",
  },
  {
    id: "ops",
    title: "Operations AI",
    subtitle: "Orchestrazione agende, scorte, turni, fornitori.",
    icon: "Workflow",
    accent: "#F5DBA2",
    skills: ["Anti-overbooking", "Riassegnazioni live", "Forecast richieste"],
    impact: "−61% errori operativi",
  },
  {
    id: "growth",
    title: "Growth AI",
    subtitle: "Lead nurturing, recall, recensioni, social.",
    icon: "TrendingUp",
    accent: "#F58B7C",
    skills: ["Riattiva clienti dormienti", "Genera contenuti brand", "Gestisce recensioni"],
    impact: "+47% conversione lead",
  },
  {
    id: "sentinel",
    title: "Compliance Sentinel",
    subtitle: "Privacy, fatture, scadenze, fisco.",
    icon: "ShieldCheck",
    accent: "#B6A9FF",
    skills: ["GDPR by design", "Allerta scadenze", "Audit log completo"],
    impact: "Zero sanzioni in 18 mesi",
  },
  {
    id: "insight",
    title: "Insight AI",
    subtitle: "Dashboard predittiva e KPI vivi h24.",
    icon: "BarChart3",
    accent: "#7DD9B5",
    skills: ["Forecast cassa", "Cohort clienti", "Alert anomalie"],
    impact: "Decisioni in 30 secondi",
  },
];

export const TEAM_MEMBERS = [
  { name: "Kevin Berardini", role: "Founder & CEO", bio: "Ex consulente enterprise, ha portato AI in 127 PMI italiane in 18 mesi.", initials: "KB", accent: "#8A7CFF" },
  { name: "Giulia Sales", role: "Head of Growth", bio: "Costruisce funnel di vendita predittivi che hanno chiuso oltre 4M€ in 12 mesi.", initials: "GS", accent: "#F5DBA2" },
  { name: "Luca AI Lab", role: "AI Lead Engineer", bio: "Architetto degli agenti vocali multilingua di Empire. Ex Big Tech.", initials: "LA", accent: "#4DD9E5" },
  { name: "Sofia Success", role: "Head of Customer Success", bio: "Garantisce go-live in 14 giorni e NPS 92 dei clienti.", initials: "SS", accent: "#F58B7C" },
];

export const FAQS = [
  { q: "Quanto tempo serve per partire?", a: "Briefing il lunedì, agenti operativi entro 14 giorni. Zero attese, zero scuse. Garantito per iscritto." },
  { q: "Sostituisce davvero i miei dipendenti?", a: "Sostituisce le ore meccaniche (rispondere, qualificare, prenotare, ricordare). Le persone restano, ma fanno solo le cose ad alto valore. Risultato: stesso team, +200% di output." },
  { q: "Cosa succede se non funziona?", a: "30 giorni di garanzia totale dal go-live. Se non sei al 100% soddisfatto, ti rimborsiamo l'intero investimento. Senza domande, senza avvocati." },
  { q: "Sono i miei dati al sicuro?", a: "Crittografia AES-256 a riposo, isolamento per tenant via Supabase RLS, conformità GDPR by design. Audit log accessibile sempre." },
  { q: "Funziona con i tool che già uso?", a: "Sì. Integriamo Google Calendar, WhatsApp Business, Stripe, principali gestionali, channel manager OTA, sistemi POS, CRM. Se serve un'integrazione custom, la facciamo." },
  { q: "Quanto costa davvero?", a: "Da €1.997 una tantum (rateizzabile in 3x) per il pacchetto Start, fino a soluzioni custom enterprise. Il pacchetto medio costa quanto 1/3 di un FTE — e lavora 24/7." },
];
