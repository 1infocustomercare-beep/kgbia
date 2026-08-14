import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Grid3x3, Sparkles, LayoutGrid, Tag, Bot, HelpCircle, Mail, MonitorSmartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PrestigeLangToggle } from "@/components/empire-home/prestige/PrestigeLang";
import { EmpireLogo, EmpireWordmark } from "@/lib/empire-brand";


const NAV_LINKS = [
  { label: "Settori", href: "#sectors", icon: Grid3x3, from: "#1e1e5a", to: "#4f46e5" },
  { label: "Servizi", href: "#services", icon: Sparkles, from: "#4f46e5", to: "#6366f1" },
  { label: "Siti Demo", href: "/demo", icon: MonitorSmartphone, from: "#4338ca", to: "#a78bfa" },
  { label: "Portfolio", href: "#portfolio", icon: LayoutGrid, from: "#6366f1", to: "#a78bfa" },
  { label: "Prezzi", href: "#pricing", icon: Tag, from: "#4f46e5", to: "#a78bfa" },
  { label: "AI Agents", href: "#agents", icon: Bot, from: "#4338ca", to: "#818cf8" },
  { label: "FAQ", href: "#faq", icon: HelpCircle, from: "#1e1e5a", to: "#6366f1" },
  { label: "Contatti", href: "#contatti", icon: Mail, from: "#6366f1", to: "#1e1e5a" },
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
          background: "linear-gradient(90deg, #1e1e5a, #6366f1)",
        }}
      />

      <nav aria-label="Navigazione principale" className={`fixed top-[3px] z-[10000] w-full transition-all duration-500 ${scrolled ? "py-2" : "py-3"}`}>
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
            className="group/logo relative flex min-w-0 items-center gap-2 rounded-full px-1.5 py-1 transition-all duration-500 hover:bg-white/5 sm:gap-2.5 sm:px-2"
            aria-label="Empire AI — Home"
          >
            <span className="relative shrink-0">
              <span className="absolute inset-0 rounded-lg bg-[linear-gradient(45deg,#1e1e5a,#6366f1)] opacity-40 blur-md transition-opacity duration-500 group-hover/logo:opacity-90" />
              <EmpireLogo size={32} rounded="lg" glow />
            </span>
            <EmpireWordmark size={16} className="truncate text-[15px] sm:text-lg" />
          </a>



          <ul className="hidden md:flex items-center gap-3">
            {NAV_LINKS.map((l) => {
              const Icon = l.icon;
              return (
                <li
                  key={l.href}
                  style={{ ["--gf" as any]: l.from, ["--gt" as any]: l.to }}
                  className="group/pill relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04] transition-all duration-500 hover:w-[140px] hover:border-transparent focus-within:w-[140px] focus-within:ring-2 focus-within:ring-[hsl(var(--ring))] focus-within:ring-offset-2 focus-within:ring-offset-[hsl(220_22%_6%)]"
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
                    <Icon aria-hidden="true" className="relative z-10 h-[18px] w-[18px] shrink-0 text-foreground/90 transition-all duration-500 group-hover/pill:scale-0 group-hover/pill:opacity-0" />
                    <span className="pointer-events-none absolute inset-0 z-10 flex scale-0 items-center justify-center whitespace-nowrap text-[12px] font-semibold uppercase tracking-wide text-white opacity-0 transition-all duration-500 delay-100 group-hover/pill:scale-100 group-hover/pill:opacity-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                      {l.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="hidden md:flex gap-3 items-center">
            <PrestigeLangToggle />
            <button onClick={() => navigate("/auth")} className="text-[13px] font-medium text-foreground/85 transition-colors hover:text-foreground">Accedi</button>
            <button onClick={() => scrollTo("#contatti")} className="landing-button-primary !text-black px-6 py-2.5 text-sm font-semibold">Inizia Ora</button>
          </div>


          {/* Mobile/tablet: CTA compatta + hamburger (44px touch target) */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => scrollTo("#contatti")}
              className="landing-button-primary !text-black h-10 whitespace-nowrap px-4 text-[12px] font-semibold"
            >
              Inizia ora
            </button>
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[hsl(43_55%_70%/0.35)] bg-[hsl(240_32%_9%/0.9)] text-[hsl(240_20%_97%)] shadow-[0_10px_30px_-14px_hsl(0_0%_0%/0.9)]"
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
              className="fixed inset-0 z-[10040] bg-[hsl(240_44%_4%/0.72)] backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="landing-mobile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed left-3 right-3 top-[76px] z-[10050] flex max-h-[calc(100svh-110px)] flex-col gap-1 overflow-y-auto rounded-[24px] border border-[hsl(43_55%_70%/0.22)] px-4 py-4 shadow-[0_30px_90px_-30px_hsl(0_0%_0%/0.95)] sm:left-5 sm:right-5 md:hidden"
              style={{ background: "hsl(240 34% 8% / 0.98)", color: "hsl(240 20% 97%)" }}
            >
              {NAV_LINKS.map((l) => {
                const Icon = l.icon;
                return (
                  <button
                    key={l.href}
                    onClick={() => scrollTo(l.href)}
                    className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-left text-[15px] font-semibold text-[hsl(240_20%_97%)] transition-colors hover:bg-white/10"
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
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(240_20%_88%)]">Lingua</span>
                <PrestigeLangToggle />
              </div>
              <button
                onClick={() => { setMenuOpen(false); navigate("/auth"); }}
                className="mt-1 min-h-[44px] rounded-xl border border-white/15 px-3 text-left text-[15px] font-semibold text-[hsl(240_20%_97%)] transition-colors hover:bg-white/10"
              >
                Accedi
              </button>
              <button
                onClick={() => { setMenuOpen(false); scrollTo("#contatti"); }}
                className="landing-button-primary mt-2 min-h-[48px] rounded-full px-6 text-center text-sm font-bold"
              >
                Inizia Ora
              </button>
            </motion.div>
          </>
        )}

      </nav>
    </>
  );
}
