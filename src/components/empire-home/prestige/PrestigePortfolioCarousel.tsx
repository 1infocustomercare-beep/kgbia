import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, X, Check, Quote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmpireScrollDirector } from "../ScrollDirector";
import { createMockupPool } from "@/lib/mockup-pool";
import PrestigePhone, { PHONE_VIEWS } from "./PrestigePhone";

/**
 * PrestigePortfolioCarousel — horizontal swipe carousel + fullscreen detail modal.
 * Inspired by Lowengeld's /flame-kebab case study, adapted for Empire's
 * persuasive narrative (problem → solution → result).
 *
 * Each project ships 4 unique mockups (Home / Admin / App / AI) — never repeated
 * across the homepage thanks to the global mockup pool.
 */

const VISIT_SEED =
  typeof window !== "undefined"
    ? Number(sessionStorage.getItem("empire-home-seed") ?? Date.now())
    : 1;
const pool = createMockupPool({ shuffle: true, seed: VISIT_SEED + 7 });

interface ResultMetric {
  value: string;
  label: string;
  /** Optional before → after detail shown in modal */
  before?: string;
  after?: string;
}

interface Deliverable {
  icon: "site" | "admin" | "app" | "ai" | "wa" | "pay" | "ads" | "loy";
  label: string;
  detail: string;
}

interface Project {
  id: string;
  tag: string;
  title: string;
  city: string;
  /** 1-line headline used on cards */
  oneLiner: string;
  /** 2-3 sentences of context for the modal hero */
  story: string;
  /** Brand voice / sector positioning */
  positioning: string;
  problem: string[];
  solution: string[];
  /** Concrete deliverables shipped — shown as a checklist */
  deliverables: Deliverable[];
  /** Day-by-day rollout timeline */
  timeline: { day: string; what: string }[];
  /** Headline KPIs (3 max) */
  results: ResultMetric[];
  /** Plain-text ROI sentence: economic impact in € */
  roiLine: string;
  testimonial: { quote: string; author: string; role: string };
  /** 4 distinct screens — Home / Admin / App / AI */
  screens: string[];
  /** Per-view caption explaining what's on screen */
  screenCaptions: [string, string, string, string];
  cover: string;
  accent: string;
  /** Investment range, kept generic */
  investment: string;
}

