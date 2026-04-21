// PartnerSkeleton — sistema unificato di skeleton "premium" (shimmer + glow viola/teal)
// per le pagine venditore. Evita flash di contenuto su Leads / Portfolio / Earnings.
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Shimmer base: usa keyframes globali "partner-shimmer" se presenti, altrimenti pulse ─── */
function ShimmerBlock({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-lg", className)}
      style={{
        background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)",
        backgroundSize: "200% 100%",
        ...style,
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.10) 45%, rgba(20,184,166,0.10) 55%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPositionX: ["-200%", "200%"] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/* ─── Header skeleton (eyebrow + h2 + subtle + divider) ─── */
export function PartnerHeaderSkeleton() {
  return (
    <header className="space-y-2">
      <ShimmerBlock className="h-3 w-28" />
      <ShimmerBlock className="h-7 w-56" />
      <ShimmerBlock className="h-3 w-72 max-w-full" />
      <div className="partner-divider mt-3" />
    </header>
  );
}

/* ─── Card skeleton — usata per blocchi tipo "rank banner", "earnings card" ─── */
export function PartnerCardSkeleton({ className, lines = 3 }: { className?: string; lines?: number }) {
  return (
    <div
      className={cn("rounded-2xl p-5 space-y-3", className)}
      style={{
        background: "linear-gradient(135deg, rgba(14,16,34,0.96), rgba(19,22,42,0.96))",
        border: "1px solid rgba(167,139,250,0.18)",
        boxShadow: "0 10px 28px rgba(0,0,0,0.28)",
      }}
    >
      <div className="flex items-center gap-3">
        <ShimmerBlock className="h-10 w-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <ShimmerBlock className="h-3 w-24" />
          <ShimmerBlock className="h-5 w-40" />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <ShimmerBlock key={i} className="h-3" style={{ width: `${100 - i * 12}%` }} />
      ))}
    </div>
  );
}

/* ─── KPI grid skeleton — 4 tile coerenti con la home/earnings ─── */
export function PartnerKpiGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl p-3.5 space-y-2"
          style={{
            background: "rgba(14,16,34,0.7)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center justify-between">
            <ShimmerBlock className="h-7 w-7 rounded-lg" />
            <ShimmerBlock className="h-3 w-10 rounded-full" />
          </div>
          <ShimmerBlock className="h-6 w-16" />
          <ShimmerBlock className="h-2.5 w-20" />
        </div>
      ))}
    </div>
  );
}

/* ─── Lead row skeleton — usata in LeadsPage durante caricamento iniziale ─── */
export function PartnerLeadRowSkeleton() {
  return (
    <div
      className="rounded-xl p-3 flex items-center gap-3"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <ShimmerBlock className="h-10 w-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-1.5 min-w-0">
        <ShimmerBlock className="h-3 w-3/5" />
        <ShimmerBlock className="h-2.5 w-2/5" />
      </div>
      <ShimmerBlock className="h-6 w-12 rounded-full shrink-0" />
    </div>
  );
}

export function PartnerLeadListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <PartnerLeadRowSkeleton key={i} />
      ))}
    </div>
  );
}

/* ─── Portfolio sector card skeleton — 4 tile con preview iPhone ghost ─── */
export function PartnerPortfolioGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="p-4 flex gap-2 justify-center items-end h-[140px]"
            style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.12), rgba(10,10,20,0.9))" }}
          >
            <ShimmerBlock className="w-[55px] aspect-[9/19.5] rounded-[10px]" />
            <ShimmerBlock className="w-[70px] aspect-[9/19.5] rounded-[10px]" />
            <ShimmerBlock className="w-[55px] aspect-[9/19.5] rounded-[10px]" />
          </div>
          <div className="p-3.5 space-y-2">
            <div className="flex gap-1.5">
              <ShimmerBlock className="h-3 w-12 rounded" />
              <ShimmerBlock className="h-3 w-10 rounded" />
            </div>
            <ShimmerBlock className="h-3 w-2/3" />
            <ShimmerBlock className="h-2.5 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Loader inline (compatto) — sostituisce Loader2 negli stati intermedi ─── */
export function PartnerInlineLoader({ label }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-[11px] text-muted-foreground">
      <motion.span
        className="inline-block w-3 h-3 rounded-full"
        style={{ background: "linear-gradient(135deg, #a78bfa, #14b8a6)" }}
        animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      {label || "Caricamento…"}
    </div>
  );
}
