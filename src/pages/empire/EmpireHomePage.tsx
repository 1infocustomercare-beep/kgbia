import { useEffect, useState } from "react";
import "./empire-home.css";
import { PORTFOLIO_ITEMS, HERO_PHONES, SECTOR_SHOWCASE } from "./data/portfolio";
import { useReveal, useCountUp } from "./hooks/useReveal";

const NAV_LINKS = [
  { label: "Settori", href: "#sectors" },
  { label: "Come funziona", href: "#how" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Pacchetti", href: "#pricing" },
  { label: "Team", href: "#team" },
  { label: "FAQ", href: "#faq" },
];

const MARQUEE = [
  "Ristoranti", "Pizzerie", "Dentisti", "Spa & Wellness", "Palestre", "Immobiliari",
  "Hotel & B&B", "Noleggio auto", "Charter & Yacht", "Pet Care", "Asili nido",
  "Parrucchieri", "Estetiste", "Studi medici", "E-commerce", "Consulenti",
  "Padel & Sport", "Idraulici", "Beach Club", "Cevicherie",
];

const STATS = [
  { num: 1997, prefix: "€", suffix: "", label: "Setup Digital Start (3x €699 disponibili)" },
  { num: 79, prefix: "€", suffix: "/mese", label: "Canone mensile da · ottimizzazione continua inclusa" },
  { num: 25, prefix: "", suffix: "+", label: "Settori coperti · framework verticalizzato" },
  { num: 14, prefix: "", suffix: "gg", label: "Tempo medio go-live dal contratto firmato" },
];

const STEPS = [
  { n: "01", t: "Analisi Strategica", d: "Studiamo business, mercato, competitor e opportunità nascoste. Progettiamo l'architettura del sistema su misura per il tuo settore." },
  { n: "02", t: "Setup & Integrazione", d: "Configuriamo webapp, agenti AI, automazioni, CRM e dashboard. Tutto collegato al tuo brand e ai tuoi gestionali." },
  { n: "03", t: "Training & Lancio", d: "L'AI viene addestrata sui tuoi dati: menu, servizi, pricing, FAQ, tone of voice. Testiamo ogni scenario prima del go-live." },
  { n: "04", t: "Ottimizzazione 24/7", d: "Monitoriamo le performance in tempo reale. Ottimizziamo conversazioni, funnel e campagne. Il sistema migliora ogni settimana." },
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
  { initials: "S", name: "Sebastiano", role: "Founder & CEO", bio: "Visionario dell'automazione AI per il business italiano. Creatore del Metodo Sebastiano." },
  { initials: "K", name: "Kevin", role: "CTO — AI Architecture", bio: "Architetto dei sistemi AI di Empire. Progetta l'infrastruttura multi-tenant e gli agenti specializzati." },
  { initials: "A", name: "Alessia", role: "Head of Strategy", bio: "Specialista in growth marketing e funnel di conversione. Trasforma i dati in strategie ROI-driven." },
];

const OBJECTIONS = [
  { q: '"Troppo caro."', a: "Un addetto alle prenotazioni costa €28–35K lordi/anno. Empire AI lavora 24/7 al costo di 1/10 di un dipendente. ROI in 4–8 mesi." },
  { q: '"La mia attività è diversa."', a: "Abbiamo lavorato con kebab, pizzerie gourmet, charter yacht, asili nido, dentistici, spa, padel club, noleggi. Se hai clienti, prenotazioni o ordini, Empire funziona." },
  { q: '"I miei clienti sono anziani."', a: "Il Voice Agent risponde al telefono: il cliente chiama come sempre. Sente solo una voce umana naturale che gli prende l'ordine." },
  { q: '"Ho paura di perdere il controllo."', a: "Ogni chiamata, prenotazione e ordine è tracciato su dashboard. Puoi intervenire, modificare, bloccare l'AI. Tu resti il capo: l'AI esegue." },
  { q: '"Ho già un gestionale."', a: "Empire si integra con TheFork, Booking, Stripe, Shopify, Teamsystem, Wix. Non rifacciamo quello che funziona, aggiungiamo gli agenti AI sopra." },
  { q: '"E se l\'AI sbaglia?"', a: "Nei primi 90 giorni un Empire Agent supervisiona ogni interazione. Addestriamo sui tuoi casi reali. Error rate medio dopo 60 giorni: 1,4%." },
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
      <div className="empire-faq-a">{a}</div>
    </div>
  );
}

