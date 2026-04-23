import { useEffect, useState } from "react";
import "./empire-home.css";
import CinematicHero from "./sections/CinematicHero";
import PortfolioCoverflow from "./sections/PortfolioCoverflow";
import { useReveal, useCountUp } from "./hooks/useReveal";

/* ────────────────────────────────────────────────────────────────
   CONTENT — single source of truth for the homepage copy.
   Tutti i prezzi/copy seguono i piani ufficiali Empire AI Group.
   ──────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: "Chi Siamo", href: "#about" },
  { label: "Sistema", href: "#features" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Piani", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const MARQUEE_KEYWORDS = [
  "Automazione WhatsApp", "AI Conversazionale", "Acquisizione Clienti",
  "Notifiche Proattive", "Prenotazioni Autonome", "Lead Qualification",
  "Gestione Recensioni", "Smart Follow-Up", "Fidelizzazione Automatica",
  "Protezione Fiscale 2026", "Multi-Settore", "ROI Misurabile",
];

const IMPACT_NUMBERS = [
  { num: 340, suffix: "%+", label: "Aumento Lead Qualificati" },
  { num: 89, suffix: "%", label: "Tasso Risposta Automatica" },
  { num: 67, suffix: "%", label: "Riduzione Costi Operativi" },
  { num: 24, suffix: "/7", label: "Operatività Senza Pausa" },
];

const PROBLEM_LIST = [
  "Rispondi ai clienti dopo ore, quando ormai hanno scelto un competitor",
  "Il tuo staff perde tempo con richieste ripetitive invece di generare valore",
  "Le prenotazioni si perdono tra messaggi WhatsApp e telefonate mancate",
  "Non hai visibilità sui dati: non sai chi sono i tuoi migliori clienti",
  "Le recensioni negative restano senza risposta, danneggiando la reputazione",
  "Rischio sanzioni fiscali 2026 per mancata digitalizzazione",
];

const SOLUTION_LIST = [
  "Risposta automatica in meno di 3 secondi, 24 ore su 24, 365 giorni l'anno",
  "AI conversazionale che qualifica, prenota e converte in autonomia",
  "Sistema centralizzato: WhatsApp, Instagram, sito web — tutto sincronizzato",
  "Dashboard analitica con dati in tempo reale su clienti e performance",
  "Gestione automatica delle recensioni con risposte personalizzate AI",
  "Piena conformità alle normative fiscali 2026 integrata nel sistema",
];

const FEATURES = [
  {
    icon: "01",
    title: "WhatsApp Orchestrator",
    desc: "Il cuore pulsante del sistema. Un agente AI conversazionale che gestisce ogni interazione su WhatsApp: risponde a domande, prende prenotazioni, invia conferme, fa upselling e cross-selling, tutto in linguaggio naturale.",
  },
  {
    icon: "02",
    title: "Notifiche Proattive",
    desc: "Non aspettare che i clienti vengano da te. Il sistema invia messaggi mirati basati sul comportamento: promemoria, offerte personalizzate, follow-up post-visita. Massimizza il tasso di ritorno e il lifetime value.",
  },
  {
    icon: "03",
    title: "Protezione Fisco 2026",
    desc: "Empire AI integra nativamente fatturazione elettronica, registri digitali e compliance automatizzata. Non è un modulo aggiunto: è parte dell'architettura del sistema. Nessun rischio di sanzione.",
  },
  {
    icon: "04",
    title: "Apex Acquisition Engine",
    desc: "Il motore proprietario che unisce campagne automatizzate, lead scoring AI e funnel di conversione dinamici. Trasforma prospect freddi in clienti paganti con tassi di conversione superiori del 340% rispetto ai metodi tradizionali.",
  },
];

const STEPS = [
  { n: "01", t: "Analisi Strategica", d: "Studiamo il tuo business, il mercato, i competitor e le opportunità nascoste. Progettiamo l'architettura del sistema su misura per il tuo settore." },
  { n: "02", t: "Setup e Integrazione", d: "Configuriamo l'intero ecosistema: WhatsApp Business API, agenti AI, automazioni, CRM e dashboard analitica. Tutto collegato al tuo brand." },
  { n: "03", t: "Training e Lancio", d: "L'AI viene addestrata con i dati del tuo business: menu, servizi, pricing, FAQ, tone of voice. Testiamo ogni scenario prima del go-live." },
  { n: "04", t: "Ottimizzazione Continua", d: "Monitoriamo le performance in tempo reale. Ottimizziamo conversazioni, funnel e campagne. Il sistema migliora ogni settimana." },
];

const PERSONALIZATION = [
  { t: "Design Su Misura", d: "Interfacce, webapp e touchpoint digitali progettati con il tuo brand DNA: colori, font, tone of voice, tutto allineato alla tua identità." },
  { t: "AI Addestrata sul Tuo Business", d: "L'agente AI conosce ogni dettaglio: il tuo menu, i tuoi servizi, i tuoi orari, le tue promozioni. Risponde come il tuo miglior dipendente." },
  { t: "Funnel Personalizzati", d: "Percorsi di conversione unici per ogni segmento di clientela: nuovi clienti, ricorrenti, VIP, prospect da riconquistare." },
  { t: "Integrazioni Native", d: "Collegamento diretto con i tuoi strumenti: POS, gestionale, software prenotazioni, calendari, sistemi di pagamento, tutto sincronizzato." },
  { t: "Multi-Lingua", d: "Supporto automatico in oltre 30 lingue per catturare clientela internazionale. L'AI rileva la lingua del cliente e risponde di conseguenza." },
  { t: "Report Settimanali", d: "Dashboard in tempo reale più report settimanali automatici con KPI, insights e raccomandazioni strategiche generate dall'AI." },
];

const SECTORS = [
  "Ristorazione", "Wellness e Spa", "Sport e Padel", "Beauty e Nail",
  "Real Estate", "Food Delivery", "Hospitality", "Charter e Nautica",
  "Hair Salon", "Ecommerce", "Studi Medici", "Fitness e Palestre",
  "Consulenza", "Automotive", "Eventi", "Pet Care", "Formazione", "Arredamento",
];

const AGENTS = [
  { initials: "CN", name: "Concierge AI", desc: "Il primo punto di contatto. Accoglie i clienti, risponde alle FAQ, guida la conversazione verso prenotazione o acquisto. Gestisce fino a 500 conversazioni simultanee." },
  { initials: "BK", name: "Booking Agent", desc: "Gestisce prenotazioni, modifiche e cancellazioni in tempo reale. Sincronizzato con il tuo calendario, evita doppie prenotazioni e ottimizza la capacità." },
  { initials: "SL", name: "Sales Agent", desc: "Identifica opportunità di upselling e cross-selling durante ogni conversazione. Propone offerte personalizzate basate sullo storico del cliente." },
  { initials: "RT", name: "Retention Agent", desc: "Monitora il comportamento dei clienti e interviene proattivamente per prevenire l'abbandono. Invia messaggi di riattivazione e offerte speciali." },
  { initials: "RV", name: "Review Agent", desc: "Gestisce la reputazione online: sollecita recensioni positive, risponde alle negative con empatia e professionalità, monitora i sentiment." },
  { initials: "AN", name: "Analytics Agent", desc: "Raccoglie e analizza ogni interazione per generare insights actionable. Identifica pattern, suggerisce ottimizzazioni e produce report settimanali." },
];

const TEAM = [
  { initials: "S", name: "Sebastiano", role: "Founder & CEO", bio: "Visionario dell'automazione AI per il business italiano. Creatore del Metodo Sebastiano, framework proprietario adottato da oltre 150 aziende." },
  { initials: "K", name: "Kevin", role: "CTO — AI Architecture", bio: "Architetto dei sistemi AI di Empire. Progetta l'infrastruttura multi-tenant e gli agenti specializzati che operano per ogni cliente." },
  { initials: "A", name: "Alessia", role: "Head of Strategy", bio: "Specialista in growth marketing e funnel di conversione. Trasforma i dati in strategie che massimizzano il ROI di ogni cliente Empire." },
];

const TESTIMONIALS = [
  { text: "In 60 giorni abbiamo triplicato le prenotazioni WhatsApp. Il sistema risponde ai clienti meglio del nostro miglior receptionist.", author: "Giuseppe M., Ristorante, Milano" },
  { text: "Il ROI è stato positivo dal primo mese. L'AI gestisce l'80% delle richieste in autonomia e i clienti sono più soddisfatti.", author: "Francesca L., Spa, Roma" },
  { text: "Avevamo 3 persone al telefono. Ora ne abbiamo 1 che supervisiona Empire AI. I costi sono crollati del 60%.", author: "Luca T., Centro Sportivo, Torino" },
  { text: "Le notifiche proattive hanno aumentato il tasso di ritorno dei clienti del 45%. Mai visto un sistema così efficace.", author: "Maria R., Salone Beauty, Napoli" },
  { text: "Gestisco 3 ristoranti e prima era il caos. Ora Empire AI coordina prenotazioni, ordini e recensioni per tutti da un'unica dashboard.", author: "Andrea B., F&B, Firenze" },
  { text: "La conformità fiscale 2026 mi preoccupava. Con Empire AI è tutto integrato e aggiornato automaticamente.", author: "Paolo V., Commercialista, Bologna" },
];

const COMPARE_ROWS = [
  ["AI Conversazionale su WhatsApp", "yes", "no", "no"],
  ["Operatività 24/7 Autonoma", "yes", "no", "no"],
  ["Setup e Training AI Personalizzato", "yes", "no", "no"],
  ["Notifiche Proattive Intelligenti", "yes", "no", "no"],
  ["Dashboard Analitica Real-Time", "yes", "partial", "no"],
  ["Conformità Fiscale 2026", "yes", "no", "no"],
  ["Multi-Lingua Automatico", "yes", "no", "no"],
  ["Ottimizzazione Continua AI", "yes", "no", "no"],
  ["ROI Misurabile dal Giorno 1", "yes", "no", "no"],
] as const;

/* PIANI UFFICIALI EMPIRE AI GROUP — fonte: memoria progetto.
   Setup una tantum + canone mensile, scelti per settore in onboarding. */
