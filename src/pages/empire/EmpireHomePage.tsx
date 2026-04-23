import { useEffect, useMemo, useRef, useState } from "react";
import "./empire-home.css";
import { PORTFOLIO_ITEMS, HERO_PHONES, SECTOR_SHOWCASE, AGENTS } from "./data/portfolio";
import { useReveal, useCountUp, useScrollProgress, useMagnetic, useMouseParallax } from "./hooks/useReveal";

/* ─────────── DATA ─────────── */

const NAV_LINKS = [
  { label: "Settori", href: "#sectors" },
  { label: "Agenti AI", href: "#agents" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Pacchetti", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const MARQUEE = [
  "Ristoranti", "Pizzerie", "Sushi & Nikkei", "Dentisti", "Spa & Wellness",
  "Palestre", "Pilates", "Padel & Sport", "Immobiliari", "Hotel & Resort",
  "B&B", "Beach Club", "Charter & Yacht", "NCC", "Pet Care", "Asili nido",
  "Parrucchieri", "Estetiste", "Studi medici", "Fisioterapia", "E-commerce",
  "Consulenti", "Idraulici", "Cevicherie", "Fast food",
];

const STATS = [
  { num: 1997, prefix: "€", suffix: "", label: "Setup Digital Start · rate 3x €699 disponibili" },
  { num: 79, prefix: "€", suffix: "/mese", label: "Canone ottimizzazione continua · da" },
  { num: 25, prefix: "", suffix: "+", label: "Settori coperti · framework verticalizzato" },
  { num: 14, prefix: "", suffix: "gg", label: "Tempo medio go-live dal contratto firmato" },
];

const PROCESS = [
  { n: "01", t: "Discovery", d: "Studiamo business, mercato e competitor in 1 call. Mappiamo i punti dove perdi tempo, soldi o clienti." },
  { n: "02", t: "Design & Build", d: "Progettiamo webapp brandizzata, integriamo gli agenti AI, colleghiamo i tuoi gestionali. Tutto pronto in 7 giorni." },
  { n: "03", t: "AI Training", d: "Addestriamo l'AI sui tuoi dati: menu, servizi, FAQ, tone of voice. Testiamo ogni scenario reale prima del go-live." },
  { n: "04", t: "Go-Live & Optimize", d: "Lanciamo. Monitoriamo le performance in tempo reale e ottimizziamo ogni settimana. Il sistema migliora da solo." },
];

const PRICING = [
  {
    tier: "Starter",
    name: "Digital Start",
    setup: "€1.997",
    period: "una tantum (3x €699)",
    monthly: "+ €79/mese ottimizzazione",
    desc: "Per chi vuole digitalizzare il proprio business con un sistema solido.",
    features: [
      "Webapp brandizzata responsive",
      "WhatsApp Business AI base",
      "Prenotazioni & conferme automatiche",
      "Dashboard analitica essenziale",
      "Conformità fiscale 2026 integrata",
      "Onboarding personalizzato per settore",
    ],
    cta: "Parla con noi",
    featured: false,
  },
  {
    tier: "Più scelto · 68%",
    name: "Digital Scale",
    setup: "€3.997",
    period: "una tantum (3x o 6x)",
    monthly: "+ €149/mese ottimizzazione",
    desc: "Il piano più scelto. Sistema completo con agenti AI specializzati.",
    features: [
      "Tutto di Digital Start",
      "3 Agenti AI: Concierge, Booking, Sales",
      "Notifiche proattive intelligenti",
      "Apex Acquisition Engine incluso",
      "Multi-lingua automatico (30+ lingue)",
      "Gestione recensioni automatizzata",
      "Report settimanali con AI insights",
      "Integrazioni POS e gestionale",
    ],
    cta: "Scegli Empire",
    featured: true,
  },
  {
    tier: "Enterprise",
    name: "Digital Empire",
    setup: "Custom",
    period: "preventivo dedicato",
    monthly: "canone su misura",
    desc: "Per chi vuole l'ecosistema completo multi-sede con account manager dedicato.",
    features: [
      "Tutti i 6 Agenti AI del sistema",
      "Architettura multi-sede e multi-brand",
      "Integrazioni enterprise personalizzate",
      "Account manager dedicato + SLA 99,9%",
      "AI training avanzato con dati proprietari",
      "App iOS & Android native sugli store",
      "Formazione team on-site",
    ],
    cta: "Parla con un Empire Agent",
    featured: false,
  },
];

const TEAM = [
  { initials: "S", name: "Sebastiano", role: "Founder & CEO", bio: "Visionario dell'automazione AI per il business italiano. Creatore del Metodo Empire." },
  { initials: "K", name: "Kevin", role: "CTO — AI Architecture", bio: "Architetto dei sistemi AI. Progetta l'infrastruttura multi-tenant e gli agenti specializzati." },
  { initials: "A", name: "Alessia", role: "Head of Strategy", bio: "Specialista in growth marketing e funnel di conversione. Trasforma i dati in strategie ROI-driven." },
];

const OBJECTIONS = [
  { q: "\"Troppo caro.\"", a: "Un addetto alle prenotazioni costa €28–35K lordi/anno. Empire AI lavora 24/7 al costo di 1/10 di un dipendente. ROI in 4–8 mesi." },
  { q: "\"La mia attività è diversa.\"", a: "Abbiamo lavorato con kebab, pizzerie gourmet, charter yacht, asili, dentisti, spa, padel club. Se hai clienti, prenotazioni o ordini, Empire funziona." },
  { q: "\"I miei clienti sono anziani.\"", a: "Il Voice Agent risponde al telefono: il cliente chiama come sempre. Sente solo una voce umana naturale che gli prende l'ordine." },
  { q: "\"Ho paura di perdere il controllo.\"", a: "Ogni chiamata, prenotazione e ordine è tracciato in dashboard. Puoi intervenire, modificare, bloccare l'AI. Tu resti il capo: l'AI esegue." },
  { q: "\"Ho già un gestionale.\"", a: "Empire si integra con TheFork, Booking, Stripe, Shopify, Teamsystem, Wix. Non rifacciamo quello che funziona, aggiungiamo gli agenti AI sopra." },
  { q: "\"E se l'AI sbaglia?\"", a: "Nei primi 90 giorni un Empire Agent supervisiona ogni interazione. Addestriamo sui tuoi casi reali. Error rate medio dopo 60 giorni: 1,4%." },
];

const FAQS = [
  { q: "In quanto tempo va live la mia webapp + agenti AI?", a: "14 giorni lavorativi dal contratto firmato. Giorni 1–3: strategia + wireframe. Giorni 4–9: design, build, integrazioni. Giorni 10–12: training AI. Giorni 13–14: QA e lancio." },
  { q: "Chi possiede il codice, i dati e le app?", a: "Tu. Consegniamo repository, credenziali hosting, export completi. Empire non è una gabbia: se vuoi portare via tutto, lo fai in 48 ore." },
  { q: "Funziona davvero per il mio settore?", a: "Empire AI è settore-agnostico. Operiamo in ristorazione, wellness, sport, beauty, real estate, hospitality, charter, ecommerce e altri 25+ settori. L'AI viene addestrata sulle dinamiche del tuo." },
  { q: "I clienti si accorgono che parlano con un'AI?", a: "Il 94% dei clienti nei test non distingue l'AI da un operatore umano. Per domande complesse, il sistema trasferisce la conversazione al tuo team in modo trasparente." },
  { q: "Quali integrazioni sono disponibili?", a: "WhatsApp Business API, Instagram, Facebook, Google Business, POS (SumUp, Stripe), gestionali (Treatwell, Mindbody), calendari, sistemi di pagamento. Se non c'è, lo integriamo." },
  { q: "Quanto costa mantenere il sistema attivo?", a: "Da €79/mese (Digital Start) a €149/mese (Digital Scale) per ottimizzazione continua, hosting e API AI. Custom per Digital Empire. Nessuna sorpresa." },
  { q: "Come inizio?", a: "Prenoti una call di 20 minuti. Un Empire Agent ti fa 8 domande, ti mostra 2 casi simili al tuo e ti manda preventivo dettagliato entro 48 ore. Gratis, senza vincoli." },
];

const TESTIMONIALS = [
  {
    quote: "In 14 giorni siamo passati da 12 prenotazioni a 47 al giorno. Il voice agent risponde anche quando siamo nel servizio. Vale ogni euro speso.",
    name: "Marco D.",
    role: "Casa Negra · Ristorante",
    metric: "+290% prenotazioni",
  },
  {
    quote: "Avevamo l'82% di no-show. Dopo 60 giorni con i reminder AI siamo al 9%. Il calcolo del ROI lo faccio ogni settimana ed è sempre positivo.",
    name: "Dott.ssa F.",
    role: "Studio Fisioterapia",
    metric: "−82% no-show",
  },
  {
    quote: "I clienti chiamano e pensano sia la mia segretaria. Non ne possono distinguere la differenza. La mia segretaria adesso fa cose strategiche.",
    name: "Avv. Roberto T.",
    role: "Studio Legale",
    metric: "+34h libere/settimana",
  },
];

/* ─────────── COMPONENTS ─────────── */

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`empire-reveal ${visible ? "is-visible" : ""} ${className}`} style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}>
      {children}
    </div>
  );
}

