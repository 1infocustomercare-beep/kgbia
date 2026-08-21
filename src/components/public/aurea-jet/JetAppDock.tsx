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
      <div className="jet-dock flex w-full max-w-[420px] items-stretch gap-0.5 rounded-[22px] p-1 sm:max-w-[480px]">
        {TABS.map((t) => {
          const on = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => go(t.id)}
              aria-current={on ? "true" : undefined}
              className="relative flex min-h-[46px] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[8.5px] font-semibold uppercase tracking-[0.14em] transition-colors"
            >
              {on && (
                <motion.span
                  layoutId="jet-dock-pill"
                  className="absolute inset-0 rounded-xl border border-primary/35 bg-primary/12"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <t.icon className={`relative h-[16px] w-[16px] ${on ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`relative ${on ? "text-foreground" : "text-muted-foreground"}`}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
