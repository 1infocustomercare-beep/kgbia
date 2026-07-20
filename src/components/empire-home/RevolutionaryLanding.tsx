import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Check,
  ChevronDown,
  Command,
  Gem,
  Globe2,
  Layers3,
  LineChart,
  MessageCircle,
  Play,
  Radar,
  Rocket,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import OfficialEmpireHomeAlias from "@/components/empire-home/OfficialEmpireHomeAlias";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

const sectors = [
  "Food", "NCC", "Beauty", "Hotel", "Fitness", "Retail", "Healthcare", "Real Estate",
];

const systems = [
  {
    icon: BrainCircuit,
    title: "Strategia AI",
    body: "Analisi del settore, proposta su misura, priorità operative e roadmap visiva prima di scrivere codice.",
  },
  {
    icon: WandSparkles,
    title: "Demo vendibile",
    body: "Mockup premium e sito 1:1 pronti da mostrare al cliente, costruiti sul posizionamento reale del business.",
  },
  {
    icon: Bot,
    title: "Agenti operativi",
    body: "Arianna e gli agenti verticali seguono lead, booking, vendite, contenuti e follow-up senza perdere contesto.",
  },
  {
    icon: ShieldCheck,
    title: "Controllo totale",
    body: "Dashboard, ruoli, automazioni e workflow con supervisione umana: potenza AI senza perdere governance.",
  },
];

const journey = [
  { step: "01", title: "Diagnosi", text: "Mappiamo pubblico, offerta, attriti e margini invisibili." },
  { step: "02", title: "Prototipo", text: "Costruiamo esperienza mobile-first, demo e messaggio vendita." },
  { step: "03", title: "Sistema", text: "Colleghiamo AI, dati, CRM, pagamenti e automazioni operative." },
  { step: "04", title: "Crescita", text: "Iteriamo su conversione, contenuti, outreach e retention." },
];

const agentRows = [
  ["Arianna", "Consulente vocale", "qualifica lead e prenota call"],
  ["Scout", "Prospecting", "trova attività con gap digitale"],
  ["Demo Studio", "Mockup AI", "crea presentazioni vendibili"],
  ["Command", "Operations", "orchestra task multi-settore"],
  ["Vault", "Asset", "riusa loghi, foto e reference"],
];

const faqs = [
  {
    q: "È una landing o una piattaforma completa?",
    a: "È un sistema operativo commerciale: landing, mockup, demo, agenti AI e dashboard lavorano insieme per generare e chiudere opportunità.",
  },
  {
    q: "Funziona da mobile?",
    a: "Sì. Questa home è progettata mobile-first: nessuna sezione è fuori flusso, gli effetti sono contenuti e i touch target restano comodi.",
  },
  {
    q: "Posso usarla per settori diversi?",
    a: "Sì. Empire separa food, NCC, beauty, hospitality e altri verticali con routing, contenuti e workflow dedicati.",
  },
];

function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 34, rotateX: 8, filter: "blur(14px)" }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.78, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Section({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={cn("relative isolate w-full overflow-hidden px-gutter py-section-y-lg", className)}>
      <div className="mx-auto w-full max-w-app-full">{children}</div>
    </section>
  );
}

function GradientMesh() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 16% 12%, hsl(var(--primary) / 0.22), transparent 30%), radial-gradient(circle at 88% 18%, hsl(var(--empire-violet) / 0.24), transparent 32%), radial-gradient(circle at 58% 76%, hsl(var(--accent) / 0.18), transparent 34%), linear-gradient(180deg, hsl(var(--background)), hsl(var(--deep-black)))",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--foreground) / 0.16) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground) / 0.12) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage: "linear-gradient(to bottom, transparent, black 14%, black 72%, transparent)",
        }}
      />
    </div>
  );
}

