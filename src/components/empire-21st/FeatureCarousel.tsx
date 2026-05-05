import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Bot, MessageSquare, Mic, Sparkles, Users, CreditCard, Star, BarChart3,
  type LucideIcon,
} from "lucide-react";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import RealisticIPhonePreview from "@/components/empire-home/RealisticIPhonePreview";

// 8 Feature reali di Empire (italiano, B2B)
type Feature = { id: string; label: string; icon: LucideIcon; image: string; description: string };

const M_FOOD = SECTOR_MOCKUP_IMAGES.food ?? [];
const M_BEAUTY = SECTOR_MOCKUP_IMAGES.beauty ?? [];
const M_NCC = SECTOR_MOCKUP_IMAGES.ncc ?? [];
const M_FITNESS = SECTOR_MOCKUP_IMAGES.fitness ?? [];
const M_HOSP = SECTOR_MOCKUP_IMAGES.hospitality ?? [];

const fb = (arr: string[], i: number) => arr[i % Math.max(arr.length, 1)] ?? "/placeholder.svg";

const FEATURES: Feature[] = [
  { id: "webapp", label: "Web App su misura",  icon: Sparkles,      image: fb(M_FOOD, 0),
    description: "Sito operativo, catalogo, booking, pagamenti e area cliente costruiti sui flussi reali della tua attività." },
  { id: "whatsapp", label: "WhatsApp che vende", icon: MessageSquare, image: fb(M_BEAUTY, 1),
    description: "Risponde alle richieste, qualifica il cliente, conferma appuntamenti e passa allo staff solo i casi importanti." },
  { id: "voice", label: "Voice Agent",          icon: Mic,           image: fb(M_HOSP, 0),
    description: "Risponde alle telefonate con voce naturale, prenota tavoli e camere, salva il cliente nel CRM." },
  { id: "demo", label: "Demo automatica",       icon: Bot,           image: fb(M_FOOD, 2),
    description: "Da un lead si prepara una presentazione realistica con mockup, sito dimostrativo e flusso commerciale chiaro." },
  { id: "crm", label: "CRM 360°",                icon: Users,         image: fb(M_NCC, 0),
    description: "Ogni cliente, ordine, recensione e messaggio in un unico profilo. Riconosce chi torna." },
  { id: "payments", label: "Pagamenti integrati", icon: CreditCard,   image: fb(M_FITNESS, 0),
    description: "Incassi, acconti, abbonamenti e checkout collegati al processo: meno messaggi manuali, più controllo." },
  { id: "reviews", label: "Scudo recensioni",     icon: Star,          image: fb(M_BEAUTY, 2),
    description: "Raccoglie feedback, intercetta problemi operativi e aiuta a trasformare clienti soddisfatti in prove sociali." },
  { id: "analytics", label: "Analytics in tempo reale", icon: BarChart3, image: fb(M_NCC, 2),
    description: "Margini, ticket medio, top prodotti, churn. Niente fogli Excel: l'AI ti dice cosa fare oggi." },
];

