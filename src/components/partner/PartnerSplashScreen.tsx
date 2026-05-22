import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { Crown, Rocket, Flame, Zap, Star, Trophy, Sparkles, TrendingUp, Target, Shield, Pause, Play, Swords, Diamond, Brain, Eye, Compass, Anchor, Mountain, Hourglass, Gem, Award } from "lucide-react";
import UnifiedIntro from "@/components/UnifiedIntro";

/* ═══ HIGH-IMPACT MINDSET LIBRARY — 40 frasi da closer professionista ═══ */
const MINDSET_LIBRARY = [
  // — Urgenza & Velocità —
  { text: "Mentre dormi, qualcuno sta firmando il contratto che doveva essere tuo. Svegliati prima. Chiama prima. Chiudi prima.", icon: Flame, accent: "#ef4444", category: "Urgenza Brutale" },
  { text: "Il cliente che oggi ti dice NO sta cercando il TUO competitor. Hai 24 ore per richiamarlo prima che firmi con qualcun altro.", icon: Target, accent: "#ef4444", category: "Velocità" },
  { text: "La velocità di esecuzione è il nuovo IQ. Non quello che sai, ma quanto in fretta lo trasformi in fatturato.", icon: Zap, accent: "#f59e0b", category: "Esecuzione" },
  { text: "Il primo venditore che chiama vince il 78% delle volte. Non il migliore. Il primo. Imposta l'allarme alle 7:30.", icon: Hourglass, accent: "#ef4444", category: "First-Mover" },

  // — Resilienza & Mental Game —
  { text: "Il 97% si arrende dopo 4 NO. Il 3% che diventa ricco continua fino al 12°. Quanti ne hai presi oggi? Non bastano.", icon: Swords, accent: "#a78bfa", category: "Resilienza Estrema" },
  { text: "Il NO di un cliente non parla di te — parla di lui. Non è personale, è statistica. Ogni 10 NO ti avvicinano matematicamente al SÌ da €997.", icon: Shield, accent: "#a78bfa", category: "Mental Game" },
  { text: "Il rifiuto è il pedaggio per entrare nel club dei top earner. Pagalo in silenzio e continua a guidare.", icon: Mountain, accent: "#a78bfa", category: "Pedaggio Mentale" },
  { text: "L'unico modo per perdere davvero è smettere di chiamare. Tutto il resto è solo statistica in evoluzione.", icon: Anchor, accent: "#38bdf8", category: "Verità Statistica" },

  // — Mission & Vision —
  { text: "Non stai vendendo software. Stai vendendo libertà. 8 ore al giorno restituite al titolare. Questo non ha prezzo — ha solo un costo: l'inazione.", icon: Sparkles, accent: "#34d399", category: "Mission" },
  { text: "Ogni titolare che firma con te smette di essere schiavo del suo locale. Tu non vendi tecnologia — vendi domeniche libere.", icon: Crown, accent: "#34d399", category: "Vero Valore" },
  { text: "Mentre il tuo amico si lamenta dello stipendio, tu stai costruendo un asset che ti pagherà override per i prossimi 10 anni. Resisti ancora 90 giorni.", icon: Rocket, accent: "#34d399", category: "Visione" },
  { text: "Tra 5 anni guarderai oggi come l'inizio di tutto, oppure come l'ennesima volta che hai mollato. La scelta è in questa settimana.", icon: Compass, accent: "#a78bfa", category: "Long Game" },

  // — Focus & Disciplina —
  { text: "Un Diamond a €18.000/mese non lavora di più. Lavora SOLO sulle conversazioni che contano. Smetti di disperdere energia. Concentra il fuoco.", icon: Diamond, accent: "#38bdf8", category: "Focus Chirurgico" },
  { text: "I dilettanti aspettano l'ispirazione. I professionisti aprono il CRM alle 8:00 e iniziano a chiamare. La disciplina batte il talento — sempre.", icon: Zap, accent: "#a78bfa", category: "Disciplina" },
  { text: "La routine boring di oggi è il bonifico straordinario di tra 6 mesi. Innamorati del processo, non del risultato.", icon: Gem, accent: "#38bdf8", category: "Sistema" },
  { text: "Multi-tasking è la bugia che racconti a te stesso per giustificare la mediocrità. Una chiamata. Una mail. Una vendita alla volta.", icon: Eye, accent: "#38bdf8", category: "Mono-Focus" },

  // — Closer Mentality —
  { text: "Non sei pagato per provare. Sei pagato per CHIUDERE. Ogni 'ci penso' non gestito è denaro che hai regalato alla concorrenza.", icon: Swords, accent: "#f59e0b", category: "Closer Mentality" },
  { text: "Smetti di 'mandare informazioni'. Inizia a CHIUDERE appuntamenti. Le brochure non firmano contratti — le persone sì.", icon: Target, accent: "#f59e0b", category: "Action First" },
  { text: "L'obiezione è un invito mascherato. Quando dice 'è caro' sta chiedendo 'convincimi che vale'. Sei pronto a rispondere?", icon: Brain, accent: "#34d399", category: "Obiezione = Interesse" },
  { text: "Il follow-up è dove si fanno i veri soldi. L'80% delle vendite avviene dopo il 5° contatto. Tu a quale sei fermo?", icon: Hourglass, accent: "#f59e0b", category: "Follow-Up Game" },

  // — Numeri Veri —
  { text: "€997 a vendita. 3 vendite a settimana = €11.964/mese. Non è un sogno — è matematica. L'unica variabile sei TU.", icon: Trophy, accent: "#d4a052", category: "Numeri Veri" },
  { text: "5 contatti al giorno = mediocrità. 30 contatti al giorno = libertà finanziaria entro 18 mesi. La differenza è una scelta, non una capacità.", icon: Flame, accent: "#ef4444", category: "Volume di Attacco" },
  { text: "Il tuo conto in banca è uno specchio del tuo livello di azione. Vuoi cambiare il numero? Cambia le abitudini di OGGI, non di lunedì.", icon: TrendingUp, accent: "#d4a052", category: "Verità Cruda" },
  { text: "Calcola il valore di un'ora del tuo tempo dividendo il tuo obiettivo annuale per 2.000. Ogni minuto sprecato ha un prezzo preciso.", icon: Hourglass, accent: "#d4a052", category: "Time = Money" },

  // — Mentalità Brutale —
  { text: "Ogni minuto che passi a lamentarti è un minuto rubato a chi sta costruendo il suo impero. Lamentarsi è povertà. Vendere è libertà.", icon: Crown, accent: "#d4a052", category: "Mentalità" },
  { text: "Ogni email non inviata, ogni chiamata non fatta, è denaro che hai donato volontariamente alla povertà. Sei tu il tuo unico ostacolo.", icon: Swords, accent: "#d4a052", category: "Brutalità" },
  { text: "I tuoi competitor stanno cenando con la famiglia mentre tu mandi l'ultimo messaggio della giornata. Quel messaggio è il tuo €18.000/mese di domani.", icon: Crown, accent: "#f59e0b", category: "Sacrificio" },
  { text: "La comodità è il cimitero dei sogni. Se oggi non ti senti scomodo almeno 3 volte, stai morendo lentamente.", icon: Flame, accent: "#ef4444", category: "Anti-Comfort" },

  // — Coraggio & Reframe —
  { text: "Non aspettare di essere pronto. I top performer hanno chiuso la prima vendita TREMANDO. L'azione genera la sicurezza, non viceversa.", icon: Star, accent: "#38bdf8", category: "Coraggio" },
  { text: "Smetti di dire 'devo trovare clienti'. Trova invece i PROBLEMI. I clienti sono solo persone con problemi che TU puoi risolvere oggi stesso.", icon: Target, accent: "#34d399", category: "Reframe" },
  { text: "Non esiste 'mercato saturo'. Esistono solo venditori saturi di scuse. In Italia ci sono 4.5 milioni di PMI senza il tuo sistema. Vai a prenderli.", icon: Rocket, accent: "#ef4444", category: "Opportunità" },
  { text: "La paura di chiamare scompare alla terza chiamata. La fame di chiudere arriva alla decima. Inizia ORA.", icon: Flame, accent: "#f59e0b", category: "Momentum" },

  // — Leverage & Sistema —
  { text: "Un Team Leader con 7 venditori attivi guadagna mentre dorme, viaggia, cena fuori. Tu stai ancora scambiando ore per soldi? Costruisci il sistema.", icon: Diamond, accent: "#a78bfa", category: "Leverage" },
  { text: "Reclutare un solo venditore competente vale 100 chiamate fredde. Smetti di vendere da solo — costruisci la macchina.", icon: Award, accent: "#a78bfa", category: "Duplicazione" },
  { text: "Il vero ricco non lavora di più. Possiede sistemi che lavorano per lui mentre dorme. Stai costruendo o stai eseguendo?", icon: Gem, accent: "#38bdf8", category: "Asset Builder" },

  // — Closing Power —
  { text: "Tra 12 mesi sarai grato per il dolore di oggi o sarai ancora a lamentarti delle stesse cose. Decidi ADESSO chi vuoi essere il prossimo dicembre.", icon: Trophy, accent: "#38bdf8", category: "Decision Day" },
  { text: "Il momento per fare la chiamata difficile è SEMPRE adesso. Più aspetti, più diventa difficile. Più diventa difficile, meno la farai.", icon: Hourglass, accent: "#ef4444", category: "Now or Never" },
  { text: "Il tuo prossimo livello richiede una versione di te che ancora non esiste. Smetti di chiedere 'come?'. Inizia a chiedere 'chi devo diventare?'", icon: Crown, accent: "#d4a052", category: "Identity Shift" },
  { text: "Le persone non comprano il prodotto migliore. Comprano da chi sembra più sicuro. La sicurezza si costruisce facendo. Vai a fare.", icon: Shield, accent: "#a78bfa", category: "Confidence Game" },
  { text: "Smetti di celebrare l'inizio. Celebra solo i bonifici incassati. Tutto il resto è teatrino.", icon: Trophy, accent: "#d4a052", category: "Show Me The Money" },
];