function Stat({ num, prefix, suffix, label }: { num: number; prefix: string; suffix: string; label: string }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const value = useCountUp(num, visible);
  return (
    <div ref={ref} className="empire-stat">
      <b>{prefix}{Math.round(value).toLocaleString("it-IT")}{suffix}</b>
      <span>{label}</span>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`empire-faq-item ${open ? "is-open" : ""}`}>
      <button className="empire-faq-q" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span>{q}</span>
        <span className="empire-faq-icon">▾</span>
      </button>
      <div className="empire-faq-a"><div>{a}</div></div>
    </div>
  );
}

function MagneticCTA({ href, variant = "gold", children }: { href: string; variant?: "gold" | "ghost"; children: React.ReactNode }) {
  const ref = useMagnetic<HTMLAnchorElement>(0.18);
  return (
    <a ref={ref} href={href} className={`empire-btn empire-btn--${variant} empire-magnetic`}>
      <span>{children}</span>
    </a>
  );
}

/** Cinematic pinned hero — phones expand and scroll-driven choreography */
function CinematicHero() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const mouse = useMouseParallax();

  // Choreographed phases
  const introP = Math.min(1, progress / 0.25);            // 0 → 0.25
  const expandP = Math.max(0, Math.min(1, (progress - 0.2) / 0.3)); // 0.2 → 0.5
  const orbitP = Math.max(0, Math.min(1, (progress - 0.45) / 0.25)); // 0.45 → 0.7
  const finaleP = Math.max(0, Math.min(1, (progress - 0.7) / 0.3));  // 0.7 → 1

  const titleY = -progress * 60;
  const titleOpacity = 1 - Math.max(0, (progress - 0.55) * 2.4);

  return (
    <section ref={ref} className="empire-hero-pin">
      <div className="empire-hero-sticky">
        {/* Animated mesh background */}
        <div className="empire-mesh">
          <div className="mesh-orb mesh-1" style={{ transform: `translate(${mouse.x * 30}px, ${mouse.y * 25}px) scale(${1 + introP * 0.2})` }} />
          <div className="mesh-orb mesh-2" style={{ transform: `translate(${mouse.x * -20}px, ${mouse.y * -18}px) scale(${1 + expandP * 0.3})` }} />
          <div className="mesh-orb mesh-3" style={{ transform: `translate(${mouse.x * 15}px, ${mouse.y * 20}px) scale(${1 + orbitP * 0.4})`, opacity: 0.5 + orbitP * 0.3 }} />
        </div>
        <div className="empire-hero-grain" />
        <div className="empire-hero-vignette" />

        {/* Coverflow phones — react to scroll */}
        <div className="empire-cover" style={{ transform: `translateY(${20 - introP * 20}px)` }}>
          {HERO_PHONES.map((p, i) => {
            const offset = i - 2; // -2..2
            const baseAngle = offset * 22;
            const baseX = offset * 180;
            const baseZ = -Math.abs(offset) * 200;
            // expand outward as user scrolls
            const expandX = baseX * (1 + expandP * 0.6);
            const expandAngle = baseAngle * (1 - expandP * 0.4);
            const expandZ = baseZ * (1 - expandP * 0.5);
            // orbit phase: rotate Y angle
            const orbitYRot = orbitP * 360 * (offset / 2);
            // finale: collapse to bottom and fade
            const finaleY = finaleP * 180;
            const finaleScale = 1 - finaleP * 0.35;
            const finaleOpacity = 1 - finaleP * 0.85;

            return (
              <div
                key={i}
                className="empire-cover-item"
                style={{
                  transform: `translate3d(calc(-50% + ${expandX}px), calc(-50% + ${finaleY}px), ${expandZ}px) rotateY(${expandAngle + orbitYRot}deg) scale(${finaleScale})`,
                  opacity: finaleOpacity,
                  zIndex: 100 - Math.abs(offset),
                }}
              >
                <div className="empire-cover-phone">
                  <div className="phone-notch" />
                  <img src={p.url} alt={p.name} loading={i === 2 ? "eager" : "lazy"} />
                  <div className="phone-glare" />
                </div>
                <div className="empire-cover-label">{p.sector}</div>
              </div>
            );
          })}
        </div>

        {/* Center text overlay */}
        <div className="empire-hero-overlay" style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)` }}>
          <div className="empire-wrap">
            <div className="empire-hero-text">
              <span className="empire-eyebrow"><span className="dot" />Empire AI · Webapp + 4 Agenti AI</span>
              <h1>
                <span className="line"><span className="word w1">Sostituisci</span> <span className="word w2">i</span> <span className="word w3">dipendenti.</span></span>
                <span className="line"><span className="word w4 empire-italic-gold">La&nbsp;tua&nbsp;azienda</span></span>
                <span className="line"><span className="word w5">lavora</span> <span className="word w6">mentre</span> <span className="word w7">dormi.</span></span>
              </h1>
              <p className="empire-hero-sub">
                Webapp su misura + agenti AI che <strong>rispondono al telefono, vendono, prenotano e raccolgono recensioni</strong> — 24/7, in tutte le lingue. Setup in 14 giorni. Oltre 25 settori coperti.
              </p>
              <div className="empire-hero-ctas">
                <MagneticCTA href="#contact" variant="gold">Prenota call gratuita →</MagneticCTA>
                <MagneticCTA href="#portfolio" variant="ghost">Vedi 12 progetti live</MagneticCTA>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="empire-scroll-hint" style={{ opacity: 1 - progress * 4 }}>
          <span>Scroll</span>
          <div className="line" />
        </div>

        {/* Finale tagline that appears at end of pin */}
        <div className="empire-hero-finale" style={{ opacity: finaleP }}>
          <h2>Il tuo settore. <span className="empire-italic-gold">La tua webapp.</span></h2>
        </div>
      </div>
    </section>
  );
}

/* ─────────── PAGE ─────────── */

export default function EmpireHomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSector, setActiveSector] = useState(0);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Empire AI — Sostituisci i tuoi dipendenti con agenti AI 24/7";
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Custom blob cursor
  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Auto-cycle active sector every 5s if user idle
  useEffect(() => {
    const t = window.setInterval(() => {
      setActiveSector((s) => (s + 1) % SECTOR_SHOWCASE.length);
    }, 6000);
    return () => window.clearInterval(t);
  }, []);

  const marquee = useMemo(() => [...MARQUEE, ...MARQUEE], []);
  const currentSector = SECTOR_SHOWCASE[activeSector];

  return (
    <div className="empire-home">
      <div ref={cursorRef} className="empire-blob" aria-hidden />

      {/* NAV */}
      <nav className={`empire-nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="empire-nav-inner">
          <a href="#top" className="empire-brand">
            <span className="empire-brand-mark">E</span>
            <span>Empire.AI</span>
          </a>
          <div className="empire-nav-links">
            {NAV_LINKS.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
          </div>
          <a href="#contact" className="empire-btn empire-btn--gold empire-btn--sm">Prenota call →</a>
        </div>
      </nav>

      <div id="top" />

      {/* CINEMATIC HERO with scroll pin */}
      <CinematicHero />

      {/* MARQUEE */}
      <div className="empire-marquee-band">
        <div className="empire-marquee-track">
          {marquee.map((m, i) => <span key={i}>{m}</span>)}
        </div>
      </div>

      {/* STATS */}
      <section className="empire-sec-ink empire-sec-pad" id="numbers">
        <div className="empire-wrap">
          <Reveal>
            <div className="empire-head">
              <div>
                <span className="empire-eyebrow"><span className="dot" />Numeri Empire</span>
                <h2 style={{ marginTop: 20 }}>I numeri di Empire AI <span className="empire-italic-gold">nel 2025</span></h2>
              </div>
              <p className="empire-lede">
                Pricing trasparente, allineato ai piani ufficiali del nostro listino. Niente sorprese, niente costi nascosti, niente abbonamenti vincolanti sul software.
              </p>
            </div>
          </Reveal>
          <div className="empire-stats">
            {STATS.map((s, i) => <Stat key={i} {...s} />)}
          </div>
        </div>
      </section>

      {/* SECTORS — scrollable card list + sticky preview with automation reveal */}
      <section className="empire-sec-ivory empire-sec-pad" id="sectors">
        <div className="empire-wrap">
          <Reveal>
            <div className="empire-head">
              <div>
                <span className="empire-eyebrow"><span className="dot" />25+ Settori coperti</span>
                <h2 style={{ marginTop: 20 }}>Il tuo settore <span className="empire-italic-gold">è già pronto.</span></h2>
              </div>
              <p className="empire-lede">
                Ogni settore ha problemi diversi, automazioni diverse, pricing diverso. Clicca un settore: vedi il <strong>problema reale</strong>, la <strong>nostra soluzione</strong>, le <strong>automazioni incluse</strong> e la webapp di un nostro cliente.
              </p>
            </div>
          </Reveal>

          <div className="empire-sector-grid">
            <div className="empire-sector-list">
              {SECTOR_SHOWCASE.map((s, i) => (
                <button
                  key={i}
                  className="empire-sector-card"
                  data-active={activeSector === i}
                  onClick={() => setActiveSector(i)}
                  style={{ ["--sector-accent" as never]: s.accent }}
                >
                  <h4>
                    <span>{s.title}</span>
                    <span className="chip">{s.chip}</span>
                  </h4>
                  <p className="prob">⚠ {s.problem}</p>
                  {activeSector === i && (
                    <>
                      <p className="sol">→ {s.solution}</p>
                      <div className="biz">Caso reale: {s.biz}</div>
                    </>
                  )}
                </button>
              ))}
            </div>

            <div className="empire-sector-stage" key={activeSector}>
              <div className="stage-bg" style={{ background: `radial-gradient(60% 60% at 50% 30%, ${currentSector.accent}33, transparent 70%)` }} />
              <div className="empire-stage-canvas">
                <div className="empire-stage-phone">
                  <div className="phone-notch" />
                  <img src={currentSector.item.url} alt={currentSector.item.name} />
                  <div className="phone-glare" />
                </div>
              </div>
              <div className="empire-stage-overlay">
                <span className="empire-stage-tag">{currentSector.chip}</span>
                <div className="empire-stage-name">{currentSector.title}</div>
                <div className="empire-stage-automations">
                  <b>Automazioni incluse:</b>
                  <ul>
                    {currentSector.automations.map((a, i) => (
                      <li key={i} style={{ animationDelay: `${i * 70}ms` }}>
                        <span className="dot" style={{ background: currentSector.accent }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AGENTS — 4 AI agents with metrics */}
      <section className="empire-sec-ink empire-sec-pad" id="agents">
        <div className="empire-wrap">
          <Reveal>
            <div className="empire-head">
              <div>
                <span className="empire-eyebrow"><span className="dot" />4 Agenti AI · 1 Webapp</span>
                <h2 style={{ marginTop: 20 }}>Come Empire AI <span className="empire-italic-gold">lavora per te.</span></h2>
              </div>
              <p className="empire-lede">
                In 14 giorni costruiamo la tua webapp + agenti AI specializzati. Ognuno con il proprio ruolo operativo. Ti consegniamo un sistema completo che lavora <strong>24/7, in tutte le lingue, senza ferie, senza assenze</strong>.
              </p>
            </div>
          </Reveal>
          <div className="empire-agents-grid">
            {AGENTS.map((a, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="empire-agent-card" style={{ ["--agent-accent" as never]: a.accent }}>
                  <div className="agent-glow" />
                  <span className="agent-num">{a.num}</span>
                  <h4>{a.name}</h4>
                  <span className="agent-role">{a.role}</span>
                  <p>{a.desc}</p>
                  <div className="agent-metric">
                    <span className="dot" />
                    {a.metric}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS — 4 steps */}
      <section className="empire-sec-ivory empire-sec-pad" id="how">
        <div className="empire-wrap">
          <Reveal>
            <div className="empire-head">
              <div>
                <span className="empire-eyebrow"><span className="dot" />Il processo · 14 giorni</span>
                <h2 style={{ marginTop: 20 }}>Dal contratto al go-live, <span className="empire-italic-gold">in 4 fasi.</span></h2>
              </div>
              <p className="empire-lede">
                Ogni progetto Empire segue lo stesso processo testato su decine di business reali. Niente sorprese, niente ritardi: ogni settimana sai esattamente cosa succede.
              </p>
            </div>
          </Reveal>
          <div className="empire-how-grid">
            {PROCESS.map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="empire-how-card">
                  <span className="num">{s.n}</span>
                  <h4>{s.t}</h4>
                  <p>{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO BENTO */}
      <section className="empire-sec-ink empire-sec-pad" id="portfolio">
        <div className="empire-wrap">
          <Reveal>
            <div className="empire-head">
              <div>
                <span className="empire-eyebrow"><span className="dot" />Portfolio · 12 progetti reali</span>
                <h2 style={{ marginTop: 20 }}>Non solo promesse. <span className="empire-italic-gold">Progetti già online.</span></h2>
              </div>
              <p className="empire-lede">
                Dalle pizzerie ai resort, dai centri fisioterapici ai beach club: ogni tile è una webapp consegnata, con screenshot reali presi direttamente dai nostri clienti. Niente stock, niente fuffa.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="empire-bento">
              {PORTFOLIO_ITEMS.map((p, i) => {
                const sizes = ["c-l", "c-m", "c-s", "c-s", "c-l", "c-m", "c-s", "c-s", "c-m", "c-m", "c-m", "c-m"];
                return (
                  <div key={i} className={`card ${sizes[i]}`}>
                    <img src={p.url} alt={p.name} loading="lazy" />
                    <div className="meta">
                      <b>{p.name}</b>
                      <span>{p.sector}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="empire-sec-ivory empire-sec-pad">
        <div className="empire-wrap">
          <Reveal>
            <div className="empire-head">
              <div>
                <span className="empire-eyebrow"><span className="dot" />Voci dei clienti</span>
                <h2 style={{ marginTop: 20 }}>Cosa dicono i clienti <span className="empire-italic-gold">che hanno scelto Empire.</span></h2>
              </div>
              <p className="empire-lede">
                Numeri verificabili, non promesse di marketing. Ogni testimonianza ha una metrica reale che possiamo mostrarti in call.
              </p>
            </div>
          </Reveal>
          <div className="empire-testimonials">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="empire-testimonial">
                  <div className="quote-mark">"</div>
                  <blockquote>{t.quote}</blockquote>
                  <div className="t-meta">
                    <div>
                      <b>{t.name}</b>
                      <span>{t.role}</span>
                    </div>
                    <span className="metric">{t.metric}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="empire-sec-ink empire-sec-pad" id="pricing">
        <div className="empire-wrap">
          <Reveal>
            <div className="empire-head">
              <div>
                <span className="empire-eyebrow"><span className="dot" />Pacchetti Empire · pricing reale</span>
                <h2 style={{ marginTop: 20 }}>3 livelli. <span className="empire-italic-gold">Zero rischi.</span></h2>
              </div>
              <p className="empire-lede">
                Setup una tantum + canone mensile trasparente. Cancelli quando vuoi, il sito resta tuo. <strong>Garanzia soddisfatti o rimborsati nei primi 30 giorni.</strong>
              </p>
            </div>
          </Reveal>

          <div className="empire-packs">
            {PRICING.map((p, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className={`empire-pack ${p.featured ? "featured" : ""}`}>
                  {p.featured && <span className="ribbon">{p.tier}</span>}
                  {!p.featured && <span className="p-tier">{p.tier}</span>}
                  <div className="p-name">{p.name}</div>
                  <div className="p-price">
                    <b>{p.setup}</b>
                    <span>{p.period}</span>
                  </div>
                  <span className="p-monthly">{p.monthly}</span>
                  <p className="p-desc">{p.desc}</p>
                  <ul>
                    {p.features.map((f, j) => <li key={j}>{f}</li>)}
                  </ul>
                  <a href="#contact" className={`empire-btn ${p.featured ? "empire-btn--gold" : "empire-btn--ghost"}`}>{p.cta} →</a>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="empire-pack-note">Tutti i prezzi IVA esclusa. Rateizzazione 3x o 6x disponibile. Cancelli quando vuoi.</p>
        </div>
      </section>

      {/* TEAM */}
      <section className="empire-sec-ivory empire-sec-pad" id="team">
        <div className="empire-wrap">
          <Reveal>
            <div className="empire-head">
              <div>
                <span className="empire-eyebrow"><span className="dot" />Empire Agents · il team umano</span>
                <h2 style={{ marginTop: 20 }}>Dietro l'AI, <span className="empire-italic-gold">persone vere.</span></h2>
              </div>
              <p className="empire-lede">
                Il software ti serve, ma la strategia la fanno le persone. Ogni progetto Empire è seguito da specialisti: strategist, AI engineer e project lead. Parli con loro, non con un bot.
              </p>
            </div>
          </Reveal>
          <div className="empire-team">
            {TEAM.map((t, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="empire-tm">
                  <div className="av">{t.initials}</div>
                  <div>
                    <b>{t.name}</b>
                    <span className="role">{t.role}</span>
                    <p>{t.bio}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* OBJECTIONS */}
      <section className="empire-sec-ink empire-sec-pad">
        <div className="empire-wrap">
          <Reveal>
            <div className="empire-head">
              <div>
                <span className="empire-eyebrow"><span className="dot" />Obiezioni frequenti</span>
                <h2 style={{ marginTop: 20 }}>Le 6 cose che <span className="empire-italic-gold">pensi adesso.</span></h2>
              </div>
              <p className="empire-lede">
                Abbiamo già parlato con centinaia di imprenditori. Le obiezioni sono sempre le stesse sei. Le affrontiamo una per una, senza marketing, senza fumo.
              </p>
            </div>
          </Reveal>
          <div className="empire-objections">
            {OBJECTIONS.map((o, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="empire-obj">
                  <div className="q">{o.q}</div>
                  <div className="a">{o.a}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="empire-sec-ivory empire-sec-pad" id="faq">
        <div className="empire-wrap">
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <span className="empire-eyebrow"><span className="dot" />Domande frequenti</span>
              <h2 style={{ marginTop: 20 }}>Tutto ciò che un imprenditore <span className="empire-italic-gold">ci chiede in call.</span></h2>
              <p className="empire-lede" style={{ margin: "20px auto 0" }}>
                Se la domanda non è qui, fissa una call di 20 minuti: un Empire Agent ti risponde personalmente, senza slide e senza obbligo.
              </p>
            </div>
          </Reveal>
          <div className="empire-faq">
            {FAQS.map((f, i) => <FaqItem key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="empire-sec-ink empire-sec-pad" id="contact">
        <div className="empire-wrap">
          <Reveal>
            <div className="empire-cta-final">
              <div className="cta-mesh" />
              <span className="empire-eyebrow"><span className="dot" />Prenota call gratuita</span>
              <h2 style={{ marginTop: 20 }}>La tua azienda può <span className="empire-italic-gold">lavorare da sola.</span> Bastano 14 giorni.</h2>
              <p>
                Prenota una call di 20 minuti con un Empire Agent. Ti facciamo 8 domande, ti mostriamo 2 casi simili al tuo e ti mandiamo un preventivo dettagliato entro 48 ore. <strong>Gratis, senza vincoli, senza carta di credito.</strong>
              </p>
              <div className="ctas">
                <MagneticCTA href="https://wa.me/393513806722" variant="gold">Prenota call WhatsApp →</MagneticCTA>
                <MagneticCTA href="mailto:info@empireaigroup.com" variant="ghost">Scrivici via email</MagneticCTA>
              </div>
              <p className="cta-note">⏱ Risposta media in 2h · 🇮🇹 Team italiano · 🛡 Garanzia 30 giorni</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="empire-footer">
        <div className="empire-wrap">
          <div className="empire-ft">
            <div>
              <a href="#top" className="empire-brand" style={{ marginBottom: 16, display: "inline-flex" }}>
                <span className="empire-brand-mark">E</span>
                <span>Empire.AI</span>
              </a>
              <p style={{ color: "rgba(246,243,238,.6)", fontSize: 14, maxWidth: "40ch", margin: "12px 0 0" }}>
                Sostituisci i tuoi dipendenti con agenti AI che lavorano 24/7. Webapp + agenti AI in 14 giorni. Per oltre 25 settori.
              </p>
            </div>
            <div>
              <b>Navigazione</b>
              {NAV_LINKS.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
            </div>
            <div>
              <b>Contatti</b>
              <a href="mailto:info@empireaigroup.com">info@empireaigroup.com</a>
              <a href="https://wa.me/393513806722">WhatsApp · +39 351 380 6722</a>
            </div>
            <div>
              <b>Legale</b>
              <a href="/privacy-policy">Privacy Policy</a>
              <a href="/cookie-policy">Cookie Policy</a>
            </div>
          </div>
          <div className="empire-ft-bottom">
            <span>© {new Date().getFullYear()} Empire AI Group · Tutti i diritti riservati</span>
            <span>Made with ✦ in Italy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