const PROJECTS: Project[] = [
  {
    id: "strapizzami",
    tag: "Pizzeria · Delivery",
    title: "Strapizzami",
    city: "Milano",
    oneLiner: "Da pizzeria di quartiere a marchio digitale che vende anche di notte.",
    story:
      "Pizzeria storica del quartiere Isola, 70 coperti, take-away forte ma telefono perennemente occupato nel weekend. Volevano smettere di rifiutare ordini e trasformare i clienti occasionali in clienti fedeli, senza assumere altro personale al banco.",
    positioning: "Verace, popolare, contemporanea. Tono diretto, mai snob.",
    problem: [
      "Telefono occupato 4 ore al giorno nel rush serale, ordini persi quotidianamente.",
      "Ordini WhatsApp dispersi tra centinaia di messaggi senza tracciamento.",
      "Nessun modo di riconoscere chi tornava 3 volte alla settimana.",
      "Recensioni Google ferme a 4.2 senza un sistema per chiederle.",
    ],
    solution: [
      "Sito ordini con menu visivo e checkout in 30 secondi (Apple Pay, Google Pay, contanti alla consegna).",
      "AI WhatsApp che risponde in 12 secondi a prezzi, allergeni, orari, prenotazioni.",
      "Programma fedeltà a punti automatico con premi e compleanno.",
      "Stampa diretta in cucina degli ordini → zero errori di trascrizione.",
      "Richiesta recensione automatica 2 ore dopo la consegna.",
    ],
    deliverables: [
      { icon: "site", label: "Sito menu digitale", detail: "Pagine prodotto fotografiche, allergeni, ordini diretti." },
      { icon: "admin", label: "Cassa & cucina", detail: "Dashboard ordini, stampa automatica, gestione turni." },
      { icon: "app", label: "App PWA cliente", detail: "Riordina con un tap, punti fedeltà, push notifiche." },
      { icon: "ai", label: "AI WhatsApp", detail: "Risponde 24/7, prende ordini e prenotazioni." },
      { icon: "pay", label: "Pagamenti integrati", detail: "Stripe, Apple Pay, Klarna, contanti alla consegna." },
      { icon: "loy", label: "Loyalty automatica", detail: "Punti, premi, compleanno, recupero clienti dormienti." },
    ],
    timeline: [
      { day: "Giorno 1", what: "Brief + import menu e foto esistenti." },
      { day: "Giorno 2-5", what: "Sito + admin live, AI addestrata sul menu reale." },
      { day: "Giorno 6", what: "Test ordini interni, formazione 30 min al titolare." },
      { day: "Giorno 7", what: "Go-live, prima campagna SMS al database storico." },
    ],
    results: [
      { value: "+38%", label: "ordini serali", before: "84/sera", after: "116/sera" },
      { value: "0", label: "chiamate perse", before: "~22/sera", after: "0" },
      { value: "12s", label: "tempo risposta WhatsApp", before: "8 min medio", after: "12 secondi" },
    ],
    roiLine: "≈ €4.800 di ricavi extra al mese, recuperati nei primi 21 giorni.",
    testimonial: {
      quote: "Prima rifiutavamo ordini perché il telefono era sempre occupato. Adesso l'AI risponde a tutti, anche quando chiudiamo. È come avere un dipendente in più che non si ammala mai.",
      author: "Marco R.",
      role: "Titolare",
    },
    screens: pool.images(4),
    screenCaptions: [
      "Sito ordini: menu fotografico + checkout in 30s",
      "Admin cucina: ordini live + stampa automatica",
      "App cliente: riordina, punti fedeltà, notifiche",
      "AI WhatsApp: risponde in 12 secondi, 24/7",
    ],
    cover: "",
    accent: "hsl(20 80% 50%)",
    investment: "Piano Crescita · 90 giorni gratis poi €149/mese",
  },
  {
    id: "paperfish",
    tag: "Sushi · Fine Dining",
    title: "Paperfish",
    city: "Roma",
    oneLiner: "L'esperienza del ristorante stellato, anche prima di entrare.",
    story:
      "Sushi omakase di alta gamma, 22 posti, lista d'attesa di 3 settimane ma il 15% degli ospiti non si presentava. Volevano un'immagine digitale all'altezza dell'esperienza in sala, e un sistema che rispettasse il rituale del fine dining.",
    positioning: "Editoriale, minimal, sussurrato. Nessun bottone aggressivo.",
    problem: [
      "Prenotazioni gestite a mano da un solo cameriere su quaderno.",
      "No-show del 15% = ~€2.400 di perdita a settimana.",
      "Nessuna immagine digitale del fine dining: il sito vecchio rovinava l'esperienza.",
      "Impossibile gestire la lista d'attesa in modo intelligente.",
    ],
    solution: [
      "Sito editoriale con storytelling dei piatti, fotografia food premium, animazioni cinematografiche.",
      "Prenotazioni con conferma via mail + 2 reminder WhatsApp (24h e 3h prima).",
      "Carta di credito a garanzia (charge automatico in caso di no-show).",
      "Admin con calendario sale, allergie, lista d'attesa intelligente che richiama in automatico.",
      "Menu degustazione personalizzato in base alle preferenze dichiarate dal cliente.",
    ],
    deliverables: [
      { icon: "site", label: "Sito editoriale premium", detail: "Storytelling piatti, foto chef, prenotazioni." },
      { icon: "admin", label: "Calendario sala", detail: "Tavoli, allergie, lista d'attesa, no-show tracking." },
      { icon: "app", label: "PWA ospite", detail: "Conferma, modifica, carta digitale, ricordo serate." },
      { icon: "ai", label: "AI concierge", detail: "Risponde a richieste speciali in IT/EN/JP." },
      { icon: "pay", label: "Caparra automatica", detail: "Stripe pre-auth, charge solo su no-show." },
    ],
    timeline: [
      { day: "Settimana 1", what: "Shooting fotografico piatti + brand audit." },
      { day: "Settimana 2", what: "Sito + sistema prenotazioni live, importazione storico clienti." },
      { day: "Settimana 3", what: "AI concierge, training staff, soft launch." },
    ],
    results: [
      { value: "−92%", label: "no-show", before: "15%", after: "1.2%" },
      { value: "+24%", label: "scontrino medio", before: "€95", after: "€118" },
      { value: "4.9★", label: "Google reviews", before: "4.6★ (212)", after: "4.9★ (487)" },
    ],
    roiLine: "≈ €9.600 al mese recuperati tra no-show evitati e upsell sul menu degustazione.",
    testimonial: {
      quote: "Il sito comunica esattamente l'eleganza che viviamo in sala. I clienti arrivano già preparati all'esperienza, sanno cosa aspettarsi. È diventato parte del rituale.",
      author: "Yuki T.",
      role: "Executive Chef",
    },
    screens: pool.images(4),
    screenCaptions: [
      "Sito editoriale: storytelling piatti + prenotazione",
      "Admin sala: calendario, allergie, lista d'attesa",
      "App ospite: conferma, modifica, carta digitale",
      "AI concierge: risposte personalizzate IT/EN/JP",
    ],
    cover: "",
    accent: "hsl(340 50% 55%)",
    investment: "Piano Premium · 90 giorni gratis poi €249/mese",
  },
  {
    id: "empire-ncc",
    tag: "NCC · Luxury Transfer",
    title: "Empire NCC",
    city: "Milano · Como · Sankt Moritz",
    oneLiner: "Un centralino AI che parla 4 lingue e non dorme mai.",
    story:
      "Flotta NCC luxury con 14 vetture (Mercedes Classe S, V-Class, Bentley) tra Milano, Como e Sankt Moritz. Clientela 70% straniera, richieste a tutte le ore, preventivi calcolati a mano dal titolare. Volevano scalare senza perdere il tono premium.",
    positioning: "Discreto, lusso silenzioso, oro caldo su nero.",
    problem: [
      "Richieste internazionali fuori orario non gestite (cliente sceglie il primo che risponde).",
      "Preventivi a mano: 8-12 minuti ciascuno, errori frequenti su tariffe stagionali.",
      "Autisti senza visibilità sulla giornata, comunicazione via WhatsApp caotica.",
      "Fatturazione clienti business gestita a fine mese in Excel.",
    ],
    solution: [
      "Sito multilingua (IT/EN/FR/RU) con preventivo istantaneo basato su tratta, vettura, orario.",
      "AI vocale che gestisce chiamate fuori orario in 4 lingue con voce umana naturale.",
      "App autisti con corse del giorno, navigazione, foto ritiro/consegna, firma digitale.",
      "Admin con dashboard prenotazioni, gestione flotta, fatturazione automatica B2B.",
      "Integrazione con Stripe + bonifico SEPA + fattura elettronica SDI.",
    ],
    deliverables: [
      { icon: "site", label: "Sito multilingua premium", detail: "4 lingue, preventivo istantaneo, prenotazione." },
      { icon: "admin", label: "Centralino flotta", detail: "Corse, autisti, vetture, calendario, KPI." },
      { icon: "app", label: "App autisti", detail: "Corse, navigazione, firma digitale, pagamenti." },
      { icon: "ai", label: "AI vocale 4 lingue", detail: "Risponde, qualifica, prenota, conferma." },
      { icon: "pay", label: "Fatturazione SDI", detail: "Carte, SEPA, fattura elettronica automatica." },
    ],
    timeline: [
      { day: "Settimana 1", what: "Audit tariffe + import clientela storica." },
      { day: "Settimana 2", what: "Sito 4 lingue + admin live, integrazione Stripe + SDI." },
      { day: "Settimana 3", what: "AI vocale addestrata, app autisti distribuita." },
      { day: "Settimana 4", what: "Go-live + monitoraggio chiamate prima settimana." },
    ],
    results: [
      { value: "×3.2", label: "richieste serali", before: "12/sera", after: "38/sera" },
      { value: "100%", label: "lingue coperte", before: "Solo IT", after: "IT/EN/FR/RU" },
      { value: "−70%", label: "tempo amministrativo", before: "22h/sett", after: "6h/sett" },
    ],
    roiLine: "≈ €18.000/mese di nuove corse + 16h a settimana liberate per il titolare.",
    testimonial: {
      quote: "Ricevo prenotazioni da clienti russi alle 3 di notte. Prima era impossibile. Oggi è normale e ne sono felicissimo. La voce dell'AI è così naturale che molti pensano sia una segretaria.",
      author: "Alessandro V.",
      role: "Founder",
    },
    screens: pool.images(4),
    screenCaptions: [
      "Sito multilingua: preventivo istantaneo IT/EN/FR/RU",
      "Centralino: flotta live, corse, KPI, fatturazione",
      "App autisti: corse, navigazione, firma digitale",
      "AI vocale: risponde 24/7 nelle 4 lingue",
    ],
    cover: "",
    accent: "hsl(45 70% 55%)",
    investment: "Piano Enterprise · 90 giorni gratis poi €399/mese",
  },
  {
    id: "velvet-studio",
    tag: "Beauty · Spa",
    title: "Velvet Studio",
    city: "Torino",
    oneLiner: "Agenda piena tutti i giorni, senza alzare mai il telefono.",
    story:
      "Centro estetico boutique con 4 cabine e 6 operatrici, agenda gestita a mano dalla receptionist che passava metà della giornata al telefono. Volevano liberare la receptionist per coccolare i clienti in salone, e riempire i buchi lasciati dalle cancellazioni dell'ultimo minuto.",
    positioning: "Femminile, rassicurante, rosa cipria + oro rosé.",
    problem: [
      "Receptionist 4 ore al giorno al telefono = clienti in salone trascurati.",
      "Cancellazioni dell'ultimo minuto difficili da riempire (perdita ~€600/sett).",
      "Nessuna comunicazione post-trattamento → poca fidelizzazione.",
      "Buoni regalo cartacei spesso persi o dimenticati.",
    ],
    solution: [
      "Booking online con scelta operatrice + servizio + cabina, anche da Instagram.",
      "AI WhatsApp per spostamenti, conferme, lista d'attesa intelligente che richiama in automatico.",
      "App cliente con storico trattamenti, promemoria home-care personalizzati, pacchetti.",
      "Buoni regalo digitali con card animata, condivisibili via WhatsApp.",
      "Programma fedeltà a livelli con premi crescenti.",
    ],
    deliverables: [
      { icon: "site", label: "Sito booking", detail: "Servizi, operatrici, prenotazione 24/7." },
      { icon: "admin", label: "Gestionale salone", detail: "Agenda, cabine, operatrici, magazzino prodotti." },
      { icon: "app", label: "App cliente", detail: "Storico, home-care, pacchetti, fedeltà." },
      { icon: "ai", label: "AI WhatsApp", detail: "Conferme, spostamenti, recall liste d'attesa." },
      { icon: "loy", label: "Buoni regalo digitali", detail: "Card animata, condivisione WhatsApp." },
    ],
    timeline: [
      { day: "Giorno 1-3", what: "Import agenda + listino + foto cabine." },
      { day: "Giorno 4-7", what: "Sito booking + admin live, formazione operatrici." },
      { day: "Giorno 8-10", what: "AI WhatsApp + app cliente, lancio al database storico." },
    ],
    results: [
      { value: "+47%", label: "occupazione agenda", before: "62%", after: "91%" },
      { value: "−60%", label: "no-show", before: "11%", after: "4.4%" },
      { value: "8h/sett", label: "tempo recuperato", before: "20h al telefono", after: "12h al telefono" },
    ],
    roiLine: "≈ €2.400/mese di trattamenti extra + receptionist finalmente in salone.",
    testimonial: {
      quote: "La mia receptionist finalmente fa quello per cui l'ho assunta: coccolare i clienti in salone, offrire un caffè, vendere un pacchetto. Le clienti se ne accorgono e tornano più volentieri.",
      author: "Giulia M.",
      role: "Owner",
    },
    screens: pool.images(4),
    screenCaptions: [
      "Sito booking: prenotazione con scelta operatrice",
      "Gestionale: agenda, cabine, magazzino prodotti",
      "App cliente: storico, home-care, fedeltà",
      "AI WhatsApp: conferme + recall liste d'attesa",
    ],
    cover: "",
    accent: "hsl(320 50% 60%)",
    investment: "Piano Crescita · 90 giorni gratis poi €149/mese",
  },
  {
    id: "asinara-resort",
    tag: "Boutique Hotel",
    title: "Asinara Resort",
    city: "Sardegna",
    oneLiner: "Concierge digitale 24/7, in 6 lingue, sempre sul tono giusto.",
    story:
      "Boutique resort 5★ sull'isola dell'Asinara, 18 camere, clientela internazionale (DE/UK/FR/IT/US/RU). Pagavano ~22% di commissione a Booking.com e gli ospiti non scoprivano mai i servizi extra (escursioni, spa, charter barca). Volevano spostare la prenotazione sul canale diretto.",
    positioning: "Mediterraneo elegante, blu profondo + sabbia + corallo.",
    problem: [
      "Ospiti internazionali con richieste a tutte le ore in lingue diverse.",
      "Booking diretti persi a vantaggio degli OTA (22% commissione).",
      "Servizi extra (escursioni, spa, charter) sotto-venduti per scarsa visibilità.",
      "Check-in lento, code in reception nei giorni di cambio.",
    ],
    solution: [
      "Sito direct-booking con mappa esperienze interattiva e best-rate guarantee.",
      "Concierge AI multilingua su WhatsApp che pre-vende esperienze già in fase di booking.",
      "Check-in online + chiave digitale → ospite va direttamente in camera.",
      "Admin con upselling automatico: pre-arrivo (escursioni), in-stay (spa), post-stay (recensioni).",
      "Newsletter automatica stagionale con offerte personalizzate per cluster ospite.",
    ],
    deliverables: [
      { icon: "site", label: "Sito direct-booking", detail: "Best rate, mappa esperienze, motore prenotazioni." },
      { icon: "admin", label: "PMS leggero", detail: "Camere, ospiti, upselling, revenue management." },
      { icon: "app", label: "App ospite", detail: "Check-in, chiave digitale, room service, escursioni." },
      { icon: "ai", label: "Concierge AI 6 lingue", detail: "WhatsApp h24, suggerisce esperienze, prenota." },
      { icon: "ads", label: "Email marketing", detail: "Newsletter stagionali + recall ospiti." },
    ],
    timeline: [
      { day: "Settimana 1", what: "Import camere, tariffe, foto, esperienze locali." },
      { day: "Settimana 2-3", what: "Sito + booking engine + integrazione PMS esistente." },
      { day: "Settimana 4", what: "AI concierge multilingua + check-in digitale." },
    ],
    results: [
      { value: "+58%", label: "booking diretti", before: "31%", after: "49%" },
      { value: "+31%", label: "ricavi extra", before: "€48k/anno", after: "€63k/anno" },
      { value: "6", label: "lingue native", before: "Solo IT/EN", after: "IT/EN/DE/FR/RU/ES" },
    ],
    roiLine: "≈ €31.000/anno risparmiati in commissioni OTA + €15k extra da upselling.",
    testimonial: {
      quote: "Abbiamo dimezzato la commissione Booking.com e gli ospiti dicono che il nostro 'concierge' è il migliore mai avuto. Spesso non si rendono conto che è un'AI, anche perché conosce i sentieri dell'isola meglio di noi.",
      author: "Paolo F.",
      role: "General Manager",
    },
    screens: pool.images(4),
    screenCaptions: [
      "Sito direct-booking: best rate + mappa esperienze",
      "PMS admin: camere, upselling, revenue",
      "App ospite: check-in, chiave digitale, escursioni",
      "AI concierge: WhatsApp 6 lingue, h24",
    ],
    cover: "",
    accent: "hsl(195 60% 50%)",
    investment: "Piano Enterprise · 90 giorni gratis poi €399/mese",
  },
  {
    id: "iron-club",
    tag: "Fitness · Wellness",
    title: "Iron Club",
    city: "Bologna",
    oneLiner: "Onboarding nuovi membri 100% automatico, in 4 minuti.",
    story:
      "Palestra premium con 1.200 iscritti, 8 trainer, area functional + crossfit + sala pesi. I trial gratuiti convertivano poco perché senza follow-up, e l'amministrazione (pagamenti, certificati, scadenze) era un mestiere a sé.",
    positioning: "Energetico, dark mode, accenti arancio elettrico.",
    problem: [
      "Trial gratuiti senza follow-up = conversione 18%.",
      "Pagamenti ricorrenti gestiti a mano (RID, errori, solleciti).",
      "Nessun contatto tra trainer e membri fuori palestra.",
      "Certificati medici scaduti scoperti solo all'ingresso.",
    ],
    solution: [
      "Landing trial con prenotazione + form medico + checkout in 4 minuti.",
      "App membri con prenotazione corsi, scheda PT, video esercizi, chat trainer.",
      "AI che fa follow-up post-trial in 3 step, propone l'abbonamento giusto, gestisce obiezioni.",
      "Pagamenti ricorrenti automatici con Stripe + alert scadenza certificato medico.",
      "Programma referral con sconto al membro che porta un amico.",
    ],
    deliverables: [
      { icon: "site", label: "Landing trial", detail: "Prenotazione + form medico + tour virtuale." },
      { icon: "admin", label: "Gestionale palestra", detail: "Membri, abbonamenti, certificati, ricavi." },
      { icon: "app", label: "App membri", detail: "Prenotazione corsi, scheda PT, chat trainer." },
      { icon: "ai", label: "AI sales", detail: "Follow-up trial, conversione, retention." },
      { icon: "pay", label: "Pagamenti ricorrenti", detail: "Stripe, SEPA, gestione automatica solleciti." },
    ],
    timeline: [
      { day: "Settimana 1", what: "Import database membri + corsi + abbonamenti attivi." },
      { day: "Settimana 2", what: "Sito + app + admin live, training staff." },
      { day: "Settimana 3", what: "AI sales attiva su nuovi trial + recall dormienti." },
    ],
    results: [
      { value: "+72%", label: "trial → abbonati", before: "18%", after: "31%" },
      { value: "−85%", label: "ore amministrative", before: "16h/sett", after: "2.5h/sett" },
      { value: "4.8★", label: "App rating", before: "n/d", after: "4.8★ (340 rec.)" },
    ],
    roiLine: "≈ €6.200/mese di nuovi abbonamenti + 13h a settimana liberate dallo staff.",
    testimonial: {
      quote: "L'AI converte i trial meglio del miglior commerciale che abbia mai avuto. E lavora di domenica, non chiede ferie e non si offende mai quando un cliente è scortese.",
      author: "Luca B.",
      role: "Co-Founder",
    },
    screens: pool.images(4),
    screenCaptions: [
      "Landing trial: prenotazione + form medico in 4 min",
      "Gestionale: membri, abbonamenti, certificati",
      "App membri: corsi, scheda PT, chat trainer",
      "AI sales: follow-up trial e conversione",
    ],
    cover: "",
    accent: "hsl(15 75% 55%)",
    investment: "Piano Premium · 90 giorni gratis poi €249/mese",
  },
];