interface Props {
  userName: string;
  avatarUrl?: string | null;
  onComplete: () => void;
}

const AUTO_DISMISS_MS = 7500;
const PROGRESS_START_DELAY = 2200;
const PROGRESS_DURATION = AUTO_DISMISS_MS - PROGRESS_START_DELAY;

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 6) return "Notte fonda";
  if (h < 12) return "Buongiorno";
  if (h < 18) return "Buon pomeriggio";
  if (h < 22) return "Buonasera";
  return "Buonanotte";
};

const getInitials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map(n => n[0]?.toUpperCase()).join("") || "P";

export default function PartnerSplashScreen({ userName, avatarUrl, onComplete }: Props) {
  const [phase, setPhase] = useState<"empire" | "mindset" | "done">("empire");
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elapsedRef = useRef(0);
  const startTimeRef = useRef(0);
  const progressControls = useAnimationControls();

  const todayQuote = useMemo(() => {
    const seed = new Date().getFullYear() * 10000 + (new Date().getMonth() + 1) * 100 + new Date().getDate();
    const hourBlock = Math.floor(new Date().getHours() / 2); // cambia ogni 2h → più varietà nella giornata
    return MINDSET_LIBRARY[(seed + hourBlock) % MINDSET_LIBRARY.length];
  }, []);

  const greeting = useMemo(() => getGreeting(), []);
  const initials = useMemo(() => getInitials(userName), [userName]);

  const handleSplashDone = useCallback(() => {
    setPhase("mindset");
  }, []);

  const finish = useCallback(() => {
    setPhase("done");
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (phase !== "mindset") return;
    if (paused) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      elapsedRef.current += Date.now() - startTimeRef.current;
      return;
    }
    const remaining = AUTO_DISMISS_MS - elapsedRef.current;
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(finish, remaining);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, paused, finish]);

  useEffect(() => {
    if (phase !== "mindset") return;
    const elapsed = elapsedRef.current;
    const progressElapsed = Math.max(0, elapsed - PROGRESS_START_DELAY);
    const progressRemaining = PROGRESS_DURATION - progressElapsed;

    if (paused) {
      progressControls.stop();
      return;
    }

    if (elapsed < PROGRESS_START_DELAY) {
      const delayRemaining = PROGRESS_START_DELAY - elapsed;
      const t = setTimeout(() => {
        progressControls.start({
          width: "100%",
          transition: { duration: PROGRESS_DURATION / 1000, ease: "linear" },
        });
      }, delayRemaining);
      return () => clearTimeout(t);
    }

    progressControls.start({
      width: "100%",
      transition: { duration: progressRemaining / 1000, ease: "linear" },
    });
  }, [phase, paused, progressControls]);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  if (phase === "empire") {
    return <UnifiedIntro onComplete={handleSplashDone} />;
  }

  return (
    <AnimatePresence>
      {phase === "mindset" && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ background: "radial-gradient(ellipse at 50% 40%, #12102a 0%, #0a0a14 60%, #050510 100%)" }}
        >
          {/* Ambient particles */}
          {[...Array(14)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full"
              style={{
                width: 1.5 + Math.random() * 2, height: 1.5 + Math.random() * 2,
                background: todayQuote.accent, left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%`,
              }}
              animate={paused ? {} : { y: [0, -20, 0], opacity: [0, 0.4, 0] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center px-8 text-center max-w-sm">

            {/* ═══ CINEMATIC AVATAR — entra grande, si stringe in posizione ═══ */}
            <motion.div
              className="relative mb-4"
              initial={{ scale: 2.2, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{
                duration: 1.4,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
            >
              {/* Glow pulsante esterno */}
              <motion.div
                className="absolute inset-0 rounded-full blur-2xl"
                style={{ background: todayQuote.accent }}
                animate={paused ? {} : { opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Anello rotante */}
              <motion.div
                className="absolute -inset-2 rounded-full"
                style={{
                  background: `conic-gradient(from 0deg, ${todayQuote.accent}00, ${todayQuote.accent}, ${todayQuote.accent}00, ${todayQuote.accent}80, ${todayQuote.accent}00)`,
                  padding: 2,
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
                animate={paused ? {} : { rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              {/* Avatar */}
              <div
                className="relative w-20 h-20 rounded-full overflow-hidden flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${todayQuote.accent}25, ${todayQuote.accent}10)`,
                  border: `2px solid ${todayQuote.accent}80`,
                  boxShadow: `0 0 30px ${todayQuote.accent}60, inset 0 0 20px ${todayQuote.accent}20`,
                }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-extrabold text-white" style={{ textShadow: `0 0 10px ${todayQuote.accent}` }}>
                    {initials}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Greeting dinamico */}
            <motion.p
              className="text-[10px] font-bold uppercase tracking-[0.35em] mb-1"
              style={{ color: `${todayQuote.accent}cc` }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              ⚔ {greeting}, Closer
            </motion.p>

            {/* Nome */}
            <motion.h1
              className="text-2xl font-extrabold text-white tracking-tight mb-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.35, duration: 0.6 }}
              style={{ textShadow: `0 0 30px ${todayQuote.accent}50` }}
            >
              {userName}
            </motion.h1>

            <motion.p
              className="text-[10px] text-white/80 font-medium tracking-wider uppercase mb-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Empire Closer · Livello Operativo
            </motion.p>

            {/* Separator */}
            <motion.div
              className="h-px rounded-full mb-6"
              style={{ background: `linear-gradient(90deg, transparent, ${todayQuote.accent}80, transparent)` }}
              initial={{ width: 0 }}
              animate={{ width: 160 }}
              transition={{ delay: 1.65, duration: 0.8, ease: "easeOut" }}
            />

            {/* Category */}
            <motion.span
              className="text-[9px] font-bold uppercase tracking-[0.3em] mb-3"
              style={{ color: `${todayQuote.accent}aa` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.85 }}
            >
              {todayQuote.category}
            </motion.span>

            {/* Icon */}
            <motion.div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: `${todayQuote.accent}12`, border: `1px solid ${todayQuote.accent}25` }}
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 2.0, type: "spring", stiffness: 200, damping: 15 }}
            >
              <todayQuote.icon className="w-5 h-5" style={{ color: todayQuote.accent }} />
            </motion.div>

            {/* Quote */}
            <motion.blockquote
              className="text-[14px] font-medium text-white/85 leading-relaxed max-w-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.8 }}
            >
              "{todayQuote.text}"
            </motion.blockquote>

            {/* Progress bar + pause */}
            <motion.div
              className="flex items-center gap-3 mt-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.4 }}
            >
              <motion.button
                onClick={togglePause}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: `${todayQuote.accent}15`,
                  border: `1px solid ${todayQuote.accent}30`,
                }}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1, background: `${todayQuote.accent}25` }}
                aria-label={paused ? "Riprendi" : "Pausa"}
              >
                {paused ? (
                  <Play className="w-3.5 h-3.5" style={{ color: todayQuote.accent }} />
                ) : (
                  <Pause className="w-3.5 h-3.5" style={{ color: todayQuote.accent }} />
                )}
              </motion.button>

              <div
                className="w-24 h-[3px] rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${todayQuote.accent}, ${todayQuote.accent}60)` }}
                  initial={{ width: "0%" }}
                  animate={progressControls}
                />
              </div>

              <AnimatePresence>
                {paused && (
                  <motion.span
                    className="text-[9px] font-semibold uppercase tracking-wider"
                    style={{ color: `${todayQuote.accent}90` }}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                  >
                    In pausa
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Skip */}
            <motion.button
              onClick={finish}
              className="mt-4 px-6 py-2.5 rounded-full text-[11px] font-extrabold tracking-[0.18em] uppercase transition-all"
              style={{ color: "#fff", background: `linear-gradient(90deg, ${todayQuote.accent}40, ${todayQuote.accent}20)`, border: `1px solid ${todayQuote.accent}60`, boxShadow: `0 0 20px ${todayQuote.accent}30` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8 }}
              whileHover={{ scale: 1.06, boxShadow: `0 0 32px ${todayQuote.accent}60` }}
              whileTap={{ scale: 0.95 }}
            >
              🔥 Vai a Conquistare →
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
