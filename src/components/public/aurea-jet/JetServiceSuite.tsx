/**
 * ═══ JET SERVICE SUITE ═══
 * Servizi, sicurezza (contatori animati), voci dei clienti, FAQ e concierge AI
 * dimostrativo. Tutto locale: nessuna chiamata di rete.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Plane, Radio, Ship, ShieldCheck, Stethoscope, Trophy, Send, MessageSquare, ChevronDown, Building2,
} from "lucide-react";
import { LuxePanel, LuxeTag, LuxeDivider } from "@/components/public/luxe";
import fboLounge from "@/assets/aurea-jet/fbo-lounge.jpg";
import cockpit from "@/assets/aurea-jet/cockpit.jpg";

/* ── Servizi ── */
const SERVICES = [
  { icon: Plane, title: "Charter jet privato", text: "Aeromobile scelto sulla rotta, non sul catalogo. Preventivo in 20 minuti." },
  { icon: Radio, title: "Elicottero & transfer", text: "Ultimo miglio in elicottero, auto con chauffeur sotto l’ala." },
  { icon: Ship, title: "Yacht & ville", text: "Charter nautici e dimore riservate coordinati con il volo." },
  { icon: Building2, title: "Gestione aeromobili", text: "Acquisto, AOC, equipaggi e manutenzione gestiti per l’armatore." },
  { icon: Trophy, title: "Sport & tour", text: "Squadre, troupe e delegazioni: logistica su misura, orari blindati." },
  { icon: Stethoscope, title: "Aero-sanitario", text: "Trasporto medico assistito con equipe dedicata, attivo 24/7." },
];

/* ── Contatore animato ── */
function Counter({ to, suffix = "", label }: { to: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <div ref={ref} className="px-5 py-8 text-center">
      <p className="font-heading text-3xl font-semibold sm:text-5xl">
        {n.toLocaleString("it-IT")}{suffix}
      </p>
      <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
    </div>
  );
}

/* ── FAQ ── */
const FAQ = [
  { q: "Quanto tempo serve per organizzare un volo?", a: "In media 2 ore dalla conferma. Su rotte intercontinentali consigliamo 5-6 ore per slot e handling." },
  { q: "Il prezzo indicato è definitivo?", a: "La stima del configuratore è indicativa. Il preventivo finale include slot, handling, catering e tasse aeroportuali, senza costi nascosti." },
  { q: "Posso portare animali a bordo?", a: "Sì, in cabina con te. Prepariamo pet suite, ciotole e documentazione sanitaria per il paese di destinazione." },
  { q: "Che standard di sicurezza applicate?", a: "Solo operatori certificati con audit indipendente, doppio equipaggio sulle tratte lunghe e monitoraggio meteo continuo del flight desk." },
  { q: "Come tutelate la privacy?", a: "Nessun nome nei manifest pubblici, terminal privati, NDA per l’equipaggio e cancellazione dei dati di volo su richiesta." },
];

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border/50">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex min-h-14 w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-heading text-base font-medium sm:text-xl">{q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-primary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden pb-6 text-sm leading-relaxed text-muted-foreground"
          >
            {a}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Concierge dimostrativo ── */
const SUGGESTED = [
  "Milano → Nizza domani per 4",
  "Serve uno chef a bordo?",
  "Posso volare con il cane?",
  "Quanto costa Roma → Dubai?",
];

const ANSWERS: Record<string, string> = {
  "Milano → Nizza domani per 4":
    "Ho tre aeromobili disponibili da Linate: Light in partenza 09:40, arrivo 10:35. Stima € 8.900 andata e ritorno con transfer incluso. Confermo lo slot?",
  "Serve uno chef a bordo?":
    "Su cabine Midsize e Ultra sì: menu firmato da uno chef stellato, servito a 12.000 metri. Supplemento € 2.400, da confermare 6 ore prima.",
  "Posso volare con il cane?":
    "Certo, in cabina con te. Preparo pet suite, documentazione sanitaria e handling con accesso riservato. Nessuna stiva, mai.",
  "Quanto costa Roma → Dubai?":
    "Con Aurea Ultra, no-stop in 6h: stima € 78.000 solo andata, doppio equipaggio e suite notte incluse. Ti mando la disponibilità dei prossimi 7 giorni.",
};

function Concierge() {
  const [log, setLog] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Sono Livia, il tuo flight advisor Aurea. Dimmi rotta, data e numero di passeggeri: ti rispondo in tempo reale." },
  ]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setLog((l) => [...l, { role: "user", text }]);
    setDraft("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setLog((l) => [
        ...l,
        {
          role: "ai",
          text:
            ANSWERS[text] ||
            "Perfetto. Verifico slot e aeromobili disponibili sulla tratta e ti invio due opzioni con prezzo bloccato entro 20 minuti.",
        },
      ]);
    }, 900);
  };

  return (
    <LuxePanel glass glow className="p-6 sm:p-8">
      <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-primary">
        <MessageSquare className="h-3.5 w-3.5" /> Concierge AI · 24/7
      </p>
      <div className="mt-6 max-h-[42svh] space-y-3 overflow-y-auto pr-1">
        {log.map((m, i) => (
          <div
            key={i}
            className={`max-w-[88%] border px-4 py-3 text-sm leading-relaxed ${
              m.role === "ai"
                ? "border-border/60 bg-card/70 text-foreground/85"
                : "ml-auto border-primary/50 bg-primary/12 text-foreground"
            }`}
          >
            {m.text}
          </div>
        ))}
        {typing && <p className="text-xs uppercase tracking-[0.24em] text-primary">Livia sta scrivendo…</p>}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {SUGGESTED.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            className="min-h-11 border border-border/60 px-3 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        className="mt-5 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Scrivi la tua richiesta di volo…"
          aria-label="Messaggio al concierge"
          className="min-h-12 w-full border border-border/60 bg-background/60 px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-primary"
        />
        <button
          type="submit"
          aria-label="Invia"
          className="flex h-12 w-12 shrink-0 items-center justify-center border border-primary/60 bg-primary/15 text-primary transition-colors hover:bg-primary/25"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </LuxePanel>
  );
}

