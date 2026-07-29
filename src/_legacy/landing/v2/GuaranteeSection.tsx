import { motion } from "framer-motion";
import { Clock, TrendingDown, Users, Zap, PhoneOff, FileX } from "lucide-react";

const PAINS = [
  {
    Icon: PhoneOff,
    title: "Telefono che squilla 24/7",
    problem: "Perdi clienti quando non rispondi. Il personale è sempre interrotto.",
    solution: "Voice Agent AI risponde in 2 secondi, prenota, qualifica, instrada. Zero chiamate perse, zero straordinari.",
    metric: "−87% chiamate al titolare",
    tone: "violet",
  },
  {
    Icon: Users,
    title: "Costo del personale fuori controllo",
    problem: "Stipendi, turni, ferie, sostituzioni. Margine eroso ogni mese.",
    solution: "Gli agenti AI gestiscono prenotazioni, recensioni, follow-up e fatture. Un dipendente in meno, output 3×.",
    metric: "−€2.400/mese in payroll",
    tone: "gold",
  },
  {
    Icon: TrendingDown,
    title: "Clienti che non tornano",
    problem: "Nessuno fa retargeting, niente promemoria, recensioni dimenticate.",
    solution: "Sequenze WhatsApp automatiche, loyalty integrata e recall intelligente sugli inattivi. Il cliente torna da solo.",
    metric: "+42% clienti ricorrenti",
    tone: "blue",
  },
  {
    Icon: FileX,
    title: "Burocrazia che ruba il weekend",
    problem: "Fatture, scadenze fiscali, report e planning sottraggono tempo alla vita privata.",
    solution: "Fatturazione elettronica automatica, dashboard real-time e alert proattivi. Tu firmi, l'AI fa il resto.",
    metric: "−12 ore/settimana",
    tone: "emerald",
  },
  {
    Icon: Clock,
    title: "Decisioni prese a sensazione",
    problem: "Non sai quale prodotto rende, quale orario è morto, quale canale converte.",
    solution: "AI analytics che leggono ogni transazione e suggeriscono mosse concrete. Smetti di tirare a indovinare.",
    metric: "+28% margine medio",
    tone: "violet",
  },
  {
    Icon: Zap,
    title: "Concorrenza che sembra avanti",
    problem: "Loro hanno sito moderno, prenotazioni online e presenza social. Tu rincorri.",
    solution: "Sito premium, agenti vocali e automazioni multicanale. In 14 giorni sei tu il riferimento del settore.",
    metric: "Live in 14 giorni",
    tone: "gold",
  },
];

export default function GuaranteeSection() {
  return (
    <section className="landing-section relative overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12" data-theme="dark">
      <div className="landing-section-glow" data-tone="violet" />

      <div className="relative mx-auto max-w-[1320px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-8 max-w-[820px] text-center"
          data-tone="violet"
        >
          <span className="landing-pill mb-5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em]">
            Problemi che risolviamo
          </span>
          <h2 className="mb-5 text-[clamp(1.85rem,4.8vw,3.4rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.04em] text-foreground">
            Automatizziamo ciò che oggi <span className="landing-heading-gradient">ti ruba tempo, marginalità e libertà.</span>
          </h2>
          <p className="text-[clamp(0.94rem,1.55vw,1.02rem)] leading-[1.68] text-foreground/72">
            Non vendiamo software: eliminiamo lavoro ripetitivo, riduciamo il costo del personale e restituiamo ore al titolare.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PAINS.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.06, duration: 0.6 }}
              className="landing-surface flex flex-col rounded-[26px] p-5 lg:p-6"
              data-tone={p.tone}
            >
              <div className="landing-icon-frame mb-5 h-12 w-12">
                <p.Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="mb-2 font-heading text-lg font-extrabold tracking-[-0.03em] text-foreground">{p.title}</h3>
              <p className="mb-4 text-[13px] italic leading-[1.65] text-foreground/60">“{p.problem}”</p>
              <p className="mb-5 flex-1 text-[13.5px] leading-[1.68] text-foreground/82">{p.solution}</p>
              <div className="border-t border-foreground/10 pt-4">
                <div className="mb-1 text-[10px] uppercase tracking-[0.22em] text-foreground/52">Risultato medio</div>
                <div className="landing-heading-gradient font-heading text-lg font-extrabold">{p.metric}</div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
