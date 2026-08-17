import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Menu, X, Grid3x3, Sparkles, LayoutGrid, Tag, Bot, HelpCircle, Mail, MonitorSmartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PrestigeLangToggle } from "@/components/empire-home/prestige/PrestigeLang";
import { EmpireLogo, EmpireWordmark } from "@/lib/empire-brand";


// Palette "Liquid Glass Empire": acqua/turchese, nessun accento indaco.
const NAV_LINKS = [
  { label: "Settori", href: "#sectors", icon: Grid3x3, from: "#0d6c7e", to: "#2ec4b6" },
  { label: "Servizi", href: "#services", icon: Sparkles, from: "#118a8f", to: "#4fd8c8" },
  { label: "Siti Demo", href: "/demo", icon: MonitorSmartphone, from: "#0a5f74", to: "#38bdf8" },
  { label: "Portfolio", href: "#portfolio", icon: LayoutGrid, from: "#0f7f8c", to: "#5ee7d5" },
  { label: "Prezzi", href: "#pricing", icon: Tag, from: "#0d6c7e", to: "#43cfc0" },
  { label: "AI Agents", href: "#agents", icon: Bot, from: "#0a5f74", to: "#2ec4b6" },
  { label: "FAQ", href: "#faq", icon: HelpCircle, from: "#116b7d", to: "#7fe3d6" },
  { label: "Contatti", href: "#contatti", icon: Mail, from: "#0f7f8c", to: "#2ec4b6" },
];


