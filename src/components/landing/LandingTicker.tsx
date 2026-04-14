const ITEMS = "Stripe Connect · Crittografia AES-256 · PWA Certified · GDPR Compliant · 99.9% Uptime · 98 Agenti IA Autonomi · 100% Made in Italy · White Label · 25+ Settori Verticali · Operativo in 24h · ROI Garantito 90 Giorni · Zero Costi Nascosti";

export default function LandingTicker() {
  return (
    <div className="h-11 flex items-center overflow-hidden border-y border-white/[0.05]" style={{ background: "#060610" }}>
      <div className="flex whitespace-nowrap animate-[mqScroll_40s_linear_infinite]">
        {[0, 1, 2].map((k) => (
          <span key={k} className="text-[10px] tracking-[3px] text-white/[0.1] uppercase font-semibold pr-10">
            {ITEMS} ·{" "}
          </span>
        ))}
      </div>
      <style>{`@keyframes mqScroll{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}`}</style>
    </div>
  );
}