const PRICING = [
  {
    name: "Digital Start",
    setup: "1.997€",
    period: "una tantum (3x €699)",
    monthly: "79€/mese",
    desc: "Per chi vuole digitalizzare il proprio business con un sistema solido.",
    features: [
      "Webapp brandizzata responsive",
      "WhatsApp Business AI base",
      "Prenotazioni & conferme automatiche",
      "Dashboard analitica essenziale",
      "Conformità fiscale 2026 integrata",
      "Onboarding personalizzato per settore",
      "Supporto email prioritario",
    ],
    cta: "Prenota una Call",
    ctaClass: "empire-btn--ghost",
    featured: false,
  },
  {
    name: "Digital Scale",
    setup: "3.997€",
    period: "una tantum (3x o 6x)",
    monthly: "149€/mese",
    desc: "Il piano più scelto. Sistema completo con agenti AI specializzati.",
    features: [
      "Tutto di Digital Start",
      "3 Agenti AI (Concierge, Booking, Sales)",
      "Notifiche proattive intelligenti",
      "Apex Acquisition Engine incluso",
      "Multi-lingua automatico (30+ lingue)",
      "Gestione recensioni automatizzata",
      "Report settimanali con AI insights",
      "Integrazioni POS e gestionale",
      "Supporto WhatsApp dedicato",
    ],
    cta: "Prenota una Call",
    ctaClass: "empire-btn--gold",
    featured: true,
  },
  {
    name: "Digital Empire",
    setup: "Custom",
    period: "preventivo dedicato",
    monthly: "su misura",
    desc: "Per chi vuole l'ecosistema completo multi-sede con account manager dedicato.",
    features: [
      "Tutti i 6 Agenti AI del sistema",
      "Architettura multi-sede e multi-brand",
      "AI training avanzato con dati proprietari",
      "Integrazioni enterprise personalizzate",
      "Account manager dedicato",
      "SLA con uptime garantito 99.9%",
      "Ottimizzazione continua con consulente AI",
      "Accesso anticipato a nuove funzionalità",
      "Formazione team on-site",
    ],
    cta: "Contattaci",
    ctaClass: "empire-btn--ghost",
    featured: false,
  },
];

