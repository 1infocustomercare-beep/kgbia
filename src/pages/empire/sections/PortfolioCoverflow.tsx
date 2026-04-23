import { useEffect, useRef, useState } from "react";
import { PORTFOLIO_ITEMS } from "../data/portfolio";

/**
 * 3D Coverflow carousel with auto-advance, dots, prev/next, touch swipe.
 * Active item: full opacity, frontal. Side items: rotateY + translateZ negative.
 */
export default function PortfolioCoverflow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % PORTFOLIO_ITEMS.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [paused]);

  const prev = () => setActive((a) => (a - 1 + PORTFOLIO_ITEMS.length) % PORTFOLIO_ITEMS.length);
  const next = () => setActive((a) => (a + 1) % PORTFOLIO_ITEMS.length);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx > 40) prev();
    else if (dx < -40) next();
    startX.current = null;
  };

  return (
    <div
      className="empire-coverflow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="empire-coverflow-stage">
        {PORTFOLIO_ITEMS.map((item, i) => {
          const offset = i - active;
          const abs = Math.abs(offset);
          const isActive = offset === 0;
          const z = -abs * 220;
          const x = offset * 220;
          const rotY = offset * -22;
          const scale = isActive ? 1 : 0.78 - abs * 0.04;
          const opacity = abs > 3 ? 0 : 1 - abs * 0.18;
          return (
            <button
              key={item.url}
              type="button"
              onClick={() => setActive(i)}
              className={`empire-coverflow-item ${isActive ? "is-active" : ""}`}
              style={{
                transform: `translate3d(${x}px, 0, ${z}px) rotateY(${rotY}deg) scale(${scale})`,
                opacity,
                pointerEvents: abs > 3 ? "none" : "auto",
                zIndex: 100 - abs,
              }}
              aria-label={`${item.name} — ${item.sector}`}
            >
              <img src={item.url} alt={item.name} loading={abs <= 1 ? "eager" : "lazy"} />
              {isActive && (
                <div className="empire-coverflow-caption">
                  <span className="sector">{item.sector}</span>
                  <span className="name">{item.name}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="empire-coverflow-controls">
        <button onClick={prev} className="empire-coverflow-arrow" aria-label="Precedente">
          ‹
        </button>
        <div className="empire-coverflow-dots">
          {PORTFOLIO_ITEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`dot ${i === active ? "is-active" : ""}`}
              aria-label={`Vai al progetto ${i + 1}`}
            />
          ))}
        </div>
        <button onClick={next} className="empire-coverflow-arrow" aria-label="Successivo">
          ›
        </button>
      </div>
    </div>
  );
}