export default function LandingNav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  // Nav "classy": resta visibile mentre si scorre verso l'alto, si ritira
  // elegantemente quando si scende (torna con un micro-scroll su).
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      const delta = y - last;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 220);
        last = y;
      }
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (y / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    // Link di rotta (es. /demo): navighiamo, non è un'ancora della home.
    if (href.startsWith("/")) {
      navigate(href);
      return;
    }
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
        aria-hidden="true"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #0d6c7e, #2ec4b6 60%, #7fe3d6)",
          boxShadow: "0 0 18px hsl(178 74% 55% / 0.55)",
        }}
      />

      <nav
        aria-label="Navigazione principale"
        data-hidden={hidden && !menuOpen ? "true" : "false"}
        className={`fixed top-[3px] z-[10000] w-full transition-all duration-[600ms] [transition-timing-function:cubic-bezier(.22,.75,.2,1)] ${scrolled ? "py-2" : "py-3"} ${hidden && !menuOpen ? "pointer-events-none -translate-y-[130%] opacity-0" : "translate-y-0 opacity-100"}`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-3 sm:px-5 lg:px-10">
          <div
            className="empire-glass-nav w-full rounded-full px-3 backdrop-blur-2xl transition-all duration-500 sm:px-5"
            data-scrolled={scrolled ? "true" : "false"}
          >


            <div className="flex items-center justify-between py-2.5">
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="group/logo relative flex shrink-0 items-center gap-2 rounded-full px-1.5 py-1 transition-all duration-500 hover:bg-white/5 sm:gap-2.5 sm:px-2"
            aria-label="Empire AI — Home"
          >
            <span className="relative shrink-0">
              <span className="absolute inset-0 rounded-lg bg-[linear-gradient(45deg,#0d6c7e,#2ec4b6)] opacity-40 blur-md transition-opacity duration-500 group-hover/logo:opacity-90" />
              <EmpireLogo size={32} rounded="lg" glow />
            </span>
            <EmpireWordmark size={16} className="truncate text-[15px] sm:text-lg" />
          </a>



          <ul className="hidden min-w-0 items-center gap-1.5 md:flex">
            {NAV_LINKS.map((l) => {
              const Icon = l.icon;
              return (
                <li key={l.href} style={{ ["--gf" as any]: l.from, ["--gt" as any]: l.to }}>
                  <button
                    onClick={() => scrollTo(l.href)}
                    className="empire-nav-pill group/pill relative flex h-10 items-center gap-2 overflow-hidden rounded-full px-3 xl:px-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(178_74%_55%/0.7)]"
                    aria-label={l.label}
                  >
                    <span aria-hidden="true" className="empire-nav-pill-glow" />
                    <Icon aria-hidden="true" className="relative z-10 h-[16px] w-[16px] shrink-0 text-[hsl(178_70%_78%)] transition-colors duration-500 group-hover/pill:text-white" />
                    <span className="relative z-10 hidden whitespace-nowrap text-[11.5px] font-semibold uppercase tracking-[0.09em] text-foreground/85 transition-colors duration-500 group-hover/pill:text-white xl:inline">
                      {l.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <PrestigeLangToggle />
            <button onClick={() => navigate("/auth")} className="rounded-full px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-foreground/80 transition-colors hover:text-foreground">Accedi</button>
            <button onClick={() => scrollTo("#contatti")} className="landing-button-primary rounded-full px-6 py-2.5 text-[12.5px] font-semibold uppercase tracking-[0.09em]">Inizia Ora</button>
          </div>


          {/* Mobile/tablet: CTA compatta + hamburger (44px touch target) */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => scrollTo("#contatti")}
              className="landing-button-primary h-10 whitespace-nowrap rounded-full px-4 text-[11.5px] font-semibold uppercase tracking-[0.08em]"
            >
              Inizia ora
            </button>
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[hsl(178_74%_60%/0.28)] bg-[hsl(202_56%_8%/0.9)] text-[hsl(178_40%_96%)] shadow-[0_10px_30px_-14px_hsl(202_60%_3%/0.9)]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
              aria-expanded={menuOpen}
              aria-controls="landing-mobile-menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

            </div>
          </div>
        </div>

        {menuOpen && createPortal(
          <>
            {/* Scrim: chiude il menu al tap e stacca il pannello dal contenuto */}
            <div
              className="fixed inset-0 z-[9990] bg-[hsl(202_60%_3%/0.74)] backdrop-blur-md md:hidden"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="landing-mobile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed left-3 right-3 top-[76px] z-[10050] flex max-h-[calc(100svh-110px)] flex-col gap-1 overflow-y-auto rounded-[26px] border border-[hsl(178_74%_60%/0.22)] px-4 py-4 shadow-[0_30px_90px_-30px_hsl(202_60%_2%/0.95)] backdrop-blur-2xl sm:left-5 sm:right-5 md:hidden"
              style={{ background: "linear-gradient(160deg, hsl(0 0% 100% / 0.07), hsl(0 0% 100% / 0.02)), hsl(202 56% 7% / 0.94)", color: "hsl(178 30% 97%)" }}
            >
              {NAV_LINKS.map((l) => {
                const Icon = l.icon;
                return (
                  <button
                    key={l.href}
                    onClick={() => scrollTo(l.href)}
                    className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-left text-[15px] font-semibold text-[hsl(178_25%_97%)] transition-colors hover:bg-white/10"
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ background: `linear-gradient(45deg, ${l.from}, ${l.to})` }}
                    >
                      <Icon aria-hidden="true" className="h-4 w-4 text-white" />
                    </span>
                    {l.label}
                  </button>
                );
              })}
              <div className="mt-2 flex items-center justify-between border-t border-white/12 pt-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(178_30%_88%)]">Lingua</span>
                <PrestigeLangToggle />
              </div>
              <button
                onClick={() => { setMenuOpen(false); navigate("/auth"); }}
                className="mt-1 min-h-[44px] rounded-xl border border-white/15 px-3 text-left text-[15px] font-semibold text-[hsl(178_25%_97%)] transition-colors hover:bg-white/10"
              >
                Accedi
              </button>
              <button
                onClick={() => { setMenuOpen(false); scrollTo("#contatti"); }}
                className="mt-2 min-h-[48px] rounded-full px-6 text-center text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_18px_40px_-18px_rgba(46,196,182,0.85)]"
                style={{ background: "linear-gradient(135deg,#7fe3d6,#2ec4b6 55%,#0d6c7e)" }}
              >
                Inizia Ora
              </button>
            </motion.div>
          </>,
          document.body
        )}

      </nav>
    </>
  );
}