const DELIV_ICONS: Record<Deliverable["icon"], string> = {
  site: "🌐",
  admin: "🖥️",
  app: "📱",
  ai: "🤖",
  wa: "💬",
  pay: "💳",
  ads: "📣",
  loy: "🎁",
};

// Use the first (Home) screen as cover
PROJECTS.forEach((p) => (p.cover = p.screens[0]));


export default function PrestigePortfolioCarousel() {
  const navigate = useNavigate();
  const { ref } = useEmpireScrollDirector<HTMLDivElement>("prestige-mockups", { steps: 4 });
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);

  const open = openId ? PROJECTS.find((p) => p.id === openId) ?? null : null;

  // Snap-scroll observer to highlight current slide
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const slides = Array.from(el.querySelectorAll<HTMLElement>("[data-slide]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.5) {
            const idx = Number(e.target.getAttribute("data-slide"));
            setActiveIdx(idx);
          }
        });
      },
      { root: el, threshold: [0.5, 0.75] },
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const w = el.clientWidth * 0.85;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      id="prestige-mockups"
      data-section="prestige-mockups"
      className="prestige-section prestige-light py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-deep))" }}>
              ✦ Casi reali · Risultati certificati
            </div>
            <h2
              className="prestige-display mt-3 text-4xl font-semibold sm:text-5xl md:text-6xl"
              style={{ color: "hsl(var(--pr-text-on-light))" }}
            >
              Un sito non basta.<br />
              <span className="prestige-gold-text">Costruiamo ecosistemi.</span>
            </h2>
          </div>
          <p
            className="max-w-sm text-sm sm:text-base"
            style={{ color: "hsl(var(--pr-muted-on-light))" }}
          >
            Ogni progetto include sito vetrina, dashboard admin, app cliente e agente AI su WhatsApp.
            Tocca un caso per vedere problema, soluzione e risultati ottenuti.
          </p>
        </div>

        {/* Desktop arrows */}
        <div className="mt-10 hidden items-center justify-end gap-2 sm:flex">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Progetto precedente"
            className="prestige-arrow"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Progetto successivo"
            className="prestige-arrow"
          >
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Carousel track */}
        <div
          ref={trackRef}
          className="prestige-portfolio-track mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-8 sm:gap-7"
          style={{ scrollPaddingLeft: "1.25rem", scrollbarWidth: "none" }}
        >
          {PROJECTS.map((p, i) => (
            <article
              key={p.id}
              data-slide={i}
              className="snap-start shrink-0"
              style={{ width: "min(82vw, 340px)" }}
            >
              <button
                onClick={() => setOpenId(p.id)}
                className="group block w-full text-left"
              >
                <div
                  className="relative aspect-[4/5] overflow-hidden rounded-3xl"
                  style={{
                    background: `linear-gradient(155deg, ${p.accent}, hsl(var(--pr-emerald-deep)))`,
                    boxShadow: "0 25px 60px -25px hsl(var(--pr-emerald) / 0.6)",
                  }}
                >
                  <img
                    src={p.cover}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-90 transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06] group-active:scale-[1.02]"
                  />
                  {/* Bottom gradient + tag */}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent, hsl(var(--pr-emerald-deep) / 0.92))",
                    }}
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span
                        className="inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          background: "hsl(var(--pr-gold))",
                          color: "hsl(var(--pr-emerald-deep))",
                        }}
                      >
                        {p.tag}
                      </span>
                      <h3
                        className="prestige-display mt-2 text-2xl font-semibold text-white"
                        style={{ textShadow: "0 2px 14px hsl(0 0% 0% / 0.5)" }}
                      >
                        {p.title}
                      </h3>
                      <p className="mt-0.5 text-[11px] uppercase tracking-wider text-white/70">
                        {p.city}
                      </p>
                    </div>
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full"
                      style={{
                        background: "hsl(var(--pr-gold))",
                        color: "hsl(var(--pr-emerald-deep))",
                      }}
                    >
                      <ExternalLink size={14} />
                    </div>
                  </div>
                </div>
                <p
                  className="mt-3 line-clamp-2 text-sm"
                  style={{ color: "hsl(var(--pr-muted-on-light))" }}
                >
                  {p.oneLiner}
                </p>
              </button>
            </article>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5">
          {PROJECTS.map((_, i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === activeIdx ? 22 : 6,
                background:
                  i === activeIdx
                    ? "hsl(var(--pr-gold))"
                    : "hsl(var(--pr-emerald) / 0.25)",
              }}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button onClick={() => navigate("/portfolio")} className="prestige-cta-ghost">
            Esplora il portfolio completo <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Detail modal */}
      {open && <ProjectModal project={open} onClose={() => setOpenId(null)} />}

      <style>{`
        .prestige-portfolio-track::-webkit-scrollbar { display: none; }
        .prestige-arrow {
          width: 44px; height: 44px;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 999px;
          background: hsl(var(--pr-emerald));
          color: hsl(var(--pr-gold-light));
          border: 1px solid hsl(var(--pr-gold) / 0.35);
          transition: transform .25s ease, background .25s ease;
          cursor: pointer;
        }
        .prestige-arrow:hover {
          transform: translateY(-2px);
          background: hsl(var(--pr-emerald-deep));
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────── Modal ─────────────────────── */

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [phoneIdx, setPhoneIdx] = useState(0);

  // ESC to close
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-stretch justify-center overflow-y-auto"
      style={{
        background: "hsl(var(--pr-emerald-deep) / 0.96)",
        backdropFilter: "blur(20px)",
        animation: "prestigeFadeIn .35s ease-out",
      }}
      onClick={onClose}
    >
      <div
        className="relative my-0 w-full max-w-5xl bg-transparent"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "prestigeSlideUp .5s cubic-bezier(.22,1,.36,1)" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Chiudi"
          className="fixed right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full"
          style={{
            background: "hsl(var(--pr-gold))",
            color: "hsl(var(--pr-emerald-deep))",
            boxShadow: "0 8px 30px -8px hsl(0 0% 0% / 0.5)",
          }}
        >
          <X size={20} />
        </button>

        <div className="px-5 py-12 sm:px-10 sm:py-16">
          {/* Header */}
          <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-light))" }}>
            ✦ Caso studio · {project.tag}
          </div>
          <h3
            className="prestige-display mt-3 text-4xl font-semibold sm:text-5xl md:text-6xl"
            style={{ color: "hsl(var(--pr-text-on-dark))" }}
          >
            {project.title}
          </h3>
          <p
            className="mt-2 text-sm uppercase tracking-[0.3em]"
            style={{ color: "hsl(var(--pr-muted-on-dark))" }}
          >
            {project.city}
          </p>
          <p
            className="prestige-display mt-6 max-w-3xl text-xl italic sm:text-2xl"
            style={{ color: "hsl(var(--pr-gold-light))" }}
          >
            "{project.oneLiner}"
          </p>

          {/* Phone showcase — 4 views with switcher */}
          <div className="mt-12 grid gap-10 md:grid-cols-2 md:items-center">
            <div className="flex flex-col items-center">
              <PrestigePhone
                src={project.screens[phoneIdx]}
                label={PHONE_VIEWS[phoneIdx]}
                width={280}
                loading="eager"
              />
              <div className="mt-10 flex gap-2">
                {PHONE_VIEWS.map((v, i) => (
                  <button
                    key={v}
                    onClick={() => setPhoneIdx(i)}
                    className="rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all"
                    style={{
                      background:
                        i === phoneIdx
                          ? "hsl(var(--pr-gold))"
                          : "hsl(var(--pr-emerald-mid) / 0.6)",
                      color:
                        i === phoneIdx
                          ? "hsl(var(--pr-emerald-deep))"
                          : "hsl(var(--pr-gold-light))",
                      border:
                        i === phoneIdx
                          ? "1px solid transparent"
                          : "1px solid hsl(var(--pr-gold) / 0.3)",
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Problem / Solution */}
            <div className="space-y-8">
              <div>
                <div
                  className="prestige-eyebrow"
                  style={{ color: "hsl(var(--pr-gold-light))" }}
                >
                  Il problema
                </div>
                <ul className="mt-3 space-y-2">
                  {project.problem.map((t) => (
                    <li
                      key={t}
                      className="flex gap-2 text-sm sm:text-base"
                      style={{ color: "hsl(var(--pr-muted-on-dark))" }}
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400/80" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div
                  className="prestige-eyebrow"
                  style={{ color: "hsl(var(--pr-gold-light))" }}
                >
                  La nostra soluzione
                </div>
                <ul className="mt-3 space-y-2">
                  {project.solution.map((t) => (
                    <li
                      key={t}
                      className="flex gap-2 text-sm sm:text-base"
                      style={{ color: "hsl(var(--pr-text-on-dark))" }}
                    >
                      <Check
                        size={16}
                        className="mt-1 shrink-0"
                        style={{ color: "hsl(var(--pr-gold-light))" }}
                      />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mt-16">
            <div
              className="prestige-eyebrow text-center"
              style={{ color: "hsl(var(--pr-gold-light))" }}
            >
              Risultati a 90 giorni
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-6">
              {project.results.map((r) => (
                <div
                  key={r.label}
                  className="rounded-2xl p-4 text-center sm:p-6"
                  style={{
                    background: "hsl(var(--pr-emerald-mid) / 0.5)",
                    border: "1px solid hsl(var(--pr-gold) / 0.25)",
                  }}
                >
                  <div
                    className="prestige-display text-3xl font-semibold sm:text-5xl"
                    style={{ color: "hsl(var(--pr-gold-light))" }}
                  >
                    {r.value}
                  </div>
                  <div
                    className="mt-1 text-[10px] uppercase tracking-wider sm:text-xs"
                    style={{ color: "hsl(var(--pr-muted-on-dark))" }}
                  >
                    {r.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div
            className="mt-16 rounded-3xl p-6 sm:p-10"
            style={{
              background:
                "linear-gradient(145deg, hsl(var(--pr-emerald-mid) / 0.6), hsl(var(--pr-emerald) / 0.3))",
              border: "1px solid hsl(var(--pr-gold) / 0.3)",
            }}
          >
            <Quote
              size={28}
              style={{ color: "hsl(var(--pr-gold))" }}
              className="opacity-80"
            />
            <p
              className="prestige-display mt-3 text-lg italic sm:text-2xl"
              style={{ color: "hsl(var(--pr-text-on-dark))" }}
            >
              {project.testimonial.quote}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full font-semibold"
                style={{
                  background: "hsl(var(--pr-gold))",
                  color: "hsl(var(--pr-emerald-deep))",
                }}
              >
                {project.testimonial.author[0]}
              </div>
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: "hsl(var(--pr-text-on-dark))" }}
                >
                  {project.testimonial.author}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "hsl(var(--pr-muted-on-dark))" }}
                >
                  {project.testimonial.role} · {project.title}
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <h4
              className="prestige-display text-2xl font-semibold sm:text-3xl"
              style={{ color: "hsl(var(--pr-text-on-dark))" }}
            >
              Vuoi un risultato così per la tua attività?
            </h4>
            <p
              className="max-w-md text-sm"
              style={{ color: "hsl(var(--pr-muted-on-dark))" }}
            >
              Ti costruiamo lo stesso ecosistema, calibrato sul tuo brand, in 24 ore.
              Primi 90 giorni gratis.
            </p>
            <button
              className="prestige-cta"
              onClick={() => {
                onClose();
                window.location.href = "/onboarding";
              }}
            >
              Voglio il mio Empire <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes prestigeFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes prestigeSlideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
