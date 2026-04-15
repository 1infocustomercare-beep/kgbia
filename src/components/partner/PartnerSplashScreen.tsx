import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Rocket, Flame, Zap, Star, Trophy, Sparkles, TrendingUp, Target, Shield } from "lucide-react";
import SplashScreen from "@/components/SplashScreen";

/* ═══ PROFESSIONAL MINDSET QUOTES — rotano ogni accesso ═══ */
const MINDSET_LIBRARY = [
  { text: "Chi controlla la narrativa, controlla la vendita. Non presentare — trasforma la percezione del cliente.", icon: Crown, accent: "#d4a052", category: "Strategia" },
  { text: "Il 90% dei tuoi competitor si ferma al primo rifiuto. Il tuo vantaggio competitivo è la resilienza sistematica.", icon: Shield, accent: "#a78bfa", category: "Resilienza" },
  { text: "Non stai vendendo software — stai vendendo ore di vita restituite al titolare. Questo vale più di qualsiasi prezzo.", icon: Sparkles, accent: "#34d399", category: "Value Selling" },
  { text: "Un Team Leader con 5 membri attivi genera €3.000/mese di override senza vendere direttamente. Costruisci il sistema, non il lavoro.", icon: TrendingUp, accent: "#38bdf8", category: "Leadership" },
  { text: "Il cliente non compra quando capisce il prodotto — compra quando si sente capito. Ascolta il doppio di quanto parli.", icon: Star, accent: "#f59e0b", category: "Empatia" },
  { text: "Ogni obiezione è una richiesta di informazioni mascherata. Decodificala, risolvila, chiudi. Metodo, non fortuna.", icon: Target, accent: "#a78bfa", category: "Tecnica" },
  { text: "La differenza tra €997 e €6.485 al mese è esattamente 2 vendite in più. Due conversazioni. Due decisioni.", icon: Flame, accent: "#ef4444", category: "Obiettivi" },
  { text: "I top performer non hanno clienti migliori — hanno un processo migliore. Standardizza la tua eccellenza.", icon: Zap, accent: "#34d399", category: "Processo" },
  { text: "Il prezzo è un problema solo quando il valore non è chiaro. Se il cliente discute il prezzo, hai saltato un passaggio.", icon: Trophy, accent: "#d4a052", category: "Pricing" },
  { text: "Un Diamond Leader non si è mai chiesto 'se' ce l'avrebbe fatta. Si è chiesto 'quanto velocemente'. Decidi il ritmo.", icon: Rocket, accent: "#a78bfa", category: "Ambizione" },
  { text: "Ogni mattina hai 2 opzioni: reagire alla giornata o progettarla. I leader progettano. I follower reagiscono.", icon: Crown, accent: "#f59e0b", category: "Mindset" },
  { text: "Il follow-up non è insistenza — è professionalità. L'80% delle vendite avviene dopo il 5° contatto. I dilettanti si fermano al 2°.", icon: Target, accent: "#38bdf8", category: "Follow-up" },
  { text: "Non vendere il risparmio — vendi il costo dell'inazione. Quanto perde il cliente ogni mese senza il tuo sistema?", icon: TrendingUp, accent: "#34d399", category: "Urgenza" },
  { text: "Il reclutamento non è chiedere un favore — è offrire un'opportunità da €997 a vendita. Chi non vorrebbe?", icon: Shield, accent: "#d4a052", category: "Recruiting" },
  { text: "La competenza si costruisce con le prime 10 vendite. La ricchezza si costruisce con le successive 100. Non fermarti alla competenza.", icon: Flame, accent: "#a78bfa", category: "Scalabilità" },
  { text: "Il momento perfetto per vendere non esiste. Il momento migliore per vendere è adesso, con quello che sai adesso.", icon: Zap, accent: "#f59e0b", category: "Azione" },
  { text: "Non stai cercando clienti — stai selezionando partner di business. Chi non è pronto oggi, lo sarà domani. Il tuo pipeline è il tuo futuro.", icon: Star, accent: "#38bdf8", category: "Pipeline" },
  { text: "Un venditore medio chiude 1 su 10. Un professionista Empire chiude 1 su 3. La differenza? Qualificazione prima della presentazione.", icon: Trophy, accent: "#34d399", category: "Qualificazione" },
  { text: "Il tuo personal brand è il tuo asset più potente. Ogni interazione è un'opportunità per posizionarti come l'esperto di riferimento.", icon: Crown, accent: "#d4a052", category: "Personal Brand" },
  { text: "I bonus non sono regali — sono il riconoscimento matematico della tua eccellenza. €500 a 3 vendite, €1.500 a 5. I numeri non mentono.", icon: Sparkles, accent: "#a78bfa", category: "Performance" },
];

interface Props {
  userName: string;
  onComplete: () => void;
}

export default function PartnerSplashScreen({ userName, onComplete }: Props) {
  const [phase, setPhase] = useState<"empire" | "mindset" | "done">("empire");

  const todayQuote = useMemo(() => {
    const seed = new Date().getFullYear() * 10000 + (new Date().getMonth() + 1) * 100 + new Date().getDate();
    const hourBlock = Math.floor(new Date().getHours() / 4); // changes every 4 hours
    return MINDSET_LIBRARY[(seed + hourBlock) % MINDSET_LIBRARY.length];
  }, []);

  const handleSplashDone = useCallback(() => {
    setPhase("mindset");
  }, []);

  useEffect(() => {
    if (phase === "mindset") {
      const t = setTimeout(() => { setPhase("done"); onComplete(); }, 6500);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  if (phase === "empire") {
    return <SplashScreen onComplete={handleSplashDone} />;
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
              animate={{ y: [0, -20, 0], opacity: [0, 0.4, 0] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center px-8 text-center max-w-sm">
            {/* Welcome line */}
            <motion.p
              className="text-sm text-white/30 font-light tracking-wide mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Bentornato,
            </motion.p>

            <motion.h1
              className="text-2xl font-bold text-white tracking-tight mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {userName}
            </motion.h1>

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

            {/* Quote — word by word reveal */}
            <motion.blockquote
              className="text-[15px] font-medium text-white/85 leading-relaxed max-w-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
            >
              "{todayQuote.text}"
            </motion.blockquote>

            {/* Auto-dismiss progress */}
            <motion.div
              className="w-24 h-[3px] rounded-full mt-8 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.04)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${todayQuote.accent}, ${todayQuote.accent}60)` }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 2, duration: 4.5, ease: "linear" }}
              />
            </motion.div>

            {/* Skip button */}
            <motion.button
              onClick={() => { setPhase("done"); onComplete(); }}
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