/* ── Sezione completa ── */
export default function JetServiceSuite() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* Servizi */}
      <section id="servizi" className="relative px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <LuxeTag>I nostri servizi</LuxeTag>
          <h2 className="mt-5 max-w-2xl font-heading text-3xl font-semibold leading-tight sm:text-5xl">
            Tutto quello che sta prima e dopo il volo.
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <LuxePanel glass className="h-full p-7">
                  <Icon className="mb-7 h-6 w-6 text-primary" />
                  <h3 className="font-heading text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </LuxePanel>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sicurezza + cockpit */}
      <section className="relative border-y border-border/50">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[46svh]">
            <img src={cockpit} alt="Cockpit di un jet privato in volo notturno" loading="lazy" width={1600} height={1000} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/20" />
          </div>
          <div className="px-5 py-16 sm:px-10 sm:py-24">
            <LuxeTag><ShieldCheck className="h-3 w-3" /> Sicurezza</LuxeTag>
            <h2 className="mt-5 font-heading text-3xl font-semibold leading-tight sm:text-4xl">
              Standard verificati, non dichiarati.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              Ogni operatore passa un audit indipendente prima di entrare nel network. Il flight desk monitora meteo,
              slot e catene di rifornimento su ogni tratta, in tempo reale.
            </p>
            <div className="mt-10 grid grid-cols-2 divide-x divide-y divide-border/50 border border-border/50">
              <Counter to={5000} suffix="+" label="Aeroporti raggiungibili" />
              <Counter to={12400} suffix="" label="Voli coordinati" />
              <Counter to={100} suffix="%" label="Operatori certificati" />
              <Counter to={20} suffix="′" label="Tempo medio di risposta" />
            </div>
          </div>
        </div>
      </section>

      {/* Voci clienti + concierge */}
      <section className="relative px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1fr_1fr]">
          <div>
            <LuxeTag>Riservatezza</LuxeTag>
            <h2 className="mt-5 font-heading text-3xl font-semibold leading-tight sm:text-5xl">
              Chi vola con Aurea non lo racconta.<br />Lo ripete.
            </h2>
            <LuxeDivider className="max-w-xs" />
            <div className="space-y-4">
              {[
                { t: "Tre città in un giorno, senza mai correre. Il mio assistente non chiama più nessun altro.", a: "CEO · gruppo industriale, Brescia" },
                { t: "Cane, bagagli, due bambini: risolto in cabina. Impossibile tornare al volo di linea.", a: "Famiglia · Milano" },
                { t: "Volo spostato di due ore alle 23:40. Zero drammi, zero sovrapprezzi opachi.", a: "Managing partner · fondo, Lugano" },
              ].map((r) => (
                <LuxePanel key={r.a} className="p-6">
                  <p className="font-heading text-lg leading-snug">“{r.t}”</p>
                  <p className="mt-4 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{r.a}</p>
                </LuxePanel>
              ))}
            </div>
          </div>
          <Concierge />
        </div>
      </section>

      {/* FAQ + lounge */}
      <section className="relative border-t border-border/50 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <LuxeTag>Domande frequenti</LuxeTag>
            <h2 className="mt-5 font-heading text-3xl font-semibold leading-tight sm:text-4xl">
              Le risposte che chiedono tutti, prima del primo volo.
            </h2>
            <div className="mt-10">
              {FAQ.map((f, i) => (
                <FaqItem key={f.q} q={f.q} a={f.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden border border-border/60">
            <img src={fboLounge} alt="Lounge privata di un terminal executive" loading="lazy" width={1600} height={1000} className="h-full min-h-[42svh] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent" />
            <div className="absolute bottom-0 p-7">
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary">Terminal privato</p>
              <p className="mt-2 font-heading text-2xl font-semibold">Controlli in 4 minuti.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
