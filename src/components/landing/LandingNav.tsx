import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Grid3x3, Sparkles, LayoutGrid, Tag, Bot, HelpCircle, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PrestigeLangToggle } from "@/components/empire-home/prestige/PrestigeLang";
import { EmpireLogo, EmpireWordmark } from "@/lib/empire-brand";


const NAV_LINKS = [
  { label: "Settori", href: "#sectors", icon: Grid3x3, from: "#0B3B2E", to: "#1F7A5A" },
  { label: "Servizi", href: "#services", icon: Sparkles, from: "#1F7A5A", to: "#C9A24B" },
  { label: "Portfolio", href: "#portfolio", icon: LayoutGrid, from: "#C9A24B", to: "#F4D58D" },
  { label: "Prezzi", href: "#pricing", icon: Tag, from: "#B8862F", to: "#E8C36B" },
  { label: "AI Agents", href: "#agents", icon: Bot, from: "#2F80ED", to: "#56CCF2" },
  { label: "FAQ", href: "#faq", icon: HelpCircle, from: "#0B3B2E", to: "#C9A24B" },
  { label: "Contatti", href: "#contatti", icon: Mail, from: "#C9A24B", to: "#0B3B2E" },
];

export default function LandingNav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      return;
    }
    // Nav riusata fuori dalla home (es. /portfolio): l'ancora non esiste →
    // torniamo in home sulla sezione richiesta invece di non fare nulla.
    navigate(`/${href}`);
  };


  return (
    <>
      <div
        className="fixed left-0 top-0 z-[10002] h-[3px] rounded-r-full"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #0B3B2E, #C9A24B)",
        }}
      />

      <nav className={`fixed top-[3px] z-[10000] w-full transition-all duration-500 ${scrolled ? "py-2" : "py-3"}`}>
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-3 sm:px-5 lg:px-10">
          <div
            className="w-full rounded-full px-3 backdrop-blur-2xl transition-all duration-500 sm:px-5"
            style={{
              // Vetro ink neutro (non verde fangoso) con bordo oro tenue:
              // resta leggibile sopra la hero smeraldo e sopra le sezioni chiare.
              background: scrolled ? "hsl(220 22% 5% / 0.92)" : "hsl(220 22% 6% / 0.66)",
              border: "1px solid hsl(43 55% 70% / 0.18)",
              boxShadow: "0 22px 60px -32px hsl(0 0% 0% / 0.85)",
            }}
          >


            <div className="flex items-center justify-between py-2.5">
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="group/logo relative flex items-center gap-2.5 rounded-full px-2 py-1 transition-all duration-500 hover:bg-white/5"
            aria-label="Empire AI — Home"
          >
            <span className="relative">
              <span className="absolute inset-0 rounded-lg bg-[linear-gradient(45deg,#0B3B2E,#C9A24B)] opacity-40 blur-md transition-opacity duration-500 group-hover/logo:opacity-90" />
              <EmpireLogo size={36} rounded="lg" glow />
            </span>
            <EmpireWordmark size={17} className="hidden sm:inline text-base sm:text-lg" />
          </a>


          <ul className="hidden lg:flex items-center gap-3">
            {NAV_LINKS.map((l) => {
              const Icon = l.icon;
              return (
                <li
                  key={l.href}
                  style={{ ["--gf" as any]: l.from, ["--gt" as any]: l.to }}
                  className="group/pill relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04] transition-all duration-500 hover:w-[140px] hover:border-transparent"
                >
                  <button
                    onClick={() => scrollTo(l.href)}
                    className="absolute inset-0 flex items-center justify-center"
                    aria-label={l.label}
                  >
                    <span className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gf),var(--gt))] opacity-0 transition-opacity duration-500 group-hover/pill:opacity-100" />
                    <span className="pointer-events-none absolute inset-x-2 top-2 h-full rounded-full bg-[linear-gradient(45deg,var(--gf),var(--gt))] opacity-0 blur-[14px] transition-opacity duration-500 group-hover/pill:opacity-50 -z-10" />
                    {/* shrink-0 is required: the label sibling is wider than the
                        40px collapsed pill and would squeeze the icon to 0px. */}
                    <Icon className="relative z-10 h-[18px] w-[18px] shrink-0 text-foreground/80 transition-all duration-500 group-hover/pill:scale-0 group-hover/pill:opacity-0" />
                    <span className="pointer-events-none absolute inset-0 z-10 flex scale-0 items-center justify-center whitespace-nowrap text-[12px] font-semibold uppercase tracking-wide text-white opacity-0 transition-all duration-500 delay-100 group-hover/pill:scale-100 group-hover/pill:opacity-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                      {l.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:flex gap-3 items-center">
            <PrestigeLangToggle />
            <button onClick={() => navigate("/auth")} className="text-[13px] font-medium text-foreground/70 transition-colors hover:text-foreground">Accedi</button>
            <button onClick={() => scrollTo("#contatti")} className="landing-button-primary !text-black px-6 py-2.5 text-sm font-semibold">Inizia Ora</button>
          </div>


          <button className="text-foreground lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute left-3 right-3 top-full mt-2 flex max-h-[calc(100svh-96px)] flex-col gap-3 overflow-y-auto rounded-[24px] border border-border/80 bg-background/95 px-5 py-5 shadow-[0_30px_90px_-40px_hsl(0_0%_0%_/_0.92)] backdrop-blur-2xl sm:left-5 sm:right-5 lg:hidden">
            {NAV_LINKS.map((l) => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="text-left text-sm font-medium text-foreground/74 transition-colors hover:text-foreground">{l.label}</button>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <span className="text-[11px] uppercase tracking-wider text-foreground/55 font-semibold">Lingua</span>
              <PrestigeLangToggle />
            </div>
            <button onClick={() => { setMenuOpen(false); navigate("/auth"); }} className="text-left text-sm font-medium text-foreground/74 transition-colors hover:text-foreground">Accedi</button>
            <button onClick={() => { setMenuOpen(false); scrollTo("#contatti"); }} className="landing-button-primary !text-black mt-1 px-6 py-3 text-center text-sm font-semibold">Inizia Ora</button>
          </motion.div>
        )}

      </nav>
    </>
  );
}
