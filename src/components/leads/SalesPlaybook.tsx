import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, BookOpen, Target, Search, Sparkles, MessageCircle, Phone, TrendingUp,
  CheckCircle2, ChevronRight, ChevronLeft, Crown, Zap, Trophy, Flame,
  PlayCircle, Award, Brain, Rocket, Shield, DollarSign, MapPin, Filter,
  Layers, Send, Eye, MousePointerClick, ArrowRight, Lightbulb, Copy, Check
} from "lucide-react";

const STORAGE_KEY = "empire-sales-playbook-seen-v3";

interface PlaybookSection {
  id: string;
  icon: any;
  title: string;
  short: string;
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
      id: "start",
      icon: Rocket,
      title: "Inizia Qui",
      short: "Panoramica 60 secondi",
      color: "#fbbf24",
      content: (
        <div className="space-y-5">
          <Hero
            title="Benvenuto nel LeadEngine Empire"
            text="Questo è il tuo strumento di caccia. In 4 passi trovi un'attività, generi una demo personalizzata, mandi un messaggio AI e chiudi."
          />

          <Flow
            steps={[
              { n: 1, icon: Search, label: "Cerca", text: "Trovi attività con problemi digitali (lead caldi)" },
              { n: 2, icon: Brain, label: "Analizza", text: "L'AI calcola Score 0-100 e Pain Point veri" },
              { n: 3, icon: PlayCircle, label: "Demo", text: "Generi sito demo col vero nome del cliente" },
              { n: 4, icon: Send, label: "Chiudi", text: "Invii messaggio personalizzato → firma" },
            ]}
          />

          <Tip text="Ogni sezione di questa guida spiega DOVE CLICCARE nell'app. Apri il pannello, prova subito quello che leggi." />
        </div>
      ),
    },
    {
      id: "search",
      icon: Search,
      title: "1. Cercare Lead",
      short: "5 modalità di ricerca",
      color: "#8b5cf6",
      content: (
        <div className="space-y-5">
          <Hero
            title="Trova attività con problemi reali"
            text="Hai 5 modalità di ricerca. Usa quella giusta in base al contesto. Più dati metti, migliori sono i risultati."
            color="#8b5cf6"
          />

          <ModeCard
            color="#8b5cf6"
            icon={MapPin}
            name="Zona/Città"
            when="Quando vuoi conquistare una zona geografica"
            how="Inserisci città + settore. L'AI trova decine di attività con sito vecchio o senza presenza online."
            tip="Inizia da città medie (50-200k abitanti): meno concorrenza, più fame digitale."
          />
          <ModeCard
            color="#06b6d4"
            icon={Target}
            name="Attività Specifica"
            when="Hai già in mente un nome (cliente caldo segnalato)"
            how="Scrivi nome + città. Sistema fa enrichment con dati Google Maps reali."
            tip="Perfetto per referral o passaparola: arrivi preparato in 30 secondi."
          />
          <ModeCard
            color="#ec4899"
            icon={Filter}
            name="Modalità Manuale PRO"
            when="Conosci già il lead, hai sito/IG/telefono"
            how="Inserisci tutti i dati che hai → sistema calcola Score live e arricchisce con OpenStreetMap."
            tip="Lo Score Live ti dice subito se vale la pena chiamare. Score >75 = chiama oggi."
          />
          <ModeCard
            color="#10b981"
            icon={Layers}
            name="Per Settore"
            when="Vuoi specializzarti in una nicchia"
            how="Scegli settore → l'AI trova le attività più scalabili in quel verticale."
            tip="Specializzati: parlare lo slang del settore raddoppia la conversione."
          />
          <ModeCard
            color="#f59e0b"
            icon={TrendingUp}
            name="Trending"
            when="Vuoi i lead più caldi del momento"
            how="L'AI mostra attività con appena recensioni negative o picchi di ricerca."
            tip="Recensioni negative recenti = titolare frustrato = pronto a cambiare."
          />
        </div>
      ),
    },
    {
      id: "score",
      icon: Brain,
      title: "2. Leggere lo Score",
      short: "Capire i numeri AI",
      color: "#06b6d4",
      content: (
        <div className="space-y-5">
          <Hero
            title="Lo Score AI è il tuo termometro"
            text="È un numero da 0 a 100. Calcolato sui dati REALI: sito mancante, social spenti, recensioni basse, prenotazioni assenti."
            color="#06b6d4"
          />

          <ScoreRow color="#ef4444" range="80-100" label="🔥 BOLLENTE" action="Contatta entro 24h. Telefonata diretta." />
          <ScoreRow color="#f59e0b" range="60-79" label="🌶️ CALDO" action="Manda demo + WhatsApp entro 48h." />
          <ScoreRow color="#06b6d4" range="40-59" label="💧 TIEPIDO" action="Nurturing: messaggio leggero, aspetta segnale." />
          <ScoreRow color="#6b7280" range="0-39" label="❄️ FREDDO" action="Scarta o salva per follow-up futuro." />

          <Hero
            title="Apri il Deep Intel 🔍"
            text="Tocca la card del lead → si apre il pannello completo: sito attuale, recensioni Google, profili social, pain point quantificati in €/mese persi. Sono le tue armi in trattativa."
            color="#06b6d4"
          />

          <Tip text="Quando parli col cliente cita SEMPRE numeri reali del Deep Intel. 'Ho visto le tue 47 recensioni' colpisce 10x più di 'ho visto la tua attività'." />
        </div>
      ),
    },
    {
      id: "demo",
      icon: PlayCircle,
      title: "3. Generare la Demo",
      short: "L'arma di chiusura",
      color: "#ec4899",
      content: (
        <div className="space-y-5">
          <Hero
            title="La demo personalizzata chiude da sola"
            text="Il cliente vede LA SUA attività dentro il sistema Empire, non un esempio. Visualizza il futuro = decisione emotiva = sì."
            color="#ec4899"
          />

          <BigStep
            n="1"
            title="Apri la card del lead"
            text="Clicca sulla card. Trovi il pulsante grande 'Genera Demo' in alto."
            icon={MousePointerClick}
            color="#ec4899"
          />
          <BigStep
            n="2"
            title="Sistema crea sito + admin reali"
            text="Con il vero nome dell'attività, settore corretto, contenuti estratti dal web. Ci mette 15-30 secondi."
            icon={Sparkles}
            color="#ec4899"
          />
          <BigStep
            n="3"
            title="Apri il link su iPhone davanti al cliente"
            text="L'effetto WOW su mobile è 10x rispetto al desktop. Mostralo di persona o in videocall."
            icon={Eye}
            color="#ec4899"
          />
          <BigStep
            n="4"
            title="Galleria Preview Manuale 🎨"
            text="Pulsante 'Galleria' nell'header preview: scegli tra 577+ mockup professionali (COTE, Sakura Atelier, Amalfi…) e allegali al messaggio AI con un click."
            icon={Layers}
            color="#ec4899"
          />

          <Tip text='Frase magica: "Te lo lascio aperto per 24h. Domani lo spengo. Se ti piace lo attiviamo definitivo." Crea urgenza vera.' />
        </div>
      ),
    },
    {
      id: "messages",
      icon: MessageCircle,
      title: "4. Messaggi che Chiudono",
      short: "Script copia-incolla",
      color: "#10b981",
      content: (
        <div className="space-y-5">
          <Hero
            title="L'AI scrive per te, ma sai dove cliccare"
            text="Nel pannello lead trovi il box 'Messaggio AI'. Copia, personalizza il nome, manda su WhatsApp. Tocca 'Copia' per copia-incolla istantaneo."
            color="#10b981"
          />

          <ScriptCard
            label="🎯 Primo contatto WhatsApp"
            text="Ciao [Nome], ho visto [Attività] su Google. Complimenti per le [N] recensioni a 4.8★! Ho notato che il sito è da aggiornare e non hai prenotazioni online: stai perdendo €X/mese in clienti che non riescono a contattarti la sera. Ti ho preparato una demo del nuovo sito (omaggio, 2 minuti per vederla): [link]. Cosa ne pensi?"
          />
          <ScriptCard
            label="🔁 Follow-up dopo 48h (no risposta)"
            text="[Nome] ti ho scritto martedì per la demo del sito di [Attività]. So che sei impegnato. Ti chiedo solo 30 secondi: clicca qui [link] e dimmi sì/no. Se non ti interessa, sparisco e non ti scrivo più. Promesso. 🤝"
          />
          <ScriptCard
            label="💰 Obiezione 'costa troppo'"
            text="Capisco. Facciamo 2 conti veloci: il sistema costa €X/mese. Solo 2 prenotazioni in più al giorno lo ripagano 4 volte. Ti faccio vedere il calcolo? In più ho un'offerta solo per oggi: 90 giorni senza impegno di prova. Zero rischi. Partiamo?"
          />
          <ScriptCard
            label="👑 Closing finale"
            text="[Nome] tre cose: 1) Il tuo concorrente [Competitor] ha già un sistema simile. 2) Ho 3 slot questa settimana per [Città]. 3) Se firmiamo oggi, primo mese omaggio + setup omaggio. Ti mando il link di pagamento ora o domani mattina?"
          />
        </div>
      ),
    },
    {
      id: "objections",
      icon: Shield,
      title: "5. Distruggi le Obiezioni",
      short: "Risposte testate",
      color: "#f59e0b",
      content: (
        <div className="space-y-4">
          <Hero
            title="Ogni 'no' è un 'non ho capito il valore'"
            text="Memorizza queste risposte. Funzionano nel 90% dei casi reali."
            color="#f59e0b"
          />
          <ObjectionCard obj='"Devo pensarci"' answer="Cosa esattamente vuoi pensare? Il prezzo, le funzionalità, o se ti serve davvero? Ne parliamo subito così risolviamo." />
          <ObjectionCard obj='"Costa troppo"' answer="Rispetto a cosa? Calcoliamo il ritorno: con 2 prenotazioni in più al mese hai già recuperato l'investimento. Quanti clienti perdi oggi senza booking online?" />
          <ObjectionCard obj='"Ho già un sito"' answer="Perfetto, hai capito l'importanza di esserci online. Ma il tuo sito ti porta clienti automatici 24/7 con AI? Ti faccio vedere la differenza in 60 secondi." />
          <ObjectionCard obj='"Devo parlare col socio"' answer="Ottima idea. Quando lo senti? Organizziamo una call insieme domani: in 15 minuti vedete tutto e decidete." />
          <ObjectionCard obj='"Non mi serve, ho già clienti"' answer="Fantastico! Quindi il problema non è acquisire ma gestire. Il sistema ti libera 15h/settimana eliminando telefonate e gestione manuale. Quanto vale il tuo tempo?" />
          <ObjectionCard obj='"Provo da solo con WordPress"' answer="Ci sta. Ma sai quanto ci vuole per fare quello che vedi nella demo? 6 mesi e €5k a uno sviluppatore. Noi lo abbiamo già pronto e ti costa il 90% in meno." />
        </div>
      ),
    },
    {
      id: "closing",
      icon: Trophy,
      title: "6. Chiusura in 7 Giorni",
      short: "Sequenza step-by-step",
      color: "#fbbf24",
      content: (
        <div className="space-y-4">
          <Hero
            title="Una mossa al giorno. Mai improvvisare."
            text="Ogni giorno fai questa azione precisa. Tasso di conversione medio Empire: 1 chiusura ogni 4 demo inviate."
            color="#fbbf24"
          />
          <DayCard day="Giorno 1" action="Primo contatto + invio demo personalizzata via WhatsApp" />
          <DayCard day="Giorno 2" action="Follow-up: 'Hai aperto la demo? Cosa ne pensi?'" />
          <DayCard day="Giorno 3" action="Call telefonica 10 min: 3 funzionalità chiave + ROI" />
          <DayCard day="Giorno 4" action="Invio video Loom personalizzato col tour del backend" />
          <DayCard day="Giorno 5" action="Offerta scarsità: 'Solo oggi, primo mese omaggio + setup omaggio'" />
          <DayCard day="Giorno 6" action="Call con titolare/socio se richiesto + invio contratto" />
          <DayCard day="Giorno 7" action="Closing: link Stripe, attivazione, primo onboarding" />
        </div>
      ),
    },
    {
      id: "kpi",
      icon: TrendingUp,
      title: "7. I tuoi KPI",
      short: "Numeri che fanno fatturato",
      color: "#06b6d4",
      content: (
        <div className="space-y-4">
          <Hero
            title="Vendere è matematica, non magia"
            text="Rispetta questi numeri ogni settimana e il fatturato arriva da solo."
            color="#06b6d4"
          />
          <KPICard label="Lead contattati/giorno" target="20+" why="Più contatti = più chiusure. Pura matematica." />
          <KPICard label="Demo generate/settimana" target="10+" why="Ogni demo = 25% probabilità di chiusura entro 14gg." />
          <KPICard label="Call telefoniche/settimana" target="15+" why="La voce chiude 3x più del testo. Sempre." />
          <KPICard label="Chiusure/mese" target="8-15" why="Con €1.997 ticket medio = €15k-30k commissioni mensili." />
          <KPICard label="Follow-up entro 24h" target="100%" why="Lead non risposto in 24h = lead perso. Always be following up." />
        </div>
      ),
    },
  ];

  const goNext = () => active < sections.length - 1 ? setActive(a => a + 1) : close();
  const goPrev = () => setActive(a => Math.max(0, a - 1));

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
          <div className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 border-2 border-black text-[8px] font-black text-white">GUIDA</div>
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
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-x-0 top-0 bottom-0 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:top-6 lg:bottom-6 lg:w-[920px] z-50 lg:rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
              style={{ background: "linear-gradient(160deg, #0a0a14 0%, #0f0a1f 50%, #1a0a14 100%)" }}
            >
              {/* Header */}
              <div className="relative px-4 lg:px-5 py-4 border-b border-white/[0.08] flex items-center justify-between shrink-0"
                style={{ background: "linear-gradient(90deg, rgba(251,191,36,0.12), rgba(236,72,153,0.08))" }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shrink-0">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base lg:text-lg font-black text-white tracking-tight truncate">Sales Playbook Empire</h2>
                    <p className="text-[11px] lg:text-xs text-white/70 truncate">Step {active + 1} di {sections.length} · {sections[active].title}</p>
                  </div>
                </div>
                <button onClick={close} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Horizontal tabs scroll — visible on ALL screens */}
              <div className="border-b border-white/[0.06] overflow-x-auto scrollbar-hide shrink-0" style={{ background: "rgba(0,0,0,0.4)" }}>
                <div className="flex gap-1 p-2 min-w-max">
                  {sections.map((s, i) => {
                    const Icon = s.icon;
                    const isActive = active === i;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setActive(i)}
                        className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
                          isActive ? "bg-white/[0.12]" : "hover:bg-white/[0.05]"
                        }`}
                        style={isActive ? { boxShadow: `inset 0 -2px 0 ${s.color}` } : {}}
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: `${s.color}25`, color: s.color }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className={`text-xs font-bold whitespace-nowrap ${isActive ? "text-white" : "text-white/60"}`}>
                          {s.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
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
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
                        style={{ background: `linear-gradient(135deg, ${sections[active].color}40, ${sections[active].color}20)`, border: `1px solid ${sections[active].color}50` }}
                      >
                        {(() => { const Ic = sections[active].icon; return <Ic className="w-6 h-6" style={{ color: sections[active].color }} />; })()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-black text-white leading-tight">{sections[active].title}</h3>
                        <p className="text-sm text-white/60">{sections[active].short}</p>
                      </div>
                    </div>
                    {sections[active].content}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer nav */}
              <div className="px-4 py-3 border-t border-white/[0.08] flex items-center justify-between shrink-0"
                style={{ background: "rgba(0,0,0,0.5)" }}>
                <button
                  onClick={goPrev}
                  disabled={active === 0}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 flex items-center gap-1.5 text-white/80 disabled:opacity-30 transition text-sm font-semibold"
                >
                  <ChevronLeft className="w-4 h-4" /> Indietro
                </button>

                <div className="flex items-center gap-1 lg:gap-1.5">
                  {sections.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`h-2 rounded-full transition-all ${i === active ? "w-7 bg-amber-400" : "w-2 bg-white/20 hover:bg-white/40"}`}
                    />
                  ))}
                </div>

                {active < sections.length - 1 ? (
                  <button
                    onClick={goNext}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold flex items-center gap-1.5 shadow-lg hover:shadow-xl transition"
                  >
                    Avanti <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={close}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-bold flex items-center gap-1.5 shadow-lg hover:shadow-xl transition"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Inizia
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ===== Subcomponents — high contrast, larger fonts ===== */

function Hero({ title, text, color = "#fbbf24" }: { title: string; text: string; color?: string }) {
  return (
    <div
      className="p-4 rounded-2xl border"
      style={{ background: `linear-gradient(135deg, ${color}15, ${color}05)`, borderColor: `${color}40` }}
    >
      <p className="text-base font-black text-white mb-1.5">{title}</p>
      <p className="text-sm text-white/85 leading-relaxed">{text}</p>
    </div>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
      <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
      <p className="text-sm text-amber-100 leading-relaxed font-medium">{text}</p>
    </div>
  );
}

function Flow({ steps }: { steps: { n: number; icon: any; label: string; text: string }[] }) {
  return (
    <div className="space-y-2">
      {steps.map((s, i) => {
        const Ic = s.icon;
        return (
          <div key={s.n} className="flex items-center gap-3">
            <div className="flex flex-col items-center shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-sm font-black text-white shadow-lg">
                {s.n}
              </div>
              {i < steps.length - 1 && <div className="w-0.5 h-4 bg-white/20 mt-1" />}
            </div>
            <div className="flex-1 p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-1">
                <Ic className="w-4 h-4 text-amber-400" />
                <p className="text-sm font-bold text-white">{s.label}</p>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">{s.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ModeCard({ color, icon: Icon, name, when, how, tip }: { color: string; icon: any; name: string; when: string; how: string; tip: string }) {
  return (
    <div className="p-4 rounded-2xl border" style={{ background: `${color}08`, borderColor: `${color}30` }}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}25`, color }}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        <p className="text-base font-black text-white">{name}</p>
      </div>
      <div className="space-y-2 text-sm">
        <Line label="QUANDO" text={when} color={color} />
        <Line label="COME" text={how} color={color} />
        <div className="flex items-start gap-2 pt-1">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-amber-100/90 italic leading-relaxed text-[13px]">{tip}</p>
        </div>
      </div>
    </div>
  );
}