const FAQS = [
  {
    q: "Quanto tempo serve per attivare il sistema?",
    a: "Il setup completo richiede in media 7–14 giorni lavorativi. Include l'analisi del tuo business, la configurazione tecnica, il training dell'AI e il testing prima del go-live. Per Digital Empire con integrazioni enterprise, i tempi possono arrivare a 21 giorni.",
  },
  {
    q: "Funziona davvero per il mio settore?",
    a: "Empire AI è stato progettato per essere settore-agnostico. Operiamo con successo in ristorazione, wellness, sport, beauty, real estate, food delivery, hospitality, charter nautico, hair salon, ecommerce, studi medici e molti altri. L'AI viene addestrata specificamente sui dati e le dinamiche del tuo settore.",
  },
  {
    q: "I clienti si accorgono che parlano con un'AI?",
    a: "No. L'AI conversazionale di Empire AI utilizza linguaggio naturale avanzato, adattato al tone of voice del tuo brand. Il 94% dei clienti nei nostri test non distingue l'AI da un operatore umano. In caso di domande complesse, il sistema trasferisce la conversazione al tuo team in modo trasparente.",
  },
  {
    q: "Cosa succede se l'AI non sa rispondere?",
    a: "Il sistema ha un protocollo di escalation intelligente. Se la domanda esce dal perimetro di competenza dell'AI, la conversazione viene trasferita al tuo team con tutto il contesto. Inoltre, ogni interazione viene registrata per migliorare continuamente le risposte.",
  },
  {
    q: "Posso monitorare le conversazioni in tempo reale?",
    a: "Assolutamente. La dashboard ti permette di visualizzare tutte le conversazioni in corso, lo storico delle interazioni, i KPI in tempo reale e i report analitici. Puoi intervenire in qualsiasi momento per prendere il controllo di una conversazione specifica.",
  },
  {
    q: "Come funziona la conformità fiscale 2026?",
    a: "Il sistema integra nativamente i requisiti della normativa fiscale 2026: fatturazione elettronica automatica, registri digitali, tracciabilità delle transazioni e reportistica conforme. Gli aggiornamenti normativi vengono applicati automaticamente.",
  },
  {
    q: "Quali integrazioni sono disponibili?",
    a: "Empire AI si integra con WhatsApp Business API, Instagram DM, Facebook Messenger, Google Business, POS (SumUp, iZettle, Square), gestionali (Treatwell, Mindbody, Booksy), calendari (Google Calendar, Calendly), sistemi di pagamento (Stripe, PayPal) e molto altro.",
  },
];

