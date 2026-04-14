const ITEMS = [
  "Crittografia AES-256",
  "PWA Certified",
  "GDPR Compliant",
  "99.9% Uptime",
  "98 Agenti IA",
  "100% Made in Italy",
  "White Label",
  "25+ Settori",
  "ROI Garantito 90gg",
  "Zero Costi Nascosti",
  "Stripe Connect",
  "Fatturazione Elettronica",
];

export default function LandingTicker() {
  const text = ITEMS.join("  ·  ");
  return (
    <div className="relative h-14 flex items-center overflow-hidden" style={{ background: "linear-gradient(90deg, #0a0c1a, #0f1128, #0a0c1a)" }}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/25 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/15 to-transparent" />
      <div className="relative flex whitespace-nowrap animate-[mqScroll_50s_linear_infinite]">
        {[0, 1, 2].map((k) => (
          <span key={k} className="text-[11px] tracking-[4px] text-[#c9a84c]/40 uppercase font-bold pr-8">
            {text}  ·  
          </span>
        ))}
      </div>
      <style>{`@keyframes mqScroll{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}`}</style>
    </div>
  );
}
