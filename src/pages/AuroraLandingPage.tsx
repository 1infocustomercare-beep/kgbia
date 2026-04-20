import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Mic, Sparkles, Workflow, TrendingUp, ShieldCheck, BarChart3,
  ArrowRight, Check, Star, Phone, Mail, Calendar, Menu, X,
  Zap, Clock, Trophy, Heart, MessageSquare, Globe2,
} from "lucide-react";
import "@/components/landing-aurora/aurora.css";
import {
  SECTOR_PACKS, HERO_PHASES, AGENT_FAMILIES, TEAM_MEMBERS, FAQS,
} from "@/components/landing-aurora/aurora-data";
import EmpireVoiceAgent from "@/components/public/EmpireVoiceAgent";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Mic, Sparkles, Workflow, TrendingUp, ShieldCheck, BarChart3,
};

/* ─────────── Reveal hook ─────────── */
function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.unobserve(el); } },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ─────────── Scroll progress + nav ─────────── */
function ScrollProgress() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setW(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="aurora-progress" style={{ width: `${w}%` }} />;
}

function AuroraNav() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#sectors", label: "Settori" },
    { href: "#preview", label: "Preview" },
    { href: "#agents", label: "Agenti AI" },
    { href: "#pricing", label: "Pacchetti" },
    { href: "#team", label: "Team" },
    { href: "#contact", label: "Contatti" },
  ];
  return (
    <>
      <div className="aurora-urgency">
        <span className="pulse-dot" />
        <strong>SOLO 7 SLOT </strong> disponibili per l'onboarding di Maggio · <strong>Garanzia 30 giorni</strong> o rimborsato
      </div>
      <nav className="aurora-nav">
        <div className="aurora-container aurora-nav-inner">
          <a href="#top" className="aurora-brand">
            <span className="aurora-brand-mark">E</span>
            Empire.AI <small>· dal 2024</small>
          </a>
          <ul>
            {links.map((l) => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
          <div className="hidden lg:flex">
            <a href="#contact" className="aurora-btn aurora-btn-primary">Prenota call <ArrowRight className="w-4 h-4 arr" /></a>
          </div>
          <button className={`aurora-burger lg:hidden ${open ? "open" : ""}`} onClick={() => setOpen((o) => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
        <div className={`aurora-mobile-menu ${open ? "open" : ""}`}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="aurora-btn aurora-btn-primary aurora-btn-lg">Prenota call gratuita</a>
        </div>
      </nav>
    </>
  );
}

/* ─────────── HERO scrollytelling ─────────── */
function HeroScrolly() {
  const pinRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = pinRef.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -r.top / total));
      setPhase(Math.min(HERO_PHASES.length - 1, Math.floor(p * HERO_PHASES.length * 0.999)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={pinRef} className="aurora-hero-pin" id="top">
      <section className="aurora-hero">
        <div className="aurora-hero-bg" />
        <div className="aurora-hero-grid" />
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />

        <div className="aurora-hero-inner">
          <div className="aurora-hero-copy">
            <span className="aurora-hero-badge">
              <span className="pulse-dot" />
              <strong>127 PMI italiane</strong> già operative · 4,9★
            </span>
            <div className="aurora-phase-stage">
              {HERO_PHASES.map((ph, i) => (
                <div key={i} className={`aurora-phase ${i === phase ? "active" : ""}`}>
                  <span className="aurora-eyebrow">{ph.eyebrow}</span>
                  <h1 className="aurora-h1">
                    {ph.title.lead}{" "}
                    <span className="aurora-em-shine">{ph.title.accent}</span>
                    {ph.title.tail}
                  </h1>
                  <p className="aurora-lede max-w-xl">{ph.sub}</p>
                  <div className="aurora-hero-ctas">
                    <a href="#contact" className="aurora-btn aurora-btn-primary aurora-btn-lg">
                      {ph.cta.primary} <ArrowRight className="w-4 h-4 arr" />
                    </a>
                    <a href="#sectors" className="aurora-btn aurora-btn-ghost aurora-btn-lg">{ph.cta.secondary}</a>
                  </div>
                  <div className="aurora-hero-proof">
                    {ph.proof.map((p, j) => <span key={j}>{p}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="aurora-stage">
            <div className="aurora-phone-stack">
              {SECTOR_PACKS.slice(0, 3).map((s, i) => (
                <div key={s.id} className={`aurora-phone aurora-p${i + 1}`}>
                  <div className="aurora-phone-screen" style={{ ["--card-accent" as never]: s.accent }}>
                    <div className="scrn-emoji">{s.emoji}</div>
                    <h4 className="scrn-title">{s.preview.name}</h4>
                    <p className="scrn-tag">{s.label}</p>
                    <span className="scrn-pill">Live demo</span>
                  </div>
                  <div className="aurora-phone-glow" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="aurora-pin-dots">
          {HERO_PHASES.map((_, i) => <div key={i} className={`d ${i === phase ? "active" : ""}`} />)}
        </div>
        <div className="aurora-scroll-hint">
          <div className="mouse"><span /></div>
          Scroll
        </div>
      </section>
    </div>
  );
}

/* ─────────── Ticker ─────────── */
function AuroraTicker() {
  const items = ["Stripe Connect", "AES-256", "GDPR by design", "PWA Certified", "99.9% uptime", "Voice AI multilingua", "14 giorni al go-live", "ROI in 90gg", "Made in Italy", "White Label", "25+ settori verticali", "Integrazioni illimitate"];
  return (
    <section className="aurora-ticker">
      <div className="aurora-ticker-track">
        {[0, 1].map((k) => (
          <React.Fragment key={k}>
            {items.map((t, i) => <span key={`${k}-${i}`}>{t}</span>)}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

/* ─────────── Sector Configurator ─────────── */
function SectorConfigurator() {
  const [active, setActive] = useState(0);
  const pack = SECTOR_PACKS[active];
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="aurora-section" id="sectors">
      <div className="aurora-container">
        <div className="aurora-section-head aurora-reveal in">
          <span className="aurora-eyebrow">Configura il tuo pacchetto</span>
          <h2 className="aurora-h2">
            Scegli il tuo settore.<br />
            Ti mostro <span className="aurora-em-violet">cosa cambia</span> in 30 secondi.
          </h2>
          <p className="aurora-lede">Ogni settore ha agenti diversi, KPI diversi, dolori diversi. Seleziona il tuo: ti svelo i numeri reali e l'esatto pacchetto su misura.</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          {SECTOR_PACKS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className={`aurora-sector-pill ${i === active ? "active" : ""}`}
            >
              <span>{s.emoji}</span> {s.label}
            </button>
          ))}
        </div>

        <div ref={ref} key={pack.id} className="aurora-reveal in grid lg:grid-cols-[1.1fr_.9fr] gap-8 items-stretch">
          <div className="aurora-agent-card" style={{ ["--card-accent" as never]: `${pack.accent}33` }}>
            <span className="aurora-eyebrow mb-3 block">{pack.label}</span>
            <h3 className="aurora-h3 mb-4">{pack.hero}</h3>
            <p className="aurora-lede mb-6">{pack.tagline}</p>

            <div className="grid sm:grid-cols-2 gap-5 mb-6">
              <div>
                <p className="text-xs uppercase tracking-[.18em] text-white/40 font-mono mb-3">Cosa risolve</p>
                <ul className="space-y-2">
                  {pack.pains.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-white/75">
                      <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[.18em] text-white/40 font-mono mb-3">I tuoi nuovi numeri</p>
                <ul className="space-y-2">
                  {pack.wins.map((w) => (
                    <li key={w} className="flex gap-2 text-sm text-white/90">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {pack.agents.map((a) => (
                <span key={a} className="px-3 py-1.5 rounded-full text-xs font-mono"
                  style={{ background: `${pack.accent}1F`, border: `1px solid ${pack.accent}55`, color: "#F6F3EE" }}>
                  ◆ {a}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to={pack.preview.route} className="aurora-btn aurora-btn-primary">
                Apri demo {pack.preview.name} <ArrowRight className="w-4 h-4 arr" />
              </Link>
              <a href="#contact" className="aurora-btn aurora-btn-ghost">Voglio questo pacchetto</a>
            </div>
          </div>

          <div className="aurora-stage" style={{ minHeight: 460 }}>
            <div className="aurora-phone" style={{ position: "relative", width: "min(320px, 80%)", aspectRatio: ".48/1", transform: "rotate(-3deg)" }}>
              <div className="aurora-phone-screen" style={{ ["--card-accent" as never]: pack.accent }}>
                <div className="scrn-emoji">{pack.emoji}</div>
                <h4 className="scrn-title">{pack.preview.name}</h4>
                <p className="scrn-tag">{pack.label}</p>
                <span className="scrn-pill" style={{ background: `${pack.accent}26`, borderColor: `${pack.accent}66` }}>Demo live</span>
              </div>
              <div className="aurora-phone-glow" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Preview Gallery ─────────── */
function PreviewGallery() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="aurora-section" id="preview" style={{ background: "linear-gradient(180deg, transparent, rgba(138,124,255,.04), transparent)" }}>
      <div className="aurora-container">
        <div className="aurora-section-head aurora-reveal in">
          <span className="aurora-eyebrow">Galleria preview</span>
          <h2 className="aurora-h2">9 settori, <span className="aurora-em-cyan">9 demo live</span>. Tocca per esplorare.</h2>
          <p className="aurora-lede">Ogni preview è un'app reale, navigabile, costruita per il suo settore. Apri quella che ti somiglia di più.</p>
        </div>

        <div ref={ref} className="aurora-reveal in grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {SECTOR_PACKS.map((s) => (
            <Link key={s.id} to={s.preview.route} className="aurora-preview-card group">
              <div className="pcard-screen" style={{ background: `linear-gradient(165deg, ${s.accent}33, ${s.accent}0A)` }}>
                <div className="text-5xl mb-3">{s.emoji}</div>
                <h4 className="aurora-h4 mb-1">{s.preview.name}</h4>
                <p className="text-xs text-white/55">{s.label}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-white font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  Apri demo <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/demo" className="aurora-btn aurora-btn-primary aurora-btn-lg">
            Vedi tutte le 25+ preview live <ArrowRight className="w-4 h-4 arr" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Agents Bento ─────────── */
function AgentsBento() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="aurora-section" id="agents">
      <div className="aurora-container">
        <div className="aurora-section-head aurora-reveal in">
          <span className="aurora-eyebrow">L'ecosistema agenti</span>
          <h2 className="aurora-h2">6 famiglie. <span className="aurora-em-violet">Una sola intelligenza</span> orchestrante.</h2>
          <p className="aurora-lede">Voice, Concierge, Operations, Growth, Compliance, Insight. Ogni agente è specializzato — tutti dialogano in tempo reale.</p>
        </div>

        <div ref={ref} className="aurora-reveal in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {AGENT_FAMILIES.map((a) => {
            const Icon = ICON_MAP[a.icon] || Sparkles;
            return (
              <div key={a.id} className="aurora-agent-card" style={{ ["--card-accent" as never]: `${a.accent}33` }}>
                <div className="icon-wrap mb-4" style={{ background: `${a.accent}26`, borderColor: `${a.accent}55`, color: a.accent }}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="aurora-h4 mb-2">{a.title}</h3>
                <p className="text-sm text-white/65 mb-4">{a.subtitle}</p>
                <ul className="space-y-1.5 mb-4">
                  {a.skills.map((s) => (
                    <li key={s} className="text-xs text-white/70 flex gap-2">
                      <span style={{ color: a.accent }}>◆</span> {s}
                    </li>
                  ))}
                </ul>
                <div className="text-xs font-mono uppercase tracking-wider" style={{ color: a.accent }}>{a.impact}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────── Pricing ─────────── */
function Pricing() {
  const ref = useReveal<HTMLDivElement>();
  const plans = [
    {
      name: "Digital Start", price: "€1.997", note: "una tantum · rateizzabile 3x", color: "#4DD9E5",
      features: ["1 sito + 2 agenti AI", "Setup in 14 giorni", "Voice agent base", "WhatsApp + Email automation", "Garanzia 30 giorni"],
    },
    {
      name: "Empire Pro", price: "€4.997", note: "una tantum · rateizzabile 6x", color: "#8A7CFF", featured: true,
      features: ["Sito premium + 6 agenti AI", "Voice agent avanzato multilingua", "CRM + analytics in tempo reale", "Integrazioni illimitate", "Priority support 7gg/7", "Onboarding white-glove"],
    },
    {
      name: "Empire Custom", price: "Su misura", note: "a partire da €9.997", color: "#F5DBA2",
      features: ["Ecosistema agenti completo", "AI custom training su tuoi dati", "Integrazioni enterprise", "SLA dedicato 99.9%", "Account manager personale", "Roadmap evolutiva"],
    },
  ];
  return (
    <section className="aurora-section" id="pricing">
      <div className="aurora-container">
        <div className="aurora-section-head aurora-reveal in">
          <span className="aurora-eyebrow">Pacchetti</span>
          <h2 className="aurora-h2">Investimento <span className="aurora-em-shine">una tantum</span>. ROI a vita.</h2>
          <p className="aurora-lede">Niente abbonamenti che ti svuotano il conto ogni mese. Paghi una volta, è tuo. La piattaforma resta tua, gli agenti continuano a lavorare.</p>
        </div>

        <div ref={ref} className="aurora-reveal in grid md:grid-cols-3 gap-5">
          {plans.map((p) => (
            <div key={p.name} className={`aurora-pricing-card ${p.featured ? "featured" : ""}`}>
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase" style={{ background: "linear-gradient(135deg,#8A7CFF,#4DD9E5)", color: "#08091A" }}>
                  Più scelto
                </span>
              )}
              <div>
                <h3 className="aurora-h3 mb-1" style={{ color: p.color }}>{p.name}</h3>
                <p className="text-xs font-mono uppercase tracking-wider text-white/50">{p.note}</p>
              </div>
              <div className="pc-price">{p.price}</div>
              <ul>
                {p.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <a href="#contact" className={`aurora-btn ${p.featured ? "aurora-btn-primary" : "aurora-btn-ghost"} w-full justify-center`}>
                Inizia con {p.name} <ArrowRight className="w-4 h-4 arr" />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-10 grid sm:grid-cols-3 gap-4 text-center">
          {[
            { icon: ShieldCheck, label: "Garanzia 30gg o rimborsato" },
            { icon: Clock, label: "Go-live in 14 giorni" },
            { icon: Trophy, label: "127 PMI già operative · 4,9★" },
          ].map((x, i) => (
            <div key={i} className="flex items-center justify-center gap-2 text-sm text-white/65">
              <x.icon className="w-4 h-4 text-violet-300" /> {x.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── About + Team ─────────── */
function AboutTeam() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="aurora-section" id="team" style={{ background: "linear-gradient(180deg, transparent, rgba(77,217,229,.04), transparent)" }}>
      <div className="aurora-container">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start mb-16">
          <div className="aurora-reveal in">
            <span className="aurora-eyebrow">Chi siamo</span>
            <h2 className="aurora-h2 mt-4 mb-6">Empire.AI è un'agenzia <span className="aurora-em-italic">di ossessione</span>.</h2>
            <p className="aurora-lede mb-4">Nasciamo nel 2024 con una missione netta: liberare gli imprenditori italiani dalle ore meccaniche. In 18 mesi abbiamo costruito agenti vocali e digitali per 127 PMI in 25+ settori.</p>
            <p className="aurora-lede">Il nostro standard è semplice: se non chiudi più appuntamenti, vendi più upsell e dormi meglio entro 30 giorni — ti rimborsiamo. Senza domande.</p>
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { n: "127", l: "PMI servite" },
                { n: "€4M+", l: "ricavi gestiti" },
                { n: "92", l: "NPS clienti" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="aurora-h2" style={{ fontSize: "clamp(28px,4vw,44px)" }}>
                    <span className="aurora-em-shine">{s.n}</span>
                  </div>
                  <p className="text-xs text-white/55 uppercase tracking-wider mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <div ref={ref} className="aurora-reveal in grid grid-cols-2 gap-4">
            {TEAM_MEMBERS.map((m) => (
              <div key={m.name} className="aurora-agent-card" style={{ ["--card-accent" as never]: `${m.accent}33` }}>
                <div className="w-14 h-14 rounded-2xl grid place-items-center text-lg font-bold mb-4"
                  style={{ background: `linear-gradient(135deg, ${m.accent}, ${m.accent}88)`, color: "#08091A" }}>
                  {m.initials}
                </div>
                <h4 className="aurora-h4 mb-1">{m.name}</h4>
                <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: m.accent }}>{m.role}</p>
                <p className="text-sm text-white/65">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Testimonials ─────────── */
function Testimonials() {
  const items = [
    { quote: "Sostituiti 3 telefoni, mai più no-show. Pagato in 6 settimane.", author: "Marco R.", role: "Pizzeria Da Marco · Roma", emoji: "🍕" },
    { quote: "Da 8 transfer al giorno a 22. Solo automatizzando le quote.", author: "Salvatore D.", role: "NCC Amalfi · Salerno", emoji: "🚘" },
    { quote: "Le ragazze in salone non rispondono più al telefono. Felici.", author: "Giulia B.", role: "Glow Beauty · Milano", emoji: "💆‍♀️" },
    { quote: "Booking diretti +47%. Il concierge AI vende esperienze h24.", author: "Andrea V.", role: "Villa Belvedere · Toscana", emoji: "🏨" },
  ];
  return (
    <section className="aurora-section">
      <div className="aurora-container">
        <div className="aurora-section-head aurora-reveal in">
          <span className="aurora-eyebrow">Cosa dicono</span>
          <h2 className="aurora-h2">127 imprenditori italiani. <span className="aurora-em-cyan">Una sola voce.</span></h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {items.map((t, i) => (
            <div key={i} className="aurora-agent-card aurora-reveal in">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{t.emoji}</div>
                <div className="flex">{Array.from({ length: 5 }).map((_, k) => <Star key={k} className="w-4 h-4 fill-amber-300 text-amber-300" />)}</div>
              </div>
              <p className="aurora-h4 italic mb-4" style={{ fontFamily: "var(--serif-i)" }}>"{t.quote}"</p>
              <div>
                <div className="text-sm text-white">{t.author}</div>
                <div className="text-xs text-white/55">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── FAQ ─────────── */
function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="aurora-section" id="faq">
      <div className="aurora-container max-w-4xl">
        <div className="aurora-section-head aurora-reveal in">
          <span className="aurora-eyebrow">Domande franche</span>
          <h2 className="aurora-h2">Risposte <span className="aurora-em-violet">altrettanto franche</span>.</h2>
        </div>
        <div className="space-y-2">
          {FAQS.map((f, i) => (
            <div key={i} className="aurora-agent-card !p-0 overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full text-left p-5 flex items-center justify-between gap-4">
                <span className="aurora-h4 pr-4">{f.q}</span>
                <span className={`w-8 h-8 rounded-full grid place-items-center bg-white/5 border border-white/10 transition-transform ${open === i ? "rotate-45" : ""}`}>
                  <span className="text-violet-200 text-lg leading-none">+</span>
                </span>
              </button>
              <div className="grid transition-all duration-500" style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}>
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-white/70 text-sm leading-relaxed">{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── Contact / Booking CTA ─────────── */
function ContactCTA() {
  const [sent, setSent] = useState(false);
  return (
    <section className="aurora-section" id="contact">
      <div className="aurora-container max-w-5xl">
        <div className="aurora-agent-card !p-8 sm:!p-12" style={{ ["--card-accent" as never]: "rgba(138,124,255,.3)" }}>
          <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
            <div>
              <span className="aurora-eyebrow">Prenota la tua call con Sofia</span>
              <h2 className="aurora-h2 mt-4 mb-4">30 minuti. <span className="aurora-em-shine">Zero fuffa</span>.</h2>
              <p className="aurora-lede mb-6">Capiamo il tuo settore, ti mostriamo demo reali, ti diciamo se possiamo aiutarti. Se sì, parti la settimana dopo. Se no, ti consigliamo dove andare.</p>
              <ul className="space-y-2.5 text-sm text-white/80 mb-6">
                {["Audit AI gratuito da 30 minuti", "Demo live del tuo settore", "Stima ROI personalizzata", "Zero impegno, zero pressione"].map((f) => (
                  <li key={f} className="flex gap-2"><Check className="w-4 h-4 text-cyan-300 mt-0.5 shrink-0" /> {f}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3 text-xs text-white/55 font-mono">
                <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" /> Risposta in 2h</span>
                <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" /> info@empireaigroup.com</span>
              </div>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="space-y-4"
            >
              <div>
                <label className="aurora-label">Nome e cognome</label>
                <input required className="aurora-input" placeholder="Mario Rossi" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="aurora-label">Email</label>
                  <input required type="email" className="aurora-input" placeholder="mario@azienda.it" />
                </div>
                <div>
                  <label className="aurora-label">Telefono</label>
                  <input required className="aurora-input" placeholder="+39…" />
                </div>
              </div>
              <div>
                <label className="aurora-label">Settore</label>
                <select className="aurora-input">
                  {SECTOR_PACKS.map((s) => <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>)}
                  <option>Altro</option>
                </select>
              </div>
              <button type="submit" disabled={sent} className="aurora-btn aurora-btn-primary aurora-btn-lg w-full justify-center">
                {sent ? "✓ Richiesta ricevuta — ti chiamiamo entro 2h" : <>Prenota la call gratuita <Calendar className="w-4 h-4" /></>}
              </button>
              <p className="text-[11px] text-white/40 text-center font-mono">Privacy-first · GDPR · Niente spam, mai.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Footer ─────────── */
function Footer() {
  return (
    <footer className="aurora-footer">
      <div className="aurora-container">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="aurora-brand mb-3"><span className="aurora-brand-mark">E</span> Empire.AI</div>
            <p className="text-sm text-white/55">Agenti AI vocali e digitali per PMI italiane. Made in Italy, dal 2024.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[.18em] text-white/40 font-mono mb-3">Prodotto</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#sectors">Settori</a></li>
              <li><a href="#preview">Preview</a></li>
              <li><a href="#agents">Agenti</a></li>
              <li><a href="#pricing">Pacchetti</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[.18em] text-white/40 font-mono mb-3">Azienda</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#team">Team</a></li>
              <li><a href="#contact">Contatti</a></li>
              <li><Link to="/privacy">Privacy</Link></li>
              <li><Link to="/cookie-policy">Cookie</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[.18em] text-white/40 font-mono mb-3">Contatti</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="inline-flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> info@empireaigroup.com</li>
              <li className="inline-flex items-center gap-2"><Globe2 className="w-3.5 h-3.5" /> Milano · Roma · Remote</li>
            </ul>
          </div>
        </div>
        <div className="pt-6 border-t border-white/8 flex flex-wrap items-center justify-between gap-3 text-xs text-white/40 font-mono">
          <span>© {new Date().getFullYear()} Empire AI Group. Tutti i diritti riservati.</span>
          <span>Made with <Heart className="w-3 h-3 inline text-rose-400" /> in Italia</span>
        </div>
      </div>
    </footer>
  );
}

/* ─────────── PAGE ─────────── */
const SafeVoiceAgent = React.memo(() => <EmpireVoiceAgent />, () => true);

export default function AuroraLandingPage() {
  useEffect(() => {
    document.title = "Empire.AI — Sostituisci i dipendenti con AI 24/7";
  }, []);

  return (
    <>
      <div className="aurora-root">
        <ScrollProgress />
        <AuroraNav />
        <HeroScrolly />
        <AuroraTicker />
        <SectorConfigurator />
        <PreviewGallery />
        <AgentsBento />
        <Pricing />
        <AboutTeam />
        <Testimonials />
        <Faq />
        <ContactCTA />
        <Footer />
      </div>
      <SafeVoiceAgent />
    </>
  );
}