const AUTO_PLAY_INTERVAL = 4500;
const ITEM_HEIGHT = 65;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function FeatureCarousel() {
  const rootRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex = ((step % FEATURES.length) + FEATURES.length) % FEATURES.length;

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + FEATURES.length) % FEATURES.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const updateFromScroll = () => {
      if (isPaused) return;
      const rect = root.getBoundingClientRect();
      const total = Math.max(1, root.offsetHeight - window.innerHeight);
      const progress = Math.min(Math.max(-rect.top / total, 0), 1);
      setStep(Math.min(FEATURES.length - 1, Math.floor(progress * FEATURES.length)));
    };

    updateFromScroll();
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("resize", updateFromScroll);
    return () => {
      window.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("resize", updateFromScroll);
    };
  }, [isPaused]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = FEATURES.length;
    let normalizedDiff = diff;
    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;
    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  return (
    <section ref={rootRef} className="relative min-h-[340svh] w-full">
    <div className="sticky top-0 flex min-h-[100svh] w-full items-center justify-center px-4 py-20 sm:px-6 md:p-8">
    <div className="w-full max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-[1.75rem] lg:rounded-[2.5rem] flex flex-col lg:flex-row min-h-[640px] lg:min-h-[560px] border border-foreground/10 bg-background">
        {/* LEFT: chips list */}
        <div className="w-full lg:w-[42%] min-h-[280px] md:min-h-[340px] lg:h-auto relative z-30 flex flex-col items-start justify-center overflow-hidden px-6 md:px-12 lg:pl-14 bg-gradient-to-br from-[#1a1226] via-[#11141a] to-[#0b0d12]">
          <div className="absolute inset-x-0 top-0 h-12 md:h-16 bg-gradient-to-b from-[#11141a] via-[#11141a]/80 to-transparent z-40" />
          <div className="absolute inset-x-0 bottom-0 h-12 md:h-16 bg-gradient-to-t from-[#11141a] via-[#11141a]/80 to-transparent z-40" />
          <div className="relative w-full h-full flex items-center justify-center lg:justify-start z-20 py-16">
            {FEATURES.map((feature, index) => {
              const isActive = index === currentIndex;
              const distance = index - currentIndex;
              const wrappedDistance = wrap(-(FEATURES.length / 2), FEATURES.length / 2, distance);
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.id}
                  style={{ height: ITEM_HEIGHT, width: "fit-content" }}
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: 1 - Math.abs(wrappedDistance) * 0.28,
                  }}
                  transition={{ type: "spring", stiffness: 90, damping: 22, mass: 1 }}
                  className="absolute flex items-center justify-start"
                >
                  <button
                    onClick={() => handleChipClick(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      "relative flex items-center gap-3 px-5 md:px-7 py-3 md:py-3.5 rounded-full transition-all duration-700 text-left group border min-h-[44px]",
                      isActive
                        ? "bg-gradient-to-r from-amber-300 to-amber-500 text-black border-amber-300 z-10 shadow-[0_0_24px_rgba(245,158,11,0.45)]"
                        : "bg-white/5 text-white/55 border-white/10 hover:border-white/30 hover:text-white/90"
                    )}
                  >
                    <Icon size={16} strokeWidth={2.2} className={isActive ? "text-black" : "text-white/50"} />
                    <span className="font-semibold text-[12px] md:text-[13px] tracking-tight whitespace-nowrap uppercase">
                      {feature.label}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: image stack */}
        <div className="flex-1 min-h-[420px] md:min-h-[520px] relative bg-[#080a0f] flex items-center justify-center py-12 md:py-20 px-6 md:px-12 overflow-hidden border-t lg:border-t-0 lg:border-l border-white/10">
          <div className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center">
            {FEATURES.map((feature, index) => {
              const status = getCardStatus(index);
              const isActive = status === "active";
              const isPrev = status === "prev";
              const isNext = status === "next";

              return (
                <motion.div
                  key={feature.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? -100 : isNext ? 100 : 0,
                    scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                    rotate: isPrev ? -3 : isNext ? 3 : 0,
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 25, mass: 0.8 }}
                  className="absolute inset-0 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border-4 md:border-[6px] border-[#11141a] bg-[#11141a] origin-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
                >
                  <img
                    src={feature.image}
                    alt={feature.label}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-700",
                      isActive ? "grayscale-0 blur-0" : "grayscale blur-[2px] brightness-75"
                    )}
                    loading="lazy"
                  />

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute inset-x-0 bottom-0 p-6 md:p-8 pt-24 bg-gradient-to-t from-black/95 via-black/55 to-transparent flex flex-col justify-end pointer-events-none"
                      >
                        <div className="bg-amber-300 text-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] w-fit mb-3">
                          {String(index + 1).padStart(2, "0")} · {feature.label}
                        </div>
                        <p className="text-white font-medium text-base md:text-lg leading-snug drop-shadow-md tracking-tight">
                          {feature.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    className={cn(
                      "absolute top-5 left-5 flex items-center gap-2 transition-opacity duration-300",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
                    <span className="text-white/80 text-[10px] font-semibold uppercase tracking-[0.25em]">
                      Attivo ora
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    </div>
    </section>
  );
}

export default FeatureCarousel;
