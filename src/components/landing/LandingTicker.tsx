const ITEMS = "Stripe Connect · Crittografia AES-256 · PWA Certified · GDPR Compliant · 99.9% Uptime · 38 Agenti IA Autonomi · 100% Made in Italy · White Label · 24 Settori Verticali · Operativo in 24h · ROI Garantito 90 Giorni · Zero Costi Nascosti";

export default function LandingTicker() {
  return (
    <div className="relative h-12 flex items-center overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #050510, #080818, #050510)" }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7eb7be]/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6c3ce0]/10 to-transparent" />
      <div className="relative flex whitespace-nowrap animate-[mqScroll_40s_linear_infinite]">
        {[0, 1, 2].map((k) => (
          <span key={k} className="text-[10px] tracking-[3px] text-white/[0.15] uppercase font-semibold pr-10">
            {ITEMS} ·{" "}
          </span>
        ))}
      </div>
      <style>{`@keyframes mqScroll{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}`}</style>
    </div>
  );
}
