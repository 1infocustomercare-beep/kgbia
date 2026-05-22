import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ═══ Word-by-word scroll reveal — Lusion.co style ═══ */

interface WordRevealProps {
  text: string;
  className?: string;
  highlightWords?: string[];
  highlightClass?: string;
}

export const WordScrollReveal: React.FC<WordRevealProps> = ({
  text,
  className = "",
  highlightWords = [],
  highlightClass = "text-shimmer",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.35"],
  });

  const words = text.split(" ");
  const highlightSet = new Set(highlightWords.map((w) => w.toLowerCase()));

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <p className="flex flex-wrap gap-x-[0.3em] gap-y-[0.15em] leading-[1.15]">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = Math.min(start + 1.5 / words.length, 1);
          const isHighlight = highlightSet.has(word.replace(/[.,!?;:]/g, "").toLowerCase());

          return (
            <Word
              key={`${word}-${i}`}
              word={word}
              progress={scrollYProgress}
              start={start}
              end={end}
              isHighlight={isHighlight}
              highlightClass={highlightClass}
            />
          );
        })}
      </p>
    </div>
  );
};

const Word: React.FC<{
  word: string;
  progress: any;
  start: number;
  end: number;
  isHighlight: boolean;
  highlightClass: string;
}> = ({ word, progress, start, end, isHighlight, highlightClass }) => {
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  const y = useTransform(progress, [start, end], [8, 0]);

  return (
    <motion.span
      style={{ opacity, y }}
      className={`inline-block font-heading font-bold ${
        isHighlight ? highlightClass : "text-foreground"
      }`}
    >
      {word}
    </motion.span>
  );
};

/* ═══ Parallax scroll section ═══ */
export const ParallaxLayer: React.FC<{
  children: React.ReactNode;
  speed?: number;
  className?: string;
}> = ({ children, speed = 0.15, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, -speed * 100]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

/* ═══ Horizontal scroll-reveal stat card ═══ */
export const ScrollRevealStat: React.FC<{
  value: string;
  label: string;
  suffix?: string;
  color: string;
  index: number;
}> = ({ value, label, suffix = "", color, index }) => {
  return (
    <motion.div
      className="relative flex-shrink-0 w-[160px] sm:w-[220px] rounded-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, hsl(228 20% 14% / 0.92), hsl(232 22% 12% / 0.88))",
        border: `1px solid hsla(${color},40%,50%,0.18)`,
        boxShadow: `0 4px 30px hsla(${color},50%,40%,0.08)`,
      }}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, hsla(${color},65%,55%,0.5), transparent)`,
        }}
      />
      <div className="p-5 sm:p-6">
        <div
          className="text-[clamp(1.6rem,4vw,2.5rem)] font-heading font-black leading-none mb-1"
          style={{ color: `hsla(${color},65%,58%,1)` }}
        >
          {value}
          <span className="text-[0.5em] opacity-70">{suffix}</span>
        </div>
        <div className="text-foreground/80 text-[0.65rem] sm:text-xs tracking-wide uppercase font-medium">
          {label}
        </div>
      </div>
    </motion.div>
  );
};

export default WordScrollReveal;