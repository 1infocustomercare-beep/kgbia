const ITEMS = "Stripe Connect · AES-256 · PWA Certified · GDPR Compliant · 99.9% Uptime · 98+ Agenti IA · Made in Italy · White Label · 25+ Settori · Attivo in 24h";

export default function LandingTicker() {
  return (
    <div className="h-12 flex items-center overflow-hidden border-y border-white/[0.07]" style={{ background: "#080810" }}>
      <div className="flex whitespace-nowrap animate-[mqScroll_35s_linear_infinite]">
        {[0, 1].map((k) => (
          <span key={k} className="text-[11px] tracking-[3px] text-white/[0.12] uppercase font-semibold pr-12">
            {ITEMS} ·{" "}
          </span>
        ))}
      </div>
      <style>{`@keyframes mqScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
  );
}
