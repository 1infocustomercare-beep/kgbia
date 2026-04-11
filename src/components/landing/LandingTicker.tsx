const ITEMS = ["CONNECT", "AES-256", "PWA CERTIFIED", "GDPR COMPLIANT", "99.9% UPTIME", "98+ AGENTI IA", "MADE IN ITALY", "25+ SETTORI", "STRIPE CONNECT", "WHITE LABEL"];

export default function LandingTicker() {
  return (
    <div className="relative py-4 overflow-hidden" style={{ background: "hsla(230,20%,6%,1)", borderTop: "1px solid hsla(38,50%,55%,0.08)", borderBottom: "1px solid hsla(38,50%,55%,0.08)" }}>
      <div className="flex animate-marquee-scroll whitespace-nowrap">
        {[0, 1].map((rep) => (
          <div key={rep} className="flex items-center gap-8 sm:gap-12 px-4">
            {ITEMS.map((item, i) => (
              <span key={i} className="text-[0.6rem] tracking-[3px] uppercase flex items-center gap-2 text-white/20 font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <span className="w-1 h-1 rounded-full bg-accent/40" />
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