function HeroStage() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.92]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const consoleRotate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -8]);

  return (
    <section id="hero" ref={ref} className="relative isolate min-h-[100svh] overflow-hidden px-gutter pb-12 pt-24 md:pt-28">
      <GradientMesh />
      <motion.div style={{ scale: heroScale, y: heroY }} className="relative z-10 mx-auto grid min-h-[calc(100svh-9rem)] w-full max-w-app-full items-center gap-10 lg:grid-cols-[1.03fr_0.97fr]">
        <div className="max-w-4xl">
          <Reveal>
            <div className="mb-6 inline-flex min-h-11 items-center gap-3 rounded-sm border border-border bg-card/70 px-4 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-primary" />
              Agenzia AI ultra rivoluzionaria
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="max-w-5xl font-display text-[clamp(2.65rem,11vw,8.5rem)] font-extrabold leading-[0.9] tracking-normal text-foreground [hyphens:none] [overflow-wrap:normal] [word-break:normal] sm:text-[clamp(4rem,10vw,8.5rem)] lg:leading-[0.86]">
              L&apos;impero digitale che lavora mentre tu vendi.
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:mt-7 md:text-xl md:leading-9">
              Empire trasforma siti, demo, agenti vocali, automazioni e dashboard in un'unica macchina commerciale per business locali e partner.
            </p>
          </Reveal>

          <Reveal delay={0.24} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => navigate("/auth")} className="min-h-11 rounded-sm px-6 font-bold">
              Entra in Empire <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => document.getElementById("showcase")?.scrollIntoView({ behavior: "smooth" })} className="min-h-11 rounded-sm border-border bg-card/60 px-6 font-bold backdrop-blur-xl">
              Vedi il sistema <Play className="h-4 w-4" />
            </Button>
          </Reveal>
        </div>

        <motion.div style={{ rotateX: consoleRotate }} className="relative mx-auto w-full max-w-[620px] lg:ml-auto" aria-label="Empire command center preview">
          <Reveal delay={0.18}>
            <div className="relative overflow-hidden rounded-md border border-border bg-card/88 p-3 shadow-2xl backdrop-blur-2xl">
              <div className="mb-3 flex items-center justify-between rounded-sm border border-border bg-background/70 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-sm bg-primary text-primary-foreground"><Command className="h-4 w-4" /></span>
                  <div>
                    <p className="text-sm font-bold text-foreground">Empire Command</p>
                    <p className="text-xs text-muted-foreground">Live orchestration</p>
                  </div>
                </div>
                <span className="rounded-sm border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">ACTIVE</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {systems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      className="min-h-[154px] rounded-sm border border-border bg-background/62 p-4"
                      animate={reduce ? undefined : { y: [0, index % 2 ? -6 : 6, 0] }}
                      transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Icon className="mb-4 h-5 w-5 text-primary" />
                      <h2 className="text-base font-bold text-foreground">{item.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-3 rounded-sm border border-border bg-background/70 p-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Pipeline</span>
                  <span className="text-xs font-semibold text-accent">Mockup → Demo → Call → Close</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {journey.map((item) => (
                    <div key={item.step} className="h-2 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${Number(item.step) * 24}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Showcase() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [0, 0, 0] : [-10, 0, 10]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [44, -44]);

  return (
    <Section id="showcase" className="bg-background">
      <div ref={ref} className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-primary">Non un sito. Un sistema.</p>
            <h2 className="font-display text-[clamp(2.5rem,9vw,6.5rem)] font-extrabold leading-[0.9] tracking-normal text-foreground">
              Effetti scroll utili, non caos visivo.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
              Ogni scena ha altezza stabile, overflow bloccato e animazioni progressive: la pagina respira, guida, vende e non si rompe tra i device.
            </p>
          </div>
        </Reveal>

        <motion.div style={{ rotateY: rotate, y }} className="relative mx-auto w-full max-w-[760px] [transform-style:preserve-3d]">
          <div className="rounded-md border border-border bg-card p-4 shadow-2xl md:p-6">
            <div className="grid gap-3 md:grid-cols-[1fr_0.72fr]">
              <div className="rounded-sm border border-border bg-background p-5">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">AI Sales Room</p>
                    <h3 className="mt-2 text-2xl font-bold text-foreground">Demo pronta da mostrare</h3>
                  </div>
                  <Radar className="h-7 w-7 text-primary" />
                </div>
                <div className="space-y-3">
                  {["Lead trovato", "Mockup generato", "Sito 1:1 creato", "Messaggio WhatsApp pronto"].map((label) => (
                    <div key={label} className="flex min-h-11 items-center gap-3 rounded-sm border border-border bg-card px-3">
                      <Check className="h-4 w-4 text-accent" />
                      <span className="text-sm font-semibold text-foreground">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-3">
                <div className="rounded-sm border border-border bg-background p-5">
                  <LineChart className="mb-6 h-6 w-6 text-accent" />
                  <p className="text-4xl font-black text-foreground">Zero</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">spazi morti tra sezioni e nessun elemento fuori schermo.</p>
                </div>
                <div className="rounded-sm border border-border bg-background p-5">
                  <Layers3 className="mb-6 h-6 w-6 text-primary" />
                  <p className="text-4xl font-black text-foreground">3D</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">profondità controllata con reveal progressivo e sticky sicuro.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

function SectorMarquee() {
  const duplicated = useMemo(() => [...sectors, ...sectors], []);
  return (
    <Section id="sectors" className="bg-card">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-primary">25+ verticali</p>
        <h2 className="font-display text-[clamp(2.4rem,8vw,5.6rem)] font-extrabold leading-[0.92] text-foreground">Un motore, identità diverse.</h2>
        <p className="mt-5 text-base leading-8 text-muted-foreground md:text-lg">Empire adatta tono, layout e workflow al settore, senza template generici.</p>
      </Reveal>
      <div className="mt-10 overflow-hidden rounded-sm border border-border bg-background py-4">
        <motion.div className="flex w-max gap-3 px-4" animate={{ x: [0, -520] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}>
          {duplicated.map((sector, index) => (
            <span key={`${sector}-${index}`} className="inline-flex min-h-11 items-center rounded-sm border border-border bg-card px-5 text-sm font-bold text-foreground">
              {sector}
            </span>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

function Journey() {
  return (
    <Section id="process" className="bg-background">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-primary">Metodo Empire</p>
            <h2 className="font-display text-[clamp(2.4rem,8vw,5.4rem)] font-extrabold leading-[0.9] text-foreground">Dalla visione al sistema operativo.</h2>
          </div>
        </Reveal>
        <div className="grid gap-4">
          {journey.map((item, index) => (
            <Reveal key={item.step} delay={index * 0.05}>
              <div className="grid gap-4 rounded-sm border border-border bg-card p-5 md:grid-cols-[96px_1fr] md:p-7">
                <span className="font-display text-4xl font-black text-primary">{item.step}</span>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-base leading-8 text-muted-foreground">{item.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function AgentsMatrix() {
  return (
    <Section id="agents" className="bg-card">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-primary">AI Agents</p>
            <h2 className="font-display text-[clamp(2.4rem,8vw,5.8rem)] font-extrabold leading-[0.9] text-foreground">Una squadra digitale, non un chatbot.</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">Gli agenti sono progettati per vendere, organizzare, ricordare e produrre asset commerciali con supervisione.</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-md border border-border bg-background">
            {agentRows.map(([name, role, action], index) => (
              <div key={name} className="grid min-h-[76px] grid-cols-[44px_1fr] items-center gap-4 border-b border-border px-4 last:border-b-0 md:grid-cols-[56px_0.7fr_1fr] md:px-6">
                <div className="grid h-11 w-11 place-items-center rounded-sm bg-card text-primary"><Zap className="h-4 w-4" /></div>
                <div>
                  <p className="font-bold text-foreground">{name}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{role}</p>
                </div>
                <p className="col-span-2 text-sm leading-6 text-muted-foreground md:col-span-1">{action}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function Portfolio() {
  return (
    <Section id="portfolio" className="bg-background">
      <Reveal className="mb-10 max-w-4xl">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-primary">Portfolio engine</p>
        <h2 className="font-display text-[clamp(2.4rem,8vw,5.8rem)] font-extrabold leading-[0.9] text-foreground">Esperienze che sembrano costruite da una boutique, ma scalano come software.</h2>
      </Reveal>
      <div id="mockups" className="grid gap-4 md:grid-cols-3">
        {["Luxury restaurant", "NCC premium", "Beauty clinic"].map((label, index) => (
          <Reveal key={label} delay={index * 0.06}>
            <div className="min-h-[360px] overflow-hidden rounded-md border border-border bg-card p-4">
              <div className="flex h-full flex-col justify-between rounded-sm border border-border bg-background p-5">
                <div className="flex items-center justify-between">
                  <Globe2 className="h-6 w-6 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Preview</span>
                </div>
                <div>
                  <p className="font-display text-4xl font-black leading-none text-foreground">{label}</p>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">Hero cinematico, CTA vendibile, sezione prova sociale e admin demo collegabile.</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function PricingSignal() {
  const navigate = useNavigate();
  return (
    <Section id="pricing" className="bg-card">
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
        <Reveal>
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-primary">Accesso controllato</p>
            <h2 className="font-display text-[clamp(2.4rem,8vw,5.6rem)] font-extrabold leading-[0.9] text-foreground">Entra con una prova seria, non con una promessa vaga.</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">La prima fase serve a costruire asset reali, validare il messaggio e vedere cosa può automatizzare Empire nel tuo mercato.</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-md border border-border bg-background p-6 md:p-8">
            <Gem className="mb-8 h-7 w-7 text-primary" />
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-muted-foreground">Trial operativo</p>
            <p className="mt-3 font-display text-6xl font-black text-foreground">90 giorni</p>
            <ul className="mt-7 space-y-3 text-sm leading-6 text-muted-foreground">
              {["Audit e roadmap", "Mockup/demo iniziale", "Accesso al flusso AI", "Setup guidato"].map((item) => (
                <li key={item} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{item}</li>
              ))}
            </ul>
            <Button onClick={() => navigate("/auth")} className="mt-8 min-h-11 w-full rounded-sm font-bold">Richiedi accesso <Rocket className="h-4 w-4" /></Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <Section id="faq" className="bg-background">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-primary">Chiarezza</p>
        <h2 className="font-display text-[clamp(2.4rem,8vw,5.4rem)] font-extrabold leading-[0.9] text-foreground">Domande prima della rivoluzione.</h2>
      </Reveal>
      <div className="mx-auto mt-10 max-w-3xl divide-y divide-border rounded-md border border-border bg-card">
        {faqs.map((item, index) => (
          <button key={item.q} onClick={() => setOpen(open === index ? -1 : index)} className="block w-full p-5 text-left md:p-6">
            <span className="flex items-center justify-between gap-4">
              <span className="text-base font-bold text-foreground md:text-lg">{item.q}</span>
              <ChevronDown className={cn("h-5 w-5 shrink-0 text-primary transition-transform", open === index && "rotate-180")} />
            </span>
            {open === index && <span className="mt-4 block text-sm leading-7 text-muted-foreground md:text-base">{item.a}</span>}
          </button>
        ))}
      </div>
    </Section>
  );
}

function FinalCta() {
  const navigate = useNavigate();
  return (
    <Section id="contatti" className="bg-card pb-safe-bottom">
      <Reveal>
        <div className="relative overflow-hidden rounded-md border border-border bg-background p-6 md:p-10 lg:p-14">
          <div className="relative z-10 max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-primary">Prossima mossa</p>
            <h2 className="font-display text-[clamp(2.7rem,9vw,7rem)] font-extrabold leading-[0.86] text-foreground">Costruiamo qualcosa che i concorrenti non sanno nemmeno immaginare.</h2>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => navigate("/auth")} className="min-h-11 rounded-sm px-6 font-bold">Inizia ora <ArrowRight className="h-4 w-4" /></Button>
              <Button variant="outline" onClick={() => window.open("https://wa.me/393517303560", "_blank")} className="min-h-11 rounded-sm border-border bg-card px-6 font-bold">WhatsApp <MessageCircle className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

export default function RevolutionaryLanding() {
  return <OfficialEmpireHomeAlias />;

  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => undefined;
  }, []);

  return (
    <main className="relative w-full overflow-x-hidden bg-background text-foreground">
      <HeroStage />
      <Showcase />
      <SectorMarquee />
      <Journey />
      <AgentsMatrix />
      <Portfolio />
      <PricingSignal />
      <Faq />
      <FinalCta />
    </main>
  );
}