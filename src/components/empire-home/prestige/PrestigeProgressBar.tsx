import { useEffect, useState } from "react";

/**
 * Sottile barra oro in cima alla pagina che traccia lo scroll della home.
 * Fornisce un feedback "tutto è sincronizzato" mentre l'utente scorre.
 */
export default function PrestigeProgressBar() {
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement;
      const max = (h.scrollHeight - window.innerHeight) || 1;
      setP(Math.min(1, Math.max(0, window.scrollY / max)));
    };
    const req = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    return () => {
      window.removeEventListener("scroll", req);
      window.removeEventListener("resize", req);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 right-0 top-0 z-[60]"
      style={{ height: 2 }}
    >
      <div
        style={{
          height: "100%",
          width: `${(p * 100).toFixed(2)}%`,
          background:
            "linear-gradient(90deg, hsl(var(--pr-gold-deep)), hsl(var(--pr-gold-light)) 60%, hsl(var(--pr-gold)))",
          boxShadow: "0 0 12px hsl(var(--pr-gold) / 0.7)",
          transition: "width .08s linear",
        }}
      />
    </div>
  );
}