function Line({ label, text, color }: { label: string; text: string; color: string }) {
  return (
    <div>
      <p className="text-[10px] font-black tracking-widest mb-0.5" style={{ color }}>{label}</p>
      <p className="text-white/85 leading-relaxed">{text}</p>
    </div>
  );
}

function BigStep({ n, title, text, icon: Icon, color }: { n: string; title: string; text: string; icon: any; color: string }) {
  return (
    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-black text-white text-lg shadow-lg"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}80)` }}>
          {n}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Icon className="w-4 h-4" style={{ color }} />
            <p className="text-base font-bold text-white">{title}</p>
          </div>
          <p className="text-sm text-white/80 leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}

function ScoreRow({ color, range, label, action }: { color: string; range: string; label: string; action: string }) {
  return (
    <div className="p-3 rounded-2xl flex items-center gap-3 border" style={{ background: `${color}10`, borderColor: `${color}30` }}>
      <div className="px-3 py-2 rounded-xl font-black text-white shrink-0 min-w-[70px] text-center" style={{ background: color }}>
        <p className="text-sm leading-none">{range}</p>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-white">{label}</p>
        <p className="text-xs text-white/75 leading-relaxed mt-0.5">{action}</p>
      </div>
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
    <div className="p-4 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/30">
      <div className="flex items-center justify-between mb-2.5 gap-2">
        <p className="text-sm font-black text-emerald-300">{label}</p>
        <button onClick={copy} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/25 text-emerald-100 hover:bg-emerald-500/40 transition font-bold flex items-center gap-1.5 shrink-0">
          {copied ? <><Check className="w-3.5 h-3.5" /> Copiato</> : <><Copy className="w-3.5 h-3.5" /> Copia</>}
        </button>
      </div>
      <p className="text-sm text-white/85 leading-relaxed italic">"{text}"</p>
    </div>
  );
}

function ObjectionCard({ obj, answer }: { obj: string; answer: string }) {
  return (
    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
      <p className="text-sm font-bold text-amber-300 mb-2">❌ {obj}</p>
      <p className="text-sm text-white/85 leading-relaxed pl-3 border-l-2 border-emerald-400/60">
        ✅ {answer}
      </p>
    </div>
  );
}

function DayCard({ day, action }: { day: string; action: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
      <div className="px-3 py-1.5 rounded-lg bg-yellow-500/25 text-yellow-200 text-xs font-black shrink-0">{day}</div>
      <p className="text-sm text-white/85 leading-relaxed pt-0.5">{action}</p>
    </div>
  );
}

function KPICard({ label, target, why }: { label: string; target: string; why: string }) {
  return (
    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-xs text-white/65 leading-relaxed mt-1">{why}</p>
      </div>
      <div className="px-4 py-2.5 rounded-xl bg-gradient-to-br from-cyan-500/25 to-blue-500/20 border border-cyan-500/40 shrink-0">
        <p className="text-lg font-black text-cyan-200">{target}</p>
      </div>
    </div>
  );
}
