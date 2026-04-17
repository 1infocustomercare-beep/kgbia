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
    solution: "Gli agenti AI gestiscono prenotazioni, recensioni, follow-up, fatture. Un dipendente in meno, output 3×.",
    metric: "−€2.400/mese in payroll",
    tone: "gold",
  },
  {
    Icon: TrendingDown,
    title: "Clienti che non tornano",
    problem: "Nessuno fa retargeting, niente promemoria, recensioni dimenticate.",
    solution: "Sequenze WhatsApp automatiche, loyalty integrata, recall intelligente sugli inattivi. Il cliente torna da solo.",
    metric: "+42% clienti ricorrenti",
    tone: "blue",
  },
  {
    Icon: FileX,
    title: "Burocrazia che ruba il weekend",
    problem: "Fatture, scadenze fiscali, report, planning. Ore sottratte alla famiglia.",
    solution: "Fatturazione elettronica automatica, dashboard real-time, alert proattivi. Tu firmi, l'AI fa il resto.",
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
    problem: "Loro hanno sito moderno, prenotazioni online, presenza social. Tu rincorri.",
    solution: "Sito premium, agenti vocali, automazioni multi-canale. In 14 giorni sei tu il riferimento del settore.",
    metric: "Live in 14 giorni",
    tone: "gold",
  },
];

export default function GuaranteeSection() {
  return (
    <section className="landing-section relative overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12" data-theme="dark">
...
          className="mx-auto mb-8 max-w-[820px] text-center"
...
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
...
               className="landing-surface flex flex-col rounded-[26px] p-5 lg:p-6"
...
               <p className="mb-4 text-[13px] italic leading-[1.65] text-foreground/60">"{p.problem}"</p>
               <p className="mb-5 flex-1 text-[13.5px] leading-[1.68] text-foreground/82">{p.solution}</p>
               <div className="border-t border-foreground/10 pt-4">
                 <div className="mb-1 text-[10px] uppercase tracking-[0.22em] text-foreground/52">Risultato medio</div>
                <div className="font-heading text-lg font-extrabold landing-heading-gradient">{p.metric}</div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
