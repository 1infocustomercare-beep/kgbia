/**
 * ═══ JET APP DOCK ═══
 * Barra inferiore in stile web-app di ultima generazione: tab persistenti che
 * portano ai moduli reali del sito (Flotta, Rotta, Deck, Concierge, Contatti)
 * con indicatore attivo sincronizzato allo scroll.
 * ADDITIVO — solo presentazione, nessun backend.
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe2, LayoutGrid, Plane, Sparkles, PhoneCall } from "lucide-react";

const TABS = [
  { id: "flotta", label: "Flotta", icon: Plane },
  { id: "preventivo", label: "Rotta", icon: Globe2 },
  { id: "app", label: "Deck", icon: LayoutGrid },
  { id: "servizi", label: "Servizi", icon: Sparkles },
  { id: "richiesta", label: "Contatti", icon: PhoneCall },
] as const;

export default function JetAppDock() {
  const [active, setActive] = useState<string>("flotta");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets = TABS.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    if (!targets.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit?.target.id) setActive(hit.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.6, 1] },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Navigazione applicazione"
      className={`fixed inset-x-0 bottom-0 z-[55] flex justify-center px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div className="relative w-full max-w-[420px] sm:max-w-[480px]">
        {/* alone champagne sotto il dock */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-6 -bottom-4 h-14 rounded-full opacity-70 blur-2xl"
          style={{ background: "radial-gradient(60% 100% at 50% 50%, hsl(var(--primary) / 0.22), transparent 70%)" }}
        />
        <div className="jet-dock jet-sheen relative flex items-stretch gap-0.5 overflow-hidden rounded-[26px] p-1.5">
          {/* hairline luminosa superiore */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-6 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.55), transparent)" }}
          />
          {TABS.map((t) => {
            const on = active === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => go(t.id)}
                aria-current={on ? "true" : undefined}
                className="group relative flex min-h-[50px] flex-1 flex-col items-center justify-center gap-1 rounded-[18px] px-1 text-[8.5px] font-semibold uppercase tracking-[0.16em] transition-colors"
              >
                {on && (
                  <motion.span
                    layoutId="jet-dock-pill"
                    className="absolute inset-0 rounded-[18px] border border-primary/35"
                    style={{
                      background:
                        "linear-gradient(160deg, hsl(var(--primary) / 0.24), hsl(var(--primary) / 0.06) 55%, transparent)",
                      boxShadow:
                        "inset 0 1px 0 hsl(var(--primary) / 0.35), 0 10px 26px -16px hsl(var(--primary) / 0.6)",
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <t.icon
                  strokeWidth={1.3}
                  className={`relative h-[17px] w-[17px] transition-all duration-300 ${
                    on ? "text-primary drop-shadow-[0_0_10px_hsl(var(--primary)/0.5)]" : "text-muted-foreground group-hover:text-foreground/80"
                  }`}
                />
                <span className={`relative transition-colors ${on ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/70"}`}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </nav>
  );
}
