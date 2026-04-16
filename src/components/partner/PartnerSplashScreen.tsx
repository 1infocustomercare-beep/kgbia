import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { Crown, Rocket, Flame, Zap, Star, Trophy, Sparkles, TrendingUp, Target, Shield, Pause, Play, Swords, Diamond } from "lucide-react";
import UnifiedIntro from "@/components/UnifiedIntro";

/* ═══ HIGH-IMPACT MINDSET QUOTES — gas the closer, no comfort zone ═══ */
const MINDSET_LIBRARY = [
  { text: "Mentre dormi, qualcuno sta firmando il contratto che doveva essere tuo. Svegliati prima. Chiama prima. Chiudi prima.", icon: Flame, accent: "#ef4444", category: "Urgenza Brutale" },
  { text: "Il 97% si arrende dopo 4 NO. Il 3% che diventa ricco continua fino al 12°. Quanti ne hai presi oggi? Non bastano.", icon: Swords, accent: "#a78bfa", category: "Resilienza Estrema" },
  { text: "Non stai vendendo software. Stai vendendo libertà. 8 ore al giorno restituite al titolare. Questo non ha prezzo — ha solo un costo: l'inazione.", icon: Sparkles, accent: "#34d399", category: "Mission" },
  { text: "Un Diamond a €18.000/mese non lavora di più. Lavora SOLO sulle conversazioni che contano. Smetti di disperdere energia. Concentra il fuoco.", icon: Diamond, accent: "#38bdf8", category: "Focus Chirurgico" },
  { text: "Ogni minuto che passi a lamentarti è un minuto rubato a chi sta costruendo il suo impero. Lamentarsi è povertà. Vendere è libertà.", icon: Crown, accent: "#d4a052", category: "Mentalità" },
  { text: "Il cliente che oggi ti dice NO sta cercando il TUO competitor. Hai 24 ore per richiamarlo prima che firmi con qualcun altro.", icon: Target, accent: "#ef4444", category: "Velocità" },
  { text: "€997 a vendita. 3 vendite a settimana = €11.964/mese. Non è un sogno — è matematica. L'unica variabile sei TU.", icon: Trophy, accent: "#d4a052", category: "Numeri Veri" },
  { text: "I dilettanti aspettano l'ispirazione. I professionisti aprono il CRM alle 8:00 e iniziano a chiamare. La disciplina batte il talento — sempre.", icon: Zap, accent: "#a78bfa", category: "Disciplina" },
  { text: "Non sei pagato per provare. Sei pagato per CHIUDERE. Ogni 'ci penso' non gestito è denaro che hai regalato alla concorrenza.", icon: Swords, accent: "#f59e0b", category: "Closer Mentality" },
  { text: "Mentre il tuo amico si lamenta dello stipendio, tu stai costruendo un asset che ti pagherà override per i prossimi 10 anni. Resisti ancora 90 giorni.", icon: Rocket, accent: "#34d399", category: "Visione" },
  { text: "Il tuo conto in banca è uno specchio del tuo livello di azione. Vuoi cambiare il numero? Cambia le abitudini di OGGI, non di lunedì.", icon: TrendingUp, accent: "#d4a052", category: "Verità Cruda" },
  { text: "5 contatti al giorno = mediocrità. 30 contatti al giorno = libertà finanziaria entro 18 mesi. La differenza è una scelta, non una capacità.", icon: Flame, accent: "#ef4444", category: "Volume di Attacco" },
  { text: "Non aspettare di essere pronto. I top performer hanno chiuso la prima vendita TREMANDO. L'azione genera la sicurezza, non viceversa.", icon: Star, accent: "#38bdf8", category: "Coraggio" },
  { text: "Il NO di un cliente non parla di te — parla di lui. Non è personale, è statistica. Ogni 10 NO ti avvicinano matematicamente al SÌ da €997.", icon: Shield, accent: "#a78bfa", category: "Mental Game" },
  { text: "I tuoi competitor stanno cenando con la famiglia mentre tu mandi l'ultimo messaggio della giornata. Quel messaggio è il tuo €18.000/mese di domani.", icon: Crown, accent: "#f59e0b", category: "Sacrificio" },
  { text: "Smetti di dire 'devo trovare clienti'. Trova invece i PROBLEMI. I clienti sono solo persone con problemi che TU puoi risolvere oggi stesso.", icon: Target, accent: "#34d399", category: "Reframe" },
  { text: "Un Team Leader con 7 venditori attivi guadagna mentre dorme, viaggia, cena fuori. Tu stai ancora scambiando ore per soldi? Costruisci il sistema.", icon: Diamond, accent: "#a78bfa", category: "Leverage" },
  { text: "Non esiste 'mercato saturo'. Esistono solo venditori saturi di scuse. In Italia ci sono 4.5 milioni di PMI senza il tuo sistema. Vai a prenderli.", icon: Rocket, accent: "#ef4444", category: "Opportunità" },
  { text: "Ogni email non inviata, ogni chiamata non fatta, è denaro che hai donato volontariamente alla povertà. Sei tu il tuo unico ostacolo.", icon: Swords, accent: "#d4a052", category: "Brutalità" },
  { text: "Tra 12 mesi sarai grato per il dolore di oggi o sarai ancora a lamentarti delle stesse cose. Decidi ADESSO chi vuoi essere il prossimo dicembre.", icon: Trophy, accent: "#38bdf8", category: "Decision Day" },
];

