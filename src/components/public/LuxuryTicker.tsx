interface LuxuryTickerProps {
  items: string[];
  accentColor: string;
  bgColor?: string;
  textColor?: string;
}

export function LuxuryTicker({ items, accentColor, bgColor = "#0a0a0a", textColor = "rgba(255,255,255,0.25)" }: LuxuryTickerProps) {
  return (
    <div className="relative py-4 overflow-hidden" style={{ background: bgColor, borderTop: `1px solid ${accentColor}15`, borderBottom: `1px solid ${accentColor}15` }}>
      <div className="flex animate-marquee-scroll whitespace-nowrap">
        {[...Array(2)].map((_, repeat) => (
          <div key={repeat} className="flex items-center gap-8 sm:gap-12 px-4">
            {items.map((item, i) => (
              <span key={i} className="text-[0.6rem] tracking-[3px] uppercase flex items-center gap-2" 
                style={{ color: textColor, fontFamily: "'Space Grotesk', sans-serif" }}>
                <span className="w-1 h-1 rounded-full" style={{ background: accentColor, opacity: 0.5 }} />
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