/* ──────────────────── COMPONENTS ──────────────────── */

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`empire-reveal ${visible ? "is-visible" : ""}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

function ImpactCard({ num, suffix, label }: { num: number; suffix: string; label: string }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const value = useCountUp(num, visible);
  return (
    <div ref={ref} className="empire-impact-card">
      <span className="empire-impact-num">
        {Math.round(value)}
        {suffix}
      </span>
      <p className="empire-impact-label">{label}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`empire-faq-item ${open ? "is-open" : ""}`}>
      <button className="empire-faq-q" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>{q}</span>
        <span className="empire-faq-icon">▾</span>
      </button>
      <div className="empire-faq-a">{a}</div>
    </div>
  );
}

/* ──────────────────── PAGE ──────────────────── */

export default function EmpireHomePage() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // SEO
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Empire AI — Automazione Autonoma per il Business Italiano";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    if (meta) {
      meta.setAttribute(
        "content",
        "Empire AI: il sistema di automazione autonoma che trasforma il tuo business in una macchina di acquisizione clienti operativa 24/7. Metodo Sebastiano.",
      );
    }
    return () => {
      document.title = prevTitle;
      if (meta && prevDesc) meta.setAttribute("content", prevDesc);
    };
  }, []);

  // Navbar scroll state + body scroll lock when mobile menu is open
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  // Duplicate marquee for seamless loop
  const marqueeKeywords = [...MARQUEE_KEYWORDS, ...MARQUEE_KEYWORDS];
  const marqueeSectors = [...SECTORS, ...SECTORS];
  const marqueeTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="empire-home">
      {/* ─── 1. NAVBAR ─── */}
      <nav className={`empire-nav ${scrolled ? "is-scrolled" : ""}`}>
        <a href="#top" className="empire-nav-logo">
          EMPIRE <span className="ai">AI</span>
        </a>
        <div className={`empire-nav-links ${navOpen ? "is-open" : ""}`}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setNavOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#pricing" className="empire-btn empire-btn--gold empire-nav-cta" onClick={() => setNavOpen(false)}>
            Prenota una Call
          </a>
        </div>
        <button className="empire-nav-burger" onClick={() => setNavOpen((o) => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      <div id="top" />

      {/* ─── 2. HERO ─── */}
      <CinematicHero />

      {/* ─── 3. MARQUEE KEYWORDS ─── */}
      <div className="empire-marquee">
        <div className="empire-marquee-track">
          {marqueeKeywords.map((k, i) => (
            <span key={i} className="empire-marquee-item">{k}</span>
          ))}
        </div>
      </div>

      {/* ─── 4. ABOUT ─── */}
      <section id="about" className="empire-section empire-section--light">
        <div className="empire-container">
          <div className="empire-about-grid">
            <Reveal>
              <div className="empire-about-visual" />
            </Reveal>
            <Reveal delay={150}>
              <div>
                <span className="empire-eyebrow">Chi Siamo</span>
                <h2 className="empire-section-title" style={{ marginTop: 20 }}>
                  Non siamo un'agenzia. <span className="italic">Siamo architetti di sistemi autonomi.</span>
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--eh-text-muted-dark)", marginTop: 24 }}>
                  Empire AI nasce dal Metodo Sebastiano: un framework proprietario che integra intelligenza artificiale,
                  automazione conversazionale e strategie di acquisizione per trasformare qualsiasi business in un
                  ecosistema digitale autosufficiente. Ogni sistema che costruiamo non si limita a rispondere ai clienti,
                  li conquista, li fidelizza e li monetizza in modo autonomo e continuo.
                </p>
                <div className="empire-about-stats">
                  <div className="empire-stat-mini"><span className="num">150+</span><span className="label">Clienti Attivi</span></div>
                  <div className="empire-stat-mini"><span className="num">97%</span><span className="label">Retention</span></div>
                  <div className="empire-stat-mini"><span className="num">12+</span><span className="label">Settori</span></div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── 5. IMPACT NUMBERS ─── */}
      <section className="empire-section empire-section--dark">
        <div className="empire-container">
          <Reveal>
            <div className="empire-section-header">
              <span className="empire-eyebrow">Impatto Misurabile</span>
              <h2 className="empire-section-title">
                I numeri parlano. <span className="italic">Noi li facciamo crescere.</span>
              </h2>
              <p className="empire-section-sub">
                Risultati reali dei nostri clienti nei primi 90 giorni di attivazione del sistema Empire AI.
              </p>
            </div>
          </Reveal>
          <div className="empire-impact-grid">
            {IMPACT_NUMBERS.map((n) => (
              <ImpactCard key={n.label} {...n} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. PROBLEM / SOLUTION ─── */}
      <section className="empire-section empire-section--light">
        <div className="empire-container">
          <Reveal>
            <div className="empire-section-header">
              <span className="empire-eyebrow">Il Problema Reale</span>
              <h2 className="empire-section-title" style={{ color: "var(--eh-text-dark)" }}>
                Ogni minuto senza automazione <span className="italic">è fatturato perso.</span>
              </h2>
            </div>
          </Reveal>
          <div className="empire-ps-grid">
            <Reveal>
              <div className="empire-ps-card empire-ps-card--bad">
                <div className="empire-ps-title">Senza Empire AI</div>
                <ul className="empire-ps-list">
                  {PROBLEM_LIST.map((p, i) => (
                    <li key={i}><span className="ico">×</span><span>{p}</span></li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="empire-ps-card empire-ps-card--good">
                <div className="empire-ps-title">Con Empire AI</div>
                <ul className="empire-ps-list">
                  {SOLUTION_LIST.map((p, i) => (
                    <li key={i}><span className="ico">✓</span><span>{p}</span></li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── 7. FEATURES BENTO ─── */}
      <section id="features" className="empire-section empire-section--dark">
        <div className="empire-container">
          <Reveal>
            <div className="empire-section-header">
              <span className="empire-eyebrow">Le Armi del Sistema</span>
              <h2 className="empire-section-title">
                Quattro pilastri. <span className="italic">Un ecosistema invincibile.</span>
              </h2>
              <p className="empire-section-sub">
                Ogni modulo lavora in sinergia per creare un sistema di acquisizione e fidelizzazione che opera mentre dormi.
              </p>
            </div>
          </Reveal>
          <div className="empire-bento">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 100}>
                <div className="empire-bento-card">
                  <div className="empire-bento-icon">{f.icon}</div>
                  <h3 className="empire-bento-title">{f.title}</h3>
                  <p className="empire-bento-desc">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. STEPS ─── */}
      <section className="empire-section empire-section--light">
        <div className="empire-container">
          <Reveal>
            <div className="empire-section-header">
              <span className="empire-eyebrow">Come Funziona</span>
              <h2 className="empire-section-title" style={{ color: "var(--eh-text-dark)" }}>
                Da zero a sistema operativo <span className="italic">in 4 fasi.</span>
              </h2>
              <p className="empire-section-sub">Un processo chirurgico. Ogni fase costruisce le fondamenta della successiva.</p>
            </div>
          </Reveal>
          <div className="empire-steps">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 100}>
                <div className="empire-step-card">
                  <span className="empire-step-num">{s.n}</span>
                  <h3 className="empire-step-title">{s.t}</h3>
                  <p className="empire-step-desc">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. PERSONALIZATION ─── */}
      <section className="empire-section empire-section--dark">
        <div className="empire-container">
          <Reveal>
            <div className="empire-section-header">
              <span className="empire-eyebrow">Personalizzazione Totale</span>
              <h2 className="empire-section-title">
                Il tuo brand. <span className="italic">La nostra intelligenza.</span>
              </h2>
              <p className="empire-section-sub">
                Ogni sistema Empire AI è unico come il business che rappresenta. Nessun template, nessun copia-incolla.
              </p>
            </div>
          </Reveal>
          <div className="empire-perso">
            {PERSONALIZATION.map((p, i) => (
              <Reveal key={p.t} delay={i * 80}>
                <div className="empire-perso-card">
                  <h3 className="empire-perso-title">{p.t}</h3>
                  <p className="empire-perso-desc">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10. SECTORS MARQUEE ─── */}
      <section className="empire-section empire-section--light" style={{ paddingBottom: 60 }}>
        <div className="empire-container">
          <Reveal>
            <div className="empire-section-header">
              <span className="empire-eyebrow">Settori</span>
              <h2 className="empire-section-title" style={{ color: "var(--eh-text-dark)" }}>
                Un sistema. <span className="italic">Ogni business.</span>
              </h2>
              <p className="empire-section-sub">Empire AI si adatta a qualsiasi settore. Ecco dove stiamo già dominando.</p>
            </div>
          </Reveal>
        </div>
        <div className="empire-marquee empire-marquee--light" style={{ background: "transparent", borderColor: "transparent" }}>
          <div className="empire-marquee-track" style={{ animationDuration: "55s" }}>
            {marqueeSectors.map((s, i) => (
              <span key={i} className="empire-sector-chip">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 11. PORTFOLIO COVERFLOW ─── */}
      <section id="portfolio" className="empire-section empire-section--dark">
        <div className="empire-container">
          <Reveal>
            <div className="empire-section-header">
              <span className="empire-eyebrow">Portfolio</span>
              <h2 className="empire-section-title">
                Non promettiamo. <span className="italic">Dimostriamo.</span>
              </h2>
              <p className="empire-section-sub">
                12 progetti reali. 12 business trasformati. Scorri per esplorare i nostri sistemi in azione.
              </p>
            </div>
          </Reveal>
          <PortfolioCoverflow />
        </div>
      </section>

      {/* ─── 12. AGENTS ─── */}
      <section className="empire-section empire-section--light">
        <div className="empire-container">
          <Reveal>
            <div className="empire-section-header">
              <span className="empire-eyebrow">Agenti AI</span>
              <h2 className="empire-section-title" style={{ color: "var(--eh-text-dark)" }}>
                Il tuo team digitale. <span className="italic">Mai malato, mai in ferie.</span>
              </h2>
              <p className="empire-section-sub">
                Ogni agente AI è specializzato in un compito specifico e lavora in sinergia con gli altri per gestire l'intero ciclo di vita del cliente.
              </p>
            </div>
          </Reveal>
          <div className="empire-agents">
            {AGENTS.map((a, i) => (
              <Reveal key={a.name} delay={i * 80}>
                <div className="empire-agent-card">
                  <div className="empire-agent-avatar">{a.initials}</div>
                  <h3 className="empire-agent-name">{a.name}</h3>
                  <p className="empire-agent-desc">{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 13. TEAM ─── */}
      <section className="empire-section empire-section--dark">
        <div className="empire-container">
          <Reveal>
            <div className="empire-section-header">
              <span className="empire-eyebrow">Il Team</span>
              <h2 className="empire-section-title">
                Le menti dietro <span className="italic">Empire AI.</span>
              </h2>
            </div>
          </Reveal>
          <div className="empire-team">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 100}>
                <div className="empire-team-card">
                  <div className="empire-team-photo">{m.initials}</div>
                  <h3 className="empire-team-name">{m.name}</h3>
                  <div className="empire-team-role">{m.role}</div>
                  <p className="empire-team-bio">{m.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 14. TESTIMONIALS MARQUEE ─── */}
      <section className="empire-section empire-section--light" style={{ paddingBottom: 60 }}>
        <div className="empire-container">
          <Reveal>
            <div className="empire-section-header">
              <span className="empire-eyebrow">Testimonials</span>
              <h2 className="empire-section-title" style={{ color: "var(--eh-text-dark)" }}>
                Parlano i risultati. <span className="italic">Non le promesse.</span>
              </h2>
            </div>
          </Reveal>
        </div>
        <div className="empire-marquee empire-marquee--light" style={{ background: "transparent", borderColor: "transparent", padding: "8px 0" }}>
          <div className="empire-marquee-track" style={{ animationDuration: "65s" }}>
            {marqueeTestimonials.map((t, i) => (
              <div key={i} className="empire-testimonial-card">
                <div className="empire-testimonial-stars">★★★★★</div>
                <p className="empire-testimonial-text">"{t.text}"</p>
                <div className="empire-testimonial-author">— {t.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 15. COMPARE TABLE ─── */}
      <section className="empire-section empire-section--dark">
        <div className="empire-container">
          <Reveal>
            <div className="empire-section-header">
              <span className="empire-eyebrow">Confronto</span>
              <h2 className="empire-section-title">
                Empire AI <span className="italic">vs il resto del mercato.</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="empire-compare" style={{ overflowX: "auto" }}>
              <table className="empire-compare-table">
                <thead>
                  <tr>
                    <th>Funzionalità</th>
                    <th>Empire AI</th>
                    <th>Agenzia Tradizionale</th>
                    <th>Fai da Te</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row[0]}>
                      <td>{row[0]}</td>
                      {row.slice(1).map((cell, i) => (
                        <td key={i}>
                          {cell === "yes" && <span className="empire-compare-yes">✓</span>}
                          {cell === "no" && <span className="empire-compare-no">×</span>}
                          {cell === "partial" && <span className="empire-compare-partial">parziale</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── 16. PRICING ─── */}
      <section id="pricing" className="empire-section empire-section--light">
        <div className="empire-container">
          <Reveal>
            <div className="empire-section-header">
              <span className="empire-eyebrow">Piani</span>
              <h2 className="empire-section-title" style={{ color: "var(--eh-text-dark)" }}>
                Investi nel sistema. <span className="italic">Raccogli i risultati.</span>
              </h2>
              <p className="empire-section-sub">
                Ogni piano include setup completo, training AI personalizzato per il tuo settore e supporto dedicato.
                Setup una tantum rateizzabile in 3x o 6x. Canone mensile ricorrente.
              </p>
            </div>
          </Reveal>
          <div className="empire-pricing">
            {PRICING.map((p, i) => (
              <Reveal key={p.name} delay={i * 100}>
                <div className={`empire-pricing-card ${p.featured ? "empire-pricing-card--featured" : ""}`}>
                  {p.featured && <span className="empire-pricing-badge">Consigliato</span>}
                  <div className="empire-pricing-name">{p.name}</div>
                  <div className="empire-pricing-price">{p.setup}</div>
                  <div className="empire-pricing-period">{p.period} · poi {p.monthly}</div>
                  <p style={{ fontSize: 13, color: p.featured ? "var(--eh-text-muted)" : "var(--eh-text-muted-dark)", marginBottom: 24, lineHeight: 1.6 }}>
                    {p.desc}
                  </p>
                  <ul className="empire-pricing-list">
                    {p.features.map((f, j) => (
                      <li key={j}>{f}</li>
                    ))}
                  </ul>
                  <a href="#contact" className={`empire-btn ${p.ctaClass}`}>{p.cta}</a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 17. FAQ ─── */}
      <section id="faq" className="empire-section empire-section--dark">
        <div className="empire-container">
          <Reveal>
            <div className="empire-section-header">
              <span className="empire-eyebrow">FAQ</span>
              <h2 className="empire-section-title">
                Domande frequenti. <span className="italic">Risposte concrete.</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="empire-faq">
              {FAQS.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── 18. FINAL CTA ─── */}
      <section id="contact" className="empire-final-cta">
        <Reveal>
          <span className="empire-eyebrow">Il Prossimo Passo</span>
          <h2 className="empire-section-title" style={{ marginTop: 24, marginBottom: 20 }}>
            Il tuo business merita un sistema <span className="italic">che lavora per te.</span>
          </h2>
          <p className="empire-section-sub" style={{ marginBottom: 36 }}>
            Prenota una call strategica con il nostro team. Analizzeremo il tuo business e ti mostreremo
            esattamente come Empire AI può trasformarlo.
          </p>
          <a href="https://wa.me/393000000000" className="empire-btn empire-btn--gold empire-btn--lg">
            Prenota la Tua Call Strategica
          </a>
        </Reveal>
      </section>

      {/* ─── 19. FOOTER ─── */}
      <footer className="empire-footer">
        <div className="empire-footer-grid">
          <div>
            <div className="empire-footer-brand-name">EMPIRE <span className="ai">AI</span></div>
            <p className="empire-footer-brand-desc">
              Automazione autonoma per il business italiano. Metodo Sebastiano — il framework che trasforma
              qualsiasi attività in un ecosistema digitale autosufficiente.
            </p>
          </div>
          <div>
            <div className="empire-footer-col-title">Prodotto</div>
            <ul className="empire-footer-links">
              <li><a href="#features">Sistema</a></li>
              <li><a href="#portfolio">Portfolio</a></li>
              <li><a href="#pricing">Piani</a></li>
              <li><a href="/auth">Accedi</a></li>
            </ul>
          </div>
          <div>
            <div className="empire-footer-col-title">Azienda</div>
            <ul className="empire-footer-links">
              <li><a href="#about">Chi Siamo</a></li>
              <li><a href="#contact">Contatti</a></li>
              <li><a href="/join">Diventa Partner</a></li>
            </ul>
          </div>
          <div>
            <div className="empire-footer-col-title">Risorse</div>
            <ul className="empire-footer-links">
              <li><a href="#faq">FAQ</a></li>
              <li><a href="/privacy">Privacy</a></li>
              <li><a href="/cookie-policy">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="empire-footer-bottom">
          © 2026 Empire AI Group · Tutti i diritti riservati · Metodo Sebastiano è un marchio registrato
        </div>
      </footer>
    </div>
  );
}
