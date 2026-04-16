import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, BookOpen, Target, Search, Sparkles, MessageCircle, Phone, TrendingUp,
  CheckCircle2, ChevronRight, ChevronLeft, Crown, Zap, Trophy, Flame,
  PlayCircle, Award, Brain, Rocket, Shield, DollarSign
} from "lucide-react";

const STORAGE_KEY = "empire-sales-playbook-seen";

interface PlaybookSection {
  id: string;
  icon: any;
  title: string;
  subtitle: string;
  color: string;
  content: React.ReactNode;
}

export default function SalesPlaybook({ autoOpen = false }: { autoOpen?: boolean }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (autoOpen) {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) {
        const t = setTimeout(() => setOpen(true), 800);
        return () => clearTimeout(t);
      }
    }
  }, [autoOpen]);

  const close = () => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  const sections: PlaybookSection[] = [
    {
      id: "mindset",
      icon: Flame,
      title: "Mindset del Closer",
      subtitle: "La mentalità che chiude",
      color: "#ff6b35",
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20">
            <p className="text-orange-300 font-bold text-sm mb-2">⚡ La regola d'oro Empire</p>
            <p className="text-white/80 text-sm leading-relaxed">
              Non vendi software. <span className="text-white font-bold">Vendi tempo, denaro e libertà.</span> Ogni cliente che firma libera 15+ ore/settimana e genera +30% di fatturato. Tu non sei un venditore: <span className="text-orange-300">sei la sua nuova vita.</span>
            </p>
          </div>
          <div className="space-y-2">
            <RuleItem n="1" text="Mai accettare 'ci penso'. Vuol dire 'non ho capito il valore'. Riparti dal pain point." />
            <RuleItem n="2" text="Ogni 'no' = +1 step verso il prossimo 'sì'. La media è 1 chiusura ogni 8 contatti scientifici." />
            <RuleItem n="3" text="Non spiegare il prodotto. Mostra il loro sito attuale vs la demo Empire. Lo schiaffo visivo chiude." />
            <RuleItem n="4" text="Crea urgenza vera: 'Ho 3 slot disponibili questa settimana per la tua zona'." />
            <RuleItem n="5" text="Chiudi sempre con domanda alternativa: 'Partiamo lunedì o mercoledì?'" />
          </div>
        </div>
      ),
    },
    {
      id: "search",
      icon: Search,
      title: "Trovare i Lead Giusti",
      subtitle: "Caccia chirurgica con AI",
      color: "#8b5cf6",
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <p className="text-purple-300 font-bold text-sm mb-2">🎯 Strategia di scouting</p>
            <p className="text-white/70 text-xs leading-relaxed">
              Usa la <span className="text-white font-semibold">Ricerca Automatica</span> per trovare attività con basso digital score (= alta urgenza). Per lead caldi conosciuti, usa la <span className="text-white font-semibold">Modalità Manuale</span> per analisi mirata.
            </p>
          </div>
          <StepCard num="1" title="Filtra per zona + settore" text="Scegli città + settore. L'AI trova attività con sito obsoleto, no booking, no e-commerce: pain point garantiti." />
          <StepCard num="2" title="Leggi il Score AI" text="Score 80+ = lead bollente, contatta entro 24h. Score 60-80 = caldo, nurturing settimanale. Sotto 60 = scartare." />
          <StepCard num="3" title="Analizza il Deep Intel" text="Apri il pannello: vedi sito attuale, recensioni, pain point con €/mese persi. Sono i tuoi proiettili in trattativa." />
          <StepCard num="4" title="Salva nella Pipeline" text="Sposta nella colonna giusta (Nuovo → Contattato → Demo → Chiuso). Mai perdere un lead caldo." />
        </div>
      ),
    },
    {
      id: "demo",
      icon: PlayCircle,
      title: "Generare Demo Killer",
      subtitle: "L'arma di chiusura",
      color: "#ec4899",
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-pink-500/5 border border-pink-500/20">
            <p className="text-pink-300 font-bold text-sm mb-2">💥 Perché le demo chiudono</p>
            <p className="text-white/70 text-xs leading-relaxed">
              Il cliente vede <span className="text-white font-semibold">la SUA attività</span> con il nostro sistema, non un esempio generico. Visualizza il futuro = decisione emotiva = chiusura.
            </p>
          </div>
          <StepCard num="1" title="Apri il lead → 'Genera Demo'" text="Sistema crea sito + admin con il vero nome dell'attività, settore corretto, contenuti reali estratti dal web." />
          <StepCard num="2" title="Mostra preview mobile" text="Apri il link su iPhone davanti al cliente. L'effetto WOW è 10x rispetto al desktop." />
          <StepCard num="3" title="Naviga le funzionalità" text="Mostra: prenotazioni online, AI menu, recensioni automatiche, WhatsApp business. 1 funzione = 1 problema risolto." />
          <StepCard num="4" title="Lascia il link 24h" text="'Te lo lascio per oggi. Domani lo spengo. Se ti piace, lunedì firmiamo e diventa tuo per sempre.'" />
        </div>
      ),
    },
    {
      id: "messages",
      icon: MessageCircle,
      title: "Messaggi che Convertono",
      subtitle: "Script testati sul campo",
      color: "#10b981",
      content: (
        <div className="space-y-3">
          <ScriptCard
            label="Primo contatto WhatsApp"
            text="Ciao [Nome], ho visto [Attività] su Google. Complimenti per le [N] recensioni a 4.8★! Ho notato che il sito è da aggiornare e non hai prenotazioni online: stai perdendo €X/mese in clienti che non riescono a contattarti la sera. Ti ho preparato una demo del nuovo sito (gratis, 2 minuti per vederla): [link]. Cosa ne pensi?"
          />
          <ScriptCard
            label="Follow-up dopo 48h (no risposta)"
            text="[Nome] ti ho scritto martedì per la demo del sito di [Attività]. So che sei impegnato. Ti chiedo solo 30 secondi: clicca qui [link] e dimmi sì/no. Se non ti interessa, sparisco e non ti scrivo più. Promesso. 🤝"
          />
          <ScriptCard
            label="Gestione obiezione 'costa troppo'"
            text="Capisco. Facciamo 2 conti veloci: il sistema costa €X/mese. Solo le 2 prenotazioni in più al giorno che ti porta lo ripagano 4 volte. Ti faccio vedere il calcolo? In più ho un'offerta solo per oggi: 90 giorni gratis di prova. Zero rischi. Partiamo?"
          />
          <ScriptCard
            label="Chiusura: il colpo finale"
            text="[Nome] tre cose: 1) Il tuo concorrente [Competitor] ha già un sistema simile. 2) Ho 3 slot questa settimana per [Città]. 3) Se firmiamo oggi, primo mese gratis + setup gratuito. Ti mando il link di pagamento ora o domani mattina?"
          />
        </div>
      ),
    },
    {
      id: "objections",
      icon: Shield,
      title: "Distruggere le Obiezioni",
      subtitle: "Risposte testate al millisecondo",
      color: "#f59e0b",
      content: (
        <div className="space-y-3">
          <ObjectionCard obj='"Devo pensarci"' answer="Cosa esattamente vuoi pensare? Il prezzo, le funzionalità, o se ti serve davvero? Ne parliamo subito così risolviamo." />
          <ObjectionCard obj='"Costa troppo"' answer="Rispetto a cosa? Calcoliamo il ritorno: con 2 prenotazioni in più al mese hai già recuperato l'investimento. Quanti clienti perdi oggi senza booking online?" />
          <ObjectionCard obj='"Ho già un sito"' answer="Perfetto, hai capito l'importanza di esserci online. Ma il tuo sito ti porta clienti automatici 24/7 con AI? Ti faccio vedere la differenza in 60 secondi." />
          <ObjectionCard obj='"Devo parlare con il socio"' answer="Ottima idea. Quando lo senti? Organizziamo una call insieme domani: in 15 minuti vedete tutto e decidete." />
          <ObjectionCard obj='"Non mi serve, ho già clienti"' answer="Fantastico! Quindi il problema non è acquisire ma gestire. Il sistema ti libera 15h/settimana eliminando telefonate, prenotazioni manuali e gestione recensioni. Quanto vale il tuo tempo?" />
          <ObjectionCard obj='"Provo da solo con [WordPress/Wix]"' answer="Ci sta. Ma sai quanto ci vuole per fare quello che vedi nella demo? 6 mesi e €5k a uno sviluppatore. Noi lo abbiamo già pronto e ti costa il 90% in meno. Partiamo?" />
        </div>
      ),
    },
    {
      id: "closing",
      icon: Trophy,
      title: "Il Closing Definitivo",
      subtitle: "Da demo a firma in 7 giorni",
      color: "#fbbf24",
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border border-yellow-500/30">
            <p className="text-yellow-300 font-bold text-sm mb-2">👑 Sequenza chiusura 7 giorni</p>
            <p className="text-white/70 text-xs">Ogni giorno una mossa precisa. Mai improvvisare.</p>
          </div>
          <DayCard day="Giorno 1" action="Primo contatto + invio demo personalizzata via WhatsApp" />
          <DayCard day="Giorno 2" action="Follow-up: 'Hai aperto la demo? Cosa ne pensi?'" />
          <DayCard day="Giorno 3" action="Call telefonica 10 min: spiegare 3 funzionalità chiave + ROI" />
          <DayCard day="Giorno 4" action="Invio video personalizzato (loom) con tour del backend" />
          <DayCard day="Giorno 5" action="Offerta scarsità: 'Solo oggi, primo mese gratis + setup omaggio'" />
          <DayCard day="Giorno 6" action="Call con titolare/socio se richiesto + invio contratto" />
          <DayCard day="Giorno 7" action="Closing: link Stripe, attivazione, primo onboarding" />
          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/5 border border-emerald-500/30 mt-3">
            <p className="text-emerald-300 text-xs font-bold flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5" />
              Tasso di conversione medio Empire: 1 chiusura ogni 4 demo inviate
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "kpi",
      icon: TrendingUp,
      title: "I tuoi KPI di Crescita",
      subtitle: "Numeri che fanno fatturato",
      color: "#06b6d4",
      content: (
        <div className="space-y-3">
          <KPICard label="Lead contattati/giorno" target="20+" why="Più contatti = più chiusure. Matematica pura." />
          <KPICard label="Demo generate/settimana" target="10+" why="Ogni demo = 25% probabilità di chiusura entro 14gg." />
          <KPICard label="Call telefoniche/settimana" target="15+" why="La voce chiude 3x più del testo. Sempre." />
          <KPICard label="Chiusure/mese" target="8-15" why="Con €1.997 ticket medio = €15k-30k commissioni mensili." />
          <KPICard label="Follow-up entro 24h" target="100%" why="Lead non risposto in 24h = lead perso. Always be following up." />
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/30 mt-3">
            <p className="text-cyan-300 font-bold text-sm mb-2 flex items-center gap-2">
              <Rocket className="w-4 h-4" /> La regola di Pareto Empire
            </p>
            <p className="text-white/70 text-xs leading-relaxed">
              Il 20% dei tuoi lead farà l'80% del fatturato. <span className="text-white font-semibold">Identificali con il Score AI 80+</span> e dedicagli il 60% del tuo tempo. Il resto = automazioni.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-40 group"
        aria-label="Apri Sales Playbook"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 blur-lg opacity-60 group-hover:opacity-100 animate-pulse" />
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl border-2 border-white/20 group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-black" />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-x-2 top-4 bottom-4 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:top-8 lg:bottom-8 lg:w-[920px] z-50 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
              style={{ background: "linear-gradient(160deg, #0a0a14 0%, #0f0a1f 50%, #1a0a14 100%)" }}
            >
              {/* Header */}
              <div className="relative px-5 py-4 border-b border-white/[0.08] flex items-center justify-between"
                style={{ background: "linear-gradient(90deg, rgba(251,191,36,0.08), rgba(236,72,153,0.06))" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base lg:text-lg font-black text-white tracking-tight">Sales Playbook Empire</h2>
                    <p className="text-[0.65rem] lg:text-xs text-white/50">La guida che ti fa chiudere più clienti</p>
                  </div>
                </div>
                <button onClick={close} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body: tabs + content */}
              <div className="flex-1 flex overflow-hidden">
                {/* Sidebar tabs */}
                <div className="w-[140px] lg:w-[200px] border-r border-white/[0.06] overflow-y-auto p-2 space-y-1 shrink-0"
                  style={{ background: "rgba(0,0,0,0.3)" }}>
                  {sections.map((s, i) => {
                    const Icon = s.icon;
                    const isActive = active === i;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setActive(i)}
                        className={`w-full text-left p-2 lg:p-2.5 rounded-xl transition-all flex items-start gap-2 ${
                          isActive ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"
                        }`}
                        style={isActive ? { boxShadow: `inset 3px 0 0 ${s.color}` } : {}}
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: `${s.color}20`, color: s.color }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 hidden lg:block">
                          <p className={`text-[0.7rem] font-bold truncate ${isActive ? "text-white" : "text-white/70"}`}>
                            {s.title}
                          </p>
                          <p className="text-[0.6rem] text-white/40 truncate">{s.subtitle}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={sections[active].id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                          style={{ background: `linear-gradient(135deg, ${sections[active].color}40, ${sections[active].color}20)`, border: `1px solid ${sections[active].color}40` }}
                        >
                          {(() => { const Ic = sections[active].icon; return <Ic className="w-5 h-5" style={{ color: sections[active].color }} />; })()}
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-white">{sections[active].title}</h3>
                          <p className="text-xs text-white/50">{sections[active].subtitle}</p>
                        </div>
                      </div>
                      {sections[active].content}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer nav */}
              <div className="px-4 py-3 border-t border-white/[0.06] flex items-center justify-between"
                style={{ background: "rgba(0,0,0,0.4)" }}>
                <div className="flex items-center gap-1.5">
                  {sections.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${i === active ? "w-6 bg-amber-400" : "w-1.5 bg-white/15 hover:bg-white/30"}`}
                      onClick={() => setActive(i)}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActive(a => Math.max(0, a - 1))}
                    disabled={active === 0}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {active < sections.length - 1 ? (
                    <button
                      onClick={() => setActive(a => a + 1)}
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold flex items-center gap-1 shadow-lg"
                    >
                      Avanti <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={close}
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Pronto a chiudere
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* Subcomponents */
function RuleItem({ n, text }: { n: string; text: string }) {
  return (
    <div className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-[0.65rem] font-black text-white shrink-0">
        {n}
      </div>
      <p className="text-xs text-white/70 leading-relaxed">{text}</p>
    </div>
  );
}

function StepCard({ num, title, text }: { num: string; title: string; text: string }) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-300 text-[0.65rem] font-black flex items-center justify-center">{num}</span>
        <p className="text-xs font-bold text-white">{title}</p>
      </div>
      <p className="text-[0.7rem] text-white/55 leading-relaxed pl-7">{text}</p>
    </div>
  );
}

function ScriptCard({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="p-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[0.7rem] font-bold text-emerald-300">{label}</p>
        <button onClick={copy} className="text-[0.6rem] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 transition">
          {copied ? "✓ Copiato" : "Copia"}
        </button>
      </div>
      <p className="text-[0.7rem] text-white/70 leading-relaxed italic">"{text}"</p>
    </div>
  );
}

function ObjectionCard({ obj, answer }: { obj: string; answer: string }) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
      <p className="text-[0.7rem] font-bold text-amber-300 mb-1.5">❌ {obj}</p>
      <p className="text-[0.7rem] text-white/65 leading-relaxed pl-3 border-l-2 border-emerald-500/40">
        ✅ {answer}
      </p>
    </div>
  );
}

function DayCard({ day, action }: { day: string; action: string }) {
  return (
    <div className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
      <div className="px-2 py-1 rounded-md bg-yellow-500/20 text-yellow-300 text-[0.6rem] font-black shrink-0">{day}</div>
      <p className="text-xs text-white/70 leading-relaxed pt-0.5">{action}</p>
    </div>
  );
}

function KPICard({ label, target, why }: { label: string; target: string; why: string }) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-white truncate">{label}</p>
        <p className="text-[0.65rem] text-white/45 leading-relaxed mt-0.5">{why}</p>
      </div>
      <div className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shrink-0">
        <p className="text-sm font-black text-cyan-300">{target}</p>
      </div>
    </div>
  );
}
