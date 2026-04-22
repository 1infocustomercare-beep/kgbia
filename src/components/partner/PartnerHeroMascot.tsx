import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import empireMonkeyLaptop from "@/assets/empire-monkey-laptop.png";
import { LucideIcon, Palette } from "lucide-react";

/**
 * PartnerHeroMascot — riusa lo stesso "agente vivo viola" della LeadsPage,
 * pensato come testata animata per le pagine Partner. Versione compatta,
 * touch-first, accessibile e adattiva per mobile.
 *
 * Props:
 *  - title: titolo principale ("Preview Custom AI")
 *  - subtitle: una riga di payoff
 *  - icon: icona lucide opzionale a sx del titolo
 *  - active: se true, mantiene l'animazione "scanning" (es. durante una generazione)
 *  - size: dimensione del mostro in px (default 120, ridotto rispetto a Leads per non rubare schermo)
 */
export default function PartnerHeroMascot({
  title,
  subtitle,
  icon: Icon = Palette,
  active = false,
  size = 120,
  mascotSrc,
  mascotAlt = "Empire AI",
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  active?: boolean;
  size?: number;
  mascotSrc?: string;
  mascotAlt?: string;
}) {
  const [hover, setHover] = useState(false);
  const energized = hover || active;

  // Particelle data-core deterministiche (stesse di Leads, semplificate per perf)
  const sphereNodes = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        size: 1.2 + ((i * 7) % 3) * 0.6,
      })),
    []
  );

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-2 pt-2 pb-4"
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      onTapStart={() => setHover(true)}
      onTap={() => setTimeout(() => setHover(false), 1400)}
    >
      {/* ═══ Mostro centrale viola con orb embedded ═══ */}
      <motion.div
        className="relative cursor-pointer select-none"
        style={{ width: size, height: size }}
        animate={{
          scale: energized ? [1, 1.05, 0.99, 1.03, 1] : [1, 1.02, 1],
          filter: energized
            ? "drop-shadow(0 0 24px rgba(167,139,250,0.95))"
            : "drop-shadow(0 0 12px rgba(167,139,250,0.45))",
        }}
        transition={{
          scale: { repeat: Infinity, duration: energized ? 1.4 : 3.2, ease: "easeInOut" },
          filter: { duration: 0.5 },
        }}
      >
        {/* Anello orbitale esterno */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: energized ? 5 : 12, ease: "linear" }}
          className="absolute inset-[-8px] rounded-full"
          style={{ border: `1.5px dashed rgba(167,139,250,${energized ? 0.7 : 0.28})` }}
        />
        {/* Anello controrotante teal */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: energized ? 7 : 18, ease: "linear" }}
          className="absolute inset-[-2px] rounded-full"
          style={{ border: `1px dotted rgba(20,184,166,${energized ? 0.55 : 0.18})` }}
        />
        {/* Pulse ring durante scan */}
        {energized && (
          <motion.div
            animate={{ scale: [1, 1.7, 1], opacity: [0.55, 0, 0.55] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
            className="absolute inset-[-12px] rounded-full"
            style={{ border: "2px solid rgba(167,139,250,0.5)" }}
          />
        )}
        {/* Aura viola morbida */}
        <motion.div
          animate={{
            opacity: energized ? [0.55, 0.85, 0.55] : [0.22, 0.34, 0.22],
            scale: energized ? [1, 1.18, 1] : [1, 1.05, 1],
          }}
          transition={{ repeat: Infinity, duration: energized ? 1 : 2.6 }}
          className="absolute inset-[-18px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(167,139,250,0.55), transparent 70%)",
            filter: "blur(18px)",
          }}
        />
        {/* Scan-line olografica */}
        {energized && (
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-20"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(20,184,166,0.32) 50%, transparent 100%)",
              mixBlendMode: "screen",
            }}
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
          />
        )}

        {/* Mascot viola al centro */}
        <motion.img
          src={empireMonkeyLaptop}
          alt="Empire AI"
          className="w-full h-full object-contain relative z-10"
          loading="eager"
          animate={{
            y: energized ? [0, -5, 2, -3, 0] : [0, -3, 0],
            rotate: energized ? [0, -3, 3, -2, 0] : [0, -1, 1, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: energized ? 1.6 : 3.4,
            ease: "easeInOut",
          }}
        />

        {/* Data-core orb top-right */}
        <motion.div
          className="absolute z-30"
          style={{ width: 44, height: 44, top: -4, right: -4, perspective: 400 }}
          animate={{
            y: [0, -3, 0, -2, 0],
            rotateY: energized ? [0, 22, -22, 0] : 0,
          }}
          transition={{
            y: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
            rotateY: { duration: 1.4, repeat: energized ? Infinity : 0 },
          }}
        >
          <motion.div
            className="absolute inset-[-5px] rounded-full"
            animate={{
              scale: energized ? [1, 1.25, 1] : [1, 1.08, 1],
              opacity: energized ? [0.45, 0.12, 0.45] : [0.18, 0.06, 0.18],
            }}
            transition={{ repeat: Infinity, duration: energized ? 0.9 : 2.5 }}
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)" }}
          />
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"
          >
            <defs>
              <radialGradient id="partnerHoloCore" cx="45%" cy="40%">
                <stop offset="0%" stopColor="rgba(167,139,250,0.4)" />
                <stop offset="50%" stopColor="rgba(139,92,246,0.14)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <filter id="partnerHoloGlow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx={50} cy={50} r={40} fill="url(#partnerHoloCore)" />
            {[16, 26, 36].map((r, i) => (
              <motion.circle
                key={`pwire-${i}`}
                cx={50}
                cy={50}
                r={r}
                fill="none"
                stroke={i === 1 ? "rgba(20,184,166,0.3)" : "rgba(139,92,246,0.25)"}
                strokeWidth={0.6}
                strokeDasharray={`${3 + i * 2} ${4 + i}`}
                animate={{
                  strokeDashoffset: [0, 100],
                  opacity: energized ? [0.7, 0.3, 0.7] : [0.25, 0.45, 0.25],
                }}
                transition={{
                  strokeDashoffset: { repeat: Infinity, duration: 8 + i * 3, ease: "linear" },
                  opacity: { repeat: Infinity, duration: 2 },
                }}
              />
            ))}
            {sphereNodes.map((n, i) => {
              const angle = (i * 137.5 * Math.PI) / 180;
              const baseR = 12 + (i % 4) * 7;
              const orbitR = energized ? baseR + 5 : baseR;
              return (
                <motion.circle
                  key={`pp-${i}`}
                  fill={i % 3 === 0 ? "#8b5cf6" : i % 3 === 1 ? "#14b8a6" : "#a78bfa"}
                  filter="url(#partnerHoloGlow)"
                  animate={{
                    cx: [
                      50 + Math.cos(angle) * orbitR,
                      50 + Math.cos(angle + 0.8) * (orbitR + (energized ? 4 : 2)),
                      50 + Math.cos(angle + 1.6) * orbitR,
                    ],
                    cy: [
                      50 + Math.sin(angle) * orbitR,
                      50 + Math.sin(angle + 0.8) * (orbitR + (energized ? 4 : 2)),
                      50 + Math.sin(angle + 1.6) * orbitR,
                    ],
                    r: energized
                      ? [n.size / 2, n.size, n.size / 2]
                      : [n.size / 2.5, n.size / 1.8, n.size / 2.5],
                    opacity: energized ? [1, 0.5, 1] : [0.3, 0.55, 0.3],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3 + (i % 4),
                    ease: "easeInOut",
                    delay: i * 0.15,
                  }}
                />
              );
            })}
            <motion.circle
              cx={50}
              cy={50}
              fill="rgba(167,139,250,0.7)"
              filter="url(#partnerHoloGlow)"
              animate={{
                r: energized ? [3, 6, 3] : [2.5, 4, 2.5],
                opacity: energized ? [1, 0.4, 1] : [0.5, 0.8, 0.5],
              }}
              transition={{ repeat: Infinity, duration: energized ? 0.6 : 2 }}
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Titolo + sottotitolo sotto al mascot */}
      <div className="flex flex-col items-center leading-tight gap-1 px-3 text-center">
        <motion.h1
          className="text-base sm:text-lg font-extrabold tracking-tight text-foreground flex items-center gap-1.5"
          animate={{
            letterSpacing: energized ? "0.05em" : "0em",
            textShadow: energized
              ? "0 0 10px rgba(167,139,250,0.55)"
              : "0 0 0 transparent",
          }}
          transition={{ duration: 0.6 }}
        >
          <Icon
            className="w-4 h-4 shrink-0"
            style={{
              color: energized ? "#a78bfa" : "#14b8a6",
              transition: "color 0.4s",
            }}
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={energized ? "live" : "idle"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              style={
                energized
                  ? {
                      background: "linear-gradient(90deg, #a78bfa, #14b8a6, #a78bfa)",
                      backgroundSize: "200% 100%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }
                  : undefined
              }
            >
              {title}
            </motion.span>
          </AnimatePresence>
        </motion.h1>
        {subtitle && (
          <p className="text-[11px] sm:text-xs text-muted-foreground max-w-md">
            {subtitle}
          </p>
        )}
      </div>
    </motion.header>
  );
}
