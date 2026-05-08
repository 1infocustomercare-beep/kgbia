import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = "it" | "en";

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "it",
  setLang: () => {},
});

const KEY = "prestige_lang";

export function PrestigeLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "it";
    return ((localStorage.getItem(KEY) as Lang) || "it");
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(KEY, l); } catch {}
  };

  useEffect(() => {
    document.documentElement.dataset.prestigeLang = lang;
  }, [lang]);

  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export const usePrestigeLang = () => useContext(Ctx);

/** Tiny tagged template helper: t({ it: "...", en: "..." }) */
export function useT() {
  const { lang } = usePrestigeLang();
  return (m: { it: string; en: string }) => m[lang];
}

export function PrestigeLangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = usePrestigeLang();
  return (
    <div
      className={`inline-flex items-center rounded-full p-1 text-[11px] font-bold uppercase tracking-wider ${className}`}
      style={{
        background: "hsl(var(--pr-emerald-deep) / 0.6)",
        border: "1px solid hsl(var(--pr-gold) / 0.3)",
        backdropFilter: "blur(8px)",
      }}
    >
      {(["it", "en"] as Lang[]).map((l) => {
        const active = l === lang;
        return (
          <button
            key={l}
            onClick={() => setLang(l)}
            className="rounded-full px-2.5 py-1 transition-all"
            style={{
              background: active ? "hsl(var(--pr-gold))" : "transparent",
              color: active ? "hsl(var(--pr-emerald-deep))" : "hsl(var(--pr-gold-light))",
              minWidth: 28,
            }}
            aria-pressed={active}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
