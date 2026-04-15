import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Rocket, Flame, Zap, Star, Trophy, Sparkles } from "lucide-react";

const MINDSET_QUOTES = [
  { text: "I vincitori non aspettano il momento perfetto — lo creano.", icon: Rocket, accent: "#a78bfa" },
  { text: "Ogni 'no' ti avvicina al prossimo 'sì'. La persistenza batte il talento.", icon: Flame, accent: "#f59e0b" },
  { text: "Non vendere un prodotto — vendi una trasformazione. Il cliente compra il futuro.", icon: Star, accent: "#34d399" },
  { text: "Il tuo network è il tuo patrimonio netto. Ogni connessione è un investimento.", icon: Crown, accent: "#d4a052" },
  { text: "Chi si ferma a 3 vendite non scoprirà mai cosa succede alla 5ª. Spingi oltre.", icon: Trophy, accent: "#38bdf8" },
  { text: "I leader non nascono — si costruiscono. Una vendita alla volta.", icon: Zap, accent: "#a78bfa" },
  { text: "Il successo non è un colpo di fortuna. È preparazione che incontra l'opportunità.", icon: Sparkles, accent: "#f59e0b" },
  { text: "Mentre gli altri dormono, tu costruisci il tuo impero. Ogni giorno conta.", icon: Rocket, accent: "#34d399" },
  { text: "La differenza tra ordinario e straordinario è quel piccolo 'extra'. Dallo oggi.", icon: Flame, accent: "#d4a052" },
  { text: "Non sei un venditore — sei un consulente che cambia business. Sii fiero.", icon: Crown, accent: "#a78bfa" },
  { text: "I top performer non hanno più tempo — hanno più disciplina. Inizia ora.", icon: Trophy, accent: "#38bdf8" },
  { text: "Ogni mattina hai una scelta: essere nella media o essere inarrestabile.", icon: Zap, accent: "#f59e0b" },
  { text: "Il cliente non compra il software — compra la tranquillità. Offrigli quella.", icon: Star, accent: "#34d399" },
  { text: "Un Team Leader guadagna anche dormendo. Costruisci il team, costruisci la libertà.", icon: Crown, accent: "#d4a052" },
  { text: "La vendita più importante? La prossima. Sempre la prossima.", icon: Rocket, accent: "#a78bfa" },
  { text: "Non aspettare di essere pronto. Inizia, impara, domina.", icon: Flame, accent: "#f59e0b" },
  { text: "Ogni obiezione è un'opportunità mascherata. Ascolta, risolvi, chiudi.", icon: Sparkles, accent: "#38bdf8" },
  { text: "Il mindset giusto trasforma un mese lento in un mese di svolta.", icon: Zap, accent: "#34d399" },
  { text: "Non stai vendendo — stai aprendo porte. Dietro ogni porta c'è una commissione.", icon: Trophy, accent: "#d4a052" },
  { text: "I Diamond Leader non si sono fermati quando era difficile. E tu?", icon: Crown, accent: "#a78bfa" },
];

interface Props {
  userName: string;
  onComplete: () => void;
}

export default function PartnerSplashScreen({ userName, onComplete }: Props) {
  const [phase, setPhase] = useState<"logo" | "welcome" | "mindset" | "done">("logo");

  const todayQuote = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const hourSeed = new Date().getHours();
    const index = (dayOfYear * 7 + hourSeed) % MINDSET_QUOTES.length;
    return MINDSET_QUOTES[index];
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("welcome"), 1200);
    const t2 = setTimeout(() => setPhase("mindset"), 3200);
    const t3 = setTimeout(() => setPhase("done"), 7500);
    const t4 = setTimeout(onComplete, 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ background: "radial-gradient(ellipse at 50% 30%, #1a1040 0%, #0a0a14 50%, #050510 100%)" }}
        >
          {/* Ambient particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 2 + Math.random() * 3,
                height: 2 + Math.random() * 3,
                background: i % 3 === 0 ? "#a78bfa" : i % 3 === 1 ? "#d4a052" : "#34d399",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30 - Math.random() * 40, 0],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}

          {/* Radial glow pulse */}
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(167,139,250,0.08), transparent 70%)" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="relative z-10 flex flex-col items-center px-8 text-center max-w-sm">
            {/* Phase 1: Logo reveal */}
            <AnimatePresence mode="wait">
              {phase === "logo" && (
                <motion.div
                  key="logo"
                  initial={{ scale: 0.3, opacity: 0, rotateY: -90 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.2), rgba(212,160,82,0.1))", border: "1px solid rgba(167,139,250,0.3)" }}>
                    <Crown className="w-10 h-10" style={{ color: "#d4a052" }} />
                  </div>
                  <motion.p
                    className="text-xs font-bold uppercase tracking-[0.3em]"
                    style={{ color: "#a78bfa" }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Empire Partner
                  </motion.p>
                </motion.div>
              )}

              {/* Phase 2: Welcome */}
              {phase === "welcome" && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex flex-col items-center gap-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <Sparkles className="w-8 h-8" style={{ color: "#d4a052" }} />
                  </motion.div>
                  <div>
                    <motion.p
                      className="text-lg text-white/50 font-light"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Bentornato,
                    </motion.p>
                    <motion.h1
                      className="text-3xl font-bold text-white mt-1 tracking-tight"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      {userName}
                    </motion.h1>
                  </div>
                  <motion.p
                    className="text-sm text-white/40 font-light"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Il tuo impero ti aspetta
                  </motion.p>
                  {/* Animated line */}
                  <motion.div
                    className="h-px rounded-full mt-2"
                    style={{ background: "linear-gradient(90deg, transparent, #a78bfa, #d4a052, transparent)" }}
                    initial={{ width: 0 }}
                    animate={{ width: 200 }}
                    transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                  />
                </motion.div>
              )}

              {/* Phase 3: Mindset quote */}
              {phase === "mindset" && (
                <motion.div
                  key="mindset"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.7 }}
                  className="flex flex-col items-center gap-5"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: `${todayQuote.accent}15`, border: `1px solid ${todayQuote.accent}30` }}
                  >
                    <todayQuote.icon className="w-7 h-7" style={{ color: todayQuote.accent }} />
                  </motion.div>

                  <motion.p
                    className="text-[10px] font-bold uppercase tracking-[0.25em]"
                    style={{ color: todayQuote.accent }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Mindset del Giorno
                  </motion.p>

                  <motion.blockquote
                    className="text-lg font-semibold text-white/90 leading-relaxed max-w-xs italic"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    "{todayQuote.text}"
                  </motion.blockquote>

                  {/* Progress bar to indicate auto-dismiss */}
                  <motion.div
                    className="w-32 h-1 rounded-full mt-4 overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${todayQuote.accent}, ${todayQuote.accent}80)` }}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4, ease: "linear" }}
                    />
                  </motion.div>

                  <motion.button
                    onClick={onComplete}
                    className="mt-2 px-6 py-2 rounded-full text-xs font-semibold tracking-wider uppercase"
                    style={{ background: `${todayQuote.accent}15`, color: todayQuote.accent, border: `1px solid ${todayQuote.accent}25` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Inizia a Vendere →
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