interface Props {
  userName: string;
  onComplete: () => void;
}

const AUTO_DISMISS_MS = 6500;
const PROGRESS_START_DELAY = 2000;
const PROGRESS_DURATION = AUTO_DISMISS_MS - PROGRESS_START_DELAY;

export default function PartnerSplashScreen({ userName, onComplete }: Props) {
  const [phase, setPhase] = useState<"empire" | "mindset" | "done">("empire");
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elapsedRef = useRef(0);
  const startTimeRef = useRef(0);
  const progressControls = useAnimationControls();

  const todayQuote = useMemo(() => {
    const seed = new Date().getFullYear() * 10000 + (new Date().getMonth() + 1) * 100 + new Date().getDate();
    const hourBlock = Math.floor(new Date().getHours() / 4);
    return MINDSET_LIBRARY[(seed + hourBlock) % MINDSET_LIBRARY.length];
  }, []);

  const handleSplashDone = useCallback(() => {
    setPhase("mindset");
  }, []);

  const finish = useCallback(() => {
    setPhase("done");
    onComplete();
  }, [onComplete]);

  // Auto-dismiss timer with pause/resume
  useEffect(() => {
    if (phase !== "mindset") return;

    if (paused) {
      // Save elapsed time and clear timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      elapsedRef.current += Date.now() - startTimeRef.current;
      return;
    }

    // Start/resume timer
    const remaining = AUTO_DISMISS_MS - elapsedRef.current;
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(finish, remaining);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, paused, finish]);

  // Progress bar animation with pause/resume
  useEffect(() => {
    if (phase !== "mindset") return;

    const elapsed = elapsedRef.current;
    const progressElapsed = Math.max(0, elapsed - PROGRESS_START_DELAY);
    const progressRemaining = PROGRESS_DURATION - progressElapsed;
    const startPercent = (progressElapsed / PROGRESS_DURATION) * 100;

    if (paused) {
      // Freeze progress at current position
      progressControls.stop();
      return;
    }

    if (elapsed < PROGRESS_START_DELAY) {
      // Haven't reached progress start yet
      const delayRemaining = PROGRESS_START_DELAY - elapsed;
      const t = setTimeout(() => {
        progressControls.start({
          width: "100%",
          transition: { duration: PROGRESS_DURATION / 1000, ease: "linear" },
        });
      }, delayRemaining);
      return () => clearTimeout(t);
    }

    // Resume from current position
    progressControls.start({
      width: "100%",
      transition: { duration: progressRemaining / 1000, ease: "linear" },
    });
  }, [phase, paused, progressControls]);

  const togglePause = useCallback(() => {
    setPaused((p) => !p);
  }, []);

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
          {/* Subtle ambient particles */}
          {[...Array(12)].map((_, i) => (
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
            {/* War-cry header — no comfort zone */}
            <motion.p
              className="text-[10px] font-bold uppercase tracking-[0.35em] mb-2"
              style={{ color: `${todayQuote.accent}aa` }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              ⚔ Pronto al combattimento,
            </motion.p>

            <motion.h1
              className="text-3xl font-extrabold text-white tracking-tight mb-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{ textShadow: `0 0 30px ${todayQuote.accent}40` }}
            >
              {userName}
            </motion.h1>

            <motion.p
              className="text-[10px] text-white/40 font-medium tracking-wider uppercase mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              Empire Closer · Livello Operativo
            </motion.p>

            {/* Separator line */}
            <motion.div
              className="h-px rounded-full mb-8"
              style={{ background: `linear-gradient(90deg, transparent, ${todayQuote.accent}80, transparent)` }}
              initial={{ width: 0 }}
              animate={{ width: 160 }}
              transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
            />

            {/* Category tag */}
            <motion.span
              className="text-[9px] font-bold uppercase tracking-[0.3em] mb-4"
              style={{ color: `${todayQuote.accent}99` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {todayQuote.category}
            </motion.span>

            {/* Icon */}
            <motion.div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
              style={{ background: `${todayQuote.accent}12`, border: `1px solid ${todayQuote.accent}25` }}
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 15 }}
            >
              <todayQuote.icon className="w-6 h-6" style={{ color: todayQuote.accent }} />
            </motion.div>

            {/* Quote */}
            <motion.blockquote
              className="text-[15px] font-medium text-white/85 leading-relaxed max-w-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
            >
              "{todayQuote.text}"
            </motion.blockquote>

            {/* Progress bar + pause button */}
            <motion.div
              className="flex items-center gap-3 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              {/* Pause/Play button */}
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

              {/* Progress bar */}
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

              {/* Paused indicator */}
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

            {/* Skip button */}
            <motion.button
              onClick={finish}
              className="mt-4 px-5 py-2 rounded-full text-[10px] font-semibold tracking-[0.15em] uppercase transition-all"
              style={{ color: `${todayQuote.accent}90`, background: `${todayQuote.accent}08`, border: `1px solid ${todayQuote.accent}18` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              whileHover={{ scale: 1.05, background: `${todayQuote.accent}15` }}
              whileTap={{ scale: 0.95 }}
            >
              Inizia la Giornata →
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