/* ─────────── PAGE ─────────── */

export default function EmpireHomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSector, setActiveSector] = useState(0);
  const [heroShown, setHeroShown] = useState(false);

  useEffect(() => {
    document.title = "Empire AI — Sostituisci i tuoi dipendenti con agenti AI 24/7";
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    const t = window.setTimeout(() => setHeroShown(true), 200);
    return () => { window.removeEventListener("scroll", onScroll); window.clearTimeout(t); };
  }, []);

  const marquee = [...MARQUEE, ...MARQUEE];

  return (
    <div className="empire-home">
      {/* NAV */}
      <nav className="empire-nav" style={{ opacity: scrolled ? 1 : 0.98 }}>
        <div className="empire-nav-inner">
          <a href="#top" className="empire-brand">
            <span className="empire-brand-mark">E</span>
            <span>Empire.AI</span>
          </a>
          <div className="empire-nav-links">
            {NAV_LINKS.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
          </div>
          <a href="#pricing" className="empire-btn empire-btn--gold">Prenota call →</a>
        </div>
      </nav>

      <div id="top" />

      {/* HERO */}
      <section className="empire-hero">
        <div className="empire-hero-grain" />
        <div className="empire-wrap empire-hero-inner">
          <div>
            <span className="empire-eyebrow"><span className="dot" />Empire.AI · Webapp + 4 Agenti AI</span>
            <h1 style={{ marginTop: 28 }}>
              <span className="line"><span className={`word ${heroShown ? "shown" : ""}`} style={{ transitionDelay: "0.05s" }}>Sostituisci&nbsp;</span><span className={`word ${heroShown ? "shown" : ""}`} style={{ transitionDelay: "0.15s" }}>i&nbsp;</span><span className={`word ${heroShown ? "shown" : ""}`} style={{ transitionDelay: "0.22s" }}>dipendenti.</span></span>
              <span className="line"><span className={`word empire-italic-gold ${heroShown ? "shown" : ""}`} style={{ transitionDelay: "0.38s" }}>La&nbsp;tua&nbsp;azienda</span></span>
              <span className="line"><span className={`word ${heroShown ? "shown" : ""}`} style={{ transitionDelay: "0.55s" }}>lavora&nbsp;</span><span className={`word ${heroShown ? "shown" : ""}`} style={{ transitionDelay: "0.62s" }}>mentre&nbsp;</span><span className={`word ${heroShown ? "shown" : ""}`} style={{ transitionDelay: "0.7s" }}>dormi.</span></span>
            </h1>
            <p className="empire-hero-sub">
              Webapp su misura + 4 agenti AI che rispondono alle chiamate, vendono, riservano e chiedono recensioni — 24/7, in tutte le lingue. Setup in 14 giorni. Oltre 25 settori coperti.
            </p>
            <div className="empire-hero-ctas">
              <a href="#pricing" className="empire-btn empire-btn--gold">Parla con un Empire Agent →</a>
              <a href="#portfolio" className="empire-btn empire-btn--ghost">Vedi i progetti live</a>
            </div>
            <div className="empire-hero-meta">
              <div className="kpi"><b>14gg</b><span>Go-live medio</span></div>
              <div className="kpi"><b>25+</b><span>Settori coperti</span></div>
              <div className="kpi"><b>€79</b><span>/mese ottimizzazione</span></div>
              <div className="kpi"><b>24/7</b><span>Sempre attivi</span></div>
            </div>
          </div>

          <div className="empire-phone-stack">
            <div className="empire-phone p1 empire-floating d1"><img src={HERO_PHONES[1].url} alt={HERO_PHONES[1].name} /><span className="badge">{HERO_PHONES[1].sector}</span></div>
            <div className="empire-phone p2 empire-floating d2"><img src={HERO_PHONES[0].url} alt={HERO_PHONES[0].name} /><span className="badge">⭐ {HERO_PHONES[0].sector}</span></div>
            <div className="empire-phone p3 empire-floating d3"><img src={HERO_PHONES[2].url} alt={HERO_PHONES[2].name} /><span className="badge">{HERO_PHONES[2].sector}</span></div>
            <div className="empire-phone p4 empire-floating"><img src={HERO_PHONES[3].url} alt={HERO_PHONES[3].name} /></div>
          </div>
        </div>
      </section>

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
                <span className="empire-eyebrow"><span className="dot" />Numeri</span>
                <h2 style={{ marginTop: 20 }}>I numeri di Empire AI <span className="empire-italic-gold">nel 2025</span></h2>
              </div>
              <p className="empire-lede">
                Dietro ogni agente AI c'è un sistema testato su decine di business reali. Pricing trasparente, allineato ai piani ufficiali del nostro listino.
              </p>
            </div>
          </Reveal>
          <div className="empire-stats">
            {STATS.map((s, i) => <Stat key={i} {...s} />)}
          </div>
        </div>
      </section>

      {/* SECTORS — sticky */}
      <section className="empire-sec-ivory empire-sec-pad" id="sectors">
        <div className="empire-wrap">
          <Reveal>
            <div className="empire-head">
              <div>
                <span className="empire-eyebrow"><span className="dot" />25+ Settori coperti</span>
                <h2 style={{ marginTop: 20 }}>Il tuo settore <span className="empire-italic-gold">è già pronto.</span></h2>
              </div>
              <p className="empire-lede">
                Abbiamo mappato i flussi operativi di 25+ settori — dalle pizzerie ai charter di lusso, dagli asili nido ai noleggi yacht. Clicca un settore: a destra vedi la webapp reale di un nostro cliente, live e funzionante.
              </p>
            </div>
          </Reveal>

          <div className="empire-sector-grid">
            <div className="empire-sector-list">
              {SECTOR_SHOWCASE.map((s, i) => (
                <button key={i} className="empire-sector-card" data-active={activeSector === i} onClick={() => setActiveSector(i)}>
                  <h4>
                    <span>{s.title}</span>
                    <span className="chip">{s.chip}</span>
                  </h4>
                  <p>{s.desc}</p>
                  <div className="biz">→ {s.biz}</div>
                </button>
              ))}
            </div>

            <div className="empire-sector-stage">
              <div className="empire-stage-canvas">
                <div className="empire-stage-phone">
                  <img src={SECTOR_SHOWCASE[activeSector].item.url} alt={SECTOR_SHOWCASE[activeSector].item.name} />
                </div>
              </div>
              <span className="empire-stage-tag">{SECTOR_SHOWCASE[activeSector].chip}</span>
              <div className="empire-stage-name">{SECTOR_SHOWCASE[activeSector].item.name}</div>
            </div>
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

      {/* HOW IT WORKS */}
      <section className="empire-sec-ivory empire-sec-pad" id="how">
        <div className="empire-wrap">
          <Reveal>
            <div className="empire-head">
              <div>
                <span className="empire-eyebrow"><span className="dot" />4 Agenti AI · 1 Webapp</span>
                <h2 style={{ marginTop: 20 }}>Come Empire AI <span className="empire-italic-gold">lavora per te.</span></h2>
              </div>
              <p className="empire-lede">
                In 14 giorni costruiamo la tua webapp + agenti AI specializzati. Ti consegniamo un sistema completo che lavora 24/7, in tutte le lingue, senza ferie, senza assenze.
              </p>
            </div>
          </Reveal>
          <div className="empire-how-grid">
            {STEPS.map((s, i) => (
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

      {/* PRICING */}
      <section className="empire-sec-ivory empire-sec-pad" id="pricing" style={{ paddingTop: 0 }}>
        <div className="empire-wrap">
          <Reveal>
            <div className="empire-head">
              <div>
                <span className="empire-eyebrow"><span className="dot" />Pacchetti Empire</span>
                <h2 style={{ marginTop: 20 }}>3 livelli. <span className="empire-italic-gold">Zero rischi.</span></h2>
              </div>
              <p className="empire-lede">
                Ogni pacchetto include webapp su misura, agenti AI pre-addestrati sul tuo settore, onboarding con un Empire Agent dedicato e ottimizzazione continua. Setup una tantum + canone mensile trasparente.
              </p>
            </div>
          </Reveal>

          <div className="empire-packs">
            {PRICING.map((p, i) => (
              <div key={i} className={`empire-pack ${p.featured ? "featured" : ""}`}>
                {p.featured && <span className="ribbon">{p.tier}</span>}
                {!p.featured && <span className="p-tier">{p.tier}</span>}
                <div className="p-name">{p.name}</div>
                <div className="p-price">
                  <b>{p.setup}</b>
                  <span>{p.period}</span>
                </div>
                <span className="p-monthly">{p.monthly}</span>
                <p style={{ margin: 0, fontSize: 14, color: p.featured ? "rgba(246,243,238,.7)" : "var(--mute-2)" }}>{p.desc}</p>
                <ul>
                  {p.features.map((f, j) => <li key={j}>{f}</li>)}
                </ul>
                <a href="#contact" className={`empire-btn ${p.featured ? "empire-btn--gold" : "empire-btn--ghost"}`} style={{ marginTop: "auto" }}>{p.cta} →</a>
              </div>
            ))}
          </div>
          <p className="empire-pack-note">Tutti i prezzi IVA esclusa. Rateizzazione 3x o 6x disponibile. Cancelli quando vuoi.</p>
        </div>
      </section>

      {/* TEAM */}
      <section className="empire-sec-ink empire-sec-pad" id="team">
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
      <section className="empire-sec-ink empire-sec-pad" style={{ paddingTop: 0 }}>
        <div className="empire-wrap">
          <Reveal>
            <div className="empire-head">
              <div>
                <span className="empire-eyebrow"><span className="dot" />Obiezioni frequenti</span>
                <h2 style={{ marginTop: 20 }}>Le 6 cose che <span className="empire-italic-gold">pensi adesso.</span></h2>
              </div>
              <p className="empire-lede">
                Abbiamo già parlato con centinaia di imprenditori. Le obiezioni sono sempre le stesse sei. Le affrontiamo una per una, senza marketing.
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
              <span className="empire-eyebrow"><span className="dot" />Inizia oggi</span>
              <h2 style={{ marginTop: 20 }}>La tua azienda può <span className="empire-italic-gold">lavorare da sola.</span> Bastano 14 giorni.</h2>
              <p>
                Prenota una call di 20 minuti con un Empire Agent. Ti facciamo 8 domande, ti mostriamo 2 casi simili al tuo e ti mandiamo un preventivo dettagliato entro 48 ore. Gratis, senza vincoli.
              </p>
              <div className="ctas">
                <a href="https://wa.me/393513806722" target="_blank" rel="noreferrer" className="empire-btn empire-btn--gold">Prenota call WhatsApp →</a>
                <a href="mailto:info@empireaigroup.com" className="empire-btn empire-btn--ghost">Scrivici via email</a>
              </div>
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
              <a href="https://wa.me/393513806722">WhatsApp</a>
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
